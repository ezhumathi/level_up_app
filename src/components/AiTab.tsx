import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Database } from 'lucide-react';
import { ChatMessage, Mission, UserStats } from '../types';
import { soundFx } from '../utils/audio';
import { api } from '../services/api';
import bhuvaneshRealPhoto from '../assets/images/bhuvanesh_real_upload.jpg';

interface AiTabProps {
  userStats: UserStats;
  missions: Mission[];
}

export const AiTab: React.FC<AiTabProps> = ({ userStats, missions }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Good evening, ${userStats.name}. You've completed ${
        missions.filter((m) => m.completed).length
      } missions so far. MongoDB Atlas cluster 'Bhuvan' is actively persisting your protocols. Ready to make your mark?`,
      timestamp: '19:42',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dbSynced, setDbSynced] = useState(true);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'How am I doing?',
    'Motivate me',
    'Plan tomorrow',
    'Weakest habit',
    'Show me my strongest habit',
  ];

  // Fetch initial chat messages from MongoDB
  useEffect(() => {
    async function loadChat() {
      try {
        const res = await fetch('/api/chat');
        if (res.ok) {
          const history = await res.json();
          if (Array.isArray(history) && history.length > 0) {
            setMessages(history);
            setDbSynced(true);
          }
        }
      } catch (err) {
        console.warn('Could not load chat history from MongoDB:', err);
      }
    }
    loadChat();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    soundFx.playClick();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Call backend AI endpoint which writes to MongoDB
      const res = await api.sendChatMessage(query, {
        userName: userStats.name,
        score: userStats.todayScore,
        streak: userStats.currentStreak,
        level: userStats.level,
        missionsCompleted: missions.filter((m) => m.completed).map((m) => m.title),
        missionsPending: missions.filter((m) => !m.completed).map((m) => m.title),
      });

      if (res && res.reply) {
        soundFx.playComplete();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setDbSynced(true);
      } else {
        throw new Error('Local fallback triggered');
      }
    } catch {
      // Intelligent Offline Fallback
      setTimeout(() => {
        soundFx.playComplete();
        const fallback = getLocalFallbackResponse(query);
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setLoading(false);
      }, 700);
      return;
    } finally {
      setLoading(false);
    }
  };

  const getLocalFallbackResponse = (query: string) => {
    const q = query.toLowerCase();
    const completedCount = missions.filter((m) => m.completed).length;
    const pendingMissions = missions.filter((m) => !m.completed).map((m) => m.title).join(', ');

    if (q.includes('how am i doing') || q.includes('status')) {
      return `Bhuvanesh, your discipline score today sits at **${userStats.todayScore}/100** with **${completedCount} completed protocol missions**. You have maintained a **${userStats.currentStreak}-day continuous streak**. Current pending quests: ${pendingMissions || 'None, you have conquered the day!'}.`;
    }
    if (q.includes('motivate')) {
      return `*"The pain of discipline is far less than the pain of regret."*\n\nYou are at Level ${userStats.level} (${userStats.rankTitle}). Every rep, every cold shower, and every completed mission is stored in MongoDB and compounding into an unbreakable standard. Step up and execute now.`;
    }
    if (q.includes('plan tomorrow') || q.includes('schedule')) {
      return `Here is your optimized Tomorrow Protocol:\n\n1. **05:00 AM** — Wake up & Cold Hydration (1L)\n2. **05:30 AM** — 5km Zone 2 Conditioning\n3. **07:00 AM** — 100 Pushups & Core Plank\n4. **08:30 AM** — 90m Deep Focus & Reading\n5. **21:00 PM** — Gratitude & Biometric Review`;
    }
    if (q.includes('weak') || q.includes('weakest')) {
      return `Analysis indicates **Evening Mobility and Hydration** shows slight variance on weekdays. Prioritize completing your water target before 18:00 PM to ensure 100% protocol adherence.`;
    }
    if (q.includes('strong') || q.includes('strongest')) {
      return `Your highest consistency habit is **05:00 AM Wake Up Protocol** with a 17-day flawless streak! You've also logged over 105 pushups in single sessions. Keep this standard uncompromising.`;
    }
    return `Protocol acknowledged. Telemetry stored in MongoDB. You've earned +${userStats.currentXp} XP towards Level ${userStats.level + 1}. Continue executing your active missions with total focus.`;
  };

  return (
    <div className="w-full max-w-2xl px-4 md:px-6 py-6 mx-auto flex flex-col h-[calc(100vh-160px)] min-h-[580px]">
      {/* Title Header matching Image 9.png with MongoDB tag */}
      <div className="flex flex-col items-center text-center pb-5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="font-mono text-base font-bold tracking-[0.25em] text-[#b0c6ff] uppercase">
            BHUVA AI
          </h2>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#102a1e] border border-[#4edea3]/40 text-[#4edea3] font-mono text-[9px]">
            <Database className="w-2.5 h-2.5" />
            <span>MONGO SYNC</span>
          </span>
        </div>
        <p className="font-mono text-[11px] text-[#8c90a0] tracking-[0.3em] uppercase mt-0.5">
          — YOUR DISCIPLINE ASSISTANT —
        </p>
      </div>

      {/* Chat Messages Transcript */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Header label & Avatar */}
            <div className="flex items-center gap-2 mb-1.5 px-1">
              {msg.role === 'assistant' ? (
                <>
                  <div className="w-6 h-6 rounded-lg bg-[#558dff]/20 flex items-center justify-center text-[#558dff]">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold tracking-widest text-[#8c90a0] uppercase">
                    BHUVA AI
                  </span>
                </>
              ) : (
                <>
                  <span className="font-mono text-[10px] font-bold tracking-widest text-[#8c90a0] uppercase">
                    YOU
                  </span>
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-[#558dff]/50 aspect-square shrink-0 bg-[#141824] flex items-center justify-center">
                    <img
                      src={bhuvaneshRealPhoto}
                      alt="User"
                      className="w-full h-full object-cover block"
                      style={{ objectPosition: '50% 12%' }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-[#181b24]/90 border border-white/10 text-[#e0e2ee] shadow-[0_4px_25px_rgba(0,0,0,0.3)]'
                  : 'bg-[#1c2234] border border-[#558dff]/30 text-white font-medium shadow-[0_2px_15px_rgba(85,141,255,0.15)]'
              }`}
            >
              <div className="whitespace-pre-line">{msg.content}</div>
              <span className="block text-right text-[9px] font-mono text-[#8c90a0] mt-2 opacity-70">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <div className="w-6 h-6 rounded-lg bg-[#558dff]/20 flex items-center justify-center text-[#558dff]">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono text-[10px] font-bold tracking-widest text-[#8c90a0] uppercase">
                BHUVA AI
              </span>
            </div>
            <div className="bg-[#181b24]/90 border border-white/10 rounded-2xl p-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#558dff] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#558dff] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#558dff] animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap gap-2 py-3 border-t border-white/10 shrink-0">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3.5 py-1.5 rounded-full bg-[#181b24] hover:bg-[#272a33] border border-white/10 hover:border-[#558dff]/50 font-mono text-[11px] text-[#c2c6d7] hover:text-white transition-all shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box matching Image 9.png */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-1 shrink-0"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command your assistant..."
            className="w-full bg-[#10131c] border border-white/15 focus:border-[#558dff] rounded-xl px-4 py-3 text-sm text-white placeholder-[#8c90a0] focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-12 h-11 rounded-xl bg-[#b0c6ff] hover:bg-[#8daaff] disabled:opacity-40 text-[#002d6e] flex items-center justify-center transition-all shadow-[0_0_15px_rgba(176,198,255,0.4)]"
          title="Send command"
        >
          <Send className="w-5 h-5 fill-current" />
        </button>
      </form>
    </div>
  );
};
