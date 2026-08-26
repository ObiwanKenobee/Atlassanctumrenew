import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Layers,
  Compass,
  AlertCircle
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface MissionPulseDataPoint {
  date: Date;
  actualProgress: number; // 0 - 100
  targetGoal: number; // 0 - 100
  baselineInaction: number; // 0 - 100
  lowerConfidence: number;
  upperConfidence: number;
  milestoneTitle?: string;
  milestoneVerified?: boolean;
}

interface MissionPulseChartProps {
  initialDimension?: 'composite' | 'natural' | 'human' | 'social' | 'financial';
  className?: string;
}

export const MissionPulseChart: React.FC<MissionPulseChartProps> = ({
  initialDimension = 'composite',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [dimension, setDimension] = useState<'composite' | 'natural' | 'human' | 'social' | 'financial'>(initialDimension);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<MissionPulseDataPoint | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [streamTick, setStreamTick] = useState<number>(0);

  // Generate multi-temporal data stream for 2024 - 2030 (Past, Present, and Future Goal Horizon)
  const generatePulseData = (dim: string, tickOffset = 0): MissionPulseDataPoint[] => {
    const data: MissionPulseDataPoint[] = [];
    const startDate = new Date(2024, 0, 1);
    const months = 36; // 3 years

    const dimensionFactors: Record<string, { start: number; slope: number; target: number }> = {
      composite: { start: 35, slope: 1.65, target: 92 },
      natural: { start: 28, slope: 1.85, target: 95 },
      human: { start: 42, slope: 1.45, target: 90 },
      social: { start: 38, slope: 1.55, target: 94 },
      financial: { start: 24, slope: 1.95, target: 88 }
    };

    const factor = dimensionFactors[dim] || dimensionFactors.composite;

    for (let i = 0; i <= months; i++) {
      const d = new Date(startDate);
      d.setMonth(d.getMonth() + i);

      const progressRaw = factor.start + (i * factor.slope) + Math.sin((i + tickOffset * 0.2) * 0.4) * 3;
      const actualProgress = Math.min(98, Math.max(15, progressRaw));
      
      const targetGoal = Math.min(100, factor.start + (i * (factor.target - factor.start) / months));
      const baselineInaction = Math.max(10, factor.start - (i * 0.35) + Math.cos(i * 0.3) * 1.5);

      let milestoneTitle: string | undefined;
      let milestoneVerified: boolean | undefined;

      if (i === 6) {
        milestoneTitle = 'M1: Sensor Mesh & Bioregional Telemetry Baseline Complete';
        milestoneVerified = true;
      } else if (i === 14) {
        milestoneTitle = 'M2: 50,000ha Agroforestry Corridor Operationalized';
        milestoneVerified = true;
      } else if (i === 24) {
        milestoneTitle = 'M3: Decentralized Desalination & 100% Water Autonomy';
        milestoneVerified = true;
      } else if (i === 32) {
        milestoneTitle = 'M4: Planetary Boundary 2030 Ecological Reserve Anchor';
        milestoneVerified = false;
      }

      data.push({
        date: d,
        actualProgress: Math.round(actualProgress * 10) / 10,
        targetGoal: Math.round(targetGoal * 10) / 10,
        baselineInaction: Math.round(baselineInaction * 10) / 10,
        lowerConfidence: Math.max(0, actualProgress - 3.5),
        upperConfidence: Math.min(100, actualProgress + 3.5),
        milestoneTitle,
        milestoneVerified
      });
    }

    return data;
  };

  // Live telemetry pulse animation interval
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      setStreamTick(prev => (prev + 1) % 100);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Render D3 SVG Chart with ResizeObserver
  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const pulseData = generatePulseData(dimension, streamTick);

    const margin = { top: 30, right: 40, bottom: 40, left: 50 };
    const containerWidth = containerRef.current.clientWidth || 800;
    const containerHeight = 360;
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define Gradients
    const defs = svg.append('defs');

    // 1. Telemetry confidence band gradient
    const confGradient = defs.append('linearGradient')
      .attr('id', 'confidence-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    confGradient.append('stop').attr('offset', '0%').attr('stop-color', '#10B981').attr('stop-opacity', 0.25);
    confGradient.append('stop').attr('offset', '100%').attr('stop-color', '#10B981').attr('stop-opacity', 0.02);

    // 2. Actual progress area glow gradient
    const glowGradient = defs.append('linearGradient')
      .attr('id', 'pulse-glow-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    glowGradient.append('stop').attr('offset', '0%').attr('stop-color', '#C5A059').attr('stop-opacity', 0.35);
    glowGradient.append('stop').attr('offset', '100%').attr('stop-color', '#C5A059').attr('stop-opacity', 0.0);

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(pulseData, d => d.date) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Gridlines
    const yGrid = d3.axisLeft(yScale)
      .tickSize(-width)
      .tickFormat(() => '')
      .ticks(5);

    g.append('g')
      .attr('class', 'grid')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', 'rgba(245, 245, 240, 0.06)')
      .attr('stroke-dasharray', '3 3');

    // Safe Boundary Ceiling Line (e.g. 85% - 100% Planetary Flourishing Zone)
    g.append('rect')
      .attr('x', 0)
      .attr('y', yScale(100))
      .attr('width', width)
      .attr('height', yScale(85) - yScale(100))
      .attr('fill', 'rgba(16, 185, 129, 0.05)');

    g.append('text')
      .attr('x', width - 8)
      .attr('y', yScale(96))
      .attr('text-anchor', 'end')
      .attr('fill', '#10B981')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .text('REGENERATIVE TARGET ZONE (>85%)');

    // Area Generator for Confidence Band
    const confidenceArea = d3.area<MissionPulseDataPoint>()
      .x(d => xScale(d.date))
      .y0(d => yScale(d.lowerConfidence))
      .y1(d => yScale(d.upperConfidence))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(pulseData)
      .attr('fill', 'url(#confidence-gradient)')
      .attr('d', confidenceArea);

    // Area Generator for Actual Progress Glow Fill
    const actualArea = d3.area<MissionPulseDataPoint>()
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => yScale(d.actualProgress))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(pulseData)
      .attr('fill', 'url(#pulse-glow-gradient)')
      .attr('d', actualArea);

    // Line Generators
    const targetLine = d3.line<MissionPulseDataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.targetGoal))
      .curve(d3.curveMonotoneX);

    const baselineLine = d3.line<MissionPulseDataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.baselineInaction))
      .curve(d3.curveMonotoneX);

    const actualLine = d3.line<MissionPulseDataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.actualProgress))
      .curve(d3.curveMonotoneX);

    // Baseline Inaction Line (Red Dashed)
    g.append('path')
      .datum(pulseData)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(244, 63, 94, 0.4)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 4')
      .attr('d', baselineLine);

    // Target Goal Path (Cyan / Blue Dashed)
    g.append('path')
      .datum(pulseData)
      .attr('fill', 'none')
      .attr('stroke', '#8FB8DE')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 3')
      .attr('d', targetLine);

    // Actual Verified Telemetry Progress Path (Gold Solid with Animation)
    const actualPath = g.append('path')
      .datum(pulseData)
      .attr('fill', 'none')
      .attr('stroke', '#C5A059')
      .attr('stroke-width', 2.8)
      .attr('stroke-linecap', 'round')
      .attr('d', actualLine);

    // Milestone Radar Pulse Nodes
    pulseData.filter(d => !!d.milestoneTitle).forEach((m) => {
      const cx = xScale(m.date);
      const cy = yScale(m.actualProgress);

      // Radar pulse ring
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 10)
        .attr('fill', 'none')
        .attr('stroke', m.milestoneVerified ? '#10B981' : '#C5A059')
        .attr('stroke-width', 1.2)
        .attr('opacity', 0.75);

      // Center Node
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 4.5)
        .attr('fill', m.milestoneVerified ? '#10B981' : '#C5A059')
        .attr('stroke', '#0A0A0A')
        .attr('stroke-width', 2)
        .attr('cursor', 'pointer')
        .on('click', () => {
          setSelectedMilestone(m.milestoneTitle || null);
          audioFeedback.playMicroTick();
        });

      // Milestone Tag
      g.append('text')
        .attr('x', cx)
        .attr('y', cy - 14)
        .attr('text-anchor', 'middle')
        .attr('fill', m.milestoneVerified ? '#10B981' : '#F5F5F0')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text(m.milestoneVerified ? '● VERIFIED' : '○ PROJECTED');
    });

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeYear.every(1))
      .tickFormat(d3.timeFormat('%Y') as any);

    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${d}%`);

    const xAxisG = g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    xAxisG.selectAll('text')
      .attr('fill', 'rgba(245, 245, 240, 0.6)')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    xAxisG.select('.domain').attr('stroke', 'rgba(245, 245, 240, 0.15)');

    const yAxisG = g.append('g')
      .call(yAxis);

    yAxisG.selectAll('text')
      .attr('fill', 'rgba(245, 245, 240, 0.6)')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    yAxisG.select('.domain').attr('stroke', 'rgba(245, 245, 240, 0.15)');

    // Interactive Hover Tracking Layer
    const overlay = g.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    const focusLine = g.append('line')
      .attr('stroke', 'rgba(197, 160, 89, 0.5)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2 2')
      .style('opacity', 0);

    const bisect = d3.bisector<MissionPulseDataPoint, Date>(d => d.date).center;

    overlay
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        const x0 = xScale.invert(mx);
        const index = bisect(pulseData, x0);
        const d = pulseData[index];
        if (d) {
          setHoveredPoint(d);
          focusLine
            .attr('x1', xScale(d.date))
            .attr('x2', xScale(d.date))
            .attr('y1', 0)
            .attr('y2', height)
            .style('opacity', 1);
        }
      })
      .on('mouseleave', () => {
        setHoveredPoint(null);
        focusLine.style('opacity', 0);
      });

  }, [dimension, streamTick]);

  const latestPoint = generatePulseData(dimension, streamTick).slice(-1)[0];

  return (
    <div className={`p-6 rounded-sm bg-[#0D0D0D] border border-[#C5A059]/40 space-y-6 shadow-2xl ${className}`}>
      {/* Top Header & Interactive Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
              D3.JS MISSION PULSE ENGINE • REAL-TIME REGENERATIVE GOALS
            </span>
            <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Live Biophysical Grounding
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Bioregional Mission Pulse & Target Velocity
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 font-sans max-w-2xl">
            Continuous trajectory tracking comparing verified in-situ telemetry against 2030 regenerative target goals and counterfactual inaction baselines.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={() => {
              setIsLiveStreaming(!isLiveStreaming);
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1.5 rounded-xs border text-xs font-mono flex items-center gap-1.5 transition-all ${
              isLiveStreaming
                ? 'bg-[#1B3022] text-emerald-300 border-emerald-500/40 hover:bg-[#254530]'
                : 'bg-[#151515] text-[#F5F5F0]/60 border-[#F5F5F0]/15 hover:text-[#F5F5F0]'
            }`}
          >
            {isLiveStreaming ? <Pause className="w-3.5 h-3.5 text-emerald-400" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLiveStreaming ? 'Streaming Pulse' : 'Resume Pulse'}</span>
          </button>

          <button
            onClick={() => {
              setStreamTick(0);
              setSelectedMilestone(null);
              audioFeedback.playSubtleClick();
            }}
            className="p-1.5 rounded-xs bg-[#151515] hover:bg-[#202020] border border-[#F5F5F0]/15 text-[#F5F5F0]/60 hover:text-[#F5F5F0]"
            title="Reset telemetry trajectory"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Multi-Capital Dimension Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        {[
          { id: 'composite', label: 'Composite Flourishing Index' },
          { id: 'natural', label: 'Natural Capital (Biomass & Water)' },
          { id: 'human', label: 'Human Agency & Health Floor' },
          { id: 'social', label: 'Social & Co-governance Trusts' },
          { id: 'financial', label: 'Financial Multiplier & Non-Extractive' }
        ].map((tab) => {
          const isSelected = tab.id === dimension;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setDimension(tab.id as any);
                audioFeedback.playMicroTick();
              }}
              className={`px-3 py-1.5 rounded-xs border transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-[#1F2720] border-[#C5A059] text-[#C5A059] font-bold shadow-sm'
                  : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* D3 SVG Chart Container */}
      <div ref={containerRef} className="relative w-full overflow-hidden bg-[#0A0A0A] p-2 rounded-sm border border-[#F5F5F0]/10">
        <svg ref={svgRef} className="w-full h-[360px]" />

        {/* Hover Crosshair Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-4 right-4 p-3 rounded bg-black/90 backdrop-blur-md border border-[#C5A059]/40 text-xs font-mono space-y-1.5 shadow-xl pointer-events-none">
            <div className="text-[10px] text-[#C5A059] font-bold">
              {hoveredPoint.date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#C5A059]">Verified Progress:</span>
              <span className="font-bold text-[#F5F5F0]">{hoveredPoint.actualProgress}%</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[#8FB8DE]">
              <span>2030 Target Goal:</span>
              <span className="font-bold">{hoveredPoint.targetGoal}%</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-rose-400">
              <span>Inaction Baseline:</span>
              <span className="font-bold">{hoveredPoint.baselineInaction}%</span>
            </div>
            <div className="text-[9px] text-[#F5F5F0]/40 pt-1 border-t border-white/10">
              Confidence Band: ±3.5% (Sensor Verified)
            </div>
          </div>
        )}
      </div>

      {/* Selected Milestone Information Banner */}
      {selectedMilestone && (
        <div className="p-3 bg-[#1B3022]/40 border border-emerald-500/40 rounded-sm text-xs font-mono flex items-center justify-between gap-3 text-emerald-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Audited Milestone:</strong> {selectedMilestone}</span>
          </div>
          <button
            onClick={() => setSelectedMilestone(null)}
            className="text-[10px] text-emerald-400 hover:underline uppercase"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Chart Legend & Telemetry Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs font-mono pt-2 border-t border-[#F5F5F0]/10">
        <div className="p-3 bg-[#141414] rounded-sm border border-[#F5F5F0]/5 flex items-center gap-2.5">
          <div className="w-3 h-1 bg-[#C5A059] rounded-full" />
          <div>
            <span className="text-[#F5F5F0] font-bold block">Telemetry Ground Truth</span>
            <span className="text-[10px] text-[#F5F5F0]/40">Active Verified ({latestPoint?.actualProgress}%)</span>
          </div>
        </div>

        <div className="p-3 bg-[#141414] rounded-sm border border-[#F5F5F0]/5 flex items-center gap-2.5">
          <div className="w-3 h-1 bg-[#8FB8DE] rounded-full" />
          <div>
            <span className="text-[#8FB8DE] font-bold block">Regenerative 2030 Goal</span>
            <span className="text-[10px] text-[#F5F5F0]/40">Target Horizon ({latestPoint?.targetGoal}%)</span>
          </div>
        </div>

        <div className="p-3 bg-[#141414] rounded-sm border border-[#F5F5F0]/5 flex items-center gap-2.5">
          <div className="w-3 h-1 bg-rose-400/60 rounded-full" />
          <div>
            <span className="text-rose-300 font-bold block">Inaction Baseline Vector</span>
            <span className="text-[10px] text-[#F5F5F0]/40">Extractive Trajectory ({latestPoint?.baselineInaction}%)</span>
          </div>
        </div>

        <div className="p-3 bg-[#141414] rounded-sm border border-[#F5F5F0]/5 flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[8px] text-emerald-300">●</div>
          <div>
            <span className="text-emerald-300 font-bold block">Independent Milestones</span>
            <span className="text-[10px] text-[#F5F5F0]/40">3 Verified • 1 Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};
