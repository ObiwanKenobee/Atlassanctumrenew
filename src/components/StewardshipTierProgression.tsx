import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ShieldCheck, 
  BookOpen, 
  TreeDeciduous, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  TrendingUp, 
  Lock, 
  Zap,
  Radio,
  ChevronRight,
  Plus,
  Scale
} from 'lucide-react';
import { audioFeedback } from '../lib/audioFeedback';

export interface StewardshipBadge {
  id: string;
  name: string;
  category: 'failure_ledger' | 'ecological_outcome' | 'epistemic_evidence' | 'elder_covenant';
  tierRequired: number; // 1, 2, 3, 4
  description: string;
  icon: any;
  earnedAt?: string;
  proofHash?: string;
}

export interface UserStewardshipState {
  xp: number;
  failureLedgerContributions: number;
  ecologicalMilestonesVerified: number;
  evidenceLedgerAnchors: number;
  elderCovenantsEndorsed: number;
  votingWeightMultiplier: number;
}

interface StewardshipTierProgressionProps {
  compact?: boolean;
  onNavigateToFailureLedger?: () => void;
  onNavigateToEvidenceLedger?: () => void;
  className?: string;
}

const TIERS = [
  { level: 1, name: 'Novice Sentinel', minXp: 0, maxXp: 499, color: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-500/30', multiplier: 1.0 },
  { level: 2, name: 'Field Custodian', minXp: 500, maxXp: 1499, color: 'text-cyan-400', bg: 'bg-cyan-950/40', border: 'border-cyan-500/30', multiplier: 1.25 },
  { level: 3, name: 'Bioregional Arbiter', minXp: 1500, maxXp: 3499, color: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-500/30', multiplier: 1.75 },
  { level: 4, name: 'Sovereign Planetary Steward', minXp: 3500, maxXp: 10000, color: 'text-[#C5A059]', bg: 'bg-[#1B3022]', border: 'border-[#C5A059]', multiplier: 2.5 }
];

export const StewardshipTierProgression: React.FC<StewardshipTierProgressionProps> = ({
  compact = false,
  onNavigateToFailureLedger,
  onNavigateToEvidenceLedger,
  className = ''
}) => {
  const [userState, setUserState] = useState<UserStewardshipState>(() => {
    try {
      const saved = localStorage.getItem('atlas_user_stewardship_state');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      xp: 1850,
      failureLedgerContributions: 3,
      ecologicalMilestonesVerified: 5,
      evidenceLedgerAnchors: 6,
      elderCovenantsEndorsed: 2,
      votingWeightMultiplier: 1.75
    };
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('atlas_user_stewardship_state', JSON.stringify(userState));
    } catch (e) {}
  }, [userState]);

  // Determine current tier
  const currentTier = TIERS.find(t => userState.xp >= t.minXp && userState.xp <= t.maxXp) || TIERS[TIERS.length - 1];
  const nextTier = TIERS.find(t => t.level === currentTier.level + 1);

  const progressPercent = nextTier 
    ? Math.min(100, Math.max(0, ((userState.xp - currentTier.minXp) / (nextTier.minXp - currentTier.minXp)) * 100))
    : 100;

  const BADGES: StewardshipBadge[] = [
    {
      id: 'badge-failure-auditor',
      name: 'Failure Forensic Auditor',
      category: 'failure_ledger',
      tierRequired: 2,
      description: 'Submitted 3+ verified root-cause investigations preventing systemic ecological collapse.',
      icon: BookOpen,
      earnedAt: userState.failureLedgerContributions >= 3 ? '2026-06-12' : undefined,
      proofHash: '0x3f9a...81c2'
    },
    {
      id: 'badge-watershed-vanguard',
      name: 'Watershed Restorative Vanguard',
      category: 'ecological_outcome',
      tierRequired: 2,
      description: 'Verified 4+ in-situ sensor networks restoring riverine riparian buffers.',
      icon: TreeDeciduous,
      earnedAt: userState.ecologicalMilestonesVerified >= 4 ? '2026-07-04' : undefined,
      proofHash: '0x88b1...e44f'
    },
    {
      id: 'badge-elder-covenant',
      name: 'Elder Covenant Custodian',
      category: 'elder_covenant',
      tierRequired: 3,
      description: 'Anchored ancestral biocultural covenants in public decentralized consensus.',
      icon: ShieldCheck,
      earnedAt: userState.elderCovenantsEndorsed >= 2 ? '2026-08-15' : undefined,
      proofHash: '0x11c4...99a0'
    },
    {
      id: 'badge-epistemic-anchor',
      name: 'Epistemic Truth Anchor',
      category: 'epistemic_evidence',
      tierRequired: 3,
      description: 'Anchored 5+ verified cryptographic claims on the Evidence Ledger.',
      icon: Sparkles,
      earnedAt: userState.evidenceLedgerAnchors >= 5 ? '2026-08-20' : undefined,
      proofHash: '0x99e2...bb31'
    }
  ];

  const handleAddContribution = (type: 'failure' | 'ecological' | 'evidence') => {
    let xpGain = 0;
    let desc = '';

    if (type === 'failure') {
      xpGain = 250;
      desc = '+250 XP: Verified Failure Ledger forensic post-mortem recorded!';
      setUserState(prev => ({
        ...prev,
        xp: prev.xp + xpGain,
        failureLedgerContributions: prev.failureLedgerContributions + 1,
        votingWeightMultiplier: Math.min(2.5, +(prev.votingWeightMultiplier + 0.1).toFixed(2))
      }));
    } else if (type === 'ecological') {
      xpGain = 150;
      desc = '+150 XP: In-situ ecological outcome verified on live telemetry!';
      setUserState(prev => ({
        ...prev,
        xp: prev.xp + xpGain,
        ecologicalMilestonesVerified: prev.ecologicalMilestonesVerified + 1
      }));
    } else {
      xpGain = 100;
      desc = '+100 XP: Epistemic Evidence Ledger anchor signed!';
      setUserState(prev => ({
        ...prev,
        xp: prev.xp + xpGain,
        evidenceLedgerAnchors: prev.evidenceLedgerAnchors + 1
      }));
    }

    audioFeedback.playImpactTrigger();
    setToastMessage(desc);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (compact) {
    return (
      <div className={`p-3 bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#C5A059]" />
            <span className="text-xs font-serif font-bold text-[#F5F5F0]">
              Stewardship Tier {currentTier.level}
            </span>
          </div>
          <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${currentTier.bg} ${currentTier.color} ${currentTier.border}`}>
            {currentTier.name}
          </span>
        </div>

        {/* Mini Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-[#F5F5F0]/60">
            <span>{userState.xp} XP</span>
            <span>{nextTier ? `${nextTier.minXp} XP (${nextTier.name})` : 'Max Rank'}</span>
          </div>
          <div className="w-full h-1.5 bg-[#141414] rounded-full overflow-hidden border border-[#F5F5F0]/10">
            <div 
              className="h-full bg-gradient-to-r from-[#C5A059] to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Dynamic Badges Row */}
        <div className="flex items-center gap-1.5 pt-1">
          {BADGES.map((b) => {
            const Icon = b.icon;
            const isEarned = !!b.earnedAt;
            return (
              <div
                key={b.id}
                title={`${b.name} — ${b.description} ${isEarned ? `(Earned ${b.earnedAt})` : '(Locked)'}`}
                className={`p-1.5 rounded text-xs border transition-all ${
                  isEarned 
                    ? 'bg-[#1B3022] border-[#C5A059] text-[#C5A059] shadow-sm' 
                    : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/30 opacity-60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            );
          })}
          <span className="text-[10px] font-mono text-[#F5F5F0]/50 ml-auto">
            {userState.votingWeightMultiplier}x Vote Weight
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 sm:p-8 bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40 font-bold flex items-center gap-1.5">
              <Award className="w-3 h-3 text-[#C5A059]" />
              VERIFIED STEWARDSHIP TIER & CITIZEN REPUTATION
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#F5F5F0]">
            Stewardship Progression System
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/65 max-w-2xl font-sans">
            Your civilizational governance weight dynamically scales through verified ecological ground audits and forensic failure disclosures.
          </p>
        </div>

        {/* Current Tier Badge & Multiplier */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-sm border ${currentTier.bg} ${currentTier.border} text-right`}>
            <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider block">Active Rank</span>
            <span className={`text-base font-serif font-bold ${currentTier.color}`}>
              {currentTier.name}
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-sm bg-[#141414] border border-[#F5F5F0]/15 text-center">
            <span className="text-[10px] font-mono text-[#C5A059] uppercase font-bold block">Vote Multiplier</span>
            <span className="text-base font-mono font-bold text-[#F5F5F0]">
              {userState.votingWeightMultiplier}x
            </span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tier Breakdown Carousel / Steps */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-[#F5F5F0]/70">
            Total Epistemic Reputation: <strong className="text-[#C5A059]">{userState.xp} XP</strong>
          </span>
          <span className="text-[#F5F5F0]/50">
            {nextTier ? `Next Rank: ${nextTier.name} (${nextTier.minXp - userState.xp} XP needed)` : 'Maximum Planetary Steward Tier'}
          </span>
        </div>

        <div className="w-full h-3 bg-[#141414] rounded-full overflow-hidden border border-[#F5F5F0]/10 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 4 Tiers Milestones */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {TIERS.map((t) => {
            const isPassed = userState.xp >= t.minXp;
            const isCurrent = t.level === currentTier.level;
            return (
              <div 
                key={t.level}
                className={`p-3 rounded border text-left transition-all ${
                  isCurrent 
                    ? `${t.bg} ${t.border} ring-1 ring-[#C5A059]/40` 
                    : isPassed 
                    ? 'bg-[#141414] border-[#F5F5F0]/20 text-[#F5F5F0]' 
                    : 'bg-[#0A0A0A] border-[#F5F5F0]/5 text-[#F5F5F0]/30'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span>Tier {t.level}</span>
                  {isPassed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3 h-3 text-[#F5F5F0]/30" />}
                </div>
                <div className={`text-xs font-serif font-bold mt-1 ${isPassed ? t.color : 'text-[#F5F5F0]/40'}`}>
                  {t.name}
                </div>
                <div className="text-[10px] font-mono text-[#F5F5F0]/50 mt-0.5">
                  {t.minXp}+ XP ({t.multiplier}x)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Contribution Metrics & Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#F5F5F0]/10">
        
        {/* Left: Verified Contributions Breakdown */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Verified Contribution Ledger
          </h3>

          <div className="space-y-2.5">
            {/* Failure Ledger Contributions */}
            <div className="p-3.5 bg-[#141414] border border-[#F5F5F0]/10 rounded flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-serif font-bold text-[#F5F5F0] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Failure Ledger Forensic Audits</span>
                </div>
                <div className="text-[10px] font-mono text-[#F5F5F0]/50">
                  {userState.failureLedgerContributions} investigations codified • High systemic multiplier (+250 XP each)
                </div>
              </div>
              <button
                onClick={() => handleAddContribution('failure')}
                className="px-2.5 py-1 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                title="Simulate recording a verified failure lesson"
              >
                <Plus className="w-3 h-3" />
                <span>Log Audit</span>
              </button>
            </div>

            {/* Ecological Outcomes */}
            <div className="p-3.5 bg-[#141414] border border-[#F5F5F0]/10 rounded flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-serif font-bold text-[#F5F5F0] flex items-center gap-1.5">
                  <TreeDeciduous className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Ecological Milestones</span>
                </div>
                <div className="text-[10px] font-mono text-[#F5F5F0]/50">
                  {userState.ecologicalMilestonesVerified} biophysical targets verified (+150 XP each)
                </div>
              </div>
              <button
                onClick={() => handleAddContribution('ecological')}
                className="px-2.5 py-1 bg-[#141414] hover:bg-[#222] border border-[#F5F5F0]/20 text-[#F5F5F0] rounded text-[10px] font-mono flex items-center gap-1 transition-all"
                title="Simulate recording an ecological outcome"
              >
                <Plus className="w-3 h-3" />
                <span>Verify</span>
              </button>
            </div>

            {/* Evidence Ledger Anchors */}
            <div className="p-3.5 bg-[#141414] border border-[#F5F5F0]/10 rounded flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-serif font-bold text-[#F5F5F0] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Evidence Ledger Anchors</span>
                </div>
                <div className="text-[10px] font-mono text-[#F5F5F0]/50">
                  {userState.evidenceLedgerAnchors} cryptographic anchors signed (+100 XP each)
                </div>
              </div>
              <button
                onClick={() => handleAddContribution('evidence')}
                className="px-2.5 py-1 bg-[#141414] hover:bg-[#222] border border-[#F5F5F0]/20 text-[#F5F5F0] rounded text-[10px] font-mono flex items-center gap-1 transition-all"
                title="Simulate signing an evidence anchor"
              >
                <Plus className="w-3 h-3" />
                <span>Anchor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Unlocked Proof-of-Stewardship Badges */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-2">
            <Award className="w-4 h-4" />
            Proof-of-Stewardship Badges
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BADGES.map((badge) => {
              const Icon = badge.icon;
              const isEarned = !!badge.earnedAt;
              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded border transition-all space-y-2 ${
                    isEarned
                      ? 'bg-[#141414] border-[#C5A059]/50 shadow-sm'
                      : 'bg-[#0A0A0A] border-[#F5F5F0]/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded ${isEarned ? 'bg-[#1B3022] text-[#C5A059]' : 'bg-[#121212] text-[#F5F5F0]/30'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                      isEarned ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                    }`}>
                      {isEarned ? 'Unlocked' : `Tier ${badge.tierRequired}`}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-serif font-bold text-[#F5F5F0]">{badge.name}</h4>
                    <p className="text-[10px] text-[#F5F5F0]/60 font-sans leading-tight mt-0.5">{badge.description}</p>
                  </div>

                  {isEarned && (
                    <div className="text-[9px] font-mono text-[#C5A059] pt-1 border-t border-[#F5F5F0]/10 flex justify-between">
                      <span>Earned: {badge.earnedAt}</span>
                      <span>{badge.proofHash}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
