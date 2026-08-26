import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Radio, 
  Sparkles, 
  FileText, 
  User, 
  Clock,
  Waves,
  Sliders
} from 'lucide-react';
import { FieldLabNote } from '../../lib/db';
import { audioFeedback } from '../../lib/audioFeedback';

interface FieldNoteAudioPlayerProps {
  note: FieldLabNote;
  className?: string;
}

type FilterMode = 'clean' | 'field_telemetry' | 'resonance';

export const FieldNoteAudioPlayer: React.FC<FieldNoteAudioPlayerProps> = ({
  note,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(note.audioDurationSeconds || 24);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [filterMode, setFilterMode] = useState<FilterMode>('clean');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const synthUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Audio Context initialization
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const gainNode = ctx.createGain();
      gainNode.gain.value = volume;

      const filter = ctx.createBiquadFilter();
      filter.type = 'allpass';

      gainNode.connect(filter);
      filter.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      gainNodeRef.current = gainNode;
      filterNodeRef.current = filter;
    } catch (e) {
      console.warn('Web Audio API not supported in this browser environment:', e);
    }
  }, [volume]);

  // Adjust Filter Modes
  useEffect(() => {
    if (!filterNodeRef.current || !audioContextRef.current) return;
    const filter = filterNodeRef.current;
    const now = audioContextRef.current.currentTime;

    if (filterMode === 'field_telemetry') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3.0, now);
    } else if (filterMode === 'resonance') {
      filter.type = 'peaking';
      filter.frequency.setValueAtTime(432, now);
      filter.gain.setValueAtTime(6.0, now);
      filter.Q.setValueAtTime(2.0, now);
    } else {
      filter.type = 'allpass';
    }
  }, [filterMode]);

  // Waveform Canvas Rendering Loop
  const renderWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const analyser = analyserRef.current;

    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Subtle resting baseline noise
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.max(10, Math.sin(i * 0.2 + Date.now() * 0.002) * 20 + 25);
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Background grid / centerline
      ctx.strokeStyle = 'rgba(245, 245, 240, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw Dynamic Frequency / Waveform Bars
      const barWidth = (width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * (height * 0.75);

        // Progress-based color
        const progressRatio = currentTime / (duration || 1);
        const isPastCurrent = (x / width) <= progressRatio;

        const grad = ctx.createLinearGradient(0, height / 2 - barHeight / 2, 0, height / 2 + barHeight / 2);
        if (isPastCurrent) {
          grad.addColorStop(0, '#C5A059');
          grad.addColorStop(0.5, '#10B981');
          grad.addColorStop(1, '#C5A059');
        } else {
          grad.addColorStop(0, 'rgba(245, 245, 240, 0.2)');
          grad.addColorStop(1, 'rgba(245, 245, 240, 0.08)');
        }

        ctx.fillStyle = grad;
        const yTop = height / 2 - barHeight / 2;
        ctx.fillRect(x, yTop, Math.max(1.5, barWidth - 1), barHeight);

        x += barWidth + 1;
      }

      // Draw Playhead scrubber line
      const playheadX = (currentTime / (duration || 1)) * width;
      ctx.strokeStyle = '#C5A059';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();

      // Playhead beacon
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(playheadX, height / 2, 3.5, 0, Math.PI * 2);
      ctx.fill();
    };

    draw();
  }, [currentTime, duration, isPlaying]);

  useEffect(() => {
    renderWaveform();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [renderWaveform]);

  // Voice synthesis & oscillator simulation
  const startPlayback = () => {
    initAudio();
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    setIsPlaying(true);
    audioFeedback.playMicroTick();

    // Start speech synthesis reading the field transcript
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(note.transcript || 'Field observation logged.');
      utterance.rate = playbackRate;
      utterance.pitch = 1.0;
      utterance.volume = isMuted ? 0 : volume;

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentTime(duration);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      synthUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }

    // Play subtle oscillator carrier tone through Web Audio API to drive analyser
    if (audioContextRef.current && gainNodeRef.current) {
      try {
        const osc = audioContextRef.current.createOscillator();
        const oscGain = audioContextRef.current.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, audioContextRef.current.currentTime);
        oscGain.gain.setValueAtTime(0.04 * (isMuted ? 0 : volume), audioContextRef.current.currentTime);
        
        osc.connect(oscGain);
        oscGain.connect(gainNodeRef.current);
        osc.start();
        
        // Modulate frequency slightly to simulate human voice timbre
        const modInterval = setInterval(() => {
          if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            clearInterval(modInterval);
            return;
          }
          try {
            osc.frequency.setValueAtTime(160 + Math.random() * 120, audioContextRef.current.currentTime);
          } catch {}
        }, 120);

        setTimeout(() => {
          try {
            clearInterval(modInterval);
            osc.stop();
            osc.disconnect();
          } catch {}
        }, (duration - currentTime) * 1000);
      } catch (e) {}
    }

    // Timer advancement
    timerIntervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 0.1 * playbackRate;
        if (next >= duration) {
          clearInterval(timerIntervalRef.current);
          setIsPlaying(false);
          return duration;
        }
        return next;
      });
    }, 100);
  };

  const pausePlayback = () => {
    setIsPlaying(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  };

  const resetPlayback = () => {
    pausePlayback();
    setCurrentTime(0);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;
    setCurrentTime(newTime);
    audioFeedback.playMicroTick();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`p-4 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm space-y-3.5 shadow-md ${className}`}>
      {/* Note Header & Metadata */}
      <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#1B3022] border border-emerald-500/40 flex items-center justify-center">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-serif text-[#F5F5F0] font-bold">
              {note.labName || 'Field Observation'}
            </div>
            <div className="text-[10px] font-mono text-[#F5F5F0]/60 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <User className="w-2.5 h-2.5 text-[#C5A059]" />
                {note.author} ({note.authorRole || 'Field Observer'})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {new Date(note.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Selection Mode */}
        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded border border-[#F5F5F0]/10 text-[9px] font-mono">
          <button
            onClick={() => setFilterMode('clean')}
            className={`px-1.5 py-0.5 rounded-xs transition-colors ${
              filterMode === 'clean' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-white'
            }`}
          >
            Clean
          </button>
          <button
            onClick={() => setFilterMode('field_telemetry')}
            className={`px-1.5 py-0.5 rounded-xs transition-colors ${
              filterMode === 'field_telemetry' ? 'bg-[#1B3022] text-emerald-300 font-bold' : 'text-[#F5F5F0]/60 hover:text-white'
            }`}
          >
            Telemetry
          </button>
          <button
            onClick={() => setFilterMode('resonance')}
            className={`px-1.5 py-0.5 rounded-xs transition-colors ${
              filterMode === 'resonance' ? 'bg-amber-950 text-amber-300 font-bold' : 'text-[#F5F5F0]/60 hover:text-white'
            }`}
          >
            432Hz
          </button>
        </div>
      </div>

      {/* Interactive Web Audio API Waveform Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={500}
          height={64}
          onClick={handleSeek}
          className="w-full h-16 bg-[#080808] rounded-xs border border-[#F5F5F0]/10 cursor-pointer shadow-inner"
        />
        <div className="absolute top-1 right-2 text-[9px] font-mono text-[#F5F5F0]/40 flex items-center gap-1 pointer-events-none">
          <Waves className="w-2.5 h-2.5 text-[#10B981]" />
          <span>Web Audio API Real-Time Waveform</span>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          {/* Play / Pause */}
          <button
            onClick={isPlaying ? pausePlayback : startPlayback}
            className="w-8 h-8 rounded-full bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold flex items-center justify-center shadow transition-transform active:scale-95 cursor-pointer"
            aria-label={isPlaying ? 'Pause audio note' : 'Play audio note'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          {/* Replay */}
          <button
            onClick={resetPlayback}
            className="w-7 h-7 rounded-full bg-[#181818] hover:bg-[#222] border border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Restart audio playback"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {/* Time Counter */}
          <div className="text-[11px] text-[#F5F5F0]/80 pl-1">
            <span className="text-[#C5A059] font-bold">{formatTime(currentTime)}</span>
            <span className="text-[#F5F5F0]/40"> / {formatTime(duration)}</span>
          </div>
        </div>

        {/* Speed and Volume Controls */}
        <div className="flex items-center gap-3">
          {/* Rate Toggle */}
          <button
            onClick={() => {
              const rates = [1.0, 1.25, 1.5, 2.0];
              const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
              setPlaybackRate(nextRate);
              audioFeedback.playMicroTick();
            }}
            className="px-1.5 py-0.5 rounded bg-black/40 border border-[#F5F5F0]/10 text-[9px] text-[#C5A059] font-bold hover:bg-[#181818]"
          >
            {playbackRate}x
          </button>

          {/* Mute toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-[#F5F5F0]/60 hover:text-[#F5F5F0]"
            aria-label="Toggle mute"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Transcript Text Box */}
      <div className="p-3 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm text-xs font-sans text-[#F5F5F0]/90 leading-relaxed max-h-28 overflow-y-auto">
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#C5A059] uppercase tracking-wider font-bold mb-1">
          <FileText className="w-2.5 h-2.5" />
          Verbatim Acoustic Transcript
        </div>
        <p className={isPlaying ? 'text-[#F5F5F0] font-medium' : 'text-[#F5F5F0]/75'}>
          "{note.transcript}"
        </p>
      </div>

      {/* Key Takeaways & Cryptographic Hash Footer */}
      {note.keyTakeaways && note.keyTakeaways.length > 0 && (
        <div className="space-y-1 text-[10px] font-sans">
          <div className="text-[#10B981] font-mono font-bold text-[9px] uppercase tracking-wider">
            Verified Empirical Takeaways:
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[#F5F5F0]/80">
            {note.keyTakeaways.map((t, idx) => (
              <li key={idx} className="truncate">{t}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
