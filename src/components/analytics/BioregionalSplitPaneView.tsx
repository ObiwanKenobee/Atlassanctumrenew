import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  ArrowLeftRight, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  Radio, 
  TreePine, 
  Droplets, 
  Zap, 
  Compass, 
  Eye, 
  Info,
  Calendar
} from 'lucide-react';
import { COMPARATIVE_BIOREGIONS, BioregionOption, HISTORICAL_ANNOTATIONS } from './flourishingAnalyticsData';
import { DataQualityBadge } from './DataQualityBadge';
import { DataProvenance } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface BioregionalSplitPaneViewProps {
  onInspectProvenance?: (prov: Partial<DataProvenance>) => void;
  initialBioregionA?: string;
  initialBioregionB?: string;
}

export const BioregionalSplitPaneView: React.FC<BioregionalSplitPaneViewProps> = ({
  onInspectProvenance,
  initialBioregionA = 'mara-serengeti',
  initialBioregionB = 'aberdare-water'
}) => {
  const [selectedBioregionAId, setSelectedBioregionAId] = useState<string>(initialBioregionA);
  const [selectedBioregionBId, setSelectedBioregionBId] = useState<string>(initialBioregionB);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(8); // Month 8 (May 2026) default
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Retrieve bioregion objects
  const bioregionA: BioregionOption = useMemo(() => {
    return COMPARATIVE_BIOREGIONS.find(b => b.id === selectedBioregionAId) || COMPARATIVE_BIOREGIONS[1];
  }, [selectedBioregionAId]);

  const bioregionB: BioregionOption = useMemo(() => {
    return COMPARATIVE_BIOREGIONS.find(b => b.id === selectedBioregionBId) || COMPARATIVE_BIOREGIONS[2];
  }, [selectedBioregionBId]);

  // Synchronized monthly data at currentMonthIndex (1 - 12)
  const dataPointA = useMemo(() => {
    const idx = Math.max(0, Math.min(11, currentMonthIndex - 1));
    return bioregionA.monthlyData[idx] || bioregionA.monthlyData[0];
  }, [bioregionA, currentMonthIndex]);

  const dataPointB = useMemo(() => {
    const idx = Math.max(0, Math.min(11, currentMonthIndex - 1));
    return bioregionB.monthlyData[idx] || bioregionB.monthlyData[0];
  }, [bioregionB, currentMonthIndex]);

  // Automated Timeline Playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentMonthIndex(prev => {
        const next = prev >= 12 ? 1 : prev + 1;
        audioFeedback.playMicroTick();
        return next;
      });
    }, 1400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSwap = () => {
    audioFeedback.playSubtleClick();
    const temp = selectedBioregionAId;
    setSelectedBioregionAId(selectedBioregionBId);
    setSelectedBioregionBId(temp);
  };

  // Comparative metrics
  const diffFlourishing = (dataPointA.ecologicalFlourishing - dataPointB.ecologicalFlourishing).toFixed(1);
  const diffEconomic = (dataPointA.economicStability - dataPointB.economicStability).toFixed(1);
  const diffDecoupling = (dataPointA.decouplingMargin - dataPointB.decouplingMargin).toFixed(1);

  // Month annotation if any exists
  const monthAnnotation = HISTORICAL_ANNOTATIONS.find(a => a.monthIndex === currentMonthIndex);

  // Mini trajectory SVG renderer for side-by-side pane
  const renderMiniTrajectory = (bioregion: BioregionOption, activeMonth: number) => {
    const width = 280;
    const height = 64;
    const padding = 10;
    const data = bioregion.monthlyData;
    const xStep = (width - padding * 2) / (data.length - 1);
    
    // min / max bounds
    const minVal = 45;
    const maxVal = 100;
    const getY = (val: number) => height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);

    const pointsFlourish = data.map((d, i) => `${padding + i * xStep},${getY(d.ecologicalFlourishing)}`).join(' ');
    const pointsEcon = data.map((d, i) => `${padding + i * xStep},${getY(d.economicStability)}`).join(' ');

    const currentX = padding + (activeMonth - 1) * xStep;
    const currentYFlourish = getY(data[activeMonth - 1]?.ecologicalFlourishing || 75);
    const currentYEcon = getY(data[activeMonth - 1]?.economicStability || 70);

    return (
      <div className="relative w-full overflow-hidden bg-black/40 rounded border border-white/10 p-2">
        <div className="flex items-center justify-between text-[9px] font-mono text-white/50 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-emerald-400 inline-block" /> Ecological
            <span className="w-2 h-0.5 bg-[#C5A059] inline-block ml-1" /> Economic
          </span>
          <span className="text-white/40">12-Month Curve</span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16 overflow-visible">
          {/* Timeline scrub guide line */}
          <line 
            x1={currentX} 
            y1={0} 
            x2={currentX} 
            y2={height} 
            stroke="#FFFFFF" 
            strokeWidth={1} 
            strokeDasharray="2,2" 
            opacity={0.6} 
          />
          
          {/* Flourishing Polyline */}
          <polyline
            fill="none"
            stroke="#10B981"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsFlourish}
          />

          {/* Economic Polyline */}
          <polyline
            fill="none"
            stroke="#C5A059"
            strokeWidth={1.5}
            strokeDasharray="3,3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsEcon}
          />

          {/* Active Month Flourishing Indicator */}
          <circle 
            cx={currentX} 
            cy={currentYFlourish} 
            r={4} 
            fill="#10B981" 
            stroke="#FFFFFF" 
            strokeWidth={1.5} 
          />
          
          {/* Active Month Economic Indicator */}
          <circle 
            cx={currentX} 
            cy={currentYEcon} 
            r={3.5} 
            fill="#C5A059" 
            stroke="#0A0A0A" 
            strokeWidth={1} 
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0E1410] via-[#0A0D0B] to-[#0E1410] border border-[#1B3022] hover:border-[#C5A059]/40 rounded-xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1B3022]/80 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <Scale className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#F5F5F0]">
                  Synchronized Bioregional Split-Pane
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold uppercase">
                  Dual-Corridor Telemetry
                </span>
              </div>
              <p className="text-xs text-[#F5F5F0]/60 font-sans">
                Side-by-side comparative analysis of distinct catchment basins driven by a single master chronological slider
              </p>
            </div>
          </div>

          {/* Quick Comparison Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono text-white/50 mr-1">Presets:</span>
            {[
              { label: 'Water Tower vs Savanna', a: 'aberdare-water', b: 'mara-serengeti' },
              { label: 'Arid Sun vs Coastal', a: 'turkana-basin', b: 'kilifi-coast' },
              { label: 'Continental vs Rift', a: 'pan-african', b: 'rift-valley' }
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setSelectedBioregionAId(preset.a);
                  setSelectedBioregionBId(preset.b);
                }}
                className="px-2 py-1 rounded text-[10px] font-mono bg-black/60 hover:bg-white/10 text-[#C5A059] border border-white/15 cursor-pointer transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Master Synchronized Timeline Slider Bar */}
        <div className="p-3 sm:p-4 bg-black/60 border border-[#1B3022] rounded-lg space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setIsPlaying(!isPlaying);
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'PAUSE TIMELINE' : 'PLAY TIMELINE'}</span>
              </button>

              <button
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setCurrentMonthIndex(prev => Math.max(1, prev - 1));
                }}
                disabled={currentMonthIndex <= 1}
                className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Previous Month"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setCurrentMonthIndex(prev => Math.min(12, prev + 1));
                }}
                disabled={currentMonthIndex >= 12}
                className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Next Month"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#C5A059] bg-[#1A1810] px-2 py-0.5 rounded border border-[#C5A059]/40">
                  {dataPointA.shortMonth}: {dataPointA.calendarMonth}
                </span>
                <span className="text-[10px] font-mono text-white/50 hidden sm:inline">
                  (Synchronized across both basins)
                </span>
              </div>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              className="px-2.5 py-1 text-xs font-mono rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Swap Left and Right Bioregions"
            >
              <ArrowLeftRight className="w-3 h-3 text-[#C5A059]" />
              <span>Swap Panes (A ⇄ B)</span>
            </button>
          </div>

          {/* Timeline Slider Control */}
          <div className="space-y-1.5">
            <input
              type="range"
              min={1}
              max={12}
              step={1}
              value={currentMonthIndex}
              onChange={(e) => {
                audioFeedback.playMicroTick();
                setCurrentMonthIndex(parseInt(e.target.value, 10));
              }}
              className="w-full accent-[#C5A059] h-2 bg-[#1B3022] rounded-lg appearance-none cursor-pointer"
            />

            <div className="flex justify-between text-[9px] font-mono text-white/40 px-1">
              {['M01 (Oct)', 'M02', 'M03', 'M04', 'M05 (Feb)', 'M06', 'M07', 'M08 (May)', 'M09', 'M10', 'M11', 'M12 (Sep)'].map((label, idx) => (
                <button
                  key={label}
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setCurrentMonthIndex(idx + 1);
                  }}
                  className={`hover:text-[#C5A059] transition-colors ${currentMonthIndex === idx + 1 ? 'text-[#C5A059] font-bold underline' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Chronological Annotation / Anomaly alert at active month */}
        {monthAnnotation && (
          <div className="p-2.5 bg-purple-950/40 border border-purple-500/30 rounded-lg flex items-center justify-between text-xs font-mono text-purple-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>
                <strong>{dataPointA.calendarMonth} Historic Benchmark:</strong> {monthAnnotation.title}
              </span>
            </div>
            <span className="text-[10px] text-purple-300/70 hidden sm:inline">
              Verified by {monthAnnotation.sensorQuorum} cryptographic sensor nodes
            </span>
          </div>
        )}
      </div>

      {/* Central Synchronized Divergence Banner */}
      <div className="p-3.5 bg-[#0C120E] border border-[#1B3022] rounded-xl flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-center">
        <div>
          <div className="text-[10px] text-white/40 uppercase">Flourishing Divergence</div>
          <div className={`text-sm font-bold mt-0.5 ${Number(diffFlourishing) >= 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>
            {Number(diffFlourishing) > 0 ? `+${diffFlourishing}% (Pane A Leads)` : Number(diffFlourishing) < 0 ? `${diffFlourishing}% (Pane B Leads)` : '0.0% Parity'}
          </div>
        </div>

        <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

        <div>
          <div className="text-[10px] text-white/40 uppercase">Economic Stability Delta</div>
          <div className="text-sm font-bold text-[#C5A059] mt-0.5">
            {Number(diffEconomic) >= 0 ? `+${diffEconomic}%` : `${diffEconomic}%`}
          </div>
        </div>

        <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

        <div>
          <div className="text-[10px] text-white/40 uppercase">Decoupling Spread</div>
          <div className="text-sm font-bold text-emerald-300 mt-0.5">
            {Number(diffDecoupling) >= 0 ? `+${diffDecoupling}% Margin` : `${diffDecoupling}% Margin`}
          </div>
        </div>

        <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

        <div>
          <div className="text-[10px] text-white/40 uppercase">Cross-Basin Cohesion</div>
          <div className="text-sm font-bold text-purple-300 mt-0.5">
            96.4% Co-Resilience
          </div>
        </div>
      </div>

      {/* Split-Pane Dual Columns (Left: Bioregion A, Right: Bioregion B) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pane A */}
        <div className="p-5 bg-[#0A0D0B] border border-[#1B3022] hover:border-emerald-500/50 rounded-xl space-y-4 shadow-xl">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  PANE A • PRIMARY BASIN
                </span>
                <DataQualityBadge
                  confidenceScore={98.8}
                  source="In-Situ Piezometer & Flux Array"
                  sensorCount={bioregionA.activeSensors}
                  metricName={bioregionA.name}
                  onInspectProvenance={onInspectProvenance}
                  size="xs"
                />
              </div>

              {/* Selector */}
              <select
                value={selectedBioregionAId}
                onChange={(e) => {
                  audioFeedback.playMicroTick();
                  setSelectedBioregionAId(e.target.value);
                }}
                className="mt-1 bg-black/80 text-white font-serif font-bold text-base sm:text-lg border border-[#1B3022] focus:border-emerald-400 rounded px-2 py-1 cursor-pointer outline-none"
              >
                {COMPARATIVE_BIOREGIONS.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>

              <div className="text-[11px] text-white/50 font-sans mt-0.5">
                {bioregionA.biome} • {bioregionA.location}
              </div>
            </div>

            <div className="text-right font-mono text-[10px] text-emerald-400">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                {bioregionA.activeSensors.toLocaleString()} Sensors
              </span>
            </div>
          </div>

          {/* Synchronized Metrics for Bioregion A */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-black/50 border border-emerald-500/30 rounded-lg">
              <div className="text-[9px] font-mono text-emerald-400/80 uppercase">Ecological Flourishing</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-300 mt-0.5">
                {dataPointA.ecologicalFlourishing.toFixed(1)}%
              </div>
              <div className="text-[9px] font-mono text-white/40 mt-0.5">Month {currentMonthIndex} Reading</div>
            </div>

            <div className="p-3 bg-black/50 border border-[#C5A059]/30 rounded-lg">
              <div className="text-[9px] font-mono text-[#C5A059]/80 uppercase">Economic Stability</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-[#C5A059] mt-0.5">
                {dataPointA.economicStability.toFixed(1)}%
              </div>
              <div className="text-[9px] font-mono text-white/40 mt-0.5">Patient Capital Floor</div>
            </div>

            <div className="p-3 bg-black/50 border border-cyan-500/30 rounded-lg">
              <div className="text-[9px] font-mono text-cyan-400/80 uppercase">Decoupling Margin</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-300 mt-0.5">
                +{dataPointA.decouplingMargin.toFixed(1)}%
              </div>
              <div className="text-[9px] font-mono text-white/40 mt-0.5">vs Extractive Baseline</div>
            </div>
          </div>

          {/* Mini Trajectory Sparkline */}
          {renderMiniTrajectory(bioregionA, currentMonthIndex)}

          {/* Biophysical Indicator Summary */}
          <div className="p-3 bg-black/40 border border-white/10 rounded-lg space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-white/50">Primary Hydrology:</span>
              <span className="text-white font-bold">184.2 m³/s Baseflow (+34%)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-white/50">Verified Canopy NDVI:</span>
              <span className="text-emerald-400 font-bold">0.81 Intact Vegetation Index</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-white/50">Cryptographic Proof:</span>
              <span className="text-[#C5A059] font-mono text-[10px] truncate max-w-[170px]">
                {dataPointA.cryptographicHash}
              </span>
            </div>
          </div>
        </div>

        {/* Pane B */}
        <div className="p-5 bg-[#0A0D0B] border border-[#1B3022] hover:border-cyan-500/50 rounded-xl space-y-4 shadow-xl">
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  PANE B • COMPARATIVE BASIN
                </span>
                <DataQualityBadge
                  confidenceScore={97.6}
                  source="Copernicus Sentinel-2 & Audio Nodes"
                  sensorCount={bioregionB.activeSensors}
                  metricName={bioregionB.name}
                  onInspectProvenance={onInspectProvenance}
                  size="xs"
                />
              </div>

              {/* Selector */}
              <select
                value={selectedBioregionBId}
                onChange={(e) => {
                  audioFeedback.playMicroTick();
                  setSelectedBioregionBId(e.target.value);
                }}
                className="mt-1 bg-black/80 text-white font-serif font-bold text-base sm:text-lg border border-[#1B3022] focus:border-cyan-400 rounded px-2 py-1 cursor-pointer outline-none"
              >
                {COMPARATIVE_BIOREGIONS.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>

              <div className="text-[11px] text-white/50 font-sans mt-0.5">
                {bioregionB.biome} • {bioregionB.location}
              </div>
            </div>

            <div className="text-right font-mono text-[10px] text-cyan-400">
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                {bioregionB.activeSensors.toLocaleString()} Sensors
              </span>
            </div>
          </div>

          {/* Synchronized Metrics for Bioregion B */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-black/50 border border-cyan-500/30 rounded-lg">
              <div className="text-[9px] font-mono text-cyan-400/80 uppercase">Ecological Flourishing</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-300 mt-0.5">
                {dataPointB.ecologicalFlourishing.toFixed(1)}%
              </div>
              <div className="text-[9px] font-mono text-white/40 mt-0.5">Month {currentMonthIndex} Reading</div>
            </div>

            <div className="p-3 bg-black/50 border border-[#C5A059]/30 rounded-lg">
              <div className="text-[9px] font-mono text-[#C5A059]/80 uppercase">Economic Stability</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-[#C5A059] mt-0.5">
                {dataPointB.economicStability.toFixed(1)}%
              </div>
              <div className="text-[9px] font-mono text-white/40 mt-0.5">Patient Capital Floor</div>
            </div>

            <div className="p-3 bg-black/50 border border-purple-500/30 rounded-lg">
              <div className="text-[9px] font-mono text-purple-400/80 uppercase">Decoupling Margin</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-purple-300 mt-0.5">
                +{dataPointB.decouplingMargin.toFixed(1)}%
              </div>
              <div className="text-[9px] font-mono text-white/40 mt-0.5">vs Extractive Baseline</div>
            </div>
          </div>

          {/* Mini Trajectory Sparkline */}
          {renderMiniTrajectory(bioregionB, currentMonthIndex)}

          {/* Biophysical Indicator Summary */}
          <div className="p-3 bg-black/40 border border-white/10 rounded-lg space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-white/50">Primary Headwater Catchment:</span>
              <span className="text-white font-bold">1,420 mm/yr Cloud Catchment</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-white/50">Canopy Sponge Infiltration:</span>
              <span className="text-cyan-400 font-bold">96.1% Hydrological Retention</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-white/50">Cryptographic Proof:</span>
              <span className="text-[#C5A059] font-mono text-[10px] truncate max-w-[170px]">
                {dataPointB.cryptographicHash}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
