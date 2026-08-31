import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Check, 
  Sliders, 
  X, 
  ChevronRight, 
  BrainCircuit, 
  Eye, 
  Award,
  Sparkles
} from 'lucide-react';
import { useTrustLayer } from '../../context/TrustLayerContext';
import { audioFeedback } from '../../lib/audioFeedback';

export const TrustLayerBanner: React.FC = () => {
  const { 
    isBannerVisible, 
    dismissBanner, 
    openTrustModal, 
    acceptAllConsent, 
    acceptEssentialOnly 
  } = useTrustLayer();

  const [isMinimized, setIsMinimized] = useState(false);

  // If dismissed and not minimized, we can show a subtle floating badge on the bottom-left
  // so the user always has instant access to their sovereign Trust Layer
  if (!isBannerVisible) {
    return (
      <button
        onClick={() => {
          openTrustModal('privacy');
          audioFeedback.playSubtleClick();
        }}
        className="fixed bottom-5 left-5 z-[9980] px-3 py-2 bg-[#0E0E0E]/90 hover:bg-[#161616] border border-[#F5F5F0]/15 hover:border-[#C5A059]/50 backdrop-blur-md rounded-full shadow-lg text-[#F5F5F0] text-xs font-mono flex items-center gap-2 transition-all cursor-pointer group"
        title="Open Atlas Sanctum Trust Layer (Privacy, Security, AI & Data Rights)"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform" />
        <span className="text-[11px] text-[#F5F5F0]/80 group-hover:text-[#F5F5F0]">Trust Layer</span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-5 left-5 z-[9990] animate-fadeIn">
        <button
          onClick={() => {
            setIsMinimized(false);
            audioFeedback.playSubtleClick();
          }}
          className="px-3.5 py-2.5 bg-[#0E0E0E]/95 border border-[#C5A059]/40 backdrop-blur-md rounded shadow-xl text-[#F5F5F0] text-xs font-mono flex items-center gap-2.5 hover:border-[#C5A059] transition-all cursor-pointer"
        >
          <div className="p-1 bg-[#C5A059]/20 rounded text-[#C5A059]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-[#F5F5F0]">Sovereign Trust Layer</p>
            <p className="text-[10px] text-[#F5F5F0]/60">Click to review consent</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
        </button>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-5 left-5 z-[9990] w-[calc(100vw-2.5rem)] sm:w-[410px] max-w-[92vw] bg-[#0E0E0E]/95 border border-[#F5F5F0]/20 rounded-sm shadow-2xl backdrop-blur-lg p-4 sm:p-5 text-[#F5F5F0] space-y-3.5 animate-fadeIn"
      role="region"
      aria-label="Privacy and Trust Layer Consent Banner"
    >
      {/* Banner Header */}
      <div className="flex items-start justify-between gap-2 border-b border-[#F5F5F0]/10 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#C5A059]/20 border border-[#C5A059]/40 rounded text-[#C5A059]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F5F0]">
                Atlas Sanctum Trust Layer
              </h3>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[10px] font-mono text-[#F5F5F0]/50">
              Zero Ad Trackers • In-Browser Epistemic Sovereignty
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsMinimized(true);
            audioFeedback.playMicroTick();
          }}
          className="p-1 text-[#F5F5F0]/40 hover:text-[#F5F5F0] rounded cursor-pointer transition-colors"
          title="Minimize Banner"
          aria-label="Minimize Banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-[#F5F5F0]/75 leading-relaxed font-sans">
        We utilize strictly isolated local storage to model watershed simulations and preserve your research state. No cross-site tracking or data syndication occurs.
      </p>

      {/* Trust Hub Quick Links */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-[#C5A059] flex-wrap">
        <button
          onClick={() => {
            openTrustModal('privacy');
            audioFeedback.playSubtleClick();
          }}
          className="hover:underline hover:text-white cursor-pointer"
        >
          Privacy Center
        </button>
        <span className="text-[#F5F5F0]/30">•</span>
        <button
          onClick={() => {
            openTrustModal('ai-transparency');
            audioFeedback.playSubtleClick();
          }}
          className="hover:underline hover:text-white cursor-pointer"
        >
          AI Transparency
        </button>
        <span className="text-[#F5F5F0]/30">•</span>
        <button
          onClick={() => {
            openTrustModal('data-rights');
            audioFeedback.playSubtleClick();
          }}
          className="hover:underline hover:text-white cursor-pointer"
        >
          Data Rights
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button
          onClick={() => {
            acceptAllConsent();
            audioFeedback.playSuccessChime();
          }}
          className="py-2 px-2 bg-[#C5A059] hover:bg-[#B38F46] text-black text-xs font-mono font-bold rounded-sm transition-all cursor-pointer text-center shadow-sm"
        >
          Accept All
        </button>

        <button
          onClick={() => {
            acceptEssentialOnly();
            audioFeedback.playSubtleClick();
          }}
          className="py-2 px-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#F5F5F0]/15 text-[#F5F5F0] text-xs font-mono rounded-sm transition-all cursor-pointer text-center"
        >
          Essential Only
        </button>

        <button
          onClick={() => {
            openTrustModal('consent');
            audioFeedback.playSubtleClick();
          }}
          className="py-2 px-2 bg-[#15251A] hover:bg-[#1C3323] border border-[#2D5A3C] text-emerald-300 text-xs font-mono rounded-sm transition-all cursor-pointer text-center flex items-center justify-center gap-1"
        >
          <Sliders className="w-3 h-3" />
          <span>Customize</span>
        </button>
      </div>
    </div>
  );
};
