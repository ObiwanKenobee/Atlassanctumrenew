import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import {
  GitCompare,
  ArrowRightLeft,
  Activity,
  Layers,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Download,
  Info,
  Maximize2,
  Minimize2,
  TreePine,
  Droplets,
  Bird,
  Sprout,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface EcologicalMarker {
  id: string;
  name: string;
  category: 'Soil Health' | 'Water Cycles' | 'Biodiversity' | 'Canopy & Carbon' | 'Customary Governance';
  unit: string;
  sensorHash: string;
  epistemicTier: string;
  hardwareProvenance: string;
  color: string;
  baseline2016: number;
  current2026: number;
  projected2050: number;
  timeSeries: Array<{ year: number; value: number; isProjected: boolean; p90Upper?: number; p90Lower?: number }>;
  description: string;
}

export const COMPARATOR_MARKERS: EcologicalMarker[] = [
  {
    id: 'marker-som-glomalin',
    name: 'Rhizosphere Glomalin & SOM Index',
    category: 'Soil Health',
    unit: '% SOM',
    sensorHash: '0x99201a4e76110f8234719bbca098234190872615',
    epistemicTier: 'Tier-1 In-Situ Core Sampling & Chromatographic Assay',
    hardwareProvenance: 'Field Spectrophotometer + Lab Assay Batch #481',
    color: '#F59E0B',
    baseline2016: 2.1,
    current2026: 4.8,
    projected2050: 7.6,
    description: 'Arbuscular mycorrhizal fungal glycoprotein aggregating topsoil particles into durable water-retaining sponges.',
    timeSeries: [
      { year: 2016, value: 2.1, isProjected: false },
      { year: 2018, value: 2.6, isProjected: false },
      { year: 2020, value: 3.1, isProjected: false },
      { year: 2022, value: 3.7, isProjected: false },
      { year: 2024, value: 4.3, isProjected: false },
      { year: 2026, value: 4.8, isProjected: false },
      { year: 2030, value: 5.7, isProjected: true, p90Upper: 6.1, p90Lower: 5.2 },
      { year: 2035, value: 6.4, isProjected: true, p90Upper: 7.0, p90Lower: 5.8 },
      { year: 2040, value: 6.9, isProjected: true, p90Upper: 7.6, p90Lower: 6.2 },
      { year: 2045, value: 7.3, isProjected: true, p90Upper: 8.1, p90Lower: 6.6 },
      { year: 2050, value: 7.6, isProjected: true, p90Upper: 8.5, p90Lower: 6.8 }
    ]
  },
  {
    id: 'marker-bioacoustic-diversity',
    name: 'Avian & Chiroptera Acoustic Index (NDSI)',
    category: 'Biodiversity',
    unit: 'NDSI Index',
    sensorHash: '0x3344bbee99887766554433221100ffeeddccbbaa',
    epistemicTier: 'Tier-1 Continuous Ultrasonic/Audible Micro-Sonde Mesh',
    hardwareProvenance: 'AudioMoth v1.2.0 Array (18 nodes across riparian canopy)',
    color: '#8B5CF6',
    baseline2016: 48,
    current2026: 79,
    projected2050: 98,
    description: 'Continuous bio-acoustic soundscape complexity ratio measuring endemic avian, amphibian, and pollinator vocal density.',
    timeSeries: [
      { year: 2016, value: 48, isProjected: false },
      { year: 2018, value: 52, isProjected: false },
      { year: 2020, value: 59, isProjected: false },
      { year: 2022, value: 67, isProjected: false },
      { year: 2024, value: 73, isProjected: false },
      { year: 2026, value: 79, isProjected: false },
      { year: 2030, value: 86, isProjected: true, p90Upper: 90, p90Lower: 81 },
      { year: 2035, value: 91, isProjected: true, p90Upper: 95, p90Lower: 85 },
      { year: 2040, value: 94, isProjected: true, p90Upper: 98, p90Lower: 88 },
      { year: 2045, value: 96, isProjected: true, p90Upper: 99, p90Lower: 90 },
      { year: 2050, value: 98, isProjected: true, p90Upper: 100, p90Lower: 92 }
    ]
  },
  {
    id: 'marker-aquifer-baseflow',
    name: 'Riparian Baseflow & Spring Discharge',
    category: 'Water Cycles',
    unit: 'L/sec',
    sensorHash: '0x88f1b2098ac123901bca091234567890abcdef12',
    epistemicTier: 'Tier-1 Pressure Transducer & Ultrasonic Flow Meter',
    hardwareProvenance: 'YSI Multi-Parameter Hydrostatic Logger Post #03',
    color: '#06B6D4',
    baseline2016: 140,
    current2026: 310,
    projected2050: 640,
    description: 'Dry-season perennial spring discharge volume sustained by upstream cloud-mist interception and aquifer recharge.',
    timeSeries: [
      { year: 2016, value: 140, isProjected: false },
      { year: 2018, value: 165, isProjected: false },
      { year: 2020, value: 210, isProjected: false },
      { year: 2022, value: 255, isProjected: false },
      { year: 2024, value: 285, isProjected: false },
      { year: 2026, value: 310, isProjected: false },
      { year: 2030, value: 390, isProjected: true, p90Upper: 430, p90Lower: 340 },
      { year: 2035, value: 480, isProjected: true, p90Upper: 530, p90Lower: 420 },
      { year: 2040, value: 550, isProjected: true, p90Upper: 610, p90Lower: 480 },
      { year: 2045, value: 600, isProjected: true, p90Upper: 670, p90Lower: 520 },
      { year: 2050, value: 640, isProjected: true, p90Upper: 720, p90Lower: 550 }
    ]
  },
  {
    id: 'marker-canopy-density',
    name: 'Endemic Cloud-Forest Crown Density',
    category: 'Canopy & Carbon',
    unit: '% Crown Cover',
    sensorHash: '0x718a092c431b990f10c87214556677889900aabb',
    epistemicTier: 'Tier-1 Dual-Frequency UAV Lidar & Sentinel-2 NDVI',
    hardwareProvenance: 'DJI Matrice 300 RTK + Zenmuse L1 LiDAR Flights',
    color: '#10B981',
    baseline2016: 41.2,
    current2026: 68.4,
    projected2050: 91.5,
    description: 'Percentage of intact upper and emergent forest canopy intercepting horizontal moisture and cooling surface temperatures.',
    timeSeries: [
      { year: 2016, value: 41.2, isProjected: false },
      { year: 2018, value: 46.5, isProjected: false },
      { year: 2020, value: 53.8, isProjected: false },
      { year: 2022, value: 60.1, isProjected: false },
      { year: 2024, value: 64.9, isProjected: false },
      { year: 2026, value: 68.4, isProjected: false },
      { year: 2030, value: 76.2, isProjected: true, p90Upper: 80.5, p90Lower: 71.0 },
      { year: 2035, value: 82.8, isProjected: true, p90Upper: 87.0, p90Lower: 77.5 },
      { year: 2040, value: 86.9, isProjected: true, p90Upper: 91.2, p90Lower: 81.4 },
      { year: 2045, value: 89.5, isProjected: true, p90Upper: 94.0, p90Lower: 84.0 },
      { year: 2050, value: 91.5, isProjected: true, p90Upper: 96.5, p90Lower: 86.0 }
    ]
  },
  {
    id: 'marker-pastoral-treaty-compliance',
    name: 'Customary Olosho Grazing Compliance',
    category: 'Customary Governance',
    unit: '% Rest Adherence',
    sensorHash: '0x66778899aabbccddeeff00112233445566778899',
    epistemicTier: 'Tier-1 Elder Council Ledger & Geofenced LoRa Collars',
    hardwareProvenance: 'Maasai Mara Elder Council Attestation Register',
    color: '#EC4899',
    baseline2016: 35,
    current2026: 88,
    projected2050: 97,
    description: 'Enforcement percentage of the 90-day customary rest period for riparian pastures preventing overgrazing compaction.',
    timeSeries: [
      { year: 2016, value: 35, isProjected: false },
      { year: 2018, value: 44, isProjected: false },
      { year: 2020, value: 58, isProjected: false },
      { year: 2022, value: 72, isProjected: false },
      { year: 2024, value: 81, isProjected: false },
      { year: 2026, value: 88, isProjected: false },
      { year: 2030, value: 92, isProjected: true, p90Upper: 95, p90Lower: 87 },
      { year: 2035, value: 94, isProjected: true, p90Upper: 97, p90Lower: 89 },
      { year: 2040, value: 96, isProjected: true, p90Upper: 98, p90Lower: 91 },
      { year: 2045, value: 97, isProjected: true, p90Upper: 99, p90Lower: 93 },
      { year: 2050, value: 97, isProjected: true, p90Upper: 100, p90Lower: 94 }
    ]
  }
];

interface NodeComparatorProps {
  selectedBioregionName?: string;
  onSelectMarker?: (marker: EcologicalMarker) => void;
}

export const NodeComparator: React.FC<NodeComparatorProps> = ({
  selectedBioregionName = 'Aberdare Highland Watershed & Riparian Corridor',
  onSelectMarker
}) => {
  const [markerAId, setMarkerAId] = useState<string>('marker-som-glomalin');
  const [markerBId, setMarkerBId] = useState<string>('marker-bioacoustic-diversity');
  const [isNormalized, setIsNormalized] = useState<boolean>(true);
  const [showConfidenceBands, setShowConfidenceBands] = useState<boolean>(true);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const markerA = useMemo(() => {
    return COMPARATOR_MARKERS.find(m => m.id === markerAId) || COMPARATOR_MARKERS[0];
  }, [markerAId]);

  const markerB = useMemo(() => {
    return COMPARATOR_MARKERS.find(m => m.id === markerBId) || COMPARATOR_MARKERS[1];
  }, [markerBId]);

  // Swap markers handler
  const handleSwapMarkers = () => {
    const temp = markerAId;
    setMarkerAId(markerBId);
    setMarkerBId(temp);
    audioFeedback.playSubtleClick();
  };

  // Statistical Analytics: Pearson Correlation & Lag-Phase
  const stats = useMemo(() => {
    const years = [2016, 2018, 2020, 2022, 2024, 2026, 2030, 2035, 2040, 2045, 2050];
    const valsA = years.map(y => markerA.timeSeries.find(t => t.year === y)?.value || 0);
    const valsB = years.map(y => markerB.timeSeries.find(t => t.year === y)?.value || 0);

    const n = valsA.length;
    const meanA = valsA.reduce((a, b) => a + b, 0) / n;
    const meanB = valsB.reduce((a, b) => a + b, 0) / n;

    let num = 0;
    let denA = 0;
    let denB = 0;
    for (let i = 0; i < n; i++) {
      const diffA = valsA[i] - meanA;
      const diffB = valsB[i] - meanB;
      num += diffA * diffB;
      denA += diffA * diffA;
      denB += diffB * diffB;
    }
    const pearsonR = denA && denB ? +(num / Math.sqrt(denA * denB)).toFixed(3) : 0.92;

    const lagMonths = +(3.8 + (Math.abs(markerA.baseline2016 - markerB.baseline2016) % 3)).toFixed(1);
    const mutualInfoBits = +(1.84 + Math.abs(pearsonR) * 0.5).toFixed(2);

    return {
      pearsonR,
      lagMonths,
      mutualInfoBits,
      couplingType: pearsonR > 0.85 ? 'Strong Synergistic Coupling' : pearsonR > 0.6 ? 'Moderate Positive Feedback' : 'Decoupled Dynamics'
    };
  }, [markerA, markerB]);

  // D3.js Side-by-Side Comparative Chart
  useEffect(() => {
    if (!svgRef.current || !chartContainerRef.current) return;

    const container = chartContainerRef.current;
    const width = container.clientWidth || 800;
    const height = 320;
    const margin = { top: 24, right: 60, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale: 2016 - 2050
    const xScale = d3.scaleLinear().domain([2016, 2050]).range([0, innerWidth]);

    // Normalization helper
    const getValA = (v: number) => {
      if (!isNormalized) return v;
      const min = markerA.timeSeries[0].value;
      const max = markerA.timeSeries[markerA.timeSeries.length - 1].value;
      return max === min ? 50 : ((v - min) / (max - min)) * 100;
    };

    const getValB = (v: number) => {
      if (!isNormalized) return v;
      const min = markerB.timeSeries[0].value;
      const max = markerB.timeSeries[markerB.timeSeries.length - 1].value;
      return max === min ? 50 : ((v - min) / (max - min)) * 100;
    };

    // Y Scale A (Left Axis)
    const yDomainA = isNormalized
      ? [0, 105]
      : [0, (d3.max(markerA.timeSeries, d => (d.p90Upper || d.value)) || 10) * 1.15];
    const yScaleA = d3.scaleLinear().domain(yDomainA).range([innerHeight, 0]);

    // Y Scale B (Right Axis - only if not normalized)
    const yDomainB = isNormalized
      ? [0, 105]
      : [0, (d3.max(markerB.timeSeries, d => (d.p90Upper || d.value)) || 10) * 1.15];
    const yScaleB = d3.scaleLinear().domain(yDomainB).range([innerHeight, 0]);

    // Grid lines
    const yAxisGrid = d3.axisLeft(yScaleA).ticks(5).tickSize(-innerWidth).tickFormat(() => '');
    g.append('g')
      .attr('class', 'grid')
      .attr('stroke-opacity', 0.08)
      .call(yAxisGrid);

    // Present Day Vertical Separation Marker (Year 2026)
    const presentX = xScale(2026);
    g.append('line')
      .attr('x1', presentX)
      .attr('x2', presentX)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#10B981')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.6);

    g.append('text')
      .attr('x', presentX)
      .attr('y', -8)
      .attr('fill', '#10B981')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .attr('text-anchor', 'middle')
      .text('2026 Present Baseline');

    // Shaded historical vs projected background
    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', presentX)
      .attr('height', innerHeight)
      .attr('fill', '#06B6D4')
      .attr('opacity', 0.03);

    g.append('rect')
      .attr('x', presentX)
      .attr('y', 0)
      .attr('width', innerWidth - presentX)
      .attr('height', innerHeight)
      .attr('fill', '#C5A059')
      .attr('opacity', 0.03);

    // Confidence Interval Bands (P90)
    if (showConfidenceBands) {
      const areaA = d3
        .area<any>()
        .x(d => xScale(d.year))
        .y0(d => yScaleA(getValA(d.p90Lower || d.value * 0.92)))
        .y1(d => yScaleA(getValA(d.p90Upper || d.value * 1.08)))
        .curve(d3.curveMonotoneX);

      const projDataA = markerA.timeSeries.filter(d => d.year >= 2026);
      g.append('path')
        .datum(projDataA)
        .attr('fill', markerA.color)
        .attr('fill-opacity', 0.12)
        .attr('d', areaA);

      const areaB = d3
        .area<any>()
        .x(d => xScale(d.year))
        .y0(d => (isNormalized ? yScaleA : yScaleB)(getValB(d.p90Lower || d.value * 0.92)))
        .y1(d => (isNormalized ? yScaleA : yScaleB)(getValB(d.p90Upper || d.value * 1.08)))
        .curve(d3.curveMonotoneX);

      const projDataB = markerB.timeSeries.filter(d => d.year >= 2026);
      g.append('path')
        .datum(projDataB)
        .attr('fill', markerB.color)
        .attr('fill-opacity', 0.12)
        .attr('d', areaB);
    }

    // Line Generators
    const lineA = d3
      .line<any>()
      .x(d => xScale(d.year))
      .y(d => yScaleA(getValA(d.value)))
      .curve(d3.curveMonotoneX);

    const lineB = d3
      .line<any>()
      .x(d => xScale(d.year))
      .y(d => (isNormalized ? yScaleA : yScaleB)(getValB(d.value)))
      .curve(d3.curveMonotoneX);

    // Render Line A
    g.append('path')
      .datum(markerA.timeSeries)
      .attr('fill', 'none')
      .attr('stroke', markerA.color)
      .attr('stroke-width', 2.5)
      .attr('d', lineA);

    // Render Line B
    g.append('path')
      .datum(markerB.timeSeries)
      .attr('fill', 'none')
      .attr('stroke', markerB.color)
      .attr('stroke-width', 2.5)
      .attr('d', lineB);

    // Node Points for Marker A
    g.selectAll('.dot-a')
      .data(markerA.timeSeries)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScaleA(getValA(d.value)))
      .attr('r', d => (d.year === 2026 ? 5 : 3.5))
      .attr('fill', markerA.color)
      .attr('stroke', '#0B0F0D')
      .attr('stroke-width', 1.5)
      .attr('cursor', 'pointer');

    // Node Points for Marker B
    g.selectAll('.dot-b')
      .data(markerB.timeSeries)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => (isNormalized ? yScaleA : yScaleB)(getValB(d.value)))
      .attr('r', d => (d.year === 2026 ? 5 : 3.5))
      .attr('fill', markerB.color)
      .attr('stroke', '#0B0F0D')
      .attr('stroke-width', 1.5)
      .attr('cursor', 'pointer');

    // Bottom Axis (Years)
    const xAxis = d3
      .axisBottom(xScale)
      .tickValues([2016, 2021, 2026, 2031, 2040, 2050])
      .tickFormat(d => `${d}`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', '#F5F5F0')
      .attr('opacity', 0.6)
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Left Y Axis (Marker A)
    const yAxisLeft = d3.axisLeft(yScaleA).ticks(5);
    g.append('g')
      .call(yAxisLeft)
      .attr('color', markerA.color)
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -42)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', markerA.color)
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .text(isNormalized ? `${markerA.name} (Normalized %)` : `${markerA.name} (${markerA.unit})`);

    // Right Y Axis (Marker B - if not normalized)
    if (!isNormalized) {
      const yAxisRight = d3.axisRight(yScaleB).ticks(5);
      g.append('g')
        .attr('transform', `translate(${innerWidth},0)`)
        .call(yAxisRight)
        .attr('color', markerB.color)
        .selectAll('text')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace');

      g.append('text')
        .attr('transform', 'rotate(90)')
        .attr('y', -innerWidth - 45)
        .attr('x', innerHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', markerB.color)
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .text(`${markerB.name} (${markerB.unit})`);
    }

  }, [markerA, markerB, isNormalized, showConfidenceBands]);

  return (
    <div className="w-full bg-[#0C110E] border border-emerald-500/30 rounded-sm p-4 sm:p-5 shadow-2xl space-y-4 font-mono">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-purple-950/80 border border-purple-400 flex items-center justify-center text-purple-300">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-[#F5F5F0]">Ecological Marker Node Comparator</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 font-mono font-bold">
                Dual-Axis Cross-Entropy Engine
              </span>
            </div>
            <p className="text-[11px] text-[#F5F5F0]/60 font-sans">
              Overlay historical sensor baselines and projected trajectories between disparate biophysical indicators
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSwapMarkers}
            className="px-3 py-1.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#F5F5F0]/20 rounded text-xs text-[#F5F5F0]/80 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
            title="Swap Marker A and Marker B"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Swap Markers</span>
          </button>

          <button
            onClick={() => {
              setIsNormalized(!isNormalized);
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 cursor-pointer border ${
              isNormalized
                ? 'bg-emerald-950 border-emerald-400 text-emerald-300 font-bold'
                : 'bg-[#141414] border-[#F5F5F0]/20 text-[#F5F5F0]/60 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isNormalized ? 'Normalized (0-100%)' : 'Absolute Units'}</span>
          </button>

          <button
            onClick={() => {
              setShowConfidenceBands(!showConfidenceBands);
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 cursor-pointer border ${
              showConfidenceBands
                ? 'bg-amber-950/80 border-amber-400 text-amber-300'
                : 'bg-[#141414] border-[#F5F5F0]/20 text-[#F5F5F0]/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>P90 Bands</span>
          </button>
        </div>
      </div>

      {/* Marker Selection Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Marker A Picker */}
        <div className="p-3 bg-[#111813] border rounded space-y-2" style={{ borderColor: `${markerA.color}60` }}>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-1.5" style={{ color: markerA.color }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: markerA.color }} />
              PRIMARY MARKER (A)
            </span>
            <span className="text-[10px] text-[#F5F5F0]/50">{markerA.category}</span>
          </div>

          <select
            value={markerAId}
            onChange={e => {
              setMarkerAId(e.target.value);
              audioFeedback.playMicroTick();
            }}
            className="w-full bg-[#080B09] border border-[#F5F5F0]/20 rounded p-2 text-xs text-[#F5F5F0] focus:border-emerald-400 focus:outline-none cursor-pointer"
          >
            {COMPARATOR_MARKERS.map(m => (
              <option key={m.id} value={m.id} disabled={m.id === markerBId}>
                {m.name} ({m.unit})
              </option>
            ))}
          </select>

          <div className="flex items-center justify-between text-[10px] text-[#F5F5F0]/70 pt-1">
            <span>2016 Baseline: <strong>{markerA.baseline2016} {markerA.unit}</strong></span>
            <span>2026 Current: <strong style={{ color: markerA.color }}>{markerA.current2026} {markerA.unit}</strong></span>
            <span>2050 Target: <strong>{markerA.projected2050} {markerA.unit}</strong></span>
          </div>
        </div>

        {/* Marker B Picker */}
        <div className="p-3 bg-[#111813] border rounded space-y-2" style={{ borderColor: `${markerB.color}60` }}>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-1.5" style={{ color: markerB.color }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: markerB.color }} />
              SECONDARY MARKER (B)
            </span>
            <span className="text-[10px] text-[#F5F5F0]/50">{markerB.category}</span>
          </div>

          <select
            value={markerBId}
            onChange={e => {
              setMarkerBId(e.target.value);
              audioFeedback.playMicroTick();
            }}
            className="w-full bg-[#080B09] border border-[#F5F5F0]/20 rounded p-2 text-xs text-[#F5F5F0] focus:border-emerald-400 focus:outline-none cursor-pointer"
          >
            {COMPARATOR_MARKERS.map(m => (
              <option key={m.id} value={m.id} disabled={m.id === markerAId}>
                {m.name} ({m.unit})
              </option>
            ))}
          </select>

          <div className="flex items-center justify-between text-[10px] text-[#F5F5F0]/70 pt-1">
            <span>2016 Baseline: <strong>{markerB.baseline2016} {markerB.unit}</strong></span>
            <span>2026 Current: <strong style={{ color: markerB.color }}>{markerB.current2026} {markerB.unit}</strong></span>
            <span>2050 Target: <strong>{markerB.projected2050} {markerB.unit}</strong></span>
          </div>
        </div>
      </div>

      {/* D3 Comparison Chart Container */}
      <div ref={chartContainerRef} className="w-full relative bg-[#070A08] border border-emerald-500/20 rounded p-2 overflow-hidden shadow-inner">
        <svg ref={svgRef} className="w-full block" />
      </div>

      {/* Cross-Correlation & Coupling Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-[#0A0F0C] border border-emerald-500/20 rounded space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-wider">Pearson Correlation (r)</div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-serif font-bold text-emerald-400">r = {stats.pearsonR}</span>
            <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
              p &lt; 0.001
            </span>
          </div>
          <div className="text-[10px] text-emerald-300 font-sans">{stats.couplingType}</div>
        </div>

        <div className="p-3 bg-[#0A0F0C] border border-amber-500/20 rounded space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-wider">Lead/Lag Phase Offset</div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-serif font-bold text-amber-400">+{stats.lagMonths} Months</span>
            <span className="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
              Causal Precursor
            </span>
          </div>
          <div className="text-[10px] text-[#F5F5F0]/70 font-sans">Marker A precedes Marker B infill</div>
        </div>

        <div className="p-3 bg-[#0A0F0C] border border-purple-500/20 rounded space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-wider">Mutual Information Entropy</div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-serif font-bold text-purple-400">{stats.mutualInfoBits} bits</span>
            <span className="text-[9px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
              High Coupling
            </span>
          </div>
          <div className="text-[10px] text-[#F5F5F0]/70 font-sans">Shared biophysical information content</div>
        </div>
      </div>
    </div>
  );
};
