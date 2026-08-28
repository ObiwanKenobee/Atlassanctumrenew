import React from 'react';
import { 
  Compass, 
  Sparkles, 
  Scale, 
  FolderKanban, 
  TrendingUp, 
  ArrowRight, 
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { PageView } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface NavigationalSpineProps {
  currentTab: PageView;
  onSelectTab: (tab: PageView) => void;
  className?: string;
  isCompact?: boolean;
}

export interface SpineStage {
  id: 'observatory' | 'opportunity' | 'decision' | 'project' | 'impact';
  label: string;
  sublabel: string;
  route: string;
  targetTab: PageView;
  icon: React.ComponentType<{ className?: string }>;
  associatedTabs: PageView[];
  statusText: string;
  color: string;
}

export const SPINE_STAGES: SpineStage[] = [
  {
    id: 'observatory',
    label: 'Observatory',
    sublabel: 'Planetary Sensory Mesh',
    route: '/observatory',
    targetTab: 'observatory',
    icon: Compass,
    associatedTabs: ['observatory', 'bioregional-twin', 'living-reality', 'reality-engine'],
    statusText: '384k ha Active Mesh',
    color: '#06B6D4' // Cyan
  },
  {
    id: 'opportunity',
    label: 'Opportunity',
    sublabel: 'Leverage Intelligence',
    route: '/observatory/opportunities',
    targetTab: 'opportunity-intelligence',
    icon: Sparkles,
    associatedTabs: ['opportunity-intelligence', 'opportunity-graph', 'opportunity-matchmaker'],
    statusText: '42 High-Leverage Interventions',
    color: '#10B981' // Emerald
  },
  {
    id: 'decision',
    label: 'Decision',
    sublabel: 'Moral Consensus Matrix',
    route: '/studio/decisions',
    targetTab: 'decision-room',
    icon: Scale,
    associatedTabs: ['decision-room', 'moral-arbiter', 'ethics-review', 'system-model-studio'],
    statusText: '94.8% Axiom Agreement',
    color: '#C5A059' // Gold
  },
  {
    id: 'project',
    label: 'Project',
    sublabel: 'Execution OS & Labs',
    route: '/projects',
    targetTab: 'project-os',
    icon: FolderKanban,
    associatedTabs: ['project-os', 'field-labs', 'lifehouse', 'industrial'],
    statusText: '124 Deployments Running',
    color: '#8FB8DE' // Soft Blue
  },
  {
    id: 'impact',
    label: 'Impact',
    sublabel: 'Verifiable Flourishing',
    route: '/impact',
    targetTab: 'impact-dashboard',
    icon: TrendingUp,
    associatedTabs: ['impact-dashboard', 'flourishing-index', 'evidence-ledger', 'stewardship-reputation'],
    statusText: '+18.4% Regeneration Loop',
    color: '#A855F7' // Purple
  }
];

export const NavigationalSpine: React.FC<NavigationalSpineProps> = ({
  currentTab,
  onSelectTab,
  className = '',
  isCompact = false
}) => {
  // Determine which stage is currently active
  const activeStageIndex = SPINE_STAGES.findIndex(stage => 
    stage.associatedTabs.includes(currentTab) || stage.targetTab === currentTab
  );

  const handleStageClick = (stage: SpineStage) => {
    audioFeedback.playSubtleClick();
    onSelectTab(stage.targetTab);
  };

  return (
    <nav 
      id="navigational-spine"
      aria-label="Core Regenerative Lifecycle Spine"
      className={`w-full bg-[#080808]/90 border-y border-[#F5F5F0]/10 backdrop-blur-md px-3 sm:px-6 py-2.5 transition-all ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Spine Title & Epistemic Feedback Loop Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059] animate-pulse" />
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C5A059] font-bold">
            Core Navigational Spine
          </span>
          <span className="hidden lg:inline text-[#F5F5F0]/30 font-mono text-[10px]">•</span>
          <span className="hidden lg:inline text-[9px] uppercase font-mono tracking-wider text-[#F5F5F0]/50">
            Regenerative Causal Feedback Loop
          </span>
        </div>

        {/* 5-Stage Visual Workflow Pipeline */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 text-xs font-mono">
          {SPINE_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = stage.associatedTabs.includes(currentTab) || stage.targetTab === currentTab;
            const isCompleted = activeStageIndex > idx;

            return (
              <React.Fragment key={stage.id}>
                <button
                  id={`spine-stage-${stage.id}`}
                  onClick={() => handleStageClick(stage)}
                  title={`${stage.label} — ${stage.sublabel} (${stage.route})`}
                  className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-sm border transition-all cursor-pointer text-left shrink-0 ${
                    isActive
                      ? 'bg-[#151515] border-[#C5A059] text-[#F5F5F0] shadow-[0_0_12px_rgba(197,160,89,0.25)]'
                      : isCompleted
                      ? 'bg-[#0E0E0E] border-emerald-900/60 text-[#F5F5F0]/80 hover:border-emerald-500/50 hover:bg-[#141414]'
                      : 'bg-[#0A0A0A] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:border-[#F5F5F0]/30 hover:text-[#F5F5F0]'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                      isActive 
                        ? 'bg-[#C5A059] text-[#0A0A0A]' 
                        : isCompleted
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-[#1A1A1A] text-[#F5F5F0]/50'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${
                        isActive ? 'text-[#C5A059]' : 'text-[#F5F5F0] group-hover:text-[#C5A059]'
                      }`}>
                        {stage.label}
                      </span>
                    </div>

                    {!isCompact && (
                      <span className="hidden xl:inline text-[9px] text-[#F5F5F0]/40 truncate">
                        {stage.sublabel}
                      </span>
                    )}
                  </div>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse ml-0.5" />
                  )}
                </button>

                {/* Arrow Connector */}
                {idx < SPINE_STAGES.length - 1 && (
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                    idx < activeStageIndex ? 'text-emerald-500/60' : 'text-[#F5F5F0]/20'
                  }`} />
                )}
              </React.Fragment>
            );
          })}

          {/* Feedback Loop Icon returning to Observatory */}
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onSelectTab('observatory');
            }}
            title="Impact feeds back into continuous Observatory Sensing"
            className="hidden sm:flex items-center gap-1 pl-1 text-[9px] text-[#C5A059]/60 hover:text-[#C5A059] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-[#C5A059]" />
            <span className="hidden 2xl:inline">Loop</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
