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
  Sparkles, 
  Activity,
  TreeDeciduous,
  X,
  Trophy,
  Droplets,
  Shield,
  Radio,
  Cpu,
  GitBranch,
  Globe2
} from 'lucide-react';
import { isNavigationItemActive, trackNavigationEvent, getNavLabel } from '../../lib/navigationHelpers';
import { UncertaintyOverlayToggle } from '../../context/UncertaintyOverlayContext';
import { audioFeedback } from '../../lib/audioFeedback';

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
          {/* Atlas Innovations & Hackathons 2026 Spotlight Accordion */}
          <div className="border border-amber-500/40 rounded-sm bg-gradient-to-b from-[#141005] to-[#0E0E0E] overflow-hidden">
            <button
              onClick={() => toggleSection('atlas-innovations-spotlight')}
              className="w-full text-left p-3 min-h-[44px] flex items-center justify-between transition-colors bg-gradient-to-r from-amber-500/10 via-[#1B3022] to-emerald-500/10"
            >
              <div className="flex items-center gap-2.5">
                <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-serif font-bold tracking-wider text-amber-300">Atlas Innovations & Hackathons</span>
                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-amber-400 text-black font-black uppercase">
                  2026
                </span>
              </div>
              {expandedSections['atlas-innovations-spotlight'] ? (
                <ChevronDown className="w-4 h-4 text-amber-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {expandedSections['atlas-innovations-spotlight'] && (
              <div className="p-2 space-y-1 bg-[#0A0A0A] border-t border-amber-500/20">
                <button
                  onClick={() => {
                    onSelectTab('steward');
                    onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded flex items-start gap-2.5 transition-all ${
                    currentTab === 'steward' ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059]' : 'hover:bg-[#141414] text-[#F5F5F0]'
                  }`}
                >
                  <div className="w-7 h-7 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold">Atlas Steward</span>
                      <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                        AWS 2026
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Good Neighbor Agents & Water Reliability</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('sentinel');
                    onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded flex items-start gap-2.5 transition-all ${
                    currentTab === 'sentinel' ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059]' : 'hover:bg-[#141414] text-[#F5F5F0]'
                  }`}
                >
                  <div className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold">Atlas Sentinel</span>
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
                    onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded flex items-start gap-2.5 transition-all ${
                    currentTab === 'agent-mission-control' ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059]' : 'hover:bg-[#141414] text-[#F5F5F0]'
                  }`}
                >
                  <div className="w-7 h-7 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold">Agent Mission Control</span>
                      <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40 font-mono font-bold">
                        GCP Swarm
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Autonomous Swarm Orchestration</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('ai-engineering');
                    onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded flex items-start gap-2.5 transition-all ${
                    currentTab === 'ai-engineering' ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059]' : 'hover:bg-[#141414] text-[#F5F5F0]'
                  }`}
                >
                  <div className="w-7 h-7 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold">AI Engineering Studio</span>
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
                    onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded flex items-start gap-2.5 transition-all ${
                    currentTab === 'system-model-studio' ? 'bg-[#1B3022] border border-[#C5A059] text-[#C5A059]' : 'hover:bg-[#141414] text-[#F5F5F0]'
                  }`}
                >
                  <div className="w-7 h-7 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold">Systems Dynamics Studio</span>
                      <span className="text-[8px] uppercase px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-mono font-bold">
                        Causal SD
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Differential Stock-Flow Simulations</p>
                  </div>
                </button>
              </div>
            )}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {onOpenCommandments && (
            <button
              onClick={() => {
                onOpenCommandments();
                onClose();
              }}
              className="py-3 px-3 min-h-[44px] bg-[#121212] hover:bg-[#1A1A1A] border border-[#C5A059]/40 text-[#C5A059] rounded-sm text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Scale className="w-4 h-4" />
              <span>10 Commandments</span>
            </button>
          )}

          <button
            onClick={() => {
              onOpenMoralSimulator();
              onClose();
            }}
            className="py-3 px-3 min-h-[44px] bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/50 text-[#C5A059] rounded-sm text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Scale className="w-4 h-4" />
            <span>Moral Simulator</span>
          </button>

          <button
            onClick={() => {
              onOpenCommandCenter();
              onClose();
            }}
            className="py-3 px-3 min-h-[44px] bg-[#0A0A0A] hover:bg-[#151515] border border-[#F5F5F0]/20 text-[#F5F5F0] rounded-sm text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-[#C5A059]" />
            <span>Command (⌘K)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
