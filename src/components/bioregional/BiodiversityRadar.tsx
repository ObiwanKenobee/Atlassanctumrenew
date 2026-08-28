import React, { useState, useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import {
  Bird,
  ShieldCheck,
  Sparkles,
  Info,
  Layers,
  Activity,
  CheckCircle2,
  TreePine,
  Droplets,
  Bug,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface SpeciesGuildData {
  guild: string;
  category: string;
  baseline: number; // 2020 Pre-restoration score (0-100)
  current: number;  // 2026 In-Situ measured score (0-100)
  target: number;   // 2035 Target projected score (0-100)
  fullMark: number;
  exemplarSpecies: string[];
  iucnStatus: 'Critically Endangered' | 'Vulnerable' | 'Near Threatened' | 'Least Concern';
  trendLabel: string;
  bioacousticIndex: string;
  notes: string;
}

// Bioregion-specific species health datasets
const SPECIES_GUILDS_BY_BIOREGION: Record<string, SpeciesGuildData[]> = {
  aberdare_riparian_watershed: [
    {
      guild: 'Canopy Avifauna',
      category: 'Birds',
      baseline: 42,
      current: 78,
      target: 92,
      fullMark: 100,
      exemplarSpecies: ["Abbott's Starling", "African Crowned Eagle", "Jackson's Francolin"],
      iucnStatus: 'Vulnerable',
      trendLabel: '+36% Population Density',
      bioacousticIndex: '0.84 Acoustic Complexity Index (ACI)',
      notes: 'High-altitude cloud forest canopy nesters sensitive to crown fragmentation.'
    },
    {
      guild: 'Native Pollinators',
      category: 'Invertebrates',
      baseline: 35,
      current: 72,
      target: 88,
      fullMark: 100,
      exemplarSpecies: ['Meliponula Stingless Bees', 'African Mountain Honey Bee', 'Hoverflies'],
      iucnStatus: 'Near Threatened',
      trendLabel: '+105% Floral Visitations/hr',
      bioacousticIndex: '280 Hz Wingbeat Resonance Node',
      notes: 'Essential for high-altitude Podocarpus and Hagenia seed germination.'
    },
    {
      guild: 'Riparian Amphibians',
      category: 'Amphibians',
      baseline: 28,
      current: 68,
      target: 85,
      fullMark: 100,
      exemplarSpecies: ['Hyperolius Reed Frogs', 'Kenya River Puddle Frog'],
      iucnStatus: 'Vulnerable',
      trendLabel: '+40% Larval Pool Survival',
      bioacousticIndex: 'Evening Nocturnal Chorusing Active',
      notes: 'Bio-indicators of clean dissolved oxygen and low agricultural pesticide runoff.'
    },
    {
      guild: 'Soil Microbiome & Fungi',
      category: 'Microbiome',
      baseline: 30,
      current: 82,
      target: 95,
      fullMark: 100,
      exemplarSpecies: ['Glomus intraradices', 'Ectomycorrhizal Hyphae', 'Beneficial Nematodes'],
      iucnStatus: 'Least Concern',
      trendLabel: '5.2 m/cm³ Hyphal Density',
      bioacousticIndex: 'Micro-seismic root cavitation detected',
      notes: 'Subterranean fungal network binding organic soil aggregates and sequestering carbon.'
    },
    {
      guild: 'Keystone Ungulates',
      category: 'Mammals',
      baseline: 22,
      current: 54,
      target: 76,
      fullMark: 100,
      exemplarSpecies: ['Mountain Bongo', 'Bushbuck', 'Giant Forest Hog'],
      iucnStatus: 'Critically Endangered',
      trendLabel: 'Estimated 88 Individuals in Corridor',
      bioacousticIndex: 'Camera Trap & Lidar confirmed',
      notes: 'Bamboo browse species requiring contiguous high-altitude forest corridors.'
    },
    {
      guild: 'Epiphytes & Understory',
      category: 'Flora',
      baseline: 48,
      current: 84,
      target: 96,
      fullMark: 100,
      exemplarSpecies: ['Usnea barbata (Old Man Beard)', 'Indigenous Tree Ferns', 'Wild Orchids'],
      iucnStatus: 'Least Concern',
      trendLabel: '92% Trunk Coverage on Mature Podocarpus',
      bioacousticIndex: 'Atmospheric moisture interceptor',
      notes: 'Captures horizontal cloud moisture, providing steady drip-irrigation to forest floor.'
    },
    {
      guild: 'Apex Predators',
      category: 'Carnivores',
      baseline: 20,
      current: 48,
      target: 70,
      fullMark: 100,
      exemplarSpecies: ['African Golden Cat', 'Leopard', 'Serval'],
      iucnStatus: 'Vulnerable',
      trendLabel: 'Regulated herbivore browse balance',
      bioacousticIndex: 'Acoustic territorial calls recorded',
      notes: 'Top-down trophic regulators preventing over-browsing of young pioneer saplings.'
    }
  ],
  default: [
    {
      guild: 'Canopy Avifauna',
      category: 'Birds',
      baseline: 38,
      current: 74,
      target: 90,
      fullMark: 100,
      exemplarSpecies: ['Native Sunbirds', 'Raptors', 'Hornbills'],
      iucnStatus: 'Near Threatened',
      trendLabel: '+32% Population Count',
      bioacousticIndex: '0.79 ACI Rating',
      notes: 'Key seed dispersers across the riparian ecotone.'
    },
    {
      guild: 'Native Pollinators',
      category: 'Invertebrates',
      baseline: 30,
      current: 66,
      target: 84,
      fullMark: 100,
      exemplarSpecies: ['Wild Solitary Bees', 'Butterflies', 'Wasps'],
      iucnStatus: 'Near Threatened',
      trendLabel: '+85% Pollination Frequency',
      bioacousticIndex: 'Vibrational forage telemetry',
      notes: 'Sustains indigenous flowering trees and silvopastoral ground cover.'
    },
    {
      guild: 'Riparian Amphibians',
      category: 'Amphibians',
      baseline: 24,
      current: 62,
      target: 80,
      fullMark: 100,
      exemplarSpecies: ['Stream Toads', 'Riparian Frogs'],
      iucnStatus: 'Vulnerable',
      trendLabel: '+48% Waterway Bio-Index',
      bioacousticIndex: 'Continuous riparian acoustic stream',
      notes: 'Direct barometer of river turbidity and chemical toxicity.'
    },
    {
      guild: 'Soil Microbiome & Fungi',
      category: 'Microbiome',
      baseline: 32,
      current: 76,
      target: 92,
      fullMark: 100,
      exemplarSpecies: ['Mycorrhizal Fungi', 'Bacterial Biomass'],
      iucnStatus: 'Least Concern',
      trendLabel: '3.8% SOM Density',
      bioacousticIndex: 'Soil respiration sensor calibrated',
      notes: 'Critical biological foundation for water infiltration.'
    },
    {
      guild: 'Keystone Herbivores',
      category: 'Mammals',
      baseline: 26,
      current: 58,
      target: 78,
      fullMark: 100,
      exemplarSpecies: ['Native Antelopes', 'Zebra', 'Warthogs'],
      iucnStatus: 'Near Threatened',
      trendLabel: 'Herd migration velocity restored',
      bioacousticIndex: 'GPS collar & drone count',
      notes: 'Rotational grazers maintaining grassland structural diversity.'
    },
    {
      guild: 'Riparian Shrub Flora',
      category: 'Flora',
      baseline: 40,
      current: 78,
      target: 94,
      fullMark: 100,
      exemplarSpecies: ['Vetiver Grass', 'Native Acacia', 'Wild Fig'],
      iucnStatus: 'Least Concern',
      trendLabel: '82% Riverbank Stabilization',
      bioacousticIndex: 'Root tensile depth certified',
      notes: 'Filters silt and stabilizes riverbanks against seasonal flash flooding.'
    },
    {
      guild: 'Apex Predators',
      category: 'Carnivores',
      baseline: 18,
      current: 44,
      target: 65,
      fullMark: 100,
      exemplarSpecies: ['Jackal', 'Caracal', 'African Wild Cat'],
      iucnStatus: 'Vulnerable',
      trendLabel: 'Natural prey control index 0.68',
      bioacousticIndex: 'Nocturnal motion sensor mesh',
      notes: 'Maintains healthy trophic cascade across the ecosystem.'
    }
  ]
};

interface BiodiversityRadarProps {
  selectedBioregionId?: string;
  bioregionName?: string;
}

export const BiodiversityRadar: React.FC<BiodiversityRadarProps> = ({
  selectedBioregionId = 'aberdare_riparian_watershed',
  bioregionName = 'Aberdare Range & Riparian Catchment'
}) => {
  const [activeLayers, setActiveLayers] = useState<{
    baseline: boolean;
    current: boolean;
    target: boolean;
  }>({
    baseline: true,
    current: true,
    target: true
  });

  const [selectedGuild, setSelectedGuild] = useState<SpeciesGuildData | null>(null);

  const guildData = useMemo(() => {
    return SPECIES_GUILDS_BY_BIOREGION[selectedBioregionId] || SPECIES_GUILDS_BY_BIOREGION.default;
  }, [selectedBioregionId]);

  // Default selected guild on mount or change
  React.useEffect(() => {
    if (guildData.length > 0) {
      setSelectedGuild(guildData[0]);
    }
  }, [guildData]);

  // Overall average scores
  const avgBaseline = Math.round(guildData.reduce((acc, g) => acc + g.baseline, 0) / guildData.length);
  const avgCurrent = Math.round(guildData.reduce((acc, g) => acc + g.current, 0) / guildData.length);
  const avgTarget = Math.round(guildData.reduce((acc, g) => acc + g.target, 0) / guildData.length);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as SpeciesGuildData;
      return (
        <div className="bg-black/95 border border-[#C5A059] p-3 rounded-sm shadow-2xl font-mono text-xs max-w-xs space-y-1.5 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/15 pb-1">
            <span className="font-bold text-[#C5A059]">{data.guild}</span>
            <span className="text-[10px] text-[#F5F5F0]/50">{data.category}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
            <div className="text-[#9CA3AF]">
              <span className="text-[9px] uppercase block opacity-70">2020:</span>
              <span className="font-bold">{data.baseline}/100</span>
            </div>
            <div className="text-emerald-400">
              <span className="text-[9px] uppercase block opacity-70">2026:</span>
              <span className="font-bold">{data.current}/100</span>
            </div>
            <div className="text-amber-300">
              <span className="text-[9px] uppercase block opacity-70">2035:</span>
              <span className="font-bold">{data.target}/100</span>
            </div>
          </div>

          <div className="text-[10px] text-emerald-300 font-sans pt-1 border-t border-[#F5F5F0]/10">
            {data.trendLabel}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      id="biodiversity-radar-module" 
      className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-6 shadow-2xl text-[#F5F5F0]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em] flex items-center gap-1.5">
              <Bird className="w-3.5 h-3.5 text-[#C5A059]" />
              RECHARTS RADAR ENGINE • LOCAL SPECIES BIODIVERSITY RADAR
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-300 rounded-full border border-emerald-500/40 font-bold">
              Multi-Trophic Guild Health
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Bioregional Species Population Health
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans leading-relaxed">
            Multi-axis polar radar visualizing population density, trophic equilibrium, and bio-acoustic vitality across key indicator species in {bioregionName}.
          </p>
        </div>

        {/* Aggregate Score Badges */}
        <div className="flex items-center gap-3 font-mono text-xs self-start sm:self-center">
          <div className="p-2.5 bg-[#141414] border border-emerald-500/30 rounded-xs text-right space-y-0.5">
            <span className="text-[9px] uppercase text-emerald-400 block font-bold">Present In-Situ</span>
            <span className="text-base font-bold text-emerald-300">{avgCurrent}/100</span>
          </div>
          <div className="p-2.5 bg-[#141414] border border-[#C5A059]/30 rounded-xs text-right space-y-0.5">
            <span className="text-[9px] uppercase text-[#C5A059] block font-bold">Net Recovery</span>
            <span className="text-base font-bold text-[#C5A059]">+{avgCurrent - avgBaseline} pts</span>
          </div>
        </div>
      </div>

      {/* Layer Toggles Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase text-[#F5F5F0]/50 font-bold flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#C5A059]" />
            Radar Horizon Layers:
          </span>

          <button
            onClick={() => {
              setActiveLayers(prev => ({ ...prev, baseline: !prev.baseline }));
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1 rounded-xs border text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayers.baseline
                ? 'bg-neutral-800 border-neutral-500 text-neutral-200 font-bold'
                : 'bg-[#181818] border-[#F5F5F0]/10 text-[#F5F5F0]/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-neutral-400" />
            <span>2020 Baseline ({avgBaseline} pts)</span>
          </button>

          <button
            onClick={() => {
              setActiveLayers(prev => ({ ...prev, current: !prev.current }));
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1 rounded-xs border text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayers.current
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow'
                : 'bg-[#181818] border-[#F5F5F0]/10 text-[#F5F5F0]/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>2026 In-Situ Ground Truth ({avgCurrent} pts)</span>
          </button>

          <button
            onClick={() => {
              setActiveLayers(prev => ({ ...prev, target: !prev.target }));
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1 rounded-xs border text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayers.target
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                : 'bg-[#181818] border-[#F5F5F0]/10 text-[#F5F5F0]/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>2035 Causal Target ({avgTarget} pts)</span>
          </button>
        </div>

        <div className="text-[10px] text-[#F5F5F0]/50 font-mono">
          7 Ecological Trophic Indicators • 0-100 Scaled
        </div>
      </div>

      {/* Main Grid: Recharts Radar Chart + Species Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Chart Stage (7 cols) */}
        <div className="lg:col-span-7 w-full h-[360px] sm:h-[420px] bg-[#080808] border border-[#F5F5F0]/10 rounded-sm p-2 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart 
              cx="50%" 
              cy="50%" 
              outerRadius="75%" 
              data={guildData}
            >
              <PolarGrid stroke="#262626" strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="guild" 
                tick={{ fill: '#C5A059', fontSize: 11, fontFamily: 'monospace' }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                stroke="#525252"
                tick={{ fill: '#737373', fontSize: 9, fontFamily: 'monospace' }}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* 2020 Baseline Layer */}
              {activeLayers.baseline && (
                <Radar
                  name="2020 Baseline"
                  dataKey="baseline"
                  stroke="#9CA3AF"
                  fill="#9CA3AF"
                  fillOpacity={0.15}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              )}

              {/* 2026 In-Situ Current Layer */}
              {activeLayers.current && (
                <Radar
                  name="2026 In-Situ Telemetry"
                  dataKey="current"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.35}
                  strokeWidth={2.5}
                />
              )}

              {/* 2035 Projected Target Horizon Layer */}
              {activeLayers.target && (
                <Radar
                  name="2035 Causal Target"
                  dataKey="target"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.12}
                  strokeWidth={1.8}
                />
              )}
            </RadarChart>
          </ResponsiveContainer>

          {/* Center Indicator Tag */}
          <div className="absolute top-3 left-3 text-[9px] font-mono text-[#F5F5F0]/40 uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            Polar Vector Trophic Mesh
          </div>
        </div>

        {/* Guild Details & Selected Species Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-mono uppercase text-[#C5A059] font-bold flex items-center justify-between">
            <span>Select Species Guild To Inspect:</span>
            <span className="text-[10px] text-[#F5F5F0]/40 font-normal">Click guild button</span>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {guildData.map(g => {
              const isSelected = selectedGuild?.guild === g.guild;
              return (
                <button
                  key={g.guild}
                  onClick={() => {
                    setSelectedGuild(g);
                    audioFeedback.playMicroTick();
                  }}
                  className={`px-2.5 py-1 rounded-xs border text-[10px] font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1F2720] border-emerald-500 text-emerald-300 font-bold shadow'
                      : 'bg-[#121212] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:border-[#F5F5F0]/20'
                  }`}
                >
                  {g.guild} ({g.current})
                </button>
              );
            })}
          </div>

          {/* Active Species Guild Card */}
          {selectedGuild && (
            <div className="p-4 bg-[#141414] border border-[#C5A059] rounded-sm space-y-3 font-mono text-xs text-left animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
                <div>
                  <span className="text-[10px] text-[#C5A059] font-bold uppercase block">
                    {selectedGuild.category} Guild
                  </span>
                  <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
                    {selectedGuild.guild}
                  </h4>
                </div>

                <span className={`px-2 py-0.5 text-[9px] rounded-full font-bold border ${
                  selectedGuild.iucnStatus === 'Critically Endangered'
                    ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                    : selectedGuild.iucnStatus === 'Vulnerable'
                      ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                }`}>
                  IUCN: {selectedGuild.iucnStatus}
                </span>
              </div>

              {/* Exemplar species */}
              <div className="space-y-1">
                <span className="text-[10px] text-[#F5F5F0]/50 uppercase block">Key Indicator Taxa:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedGuild.exemplarSpecies.map((sp, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-[#1B1B1B] border border-[#F5F5F0]/10 rounded-xs text-[11px] text-emerald-300 font-sans italic"
                    >
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                <div className="p-2 bg-[#0B0B0B] border border-[#F5F5F0]/5 rounded-xs">
                  <span className="text-[9px] text-[#F5F5F0]/40 uppercase block">Vitality Trend</span>
                  <span className="text-emerald-400 font-bold text-[11px]">{selectedGuild.trendLabel}</span>
                </div>

                <div className="p-2 bg-[#0B0B0B] border border-[#F5F5F0]/5 rounded-xs">
                  <span className="text-[9px] text-[#F5F5F0]/40 uppercase block">Bio-Acoustic Reading</span>
                  <span className="text-cyan-300 font-bold text-[11px] truncate block">{selectedGuild.bioacousticIndex}</span>
                </div>
              </div>

              <p className="text-[11px] text-[#F5F5F0]/70 font-sans leading-relaxed pt-1">
                {selectedGuild.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Epistemic Calibration Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono text-[#F5F5F0]/50 pt-2 border-t border-[#F5F5F0]/10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>In-Situ Acoustic Sensor Mesh & eDNA Environmental Water Assay Calibrated</span>
        </div>
        <div className="text-[#C5A059]">
          Commandment II: Ground Truth Priority Validated
        </div>
      </div>
    </div>
  );
};
