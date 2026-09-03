import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  Coins,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  X,
  RefreshCw,
  Cpu,
  Activity,
  Globe2,
  Wrench,
  ExternalLink,
  FileText,
  Printer
} from 'lucide-react';
import { PageView, ActiveMissionPipeline } from '../types';
import { useActiveMission } from '../context/ActiveMissionContext';
import { InstitutionalDossierModal } from './modals/InstitutionalDossierModal';
import { audioFeedback } from '../lib/audioFeedback';

interface ActiveMissionStatusBarProps {
  onSelectTab: (tab: PageView) => void;
}

const STAGES: {
  key: ActiveMissionPipeline['stage'];
  shortLabel: string;
  tab: PageView;
  icon: any;
  desc: string;
}[] = [
  { key: 'DIAGNOSED', shortLabel: '01. Diagnose', tab: 'reality-engine', icon: Globe2, desc: 'Root-cause causal telemetry' },
  { key: 'STRATEGY_FORMULATED', shortLabel: '02. Agent Swarm', tab: 'sentinel', icon: Cpu, desc: '10 AI agents multi-objective formulation' },
  { key: 'CAPITAL_STRUCTURED', shortLabel: '03. Capital Structuring', tab: 'capital-engine', icon: Coins, desc: '7-Capitals blended tranche' },
  { key: 'FIELD_DEPLOYED', shortLabel: '04. Project OS', tab: 'project-os', icon: Wrench, desc: 'Physical deployment & milestones' },
  { key: 'VERIFIED_AUDIT', shortLabel: '05. Evidence Ledger', tab: 'evidence-ledger', icon: ShieldCheck, desc: 'Merkle root cryptographic verification' }
];

export const ActiveMissionStatusBar: React.FC<ActiveMissionStatusBarProps> = ({ onSelectTab }) => {
  const { activeMission, clearActiveMission, advanceMissionStage } = useActiveMission();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [dossierOpen, setDossierOpen] = useState<boolean>(false);

  if (!activeMission) return null;

  const currentStageIndex = STAGES.findIndex(s => s.key === activeMission.stage);

  return (
    <>
      <div className="w-full bg-[#0D1410] border-b border-[#C5A059]/40 text-[#F5F5F0] z-30 transition-all shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            {/* Active Mission Badge & Summary */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#C5A059] font-mono text-[10px] uppercase font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
                ACTIVE MISSION PIPELINE
              </div>
              <span className="font-semibold text-[#F5F5F0] max-w-md truncate">
                {activeMission.title}
              </span>
              <span className="text-[#F5F5F0]/40 font-mono text-[10px] hidden sm:inline">
                ({activeMission.bioregion})
              </span>
            </div>

            {/* Stepper Pipeline */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
              {STAGES.map((s, idx) => {
                const isPast = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const Icon = s.icon;

                return (
                  <button
                    key={s.key}
                    onClick={() => {
                      audioFeedback.playSubtleClick();
                      onSelectTab(s.tab);
                    }}
                    title={s.desc}
                    className={`px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 whitespace-nowrap transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#C5A059] text-black font-bold shadow-[0_0_10px_rgba(197,160,89,0.3)]'
                        : isPast
                        ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/30 hover:border-[#C5A059]'
                        : 'bg-[#141414] text-[#F5F5F0]/40 hover:text-[#F5F5F0]/70'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{s.shortLabel}</span>
                    {isPast && <CheckCircle2 className="w-2.5 h-2.5 text-[#C5A059]" />}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setDossierOpen(true);
                }}
                className="px-2.5 py-1 rounded bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs ml-1"
                title="Generate Institutional Briefing PDF / Dossier"
              >
                <FileText className="w-3 h-3" />
                <span className="hidden sm:inline">Dossier</span>
              </button>

              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[#F5F5F0]/50 hover:text-[#C5A059] text-[10px] font-mono underline ml-1 cursor-pointer"
              >
                {expanded ? 'Hide' : 'Details'}
              </button>

              <button
                onClick={clearActiveMission}
                title="Clear Active Mission Pipeline"
                className="text-[#F5F5F0]/30 hover:text-red-400 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Expanded Mission Architecture Card */}
          {expanded && (
            <div className="mt-3 pt-3 border-t border-[#C5A059]/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-[#0A0E0B] p-3 rounded-sm">
              <div>
                <span className="text-[10px] font-mono text-[#C5A059] uppercase block font-bold">Highest-Leverage Intervention</span>
                <p className="text-[#F5F5F0]/90 text-[11px] font-light mt-0.5">{activeMission.highestLeverageIntervention}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#C5A059] uppercase block font-bold">Telemetry Proof</span>
                <p className="text-[#F5F5F0]/70 text-[11px] font-mono mt-0.5 truncate">{activeMission.keyTelemetryProof}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#C5A059] uppercase block font-bold">Assigned Swarm Agents</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {activeMission.assignedAgents.map((agent, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-[#1B3022] text-[#C5A059] font-mono text-[9px]">
                      {agent}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    audioFeedback.playSubtleClick();
                    setDossierOpen(true);
                  }}
                  className="px-2.5 py-1.5 bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 text-[10px] font-mono font-bold uppercase rounded-sm flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  <span>Export Dossier</span>
                </button>
                {currentStageIndex < STAGES.length - 1 && (
                  <button
                    onClick={() => {
                      const next = STAGES[currentStageIndex + 1];
                      advanceMissionStage(next.key);
                      onSelectTab(next.tab);
                    }}
                    className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-[10px] font-mono uppercase tracking-wider rounded-sm flex items-center gap-1 cursor-pointer"
                  >
                    <span>Advance to {STAGES[currentStageIndex + 1].shortLabel.split('.')[1]}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Institutional Strategic Dossier Modal */}
      <InstitutionalDossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        mission={activeMission}
        onSelectTab={onSelectTab}
      />
    </>
  );
};
