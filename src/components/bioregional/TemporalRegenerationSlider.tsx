import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Sparkles,
  Calendar,
  Layers,
  Activity,
  Compass,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Info,
  Clock
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface TimelineEpoch {
  year: number;
  label: string;
  phase: 'historical' | 'present' | 'projected';
  title: string;
  summary: string;
  canopyDensityPct: number;
  soilOrganicMatterPct: number;
  aquiferRechargeML: number;
  biodiversityIndex: number;
  p90Certainty: number;
  keyIntervention: string;
  color: string;
}

export const TIMELINE_EPOCHS: TimelineEpoch[] = [
  {
    year: 2016,
    label: '2016',
    phase: 'historical',
    title: 'Pre-Restoration Fragmented Baseline',
    summary: 'Severely degraded agricultural boundary with severe topsoil erosion and low fungal hyphae density.',
    canopyDensityPct: 41.2,
    soilOrganicMatterPct: 2.1,
    aquiferRechargeML: 420,
    biodiversityIndex: 48,
    p90Certainty: 98.5,
    keyIntervention: 'Initial drone photogrammetry & soil core sampling baseline',
    color: '#F43F5E'
  },
  {
    year: 2021,
    label: '2021',
    phase: 'historical',
    title: 'Keyline Terracing & Mycelial Inoculation',
    summary: 'First cohort of Podocarpus saplings planted with indigenous glomalin-producing fungal spores.',
    canopyDensityPct: 53.8,
    soilOrganicMatterPct: 3.4,
    aquiferRechargeML: 580,
    biodiversityIndex: 62,
    p90Certainty: 96.2,
    keyIntervention: 'Micro-catchment swales and vetiver silt retention bio-corridors',
    color: '#06B6D4'
  },
  {
    year: 2026,
    label: '2026 (Present)',
    phase: 'present',
    title: 'Present Ground-Truth & In-Situ Sensor Mesh',
    summary: 'Active operational twin monitoring continuous DO, soil moisture, and real-time avian acoustic diversity.',
    canopyDensityPct: 68.4,
    soilOrganicMatterPct: 4.8,
    aquiferRechargeML: 760,
    biodiversityIndex: 79,
    p90Certainty: 93.8,
    keyIntervention: 'Continuous galvanic sensor telemetry & Olosho rotational grazing treaty',
    color: '#10B981'
  },
  {
    year: 2031,
    label: '2031',
    phase: 'projected',
    title: 'Canopy Bridge Closure & Aquifer Infiltration',
    summary: 'Interconnected upper canopy captures horizontal cloud mist, accelerating sub-surface percolation.',
    canopyDensityPct: 79.5,
    soilOrganicMatterPct: 5.9,
    aquiferRechargeML: 980,
    biodiversityIndex: 88,
    p90Certainty: 89.4,
    keyIntervention: 'High-altitude cloud-mist collector mesh & multi-strata understory infill',
    color: '#34D399'
  },
  {
    year: 2040,
    label: '2040',
    phase: 'projected',
    title: 'Aquifer Saturated Sponge Equilibrium',
    summary: 'Perennial baseflow restored to dryland springs with self-regulating microclimate cooling.',
    canopyDensityPct: 86.2,
    soilOrganicMatterPct: 6.8,
    aquiferRechargeML: 1240,
    biodiversityIndex: 94,
    p90Certainty: 84.1,
    keyIntervention: 'Customary sacred grove expansion & perpetual biodiversity trust endowment',
    color: '#84CC16'
  },
  {
    year: 2050,
    label: '2050',
    phase: 'projected',
    title: 'Climax Poly-Canopy & Climate-Resilient Equilibrium',
    summary: 'Complete biophysical resilience with verified carbon sequestration and sustained endemic habitat.',
    canopyDensityPct: 91.5,
    soilOrganicMatterPct: 7.6,
    aquiferRechargeML: 1490,
    biodiversityIndex: 98,
    p90Certainty: 78.5,
    keyIntervention: 'Autonomous biophilic watershed governance & bio-regional economic sovereignty',
    color: '#C5A059'
  }
];

interface TemporalRegenerationSliderProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  selectedBioregionName?: string;
  onSelectEpoch?: (epoch: TimelineEpoch) => void;
}

export const TemporalRegenerationSlider: React.FC<TemporalRegenerationSliderProps> = ({
  currentYear,
  onYearChange,
  selectedBioregionName = 'Aberdare Highland Watershed & Riparian Corridor',
  onSelectEpoch
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [showMetricsOverlay, setShowMetricsOverlay] = useState<boolean>(true);
  const sliderRef = useRef<HTMLInputElement>(null);

  // Find nearest epoch for current year
  const activeEpoch = useMemo(() => {
    return TIMELINE_EPOCHS.reduce((prev, curr) => {
      return Math.abs(curr.year - currentYear) < Math.abs(prev.year - currentYear) ? curr : prev;
    }, TIMELINE_EPOCHS[0]);
  }, [currentYear]);

  // Interpolated metrics for smooth scrub display
  const interpolatedMetrics = useMemo(() => {
    // Find bounding epochs
    let lower = TIMELINE_EPOCHS[0];
    let upper = TIMELINE_EPOCHS[TIMELINE_EPOCHS.length - 1];

    for (let i = 0; i < TIMELINE_EPOCHS.length - 1; i++) {
      if (currentYear >= TIMELINE_EPOCHS[i].year && currentYear <= TIMELINE_EPOCHS[i + 1].year) {
        lower = TIMELINE_EPOCHS[i];
        upper = TIMELINE_EPOCHS[i + 1];
        break;
      }
    }

    const span = upper.year - lower.year || 1;
    const progress = Math.max(0, Math.min(1, (currentYear - lower.year) / span));

    return {
      canopyDensity: +(lower.canopyDensityPct + (upper.canopyDensityPct - lower.canopyDensityPct) * progress).toFixed(1),
      soilOrganicMatter: +(lower.soilOrganicMatterPct + (upper.soilOrganicMatterPct - lower.soilOrganicMatterPct) * progress).toFixed(1),
      aquiferRecharge: Math.round(lower.aquiferRechargeML + (upper.aquiferRechargeML - lower.aquiferRechargeML) * progress),
      biodiversity: Math.round(lower.biodiversityIndex + (upper.biodiversityIndex - lower.biodiversityIndex) * progress),
      certainty: +(lower.p90Certainty + (upper.p90Certainty - lower.p90Certainty) * progress).toFixed(1)
    };
  }, [currentYear]);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.max(200, 1000 / playbackSpeed);
    const timer = setInterval(() => {
      const nextYear = currentYear >= 2050 ? 2016 : currentYear + 1;
      onYearChange(nextYear);
      audioFeedback.playMicroTick();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, currentYear, onYearChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onYearChange(val);
    audioFeedback.playMicroTick();
  };

  const handleEpochClick = (epoch: TimelineEpoch) => {
    onYearChange(epoch.year);
    audioFeedback.playSubtleClick();
    if (onSelectEpoch) onSelectEpoch(epoch);
  };

  const isHistorical = currentYear <= 2025;
  const isPresent = currentYear === 2026;
  const isProjected = currentYear > 2026;

  return (
    <div className="w-full bg-[#0B0F0D] border border-emerald-500/30 rounded-sm p-4 sm:p-5 shadow-2xl space-y-4 font-mono">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-emerald-950/80 border border-emerald-400 flex items-center justify-center text-emerald-300">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-[#F5F5F0]">Temporal Regeneration Scrubber</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                isHistorical
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  : isPresent
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-400 animate-pulse'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}>
                {isHistorical ? 'Historical In-Situ Sensor Baseline' : isPresent ? 'Current Ground-Truth (2026)' : 'Monte Carlo Climate Projection'}
              </span>
            </div>
            <p className="text-[11px] text-[#F5F5F0]/60 font-sans">
              Seamlessly scrub D3 knowledge nodes, causal links, and biophysical trajectories from 2016 to 2050
            </p>
          </div>
        </div>

        {/* Playback Controls & Speed Toggle */}
        <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              audioFeedback.playSubtleClick();
            }}
            className={`px-3.5 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg'
                : 'bg-emerald-600 hover:bg-emerald-500 text-black shadow-md'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black" />}
            <span>{isPlaying ? 'Pause Trajectory' : 'Play Timeline'}</span>
          </button>

          <button
            onClick={() => {
              onYearChange(2016);
              audioFeedback.playMicroTick();
            }}
            className="p-1.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#F5F5F0]/20 rounded text-[#F5F5F0]/70 hover:text-white cursor-pointer"
            title="Reset to 2016 baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-[#141414] border border-[#F5F5F0]/20 rounded p-0.5 text-[11px]">
            {[1, 2, 5].map(spd => (
              <button
                key={spd}
                onClick={() => {
                  setPlaybackSpeed(spd);
                  audioFeedback.playMicroTick();
                }}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-emerald-800 text-emerald-200 font-bold'
                    : 'text-[#F5F5F0]/50 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowMetricsOverlay(!showMetricsOverlay)}
            className={`px-2.5 py-1.5 border rounded text-xs flex items-center gap-1 cursor-pointer ${
              showMetricsOverlay
                ? 'bg-[#141C16] border-emerald-400/50 text-emerald-300'
                : 'bg-[#141414] border-[#F5F5F0]/20 text-[#F5F5F0]/50 hover:text-white'
            }`}
            title="Toggle Live Trajectory Telemetry Cards"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry</span>
          </button>
        </div>
      </div>

      {/* Interactive Range Slider Track */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#F5F5F0]/50">2016 Baseline</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-[#C5A059] tracking-tight">{currentYear}</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              {currentYear - 2016} yrs elapsed
            </span>
          </div>
          <span className="text-[#F5F5F0]/50">2050 Climax Target</span>
        </div>

        {/* Custom Styled Slider Input */}
        <div className="relative flex items-center">
          <input
            ref={sliderRef}
            type="range"
            min={2016}
            max={2050}
            step={1}
            value={currentYear}
            onChange={handleSliderChange}
            className="w-full h-3 bg-[#18221B] rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            style={{
              background: `linear-gradient(to right, #06B6D4 0%, #10B981 ${((2026 - 2016) / (2050 - 2016)) * 100}%, #C5A059 100%)`
            }}
          />
        </div>

        {/* Milestone Epoch Badges / Quick-jump Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          {TIMELINE_EPOCHS.map(epoch => {
            const isSelected = epoch.year === activeEpoch.year;
            const isExact = epoch.year === currentYear;
            return (
              <button
                key={epoch.year}
                onClick={() => handleEpochClick(epoch)}
                className={`p-2 rounded text-left transition-all cursor-pointer border ${
                  isExact
                    ? 'bg-emerald-950/90 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-400/50'
                    : isSelected
                    ? 'bg-[#141C16] border-emerald-500/40 text-[#F5F5F0]'
                    : 'bg-[#101411] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:border-[#F5F5F0]/30'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] pb-1 border-b border-[#F5F5F0]/10">
                  <span className="font-bold font-mono" style={{ color: epoch.color }}>{epoch.year}</span>
                  <span className="text-[9px] uppercase tracking-wider text-[#F5F5F0]/40">{epoch.phase}</span>
                </div>
                <div className="text-[10px] font-sans font-medium line-clamp-1 pt-1 text-[#F5F5F0]/90">
                  {epoch.title.split(' ')[0]} {epoch.title.split(' ')[1] || ''}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Trajectory Telemetry Overlay */}
      {showMetricsOverlay && (
        <div className="p-3.5 bg-[#080C0A] border border-emerald-500/20 rounded space-y-3 animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#F5F5F0]/10 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-xs font-bold text-emerald-300 font-serif">{activeEpoch.title}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#F5F5F0]/60">
              <span>Confidence: <strong className="text-emerald-400">{interpolatedMetrics.certainty}% P90</strong></span>
              <span>Primary Driver: <strong className="text-[#F5F5F0]">{activeEpoch.keyIntervention}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2 bg-[#121814] rounded border border-emerald-500/20">
              <div className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-wider">Canopy Cover</div>
              <div className="text-base font-bold font-serif text-emerald-400">{interpolatedMetrics.canopyDensity}%</div>
              <div className="text-[9px] text-[#F5F5F0]/40">Podocarpus / Acacia</div>
            </div>

            <div className="p-2 bg-[#121814] rounded border border-amber-500/20">
              <div className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-wider">Soil Organic Matter</div>
              <div className="text-base font-bold font-serif text-amber-400">{interpolatedMetrics.soilOrganicMatter}% SOM</div>
              <div className="text-[9px] text-[#F5F5F0]/40">Rhizosphere Glomalin</div>
            </div>

            <div className="p-2 bg-[#121814] rounded border border-cyan-500/20">
              <div className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-wider">Aquifer Baseflow</div>
              <div className="text-base font-bold font-serif text-cyan-400">{interpolatedMetrics.aquiferRecharge} ML/yr</div>
              <div className="text-[9px] text-[#F5F5F0]/40">Riparian Infiltration</div>
            </div>

            <div className="p-2 bg-[#121814] rounded border border-purple-500/20">
              <div className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-wider">Bio-Acoustic Index</div>
              <div className="text-base font-bold font-serif text-purple-400">{interpolatedMetrics.biodiversity} / 100</div>
              <div className="text-[9px] text-[#F5F5F0]/40">Avian & Pollinators</div>
            </div>
          </div>

          <p className="text-[11px] text-[#F5F5F0]/70 font-sans leading-relaxed italic pt-1">
            "{activeEpoch.summary}"
          </p>
        </div>
      )}
    </div>
  );
};
