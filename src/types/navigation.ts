import { ComponentType } from 'react';
import { PageView } from '../types';

export type NavigationItemType = 
  | 'link' 
  | 'nested_submenu' 
  | 'mega_menu' 
  | 'external_link' 
  | 'cta_button' 
  | 'divider';

export type UserPermissionLevel = 
  | 'public' 
  | 'authenticated' 
  | 'researcher' 
  | 'steward' 
  | 'elder' 
  | 'admin';

export type BadgeColorVariant = 'gold' | 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';

export interface NavigationBadge {
  text: string;
  variant: BadgeColorVariant;
  pulse?: boolean;
}

export interface NavigationAnalyticsPayload {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export interface QuickActionLink {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  targetTab?: PageView;
  href?: string;
  isExternal?: boolean;
  actionType?: 'tab' | 'custom_event' | 'callback';
  customEventName?: string;
  badge?: NavigationBadge;
  requiredPermission?: UserPermissionLevel;
}

export interface NavigationLinkItem {
  id: string;
  label: string;
  labelKey?: string; // Localization key
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  targetTab?: PageView;
  href?: string;
  isExternal?: boolean;
  requiredPermission?: UserPermissionLevel;
  badge?: NavigationBadge;
  shortcut?: string;
  analytics?: NavigationAnalyticsPayload;
}

export interface MegaMenuSection {
  id: string;
  title: string;
  titleKey?: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  featured?: boolean;
  requiredPermission?: UserPermissionLevel;
  items: NavigationLinkItem[];
}

export interface MegaMenuHighlight {
  id: string;
  title: string;
  titleKey?: string;
  description: string;
  descriptionKey?: string;
  badge?: NavigationBadge;
  actionText: string;
  actionTextKey?: string;
  targetTab?: PageView;
  href?: string;
  isExternal?: boolean;
  requiredPermission?: UserPermissionLevel;
  metric?: {
    label: string;
    value: string;
    trend?: string;
  };
}

export interface PrimaryNavigationItem {
  id: string;
  label: string;
  labelKey?: string;
  type: NavigationItemType;
  icon?: ComponentType<{ className?: string }>;
  targetTab?: PageView;
  href?: string;
  isExternal?: boolean;
  requiredPermission?: UserPermissionLevel;
  badge?: NavigationBadge;
  analytics?: NavigationAnalyticsPayload;
  
  // For 'nested_submenu'
  submenuItems?: NavigationLinkItem[];
  
  // For 'mega_menu'
  megaMenuSections?: MegaMenuSection[];
  megaMenuHighlight?: MegaMenuHighlight;
  quickActionLinks?: QuickActionLink[];
  
  // For 'cta_button'
  ctaVariant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost';
  ctaActionId?: string; // e.g. 'open-command-center', 'open-live-voice', etc.
}

export interface NavigationHeaderConfig {
  version: string;
  systemStatusText: string;
  tickerMetrics: Array<{
    id: string;
    label: string;
    value: string;
    isLive?: boolean;
    color?: string;
  }>;
  primaryNavigation: PrimaryNavigationItem[];
  quickActions: Array<{
    id: string;
    label: string;
    tooltip: string;
    icon: ComponentType<{ className?: string }>;
    actionType: 'tab' | 'custom_event' | 'callback' | 'external';
    target?: string;
    badgeCount?: number;
    badgePulse?: boolean;
    buttonStyle?: string;
    showOnMobile?: boolean;
    requiredPermission?: UserPermissionLevel;
  }>;
}

export interface ActiveRouteHierarchy {
  primaryItem?: PrimaryNavigationItem;
  activeSection?: MegaMenuSection;
  activeChild?: NavigationLinkItem;
  breadcrumbs: Array<{ id: string; label: string; targetTab?: PageView }>;
  hasActiveRoute: boolean;
}
