import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Maximize2, 
  RotateCw, 
  Sliders, 
  MapPin, 
  CheckCircle2, 
  Calendar, 
  Droplets, 
  TreeDeciduous, 
  Flame, 
  Activity, 
  Compass, 
  Radio, 
  Download,
  Info,
  ChevronRight,
  Hexagon
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export type ImpactDomain = 'all' | 'hydrology' | 'canopy' | 'soil' | 'hazard';

export interface StewardshipHexCell {
  id: string;
  q: number; // axial coordinate q
  r: number; // axial coordinate r
  domain: 'hydrology' | 'canopy' | 'soil' | 'hazard';
  name: string;
  region: string;
  contributionCount: number;
  impactScore: number; // 0-100 (drives 3D extrusion height)
  primaryMetric: string;
  metricValue: string;
  verifiedHectares: number;
  merkleProof: string;
  satelliteAttestation: string;
  lastVerifiedDate: string;
  citizenRole: string;
}

export const MOCK_STEWARDSHIP_HEX_DATA: StewardshipHexCell[] = [
  // Ring 0 (Center)
  {
    id: 'hex-0-0',
    q: 0,
    r: 0,
    domain: 'hydrology',
    name: 'Lotikipi Deep Aquifer Swale Cascade',
    region: 'North Turkana Basin',
    contributionCount: 14,
    impactScore: 94,
    primaryMetric: 'Groundwater Infiltration',
    metricValue: '4.2M Liters Recharged',
    verifiedHectares: 240,
    merkleProof: '0x8f3c...b14a',
    satelliteAttestation: 'NASA GRACE-FO & SMAP L-Band Pass #842',
    lastVerifiedDate: 'Yesterday at 16:40',
    citizenRole: 'Hydrological Architect'
  },
  // Ring 1 (Immediate neighbors)
  {
    id: 'hex-1-0',
    q: 1,
    r: 0,
    domain: 'canopy',
    name: 'Mau Forest Western Podocarpus Buffer',
    region: 'Rift Valley Highlands',
    contributionCount: 19,
    impactScore: 88,
    primaryMetric: 'Canopy Density Accretion',
    metricValue: '+18.4% NDVI Index',
    verifiedHectares: 510,
    merkleProof: '0x3a92...71e0',
    satelliteAttestation: 'Sentinel-2 MSI Red-Edge Index',
    lastVerifiedDate: '3 days ago',
    citizenRole: 'Canopy Steward'
  },
  {
    id: 'hex-0-1',
    q: 0,
    r: 1,
    domain: 'soil',
    name: 'Cherangani Terra Preta Inoculation',
    region: 'Mount Elgon Foothills',
    contributionCount: 8,
    impactScore: 72,
    primaryMetric: 'Soil Organic Carbon',
    metricValue: '+3.4 t/ha Carbon Accretion',
    verifiedHectares: 180,
    merkleProof: '0x1d4a...58c2',
    satelliteAttestation: 'Landsat-9 SWIR & Field Spectrometry',
    lastVerifiedDate: '5 days ago',
    citizenRole: 'Soil Microbiome Guardian'
  },
  {
    id: 'hex-m1-1',
    q: -1,
    r: 1,
    domain: 'hazard',
    name: 'Loita Hills Wildfire Early Break',
    region: 'Narok South Ecosystem',
    contributionCount: 11,
    impactScore: 82,
    primaryMetric: 'Thermal Flare Arrest',
    metricValue: '18km Firebreak Cleared',
    verifiedHectares: 340,
    merkleProof: '0x7e22...49fb',
    satelliteAttestation: 'VIIRS 375m Active Fire Detection',
    lastVerifiedDate: '1 week ago',
    citizenRole: 'First Responder'
  },
  {
    id: 'hex-m1-0',
    q: -1,
    r: 0,
    domain: 'hydrology',
    name: 'Nyando River Riparian Terracing',
    region: 'Kano Plains Catchment',
    contributionCount: 7,
    impactScore: 65,
    primaryMetric: 'Turbidity Abatement',
    metricValue: '-45% Sediment Discharge',
    verifiedHectares: 120,
    merkleProof: '0x4c11...92aa',
    satelliteAttestation: 'Sentinel-1 SAR Turbidity Gauge #09',
    lastVerifiedDate: '2 weeks ago',
    citizenRole: 'Riparian Custodian'
  },
  {
    id: 'hex-0-m1',
    q: 0,
    r: -1,
    domain: 'canopy',
    name: 'Aberdares Cloud Forest Moisture Trap',
    region: 'Central Kenya Highlands',
    contributionCount: 12,
    impactScore: 79,
    primaryMetric: 'Atmospheric Fog Capture',
    metricValue: '+620k Liters Harvested',
    verifiedHectares: 290,
    merkleProof: '0x6b80...312f',
    satelliteAttestation: 'MODIS Water Vapor Profiler',
    lastVerifiedDate: '2 weeks ago',
    citizenRole: 'Cloud Water Forester'
  },
  {
    id: 'hex-1-m1',
    q: 1,
    r: -1,
    domain: 'soil',
    name: 'Lake Baringo Halophyte Stabilization',
    region: 'Baringo Saline Flatlands',
    contributionCount: 6,
    impactScore: 58,
    primaryMetric: 'Alkaline Soil Restoration',
    metricValue: '-2.8 dS/m Salinity',
    verifiedHectares: 95,
    merkleProof: '0x991f...28ea',
    satelliteAttestation: 'Ground Conductivity Sensors Array',
    lastVerifiedDate: '3 weeks ago',
    citizenRole: 'Halophyte Planter'
  },
  // Ring 2 (Extended outer clusters)
  {
    id: 'hex-2-0',
    q: 2,
    r: 0,
    domain: 'canopy',
    name: 'Kakamega Rainforest Indigenous Belt',
    region: 'Western Guineo-Congolian Zone',
    contributionCount: 15,
    impactScore: 91,
    primaryMetric: 'Endangered Tree Density',
    metricValue: '1,420 Seedlings Geotagged',
    verifiedHectares: 420,
    merkleProof: '0x55ca...0981',
    satelliteAttestation: 'PlanetScope 3m Orthomosaic',
    lastVerifiedDate: '1 month ago',
    citizenRole: 'Canopy Steward'
  },
  {
    id: 'hex-2-m1',
    q: 2,
    r: -1,
    domain: 'hydrology',
    name: 'Ewaso Ng\'iro Sand Dam Cascade',
    region: 'Laikipia-Samburu Savanna',
    contributionCount: 9,
    impactScore: 76,
    primaryMetric: 'Subsurface Sand Storage',
    metricValue: '1.8M Liters Capacity',
    verifiedHectares: 210,
    merkleProof: '0x22db...7811',
    satelliteAttestation: 'Drone LiDAR Elevation Scan',
    lastVerifiedDate: '1 month ago',
    citizenRole: 'Hydrological Architect'
  },
  {
    id: 'hex-1-1',
    q: 1,
    r: 1,
    domain: 'hazard',
    name: 'Tsavo West Wildlife Corridor Firebreak',
    region: 'Coast Biosphere Hinterland',
    contributionCount: 5,
    impactScore: 61,
    primaryMetric: 'Biochar Barrier Barrier',
    metricValue: '12km Hydrated Perimeter',
    verifiedHectares: 160,
    merkleProof: '0x17fa...cc39',
    satelliteAttestation: 'VIIRS 375m Nighttime Patrol',
    lastVerifiedDate: '1 month ago',
    citizenRole: 'First Responder'
  },
  {
    id: 'hex-m1-2',
    q: -1,
    r: 2,
    domain: 'soil',
    name: 'Winam Gulf Bio-Digester Sequestration',
    region: 'Kisumu Littoral Sector',
    contributionCount: 10,
    impactScore: 84,
    primaryMetric: 'Invasive Hyacinth Sequestration',
    metricValue: '48 Tons Compost Bound',
    verifiedHectares: 310,
    merkleProof: '0x73bb...e400',
    satelliteAttestation: 'Sentinel-5P TROPOMI Methane Baseline',
    lastVerifiedDate: '1 month ago',
    citizenRole: 'Biomass Engineer'
  },
  {
    id: 'hex-m2-1',
    q: -2,
    r: 1,
    domain: 'hydrology',
    name: 'Mount Kulal Cloud Biosphere Springs',
    region: 'Marsabit Highlands Oasis',
    contributionCount: 8,
    impactScore: 70,
    primaryMetric: 'Spring Flow Recovery',
    metricValue: '+28% Discharge Velocity',
    verifiedHectares: 175,
    merkleProof: '0x44aa...dd19',
    satelliteAttestation: 'NASA SMAP Surface Wetness',
    lastVerifiedDate: '2 months ago',
    citizenRole: 'Spring Custodian'
  },
  {
    id: 'hex-m2-0',
    q: -2,
    r: 0,
    domain: 'canopy',
    name: 'Shimba Hills Coastal Cycad Reserve',
    region: 'Kwale Maritime Escarpment',
    contributionCount: 4,
    impactScore: 54,
    primaryMetric: 'Rare Cycad Geo-Fencing',
    metricValue: '86 Trees Tagged with NFC',
    verifiedHectares: 80,
    merkleProof: '0x38dd...bb02',
    satelliteAttestation: 'Copernicus Sentinel-2 NDVI',
    lastVerifiedDate: '2 months ago',
    citizenRole: 'Botanical Warden'
  },
  {
    id: 'hex-0-2',
    q: 0,
    r: 2,
    domain: 'hazard',
    name: 'Murchison Falls Wildlife Silt Trap',
    region: 'Albertine Rift Escarpment',
    contributionCount: 7,
    impactScore: 68,
    primaryMetric: 'Riparian Silt Attenuation',
    metricValue: '-32% Soil Runoff Load',
    verifiedHectares: 190,
    merkleProof: '0x66cc...9911',
    satelliteAttestation: 'ESA Sentinel-1 SAR River Gauge',
    lastVerifiedDate: '2 months ago',
    citizenRole: 'Sediment Controller'
  }
];

interface StewardshipHeatmap3DProps {
  onSelectHex?: (hex: StewardshipHexCell) => void;
  className?: string;
}

export const StewardshipHeatmap3D: React.FC<StewardshipHeatmap3DProps> = ({
  onSelectHex,
  className = ''
}) => {
  const [selectedHex, setSelectedHex] = useState<StewardshipHexCell>(MOCK_STEWARDSHIP_HEX_DATA[0]);
  const [activeDomain, setActiveDomain] = useState<ImpactDomain>('all');
  const [tiltAngle, setTiltAngle] = useState<number>(38); // degrees
  const [rotationAngle, setRotationAngle] = useState<number>(25); // degrees
  const [extrusionMultiplier, setExtrusionMultiplier] = useState<number>(1.2);
  const [viewMode, setViewMode] = useState<'3D_ISOMETRIC' | 'TOP_DOWN'>('3D_ISOMETRIC');
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // Filtered dataset
  const filteredHexes = useMemo(() => {
    if (activeDomain === 'all') return MOCK_STEWARDSHIP_HEX_DATA;
    return MOCK_STEWARDSHIP_HEX_DATA.filter(h => h.domain === activeDomain);
  }, [activeDomain]);

  // Aggregate stats
  const aggregateStats = useMemo(() => {
    const totalContributions = MOCK_STEWARDSHIP_HEX_DATA.reduce((acc, h) => acc + h.contributionCount, 0);
    const totalHectares = MOCK_STEWARDSHIP_HEX_DATA.reduce((acc, h) => acc + h.verifiedHectares, 0);
    const avgScore = Math.round(MOCK_STEWARDSHIP_HEX_DATA.reduce((acc, h) => acc + h.impactScore, 0) / MOCK_STEWARDSHIP_HEX_DATA.length);
    return { totalContributions, totalHectares, avgScore };
  }, []);

  // Geometry calculation for 3D Hexagonal Prism
  // Axial coordinates (q, r) to 2D center (x, y)
  const hexRadius = 42; // base size
  const hexWidth = Math.sqrt(3) * hexRadius; // ~72.7
  const hexHeight = 2 * hexRadius; // 84

  const getHexCenter = (q: number, r: number) => {
    // Standard flat-topped / pointy-topped hex layout
    const x = hexRadius * Math.sqrt(3) * (q + r / 2);
    const y = hexRadius * (3 / 2) * r;
    return { x, y };
  };

  // Color mapping based on domain and score
  const getDomainColors = (domain: StewardshipHexCell['domain'], score: number) => {
    switch (domain) {
      case 'hydrology':
        return {
          top: '#38BDF8', // Cyan
          topHighlight: '#7DD3FC',
          sideLeft: '#0284C7',
          sideRight: '#0369A1',
          stroke: '#BAE6FD',
          glow: 'rgba(56, 189, 248, 0.4)'
        };
      case 'canopy':
        return {
          top: '#10B981', // Emerald
          topHighlight: '#34D399',
          sideLeft: '#059669',
          sideRight: '#047857',
          stroke: '#A7F3D0',
          glow: 'rgba(16, 185, 129, 0.4)'
        };
      case 'soil':
        return {
          top: '#F59E0B', // Amber
          topHighlight: '#FBBF24',
          sideLeft: '#D97706',
          sideRight: '#B45309',
          stroke: '#FDE68A',
          glow: 'rgba(245, 158, 11, 0.4)'
        };
      case 'hazard':
        return {
          top: '#F43F5E', // Rose
          topHighlight: '#FB7185',
          sideLeft: '#E11D48',
          sideRight: '#BE123C',
          stroke: '#FECDD3',
          glow: 'rgba(244, 63, 94, 0.4)'
        };
      default:
        return {
          top: '#C5A059',
          topHighlight: '#E0C58A',
          sideLeft: '#A38038',
          sideRight: '#82652A',
          stroke: '#F5F5F0',
          glow: 'rgba(197, 160, 89, 0.4)'
        };
    }
  };

  // Generate SVG polygon points for top hexagon face
  const getHexVertices = (cx: number, cy: number, r: number) => {
    const points: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i - 30);
      points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    return points;
  };

  const handleHexClick = (hex: StewardshipHexCell) => {
    audioFeedback.playMicroTick();
    setSelectedHex(hex);
    if (onSelectHex) onSelectHex(hex);
  };

  const handleRotate = () => {
    audioFeedback.playSubtleClick();
    setRotationAngle(prev => (prev + 45) % 360);
  };

  return (
    <div className={`p-5 sm:p-6 rounded-md bg-[#0A0D0B] border border-[#F5F5F0]/15 space-y-6 shadow-2xl ${className}`}>
      {/* Component Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-[0.2em]">
              VERIFIED STEWARDSHIP IMPACT • 3D HEXAGONAL VOLUMETRIC GRID
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-[#F5F5F0] flex items-center gap-2">
            <Hexagon className="w-5 h-5 text-[#C5A059]" />
            Citizen Stewardship 3D Heatmap
          </h3>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 font-sans max-w-2xl">
            Volumetric 3D extrusion of your verified ecological contributions across East African watersheds. Height columns reflect cumulative verifiable restoration impact and ZKP Merkle attestations.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setViewMode(viewMode === '3D_ISOMETRIC' ? 'TOP_DOWN' : '3D_ISOMETRIC');
            }}
            className="px-3 py-1.5 rounded-sm bg-[#121914] hover:bg-[#1A261D] border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>{viewMode === '3D_ISOMETRIC' ? 'Switch to Top-Down 2D' : 'Switch to 3D Isometric'}</span>
          </button>

          <button
            onClick={handleRotate}
            className="px-3 py-1.5 rounded-sm bg-[#141414] hover:bg-[#1E1E1E] border border-[#F5F5F0]/20 text-[#F5F5F0] text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Rotate {rotationAngle}°</span>
          </button>
        </div>
      </div>

      {/* Aggregate Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-black/40 rounded border border-[#F5F5F0]/10 space-y-0.5">
          <span className="text-[#F5F5F0]/50 text-[10px] uppercase block">Total Verified Actions</span>
          <span className="text-lg font-bold text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {aggregateStats.totalContributions} Contributions
          </span>
        </div>
        <div className="p-3 bg-black/40 rounded border border-[#F5F5F0]/10 space-y-0.5">
          <span className="text-[#F5F5F0]/50 text-[10px] uppercase block">Restored Biosphere</span>
          <span className="text-lg font-bold text-emerald-300">
            {aggregateStats.totalHectares.toLocaleString()} Hectares
          </span>
        </div>
        <div className="p-3 bg-black/40 rounded border border-[#F5F5F0]/10 space-y-0.5">
          <span className="text-[#F5F5F0]/50 text-[10px] uppercase block">Mean Impact Extrusion</span>
          <span className="text-lg font-bold text-[#C5A059]">
            {aggregateStats.avgScore}/100 Relative Index
          </span>
        </div>
        <div className="p-3 bg-black/40 rounded border border-[#F5F5F0]/10 space-y-0.5">
          <span className="text-[#F5F5F0]/50 text-[10px] uppercase block">Active Spatial H3 Nodes</span>
          <span className="text-lg font-bold text-cyan-300 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            {MOCK_STEWARDSHIP_HEX_DATA.length} Verified Hexes
          </span>
        </div>
      </div>

      {/* Domain Filter Pills & Sliders */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-black/50 border border-[#F5F5F0]/10 rounded-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 mr-1">Domain:</span>
          {[
            { id: 'all', label: 'All Hexes' },
            { id: 'hydrology', label: 'Hydrology (Cyan)', icon: Droplets },
            { id: 'canopy', label: 'Canopy (Green)', icon: TreeDeciduous },
            { id: 'soil', label: 'Soil & Carbon (Gold)', icon: Sparkles },
            { id: 'hazard', label: 'Hazard Shield (Rose)', icon: Flame }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => {
                audioFeedback.playMicroTick();
                setActiveDomain(d.id as ImpactDomain);
              }}
              className={`px-2.5 py-1 rounded-sm text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
                activeDomain === d.id
                  ? 'bg-[#1B3022] text-[#F5F5F0] border border-[#C5A059] shadow-sm'
                  : 'bg-[#111] text-[#F5F5F0]/60 hover:text-white border border-[#F5F5F0]/5'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* 3D Extrusion Height Slider */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#F5F5F0]/70 w-full sm:w-auto">
          <Sliders className="w-3 h-3 text-[#C5A059]" />
          <span className="text-[10px] uppercase">3D Extrusion:</span>
          <input
            type="range"
            min="0.4"
            max="2.0"
            step="0.1"
            value={extrusionMultiplier}
            onChange={(e) => setExtrusionMultiplier(parseFloat(e.target.value))}
            className="w-24 accent-[#C5A059] cursor-pointer"
          />
          <span className="text-[10px] text-emerald-400 font-bold">{extrusionMultiplier.toFixed(1)}x</span>
        </div>
      </div>

      {/* Main Interactive 3D Stage & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Isometric Hex Canvas Stage (2 Cols) */}
        <div className="lg:col-span-2 p-4 rounded-sm bg-[#060807] border border-[#F5F5F0]/15 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          {/* Canvas Viewport */}
          <div className="w-full h-[400px] sm:h-[460px] flex items-center justify-center relative">
            <svg
              className="w-full h-full cursor-grab active:cursor-grabbing overflow-visible select-none"
              viewBox="-380 -260 760 520"
            >
              <defs>
                <filter id="hex-ambient-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Origin Center Ring */}
              <circle cx="0" cy="0" r="160" fill="none" stroke="rgba(245,245,240,0.06)" strokeDasharray="3 3" />
              <circle cx="0" cy="0" r="280" fill="none" stroke="rgba(245,245,240,0.04)" strokeDasharray="4 4" />

              {/* Group with 3D isometric transformation */}
              <g
                style={{
                  transform: viewMode === '3D_ISOMETRIC'
                    ? `perspective(800px) rotateX(${tiltAngle}deg) rotateZ(${rotationAngle}deg)`
                    : 'none',
                  transformOrigin: 'center center',
                  transition: 'transform 0.4s ease-out'
                }}
              >
                {/* Render sorted by depth (back to front for 3D occlusion) */}
                {[...filteredHexes]
                  .sort((a, b) => {
                    // Sort order according to isometric projection to prevent z-fighting
                    const ca = getHexCenter(a.q, a.r);
                    const cb = getHexCenter(b.q, b.r);
                    return (ca.y - cb.y) || (ca.x - cb.x);
                  })
                  .map((hex) => {
                    const isSelected = selectedHex.id === hex.id;
                    const center = getHexCenter(hex.q, hex.r);
                    const colors = getDomainColors(hex.domain, hex.impactScore);

                    // 3D extrusion height in pixels
                    const extrusionH = viewMode === '3D_ISOMETRIC'
                      ? Math.max(12, (hex.impactScore * 0.7) * extrusionMultiplier)
                      : 0;

                    // Base 2D vertices
                    const baseVertices = getHexVertices(center.x, center.y, hexRadius);
                    // Top elevated vertices (lifted upwards along negative Y in SVG space)
                    const topVertices = getHexVertices(center.x, center.y - extrusionH, hexRadius);

                    const topPointsString = topVertices.map(pt => pt.join(',')).join(' ');

                    // Hexagon vertices indices:
                    // 0: right (30 deg), 1: bottom-right (90 deg), 2: bottom-left (150 deg)
                    // 3: left (210 deg), 4: top-left (270 deg), 5: top-right (330 deg)
                    // Side faces visible in standard isometric view:
                    // Face 1 (bottom-left): topVertices[2], topVertices[1], baseVertices[1], baseVertices[2]
                    // Face 2 (bottom-right): topVertices[1], topVertices[0], baseVertices[0], baseVertices[1]
                    // Face 3 (left): topVertices[3], topVertices[2], baseVertices[2], baseVertices[3]
                    const leftFacePoints = [
                      topVertices[2], topVertices[1], baseVertices[1], baseVertices[2]
                    ].map(pt => pt.join(',')).join(' ');

                    const rightFacePoints = [
                      topVertices[1], topVertices[0], baseVertices[0], baseVertices[1]
                    ].map(pt => pt.join(',')).join(' ');

                    return (
                      <g
                        key={hex.id}
                        className="cursor-pointer group transition-all"
                        onClick={() => handleHexClick(hex)}
                      >
                        {/* 3D Column Left Side Face */}
                        {extrusionH > 0 && (
                          <polygon
                            points={leftFacePoints}
                            fill={colors.sideLeft}
                            stroke={colors.stroke}
                            strokeWidth={isSelected ? 1.5 : 0.4}
                            strokeOpacity={0.6}
                          />
                        )}

                        {/* 3D Column Right Side Face */}
                        {extrusionH > 0 && (
                          <polygon
                            points={rightFacePoints}
                            fill={colors.sideRight}
                            stroke={colors.stroke}
                            strokeWidth={isSelected ? 1.5 : 0.4}
                            strokeOpacity={0.6}
                          />
                        )}

                        {/* 3D Top Cap Hexagon */}
                        <polygon
                          points={topPointsString}
                          fill={isSelected ? colors.topHighlight : colors.top}
                          stroke={isSelected ? '#FFFFFF' : colors.stroke}
                          strokeWidth={isSelected ? 2.5 : 1}
                          opacity={isSelected ? 1 : 0.9}
                          filter={isSelected ? 'url(#hex-ambient-glow)' : undefined}
                          className="transition-colors group-hover:brightness-125"
                        />

                        {/* Center Icon or Metric Height Text on top cap */}
                        <text
                          x={center.x}
                          y={center.y - extrusionH + 4}
                          textAnchor="middle"
                          fill="#000000"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                          pointerEvents="none"
                        >
                          {hex.impactScore}
                        </text>

                        {/* Selection Ping Indicator */}
                        {isSelected && (
                          <circle
                            cx={center.x}
                            cy={center.y - extrusionH}
                            r={hexRadius + 4}
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                            strokeDasharray="4 2"
                            className="animate-spin"
                            style={{ transformOrigin: `${center.x}px ${center.y - extrusionH}px` }}
                          />
                        )}
                      </g>
                    );
                  })}
              </g>
            </svg>

            {/* Bottom floating helper */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50 px-2 py-1 bg-black/70 backdrop-blur-sm rounded border border-[#F5F5F0]/10">
              <span>Click any 3D hex column to inspect telemetry & verified ZKP proof</span>
              <span className="text-[#C5A059]">{filteredHexes.length} Columns Rendered</span>
            </div>
          </div>
        </div>

        {/* Selected Hexagon Telemetry Inspector (1 Col) */}
        <div className="p-5 rounded-sm bg-[#0C100D] border border-[#F5F5F0]/15 flex flex-col justify-between space-y-4 shadow-xl">
          {selectedHex ? (
            (() => {
              const colors = getDomainColors(selectedHex.domain, selectedHex.impactScore);

              return (
                <div className="space-y-4 flex-1">
                  {/* Card Header */}
                  <div className="border-b border-[#F5F5F0]/10 pb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span 
                        className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1"
                        style={{
                          backgroundColor: `${colors.top}20`,
                          color: colors.top,
                          border: `1px solid ${colors.top}50`
                        }}
                      >
                        <Hexagon className="w-3 h-3" />
                        {selectedHex.domain.toUpperCase()} SECTOR
                      </span>

                      <span className="text-[9px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">
                        {selectedHex.contributionCount} Logged Interventions
                      </span>
                    </div>

                    <h4 className="text-lg font-serif font-bold text-white leading-tight">
                      {selectedHex.name}
                    </h4>
                    <div className="text-[11px] font-mono text-[#F5F5F0]/60 mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#C5A059]" />
                      <span>{selectedHex.region}</span>
                      <span className="text-[#F5F5F0]/30">•</span>
                      <span>H3 Grid [{selectedHex.q}, {selectedHex.r}]</span>
                    </div>
                  </div>

                  {/* 3D Extrusion Height & Metric Highlight */}
                  <div className="p-3.5 rounded bg-black/60 border border-[#F5F5F0]/10 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#F5F5F0]/60">Volumetric Impact Index:</span>
                      <span className="text-xl font-bold font-mono" style={{ color: colors.top }}>
                        {selectedHex.impactScore}/100
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${selectedHex.impactScore}%`,
                          backgroundColor: colors.top
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 rounded bg-[#111] border border-[#F5F5F0]/5">
                        <span className="text-[9px] font-mono text-[#F5F5F0]/50 block uppercase">Primary Metric</span>
                        <span className="text-xs font-mono font-bold text-white truncate block">{selectedHex.primaryMetric}</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">{selectedHex.metricValue}</span>
                      </div>
                      <div className="p-2 rounded bg-[#111] border border-[#F5F5F0]/5">
                        <span className="text-[9px] font-mono text-[#F5F5F0]/50 block uppercase">Restored Area</span>
                        <span className="text-xs font-mono font-bold text-[#C5A059] block mt-1">{selectedHex.verifiedHectares} Hectares</span>
                      </div>
                    </div>
                  </div>

                  {/* Citizen Role & Verification Proof */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2.5 rounded bg-black/40 border border-[#F5F5F0]/10 flex items-center justify-between">
                      <span className="text-[#F5F5F0]/60">Steward Role:</span>
                      <span className="text-[#F5F5F0] font-bold">{selectedHex.citizenRole}</span>
                    </div>

                    <div className="p-2.5 rounded bg-black/40 border border-[#F5F5F0]/10 flex items-center justify-between">
                      <span className="text-[#F5F5F0]/60">Last Verified:</span>
                      <span className="text-emerald-400 font-bold">{selectedHex.lastVerifiedDate}</span>
                    </div>

                    <div className="p-2.5 rounded bg-black/40 border border-[#F5F5F0]/10 space-y-1">
                      <span className="text-[10px] text-[#F5F5F0]/50 uppercase block">Orbital Satellite Cross-Check:</span>
                      <div className="text-[11px] text-cyan-300 flex items-center gap-1.5 font-sans">
                        <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{selectedHex.satelliteAttestation}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-black/40 border border-[#F5F5F0]/10 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#F5F5F0]/50 uppercase">
                        <span>Merkle Cryptographic Root:</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          ZKP Verified
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#C5A059] truncate bg-black/80 px-2 py-1 rounded">
                        {selectedHex.merkleProof}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 border-t border-[#F5F5F0]/10">
                    <button
                      onClick={() => {
                        audioFeedback.playSuccessChime();
                        window.dispatchEvent(new CustomEvent('atlas-inspect-merkle', {
                          detail: { hex: selectedHex }
                        }));
                      }}
                      className="w-full py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Inspect ZKP Merkle Proof</span>
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-mono text-[#F5F5F0]/40">
              Select any 3D hexagonal prism to inspect verified ecological telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
