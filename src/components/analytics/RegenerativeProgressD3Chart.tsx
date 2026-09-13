import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Maximize2, 
  Sliders, 
  Layers, 
  Download, 
  RotateCcw,
  CheckCircle2,
  TreeDeciduous,
  Droplets,
  Sprout,
  Activity,
  Info
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface EcologicalMetricSeries {
  id: string;
  name: string;
  category: 'canopy' | 'soil' | 'hydrology' | 'biodiversity' | 'composite';
  unit: string;
  color: string;
  baselineValue: number;
  currentValue: number;
  changePct: number;
  description: string;
  dataPoints: {
    date: string; // YYYY-MM
    timestamp: number;
    value: number;
    counterfactualValue: number; // what would happen without intervention
    confidenceLower: number;
    confidenceUpper: number;
    satellitePass?: string;
    milestone?: string;
  }[];
}

export const MOCK_REGENERATIVE_LONGITUDINAL_DATA: EcologicalMetricSeries[] = [
  {
    id: 'canopy-ndvi',
    name: 'Vegetative Canopy & NDVI Density',
    category: 'canopy',
    unit: 'NDVI Index (0-1.0)',
    color: '#10B981', // Emerald
    baselineValue: 0.38,
    currentValue: 0.74,
    changePct: +94.7,
    description: 'Longitudinal optical reflectance across 84,000 hectares of high-canopy indigenous forest.',
    dataPoints: [
      { date: '2023-01', timestamp: new Date('2023-01-01').getTime(), value: 0.38, counterfactualValue: 0.37, confidenceLower: 0.35, confidenceUpper: 0.41, milestone: 'Baseline Ground Sensor Grid Installed' },
      { date: '2023-04', timestamp: new Date('2023-04-01').getTime(), value: 0.41, counterfactualValue: 0.36, confidenceLower: 0.38, confidenceUpper: 0.44 },
      { date: '2023-07', timestamp: new Date('2023-07-01').getTime(), value: 0.45, counterfactualValue: 0.35, confidenceLower: 0.42, confidenceUpper: 0.48, satellitePass: 'Sentinel-2 Multispectral MSI Pass #402' },
      { date: '2023-10', timestamp: new Date('2023-10-01').getTime(), value: 0.49, counterfactualValue: 0.34, confidenceLower: 0.46, confidenceUpper: 0.52 },
      { date: '2024-01', timestamp: new Date('2024-01-01').getTime(), value: 0.53, counterfactualValue: 0.33, confidenceLower: 0.50, confidenceUpper: 0.56, milestone: '1.2M Indigenous Seedlings Inoculated' },
      { date: '2024-04', timestamp: new Date('2024-04-01').getTime(), value: 0.57, counterfactualValue: 0.33, confidenceLower: 0.54, confidenceUpper: 0.60 },
      { date: '2024-07', timestamp: new Date('2024-07-01').getTime(), value: 0.61, counterfactualValue: 0.32, confidenceLower: 0.58, confidenceUpper: 0.64, satellitePass: 'PlanetScope 3m Surface Orthomosaic' },
      { date: '2024-10', timestamp: new Date('2024-10-01').getTime(), value: 0.64, counterfactualValue: 0.31, confidenceLower: 0.61, confidenceUpper: 0.67 },
      { date: '2025-01', timestamp: new Date('2025-01-01').getTime(), value: 0.67, counterfactualValue: 0.31, confidenceLower: 0.64, confidenceUpper: 0.70, milestone: 'Automated Drone Seedling Swarm Deployment' },
      { date: '2025-04', timestamp: new Date('2025-04-01').getTime(), value: 0.70, counterfactualValue: 0.30, confidenceLower: 0.67, confidenceUpper: 0.73 },
      { date: '2025-07', timestamp: new Date('2025-07-01').getTime(), value: 0.72, counterfactualValue: 0.29, confidenceLower: 0.69, confidenceUpper: 0.75, satellitePass: 'Landsat-9 OLI-2 NIR Verification' },
      { date: '2025-10', timestamp: new Date('2025-10-01').getTime(), value: 0.74, counterfactualValue: 0.29, confidenceLower: 0.71, confidenceUpper: 0.77, milestone: 'Canopy Density Reaches Old-Growth Resilience' }
    ]
  },
  {
    id: 'soil-carbon',
    name: 'Soil Organic Carbon (SOC) Accretion',
    category: 'soil',
    unit: 't/ha Carbon',
    color: '#C5A059', // Gold/Amber
    baselineValue: 18.2,
    currentValue: 34.6,
    changePct: +90.1,
    description: 'Measured via depth-resolved MIR spectroscopy cores and eddy-covariance carbon flux towers.',
    dataPoints: [
      { date: '2023-01', timestamp: new Date('2023-01-01').getTime(), value: 18.2, counterfactualValue: 17.9, confidenceLower: 17.1, confidenceUpper: 19.3, milestone: 'Biochar & Compost Micro-inoculation Initiated' },
      { date: '2023-04', timestamp: new Date('2023-04-01').getTime(), value: 19.8, counterfactualValue: 17.7, confidenceLower: 18.6, confidenceUpper: 21.0 },
      { date: '2023-07', timestamp: new Date('2023-07-01').getTime(), value: 21.5, counterfactualValue: 17.4, confidenceLower: 20.2, confidenceUpper: 22.8 },
      { date: '2023-10', timestamp: new Date('2023-10-01').getTime(), value: 23.4, counterfactualValue: 17.1, confidenceLower: 22.0, confidenceUpper: 24.8, satellitePass: 'Airborne Hyper-spectral Core Scan' },
      { date: '2024-01', timestamp: new Date('2024-01-01').getTime(), value: 25.1, counterfactualValue: 16.9, confidenceLower: 23.6, confidenceUpper: 26.6 },
      { date: '2024-04', timestamp: new Date('2024-04-01').getTime(), value: 27.0, counterfactualValue: 16.6, confidenceLower: 25.4, confidenceUpper: 28.6 },
      { date: '2024-07', timestamp: new Date('2024-07-01').getTime(), value: 28.9, counterfactualValue: 16.3, confidenceLower: 27.1, confidenceUpper: 30.7, milestone: 'Mycorrhizal Fungi Fungal Networks Established' },
      { date: '2024-10', timestamp: new Date('2024-10-01').getTime(), value: 30.5, counterfactualValue: 16.1, confidenceLower: 28.8, confidenceUpper: 32.2 },
      { date: '2025-01', timestamp: new Date('2025-01-01').getTime(), value: 32.0, counterfactualValue: 15.9, confidenceLower: 30.1, confidenceUpper: 33.9 },
      { date: '2025-04', timestamp: new Date('2025-04-01').getTime(), value: 33.2, counterfactualValue: 15.6, confidenceLower: 31.4, confidenceUpper: 35.0 },
      { date: '2025-07', timestamp: new Date('2025-07-01').getTime(), value: 34.0, counterfactualValue: 15.4, confidenceLower: 32.1, confidenceUpper: 35.9 },
      { date: '2025-10', timestamp: new Date('2025-10-01').getTime(), value: 34.6, counterfactualValue: 15.1, confidenceLower: 32.6, confidenceUpper: 36.6, milestone: 'Carbon Floor Certified on Epistemic Ledger' }
    ]
  },
  {
    id: 'groundwater-aquifer',
    name: 'Aquifer Infiltration & Groundwater Volume',
    category: 'hydrology',
    unit: 'MCM (Million Cubic Meters)',
    color: '#38BDF8', // Cyan
    baselineValue: 42.0,
    currentValue: 88.5,
    changePct: +110.7,
    description: 'Tracked using GRACE-FO satellite gravimetry and calibrated piezoelectric piezometer arrays.',
    dataPoints: [
      { date: '2023-01', timestamp: new Date('2023-01-01').getTime(), value: 42.0, counterfactualValue: 41.2, confidenceLower: 39.5, confidenceUpper: 44.5, milestone: 'Swale Retention Cascadia Construction' },
      { date: '2023-04', timestamp: new Date('2023-04-01').getTime(), value: 47.5, counterfactualValue: 40.5, confidenceLower: 44.8, confidenceUpper: 50.2 },
      { date: '2023-07', timestamp: new Date('2023-07-01').getTime(), value: 53.0, counterfactualValue: 39.8, confidenceLower: 50.1, confidenceUpper: 55.9 },
      { date: '2023-10', timestamp: new Date('2023-10-01').getTime(), value: 58.2, counterfactualValue: 39.0, confidenceLower: 55.0, confidenceUpper: 61.4, satellitePass: 'NASA GRACE-FO Tellus Mascon Basin Pass' },
      { date: '2024-01', timestamp: new Date('2024-01-01').getTime(), value: 63.8, counterfactualValue: 38.2, confidenceLower: 60.5, confidenceUpper: 67.1 },
      { date: '2024-04', timestamp: new Date('2024-04-01').getTime(), value: 69.5, counterfactualValue: 37.6, confidenceLower: 65.8, confidenceUpper: 73.2 },
      { date: '2024-07', timestamp: new Date('2024-07-01').getTime(), value: 75.1, counterfactualValue: 36.9, confidenceLower: 71.2, confidenceUpper: 79.0, milestone: 'Sand Dam Cascades Completed (24 Structures)' },
      { date: '2024-10', timestamp: new Date('2024-10-01').getTime(), value: 79.6, counterfactualValue: 36.1, confidenceLower: 75.4, confidenceUpper: 83.8 },
      { date: '2025-01', timestamp: new Date('2025-01-01').getTime(), value: 83.2, counterfactualValue: 35.4, confidenceLower: 78.9, confidenceUpper: 87.5 },
      { date: '2025-04', timestamp: new Date('2025-04-01').getTime(), value: 85.8, counterfactualValue: 34.8, confidenceLower: 81.3, confidenceUpper: 90.3 },
      { date: '2025-07', timestamp: new Date('2025-07-01').getTime(), value: 87.4, counterfactualValue: 34.1, confidenceLower: 82.8, confidenceUpper: 92.0 },
      { date: '2025-10', timestamp: new Date('2025-10-01').getTime(), value: 88.5, counterfactualValue: 33.5, confidenceLower: 83.9, confidenceUpper: 93.1, milestone: 'Subsurface Reservoir Capacity Restored to Historical High' }
    ]
  },
  {
    id: 'shannon-biodiversity',
    name: 'Shannon-Wiener Biodiversity Index',
    category: 'biodiversity',
    unit: 'H\' Diversity Score (0-5.0)',
    color: '#A855F7', // Purple
    baselineValue: 1.45,
    currentValue: 3.82,
    changePct: +163.4,
    description: 'Acoustic bio-monitor audio passes combined with eDNA stream water filtering and camera traps.',
    dataPoints: [
      { date: '2023-01', timestamp: new Date('2023-01-01').getTime(), value: 1.45, counterfactualValue: 1.42, confidenceLower: 1.30, confidenceUpper: 1.60, milestone: 'Bio-acoustic Grid Deployed' },
      { date: '2023-04', timestamp: new Date('2023-04-01').getTime(), value: 1.80, counterfactualValue: 1.39, confidenceLower: 1.62, confidenceUpper: 1.98 },
      { date: '2023-07', timestamp: new Date('2023-07-01').getTime(), value: 2.15, counterfactualValue: 1.35, confidenceLower: 1.95, confidenceUpper: 2.35 },
      { date: '2023-10', timestamp: new Date('2023-10-01').getTime(), value: 2.50, counterfactualValue: 1.31, confidenceLower: 2.28, confidenceUpper: 2.72, satellitePass: 'EcoSound Spaceborne Soundscape Sensor' },
      { date: '2024-01', timestamp: new Date('2024-01-01').getTime(), value: 2.85, counterfactualValue: 1.28, confidenceLower: 2.61, confidenceUpper: 3.09 },
      { date: '2024-04', timestamp: new Date('2024-04-01').getTime(), value: 3.12, counterfactualValue: 1.24, confidenceLower: 2.86, confidenceUpper: 3.38 },
      { date: '2024-07', timestamp: new Date('2024-07-01').getTime(), value: 3.38, counterfactualValue: 1.20, confidenceLower: 3.10, confidenceUpper: 3.66, milestone: 'Apex Predator & Pollinator Corridor Reconnected' },
      { date: '2024-10', timestamp: new Date('2024-10-01').getTime(), value: 3.55, counterfactualValue: 1.17, confidenceLower: 3.26, confidenceUpper: 3.84 },
      { date: '2025-01', timestamp: new Date('2025-01-01').getTime(), value: 3.68, counterfactualValue: 1.14, confidenceLower: 3.38, confidenceUpper: 3.98 },
      { date: '2025-04', timestamp: new Date('2025-04-01').getTime(), value: 3.75, counterfactualValue: 1.11, confidenceLower: 3.44, confidenceUpper: 4.06 },
      { date: '2025-07', timestamp: new Date('2025-07-01').getTime(), value: 3.80, counterfactualValue: 1.08, confidenceLower: 3.49, confidenceUpper: 4.11 },
      { date: '2025-10', timestamp: new Date('2025-10-01').getTime(), value: 3.82, counterfactualValue: 1.05, confidenceLower: 3.50, confidenceUpper: 4.14, milestone: '42 Endangered Endemic Species Re-established' }
    ]
  }
];

interface RegenerativeProgressD3ChartProps {
  className?: string;
  onInspectPoint?: (point: any) => void;
}

export const RegenerativeProgressD3Chart: React.FC<RegenerativeProgressD3ChartProps> = ({
  className = '',
  onInspectPoint
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [selectedMetricId, setSelectedMetricId] = useState<string>('canopy-ndvi');
  const [showCounterfactual, setShowCounterfactual] = useState<boolean>(true);
  const [showConfidenceBands, setShowConfidenceBands] = useState<boolean>(true);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<any | null>(null);

  const currentSeries = useMemo(() => {
    return MOCK_REGENERATIVE_LONGITUDINAL_DATA.find(s => s.id === selectedMetricId) || MOCK_REGENERATIVE_LONGITUDINAL_DATA[0];
  }, [selectedMetricId]);

  // Render D3 Chart
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // clear prior elements

    const width = containerRef.current.clientWidth || 800;
    const height = 400;
    const margin = { top: 30, right: 40, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const data = currentSeries.dataPoints;

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.timestamp)) as [Date, Date])
      .range([0, innerWidth]);

    const yMin = Math.min(
      d3.min(data, d => Math.min(d.value, d.counterfactualValue, d.confidenceLower)) || 0,
      0
    );
    const yMax = (d3.max(data, d => Math.max(d.value, d.counterfactualValue, d.confidenceUpper)) || 1) * 1.15;

    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .nice()
      .range([innerHeight, 0]);

    // Gradient definitions
    const defs = svg.append('defs');
    
    // Confidence band area gradient
    const areaGradient = defs.append('linearGradient')
      .attr('id', `area-grad-${currentSeries.id}`)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');

    areaGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', currentSeries.color)
      .attr('stop-opacity', 0.35);

    areaGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', currentSeries.color)
      .attr('stop-opacity', 0.02);

    // Grid lines
    const yGrid = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(() => '')
      .ticks(6);

    g.append('g')
      .attr('class', 'grid y-grid')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', 'rgba(245, 245, 240, 0.07)')
      .attr('stroke-dasharray', '3 3');

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(6)
      .tickFormat(d3.timeFormat('%b %Y') as any);

    const yAxis = d3.axisLeft(yScale)
      .ticks(6);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', 'rgba(245, 245, 240, 0.4)')
      .selectAll('text')
      .attr('fill', 'rgba(245, 245, 240, 0.7)')
      .attr('font-family', 'monospace')
      .attr('font-size', '11px');

    g.append('g')
      .call(yAxis)
      .attr('color', 'rgba(245, 245, 240, 0.4)')
      .selectAll('text')
      .attr('fill', 'rgba(245, 245, 240, 0.7)')
      .attr('font-family', 'monospace')
      .attr('font-size', '11px');

    // Confidence Band Area (Epistemic upper/lower bounds)
    if (showConfidenceBands) {
      const confidenceArea = d3.area<any>()
        .x(d => xScale(new Date(d.timestamp)))
        .y0(d => yScale(d.confidenceLower))
        .y1(d => yScale(d.confidenceUpper))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', currentSeries.color)
        .attr('opacity', 0.12)
        .attr('d', confidenceArea);
    }

    // Shaded Area Under Primary Regenerative Curve
    const areaGenerator = d3.area<any>()
      .x(d => xScale(new Date(d.timestamp)))
      .y0(innerHeight)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', `url(#area-grad-${currentSeries.id})`)
      .attr('d', areaGenerator);

    // Counterfactual Status Quo Line (Degradation baseline)
    if (showCounterfactual) {
      const counterfactualLine = d3.line<any>()
        .x(d => xScale(new Date(d.timestamp)))
        .y(d => yScale(d.counterfactualValue))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#EF4444')
        .attr('stroke-width', 1.8)
        .attr('stroke-dasharray', '4 4')
        .attr('opacity', 0.8)
        .attr('d', counterfactualLine);
    }

    // Primary Regenerative Progress Line
    const lineGenerator = d3.line<any>()
      .x(d => xScale(new Date(d.timestamp)))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    const path = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', currentSeries.color)
      .attr('stroke-width', 2.8)
      .attr('d', lineGenerator);

    // Line entry drawing animation
    const totalLength = path.node()?.getTotalLength() || 1000;
    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Milestone & Observation Data Points
    const pointsGroup = g.append('g').attr('class', 'data-points');

    data.forEach(d => {
      const cx = xScale(new Date(d.timestamp));
      const cy = yScale(d.value);
      const hasMilestone = !!d.milestone;

      const circle = pointsGroup.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', hasMilestone ? 5 : 3.5)
        .attr('fill', hasMilestone ? '#FFFFFF' : currentSeries.color)
        .attr('stroke', '#0A0A0A')
        .attr('stroke-width', 1.5)
        .attr('class', 'cursor-pointer transition-all')
        .on('mouseenter', function() {
          d3.select(this)
            .attr('r', 7)
            .attr('stroke', '#FFFFFF')
            .attr('stroke-width', 2);
          setHoveredDataPoint(d);
          audioFeedback.playMicroTick();
          if (onInspectPoint) onInspectPoint(d);
        })
        .on('mouseleave', function() {
          d3.select(this)
            .attr('r', hasMilestone ? 5 : 3.5)
            .attr('stroke', '#0A0A0A')
            .attr('stroke-width', 1.5);
        });

      if (hasMilestone) {
        // Subtle outer pulse ring for historical covenant milestones
        pointsGroup.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 9)
          .attr('fill', 'none')
          .attr('stroke', currentSeries.color)
          .attr('stroke-width', 1)
          .attr('opacity', 0.5)
          .attr('stroke-dasharray', '2 2');
      }
    });

    // Vertical hover guide line crosshair
    const crosshairLine = g.append('line')
      .attr('class', 'crosshair')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', 'rgba(245, 245, 240, 0.35)')
      .attr('stroke-dasharray', '2 2')
      .style('opacity', 0);

    // Invisible mousemove capture rect
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .on('mousemove', function(event) {
        const [mx] = d3.pointer(event);
        const date = xScale.invert(mx);
        
        // Find closest point
        const bisect = d3.bisector((d: any) => new Date(d.timestamp)).center;
        const index = bisect(data, date);
        const closestPoint = data[index];

        if (closestPoint) {
          const cx = xScale(new Date(closestPoint.timestamp));
          crosshairLine
            .attr('x1', cx)
            .attr('x2', cx)
            .style('opacity', 1);
          setHoveredDataPoint(closestPoint);
        }
      })
      .on('mouseleave', function() {
        crosshairLine.style('opacity', 0);
      });

  }, [currentSeries, showCounterfactual, showConfidenceBands]);

  return (
    <div className={`p-6 rounded-md bg-[#0C100D] border border-[#F5F5F0]/15 space-y-6 shadow-2xl ${className}`}>
      {/* Chart Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-[0.2em]">
              D3 LONGITUDINAL TRAJECTORY • VERIFIED RESTORATION CHRONOLOGY
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-[#F5F5F0] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#C5A059]" />
            Regenerative Progress & Bioregional Recovery
          </h3>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 font-sans max-w-2xl">
            Multi-year longitudinal improvement across key ecological health markers, comparing verified on-ground interventions against counterfactual status-quo degradation baselines.
          </p>
        </div>

        {/* View Controls & Toggles */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 text-xs font-mono">
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setShowCounterfactual(!showCounterfactual);
            }}
            className={`px-3 py-1.5 rounded-sm border transition-all flex items-center gap-1.5 cursor-pointer ${
              showCounterfactual
                ? 'bg-red-950/60 border-red-500/50 text-red-300 font-bold'
                : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/50 hover:text-white'
            }`}
          >
            <span className="w-2 h-0.5 bg-red-400 border-b border-dashed border-red-400 inline-block" />
            <span>Counterfactual Baseline</span>
          </button>

          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setShowConfidenceBands(!showConfidenceBands);
            }}
            className={`px-3 py-1.5 rounded-sm border transition-all flex items-center gap-1.5 cursor-pointer ${
              showConfidenceBands
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-bold'
                : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/50 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Confidence Bounds (±)</span>
          </button>
        </div>
      </div>

      {/* Metric Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MOCK_REGENERATIVE_LONGITUDINAL_DATA.map(m => {
          const isSelected = selectedMetricId === m.id;
          return (
            <div
              key={m.id}
              onClick={() => {
                audioFeedback.playSubtleClick();
                setSelectedMetricId(m.id);
              }}
              className={`p-3.5 rounded-sm border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#18231C] border-[#C5A059] shadow-lg'
                  : 'bg-[#090C0A] border-[#F5F5F0]/10 hover:border-[#C5A059]/40 hover:bg-[#111612]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/60 mb-1">
                <span className="uppercase">{m.category}</span>
                <span className="text-emerald-400 font-bold">{m.changePct > 0 ? `+${m.changePct}%` : `${m.changePct}%`}</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">{m.name}</h4>
              <div className="flex items-baseline gap-2 mt-2 font-mono">
                <span className="text-lg font-bold" style={{ color: m.color }}>
                  {m.currentValue}
                </span>
                <span className="text-[10px] text-[#F5F5F0]/50">
                  from {m.baselineValue} ({m.unit})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* D3 Canvas Stage Container */}
      <div className="p-4 rounded-sm bg-[#060807] border border-[#F5F5F0]/15 space-y-3" ref={containerRef}>
        <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F0]/60 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentSeries.color }} />
            <span className="font-bold text-white">{currentSeries.name}</span>
            <span>•</span>
            <span>{currentSeries.unit}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: currentSeries.color }} />
              <span className="text-white">Regenerative Interventions</span>
            </div>
            {showCounterfactual && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-red-400 inline-block border-b border-dashed border-red-400" />
                <span className="text-red-400">Degradation Baseline</span>
              </div>
            )}
          </div>
        </div>

        {/* SVG Drawing Surface */}
        <div className="w-full relative min-h-[400px]">
          <svg ref={svgRef} className="w-full select-none overflow-visible" />
        </div>

        {/* Hovered Point Telemetry Bar */}
        <div className="p-3 bg-black/60 rounded border border-[#F5F5F0]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
          {hoveredDataPoint ? (
            <>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span className="text-white font-bold">{hoveredDataPoint.date} Observation:</span>
                <span className="text-emerald-400 font-bold">{hoveredDataPoint.value} {currentSeries.unit}</span>
                {showCounterfactual && (
                  <span className="text-red-400/80 text-[11px]">
                    (vs {hoveredDataPoint.counterfactualValue} counterfactual)
                  </span>
                )}
              </div>

              {hoveredDataPoint.milestone && (
                <div className="text-[11px] text-amber-300 font-sans flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Milestone: {hoveredDataPoint.milestone}</span>
                </div>
              )}

              {hoveredDataPoint.satellitePass && (
                <div className="text-[10px] text-cyan-300 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{hoveredDataPoint.satellitePass}</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-[#F5F5F0]/40 text-[11px]">
              Hover across timeline nodes to inspect sensor readings, counterfactual delta, and orbital satellite passes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
