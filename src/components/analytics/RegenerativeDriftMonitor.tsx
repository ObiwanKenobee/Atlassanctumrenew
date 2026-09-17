import React, { useState } from 'react';
import { 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  TrendingDown, 
  TrendingUp, 
  ArrowRight, 
  Activity, 
  Sliders, 
  RefreshCw, 
  HelpCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface RegenerativeDriftMetric {
  id: string;
  name: string;
  category: 'ecological' | 'hydrological' | 'carbon' | 'economic' | 'biodiversity';
  bioregionName: string;
  plannedTarget: number;
  actualMetric: number;
  unit: string;
  driftPercentage: number; // e.g. -14.3%
  status: 'nominal' | 'moderate_drift' | 'significant_divergence';
  divergenceDirection: 'underperforming' | 'nominal' | 'overperforming';
  rootCause: string;
  correctiveIntervention: string;
  stewardQuorumRequirement: string;
  confidenceInterval: string;
  lastAuditedTimestamp: string;
}

export const REGENERATIVE_DRIFT_METRICS: RegenerativeDriftMetric[] = [
  {
    id: 'drift-soil-carbon',
    name: 'Soil Organic Carbon (SOC) Saturation',
    category: 'carbon',
    bioregionName: 'Sahel Belt & Savanna',
    plannedTarget: 4.2,
    actualMetric: 3.6,
    unit: 'tCO2e/ha',
    driftPercentage: -14.3,
    status: 'significant_divergence',
    divergenceDirection: 'underperforming',
    rootCause: 'Delayed monsoon precipitation coupled with supply chain bottlenecks in localized biochar pyrolysis inoculation batches.',
    correctiveIntervention: 'Deploy mobile pyrolysis kiln units to Tillabéri and expedite mycorrhizal spore dispersal via drone seeding.',
    stewardQuorumRequirement: 'Sahel Biochar Commons Council (Quorum: 5 of 7 Stewards)',
    confidenceInterval: '±0.12 tCO2e/ha (96.4% confidence via 48 core samples)',
    lastAuditedTimestamp: '2026-09-16 14:30 UTC'
  },
  {
    id: 'drift-baseflow',
    name: 'Riparian River Subterranean Baseflow',
    category: 'hydrological',
    bioregionName: 'Mara Basin',
    plannedTarget: 210.0,
    actualMetric: 184.2,
    unit: 'm³/s',
    driftPercentage: -12.3,
    status: 'significant_divergence',
    divergenceDirection: 'underperforming',
    rootCause: 'Upstream illegal irrigation diversions during dry-season transit, decreasing downstream groundwater infiltration.',
    correctiveIntervention: 'Activate ultrasonic flow metering valves and increase Mara riverbank community patrol rotations.',
    stewardQuorumRequirement: 'Mara Water Resource Users Association (WRUA)',
    confidenceInterval: '±2.4 m³/s (Acoustic Doppler Piezometer Mesh)',
    lastAuditedTimestamp: '2026-09-17 01:15 UTC'
  },
  {
    id: 'drift-dividend',
    name: 'Pastoralist Direct Carbon Dividend',
    category: 'economic',
    bioregionName: 'Maasai Mara',
    plannedTarget: 30.0,
    actualMetric: 24.5,
    unit: '$/ha/mo',
    driftPercentage: -18.3,
    status: 'significant_divergence',
    divergenceDirection: 'underperforming',
    rootCause: 'Exchange liquidity delay on secondary voluntary carbon clearinghouse; payment smart contracts queued pending multi-sig signoff.',
    correctiveIntervention: 'Release emergency sovereign liquidity buffer to guarantee uninterrupted monthly household payments.',
    stewardQuorumRequirement: 'Maasai Mara Elder Guardians & Treasury Signers',
    confidenceInterval: '100% on-chain audit trail (Zero-Knowledge Disbursals)',
    lastAuditedTimestamp: '2026-09-16 19:45 UTC'
  },
  {
    id: 'drift-bioacoustic',
    name: 'Native Avian & Bioacoustic Density',
    category: 'biodiversity',
    bioregionName: 'Great Rift Valley Lakes',
    plannedTarget: 90.0,
    actualMetric: 82.5,
    unit: 'HSI Index',
    driftPercentage: -8.3,
    status: 'moderate_drift',
    divergenceDirection: 'underperforming',
    rootCause: 'Seasonal fluctuations in lake salinity levels causing temporary dispersal of lesser flamingo and micro-crustacean colonies.',
    correctiveIntervention: 'Adjust upstream siltation traps and maintain wetland buffer vegetation density.',
    stewardQuorumRequirement: 'Rift Eco-Acoustic Monitoring Mesh',
    confidenceInterval: '±1.2 HSI (184 acoustic nodes continuous streaming)',
    lastAuditedTimestamp: '2026-09-17 03:00 UTC'
  },
  {
    id: 'drift-decoupling',
    name: 'Macro Decoupling Acceleration Margin',
    category: 'ecological',
    bioregionName: 'Pan-African Green Corridor',
    plannedTarget: 55.0,
    actualMetric: 51.2,
    unit: 'pts',
    driftPercentage: -6.9,
    status: 'moderate_drift',
    divergenceDirection: 'underperforming',
    rootCause: 'Spike in imported cement usage during modular housing foundation pours before local compressed-earth blocks came fully online.',
    correctiveIntervention: 'Mandate 100% geopolymer and hemp-lime mixes for all Phase 2 construction batches.',
    stewardQuorumRequirement: 'Bioregional Architecture Synthesis Board',
    confidenceInterval: '±0.8 pts verified against sovereign customs registries',
    lastAuditedTimestamp: '2026-09-17 04:20 UTC'
  },
  {
    id: 'drift-canopy',
    name: 'Montane Cloud Forest Catchment Canopy',
    category: 'ecological',
    bioregionName: 'Aberdare Highlands',
    plannedTarget: 0.84,
    actualMetric: 0.82,
    unit: 'NDVI',
    driftPercentage: -2.4,
    status: 'nominal',
    divergenceDirection: 'nominal',
    rootCause: 'Minor localized leaf senescence within normal seasonal oscillation band.',
    correctiveIntervention: 'Routine drone surveillance; no critical intervention warranted at current variance.',
    stewardQuorumRequirement: 'Aberdare Forest Guardians',
    confidenceInterval: '±0.01 NDVI (ESA Sentinel-2 Multispectral)',
    lastAuditedTimestamp: '2026-09-17 05:00 UTC'
  }
];

interface RegenerativeDriftMonitorProps {
  onLogMitigation?: (metric: RegenerativeDriftMetric) => void;
  className?: string;
}

export const RegenerativeDriftMonitor: React.FC<RegenerativeDriftMonitorProps> = ({
  onLogMitigation,
  className = ''
}) => {
  const [driftToleranceThreshold, setDriftToleranceThreshold] = useState<number>(8.0); // alert when drift > 8%
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'divergent' | 'moderate' | 'nominal'>('divergent');
  const [expandedMetricId, setExpandedMetricId] = useState<string | null>('drift-soil-carbon');
  const [loggedMitigations, setLoggedMitigations] = useState<Record<string, boolean>>({});

  const filteredMetrics = REGENERATIVE_DRIFT_METRICS.filter(metric => {
    const absDrift = Math.abs(metric.driftPercentage);
    if (selectedFilter === 'divergent') return absDrift >= driftToleranceThreshold;
    if (selectedFilter === 'moderate') return absDrift >= 3.0 && absDrift < driftToleranceThreshold;
    if (selectedFilter === 'nominal') return absDrift < 3.0;
    return true;
  });

  const criticalDivergenceCount = REGENERATIVE_DRIFT_METRICS.filter(
    m => Math.abs(m.driftPercentage) >= driftToleranceThreshold
  ).length;

  const handleLogMitigation = (metric: RegenerativeDriftMetric) => {
    audioFeedback.playCovenantResonance();
    setLoggedMitigations(prev => ({ ...prev, [metric.id]: true }));
    if (onLogMitigation) {
      onLogMitigation(metric);
    }
  };

  return (
    <div 
      id="regenerative-drift-monitor-card"
      className={`bg-[#0E1310] border border-amber-500/40 rounded-md p-5 shadow-2xl space-y-4 ${className}`}
    >
      {/* Header & Watchdog Alert Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F5F5F0]/10">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 border ${
            criticalDivergenceCount > 0 
              ? 'bg-rose-950/80 border-rose-500 text-rose-400 animate-pulse' 
              : 'bg-emerald-950/80 border-emerald-500 text-emerald-400'
          }`}>
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                EPISTEMIC DRIFT WATCHDOG • TARGET DIVERGENCE DETECTION
              </span>
              {criticalDivergenceCount > 0 ? (
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/50 font-bold uppercase animate-pulse">
                  {criticalDivergenceCount} Significant Divergence{criticalDivergenceCount > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold uppercase">
                  All Targets Within Nominal Tolerance
                </span>
              )}
            </div>
            <h3 className="text-base font-serif font-bold text-white">
              Regenerative Drift Monitor
            </h3>
          </div>
        </div>

        {/* Sensitivity Tolerance Slider */}
        <div className="flex items-center gap-2 bg-[#141A16] px-3 py-1.5 rounded border border-[#F5F5F0]/10 text-xs font-mono">
          <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="text-[#F5F5F0]/60 text-[11px]">Tolerance:</span>
          <input
            type="range"
            min={3}
            max={15}
            step={1}
            value={driftToleranceThreshold}
            onChange={(e) => {
              setDriftToleranceThreshold(Number(e.target.value));
              audioFeedback.playMicroTick();
            }}
            className="w-20 h-1.5 accent-[#C5A059] cursor-pointer"
          />
          <span className="text-[#C5A059] font-bold">{driftToleranceThreshold}%</span>
        </div>
      </div>

      {/* Narrative & Tolerance Explanation */}
      <div className="p-3 bg-[#151A14] border-l-2 border-amber-500 rounded-r text-xs text-[#F5F5F0]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Continuously compares telemetry ground truth against covenant projections. Divergences beyond <strong>{driftToleranceThreshold}%</strong> require immediate quorum review and root-cause mitigation.
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {(['all', 'divergent', 'moderate', 'nominal'] as const).map(filterKey => (
            <button
              key={filterKey}
              type="button"
              onClick={() => {
                setSelectedFilter(filterKey);
                audioFeedback.playMicroTick();
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors cursor-pointer border ${
                selectedFilter === filterKey 
                  ? 'bg-[#C5A059] text-black border-[#C5A059] font-bold'
                  : 'bg-[#101411] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              {filterKey}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Divergence Table & Expandable Remediation Drawer */}
      <div className="space-y-2.5">
        {filteredMetrics.length === 0 ? (
          <div className="p-6 text-center text-xs font-mono text-[#F5F5F0]/50 bg-[#121614] rounded border border-[#F5F5F0]/10">
            No metrics currently match the selected drift filter ({selectedFilter}). All monitored indicators are operating within tolerance.
          </div>
        ) : (
          filteredMetrics.map(metric => {
            const isExpanded = expandedMetricId === metric.id;
            const isMitigated = loggedMitigations[metric.id];
            const isCritical = Math.abs(metric.driftPercentage) >= driftToleranceThreshold;
            const isModerate = Math.abs(metric.driftPercentage) >= 3.0 && !isCritical;

            return (
              <div 
                key={metric.id}
                className={`rounded border transition-all ${
                  isCritical 
                    ? 'bg-[#171112] border-rose-500/40 hover:border-rose-500'
                    : isModerate
                      ? 'bg-[#17140F] border-amber-500/40 hover:border-amber-500'
                      : 'bg-[#0E1511] border-emerald-500/30 hover:border-emerald-500/60'
                }`}
              >
                {/* Row Summary */}
                <div 
                  onClick={() => {
                    setExpandedMetricId(isExpanded ? null : metric.id);
                    audioFeedback.playMicroTick();
                  }}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border ${
                      isCritical
                        ? 'bg-rose-950 text-rose-400 border-rose-500/50'
                        : isModerate
                          ? 'bg-amber-950 text-amber-400 border-amber-500/50'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                    }`}>
                      {isCritical ? (
                        <AlertTriangle className="w-4 h-4 animate-bounce" />
                      ) : isModerate ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-white">
                          {metric.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-[#C5A059] border border-[#C5A059]/30">
                          {metric.bioregionName}
                        </span>
                        {isMitigated && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-200 border border-emerald-400/40">
                            MITIGATION QUEUED
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#F5F5F0]/50 font-sans mt-0.5">
                        Planned Target: <strong>{metric.plannedTarget} {metric.unit}</strong> • Ground Truth: <strong>{metric.actualMetric} {metric.unit}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Drift Percentage Pill & Accordion Toggle */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <div className={`text-sm font-mono font-bold ${
                        isCritical ? 'text-rose-400' : isModerate ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {metric.driftPercentage > 0 ? `+${metric.driftPercentage.toFixed(1)}` : metric.driftPercentage.toFixed(1)}% Drift
                      </div>
                      <div className="text-[9px] font-mono text-[#F5F5F0]/40 uppercase">
                        {metric.status.replace('_', ' ')}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded text-[#F5F5F0]/60 hover:text-white"
                      title="Toggle root-cause analysis"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-[#F5F5F0]/10 bg-black/30 space-y-3 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-[#131714] rounded border border-[#F5F5F0]/10">
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                          Root Cause Epistemic Diagnosis
                        </span>
                        <p className="text-[11px] text-[#F5F5F0]/80 font-sans leading-relaxed">
                          {metric.rootCause}
                        </p>
                      </div>

                      <div className="p-3 bg-[#131714] rounded border border-emerald-500/20">
                        <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                          Recommended Corrective Intervention
                        </span>
                        <p className="text-[11px] text-[#F5F5F0]/80 font-sans leading-relaxed">
                          {metric.correctiveIntervention}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-[11px] font-mono text-[#F5F5F0]/60">
                      <div>
                        <span>Audited: <strong>{metric.lastAuditedTimestamp}</strong></span> • 
                        <span className="ml-2">Margin: <strong>{metric.confidenceInterval}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isMitigated}
                          onClick={() => handleLogMitigation(metric)}
                          className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isMitigated
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 opacity-70 cursor-not-allowed'
                              : 'bg-[#C5A059] hover:bg-[#d4b068] text-black shadow'
                          }`}
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{isMitigated ? 'Mitigation Ratified' : 'Log Mitigation to Evidence Ledger'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
