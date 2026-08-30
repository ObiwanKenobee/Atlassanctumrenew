import React from 'react';
import {
  Route,
  X,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  RefreshCw,
  Compass,
  Layers,
  Activity,
  ArrowDownUp
} from 'lucide-react';
import type { KnowledgeNode, KnowledgeLink } from './BioregionalKnowledgeGraph';
import { ShortestPathResult } from '../../services/bioregionalKnowledgeService';
import { audioFeedback } from '../../lib/audioFeedback';

interface AnimatedPathTracerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  allNodes: KnowledgeNode[];
  sourceNodeId: string | null;
  targetNodeId: string | null;
  onSelectSourceNode: (nodeId: string) => void;
  onSelectTargetNode: (nodeId: string) => void;
  pathResult: ShortestPathResult | null;
  onClearPath: () => void;
  onApplyPreset: (sourceId: string, targetId: string) => void;
}

const PRESET_PATHWAYS = [
  {
    title: 'Cloud Mist to Springflow Cascade',
    sourceId: 'flora-podocarpus-falcatus',
    targetId: 'hydro-perennial-springflow',
    description: 'High forest canopy cloud stripping feeding mountain perennial baseflow'
  },
  {
    title: 'Vetiver Swale to Water Table Recharge',
    sourceId: 'soil-vetiver-stabilization',
    targetId: 'zone-mathare-swale',
    description: 'Living silt terraces filtering runoff and feeding riparian aquifers'
  },
  {
    title: 'Mycelial Soil Sponge to Escarpment Canopy',
    sourceId: 'soil-mycorrhizal-fungi',
    targetId: 'zone-aberdare-ridge',
    description: 'Glomalin aggregates retaining water and buffering drought stress'
  }
];

export const AnimatedPathTracerPanel: React.FC<AnimatedPathTracerPanelProps> = ({
  isOpen,
  onClose,
  allNodes,
  sourceNodeId,
  targetNodeId,
  onSelectSourceNode,
  onSelectTargetNode,
  pathResult,
  onClearPath,
  onApplyPreset
}) => {
  if (!isOpen) return null;

  const handleSwap = () => {
    if (sourceNodeId && targetNodeId) {
      const s = sourceNodeId;
      const t = targetNodeId;
      onSelectSourceNode(t);
      onSelectTargetNode(s);
      audioFeedback.playMicroTick();
    }
  };

  return (
    <div className="fixed top-20 right-6 z-50 w-full max-w-md bg-[#0D0D0D]/95 backdrop-blur-xl border border-[#C5A059]/40 shadow-2xl rounded-sm p-4 text-[#F5F5F0] space-y-4 animate-in slide-in-from-right-4 duration-200 text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-[#C5A059]" />
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
              GRAPH TOPOLOGY ENGINE
            </span>
            <h4 className="text-xs font-serif font-bold text-[#F5F5F0]">
              Animated Causal Path Tracer
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

      {/* Selectors: Origin & Destination */}
      <div className="space-y-2">
        {/* Source */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Origin / Driver Node:
          </label>
          <select
            value={sourceNodeId || ''}
            onChange={e => {
              onSelectSourceNode(e.target.value);
              audioFeedback.playSubtleClick();
            }}
            className="w-full px-2.5 py-1.5 bg-[#171717] border border-[#F5F5F0]/15 rounded-xs text-xs text-[#F5F5F0] font-mono outline-none focus:border-[#C5A059] cursor-pointer"
          >
            <option value="">Select Origin Node...</option>
            {allNodes.map(n => (
              <option key={n.id} value={n.id}>
                {n.label} ({n.categoryName})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            disabled={!sourceNodeId || !targetNodeId}
            className="p-1 bg-[#1A1A1A] hover:bg-[#252525] border border-[#F5F5F0]/10 rounded text-[#F5F5F0]/60 hover:text-[#F5F5F0] cursor-pointer"
            title="Swap Origin & Destination"
          >
            <ArrowDownUp className="w-3 h-3" />
          </button>
        </div>

        {/* Target */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Destination / Impact Node:
          </label>
          <select
            value={targetNodeId || ''}
            onChange={e => {
              onSelectTargetNode(e.target.value);
              audioFeedback.playSubtleClick();
            }}
            className="w-full px-2.5 py-1.5 bg-[#171717] border border-[#F5F5F0]/15 rounded-xs text-xs text-[#F5F5F0] font-mono outline-none focus:border-[#C5A059] cursor-pointer"
          >
            <option value="">Select Destination Node...</option>
            {allNodes.map(n => (
              <option key={n.id} value={n.id}>
                {n.label} ({n.categoryName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Path Results & Animated Particle Feedback */}
      {pathResult ? (
        <div className="space-y-2.5 bg-[#070707] p-3 rounded-xs border border-[#C5A059]/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#F59E0B] animate-spin" style={{ animationDuration: '3s' }} />
              Active Path Particle Flow
            </span>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              {pathResult.steps.length} Hops ({pathResult.totalCouplingStrength}% Coupling)
            </span>
          </div>

          {/* Step Sequence */}
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {pathResult.steps.map((step, idx) => (
              <div
                key={idx}
                className="p-2 bg-[#121212] border border-[#F5F5F0]/10 rounded-xs space-y-1 text-xs font-mono"
              >
                <div className="flex items-center justify-between text-[10px] text-[#F5F5F0]/60">
                  <span>Step {step.stepIndex}</span>
                  <span className="text-[#C5A059]">{(step.link.strength * 100).toFixed(0)}% Rigidity</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#F5F5F0] font-bold truncate">
                  <span className="text-emerald-300 truncate">{step.fromNode.label}</span>
                  <ArrowRight className="w-3 h-3 text-[#C5A059] shrink-0" />
                  <span className="text-cyan-300 truncate">{step.toNode.label}</span>
                </div>
                <div className="text-[9px] text-[#F5F5F0]/50 italic truncate">
                  {step.link.relationshipLabel}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[9px] font-mono text-[#F5F5F0]/50 pt-1 border-t border-[#F5F5F0]/10 flex items-center justify-between">
            <span>Cumulative Transfer Efficiency:</span>
            <span className="text-emerald-400 font-bold">{pathResult.cumulativeTransferEfficiency}%</span>
          </div>
        </div>
      ) : sourceNodeId && targetNodeId ? (
        <div className="p-3 bg-[#181105] border border-amber-500/30 rounded-xs text-xs font-mono text-amber-300 text-center">
          No direct or indirect causal path found between these nodes. Try selecting neighboring keystone mechanisms.
        </div>
      ) : null}

      {/* Presets */}
      <div className="space-y-1.5">
        <span className="text-[9px] font-mono uppercase text-[#F5F5F0]/40 font-bold block">
          Quick Preset Pathways:
        </span>
        <div className="space-y-1">
          {PRESET_PATHWAYS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                onApplyPreset(preset.sourceId, preset.targetId);
                audioFeedback.playSubtleClick();
              }}
              className="w-full p-2 bg-[#141414] hover:bg-[#1A1A1A] border border-[#F5F5F0]/10 rounded-xs text-left text-xs font-mono transition-colors cursor-pointer space-y-0.5"
            >
              <div className="flex items-center justify-between text-[#C5A059] font-bold text-[10px]">
                <span>{preset.title}</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </div>
              <p className="text-[9px] text-[#F5F5F0]/50 truncate">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Action */}
      <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between">
        <button
          onClick={() => {
            onClearPath();
            audioFeedback.playMicroTick();
          }}
          disabled={!sourceNodeId && !targetNodeId}
          className="px-2.5 py-1 text-xs font-mono text-[#F5F5F0]/60 hover:text-[#F5F5F0] bg-[#171717] hover:bg-[#222] rounded cursor-pointer"
        >
          Clear Path
        </button>
        <button
          onClick={() => {
            onClose();
            audioFeedback.playMicroTick();
          }}
          className="px-3 py-1 bg-[#C5A059] text-black font-mono font-bold text-xs rounded hover:bg-[#D4AF37] cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
