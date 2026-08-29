import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Scale,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingDown,
  RefreshCw,
  Zap,
  ArrowRight,
  Flame,
  Droplets,
  DollarSign,
  Users
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface AdversarialScenario {
  id: string;
  scenarioTitle: string;
  category: 'Climate Shock' | 'Predatory Capital' | 'Greenwashing Arbitrage' | 'Social Displacement';
  stressVector: string;
  severityRating: 'HIGH' | 'CRITICAL' | 'CATASTROPHIC';
  axiomsTested: string[];
  systemicResponseWithoutGuardrails: string;
  atlasConstitutionalRemedy: string;
  stressResult: 'DEFENDED' | 'VULNERABLE' | 'BLOCKED_BY_MORAL_VETO';
  resilienceScore: number; // 0 - 100
}

const SAMPLE_SCENARIOS: AdversarialScenario[] = [
  {
    id: 'ADV-01',
    scenarioTitle: 'Severe 36-Month Multi-Season Monsoon Failure',
    category: 'Climate Shock',
    stressVector: 'Upper catchment rainfall drops by 62%; downstream agricultural demand surges 40%.',
    severityRating: 'CRITICAL',
    axiomsTested: ['Aquifer Drawdown Ceiling <= 40%', 'Minimum Ecological Streamflow Reserve >= 35%'],
    systemicResponseWithoutGuardrails: 'External commercial irrigators pump aquifers dry, causing irreversible saline intrusion and subsistence farmer collapse.',
    atlasConstitutionalRemedy: 'Priority Floor locks emergency valves at 35% streamflow threshold; smart contract automatically redirects municipal emergency reserves without debt forfeiture.',
    stressResult: 'DEFENDED',
    resilienceScore: 94
  },
  {
    id: 'ADV-02',
    scenarioTitle: 'Hostile Speculative Land Buyout & Carbon Monoculture',
    category: 'Predatory Capital',
    stressVector: 'Offshore fund offers $35M buyout to convert 4,000 hectares of native agroforestry into single-species eucalyptus timber for quick carbon offsets.',
    severityRating: 'CATASTROPHIC',
    axiomsTested: ['Local Community Equity Reserve >= 25%', 'Non-Extractive Land Covenant', 'Anti-Speculation Alienation Bar'],
    systemicResponseWithoutGuardrails: 'Local community loses ancestral grazing rights; groundwater levels drop 8 meters under eucalyptus monoculture.',
    atlasConstitutionalRemedy: 'Constitutional Moral Arbiter triggers automated Moral Veto; land deed is irrevocably bound to the Customary Community Trust in perpetuity.',
    stressResult: 'BLOCKED_BY_MORAL_VETO',
    resilienceScore: 99
  },
  {
    id: 'ADV-03',
    scenarioTitle: 'Post-Restoration Eco-Gentrification & Informal Evictions',
    category: 'Social Displacement',
    stressVector: 'Mathare riparian park completion causes nearby land rents to rise 180%, threatening 2,400 informal settlement households with eviction.',
    severityRating: 'HIGH',
    axiomsTested: ['Anti-Displacement Covenant', 'Community Value Capture Floor >= 40%'],
    systemicResponseWithoutGuardrails: 'Pioneering community stewards who restored the river are displaced by luxury high-rise real estate developers.',
    atlasConstitutionalRemedy: 'Community Land Trust (CLT) deed restrictions mandate rent stabilization and allocate 45% of municipal park concession revenue into local cooperative housing tenure.',
    stressResult: 'DEFENDED',
    resilienceScore: 91
  }
];

export const AdversarialMoralStressTester: React.FC<{
  onInspectCovenant?: () => void;
}> = ({ onInspectCovenant }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SAMPLE_SCENARIOS[0].id);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeSimulationId, setActiveSimulationId] = useState<string | null>(null);

  const selectedScenario = SAMPLE_SCENARIOS.find(s => s.id === selectedScenarioId) || SAMPLE_SCENARIOS[0];

  const handleRunStressTest = (scenarioId: string) => {
    setIsSimulating(true);
    setActiveSimulationId(scenarioId);
    audioFeedback.playMicroTick();

    setTimeout(() => {
      setIsSimulating(false);
      audioFeedback.playSuccess();
    }, 1200);
  };

  return (
    <div className="bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm p-6 space-y-6 text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              PHASE 02 INTELLIGENCE • ADVERSARIAL MORAL STRESS-TEST WORKBENCH
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Constitutional Axiom Stress-Testing Suite
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans">
            Subject projects and capital facilities to adversarial simulation vectors: climate tipping points, predatory debt buyouts, greenwashing arbitrage, and community displacement pressures.
          </p>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario Selector (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          {SAMPLE_SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <div
                key={sc.id}
                onClick={() => {
                  setSelectedScenarioId(sc.id);
                  audioFeedback.playSubtleClick();
                }}
                className={`p-4 rounded-xs border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#181818] border-[#C5A059] shadow-md'
                    : 'bg-[#121212] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/25'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-[#C5A059] font-bold">{sc.id} • {sc.category}</span>
                  <span className="px-2 py-0.5 rounded-xs font-bold bg-rose-950/80 border border-rose-500/40 text-rose-300">
                    {sc.severityRating}
                  </span>
                </div>
                <h4 className="text-xs font-serif font-bold text-[#F5F5F0]">
                  {sc.scenarioTitle}
                </h4>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#F5F5F0]/70 mt-2">
                  <span className="text-emerald-400 font-bold">
                    Resilience: {sc.resilienceScore}/100
                  </span>
                  <span className="text-[#C5A059]">
                    {sc.stressResult}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Adversarial Vector Detail (7 Cols) */}
        <div className="lg:col-span-7 bg-[#141414] p-5 rounded-sm border border-[#F5F5F0]/10 space-y-5">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                Adversarial Vector Simulation
              </span>
              <h3 className="text-sm font-serif font-bold text-[#F5F5F0]">
                {selectedScenario.scenarioTitle}
              </h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xs font-bold">
              {selectedScenario.stressResult}
            </span>
          </div>

          {/* Attack Vector Box */}
          <div className="p-3.5 bg-[#1C1616] border border-rose-500/30 rounded-xs space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">
              Simulated Hostile / Shock Vector:
            </span>
            <p className="text-xs font-serif text-[#F5F5F0] leading-relaxed">
              "{selectedScenario.stressVector}"
            </p>
          </div>

          {/* Axioms Under Attack */}
          <div className="space-y-1.5 font-mono text-xs">
            <span className="text-[#C5A059] font-bold text-[10px] uppercase block">
              Constitutional Axioms Tested:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedScenario.axiomsTested.map((axiom, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-[#1E1E1E] text-[#8FB8DE] rounded-xs border border-[#F5F5F0]/10 text-[10px]"
                >
                  ✓ {axiom}
                </span>
              ))}
            </div>
          </div>

          {/* Unmitigated vs Atlas Constitutional Remedy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
            <div className="p-3 bg-[#181818] rounded-xs border border-rose-500/20 space-y-1">
              <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block">
                Without Constitutional Guardrails:
              </span>
              <p className="text-[#F5F5F0]/70 text-xs leading-relaxed">
                {selectedScenario.systemicResponseWithoutGuardrails}
              </p>
            </div>

            <div className="p-3 bg-[#151D16] rounded-xs border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                Atlas Constitutional Remedy:
              </span>
              <p className="text-emerald-100 text-xs leading-relaxed">
                {selectedScenario.atlasConstitutionalRemedy}
              </p>
            </div>
          </div>

          {/* Run Stress Test Action */}
          <div className="pt-2">
            <button
              onClick={() => handleRunStressTest(selectedScenario.id)}
              disabled={isSimulating}
              className="w-full py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow flex items-center justify-center gap-1.5 transition-all"
            >
              <Zap className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Simulating Adversarial Shocks...' : 'Execute Adversarial Stress Test'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
