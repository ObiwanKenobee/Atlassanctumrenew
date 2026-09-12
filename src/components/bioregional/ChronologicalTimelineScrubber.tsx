import React, { useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Clock, History, Calendar, Sparkles } from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

interface ChronologicalTimelineScrubberProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  minYear?: number;
  maxYear?: number;
}

const HISTORICAL_EPOCHS: Array<{ year: number; title: string; desc: string }> = [
  { year: 2016, title: 'El Niño Shock', desc: 'Severe transboundary drought and peak thermal anomalies' },
  { year: 2018, title: 'Aquifer Deficit', desc: 'Subsurface GRACE-FO equivalent water thickness drops' },
  { year: 2020, title: 'Peatland Inundation', desc: 'High riparian discharge and methane degassing' },
  { year: 2022, title: 'Multi-Year Drought', desc: 'East African dry-season expansion & canopy desiccation' },
  { year: 2024, title: 'Canopy Stress Peak', desc: 'Amazon and Congo biome photosynthetic index depression' },
  { year: 2026, title: 'Live Orbital Harvest', desc: 'Current active multi-sensor telemetry constellation' }
];

export const ChronologicalTimelineScrubber: React.FC<ChronologicalTimelineScrubberProps> = ({
  currentYear,
  onYearChange,
  isPlaying,
  onTogglePlay,
  minYear = 2016,
  maxYear = 2026
}) => {
  const activeEpoch = HISTORICAL_EPOCHS.find(e => e.year === Math.round(currentYear)) || {
    year: Math.round(currentYear),
    title: 'Transitional Telemetry',
    desc: 'Historical sensor interpolation across decadal passes'
  };

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      onYearChange(
        currentYear >= maxYear ? minYear : Number((currentYear + 1).toFixed(0))
      );
    }, 1200);

    return () => clearInterval(timer);
  }, [isPlaying, currentYear, minYear, maxYear, onYearChange]);

  const handleStepBack = () => {
    audioFeedback.playMicroTick();
    onYearChange(Math.max(minYear, currentYear - 1));
  };

  const handleStepForward = () => {
    audioFeedback.playMicroTick();
    onYearChange(Math.min(maxYear, currentYear + 1));
  };

  return (
    <div 
      className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[92%] sm:w-[540px] max-w-[95%] p-2 rounded-xl bg-black/90 backdrop-blur-md border border-[#1B3022] shadow-2xl z-20 pointer-events-auto select-none transition-all"
      role="region"
      aria-label="Chronological Hazard Timeline Scrubber"
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        {/* Playback Controls & Current Year Badge */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleStepBack}
            className="p-1 rounded bg-[#111A13] hover:bg-[#1B3022] text-[#F5F5F0]/70 hover:text-white border border-[#1B3022] transition-colors cursor-pointer"
            title="Step back 1 year"
            aria-label="Step back 1 year"
          >
            <SkipBack className="w-3 h-3" />
          </button>

          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onTogglePlay();
            }}
            className={`px-2.5 py-1 rounded-lg text-[9.5px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer border ${
              isPlaying
                ? 'bg-amber-950/90 text-amber-300 border-amber-500/80 shadow-md ring-1 ring-amber-400/40'
                : 'bg-[#152319] hover:bg-[#1E3324] text-[#C5A059] hover:text-white border-[#2A4630]'
            }`}
            title={isPlaying ? 'Pause Temporal Timelapse' : 'Play 10-Year Hazard Evolution Timelapse'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span>Timelapse</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#C5A059]" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepForward}
            className="p-1 rounded bg-[#111A13] hover:bg-[#1B3022] text-[#F5F5F0]/70 hover:text-white border border-[#1B3022] transition-colors cursor-pointer"
            title="Step forward 1 year"
            aria-label="Step forward 1 year"
          >
            <SkipForward className="w-3 h-3" />
          </button>

          <div className="px-2 py-0.5 rounded bg-black/60 border border-white/10 font-mono text-xs font-bold text-[#C5A059] flex items-center gap-1">
            <History className="w-3 h-3 text-emerald-400" />
            <span>{currentYear}</span>
            {currentYear === maxYear && (
              <span className="text-[8px] text-emerald-400 px-1 rounded bg-emerald-950 border border-emerald-500/40">
                LIVE
              </span>
            )}
          </div>
        </div>

        {/* Active Epoch Headline */}
        <div className="hidden sm:flex items-center gap-1 text-[9.5px] font-mono text-right truncate">
          <span className="text-white font-bold">{activeEpoch.title}</span>
          <span className="text-[#F5F5F0]/40">•</span>
          <span className="text-[#F5F5F0]/60 truncate max-w-[200px]">{activeEpoch.desc}</span>
        </div>
      </div>

      {/* Scrub Range Slider */}
      <div className="relative flex items-center px-1">
        <input
          type="range"
          min={minYear}
          max={maxYear}
          step={1}
          value={currentYear}
          onChange={(e) => {
            audioFeedback.playMicroTick();
            onYearChange(Number(e.target.value));
          }}
          className="w-full h-1.5 bg-[#152319] rounded-lg appearance-none cursor-pointer accent-[#C5A059] focus:outline-none"
        />
      </div>

      {/* Ticks & Labels */}
      <div className="flex justify-between items-center text-[8px] font-mono text-[#F5F5F0]/50 pt-1 px-1">
        {HISTORICAL_EPOCHS.map((ep) => (
          <button
            key={ep.year}
            onClick={() => {
              audioFeedback.playMicroTick();
              onYearChange(ep.year);
            }}
            className={`hover:text-[#C5A059] transition-colors cursor-pointer ${
              ep.year === currentYear ? 'text-[#C5A059] font-bold underline' : ''
            }`}
          >
            {ep.year}
          </button>
        ))}
      </div>
    </div>
  );
};
