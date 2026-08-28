import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Layers, 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Code2, 
  Building2, 
  BookOpen, 
  Scale, 
  User, 
  ExternalLink,
  Sparkles,
  Check
} from 'lucide-react';
import { ECOSYSTEM_ROUTES, EcosystemRouteItem } from '../../config/ecosystemRoutes';
import { PageView } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface EcosystemDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: PageView) => void;
  currentTab: PageView;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Core Platform': Compass,
  'Execution Layer': Layers,
  'Intelligence + Trust': ShieldCheck,
  'Developer Ecosystem': Code2,
  'Institutional Layer': Building2,
  'Public Narrative': BookOpen,
  'Governance': Scale,
  'User Workspace': User
};

export const EcosystemDirectoryModal: React.FC<EcosystemDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  currentTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(ECOSYSTEM_ROUTES.map(r => r.category)));
    return ['All', ...unique];
  }, []);

  const filteredRoutes = useMemo(() => {
    return ECOSYSTEM_ROUTES.filter(route => {
      const matchesCategory = selectedCategory === 'All' || route.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = 
        !q ||
        route.name.toLowerCase().includes(q) ||
        route.path.toLowerCase().includes(q) ||
        route.description.toLowerCase().includes(q) ||
        route.category.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleRouteClick = (route: EcosystemRouteItem) => {
    audioFeedback.playViewTransition();
    onSelectTab(route.targetTab);
    onClose();
  };

  const handleCopyPath = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    audioFeedback.playMicroTick();
    setTimeout(() => setCopiedPath(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      id="ecosystem-directory-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl max-h-[90vh] bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm shadow-2xl flex flex-col text-[#F5F5F0] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#F5F5F0]/10 flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-[#151515] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold tracking-wider text-[#F5F5F0]">
                  Atlas Sanctum Product Ecosystem
                </h2>
                <span className="text-[9px] font-mono px-2 py-0.5 bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/30 rounded-full font-bold">
                  {ECOSYSTEM_ROUTES.length} Routes
                </span>
              </div>
              <p className="text-xs text-[#F5F5F0]/50 font-mono">
                Discoverable ecosystem architecture across core, execution, intelligence, and institutional layers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#F5F5F0]/50 hover:text-[#F5F5F0] hover:bg-[#1A1A1A] rounded-sm transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-[#F5F5F0]/10 bg-[#080808] space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
            <input
              type="text"
              placeholder="Search routes by path, name, or capability (e.g. /observatory/reality, /ethics, /impact)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-[#121212] border border-[#F5F5F0]/15 focus:border-[#C5A059] pl-10 pr-4 py-2.5 rounded-sm text-sm font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/40 outline-none transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#F5F5F0]/40 hover:text-[#F5F5F0]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-thin">
            {categories.map(cat => {
              const Icon = cat !== 'All' ? CATEGORY_ICONS[cat] : Layers;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    audioFeedback.playMicroTick();
                  }}
                  className={`px-3 py-1.5 rounded-sm text-[11px] uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#C5A059] text-[#0A0A0A] font-bold'
                      : 'bg-[#141414] text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#1A1A1A] border border-[#F5F5F0]/10'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Routes Grid / List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 divide-y divide-[#F5F5F0]/5 max-h-[60vh]">
          {filteredRoutes.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-[#F5F5F0]/40 font-mono">
              <Search className="w-8 h-8 mx-auto text-[#C5A059]/40" />
              <p>No routes matched "{searchQuery}" in {selectedCategory}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {filteredRoutes.map(route => {
                const CategoryIcon = CATEGORY_ICONS[route.category] || Compass;
                const isCurrent = currentTab === route.targetTab;

                return (
                  <div
                    key={route.path}
                    onClick={() => handleRouteClick(route)}
                    className={`group p-3.5 rounded-sm border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isCurrent
                        ? 'bg-[#151515] border-[#C5A059] text-[#F5F5F0]'
                        : 'bg-[#111111] border-[#F5F5F0]/10 hover:border-[#C5A059]/60 hover:bg-[#161616]'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-mono">
                          <code className="text-xs font-bold text-[#C5A059] bg-[#0A0A0A] px-2 py-0.5 rounded border border-[#C5A059]/30">
                            {route.path}
                          </code>
                          {route.isSpineNode && (
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                              Spine Node
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={e => handleCopyPath(e, route.path)}
                            title="Copy path"
                            className="text-[10px] text-[#F5F5F0]/40 hover:text-[#C5A059] p-1 font-mono"
                          >
                            {copiedPath === route.path ? <Check className="w-3 h-3 text-emerald-400" /> : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <CategoryIcon className="w-3.5 h-3.5 text-[#F5F5F0]/40 group-hover:text-[#C5A059] shrink-0" />
                        <h3 className="text-sm font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">
                          {route.name}
                        </h3>
                      </div>

                      <p className="text-xs text-[#F5F5F0]/60 line-clamp-2 leading-relaxed">
                        {route.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#F5F5F0]/5 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/40">
                      <span className="uppercase tracking-wider">{route.category}</span>
                      <span className="flex items-center gap-1 text-[#C5A059] group-hover:translate-x-0.5 transition-transform">
                        Launch <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#0A0A0A] border-t border-[#F5F5F0]/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#F5F5F0]/50">
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] font-bold">Spine:</span>
            <span>Observatory → Opportunity → Decision → Project → Impact</span>
          </div>
          <div>Press <kbd className="px-1.5 py-0.5 bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded text-[#C5A059]">Esc</kbd> to close</div>
        </div>
      </div>
    </div>
  );
};
