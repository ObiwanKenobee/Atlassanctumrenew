import React, { useState, useEffect, useRef } from 'react';
import {
  Edit3,
  Save,
  Trash2,
  Bookmark,
  Share2,
  MessageSquare,
  Sparkles,
  Link,
  Bold,
  Italic,
  Underline,
  List,
  Heading,
  Code,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Tag,
  Clock,
  MapPin,
  Plus,
  ShieldCheck,
  Filter,
  Search,
  FileText,
  Users,
  Compass,
  Radio,
  ThumbsUp,
  CornerDownRight,
  Send,
  Eye
} from 'lucide-react';
import { PageView } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

export interface AnnotationComment {
  id: string;
  author: string;
  avatar: string;
  council: string;
  text: string;
  timestamp: string;
  attested: boolean;
}

export interface RegenerationAnnotation {
  id: string;
  title: string;
  category: 'Regeneration Insight' | 'Indigenous Practice' | 'Empirical Field Note' | 'Biophysical Anomaly' | 'Restoration Hypothesis';
  richContentHtml: string;
  plainText: string;
  author: string;
  authorAvatar?: string;
  authorRole?: string;
  stewardCouncil: string;
  zoneId: string;
  zoneName: string;
  latitude: number;
  longitude: number;
  altitudeMeters: number;
  confidenceScore: number;
  epistemicTier: string;
  tags: string[];
  embeddedLinks?: { label: string; targetModule: PageView; targetId?: string }[];
  timestamp: string;
  pinned: boolean;
  color: string;
  upvotes: number;
  isUpvoted?: boolean;
  comments: AnnotationComment[];
}

export const ATLAS_MODULE_LINKS: { id: PageView; label: string; desc: string; color: string }[] = [
  { id: 'evidence-mapping', label: 'Evidence Mapping', desc: 'In-situ sensor telemetry & raw field proofs', color: '#10B981' },
  { id: 'bioregional-twin', label: 'Bioregional Twin', desc: 'D3 knowledge graph & causal simulation', color: '#06B6D4' },
  { id: 'failure-ledger', label: 'Failure Ledger', desc: 'Epistemic post-mortems & anti-fragile learnings', color: '#F43F5E' },
  { id: 'stewardship-reputation', label: 'Stewardship Reputation', desc: 'Attestation provenance & ecological credentials', color: '#8B5CF6' },
  { id: 'studio', label: 'Studio & Scenarios', desc: 'Biophilic geometry & sacred landscape patterns', color: '#C5A059' },
  { id: 'governance', label: 'Governance & Charters', desc: 'Planetary boundary governance & treaties', color: '#3B82F6' },
  { id: 'regenerative-mission', label: 'Regenerative Missions', desc: 'Active ecological restoration projects', color: '#10B981' }
];

const INITIAL_ANNOTATIONS: RegenerationAnnotation[] = [
  {
    id: 'ann-001',
    title: 'Rhizosphere Inoculation Synergies in Cloud Forest Margins',
    category: 'Regeneration Insight',
    richContentHtml: '<p>Empirical field trials indicate that pre-inoculating <strong>Podocarpus falcatus</strong> root crowns with <em>native glomalin-producing fungal spores</em> increases sapling summer drought survival from 42% to <strong>91.4%</strong>. When coupled with keyline swales, this activates a self-reinforcing soil sponge.</p><p>Cross-reference telemetry in <span data-module="evidence-mapping" class="atlas-module-pill">🔗 Evidence Mapping</span> and compare historical failures in <span data-module="failure-ledger" class="atlas-module-pill">🔗 Failure Ledger (FL-2025-001)</span>.</p>',
    plainText: 'Empirical field trials indicate that pre-inoculating Podocarpus falcatus root crowns with native glomalin-producing fungal spores increases sapling summer drought survival from 42% to 91.4%. When coupled with keyline swales, this activates a self-reinforcing soil sponge.',
    author: 'Dr. Wanjiku Muthoni',
    authorAvatar: 'WM',
    authorRole: 'Chief Botanical Mycologist',
    stewardCouncil: 'Aberdare Forest Guardians Council',
    zoneId: 'zone-aberdare-ridge',
    zoneName: 'Aberdare Climax Podocarpus Ridge',
    latitude: -0.4192,
    longitude: 36.8821,
    altitudeMeters: 2640,
    confidenceScore: 98,
    epistemicTier: 'Tier-1 Chromatographic Assay',
    tags: ['Mycelium', 'Glomalin', 'Keyline', 'GroundTruth'],
    embeddedLinks: [
      { label: 'Evidence Mapping', targetModule: 'evidence-mapping', targetId: 'raw-sensor-ysi-probe' },
      { label: 'Failure Ledger', targetModule: 'failure-ledger', targetId: 'FL-2025-001' }
    ],
    timestamp: '2 hours ago',
    pinned: true,
    color: '#10B981',
    upvotes: 18,
    isUpvoted: true,
    comments: [
      {
        id: 'c-1',
        author: 'Eco-Hydrologist Sara Chen',
        avatar: 'SC',
        council: 'Rift Valley Basin Observatory',
        text: 'Confirmed via YSI Hydrostatic sonder in Sub-basin 4. Infiltration rate surged from 14mm/hr to 48mm/hr post-inoculation.',
        timestamp: '1 hour ago',
        attested: true
      },
      {
        id: 'c-2',
        author: 'Elder Mzee Ole Kaelo',
        avatar: 'MK',
        council: 'Maasai Mara Pastoralist Trust',
        text: 'Matches traditional Olosho observations along the western ridges.',
        timestamp: '25m ago',
        attested: true
      }
    ]
  },
  {
    id: 'ann-002',
    title: 'Customary Pastoralist Olosho Rotation Corridors',
    category: 'Indigenous Practice',
    richContentHtml: '<p>The <em>Olosho seasonal grazing calendar</em> preserves perennial bunchgrass root depth by enforcing a <strong>90-day seasonal rest</strong> on riparian riverbanks. Satellite NDVI verifies a <strong>+2.1°C microclimate cooling effect</strong>.</p><p>Explore attested reputation records in <span data-module="stewardship-reputation" class="atlas-module-pill">🔗 Stewardship Reputation</span>.</p>',
    plainText: 'The Olosho seasonal grazing calendar preserves perennial bunchgrass root depth by enforcing a 90-day seasonal rest on riparian riverbanks. Satellite NDVI verifies a +2.1°C microclimate cooling effect.',
    author: 'Elder Mzee Ole Kaelo',
    authorAvatar: 'MK',
    authorRole: 'Custodian of Olosho Customary Rangelands',
    stewardCouncil: 'Maasai Mara Pastoralist Trust',
    zoneId: 'zone-mara-pastoral',
    zoneName: 'Mara Basin Olosho Silvopasture Sponge',
    latitude: -1.4829,
    longitude: 35.2104,
    altitudeMeters: 1720,
    confidenceScore: 96,
    epistemicTier: 'Tier-1 Elder Council Ledger',
    tags: ['Olosho', 'Pastoralism', 'Microclimate', 'TEK'],
    embeddedLinks: [
      { label: 'Stewardship Reputation', targetModule: 'stewardship-reputation', targetId: 'lk-2025-002' }
    ],
    timestamp: 'Yesterday',
    pinned: true,
    color: '#F59E0B',
    upvotes: 24,
    isUpvoted: false,
    comments: [
      {
        id: 'c-3',
        author: 'Agro-Ecologist David Kamau',
        avatar: 'DK',
        council: 'East African Agroforestry Council',
        text: 'Deep-root Acacia xanthophloea canopy recruitment is now 3.4x higher inside the Olosho reserve perimeter.',
        timestamp: '5 hours ago',
        attested: true
      }
    ]
  },
  {
    id: 'ann-003',
    title: 'Urban Vetiver Bio-Swale Heavy Metal Sedimentation Protocol',
    category: 'Empirical Field Note',
    richContentHtml: '<p>Bio-swales planted with <strong>Chrysopogon zizanioides</strong> (Vetiver) trapped <strong>72% of suspended urban silt</strong> and stabilized steep clay banks during flash flood events.</p><p>Check biophysical models in <span data-module="bioregional-twin" class="atlas-module-pill">🔗 Bioregional Twin</span> and governance charters in <span data-module="governance" class="atlas-module-pill">🔗 Governance & Charters</span>.</p>',
    plainText: 'Bio-swales planted with Chrysopogon zizanioides (Vetiver) trapped 72% of suspended urban silt and stabilized steep clay banks during flash flood events.',
    author: 'Engineer A. Kiprop',
    authorAvatar: 'AK',
    authorRole: 'Urban Watershed Engineer',
    stewardCouncil: 'Nairobi River Basin Directorate',
    zoneId: 'zone-mathare-swale',
    zoneName: 'Mathare Riparian Bio-Swale Corridor',
    latitude: -1.2644,
    longitude: 36.8587,
    altitudeMeters: 1670,
    confidenceScore: 94,
    epistemicTier: 'Tier-1 Galvanic Turbidity Probe Mesh',
    tags: ['Vetiver', 'BioSwale', 'UrbanHydrology'],
    embeddedLinks: [
      { label: 'Bioregional Twin', targetModule: 'bioregional-twin' },
      { label: 'Governance & Charters', targetModule: 'governance' }
    ],
    timestamp: '3 days ago',
    pinned: false,
    color: '#06B6D4',
    upvotes: 12,
    isUpvoted: false,
    comments: []
  }
];

interface BioregionalAnnotationLayerProps {
  selectedBioregionId?: string;
  onNavigateToModule?: (moduleId: PageView, targetId?: string) => void;
}

export const BioregionalAnnotationLayer: React.FC<BioregionalAnnotationLayerProps> = ({
  selectedBioregionId = 'aberdare_riparian_watershed',
  onNavigateToModule
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [annotations, setAnnotations] = useState<RegenerationAnnotation[]>(() => {
    const saved = localStorage.getItem('atlas_bioregional_annotations_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ANNOTATIONS;
      }
    }
    return INITIAL_ANNOTATIONS;
  });

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('zone-aberdare-ridge');
  const [annotationCategory, setAnnotationCategory] = useState<RegenerationAnnotation['category']>('Regeneration Insight');
  const [titleInput, setTitleInput] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('SoilOrganicMatter, Mycelium, Infiltration');
  const [authorInput, setAuthorInput] = useState<string>('Field Steward Audit Unit');
  const [latInput, setLatInput] = useState<number>(-0.4192);
  const [lngInput, setLngInput] = useState<number>(36.8821);
  const [altInput, setAltInput] = useState<number>(2640);
  const [showModuleLinkDropdown, setShowModuleLinkDropdown] = useState<boolean>(false);
  const [isLiveSharedMode, setIsLiveSharedMode] = useState<boolean>(true);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState<string>('');
  const [selectedCoordinatePin, setSelectedCoordinatePin] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('atlas_bioregional_annotations_v2', JSON.stringify(annotations));
  }, [annotations]);

  // Execute formatting commands on rich text contentEditable
  const formatText = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    audioFeedback.playMicroTick();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Embed a rich interactive link to an Atlas Sanctum intelligence module
  const embedAtlasModuleLink = (moduleItem: typeof ATLAS_MODULE_LINKS[0]) => {
    const selection = window.getSelection();
    const selectedText = selection && selection.toString().trim() ? selection.toString() : moduleItem.label;

    const pillHtml = `<span data-module="${moduleItem.id}" class="inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 rounded text-[11px] font-mono font-bold bg-[#1A1A1A] border border-[#C5A059]/40 text-[#C5A059] cursor-pointer hover:bg-[#2A2A2A] hover:border-[#C5A059] transition-colors" contenteditable="false">🔗 ${selectedText}</span>&nbsp;`;

    document.execCommand('insertHTML', false, pillHtml);
    setShowModuleLinkDropdown(false);
    audioFeedback.playSuccess();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Upvote / Attest Insight
  const handleToggleUpvote = (id: string) => {
    setAnnotations(prev =>
      prev.map(ann => {
        if (ann.id === id) {
          const isUpvoted = !ann.isUpvoted;
          return {
            ...ann,
            isUpvoted,
            upvotes: isUpvoted ? ann.upvotes + 1 : ann.upvotes - 1
          };
        }
        return ann;
      })
    );
    audioFeedback.playSubtleClick();
  };

  // Add reply / peer attestation
  const handleAddComment = (annotationId: string) => {
    if (!replyInput.trim()) return;

    const newComment: AnnotationComment = {
      id: `c-${Date.now()}`,
      author: 'Active Bioregional Steward',
      avatar: 'AS',
      council: 'Sanctum Field Operations Desk',
      text: replyInput.trim(),
      timestamp: 'Just now',
      attested: true
    };

    setAnnotations(prev =>
      prev.map(ann =>
        ann.id === annotationId
          ? { ...ann, comments: [...ann.comments, newComment] }
          : ann
      )
    );

    setReplyInput('');
    setActiveReplyId(null);
    audioFeedback.playDataSave();
  };

  // Save or Update Annotation
  const handleSaveAnnotation = () => {
    if (!titleInput.trim() || !editorRef.current) {
      return;
    }

    const html = editorRef.current.innerHTML;
    const plainText = editorRef.current.innerText;

    // Detect embedded module links
    const detectedLinks: { label: string; targetModule: PageView; targetId?: string }[] = [];
    ATLAS_MODULE_LINKS.forEach(mod => {
      if (html.includes(`data-module="${mod.id}"`) || html.includes(mod.label)) {
        detectedLinks.push({ label: mod.label, targetModule: mod.id });
      }
    });

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const zoneNames: Record<string, string> = {
      'zone-aberdare-ridge': 'Aberdare Climax Podocarpus Ridge',
      'zone-mathare-swale': 'Mathare Riparian Bio-Swale Corridor',
      'zone-mara-pastoral': 'Mara Basin Olosho Silvopasture Sponge',
      'zone-kikuyu-flyway': 'Kikuyu Escarpment Avian Flyway',
      'zone-naivasha-aquifer': 'Lake Naivasha Subsurface Aquifer Sponge'
    };

    if (editingId) {
      setAnnotations(prev =>
        prev.map(ann =>
          ann.id === editingId
            ? {
                ...ann,
                title: titleInput,
                category: annotationCategory,
                richContentHtml: html,
                plainText,
                author: authorInput,
                zoneId: selectedZone,
                zoneName: zoneNames[selectedZone] || 'Aberdare Bioregional Zone',
                latitude: latInput,
                longitude: lngInput,
                altitudeMeters: altInput,
                tags: parsedTags,
                embeddedLinks: detectedLinks
              }
            : ann
        )
      );
      audioFeedback.playImpactTrigger();
    } else {
      const newAnnotation: RegenerationAnnotation = {
        id: `ann-${Date.now()}`,
        title: titleInput,
        category: annotationCategory,
        richContentHtml: html,
        plainText,
        author: authorInput,
        authorAvatar: authorInput.split(' ').map(s => s[0]).join('').substring(0, 2).toUpperCase() || 'ST',
        authorRole: 'Field Verification Steward',
        stewardCouncil: 'Atlas Sanctum Bioregional Council',
        zoneId: selectedZone,
        zoneName: zoneNames[selectedZone] || 'Aberdare Bioregional Zone',
        latitude: latInput,
        longitude: lngInput,
        altitudeMeters: altInput,
        confidenceScore: 97,
        epistemicTier: 'Tier-1 In-Situ Observation',
        tags: parsedTags.length > 0 ? parsedTags : ['RegenerationInsight'],
        embeddedLinks: detectedLinks,
        timestamp: 'Just now',
        pinned: true,
        upvotes: 1,
        isUpvoted: true,
        comments: [],
        color:
          annotationCategory === 'Regeneration Insight'
            ? '#10B981'
            : annotationCategory === 'Indigenous Practice'
            ? '#F59E0B'
            : annotationCategory === 'Empirical Field Note'
            ? '#06B6D4'
            : '#8B5CF6'
      };

      setAnnotations(prev => [newAnnotation, ...prev]);
      audioFeedback.playSuccess();
    }

    // Reset Form
    setIsCreating(false);
    setEditingId(null);
    setTitleInput('');
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  const handleStartEdit = (ann: RegenerationAnnotation) => {
    setIsCreating(true);
    setEditingId(ann.id);
    setTitleInput(ann.title);
    setAnnotationCategory(ann.category);
    setSelectedZone(ann.zoneId);
    setAuthorInput(ann.author);
    setLatInput(ann.latitude);
    setLngInput(ann.longitude);
    setAltInput(ann.altitudeMeters);
    setTagsInput(ann.tags.join(', '));
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = ann.richContentHtml;
      }
    }, 50);
    audioFeedback.playMicroTick();
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
    audioFeedback.playMicroTick();
  };

  const handleTogglePin = (id: string) => {
    setAnnotations(prev =>
      prev.map(a => (a.id === id ? { ...a, pinned: !a.pinned } : a))
    );
    audioFeedback.playMicroTick();
  };

  // Filtered list
  const filteredAnnotations = annotations.filter(ann => {
    if (filterCategory !== 'All' && ann.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ann.title.toLowerCase().includes(q);
      const matchText = ann.plainText.toLowerCase().includes(q);
      const matchTags = ann.tags.some(t => t.toLowerCase().includes(q));
      const matchAuthor = ann.author.toLowerCase().includes(q);
      if (!matchTitle && !matchText && !matchTags && !matchAuthor) return false;
    }
    return true;
  });

  return (
    <div
      id="bioregional-annotation-layer"
      className="p-6 bg-[#0B0F0C] border border-emerald-500/30 rounded-sm space-y-6 shadow-2xl text-[#F5F5F0]"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Real-Time Shared Bioregional Annotation Layer & Epistemic Insights
            </span>
            <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-emerald-400 animate-ping" />
              Live Mesh Sync
            </span>
          </div>
          <h2 className="text-xl font-serif font-bold text-[#F5F5F0] flex items-center gap-2">
            <span>Collaborative Regeneration Insights & Coordinate Notes</span>
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-3xl font-sans">
            Multiple stewards share geo-referenced observations, indigenous practices, and epistemic field attestations anchored directly to watershed GPS coordinates.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setIsCreating(!isCreating);
              setEditingId(null);
              setTitleInput('');
              if (editorRef.current) editorRef.current.innerHTML = '';
              audioFeedback.playMicroTick();
            }}
            className={`px-3.5 py-2 rounded-xs border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              isCreating
                ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                : 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500 text-emerald-300'
            }`}
          >
            {isCreating ? <Trash2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isCreating ? 'Cancel Note' : 'New Shared Insight'}</span>
          </button>
        </div>
      </div>

      {/* Spatial Coordinate Map Pin Preview Bar */}
      <div className="p-3 bg-[#080C0A] border border-emerald-500/20 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#F5F5F0]/70">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Active Coordinate Anchors: <strong className="text-white">{annotations.length} Shared Pins</strong></span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {annotations.slice(0, 3).map(ann => (
            <button
              key={ann.id}
              onClick={() => {
                setSelectedCoordinatePin(ann.id);
                audioFeedback.playMicroTick();
              }}
              className="px-2 py-1 rounded bg-[#121814] hover:bg-[#1A241D] border border-emerald-500/30 text-[10px] text-emerald-300 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-[#C5A059]" />
              <span>{ann.latitude.toFixed(3)}°, {ann.longitude.toFixed(3)}°</span>
              <span className="text-[#F5F5F0]/40 font-sans">({ann.author.split(' ')[0]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rich-Text Editor Form */}
      {isCreating && (
        <div className="bg-[#111613] border-2 border-emerald-500/50 rounded-sm p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
            <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {editingId ? 'Edit Shared Regeneration Annotation' : 'Author Geo-Referenced Regeneration Insight'}
            </span>
            <div className="flex items-center gap-2">
              <select
                value={annotationCategory}
                onChange={e => setAnnotationCategory(e.target.value as any)}
                className="bg-[#0A0D0A] border border-[#F5F5F0]/20 rounded px-2.5 py-1 text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                <option value="Regeneration Insight">Regeneration Insight</option>
                <option value="Indigenous Practice">Indigenous Practice</option>
                <option value="Empirical Field Note">Empirical Field Note</option>
                <option value="Biophysical Anomaly">Biophysical Anomaly</option>
                <option value="Restoration Hypothesis">Restoration Hypothesis</option>
              </select>
            </div>
          </div>

          {/* Title & Zone Selector */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8">
              <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 mb-1 block">Insight Title</label>
              <input
                type="text"
                placeholder="e.g. Mycorrhizal Glomalin Fixation in High Ridge Keyline Swales..."
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                className="w-full bg-[#0A0D0A] border border-[#F5F5F0]/20 rounded px-3 py-2 text-xs font-sans text-[#F5F5F0] focus:outline-none focus:border-emerald-400 placeholder-[#F5F5F0]/30"
              />
            </div>
            <div className="md:col-span-4">
              <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 mb-1 block">Target Bioregional Zone</label>
              <select
                value={selectedZone}
                onChange={e => setSelectedZone(e.target.value)}
                className="w-full bg-[#0A0D0A] border border-[#F5F5F0]/20 rounded px-3 py-2 text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                <option value="zone-aberdare-ridge">Aberdare Climax Podocarpus Ridge</option>
                <option value="zone-mathare-swale">Mathare Riparian Bio-Swale Corridor</option>
                <option value="zone-mara-pastoral">Mara Basin Olosho Silvopasture Sponge</option>
                <option value="zone-kikuyu-flyway">Kikuyu Escarpment Avian Flyway</option>
                <option value="zone-naivasha-aquifer">Lake Naivasha Subsurface Aquifer Sponge</option>
              </select>
            </div>
          </div>

          {/* Coordinates Inputs */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-[#080B09] border border-[#F5F5F0]/10 rounded">
            <div>
              <label className="text-[9px] font-mono uppercase text-emerald-400 mb-1 block flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={latInput}
                onChange={e => setLatInput(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0E1410] border border-[#F5F5F0]/20 rounded px-2 py-1 text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="text-[9px] font-mono uppercase text-emerald-400 mb-1 block flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={lngInput}
                onChange={e => setLngInput(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0E1410] border border-[#F5F5F0]/20 rounded px-2 py-1 text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="text-[9px] font-mono uppercase text-emerald-400 mb-1 block flex items-center gap-1">
                <Compass className="w-3 h-3" /> Altitude (Meters)
              </label>
              <input
                type="number"
                step="10"
                value={altInput}
                onChange={e => setAltInput(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#0E1410] border border-[#F5F5F0]/20 rounded px-2 py-1 text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Rich-Text Formatting Toolbar */}
          <div className="p-2 bg-[#090C0A] border border-[#F5F5F0]/15 rounded flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => formatText('bold')}
              title="Bold (Ctrl+B)"
              className="p-1.5 rounded hover:bg-[#1A221C] text-[#F5F5F0]/80 hover:text-white border border-transparent hover:border-emerald-500/40 cursor-pointer"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => formatText('italic')}
              title="Italic (Ctrl+I)"
              className="p-1.5 rounded hover:bg-[#1A221C] text-[#F5F5F0]/80 hover:text-white border border-transparent hover:border-emerald-500/40 cursor-pointer"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => formatText('underline')}
              title="Underline (Ctrl+U)"
              className="p-1.5 rounded hover:bg-[#1A221C] text-[#F5F5F0]/80 hover:text-white border border-transparent hover:border-emerald-500/40 cursor-pointer"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-[#F5F5F0]/20 mx-1" />

            <button
              type="button"
              onClick={() => formatText('insertUnorderedList')}
              title="Bullet List"
              className="p-1.5 rounded hover:bg-[#1A221C] text-[#F5F5F0]/80 hover:text-white border border-transparent hover:border-emerald-500/40 cursor-pointer"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => formatText('formatBlock', '<h3>')}
              title="Heading Level 3"
              className="p-1.5 rounded hover:bg-[#1A221C] text-[#F5F5F0]/80 hover:text-white border border-transparent hover:border-emerald-500/40 cursor-pointer"
            >
              <Heading className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => formatText('formatBlock', '<pre>')}
              title="Telemetry Code / Metric Block"
              className="p-1.5 rounded hover:bg-[#1A221C] text-[#F5F5F0]/80 hover:text-white border border-transparent hover:border-emerald-500/40 cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-[#F5F5F0]/20 mx-1" />

            {/* Embedded Module Link Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModuleLinkDropdown(!showModuleLinkDropdown)}
                className="px-2.5 py-1 rounded bg-[#1D2820] hover:bg-[#25362A] text-emerald-300 border border-emerald-500/40 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
              >
                <Link className="w-3 h-3" />
                <span>Embed Atlas Module Link</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showModuleLinkDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-[#0F1410] border border-[#C5A059]/40 rounded shadow-2xl p-1 z-30 space-y-0.5">
                  <div className="px-2 py-1 text-[9px] font-mono uppercase text-[#F5F5F0]/40 border-b border-[#F5F5F0]/10">
                    Insert Hyperlink to Intelligence Module
                  </div>
                  {ATLAS_MODULE_LINKS.map(mod => (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => embedAtlasModuleLink(mod)}
                      className="w-full px-2 py-1.5 text-left rounded hover:bg-[#1A221C] flex items-center justify-between text-xs font-mono text-[#F5F5F0] hover:text-emerald-300 cursor-pointer"
                    >
                      <span className="font-bold">{mod.label}</span>
                      <span className="text-[9px] text-[#C5A059]">Module ↗</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rich-Text Editable Canvas */}
          <div>
            <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 mb-1 block">
              Formatted Insight Body (Supports rich text, bold, italic, bullet lists, and embedded module pills)
            </label>
            <div
              ref={editorRef}
              contentEditable
              data-placeholder="Document your qualitative biophysical observation or indigenous ecological practice here..."
              className="w-full min-h-[140px] max-h-[300px] overflow-y-auto bg-[#080B09] border border-emerald-500/30 rounded p-4 text-xs font-sans text-[#F5F5F0] focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 leading-relaxed shadow-inner"
              style={{ minHeight: '140px' }}
            />
          </div>

          {/* Tags & Author Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 mb-1 block">
                Tags (Comma separated)
              </label>
              <div className="flex items-center gap-1.5 bg-[#0A0D0A] border border-[#F5F5F0]/20 rounded px-2.5 py-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="Mycelium, Glomalin, Infiltration"
                  className="w-full bg-transparent text-xs font-mono text-[#F5F5F0] focus:outline-none placeholder-[#F5F5F0]/30"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 mb-1 block">
                Auditing Steward / Attribution
              </label>
              <div className="flex items-center gap-1.5 bg-[#0A0D0A] border border-[#F5F5F0]/20 rounded px-2.5 py-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <input
                  type="text"
                  value={authorInput}
                  onChange={e => setAuthorInput(e.target.value)}
                  placeholder="Dr. Wanjiku Muthoni • Botanical Field Lead"
                  className="w-full bg-transparent text-xs font-mono text-[#F5F5F0] focus:outline-none placeholder-[#F5F5F0]/30"
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F5F5F0]/10">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] border border-[#F5F5F0]/20 text-[#F5F5F0]/70 text-xs font-mono rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAnnotation}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingId ? 'Update Insight' : 'Publish to Watershed Mesh'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#0A0D0A] border border-[#F5F5F0]/10 rounded-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 flex items-center gap-1">
            <Filter className="w-3 h-3 text-emerald-400" /> Filter:
          </span>
          {['All', 'Regeneration Insight', 'Indigenous Practice', 'Empirical Field Note', 'Biophysical Anomaly'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setFilterCategory(cat);
                audioFeedback.playMicroTick();
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-[#141414] border border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#141414] border border-[#F5F5F0]/20 rounded px-2.5 py-1">
            <Search className="w-3.5 h-3.5 text-[#F5F5F0]/40" />
            <input
              type="text"
              placeholder="Search insights or stewards..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs font-sans text-[#F5F5F0] focus:outline-none placeholder-[#F5F5F0]/30 w-44"
            />
          </div>
        </div>
      </div>

      {/* Annotations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnnotations.length === 0 ? (
          <div className="col-span-full py-12 text-center space-y-2 bg-[#090C0A] border border-[#F5F5F0]/5 rounded">
            <FileText className="w-8 h-8 text-emerald-500/40 mx-auto" />
            <h4 className="text-sm font-serif text-[#F5F5F0]">No Annotations Found</h4>
            <p className="text-xs text-[#F5F5F0]/40 font-sans">
              Click &quot;New Shared Insight&quot; above to author rich field observations.
            </p>
          </div>
        ) : (
          filteredAnnotations.map(ann => (
            <div
              key={ann.id}
              className="p-4 bg-[#0F1410] border border-[#F5F5F0]/10 hover:border-emerald-500/50 rounded-sm space-y-3 transition-all flex flex-col justify-between shadow-md"
            >
              <div className="space-y-2.5">
                {/* Header Badge & Contributor Profile */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-900/60 border border-emerald-400 flex items-center justify-center text-[10px] font-bold text-emerald-200">
                      {ann.authorAvatar || 'ST'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F5F5F0] line-clamp-1">{ann.author}</div>
                      <div className="text-[9px] text-[#C5A059] font-mono">{ann.stewardCouncil}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(ann.id)}
                      title={ann.pinned ? 'Pinned' : 'Pin to Twin'}
                      className={`p-1 rounded cursor-pointer ${
                        ann.pinned ? 'text-emerald-400 bg-emerald-950/50' : 'text-[#F5F5F0]/30 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleStartEdit(ann)}
                      title="Edit Insight"
                      className="p-1 rounded text-[#F5F5F0]/40 hover:text-white cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAnnotation(ann.id)}
                      title="Delete Insight"
                      className="p-1 rounded text-[#F5F5F0]/40 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Category Pill & GPS Coordinates */}
                <div className="flex items-center justify-between text-[9px] font-mono pt-1">
                  <span
                    className="px-2 py-0.5 rounded font-bold uppercase border"
                    style={{
                      backgroundColor: `${ann.color}15`,
                      borderColor: `${ann.color}40`,
                      color: ann.color
                    }}
                  >
                    {ann.category}
                  </span>
                  <span className="text-[#F5F5F0]/50 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-[#C5A059]" />
                    {ann.latitude.toFixed(3)}°, {ann.longitude.toFixed(3)}° • {ann.altitudeMeters}m
                  </span>
                </div>

                {/* Title & Zone */}
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#F5F5F0] leading-snug">
                    {ann.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#C5A059] mt-0.5">
                    <span>{ann.zoneName}</span>
                  </div>
                </div>

                {/* Rich HTML Rendered Content */}
                <div
                  className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed space-y-1.5 max-h-36 overflow-y-auto pr-1 text-left"
                  onClick={e => {
                    // Check if user clicked an embedded module pill
                    const target = e.target as HTMLElement;
                    const moduleAttr = target.closest('[data-module]')?.getAttribute('data-module') as PageView;
                    if (moduleAttr && onNavigateToModule) {
                      onNavigateToModule(moduleAttr);
                      audioFeedback.playViewTransition();
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: ann.richContentHtml }}
                />
              </div>

              {/* Threaded Comments & Attestations */}
              <div className="space-y-2 pt-2 border-t border-[#F5F5F0]/10">
                {/* Upvote & Reply Toggle */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => handleToggleUpvote(ann.id)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-colors ${
                      ann.isUpvoted
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-[#141414] text-[#F5F5F0]/60 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{ann.upvotes} Attestations</span>
                  </button>

                  <button
                    onClick={() => setActiveReplyId(activeReplyId === ann.id ? null : ann.id)}
                    className="flex items-center gap-1 text-[#F5F5F0]/50 hover:text-emerald-300 cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>{ann.comments.length} Replies</span>
                  </button>
                </div>

                {/* Comment Thread List */}
                {ann.comments.length > 0 && (
                  <div className="space-y-1.5 pl-2 border-l-2 border-emerald-500/20 pt-1 text-[11px] font-sans">
                    {ann.comments.map(c => (
                      <div key={c.id} className="p-1.5 bg-[#090D0A] rounded text-[#F5F5F0]/80">
                        <div className="flex items-center justify-between font-mono text-[9px] text-[#C5A059]">
                          <span>{c.author}</span>
                          <span className="text-[#F5F5F0]/40">{c.timestamp}</span>
                        </div>
                        <p className="pt-0.5">{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input Box */}
                {activeReplyId === ann.id && (
                  <div className="flex items-center gap-1 pt-1">
                    <input
                      type="text"
                      placeholder="Add field attestation or verification..."
                      value={replyInput}
                      onChange={e => setReplyInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleAddComment(ann.id);
                      }}
                      className="w-full bg-[#0A0D0A] border border-emerald-500/30 rounded px-2 py-1 text-xs font-sans text-[#F5F5F0] focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      onClick={() => handleAddComment(ann.id)}
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-black rounded cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Footer Timestamp */}
                <div className="flex items-center justify-between text-[9px] font-mono text-[#F5F5F0]/40 pt-1">
                  <span>{ann.epistemicTier}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {ann.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
