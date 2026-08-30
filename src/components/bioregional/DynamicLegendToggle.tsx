import React, { useState } from 'react';
import {
  Layers,
  Check,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  TreePine,
  Droplets,
  Bird,
  Sprout,
  Activity,
  Cpu,
  RefreshCw,
  Sparkles,
  Link as LinkIcon,
  Shield,
  Zap,
  Wind
} from 'lucide-react';
import { KnowledgeNodeType, KnowledgeLinkType, KnowledgeNode, KnowledgeLink } from './BioregionalKnowledgeGraph';
import { audioFeedback } from '../../lib/audioFeedback';

export interface LegendNodeTypeConfig {
  type: KnowledgeNodeType;
  label: string;
  shortCode: string;
  color: string;
  icon: React.ElementType;
  description: string;
}

export interface LegendLinkTypeConfig {
  type: KnowledgeLinkType;
  label: string;
  color: string;
  icon: React.ElementType;
  description: string;
  dashed?: boolean;
}

export const NODE_TYPE_CONFIGS: LegendNodeTypeConfig[] = [
  {
    type: 'zone',
    label: 'Restoration Project Zones',
    shortCode: 'Z',
    color: '#818CF8', // Indigo
    icon: Shield,
    description: 'High-altitude climax canopies, riparian corridors & community conservation zones'
  },
  {
    type: 'evidence_flora',
    label: 'Endemic Flora & Canopy',
    shortCode: 'FL',
    color: '#34D399', // Emerald
    icon: TreePine,
    description: 'Keystone botanical species, cloud mist catchers & bio-stabilizers'
  },
  {
    type: 'evidence_fauna',
    label: 'Keystone Fauna & Avian',
    shortCode: 'FA',
    color: '#FBBF24', // Amber
    icon: Bird,
    description: 'Indicator mammals, raptors & transboundary flyway pollinators'
  },
  {
    type: 'evidence_hydrology',
    label: 'Hydrology & Aquifers',
    shortCode: 'HY',
    color: '#38BDF8', // Cyan
    icon: Droplets,
    description: 'Perennial headwater springs, subsurface piezometers & riparian baseflows'
  },
  {
    type: 'evidence_soil',
    label: 'Living Soil & Mycelium',
    shortCode: 'SO',
    color: '#D97706', // Bronze/Amber
    icon: Sprout,
    description: 'Glomalin fungal sponges, vetiver root networks & biochar carbon sinks'
  },
  {
    type: 'keystone_mechanism',
    label: 'Keystone Mechanisms',
    shortCode: 'KM',
    color: '#C084FC', // Purple
    icon: Cpu,
    description: 'Cloud stripping, bio-filtration, rotational covenants & trophic cascades'
  }
];

export const LINK_TYPE_CONFIGS: LegendLinkTypeConfig[] = [
  {
    type: 'hydrological_recharge',
    label: 'Hydrological Recharge',
    color: '#06B6D4',
    icon: Droplets,
    description: 'Precipitation capture, ground infiltration & aquifer replenishment'
  },
  {
    type: 'mycorrhizal_coupling',
    label: 'Mycorrhizal Coupling',
    color: '#D97706',
    icon: Sprout,
    description: 'Underground fungal hyphae nutrient & moisture transport network'
  },
  {
    type: 'trophic_cascade',
    label: 'Trophic Cascade',
    color: '#F97316',
    icon: Activity,
    description: 'Predator-prey balance, herbivory regulation & biodiversity pressure'
  },
  {
    type: 'microclimate_feedback',
    label: 'Microclimate Feedback',
    color: '#10B981',
    icon: Wind,
    description: 'Evapotranspiration cooling, windbreak protection & mist condense'
  },
  {
    type: 'stewardship_governance',
    label: 'Customary Governance',
    color: '#C5A059',
    icon: Shield,
    dashed: true,
    description: 'Indigenous council covenants, rotational grazing bylaws & monitoring'
  }
];

interface DynamicLegendToggleProps {
  visibleNodeTypes: Set<KnowledgeNodeType>;
  onToggleNodeType: (type: KnowledgeNodeType) => void;
  onSetAllNodeTypes: (visible: boolean) => void;
  visibleLinkTypes: Set<KnowledgeLinkType>;
  onToggleLinkType: (type: KnowledgeLinkType) => void;
  onSetAllLinkTypes: (visible: boolean) => void;
  allNodes: KnowledgeNode[];
  allLinks: KnowledgeLink[];
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const DynamicLegendToggle: React.FC<DynamicLegendToggleProps> = ({
  visibleNodeTypes,
  onToggleNodeType,
  onSetAllNodeTypes,
  visibleLinkTypes,
  onToggleLinkType,
  onSetAllLinkTypes,
  allNodes,
  allLinks,
  isOpen,
  onToggleOpen
}) => {
  const [activeTab, setActiveTab] = useState<'nodes' | 'links'>('nodes');

  // Count items per type
  const nodeTypeCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    allNodes.forEach(n => {
      counts[n.type] = (counts[n.type] || 0) + 1;
    });
    return counts;
  }, [allNodes]);

  const linkTypeCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    allLinks.forEach(l => {
      counts[l.relationshipType] = (counts[l.relationshipType] || 0) + 1;
    });
    return counts;
  }, [allLinks]);

  const allNodesVisible = visibleNodeTypes.size === NODE_TYPE_CONFIGS.length;
  const allLinksVisible = visibleLinkTypes.size === LINK_TYPE_CONFIGS.length;

  return (
    <div className="bg-[#121212]/95 backdrop-blur-md border border-[#F5F5F0]/15 rounded-md shadow-2xl overflow-hidden transition-all duration-200 w-full sm:w-[320px]">
      {/* Header Bar */}
      <div
        onClick={() => {
          onToggleOpen();
          audioFeedback.playMicroTick();
        }}
        className="p-2.5 bg-[#181818] border-b border-[#F5F5F0]/10 flex items-center justify-between cursor-pointer hover:bg-[#1E1E1E] transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/30">
            <Layers className="w-3 h-3 text-[#C5A059]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold text-[#F5F5F0] tracking-wider uppercase">
                Dynamic Legend
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#262626] text-[#C5A059] rounded-full border border-[#F5F5F0]/10">
                {visibleNodeTypes.size}/{NODE_TYPE_CONFIGS.length} Nodes • {visibleLinkTypes.size}/{LINK_TYPE_CONFIGS.length} Links
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="text-[#F5F5F0]/50 hover:text-[#F5F5F0] transition-colors p-1"
          aria-label="Toggle Legend"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-3 space-y-3">
          {/* Sub-tabs: Node Types vs Connection Categories */}
          <div className="flex items-center bg-[#0D0D0D] p-0.5 rounded border border-[#F5F5F0]/10 text-xs font-mono">
            <button
              onClick={() => {
                setActiveTab('nodes');
                audioFeedback.playMicroTick();
              }}
              className={`flex-1 py-1 px-2 rounded-sm text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'nodes'
                  ? 'bg-[#222222] text-[#F5F5F0] font-bold shadow-sm'
                  : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#34D399]" />
              <span>Node Types ({visibleNodeTypes.size})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('links');
                audioFeedback.playMicroTick();
              }}
              className={`flex-1 py-1 px-2 rounded-sm text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'links'
                  ? 'bg-[#222222] text-[#F5F5F0] font-bold shadow-sm'
                  : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              <LinkIcon className="w-3 h-3 text-[#38BDF8]" />
              <span>Couplings ({visibleLinkTypes.size})</span>
            </button>
          </div>

          {/* Quick Bulk Action Buttons */}
          <div className="flex items-center justify-between text-[10px] font-mono px-1">
            <span className="text-[#F5F5F0]/50 uppercase tracking-wider">
              {activeTab === 'nodes' ? 'Filter Node Classes' : 'Filter Dependency Types'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (activeTab === 'nodes') onSetAllNodeTypes(true);
                  else onSetAllLinkTypes(true);
                  audioFeedback.playSubtleClick();
                }}
                className="text-[#C5A059] hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <Eye className="w-2.5 h-2.5" /> Show All
              </button>
              <span className="text-[#F5F5F0]/20">•</span>
              <button
                onClick={() => {
                  if (activeTab === 'nodes') onSetAllNodeTypes(false);
                  else onSetAllLinkTypes(false);
                  audioFeedback.playMicroTick();
                }}
                className="text-[#F5F5F0]/50 hover:text-rose-400 cursor-pointer flex items-center gap-0.5"
              >
                <EyeOff className="w-2.5 h-2.5" /> Hide All
              </button>
            </div>
          </div>

          {/* Tab 1: Node Types List */}
          {activeTab === 'nodes' && (
            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {NODE_TYPE_CONFIGS.map(cfg => {
                const isVisible = visibleNodeTypes.has(cfg.type);
                const count = nodeTypeCounts[cfg.type] || 0;
                const IconComponent = cfg.icon;

                return (
                  <div
                    key={cfg.type}
                    onClick={() => {
                      onToggleNodeType(cfg.type);
                      audioFeedback.playMicroTick();
                    }}
                    className={`p-2 rounded border flex items-center justify-between transition-all cursor-pointer select-none group ${
                      isVisible
                        ? 'bg-[#181818] border-[#F5F5F0]/15 hover:border-[#C5A059]/40'
                        : 'bg-[#101010]/60 border-[#F5F5F0]/5 opacity-40 hover:opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Color Pill / Icon */}
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: `${cfg.color}20`,
                          borderColor: isVisible ? cfg.color : '#333'
                        }}
                      >
                        <IconComponent
                          className="w-3.5 h-3.5"
                          style={{ color: isVisible ? cfg.color : '#666' }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-serif font-bold text-[#F5F5F0] truncate">
                            {cfg.label}
                          </span>
                          <span className="text-[9px] font-mono px-1 py-0.2 bg-[#252525] text-[#F5F5F0]/70 rounded">
                            {count}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#F5F5F0]/50 truncate max-w-[190px]">
                          {cfg.description}
                        </p>
                      </div>
                    </div>

                    {/* Eye toggle indicator */}
                    <div className="pl-2 shrink-0">
                      {isVisible ? (
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center border"
                          style={{
                            backgroundColor: `${cfg.color}30`,
                            borderColor: cfg.color
                          }}
                        >
                          <Check className="w-2.5 h-2.5" style={{ color: cfg.color }} />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full flex items-center justify-center border border-[#333] bg-[#1a1a1a]">
                          <EyeOff className="w-2.5 h-2.5 text-[#555]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Connection Categories List */}
          {activeTab === 'links' && (
            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {LINK_TYPE_CONFIGS.map(cfg => {
                const isVisible = visibleLinkTypes.has(cfg.type);
                const count = linkTypeCounts[cfg.type] || 0;
                const IconComponent = cfg.icon;

                return (
                  <div
                    key={cfg.type}
                    onClick={() => {
                      onToggleLinkType(cfg.type);
                      audioFeedback.playMicroTick();
                    }}
                    className={`p-2 rounded border flex items-center justify-between transition-all cursor-pointer select-none group ${
                      isVisible
                        ? 'bg-[#181818] border-[#F5F5F0]/15 hover:border-[#C5A059]/40'
                        : 'bg-[#101010]/60 border-[#F5F5F0]/5 opacity-40 hover:opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Couplings Indicator (Line + Icon) */}
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: `${cfg.color}20`,
                          borderColor: isVisible ? cfg.color : '#333'
                        }}
                      >
                        <IconComponent
                          className="w-3.5 h-3.5"
                          style={{ color: isVisible ? cfg.color : '#666' }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-serif font-bold text-[#F5F5F0] truncate">
                            {cfg.label}
                          </span>
                          <span className="text-[9px] font-mono px-1 py-0.2 bg-[#252525] text-[#F5F5F0]/70 rounded">
                            {count}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#F5F5F0]/50 truncate max-w-[190px]">
                          {cfg.description}
                        </p>
                      </div>
                    </div>

                    {/* Checkbox status */}
                    <div className="pl-2 shrink-0">
                      {isVisible ? (
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center border"
                          style={{
                            backgroundColor: `${cfg.color}30`,
                            borderColor: cfg.color
                          }}
                        >
                          <Check className="w-2.5 h-2.5" style={{ color: cfg.color }} />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full flex items-center justify-center border border-[#333] bg-[#1a1a1a]">
                          <EyeOff className="w-2.5 h-2.5 text-[#555]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
