import React from 'react';
import {
  Orbit,
  Network,
  GitFork,
  Check,
  ChevronDown,
  Sparkles,
  Layers,
  Compass
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export type GraphLayoutPreset = 'force-directed' | 'radial' | 'hierarchical';

interface LayoutPresetsMenuProps {
  currentPreset: GraphLayoutPreset;
  onSelectPreset: (preset: GraphLayoutPreset) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const LAYOUT_PRESET_CONFIGS: {
  id: GraphLayoutPreset;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
  badge: string;
}[] = [
  {
    id: 'force-directed',
    label: 'Force-Directed Organic Map',
    shortLabel: 'Force-Directed',
    icon: Network,
    description: 'Dynamic physics simulation with repulsion, collision buffers & natural spring tensions.',
    badge: 'Physics-Based'
  },
  {
    id: 'radial',
    label: 'Concentric Radial Orbits',
    shortLabel: 'Radial Orbit',
    icon: Orbit,
    description: 'Centralizes core restoration zones with outward concentric rings by ecological layer.',
    badge: 'Concentric'
  },
  {
    id: 'hierarchical',
    label: 'Ecological Trophic Hierarchy',
    shortLabel: 'Hierarchical',
    icon: GitFork,
    description: 'Top-down trophic hierarchy from macro-canopies to deep subterranean aquifers & living soil.',
    badge: 'Trophic Tree'
  }
];

export const LayoutPresetsMenu: React.FC<LayoutPresetsMenuProps> = ({
  currentPreset,
  onSelectPreset,
  isOpen,
  onToggle
}) => {
  const activeConfig = LAYOUT_PRESET_CONFIGS.find(c => c.id === currentPreset) || LAYOUT_PRESET_CONFIGS[0];
  const ActiveIcon = activeConfig.icon;

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => {
          onToggle();
          audioFeedback.playMicroTick();
        }}
        className={`px-3 py-1.5 border text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all cursor-pointer ${
          isOpen
            ? 'bg-[#222] border-[#C5A059] text-[#F5F5F0]'
            : 'bg-[#171717] hover:bg-[#222] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
        }`}
        title="Switch Graph Layout Visualization Presets"
      >
        <ActiveIcon className="w-3.5 h-3.5 text-[#C5A059]" />
        <span>Layout: {activeConfig.shortLabel}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 bg-[#121212]/95 backdrop-blur-md border border-[#F5F5F0]/20 rounded-md shadow-2xl z-50 overflow-hidden text-[#F5F5F0] animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2.5 bg-[#181818] border-b border-[#F5F5F0]/10 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Layout Topology Presets
            </span>
            <span className="text-[9px] font-mono text-[#F5F5F0]/40">
              3 Modes
            </span>
          </div>

          <div className="p-2 space-y-1.5">
            {LAYOUT_PRESET_CONFIGS.map(cfg => {
              const isSelected = cfg.id === currentPreset;
              const IconComp = cfg.icon;

              return (
                <div
                  key={cfg.id}
                  onClick={() => {
                    onSelectPreset(cfg.id);
                    onToggle();
                    audioFeedback.playSubtleClick();
                  }}
                  className={`p-2.5 rounded border transition-all cursor-pointer select-none flex items-start justify-between gap-2.5 group ${
                    isSelected
                      ? 'bg-[#1A1A1A] border-[#C5A059]/50 shadow-sm'
                      : 'bg-[#141414]/60 border-[#F5F5F0]/5 hover:bg-[#1C1C1C] hover:border-[#F5F5F0]/20'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                        isSelected
                          ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059]'
                          : 'bg-[#202020] border-[#F5F5F0]/10 text-[#F5F5F0]/50'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-serif font-bold text-[#F5F5F0]">
                          {cfg.label}
                        </span>
                        <span className="text-[8px] font-mono px-1.5 py-0.2 bg-[#252525] text-[#C5A059] rounded border border-[#F5F5F0]/10">
                          {cfg.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#F5F5F0]/50 leading-relaxed mt-0.5">
                        {cfg.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-[#C5A059] flex items-center justify-center shrink-0 mt-1">
                      <Check className="w-2.5 h-2.5 text-black font-bold" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
