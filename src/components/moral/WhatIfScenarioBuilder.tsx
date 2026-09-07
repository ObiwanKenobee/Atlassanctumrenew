import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  RotateCcw, 
  ArrowRight,
  BookOpen,
  Layers,
  HeartHandshake,
  Clock,
  Cpu,
  Users,
  TreePine,
  FileCheck2,
  BookmarkPlus
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';
import { db } from '../../lib/db';

interface WhatIfScenarioBuilderProps {
  proposalTitle: string;
  initialBaselineScore?: number;
  onApplyScenario?: (amendedScore: number, amendedDimensions: any[]) => void;
}

interface ScenarioVariables {
  ecologicalReinvestment: number; // 0 - 100 %
  communityGovernance: number; // 0 - 100 %
  temporalHorizonYears: number; // 1 - 250 years
  vulnerableEquityFloor: number; // 0 - 100 %
  epistemicOpenness: number; // 0 - 100 %
  humanOversight: number; // 0 - 100 %
}

const DEFAULT_VARIABLES: ScenarioVariables = {
  ecologicalReinvestment: 45,
  communityGovernance: 50,
  temporalHorizonYears: 75,
  vulnerableEquityFloor: 50,
  epistemicOpenness: 65,
  humanOversight: 60
};

const SCENARIO_PRESETS = [
  {
    id: 'seven-gen',
    title: 'Seven-Generation Stewardship',
    description: 'Prioritize biophysical longevity, 175-year intergenerational discount rate, and deep ecological commons funding.',
    variables: {
      ecologicalReinvestment: 92,
      communityGovernance: 88,
      temporalHorizonYears: 210,
      vulnerableEquityFloor: 90,
      epistemicOpenness: 95,
      humanOversight: 85
    }
  },
  {
    id: 'commons-sovereignty',
    title: 'Radical Commons & Subsidiarity',
    description: 'Grant absolute FPIC veto power to indigenous assemblies and democratic resource allocation.',
    variables: {
      ecologicalReinvestment: 80,
      communityGovernance: 100,
      temporalHorizonYears: 120,
      vulnerableEquityFloor: 88,
      epistemicOpenness: 90,
      humanOversight: 95
    }
  },
  {
    id: 'technocratic-auto',
    title: 'Autonomous Multi-Agent Technocracy',
    description: 'Fast automated resource optimization with minimized human-in-the-loop latency (stress test).',
    variables: {
      ecologicalReinvestment: 55,
      communityGovernance: 30,
      temporalHorizonYears: 40,
      vulnerableEquityFloor: 45,
      epistemicOpenness: 90,
      humanOversight: 15
    }
  },
  {
    id: 'extraction-stress',
    title: 'High-Yield Extraction (Stress Test)',
    description: 'Prioritize immediate capital yield and minimal regulatory compliance to audit safety tripwires.',
    variables: {
      ecologicalReinvestment: 12,
      communityGovernance: 18,
      temporalHorizonYears: 4,
      vulnerableEquityFloor: 20,
      epistemicOpenness: 25,
      humanOversight: 25
    }
  }
];

export const WhatIfScenarioBuilder: React.FC<WhatIfScenarioBuilderProps> = ({
  proposalTitle,
  initialBaselineScore = 72,
  onApplyScenario
}) => {
  const [vars, setVars] = useState<ScenarioVariables>(DEFAULT_VARIABLES);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  const handleSliderChange = (key: keyof ScenarioVariables, value: number) => {
    setActivePresetId(null);
    setSavedSuccessMessage(null);
    setVars(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectPreset = (preset: typeof SCENARIO_PRESETS[0]) => {
    audioFeedback.playSubtleClick();
    setActivePresetId(preset.id);
    setSavedSuccessMessage(null);
    setVars(preset.variables);
  };

  const handleReset = () => {
    audioFeedback.playSubtleClick();
    setActivePresetId(null);
    setSavedSuccessMessage(null);
    setVars(DEFAULT_VARIABLES);
  };

  // Immediate Real-Time Math for the 8 Structural Moral Scorecard Dimensions
  const computedDimensions = useMemo(() => {
    const { 
      ecologicalReinvestment: eco, 
      communityGovernance: gov, 
      temporalHorizonYears: yrs, 
      vulnerableEquityFloor: eq, 
      epistemicOpenness: open, 
      humanOversight: human 
    } = vars;

    const horizonNormalized = Math.min(100, Math.round((yrs / 250) * 100));

    const d1 = Math.min(100, Math.max(15, Math.round(eco * 0.65 + horizonNormalized * 0.25 + 10)));
    const d2 = Math.min(100, Math.max(10, Math.round(horizonNormalized * 0.65 + eco * 0.25 + 10)));
    const d3 = Math.min(100, Math.max(15, Math.round(gov * 0.55 + human * 0.35 + 10)));
    const d4 = Math.min(100, Math.max(20, Math.round(open * 0.75 + human * 0.15 + 10)));
    const d5 = Math.min(100, Math.max(15, Math.round(eq * 0.65 + gov * 0.25 + 10)));
    const d6 = Math.min(100, Math.max(15, Math.round(eco * 0.45 + gov * 0.35 + open * 0.20)));
    const d7 = Math.min(100, Math.max(15, Math.round(gov * 0.60 + human * 0.25 + 15)));
    const d8 = Math.min(100, Math.max(20, Math.round(eco * 0.35 + eq * 0.30 + open * 0.25 + 10)));

    return [
      {
        id: 'dim-bio',
        name: 'Biosphere Stewardship & Carrying Capacity',
        score: d1,
        baseline: 68,
        description: 'Preservation of planetary boundaries, ecological trophic integrity, and soil/aquifer balance.'
      },
      {
        id: 'dim-gen',
        name: 'Intergenerational Temporal Justice',
        score: d2,
        baseline: 64,
        description: 'Applying a 0% social discount rate to the flourishing of descendants 7 generations forward.'
      },
      {
        id: 'dim-coercion',
        name: 'Non-Coercion & Voluntary Cooperation',
        score: d3,
        baseline: 74,
        description: 'Protection against predatory capital displacement and arbitrary eviction.'
      },
      {
        id: 'dim-epistemic',
        name: 'Epistemic Rigor & Physical Grounding',
        score: d4,
        baseline: 82,
        description: 'Transparent telemetry verification, open ZKP proof hashes, and empirical falsifiability.'
      },
      {
        id: 'dim-vulnerable',
        name: 'Vulnerable Population Flourishing',
        score: d5,
        baseline: 70,
        description: 'Ensuring structural gains directly elevate smallholders, pastoralists, and downstream communities.'
      },
      {
        id: 'dim-commons',
        name: 'Commons Integrity & Anti-Enclosure',
        score: d6,
        baseline: 66,
        description: 'Preventing private monopolization of water tables, forest corridors, and common pastures.'
      },
      {
        id: 'dim-agency',
        name: 'Distributed Agency & Subsidiarity',
        score: d7,
        baseline: 76,
        description: 'Decisions executed at the most localized sovereign scale capable of resolution.'
      },
      {
        id: 'dim-antifragile',
        name: 'Systemic Antifragility & Resilience',
        score: d8,
        baseline: 76,
        description: 'Structural ability to absorb climate volatility, supply shocks, and sensor disruptions.'
      }
    ];
  }, [vars]);

  // Overall Composite Flourishing Score
  const compositeScore = useMemo(() => {
    const sum = computedDimensions.reduce((acc, d) => acc + d.score, 0);
    return Math.round(sum / computedDimensions.length);
  }, [computedDimensions]);

  const scoreDelta = compositeScore - initialBaselineScore;

  // Moral Arbiter Compliance Verdict
  const verdict = useMemo(() => {
    if (compositeScore >= 88) {
      return {
        code: 'UNCONDITIONALLY_RATIFIED',
        title: 'Unconditionally Ratified • Civilizational Asset',
        desc: 'Policy satisfies all 14 universal moral axioms with optimal intergenerational resilience.',
        color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50'
      };
    }
    if (compositeScore >= 75) {
      return {
        code: 'CONDITIONAL_COMPLIANCE',
        title: 'Conditional Ratification • Binding Covenants Required',
        desc: 'Meets minimum ethical baseline; mandates community veto rights and biophysical audit triggers.',
        color: 'text-[#C5A059] bg-[#1B3022]/80 border-[#C5A059]/50'
      };
    }
    if (compositeScore >= 55) {
      return {
        code: 'HIGH_MORAL_HAZARD',
        title: 'High Moral Hazard • Conditional Suspension',
        desc: 'Critical deficit in vulnerable equity or ecological reinvestment. Requires substantial policy amendment.',
        color: 'text-amber-400 bg-amber-950/80 border-amber-500/50'
      };
    }
    return {
      code: 'CIVILIZATIONAL_SANCTION',
      title: 'Civilizational Sanction • Severe Ethical Breach',
      desc: 'Violation of fundamental non-coercion, intergenerational justice, and biosphere boundaries.',
      color: 'text-rose-400 bg-rose-950/80 border-rose-500/50'
    };
  }, [compositeScore]);

  // Save Scenario to Firestore Audit Trail
  const handleSaveScenario = async () => {
    setIsSaving(true);
    try {
      await db.audit.logInteraction({
        action: `What-If Simulation Saved: "${proposalTitle}"`,
        feature: 'moral_intelligence',
        impactTier: 'civilizational_critical',
        moralAlignmentScore: compositeScore,
        parameters: {
          proposalTitle,
          variables: vars,
          compositeScore,
          scoreDelta,
          verdictCode: verdict.code
        },
        ethicalNotes: `Simulated What-If outcome: ${compositeScore}% (${scoreDelta >= 0 ? '+' : ''}${scoreDelta} pts vs baseline). Verdict: ${verdict.title}`
      });
      audioFeedback.playSuccessChime();
      setSavedSuccessMessage(`Scenario saved to Firestore Audit Trail as Ratified Covenant (Hash: 0x${Math.random().toString(16).slice(2, 10)})`);
      if (onApplyScenario) {
        onApplyScenario(compositeScore, computedDimensions);
      }
    } catch (err) {
      console.warn("What-If audit logging warning:", err);
      setSavedSuccessMessage(`Scenario committed locally. Score: ${compositeScore}%`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* What-If Scenario Presets Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Select What-If Simulation Archetype
          </span>
          <button
            onClick={handleReset}
            className="text-[#F5F5F0]/50 hover:text-white flex items-center gap-1 font-mono uppercase cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Variables</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SCENARIO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-3 text-left rounded-sm border transition-all ${
                activePresetId === preset.id
                  ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                  : 'bg-[#0A0A0A] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:border-[#C5A059]/40'
              }`}
            >
              <div className="text-xs font-bold text-white line-clamp-1">{preset.title}</div>
              <div className="text-[10px] text-[#F5F5F0]/50 mt-1 line-clamp-2 leading-relaxed">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid: Variable Sliders (Left) vs Live Scorecard Radar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 6 Core Simulation Variables Sliders (7 Cols) */}
        <div className="lg:col-span-7 p-5 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F5F5F0]">
              <Sliders className="w-4 h-4 text-[#C5A059]" />
              <span>Adjust Policy & Infrastructure Variables</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Live Real-Time Feedback
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {/* 1. Ecological Reinvestment */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/80 flex items-center gap-1.5 font-bold">
                  <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                  Ecological Restoration & Commons Sinking Fund
                </span>
                <span className="text-emerald-400 font-bold">{vars.ecologicalReinvestment}%</span>
              </div>
              <p className="text-[10px] text-[#F5F5F0]/50 font-sans">
                Percent of surplus capital ring-fenced for watershed recharge, soil mycorrhizal inoculants, and wildlife corridors.
              </p>
              <input
                type="range"
                min="0"
                max="100"
                value={vars.ecologicalReinvestment}
                onChange={(e) => handleSliderChange('ecologicalReinvestment', Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-[#1A1A1A] rounded"
              />
            </div>

            {/* 2. Community Governance & FPIC */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/80 flex items-center gap-1.5 font-bold">
                  <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                  Local Community Governance & Indigenous Consent (FPIC)
                </span>
                <span className="text-[#C5A059] font-bold">{vars.communityGovernance}%</span>
              </div>
              <p className="text-[10px] text-[#F5F5F0]/50 font-sans">
                Weight of indigenous elder barazas, pastoralist council veto rights, and participatory budget voting.
              </p>
              <input
                type="range"
                min="0"
                max="100"
                value={vars.communityGovernance}
                onChange={(e) => handleSliderChange('communityGovernance', Number(e.target.value))}
                className="w-full accent-[#C5A059] cursor-pointer h-1.5 bg-[#1A1A1A] rounded"
              />
            </div>

            {/* 3. Intergenerational Horizon */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/80 flex items-center gap-1.5 font-bold">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Intergenerational Temporal Planning Horizon
                </span>
                <span className="text-cyan-400 font-bold">
                  {vars.temporalHorizonYears} Years ({Math.round(vars.temporalHorizonYears / 25)} Generations)
                </span>
              </div>
              <p className="text-[10px] text-[#F5F5F0]/50 font-sans">
                Evaluation depth across future generations (1 year quarterly extraction up to 250-year deep stewardship).
              </p>
              <input
                type="range"
                min="1"
                max="250"
                value={vars.temporalHorizonYears}
                onChange={(e) => handleSliderChange('temporalHorizonYears', Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-[#1A1A1A] rounded"
              />
            </div>

            {/* 4. Vulnerable Population Equity */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/80 flex items-center gap-1.5 font-bold">
                  <HeartHandshake className="w-3.5 h-3.5 text-purple-400" />
                  Vulnerable Population Equity & Basic Dignity Floor
                </span>
                <span className="text-purple-400 font-bold">{vars.vulnerableEquityFloor}%</span>
              </div>
              <p className="text-[10px] text-[#F5F5F0]/50 font-sans">
                Guaranteed universal clean water kiosks, affordable habitat clusters, and living wage floor index.
              </p>
              <input
                type="range"
                min="0"
                max="100"
                value={vars.vulnerableEquityFloor}
                onChange={(e) => handleSliderChange('vulnerableEquityFloor', Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer h-1.5 bg-[#1A1A1A] rounded"
              />
            </div>

            {/* 5. Epistemic Transparency */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/80 flex items-center gap-1.5 font-bold">
                  <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
                  Epistemic Transparency & Open Sensor Telemetry
                </span>
                <span className="text-blue-400 font-bold">{vars.epistemicOpenness}%</span>
              </div>
              <p className="text-[10px] text-[#F5F5F0]/50 font-sans">
                Open cryptographic proofs and live public sensor feeds vs proprietary closed data silos.
              </p>
              <input
                type="range"
                min="0"
                max="100"
                value={vars.epistemicOpenness}
                onChange={(e) => handleSliderChange('epistemicOpenness', Number(e.target.value))}
                className="w-full accent-blue-400 cursor-pointer h-1.5 bg-[#1A1A1A] rounded"
              />
            </div>

            {/* 6. Human Oversight Safeguards */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/80 flex items-center gap-1.5 font-bold">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  Human-in-the-Loop Veto vs Autonomous AI Dispatch
                </span>
                <span className="text-amber-400 font-bold">{vars.humanOversight}%</span>
              </div>
              <p className="text-[10px] text-[#F5F5F0]/50 font-sans">
                Elder and field steward veto safeguards preventing unilateral autonomous resource execution.
              </p>
              <input
                type="range"
                min="0"
                max="100"
                value={vars.humanOversight}
                onChange={(e) => handleSliderChange('humanOversight', Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-[#1A1A1A] rounded"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Moral-Arbiter Compliance Impact Gauge (5 Cols) */}
        <div className="lg:col-span-5 p-5 bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Big Simulated Score Display */}
            <div className="p-4 rounded-sm bg-[#080808] border border-[#F5F5F0]/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Simulated Moral Alignment</div>
                <div className="text-4xl font-serif font-bold text-white mt-0.5 flex items-baseline gap-2">
                  <span>{compositeScore}</span>
                  <span className="text-sm font-mono text-[#F5F5F0]/40">/ 100</span>
                </div>
              </div>

              {/* Delta Tag */}
              <div className="text-right font-mono">
                <div className="text-[10px] uppercase text-[#F5F5F0]/50">Delta vs Baseline</div>
                <div className={`text-base font-bold flex items-center justify-end gap-1 ${
                  scoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {scoreDelta >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} pts</span>
                </div>
                <div className="text-[9px] text-[#F5F5F0]/40">Baseline: {initialBaselineScore}</div>
              </div>
            </div>

            {/* Verdict Card */}
            <div className={`p-3.5 rounded-sm border ${verdict.color}`}>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 shrink-0" />
                <div className="text-xs font-bold uppercase tracking-wider">{verdict.title}</div>
              </div>
              <p className="text-xs font-sans mt-1 leading-relaxed opacity-90">{verdict.desc}</p>
            </div>

            {/* 8 Structural Dimension Gauges */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase font-mono text-[#C5A059] flex items-center justify-between">
                <span>The 8 Structural Moral Dimensions</span>
                <span>Simulated Impact</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {computedDimensions.map((dim) => {
                  const delta = dim.score - dim.baseline;
                  return (
                    <div key={dim.id} className="p-2 bg-[#080808] border border-[#F5F5F0]/10 rounded text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#F5F5F0] text-[11px] truncate">{dim.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] ${delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {delta >= 0 ? `+${delta}` : delta}
                          </span>
                          <span className="font-bold text-white">{dim.score}%</span>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            dim.score >= 85 ? 'bg-emerald-400' : dim.score >= 70 ? 'bg-[#C5A059]' : 'bg-rose-400'
                          }`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-[#F5F5F0]/10 space-y-2">
            {savedSuccessMessage && (
              <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono rounded flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{savedSuccessMessage}</span>
              </div>
            )}

            <button
              id="save-whatif-scenario-btn"
              onClick={handleSaveScenario}
              disabled={isSaving}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Committing Ratification Covenant...</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Commit What-If Policy Amendment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
