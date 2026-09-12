import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Radio,
  CornerDownLeft,
  Activity
} from 'lucide-react';
import { voiceCommandEngine, VoiceCommandMatch } from '../../lib/voiceCommandEngine';
import { PageView } from '../../types';
import { audioFeedback, hapticFeedback } from '../../lib/audioFeedback';

interface AcousticCommandToggleProps {
  currentTab: PageView;
  onSelectTab: (tab: PageView) => void;
  onOpenCommandCenter?: () => void;
}

export const AcousticCommandToggle: React.FC<AcousticCommandToggleProps> = ({
  currentTab,
  onSelectTab,
  onOpenCommandCenter
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [matchedIntent, setMatchedIntent] = useState<VoiceCommandMatch | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [textFallback, setTextFallback] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('Ready for voice request');
  const [speechError, setSpeechError] = useState<string | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isSupported = voiceCommandEngine.isSupported();

  // Simulated acoustic waveform dynamics when listening
  useEffect(() => {
    if (isListening) {
      const updateWave = () => {
        // Dynamic waveform oscillation
        const base = Math.sin(Date.now() / 120) * 0.4 + 0.5;
        const jitter = (Math.random() - 0.5) * 0.3;
        setAudioLevel(Math.max(0.1, Math.min(1, base + jitter)));
        animationFrameRef.current = requestAnimationFrame(updateWave);
      };
      animationFrameRef.current = requestAnimationFrame(updateWave);
    } else {
      setAudioLevel(0);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isListening]);

  // Handle keyboard shortcut 'v' or 'V' to toggle acoustic command
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === 'v' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        toggleAcoustic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  const executeMatchedCommand = (match: VoiceCommandMatch) => {
    setMatchedIntent(match);
    audioFeedback.playBell([528, 660], 0.25);
    hapticFeedback.triggerSuccessHaptic();

    const intent = match.intent;
    if (intent.type === 'navigate') {
      const target = intent.target;
      const label = intent.label;
      setStatusMessage(`Navigating to ${label}...`);
      if (executionTimeoutRef.current) clearTimeout(executionTimeoutRef.current);
      executionTimeoutRef.current = setTimeout(() => {
        onSelectTab(target);
        setIsActive(false);
        setIsListening(false);
        setStatusMessage('Command executed successfully');
      }, 700);
    } else if (intent.type === 'modal') {
      const label = intent.label;
      const eventName = intent.eventName;
      setStatusMessage(`Triggering ${label}...`);
      if (executionTimeoutRef.current) clearTimeout(executionTimeoutRef.current);
      executionTimeoutRef.current = setTimeout(() => {
        window.dispatchEvent(new CustomEvent(eventName));
        setIsActive(false);
        setIsListening(false);
      }, 700);
    } else {
      setStatusMessage(`Unrecognized: "${match.matchedPhrase}". Try saying "Go to Bioregional Ledger"`);
    }
  };

  const startAcousticListening = () => {
    setSpeechError(null);
    setTranscript('');
    setMatchedIntent(null);
    setStatusMessage('Listening to acoustic input...');
    audioFeedback.playMicrophoneStart();

    if (isSupported) {
      voiceCommandEngine.start({
        onTranscript: (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            setStatusMessage(`Processing: "${text}"`);
          }
        },
        onMatch: (match) => {
          executeMatchedCommand(match);
        },
        onError: (err) => {
          setSpeechError(err);
          setIsListening(false);
          setStatusMessage('Microphone speech error. Try typing your command.');
        },
        onStateChange: (listening) => {
          setIsListening(listening);
        }
      });
      setIsListening(true);
    } else {
      setStatusMessage('Web Speech API unavailable in this browser. Use text input below.');
    }
  };

  const stopAcousticListening = () => {
    voiceCommandEngine.stop();
    setIsListening(false);
    setStatusMessage('Acoustic Command paused');
  };

  const toggleAcoustic = () => {
    audioFeedback.playSubtleClick();
    hapticFeedback.triggerLightClickHaptic();

    if (!isActive) {
      setIsActive(true);
      startAcousticListening();
    } else {
      setIsActive(false);
      stopAcousticListening();
      if (executionTimeoutRef.current) clearTimeout(executionTimeoutRef.current);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textFallback.trim()) return;
    const match = voiceCommandEngine.parseIntent(textFallback);
    executeMatchedCommand(match);
    setTextFallback('');
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Acoustic Command Toggle Pill */}
      <button
        id="acoustic-command-toggle-btn"
        onClick={toggleAcoustic}
        aria-label="Acoustic Command: Voice Navigation Toggle"
        aria-pressed={isActive}
        title="Acoustic Command: Speak natural voice commands to navigate views (Press V)"
        className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-full border text-xs font-mono font-bold transition-all cursor-pointer shadow-sm select-none ${
          isActive
            ? 'bg-gradient-to-r from-emerald-950 via-[#1B3022] to-emerald-900 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            : 'bg-[#0D0D0D] hover:bg-[#1B3022] border-[#C5A059]/40 hover:border-[#C5A059] text-[#C5A059]'
        }`}
      >
        {/* Animated Acoustic Microphone / Wave Icon */}
        <div className="relative flex items-center justify-center w-4 h-4">
          {isActive ? (
            <div className="flex items-center gap-0.5 h-3.5">
              <span 
                className="w-0.5 bg-emerald-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(3, audioLevel * 14)}px` }} 
              />
              <span 
                className="w-0.5 bg-emerald-300 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(5, (1 - audioLevel * 0.5) * 14)}px` }} 
              />
              <span 
                className="w-0.5 bg-emerald-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(4, audioLevel * 12)}px` }} 
              />
            </div>
          ) : (
            <Mic className="w-3.5 h-3.5 text-[#C5A059]" />
          )}
        </div>

        <span className="hidden md:inline text-[11px] font-mono uppercase tracking-wider">
          Acoustic
        </span>

        {/* State Badge */}
        <span className={`text-[8px] font-mono uppercase px-1.5 py-0.2 rounded font-black ${
          isActive 
            ? 'bg-emerald-400 text-black animate-pulse' 
            : 'bg-black/60 text-[#C5A059] border border-[#C5A059]/30'
        }`}>
          {isActive ? 'LIVE' : 'V'}
        </span>
      </button>

      {/* Floating Acoustic Command HUD Panel when active */}
      {isActive && (
        <>
          {/* Backdrop dismiss */}
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
            onClick={() => {
              setIsActive(false);
              stopAcousticListening();
            }}
          />

          <div 
            id="acoustic-command-hud"
            className="absolute right-0 top-full mt-2 w-84 sm:w-96 max-w-[92vw] bg-[#0A0E0C]/98 border border-emerald-500/50 rounded-xl shadow-2xl p-4 z-50 text-[#F5F5F0] space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 ring-1 ring-emerald-400/20"
          >
            {/* HUD Header */}
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10B981] animate-pulse" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                  Acoustic Command HUD
                </span>
              </div>
              <button
                onClick={() => {
                  setIsActive(false);
                  stopAcousticListening();
                }}
                className="p-1 text-[#F5F5F0]/60 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Acoustic Visualizer Waveform Bar */}
            <div className="p-3 bg-black/60 rounded-lg border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                  {isListening ? 'Acoustic Mesh Listening...' : 'Mic Standby'}
                </span>
                <span className="text-emerald-400/70 font-mono">
                  {isListening ? 'Sampling 44.1kHz' : 'Paused'}
                </span>
              </div>

              {/* Dynamic Equalizer Bars */}
              <div className="flex items-center justify-center gap-1 h-8 px-2 py-1 bg-[#050B07] rounded border border-emerald-500/20 overflow-hidden">
                {[12, 24, 18, 28, 16, 22, 14, 26, 20, 15, 30, 19, 23, 11, 27, 17].map((height, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-emerald-600 to-emerald-300 rounded-full transition-all duration-100"
                    style={{
                      height: isListening 
                        ? `${Math.max(4, (height * (0.4 + audioLevel * 0.9)))}px` 
                        : '4px',
                      opacity: isListening ? 0.9 : 0.3
                    }}
                  />
                ))}
              </div>

              {/* Live Spoken Transcript */}
              <div className="min-h-[38px] p-2 bg-emerald-950/30 rounded border border-emerald-500/20 text-xs font-mono text-emerald-200 flex items-center">
                {transcript ? (
                  <span className="text-emerald-300 font-medium font-serif italic text-sm">
                    "{transcript}"
                  </span>
                ) : (
                  <span className="text-emerald-500/60 text-[11px] italic">
                    Say: "Go to Bioregional Ledger", "Show Satellite Hazards", "Open Impact Dashboard"...
                  </span>
                )}
              </div>
            </div>

            {/* Recognized Command Feedback */}
            {matchedIntent && (
              <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-400 text-xs font-mono space-y-1 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target: {matchedIntent.intent.type === 'navigate' ? matchedIntent.intent.label : matchedIntent.intent.type === 'modal' ? matchedIntent.intent.label : 'Query'}</span>
                </div>
                <div className="text-[10px] text-emerald-200/70">
                  Confidence Score: {Math.round(matchedIntent.confidence * 100)}% • Routing now...
                </div>
              </div>
            )}

            {speechError && (
              <div className="p-2 bg-rose-950/80 border border-rose-500/40 rounded text-[11px] font-mono text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}

            {/* Text Fallback Input Form */}
            <form onSubmit={handleManualSubmit} className="relative">
              <input
                type="text"
                value={textFallback}
                onChange={(e) => setTextFallback(e.target.value)}
                placeholder="Or type voice request (e.g. 'go to sentinel')..."
                className="w-full bg-black/80 border border-emerald-500/40 focus:border-emerald-400 rounded-lg px-3 py-1.5 pr-8 text-xs font-mono text-emerald-100 placeholder:text-emerald-600/50 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-200 p-1"
                title="Execute Command"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Command Suggestions */}
            <div className="space-y-1 pt-1 border-t border-emerald-500/20">
              <span className="text-[9px] font-mono uppercase text-emerald-400/70 tracking-wider">
                Quick Voice Targets:
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  { label: 'Impact Dashboard', target: 'impact-dashboard' },
                  { label: 'Bioregional Ledger', target: 'bioregional-ledger' },
                  { label: 'Planetary Sentinel', target: 'sentinel' },
                  { label: 'Flourishing Index', target: 'flourishing-index' },
                  { label: 'Capital Engine', target: 'capital-engine' },
                  { label: 'Decision Room', target: 'decision-room' }
                ].map((item) => (
                  <button
                    key={item.target}
                    onClick={() => {
                      audioFeedback.playMicroTick();
                      onSelectTab(item.target as PageView);
                      setIsActive(false);
                      setIsListening(false);
                    }}
                    className="px-2 py-0.5 rounded bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-[9px] font-mono text-emerald-300 hover:text-white transition-colors cursor-pointer"
                  >
                    "{item.label}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
