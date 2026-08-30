import React, { useState, useMemo } from 'react';
import {
  Layers,
  Sparkles,
  TrendingUp,
  Flame,
  Activity,
  Sliders,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Maximize2
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface RegenerationHeatCell {
  id: string;
  name: string;
  quadrant: string;
  currentScore: number; // 0 - 100
  potentialScore: number; // 0 - 100
  probabilityOfSuccess: number; // 0 - 100%
  primaryDriver: string;
  interventionType: string;
  estimatedHectares: number;
  carbonDeltaTCO2e: number;
  aquiferDeltaBar: number;
  xPct: number; // 0-100% on map canvas
  yPct: number; // 0-100% on map canvas
}

export const REGENERATION_HEAT_CELLS: RegenerationHeatCell[] = [
  {
    id: 'rh-01',
    name: 'Upper Chania Cloud Catchment',
    quadrant: 'North-East Ridge',
    currentScore: 58,
    potentialScore: 94,
    probabilityOfSuccess: 92,
    primaryDriver: 'Horizontal cloud mist condensation via Podocarpus canopy expansion',
    interventionType: 'Endemic Cloud Forest Enrichment',
    estimatedHectares: 1200,
    carbonDeltaTCO2e: 14.8,
    aquiferDeltaBar: 0.95,
    xPct: 72,
    yPct: 22
  },
  {
    id: 'rh-02',
    name: 'Mathare River Confluence Zone',
    quadrant: 'South-East Urban Basin',
    currentScore: 42,
    potentialScore: 82,
    probabilityOfSuccess: 86,
    primaryDriver: 'Multi-layer vetiver bio-swales and urban pocket wetlands',
    interventionType: 'Riparian Bio-Swale Terracing',
    estimatedHectares: 180,
    carbonDeltaTCO2e: 8.2,
    aquiferDeltaBar: 0.45,
    xPct: 78,
    yPct: 68
  },
  {
    id: 'rh-03',
    name: 'Talek River Riparian Keyline Buffer',
    quadrant: 'South-West Pastoral Basin',
    currentScore: 52,
    potentialScore: 91,
    probabilityOfSuccess: 94,
    primaryDriver: 'Olosho customary rotational grazing and riverbank tree fencing',
    interventionType: 'Customary Silvopasture Sponge',
    estimatedHectares: 4500,
    carbonDeltaTCO2e: 12.4,
    aquiferDeltaBar: 0.82,
    xPct: 24,
    yPct: 76
  },
  {
    id: 'rh-04',
    name: 'Kikuyu Escarpment Avian Bridge',
    quadrant: 'Central Valley Flank',
    currentScore: 64,
    potentialScore: 96,
    probabilityOfSuccess: 89,
    primaryDriver: 'Continuous floral corridor connecting fragmented forest reserves',
    interventionType: 'Bio-Acoustic Wildlife Corridor',
    estimatedHectares: 850,
    carbonDeltaTCO2e: 11.0,
    aquiferDeltaBar: 0.60,
    xPct: 48,
    yPct: 46
  },
  {
    id: 'rh-05',
    name: 'Lake Naivasha Northern Pumice Recharge',
    quadrant: 'North-West Rift Basin',
    currentScore: 49,
    potentialScore: 88,
    probabilityOfSuccess: 88,
    primaryDriver: 'Deep volcanic pumice subterranean aquifer infiltration trenches',
    interventionType: 'Aquifer Infiltration Trenching',
    estimatedHectares: 1600,
    carbonDeltaTCO2e: 9.6,
    aquiferDeltaBar: 1.15,
    xPct: 35,
    yPct: 32
  }
];

interface RegenerationHeatmapOverlayProps {
  selectedBioregionId?: string;
  onSelectZone?: (cell: RegenerationHeatCell) => void;
}

export const RegenerationHeatmapOverlay: React.FC<RegenerationHeatmapOverlayProps> = ({
  selectedBioregionId = 'aberdare_riparian_watershed',
  onSelectZone
}) => {
  const [displayMode, setDisplayMode] = useState<'current' | 'predictive' | 'differential'>('predictive');
  const [selectedCellId, setSelectedCellId] = useState<string>('rh-01');
  const [hoveredCellId, setHoveredCellId] = useState<string | null>(null);
  const [minProbabilityFilter, setMinProbabilityFilter] = useState<number>(80);
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.85);

  const selectedCell = useMemo(() => {
    return REGENERATION_HEAT_CELLS.find(c => c.id === selectedCellId) || REGENERATION_HEAT_CELLS[0];
  }, [selectedCellId]);

  const hoveredCell = useMemo(() => {
    return hoveredCellId ? REGENERATION_HEAT_CELLS.find(c => c.id === hoveredCellId) : null;
  }, [hoveredCellId]);

  const filteredCells = useMemo(() => {
    return REGENERATION_HEAT_CELLS.filter(c => c.probabilityOfSuccess >= minProbabilityFilter);
  }, [minProbabilityFilter]);

  const getCellScore = (c: RegenerationHeatCell) => {
    if (displayMode === 'current') return c.currentScore;
    if (displayMode === 'predictive') return c.potentialScore;
    return c.potentialScore - c.currentScore;
  };

  const getHeatmapColor = (score: number, mode: 'current' | 'predictive' | 'differential') => {
    if (mode === 'differential') {
      if (score >= 35) return 'from-emerald-500/90 to-teal-400/90 text-emerald-300 border-emerald-400';
      if (score >= 25) return 'from-teal-500/80 to-cyan-400/80 text-teal-300 border-teal-400';
      return 'from-cyan-500/70 to-blue-400/70 text-cyan-300 border-cyan-400';
    }
    if (score >= 85) return 'from-emerald-500/90 to-teal-400/90 text-emerald-300 border-emerald-400';
    if (score >= 65) return 'from-amber-500/80 to-yellow-400/80 text-amber-300 border-amber-400';
    return 'from-rose-500/70 to-orange-400/70 text-rose-300 border-rose-400';
  };

  return (
    <div 
      id="regeneration-heatmap-overlay"
      className="p-5 bg-[#0A0E0B] border border-teal-500/40 rounded-sm space-y-4 shadow-2xl text-[#F5F5F0]"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-500/20 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-teal-400 font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-teal-400" />
              PREDICTIVE REGENERATION HEATMAP OVERLAY
            </span>
            <span className="text-[9px] font-mono bg-teal-950 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded-full">
              P90 High-Probability Impact Zones
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5F5F0]">
            Ecological Potential & High-Impact Intervention Matrix
          </h3>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {[
            { id: 'current', label: 'Current Baseline' },
            { id: 'predictive', label: 'P90 Potential State' },
            { id: 'differential', label: 'Net Gain (Delta)' }
          ].map(m => {
            const isSel = displayMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setDisplayMode(m.id as any);
                  audioFeedback.playMicroTick();
                }}
                className={`px-3 py-1.5 rounded-xs border text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isSel
                    ? 'bg-teal-500 text-black font-bold border-teal-400 shadow-sm'
                    : 'bg-[#121915] border-teal-500/20 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive 2D Heatmap Grid / Map Simulation Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Visual Map Stage (7 cols) */}
        <div className="lg:col-span-7 bg-[#060907] border border-teal-500/30 rounded-sm p-4 relative min-h-[300px] flex flex-col justify-between overflow-hidden">
          {/* Subtle Topographical Contours SVG Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              <path d="M 0 50 Q 100 20 200 60 T 400 30" fill="none" stroke="#2DD4BF" strokeWidth="1" />
              <path d="M 0 120 Q 150 90 250 140 T 400 100" fill="none" stroke="#2DD4BF" strokeWidth="1" />
              <path d="M 0 200 Q 120 180 220 220 T 400 180" fill="none" stroke="#2DD4BF" strokeWidth="1" />
              <path d="M 0 270 Q 180 240 280 280 T 400 250" fill="none" stroke="#2DD4BF" strokeWidth="1" />
            </svg>
          </div>

          {/* Interactive Heatmap Beacon Nodes */}
          <div className="relative w-full h-[240px]">
            {filteredCells.map(cell => {
              const isSelected = cell.id === selectedCellId;
              const val = getCellScore(cell);
              return (
                  <div
                    key={cell.id}
                    onClick={() => {
                      setSelectedCellId(cell.id);
                      audioFeedback.playMicroTick();
                      if (onSelectZone) onSelectZone(cell);
                    }}
                    onMouseEnter={() => {
                      setHoveredCellId(cell.id);
                      audioFeedback.playMicroTick();
                    }}
                    onMouseLeave={() => setHoveredCellId(null)}
                    style={{
                      left: `${cell.xPct}%`,
                      top: `${cell.yPct}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className={`absolute z-10 p-2 rounded-full cursor-pointer transition-all ${
                      isSelected ? 'scale-125 ring-2 ring-white z-30' : 'hover:scale-110'
                    }`}
                  >
                    {/* Outer Pulsing Glow */}
                    <span
                      className={`absolute inset-0 rounded-full animate-ping opacity-40 bg-gradient-to-r ${getHeatmapColor(
                        val,
                        displayMode
                      )}`}
                    />

                    {/* Core Indicator Badge */}
                    <div
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs bg-black/90 border shadow-lg ${
                        isSelected ? 'border-white text-white' : 'border-teal-400 text-teal-300'
                      }`}
                    >
                      {displayMode === 'differential' ? `+${val}` : `${val}%`}
                    </div>

                    {/* Mini Hover Label */}
                    <span className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 bg-black/85 backdrop-blur-md rounded border border-teal-500/30 text-[9px] font-mono text-[#F5F5F0]">
                      {cell.name.split(' ')[0]}
                    </span>

                    {/* Rich Interactive Tooltip on Hover */}
                    {hoveredCellId === cell.id && (
                      <div className="absolute bottom-11 left-1/2 -translate-x-1/2 w-56 p-2.5 bg-[#0C120E]/95 backdrop-blur-md border border-teal-400/60 rounded shadow-2xl z-50 text-left pointer-events-none space-y-1.5 font-mono">
                        <div className="flex items-center justify-between border-b border-teal-500/20 pb-1">
                          <span className="text-[9px] text-teal-300 font-bold uppercase tracking-wider">{cell.quadrant}</span>
                          <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1 rounded border border-emerald-500/30">
                            {cell.probabilityOfSuccess}% P90
                          </span>
                        </div>
                        <div className="text-[11px] font-serif font-bold text-[#F5F5F0] leading-tight">
                          {cell.name}
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[9px] text-[#F5F5F0]/70 pt-0.5">
                          <div>Current: <span className="text-amber-400 font-bold">{cell.currentScore}%</span></div>
                          <div>Potential: <span className="text-emerald-400 font-bold">{cell.potentialScore}%</span></div>
                          <div>Area: <span className="text-teal-300">{cell.estimatedHectares} ha</span></div>
                          <div>Carbon: <span className="text-emerald-300">+{cell.carbonDeltaTCO2e} tCO2e</span></div>
                        </div>
                        <div className="text-[8px] text-[#F5F5F0]/50 line-clamp-1 italic">
                          {cell.interventionType}
                        </div>
                      </div>
                    )}
                  </div>
              );
            })}
          </div>

          {/* Map Bottom Legend */}
          <div className="pt-2 border-t border-teal-500/20 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/60">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> High Potential (80%+)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Moderate (60-79%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Degraded Baseline (&lt;60%)
            </span>
          </div>
        </div>

        {/* Selected Zone Deep Dive Side Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#0F1612] border border-teal-500/40 rounded-sm p-4 space-y-4 text-left flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-teal-500/20 pb-2">
              <span className="text-[10px] font-mono uppercase text-teal-400 font-bold">
                {selectedCell.quadrant}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                {selectedCell.probabilityOfSuccess}% P90 Certainty
              </span>
            </div>

            <h4 className="text-base font-serif font-bold text-[#F5F5F0]">
              {selectedCell.name}
            </h4>

            {/* Score Comparison Dual Bar */}
            <div className="space-y-2 font-mono text-xs pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-[#F5F5F0]/60">Current Ecological Score:</span>
                  <span className="text-amber-400 font-bold">{selectedCell.currentScore} / 100</span>
                </div>
                <div className="w-full bg-[#1B2720] h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${selectedCell.currentScore}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-emerald-400 font-bold">Projected P90 Outcome:</span>
                  <span className="text-emerald-300 font-bold">{selectedCell.potentialScore} / 100</span>
                </div>
                <div className="w-full bg-[#1B2720] h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ width: `${selectedCell.potentialScore}%` }} />
                </div>
              </div>
            </div>

            <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed pt-1">
              {selectedCell.primaryDriver}
            </p>

            {/* Impact Metrics Quad */}
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
              <div className="p-2 bg-[#0A0E0B] border border-teal-500/20 rounded-xs">
                <span className="text-[9px] text-[#F5F5F0]/40 uppercase block">Target Area</span>
                <span className="text-teal-300 font-bold">{selectedCell.estimatedHectares} ha</span>
              </div>
              <div className="p-2 bg-[#0A0E0B] border border-teal-500/20 rounded-xs">
                <span className="text-[9px] text-[#F5F5F0]/40 uppercase block">Carbon Sequestration</span>
                <span className="text-emerald-300 font-bold">+{selectedCell.carbonDeltaTCO2e} tCO2e/ha</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-teal-500/20 text-[10px] font-mono text-[#F5F5F0]/50 flex items-center justify-between">
            <span>Intervention: {selectedCell.interventionType}</span>
            <span className="text-teal-400 font-bold">+{selectedCell.aquiferDeltaBar} bar Head</span>
          </div>
        </div>
      </div>
    </div>
  );
};
