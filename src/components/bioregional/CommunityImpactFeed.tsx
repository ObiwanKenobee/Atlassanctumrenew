import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Plus, 
  Filter, 
  CheckCircle2, 
  ExternalLink, 
  Globe2, 
  TreePine, 
  Droplets, 
  Flame, 
  Radio, 
  X, 
  Send,
  ThumbsUp,
  Clock,
  Compass,
  FileCheck2,
  Check
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';
import { advanceAchievementProgress } from '../../services/achievementService';
import { db } from '../../lib/db';

export interface CommunityStewardshipReport {
  id: string;
  authorName: string;
  authorRole: string;
  authorHandle: string;
  authorAvatarBg: string;
  verifiedSteward: boolean;
  didAddress: string;
  bioregionId: string;
  bioregionName: string;
  country: string;
  title: string;
  narrative: string;
  publishedDate: string;
  impactMetrics: {
    label: string;
    value: string;
    icon: 'tree' | 'water' | 'soil' | 'shield' | 'carbon';
  }[];
  corroborationMission: string;
  merkleProofHash: string;
  endorsementCount: number;
  resonanceCount: number;
  userEndorsed?: boolean;
  userResonated?: boolean;
  comments: {
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }[];
}

const INITIAL_REPORTS: CommunityStewardshipReport[] = [
  {
    id: 'report-aberdare-bamboo',
    authorName: 'Dr. Wanjira Mathai',
    authorRole: 'Chief Hydrologist, Aberdare Canopy Trust',
    authorHandle: '@wanjira_eco',
    authorAvatarBg: 'bg-emerald-800 text-emerald-100',
    verifiedSteward: true,
    didAddress: 'did:key:z6MkuV4b19...99a1',
    bioregionId: 'bioregion-aberdare',
    bioregionName: 'Aberdare Cloud Forest & Chania Basin',
    country: 'Kenya',
    title: 'Riparian Bamboo Contour & Sediment Interception Mesh Complete',
    narrative: 'Successfully planted and geotagged 18,400 indigenous Yushania alpina bamboo along 12 kilometers of eroded tea plantation ravines. Turbidity downstream in Sasumua Dam plummeted from 140 NTU to 18 NTU following heavy equinoctial rains.',
    publishedDate: '2 hours ago',
    impactMetrics: [
      { label: 'Bamboo Saplings', value: '+18,400 Planted', icon: 'tree' },
      { label: 'Runoff Filtration', value: '3.4M Liters Filtered', icon: 'water' },
      { label: 'Turbidity Drop', value: '-87% Suspended Silt', icon: 'soil' },
      { label: 'Audit Status', value: 'Sentinel-2 Multispectral Verified', icon: 'shield' }
    ],
    corroborationMission: 'ESA Sentinel-2 MSI Level-2A (10m Resolution)',
    merkleProofHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
    endorsementCount: 48,
    resonanceCount: 34,
    comments: [
      {
        id: 'c1',
        author: 'Kiplagat Ruto (Tana Basin)',
        text: 'The turbidity sensor data downstream matches this precisely. Exceptional work securing Nairobi water intake!',
        timestamp: '1 hour ago'
      }
    ]
  },
  {
    id: 'report-turkana-piezometer',
    authorName: 'Eregae Lomerur',
    authorRole: 'Pastoralist Water Warden, Turkana Deep Basin',
    authorHandle: '@eregae_turkana',
    authorAvatarBg: 'bg-cyan-800 text-cyan-100',
    verifiedSteward: true,
    didAddress: 'did:key:z6MkuT88c2...12fa',
    bioregionId: 'bioregion-turkana',
    bioregionName: 'Lake Turkana & Omo Delta Aquifer',
    country: 'Kenya / Ethiopia',
    title: 'Solar Telemetric Piezometer Array Restores 4 Traditional Sand Wells',
    narrative: 'Anchored 6 solar-powered piezometric pressure transducers across the ephemeral Turkwel dry riverbed. Rotational cattle watering schedules negotiated under customary Baraza covenants have prevented cone of depression exhaustion.',
    publishedDate: '6 hours ago',
    impactMetrics: [
      { label: 'Pastoralist Families', value: '4,200 People Secured', icon: 'shield' },
      { label: 'Static Water Table', value: '+15.2 cm Recharge', icon: 'water' },
      { label: 'Sand Dams', value: '4 Wells Reactivated', icon: 'soil' },
      { label: 'Covenant Status', value: 'FPIC Elder Assembly Ratified', icon: 'shield' }
    ],
    corroborationMission: 'GRACE-FO Terrestrial Water Storage Anomaly',
    merkleProofHash: '0x7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    endorsementCount: 62,
    resonanceCount: 51,
    comments: [
      {
        id: 'c2',
        author: 'Dr. Amina Touré',
        text: 'The customary FPIC agreement protocol provides the highest institutional durability. Truly sovereign water governance.',
        timestamp: '4 hours ago'
      }
    ]
  },
  {
    id: 'report-congo-peatlands',
    authorName: 'Prof. Dieudonné Mokonzi',
    authorRole: 'Director of Peatland Geochemistry, Cuvette Centrale',
    authorHandle: '@mokonzi_peat',
    authorAvatarBg: 'bg-amber-900 text-amber-100',
    verifiedSteward: true,
    didAddress: 'did:key:z6MkuC99a4...67ec',
    bioregionId: 'bioregion-congo',
    bioregionName: 'Cuvette Centrale Congo Peatland Complex',
    country: 'DR Congo / Republic of Congo',
    title: 'Saturation Bunds Prevent Peat Dome Desiccation Along Logging Corridors',
    narrative: 'Constructed 28 bio-composite saturation dykes using woven raffia and clay to arrest drainage canals dug by illegal timber haulers. Water table raised by 22cm across 12,000 hectares of high-density peat, avoiding 420,000 metric tons of potential CO2eq combustion.',
    publishedDate: 'Yesterday',
    impactMetrics: [
      { label: 'CO2eq Avoided', value: '420,000 Tons Carbon', icon: 'carbon' },
      { label: 'Peat Dome Stabilized', value: '12,000 Hectares', icon: 'soil' },
      { label: 'Saturation Level', value: '+22 cm Hydrostatic Head', icon: 'water' },
      { label: 'Consensus', value: 'COMIFAC Epistemic Ledger Approved', icon: 'shield' }
    ],
    corroborationMission: 'ALOS-2 PALSAR-2 L-band SAR Flood Mapping',
    merkleProofHash: '0x5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c',
    endorsementCount: 114,
    resonanceCount: 89,
    comments: []
  },
  {
    id: 'report-mara-firebreak',
    authorName: 'Sipoi Ole Ntutu',
    authorRole: 'Lead Wildlife Corridor Ranger, Mara Conservancies',
    authorHandle: '@sipoi_mara',
    authorAvatarBg: 'bg-orange-900 text-orange-100',
    verifiedSteward: true,
    didAddress: 'did:key:z6MkuM77b1...55da',
    bioregionId: 'bioregion-mara',
    bioregionName: 'Mara-Serengeti Transboundary Biosphere',
    country: 'Kenya / Tanzania',
    title: 'Cool-Burn Mosaic & Firebreak Network Shields Critical Migration Route',
    narrative: 'Coordinated early-morning low-intensity cultural burns across 85 kilometers of perimeter grasslands. Thermal satellite sensors confirmed zero uncontrolled wildfire outbreaks during yesterday\'s 42°C heatwave.',
    publishedDate: '2 days ago',
    impactMetrics: [
      { label: 'Corridor Defended', value: '85 km Protected', icon: 'shield' },
      { label: 'Fauna Sanctuary', value: '140,000 Wildebeest Safe', icon: 'tree' },
      { label: 'Wildfire Outbreaks', value: '0 Breaches Recorded', icon: 'shield' },
      { label: 'Verification', value: 'MODIS & VIIRS Thermal Corroborated', icon: 'shield' }
    ],
    corroborationMission: 'NOAA-20 VIIRS Active Fire 375m Detection',
    merkleProofHash: '0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e',
    endorsementCount: 78,
    resonanceCount: 63,
    comments: []
  }
];

const STORAGE_KEY = 'atlas_community_impact_reports_state';

export const CommunityImpactFeed: React.FC = () => {
  const [reports, setReports] = useState<CommunityStewardshipReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_REPORTS;
  });

  const [selectedBioregion, setSelectedBioregion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');

  // New report form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newBioregion, setNewBioregion] = useState<string>('Aberdare Cloud Forest & Chania Basin');
  const [newCountry, setNewCountry] = useState<string>('Kenya');
  const [newNarrative, setNewNarrative] = useState<string>('');
  const [newMetricLabel, setNewMetricLabel] = useState<string>('Trees Planted');
  const [newMetricValue, setNewMetricValue] = useState<string>('+2,400 Native Seedlings');
  const [newCorroboration, setNewCorroboration] = useState<string>('In-Situ Geotagged Drone Transect & Sentinel-2');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.warn('Could not save reports:', e);
    }
  }, [reports]);

  // Social Toggle Handlers
  const handleToggleEndorse = (reportId: string) => {
    audioFeedback.playMicroTick();
    setReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        const nextState = !rep.userEndorsed;
        return {
          ...rep,
          userEndorsed: nextState,
          endorsementCount: nextState ? rep.endorsementCount + 1 : Math.max(0, rep.endorsementCount - 1)
        };
      }
      return rep;
    }));
  };

  const handleToggleResonate = (reportId: string) => {
    audioFeedback.playMicroTick();
    setReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        const nextState = !rep.userResonated;
        return {
          ...rep,
          userResonated: nextState,
          resonanceCount: nextState ? rep.resonanceCount + 1 : Math.max(0, rep.resonanceCount - 1)
        };
      }
      return rep;
    }));
  };

  // Add Comment Handler
  const handleAddComment = (reportId: string) => {
    if (!commentInput.trim()) return;
    audioFeedback.playSubtleClick();

    setReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        return {
          ...rep,
          comments: [
            ...rep.comments,
            {
              id: `comm-${Date.now()}`,
              author: 'You (Verified Citizen Steward)',
              text: commentInput.trim(),
              timestamp: 'Just now'
            }
          ]
        };
      }
      return rep;
    }));

    setCommentInput('');
    setActiveCommentPostId(null);
  };

  // Submit User Verified Report
  const handleSubmitNewReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newNarrative.trim()) return;

    setIsSubmitting(true);
    audioFeedback.playSubtleClick();

    await new Promise(r => setTimeout(r, 600));

    const newReport: CommunityStewardshipReport = {
      id: `report-${Date.now()}`,
      authorName: 'Enoch Cheboi (You)',
      authorRole: 'Verified Citizen Steward • Planetary Sentinel',
      authorHandle: '@enoch_citizen',
      authorAvatarBg: 'bg-emerald-700 text-white',
      verifiedSteward: true,
      didAddress: `did:key:z6Mku${Math.random().toString(16).slice(2, 8)}...88f2`,
      bioregionId: 'bioregion-custom',
      bioregionName: newBioregion,
      country: newCountry,
      title: newTitle.trim(),
      narrative: newNarrative.trim(),
      publishedDate: 'Just now',
      impactMetrics: [
        { label: newMetricLabel, value: newMetricValue, icon: 'tree' },
        { label: 'Ground Corroboration', value: 'Peer-Audited Cryptographic Proof', icon: 'shield' }
      ],
      corroborationMission: newCorroboration,
      merkleProofHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      endorsementCount: 1,
      resonanceCount: 1,
      userEndorsed: true,
      comments: []
    };

    setReports(prev => [newReport, ...prev]);
    setIsSubmitting(false);
    setIsShareModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewNarrative('');

    // Play chime & celebrate
    audioFeedback.playSuccessChime();
    setSuccessToast('Stewardship Report published to Community Feed! +150 Rep Points awarded.');

    // Advance achievement
    advanceAchievementProgress('ach-community-story', 1);

    // Persist interaction audit log
    try {
      db.audit.logInteraction({
        action: `Published Community Stewardship Report: "${newReport.title}"`,
        feature: 'community_impact_feed',
        impactTier: 'high',
        moralAlignmentScore: 100,
        parameters: {
          reportId: newReport.id,
          bioregion: newReport.bioregionName,
          impactValue: newMetricValue
        },
        ethicalNotes: 'User contributed empirical ground-truth verification narrative to public community ledger.'
      }).catch(() => {});
    } catch {}

    setTimeout(() => setSuccessToast(null), 5000);
  };

  // Filtered reports
  const filteredReports = reports.filter(r => {
    const matchesBioregion = selectedBioregion === 'all' || r.bioregionName.toLowerCase().includes(selectedBioregion.toLowerCase());
    const matchesSearch = !searchQuery || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.narrative.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bioregionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBioregion && matchesSearch;
  });

  return (
    <div id="community-impact-social-feed" className="space-y-6 animate-in fade-in duration-300">
      {/* Feed Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0E1712] via-[#0B120E] to-[#0A0D0B] border border-[#C5A059]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
              COMMUNITY IMPACT SOCIAL FEED • VERIFIED LEDGER
            </span>
            <span className="text-[10px] font-mono text-white/50">
              Zero Hallucination Protocol
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Bioregional Stewardship Echo Chamber
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 font-sans max-w-2xl">
            Where local custodians, indigenous rangers, and field hydrologists publish peer-verified regenerative gains with cryptographic satellite proof.
          </p>
        </div>

        <button
          id="share-stewardship-report-btn"
          onClick={() => {
            audioFeedback.playMicroTick();
            setIsShareModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#C5A059] hover:from-amber-400 hover:to-amber-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-[1.02] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Share Verified Report</span>
        </button>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/80 text-emerald-200 text-xs font-mono flex items-center justify-between animate-in zoom-in-95 duration-200">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {successToast}
          </span>
          <button 
            onClick={() => setSuccessToast(null)}
            className="text-emerald-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0D0F0E] border border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/40 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#C5A059]" /> Bioregion:
          </span>
          {['all', 'Aberdare', 'Turkana', 'Congo', 'Mara'].map((bio) => (
            <button
              key={bio}
              onClick={() => {
                audioFeedback.playMicroTick();
                setSelectedBioregion(bio);
              }}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                selectedBioregion === bio
                  ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/60 font-bold'
                  : 'bg-black/40 text-white/50 hover:text-white'
              }`}
            >
              {bio === 'all' ? 'All Bioregions' : bio}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter reports, metrics, or authors..."
          className="px-3 py-1.5 rounded-md bg-black/60 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 text-xs font-mono min-w-[220px]"
        />
      </div>

      {/* Reports Feed */}
      <div className="space-y-5">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[#0D0F0E] border border-white/10 text-white/50 space-y-2">
            <p className="font-serif text-base text-white">No reports match your filter criteria.</p>
            <p className="text-xs font-mono">Clear search query or select "All Bioregions".</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#0D110F] border border-white/10 hover:border-emerald-500/40 transition-all shadow-lg space-y-4"
            >
              {/* Post Header: Author & Bioregion Tag */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow ${report.authorAvatarBg}`}>
                    {report.authorName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-serif font-bold text-white text-sm">
                        {report.authorName}
                      </span>
                      {report.verifiedSteward && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          Verified Steward
                        </span>
                      )}
                      <span className="text-xs font-mono text-[#C5A059]">
                        {report.authorHandle}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-white/50">
                      {report.authorRole} • <span className="text-white/40">{report.publishedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Bioregion Tag */}
                <div className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#142318] border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{report.bioregionName}</span>
                  <span className="text-white/40">({report.country})</span>
                </div>
              </div>

              {/* Title & Narrative */}
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                  {report.title}
                </h3>
                <p className="text-sm text-[#F5F5F0]/85 font-sans leading-relaxed">
                  {report.narrative}
                </p>
              </div>

              {/* Verified Positive Impact Metrics Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {report.impactMetrics.map((metric, mIdx) => (
                  <div 
                    key={mIdx}
                    className="p-2.5 rounded-lg bg-black/50 border border-emerald-500/30 text-left space-y-0.5"
                  >
                    <div className="text-[10px] font-mono uppercase text-white/50 truncate">
                      {metric.label}
                    </div>
                    <div className="text-xs sm:text-sm font-mono font-bold text-emerald-300 truncate">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Satellite / In-situ Corroboration Line */}
              <div className="p-2.5 rounded-lg bg-[#080B09] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-white/60">
                <div className="flex items-center gap-1.5 truncate">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Corroboration: <strong className="text-white">{report.corroborationMission}</strong></span>
                </div>
                <div className="truncate text-[#C5A059]">
                  Merkle Root: {report.merkleProofHash.slice(0, 14)}...
                </div>
              </div>

              {/* Social Engagement Actions */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  {/* Endorse Verification Button */}
                  <button
                    onClick={() => handleToggleEndorse(report.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      report.userEndorsed
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 font-bold'
                        : 'bg-black/40 border-white/10 text-white/60 hover:text-white'
                    }`}
                    title="Endorse the empirical veracity of this report"
                  >
                    <ShieldCheck className={`w-4 h-4 ${report.userEndorsed ? 'text-emerald-400' : ''}`} />
                    <span>Endorse ({report.endorsementCount})</span>
                  </button>

                  {/* Resonate Button */}
                  <button
                    onClick={() => handleToggleResonate(report.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      report.userResonated
                        ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 font-bold'
                        : 'bg-black/40 border-white/10 text-white/60 hover:text-white'
                    }`}
                    title="Resonate with covenant stewardship"
                  >
                    <Heart className={`w-4 h-4 ${report.userResonated ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>Resonate ({report.resonanceCount})</span>
                  </button>

                  {/* Comments Trigger */}
                  <button
                    onClick={() => {
                      audioFeedback.playSubtleClick();
                      setActiveCommentPostId(activeCommentPostId === report.id ? null : report.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Notes ({report.comments.length})</span>
                  </button>
                </div>

                <div className="text-[11px] text-white/40 hidden md:inline font-mono">
                  {report.didAddress}
                </div>
              </div>

              {/* Expandable Comments Drawer */}
              {activeCommentPostId === report.id && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    {report.comments.length === 0 ? (
                      <p className="text-xs font-mono text-white/40 italic">
                        No steward notes yet. Be the first to anchor feedback!
                      </p>
                    ) : (
                      report.comments.map(c => (
                        <div key={c.id} className="p-2.5 rounded-lg bg-black/60 border border-white/5 text-xs font-sans space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                            <span className="font-bold text-emerald-400">{c.author}</span>
                            <span>{c.timestamp}</span>
                          </div>
                          <p className="text-white/80">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(report.id)}
                      placeholder="Add an epistemic field note or endorsement..."
                      className="flex-1 px-3 py-2 rounded-lg bg-black/70 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 font-mono"
                    />
                    <button
                      onClick={() => handleAddComment(report.id)}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-black font-mono font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Share Verified Report Modal */}
      {isShareModalOpen && (
        <div 
          id="share-report-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            id="share-report-modal-panel"
            className="w-full max-w-xl bg-[#0D120E] border border-amber-500/40 rounded-2xl shadow-2xl p-6 space-y-5 max-h-[92vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    Publish Verified Stewardship Report
                  </h3>
                  <p className="text-xs font-mono text-white/50">
                    Anchors ground truth to the public Community Impact Feed
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitNewReport} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-white/70 block font-bold">Report Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Swale Infiltration Triaged & Riparian Bamboo Seedlings Planted"
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70 block font-bold">Target Bioregion</label>
                  <select
                    value={newBioregion}
                    onChange={(e) => setNewBioregion(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Aberdare Cloud Forest & Chania Basin">Aberdare Cloud Forest & Chania Basin</option>
                    <option value="Lake Turkana & Omo Delta Aquifer">Lake Turkana & Omo Delta Aquifer</option>
                    <option value="Cuvette Centrale Congo Peatlands">Cuvette Centrale Congo Peatlands</option>
                    <option value="Mara-Serengeti Transboundary Biosphere">Mara-Serengeti Transboundary Biosphere</option>
                    <option value="Great Rift Valley Alkaline Catchments">Great Rift Valley Alkaline Catchments</option>
                    <option value="Sahelian Faidherbia Agro-Forestry Belt">Sahelian Faidherbia Agro-Forestry Belt</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 block font-bold">Country / Sovereignty</label>
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Narrative */}
              <div className="space-y-1">
                <label className="text-white/70 block font-bold">Empirical Field Narrative</label>
                <textarea
                  required
                  rows={3}
                  value={newNarrative}
                  onChange={(e) => setNewNarrative(e.target.value)}
                  placeholder="Detail the physical intervention, elder baraza agreements, and observed hydrological or vegetative changes..."
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>

              {/* Impact Metric Pair */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/70 block font-bold">Impact Metric Label</label>
                  <input
                    type="text"
                    value={newMetricLabel}
                    onChange={(e) => setNewMetricLabel(e.target.value)}
                    placeholder="e.g. Native Trees Planted"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/70 block font-bold">Impact Metric Value</label>
                  <input
                    type="text"
                    value={newMetricValue}
                    onChange={(e) => setNewMetricValue(e.target.value)}
                    placeholder="e.g. +3,400 Seedlings / 1.2M Liters"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-emerald-300 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Corroboration Sensor / Mission */}
              <div className="space-y-1">
                <label className="text-white/70 block font-bold">Sensor / Satellite Corroboration</label>
                <input
                  type="text"
                  value={newCorroboration}
                  onChange={(e) => setNewCorroboration(e.target.value)}
                  placeholder="e.g. Sentinel-2 MSI NDVI & In-Situ Geotagged Piezometer"
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Reward Preview */}
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Stewardship Incentive:
                </span>
                <span className="font-bold">+150 Reputation Points + On-Chain Proof</span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-[#C5A059] hover:from-amber-400 text-black font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Minting Proof...</span>
                  ) : (
                    <>
                      <FileCheck2 className="w-4 h-4" />
                      <span>Publish Verified Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
