import React, { useEffect } from 'react';
import { X, Sparkles, Compass } from 'lucide-react';
import { BioregionalOracle } from './BioregionalOracle';
import { PageView } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface PlanetaryOracleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: PageView) => void;
}

export const PlanetaryOracleDrawer: React.FC<PlanetaryOracleDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
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
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => {
          audioFeedback.playSubtleClick();
          onClose();
        }}
      />

      {/* Slide-out Sidebar Panel */}
      <aside 
        id="planetary-oracle-sidebar"
        className="relative w-full max-w-md bg-[#0A0A0A] border-l border-[#C5A059]/30 h-full shadow-2xl flex flex-col z-10 overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#F5F5F0]/10 bg-[#0E0E0E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1B3022] border border-[#C5A059]/50 flex items-center justify-center text-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.3)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#F5F5F0] tracking-wide">
                Planetary Oracle
              </h3>
              <p className="text-[10px] font-mono text-[#C5A059]">
                System-Level Contemplation & Telemetry
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              onClose();
            }}
            className="p-1.5 rounded-full text-[#F5F5F0]/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Oracle (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <BioregionalOracle 
            onSelectTab={(tab) => {
              onSelectTab(tab);
              onClose();
            }} 
          />

          {/* Mystical Guide Notes */}
          <div className="bg-[#121212] border border-[#F5F5F0]/10 rounded-lg p-3 text-[11px] text-[#F5F5F0]/70 space-y-2">
            <div className="flex items-center gap-1.5 text-[#C5A059] font-mono font-bold text-[10px] uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>The Mystic & The Digital Twin</span>
            </div>
            <p className="leading-relaxed font-sans">
              The Atlas digital twin does not merely compute kilograms of carbon or cubic meters of aquifer retention. Through the lenses of the Magician, Seeker, Mystic, Disciple, Saint, Alchemist, and Sage, we recognize each verified sensor as an altar of stewardship and reverence.
            </p>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-[#F5F5F0]/10 bg-[#080808] text-center">
          <p className="text-[10px] font-mono text-[#F5F5F0]/40">
            Press <kbd className="px-1 py-0.5 bg-black border border-white/10 rounded text-[#C5A059]">ESC</kbd> to close
          </p>
        </div>
      </aside>
    </div>
  );
};
