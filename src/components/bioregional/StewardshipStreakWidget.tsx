import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Clock, 
  ChevronRight, 
  X, 
  Share2, 
  Lock,
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';
import { 
  StewardshipStreakState, 
  StreakBadge, 
  loadStewardshipStreak, 
  recordHazardMonitorEngagement 
} from '../../services/stewardshipStreakService';
import { advanceAchievementProgress } from '../../services/achievementService';
import { audioFeedback } from '../../lib/audioFeedback';

interface StewardshipStreakWidgetProps {
  compact?: boolean;
}

export const StewardshipStreakWidget: React.FC<StewardshipStreakWidgetProps> = ({
  compact = false
}) => {
  const [streakState, setStreakState] = useState<StewardshipStreakState>(loadStewardshipStreak);
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);
  const [justCheckedInMsg, setJustCheckedInMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = (e: CustomEvent<StewardshipStreakState>) => {
      if (e.detail) {
        setStreakState(e.detail);
      } else {
        setStreakState(loadStewardshipStreak());
      }
    };

    window.addEventListener('atlas-streak-updated' as any, handleUpdate);
    return () => {
      window.removeEventListener('atlas-streak-updated' as any, handleUpdate);
    };
  }, []);

  const handleManualCheckIn = () => {
    audioFeedback.playMicroTick();
    const result = recordHazardMonitorEngagement('Daily Hazard Cockpit Audit');
    setStreakState(result.state);

    if (result.alreadyCheckedIn) {
      setJustCheckedInMsg('You already verified today! Come back tomorrow to keep the flame alive.');
    } else {
      audioFeedback.playSuccessChime();
      setJustCheckedInMsg(`+${result.repAwarded} Reputation Awarded! Streak advanced to Day ${result.state.currentStreak}!`);

      // Advance 7-day streak achievement progress
      advanceAchievementProgress('ach-7day-streak', 1);
    }

    setTimeout(() => {
      setJustCheckedInMsg(null);
    }, 4000);
  };

  // Find next milestone badge
  const nextBadge = streakState.earnedBadges.find(b => !b.isUnlocked);
  const daysUntilNext = nextBadge ? Math.max(0, nextBadge.requiredDays - streakState.currentStreak) : 0;
  const progressPercent = nextBadge 
    ? Math.min(100, Math.round((streakState.currentStreak / nextBadge.requiredDays) * 100))
    : 100;

  return (
    <>
      <div 
        id="stewardship-streak-cockpit-bar"
        className="w-full bg-[#0D120E] border border-amber-500/30 rounded-xl p-3.5 sm:p-4 text-[#F5F5F0] shadow-lg relative overflow-hidden transition-all hover:border-amber-500/50"
      >
        {/* Subtle background ember glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* 1. Flame & Streak Count */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 via-[#1B3022] to-amber-600/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                <Flame className={`w-6 h-6 ${streakState.currentStreak > 0 ? 'text-amber-400 fill-amber-400/30 animate-pulse' : 'text-zinc-500'}`} />
              </div>
              {streakState.currentStreak >= 7 && (
                <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-amber-400 text-black text-[8px] font-mono font-black uppercase rounded shadow">
                  HOT
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1">
                  Stewardship Streak
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold">
                  {streakState.streakMultiplier}x Rep Bonus
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-serif font-black text-white">
                  {streakState.currentStreak}
                </span>
                <span className="text-xs font-mono text-white/60">
                  {streakState.currentStreak === 1 ? 'Day Consistent' : 'Days Consistent'}
                </span>
                <span className="text-[10px] font-mono text-white/40 hidden sm:inline">
                  (Best: {streakState.longestStreak} days)
                </span>
              </div>
            </div>
          </div>

          {/* 2. 7-Day Micro Tracker */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1">
            {streakState.weeklyActivity.map((item, idx) => (
              <div 
                key={idx}
                className="flex flex-col items-center gap-1 min-w-[34px] sm:min-w-[40px]"
              >
                <span className={`text-[10px] font-mono ${item.isToday ? 'text-amber-400 font-bold' : 'text-white/40'}`}>
                  {item.day}
                </span>
                <div 
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border transition-all ${
                    item.active
                      ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : item.isToday
                      ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 animate-pulse'
                      : 'bg-black/40 border-white/10 text-white/20'
                  }`}
                  title={`${item.date}: ${item.active ? 'Audited' : item.isToday ? 'Check in today!' : 'Inactive'}`}
                >
                  {item.active ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : item.isToday ? (
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 3. Action Controls: Daily Check-in & Badge Drawer Trigger */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setShowBadgesModal(true);
              }}
              className="px-3 py-2 rounded-lg bg-black/50 hover:bg-[#1B3022] border border-amber-500/30 hover:border-amber-400 text-amber-300 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
              title="View Collectible Digital Badges"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span className="hidden xs:inline">Streak Badges</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 font-bold">
                {streakState.earnedBadges.filter(b => b.isUnlocked).length}/{streakState.earnedBadges.length}
              </span>
            </button>

            {streakState.todayCheckedIn ? (
              <div className="px-4 py-2 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Today Verified</span>
              </div>
            ) : (
              <button
                id="claim-daily-stewardship-checkin-btn"
                onClick={handleManualCheckIn}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-[#C5A059] hover:from-amber-400 hover:to-amber-500 text-black text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-[1.02] cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Check In (+{Math.round(30 * streakState.streakMultiplier)} Rep)</span>
              </button>
            )}
          </div>
        </div>

        {/* Milestone Progress Bar & Feedback Toast */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <span className="text-white/50 text-[11px] shrink-0">
              Next Reward:
            </span>
            {nextBadge ? (
              <div className="flex items-center gap-2 flex-1">
                <span className="text-amber-300 font-bold truncate">
                  {nextBadge.name} ({daysUntilNext} days left)
                </span>
                <div className="w-24 sm:w-32 bg-black/60 rounded-full h-1.5 overflow-hidden border border-white/10 shrink-0">
                  <div 
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <span className="text-emerald-400 font-bold">
                All Current Streak Milestones Mastered!
              </span>
            )}
          </div>

          <div className="text-[11px] text-white/50 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Streak Freezes Remaining: <strong className="text-white">{streakState.streakFreezes}</strong></span>
          </div>
        </div>

        {/* Transient alert feedback message */}
        {justCheckedInMsg && (
          <div className="mt-2 p-2 rounded bg-amber-950/90 border border-amber-500 text-amber-200 text-xs font-mono animate-in fade-in duration-200 flex items-center justify-between">
            <span>{justCheckedInMsg}</span>
            <button 
              onClick={() => setJustCheckedInMsg(null)}
              className="text-amber-400 hover:text-white ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Collectible Streak Badges Modal */}
      {showBadgesModal && (
        <div 
          id="streak-badges-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            id="streak-badges-modal-panel"
            className="w-full max-w-2xl bg-[#0D120F] border border-amber-500/40 rounded-xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    Collectible Stewardship Streak Badges
                  </h3>
                  <p className="text-xs font-mono text-white/60">
                    Earn permanent reputation multipliers & on-chain provenance records
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowBadgesModal(false)}
                className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Streak Multiplier Explainer */}
            <div className="p-3.5 rounded-lg bg-gradient-to-r from-[#142318] to-[#0D120F] border border-emerald-500/30 text-xs font-mono space-y-1">
              <div className="flex items-center justify-between text-emerald-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Continuous Engagement Multipliers
                </span>
                <span>Active Multiplier: {streakState.streakMultiplier}x</span>
              </div>
              <p className="text-white/70 font-sans text-xs">
                Monitoring bioregional hazard vectors daily ensures early detection of deforestation, wildfires, and aquifer depletion. Consistency scales reputation points earned across all field operations.
              </p>
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {streakState.earnedBadges.map((badge) => {
                const isUnlocked = badge.isUnlocked;
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-[#121B15] to-[#0A0D0B] border-amber-500/50 shadow-md'
                        : 'bg-black/40 border-white/10 opacity-70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                        isUnlocked
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                          : 'bg-white/5 text-white/30 border-white/10'
                      }`}>
                        {isUnlocked ? (
                          <Award className="w-6 h-6 text-amber-400" />
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-sm font-serif font-bold text-white truncate">
                            {badge.name}
                          </h4>
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold border ${
                            isUnlocked
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                              : 'bg-black/50 text-white/40 border-white/10'
                          }`}>
                            {badge.requiredDays} {badge.requiredDays === 1 ? 'Day' : 'Days'}
                          </span>
                        </div>

                        <p className="text-xs text-white/70 font-sans leading-relaxed">
                          {badge.description}
                        </p>

                        <div className="pt-2 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-amber-400 font-bold">
                            +{badge.reputationBonus} Rep Points
                          </span>
                          {isUnlocked ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Unlocked
                            </span>
                          ) : (
                            <span className="text-white/40">
                              Requires {badge.requiredDays} day streak
                            </span>
                          )}
                        </div>

                        {badge.merkleProof && (
                          <div className="pt-1 text-[9px] font-mono text-white/40 truncate">
                            Proof: {badge.merkleProof.slice(0, 16)}...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
              <span>Commandment X: Regenerative Longevity</span>
              <button
                onClick={() => setShowBadgesModal(false)}
                className="px-4 py-1.5 bg-[#1B3022] hover:bg-[#254530] text-amber-300 rounded border border-amber-500/40 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
