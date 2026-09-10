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
  Activity,
  Pause,
  Sliders,
  Radio,
  Server,
  Film,
  HardDrive,
  Copy,
  ShieldAlert,
  ArrowDownUp
} from 'lucide-react';
import { AgentMission, MissionTask, ApprovalRequest, AuditEvent, MissionMemoryItem, EvidenceClaim } from '../../lib/agents/types';
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
    title: "Apex Continuum: Midnight 4K IMF Master Delivery",
    region: "Studio Stage 7 & GKE Render Cluster (us-central1)",
    objective: "Keep tonight's production on schedule. Ingest Grafana Prometheus telemetry and Loki logs, investigate critical GPU thermal bottleneck and 18.7% IMF frame drop rate, calculate blast radius, stage zero-frame-loss hot failover with human approval, and verify recovery.",
    capital: "$145,000 Risk Mitigation Pool",
    constraints: [
      "Zero frame loss on theatrical master IMF package",
      "Hard delivery lock in 3.8 hours",
      "Cryptographic operator sign-off mandatory before hot failover",
      "Post-intervention state verification required"
    ],
    successCriteria: [
      "0.00% frame drop rate restored on master encode",
      "GPU temperature stabilized below 70°C",
      "Incident post-mortem and anti-fragile memory permanently anchored"
    ]
  },
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
  }
];

// ==========================================
// 1. EVIDENCE PANEL COMPONENT
// ==========================================
export interface EvidencePanelProps {
  claims: EvidenceClaim[];
  onInspectClaim?: (claim: EvidenceClaim) => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ claims, onInspectClaim }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    audioFeedback.play('softClick');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!claims || claims.length === 0) {
    return (
      <div className="p-6 rounded-md bg-[#0D0D0D] border border-white/10 text-center space-y-2">
        <ShieldCheck className="w-8 h-8 mx-auto text-[#C5A059]/40" />
        <p className="text-xs font-mono text-[#F5F5F0]/60">
          No evidence claims anchored yet. Execute tasks to generate cryptographically verified claims.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Tamper-Evident Evidence Layer ({claims.length} Claims)
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#F5F5F0]/40">
          W3C Epistemic Provenance Standard
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {claims.map((claim) => (
          <div
            key={claim.id}
            className="p-4 rounded-md bg-[#0D0D0D] border border-white/10 hover:border-[#C5A059]/40 transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                  claim.sourceType === 'ground_truth_sensor' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                  claim.sourceType === 'peer_reviewed_model' ? 'bg-blue-950 text-blue-300 border border-blue-500/30' :
                  'bg-amber-950 text-amber-300 border border-amber-500/30'
                }`}>
                  [{claim.sourceType.replace(/_/g, ' ').toUpperCase()}]
                </span>
                <span className="text-[10px] font-mono text-[#F5F5F0]/40 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(claim.verifiedAt).toLocaleTimeString()}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-sans font-medium text-[#F5F5F0] leading-snug">
                {claim.claim}
              </h4>

              <div className="text-[11px] font-mono text-[#F5F5F0]/60 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#C5A059]" />
                <span className="truncate">Source: <strong className="text-[#F5F5F0]/90">{claim.evidenceSource}</strong></span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-2">
              {/* Confidence Meter */}
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#F5F5F0]/60">Epistemic Confidence:</span>
                <span className="text-emerald-400 font-bold">{claim.confidenceScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${claim.confidenceScore}%` }}
                />
              </div>

              {/* Provenance Hash */}
              <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                <span className="text-[#F5F5F0]/40 truncate max-w-[180px]">
                  Hash: {claim.provenanceHash.slice(0, 16)}...
                </span>
                <button
                  onClick={() => handleCopyHash(claim.provenanceHash, claim.id)}
                  className="text-[#C5A059] hover:text-white flex items-center gap-1 text-[10px] font-mono"
                >
                  {copiedId === claim.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy Hash
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 2. SYSTEM TOPOLOGY MAP COMPONENT
// ==========================================
export const SystemTopologyMap: React.FC<{ isMitigated?: boolean; isPaused?: boolean }> = ({ isMitigated, isPaused }) => {
  return (
    <div className="p-5 rounded-md bg-[#0D0D0D] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-[#C5A059]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F5F0]">
            Media Pipeline & GKE Render Cluster Topology Map
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
          <span className="text-[10px] font-mono text-[#F5F5F0]/60">
            {isPaused ? 'PIPELINE PAUSED' : isMitigated ? 'HOT-FAILOVER ACTIVE (RECOVERY VERIFIED)' : 'ANOMALY DETECTED (THROTTLING)'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {/* Node 1: Virtual Production Stage 7 */}
        <div className="p-3.5 rounded bg-white/[0.02] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#C5A059] font-bold">STAGE 7 LED VOLUME</span>
            <Film className="w-3.5 h-3.5 text-[#C5A059]" />
          </div>
          <div className="space-y-1 text-[11px] font-mono">
            <div className="flex justify-between text-[#F5F5F0]/60">
              <span>Unreal VCam Drift:</span>
              <span className="text-emerald-400">4.2 µs (OK)</span>
            </div>
            <div className="flex justify-between text-[#F5F5F0]/60">
              <span>Genlock Sync:</span>
              <span className="text-emerald-400">23.976 fps</span>
            </div>
            <div className="flex justify-between text-[#F5F5F0]/60">
              <span>Timecode:</span>
              <span className="text-[#F5F5F0]">01:24:18:12</span>
            </div>
          </div>
        </div>

        {/* Node 2: Primary Render Node 08 */}
        <div className={`p-3.5 rounded border transition-all space-y-2 ${
          isMitigated ? 'bg-white/[0.02] border-white/10 opacity-60' : 'bg-red-950/20 border-red-500/50 shadow-lg shadow-red-500/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-red-300">GPU NODE H100-ALPHA-08</span>
            <Cpu className={`w-3.5 h-3.5 ${isMitigated ? 'text-[#F5F5F0]/40' : 'text-red-400 animate-pulse'}`} />
          </div>
          <div className="space-y-1 text-[11px] font-mono">
            <div className="flex justify-between text-[#F5F5F0]/60">
              <span>GPU Thermals:</span>
              <span className={isMitigated ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                {isMitigated ? '62.1°C (Idle)' : '94.2°C (Throttling)'}
              </span>
            </div>
            <div className="flex justify-between text-[#F5F5F0]/60">
              <span>IMF Frame Drops:</span>
              <span className={isMitigated ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                {isMitigated ? '0.00%' : '18.7% (P1 Critical)'}
              </span>
            </div>
            <div className="flex justify-between text-[#F5F5F0]/60">
              <span>Queue Depth:</span>
              <span className={isMitigated ? 'text-emerald-400' : 'text-amber-400'}>
                {isMitigated ? '0' : '142 stalled'}
              </span>
            </div>
          </div>
        </div>

        {/* Node 3: Reserve Standby Node 02 */}
        <div className={`p-3.5 rounded border transition-all space-y-2 ${
          isMitigated ? 'bg-emerald-950/20 border-emerald-500/50 shadow-lg shadow-emerald-500/10' : 'bg-blue-950/20 border-blue-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-emerald-300">GPU NODE H100-RESERVE-02</span>
            <Zap className={`w-3.5 h-3.5 ${isMitigated ? 'text-emerald-400' : 'text-blue-400'}`} />
          </div>
          <div className="space-y-1 text-[11px] font-mono">
            <div className="flex justify-between text-[#F5F5F0]/60">
              <span>Role:</span>
              <span className={isMitigated ? 'text-emerald-400 font-bold' : 'text-blue-300'}>
                {isMitigated ? 'ACTIVE PRIMARY' : 'HOT STANDBY'}
              </span>
            </div>
            <div className="flex justify-between text-[#F5F5F0]/60">
              <span>GPU Thermals:</span>
              <span className="text-emerald-400">68.4°C (Normal)</span>
            </div>
            <div className="flex justify-between text-[#F5F5F0]/60">
              <span>Frame Drops:</span>
              <span className="text-emerald-400 font-bold">0.00%</span>
            </div>
          </div>
        </div>

        {/* Node 4: NVMe Scratch Tier 3 Array */}
        <div className="p-3.5 rounded bg-white/[0.02] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#C5A059] font-bold">NVMe 4-WAY STRIPE POOL</span>
            <HardDrive className="w-3.5 h-3.5 text-[#C5A059]" />
          </div>
          <div className="space-y-1 text-[11px] font-mono">
            <div className="flex justify-between text-[#F5F5F0]/60">
              <span>IOPS Saturation:</span>
              <span className={isMitigated ? 'text-emerald-400' : 'text-amber-400 font-bold'}>
                {isMitigated ? '34.2% (Nominal)' : '98.4% (Bottleneck)'}
              </span>
            </div>
            <div className="flex justify-between text-[#F5F5F0]/60">
              <span>Write Throughput:</span>
              <span className="text-emerald-400">{isMitigated ? '6.8 GB/s' : '1.2 GB/s (Stalled)'}</span>
            </div>
            <div className="flex justify-between text-[#F5F5F0]/60">
              <span>Master Checksum:</span>
              <span className="text-emerald-400 font-bold">VALID (SHA-256)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. VISUAL EXECUTION TIMELINE COMPONENT
// ==========================================
export const VisualExecutionTimeline: React.FC<{
  tasks: MissionTask[];
  activeTaskIndex: number;
  phase: string;
}> = ({ tasks, activeTaskIndex, phase }) => {
  return (
    <div className="p-5 rounded-md bg-[#0D0D0D] border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#C5A059]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F5F0]">
            Autonomous 5-Stage Mission Execution Timeline
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#C5A059]">
          Phase: {phase}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {tasks.map((task, idx) => {
          const isCompleted = task.status === 'completed';
          const isCurrent = idx === activeTaskIndex && phase !== 'COMPLETED';
          const isPending = task.status === 'pending';
          const isApproval = task.status === 'requires_approval';

          return (
            <div
              key={task.id}
              className={`p-3.5 rounded border transition-all flex flex-col justify-between space-y-2 relative ${
                isCompleted ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100' :
                isApproval ? 'bg-amber-950/30 border-amber-500/60 text-amber-200 animate-pulse' :
                isCurrent ? 'bg-[#1B3022]/50 border-[#C5A059] shadow-md shadow-[#C5A059]/10' :
                'bg-white/[0.01] border-white/5 opacity-50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isCompleted ? 'bg-emerald-500 text-black' :
                    isApproval ? 'bg-amber-500 text-black' :
                    isCurrent ? 'bg-[#C5A059] text-black' :
                    'bg-white/10 text-white/40'
                  }`}>
                    {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                  </span>
                  <span className="text-[9px] font-mono uppercase text-[#F5F5F0]/50">
                    {task.assignedAgentRole.replace('_agent', '').toUpperCase()}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#F5F5F0] line-clamp-2">
                  {task.title.split(':')[0]}
                </h4>
                <p className="text-[10px] text-[#F5F5F0]/60 line-clamp-2 leading-tight">
                  {task.title.split(':')[1] || task.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono">
                <span className={isCompleted ? 'text-emerald-400 font-bold' : isApproval ? 'text-amber-400 font-bold' : 'text-[#F5F5F0]/40'}>
                  {task.status.toUpperCase()}
                </span>
                {task.confidenceScore ? (
                  <span className="text-emerald-400">{task.confidenceScore}%</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export const AgentMissionControlView: React.FC<AgentMissionControlViewProps> = ({
  onSelectTab,
  onInspectProvenance
}) => {
  const [missions, setMissions] = useState<AgentMission[]>(getAllMissions());
  const [selectedMissionId, setSelectedMissionId] = useState<string>(missions[0]?.id || '');
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(getAuditTrail());
  
  // Tab within Mission Control
  const [activeTab, setActiveTab] = useState<'mission_dag' | 'fleet_telemetry' | 'system_topology' | 'evidence_dossier' | 'memory_bank' | 'audit_stream'>('mission_dag');
  
  // Execution state
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [searchMemoryQuery, setSearchMemoryQuery] = useState<string>('');
  
  // Modify Modal State
  const [isModifyingApproval, setIsModifyingApproval] = useState<boolean>(false);
  const [modifiedTargetNode, setModifiedTargetNode] = useState<string>('gpu-node-h100-reserve-02');
  const [modifiedStripeMode, setModifiedStripeMode] = useState<string>('4-way NVMe SSD Pool');
  const [modifiedNotes, setModifiedNotes] = useState<string>('');

  // New Mission Form State
  const [isCreatingMission, setIsCreatingMission] = useState<boolean>(false);
  const [newObjective, setNewObjective] = useState<string>('');
  const [newRegion, setNewRegion] = useState<string>('');
  const [newCapital, setNewCapital] = useState<string>('$145,000 Risk Mitigation Pool');

  // Check for injected mission from Opportunity Intelligence or Decision Room
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('atlas_injected_mission');
      if (stored) {
        sessionStorage.removeItem('atlas_injected_mission');
        const data = JSON.parse(stored);
        if (data.objective || data.title) {
          setNewObjective(data.objective || data.title);
          setNewRegion(data.region || 'Bioregional Corridor');
          setNewCapital(data.capital || '$450,000 Risk Mitigation Pool');
          setIsCreatingMission(true);
          audioFeedback.play('softClick');
        }
      }
    } catch (e) {
      console.warn('Failed to parse injected mission:', e);
    }
  }, []);

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
    if (!currentMission || isExecuting || isPaused) return;
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

  const handleResolveApproval = async (approvalId: string, decision: 'approved' | 'rejected', customNotes?: string) => {
    if (!currentMission) return;
    try {
      await AgentRuntime.resolveApproval(currentMission.id, approvalId, decision, customNotes);
      setIsModifyingApproval(false);
      audioFeedback.play(decision === 'approved' ? 'actionSuccess' : 'failure');
    } catch (err) {
      console.error('Approval resolution error:', err);
    }
  };

  const pendingApproval = currentMission?.approvalRequests?.find((a) => a.status === 'pending');
  const isMitigated = currentMission?.phase === 'COMPLETED' || currentMission?.activeTaskIndex >= 4;

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              ATLAS MISSION CONTROL • SUMMER BLOCKBUSTER / AGENTIC CINEMA
            </span>
            <span className="text-[9px] font-mono bg-[#1B3022] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" /> 5-Agent Fleet Online
            </span>
            <span className="text-[9px] font-mono bg-blue-950/80 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
              Gemini 3.7 + Grafana Labs Telemetry
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0] flex items-center gap-3">
            <Bot className="w-8 h-8 text-[#C5A059]" /> Atlas Mission Control
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 font-sans leading-relaxed">
            Autonomous multi-agent resilience cockpit for mission-critical media production. Coordinated by <strong className="text-[#C5A059]">Gemini 3.7</strong>: Ingests Grafana Prometheus/Loki telemetry, isolates root causes, models blast radius, enforces human approval gates, and verifies zero-frame-loss recovery.
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
                <Sparkles className="w-5 h-5 text-[#C5A059]" /> Initiate Autonomous Mission
              </h2>
              <p className="text-xs text-[#F5F5F0]/60 font-sans mt-0.5">
                The Atlas Director Agent will decompose your production goal into an ordered DAG across the 5 specialized agents.
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
              1-Click Production Scenario Presets:
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
                <label className="text-xs font-mono text-[#F5F5F0]/80">Target Production Pipeline / Cluster *</label>
                <input
                  type="text"
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  placeholder="e.g. Studio Stage 7 & GKE Render Cluster (us-central1)"
                  className="w-full bg-[#080808] border border-white/15 rounded p-2.5 text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#F5F5F0]/80">Risk Mitigation / Capital Pool</label>
                <input
                  type="text"
                  value={newCapital}
                  onChange={(e) => setNewCapital(e.target.value)}
                  placeholder="e.g. $145,000 Risk Mitigation Pool"
                  className="w-full bg-[#080808] border border-white/15 rounded p-2.5 text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#F5F5F0]/80">Production Objective & Constraint Context *</label>
              <textarea
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="State the operational directive (e.g. 'Keep tonight's production on schedule. Investigate GPU thermal bottleneck and stage failover...')"
                rows={3}
                className="w-full bg-[#080808] border border-white/15 rounded p-2.5 text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Policy Guardrails Active & Dual-Key Approval Required
              </div>
              <button
                type="submit"
                disabled={isExecuting}
                className="px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase rounded bg-[#C5A059] text-black hover:bg-[#D4AF37] disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Planning DAG...
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

      {/* Active Mission Banner & Progress */}
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
                DAG Progress: {currentMission.activeTaskIndex} / {currentMission.tasks.length} tasks completed
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
                <span>Mitigation Pool: <strong className="text-[#C5A059]">{currentMission.allocatedCapital || 'N/A'}</strong></span>
                <span>•</span>
                <span>Target: <strong>{currentMission.targetRegion}</strong></span>
              </div>

              {currentMission.phase !== 'COMPLETED' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className={`px-3 py-2 text-xs font-mono uppercase tracking-wider rounded border transition-colors flex items-center gap-1.5 ${
                      isPaused ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-white/5 text-[#F5F5F0]/60 border-white/10 hover:text-white'
                    }`}
                  >
                    <Pause className="w-3.5 h-3.5" />
                    {isPaused ? 'Resume Loop' : 'Pause Loop'}
                  </button>

                  <button
                    onClick={handleExecuteNextStep}
                    disabled={isExecuting || isPaused || currentMission.phase === 'WAITING_APPROVAL'}
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VISUAL EXECUTION TIMELINE */}
      {currentMission && (
        <VisualExecutionTimeline
          tasks={currentMission.tasks}
          activeTaskIndex={currentMission.activeTaskIndex}
          phase={currentMission.phase}
        />
      )}

      {/* SYSTEM TOPOLOGY MAP */}
      <SystemTopologyMap isMitigated={isMitigated} isPaused={isPaused} />

      {/* HUMAN IN THE LOOP APPROVAL CONTROLS BANNER */}
      {pendingApproval && (
        <div className="p-6 rounded-md bg-amber-950/40 border border-amber-500/50 space-y-4 animate-in fade-in duration-300 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                    Dual-Key Human Approval Barrier (Tier: P1 High Risk)
                  </span>
                  <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                    Requested by {pendingApproval.requestingAgentId}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-serif text-amber-100 font-bold">{pendingApproval.actionTitle}</h3>
                <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">{pendingApproval.actionDescription}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded bg-black/40 border border-white/10 space-y-1">
              <span className="text-[10px] text-[#C5A059] uppercase font-bold">Tradeoff Assessment:</span>
              <div className="text-[11px] text-[#F5F5F0]/80 space-y-0.5">
                <div>Blast Radius: <strong className="text-amber-400">78 / 100</strong></div>
                <div>Estimated Downtime: <strong className="text-emerald-400">0 Seconds</strong></div>
                <div>Theatrical Lock Slip Risk: <strong className="text-emerald-400">0% (Mitigated)</strong></div>
              </div>
            </div>

            <div className="p-3 rounded bg-black/40 border border-white/10 space-y-1">
              <span className="text-[10px] text-[#C5A059] uppercase font-bold">Safety Invariants:</span>
              <div className="text-[11px] text-emerald-400 space-y-0.5">
                <div>✓ Checksum Preservation Invariant</div>
                <div>✓ Reversibility Guarantee (40ms timeout)</div>
                <div>✓ Reserve Node Capacity Verified</div>
              </div>
            </div>

            <div className="p-3 rounded bg-black/40 border border-white/10 space-y-1">
              <span className="text-[10px] text-[#C5A059] uppercase font-bold">Target Configuration:</span>
              <div className="text-[11px] text-[#F5F5F0]/80 space-y-0.5 truncate">
                <div>Node: <code>{modifiedTargetNode}</code></div>
                <div>Stripe: <code>{modifiedStripeMode}</code></div>
              </div>
            </div>
          </div>

          {/* Modify Drawer (if active) */}
          {isModifyingApproval && (
            <div className="p-4 rounded bg-black/60 border border-amber-500/30 space-y-3">
              <span className="text-xs font-mono text-amber-300 font-bold uppercase">
                Modify Mitigation Parameters Before Authorization:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="text-[10px] text-[#F5F5F0]/60">Target Standby Node:</label>
                  <input
                    type="text"
                    value={modifiedTargetNode}
                    onChange={(e) => setModifiedTargetNode(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-white/20 rounded p-2 text-xs text-[#F5F5F0] focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#F5F5F0]/60">Storage Stripe Buffer Mode:</label>
                  <input
                    type="text"
                    value={modifiedStripeMode}
                    onChange={(e) => setModifiedStripeMode(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-white/20 rounded p-2 text-xs text-[#F5F5F0] focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Approval Action Controls: APPROVE, REJECT, MODIFY, PAUSE */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-500/20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded border border-white/20 text-[#F5F5F0]/80 hover:bg-white/5 transition-colors flex items-center gap-1.5"
              >
                <Pause className="w-3.5 h-3.5" /> {isPaused ? 'Resume Loop' : 'Pause Loop'}
              </button>

              <button
                onClick={() => setIsModifyingApproval(!isModifyingApproval)}
                className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded border border-amber-500/40 text-amber-300 hover:bg-amber-950/40 transition-colors flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" /> {isModifyingApproval ? 'Hide Parameters' : 'Modify Parameters'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleResolveApproval(pendingApproval.id, 'rejected')}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded border border-red-500/40 text-red-300 hover:bg-red-950/50 transition-colors flex items-center gap-1.5"
              >
                <X className="w-4 h-4" /> Reject & Pivot Plan
              </button>
              <button
                onClick={() => handleResolveApproval(pendingApproval.id, 'approved', `Approved with target: ${modifiedTargetNode} (${modifiedStripeMode})`)}
                className="px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded bg-amber-500 text-black hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Check className="w-4 h-4" /> Sign & Authorize Hot Failover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto text-xs font-mono scrollbar-none pb-px">
        {[
          { id: 'mission_dag', label: 'Mission DAG & Plan', icon: Layers },
          { id: 'evidence_dossier', label: 'Evidence & Provenance Layer', icon: ShieldCheck },
          { id: 'fleet_telemetry', label: 'Agent Fleet Status', icon: Bot },
          { id: 'memory_bank', label: 'Persistent Memory Bank', icon: Database },
          { id: 'audit_stream', label: 'Model Armor & Audit Stream', icon: ShieldCheck }
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
              Directed Acyclic Graph (DAG) Execution Tasks
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

      {/* TAB 2: EVIDENCE & PROVENANCE LAYER */}
      {activeTab === 'evidence_dossier' && currentMission && (
        <div className="space-y-6">
          <EvidencePanel claims={currentMission.evidenceClaims || []} />

          {currentMission.finalSynthesis && (
            <div className="p-6 rounded-md bg-[#0D0D0D] border border-emerald-500/40 space-y-6 mt-6">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                      Operational Recovery Verified
                    </span>
                    <span className="text-xs font-mono text-[#C5A059]">
                      {currentMission.finalSynthesis.moralVerdict}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif text-[#F5F5F0] mt-1">
                    Master Delivery & Post-Mortem Synthesis
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#F5F5F0]/50 block">Operational Outcome:</span>
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
                <span className="text-xs font-mono text-[#C5A059] uppercase font-bold">Core Deliverables & Receipts:</span>
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
                <span className="text-xs font-mono text-[#C5A059] uppercase font-bold">Anti-Fragile Recommendations:</span>
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
          )}
        </div>
      )}

      {/* TAB 3: AGENT FLEET STATUS */}
      {activeTab === 'fleet_telemetry' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono text-[#C5A059] uppercase tracking-wider font-bold">
              Autonomous 5-Agent Fleet Registry & Compute Allocations
            </h3>
            <span className="text-xs font-mono text-[#F5F5F0]/50">
              Role-based tool boundaries & Gemini 3.7 integration
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FLEET_AGENTS.map((agent) => (
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
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PERSISTENT MEMORY BANK */}
      {activeTab === 'memory_bank' && currentMission && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-mono text-[#C5A059] uppercase tracking-wider font-bold">
                Mission Contextual Memory Bank ({currentMission.memories?.length || 0} entries)
              </h3>
              <p className="text-xs text-[#F5F5F0]/60">
                Episodic decisions, historical analogues, and post-mortems stored across production lifecycles.
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

      {/* TAB 5: AUDIT STREAM & MODEL ARMOR */}
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

    </div>
  );
};
