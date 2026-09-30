import React, { useState, useEffect, useCallback } from 'react';
import { Smartphone, RotateCw, X, ChevronRight, Check, Eye } from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

interface LandscapeModeDetectorProps {
  /**
   * Optional custom CSS selector to detect wide bento grid layouts.
   * Defaults to '.grid-flexible-bento, .grid-fluid-bento, [data-bento="true"]'
   */
  bentoSelector?: string;
  /**
   * Maximum width in pixels under which portrait mode warning is relevant.
   * Defaults to 960px (mobile phones and portrait tablets).
   */
  maxPortraitWidth?: number;
  /**
   * Enable dev simulation mode to test on desktop screens.
   */
  allowSimulation?: boolean;
}

const STORAGE_KEY = 'atlas_landscape_warning_dismissed_session';

export const LandscapeModeDetector: React.FC<LandscapeModeDetectorProps> = ({
  bentoSelector = '.grid-flexible-bento, .grid-fluid-bento, [data-bento="true"]',
  maxPortraitWidth = 960,
  allowSimulation = true
}) => {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [hasBentoLayout, setHasBentoLayout] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [simulatedPortrait, setSimulatedPortrait] = useState<boolean>(false);

  // Check orientation and screen dimensions
  const checkOrientation = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (simulatedPortrait) {
      setIsPortrait(true);
      return;
    }

    const portraitQuery = window.matchMedia('(orientation: portrait)');
    const isPortraitOrientation = portraitQuery.matches || window.innerHeight > window.innerWidth;
    const isUnderMaxConstraint = window.innerWidth <= maxPortraitWidth;

    setIsPortrait(isPortraitOrientation && isUnderMaxConstraint);
  }, [maxPortraitWidth, simulatedPortrait]);

  // Check presence of bento grid in the active DOM tree
  const checkBentoInDOM = useCallback(() => {
    if (typeof document === 'undefined') return;

    const bentoElements = document.querySelectorAll(bentoSelector);
    let visibleBentoFound = false;

    bentoElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Count as active if element is in the document and has dimension
      if (rect.width > 0 && rect.height > 0) {
        visibleBentoFound = true;
      }
    });

    setHasBentoLayout(visibleBentoFound);
  }, [bentoSelector]);

  // Listen to orientation / window resize events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    checkOrientation();
    checkBentoInDOM();

    const handleResize = () => {
      checkOrientation();
      checkBentoInDOM();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // MutationObserver to detect dynamic page transitions and tab changes
    const observer = new MutationObserver(() => {
      checkBentoInDOM();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'data-bento']
    });

    // Fallback interval to ensure prompt detection across heavy component mounts
    const pollInterval = setInterval(() => {
      checkOrientation();
      checkBentoInDOM();
    }, 2000);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      observer.disconnect();
      clearInterval(pollInterval);
    };
  }, [checkOrientation, checkBentoInDOM]);

  const handleDismiss = () => {
    audioFeedback.playSubtleClick();
    setIsDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore storage limitations
    }
  };

  const handleMinimize = () => {
    audioFeedback.playMicroTick();
    setIsMinimized(!isMinimized);
  };

  const shouldShowWarning = (isPortrait || simulatedPortrait) && hasBentoLayout && !isDismissed;

  // Listen for developer toggle shortcut: Alt+O (Orientation warning toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'o' || e.key === 'O')) {
        e.preventDefault();
        setSimulatedPortrait((prev) => !prev);
        setIsDismissed(false);
        setIsMinimized(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!shouldShowWarning) {
    return null;
  }

  // Minimized Floating Pill Mode
  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-20 right-4 z-40 animate-in fade-in slide-in-from-right duration-200"
        role="status"
        aria-live="polite"
      >
        <button
          onClick={handleMinimize}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0E1511]/95 hover:bg-[#152019] border border-amber-500/50 hover:border-amber-400 text-amber-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md text-xs font-mono transition-all cursor-pointer group"
          title="Bento layout optimized for Landscape. Click to expand warning."
        >
          <RotateCw className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span className="text-[10px] font-bold">Rotate for Bento</span>
        </button>
      </div>
    );
  }

  // Full Non-Intrusive Warning Banner
  return (
    <aside
      className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[92vw] w-full sm:w-[450px] rounded-2xl bg-[#090E0B]/95 border border-amber-500/50 shadow-[0_8px_32px_rgba(0,0,0,0.75)] backdrop-blur-xl p-3.5 text-[#F5F5F0] animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans select-none"
      role="region"
      aria-label="Screen orientation advisory"
    >
      <div className="flex items-start gap-3">
        {/* Animated Rotation Device Icon */}
        <div className="relative w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center shrink-0 text-amber-400">
          <Smartphone className="w-4 h-4 text-amber-400" />
          <RotateCw className="w-3 h-3 text-amber-300 absolute -bottom-0.5 -right-0.5 animate-[spin_4s_linear_infinite]" />
        </div>

        {/* Advisory Text Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-amber-300 font-mono tracking-tight uppercase">
              Landscape Mode Recommended
            </span>
            <span className="px-1.5 py-0.2 rounded text-[8px] font-mono bg-amber-950/80 text-amber-300 border border-amber-500/40 uppercase font-semibold">
              Bento Layout
            </span>
          </div>

          <p className="text-[11px] text-[#F5F5F0]/85 leading-snug mt-1">
            This view features high-density multi-column bento matrices. Rotate your device to <strong className="text-white font-medium">landscape</strong> for side-by-side telemetric cards and comparative charts.
          </p>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-white/10 text-[10px] font-mono">
            <button
              onClick={handleMinimize}
              className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Minimize</span>
            </button>

            <div className="flex items-center gap-1.5">
              {allowSimulation && (
                <button
                  onClick={() => setSimulatedPortrait(false)}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Turn off test simulation"
                >
                  Reset
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white border border-amber-400/40 font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3 h-3 text-amber-400" />
                <span>Got it</span>
              </button>
            </div>
          </div>
        </div>

        {/* Direct Close Button */}
        <button
          onClick={handleDismiss}
          className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          title="Dismiss advisory"
          aria-label="Dismiss advisory"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
