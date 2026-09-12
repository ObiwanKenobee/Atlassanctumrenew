import React, { useState, useMemo } from 'react';
import { 
  User, 
  Award, 
  ShieldCheck, 
  Activity, 
  TreePine, 
  Droplets, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  FileCheck2, 
  TrendingUp, 
  Medal, 
  Compass, 
  BookOpen, 
  Flame, 
  HeartHandshake, 
  Share2, 
  Plus, 
  Sliders, 
  Check, 
  Globe2,
  Lock,
  ArrowRight,
  Filter,
  Trophy,
  Calendar,
  Users
} from 'lucide-react';
import { AnnualImpactSummaryCard } from './AnnualImpactSummaryCard';
import { ImpactStoryGenerator } from '../profile/ImpactStoryGenerator';
import { CollaborativeStewardshipTeams } from '../profile/CollaborativeStewardshipTeams';
import { PageView } from '../../types';
import { 
  CURRENT_STEWARD_PROFILE, 
  AVAILABLE_STEWARDSHIP_BADGES, 
  INITIAL_LOCAL_KNOWLEDGE_SUBMISSIONS, 
  INITIAL_FAILURE_REVIEWS 
} from '../../data/stewardshipReputationData';
import { audioFeedback } from '../../lib/audioFeedback';
import { db } from '../../lib/db';

interface CitizenProfileViewProps {
  onSelectTab: (tab: PageView) => void;
  onOpenMoralSimulator?: () => void;
  onOpenCommandCenter?: () => void;
}

interface RegenerativeActionQuest {
  id: string;
  title: string;
  badgeName: string;
  badgeTier: 'silver' | 'gold' | 'platinum';
  category: 'hydrology' | 'canopy' | 'governance' | 'forensics';
  reputationPoints: number;
  description: string;
  impactMetric: string;
  actionRequirement: string;
  isCompleted: boolean;
  claimedAt?: string;
  proofHash?: string;
}

const INITIAL_QUESTS: RegenerativeActionQuest[] = [
  {
    id: 'quest-aquifer-sponge',
    title: 'Riparian Swale Infiltration Calibration',
    badgeName: 'Aquifer Sponge Sentinel',
    badgeTier: 'gold',
    category: 'hydrology',
    reputationPoints: 650,
    description: 'Execute double-ring infiltrometer tests across 3 retention swales to calibrate machine hydrological runoff coefficients.',
    impactMetric: '+1.2M Liters Recharge Verified',
    actionRequirement: 'Submit 3 geotagged infiltration rate logs with photo assays',
    isCompleted: false
  },
  {
    id: 'quest-canopy-phenology',
    title: 'Canopy Phenology Drone Transect',
    badgeName: 'Canopy Phenology Watcher',
    badgeTier: 'platinum',
    category: 'canopy',
    reputationPoints: 800,
    description: 'Anchor spaceborne Sentinel-2 NDVI vegetative readings against high-resolution drone multispectral orthomosaics.',
    impactMetric: '240 Hectares Ground-Truth Verified',
    actionRequirement: 'Sign cryptographic flight log & upload reflectance calibration sheet',
    isCompleted: false
  },
  {
    id: 'quest-community-fpic',
    title: 'Elder Baraza Customary Covenant Ratification',
    badgeName: 'Sovereign FPIC Facilitator',
    badgeTier: 'platinum',
    category: 'governance',
    reputationPoints: 950,
    description: 'Facilitate free, prior, and informed consent (FPIC) assembly with customary pastoralist council and record oral boundaries.',
    impactMetric: '14 Customary Rights Holders Protected',
    actionRequirement: 'Upload elder consensus resolution signed by 3 Manyatta chairpersons',
    isCompleted: false
  },
  {
    id: 'quest-failure-audit',
    title: 'Non-Punitive Failure Ledger Root-Cause Post-Mortem',
    badgeName: 'Axiomatic Forensic Custodian',
    badgeTier: 'gold',
    category: 'forensics',
    reputationPoints: 700,
    description: 'Document an ecological restoration deviation without assigning personal blame, distilling institutional learnings for Atlas Canon.',
    impactMetric: 'Codified into Commandment XXIII',
    actionRequirement: 'Publish ratified root-cause timeline with 3 corrective actions',
    isCompleted: true,
    claimedAt: '3 days ago',
    proofHash: '0x8f192b0c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a'
  }
];

export const CitizenProfileView: React.FC<CitizenProfileViewProps> = ({
  onSelectTab,
  onOpenMoralSimulator,
  onOpenCommandCenter
}) => {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('atlas_citizen_profile_state');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      reputationPoints: CURRENT_STEWARD_PROFILE.reputationPoints,
      verifiedAuditsSigned: CURRENT_STEWARD_PROFILE.verifiedAuditsSignedCount,
      earnedBadgeCount: CURRENT_STEWARD_PROFILE.badges.length,
      hectaresRestored: 4280,
      litersProtectedMillions: 1840,
      carbonSequesteredTons: 12450
    };
  });

  const [quests, setQuests] = useState<RegenerativeActionQuest[]>(() => {
    try {
      const savedQuests = localStorage.getItem('atlas_citizen_quests_state');
      if (savedQuests) return JSON.parse(savedQuests);
    } catch {}
    return INITIAL_QUESTS;
  });

  const [activeTab, setActiveTab] = useState<'badges' | 'actions' | 'contributions' | 'impact' | 'story' | 'teams'>('badges');
  const [contributionFilter, setContributionFilter] = useState<'all' | 'audits' | 'knowledge' | 'forensics'>('all');
  const [claimingQuestId, setClaimingQuestId] = useState<string | null>(null);
  const [justEarnedBadge, setJustEarnedBadge] = useState<string | null>(null);

  // Execute & Claim Badge Action
  const handleExecuteAction = async (quest: RegenerativeActionQuest) => {
    if (quest.isCompleted) return;
    setClaimingQuestId(quest.id);
    audioFeedback.playSubtleClick();

    try {
      // Simulate cryptographic verification delay
      await new Promise(r => setTimeout(r, 900));

      const updatedQuests = quests.map(q => {
        if (q.id === quest.id) {
          return {
            ...q,
            isCompleted: true,
            claimedAt: 'Just now',
            proofHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`
          };
        }
        return q;
      });

      const newRep = profile.reputationPoints + quest.reputationPoints;
      const updatedProfile = {
        ...profile,
        reputationPoints: newRep,
        verifiedAuditsSigned: profile.verifiedAuditsSigned + 1,
        earnedBadgeCount: profile.earnedBadgeCount + 1,
        hectaresRestored: quest.category === 'canopy' ? profile.hectaresRestored + 240 : profile.hectaresRestored,
        litersProtectedMillions: quest.category === 'hydrology' ? profile.litersProtectedMillions + 1.2 : profile.litersProtectedMillions
      };

      setQuests(updatedQuests);
      setProfile(updatedProfile);
      setJustEarnedBadge(`${quest.badgeName} (+${quest.reputationPoints} Rep)`);

      try {
        localStorage.setItem('atlas_citizen_quests_state', JSON.stringify(updatedQuests));
        localStorage.setItem('atlas_citizen_profile_state', JSON.stringify(updatedProfile));
        
        await db.audit.logInteraction({
          action: `Earned Regenerative Badge: "${quest.badgeName}"`,
          feature: 'telemetry_calibration',
          impactTier: 'high',
          moralAlignmentScore: 98,
          parameters: {
            questId: quest.id,
            badgeName: quest.badgeName,
            reputationAwarded: quest.reputationPoints
          },
          ethicalNotes: `User completed regenerative action: ${quest.title}. Awarded badge ${quest.badgeName}. New reputation: ${newRep} pts.`
        });
      } catch (e) {
        console.warn('Persistence sync notice:', e);
      }

      audioFeedback.playSuccessChime();
    } catch (err) {
      console.error('Action execution error:', err);
    } finally {
      setClaimingQuestId(null);
    }
  };

  const nextTierPoints = 5000;
  const progressPercent = Math.min(100, Math.round((profile.reputationPoints / nextTierPoints) * 100));

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Citizen Passport Card */}
      <div className="relative p-6 sm:p-8 rounded-sm bg-gradient-to-r from-[#0E1712] via-[#0D1210] to-[#0A0A0A] border border-[#C5A059]/40 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Award className="w-64 h-64 text-[#C5A059]" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Identity Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1B3022] border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow-lg shrink-0">
              <User className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
                  VERIFIED CITIZEN STEWARD • DID ACTIVE
                </span>
                <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                  Joined {CURRENT_STEWARD_PROFILE.joinedDate}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold">
                {CURRENT_STEWARD_PROFILE.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#F5F5F0]/70">
                <span className="text-[#C5A059] font-bold">{CURRENT_STEWARD_PROFILE.handle}</span>
                <span>•</span>
                <span>{CURRENT_STEWARD_PROFILE.roleTitle}</span>
                <span>•</span>
                <span className="text-emerald-400">{CURRENT_STEWARD_PROFILE.bioregionFocus}</span>
              </div>

              {/* Cryptographic Address */}
              <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-[#F5F5F0]/40">
                <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>On-Chain DID:</span>
                <span className="text-cyan-300 select-all truncate max-w-[220px] sm:max-w-none">
                  {CURRENT_STEWARD_PROFILE.onChainAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Stewardship Score & Tier Progress Box */}
          <div className="w-full lg:w-80 p-4 rounded bg-black/60 border border-[#C5A059]/30 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] uppercase font-mono text-[#F5F5F0]/50">Stewardship Reputation</div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#C5A059]">
                  {profile.reputationPoints.toLocaleString()} <span className="text-xs font-mono text-[#F5F5F0]/50 font-normal">pts</span>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2 py-1 bg-[#1B3022] text-emerald-400 text-[10px] font-mono uppercase font-bold rounded border border-emerald-500/40">
                  Master Auditor
                </span>
                <div className="text-[10px] font-mono text-[#F5F5F0]/50 mt-1">98.6% Accuracy</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/60">
                <span>Progress to Bioregional Custodian</span>
                <span className="text-emerald-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#C5A059] to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[9px] text-[#F5F5F0]/40 font-mono text-right">
                {Math.max(0, nextTierPoints - profile.reputationPoints)} pts remaining to Tier 4
              </div>
            </div>

            {/* Achievement Milestones Trigger */}
            <button
              id="citizen-profile-open-achievements-btn"
              onClick={() => {
                audioFeedback.playMicroTick();
                window.dispatchEvent(new CustomEvent('open-achievements-drawer'));
              }}
              className="w-full py-1.5 px-2.5 bg-[#1B3022] hover:bg-[#254530] text-amber-300 border border-amber-500/40 rounded text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer font-bold"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>View Milestone Achievements</span>
            </button>
          </div>
        </div>
      </div>

      {/* Just Earned Notification Banner */}
      {justEarnedBadge && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/60 rounded-sm flex items-center justify-between animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-emerald-300 uppercase tracking-wider">
                Badge Earned & Cryptographically Minted!
              </div>
              <div className="text-sm font-serif text-white">
                You have earned: <span className="font-bold text-emerald-400">{justEarnedBadge}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setJustEarnedBadge(null)}
            className="px-3 py-1 bg-black/40 hover:bg-black/60 rounded text-xs font-mono text-[#F5F5F0]/60 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Historical Impact Metrics Grid (4 Stat Blocks) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <TreePine className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Land Regenerated</div>
            <div className="text-xl font-mono font-bold text-white mt-0.5">
              {profile.hectaresRestored.toLocaleString()} <span className="text-xs font-normal text-[#F5F5F0]/50">ha</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">100% Multispectral Verified</div>
          </div>
        </div>

        <div className="p-4 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Aquifer Recharge</div>
            <div className="text-xl font-mono font-bold text-white mt-0.5">
              {(profile.litersProtectedMillions / 1000).toFixed(2)}B <span className="text-xs font-normal text-[#F5F5F0]/50">Liters</span>
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">Piezometer Corroborated</div>
          </div>
        </div>

        <div className="p-4 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded bg-purple-950/60 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Verified Field Audits</div>
            <div className="text-xl font-mono font-bold text-white mt-0.5">
              {profile.verifiedAuditsSigned} <span className="text-xs font-normal text-[#F5F5F0]/50">Signed</span>
            </div>
            <div className="text-[10px] text-purple-400 font-mono">Zero Audit Discrepancies</div>
          </div>
        </div>

        <div className="p-4 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded bg-[#1B3022] border border-[#C5A059]/40 text-[#C5A059] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Earned Badges</div>
            <div className="text-xl font-mono font-bold text-white mt-0.5">
              {profile.earnedBadgeCount} <span className="text-xs font-normal text-[#F5F5F0]/50">Badges</span>
            </div>
            <div className="text-[10px] text-[#C5A059] font-mono">On-Chain Cryptographic Proofs</div>
          </div>
        </div>
      </div>

      {/* Annual Impact Summary Card: Tangible Cumulative Bioregional Regeneration */}
      <AnnualImpactSummaryCard />

      {/* Profile Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#F5F5F0]/15 pb-2 text-xs font-mono flex-wrap">
        <button
          id="profile-tab-badges"
          onClick={() => {
            audioFeedback.playSubtleClick();
            setActiveTab('badges');
          }}
          className={`px-4 py-2 rounded-sm uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'badges'
              ? 'bg-[#1B3022] text-[#F5F5F0] border border-[#C5A059]'
              : 'text-[#F5F5F0]/50 hover:text-white hover:bg-[#141414]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#C5A059]" />
            Earned Badges ({profile.earnedBadgeCount})
          </span>
        </button>

        <button
          id="profile-tab-actions"
          onClick={() => {
            audioFeedback.playSubtleClick();
            setActiveTab('actions');
          }}
          className={`px-4 py-2 rounded-sm uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'actions'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 shadow-sm'
              : 'text-[#F5F5F0]/50 hover:text-emerald-300 hover:bg-[#141414]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Regenerative Action Quests ({quests.filter(q => !q.isCompleted).length} Active)
          </span>
        </button>

        <button
          id="profile-tab-contributions"
          onClick={() => {
            audioFeedback.playSubtleClick();
            setActiveTab('contributions');
          }}
          className={`px-4 py-2 rounded-sm uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'contributions'
              ? 'bg-[#1B3022] text-[#F5F5F0] border border-[#C5A059]'
              : 'text-[#F5F5F0]/50 hover:text-white hover:bg-[#141414]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#8FB8DE]" />
            Verified Contribution Log
          </span>
        </button>

        <button
          id="profile-tab-story"
          onClick={() => {
            audioFeedback.playSubtleClick();
            setActiveTab('story');
          }}
          className={`px-4 py-2 rounded-sm uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'story'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 shadow-sm'
              : 'text-[#F5F5F0]/50 hover:text-emerald-300 hover:bg-[#141414]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Impact Story Generator
          </span>
        </button>

        <button
          id="profile-tab-teams"
          onClick={() => {
            audioFeedback.playSubtleClick();
            setActiveTab('teams');
          }}
          className={`px-4 py-2 rounded-sm uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'teams'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500 shadow-sm'
              : 'text-[#F5F5F0]/50 hover:text-cyan-300 hover:bg-[#141414]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-cyan-400" />
            Stewardship Teams
          </span>
        </button>
      </div>

      {/* Tab 1: Earned Badges Catalog */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-lg font-serif text-white font-bold">Cryptographically Verified Badges</h3>
              <p className="text-xs text-[#F5F5F0]/60 font-sans">
                Each badge represents peer-reviewed physical evidence or governance contributions anchored in the Atlas immutable ledger.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('actions')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-mono text-xs uppercase font-bold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Earn New Badges</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AVAILABLE_STEWARDSHIP_BADGES.map((badge) => (
              <div 
                key={badge.id}
                className="p-5 rounded-sm bg-[#0D0D0D] border border-[#C5A059]/30 hover:border-[#C5A059] transition-all space-y-4 relative overflow-hidden group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-sm bg-[#1B3022] border border-[#C5A059]/50 flex items-center justify-center text-[#C5A059] shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="text-right font-mono">
                    <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                      {badge.tier}
                    </span>
                    <div className="text-[10px] text-emerald-400 mt-1 font-bold">+{badge.reputationPointsValue} Rep</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-[#F5F5F0]/40 uppercase">{badge.code}</div>
                  <h4 className="text-base font-serif font-bold text-white">{badge.title}</h4>
                  <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F5F5F0]/10 space-y-1 text-[10px] font-mono">
                  <div className="flex items-center justify-between text-[#F5F5F0]/50">
                    <span>Attestations Count:</span>
                    <span className="text-white font-bold">{badge.attestationsCount} Peers</span>
                  </div>
                  <div className="flex items-center justify-between text-[#F5F5F0]/50">
                    <span>Minted Token:</span>
                    <span className="text-cyan-300 font-bold">{badge.mintedTokenId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Regenerative Action Quests */}
      {activeTab === 'actions' && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-sm flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Action-to-Earn Mechanism</span>
              </div>
              <p className="text-xs text-[#F5F5F0]/70 font-sans">
                Execute verified ecological interventions, field audits, or community agreements to earn reputation points and permanent non-fungible badges.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {quests.map((quest) => (
              <div 
                key={quest.id}
                className={`p-5 rounded-sm border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  quest.isCompleted 
                    ? 'bg-[#08120C] border-emerald-500/40' 
                    : 'bg-[#0D0D0D] border-[#F5F5F0]/15 hover:border-[#C5A059]/50'
                }`}
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40">
                      Badge: {quest.badgeName}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      +{quest.reputationPoints} Rep Points
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">
                      • {quest.impactMetric}
                    </span>
                  </div>

                  <h4 className="text-base font-serif font-bold text-white">{quest.title}</h4>
                  <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                    {quest.description}
                  </p>

                  <div className="text-[11px] font-mono text-[#F5F5F0]/50 flex items-center gap-1.5 pt-1">
                    <span className="text-[#C5A059]">Requirement:</span>
                    <span>{quest.actionRequirement}</span>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  {quest.isCompleted ? (
                    <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-mono uppercase font-bold rounded flex items-center gap-2 justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Completed & Minted</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleExecuteAction(quest)}
                      disabled={claimingQuestId === quest.id}
                      className="w-full md:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs uppercase font-bold tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {claimingQuestId === quest.id ? (
                        <>
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying Sensor Attestation...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Execute & Claim Badge</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Verified Contribution History Log */}
      {activeTab === 'contributions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif text-white font-bold">Verified Contribution Timeline</h3>
            <div className="flex items-center gap-1 bg-[#141414] p-0.5 rounded border border-[#F5F5F0]/10 text-xs font-mono">
              {(['all', 'knowledge', 'forensics'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setContributionFilter(f)}
                  className={`px-3 py-1 rounded text-[10px] uppercase transition-colors ${
                    contributionFilter === f 
                      ? 'bg-[#F5F5F0] text-black font-bold' 
                      : 'text-[#F5F5F0]/60 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {INITIAL_LOCAL_KNOWLEDGE_SUBMISSIONS.map((sub) => (
              <div key={sub.id} className="p-4 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#C5A059] font-bold">{sub.missionTitle}</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    +{sub.reputationAwarded} Rep Awarded
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{sub.title}</h4>
                <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">{sub.summary}</p>
                <div className="pt-2 border-t border-[#F5F5F0]/10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#F5F5F0]/40">
                  <span>Audited by: {sub.peerReviews[0]?.reviewerName} ({sub.peerReviews[0]?.role})</span>
                  <span className="text-cyan-300 truncate max-w-[200px]">Hash: {sub.cryptographicHash}</span>
                </div>
              </div>
            ))}

            {INITIAL_FAILURE_REVIEWS.map((rev) => (
              <div key={rev.id} className="p-4 rounded-sm bg-[#0D0D0D] border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold">{rev.failureProjectName}</span>
                  <span className="text-emerald-400 font-bold">+{rev.reputationAwarded} Rep</span>
                </div>
                <h4 className="text-sm font-bold text-white">Root-Cause Failure Forensic Review</h4>
                <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">{rev.content}</p>
                <div className="text-[10px] font-mono text-emerald-400">
                  Consensus Score: {rev.consensusScore}% • Codified into Atlas Institutional Canon
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Automated Impact Story Generator */}
      {activeTab === 'story' && (
        <ImpactStoryGenerator 
          stewardName={CURRENT_STEWARD_PROFILE.name}
          reputationPoints={profile.reputationPoints}
          verifiedAuditsSigned={profile.verifiedAuditsSigned}
          earnedBadgeCount={profile.earnedBadgeCount}
          hectaresRestored={profile.hectaresRestored}
          litersProtectedMillions={profile.litersProtectedMillions}
          carbonSequesteredTons={profile.carbonSequesteredTons}
          streakDays={14}
        />
      )}

      {/* Tab 5: Collaborative Stewardship Teams */}
      {activeTab === 'teams' && (
        <CollaborativeStewardshipTeams />
      )}
    </div>
  );
};
