import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Radio,
  Sliders,
  Sparkles,
  TreePine,
  Droplets,
  Bird,
  Sprout,
  Wind,
  Activity,
  Headphones,
  Info
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

interface GenerativeSoundscapeProps {
  rainfallMm?: number;
  biodiversityIndex?: number;
  soilMoisturePct?: number;
  canopyDensityPct?: number;
  bioregionName?: string;
}

export const GenerativeSoundscapeEngine: React.FC<GenerativeSoundscapeProps> = ({
  rainfallMm = 18.4,
  biodiversityIndex = 79,
  soilMoisturePct = 42.6,
  canopyDensityPct = 68.4,
  bioregionName = 'Aberdare Highland Watershed & Riparian Corridor'
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState<number>(0.65);
  const [activePreset, setActivePreset] = useState<string>('aberdare_dawn');

  // Channel stem levels (0.0 - 1.0)
  const [stemLevels, setStemLevels] = useState<{
    hydro: number;
    avian: number;
    mycelial: number;
    canopy: number;
  }>({
    hydro: 0.7,
    avian: 0.8,
    mycelial: 0.6,
    canopy: 0.5
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const gainsRef = useRef<{
    hydroGain: GainNode | null;
    avianGain: GainNode | null;
    mycelialGain: GainNode | null;
    canopyGain: GainNode | null;
  }>({
    hydroGain: null,
    avianGain: null,
    mycelialGain: null,
    canopyGain: null
  });
  const nodesRef = useRef<any[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Web Audio Synthesizer Engine
  const startAudioEngine = async () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Master Gain & Analyser
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(masterVolume, ctx.currentTime);
      masterGainRef.current = masterGain;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      masterGain.connect(analyser);
      analyser.connect(ctx.destination);

      // --- Stem 1: Mycelial Sub-Harmonic Binaural Drone (55Hz / 110Hz) ---
      const mycelialGain = ctx.createGain();
      mycelialGain.gain.setValueAtTime(stemLevels.mycelial * 0.4, ctx.currentTime);
      gainsRef.current.mycelialGain = mycelialGain;
      mycelialGain.connect(masterGain);

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // 55Hz Sub A

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110.5, ctx.currentTime); // 110.5Hz Binaural Detune

      // LFO for soil respiration pulse
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.15, ctx.currentTime); // Slow 6.6s breathing cycle
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(15, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc2.frequency);

      osc1.connect(mycelialGain);
      osc2.connect(mycelialGain);
      osc1.start();
      osc2.start();
      lfo.start();
      nodesRef.current.push(osc1, osc2, lfo);

      // --- Stem 2: Canopy Wind Rustle (Filtered Noise) ---
      const canopyGain = ctx.createGain();
      canopyGain.gain.setValueAtTime(stemLevels.canopy * 0.25, ctx.currentTime);
      gainsRef.current.canopyGain = canopyGain;
      canopyGain.connect(masterGain);

      // Create white noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(320, ctx.currentTime);
      windFilter.Q.setValueAtTime(2.0, ctx.currentTime);

      whiteNoise.connect(windFilter);
      windFilter.connect(canopyGain);
      whiteNoise.start();
      nodesRef.current.push(whiteNoise);

      // --- Stem 3: Hydrological Rain Droplets (Probabilistic Noise Pings) ---
      const hydroGain = ctx.createGain();
      hydroGain.gain.setValueAtTime(stemLevels.hydro * 0.35, ctx.currentTime);
      gainsRef.current.hydroGain = hydroGain;
      hydroGain.connect(masterGain);

      // Rain droplet interval generator
      const triggerDroplet = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const now = ctx.currentTime;
        const dropOsc = ctx.createOscillator();
        const dropGain = ctx.createGain();

        // Droplet resonant pitch between 600Hz and 1800Hz
        const baseFreq = 600 + Math.random() * 1200;
        dropOsc.type = 'sine';
        dropOsc.frequency.setValueAtTime(baseFreq, now);
        dropOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);

        dropGain.gain.setValueAtTime(0.001, now);
        dropGain.gain.linearRampToValueAtTime(0.12, now + 0.01);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

        dropOsc.connect(dropGain);
        dropGain.connect(hydroGain);

        dropOsc.start(now);
        dropOsc.stop(now + 0.1);
      };

      const rainInterval = setInterval(() => {
        if (Math.random() < 0.6) {
          triggerDroplet();
        }
      }, 160);
      nodesRef.current.push({ stop: () => clearInterval(rainInterval) });

      // --- Stem 4: Avian Bio-Acoustic Chirp Generator ---
      const avianGain = ctx.createGain();
      avianGain.gain.setValueAtTime(stemLevels.avian * 0.3, ctx.currentTime);
      gainsRef.current.avianGain = avianGain;
      avianGain.connect(masterGain);

      const triggerAvianChirp = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const now = ctx.currentTime;
        const birdOsc = ctx.createOscillator();
        const birdGain = ctx.createGain();

        birdOsc.type = 'triangle';
        const startFreq = 2200 + Math.random() * 1400;
        birdOsc.frequency.setValueAtTime(startFreq, now);
        birdOsc.frequency.linearRampToValueAtTime(startFreq + (Math.random() > 0.5 ? 800 : -600), now + 0.12);
        birdOsc.frequency.linearRampToValueAtTime(startFreq + 200, now + 0.25);

        birdGain.gain.setValueAtTime(0.001, now);
        birdGain.gain.linearRampToValueAtTime(0.08, now + 0.03);
        birdGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

        birdOsc.connect(birdGain);
        birdGain.connect(avianGain);

        birdOsc.start(now);
        birdOsc.stop(now + 0.3);
      };

      const avianInterval = setInterval(() => {
        if (Math.random() < (biodiversityIndex / 100) * 0.45) {
          triggerAvianChirp();
        }
      }, 650);
      nodesRef.current.push({ stop: () => clearInterval(avianInterval) });

      setIsPlaying(true);
    } catch (err) {
      console.warn('Web Audio API initialized with restriction:', err);
    }
  };

  const stopAudioEngine = () => {
    nodesRef.current.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {}
    });
    nodesRef.current = [];

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.close();
      } catch {}
    }
    audioCtxRef.current = null;
    setIsPlaying(false);
  };

  // Toggle soundscape
  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudioEngine();
      audioFeedback.playMicroTick();
    } else {
      startAudioEngine();
      audioFeedback.playSubtleClick();
    }
  };

  // Master Volume update
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(masterVolume, audioCtxRef.current.currentTime, 0.05);
    }
  }, [masterVolume]);

  // Stem updates
  useEffect(() => {
    if (gainsRef.current.hydroGain && audioCtxRef.current) {
      gainsRef.current.hydroGain.gain.setTargetAtTime(stemLevels.hydro * 0.35, audioCtxRef.current.currentTime, 0.05);
    }
    if (gainsRef.current.avianGain && audioCtxRef.current) {
      gainsRef.current.avianGain.gain.setTargetAtTime(stemLevels.avian * 0.3, audioCtxRef.current.currentTime, 0.05);
    }
    if (gainsRef.current.mycelialGain && audioCtxRef.current) {
      gainsRef.current.mycelialGain.gain.setTargetAtTime(stemLevels.mycelial * 0.4, audioCtxRef.current.currentTime, 0.05);
    }
    if (gainsRef.current.canopyGain && audioCtxRef.current) {
      gainsRef.current.canopyGain.gain.setTargetAtTime(stemLevels.canopy * 0.25, audioCtxRef.current.currentTime, 0.05);
    }
  }, [stemLevels]);

  // Preset switch handler
  const handlePresetSelect = (presetKey: string) => {
    setActivePreset(presetKey);
    audioFeedback.playMicroTick();
    switch (presetKey) {
      case 'aberdare_dawn':
        setStemLevels({ hydro: 0.6, avian: 0.9, mycelial: 0.7, canopy: 0.6 });
        break;
      case 'mara_rain':
        setStemLevels({ hydro: 0.95, avian: 0.4, mycelial: 0.8, canopy: 0.75 });
        break;
      case 'mathare_wetland':
        setStemLevels({ hydro: 0.8, avian: 0.6, mycelial: 0.4, canopy: 0.3 });
        break;
      case 'highland_night':
        setStemLevels({ hydro: 0.3, avian: 0.2, mycelial: 0.95, canopy: 0.4 });
        break;
    }
  };

  // Canvas Waveform Animation Loop
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const renderWaveform = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (isPlaying && analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barWidth = (w / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * h;

          const grad = ctx.createLinearGradient(0, h, 0, 0);
          grad.addColorStop(0, '#10B981');
          grad.addColorStop(0.6, '#06B6D4');
          grad.addColorStop(1, '#C5A059');

          ctx.fillStyle = grad;
          ctx.fillRect(x, h - barHeight, barWidth - 1, barHeight);
          x += barWidth + 1;
        }
      } else {
        // Idle ambient line
        ctx.strokeStyle = '#10B98130';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(renderWaveform);
    };

    renderWaveform();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudioEngine();
    };
  }, []);

  return (
    <div className="w-full bg-[#0B0F0C] border border-emerald-500/30 rounded-sm p-4 shadow-2xl space-y-3 font-mono">
      {/* Header & Master Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-sm flex items-center justify-center border transition-all ${
            isPlaying ? 'bg-emerald-950 border-emerald-400 text-emerald-300 animate-pulse' : 'bg-[#141414] border-[#F5F5F0]/20 text-[#F5F5F0]/50'
          }`}>
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif font-bold text-sm text-[#F5F5F0]">Generative Ecological Soundscape Engine</h4>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                isPlaying ? 'bg-emerald-950 text-emerald-300 border border-emerald-400' : 'bg-[#1a1a1a] text-[#F5F5F0]/40'
              }`}>
                {isPlaying ? 'LIVE SPATIAL SONIFICATION' : 'STANDBY'}
              </span>
            </div>
            <p className="text-[10px] text-[#F5F5F0]/60 font-sans">
              Real-time multi-harmonic Web Audio spatialization mapped to in-situ telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Waveform Visualizer Canvas */}
          <canvas ref={canvasRef} width={100} height={26} className="bg-[#050806] rounded border border-emerald-500/20" />

          {/* Master Volume Slider */}
          <div className="flex items-center gap-1.5 text-xs">
            <Volume2 className="w-3.5 h-3.5 text-[#F5F5F0]/60" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={masterVolume}
              onChange={e => setMasterVolume(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-[#1f2923] rounded appearance-none accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* Start / Stop Soundscape Button */}
          <button
            onClick={handleTogglePlay}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isPlaying
                ? 'bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-500'
                : 'bg-emerald-600 hover:bg-emerald-500 text-black shadow-md'
            }`}
          >
            {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Mute Soundscape' : 'Sonify Bioregion'}</span>
          </button>
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <span className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-wider">Acoustic Presets:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'aberdare_dawn', label: 'Cloud Forest Dawn', desc: 'High Avian + Mist Rustle' },
            { id: 'mara_rain', label: 'Savanna Rain Pulse', desc: 'Rain Droplets + Baseflow' },
            { id: 'mathare_wetland', label: 'Riparian Swale Rebirth', desc: 'Water Flow + Bio-Swale' },
            { id: 'highland_night', label: 'Night Fungal Respiration', desc: 'Sub-Bass Drone (55Hz)' }
          ].map(preset => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer transition-all border ${
                activePreset === preset.id
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300 font-bold'
                  : 'bg-[#121212] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Channel Stem Mixer Sliders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {/* Stem 1: Hydrology */}
        <div className="p-2.5 bg-[#0e1410] border border-cyan-500/20 rounded space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-cyan-300 font-bold">
              <Droplets className="w-3 h-3 text-cyan-400" />
              Hydrology
            </span>
            <span className="text-cyan-400 font-mono">{rainfallMm} mm/hr</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={stemLevels.hydro}
            onChange={e => setStemLevels({ ...stemLevels, hydro: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#16221c] rounded appearance-none accent-cyan-400 cursor-pointer"
          />
          <div className="text-[9px] text-[#F5F5F0]/40 line-clamp-1">Probabilistic droplets & stream bed pings</div>
        </div>

        {/* Stem 2: Avian Bio-Acoustics */}
        <div className="p-2.5 bg-[#0e1410] border border-purple-500/20 rounded space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-purple-300 font-bold">
              <Bird className="w-3 h-3 text-purple-400" />
              Bio-Acoustics
            </span>
            <span className="text-purple-400 font-mono">{biodiversityIndex} NDSI</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={stemLevels.avian}
            onChange={e => setStemLevels({ ...stemLevels, avian: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#16221c] rounded appearance-none accent-purple-400 cursor-pointer"
          />
          <div className="text-[9px] text-[#F5F5F0]/40 line-clamp-1">FM synthesized avian & pollinator chirps</div>
        </div>

        {/* Stem 3: Mycelial Sub-Resonance */}
        <div className="p-2.5 bg-[#0e1410] border border-amber-500/20 rounded space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Sprout className="w-3 h-3 text-amber-400" />
              Mycelial Drone
            </span>
            <span className="text-amber-400 font-mono">{soilMoisturePct}% VWC</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={stemLevels.mycelial}
            onChange={e => setStemLevels({ ...stemLevels, mycelial: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#16221c] rounded appearance-none accent-amber-400 cursor-pointer"
          />
          <div className="text-[9px] text-[#F5F5F0]/40 line-clamp-1">55Hz sub-bass binaural microbial pulse</div>
        </div>

        {/* Stem 4: Canopy Wind */}
        <div className="p-2.5 bg-[#0e1410] border border-emerald-500/20 rounded space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-emerald-300 font-bold">
              <TreePine className="w-3 h-3 text-emerald-400" />
              Canopy Wind
            </span>
            <span className="text-emerald-400 font-mono">{canopyDensityPct}% Cover</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={stemLevels.canopy}
            onChange={e => setStemLevels({ ...stemLevels, canopy: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#16221c] rounded appearance-none accent-emerald-400 cursor-pointer"
          />
          <div className="text-[9px] text-[#F5F5F0]/40 line-clamp-1">Bandpass modulated cloud-mist transpiration</div>
        </div>
      </div>
    </div>
  );
};
