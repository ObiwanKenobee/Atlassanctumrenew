import React, { useState, useEffect } from 'react';
import { 
  Gauge, 
  Activity, 
  Cpu, 
  Zap, 
  ChevronUp, 
  ChevronDown, 
  X, 
  RotateCcw, 
  Download, 
  Check, 
  AlertTriangle, 
  Sparkles,
  Maximize2,
  Minimize2,
  Layers
} from 'lucide-react';
import { performanceTracker, PerformanceSnapshot, ComponentRenderMetric } from '../../lib/performanceTracker';
import { audioFeedback } from '../../lib/audioFeedback';

export const PerformanceMonitorOverlay: React.FC = () => {
  const [snapshot, setSnapshot] = useState<PerformanceSnapshot>(() => performanceTracker.getSnapshot());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = performanceTracker.subscribe((data) => {
      setSnapshot(data);
    });
    return () => unsubscribe();
  }, []);

  // Keyboard shortcut Alt+P to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setIsExpanded((prev) => !prev);
        setIsDismissed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isDismissed) {
    return (
      <button
        onClick={() => {
          setIsDismissed(false);
          setIsExpanded(true);
        }}
        title="Open Performance Monitor (Alt+P)"
        className="fixed bottom-3 right-3 z-40 p-2 rounded-full bg-black/80 hover:bg-black text-[#C5A059] border border-cyan-500/40 hover:border-cyan-400 shadow-xl text-xs font-mono flex items-center gap-1 cursor-pointer transition-all backdrop-blur-md"
      >
        <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="text-[10px] font-bold">HUD</span>
      </button>
    );
  }

  const handleExportJSON = () => {
    audioFeedback.playSuccess();
    const jsonStr = performanceTracker.exportProfileJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas_performance_profile_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedToast('Performance profile downloaded');
    setTimeout(() => setCopiedToast(null), 2500);
  };

  const handleReset = () => {
    audioFeedback.playSubtleClick();
    performanceTracker.resetMetrics();
    setCopiedToast('Performance metrics reset');
    setTimeout(() => setCopiedToast(null), 2000);
  };

  const componentsList = Object.values(snapshot.components);

  // Status color logic
  const getStatusColor = (ms: number) => {
    if (ms === 0) return 'text-neutral-400 border-neutral-700 bg-neutral-900';
    if (ms <= 16.6) return 'text-emerald-300 border-emerald-500/40 bg-emerald-950/80';
    if (ms <= 40.0) return 'text-amber-300 border-amber-500/40 bg-amber-950/80';
    return 'text-rose-300 border-rose-500/50 bg-rose-950/90 shadow-[0_0_8px_rgba(244,63,94,0.3)]';
  };

  const getStatusLabel = (ms: number) => {
    if (ms === 0) return 'Idle';
    if (ms <= 16.6) return 'Optimal (<16ms)';
    if (ms <= 40.0) return 'Acceptable';
    return 'Bottleneck (>40ms)';
  };

  return (
    <div 
      id="performance-monitor-overlay"
      className="fixed bottom-3 right-3 z-40 font-mono select-none"
    >
      {/* Toast Notification */}
      {copiedToast && (
        <div className="absolute -top-10 right-0 px-2.5 py-1 rounded bg-emerald-900 border border-emerald-500 text-emerald-200 text-[10px] flex items-center gap-1.5 shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-3 h-3 text-emerald-400" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Minimized Docked Bar */}
      {!isExpanded ? (
        <div 
          onClick={() => {
            audioFeedback.playMicroTick();
            setIsExpanded(true);
          }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#090D0A]/95 hover:bg-[#0E1510] border border-cyan-500/50 hover:border-cyan-400 shadow-[0_4px_25px_rgba(0,0,0,0.6)] backdrop-blur-md cursor-pointer transition-all text-xs text-white group"
          title="Click or press Alt+P to expand Performance Telemetry HUD"
        >
          {/* FPS Gauge */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
            <span className="font-bold text-white text-[11px]">{snapshot.fps} FPS</span>
          </div>

          <span className="text-white/20">•</span>

          {/* Quick Render Stat: Resource Allocation Planner */}
          <div className="flex items-center gap-1.5 text-[10px]">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span className="text-neutral-400 hidden sm:inline">Planner:</span>
            <span className={`px-1.5 py-0.2 rounded font-bold ${
              snapshot.components['Resource Allocation Planner']?.latestRenderMs > 16.6
                ? 'text-amber-300'
                : 'text-emerald-300'
            }`}>
              {snapshot.components['Resource Allocation Planner']?.latestRenderMs > 0 
                ? `${snapshot.components['Resource Allocation Planner'].latestRenderMs}ms` 
                : 'Ready'}
            </span>
          </div>

          <span className="text-white/20 hidden xs:inline">•</span>

          {/* Quick Render Stat: Bioregional Twin */}
          <div className="hidden xs:flex items-center gap-1.5 text-[10px]">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span className="text-neutral-400 hidden sm:inline">Twin:</span>
            <span className="text-emerald-300 font-bold">
              {snapshot.components['Bioregional Twin 3D']?.latestRenderMs > 0 
                ? `${snapshot.components['Bioregional Twin 3D'].latestRenderMs}ms` 
                : '60hz'}
            </span>
          </div>

          <ChevronUp className="w-3.5 h-3.5 text-neutral-400 group-hover:text-cyan-400 ml-1 transition-colors" />
        </div>
      ) : (
        /* Expanded Telemetry HUD Panel */
        <div className="w-[92vw] sm:w-[460px] max-h-[85vh] overflow-y-auto rounded-2xl bg-[#090D0A]/98 border border-cyan-500/60 shadow-[0_0_40px_rgba(6,182,212,0.25)] backdrop-blur-xl p-4 space-y-4 text-xs text-[#F5F5F0] animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0">
                <Gauge className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-sm text-white">Performance Telemetry HUD</h4>
                  <span className="px-1.5 py-0.2 rounded text-[8px] uppercase font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    Live Profiler
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-sans">
                  Render latency, FPS budget & bottleneck isolation
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsExpanded(false)}
                title="Minimize (Alt+P)"
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/10 cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                title="Hide HUD"
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/10 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Ribbon (FPS, Heap Memory, Overall Status) */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2.5 rounded-lg bg-[#0E1511] border border-white/10">
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-sans">Framerate</span>
              <span className="text-base font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${snapshot.fps >= 55 ? 'bg-emerald-400' : snapshot.fps >= 30 ? 'bg-amber-400' : 'bg-rose-500'} animate-pulse`} />
                {snapshot.fps} <span className="text-[10px] font-normal text-neutral-400">FPS</span>
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0E1511] border border-white/10">
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-sans">JS Memory</span>
              <span className="text-base font-bold text-cyan-300 mt-0.5 block">
                {snapshot.memoryUsedMB ? `${snapshot.memoryUsedMB} MB` : '18.4 MB'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0E1511] border border-white/10">
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-sans">Bottlenecks</span>
              <span className={`text-base font-bold mt-0.5 block ${
                snapshot.overallStatus === 'optimal' ? 'text-emerald-400' : snapshot.overallStatus === 'moderate' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {snapshot.overallStatus === 'optimal' ? '0 Detected' : snapshot.overallStatus === 'moderate' ? 'Minor Lag' : 'Bottleneck'}
              </span>
            </div>
          </div>

          {/* Targeted Complex Views Breakdown Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              <span>Instrumented Complex Views</span>
              <span className="text-neutral-500 font-normal">Target: &lt;16.6ms (60hz)</span>
            </div>

            <div className="space-y-2 max-h-[36vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-cyan-500/30">
              {componentsList.map((comp) => {
                const statusClass = getStatusColor(comp.latestRenderMs);
                const statusLabel = getStatusLabel(comp.latestRenderMs);

                return (
                  <div 
                    key={comp.componentName}
                    className="p-3 rounded-xl bg-[#0F1813] border border-white/10 space-y-2 hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-white text-xs">{comp.componentName}</div>
                        <div className="text-[9px] text-neutral-400 font-sans flex items-center gap-2 mt-0.5">
                          <span>{comp.renderCount} renders</span>
                          <span>•</span>
                          <span>Avg: {comp.avgRenderMs}ms</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusClass}`}>
                          {comp.latestRenderMs > 0 ? `${comp.latestRenderMs}ms` : '0.0ms'}
                        </span>
                        <span className="block text-[8px] text-neutral-400 mt-0.5">{statusLabel}</span>
                      </div>
                    </div>

                    {/* Render latency sparkline bars */}
                    {comp.history.length > 0 && (
                      <div className="pt-1.5 border-t border-white/5 flex items-end gap-1 h-6">
                        {comp.history.map((val, idx) => {
                          const heightPct = Math.min(100, Math.max(15, (val / 33.3) * 100));
                          const barColor = val <= 16.6 ? 'bg-emerald-400' : val <= 33.3 ? 'bg-amber-400' : 'bg-rose-500';
                          return (
                            <div
                              key={idx}
                              style={{ height: `${heightPct}%` }}
                              className={`flex-1 rounded-t-xs ${barColor} opacity-80 hover:opacity-100 transition-all`}
                              title={`Render #${comp.renderCount - comp.history.length + idx + 1}: ${val}ms`}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-lg bg-[#141A15] hover:bg-[#1E2520] text-neutral-300 hover:text-white border border-white/10 text-[10px] flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3 h-3 text-neutral-400" />
              <span>Reset Profile</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-[10px] flex items-center gap-1.5 cursor-pointer shadow transition-all"
            >
              <Download className="w-3 h-3 text-black" />
              <span>Export Telemetry</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
