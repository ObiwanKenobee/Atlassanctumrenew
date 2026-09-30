import React, { useState, useMemo } from 'react';
import {
  MapPin,
  ShieldCheck,
  CheckCircle2,
  TreeDeciduous,
  Droplets,
  Sprout,
  Activity,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Filter,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Layers,
  Radio,
  Calendar,
  Lock,
  Compass,
  Eye
} from 'lucide-react';
import { audioFeedback } from '../../../lib/audioFeedback';

export interface VerifiedImpactSite {
  id: string;
  name: string;
  code: string;
  region: string;
  country: string;
  biomeType: 'Agroforestry' | 'Mangrove Blue Carbon' | 'Deep Aquifer' | 'Modular Habitat' | 'Tropical Rainforest' | 'Afro-Alpine Cloud Forest' | 'Savannah Corridor';
  coordinates: [number, number]; // [lat, lng]
  mapPos: { x: number; y: number }; // percentage on 0-100 SVG coordinate grid
  verifiedProgress: number; // 0 - 100%
  progressStage: 'Mature Equilibrium' | 'Accelerated Regeneration' | 'Early Establishment' | 'Pioneering Phase';
  ecologicalAreaHectares: number;
  carbonSequesteredTons: number;
  aquiferRechargeMillionLiters: number;
  canopyNdvi: number;
  soilCarbonDeltaPct: number;
  biodiversityShannonIndex: number;
  directBeneficiaries: number;
  activeSensorsCount: number;
  merkleProofRoot: string;
  lastAuditDate: string;
  certifyingCouncil: string;
  highlightSummary: string;
  progressHistory: { year: number; quarter: string; progress: number }[];
  coordinatingPartners: string[];
}

export const VERIFIED_IMPACT_SITES: VerifiedImpactSite[] = [
  {
    id: 'site-mara-rift',
    name: 'Mara-Rift Regenerative Biosphere Corridor',
    code: 'BIO-MR-01',
    region: 'Rift Valley Basin',
    country: 'Kenya',
    biomeType: 'Agroforestry',
    coordinates: [-1.2921, 36.8219],
    mapPos: { x: 52, y: 56 },
    verifiedProgress: 78,
    progressStage: 'Accelerated Regeneration',
    ecologicalAreaHectares: 42000,
    carbonSequesteredTons: 148500,
    aquiferRechargeMillionLiters: 1420,
    canopyNdvi: 0.68,
    soilCarbonDeltaPct: 34.8,
    biodiversityShannonIndex: 3.42,
    directBeneficiaries: 184000,
    activeSensorsCount: 420,
    merkleProofRoot: '0x3c99a812b1df4e8a7c2098bca4319800e8f712ac',
    lastAuditDate: '2026-08-15',
    certifyingCouncil: 'East Africa Ecosystem Verification Council',
    highlightSummary: '42,000 hectares of multi-strata agroforestry and wildlife corridors reconnecting degraded pastoral rangelands.',
    progressHistory: [
      { year: 2022, quarter: 'Q1', progress: 38 },
      { year: 2023, quarter: 'Q2', progress: 51 },
      { year: 2024, quarter: 'Q3', progress: 65 },
      { year: 2025, quarter: 'Q4', progress: 74 },
      { year: 2026, quarter: 'Q2', progress: 78 }
    ],
    coordinatingPartners: ['Maasai Land Trust', 'UNEP Bioregional Unit', 'Atlas Sanctum Foundation']
  },
  {
    id: 'site-kilifi-coast',
    name: 'Kilifi Coastal Mangrove Blue Carbon Corridor',
    code: 'BIO-KLF-02',
    region: 'Coast Province',
    country: 'Kenya',
    biomeType: 'Mangrove Blue Carbon',
    coordinates: [-3.6305, 39.8499],
    mapPos: { x: 68, y: 68 },
    verifiedProgress: 88,
    progressStage: 'Mature Equilibrium',
    ecologicalAreaHectares: 12000,
    carbonSequesteredTons: 86400,
    aquiferRechargeMillionLiters: 650,
    canopyNdvi: 0.82,
    soilCarbonDeltaPct: 41.2,
    biodiversityShannonIndex: 3.78,
    directBeneficiaries: 65000,
    activeSensorsCount: 180,
    merkleProofRoot: '0x7b11d9f482a0e2815cd091aa014498ec519800b4',
    lastAuditDate: '2026-09-02',
    certifyingCouncil: 'Marine Bio-Audit Global & Blue Carbon Standard',
    highlightSummary: '12,000 hectares of restored tidal mangrove forest paired with 24 solar seawater desalination micro-kiosks.',
    progressHistory: [
      { year: 2022, quarter: 'Q1', progress: 42 },
      { year: 2023, quarter: 'Q2', progress: 58 },
      { year: 2024, quarter: 'Q3', progress: 72 },
      { year: 2025, quarter: 'Q4', progress: 83 },
      { year: 2026, quarter: 'Q2', progress: 88 }
    ],
    coordinatingPartners: ['Kilifi Community Fisherfolk Union', 'Blue Carbon Initiative']
  },
  {
    id: 'site-turkana-solar',
    name: 'Turkana Deep Aquifer & Solar-Agriculture Hub',
    code: 'BIO-TRK-03',
    region: 'Turkana County',
    country: 'Kenya',
    biomeType: 'Deep Aquifer',
    coordinates: [3.1167, 35.5999],
    mapPos: { x: 48, y: 32 },
    verifiedProgress: 64,
    progressStage: 'Early Establishment',
    ecologicalAreaHectares: 8500,
    carbonSequesteredTons: 28400,
    aquiferRechargeMillionLiters: 2100,
    canopyNdvi: 0.44,
    soilCarbonDeltaPct: 18.5,
    biodiversityShannonIndex: 2.15,
    directBeneficiaries: 92000,
    activeSensorsCount: 310,
    merkleProofRoot: '0x498a7c2098bca4319800e8f712ac3c99a812b1df',
    lastAuditDate: '2026-07-28',
    certifyingCouncil: 'Hydrological Energy Verification Institute',
    highlightSummary: '3.4MW decentralized solar microgrid powering deep brackish aquifer reverse osmosis and 80 LifePod units.',
    progressHistory: [
      { year: 2022, quarter: 'Q1', progress: 20 },
      { year: 2023, quarter: 'Q2', progress: 34 },
      { year: 2024, quarter: 'Q3', progress: 49 },
      { year: 2025, quarter: 'Q4', progress: 59 },
      { year: 2026, quarter: 'Q2', progress: 64 }
    ],
    coordinatingPartners: ['Turkana Pastoralist Cooperative', 'Atlas Industrial Systems']
  },
  {
    id: 'site-kigali-habitat',
    name: 'Kigali LifeHouse Green Industrial Quarter',
    code: 'BIO-KGL-04',
    region: 'Kigali Metropolis',
    country: 'Rwanda',
    biomeType: 'Modular Habitat',
    coordinates: [-1.9706, 30.1044],
    mapPos: { x: 38, y: 58 },
    verifiedProgress: 92,
    progressStage: 'Mature Equilibrium',
    ecologicalAreaHectares: 450,
    carbonSequesteredTons: 38900,
    aquiferRechargeMillionLiters: 180,
    canopyNdvi: 0.74,
    soilCarbonDeltaPct: 29.4,
    biodiversityShannonIndex: 2.85,
    directBeneficiaries: 4800,
    activeSensorsCount: 140,
    merkleProofRoot: '0x102ac3c99a812b1df4e8a7c2098bca4319800e8f',
    lastAuditDate: '2026-09-12',
    certifyingCouncil: 'African Circular Architecture Trust',
    highlightSummary: '450 modular LifeHouse residential units fabricated from bio-composite compressed earth blocks with net-negative emissions.',
    progressHistory: [
      { year: 2022, quarter: 'Q1', progress: 45 },
      { year: 2023, quarter: 'Q2', progress: 68 },
      { year: 2024, quarter: 'Q3', progress: 81 },
      { year: 2025, quarter: 'Q4', progress: 89 },
      { year: 2026, quarter: 'Q2', progress: 92 }
    ],
    coordinatingPartners: ['Rwanda Housing Authority', 'Atlas LifeHouse Labs']
  },
  {
    id: 'site-nairobi-lifepod',
    name: 'Nairobi Peri-Urban Food Sovereignty Grid',
    code: 'BIO-NRB-05',
    region: 'Nairobi Metropolis',
    country: 'Kenya',
    biomeType: 'Modular Habitat',
    coordinates: [-1.2864, 36.8172],
    mapPos: { x: 53, y: 55 },
    verifiedProgress: 84,
    progressStage: 'Mature Equilibrium',
    ecologicalAreaHectares: 120,
    carbonSequesteredTons: 14200,
    aquiferRechargeMillionLiters: 95,
    canopyNdvi: 0.65,
    soilCarbonDeltaPct: 22.0,
    biodiversityShannonIndex: 2.45,
    directBeneficiaries: 110000,
    activeSensorsCount: 95,
    merkleProofRoot: '0x98bca4319800e8f712ac3c99a812b1df4e8a7c20',
    lastAuditDate: '2026-08-30',
    certifyingCouncil: 'Urban Agro-Ecology Verification Board',
    highlightSummary: '120 distributed solar LifePod food units producing 140 tons of organic greens and tilapia monthly.',
    progressHistory: [
      { year: 2022, quarter: 'Q1', progress: 35 },
      { year: 2023, quarter: 'Q2', progress: 52 },
      { year: 2024, quarter: 'Q3', progress: 69 },
      { year: 2025, quarter: 'Q4', progress: 79 },
      { year: 2026, quarter: 'Q2', progress: 84 }
    ],
    coordinatingPartners: ['Nairobi Urban Farmers Union', 'Agro-Tech Trust']
  },
  {
    id: 'site-congo-basin',
    name: 'Congo Basin Primary Rainforest Guardianship',
    code: 'BIO-CNG-06',
    region: 'Equateur Province',
    country: 'DR Congo',
    biomeType: 'Tropical Rainforest',
    coordinates: [0.0384, 18.2612],
    mapPos: { x: 18, y: 48 },
    verifiedProgress: 72,
    progressStage: 'Accelerated Regeneration',
    ecologicalAreaHectares: 250000,
    carbonSequesteredTons: 845000,
    aquiferRechargeMillionLiters: 9800,
    canopyNdvi: 0.89,
    soilCarbonDeltaPct: 48.0,
    biodiversityShannonIndex: 4.65,
    directBeneficiaries: 45000,
    activeSensorsCount: 580,
    merkleProofRoot: '0x65a059812b1df4e8a7c2098bca4319800e8f712a',
    lastAuditDate: '2026-07-14',
    certifyingCouncil: 'Global Forest Canopy Audit & Indigenous Council',
    highlightSummary: '250,000 hectares of primary rainforest monitored by community-operated acoustic sensors and satellite LoRa beacons.',
    progressHistory: [
      { year: 2022, quarter: 'Q1', progress: 30 },
      { year: 2023, quarter: 'Q2', progress: 42 },
      { year: 2024, quarter: 'Q3', progress: 56 },
      { year: 2025, quarter: 'Q4', progress: 68 },
      { year: 2026, quarter: 'Q2', progress: 72 }
    ],
    coordinatingPartners: ['Batwa Guardians Alliance', 'Congo Forest Trust']
  },
  {
    id: 'site-aberdare-highland',
    name: 'Aberdare Cloud Forest Water Tower Ecotone',
    code: 'BIO-ABD-07',
    region: 'Central Highlands',
    country: 'Kenya',
    biomeType: 'Afro-Alpine Cloud Forest',
    coordinates: [-0.4167, 36.7000],
    mapPos: { x: 53, y: 50 },
    verifiedProgress: 95,
    progressStage: 'Mature Equilibrium',
    ecologicalAreaHectares: 35000,
    carbonSequesteredTons: 198000,
    aquiferRechargeMillionLiters: 4800,
    canopyNdvi: 0.91,
    soilCarbonDeltaPct: 52.4,
    biodiversityShannonIndex: 4.12,
    directBeneficiaries: 320000,
    activeSensorsCount: 340,
    merkleProofRoot: '0x812b1df4e8a7c2098bca4319800e8f712ac3c99a',
    lastAuditDate: '2026-09-18',
    certifyingCouncil: 'Afro-Alpine Water Catchment Authority',
    highlightSummary: 'Highland cloud condensation mist-catchers and native cedar agro-terraces securing headwater flow for Nairobi municipal reservoir.',
    progressHistory: [
      { year: 2022, quarter: 'Q1', progress: 55 },
      { year: 2023, quarter: 'Q2', progress: 72 },
      { year: 2024, quarter: 'Q3', progress: 85 },
      { year: 2025, quarter: 'Q4', progress: 91 },
      { year: 2026, quarter: 'Q2', progress: 95 }
    ],
    coordinatingPartners: ['Kenya Forest Service', 'Water Tower Trust']
  },
  {
    id: 'site-serengeti-corridor',
    name: 'Serengeti Transboundary Grazing Commons',
    code: 'BIO-SGT-08',
    region: 'Mara-Serengeti',
    country: 'Tanzania',
    biomeType: 'Savannah Corridor',
    coordinates: [-2.3333, 34.8333],
    mapPos: { x: 46, y: 62 },
    verifiedProgress: 86,
    progressStage: 'Mature Equilibrium',
    ecologicalAreaHectares: 75000,
    carbonSequesteredTons: 220000,
    aquiferRechargeMillionLiters: 1950,
    canopyNdvi: 0.62,
    soilCarbonDeltaPct: 36.5,
    biodiversityShannonIndex: 3.95,
    directBeneficiaries: 85000,
    activeSensorsCount: 260,
    merkleProofRoot: '0x2098bca4319800e8f712ac3c99a812b1df4e8a7c',
    lastAuditDate: '2026-08-25',
    certifyingCouncil: 'Transboundary Ecological Quorum',
    highlightSummary: '75,000 hectares of communal rotational grazing corridors managed via seasonal satellite grassland NDVI markers.',
    progressHistory: [
      { year: 2022, quarter: 'Q1', progress: 48 },
      { year: 2023, quarter: 'Q2', progress: 61 },
      { year: 2024, quarter: 'Q3', progress: 74 },
      { year: 2025, quarter: 'Q4', progress: 82 },
      { year: 2026, quarter: 'Q2', progress: 86 }
    ],
    coordinatingPartners: ['Tanzania Wildlife Authority', 'Pastoral Commons Council']
  }
];

interface VerifiedImpactSitesMapProps {
  onInspectProvenance: (prov: any) => void;
  className?: string;
  initialSelectedSiteId?: string;
}

export const VerifiedImpactSitesMap: React.FC<VerifiedImpactSitesMapProps> = ({
  onInspectProvenance,
  className = '',
  initialSelectedSiteId
}) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(
    initialSelectedSiteId || VERIFIED_IMPACT_SITES[0].id
  );
  const [biomeFilter, setBiomeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minProgressFilter, setMinProgressFilter] = useState<number>(0);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [mapCenter, setMapCenter] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeLayerMode, setActiveLayerMode] = useState<'satellite_terrain' | 'sensor_mesh' | 'contour' | 'heat_map'>('satellite_terrain');
  const [showHeatMapOverlay, setShowHeatMapOverlay] = useState<boolean>(true);

  const selectedSite = useMemo(() => {
    return VERIFIED_IMPACT_SITES.find(s => s.id === selectedSiteId) || VERIFIED_IMPACT_SITES[0];
  }, [selectedSiteId]);

  // Filtered sites for map & list
  const filteredSites = useMemo(() => {
    return VERIFIED_IMPACT_SITES.filter(site => {
      const matchesBiome = biomeFilter === 'all' || site.biomeType === biomeFilter;
      const matchesProgress = site.verifiedProgress >= minProgressFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBiome && matchesProgress && matchesSearch;
    });
  }, [biomeFilter, minProgressFilter, searchQuery]);

  const handleSelectSite = (site: VerifiedImpactSite) => {
    audioFeedback.playSubtleClick();
    setSelectedSiteId(site.id);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return '#10B981'; // emerald-500
    if (progress >= 80) return '#C5A059'; // gold
    if (progress >= 70) return '#38BDF8'; // cyan-400
    return '#F59E0B'; // amber-500
  };

  const getProgressBadgeBg = (progress: number) => {
    if (progress >= 90) return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    if (progress >= 80) return 'bg-amber-950/80 text-[#C5A059] border-[#C5A059]/40';
    if (progress >= 70) return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
    return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
  };

  const biomesList = useMemo(() => {
    const set = new Set(VERIFIED_IMPACT_SITES.map(s => s.biomeType));
    return ['all', ...Array.from(set)];
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Map Control Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              VERIFIED IMPACT SITES MAPPING • GROUND TELEMETRY
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
              {filteredSites.length} Active Sites
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-white flex items-center gap-2">
            <span>Verified Impact Sites & Regeneration Tracker</span>
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans">
            Interactive planetary map plotting verified ecological projects. Click any marker to audit its individual regeneration progress, canopy NDVI, and cryptographic Merkle proof.
          </p>
        </div>

        {/* Search & Map Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#F5F5F0]/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search site, country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#141414] border border-[#F5F5F0]/20 rounded text-xs font-mono text-white placeholder-[#F5F5F0]/40 focus:outline-none focus:border-[#C5A059] w-40 sm:w-48 transition-colors"
            />
          </div>

          {/* Biome Filter */}
          <div className="flex items-center gap-1 bg-[#141414] px-2 py-1 border border-[#F5F5F0]/20 rounded text-xs font-mono">
            <Filter className="w-3 h-3 text-[#C5A059]" />
            <select
              value={biomeFilter}
              onChange={(e) => setBiomeFilter(e.target.value)}
              className="bg-transparent text-[#F5F5F0] focus:outline-none cursor-pointer"
            >
              {biomesList.map(b => (
                <option key={b} value={b} className="bg-[#111] text-white">
                  {b === 'all' ? 'All Biomes' : b}
                </option>
              ))}
            </select>
          </div>

          {/* Progress Tier Filter */}
          <div className="flex items-center gap-1 bg-[#141414] px-2 py-1 border border-[#F5F5F0]/20 rounded text-xs font-mono">
            <span className="text-[#C5A059]">Progress:</span>
            <select
              value={minProgressFilter}
              onChange={(e) => setMinProgressFilter(Number(e.target.value))}
              className="bg-transparent text-[#F5F5F0] focus:outline-none cursor-pointer"
            >
              <option value={0} className="bg-[#111] text-white">All Tiers</option>
              <option value={70} className="bg-[#111] text-white">&gt; 70% Restored</option>
              <option value={80} className="bg-[#111] text-white">&gt; 80% Restored</option>
              <option value={90} className="bg-[#111] text-white">&gt; 90% Restored</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Map & Detailed Regeneration Progress Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map Canvas (8 Columns on desktop) */}
        <div className="lg:col-span-8 bg-[#0A0A0A] border border-[#C5A059]/40 rounded-sm p-4 sm:p-5 shadow-2xl space-y-4 flex flex-col justify-between relative overflow-hidden">
          {/* Map Top Status & Layer Mode Controls */}
          <div className="flex items-center justify-between gap-3 text-xs font-mono relative z-20 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#1B3022] text-emerald-400 font-bold rounded-sm border border-emerald-500/30 flex items-center gap-1.5 uppercase text-[10px]">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                Live Satellite Sensor Mesh
              </span>
              <span className="text-[11px] text-[#F5F5F0]/60 hidden sm:inline">
                Selected: <strong className="text-[#C5A059]">{selectedSite.name}</strong> ({selectedSite.verifiedProgress}%)
              </span>
            </div>

            {/* Map Zoom & Style Controls */}
            <div className="flex items-center gap-2">
              {/* Dedicated Heat Map Overlay Toggle */}
              <button
                id="toggle-heatmap-overlay-btn"
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setShowHeatMapOverlay(!showHeatMapOverlay);
                }}
                className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold font-mono transition-all flex items-center gap-1.5 border cursor-pointer ${
                  showHeatMapOverlay
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                    : 'bg-[#141414] text-[#F5F5F0]/50 border-[#F5F5F0]/15 hover:text-white'
                }`}
                title="Toggle Regeneration Intensity Gradient Heat Map Overlay"
              >
                <Sparkles className={`w-3 h-3 text-amber-400 ${showHeatMapOverlay ? 'animate-pulse' : ''}`} />
                <span>Heat Map Overlay: {showHeatMapOverlay ? 'ON' : 'OFF'}</span>
              </button>

              <div className="flex items-center bg-[#111] p-0.5 rounded border border-[#F5F5F0]/15">
                <button
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setActiveLayerMode('satellite_terrain');
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors ${
                    activeLayerMode === 'satellite_terrain' ? 'bg-[#C5A059] text-black' : 'text-[#F5F5F0]/60 hover:text-white'
                  }`}
                >
                  Terrain
                </button>
                <button
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setActiveLayerMode('contour');
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors ${
                    activeLayerMode === 'contour' ? 'bg-[#C5A059] text-black' : 'text-[#F5F5F0]/60 hover:text-white'
                  }`}
                >
                  Contours
                </button>
                <button
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setActiveLayerMode('sensor_mesh');
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors ${
                    activeLayerMode === 'sensor_mesh' ? 'bg-[#C5A059] text-black' : 'text-[#F5F5F0]/60 hover:text-white'
                  }`}
                >
                  Sensor Grid
                </button>
                <button
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setActiveLayerMode('heat_map');
                    setShowHeatMapOverlay(true);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors ${
                    activeLayerMode === 'heat_map' ? 'bg-[#C5A059] text-black' : 'text-[#F5F5F0]/60 hover:text-white'
                  }`}
                >
                  Pure Heat Map
                </button>
              </div>

              <div className="flex items-center gap-1 bg-[#111] p-0.5 rounded border border-[#F5F5F0]/15">
                <button
                  onClick={() => setMapZoom(prev => Math.min(prev + 0.25, 2.5))}
                  className="p-1 text-[#F5F5F0]/70 hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMapZoom(prev => Math.max(prev - 0.25, 0.75))}
                  className="p-1 text-[#F5F5F0]/70 hover:text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setMapZoom(1);
                    setMapCenter({ x: 0, y: 0 });
                  }}
                  className="p-1 text-[#F5F5F0]/70 hover:text-white transition-colors"
                  title="Reset Map View"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Map Viewport SVG Canvas */}
          <div 
            id="impact-sites-interactive-canvas"
            className="relative w-full h-[420px] sm:h-[480px] bg-[#070908] rounded-sm border border-[#F5F5F0]/15 overflow-hidden flex items-center justify-center cursor-crosshair select-none"
          >
            {/* Topographic Background Graticule */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#050706] via-transparent to-[#10B981]/5 pointer-events-none" />

            {/* Continental & Hydro-Geological Topography Vectors */}
            <div 
              className="w-full h-full relative transition-transform duration-300 ease-out"
              style={{
                transform: `scale(${mapZoom}) translate(${mapCenter.x}px, ${mapCenter.y}px)`
              }}
            >
              <svg className="w-full h-full text-[#C5A059]/20" viewBox="0 0 800 500" fill="none">
                {/* SVG Definitions for Heat Map Overlay Gradient Intensity Colors & Blur */}
                <defs>
                  <filter id="heatMapBlurFilter" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="16" />
                  </filter>
                  <filter id="heatMapCoreGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
                  </filter>

                  {/* Gradient Intensity Colors: Peak Crest (>85% Intensity) */}
                  <radialGradient id="heat-radial-peak" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <stop offset="18%" stopColor="#FDE047" stopOpacity="0.90" />
                    <stop offset="42%" stopColor="#10B981" stopOpacity="0.80" />
                    <stop offset="68%" stopColor="#059669" stopOpacity="0.45" />
                    <stop offset="88%" stopColor="#047857" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#064E3B" stopOpacity="0" />
                  </radialGradient>

                  {/* Gradient Intensity Colors: High Intensity (72% - 85%) */}
                  <radialGradient id="heat-radial-high" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FDE047" stopOpacity="0.85" />
                    <stop offset="25%" stopColor="#34D399" stopOpacity="0.75" />
                    <stop offset="55%" stopColor="#10B981" stopOpacity="0.55" />
                    <stop offset="80%" stopColor="#059669" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#047857" stopOpacity="0" />
                  </radialGradient>

                  {/* Gradient Intensity Colors: Moderate Intensity (50% - 71%) */}
                  <radialGradient id="heat-radial-medium" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.80" />
                    <stop offset="35%" stopColor="#D97706" stopOpacity="0.55" />
                    <stop offset="70%" stopColor="#10B981" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                  </radialGradient>

                  {/* Ambient Diffusion Halo */}
                  <radialGradient id="heat-radial-ambient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                    <stop offset="50%" stopColor="#059669" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#022C22" stopOpacity="0" />
                  </radialGradient>

                  {/* Inter-Bioregional Regenerative Heat Corridor Gradient */}
                  <linearGradient id="heatCorridorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#FDE047" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* Continental Coastline Silhouette */}
                <path
                  d="M 120 40 Q 220 80 260 140 T 340 220 T 480 300 T 560 380 T 640 450"
                  stroke="#C5A059"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.4"
                />
                <path
                  d="M 280 60 Q 340 130 400 190 T 450 310 T 520 440"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />

                {/* Rift Valley Fault Scarp Lines */}
                <path
                  d="M 380 40 L 420 180 L 440 280 L 480 420"
                  stroke="#EC4899"
                  strokeWidth="1.2"
                  strokeDasharray="2 3"
                  strokeOpacity="0.3"
                />

                {/* Major African Rift Lakes (Victoria, Tanganyika, Turkana) */}
                {/* Lake Victoria */}
                <ellipse cx="400" cy="270" rx="55" ry="68" fill="#38BDF8" fillOpacity="0.12" stroke="#38BDF8" strokeWidth="1.2" strokeOpacity="0.5" />
                <text x="375" y="275" fill="#38BDF8" fontSize="9" opacity="0.6" fontFamily="monospace">L. Victoria</text>

                {/* Lake Turkana */}
                <ellipse cx="430" cy="160" rx="18" ry="48" fill="#38BDF8" fillOpacity="0.1" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
                <text x="415" y="165" fill="#38BDF8" fontSize="8" opacity="0.6" fontFamily="monospace">L. Turkana</text>

                {/* Lake Tanganyika */}
                <path d="M 340 330 Q 350 380 370 440" stroke="#38BDF8" strokeWidth="4" strokeOpacity="0.25" strokeLinecap="round" />

                {/* Congo River Basin Watershed Basin Arc */}
                <ellipse cx="220" cy="240" rx="90" ry="70" fill="#10B981" fillOpacity="0.06" stroke="#10B981" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" />
                <text x="170" y="245" fill="#10B981" fontSize="9" opacity="0.5" fontFamily="monospace">Congo Rainforest Basin</text>

                {/* Equator & Tropic Latitude Grid Lines */}
                <line x1="0" y1="250" x2="800" y2="250" stroke="#F5F5F0" strokeWidth="0.8" strokeOpacity="0.15" strokeDasharray="6 6" />
                <text x="15" y="245" fill="#F5F5F0" fontSize="8" opacity="0.4" fontFamily="monospace">EQUATOR 0°00'</text>

                <line x1="0" y1="120" x2="800" y2="120" stroke="#F5F5F0" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="3 3" />
                <text x="15" y="115" fill="#F5F5F0" fontSize="8" opacity="0.3" fontFamily="monospace">+10°00' N</text>

                <line x1="0" y1="380" x2="800" y2="380" stroke="#F5F5F0" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="3 3" />
                <text x="15" y="375" fill="#F5F5F0" fontSize="8" opacity="0.3" fontFamily="monospace">-10°00' S</text>

                {/* Dynamic Sensor Density Mesh Mode */}
                {activeLayerMode === 'sensor_mesh' && (
                  <g opacity="0.4">
                    {filteredSites.map((site) => (
                      <circle
                        key={`mesh-${site.id}`}
                        cx={`${site.mapPos.x * 8}`}
                        cy={`${site.mapPos.y * 5}`}
                        r="60"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="0.8"
                        strokeDasharray="2 4"
                      />
                    ))}
                  </g>
                )}

                {/* Heat Map Overlay Layer: Visualizing Areas of Highest Regeneration Intensity using Gradient Intensity Colors */}
                {(showHeatMapOverlay || activeLayerMode === 'heat_map') && (
                  <g id="heat-map-overlay-layer" opacity={activeLayerMode === 'heat_map' ? 0.95 : 0.85}>
                    {/* Inter-Bioregional Regenerative Corridors with thermal gradient flow */}
                    <g filter="url(#heatMapBlurFilter)" opacity="0.6">
                      {/* Mara to Serengeti corridor */}
                      <path
                        d="M 416 280 Q 390 295 368 310"
                        stroke="url(#heatCorridorGradient)"
                        strokeWidth="28"
                        strokeLinecap="round"
                        fill="none"
                      />
                      {/* Aberdare to Nairobi corridor */}
                      <path
                        d="M 424 250 Q 424 265 424 275"
                        stroke="url(#heatCorridorGradient)"
                        strokeWidth="24"
                        strokeLinecap="round"
                        fill="none"
                      />
                      {/* Rift to Kilifi coastal plume */}
                      <path
                        d="M 424 280 Q 480 310 544 340"
                        stroke="url(#heatCorridorGradient)"
                        strokeWidth="20"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </g>

                    {/* Gradient Intensity Hotspots centered on Verified Sites */}
                    {filteredSites.map((site) => {
                      const cx = site.mapPos.x * 8;
                      const cy = site.mapPos.y * 5;
                      const intensity = Math.min(
                        100,
                        Math.round(
                          site.verifiedProgress * 0.40 +
                          (site.canopyNdvi * 100) * 0.35 +
                          site.soilCarbonDeltaPct * 0.50
                        )
                      );

                      // Select gradient and radii based on regeneration intensity
                      const gradientId = 
                        intensity >= 86 ? 'url(#heat-radial-peak)' :
                        intensity >= 72 ? 'url(#heat-radial-high)' :
                        'url(#heat-radial-medium)';

                      const outerRadius = 75 + (intensity / 100) * 45;
                      const coreRadius = 38 + (intensity / 100) * 28;
                      const peakCenterRadius = 14 + (intensity / 100) * 14;

                      return (
                        <g key={`heat-${site.id}`}>
                          {/* Ambient Diffuse Thermal Halos */}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={outerRadius}
                            fill="url(#heat-radial-ambient)"
                            filter="url(#heatMapBlurFilter)"
                            opacity="0.8"
                          />

                          {/* Primary Regeneration Intensity Gradient Bloom */}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={coreRadius}
                            fill={gradientId}
                            filter="url(#heatMapBlurFilter)"
                            opacity="0.9"
                          />

                          {/* Concentrated Epicenter Hotspot */}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={peakCenterRadius}
                            fill={gradientId}
                            filter="url(#heatMapCoreGlow)"
                            opacity="0.95"
                          />

                          {/* Iso-Intensity Contour Rings */}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={coreRadius * 0.75}
                            fill="none"
                            stroke={intensity >= 86 ? '#FDE047' : '#10B981'}
                            strokeWidth="0.8"
                            strokeDasharray="3 3"
                            strokeOpacity={intensity >= 86 ? 0.6 : 0.35}
                          />

                          {/* Peak Crest Iso-Label */}
                          {intensity >= 88 && (
                            <g>
                              <circle
                                cx={cx}
                                cy={cy}
                                r={peakCenterRadius * 0.6}
                                fill="#FFFFFF"
                                fillOpacity="0.4"
                              />
                              <text
                                x={cx}
                                y={cy - coreRadius * 0.75 - 4}
                                fill="#FDE047"
                                fontSize="8"
                                fontWeight="bold"
                                textAnchor="middle"
                                fontFamily="monospace"
                                opacity="0.9"
                              >
                                {intensity}% INTENSITY
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                )}
              </svg>

              {/* Verified Impact Site Markers plotted on map */}
              {filteredSites.map((site) => {
                const isSelected = site.id === selectedSite.id;
                const progressColor = getProgressColor(site.verifiedProgress);

                return (
                  <div
                    key={site.id}
                    style={{
                      left: `${site.mapPos.x}%`,
                      top: `${site.mapPos.y}%`
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                    onClick={() => handleSelectSite(site)}
                  >
                    {/* Pulsing Beacon Wave around selected marker */}
                    {isSelected && (
                      <span
                        className="absolute inset-0 -m-3 rounded-full animate-ping opacity-60 pointer-events-none"
                        style={{ backgroundColor: progressColor }}
                      />
                    )}

                    {/* Progress Circle Outer Stroke Ring */}
                    <div
                      className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'scale-125 ring-4 ring-white/30 shadow-[0_0_20px_rgba(197,160,89,0.6)] z-30'
                          : 'hover:scale-115'
                      }`}
                      style={{
                        backgroundColor: '#0A0D0B',
                        border: `2px solid ${progressColor}`
                      }}
                    >
                      <MapPin
                        className="w-4 h-4 transition-transform group-hover:-translate-y-0.5"
                        style={{ color: progressColor }}
                      />

                      {/* Small circular % badge on top right of marker */}
                      <span
                        className="absolute -top-1 -right-1 text-[8px] font-mono font-black px-1 rounded-full text-black"
                        style={{ backgroundColor: progressColor }}
                      >
                        {site.verifiedProgress}%
                      </span>
                    </div>

                    {/* Hover Tooltip Card */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-40 bg-[#0D0D0D]/95 border border-[#C5A059]/60 rounded p-2.5 shadow-2xl text-xs font-mono whitespace-nowrap min-w-[180px]">
                      <div className="font-bold text-white text-[11px] truncate">{site.name}</div>
                      <div className="flex items-center justify-between text-[10px] mt-1 pt-1 border-t border-[#F5F5F0]/15">
                        <span className="text-[#F5F5F0]/60">{site.country}</span>
                        <span className="font-bold" style={{ color: progressColor }}>
                          {site.verifiedProgress}% Verified
                        </span>
                      </div>
                      <div className="text-[9px] text-[#C5A059] mt-0.5 flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{site.biomeType}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Floating Heat Map Intensity Gradient Legend */}
            {(showHeatMapOverlay || activeLayerMode === 'heat_map') && (
              <div className="absolute top-3 left-3 p-3 bg-[#0D0D0D]/90 backdrop-blur-md border border-amber-500/40 rounded-sm shadow-2xl z-30 max-w-[280px] text-xs font-mono space-y-2 pointer-events-auto">
                <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Heat Map Overlay • Intensity Colors
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
                    Active
                  </span>
                </div>

                {/* Gradient Intensity Color Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2 rounded-full overflow-hidden bg-gradient-to-r from-[#1E293B] via-[#F59E0B] via-[#10B981] via-[#34D399] to-[#FDE047] shadow-inner border border-white/10" />
                  <div className="flex justify-between text-[8px] text-[#F5F5F0]/60">
                    <span>0% Stress</span>
                    <span>50% Moderate</span>
                    <span>75% High</span>
                    <span className="text-[#FDE047] font-bold">100% Peak</span>
                  </div>
                </div>

                <div className="text-[10px] text-[#F5F5F0]/70 pt-1 border-t border-[#F5F5F0]/10 flex items-center justify-between">
                  <span>Selected Site Intensity:</span>
                  <span className="text-amber-300 font-bold font-mono">
                    {Math.min(
                      100,
                      Math.round(
                        selectedSite.verifiedProgress * 0.40 +
                        (selectedSite.canopyNdvi * 100) * 0.35 +
                        selectedSite.soilCarbonDeltaPct * 0.50
                      )
                    )}% Peak Thermal
                  </span>
                </div>
              </div>
            )}

            {/* Bottom In-Map Status Bar Overlay */}
            <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-[#0D0D0D]/95 backdrop-blur-md border border-[#F5F5F0]/15 rounded-sm flex items-center justify-between gap-3 text-xs font-mono z-30">
              <div className="flex items-center gap-3">
                <span className="text-[#F5F5F0]/50 text-[10px]">Map Projection:</span>
                <span className="text-[#C5A059] font-bold text-[11px]">WGS84 Equatorial Rift Basin</span>
                <span className="text-[#F5F5F0]/30 hidden sm:inline">•</span>
                <span className="text-[#8FB8DE] hidden sm:inline text-[11px]">
                  Showing {filteredSites.length} of {VERIFIED_IMPACT_SITES.length} Sites
                </span>
              </div>

              <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">100% Cryptographic Sensor Proofs</span>
              </div>
            </div>
          </div>

          {/* Quick Roster of Filtered Impact Sites Strip */}
          <div className="pt-2">
            <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 mb-1.5 flex items-center justify-between">
              <span>Quick Select Verified Site:</span>
              <span>Click to pan & inspect</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {filteredSites.map(site => {
                const isSelected = site.id === selectedSite.id;
                const progressColor = getProgressColor(site.verifiedProgress);
                return (
                  <button
                    key={site.id}
                    onClick={() => handleSelectSite(site)}
                    className={`p-2 rounded text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1B3022] border-[#C5A059] shadow-sm ring-1 ring-[#C5A059]'
                        : 'bg-[#111412] border-[#F5F5F0]/10 hover:border-[#C5A059]/40 hover:bg-[#141815]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] font-mono text-[#8FB8DE] font-bold">{site.code}</span>
                      <span className="text-[9px] font-mono font-bold" style={{ color: progressColor }}>
                        {site.verifiedProgress}%
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white truncate mt-0.5">{site.name}</div>
                    <div className="text-[10px] text-[#F5F5F0]/50 truncate">{site.region}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Site Detailed Regeneration Progress Inspector (4 Columns on desktop) */}
        <div className="lg:col-span-4 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm p-5 shadow-2xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Top Site Header & Badge */}
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-bold ${getProgressBadgeBg(selectedSite.verifiedProgress)}`}>
                {selectedSite.progressStage}
              </span>
              <span className="text-xs font-mono font-bold text-[#8FB8DE]">
                {selectedSite.code}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold text-white leading-snug">
                {selectedSite.name}
              </h3>
              <p className="text-xs text-[#C5A059] font-mono mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C5A059]" />
                <span>{selectedSite.region}, {selectedSite.country}</span>
              </p>
              <p className="text-[11px] text-[#F5F5F0]/40 font-mono mt-0.5">
                Coordinates: [{selectedSite.coordinates.join(', ')}]
              </p>
            </div>

            <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
              {selectedSite.highlightSummary}
            </p>

            {/* Individual Regeneration Progress Gauge Card */}
            <div className="p-4 bg-[#111412] border border-[#C5A059]/40 rounded-sm space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-[#C5A059] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  Regeneration Score
                </span>
                <span className="text-xl font-mono font-bold text-white">
                  {selectedSite.verifiedProgress}%
                </span>
              </div>

              {/* Large Progress Bar with Gradient */}
              <div className="w-full h-3 bg-[#080808] rounded-full overflow-hidden p-0.5 border border-[#F5F5F0]/10">
                <div
                  className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400"
                  style={{ width: `${selectedSite.verifiedProgress}%` }}
                />
              </div>

              {/* 4 Pillar Breakdown Bars */}
              <div className="space-y-2 pt-2 border-t border-[#F5F5F0]/10 text-xs font-mono">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-0.5">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <TreeDeciduous className="w-3 h-3" />
                      Canopy Density (NDVI):
                    </span>
                    <span className="font-bold text-white">{selectedSite.canopyNdvi}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#080808] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${selectedSite.canopyNdvi * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-0.5">
                    <span className="text-amber-400 flex items-center gap-1">
                      <Sprout className="w-3 h-3" />
                      Soil Organic Carbon Delta:
                    </span>
                    <span className="font-bold text-white">+{selectedSite.soilCarbonDeltaPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#080808] rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, selectedSite.soilCarbonDeltaPct * 2)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-0.5">
                    <span className="text-cyan-400 flex items-center gap-1">
                      <Droplets className="w-3 h-3" />
                      Aquifer Volume Recharged:
                    </span>
                    <span className="font-bold text-white">{selectedSite.aquiferRechargeMillionLiters.toLocaleString()} ML</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#080808] rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-0.5">
                    <span className="text-purple-400 flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      Biodiversity Shannon Index (H'):
                    </span>
                    <span className="font-bold text-white">{selectedSite.biodiversityShannonIndex} H'</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#080808] rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(selectedSite.biodiversityShannonIndex / 5) * 100}%` }} />
                  </div>
                </div>

                {/* Heat Map Regeneration Intensity Rating */}
                <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between text-[11px]">
                  <span className="text-amber-300 flex items-center gap-1 font-bold">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Regeneration Heat Intensity:
                  </span>
                  <span className="font-bold text-amber-300 font-mono">
                    {Math.min(
                      100,
                      Math.round(
                        selectedSite.verifiedProgress * 0.40 +
                        (selectedSite.canopyNdvi * 100) * 0.35 +
                        selectedSite.soilCarbonDeltaPct * 0.50
                      )
                    )}% Peak Thermal
                  </span>
                </div>
              </div>
            </div>

            {/* Longitudinal Historical Trajectory Mini Sparkline */}
            <div className="bg-[#111412] p-3 rounded-sm border border-[#F5F5F0]/10 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#F5F5F0]/60">
                <span>Multi-Year Regeneration Trajectory:</span>
                <span className="text-emerald-400">+{(selectedSite.verifiedProgress - selectedSite.progressHistory[0].progress)}% Since 2022</span>
              </div>
              <div className="flex items-end justify-between gap-1 h-10 pt-1">
                {selectedSite.progressHistory.map(h => (
                  <div key={`${h.year}-${h.quarter}`} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-[#C5A059] rounded-xs"
                      style={{ height: `${(h.progress / 100) * 28}px` }}
                      title={`${h.year} ${h.quarter}: ${h.progress}%`}
                    />
                    <span className="text-[8px] text-[#F5F5F0]/40">{h.quarter}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptographic Ledger & Audit Metadata */}
            <div className="p-3 bg-[#080808] rounded border border-[#F5F5F0]/10 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#F5F5F0]/50">Audit Ratification:</span>
                <span className="text-emerald-400 font-bold">{selectedSite.lastAuditDate}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#F5F5F0]/50">Online Sensor Nodes:</span>
                <span className="text-white font-bold">{selectedSite.activeSensorsCount} Active LoRa Nodes</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#F5F5F0]/50">Direct Beneficiaries:</span>
                <span className="text-[#C5A059] font-bold">{selectedSite.directBeneficiaries.toLocaleString()} People</span>
              </div>
              <div className="text-[9px] text-[#F5F5F0]/40 pt-1 border-t border-[#F5F5F0]/10 truncate">
                ZKP Merkle Proof: <span className="font-mono text-white/70">{selectedSite.merkleProofRoot}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                onInspectProvenance({
                  id: `PROV-${selectedSite.code}`,
                  target: selectedSite.name,
                  verifier: selectedSite.certifyingCouncil,
                  date: selectedSite.lastAuditDate,
                  merkleRoot: selectedSite.merkleProofRoot,
                  verifiedProgress: selectedSite.verifiedProgress,
                  hectares: selectedSite.ecologicalAreaHectares
                });
              }}
              className="w-full py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/50 text-white rounded-sm text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Inspect Cryptographic Provenance</span>
              <ArrowUpRight className="w-3 h-3 text-[#C5A059]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
