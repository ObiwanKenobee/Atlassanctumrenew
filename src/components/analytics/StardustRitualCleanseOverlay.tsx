import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { alchemicalAudio } from '../../lib/alchemicalAudio';

interface StardustRitualCleanseOverlayProps {
  isActive: boolean;
  onComplete: () => void;
  width?: number;
  height?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  hue: number;
  spin: number;
  angle: number;
}

export const StardustRitualCleanseOverlay: React.FC<StardustRitualCleanseOverlayProps> = ({
  isActive,
  onComplete,
  width = 800,
  height = 450
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phaseProgress, setPhaseProgress] = useState<number>(0);
  const [purificationMessage, setPurificationMessage] = useState<string>('Igniting Sacred Crucible: Ingesting Raw Epistemic Noise...');

  useEffect(() => {
    if (!isActive) {
      setPhaseProgress(0);
      return;
    }

    // Play sacred singing bowl and purification chime
    alchemicalAudio.playSingingBowl(528, 3.5);
    setTimeout(() => {
      alchemicalAudio.playTransmutationPulse('albedo');
    }, 900);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = (canvas.parentElement?.clientWidth || width) * dpr;
    canvas.height = (canvas.parentElement?.clientHeight || height) * dpr;
    ctx.scale(dpr, dpr);

    const stageWidth = canvas.width / dpr;
    const stageHeight = canvas.height / dpr;

    // Spawn 220 stardust particles
    const particles: Particle[] = [];
    const colors = [42, 48, 54, 185, 275]; // Gold, Amber, Topaz, Cyan Starlight, Amethyst

    for (let i = 0; i < 220; i++) {
      const startX = Math.random() * stageWidth;
      const startY = stageHeight * 0.3 + Math.random() * (stageHeight * 0.5);
      particles.push({
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 3.5,
        vy: (Math.random() - 0.5) * 3.5 - 0.8,
        size: Math.random() * 3.2 + 0.8,
        alpha: Math.random() * 0.9 + 0.3,
        decay: Math.random() * 0.006 + 0.003,
        hue: colors[Math.floor(Math.random() * colors.length)],
        spin: (Math.random() - 0.5) * 0.08,
        angle: Math.random() * Math.PI * 2
      });
    }

    const startTime = performance.now();
    const duration = 3200; // 3.2s
    let animId: number;

    const render = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      setPhaseProgress(progress);

      if (progress < 0.35) {
        setPurificationMessage('Ablutio: Dissolving stochastic noise into stardust particles...');
      } else if (progress < 0.75) {
        setPurificationMessage('Hermetic Clarification: Synthesizing harmonic living baseline...');
      } else {
        setPurificationMessage('Purification Complete: Epistemic variance transmuted into pristine gold.');
      }

      ctx.clearRect(0, 0, stageWidth, stageHeight);

      // 1. Draw glowing sweeping purification wave
      const waveX = progress * (stageWidth + 100);
      const waveGrad = ctx.createLinearGradient(waveX - 80, 0, waveX + 30, 0);
      waveGrad.addColorStop(0, 'rgba(197, 160, 89, 0)');
      waveGrad.addColorStop(0.5, 'rgba(197, 160, 89, 0.35)');
      waveGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.8)');
      waveGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.fillStyle = waveGrad;
      ctx.fillRect(0, 0, waveX, stageHeight);

      // Bright vertical laser edge
      ctx.beginPath();
      ctx.moveTo(waveX, 0);
      ctx.lineTo(waveX, stageHeight);
      ctx.strokeStyle = 'rgba(255, 250, 220, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#C5A059';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 2. Render stardust particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        p.alpha -= p.decay;

        // Gentle vortex acceleration toward wave
        if (p.x < waveX) {
          p.vx += 0.05;
          p.vy -= 0.02;
        }

        if (p.alpha > 0.05) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha})`;
          ctx.shadowColor = `hsl(${p.hue}, 100%, 70%)`;
          ctx.shadowBlur = 8;
          ctx.fill();

          // Star diffraction spike for larger particles
          if (p.size > 2.0 && p.alpha > 0.4) {
            ctx.strokeStyle = `hsla(${p.hue}, 100%, 90%, ${p.alpha * 0.7})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(-p.size * 2.5, 0);
            ctx.lineTo(p.size * 2.5, 0);
            ctx.moveTo(0, -p.size * 2.5);
            ctx.lineTo(0, p.size * 2.5);
            ctx.stroke();
          }

          ctx.restore();
        }
      });

      // 3. Central Sacred Alchemical Seal Watermark
      const sealAlpha = Math.sin(progress * Math.PI) * 0.45;
      if (sealAlpha > 0.05) {
        ctx.save();
        ctx.translate(stageWidth / 2, stageHeight / 2);
        ctx.strokeStyle = `rgba(197, 160, 89, ${sealAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#C5A059';
        ctx.shadowBlur = 12;

        // Outer sacred ring
        ctx.beginPath();
        ctx.arc(0, 0, 68, 0, Math.PI * 2);
        ctx.stroke();

        // Inner sacred geometry triangle & inverted triangle (Seal of Solomon / Transmutation)
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const a = (i * 2 * Math.PI) / 3 - Math.PI / 2;
          const x = Math.cos(a) * 56;
          const y = Math.sin(a) * 56;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const a = (i * 2 * Math.PI) / 3 + Math.PI / 2;
          const x = Math.cos(a) * 56;
          const y = Math.sin(a) * 56;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
      }

      if (progress < 1) {
        animId = requestAnimationFrame(render);
      } else {
        onComplete();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isActive, width, height, onComplete]);

  if (!isActive) return null;

  return (
    <div 
      id="stardust-ritual-cleanse-overlay"
      className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-between p-6 bg-black/45 backdrop-blur-[1.5px] rounded transition-all duration-300 animate-in fade-in"
    >
      {/* Dynamic Stardust Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Header Banner during Cleanse */}
      <div className="relative z-10 flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#120F08]/90 border border-[#C5A059] shadow-2xl animate-pulse">
        <Sparkles className="w-4 h-4 text-[#C5A059] animate-spin" />
        <span className="text-xs font-mono font-bold text-[#F5F5F0] tracking-wider uppercase">
          RITUAL CLEANSE IN PROGRESS • ABLUTIO SACRA
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A059] text-black font-extrabold">
          {Math.round(phaseProgress * 100)}%
        </span>
      </div>

      {/* Progress Bar & Sacred Principle Toast */}
      <div className="relative z-10 max-w-lg w-full p-3.5 rounded-lg bg-[#070B09]/95 border border-[#C5A059]/50 shadow-2xl text-center space-y-2 font-mono">
        <div className="flex items-center justify-center gap-2 text-xs text-[#C5A059] font-bold">
          <span className="text-sm">🜔</span>
          <span>{purificationMessage}</span>
          <span className="text-sm">🜚</span>
        </div>
        
        {/* Visual Progress Bar */}
        <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-[#C5A059] via-emerald-400 to-cyan-300 transition-all duration-100 ease-out"
            style={{ width: `${Math.round(phaseProgress * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-neutral-400">
          <span>Epistemic Entropy: {(100 - phaseProgress * 99.4).toFixed(1)}%</span>
          <span className="text-emerald-400 font-bold">Signal Clarity: {(phaseProgress * 99.8).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};
