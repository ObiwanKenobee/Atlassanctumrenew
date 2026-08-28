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
  Info,
  Search,
  ArrowRight,
  AlertCircle,
  Command
} from 'lucide-react';
import { audioFeedback } from '../lib/audioFeedback';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerCommandCenterSearch?: (query: string) => void;
}

const VOICE_COMMAND_PRESETS = [
  "Analyze Nairobi Mathare River Basin",
  "Search ecological restoration indicators",
  "Find regenerative agroforestry opportunities",
  "Compare interventions in Decision Room",
  "Inspect IoT sensor mesh & Merkle proofs"
];

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({ 
  isOpen, 
  onClose,
  onTriggerCommandCenterSearch 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [micPermissionState, setMicPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [statusText, setStatusText] = useState('Microphone ready. Connect to activate voice commands and live streaming.');
  const [recognizedVoiceText, setRecognizedVoiceText] = useState<string>('');
  const [lastDetectedCommand, setLastDetectedCommand] = useState<string | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(16).fill(0.15));

  const [transcripts, setTranscripts] = useState<Array<{ sender: 'user' | 'gemini' | 'system'; text: string; time: string }>>([
    {
      sender: 'gemini',
      text: "Atlas Live Voice stream ready. Connect your microphone to speak commands or query the planetary knowledge graph.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  // Connect microphone, audio analyser, and speech recognition
  const connectVoice = async () => {
    try {
      setMicPermissionState('requesting');
      setStatusText('Requesting browser microphone permission...');
      audioFeedback.playMicroTick();

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      mediaStreamRef.current = stream;
      setMicPermissionState('granted');

      // 1. Initialize Web Audio API Analyser for live frequency visualization
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const updateAudioMeter = () => {
            if (!analyserRef.current) return;
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);

            // Sample 16 frequency bands
            const bands: number[] = [];
            const step = Math.floor(dataArray.length / 16) || 1;
            for (let i = 0; i < 16; i++) {
              const val = dataArray[i * step] || 0;
              bands.push(Math.max(0.1, val / 255));
            }
            setAudioLevels(bands);
            animationFrameRef.current = requestAnimationFrame(updateAudioMeter);
          };

          animationFrameRef.current = requestAnimationFrame(updateAudioMeter);
        }
      } catch (audioErr) {
        console.warn('Web Audio meter initialization failed:', audioErr);
      }

      // 2. Initialize Speech Recognition for Voice Commands
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }

          if (currentTranscript.trim()) {
            setRecognizedVoiceText(currentTranscript);

            // Clean up voice command prefixes (e.g. "search for", "find", "analyze", "command center")
            let extractedCommand = currentTranscript.trim();
            const lower = extractedCommand.toLowerCase();
            if (lower.startsWith('search for ')) extractedCommand = extractedCommand.slice(11);
            else if (lower.startsWith('search ')) extractedCommand = extractedCommand.slice(7);
            else if (lower.startsWith('find ')) extractedCommand = extractedCommand.slice(5);
            else if (lower.startsWith('analyze ')) extractedCommand = extractedCommand.slice(8);
            else if (lower.startsWith('query ')) extractedCommand = extractedCommand.slice(6);
            else if (lower.startsWith('command center ')) extractedCommand = extractedCommand.slice(15);

            setLastDetectedCommand(extractedCommand);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition status:', e.error);
        };

        recognition.onend = () => {
          // Restart recognition if still connected and not muted
          if (isConnected && mediaStreamRef.current && !isMuted) {
            try {
              recognition.start();
            } catch {
              // Ignore restart error
            }
          }
        };

        try {
          recognition.start();
          recognitionRef.current = recognition;
        } catch (e) {
          console.warn('Could not auto-start speech recognition:', e);
        }
      }

      // 3. Connect WebSocket for Gemini Live Voice if available
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/live`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          setStatusText('Microphone & voice channel active. Speak your command or query.');
          setTranscripts(prev => [
            ...prev,
            {
              sender: 'gemini',
              text: "Microphone active. Speak a voice command like 'Search ecological restoration' to trigger the Command Center.",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'error') {
              setStatusText(`Live Voice Info: ${data.message}`);
            }
          } catch {
            setIsTalking(true);
            setTimeout(() => setIsTalking(false), 2000);
          }
        };

        ws.onerror = () => {
          // Soft failure for websocket; microphone & local voice commands still operate!
          setIsConnected(true);
          setStatusText('Microphone active. Listening for voice search commands.');
        };

        ws.onclose = () => {
          // Maintain local recognition if stream is active
        };
      } catch (wsErr) {
        setIsConnected(true);
        setStatusText('Microphone active. Voice commands ready.');
      }

      setIsConnected(true);
      setStatusText('Microphone active. Listening for voice search commands.');

    } catch (err: any) {
      console.error('Microphone error:', err);
      setMicPermissionState('denied');
      setStatusText(`Microphone permission denied or unavailable: ${err.message}. Check browser settings.`);
    }
  };

  const disconnect = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsConnected(false);
    setMicPermissionState('idle');
    setStatusText('Session closed.');
    setAudioLevels(new Array(16).fill(0.15));
  };

  // Trigger Command Center Search with spoken voice command
  const triggerCommandCenter = (query: string) => {
    if (!query.trim()) return;
    audioFeedback.playSyncComplete();

    // Log the action into transcripts
    setTranscripts(prev => [
      ...prev,
      {
        sender: 'user',
        text: `Voice Command: "${query}"`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        sender: 'system',
        text: `Triggering Command Center search for: "${query}"...`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    // Dispatch global event for App.tsx and CommandCenterModal.tsx
    window.dispatchEvent(new CustomEvent('trigger-voice-command-search', {
      detail: { query: query.trim() }
    }));

    if (onTriggerCommandCenterSearch) {
      onTriggerCommandCenterSearch(query.trim());
    }

    // Close the live voice modal so the Command Center view is unobstructed
    setTimeout(() => {
      disconnect();
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        id="live-voice-modal"
        className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm shadow-2xl overflow-hidden text-[#F5F5F0] flex flex-col max-h-[90vh]"
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
                  Live Voice Assistant & Voice Commands
                </h3>
                <span className={`px-2 py-0.5 text-[9px] font-mono uppercase rounded-sm border ${
                  isConnected 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                    : 'bg-[#1B3022] text-[#C5A059] border-[#C5A059]/40'
                }`}>
                  {isConnected ? 'Microphone Active' : 'Standby'}
                </span>
              </div>
              <p className="text-[11px] text-[#F5F5F0]/50 font-sans">
                Issue voice commands to trigger Command Center search and queries
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              disconnect();
              onClose();
            }}
            aria-label="Close Live Voice Modal"
            className="px-3 py-1.5 bg-[#F5F5F0]/10 hover:bg-[#F5F5F0]/20 text-[#F5F5F0] rounded-sm text-xs font-mono transition-colors cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Visualizer & Microphone Waveform Canvas Area */}
        <div className="p-6 flex flex-col items-center justify-center space-y-5 text-center bg-gradient-to-b from-[#0A0A0A] to-[#0D0D0D]">
          {/* Animated Central Halo */}
          <div className="relative">
            <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              isConnected 
                ? 'border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.4)] scale-105 bg-[#1B3022]/40'
                : 'border-[#F5F5F0]/20 bg-[#080808]'
            }`}>
              {isConnected ? (
                <Mic className="w-10 h-10 text-emerald-400 animate-pulse" />
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

          {/* Real-time Frequency Spectrum Visualizer */}
          {isConnected && (
            <div className="w-full max-w-xs flex items-end justify-center gap-1.5 h-12 px-4 py-1 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm">
              {audioLevels.map((level, i) => (
                <div
                  key={i}
                  style={{ height: `${Math.max(12, level * 100)}%` }}
                  className={`w-2 rounded-t-xs transition-all duration-75 ${
                    level > 0.4 ? 'bg-emerald-400 shadow-[0_0_6px_#10B981]' : 'bg-[#C5A059]'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Status & Speech Output */}
          <div className="space-y-1 max-w-lg px-2">
            <h4 className="text-xs sm:text-sm font-bold font-mono text-[#F5F5F0]">
              {isConnected ? "Listening for Voice Commands..." : "Browser Microphone Inactive"}
            </h4>
            <p className="text-xs text-[#F5F5F0]/60 font-sans">
              {statusText}
            </p>
          </div>

          {/* Live Recognized Speech Transcript Box */}
          {recognizedVoiceText && (
            <div className="w-full max-w-lg p-3 bg-[#141414] border border-[#C5A059]/50 rounded-sm text-left space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#C5A059]">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  Live Spoken Query Detected
                </span>
                <span className="text-[#F5F5F0]/50 font-sans">Click below to search</span>
              </div>
              <p className="text-sm font-serif italic text-[#F5F5F0]">
                "{recognizedVoiceText}"
              </p>

              {lastDetectedCommand && (
                <button
                  id="execute-voice-command-btn"
                  onClick={() => triggerCommandCenter(lastDetectedCommand)}
                  className="w-full py-2 px-3 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search in Command Center: "{lastDetectedCommand}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Primary Connection Controls */}
          <div className="flex items-center gap-3 pt-1">
            {!isConnected ? (
              <button
                id="connect-mic-voice-btn"
                onClick={connectVoice}
                className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#B38E46] text-black font-mono font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Enable Microphone & Voice Commands</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-4 py-2 rounded-sm border text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
                    isMuted 
                      ? 'bg-rose-950/50 border-rose-500/50 text-rose-300' 
                      : 'bg-[#080808] border-[#F5F5F0]/20 text-[#F5F5F0]'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isMuted ? 'Mic Muted' : 'Mute Mic'}</span>
                </button>

                <button
                  onClick={disconnect}
                  className="px-4 py-2 bg-rose-900/60 hover:bg-rose-800 border border-rose-500/40 text-rose-100 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Preset Voice Command Shortcuts */}
        <div className="p-4 bg-[#0A0A0A] border-t border-[#F5F5F0]/10 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#C5A059] tracking-wider font-bold">
            <span className="flex items-center gap-1.5">
              <Command className="w-3 h-3 text-[#C5A059]" />
              Voice Command Quick Shortcuts (Click or Speak)
            </span>
            <span className="text-[#F5F5F0]/40">Triggers ⌘K Search</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {VOICE_COMMAND_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  triggerCommandCenter(preset);
                }}
                className="px-2.5 py-1 text-xs font-mono bg-[#141414] hover:bg-[#1C1C1C] text-[#F5F5F0]/80 hover:text-[#C5A059] border border-[#F5F5F0]/15 hover:border-[#C5A059]/50 rounded-xs flex items-center gap-1.5 transition-all text-left cursor-pointer"
              >
                <Search className="w-3 h-3 text-[#C5A059] shrink-0" />
                <span className="truncate max-w-[240px] sm:max-w-xs">{preset}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Conversation Stream Snippet */}
        <div className="p-4 bg-[#080808] border-t border-[#F5F5F0]/10 max-h-36 overflow-y-auto space-y-2">
          <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/40 tracking-wider font-bold">
            Voice Activity Log
          </div>
          {transcripts.map((t, idx) => (
            <div key={idx} className="p-2 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm text-xs space-y-0.5">
              <div className="flex justify-between text-[9px] font-mono text-[#F5F5F0]/40">
                <span className={`uppercase font-bold ${
                  t.sender === 'user' ? 'text-emerald-400' : t.sender === 'gemini' ? 'text-[#C5A059]' : 'text-cyan-400'
                }`}>
                  {t.sender}
                </span>
                <span>{t.time}</span>
              </div>
              <p className="text-[#F5F5F0]/80 font-sans text-[11px]">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

