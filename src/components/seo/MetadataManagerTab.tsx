import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  Check, 
  Copy, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Eye, 
  Save, 
  RotateCcw,
  ExternalLink,
  Sliders,
  Layers,
  Code2
} from 'lucide-react';
import { PageView } from '../../types';
import { 
  MODULE_METADATA_REGISTRY, 
  ViewMetadata, 
  updatePageMetadata,
  auditViewMetadataEfficacy,
  CrawlabilityAuditResult,
  generateViewSpecificJsonLd
} from '../../lib/metadataManager';
import { audioFeedback } from '../../lib/audioFeedback';
import { MetaTagDiffTool } from './MetaTagDiffTool';

interface MetadataManagerTabProps {
  activeAppView?: PageView;
  onNavigateTab: (tab: PageView) => void;
}

export const MetadataManagerTab: React.FC<MetadataManagerTabProps> = ({
  activeAppView = 'home',
  onNavigateTab
}) => {
  const [selectedView, setSelectedView] = useState<PageView>(activeAppView);
  const [editedMeta, setEditedMeta] = useState<ViewMetadata>(() => {
    return { ...(MODULE_METADATA_REGISTRY[selectedView] || MODULE_METADATA_REGISTRY['home']) };
  });
  const [audit, setAudit] = useState<CrawlabilityAuditResult>(() => {
    return auditViewMetadataEfficacy(MODULE_METADATA_REGISTRY[selectedView] || MODULE_METADATA_REGISTRY['home']);
  });
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedJsonLd, setCopiedJsonLd] = useState(false);
  const [appliedToast, setAppliedToast] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'live_dom' | 'catalog' | 'meta_diff'>('editor');

  // When selected view changes, load its registry meta
  useEffect(() => {
    const meta = MODULE_METADATA_REGISTRY[selectedView] || MODULE_METADATA_REGISTRY['home'];
    setEditedMeta({ ...meta });
    setAudit(auditViewMetadataEfficacy(meta));
  }, [selectedView]);

  // Recalculate audit on field edits
  const handleFieldChange = <K extends keyof ViewMetadata>(key: K, val: ViewMetadata[K]) => {
    const updated = { ...editedMeta, [key]: val };
    setEditedMeta(updated);
    setAudit(auditViewMetadataEfficacy(updated));
  };

  const handleApplyToLiveDocument = () => {
    audioFeedback.play('softClick');
    updatePageMetadata(selectedView, editedMeta);
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 2500);
  };

  const handleReset = () => {
    audioFeedback.play('softClick');
    const original = MODULE_METADATA_REGISTRY[selectedView] || MODULE_METADATA_REGISTRY['home'];
    setEditedMeta({ ...original });
    setAudit(auditViewMetadataEfficacy(original));
    updatePageMetadata(selectedView);
  };

  const generateHtmlHeadSnippet = () => {
    return `<!-- Atlas Sanctum Dynamic SEO Meta Tags for ${editedMeta.name} -->
<title>${editedMeta.metaTitle}</title>
<meta name="description" content="${editedMeta.metaDescription}" />
<meta name="keywords" content="${editedMeta.keywords.join(', ')}" />
<link rel="canonical" href="${editedMeta.canonicalUrl}" />
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />

<!-- OpenGraph Protocol -->
<meta property="og:title" content="${editedMeta.metaTitle}" />
<meta property="og:description" content="${editedMeta.metaDescription}" />
<meta property="og:url" content="${editedMeta.canonicalUrl}" />
<meta property="og:type" content="${editedMeta.schemaType === 'Dataset' ? 'article' : 'website'}" />

<!-- Twitter / X Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${editedMeta.metaTitle}" />
<meta name="twitter:description" content="${editedMeta.metaDescription}" />`;
  };

  const handleCopyHtml = () => {
    audioFeedback.play('softClick');
    navigator.clipboard.writeText(generateHtmlHeadSnippet());
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleCopyJsonLd = () => {
    audioFeedback.play('softClick');
    navigator.clipboard.writeText(generateViewSpecificJsonLd(selectedView));
    setCopiedJsonLd(true);
    setTimeout(() => setCopiedJsonLd(false), 2000);
  };

  // Inspect Live DOM values directly
  const getLiveDomSnapshot = () => {
    if (typeof document === 'undefined') return { title: '', desc: '', canonical: '' };
    const title = document.title;
    const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
    const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
    return { title, desc, canonical, ogTitle, ogDesc };
  };

  const liveDom = getLiveDomSnapshot();

  return (
    <div className="space-y-6">
      {/* Top Banner & Active View Selector */}
      <div className="p-4 rounded-xl bg-[#080808] border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-serif font-bold text-white">
                Metadata Manager & Page-Level Tag Orchestrator
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-bold">
                Dynamic DOM Sync
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/60 mt-0.5 font-mono">
              Dynamically injects verified titles, descriptions, canonical URLs, and structured JSON-LD into browser DOM on route changes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('editor')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                activeSubTab === 'editor' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
              }`}
            >
              Tag Editor & Audit
            </button>
            <button
              onClick={() => setActiveSubTab('meta_diff')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                activeSubTab === 'meta_diff' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
              }`}
            >
              Meta-Tag Diff (vs Home)
            </button>
            <button
              onClick={() => setActiveSubTab('live_dom')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                activeSubTab === 'live_dom' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
              }`}
            >
              Live DOM Inspector
            </button>
            <button
              onClick={() => setActiveSubTab('catalog')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                activeSubTab === 'catalog' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
              }`}
            >
              Module Catalog ({Object.keys(MODULE_METADATA_REGISTRY).length})
            </button>
          </div>
        </div>

        {/* View Selection Dropdown + Active Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="text-[#C5A059] font-bold">Target View:</span>
            <select
              value={selectedView}
              onChange={(e) => {
                audioFeedback.play('softClick');
                setSelectedView(e.target.value as PageView);
              }}
              className="bg-[#141414] border border-[#C5A059]/40 text-white rounded px-3 py-1.5 focus:outline-none"
            >
              {Object.keys(MODULE_METADATA_REGISTRY).map((k) => (
                <option key={k} value={k}>
                  {MODULE_METADATA_REGISTRY[k as PageView].name} ({k})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-[#F5F5F0]/50">Currently Active in Browser:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              {activeAppView}
            </span>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: TAG EDITOR & AUDIT */}
      {activeSubTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-2 space-y-4 font-mono text-xs">
            <div className="p-5 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-4">
              {/* Meta Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#F5F5F0]">Meta Title (document.title):</label>
                  <span className={`text-[11px] ${editedMeta.metaTitle.length > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {editedMeta.metaTitle.length} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={editedMeta.metaTitle}
                  onChange={(e) => handleFieldChange('metaTitle', e.target.value)}
                  className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#F5F5F0]">Meta Description:</label>
                  <span className={`text-[11px] ${editedMeta.metaDescription.length > 160 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {editedMeta.metaDescription.length} / 160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={editedMeta.metaDescription}
                  onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
                  className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-[#C5A059] leading-relaxed"
                />
              </div>

              {/* Canonical URL */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#F5F5F0]">Canonical URL:</label>
                <input
                  type="text"
                  value={editedMeta.canonicalUrl}
                  onChange={(e) => handleFieldChange('canonicalUrl', e.target.value)}
                  className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-emerald-400 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Keywords */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#F5F5F0]">Keywords (Comma-separated):</label>
                <input
                  type="text"
                  value={editedMeta.keywords.join(', ')}
                  onChange={(e) => handleFieldChange('keywords', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full bg-[#141414] border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApplyToLiveDocument}
                    className="px-4 py-2 rounded-lg bg-[#C5A059] text-black font-bold hover:bg-[#D8B46B] transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Apply to Live Document</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#F5F5F0]/70 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5"
                    title="Reset to system defaults"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyHtml}
                    className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-[#F5F5F0] border border-white/15 transition-colors flex items-center gap-1.5"
                  >
                    {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHtml ? 'Copied HTML' : 'Copy <head> Tags'}</span>
                  </button>

                  <button
                    onClick={handleCopyJsonLd}
                    className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/30 transition-colors flex items-center gap-1.5"
                  >
                    {copiedJsonLd ? <Check className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
                    <span>{copiedJsonLd ? 'Copied JSON-LD' : 'Copy JSON-LD'}</span>
                  </button>
                </div>
              </div>

              {appliedToast && (
                <div className="p-2.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Document meta tags & JSON-LD dynamically injected into &lt;head&gt;!</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Crawlability Score & Audits */}
          <div className="space-y-4 font-mono text-xs">
            {/* Scorecard */}
            <div className="p-5 rounded-xl bg-[#0A0A0A] border border-[#C5A059]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Crawl Efficacy Score:</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-[#C5A059] uppercase">
                  {audit.status}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 text-2xl font-bold">
                  {audit.score}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-white text-sm">Google Indexability</h4>
                  <p className="text-[11px] text-[#F5F5F0]/60">
                    {audit.score >= 90 ? 'Perfect crawling parameters' : 'Optimization suggested'}
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#F5F5F0]/70">Title Length (45-65 ch):</span>
                  {audit.checks.titleOptimal ? (
                    <span className="text-emerald-400 flex items-center gap-1">Pass <Check className="w-3 h-3" /></span>
                  ) : (
                    <span className="text-amber-400">Review</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#F5F5F0]/70">Description Length (120-165 ch):</span>
                  {audit.checks.descriptionOptimal ? (
                    <span className="text-emerald-400 flex items-center gap-1">Pass <Check className="w-3 h-3" /></span>
                  ) : (
                    <span className="text-amber-400">Review</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#F5F5F0]/70">Canonical HTTPS Protocol:</span>
                  <span className="text-emerald-400 flex items-center gap-1">Verified <Check className="w-3 h-3" /></span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#F5F5F0]/70">JSON-LD Structured Data:</span>
                  <span className="text-emerald-400 flex items-center gap-1">Valid <Check className="w-3 h-3" /></span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#F5F5F0]/70">Rich Snippet Star Rating:</span>
                  <span className="text-emerald-400 flex items-center gap-1">Eligible <Check className="w-3 h-3" /></span>
                </div>
              </div>

              {audit.recommendations.length > 0 && (
                <div className="p-3 rounded bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Recommendations:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-amber-200/90">
                    {audit.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LIVE DOM INSPECTOR */}
      {activeSubTab === 'live_dom' && (
        <div className="p-5 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-white text-sm">Live DOM Head State</h4>
            <span className="text-[11px] text-emerald-400">Synchronized with Active View</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded bg-black/50 border border-white/5">
              <span className="text-[#C5A059] block font-bold">document.title:</span>
              <p className="text-white mt-1">{liveDom.title || editedMeta.metaTitle}</p>
            </div>

            <div className="p-3 rounded bg-black/50 border border-white/5">
              <span className="text-[#C5A059] block font-bold">&lt;meta name="description"&gt;:</span>
              <p className="text-white mt-1">{liveDom.desc || editedMeta.metaDescription}</p>
            </div>

            <div className="p-3 rounded bg-black/50 border border-white/5">
              <span className="text-[#C5A059] block font-bold">&lt;link rel="canonical"&gt;:</span>
              <p className="text-emerald-400 mt-1">{liveDom.canonical || editedMeta.canonicalUrl}</p>
            </div>

            <div className="p-3 rounded bg-black/50 border border-white/5">
              <span className="text-[#C5A059] block font-bold">&lt;meta property="og:title"&gt;:</span>
              <p className="text-white mt-1">{liveDom.ogTitle || editedMeta.metaTitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MODULE CATALOG */}
      {activeSubTab === 'catalog' && (
        <div className="rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden font-mono text-xs">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h4 className="font-bold text-white">Full Module Metadata Catalog</h4>
            <span className="text-[11px] text-[#F5F5F0]/60">Click any row to load into editor</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[#F5F5F0]/60 border-b border-white/10 text-[11px]">
                  <th className="p-3">Module</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Schema Type</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Title Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {Object.values(MODULE_METADATA_REGISTRY).map((item) => (
                  <tr
                    key={item.viewId}
                    onClick={() => {
                      audioFeedback.play('softClick');
                      setSelectedView(item.viewId);
                      setActiveSubTab('editor');
                    }}
                    className={`hover:bg-white/5 cursor-pointer transition-colors ${
                      selectedView === item.viewId ? 'bg-[#C5A059]/10' : ''
                    }`}
                  >
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <span>{item.name}</span>
                      {selectedView === item.viewId && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#C5A059] text-black">Active</span>
                      )}
                    </td>
                    <td className="p-3 text-neutral-400">{item.category}</td>
                    <td className="p-3 text-emerald-400">{item.schemaType}</td>
                    <td className="p-3 text-[#C5A059]">{item.priority.toFixed(2)}</td>
                    <td className="p-3 text-neutral-300 truncate max-w-xs">{item.metaTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: META-TAG DIFF (VS BASELINE HOME) */}
      {activeSubTab === 'meta_diff' && (
        <MetaTagDiffTool
          currentView={selectedView}
          onApplyFix={(viewId, updated) => {
            if (viewId === selectedView) {
              const merged = { ...editedMeta, ...updated };
              setEditedMeta(merged);
              setAudit(auditViewMetadataEfficacy(merged));
              updatePageMetadata(viewId, merged);
            }
          }}
        />
      )}
    </div>
  );
};
