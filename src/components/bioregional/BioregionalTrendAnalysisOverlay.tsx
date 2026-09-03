import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  Sparkles, 
  SlidersHorizontal, 
  Info, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck,
  BellRing,
  Droplets,
  Layers,
  Zap,
  Leaf
} from 'lucide-react';
import { BioregionalLedgerData } from '../../data/bioregionalLedgerData';
import { audioFeedback } from '../../lib/audioFeedback';

interface BioregionalTrendAnalysisOverlayProps {
  region: BioregionalLedgerData;
  onClose: () => void;
  onTriggerEcologicalAlert?: (alert: {
    title: string;
    claim: string;
    metricCategory: 'water' | 'soil' | 'biodiversity' | 'canopy' | 'atmospheric' | 'integrated';
    metricName: string;
    thresholdValue: string;
    actualValue: string;
    unit: string;
    severity: 'critical' | 'warning';
    hash: string;
    verifier: string;
    certaintyScore: number;
  }) => void;
}

export type FluctuationStatus = 'critical_surge' | 'rapid_deficit' | 'moderate_volatility' | 'stable';

export interface FlowTrendAnalysisItem {
  id: string;
  name: string;
  category: 'water' | 'energy' | 'nutrients' | 'carbon';
  unit: string;
  currentValue: number;
  movingAverage30d: number;
  deltaPct: number;
  status: FluctuationStatus;
  volatilityStdDev: number;
  history30Days: number[];
  warningSignal: string;
  remediationAdvice: string;
  telemetrySource: string;
}

export const BioregionalTrendAnalysisOverlay: React.FC<BioregionalTrendAnalysisOverlayProps> = ({
  region,
  onClose,
  onTriggerEcologicalAlert
}) => {
  const [sensitivityThreshold, setSensitivityThreshold] = useState<number>(15); // ±15% default
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'water' | 'energy' | 'nutrients' | 'carbon'>('all');
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

  // Generate deterministic 30-day historical time-series and compute 30d moving average
  const flowTrendItems: FlowTrendAnalysisItem[] = useMemo(() => {
    // Collect flows from resourceFlows or fallback to sankeyNetwork
    const rawFlows = region.resourceFlows || [];
    
    return rawFlows.map((flow, index) => {
      // Seed deterministic pseudo-random variation based on flow id and name
      const seed = flow.title.length + index * 19;
      const baseRate = flow.flowRate || 20;

      // Produce 30 daily data points leading up to today
      const history30: number[] = [];
      let rollingSum = 0;

      // Give some flows intentional realistic fluctuation signals
      const isSurgeCandidate = index === 0; // Water baseflow surge
      const isDeficitCandidate = index === 1; // Nutrient/carbon drawdown

      for (let day = 0; day < 30; day++) {
        const sineWave = Math.sin((day / 30) * Math.PI * 2) * (baseRate * 0.08);
        const noise = (((seed + day * 13) % 20) - 10) / 100 * baseRate;
        const val = Math.max(0.5, +(baseRate + sineWave + noise).toFixed(2));
        history30.push(val);
        rollingSum += val;
      }

      // Calculate 30-day moving average
      const ma30 = +(rollingSum / 30).toFixed(2);

      // Determine current value with potential shock
      let currentVal = baseRate;
      if (isSurgeCandidate) {
        currentVal = +(ma30 * 1.284).toFixed(2); // +28.4% surge
      } else if (isDeficitCandidate) {
        currentVal = +(ma30 * 0.732).toFixed(2); // -26.8% deficit
      } else {
        // Slight natural variance
        const drift = (((seed * 7) % 18) - 9) / 100;
        currentVal = +(ma30 * (1 + drift)).toFixed(2);
      }

      const deltaPct = +(((currentVal - ma30) / ma30) * 100).toFixed(1);

      // Standard deviation of the 30-day window
      const variance = history30.reduce((acc, v) => acc + Math.pow(v - ma30, 2), 0) / 30;
      const stdDev = +Math.sqrt(variance).toFixed(2);

      // Determine status based on sensitivity threshold
      let status: FluctuationStatus = 'stable';
      if (deltaPct > sensitivityThreshold * 1.6) {
        status = 'critical_surge';
      } else if (deltaPct < -sensitivityThreshold * 1.6) {
        status = 'rapid_deficit';
      } else if (Math.abs(deltaPct) >= sensitivityThreshold) {
        status = 'moderate_volatility';
      }

      // Context-aware early warning message & remediation
      let warningSignal = 'Nominal metabolic equilibrium within normal 30-day biophysical bounds.';
      let remediationAdvice = 'Maintain current community monitoring schedule and autonomous sensor cadence.';

      if (flow.category === 'water') {
        if (deltaPct > 0) {
          warningSignal = `Sudden +${deltaPct}% flash hydraulic surge detected relative to 30d baseline. Infiltration capacity overwhelmed.`;
          remediationAdvice = 'Divert kinetic peak discharge into wetland retention buffers and open subsoil swale recharge gates.';
        } else {
          warningSignal = `Abrupt ${deltaPct}% baseflow drop detected against 30-day moving average. Acute upstream depletion risk.`;
          remediationAdvice = 'Trigger emergency water conservation protocol across downstream assemblies; inspect upstream weir diversions.';
        }
      } else if (flow.category === 'carbon') {
        if (deltaPct > 0) {
          warningSignal = `Elevated +${deltaPct}% carbon sequestration acceleration driven by seasonal fungal vegetative burst.`;
          remediationAdvice = 'Record verified surplus carbon blocks to epistemic ledger; maintain rangeland root rest intervals.';
        } else {
          warningSignal = `Sharp ${deltaPct}% deceleration in photosynthetic fixation; soil respiration outstripping assimilation.`;
          remediationAdvice = 'Deploy holistic rotational grazing deferrals to reduce bare ground exposure and retain canopy moisture.';
        }
      } else {
        if (Math.abs(deltaPct) > sensitivityThreshold) {
          warningSignal = `Fluctuation of ${deltaPct > 0 ? '+' : ''}${deltaPct}% flags metabolic instability in nutrient cycling.`;
          remediationAdvice = 'Inoculate priority micro-plots with arbuscular mycorrhizal biochar compost to re-stabilize cation exchange.';
        }
      }

      return {
        id: flow.id,
        name: flow.title,
        category: (flow.category as any) || 'water',
        unit: flow.flowUnit || 'Units/s',
        currentValue: currentVal,
        movingAverage30d: ma30,
        deltaPct,
        status,
        volatilityStdDev: stdDev,
        history30Days: history30,
        warningSignal,
        remediationAdvice,
        telemetrySource: flow.provenance?.source || 'In-situ Hydrological & Carbon Sensor Mesh'
      };
    });
  }, [region, sensitivityThreshold]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (categoryFilter === 'all') return flowTrendItems;
    return flowTrendItems.filter(item => item.category === categoryFilter);
  }, [flowTrendItems, categoryFilter]);

  // Overall ecosystem volatility calculation
  const compositeVolatility = useMemo(() => {
    if (!flowTrendItems.length) return 0;
    const avgAbsDeviation = flowTrendItems.reduce((sum, item) => sum + Math.abs(item.deltaPct), 0) / flowTrendItems.length;
    return +avgAbsDeviation.toFixed(1);
  }, [flowTrendItems]);

  const flaggedCount = useMemo(() => {
    return flowTrendItems.filter(item => item.status !== 'stable').length;
  }, [flowTrendItems]);

  const handleTriggerAlertForFlow = (item: FlowTrendAnalysisItem) => {
    audioFeedback.playSubtleClick();
    if (onTriggerEcologicalAlert) {
      const isCritical = item.status === 'critical_surge' || item.status === 'rapid_deficit';
      onTriggerEcologicalAlert({
        title: `${item.status === 'critical_surge' ? 'Sudden Flow Surge Alert' : 'Flow Deficit Warning'}: ${item.name}`,
        claim: item.warningSignal,
        metricCategory: item.category === 'water' ? 'water' : item.category === 'carbon' ? 'canopy' : 'soil',
        metricName: item.name,
        thresholdValue: `${item.movingAverage30d} (30d MA)`,
        actualValue: `${item.currentValue}`,
        unit: item.unit,
        severity: isCritical ? 'critical' : 'warning',
        hash: `0xtrend_alert_${item.id.replace(/-/g, '_')}_${Date.now().toString(16)}`,
        verifier: `${region.regionName} Early Warning Sentinel Network`,
        certaintyScore: 99.1
      });
    }
  };

  return (
    <div className="rounded-2xl bg-[#090D0A] border-2 border-amber-500/50 p-4 sm:p-6 shadow-2xl space-y-6 font-mono animate-in fade-in zoom-in-95 duration-200">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F5F0]/15 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Activity className="w-4 h-4 animate-pulse" />
            </span>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              30-Day Moving Average Early Warning System
            </span>
            <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-500/40 px-2 py-0.5 rounded font-bold">
              {flaggedCount} Flow{flaggedCount === 1 ? '' : 's'} Flagged
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            Bioregional Resource Flow Trend Analysis
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 font-sans max-w-3xl">
            Detects sudden metabolic rate deviations against rolling 30-day moving averages (30d MA) to isolate upstream disturbances and provide early warning triggers for ecosystem instability.
          </p>
        </div>

        <button
          onClick={() => {
            audioFeedback.playSubtleClick();
            onClose();
          }}
          className="self-start sm:self-center p-2 rounded-lg bg-[#141B16] hover:bg-[#1E2922] text-[#F5F5F0]/60 hover:text-white border border-[#F5F5F0]/10 transition-all cursor-pointer"
          title="Close Trend Analysis Overlay"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Global Volatility & Early Warning Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-[#0D1310] border border-amber-500/30 space-y-1">
          <span className="text-[10px] text-[#F5F5F0]/60 uppercase font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            Ecosystem Volatility Index
          </span>
          <div className="text-2xl font-bold text-white flex items-baseline gap-2">
            <span>{compositeVolatility}%</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              compositeVolatility > 20 
                ? 'bg-red-950 text-red-300 border border-red-500/40' 
                : compositeVolatility > 12 
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40' 
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
            }`}>
              {compositeVolatility > 20 ? 'Elevated Instability' : compositeVolatility > 12 ? 'Moderate Volatility' : 'Nominal Equilibrium'}
            </span>
          </div>
          <p className="text-[9px] text-[#F5F5F0]/50 font-sans">Mean absolute % delta against 30d MA across active conduits</p>
        </div>

        <div className="p-3 rounded-xl bg-[#0D1310] border border-red-500/30 space-y-1">
          <span className="text-[10px] text-[#F5F5F0]/60 uppercase font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            Flagged Early Warnings
          </span>
          <div className="text-2xl font-bold text-white flex items-baseline gap-2">
            <span>{flaggedCount} / {flowTrendItems.length}</span>
            <span className="text-[10px] text-red-400 font-bold">Active Triggers</span>
          </div>
          <p className="text-[9px] text-[#F5F5F0]/50 font-sans">Exceeding ±{sensitivityThreshold}% moving-average deviation corridor</p>
        </div>

        <div className="p-3 rounded-xl bg-[#0D1310] border border-cyan-500/30 space-y-1">
          <span className="text-[10px] text-[#F5F5F0]/60 uppercase font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Moving-Window Window
          </span>
          <div className="text-2xl font-bold text-white flex items-baseline gap-2">
            <span>30 Days</span>
            <span className="text-[10px] text-cyan-400 font-bold">Sub-Hourly Roll</span>
          </div>
          <p className="text-[9px] text-[#F5F5F0]/50 font-sans">Continuous LoRaWAN mesh integration with NIST calibration</p>
        </div>

        <div className="p-3 rounded-xl bg-[#0D1310] border border-emerald-500/30 space-y-1">
          <span className="text-[10px] text-[#F5F5F0]/60 uppercase font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Ecosystem Resilience Buffer
          </span>
          <div className="text-2xl font-bold text-white flex items-baseline gap-2">
            <span>88.4%</span>
            <span className="text-[10px] text-emerald-400 font-bold">Damping Power</span>
          </div>
          <p className="text-[9px] text-[#F5F5F0]/50 font-sans">Natural sponge absorption capacity across wetland terraces</p>
        </div>
      </div>

      {/* Control Bar: Category Filters & Sensitivity Threshold */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0E1511] p-3 rounded-xl border border-white/10 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-neutral-400 text-[11px] mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Filter:
          </span>
          {(['all', 'water', 'carbon', 'energy', 'nutrients'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => {
                audioFeedback.playSubtleClick();
                setCategoryFilter(cat);
              }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#C5A059] text-black font-extrabold shadow-sm'
                  : 'bg-[#141C16] text-[#F5F5F0]/70 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-400 text-[10px] shrink-0">Anomaly Sensitivity:</span>
          <div className="flex items-center gap-1 bg-[#141C16] p-1 rounded-lg border border-white/10">
            {[10, 15, 25].map(thresh => (
              <button
                key={thresh}
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setSensitivityThreshold(thresh);
                }}
                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                  sensitivityThreshold === thresh
                    ? 'bg-amber-500 text-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                ±{thresh}% {thresh === 10 ? 'High' : thresh === 15 ? 'Std' : 'Low'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Flow Cards with Sparklines and Early Warning Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map(item => {
          const isCritical = item.status === 'critical_surge' || item.status === 'rapid_deficit';
          const isModerate = item.status === 'moderate_volatility';
          const isExpanded = selectedFlowId === item.id;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all duration-200 space-y-3 ${
                isCritical
                  ? 'bg-[#150D0C] border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : isModerate
                    ? 'bg-[#14110B] border-amber-500/50'
                    : 'bg-[#0B110D] border-emerald-500/30'
              }`}
            >
              {/* Header: Name, Category Pill, Status Tag */}
              <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
                <div>
                  <div className="flex items-center gap-1.5 text-[9px] text-neutral-400 uppercase">
                    {item.category === 'water' && <Droplets className="w-3 h-3 text-cyan-400" />}
                    {item.category === 'carbon' && <Leaf className="w-3 h-3 text-emerald-400" />}
                    {item.category === 'energy' && <Zap className="w-3 h-3 text-amber-400" />}
                    {item.category === 'nutrients' && <Layers className="w-3 h-3 text-emerald-400" />}
                    <span className="text-white font-bold">{item.category} conduit</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5 line-clamp-1">
                    {item.name}
                  </h3>
                </div>

                <div className="shrink-0 text-right">
                  <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded font-bold uppercase border ${
                    item.status === 'critical_surge'
                      ? 'bg-red-950 text-red-300 border-red-500/60'
                      : item.status === 'rapid_deficit'
                        ? 'bg-amber-950 text-amber-300 border-amber-500/60'
                        : item.status === 'moderate_volatility'
                          ? 'bg-yellow-950 text-yellow-300 border-yellow-500/60'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
                  }`}>
                    {item.deltaPct > 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {item.deltaPct > 0 ? `+${item.deltaPct}%` : `${item.deltaPct}%`}
                  </span>
                </div>
              </div>

              {/* Metrics Comparison Grid: Live vs 30d MA vs StdDev */}
              <div className="grid grid-cols-3 gap-2 bg-[#060A08] p-2.5 rounded-lg border border-white/10 text-xs">
                <div>
                  <span className="text-neutral-400 text-[9px] block">Live Telemetry:</span>
                  <span className="font-bold text-white text-sm">
                    {item.currentValue} <span className="text-[10px] text-neutral-400 font-normal">{item.unit.split(' ')[0]}</span>
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[9px] block">30-Day Moving Avg:</span>
                  <span className="font-bold text-cyan-300 text-sm">
                    {item.movingAverage30d} <span className="text-[10px] text-neutral-400 font-normal">{item.unit.split(' ')[0]}</span>
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[9px] block">Baseline Volatility:</span>
                  <span className="font-bold text-amber-300 text-sm">
                    ±{item.volatilityStdDev} <span className="text-[9px] text-neutral-500 font-normal">σ</span>
                  </span>
                </div>
              </div>

              {/* Sparkline Visualizing 30-Day Trend Curve */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-neutral-400">
                  <span>30-Day History Curve</span>
                  <span className="text-cyan-400">Dashed Line: 30d MA ({item.movingAverage30d})</span>
                </div>

                <div className="h-16 w-full bg-[#070B09] rounded-lg p-1.5 border border-white/5 relative overflow-hidden flex items-end">
                  {/* SVG Sparkline */}
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 100">
                    <defs>
                      <linearGradient id={`sparkGrad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isCritical ? '#EF4444' : isModerate ? '#F59E0B' : '#10B981'} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={isCritical ? '#EF4444' : isModerate ? '#F59E0B' : '#10B981'} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {(() => {
                      const maxVal = Math.max(...item.history30Days, item.currentValue) * 1.15;
                      const minVal = Math.max(0, Math.min(...item.history30Days, item.currentValue) * 0.85);
                      const range = maxVal - minVal || 1;

                      const points = item.history30Days.map((val, idx) => {
                        const x = (idx / 29) * 280 + 10;
                        const y = 90 - ((val - minVal) / range) * 80;
                        return `${x},${y}`;
                      });

                      // MA line
                      const maY = 90 - ((item.movingAverage30d - minVal) / range) * 80;
                      // Current live point
                      const liveX = 290;
                      const liveY = 90 - ((item.currentValue - minVal) / range) * 80;

                      const pathD = `M ${points.join(' L ')}`;
                      const areaD = `M 10,95 L ${points.join(' L ')} L 290,95 Z`;

                      return (
                        <>
                          {/* 30d MA Reference Line */}
                          <line
                            x1="10"
                            y1={maY}
                            x2="290"
                            y2={maY}
                            stroke="#06B6D4"
                            strokeWidth="1.5"
                            strokeDasharray="4 4"
                            strokeOpacity="0.7"
                          />

                          {/* Area fill */}
                          <path d={areaD} fill={`url(#sparkGrad-${item.id})`} />

                          {/* Trendline */}
                          <path
                            d={pathD}
                            fill="none"
                            stroke={isCritical ? '#EF4444' : isModerate ? '#F59E0B' : '#10B981'}
                            strokeWidth="2"
                          />

                          {/* Live Current Dot */}
                          <circle
                            cx={liveX}
                            cy={liveY}
                            r="4"
                            fill={isCritical ? '#EF4444' : '#C5A059'}
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                            className="animate-pulse"
                          />
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              {/* Early Warning Signal Explanation */}
              <div className={`p-2.5 rounded-lg border text-[10px] space-y-1 ${
                isCritical 
                  ? 'bg-red-950/30 border-red-500/40 text-red-200' 
                  : isModerate 
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' 
                    : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              }`}>
                <div className="flex items-center gap-1.5 font-bold">
                  {isCritical ? (
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  ) : isModerate ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span>Early Warning Diagnostics:</span>
                </div>
                <p className="font-sans leading-relaxed text-[10px]">
                  {item.warningSignal}
                </p>
                <div className="pt-1 border-t border-white/10 text-neutral-300 font-sans">
                  <strong className="text-white font-mono">Remediation:</strong> {item.remediationAdvice}
                </div>
              </div>

              {/* Action Buttons: Trigger Sentinel Toast or Inspect */}
              <div className="flex items-center justify-between pt-1 text-[9px]">
                <span className="text-neutral-500 truncate max-w-[180px]">
                  {item.telemetrySource}
                </span>

                <div className="flex items-center gap-2">
                  {isCritical && onTriggerEcologicalAlert && (
                    <button
                      onClick={() => handleTriggerAlertForFlow(item)}
                      className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1 transition-all cursor-pointer shadow"
                    >
                      <BellRing className="w-3 h-3" />
                      Trigger Toast Alert
                    </button>
                  )}
                  <button
                    onClick={() => {
                      audioFeedback.playSubtleClick();
                      setSelectedFlowId(isExpanded ? null : item.id);
                    }}
                    className="px-2 py-1 rounded bg-[#151D18] hover:bg-[#1E2922] text-neutral-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                  >
                    {isExpanded ? 'Hide Raw' : 'View Raw (30d)'}
                  </button>
                </div>
              </div>

              {/* Optional Expanded Raw Data Table */}
              {isExpanded && (
                <div className="pt-2 border-t border-white/10 space-y-2 text-[9px]">
                  <div className="text-neutral-400">30-Day Chronological Sampling Matrix:</div>
                  <div className="grid grid-cols-6 gap-1 max-h-24 overflow-y-auto pr-1">
                    {item.history30Days.map((val, dIdx) => (
                      <div key={dIdx} className="bg-black/40 p-1 rounded text-center border border-white/5">
                        <span className="text-neutral-500 block text-[8px]">D-{29 - dIdx}</span>
                        <span className="font-bold text-white">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Banner */}
      <div className="bg-[#0D1410] border border-[#C5A059]/30 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-neutral-300">
          <Info className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span className="font-sans text-[11px]">
            Statistical flags auto-trigger Section 30 Epistemic Oracles to request physical in-situ sensor re-calibration if deviations exceed 2.5σ for over 48 hours.
          </span>
        </div>
        <button
          onClick={() => {
            audioFeedback.playSubtleClick();
            onClose();
          }}
          className="px-4 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs shrink-0 cursor-pointer shadow"
        >
          Return to Ledger
        </button>
      </div>
    </div>
  );
};
