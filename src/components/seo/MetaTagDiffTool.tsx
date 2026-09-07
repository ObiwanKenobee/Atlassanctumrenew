import React, { useState } from 'react';
import { 
  GitCompare, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Wrench, 
  ArrowRight, 
  Copy, 
  Check, 
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';
import { PageView } from '../../types';
import { 
  MODULE_METADATA_REGISTRY, 
  ViewMetadata 
} from '../../lib/metadataManager';
import { audioFeedback } from '../../lib/audioFeedback';

interface MetaTagDiffToolProps {
  currentView?: PageView;
  onApplyFix?: (viewId: PageView, updated: Partial<ViewMetadata>) => void;
}

interface DiffRiskAlert {
  id: string;
  field: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  explanation: string;
  fixAction?: {
    label: string;
    apply: () => void;
  };
}

export const MetaTagDiffTool: React.FC<MetaTagDiffToolProps> = ({ 
  currentView = 'observatory',
  onApplyFix 
}) => {
  const [selectedView, setSelectedView] = useState<PageView>(currentView === 'home' ? 'observatory' : currentView);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const homeMeta = MODULE_METADATA_REGISTRY['home'];
  const targetMeta = MODULE_METADATA_REGISTRY[selectedView] || MODULE_METADATA_REGISTRY['observatory'];

  // Calculate deep deviations and indexation risks
  const riskAlerts: DiffRiskAlert[] = [];

  // 1. CANONICAL URL COLLISION CHECK (Highest Severity)
  if (targetMeta.canonicalUrl === homeMeta.canonicalUrl && targetMeta.viewId !== 'home') {
    riskAlerts.push({
      id: 'canonical-duplicate-risk',
      field: 'canonicalUrl',
      severity: 'critical',
      title: 'CRITICAL: Duplicate Canonical Collision with Home',
      explanation: `Target view "${targetMeta.viewId}" points its canonical URL directly to root ("${homeMeta.canonicalUrl}"). Googlebot will collapse this entire view into the home page and omit it from search indexation.`,
      fixAction: {
        label: 'Isolate Canonical to ?view=' + targetMeta.viewId,
        apply: () => {
          onApplyFix?.(targetMeta.viewId, { canonicalUrl: `https://atlassanctum.org/?view=${targetMeta.viewId}` });
          setAppliedNotification('Isolated canonical URL with view query parameter');
          setTimeout(() => setAppliedNotification(null), 3000);
        }
      }
    });
  }

  // 2. TITLE COLLISION / BRAND SUFFIX CHECK
  if (targetMeta.metaTitle === homeMeta.metaTitle && targetMeta.viewId !== 'home') {
    riskAlerts.push({
      id: 'title-identical-risk',
      field: 'metaTitle',
      severity: 'critical',
      title: 'Title Tag Collision (Duplicate Title)',
      explanation: 'Target view shares the exact identical <title> as the Home view. This leads to title tag duplication warnings in Google Search Console.',
      fixAction: {
        label: 'Auto-Generate View-Specific Title',
        apply: () => {
          onApplyFix?.(targetMeta.viewId, { metaTitle: `${targetMeta.name} | Atlas Sanctum` });
          setAppliedNotification('Updated title to maintain distinct page identity');
          setTimeout(() => setAppliedNotification(null), 3000);
        }
      }
    });
  } else if (!targetMeta.metaTitle.includes('Atlas Sanctum') && !targetMeta.metaTitle.includes('Atlas')) {
    riskAlerts.push({
      id: 'title-missing-brand',
      field: 'metaTitle',
      severity: 'warning',
      title: 'Missing Brand Anchor in Title',
      explanation: 'Title does not include the root brand name "Atlas Sanctum". Brand consistency strengthens sitelinks grouping in SERPs.',
      fixAction: {
        label: 'Append "| Atlas Sanctum"',
        apply: () => {
          onApplyFix?.(targetMeta.viewId, { metaTitle: `${targetMeta.metaTitle} | Atlas Sanctum` });
          setAppliedNotification('Appended brand anchor to title');
          setTimeout(() => setAppliedNotification(null), 3000);
        }
      }
    });
  }

  // 3. DESCRIPTION OVERLAP & THINNESS
  const descOverlap = targetMeta.metaDescription === homeMeta.metaDescription;
  if (descOverlap && targetMeta.viewId !== 'home') {
    riskAlerts.push({
      id: 'desc-identical-risk',
      field: 'metaDescription',
      severity: 'critical',
      title: 'Duplicate Meta Description',
      explanation: 'Target view uses the exact same meta description as the Home view. Google requires unique meta descriptions for distinct URLs to present relevant snippets.',
    });
  } else if (targetMeta.metaDescription.length < 80) {
    riskAlerts.push({
      id: 'desc-thin-risk',
      field: 'metaDescription',
      severity: 'warning',
      title: 'Thin Meta Description Snippet',
      explanation: `Target view description is only ${targetMeta.metaDescription.length} characters (baseline Home is ${homeMeta.metaDescription.length} chars). Target at least 130-160 characters for optimal click-through rate.`,
    });
  }

  // 4. KEYWORDS INTERSECTION
  const homeKeywordSet = new Set(homeMeta.keywords.map(k => k.toLowerCase()));
  const targetKeywordSet = new Set(targetMeta.keywords.map(k => k.toLowerCase()));
  const sharedKeywords = targetMeta.keywords.filter(k => homeKeywordSet.has(k.toLowerCase()));
  const uniqueTargetKeywords = targetMeta.keywords.filter(k => !homeKeywordSet.has(k.toLowerCase()));

  if (targetMeta.keywords.length < 3) {
    riskAlerts.push({
      id: 'keywords-deficient',
      field: 'keywords',
      severity: 'warning',
      title: 'Sparse Keyword Mapping',
      explanation: `Only ${targetMeta.keywords.length} keywords defined for this module. Baseline Home has ${homeMeta.keywords.length} keywords.`,
    });
  }

  // Overall Indexing Risk Level
  const criticalCount = riskAlerts.filter(r => r.severity === 'critical').length;
  const warningCount = riskAlerts.filter(r => r.severity === 'warning').length;
  const riskLevel = criticalCount > 0 ? 'HIGH_RISK' : warningCount > 0 ? 'MODERATE_RISK' : 'OPTIMAL_DIFFERENTIATION';

  return (
    <div className="space-y-6 font-mono">
      {/* Header & Target Selector */}
      <div className="p-5 rounded-xl bg-[#090909] border border-white/10 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30">
                <GitCompare className="w-4 h-4" />
              </span>
              <h3 className="text-base font-serif font-bold text-white tracking-wide">
                Meta-Tag Diff & Indexing Anomaly Detector
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                riskLevel === 'OPTIMAL_DIFFERENTIATION'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : riskLevel === 'MODERATE_RISK'
                  ? 'bg-amber-950 text-amber-400 border-amber-800'
                  : 'bg-red-950 text-red-400 border-red-800 animate-pulse'
              }`}>
                {riskLevel === 'OPTIMAL_DIFFERENTIATION' ? 'Optimal Differentiation' : riskLevel.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/60">
              Compares dynamically updated child module tags against the baseline <strong>Home</strong> view to detect accidental duplicate content, title collisions, and canonical leakage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#C5A059] font-bold">Compare Module:</span>
            <select
              value={selectedView}
              onChange={(e) => {
                audioFeedback.play('softClick');
                setSelectedView(e.target.value as PageView);
              }}
              className="bg-[#141414] border border-[#C5A059]/40 text-white rounded px-3 py-1.5 text-xs focus:outline-none"
            >
              {Object.values(MODULE_METADATA_REGISTRY)
                .filter(m => m.viewId !== 'home')
                .map(m => (
                  <option key={m.viewId} value={m.viewId}>{m.name}</option>
                ))}
            </select>
          </div>
        </div>

        {appliedNotification && (
          <div className="p-2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{appliedNotification}</span>
          </div>
        )}
      </div>

      {/* Indexation Anomaly Alerts Box */}
      {riskAlerts.length > 0 ? (
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Detected Deviations & Indexing Risks ({riskAlerts.length})</span>
          </div>

          {riskAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alert.severity === 'critical'
                  ? 'bg-red-950/30 border-red-500/40 text-red-200'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  {alert.severity === 'critical' ? (
                    <XCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{alert.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-white/80 uppercase">
                    Field: {alert.field}
                  </span>
                </div>
                <p className="text-xs text-[#F5F5F0]/80 leading-relaxed max-w-2xl">
                  {alert.explanation}
                </p>
              </div>

              {alert.fixAction && (
                <button
                  onClick={() => {
                    audioFeedback.play('softClick');
                    alert.fixAction?.apply();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#C5A059] hover:bg-[#d8b066] text-black font-bold text-xs transition-colors shrink-0 self-start sm:self-auto"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{alert.fixAction.label}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <strong>Zero SEO Indexing Collisions Detected</strong>. View "{targetMeta.name}" demonstrates healthy canonical divergence, distinct title syntax, and targeted semantic keyword differentiation from baseline Home.
          </div>
        </div>
      )}

      {/* Side-by-Side Visual Diff Table */}
      <div className="rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-[#C5A059]" />
            <span>Comparative Field-by-Field Diff Matrix</span>
          </span>
          <span className="text-[11px] text-[#F5F5F0]/50">
            Baseline: <strong className="text-white">Home View</strong> vs Target: <strong className="text-[#C5A059]">{targetMeta.name}</strong>
          </span>
        </div>

        <div className="divide-y divide-white/5 text-xs">
          {/* Row 1: Title */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3 font-bold text-[#F5F5F0]/70">
              <div>Page Title (metaTitle)</div>
              <div className="text-[10px] text-[#F5F5F0]/40 font-normal">SERP headline element</div>
            </div>
            <div className="md:col-span-4 p-2.5 rounded bg-white/5 space-y-1">
              <div className="text-[10px] text-[#F5F5F0]/50 uppercase font-bold">Baseline (Home)</div>
              <div className="text-[#F5F5F0]/80 font-sans">{homeMeta.metaTitle}</div>
              <div className="text-[10px] text-[#F5F5F0]/40">{homeMeta.metaTitle.length} chars</div>
            </div>
            <div className="md:col-span-5 p-2.5 rounded bg-[#C5A059]/10 border border-[#C5A059]/20 space-y-1">
              <div className="text-[10px] text-[#C5A059] uppercase font-bold flex items-center justify-between">
                <span>Target ({targetMeta.viewId})</span>
                <span className="text-emerald-400">Diverged (+{targetMeta.metaTitle.length - homeMeta.metaTitle.length} chars)</span>
              </div>
              <div className="text-white font-bold font-sans">{targetMeta.metaTitle}</div>
              <div className="text-[10px] text-emerald-400">{targetMeta.metaTitle.length} chars • Distinct</div>
            </div>
          </div>

          {/* Row 2: Canonical URL */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3 font-bold text-[#F5F5F0]/70">
              <div>Canonical Target</div>
              <div className="text-[10px] text-[#F5F5F0]/40 font-normal">Deduplication anchor</div>
            </div>
            <div className="md:col-span-4 p-2.5 rounded bg-white/5 space-y-1">
              <div className="text-[10px] text-[#F5F5F0]/50 uppercase font-bold">Baseline (Home)</div>
              <div className="text-[#F5F5F0]/80 font-mono text-[11px]">{homeMeta.canonicalUrl}</div>
            </div>
            <div className={`md:col-span-5 p-2.5 rounded border space-y-1 ${
              targetMeta.canonicalUrl === homeMeta.canonicalUrl
                ? 'bg-red-950/40 border-red-500/40 text-red-300'
                : 'bg-emerald-950/20 border-emerald-500/30'
            }`}>
              <div className="text-[10px] uppercase font-bold flex items-center justify-between">
                <span className="text-[#C5A059]">Target ({targetMeta.viewId})</span>
                <span className={targetMeta.canonicalUrl !== homeMeta.canonicalUrl ? 'text-emerald-400' : 'text-red-400'}>
                  {targetMeta.canonicalUrl !== homeMeta.canonicalUrl ? 'Isolated (Correct)' : 'Collision!'}
                </span>
              </div>
              <div className="text-emerald-400 font-mono text-[11px]">{targetMeta.canonicalUrl}</div>
            </div>
          </div>

          {/* Row 3: Meta Description */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3 font-bold text-[#F5F5F0]/70">
              <div>Meta Description</div>
              <div className="text-[10px] text-[#F5F5F0]/40 font-normal">Snippet text under title</div>
            </div>
            <div className="md:col-span-4 p-2.5 rounded bg-white/5 space-y-1">
              <div className="text-[10px] text-[#F5F5F0]/50 uppercase font-bold">Baseline (Home)</div>
              <p className="text-[#F5F5F0]/70 text-[11px] leading-relaxed font-sans">{homeMeta.metaDescription}</p>
              <div className="text-[10px] text-[#F5F5F0]/40">{homeMeta.metaDescription.length} chars</div>
            </div>
            <div className="md:col-span-5 p-2.5 rounded bg-[#C5A059]/10 border border-[#C5A059]/20 space-y-1">
              <div className="text-[10px] text-[#C5A059] uppercase font-bold flex items-center justify-between">
                <span>Target ({targetMeta.viewId})</span>
                <span className="text-emerald-400">{targetMeta.metaDescription.length} chars</span>
              </div>
              <p className="text-white text-[11px] leading-relaxed font-sans">{targetMeta.metaDescription}</p>
            </div>
          </div>

          {/* Row 4: Keywords Differentiation */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3 font-bold text-[#F5F5F0]/70">
              <div>Semantic Keywords</div>
              <div className="text-[10px] text-[#F5F5F0]/40 font-normal">Domain indexing tags</div>
            </div>
            <div className="md:col-span-4 p-2.5 rounded bg-white/5 space-y-1.5">
              <div className="text-[10px] text-[#F5F5F0]/50 uppercase font-bold">Baseline (Home) Keywords</div>
              <div className="flex flex-wrap gap-1">
                {homeMeta.keywords.map(k => (
                  <span key={k} className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-[#F5F5F0]/70">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-5 p-2.5 rounded bg-[#C5A059]/10 border border-[#C5A059]/20 space-y-1.5">
              <div className="text-[10px] text-[#C5A059] uppercase font-bold flex items-center justify-between">
                <span>Target Keywords ({targetMeta.keywords.length})</span>
                <span className="text-emerald-400">{uniqueTargetKeywords.length} Specialized</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {targetMeta.keywords.map(k => {
                  const isSpecialized = !homeKeywordSet.has(k.toLowerCase());
                  return (
                    <span 
                      key={k} 
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isSpecialized 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                          : 'bg-white/10 text-[#F5F5F0]/70'
                      }`}
                    >
                      {k} {isSpecialized && '★'}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 5: Schema Taxonomy */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3 font-bold text-[#F5F5F0]/70">
              <div>Schema.org Entity Type</div>
              <div className="text-[10px] text-[#F5F5F0]/40 font-normal">JSON-LD taxonomy</div>
            </div>
            <div className="md:col-span-4 p-2.5 rounded bg-white/5 text-xs text-[#F5F5F0]/80">
              <span className="font-mono text-[#C5A059]">{homeMeta.schemaType}</span> (Category: {homeMeta.category})
            </div>
            <div className="md:col-span-5 p-2.5 rounded bg-[#C5A059]/10 border border-[#C5A059]/20 text-xs text-white">
              <span className="font-mono text-emerald-400 font-bold">{targetMeta.schemaType}</span> (Category: {targetMeta.category})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
