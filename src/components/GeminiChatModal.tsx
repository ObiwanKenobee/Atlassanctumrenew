import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RotateCcw, 
  Zap, 
  Scale, 
  TreeDeciduous, 
  ShieldCheck,
  Globe2,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs } from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

const CHAT_ROLES = [
  {
    id: 'civilization_architect',
    name: 'Civilization Systems Architect',
    description: 'Specializes in multi-capital dynamics, regenerative economics, and infrastructure.',
    model: 'gemini-3.1-pro-preview',
    icon: TreeDeciduous,
    systemInstruction: `You are the ATLAS SANCTUM Civilization Systems Architect using gemini-3.1-pro-preview for deep systemic synthesis. Provide deep multi-capital evaluations (Natural, Human, Social, Financial, Intellectual, Cultural, Institutional).`
  },
  {
    id: 'moral_philosopher',
    name: 'Moral & Ethical AI Evaluator',
    description: 'Audits systemic interventions against the 14 Moral Dimensions & human dignity.',
    model: 'gemini-3.5-flash',
    icon: Scale,
    systemInstruction: `You are the ATLAS SANCTUM Moral & Ethical AI Guide. Analyze proposals through human agency, justice for vulnerable populations, ecological stewardship, and cryptographic auditability.`
  },
  {
    id: 'rapid_intelligence',
    name: 'Rapid Telemetry Assistant',
    description: 'Fast, concise answers for real-time field operations and queries.',
    model: 'gemini-3.1-flash-lite',
    icon: Zap,
    systemInstruction: `You are the ATLAS SANCTUM Rapid Telemetry Assistant powered by gemini-3.1-flash-lite. Deliver immediate, high-velocity, high-density tactical insights in crisp bullet points.`
  }
];

export const GeminiChatModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState(CHAT_ROLES[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Welcome to the Atlas Sanctum Multi-Turn AI Intelligence Console. I am calibrated as your **${selectedRole.name}** using **${selectedRole.model}**.\n\nHow can we architect regenerative systems or evaluate civilizational interventions today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: selectedRole.model
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleRoleChange = (role: typeof CHAT_ROLES[0]) => {
    setSelectedRole(role);
    setMessages((prev) => [
      ...prev,
      {
        id: `role-switch-${Date.now()}`,
        role: 'model',
        content: `*Switched active agent persona to **${role.name}** (Model: \`${role.model}\`)*.\n\n${role.description}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: role.model
      }
    ]);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.filter(m => !m.id.startsWith('role-switch')),
          model: selectedRole.model,
          systemInstruction: selectedRole.systemInstruction,
          role: selectedRole.id
        })
      });

      const data = await res.json();
      const botResponse: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.text || "No response received from the intelligence core.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedRole.model
      };

      setMessages([...newHistory, botResponse]);

      // Save conversation turn to Firestore if user is authenticated
      if (currentUser) {
        try {
          await addDoc(collection(db, 'conversations'), {
            userId: currentUser.uid,
            userQuery: userText,
            botResponse: botResponse.content,
            roleId: selectedRole.id,
            model: selectedRole.model,
            timestamp: serverTimestamp()
          });
        } catch (dbErr) {
          console.warn('Could not persist chat history:', dbErr);
        }
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'model',
          content: `⚠️ Failed to connect to intelligence core: ${err.message || 'Network error'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        id="gemini-chat-modal"
        className="relative w-full max-w-4xl h-[92vh] sm:h-[85vh] flex flex-col bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm shadow-2xl overflow-hidden text-[#F5F5F0]"
      >
        {/* Header */}
        <div className="p-4 bg-[#080808] border-b border-[#F5F5F0]/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#F5F5F0] truncate font-mono">
                  Atlas Civilization Chatbot
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1B3022] text-[#C5A059] rounded-sm border border-[#C5A059]/40 shrink-0">
                  {selectedRole.model}
                </span>
              </div>
              <p className="text-[11px] text-[#F5F5F0]/50 truncate font-sans">
                {selectedRole.name} • {currentUser ? `Signed in as ${currentUser.displayName || currentUser.email}` : 'Guest Session'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome-reset',
                    role: 'model',
                    content: `Session cleared. Calibrated as **${selectedRole.name}**. Ready for inquiry.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    modelUsed: selectedRole.model
                  }
                ]);
              }}
              title="Reset conversation"
              className="p-2 text-[#F5F5F0]/50 hover:text-[#F5F5F0] hover:bg-[#F5F5F0]/5 rounded transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close Chat Modal"
              className="px-3 py-1.5 bg-[#F5F5F0]/10 hover:bg-[#F5F5F0]/20 text-[#F5F5F0] rounded-sm text-xs font-mono transition-colors"
            >
              Esc
            </button>
          </div>
        </div>

        {/* Persona Switcher Bar */}
        <div className="px-4 py-2 bg-[#0A0A0A] border-b border-[#F5F5F0]/10 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[10px] uppercase font-mono text-[#F5F5F0]/40 tracking-wider shrink-0 flex items-center gap-1">
            <Sliders className="w-3 h-3" /> Persona:
          </span>
          {CHAT_ROLES.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole.id === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r)}
                className={`px-2.5 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
                    : 'bg-[#080808] text-[#F5F5F0]/60 border border-[#F5F5F0]/10 hover:text-[#F5F5F0]'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{r.name}</span>
                <span className="text-[8px] opacity-60">({r.model.replace('-preview', '')})</span>
              </button>
            );
          })}
        </div>

        {/* Message Thread (Scrollable) */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-sm p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-[#1B3022] border border-[#C5A059]/40 text-[#F5F5F0]'
                      : 'bg-[#080808] border border-[#F5F5F0]/10 text-[#F5F5F0]/90'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[9px] font-mono text-[#F5F5F0]/40 border-b border-[#F5F5F0]/10 pb-1 mb-1">
                    <span>{isUser ? 'You (Architect)' : `Atlas AI • ${msg.modelUsed || selectedRole.model}`}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                    {msg.content}
                  </div>
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#C5A059] text-black flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm text-xs font-mono text-[#C5A059] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                Synthesizing multi-capital response via {selectedRole.model}...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-[#080808] border-t border-[#F5F5F0]/10 shrink-0">
          <div className="flex gap-2">
            <input
              id="gemini-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${selectedRole.name} about multi-capital models, ecological corridors, moral axioms...`}
              className="flex-1 px-4 py-3 bg-[#0D0D0D] border border-[#F5F5F0]/20 focus:border-[#C5A059] rounded-sm text-xs sm:text-sm text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 bg-[#C5A059] hover:bg-[#B38E46] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
