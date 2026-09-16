import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Compass, 
  RotateCw, 
  Play, 
  Pause,
  Layers
} from 'lucide-react';
import { calculateCelestialEphemeris } from '../../lib/celestialCalculations';
import { SOLFEGGIO_FREQUENCIES } from '../../data/alchemicalData';
import { CelestialEphemeris, SolfeggioFrequency } from '../../types/alchemical';
import { alchemicalAudio } from '../../lib/alchemicalAudio';

export const CelestialAstrolabeVisualizer: React.FC = () => {
  const [ephemeris, setEphemeris] = useState<CelestialEphemeris>(() => calculateCelestialEphemeris());
  const [activeGeometry, setActiveGeometry] = useState<'flower_of_life' | 'metatron' | 'golden_spiral' | 'vesica_piscis'>('flower_of_life');
  const [activeFreq, setActiveFreq] = useState<number>(528);
  const [isDronePlaying, setIsDronePlaying] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Update ephemeris every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setEphemeris(calculateCelestialEphemeris());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Sacred Geometry Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      const color = '#C5A059';
      ctx.strokeStyle = color;
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 1.4;

      if (activeGeometry === 'flower_of_life') {
        const r = 40;
        // Center circle
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, 2 * Math.PI);
        ctx.stroke();

        // 6 surrounding petal circles (Genesis pattern)
        for (let i = 0; i < 6; i++) {
          const angle = i * (Math.PI / 3);
          ctx.beginPath();
          ctx.arc(r * Math.cos(angle), r * Math.sin(angle), r, 0, 2 * Math.PI);
          ctx.stroke();
        }

        // Second outer ring of 12 circles
        for (let i = 0; i < 12; i++) {
          const angle = i * (Math.PI / 6);
          const dist = (i % 2 === 0) ? r * 2 : r * Math.sqrt(3);
          ctx.beginPath();
          ctx.arc(dist * Math.cos(angle), dist * Math.sin(angle), r, 0, 2 * Math.PI);
          ctx.stroke();
        }

        // Outer boundary rings
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, r * 2.6, 0, 2 * Math.PI);
        ctx.arc(0, 0, r * 2.75, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (activeGeometry === 'metatron') {
        const r = 70;
        const centers: [number, number][] = [[0, 0]];
        // 6 inner circles
        for (let i = 0; i < 6; i++) {
          const angle = i * (Math.PI / 3);
          centers.push([r * 0.5 * Math.cos(angle), r * 0.5 * Math.sin(angle)]);
        }
        // 6 outer circles
        for (let i = 0; i < 6; i++) {
          const angle = i * (Math.PI / 3) + (Math.PI / 6);
          centers.push([r * Math.cos(angle), r * Math.sin(angle)]);
        }

        // Draw connecting chords between all 13 centers
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < centers.length; i++) {
          for (let j = i + 1; j < centers.length; j++) {
            ctx.beginPath();
            ctx.moveTo(centers[i][0], centers[i][1]);
            ctx.lineTo(centers[j][0], centers[j][1]);
            ctx.stroke();
          }
        }

        // Draw the 13 spheres
        ctx.globalAlpha = 0.9;
        ctx.lineWidth = 1.6;
        centers.forEach(([x, y]) => {
          ctx.beginPath();
          ctx.arc(x, y, 16, 0, 2 * Math.PI);
          ctx.stroke();
        });
      } else if (activeGeometry === 'golden_spiral') {
        // Golden Ratio Logarithmic Spiral
        ctx.beginPath();
        const a = 1.2;
        const b = 0.306349; // ln(phi) / (pi/2)
        for (let theta = 0; theta < 5 * Math.PI; theta += 0.05) {
          const radius = a * Math.exp(b * theta);
          const x = radius * Math.cos(theta);
          const y = radius * Math.sin(theta);
          if (theta === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Radiating Golden Proportion rays
        ctx.lineWidth = 0.7;
        ctx.globalAlpha = 0.4;
        for (let i = 0; i < 8; i++) {
          const angle = i * (Math.PI / 4);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(120 * Math.cos(angle), 120 * Math.sin(angle));
          ctx.stroke();
        }
      } else {
        // Vesica Piscis
        const r = 60;
        ctx.beginPath();
        ctx.arc(-r / 2, 0, r, 0, 2 * Math.PI);
        ctx.arc(r / 2, 0, r, 0, 2 * Math.PI);
        ctx.stroke();

        // Sacred almond mandorla core
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.5, 0, 2 * Math.PI);
        ctx.stroke();
      }

      ctx.restore();

      rotation += 0.003;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeGeometry]);

  const toggleDrone = (freq: number) => {
    if (isDronePlaying && activeFreq === freq) {
      alchemicalAudio.stopDrone();
      setIsDronePlaying(false);
    } else {
      setActiveFreq(freq);
      alchemicalAudio.startHarmonicDrone(freq);
      setIsDronePlaying(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mystic Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-[#0D0D0D] border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
            <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
            The Mystic’s Astrolabe & Music of the Spheres
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5F5F0] mt-1">
            Astronomical Ephemeris & Sacred Harmonics
          </h3>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl mt-1">
            "As above, so below; as within, so without." Align with the real-time lunar phase, planetary hour, and pure Solfeggio sound resonances that govern biospheric homeostasis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              alchemicalAudio.playSingingBowl(activeFreq, 3.5);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 text-xs font-mono text-purple-300 border border-purple-500/30 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Strike Singing Bowl
          </button>
        </div>
      </div>

      {/* Real-Time Celestial Ephemeris Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-[#101010] border border-white/10">
          <span className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <Moon className="w-3 h-3 text-cyan-400" />
            Lunar Phase
          </span>
          <span className="text-white font-bold block mt-1 truncate">{ephemeris.lunarPhase}</span>
          <span className="text-[10px] text-cyan-400">{ephemeris.lunarIlluminationPct}% Illuminated</span>
        </div>

        <div className="p-3 rounded-xl bg-[#101010] border border-white/10">
          <span className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <Sun className="w-3 h-3 text-amber-400" />
            Planetary Hour
          </span>
          <span className="text-amber-300 font-bold block mt-1 truncate">{ephemeris.planetaryHour}</span>
          <span className="text-[10px] text-slate-400 truncate block">{ephemeris.planetaryRuler}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#101010] border border-white/10">
          <span className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <Compass className="w-3 h-3 text-emerald-400" />
            Zodiac Decan
          </span>
          <span className="text-emerald-300 font-bold block mt-1">{ephemeris.moonZodiacSign}</span>
          <span className="text-[10px] text-slate-400">Zenith: {ephemeris.solarZenithDeg}°</span>
        </div>

        <div className="p-3 rounded-xl bg-[#101010] border border-white/10">
          <span className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <Radio className="w-3 h-3 text-purple-400" />
            Solfeggio Key
          </span>
          <span className="text-purple-300 font-bold block mt-1">{ephemeris.solfeggioResonanceHz} Hz</span>
          <span className="text-[10px] text-slate-400">Natural Harmonic</span>
        </div>

        <div className="p-3 rounded-xl bg-[#101010] border border-white/10 col-span-2 sm:col-span-4 lg:col-span-1">
          <span className="text-slate-400 text-[10px] uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Aetheric Coherence
          </span>
          <span className="text-amber-400 font-bold block mt-1">{ephemeris.aethericHarmonicScore} / 100</span>
          <span className="text-[10px] text-emerald-400">Optimal Attunement</span>
        </div>
      </div>

      {/* Main Astrolabe Visualizer & Solfeggio Synthesizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Animated Sacred Geometry Canvas */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0A0A0A] border border-purple-500/30 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            Cosmic Matrix ({activeGeometry.replace('_', ' ').toUpperCase()})
          </div>

          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            className="w-[260px] h-[260px] cursor-pointer"
            onClick={() => alchemicalAudio.playSingingBowl(activeFreq, 2.5)}
            title="Click to strike cosmic bell"
          />

          {/* Geometry Selector Pills */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-white/10 font-mono text-[9px]">
            {[
              { id: 'flower_of_life', label: 'Flower of Life' },
              { id: 'metatron', label: 'Metatron Cube' },
              { id: 'golden_spiral', label: 'Golden Spiral Φ' },
              { id: 'vesica_piscis', label: 'Vesica Piscis' }
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setActiveGeometry(g.id as any);
                  alchemicalAudio.playSingingBowl(activeFreq, 1.2);
                }}
                className={`p-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                  activeGeometry === g.id
                    ? 'bg-purple-950/60 border-purple-400 text-purple-200 font-bold'
                    : 'bg-[#121212] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Solfeggio Synthesizer & Harmonic Generator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
                  Continuous Organic Resonance
                </span>
                <h4 className="text-base sm:text-lg font-serif font-bold text-white">
                  Solfeggio Harmonic Synthesizer
                </h4>
              </div>

              <button
                onClick={() => toggleDrone(activeFreq)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  isDronePlaying
                    ? 'bg-purple-500 text-black shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-[#181818] text-purple-300 border border-purple-500/30 hover:bg-[#222]'
                }`}
              >
                {isDronePlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Silence Drone</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Play {activeFreq} Hz Drone</span>
                  </>
                )}
              </button>
            </div>

            {/* Solfeggio Frequency Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOLFEGGIO_FREQUENCIES.map((f) => {
                const isSelected = activeFreq === f.hz;
                const isCurrentPlaying = isDronePlaying && isSelected;

                return (
                  <div
                    key={f.hz}
                    onClick={() => toggleDrone(f.hz)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-950/30 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                        : 'bg-[#111111] border-white/5 text-slate-300 hover:bg-[#161616]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-sm text-purple-300">{f.hz} Hz</span>
                        <span className="text-[10px] text-slate-400 uppercase truncate max-w-[120px]">
                          {f.name.split('&')[0]}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {f.chakraOrCenter}
                      </p>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isCurrentPlaying ? (
                        <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanatory note */}
            <p className="text-[11px] font-serif italic text-slate-400 leading-relaxed pt-2 border-t border-white/5">
              "The universe is composed of sound, light, and geometry. When you attune your workspace to 528 Hz or 432 Hz, your brainwaves synchronize with natural biospheric equilibrium."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
