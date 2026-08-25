import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { DecisionRoomScenario } from '../../types';
import { SAMPLE_DECISION_SCENARIOS } from '../../data/prompt3OperatingData';
import { audioFeedback } from '../../lib/audioFeedback';

interface DecisionRoomViewProps {
  onSelectTab: (tab: any) => void;
  onOpenMoralSimulator?: () => void;
}

export const DecisionRoomView: React.FC<DecisionRoomViewProps> = ({
  onSelectTab,
  onOpenMoralSimulator
}) => {
  const [selectedScenarioKey] = useState<string>('nairobi_corridor');
  const scenario = SAMPLE_DECISION_SCENARIOS[selectedScenarioKey] || SAMPLE_DECISION_SCENARIOS['nairobi_corridor'];
  const [selectedOptionId, setSelectedOptionId] = useState<string>(scenario.options[0].id);
  const [userVoteOption, setUserVoteOption] = useState<string | null>(null);

  const selectedOption = scenario.options.find(o => o.id === selectedOptionId) || scenario.options[0];

  const handleVote = (optId: string) => {
    setUserVoteOption(optId);
    audioFeedback.playSyncComplete();
  };

  const renderTradeOffCell = (val: number, isInverse: boolean = false) => {
    // 1 to 5
    if (isInverse) {
      // For cost, 1 is low (green), 5 is high (red)
      if (val <= 2) return <span className="text-emerald-400 font-bold">↓ Low</span>;
      if (val === 3) return <span className="text-amber-400 font-bold">→ Med</span>;
      return <span className="text-rose-400 font-bold">↑ High</span>;
    } else {
      // For impact, equity, resilience: 5 is high (green), 1 is low (red)
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
            Atlas assists humans in reasoning through complex, high-stakes trade-offs. The system never dictates a single "correct" answer; it clarifies costs, resilience impacts, equity distributions, and systemic risks.
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

      {/* Decision Context Box */}
      <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ACTIVE DELIBERATION SCENARIO
          </span>
          <span className="text-xs font-mono text-[#F5F5F0]/40">{scenario.location}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-serif text-[#F5F5F0]">
          {scenario.title}
        </h2>

        <p className="text-sm text-[#F5F5F0]/80 font-sans leading-relaxed bg-[#141414] p-4 rounded border border-[#F5F5F0]/5">
          {scenario.problemContext}
        </p>
      </div>

      {/* 11. TRADE-OFF MATRIX */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold">
            EVALUATION & TRADE-OFF MATRIX
          </h3>
          <span className="text-xs text-[#F5F5F0]/40 font-mono">
            3 Competing Strategic Pathways
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
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F0]/5">
              {scenario.options.map((opt) => {
                const isSelected = opt.id === selectedOptionId;
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
                      <span>{opt.name}</span>
                    </td>
                    <td className="p-4 text-center">{renderTradeOffCell(opt.tradeOffScores.cost, true)}</td>
                    <td className="p-4 text-center">{renderTradeOffCell(opt.tradeOffScores.impact)}</td>
                    <td className="p-4 text-center">{renderTradeOffCell(opt.tradeOffScores.speed)}</td>
                    <td className="p-4 text-center">{renderTradeOffCell(opt.tradeOffScores.equity)}</td>
                    <td className="p-4 text-center">{renderTradeOffCell(opt.tradeOffScores.resilience)}</td>
                    <td className="p-4 text-right font-bold text-emerald-400">{opt.capitalNeeded}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
            Ready to convert ratified decision into an executable project workspace?
          </span>

          <button
            onClick={() => {
              audioFeedback.playSyncComplete();
              onSelectTab('project-os');
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-all shadow"
          >
            <Layers className="w-4 h-4" />
            <span>Launch Project Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
