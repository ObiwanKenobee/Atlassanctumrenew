import React, { useState, useMemo } from 'react';
import { 
  Satellite, 
  Clock, 
  Flame, 
  Droplets, 
  TreePine, 
  Wind, 
  Layers, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Filter, 
  CheckCircle2, 
  Radio, 
  ArrowUpDown, 
  Compass, 
  AlertTriangle, 
  History, 
  Crosshair, 
  TrendingUp, 
  Activity, 
  ShieldAlert,
  Sparkles,
  ArrowLeftRight,
  Tag,
  Scale
} from 'lucide-react';
import { SatelliteHazardAlert } from './BioregionalHazardMonitor';
import { audioFeedback } from '../../lib/audioFeedback';

// Automated Tagging System Helper for Ecological Impact
export function getAutomatedEcologicalTags(alert: Partial<SatelliteHazardAlert>): {
  primary: 'Water Security' | 'Biodiversity' | 'Soil Integrity' | 'Atmospheric Stability' | 'Agrarian Security';
  tags: string[];
} {
  if (alert.primaryEcologicalImpact && alert.ecologicalImpactTags?.length) {
    return {
      primary: alert.primaryEcologicalImpact,
      tags: alert.ecologicalImpactTags
    };
  }

  switch (alert.hazardCategory) {
    case 'thermal_fire':
      return {
        primary: 'Biodiversity',
        tags: ['Biodiversity', 'Wildfire Threat', 'Canopy Biomass', 'Soil Integrity']
      };
    case 'aquifer_deficit':
      return {
        primary: 'Water Security',
        tags: ['Water Security', 'Groundwater Depletion', 'Salinity Intrusion', 'Agrarian Security']
      };
    case 'canopy_stress':
      return {
        primary: 'Biodiversity',
        tags: ['Biodiversity', 'Canopy Moisture', 'Forest Health', 'Carbon Sink']
      };
    case 'methane_plume':
      return {
        primary: 'Atmospheric Stability',
        tags: ['Atmospheric Stability', 'Peat Degassing', 'Methane Column', 'Carbon Flux']
      };
    case 'siltation_surge':
      return {
        primary: 'Soil Integrity',
        tags: ['Soil Integrity', 'Water Security', 'Erosion Siltation', 'Aquatic Buffer']
      };
    default:
      return {
        primary: 'Water Security',
        tags: ['Water Security', 'Ecological Health']
      };
  }
}

interface AlertFeedSidebarProps {
  alerts: SatelliteHazardAlert[];
  selectedAlertId?: string;
  onSelectAlert: (alert: SatelliteHazardAlert) => void;
  onCenterMap: (coordinates: [number, number], alert: SatelliteHazardAlert) => void;
  onForecastImpact?: (alert: SatelliteHazardAlert) => void;
  onCompareAlert?: (alert: SatelliteHazardAlert) => void;
  onOpenPredictiveModel?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

// Sparkline Graph Component for Historical Sensor Readings
interface HazardSparklineProps {
  readings: number[];
  unit: string;
  severity: SatelliteHazardAlert['severity'];
  alertId: string;
}

const HazardSparkline: React.FC<HazardSparklineProps> = ({ readings, unit, severity, alertId }) => {
  if (!readings || readings.length < 2) return null;

  const min = Math.min(...readings);
  const max = Math.max(...readings);
  const range = max - min || 1;
  const width = 84;
  const height = 24;
  const padX = 4;
  const padY = 3;

  // Calculate SVG polyline points
  const points = readings.map((val, idx) => {
    const x = padX + (idx / (readings.length - 1)) * (width - 2 * padX);
    const y = height - padY - ((val - min) / range) * (height - 2 * padY);
    return [Number(x.toFixed(1)), Number(y.toFixed(1))] as [number, number];
  });

  const pathD = points.reduce((acc, [x, y], idx) => {
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1][0]} ${height} L ${points[0][0]} ${height} Z`;

  // Severity color mapping
  const severityColors: Record<SatelliteHazardAlert['severity'], { stroke: string; glow: string; text: string }> = {
    EXISTENTIAL: { stroke: '#E11D48', glow: 'rgba(225, 29, 72, 0.4)', text: 'text-rose-400' },
    CRITICAL: { stroke: '#EF4444', glow: 'rgba(239, 68, 68, 0.35)', text: 'text-red-400' },
    WARNING: { stroke: '#F59E0B', glow: 'rgba(245, 158, 11, 0.3)', text: 'text-amber-400' },
    ADVISORY: { stroke: '#38BDF8', glow: 'rgba(56, 189, 248, 0.3)', text: 'text-sky-400' }
  };

  const palette = severityColors[severity] || severityColors.WARNING;
  const startVal = readings[0];
  const endVal = readings[readings.length - 1];
  const delta = endVal - startVal;
  const isUpward = delta >= 0;

  const [lastX, lastY] = points[points.length - 1];
  const gradId = `spark-grad-${alertId}-${severity}`;

  return (
    <div className="flex items-center justify-between gap-2 px-2 py-1 rounded bg-black/50 border border-white/5 mt-1.5">
      <div className="flex flex-col">
        <span className="text-[8px] font-mono text-[#F5F5F0]/40 uppercase tracking-wider flex items-center gap-1">
          <Activity className="w-2.5 h-2.5 opacity-60" /> Pre-Event Trend
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] font-mono font-bold" style={{ color: palette.stroke }}>
            {endVal}
          </span>
          <span className="text-[8px] font-mono text-[#F5F5F0]/50">{unit}</span>
          <span className={`text-[8px] font-mono font-medium ml-0.5 ${isUpward ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isUpward ? '↗' : '↘'}{Math.abs(delta).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Mini SVG Sparkline Chart */}
      <svg width={width} height={height} className="overflow-visible shrink-0" aria-label="Sensor reading trend sparkline">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.stroke} stopOpacity="0.4" />
            <stop offset="100%" stopColor={palette.stroke} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gradient fill underneath */}
        <path d={areaD} fill={`url(#${gradId})`} />

        {/* Sparkline curve */}
        <path 
          d={pathD} 
          fill="none" 
          stroke={palette.stroke} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* First point marker */}
        <circle cx={points[0][0]} cy={points[0][1]} r="1.5" fill={palette.stroke} opacity="0.6" />

        {/* Final breach point with pulsing halo */}
        <circle cx={lastX} cy={lastY} r="2.5" fill={palette.stroke} />
        <circle cx={lastX} cy={lastY} r="4.5" fill="none" stroke={palette.stroke} strokeWidth="0.8" opacity="0.7" />
      </svg>
    </div>
  );
};

export const AlertFeedSidebar: React.FC<AlertFeedSidebarProps> = ({
  alerts,
  selectedAlertId,
  onSelectAlert,
  onCenterMap,
  onForecastImpact,
  onCompareAlert,
  onOpenPredictiveModel,
  isCollapsed,
  onToggleCollapse
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'EXISTENTIAL' | 'CRITICAL' | 'WARNING' | 'ADVISORY'>('ALL');
  const [impactFilter, setImpactFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Filter and sort alerts chronologically
  const chronologicalAlerts = useMemo(() => {
    let list = [...alerts];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.bioregionName.toLowerCase().includes(q) ||
        a.satelliteMission.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.hazardCategory.toLowerCase().includes(q) ||
        (a.primaryEcologicalImpact && a.primaryEcologicalImpact.toLowerCase().includes(q))
      );
    }

    // Filter by severity
    if (severityFilter !== 'ALL') {
      list = list.filter(a => a.severity === severityFilter);
    }

    // Filter by primary ecological impact
    if (impactFilter !== 'ALL') {
      list = list.filter(a => {
        const { primary } = getAutomatedEcologicalTags(a);
        return primary === impactFilter;
      });
    }

    // Sort chronologically
    list.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [alerts, searchQuery, severityFilter, impactFilter, sortOrder]);

  const getCategoryIcon = (cat: SatelliteHazardAlert['hazardCategory']) => {
    switch (cat) {
      case 'thermal_fire':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'aquifer_deficit':
        return <Droplets className="w-3.5 h-3.5 text-cyan-400" />;
      case 'canopy_stress':
        return <TreePine className="w-3.5 h-3.5 text-emerald-400" />;
      case 'methane_plume':
        return <Wind className="w-3.5 h-3.5 text-purple-400" />;
      case 'siltation_surge':
        return <Layers className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  // Severity Badges with refined color hierarchy
  const getSeverityBadge = (sev: SatelliteHazardAlert['severity']) => {
    switch (sev) {
      case 'EXISTENTIAL':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-950/90 border border-rose-600 text-rose-300 flex items-center gap-1 shadow-sm shadow-rose-950/60">
            <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping" />
            EXISTENTIAL
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-950/80 border border-rose-500/50 text-rose-300 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-rose-400 animate-ping" />
            CRIT
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950/80 border border-amber-500/50 text-amber-300">
            WARN
          </span>
        );
      case 'ADVISORY':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-950/80 border border-blue-500/50 text-blue-300">
            ADV
          </span>
        );
    }
  };

  // Color-coding system: text/borders reflect severity (gold for moderate/warn, red for critical, crimson for existential)
  // Subtle pulse animation applied to EXISTENTIAL hazards for immediate glanceability
  const getSeverityCardStyles = (sev: SatelliteHazardAlert['severity'], isSelected: boolean) => {
    switch (sev) {
      case 'EXISTENTIAL':
        return isSelected
          ? 'bg-[#25070E] border-l-4 border-l-[#E11D48] border-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.45)] ring-1 ring-[#E11D48] animate-[pulse_2.2s_cubic-bezier(0.4,0,0.6,1)_infinite]'
          : 'bg-[#150508]/85 hover:bg-[#1F070D] border-l-4 border-l-[#E11D48] border-t border-b border-rose-900/60 shadow-[0_0_12px_rgba(225,29,72,0.22)] animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]';
      case 'CRITICAL':
        return isSelected
          ? 'bg-[#1F0A0E] border-l-4 border-l-[#EF4444] border-red-800/50 shadow-md shadow-red-950/40 ring-1 ring-[#EF4444]/20'
          : 'bg-[#100507]/60 hover:bg-[#17080A] border-l-3 border-l-[#EF4444] border-t border-b border-red-950/30';
      case 'WARNING':
        return isSelected
          ? 'bg-[#1A1507] border-l-4 border-l-[#F59E0B] border-amber-800/50 shadow-md shadow-amber-950/30 ring-1 ring-[#F59E0B]/20'
          : 'bg-[#0E0C05]/60 hover:bg-[#151107] border-l-3 border-l-[#F59E0B] border-t border-b border-amber-950/30';
      case 'ADVISORY':
        return isSelected
          ? 'bg-[#08151D] border-l-4 border-l-[#38BDF8] border-sky-800/50 ring-1 ring-[#38BDF8]/20'
          : 'bg-[#040C11]/60 hover:bg-[#07121A] border-l-3 border-l-[#38BDF8]/70 border-t border-b border-sky-950/25';
    }
  };

  // Format date helper
  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
           d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-[#0B0F0C] border-r border-[#1B3022] flex flex-col items-center py-4 justify-between transition-all select-none shrink-0">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onToggleCollapse();
            }}
            className="p-2 rounded-lg bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/30 transition-all cursor-pointer"
            title="Expand Alert Feed Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div 
            onClick={() => {
              audioFeedback.playMicroTick();
              onToggleCollapse();
            }}
            className="flex flex-col items-center gap-1 cursor-pointer group"
            title="View Alert Feed"
          >
            <History className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
            <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-mono tracking-widest text-[#F5F5F0]/60 uppercase pt-2">
              Alert Feed ({alerts.length})
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-[10px] font-mono text-[#F5F5F0]/40">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div 
      id="bioregional-alert-feed-sidebar"
      className="w-full sm:w-80 lg:w-88 bg-[#090D0A] border-r border-[#1B3022] flex flex-col transition-all shrink-0 select-none z-10"
    >
      {/* Sidebar Header */}
      <div className="p-3 bg-gradient-to-r from-[#101912] via-[#090D0A] to-[#101912] border-b border-[#1B3022] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
            <History className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-serif font-bold text-[#F5F5F0]">
                Alert Feed
              </h4>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1B3022] border border-[#C5A059]/30 text-[#C5A059] font-bold">
                {chronologicalAlerts.length}
              </span>
            </div>
            <p className="text-[10px] text-[#F5F5F0]/50 font-sans">
              Chronological satellite telemetry ledger
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Predictive Early-Warning Trigger Button */}
          {onOpenPredictiveModel && (
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                onOpenPredictiveModel();
              }}
              className="p-1.5 rounded-md bg-[#1B3022] hover:bg-[#C5A059] text-[#C5A059] hover:text-black border border-[#C5A059]/40 text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              title="Run Gemini Predictive Environmental Trend Model"
            >
              <TrendingUp className="w-3 h-3 animate-pulse" />
              <span className="text-[9px] font-bold">Predict</span>
            </button>
          )}

          {/* Sort Order Toggle */}
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
            }}
            className="p-1.5 rounded-md bg-black/40 hover:bg-white/10 text-[#F5F5F0]/70 border border-white/10 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
            title={`Sort: ${sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}`}
          >
            <ArrowUpDown className="w-3 h-3 text-[#C5A059]" />
            <span className="text-[9px] uppercase">{sortOrder === 'newest' ? 'New' : 'Old'}</span>
          </button>

          {/* Collapse Button */}
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onToggleCollapse();
            }}
            className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-2.5 bg-black/40 border-b border-[#1B3022]/80 space-y-2">
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts, basins, sensors, impact..."
            className="w-full bg-[#0D140F] border border-[#1B3022] focus:border-[#C5A059] rounded-md pl-7 pr-2.5 py-1 text-[11px] font-mono text-[#F5F5F0] placeholder:text-[#F5F5F0]/30 outline-none transition-colors"
          />
        </div>

        {/* Severity filter chips: ALL, EXISTENTIAL, CRITICAL, WARNING, ADVISORY */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="text-[8px] font-mono text-[#F5F5F0]/40 uppercase shrink-0">Severity:</span>
          {(['ALL', 'EXISTENTIAL', 'CRITICAL', 'WARNING', 'ADVISORY'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => {
                audioFeedback.playMicroTick();
                setSeverityFilter(sev);
              }}
              className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono uppercase whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                severityFilter === sev
                  ? sev === 'EXISTENTIAL'
                    ? 'bg-rose-700 text-white font-bold shadow-sm shadow-rose-950'
                    : sev === 'CRITICAL'
                    ? 'bg-red-700 text-white font-bold'
                    : 'bg-[#C5A059] text-black font-bold'
                  : 'bg-black/40 hover:bg-white/5 text-[#F5F5F0]/60 border border-white/5'
              }`}
            >
              {sev === 'EXISTENTIAL' ? 'EXIST' : sev}
            </button>
          ))}
        </div>

        {/* Automated Ecological Impact Tag Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="text-[8px] font-mono text-[#F5F5F0]/40 uppercase shrink-0">Impact:</span>
          {(['ALL', 'Water Security', 'Biodiversity', 'Soil Integrity', 'Atmospheric Stability', 'Agrarian Security'] as const).map(impact => (
            <button
              key={impact}
              onClick={() => {
                audioFeedback.playMicroTick();
                setImpactFilter(impact);
              }}
              className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                impactFilter === impact
                  ? 'bg-emerald-800 text-white font-bold border border-emerald-500'
                  : 'bg-black/40 hover:bg-white/5 text-[#F5F5F0]/60 border border-white/5'
              }`}
            >
              {impact === 'ALL' ? 'All Impacts' : impact}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Alert Feed Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#1B3022]/30 max-h-[500px]">
        {chronologicalAlerts.length === 0 ? (
          <div className="p-6 text-center text-[#F5F5F0]/40 font-mono text-[11px]">
            No satellite alerts matching criteria.
          </div>
        ) : (
          chronologicalAlerts.map((alert) => {
            const isSelected = selectedAlertId === alert.id;
            const cardStyles = getSeverityCardStyles(alert.severity, isSelected);
            const { primary: primaryImpact } = getAutomatedEcologicalTags(alert);

            return (
              <div
                key={alert.id}
                onClick={() => {
                  audioFeedback.playMicroTick();
                  onSelectAlert(alert);
                  onCenterMap(alert.coordinates, alert);
                }}
                className={`p-3 transition-all cursor-pointer relative group ${cardStyles}`}
              >
                {/* Ping beacon for existential alerts */}
                {alert.severity === 'EXISTENTIAL' && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                  </span>
                )}

                {/* Header row: Category Icon + Bioregion + Severity Badge */}
                <div className="flex items-start justify-between gap-1.5 pr-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="p-1 rounded bg-black/60 border border-white/10 shrink-0">
                      {getCategoryIcon(alert.hazardCategory)}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#F5F5F0] truncate max-w-[145px]">
                      {alert.bioregionName}
                    </span>
                  </div>
                  {getSeverityBadge(alert.severity)}
                </div>

                {/* Pre-Event Indicator if active */}
                {alert.isPreEvent && (
                  <div className="mt-1 flex items-center gap-1">
                    <span className="px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold bg-rose-950/90 border border-rose-500 text-rose-300 animate-pulse">
                      PRE-EVENT HORIZON
                    </span>
                    {alert.hoursToBreach && (
                      <span className="text-[8.5px] font-mono text-rose-400">
                        (~{alert.hoursToBreach}h to breach)
                      </span>
                    )}
                  </div>
                )}

                {/* Title styled with subtle glanceable contrast */}
                <div className={`mt-1 text-xs font-serif line-clamp-2 leading-snug ${
                  alert.severity === 'EXISTENTIAL'
                    ? 'text-rose-100 font-medium'
                    : alert.severity === 'CRITICAL'
                    ? 'text-red-100 font-medium'
                    : alert.severity === 'WARNING'
                    ? 'text-amber-100/95'
                    : 'text-[#F5F5F0]/90'
                }`}>
                  {alert.title}
                </div>

                {/* Automated Ecological Impact Tag Badge */}
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono flex items-center gap-1 border ${
                    primaryImpact === 'Water Security'
                      ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300'
                      : primaryImpact === 'Biodiversity'
                      ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                      : primaryImpact === 'Soil Integrity'
                      ? 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                      : primaryImpact === 'Atmospheric Stability'
                      ? 'bg-purple-950/70 border-purple-500/40 text-purple-300'
                      : 'bg-yellow-950/70 border-yellow-500/40 text-yellow-300'
                  }`}>
                    <Tag className="w-2.5 h-2.5 opacity-80" />
                    <span>{primaryImpact}</span>
                  </span>
                </div>

                {/* Data-driven Sparkline Graph of Sensor Readings */}
                {alert.trendReadings && alert.trendReadings.length > 1 && (
                  <HazardSparkline
                    readings={alert.trendReadings}
                    unit={alert.trendUnit || ''}
                    severity={alert.severity}
                    alertId={alert.id}
                  />
                )}

                {/* Mission & Time Ago */}
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50">
                  <span className="text-[#C5A059]/90 font-medium truncate max-w-[130px]">
                    {alert.satelliteMission}
                  </span>
                  <span className="flex items-center gap-1 text-[9px]">
                    <Clock className="w-2.5 h-2.5 text-[#C5A059]" />
                    {alert.timeAgo}
                  </span>
                </div>

                {/* Coordinate Readout & Quick Actions */}
                <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between gap-1 text-[9px] font-mono flex-wrap">
                  <span className="text-[#F5F5F0]/40 flex items-center gap-1">
                    <Compass className="w-2.5 h-2.5 text-[#C5A059]" />
                    {alert.coordinates[0].toFixed(2)}°, {alert.coordinates[1].toFixed(2)}°
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Forecast Impact Action */}
                    {onForecastImpact && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          audioFeedback.playMicroTick();
                          onForecastImpact(alert);
                        }}
                        className="px-1.5 py-0.5 rounded bg-[#101F15] hover:bg-[#1B3022] text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-1 cursor-pointer"
                        title="Simulate downstream infrastructure impact with Gemini"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Forecast</span>
                      </button>
                    )}

                    {/* Compare Hazard Action */}
                    {onCompareAlert && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          audioFeedback.playMicroTick();
                          onCompareAlert(alert);
                        }}
                        className="px-1.5 py-0.5 rounded bg-black/50 hover:bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/30 transition-all flex items-center gap-1 cursor-pointer"
                        title="Compare sensor trends side-by-side with another alert"
                      >
                        <ArrowLeftRight className="w-2.5 h-2.5" />
                        <span>Compare</span>
                      </button>
                    )}

                    {/* Locate Map Action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audioFeedback.playMicroTick();
                        onSelectAlert(alert);
                        onCenterMap(alert.coordinates, alert);
                      }}
                      className="px-1.5 py-0.5 rounded bg-[#1B3022] hover:bg-[#C5A059] hover:text-black text-[#C5A059] border border-[#C5A059]/30 transition-all flex items-center gap-1 cursor-pointer"
                      title="Center Geographic Map to this hazard"
                    >
                      <Crosshair className="w-2.5 h-2.5" />
                      <span>Locate</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-2.5 bg-[#060907] border-t border-[#1B3022] flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50">
        <span className="flex items-center gap-1 text-emerald-400">
          <Radio className="w-2.5 h-2.5 animate-pulse" /> Live Telemetry Synced
        </span>
        <span className="text-[#C5A059]">PRSP Certified</span>
      </div>
    </div>
  );
};
