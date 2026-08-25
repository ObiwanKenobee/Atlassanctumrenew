/**
 * ATLAS AGENT MISSION CONTROL
 * Primary Agent Gateway UI and Autonomous Mission Dashboard Container
 */

import React, { useState } from 'react';
import { AgentMissionControlView } from './views/AgentMissionControlView';
import { SystemModelStudioView } from './views/SystemModelStudioView';
import { CandidateIntervention } from '../types';
import { Cpu, GitBranch } from 'lucide-react';

interface AgentMissionControlProps {
  onNavigateToView?: (view: string) => void;
}

export const AgentMissionControl: React.FC<AgentMissionControlProps> = ({ onNavigateToView }) => {
  const [activeSubMode, setActiveSubMode] = useState<'mission-gateway' | 'systems-modeler'>('mission-gateway');
  const [injectedIntervention, setInjectedIntervention] = useState<CandidateIntervention | null>(null);

  const handleInitiateMissionWithIntervention = (intervention: CandidateIntervention) => {
    setInjectedIntervention(intervention);
    setActiveSubMode('mission-gateway');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Operating Layer Sub-Bar */}
      <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-3.5 sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Atlas Agentic Operating Layer
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                v3.5 Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Sense → Structure → Model → Simulate → Decide → Act → Observe → Update
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubMode('mission-gateway')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubMode === 'mission-gateway'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Agent Gateway & DAG
          </button>
          <button
            onClick={() => setActiveSubMode('systems-modeler')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubMode === 'systems-modeler'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Systems Dynamics Studio
          </button>
        </div>
      </div>

      {/* Main Mode Rendering */}
      <div className="pt-4">
        {activeSubMode === 'mission-gateway' ? (
          <AgentMissionControlView
            onNavigateToView={onNavigateToView}
            injectedIntervention={injectedIntervention}
            onOpenSystemsModeler={() => setActiveSubMode('systems-modeler')}
          />
        ) : (
          <SystemModelStudioView
            onNavigateToMissionControl={() => setActiveSubMode('mission-gateway')}
            onInitiateMissionWithIntervention={handleInitiateMissionWithIntervention}
          />
        )}
      </div>
    </div>
  );
};
