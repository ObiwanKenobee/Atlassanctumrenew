import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  X, 
  ChevronRight, 
  ArrowUpRight, 
  Volume2, 
  VolumeX, 
  Compass, 
  Droplets, 
  Layers, 
  TreePine, 
  Activity, 
  Zap, 
  Minimize2, 
  Maximize2,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useBioregionalHazard, BioregionalHazardAlert } from '../../context/BioregionalHazardContext';
import { PageView } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface BioregionalAlertSystemProps {
  onSelectTab: (tab: PageView) => void;
  onOpenObservatory?: () => void;
}

export const BioregionalAlertSystem: React.FC<BioregionalAlertSystemProps> = ({ 
  onSelectTab,
  onOpenObservatory 
}) => {
  const { 
    activeAlerts, 
    sensorFeeds, 
    acknowledgeAlert, 
    dismissAlert,
    resolveSensorBreach,
    deployRemediationAccord,
    activeCriticalBannerAlert,
    resetToNominal
  } = useBioregionalHazard();

  // Find active breached alerts or breached sensors
  const activeBreach = useMemo(() => {
    // If the top header alert banner is already rendering the critical alert,
    // suppress duplicate banner here to prevent stacked recurring banners
    if (activeCriticalBannerAlert) {
      return null;
    }

    if (activeAlerts && activeAlerts.length > 0) {
      return activeAlerts[0];
    }
    const breachedFeed = sensorFeeds.find(s => s.isBreached);
    if (breachedFeed) {
      return {
        id: breachedFeed.id,
        regionId: breachedFeed.basinId,
        regionName: breachedFeed.basinName,
        metricId: breachedFeed.metricType,
        metricName: breachedFeed.name,
        category: breachedFeed.category,
        severity: 'warning' as const,
        currentValue: breachedFeed.currentValue,
        criticalThreshold: breachedFeed.criticalThreshold,
        unit: breachedFeed.unit,
        deviationPct: Math.round(Math.abs((breachedFeed.currentValue - breachedFeed.criticalThreshold) / breachedFeed.criticalThreshold) * 100),
        telemetrySource: breachedFeed.telemetrySource,
        sensorNodeId: breachedFeed.sensorNodeId,
        detectedAt: breachedFeed.lastTelemetryTimestamp,
        status: 'active' as const,
        recommendedAction: breachedFeed.recommendedAction,
        targetTab: 'bioregional-ledger' as PageView,
        cryptographicHash: '0x' + breachedFeed.id.substring(0, 8)
      } as BioregionalHazardAlert;
    }
    return null;
  }, [activeAlerts, sensorFeeds, activeCriticalBannerAlert]);

  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem('atlas_sub_banner_dismissed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [snoozeUntil, setSnoozeUntil] = useState<number | null>(null);

  // Check if currently snoozed or dismissed
  const isSnoozed = snoozeUntil !== null && Date.now() < snoozeUntil;
  const isDismissed = !activeBreach || dismissedIds.includes(activeBreach.id);

  if (!activeBreach || isDismissed || isSnoozed) {
    return null;
  }

  const handleSnooze = (minutes: number = 10) => {
    audioFeedback.playMicroTick();
    setSnoozeUntil(Date.now() + minutes * 60 * 1000);
  };

  const handleDismiss = () => {
    audioFeedback.playMicroTick();
    if (activeBreach?.id) {
      setDismissedIds(prev => {
        const next = [...prev, activeBreach.id];
        try { sessionStorage.setItem('atlas_sub_banner_dismissed', JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
      dismissAlert(activeBreach.id);
    }
  };

  const handleNavigateToHazard = () => {
    audioFeedback.playSubtleClick();
    if (onOpenObservatory) {
      onOpenObservatory();
    } else {
      onSelectTab(activeBreach.targetTab || 'bioregional-ledger');
    }
  };

  const handleResolveBreach = () => {
    audioFeedback.play('actionSuccess');
    if (activeBreach.id) {
      setDismissedIds(prev => {
        const next = [...prev, activeBreach.id];
        try { sessionStorage.setItem('atlas_sub_banner_dismissed', JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
      if (deployRemediationAccord) {
        deployRemediationAccord(activeBreach.sensorNodeId || activeBreach.id);
      } else {
        resolveSensorBreach(activeBreach.id);
        dismissAlert(activeBreach.id);
      }
    }
  };

  const getCategoryIcon = (category: string) => {
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
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  // Minimized non-intrusive chip view
  if (isMinimized) {
    return (
      <div 
        id="bioregional-alert-minimized-banner"
        className="fixed bottom-4 right-4 z-40 animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#121614]/95 border border-amber-500/40 text-neutral-200 shadow-xl backdrop-blur-md text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-bold text-amber-400 truncate max-w-[160px] sm:max-w-[220px]">
            {activeBreach.regionName}: {activeBreach.metricName}
          </span>
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsMinimized(false);
            }}
            title="Expand alert details"
            className="p-1 hover:text-white transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3 h-3 text-neutral-400 hover:text-white" />
          </button>
          <button
            onClick={handleNavigateToHazard}
            title="Investigate in Observatory"
            className="p-1 text-amber-300 hover:text-amber-200 cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Non-intrusive floating notification banner
  return (
    <div 
      id="bioregional-alert-system-banner"
      role="region"
      aria-label="Bioregional Stress Alert"
      className="w-full bg-[#0E1310]/95 border-b border-amber-500/30 text-neutral-200 backdrop-blur-md shadow-lg transition-all duration-300 relative z-30"
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans">
        {/* Left: Indicator & Contextual Details */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/30 shrink-0">
            {getCategoryIcon(activeBreach.category)}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono leading-tight">
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold uppercase tracking-wider">
                ECOLOGICAL STRESS ALERT
              </span>
              <span className="font-bold text-white truncate">{activeBreach.regionName}</span>
              <span className="text-neutral-500 hidden md:inline">•</span>
              <span className="text-neutral-400 font-mono text-[10px] hidden md:inline">
                Node: {activeBreach.sensorNodeId}
              </span>
            </div>

            <p className="text-[12px] text-neutral-300 line-clamp-1 mt-0.5">
              <strong className="text-neutral-100 font-mono">{activeBreach.metricName}</strong>: Current{' '}
              <span className="font-mono font-bold text-amber-300">
                {activeBreach.currentValue} {activeBreach.unit}
              </span>{' '}
              vs critical threshold{' '}
              <span className="font-mono text-neutral-400">
                {activeBreach.criticalThreshold} {activeBreach.unit}
              </span>
              {activeBreach.deviationPct ? (
                <span className="text-amber-400 font-mono ml-1 font-semibold">
                  ({activeBreach.deviationPct}% deviation)
                </span>
              ) : null}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center font-mono text-[11px]">
          <button
            onClick={handleNavigateToHazard}
            className="px-2.5 py-1 rounded bg-[#1B3022] hover:bg-[#254530] text-emerald-300 border border-emerald-500/40 flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
          >
            <span>Investigate</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          <button
            onClick={handleResolveBreach}
            title="Mark telemetry stabilized"
            className="px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span className="hidden md:inline">Acknowledge</span>
          </button>

          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsMinimized(true);
            }}
            title="Minimize to floating indicator"
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDismiss}
            title="Dismiss notification"
            className="p-1 rounded text-neutral-400 hover:text-rose-300 hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
