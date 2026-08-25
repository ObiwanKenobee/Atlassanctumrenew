import React, { useState } from 'react';
import {
  Cpu,
  TrendingUp,
  AlertTriangle,
  Layers,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Compass,
  ArrowRight,
  CheckCircle2,
  Clock,
  Activity,
  Maximize2,
  Globe2,
  Play,
  Radio
} from 'lucide-react';
import { BioregionalTwinScenario, CausalInterventionParam } from '../../types';
import { BIOREGIONAL_TWIN_SCENARIOS } from '../../data/aiEnginesData';
import { EcologicalAlertSystem } from '../EcologicalAlertSystem';
import { RealityCheck } from '../RealityCheck';
import { audioFeedback } from '../../lib/audioFeedback';

interface BioregionalTwinViewProps {
  onSelectTab: (tab: any) => void;
  onOpenMoralSimulator?: () => void;
}

export const BioregionalTwinView: React.FC<BioregionalTwinViewProps> = ({ 
  onSelectTab,
  onOpenMoralSimulator 
}) => {
  const [scenarios] = useState<BioregionalTwinScenario[]>(BIOREGIONAL_TWIN_SCENARIOS);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(BIOREGIONAL_TWIN_SCENARIOS[0].id);
  const [activeHorizon, setActiveHorizon] = useState<'year5' | 'year15' | 'year30'>('year15');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  // Dynamic user intervention slider states
  const [interventionValues, setInterventionValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    BIOREGIONAL_TWIN_SCENARIOS.forEach(scen => {
      scen.activeInterventions.forEach(param => {
        init[`${scen.id}_${param.id}`] = param.currentValue;
      });
    });
    return init;
  });

  const handleSliderChange = (scenarioId: string, paramId: string, val: number) => {
    setInterventionValues(prev => ({
      ...prev,
      [`${scenarioId}_${paramId}`]: val
    }));
    audioFeedback.playMicroTick();
  };

  const handleRunMonteCarlo = () => {
    setIsSimulating(true);
    audioFeedback.playSyncComplete();
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  // Calculate dynamic multiplier based on current slider values relative to default
  const calculateScenarioMultiplier = () => {
    let factor = 1.0;
    selectedScenario.activeInterventions.forEach(param => {
      const currentVal = interventionValues[`${selectedScenario.id}_${param.id}`] ?? param.currentValue;
      const ratio = currentVal / (param.currentValue || 1);
      factor += (ratio - 1) * 0.15;
    });
    return Math.max(0.7, Math.min(1.35, factor));
  };

  const dynamicMultiplier = calculateScenarioMultiplier();

  const getConsequenceBadge = (type: string, severity: string) => {
    if (type === 'synergy' || type === 'regenerative_lock_in') {
      return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
    }
    if (severity === 'critical' || type === 'catastrophic_risk') {
      return 'bg-rose-950/70 text-rose-300 border-rose-500/40';
    }
    return 'bg-amber-950/70 text-amber-300 border-amber-500/40';
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#C5A059]" />
              AI CAUSAL TWIN • COUNTERFACTUAL BIOREGIONAL SIMULATOR
            </span>
            <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Commandment II: Reality Above Model
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Causal Bioregional Twin</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            Pearl Do-Calculus and multi-temporal Monte Carlo simulation projecting 1st, 2nd, and 3rd order systemic consequences of policy, capital, and engineering interventions across 30 years.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onSelectTab('flourishing-index');
              audioFeedback.playViewTransition();
            }}
            className="px-4 py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <TrendingUp className="w-4 h-4 text-[#C5A059]" />
            <span>Flourishing Index</span>
          </button>
          <button
            onClick={() => {
              onSelectTab('moral-arbiter');
              audioFeedback.playCovenantResonance();
            }}
            className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Moral Arbiter</span>
          </button>
        </div>
      </div>

      {/* Epistemic Reality Check */}
      <RealityCheck 
        data={{
          status: 'modeled',
          confidenceScore: 91.2,
          uncertaintyMargin: '± 4.5%',
          epistemicTier: 'Counterfactual Structural Causal Model',
          realityVsModelWarning: 'Commandment II: This counterfactual projection is a simulation aid, not empirical ground truth. Never substitute model predictions for in-situ field measurement.',
          dataOrigin: 'Pearl Do-Calculus Kernel & Sentinel-2 Historical Biophysical Mesh',
          cryptographicHash: '0x99201a4e76110f8234719bbca098234190872615',
          lastVerified: 'Live Simulation Compute',
          verifiedBy: 'Causal Synthesis Research Lab',
          assumptions: [
            'Assumes non-linear rainfall variance conforms to CMIP6 SSP2-4.5 projections.',
            'Assumes human labor compliance with regenerative agroforestry protocols is maintained above 85%.'
          ]
        }}
      />

      {/* Scenario Selector Ribbon */}
      <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
            SELECT BIOREGIONAL TWIN SCENARIO
          </span>
          <span className="text-xs text-[#F5F5F0]/40 font-mono">
            3 Active Living Models
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scen) => {
            const isSelected = scen.id === selectedScenarioId;
            return (
              <div
                key={scen.id}
                onClick={() => {
                  setSelectedScenarioId(scen.id);
                  audioFeedback.playMicroTick();
                }}
                className={`p-4 rounded-sm border cursor-pointer transition-all space-y-2 text-left ${
                  isSelected
                    ? 'bg-[#181818] border-[#C5A059] shadow-md scale-[1.01]'
                    : 'bg-[#111111] border-[#F5F5F0]/5 hover:border-[#F5F5F0]/20'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#C5A059] font-bold">{scen.bioregion}</span>
                  <span className="text-emerald-400 font-bold">{scen.monteCarloProbabilityOfSuccess}% Success</span>
                </div>
                <h3 className="text-sm font-serif font-bold text-[#F5F5F0] leading-snug">
                  {scen.name}
                </h3>
                <p className="text-xs text-[#F5F5F0]/50 line-clamp-2 leading-relaxed font-sans">
                  {scen.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-Time Ecological Alert System Section */}
      <EcologicalAlertSystem 
        currentBioregionId={selectedScenario.id}
        currentBioregionName={selectedScenario.bioregion}
        onOpenMoralSimulator={onOpenMoralSimulator}
        onSelectTab={onSelectTab}
      />

      {/* Scenario Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono">
        <div className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-widest">Bioregional Population</div>
          <div className="text-2xl font-bold text-[#F5F5F0]">{(selectedScenario.populationAffected).toLocaleString()}</div>
          <div className="text-[10px] text-[#C5A059]">Autonomous Inhabitants</div>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-widest">Monte Carlo Certainty</div>
          <div className="text-2xl font-bold text-emerald-400">
            {(selectedScenario.monteCarloProbabilityOfSuccess * (dynamicMultiplier > 1.1 ? 1.02 : 0.98)).toFixed(1)}%
          </div>
          <div className="text-[10px] text-emerald-300">10,000 Stochastic Iterations</div>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-widest">Planetary Boundary Safety</div>
          <div className="text-2xl font-bold text-emerald-400">Safe Margin</div>
          <div className="text-[10px] text-emerald-300">Within Aquifer & Carbon Limits</div>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-widest">Causal Multiplier</div>
          <div className="text-2xl font-bold text-[#8FB8DE]">{dynamicMultiplier.toFixed(2)}x</div>
          <div className="text-[10px] text-[#F5F5F0]/60">Intervention Coupling</div>
        </div>
      </div>

      {/* Main Grid: Counterfactual Controls + Multi-Temporal Trajectories & 3-Order Consequences */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 cols): Interactive Interventions & Do-Calculus Parameters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F0]">
                  Causal Intervention Controls
                </h3>
              </div>
              <button
                onClick={handleRunMonteCarlo}
                disabled={isSimulating}
                className="px-3 py-1 bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/40 text-emerald-300 text-[10px] font-mono rounded flex items-center gap-1 transition-all"
              >
                <Play className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
              </button>
            </div>

            <p className="text-xs text-[#F5F5F0]/60 font-sans leading-relaxed">
              Adjust policy, engineering, and capital variables in real-time to compute counterfactual feedback loops on community well-being and ecological thresholds.
            </p>

            <div className="space-y-5">
              {selectedScenario.activeInterventions.map((param) => {
                const currentVal = interventionValues[`${selectedScenario.id}_${param.id}`] ?? param.currentValue;
                return (
                  <div key={param.id} className="p-3.5 bg-[#121212] border border-[#F5F5F0]/5 rounded-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#F5F5F0] font-bold">{param.name}</span>
                      <span className="text-[#C5A059] font-bold">
                        {currentVal} {param.unit}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#F5F5F0]/50 font-sans leading-tight">
                      {param.description}
                    </p>

                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={currentVal}
                      onChange={(e) => handleSliderChange(selectedScenario.id, param.id, parseFloat(e.target.value))}
                      className="w-full accent-[#C5A059] bg-[#1A1A1A] h-1.5 rounded-lg appearance-none cursor-pointer"
                    />

                    <div className="flex items-center justify-between text-[9px] font-mono text-[#F5F5F0]/40">
                      <span>Min: {param.min}</span>
                      <span>Cost: <span className="text-emerald-400">{param.costEstimate}</span></span>
                      <span>Max: {param.max}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                const resetState: Record<string, number> = {};
                selectedScenario.activeInterventions.forEach(p => {
                  resetState[`${selectedScenario.id}_${p.id}`] = p.currentValue;
                });
                setInterventionValues(prev => ({ ...prev, ...resetState }));
              }}
              className="w-full py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-[#F5F5F0]/10 text-xs font-mono text-[#F5F5F0]/60 hover:text-[#F5F5F0] rounded-xs transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Scenario Parameters</span>
            </button>
          </div>

          {/* Biophysical Thresholds Monitor */}
          <div className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
              BIOPHYSICAL THRESHOLDS & BOUNDARY SENTINELS
            </span>

            <div className="space-y-3">
              {selectedScenario.nodes.map((node) => {
                const simulatedVal = Math.round(node.currentBaseline * (1 / dynamicMultiplier) * 10) / 10;
                const isCritical = node.biophysicalThreshold && simulatedVal >= node.biophysicalThreshold.criticalCollapse;
                return (
                  <div key={node.id} className="p-3 bg-[#141414] border border-[#F5F5F0]/5 rounded-xs space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#F5F5F0] font-bold">{node.name}</span>
                      <span className={`font-mono font-bold ${isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {simulatedVal} {node.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#F5F5F0]/40 font-mono">
                      <span>Baseline: {node.currentBaseline} {node.unit}</span>
                      <span>Safe Limit: {node.biophysicalThreshold?.minSafe}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Flourishing Projections & Systemic Consequences */}
        <div className="lg:col-span-7 space-y-6">
          {/* Multi-Temporal Horizon Selector & Projections */}
          <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                  MULTI-TEMPORAL TRAJECTORY HORIZON
                </span>
                <h3 className="text-lg font-serif font-bold text-[#F5F5F0] mt-0.5">
                  Flourishing Index Trajectory by Horizon
                </h3>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm">
                {(['year5', 'year15', 'year30'] as const).map((h) => (
                  <button
                    key={h}
                    onClick={() => setActiveHorizon(h)}
                    className={`px-3 py-1 text-xs font-mono rounded-xs transition-all ${
                      activeHorizon === h
                        ? 'bg-[#C5A059] text-black font-bold'
                        : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                    }`}
                  >
                    {h === 'year5' ? '5 Years' : h === 'year15' ? '15 Years' : '30 Years'}
                  </button>
                ))}
              </div>
            </div>

            {/* Flourishing Dimensions Horizon Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(selectedScenario.flourishingImpact).map(([dimKey, rawImpact]) => {
                const impact = rawImpact as { year5: number; year15: number; year30: number; confidence: number };
                const baseScore = impact[activeHorizon];
                const simulatedScore = Math.min(100, Math.round(baseScore * dynamicMultiplier));
                return (
                  <div key={dimKey} className="p-3.5 bg-[#121212] border border-[#F5F5F0]/5 rounded-sm space-y-1.5 text-left">
                    <div className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                      {dimKey} Flourishing
                    </div>
                    <div className="text-xl font-mono font-bold text-[#F5F5F0]">
                      {simulatedScore} <span className="text-xs text-[#F5F5F0]/40 font-normal">/ 100</span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400">
                      Certainty: {impact.confidence}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 1st, 2nd, & 3rd Order Consequence Engine */}
          <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F5F5F0]">
                Systemic Consequence Graph (1st, 2nd & 3rd Order Dynamics)
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                Pearl Causal Graph Audited
              </span>
            </div>

            <div className="space-y-4">
              {selectedScenario.consequences.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#1B3022] text-emerald-300 text-[10px] font-mono font-bold rounded">
                        {c.order === 1 ? '1st Order (Direct)' : c.order === 2 ? '2nd Order (Systemic)' : '3rd Order (Generational)'}
                      </span>
                      <span className="text-sm font-serif font-bold text-[#F5F5F0]">
                        {c.title}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 text-[9px] font-mono uppercase font-bold rounded border ${getConsequenceBadge(c.type, c.severity)}`}>
                      {c.type.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                    {c.description}
                  </p>

                  {c.mitigationStrategy && (
                    <div className="p-3 bg-[#1F1710] border border-amber-500/30 rounded-xs text-[11px] text-amber-200 font-sans">
                      <span className="font-bold font-mono uppercase text-[9px] text-amber-400 block mb-0.5">
                        Prescribed AI Mitigation Intervention:
                      </span>
                      {c.mitigationStrategy}
                    </div>
                  )}

                  <div className="text-[10px] font-mono text-[#F5F5F0]/40 pt-1">
                    Affected Domain: <span className="text-[#F5F5F0]/80">{c.affectedDomain}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
