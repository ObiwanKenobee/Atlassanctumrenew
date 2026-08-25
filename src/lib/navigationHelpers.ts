import { 
  PrimaryNavigationItem, 
  NavigationLinkItem, 
  UserPermissionLevel, 
  NavigationAnalyticsPayload 
} from '../types/navigation';
import { PageView } from '../types';
import { audioFeedback } from './audioFeedback';

/**
 * Localization dictionary supporting extensible multilingual key lookups
 */
export const NAVIGATION_LOCALES: Record<string, Record<string, string>> = {
  en: {
    'nav.observatory': 'Civilization Observatory',
    'nav.observatory.desc': 'Real-time telemetry, causal twins, and planetary sensors',
    'nav.governance': 'Moral Governance',
    'nav.governance.desc': 'Constitutional axioms, ethics reviews, and Priority Floors',
    'nav.coordination': 'Capital & Coordination',
    'nav.coordination.desc': 'Project OS, capital allocation, and field labs',
    'nav.developers': 'Developers & SDK',
    'nav.developers.desc': 'Atlas Governance SDK, APIs, and open models',
    'nav.about': 'About & Philosophy',
    'nav.about.desc': 'Axiomatic foundations, research papers, and charters',
    'nav.commandments': '10 Commandments',
    'nav.simulator': 'Moral Simulator',
    'nav.command_center': 'Command Center (⌘K)',
    'nav.live_voice': 'Live Voice AI',
    'nav.chat': 'AI Chat',
  }
};

/**
 * Translates a key with fallback to original text
 */
export function getNavLabel(key?: string, fallback: string = '', lang: string = 'en'): string {
  if (!key) return fallback;
  return NAVIGATION_LOCALES[lang]?.[key] || fallback;
}

/**
 * Check if the active route matches the item or any of its nested children
 */
export function isNavigationItemActive(
  item: PrimaryNavigationItem, 
  currentTab: PageView
): boolean {
  if (item.targetTab === currentTab) return true;

  if (item.submenuItems) {
    if (item.submenuItems.some((child) => child.targetTab === currentTab)) {
      return true;
    }
  }

  if (item.megaMenuSections) {
    for (const section of item.megaMenuSections) {
      if (section.items.some((child) => child.targetTab === currentTab)) {
        return true;
      }
    }
  }

  if (item.megaMenuHighlight?.targetTab === currentTab) {
    return true;
  }

  return false;
}

/**
 * Permission checker based on user role
 */
export function hasPermission(
  requiredPermission?: UserPermissionLevel,
  userRole?: string | null,
  isAuthenticated: boolean = false
): boolean {
  if (!requiredPermission || requiredPermission === 'public') {
    return true;
  }

  if (requiredPermission === 'authenticated') {
    return isAuthenticated;
  }

  if (!isAuthenticated || !userRole) {
    return false;
  }

  const roleHierarchy: Record<string, number> = {
    public: 0,
    researcher: 1,
    steward: 2,
    elder: 3,
    admin: 4,
  };

  const userLevel = roleHierarchy[userRole.toLowerCase()] || 1;
  const reqLevel = roleHierarchy[requiredPermission] || 0;

  return userLevel >= reqLevel;
}

/**
 * Dispatches analytics event for navigation item click
 */
export function trackNavigationEvent(
  analytics?: NavigationAnalyticsPayload,
  itemLabel?: string
): void {
  const payload = analytics || {
    category: 'Navigation',
    action: 'click_menu_item',
    label: itemLabel || 'unlabeled_item'
  };

  // Custom DOM event for platform telemetry
  const event = new CustomEvent('atlas_navigation_event', { detail: payload });
  window.dispatchEvent(event);

  // Audio feedback
  audioFeedback.playSubtleClick();
}
