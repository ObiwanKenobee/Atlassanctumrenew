import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  DollarSign,
  Cpu,
  Sparkles,
  Search,
  ExternalLink,
  Plus,
  BookOpen,
  Filter,
  BarChart3,
  Calendar,
  Compass,
  FileCheck
} from 'lucide-react';
import { ProjectOsItem, ProjectLifecycleStage } from '../../types';
import { PROJECT_OS_ITEMS } from '../../data/prompt2CivilizationData';

interface ProjectOsViewProps {
  onSelectTab: (tab: any) => void;
  onOpenEvidenceForProject?: (projectName: string) => void;
}

const LIFECYCLE_STAGES: { stage: ProjectLifecycleStage; label: string; desc: string }[] = [
  { stage: 'Discover', label: '01. Discover', desc: 'Sovereign problem identification by local stewards' },
  { stage: 'Frame', label: '02. Frame', desc: 'Epistemic root-cause mapping and causal boundaries' },
  { stage: 'Design', label: '03. Design', desc: 'Bio-regional architecture and moral constraint modeling' },
  { stage: 'Fund', label: '04. Fund', desc: 'Patient capital commitment & non-extractive structuring' },
  { stage: 'Build', label: '05. Build', desc: 'Decentralized local manufacturing & physical execution' },
  { stage: 'Monitor', label: '06. Monitor', desc: 'Continuous IoT sensor mesh & community observation' },
  { stage: 'Verify', label: '07. Verify', desc: 'Cryptographic hash anchoring & third-party audit' },
  { stage: 'Learn', label: '08. Learn', desc: 'Transparent failure analysis and epistemic post-mortems' },
  { stage: 'Scale', label: '09. Scale', desc: 'Open-source blueprint distribution without monopoly' }
];

export const ProjectOsView: React.FC<ProjectOsViewProps> = ({ onSelectTab }) => {
  const [projects, setProjects] = useState<ProjectOsItem[]>(PROJECT_OS_ITEMS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECT_OS_ITEMS[0].id);
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('');
  const [newProjectProblem, setNewProjectProblem] = useState('');
  const [newProjectTheory, setNewProjectTheory] = useState('');
  const [newProjectBudget, setNewProjectBudget] = useState('5000000');

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const filteredProjects = projects.filter(p => {
    const matchesStage = selectedStageFilter === 'all' || p.stage === selectedStageFilter;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesQuery;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProj: ProjectOsItem = {
      id: `pos-${Date.now()}`,
      name: newProjectName,
      code: `ATLAS-PRJ-2026-${String(projects.length + 1).padStart(3, '0')}`,
      stage: 'Discover',
      location: newProjectLocation || 'East African Rift Bioregion',
      bioregion: 'Sub-Saharan Agro-Ecological Corridor',
      problemStatement: newProjectProblem || 'Uncoordinated infrastructure and extraction vulnerable to climate shocks.',
      theoryOfChange: newProjectTheory || 'Deploying open-source modular systems under sovereign community governance.',
      humanOwners: [
        { name: 'Community Assembly Representative', role: 'Civic Steward', organization: 'Local Cooperative' },
        { name: 'Systems Engineer', role: 'Technical Lead', organization: 'Atlas Engineering Commons' }
      ],
      stakeholders: ['Local Community Assembly', 'Atlas Capital Trust', 'Regional University'],
      budget: {
        total: Number(newProjectBudget) || 5000000,
        funded: Number(newProjectBudget) * 0.25 || 1250000,
        currency: 'USD',
        patientCapitalRatio: 0.9
      },
      timeline: {
        start: '2026-09-01',
        targetCompletion: '2029-08-31',
        lifecycleMonths: 36
      },
      milestones: [
        { id: 'm1', title: 'Community Consent & Baseline Census', status: 'in_progress', targetDate: '2026-11-30', deliverable: '100% consent of contiguous households' },
        { id: 'm2', title: 'Modular Prototype Deployment', status: 'pending', targetDate: '2027-06-30', deliverable: 'First physical node live with IoT telemetry' }
      ],
      risks: [
        { risk: 'Supply chain delays for specialized components', severity: 'medium', mitigation: 'Fabricate via Atlas Industrial micro-foundry nodes.' }
      ],
      impactMetrics: [
        { name: 'Community Beneficiaries', target: '25,000', current: '0', verificationMethod: 'Field census and identity ledger' }
      ],
      governance: {
        model: 'Civic Guild Stewardship Cooperative',
        communityVetoPower: true,
        auditCadence: 'Quarterly Epistemic Review'
      },
      aiAnalysis: {
        systemicLeverageScore: 89,
        ethicalDignityScore: 95,
        secondOrderRisks: ['Requires robust local maintenance guild apprenticeships'],
        recommendedAction: 'Link with Atlas Academy training track before full capital disbursement.',
        confidence: 91
      },
      lessonsLearned: ['Early phase community deliberation prevents subsequent deployment delays.']
    };

    setProjects([newProj, ...projects]);
    setSelectedProjectId(newProj.id);
    setShowNewProjectModal(false);
    setNewProjectName('');
    setNewProjectLocation('');
    setNewProjectProblem('');
    setNewProjectTheory('');
  };

  const getStageIndex = (stage: ProjectLifecycleStage) => {
    return LIFECYCLE_STAGES.findIndex(s => s.stage === stage);
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              PROJECT OPERATING SYSTEM (PROJECT OS) • 9-STAGE LIFECYCLE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Civilization Project Architecture</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            A unified operating framework taking complex civilizational challenges from problem discovery to verifiable, regenerative multi-generational scale.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Propose Project</span>
          </button>
          <button
            onClick={() => onSelectTab('evidence-ledger')}
            className="px-4 py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Audit Evidence</span>
          </button>
        </div>
      </div>

      {/* 9-Stage Interactive Lifecycle Ribbon */}
      <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
            THE 9-STAGE CIVILIZATION LIFECYCLE
          </span>
          <span className="text-xs text-[#F5F5F0]/50 font-mono">
            Active: <span className="text-[#C5A059] font-bold">{selectedProject.stage}</span> (Stage {getStageIndex(selectedProject.stage) + 1}/9)
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {LIFECYCLE_STAGES.map((s, idx) => {
            const currentIdx = getStageIndex(selectedProject.stage);
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div
                key={s.stage}
                onClick={() => setSelectedStageFilter(s.stage)}
                className={`p-3 rounded-xs border cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#1B3022] border-[#C5A059] text-[#F5F5F0] shadow-sm'
                    : isCompleted
                    ? 'bg-[#121212] border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
                    : 'bg-[#080808] border-[#F5F5F0]/5 text-[#F5F5F0]/40 hover:border-[#F5F5F0]/20'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="font-bold">{String(idx + 1).padStart(2, '0')}</span>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  {isCurrent && <Clock className="w-3 h-3 text-[#C5A059] animate-pulse" />}
                </div>
                <div className="text-xs font-bold truncate">{s.stage}</div>
                <div className="text-[9px] text-[#F5F5F0]/50 line-clamp-2 mt-1 leading-tight hidden sm:block">
                  {s.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Projects List + Comprehensive Project Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Projects Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F0]/10">
            <span className="text-xs font-mono uppercase text-[#F5F5F0]/70 font-bold">
              ACTIVE REGIONAL INITIATIVES ({filteredProjects.length})
            </span>
            {selectedStageFilter !== 'all' && (
              <button
                onClick={() => setSelectedStageFilter('all')}
                className="text-[10px] font-mono text-[#C5A059] hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40" />
            <input
              type="text"
              placeholder="Search code, name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm pl-9 pr-3 py-2 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]/60 font-mono"
            />
          </div>

          {/* List of Projects */}
          <div className="space-y-2.5">
            {filteredProjects.map((p) => {
              const isSelected = p.id === selectedProjectId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`p-4 rounded-sm border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-[#151515] border-[#C5A059] shadow-md'
                      : 'bg-[#0D0D0D] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#C5A059] font-bold">{p.code}</span>
                    <span className="px-2 py-0.5 bg-[#1B3022] text-emerald-300 rounded text-[9px] uppercase font-bold">
                      {p.stage}
                    </span>
                  </div>

                  <h3 className="text-sm font-serif font-bold text-[#F5F5F0] leading-snug">
                    {p.name}
                  </h3>

                  <div className="text-[11px] text-[#F5F5F0]/50 font-sans truncate">
                    {p.location}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/60 border-t border-[#F5F5F0]/5">
                    <span>Budget: ${ (p.budget.total / 1000000).toFixed(1) }M</span>
                    <span>Leverage: {p.aiAnalysis.systemicLeverageScore}/100</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Deep Project Dossier */}
        <div className="lg:col-span-8 space-y-6">
          {/* Dossier Header Card */}
          <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#C5A059]">
                  <span className="font-bold">{selectedProject.code}</span>
                  <span>•</span>
                  <span>{selectedProject.bioregion}</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#F5F5F0] mt-1">
                  {selectedProject.name}
                </h2>
                <div className="text-xs text-[#F5F5F0]/60 font-sans mt-0.5">
                  {selectedProject.location}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="px-3 py-1 bg-[#1B3022] border border-emerald-500/40 text-emerald-300 font-mono text-xs uppercase font-bold rounded-sm">
                  Stage: {selectedProject.stage}
                </span>
              </div>
            </div>

            {/* Problem & Theory of Change */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs space-y-2">
                <span className="text-[10px] font-mono uppercase text-rose-400 font-bold tracking-wider">
                  01. PROBLEM STATEMENT
                </span>
                <p className="text-[#F5F5F0]/80 leading-relaxed font-sans">
                  {selectedProject.problemStatement}
                </p>
              </div>

              <div className="p-4 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs space-y-2">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">
                  02. THEORY OF CHANGE
                </span>
                <p className="text-[#F5F5F0]/80 leading-relaxed font-sans">
                  {selectedProject.theoryOfChange}
                </p>
              </div>
            </div>

            {/* Budget & Capital Metrics */}
            <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
              <div className="space-y-0.5">
                <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Total Commitment</div>
                <div className="text-base font-bold text-[#F5F5F0]">
                  ${ (selectedProject.budget.total / 1000000).toFixed(2) }M
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Funded / Disbursed</div>
                <div className="text-base font-bold text-emerald-400">
                  ${ (selectedProject.budget.funded / 1000000).toFixed(2) }M
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Patient Capital Ratio</div>
                <div className="text-base font-bold text-[#C5A059]">
                  { (selectedProject.budget.patientCapitalRatio * 100).toFixed(0) }% Non-Extractive
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Timeline Horizon</div>
                <div className="text-base font-bold text-[#8FB8DE]">
                  {selectedProject.timeline.lifecycleMonths} Months
                </div>
              </div>
            </div>
          </div>

          {/* Section: Milestones & Verifiable Deliverables */}
          <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#F5F5F0]">
                  Milestones & Cryptographic Deliverables
                </h3>
              </div>
              <span className="text-xs font-mono text-[#F5F5F0]/40">
                {selectedProject.milestones.filter(m => m.status === 'completed').length} / {selectedProject.milestones.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {selectedProject.milestones.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-3.5 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#C5A059] font-bold">M{idx + 1}</span>
                      <span className="font-bold text-[#F5F5F0]">{m.title}</span>
                      <span className="text-[10px] text-[#F5F5F0]/40 font-mono">({m.targetDate})</span>
                    </div>
                    <div className="text-[#F5F5F0]/70 text-[11px] font-sans">
                      Deliverable: {m.deliverable}
                    </div>
                    {m.evidenceHash && (
                      <div className="font-mono text-[9px] text-[#8FB8DE] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Anchor: {m.evidenceHash}</span>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {m.status === 'completed' && (
                      <span className="px-2 py-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono uppercase font-bold rounded">
                        Verified
                      </span>
                    )}
                    {m.status === 'in_progress' && (
                      <span className="px-2 py-1 bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px] font-mono uppercase font-bold rounded">
                        In Execution
                      </span>
                    )}
                    {m.status === 'pending' && (
                      <span className="px-2 py-1 bg-neutral-900 border border-neutral-700 text-neutral-400 text-[10px] font-mono uppercase font-bold rounded">
                        Queued
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Human Stewards, Governance & AI Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Human Owners & Governance */}
            <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F5F5F0]/10">
                <UserCheck className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F0]">
                  Human Stewards & Governance
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                {selectedProject.humanOwners.map((owner, i) => (
                  <div key={i} className="p-2.5 bg-[#141414] border border-[#F5F5F0]/5 rounded-xs space-y-0.5">
                    <div className="font-bold text-[#F5F5F0]">{owner.name}</div>
                    <div className="text-[10px] text-[#C5A059] font-mono">{owner.role} • {owner.organization}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#1B3022]/40 border border-emerald-500/20 rounded-xs space-y-1 text-xs">
                <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                  Sovereignty & Veto Protocol
                </div>
                <div className="text-[#F5F5F0]/80 text-[11px]">
                  Model: {selectedProject.governance.model}
                </div>
                <div className="text-emerald-300 font-mono text-[10px]">
                  ✓ Community Veto Power Binding
                </div>
              </div>
            </div>

            {/* Right: AI Systemic & Moral Analysis */}
            <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F0]/10">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F0]">
                    AI Systemic Leverage Evaluator
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#C5A059]">
                  {selectedProject.aiAnalysis.confidence}% Epistemic Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center font-mono">
                <div className="p-2.5 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs">
                  <div className="text-[9px] text-[#F5F5F0]/40">Systemic Leverage</div>
                  <div className="text-xl font-bold text-[#C5A059]">
                    {selectedProject.aiAnalysis.systemicLeverageScore}/100
                  </div>
                </div>
                <div className="p-2.5 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs">
                  <div className="text-[9px] text-[#F5F5F0]/40">Ethical Dignity</div>
                  <div className="text-xl font-bold text-emerald-400">
                    {selectedProject.aiAnalysis.ethicalDignityScore}/100
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  Surfaced 2nd-Order Risks:
                </span>
                <ul className="space-y-1 text-[11px] text-[#F5F5F0]/70 list-disc list-inside">
                  {selectedProject.aiAnalysis.secondOrderRisks.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-[#121212] border border-[#C5A059]/20 rounded-xs space-y-1">
                <div className="text-[9px] font-mono uppercase text-[#C5A059] font-bold">Recommended Policy:</div>
                <p className="text-[11px] text-[#F5F5F0]/80 font-sans">{selectedProject.aiAnalysis.recommendedAction}</p>
              </div>
            </div>
          </div>

          {/* Section: Lessons Learned & Failure Audits */}
          <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F5F5F0]/10">
              <BookOpen className="w-4 h-4 text-[#C5A059]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F0]">
                Candid Field Lessons & What We Got Wrong
              </h3>
            </div>
            <div className="space-y-2 text-xs">
              {selectedProject.lessonsLearned.map((lesson, idx) => (
                <div key={idx} className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
                  • {lesson}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Propose Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#C5A059] rounded-sm max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">PROJECT OS • STAGE 01</span>
                <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">Propose New Civilizational Project</h3>
              </div>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-[#F5F5F0]/40 hover:text-[#F5F5F0] text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#F5F5F0]/70 uppercase">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Lake Victoria Watershed Agro-Pod Network"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-sm px-3 py-2 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#F5F5F0]/70 uppercase">Location & Bioregion</label>
                <input
                  type="text"
                  placeholder="e.g., Kisumu / Homa Bay, Kenya"
                  value={newProjectLocation}
                  onChange={(e) => setNewProjectLocation(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-sm px-3 py-2 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#F5F5F0]/70 uppercase">Root Problem Statement</label>
                <textarea
                  rows={3}
                  placeholder="Describe the physical reality, community pain points, and systemic bottlenecks..."
                  value={newProjectProblem}
                  onChange={(e) => setNewProjectProblem(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-sm p-3 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#F5F5F0]/70 uppercase">Theory of Change & Moral Constraints</label>
                <textarea
                  rows={3}
                  placeholder="How will this intervention compound human flourishing without extraction or environmental harm?"
                  value={newProjectTheory}
                  onChange={(e) => setNewProjectTheory(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-sm p-3 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#F5F5F0]/70 uppercase">Initial Capital Requirement (USD)</label>
                <input
                  type="number"
                  value={newProjectBudget}
                  onChange={(e) => setNewProjectBudget(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-sm px-3 py-2 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C5A059] font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#F5F5F0]/10">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 bg-transparent text-[#F5F5F0]/60 hover:text-[#F5F5F0] text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs uppercase tracking-widest rounded-sm"
                >
                  Submit for Moral & Epistemic Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
