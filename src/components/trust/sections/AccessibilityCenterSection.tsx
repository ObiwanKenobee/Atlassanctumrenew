import React from 'react';
import { 
  Eye, 
  Type, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Keyboard, 
  FileText, 
  CheckCircle2, 
  Sliders, 
  Contrast,
  Smile,
  ShieldCheck
} from 'lucide-react';
import { useTrustLayer } from '../../../context/TrustLayerContext';
import { audioFeedback } from '../../../lib/audioFeedback';

export const AccessibilityCenterSection: React.FC = () => {
  const { accessibility, updateAccessibility, plainLanguage, togglePlainLanguage } = useTrustLayer();

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-950/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">Inclusion by Architectural Design</span>
          </div>
          <h2 className="text-xl font-medium font-serif text-[#F5F5F0]">
            Universal Accessibility & Cognitive Clarity
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl leading-relaxed">
            Atlas Sanctum is built to be usable by everyone, including field researchers in harsh daylight, neurodiverse stewards, screen-reader navigators, and low-bandwidth wilderness stations.
          </p>
        </div>
      </div>

      {/* Interactive Controls Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Font Size Scaling */}
        <div className="p-5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#C5A059]">
              <Type className="w-4 h-4" />
              <h4 className="text-xs font-mono uppercase font-bold">1. Typographic Scale</h4>
            </div>
            <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">{accessibility.fontSize}</span>
          </div>
          <p className="text-xs text-[#F5F5F0]/70">
            Adjust baseline root typography for maximum legibility across dense data tables and graph inspectors.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => updateAccessibility({ fontSize: 'normal' })}
              className={`flex-1 py-1.5 text-xs font-mono rounded border transition-all cursor-pointer ${
                accessibility.fontSize === 'normal'
                  ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]'
                  : 'bg-[#1E1E1E] text-[#F5F5F0]/70 border-[#F5F5F0]/10 hover:bg-[#252525]'
              }`}
            >
              Standard (A)
            </button>
            <button
              onClick={() => updateAccessibility({ fontSize: 'large' })}
              className={`flex-1 py-1.5 text-xs font-mono rounded border transition-all cursor-pointer ${
                accessibility.fontSize === 'large'
                  ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]'
                  : 'bg-[#1E1E1E] text-[#F5F5F0]/70 border-[#F5F5F0]/10 hover:bg-[#252525]'
              }`}
            >
              Large (A+)
            </button>
            <button
              onClick={() => updateAccessibility({ fontSize: 'extra-large' })}
              className={`flex-1 py-1.5 text-xs font-mono rounded border transition-all cursor-pointer ${
                accessibility.fontSize === 'extra-large'
                  ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]'
                  : 'bg-[#1E1E1E] text-[#F5F5F0]/70 border-[#F5F5F0]/10 hover:bg-[#252525]'
              }`}
            >
              XL (A++)
            </button>
          </div>
        </div>

        {/* 2. Visual Contrast & Color Modes */}
        <div className="p-5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400">
              <Contrast className="w-4 h-4" />
              <h4 className="text-xs font-mono uppercase font-bold">2. High-Contrast Mode</h4>
            </div>
            <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">{accessibility.contrastMode}</span>
          </div>
          <p className="text-xs text-[#F5F5F0]/70">
            Enforce WCAG AAA 7:1 optical contrast with stark white borders and bold high-visibility accents.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                updateAccessibility({ contrastMode: 'standard' });
                window.dispatchEvent(new CustomEvent('atlas-theme-changed', { detail: { theme: 'dark' } }));
              }}
              className={`flex-1 py-1.5 text-xs font-mono rounded border transition-all cursor-pointer ${
                accessibility.contrastMode === 'standard'
                  ? 'bg-cyan-900/60 text-cyan-300 font-bold border-cyan-500/50'
                  : 'bg-[#1E1E1E] text-[#F5F5F0]/70 border-[#F5F5F0]/10 hover:bg-[#252525]'
              }`}
            >
              Default Dark
            </button>
            <button
              onClick={() => {
                updateAccessibility({ contrastMode: 'high-contrast' });
                window.dispatchEvent(new CustomEvent('atlas-theme-changed', { detail: { theme: 'high-contrast' } }));
              }}
              className={`flex-1 py-1.5 text-xs font-mono rounded border transition-all cursor-pointer ${
                accessibility.contrastMode === 'high-contrast'
                  ? 'bg-yellow-400 text-black font-bold border-yellow-400'
                  : 'bg-[#1E1E1E] text-[#F5F5F0]/70 border-[#F5F5F0]/10 hover:bg-[#252525]'
              }`}
            >
              High Contrast (AAA)
            </button>
          </div>
        </div>

        {/* 3. Reduced Motion */}
        <div className="p-5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <h4 className="text-xs font-mono uppercase font-bold">3. Reduced Motion</h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {accessibility.reducedMotion ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/70 mt-1">
              Disables parallax particle drifts, spinning simulation rings, and sudden layout transitions for vestibular comfort.
            </p>
          </div>
          <button
            onClick={() => updateAccessibility({ reducedMotion: !accessibility.reducedMotion })}
            className={`w-full py-2 text-xs font-mono rounded border transition-all cursor-pointer flex items-center justify-center gap-2 ${
              accessibility.reducedMotion
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-[#1E1E1E] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:bg-[#252525]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{accessibility.reducedMotion ? 'Reduced Motion Enabled' : 'Enable Reduced Motion'}</span>
          </button>
        </div>

        {/* 4. Plain Language Mode */}
        <div className="p-5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <Smile className="w-4 h-4" />
                <h4 className="text-xs font-mono uppercase font-bold">4. Plain-Language Summaries</h4>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold">
                {plainLanguage ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/70 mt-1">
              Translates high-dimensional legal covenants, mathematical graph jargon, and carbon metrics into clear, straightforward English.
            </p>
          </div>
          <button
            onClick={togglePlainLanguage}
            className={`w-full py-2 text-xs font-mono rounded border transition-all cursor-pointer flex items-center justify-center gap-2 ${
              plainLanguage
                ? 'bg-amber-950/70 border-amber-500 text-amber-300 font-bold'
                : 'bg-[#1E1E1E] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:bg-[#252525]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{plainLanguage ? 'Plain Language Active' : 'Enable Plain-Language Mode'}</span>
          </button>
        </div>

        {/* 5. Sound & Audio Feedback */}
        <div className="p-5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-400">
                {accessibility.soundFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <h4 className="text-xs font-mono uppercase font-bold">5. Tactile Audio Feedback</h4>
              </div>
              <span className="text-[10px] font-mono text-purple-400 font-bold">
                {accessibility.soundFeedback ? 'SOUND ON' : 'MUTED'}
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/70 mt-1">
              Micro-synthesizer click feedback for node selection, simulation state triggers, and confirmation chimes.
            </p>
          </div>
          <button
            onClick={() => updateAccessibility({ soundFeedback: !accessibility.soundFeedback })}
            className={`w-full py-2 text-xs font-mono rounded border transition-all cursor-pointer flex items-center justify-center gap-2 ${
              accessibility.soundFeedback
                ? 'bg-purple-950/70 border-purple-500 text-purple-300 font-bold'
                : 'bg-[#1E1E1E] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:bg-[#252525]'
            }`}
          >
            <span>{accessibility.soundFeedback ? 'Sound Feedback Active' : 'Enable Sound Chimes'}</span>
          </button>
        </div>

        {/* 6. Keyboard & Screen Reader Focus Rings */}
        <div className="p-5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400">
                <Keyboard className="w-4 h-4" />
                <h4 className="text-xs font-mono uppercase font-bold">6. Keyboard & ARIA Focus Rings</h4>
              </div>
              <span className="text-[10px] font-mono text-blue-400 font-bold">
                {accessibility.keyboardFocusRing ? 'ENFORCED' : 'OFF'}
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/70 mt-1">
              High-visibility 2px golden focus outline on active inputs, buttons, and simulation canvas nodes.
            </p>
          </div>
          <button
            onClick={() => updateAccessibility({ keyboardFocusRing: !accessibility.keyboardFocusRing })}
            className={`w-full py-2 text-xs font-mono rounded border transition-all cursor-pointer flex items-center justify-center gap-2 ${
              accessibility.keyboardFocusRing
                ? 'bg-blue-950/70 border-blue-500 text-blue-300 font-bold'
                : 'bg-[#1E1E1E] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:bg-[#252525]'
            }`}
          >
            <span>{accessibility.keyboardFocusRing ? 'Focus Rings Enforced' : 'Enable High-Visibility Focus'}</span>
          </button>
        </div>
      </div>

      {/* Keyboard Quick Navigation Guide */}
      <div className="p-5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#C5A059]">
          <Keyboard className="w-4 h-4" />
          <span>Full Keyboard Navigation & Hotkeys</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5 flex items-center justify-between">
            <span className="text-[#F5F5F0]/60">Command Center:</span>
            <kbd className="px-2 py-0.5 bg-[#222] text-[#C5A059] rounded border border-[#F5F5F0]/20 font-bold">⌘K / Ctrl+K</kbd>
          </div>
          <div className="p-2.5 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5 flex items-center justify-between">
            <span className="text-[#F5F5F0]/60">Epistemic Search:</span>
            <kbd className="px-2 py-0.5 bg-[#222] text-cyan-400 rounded border border-[#F5F5F0]/20 font-bold">/</kbd>
          </div>
          <div className="p-2.5 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5 flex items-center justify-between">
            <span className="text-[#F5F5F0]/60">Shortcuts Help:</span>
            <kbd className="px-2 py-0.5 bg-[#222] text-emerald-400 rounded border border-[#F5F5F0]/20 font-bold">?</kbd>
          </div>
          <div className="p-2.5 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5 flex items-center justify-between">
            <span className="text-[#F5F5F0]/60">Close Modals:</span>
            <kbd className="px-2 py-0.5 bg-[#222] text-rose-400 rounded border border-[#F5F5F0]/20 font-bold">ESC</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
