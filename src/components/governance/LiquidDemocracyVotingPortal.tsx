import React, { useState } from 'react';
import {
  Vote,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Coins,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  UserCheck,
  GitBranch,
  Flame,
  Plus
} from 'lucide-react';
import { GovernanceProposal } from '../../types/platformContent';
import { audioFeedback } from '../../lib/audioFeedback';
import { useAutoSaveForm } from '../../hooks/useAutoSaveForm';

export interface DelegateOption {
  id: string;
  name: string;
  role: string;
  reputationScore: number;
  specialty: string;
  delegatedTokens: number;
  avatarEmoji: string;
  epistemicAuditHash: string;
}

export const COMMUNITY_DELEGATES: DelegateOption[] = [
  {
    id: 'del-01',
    name: 'Mama Zawadi (Elder Council)',
    role: 'Indigenous Agro-Ecological Steward',
    reputationScore: 98,
    specialty: 'Forest Biomes & FPIC Consent',
    delegatedTokens: 342000,
    avatarEmoji: '🌿',
    epistemicAuditHash: '0x39a1...ff89'
  },
  {
    id: 'del-02',
    name: 'Dr. Kiprop (Soil Guild Lead)',
    role: 'Bio-Regional Soil Scientist',
    reputationScore: 96,
    specialty: 'Mycorrhizal Ecology & Carbon Accounting',
    delegatedTokens: 215000,
    avatarEmoji: '🔬',
    epistemicAuditHash: '0x88c2...11aa'
  },
  {
    id: 'del-03',
    name: 'Nairobi River Basin Cooperative',
    role: 'Civic Watershed Union',
    reputationScore: 94,
    specialty: 'Urban Hydrology & Non-Extractive Finance',
    delegatedTokens: 189000,
    avatarEmoji: '💧',
    epistemicAuditHash: '0x55d0...44bb'
  }
];

export interface DebateComment {
  id: string;
  author: string;
  role: string;
  tokensStaked: number;
  content: string;
  epistemicProvenanceRef: string;
  stance: 'SUPPORT' | 'CRITIQUE' | 'AMENDMENT';
  timestamp: string;
  upvotes: number;
}

export const INITIAL_DEBATE_COMMENTS: Record<string, DebateComment[]> = {
  'AGP-043': [
    {
      id: 'c1',
      author: 'Amina Omondi (Field Agroforester)',
      role: 'Civic Steward',
      tokensStaked: 1500,
      content: 'The 15% patient capital allocation to nursery pods has strong empirical grounding in the 2025 Aberdare field trial data. We must ensure indigenous varieties are prioritized over fast-growing exotics.',
      epistemicProvenanceRef: 'Aberdare In-Situ Census #2026-03',
      stance: 'SUPPORT',
      timestamp: '2 hours ago',
      upvotes: 24
    },
    {
      id: 'c2',
      author: 'Kariuki M. (Hydrology Guild)',
      role: 'Sensor Mesh Engineer',
      tokensStaked: 2200,
      content: 'Propose an amendment to Milestone 2: Stream turbidity thresholds should be tightened to <25 NTU based on recent storm discharge models in Mathare.',
      epistemicProvenanceRef: 'Piezometer Telemetry Array 4B',
      stance: 'AMENDMENT',
      timestamp: '5 hours ago',
      upvotes: 18
    }
  ]
};

export const LiquidDemocracyVotingPortal: React.FC<{
  proposals: GovernanceProposal[];
  onInspectProvenance: (prov: any) => void;
}> = ({ proposals, onInspectProvenance }) => {
  const [selectedProposalId, setSelectedProposalId] = useState<string>(proposals[0]?.id || 'AGP-043');
  const [userTokenBalance, setUserTokenBalance] = useState<number>(5000);
  const [activeDelegations, setActiveDelegations] = useState<Record<string, string>>({}); // proposalId -> delegateId or 'DIRECT'
  const [tokensAllocated, setTokensAllocated] = useState<Record<string, { choice: 'FOR' | 'AGAINST' | 'ABSTAIN'; amount: number }>>({});
  const [voteAmountInput, setVoteAmountInput] = useState<number>(500);
  const [showProposeModal, setShowProposeModal] = useState<boolean>(false);
  const [debateComments, setDebateComments] = useState<Record<string, DebateComment[]>>(INITIAL_DEBATE_COMMENTS);

  const selectedProposal = proposals.find(p => p.id === selectedProposalId) || proposals[0];

  // Auto-Save for Proposal Creation Form
  const {
    formData: newProposalDraft,
    updateField: updateProposalField,
    lastSavedTime: proposalLastSaved,
    clearDraft: clearProposalDraft
  } = useAutoSaveForm<{
    title: string;
    category: GovernanceProposal['category'];
    bioregion: string;
    summary: string;
    impactAssessment: string;
    capitalRequestedUsd: number;
    epistemicMethod: string;
  }>({
    key: 'liquid_democracy_new_proposal',
    initialValue: {
      title: '',
      category: 'Capital Allocation',
      bioregion: 'East African Rift Valley',
      summary: '',
      impactAssessment: '',
      capitalRequestedUsd: 250000,
      epistemicMethod: 'Empirical sensor network & FPIC community assembly'
    }
  });

  // Auto-Save for Debate Input Form
  const {
    formData: debateDraft,
    updateField: updateDebateField,
    clearDraft: clearDebateDraft
  } = useAutoSaveForm<{
    commentText: string;
    stance: 'SUPPORT' | 'CRITIQUE' | 'AMENDMENT';
    provenanceRef: string;
    stakedTokens: number;
  }>({
    key: `liquid_democracy_debate_${selectedProposalId}`,
    initialValue: {
      commentText: '',
      stance: 'SUPPORT',
      provenanceRef: '',
      stakedTokens: 100
    }
  });

  // Cast Direct Liquid Vote
  const handleCastDirectVote = (choice: 'FOR' | 'AGAINST' | 'ABSTAIN') => {
    if (voteAmountInput > userTokenBalance) return;

    setTokensAllocated(prev => ({
      ...prev,
      [selectedProposalId]: {
        choice,
        amount: (prev[selectedProposalId]?.amount || 0) + voteAmountInput
      }
    }));

    setUserTokenBalance(prev => prev - voteAmountInput);
    setActiveDelegations(prev => ({ ...prev, [selectedProposalId]: 'DIRECT' }));
    audioFeedback.playSuccess();
  };

  // Delegate Vote to Expert Elder/Guild
  const handleDelegateVote = (delegateId: string) => {
    const delegate = COMMUNITY_DELEGATES.find(d => d.id === delegateId);
    setActiveDelegations(prev => ({ ...prev, [selectedProposalId]: delegateId }));
    audioFeedback.playCovenantResonance();
  };

  // Submit Debate Comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debateDraft.commentText.trim()) return;

    const newComment: DebateComment = {
      id: `c_${Date.now()}`,
      author: 'You (Verified Citizen-Steward)',
      role: 'Civic Member',
      tokensStaked: debateDraft.stakedTokens,
      content: debateDraft.commentText,
      epistemicProvenanceRef: debateDraft.provenanceRef || 'In-Situ Citizen Attestation #2026',
      stance: debateDraft.stance,
      timestamp: 'Just now',
      upvotes: 1
    };

    setDebateComments(prev => ({
      ...prev,
      [selectedProposalId]: [newComment, ...(prev[selectedProposalId] || [])]
    }));

    clearDebateDraft();
    audioFeedback.playSuccess();
  };

  const activeComments = debateComments[selectedProposalId] || [];
  const currentVote = tokensAllocated[selectedProposalId];
  const currentDelegateId = activeDelegations[selectedProposalId];
  const activeDelegate = COMMUNITY_DELEGATES.find(d => d.id === currentDelegateId);

  return (
    <div className="bg-[#0A0A0A] border border-[#C5A059]/40 rounded-sm p-6 space-y-8 text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
              <Vote className="w-3.5 h-3.5 text-[#C5A059]" />
              CIVILIZATION OPERATING SYSTEM • LIQUID DEMOCRACY VOTING PORTAL
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0]">
            Epistemic Liquid Democracy
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-3xl font-sans">
            Cast governance tokens directly on Civilization OS architecture updates or delegate voting power dynamically to domain-expert guilds and indigenous elders.
          </p>
        </div>

        {/* User Balance & Proposal Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3.5 py-2 bg-[#121212] border border-[#C5A059]/40 rounded-xs font-mono text-xs flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#C5A059]" />
            <div>
              <span className="text-[10px] text-[#F5F5F0]/50 block">Your Voting Tokens</span>
              <span className="text-emerald-400 font-bold">{userTokenBalance.toLocaleString()} ATLAS-VOTE</span>
            </div>
          </div>

          <button
            onClick={() => {
              setShowProposeModal(true);
              audioFeedback.playSubtleClick();
            }}
            className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black rounded-xs font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Propose COS Update</span>
          </button>
        </div>
      </div>

      {/* Grid: Proposals Selector & Active Voting Room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Proposals List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-mono uppercase text-[#C5A059] font-bold block tracking-wider">
            Active Civilization Proposals ({proposals.length})
          </span>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {proposals.map((p) => {
              const isSelected = p.id === selectedProposalId;
              const hasVoted = !!tokensAllocated[p.id];
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProposalId(p.id);
                    audioFeedback.playMicroTick();
                  }}
                  className={`p-4 rounded-sm border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#181818] border-[#C5A059] shadow-md'
                      : 'bg-[#101010] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30 hover:bg-[#141414]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#C5A059] font-bold">{p.id}</span>
                    <span className="px-2 py-0.5 rounded-xs bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                      {p.currentSupportPercentage}% Support
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-serif font-bold text-[#F5F5F0] line-clamp-2">
                    {p.title}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50 pt-1 border-t border-[#F5F5F0]/10">
                    <span>{p.category}</span>
                    {hasVoted && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Voted
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Deliberation & Voting Chamber (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Proposal Hero Card */}
          <div className="bg-[#121212] border border-[#C5A059]/40 rounded-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#C5A059] px-2 py-0.5 bg-[#C5A059]/10 rounded-xs border border-[#C5A059]/30">
                  {selectedProposal.id}
                </span>
                <span className="text-xs font-mono text-[#F5F5F0]/70">
                  Category: <strong className="text-white">{selectedProposal.category}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onInspectProvenance(selectedProposal.provenance);
                    audioFeedback.playCovenantResonance();
                  }}
                  className="px-3 py-1 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-emerald-300 rounded-xs text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Epistemic Merkle Hash</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
                {selectedProposal.title}
              </h2>
              <p className="text-xs text-[#F5F5F0]/80 font-serif leading-relaxed">
                {selectedProposal.summary}
              </p>
            </div>

            {/* Impact Summary and Epistemic Provenance Marker */}
            <div className="p-4 bg-[#181818] rounded-sm border border-[#F5F5F0]/10 space-y-3 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div>
                  <span className="text-[#F5F5F0]/50 block">Proposer & Role:</span>
                  <span className="text-[#8FB8DE] font-bold">{selectedProposal.proposer} ({selectedProposal.proposerRole})</span>
                </div>
                <div>
                  <span className="text-[#F5F5F0]/50 block">Bioregion Scope:</span>
                  <span className="text-[#C5A059] font-bold">{selectedProposal.bioregion}</span>
                </div>
                <div>
                  <span className="text-[#F5F5F0]/50 block">FPIC Consent:</span>
                  <span className="text-emerald-400 font-bold">{selectedProposal.fpicConsentVerified ? '✓ Fully Verified' : 'Pending'}</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#0D0D0D] rounded-xs border border-[#C5A059]/20 text-[11px] space-y-1">
                <span className="text-[10px] text-[#C5A059] font-bold uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                  Epistemic Provenance Anchor:
                </span>
                <p className="text-[#F5F5F0]/70 font-serif text-[11px]">
                  {selectedProposal.impactAssessmentSummary}
                </p>
                <span className="text-[9px] text-[#F5F5F0]/40 font-mono block">
                  Root Proof Hash: {selectedProposal.provenance.cryptographicHash} • Auditor: {selectedProposal.provenance.verifier}
                </span>
              </div>
            </div>

            {/* Liquid Governance Engine: Direct Casting vs Dynamic Delegation */}
            <div className="p-5 bg-[#141414] border border-[#C5A059]/30 rounded-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#C5A059] font-bold tracking-wider flex items-center gap-1.5">
                  <Vote className="w-4 h-4 text-[#C5A059]" />
                  Liquid Voting Chamber
                </span>
                <span className="text-xs font-mono text-[#F5F5F0]/60">
                  Current Support: <strong className="text-emerald-400">{selectedProposal.currentSupportPercentage}%</strong> ({selectedProposal.totalVotesCast.toLocaleString()} votes cast)
                </span>
              </div>

              {/* Liquid Delegation Mode Selector */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#F5F5F0]/70 block">
                  Option A: Delegate Vote Dynamically to Domain Guild or Elder
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {COMMUNITY_DELEGATES.map((del) => {
                    const isSelectedDelegate = currentDelegateId === del.id;
                    return (
                      <div
                        key={del.id}
                        onClick={() => handleDelegateVote(del.id)}
                        className={`p-3 rounded-xs border transition-all cursor-pointer space-y-1 ${
                          isSelectedDelegate
                            ? 'bg-[#1B3022] border-emerald-400 shadow-sm'
                            : 'bg-[#181818] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#F5F5F0] flex items-center gap-1">
                            <span>{del.avatarEmoji}</span>
                            <span className="truncate max-w-[110px]">{del.name}</span>
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">{del.reputationScore}%</span>
                        </div>
                        <p className="text-[10px] font-mono text-[#F5F5F0]/60 truncate">
                          {del.specialty}
                        </p>
                        {isSelectedDelegate && (
                          <span className="text-[9px] font-mono text-emerald-300 font-bold block pt-1">
                            ✓ Currently Delegated
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Option B: Direct Token-Staked Vote */}
              <div className="space-y-3 pt-4 border-t border-[#F5F5F0]/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#F5F5F0]/70">
                    Option B: Cast Tokens Directly
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-[#F5F5F0]/50">Amount:</span>
                    <input
                      type="number"
                      min={10}
                      max={userTokenBalance}
                      value={voteAmountInput}
                      onChange={(e) => setVoteAmountInput(Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-[#1E1E1E] border border-[#F5F5F0]/20 rounded-xs text-white text-right font-mono"
                    />
                    <span className="text-[#C5A059]">Tokens</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleCastDirectVote('FOR')}
                    className="py-2.5 bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/50 text-emerald-200 rounded-xs font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>✓ Support (FOR)</span>
                  </button>

                  <button
                    onClick={() => handleCastDirectVote('AGAINST')}
                    className="py-2.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/50 text-rose-200 rounded-xs font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>✕ Oppose (AGAINST)</span>
                  </button>

                  <button
                    onClick={() => handleCastDirectVote('ABSTAIN')}
                    className="py-2.5 bg-[#222] hover:bg-[#333] border border-[#F5F5F0]/20 text-[#F5F5F0]/70 rounded-xs font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>— Abstain</span>
                  </button>
                </div>

                {currentVote && (
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xs text-xs font-mono text-emerald-300 flex items-center justify-between">
                    <span>Your direct allocation on this proposal:</span>
                    <span className="font-bold">{currentVote.amount} Tokens [{currentVote.choice}]</span>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Epistemic Debate Section */}
            <div className="space-y-4 pt-4 border-t border-[#F5F5F0]/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#C5A059] font-bold tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Epistemic Deliberation & Debate ({activeComments.length})
                </span>
                <span className="text-[11px] font-mono text-[#F5F5F0]/50">
                  Staked claims with empirical provenance references
                </span>
              </div>

              {/* Add Debate Claim / Amendment Form */}
              <form onSubmit={handleSubmitComment} className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-3 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-[#F5F5F0]/50 mb-1">Deliberation Stance:</label>
                    <select
                      value={debateDraft.stance}
                      onChange={(e) => updateDebateField('stance', e.target.value as any)}
                      className="w-full bg-[#1E1E1E] border border-[#F5F5F0]/20 rounded-xs p-1.5 text-white text-xs outline-none"
                    >
                      <option value="SUPPORT">✓ Empirical Support</option>
                      <option value="CRITIQUE">⚠️ Epistemic Critique</option>
                      <option value="AMENDMENT">📝 Proposed Amendment</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase text-[#F5F5F0]/50 mb-1">Epistemic Provenance Reference:</label>
                    <input
                      type="text"
                      value={debateDraft.provenanceRef}
                      onChange={(e) => updateDebateField('provenanceRef', e.target.value)}
                      placeholder="e.g. Sentinel-2 NDVI telemetry / Field Trial #04"
                      className="w-full bg-[#1E1E1E] border border-[#F5F5F0]/20 rounded-xs p-1.5 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-[#F5F5F0]/50 mb-1">Reasoned Argument / Amendment Details:</label>
                  <textarea
                    rows={2}
                    required
                    value={debateDraft.commentText}
                    onChange={(e) => updateDebateField('commentText', e.target.value)}
                    placeholder="Provide reasoned analysis referencing field measurements, model boundaries, or community consent..."
                    className="w-full bg-[#1E1E1E] border border-[#F5F5F0]/20 rounded-xs p-2 text-white text-xs font-serif outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold uppercase rounded-xs flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Stake Debate Claim</span>
                  </button>
                </div>
              </form>

              {/* Debate Stream */}
              <div className="space-y-2.5">
                {activeComments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F5F5F0]">{comment.author}</span>
                        <span className="text-[10px] text-[#C5A059] bg-[#C5A059]/10 px-1.5 py-0.5 rounded-xs">
                          {comment.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#F5F5F0]/50">{comment.timestamp}</span>
                    </div>

                    <p className="text-xs text-[#F5F5F0]/90 font-serif leading-relaxed">
                      "{comment.content}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50 pt-1 border-t border-[#F5F5F0]/10">
                      <span className="text-[#8FB8DE]">Provenance: {comment.epistemicProvenanceRef}</span>
                      <span className="text-emerald-400 font-bold">{comment.tokensStaked} Tokens Staked</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: PROPOSE CIVILIZATION OPERATING SYSTEM UPDATE (With Auto-Save Cache) */}
      {/* ========================================================================= */}
      {showProposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#121212] border border-[#C5A059] rounded-sm max-w-xl w-full p-6 space-y-4 font-mono text-xs text-[#F5F5F0] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase text-[#C5A059] font-bold">
                  Propose Civilization OS Update (Auto-Saved)
                </span>
                {proposalLastSaved && (
                  <span className="text-[9px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded-xs">
                    Draft Restored {proposalLastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowProposeModal(false)}
                className="text-[#F5F5F0]/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowProposeModal(false);
                clearProposalDraft();
                audioFeedback.playSuccess();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Proposal Title:</label>
                <input
                  type="text"
                  required
                  value={newProposalDraft.title}
                  onChange={(e) => updateProposalField('title', e.target.value)}
                  placeholder="e.g. AGP-044: Bioregional Seed Vault Protocol Upgrade"
                  className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Category:</label>
                  <select
                    value={newProposalDraft.category}
                    onChange={(e) => updateProposalField('category', e.target.value as any)}
                    className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none"
                  >
                    <option value="Capital Allocation">Capital Allocation</option>
                    <option value="Schema Upgrade">Schema Upgrade</option>
                    <option value="Ecosystem Covenant">Ecosystem Covenant</option>
                    <option value="Floor Calibration">Floor Calibration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Bioregion Target:</label>
                  <input
                    type="text"
                    value={newProposalDraft.bioregion}
                    onChange={(e) => updateProposalField('bioregion', e.target.value)}
                    placeholder="e.g. East African Rift"
                    className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Proposal Executive Summary:</label>
                <textarea
                  rows={2}
                  required
                  value={newProposalDraft.summary}
                  onChange={(e) => updateProposalField('summary', e.target.value)}
                  placeholder="Summarize the systemic intent, stakeholder benefits, and operational mechanics..."
                  className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none font-serif text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#F5F5F0]/70 mb-1">Epistemic Method & Sensor Validation Mesh:</label>
                <input
                  type="text"
                  value={newProposalDraft.epistemicMethod}
                  onChange={(e) => updateProposalField('epistemicMethod', e.target.value)}
                  placeholder="e.g. LoRaWAN sensor stream #4, FPIC community signoff ledger"
                  className="w-full bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-xs p-2 text-[#F5F5F0] outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F5F5F0]/10">
                <button
                  type="button"
                  onClick={clearProposalDraft}
                  className="text-[10px] text-[#F5F5F0]/40 hover:text-rose-400 cursor-pointer"
                >
                  Clear Draft Cache
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProposeModal(false)}
                    className="px-3 py-1.5 bg-[#222] text-[#F5F5F0]/70 rounded-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold uppercase rounded-xs cursor-pointer shadow"
                  >
                    Submit Proposal to Liquid Assembly
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
