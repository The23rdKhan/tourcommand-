import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { authenticateRequest, handleApiError, sendResponse } from '../_helpers';
import { createServerClient } from '../../lib/supabase-server';
import type { Tour, Venue, Vendor } from '../../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Define the tool for creating shows
const createShowTool = {
  name: 'create_draft_show',
  description: 'Create a new draft show in the itinerary. Use this when the user explicitly asks to add, book, or schedule a show.',
  parameters: {
    type: 'object',
    properties: {
      city: {
        type: 'string',
        description: 'The city and state/country of the show (e.g., "Las Vegas, NV").',
      },
      date: {
        type: 'string',
        description: 'The date of the show in YYYY-MM-DD format. If the user says "next Friday", calculate the date relative to today.',
      },
      venue: {
        type: 'string',
        description: 'The name of the venue if provided. Defaults to "TBD Venue".',
      },
      guarantee: {
        type: 'number',
        description: 'The guarantee amount in dollars if provided.',
      }
    },
    required: ['city', 'date'],
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { supabase, userId } = await authenticateRequest(req);

    if (req.method !== 'POST') {
      res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
      return;
    }

    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      throw new Error('Message is required');
    }

    // Fetch user's data for context
    const { data: tours } = await supabase
      .from('tours')
      .select('id, name, artist, shows(id, city, date, status)')
      .eq('user_id', userId)
      .limit(10);

    const { data: venues } = await supabase
      .from('venues')
      .select('name, city, capacity')
      .eq('user_id', userId)
      .limit(50);

    const { data: vendors } = await supabase
      .from('vendors')
      .select('name, role, city')
      .eq('user_id', userId);

    const tourContext = JSON.stringify((tours || []).map(t => ({
      id: t.id,
      name: t.name,
      shows: (t.shows || []).map((s: any) => ({ city: s.city, date: s.date, status: s.status }))
    })), null, 2);

    const venueContext = JSON.stringify((venues || []).map(v => ({
      name: v.name,
      city: v.city,
      capacity: v.capacity
    })), null, 2);

    const vendorContext = JSON.stringify((vendors || []).map(v => ({
      name: v.name,
      role: v.role,
      city: v.city
    })), null, 2);

    const systemInstruction = `
      You are "TourCommand AI", an agentic assistant for tour managers.
      
      Current Tour Data:
      ${tourContext}

      Known Venues Database:
      ${venueContext}

      Known Vendors/Crew:
      ${vendorContext}

      TODAY'S DATE: ${new Date().toISOString().split('T')[0]}

      CAPABILITIES:
      1. Analyze tour data (profit, routing, gaps).
      2. EXECUTE ACTIONS: If the user asks to "add a show", "book a date", or "put [City] on the calendar", you MUST use the 'create_draft_show' tool.
      3. Suggest Venues: If the user asks for a venue in a city, check the Known Venues Database first.
      
      RULES:
      - Be concise.
      - If you use a tool, do not write a text response yet. Wait for the tool result.
      - If the user asks a question, answer it based on the data.
    `;

    const formattedHistory = history.map((h: any) => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash-preview-09-2025',
      config: {
        systemInstruction: systemInstruction,
        tools: [{ functionDeclarations: [createShowTool] }],
      },
      history: formattedHistory
    });

    const result = await chat.sendMessage({ message });
    
    const functionCalls = result.candidates?.[0]?.content?.parts?.filter((p: any) => p.functionCall)?.map((p: any) => p.functionCall);

    if (functionCalls && functionCalls.length > 0) {
      sendResponse(res, { toolCalls: functionCalls });
    } else {
      sendResponse(res, { text: result.text });
    }

  } catch (error) {
    handleApiError(error, res);
  }
}

