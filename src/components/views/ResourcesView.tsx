import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Code2, 
  Layers, 
  GraduationCap, 
  Search, 
  Filter, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  FolderArchive, 
  Compass, 
  ChevronRight, 
  X,
  Package,
  BookOpen,
  Cpu
} from 'lucide-react';
import { PLATFORM_RESOURCES } from '../../data/platformContentData';
import { ResourceItem, ResourceCategory } from '../../types/platformContent';
import { PageView } from '../../types';

interface ResourcesViewProps {
  onSelectTab?: (tab: PageView) => void;
  onInspectProvenance?: (prov: any) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  onSelectTab,
  onInspectProvenance
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeResourceModal, setActiveResourceModal] = useState<ResourceItem | null>(null);
  const [copiedShaId, setCopiedShaId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Filter resources
  const filteredResources = PLATFORM_RESOURCES.filter((res) => {
    const matchesCat = selectedCategory === 'all' || res.category === selectedCategory;
    const matchesSearch = 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      res.targetAudience.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopySha = (sha: string, id: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedShaId(id);
    setTimeout(() => setCopiedShaId(null), 2000);
  };

  const handleDownload = (id: string) => {
    setDownloadSuccessId(id);
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header & Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-[#F5F5F0]/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.25em] font-bold">
              OPEN COMMONS ARTIFACTS, CAD BLUEPRINTS & DEVELOPER TOOLKITS
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F5F5F0]">
            Resources, Toolkits & Schemas
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 max-w-2xl font-sans leading-relaxed">
            Freely licensed open-hardware CAD schemas, systems simulation mathematical libraries, developer APIs, constitutional governance frameworks, and university curricula.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 text-right">
            <div className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">Open Repositories</div>
            <div className="text-xl font-bold font-mono text-[#C5A059]">100% Free / CC-BY</div>
          </div>
          <div className="p-3.5 rounded-sm bg-[#0D0D0D] border border-blue-500/30 text-right">
            <div className="text-[10px] font-mono text-blue-400 uppercase">Global Downloads</div>
            <div className="text-xl font-bold font-mono text-blue-400">52,400+ Packages</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'toolkit', label: 'Toolkits & Simulation' },
            { id: 'api', label: 'APIs & SDKs' },
            { id: 'template', label: 'CAD & Blueprints' },
            { id: 'document', label: 'Policy Covenants' },
            { id: 'educational_material', label: 'Curricula' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-mono rounded-sm transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/50 shadow-sm font-bold'
                  : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#141414]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search toolkits, CAD, or APIs..."
            className="w-full bg-[#0D0D0D] border border-[#F5F5F0]/10 pl-9 pr-3 py-1.5 text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/30 rounded-sm focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Resources Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F0]/60 border-b border-[#F5F5F0]/10 pb-2">
          <span>Displaying {filteredResources.length} Verified Toolkits & Schemas</span>
          <span className="text-[#C5A059]">● Cryptographic SHA-256 Checksums Verified</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 transition-all flex flex-col justify-between space-y-5 hover:bg-[#121212] group"
            >
              <div className="space-y-3">
                {/* Format & License */}
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 uppercase bg-[#141414] border border-[#F5F5F0]/20 text-[#C5A059] font-bold rounded-sm">
                    {res.categoryLabel}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-sm">
                    {res.fileFormat} • {res.license}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-serif font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs text-[#F5F5F0]/70 line-clamp-3 leading-relaxed font-sans">
                  {res.summary}
                </p>

                {/* Version & Download Count */}
                <div className="pt-2 border-t border-[#F5F5F0]/5 space-y-1 text-xs font-mono text-[#F5F5F0]/60">
                  <div className="flex items-center justify-between">
                    <span>Version: {res.version}</span>
                    <span>{(res.downloadCount).toLocaleString()} Downloads</span>
                  </div>
                  {res.curriculumModuleCode && (
                    <div className="text-[10px] text-emerald-400 font-mono">
                      Curriculum Anchor: {res.curriculumModuleCode}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.tags.slice(0, 3).map((t, i) => (
                    <span key={i} className="px-2 py-0.5 text-[9px] font-mono bg-[#141414] text-[#F5F5F0]/60 rounded-sm">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#F5F5F0]/10 flex items-center justify-between">
                <button
                  onClick={() => setActiveResourceModal(res)}
                  className="text-xs font-mono text-[#C5A059] hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Inspect Specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDownload(res.id)}
                  className={`px-3.5 py-1.5 rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    downloadSuccessId === res.id
                      ? 'bg-emerald-500 text-black'
                      : 'bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadSuccessId === res.id ? 'Downloaded' : 'Download'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RESOURCE SPEC & DOWNLOAD MODAL */}
      {/* ========================================================================= */}
      {activeResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-[#0D0D0D] border border-[#C5A059]/50 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveResourceModal(null)}
              className="absolute top-4 right-4 p-2 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#1A1A1A] rounded-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-3 border-b border-[#F5F5F0]/10 pb-5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1A1A1A] border border-[#F5F5F0]/20 text-[#C5A059] font-bold rounded-sm">
                  {activeResourceModal.categoryLabel}
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-sm">
                  {activeResourceModal.license} License
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  ● Verified Open Package
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0]">
                {activeResourceModal.title}
              </h2>

              <div className="flex flex-wrap gap-4 text-xs font-mono text-[#F5F5F0]/70 pt-1">
                <span>📦 Version: {activeResourceModal.version}</span>
                <span>📅 Last Updated: {activeResourceModal.lastUpdated}</span>
                <span>💾 Size: {(activeResourceModal.fileSizeBytes / 1024 / 1024).toFixed(1)} MB</span>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-3 text-xs sm:text-sm text-[#F5F5F0]/80 leading-relaxed font-sans">
              <p>{activeResourceModal.description}</p>
            </div>

            {/* Target Audience & Prerequisites */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2">
                <div className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                  Target Audience
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeResourceModal.targetAudience.map((aud, i) => (
                    <span key={i} className="px-2 py-1 bg-[#141414] text-xs font-mono text-[#F5F5F0]/80 rounded-sm">
                      {aud}
                    </span>
                  ))}
                </div>
              </div>

              {activeResourceModal.prerequisites && (
                <div className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2">
                  <div className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                    Technical Prerequisites
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeResourceModal.prerequisites.map((req, i) => (
                      <span key={i} className="px-2 py-1 bg-[#141414] text-xs font-mono text-[#F5F5F0]/80 rounded-sm">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cryptographic SHA-256 Checksum Box */}
            <div className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 flex items-center justify-between">
                <span>Cryptographic SHA-256 Checksum</span>
                <span className="text-emerald-400">Authenticity Guaranteed</span>
              </div>
              <div className="flex items-center justify-between gap-2 p-2 bg-[#050505] rounded-sm font-mono text-[11px] text-[#C5A059]">
                <span className="truncate">{activeResourceModal.verifiedSha256}</span>
                <button
                  onClick={() => handleCopySha(activeResourceModal.verifiedSha256, activeResourceModal.id)}
                  className="px-2 py-1 bg-[#141414] hover:bg-[#202020] text-[#F5F5F0] rounded-sm text-[10px] shrink-0 flex items-center gap-1"
                >
                  {copiedShaId === activeResourceModal.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedShaId === activeResourceModal.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Action Links & Download */}
            <div className="p-4 bg-[#141F17] border border-[#C5A059]/40 rounded-sm flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-mono text-[#C5A059] font-bold">
                  Open Commons Distribution
                </div>
                <div className="text-[11px] text-[#F5F5F0]/60 font-sans">
                  Free and unrestricted for research, community deployment, and non-extractive commercial use.
                </div>
              </div>

              <div className="flex items-center gap-3">
                {activeResourceModal.apiDocsUrl && onSelectTab && (
                  <button
                    onClick={() => {
                      setActiveResourceModal(null);
                      onSelectTab('developers');
                    }}
                    className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-[#F5F5F0] border border-[#F5F5F0]/20 text-xs font-mono rounded-sm transition-all"
                  >
                    API Playground
                  </button>
                )}
                <button
                  onClick={() => handleDownload(activeResourceModal.id)}
                  className="px-5 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs rounded-sm flex items-center gap-2 transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Package ({activeResourceModal.fileFormat})</span>
                </button>
              </div>
            </div>

            {/* Provenance & Close */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F0]/10 text-xs font-mono">
              {onInspectProvenance && (
                <button
                  onClick={() => onInspectProvenance(activeResourceModal.provenance)}
                  className="text-[#F5F5F0]/60 hover:text-[#C5A059] flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Inspect Data Provenance</span>
                </button>
              )}
              <button
                onClick={() => setActiveResourceModal(null)}
                className="px-4 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] text-[#F5F5F0] text-xs font-mono rounded-sm transition-colors ml-auto"
              >
                Close Spec
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
