import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Heart, 
  Activity, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  TrendingUp, 
  AlertCircle,
  Radio,
  Sliders,
  Maximize2
} from 'lucide-react';
import { alchemicalAudio } from '../../lib/alchemicalAudio';

interface PlanetaryPulseVisualizerProps {
  ecologicalFlourishing: number; // e.g. 92.4
  economicStability: number;     // e.g. 89.2
  bioregionName?: string;
  isPurified?: boolean;
  onInspectBioregion?: () => void;
}

interface VitalSign {
  id: string;
  name: string;
  value: string;
  nominal: string;
  status: 'optimal' | 'stable' | 'elevated' | 'critical';
  trend: string;
  organEquivalent: string;
}

export const PlanetaryPulseVisualizer: React.FC<PlanetaryPulseVisualizerProps> = ({
  ecologicalFlourishing = 92.4,
  economicStability = 89.2,
  bioregionName = 'Pan-African Green Corridor',
  isPurified = false,
  onInspectBioregion
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // States
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [pulseMode, setPulseMode] = useState<'homeostasis' | 'photosynthetic_surge' | 'stress_adaptation'>('homeostasis');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState({ width: 700, height: 160 });

  // Calculate dynamic planetary vital signs based on input metrics
  const planetaryHealthScore = useMemo(() => {
    return Math.round((ecologicalFlourishing * 0.65) + (economicStability * 0.35));
  }, [ecologicalFlourishing, economicStability]);

  // Heartbeat Rate (BPM)
  // Healthy baseline: 68-74 BPM. Stress increases BPM, pure regeneration brings deep resting 64 BPM.
  const bpm = useMemo(() => {
    if (pulseMode === 'photosynthetic_surge') return 84;
    if (pulseMode === 'stress_adaptation') return 96;
    return Math.round(62 + (100 - ecologicalFlourishing) * 0.8);
  }, [ecologicalFlourishing, pulseMode]);

  // Heart Rate Variability / Biosphere Adaptive Resilience
  const hrv = useMemo(() => {
    return Math.round(55 + (ecologicalFlourishing * 0.42));
  }, [ecologicalFlourishing]);

  // Carbon Systolic Pressure & Hydrological Diastolic Pressure
  const systolicPressure = useMemo(() => Math.round(112 + (100 - ecologicalFlourishing) * 0.4), [ecologicalFlourishing]);
  const diastolicPressure = useMemo(() => Math.round(72 + (100 - economicStability) * 0.3), [economicStability]);

  const vitalSigns: VitalSign[] = useMemo(() => [
    {
      id: 'photosynthesis',
      name: 'Canopy Photosynthetic Flux',
      value: `${(18.4 + (ecologicalFlourishing - 90) * 0.4).toFixed(1)} gC/m²/day`,
      nominal: '16.0 - 20.0 gC/m²',
      status: 'optimal',
      trend: '+4.2% YoY',
      organEquivalent: 'Biosphere Pulmonary Lung'
    },
    {
      id: 'aquifer',
      name: 'Groundwater Sponge Pressure',
      value: `${(2.84 + (economicStability - 85) * 0.05).toFixed(2)} bar`,
      nominal: '2.5 - 3.2 bar',
      status: 'optimal',
      trend: '+0.18 bar recharge',
      organEquivalent: 'Hydrological Renal System'
    },
    {
      id: 'soil_respiration',
      name: 'Microbiome Basal Respiration',
      value: `${(3.4 + (ecologicalFlourishing / 50)).toFixed(1)} µg C-CO₂/g/h`,
      nominal: '4.0 - 6.0 µg',
      status: 'optimal',
      trend: 'Balanced biological turnover',
      organEquivalent: 'Earth Digestive Metabolism'
    },
    {
      id: 'albedo',
      name: 'Surface Thermal Emissivity',
      value: '293.15 K (20.0 °C)',
      nominal: '290.0 - 296.0 K',
      status: 'stable',
      trend: '-0.8°C thermal buffer',
      organEquivalent: 'Vascular Thermoregulation'
    }
  ], [ecologicalFlourishing, economicStability]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth } = containerRef.current;
        setDimensions({
          width: Math.max(320, clientWidth),
          height: 160
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Web Audio Heartbeat Acoustic Pulse
  const playHeartbeatAcoustic = (isSystole: boolean) => {
    if (!isAudioEnabled) return;
    try {
      alchemicalAudio.playSingingBowl(isSystole ? 108 : 72, 0.4);
    } catch (_) {}
  };

  // D3 Animated Cardiac Pulse Waveform
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 20, right: 30, bottom: 20, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Defs & Gradients
    const defs = svg.append('defs');

    // Cardiac glow filter
    const filter = defs.append('filter')
      .attr('id', 'cardiac-glow')
      .attr('x', '-30%')
      .attr('y', '-30%')
      .attr('width', '160%')
      .attr('height', '160%');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', 3)
      .attr('result', 'blur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'blur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Linear gradient along the pulse trail
    const lineGradient = defs.append('linearGradient')
      .attr('id', 'pulse-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', innerWidth).attr('y2', 0);
    lineGradient.append('stop').attr('offset', '0%').attr('stop-color', '#10B981').attr('stop-opacity', 0.15);
    lineGradient.append('stop').attr('offset', '60%').attr('stop-color', '#10B981').attr('stop-opacity', 0.85);
    lineGradient.append('stop').attr('offset', '90%').attr('stop-color', '#C5A059').attr('stop-opacity', 1.0);
    lineGradient.append('stop').attr('offset', '100%').attr('stop-color', '#FFFFFF').attr('stop-opacity', 1.0);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Subtle background grid
    const gridG = g.append('g').attr('class', 'grid-lines').attr('opacity', 0.12);
    const numGridCols = 16;
    const numGridRows = 6;
    for (let c = 0; c <= numGridCols; c++) {
      gridG.append('line')
        .attr('x1', (innerWidth / numGridCols) * c)
        .attr('y1', 0)
        .attr('x2', (innerWidth / numGridCols) * c)
        .attr('y2', innerHeight)
        .attr('stroke', '#10B981')
        .attr('stroke-width', 0.5);
    }
    for (let r = 0; r <= numGridRows; r++) {
      gridG.append('line')
        .attr('x1', 0)
        .attr('y1', (innerHeight / numGridRows) * r)
        .attr('x2', innerWidth)
        .attr('y2', (innerHeight / numGridRows) * r)
        .attr('stroke', '#10B981')
        .attr('stroke-width', 0.5);
    }

    // Baseline isoelectric horizontal line
    g.append('line')
      .attr('x1', 0)
      .attr('y1', innerHeight / 2)
      .attr('x2', innerWidth)
      .attr('y2', innerHeight / 2)
      .attr('stroke', '#10B981')
      .attr('stroke-width', 0.8)
      .attr('stroke-opacity', 0.25)
      .attr('stroke-dasharray', '2 4');

    // Pulse Path
    const path = g.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'url(#pulse-gradient)')
      .attr('stroke-width', 2.2)
      .attr('filter', 'url(#cardiac-glow)');

    // Real-time Reticle / Leading Cardiac Probe Dot
    const reticleG = g.append('g');
    const reticleAura = reticleG.append('circle')
      .attr('r', 8)
      .attr('fill', '#C5A059')
      .attr('fill-opacity', 0.25)
      .attr('stroke', '#C5A059')
      .attr('stroke-width', 1);
    const reticleDot = reticleG.append('circle')
      .attr('r', 3.5)
      .attr('fill', '#FFFFFF')
      .attr('stroke', '#C5A059')
      .attr('stroke-width', 1.5);

    // Number of discrete samples along the horizontal EKG window
    const sampleCount = 180;
    const xScale = d3.scaleLinear().domain([0, sampleCount - 1]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([-1.2, 1.2]).range([innerHeight, 0]);

    const lineGen = d3.line<number>()
      .x((_, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveBasis);

    let phase = 0;
    let lastBeatTime = Date.now();
    const cyclePeriodMs = (60 / bpm) * 1000;

    const animate = () => {
      const now = Date.now();
      const dt = now - lastBeatTime;

      // Check for systolic spike audio trigger
      if (dt > cyclePeriodMs) {
        lastBeatTime = now;
        playHeartbeatAcoustic(true);
      } else if (Math.abs(dt - cyclePeriodMs * 0.35) < 30) {
        playHeartbeatAcoustic(false);
      }

      // Progress phase
      phase += (bpm / 60) * 0.055;

      // Synthesize realistic P-QRS-T planetary cardiac waveform
      const data: number[] = [];
      for (let i = 0; i < sampleCount; i++) {
        const t = (i / 15) - phase;
        const cycle = ((t % Math.PI) + Math.PI) % Math.PI;

        // Isoelectric baseline noise
        let val = Math.sin(t * 8) * 0.02 + Math.sin(t * 3.7) * 0.015;

        // P-Wave (Atrial Depolarization / Biosphere Awakening)
        if (cycle > 0.4 && cycle < 0.8) {
          val += Math.sin((cycle - 0.4) * (Math.PI / 0.4)) * 0.18;
        }
        // Q-Dip
        else if (cycle >= 0.8 && cycle < 0.95) {
          val -= Math.sin((cycle - 0.8) * (Math.PI / 0.15)) * 0.14;
        }
        // R-Spike (Ventricular Depolarization / Systolic Photosynthetic Surge)
        else if (cycle >= 0.95 && cycle < 1.15) {
          const rProgress = (cycle - 0.95) / 0.2;
          val += Math.sin(rProgress * Math.PI) * (pulseMode === 'photosynthetic_surge' ? 1.05 : 0.88);
        }
        // S-Dip
        else if (cycle >= 1.15 && cycle < 1.3) {
          val -= Math.sin((cycle - 1.15) * (Math.PI / 0.15)) * 0.28;
        }
        // T-Wave (Ventricular Repolarization / Hydrological Restitution)
        else if (cycle >= 1.45 && cycle < 2.0) {
          val += Math.sin((cycle - 1.45) * (Math.PI / 0.55)) * 0.28;
        }
        // Purified bonus: smoother harmonic curve
        if (isPurified) {
          val *= 0.92;
        }

        data.push(val);
      }

      path.attr('d', lineGen(data));

      // Update leading reticle position at the latest sample point
      const lastVal = data[data.length - 1];
      const leadX = innerWidth;
      const leadY = yScale(lastVal);
      reticleG.attr('transform', `translate(${leadX}, ${leadY})`);
      reticleAura.attr('r', 6 + Math.abs(lastVal) * 8);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [dimensions, bpm, pulseMode, isAudioEnabled, isPurified]);

  return (
    <div 
      ref={containerRef}
      className="w-full bg-[#070908] rounded border border-[#10B981]/25 p-4 relative overflow-hidden shadow-2xl transition-all"
    >
      {/* Background bioluminescent ambient radial glow */}
      <div 
        className="absolute -top-12 -right-12 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-20 transition-opacity"
        style={{
          backgroundColor: planetaryHealthScore > 88 ? '#10B981' : '#C5A059'
        }}
      />

      {/* Header telemetry status bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#F5F5F0]/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div 
              className="w-8 h-8 rounded-full bg-[#10B981]/15 border border-[#10B981]/50 flex items-center justify-center text-emerald-400"
              style={{
                animation: `pulse ${(60 / bpm).toFixed(2)}s infinite ease-in-out`
              }}
            >
              <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400/80" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#070908] animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-serif font-bold text-[#F5F5F0] tracking-wide flex items-center gap-1.5">
                <span>Planetary Pulse</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                  REAL-TIME D3 CARDIAC STREAM
                </span>
              </h3>
            </div>
            <p className="text-[11px] font-mono text-[#F5F5F0]/60 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-[#C5A059]" />
              <span className="text-[#C5A059] font-medium">{bioregionName}</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{planetaryHealthScore}% Biospheric Health</span>
            </p>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Audio toggle */}
          <button
            type="button"
            onClick={() => setIsAudioEnabled(prev => !prev)}
            className={`p-1.5 rounded border text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
              isAudioEnabled 
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300' 
                : 'bg-[#141414] border-[#F5F5F0]/15 text-[#F5F5F0]/50 hover:text-white'
            }`}
            title={isAudioEnabled ? "Mute Acoustic Heartbeat" : "Enable Acoustic Heartbeat (108Hz Earth Pulse)"}
          >
            {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isAudioEnabled ? 'AUDIO ON' : 'MUTED'}</span>
          </button>

          {/* Mode Selector */}
          <div className="flex items-center border border-[#F5F5F0]/15 rounded bg-[#101412] p-0.5">
            <button
              type="button"
              onClick={() => setPulseMode('homeostasis')}
              className={`px-2 py-1 rounded text-[9px] font-mono uppercase cursor-pointer transition-colors ${
                pulseMode === 'homeostasis' ? 'bg-emerald-900/70 text-emerald-200 font-bold' : 'text-[#F5F5F0]/50 hover:text-white'
              }`}
            >
              Homeostasis
            </button>
            <button
              type="button"
              onClick={() => setPulseMode('photosynthetic_surge')}
              className={`px-2 py-1 rounded text-[9px] font-mono uppercase cursor-pointer transition-colors ${
                pulseMode === 'photosynthetic_surge' ? 'bg-emerald-900/70 text-emerald-200 font-bold' : 'text-[#F5F5F0]/50 hover:text-white'
              }`}
            >
              Photosynthesis
            </button>
            <button
              type="button"
              onClick={() => setPulseMode('stress_adaptation')}
              className={`px-2 py-1 rounded text-[9px] font-mono uppercase cursor-pointer transition-colors ${
                pulseMode === 'stress_adaptation' ? 'bg-amber-950/80 text-amber-200 font-bold border border-amber-500/40' : 'text-[#F5F5F0]/50 hover:text-white'
              }`}
            >
              Stress Test
            </button>
          </div>

          {/* Detailed Vital Signs Inspector Button */}
          <button
            type="button"
            onClick={() => setIsDetailModalOpen(true)}
            className="px-2.5 py-1 bg-[#141816] hover:bg-[#1E2522] border border-[#10B981]/40 text-[#10B981] hover:text-white rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Vital Signs</span>
          </button>
        </div>
      </div>

      {/* D3 Heartbeat Stage */}
      <div className="relative w-full my-2">
        <svg 
          ref={svgRef} 
          width={dimensions.width} 
          height={dimensions.height}
          className="w-full overflow-visible"
        />

        {/* Live EKG Overlay HUD readout */}
        <div className="absolute top-2 left-3 pointer-events-none flex items-center gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1 text-emerald-400">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>HEARTBEAT: <strong className="text-white text-xs">{bpm} BPM</strong></span>
          </div>
          <div className="text-[#F5F5F0]/60 hidden sm:inline">
            HRV RESILIENCE: <strong className="text-[#C5A059]">{hrv} ms</strong>
          </div>
          <div className="text-[#F5F5F0]/60 hidden md:inline">
            BP EQUIVALENT: <strong className="text-white">{systolicPressure}/{diastolicPressure} mmHg</strong>
          </div>
        </div>

        <div className="absolute bottom-2 right-3 pointer-events-none text-[9px] font-mono text-[#F5F5F0]/40">
          SWEEP VELOCITY: 25 mm/s • 0.05-150 Hz TELEMETRY BAND
        </div>
      </div>

      {/* Mini Vital Signs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#F5F5F0]/10">
        {vitalSigns.map(v => (
          <div key={v.id} className="bg-[#0A0D0B] p-2 rounded border border-[#F5F5F0]/5 flex flex-col justify-between">
            <div className="text-[9px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider truncate">
              {v.name}
            </div>
            <div className="text-xs font-mono font-bold text-[#F5F5F0] mt-0.5">
              {v.value}
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono mt-1 text-emerald-400">
              <span>{v.trend}</span>
              <span className="text-[#C5A059] text-[8px] font-normal hidden sm:inline">{v.organEquivalent.split(' ')[0]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Vital Signs Detailed Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0D0B] border border-[#10B981]/50 rounded-lg max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400/70" />
                <h2 className="text-lg font-serif text-white">Bioregional Epistemic Vital Signs</h2>
              </div>
              <button 
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="text-[#F5F5F0]/60 hover:text-white font-mono text-sm px-2 py-1 rounded bg-[#141816]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-mono text-[#F5F5F0]/70">
              The Planetary Pulse models earth system dynamics using cyber-physical biological analogies. 
              When photosynthesis surges, ventricular contraction forces nutrients through the soil-canopy vascular tree.
            </p>

            <div className="space-y-3">
              {vitalSigns.map(v => (
                <div key={v.id} className="bg-[#070908] p-3 rounded border border-[#F5F5F0]/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                      <span>{v.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-normal">
                        {v.organEquivalent}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-[#F5F5F0]/50 mt-0.5">
                      Nominal Envelope: {v.nominal}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-emerald-400">{v.value}</div>
                    <div className="text-[10px] font-mono text-[#C5A059]">{v.trend}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#F5F5F0]/10 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400">✓ Audited Sensor Ground Truth (LifePod Mesh #12)</span>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 bg-[#10B981] hover:bg-emerald-400 text-black font-bold rounded cursor-pointer transition-colors"
              >
                Close Vital Signs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
