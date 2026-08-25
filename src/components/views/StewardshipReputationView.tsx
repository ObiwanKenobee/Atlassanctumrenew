import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  BookOpen, 
  TreeDeciduous, 
  Radio, 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  ThumbsUp, 
  Search, 
  Filter, 
  Lock, 
  Hash, 
  UserCheck, 
  Clock, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  MessageSquareQuote,
  Zap,
  Star,
  Users
} from 'lucide-react';
import { 
  AVAILABLE_STEWARDSHIP_BADGES, 
  CURRENT_STEWARD_PROFILE, 
  TOP_COMMUNITY_STEWARDS, 
  INITIAL_LOCAL_KNOWLEDGE_SUBMISSIONS,
  INITIAL_FAILURE_REVIEWS
} from '../../data/stewardshipReputationData';
import { 
  StewardshipProfile, 
  StewardshipBadge, 
  LocalKnowledgeSubmission, 
  FailureReviewContribution,
  PageView 
} from '../../types';
import { RealityCheck } from '../RealityCheck';
import { audioFeedback } from '../../lib/audioFeedback';
import { useMissionAlerts } from '../../context/MissionAlertContext';

interface StewardshipReputationViewProps {
  onSelectTab: (tab: PageView) => void;
  onInspectProvenance?: (prov: any) => void;
}

export const StewardshipReputationView: React.FC<StewardshipReputationViewProps> = ({
  onSelectTab,
  onInspectProvenance
}) => {
  const { addAlert } = useMissionAlerts();
  const [activeTab, setActiveTab] = useState<'profile' | 'badges' | 'submissions' | 'failure_reviews' | 'leaderboard'>('profile');
  const [submissions, setSubmissions] = useState<LocalKnowledgeSubmission[]>(INITIAL_LOCAL_KNOWLEDGE_SUBMISSIONS);
  const [failureReviews, setFailureReviews] = useState<FailureReviewContribution[]>(INITIAL_FAILURE_REVIEWS);
  const [currentUser, setCurrentUser] = useState<StewardshipProfile>(CURRENT_STEWARD_PROFILE);

  // New Submission Modal State
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [subTitle, setSubTitle] = useState('');
  const [subMission, setSubMission] = useState('mission-mathare-river');
  const [subBioregion, setSubBioregion] = useState('Upper Athi Catchment, Kenya');
  const [subType, setSubType] = useState<'field_observation' | 'indigenous_oral_covenant' | 'microclimate_sensor_data' | 'failure_precursor_warning' | 'species_sighting'>('field_observation');
  const [subSummary, setSubSummary] = useState('');
  const [subFindings, setSubFindings] = useState('');
  const [subCoordinates, setSubCoordinates] = useState('');

  // Failure Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [revFailureId, setRevFailureId] = useState('FL-2025-001');
  const [revProjectName, setRevProjectName] = useState('Sahel Green Barrier: Fast-Growth Acacia Inoculation');
  const [revType, setRevType] = useState<'root_cause_analysis' | 'epistemic_lesson_refinement' | 'corrective_action_audit'>('root_cause_analysis');
  const [revContent, setRevContent] = useState('');

  // Handle local knowledge submission
  const handleCreateKnowledgeSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTitle || !subSummary || !subFindings) return;

    audioFeedback.playSyncComplete();

    const newSub: LocalKnowledgeSubmission = {
      id: `lk-${Date.now().toString().slice(-4)}`,
      missionId: subMission,
      missionTitle: subMission === 'mission-mathare-river' ? 'Mathare River Regeneration' : 'Mara Riparian Buffer',
      bioregion: subBioregion,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorHandle: currentUser.handle,
      title: subTitle,
      knowledgeType: subType,
      summary: subSummary,
      detailedFindings: subFindings,
      coordinatesOrZone: subCoordinates || 'Bioregional Zone 1',
      verificationStatus: 'pending_assembly_review',
      reputationAwarded: 100,
      votesCount: 1,
      submittedAt: 'Just now',
      cryptographicHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      peerReviews: []
    };

    setSubmissions([newSub, ...submissions]);
    setCurrentUser(prev => ({
      ...prev,
      reputationPoints: prev.reputationPoints + 100,
      localKnowledgeSubmissionsCount: prev.localKnowledgeSubmissionsCount + 1
    }));

    addAlert({
      missionId: subMission,
      missionTitle: newSub.missionTitle,
      type: 'stewardship_endorsed',
      severity: 'info',
      title: `Local Knowledge Submitted: ${subTitle}`,
      message: `${currentUser.name} submitted field knowledge. Propagated to Elder Council for cryptographic verification.`,
      targetView: 'stewardship-reputation',
      targetId: newSub.id,
      cryptographicHash: newSub.cryptographicHash
    });

    setIsSubmissionModalOpen(false);
    setSubTitle('');
    setSubSummary('');
    setSubFindings('');
    setSubCoordinates('');
  };

  // Handle Failure Ledger Review
  const handleCreateFailureReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revContent) return;

    audioFeedback.playSyncComplete();

    const newRev: FailureReviewContribution = {
      id: `fr-${Date.now().toString().slice(-4)}`,
      failureEntryId: revFailureId,
      failureProjectName: revProjectName,
      contributorId: currentUser.id,
      contributorName: currentUser.name,
      reviewType: revType,
      content: revContent,
      consensusScore: 95,
      reputationAwarded: 150,
      status: 'in_deliberation',
      timestamp: 'Just now'
    };

    setFailureReviews([newRev, ...failureReviews]);
    setCurrentUser(prev => ({
      ...prev,
      reputationPoints: prev.reputationPoints + 150,
      failureReviewsCount: prev.failureReviewsCount + 1
    }));

    addAlert({
      missionId: 'mission-sahel-water-sponge',
      missionTitle: revProjectName,
      type: 'failure_ledger_entry',
      severity: 'success',
      title: `Constructive Failure Review Submitted (${revFailureId})`,
      message: `Root-cause review added by ${currentUser.name}. Under peer consensus deliberation.`,
      targetView: 'stewardship-reputation',
      targetId: newRev.id
    });

    setIsReviewModalOpen(false);
    setRevContent('');
  };

  const handleUpvoteKnowledge = (subId: string) => {
    audioFeedback.playSubtleClick();
    setSubmissions(prev => prev.map(s => {
      if (s.id === subId) {
        return { ...s, votesCount: s.votesCount + 1 };
      }
      return s;
    }));
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bioregional_custodian':
        return 'text-purple-400 bg-purple-950/60 border-purple-500/40';
      case 'master_auditor':
        return 'text-[#C5A059] bg-[#1B3022] border-[#C5A059]/40';
      case 'field_steward':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
      case 'apprentice_steward':
      default:
        return 'text-blue-400 bg-blue-950/60 border-blue-500/40';
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpenCheck':
        return <BookOpen className="w-5 h-5 text-rose-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'TreeDeciduous':
        return <TreeDeciduous className="w-5 h-5 text-[#C5A059]" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-purple-400" />;
      case 'Radio':
      default:
        return <Radio className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              STEWARDSHIP REPUTATION PROTOCOL • COMMANDMENT XXI & XXIII
            </span>
            <span className="text-[9px] font-mono bg-[#1B3022] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Non-Financialized Epistemic Merit
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
            Stewardship Reputation & Attestation
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 font-sans leading-relaxed">
            Recognizing and cryptographically attesting community stewards who contribute verified local ecological knowledge, anchor oral covenants with elders, or conduct rigorous failure ledger root-cause forensics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setIsSubmissionModalOpen(true);
            }}
            className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/50 text-[#C5A059] rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Local Knowledge</span>
          </button>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setIsReviewModalOpen(true);
            }}
            className="px-4 py-2 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 text-rose-300 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Failure Ledger</span>
          </button>
        </div>
      </div>

      {/* Epistemic Constitution Banner */}
      <RealityCheck
        data={{
          status: 'verified',
          confidenceScore: 99,
          uncertaintyMargin: '± 0.2%',
          epistemicTier: 'Community Peer-Reviewed Attestation & Elder Ratification',
          realityVsModelWarning: 'Commandment XXI: Reputation cannot be purchased, borrowed, or speculative. It is earned strictly through verified biophysical observations and honest failure forensics ratified by on-the-ground communities.',
          sensorHealth: 100,
          dataOrigin: 'On-Chain Cryptographic Attestation Registry',
          cryptographicHash: currentUser.onChainAddress,
          lastVerified: 'Active Session',
          verifiedBy: 'Atlas Bioregional Council & Elder Barazas'
        }}
      />

      {/* Main Tabs */}
      <div className="flex border-b border-[#F5F5F0]/10 gap-2 sm:gap-6 overflow-x-auto text-xs font-mono uppercase tracking-wider">
        {[
          { id: 'profile', label: 'My Steward Profile', icon: UserCheck },
          { id: 'badges', label: `Badges & Credentials (${currentUser.badges.length})`, icon: Award },
          { id: 'submissions', label: `Local Knowledge Submissions (${submissions.length})`, icon: TreeDeciduous },
          { id: 'failure_reviews', label: `Failure Forensic Reviews (${failureReviews.length})`, icon: BookOpen },
          { id: 'leaderboard', label: 'Bioregional Steward Leaderboard', icon: Users }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audioFeedback.playSubtleClick();
                setActiveTab(tab.id as any);
              }}
              className={`pb-3 px-1 border-b-2 font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-[#C5A059] border-[#C5A059]'
                  : 'text-[#F5F5F0]/50 border-transparent hover:text-[#F5F5F0]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MY STEWARD PROFILE */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Overview Card (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-lg bg-[#0D0D0D] border border-[#C5A059]/40 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#F5F5F0]/10">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#1B3022] border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059] font-serif text-2xl font-bold shadow-lg">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-serif font-bold text-white">{currentUser.name}</h2>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getTierColor(currentUser.tier)}`}>
                      Tier {currentUser.tierRankNumber}: Master Auditor
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#C5A059]">{currentUser.handle} • {currentUser.bioregionFocus}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-serif font-bold text-emerald-400">{currentUser.reputationPoints}</div>
                <span className="text-[9px] font-mono text-[#F5F5F0]/40 uppercase">Reputation Points</span>
              </div>
            </div>

            {/* Progress to Next Tier */}
            <div className="space-y-2 p-3.5 rounded bg-black/40 border border-white/5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/60">Next Tier: Bioregional Custodian</span>
                <span className="text-[#C5A059] font-bold">{currentUser.pointsToNextTier} pts remaining</span>
              </div>
              <div className="w-full bg-black/80 h-2.5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-[#C5A059] h-full rounded-full"
                  style={{ width: `${(currentUser.reputationPoints / 5000) * 100}%` }}
                />
              </div>
            </div>

            {/* Stats Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded bg-[#121212] border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/40">Accuracy</span>
                <div className="text-lg font-serif font-bold text-emerald-400">{currentUser.verificationAccuracyPct}%</div>
              </div>
              <div className="p-3 rounded bg-[#121212] border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/40">Field Audits</span>
                <div className="text-lg font-serif font-bold text-[#8FB8DE]">{currentUser.verifiedAuditsSignedCount}</div>
              </div>
              <div className="p-3 rounded bg-[#121212] border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/40">Failure Reviews</span>
                <div className="text-lg font-serif font-bold text-rose-400">{currentUser.failureReviewsCount}</div>
              </div>
              <div className="p-3 rounded bg-[#121212] border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/40">Knowledge Logged</span>
                <div className="text-lg font-serif font-bold text-[#C5A059]">{currentUser.localKnowledgeSubmissionsCount}</div>
              </div>
            </div>

            {/* On-Chain Identity */}
            <div className="p-3 rounded bg-[#121212] border border-[#F5F5F0]/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 min-w-0">
                <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[#F5F5F0]/60">Cryptographic Identity:</span>
                <span className="text-[#F5F5F0] truncate max-w-[200px] sm:max-w-xs">{currentUser.onChainAddress}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">Anchored</span>
            </div>
          </div>

          {/* Featured Badges Grid (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#F5F5F0] flex items-center justify-between">
              <span>Earned Credentials & Badges</span>
              <span className="text-xs font-mono text-[#C5A059]">{currentUser.badges.length} Minted</span>
            </h3>

            <div className="space-y-3">
              {currentUser.badges.map(badge => (
                <div key={badge.id} className="p-3.5 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/15 space-y-2 hover:border-[#C5A059]/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded bg-black border border-white/10">
                        {getBadgeIcon(badge.iconName)}
                      </div>
                      <div>
                        <h4 className="text-xs font-serif font-bold text-white">{badge.title}</h4>
                        <span className="text-[9px] font-mono uppercase text-[#C5A059]">{badge.tier} Tier • {badge.reputationPointsValue} pts</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      {badge.attestationsCount} Peers
                    </span>
                  </div>
                  <p className="text-[11px] text-[#F5F5F0]/70 font-sans leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BADGES CATALOGUE */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {AVAILABLE_STEWARDSHIP_BADGES.map(badge => {
            const hasBadge = currentUser.badges.some(b => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-lg border space-y-4 flex flex-col justify-between ${
                  hasBadge
                    ? 'bg-[#0D0D0D] border-[#C5A059]/40 ring-1 ring-[#C5A059]/20'
                    : 'bg-[#080808] border-[#F5F5F0]/10 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-lg bg-black border border-white/10">
                      {getBadgeIcon(badge.iconName)}
                    </div>
                    {hasBadge ? (
                      <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded uppercase font-bold">
                        Earned & Minted
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded uppercase">
                        Locked
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-serif font-bold text-white">{badge.title}</h3>
                    <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                      {badge.tier} Tier • +{badge.reputationPointsValue} Reputation Points
                    </span>
                  </div>

                  <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                    {badge.description}
                  </p>

                  {/* Criteria */}
                  <div className="p-3 rounded bg-black/40 border border-white/5 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/40 font-bold block">
                      Attestation Criteria:
                    </span>
                    <ul className="text-[11px] font-sans text-[#F5F5F0]/80 space-y-1">
                      {badge.criteria.map((crit, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F5F5F0]/10 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/40">
                  <span>Token ID: {badge.mintedTokenId}</span>
                  <span className="text-[#C5A059] font-bold">{badge.attestationsCount} Attestations</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: LOCAL KNOWLEDGE SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/10">
            <div className="space-y-1">
              <h3 className="text-sm font-serif font-bold text-white">
                Bioregional Field Observations & Traditional Knowledge Log
              </h3>
              <p className="text-xs text-[#F5F5F0]/60 font-sans">
                Submissions ratified by local elder councils anchor the biophysical simulation to lived customary reality.
              </p>
            </div>
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setIsSubmissionModalOpen(true);
              }}
              className="px-3.5 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit New Record</span>
            </button>
          </div>

          <div className="space-y-4">
            {submissions.map(sub => (
              <div key={sub.id} className="p-5 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/15 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F5F5F0]/10">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black border border-white/10 text-[#C5A059] font-bold uppercase">
                      {sub.knowledgeType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono text-[#F5F5F0]/50">
                      {sub.bioregion} • {sub.submittedAt}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B3022] text-emerald-400 border border-emerald-500/30 uppercase font-bold">
                    {sub.verificationStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-serif font-bold text-white">{sub.title}</h3>
                  <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">{sub.summary}</p>
                </div>

                <div className="p-3 rounded bg-black/40 border border-white/5 text-xs font-sans text-[#F5F5F0]/70 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/40 font-bold block">Detailed Findings:</span>
                  <p>{sub.detailedFindings}</p>
                </div>

                {/* Peer Reviews / Elder Witness Endorsements */}
                {sub.peerReviews && sub.peerReviews.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#F5F5F0]/10">
                    <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/40 font-bold block">
                      Elder & Specialist Endorsements:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sub.peerReviews.map((rev, idx) => (
                        <div key={idx} className="p-2.5 rounded bg-[#121212] border border-emerald-500/20 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-emerald-400 font-bold">{rev.reviewerName}</span>
                            <span className="text-[#F5F5F0]/40">{rev.role}</span>
                          </div>
                          <p className="text-[11px] text-[#F5F5F0]/80 font-serif italic">"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#F5F5F0]/10 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[#F5F5F0]/50">Author:</span>
                    <span className="text-white font-medium">{sub.authorName} ({sub.authorHandle})</span>
                  </div>

                  <button
                    onClick={() => handleUpvoteKnowledge(sub.id)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#151515] hover:bg-[#202020] text-[#C5A059] border border-[#C5A059]/30 rounded transition-colors font-bold"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{sub.votesCount} Endorsements (+{sub.reputationAwarded} pts)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FAILURE FORENSIC REVIEWS */}
      {activeTab === 'failure_reviews' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/10">
            <div className="space-y-1">
              <h3 className="text-sm font-serif font-bold text-white">
                Failure Forensic Review & Canon Codification Station
              </h3>
              <p className="text-xs text-[#F5F5F0]/60 font-sans">
                Review past post-mortems from the Failure Ledger to propose corrective policies or biophysical adjustments.
              </p>
            </div>
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setIsReviewModalOpen(true);
              }}
              className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/40 text-rose-300 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Forensic Review</span>
            </button>
          </div>

          <div className="space-y-4">
            {failureReviews.map(rev => (
              <div key={rev.id} className="p-5 rounded-lg bg-[#0D0D0D] border border-rose-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F5F5F0]/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-400">{rev.failureEntryId}</span>
                    <span className="text-xs font-serif font-bold text-white">{rev.failureProjectName}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 uppercase font-bold">
                    {rev.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="p-3 rounded bg-black/50 border border-white/5 space-y-1 text-xs font-sans text-[#F5F5F0]/90">
                  <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">
                    Forensic Argument ({rev.reviewType.replace(/_/g, ' ')}):
                  </span>
                  <p className="leading-relaxed">{rev.content}</p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#F5F5F0]/10">
                  <span className="text-[#F5F5F0]/50">Consensus Score: <strong className="text-emerald-400">{rev.consensusScore}%</strong></span>
                  <span className="text-[#C5A059] font-bold">+{rev.reputationAwarded} Reputation Points</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="p-5 rounded-lg bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
            <div>
              <h3 className="text-base font-serif font-bold text-white">Bioregional Stewardship Leaderboard</h3>
              <p className="text-xs font-mono text-[#F5F5F0]/50">Ranked by verified ground audits and ratified local knowledge</p>
            </div>
            <span className="text-xs font-mono text-[#C5A059] font-bold">Top Verified Stewards</span>
          </div>

          <div className="divide-y divide-[#F5F5F0]/10">
            {TOP_COMMUNITY_STEWARDS.map((steward, idx) => (
              <div key={steward.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#121212] px-3 rounded transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black border border-[#C5A059]/40 flex items-center justify-center font-mono font-bold text-[#C5A059] text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-serif font-bold text-white">{steward.name}</h4>
                      <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded border uppercase ${getTierColor(steward.tier)}`}>
                        {steward.tier.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#F5F5F0]/50">{steward.handle} • {steward.bioregionFocus}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between sm:justify-end text-xs font-mono">
                  <div className="text-left sm:text-right">
                    <div className="text-emerald-400 font-bold">{steward.verificationAccuracyPct}% Accuracy</div>
                    <div className="text-[10px] text-[#F5F5F0]/40">{steward.verifiedAuditsSignedCount} Audits</div>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <div className="text-base font-serif font-bold text-[#C5A059]">{steward.reputationPoints}</div>
                    <div className="text-[9px] text-[#F5F5F0]/40">POINTS</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW LOCAL KNOWLEDGE SUBMISSION MODAL */}
      {isSubmissionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-[#C5A059]/40 rounded-lg max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <TreeDeciduous className="w-5 h-5 text-[#C5A059]" />
                Submit Local Knowledge Record
              </h3>
              <button
                onClick={() => setIsSubmissionModalOpen(false)}
                className="text-[#F5F5F0]/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateKnowledgeSubmission} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#F5F5F0]/70 block mb-1">Knowledge Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traditional Olosho Grazing Rotation Alignment..."
                  value={subTitle}
                  onChange={e => setSubTitle(e.target.value)}
                  className="w-full bg-[#151515] border border-[#F5F5F0]/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#F5F5F0]/70 block mb-1">Knowledge Type</label>
                  <select
                    value={subType}
                    onChange={e => setSubType(e.target.value as any)}
                    className="w-full bg-[#151515] border border-[#F5F5F0]/20 rounded p-2 text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="field_observation">Field Observation</option>
                    <option value="indigenous_oral_covenant">Indigenous Oral Covenant</option>
                    <option value="microclimate_sensor_data">Microclimate Sensor Data</option>
                    <option value="failure_precursor_warning">Failure Precursor Warning</option>
                    <option value="species_sighting">Species Sighting & Biodiversity</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#F5F5F0]/70 block mb-1">Associated Mission</label>
                  <select
                    value={subMission}
                    onChange={e => setSubMission(e.target.value)}
                    className="w-full bg-[#151515] border border-[#F5F5F0]/20 rounded p-2 text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="mission-mathare-river">Mathare River Regeneration</option>
                    <option value="mission-mara-agroforestry">Mara Riparian Buffer</option>
                    <option value="mission-sahel-water-sponge">Sahelian Earth-Sponge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#F5F5F0]/70 block mb-1">Coordinates / Bioregional Sector</label>
                <input
                  type="text"
                  placeholder="e.g. -1.2592, 36.8624 (Mlango Kubwa Sector)"
                  value={subCoordinates}
                  onChange={e => setSubCoordinates(e.target.value)}
                  className="w-full bg-[#151515] border border-[#F5F5F0]/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#F5F5F0]/70 block mb-1">Summary (1-2 Sentences) *</label>
                <input
                  type="text"
                  required
                  placeholder="Concise overview of empirical finding or oral covenant..."
                  value={subSummary}
                  onChange={e => setSubSummary(e.target.value)}
                  className="w-full bg-[#151515] border border-[#F5F5F0]/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#F5F5F0]/70 block mb-1">Detailed Findings & Elder References *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide complete historical or physical context, witnesses, elder testimonials, or in-situ observations..."
                  value={subFindings}
                  onChange={e => setSubFindings(e.target.value)}
                  className="w-full bg-[#151515] border border-[#F5F5F0]/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F5F5F0]/10">
                <button
                  type="button"
                  onClick={() => setIsSubmissionModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-[#F5F5F0]/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] rounded text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Submit & Anchor (+100 pts)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW FAILURE LEDGER REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-rose-500/40 rounded-lg max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-rose-400" />
                Submit Failure Forensic Review
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-[#F5F5F0]/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFailureReview} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#F5F5F0]/70 block mb-1">Target Failure Entry</label>
                <select
                  value={revFailureId}
                  onChange={e => {
                    setRevFailureId(e.target.value);
                    if (e.target.value === 'FL-2025-001') setRevProjectName('Sahel Green Barrier: Fast-Growth Acacia Inoculation');
                    if (e.target.value === 'FL-2025-002') setRevProjectName('Upper Tana River Tokenized Dynamic Water Rights');
                  }}
                  className="w-full bg-[#151515] border border-[#F5F5F0]/20 rounded p-2 text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="FL-2025-001">FL-2025-001: Sahel Fast-Growth Acacia Inoculation</option>
                  <option value="FL-2025-002">FL-2025-002: Upper Tana River Dynamic Water Rights</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-[#F5F5F0]/70 block mb-1">Review Perspective</label>
                <select
                  value={revType}
                  onChange={e => setRevType(e.target.value as any)}
                  className="w-full bg-[#151515] border border-[#F5F5F0]/20 rounded p-2 text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="root_cause_analysis">Root-Cause Analysis (Biophysical or Institutional)</option>
                  <option value="corrective_action_audit">Corrective Action & Priority Floor Safeguard</option>
                  <option value="epistemic_lesson_refinement">Epistemic Lesson Refinement for Canon</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-[#F5F5F0]/70 block mb-1">Forensic Analysis & Proposed Lesson *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Explain why the hypothesis failed and how the Atlas Canon should be updated to prevent recurrence..."
                  value={revContent}
                  onChange={e => setRevContent(e.target.value)}
                  className="w-full bg-[#151515] border border-[#F5F5F0]/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F5F5F0]/10">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-[#F5F5F0]/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-200 rounded text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Submit for Consensus (+150 pts)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
