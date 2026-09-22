import React from 'react';
import { 
  Home, 
  ShieldCheck, 
  Bot, 
  Search, 
  Menu, 
  Sparkles,
  Layers
} from 'lucide-react';
import { PageView } from '../../types';
import { audioFeedback, hapticFeedback } from '../../lib/audioFeedback';

interface MobileBottomNavProps {
  currentTab: PageView;
  onSelectTab: (tab: PageView) => void;
  onOpenCommandCenter: () => void;
  onOpenMobileMenu: () => void;
  onOpenAIModal?: () => void;
}

/**
 * MobileBottomNav: A mobile-first floating bottom navigation bar
 * designed for single-thumb navigation on smartphones and compact touch displays.
 * Adheres to touch target accessibility (min 44px) and iOS/Android safe area insets.
 */
export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenCommandCenter,
  onOpenMobileMenu,
  onOpenAIModal
}) => {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      isActive: currentTab === 'home',
      onClick: () => {
        audioFeedback.playSubtleClick();
        hapticFeedback.triggerLightClickHaptic();
        onSelectTab('home');
      }
    },
    {
      id: 'sentinel',
      label: 'Sentinel',
      icon: ShieldCheck,
      isActive: currentTab === 'sentinel',
      badge: 'TechJam',
      onClick: () => {
        audioFeedback.playSubtleClick();
        hapticFeedback.triggerLightClickHaptic();
        onSelectTab('sentinel');
      }
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      isActive: false,
      onClick: () => {
        audioFeedback.playSubtleClick();
        hapticFeedback.triggerLightClickHaptic();
        onOpenCommandCenter();
      }
    },
    {
      id: 'agent-mission-control',
      label: 'Missions',
      icon: Bot,
      isActive: currentTab === 'agent-mission-control',
      onClick: () => {
        audioFeedback.playSubtleClick();
        hapticFeedback.triggerLightClickHaptic();
        onSelectTab('agent-mission-control');
      }
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: Menu,
      isActive: false,
      onClick: () => {
        audioFeedback.playSubtleClick();
        hapticFeedback.triggerLightClickHaptic();
        onOpenMobileMenu();
      }
    }
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Bottom Navigation Bar"
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#F5F5F0]/10 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_24px_rgba(0,0,0,0.7)] transition-all"
    >
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <button
              key={item.id}
              id={`mobile-bottom-nav-${item.id}`}
              onClick={item.onClick}
              aria-label={item.label}
              className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-xl transition-all select-none cursor-pointer group ${
                active 
                  ? 'text-[#C5A059]' 
                  : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              {/* Active Indicator Pip */}
              {active && (
                <span className="absolute -top-1 w-6 h-0.5 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059]" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-150 ${active ? 'scale-110 text-[#C5A059]' : 'group-hover:scale-105'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 text-[7px] font-mono font-bold bg-[#C5A059] text-black rounded-full uppercase tracking-tighter">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] font-mono tracking-tight mt-0.5 ${active ? 'font-bold text-[#C5A059]' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
export default MobileBottomNav;
