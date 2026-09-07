import React, { useState, useEffect } from 'react';
import { 
  FileJson, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Code2, 
  Eye, 
  RefreshCw, 
  Layers,
  Sparkles,
  Terminal
} from 'lucide-react';
import { PageView } from '../../types';
import { 
  MODULE_METADATA_REGISTRY, 
  generateViewSpecificJsonLd,
  ViewMetadata 
} from '../../lib/metadataManager';
import { audioFeedback } from '../../lib/audioFeedback';

interface PropertyValidationStatus {
  key: string;
  label: string;
  required: boolean;
  present: boolean;
  valid: boolean;
  valueSnippet: string;
  type: string;
  guideline: string;
}

export const SchemaValidationHud: React.FC<{ initialView?: PageView }> = ({ initialView = 'home' }) => {
  const [selectedView, setSelectedView] = useState<PageView>(initialView);
  const [copiedJson, setCopiedJson] = useState(false);
  const [highlightedProp, setHighlightedProp] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'hud_matrix' | 'raw_json' | 'rich_card'>('hud_matrix');

  const meta = MODULE_METADATA_REGISTRY[selectedView] || MODULE_METADATA_REGISTRY['home'];
  const jsonLdString = generateViewSpecificJsonLd(selectedView);

  let parsedJson: any = null;
  let jsonSyntaxValid = true;
  try {
    parsedJson = JSON.parse(jsonLdString);
  } catch {
    jsonSyntaxValid = false;
  }

  // Analyze every required and recommended property
  const propertiesToValidate: PropertyValidationStatus[] = [
    {
      key: '@context',
      label: 'Schema Context',
      required: true,
      present: Boolean(parsedJson?.['@context']),
      valid: parsedJson?.['@context'] === 'https://schema.org',
      valueSnippet: parsedJson?.['@context'] || 'null',
      type: 'URI',
      guideline: 'Must strictly equal "https://schema.org"'
    },
    {
      key: '@type',
      label: 'Entity Type',
      required: true,
      present: Boolean(parsedJson?.['@type']),
      valid: ['SoftwareApplication', 'Dataset', 'WebPage', 'TechArticle', 'Service'].includes(parsedJson?.['@type']),
      valueSnippet: parsedJson?.['@type'] || 'null',
      type: 'Schema.org Type',
      guideline: 'Must be an official Schema.org entity matching the module scope'
    },
    {
      key: '@id',
      label: 'Permanent URI Identifier',
      required: true,
      present: Boolean(parsedJson?.['@id']),
      valid: Boolean(parsedJson?.['@id']?.startsWith('https://')),
      valueSnippet: parsedJson?.['@id'] || 'null',
      type: 'URI',
      guideline: 'Unique entity disambiguation URI'
    },
    {
      key: 'name',
      label: 'Entity Name',
      required: true,
      present: Boolean(parsedJson?.name),
      valid: Boolean(parsedJson?.name?.length >= 5),
      valueSnippet: parsedJson?.name || 'null',
      type: 'Text',
      guideline: 'Clear human-readable entity title (min 5 chars)'
    },
    {
      key: 'description',
      label: 'Entity Description',
      required: true,
      present: Boolean(parsedJson?.description),
      valid: Boolean(parsedJson?.description?.length >= 50),
      valueSnippet: parsedJson?.description ? `${parsedJson.description.slice(0, 60)}...` : 'null',
      type: 'Text',
      guideline: 'Substantive semantic description for indexing (>= 50 chars)'
    },
    {
      key: 'url',
      label: 'Canonical Target URL',
      required: true,
      present: Boolean(parsedJson?.url),
      valid: Boolean(parsedJson?.url?.startsWith('https://')),
      valueSnippet: parsedJson?.url || 'null',
      type: 'URL',
      guideline: 'Fully qualified HTTPS canonical landing page'
    },
    {
      key: 'applicationCategory',
      label: 'Application Category / Classification',
      required: parsedJson?.['@type'] === 'SoftwareApplication',
      present: Boolean(parsedJson?.applicationCategory || parsedJson?.variableMeasured),
      valid: Boolean(parsedJson?.applicationCategory || parsedJson?.variableMeasured),
      valueSnippet: parsedJson?.applicationCategory || (parsedJson?.variableMeasured ? `${parsedJson.variableMeasured.length} variables` : 'N/A'),
      type: 'Taxonomy',
      guideline: 'Domain taxonomy classification for Google knowledge panels'
    },
    {
      key: 'aggregateRating',
      label: 'Aggregate Star Rating',
      required: false,
      present: Boolean(parsedJson?.aggregateRating),
      valid: Boolean(parsedJson?.aggregateRating?.ratingValue && parsedJson?.aggregateRating?.reviewCount > 0),
      valueSnippet: parsedJson?.aggregateRating 
        ? `${parsedJson.aggregateRating.ratingValue}/5 (${parsedJson.aggregateRating.reviewCount} reviews)` 
        : 'None',
      type: 'AggregateRating',
      guideline: 'Powers Google SERP golden star ratings snippet'
    },
    {
      key: 'offers',
      label: 'Access / Price Offer',
      required: false,
      present: Boolean(parsedJson?.offers),
      valid: Boolean(parsedJson?.offers?.price !== undefined),
      valueSnippet: parsedJson?.offers ? `${parsedJson.offers.priceCurrency} ${parsedJson.offers.price}` : 'None',
      type: 'Offer',
      guideline: 'Transparent access tier (Free / Public Commons)'
    },
    {
      key: 'publisher',
      label: 'Publisher / Organization',
      required: true,
      present: Boolean(parsedJson?.publisher),
      valid: Boolean(parsedJson?.publisher?.name && parsedJson?.publisher?.url),
      valueSnippet: parsedJson?.publisher?.name || 'null',
      type: 'Organization',
      guideline: 'Authoritative organizational entity with official branding'
    },
    {
      key: 'breadcrumb',
      label: 'Breadcrumb Navigation Trail',
      required: true,
      present: Boolean(parsedJson?.breadcrumb),
      valid: Array.isArray(parsedJson?.breadcrumb?.itemListElement) && parsedJson.breadcrumb.itemListElement.length >= 2,
      valueSnippet: parsedJson?.breadcrumb?.itemListElement 
        ? `${parsedJson.breadcrumb.itemListElement.length} hierarchical levels` 
        : 'null',
      type: 'BreadcrumbList',
      guideline: 'Hierarchical SERP navigation path with ListItem positioning'
    }
  ];

  const requiredProps = propertiesToValidate.filter(p => p.required);
  const requiredPassed = requiredProps.filter(p => p.present && p.valid).length;
  const recommendedProps = propertiesToValidate.filter(p => !p.required);
  const recommendedPassed = recommendedProps.filter(p => p.present && p.valid).length;

  const handleCopyJson = () => {
    audioFeedback.play('softClick');
    navigator.clipboard.writeText(jsonLdString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top HUD Banner */}
      <div className="p-5 rounded-xl bg-[#0B0B0B] border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Terminal className="w-4 h-4" />
              </span>
              <h3 className="text-base font-serif font-bold text-white tracking-wide">
                Real-Time Schema Validation HUD (JSON-LD)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Crawler Ready
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/60">
              Live inspection and property-by-property compliance verification for structured data injected into <code className="text-[#C5A059]">document.head</code>.
            </p>
          </div>

          {/* View Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#C5A059] font-bold">Inspect Module:</span>
            <select
              value={selectedView}
              onChange={(e) => {
                audioFeedback.play('softClick');
                setSelectedView(e.target.value as PageView);
              }}
              className="bg-[#141414] border border-[#C5A059]/40 text-white rounded px-3 py-1.5 text-xs focus:outline-none"
            >
              {Object.values(MODULE_METADATA_REGISTRY).map(m => (
                <option key={m.viewId} value={m.viewId}>
                  {m.name} ({m.schemaType})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-time Status Indicators Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
          <div className="p-3 rounded-lg bg-black/60 border border-white/5 space-y-1">
            <div className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-wider font-bold">RFC JSON Syntax</div>
            <div className="flex items-center gap-1.5">
              {jsonSyntaxValid ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-emerald-400">Valid RFC 8259</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="font-bold text-red-400">Parse Error</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/60 border border-white/5 space-y-1">
            <div className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-wider font-bold">Required Properties</div>
            <div className="flex items-center gap-1.5">
              <span className={`font-bold text-base ${requiredPassed === requiredProps.length ? 'text-emerald-400' : 'text-amber-400'}`}>
                {requiredPassed} / {requiredProps.length}
              </span>
              <span className="text-[10px] text-emerald-400/80">({Math.round((requiredPassed / requiredProps.length) * 100)}%)</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/60 border border-white/5 space-y-1">
            <div className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-wider font-bold">Rich Snippet Boosters</div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-[#C5A059]">
                {recommendedPassed} / {recommendedProps.length}
              </span>
              <span className="text-[10px] text-[#C5A059]/80">Active</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/60 border border-white/5 space-y-1">
            <div className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-wider font-bold">Googlebot Target</div>
            <div className="flex items-center gap-1.5 font-bold text-white truncate">
              <span>{meta.schemaType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => { audioFeedback.play('softClick'); setActiveTab('hud_matrix'); }}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'hud_matrix' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
            }`}
          >
            Property Status Matrix
          </button>
          <button
            onClick={() => { audioFeedback.play('softClick'); setActiveTab('raw_json'); }}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'raw_json' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
            }`}
          >
            Raw JSON-LD Code View
          </button>
          <button
            onClick={() => { audioFeedback.play('softClick'); setActiveTab('rich_card'); }}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'rich_card' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
            }`}
          >
            Rich Result Card Simulation
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition-colors"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C5A059]" />}
            <span>{copiedJson ? 'Copied' : 'Copy JSON-LD'}</span>
          </button>
          <a
            href="https://validator.schema.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded bg-[#C5A059]/20 hover:bg-[#C5A059] text-[#C5A059] hover:text-black font-bold text-xs transition-colors"
          >
            <span>Schema.org Test</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* TAB 1: PROPERTY STATUS MATRIX */}
      {activeTab === 'hud_matrix' && (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0A0A0A]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[#F5F5F0]/50 text-[11px] bg-black/40">
                  <th className="py-2.5 px-4 font-semibold">Schema Property</th>
                  <th className="py-2.5 px-4 font-semibold">Type</th>
                  <th className="py-2.5 px-4 font-semibold">Requirement</th>
                  <th className="py-2.5 px-4 font-semibold">Status Indicator</th>
                  <th className="py-2.5 px-4 font-semibold">Current Value Preview</th>
                  <th className="py-2.5 px-4 font-semibold">Schema.org Guideline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {propertiesToValidate.map((prop) => (
                  <tr 
                    key={prop.key}
                    onMouseEnter={() => setHighlightedProp(prop.key)}
                    onMouseLeave={() => setHighlightedProp(null)}
                    className={`transition-colors ${
                      highlightedProp === prop.key ? 'bg-[#C5A059]/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-white">
                      <div className="flex items-center gap-1.5">
                        <code className="text-[#C5A059]">{prop.key}</code>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#F5F5F0]/60 text-[11px]">
                      {prop.type}
                    </td>
                    <td className="py-3 px-4">
                      {prop.required ? (
                        <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800 text-[10px] font-bold uppercase">
                          Required
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-white/10 text-[#F5F5F0]/70 text-[10px]">
                          Recommended
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {prop.valid ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Valid & Passed</span>
                        </span>
                      ) : prop.required ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[11px] font-bold">
                          <XCircle className="w-3 h-3 text-red-400" />
                          <span>Missing / Invalid</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[11px] font-bold">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>Optional Absent</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#F5F5F0]/80 max-w-[200px] truncate font-mono text-[11px]">
                      {prop.valueSnippet}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#F5F5F0]/50 max-w-[220px]">
                      {prop.guideline}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RAW JSON-LD CODE VIEW */}
      {activeTab === 'raw_json' && (
        <div className="rounded-xl border border-white/10 bg-[#070707] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-white/10 text-xs text-[#F5F5F0]/60">
            <span className="flex items-center gap-2">
              <FileJson className="w-4 h-4 text-[#C5A059]" />
              <span>application/ld+json script block for {meta.name}</span>
            </span>
            <span className="text-[11px] text-emerald-400">Strict RFC 8259 Compliant</span>
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto max-h-[480px]">
            {jsonLdString}
          </pre>
        </div>
      )}

      {/* TAB 3: RICH CARD SIMULATION */}
      {activeTab === 'rich_card' && (
        <div className="p-6 rounded-xl border border-white/10 bg-[#090909] space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>Simulated Google Rich Results Knowledge Presentation</span>
          </h4>

          <div className="max-w-xl p-5 rounded-xl bg-[#171717] border border-white/15 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#C5A059] flex items-center justify-center text-black font-bold text-[10px]">
                  AS
                </div>
                <div className="leading-tight">
                  <div className="font-bold text-white">{parsedJson?.publisher?.name || 'Atlas Sanctum'}</div>
                  <div className="text-[10px] text-[#F5F5F0]/50">{parsedJson?.url || 'https://atlassanctum.org'}</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#C5A059] text-[10px] font-bold">
                {parsedJson?.['@type']}
              </span>
            </div>

            <div>
              <h5 className="text-base font-serif font-bold text-white hover:underline cursor-pointer">
                {parsedJson?.name}
              </h5>
              <p className="text-xs text-[#F5F5F0]/80 mt-1 leading-relaxed">
                {parsedJson?.description}
              </p>
            </div>

            {parsedJson?.aggregateRating && (
              <div className="flex items-center gap-2 text-xs pt-2 border-t border-white/10">
                <div className="flex items-center text-amber-400">
                  {'★'.repeat(5)}
                </div>
                <span className="font-bold text-white">{parsedJson.aggregateRating.ratingValue}</span>
                <span className="text-[#F5F5F0]/50">({parsedJson.aggregateRating.reviewCount.toLocaleString()} verified reviews)</span>
                {parsedJson.offers?.price === 0 && (
                  <span className="ml-auto px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                    Free / Commons
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
