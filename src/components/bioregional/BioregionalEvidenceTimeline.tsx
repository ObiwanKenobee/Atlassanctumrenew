import React, { useState, useMemo, useRef } from 'react';
import {
  Clock,
  Calendar,
  Camera,
  MapPin,
  ShieldCheck,
  StickyNote,
  Plus,
  Trash2,
  Maximize2,
  Filter,
  CheckCircle2,
  Tag,
  ArrowUpDown,
  Sparkles,
  TreePine,
  Bird,
  Droplets,
  Layers,
  X,
  Send,
  Eye,
  Check,
  Share2,
  Bold,
  Italic,
  Link,
  ExternalLink,
  Code,
  Edit3,
  Network,
  Cpu,
  Compass
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';
import { FieldEvidenceItem } from './BioregionalSnap';

export interface RegenerationInsightStickyNote {
  id: string;
  evidenceId: string;
  author: string;
  councilOrRole: string;
  content: string;
  color: 'amber' | 'emerald' | 'cyan' | 'gold' | 'rose';
  timestamp: string;
  bioregionalImplication: string;
}

const INITIAL_STICKY_NOTES: RegenerationInsightStickyNote[] = [
  {
    id: 'note-001',
    evidenceId: 'ev-fl-01',
    author: 'Dr. Kiptoo Rotich',
    councilOrRole: 'Lead Agroecologist, Aberdare Guardians',
    content: 'Multi-strata **Podocarpus climax canopy** has reached 92% volume on the ridge transect. Hydraulic lift generates mist pockets. Correlated with [[Module: Knowledge Graph]] and [[Module: Restoration Heatmap]] for soil carbon aggregate lock.',
    color: 'emerald',
    timestamp: 'Aug 26, 2026, 10:30 AM',
    bioregionalImplication: 'Elevated micro-humidity accelerates understory fern and moss carpet establishment.'
  },
  {
    id: 'note-002',
    evidenceId: 'ev-hy-01',
    author: 'Amina Wanjiku',
    councilOrRole: 'Mathare Riparian Coalition Chair',
    content: 'Vetiver bio-swale root systems have anchored 1.4km of riverbank. *Silt runoff is down -72%*, allowing indigenous macro-invertebrates to return. Cross-referenced in [[Module: Hydrological Telemetry]].',
    color: 'cyan',
    timestamp: 'Aug 27, 2026, 09:15 AM',
    bioregionalImplication: 'Urban bio-filtration creates viable buffer wetlands buffering downstream Nairobi River.'
  },
  {
    id: 'note-003',
    evidenceId: 'ev-fa-01',
    author: 'Ranger Ole Nchalo',
    councilOrRole: 'Kenya Wildlife Bio-Acoustic Post',
    content: 'Endemic **Mountain Bongo breeding pair** confirmed grazing along bamboo transition zone. Motion trap #07 verified nocturnal feeding corridors remain unbroken. Logged in [[Module: Epistemic Provenance]].',
    color: 'amber',
    timestamp: 'Aug 27, 2026, 05:40 AM',
    bioregionalImplication: 'Faunal flyways confirm core cloud forest sanctuary continuity.'
  },
  {
    id: 'note-004',
    evidenceId: 'ev-so-01',
    author: 'Prof. Njeri Mwangi',
    councilOrRole: 'Soil Biophysics Lab',
    content: 'Deep soil cores reveal **glomalin levels reaching 18.2 mg/g**. Living soil humus density is transforming compacted terrace steps into resilient water sponges. Coupled with [[Module: Digital Twin]].',
    color: 'gold',
    timestamp: 'Aug 26, 2026, 12:45 PM',
    bioregionalImplication: 'Subterranean carbon sink stabilizes 1,420 tCO2e/ha/yr non-volatile biomass.'
  },
  {
    id: 'note-005',
    evidenceId: 'ev-001',
    author: 'Citizen Steward Kiprono',
    councilOrRole: 'Mathare Youth Restoration Mesh',
    content: 'Inoculated *vetiver grass plugs* planted 3 weeks ago rooted 45cm deep into bank sediment. Zero erosion observed. See [[Module: Mission Briefing]].',
    color: 'emerald',
    timestamp: 'Today, 09:00 AM',
    bioregionalImplication: 'Rapid stabilization prevents flash sediment pulse into municipal water intakes.'
  }
];

export interface TimelineEvidenceEntry {
  id: string;
  title: string;
  category: 'Flora' | 'Fauna' | 'Hydrology' | 'Soil' | 'Citizen Snap';
  locationName: string;
  metricObserved: string;
  timestamp: string;
  isoDate: string;
  hash: string;
  verifiedBy: string;
  photoUrl: string;
  notes?: string;
  isUserCaptured?: boolean;
}

const ATLAS_MODULE_LINKS = [
  { label: 'Ecological Knowledge Graph', id: 'knowledge_graph', icon: 'Network' },
  { label: 'Bioregional Digital Twin', id: 'bioregional_twin', icon: 'Layers' },
  { label: 'Restoration Heatmap', id: 'restoration_heatmap', icon: 'Flame' },
  { label: 'Epistemic Provenance Ledger', id: 'epistemic_provenance', icon: 'ShieldCheck' },
  { label: 'Hydrological Telemetry', id: 'sensor_telemetry', icon: 'Droplets' },
  { label: 'Indigenous Wisdom Feed', id: 'indigenous_wisdom', icon: 'Compass' },
  { label: 'Mission Briefing', id: 'mission_briefing', icon: 'Sparkles' }
];

/**
 * Rich-Text Formatter that parses bold (**text**), italic (*text*), and embedded module links ([[Module: Target]])
 */
export const FormattedInsightContent: React.FC<{
  content: string;
  onNavigateToModule?: (moduleId: string) => void;
}> = ({ content, onNavigateToModule }) => {
  // Parse text into tokens: bold, italic, module links, plain text
  const renderTokens = () => {
    // Regex matches [[Module: xyz]] or **bold** or *italic*
    const regex = /(\[\[Module:\s*([^\]]+)\]\]|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      // Plain text before match
      if (match.index > lastIndex) {
        elements.push(content.substring(lastIndex, match.index));
      }

      if (match[2]) {
        // Module link [[Module: XYZ]]
        const moduleName = match[2].trim();
        const matchedModule = ATLAS_MODULE_LINKS.find(
          m => m.label.toLowerCase() === moduleName.toLowerCase() || m.id.toLowerCase() === moduleName.toLowerCase()
        );
        const targetId = matchedModule ? matchedModule.id : 'bioregional_twin';

        elements.push(
          <button
            key={`mod-${match.index}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onNavigateToModule) {
                onNavigateToModule(targetId);
                audioFeedback.playSubtleClick();
              }
            }}
            className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-black/60 hover:bg-[#C5A059] border border-[#C5A059]/70 text-[#C5A059] hover:text-black font-mono text-[10px] font-bold rounded-xs transition-all cursor-pointer shadow-xs"
            title={`Open Atlas Intelligence Module: ${moduleName}`}
          >
            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
            <span>{moduleName}</span>
          </button>
        );
      } else if (match[3]) {
        // Bold **xyz**
        elements.push(
          <strong key={`b-${match.index}`} className="font-bold text-[#F5F5F0]">
            {match[3]}
          </strong>
        );
      } else if (match[4]) {
        // Italic *xyz*
        elements.push(
          <em key={`i-${match.index}`} className="italic text-emerald-200 font-serif">
            {match[4]}
          </em>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      elements.push(content.substring(lastIndex));
    }

    return elements;
  };

  return <span className="inline leading-relaxed">{renderTokens()}</span>;
};

const BASELINE_TIMELINE_EVIDENCE: TimelineEvidenceEntry[] = [
  {
    id: 'ev-fl-01',
    title: 'Podocarpus & Hagenia Climax Canopy Sector #14',
    category: 'Flora',
    locationName: 'Aberdare Cloud Forest Ridge (-0.4450° S, 36.7120° E)',
    metricObserved: 'NDVI +0.76 • 92% Crown Canopy Volume',
    timestamp: 'Aug 26, 2026, 09:15 AM',
    isoDate: '2026-08-26T09:15:00Z',
    hash: '0x8f2a1b9c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    verifiedBy: 'Aberdare Rangers & Drone Lidar',
    photoUrl: '/src/assets/images/canopy_pulse_health_1787771045697.jpg',
    notes: 'Multi-strata canopy volume verified by drone lidar transect.'
  },
  {
    id: 'ev-fl-02',
    title: 'Indigenous Mountain Bamboo Migration Belt #03',
    category: 'Flora',
    locationName: 'Aberdare Highland Alpine Gap (-0.5820° S, 36.6540° E)',
    metricObserved: 'Bamboo Culm Growth: 14cm/day • Bio-corridor Intact',
    timestamp: 'Aug 25, 2026, 02:40 PM',
    isoDate: '2026-08-25T14:40:00Z',
    hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    verifiedBy: 'Bamboo Agroecology Stewardship Guild',
    photoUrl: '/src/assets/images/canopy_pulse_health_1787771045697.jpg',
    notes: 'Dense high-altitude bamboo culms providing continuous foraging shelter.'
  },
  {
    id: 'ev-fa-01',
    title: 'Mountain Bongo Nocturnal Camera Trap #07',
    category: 'Fauna',
    locationName: 'Aberdare Escarpment Sanctuary (-0.4900° S, 36.7400° E)',
    metricObserved: '12 Unique Sightings • Breeding Pair + Calf Verified',
    timestamp: 'Aug 27, 2026, 04:12 AM',
    isoDate: '2026-08-27T04:12:00Z',
    hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    verifiedBy: 'Kenya Wildlife Bio-Acoustic Mesh Post',
    photoUrl: '/src/assets/images/climate_harmony_health_1787771096045.jpg',
    notes: 'Acoustic motion-triggered infrared camera captured endemic mountain bongo.'
  },
  {
    id: 'ev-hy-01',
    title: 'Mathare Riparian Bio-Swale Silt Infiltration Gauge',
    category: 'Hydrology',
    locationName: 'Mathare River Urban Catchment Sector 4 (-1.2584° S, 36.8523° E)',
    metricObserved: 'Turbidity -72% Silt Washout • Dissolved O2 6.8 mg/L',
    timestamp: 'Aug 27, 2026, 08:00 AM',
    isoDate: '2026-08-27T08:00:00Z',
    hash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    verifiedBy: 'Nairobi Water Basin Coalition & City Council',
    photoUrl: '/src/assets/images/hydrology_flow_health_1787771061356.jpg',
    notes: 'Bio-engineered vetiver swales filtering urban stormwater effluent.'
  },
  {
    id: 'ev-so-01',
    title: 'Mycorrhizal Soil Infiltration & Glomalin Core #18',
    category: 'Soil',
    locationName: 'East African Agroforestry Pilot Plot 12 (-1.1892° S, 36.7821° E)',
    metricObserved: 'Soil Organic Matter 4.8% • Glomalin 18.2 mg/g',
    timestamp: 'Aug 26, 2026, 11:20 AM',
    isoDate: '2026-08-26T11:20:00Z',
    hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    verifiedBy: 'Agroforestry Biophysical Soil Lab',
    photoUrl: '/src/assets/images/soil_microbiome_health_1787771074165.jpg',
    notes: 'Deep in-situ soil coring assay confirming rapid mycorrhizal root stabilization.'
  }
];

interface BioregionalEvidenceTimelineProps {
  currentBioregionId?: string;
  currentBioregionName?: string;
  onNavigateToModule?: (moduleId: string) => void;
}

export const BioregionalEvidenceTimeline: React.FC<BioregionalEvidenceTimelineProps> = ({
  currentBioregionId = 'aberdare_riparian_watershed',
  currentBioregionName = 'Aberdare Range & Riparian Catchment',
  onNavigateToModule
}) => {
  // Load sticky notes
  const [stickyNotes, setStickyNotes] = useState<RegenerationInsightStickyNote[]>(() => {
    try {
      const saved = localStorage.getItem('atlas_evidence_sticky_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return INITIAL_STICKY_NOTES;
  });

  // Category & sorting states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [activePhotoModal, setActivePhotoModal] = useState<{ url: string; title: string; metric: string } | null>(null);

  // Add sticky note modal state & rich text editor
  const [addingNoteForEvidenceId, setAddingNoteForEvidenceId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('');
  const [noteCouncil, setNoteCouncil] = useState('');
  const [noteColor, setNoteColor] = useState<'amber' | 'emerald' | 'cyan' | 'gold' | 'rose'>('emerald');
  const [noteImplication, setNoteImplication] = useState('');
  const [isEditorPreview, setIsEditorPreview] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Formatting helpers
  const applyTextFormatting = (type: 'bold' | 'italic') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = noteContent;
    const selected = text.substring(start, end) || (type === 'bold' ? 'bold insight' : 'italic deduction');
    const marker = type === 'bold' ? '**' : '*';
    const updated = text.substring(0, start) + `${marker}${selected}${marker}` + text.substring(end);
    setNoteContent(updated);
    audioFeedback.playMicroTick();

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + marker.length, end + marker.length);
      }
    }, 0);
  };

  const insertModuleLink = (moduleLabel: string) => {
    if (!textareaRef.current) {
      setNoteContent(prev => prev + ` [[Module: ${moduleLabel}]]`);
      return;
    }
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const linkStr = ` [[Module: ${moduleLabel}]] `;
    const updated = noteContent.substring(0, start) + linkStr + noteContent.substring(end);
    setNoteContent(updated);
    audioFeedback.playMicroTick();
  };

  const insertPresetInsight = (preset: string) => {
    setNoteContent(prev => (prev ? `${prev} ${preset}` : preset));
    audioFeedback.playMicroTick();
  };

  // Persist sticky notes
  const saveStickyNotes = (notes: RegenerationInsightStickyNote[]) => {
    setStickyNotes(notes);
    try {
      localStorage.setItem('atlas_evidence_sticky_notes', JSON.stringify(notes));
    } catch {
      // Ignore
    }
  };

  // Combine baseline evidence with any user snaps stored in localStorage
  const allTimelineItems = useMemo(() => {
    const items: TimelineEvidenceEntry[] = [...BASELINE_TIMELINE_EVIDENCE];

    try {
      const savedSnaps = localStorage.getItem('atlas_sanctum_field_evidence');
      if (savedSnaps) {
        const parsed: FieldEvidenceItem[] = JSON.parse(savedSnaps);
        parsed.forEach(snap => {
          if (!items.some(i => i.id === snap.id)) {
            items.push({
              id: snap.id,
              title: snap.title,
              category: 'Citizen Snap',
              locationName: snap.location,
              metricObserved: snap.metricObserved,
              timestamp: snap.timestamp,
              isoDate: new Date().toISOString(),
              hash: snap.hash,
              verifiedBy: snap.verifiedBy,
              photoUrl: snap.imageUrl,
              isUserCaptured: true
            });
          }
        });
      }
    } catch {
      // Ignore
    }

    // Filter by category
    const filtered = selectedCategory === 'all'
      ? items
      : items.filter(i => i.category.toLowerCase() === selectedCategory.toLowerCase() || (selectedCategory === 'Citizen Snap' && i.isUserCaptured));

    // Sort
    return filtered.sort((a, b) => {
      const timeA = new Date(a.isoDate || a.timestamp).getTime() || 0;
      const timeB = new Date(b.isoDate || b.timestamp).getTime() || 0;
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [selectedCategory, sortOrder]);

  // Handle adding new sticky note
  const handleAddStickyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingNoteForEvidenceId || !noteContent.trim()) return;

    audioFeedback.playSyncComplete();
    const newNote: RegenerationInsightStickyNote = {
      id: `note-${Date.now()}`,
      evidenceId: addingNoteForEvidenceId,
      author: noteAuthor.trim() || 'Bioregional Field Steward',
      councilOrRole: noteCouncil.trim() || 'Ecological Field Research Guild',
      content: noteContent.trim(),
      color: noteColor,
      timestamp: 'Just now',
      bioregionalImplication: noteImplication.trim() || 'Direct ground truth calibration for living system twin.'
    };

    const updated = [newNote, ...stickyNotes];
    saveStickyNotes(updated);

    // Reset
    setAddingNoteForEvidenceId(null);
    setNoteContent('');
    setNoteAuthor('');
    setNoteCouncil('');
    setNoteImplication('');
  };

  // Delete sticky note
  const handleDeleteNote = (noteId: string) => {
    audioFeedback.playMicroTick();
    const updated = stickyNotes.filter(n => n.id !== noteId);
    saveStickyNotes(updated);
  };

  // Get color styles for sticky note
  const getStickyColorClasses = (color: RegenerationInsightStickyNote['color']) => {
    switch (color) {
      case 'emerald':
        return 'bg-[#0E2419] border-emerald-500/60 text-emerald-200 shadow-[0_4px_20px_rgba(16,185,129,0.15)]';
      case 'amber':
        return 'bg-[#291807] border-amber-500/60 text-amber-200 shadow-[0_4px_20px_rgba(245,158,11,0.15)]';
      case 'cyan':
        return 'bg-[#082229] border-cyan-500/60 text-cyan-200 shadow-[0_4px_20px_rgba(6,182,212,0.15)]';
      case 'gold':
        return 'bg-[#241F0D] border-[#C5A059]/70 text-[#F5F5F0] shadow-[0_4px_20px_rgba(197,160,89,0.18)]';
      case 'rose':
        return 'bg-[#260C14] border-rose-500/60 text-rose-200 shadow-[0_4px_20px_rgba(244,63,94,0.15)]';
      default:
        return 'bg-[#181818] border-[#F5F5F0]/20 text-[#F5F5F0]';
    }
  };

  return (
    <div
      id="bioregional-evidence-timeline"
      className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-6 shadow-xl text-[#F5F5F0]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              CHRONOLOGICAL EVIDENCE LEDGER & REGENERATION INSIGHT STICKY NOTES
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-300 rounded-full border border-emerald-500/40 font-bold">
              {allTimelineItems.length} Field Evidence Nodes
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Bioregional Evidence Timeline & Sticky Insights
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans leading-relaxed">
            Vertical chronological stream of captured photographic field observations paired with live participatory sticky notes, indigenous annotations, and ecological research deductions.
          </p>
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap font-mono text-xs">
          <button
            onClick={() => {
              setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
              audioFeedback.playMicroTick();
            }}
            className="px-3 py-1.5 bg-[#141414] hover:bg-[#202020] border border-[#F5F5F0]/15 rounded-xs text-[#F5F5F0] transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Toggle Sort Direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        <span className="text-[10px] uppercase text-[#F5F5F0]/40 flex items-center gap-1">
          <Filter className="w-3 h-3 text-[#C5A059]" /> Category:
        </span>
        {[
          { id: 'all', label: 'All Observations', icon: <Layers className="w-3 h-3" /> },
          { id: 'Flora', label: 'Flora & Canopy', icon: <TreePine className="w-3 h-3 text-emerald-400" /> },
          { id: 'Fauna', label: 'Fauna & Wildlife', icon: <Bird className="w-3 h-3 text-amber-400" /> },
          { id: 'Hydrology', label: 'Hydrology & Rivers', icon: <Droplets className="w-3 h-3 text-cyan-400" /> },
          { id: 'Soil', label: 'Soil & Carbon', icon: <Layers className="w-3 h-3 text-orange-400" /> },
          { id: 'Citizen Snap', label: 'Citizen Snaps', icon: <Camera className="w-3 h-3 text-purple-400" /> }
        ].map(cat => {
          const isActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                audioFeedback.playMicroTick();
              }}
              className={`px-2.5 py-1 rounded-xs border transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap text-xs ${
                isActive
                  ? 'bg-[#C5A059] text-black font-bold border-[#C5A059] shadow-sm'
                  : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Vertical Timeline Container */}
      <div className="relative pl-6 sm:pl-8 space-y-10 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#C5A059] before:via-emerald-500/60 before:to-[#C5A059]/30">
        {allTimelineItems.map((item, idx) => {
          const matchingNotes = stickyNotes.filter(n => n.evidenceId === item.id);

          return (
            <div key={item.id} className="relative group space-y-4">
              {/* Timeline Marker Node on the vertical line */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#0D0D0D] border-2 border-[#C5A059] group-hover:scale-125 transition-transform flex items-center justify-center shadow-[0_0_8px_rgba(197,160,89,0.8)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* Timestamp & Category Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-[#C5A059] font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.timestamp}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    item.category === 'Flora' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                    item.category === 'Fauna' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                    item.category === 'Hydrology' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' :
                    item.category === 'Soil' ? 'bg-orange-950 text-orange-300 border border-orange-500/30' :
                    'bg-purple-950 text-purple-300 border border-purple-500/30'
                  }`}>
                    {item.category}
                  </span>
                </div>

                <div className="text-[10px] text-[#F5F5F0]/40 flex items-center gap-2">
                  <span>Verified By: {item.verifiedBy}</span>
                  <span className="text-[#C5A059] hidden sm:inline" title={item.hash}>
                    Hash: {item.hash.slice(0, 10)}...
                  </span>
                </div>
              </div>

              {/* Split Layout: Evidence Image & Telemetry Card (Left) + Associated Sticky Notes Column (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* 1. Evidence Image & Observation Card (7 cols) */}
                <div className="lg:col-span-7 p-4 bg-[#141414] border border-[#F5F5F0]/10 hover:border-[#C5A059]/40 rounded-sm space-y-3 transition-all shadow-md">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-[#F5F5F0]">
                      {item.title}
                    </h3>

                    <button
                      onClick={() => {
                        setAddingNoteForEvidenceId(item.id);
                        audioFeedback.playMicroTick();
                      }}
                      className="px-2 py-1 bg-[#1C2018] hover:bg-[#252E20] border border-emerald-500/40 text-emerald-300 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Attach Regeneration Sticky Note"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Attach Sticky Note</span>
                    </button>
                  </div>

                  {/* Photo Container */}
                  <div className="relative w-full aspect-video bg-black rounded-sm overflow-hidden border border-[#F5F5F0]/10 group/img">
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded text-[9px] font-mono text-emerald-300 border border-emerald-500/40">
                      Photographic Proof Verified
                    </div>

                    <button
                      onClick={() => {
                        setActivePhotoModal({ url: item.photoUrl, title: item.title, metric: item.metricObserved });
                        audioFeedback.playMicroTick();
                      }}
                      className="absolute bottom-2 right-2 p-1.5 bg-black/80 hover:bg-[#C5A059] text-white hover:text-black rounded transition-colors cursor-pointer"
                      title="View High-Resolution Image"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Location & Metrics */}
                  <div className="space-y-1.5 font-mono text-xs pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#C5A059]">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.locationName}</span>
                    </div>

                    <div className="p-2.5 bg-black/50 border border-[#F5F5F0]/5 rounded-xs flex items-center justify-between text-[11px]">
                      <span className="text-[#F5F5F0]/60 uppercase text-[9px]">Measured Metric:</span>
                      <span className="text-emerald-300 font-bold">{item.metricObserved}</span>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed pt-1">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Regeneration Insight Sticky Notes Column (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/40 uppercase pb-1 border-b border-[#F5F5F0]/10">
                    <span className="flex items-center gap-1 text-[#C5A059] font-bold">
                      <StickyNote className="w-3 h-3 text-[#C5A059]" />
                      Regeneration Insights ({matchingNotes.length})
                    </span>
                    <span>Field Annotations</span>
                  </div>

                  {/* Sticky Notes Stack */}
                  <div className="space-y-3">
                    {matchingNotes.map(note => (
                      <div
                        key={note.id}
                        className={`p-4 rounded-sm border relative space-y-2.5 text-left transition-all ${getStickyColorClasses(note.color)}`}
                      >
                        {/* Pin Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px] font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#C5A059] shadow-sm" />
                            <span className="font-bold">{note.author}</span>
                            <span className="opacity-60 text-[9px]">({note.councilOrRole})</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="opacity-60 text-[9px]">{note.timestamp}</span>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="opacity-40 hover:opacity-100 hover:text-rose-400 p-0.5 cursor-pointer"
                              title="Delete Sticky Note"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Note Body */}
                        <div className="text-xs font-serif leading-relaxed text-[#F5F5F0]">
                          <FormattedInsightContent content={note.content} onNavigateToModule={onNavigateToModule} />
                        </div>

                        {/* Implication Footer */}
                        {note.bioregionalImplication && (
                          <div className="pt-1.5 border-t border-white/10 text-[10px] font-mono opacity-80 flex items-start gap-1">
                            <Sparkles className="w-3 h-3 text-[#C5A059] shrink-0 mt-0.5" />
                            <span>
                              <strong>Bioregional Impact:</strong> {note.bioregionalImplication}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}

                    {matchingNotes.length === 0 && (
                      <div className="p-5 text-center bg-[#111] border border-dashed border-[#F5F5F0]/15 rounded-sm space-y-2">
                        <StickyNote className="w-5 h-5 mx-auto text-[#F5F5F0]/20" />
                        <p className="text-xs font-mono text-[#F5F5F0]/40">
                          No sticky notes attached to this observation yet.
                        </p>
                        <button
                          onClick={() => {
                            setAddingNoteForEvidenceId(item.id);
                            audioFeedback.playMicroTick();
                          }}
                          className="px-2.5 py-1 text-[10px] font-mono text-[#C5A059] hover:underline cursor-pointer"
                        >
                          + Add First Insight Note
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Sticky Note Modal Dialog with Rich-Text Editor */}
      {addingNoteForEvidenceId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#101210] border border-[#C5A059] rounded-sm max-w-xl w-full p-6 shadow-2xl space-y-4 text-[#F5F5F0] animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div className="flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-base font-serif font-bold text-[#F5F5F0]">
                  Attach Rich Regeneration Insight Sticky Note
                </h3>
              </div>
              <button
                onClick={() => setAddingNoteForEvidenceId(null)}
                className="text-[#F5F5F0]/50 hover:text-[#F5F5F0] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStickyNote} className="space-y-4 font-mono text-xs">
              {/* Rich-Text Formatting Toolbar & Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase text-[#C5A059] font-bold">
                    Insight Annotation Content (Rich-Text Supported):
                  </label>
                  <div className="flex items-center gap-1 bg-[#1A1A1A] p-0.5 rounded-xs border border-[#F5F5F0]/10 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setIsEditorPreview(false)}
                      className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                        !isEditorPreview ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditorPreview(true)}
                      className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
                        isEditorPreview ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {/* Formatting Tools Ribbon */}
                {!isEditorPreview && (
                  <div className="p-1.5 bg-[#161616] border border-[#F5F5F0]/15 rounded-t-xs flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => applyTextFormatting('bold')}
                      className="p-1 bg-[#222] hover:bg-[#333] border border-[#F5F5F0]/10 text-[#F5F5F0] rounded cursor-pointer flex items-center gap-1 text-[10px]"
                      title="Format Bold (**text**)"
                    >
                      <Bold className="w-3 h-3 text-[#C5A059]" />
                      <span>Bold</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTextFormatting('italic')}
                      className="p-1 bg-[#222] hover:bg-[#333] border border-[#F5F5F0]/10 text-[#F5F5F0] rounded cursor-pointer flex items-center gap-1 text-[10px]"
                      title="Format Italic (*text*)"
                    >
                      <Italic className="w-3 h-3 text-emerald-300" />
                      <span>Italic</span>
                    </button>

                    <div className="h-4 w-px bg-[#F5F5F0]/20 mx-1" />

                    {/* Embed Module Link Menu */}
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] uppercase text-[#F5F5F0]/40">Link Module:</span>
                      <select
                        onChange={e => {
                          if (e.target.value) {
                            insertModuleLink(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="bg-[#222] border border-[#F5F5F0]/15 text-[#C5A059] text-[10px] rounded px-1.5 py-0.5 outline-none cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>+ Embed Module...</option>
                        {ATLAS_MODULE_LINKS.map(mod => (
                          <option key={mod.id} value={mod.label}>
                            {mod.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Editor textarea or live preview */}
                {!isEditorPreview ? (
                  <textarea
                    ref={textareaRef}
                    required
                    rows={4}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Record observations, bold deductions (**key findings**), italic nuances (*exudates*), and embed [[Module: Knowledge Graph]] links..."
                    className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-b-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059] font-serif text-sm leading-relaxed"
                  />
                ) : (
                  <div className="w-full min-h-[100px] p-3 bg-[#141414] border border-[#C5A059]/40 rounded-xs font-serif text-sm leading-relaxed text-[#F5F5F0]">
                    {noteContent ? (
                      <FormattedInsightContent content={noteContent} onNavigateToModule={onNavigateToModule} />
                    ) : (
                      <span className="text-[#F5F5F0]/30 italic font-sans text-xs">
                        Nothing to preview yet. Switch back to Write mode to compose your insight.
                      </span>
                    )}
                  </div>
                )}

                {/* Quick Presets Ribbon */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                  <span className="text-[#F5F5F0]/40 text-[9px] uppercase">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => insertPresetInsight('**Glomalin binding:** Hyphal exudates lock soil organic carbon into aggregates. Linked to [[Module: Knowledge Graph]].')}
                    className="px-2 py-0.5 bg-[#1B221B] hover:bg-[#253325] border border-emerald-500/30 text-emerald-300 rounded cursor-pointer"
                  >
                    + Glomalin Carbon
                  </button>
                  <button
                    type="button"
                    onClick={() => insertPresetInsight('*Subsurface Recharge:* In-situ piezometers report +1.82 bar head. Sourced from [[Module: Hydrological Telemetry]].')}
                    className="px-2 py-0.5 bg-[#14232B] hover:bg-[#1D333F] border border-cyan-500/30 text-cyan-300 rounded cursor-pointer"
                  >
                    + Aquifer Head
                  </button>
                  <button
                    type="button"
                    onClick={() => insertPresetInsight('**Olosho Moratorium:** 90-day customary rest period enforced by Council. See [[Module: Indigenous Wisdom Feed]].')}
                    className="px-2 py-0.5 bg-[#2B2314] hover:bg-[#3F331D] border border-amber-500/30 text-amber-300 rounded cursor-pointer"
                  >
                    + Elder Grazing Moratorium
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                    Your Name / Role:
                  </label>
                  <input
                    type="text"
                    value={noteAuthor}
                    onChange={(e) => setNoteAuthor(e.target.value)}
                    placeholder="e.g. Dr. Wanjiku / Field Steward"
                    className="w-full bg-[#161616] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                    Stewardship Guild:
                  </label>
                  <input
                    type="text"
                    value={noteCouncil}
                    onChange={(e) => setNoteCouncil(e.target.value)}
                    placeholder="e.g. Aberdare Forest Guardians"
                    className="w-full bg-[#161616] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                  Bioregional Implication / Action:
                </label>
                <input
                  type="text"
                  value={noteImplication}
                  onChange={(e) => setNoteImplication(e.target.value)}
                  placeholder="e.g. Accelerates mycorrhizal living sponge capacity by 20%"
                  className="w-full bg-[#161616] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                  Sticky Note Color Theme:
                </label>
                <div className="flex items-center gap-2">
                  {(['emerald', 'amber', 'cyan', 'gold', 'rose'] as const).map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNoteColor(color)}
                      className={`px-3 py-1 rounded text-[10px] font-bold capitalize border cursor-pointer ${
                        noteColor === color
                          ? 'border-white ring-2 ring-white/50 text-white'
                          : 'opacity-60 hover:opacity-100'
                      } ${
                        color === 'emerald' ? 'bg-emerald-800' :
                        color === 'amber' ? 'bg-amber-800' :
                        color === 'cyan' ? 'bg-cyan-800' :
                        color === 'gold' ? 'bg-yellow-700' : 'bg-rose-800'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F5F5F0]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddingNoteForEvidenceId(null)}
                  className="px-3 py-1.5 text-xs text-[#F5F5F0]/60 hover:text-[#F5F5F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold font-mono text-xs uppercase tracking-wider rounded-xs cursor-pointer shadow"
                >
                  Pin Formatted Sticky Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setActivePhotoModal(null)}>
          <div className="bg-[#0D0D0D] border border-[#C5A059] rounded-sm max-w-3xl w-full p-4 space-y-3" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2 font-mono text-xs">
              <span className="text-[#C5A059] font-bold">{activePhotoModal.title}</span>
              <button onClick={() => setActivePhotoModal(null)} className="text-[#F5F5F0]/60 hover:text-[#F5F5F0]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black rounded overflow-hidden">
              <img src={activePhotoModal.url} alt={activePhotoModal.title} className="w-full h-full object-contain" />
            </div>
            <div className="text-xs text-emerald-300 font-mono">
              Observed: {activePhotoModal.metric}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
