import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Award,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Droplets,
  TreePine,
  Layers,
  Activity,
  Users,
  ShieldCheck,
  Plus,
  Trash2,
  RefreshCw,
  Info,
  ChevronRight,
  Zap,
  Flame,
  Check
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface BioregionEfficiencyProfile {
  id: string;
  name: string;
  biome: string;
  color: string;
  strokeDash?: string;
  metrics: {
    waterRetention: number;    // normalized 0-100 (raw: m3/ha)
    soilCarbon: number;        // normalized 0-100 (raw: tCO2e/ha)
    circularity: number;       // 0-100 %
    dissipationDefense: number;// 0-100 % (100 - leakage)
    biomassEroi: number;       // normalized 0-100 (raw: ratio 1-10)
    stewardGovernance: number; // normalized 0-100 (raw: councils/10k ha)
  };
  rawValues: {
    waterRetention: string;
    soilCarbon: string;
    circularity: string;
    dissipationDefense: string;
    biomassEroi: string;
    stewardGovernance: string;
  };
}

export interface RegenerativeStrategy {
  id: string;
  name: string;
  sourceBioregionId: string;
  sourceBioregionName: string;
  category: 'hydrology' | 'soil_carbon' | 'circularity' | 'governance' | 'agroforestry';
  description: string;
  efficiencyGains: {
    waterRetentionBoostPct: number;
    soilCarbonBoostTCO2e: number;
    circularityBoostPct: number;
    dissipationReductionPct: number;
    eroiBoost: number;
    stewardDensityBoost: number;
  };
  implementationHorizon: string;
  epistemicTier: string;
  difficulty: 'Low' | 'Medium' | 'High';
  auditProof: string;
}

// Initial Peer Bioregions Benchmark Profiles
export const BASE_BIOREGION_PROFILES: BioregionEfficiencyProfile[] = [
  {
    id: 'active_bioregion',
    name: 'Your Bioregion (Active Simulation)',
    biome: 'Savanna & Riparian Buffer',
    color: '#10B981', // Emerald
    metrics: {
      waterRetention: 68,
      soilCarbon: 72,
      circularity: 76,
      dissipationDefense: 74,
      biomassEroi: 65,
      stewardGovernance: 70
    },
    rawValues: {
      waterRetention: '1,420 m³/ha',
      soilCarbon: '3.8 tCO2e/ha',
      circularity: '76.4%',
      dissipationDefense: '74.2% retained',
      biomassEroi: '5.2:1 EROI',
      stewardGovernance: '3.4 councils/10k ha'
    }
  },
  {
    id: 'aberdare_cloud',
    name: 'Aberdare Cloud Forest Catchment',
    biome: 'Montane Rainforest & Bamboo',
    color: '#06B6D4', // Cyan
    metrics: {
      waterRetention: 94,
      soilCarbon: 88,
      circularity: 82,
      dissipationDefense: 89,
      biomassEroi: 85,
      stewardGovernance: 78
    },
    rawValues: {
      waterRetention: '2,890 m³/ha',
      soilCarbon: '5.6 tCO2e/ha',
      circularity: '82.0%',
      dissipationDefense: '89.1% retained',
      biomassEroi: '7.8:1 EROI',
      stewardGovernance: '4.2 councils/10k ha'
    }
  },
  {
    id: 'naivasha_lacustrine',
    name: 'Lake Naivasha Endorheic Basin',
    biome: 'Rift Valley Wetland & Papyrus',
    color: '#A855F7', // Purple
    metrics: {
      waterRetention: 79,
      soilCarbon: 65,
      circularity: 92,
      dissipationDefense: 86,
      biomassEroi: 74,
      stewardGovernance: 84
    },
    rawValues: {
      waterRetention: '1,850 m³/ha',
      soilCarbon: '3.1 tCO2e/ha',
      circularity: '92.4%',
      dissipationDefense: '86.5% retained',
      biomassEroi: '6.1:1 EROI',
      stewardGovernance: '5.1 councils/10k ha'
    }
  },
  {
    id: 'rift_drylands',
    name: 'Great Rift Semi-Arid Drylands',
    biome: 'Acacia-Commiphora Bushland',
    color: '#F59E0B', // Amber
    metrics: {
      waterRetention: 52,
      soilCarbon: 48,
      circularity: 85,
      dissipationDefense: 62,
      biomassEroi: 58,
      stewardGovernance: 90
    },
    rawValues: {
      waterRetention: '840 m³/ha',
      soilCarbon: '2.2 tCO2e/ha',
      circularity: '85.2%',
      dissipationDefense: '62.0% retained',
      biomassEroi: '4.3:1 EROI',
      stewardGovernance: '6.2 councils/10k ha'
    }
  },
  {
    id: 'top10_cohort',
    name: 'Top 10% Gold Standard Cohort',
    biome: 'Planetary Best-in-Class Benchmark',
    color: '#C5A059', // Gold
    strokeDash: '4,4',
    metrics: {
      waterRetention: 96,
      soilCarbon: 94,
      circularity: 95,
      dissipationDefense: 93,
      biomassEroi: 92,
      stewardGovernance: 95
    },
    rawValues: {
      waterRetention: '3,150 m³/ha',
      soilCarbon: '6.4 tCO2e/ha',
      circularity: '95.0%',
      dissipationDefense: '93.4% retained',
      biomassEroi: '8.9:1 EROI',
      stewardGovernance: '6.8 councils/10k ha'
    }
  }
];

// Actionable Optimal Regenerative Strategies from Peers
export const REGENERATIVE_STRATEGIES_CATALOG: RegenerativeStrategy[] = [
  {
    id: 'strat-bunched-grazing',
    name: 'Holistic Planned Bunched-Grazing & Mobile Solar Kraals',
    sourceBioregionId: 'active_bioregion',
    sourceBioregionName: 'Mara-Serengeti Pastoral Trust',
    category: 'soil_carbon',
    description: 'High-density, short-duration animal impact mimicking migratory ungulate herds, breaking capped soil crusts and trampling litter into humus.',
    efficiencyGains: {
      waterRetentionBoostPct: 18,
      soilCarbonBoostTCO2e: 1.2,
      circularityBoostPct: 6,
      dissipationReductionPct: 12,
      eroiBoost: 1.1,
      stewardDensityBoost: 0.8
    },
    implementationHorizon: '6 - 12 Months',
    epistemicTier: 'Ground-truthed 42 Pastoralist Transects',
    difficulty: 'Low',
    auditProof: '0x8f2a991bce42'
  },
  {
    id: 'strat-bamboo-corridors',
    name: 'Montane Bamboo (Yushania alpina) Cloud-Harvesting Corridors',
    sourceBioregionId: 'aberdare_cloud',
    sourceBioregionName: 'Aberdare Cloud Forest Catchment',
    category: 'hydrology',
    description: 'Dense riparian bamboo belts intercepting occult orographic precipitation, increasing dry-season aquifer infiltration by up to 35%.',
    efficiencyGains: {
      waterRetentionBoostPct: 28,
      soilCarbonBoostTCO2e: 1.6,
      circularityBoostPct: 8,
      dissipationReductionPct: 15,
      eroiBoost: 1.4,
      stewardDensityBoost: 0.6
    },
    implementationHorizon: '18 - 36 Months',
    epistemicTier: 'Sentinel-2 Multispectral & GEDI Lidar',
    difficulty: 'Medium',
    auditProof: '0x10b981ad45ce'
  },
  {
    id: 'strat-papyrus-swales',
    name: 'Constructed Papyrus Bio-Filtration Swales & Silt-Traps',
    sourceBioregionId: 'naivasha_lacustrine',
    sourceBioregionName: 'Lake Naivasha Endorheic Basin',
    category: 'circularity',
    description: 'Interconnected wetland reed beds that strip agrochemical nitrogen/phosphorus, recycling purified effluent back into subsoil irrigation.',
    efficiencyGains: {
      waterRetentionBoostPct: 16,
      soilCarbonBoostTCO2e: 0.8,
      circularityBoostPct: 18,
      dissipationReductionPct: 22,
      eroiBoost: 1.2,
      stewardDensityBoost: 1.2
    },
    implementationHorizon: '12 - 24 Months',
    epistemicTier: 'SWAT Hydrological Sensor Mesh',
    difficulty: 'Medium',
    auditProof: '0x3c7e091fa582'
  },
  {
    id: 'strat-zai-pit-fmnr',
    name: 'Deep Zai Pits with Farmer-Managed Natural Regeneration (FMNR)',
    sourceBioregionId: 'rift_drylands',
    sourceBioregionName: 'Great Rift Semi-Arid Drylands',
    category: 'agroforestry',
    description: 'Traditional 30cm micro-catchments enriched with compost and termite-activated organic matter, combined with systematic native sapling pruning.',
    efficiencyGains: {
      waterRetentionBoostPct: 22,
      soilCarbonBoostTCO2e: 1.1,
      circularityBoostPct: 10,
      dissipationReductionPct: 18,
      eroiBoost: 0.9,
      stewardDensityBoost: 1.5
    },
    implementationHorizon: '12 - 18 Months',
    epistemicTier: 'Community Bioacoustic & In-Situ Audit',
    difficulty: 'Low',
    auditProof: '0x99281a04d5bc'
  },
  {
    id: 'strat-subsurface-sand-dams',
    name: 'Piezometer-Monitored Seasonal River Subsurface Sand Dams',
    sourceBioregionId: 'rift_drylands',
    sourceBioregionName: 'Great Rift Semi-Arid Drylands',
    category: 'hydrology',
    description: 'Reinforced masonry cascade walls across dry riverbeds that store millions of liters of water in coarse sand matrix with zero evaporation loss.',
    efficiencyGains: {
      waterRetentionBoostPct: 32,
      soilCarbonBoostTCO2e: 0.6,
      circularityBoostPct: 12,
      dissipationReductionPct: 28,
      eroiBoost: 1.8,
      stewardDensityBoost: 1.4
    },
    implementationHorizon: '12 - 24 Months',
    epistemicTier: 'Gravity & Piezometric Pressure Array',
    difficulty: 'High',
    auditProof: '0xaa184c77102e'
  }
];

const METRIC_AXES = [
  { key: 'waterRetention', label: 'Water Retention', icon: Droplets, color: '#06B6D4', fullLabel: 'Water Retention Efficiency' },
  { key: 'soilCarbon', label: 'Soil Carbon', icon: TreePine, color: '#10B981', fullLabel: 'Soil Carbon Sequestration Density' },
  { key: 'circularity', label: 'Circularity', icon: Activity, color: '#A855F7', fullLabel: 'Closed-Loop Circularity Quotient' },
  { key: 'dissipationDefense', label: 'Loss Defense', icon: Layers, color: '#F59E0B', fullLabel: 'Dissipation Mitigation Defense' },
  { key: 'biomassEroi', label: 'Biomass EROI', icon: Flame, color: '#E11D48', fullLabel: 'Net Biomass Energy Return on Investment' },
  { key: 'stewardGovernance', label: 'Stewardship', icon: Users, color: '#C5A059', fullLabel: 'Community Steward Governance Density' }
];

interface D3ResourceEfficiencyRadarProps {
  currentRegionName?: string;
  onAdoptStrategyFeedback?: (strategy: RegenerativeStrategy) => void;
}

export const D3ResourceEfficiencyRadar: React.FC<D3ResourceEfficiencyRadarProps> = ({
  currentRegionName = 'Mara-Serengeti River Basin',
  onAdoptStrategyFeedback
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Selected bioregions to overlay on D3 radar
  const [selectedBioregionIds, setSelectedBioregionIds] = useState<string[]>([
    'active_bioregion',
    'aberdare_cloud',
    'top10_cohort'
  ]);

  // List of adopted strategy IDs
  const [adoptedStrategyIds, setAdoptedStrategyIds] = useState<string[]>([
    'strat-bunched-grazing'
  ]);

  // Hovered metric for tooltips
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);
  const [hoveredBioregion, setHoveredBioregion] = useState<string | null>(null);

  // Success notification toast
  const [adoptionToast, setAdoptionToast] = useState<{ title: string; desc: string } | null>(null);

  // Calculate dynamic metrics for active bioregion based on adopted strategies
  const dynamicBioregionProfiles = useMemo(() => {
    // Clone base profiles
    const profiles = JSON.parse(JSON.stringify(BASE_BIOREGION_PROFILES)) as BioregionEfficiencyProfile[];
    const active = profiles.find(p => p.id === 'active_bioregion');

    if (active) {
      active.name = `${currentRegionName} (Simulated)`;

      // Apply cumulative boosts from adopted strategies
      let waterBoost = 0;
      let carbonBoost = 0;
      let circularityBoost = 0;
      let dissipationBoost = 0;
      let eroiBoost = 0;
      let stewardBoost = 0;

      adoptedStrategyIds.forEach(stratId => {
        const strat = REGENERATIVE_STRATEGIES_CATALOG.find(s => s.id === stratId);
        if (strat) {
          waterBoost += strat.efficiencyGains.waterRetentionBoostPct;
          carbonBoost += strat.efficiencyGains.soilCarbonBoostTCO2e * 5; // scaled
          circularityBoost += strat.efficiencyGains.circularityBoostPct;
          dissipationBoost += strat.efficiencyGains.dissipationReductionPct;
          eroiBoost += strat.efficiencyGains.eroiBoost * 6;
          stewardBoost += strat.efficiencyGains.stewardDensityBoost * 5;
        }
      });

      active.metrics.waterRetention = Math.min(99, Math.round(active.metrics.waterRetention + waterBoost * 0.45));
      active.metrics.soilCarbon = Math.min(99, Math.round(active.metrics.soilCarbon + carbonBoost * 0.4));
      active.metrics.circularity = Math.min(99, Math.round(active.metrics.circularity + circularityBoost * 0.4));
      active.metrics.dissipationDefense = Math.min(99, Math.round(active.metrics.dissipationDefense + dissipationBoost * 0.35));
      active.metrics.biomassEroi = Math.min(99, Math.round(active.metrics.biomassEroi + eroiBoost * 0.4));
      active.metrics.stewardGovernance = Math.min(99, Math.round(active.metrics.stewardGovernance + stewardBoost * 0.4));
    }

    return profiles;
  }, [currentRegionName, adoptedStrategyIds]);

  // D3 Radar Chart Rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = 460;
    const height = 400;
    const margin = 50;
    const radius = Math.min(width, height) / 2 - margin;
    const angleSlice = (Math.PI * 2) / METRIC_AXES.length;

    // Clear previous elements
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Radius scale (0 to 100)
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    // Concentric grid rings (20%, 40%, 60%, 80%, 100%)
    const levels = [20, 40, 60, 80, 100];
    const axisGrid = g.append('g').attr('class', 'axis-wrapper');

    levels.forEach(level => {
      axisGrid
        .append('circle')
        .attr('r', rScale(level))
        .attr('fill', level === 100 ? '#0B120E' : 'none')
        .attr('stroke', '#C5A059')
        .attr('stroke-width', level === 100 ? 1.2 : 0.6)
        .attr('stroke-dasharray', level === 100 ? 'none' : '2,3')
        .attr('opacity', 0.25);

      // Level label
      axisGrid
        .append('text')
        .attr('x', 4)
        .attr('y', -rScale(level) + 4)
        .attr('font-size', '8px')
        .attr('font-family', 'monospace')
        .attr('fill', '#C5A059')
        .attr('opacity', 0.6)
        .text(`${level}%`);
    });

    // Radial axis lines and labels
    METRIC_AXES.forEach((axis, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = rScale(100) * Math.cos(angle);
      const y = rScale(100) * Math.sin(angle);

      // Axis line
      axisGrid
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', hoveredAxis === axis.key ? '#10B981' : '#C5A059')
        .attr('stroke-width', hoveredAxis === axis.key ? 1.8 : 0.8)
        .attr('opacity', hoveredAxis === axis.key ? 0.9 : 0.35);

      // Axis label position (padded outside circle)
      const labelDistance = radius + 24;
      const lx = labelDistance * Math.cos(angle);
      const ly = labelDistance * Math.sin(angle);

      const labelGroup = axisGrid
        .append('g')
        .attr('transform', `translate(${lx}, ${ly})`)
        .attr('cursor', 'pointer')
        .on('mouseenter', () => setHoveredAxis(axis.key))
        .on('mouseleave', () => setHoveredAxis(null));

      labelGroup
        .append('text')
        .attr('text-anchor', Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end')
        .attr('dy', Math.sin(angle) > 0.5 ? '0.8em' : Math.sin(angle) < -0.5 ? '-0.3em' : '0.35em')
        .attr('font-size', '9.5px')
        .attr('font-weight', hoveredAxis === axis.key ? 'bold' : 'normal')
        .attr('font-family', 'monospace')
        .attr('fill', hoveredAxis === axis.key ? '#FFFFFF' : '#C5A059')
        .text(axis.label);
    });

    // Radar Line Generator
    const radarLine = d3
      .lineRadial<number>()
      .radius(d => rScale(d))
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    // Draw polygons for selected bioregions
    const activeProfiles = dynamicBioregionProfiles.filter(p => selectedBioregionIds.includes(p.id));

    activeProfiles.forEach(profile => {
      const metricValues = METRIC_AXES.map(a => profile.metrics[a.key as keyof typeof profile.metrics]);
      const isHovered = hoveredBioregion === profile.id;
      const isTopCohort = profile.id === 'top10_cohort';
      const isActiveBio = profile.id === 'active_bioregion';

      const polyGroup = g
        .append('g')
        .attr('class', `radar-group-${profile.id}`)
        .attr('cursor', 'pointer')
        .on('mouseenter', () => setHoveredBioregion(profile.id))
        .on('mouseleave', () => setHoveredBioregion(null));

      // Filled Area
      polyGroup
        .append('path')
        .datum(metricValues)
        .attr('d', radarLine)
        .attr('fill', profile.color)
        .attr('fill-opacity', isHovered ? 0.35 : isActiveBio ? 0.22 : 0.12)
        .attr('stroke', profile.color)
        .attr('stroke-width', isActiveBio ? 2.5 : isHovered ? 2.2 : 1.5)
        .attr('stroke-dasharray', profile.strokeDash || 'none')
        .attr('filter', isActiveBio ? 'drop-shadow(0 0 8px rgba(16,185,129,0.4))' : 'none');

      // Points on vertices
      metricValues.forEach((val, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const px = rScale(val) * Math.cos(angle);
        const py = rScale(val) * Math.sin(angle);

        polyGroup
          .append('circle')
          .attr('cx', px)
          .attr('cy', py)
          .attr('r', isActiveBio ? 3.5 : 2.5)
          .attr('fill', profile.color)
          .attr('stroke', '#090D0A')
          .attr('stroke-width', 1.2)
          .append('title')
          .text(`${profile.name} - ${METRIC_AXES[i].label}: ${val}%`);
      });
    });

  }, [dynamicBioregionProfiles, selectedBioregionIds, hoveredAxis, hoveredBioregion]);

  // Handle Strategy Adoption
  const handleToggleAdoptStrategy = (strat: RegenerativeStrategy) => {
    const isAdopted = adoptedStrategyIds.includes(strat.id);

    if (isAdopted) {
      audioFeedback.playMicroTick();
      setAdoptedStrategyIds(prev => prev.filter(id => id !== strat.id));
      setAdoptionToast({
        title: `Strategy Suspended: ${strat.name}`,
        desc: 'Reverted efficiency baseline for this intervention.'
      });
    } else {
      audioFeedback.playSuccess();
      setAdoptedStrategyIds(prev => [...prev, strat.id]);
      setAdoptionToast({
        title: `Strategy Adopted: ${strat.name}`,
        desc: `Integrated ${strat.sourceBioregionName} best practice. Radar efficiency polygon updated!`
      });
      if (onAdoptStrategyFeedback) {
        onAdoptStrategyFeedback(strat);
      }
    }

    setTimeout(() => {
      setAdoptionToast(null);
    }, 4000);
  };

  // Toggle bioregion visibility on D3 radar
  const handleToggleBioregion = (id: string) => {
    audioFeedback.playSubtleClick();
    setSelectedBioregionIds(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(i => i !== id) : prev) : [...prev, id]
    );
  };

  const activeProfile = dynamicBioregionProfiles.find(p => p.id === 'active_bioregion')!;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#090D0A] border-2 border-[#C5A059]/50 shadow-2xl space-y-6 font-mono text-xs text-[#F5F5F0]">
      {/* Toast banner */}
      {adoptionToast && (
        <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 shadow-lg text-white flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </span>
            <div>
              <div className="font-bold text-xs text-emerald-200">{adoptionToast.title}</div>
              <div className="text-[10px] text-emerald-400/90 font-sans">{adoptionToast.desc}</div>
            </div>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-400/30">
            D3 Live Calibrated
          </span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#F5F5F0]/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
            <Award className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-white text-base sm:text-lg tracking-wide">
                D3 Multi-Bioregion Resource Efficiency Radar & Strategy Adoption
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                Interactive D3.js Frontier
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/70 font-sans mt-0.5">
              Visualize multidimensional biophysical efficiency benchmarks across peer bioregions and adopt verified restorative practices.
            </p>
          </div>
        </div>

        {/* Adopted Count Badge */}
        <div className="flex items-center gap-2 bg-[#121A14] px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <div>
            <span className="text-[10px] text-neutral-400 block">Adopted Strategies:</span>
            <span className="font-bold text-emerald-300 text-xs">{adoptedStrategyIds.length} Active in Simulation</span>
          </div>
        </div>
      </div>

      {/* Bioregion Filter Selection Chips for D3 Overlay */}
      <div className="p-3.5 rounded-xl bg-[#0D120E] border border-[#F5F5F0]/10 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-neutral-400 uppercase font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
            Overlay Bioregions on D3 Radar (Toggle to compare):
          </span>
          <span className="text-[10px] text-[#C5A059]">
            Hover vertices for exact values
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {dynamicBioregionProfiles.map(p => {
            const isSelected = selectedBioregionIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => handleToggleBioregion(p.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#151F17] text-white border-current shadow'
                    : 'bg-[#101411] text-neutral-500 border-white/10 hover:text-neutral-300'
                }`}
                style={{ borderColor: isSelected ? p.color : undefined }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <span>{p.name}</span>
                {isSelected && <Check className="w-3 h-3 text-white ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: D3 Radar Canvas on Left, Live Benchmark Scorecards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 7 Columns: Interactive D3 Radar Chart */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-3 rounded-xl bg-[#0B100D] border border-white/10 relative min-h-[380px]">
          <div className="w-full max-w-[460px] aspect-[460/400]">
            <svg ref={svgRef} className="w-full h-full overflow-visible select-none" />
          </div>

          <div className="text-[10px] text-neutral-400 text-center font-sans mt-2">
            Each axis represents normalized biophysical resource efficiency (0 to 100%). Outward expansion indicates higher regenerative density.
          </div>
        </div>

        {/* Right 5 Columns: Active Bioregion Benchmark Indicators */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Efficiency Benchmark Breakdown
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">
              {activeProfile.name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {METRIC_AXES.map(axis => {
              const val = activeProfile.metrics[axis.key as keyof typeof activeProfile.metrics];
              const Icon = axis.icon;
              const topVal = dynamicBioregionProfiles.find(p => p.id === 'top10_cohort')?.metrics[axis.key as keyof typeof activeProfile.metrics] || 95;
              const gap = topVal - val;

              return (
                <div
                  key={axis.key}
                  onMouseEnter={() => setHoveredAxis(axis.key)}
                  onMouseLeave={() => setHoveredAxis(null)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    hoveredAxis === axis.key
                      ? 'bg-[#18261C] border-emerald-400 shadow'
                      : 'bg-[#101712] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                    <span className="flex items-center gap-1 font-bold text-white">
                      <Icon className="w-3 h-3" style={{ color: axis.color }} />
                      {axis.label}
                    </span>
                    <span className="text-emerald-400 font-bold">{val}%</span>
                  </div>

                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden my-1.5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${val}%`,
                        backgroundColor: axis.color
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-[8px] text-neutral-500">
                    <span>Target: {topVal}%</span>
                    <span className={gap <= 5 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {gap <= 0 ? '★ Benchmark Leader' : `Gap: -${gap}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aggregate REQ summary */}
          <div className="p-3 rounded-lg bg-[#141C16] border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase text-neutral-400 block font-bold">Simulated Multi-Resource REQ:</span>
              <span className="text-base font-bold text-emerald-300 font-serif">
                {((Object.values(activeProfile.metrics).reduce((a, b) => a + b, 0)) / 6).toFixed(1)} / 100
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-neutral-400 block">Cohort Decile:</span>
              <span className="text-xs font-bold text-[#C5A059]">Top 15% Upper Quartile</span>
            </div>
          </div>
        </div>
      </div>

      {/* STRATEGY ADOPTION ENGINE: Transferable Optimal Strategies */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/15 pb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#C5A059]" />
            <span className="font-serif font-bold text-white text-sm">
              Transferable Optimal Regenerative Strategies from Top Peers
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 font-sans">
            Click "Adopt Strategy" to integrate into active simulation & expand D3 efficiency frontier
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {REGENERATIVE_STRATEGIES_CATALOG.map(strat => {
            const isAdopted = adoptedStrategyIds.includes(strat.id);

            return (
              <div
                key={strat.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  isAdopted
                    ? 'bg-[#132218] border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-[#0E1410] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="font-serif font-bold text-xs text-white leading-snug">
                      {strat.name}
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 ${
                        isAdopted
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/5 text-neutral-400 border border-white/10'
                      }`}
                    >
                      {strat.difficulty} Difficulty
                    </span>
                  </div>

                  <div className="text-[10px] text-[#C5A059] flex items-center gap-1 font-bold">
                    <span>Source: {strat.sourceBioregionName}</span>
                  </div>

                  <p className="text-[10px] text-neutral-300 font-sans leading-relaxed">
                    {strat.description}
                  </p>

                  {/* Benchmark Impact Gains Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[9px]">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      +{strat.efficiencyGains.waterRetentionBoostPct}% Water Infiltration
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      +{strat.efficiencyGains.soilCarbonBoostTCO2e} tCO2e/ha Soil Carbon
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                      +{strat.efficiencyGains.circularityBoostPct}% Circularity
                    </span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="border-t border-white/10 pt-2.5 flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400 font-sans">
                    Horizon: {strat.implementationHorizon}
                  </span>

                  <button
                    onClick={() => handleToggleAdoptStrategy(strat)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isAdopted
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow font-extrabold'
                        : 'bg-white/10 hover:bg-emerald-500 hover:text-black text-white border border-white/20'
                    }`}
                  >
                    {isAdopted ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Adopted & Active</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adopt Strategy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
