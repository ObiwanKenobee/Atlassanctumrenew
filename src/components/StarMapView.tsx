import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  X, 
  Compass, 
  Eye, 
  Navigation as NavIcon, 
  Globe2, 
  Layers, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { PageView } from '../types';
import { audioFeedback } from '../lib/audioFeedback';

interface StarProject {
  id: string;
  name: string;
  constellation: string;
  constellationColor: string;
  coordinates: { x: number; y: number }; // 0 to 100 relative celestial plane
  stellarMagnitude: number; // 1 to 5 (size & brightness)
  verifiedHectares: string;
  primaryMetric: string;
  status: 'VERIFIED_ON_CHAIN' | 'PROVEN_AUTONOMOUS';
  targetTab: PageView;
  lore: string;
  zkHash: string;
}

interface ConstellationLine {
  fromId: string;
  toId: string;
  constellation: string;
  color: string;
}

const CELESTIAL_PROJECTS: StarProject[] = [
  // Constellation: Hydra Aquifera (The Aquifer Serpent)
  {
    id: 'star-mara',
    name: 'Alpha Mara: Basalt Infiltration Deep Core',
    constellation: 'Hydra Aquifera',
    constellationColor: '#38BDF8',
    coordinates: { x: 22, y: 32 },
    stellarMagnitude: 4.8,
    verifiedHectares: '142,000 ha',
    primaryMetric: '18.4M m³ Deep Sponge Retention',
    status: 'VERIFIED_ON_CHAIN',
    targetTab: 'bioregional-twin',
    lore: 'Anchoring the Great Mara basin, this aquifer sponge captures torrential cloudbursts and sinks them through subterranean volcanic basalt, replenishing centuries of groundwater.',
    zkHash: '0x7f2a...91ce'
  },
  {
    id: 'star-aberdare-water',
    name: 'Beta Aberdare: Cloud Forest Catchment',
    constellation: 'Hydra Aquifera',
    constellationColor: '#38BDF8',
    coordinates: { x: 30, y: 24 },
    stellarMagnitude: 4.2,
    verifiedHectares: '86,400 ha',
    primaryMetric: '99.4% Infiltration Purity',
    status: 'VERIFIED_ON_CHAIN',
    targetTab: 'observatory',
    lore: 'The mist-shrouded bamboo and podocarpus trees intercept high-altitude moisture, gravity-feeding clean water down to two million agrarian stewards.',
    zkHash: '0x3c1b...88aa'
  },
  {
    id: 'star-mau',
    name: 'Gamma Mau: Subterranean Basin Spine',
    constellation: 'Hydra Aquifera',
    constellationColor: '#38BDF8',
    coordinates: { x: 16, y: 44 },
    stellarMagnitude: 3.9,
    verifiedHectares: '110,000 ha',
    primaryMetric: '78.2 cm/hr Infiltration Rate',
    status: 'VERIFIED_ON_CHAIN',
    targetTab: 'impact-dashboard',
    lore: 'The primary water tower of East Africa, breathing moisture across the continental divide and feeding twelve perennial rivers.',
    zkHash: '0x99e2...bb41'
  },
  {
    id: 'star-tsavo-sand',
    name: 'Delta Tsavo: Sub-surface Sand Dam Mesh',
    constellation: 'Hydra Aquifera',
    constellationColor: '#38BDF8',
    coordinates: { x: 28, y: 52 },
    stellarMagnitude: 3.6,
    verifiedHectares: '46,000 ha',
    primaryMetric: '14.2M Liters Seasonal Storage',
    status: 'VERIFIED_ON_CHAIN',
    targetTab: 'field-labs',
    lore: 'Engineered seasonal dry riverbeds transformed into porous sand vaults that prevent evaporation and provide dry-season oasis springs.',
    zkHash: '0x55aa...11dd'
  },

  // Constellation: Phoenix Solaris (The Solar Phoenix)
  {
    id: 'star-kilifi',
    name: 'Alpha Kilifi: Coastal Solar Commons',
    constellation: 'Phoenix Solaris',
    constellationColor: '#F59E0B',
    coordinates: { x: 74, y: 28 },
    stellarMagnitude: 4.9,
    verifiedHectares: '32,000 ha',
    primaryMetric: '1.42 MW Decentralized P2P Flux',
    status: 'VERIFIED_ON_CHAIN',
    targetTab: 'commons',
    lore: 'A cooperative solar microgrid managed by local women elders, clearing decentralized kilowatt-hours at zero extractive mark-up.',
    zkHash: '0x6e4d...00fa'
  },
  {
    id: 'star-turkana',
    name: 'Beta Turkana: Wind-Solar Hyper-Array',
    constellation: 'Phoenix Solaris',
    constellationColor: '#F59E0B',
    coordinates: { x: 82, y: 18 },
    stellarMagnitude: 4.4,
    verifiedHectares: '65,000 ha',
    primaryMetric: '310 kW Zero-Emission Capacity',
    status: 'VERIFIED_ON_CHAIN',
    targetTab: 'industrial',
    lore: 'Harnessing the continuous equatorial gale over the desert lake, turning harsh solar radiation into regenerative communal wealth.',
    zkHash: '0x12c4...77ba'
  },
  {
    id: 'star-rift-geo',
    name: 'Gamma Rift: Thermal Basalt Exchange',
    constellation: 'Phoenix Solaris',
    constellationColor: '#F59E0B',
    coordinates: { x: 68, y: 40 },
    stellarMagnitude: 4.1,
    verifiedHectares: '28,500 ha',
    primaryMetric: '99.8% Basalt Heat Stability',
    status: 'VERIFIED_ON_CHAIN',
    targetTab: 'impact-dashboard',
    lore: 'Direct geothermal energy balancing seasonal intermittency without combustion or toxic tailings.',
    zkHash: '0x44bb...99cc'
  },

  // Constellation: Arbor Vitae (The Living Canopy)
  {
    id: 'star-mt-kenya',
    name: 'Alpha Kirinyaga: Indigenous Cloud Forest Spine',
    constellation: 'Arbor Vitae',
    constellationColor: '#10B981',
    coordinates: { x: 48, y: 62 },
    stellarMagnitude: 5.0,
    verifiedHectares: '210,000 ha',
    primaryMetric: '1.24M tCO2e Sequestered',
    status: 'VERIFIED_ON_CHAIN',
    targetTab: 'regenerative-mission',
    lore: 'Sacred mountain perimeter restored with forty endemic hardwood species, restoring rain patterns to the entire eastern plain.',
    zkHash: '0x88fe...33aa'
  },
  {
    id: 'star-kakamega',
    name: 'Beta Kakamega: Primary Guineo-Congolian Canopy',
    constellation: 'Arbor Vitae',
    constellationColor: '#10B981',
    coordinates: { x: 38, y: 72 },
    stellarMagnitude: 4.3,
    verifiedHectares: '23,000 ha',
    primaryMetric: '380+ Avian Species Acoustic Health',
    status: 'VERIFIED_ON_CHAIN',
    targetTab: 'observatory',
    lore: 'The easternmost relict of the ancient equatorial rainforest, pulsing with bioacoustic richness documented continuously by solar microphones.',
    zkHash: '0xaa12...ef89'
  },
  {
    id: 'star-sokoke',
    name: 'Gamma Sokoke: Arabuko Coastal Brachystegia',
    constellation: 'Arbor Vitae',
    constellationColor: '#10B981',
    coordinates: { x: 58, y: 74 },
    stellarMagnitude: 4.0,
    verifiedHectares: '42,000 ha',
    primaryMetric: '96.2% Canopy Density Index',
    status: 'VERIFIED_ON_CHAIN',
    targetTab: 'stories',
    lore: 'A sanctuary of elephant shrews and rare owls, protected by community butterfly farming and indigenous forest guardians.',
    zkHash: '0x22db...78cc'
  },

  // Constellation: Corona Mycelia (The Mycelial Crown)
  {
    id: 'star-laikipia',
    name: 'Alpha Laikipia: Soil Organic Carbon Vault',
    constellation: 'Corona Mycelia',
    constellationColor: '#C5A059',
    coordinates: { x: 44, y: 22 },
    stellarMagnitude: 4.7,
    verifiedHectares: '180,000 ha',
    primaryMetric: '4.82% Soil Organic Carbon',
    status: 'VERIFIED_ON_CHAIN',
    targetTab: 'bioregional-twin',
    lore: 'Rangeland managed through planned holistic grazing, turning compacted red dirt into rich black carbon sponges teeming with mycorrhizae.',
    zkHash: '0xdd43...55ee'
  },
  {
    id: 'star-serengeti',
    name: 'Beta Mara-Serengeti: Transboundary Bio-Corridor',
    constellation: 'Corona Mycelia',
    constellationColor: '#C5A059',
    coordinates: { x: 54, y: 32 },
    stellarMagnitude: 4.6,
    verifiedHectares: '240,000 ha',
    primaryMetric: '1.3M Wildebeest Migration Integrity',
    status: 'VERIFIED_ON_CHAIN',
    targetTab: 'evidence-mapping',
    lore: 'A borderless wildlife commons protected by community land trusts and cryptographic pasture agreements.',
    zkHash: '0x99aa...66ff'
  },

  // Constellation: Crucibulum Aureum (The Alchemical Crucible)
  {
    id: 'star-sanctum',
    name: 'Alpha Alchemia: The Alchemical Sanctum of Transmutation',
    constellation: 'Crucibulum Aureum',
    constellationColor: '#E0C070',
    coordinates: { x: 50, y: 46 },
    stellarMagnitude: 5.2,
    verifiedHectares: 'Cosmic Core',
    primaryMetric: '528 Hz Harmonic Coherence',
    status: 'PROVEN_AUTONOMOUS',
    targetTab: 'alchemical-sanctum',
    lore: 'The contemplative heart where science meets the sacred; where soil, water, and spirit are recognized as one living altar.',
    zkHash: '0xCOVENANT...GOLD'
  },
  {
    id: 'star-ethics',
    name: 'Beta Canon: Ethical Commandments Proof Engine',
    constellation: 'Crucibulum Aureum',
    constellationColor: '#E0C070',
    coordinates: { x: 42, y: 40 },
    stellarMagnitude: 4.5,
    verifiedHectares: 'Canon XXIII',
    primaryMetric: '94.8% Epistemic Inviolability',
    status: 'VERIFIED_ON_CHAIN',
    targetTab: 'ethics-review',
    lore: 'The axiomatic safeguards guaranteeing that no algorithm or market usury can ever violate human flourishing or ecological integrity.',
    zkHash: '0xCANON...XXIII'
  },
  {
    id: 'star-ledger',
    name: 'Gamma Veritas: The Living Epistemic Ledger',
    constellation: 'Crucibulum Aureum',
    constellationColor: '#E0C070',
    coordinates: { x: 58, y: 42 },
    stellarMagnitude: 4.3,
    verifiedHectares: 'Immutable',
    primaryMetric: 'Zero Mock Placeholders',
    status: 'VERIFIED_ON_CHAIN',
    targetTab: 'evidence-ledger',
    lore: 'Cryptographic hash chains recording real soil samples, drone photogrammetry, and water samples with verifiable mathematical truth.',
    zkHash: '0xVERITAS...0001'
  }
];

const CONSTELLATION_LINES: ConstellationLine[] = [
  // Hydra Aquifera
  { fromId: 'star-mara', toId: 'star-aberdare-water', constellation: 'Hydra Aquifera', color: 'rgba(56, 189, 248, 0.45)' },
  { fromId: 'star-mara', toId: 'star-mau', constellation: 'Hydra Aquifera', color: 'rgba(56, 189, 248, 0.45)' },
  { fromId: 'star-mara', toId: 'star-tsavo-sand', constellation: 'Hydra Aquifera', color: 'rgba(56, 189, 248, 0.45)' },

  // Phoenix Solaris
  { fromId: 'star-kilifi', toId: 'star-turkana', constellation: 'Phoenix Solaris', color: 'rgba(245, 158, 11, 0.45)' },
  { fromId: 'star-kilifi', toId: 'star-rift-geo', constellation: 'Phoenix Solaris', color: 'rgba(245, 158, 11, 0.45)' },

  // Arbor Vitae
  { fromId: 'star-mt-kenya', toId: 'star-kakamega', constellation: 'Arbor Vitae', color: 'rgba(16, 185, 129, 0.45)' },
  { fromId: 'star-mt-kenya', toId: 'star-sokoke', constellation: 'Arbor Vitae', color: 'rgba(16, 185, 129, 0.45)' },

  // Corona Mycelia
  { fromId: 'star-laikipia', toId: 'star-serengeti', constellation: 'Corona Mycelia', color: 'rgba(197, 160, 89, 0.45)' },

  // Crucibulum Aureum (Central Sanctum)
  { fromId: 'star-sanctum', toId: 'star-ethics', constellation: 'Crucibulum Aureum', color: 'rgba(224, 192, 112, 0.65)' },
  { fromId: 'star-sanctum', toId: 'star-ledger', constellation: 'Crucibulum Aureum', color: 'rgba(224, 192, 112, 0.65)' },
  { fromId: 'star-sanctum', toId: 'star-mt-kenya', constellation: 'Crucibulum Aureum', color: 'rgba(197, 160, 89, 0.3)' },
  { fromId: 'star-sanctum', toId: 'star-mara', constellation: 'Crucibulum Aureum', color: 'rgba(56, 189, 248, 0.3)' }
];

interface StarMapViewProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: PageView) => void;
}

export const StarMapView: React.FC<StarMapViewProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [selectedStar, setSelectedStar] = useState<StarProject | null>(null);
  const [hoveredStar, setHoveredStar] = useState<StarProject | null>(null);
  const [selectedConstellation, setSelectedConstellation] = useState<string | 'ALL'>('ALL');
  const [showLines, setShowLines] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Keyboard shortcut listener for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle celestial sound chime when selecting a star
  const handleSelectStar = (star: StarProject) => {
    setSelectedStar(star);
    if (isAudioEnabled) {
      audioFeedback.playCovenantResonance();
    }
  };

  const constellationsList = useMemo(() => {
    const set = new Set<string>();
    CELESTIAL_PROJECTS.forEach(p => set.add(p.constellation));
    return Array.from(set);
  }, []);

  const filteredStars = useMemo(() => {
    if (selectedConstellation === 'ALL') return CELESTIAL_PROJECTS;
    return CELESTIAL_PROJECTS.filter(s => s.constellation === selectedConstellation);
  }, [selectedConstellation]);

  const filteredLines = useMemo(() => {
    if (!showLines) return [];
    if (selectedConstellation === 'ALL') return CONSTELLATION_LINES;
    return CONSTELLATION_LINES.filter(l => l.constellation === selectedConstellation);
  }, [showLines, selectedConstellation]);

  if (!isOpen) return null;

  return (
    <div 
      id="star-map-celestial-observer"
      className="fixed inset-0 z-[10000] bg-[#030305] text-[#F5F5F0] flex flex-col select-none overflow-hidden animate-fadeIn"
    >
      {/* Dynamic Cosmic Background with Nebular Glows */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Nebular clouds */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-950/20 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[32rem] h-[32rem] rounded-full bg-amber-950/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-emerald-950/15 blur-3xl" />

        {/* Ambient Stardust Field */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)),
                              radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
                              radial-gradient(1.5px 1.5px at 90px 40px, #C5A059, rgba(0,0,0,0)),
                              radial-gradient(1px 1px at 160px 120px, #ddd, rgba(0,0,0,0))`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px'
          }}
        />
      </div>

      {/* Top Celestial Navigation Bar */}
      <header className="relative z-20 flex items-center justify-between px-5 py-3.5 border-b border-[#C5A059]/20 bg-[#070709]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/50 flex items-center justify-center text-[#C5A059] shadow-[0_0_12px_rgba(197,160,89,0.35)]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-serif font-bold text-[#F5F5F0] tracking-wider uppercase">
                Atlas Celestial Star Map
              </h2>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
                Celestial Observer Mode
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#F5F5F0]/50">
              Constellations of Active, Verified Planetary Impact Projects • Press <kbd className="text-[#C5A059] font-bold">ESC</kbd> to Return
            </p>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {/* Constellation Filter Dropdown */}
          <div className="hidden md:flex items-center gap-1 bg-[#121216] border border-[#F5F5F0]/15 rounded-md p-1">
            <button
              onClick={() => setSelectedConstellation('ALL')}
              className={`px-2 py-1 rounded text-[10px] transition-colors cursor-pointer ${
                selectedConstellation === 'ALL' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              All Constellations
            </button>
            {constellationsList.map(c => (
              <button
                key={c}
                onClick={() => setSelectedConstellation(c)}
                className={`px-2 py-1 rounded text-[10px] transition-colors cursor-pointer ${
                  selectedConstellation === c ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-white'
                }`}
              >
                {c.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Toggle Lines & Labels */}
          <button
            onClick={() => setShowLines(!showLines)}
            className={`px-2 py-1 rounded border text-[10px] transition-colors cursor-pointer ${
              showLines ? 'bg-[#1B3022] border-[#C5A059]/50 text-[#C5A059]' : 'bg-[#121216] border-white/10 text-white/50'
            }`}
            title="Toggle Constellation Geometries"
          >
            Lines: {showLines ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2 py-1 rounded border text-[10px] transition-colors cursor-pointer ${
              showLabels ? 'bg-[#1B3022] border-[#C5A059]/50 text-[#C5A059]' : 'bg-[#121216] border-white/10 text-white/50'
            }`}
            title="Toggle Stellar Identifiers"
          >
            Labels: {showLabels ? 'ON' : 'OFF'}
          </button>

          {/* Audio Toggle */}
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className="p-1.5 rounded bg-[#121216] border border-white/10 text-white/70 hover:text-[#C5A059] transition-colors"
            title={isAudioEnabled ? 'Mute Celestial Harmonics' : 'Enable Celestial Harmonics'}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-[#C5A059]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Close / Descend Button */}
          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A22] hover:bg-[#252530] border border-[#C5A059]/50 text-[#C5A059] rounded-md font-bold transition-all cursor-pointer shadow-lg"
          >
            <span>Descend to Earth</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Interactive Celestial Chart Canvas */}
      <div 
        ref={containerRef}
        className="relative flex-1 w-full h-full overflow-hidden cursor-crosshair"
      >
        {/* SVG Constellation Vectors & Grid */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Celestial Coordinate Grid Lines (Right Ascension & Declination) */}
          <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.15">
            <line x1="10" y1="0" x2="10" y2="100" />
            <line x1="30" y1="0" x2="30" y2="100" />
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="70" y1="0" x2="70" y2="100" />
            <line x1="90" y1="0" x2="90" y2="100" />

            <line x1="0" y1="20" x2="100" y2="20" />
            <line x1="0" y1="40" x2="100" y2="40" />
            <line x1="0" y1="60" x2="100" y2="60" />
            <line x1="0" y1="80" x2="100" y2="80" />

            {/* Equator & Prime Celestial Meridian */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(197, 160, 89, 0.12)" strokeWidth="0.25" strokeDasharray="1, 1" />
            <circle cx="50" cy="50" r="24" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="0.2" strokeDasharray="1, 2" />
          </g>

          {/* Constellation Connecting Vectors */}
          {filteredLines.map((line, idx) => {
            const from = CELESTIAL_PROJECTS.find(s => s.id === line.fromId);
            const to = CELESTIAL_PROJECTS.find(s => s.id === line.toId);
            if (!from || !to) return null;

            return (
              <line
                key={idx}
                x1={from.coordinates.x}
                y1={from.coordinates.y}
                x2={to.coordinates.x}
                y2={to.coordinates.y}
                stroke={line.color}
                strokeWidth="0.35"
                strokeDasharray="0.8, 0.8"
                className="transition-all duration-700"
              />
            );
          })}
        </svg>

        {/* Render Star Nodes */}
        {filteredStars.map((star) => {
          const isSelected = selectedStar?.id === star.id;
          const isHovered = hoveredStar?.id === star.id;
          const starSizePx = (star.stellarMagnitude * 4) + (isHovered ? 4 : 0);

          return (
            <div
              key={star.id}
              style={{
                left: `${star.coordinates.x}%`,
                top: `${star.coordinates.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute z-10 cursor-pointer group"
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              onClick={() => handleSelectStar(star)}
            >
              {/* Outer Pulsing Halo */}
              <div 
                className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-40"
                style={{
                  width: `${starSizePx * 2}px`,
                  height: `${starSizePx * 2}px`,
                  backgroundColor: star.constellationColor,
                  left: `-${starSizePx / 2}px`,
                  top: `-${starSizePx / 2}px`
                }}
              />

              {/* Luminous Star Core */}
              <div 
                className={`rounded-full transition-all duration-300 relative flex items-center justify-center ${
                  isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-125' : ''
                }`}
                style={{
                  width: `${starSizePx}px`,
                  height: `${starSizePx}px`,
                  backgroundColor: star.constellationColor,
                  boxShadow: `0 0 16px ${star.constellationColor}, 0 0 24px rgba(224, 242, 254, 0.8)`
                }}
              >
                {/* 4-Point Starlight Diamond Sparkle */}
                <div 
                  className="absolute w-[200%] h-[200%] pointer-events-none opacity-80"
                  style={{
                    background: `radial-gradient(circle, ${star.constellationColor} 10%, transparent 70%)`
                  }}
                />
              </div>

              {/* Star Label */}
              {showLabels && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none transition-all group-hover:scale-105">
                  <div className="text-[10px] font-mono font-bold tracking-tight text-[#F5F5F0] bg-[#0A0A0A]/85 px-1.5 py-0.5 rounded border border-[#F5F5F0]/15 shadow-md flex items-center gap-1">
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: star.constellationColor }}
                    />
                    <span>{star.name.split(':')[0]}</span>
                  </div>
                  <div className="text-[8px] font-mono text-[#F5F5F0]/50 pl-1">
                    {star.primaryMetric}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Hover Crosshair HUD Tooltip */}
        {hoveredStar && !selectedStar && (
          <div 
            className="absolute z-30 pointer-events-none bg-[#0D0D12]/95 border border-[#C5A059]/40 p-3 rounded-lg shadow-2xl max-w-xs backdrop-blur-md transition-all duration-200"
            style={{
              left: `${Math.min(78, Math.max(5, hoveredStar.coordinates.x + 3))}%`,
              top: `${Math.min(75, Math.max(5, hoveredStar.coordinates.y + 3))}%`
            }}
          >
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-[#C5A059] mb-1">
              <Compass className="w-3 h-3" />
              <span>{hoveredStar.constellation}</span>
            </div>
            <h4 className="text-xs font-serif font-bold text-[#F5F5F0] mb-1">
              {hoveredStar.name}
            </h4>
            <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">
              {hoveredStar.primaryMetric}
            </div>
            <p className="text-[10px] text-[#F5F5F0]/70 font-sans line-clamp-2 mb-2">
              {hoveredStar.lore}
            </p>
            <div className="flex items-center justify-between text-[8px] font-mono text-[#F5F5F0]/40 border-t border-white/10 pt-1">
              <span>Hectares: {hoveredStar.verifiedHectares}</span>
              <span className="text-[#C5A059]">Click to inspect & teleport</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Star Celestial Dossier Drawer (Docked at Bottom or Side) */}
      {selectedStar && (
        <div 
          id="celestial-star-dossier"
          className="relative z-30 bg-[#0A0A0F]/95 border-t border-[#C5A059]/40 p-4 sm:p-5 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-slideUp"
        >
          <div className="flex items-start gap-3.5 max-w-3xl">
            <div 
              className="w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 shadow-lg"
              style={{
                backgroundColor: `${selectedStar.constellationColor}15`,
                borderColor: `${selectedStar.constellationColor}60`,
                color: selectedStar.constellationColor
              }}
            >
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[#C5A059]">
                  {selectedStar.constellation}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{selectedStar.status}</span>
                </span>
                <span className="text-[9px] font-mono text-[#F5F5F0]/40">
                  ZK Proof: {selectedStar.zkHash}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-serif font-bold text-[#F5F5F0]">
                {selectedStar.name}
              </h3>

              <p className="text-xs text-[#F5F5F0]/80 font-sans mt-1 leading-relaxed">
                {selectedStar.lore}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-mono">
                <div>
                  <span className="text-[#F5F5F0]/50">Coverage: </span>
                  <span className="text-[#F5F5F0] font-bold">{selectedStar.verifiedHectares}</span>
                </div>
                <div>
                  <span className="text-[#F5F5F0]/50">Verified Metric: </span>
                  <span className="text-[#C5A059] font-bold">{selectedStar.primaryMetric}</span>
                </div>
                <div>
                  <span className="text-[#F5F5F0]/50">Target Module: </span>
                  <span className="text-cyan-300 font-bold uppercase">{selectedStar.targetTab}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Teleport / Descend to View */}
          <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
            <button
              onClick={() => setSelectedStar(null)}
              className="px-3 py-2 bg-[#14141A] hover:bg-[#202028] border border-white/15 text-[#F5F5F0]/70 rounded text-xs font-mono cursor-pointer"
            >
              Deselect
            </button>

            <button
              onClick={() => {
                audioFeedback.playViewTransition();
                onSelectTab(selectedStar.targetTab);
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#1B3022] to-[#254530] hover:from-[#254530] hover:to-[#2F593E] border border-[#C5A059] text-[#C5A059] hover:text-[#F5F5F0] rounded text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)] cursor-pointer"
            >
              <NavIcon className="w-4 h-4" />
              <span>Teleport to {selectedStar.targetTab.toUpperCase()}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer Orientation Guide */}
      <footer className="relative z-20 px-5 py-2 border-t border-[#F5F5F0]/10 bg-[#070709] flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/40">
        <div className="flex items-center gap-3">
          <span>Stellar Projects: {filteredStars.length} Active</span>
          <span>•</span>
          <span>Celestial Coordinates: 360° Spherical Projection</span>
        </div>
        <div>
          <span>Tip: Click any star to navigate the platform as a celestial observer</span>
        </div>
      </footer>
    </div>
  );
};
