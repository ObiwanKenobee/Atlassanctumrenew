import React, { useState, useEffect, useMemo } from 'react';
import {
  StickyNote,
  MapPin,
  Plus,
  Trash2,
  ThumbsUp,
  Filter,
  Calendar,
  User,
  Tag,
  Check,
  X,
  Search,
  Sparkles,
  Compass,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';
import { useAuth } from '../../context/AuthContext';

export type AnnotationCategory =
  | 'Soil Health'
  | 'Mycelial Network'
  | 'Riparian Flow'
  | 'Flora Canopy'
  | 'Indigenous Wisdom'
  | 'Policy Observation';

export interface BioregionalAnnotation {
  id: string;
  bioregionId: string;
  title: string;
  content: string;
  category: AnnotationCategory;
  lat: number;
  lng: number;
  locationName: string;
  author: string;
  authorRole: string;
  timestamp: string;
  upvotes: number;
  tags: string[];
  pinned: boolean;
}

const DEFAULT_ANNOTATIONS: BioregionalAnnotation[] = [
  {
    id: 'ann-01',
    bioregionId: 'aberdare_riparian_watershed',
    title: 'Podocarpus Seedling Density Along Ridge #14',
    content: 'Natural germination of Podocarpus falcatus seedlings observed at 2,600m altitude following seasonal fog drip. Root mycorrhizal sheath intact with no fungal damping-off.',
    category: 'Flora Canopy',
    lat: -0.4350,
    lng: 36.7020,
    locationName: 'Aberdare Cloud Forest High Ridge',
    author: 'Elena Kiprono',
    authorRole: 'Indigenous Forest Ranger',
    timestamp: 'Aug 26, 2026, 10:15 AM',
    upvotes: 18,
    tags: ['Podocarpus', 'Canopy', 'Mycorrhizae'],
    pinned: true
  },
  {
    id: 'ann-02',
    bioregionId: 'aberdare_riparian_watershed',
    title: 'Riparian Silt Stabilization with Vetiver Bundles',
    content: 'Mathare River bio-swale installed 3 weeks ago has arrested sediment velocity. Turbidity dropped from 140 NTU to 38 NTU post-cloudburst.',
    category: 'Riparian Flow',
    lat: -1.2584,
    lng: 36.8523,
    locationName: 'Mathare Sub-Catchment Basin',
    author: 'David Mwangi',
    authorRole: 'Hydrological Field Officer',
    timestamp: 'Aug 25, 2026, 04:30 PM',
    upvotes: 24,
    tags: ['Vetiver', 'BioSwale', 'Turbidity'],
    pinned: true
  },
  {
    id: 'ann-03',
    bioregionId: 'mara_basin_corridor',
    title: 'Keyline Water Sponge Infiltration Breakthrough',
    content: 'Sub-soil decompaction along parabolic contour lines increased rainwater percolation depth to 85cm. Grazing cattle herds routed around active infiltration swales.',
    category: 'Soil Health',
    lat: -1.5021,
    lng: 35.1432,
    locationName: 'Upper Mara Agro-pastoral Buffer',
    author: 'Samwel ole Noolkito',
    authorRole: 'Elder Pastoral Steward',
    timestamp: 'Aug 24, 2026, 01:20 PM',
    upvotes: 31,
    tags: ['Keyline', 'Infiltration', 'Silvopasture'],
    pinned: false
  },
  {
    id: 'ann-04',
    bioregionId: 'aberdare_riparian_watershed',
    title: 'Traditional Cloud Seeding & Mist Harvesting Lore',
    content: 'Oral history with Kĩkũyũ forest elders confirms old-growth bamboo acts as essential mist comb during dry season inversion layers. Retain bamboo buffer intact.',
    category: 'Indigenous Wisdom',
    lat: -0.5820,
    lng: 36.6540,
    locationName: 'Kinangop Alpine Fringe',
    author: 'Wanjiku Karanja',
    authorRole: 'Community Epistemic Custodian',
    timestamp: 'Aug 22, 2026, 08:45 AM',
    upvotes: 42,
    tags: ['Bamboo', 'MistHarvesting', 'OralHistory'],
    pinned: true
  }
];

const CATEGORY_STYLES: Record<AnnotationCategory, { bg: string; text: string; border: string; badge: string }> = {
  'Soil Health': {
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    badge: 'bg-amber-900/60 text-amber-200 border-amber-500/40'
  },
  'Mycelial Network': {
    bg: 'bg-purple-950/40',
    text: 'text-purple-300',
    border: 'border-purple-500/40',
    badge: 'bg-purple-900/60 text-purple-200 border-purple-500/40'
  },
  'Riparian Flow': {
    bg: 'bg-sky-950/40',
    text: 'text-sky-300',
    border: 'border-sky-500/40',
    badge: 'bg-sky-900/60 text-sky-200 border-sky-500/40'
  },
  'Flora Canopy': {
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-900/60 text-emerald-200 border-emerald-500/40'
  },
  'Indigenous Wisdom': {
    bg: 'bg-[#C5A059]/20',
    text: 'text-[#C5A059]',
    border: 'border-[#C5A059]/50',
    badge: 'bg-[#C5A059]/30 text-[#F5F5F0] border-[#C5A059]/60'
  },
  'Policy Observation': {
    bg: 'bg-blue-950/40',
    text: 'text-blue-300',
    border: 'border-blue-500/40',
    badge: 'bg-blue-900/60 text-blue-200 border-blue-500/40'
  }
};

interface BioregionalAnnotationLayerProps {
  currentBioregionId?: string;
  currentBioregionName?: string;
  onSelectCoordinate?: (coords: { lat: number; lng: number; title: string }) => void;
  selectedAnnotationId?: string | null;
  onSelectAnnotation?: (annotation: BioregionalAnnotation | null) => void;
}

export const BioregionalAnnotationLayer: React.FC<BioregionalAnnotationLayerProps> = ({
  currentBioregionId = 'aberdare_riparian_watershed',
  currentBioregionName = 'Aberdare Range & Riparian Catchment',
  onSelectCoordinate,
  selectedAnnotationId,
  onSelectAnnotation
}) => {
  const { currentUser, userProfile } = useAuth();

  // Local storage persistence
  const [annotations, setAnnotations] = useState<BioregionalAnnotation[]>(() => {
    try {
      const saved = localStorage.getItem('atlas_sanctum_bioregional_annotations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load annotations from localStorage', e);
    }
    return DEFAULT_ANNOTATIONS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // New annotation form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<AnnotationCategory>('Flora Canopy');
  const [newLocationName, setNewLocationName] = useState<string>(`${currentBioregionName} Observation Point`);
  const [newLat, setNewLat] = useState<number>(-0.4500);
  const [newLng, setNewLng] = useState<number>(36.7100);
  const [newTags, setNewTags] = useState<string>('Biomass, GroundTruth');

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('atlas_sanctum_bioregional_annotations', JSON.stringify(annotations));
    } catch (e) {
      console.warn('Failed to save annotations to localStorage', e);
    }
  }, [annotations]);

  // Filtered annotations list
  const filteredAnnotations = useMemo(() => {
    return annotations.filter((ann) => {
      // Bioregion matching (or show all if matches watershed)
      const matchesBioregion = !currentBioregionId || ann.bioregionId === currentBioregionId || ann.bioregionId === 'all';
      
      // Category filter
      const matchesCategory = selectedCategory === 'all' || ann.category === selectedCategory;

      // Text search
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || 
        ann.title.toLowerCase().includes(query) ||
        ann.content.toLowerCase().includes(query) ||
        ann.author.toLowerCase().includes(query) ||
        ann.locationName.toLowerCase().includes(query) ||
        ann.tags.some(t => t.toLowerCase().includes(query));

      return matchesBioregion && matchesCategory && matchesQuery;
    });
  }, [annotations, currentBioregionId, selectedCategory, searchQuery]);

  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    audioFeedback.playSuccessChime();

    const authorName = userProfile?.displayName || currentUser?.displayName || 'Citizen Field Steward';
    const authorRole = userProfile?.accessLevel ? `${userProfile.accessLevel.toUpperCase()} Steward` : 'Bioregional Observer';

    const newAnn: BioregionalAnnotation = {
      id: `ann-${Date.now()}`,
      bioregionId: currentBioregionId,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      lat: Number(newLat),
      lng: Number(newLng),
      locationName: newLocationName.trim() || `${currentBioregionName} Field Station`,
      author: authorName,
      authorRole,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      upvotes: 1,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      pinned: true
    };

    setAnnotations(prev => [newAnn, ...prev]);

    // Reset form
    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);

    if (onSelectCoordinate) {
      onSelectCoordinate({ lat: newAnn.lat, lng: newAnn.lng, title: newAnn.title });
    }
  };

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioFeedback.playMicroTick();
    setAnnotations(prev =>
      prev.map(ann => (ann.id === id ? { ...ann, upvotes: ann.upvotes + 1 } : ann))
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioFeedback.playSubtleClick();
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
    if (selectedAnnotationId === id && onSelectAnnotation) {
      onSelectAnnotation(null);
    }
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioFeedback.playMicroTick();
    setAnnotations(prev =>
      prev.map(ann => (ann.id === id ? { ...ann, pinned: !ann.pinned } : ann))
    );
  };

  return (
    <div
      id="bioregional-annotation-layer"
      className="p-5 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-4 shadow-xl text-[#F5F5F0]"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#C5A059]/10 rounded-sm border border-[#C5A059]/30 text-[#C5A059]">
            <StickyNote className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#F5F5F0]">
                Bioregional Annotation Layer & Regeneration Insights
              </h3>
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/30 rounded-full font-bold">
                {filteredAnnotations.length} Pinned Notes
              </span>
            </div>
            <p className="text-[11px] text-[#F5F5F0]/60 font-sans">
              Persistent, geolocated ground-truth sticky notes and indigenous insights placed directly across the bioregional map.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="toggle-add-annotation-btn"
            onClick={() => {
              audioFeedback.playSubtleClick();
              setShowAddForm(!showAddForm);
            }}
            className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              showAddForm
                ? 'bg-rose-950/70 text-rose-300 border border-rose-500/40'
                : 'bg-[#C5A059] hover:bg-[#b08e4c] text-black shadow'
            }`}
          >
            {showAddForm ? (
              <>
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add Insight Note</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 bg-[#171717] hover:bg-[#222222] border border-[#F5F5F0]/15 rounded-sm text-[#F5F5F0]/70 hover:text-[#F5F5F0] transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse notes' : 'Expand notes'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Add New Annotation Inline Modal / Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddAnnotation}
          className="p-4 bg-[#141414] border border-[#C5A059]/40 rounded-sm space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
            <span className="text-xs font-mono font-bold uppercase text-[#C5A059] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              New Geolocated Regeneration Sticky Note
            </span>
            <span className="text-[10px] font-mono text-[#F5F5F0]/40">
              Author: {userProfile?.displayName || 'Citizen Field Steward'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/60">Note Title *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Mycelial root colonization in sector 4..."
                className="w-full bg-[#0D0D0D] border border-[#F5F5F0]/20 rounded-xs px-3 py-1.5 text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/60">Insight Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as AnnotationCategory)}
                className="w-full bg-[#0D0D0D] border border-[#F5F5F0]/20 rounded-xs px-3 py-1.5 text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none font-mono cursor-pointer"
              >
                <option value="Flora Canopy">Flora Canopy (Tree cover & vegetation)</option>
                <option value="Soil Health">Soil Health (Carbon, SOM & microbial)</option>
                <option value="Riparian Flow">Riparian Flow (Water quality & silt)</option>
                <option value="Mycelial Network">Mycelial Network (Fungal inoculation)</option>
                <option value="Indigenous Wisdom">Indigenous Wisdom (Oral tradition & practices)</option>
                <option value="Policy Observation">Policy Observation (Stewardship boundary)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/60">Regeneration Insight / Observation Details *</label>
            <textarea
              required
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Document specific empirical signals, species emergence, moisture conditions, or community steward actions observed at this location..."
              className="w-full bg-[#0D0D0D] border border-[#F5F5F0]/20 rounded-xs p-3 text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none font-sans leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/60">Location Name</label>
              <input
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="High Ridge Sector 14"
                className="w-full bg-[#0D0D0D] border border-[#F5F5F0]/20 rounded-xs px-3 py-1.5 text-xs text-[#F5F5F0] font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/60">Latitude (°N/S)</label>
              <input
                type="number"
                step="0.0001"
                value={newLat}
                onChange={(e) => setNewLat(parseFloat(e.target.value))}
                className="w-full bg-[#0D0D0D] border border-[#F5F5F0]/20 rounded-xs px-3 py-1.5 text-xs text-[#F5F5F0] font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/60">Longitude (°E/W)</label>
              <input
                type="number"
                step="0.0001"
                value={newLng}
                onChange={(e) => setNewLng(parseFloat(e.target.value))}
                className="w-full bg-[#0D0D0D] border border-[#F5F5F0]/20 rounded-xs px-3 py-1.5 text-xs text-[#F5F5F0] font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="Tags (comma separated)"
                className="bg-[#0D0D0D] border border-[#F5F5F0]/20 rounded-xs px-2.5 py-1 text-xs text-[#F5F5F0] font-mono w-48 sm:w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-mono text-[#F5F5F0] rounded-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Annotation</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter and search toolbar */}
      {isExpanded && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-1">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setSelectedCategory('all');
              }}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'bg-[#171717] hover:bg-[#222222] text-[#F5F5F0]/70 border border-[#F5F5F0]/15'
              }`}
            >
              All Categories ({annotations.length})
            </button>

            {(Object.keys(CATEGORY_STYLES) as AnnotationCategory[]).map((cat) => {
              const count = annotations.filter(a => a.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? CATEGORY_STYLES[cat].badge + ' font-bold'
                      : 'bg-[#171717] hover:bg-[#222222] text-[#F5F5F0]/60 border border-[#F5F5F0]/10'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C5A059]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sticky notes & insights..."
              className="w-full bg-[#121212] border border-[#F5F5F0]/15 hover:border-[#C5A059]/40 rounded-xs pl-8 pr-3 py-1 text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/30 font-sans focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>
      )}

      {/* Annotations Grid Cards */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {filteredAnnotations.length === 0 ? (
            <div className="col-span-full py-8 text-center bg-[#121212] border border-dashed border-[#F5F5F0]/15 rounded-sm p-4 space-y-2">
              <StickyNote className="w-8 h-8 text-[#C5A059]/40 mx-auto" />
              <p className="text-xs font-mono text-[#F5F5F0]/60">
                No regeneration annotations match your current filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-[10px] font-mono text-[#C5A059] underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredAnnotations.map((ann) => {
              const catStyle = CATEGORY_STYLES[ann.category] || CATEGORY_STYLES['Flora Canopy'];
              const isSelected = selectedAnnotationId === ann.id;

              return (
                <div
                  key={ann.id}
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    if (onSelectAnnotation) {
                      onSelectAnnotation(isSelected ? null : ann);
                    }
                    if (onSelectCoordinate) {
                      onSelectCoordinate({ lat: ann.lat, lng: ann.lng, title: ann.title });
                    }
                  }}
                  className={`p-4 rounded-sm border transition-all cursor-pointer relative group flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-[#1C1A14] border-[#C5A059] ring-1 ring-[#C5A059] shadow-lg'
                      : 'bg-[#121212] hover:bg-[#181818] border-[#F5F5F0]/15 hover:border-[#C5A059]/50'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Top row: Category + Pinned + Coordinates */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${catStyle.badge}`}>
                        {ann.category}
                      </span>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#F5F5F0]/50">
                        <MapPin className="w-3 h-3 text-[#C5A059]" />
                        <span>{ann.lat.toFixed(4)}°, {ann.lng.toFixed(4)}°</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-xs sm:text-sm font-bold text-[#F5F5F0] font-sans group-hover:text-[#C5A059] transition-colors line-clamp-1">
                      {ann.title}
                    </h4>

                    {/* Content */}
                    <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed line-clamp-3">
                      {ann.content}
                    </p>

                    {/* Tags */}
                    {ann.tags.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-1">
                        {ann.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono text-[#F5F5F0]/60 bg-[#1F1F1F] px-1.5 py-0.2 rounded-xs border border-[#F5F5F0]/10"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer metadata & actions */}
                  <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[#C5A059] font-medium truncate">{ann.author}</span>
                      <span>•</span>
                      <span className="truncate">{ann.locationName}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Upvote */}
                      <button
                        onClick={(e) => handleUpvote(ann.id, e)}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1B1B1B] hover:bg-[#252525] text-[#F5F5F0]/80 hover:text-emerald-300 border border-[#F5F5F0]/10 transition-colors cursor-pointer"
                        title="Upvote ground-truth insight"
                      >
                        <ThumbsUp className="w-3 h-3 text-emerald-400" />
                        <span>{ann.upvotes}</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={(e) => handleDelete(ann.id, e)}
                        className="p-1 text-[#F5F5F0]/40 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
