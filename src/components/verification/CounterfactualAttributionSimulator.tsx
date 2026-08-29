import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale,
  RefreshCw,
  Clock,
  Layers,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface CounterfactualMetrics {
  metricName: string;
  unit: string;
  observedInterventionValue: number;
  syntheticControlValue: number;
  grossObservedGain: number;
  exogenousBaselineShift: number;
  netAttributableGain: number;
  confidenceInterval: [number, number];
  pValue: number;
  methodology: string;
}

const SAMPLE_CAUSAL_METRICS: CounterfactualMetrics[] = [
  {
    metricName: 'Soil Glomalin Aggregate Density',
    unit: 'mg/g soil',
    observedInterventionValue: 18.2,
    syntheticControlValue: 7.4,
    grossObservedGain: 10.8,
    exogenousBaselineShift: 1.2, // e.g. El Niño general moisture increase
    netAttributableGain: 9.6, // True attributable contribution
    confidenceInterval: [8.9, 10.4],
    pValue: 0.001,
    methodology: 'Synthetic Difference-in-Differences (SDID) across 14 unmanaged terrace controls'
  },
  {
    metricName: 'Downstream Riparian Siltation Runoff',
    unit: 'NTU turbidity',
    observedInterventionValue: 28.5,
    syntheticControlValue: 94.0,
    grossObservedGain: -65.5,
    exogenousBaselineShift: -8.0, // Regional seasonal rain drop
    netAttributableGain: -57.5,
    confidenceInterval: [-62.1, -52.8],
    pValue: 0.004,
    methodology: 'Coupled Hydro-Acoustic Gauges & Remote Sensing Turbidity Index'
  },
  {
    metricName: 'Indigenous Canopy Stratification',
    unit: '% canopy closure',
    observedInterventionValue: 74.0,
    syntheticControlValue: 31.0,
    grossObservedGain: 43.0,
    exogenousBaselineShift: 3.5,
    netAttributableGain: 39.5,
    confidenceInterval: [36.0, 43.2],
    pValue: 0.002,
    methodology: 'Drone LiDAR Point Cloud vs Pre-intervention 2024 Baseline'
  },
  {
    metricName: 'Endemic Bongo Corridors Utilization',
    unit: 'nocturnal crossings / mo',
    observedInterventionValue: 16.0,
    syntheticControlValue: 2.1,
    grossObservedGain: 13.9,
    exogenousBaselineShift: 0.4,
    netAttributableGain: 13.5,
    confidenceInterval: [11.2, 15.8],
    pValue: 0.008,
    methodology: 'Bio-Acoustic Array & AI Trap Cam Re-identification'
  }
];

export const CounterfactualAttributionSimulator: React.FC<{
  projectName?: string;
  bioregionName?: string;
  onMintVerifiedCredential?: () => void;
}> = ({
  projectName = 'Aberdare Ridge Riparian Recovery & Agroforestry Mesh',
  bioregionName = 'Aberdare Range & Upper Tana Basin',
  onMintVerifiedCredential
}) => {
  const [activeMetricIndex, setActiveMetricIndex] = useState<number>(0);
  const [climateVariationFactor, setClimateVariationFactor] = useState<number>(1.0); // 0.5x to 1.5x
  const [controlGroupRigor, setControlGroupRigor] = useState<'Standard' | 'Synthetic DiD' | 'Micro-Catchment Matched'>('Synthetic DiD');
  const [activeTab, setActiveTab] = useState<'simulator' | 'causal_chain' | 'methodology'>('simulator');

  const currentMetric = SAMPLE_CAUSAL_METRICS[activeMetricIndex];

  // Dynamically compute counterfactual adjusted values based on user scenario slider
  const adjustedExogenous = Number((currentMetric.exogenousBaselineShift * climateVariationFactor).toFixed(1));
  const adjustedObserved = Number((currentMetric.observedInterventionValue).toFixed(1));
  const adjustedControl = Number((currentMetric.syntheticControlValue + (adjustedExogenous)).toFixed(1));
  const adjustedNetAttribution = Number((adjustedObserved - adjustedControl).toFixed(1));
  const attributionRatio = Math.min(100, Math.max(0, Math.round((adjustedNetAttribution / (adjustedObserved - currentMetric.syntheticControlValue || 1)) * 100)));

  return (
    <div className="bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm p-6 space-y-6 text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
              PHASE 04 VERIFICATION • CAUSAL ATTRIBUTION DECOMPOSITION
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Counterfactual & Synthetic Control Simulator
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans">
            Distinguishing <span className="text-[#C5A059] font-medium">Activity → Output → Outcome → Attribution → Contribution</span> to ensure no false ecological claims are credited to baseline climate drift.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          {onMintVerifiedCredential && (
            <button
              onClick={() => {
                audioFeedback.playSuccess();
                onMintVerifiedCredential();
              }}
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black text-xs font-mono font-bold uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Attest & Mint Credential</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-nav tabs */}
      <div className="flex items-center gap-2 border-b border-[#F5F5F0]/10 pb-2 text-xs font-mono">
        <button
          onClick={() => {
            setActiveTab('simulator');
            audioFeedback.playSubtleClick();
          }}
          className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40 font-bold'
              : 'text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
          }`}
        >
          1. Synthetic Control Simulator
        </button>
        <button
          onClick={() => {
            setActiveTab('causal_chain');
            audioFeedback.playSubtleClick();
          }}
          className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
            activeTab === 'causal_chain'
              ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40 font-bold'
              : 'text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
          }`}
        >
          2. Causal Stage Decomposition
        </button>
        <button
          onClick={() => {
            setActiveTab('methodology');
            audioFeedback.playSubtleClick();
          }}
          className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
            activeTab === 'methodology'
              ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40 font-bold'
              : 'text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
          }`}
        >
          3. Epistemic Verification Ledger
        </button>
      </div>

      {activeTab === 'simulator' && (
        <div className="space-y-6">
          {/* Metric Selector Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SAMPLE_CAUSAL_METRICS.map((m, idx) => {
              const isSelected = idx === activeMetricIndex;
              return (
                <button
                  key={m.metricName}
                  onClick={() => {
                    setActiveMetricIndex(idx);
                    audioFeedback.playSubtleClick();
                  }}
                  className={`p-3 rounded-xs text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#151B15] border-[#C5A059] shadow-md'
                      : 'bg-[#111] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
                  }`}
                >
                  <span className="text-[9px] font-mono uppercase text-[#C5A059] block truncate">
                    Indicator #{idx + 1}
                  </span>
                  <div className="text-xs font-serif font-bold text-[#F5F5F0] truncate mt-0.5">
                    {m.metricName}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 mt-1">
                    +{Math.abs(m.netAttributableGain)} {m.unit} (Net)
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Simulation Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#121212] p-5 rounded-sm border border-[#F5F5F0]/10">
            {/* Left Col: Parameter Sliders */}
            <div className="space-y-5 lg:border-r lg:border-[#F5F5F0]/10 lg:pr-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase text-[#C5A059] font-bold">
                  Exogenous Stressors
                </h3>
                <span className="text-[10px] text-[#F5F5F0]/40 font-mono">Real-time Sensitivity</span>
              </div>

              {/* Slider: Regional Climate/Rainfall Shift */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#F5F5F0]/70">Exogenous Climatic Drift:</span>
                  <span className="text-[#C5A059] font-bold">{climateVariationFactor}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.1"
                  value={climateVariationFactor}
                  onChange={(e) => {
                    setClimateVariationFactor(parseFloat(e.target.value));
                    audioFeedback.playMicroTick();
                  }}
                  className="w-full accent-[#C5A059] bg-[#222] h-1.5 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-[#F5F5F0]/40">
                  <span>0.5x (Severe Drought)</span>
                  <span>1.0x (Historical)</span>
                  <span>1.8x (Wet Surge)</span>
                </div>
              </div>

              {/* Control Group Rigor Selection */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#F5F5F0]/70 block">
                  Counterfactual Algorithm Rigor:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Standard', 'Synthetic DiD', 'Micro-Catchment Matched'] as const).map((rigor) => (
                    <button
                      key={rigor}
                      onClick={() => {
                        setControlGroupRigor(rigor);
                        audioFeedback.playSubtleClick();
                      }}
                      className={`px-2 py-1.5 rounded-xs text-[10px] font-mono transition-all cursor-pointer ${
                        controlGroupRigor === rigor
                          ? 'bg-[#C5A059] text-black font-bold'
                          : 'bg-[#1C1C1C] text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                      }`}
                    >
                      {rigor}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statistical Confidence Metrics */}
              <div className="p-3 bg-[#181818] border border-[#F5F5F0]/10 rounded-xs space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-[#F5F5F0]/60">
                  <span>Attribution Confidence:</span>
                  <span className="text-emerald-400 font-bold">p = {currentMetric.pValue} (Significant)</span>
                </div>
                <div className="flex justify-between text-[#F5F5F0]/60">
                  <span>95% CI Range:</span>
                  <span className="text-[#F5F5F0]">[{currentMetric.confidenceInterval[0]}, {currentMetric.confidenceInterval[1]}]</span>
                </div>
                <div className="flex justify-between text-[#F5F5F0]/60">
                  <span>Peer Controls Used:</span>
                  <span className="text-[#C5A059]">14 Matched Quadrants</span>
                </div>
              </div>
            </div>

            {/* Middle & Right: Visual Comparison & True Contribution Score */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-serif font-bold text-[#F5F5F0]">
                  {currentMetric.metricName} Attribution Breakdown
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xs">
                  {attributionRatio}% True Project Attributability
                </span>
              </div>

              {/* Comparative Visual Graph Bars */}
              <div className="space-y-3 font-mono text-xs">
                {/* 1. Observed with Intervention */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Intervention Site (Atlas Managed):
                    </span>
                    <span className="text-emerald-300 font-bold">
                      {adjustedObserved} {currentMetric.unit}
                    </span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] h-4 rounded-xs overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (adjustedObserved / (adjustedObserved * 1.1)) * 90)}%` }}
                    />
                  </div>
                </div>

                {/* 2. Synthetic Control (What would have happened anyway) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8FB8DE] font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#8FB8DE]" />
                      Synthetic Control Baseline (Unmanaged Natural Drift):
                    </span>
                    <span className="text-[#8FB8DE] font-bold">
                      {adjustedControl} {currentMetric.unit}
                    </span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] h-4 rounded-xs overflow-hidden flex">
                    <div
                      className="bg-[#8FB8DE]/70 h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (adjustedControl / (adjustedObserved * 1.1)) * 90)}%` }}
                    />
                  </div>
                </div>

                {/* 3. True Causal Delta */}
                <div className="p-3 bg-[#151D16] border border-emerald-500/30 rounded-xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-emerald-400/80 uppercase tracking-wider font-bold block">
                      Net Attributable Ecological Lift
                    </span>
                    <p className="text-xs text-[#F5F5F0]/80">
                      Isolated from background weather variations and natural baseline regrowth.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-emerald-300">
                      {adjustedNetAttribution > 0 ? `+${adjustedNetAttribution}` : adjustedNetAttribution}
                    </span>
                    <span className="text-[10px] block text-emerald-400/60 font-mono">{currentMetric.unit}</span>
                  </div>
                </div>
              </div>

              {/* Methodology Capsule */}
              <div className="text-[11px] font-mono text-[#F5F5F0]/60 bg-[#161616] p-3 rounded-xs border border-[#F5F5F0]/5 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#C5A059]">Verification Protocol:</strong> {currentMetric.methodology}. Data calibrated against Sentinel-2 SAR radar and local piezometer sensor array.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'causal_chain' && (
        <div className="space-y-4">
          <div className="text-xs font-mono text-[#F5F5F0]/60">
            Atlas decomposes each intervention along 5 verifiable stages to prevent predatory outcome appropriation:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              {
                step: '01',
                title: 'Activity',
                desc: '12,400 Podocarpus and Vetiver plugs planted on ridge slopes.',
                verifier: 'GPS photo timestamp & labor payroll log',
                status: 'Verified'
              },
              {
                step: '02',
                title: 'Output',
                desc: '45km linear bio-swale terrace established with zero breach.',
                verifier: 'Drone LiDAR survey contour map',
                status: 'Verified'
              },
              {
                step: '03',
                title: 'Outcome',
                desc: 'Downstream river turbidity dropped 65.5 NTU over 6 months.',
                verifier: 'Automated water quality sensor telemetry',
                status: 'Observed'
              },
              {
                step: '04',
                title: 'Attribution',
                desc: 'Exogenous rainfall drop accounts for 8.0 NTU; Net +57.5 NTU isolated.',
                verifier: 'Synthetic Difference-in-Differences Engine',
                status: 'Mathematically Isolated'
              },
              {
                step: '05',
                title: 'Contribution',
                desc: 'Credits minted strictly on the +57.5 NTU net delta; zero over-claim.',
                verifier: 'Atlas Multi-Party Attestation Ledger',
                status: 'Mint-Ready'
              }
            ].map((stage, idx) => (
              <div
                key={stage.step}
                className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-xs space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#C5A059] font-bold">
                    STAGE {stage.step}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded-xs border border-emerald-500/30">
                    {stage.status}
                  </span>
                </div>
                <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
                  {stage.title}
                </h4>
                <p className="text-xs text-[#F5F5F0]/70 leading-relaxed font-sans">
                  {stage.desc}
                </p>
                <div className="pt-2 border-t border-[#F5F5F0]/10 text-[10px] font-mono text-[#C5A059]/80">
                  Proof: {stage.verifier}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'methodology' && (
        <div className="p-5 bg-[#121212] border border-[#F5F5F0]/10 rounded-xs space-y-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm font-serif">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Atlas Epistemic Verification Standard (EVS-4)</span>
          </div>
          <p className="text-[#F5F5F0]/80 leading-relaxed font-sans text-sm">
            Traditional carbon and biodiversity markets suffer from severe baseline manipulation and leakage. Atlas enforces synthetic control calibration: each project quadrant is mathematically linked to 10+ unmanaged control quadrants with matching slope, rainfall, and soil classification.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-[#181818] rounded-xs border border-[#F5F5F0]/10">
              <span className="text-[10px] text-[#C5A059] font-bold uppercase block">Non-Linear Leakage Guard</span>
              <p className="text-[11px] text-[#F5F5F0]/70 mt-1">Monitors a 25km buffer perimeter to verify degradation did not merely shift adjacent to protected areas.</p>
            </div>
            <div className="p-3 bg-[#181818] rounded-xs border border-[#F5F5F0]/10">
              <span className="text-[10px] text-[#C5A059] font-bold uppercase block">Double-Count Prevention</span>
              <p className="text-[11px] text-[#F5F5F0]/70 mt-1">Claims are bounded by cryptographically unique polygon hashes stored in the Firestore Immutable Ledger.</p>
            </div>
            <div className="p-3 bg-[#181818] rounded-xs border border-[#F5F5F0]/10">
              <span className="text-[10px] text-[#C5A059] font-bold uppercase block">Permanence Reserve Tranche</span>
              <p className="text-[11px] text-[#F5F5F0]/70 mt-1">20% of all generated ecological credits are locked in a sovereign buffer pool against wildfire or drought risk.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
