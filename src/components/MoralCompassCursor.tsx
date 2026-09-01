import React, { useEffect, useRef, useState } from 'react';
import { Compass, Sparkles, Sliders } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  maxLife: number;
  life: number;
}

interface MoralCompassCursorProps {
  moralIntensity?: number; // 0 to 100
  activeView?: string;
  isDataHeavy?: boolean;
}

export const MoralCompassCursor: React.FC<MoralCompassCursorProps> = ({
  moralIntensity = 94.8,
  activeView = 'home',
  isDataHeavy = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isPointerDevice, setIsPointerDevice] = useState<boolean>(false);

  const mousePosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const isHoveringClickableRef = useRef<boolean>(false);
  const intensityRef = useRef<number>(moralIntensity);

  useEffect(() => {
    intensityRef.current = moralIntensity;
  }, [moralIntensity]);

  // Derive palette based on moral policy alignment score
  const getMoralTheme = (score: number) => {
    if (score >= 90) {
      return {
        name: 'Inviolable Human Flourishing & Covenant Harmony',
        primary: '#C5A059', // Gold
        secondary: '#10B981', // Emerald
        glow: 'rgba(197, 160, 89, 0.45)',
        ringColor: 'rgba(16, 185, 129, 0.6)',
        label: 'COVENANT HARMONY'
      };
    } else if (score >= 75) {
      return {
        name: 'Cautionary Stewardship & Epistemic Scrutiny',
        primary: '#F59E0B', // Amber
        secondary: '#EAB308', // Yellow
        glow: 'rgba(245, 158, 11, 0.4)',
        ringColor: 'rgba(234, 179, 8, 0.5)',
        label: 'CAUTIONARY SCRUTINY'
      };
    } else {
      return {
        name: 'Extractive Risk & Usury Veto Triggered',
        primary: '#EF4444', // Red / Rose
        secondary: '#F43F5E', // Rose
        glow: 'rgba(239, 68, 68, 0.45)',
        ringColor: 'rgba(244, 63, 94, 0.6)',
        label: 'ETHICAL ARBITRATION REQUIRED'
      };
    }
  };

  useEffect(() => {
    try {
      // Check if pointer is fine (desktop mouse)
      const hasFinePointer = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: fine)').matches;
      setIsPointerDevice(Boolean(hasFinePointer));

      // Read stored preference
      const storedPref = localStorage.getItem('atlas_moral_cursor_enabled');
      if (storedPref !== null) {
        setIsEnabled(storedPref === 'true');
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleCursor = () => {
    const next = !isEnabled;
    setIsEnabled(next);
    try {
      localStorage.setItem('atlas_moral_cursor_enabled', String(next));
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    if (!isEnabled || !isPointerDevice || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];

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

    let lastX = -100;
    let lastY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      mousePosRef.current = { x, y };

      // Check if hovering clickable without triggering React re-renders
      try {
        const target = e.target as HTMLElement | null;
        if (target && target.closest) {
          isHoveringClickableRef.current = target.closest('button, a, input, select, textarea, [role="button"]') !== null;
        }
      } catch {
        // Ignore DOM check error
      }

      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);

      // Spawn subtle glowing trail particles
      if (dist > 3 && particles.length < 40) {
        const currentTheme = getMoralTheme(intensityRef.current);
        const count = Math.min(2, Math.floor(dist / 8));
        for (let i = 0; i < count; i++) {
          const t = i / (count || 1);
          const px = lastX + dx * t + (Math.random() - 0.5) * 4;
          const py = lastY + dy * t + (Math.random() - 0.5) * 4;
          const isGold = Math.random() > 0.4;
          particles.push({
            x: px,
            y: py,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4 - 0.2,
            size: Math.random() * 2.2 + 1.2,
            alpha: 0.65,
            color: isGold ? currentTheme.primary : currentTheme.secondary,
            maxLife: 24 + Math.random() * 10,
            life: 0
          });
        }
      }

      lastX = x;
      lastY = y;
    };

    const handleMouseLeave = () => {
      mousePosRef.current = { x: -100, y: -100 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    let angle = 0;

    const render = () => {
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        angle += 0.015;
        const currentTheme = getMoralTheme(intensityRef.current);
        const mousePos = mousePosRef.current;
        const isHoveringClickable = isHoveringClickableRef.current;

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife) * 0.6;

          if (p.life >= p.maxLife) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.restore();
        }

        // Draw subtle celestial Moral Compass reticle at mouse position
        if (mousePos.x > 0 && mousePos.y > 0) {
          ctx.save();
          ctx.translate(mousePos.x, mousePos.y);

          // Ambient outer glow ring
          ctx.beginPath();
          ctx.arc(0, 0, isHoveringClickable ? 18 : 12, 0, Math.PI * 2);
          ctx.strokeStyle = currentTheme.ringColor;
          ctx.lineWidth = 0.75;
          ctx.setLineDash([3, 4]);
          ctx.stroke();

          // Rotating cardinal markers (North, South, East, West sacred axes)
          ctx.rotate(angle);
          ctx.setLineDash([]);
          const axisLen = isHoveringClickable ? 14 : 9;
          ctx.strokeStyle = currentTheme.primary;
          ctx.lineWidth = 0.9;
          ctx.globalAlpha = 0.55;

          // Compass crosshairs
          ctx.beginPath();
          ctx.moveTo(0, -axisLen);
          ctx.lineTo(0, -axisLen + 3);
          ctx.moveTo(0, axisLen);
          ctx.lineTo(0, axisLen - 3);
          ctx.moveTo(-axisLen, 0);
          ctx.lineTo(-axisLen + 3, 0);
          ctx.moveTo(axisLen, 0);
          ctx.lineTo(axisLen - 3, 0);
          ctx.stroke();

          // Inner glowing core
          ctx.beginPath();
          ctx.arc(0, 0, isHoveringClickable ? 2.5 : 1.8, 0, Math.PI * 2);
          ctx.fillStyle = currentTheme.primary;
          ctx.globalAlpha = 0.85;
          ctx.shadowColor = currentTheme.primary;
          ctx.shadowBlur = 8;
          ctx.fill();

          ctx.restore();
        }
      } catch {
        // Safe catch for canvas frame
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
  }, [isEnabled, isPointerDevice]);

  if (!isPointerDevice) return null;

  const currentTheme = getMoralTheme(moralIntensity);

  return (
    <>
      {/* Fullscreen Passive Canvas Overlay */}
      {isEnabled && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* Floating Toggle & Moral Alignment Widget in bottom corner */}
      <div className="fixed bottom-3 left-3 z-40 flex items-center gap-1.5 bg-[#0D0D0D]/90 backdrop-blur-md border border-[#F5F5F0]/10 px-2.5 py-1.5 rounded-full text-[10px] font-mono shadow-lg hover:border-[#C5A059]/40 transition-all group">
        <button
          onClick={toggleCursor}
          title={isEnabled ? 'Disable Moral Compass Cursor Trail' : 'Enable Moral Compass Cursor Trail'}
          className="flex items-center gap-1.5 text-[#F5F5F0]/70 hover:text-[#C5A059] transition-colors"
        >
          <span 
            className="w-2 h-2 rounded-full animate-pulse" 
            style={{ backgroundColor: currentTheme.primary }}
          />
          <Compass className={`w-3 h-3 ${isEnabled ? 'text-[#C5A059]' : 'text-[#F5F5F0]/30'}`} />
          <span className="hidden sm:inline">
            Moral Trail {isEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        <span className="text-[#F5F5F0]/20">|</span>

        <span className="text-[#F5F5F0]/60 font-mono">
          Alignment <span className="font-bold text-[#C5A059]">{moralIntensity.toFixed(1)}%</span>
        </span>
      </div>
    </>
  );
};
