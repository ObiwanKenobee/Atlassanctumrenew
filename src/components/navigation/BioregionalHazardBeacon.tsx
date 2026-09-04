import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Droplets, 
  Layers, 
  TreePine, 
  Activity, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles,
  Zap,
  RotateCcw,
  BellRing,
  Radio,
  Sliders,
  Cpu
} from 'lucide-react';
import { useBioregionalHazard, BioregionalHazardAlert } from '../../context/BioregionalHazardContext';
import { PageView } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface BioregionalHazardBeaconProps {
  onSelectTab: (tab: PageView) => void;
  className?: string;
}

export const BioregionalHazardBeacon: React.FC<BioregionalHazardBeaconProps> = ({
  onSelectTab,
  className = ''
}) => {
  const { 
    alerts, 
    activeAlerts, 
    criticalCount, 
    warningCount, 
    acknowledgeAlert, 
    dismissAlert,
    simulateBreach,
    resetToNominal
  } = useBioregionalHazard();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const totalActive = activeAlerts.length;
  const hasCritical = criticalCount > 0;

  const handleToggleOpen = () => {
    audioFeedback.playSubtleClick();
    setIsOpen(prev => !prev);
  };

  const getCategoryIcon = (category: BioregionalHazardAlert['category']) => {
    switch (category) {
      case 'water':
        return <Droplets className="w-3.5 h-3.5 text-cyan-400" />;
      case 'soil':
        return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
      case 'canopy':
        return <TreePine className="w-3.5 h-3.5 text-[#C5A059]" />;
      case 'biodiversity':
        return <Activity className="w-3.5 h-3.5 text-purple-400" />;
      case 'energy':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`} ref={dropdownRef}>
      {/* Visual Beacon Trigger in Navigation Bar */}
      <button
        id="bioregional-hazard-beacon-btn"
        onClick={handleToggleOpen}
        aria-label="Bioregional Hazard Monitor"
        aria-expanded={isOpen}
        className={`group relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-full font-mono text-[10px] uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer border ${
          hasCritical
            ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 shadow-[0_0_14px_rgba(244,63,94,0.35)] ring-1 ring-rose-500/40 animate-pulse'
            : totalActive > 0
            ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
            : 'bg-[#121212] hover:bg-[#1A1A1A] border-[#F5F5F0]/15 text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
        }`}
        title="Bioregional Hazard Monitor: Real-time critical biophysical threshold sentinel"
      >
        {/* Pulsing Alert Radar Icon */}
        <div className="relative flex items-center justify-center shrink-0">
          {hasCritical ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-black animate-ping" />
            </>
          ) : totalActive > 0 ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-black" />
            </>
          ) : (
            <Radio className="w-3.5 h-3.5 text-emerald-400 group-hover:text-[#C5A059] transition-colors" />
          )}
        </div>

        {/* Dynamic Warning Badge */}
        <span className="hidden xl:inline">
          {hasCritical ? (
            <span className="text-rose-300 font-bold">
              {criticalCount} CRITICAL {criticalCount === 1 ? 'BREACH' : 'BREACHES'}
            </span>
          ) : totalActive > 0 ? (
            <span className="text-amber-300 font-bold">
              {warningCount} {warningCount === 1 ? 'HAZARD' : 'HAZARDS'}
            </span>
          ) : (
            <span>HAZARDS NOMINAL</span>
          )}
        </span>

        {/* Counter Pill */}
        {totalActive > 0 && (
          <span className={`px-1.5 py-0.2 rounded-full font-mono text-[9px] font-bold ${
            hasCritical 
              ? 'bg-rose-500 text-black shadow-xs' 
              : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
          }`}>
            {totalActive}
          </span>
        )}
      </button>

      {/* Expanded Hazard Drawer / Dropdown Panel */}
      {isOpen && (
        <div 
          id="bioregional-hazard-monitor-panel"
          className="absolute top-full right-0 mt-2 w-[340px] sm:w-[440px] max-h-[85vh] flex flex-col bg-[#0C100D] border border-rose-500/40 rounded-xl shadow-2xl z-50 overflow-hidden font-sans text-xs text-[#F5F5F0] animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Panel Header */}
          <div className="p-3.5 bg-[#121914] border-b border-[#F5F5F0]/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-md ${hasCritical ? 'bg-rose-950 text-rose-400 border border-rose-500/40' : 'bg-amber-950 text-amber-400'}`}>
                <ShieldAlert className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-serif font-bold text-white text-sm flex items-center gap-2">
                  Bioregional Hazard Monitor
                  {hasCritical && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500/50 uppercase">
                      Active Breach
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-neutral-400 font-mono">
                  Autonomous Sentinel Mesh • 5 Monitored Boundaries
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white p-1 rounded-sm cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Bar */}
          <div className="px-3.5 py-2 bg-[#090D0A] border-b border-[#F5F5F0]/10 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() => simulateBreach('water')}
                className="px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                title="Simulate acute hydrological stress spike"
              >
                <Zap className="w-3 h-3 text-rose-400" />
                <span>Simulate Breach</span>
              </button>

              <button
                onClick={resetToNominal}
                className="px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                title="Acknowledge all current alerts"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            </div>

            <span className="text-[10px] text-neutral-400">
              {totalActive} Active {totalActive === 1 ? 'Alert' : 'Alerts'}
            </span>
          </div>

          {/* Alert List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[50vh]">
            {activeAlerts.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold text-white font-serif">All Biophysical Boundaries Nominal</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans max-w-xs mx-auto">
                  Sensory piezometers, soil carbon spectrometers, and canopy radars are reporting within safe ecological thresholds.
                </p>
                <button
                  onClick={() => simulateBreach('water')}
                  className="mt-2 px-3 py-1.5 rounded bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 font-mono text-[10px] font-bold cursor-pointer"
                >
                  Test Hazard Incursion
                </button>
              </div>
            ) : (
              activeAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border transition-all ${
                    alert.severity === 'critical'
                      ? 'bg-rose-950/40 border-rose-500/50 hover:border-rose-500'
                      : 'bg-amber-950/30 border-amber-500/40 hover:border-amber-500'
                  }`}
                >
                  {/* Top line: Category & Severity */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      {getCategoryIcon(alert.category)}
                      <span className="uppercase font-bold text-white">{alert.category} Threshold</span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-neutral-400">{alert.sensorNodeId}</span>
                    </div>

                    <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] uppercase font-bold ${
                      alert.severity === 'critical'
                        ? 'bg-rose-900/80 text-rose-200 border border-rose-500/60'
                        : 'bg-amber-900/80 text-amber-200 border border-amber-500/60'
                    }`}>
                      {alert.severity} ({alert.deviationPct}%)
                    </span>
                  </div>

                  {/* Metric Name & Values */}
                  <div className="text-xs font-bold text-white font-serif">
                    {alert.metricName}
                  </div>

                  <div className="mt-1.5 p-2 rounded bg-black/50 border border-white/5 flex items-center justify-between font-mono text-xs">
                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase block">Observed Value</span>
                      <span className="text-rose-400 font-bold">
                        {alert.currentValue} {alert.unit}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-neutral-400 uppercase block">Safe Tipping Point</span>
                      <span className="text-emerald-400 font-bold">
                        {alert.criticalThreshold} {alert.unit}
                      </span>
                    </div>
                  </div>

                  {/* Recommended Action */}
                  <p className="mt-2 text-[11px] text-neutral-300 font-sans leading-relaxed">
                    <strong className="text-[#C5A059] font-mono text-[10px] uppercase">Mitigation: </strong>
                    {alert.recommendedAction}
                  </p>

                  {/* Footer Actions */}
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2 font-mono text-[10px]">
                    <span className="text-neutral-400 truncate max-w-[140px] text-[9px]">
                      {alert.telemetrySource}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          audioFeedback.playSubtleClick();
                          acknowledgeAlert(alert.id);
                        }}
                        className="px-2 py-1 rounded bg-black/40 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 cursor-pointer transition-colors"
                        title="Acknowledge alert"
                      >
                        Acknowledge
                      </button>

                      <button
                        onClick={() => {
                          audioFeedback.playSubtleClick();
                          setIsOpen(false);
                          onSelectTab(alert.targetTab);
                        }}
                        className="px-2.5 py-1 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <span>Investigate</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-3 bg-[#0A0E0C] border-t border-[#F5F5F0]/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setIsOpen(false);
                onSelectTab('bioregional-ledger');
              }}
              className="text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Open Full Bioregional Ledger</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setIsOpen(false);
                onSelectTab('sentinel');
              }}
              className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Cpu className="w-3 h-3" />
              <span>Dispatch Sentinel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
