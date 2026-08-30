import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
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
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Sliders,
  Play,
  Pause,
  Filter,
  Eye,
  Activity,
  FileCheck,
  Hash
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface TimelineSnapshot {
  id: string;
  year: number;
  timeLabel: string;
  horizon: 'historical' | 'present' | 'near_future' | 'mid_century';
  title: string;
  category: 'Flora' | 'Hydrology' | 'Fauna' | 'Soil' | 'Community' | 'Policy';
  isPredicted: boolean;
  status: 'completed' | 'verified_in_situ' | 'in_progress' | 'projected_p90' | 'projected_p50';
  metricImpact: string;
  biomassTCO2e: number;
  canopyDensityPct: number;
  aquiferHeadBar: number;
  soilOrganicMatterPct: number;
  biodiversityScore: number;
  description: string;
  bioregionId: string;
  evidenceHash?: string;
  confidenceScore: number;
  epistemicTier: string;
  verifiedByOrModel: string;
  keyAction: string;
  ecologicalStateImage?: string;
  assumptions?: string[];
}

export const RESTORATION_TIMELINE_DATA: TimelineSnapshot[] = [
  {
    id: 'snap-2016',
    year: 2016,
    timeLabel: '2016 Baseline',
    horizon: 'historical',
    title: 'Post-Deforestation Silt Runoff & Degraded Catchment',
    category: 'Hydrology',
    isPredicted: false,
    status: 'completed',
    metricImpact: '64% Canopy Loss • Severe Silt Runoff',
    biomassTCO2e: 420,
    canopyDensityPct: 36,
    aquiferHeadBar: 0.4,
    soilOrganicMatterPct: 1.8,
    biodiversityScore: 42,
    description: 'High forest fragmentation caused severe flash flooding and dry-season baseflow collapse across downstream municipal water intakes.',
    bioregionId: 'aberdare_riparian_watershed',
    evidenceHash: '0x101a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
    confidenceScore: 99,
    epistemicTier: 'Landsat-8 Historical Multispectral Archive',
    verifiedByOrModel: 'Kenya Forest Service Historical Archive',
    keyAction: 'Initiation of Bioregional Protection Mandate'
  },
  {
    id: 'snap-2018',
    year: 2018,
    timeLabel: 'Q3 2018',
    horizon: 'historical',
    title: 'Indigenous Seed Bank & Pioneer High Forest Nurseries',
    category: 'Flora',
    isPredicted: false,
    status: 'completed',
    metricImpact: '45,000 Podocarpus & Hagenia saplings cultivated',
    biomassTCO2e: 520,
    canopyDensityPct: 42,
    aquiferHeadBar: 0.7,
    soilOrganicMatterPct: 2.1,
    biodiversityScore: 49,
    description: 'Community-led collection of endemic seed stock establishing continuous nursery nodes across the mountain boundary.',
    bioregionId: 'aberdare_riparian_watershed',
    evidenceHash: '0x4f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
    confidenceScore: 98,
    epistemicTier: 'Ground Truth Botanical Inventory',
    verifiedByOrModel: 'Aberdare Forest Guardians Council',
    keyAction: 'Mycorrhizal Spore Inoculation in Tree Nurseries'
  },
  {
    id: 'snap-2020',
    year: 2020,
    timeLabel: 'Q1 2020',
    horizon: 'historical',
    title: 'Riparian Bio-Swales & Vetiver Infiltration Terraces',
    category: 'Hydrology',
    isPredicted: false,
    status: 'completed',
    metricImpact: '-38% Urban Silt Washout • 120 ha Secured',
    biomassTCO2e: 690,
    canopyDensityPct: 49,
    aquiferHeadBar: 1.1,
    soilOrganicMatterPct: 2.6,
    biodiversityScore: 58,
    description: 'Deployment of engineered bio-swales and vetiver grass contours slowing torrential storm runoff and recharging subterranean fissures.',
    bioregionId: 'aberdare_riparian_watershed',
    evidenceHash: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    confidenceScore: 96,
    epistemicTier: 'In-Situ Hydrological Flow Gauges',
    verifiedByOrModel: 'Nairobi River Basin Water Directorate',
    keyAction: 'Landscape Keyline Earthworking Construction'
  },
  {
    id: 'snap-2022',
    year: 2022,
    timeLabel: 'Q4 2022',
    horizon: 'historical',
    title: 'Subterranean Glomalin Inoculation & Rotational Grazing',
    category: 'Soil',
    isPredicted: false,
    status: 'completed',
    metricImpact: '+1.4% Soil Organic Matter (SOM) • 8,500 ha',
    biomassTCO2e: 880,
    canopyDensityPct: 58,
    aquiferHeadBar: 1.4,
    soilOrganicMatterPct: 3.4,
    biodiversityScore: 68,
    description: 'Deep root mycorrhizal symbiosis sequestering carbon aggregates and elder-governed rotational rest periods in Maasai pastures.',
    bioregionId: 'aberdare_riparian_watershed',
    evidenceHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    confidenceScore: 95,
    epistemicTier: 'Empirical Core Sampling Audit',
    verifiedByOrModel: 'Biophysical Soil Physics Lab',
    keyAction: 'Olosho 90-Day Seasonal Pasture Moratorium'
  },
  {
    id: 'snap-2024',
    year: 2024,
    timeLabel: 'Q2 2024',
    horizon: 'historical',
    title: 'Bio-Acoustic Pollinator Mesh & Mountain Bongo Breeding Glades',
    category: 'Fauna',
    isPredicted: false,
    status: 'verified_in_situ',
    metricImpact: '84 Native Bird Species • +41% Bio-Acoustic Index',
    biomassTCO2e: 1150,
    canopyDensityPct: 69,
    aquiferHeadBar: 1.65,
    soilOrganicMatterPct: 4.1,
    biodiversityScore: 78,
    description: 'Continuous native canopy bridge reconnecting fragmented Rift Valley forest pockets; camera traps confirmed 4 bongo calves.',
    bioregionId: 'aberdare_riparian_watershed',
    evidenceHash: '0x99201a4e76110f8234719bbca098234190872615',
    confidenceScore: 97,
    epistemicTier: 'Infrared Trap & Bio-Acoustic Waveforms',
    verifiedByOrModel: 'Bio-Acoustic Sentinel Array',
    keyAction: 'Avian Wildlife Corridor Re-connection'
  },
  {
    id: 'snap-2026',
    year: 2026,
    timeLabel: 'Present (2026)',
    horizon: 'present',
    title: 'Real-Time Sentinel Mesh & +1.82 bar Aquifer Piezometric Equilibrium',
    category: 'Hydrology',
    isPredicted: false,
    status: 'in_progress',
    metricImpact: '78% Crown Density • 1,420 tCO2e/ha • 94.8 Score',
    biomassTCO2e: 1420,
    canopyDensityPct: 78,
    aquiferHeadBar: 1.82,
    soilOrganicMatterPct: 4.8,
    biodiversityScore: 84,
    description: 'Comprehensive IoT sensor array synchronized with Atlas Sanctum Causal Twin, anchoring empirical ground truth against predictive models.',
    bioregionId: 'aberdare_riparian_watershed',
    evidenceHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    confidenceScore: 96,
    epistemicTier: 'Real-Time In-Situ Sensor Mesh',
    verifiedByOrModel: 'Atlas Autonomous Sentinel Network',
    keyAction: 'Dynamic Causal Counterfactual Optimization'
  },
  {
    id: 'snap-2029',
    year: 2029,
    timeLabel: '2029 (Predicted P90)',
    horizon: 'near_future',
    title: 'Self-Sustaining Evapotranspiration Micro-Cooling Loop',
    category: 'Flora',
    isPredicted: true,
    status: 'projected_p90',
    metricImpact: '86% Canopy Cover • 1,840 tCO2e/ha • 2.1°C Micro-Cooling',
    biomassTCO2e: 1840,
    canopyDensityPct: 86,
    aquiferHeadBar: 2.15,
    soilOrganicMatterPct: 5.4,
    biodiversityScore: 89,
    description: 'Mature multi-tiered evergreen canopy transpires sufficient moisture to establish daily convective cloud cap, dampening heatwaves.',
    bioregionId: 'aberdare_riparian_watershed',
    confidenceScore: 88,
    epistemicTier: 'Pearl Structural Causal Model (P90 Confidence)',
    verifiedByOrModel: 'Causal Synthesis Research Lab',
    keyAction: 'Canopy Lock-In & Autonomous Regeneration Zone',
    assumptions: ['SSP2-4.5 rainfall envelope', 'Zero commercial clearcut encroachment']
  },
  {
    id: 'snap-2035',
    year: 2035,
    timeLabel: '2035 (Predicted P90)',
    horizon: 'near_future',
    title: 'Autonomous Riparian Commons & Regional Aquifer Self-Balance',
    category: 'Policy',
    isPredicted: true,
    status: 'projected_p90',
    metricImpact: '100% Water Security for 1.2M Basin Residents',
    biomassTCO2e: 2350,
    canopyDensityPct: 91,
    aquiferHeadBar: 2.45,
    soilOrganicMatterPct: 6.2,
    biodiversityScore: 93,
    description: 'Bioregional water table self-regulates through living forest sponge; customary stewardship covenants fully adopted as municipal law.',
    bioregionId: 'aberdare_riparian_watershed',
    confidenceScore: 84,
    epistemicTier: '10,000 Stochastic Monte Carlo Runs',
    verifiedByOrModel: 'Atlas Civilization Simulator v3.2',
    keyAction: 'Indigenous Custodianship Legal Sovereign Charter',
    assumptions: ['Stewardship token governance participation > 80%']
  },
  {
    id: 'snap-2050',
    year: 2050,
    timeLabel: '2050 (Climax State)',
    horizon: 'mid_century',
    title: 'Climax Afro-Montane Sponge Biome & Pan-African Bio-Corridor',
    category: 'Flora',
    isPredicted: true,
    status: 'projected_p50',
    metricImpact: '2,900 tCO2e/ha • Peak Trophic Equilibrium 98/100',
    biomassTCO2e: 2900,
    canopyDensityPct: 95,
    aquiferHeadBar: 2.80,
    soilOrganicMatterPct: 7.1,
    biodiversityScore: 98,
    description: 'Permanent climax ecological state with continuous wildlife migration corridors from Aberdare highlands to Mount Kenya and the Great Rift.',
    bioregionId: 'aberdare_riparian_watershed',
    confidenceScore: 78,
    epistemicTier: 'Centennial Earth System Boundary Model',
    verifiedByOrModel: 'Atlas Long-Term Biophysical Kernel',
    keyAction: 'Transboundary Pan-African Ecological Sanctuary',
    assumptions: ['Global warming limited to < 2.0°C overshoot']
  }
];

interface RestorationTimelineViewProps {
  selectedBioregionId?: string;
  onSelectSnapshot?: (snapshot: TimelineSnapshot) => void;
  onTimelinePeriodChange?: (year: number, snapshot: TimelineSnapshot) => void;
  onNavigateToEvidence?: (evidenceId?: string) => void;
}

export const RestorationTimelineView: React.FC<RestorationTimelineViewProps> = ({
  selectedBioregionId = 'aberdare_riparian_watershed',
  onSelectSnapshot,
  onTimelinePeriodChange,
  onNavigateToEvidence
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>('snap-2026');
  const [filterHorizon, setFilterHorizon] = useState<string>('all');
  const [activeMetric, setActiveMetric] = useState<'biomass' | 'canopy' | 'aquifer' | 'som' | 'biodiversity'>('biomass');
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1800);

  const filteredSnapshots = useMemo(() => {
    if (filterHorizon === 'all') return RESTORATION_TIMELINE_DATA;
    if (filterHorizon === 'historical') return RESTORATION_TIMELINE_DATA.filter(s => !s.isPredicted);
    if (filterHorizon === 'predicted') return RESTORATION_TIMELINE_DATA.filter(s => s.isPredicted);
    return RESTORATION_TIMELINE_DATA;
  }, [filterHorizon]);

  const selectedSnapshot = useMemo(() => {
    return RESTORATION_TIMELINE_DATA.find(s => s.id === selectedSnapshotId) || RESTORATION_TIMELINE_DATA[5];
  }, [selectedSnapshotId]);

  const selectedIndex = useMemo(() => {
    return RESTORATION_TIMELINE_DATA.findIndex(s => s.id === selectedSnapshotId);
  }, [selectedSnapshotId]);

  // Sync snapshot changes with parent knowledge graph
  useEffect(() => {
    if (selectedSnapshot) {
      if (onSelectSnapshot) onSelectSnapshot(selectedSnapshot);
      if (onTimelinePeriodChange) onTimelinePeriodChange(selectedSnapshot.year, selectedSnapshot);
    }
  }, [selectedSnapshotId, selectedSnapshot, onSelectSnapshot, onTimelinePeriodChange]);

  // Automated Timeline Playback Loop
  useEffect(() => {
    if (!isPlayingTimeline) return;
    const interval = setInterval(() => {
      setSelectedSnapshotId(prevId => {
        const currIdx = RESTORATION_TIMELINE_DATA.findIndex(s => s.id === prevId);
        const nextIdx = (currIdx + 1) % RESTORATION_TIMELINE_DATA.length;
        audioFeedback.playMicroTick();
        return RESTORATION_TIMELINE_DATA[nextIdx].id;
      });
    }, playbackSpeed);
    return () => clearInterval(interval);
  }, [isPlayingTimeline, playbackSpeed]);

  // Scroll sync event listener
  const handleScrollSync = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const scrollLeft = el.scrollLeft;
    const itemWidth = 205;
    const activeIndex = Math.min(
      RESTORATION_TIMELINE_DATA.length - 1,
      Math.max(0, Math.round(scrollLeft / itemWidth))
    );
    const snap = RESTORATION_TIMELINE_DATA[activeIndex];
    if (snap && snap.id !== selectedSnapshotId) {
      setSelectedSnapshotId(snap.id);
    }
  };

  // D3 Chronological Trajectory Chart
  useEffect(() => {
    if (!svgRef.current || !chartContainerRef.current) return;

    const containerWidth = chartContainerRef.current.clientWidth || 800;
    const height = 220;
    const margin = { top: 20, right: 30, bottom: 40, left: 55 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', containerWidth)
      .attr('height', height)
      .attr('viewBox', `0 0 ${containerWidth} ${height}`);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Gradient definitions
    const defs = svg.append('defs');
    
    // Historical Area Gradient
    const histGrad = defs.append('linearGradient')
      .attr('id', 'historical-traj-grad')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    histGrad.append('stop').attr('offset', '0%').attr('stop-color', '#10B981').attr('stop-opacity', 0.4);
    histGrad.append('stop').attr('offset', '100%').attr('stop-color', '#10B981').attr('stop-opacity', 0.0);

    // Predicted Area Gradient
    const predGrad = defs.append('linearGradient')
      .attr('id', 'predicted-traj-grad')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    predGrad.append('stop').attr('offset', '0%').attr('stop-color', '#C5A059').attr('stop-opacity', 0.35);
    predGrad.append('stop').attr('offset', '100%').attr('stop-color', '#C5A059').attr('stop-opacity', 0.0);

    // X and Y Scales
    const xScale = d3.scaleLinear()
      .domain([2016, 2050])
      .range([0, innerWidth]);

    const getMetricVal = (d: TimelineSnapshot) => {
      if (activeMetric === 'biomass') return d.biomassTCO2e;
      if (activeMetric === 'canopy') return d.canopyDensityPct;
      if (activeMetric === 'aquifer') return d.aquiferHeadBar;
      if (activeMetric === 'som') return d.soilOrganicMatterPct;
      return d.biodiversityScore;
    };

    const yMax = d3.max(RESTORATION_TIMELINE_DATA, getMetricVal) || 100;
    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.15])
      .range([innerHeight, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid-x')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(8).tickSize(-innerHeight).tickFormat(() => ''))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', '#ffffff').attr('stroke-opacity', 0.05));

    g.append('g')
      .attr('class', 'grid-y')
      .call(d3.axisLeft(yScale).ticks(4).tickSize(-innerWidth).tickFormat(() => ''))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', '#ffffff').attr('stroke-opacity', 0.05));

    // Present Line Marker (2026)
    const presentX = xScale(2026);
    g.append('line')
      .attr('x1', presentX)
      .attr('x2', presentX)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#38BDF8')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3,3');

    g.append('text')
      .attr('x', presentX + 4)
      .attr('y', 10)
      .attr('fill', '#38BDF8')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .text('Present (2026)');

    // Line Generators
    const lineGen = d3.line<TimelineSnapshot>()
      .x(d => xScale(d.year))
      .y(d => yScale(getMetricVal(d)))
      .curve(d3.curveMonotoneX);

    const areaGen = d3.area<TimelineSnapshot>()
      .x(d => xScale(d.year))
      .y0(innerHeight)
      .y1(d => yScale(getMetricVal(d)))
      .curve(d3.curveMonotoneX);

    // Split historical vs predicted
    const histData = RESTORATION_TIMELINE_DATA.filter(d => d.year <= 2026);
    const predData = RESTORATION_TIMELINE_DATA.filter(d => d.year >= 2026);

    // Draw Historical Area & Line
    g.append('path')
      .datum(histData)
      .attr('fill', 'url(#historical-traj-grad)')
      .attr('d', areaGen);

    g.append('path')
      .datum(histData)
      .attr('fill', 'none')
      .attr('stroke', '#10B981')
      .attr('stroke-width', 2.5)
      .attr('d', lineGen);

    // Draw Predicted Area & Line
    g.append('path')
      .datum(predData)
      .attr('fill', 'url(#predicted-traj-grad)')
      .attr('d', areaGen);

    g.append('path')
      .datum(predData)
      .attr('fill', 'none')
      .attr('stroke', '#C5A059')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '4,3')
      .attr('d', lineGen);

    // Interactive Nodes
    const nodeGroup = g.append('g').attr('class', 'timeline-nodes');

    RESTORATION_TIMELINE_DATA.forEach(d => {
      const cx = xScale(d.year);
      const cy = yScale(getMetricVal(d));
      const isSelected = d.id === selectedSnapshotId;

      const nodeG = nodeGroup.append('g')
        .attr('class', 'node-item')
        .attr('cursor', 'pointer')
        .on('click', () => {
          setSelectedSnapshotId(d.id);
          audioFeedback.playMicroTick();
          if (onSelectSnapshot) onSelectSnapshot(d);
        });

      if (isSelected) {
        nodeG.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 10)
          .attr('fill', d.isPredicted ? '#C5A059' : '#10B981')
          .attr('fill-opacity', 0.25)
          .attr('class', 'animate-ping');
      }

      nodeG.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', isSelected ? 6 : 4.5)
        .attr('fill', isSelected ? '#FFFFFF' : d.isPredicted ? '#C5A059' : '#10B981')
        .attr('stroke', d.isPredicted ? '#C5A059' : '#10B981')
        .attr('stroke-width', 2);

      nodeG.append('text')
        .attr('x', cx)
        .attr('y', cy - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('fill', isSelected ? '#FFFFFF' : '#A3A3A3')
        .text(d.year);
    });

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(8).tickFormat(d => `${d}`);
    const yAxis = d3.axisLeft(yScale).ticks(4);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .call(g => g.select('.domain').attr('stroke', '#444'))
      .call(g => g.selectAll('.tick text').attr('fill', '#888').attr('font-size', '9px').attr('font-family', 'monospace'));

    g.append('g')
      .call(yAxis)
      .call(g => g.select('.domain').attr('stroke', '#444'))
      .call(g => g.selectAll('.tick text').attr('fill', '#888').attr('font-size', '9px').attr('font-family', 'monospace'));

  }, [activeMetric, selectedSnapshotId, onSelectSnapshot]);

  const handleStep = (direction: 'prev' | 'next') => {
    const nextIdx = direction === 'next'
      ? Math.min(RESTORATION_TIMELINE_DATA.length - 1, selectedIndex + 1)
      : Math.max(0, selectedIndex - 1);
    setSelectedSnapshotId(RESTORATION_TIMELINE_DATA[nextIdx].id);
    audioFeedback.playMicroTick();
  };

  const getMetricLabel = () => {
    if (activeMetric === 'biomass') return 'Sequestered Biomass (tCO2e/ha)';
    if (activeMetric === 'canopy') return 'Crown Canopy Density (%)';
    if (activeMetric === 'aquifer') return 'Aquifer Piezometric Head (bar)';
    if (activeMetric === 'som') return 'Soil Organic Matter (SOM %)';
    return 'Composite Trophic Biodiversity Index (0-100)';
  };

  return (
    <div 
      id="restoration-timeline-view"
      className="bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm overflow-hidden space-y-4 shadow-2xl text-[#F5F5F0]"
    >
      {/* Top Header */}
      <div className="p-5 border-b border-[#F5F5F0]/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              D3.JS MULTI-TEMPORAL CHRONOLOGY • 2016 – 2050 BIOREGIONAL SNAPSHOTS
            </span>
            <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Ground Truth + P90 Model
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Restoration Timeline View
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans">
            Interactive D3 temporal curve tracking historical empirical milestones (2016–2026) alongside Pearl Do-Calculus predicted future climax states (2027–2050).
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPlayingTimeline(prev => !prev)}
            className={`px-3 py-1.5 rounded-sm border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlayingTimeline
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 animate-pulse'
                : 'bg-[#1C2620] border-emerald-500/40 text-emerald-300 hover:bg-[#25352c]'
            }`}
          >
            {isPlayingTimeline ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlayingTimeline ? 'Pause Playback' : 'Autoplay Timeline'}</span>
          </button>

          <div className="flex items-center gap-1 bg-[#171717] p-1 rounded-sm border border-[#F5F5F0]/10">
            <button
              onClick={() => handleStep('prev')}
              disabled={selectedIndex === 0}
              className="p-1.5 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#222] rounded disabled:opacity-30 cursor-pointer"
              title="Previous Snapshot"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[10px] font-mono text-[#C5A059] font-bold">
              {selectedIndex + 1}/{RESTORATION_TIMELINE_DATA.length}
            </span>
            <button
              onClick={() => handleStep('next')}
              disabled={selectedIndex === RESTORATION_TIMELINE_DATA.length - 1}
              className="p-1.5 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#222] rounded disabled:opacity-30 cursor-pointer"
              title="Next Snapshot"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Trajectory Metric Selector & Filters */}
      <div className="px-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs font-mono">
        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] uppercase text-[#F5F5F0]/40 flex items-center gap-1 mr-1 shrink-0">
            <TrendingUp className="w-3 h-3 text-[#C5A059]" />
            Trajectory Metric:
          </span>
          {[
            { id: 'biomass', label: 'Biomass Carbon' },
            { id: 'canopy', label: 'Canopy Density' },
            { id: 'aquifer', label: 'Aquifer Pressure' },
            { id: 'som', label: 'Soil Organic Matter' },
            { id: 'biodiversity', label: 'Biodiversity' }
          ].map(tab => {
            const isSelected = activeMetric === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveMetric(tab.id as any);
                  audioFeedback.playMicroTick();
                }}
                className={`px-2.5 py-1 rounded-xs border text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]'
                    : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Horizon Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#F5F5F0]/40 uppercase">Horizon:</span>
          {['all', 'historical', 'predicted'].map(h => (
            <button
              key={h}
              onClick={() => {
                setFilterHorizon(h);
                audioFeedback.playMicroTick();
              }}
              className={`px-2 py-0.5 rounded-xs border text-[10px] uppercase transition-all cursor-pointer ${
                filterHorizon === h
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50'
                  : 'bg-[#141414] text-[#F5F5F0]/50 border-[#F5F5F0]/10 hover:text-[#F5F5F0]'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* D3 Graph Stage */}
      <div className="px-5">
        <div 
          ref={chartContainerRef}
          className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm relative"
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50 pb-2">
            <span>{getMetricLabel()}</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-[#10B981]" /> Empirical Ground Truth (2016-2026)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 border-b border-dashed border-[#C5A059]" /> P90 Causal Projection (2027-2050)
              </span>
            </div>
          </div>
          <svg ref={svgRef} className="w-full h-auto block select-none" />
        </div>
      </div>

      {/* Horizontal Milestone Ribbon / Scroller */}
      <div className="px-5">
        <div 
          ref={scrollerRef}
          onScroll={handleScrollSync}
          className="flex items-stretch gap-2.5 overflow-x-auto pb-2 scrollbar-thin scroll-smooth"
        >
          {RESTORATION_TIMELINE_DATA.map((snap, idx) => {
            const isSelected = snap.id === selectedSnapshotId;
            return (
              <div
                key={snap.id}
                onClick={() => {
                  setSelectedSnapshotId(snap.id);
                  audioFeedback.playMicroTick();
                  if (onSelectSnapshot) onSelectSnapshot(snap);
                }}
                className={`p-3 rounded-sm border min-w-[190px] max-w-[210px] shrink-0 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-[#181818] border-[#C5A059] shadow-lg scale-[1.02]'
                    : 'bg-[#111111] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30 hover:bg-[#141414]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${
                    snap.isPredicted
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {snap.timeLabel}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-serif font-bold text-[#F5F5F0] line-clamp-1">
                    {snap.title}
                  </h4>
                  <p className="text-[10px] text-emerald-400 font-mono line-clamp-1 mt-0.5">
                    {snap.metricImpact}
                  </p>
                </div>

                <div className="pt-1.5 border-t border-[#F5F5F0]/10 flex items-center justify-between text-[9px] font-mono text-[#F5F5F0]/40">
                  <span>{snap.category}</span>
                  <span className="text-[#C5A059]">{snap.confidenceScore}% Conf</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Snapshot Deep Inspector Card */}
      <div className="px-5 pb-5">
        <div className="p-5 bg-[#111111] border border-[#C5A059]/40 rounded-sm space-y-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/10 pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded border ${
                  selectedSnapshot.isPredicted
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                }`}>
                  {selectedSnapshot.isPredicted ? 'Forward Ecological Projection' : 'Empirically Verified In-Situ'}
                </span>
                <span className="text-xs font-mono text-[#C5A059] font-bold">
                  Epoch: {selectedSnapshot.timeLabel}
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">
                {selectedSnapshot.title}
              </h3>
            </div>

            <div className="flex items-center gap-3 text-right font-mono text-xs">
              <div className="px-3 py-1.5 bg-[#090909] border border-emerald-500/30 rounded-xs">
                <span className="text-[9px] text-[#F5F5F0]/50 uppercase block">Impact Metric</span>
                <span className="text-emerald-300 font-bold">{selectedSnapshot.metricImpact}</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#F5F5F0]/80 font-sans leading-relaxed">
            {selectedSnapshot.description}
          </p>

          {/* Biophysical Telemetry Quad Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 bg-[#090909] border border-[#F5F5F0]/10 rounded-xs space-y-1">
              <span className="text-[9px] text-[#F5F5F0]/40 uppercase block">Biomass Carbon</span>
              <span className="text-sm font-bold text-emerald-400">{selectedSnapshot.biomassTCO2e} tCO2e/ha</span>
            </div>
            <div className="p-3 bg-[#090909] border border-[#F5F5F0]/10 rounded-xs space-y-1">
              <span className="text-[9px] text-[#F5F5F0]/40 uppercase block">Canopy Density</span>
              <span className="text-sm font-bold text-teal-300">{selectedSnapshot.canopyDensityPct}% Verified</span>
            </div>
            <div className="p-3 bg-[#090909] border border-[#F5F5F0]/10 rounded-xs space-y-1">
              <span className="text-[9px] text-[#F5F5F0]/40 uppercase block">Aquifer Pressure</span>
              <span className="text-sm font-bold text-cyan-300">+{selectedSnapshot.aquiferHeadBar} bar Head</span>
            </div>
            <div className="p-3 bg-[#090909] border border-[#F5F5F0]/10 rounded-xs space-y-1">
              <span className="text-[9px] text-[#F5F5F0]/40 uppercase block">Soil Organic Matter</span>
              <span className="text-sm font-bold text-amber-300">{selectedSnapshot.soilOrganicMatterPct}% SOM</span>
            </div>
          </div>

          {/* Epistemic Provenance Footer */}
          <div className="pt-3 border-t border-[#F5F5F0]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-[#F5F5F0]/50">
            <div>
              Source: <span className="text-[#F5F5F0]">{selectedSnapshot.verifiedByOrModel}</span> • Tier: <span className="text-[#C5A059]">{selectedSnapshot.epistemicTier}</span>
            </div>
            {selectedSnapshot.evidenceHash && (
              <div className="truncate flex items-center gap-1">
                <Hash className="w-3 h-3 text-emerald-400" />
                <span>Hash: {selectedSnapshot.evidenceHash.substring(0, 18)}...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
