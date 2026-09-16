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
  Moon, 
  Sun, 
  Contrast, 
  Monitor,
  Mic,
  Trophy,
  Droplets,
  Shield,
  Radio,
  Cpu,
  GitBranch,
  Globe2,
  Compass,
  Leaf,
  Layers
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
import { ContextualNotificationHeader } from './navigation/ContextualNotificationHeader';
import { CivilizationOSLogicFlowModal } from './CivilizationOSLogicFlowModal';
import { useMissionAlerts } from '../context/MissionAlertContext';
import { useAuth } from '../context/AuthContext';
import { UncertaintyOverlayToggle } from '../context/UncertaintyOverlayContext';
import { OfflineModeToggle } from './navigation/OfflineModeToggle';
import { SystemVitalityMonitor } from './navigation/SystemVitalityMonitor';
import { SystemPulseIcon } from './diagnostics/SystemPulseIcon';
import { BioregionalHazardBeacon } from './navigation/BioregionalHazardBeacon';
import { HeaderHazardAlertBanner } from './navigation/HeaderHazardAlertBanner';
import { MoralAlignmentHUD } from './MoralAlignmentHUD';
import { AcousticCommandToggle } from './navigation/AcousticCommandToggle';
import { ResilienceModeToggle } from './navigation/ResilienceModeToggle';
import { SyncHealthIndicator } from './navigation/SyncHealthIndicator';
import { audioFeedback, hapticFeedback } from '../lib/audioFeedback';
import { prefetchView } from '../lib/viewPrefetch';

interface NavigationProps {
  currentTab: PageView;
  onSelectTab: (tab: PageView) => void;
  onOpenCommandCenter: () => void;
  onOpenMoralSimulator: () => void;
  onOpenCommandments?: () => void;
  onOpenStarMap?: () => void;
  onOpenOracle?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenCommandCenter,
  onOpenMoralSimulator,
  onOpenCommandments,
  onOpenStarMap,
  onOpenOracle
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [innovationsDropdownOpen, setInnovationsDropdownOpen] = useState(false);
  const [isLogicFlowOpen, setIsLogicFlowOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { unreadCount, setIsDrawerOpen } = useMissionAlerts();
  const { userProfile, currentUser, updatePlatformSettings } = useAuth();

  useEffect(() => {
    const handleOpenFlow = () => setIsLogicFlowOpen(true);
    window.addEventListener('open-civilization-logic-flow', handleOpenFlow);
    return () => window.removeEventListener('open-civilization-logic-flow', handleOpenFlow);
  }, []);

  // Theme preference state ('dark' | 'light' | 'system' | 'context_aware') persisted to localStorage
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light' | 'system' | 'context_aware'>(() => {
    const saved = localStorage.getItem('atlas_theme_mode');
    return (saved === 'dark' || saved === 'light' || saved === 'system' || saved === 'context_aware') ? saved : 'dark';
  });

  useEffect(() => {
    const handleSyncTheme = (e: any) => {
      if (e.detail?.theme) {
        setCurrentTheme(e.detail.theme);
      }
    };
    window.addEventListener('atlas-theme-changed' as any, handleSyncTheme);
    return () => window.removeEventListener('atlas-theme-changed' as any, handleSyncTheme);
  }, []);

  // Handle window resize cleanly to close mobile drawer when maximized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const handleToggleTheme = () => {
    audioFeedback.playSubtleClick();
    let nextTheme: 'dark' | 'light' | 'system' | 'context_aware';
    if (currentTheme === 'dark') nextTheme = 'light';
    else if (currentTheme === 'light') nextTheme = 'system';
    else if (currentTheme === 'system') nextTheme = 'context_aware';
    else nextTheme = 'dark';

    setCurrentTheme(nextTheme);
    localStorage.setItem('atlas_theme_mode', nextTheme);
    window.dispatchEvent(new CustomEvent('atlas-theme-changed', { detail: { theme: nextTheme } }));

    if (userProfile && updatePlatformSettings) {
      updatePlatformSettings({ themePreference: nextTheme });
    }
  };

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
        setInnovationsDropdownOpen(false);
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
        setInnovationsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mega menu when route/tab changes
  useEffect(() => {
    setActiveMenuId(null);
    setInnovationsDropdownOpen(false);
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
      className="sticky top-0 z-40 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#F5F5F0]/10 text-[#F5F5F0] select-none transition-all"
    >
      {/* Real-time Bioregional Hazard Alert Pushed Directly to Main Header */}
      <HeaderHazardAlertBanner onSelectTab={onSelectTab} />

      {/* Contextual Community Updates & Mission Changes Banner (Requires Confirmation to Clear) */}
      <ContextualNotificationHeader onSelectTab={onSelectTab} />

      {/* Planetary Ticker Bar with Dynamic Responsive Spacing */}
      <div 
        className="w-full bg-[#080808] border-b border-[#F5F5F0]/10 py-1 sm:py-1.5 flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.16em] text-[#F5F5F0]/60 font-mono overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:none [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ paddingLeft: 'clamp(0.5rem, 2vw, 2rem)', paddingRight: 'clamp(0.5rem, 2vw, 2rem)' }}
      >
        <div className="flex items-center gap-[clamp(0.5rem,1.2vw,1rem)] shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
            <span className="truncate max-w-[140px] xs:max-w-[200px] sm:max-w-none">{NAVIGATION_CONFIG.systemStatusText}</span>
          </span>
          {NAVIGATION_CONFIG.tickerMetrics.map((metric) => (
            <React.Fragment key={metric.id}>
              <span className="text-[#F5F5F0]/20 hidden xs:inline">•</span>
              <span className="hidden xs:inline">
                {metric.value} <span className="opacity-60">{metric.label}</span>
              </span>
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-[clamp(0.5rem,1.2vw,1rem)] shrink-0 pl-2 sm:pl-3">
          <button
            id="nav-platform-tour-trigger"
            onClick={() => {
              audioFeedback.playSubtleClick();
              hapticFeedback.triggerLightClickHaptic();
              window.dispatchEvent(new CustomEvent('open-platform-tour'));
              window.dispatchEvent(new CustomEvent('start-interactive-walkthrough'));
            }}
            className="text-[#C5A059] hover:underline font-semibold text-[8px] sm:text-[9px] md:text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
            title="Start Interactive Platform Tour"
          >
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#C5A059]" />
            <span className="hidden xs:inline">Platform Tour</span>
          </button>
          <span className="text-[#F5F5F0]/20 hidden sm:inline">•</span>
          {onOpenCommandments && (
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                onOpenCommandments();
              }}
              className="hidden sm:flex text-[#C5A059] hover:underline font-semibold text-[8px] sm:text-[9px] md:text-[10px] items-center gap-1 cursor-pointer transition-colors"
            >
              <Scale className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#C5A059]" />
              <span>10 Commandments</span>
            </button>
          )}
          <span className="text-[#F5F5F0]/20 hidden sm:inline">•</span>
          <button 
            onClick={() => {
              audioFeedback.playSubtleClick();
              onOpenMoralSimulator();
            }}
            className="text-[#F5F5F0]/70 hover:text-[#C5A059] underline tracking-wider cursor-pointer transition-colors text-[8px] sm:text-[9px] md:text-[10px] font-mono"
          >
            Moral Simulator
          </button>
          <span className="text-[#F5F5F0]/20 hidden md:inline">•</span>
          <button 
            onClick={() => {
              audioFeedback.playSubtleClick();
              setIsLogicFlowOpen(true);
            }}
            className="hidden md:flex text-[#C5A059] hover:text-amber-200 items-center gap-1 cursor-pointer transition-colors text-[8px] sm:text-[9px] md:text-[10px] font-mono font-medium"
            title="Inspect Civilization OS Logic Flow Infographic"
          >
            <Layers className="w-2.5 h-2.5 text-[#C5A059]" />
            <span>Logic Flow</span>
          </button>
          <span className="text-[#F5F5F0]/20 hidden md:inline">•</span>
          <button 
            onClick={() => {
              audioFeedback.playSubtleClick();
              window.dispatchEvent(new CustomEvent('open-google-sitelinks-enhancement'));
            }}
            className="hidden md:flex text-emerald-400 hover:text-emerald-300 items-center gap-1 cursor-pointer transition-colors text-[8px] sm:text-[9px] md:text-[10px] font-mono font-medium"
            title="Preview Google Search Results Sitelinks & Search Enhancement"
          >
            <Globe2 className="w-2.5 h-2.5 text-emerald-400" />
            <span>Google Sitelinks</span>
          </button>
          <span className="text-[#F5F5F0]/20 hidden lg:inline">•</span>
          <button 
            onClick={() => {
              audioFeedback.playSubtleClick();
              onSelectTab('economics-pricing');
            }}
            className="hidden lg:flex text-[#C5A059] hover:text-amber-200 items-center gap-1 cursor-pointer transition-colors text-[8px] sm:text-[9px] md:text-[10px] font-mono font-medium"
            title="Economics, Pricing Tiers & Capacity Access"
          >
            <Sparkles className="w-2.5 h-2.5 text-[#C5A059]" />
            <span>Pricing & Tiers</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar with Responsive Relative Units & Fluid Container */}
      <div 
        className="w-full max-w-[1720px] mx-auto min-h-[3.75rem] sm:min-h-[4.25rem] px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 lg:gap-6 flex-nowrap"
      >
        {/* Brand Logo & Name */}
        <div 
          id="nav-brand-logo"
          onClick={() => {
            onSelectTab('home');
            setActiveMenuId(null);
            setInnovationsDropdownOpen(false);
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#C5A059] flex items-center justify-center bg-[#0D0D0D] transition-transform group-hover:scale-105 shrink-0 shadow-[0_0_12px_rgba(197,160,89,0.2)]">
            <div className="w-2.5 h-2.5 bg-[#C5A059] rounded-full shadow-[0_0_8px_#C5A059]"></div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-[0.1em] sm:tracking-[0.14em] text-sm sm:text-base uppercase text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors truncate font-serif">
                ATLAS SANCTUM
              </span>
              <span className="hidden sm:inline-block text-[9px] uppercase font-mono px-1.5 py-0.5 bg-[#1B3022] text-[#C5A059] rounded-full border border-[#C5A059]/40 tracking-wider shrink-0 font-bold">
                {NAVIGATION_CONFIG.version}
              </span>
            </div>
            <p className="hidden md:block text-[9px] uppercase tracking-[0.2em] text-[#F5F5F0]/40 font-medium truncate">
              Regenerative Intelligence Platform
            </p>
          </div>
        </div>

        {/* Configuration-Driven Desktop Primary Navigation with Generous Spacing */}
        <nav className="hidden xl:flex items-center gap-1 2xl:gap-2 shrink-0">
          {filteredNavigation.map((item) => {
            const ItemIcon = item.icon;
            const isActive = isPrimaryActive(item.id);
            const isMenuOpen = activeMenuId === item.id;
            const hasSubmenu = item.type === 'mega_menu' || item.type === 'nested_submenu';

            return (
              <div 
                key={item.id} 
                className="relative shrink-0"
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
                  className={`px-2.5 2xl:px-3 py-2 rounded-md text-[11px] 2xl:text-xs uppercase tracking-[0.1em] font-mono flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${getPrimaryButtonClasses(item.id, isMenuOpen)}`}
                >
                  {ItemIcon && (
                    <ItemIcon className={`w-3.5 h-3.5 ${isActive || isMenuOpen ? 'text-[#C5A059]' : 'opacity-70'}`} />
                  )}
                  <span className="truncate max-w-[135px] 2xl:max-w-none">{getNavLabel(item.labelKey, item.label)}</span>
                  
                  {item.badge && (
                    <span className={`text-[8px] font-mono uppercase px-1.5 py-0.2 rounded border ${getBadgeClass(item.badge.variant)} ${item.badge.pulse ? 'animate-pulse' : ''}`}>
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
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Centrally Accessible Atlas Innovations & Hackathons Dropdown Trigger */}
          <div className="relative">
            <button
              id="innovations-dropdown-btn"
              onClick={() => {
                audioFeedback.playSubtleClick();
                setInnovationsDropdownOpen(!innovationsDropdownOpen);
              }}
              aria-label="Atlas Innovations & Hackathon Showcases"
              title="Atlas Innovations & Hackathons 2026"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-full bg-gradient-to-r from-amber-500/20 via-[#1B3022] to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-amber-400/40 hover:border-amber-400 text-[#C5A059] hover:text-amber-200 transition-all font-mono font-bold text-[10px] sm:text-xs cursor-pointer shadow-sm"
            >
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
              <span className="hidden xs:inline font-serif font-bold tracking-wider">Innovations</span>
              <span className="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-400 text-black font-black uppercase">
                2026
              </span>
              <ChevronDown className={`w-3 h-3 text-amber-400 transition-transform duration-200 ${innovationsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Innovations Dropdown Menu */}
            {innovationsDropdownOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[90vw] rounded-xl bg-[#0D0D0D]/98 backdrop-blur-xl border border-[#C5A059]/40 shadow-2xl z-50 p-2 space-y-1 animate-fadeIn ring-1 ring-white/10"
                onMouseLeave={() => setInnovationsDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-[#F5F5F0]/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Atlas Innovations & Hackathons Hub
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40 font-bold">
                    2026 Series
                  </span>
                </div>

                <div className="max-h-[68vh] overflow-y-auto space-y-1.5 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#C5A059]/30">
                  {/* Category 1: Hackathon Spotlight Winners */}
                  <div className="px-2 pt-1 text-[9px] font-mono uppercase text-amber-400/80 font-bold tracking-wider">
                    🏆 Hackathon Spotlights & Winners
                  </div>

                  <button
                    onClick={() => {
                      onSelectTab('steward');
                      setInnovationsDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-all ${
                      currentTab === 'steward'
                        ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059]'
                        : 'hover:bg-[#141414] border border-transparent text-[#F5F5F0]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-serif font-bold text-white">Atlas Steward</span>
                        <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                          AWS 2026 Winner
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Good Neighbor Agents & Water Reliability</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('sentinel');
                      setInnovationsDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-all ${
                      currentTab === 'sentinel'
                        ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059]'
                        : 'hover:bg-[#141414] border border-transparent text-[#F5F5F0]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-serif font-bold text-white">Atlas Sentinel</span>
                        <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 font-mono font-bold">
                          TechJam 2026
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Automated Epistemic Content Defense</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('agent-mission-control');
                      setInnovationsDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-all ${
                      currentTab === 'agent-mission-control'
                        ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059]'
                        : 'hover:bg-[#141414] border border-transparent text-[#F5F5F0]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-serif font-bold text-white">Agent Mission Control</span>
                        <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40 font-mono font-bold">
                          GCP Swarm
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Autonomous Swarm Orchestration</p>
                    </div>
                  </button>

                  {/* Category 2: AI Engineering & Systems Studios */}
                  <div className="px-2 pt-2 text-[9px] font-mono uppercase text-blue-400/80 font-bold tracking-wider border-t border-[#F5F5F0]/10">
                    🔬 Next-Gen Studios & Causal Engines
                  </div>

                  <button
                    onClick={() => {
                      onSelectTab('ai-engineering');
                      setInnovationsDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-all ${
                      currentTab === 'ai-engineering'
                        ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059]'
                        : 'hover:bg-[#141414] border border-transparent text-[#F5F5F0]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-serif font-bold text-white">AI Engineering Studio</span>
                        <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-blue-950/80 text-blue-300 border border-blue-500/40 font-mono font-bold">
                          Gemini 3.7
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Multimodal Workbench & Live Voice</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('system-model-studio');
                      setInnovationsDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-all ${
                      currentTab === 'system-model-studio'
                        ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059]'
                        : 'hover:bg-[#141414] border border-transparent text-[#F5F5F0]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                      <GitBranch className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-serif font-bold text-white">Systems Dynamics</span>
                        <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-mono font-bold">
                          Causal SD
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Differential Stock-Flow Simulations</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('decision-room');
                      setInnovationsDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-all ${
                      currentTab === 'decision-room'
                        ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059]'
                        : 'hover:bg-[#141414] border border-transparent text-[#F5F5F0]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-serif font-bold text-white">Decision Room</span>
                        <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 font-mono font-bold">
                          War Room
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Multi-Stakeholder Policy Simulations</p>
                    </div>
                  </button>

                  {/* Category 3: Planetary Reality & Constitutional Governance */}
                  <div className="px-2 pt-2 text-[9px] font-mono uppercase text-emerald-400/80 font-bold tracking-wider border-t border-[#F5F5F0]/10">
                    🌍 Ground-Truth Placards & Governance
                  </div>

                  <button
                    onClick={() => {
                      onSelectTab('governance');
                      setInnovationsDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-all ${
                      currentTab === 'governance'
                        ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059]'
                        : 'hover:bg-[#141414] border border-transparent text-[#F5F5F0]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-serif font-bold text-white">Governance SDK</span>
                        <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-blue-950/80 text-[#8FB8DE] border border-[#8FB8DE]/40 font-mono font-bold">
                          Constitutional
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Mathematical Ethics & Quadratic Consensus</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('reality-engine');
                      setInnovationsDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-all ${
                      currentTab === 'reality-engine'
                        ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059]'
                        : 'hover:bg-[#141414] border border-transparent text-[#F5F5F0]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-md bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-serif font-bold text-white">Reality Engine</span>
                        <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                          IoT Mesh
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Ground-Truth Sensory Placards</p>
                    </div>
                  </button>

                  {/* Civilization OS Logic Flow Infographic Trigger */}
                  <button
                    onClick={() => {
                      setIsLogicFlowOpen(true);
                      setInnovationsDropdownOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg flex items-start gap-2.5 transition-all hover:bg-[#141414] border border-transparent text-[#F5F5F0]"
                  >
                    <div className="w-7 h-7 rounded-md bg-amber-500/20 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-serif font-bold text-white">Civilization OS Flow</span>
                        <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-amber-950/80 text-[#C5A059] border border-[#C5A059]/40 font-mono font-bold">
                          Infographic
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Modular Interactions to Moral Arbiter</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mission Alert Stream Bell */}
          <button
            id="mission-alert-bell-btn"
            onClick={() => {
              audioFeedback.playSubtleClick();
              setIsDrawerOpen(true);
            }}
            aria-label="Open Mission Alerts"
            title="Real-time Mission Alerts & Proofs"
            className="relative p-2 min-h-[36px] sm:min-h-[38px] min-w-[36px] sm:min-w-[38px] flex items-center justify-center rounded-full border border-[#C5A059]/40 hover:border-[#C5A059] bg-[#0D0D0D] text-[#C5A059] hover:bg-[#1B3022] transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center font-mono shadow-[0_0_8px_#F43F5E] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* AI Chat & Intelligence Assistant Trigger */}
          <button
            id="open-gemini-chat-btn"
            onClick={() => {
              audioFeedback.playSubtleClick();
              const event = new CustomEvent('open-gemini-chat');
              window.dispatchEvent(event);
            }}
            aria-label="Open Gemini AI Assistant"
            title="Open Gemini AI Assistant"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] sm:min-h-[38px] border border-[#C5A059]/40 hover:border-[#C5A059] bg-[#0D0D0D] rounded-full text-xs uppercase tracking-wider text-[#C5A059] hover:bg-[#1B3022] transition-all font-mono font-bold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden md:inline">AI Sanctum</span>
          </button>

          {/* Acoustic Command Toggle (Natural Voice Navigation & Acoustic HUD) */}
          <AcousticCommandToggle
            currentTab={currentTab}
            onSelectTab={onSelectTab}
            onOpenCommandCenter={onOpenCommandCenter}
          />

          {/* Mobile Fast Search Trigger */}
          <button
            id="mobile-search-btn"
            onClick={() => {
              audioFeedback.playSubtleClick();
              onOpenCommandCenter();
            }}
            aria-label="Open Search & Command Center"
            title="Search all views & modules (⌘K)"
            className="flex md:hidden items-center justify-center min-h-[44px] min-w-[44px] rounded-full bg-[#121212] hover:bg-[#1C1C1C] border border-[#F5F5F0]/15 text-[#C5A059] cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Global Search & Command Center (⌘K / /) */}
          <button
            id="open-command-center-btn"
            onClick={() => {
              audioFeedback.playSubtleClick();
              onOpenCommandCenter();
            }}
            aria-label="Open Command Center (⌘K)"
            title="Search all views, ledgers, and modules (⌘K)"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 min-h-[38px] rounded-full bg-[#121212] hover:bg-[#1C1C1C] border border-[#F5F5F0]/15 hover:border-[#C5A059]/50 transition-all text-xs font-mono text-[#F5F5F0]/70 hover:text-[#F5F5F0] cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden lg:inline">Search</span>
            <kbd className="px-1.5 py-0.5 text-[9px] bg-[#0A0A0A] border border-[#F5F5F0]/20 rounded text-[#C5A059] font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Planetary Oracle Sidebar Trigger */}
          <button
            id="open-oracle-sidebar-btn"
            onClick={() => {
              audioFeedback.playSubtleClick();
              if (onOpenOracle) onOpenOracle();
              else window.dispatchEvent(new CustomEvent('open-bioregional-oracle'));
            }}
            aria-label="Open Planetary Oracle"
            title="Consult the Bioregional Planetary Oracle (Mystical Telemetry)"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[38px] rounded-full bg-[#121212] hover:bg-[#1B261D] border border-[#C5A059]/35 hover:border-[#C5A059] transition-all text-xs font-mono text-[#C5A059] cursor-pointer shadow-sm group"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
            <span className="hidden lg:inline text-[11px] font-bold">Oracle</span>
          </button>

          {/* Hidden Celestial Star Map Trigger (Hotkey: *) */}
          <button
            id="open-star-map-btn"
            onClick={() => {
              audioFeedback.playCovenantResonance();
              if (onOpenStarMap) onOpenStarMap();
              else window.dispatchEvent(new CustomEvent('open-star-map'));
            }}
            aria-label="Open Celestial Star Map (*)"
            title="Celestial Star Map: Constellations of Verified Projects (Shortcut: *)"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[38px] rounded-full bg-[#101018] hover:bg-[#181828] border border-cyan-500/35 hover:border-cyan-400 transition-all text-xs font-mono text-cyan-300 cursor-pointer shadow-sm group"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
            <span className="hidden xl:inline text-[11px] font-bold">Star Map</span>
            <kbd className="hidden sm:inline px-1 text-[8px] bg-black/60 border border-cyan-500/30 rounded text-cyan-300 font-mono">*</kbd>
          </button>

          {/* Google Sitelinks & SERP Simulator Trigger */}
          <button
            id="open-google-sitelinks-btn"
            onClick={() => {
              audioFeedback.playSubtleClick();
              window.dispatchEvent(new CustomEvent('open-google-sitelinks-enhancement'));
            }}
            aria-label="Google Sitelinks & SERP Enhancement"
            title="Google Search Results Sitelinks & Searchbox Simulation"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 min-h-[38px] rounded-full bg-[#121212] hover:bg-[#1C1C1C] border border-emerald-500/30 hover:border-emerald-400 transition-all text-xs font-mono text-emerald-400 cursor-pointer"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span className="hidden 2xl:inline text-[11px] font-bold">Google Sitelinks</span>
          </button>

          {/* Moral Alignment Score Real-time HUD Indicator */}
          <div className="hidden 2xl:block">
            <MoralAlignmentHUD
              onOpenMoralSimulator={onOpenMoralSimulator}
              onOpenEvidenceLedger={() => onSelectTab('evidence-ledger')}
            />
          </div>

          {/* Real-time Bioregional Hazard Monitor Beacon */}
          <BioregionalHazardBeacon onSelectTab={onSelectTab} />

          {/* Real-time Offline Sync & Database Health Indicator */}
          <SyncHealthIndicator />

          {/* Low-Connectivity Field Resilience Mode (IndexedDB Mission Cache) */}
          <ResilienceModeToggle />

          {/* Infrastructure Health Status: SystemVitalityMonitor & Real-time System Pulse (Streamlined on Tablet/Desktop) */}
          <div className="hidden md:flex items-center gap-1.5">
            <SystemPulseIcon />
            <SystemVitalityMonitor />
          </div>

          {/* Theme Toggle Button (Cycles through 'Dark', 'Light', 'System', and 'Context-Aware' preferences) */}
          <button
            id="theme-toggle-btn"
            onClick={handleToggleTheme}
            aria-label={`Theme preference: ${currentTheme}. Click to cycle theme`}
            title={`Switch Theme: currently ${currentTheme.toUpperCase()} (Click to cycle between Dark, Light, System, and Context-Aware)`}
            className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[44px] min-w-[44px] sm:min-h-[38px] sm:min-w-[auto] rounded-full bg-[#121212] hover:bg-[#1C1C1C] border border-[#F5F5F0]/15 hover:border-[#C5A059]/50 transition-all text-xs font-mono text-[#F5F5F0]/80 hover:text-[#F5F5F0] cursor-pointer"
          >
            {currentTheme === 'dark' && (
              <>
                <Moon className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[10px] hidden lg:inline font-mono">Dark</span>
              </>
            )}
            {currentTheme === 'light' && (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] hidden lg:inline font-mono">Light</span>
              </>
            )}
            {currentTheme === 'system' && (
              <>
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] hidden lg:inline font-mono">System</span>
              </>
            )}
            {currentTheme === 'context_aware' && (
              <>
                <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
                <span className="text-[10px] hidden lg:inline font-mono text-emerald-300 font-bold">Auto</span>
              </>
            )}
          </button>

          {/* User Profile & Firestore Settings Synchronizer */}
          <UserSettingsDropdown />

          {/* Mobile & Tablet Menu Toggle Button (visible below xl) */}
          <button
            id="mobile-menu-toggle"
            onClick={() => {
              audioFeedback.playSubtleClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="xl:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md bg-[#141414] border border-[#F5F5F0]/10 text-[#F5F5F0] hover:text-[#C5A059] hover:border-[#C5A059]/40 transition-colors cursor-pointer"
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
      {/* Civilization OS Logic Flow Infographic Modal */}
      <CivilizationOSLogicFlowModal
        isOpen={isLogicFlowOpen}
        onClose={() => setIsLogicFlowOpen(false)}
        onSelectTab={onSelectTab}
      />
    </header>
  );
};
