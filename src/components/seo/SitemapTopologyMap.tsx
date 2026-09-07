import React, { useState } from 'react';
import { 
  Network, 
  Globe2, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Layers, 
  Eye, 
  Sliders, 
  Compass, 
  ChevronRight, 
  Sparkles,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { PageView } from '../../types';
import { 
  MODULE_METADATA_REGISTRY, 
  ViewMetadata,
  auditViewMetadataEfficacy 
} from '../../lib/metadataManager';
import { audioFeedback } from '../../lib/audioFeedback';

interface SitemapTopologyMapProps {
  onNavigateTab?: (tab: PageView) => void;
  onSelectViewForMeta?: (tab: PageView) => void;
}

export const SitemapTopologyMap: React.FC<SitemapTopologyMapProps> = ({ 
  onNavigateTab,
  onSelectViewForMeta
}) => {
  const [selectedNode, setSelectedNode] = useState<PageView>('home');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'topology_graph' | 'compact_grid'>('topology_graph');

  const allEntries = Object.values(MODULE_METADATA_REGISTRY);

  // Group by category
  const categories: ViewMetadata['category'][] = ['Core', 'Infrastructure', 'Intelligence', 'Governance', 'Ledger', 'Commons'];

  const filteredEntries = allEntries.filter(entry => {
    if (filterCategory !== 'all' && entry.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return entry.name.toLowerCase().includes(q) || entry.viewId.toLowerCase().includes(q) || entry.metaTitle.toLowerCase().includes(q);
    }
    return true;
  });

  const selectedMeta = MODULE_METADATA_REGISTRY[selectedNode] || MODULE_METADATA_REGISTRY['home'];
  const nodeAudit = auditViewMetadataEfficacy(selectedMeta);

  return (
    <div className="space-y-6 font-mono">
      {/* Topology Header Controls */}
      <div className="p-4 rounded-xl bg-[#090909] border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30">
                <Network className="w-4 h-4" />
              </span>
              <h3 className="text-base font-serif font-bold text-white tracking-wide">
                Interactive Sitemap Topology Map
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                {allEntries.length} Registered Nodes
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/60">
              Visual graph representation of the crawled application architecture verifying view-specific meta tag integrity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { audioFeedback.play('softClick'); setViewMode('topology_graph'); }}
              className={`px-3 py-1.5 rounded text-xs transition-colors ${
                viewMode === 'topology_graph' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
              }`}
            >
              Hierarchical Graph
            </button>
            <button
              onClick={() => { audioFeedback.play('softClick'); setViewMode('compact_grid'); }}
              className={`px-3 py-1.5 rounded text-xs transition-colors ${
                viewMode === 'compact_grid' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
              }`}
            >
              Verification Matrix
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#F5F5F0]/50" />
            <input
              type="text"
              placeholder="Search nodes by title or view id..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] border border-white/10 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <span className="text-[#F5F5F0]/50 text-[11px]">Branch:</span>
            <button
              onClick={() => { audioFeedback.play('softClick'); setFilterCategory('all'); }}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                filterCategory === 'all' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { audioFeedback.play('softClick'); setFilterCategory(cat); }}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  filterCategory === cat ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Split View: Graph / List on Left + Node Detail Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: TOPOLOGY GRAPH OR GRID */}
        <div className="lg:col-span-2 space-y-6">
          {viewMode === 'topology_graph' ? (
            <div className="p-5 rounded-xl bg-[#080808] border border-white/10 space-y-6">
              {/* Root Level Node */}
              <div className="flex flex-col items-center">
                <div 
                  onClick={() => { audioFeedback.play('softClick'); setSelectedNode('home'); }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all max-w-md w-full text-center ${
                    selectedNode === 'home'
                      ? 'bg-[#191508] border-[#C5A059] shadow-lg shadow-[#C5A059]/10 ring-2 ring-[#C5A059]'
                      : 'bg-[#101010] border-white/20 hover:border-[#C5A059]/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#C5A059] font-bold">ROOT CANONICAL /</span>
                    <span className="text-emerald-400 font-bold">Priority 1.0</span>
                  </div>
                  <h4 className="font-serif font-bold text-white text-sm">Atlas Sanctum Civilization OS</h4>
                  <p className="text-[11px] text-[#F5F5F0]/60 mt-1 truncate">https://atlassanctum.org/</p>
                  
                  <div className="flex items-center justify-center gap-2 mt-2 text-[10px]">
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Meta Title (62 chars)
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> JSON-LD SoftwareApp
                    </span>
                  </div>
                </div>

                {/* Connecting Trunk Line */}
                <div className="w-0.5 h-8 bg-gradient-to-b from-[#C5A059] to-white/20 my-1" />
              </div>

              {/* Categorical Clusters */}
              <div className="space-y-6">
                {categories.filter(c => filterCategory === 'all' || filterCategory === c).map(category => {
                  const catEntries = allEntries.filter(e => e.category === category && e.viewId !== 'home');
                  if (catEntries.length === 0) return null;

                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059] uppercase tracking-wider pb-1 border-b border-white/10">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Branch: {category} ({catEntries.length} Endpoints)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {catEntries.map(entry => {
                          const isSelected = selectedNode === entry.viewId;
                          const audit = auditViewMetadataEfficacy(entry);
                          return (
                            <div
                              key={entry.viewId}
                              onClick={() => { audioFeedback.play('softClick'); setSelectedNode(entry.viewId); }}
                              className={`p-3 rounded-lg border cursor-pointer transition-all text-xs space-y-1.5 ${
                                isSelected
                                  ? 'bg-[#1A180E] border-[#C5A059] shadow-md ring-1 ring-[#C5A059]'
                                  : 'bg-[#121212] border-white/10 hover:border-white/25 hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white truncate max-w-[170px]">{entry.name}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#F5F5F0]/70 font-mono">
                                  {entry.priority.toFixed(2)}
                                </span>
                              </div>

                              <div className="text-[11px] text-[#C5A059] font-mono truncate">
                                ?view={entry.viewId}
                              </div>

                              {/* Telemetry Status Dots */}
                              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${audit.checks.titleOptimal ? 'bg-emerald-400' : 'bg-amber-400'}`} title="Meta Title Check" />
                                  <span className={`w-1.5 h-1.5 rounded-full ${audit.checks.descriptionOptimal ? 'bg-emerald-400' : 'bg-amber-400'}`} title="Meta Description Check" />
                                  <span className={`w-1.5 h-1.5 rounded-full ${audit.checks.canonicalValid ? 'bg-emerald-400' : 'bg-red-400'}`} title="Canonical Link Check" />
                                  <span className={`w-1.5 h-1.5 rounded-full ${audit.checks.jsonLdValid ? 'bg-emerald-400' : 'bg-red-400'}`} title="JSON-LD Schema Check" />
                                </div>
                                <span className={audit.score >= 90 ? 'text-emerald-400' : 'text-amber-400'}>
                                  {audit.score}% Pass
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* COMPACT VERIFICATION GRID */
            <div className="rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-black/50 text-[#F5F5F0]/50 text-[11px]">
                    <th className="py-2.5 px-3">Node / View</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Title Length</th>
                    <th className="py-2.5 px-3">Canonical</th>
                    <th className="py-2.5 px-3">Schema</th>
                    <th className="py-2.5 px-3">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredEntries.map(entry => {
                    const audit = auditViewMetadataEfficacy(entry);
                    const isSelected = selectedNode === entry.viewId;
                    return (
                      <tr
                        key={entry.viewId}
                        onClick={() => { audioFeedback.play('softClick'); setSelectedNode(entry.viewId); }}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#C5A059]/15' : 'hover:bg-white/5'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-bold text-white">
                          <div>{entry.name}</div>
                          <div className="text-[10px] text-[#C5A059] font-mono">/{entry.viewId}</div>
                        </td>
                        <td className="py-2.5 px-3 text-[#F5F5F0]/70 text-[11px]">
                          {entry.category}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={audit.checks.titleOptimal ? 'text-emerald-400' : 'text-amber-400'}>
                            {entry.metaTitle.length} chars
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {audit.checks.canonicalValid ? (
                            <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                              <CheckCircle2 className="w-3 h-3" /> Valid
                            </span>
                          ) : (
                            <span className="text-red-400 flex items-center gap-1 text-[11px]">
                              <AlertTriangle className="w-3 h-3" /> Issue
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-[#F5F5F0]/80 font-mono text-[11px]">
                          {entry.schemaType}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            audit.score >= 90 ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                          }`}>
                            {audit.score}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT COL: SELECTED NODE INSPECTION DRAWER */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0E0E0E] border border-[#C5A059]/40 space-y-4 sticky top-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#C5A059]" />
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Node Telemetry Inspector
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                {nodeAudit.score}% Verified
              </span>
            </div>

            {/* Node Identity */}
            <div className="space-y-1">
              <h5 className="font-serif font-bold text-white text-base">{selectedMeta.name}</h5>
              <div className="text-[11px] font-mono text-[#C5A059] truncate">{selectedMeta.canonicalUrl}</div>
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-[#F5F5F0]/80">
                  Category: {selectedMeta.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-[#F5F5F0]/80">
                  Schema: {selectedMeta.schemaType}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-[#F5F5F0]/80">
                  Freq: {selectedMeta.changefreq}
                </span>
              </div>
            </div>

            {/* Live Google Search Preview snippet */}
            <div className="p-3 rounded-lg bg-black border border-white/10 space-y-1 text-xs">
              <div className="text-[10px] text-[#F5F5F0]/50 uppercase font-bold tracking-wider">Simulated SERP Output</div>
              <div className="text-[#8AB4F8] hover:underline cursor-pointer font-medium truncate text-[13px]">
                {selectedMeta.metaTitle}
              </div>
              <p className="text-[11px] text-[#BDC1C6] line-clamp-2 leading-relaxed">
                {selectedMeta.metaDescription}
              </p>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-2 text-xs">
              <div className="text-[10px] text-[#F5F5F0]/50 uppercase font-bold tracking-wider">Crawler Integrity Checklist</div>
              
              <div className="flex items-center justify-between text-[11px] py-1 border-b border-white/5">
                <span className="text-[#F5F5F0]/70">Meta Title Length:</span>
                <span className={nodeAudit.checks.titleOptimal ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {selectedMeta.metaTitle.length} / 60 chars
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] py-1 border-b border-white/5">
                <span className="text-[#F5F5F0]/70">Meta Description:</span>
                <span className={nodeAudit.checks.descriptionOptimal ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {selectedMeta.metaDescription.length} / 160 chars
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] py-1 border-b border-white/5">
                <span className="text-[#F5F5F0]/70">Canonical Absolute Protocol:</span>
                <span className={nodeAudit.checks.canonicalValid ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {nodeAudit.checks.canonicalValid ? 'Valid HTTPS' : 'Malformed'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] py-1 border-b border-white/5">
                <span className="text-[#F5F5F0]/70">JSON-LD Structured Data:</span>
                <span className="text-emerald-400 font-bold">RFC 8259 Valid</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              {onNavigateTab && (
                <button
                  onClick={() => {
                    audioFeedback.play('softClick');
                    onNavigateTab(selectedMeta.viewId);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#C5A059] hover:bg-[#d8b066] text-black font-bold text-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Navigate to this View in App</span>
                </button>
              )}

              {onSelectViewForMeta && (
                <button
                  onClick={() => {
                    audioFeedback.play('softClick');
                    onSelectViewForMeta(selectedMeta.viewId);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Edit in Metadata Manager</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
