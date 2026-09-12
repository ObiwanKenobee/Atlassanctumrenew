/**
 * IN-APP ACHIEVEMENT MILESTONES SERVICE
 * Celebrates user milestones (e.g., '100th Alert Reviewed', 'Top 10% Local Contributor',
 * '7-Day Stewardship Streak Master', 'First Verified Field Audit') to drive consistent
 * engagement with the platform's core regenerative mission.
 */

import { audioFeedback } from '../lib/audioFeedback';
import { db } from '../lib/db';

export interface AchievementMilestone {
  id: string;
  title: string;
  shortLabel: string;
  category: 'hazards' | 'stewardship' | 'community' | 'forensics' | 'hydrology';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'mythic';
  description: string;
  reputationBonus: number;
  iconName: string;
  metricTarget: number;
  currentProgress: number;
  unit: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  proofHash?: string;
}

export const INITIAL_ACHIEVEMENTS: AchievementMilestone[] = [
  {
    id: 'ach-100th-alert',
    title: 'Centurion Sentinel (100th Alert Reviewed)',
    shortLabel: '100th Alert Reviewed',
    category: 'hazards',
    tier: 'gold',
    description: 'Systematically reviewed and triaged 100 orbital satellite environmental alerts across transboundary biomes.',
    reputationBonus: 500,
    iconName: 'ShieldAlert',
    metricTarget: 100,
    currentProgress: 98,
    unit: 'alerts reviewed',
    isUnlocked: false
  },
  {
    id: 'ach-top-contributor',
    title: 'Top 10% Local Contributor',
    shortLabel: 'Top 10% Contributor',
    category: 'community',
    tier: 'platinum',
    description: 'Ranked in the top decile of verified bioregional ground-truth contributors across the Great Rift & Mara basins.',
    reputationBonus: 850,
    iconName: 'Award',
    metricTarget: 100,
    currentProgress: 100,
    unit: '% percentile',
    isUnlocked: true,
    unlockedAt: '2026-09-09T14:20:00Z',
    proofHash: '0x49f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9'
  },
  {
    id: 'ach-7day-streak',
    title: '7-Day Stewardship Streak Master',
    shortLabel: '7-Day Streak Master',
    category: 'stewardship',
    tier: 'gold',
    description: 'Maintained uninterrupted daily monitoring of regional water towers, peatland domes, and wildfire vectors for 7 days.',
    reputationBonus: 400,
    iconName: 'Flame',
    metricTarget: 7,
    currentProgress: 5,
    unit: 'consecutive days',
    isUnlocked: false
  },
  {
    id: 'ach-first-audit',
    title: 'First Verified Field Audit',
    shortLabel: 'First Verified Audit',
    category: 'forensics',
    tier: 'silver',
    description: 'Signed and anchored a cryptographic ground-truth verification audit into the Immutable Evidence Ledger.',
    reputationBonus: 250,
    iconName: 'FileCheck2',
    metricTarget: 1,
    currentProgress: 1,
    unit: 'audits signed',
    isUnlocked: true,
    unlockedAt: '2026-08-28T09:12:00Z',
    proofHash: '0x12bb9930fe4568fa0184b239c0919455a1b2c3d4'
  },
  {
    id: 'ach-aquifer-guardian',
    title: 'Aquifer Infiltration Guardian',
    shortLabel: 'Aquifer Guardian',
    category: 'hydrology',
    tier: 'gold',
    description: 'Corroborated 1 Billion+ Liters of verified groundwater recharge across deep pastoralist catchment basins.',
    reputationBonus: 600,
    iconName: 'Droplets',
    metricTarget: 1000, // in Megaliters
    currentProgress: 1840,
    unit: 'ML recharge',
    isUnlocked: true,
    unlockedAt: '2026-09-02T16:45:00Z',
    proofHash: '0x88aa7740ce4568fa0184b239c0919499e1f2a3b4'
  },
  {
    id: 'ach-community-story',
    title: 'Community Voice Catalyst',
    shortLabel: 'Community Voice',
    category: 'community',
    tier: 'silver',
    description: 'Published a peer-reviewed verified bioregional stewardship report to the Community Impact Social Feed.',
    reputationBonus: 300,
    iconName: 'MessageSquareShare',
    metricTarget: 1,
    currentProgress: 0,
    unit: 'verified reports',
    isUnlocked: false
  }
];

const STORAGE_KEY = 'atlas_achievement_milestones_state';

// Load all achievements
export function loadAchievements(): AchievementMilestone[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load achievements from storage:', e);
  }
  saveAchievements(INITIAL_ACHIEVEMENTS);
  return INITIAL_ACHIEVEMENTS;
}

// Save achievements
export function saveAchievements(achievements: AchievementMilestone[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
    window.dispatchEvent(new CustomEvent('atlas-achievements-synced', { detail: achievements }));
  } catch (e) {
    console.warn('Failed to save achievements:', e);
  }
}

// Track Progress or Unlock Achievement
export function advanceAchievementProgress(
  achievementId: string, 
  incrementAmount: number = 1
): { unlocked: boolean; milestone?: AchievementMilestone } {
  const current = loadAchievements();
  let newlyUnlockedMilestone: AchievementMilestone | undefined;

  const updated = current.map(item => {
    if (item.id === achievementId) {
      const newProgress = item.currentProgress + incrementAmount;
      const shouldUnlock = !item.isUnlocked && newProgress >= item.metricTarget;

      if (shouldUnlock) {
        newlyUnlockedMilestone = {
          ...item,
          currentProgress: Math.min(newProgress, item.metricTarget),
          isUnlocked: true,
          unlockedAt: new Date().toISOString(),
          proofHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`
        };
        return newlyUnlockedMilestone;
      }

      return {
        ...item,
        currentProgress: Math.min(newProgress, item.metricTarget)
      };
    }
    return item;
  });

  saveAchievements(updated);

  if (newlyUnlockedMilestone) {
    // Dispatch celebration event
    window.dispatchEvent(new CustomEvent('atlas-achievement-unlocked', {
      detail: newlyUnlockedMilestone
    }));

    // Play celebration audio
    audioFeedback.playSuccessChime();

    // Reward reputation points to citizen profile
    try {
      const rawProfile = localStorage.getItem('atlas_citizen_profile_state');
      if (rawProfile) {
        const profile = JSON.parse(rawProfile);
        profile.reputationPoints = (profile.reputationPoints || 1420) + newlyUnlockedMilestone.reputationBonus;
        localStorage.setItem('atlas_citizen_profile_state', JSON.stringify(profile));
      }
    } catch {}

    // Audit log
    try {
      db.audit.logInteraction({
        action: `Achievement Unlocked: "${newlyUnlockedMilestone.title}"`,
        feature: 'epistemic_achievements',
        impactTier: 'high',
        moralAlignmentScore: 100,
        parameters: {
          achievementId: newlyUnlockedMilestone.id,
          reputationBonus: newlyUnlockedMilestone.reputationBonus,
          tier: newlyUnlockedMilestone.tier
        },
        ethicalNotes: `User achieved milestone: ${newlyUnlockedMilestone.description}`
      }).catch(() => {});
    } catch {}

    return { unlocked: true, milestone: newlyUnlockedMilestone };
  }

  return { unlocked: false };
}
