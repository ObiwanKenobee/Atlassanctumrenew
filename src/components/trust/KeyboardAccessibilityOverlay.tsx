import React, { useEffect, useState } from 'react';
import { 
  Keyboard, 
  Contrast, 
  Type, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Eye, 
  X, 
  Check,
  FileText
} from 'lucide-react';
import { useTrustLayer } from '../../context/TrustLayerContext';
import { audioFeedback } from '../../lib/audioFeedback';

interface KeyboardAccessibilityOverlayProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const KeyboardAccessibilityOverlay: React.FC<KeyboardAccessibilityOverlayProps> = ({
  isOpen = false,
  onClose
}) => {
  const [internalOpen, setInternalOpen] = useState(isOpen);
  const { accessibility, updateAccessibility, plainLanguage, togglePlainLanguage } = useTrustLayer();

  // Listen for global keyboard shortcut: Alt + A or ?
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user presses Alt+A or Shift+? (when not focused on input)
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      if ((e.altKey && e.key.toLowerCase() === 'a') || (!isInput && e.key === '?')) {
        e.preventDefault();
        audioFeedback.playSubtleClick();
        setInternalOpen(prev => !prev);
      } else if (e.key === 'Escape' && internalOpen) {
        setInternalOpen(false);
        if (onClose) onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [internalOpen, onClose]);

  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);

  const handleContrastChange = (mode: 'standard' | 'high-contrast' | 'biophilic-dark') => {
    audioFeedback.playMicroTick();
    updateAccessibility({ contrastMode: mode });
    const themeName = mode === 'high-contrast' ? 'high-contrast' : mode === 'biophilic-dark' ? 'dark' : 'dark';
    localStorage.setItem('atlas_theme_mode', themeName);
    window.dispatchEvent(new CustomEvent('atlas-theme-changed', { detail: { theme: themeName } }));
  };

  const handleFontSizeChange = (size: 'normal' | 'large' | 'extra-large') => {
    audioFeedback.playMicroTick();
    updateAccessibility({ fontSize: size });
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem('atlas_font_size', size);
  };

  const handleReducedMotionToggle = () => {
    audioFeedback.playMicroTick();
    const nextVal = !accessibility.reducedMotion;
    updateAccessibility({ reducedMotion: nextVal });
    if (nextVal) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
    localStorage.setItem('atlas_reduced_motion', String(nextVal));
  };

  const handleClose = () => {
    audioFeedback.playSubtleClick();
    setInternalOpen(false);
    if (onClose) onClose();
  };

  if (!internalOpen) {
    return (
      <button
        onClick={() => {
          audioFeedback.playSubtleClick();
          setInternalOpen(true);
        }}
        className="fixed bottom-4 right-4 z-40 p-2.5 bg-[#141414]/90 hover:bg-[#1E1E1E] text-[#C5A059] hover:text-[#F5F5F0] border border-[#F5F5F0]/20 hover:border-[#C5A059] rounded-full shadow-lg backdrop-blur flex items-center gap-1.5 text-xs font-mono transition-all cursor-pointer"
        title="Accessibility Quick Bar (Shortcut: Alt+A or '?')"
      >
        <Keyboard className="w-4 h-4" />
        <span className="hidden sm:inline">Accessibility (Alt+A)</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[#121212] border border-[#C5A059]/40 rounded-sm shadow-2xl p-5 space-y-4 text-[#F5F5F0] font-mono relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-overlay-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
          <div className="flex items-center gap-2 text-[#C5A059]">
            <Keyboard className="w-5 h-5" />
            <h3 id="accessibility-overlay-title" className="text-sm font-bold uppercase tracking-wider">
              Keyboard Accessibility Quick-Panel
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-[#222] rounded text-[#F5F5F0]/60 hover:text-[#F5F5F0] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
          Toggle inclusive accessibility presets instantly. Hotkey shortcuts operate across all views and telemetry graphs.
        </p>

        {/* Quick Toggles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* High Contrast Mode */}
          <div className="p-3 bg-[#181818] border border-[#F5F5F0]/10 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                <Contrast className="w-4 h-4" /> High Contrast
              </span>
              <span className="text-[10px] text-[#F5F5F0]/50 uppercase">{accessibility.contrastMode}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {(['standard', 'high-contrast', 'biophilic-dark'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => handleContrastChange(mode)}
                  className={`py-1 text-[10px] font-bold rounded border capitalize cursor-pointer transition-all ${
                    accessibility.contrastMode === mode
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500 font-bold'
                      : 'bg-[#0E0E0E] text-[#F5F5F0]/60 border-[#F5F5F0]/10'
                  }`}
                >
                  {mode.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Typographic Scale */}
          <div className="p-3 bg-[#181818] border border-[#F5F5F0]/10 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-[#C5A059]">
                <Type className="w-4 h-4" /> Font Scaling
              </span>
              <span className="text-[10px] text-[#F5F5F0]/50 uppercase">{accessibility.fontSize}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {(['normal', 'large', 'extra-large'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={`py-1 text-[10px] font-bold rounded border capitalize cursor-pointer transition-all ${
                    accessibility.fontSize === size
                      ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]'
                      : 'bg-[#0E0E0E] text-[#F5F5F0]/60 border-[#F5F5F0]/10'
                  }`}
                >
                  {size.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion Mode */}
          <div className="p-3 bg-[#181818] border border-[#F5F5F0]/10 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-cyan-400">
                <Sliders className="w-4 h-4" /> Reduced Motion
              </span>
              <span className="text-[10px] text-[#F5F5F0]/50">
                {accessibility.reducedMotion ? 'ON' : 'OFF'}
              </span>
            </div>
            <button
              onClick={handleReducedMotionToggle}
              className={`w-full py-1.5 text-[11px] font-bold rounded border transition-all cursor-pointer ${
                accessibility.reducedMotion
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                  : 'bg-[#0E0E0E] text-[#F5F5F0]/70 border-[#F5F5F0]/10'
              }`}
            >
              {accessibility.reducedMotion ? '✓ Motion Throttled (Static)' : 'Enable Reduced Motion'}
            </button>
          </div>

          {/* Plain Language Synthesizer */}
          <div className="p-3 bg-[#181818] border border-[#F5F5F0]/10 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-purple-400">
                <FileText className="w-4 h-4" /> Plain Language
              </span>
              <span className="text-[10px] text-[#F5F5F0]/50">
                {plainLanguage ? 'ON' : 'OFF'}
              </span>
            </div>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                togglePlainLanguage();
              }}
              className={`w-full py-1.5 text-[11px] font-bold rounded border transition-all cursor-pointer ${
                plainLanguage
                  ? 'bg-purple-950 text-purple-300 border-purple-500'
                  : 'bg-[#0E0E0E] text-[#F5F5F0]/70 border-[#F5F5F0]/10'
              }`}
            >
              {plainLanguage ? '✓ Jargon Simplified' : 'Enable Plain English'}
            </button>
          </div>
        </div>

        {/* Keyboard Shortcut Cheat Sheet */}
        <div className="p-3 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded text-[11px] space-y-1.5">
          <span className="text-[#C5A059] font-bold block text-[10px] uppercase">
            Global Keyboard Shortcuts
          </span>
          <div className="grid grid-cols-2 gap-2 text-[#F5F5F0]/70">
            <div><kbd className="px-1.5 py-0.5 bg-[#222] border border-[#444] rounded text-[10px]">Alt + A</kbd> : Toggle Quick-Panel</div>
            <div><kbd className="px-1.5 py-0.5 bg-[#222] border border-[#444] rounded text-[10px]">Esc</kbd> : Close Modals</div>
            <div><kbd className="px-1.5 py-0.5 bg-[#222] border border-[#444] rounded text-[10px]">Tab</kbd> : Sequential Focus</div>
            <div><kbd className="px-1.5 py-0.5 bg-[#222] border border-[#444] rounded text-[10px]">?</kbd> : Accessibility Help</div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleClose}
            className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#b08f4c] text-black font-bold text-xs rounded transition-all cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
