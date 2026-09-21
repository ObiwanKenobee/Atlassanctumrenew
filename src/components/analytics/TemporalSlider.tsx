import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface TemporalEpochPoint {
  monthIndex: number; // 1 - 24
  label: string; // e.g. "M12"
  fullLabel: string; // "Month 12"
  calendarDate: string; // e.g. "Sep 2026"
  isProjected: boolean;
  ecologicalFlourishing: number; // 0 - 100
  economicStability: number; // 0 - 100
  extractiveCounterfactual: number; // 0 - 100
  decouplingMargin: number; // points
  verifiedSensors: number;
  milestoneTitle: string;
  milestoneDesc: string;
  cryptographicHash: string;
  driftDivergence: number; // % variance from planned target
}

export const TEMPORAL_EPOCH_TIMELINE: TemporalEpochPoint[] = [
  // 12 Months of Historical Ground Truth (2024-2026)
  {
    monthIndex: 1,
    label: 'M01',
    fullLabel: 'Month 01',
    calendarDate: 'Oct 2024',
    isProjected: false,
    ecologicalFlourishing: 62.4,
    economicStability: 58.1,
    extractiveCounterfactual: 78.4,
    decouplingMargin: -16.0,
    verifiedSensors: 420,
    milestoneTitle: 'First Pan-African Biospheric Covenant Ratified',
    milestoneDesc: 'Baseline sensor arrays activated across Mara and Aberdare corridors.',
    cryptographicHash: '0x1a8f9024bc6811ef',
    driftDivergence: 0.0
  },
  {
    monthIndex: 2,
    label: 'M02',
    fullLabel: 'Month 02',
    calendarDate: 'Nov 2024',
    isProjected: false,
    ecologicalFlourishing: 64.8,
    economicStability: 59.4,
    extractiveCounterfactual: 76.2,
    decouplingMargin: -11.4,
    verifiedSensors: 580,
    milestoneTitle: 'Peatland Hydrology Piezometer Mesh Online',
    milestoneDesc: 'Subterranean moisture sensors calibrated with European Space Agency Sentinel-2 radar.',
    cryptographicHash: '0x2b90a135cd7922f0',
    driftDivergence: -0.4
  },
  {
    monthIndex: 3,
    label: 'M03',
    fullLabel: 'Month 03',
    calendarDate: 'Dec 2024',
    isProjected: false,
    ecologicalFlourishing: 67.2,
    economicStability: 62.5,
    extractiveCounterfactual: 74.0,
    decouplingMargin: -6.8,
    verifiedSensors: 710,
    milestoneTitle: 'Great Green Wall Community Nursery Expansion',
    milestoneDesc: 'Over 120,000 indigenous acacia and baobab saplings planted with mycorrhizal fungi inoculation.',
    cryptographicHash: '0x3ca1b246de8a3301',
    driftDivergence: -0.8
  },
  {
    monthIndex: 4,
    label: 'M04',
    fullLabel: 'Month 04',
    calendarDate: 'Jan 2025',
    isProjected: false,
    ecologicalFlourishing: 69.5,
    economicStability: 65.0,
    extractiveCounterfactual: 71.5,
    decouplingMargin: -2.0,
    verifiedSensors: 840,
    milestoneTitle: 'Turkana Solar Borehole Desalination Activated',
    milestoneDesc: 'First 12 solar deep groundwater pumps deployed with zero fossil fuel expenditure.',
    cryptographicHash: '0x4db2c357ef9b4412',
    driftDivergence: -1.1
  },
  {
    monthIndex: 5,
    label: 'M05',
    fullLabel: 'Month 05',
    calendarDate: 'Feb 2025',
    isProjected: false,
    ecologicalFlourishing: 72.8,
    economicStability: 68.2,
    extractiveCounterfactual: 68.9,
    decouplingMargin: +3.9,
    verifiedSensors: 920,
    milestoneTitle: 'First Absolute Decoupling Inversion Recorded',
    milestoneDesc: 'Ecological flourishing index surpassed the historical extractive counterfactual trend line.',
    cryptographicHash: '0x5ec3d468fa0c5523',
    driftDivergence: +0.2
  },
  {
    monthIndex: 6,
    label: 'M06',
    fullLabel: 'Month 06',
    calendarDate: 'Mar 2025',
    isProjected: false,
    ecologicalFlourishing: 75.6,
    economicStability: 71.0,
    extractiveCounterfactual: 65.4,
    decouplingMargin: +10.2,
    verifiedSensors: 1040,
    milestoneTitle: 'Mid-Cycle Multi-Bioregion Quorum Audit',
    milestoneDesc: 'Independent peer review validated 98.4% accuracy across all soil carbon core measurements.',
    cryptographicHash: '0x6fd4e579ab1d6634',
    driftDivergence: -1.5
  },
  {
    monthIndex: 7,
    label: 'M07',
    fullLabel: 'Month 07',
    calendarDate: 'Apr 2025',
    isProjected: false,
    ecologicalFlourishing: 78.4,
    economicStability: 74.3,
    extractiveCounterfactual: 62.1,
    decouplingMargin: +16.3,
    verifiedSensors: 1110,
    milestoneTitle: 'Kilifi Tidal Mangrove Blue Credit Minting',
    milestoneDesc: 'Blue carbon credits cryptographically anchored; 100% of dividends sent to fisher cooperatives.',
    cryptographicHash: '0x70e5f68abc2e7745',
    driftDivergence: -1.2
  },
  {
    monthIndex: 8,
    label: 'M08',
    fullLabel: 'Month 08',
    calendarDate: 'May 2025',
    isProjected: false,
    ecologicalFlourishing: 81.2,
    economicStability: 77.8,
    extractiveCounterfactual: 58.7,
    decouplingMargin: +22.5,
    verifiedSensors: 1190,
    milestoneTitle: 'Bioacoustic Canopy Array Expansion in Aberdare',
    milestoneDesc: 'Acoustic AI models detected 450+ avian and primate vocalizations signaling forest canopy recovery.',
    cryptographicHash: '0x81f6079bcd3f8856',
    driftDivergence: -1.9
  },
  {
    monthIndex: 9,
    label: 'M09',
    fullLabel: 'Month 09',
    calendarDate: 'Jun 2025',
    isProjected: false,
    ecologicalFlourishing: 84.1,
    economicStability: 80.6,
    extractiveCounterfactual: 54.8,
    decouplingMargin: +29.3,
    verifiedSensors: 1250,
    milestoneTitle: 'Maasai Mara Regenerative Commons Dividend Scale',
    milestoneDesc: 'Direct basic dividend reached $24.50/ha for all enrolled pastoralist family bomas.',
    cryptographicHash: '0x920718acde409967',
    driftDivergence: -2.3
  },
  {
    monthIndex: 10,
    label: 'M10',
    fullLabel: 'Month 10',
    calendarDate: 'Jul 2025',
    isProjected: false,
    ecologicalFlourishing: 87.0,
    economicStability: 83.9,
    extractiveCounterfactual: 50.2,
    decouplingMargin: +36.8,
    verifiedSensors: 1310,
    milestoneTitle: 'Congo Basin Peatland Fire Prevention Lockdown',
    milestoneDesc: 'Zero wildfire ignitions across 1.2M hectares due to saturated water table retention shields.',
    cryptographicHash: '0xa31829bdef51aa78',
    driftDivergence: -2.1
  },
  {
    monthIndex: 11,
    label: 'M11',
    fullLabel: 'Month 11',
    calendarDate: 'Aug 2025',
    isProjected: false,
    ecologicalFlourishing: 89.8,
    economicStability: 86.7,
    extractiveCounterfactual: 45.9,
    decouplingMargin: +43.9,
    verifiedSensors: 1380,
    milestoneTitle: 'Universal Biospheric Zero-Deforestation Verified',
    milestoneDesc: 'Satellite radar confirmed net-positive canopy growth across every monitored corridor.',
    cryptographicHash: '0xb42930cefa62bb89',
    driftDivergence: -2.5
  },
  {
    monthIndex: 12,
    label: 'M12',
    fullLabel: 'Month 12',
    calendarDate: 'Sep 2026',
    isProjected: false,
    ecologicalFlourishing: 92.4,
    economicStability: 89.2,
    extractiveCounterfactual: 41.2,
    decouplingMargin: +51.2,
    verifiedSensors: 1450,
    milestoneTitle: '12-Month Epistemic Covenant Parity Ratified',
    milestoneDesc: 'Historic ratification: +51.2 pts decoupling expansion verified across all 8 African bioregions.',
    cryptographicHash: '0xc53a41dfab73cc90',
    driftDivergence: -2.6
  },
  // 12 Months of Gemini 3.8 Epistemic Projections (2026-2027)
  {
    monthIndex: 13,
    label: 'M13',
    fullLabel: 'Month 13 (Projected)',
    calendarDate: 'Oct 2026',
    isProjected: true,
    ecologicalFlourishing: 93.6,
    economicStability: 90.4,
    extractiveCounterfactual: 39.0,
    decouplingMargin: +54.6,
    verifiedSensors: 1520,
    milestoneTitle: 'Projected: Mycelial Subterranean Nutrient Highway',
    milestoneDesc: 'Gemini reasoning models project 18% acceleration in soil microbiome enzymatic activity.',
    cryptographicHash: '0xd64b52efbc84dd01',
    driftDivergence: -2.4
  },
  {
    monthIndex: 14,
    label: 'M14',
    fullLabel: 'Month 14 (Projected)',
    calendarDate: 'Nov 2026',
    isProjected: true,
    ecologicalFlourishing: 94.7,
    economicStability: 91.5,
    extractiveCounterfactual: 37.1,
    decouplingMargin: +57.6,
    verifiedSensors: 1600,
    milestoneTitle: 'Projected: Pan-African Solar Corridor Intertie',
    milestoneDesc: 'Microgrid cross-border barter economy projected to power 22,000 decentralized off-grid pumps.',
    cryptographicHash: '0xe75c63fabd95ee12',
    driftDivergence: -2.8
  },
  {
    monthIndex: 15,
    label: 'M15',
    fullLabel: 'Month 15 (Projected)',
    calendarDate: 'Dec 2026',
    isProjected: true,
    ecologicalFlourishing: 95.8,
    economicStability: 92.6,
    extractiveCounterfactual: 35.0,
    decouplingMargin: +60.8,
    verifiedSensors: 1680,
    milestoneTitle: 'Projected: Biochar Soil Carbon Deep Sequestration',
    milestoneDesc: 'Forecasted permanent soil carbon capture exceeding 8.4M tCO2e across Sahel farm belts.',
    cryptographicHash: '0xf86d74abcd06ff23',
    driftDivergence: -3.2
  },
  {
    monthIndex: 16,
    label: 'M16',
    fullLabel: 'Month 16 (Projected)',
    calendarDate: 'Jan 2027',
    isProjected: true,
    ecologicalFlourishing: 96.5,
    economicStability: 93.8,
    extractiveCounterfactual: 33.2,
    decouplingMargin: +63.3,
    verifiedSensors: 1750,
    milestoneTitle: 'Projected: Urban Sponge Basin Retrofit Phase 2',
    milestoneDesc: 'Nairobi and Kigali modular housing zones projected to retain 98% of peak storm runoff.',
    cryptographicHash: '0x097e85bcde170034',
    driftDivergence: -3.5
  },
  {
    monthIndex: 17,
    label: 'M17',
    fullLabel: 'Month 17 (Projected)',
    calendarDate: 'Feb 2027',
    isProjected: true,
    ecologicalFlourishing: 97.2,
    economicStability: 94.7,
    extractiveCounterfactual: 31.4,
    decouplingMargin: +65.8,
    verifiedSensors: 1820,
    milestoneTitle: 'Projected: Continental Wildlife Corridor Congruence',
    milestoneDesc: 'Elephant and predator migratory paths achieve uninterrupted connectivity from Rift to Mara.',
    cryptographicHash: '0x1a8f96cdef281145',
    driftDivergence: -3.8
  },
  {
    monthIndex: 18,
    label: 'M18',
    fullLabel: 'Month 18 (Projected)',
    calendarDate: 'Mar 2027',
    isProjected: true,
    ecologicalFlourishing: 97.9,
    economicStability: 95.5,
    extractiveCounterfactual: 29.8,
    decouplingMargin: +68.1,
    verifiedSensors: 1900,
    milestoneTitle: 'Projected: 1.5-Year Decoupling Velocity Climax',
    milestoneDesc: 'Decoupling margin reaches +68 pts as regenerative infrastructure fully displaces extractive supply chains.',
    cryptographicHash: '0x2b90a7def0392256',
    driftDivergence: -4.1
  },
  {
    monthIndex: 19,
    label: 'M19',
    fullLabel: 'Month 19 (Projected)',
    calendarDate: 'Apr 2027',
    isProjected: true,
    ecologicalFlourishing: 98.3,
    economicStability: 96.1,
    extractiveCounterfactual: 28.0,
    decouplingMargin: +70.3,
    verifiedSensors: 1980,
    milestoneTitle: 'Projected: Deep Aquifer Pressure Equilibrium',
    milestoneDesc: 'Turkana and Sahara fossil aquifer drawdowns fully offset by managed ecological recharge.',
    cryptographicHash: '0x3ca1b8efa14a3367',
    driftDivergence: -4.3
  },
  {
    monthIndex: 20,
    label: 'M20',
    fullLabel: 'Month 20 (Projected)',
    calendarDate: 'May 2027',
    isProjected: true,
    ecologicalFlourishing: 98.7,
    economicStability: 96.8,
    extractiveCounterfactual: 26.5,
    decouplingMargin: +72.2,
    verifiedSensors: 2050,
    milestoneTitle: 'Projected: Indigenous Agroforestry Canopy Maturation',
    milestoneDesc: 'Acacia albida silvopastoral belts achieve full multi-strata food forest microclimate modulation.',
    cryptographicHash: '0x4db2c9fab25b4478',
    driftDivergence: -4.5
  },
  {
    monthIndex: 21,
    label: 'M21',
    fullLabel: 'Month 21 (Projected)',
    calendarDate: 'Jun 2027',
    isProjected: true,
    ecologicalFlourishing: 99.0,
    economicStability: 97.4,
    extractiveCounterfactual: 25.0,
    decouplingMargin: +74.0,
    verifiedSensors: 2120,
    milestoneTitle: 'Projected: Zero-Extractive Commodity Swap Parity',
    milestoneDesc: 'Circular economy materials exchange represents 92% of all inter-regional infrastructure procurement.',
    cryptographicHash: '0x5ec3da0bc36c5589',
    driftDivergence: -4.8
  },
  {
    monthIndex: 22,
    label: 'M22',
    fullLabel: 'Month 22 (Projected)',
    calendarDate: 'Jul 2027',
    isProjected: true,
    ecologicalFlourishing: 99.3,
    economicStability: 97.9,
    extractiveCounterfactual: 23.5,
    decouplingMargin: +75.8,
    verifiedSensors: 2200,
    milestoneTitle: 'Projected: Continental Coral Reef Thermal Sanctuary',
    milestoneDesc: 'East African marine nurseries demonstrate 94% coral survival amidst simulated warm-water pulses.',
    cryptographicHash: '0x6fd4eb1cd47d6690',
    driftDivergence: -5.0
  },
  {
    monthIndex: 23,
    label: 'M23',
    fullLabel: 'Month 23 (Projected)',
    calendarDate: 'Aug 2027',
    isProjected: true,
    ecologicalFlourishing: 99.6,
    economicStability: 98.4,
    extractiveCounterfactual: 22.1,
    decouplingMargin: +77.5,
    verifiedSensors: 2280,
    milestoneTitle: 'Projected: Sovereign Bioregional Quorum Self-Sufficiency',
    milestoneDesc: 'All participating community councils achieve positive economic dividend autonomy.',
    cryptographicHash: '0x70e5fc2de58e7701',
    driftDivergence: -5.2
  },
  {
    monthIndex: 24,
    label: 'M24',
    fullLabel: 'Month 24 (Projected)',
    calendarDate: 'Sep 2027',
    isProjected: true,
    ecologicalFlourishing: 99.8,
    economicStability: 99.0,
    extractiveCounterfactual: 20.8,
    decouplingMargin: +79.0,
    verifiedSensors: 2400,
    milestoneTitle: 'Projected: 24-Month Biospheric Flourishing Apex',
    milestoneDesc: 'Decoupling margin reaches +79.0 pts with autonomous regenerative governance across 8 bioregions.',
    cryptographicHash: '0x81f60d3ef69f8812',
    driftDivergence: -5.4
  }
];

export const TEMPORAL_EPOCH_DATA = TEMPORAL_EPOCH_TIMELINE;

export interface TemporalSliderProps {
  currentEpochIndex?: number; // 1 - 24
  activeEpochIndex?: number; // 0 - 23 or 1 - 24
  onEpochChange: (point: TemporalEpochPoint) => void;
  onInspectPoint?: (point: TemporalEpochPoint) => void;
  className?: string;
}

export const TemporalSlider: React.FC<TemporalSliderProps> = ({
  currentEpochIndex,
  activeEpochIndex: activeEpochProp,
  onEpochChange,
  onInspectPoint,
  className = ''
}) => {
  const normalizedInitial = typeof activeEpochProp === 'number'
    ? (activeEpochProp < 1 ? activeEpochProp + 1 : activeEpochProp)
    : (currentEpochIndex ?? 12);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const [activeEpochIndex, setActiveEpochIndex] = useState<number>(normalizedInitial);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activePoint = TEMPORAL_EPOCH_TIMELINE.find(p => p.monthIndex === activeEpochIndex) || TEMPORAL_EPOCH_TIMELINE[11];

  // Sync internal state when prop changes
  useEffect(() => {
    const val = typeof activeEpochProp === 'number' 
      ? (activeEpochProp < 1 ? activeEpochProp + 1 : activeEpochProp)
      : currentEpochIndex;
    if (typeof val === 'number') {
      setActiveEpochIndex(val);
    }
  }, [currentEpochIndex, activeEpochProp]);

  // Automated playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      return;
    }

    const intervalMs = Math.round(1500 / playbackSpeed);
    playTimerRef.current = setInterval(() => {
      setActiveEpochIndex(prev => {
        const nextIndex = prev >= 24 ? 1 : prev + 1;
        const nextPoint = TEMPORAL_EPOCH_TIMELINE.find(p => p.monthIndex === nextIndex) || TEMPORAL_EPOCH_TIMELINE[0];
        onEpochChange(nextPoint);
        audioFeedback.playMicroTick();
        return nextIndex;
      });
    }, intervalMs);

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, playbackSpeed, onEpochChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setActiveEpochIndex(val);
    const selected = TEMPORAL_EPOCH_TIMELINE.find(p => p.monthIndex === val);
    if (selected) {
      onEpochChange(selected);
      audioFeedback.playMicroTick();
    }
  };

  const handleStep = (direction: 'prev' | 'next') => {
    audioFeedback.playMicroTick();
    let nextIndex = activeEpochIndex + (direction === 'next' ? 1 : -1);
    if (nextIndex < 1) nextIndex = 24;
    if (nextIndex > 24) nextIndex = 1;
    setActiveEpochIndex(nextIndex);
    const selected = TEMPORAL_EPOCH_TIMELINE.find(p => p.monthIndex === nextIndex);
    if (selected) {
      onEpochChange(selected);
    }
  };

  const handleJumpToMilestone = (monthIndex: number) => {
    audioFeedback.playSubtleClick();
    setActiveEpochIndex(monthIndex);
    const selected = TEMPORAL_EPOCH_TIMELINE.find(p => p.monthIndex === monthIndex);
    if (selected) {
      onEpochChange(selected);
    }
  };

  const togglePlayback = () => {
    audioFeedback.playSubtleClick();
    setIsPlaying(prev => !prev);
  };

  return (
    <div 
      id="interactive-temporal-slider-container"
      className={`bg-[#0F1411] border border-[#C5A059]/40 rounded-md p-4 sm:p-5 shadow-xl space-y-4 ${className}`}
    >
      {/* Top Header: Current Epoch Status & Scrub Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F5F5F0]/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-[#C5A059]/15 border border-[#C5A059]/50 flex items-center justify-center text-[#C5A059] shrink-0">
            <Clock className="w-4 h-4 text-[#C5A059] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                TEMPORAL SCRUBBER • 24-MONTH TRAJECTORY
              </span>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                activePoint.isProjected
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 animate-pulse'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
              }`}>
                {activePoint.isProjected ? 'GEMINI 3.8 FORECAST' : 'HISTORICAL GROUND TRUTH'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-mono font-bold text-white flex items-center gap-2">
              <span>{activePoint.fullLabel}</span>
              <span className="text-[#C5A059]">({activePoint.calendarDate})</span>
              <span className="text-xs text-[#F5F5F0]/50 font-normal hidden md:inline">
                • {activePoint.verifiedSensors} Verified Edge Nodes
              </span>
            </h3>
          </div>
        </div>

        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {/* Step Back */}
          <button
            type="button"
            onClick={() => handleStep('prev')}
            className="p-1.5 rounded bg-[#1A1F1C] hover:bg-[#252C28] border border-[#F5F5F0]/15 text-[#F5F5F0]/70 hover:text-white transition-colors cursor-pointer"
            title="Step Back 1 Month"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Play / Pause */}
          <button
            type="button"
            onClick={togglePlayback}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-black shadow-md'
                : 'bg-[#C5A059] hover:bg-[#d4b068] text-black shadow-sm'
            }`}
            title={isPlaying ? 'Pause timeline animation' : 'Play timeline animation'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Animate</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            type="button"
            onClick={() => handleStep('next')}
            className="p-1.5 rounded bg-[#1A1F1C] hover:bg-[#252C28] border border-[#F5F5F0]/15 text-[#F5F5F0]/70 hover:text-white transition-colors cursor-pointer"
            title="Step Forward 1 Month"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggle */}
          <div className="flex items-center gap-1 bg-[#141815] border border-[#F5F5F0]/10 rounded px-1.5 py-1 text-[10px] font-mono text-[#F5F5F0]/60">
            <span>Speed:</span>
            {[0.5, 1, 2].map(speed => (
              <button
                key={speed}
                type="button"
                onClick={() => {
                  setPlaybackSpeed(speed);
                  audioFeedback.playMicroTick();
                }}
                className={`px-1 rounded cursor-pointer ${
                  playbackSpeed === speed ? 'bg-[#C5A059] text-black font-bold' : 'hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Reset to Today (M12) */}
          <button
            type="button"
            onClick={() => handleJumpToMilestone(12)}
            className="p-1.5 rounded bg-[#1A1F1C] hover:bg-[#252C28] border border-[#F5F5F0]/15 text-[#C5A059] hover:text-white transition-colors cursor-pointer"
            title="Reset to Present Cycle (Month 12)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* The Interactive Slider Track */}
      <div className="space-y-2">
        <div className="relative pt-1">
          {/* Timeline background zone indicators */}
          <div className="w-full flex h-2 rounded-full overflow-hidden mb-1.5 opacity-60">
            <div className="w-1/2 bg-emerald-700/60" title="Historical Baseline (Months 1-12)" />
            <div className="w-1/2 bg-cyan-700/60" title="Gemini Epistemic Projection (Months 13-24)" />
          </div>

          {/* Input Range */}
          <input
            id="temporal-epoch-range-slider"
            type="range"
            min={1}
            max={24}
            step={1}
            value={activeEpochIndex}
            onChange={handleSliderChange}
            className="w-full h-2 bg-[#1C2420] rounded-lg appearance-none cursor-pointer accent-[#C5A059] focus:outline-none"
          />

          {/* Milestone markers along the track */}
          <div className="flex justify-between items-center text-[10px] font-mono text-[#F5F5F0]/40 pt-1">
            <span>M01 (Oct 24)</span>
            <button 
              type="button" 
              onClick={() => handleJumpToMilestone(6)}
              className="hover:text-[#C5A059] cursor-pointer"
            >
              M06 (Mar 25)
            </button>
            <button 
              type="button" 
              onClick={() => handleJumpToMilestone(12)}
              className="text-[#C5A059] font-bold underline cursor-pointer"
            >
              M12 (Sep 26 • Present)
            </button>
            <button 
              type="button" 
              onClick={() => handleJumpToMilestone(18)}
              className="hover:text-cyan-400 cursor-pointer"
            >
              M18 (Mar 27)
            </button>
            <span>M24 (Sep 27)</span>
          </div>
        </div>

        {/* Milestone Quick Jump Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider">Quick Horizons:</span>
          {[
            { m: 1, label: 'M01 Covenant Origin' },
            { m: 5, label: 'M05 First Inversion' },
            { m: 12, label: 'M12 Present Parity' },
            { m: 15, label: 'M15 Deep Biochar' },
            { m: 18, label: 'M18 Decoupling Peak' },
            { m: 24, label: 'M24 Apex Target' }
          ].map(item => (
            <button
              key={item.m}
              type="button"
              onClick={() => handleJumpToMilestone(item.m)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer border ${
                activeEpochIndex === item.m
                  ? 'bg-[#C5A059] text-black border-[#C5A059] font-bold'
                  : 'bg-[#151A17] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:border-[#C5A059]/40 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Epoch Detail HUD: Instant Metrics and Milestone Insight for Active Scrubber Point */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0A0E0C] p-3 rounded border border-[#F5F5F0]/10 text-xs font-mono">
        <div>
          <span className="text-[10px] text-[#F5F5F0]/50 block uppercase">Ecological Vitality</span>
          <div className="text-emerald-400 text-sm font-bold flex items-center gap-1">
            <span>{activePoint.ecologicalFlourishing.toFixed(1)}%</span>
            <TrendingUp className="w-3 h-3 text-emerald-400" />
          </div>
          <span className="text-[9px] text-[#F5F5F0]/40">Target: 95.0%</span>
        </div>

        <div>
          <span className="text-[10px] text-[#F5F5F0]/50 block uppercase">Economic Stability</span>
          <div className="text-cyan-400 text-sm font-bold">
            {activePoint.economicStability.toFixed(1)}%
          </div>
          <span className="text-[9px] text-[#F5F5F0]/40">Base Dividend: $24.50/ha</span>
        </div>

        <div>
          <span className="text-[10px] text-[#F5F5F0]/50 block uppercase">Decoupling Expansion</span>
          <div className="text-[#C5A059] text-sm font-bold">
            {activePoint.decouplingMargin > 0 ? `+${activePoint.decouplingMargin.toFixed(1)}` : activePoint.decouplingMargin.toFixed(1)} pts
          </div>
          <span className="text-[9px] text-[#F5F5F0]/40">Vs Extractive Line</span>
        </div>

        <div 
          onClick={() => onInspectPoint?.(activePoint)}
          className="cursor-pointer hover:bg-white/5 p-1 rounded transition-colors group"
          title="Click to inspect cryptographic provenance and sensor pod quorum"
        >
          <span className="text-[10px] text-[#F5F5F0]/50 block uppercase group-hover:text-[#C5A059]">SHA-256 Proof ↗</span>
          <div className="text-[#F5F5F0]/90 text-[11px] truncate font-mono group-hover:text-white">
            {activePoint.cryptographicHash}
          </div>
          <span className="text-[9px] text-emerald-400/80">Merkle Verified</span>
        </div>
      </div>

      {/* Active Milestone Capsule */}
      <div className="p-2.5 bg-[#141B17] border-l-2 border-[#C5A059] rounded-r text-xs">
        <div className="flex items-center gap-2 text-[#C5A059] font-mono font-bold">
          <Sparkles className="w-3 h-3" />
          <span>Epoch Milestone: {activePoint.milestoneTitle}</span>
        </div>
        <p className="text-[11px] text-[#F5F5F0]/70 font-sans mt-0.5">
          {activePoint.milestoneDesc}
        </p>
      </div>
    </div>
  );
};
