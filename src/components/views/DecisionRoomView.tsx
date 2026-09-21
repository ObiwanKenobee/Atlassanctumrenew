import React, { useState, useEffect } from 'react';
import {
  Scale,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  BarChart3,
  HelpCircle,
  Clock,
  Coins,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  ChevronRight,
  Users,
  RefreshCw,
  Plus
} from 'lucide-react';
import { DecisionRoomScenario, DecisionRoomOption } from '../../types';
import { SAMPLE_DECISION_SCENARIOS } from '../../data/prompt3OperatingData';
import { audioFeedback } from '../../lib/audioFeedback';
import { useComponentRenderMetrics } from '../../hooks/useComponentRenderMetrics';

interface DecisionRoomViewProps {
  onSelectTab: (tab: any) => void;
  onOpenMoralSimulator?: () => void;
}

type StakeholderLens = 'all' | 'community' | 'ecologist' | 'investor' | 'municipal';

interface DeliberationResponse {
  deliberativeConsensus: {
    recommendedStrategyId: string;
    executiveSummary: string;
    confidenceScore: number;
    deliberativeConfidence: string;
    consensusDegree: string;
  };
  paretoSynthesisOption: {
    name: string;
    tagline: string;
    capitalNeeded: string;
    timeToImpact: string;
    synthesisRationale: string;
    benefits: string[];
    costs: string[];
    risks: string[];
    tradeOffScores: {
      cost: number;
      impact: number;
      speed: number;
      equity: number;
      resilience: number;
    };
  };
  stakeholderDynamics: Array<{
    group: string;
    corePriority: string;
    primaryConcern: string;
    acceptableCompromise: string;
  }>;
  multiCapitalImpact: {
    naturalCapital: string;
    socialCapital: string;
    humanCapital: string;
    financialCapital: string;
    manufacturedCapital: string;
  };
  covenantSafeguards: {
    nonNegotiableFloorsVerified: boolean;
    burdenDistributionCheck: string;
    unintendedConsequencesMitigated: string;
  };
}

export const DecisionRoomView: React.FC<DecisionRoomViewProps> = ({
  onSelectTab,
  onOpenMoralSimulator
}) => {
  useComponentRenderMetrics('Decision Room');

  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('nairobi_corridor');
  const [activeScenarios, setActiveScenarios] = useState<Record<string, DecisionRoomScenario>>(SAMPLE_DECISION_SCENARIOS);
  const scenario = activeScenarios[selectedScenarioKey] || activeScenarios['nairobi_corridor'] || SAMPLE_DECISION_SCENARIOS['nairobi_corridor'];

  const [selectedOptionId, setSelectedOptionId] = useState<string>(scenario.options[0]?.id || 'opt-a');
  const [userVoteOption, setUserVoteOption] = useState<string | null>(null);
  const [stakeholderLens, setStakeholderLens] = useState<StakeholderLens>('all');
  
  // Deliberation engine state
  const [isDeliberating, setIsDeliberating] = useState<boolean>(false);
  const [deliberationResult, setDeliberationResult] = useState<DeliberationResponse | null>(null);

  // Check for injected opportunity brief from Opportunity Intelligence
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('atlas_active_opportunity_brief');
      if (stored) {
        const brief = JSON.parse(stored);
        if (brief && brief.problem) {
          const customKey = `custom_${brief.id}`;
          const convertedScenario: DecisionRoomScenario = {
            id: `dec-${brief.id}`,
            title: `${brief.location}: ${brief.problem.title}`,
            location: brief.location,
            problemContext: brief.problem.summary || `Synthesized challenge addressing ${brief.problem.title}.`,
            options: (brief.interventions || []).map((intv: any, idx: number) => ({
              id: intv.id || `opt-custom-${idx}`,
              name: intv.title || `Intervention ${idx + 1}`,
              tagline: intv.shortDescription || 'Synthesized bioregional intervention',
              capitalNeeded: `$${intv.capitalRequiredEstimate?.min?.toLocaleString()} - $${intv.capitalRequiredEstimate?.max?.toLocaleString()}`,
              timeToImpact: `${intv.timelineMonths || 12} Months`,
              benefits: (intv.expectedOutcomes || []).map((o: any) => `${o.label}: ${o.modeledEstimate}`),
              costs: [`Estimated capital expenditure: $${intv.capitalRequiredEstimate?.min?.toLocaleString()}`],
              risks: (intv.risks || []).map((r: any) => `${r.risk} (${r.mitigation})`),
              environmentalImpact: brief.ethicalAssessment?.ecologicalRegeneration || 'Positive restoration of watershed.',
              uncertaintyAssessment: `Epistemic confidence: ${brief.provenance?.certaintyScore || 85}%`,
              tradeOffScores: {
                cost: intv.tradeOffs?.cost === 'low' ? 2 : intv.tradeOffs?.cost === 'high' ? 5 : 3,
                impact: intv.tradeOffs?.impact === 'high' ? 5 : 3,
                speed: intv.tradeOffs?.speed === 'high' ? 5 : 3,
                equity: intv.tradeOffs?.equity === 'high' ? 5 : 3,
                resilience: intv.tradeOffs?.resilience === 'high' ? 5 : 3,
              }
            }))
          };
          setActiveScenarios(prev => ({
            ...prev,
            [customKey]: convertedScenario
          }));
          setSelectedScenarioKey(customKey);
          setSelectedOptionId(convertedScenario.options[0]?.id || '');
        }
      }
    } catch (e) {
      console.warn('Could not parse injected opportunity brief:', e);
    }
  }, []);

  // Update selected option when scenario changes
  useEffect(() => {
    if (scenario && scenario.options.length > 0) {
      if (!scenario.options.some(o => o.id === selectedOptionId)) {
        setSelectedOptionId(scenario.options[0].id);
      }
    }
  }, [scenario, selectedOptionId]);

  const selectedOption = scenario.options.find(o => o.id === selectedOptionId) || scenario.options[0];

  const handleVote = (optId: string) => {
    setUserVoteOption(optId);
    audioFeedback.playSyncComplete();
  };

  const handleRunDeliberation = async () => {
    setIsDeliberating(true);
    audioFeedback.playSubtleClick();

    try {
      const res = await fetch('/api/deliberation/evaluate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          scenarioTitle: scenario.title,
          problemContext: scenario.problemContext,
          options: scenario.options,
          stakeholderPerspective: stakeholderLens
        })
      });

      const json = await res.json();
      if (json && json.data) {
        setDeliberationResult(json.data);
        audioFeedback.playSyncComplete();
      }
    } catch (err) {
      console.error('Deliberation API failed:', err);
    } finally {
      setIsDeliberating(false);
    }
  };

  const handleAdoptParetoOption = () => {
    if (!deliberationResult?.paretoSynthesisOption) return;
    const synth = deliberationResult.paretoSynthesisOption;
    const newOptId = `opt-pareto-${Date.now()}`;
    const newOption: DecisionRoomOption = {
      id: newOptId,
      name: synth.name,
      tagline: synth.tagline,
      capitalNeeded: synth.capitalNeeded,
      timeToImpact: synth.timeToImpact,
      benefits: synth.benefits,
      costs: synth.costs,
      risks: synth.risks,
      environmentalImpact: 'Systemic Pareto compromise resolving primary stakeholder frictions with balanced regenerative returns.',
      uncertaintyAssessment: `Evaluated with ${deliberationResult.deliberativeConsensus.confidenceScore}% confidence under ${stakeholderLens} lens.`,
      tradeOffScores: synth.tradeOffScores
    };

    setActiveScenarios(prev => ({
      ...prev,
      [selectedScenarioKey]: {
        ...scenario,
        options: [...scenario.options, newOption]
      }
    }));
    setSelectedOptionId(newOptId);
    setUserVoteOption(newOptId);
    audioFeedback.playSyncComplete();
  };

  const renderTradeOffCell = (val: number, isInverse: boolean = false) => {
    if (isInverse) {
      if (val <= 2) return <span className="text-emerald-400 font-bold">↓ Low</span>;
      if (val === 3) return <span className="text-amber-400 font-bold">→ Med</span>;
      return <span className="text-rose-400 font-bold">↑ High</span>;
    } else {
      if (val >= 4) return <span className="text-emerald-400 font-bold">↑ High</span>;
      if (val === 3) return <span className="text-amber-400 font-bold">→ Med</span>;
      return <span className="text-rose-400 font-bold">↓ Low</span>;
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
              ATLAS DECISION ROOM • COLLECTIVE REASONING WORKSPACE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">The Decision Room</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-3xl font-sans leading-relaxed">
            Atlas assists humans in reasoning through complex, high-stakes trade-offs. The system never dictates a single "correct" answer; it clarifies costs, resilience impacts, equity distributions, and synthesizes Pareto-optimal strategies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('opportunity-intelligence')}
            className="px-4 py-2 bg-[#121212] hover:bg-[#1C1C1C] border border-[#F5F5F0]/15 text-[#F5F5F0]/80 rounded-sm text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Opportunity Engine</span>
          </button>

          <button
            onClick={() => onSelectTab('project-os')}
            className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>Convert Decision to Project</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector & Stakeholder Lens Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Select Deliberation Scenario
          </span>
          <span className="text-[11px] font-mono text-[#F5F5F0]/40">
            {Object.keys(activeScenarios).length} Scenarios Available
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(activeScenarios).map(([key, scn]) => {
            const isSelected = key === selectedScenarioKey;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedScenarioKey(key);
                  setDeliberationResult(null);
                  audioFeedback.playSubtleClick();
                }}
                className={`px-3 py-2 rounded text-xs font-mono transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#1B3022] border border-[#C5A059] text-[#F5F5F0] font-bold shadow'
                    : 'bg-[#111111] hover:bg-[#181818] border border-[#F5F5F0]/10 text-[#F5F5F0]/70'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#C5A059]' : 'bg-[#F5F5F0]/30'}`} />
                <span className="truncate max-w-[240px]">{scn.title}</span>
                <span className="text-[10px] text-[#F5F5F0]/40 font-normal">({scn.location})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Decision Context Box */}
      <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
              ACTIVE DELIBERATION SCENARIO
            </span>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
            Bioregion: {scenario.location}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-serif text-[#F5F5F0]">
          {scenario.title}
        </h2>

        <p className="text-sm text-[#F5F5F0]/80 font-sans leading-relaxed bg-[#141414] p-4 rounded border border-[#F5F5F0]/5">
          {scenario.problemContext}
        </p>

        {/* Stakeholder Lens Controls */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#F5F5F0]/10">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-xs font-mono text-[#F5F5F0]/70 uppercase">Deliberative Stakeholder Lens:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Stakeholders' },
              { id: 'community', label: 'Community Elders & Youth' },
              { id: 'ecologist', label: 'Bioregional Ecologist' },
              { id: 'investor', label: 'Patient Capital Trustee' },
              { id: 'municipal', label: 'Municipal Engineer' }
            ].map(lens => (
              <button
                key={lens.id}
                onClick={() => {
                  setStakeholderLens(lens.id as StakeholderLens);
                  audioFeedback.playMicroTick();
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                  stakeholderLens === lens.id
                    ? 'bg-[#C5A059] text-black font-bold'
                    : 'bg-[#181818] text-[#F5F5F0]/60 hover:text-[#F5F5F0] border border-[#F5F5F0]/10'
                }`}
              >
                {lens.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 11. TRADE-OFF MATRIX */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#C5A059]" />
            <span>EVALUATION & TRADE-OFF MATRIX</span>
          </h3>
          <span className="text-xs text-[#F5F5F0]/50 font-mono">
            {scenario.options.length} Strategic Pathways Under Evaluation
          </span>
        </div>

        <div className="overflow-x-auto bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-[#F5F5F0]/10 bg-[#121212] text-[#F5F5F0]/60 text-[10px] uppercase tracking-wider">
                <th className="p-4">Strategy Option</th>
                <th className="p-4 text-center">Cost</th>
                <th className="p-4 text-center">Impact</th>
                <th className="p-4 text-center">Speed</th>
                <th className="p-4 text-center">Equity</th>
                <th className="p-4 text-center">Resilience</th>
                <th className="p-4 text-right">Capital Needed</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F0]/5">
              {scenario.options.map((opt) => {
                const isSelected = opt.id === selectedOptionId;
                const isVoted = userVoteOption === opt.id;
                const isPareto = opt.id.startsWith('opt-pareto');
                return (
                  <tr
                    key={opt.id}
                    onClick={() => {
                      setSelectedOptionId(opt.id);
                      audioFeedback.playMicroTick();
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#1B3022]/40 text-[#F5F5F0]' : 'hover:bg-[#141414] text-[#F5F5F0]/80'
                    }`}
                  >
                    <td className="p-4 font-serif font-bold text-sm flex items-center gap-2">
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />}
                      {isPareto && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                          PARETO
                        </span>
                      )}
                      <span>{opt.name}</span>
                    </td>
                    <td className="p-4 text-center">{renderTradeOffCell(opt.tradeOffScores.cost, true)}</td>
                    <td className="p-4 text-center">{renderTradeOffCell(opt.tradeOffScores.impact)}</td>
                    <td className="p-4 text-center">{renderTradeOffCell(opt.tradeOffScores.speed)}</td>
                    <td className="p-4 text-center">{renderTradeOffCell(opt.tradeOffScores.equity)}</td>
                    <td className="p-4 text-center">{renderTradeOffCell(opt.tradeOffScores.resilience)}</td>
                    <td className="p-4 text-right font-bold text-emerald-400">{opt.capitalNeeded}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(opt.id);
                        }}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase transition-all ${
                          isVoted
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-[#181818] hover:bg-[#252525] text-[#F5F5F0]/60 border border-[#F5F5F0]/10'
                        }`}
                      >
                        {isVoted ? 'Ratified' : 'Select'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI DELIBERATIVE SYNTHESIS ENGINE (Pareto Frontier Synthesis) */}
      <div className="bg-[#0B1510] border border-emerald-500/30 rounded-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                AI DELIBERATIVE SYNTHESIS & PARETO OPTIMIZER
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/70 font-sans">
              Evaluates conflicting stakeholder demands against multi-capital invariants and designs an empirical Pareto-optimal compromise.
            </p>
          </div>

          <button
            onClick={handleRunDeliberation}
            disabled={isDeliberating}
            className={`px-5 py-2.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shrink-0 ${
              isDeliberating
                ? 'bg-[#1A2E20] text-emerald-300/50 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-black shadow-lg cursor-pointer'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDeliberating ? 'animate-spin' : ''}`} />
            <span>{isDeliberating ? 'Synthesizing Consensus...' : 'Run Deliberative Synthesis'}</span>
          </button>
        </div>

        {/* Deliberation Results View */}
        {deliberationResult ? (
          <div className="space-y-6 pt-2">
            {/* Executive Consensus Box */}
            <div className="p-4 bg-[#0A0A0A] rounded border border-emerald-500/30 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Consensus Recommendation: {deliberationResult.deliberativeConsensus.consensusDegree}
                </span>
                <span className="text-[10px] font-mono text-[#C5A059]">
                  Deliberative Confidence: {deliberationResult.deliberativeConsensus.deliberativeConfidence} ({deliberationResult.deliberativeConsensus.confidenceScore}%)
                </span>
              </div>
              <p className="text-xs text-[#F5F5F0]/90 font-serif leading-relaxed">
                {deliberationResult.deliberativeConsensus.executiveSummary}
              </p>
            </div>

            {/* Pareto Synthesis Option Card */}
            {deliberationResult.paretoSynthesisOption && (
              <div className="p-5 bg-[#121B14] rounded border-2 border-[#C5A059]/70 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C5A059] text-black font-bold">
                      Synthesized Pareto Compromise
                    </span>
                    <h4 className="text-lg font-serif font-bold text-[#F5F5F0] mt-1.5">
                      {deliberationResult.paretoSynthesisOption.name}
                    </h4>
                    <p className="text-xs text-[#C5A059] font-mono">
                      {deliberationResult.paretoSynthesisOption.tagline}
                    </p>
                  </div>

                  <button
                    onClick={handleAdoptParetoOption}
                    className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs uppercase rounded flex items-center gap-1.5 shrink-0 transition-all shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adopt & Inject into Matrix</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 p-3 bg-[#0A0A0A] rounded border border-[#F5F5F0]/5">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">Core Synthesized Benefits</span>
                    <ul className="space-y-1 text-[#F5F5F0]/80">
                      {deliberationResult.paretoSynthesisOption.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 p-3 bg-[#0A0A0A] rounded border border-[#F5F5F0]/5">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">Trade-Offs & Resource Requirements</span>
                    <div className="flex items-center justify-between font-mono text-[11px] pb-1 border-b border-[#F5F5F0]/10">
                      <span className="text-[#F5F5F0]/60">Capital Needed:</span>
                      <span className="text-emerald-400 font-bold">{deliberationResult.paretoSynthesisOption.capitalNeeded}</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px] pb-1 border-b border-[#F5F5F0]/10">
                      <span className="text-[#F5F5F0]/60">Time to Impact:</span>
                      <span className="text-[#C5A059] font-bold">{deliberationResult.paretoSynthesisOption.timeToImpact}</span>
                    </div>
                    <p className="text-[11px] text-[#F5F5F0]/70 font-sans pt-1">
                      {deliberationResult.paretoSynthesisOption.synthesisRationale}
                    </p>
                  </div>
                </div>

                {/* Multi-Capital Impact Vector */}
                {deliberationResult.multiCapitalImpact && (
                  <div className="p-3 bg-[#0A0A0A] rounded border border-[#F5F5F0]/5 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">
                      Multi-Capital Dynamics Impact Vector
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
                      <div className="p-2 bg-[#141414] rounded">
                        <span className="text-[#F5F5F0]/40 block text-[9px]">NATURAL</span>
                        <span className="text-emerald-400 font-bold">{deliberationResult.multiCapitalImpact.naturalCapital}</span>
                      </div>
                      <div className="p-2 bg-[#141414] rounded">
                        <span className="text-[#F5F5F0]/40 block text-[9px]">SOCIAL</span>
                        <span className="text-cyan-400 font-bold">{deliberationResult.multiCapitalImpact.socialCapital}</span>
                      </div>
                      <div className="p-2 bg-[#141414] rounded">
                        <span className="text-[#F5F5F0]/40 block text-[9px]">HUMAN</span>
                        <span className="text-amber-400 font-bold">{deliberationResult.multiCapitalImpact.humanCapital}</span>
                      </div>
                      <div className="p-2 bg-[#141414] rounded">
                        <span className="text-[#F5F5F0]/40 block text-[9px]">FINANCIAL</span>
                        <span className="text-[#C5A059] font-bold">{deliberationResult.multiCapitalImpact.financialCapital}</span>
                      </div>
                      <div className="p-2 bg-[#141414] rounded">
                        <span className="text-[#F5F5F0]/40 block text-[9px]">MANUFACTURED</span>
                        <span className="text-[#F5F5F0]/80 font-bold">{deliberationResult.multiCapitalImpact.manufacturedCapital}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-xs font-mono text-[#F5F5F0]/50 border border-dashed border-[#F5F5F0]/10 rounded space-y-2">
            <Scale className="w-6 h-6 text-[#C5A059]/40 mx-auto" />
            <p>Click "Run Deliberative Synthesis" to simulate multi-agent stakeholder deliberation and generate a Pareto frontier compromise.</p>
          </div>
        )}
      </div>

      {/* Selected Option Deep-Dive Workspace */}
      <div className="bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40 font-bold">
              INSPECTING: {selectedOption.id.toUpperCase()}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0] mt-1">
              {selectedOption.name}
            </h3>
            <p className="text-xs text-[#C5A059] font-mono">{selectedOption.tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleVote(selectedOption.id)}
              className={`px-4 py-2.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                userVoteOption === selectedOption.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{userVoteOption === selectedOption.id ? 'Option Ratified' : 'Ratify & Select This Option'}</span>
            </button>
          </div>
        </div>

        {/* Benefits vs Costs vs Risks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Benefits */}
          <div className="space-y-3 p-4 bg-[#111111] rounded border border-emerald-500/20">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Primary Benefits
            </span>
            <ul className="space-y-2 text-xs text-[#F5F5F0]/80">
              {selectedOption.benefits.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Costs */}
          <div className="space-y-3 p-4 bg-[#111111] rounded border border-amber-500/20">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5" />
              Costs & Resource Commitments
            </span>
            <ul className="space-y-2 text-xs text-[#F5F5F0]/80">
              {selectedOption.costs.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="space-y-3 p-4 bg-[#111111] rounded border border-rose-500/20">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Downside Vulnerabilities & Risks
            </span>
            <ul className="space-y-2 text-xs text-[#F5F5F0]/80">
              {selectedOption.risks.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400">⚠</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Environmental & Uncertainty Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#F5F5F0]/10 text-xs">
          <div className="p-3.5 bg-[#080808] rounded border border-[#F5F5F0]/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] block font-bold">Ecological & Systemic Impact</span>
            <p className="text-[#F5F5F0]/70 font-sans leading-relaxed">{selectedOption.environmentalImpact}</p>
          </div>
          <div className="p-3.5 bg-[#080808] rounded border border-[#F5F5F0]/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-blue-400 block font-bold">Epistemic Uncertainty Assessment</span>
            <p className="text-[#F5F5F0]/70 font-sans leading-relaxed">{selectedOption.uncertaintyAssessment}</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F5F5F0]/10">
          <span className="text-xs font-mono text-[#F5F5F0]/40">
            Ready to convert ratified decision into an executable project workspace or autonomous swarm?
          </span>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                sessionStorage.setItem('atlas_injected_mission', JSON.stringify({
                  title: `${scenario.location}: ${selectedOption.name}`,
                  region: scenario.location,
                  objective: `Execute ratified decision: ${selectedOption.tagline}. Capital: ${selectedOption.capitalNeeded}.`,
                  capital: selectedOption.capitalNeeded
                }));
                window.dispatchEvent(new CustomEvent('atlas-navigate-tab', { detail: { tab: 'agent-mission-control' } }));
                onSelectTab('agent-mission-control');
              }}
              className="px-4 py-2.5 bg-[#121212] hover:bg-[#1C1C1C] border border-[#F5F5F0]/20 text-[#F5F5F0]/90 rounded-sm text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Dispatch Agent Swarm</span>
            </button>

            <button
              onClick={() => {
                audioFeedback.playSyncComplete();
                onSelectTab('project-os');
              }}
              className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-all shadow"
            >
              <Layers className="w-4 h-4" />
              <span>Launch Project Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
