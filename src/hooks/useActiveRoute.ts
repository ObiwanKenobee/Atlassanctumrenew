import { useMemo } from 'react';
import { PageView } from '../types';
import { 
  PrimaryNavigationItem, 
  NavigationLinkItem, 
  MegaMenuSection, 
  NavigationHeaderConfig, 
  ActiveRouteHierarchy, 
  UserPermissionLevel 
} from '../types/navigation';
import { NAVIGATION_CONFIG } from '../config/navigation';
import { hasPermission } from '../lib/navigationHelpers';
import { useAuth } from '../context/AuthContext';

export interface UseActiveRouteOptions {
  currentTab: PageView;
  config?: NavigationHeaderConfig;
  userRole?: string | null;
  isAuthenticated?: boolean;
}

export function useActiveRoute({
  currentTab,
  config = NAVIGATION_CONFIG,
  userRole,
  isAuthenticated
}: UseActiveRouteOptions) {
  // Pull from AuthContext if not explicitly overridden
  const auth = useAuth();
  const effectiveRole = userRole !== undefined ? userRole : auth.userProfile?.accessLevel;
  const effectiveIsAuth = isAuthenticated !== undefined ? isAuthenticated : !!auth.currentUser;

  // 1. Role-Based Access Control Filtering of the entire Navigation Tree
  const filteredNavigation = useMemo(() => {
    return config.primaryNavigation
      .filter(item => hasPermission(item.requiredPermission, effectiveRole, effectiveIsAuth))
      .map(item => {
        const filteredItem: PrimaryNavigationItem = { ...item };

        // Filter nested submenu items
        if (item.submenuItems) {
          filteredItem.submenuItems = item.submenuItems.filter(child => 
            hasPermission(child.requiredPermission, effectiveRole, effectiveIsAuth)
          );
        }

        // Filter mega menu sections & their child items
        if (item.megaMenuSections) {
          filteredItem.megaMenuSections = item.megaMenuSections
            .filter(section => hasPermission(section.requiredPermission, effectiveRole, effectiveIsAuth))
            .map(section => ({
              ...section,
              items: section.items.filter(child => 
                hasPermission(child.requiredPermission, effectiveRole, effectiveIsAuth)
              )
            }));
        }

        // Filter quick action links
        if (item.quickActionLinks) {
          filteredItem.quickActionLinks = item.quickActionLinks.filter(action =>
            hasPermission(action.requiredPermission, effectiveRole, effectiveIsAuth)
          );
        }

        // Filter highlight card
        if (item.megaMenuHighlight) {
          if (!hasPermission(item.megaMenuHighlight.requiredPermission, effectiveRole, effectiveIsAuth)) {
            filteredItem.megaMenuHighlight = undefined;
          }
        }

        return filteredItem;
      });
  }, [config.primaryNavigation, effectiveRole, effectiveIsAuth]);

  // 2. Active hierarchy and route detection
  const hierarchy = useMemo<ActiveRouteHierarchy>(() => {
    let primaryMatch: PrimaryNavigationItem | undefined;
    let sectionMatch: MegaMenuSection | undefined;
    let childMatch: NavigationLinkItem | undefined;
    const breadcrumbs: Array<{ id: string; label: string; targetTab?: PageView }> = [];

    for (const primary of filteredNavigation) {
      // Direct primary link match
      if (primary.targetTab === currentTab) {
        primaryMatch = primary;
        breadcrumbs.push({ id: primary.id, label: primary.label, targetTab: primary.targetTab });
        break;
      }

      // Check submenu items
      if (primary.submenuItems) {
        const found = primary.submenuItems.find(child => child.targetTab === currentTab);
        if (found) {
          primaryMatch = primary;
          childMatch = found;
          breadcrumbs.push({ id: primary.id, label: primary.label });
          breadcrumbs.push({ id: found.id, label: found.label, targetTab: found.targetTab });
          break;
        }
      }

      // Check mega menu sections
      if (primary.megaMenuSections) {
        let foundSection: MegaMenuSection | undefined;
        let foundChild: NavigationLinkItem | undefined;

        for (const section of primary.megaMenuSections) {
          const itemInSec = section.items.find(child => child.targetTab === currentTab);
          if (itemInSec) {
            foundSection = section;
            foundChild = itemInSec;
            break;
          }
        }

        if (foundChild) {
          primaryMatch = primary;
          sectionMatch = foundSection;
          childMatch = foundChild;
          breadcrumbs.push({ id: primary.id, label: primary.label });
          if (foundSection) {
            breadcrumbs.push({ id: foundSection.id, label: foundSection.title });
          }
          breadcrumbs.push({ id: foundChild.id, label: foundChild.label, targetTab: foundChild.targetTab });
          break;
        }
      }

      // Check highlight card
      if (primary.megaMenuHighlight?.targetTab === currentTab) {
        primaryMatch = primary;
        breadcrumbs.push({ id: primary.id, label: primary.label });
        breadcrumbs.push({ 
          id: primary.megaMenuHighlight.id, 
          label: primary.megaMenuHighlight.title,
          targetTab: primary.megaMenuHighlight.targetTab
        });
        break;
      }

      // Check quick action links
      if (primary.quickActionLinks) {
        const foundAction = primary.quickActionLinks.find(act => act.targetTab === currentTab);
        if (foundAction) {
          primaryMatch = primary;
          breadcrumbs.push({ id: primary.id, label: primary.label });
          breadcrumbs.push({ id: foundAction.id, label: foundAction.label, targetTab: foundAction.targetTab });
          break;
        }
      }
    }

    return {
      primaryItem: primaryMatch,
      activeSection: sectionMatch,
      activeChild: childMatch,
      breadcrumbs,
      hasActiveRoute: !!primaryMatch
    };
  }, [filteredNavigation, currentTab]);

  // 3. Helper predicates for fast styling
  const isPrimaryActive = (itemId: string): boolean => {
    return hierarchy.primaryItem?.id === itemId;
  };

  const isSectionActive = (sectionId: string): boolean => {
    return hierarchy.activeSection?.id === sectionId;
  };

  const isChildActive = (childId: string): boolean => {
    return hierarchy.activeChild?.id === childId;
  };

  /**
   * Generates type-safe active classes for desktop top-level navigation items
   */
  const getPrimaryButtonClasses = (itemId: string, isMenuOpen: boolean): string => {
    const isActive = isPrimaryActive(itemId);
    if (isActive || isMenuOpen) {
      return 'text-[#C5A059] font-bold border-b-2 border-[#C5A059] bg-[#F5F5F0]/5 shadow-[0_2px_10px_rgba(197,160,89,0.15)]';
    }
    return 'text-[#F5F5F0]/70 hover:text-[#F5F5F0] hover:bg-[#F5F5F0]/5 border-b-2 border-transparent';
  };

  return {
    filteredNavigation,
    hierarchy,
    activePrimaryId: hierarchy.primaryItem?.id,
    activeSectionId: hierarchy.activeSection?.id,
    activeChildId: hierarchy.activeChild?.id,
    breadcrumbs: hierarchy.breadcrumbs,
    hasActiveRoute: hierarchy.hasActiveRoute,
    isPrimaryActive,
    isSectionActive,
    isChildActive,
    getPrimaryButtonClasses
  };
}
