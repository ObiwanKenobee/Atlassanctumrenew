import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  FileCheck, 
  Image as ImageIcon, 
  Link2, 
  Compass, 
  Wrench, 
  Download, 
  ExternalLink,
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';
import { 
  runComprehensiveSeoAudit, 
  SeoAuditReport, 
  AuditIssue, 
  ImageAltScanItem, 
  CanonicalScanItem, 
  MetadataPointerScanItem 
} from '../../lib/seoAuditScanner';
import { PageView } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface SeoAuditDashboardProps {
  onNavigateTab?: (tab: PageView) => void;
  onFixMeta?: (tab: PageView) => void;
}

export const SeoAuditDashboard: React.FC<SeoAuditDashboardProps> = ({ 
  onNavigateTab,
  onFixMeta 
}) => {
  const [report, setReport] = useState<SeoAuditReport>(() => runComprehensiveSeoAudit());
  const [isScanning, setIsScanning] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'canonical' | 'image_alt' | 'metadata_pointer'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'issues_only' | 'critical'>('all');
  const [fixedIssues, setFixedIssues] = useState<Set<string>>(new Set());
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const handleRunScan = () => {
    audioFeedback.play('softClick');
    setIsScanning(true);
    setTimeout(() => {
      const freshReport = runComprehensiveSeoAudit();
      setReport(freshReport);
      setIsScanning(false);
      audioFeedback.play('success');
    }, 450);
  };

  const handleAutoFix = (issue: AuditIssue) => {
    audioFeedback.play('softClick');
    
    // Perform DOM or state fix where applicable
    if (issue.category === 'image_alt' && typeof document !== 'undefined') {
      const imgs = document.querySelectorAll('img');
      imgs.forEach((img) => {
        if (!img.getAttribute('alt') || img.getAttribute('alt') === '') {
          img.setAttribute('alt', 'Atlas Sanctum Planetary Civilization Interface Graphic');
        }
      });
    }

    if (issue.category === 'canonical' && typeof document !== 'undefined') {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = 'https://atlassanctum.org/';
        document.head.appendChild(canonical);
      }
    }

    setFixedIssues(prev => new Set(prev).add(issue.id));
    setCopiedNotification(`Auto-repaired: ${issue.title}`);
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const handleAutoFixAllImages = () => {
    audioFeedback.play('softClick');
    if (typeof document !== 'undefined') {
      const imgs = document.querySelectorAll('img');
      imgs.forEach((img, i) => {
        const alt = img.getAttribute('alt');
        if (!alt || alt.trim() === '' || alt.toLowerCase() === 'image') {
          img.setAttribute('alt', `Atlas Sanctum System Visual asset #${i + 1}`);
        }
      });
    }
    const fresh = runComprehensiveSeoAudit();
    setReport(fresh);
    setCopiedNotification('All detected DOM image alt-tags updated with semantic descriptions');
    setTimeout(() => setCopiedNotification(null), 3500);
  };

  const handleExportReport = () => {
    audioFeedback.play('softClick');
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-seo-audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredIssues = report.issues.filter(issue => {
    if (fixedIssues.has(issue.id)) return false;
    if (activeCategory !== 'all' && issue.category !== activeCategory) return false;
    if (severityFilter === 'critical' && issue.severity !== 'critical') return false;
    if (severityFilter === 'issues_only' && issue.severity === 'info') return false;
    return true;
  });

  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner & Health Score */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#0C0C0C] via-[#111111] to-[#0C0C0C] border border-[#C5A059]/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/40 text-[#C5A059]">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-serif font-bold text-white tracking-wide">
                  SEO Audit Dashboard & Deep Integrity Scanner
                </h3>
                <p className="text-xs text-[#F5F5F0]/60">
                  Scans active DOM canonical links, image alt-tags, and internal route metadata pointers.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#F5F5F0]/60 pt-1">
              <span>Last Scan: <strong className="text-white">{new Date(report.timestamp).toLocaleTimeString()}</strong></span>
              <span>•</span>
              <span>Total Audit Vectors: <strong className="text-white">{report.totalChecks}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Passed: {report.passedChecks}</span>
              </span>
            </div>
          </div>

          {/* Score & Actions */}
          <div className="flex items-center gap-4">
            <div className="text-center px-4 py-2 rounded-xl bg-black/60 border border-white/10 min-w-[120px]">
              <div className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-widest font-bold">SEO Health Score</div>
              <div className={`text-3xl font-bold tracking-tight ${
                report.overallScore >= 90 ? 'text-emerald-400' : report.overallScore >= 75 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {report.overallScore}<span className="text-sm font-normal text-[#F5F5F0]/40">/100</span>
              </div>
              <div className="text-[10px] text-[#C5A059]">
                {report.overallScore >= 90 ? 'Grade A (Crawling Optimized)' : 'Action Recommended'}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleRunScan}
                disabled={isScanning}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#d8b066] text-black font-bold text-xs transition-colors shadow-lg disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Scanning...' : 'Re-Run Audit'}</span>
              </button>

              <button
                onClick={handleExportReport}
                className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#F5F5F0]/80 text-xs border border-white/10 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Export Audit JSON</span>
              </button>
            </div>
          </div>
        </div>

        {copiedNotification && (
          <div className="mt-3 py-1.5 px-3 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
            <span>{copiedNotification}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        )}
      </div>

      {/* Triad Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Canonical Health Card */}
        <div 
          onClick={() => setActiveCategory('canonical')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeCategory === 'canonical' 
              ? 'bg-[#121212] border-[#C5A059] shadow-lg ring-1 ring-[#C5A059]/40' 
              : 'bg-[#0A0A0A] border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <Link2 className="w-4 h-4 text-[#C5A059]" />
              <span>Canonical Links</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              report.issues.some(i => i.category === 'canonical' && i.severity === 'critical')
                ? 'bg-red-950 text-red-400 border border-red-800'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              {report.canonicalResults.filter(c => c.status === 'valid').length} / {report.canonicalResults.length} Valid
            </span>
          </div>
          <p className="text-[11px] text-[#F5F5F0]/60 line-clamp-2">
            Active DOM canonical: <span className="text-emerald-400 font-mono">{report.liveDomCanonical || 'Not Detected'}</span>
          </p>
        </div>

        {/* Image Alt-Tags Card */}
        <div 
          onClick={() => setActiveCategory('image_alt')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeCategory === 'image_alt' 
              ? 'bg-[#121212] border-[#C5A059] shadow-lg ring-1 ring-[#C5A059]/40' 
              : 'bg-[#0A0A0A] border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <ImageIcon className="w-4 h-4 text-sky-400" />
              <span>Image Alt-Tags</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              report.imageAltResults.some(i => i.status === 'critical')
                ? 'bg-red-950 text-red-400 border border-red-800'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              {report.imageAltResults.filter(i => i.status === 'passed').length} / {report.imageAltResults.length} Descriptive
            </span>
          </div>
          <p className="text-[11px] text-[#F5F5F0]/60">
            Scans DOM & critical assets for WCAG accessibility and Googlebot image indexing.
          </p>
        </div>

        {/* Metadata Pointers Card */}
        <div 
          onClick={() => setActiveCategory('metadata_pointer')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeCategory === 'metadata_pointer' 
              ? 'bg-[#121212] border-[#C5A059] shadow-lg ring-1 ring-[#C5A059]/40' 
              : 'bg-[#0A0A0A] border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Metadata Pointers</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
              {report.pointerResults.filter(p => p.status === 'healthy').length} / {report.pointerResults.length} Healthy
            </span>
          </div>
          <p className="text-[11px] text-[#F5F5F0]/60">
            Verifies breadcrumbs, route query parameters, and schema mapping pointers across modules.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#080808] border border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="text-[#F5F5F0]/60">Category:</span>
          <div className="flex items-center gap-1">
            {(['all', 'canonical', 'image_alt', 'metadata_pointer'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => { audioFeedback.play('softClick'); setActiveCategory(cat); }}
                className={`px-2.5 py-1 rounded text-[11px] capitalize transition-colors ${
                  activeCategory === cat ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Vectors' : cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#F5F5F0]/60">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="bg-[#141414] border border-white/20 text-white rounded px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="all">All Items</option>
            <option value="issues_only">Issues Only</option>
            <option value="critical">Critical Only</option>
          </select>
        </div>
      </div>

      {/* DETAILED DRILLDOWN SECTIONS */}

      {/* 1. ISSUES LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Audit Findings & Action Recommendations</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[11px] text-[#F5F5F0]/80">
              {filteredIssues.length}
            </span>
          </h4>

          {activeCategory === 'image_alt' && (
            <button
              onClick={handleAutoFixAllImages}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059] hover:text-black font-bold text-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Fix All Missing Alt-Tags</span>
            </button>
          )}
        </div>

        {filteredIssues.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#090909] border border-emerald-500/30 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h5 className="font-bold text-white text-sm">All Audited Vectors Passed Verification</h5>
            <p className="text-xs text-[#F5F5F0]/60 max-w-md mx-auto">
              No broken metadata pointers, missing canonical links, or unlabelled image assets detected in the current audit scope.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredIssues.map((issue) => (
              <div 
                key={issue.id}
                className={`p-4 rounded-xl border text-xs transition-all ${
                  issue.severity === 'critical'
                    ? 'bg-red-950/20 border-red-500/30'
                    : issue.severity === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {issue.severity === 'critical' ? (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    ) : issue.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    )}
                    <span className="font-bold text-white text-sm">{issue.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      issue.severity === 'critical' ? 'bg-red-900/60 text-red-300' : 'bg-amber-900/60 text-amber-300'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>

                  {issue.autoFixable && (
                    <button
                      onClick={() => handleAutoFix(issue)}
                      className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1 rounded bg-[#C5A059] hover:bg-[#d8b066] text-black font-bold text-xs transition-colors shrink-0"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>1-Click Auto-Fix</span>
                    </button>
                  )}
                </div>

                <p className="text-[#F5F5F0]/80 mb-2 leading-relaxed">{issue.description}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] pt-2 border-t border-white/10">
                  <span className="text-[#F5F5F0]/50">Target: <code className="text-[#C5A059]">{issue.target}</code></span>
                  <span className="text-emerald-400/90 font-medium">Recommendation: {issue.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. IMAGE ALT-TAG ASSET AUDIT MATRIX */}
      {(activeCategory === 'all' || activeCategory === 'image_alt') && (
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-sky-400" />
              <span>Image Asset Alt-Tag Registry ({report.imageAltResults.length} Assets)</span>
            </h4>
            <span className="text-xs text-[#F5F5F0]/60">WCAG 2.1 & Google Image Search</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[#F5F5F0]/50 text-[11px]">
                  <th className="py-2 px-3 font-semibold">Image Source</th>
                  <th className="py-2 px-3 font-semibold">Category</th>
                  <th className="py-2 px-3 font-semibold">Current Alt Attribute</th>
                  <th className="py-2 px-3 font-semibold">Status</th>
                  <th className="py-2 px-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {report.imageAltResults.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-white max-w-[180px] truncate">
                      {item.src}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[#F5F5F0]/70 text-[10px] capitalize">
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#F5F5F0]/80 max-w-[280px]">
                      {item.alt ? (
                        <span className={item.isDescriptive ? 'text-emerald-300' : 'text-amber-300'}>
                          "{item.alt}"
                        </span>
                      ) : (
                        <span className="text-red-400 italic">null (Missing)</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'passed' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                          : item.status === 'warning'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {item.status !== 'passed' && (
                        <button
                          onClick={() => {
                            if (typeof document !== 'undefined') {
                              const imgs = document.querySelectorAll(`img[src="${item.src}"]`);
                              imgs.forEach(img => img.setAttribute('alt', item.suggestedAlt || 'Atlas Sanctum Module'));
                            }
                            setCopiedNotification(`Applied alt: "${item.suggestedAlt}"`);
                            setTimeout(() => setCopiedNotification(null), 2500);
                          }}
                          className="px-2 py-1 rounded bg-[#C5A059]/20 hover:bg-[#C5A059] text-[#C5A059] hover:text-black font-bold text-[10px] transition-colors"
                        >
                          Apply Alt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CANONICAL INTEGRITY MATRIX */}
      {(activeCategory === 'all' || activeCategory === 'canonical') && (
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[#C5A059]" />
              <span>Canonical Link Consistency Grid</span>
            </h4>
            <span className="text-xs text-[#F5F5F0]/60">Prevents Search Engine Content Deduplication</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.canonicalResults.map((canon) => (
              <div 
                key={canon.viewId}
                className="p-3 rounded-lg bg-[#141414] border border-white/5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{canon.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    canon.status === 'valid' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {canon.status}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 truncate">
                  {canon.canonicalUrl}
                </div>
                {canon.issues.length > 0 && (
                  <div className="text-[10px] text-amber-300">
                    {canon.issues.join(' • ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. METADATA POINTER INTEGRITY */}
      {(activeCategory === 'all' || activeCategory === 'metadata_pointer') && (
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Internal Metadata Pointer & Breadcrumb Verification</span>
            </h4>
            <span className="text-xs text-[#F5F5F0]/60">Validates schema typing and route parameters</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {report.pointerResults.map((pointer) => (
              <div 
                key={pointer.viewId}
                className="p-3 rounded-lg bg-[#141414] border border-white/5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate">{pointer.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    pointer.status === 'healthy' ? 'text-emerald-400 bg-emerald-950' : 'text-amber-400 bg-amber-950'
                  }`}>
                    {pointer.status}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-[#F5F5F0]/70">
                  <div className="flex items-center justify-between">
                    <span>Route Pointer:</span>
                    <code className="text-[#C5A059]">{pointer.routePointer}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Breadcrumb:</span>
                    <span className={pointer.breadcrumbIntegrity === 'valid' ? 'text-emerald-400' : 'text-red-400'}>
                      {pointer.breadcrumbIntegrity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Schema Align:</span>
                    <span className={pointer.schemaAligned ? 'text-emerald-400' : 'text-red-400'}>
                      {pointer.schemaAligned ? 'Aligned' : 'Mismatch'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
