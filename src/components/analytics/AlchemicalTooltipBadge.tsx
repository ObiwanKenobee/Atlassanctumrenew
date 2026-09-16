import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Volume2, 
  Compass, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Star,
  Layers
} from 'lucide-react';
import { 
  getAlchemicalTrendSymbolism, 
  CELESTIAL_HISTORICAL_ALIGNMENTS,
  AlchemicalTrendAnalysis 
} from '../../lib/alchemicalTrends';
import { MonthlyTrendDataPoint } from './FlourishingVsStabilityD3Chart';
import { alchemicalAudio } from '../../lib/alchemicalAudio';

interface AlchemicalTooltipBadgeProps {
  currentPoint: MonthlyTrendDataPoint;
  previousPoint?: MonthlyTrendDataPoint;
  isCelestialActive?: boolean;
  isPurified?: boolean;
}

export const AlchemicalTooltipBadge: React.FC<AlchemicalTooltipBadgeProps> = ({
  currentPoint,
  previousPoint,
  isCelestialActive = false,
  isPurified = false
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isPlayingSolfeggio, setIsPlayingSolfeggio] = useState<boolean>(false);

  // Compute alchemical trend analysis based on current & previous ecological flourishing values
  const prevVal = previousPoint ? previousPoint.ecologicalFlourishing : currentPoint.ecologicalFlourishing;
  const analysis: AlchemicalTrendAnalysis = getAlchemicalTrendSymbolism(
    currentPoint.ecologicalFlourishing,
    prevVal,
    'Ecological Flourishing'
  );

  // Find celestial alignment data if applicable
  const celestialData = CELESTIAL_HISTORICAL_ALIGNMENTS.find(
    c => c.monthIndex === currentPoint.monthIndex
  );

  const handlePlayFrequency = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingSolfeggio(true);
    alchemicalAudio.playSingingBowl(analysis.solfeggioFrequency, 2.5);
    setTimeout(() => setIsPlayingSolfeggio(false), 2600);
  };

  return (
    <div 
      id="alchemical-tooltip-badge-container"
      className="rounded border overflow-hidden transition-all duration-200"
      style={{
        borderColor: analysis.colorHex + '60',
        backgroundColor: '#060907'
      }}
    >
      {/* Top Bar: Sacred Alchemical Stage Header */}
      <div 
        className="px-2.5 py-1.5 flex items-center justify-between gap-2 border-b cursor-pointer select-none"
        style={{
          borderColor: analysis.colorHex + '35',
          backgroundColor: analysis.colorHex + '18'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span 
            className="w-5 h-5 rounded-full flex items-center justify-center font-serif text-xs font-bold shadow-sm shrink-0"
            style={{ 
              backgroundColor: analysis.colorHex + '30',
              color: analysis.colorHex,
              border: `1px solid ${analysis.colorHex}`
            }}
          >
            {analysis.glyph}
          </span>
          <div className="flex flex-col min-w-0">
            <span 
              className="text-[10px] font-mono font-extrabold uppercase tracking-wider truncate"
              style={{ color: analysis.colorHex }}
            >
              {analysis.stageTitle}
            </span>
            <span className="text-[8.5px] font-mono text-neutral-400 truncate">
              {analysis.latinName.split('•')[0]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Solfeggio sound trigger */}
          <button
            type="button"
            onClick={handlePlayFrequency}
            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title={`Listen to ${analysis.solfeggioFrequency} Hz Solfeggio frequency for ${analysis.stageTitle}`}
          >
            <Volume2 className={`w-3 h-3 ${isPlayingSolfeggio ? 'text-amber-300 animate-pulse' : ''}`} />
          </button>

          {isExpanded ? (
            <ChevronUp className="w-3 h-3 text-neutral-400" />
          ) : (
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          )}
        </div>
      </div>

      {/* Expanded Alchemical & Mystical Hermeneutics */}
      {isExpanded && (
        <div className="p-2.5 space-y-2 text-[10px] font-mono">
          {/* Dynamic Trend Vector & Elemental Force */}
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-white/5">
            <div className="flex items-center gap-1 text-neutral-300">
              <span className="text-xs">{analysis.elementIcon}</span>
              <span className="truncate">{analysis.element}</span>
            </div>
            <div 
              className="px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 border"
              style={{
                backgroundColor: analysis.colorHex + '25',
                borderColor: analysis.colorHex + '60',
                color: analysis.colorHex
              }}
            >
              {analysis.trendDelta > 0 ? `+${analysis.trendDelta.toFixed(1)}%` : `${analysis.trendDelta.toFixed(1)}%`} ({analysis.directionLabel.split('(')[0].trim()})
            </div>
          </div>

          {/* Hermetic Principle & Sacred Axiom */}
          <div className="space-y-1 bg-black/40 p-2 rounded border border-white/5">
            <div className="flex items-center justify-between text-[8.5px] text-neutral-400 uppercase tracking-wider">
              <span>Hermetic Principle</span>
              <span style={{ color: analysis.colorHex }}>{analysis.solfeggioFrequency} Hz Resonance</span>
            </div>
            <p className="font-serif italic text-white/90 text-[10.5px] leading-tight">
              &ldquo;{analysis.esotericAxiom}&rdquo;
            </p>
            <p className="text-[9px] text-neutral-300 font-sans leading-relaxed pt-0.5 border-t border-white/5">
              {analysis.loreInterpretation}
            </p>
          </div>

          {/* Celestial Alignment Coordinates (When Active or Available) */}
          {celestialData && (
            <div 
              className={`p-2 rounded border transition-colors ${
                isCelestialActive 
                  ? 'bg-[#0B1218] border-cyan-500/50 text-cyan-200' 
                  : 'bg-black/30 border-white/5 text-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-wider pb-1 mb-1 border-b border-white/5">
                <div className="flex items-center gap-1 text-[#C5A059]">
                  <Star className="w-3 h-3 text-[#C5A059] fill-[#C5A059]/30" />
                  <span>Celestial Star Mapping</span>
                </div>
                <span 
                  className="px-1 py-0.2 rounded text-[8px] font-bold"
                  style={{ 
                    backgroundColor: celestialData.constellationColor + '30',
                    color: celestialData.constellationColor
                  }}
                >
                  {celestialData.constellation}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1 text-[9px]">
                <div>
                  <span className="text-neutral-400">Star Node: </span>
                  <span className="text-white font-semibold">{celestialData.starName.split('(')[0]}</span>
                </div>
                <div>
                  <span className="text-neutral-400">Bioregion: </span>
                  <span className="text-emerald-300 font-semibold">{celestialData.bioregion}</span>
                </div>
                <div>
                  <span className="text-neutral-400">Right Ascension: </span>
                  <span className="text-cyan-300">{celestialData.celestialCoordinates.ra}</span>
                </div>
                <div>
                  <span className="text-neutral-400">Declination: </span>
                  <span className="text-cyan-300">{celestialData.celestialCoordinates.dec}</span>
                </div>
              </div>
            </div>
          )}

          {/* Purified Status Indicator if active */}
          {isPurified && (
            <div className="flex items-center justify-between px-2 py-1 rounded bg-[#101F15] border border-emerald-500/40 text-[9px] text-emerald-300">
              <span className="flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                Purified via Stardust Cleanse
              </span>
              <span className="text-neutral-400">Noise: 0.2% (Sublimated)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
