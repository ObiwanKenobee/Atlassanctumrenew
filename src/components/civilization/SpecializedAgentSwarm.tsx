import React, { useState } from 'react';
import { 
  Cpu, 
  Eye, 
  Activity, 
  BookOpen, 
  Compass, 
  Scale, 
  Coins, 
  Wrench, 
  BarChart3, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Terminal,
  Play
} from 'lucide-react';
import { SpecializedCivilizationAgent, PageView } from '../../types';
import { useActiveMission } from '../../context/ActiveMissionContext';

interface SpecializedAgentSwarmProps {
  onSelectTab?: (tab: PageView) => void;
}

export const SpecializedAgentSwarm: React.FC<SpecializedAgentSwarmProps> = ({ onSelectTab }) => {
  const { activeMission, advanceMissionStage } = useActiveMission();
  const [selectedAgentIndex, setSelectedAgentIndex] = useState<number>(0);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [activePrompt, setActivePrompt] = useState<string>(
    activeMission?.activeScenarioPrompt || 'Diagnose agroforestry potential in East African Rift Valley'
  );

  React.useEffect(() => {
    if (activeMission?.activeScenarioPrompt) {
      setActivePrompt(activeMission.activeScenarioPrompt);
    }
  }, [activeMission?.activeScenarioPrompt]);

  const AGENTS: SpecializedCivilizationAgent[] = [
    {
      id: 'agent-obs-01',
      agentRole: 'OBSERVER',
      title: 'Observer Agent',
      specialization: 'Multispectral Satellite & IoT In-Situ Mesh Telemetry',
      coreDirective: 'Ingest raw real-world telemetry without speculative hallucination. Tag epistemic tier on all observations.',
      activeWorkstream: 'Streaming Sentinel-2 NIR NDVI data across Turkana and Mathare basins.',
      epistemicConfidence: 98.4,
      covenantConstraint: 'Never fabricate ungrounded telemetry data.',
      status: 'active'
    },
    {
      id: 'agent-diag-02',
      agentRole: 'DIAGNOSTICIAN',
      title: 'Diagnostician Agent',
      specialization: 'Systemic Causal Loop & Fragility Analysis',
      coreDirective: 'Trace symptoms back to root causes across ecological, economic, and institutional domains.',
      activeWorkstream: 'Constructing causal transmission graph for Mathare monsoon flood wage losses.',
      epistemicConfidence: 94.1,
      covenantConstraint: 'Must distinguish symptom alleviation from systemic cure.',
      status: 'active'
    },
    {
      id: 'agent-res-03',
      agentRole: 'RESEARCHER',
      title: 'Researcher Agent',
      specialization: 'Epistemic Literature & Field Evidence Synthesizer',
      coreDirective: 'Map scientific precedents, peer-reviewed engineering models, and indigenous agronomy records.',
      activeWorkstream: 'Retrieving FAO phyto-remediation benchmarks for vetiver grass root shear strength.',
      epistemicConfidence: 96.7,
      covenantConstraint: 'Ground every engineering parameter in verifiable empirical sources.',
      status: 'evaluating'
    },
    {
      id: 'agent-strat-04',
      agentRole: 'STRATEGIST',
      title: 'Strategist Agent',
      specialization: 'Scenario Simulation & Multi-Objective Optimization',
      coreDirective: 'Generate 3 distinct intervention options: Catalytic, Infrastructure, and Civic Stewardship.',
      activeWorkstream: 'Simulating capital vs speed vs equity trade-offs for 3.4MW solar desalination.',
      epistemicConfidence: 92.5,
      covenantConstraint: 'Never prioritize speed over community sovereignty and resilience.',
      status: 'active'
    },
    {
      id: 'agent-eth-05',
      agentRole: 'ETHICIST',
      title: 'Ethicist Agent',
      specialization: '10-Part Atlas Covenant Alignment & Harm Auditing',
      coreDirective: 'Scan for asymmetric downside, vulnerable population burdens, and platform lock-in risks.',
      activeWorkstream: 'Auditing Turkana water tariff contracts for usury or private concession risk.',
      epistemicConfidence: 99.1,
      covenantConstraint: 'VETO AUTHORITY: Instantly halt any intervention violating Human Dignity or Justice.',
      status: 'active'
    },
    {
      id: 'agent-cap-06',
      agentRole: 'CAPITAL_ARCHITECT',
      title: 'Capital Architect',
      specialization: '7-Capitals Non-Extractive Financial Engineering',
      coreDirective: 'Structure milestone-gated outcome tranches and capped real yields for local reinvestment.',
      activeWorkstream: 'Constructing $1.45M bio-composite swale bond with capped 4.2% real yield.',
      epistemicConfidence: 95.0,
      covenantConstraint: 'Prohibit predatory collateralization of ancestral land or essential water.',
      status: 'active'
    },
    {
      id: 'agent-impl-07',
      agentRole: 'IMPLEMENTATION_AGENT',
      title: 'Implementation Agent',
      specialization: 'Physical Fabrication & Local Guild Coordination',
      coreDirective: 'Orchestrate CNC toolpaths, LifeHouse modular prefabrication, and bill of materials.',
      activeWorkstream: 'Generating automated cut sheets for compressed earth block formwork in Kigali.',
      epistemicConfidence: 97.2,
      covenantConstraint: 'Require 80%+ local sourcing and living-wage guild compensation.',
      status: 'evaluating'
    },
    {
      id: 'agent-imp-08',
      agentRole: 'IMPACT_ANALYST',
      title: 'Impact Analyst',
      specialization: 'Cryptographic Measurement & Third-Party Verification',
      coreDirective: 'Audit physical sensor outputs against simulated predictions and issue cryptographic proofs.',
      activeWorkstream: 'Validating zero flood water entry into Mathare 4B dwellings during Q2 long rains.',
      epistemicConfidence: 98.9,
      covenantConstraint: 'Ensure measurement proofs are publicly verifiable on-chain.',
      status: 'active'
    },
    {
      id: 'agent-mem-09',
      agentRole: 'MEMORY_KEEPER',
      title: 'Memory Keeper',
      specialization: 'Institutional Failure Ledger & Historical Lessons',
      coreDirective: 'Record all operational failures, unexpected side-effects, and generational wisdom.',
      activeWorkstream: 'Indexing pyrolysis reactor nozzle clogging failure post-mortem and mitigation design.',
      epistemicConfidence: 99.5,
      covenantConstraint: 'Never delete, hide, or sanitize failure records.',
      status: 'active'
    },
    {
      id: 'agent-stew-10',
      agentRole: 'STEWARD',
      title: 'Steward Agent',
      specialization: 'Subsidiarity Gatekeeper & Assembly Consensus Custodian',
      coreDirective: 'Ensure all AI recommendations remain advisory; sovereign human assemblies retain ultimate decision rights.',
      activeWorkstream: 'Verifying biometric multi-sig ratification quorum from Mathare Elders Council.',
      epistemicConfidence: 99.8,
      covenantConstraint: 'Enforce Human Dignity > AI Automation across all execution layers.',
      status: 'active'
    }
  ];

  const activeAgent = AGENTS[selectedAgentIndex];

  const getAgentIcon = (role: string) => {
    switch (role) {
      case 'OBSERVER': return <Eye className="w-4 h-4 text-emerald-400" />;
      case 'DIAGNOSTICIAN': return <Activity className="w-4 h-4 text-blue-400" />;
      case 'RESEARCHER': return <BookOpen className="w-4 h-4 text-purple-400" />;
      case 'STRATEGIST': return <Compass className="w-4 h-4 text-amber-400" />;
      case 'ETHICIST': return <Scale className="w-4 h-4 text-rose-400" />;
      case 'CAPITAL_ARCHITECT': return <Coins className="w-4 h-4 text-[#C5A059]" />;
      case 'IMPLEMENTATION_AGENT': return <Wrench className="w-4 h-4 text-cyan-400" />;
      case 'IMPACT_ANALYST': return <BarChart3 className="w-4 h-4 text-teal-400" />;
      case 'MEMORY_KEEPER': return <RotateCcw className="w-4 h-4 text-orange-400" />;
      case 'STEWARD': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default: return <Cpu className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  const handleSimulateSwarm = () => {
    setSimulationRunning(true);
    setTimeout(() => {
      setSimulationRunning(false);
    }, 2500);
  };

  return (
    <div className="w-full bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C5A059] font-bold">
              Multi-Agent Intelligence Architecture
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0]">
            THE 10 SPECIALIZED AI AGENTS
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl font-sans">
            "Atlas decomposes complex civilizational governance into 10 specialized, covenanted AI agents bound by strict epistemic tiers and human-in-the-loop oversight."
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelectTab && onSelectTab('agent-mission-control')}
          className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/50 text-[#C5A059] text-xs font-mono font-bold uppercase rounded-xs transition-all flex items-center gap-1.5 cursor-pointer self-start lg:self-auto"
        >
          <span>Open Agent Mission Control</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Agents Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {AGENTS.map((agent, idx) => (
          <button
            key={agent.id}
            onClick={() => setSelectedAgentIndex(idx)}
            className={`p-3 rounded-sm border text-left transition-all cursor-pointer space-y-1 ${
              selectedAgentIndex === idx
                ? 'bg-[#1B3022] border-[#C5A059] shadow-md scale-102'
                : 'bg-[#121212] border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-[#C5A059] font-bold">0{idx + 1}</span>
              {getAgentIcon(agent.agentRole)}
            </div>
            <div className="text-xs font-bold text-[#F5F5F0] truncate">{agent.title}</div>
            <div className="text-[9px] font-mono text-emerald-400">{agent.epistemicConfidence}% Conf.</div>
          </button>
        ))}
      </div>

      {/* Selected Agent Deep Detail Card */}
      <div className="p-6 bg-[#121212] border-2 border-[#C5A059]/50 rounded-sm space-y-5 shadow-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#1B3022] border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
              {getAgentIcon(activeAgent.agentRole)}
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#F5F5F0] flex items-center gap-2">
                <span>{activeAgent.title}</span>
                <span className="text-xs font-mono px-2 py-0.5 bg-[#080808] border border-[#C5A059]/40 text-[#C5A059] rounded">
                  {activeAgent.agentRole}
                </span>
              </h3>
              <div className="text-xs font-mono text-[#F5F5F0]/60">
                Specialization: {activeAgent.specialization}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
              STATUS: {activeAgent.status}
            </span>
          </div>
        </div>

        {/* 3 Detail Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
              Core Operational Directive
            </span>
            <p className="text-[#F5F5F0]/90 leading-relaxed font-sans">{activeAgent.coreDirective}</p>
          </div>

          <div className="p-4 bg-[#0A0A0A] border border-blue-500/20 rounded-sm space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">
              Active Workstream Telemetry
            </span>
            <p className="text-[#F5F5F0]/90 leading-relaxed font-mono text-[11px]">{activeAgent.activeWorkstream}</p>
          </div>

          <div className="p-4 bg-[#0A0A0A] border border-rose-500/30 rounded-sm space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-rose-400 font-bold">
              Covenant Moral Constraint
            </span>
            <p className="text-rose-200/90 leading-relaxed font-mono text-[11px]">{activeAgent.covenantConstraint}</p>
          </div>
        </div>

        {/* Interactive Swarm Dispatch Simulator */}
        <div className="p-4 bg-[#080808] border border-[#C5A059]/30 rounded-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#C5A059] font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Dispatch Swarm Query to {activeAgent.title}:
            </span>
            <span className="text-[#F5F5F0]/40">Gemini 2.5 Flash Grounded</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={activePrompt}
              onChange={(e) => setActivePrompt(e.target.value)}
              className="flex-1 bg-[#141414] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
            />
            <button
              onClick={handleSimulateSwarm}
              disabled={simulationRunning}
              className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059] text-[#C5A059] text-xs font-mono font-bold rounded-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{simulationRunning ? 'Executing...' : 'Dispatch'}</span>
            </button>
          </div>

          {simulationRunning && (
            <div className="p-3 bg-[#121212] border border-emerald-500/40 rounded-xs text-[11px] font-mono text-emerald-300 space-y-2">
              <div>[Swarm Dispatch]: Query routed to {activeAgent.agentRole} Agent.</div>
              <div>[Epistemic Verification]: Grounding against 4 multispectral telemetry feeds...</div>
              <div>[Covenant Check]: Zero asymmetric harm detected. Sovereign human decision gate active.</div>
              {onSelectTab && (
                <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                  <span className="text-[#F5F5F0]/70 text-[10px]">Strategy formulated with 10-agent consensus.</span>
                  <button
                    onClick={() => {
                      advanceMissionStage('CAPITAL_STRUCTURED');
                      onSelectTab('capital-engine');
                    }}
                    className="px-3 py-1 bg-[#C5A059] text-black font-bold uppercase text-[10px] rounded-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Proceed to Capital Structuring</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
