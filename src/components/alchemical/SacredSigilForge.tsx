import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Sparkles, 
  Flame, 
  Droplets, 
  Wind, 
  Compass, 
  RefreshCw, 
  Check, 
  Share2, 
  Download 
} from 'lucide-react';
import { alchemicalAudio } from '../../lib/alchemicalAudio';

interface SigilNode {
  x: number;
  y: number;
  r: number;
  angle: number;
}

export const SacredSigilForge: React.FC = () => {
  const [intentionText, setIntentionText] = useState<string>(
    'May the ancient headwaters flow crystal pure and every community live in dignified abundance.'
  );
  const [activeElement, setActiveElement] = useState<'earth' | 'water' | 'fire' | 'air' | 'aether'>('aether');
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [chargeLevel, setChargeLevel] = useState<number>(68); // 0 to 100%
  const [sigilSeed, setSigilSeed] = useState<number>(1618);
  const [activeParticles, setActiveParticles] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Suggested Intentions of Wonder
  const PRESET_INTENTIONS = [
    'May the pristine headwaters flow crystal pure and every community live in dignified abundance.',
    'I dissolve all cynical despair; my creative will serves the seven generations to come.',
    'Let the damaged soil remember its ancient fertility and bloom with wild life.',
    'May peace and inviolable sanctuary enfold every living creature upon this Earth.',
    'As Above, So Below: Let technology become the consecrated servant of biospheric health.'
  ];

  // Hash string into repeatable mathematical nodes
  const generateSigilNodes = (text: string, seed: number, count = 7): SigilNode[] => {
    let hash = seed;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    const nodes: SigilNode[] = [];
    const baseRadius = 90;

    for (let i = 0; i < count; i++) {
      const angle = (i * (2 * Math.PI / count)) + ((Math.abs(hash * (i + 1)) % 100) / 100) * 0.4;
      const radiusOffset = ((Math.abs((hash >> i) * 31) % 40) - 20);
      const r = baseRadius + radiusOffset;
      const x = 150 + r * Math.cos(angle);
      const y = 150 + r * Math.sin(angle);
      nodes.push({ x, y, r, angle });
    }
    return nodes;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const nodes = generateSigilNodes(intentionText, sigilSeed, 8);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Glow color based on active element
      const elementColors = {
        earth: '#10B981',
        water: '#06B6D4',
        fire: '#F59E0B',
        air: '#8B5CF6',
        aether: '#FCD34D'
      };
      const primaryColor = elementColors[activeElement];

      // Draw concentric sacred rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      // Outer golden boundary ring
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(0, 0, 115, 0, 2 * Math.PI);
      ctx.stroke();

      // Middle inscribed 12-sided dodecagram or octagon
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.arc(0, 0, 85, 0, 2 * Math.PI);
      ctx.stroke();

      // Inner sacred circle
      ctx.beginPath();
      ctx.arc(0, 0, 45, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.restore();

      // Draw lines between mathematical nodes to form the unique Sigil
      ctx.save();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.2;
      ctx.globalAlpha = 0.85;
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = isCharging ? 25 : 12;

      ctx.beginPath();
      nodes.forEach((node, idx) => {
        if (idx === 0) {
          ctx.moveTo(node.x, node.y);
        } else {
          ctx.lineTo(node.x, node.y);
        }
      });
      // Cross chords to form hermetic glyph
      for (let i = 0; i < nodes.length; i++) {
        const targetIdx = (i + 3) % nodes.length;
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[targetIdx].x, nodes[targetIdx].y);
      }
      ctx.stroke();

      // Draw node circles & glyphic runes
      nodes.forEach((node, idx) => {
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Center seal point: glowing golden core
      ctx.fillStyle = primaryColor;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Draw orbiting elemental particles
      if (activeParticles) {
        const particleCount = 12;
        for (let p = 0; p < particleCount; p++) {
          const pAngle = rotation * 2 + (p * (2 * Math.PI / particleCount));
          const pDist = 65 + Math.sin(rotation * 3 + p) * 35;
          const px = cx + pDist * Math.cos(pAngle);
          const py = cy + pDist * Math.sin(pAngle);

          ctx.fillStyle = primaryColor;
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      ctx.restore();

      rotation += 0.005;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [intentionText, sigilSeed, activeElement, isCharging, activeParticles]);

  const handleChargeElemental = (el: 'earth' | 'water' | 'fire' | 'air' | 'aether') => {
    setActiveElement(el);
    alchemicalAudio.playElementalChime(el);
    setChargeLevel(prev => Math.min(100, prev + 12));
  };

  const handleConsecrateSigil = () => {
    setIsCharging(true);
    alchemicalAudio.playSingingBowl(528, 3.5);
    setTimeout(() => {
      setChargeLevel(100);
      setIsCharging(false);
      alchemicalAudio.playSingingBowl(963, 3.0);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Magician Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-[#0D0D0D] border border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            The Magician’s Arcane Sigil & Reality Weaver
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5F5F0] mt-1">
            Crystallizing Sacred Intention into Mathematical Glyphs
          </h3>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl mt-1">
            The Magus knows that focused consciousness alters reality. Formulate your vow of planetary or personal restoration; our hermetic engine weaves it into an active harmonic Sigil.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSigilSeed(Math.floor(Math.random() * 10000));
              alchemicalAudio.playSingingBowl(639, 1.5);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141414] hover:bg-[#1E1E1E] text-xs font-mono text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-Harmonize Geometry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Canvas */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0A0A0A] border border-amber-500/30 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-3 left-4 text-[10px] font-mono text-amber-400/80 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Active Hermetic Matrix (Element: {activeElement.toUpperCase()})
          </div>

          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] cursor-pointer"
            onClick={() => handleChargeElemental(activeElement)}
            title="Click to infuse current elemental resonance"
          />

          {/* Elemental Charging Station */}
          <div className="w-full pt-4 mt-2 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Aetheric Charge Saturation:</span>
              <span className="text-amber-400 font-bold">{chargeLevel}%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-[#141414] rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${chargeLevel}%` }}
              />
            </div>

            {/* 5 Elemental Infusion Buttons */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[
                { id: 'earth', label: 'Earth', icon: Compass, color: 'text-emerald-400 border-emerald-500/40 hover:bg-emerald-950/40' },
                { id: 'water', label: 'Water', icon: Droplets, color: 'text-cyan-400 border-cyan-500/40 hover:bg-cyan-950/40' },
                { id: 'fire', label: 'Fire', icon: Flame, color: 'text-amber-400 border-amber-500/40 hover:bg-amber-950/40' },
                { id: 'air', label: 'Air', icon: Wind, color: 'text-purple-400 border-purple-500/40 hover:bg-purple-950/40' },
                { id: 'aether', label: 'Aether', icon: Sparkles, color: 'text-yellow-300 border-yellow-500/40 hover:bg-yellow-950/40' }
              ].map((el) => {
                const isSelected = activeElement === el.id;
                const Icon = el.icon;
                return (
                  <button
                    key={el.id}
                    onClick={() => handleChargeElemental(el.id as any)}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-[#1C1C1C] border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        : `bg-[#101010] ${el.color}`
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-mono uppercase font-bold">{el.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Intention Input & Consecration Panel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-white/10 space-y-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold block mb-1.5">
                Formulate Intention of Wonder & Healing:
              </label>
              <textarea
                value={intentionText}
                onChange={(e) => setIntentionText(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-[#141414] border border-[#C5A059]/30 text-white font-serif text-sm leading-relaxed focus:outline-none focus:border-amber-400 transition-colors resize-none"
                placeholder="Declare your intention for the Earth, your community, or your soul..."
              />
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Or Select an Ancient Inscription:
              </span>
              <div className="space-y-1.5">
                {PRESET_INTENTIONS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIntentionText(preset);
                      alchemicalAudio.playSingingBowl(528, 1.2);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-[#121212] hover:bg-[#1A1A1A] border border-white/5 hover:border-amber-400/30 text-[11px] text-slate-300 font-serif transition-colors cursor-pointer"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>

            {/* Consecrate Trigger */}
            <div className="pt-2">
              <button
                onClick={handleConsecrateSigil}
                disabled={isCharging}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-serif font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isCharging ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Consecrating Sigil in the Aetheric Matrix...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Consecrate & Cast Sigil into Reality Field</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Meaning & Hermetic Correspondence */}
          <div className="p-4 rounded-xl bg-[#0D0D0D] border border-white/10 text-xs font-mono space-y-2 text-slate-300">
            <div className="flex items-center justify-between text-amber-400 font-bold text-[11px]">
              <span>HERMETIC SIGNATURE</span>
              <span>SEED: 0x{sigilSeed.toString(16).toUpperCase()}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-serif">
              "The Sigil operates as an energetic lens, focusing human attention upon a single vector of regenerative order. When consecrated through the elements, intention leaves an imprint in the collective field."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
