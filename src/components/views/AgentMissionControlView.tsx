import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Play, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Compass, 
  BarChart3, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Database, 
  Cpu, 
  Lock, 
  Eye, 
  Check, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Download, 
  ExternalLink,
  Zap,
  Terminal,
  Search,
  Activity
} from 'lucide-react';
import { AgentMission, MissionTask, ApprovalRequest, AuditEvent, MissionMemoryItem } from '../../lib/agents/types';
import { FLEET_AGENTS, getAgentById } from '../../lib/agents/agentRegistry';
import { AgentRuntime } from '../../lib/agents/agentRuntime';
import { subscribeMissions, getAllMissions, getMissionById } from '../../lib/agents/memoryBank';
import { subscribeAuditLogs, getAuditTrail } from '../../lib/agents/agentGateway';
import { audioFeedback } from '../../lib/audioFeedback';
import { PageView } from '../../types';

interface AgentMissionControlViewProps {
  onSelectTab?: (tab: PageView) => void;
  onNavigateToView?: (view: any) => void;
  onInspectProvenance?: (prov: any) => void;
  injectedIntervention?: any;
  onOpenSystemsModeler?: () => void;
}

const PRESET_MISSIONS = [
  {
    title: "Nairobi Mathare River Basin Riparian Corridor",
    region: "Nairobi Basin, Kenya (East Africa Bioregion)",
    objective: "Assess degraded riparian river basin in Mathare Valley, develop a 10-year agroforestry and flood mitigation strategy, model 8-capital returns, and formulate a community-owned solar cold storage infrastructure plan.",
    capital: "$4,250,000 Patient Capital",
    constraints: ["Zero resident displacement (FPIC mandatory)", "Community-owned data trust", "Max 18-month payback on solar food nodes"],
    successCriteria: ["+45% riparian soil organic matter", "2,400 youth livelihoods in precision agroforestry", "Merkle verification on soil carbon"]
  },
  {
    title: "Great Green Wall Sahelian Agroforestry Shield",
    region: "Sahel Bioregional Corridor (Senegal to Djibouti)",
    objective: "Deploy drought-resilient acacia polyculture corridors with micro-solar irrigation, simulate aquifer recharge, and structure non-extractive revenue share with local pastoralist federations.",
    capital: "$8,500,000 Catalytic Capital",
    constraints: ["Pastoralist migration corridors preserved", "No groundwater depletion above replenishment rate"],
    successCriteria: ["+60% vegetation cover over 12,000 hectares", "Decentralized solar water distribution in 30 villages"]
  },
  {
    title: "Tapajós Amazonian Sovereign Forest Trust",
    region: "Tapajós River Basin, Pará, Brazil",
    objective: "Integrate satellite acoustic canopy sensors with indigenous bio-surveillance to halt illegal deforestation, structure verified biodiversity yield credits, and establish community-governed solar processing facilities.",
    capital: "$6,000,000 Indigenous Sovereignty Trust",
    constraints: ["100% indigenous key custody over data rights", "Zero non-consensual biometric telemetry"],
    successCriteria: ["100% boundary integrity verified via Sentinel-2", "3x local processing value capture for açai and bio-resins"]
  }
];

export const AgentMissionControlView: React.FC<AgentMissionControlViewProps> = ({
  onSelectTab,
  onInspectProvenance
}) => {
  const [missions, setMissions] = useState<AgentMission[]>(getAllMissions());
  const [selectedMissionId, setSelectedMissionId] = useState<string>(missions[0]?.id || '');
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(getAuditTrail());
  
  // Tab within Mission Control
  const [activeTab, setActiveTab] = useState<'mission_dag' | 'fleet_telemetry' | 'memory_bank' | 'audit_stream' | 'evidence_dossier'>('mission_dag');
  
  // Execution state
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [searchMemoryQuery, setSearchMemoryQuery] = useState<string>('');
  
  // New Mission Form State
  const [isCreatingMission, setIsCreatingMission] = useState<boolean>(false);
  const [newObjective, setNewObjective] = useState<string>('');
  const [newRegion, setNewRegion] = useState<string>('');
  const [newCapital, setNewCapital] = useState<string>('$3,500,000 Patient Capital');

  useEffect(() => {
    const unsubMissions = subscribeMissions((updated) => {
      setMissions(updated);
      if (!selectedMissionId && updated.length > 0) {
        setSelectedMissionId(updated[0].id);
      }
    });

    const unsubAudit = subscribeAuditLogs((logs) => {
      setAuditLogs(logs);
    });

    return () => {
      unsubMissions();
      unsubAudit();
    };
  }, [selectedMissionId]);

  const currentMission = missions.find((m) => m.id === selectedMissionId) || missions[0];

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjective.trim() || !newRegion.trim()) return;

    audioFeedback.play('softClick');
    setIsExecuting(true);

    try {
      const created = await AgentRuntime.createAndPlanMission({
        objective: newObjective,
        targetRegion: newRegion,
        allocatedCapital: newCapital
      });
      setSelectedMissionId(created.id);
      setIsCreatingMission(false);
      setNewObjective('');
      setNewRegion('');
      audioFeedback.play('actionSuccess');
    } catch (err: any) {
      console.error('Mission creation error:', err);
      audioFeedback.play('failure');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_MISSIONS[0]) => {
    setNewObjective(preset.objective);
    setNewRegion(preset.region);
    setNewCapital(preset.capital);
    audioFeedback.play('softClick');
  };

  const handleExecuteNextStep = async () => {
    if (!currentMission || isExecuting) return;
    audioFeedback.play('softClick');
    setIsExecuting(true);

    try {
      await AgentRuntime.executeNextStep(currentMission.id);
    } catch (err) {
      console.error('Execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResolveApproval = async (approvalId: string, decision: 'approved' | 'rejected') => {
    if (!currentMission) return;
    try {
      await AgentRuntime.resolveApproval(currentMission.id, approvalId, decision);
    } catch (err) {
      console.error('Approval resolution error:', err);
    }
  };

  const pendingApproval = currentMission?.approvalRequests?.find((a) => a.status === 'pending');

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              ATLAS AGENTIC OPERATING LAYER • ALL THINGS AGENTIC HACKATHON
            </span>
            <span className="text-[9px] font-mono bg-[#1B3022] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" /> Autonomous Fleet • 6 Agents Online
            </span>
            <span className="text-[9px] font-mono bg-blue-950/80 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
              Gemini 3.7 + Vertex ADK + Cloud Run
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0] flex items-center gap-3">
            <Bot className="w-8 h-8 text-[#C5A059]" /> Agent Mission Control
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 font-sans leading-relaxed">
            Enterprise multi-agent orchestrator transforming messy real-world objectives into verified biophysical outcomes through <span className="text-[#C5A059] font-medium">Mission Continuity</span>: Goal → Context → Plan → Tool Selection → Execution → Human Approval → Verification → Evidence Dossier.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsCreatingMission(!isCreatingMission)}
            className="px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase rounded bg-[#C5A059] text-black hover:bg-[#D4AF37] transition-all flex items-center gap-2 shadow-lg shadow-[#C5A059]/10"
          >
            <Sparkles className="w-4 h-4" />
            {isCreatingMission ? 'View Active Missions' : 'Initiate New Mission'}
          </button>
        </div>
      </div>

      {/* Mission Creator Drawer */}
      {isCreatingMission && (
        <div className="p-6 rounded-md bg-[#0D0D0D] border border-[#C5A059]/40 space-y-6 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-serif text-[#F5F5F0] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C5A059]" /> Initiate Messy Real-World Mission
              </h2>
              <p className="text-xs text-[#F5F5F0]/60 font-sans mt-0.5">
                The Atlas Lead Mission Agent will autonomously inspect the problem, decompose into a 5-step DAG, and assign specialized agents.
              </p>
            </div>
            <button
              onClick={() => setIsCreatingMission(false)}
              className="text-[#F5F5F0]/50 hover:text-[#F5F5F0] p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider font-bold">
              1-Click Real-World Bioregional Presets:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRESET_MISSIONS.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="p-3 rounded bg-white/[0.02] border border-white/10 hover:border-[#C5A059]/50 hover:bg-[#1B3022]/30 cursor-pointer transition-all space-y-1.5"
                >
                  <h3 className="text-xs font-bold text-[#F5F5F0] truncate">{p.title}</h3>
                  <p className="text-[11px] text-[#C5A059]/80 font-mono truncate">{p.region}</p>
                  <p className="text-[11px] text-[#F5F5F0]/60 line-clamp-2 leading-tight">{p.objective}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreateMission} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#F5F5F0]/80">Target Bioregion / Geography *</label>
                <input
                  type="text"
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  placeholder="e.g. Nairobi Mathare River Basin, Kenya"
                  className="w-full bg-[#080808] border border-white/15 rounded p-2.5 text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#F5F5F0]/80">Patient Capital Allocation</label>
                <input
                  type="text"
                  value={newCapital}
                  onChange={(e) => setNewCapital(e.target.value)}
                  placeholder="e.g. $4,250,000 Patient Capital"
                  className="w-full bg-[#080808] border border-white/15 rounded p-2.5 text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#F5F5F0]/80">Messy Real-World Objective & Problem Context *</label>
              <textarea
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Describe the degraded ecological state, community challenges, flood vulnerabilities, economic barriers, or infrastructure needs..."
                rows={4}
                className="w-full bg-[#080808] border border-white/15 rounded p-2.5 text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Model Armor Active (Prompt injection & data leakage guardrails enabled)
              </div>
              <button
                type="submit"
                disabled={isExecuting}
                className="px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase rounded bg-[#C5A059] text-black hover:bg-[#D4AF37] disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Decomposing Objective...
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" /> Deploy Autonomous Fleet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Mission Selector & Phase Badge */}
      {currentMission && (
        <div className="p-5 rounded-md bg-[#0D0D0D] border border-white/10 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider font-bold">
                  Active Mission ID: {currentMission.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                  currentMission.phase === 'COMPLETED' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' :
                  currentMission.phase === 'WAITING_APPROVAL' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse' :
                  'bg-blue-950/80 text-blue-300 border border-blue-500/40'
                }`}>
                  Phase: {currentMission.phase}
                </span>
              </div>
              <h2 className="text-xl font-serif text-[#F5F5F0]">{currentMission.title}</h2>
              <p className="text-xs text-[#F5F5F0]/70 font-sans max-w-4xl">{currentMission.objective}</p>
            </div>

            {/* Mission Selector Dropdown */}
            <div className="flex items-center gap-3">
              <select
                value={currentMission.id}
                onChange={(e) => setSelectedMissionId(e.target.value)}
                className="bg-[#080808] border border-white/15 text-xs text-[#F5F5F0] p-2 rounded focus:outline-none focus:border-[#C5A059]"
              >
                {missions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.targetRegion} ({m.phase})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mission Progress Bar & Execution Actions */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F5F5F0]/70">
                DAG Execution Progress: {currentMission.activeTaskIndex} / {currentMission.tasks.length} tasks completed
              </span>
              <span className="text-[#C5A059] font-bold">{currentMission.progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C5A059] to-emerald-500 transition-all duration-500"
                style={{ width: `${currentMission.progressPercent}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#F5F5F0]/60">
                <span>Allocated Capital: <strong className="text-[#C5A059]">{currentMission.allocatedCapital || 'N/A'}</strong></span>
                <span>•</span>
                <span>Target: <strong>{currentMission.targetRegion}</strong></span>
              </div>

              {currentMission.phase !== 'COMPLETED' && (
                <button
                  onClick={handleExecuteNextStep}
                  disabled={isExecuting || currentMission.phase === 'WAITING_APPROVAL'}
                  className="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md"
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Autonomous Step in Progress...
                    </>
                  ) : currentMission.phase === 'WAITING_APPROVAL' ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-300" /> Paused (Awaiting Human Approval)
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Execute Next Autonomous Task
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HUMAN IN THE LOOP APPROVAL BANNER (if waiting) */}
      {pendingApproval && (
        <div className="p-5 rounded-md bg-amber-950/40 border border-amber-500/50 space-y-4 animate-in fade-in duration-300 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                    Human-in-the-Loop Approval Barrier (Tier: High Risk)
                  </span>
                  <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                    Requested by {pendingApproval.requestingAgentId}
                  </span>
                </div>
                <h3 className="text-base font-serif text-amber-100 font-bold">{pendingApproval.actionTitle}</h3>
                <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">{pendingApproval.actionDescription}</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded bg-black/40 border border-white/10 text-xs font-mono text-[#F5F5F0]/70 space-y-1">
            <span className="text-[10px] text-[#C5A059] uppercase font-bold">Parameters Under Review:</span>
            <pre className="text-[11px] text-[#F5F5F0]/90 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(pendingApproval.parameters, null, 2)}
            </pre>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => handleResolveApproval(pendingApproval.id, 'rejected')}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded border border-red-500/40 text-red-300 hover:bg-red-950/50 transition-colors flex items-center gap-1.5"
            >
              <X className="w-4 h-4" /> Reject & Pivot Plan
            </button>
            <button
              onClick={() => handleResolveApproval(pendingApproval.id, 'approved')}
              className="px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded bg-amber-500 text-black hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Check className="w-4 h-4" /> Authorize Capital Tranche & Resume Fleet
            </button>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto text-xs font-mono scrollbar-none pb-px">
        {[
          { id: 'mission_dag', label: 'Mission DAG & Plan', icon: Layers },
          { id: 'fleet_telemetry', label: 'Agent Fleet Status', icon: Bot },
          { id: 'memory_bank', label: 'Persistent Memory Bank', icon: Database },
          { id: 'audit_stream', label: 'Model Armor & Audit Stream', icon: ShieldCheck },
          { id: 'evidence_dossier', label: 'Verified Evidence Dossier', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audioFeedback.play('softClick');
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-[#C5A059] text-[#C5A059] font-bold bg-white/[0.02]'
                  : 'border-transparent text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:border-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: MISSION DAG & TASKS */}
      {activeTab === 'mission_dag' && currentMission && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono text-[#C5A059] uppercase tracking-wider font-bold">
              Directed Acyclic Graph (DAG) Execution Stages
            </h3>
            <span className="text-xs font-mono text-[#F5F5F0]/50">
              Autonomous sequencing with prerequisite verification
            </span>
          </div>

          <div className="space-y-3">
            {currentMission.tasks.map((task, idx) => {
              const agent = getAgentById(task.assignedAgentId);
              const isExpanded = expandedTaskId === task.id;
              const isCurrent = idx === currentMission.activeTaskIndex && currentMission.phase !== 'COMPLETED';

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-md border transition-all ${
                    task.status === 'completed' ? 'bg-[#0D0D0D] border-emerald-500/30' :
                    task.status === 'requires_approval' ? 'bg-amber-950/20 border-amber-500/50' :
                    task.status === 'in_progress' || isCurrent ? 'bg-[#1B3022]/40 border-[#C5A059]/60 shadow-lg shadow-[#C5A059]/5' :
                    'bg-[#0D0D0D]/60 border-white/5 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                        task.status === 'completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                        task.status === 'requires_approval' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                        task.status === 'in_progress' || isCurrent ? 'bg-[#C5A059] text-black' :
                        'bg-white/5 text-[#F5F5F0]/40 border border-white/10'
                      }`}>
                        {task.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : task.order}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-[#F5F5F0]">{task.title}</h4>
                          <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                            task.status === 'completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                            task.status === 'requires_approval' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                            task.status === 'in_progress' ? 'bg-blue-950 text-blue-300 border border-blue-500/30 animate-pulse' :
                            'bg-white/5 text-[#F5F5F0]/40'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">{task.description}</p>

                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-[#F5F5F0]/50">
                          <span>Agent: <strong className="text-[#C5A059]">{agent?.name || task.assignedAgentRole}</strong></span>
                          <span>•</span>
                          <span>Tools: <code className="text-[#F5F5F0]/80">{task.toolsUsed.join(', ')}</code></span>
                          {task.confidenceScore ? (
                            <>
                              <span>•</span>
                              <span>Epistemic Confidence: <strong className="text-emerald-400">{task.confidenceScore}%</strong></span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="text-[#F5F5F0]/50 hover:text-[#F5F5F0] p-1.5 rounded hover:bg-white/5 shrink-0"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Task Outputs */}
                  {isExpanded && task.outputs && (
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                      <span className="text-[10px] font-mono text-[#C5A059] uppercase font-bold">
                        Task Execution Artifacts & Outputs:
                      </span>
                      <pre className="p-3 rounded bg-black/60 border border-white/10 text-xs font-mono text-[#F5F5F0]/90 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(task.outputs, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: AGENT FLEET TELEMETRY */}
      {activeTab === 'fleet_telemetry' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono text-[#C5A059] uppercase tracking-wider font-bold">
              Fortified Enterprise Fleet Registry & Compute Nodes
            </h3>
            <span className="text-xs font-mono text-[#F5F5F0]/50">
              Role-based access control & Model Armor authorization
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FLEET_AGENTS.map((agent) => {
              const activeCount = missions.filter((m) => m.participatingAgentIds.includes(agent.id) && m.phase !== 'COMPLETED').length;
              return (
                <div
                  key={agent.id}
                  className="p-5 rounded-md bg-[#0D0D0D] border border-white/10 hover:border-[#C5A059]/40 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full border border-[#C5A059]/40 bg-[#1B3022] flex items-center justify-center text-[#C5A059]">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#F5F5F0]">{agent.name}</h4>
                          <span className="text-[10px] font-mono text-[#C5A059]">{agent.version}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        ONLINE
                      </span>
                    </div>

                    <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                      {agent.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-white/5 text-[11px] font-mono">
                      <div className="flex justify-between text-[#F5F5F0]/60">
                        <span>Foundation Model:</span>
                        <strong className="text-[#F5F5F0]">{agent.model}</strong>
                      </div>
                      <div className="flex justify-between text-[#F5F5F0]/60">
                        <span>Runtime Env:</span>
                        <strong className="text-blue-300">{agent.deploymentEnvironment}</strong>
                      </div>
                      <div className="flex justify-between text-[#F5F5F0]/60">
                        <span>Confidence Rating:</span>
                        <strong className="text-emerald-400">{agent.epistemicConfidence}%</strong>
                      </div>
                      <div className="flex justify-between text-[#F5F5F0]/60">
                        <span>Tasks Completed:</span>
                        <strong className="text-[#F5F5F0]">{agent.completedTasksCount}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-white/5">
                    <span className="text-[10px] font-mono text-[#C5A059] uppercase font-bold">Authorized Tools:</span>
                    <div className="flex flex-wrap gap-1">
                      {agent.tools.map((t) => (
                        <span key={t} className="text-[9px] font-mono bg-white/5 text-[#F5F5F0]/80 px-1.5 py-0.5 rounded border border-white/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PERSISTENT MEMORY BANK */}
      {activeTab === 'memory_bank' && currentMission && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-mono text-[#C5A059] uppercase tracking-wider font-bold">
                Mission Contextual Memory Bank ({currentMission.memories?.length || 0} entries)
              </h3>
              <p className="text-xs text-[#F5F5F0]/60">
                Episodic decisions, empirical baselines, and intermediate findings stored across mission lifecycles.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#F5F5F0]/40 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchMemoryQuery}
                onChange={(e) => setSearchMemoryQuery(e.target.value)}
                placeholder="Filter memories..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#080808] border border-white/15 rounded text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            {(!currentMission.memories || currentMission.memories.length === 0) ? (
              <div className="p-8 text-center text-[#F5F5F0]/40 font-mono text-xs border border-white/5 rounded">
                No memories recorded for this mission yet. Execute tasks to generate contextual knowledge.
              </div>
            ) : (
              currentMission.memories
                .filter((m) => !searchMemoryQuery || m.title.toLowerCase().includes(searchMemoryQuery.toLowerCase()) || m.key.toLowerCase().includes(searchMemoryQuery.toLowerCase()))
                .map((mem) => (
                  <div key={mem.id} className="p-4 rounded bg-[#0D0D0D] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30 uppercase font-bold">
                          {mem.category}
                        </span>
                        <h4 className="text-sm font-semibold text-[#F5F5F0]">{mem.title}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-[#F5F5F0]/40">
                        {new Date(mem.createdAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <pre className="p-3 rounded bg-black/60 border border-white/5 text-xs font-mono text-[#F5F5F0]/90 overflow-x-auto whitespace-pre-wrap">
                      {typeof mem.content === 'object' ? JSON.stringify(mem.content, null, 2) : mem.content}
                    </pre>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#F5F5F0]/50">
                      <span>Key: <code>{mem.key}</code></span>
                      <span>•</span>
                      <span>Tags: {mem.tags.join(', ')}</span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT STREAM & MODEL ARMOR */}
      {activeTab === 'audit_stream' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono text-[#C5A059] uppercase tracking-wider font-bold">
              Model Armor & Tamper-Evident Audit Trail
            </h3>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Policy Compliance
            </span>
          </div>

          <div className="p-4 rounded-md bg-[#080808] border border-white/10 font-mono text-xs space-y-2 max-h-[600px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-2.5 rounded bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      log.modelArmorVerdict === 'CLEARED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                      'bg-amber-950 text-amber-300 border border-amber-500/30'
                    }`}>
                      {log.modelArmorVerdict}
                    </span>
                    <span className="text-[#C5A059] font-bold">{log.agentRole}</span>
                    <span className="text-[#F5F5F0]/40">({log.eventType})</span>
                  </div>
                  <span className="text-[#F5F5F0]/40 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-[#F5F5F0]/90 font-sans text-xs">{log.summary}</p>
                {log.details && (
                  <div className="text-[10px] text-[#F5F5F0]/50 truncate">
                    Payload: {JSON.stringify(log.details)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: VERIFIED EVIDENCE DOSSIER */}
      {activeTab === 'evidence_dossier' && currentMission && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono text-[#C5A059] uppercase tracking-wider font-bold">
              Autonomous Verification & Epistemic Dossier
            </h3>
            <span className="text-xs font-mono text-[#C5A059]">
              Signed Merkle DAG Provenance
            </span>
          </div>

          {currentMission.finalSynthesis ? (
            <div className="p-6 rounded-md bg-[#0D0D0D] border border-emerald-500/40 space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                      Canon XXIII Verified
                    </span>
                    <span className="text-xs font-mono text-[#C5A059]">
                      {currentMission.finalSynthesis.moralVerdict}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif text-[#F5F5F0] mt-1">
                    Master Epistemic Deliverable Package
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#F5F5F0]/50 block">Flourishing Delta:</span>
                  <span className="text-base font-mono font-bold text-emerald-400">
                    {currentMission.finalSynthesis.flourishingImpact}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-[#C5A059] uppercase font-bold">Executive Synthesis:</span>
                <p className="text-xs sm:text-sm text-[#F5F5F0]/80 font-sans leading-relaxed">
                  {currentMission.finalSynthesis.summary}
                </p>
              </div>

              {/* Key Deliverables */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-[#C5A059] uppercase font-bold">Core Deliverables & Outputs:</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentMission.finalSynthesis.keyDeliverables.map((deliv, idx) => (
                    <div key={idx} className="p-3.5 rounded bg-white/[0.02] border border-white/10 space-y-1">
                      <h4 className="text-xs font-bold text-[#F5F5F0]">{deliv.title}</h4>
                      <p className="text-[11px] text-[#F5F5F0]/70 font-mono">{deliv.linkOrContent}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-[#C5A059] uppercase font-bold">Actionable Next Steps:</span>
                <ul className="space-y-1.5 text-xs text-[#F5F5F0]/80 font-sans">
                  {currentMission.finalSynthesis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cryptographic Proof Hash */}
              <div className="p-3 rounded bg-black/60 border border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/60">Merkle Provenance Root:</span>
                <code className="text-[#C5A059] truncate max-w-md">
                  {currentMission.finalSynthesis.cryptographicProofHash}
                </code>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#F5F5F0]/40 font-mono text-xs border border-white/5 rounded space-y-2">
              <Bot className="w-8 h-8 mx-auto text-[#F5F5F0]/20" />
              <p>Execute all tasks in the DAG to compile the finalized Evidence Dossier.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
