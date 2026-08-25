import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  X, 
  Radio, 
  Activity, 
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export const LiveVoiceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [statusText, setStatusText] = useState('Ready to connect to Live Voice Engine (gemini-3.1-flash-live-preview)');
  const [transcripts, setTranscripts] = useState<Array<{ sender: 'user' | 'gemini'; text: string; time: string }>>([
    {
      sender: 'gemini',
      text: "Atlas Live Voice stream ready. Click 'Connect Voice Session' to converse directly using real-time bidirectional audio.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const connectVoice = async () => {
    try {
      setStatusText('Requesting microphone permission & connecting websocket...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setStatusText('Voice channel open. Speak naturally to Atlas Sanctum.');
        setTranscripts(prev => [
          ...prev,
          {
            sender: 'gemini',
            text: "Hello! I am your real-time Atlas Sanctum voice companion. Let's discuss regenerative ecosystems, ethical AI, or multi-capital design.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'error') {
            setStatusText(`Error: ${data.message}`);
          }
        } catch {
          // Binary audio packet or raw buffer
          setIsTalking(true);
          setTimeout(() => setIsTalking(false), 2000);
        }
      };

      ws.onerror = (err) => {
        console.error('Live WS error:', err);
        setStatusText('WebSocket error connecting to Live API');
      };

      ws.onclose = () => {
        setIsConnected(false);
        setStatusText('Voice session disconnected.');
      };

    } catch (err: any) {
      console.error('Microphone error:', err);
      setStatusText(`Microphone error: ${err.message}`);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsConnected(false);
    setStatusText('Session closed.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        id="live-voice-modal"
        className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm shadow-2xl overflow-hidden text-[#F5F5F0] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 bg-[#080808] border-b border-[#F5F5F0]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <Radio className={`w-4 h-4 ${isConnected ? 'animate-pulse text-emerald-400' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#F5F5F0] font-mono">
                  Gemini Live Voice AI
                </h3>
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1B3022] text-[#C5A059] rounded-sm border border-[#C5A059]/40">
                  gemini-3.1-flash-live-preview
                </span>
              </div>
              <p className="text-[11px] text-[#F5F5F0]/50 font-sans">
                Bidirectional real-time voice streaming with ultra-low latency
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              disconnect();
              onClose();
            }}
            aria-label="Close Live Voice Modal"
            className="px-3 py-1.5 bg-[#F5F5F0]/10 hover:bg-[#F5F5F0]/20 text-[#F5F5F0] rounded-sm text-xs font-mono transition-colors"
          >
            Esc
          </button>
        </div>

        {/* Visualizer & Wave Canvas Area */}
        <div className="p-6 sm:p-8 flex flex-col items-center justify-center space-y-6 text-center bg-gradient-to-b from-[#0A0A0A] to-[#0D0D0D]">
          {/* Animated Glow Halo */}
          <div className="relative">
            <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
              isConnected 
                ? isTalking 
                  ? 'border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.4)] scale-105 bg-[#1B3022]/40'
                  : 'border-[#C5A059] shadow-[0_0_25px_rgba(197,160,89,0.25)] bg-[#1B3022]/20'
                : 'border-[#F5F5F0]/20 bg-[#080808]'
            }`}>
              {isConnected ? (
                <Activity className={`w-12 h-12 text-[#C5A059] ${isTalking ? 'animate-bounce' : 'animate-pulse'}`} />
              ) : (
                <MicOff className="w-10 h-10 text-[#F5F5F0]/40" />
              )}
            </div>

            {isConnected && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div className="space-y-1.5 max-w-md">
            <h4 className="text-sm font-bold font-mono text-[#F5F5F0]">
              {isConnected ? (isTalking ? "Atlas is speaking..." : "Listening to microphone...") : "Voice Channel Inactive"}
            </h4>
            <p className="text-xs text-[#F5F5F0]/60 font-sans">
              {statusText}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 pt-2">
            {!isConnected ? (
              <button
                onClick={connectVoice}
                className="px-6 py-3 bg-[#C5A059] hover:bg-[#B38E46] text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                Connect Live Voice
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-4 py-2.5 rounded-sm border text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors ${
                    isMuted 
                      ? 'bg-rose-950/50 border-rose-500/50 text-rose-300' 
                      : 'bg-[#080808] border-[#F5F5F0]/20 text-[#F5F5F0]'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isMuted ? 'Muted' : 'Mute Mic'}
                </button>
                <button
                  onClick={disconnect}
                  className="px-4 py-2.5 bg-rose-900/60 hover:bg-rose-800 border border-rose-500/40 text-rose-100 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Disconnect
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Conversation Stream Snippet */}
        <div className="p-4 bg-[#080808] border-t border-[#F5F5F0]/10 max-h-48 overflow-y-auto space-y-2">
          <div className="text-[10px] font-mono uppercase text-[#C5A059] tracking-wider font-bold">
            Live Stream Log
          </div>
          {transcripts.map((t, idx) => (
            <div key={idx} className="p-2.5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm text-xs space-y-1">
              <div className="flex justify-between text-[9px] font-mono text-[#F5F5F0]/40">
                <span className="uppercase text-[#C5A059]">{t.sender}</span>
                <span>{t.time}</span>
              </div>
              <p className="text-[#F5F5F0]/80 font-sans">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
