import React, { useState } from 'react';
import { 
  Search, 
  Monitor, 
  Smartphone, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { PageView } from '../../types';
import { MODULE_METADATA_REGISTRY, ViewMetadata } from '../../lib/metadataManager';
import { audioFeedback } from '../../lib/audioFeedback';

interface SerpPreviewerTabProps {
  initialView?: PageView;
  onNavigateTab: (tab: PageView) => void;
  onClose: () => void;
}

export const SerpPreviewerTab: React.FC<SerpPreviewerTabProps> = ({
  initialView = 'observatory',
  onNavigateTab,
  onClose
}) => {
  const [selectedView, setSelectedView] = useState<PageView>(initialView);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [googleTheme, setGoogleTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('atlas sanctum');
  const [searchKeywordHighlight, setSearchKeywordHighlight] = useState('regenerative');

  const meta: ViewMetadata = MODULE_METADATA_REGISTRY[selectedView] || MODULE_METADATA_REGISTRY['observatory'];

  // Google Colors
  const gBg = googleTheme === 'dark' ? 'bg-[#202124]' : 'bg-[#FFFFFF]';
  const gText = googleTheme === 'dark' ? 'text-[#E8EAED]' : 'text-[#202124]';
  const gSnippet = googleTheme === 'dark' ? 'text-[#BDC1C6]' : 'text-[#4D5156]';
  const gLink = googleTheme === 'dark' ? 'text-[#8AB4F8]' : 'text-[#1A0DAB]';
  const gUrl = googleTheme === 'dark' ? 'text-[#BDC1C6]' : 'text-[#202124]';
  const gBorder = googleTheme === 'dark' ? 'border-[#3C4043]' : 'border-[#DADCE0]';
  const gCardBg = googleTheme === 'dark' ? 'bg-[#303134]' : 'bg-[#F8F9FA]';
  const gInputBg = googleTheme === 'dark' ? 'bg-[#202124]' : 'bg-[#FFFFFF]';

  // Character calculations for Google SERP
  const titleCharCount = meta.metaTitle.length;
  const descCharCount = meta.metaDescription.length;
  const isTitleLong = titleCharCount > 60;
  const isDescLong = descCharCount > 160;

  // Highlight keywords in snippet
  const renderHighlightedSnippet = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.trim()})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <strong key={i} className={`${gText} font-bold bg-amber-400/20 px-0.5 rounded`}>
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const handleLaunchView = () => {
    audioFeedback.playViewTransition();
    onClose();
    onNavigateTab(selectedView);
  };

  return (
    <div className="space-y-6">
      {/* Controls & Module Selector */}
      <div className="p-4 rounded-xl bg-[#080808] border border-white/10 space-y-3 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] font-bold uppercase tracking-wider">Select Module View:</span>
            <select
              value={selectedView}
              onChange={(e) => {
                audioFeedback.play('softClick');
                setSelectedView(e.target.value as PageView);
              }}
              className="bg-[#141414] border border-[#C5A059]/40 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#C5A059]"
            >
              <optgroup label="Key Highlighted Modules">
                <option value="observatory">Atlas Planetary Observatory (Dataset)</option>
                <option value="agent-mission-control">Agent Mission Control (SoftwareApp)</option>
                <option value="living-reality">Living Reality Matrix (Sensor Mesh)</option>
                <option value="capital-engine">Capital Engine (8-Forms)</option>
                <option value="steward">Atlas Steward (AWS Winner)</option>
                <option value="moral-arbiter">Moral Arbiter & Governance</option>
                <option value="bioregional-twin">Bioregional Digital Twin</option>
                <option value="failure-ledger">Failure Ledger</option>
                <option value="decision-room">Decision Room Policy Lab</option>
              </optgroup>
              <optgroup label="Core & Platform Views">
                <option value="home">Atlas Sanctum (Root Hub)</option>
                <option value="sentinel">Planetary Sentinel</option>
                <option value="ai-engineering">AI Engineering Studio</option>
                <option value="multimodal-studio">Multimodal Voice Studio</option>
                <option value="evidence-ledger">Evidence Ledger</option>
                <option value="flourishing-index">Flourishing Index</option>
                <option value="economics-pricing">Economics & Pricing Stack</option>
              </optgroup>
            </select>
          </div>

          {/* Quick Select Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#F5F5F0]/50 text-[11px]">Quick inspect:</span>
            <button
              onClick={() => { audioFeedback.play('softClick'); setSelectedView('observatory'); }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                selectedView === 'observatory' ? 'bg-[#C5A059] text-black border-[#C5A059]' : 'bg-white/5 text-[#F5F5F0]/70 border-white/10 hover:border-white/30'
              }`}
            >
              Observatory
            </button>
            <button
              onClick={() => { audioFeedback.play('softClick'); setSelectedView('agent-mission-control'); }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                selectedView === 'agent-mission-control' ? 'bg-[#C5A059] text-black border-[#C5A059]' : 'bg-white/5 text-[#F5F5F0]/70 border-white/10 hover:border-white/30'
              }`}
            >
              Agent Mission Control
            </button>
            <button
              onClick={() => { audioFeedback.play('softClick'); setSelectedView('steward'); }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                selectedView === 'steward' ? 'bg-[#C5A059] text-black border-[#C5A059]' : 'bg-white/5 text-[#F5F5F0]/70 border-white/10 hover:border-white/30'
              }`}
            >
              Atlas Steward
            </button>
          </div>
        </div>

        {/* Viewport & Theme Toggles */}
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#F5F5F0]/60">Google Device:</span>
              <div className="inline-flex rounded-md bg-white/5 p-0.5 border border-white/10">
                <button
                  onClick={() => { audioFeedback.play('softClick'); setDevice('desktop'); }}
                  className={`px-2.5 py-0.5 rounded flex items-center gap-1 ${
                    device === 'desktop' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/70 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => { audioFeedback.play('softClick'); setDevice('mobile'); }}
                  className={`px-2.5 py-0.5 rounded flex items-center gap-1 ${
                    device === 'mobile' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/70 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#F5F5F0]/60">Theme:</span>
              <div className="inline-flex rounded-md bg-white/5 p-0.5 border border-white/10">
                <button
                  onClick={() => { audioFeedback.play('softClick'); setGoogleTheme('dark'); }}
                  className={`px-2 py-0.5 rounded ${googleTheme === 'dark' ? 'bg-white/20 text-white font-bold' : 'text-[#F5F5F0]/60'}`}
                >
                  Dark
                </button>
                <button
                  onClick={() => { audioFeedback.play('softClick'); setGoogleTheme('light'); }}
                  className={`px-2 py-0.5 rounded ${googleTheme === 'light' ? 'bg-white text-black font-bold' : 'text-[#F5F5F0]/60'}`}
                >
                  Light
                </button>
              </div>
            </div>
          </div>

          {/* Keyword Highlighter input */}
          <div className="flex items-center gap-2">
            <span className="text-[#F5F5F0]/60">Highlight Query Term:</span>
            <input
              type="text"
              value={searchKeywordHighlight}
              onChange={(e) => setSearchKeywordHighlight(e.target.value)}
              placeholder="e.g. telemetry, agent"
              className="bg-[#141414] border border-white/20 rounded px-2 py-0.5 text-white w-28 focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>
      </div>

      {/* Real-time SERP Rendering Card */}
      <div 
        className={`transition-all rounded-xl border ${gBorder} ${gBg} p-5 sm:p-7 shadow-xl font-sans ${
          device === 'mobile' ? 'max-w-md mx-auto ring-8 ring-neutral-800 rounded-3xl' : 'w-full'
        }`}
      >
        {/* Google Mock Search Header */}
        <div className="pb-3 mb-4 border-b border-neutral-700/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-xl font-bold tracking-tight">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${gBorder} ${gInputBg} text-xs ${gText} w-48 sm:w-64`}>
              <Search className="w-3 h-3 text-neutral-400" />
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent focus:outline-none w-full text-xs"
              />
            </div>
          </div>

          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Google Rich Snippet Live</span>
          </div>
        </div>

        {/* The View-Specific Organic Search Result */}
        <div className="space-y-3">
          {/* Breadcrumb Trail & Favicon */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#0A0A0A] border border-[#C5A059]/60 flex items-center justify-center text-[#C5A059] font-serif font-black text-[10px]">
              AS
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold ${gText}`}>Atlas Sanctum</span>
                {meta.verified && <span className="text-[9px] text-emerald-400 font-mono">✓ Verified</span>}
              </div>
              <div className={`text-[11px] ${gUrl} truncate font-sans`}>
                {meta.breadcrumbTrail.join(' › ')}
              </div>
            </div>
          </div>

          {/* Meta Title */}
          <div>
            <h3 
              onClick={handleLaunchView}
              className={`text-base sm:text-lg font-medium ${gLink} hover:underline cursor-pointer transition-colors leading-snug`}
            >
              {meta.metaTitle}
            </h3>
          </div>

          {/* Rich Snippet Elements: Stars + Rating + Category Tag */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center text-amber-400">
              {'★'.repeat(5)}
            </div>
            <span className={`font-semibold ${gText}`}>{meta.ratingScore}</span>
            <span className={gSnippet}>({meta.reviewCount.toLocaleString()} peer audits)</span>
            <span className="text-neutral-500">•</span>
            <span className="text-emerald-500 font-medium font-mono text-[11px]">
              Schema: {meta.schemaType}
            </span>
            {meta.richSnippetBadge && (
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold">
                {meta.richSnippetBadge}
              </span>
            )}
          </div>

          {/* Meta Description with Keyword Highlight */}
          <p className={`text-xs sm:text-sm ${gSnippet} leading-relaxed max-w-2xl`}>
            {renderHighlightedSnippet(meta.metaDescription, searchKeywordHighlight)}
          </p>

          {/* View-Specific Rich Feature Pill Attributes */}
          {meta.featuredMetrics && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {meta.featuredMetrics.map((m, idx) => (
                <div key={idx} className={`text-[10px] font-mono px-2 py-1 rounded border ${gBorder} ${gCardBg} ${gText}`}>
                  <span className="text-neutral-400">{m.label}: </span>
                  <span className="font-bold text-[#C5A059]">{m.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Deep Action Link to Launch View */}
          <div className="pt-2 border-t border-neutral-700/20 flex items-center justify-between text-xs font-mono">
            <span className={`text-[11px] ${gUrl}`}>{meta.canonicalUrl}</span>
            <button
              onClick={handleLaunchView}
              className="text-[#C5A059] hover:underline flex items-center gap-1 font-bold"
            >
              <span>Test Click Navigation</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* SERP Quality Character Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Title Gauge */}
        <div className="p-4 rounded-xl bg-[#080808] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#F5F5F0]/70 font-semibold">Google Title Pixel Fit</span>
            <span className={`font-bold ${isTitleLong ? 'text-amber-400' : 'text-emerald-400'}`}>
              {titleCharCount} / 60 Chars {isTitleLong && '(Truncation Risk)'}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all ${isTitleLong ? 'bg-amber-400' : 'bg-emerald-400'}`}
              style={{ width: `${Math.min(100, (titleCharCount / 60) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-[#F5F5F0]/50">
            Optimal length is 50-60 characters. Desktop titles cut off at ~600px width.
          </p>
        </div>

        {/* Description Gauge */}
        <div className="p-4 rounded-xl bg-[#080808] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#F5F5F0]/70 font-semibold">Google Snippet Description Fit</span>
            <span className={`font-bold ${isDescLong ? 'text-amber-400' : 'text-emerald-400'}`}>
              {descCharCount} / 160 Chars {isDescLong && '(Truncation Risk)'}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all ${isDescLong ? 'bg-amber-400' : 'bg-emerald-400'}`}
              style={{ width: `${Math.min(100, (descCharCount / 160) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-[#F5F5F0]/50">
            Optimal snippet is 120-160 characters. Mobile devices truncate past 160 characters.
          </p>
        </div>
      </div>
    </div>
  );
};
