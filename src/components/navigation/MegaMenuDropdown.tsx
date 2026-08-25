import React from 'react';
import { 
  PrimaryNavigationItem, 
  NavigationLinkItem, 
  MegaMenuSection,
  MegaMenuHighlight,
  BadgeColorVariant,
  QuickActionLink
} from '../../types/navigation';
import { PageView } from '../../types';
import { ArrowRight, ExternalLink, Sparkles, Zap } from 'lucide-react';
import { trackNavigationEvent, getNavLabel } from '../../lib/navigationHelpers';
import { prefetchView } from '../../lib/viewPrefetch';

interface MegaMenuDropdownProps {
  item: PrimaryNavigationItem;
  currentTab: PageView;
  onSelectTab: (tab: PageView) => void;
  onClose: () => void;
}

export const MegaMenuDropdown: React.FC<MegaMenuDropdownProps> = ({
  item,
  currentTab,
  onSelectTab,
  onClose
}) => {
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

  const handleLinkClick = (link: NavigationLinkItem) => {
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

  const handleQuickActionClick = (action: QuickActionLink) => {
    trackNavigationEvent({
      category: 'Navigation',
      action: 'quick_action_click',
      label: action.label
    });
    if (action.targetTab) {
      onSelectTab(action.targetTab);
      onClose();
    } else if (action.href) {
      if (action.isExternal) {
        window.open(action.href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = action.href;
      }
      onClose();
    }
  };

  const handleHighlightClick = (highlight: MegaMenuHighlight) => {
    if (highlight.targetTab) {
      trackNavigationEvent({
        category: 'Navigation',
        action: 'click_mega_highlight',
        label: highlight.title
      });
      onSelectTab(highlight.targetTab);
      onClose();
    }
  };

  const sections = item.megaMenuSections || [];
  const highlight = item.megaMenuHighlight;
  const quickActions = item.quickActionLinks || [];

  return (
    <div 
      className="absolute top-full left-0 right-0 z-50 pt-2 px-3 sm:px-6 lg:px-8 animate-fadeIn"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto bg-[#0D0D0D]/98 backdrop-blur-2xl border border-[#F5F5F0]/15 rounded-b-md shadow-2xl p-5 sm:p-7 text-[#F5F5F0] overflow-y-auto max-h-[calc(100vh-5rem)] custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Category Sections (8 cols or 12 cols if no highlight) */}
          <div className={`${highlight ? 'lg:col-span-8' : 'lg:col-span-12'} grid grid-cols-1 md:grid-cols-2 gap-8`}>
            {sections.map((section: MegaMenuSection) => {
              const SectionIcon = section.icon;
              return (
                <div key={section.id} className="space-y-4">
                  {/* Section Title */}
                  <div className="flex items-center gap-2 pb-2 border-b border-[#F5F5F0]/10">
                    {SectionIcon && <SectionIcon className="w-4 h-4 text-[#C5A059]" />}
                    <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#C5A059]">
                      {getNavLabel(section.titleKey, section.title)}
                    </h3>
                  </div>

                  {/* Section Links */}
                  <div className="space-y-1">
                    {section.items.map((link: NavigationLinkItem) => {
                      const LinkIcon = link.icon;
                      const isItemActive = link.targetTab === currentTab;

                      return (
                        <button
                          key={link.id}
                          onClick={() => handleLinkClick(link)}
                          onMouseEnter={() => {
                            if (link.targetTab) {
                              prefetchView(link.targetTab as any);
                            }
                          }}
                          className={`w-full text-left p-2.5 rounded-sm transition-all group flex items-start gap-3 ${
                            isItemActive 
                              ? 'bg-[#1B3022]/60 border border-[#C5A059]/40' 
                              : 'hover:bg-[#151515] border border-transparent hover:border-[#F5F5F0]/10'
                          }`}
                        >
                          {LinkIcon && (
                            <div className={`p-1.5 rounded-sm mt-0.5 transition-colors ${
                              isItemActive 
                                ? 'bg-[#1B3022] text-[#C5A059]' 
                                : 'bg-[#121212] text-[#F5F5F0]/60 group-hover:text-[#C5A059] group-hover:bg-[#1A1A1A]'
                            }`}>
                              <LinkIcon className="w-4 h-4" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-serif font-bold transition-colors ${
                                isItemActive ? 'text-[#C5A059]' : 'text-[#F5F5F0] group-hover:text-[#C5A059]'
                              }`}>
                                {getNavLabel(link.labelKey, link.label)}
                              </span>

                              {link.badge && (
                                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${getBadgeClass(link.badge.variant)} ${link.badge.pulse ? 'animate-pulse' : ''}`}>
                                  {link.badge.text}
                                </span>
                              )}

                              {link.isExternal && (
                                <ExternalLink className="w-3 h-3 text-[#F5F5F0]/40 group-hover:text-[#F5F5F0]" />
                              )}
                            </div>

                            {link.description && (
                              <p className="text-[11px] text-[#F5F5F0]/50 font-sans line-clamp-1 group-hover:text-[#F5F5F0]/70 mt-0.5">
                                {link.description}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Highlight Card (4 cols) */}
          {highlight && (
            <div className="lg:col-span-4 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm p-5 space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#C5A059]" />
                    FEATURED CAPABILITY
                  </span>
                  {highlight.badge && (
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${getBadgeClass(highlight.badge.variant)}`}>
                      {highlight.badge.text}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-serif font-bold text-[#F5F5F0] leading-snug">
                  {highlight.title}
                </h4>

                <p className="text-xs text-[#F5F5F0]/65 font-sans leading-relaxed">
                  {highlight.description}
                </p>

                {highlight.metric && (
                  <div className="p-3 bg-[#0A0A0A] rounded border border-[#F5F5F0]/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">{highlight.metric.label}</span>
                    <div className="text-right">
                      <span className="text-sm font-mono font-bold text-emerald-400 block">{highlight.metric.value}</span>
                      {highlight.metric.trend && (
                        <span className="text-[9px] font-mono text-[#C5A059]">{highlight.metric.trend}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleHighlightClick(highlight)}
                className="mt-4 w-full py-2.5 px-3.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/60 text-[#C5A059] rounded-sm text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <span>{highlight.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </div>

        {/* Quick-action links row directly in mega-menu */}
        {quickActions.length > 0 && (
          <div className="mt-6 pt-4 border-t border-[#F5F5F0]/10 flex flex-wrap items-center justify-between gap-3 bg-[#080808]/70 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 px-6 sm:px-8 py-3.5">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#F5F5F0]/40">
              <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Direct Quick Actions:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {quickActions.map(action => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickActionClick(action)}
                    className="px-3 py-1.5 rounded-sm bg-[#141414] hover:bg-[#1B3022] border border-[#F5F5F0]/15 hover:border-[#C5A059]/40 text-xs font-serif text-[#F5F5F0] hover:text-[#C5A059] flex items-center gap-2 transition-all cursor-pointer group"
                  >
                    {ActionIcon && <ActionIcon className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform" />}
                    <span>{action.label}</span>
                    {action.badge && (
                      <span className={`text-[8px] font-mono px-1 py-0.2 rounded border ${getBadgeClass(action.badge.variant)}`}>
                        {action.badge.text}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
