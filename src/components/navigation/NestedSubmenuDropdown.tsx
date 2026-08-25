import React from 'react';
import { 
  PrimaryNavigationItem, 
  NavigationLinkItem, 
  BadgeColorVariant 
} from '../../types/navigation';
import { PageView } from '../../types';
import { ExternalLink } from 'lucide-react';
import { trackNavigationEvent, getNavLabel } from '../../lib/navigationHelpers';

interface NestedSubmenuDropdownProps {
  item: PrimaryNavigationItem;
  currentTab: PageView;
  onSelectTab: (tab: PageView) => void;
  onClose: () => void;
}

export const NestedSubmenuDropdown: React.FC<NestedSubmenuDropdownProps> = ({
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
      case 'blue':
        return 'bg-blue-950/80 text-[#8FB8DE] border-[#8FB8DE]/40';
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

  const items = item.submenuItems || [];

  return (
    <div 
      className="absolute top-full left-0 z-50 pt-2 min-w-[280px] sm:min-w-[320px] animate-fadeIn"
      onMouseLeave={onClose}
    >
      <div className="bg-[#0D0D0D]/98 backdrop-blur-xl border border-[#F5F5F0]/15 rounded-md shadow-2xl p-2 text-[#F5F5F0] space-y-1">
        {items.map((link: NavigationLinkItem) => {
          const LinkIcon = link.icon;
          const isItemActive = link.targetTab === currentTab;

          return (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
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
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-serif font-bold transition-colors ${
                    isItemActive ? 'text-[#C5A059]' : 'text-[#F5F5F0] group-hover:text-[#C5A059]'
                  }`}>
                    {getNavLabel(link.labelKey, link.label)}
                  </span>

                  {link.badge && (
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${getBadgeClass(link.badge.variant)}`}>
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
};
