import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Compass, 
  Scale, 
  ChevronRight, 
  Coins, 
  Radio, 
  Layers, 
  BookOpen, 
  Info,
  ShieldCheck,
  Zap,
  Globe2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { PageView } from '../types';
import { audioFeedback } from '../lib/audioFeedback';

interface FloatingWelcomeBannerProps {
  onSelectTab: (tab: PageView) => void;
  onOpenMoralSimulator: () => void;
  onOpenCommandments: () => void;
  onOpenCommandCenter: () => void;
}

const STORAGE_KEY = 'atlas_welcome_banner_dismissed_v25';

export const FloatingWelcomeBanner: React.FC<FloatingWelcomeBannerProps> = ({
  onSelectTab,
  onOpenMoralSimulator,
  onOpenCommandments,
  onOpenCommandCenter
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Check if previously dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Gentle delayed entrance for polished UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    audioFeedback.playSubtleClick();
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleToggleMinimize = () => {
    audioFeedback.playSubtleClick();
    setIsMinimized(!isMinimized);
  };

  const handleQuickAction = (callback: () => void) => {
    audioFeedback.playSubtleClick();
    callback();
  };

  if (!isVisible) {
    return (
      <button
        id="reopen-welcome-guide-btn"
        onClick={() => {
          audioFeedback.playSubtleClick();
          setIsVisible(true);
          setIsMinimized(false);
        }}
        title="Open Atlas Sanctum Platform Guide"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-35 px-3.5 py-2 bg-[#0D0D0D]/95 hover:bg-[#1B3022] border border-[#C5A059]/40 hover:border-[#C5A059] text-[#C5A059] rounded-full text-xs font-mono font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#C5A059]" />
        <span>Platform Guide</span>
        <span className="text-[10px] px-1.5 py-0.2 bg-[#C5A059]/20 text-[#C5A059] rounded-full">v2.5</span>
      </button>
    );
  }

  return (
    <aside 
      aria-label="Platform Orientation Guide"
      className="fixed bottom-0 sm:bottom-6 left-0 sm:left-auto right-0 sm:right-6 z-35 w-full sm:w-auto sm:max-w-md md:max-w-lg transition-all duration-300 animate-fadeIn pointer-events-none"
    >
      <div className="mx-auto sm:mx-0 max-w-full sm:max-w-md md:max-w-lg bg-[#0D0D0D]/98 backdrop-blur-2xl border-t sm:border border-[#C5A059]/50 sm:rounded-sm shadow-[0_12px_40px_rgba(0,0,0,0.85)] p-4 sm:p-5 text-[#F5F5F0] relative overflow-hidden pointer-events-auto max-h-[85vh] overflow-y-auto">
        
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#F5F5F0]/10">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#1B3022] border border-[#C5A059]/60 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-serif uppercase tracking-widest text-[#F5F5F0] truncate">
                  Welcome to Atlas Sanctum
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#C5A059]/20 text-[#C5A059] rounded border border-[#C5A059]/30 font-bold shrink-0">
                  OS 2.5
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#F5F5F0]/50 truncate">
                Planetary Operating System for Multi-Scale Regenerative Flourishing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleToggleMinimize}
              aria-label={isMinimized ? 'Expand Guide' : 'Minimize Guide'}
              title={isMinimized ? 'Expand' : 'Minimize'}
              className="p-1 text-[#F5F5F0]/50 hover:text-[#F5F5F0] hover:bg-[#F5F5F0]/5 rounded transition-colors cursor-pointer"
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss Welcome Guide"
              title="Dismiss guide"
              className="p-1 text-[#F5F5F0]/50 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body Content (if not minimized) */}
        {!isMinimized && (
          <div className="pt-3.5 space-y-3.5">
            <p className="text-xs text-[#F5F5F0]/80 leading-relaxed font-sans">
              Atlas Sanctum bridges <strong className="text-emerald-300 font-semibold">real-world IoT telemetry</strong>, <strong className="text-[#C5A059] font-semibold">universal moral guardrails</strong>, and <strong className="text-[#8FB8DE] font-semibold">regenerative capital allocation</strong> to coordinate restoration across global bioregions.
            </p>

            {/* Quick Tour Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleQuickAction(() => onSelectTab('opportunity-intelligence'))}
                className="p-2.5 bg-[#121212] hover:bg-[#181818] border border-[#F5F5F0]/10 hover:border-[#C5A059]/40 rounded-sm text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-[9px] font-mono text-[#C5A059] font-bold">New</span>
                </div>
                <div className="text-[11px] font-bold font-mono text-[#F5F5F0] group-hover:text-[#C5A059] truncate">
                  Opportunity Engine
                </div>
                <div className="text-[9px] text-[#F5F5F0]/50 line-clamp-1">
                  12-stage bioregional briefs
                </div>
              </button>

              <button
                onClick={() => handleQuickAction(() => onSelectTab('decision-room'))}
                className="p-2.5 bg-[#121212] hover:bg-[#181818] border border-[#F5F5F0]/10 hover:border-[#C5A059]/40 rounded-sm text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <Scale className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">Deliberate</span>
                </div>
                <div className="text-[11px] font-bold font-mono text-[#F5F5F0] group-hover:text-[#C5A059] truncate">
                  The Decision Room
                </div>
                <div className="text-[9px] text-[#F5F5F0]/50 line-clamp-1">
                  Multi-criteria trade-offs
                </div>
              </button>

              <button
                onClick={() => handleQuickAction(() => onSelectTab('reality-engine'))}
                className="p-2.5 bg-[#121212] hover:bg-[#181818] border border-[#F5F5F0]/10 hover:border-[#C5A059]/40 rounded-sm text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <Radio className="w-3.5 h-3.5 text-[#8FB8DE]" />
                  <span className="text-[9px] font-mono text-[#8FB8DE] font-bold">Live</span>
                </div>
                <div className="text-[11px] font-bold font-mono text-[#F5F5F0] group-hover:text-[#C5A059] truncate">
                  Reality Sensory Mesh
                </div>
                <div className="text-[9px] text-[#F5F5F0]/50 line-clamp-1">
                  Hardware telemetry & QR proofs
                </div>
              </button>

              <button
                onClick={() => handleQuickAction(onOpenMoralSimulator)}
                className="p-2.5 bg-[#121212] hover:bg-[#181818] border border-[#F5F5F0]/10 hover:border-[#C5A059]/40 rounded-sm text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <Scale className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[9px] font-mono text-purple-400 font-bold">Sandbox</span>
                </div>
                <div className="text-[11px] font-bold font-mono text-[#F5F5F0] group-hover:text-[#C5A059] truncate">
                  Moral Simulator
                </div>
                <div className="text-[9px] text-[#F5F5F0]/50 line-clamp-1">
                  Constitutional axiom checks
                </div>
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-1 gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuickAction(onOpenCommandCenter)}
                  className="text-[10px] font-mono text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <kbd className="px-1 py-0.2 bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded text-[9px]">⌘K</kbd>
                  <span>Command Center</span>
                </button>
                <span className="text-[#F5F5F0]/20">•</span>
                <button
                  onClick={() => handleQuickAction(onOpenCommandments)}
                  className="text-[10px] font-mono text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:underline cursor-pointer"
                >
                  10 Commandments
                </button>
              </div>

              <button
                onClick={handleDismiss}
                className="px-3.5 py-1.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-[10px] uppercase tracking-wider rounded-sm flex items-center gap-1 transition-all cursor-pointer shadow"
              >
                <span>Enter Platform</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
