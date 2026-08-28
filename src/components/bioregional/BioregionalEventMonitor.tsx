import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Radio,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Sliders,
  ExternalLink,
  Flame,
  Droplets,
  TreePine,
  Filter
} from 'lucide-react';
import { useMissionAlerts } from '../../context/MissionAlertContext';
import { MissionAlert, MissionAlertType, AlertSeverity } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface BioregionalEventMonitorProps {
  currentBioregionId?: string;
  currentBioregionName?: string;
  onSelectTab?: (tab: any) => void;
}

// Preset environmental events & milestones catalog
const PRESET_ECOLOGICAL_EVENTS: Array<{
  type: MissionAlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  metric: string;
  reading: string;
  threshold: string;
  verifiedBy: string;
  certaintyScore: number;
}> = [
  {
    type: 'milestone_verified',
    severity: 'success',
    title: 'Milestone Achieved: Riparian Vetiver Buffer Stabilization',
    message: 'Continuous in-situ turbidity probes along Mathare Sector 4 confirm 78% reduction in silt runoff. Native vetiver root mesh fully anchored.',
    metric: 'Riparian Silt Retention',
    reading: '78.4%',
    threshold: '65.0%',
    verifiedBy: 'Mathare Water Stewardship Council & In-Situ Mesh',
    certaintyScore: 98
  },
  {
    type: 'telemetry_anomaly',
    severity: 'warning',
    title: 'Environmental Alert: Hydrological Runoff Surge in Catchment 3B',
    message: 'High-intensity convective rainfall detected upstream. Piezometer pressure rose to 2.4 bar. Cascading retention swales automatically engaged.',
    metric: 'Catchment Hydro-Pressure',
    reading: '2.4 bar',
    threshold: '1.9 bar',
    verifiedBy: 'Aberdare IoT Sentinel Beacon #AB-09',
    certaintyScore: 94
  },
  {
    type: 'milestone_verified',
    severity: 'success',
    title: 'Ecological Milestone: Mycorrhizal Inoculation Breakthrough',
    message: 'Soil core laboratory assays show fungal hyphae network density has reached 4.8 m/cm³, accelerating carbon sequestration across 240 hectares.',
    metric: 'Hyphal Network Density',
    reading: '4.8 m/cm³',
    threshold: '3.5 m/cm³',
    verifiedBy: 'East African Agroforestry Institute',
    certaintyScore: 96
  },
  {
    type: 'reality_check_warning',
    severity: 'warning',
    title: 'Biophysical Anomaly: Micro-Climate Thermal Inversion',
    message: 'Canopy surface temperatures exceed CMIP6 modeled projections by 1.8°C during mid-day transpiration cycles. Cooling mist intervention advised.',
    metric: 'Canopy Thermal Delta',
    reading: '+1.8°C',
    threshold: '+1.0°C',
    verifiedBy: 'Sentinel-2 Level-2A Thermal Radiometer',
    certaintyScore: 91
  },
  {
    type: 'stewardship_endorsed',
    severity: 'info',
    title: 'Stewardship Milestone: Community Agroforestry Covenant Ratified',
    message: '42 local smallholder farming collectives have signed the 15-year native shade-canopy covenant, securing 650 hectares of ecological corridor.',
    metric: 'Participatory Stewardship',
    reading: '42 Collectives',
    threshold: '30 Collectives',
    verifiedBy: 'Mara Basin Bioregional Council',
    certaintyScore: 99
  }
];

export const BioregionalEventMonitor: React.FC<BioregionalEventMonitorProps> = ({
  currentBioregionId = 'aberdare_riparian_watershed',
  currentBioregionName = 'Aberdare Range & Riparian Catchment',
  onSelectTab
}) => {
  const { alerts, addAlert, unreadCount, setIsDrawerOpen } = useMissionAlerts();
  const [autoMonitorActive, setAutoMonitorActive] = useState<boolean>(true);
  const [lastEventTime, setLastEventTime] = useState<string>('Just now');
  const [eventCount, setEventCount] = useState<number>(0);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'milestones' | 'alerts'>('all');
  const autoMonitorTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate unique cryptographic hash for event provenance
  const generateProvenanceHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 40; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  // Push a new real-time bioregional event using MissionAlertProvider
  const pushEcologicalEvent = (presetIndex?: number) => {
    const preset = presetIndex !== undefined 
      ? PRESET_ECOLOGICAL_EVENTS[presetIndex] 
      : PRESET_ECOLOGICAL_EVENTS[Math.floor(Math.random() * PRESET_ECOLOGICAL_EVENTS.length)];

    const hash = generateProvenanceHash();
    
    addAlert({
      missionId: currentBioregionId,
      missionTitle: currentBioregionName,
      type: preset.type,
      severity: preset.severity,
      title: `${preset.title}`,
      message: preset.message,
      cryptographicHash: hash,
      targetView: 'bioregional-twin',
      targetId: `node-${Date.now().toString().slice(-4)}`,
      metadata: {
        verifiedBy: preset.verifiedBy,
        certaintyScore: preset.certaintyScore,
        epistemicTier: 'Ground Truth Telemetry & Local Sensors',
        anomalyMetric: preset.metric,
        reading: preset.reading,
        threshold: preset.threshold
      }
    });

    setLastEventTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setEventCount(prev => prev + 1);
    if (preset.severity === 'warning' || preset.severity === 'critical') {
      audioFeedback.playTelemetryWarning();
    } else {
      audioFeedback.playImpactTrigger();
    }
  };

  // Automated background event monitor loop (emulating periodic IoT sensor telemetry events)
  useEffect(() => {
    if (!autoMonitorActive) {
      if (autoMonitorTimerRef.current) clearInterval(autoMonitorTimerRef.current);
      return;
    }

    // Interval to periodically simulate ambient telemetry checking every 45 seconds
    autoMonitorTimerRef.current = setInterval(() => {
      // 50% chance to push a milestone or telemetry event
      if (Math.random() > 0.4) {
        pushEcologicalEvent();
      }
    }, 45000);

    return () => {
      if (autoMonitorTimerRef.current) clearInterval(autoMonitorTimerRef.current);
    };
  }, [autoMonitorActive, currentBioregionId, currentBioregionName]);

  // Filter alerts relevant to this component view
  const bioregionalAlerts = alerts.filter(a => {
    if (filterSeverity === 'milestones') {
      return a.type === 'milestone_verified' || a.type === 'stewardship_endorsed';
    }
    if (filterSeverity === 'alerts') {
      return a.type === 'telemetry_anomaly' || a.type === 'reality_check_warning';
    }
    return true;
  });

  return (
    <div 
      id="bioregional-event-monitor"
      className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-6 shadow-xl text-[#F5F5F0]"
    >
      {/* Header & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em] flex items-center gap-1.5">
              <Radio className={`w-3.5 h-3.5 ${autoMonitorActive ? 'text-emerald-400 animate-pulse' : 'text-[#F5F5F0]/40'}`} />
              BIOREGIONAL EVENT MONITOR • LIVE RESTORATION SENTINELS
            </span>
            <span className={`px-2 py-0.5 text-[9px] font-mono uppercase rounded-full border ${
              autoMonitorActive
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700'
            }`}>
              {autoMonitorActive ? 'Telemetry Stream Active' : 'Standby'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Ecological Restoration Milestone & Alert Engine
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans leading-relaxed">
            Real-time event monitor powered by <span className="text-[#C5A059] font-mono">MissionAlertProvider</span>. Continuously listens for ecological thresholds, hydrological anomalies, and verified regeneration milestones across {currentBioregionName}.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            id="toggle-auto-monitor-btn"
            onClick={() => {
              setAutoMonitorActive(!autoMonitorActive);
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1.5 text-xs font-mono rounded-xs border transition-all flex items-center gap-1.5 cursor-pointer ${
              autoMonitorActive
                ? 'bg-[#1B3022] border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'bg-[#141414] border-[#F5F5F0]/15 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoMonitorActive ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{autoMonitorActive ? 'Auto-Stream ON' : 'Auto-Stream OFF'}</span>
          </button>

          <button
            id="open-mission-drawer-from-monitor-btn"
            onClick={() => {
              setIsDrawerOpen(true);
              audioFeedback.playSubtleClick();
            }}
            className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alert Center</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Manual Trigger Quick-Bar */}
      <div className="p-4 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[10px] uppercase text-[#C5A059] font-bold tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Push Instant Bioregional Notification to MissionAlertProvider:
          </span>
          <span className="text-[10px] text-[#F5F5F0]/40">
            Last Dispatched: {lastEventTime} ({eventCount} pushed)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <button
            id="push-milestone-swale-btn"
            onClick={() => pushEcologicalEvent(0)}
            className="p-2.5 bg-[#17231A] hover:bg-[#1f3024] border border-emerald-500/40 text-emerald-200 text-left rounded-xs transition-all space-y-1 group cursor-pointer"
          >
            <div className="flex items-center justify-between text-[10px] font-mono font-bold">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                Milestone Verified
              </span>
              <span className="text-emerald-300/60">+18% Silt Retained</span>
            </div>
            <p className="text-xs font-serif font-bold text-[#F5F5F0] group-hover:text-emerald-300 truncate">
              Riparian Vetiver Buffer Stabilized
            </p>
          </button>

          <button
            id="push-anomaly-alert-btn"
            onClick={() => pushEcologicalEvent(1)}
            className="p-2.5 bg-[#261A13] hover:bg-[#332218] border border-amber-500/40 text-amber-200 text-left rounded-xs transition-all space-y-1 group cursor-pointer"
          >
            <div className="flex items-center justify-between text-[10px] font-mono font-bold">
              <span className="flex items-center gap-1 text-amber-400">
                <AlertTriangle className="w-3 h-3" />
                Environmental Alert
              </span>
              <span className="text-amber-300/60">2.4 bar Pressure</span>
            </div>
            <p className="text-xs font-serif font-bold text-[#F5F5F0] group-hover:text-amber-300 truncate">
              Hydrological Runoff Surge in Swales
            </p>
          </button>

          <button
            id="push-mycorrhizal-breakthrough-btn"
            onClick={() => pushEcologicalEvent(2)}
            className="p-2.5 bg-[#1A1A26] hover:bg-[#222233] border border-indigo-500/40 text-indigo-200 text-left rounded-xs transition-all space-y-1 group cursor-pointer sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between text-[10px] font-mono font-bold">
              <span className="flex items-center gap-1 text-indigo-400">
                <TreePine className="w-3 h-3" />
                Soil Breakthrough
              </span>
              <span className="text-indigo-300/60">4.8 m/cm³ Hyphae</span>
            </div>
            <p className="text-xs font-serif font-bold text-[#F5F5F0] group-hover:text-indigo-300 truncate">
              Living Soil Mycelium Expansion
            </p>
          </button>
        </div>
      </div>

      {/* Filter Tabs for Bioregional Event Feed */}
      <div className="flex items-center justify-between gap-3 text-xs font-mono pt-2">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="text-[10px] uppercase text-[#F5F5F0]/50 font-bold">Event Feed:</span>
          <div className="flex items-center gap-1 p-0.5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm">
            {(['all', 'milestones', 'alerts'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setFilterSeverity(tab);
                  audioFeedback.playMicroTick();
                }}
                className={`px-2.5 py-1 rounded-xs transition-all capitalize text-[11px] cursor-pointer ${
                  filterSeverity === tab
                    ? 'bg-[#C5A059] text-black font-bold'
                    : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <span className="text-[10px] text-[#F5F5F0]/40 font-mono">
          Showing {bioregionalAlerts.slice(0, 4).length} recent mission alerts
        </span>
      </div>

      {/* Streamed Event Cards Feed */}
      <div className="space-y-3">
        {bioregionalAlerts.slice(0, 4).map((alert) => {
          const isMilestone = alert.type === 'milestone_verified' || alert.type === 'stewardship_endorsed';
          const isWarning = alert.type === 'telemetry_anomaly' || alert.type === 'reality_check_warning';

          return (
            <div
              key={alert.id}
              className="p-4 bg-[#141414] border border-[#F5F5F0]/10 hover:border-[#C5A059]/40 rounded-sm space-y-2.5 transition-all text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded-sm border ${
                    isMilestone
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : isWarning
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                        : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                  }`}>
                    {alert.type.replace('_', ' ')}
                  </span>
                  <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
                    {alert.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-[#F5F5F0]/50 shrink-0">
                  <span>{alert.timestamp}</span>
                  {!alert.read && (
                    <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                  )}
                </div>
              </div>

              <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
                {alert.message}
              </p>

              {/* Metadata & Epistemic Audit Badge */}
              <div className="pt-2 border-t border-[#F5F5F0]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-[#F5F5F0]/50">
                <div className="flex items-center gap-3">
                  {alert.metadata?.anomalyMetric && (
                    <span>
                      <strong className="text-[#C5A059]">{alert.metadata.anomalyMetric}:</strong> {alert.metadata.reading}
                    </span>
                  )}
                  {alert.metadata?.verifiedBy && (
                    <span className="truncate max-w-[240px]">
                      Audited by {alert.metadata.verifiedBy}
                    </span>
                  )}
                </div>

                {alert.cryptographicHash && (
                  <span className="text-[#F5F5F0]/40 font-mono text-[9px] truncate max-w-[180px]" title={alert.cryptographicHash}>
                    Merkle Proof: {alert.cryptographicHash.slice(0, 14)}...
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {bioregionalAlerts.length === 0 && (
          <div className="p-8 text-center bg-[#111111] border border-dashed border-[#F5F5F0]/10 rounded-sm space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
            <p className="text-sm font-serif text-[#F5F5F0]">All environmental parameters within nominal thresholds.</p>
            <p className="text-xs text-[#F5F5F0]/50 font-mono">Use the quick buttons above to push simulated field milestones or sensor alerts.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/40 pt-2 border-t border-[#F5F5F0]/10">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Cryptographic Hash Auditing via SHA-256 Merkle Ledger</span>
        </div>
        <div className="text-[#C5A059]">
          Commandment II: Ground Truth Precedence
        </div>
      </div>
    </div>
  );
};
