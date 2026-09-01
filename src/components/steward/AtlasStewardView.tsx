/**
 * ATLAS STEWARD — Exception-First Community Operations Cockpit
 * AWS Agents for Humans Hackathon 2026 — Good Neighbor Agents Track
 * Central Framework: Strands Agents SDK + Amazon Bedrock AgentCore
 */

import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Shield,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Cpu,
  Database,
  Layers,
  Wrench,
  DollarSign,
  Activity,
  ChevronDown,
  ChevronUp,
  FileText,
  Sliders,
  Play,
  Pause,
  ThumbsUp,
  XCircle,
  Edit3,
  Search,
  ExternalLink,
  Zap,
  Radio,
  BookOpen,
  Server,
  CloudLightning,
  Workflow,
  Trophy,
  Globe2,
  GitBranch,
  Scale
} from 'lucide-react';
import { PageView } from '../../types';
import {
  StewardSystemState,
  HumanDecisionException,
  RoutineTask,
  WaterAsset,
  OperationalLesson,
  AgentActivityLog,
  EvidenceCategory
} from '../../lib/steward/types';
import { stewardOrchestrator } from '../../lib/steward/orchestrator';
import { EvidenceDisplay } from './EvidenceDisplay';

interface AtlasStewardViewProps {
  onSelectTab?: (tab: PageView) => void;
}

export const AtlasStewardView: React.FC<AtlasStewardViewProps> = ({ onSelectTab }) => {
  const [state, setState] = useState<StewardSystemState>(stewardOrchestrator.getState());
  const [isInnovationsMenuOpen, setIsInnovationsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'cockpit' | 'routine_tasks' | 'water_assets' | 'memory_loop' | 'aws_architecture'>('cockpit');
  const [isModifyingModalOpen, setIsModifyingModalOpen] = useState(false);
  const [selectedException, setSelectedException] = useState<HumanDecisionException | null>(null);
  const [modificationNotes, setModificationNotes] = useState('');
  const [customSpendLimit, setCustomSpendLimit] = useState(500);
  const [isEditingObjective, setIsEditingObjective] = useState(false);
  const [objectiveInput, setObjectiveInput] = useState('');
  const [isActionExecuting, setIsActionExecuting] = useState(false);
  const [actionSuccessBanner, setActionSuccessBanner] = useState<string | null>(null);
  const [expandedTaskCategory, setExpandedTaskCategory] = useState<string>('all');
  const [selectedAssetForTelemetry, setSelectedAssetForTelemetry] = useState<WaterAsset | null>(null);

  useEffect(() => {
    const unsubscribe = stewardOrchestrator.subscribe((newState) => {
      setState(newState);
      setCustomSpendLimit(newState.autoApprovalSpendThresholdUsd);
      if (newState.activeExceptions.length > 0) {
        setSelectedException(newState.activeExceptions[0]);
      } else {
        setSelectedException(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleApprove = async (exc: HumanDecisionException) => {
    setIsActionExecuting(true);
    setActionSuccessBanner(null);
    try {
      const result = await stewardOrchestrator.handleHumanDecision({
        exceptionId: exc.id,
        action: 'APPROVE',
        selectedOptionId: 'OPT-1'
      });
      if (result.success) {
        setActionSuccessBanner(result.message);
      }
    } finally {
      setIsActionExecuting(false);
    }
  };

  const handleReject = async (exc: HumanDecisionException) => {
    setIsActionExecuting(true);
    setActionSuccessBanner(null);
    try {
      const result = await stewardOrchestrator.handleHumanDecision({
        exceptionId: exc.id,
        action: 'REJECT',
        modificationNotes: 'Operator rejected proposal. Maintaining fallback posture.'
      });
      if (result.success) {
        setActionSuccessBanner(result.message);
      }
    } finally {
      setIsActionExecuting(false);
    }
  };

  const handlePause = async (exc: HumanDecisionException) => {
    setIsActionExecuting(true);
    try {
      const result = await stewardOrchestrator.handleHumanDecision({
        exceptionId: exc.id,
        action: 'PAUSE'
      });
      if (result.success) {
        setActionSuccessBanner(result.message);
      }
    } finally {
      setIsActionExecuting(false);
    }
  };

  const handleApplyModification = async () => {
    if (!selectedException) return;
    setIsActionExecuting(true);
    try {
      const result = await stewardOrchestrator.handleHumanDecision({
        exceptionId: selectedException.id,
        action: 'MODIFY',
        modificationNotes: modificationNotes || 'Custom operator parameters applied.'
      });
      setIsModifyingModalOpen(false);
      setModificationNotes('');
      if (result.success) {
        setActionSuccessBanner(result.message);
      }
    } finally {
      setIsActionExecuting(false);
    }
  };

  const handleResetDemo = () => {
    stewardOrchestrator.resetDemo();
    setActionSuccessBanner('Demo reset to initial seed state. 18 routine tasks active, Borehole 03 exception ready.');
    setTimeout(() => setActionSuccessBanner(null), 4000);
  };

  const handleSaveObjective = () => {
    if (objectiveInput.trim()) {
      stewardOrchestrator.setDurableObjective(objectiveInput.trim());
      setIsEditingObjective(false);
    }
  };

  const handleUpdateSpendThreshold = (val: number) => {
    setCustomSpendLimit(val);
    stewardOrchestrator.setAutoSpendThreshold(val);
  };

  const getCategoryBadgeClass = (category: EvidenceCategory) => {
    switch (category) {
      case 'OBSERVED':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
      case 'MODELED':
        return 'bg-blue-950/80 text-blue-300 border-blue-700/60';
      case 'ESTIMATED':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/60';
      case 'VERIFIED':
        return 'bg-purple-950/80 text-purple-300 border-purple-700/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Banner / Hackathon Header */}
      <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/20">
              <Droplets className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">ATLAS STEWARD</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  AWS Agents Hackathon 2026
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Good Neighbor Agents
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous Community Operations & Essential Water Reliability</p>
            </div>
          </div>

          {/* Quick Demo Controls & Innovations Dropdown */}
          <div className="flex items-center gap-3">
            {/* Unified Atlas Innovations Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsInnovationsMenuOpen(!isInnovationsMenuOpen)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-slate-800 to-slate-850 hover:from-slate-750 hover:to-slate-800 text-xs font-semibold text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition-all shadow-md"
                aria-expanded={isInnovationsMenuOpen}
                aria-haspopup="true"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Atlas Innovations</span>
                <ChevronDown className={`w-3 h-3 text-amber-400 transition-transform ${isInnovationsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isInnovationsMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-50 bg-black/20"
                    onClick={() => setIsInnovationsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden ring-1 ring-white/10 animate-in fade-in slide-in-from-top-2 duration-150 p-2 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Hackathons & Spotlights
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                        2026
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setIsInnovationsMenuOpen(false);
                        onSelectTab?.('steward');
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-start gap-2.5 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-amber-200">Atlas Steward</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-bold">AWS 2026</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Good Neighbor Agents: Water Reliability & Operations</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsInnovationsMenuOpen(false);
                        onSelectTab?.('sentinel');
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700 flex items-start gap-2.5 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-emerald-200">Atlas Sentinel</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40">TechJam 2026</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Epistemic Content Verification & Viral Defense</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsInnovationsMenuOpen(false);
                        onSelectTab?.('agent-mission-control');
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700 flex items-start gap-2.5 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                        <Radio className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-purple-200">Agent Mission Control</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/40">GCP Swarm</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Autonomous Multi-Agent Swarms & Self-Healing</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsInnovationsMenuOpen(false);
                        onSelectTab?.('ai-engineering');
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700 flex items-start gap-2.5 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-blue-200">AI Engineering Studio</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/40">Gemini 3.7</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Live Voice, Prompt Inspection & Token Analytics</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsInnovationsMenuOpen(false);
                        onSelectTab?.('system-model-studio');
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700 flex items-start gap-2.5 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                        <GitBranch className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-200">Systems Dynamics Studio</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40">Causal SD</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Differential Stock-Flow & Meadows Leverage</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsInnovationsMenuOpen(false);
                        onSelectTab?.('governance');
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700 flex items-start gap-2.5 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                        <Scale className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-indigo-200">Governance SDK</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/40">Axiomatic</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Mathematical Ethics & Quadratic Consensus</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsInnovationsMenuOpen(false);
                        onSelectTab?.('reality-engine');
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700 flex items-start gap-2.5 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                        <Globe2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-teal-200">Reality Engine</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40">Planetary Mesh</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Ground-Truth IoT Mesh & Physical Placards</p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <button
              onClick={handleResetDemo}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
              title="Reset to deterministic demo baseline"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              Reset Demo
            </button>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400">Auto Spend Limit:</span>
              <span className="font-bold text-amber-400">${state.autoApprovalSpendThresholdUsd}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Durable Objective Card */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Bot className="w-4 h-4" />
                Durable Community Objective
              </div>
              {isEditingObjective ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    defaultValue={state.durableObjective}
                    onChange={(e) => setObjectiveInput(e.target.value)}
                    className="bg-slate-950 border border-amber-500/50 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 w-full max-w-xl"
                  />
                  <button
                    onClick={handleSaveObjective}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingObjective(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-base sm:text-lg font-medium text-slate-100 max-w-3xl leading-snug">
                  "{state.durableObjective}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setObjectiveInput(state.durableObjective);
                  setIsEditingObjective(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700/60 flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                Adjust Objective
              </button>
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Autonomous Loop Active
              </div>
            </div>
          </div>
        </div>

        {/* Action Success Alert */}
        {actionSuccessBanner && (
          <div className="rounded-xl bg-emerald-950/80 border border-emerald-600/60 p-4 text-emerald-200 text-sm flex items-start gap-3 shadow-lg animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-white">Action Verified & Recorded</p>
              <p className="text-xs text-emerald-300/90 mt-0.5">{actionSuccessBanner}</p>
            </div>
            <button
              onClick={() => setActionSuccessBanner(null)}
              className="text-xs text-emerald-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Exception-First High-Level Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-1">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Routine Work</div>
            <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
              18
              <span className="text-xs font-normal text-slate-400">tasks</span>
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              100% Autonomous
            </div>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-1">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Completed</div>
            <div className="text-2xl font-bold text-emerald-400">{state.stats.completedTasksCount}</div>
            <div className="text-[11px] text-slate-400">Silent execution</div>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-1">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">In Progress</div>
            <div className="text-2xl font-bold text-blue-400">{state.stats.inProgressTasksCount}</div>
            <div className="text-[11px] text-slate-400">1 technician active</div>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-1">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Waiting / Queued</div>
            <div className="text-2xl font-bold text-amber-400">{state.stats.waitingTasksCount}</div>
            <div className="text-[11px] text-slate-400">Next cycle scheduled</div>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-1">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Time Saved</div>
            <div className="text-2xl font-bold text-white">{state.stats.timeSavedHours} <span className="text-xs text-slate-400 font-normal">hrs</span></div>
            <div className="text-[11px] text-purple-300">Coordination spared</div>
          </div>

          <div className={`rounded-xl border p-4 space-y-1 ${state.activeExceptions.length > 0 ? 'bg-amber-950/40 border-amber-600/60 ring-1 ring-amber-500/30' : 'bg-slate-900 border-slate-800'}`}>
            <div className="text-[11px] font-medium text-amber-300 uppercase tracking-wider">Exceptions For You</div>
            <div className="text-2xl font-bold text-amber-400 flex items-center gap-1.5">
              {state.activeExceptions.length}
              {state.activeExceptions.length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
            <div className="text-[11px] text-slate-300">Requires judgment</div>
          </div>
        </div>

        {/* Priority Floor Reliability Strip */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">Priority Floor Status:</span>
            <span className="text-slate-400">Essential Community Services Baseline</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {state.priorityFloor.map((pf) => (
              <div key={pf.dimension} className="flex items-center gap-1.5">
                <span className="capitalize text-slate-400">{pf.dimension}:</span>
                <span className={`font-bold ${pf.status === 'NOMINAL' ? 'text-emerald-400' : pf.status === 'DEGRADED' ? 'text-amber-400' : 'text-red-400'}`}>
                  {pf.reliabilityScore.toFixed(1)}%
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${pf.status === 'NOMINAL' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'cockpit'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Decisions For You ({state.activeExceptions.length})
          </button>
          <button
            onClick={() => setActiveTab('routine_tasks')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'routine_tasks'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Workflow className="w-4 h-4" />
            18 Autonomous Routine Tasks
          </button>
          <button
            onClick={() => setActiveTab('water_assets')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'water_assets'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Droplets className="w-4 h-4" />
            Water Asset Network ({state.assets.length})
          </button>
          <button
            onClick={() => setActiveTab('memory_loop')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'memory_loop'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Strands Memory & Learning Loop
          </button>
          <button
            onClick={() => setActiveTab('aws_architecture')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'aws_architecture'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <CloudLightning className="w-4 h-4" />
            AWS + Strands Architecture
          </button>
        </div>

        {/* TAB 1: COCKPIT / DECISIONS FOR YOU */}
        {activeTab === 'cockpit' && (
          <div className="space-y-6">
            {state.activeExceptions.length === 0 ? (
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Zero Pending Human Exceptions</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    Atlas Steward is silently coordinating all 18 routine maintenance tasks, sensor calibrations, and shift allocations.
                  </p>
                </div>
                <button
                  onClick={handleResetDemo}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  Trigger Borehole 03 Hero Anomaly Demo
                </button>
              </div>
            ) : (
              state.activeExceptions.map((exc) => (
                <div
                  key={exc.id}
                  className="rounded-2xl bg-slate-900 border-2 border-amber-500/60 shadow-2xl overflow-hidden relative"
                >
                  {/* Header Badge Strip */}
                  <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 px-6 py-4 border-b border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Critical Decision Escalation</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-semibold border border-red-500/40">
                            {exc.severity}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-white">{exc.title}</h2>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-slate-400">Asset: </span>
                      <span className="font-semibold text-slate-200">{exc.assetName}</span>
                      <div className="text-slate-400">Impact: <span className="text-amber-300 font-bold">{exc.populationImpacted.toLocaleString()} residents</span></div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* What Happened & Why It Matters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-1.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-amber-400" />
                          What Happened
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed">{exc.whatHappened}</p>
                      </div>

                      <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-1.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-red-400" />
                          Why It Matters
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed">{exc.whyItMatters}</p>
                      </div>
                    </div>

                    {/* Epistemic Evidence Layer Display */}
                    <div className="pt-1">
                      <EvidenceDisplay evidence={exc.evidence} />
                    </div>

                    {/* Policy Threshold & Recommended Action */}
                    <div className="rounded-xl bg-amber-950/20 border border-amber-600/40 p-4 space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        Policy Boundary Threshold Triggered
                      </div>
                      <p className="text-xs font-mono text-amber-200/90">{exc.policyThresholdTriggered}</p>
                    </div>

                    {/* Available Options Matrix */}
                    <div className="space-y-2.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Evaluated Action Options
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {exc.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`rounded-xl p-4 space-y-2.5 border transition-all ${
                              opt.isRecommended
                                ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/80 ring-1 ring-amber-500/40 shadow-lg'
                                : 'bg-slate-950/60 border-slate-800 text-slate-400'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-xs font-bold ${opt.isRecommended ? 'text-white' : 'text-slate-300'}`}>
                                {opt.label}
                              </h4>
                              {opt.isRecommended && (
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-300 leading-snug">{opt.description}</p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                              <div>
                                <span className="text-slate-400">Cost:</span>
                                <div className="font-bold text-white">${opt.costUsd}</div>
                              </div>
                              <div>
                                <span className="text-slate-400">Downtime:</span>
                                <div className="font-bold text-slate-200">{opt.downtimeHours}h</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Potential Consequences If Ignored */}
                    <div className="rounded-xl bg-red-950/20 border border-red-800/40 p-4 space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-red-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        Consequences If Ignored
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-red-200/90 list-disc list-inside">
                        {exc.potentialConsequencesIfIgnored.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Cockpit Buttons */}
                    <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                      <div className="text-xs text-slate-400">
                        Estimated Resolution Time: <strong className="text-slate-200">3.5 Hours</strong> · Supplier: <strong className="text-slate-200">Rift Valley Precision Hydro</strong>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          disabled={isActionExecuting}
                          onClick={() => handlePause(exc)}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <Pause className="w-3.5 h-3.5" />
                          Pause
                        </button>

                        <button
                          disabled={isActionExecuting}
                          onClick={() => {
                            setSelectedException(exc);
                            setIsModifyingModalOpen(true);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-amber-500/30 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Modify Parameters
                        </button>

                        <button
                          disabled={isActionExecuting}
                          onClick={() => handleReject(exc)}
                          className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-200 font-semibold text-xs border border-red-700/60 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>

                        <button
                          disabled={isActionExecuting}
                          onClick={() => handleApprove(exc)}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
                        >
                          <ThumbsUp className="w-4 h-4 text-slate-950" />
                          {isActionExecuting ? 'Executing & Verifying...' : 'Approve Recommended Action ($1,420)'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Resolved Decisions History */}
            {state.resolvedDecisions.length > 0 && (
              <div className="space-y-3 pt-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Resolved Decisions in Current Cycle ({state.resolvedDecisions.length})
                </div>
                <div className="space-y-3">
                  {state.resolvedDecisions.map((res) => (
                    <div
                      key={res.id}
                      className="rounded-xl bg-slate-900/60 border border-emerald-500/30 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{res.title}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            {res.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-400">{res.decisionNotes || 'Approved and outcome physically verified.'}</p>
                      </div>
                      <div className="text-slate-400 font-mono text-[11px]">
                        Decided at: {res.decidedAt ? new Date(res.decidedAt).toLocaleTimeString() : 'Just now'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: 18 AUTONOMOUS ROUTINE TASKS */}
        {activeTab === 'routine_tasks' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">18 Routine Coordination Tasks</h3>
                <p className="text-xs text-slate-400">Executed silently in the background by Steward, Operations, and Resource agents.</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={expandedTaskCategory}
                  onChange={(e) => setExpandedTaskCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="inspection">Physical Inspections</option>
                  <option value="sensor_calibration">Sensor Calibrations</option>
                  <option value="chlorine_buffer">Chlorine Dosing</option>
                  <option value="inventory_reorder">Inventory Reorder</option>
                  <option value="solar_inverter_check">Solar & Battery Checks</option>
                  <option value="community_notice">Community SMS Bulletins</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {state.routineTasks
                .filter((t) => expandedTaskCategory === 'all' || t.category === expandedTaskCategory)
                .map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-emerald-400' : task.status === 'in_progress' ? 'bg-blue-400 animate-pulse' : 'bg-amber-400'}`} />
                        <h4 className="text-xs font-bold text-white">{task.title}</h4>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {task.assignedAgent}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">{task.automatedReason}</p>

                    {task.outcomeSummary && (
                      <div className="rounded-lg bg-slate-950/60 p-2 text-[11px] text-emerald-300 font-mono">
                        Outcome: {task.outcomeSummary}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-850">
                      <span>Tool Chain: {task.toolChain.join(' → ')}</span>
                      <span>{task.executionTimestamp} ({task.durationMs}ms)</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: WATER ASSET NETWORK TOPOLOGY */}
        {activeTab === 'water_assets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Community Water Asset Network</h3>
                <p className="text-xs text-slate-400">12 monitored water points, treatment units, and distribution lines serving 12,400 people.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {state.assets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAssetForTelemetry(asset)}
                  className={`rounded-xl p-4 space-y-3 border cursor-pointer transition-all ${
                    asset.status === 'CRITICAL'
                      ? 'bg-red-950/30 border-red-600/60 ring-1 ring-red-500/30'
                      : asset.status === 'WARNING'
                      ? 'bg-amber-950/30 border-amber-600/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">{asset.id}</span>
                      <h4 className="text-xs font-bold text-white">{asset.name}</h4>
                      <span className="text-[11px] text-slate-400">{asset.location}</span>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      asset.status === 'OPERATIONAL'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : asset.status === 'CRITICAL'
                        ? 'bg-red-950 text-red-300 border-red-700'
                        : 'bg-amber-950 text-amber-300 border-amber-700'
                    }`}>
                      {asset.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400">Flow:</span>
                      <div className="font-bold text-slate-200">{asset.flowRateLps} L/s</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Pressure:</span>
                      <div className="font-bold text-slate-200">{asset.pressureBar} bar</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Vibration:</span>
                      <div className={`font-bold ${asset.vibrationMmS > 4.5 ? 'text-red-400' : 'text-slate-200'}`}>
                        {asset.vibrationMmS} mm/s
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Serves: <strong>{asset.servesPopulation.toLocaleString()}</strong> people</span>
                    <span>Zone: <strong>{asset.zone}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STRANDS MEMORY & LEARNING LOOP */}
        {activeTab === 'memory_loop' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-800/40 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Autonomous Learning Loop</h3>
                  <p className="text-xs text-slate-400">
                    How past incidents compound into better recommendations without manual retraining.
                  </p>
                </div>
              </div>

              {/* Visual 4-Step Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 space-y-1.5">
                  <div className="text-[10px] font-bold text-purple-400 uppercase">1. Past Incident (2025)</div>
                  <p className="text-xs text-slate-300 font-semibold">Impeller Cavitation on BH-03</p>
                  <p className="text-[11px] text-slate-400">Standard silicon seal failed after quartz silt draw.</p>
                </div>

                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 space-y-1.5">
                  <div className="text-[10px] font-bold text-purple-400 uppercase">2. Stored Lesson (MEM-2025-0812)</div>
                  <p className="text-xs text-slate-300 font-semibold">Tungsten-Carbide Rule</p>
                  <p className="text-[11px] text-slate-400">Stored in Strands memory bank with pre-approved vendor.</p>
                </div>

                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 space-y-1.5">
                  <div className="text-[10px] font-bold text-purple-400 uppercase">3. Today's Anomaly</div>
                  <p className="text-xs text-slate-300 font-semibold">Vibration Surges to 6.8 mm/s</p>
                  <p className="text-[11px] text-slate-400">Agent recalls past lesson; does not suggest cheap EPDM patch.</p>
                </div>

                <div className="rounded-xl bg-slate-950/80 border border-emerald-700/60 p-3.5 space-y-1.5">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase">4. Improved Recommendation</div>
                  <p className="text-xs text-emerald-200 font-semibold">Tungsten Seal Quote ($1,420)</p>
                  <p className="text-[11px] text-slate-400">Prevents $4,800 catastrophic pump replacement.</p>
                </div>
              </div>
            </div>

            {/* Stored Lessons Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Strands Persistent Memory Bank ({state.memoryLessons.length} Operational Lessons)
              </h4>
              <div className="space-y-3">
                {state.memoryLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-purple-400">{lesson.id}</span>
                        <span className="text-xs font-semibold text-white">{lesson.incidentRef}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Retrieved {lesson.retrievalCount} times</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400">Symptom:</span>
                        <p className="text-slate-200">{lesson.symptomPattern}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Root Cause:</span>
                        <p className="text-slate-200">{lesson.rootCause}</p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-950/70 p-3 text-xs text-slate-300 border border-slate-850">
                      <strong className="text-purple-300">Operational Lesson:</strong> {lesson.lessonLearned}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AWS ARCHITECTURE */}
        {activeTab === 'aws_architecture' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <CloudLightning className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AWS Agents Architecture</h3>
                  <p className="text-xs text-slate-400">Amazon Bedrock + Strands Agents SDK + AgentCore</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" />
                    Amazon Bedrock
                  </div>
                  <p className="text-xs text-slate-300">
                    Powers reasoning, epistemic claim generation, and trade-off planning across the 4 specialized agents.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-2">
                  <div className="text-xs font-bold text-blue-400 uppercase flex items-center gap-1.5">
                    <Workflow className="w-4 h-4" />
                    Strands Agents SDK
                  </div>
                  <p className="text-xs text-slate-300">
                    Provides deterministic tool calling, pre-execution safety hooks, and persistent memory synchronization.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <Database className="w-4 h-4" />
                    Bedrock AgentCore & DynamoDB
                  </div>
                  <p className="text-xs text-slate-300">
                    Guarantees durable state storage, audit logging, and cross-session knowledge retrieval.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Activity Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Live Agent Activity & Tool Execution Stream
              </h4>

              <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 max-h-96 overflow-y-auto space-y-2 font-mono text-xs">
                {state.activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.agentRole === 'STEWARD' ? 'bg-amber-500/20 text-amber-300' :
                        log.agentRole === 'OPERATIONS' ? 'bg-blue-500/20 text-blue-300' :
                        log.agentRole === 'RESOURCE' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {log.agentName}
                      </span>
                      <span className="text-slate-200">{log.details}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 shrink-0">
                      {log.toolName && <span className="text-amber-400/80">tool:{log.toolName}</span>}
                      <span>{log.latencyMs}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modify Parameters Modal */}
      {isModifyingModalOpen && selectedException && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-400" />
              Modify Action Parameters
            </h3>
            <p className="text-xs text-slate-400">
              Adjust work order parameters, contractor selection, or add operator instructions for {selectedException.assetName}.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Operator Notes & Instructions:</label>
                <textarea
                  rows={3}
                  value={modificationNotes}
                  onChange={(e) => setModificationNotes(e.target.value)}
                  placeholder="e.g. Pre-flush casing with Header Tank B buffer before technician disassembles shaft seal."
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Adjust Auto Spend Threshold:</label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="range"
                    min="100"
                    max="2500"
                    step="50"
                    value={customSpendLimit}
                    onChange={(e) => handleUpdateSpendThreshold(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <span className="font-mono text-xs font-bold text-amber-400">${customSpendLimit}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsModifyingModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyModification}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950"
              >
                Apply & Dispatch Work Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
