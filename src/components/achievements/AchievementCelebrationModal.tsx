import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  X, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Share2, 
  Flame, 
  ShieldAlert, 
  Droplets, 
  FileCheck2, 
  MessageSquareShare,
  Lock,
  ArrowRight
} from 'lucide-react';
import { AchievementMilestone, loadAchievements, advanceAchievementProgress } from '../../services/achievementService';
import { audioFeedback } from '../../lib/audioFeedback';

interface AchievementCelebrationModalProps {
  // Optional external trigger
  isOpenExternally?: boolean;
  onCloseExternal?: () => void;
}

export const AchievementCelebrationModal: React.FC<AchievementCelebrationModalProps> = ({
  isOpenExternally,
  onCloseExternal
}) => {
  const [activeCelebration, setActiveCelebration] = useState<AchievementMilestone | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [achievements, setAchievements] = useState<AchievementMilestone[]>(loadAchievements);
  const [filterCategory, setFilterCategory] = useState<'all' | 'unlocked' | 'in_progress'>('all');
  const [copiedProof, setCopiedProof] = useState<boolean>(false);

  // Listen for real-time achievement unlocks across the entire app
  useEffect(() => {
    const handleAchievementUnlock = (e: CustomEvent<AchievementMilestone>) => {
      if (e.detail) {
        setActiveCelebration(e.detail);
        setAchievements(loadAchievements());
        audioFeedback.playCovenantResonance();
      }
    };

    const handleSync = () => {
      setAchievements(loadAchievements());
    };

    const handleOpenDrawer = () => {
      setIsDrawerOpen(true);
      setAchievements(loadAchievements());
    };

    window.addEventListener('atlas-achievement-unlocked' as any, handleAchievementUnlock);
    window.addEventListener('atlas-achievements-synced' as any, handleSync);
    window.addEventListener('open-achievements-drawer' as any, handleOpenDrawer);

    return () => {
      window.removeEventListener('atlas-achievement-unlocked' as any, handleAchievementUnlock);
      window.removeEventListener('atlas-achievements-synced' as any, handleSync);
      window.removeEventListener('open-achievements-drawer' as any, handleOpenDrawer);
    };
  }, []);

  // Icon selector
  const renderIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Droplets':
        return <Droplets className={className} />;
      case 'FileCheck2':
        return <FileCheck2 className={className} />;
      case 'MessageSquareShare':
        return <MessageSquareShare className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'mythic':
        return 'from-purple-500 via-pink-500 to-amber-400 text-purple-200 border-purple-400';
      case 'platinum':
        return 'from-cyan-500 to-blue-600 text-cyan-200 border-cyan-400';
      case 'gold':
        return 'from-amber-400 to-yellow-600 text-amber-200 border-amber-400';
      case 'silver':
        return 'from-slate-300 to-slate-500 text-slate-200 border-slate-300';
      default:
        return 'from-amber-700 to-amber-900 text-amber-300 border-amber-600';
    }
  };

  const handleCopyProof = (hash?: string) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedProof(true);
    audioFeedback.playSubtleClick();
    setTimeout(() => setCopiedProof(false), 2000);
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const filteredAchievements = achievements.filter(a => {
    if (filterCategory === 'unlocked') return a.isUnlocked;
    if (filterCategory === 'in_progress') return !a.isUnlocked;
    return true;
  });

  return (
    <>
      {/* 1. Real-time Modal Celebration when Milestone Unlocks */}
      {activeCelebration && (
        <div 
          id="achievement-celebration-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
        >
          <div 
            id="achievement-celebration-card"
            className="relative w-full max-w-lg bg-[#0D120F] border-2 border-[#C5A059] rounded-xl shadow-[0_0_50px_rgba(197,160,89,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 p-6 sm:p-8 text-center space-y-5"
          >
            {/* Top decorative rays */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={() => setActiveCelebration(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/50 text-[#F5F5F0]/60 hover:text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Milestone Icon Badge */}
            <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-[#1B3022] p-1 shadow-[0_0_25px_rgba(245,158,11,0.5)]">
              <div className="w-full h-full bg-[#0A0E0C] rounded-[14px] flex items-center justify-center text-amber-300">
                {renderIcon(activeCelebration.iconName, 'w-10 h-10 sm:w-12 sm:h-12 animate-pulse')}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono uppercase tracking-widest font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Planetary Milestone Achieved</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                {activeCelebration.title}
              </h2>
              <p className="text-sm text-[#F5F5F0]/80 font-sans max-w-sm mx-auto">
                {activeCelebration.description}
              </p>
            </div>

            {/* Reputation Bonus Block */}
            <div className="p-4 rounded-lg bg-[#142318] border border-emerald-500/40 flex items-center justify-between text-left">
              <div>
                <div className="text-[10px] font-mono uppercase text-emerald-300/70 font-bold">
                  Stewardship Reputation Awarded
                </div>
                <div className="text-2xl font-mono font-bold text-emerald-400 flex items-center gap-1">
                  +{activeCelebration.reputationBonus} <span className="text-xs font-sans text-emerald-300/80">Reputation Points</span>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/50 text-[11px] font-mono text-emerald-300 uppercase font-bold">
                {activeCelebration.tier} Tier
              </div>
            </div>

            {/* Cryptographic Merkle Proof snippet */}
            {activeCelebration.proofHash && (
              <div className="flex items-center justify-between text-[11px] font-mono bg-black/60 p-2.5 rounded border border-white/10 text-[#F5F5F0]/70">
                <div className="truncate max-w-[260px] sm:max-w-[320px] text-left">
                  <span className="text-[#C5A059]">Merkle Proof:</span> {activeCelebration.proofHash}
                </div>
                <button
                  onClick={() => handleCopyProof(activeCelebration.proofHash)}
                  className="text-amber-400 hover:text-amber-200 underline shrink-0 ml-2 cursor-pointer"
                >
                  {copiedProof ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  audioFeedback.playSuccessChime();
                  setActiveCelebration(null);
                  setIsDrawerOpen(true);
                }}
                className="w-full sm:flex-1 py-2.5 px-4 bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/60 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                <span>View All Achievements</span>
              </button>
              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setActiveCelebration(null);
                }}
                className="w-full sm:w-auto py-2.5 px-6 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-lg"
              >
                Claim & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Achievement Milestones Drawer / Modal to browse all platform achievements */}
      {isDrawerOpen && (
        <div 
          id="all-achievements-drawer-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            id="all-achievements-drawer-panel"
            className="w-full max-w-xl h-full bg-[#0A0D0B] border-l border-[#C5A059]/40 shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Stewardship Milestones & Achievements</h3>
                  <p className="text-xs font-mono text-[#F5F5F0]/60">
                    {unlockedCount} of {achievements.length} Milestones Unlocked
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  filterCategory === 'all'
                    ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
                    : 'bg-black/40 text-white/50 hover:text-white'
                }`}
              >
                All ({achievements.length})
              </button>
              <button
                onClick={() => setFilterCategory('unlocked')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  filterCategory === 'unlocked'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 font-bold'
                    : 'bg-black/40 text-white/50 hover:text-white'
                }`}
              >
                Unlocked ({unlockedCount})
              </button>
              <button
                onClick={() => setFilterCategory('in_progress')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  filterCategory === 'in_progress'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-500/60 font-bold'
                    : 'bg-black/40 text-white/50 hover:text-white'
                }`}
              >
                In Progress ({achievements.length - unlockedCount})
              </button>
            </div>

            {/* Achievements List */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {filteredAchievements.map((ach) => {
                const percent = Math.min(100, Math.round((ach.currentProgress / ach.metricTarget) * 100));
                return (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-xl border transition-all ${
                      ach.isUnlocked
                        ? 'bg-gradient-to-br from-[#101B14] to-[#0A0D0B] border-emerald-500/40 shadow-sm'
                        : 'bg-[#0D0F0E] border-white/10 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                        ach.isUnlocked
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-white/5 text-white/40 border-white/10'
                      }`}>
                        {renderIcon(ach.iconName, 'w-6 h-6')}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-serif font-bold text-white truncate">
                            {ach.title}
                          </h4>
                          <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                            ach.isUnlocked
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                              : 'bg-black/50 text-white/40 border-white/10'
                          }`}>
                            {ach.isUnlocked ? 'Unlocked' : `${percent}%`}
                          </span>
                        </div>

                        <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                          {ach.description}
                        </p>

                        {/* Progress Bar for in-progress achievements */}
                        {!ach.isUnlocked && (
                          <div className="pt-2 space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                              <span>Progress:</span>
                              <span className="text-[#C5A059] font-bold">
                                {ach.currentProgress} / {ach.metricTarget} {ach.unit}
                              </span>
                            </div>
                            <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden border border-white/10">
                              <div 
                                className="h-full bg-gradient-to-r from-amber-500 to-[#C5A059] transition-all duration-300"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Unlocked Footer */}
                        {ach.isUnlocked && (
                          <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>+{ach.reputationBonus} Rep Claimed</span>
                            </span>
                            {ach.proofHash && (
                              <button
                                onClick={() => handleCopyProof(ach.proofHash)}
                                className="text-[#C5A059] hover:underline cursor-pointer"
                              >
                                Merkle Proof: {ach.proofHash.slice(0, 10)}...
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#F5F5F0]/50">
              <span>Commandment X: Non-Punitive Progress</span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-1.5 bg-[#141414] hover:bg-[#202020] text-white rounded border border-white/20 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
