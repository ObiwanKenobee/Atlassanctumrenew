/**
 * STEWARDSHIP STREAK SERVICE
 * Tracks daily user engagement with the Bioregional Hazard Monitor,
 * calculates consecutive daily streaks, rewards consistent monitoring
 * with collectible digital badges and reputation points, and manages
 * retention boosters (streak freezes, milestone multipliers).
 */

import { audioFeedback } from '../lib/audioFeedback';
import { db } from '../lib/db';

export interface StreakBadge {
  id: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'mythic';
  requiredDays: number;
  description: string;
  reputationBonus: number;
  iconName: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  merkleProof?: string;
}

export interface StewardshipStreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activityHistory: string[]; // YYYY-MM-DD[]
  totalCheckIns: number;
  streakMultiplier: number;
  streakFreezes: number;
  reputationEarnedFromStreak: number;
  todayCheckedIn: boolean;
  earnedBadges: StreakBadge[];
  weeklyActivity: { day: string; date: string; active: boolean; isToday: boolean }[];
}

export const STREAK_BADGES: StreakBadge[] = [
  {
    id: 'badge-streak-1',
    name: 'Sentinel Novice',
    tier: 'bronze',
    requiredDays: 1,
    description: 'First registered daily telemetry scan of planetary hazard vectors.',
    reputationBonus: 50,
    iconName: 'Shield',
    isUnlocked: true,
    unlockedAt: '2026-09-08T08:30:00Z',
    merkleProof: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
  },
  {
    id: 'badge-streak-3',
    name: 'Orbital Sentinel',
    tier: 'silver',
    requiredDays: 3,
    description: '3 consecutive days of orbital satellite telemetry corroboration.',
    reputationBonus: 120,
    iconName: 'Satellite',
    isUnlocked: true,
    unlockedAt: '2026-09-10T10:15:00Z',
    merkleProof: '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d'
  },
  {
    id: 'badge-streak-7',
    name: 'Vigilant Custodian',
    tier: 'gold',
    requiredDays: 7,
    description: '7-day unbroken cycle of bioregional monitoring & hazard triaging.',
    reputationBonus: 300,
    iconName: 'Award',
    isUnlocked: false
  },
  {
    id: 'badge-streak-14',
    name: 'Bioregional Warden',
    tier: 'platinum',
    requiredDays: 14,
    description: '14-day persistent planetary watch across transboundary corridors.',
    reputationBonus: 750,
    iconName: 'Compass',
    isUnlocked: false
  },
  {
    id: 'badge-streak-30',
    name: 'Eternal Planetary Guardian',
    tier: 'mythic',
    requiredDays: 30,
    description: 'A full lunar rotation of unyielding epistemic environmental stewardship.',
    reputationBonus: 2000,
    iconName: 'Sparkles',
    isUnlocked: false
  }
];

const STORAGE_KEY = 'atlas_stewardship_streak_state';

// Helper: Format Date to YYYY-MM-DD
export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

// Compute Weekly Days Array (Mon-Sun around today)
export function computeWeeklyActivity(activityHistory: string[]): { day: string; date: string; active: boolean; isToday: boolean }[] {
  const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const todayStr = getTodayDateString();
  const result = [];

  // 6 days ago up to today
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = daysShort[d.getDay()];
    result.push({
      day: dayName,
      date: dateStr,
      active: activityHistory.includes(dateStr),
      isToday: dateStr === todayStr
    });
  }

  return result;
}

// Calculate streak multiplier based on streak days
export function calculateMultiplier(streak: number): number {
  if (streak >= 30) return 2.5;
  if (streak >= 14) return 2.0;
  if (streak >= 7) return 1.5;
  if (streak >= 3) return 1.25;
  return 1.0;
}

// Load Streak State
export function loadStewardshipStreak(): StewardshipStreakState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: StewardshipStreakState = JSON.parse(raw);
      const today = getTodayDateString();
      const yesterday = getYesterdayDateString();

      // Check if today is already active
      const todayCheckedIn = parsed.activityHistory.includes(today) || parsed.lastActiveDate === today;

      // Check if streak broke (if lastActiveDate was before yesterday and today not checked in)
      let currentStreak = parsed.currentStreak;
      if (!todayCheckedIn && parsed.lastActiveDate !== yesterday && parsed.lastActiveDate !== today) {
        // If streak freeze available, protect streak
        if (parsed.streakFreezes > 0) {
          parsed.streakFreezes -= 1;
        } else {
          currentStreak = 0;
        }
      }

      const weeklyActivity = computeWeeklyActivity(parsed.activityHistory);

      return {
        ...parsed,
        currentStreak,
        todayCheckedIn,
        weeklyActivity,
        streakMultiplier: calculateMultiplier(currentStreak)
      };
    }
  } catch (e) {
    console.warn('Could not parse streak storage:', e);
  }

  // Initial Seed State (e.g. 5 days current streak for engaging demo experience)
  const today = getTodayDateString();
  const seedDates = [];
  for (let i = 5; i >= 1; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    seedDates.push(d.toISOString().split('T')[0]);
  }

  const initialState: StewardshipStreakState = {
    currentStreak: 5,
    longestStreak: 8,
    lastActiveDate: seedDates[seedDates.length - 1],
    activityHistory: seedDates,
    totalCheckIns: 19,
    streakMultiplier: 1.25,
    streakFreezes: 2,
    reputationEarnedFromStreak: 480,
    todayCheckedIn: false,
    earnedBadges: STREAK_BADGES,
    weeklyActivity: computeWeeklyActivity(seedDates)
  };

  saveStewardshipStreak(initialState);
  return initialState;
}

// Save Streak State
export function saveStewardshipStreak(state: StewardshipStreakState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('atlas-streak-updated', { detail: state }));
  } catch (e) {
    console.warn('Failed saving streak state:', e);
  }
}

export interface CheckInResult {
  state: StewardshipStreakState;
  alreadyCheckedIn: boolean;
  repAwarded: number;
  newBadgesUnlocked: StreakBadge[];
}

// Perform Check-in / Record Engagement with Hazard Monitor
export function recordHazardMonitorEngagement(actionContext: string = 'Hazard Monitor Telemetry Review'): CheckInResult {
  const current = loadStewardshipStreak();
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (current.todayCheckedIn || current.lastActiveDate === today) {
    return {
      state: current,
      alreadyCheckedIn: true,
      repAwarded: 0,
      newBadgesUnlocked: []
    };
  }

  // Calculate new streak
  let newStreak = 1;
  if (current.lastActiveDate === yesterday) {
    newStreak = current.currentStreak + 1;
  } else if (current.currentStreak > 0 && current.lastActiveDate !== today) {
    // If we had a freeze, preserve streak
    if (current.streakFreezes > 0) {
      newStreak = current.currentStreak + 1;
    } else {
      newStreak = 1;
    }
  }

  const newLongest = Math.max(current.longestStreak, newStreak);
  const newMultiplier = calculateMultiplier(newStreak);
  const baseRep = 30;
  const repAwarded = Math.round(baseRep * newMultiplier);

  const updatedHistory = Array.from(new Set([...current.activityHistory, today]));

  // Check for badge unlocks
  const newBadgesUnlocked: StreakBadge[] = [];
  const updatedBadges = current.earnedBadges.map(b => {
    if (!b.isUnlocked && newStreak >= b.requiredDays) {
      const unlocked: StreakBadge = {
        ...b,
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
        merkleProof: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`
      };
      newBadgesUnlocked.push(unlocked);
      return unlocked;
    }
    return b;
  });

  // Calculate extra bonus if badges unlocked
  const badgeBonusRep = newBadgesUnlocked.reduce((acc, b) => acc + b.reputationBonus, 0);
  const totalAwarded = repAwarded + badgeBonusRep;

  const nextState: StewardshipStreakState = {
    ...current,
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastActiveDate: today,
    activityHistory: updatedHistory,
    totalCheckIns: current.totalCheckIns + 1,
    streakMultiplier: newMultiplier,
    reputationEarnedFromStreak: current.reputationEarnedFromStreak + totalAwarded,
    todayCheckedIn: true,
    earnedBadges: updatedBadges,
    weeklyActivity: computeWeeklyActivity(updatedHistory)
  };

  saveStewardshipStreak(nextState);

  // Update citizen profile reputation
  try {
    const rawProfile = localStorage.getItem('atlas_citizen_profile_state');
    if (rawProfile) {
      const profile = JSON.parse(rawProfile);
      profile.reputationPoints = (profile.reputationPoints || 1420) + totalAwarded;
      localStorage.setItem('atlas_citizen_profile_state', JSON.stringify(profile));
    }
  } catch (e) {
    console.warn('Profile sync notice:', e);
  }

  // Audit log to db
  try {
    db.audit.logInteraction({
      action: `Stewardship Streak Advanced: Day ${newStreak}`,
      feature: 'bioregional_hazard_monitor',
      impactTier: newStreak >= 7 ? 'high' : 'moderate',
      moralAlignmentScore: 99,
      parameters: {
        newStreak,
        totalRepEarned: totalAwarded,
        actionContext,
        badgesUnlockedCount: newBadgesUnlocked.length
      },
      ethicalNotes: `User sustained consecutive daily planetary vigilance. Multiplier active: ${newMultiplier}x.`
    }).catch(() => {});
  } catch {}

  // Dispatch custom event for in-app achievement notification system
  if (newBadgesUnlocked.length > 0) {
    newBadgesUnlocked.forEach(b => {
      window.dispatchEvent(new CustomEvent('atlas-achievement-unlocked', {
        detail: {
          id: b.id,
          title: b.name,
          category: 'Stewardship Streak',
          description: b.description,
          reputationBonus: b.reputationBonus,
          icon: b.iconName,
          tier: b.tier,
          proofHash: b.merkleProof
        }
      }));
    });
  }

  return {
    state: nextState,
    alreadyCheckedIn: false,
    repAwarded: totalAwarded,
    newBadgesUnlocked
  };
}
