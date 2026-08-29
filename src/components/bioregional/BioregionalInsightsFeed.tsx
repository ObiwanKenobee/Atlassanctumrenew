import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  BookOpen,
  Sprout,
  Compass,
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Share2,
  CheckCircle2,
  Filter,
  Plus,
  X,
  Search,
  Tag,
  Radio,
  Clock,
  ShieldCheck,
  Flame,
  Droplets,
  TreePine,
  Layers,
  HeartHandshake,
  Volume2,
  VolumeX,
  Copy,
  Check
} from 'lucide-react';
import { useMissionAlerts } from '../../context/MissionAlertContext';
import { audioFeedback } from '../../lib/audioFeedback';

export type InsightCategory = 'all' | 'indigenous_wisdom' | 'ecological_science' | 'regenerative_practice' | 'live_alerts';

export interface EcologicalInsight {
  id: string;
  category: 'indigenous_wisdom' | 'ecological_science' | 'regenerative_practice';
  title: string;
  body: string;
  bioregion: string;
  sourceAttribution: string;
  stewardCouncil: string;
  tags: string[];
  practicalApplicationTip: string;
  confidenceScore: number;
  timestamp: string;
  bookmarked?: boolean;
  appliedInField?: boolean;
  upvotes: number;
}

const INITIAL_INSIGHTS: EcologicalInsight[] = [
  {
    id: 'ins-001',
    category: 'indigenous_wisdom',
    title: 'Customary Pastoralist Dry-Season Rotational Grazing (Olosho Resting)',
    body: 'Traditional Maasai range management partitions dry-season river valley refugia into seasonal enclosures (Olopololi), allowing perennial bunchgrass roots to penetrate >60cm before herd re-entry.',
    bioregion: 'Mara Watershed',
    sourceAttribution: 'Elder Mzee Ole Kaelo, Mara Customary Pastoral Trust',
    stewardCouncil: 'Maasai Mara Pastoralist Council',
    tags: ['Rotational Grazing', 'Perennial Grasses', 'Soil Sponge', 'TEK'],
    practicalApplicationTip: 'Defer grazing on riparian valley flanks until seedheads shatter naturally in late August to double root biomass infiltration.',
    confidenceScore: 98,
    timestamp: '2 hours ago',
    upvotes: 42
  },
  {
    id: 'ins-002',
    category: 'ecological_science',
    title: 'Glomalin Protein Fixation & Mycorrhizal Soil Carbon Stabilization',
    body: 'In-situ core telemetry demonstrates that mycorrhizal fungi secrete glomalin—a hydrophobic glycoprotein binding micro-aggregates into an erosion-resistant living sponge holding 2.8x its dry weight in water.',
    bioregion: 'Aberdare Range',
    sourceAttribution: 'East African Soil Biophysics Laboratory & Drone Lidar',
    stewardCouncil: 'Agroforestry Biophysical Research Unit',
    tags: ['Glomalin', 'Soil Carbon', 'Mycelium', 'SOM'],
    practicalApplicationTip: 'Inoculate native tree nursery saplings with native forest duff to accelerate glomalin deposition by 34% in year one.',
    confidenceScore: 96,
    timestamp: '4 hours ago',
    upvotes: 38
  },
  {
    id: 'ins-003',
    category: 'regenerative_practice',
    title: 'Keyline Water Swales & Subsurface Infiltration Terraces',
    body: 'Off-contour swales sloped at 1:400 redistribute concentrated ridge runoff across dry ridges, replenishing piezometric groundwater levels and preventing gully incision during flash precipitation.',
    bioregion: 'Mathare & Nairobi Catchment',
    sourceAttribution: 'Urban Ecological Infrastructure Guild',
    stewardCouncil: 'Nairobi Water Basin Coalition',
    tags: ['Keyline Hydrology', 'Swales', 'Runoff Mitigation', 'Bio-swales'],
    practicalApplicationTip: 'Pack swale bottoms with vetiver grass and coarse volcanic pumice to trap 80% of urban silt prior to mainstream discharge.',
    confidenceScore: 94,
    timestamp: '6 hours ago',
    upvotes: 56
  },
  {
    id: 'ins-004',
    category: 'indigenous_wisdom',
    title: 'Sacred Grove (Mukuyu & Mugumo) Micro-Watershed Recharging',
    body: 'Gikuyu sacred fig groves (Ficus thonningii / Ficus sycomorus) historically anchored continuous subterranean springs by drawing deep volcanic aquifer moisture to surface soil horizons via hydraulic lift.',
    bioregion: 'Kikuyu Escarpment & Aberdare Ridges',
    sourceAttribution: 'Escarpment Indigenous Tree Keepers & Oral Archives',
    stewardCouncil: 'Aberdare Forest Indigenous Guardians',
    tags: ['Hydraulic Lift', 'Sacred Trees', 'Ficus', 'Aquifer Springs'],
    practicalApplicationTip: 'Plant Ficus cuttings along riparian springheads at 15m intervals to re-establish year-round micro-climate humidity.',
    confidenceScore: 97,
    timestamp: '1 day ago',
    upvotes: 61
  },
  {
    id: 'ins-005',
    category: 'ecological_science',
    title: 'Avian Acoustic Complexity Index (ACI) as Trophic Recovery Proxy',
    body: '24-hour autonomous acoustic sentinel arrays demonstrate that bio-acoustic complexity above 0.82 ACI directly correlates with 90%+ climax canopy closure and predator guild re-establishment.',
    bioregion: 'Aberdare Cloud Forest',
    sourceAttribution: 'Autonomous Bio-Acoustic Sentinel Array Node #AB-08',
    stewardCouncil: 'Kenya Wildlife Bio-Acoustic Directorate',
    tags: ['Bio-Acoustics', 'ACI Index', 'Avian Health', 'Trophic Rank'],
    practicalApplicationTip: 'Target 142 native bird species calls per dawn chorus as the primary empirical gateway before commercial carbon credits release.',
    confidenceScore: 95,
    timestamp: '1 day ago',
    upvotes: 29
  },
  {
    id: 'ins-006',
    category: 'regenerative_practice',
    title: 'Multi-Species Agroforestry Zaï Pit Micro-Catchments',
    body: 'Excavating 30cm deep pits filled with composted biomass and biochar concentrates scarce rainwater directly around sapling root crowns, enabling 88% survival in sub-humid transitional zones.',
    bioregion: 'Rift Valley Escarpment',
    sourceAttribution: 'Dryland Permaculture & Agroecology Collective',
    stewardCouncil: 'Rift Valley Groundwater Directorate',
    tags: ['Zaï Pits', 'Agroforestry', 'Drought Resilience', 'Biochar'],
    practicalApplicationTip: 'Add 150g crushed biochar pre-charged with cow manure compost into each planting pit to double microbial colonization.',
    confidenceScore: 92,
    timestamp: '2 days ago',
    upvotes: 47
  }
];

interface BioregionalInsightsFeedProps {
  currentBioregionId?: string;
  currentBioregionName?: string;
}

export const BioregionalInsightsFeed: React.FC<BioregionalInsightsFeedProps> = ({
  currentBioregionId = 'aberdare_riparian_watershed',
  currentBioregionName = 'Aberdare Range & Riparian Catchment'
}) => {
  const { alerts, markAsRead } = useMissionAlerts();

  const [insights, setInsights] = useState<EcologicalInsight[]>(() => {
    try {
      const saved = localStorage.getItem('atlas_ecological_insights');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return INITIAL_INSIGHTS;
  });

  const [activeCategory, setActiveCategory] = useState<InsightCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showContributeModal, setShowContributeModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Insight Form State
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCategory, setNewCategory] = useState<'indigenous_wisdom' | 'ecological_science' | 'regenerative_practice'>('indigenous_wisdom');
  const [newSource, setNewSource] = useState('');
  const [newCouncil, setNewCouncil] = useState('');
  const [newTip, setNewTip] = useState('');
  const [newTags, setNewTags] = useState('TEK, Regeneration, Ground Truth');

  // Persist insights
  const saveInsights = (updated: EcologicalInsight[]) => {
    setInsights(updated);
    try {
      localStorage.setItem('atlas_ecological_insights', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Toggle bookmark
  const toggleBookmark = (id: string) => {
    audioFeedback.playMicroTick();
    const updated = insights.map(ins =>
      ins.id === id ? { ...ins, bookmarked: !ins.bookmarked } : ins
    );
    saveInsights(updated);
  };

  // Toggle field application
  const toggleApplied = (id: string) => {
    audioFeedback.playSyncComplete();
    const updated = insights.map(ins =>
      ins.id === id ? { ...ins, appliedInField: !ins.appliedInField } : ins
    );
    saveInsights(updated);
  };

  // Upvote
  const handleUpvote = (id: string) => {
    audioFeedback.playMicroTick();
    const updated = insights.map(ins =>
      ins.id === id ? { ...ins, upvotes: ins.upvotes + 1 } : ins
    );
    saveInsights(updated);
  };

  // Copy insight content
  const handleCopyInsight = (insight: EcologicalInsight) => {
    const text = `[Atlas Sanctum Ecological Insight]\n${insight.title}\nCategory: ${insight.category}\nBioregion: ${insight.bioregion}\nSource: ${insight.sourceAttribution}\nCouncil: ${insight.stewardCouncil}\n\nInsight:\n${insight.body}\n\nPractical Field Tip:\n${insight.practicalApplicationTip}`;
    navigator.clipboard.writeText(text);
    setCopiedId(insight.id);
    audioFeedback.playMicroTick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle new insight submit
  const handleSubmitNewInsight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    audioFeedback.playSyncComplete();
    const tagsArr = newTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const created: EcologicalInsight = {
      id: `ins-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      body: newBody.trim(),
      bioregion: currentBioregionName,
      sourceAttribution: newSource.trim() || 'Citizen Ecological Practitioner',
      stewardCouncil: newCouncil.trim() || 'East African Stewardship Assembly',
      tags: tagsArr.length > 0 ? tagsArr : ['Field Observation', 'Regeneration'],
      practicalApplicationTip: newTip.trim() || 'Apply in-situ and calibrate against local seasonal rainfall.',
      confidenceScore: 90,
      timestamp: 'Just now',
      upvotes: 1
    };

    const updated = [created, ...insights];
    saveInsights(updated);
    setShowContributeModal(false);

    // Reset form
    setNewTitle('');
    setNewBody('');
    setNewSource('');
    setNewCouncil('');
    setNewTip('');
  };

  // Filtered insights
  const filteredInsights = useMemo(() => {
    return insights.filter(ins => {
      // Category filter
      if (activeCategory !== 'all' && activeCategory !== 'live_alerts') {
        if (ins.category !== activeCategory) return false;
      }

      // Tag filter
      if (selectedTag && !ins.tags.includes(selectedTag)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ins.title.toLowerCase().includes(q);
        const matchBody = ins.body.toLowerCase().includes(q);
        const matchTags = ins.tags.some(t => t.toLowerCase().includes(q));
        const matchSource = ins.sourceAttribution.toLowerCase().includes(q);
        if (!matchTitle && !matchBody && !matchTags && !matchSource) {
          return false;
        }
      }

      return true;
    });
  }, [insights, activeCategory, selectedTag, searchQuery]);

  // All unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    insights.forEach(ins => ins.tags.forEach(t => set.add(t)));
    return Array.from(set).slice(0, 10);
  }, [insights]);

  return (
    <div
      id="bioregional-insights-feed"
      className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-6 shadow-xl text-[#F5F5F0]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              ECOLOGICAL KNOWLEDGE STREAM • INDIGENOUS WISDOM & REGENERATIVE PRACTICE
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-300 rounded-full border border-emerald-500/40 font-bold">
              {insights.length} Insights Curated
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Bioregional Insights & Traditional Ecological Knowledge
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans leading-relaxed">
            Streaming curated ecological wisdom, ancestral indigenous land stewardship (TEK), and actionable agroecological regeneration tips integrated with real-time telemetry mission alerts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => {
              setShowContributeModal(true);
              audioFeedback.playMicroTick();
            }}
            className="px-3.5 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Submit Wisdom / Tip</span>
          </button>
        </div>
      </div>

      {/* Category Tabs Ribbon & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
            {[
              { id: 'all', label: 'All Knowledge', count: insights.length },
              { id: 'indigenous_wisdom', label: 'Indigenous Wisdom (TEK)', count: insights.filter(i => i.category === 'indigenous_wisdom').length },
              { id: 'ecological_science', label: 'Biophysical Science', count: insights.filter(i => i.category === 'ecological_science').length },
              { id: 'regenerative_practice', label: 'Field Practice Tips', count: insights.filter(i => i.category === 'regenerative_practice').length },
              { id: 'live_alerts', label: 'Live Alerts Stream', count: alerts.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id as InsightCategory);
                  audioFeedback.playMicroTick();
                }}
                className={`px-3 py-1.5 rounded-xs border text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === tab.id
                    ? 'bg-[#C5A059] text-black font-bold border-[#C5A059] shadow-sm'
                    : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:border-[#F5F5F0]/30'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1 rounded ${activeCategory === tab.id ? 'bg-black/20 text-black' : 'bg-[#222] text-[#C5A059]'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wisdom, tags, or authors..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#121212] border border-[#F5F5F0]/15 rounded-xs text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/40 focus:border-[#C5A059] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40 hover:text-[#F5F5F0]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && activeCategory !== 'live_alerts' && (
          <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono pt-1">
            <span className="text-[#F5F5F0]/40 uppercase flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#C5A059]" /> Topics:
            </span>
            {allTags.map(tag => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(isSelected ? null : tag);
                    audioFeedback.playMicroTick();
                  }}
                  className={`px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-[#161616] border-[#F5F5F0]/10 text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[#C5A059] hover:underline ml-1 cursor-pointer"
              >
                Clear Tag
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Feed Content */}
      {activeCategory === 'live_alerts' ? (
        /* Live Mission Alerts Stream Sub-View */
        <div className="space-y-3 font-mono text-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="font-bold uppercase tracking-wider text-[11px]">
                Real-Time Mission Alerts Stream (Contextually Coupled)
              </span>
            </div>
            <span className="text-[10px] text-[#F5F5F0]/40">
              Source: MissionAlertProvider
            </span>
          </div>

          <div className="space-y-2.5">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 rounded-sm border transition-all space-y-2 ${
                  alert.severity === 'critical'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : alert.severity === 'warning'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded ${
                      alert.severity === 'critical'
                        ? 'bg-rose-900 text-rose-200'
                        : alert.severity === 'warning'
                        ? 'bg-amber-900 text-amber-200'
                        : 'bg-emerald-900 text-emerald-200'
                    }`}>
                      {alert.type.replace(/_/g, ' ')}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#F5F5F0]">
                      {alert.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#F5F5F0]/50 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
                  {alert.message}
                </p>

                {alert.metadata && (
                  <div className="flex items-center gap-3 pt-1 border-t border-[#F5F5F0]/10 text-[10px] text-[#F5F5F0]/50">
                    {alert.metadata.verifiedBy && <span>Verified By: {alert.metadata.verifiedBy}</span>}
                    {alert.metadata.reading && <span className="text-cyan-300">Reading: {alert.metadata.reading}</span>}
                    {alert.cryptographicHash && (
                      <span className="text-[#C5A059] truncate max-w-[140px]" title={alert.cryptographicHash}>
                        Hash: {alert.cryptographicHash.slice(0, 10)}...
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="p-8 text-center text-[#F5F5F0]/40 font-mono text-xs italic">
                No active telemetry alerts currently in queue.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Curated Insights Card Stream */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInsights.map(insight => {
            const isIndigenous = insight.category === 'indigenous_wisdom';
            const isScience = insight.category === 'ecological_science';
            const isPractice = insight.category === 'regenerative_practice';

            return (
              <div
                key={insight.id}
                className={`p-5 rounded-sm border flex flex-col justify-between space-y-4 transition-all text-left shadow-lg ${
                  isIndigenous
                    ? 'bg-[#12100C] border-[#C5A059]/40 hover:border-[#C5A059]'
                    : isScience
                    ? 'bg-[#0A1211] border-cyan-500/40 hover:border-cyan-400'
                    : 'bg-[#0E1410] border-emerald-500/40 hover:border-emerald-400'
                }`}
              >
                {/* Card Top Category Pill & Action Controls */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${
                      isIndigenous
                        ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40'
                        : isScience
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {isIndigenous && <Compass className="w-3 h-3" />}
                      {isScience && <Sparkles className="w-3 h-3" />}
                      {isPractice && <Sprout className="w-3 h-3" />}
                      {isIndigenous ? 'Traditional Wisdom (TEK)' : isScience ? 'Biophysical Science' : 'Field Practice Tip'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleBookmark(insight.id)}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          insight.bookmarked ? 'text-[#C5A059] bg-[#C5A059]/10' : 'text-[#F5F5F0]/40 hover:text-[#F5F5F0]'
                        }`}
                        title={insight.bookmarked ? 'Remove Bookmark' : 'Bookmark Insight'}
                      >
                        {insight.bookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleCopyInsight(insight)}
                        className="p-1.5 text-[#F5F5F0]/40 hover:text-[#F5F5F0] rounded cursor-pointer"
                        title="Copy Insight"
                      >
                        {copiedId === insight.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Title & Core Body */}
                  <h3 className="text-base font-serif font-bold text-[#F5F5F0] leading-snug">
                    {insight.title}
                  </h3>

                  <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
                    {insight.body}
                  </p>

                  {/* Practical Field Application Tip Box */}
                  <div className="p-3 bg-black/60 border border-[#F5F5F0]/10 rounded-xs space-y-1 text-xs">
                    <span className="text-[9px] font-mono uppercase text-[#C5A059] font-bold flex items-center gap-1">
                      <Sprout className="w-3 h-3 text-[#C5A059]" /> Practical Action Tip:
                    </span>
                    <p className="text-[11px] text-emerald-300 font-sans leading-relaxed">
                      {insight.practicalApplicationTip}
                    </p>
                  </div>
                </div>

                {/* Tags & Epistemic Authority Metadata Footer */}
                <div className="space-y-3 pt-3 border-t border-[#F5F5F0]/10 font-mono text-[10px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {insight.tags.map(t => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-[#181818] text-[#F5F5F0]/60 border border-[#F5F5F0]/5">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[#F5F5F0]/50 pt-1">
                    <div className="space-y-0.5">
                      <div className="text-[#F5F5F0]/80 truncate max-w-[200px]" title={insight.sourceAttribution}>
                        By {insight.sourceAttribution}
                      </div>
                      <div className="text-[#C5A059] text-[9px] truncate max-w-[200px]" title={insight.stewardCouncil}>
                        {insight.stewardCouncil}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleApplied(insight.id)}
                        className={`px-2 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          insight.appliedInField
                            ? 'bg-emerald-900 text-emerald-200 border border-emerald-500/50'
                            : 'bg-[#181818] text-[#F5F5F0]/50 hover:text-emerald-300 border border-[#F5F5F0]/10'
                        }`}
                        title="Mark as Applied in Field"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{insight.appliedInField ? 'Field Applied' : 'Mark Applied'}</span>
                      </button>

                      <button
                        onClick={() => handleUpvote(insight.id)}
                        className="px-2 py-1 bg-[#181818] hover:bg-[#222] border border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-[#F5F5F0] rounded text-[9px] flex items-center gap-1 cursor-pointer"
                      >
                        <Flame className="w-3 h-3 text-[#C5A059]" />
                        <span>{insight.upvotes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredInsights.length === 0 && (
            <div className="col-span-2 p-12 text-center text-[#F5F5F0]/40 font-mono text-xs space-y-2">
              <BookOpen className="w-6 h-6 mx-auto text-[#C5A059]/40" />
              <p>No ecological insights match the selected filter criteria.</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSelectedTag(null);
                  setSearchQuery('');
                }}
                className="text-[#C5A059] underline cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Contribute Insight Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E0E0E] border border-[#C5A059] rounded-sm max-w-xl w-full p-6 shadow-2xl space-y-4 text-[#F5F5F0] animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-base font-serif font-bold text-[#F5F5F0]">
                  Contribute Ecological Wisdom or Field Tip
                </h3>
              </div>
              <button
                onClick={() => setShowContributeModal(false)}
                className="text-[#F5F5F0]/50 hover:text-[#F5F5F0] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewInsight} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                  Knowledge Category:
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                >
                  <option value="indigenous_wisdom">Traditional Indigenous Ecological Wisdom (TEK)</option>
                  <option value="ecological_science">Biophysical & Hydrological Science</option>
                  <option value="regenerative_practice">Regenerative Agroecology Practice Tip</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                  Insight Title:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Living Mulch Biomass Cover in Dry Valleys"
                  className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                  Core Ecological Insight:
                </label>
                <textarea
                  required
                  rows={3}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Describe the ecological mechanism, traditional history, or biophysical principle..."
                  className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059] font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                  Practical In-Situ Field Tip:
                </label>
                <input
                  type="text"
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  placeholder="e.g. Lay cut grass 5cm thick directly over mycorrhizal zones before morning dew..."
                  className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                    Source / Elder Attribution:
                  </label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder="e.g. Elder Wanjiku / Field Agroecologist"
                    className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                    Steward Council:
                  </label>
                  <input
                    type="text"
                    value={newCouncil}
                    onChange={(e) => setNewCouncil(e.target.value)}
                    placeholder="e.g. Watershed Stewardship Trust"
                    className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                  Tags (comma separated):
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-3 border-t border-[#F5F5F0]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowContributeModal(false)}
                  className="px-3 py-1.5 text-xs text-[#F5F5F0]/60 hover:text-[#F5F5F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold font-mono text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow"
                >
                  Publish Knowledge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
