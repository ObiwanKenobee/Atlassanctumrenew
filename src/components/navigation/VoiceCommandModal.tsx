import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Compass, 
  Command, 
  ArrowRight, 
  X, 
  Volume2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  CornerDownLeft,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { voiceCommandEngine, VoiceCommandMatch } from '../../lib/voiceCommandEngine';
import { PageView } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface VoiceCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: PageView) => void;
}

export const VoiceCommandModal: React.FC<VoiceCommandModalProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [matchedIntent, setMatchedIntent] = useState<VoiceCommandMatch | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [textInput, setTextInput] = useState<string>('');
  const [speechError, setSpeechError] = useState<string | null>(null);

  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isSupported = voiceCommandEngine.isSupported();

  // Start listening on open
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setMatchedIntent(null);
      setCountdown(null);
      setSpeechError(null);
      setTextInput('');

      if (isSupported) {
        startListening();
      }
    } else {
      stopListening();
    }

    return () => {
      stopListening();
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [isOpen]);

  const startListening = () => {
    setSpeechError(null);
    audioFeedback.playMicrophoneStart();
    voiceCommandEngine.start({
      onTranscript: (text, isFinal) => {
        setTranscript(text);
      },
      onMatch: (match) => {
        handleIntentMatched(match);
      },
      onError: (err) => {
        setSpeechError(err);
        setIsListening(false);
      },
      onStateChange: (listening) => {
        setIsListening(listening);
      }
    });
    setIsListening(true);
  };

  const stopListening = () => {
    voiceCommandEngine.stop();
    setIsListening(false);
  };

  const handleIntentMatched = (match: VoiceCommandMatch) => {
    setMatchedIntent(match);
    audioFeedback.playBell([528, 660], 0.3);

    if (match.intent.type !== 'unknown') {
      // Begin 1.2s execution countdown
      setCountdown(1);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = setTimeout(() => {
        executeIntent(match);
      }, 1200);
    }
  };

  const executeIntent = (match: VoiceCommandMatch) => {
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    audioFeedback.playSuccessChime();

    if (match.intent.type === 'navigate') {
      onSelectTab(match.intent.target);
      onClose();
    } else if (match.intent.type === 'modal') {
      window.dispatchEvent(new CustomEvent(match.intent.eventName));
      onClose();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const match = voiceCommandEngine.parseIntent(textInput);
    handleIntentMatched(match);
  };

  const handleSuggestionClick = (phrase: string) => {
    audioFeedback.playSubtleClick();
    setTranscript(phrase);
    setTextInput(phrase);
    const match = voiceCommandEngine.parseIntent(phrase);
    handleIntentMatched(match);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Main Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg rounded-2xl bg-[#0B0F0C] border border-[#C5A059]/40 shadow-2xl text-[#F5F5F0] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#F5F5F0]/10 flex items-center justify-between bg-[#101612]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
              <Mic className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-white text-base">
                Natural Language Voice Command
              </h3>
              <p className="text-[10px] text-neutral-400 font-mono">
                SpeechRecognition Engine • Hands-Free Navigation & Actions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Listening / Microphone Stage */}
        <div className="p-6 text-center space-y-5">
          {/* Animated Microphone Orb */}
          <div className="relative inline-flex items-center justify-center">
            {isListening && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="absolute w-24 h-24 rounded-full bg-[#C5A059]/20"
                />
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}
                  className="absolute w-20 h-20 rounded-full bg-emerald-500/20"
                />
              </>
            )}

            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50'
                  : 'bg-[#C5A059] hover:bg-[#D4AF37] text-black shadow-[#C5A059]/40'
              }`}
              title={isListening ? 'Click to stop listening' : 'Click to start microphone'}
            >
              {isListening ? (
                <Mic className="w-7 h-7 animate-pulse" />
              ) : (
                <MicOff className="w-7 h-7" />
              )}
            </button>
          </div>

          {/* Status Label & Wave */}
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider font-bold">
              {isListening ? (
                <span className="text-emerald-400 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Listening for your command...
                </span>
              ) : (
                <span className="text-neutral-400">Microphone Paused • Click to Speak</span>
              )}
            </div>

            {/* Transcript Area */}
            <div className="min-h-[52px] p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center font-serif text-base text-white italic">
              {transcript ? (
                <span>"{transcript}"</span>
              ) : (
                <span className="text-neutral-500 not-italic text-xs font-sans">
                  Speak naturally: e.g., "Go to Bioregional Ledger" or "Open System Diagnostics"
                </span>
              )}
            </div>
          </div>

          {/* Matched Action Badge & Confirmation Countdown */}
          {matchedIntent && (
            <div className="p-3.5 rounded-xl bg-[#121A15] border border-emerald-500/40 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Matched Intent ({Math.round(matchedIntent.confidence * 100)}% Confidence)
                </span>
                {countdown !== null && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 font-bold animate-pulse">
                    Executing...
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="font-bold text-white text-sm">
                  {matchedIntent.intent.type === 'navigate' ? (
                    <span>Navigate to <strong>{matchedIntent.intent.label}</strong></span>
                  ) : matchedIntent.intent.type === 'modal' ? (
                    <span>Action: <strong>{matchedIntent.intent.label}</strong></span>
                  ) : (
                    <span className="text-amber-300">Command not recognized. Try one of the suggestions below.</span>
                  )}
                </div>

                {matchedIntent.intent.type !== 'unknown' && (
                  <button
                    onClick={() => executeIntent(matchedIntent)}
                    className="px-3 py-1 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-black font-mono text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Execute</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Fallback Text Input (for browsers or restricted permissions) */}
          <form onSubmit={handleManualSubmit} className="relative">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or type a voice command here..."
              className="w-full pl-3 pr-10 py-2 rounded-lg bg-[#141A16] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#C5A059]"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 p-1 rounded bg-[#C5A059]/20 hover:bg-[#C5A059]/40 text-[#C5A059] cursor-pointer"
              title="Parse command"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Speech API Warning if unsupported */}
          {!isSupported && (
            <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Native Web Speech API is restricted in this container preview; you can use the command input above or click the sample phrases below.</span>
            </div>
          )}

          {speechError && (
            <div className="p-2 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[11px]">
              Microphone status: {speechError}
            </div>
          )}

          {/* Suggested Natural Language Phrases */}
          <div className="space-y-2 text-left pt-2 border-t border-white/10">
            <div className="text-[10px] text-neutral-400 font-mono uppercase font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              Popular Voice Commands
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Go to Bioregional Ledger',
                'Open Flourishing Index',
                'System Health Diagnostics',
                'Show Ten Commandments',
                'Export Bioregional Ledger',
                'Open Sentinel Swarm',
                'Toggle Theme Mode',
                'Open Capital Engine'
              ].map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => handleSuggestionClick(phrase)}
                  className="px-2.5 py-1 rounded-md bg-[#121914] hover:bg-[#1B261E] border border-white/10 hover:border-[#C5A059]/40 text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  "{phrase}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0A0E0C] border-t border-[#F5F5F0]/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <span>Shortcut: Press <strong className="text-white">v</strong> anytime to toggle</span>
          <button
            onClick={onClose}
            className="hover:text-white cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
