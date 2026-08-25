import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  Sparkles, 
  Activity, 
  Bell, 
  Search, 
  ChevronDown, 
  Scale,
  Compass
} from 'lucide-react';
import { PageView } from '../types';
import { PrimaryNavigationItem, BadgeColorVariant } from '../types/navigation';
import { NAVIGATION_CONFIG } from '../config/navigation';
import { 
  trackNavigationEvent, 
  getNavLabel 
} from '../lib/navigationHelpers';
import { useActiveRoute } from '../hooks/useActiveRoute';
import { MegaMenuDropdown } from './navigation/MegaMenuDropdown';
import { NestedSubmenuDropdown } from './navigation/NestedSubmenuDropdown';
import { MobileNavigationDrawer } from './navigation/MobileNavigationDrawer';
import { UserSettingsDropdown } from './UserSettingsDropdown';
import { useMissionAlerts } from '../context/MissionAlertContext';
import { useAuth } from '../context/AuthContext';
import { UncertaintyOverlayToggle } from '../context/UncertaintyOverlayContext';
import { audioFeedback } from '../lib/audioFeedback';
import { prefetchView } from '../lib/viewPrefetch';

interface NavigationProps {
  currentTab: PageView;
  onSelectTab: (tab: PageView) => void;
  onOpenCommandCenter: () => void;
  onOpenMoralSimulator: () => void;
  onOpenCommandments?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenCommandCenter,
  onOpenMoralSimulator,
  onOpenCommandments
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const { unreadCount, setIsDrawerOpen } = useMissionAlerts();
  const { userProfile, currentUser } = useAuth();

  // Active route detection and permission filtering hook with AuthContext integration
  const { 
    filteredNavigation, 
    hierarchy, 
    isPrimaryActive,
    getPrimaryButtonClasses
  } = useActiveRoute({
    currentTab,
    config: NAVIGATION_CONFIG,
    userRole: userProfile?.accessLevel,
    isAuthenticated: !!currentUser
  });

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenuId(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mega menu when route/tab changes
  useEffect(() => {
    setActiveMenuId(null);
  }, [currentTab]);

  const handlePrimaryItemClick = (item: PrimaryNavigationItem) => {
    trackNavigationEvent(item.analytics, item.label);

    if (item.type === 'link' && item.targetTab) {
      onSelectTab(item.targetTab);
      setActiveMenuId(null);
    } else if (item.type === 'mega_menu' || item.type === 'nested_submenu') {
      setActiveMenuId((prev) => (prev === item.id ? null : item.id));
    } else if (item.type === 'external_link' && item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      setActiveMenuId(null);
    }
  };

  const getBadgeClass = (variant: BadgeColorVariant) => {
    switch (variant) {
      case 'emerald':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'gold':
        return 'bg-[#1B3022] text-[#C5A059] border-[#C5A059]/40';
      case 'amber':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'rose':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
      case 'blue':
        return 'bg-blue-950/80 text-[#8FB8DE] border-[#8FB8DE]/40';
      case 'purple':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
      default:
        return 'bg-[#1A1A1A] text-[#F5F5F0]/80 border-[#F5F5F0]/20';
    }
  };

  return (
    <header 
      ref={headerRef}
      className="sticky top-0 z-40 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#F5F5F0]/10 text-[#F5F5F0]"
    >
      {/* Planetary Ticker Bar */}
      <div className="w-full bg-[#080808] border-b border-[#F5F5F0]/10 px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#F5F5F0]/60 font-mono overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:none [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <span className="flex items-center gap-1.5 sm:gap-2 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
            <span className="truncate">{NAVIGATION_CONFIG.systemStatusText}</span>
          </span>
          {NAVIGATION_CONFIG.tickerMetrics.map((metric) => (
            <React.Fragment key={metric.id}>
              <span className="text-[#F5F5F0]/20">•</span>
              <span className="hidden sm:inline">
                {metric.value} <span className="opacity-60">{metric.label}</span>
              </span>
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0 pl-3">
          {onOpenCommandments && (
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                onOpenCommandments();
              }}
              className="text-[#C5A059] hover:underline font-semibold text-[9px] sm:text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Scale className="w-3 h-3 text-[#C5A059]" />
              <span>10 Commandments</span>
            </button>
          )}
          <span className="hidden xs:inline text-[#F5F5F0]/20">•</span>
          <button 
            onClick={() => {
              audioFeedback.playSubtleClick();
              onOpenMoralSimulator();
            }}
            className="text-[#F5F5F0]/70 hover:text-[#C5A059] underline tracking-wider cursor-pointer transition-colors text-[9px] sm:text-[10px] font-mono"
          >
            Moral Simulator
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">
        {/* Brand */}
        <div 
          onClick={() => {
            onSelectTab('home');
            setActiveMenuId(null);
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-w-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#C5A059] flex items-center justify-center bg-[#0D0D0D] transition-transform group-hover:scale-105 shrink-0">
            <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#C5A059] rounded-full shadow-[0_0_8px_#C5A059]"></div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-[0.14em] sm:tracking-[0.18em] text-xs sm:text-sm md:text-base uppercase text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors truncate font-serif">
                ATLAS SANCTUM
              </span>
              <span className="hidden sm:inline-block text-[8px] sm:text-[9px] uppercase font-mono px-1.5 py-0.2 bg-[#1B3022] text-[#C5A059] rounded-full border border-[#C5A059]/40 tracking-wider shrink-0 font-bold">
                {NAVIGATION_CONFIG.version}
              </span>
            </div>
            <p className="hidden md:block text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#F5F5F0]/40 font-medium truncate">
              Regenerative Intelligence Platform
            </p>
          </div>
        </div>

        {/* Configuration-Driven Desktop Primary Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {filteredNavigation.map((item) => {
            const ItemIcon = item.icon;
            const isActive = isPrimaryActive(item.id);
            const isMenuOpen = activeMenuId === item.id;
            const hasSubmenu = item.type === 'mega_menu' || item.type === 'nested_submenu';

            return (
              <div 
                key={item.id} 
                className="relative"
                onMouseEnter={() => {
                  if (item.targetTab) {
                    prefetchView(item.targetTab as any);
                  }
                  if (hasSubmenu) {
                    setActiveMenuId(item.id);
                  }
                }}
              >
                <button
                  id={`nav-${item.id}`}
                  onClick={() => handlePrimaryItemClick(item)}
                  aria-expanded={isMenuOpen}
                  aria-haspopup={hasSubmenu ? 'true' : undefined}
                  className={`px-2 xl:px-2.5 py-2 rounded-sm text-[11px] uppercase tracking-[0.14em] font-mono flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${getPrimaryButtonClasses(item.id, isMenuOpen)}`}
                >
                  {ItemIcon && (
                    <ItemIcon className={`w-3.5 h-3.5 ${isActive || isMenuOpen ? 'text-[#C5A059]' : 'opacity-70'}`} />
                  )}
                  <span>{getNavLabel(item.labelKey, item.label)}</span>
                  
                  {item.badge && (
                    <span className={`text-[8px] font-mono uppercase px-1 py-0.2 rounded border ${getBadgeClass(item.badge.variant)} ${item.badge.pulse ? 'animate-pulse' : ''}`}>
                      {item.badge.text}
                    </span>
                  )}

                  {isActive && !isMenuOpen && item.type !== 'link' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shadow-[0_0_6px_#C5A059] animate-pulse ml-0.5" title="Active Section" />
                  )}

                  {hasSubmenu && (
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isMenuOpen ? 'rotate-180 text-[#C5A059]' : 'opacity-50'}`} />
                  )}
                </button>

                {/* Submenu Dropdown */}
                {isMenuOpen && item.type === 'nested_submenu' && (
                  <NestedSubmenuDropdown
                    item={item}
                    currentTab={currentTab}
                    onSelectTab={(tab) => {
                      onSelectTab(tab);
                      setActiveMenuId(null);
                    }}
                    onClose={() => setActiveMenuId(null)}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Action Controls & Quick Triggers */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mission Alert Stream Bell */}
          <button
            id="mission-alert-bell-btn"
            onClick={() => {
              audioFeedback.playSubtleClick();
              setIsDrawerOpen(true);
            }}
            aria-label="Open Mission Alerts"
            title="Real-time Mission Alerts & Proofs"
            className="relative p-1.5 sm:p-2 min-h-[36px] sm:min-h-[38px] min-w-[36px] sm:min-w-[38px] flex items-center justify-center rounded-full border border-[#C5A059]/40 hover:border-[#C5A059] bg-[#0D0D0D] text-[#C5A059] hover:bg-[#1B3022] transition-all cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center font-mono shadow-[0_0_8px_#F43F5E] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Live Voice AI Trigger */}
          <button
            id="open-live-voice-btn"
            onClick={() => {
              audioFeedback.playSubtleClick();
              const event = new CustomEvent('open-live-voice');
              window.dispatchEvent(event);
            }}
            aria-label="Open Live Voice AI"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 min-h-[36px] sm:min-h-[38px] border border-[#1B3022] hover:border-emerald-400 bg-[#1B3022]/40 rounded-full text-[10px] uppercase tracking-wider text-emerald-400 hover:bg-emerald-950/50 transition-all font-mono font-bold cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden 2xl:inline">Live Voice</span>
          </button>

          {/* AI Chatbot Trigger */}
          <button
            id="open-gemini-chat-btn"
            onClick={() => {
              audioFeedback.playSubtleClick();
              const event = new CustomEvent('open-gemini-chat');
              window.dispatchEvent(event);
            }}
            aria-label="Open Gemini Chatbot"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 min-h-[36px] sm:min-h-[38px] border border-[#C5A059]/40 hover:border-[#C5A059] bg-[#0D0D0D] rounded-full text-[10px] uppercase tracking-wider text-[#C5A059] hover:bg-[#1B3022] transition-all font-mono font-bold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden 2xl:inline">AI Chat</span>
          </button>

          {/* Epistemic Search Trigger Button (/) */}
          <button
            id="open-epistemic-search-btn"
            onClick={() => {
              audioFeedback.playSubtleClick();
              const event = new CustomEvent('open-global-search');
              window.dispatchEvent(event);
            }}
            aria-label="Open Epistemic Search (/)"
            title="Search all views, ledgers, and documentation (/)"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 min-h-[36px] sm:min-h-[38px] rounded-full bg-[#121212] hover:bg-[#1C1C1C] border border-[#F5F5F0]/15 hover:border-[#C5A059]/50 transition-all text-xs font-mono text-[#F5F5F0]/70 hover:text-[#F5F5F0] cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[10px] text-[#F5F5F0]/60 hidden lg:inline">Search</span>
            <kbd className="px-1.5 py-0.2 text-[9px] bg-[#0A0A0A] border border-[#F5F5F0]/20 rounded text-[#C5A059] font-mono">
              /
            </kbd>
          </button>

          {/* Command Center Trigger Button (⌘K) */}
          <button
            id="open-command-center-btn"
            onClick={() => {
              audioFeedback.playSubtleClick();
              onOpenCommandCenter();
            }}
            aria-label="Open Command Center (⌘K)"
            title="Search and jump to any module (⌘K)"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 min-h-[36px] sm:min-h-[38px] rounded-full bg-[#121212] hover:bg-[#1C1C1C] border border-[#F5F5F0]/15 hover:border-[#C5A059]/50 transition-all text-xs font-mono text-[#F5F5F0]/70 hover:text-[#F5F5F0] cursor-pointer"
          >
            <kbd className="px-1.5 py-0.2 text-[9px] bg-[#0A0A0A] border border-[#F5F5F0]/20 rounded text-[#C5A059] font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Uncertainty Overlay Global Toggle */}
          <div className="hidden 2xl:block">
            <UncertaintyOverlayToggle />
          </div>

          {/* User Profile & Firestore Settings Synchronizer */}
          <UserSettingsDropdown />

          {/* Mobile & Tablet Menu Toggle Button (visible below xl) */}
          <button
            id="mobile-menu-toggle"
            onClick={() => {
              audioFeedback.playSubtleClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="xl:hidden p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-sm bg-[#141414] border border-[#F5F5F0]/10 text-[#F5F5F0] hover:text-[#C5A059] hover:border-[#C5A059]/40 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Full-Width Mega Menu Dropdown */}
      {activeMenuId && (
        (() => {
          const activeItem = filteredNavigation.find((i) => i.id === activeMenuId);
          if (activeItem && activeItem.type === 'mega_menu') {
            return (
              <MegaMenuDropdown
                item={activeItem}
                currentTab={currentTab}
                onSelectTab={(tab) => {
                  onSelectTab(tab);
                  setActiveMenuId(null);
                }}
                onClose={() => setActiveMenuId(null)}
              />
            );
          }
          return null;
        })()
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <MobileNavigationDrawer
          items={filteredNavigation}
          currentTab={currentTab}
          onSelectTab={(tab) => {
            onSelectTab(tab);
            setMobileMenuOpen(false);
          }}
          onClose={() => setMobileMenuOpen(false)}
          onOpenCommandCenter={onOpenCommandCenter}
          onOpenMoralSimulator={onOpenMoralSimulator}
          onOpenCommandments={onOpenCommandments}
        />
      )}
    </header>
  );
};
