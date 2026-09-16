import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Compass, Eye, EyeOff, Sliders } from 'lucide-react';

interface StarlightParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  type: 'stardust' | 'sparkle' | 'orb';
  rotation: number;
  rotSpeed: number;
  hueShift: number; // gold (42) to starlight cyan-white (195-210)
}

interface ParticleTrailCursorProps {
  moralIntensity?: number;
  activeView?: string;
}

export const ParticleTrailCursor: React.FC<ParticleTrailCursorProps> = ({
  moralIntensity = 94.8,
  activeView = 'home'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isPointerDevice, setIsPointerDevice] = useState<boolean>(false);
  const [trailDensity, setTrailDensity] = useState<'ethereal' | 'radiant'>('ethereal');
  const [isBadgeVisible, setIsBadgeVisible] = useState<boolean>(true);

  const mousePosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const isHoveringClickableRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

  // Initialize pointer device & stored preference
  useEffect(() => {
    try {
      const hasFinePointer = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: fine)').matches;
      setIsPointerDevice(Boolean(hasFinePointer));

      const stored = localStorage.getItem('atlas_particle_trail_enabled');
      if (stored !== null) {
        setIsEnabled(stored === 'true');
      }

      const storedDensity = localStorage.getItem('atlas_particle_trail_density');
      if (storedDensity === 'radiant' || storedDensity === 'ethereal') {
        setTrailDensity(storedDensity);
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleTrail = useCallback(() => {
    setIsEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('atlas_particle_trail_enabled', String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  // Main Canvas Rendering Engine
  useEffect(() => {
    if (!isEnabled || !isPointerDevice || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: StarlightParticle[] = [];

    const resize = () => {
      try {
        canvas.width = window.innerWidth || document.documentElement.clientWidth || 1024;
        canvas.height = window.innerHeight || document.documentElement.clientHeight || 768;
      } catch {
        // Safe resize fallback
      }
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      mousePosRef.current = { x, y };

      try {
        const target = e.target as HTMLElement | null;
        if (target && target.closest) {
          isHoveringClickableRef.current = target.closest('button, a, input, select, textarea, [role="button"]') !== null;
        }
      } catch {
        // Ignore
      }

      const lastX = prevMousePosRef.current.x;
      const lastY = prevMousePosRef.current.y;
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);

      // Spawn regenerative intent particles along velocity path
      if (dist > 2 && particles.length < (trailDensity === 'radiant' ? 70 : 45)) {
        const spawnCount = trailDensity === 'radiant' 
          ? Math.min(4, Math.max(1, Math.floor(dist / 6)))
          : Math.min(2, Math.max(1, Math.floor(dist / 10)));

        for (let i = 0; i < spawnCount; i++) {
          const t = i / (spawnCount || 1);
          const px = lastX + dx * t + (Math.random() - 0.5) * 5;
          const py = lastY + dy * t + (Math.random() - 0.5) * 5;

          const isSparkle = Math.random() < 0.28;
          const isOrb = !isSparkle && Math.random() < 0.35;

          particles.push({
            x: px,
            y: py,
            vx: (Math.random() - 0.5) * 0.5 + (dx * 0.05),
            vy: (Math.random() - 0.5) * 0.5 - 0.3 + (dy * 0.05),
            size: isSparkle ? (Math.random() * 3.5 + 2.5) : (Math.random() * 2.2 + 1.2),
            alpha: Math.random() * 0.25 + 0.45,
            maxLife: 28 + Math.random() * 20,
            life: 0,
            type: isSparkle ? 'sparkle' : isOrb ? 'orb' : 'stardust',
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.08,
            hueShift: Math.random()
          });
        }
      }

      prevMousePosRef.current = { x, y };
    };

    const handleMouseLeave = () => {
      mousePosRef.current = { x: -100, y: -100 };
      prevMousePosRef.current = { x: -100, y: -100 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    let clock = 0;

    const render = () => {
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        clock += 0.02;

        const mousePos = mousePosRef.current;
        const isHovering = isHoveringClickableRef.current;

        // Draw and update particle trail with low-opacity Gold-to-Starlight gradient
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotSpeed;

          const lifeProgress = p.life / p.maxLife;
          const currentAlpha = Math.max(0, (1 - lifeProgress)) * p.alpha;

          if (p.life >= p.maxLife) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(p.x, p.y);

          // Interpolate color from Alchemical Gold (#C5A059, RGB: 197, 160, 89)
          // to Ethereal Starlight (#E0F2FE, RGB: 224, 242, 254)
          const goldR = 197, goldG = 160, goldB = 89;
          const starR = 224, starG = 242, starB = 254;

          const t = Math.min(1, lifeProgress * 1.2);
          const r = Math.round(goldR + (starR - goldR) * t);
          const g = Math.round(goldG + (starG - goldG) * t);
          const b = Math.round(goldB + (starB - goldB) * t);

          const colorRgb = `rgb(${r}, ${g}, ${b})`;
          const glowRgb = `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.7})`;

          if (p.type === 'sparkle') {
            // Draw 4-point Diamond Starlight Sparkle
            ctx.rotate(p.rotation);
            ctx.beginPath();
            const s = p.size * (1 - lifeProgress * 0.4);
            ctx.moveTo(0, -s);
            ctx.quadraticCurveTo(0, 0, s, 0);
            ctx.quadraticCurveTo(0, 0, 0, s);
            ctx.quadraticCurveTo(0, 0, -s, 0);
            ctx.quadraticCurveTo(0, 0, 0, -s);
            ctx.fillStyle = colorRgb;
            ctx.globalAlpha = currentAlpha;
            ctx.shadowColor = glowRgb;
            ctx.shadowBlur = 8;
            ctx.fill();
          } else if (p.type === 'orb') {
            // Soft Radial Starlight Halo
            const rad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
            rad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentAlpha})`);
            rad.addColorStop(0.5, `rgba(197, 160, 89, ${currentAlpha * 0.4})`);
            rad.addColorStop(1, 'rgba(224, 242, 254, 0)');

            ctx.beginPath();
            ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = rad;
            ctx.globalAlpha = currentAlpha;
            ctx.fill();
          } else {
            // Fine Stardust Specks
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fillStyle = colorRgb;
            ctx.globalAlpha = currentAlpha;
            ctx.shadowColor = glowRgb;
            ctx.shadowBlur = 4;
            ctx.fill();
          }

          ctx.restore();
        }

        // Ambient Reticle of Regenerative Intent at pointer location
        if (mousePos.x > 0 && mousePos.y > 0) {
          ctx.save();
          ctx.translate(mousePos.x, mousePos.y);

          // Subtle pulsating golden halo
          const pulse = Math.sin(clock * 3) * 1.5;
          const reticleRadius = (isHovering ? 16 : 10) + pulse;

          // Outer delicate orbit ring
          ctx.beginPath();
          ctx.arc(0, 0, reticleRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isHovering 
            ? 'rgba(197, 160, 89, 0.55)' 
            : 'rgba(224, 242, 254, 0.35)';
          ctx.lineWidth = 0.75;
          ctx.setLineDash([2, 4]);
          ctx.stroke();

          // Cardinal starlight spurs
          ctx.rotate(clock * 0.4);
          ctx.setLineDash([]);
          const spurLen = isHovering ? 11 : 7;
          ctx.strokeStyle = 'rgba(197, 160, 89, 0.45)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -spurLen);
          ctx.lineTo(0, spurLen);
          ctx.moveTo(-spurLen, 0);
          ctx.lineTo(spurLen, 0);
          ctx.stroke();

          // Central radiant starlight core
          ctx.beginPath();
          ctx.arc(0, 0, isHovering ? 2.2 : 1.5, 0, Math.PI * 2);
          ctx.fillStyle = '#C5A059';
          ctx.globalAlpha = 0.85;
          ctx.shadowColor = 'rgba(224, 242, 254, 0.8)';
          ctx.shadowBlur = 10;
          ctx.fill();

          ctx.restore();
        }
      } catch {
        // Safe canvas catch
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isEnabled, isPointerDevice, trailDensity]);

  if (!isPointerDevice) return null;

  return (
    <>
      {/* Fullscreen Low-Opacity Particle Canvas Overlay */}
      {isEnabled && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* Discrete Regenerative Intent Trail Badge & Control */}
      {isBadgeVisible && (
        <div 
          id="regenerative-particle-trail-hud"
          className="fixed bottom-3 left-3 z-40 flex items-center gap-1.5 bg-[#0D0D0D]/90 backdrop-blur-md border border-[#F5F5F0]/10 px-2.5 py-1.5 rounded-full text-[10px] font-mono shadow-xl hover:border-[#C5A059]/40 transition-all group"
        >
          <button
            onClick={toggleTrail}
            title={isEnabled ? 'Disable Regenerative Particle Trail' : 'Enable Regenerative Particle Trail'}
            className="flex items-center gap-1.5 text-[#F5F5F0]/75 hover:text-[#C5A059] transition-colors cursor-pointer"
          >
            <span 
              className={`w-2 h-2 rounded-full transition-all ${
                isEnabled 
                  ? 'bg-gradient-to-r from-[#C5A059] to-[#E0F2FE] shadow-[0_0_8px_#C5A059] animate-pulse' 
                  : 'bg-neutral-600'
              }`} 
            />
            <Sparkles className={`w-3 h-3 ${isEnabled ? 'text-[#C5A059]' : 'text-neutral-500'}`} />
            <span className="hidden sm:inline font-bold">
              Particle Trail: {isEnabled ? 'GOLD-STARLIGHT' : 'OFF'}
            </span>
          </button>

          {isEnabled && (
            <>
              <span className="text-[#F5F5F0]/20">|</span>
              <button
                onClick={() => {
                  const next = trailDensity === 'ethereal' ? 'radiant' : 'ethereal';
                  setTrailDensity(next);
                  try {
                    localStorage.setItem('atlas_particle_trail_density', next);
                  } catch {
                    // Ignore
                  }
                }}
                className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/40 hover:bg-black/80 text-[#C5A059] border border-[#C5A059]/30 transition-colors cursor-pointer"
                title="Toggle density between Ethereal and Radiant"
              >
                {trailDensity}
              </button>
            </>
          )}

          <span className="text-[#F5F5F0]/20">|</span>

          <span 
            className="text-[9px] text-[#F5F5F0]/50 hidden md:inline truncate max-w-[130px]"
            title="Symbolizing the movement of regenerative intent across the digital twin"
          >
            Regenerative Intent
          </span>

          <button
            onClick={() => setIsBadgeVisible(false)}
            className="text-neutral-500 hover:text-neutral-300 ml-0.5 text-[9px] p-0.5"
            title="Minimize HUD"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};
