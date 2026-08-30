import React from 'react';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Zap,
  Activity,
  Cpu,
  Flame,
  Pause,
  Play,
  Layers,
  Sparkles
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface PhysicsParams {
  chargeStrength: number;
  linkDistance: number;
  linkStrength: number;
  collisionRadius: number;
  centerStrength: number;
  velocityDecay: number;
  clusterPull: number;
}

export const DEFAULT_PHYSICS_PARAMS: PhysicsParams = {
  chargeStrength: -340,
  linkDistance: 135,
  linkStrength: 0.6,
  collisionRadius: 22,
  centerStrength: 0.06,
  velocityDecay: 0.4,
  clusterPull: 0.42
};

interface PhysicsDebuggerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  params: PhysicsParams;
  onChange: (updated: PhysicsParams) => void;
  onReheat: () => void;
  onFreeze: () => void;
  isFrozen: boolean;
  nodeCount: number;
  linkCount: number;
}

export const PhysicsDebuggerOverlay: React.FC<PhysicsDebuggerOverlayProps> = ({
  isOpen,
  onClose,
  params,
  onChange,
  onReheat,
  onFreeze,
  isFrozen,
  nodeCount,
  linkCount
}) => {
  if (!isOpen) return null;

  const handleSliderChange = (key: keyof PhysicsParams, val: number) => {
    onChange({
      ...params,
      [key]: val
    });
  };

  const handleReset = () => {
    onChange(DEFAULT_PHYSICS_PARAMS);
    onReheat();
    audioFeedback.playDataSave();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-[#0C0C0C]/95 backdrop-blur-xl border border-[#C5A059]/40 shadow-2xl rounded-sm p-4 text-[#F5F5F0] space-y-4 animate-in slide-in-from-bottom-5 duration-200 text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#C5A059] animate-pulse" />
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
              D3 FORCE SIMULATION
            </span>
            <h4 className="text-xs font-serif font-bold text-[#F5F5F0]">
              Physics Engine Debugger
            </h4>
          </div>
        </div>
        <button
          onClick={() => {
            onClose();
            audioFeedback.playMicroTick();
          }}
          className="text-[#F5F5F0]/40 hover:text-[#F5F5F0] p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Real-time Telemetry Monitor */}
      <div className="grid grid-cols-3 gap-2 p-2 bg-[#050505] border border-[#F5F5F0]/10 rounded-xs font-mono text-[10px]">
        <div className="space-y-0.5">
          <span className="text-[#F5F5F0]/40 block uppercase">Nodes</span>
          <span className="text-emerald-300 font-bold">{nodeCount} Particles</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[#F5F5F0]/40 block uppercase">Couplings</span>
          <span className="text-cyan-300 font-bold">{linkCount} Springs</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[#F5F5F0]/40 block uppercase">Engine State</span>
          <span className={isFrozen ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
            {isFrozen ? 'Frozen' : 'Dynamic'}
          </span>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-3 text-xs font-mono max-h-[300px] overflow-y-auto pr-1">
        {/* Charge Force (Repulsion) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#F5F5F0]/70">Repulsion Charge (ManyBody):</span>
            <span className="text-[#C5A059] font-bold">{params.chargeStrength}</span>
          </div>
          <input
            type="range"
            min="-800"
            max="-50"
            step="10"
            value={params.chargeStrength}
            onChange={e => handleSliderChange('chargeStrength', parseFloat(e.target.value))}
            className="w-full accent-[#C5A059] bg-[#222] h-1.5 rounded cursor-pointer"
          />
        </div>

        {/* Link Distance */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#F5F5F0]/70">Spring Link Distance:</span>
            <span className="text-[#C5A059] font-bold">{params.linkDistance}px</span>
          </div>
          <input
            type="range"
            min="60"
            max="260"
            step="5"
            value={params.linkDistance}
            onChange={e => handleSliderChange('linkDistance', parseFloat(e.target.value))}
            className="w-full accent-[#C5A059] bg-[#222] h-1.5 rounded cursor-pointer"
          />
        </div>

        {/* Link Strength */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#F5F5F0]/70">Link Coupling Rigidity:</span>
            <span className="text-[#C5A059] font-bold">{(params.linkStrength * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={params.linkStrength}
            onChange={e => handleSliderChange('linkStrength', parseFloat(e.target.value))}
            className="w-full accent-[#C5A059] bg-[#222] h-1.5 rounded cursor-pointer"
          />
        </div>

        {/* Collision Radius */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#F5F5F0]/70">Collision Repulsion Radius:</span>
            <span className="text-[#C5A059] font-bold">{params.collisionRadius}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="50"
            step="2"
            value={params.collisionRadius}
            onChange={e => handleSliderChange('collisionRadius', parseFloat(e.target.value))}
            className="w-full accent-[#C5A059] bg-[#222] h-1.5 rounded cursor-pointer"
          />
        </div>

        {/* Centering Gravity */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#F5F5F0]/70">Centering Gravity Pull:</span>
            <span className="text-[#C5A059] font-bold">{(params.centerStrength * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.25"
            step="0.01"
            value={params.centerStrength}
            onChange={e => handleSliderChange('centerStrength', parseFloat(e.target.value))}
            className="w-full accent-[#C5A059] bg-[#222] h-1.5 rounded cursor-pointer"
          />
        </div>

        {/* Velocity Decay (Friction) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#F5F5F0]/70">Velocity Friction (Decay):</span>
            <span className="text-[#C5A059] font-bold">{(params.velocityDecay * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.80"
            step="0.05"
            value={params.velocityDecay}
            onChange={e => handleSliderChange('velocityDecay', parseFloat(e.target.value))}
            className="w-full accent-[#C5A059] bg-[#222] h-1.5 rounded cursor-pointer"
          />
        </div>

        {/* Category Cluster Pull */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#F5F5F0]/70">Categorical Cluster Pull:</span>
            <span className="text-[#C5A059] font-bold">{(params.clusterPull * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.80"
            step="0.05"
            value={params.clusterPull}
            onChange={e => handleSliderChange('clusterPull', parseFloat(e.target.value))}
            className="w-full accent-[#C5A059] bg-[#222] h-1.5 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Physics Actions */}
      <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between gap-2">
        <button
          onClick={handleReset}
          className="p-1.5 text-xs font-mono text-[#F5F5F0]/50 hover:text-[#F5F5F0] flex items-center gap-1 rounded bg-[#171717] hover:bg-[#222] cursor-pointer"
          title="Reset to default physics settings"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onFreeze();
              audioFeedback.playMicroTick();
            }}
            className="px-2.5 py-1 text-xs font-mono bg-[#1E1E1E] hover:bg-[#262626] border border-[#F5F5F0]/10 text-[#F5F5F0] rounded flex items-center gap-1 cursor-pointer"
          >
            {isFrozen ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            <span>{isFrozen ? 'Resume' : 'Freeze'}</span>
          </button>

          <button
            onClick={() => {
              onReheat();
              audioFeedback.playMicroTick();
            }}
            className="px-3 py-1 text-xs font-mono bg-[#C5A059] text-black font-bold rounded hover:bg-[#D4AF37] flex items-center gap-1 cursor-pointer shadow-md shadow-[#C5A059]/20"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Reheat (α 1.0)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
