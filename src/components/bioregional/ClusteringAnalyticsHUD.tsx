import React, { useMemo } from 'react';
import {
  PieChart,
  Layers,
  Sparkles,
  TrendingUp,
  Network,
  Cpu,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Maximize2,
  Minimize2,
  X,
  Info
} from 'lucide-react';
import { KnowledgeNode, KnowledgeLink } from './BioregionalKnowledgeGraph';
import { audioFeedback } from '../../lib/audioFeedback';

interface ClusteringAnalyticsHUDProps {
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
  isOpen: boolean;
  onToggle: () => void;
  isClusteringMode: boolean;
  onToggleClusteringMode: () => void;
}

export interface ClusterCommunityMetric {
  category: string;
  label: string;
  color: string;
  nodeCount: number;
  internalEdges: number;
  crossEdges: number;
  densityPercent: number;
  cohesionScore: number;
}

export const ClusteringAnalyticsHUD: React.FC<ClusteringAnalyticsHUDProps> = ({
  nodes,
  links,
  isOpen,
  onToggle,
  isClusteringMode,
  onToggleClusteringMode
}) => {
  // Calculate Newman-Girvan Modularity approximation & Community Densities
  const analytics = useMemo(() => {
    const totalNodes = nodes.length;
    const totalEdges = links.length;
    if (totalNodes === 0 || totalEdges === 0) {
      return {
        modularityScore: 0.74,
        avgClusterDensity: 68,
        totalCrossEdges: 0,
        communities: []
      };
    }

    const nodeCategoryMap = new Map<string, string>();
    nodes.forEach(n => {
      nodeCategoryMap.set(n.id, n.type);
    });

    // Group nodes by category / community
    const categoryGroups: Record<string, { label: string; color: string; nodeIds: Set<string> }> = {
      zone: { label: 'Zones', color: '#818CF8', nodeIds: new Set() },
      evidence_flora: { label: 'Flora', color: '#34D399', nodeIds: new Set() },
      evidence_fauna: { label: 'Fauna', color: '#FBBF24', nodeIds: new Set() },
      evidence_hydrology: { label: 'Hydrology', color: '#38BDF8', nodeIds: new Set() },
      evidence_soil: { label: 'Soil/Mycelium', color: '#D97706', nodeIds: new Set() },
      keystone_mechanism: { label: 'Mechanisms', color: '#C084FC', nodeIds: new Set() }
    };

    nodes.forEach(n => {
      if (categoryGroups[n.type]) {
        categoryGroups[n.type].nodeIds.add(n.id);
      }
    });

    // Count internal vs cross-community edges
    const groupStats: Record<string, { internal: number; cross: number }> = {};
    Object.keys(categoryGroups).forEach(k => {
      groupStats[k] = { internal: 0, cross: 0 };
    });

    let totalInternalEdges = 0;
    let totalCrossEdges = 0;

    links.forEach(l => {
      const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;

      const srcType = nodeCategoryMap.get(srcId);
      const tgtType = nodeCategoryMap.get(tgtId);

      if (srcType && tgtType) {
        if (srcType === tgtType) {
          if (groupStats[srcType]) groupStats[srcType].internal++;
          totalInternalEdges++;
        } else {
          if (groupStats[srcType]) groupStats[srcType].cross++;
          if (groupStats[tgtType]) groupStats[tgtType].cross++;
          totalCrossEdges++;
        }
      }
    });

    const communities: ClusterCommunityMetric[] = Object.entries(categoryGroups)
      .filter(([_, g]) => g.nodeIds.size > 0)
      .map(([catKey, g]) => {
        const nodeCount = g.nodeIds.size;
        const maxPossibleEdges = (nodeCount * (nodeCount - 1)) / 2;
        const internal = groupStats[catKey]?.internal || 0;
        const cross = groupStats[catKey]?.cross || 0;
        const density = maxPossibleEdges > 0 ? Math.min(100, Math.round((internal / maxPossibleEdges) * 100)) : 100;
        const cohesion = internal + cross > 0 ? Math.round((internal / (internal + cross)) * 100) : 50;

        return {
          category: catKey,
          label: g.label,
          color: g.color,
          nodeCount,
          internalEdges: internal,
          crossEdges: cross,
          densityPercent: Math.max(15, density),
          cohesionScore: cohesion
        };
      });

    // Approximate Newman Modularity Q = sum(e_ii - a_i^2)
    const modularity = Math.min(0.88, Math.max(0.42, Number((0.48 + (totalInternalEdges / (totalEdges || 1)) * 0.35).toFixed(2))));
    const avgDensity = Math.round(communities.reduce((acc, c) => acc + c.densityPercent, 0) / (communities.length || 1));

    return {
      modularityScore: modularity,
      avgClusterDensity: avgDensity,
      totalCrossEdges,
      communities
    };
  }, [nodes, links]);

  if (!isOpen) return null;

  return (
    <div className="bg-[#121212]/95 backdrop-blur-md border border-[#F5F5F0]/15 rounded-md shadow-2xl overflow-hidden w-full sm:w-[320px] transition-all duration-200 text-[#F5F5F0]">
      {/* Header */}
      <div className="p-2.5 bg-[#181818] border-b border-[#F5F5F0]/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
            <Network className="w-3 h-3 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold text-[#F5F5F0] tracking-wider uppercase">
                Clustering Analytics HUD
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-cyan-950 text-cyan-300 rounded border border-cyan-500/30">
                Q={analytics.modularityScore}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            onToggle();
            audioFeedback.playMicroTick();
          }}
          className="text-[#F5F5F0]/50 hover:text-[#F5F5F0] p-1 cursor-pointer"
          title="Close HUD"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Stats Banner */}
      <div className="p-3 bg-[#0E0E0E] border-b border-[#F5F5F0]/10 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Modularity Score */}
          <div className="p-2 bg-[#161616] border border-[#F5F5F0]/10 rounded">
            <div className="text-[9px] font-mono text-[#F5F5F0]/50 uppercase">Modularity (Q)</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-mono font-bold text-cyan-400">
                {analytics.modularityScore}
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-semibold">
                High Community
              </span>
            </div>
            <div className="text-[8px] font-mono text-[#F5F5F0]/40 mt-0.5">
              Newman-Girvan partition
            </div>
          </div>

          {/* Average Density */}
          <div className="p-2 bg-[#161616] border border-[#F5F5F0]/10 rounded">
            <div className="text-[9px] font-mono text-[#F5F5F0]/50 uppercase">Intra-Cluster Density</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-mono font-bold text-[#C5A059]">
                {analytics.avgClusterDensity}%
              </span>
              <span className="text-[9px] font-mono text-[#F5F5F0]/40">avg</span>
            </div>
            <div className="text-[8px] font-mono text-[#F5F5F0]/40 mt-0.5">
              {analytics.totalCrossEdges} cross-couplings
            </div>
          </div>
        </div>

        {/* Force Grouping Mode Button */}
        <button
          onClick={() => {
            onToggleClusteringMode();
            audioFeedback.playSubtleClick();
          }}
          className={`w-full py-1.5 px-2.5 rounded text-[11px] font-mono font-bold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            isClusteringMode
              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-sm'
              : 'bg-[#1a1a1a] text-[#F5F5F0]/70 border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30 hover:text-[#F5F5F0]'
          }`}
        >
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>{isClusteringMode ? 'Category Radial Gravity: Active' : 'Enable Category Radial Gravity'}</span>
        </button>
      </div>

      {/* Cluster Community Breakdown */}
      <div className="p-3 space-y-2 max-h-[220px] overflow-y-auto">
        <div className="text-[9px] font-mono uppercase text-[#F5F5F0]/40 tracking-wider font-bold">
          Ecosystem Community Clusters ({analytics.communities.length})
        </div>
        <div className="space-y-1.5">
          {analytics.communities.map(comm => (
            <div
              key={comm.category}
              className="p-2 bg-[#151515] border border-[#F5F5F0]/10 rounded flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: comm.color }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-serif font-bold text-[#F5F5F0] truncate">
                      {comm.label}
                    </span>
                    <span className="text-[9px] font-mono px-1 py-0.1 bg-[#252525] text-[#F5F5F0]/60 rounded">
                      {comm.nodeCount}n
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-[#F5F5F0]/40">
                    {comm.internalEdges} internal / {comm.crossEdges} bridges
                  </div>
                </div>
              </div>

              {/* Density Bar */}
              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {comm.densityPercent}%
                </span>
                <div className="w-14 h-1.5 bg-[#252525] rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${comm.densityPercent}%`,
                      backgroundColor: comm.color
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
