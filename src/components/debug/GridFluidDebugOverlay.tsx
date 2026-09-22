import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LayoutGrid, 
  Layers, 
  X, 
  Eye, 
  EyeOff, 
  Columns3, 
  Maximize2, 
  RefreshCw, 
  Info, 
  Zap,
  Sparkles
} from 'lucide-react';
import { useContainerDimensions } from '../../context/ContainerDimensionsContext';
import { audioFeedback } from '../../lib/audioFeedback';

interface DetectedGridInfo {
  id: string;
  type: 'bento' | 'cards';
  className: string;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  trackCount: number;
  childCount: number;
  gap: string;
  gridTemplateColumns: string;
}

export const GridFluidDebugOverlay: React.FC = () => {
  const { 
    width, 
    height, 
    threshold, 
    prevThreshold, 
    transitionCount, 
    lastCrossoverTimestamp,
    estimatedCardsColumns,
    estimatedBentoColumns
  } = useContainerDimensions();

  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('atlas_grid_debug_overlay') === 'true';
  });

  const [showHUD, setShowHUD] = useState<boolean>(true);
  const [showChildOutlines, setShowChildOutlines] = useState<boolean>(true);
  const [showTrackLabels, setShowTrackLabels] = useState<boolean>(true);
  const [detectedGrids, setDetectedGrids] = useState<DetectedGridInfo[]>([]);
  const [crossoverNotification, setCrossoverNotification] = useState<string | null>(null);

  const prevTransitionCountRef = useRef(transitionCount);

  // Sync class on documentElement for CSS styling
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isEnabled) {
      document.documentElement.classList.add('debug-grid-overlay-active');
      localStorage.setItem('atlas_grid_debug_overlay', 'true');
    } else {
      document.documentElement.classList.remove('debug-grid-overlay-active');
      localStorage.setItem('atlas_grid_debug_overlay', 'false');
    }
    return () => {
      document.documentElement.classList.remove('debug-grid-overlay-active');
    };
  }, [isEnabled]);

  // Scan and detect all active fluid grids on the page
  const scanGrids = useCallback(() => {
    if (!isEnabled || typeof document === 'undefined') {
      setDetectedGrids([]);
      return;
    }

    const bentoElements = Array.from(
      document.querySelectorAll<HTMLElement>('.grid-flexible-bento, .grid-fluid-bento')
    );
    const cardsElements = Array.from(
      document.querySelectorAll<HTMLElement>('.grid-flexible-cards, .grid-fluid-cards')
    );

    const grids: DetectedGridInfo[] = [];

    const processElement = (el: HTMLElement, type: 'bento' | 'cards', index: number) => {
      const rect = el.getBoundingClientRect();
      // Only include visible elements
      if (rect.width === 0 || rect.height === 0 || rect.bottom < 0 || rect.top > window.innerHeight + 1000) {
        return;
      }

      const style = window.getComputedStyle(el);
      const cols = style.gridTemplateColumns.split(' ').filter(Boolean);
      const gap = style.gap || '0px';
      const children = Array.from(el.children).filter(c => (c as HTMLElement).offsetParent !== null);

      grids.push({
        id: `${type}-${index}-${Math.round(rect.top)}`,
        type,
        className: el.className,
        rect: {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        },
        trackCount: cols.length,
        childCount: children.length,
        gap,
        gridTemplateColumns: style.gridTemplateColumns
      });
    };

    bentoElements.forEach((el, i) => processElement(el, 'bento', i));
    cardsElements.forEach((el, i) => processElement(el, 'cards', i));

    setDetectedGrids(grids);
  }, [isEnabled]);

  // Re-scan when container dimensions change, on scroll, or resize
  useEffect(() => {
    if (!isEnabled) return;

    scanGrids();

    const handleScrollOrResize = () => {
      requestAnimationFrame(scanGrids);
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    // MutationObserver to detect new DOM nodes when switching views or tabs
    const observer = new MutationObserver(() => {
      requestAnimationFrame(scanGrids);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      observer.disconnect();
    };
  }, [isEnabled, scanGrids, width, height, threshold]);

  // Flash crossover notification when container threshold boundary shifts
  useEffect(() => {
    if (transitionCount !== prevTransitionCountRef.current && transitionCount > 0) {
      prevTransitionCountRef.current = transitionCount;
      const msg = `Threshold Shift: ${prevThreshold?.toUpperCase() || 'INIT'} → ${threshold.toUpperCase()} (${width}px)`;
      setCrossoverNotification(msg);
      try {
        audioFeedback.playMicroTick();
      } catch {
        // Safe fallback
      }
      const timer = setTimeout(() => {
        setCrossoverNotification(null);
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [transitionCount, threshold, prevThreshold, width]);

  // Keyboard shortcut: Alt+G or Ctrl+Alt+G to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'g') || (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'g')) {
        e.preventDefault();
        setIsEnabled(prev => {
          const next = !prev;
          try {
            audioFeedback.playMicroTick();
          } catch {
            // Safe fallback
          }
          return next;
        });
      }
    };

    const handleCustomToggle = () => {
      setIsEnabled(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-grid-debug-overlay', handleCustomToggle);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-grid-debug-overlay', handleCustomToggle);
    };
  }, []);

  const toggleOverlay = () => {
    try {
      audioFeedback.playMicroTick();
    } catch {
      // Safe fallback
    }
    setIsEnabled(prev => !prev);
  };

  const thresholdColor = {
    compact: 'text-rose-400 border-rose-500/40 bg-rose-950/60',
    phablet: 'text-amber-400 border-amber-500/40 bg-amber-950/60',
    tablet: 'text-yellow-300 border-yellow-500/40 bg-yellow-950/60',
    desktop: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/60',
    wide: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/60',
    ultrawide: 'text-purple-300 border-purple-500/40 bg-purple-950/60'
  }[threshold];

  return (
    <>
      {/* Floating Quick Toggle Button in Lower Right */}
      <div className="fixed bottom-14 sm:bottom-14 right-3 z-40 font-mono select-none flex flex-col items-end gap-2">
        {/* Temporary Threshold Crossover Flash Pill */}
        {crossoverNotification && (
          <div className="px-3 py-1.5 rounded-lg bg-[#090D0A]/95 border border-amber-500 text-amber-300 text-[11px] font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>{crossoverNotification}</span>
          </div>
        )}

        <button
          onClick={toggleOverlay}
          className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer transition-all duration-200 ${
            isEnabled
              ? 'bg-[#181308] border-amber-500/80 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-[#090D0A]/90 hover:bg-[#121A14] border-white/15 text-neutral-400 hover:text-neutral-200'
          }`}
          title="Toggle Grid Debug Overlay (Shortcut: Alt+G)"
        >
          <LayoutGrid className={`w-3.5 h-3.5 ${isEnabled ? 'text-amber-400' : 'text-neutral-400'}`} />
          <span>Grid Debug</span>
          <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
            isEnabled ? 'bg-amber-500 text-black' : 'bg-white/10 text-neutral-400'
          }`}>
            {isEnabled ? 'ON' : 'OFF'}
          </span>
          <span className="hidden md:inline text-[9px] opacity-40 ml-0.5">Alt+G</span>
        </button>
      </div>

      {/* When enabled, render the interactive HUD panel */}
      {isEnabled && (
        <div className="fixed top-14 right-3 z-40 max-w-sm w-full sm:w-80 rounded-xl bg-[#0A0E0B]/95 border border-amber-500/60 shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl p-3 font-mono text-xs text-[#F5F5F0] space-y-2.5 select-none animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B] animate-pulse" />
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                Fluid Grid Debugger
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={scanGrids}
                className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Rescan active view grids"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
              <button
                onClick={() => setIsEnabled(false)}
                className="p-1 rounded hover:bg-rose-950/60 text-neutral-400 hover:text-rose-300 transition-colors cursor-pointer"
                title="Close debug overlay"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Current Container Metrics */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-neutral-400 block text-[9px]">CONTAINER SIZE</span>
              <span className="font-bold text-white text-xs">
                {width}px × {height}px
              </span>
            </div>

            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-neutral-400 block text-[9px]">THRESHOLD</span>
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${thresholdColor}`}>
                {threshold}
              </span>
            </div>
          </div>

          {/* Column Track Estimations */}
          <div className="p-2 rounded bg-amber-950/20 border border-amber-500/20 text-[10px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Cards Tracks:</span>
              <span className="font-bold text-emerald-300">{estimatedCardsColumns} cols</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Bento Tracks:</span>
              <span className="font-bold text-amber-300">{estimatedBentoColumns} tracks</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Active Fluid Grids:</span>
              <span className="font-bold text-white">{detectedGrids.length} detected</span>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-1 pt-1 border-t border-white/10 text-[10px]">
            <label className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-1 rounded">
              <span className="text-neutral-300">Show Track Labels</span>
              <input
                type="checkbox"
                checked={showTrackLabels}
                onChange={(e) => setShowTrackLabels(e.target.checked)}
                className="accent-amber-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-1 rounded">
              <span className="text-neutral-300">Outline Child Cards</span>
              <input
                type="checkbox"
                checked={showChildOutlines}
                onChange={(e) => setShowChildOutlines(e.target.checked)}
                className="accent-amber-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Legend Guide */}
          <div className="flex items-center justify-between text-[9px] pt-1 text-neutral-400 border-t border-white/10">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-amber-500/80" />
              <span>Bento Grid</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-emerald-500/80" />
              <span>Cards Grid</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Track Labels Placed Direct in Document when Enabled */}
      {isEnabled && showTrackLabels && detectedGrids.map((grid) => (
        <div
          key={grid.id}
          className="pointer-events-none fixed z-30 font-mono"
          style={{
            top: `${grid.rect.top - window.scrollY - 22}px`,
            left: `${grid.rect.left - window.scrollX}px`,
            display: grid.rect.top - window.scrollY > 0 && grid.rect.top - window.scrollY < window.innerHeight ? 'block' : 'none'
          }}
        >
          <div className={`px-2 py-0.5 rounded-t text-[10px] font-bold shadow-md flex items-center gap-1.5 ${
            grid.type === 'bento' 
              ? 'bg-amber-500 text-black' 
              : 'bg-emerald-500 text-black'
          }`}>
            <span>{grid.type === 'bento' ? '📐 grid-flexible-bento' : '📐 grid-flexible-cards'}</span>
            <span className="opacity-80 font-normal">
              [{grid.trackCount} {grid.trackCount === 1 ? 'col' : 'cols'} • {grid.childCount} items • {grid.rect.width}px × {grid.rect.height}px]
            </span>
          </div>
        </div>
      ))}
    </>
  );
};
