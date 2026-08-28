import React, { useState, useRef } from 'react';
import {
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  TreePine,
  Droplets,
  Bird,
  Layers,
  Users,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Info
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface RestorationMilestone {
  id: string;
  year: number;
  timeLabel: string;
  title: string;
  category: 'Flora' | 'Hydrology' | 'Fauna' | 'Soil' | 'Community' | 'Policy';
  isPredicted: boolean;
  status: 'completed' | 'verified_in_situ' | 'in_progress' | 'projected_p90' | 'projected_p50';
  metricImpact: string;
  description: string;
  bioregionId: string;
  evidenceHash?: string;
  confidenceScore?: number;
  epistemicTier: string;
  verifiedByOrModel: string;
  assumptions?: string[];
}

const BIOREGIONAL_MILESTONES: RestorationMilestone[] = [
  // Historical Milestones
  {
    id: 'ms-2018-01',
    year: 2018,
    timeLabel: 'Q3 2018',
    title: 'Indigenous Seed Bank & Pioneer Nursery Sown',
    category: 'Flora',
    isPredicted: false,
    status: 'completed',
    metricImpact: '45,000 Podocarpus & Hagenia saplings',
    description: 'Community-led collection of high-altitude endemic seed stock establishing nursery nodes along the Aberdare forest boundary.',
    bioregionId: 'aberdare_riparian_watershed',
    evidenceHash: '0x4f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
    confidenceScore: 98,
    epistemicTier: 'Ground Truth Botanical Inventory',
    verifiedByOrModel: 'Aberdare Forest Guardians Council'
  },
  {
    id: 'ms-2020-02',
    year: 2020,
    timeLabel: 'Q1 2020',
    title: 'Mathare River Riparian Bio-Swale Infiltration',
    category: 'Hydrology',
    isPredicted: false,
    status: 'completed',
    metricImpact: '-38% Urban Silt Washout • 120 ha',
    description: 'Initial deployment of bio-engineered vetiver grass terraces and pocket wetlands along urban storm runoff discharge points.',
    bioregionId: 'aberdare_riparian_watershed',
    evidenceHash: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    confidenceScore: 96,
    epistemicTier: 'In-Situ Hydrological Flow Gauges',
    verifiedByOrModel: 'Nairobi River Basin Water Directorate'
  },
  {
    id: 'ms-2022-03',
    year: 2022,
    timeLabel: 'Q4 2022',
    title: 'Mycorrhizal Soil Inoculation & Keyline Terracing',
    category: 'Soil',
    isPredicted: false,
    status: 'completed',
    metricImpact: '+1.4% Soil Organic Matter (SOM)',
    description: 'Deep subterranean inoculation of degraded agricultural soils with indigenous mycorrhizal fungi strains coupled with keyline swales.',
    bioregionId: 'aberdare_riparian_watershed',
    evidenceHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    confidenceScore: 94,
    epistemicTier: 'Empirical Core Sampling Audit',
    verifiedByOrModel: 'Biophysical Soil Laboratory'
  },
  {
    id: 'ms-2024-04',
    year: 2024,
    timeLabel: 'Q2 2024',
    title: 'Acoustic Bio-Richness & Wildlife Corridors Connected',
    category: 'Fauna',
    isPredicted: false,
    status: 'verified_in_situ',
    metricImpact: '84 Native Bird Species • +41% Bio-Acoustic Index',
    description: 'Continuous native floral and shrub canopy link reconnected between upper cloud ridges and lower riverine valleys.',
    bioregionId: 'aberdare_riparian_watershed',
    evidenceHash: '0x99201a4e76110f8234719bbca098234190872615',
    confidenceScore: 93,
    epistemicTier: 'Automated Acoustic Telemetry Node Mesh',
    verifiedByOrModel: 'Bio-Acoustic Sentinel Array'
  },
  {
    id: 'ms-2026-05',
    year: 2026,
    timeLabel: 'Present (2026)',
    title: 'High-Density IoT Sentinel Mesh & Baseline Piezometers',
    category: 'Hydrology',
    isPredicted: false,
    status: 'in_progress',
    metricImpact: '+1.82 bar Aquifer Head Recovery',
    description: 'Comprehensive sensor deployment across subterranean recharge zones, providing real-time telemetry into Atlas Sanctum.',
    bioregionId: 'aberdare_riparian_watershed',
    evidenceHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    confidenceScore: 95,
    epistemicTier: 'Real-Time In-Situ Sensor Mesh',
    verifiedByOrModel: 'Atlas IoT Telemetry Service'
  },
  // Predicted Milestones (Counterfactual / Forward Projections)
  {
    id: 'ms-2028-06',
    year: 2028,
    timeLabel: 'Q4 2028 (Projected)',
    title: 'Multi-Strata Agroforestry Canopy Full Closure',
    category: 'Flora',
    isPredicted: true,
    status: 'projected_p90',
    metricImpact: '72% Crown Density • 1,650 tCO2e/ha',
    description: 'Podocarpus and secondary pioneer species reach early mature canopy layer, triggering micro-climate thermal cooling loops.',
    bioregionId: 'aberdare_riparian_watershed',
    confidenceScore: 89,
    epistemicTier: 'Pearl Structural Causal Model & Monte Carlo P90',
    verifiedByOrModel: 'Causal Synthesis Research Lab',
    assumptions: [
      'Precipitation variance remains within CMIP6 SSP2-4.5 envelope.',
      'Community stewardship adherence maintained above 85%.'
    ]
  },
  {
    id: 'ms-2031-07',
    year: 2031,
    timeLabel: 'Year 5 Horizon (2031)',
    title: 'Aquifer Water Table Hydraulic Normalization',
    category: 'Hydrology',
    isPredicted: true,
    status: 'projected_p90',
    metricImpact: '+2.4 bar Piezometric Head • Subsurface Storage Restored',
    description: 'Subterranean infiltration galleries and retention basins achieve steady hydraulic recharge, restoring natural spring heads.',
    bioregionId: 'aberdare_riparian_watershed',
    confidenceScore: 86,
    epistemicTier: 'Coupled Hydrogeological Groundwater Model',
    verifiedByOrModel: 'Atlas Hydrology AI Kernel',
    assumptions: [
      'Extraction rates do not exceed 1.2M m3/year.',
      'Surface swales maintained biannually.'
    ]
  },
  {
    id: 'ms-2035-08',
    year: 2035,
    timeLabel: 'Q2 2035 (Projected)',
    title: 'Pan-Bioregional Wildlife Flyway Autonomous Equilibrium',
    category: 'Fauna',
    isPredicted: true,
    status: 'projected_p50',
    metricImpact: 'Keystone Bongo & Pollinator Corridors Fully Self-Sustaining',
    description: 'Continuous migration buffer reaches critical ecological mass, enabling natural dispersal without human intervention corridors.',
    bioregionId: 'aberdare_riparian_watershed',
    confidenceScore: 78,
    epistemicTier: 'Agent-Based Ecological Dispersion Simulator',
    verifiedByOrModel: 'Ecological Resilience AI Model',
    assumptions: [
      'Zero land fragmentation across the escarpment easement corridor.',
      'Predator-prey balance stabilized without external cull.'
    ]
  },
  {
    id: 'ms-2041-09',
    year: 2041,
    timeLabel: 'Year 15 Horizon (2041)',
    title: 'Deep Soil Humus Carbon Saturation & Living Sponge',
    category: 'Soil',
    isPredicted: true,
    status: 'projected_p90',
    metricImpact: '5.2% Soil Organic Matter • 18,500 t Total Soil Carbon',
    description: 'Decadal humification cycle achieves steady-state glomalin and subterranean fungal matrix, securing long-term drought resilience.',
    bioregionId: 'aberdare_riparian_watershed',
    confidenceScore: 82,
    epistemicTier: 'RothC Dynamic Soil Carbon Biogeochemical Engine',
    verifiedByOrModel: 'Soil Microbiome Simulation Lab',
    assumptions: [
      'No synthetic chemical inputs or deep mechanical tilling.'
    ]
  },
  {
    id: 'ms-2056-10',
    year: 2056,
    timeLabel: 'Year 30 Horizon (2056)',
    title: 'Self-Generating Climax Bioregion & Atmospheric Micro-Cooling',
    category: 'Flora',
    isPredicted: true,
    status: 'projected_p50',
    metricImpact: '-2.3°C Regional Temperature Buffer • Net Negative Carbon Sink',
    description: 'Complete multi-layered climax ecosystem establishing autonomous precipitation recycling and perpetual natural capital dividends.',
    bioregionId: 'aberdare_riparian_watershed',
    confidenceScore: 74,
    epistemicTier: 'Decadal Earth System Counterfactual Model',
    verifiedByOrModel: 'Planetary Biosphere Synthesis Engine',
    assumptions: [
      'Global atmospheric CO2 does not exceed 550 ppm.',
      'Bioregional legal sovereignty preserved under customary charter.'
    ]
  }
];

interface BioregionalTimelineProps {
  selectedBioregionId?: string;
  bioregionName?: string;
  activeHorizon?: 'year5' | 'year15' | 'year30';
  onSelectMilestone?: (milestone: RestorationMilestone) => void;
}

export const BioregionalTimeline: React.FC<BioregionalTimelineProps> = ({
  selectedBioregionId = 'aberdare_riparian_watershed',
  bioregionName = 'Aberdare Range & Riparian Catchment',
  activeHorizon = 'year15',
  onSelectMilestone
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<RestorationMilestone | null>(
    BIOREGIONAL_MILESTONES.find(m => m.id === 'ms-2026-05') || BIOREGIONAL_MILESTONES[4]
  );
  const [showInspectorModal, setShowInspectorModal] = useState<boolean>(false);

  const filteredMilestones = BIOREGIONAL_MILESTONES.filter(m => {
    if (activeCategoryFilter === 'all') return true;
    return m.category.toLowerCase() === activeCategoryFilter.toLowerCase();
  });

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
      audioFeedback.playMicroTick();
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      audioFeedback.playMicroTick();
    }
  };

  const handleMilestoneClick = (milestone: RestorationMilestone) => {
    setSelectedMilestone(milestone);
    if (onSelectMilestone) onSelectMilestone(milestone);
    audioFeedback.playMicroTick();
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Flora':
        return <TreePine className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Hydrology':
        return <Droplets className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Fauna':
        return <Bird className="w-3.5 h-3.5 text-amber-400" />;
      case 'Soil':
        return <Layers className="w-3.5 h-3.5 text-orange-400" />;
      case 'Community':
        return <Users className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />;
    }
  };

  return (
    <div 
      id="bioregional-timeline-module" 
      className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-6 shadow-2xl text-[#F5F5F0]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              MULTI-TEMPORAL BIOREGIONAL TIMELINE • 2018–2056
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-300 rounded-full border border-emerald-500/40 font-bold">
              Historical + Causal Forward Projection
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Ecological Restoration Trajectory & Milestones
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans leading-relaxed">
            Continuum tracing empirical in-situ soil, canopy, and hydrology interventions from 2018 baseline to Pearl Do-Calculus counterfactual projections through 2056.
          </p>
        </div>

        {/* Scroll Controls & Legend Badges */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="hidden md:flex items-center gap-3 text-[10px] font-mono mr-2">
            <div className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Ground Truth</span>
            </div>
            <div className="flex items-center gap-1 text-[#C5A059]">
              <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
              <span>Present Baseline</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full border border-amber-400" />
              <span>Causal Projection</span>
            </div>
          </div>

          <button
            onClick={scrollLeft}
            className="p-2 bg-[#141414] hover:bg-[#222222] border border-[#F5F5F0]/10 hover:border-[#C5A059]/40 text-[#F5F5F0] rounded-xs transition-colors cursor-pointer"
            title="Scroll Timeline Backward"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 bg-[#141414] hover:bg-[#222222] border border-[#F5F5F0]/10 hover:border-[#C5A059]/40 text-[#F5F5F0] rounded-xs transition-colors cursor-pointer"
            title="Scroll Timeline Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Ribbon */}
      <div className="flex items-center justify-between gap-3 flex-wrap text-xs font-mono">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase text-[#F5F5F0]/40 font-bold mr-1">Milestone Category:</span>
          {['all', 'Flora', 'Hydrology', 'Soil', 'Fauna'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategoryFilter(cat);
                audioFeedback.playMicroTick();
              }}
              className={`px-3 py-1 rounded-xs border text-[11px] transition-all cursor-pointer ${
                activeCategoryFilter === cat
                  ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]'
                  : 'bg-[#121212] text-[#F5F5F0]/60 border-[#F5F5F0]/10 hover:text-[#F5F5F0] hover:border-[#F5F5F0]/25'
              }`}
            >
              {cat === 'all' ? 'All Milestones' : cat}
            </button>
          ))}
        </div>

        <div className="text-[10px] text-[#F5F5F0]/40 font-mono">
          Showing {filteredMilestones.length} milestones • Focus: <span className="text-[#C5A059]">{bioregionName}</span>
        </div>
      </div>

      {/* Horizontal Scrollable Timeline Stage */}
      <div className="relative pt-6 pb-4">
        {/* Horizontal Track Line */}
        <div className="absolute top-[32px] left-0 right-0 h-[2px] bg-[#222222] z-0" />
        
        {/* Present Day Marker Overlay */}
        <div className="absolute top-[18px] left-[48%] z-10 hidden lg:flex flex-col items-center pointer-events-none">
          <span className="px-2 py-0.5 rounded bg-[#C5A059] text-black font-mono text-[9px] font-bold uppercase tracking-wider shadow">
            Present Day (2026)
          </span>
          <div className="w-[1px] h-32 bg-[#C5A059]/40 border-dashed border-l border-[#C5A059]" />
        </div>

        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-6 overflow-x-auto pb-4 pt-4 scrollbar-thin scrollbar-thumb-[#C5A059]/30 scrollbar-track-[#121212] select-none scroll-smooth relative z-10 px-2"
          style={{ scrollSnapType: 'x proximity' }}
        >
          {filteredMilestones.map((ms, idx) => {
            const isSelected = selectedMilestone?.id === ms.id;
            const isPresent = ms.year === 2026;

            return (
              <div
                key={ms.id}
                onClick={() => handleMilestoneClick(ms)}
                className={`min-w-[280px] sm:min-w-[320px] max-w-[320px] rounded-sm p-4 border transition-all cursor-pointer flex flex-col justify-between space-y-3 shrink-0 ${
                  isSelected
                    ? 'bg-[#181818] border-[#C5A059] shadow-xl scale-[1.02] ring-1 ring-[#C5A059]/50'
                    : 'bg-[#101010] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30 hover:bg-[#141414]'
                }`}
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Node Pill / Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        isPresent 
                          ? 'bg-[#C5A059] animate-ping' 
                          : ms.isPredicted 
                            ? 'bg-amber-400/80 border border-amber-300' 
                            : 'bg-emerald-400'
                      }`} />
                      <span className="text-xs font-mono font-bold text-[#F5F5F0]">
                        {ms.timeLabel}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 text-[9px] font-mono uppercase rounded-full border ${
                      ms.isPredicted
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                        : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    }`}>
                      {ms.isPredicted ? 'Projection' : 'Ground Truth'}
                    </span>
                  </div>

                  {/* Category & Title */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#C5A059]">
                      {getCategoryIcon(ms.category)}
                      <span>{ms.category} Protocol</span>
                    </div>
                    <h3 className="text-sm font-serif font-bold text-[#F5F5F0] leading-snug line-clamp-2">
                      {ms.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#F5F5F0]/65 font-sans leading-relaxed line-clamp-2">
                    {ms.description}
                  </p>
                </div>

                {/* Key Impact Metric Badge */}
                <div className="space-y-2 pt-2 border-t border-[#F5F5F0]/10 font-mono">
                  <div className="p-2 bg-[#0A0A0A] rounded-xs border border-[#F5F5F0]/5 flex items-center justify-between">
                    <span className="text-[10px] text-[#F5F5F0]/50 uppercase">Yield / Metric:</span>
                    <span className="text-[11px] font-bold text-emerald-400 truncate max-w-[170px]">
                      {ms.metricImpact}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#F5F5F0]/40">
                    <span>{ms.confidenceScore ? `${ms.confidenceScore}% Certainty` : 'Empirical'}</span>
                    <span className="text-[#C5A059] hover:underline flex items-center gap-0.5">
                      Inspect Details <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Milestone Detailed Inspector Card */}
      {selectedMilestone && (
        <div className="p-5 bg-[#121212] border border-[#C5A059]/60 rounded-sm space-y-4 text-left animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/10 pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-wider">
                  Milestone Inspector • {selectedMilestone.timeLabel} ({selectedMilestone.year})
                </span>
                <span className={`px-2 py-0.5 text-[9px] font-mono rounded-full border font-bold ${
                  selectedMilestone.isPredicted
                    ? 'bg-amber-950 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                }`}>
                  {selectedMilestone.status.toUpperCase().replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">
                {selectedMilestone.title}
              </h3>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-[#F5F5F0]/50 uppercase block">Primary Biophysical Yield</span>
              <span className="text-sm font-bold text-emerald-400">{selectedMilestone.metricImpact}</span>
            </div>
          </div>

          <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
            {selectedMilestone.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-1">
            <div className="p-3 bg-[#161616] border border-[#F5F5F0]/5 rounded-xs space-y-1">
              <span className="text-[10px] uppercase text-[#C5A059] block">Epistemic Tier:</span>
              <span className="text-xs font-bold text-[#F5F5F0]">{selectedMilestone.epistemicTier}</span>
            </div>

            <div className="p-3 bg-[#161616] border border-[#F5F5F0]/5 rounded-xs space-y-1">
              <span className="text-[10px] uppercase text-[#C5A059] block">Verified By / Model:</span>
              <span className="text-xs font-bold text-cyan-300 truncate block">
                {selectedMilestone.verifiedByOrModel}
              </span>
            </div>

            <div className="p-3 bg-[#161616] border border-[#F5F5F0]/5 rounded-xs space-y-1">
              <span className="text-[10px] uppercase text-[#C5A059] block">
                {selectedMilestone.evidenceHash ? 'Cryptographic Hash:' : 'Monte Carlo Certainty:'}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 truncate block">
                {selectedMilestone.evidenceHash || `${selectedMilestone.confidenceScore}% Confidence`}
              </span>
            </div>
          </div>

          {selectedMilestone.assumptions && selectedMilestone.assumptions.length > 0 && (
            <div className="p-3 bg-[#141414] border border-[#F5F5F0]/5 rounded-xs space-y-1 text-xs font-mono">
              <span className="text-[10px] uppercase text-amber-400 flex items-center gap-1 font-bold">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                Model Assumptions & Boundaries (Commandment II: Reality Above Model)
              </span>
              <ul className="list-disc list-inside text-[11px] text-[#F5F5F0]/70 space-y-0.5 pt-0.5">
                {selectedMilestone.assumptions.map((assump, i) => (
                  <li key={i}>{assump}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 border-t border-[#F5F5F0]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-[#F5F5F0]/50">
            <span>Bioregional Sector: {bioregionName}</span>
            <span className="text-[#C5A059]">Atlas Multi-Temporal Counterfactual Engine</span>
          </div>
        </div>
      )}
    </div>
  );
};
