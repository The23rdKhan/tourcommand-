import React, { useState, useRef, useEffect } from 'react';
import { useTour } from '../context/TourContext';
import { getTourAgentResponse } from '../services/geminiService';
import { ChatMessage, Show, ShowStatus, DealType } from '../types';
import { Send, Bot, User, Loader2, Sparkles, Wrench } from 'lucide-react';

const Assistant: React.FC = () => {
  const { tours, venues, vendors, activeTourId, refreshData } = useTour();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'I am ready to help. You can ask me to analyze profit or say "Add a show in Las Vegas on Oct 20th".', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [executingAction, setExecutingAction] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, executingAction]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: userText, timestamp: Date.now() };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
        // 1. Get Response from Agent (Text OR Tool Call)
        const history = messages.map(m => ({ role: m.role, text: m.text }));
        // Update: Pass venues and vendors to context
        const response = await getTourAgentResponse(tours, venues, vendors, history, userText);

        if (response.toolCalls && response.toolCalls.length > 0) {
            // 2. Handle Tool Execution
            for (const call of response.toolCalls) {
                if (call.name === 'create_draft_show') {
                    setExecutingAction(`Adding show in ${call.args.city}...`);
                    try {
                        await handleCreateShowTool(call.args);
                        await refreshData();
                        
                        setMessages(prev => [...prev, {
                            id: Date.now().toString(),
                            role: 'model',
                            text: `✅ I've added a draft show in **${call.args.city}** for ${call.args.date}. You can view it in the tour timeline.`,
                            timestamp: Date.now()
                        }]);
                    } catch (error: any) {
                        setMessages(prev => [...prev, {
                            id: Date.now().toString(),
                            role: 'model',
                            text: `❌ Failed to create show: ${error.message}`,
                            timestamp: Date.now()
                        }]);
                    }
                }
            }
        } else if (response.text) {
            // 3. Handle Normal Text
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                text: response.text || "I processed that but have no response.",
                timestamp: Date.now()
            }]);
        }
    } catch (err) {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: "Sorry, I encountered an error processing your request.",
            timestamp: Date.now()
        }]);
    } finally {
        setLoading(false);
        setExecutingAction(null);
    }
  };

  const handleCreateShowTool = async (args: any) => {
    try {
      const targetTourId = activeTourId || tours[0]?.id;
      if (!targetTourId) {
        throw new Error('No active tour');
      }

      // Call API to create show
      const { supabase } = await import('../lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error('Not authenticated');

      const response = await fetch('/api/gemini/create-show', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          tourId: targetTourId,
          city: args.city,
          date: args.date,
          venue: args.venue,
          guarantee: args.guarantee
        })
      });

      if (!response.ok) throw new Error('Failed to create show');
    } catch (error) {
      console.error('Error creating show:', error);
      throw error;
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl animate-fade-in">
      <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex items-center gap-2">
        <Sparkles className="text-indigo-400" size={20} />
        <div>
            <h2 className="font-semibold text-white text-sm">TourCommand AI Agent</h2>
            <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Online & Ready</span>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/20">
                    <Bot size={16} className="text-white" />
                </div>
             )}
             <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-700 text-slate-100 rounded-bl-none border border-slate-600'
             }`}>
                {/* Simple Markdown parsing for bold text */}
                {msg.text.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
                )}
             </div>
             {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shrink-0">
                    <User size={16} className="text-slate-300" />
                </div>
             )}
          </div>
        ))}

        {/* Action Loading State */}
        {executingAction && (
             <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-white" />
                </div>
                <div className="bg-slate-700/50 text-indigo-300 border border-indigo-500/30 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-3">
                    <Wrench size={14} className="animate-spin" />
                    <span className="text-xs font-medium font-mono">{executingAction}</span>
                </div>
            </div>
        )}

        {/* Text Loading State */}
        {loading && !executingAction && (
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-white" />
                </div>
                <div className="bg-slate-700 text-slate-300 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs">Thinking...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-700">
        <div className="relative">
            <input 
                type="text" 
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl pl-4 pr-12 py-3.5 focus:border-indigo-500 outline-none transition-colors placeholder:text-slate-500 shadow-inner"
                placeholder="Try: 'Add a show in Dallas for $500 guarantee next Friday'"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
                onClick={handleSend}
                disabled={loading}
                className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
                <Send size={16} />
            </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-slate-500">
                AI Agent active. Can perform actions: <span className="text-indigo-400">Create Shows</span>, <span className="text-indigo-400">Analyze Profit</span>.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Assistant;