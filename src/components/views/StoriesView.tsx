import React, { useState } from 'react';
import { 
  BookOpen, 
  MapPin, 
  User, 
  Calendar, 
  Clock, 
  Sparkles, 
  Search, 
  Filter, 
  ChevronRight, 
  Quote, 
  Volume2, 
  ShieldCheck, 
  TrendingUp, 
  Share2, 
  X, 
  PlusCircle, 
  CheckCircle2, 
  Activity,
  Layers,
  FileText
} from 'lucide-react';
import { TRANSFORMATIONAL_STORIES } from '../../data/platformContentData';
import { TransformationalStory, StoryCategory } from '../../types/platformContent';
import { PageView } from '../../types';

interface StoriesViewProps {
  onSelectTab?: (tab: PageView) => void;
  onInspectProvenance?: (prov: any) => void;
}

export const StoriesView: React.FC<StoriesViewProps> = ({
  onSelectTab,
  onInspectProvenance
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStoryModal, setActiveStoryModal] = useState<TransformationalStory | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Filter stories
  const filteredStories = TRANSFORMATIONAL_STORIES.filter((st) => {
    const matchesCat = selectedCategory === 'all' || st.category === selectedCategory;
    const matchesSearch = 
      st.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.bioregion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header & Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-[#F5F5F0]/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.25em] font-bold">
              ORAL HISTORIES, FIELD DIARIES & PROVEN HUMAN IMPACT
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F5F5F0]">
            Stories & Field Narratives
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 max-w-2xl font-sans leading-relaxed">
            Lived human testimonies, grassroots chronicles, and verified field reports documenting how communities reclaim ecological sovereignty and intergenerational prosperity.
          </p>
        </div>

        {/* Action Button & Stats */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2.5 bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 font-mono text-xs font-bold rounded-sm flex items-center gap-2 transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Community Field Story</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm">
          {[
            { id: 'all', label: 'All Narratives' },
            { id: 'transformational_story', label: 'Transformational Stories' },
            { id: 'field_report', label: 'Field Reports' },
            { id: 'human_narrative', label: 'Human Narratives' },
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

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories, people, or rivers..."
            className="w-full bg-[#0D0D0D] border border-[#F5F5F0]/10 pl-9 pr-3 py-1.5 text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/30 rounded-sm focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Featured Lead Story */}
      {TRANSFORMATIONAL_STORIES[0] && selectedCategory === 'all' && !searchQuery && (
        <div className="p-6 sm:p-8 rounded-sm bg-[#0E1511] border border-[#C5A059]/40 relative overflow-hidden group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#C5A059] text-black font-bold rounded-sm">
                  Lead Bioregional Case
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#14261C] text-[#C5A059] border border-[#C5A059]/30 rounded-sm">
                  {TRANSFORMATIONAL_STORIES[0].categoryLabel}
                </span>
                <span className="text-xs font-mono text-[#F5F5F0]/60 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {TRANSFORMATIONAL_STORIES[0].readingTimeMinutes} min read
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#F5F5F0]">
                {TRANSFORMATIONAL_STORIES[0].title}
              </h2>

              <p className="text-xs sm:text-sm text-[#F5F5F0]/80 leading-relaxed font-sans">
                {TRANSFORMATIONAL_STORIES[0].subtitle}
              </p>

              {/* Empirical Deltas Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {TRANSFORMATIONAL_STORIES[0].metricDeltas.map((md, idx) => (
                  <div key={idx} className="p-3 bg-[#080808]/80 border border-[#F5F5F0]/10 rounded-sm space-y-0.5">
                    <span className="text-[10px] uppercase font-mono text-[#F5F5F0]/40 block">{md.metricName}</span>
                    <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <span>{md.beforeValue} → {md.afterValue}</span>
                    </div>
                    <span className="text-[10px] text-[#C5A059] font-mono">{md.deltaDescription}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-3 text-xs font-mono">
                <button
                  onClick={() => setActiveStoryModal(TRANSFORMATIONAL_STORIES[0])}
                  className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold rounded-sm flex items-center gap-2 transition-all shadow-md"
                >
                  <span>Read Full Field Narrative</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-[#F5F5F0]/60">
                  By {TRANSFORMATIONAL_STORIES[0].authorName} • {TRANSFORMATIONAL_STORIES[0].bioregion}
                </span>
              </div>
            </div>

            {/* Right Community Quote Card */}
            <div className="lg:col-span-4 p-5 bg-[#090D0B] border border-[#C5A059]/30 rounded-sm space-y-3 relative">
              <Quote className="w-6 h-6 text-[#C5A059]/40" />
              <p className="text-xs text-[#F5F5F0]/90 italic font-serif leading-relaxed">
                "{TRANSFORMATIONAL_STORIES[0].communityVoices[0]?.quote}"
              </p>
              <div className="pt-2 border-t border-[#F5F5F0]/10">
                <div className="text-xs font-bold font-mono text-[#C5A059]">
                  {TRANSFORMATIONAL_STORIES[0].communityVoices[0]?.authorName}
                </div>
                <div className="text-[10px] text-[#F5F5F0]/60">
                  {TRANSFORMATIONAL_STORIES[0].communityVoices[0]?.authorTitle}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Stories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F0]/60 border-b border-[#F5F5F0]/10 pb-2">
          <span>Displaying {filteredStories.length} Narratives & Reports</span>
          <span className="text-emerald-400">● Verified Field Evidence Hash Attached</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 transition-all flex flex-col justify-between space-y-5 hover:bg-[#121212] group"
            >
              <div className="space-y-3">
                {/* Category & Date */}
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 uppercase bg-[#1A1A1A] border border-[#F5F5F0]/20 text-[#C5A059] font-bold rounded-sm">
                    {story.categoryLabel}
                  </span>
                  <span className="text-[#F5F5F0]/40">
                    {story.readingTimeMinutes} min read
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-serif font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors leading-snug">
                  {story.title}
                </h3>

                <p className="text-xs text-[#F5F5F0]/70 line-clamp-3 leading-relaxed font-sans">
                  {story.summary}
                </p>

                {/* Author & Bioregion */}
                <div className="pt-2 border-t border-[#F5F5F0]/5 space-y-1 text-xs font-mono text-[#F5F5F0]/60">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="truncate">{story.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="truncate">{story.bioregion}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {story.tags.slice(0, 3).map((t, i) => (
                    <span key={i} className="px-2 py-0.5 text-[9px] font-mono bg-[#141414] text-[#F5F5F0]/60 rounded-sm">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#F5F5F0]/10 flex items-center justify-between">
                <button
                  onClick={() => setActiveStoryModal(story)}
                  className="text-xs font-mono text-[#C5A059] hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Read Story</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {story.verifiedEvidenceRoot && (
                  <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1" title="Cryptographic Proof">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>ZKP Verified</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STORY DETAIL READER MODAL */}
      {/* ========================================================================= */}
      {activeStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-[#0D0D0D] border border-[#C5A059]/50 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => {
                setActiveStoryModal(null);
                setIsPlayingAudio(false);
              }}
              className="absolute top-4 right-4 p-2 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#1A1A1A] rounded-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-3 border-b border-[#F5F5F0]/10 pb-5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1A1A1A] border border-[#F5F5F0]/20 text-[#C5A059] font-bold rounded-sm">
                  {activeStoryModal.categoryLabel}
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  ● Verified Community Narrative
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0]">
                {activeStoryModal.title}
              </h2>

              <p className="text-sm text-[#C5A059] font-mono">
                {activeStoryModal.subtitle}
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-mono text-[#F5F5F0]/70 pt-1">
                <span>✍️ {activeStoryModal.authorName} ({activeStoryModal.authorAffiliation})</span>
                <span>📍 {activeStoryModal.bioregion}</span>
                <span>📅 Published {activeStoryModal.publishDate}</span>
              </div>
            </div>

            {/* Audio Narration Bar */}
            <div className="p-3.5 bg-[#121B15] border border-[#C5A059]/30 rounded-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs font-mono text-[#F5F5F0]">
                <Volume2 className="w-4 h-4 text-[#C5A059]" />
                <span>Listen to Voice Narration in English & Swahili</span>
              </div>
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`px-3.5 py-1 text-xs font-mono rounded-sm transition-all ${
                  isPlayingAudio 
                    ? 'bg-emerald-500 text-black font-bold' 
                    : 'bg-[#C5A059] text-black font-bold hover:bg-[#b08e4c]'
                }`}
              >
                {isPlayingAudio ? '❚❚ Pause Audio' : '▶ Play Voice'}
              </button>
            </div>

            {/* Metric Deltas Box */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider font-bold">
                Empirical Baseline vs. Post-Intervention Metrics
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeStoryModal.metricDeltas.map((md, i) => (
                  <div key={i} className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-1">
                    <span className="text-[10px] uppercase font-mono text-[#F5F5F0]/40 block">{md.metricName}</span>
                    <div className="text-xs font-mono text-emerald-400 font-bold">
                      {md.beforeValue} → {md.afterValue}
                    </div>
                    <span className="text-[10px] text-[#C5A059] font-mono">{md.deltaDescription}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Story Full Body */}
            <div className="space-y-4 text-xs sm:text-sm text-[#F5F5F0]/90 leading-relaxed font-sans prose prose-invert max-w-none">
              <p className="font-serif text-base italic text-[#F5F5F0]/90 border-l-2 border-[#C5A059] pl-4 py-1">
                {activeStoryModal.leadParagraph}
              </p>
              
              <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed space-y-3 font-sans">
                {activeStoryModal.fullBodyMarkdown}
              </div>
            </div>

            {/* Community Voices */}
            {activeStoryModal.communityVoices.length > 0 && (
              <div className="p-4 bg-[#090D0B] border border-[#C5A059]/30 rounded-sm space-y-3">
                <div className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider font-bold">
                  Community Voice & Elder Testimony
                </div>
                {activeStoryModal.communityVoices.map((cv, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-xs italic text-[#F5F5F0] font-serif">
                      "{cv.quote}"
                    </p>
                    <div className="text-[11px] font-mono text-[#C5A059]">
                      — {cv.authorName}, {cv.authorTitle} ({cv.community})
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Proof & Close */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F0]/10 text-xs font-mono">
              {activeStoryModal.verifiedEvidenceRoot && (
                <div className="text-[10px] text-[#F5F5F0]/50 font-mono flex items-center gap-1.5 truncate max-w-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Merkle Root: {activeStoryModal.verifiedEvidenceRoot}</span>
                </div>
              )}

              <button
                onClick={() => {
                  setActiveStoryModal(null);
                  setIsPlayingAudio(false);
                }}
                className="px-4 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] text-[#F5F5F0] text-xs font-mono rounded-sm transition-colors ml-auto"
              >
                Close Story
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBMIT COMMUNITY STORY MODAL */}
      {/* ========================================================================= */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0D0D0D] border border-[#C5A059]/50 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsSubmitModalOpen(false);
                setSubmissionSuccess(false);
              }}
              className="absolute top-4 right-4 p-2 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#1A1A1A] rounded-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-[#F5F5F0]/10 pb-4">
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                COMMUNITY ORAL HISTORY SUBMISSION
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#F5F5F0]">
                Submit a Field Story or Case Report
              </h3>
              <p className="text-xs text-[#F5F5F0]/70">
                Share empirical transformations, grassroots breakthroughs, and indigenous ecological stewardship from your catchment.
              </p>
            </div>

            {submissionSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-emerald-400">Story Submitted to Epistemic Council</h4>
                <p className="text-xs text-[#F5F5F0]/80">
                  Your field narrative has been entered into the validation pipeline. Upon elder council review and sensor correlation, it will be published with cryptographic proof.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitModalOpen(false);
                    setSubmissionSuccess(false);
                  }}
                  className="px-4 py-2 bg-[#C5A059] text-black font-mono font-bold text-xs rounded-sm mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmissionSuccess(true);
                }}
                className="space-y-4 text-xs font-mono"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#F5F5F0]/70">Your Name & Title</label>
                    <input 
                      required
                      placeholder="e.g. Samuel Kiptoo, River Warden"
                      className="w-full bg-[#080808] border border-[#F5F5F0]/10 px-3 py-2 text-[#F5F5F0] rounded-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#F5F5F0]/70">Bioregion or Catchment</label>
                    <input 
                      required
                      placeholder="e.g. Mara River Catchment"
                      className="w-full bg-[#080808] border border-[#F5F5F0]/10 px-3 py-2 text-[#F5F5F0] rounded-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[#F5F5F0]/70">Story Title</label>
                  <input 
                    required
                    placeholder="e.g. Restoring the Sacred Springs of Mau"
                    className="w-full bg-[#080808] border border-[#F5F5F0]/10 px-3 py-2 text-[#F5F5F0] rounded-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#F5F5F0]/70">Field Narrative & Observed Ecological/Social Transformations</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Describe the initial challenges, community actions taken, verified metric changes, and key lessons..."
                    className="w-full bg-[#080808] border border-[#F5F5F0]/10 px-3 py-2 text-[#F5F5F0] rounded-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F5F5F0]/10">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-[#F5F5F0] rounded-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold rounded-sm shadow-md"
                  >
                    Submit for Council Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
