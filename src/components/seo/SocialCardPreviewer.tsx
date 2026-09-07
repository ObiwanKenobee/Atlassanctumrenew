import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Eye, 
  MessageSquare, 
  Heart, 
  Repeat2, 
  Bookmark, 
  ThumbsUp, 
  Send, 
  Globe, 
  Sliders,
  Code2
} from 'lucide-react';
import { PageView } from '../../types';
import { 
  MODULE_METADATA_REGISTRY, 
  ViewMetadata 
} from '../../lib/metadataManager';
import { audioFeedback } from '../../lib/audioFeedback';

interface SocialCardPreviewerProps {
  initialView?: PageView;
}

export const SocialCardPreviewer: React.FC<SocialCardPreviewerProps> = ({ initialView = 'home' }) => {
  const [selectedView, setSelectedView] = useState<PageView>(initialView);
  const [platform, setPlatform] = useState<'linkedin' | 'twitter' | 'discord'>('linkedin');
  const [copiedTags, setCopiedTags] = useState(false);
  const [customImage, setCustomImage] = useState('/icon.png');
  const [customCaption, setCustomCaption] = useState(
    'Advancing regenerative intelligence, verified planetary telemetry, and autonomous fleet coordination with Atlas Sanctum Civilization OS.'
  );

  const meta = MODULE_METADATA_REGISTRY[selectedView] || MODULE_METADATA_REGISTRY['home'];

  const handleCopyTags = () => {
    audioFeedback.play('softClick');
    const tags = `<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${meta.canonicalUrl}" />
<meta property="og:title" content="${meta.metaTitle}" />
<meta property="og:description" content="${meta.metaDescription}" />
<meta property="og:image" content="https://atlassanctum.org${customImage}" />
<meta property="og:site_name" content="Atlas Sanctum Civilization OS" />

<!-- Twitter / X Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@AtlasSanctum" />
<meta name="twitter:creator" content="@AtlasSanctum" />
<meta name="twitter:url" content="${meta.canonicalUrl}" />
<meta name="twitter:title" content="${meta.metaTitle}" />
<meta name="twitter:description" content="${meta.metaDescription}" />
<meta name="twitter:image" content="https://atlassanctum.org${customImage}" />`;
    navigator.clipboard.writeText(tags);
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header & Controls */}
      <div className="p-5 rounded-xl bg-[#090909] border border-white/10 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Share2 className="w-4 h-4" />
              </span>
              <h3 className="text-base font-serif font-bold text-white tracking-wide">
                Open Graph & Twitter / X Card Previewer
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                Social Link Graph
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/60">
              High-fidelity simulation of how shared URLs render across LinkedIn, X (Twitter), and Discord with dynamic meta attributes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#C5A059] font-bold">Module:</span>
              <select
                value={selectedView}
                onChange={(e) => {
                  audioFeedback.play('softClick');
                  setSelectedView(e.target.value as PageView);
                }}
                className="bg-[#141414] border border-[#C5A059]/40 text-white rounded px-3 py-1.5 text-xs focus:outline-none"
              >
                {Object.values(MODULE_METADATA_REGISTRY).map(m => (
                  <option key={m.viewId} value={m.viewId}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
              <button
                onClick={() => { audioFeedback.play('softClick'); setPlatform('linkedin'); }}
                className={`px-3 py-1 rounded transition-colors ${
                  platform === 'linkedin' ? 'bg-[#0077B5] text-white font-bold' : 'text-[#F5F5F0]/70 hover:text-white'
                }`}
              >
                LinkedIn
              </button>
              <button
                onClick={() => { audioFeedback.play('softClick'); setPlatform('twitter'); }}
                className={`px-3 py-1 rounded transition-colors ${
                  platform === 'twitter' ? 'bg-white text-black font-bold' : 'text-[#F5F5F0]/70 hover:text-white'
                }`}
              >
                X (Twitter)
              </button>
              <button
                onClick={() => { audioFeedback.play('softClick'); setPlatform('discord'); }}
                className={`px-3 py-1 rounded transition-colors ${
                  platform === 'discord' ? 'bg-[#5865F2] text-white font-bold' : 'text-[#F5F5F0]/70 hover:text-white'
                }`}
              >
                Discord
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#F5F5F0]/50">OG Image Pointer:</span>
            <input
              type="text"
              value={customImage}
              onChange={(e) => setCustomImage(e.target.value)}
              className="bg-[#141414] border border-white/10 rounded px-2.5 py-1 text-xs text-[#C5A059] w-48 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTags}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition-colors"
            >
              {copiedTags ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#C5A059]" />}
              <span>{copiedTags ? 'Copied' : 'Copy Social Meta Tags'}</span>
            </button>
            <a
              href="https://www.linkedin.com/post-inspector/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#C5A059]/20 hover:bg-[#C5A059] text-[#C5A059] hover:text-black font-bold text-xs transition-colors"
            >
              <span>LinkedIn Inspector</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* SOCIAL MEDIA PREVIEW CANVAS */}
      <div className="flex justify-center p-4 sm:p-8 rounded-xl bg-black/80 border border-white/10">
        {/* 1. LINKEDIN PREVIEW */}
        {platform === 'linkedin' && (
          <div className="w-full max-w-xl rounded-xl bg-[#1B1F23] border border-white/15 text-white overflow-hidden shadow-2xl font-sans">
            {/* Post Header */}
            <div className="p-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#C5A059] flex items-center justify-center text-black font-serif font-bold text-lg ring-2 ring-[#C5A059]/30">
                  AS
                </div>
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>Atlas Sanctum Foundation</span>
                    <span className="text-[11px] text-gray-400">• 1st</span>
                  </div>
                  <div className="text-xs text-gray-400">Civilization OS & Planetary Intelligence Research</div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <span>2h • Edited •</span>
                    <Globe className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white">•••</button>
            </div>

            {/* Post Caption */}
            <div className="px-4 pb-3 text-sm text-gray-200 leading-relaxed font-normal">
              {customCaption}
              <div className="mt-2 text-[#70B5F9] font-medium text-xs space-x-1.5">
                <span>#AtlasSanctum</span>
                <span>#CivilizationOS</span>
                <span>#AutonomousFleets</span>
                <span>#PlanetaryHealth</span>
              </div>
            </div>

            {/* Linked Card Preview (OG Card) */}
            <div className="border-t border-b border-gray-700/60 bg-[#16191C] cursor-pointer hover:bg-[#1A1D20] transition-colors">
              {/* Card Image Banner */}
              <div className="relative h-56 bg-gradient-to-br from-[#1F190D] via-[#0C0B08] to-[#14120A] flex items-center justify-center overflow-hidden border-b border-gray-700/60">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="text-center z-10 p-6 space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-[#C5A059] text-black font-serif font-bold text-xl flex items-center justify-center mx-auto shadow-xl">
                    AS
                  </div>
                  <div className="text-lg font-serif font-bold text-white tracking-wide">{meta.name}</div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-[10px] font-mono font-bold tracking-widest uppercase border border-[#C5A059]/30">
                    {meta.category} Ecosystem
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 space-y-1">
                <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold font-mono">
                  atlassanctum.org
                </div>
                <div className="font-bold text-sm text-white line-clamp-1">
                  {meta.metaTitle}
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {meta.metaDescription}
                </p>
              </div>
            </div>

            {/* Post Metrics & Actions */}
            <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-400 border-b border-gray-700/40">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#378FE9] flex items-center justify-center text-[9px] text-white">👍</span>
                <span className="w-4 h-4 rounded-full bg-[#6DAE4F] flex items-center justify-center text-[9px] text-white">👏</span>
                <span>482 • 38 comments</span>
              </div>
              <div>64 reposts</div>
            </div>

            <div className="p-2 flex items-center justify-around text-xs text-gray-300 font-medium">
              <button className="flex items-center gap-1.5 p-2 rounded hover:bg-white/5 transition-colors">
                <ThumbsUp className="w-4 h-4" /> <span>Like</span>
              </button>
              <button className="flex items-center gap-1.5 p-2 rounded hover:bg-white/5 transition-colors">
                <MessageSquare className="w-4 h-4" /> <span>Comment</span>
              </button>
              <button className="flex items-center gap-1.5 p-2 rounded hover:bg-white/5 transition-colors">
                <Repeat2 className="w-4 h-4" /> <span>Repost</span>
              </button>
              <button className="flex items-center gap-1.5 p-2 rounded hover:bg-white/5 transition-colors">
                <Send className="w-4 h-4" /> <span>Send</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. X / TWITTER PREVIEW */}
        {platform === 'twitter' && (
          <div className="w-full max-w-xl rounded-2xl bg-black border border-gray-800 text-white p-4 shadow-2xl font-sans space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center text-black font-serif font-bold text-base ring-2 ring-[#C5A059]/40 shrink-0">
                AS
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-sm">Atlas Sanctum</span>
                  <span className="w-4 h-4 rounded-full bg-[#F5A623] text-black flex items-center justify-center text-[9px] font-bold">✓</span>
                  <span className="text-gray-500 text-xs font-mono">@AtlasSanctum</span>
                  <span className="text-gray-500 text-xs">· 2h</span>
                </div>

                <p className="text-sm text-gray-100 mt-1 leading-relaxed font-normal">
                  {customCaption}
                </p>

                {/* Twitter Large Summary Card */}
                <div className="mt-3 rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors cursor-pointer bg-[#0A0A0A]">
                  <div className="relative h-56 bg-gradient-to-br from-[#1F190D] via-[#0C0B08] to-[#14120A] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="text-center z-10 p-6 space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-[#C5A059] text-black font-serif font-bold text-xl flex items-center justify-center mx-auto shadow-xl">
                        AS
                      </div>
                      <div className="text-base font-serif font-bold text-white">{meta.name}</div>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-black/60 text-[#C5A059] text-[10px] font-mono font-bold tracking-widest uppercase border border-white/10">
                        atlassanctum.org
                      </span>
                    </div>
                  </div>

                  <div className="p-3 space-y-0.5">
                    <div className="text-xs text-gray-500 font-mono">atlassanctum.org</div>
                    <div className="font-bold text-sm text-white truncate">{meta.metaTitle}</div>
                    <div className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {meta.metaDescription}
                    </div>
                  </div>
                </div>

                {/* Tweet Reactions */}
                <div className="flex items-center justify-between text-gray-500 text-xs pt-3 mt-2 border-t border-gray-900">
                  <div className="flex items-center gap-1.5 hover:text-sky-400 cursor-pointer">
                    <MessageSquare className="w-4 h-4" /> <span>84</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer">
                    <Repeat2 className="w-4 h-4" /> <span>210</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-pink-400 cursor-pointer">
                    <Heart className="w-4 h-4" /> <span>1.2K</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-sky-400 cursor-pointer">
                    <Bookmark className="w-4 h-4" /> <span>142</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                    <Share2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. DISCORD EMBED PREVIEW */}
        {platform === 'discord' && (
          <div className="w-full max-w-xl rounded-xl bg-[#313338] border border-gray-700/60 text-white p-4 shadow-2xl font-sans space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#C5A059] text-black font-bold flex items-center justify-center text-xs">AS</div>
              <span className="font-bold text-sm text-white">Atlas Sanctum</span>
              <span className="px-1 py-0.5 rounded bg-[#5865F2] text-[9px] font-bold text-white uppercase">BOT</span>
              <span className="text-[11px] text-gray-400">Today at 1:40 PM</span>
            </div>

            <p className="text-sm text-gray-300">
              Check out the official module documentation for this subsystem:
            </p>

            {/* Discord Rich Embed Box */}
            <div className="rounded-lg bg-[#2B2D31] border-l-4 border-[#C5A059] p-4 space-y-2 max-w-md">
              <div className="text-xs text-gray-400 font-semibold font-mono">
                Atlas Sanctum Civilization OS
              </div>
              <div className="font-bold text-sm text-[#00A8FC] hover:underline cursor-pointer">
                {meta.metaTitle}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {meta.metaDescription}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-700/40">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Classification</div>
                  <div className="text-white font-mono text-xs">{meta.category}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Schema</div>
                  <div className="text-white font-mono text-xs">{meta.schemaType}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RAW SOCIAL META TAGS PREVIEW BLOCK */}
      <div className="rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 text-xs">
          <span className="flex items-center gap-2 text-white font-bold">
            <Code2 className="w-4 h-4 text-[#C5A059]" />
            <span>Generated Open Graph & Twitter Card Meta Tags</span>
          </span>
          <button
            onClick={handleCopyTags}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#C5A059]/20 hover:bg-[#C5A059] text-[#C5A059] hover:text-black font-bold text-[11px] transition-colors"
          >
            {copiedTags ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedTags ? 'Copied' : 'Copy All'}</span>
          </button>
        </div>
        <pre className="p-4 text-xs font-mono text-sky-300/90 leading-relaxed overflow-x-auto">
{`<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${meta.canonicalUrl}" />
<meta property="og:title" content="${meta.metaTitle}" />
<meta property="og:description" content="${meta.metaDescription}" />
<meta property="og:image" content="https://atlassanctum.org${customImage}" />
<meta property="og:site_name" content="Atlas Sanctum Civilization OS" />

<!-- Twitter / X Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@AtlasSanctum" />
<meta name="twitter:creator" content="@AtlasSanctum" />
<meta name="twitter:url" content="${meta.canonicalUrl}" />
<meta name="twitter:title" content="${meta.metaTitle}" />
<meta name="twitter:description" content="${meta.metaDescription}" />
<meta name="twitter:image" content="https://atlassanctum.org${customImage}" />`}
        </pre>
      </div>
    </div>
  );
};
