import React, { useState } from 'react';
import { 
  PrimaryNavigationItem, 
  NavigationLinkItem, 
  MegaMenuSection,
  BadgeColorVariant 
} from '../../types/navigation';
import { PageView } from '../../types';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  ExternalLink, 
  Scale, 
  X,
  Terminal,
  User,
  Award
} from 'lucide-react';
import { isNavigationItemActive, trackNavigationEvent, getNavLabel } from '../../lib/navigationHelpers';
import { UncertaintyOverlayToggle } from '../../context/UncertaintyOverlayContext';
import { audioFeedback } from '../../lib/audioFeedback';
import { BioregionalOracle } from './BioregionalOracle';

interface MobileNavigationDrawerProps {
  items: PrimaryNavigationItem[];
  currentTab: PageView;
  onSelectTab: (tab: PageView) => void;
  onClose: () => void;
  onOpenCommandCenter: () => void;
  onOpenMoralSimulator: () => void;
  onOpenCommandments?: () => void;
}

export const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  items,
  currentTab,
  onSelectTab,
  onClose,
  onOpenCommandCenter,
  onOpenMoralSimulator,
  onOpenCommandments
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'observatory-mega': true,
    'governance-mega': true
  });

  const toggleSection = (id: string) => {
    audioFeedback.playSubtleClick();
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getBadgeClass = (variant: BadgeColorVariant) => {
    switch (variant) {
      case 'emerald':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'gold':
        return 'bg-[#1B3022] text-[#C5A059] border-[#C5A059]/40';
      case 'amber':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'blue':
        return 'bg-blue-950/80 text-[#8FB8DE] border-[#8FB8DE]/40';
      default:
        return 'bg-[#1A1A1A] text-[#F5F5F0]/80 border-[#F5F5F0]/20';
    }
  };

  const handleLinkSelect = (link: NavigationLinkItem) => {
    trackNavigationEvent(link.analytics, link.label);
    if (link.targetTab) {
      onSelectTab(link.targetTab);
      onClose();
    } else if (link.href) {
      if (link.isExternal) {
        window.open(link.href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = link.href;
      }
      onClose();
    }
  };

  // Filter items if user is searching
  const q = searchQuery.toLowerCase().trim();

  return (
    <div 
      id="mobile-navigation-drawer" 
      className="xl:hidden bg-[#0A0A0A] border-b border-[#F5F5F0]/15 max-h-[82vh] overflow-y-auto p-4 sm:p-6 space-y-6 text-[#F5F5F0] animate-fadeIn"
    >
      {/* Search Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search modules, ledgers, twins, SDK..."
          className="w-full pl-10 pr-9 py-2.5 bg-[#121212] border border-[#F5F5F0]/20 rounded text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/40 focus:outline-none focus:border-[#C5A059]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Bioregional Oracle Component - Mystical Interpretation of Living Telemetry */}
      <BioregionalOracle 
        onSelectTab={(tab) => {
          onSelectTab(tab);
          onClose();
        }} 
      />

      {/* Uncertainty Overlay Toggle in Mobile Drawer */}
      <div className="flex items-center justify-between p-3 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm">
        <span className="text-xs font-mono text-[#F5F5F0]/70">Epistemic Uncertainty:</span>
        <UncertaintyOverlayToggle />
      </div>

      {/* Search Results Mode */}
      {q ? (
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
            Search Results for "{searchQuery}"
          </div>
          {items.flatMap((primary) => {
            const list: NavigationLinkItem[] = [];
            if (primary.targetTab) {
              list.push({
                id: primary.id,
                label: primary.label,
                targetTab: primary.targetTab,
                icon: primary.icon
              });
            }
            if (primary.submenuItems) {
              list.push(...primary.submenuItems);
            }
            if (primary.megaMenuSections) {
              primary.megaMenuSections.forEach(sec => list.push(...sec.items));
            }
            return list;
          })
          .filter((item, idx, self) => 
            self.findIndex(i => i.id === item.id) === idx &&
            (item.label.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q)))
          )
          .map((link) => {
            const LinkIcon = link.icon;
            const isItemActive = link.targetTab === currentTab;

            return (
              <button
                key={link.id}
                onClick={() => handleLinkSelect(link)}
                className={`w-full text-left p-3 rounded-sm flex items-start gap-3 transition-colors ${
                  isItemActive ? 'bg-[#1B3022] border border-[#C5A059]' : 'bg-[#121212] border border-[#F5F5F0]/10'
                }`}
              >
                {LinkIcon && <LinkIcon className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-[#F5F5F0]">{link.label}</span>
                    {link.badge && (
                      <span className={`text-[8px] font-mono uppercase px-1.5 py-0.2 rounded border ${getBadgeClass(link.badge.variant)}`}>
                        {link.badge.text}
                      </span>
                    )}
                  </div>
                  {link.description && (
                    <p className="text-[10px] text-[#F5F5F0]/60 font-sans mt-0.5 line-clamp-1">{link.description}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Hierarchical Category Menus */
        <div className="space-y-4">
          {/* Citizen Profile & Stewardship Reputation Card */}
          <div 
            id="mobile-drawer-citizen-profile-card"
            className={`p-3 rounded-sm border transition-all ${
              currentTab === 'citizen-profile'
                ? 'bg-[#1B3022] border-[#C5A059] shadow-lg'
                : 'bg-gradient-to-r from-[#121B14] to-[#0A0A0A] border-[#C5A059]/30 hover:border-[#C5A059]'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#1B3022] border border-[#C5A059] flex items-center justify-center text-[#C5A059] shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-serif font-bold text-white truncate">Eugene Ochako</span>
                    <span className="text-[8px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      Tier 3
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#C5A059]">
                    3,450 Rep Pts • 4 Badges Earned
                  </div>
                </div>
              </div>

              <button
                id="open-citizen-profile-drawer-btn"
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  onSelectTab('citizen-profile');
                  onClose();
                }}
                className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-black rounded font-mono text-[10px] uppercase font-bold tracking-wider shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
            </div>
          </div>

          {items.map((primary: PrimaryNavigationItem) => {
            const PrimaryIcon = primary.icon;
            const isPrimaryActive = isNavigationItemActive(primary, currentTab);
            const isExpanded = expandedSections[primary.id] ?? false;

            // Direct Link
            if (primary.type === 'link') {
              return (
                <button
                  key={primary.id}
                  onClick={() => {
                    if (primary.targetTab) onSelectTab(primary.targetTab);
                    onClose();
                  }}
                  className={`w-full text-left p-3 min-h-[44px] rounded-sm flex items-center justify-between border transition-all ${
                    currentTab === primary.targetTab 
                      ? 'bg-[#1B3022] border-[#C5A059] text-[#C5A059] font-bold' 
                      : 'bg-[#121212] border-[#F5F5F0]/10 text-[#F5F5F0] hover:border-[#F5F5F0]/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {PrimaryIcon && <PrimaryIcon className="w-4 h-4 text-[#C5A059]" />}
                    <span className="text-xs font-serif font-bold tracking-wider">{primary.label}</span>
                  </div>
                  {primary.badge && (
                    <span className={`text-[8px] font-mono uppercase px-1.5 py-0.2 rounded border ${getBadgeClass(primary.badge.variant)}`}>
                      {primary.badge.text}
                    </span>
                  )}
                </button>
              );
            }

            // Mega Menu or Submenu with Accordion
            return (
              <div key={primary.id} className="border border-[#F5F5F0]/10 rounded-sm bg-[#0E0E0E] overflow-hidden">
                {/* Header Toggle */}
                <button
                  onClick={() => toggleSection(primary.id)}
                  className={`w-full text-left p-3 min-h-[44px] flex items-center justify-between transition-colors ${
                    isPrimaryActive ? 'bg-[#151515] text-[#C5A059]' : 'hover:bg-[#151515] text-[#F5F5F0]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {PrimaryIcon && <PrimaryIcon className="w-4 h-4 text-[#C5A059]" />}
                    <span className="text-xs font-serif font-bold tracking-wider">{primary.label}</span>
                    {primary.badge && (
                      <span className={`text-[8px] font-mono uppercase px-1.5 py-0.2 rounded border ${getBadgeClass(primary.badge.variant)}`}>
                        {primary.badge.text}
                      </span>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-[#F5F5F0]/50" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#F5F5F0]/50" />
                  )}
                </button>

                {/* Submenu Accordion Body */}
                {isExpanded && (
                  <div className="p-3 pt-1 space-y-3 bg-[#0A0A0A] border-t border-[#F5F5F0]/5">
                    
                    {/* For Mega Menu */}
                    {primary.megaMenuSections && primary.megaMenuSections.map((sec: MegaMenuSection) => (
                      <div key={sec.id} className="space-y-1">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold px-2 py-1">
                          {sec.title}
                        </div>
                        {sec.items.map((link: NavigationLinkItem) => {
                          const LinkIcon = link.icon;
                          const isItemActive = link.targetTab === currentTab;

                          return (
                            <button
                              key={link.id}
                              onClick={() => handleLinkSelect(link)}
                              className={`w-full text-left p-2.5 rounded flex items-start gap-2.5 transition-colors ${
                                isItemActive 
                                  ? 'bg-[#1B3022] border border-[#C5A059]' 
                                  : 'hover:bg-[#141414] border border-transparent'
                              }`}
                            >
                              {LinkIcon && <LinkIcon className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs font-serif font-bold ${isItemActive ? 'text-[#C5A059]' : 'text-[#F5F5F0]'}`}>
                                    {link.label}
                                  </span>
                                  {link.badge && (
                                    <span className={`text-[8px] font-mono uppercase px-1 py-0.2 rounded border ${getBadgeClass(link.badge.variant)}`}>
                                      {link.badge.text}
                                    </span>
                                  )}
                                </div>
                                {link.description && (
                                  <p className="text-[10px] text-[#F5F5F0]/50 font-sans line-clamp-1">{link.description}</p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))}

                    {/* For Nested Submenu */}
                    {primary.submenuItems && primary.submenuItems.map((link: NavigationLinkItem) => {
                      const LinkIcon = link.icon;
                      const isItemActive = link.targetTab === currentTab;

                      return (
                        <button
                          key={link.id}
                          onClick={() => handleLinkSelect(link)}
                          className={`w-full text-left p-2.5 rounded flex items-start gap-2.5 transition-colors ${
                            isItemActive 
                              ? 'bg-[#1B3022] border border-[#C5A059]' 
                              : 'hover:bg-[#141414] border border-transparent'
                          }`}
                        >
                          {LinkIcon && <LinkIcon className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-serif font-bold ${isItemActive ? 'text-[#C5A059]' : 'text-[#F5F5F0]'}`}>
                                {link.label}
                              </span>
                              {link.badge && (
                                <span className={`text-[8px] font-mono uppercase px-1 py-0.2 rounded border ${getBadgeClass(link.badge.variant)}`}>
                                  {link.badge.text}
                                </span>
                              )}
                              {link.isExternal && (
                                <ExternalLink className="w-3 h-3 text-[#F5F5F0]/40" />
                              )}
                            </div>
                            {link.description && (
                              <p className="text-[10px] text-[#F5F5F0]/50 font-sans line-clamp-1">{link.description}</p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile Quick Action Buttons Grid */}
      <div className="pt-3 border-t border-[#F5F5F0]/10 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#F5F5F0]/50">
          Quick Civilization Tools
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {onOpenCommandments && (
            <button
              onClick={() => {
                onOpenCommandments();
                onClose();
              }}
              className="py-3 px-2.5 min-h-[44px] bg-[#121212] hover:bg-[#1A1A1A] border border-[#C5A059]/40 text-[#C5A059] rounded-sm text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Scale className="w-4 h-4 shrink-0" />
              <span className="truncate">Commandments</span>
            </button>
          )}

          <button
            onClick={() => {
              onOpenMoralSimulator();
              onClose();
            }}
            className="py-3 px-2.5 min-h-[44px] bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/50 text-[#C5A059] rounded-sm text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Scale className="w-4 h-4 shrink-0" />
            <span className="truncate">Moral Simulator</span>
          </button>

          <button
            onClick={() => {
              onOpenCommandCenter();
              onClose();
            }}
            className="py-3 px-2.5 min-h-[44px] bg-[#0A0A0A] hover:bg-[#151515] border border-[#F5F5F0]/20 text-[#F5F5F0] rounded-sm text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Search className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span className="truncate">Command Center</span>
          </button>

          <button
            onClick={() => {
              onOpenCommandCenter();
              onClose();
            }}
            className="py-3 px-2.5 min-h-[44px] bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/40 text-rose-300 rounded-sm text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Terminal className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">Diagnostics</span>
          </button>
        </div>
      </div>
    </div>
  );
};
