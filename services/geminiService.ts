import { supabase } from '../lib/supabase';
import type { Tour, Venue, Vendor } from '../types';

export interface AgentResponse {
  text?: string;
  toolCalls?: any[];
}

export const getTourAgentResponse = async (
  tours: Tour[],
  venues: Venue[],
  vendors: Vendor[],
  history: {role: string, text: string}[], 
  userMessage: string
): Promise<AgentResponse> => {
  try {
    // Get auth token for API call
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        message: userMessage,
        history
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    return data.data;

  } catch (error) {
    console.error("Gemini Agent Error:", error);
    return { text: "I'm having trouble connecting to the agent network. Please try again." };
  }
};