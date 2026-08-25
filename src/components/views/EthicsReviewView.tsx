import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Vote, 
  FileText, 
  UserCheck, 
  HelpCircle,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Lock
} from 'lucide-react';
import { PLATFORM_POLICY_PROPOSALS } from '../../data/ethicsReviewData';
import { PlatformPolicyProposal, PolicyReviewVote } from '../../types';
import { RealityCheck } from '../RealityCheck';
import { audioFeedback } from '../../lib/audioFeedback';

interface EthicsReviewViewProps {
  onOpenCommandments?: () => void;
  onOpenMoralSimulator?: () => void;
}

export const EthicsReviewView: React.FC<EthicsReviewViewProps> = ({
  onOpenCommandments,
  onOpenMoralSimulator
}) => {
  const [proposals, setProposals] = useState<PlatformPolicyProposal[]>(PLATFORM_POLICY_PROPOSALS);
  const [selectedProposalId, setSelectedProposalId] = useState<string>(PLATFORM_POLICY_PROPOSALS[0].id);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // User vote state
  const [voteStance, setVoteStance] = useState<'approve' | 'amend' | 'veto'>('approve');
  const [voteRationale, setVoteRationale] = useState('');
  const [voterName, setVoterName] = useState('');
  const [voteSuccess, setVoteSuccess] = useState(false);

  const selectedProposal = proposals.find(p => p.id === selectedProposalId) || proposals[0];

  const filteredProposals = proposals.filter(p => {
    if (filterCategory === 'all') return true;
    return p.reviewStatus === filterCategory;
  });

  const getStatusBadge = (status: PlatformPolicyProposal['reviewStatus']) => {
    switch (status) {
      case 'approved':
        return { label: 'Ratified by Covenant', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40', icon: CheckCircle2 };
      case 'vetoed_by_covenant':
        return { label: 'Permanently Vetoed', bg: 'bg-red-950/80 text-red-300 border-red-500/40', icon: XCircle };
      case 'active_deliberation':
        return { label: 'Active Deliberation', bg: 'bg-amber-950/80 text-amber-300 border-amber-500/40', icon: Clock };
      case 'amendment_required':
      default:
        return { label: 'Amendment Required', bg: 'bg-sky-950/80 text-sky-300 border-sky-500/40', icon: AlertOctagon };
    }
  };

  const handleCastVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voteRationale.trim()) return;

    const newVote: PolicyReviewVote = {
      userId: `voter-${Date.now()}`,
      userName: voterName || 'Anonymous Citizen Steward',
      stance: voteStance,
      rationale: voteRationale,
      priorityFloorImpactAssessment: 'Audited against sub-floor vulnerability threshold.',
      timestamp: new Date().toISOString().split('T')[0]
    };

    const updated = proposals.map(p => {
      if (p.id === selectedProposal.id) {
        return {
          ...p,
          deliberationVotes: [newVote, ...p.deliberationVotes]
        };
      }
      return p;
    });

    setProposals(updated);
    setVoteRationale('');
    setVoteSuccess(true);
    audioFeedback.playCovenantResonance();
    setTimeout(() => setVoteSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              CONSTITUTIONAL GOVERNANCE • ETHICAL ARBITRATION
            </span>
            <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Commandment I: Priority Floor Axiom
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Ethics Review & Policy Dashboard</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-3xl font-sans leading-relaxed">
            All system rules, algorithmic capital triggers, and governance policies are subjected to public moral review against the Ten Commandments and the Priority Floor axiom.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onOpenCommandments && (
            <button
              onClick={() => {
                onOpenCommandments();
                audioFeedback.playMicroTick();
              }}
              className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider"
            >
              <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
              Ten Commandments Canon
            </button>
          )}

          {onOpenMoralSimulator && (
            <button
              onClick={() => {
                onOpenMoralSimulator();
                audioFeedback.playMicroTick();
              }}
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold rounded-sm text-xs font-mono uppercase tracking-wider transition-colors shadow"
            >
              Moral Simulator
            </button>
          )}
        </div>
      </div>

      {/* Priority Floor Meta Banner */}
      <div className="p-5 bg-[#0D150F] border border-emerald-500/30 rounded-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              The Priority Floor Axiom (Constitutional Pillar)
            </span>
          </div>
          <span className="text-xs font-mono text-emerald-300/60">Constitutional Weight: 100% Inviolable</span>
        </div>
        <p className="text-xs sm:text-sm font-serif text-emerald-100/90 leading-relaxed">
          "No higher-order economic utility, speculative efficiency, or algorithmic optimization may be enacted at the expense of pushing any human being or bioregional ecosystem below their sub-floor survival threshold."
        </p>
      </div>

      {/* Proposal Selection & Deliberation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Proposals List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold">
              Platform Policy Proposals
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-2 py-1 text-[10px] font-mono rounded-xs ${filterCategory === 'all' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/50 hover:text-white'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterCategory('active_deliberation')}
                className={`px-2 py-1 text-[10px] font-mono rounded-xs ${filterCategory === 'active_deliberation' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/50 hover:text-white'}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterCategory('vetoed_by_covenant')}
                className={`px-2 py-1 text-[10px] font-mono rounded-xs ${filterCategory === 'vetoed_by_covenant' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/50 hover:text-white'}`}
              >
                Vetoed
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredProposals.map((proposal) => {
              const isSelected = proposal.id === selectedProposal.id;
              const badge = getStatusBadge(proposal.reviewStatus);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={proposal.id}
                  onClick={() => {
                    setSelectedProposalId(proposal.id);
                    audioFeedback.playMicroTick();
                  }}
                  className={`p-4 rounded-sm border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-[#141414] border-[#C5A059] shadow-lg ring-1 ring-[#C5A059]/40'
                      : 'bg-[#0A0A0A] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#C5A059] font-bold">{proposal.code}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded-xs border flex items-center gap-1 ${badge.bg}`}>
                      <BadgeIcon className="w-2.5 h-2.5" />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-serif font-bold text-[#F5F5F0] leading-snug">
                    {proposal.title}
                  </h3>

                  <p className="text-xs text-[#F5F5F0]/60 line-clamp-2 font-sans">
                    {proposal.summary}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/40 pt-2 border-t border-[#F5F5F0]/5">
                    <span>Priority Floor: <strong className="text-emerald-400">{proposal.priorityFloorScore}%</strong></span>
                    <span>{proposal.deliberationVotes.length} Deliberation Votes</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Proposal Detail & Ten Commandments Review (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm space-y-6">
            {/* Title & Metadata */}
            <div className="space-y-2 border-b border-[#F5F5F0]/10 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-[#C5A059] font-bold tracking-wider">
                  {selectedProposal.id} • {selectedProposal.category.replace('_', ' ').toUpperCase()}
                </span>
                <span className={`px-2.5 py-1 text-[10px] font-mono uppercase font-bold rounded-xs border ${getStatusBadge(selectedProposal.reviewStatus).bg}`}>
                  {getStatusBadge(selectedProposal.reviewStatus).label}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif text-[#F5F5F0]">{selectedProposal.title}</h2>
              <div className="text-xs font-mono text-[#F5F5F0]/50 flex flex-wrap items-center gap-3">
                <span>Proposed by: <strong className="text-[#8FB8DE]">{selectedProposal.proposer}</strong></span>
                <span>•</span>
                <span>Date: {selectedProposal.submissionDate}</span>
              </div>
            </div>

            {/* Covenant Verdict Banner (if any) */}
            {selectedProposal.covenantVerdict && (
              <div className={`p-4 rounded-sm border font-mono text-xs space-y-1 ${
                selectedProposal.reviewStatus === 'vetoed_by_covenant'
                  ? 'bg-red-950/30 border-red-500/40 text-red-200'
                  : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              }`}>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059]">Official Covenant Verdict</div>
                <div className="font-bold">{selectedProposal.covenantVerdict}</div>
              </div>
            )}

            {/* Rationale */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold block">
                Executive Summary & Ethical Rationale
              </span>
              <p className="text-xs sm:text-sm text-[#F5F5F0]/80 leading-relaxed font-sans">
                {selectedProposal.fullRationale}
              </p>
            </div>

            {/* Ten Commandments Compliance Radar / Scorecards */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold">
                  Ten Commandments Compliance Matrix
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  Priority Floor: {selectedProposal.priorityFloorScore}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedProposal.tenCommandmentsCompliance.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F5F5F0] text-[11px] truncate">
                        Cmd {item.commandmentNumber}: {item.commandmentName}
                      </span>
                      <span className={`text-[11px] font-bold ${
                        item.score >= 80 ? 'text-emerald-400' : item.score >= 50 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {item.score}%
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.score >= 80 ? 'bg-emerald-500' : item.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[#F5F5F0]/60 font-sans leading-tight">
                      {item.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Potential Failure Risks */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block">
                Potential Failure Risks & Boundary Hazards
              </span>
              <ul className="list-disc pl-4 space-y-1 text-xs text-[#F5F5F0]/70 font-mono">
                {selectedProposal.potentialFailureRisks.map((risk, idx) => (
                  <li key={idx}>{risk}</li>
                ))}
              </ul>
            </div>

            {/* Deliberation Stream & Voting */}
            <div className="space-y-4 pt-4 border-t border-[#F5F5F0]/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Steward Deliberations & Ethical Audits ({selectedProposal.deliberationVotes.length})</span>
                </span>
              </div>

              {/* Vote Feed */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {selectedProposal.deliberationVotes.map((vote, idx) => (
                  <div key={idx} className="p-3 bg-[#111] border border-[#F5F5F0]/10 rounded-sm space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8FB8DE] font-bold">{vote.userName}</span>
                      <span className={`px-1.5 py-0.5 text-[9px] uppercase font-bold rounded-xs ${
                        vote.stance === 'approve' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                        vote.stance === 'veto' ? 'bg-red-950 text-red-300 border border-red-500/30' :
                        'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}>
                        {vote.stance}
                      </span>
                    </div>
                    <p className="text-xs text-[#F5F5F0]/80 font-sans italic">
                      "{vote.rationale}"
                    </p>
                    <div className="text-[10px] text-[#F5F5F0]/40 flex justify-between">
                      <span>{vote.priorityFloorImpactAssessment}</span>
                      <span>{vote.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cast Deliberative Vote Form */}
              <form onSubmit={handleCastVote} className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#F5F5F0] uppercase tracking-wider">
                    Submit Deliberation Assessment
                  </span>
                  {voteSuccess && (
                    <span className="text-emerald-400 font-bold text-[10px] animate-fadeIn">
                      ✓ Assessment logged to public ledger
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">Your Name / Role</label>
                    <input
                      type="text"
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                      placeholder="e.g. Citizen Scientist Steward"
                      className="w-full p-2 bg-[#0A0A0A] border border-[#F5F5F0]/20 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">Ethical Stance</label>
                    <div className="flex items-center gap-2">
                      {(['approve', 'amend', 'veto'] as const).map((stance) => (
                        <button
                          key={stance}
                          type="button"
                          onClick={() => setVoteStance(stance)}
                          className={`flex-1 py-1.5 uppercase font-bold text-[10px] rounded-sm transition-all ${
                            voteStance === stance
                              ? stance === 'approve' ? 'bg-emerald-600 text-white' :
                                stance === 'veto' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                              : 'bg-[#222] text-[#F5F5F0]/60 hover:text-white'
                          }`}
                        >
                          {stance}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">Priority Floor & Moral Rationale *</label>
                  <textarea
                    required
                    rows={2}
                    value={voteRationale}
                    onChange={(e) => setVoteRationale(e.target.value)}
                    placeholder="Evaluate how this proposal affects the most vulnerable populations..."
                    className="w-full p-2 bg-[#0A0A0A] border border-[#F5F5F0]/20 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold uppercase tracking-wider rounded-sm shadow"
                  >
                    Cast Ethical Review Vote
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
