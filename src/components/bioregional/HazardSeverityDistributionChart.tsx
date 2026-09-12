import React, { useMemo } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  BarChart3, 
  Filter, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { SatelliteHazardAlert } from './BioregionalHazardMonitor';
import { audioFeedback } from '../../lib/audioFeedback';

interface HazardSeverityDistributionChartProps {
  alerts: SatelliteHazardAlert[];
  activeSeverityFilter: 'ALL' | 'EXISTENTIAL' | 'CRITICAL' | 'WARNING' | 'ADVISORY';
  onSelectSeverityFilter: (sev: 'ALL' | 'EXISTENTIAL' | 'CRITICAL' | 'WARNING' | 'ADVISORY') => void;
  className?: string;
}

export const HazardSeverityDistributionChart: React.FC<HazardSeverityDistributionChartProps> = ({
  alerts,
  activeSeverityFilter,
  onSelectSeverityFilter,
  className = ''
}) => {
  // Compute distribution over the past 30 days
  const stats = useMemo(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    
    // Filter alerts occurring within the past 30 days
    const past30DaysAlerts = alerts.filter(a => {
      const alertTime = new Date(a.timestamp).getTime();
      return !isNaN(alertTime) && alertTime >= thirtyDaysAgo;
    });

    const existentialAlerts = past30DaysAlerts.filter(a => a.severity === 'EXISTENTIAL');
    const criticalAlerts = past30DaysAlerts.filter(a => a.severity === 'CRITICAL');
    // Moderate includes WARNING and ADVISORY tiers
    const moderateAlerts = past30DaysAlerts.filter(a => a.severity === 'WARNING' || a.severity === 'ADVISORY');

    const total = past30DaysAlerts.length || 1;
    const existentialCount = existentialAlerts.length;
    const criticalCount = criticalAlerts.length;
    const moderateCount = moderateAlerts.length;

    const maxCount = Math.max(existentialCount, criticalCount, moderateCount, 1);

    return {
      totalAlertsIn30Days: past30DaysAlerts.length,
      existential: {
        count: existentialCount,
        pct: Math.round((existentialCount / total) * 100),
        barWidth: Math.max(12, Math.round((existentialCount / maxCount) * 100))
      },
      critical: {
        count: criticalCount,
        pct: Math.round((criticalCount / total) * 100),
        barWidth: Math.max(12, Math.round((criticalCount / maxCount) * 100))
      },
      moderate: {
        count: moderateCount,
        pct: Math.round((moderateCount / total) * 100),
        barWidth: Math.max(12, Math.round((moderateCount / maxCount) * 100))
      }
    };
  }, [alerts]);

  const handleBarClick = (target: 'EXISTENTIAL' | 'CRITICAL' | 'MODERATE') => {
    audioFeedback.playMicroTick();
    if (target === 'EXISTENTIAL') {
      onSelectSeverityFilter(activeSeverityFilter === 'EXISTENTIAL' ? 'ALL' : 'EXISTENTIAL');
    } else if (target === 'CRITICAL') {
      onSelectSeverityFilter(activeSeverityFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL');
    } else {
      // Moderate defaults to WARNING or toggles to ALL
      onSelectSeverityFilter(activeSeverityFilter === 'WARNING' || activeSeverityFilter === 'ADVISORY' ? 'ALL' : 'WARNING');
    }
  };

  const isModerateActive = activeSeverityFilter === 'WARNING' || activeSeverityFilter === 'ADVISORY';

  return (
    <div 
      id="hazard-severity-distribution-chart"
      className={`p-3.5 bg-[#0A0E0B] border border-[#1B3022] hover:border-[#C5A059]/30 rounded-xl transition-all shadow-inner ${className}`}
    >
      {/* Header & 30-Day Context */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#1B3022]/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#1B3022]/70 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-[#F5F5F0] flex items-center gap-1.5">
              <span>Severity Frequency Distribution</span>
              <span className="text-[10px] font-sans font-normal text-[#C5A059]">
                (30-Day Window)
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-[#F5F5F0]/70">
            <Calendar className="w-3 h-3 text-[#C5A059]" />
            <span className="text-[#C5A059] font-bold">{stats.totalAlertsIn30Days}</span>
            <span className="text-[#F5F5F0]/50">30d Total</span>
          </div>

          {activeSeverityFilter !== 'ALL' && (
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                onSelectSeverityFilter('ALL');
              }}
              className="text-[10px] font-mono text-[#C5A059] hover:text-[#D4AF37] flex items-center gap-1 bg-[#1B3022]/60 px-2 py-0.5 rounded border border-[#C5A059]/30 hover:border-[#C5A059] cursor-pointer transition-colors"
              title="Reset severity filter"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset ({activeSeverityFilter})</span>
            </button>
          )}
        </div>
      </div>

      {/* Distribution Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
        {/* 1. Existential Severity */}
        <div
          onClick={() => handleBarClick('EXISTENTIAL')}
          className={`p-2.5 rounded-lg border transition-all cursor-pointer select-none group ${
            activeSeverityFilter === 'EXISTENTIAL'
              ? 'bg-rose-950/60 border-rose-500 shadow-md ring-1 ring-rose-500/40'
              : 'bg-black/40 border-rose-900/30 hover:border-rose-700/60 hover:bg-rose-950/20'
          }`}
          title="Click to filter by Existential alerts"
        >
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="font-bold text-rose-300">Existential</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-[#F5F5F0]">{stats.existential.count}</span>
              <span className="text-[#F5F5F0]/40 text-[10px]">({stats.existential.pct}%)</span>
            </div>
          </div>

          {/* Bar track and fill */}
          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden p-0.5 border border-rose-900/40">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-rose-700 to-rose-500 transition-all duration-500 shadow-sm"
              style={{ width: `${stats.existential.barWidth}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-[#F5F5F0]/40 mt-1">
            <span>Critical tipping point</span>
            <span className="text-rose-400/80 group-hover:underline">
              {activeSeverityFilter === 'EXISTENTIAL' ? 'Filtered ●' : 'Filter'}
            </span>
          </div>
        </div>

        {/* 2. Critical Severity */}
        <div
          onClick={() => handleBarClick('CRITICAL')}
          className={`p-2.5 rounded-lg border transition-all cursor-pointer select-none group ${
            activeSeverityFilter === 'CRITICAL'
              ? 'bg-orange-950/60 border-orange-500 shadow-md ring-1 ring-orange-500/40'
              : 'bg-black/40 border-orange-900/30 hover:border-orange-700/60 hover:bg-orange-950/20'
          }`}
          title="Click to filter by Critical alerts"
        >
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <span className="font-bold text-orange-300">Critical</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-[#F5F5F0]">{stats.critical.count}</span>
              <span className="text-[#F5F5F0]/40 text-[10px]">({stats.critical.pct}%)</span>
            </div>
          </div>

          {/* Bar track and fill */}
          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden p-0.5 border border-orange-900/40">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-orange-700 to-orange-400 transition-all duration-500 shadow-sm"
              style={{ width: `${stats.critical.barWidth}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-[#F5F5F0]/40 mt-1">
            <span>Severe threshold breach</span>
            <span className="text-orange-400/80 group-hover:underline">
              {activeSeverityFilter === 'CRITICAL' ? 'Filtered ●' : 'Filter'}
            </span>
          </div>
        </div>

        {/* 3. Moderate Severity (Warning & Advisory) */}
        <div
          onClick={() => handleBarClick('MODERATE')}
          className={`p-2.5 rounded-lg border transition-all cursor-pointer select-none group ${
            isModerateActive
              ? 'bg-amber-950/60 border-amber-500 shadow-md ring-1 ring-amber-500/40'
              : 'bg-black/40 border-amber-900/30 hover:border-amber-700/60 hover:bg-amber-950/20'
          }`}
          title="Click to filter by Moderate (Warning & Advisory) alerts"
        >
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-bold text-amber-300">Moderate</span>
              <span className="text-[9px] text-[#F5F5F0]/40 font-normal">(Warn/Adv)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-[#F5F5F0]">{stats.moderate.count}</span>
              <span className="text-[#F5F5F0]/40 text-[10px]">({stats.moderate.pct}%)</span>
            </div>
          </div>

          {/* Bar track and fill */}
          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden p-0.5 border border-amber-900/40">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-700 to-amber-400 transition-all duration-500 shadow-sm"
              style={{ width: `${stats.moderate.barWidth}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-[#F5F5F0]/40 mt-1">
            <span>Early warning & advisory</span>
            <span className="text-amber-400/80 group-hover:underline">
              {isModerateActive ? 'Filtered ●' : 'Filter'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
