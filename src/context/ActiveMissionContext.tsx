import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActiveMissionPipeline, PageView } from '../types';
import { audioFeedback } from '../lib/audioFeedback';

interface ActiveMissionContextType {
  activeMission: ActiveMissionPipeline | null;
  pipelineHistory: ActiveMissionPipeline[];
  setActiveMission: (mission: ActiveMissionPipeline | null) => void;
  loadDiagnosisIntoPipeline: (diagnosis: {
    id: string;
    primaryProblem: string;
    bioregion: string;
    highestLeverageIntervention: string;
    evidenceProof?: string;
    systemicDomain?: string;
  }) => void;
  advanceMissionStage: (nextStage: ActiveMissionPipeline['stage']) => void;
  clearActiveMission: () => void;
  jumpToPipelineStep: (step: 'DIAGNOSE' | 'STRATEGY' | 'CAPITAL' | 'BUILD' | 'VERIFY', onSelectTab: (tab: PageView) => void) => void;
}

const DEFAULT_INITIAL_MISSION: ActiveMissionPipeline = {
  id: 'mission-mathare-basin',
  sourceDiagnosisId: 'nairobi-mathare',
  title: 'Mathare River Basin Inundation & Waste Trap',
  bioregion: 'Nairobi River Drainage Basin, Kenya',
  primaryProblem: 'Mathare River Basin Inundation & Waste Trap',
  highestLeverageIntervention: 'Bio-Composite Swales + Decentralized Plastic Pyrolysis Microgrids',
  estimatedBudgetUsd: 1450000,
  stage: 'STRATEGY_FORMULATED',
  targetDomain: 'INFRASTRUCTURE',
  assignedAgents: ['OBSERVER', 'DIAGNOSTICIAN', 'STRATEGIST', 'CAPITAL_ARCHITECT', 'ETHICIST'],
  keyTelemetryProof: 'Sentinel-2 multispectral turbidity: 840 NTU (Critical) & MTH-04 node telemetry',
  covenantSafeguard: 'Zero displacement of informal riparian residents; 100% community equity ownership',
  activeScenarioPrompt: 'Simulate bio-composite swales impact on Mathare River monsoon flood levels over 3 years',
  createdAt: new Date().toISOString()
};

const ActiveMissionContext = createContext<ActiveMissionContextType | undefined>(undefined);

export const ActiveMissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMission, setActiveMissionState] = useState<ActiveMissionPipeline | null>(() => {
    try {
      const saved = localStorage.getItem('atlas_active_mission_pipeline');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load active mission pipeline from storage', e);
    }
    return DEFAULT_INITIAL_MISSION;
  });

  const [pipelineHistory, setPipelineHistory] = useState<ActiveMissionPipeline[]>([]);

  useEffect(() => {
    try {
      if (activeMission) {
        localStorage.setItem('atlas_active_mission_pipeline', JSON.stringify(activeMission));
      } else {
        localStorage.removeItem('atlas_active_mission_pipeline');
      }
    } catch (e) {
      console.error('Failed to persist active mission pipeline', e);
    }
  }, [activeMission]);

  const setActiveMission = (mission: ActiveMissionPipeline | null) => {
    setActiveMissionState(mission);
    if (mission) {
      setPipelineHistory(prev => [mission, ...prev.filter(p => p.id !== mission.id)].slice(0, 10));
    }
  };

  const loadDiagnosisIntoPipeline = (diagnosis: {
    id: string;
    primaryProblem: string;
    bioregion: string;
    highestLeverageIntervention: string;
    evidenceProof?: string;
    systemicDomain?: string;
  }) => {
    audioFeedback.playSuccessChime();
    const newMission: ActiveMissionPipeline = {
      id: `mission-${diagnosis.id}-${Date.now().toString(36)}`,
      sourceDiagnosisId: diagnosis.id,
      title: diagnosis.primaryProblem,
      bioregion: diagnosis.bioregion,
      primaryProblem: diagnosis.primaryProblem,
      highestLeverageIntervention: diagnosis.highestLeverageIntervention,
      estimatedBudgetUsd: 2500000,
      stage: 'DIAGNOSED',
      targetDomain: (diagnosis.systemicDomain as any) || 'ECOLOGICAL',
      assignedAgents: ['OBSERVER', 'DIAGNOSTICIAN', 'STRATEGIST', 'ETHICIST', 'CAPITAL_ARCHITECT'],
      keyTelemetryProof: diagnosis.evidenceProof || 'Sentinel-2 In-situ Telemetry Stream',
      covenantSafeguard: 'Precautionary principle & inviolable community sovereignty floor',
      activeScenarioPrompt: `Formulate catalytic intervention for ${diagnosis.primaryProblem} in ${diagnosis.bioregion}`,
      createdAt: new Date().toISOString()
    };
    setActiveMission(newMission);
  };

  const advanceMissionStage = (nextStage: ActiveMissionPipeline['stage']) => {
    audioFeedback.playSubtleClick();
    if (!activeMission) return;
    setActiveMissionState({
      ...activeMission,
      stage: nextStage
    });
  };

  const clearActiveMission = () => {
    audioFeedback.playSubtleClick();
    setActiveMissionState(null);
  };

  const jumpToPipelineStep = (
    step: 'DIAGNOSE' | 'STRATEGY' | 'CAPITAL' | 'BUILD' | 'VERIFY',
    onSelectTab: (tab: PageView) => void
  ) => {
    audioFeedback.playSubtleClick();
    switch (step) {
      case 'DIAGNOSE':
        onSelectTab('reality-engine');
        break;
      case 'STRATEGY':
        onSelectTab('sentinel');
        break;
      case 'CAPITAL':
        onSelectTab('capital-engine');
        break;
      case 'BUILD':
        onSelectTab('project-os');
        break;
      case 'VERIFY':
        onSelectTab('evidence-ledger');
        break;
    }
  };

  return (
    <ActiveMissionContext.Provider
      value={{
        activeMission,
        pipelineHistory,
        setActiveMission,
        loadDiagnosisIntoPipeline,
        advanceMissionStage,
        clearActiveMission,
        jumpToPipelineStep
      }}
    >
      {children}
    </ActiveMissionContext.Provider>
  );
};

export const useActiveMission = () => {
  const context = useContext(ActiveMissionContext);
  if (!context) {
    throw new Error('useActiveMission must be used within an ActiveMissionProvider');
  }
  return context;
};
