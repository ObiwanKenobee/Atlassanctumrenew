import React, { useEffect } from 'react';
import { X, Command, Keyboard, Sparkles, Zap, Shield, Search, Eye, Mic } from 'lucide-react';
import { audioFeedback } from '../lib/audioFeedback';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: any) => void;
}

interface ShortcutCategory {
  title: string;
  shortcuts: Array<{
    keys: string[];
    description: string;
    actionNote?: string;
  }>;
}

const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
  {
    title: 'Global Navigation & Modals',
    shortcuts: [
      { keys: ['?'], description: 'Open this Keyboard Shortcuts cheat-sheet' },
      { keys: ['⌘', 'K'], description: 'Open Atlas Command Center & Query Intelligence' },
      { keys: ['/'], description: 'Open Global Epistemic Fuzzy Search' },
      { keys: ['ESC'], description: 'Close any active modal, drawer, or search overlay' },
      { keys: ['U'], description: 'Toggle Uncertainty & Epistemic Confidence Overlay' },
      { keys: ['*'], description: 'Open Hidden Celestial Star Map (Constellations of Verified Projects)' },
      { keys: ['O'], description: 'Consult Bioregional Planetary Oracle (Poetic Telemetry in Sidebar)' }
    ]
  },
  {
    title: 'Autonomous Agents & Intelligence',
    shortcuts: [
      { keys: ['G'], description: 'Open Gemini 3.5 Multimodal Intelligence Chat' },
      { keys: ['V'], description: 'Open Live Voice Autonomous Assistant (24kHz WebSocket)' },
      { keys: ['M'], description: 'Launch Moral Intelligence & Arbiter Simulator' },
      { keys: ['C'], description: 'Open Canon XXIII Commandments & Ethical Foundations' }
    ]
  },
  {
    title: 'Mission Operations & Ledgers',
    shortcuts: [
      { keys: ['Alt', '1'], description: 'Quick jump to Atlas Planetary Observatory' },
      { keys: ['Alt', '2'], description: 'Quick jump to Agent Mission Control' },
      { keys: ['Alt', '3'], description: 'Quick jump to Living Reality Matrix' },
      { keys: ['Alt', '4'], description: 'Quick jump to Decision Room' },
      { keys: ['Alt', '5'], description: 'Quick jump to Failure Ledger & Post-Mortems' }
    ]
  }
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="keyboard-shortcuts-modal"
        className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-md shadow-2xl overflow-hidden text-[#F5F5F0]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F5F5F0]/10 bg-[#080808]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#C5A059]/40 bg-[#1B3022] flex items-center justify-center text-[#C5A059]">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-[0.16em] uppercase text-[#F5F5F0]">Platform Hotkeys & Controls</h2>
              <p className="text-[11px] font-mono text-[#C5A059]/80">Atlas Agentic Operating Layer • Quick Access</p>
            </div>
          </div>
          <button
            onClick={() => {
              audioFeedback.play('softClick');
              onClose();
            }}
            className="text-[#F5F5F0]/60 hover:text-[#F5F5F0] p-1 rounded hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts Categories */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-6">
          {SHORTCUT_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-[#C5A059] font-bold border-b border-white/5 pb-1">
                {cat.title}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {cat.shortcuts.map((sc, sIdx) => (
                  <div 
                    key={sIdx}
                    className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <span className="text-xs text-[#F5F5F0]/80 font-sans">
                      {sc.description}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {sc.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="min-w-[24px] px-2 py-1 text-center text-[10px] font-mono font-bold bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40 rounded shadow-xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#080808] border-t border-[#F5F5F0]/10 text-[10px] font-mono text-[#F5F5F0]/50">
          <span>Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[#C5A059]">?</kbd> anytime to reopen</span>
          <span>Atlas Industrial Systems v3.2</span>
        </div>
      </div>
    </div>
  );
};
