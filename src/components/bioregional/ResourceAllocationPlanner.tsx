import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Sliders,
  TrendingUp,
  Droplets,
  TreePine,
  Layers,
  Zap,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Database,
  BarChart3,
  Calendar,
  Percent,
  Check,
  Camera,
  Bookmark,
  Trash2,
  ArrowLeftRight,
  X,
  History,
  GitCompare,
  Plus,
  Save,
  Clock,
  RefreshCw,
  Activity,
  Maximize2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { BioregionalLedgerData } from '../../data/bioregionalLedgerData';
import { audioFeedback, hapticFeedback } from '../../lib/audioFeedback';
import { useViewRenderTracker } from '../../hooks/useViewRenderTracker';

export interface ResourceFlowAllocation {
  flowId: string;
  title: string;
  category: 'hydrological' | 'carbon' | 'energy' | 'nutrient';
  baselineRate: number;
  unit: string;
  currentAllocationMultiplier: number; // 0.5 to 2.0 (i.e. -50% to +100%)
  targetCircularityPct: number; // 50 to 99%
  rationale: string;
}

export interface ScenarioSnapshot {
  id: string;
  name: string;
  timestamp: string;
  targetYear: number;
  presetName: string;
  allocations: ResourceFlowAllocation[];
  projections: {
    projectedFlourishingScore: number;
    scoreDelta: number;
    projectedWaterYieldM3: number;
    waterYieldDeltaPct: number;
    projectedCarbonRate: number;
    carbonDeltaPct: number;
    avgCircularity: number;
    unmeteredLossPct: number;
    lossReductionPct: number;
  };
}

export interface WhatIfScenarioPreset {
  id: string;
  name: string;
  description: string;
  badge: string;
  allocations: Record<string, { multiplier: number; circularity: number }>;
}

export interface ResourceAllocationPlannerProps {
  region: BioregionalLedgerData;
  onApplyScenario?: (projectedScore: number, waterMult: number, carbonMult: number, summaryTitle: string) => void;
  onClose?: () => void;
}

export const ResourceAllocationPlanner: React.FC<ResourceAllocationPlannerProps> = ({
  region,
  onApplyScenario,
  onClose
}) => {
  useViewRenderTracker('Resource Allocation Planner');

  const [targetYear, setTargetYear] = useState<number>(2030);
  const [appliedPresetId, setAppliedPresetId] = useState<string>('balanced');
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);
  const [snapshotSuccessToast, setSnapshotSuccessToast] = useState<string | null>(null);

  // Local Autosave State & Persistence
  const autosaveKey = useMemo(() => `bioregional_alloc_planner_autosave_${region.regionId}`, [region.regionId]);
  const checkpointsKey = useMemo(() => `bioregional_alloc_checkpoints_${region.regionId}`, [region.regionId]);
  const [lastAutosavedAt, setLastAutosavedAt] = useState<string | null>(null);
  const [hasRestorableDraft, setHasRestorableDraft] = useState<boolean>(false);
  const [restorableDraftData, setRestorableDraftData] = useState<{
    targetYear: number;
    allocations: ResourceFlowAllocation[];
    appliedPresetId: string;
    timestamp: string;
  } | null>(null);
  const [draftBannerDismissed, setDraftBannerDismissed] = useState<boolean>(false);
  const [chartMetric, setChartMetric] = useState<'flourishing' | 'water' | 'carbon' | 'circularity' | 'dual'>('flourishing');
  const [showStatusQuoBaseline, setShowStatusQuoBaseline] = useState<boolean>(true);

  // Snapshot Management States
  const [snapshots, setSnapshots] = useState<ScenarioSnapshot[]>([
    {
      id: 'snap-baseline',
      name: 'Baseline 2026 Hydro-Carbon Transect',
      timestamp: 'Sep 4, 12:00',
      targetYear: 2030,
      presetName: 'Status Quo Baseline Equilibrium',
      allocations: region.resourceFlows.map((flow) => {
        let category: ResourceFlowAllocation['category'] = 'hydrological';
        if (flow.category.toLowerCase().includes('carbon')) category = 'carbon';
        else if (flow.category.toLowerCase().includes('energy')) category = 'energy';
        else if (flow.category.toLowerCase().includes('soil') || flow.category.toLowerCase().includes('nutrient')) category = 'nutrient';
        return {
          flowId: flow.id,
          title: flow.title,
          category,
          baselineRate: flow.flowRate,
          unit: flow.flowUnit,
          currentAllocationMultiplier: 1.0,
          targetCircularityPct: flow.circularityPct,
          rationale: flow.description
        };
      }),
      projections: {
        projectedFlourishingScore: 78.4,
        scoreDelta: 0.0,
        projectedWaterYieldM3: 1.48,
        waterYieldDeltaPct: 0,
        projectedCarbonRate: 4.20,
        carbonDeltaPct: 0,
        avgCircularity: 88.0,
        unmeteredLossPct: 12.0,
        lossReductionPct: 0
      }
    }
  ]);
  const [customSnapshotName, setCustomSnapshotName] = useState<string>('');
  const [comparingSnapshotId, setComparingSnapshotId] = useState<string | null>(null);
  const [isSnapshotDrawerOpen, setIsSnapshotDrawerOpen] = useState<boolean>(false);

  // Initial allocations derived from region.resourceFlows
  const [allocations, setAllocations] = useState<ResourceFlowAllocation[]>(() => {
    return region.resourceFlows.map((flow) => {
      let category: ResourceFlowAllocation['category'] = 'hydrological';
      if (flow.category.toLowerCase().includes('carbon')) category = 'carbon';
      else if (flow.category.toLowerCase().includes('energy')) category = 'energy';
      else if (flow.category.toLowerCase().includes('soil') || flow.category.toLowerCase().includes('nutrient')) category = 'nutrient';

      return {
        flowId: flow.id,
        title: flow.title,
        category,
        baselineRate: flow.flowRate,
        unit: flow.flowUnit,
        currentAllocationMultiplier: 1.0,
        targetCircularityPct: flow.circularityPct,
        rationale: flow.description
      };
    });
  });

  // Check for existing saved draft on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(autosaveKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.allocations) && parsed.allocations.length > 0) {
          setRestorableDraftData(parsed);
          setHasRestorableDraft(true);
        }
      }
    } catch {
      // ignore localStorage parse errors
    }

    try {
      const storedCheckpoints = localStorage.getItem(checkpointsKey);
      if (storedCheckpoints) {
        const parsed = JSON.parse(storedCheckpoints);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSnapshots(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [autosaveKey, checkpointsKey]);

  // Autosave to localStorage on allocation or configuration change
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const draftPayload = {
          targetYear,
          appliedPresetId,
          allocations,
          timestamp: timeStr,
          epoch: now.getTime()
        };
        localStorage.setItem(autosaveKey, JSON.stringify(draftPayload));
        setLastAutosavedAt(timeStr);
      } catch (err) {
        console.warn('Autosave to localStorage failed:', err);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [allocations, targetYear, appliedPresetId, autosaveKey]);

  // Restore draft handler
  const handleRestoreAutosaveDraft = () => {
    if (!restorableDraftData) return;
    audioFeedback.playSuccess();
    setTargetYear(restorableDraftData.targetYear || 2030);
    setAppliedPresetId(restorableDraftData.appliedPresetId || 'custom');
    setAllocations(restorableDraftData.allocations);
    setHasRestorableDraft(false);
    setSnapshotSuccessToast(`Restored simulation draft from ${restorableDraftData.timestamp}`);
    setTimeout(() => setSnapshotSuccessToast(null), 3500);
  };

  // Discard draft handler
  const handleDiscardAutosaveDraft = () => {
    audioFeedback.playMicroTick();
    try {
      localStorage.removeItem(autosaveKey);
    } catch {
      // ignore
    }
    setHasRestorableDraft(false);
    setRestorableDraftData(null);
    setLastAutosavedAt(null);
  };

  // What-If Presets
  const PRESETS: WhatIfScenarioPreset[] = useMemo(() => [
    {
      id: 'balanced',
      name: 'Status Quo Baseline Equilibrium',
      description: 'Maintains current telemetry-calibrated baseline flows with standard historical replenishment rate.',
      badge: 'Baseline',
      allocations: {}
    },
    {
      id: 'drought_resilience',
      name: 'Drought Resilience & Baseflow Defense',
      description: 'Prioritizes subsoil retention swales, throttles industrial water withdrawals, and maximizes aquifer infiltration.',
      badge: '+34% Water Security',
      allocations: {
        'flow-mara-01': { multiplier: 1.25, circularity: 96 },
        'flow-mara-02': { multiplier: 1.45, circularity: 98 },
        'flow-mara-03': { multiplier: 0.75, circularity: 92 },
        'flow-ab-01': { multiplier: 1.30, circularity: 95 }
      }
    },
    {
      id: 'carbon_sponge',
      name: 'Maximum Humus Carbon Sponge',
      description: 'Maximizes biochar-inoculated compost cycling, expands mycorrhizal fungi conduits, and regenerates deep topsoil.',
      badge: '+42% Carbon Drawdown',
      allocations: {
        'flow-mara-04': { multiplier: 1.65, circularity: 97 },
        'flow-ab-02': { multiplier: 1.50, circularity: 96 },
        'flow-mara-02': { multiplier: 1.35, circularity: 95 }
      }
    },
    {
      id: 'closed_loop',
      name: 'Zero-Waste Closed-Loop Circularity',
      description: 'Reroutes 100% of urban and agricultural runoff through vetiver pocket wetlands, slashing unmetered leakage to <4%.',
      badge: '98% Circularity',
      allocations: {
        'flow-mara-01': { multiplier: 1.15, circularity: 99 },
        'flow-mara-02': { multiplier: 1.30, circularity: 98 },
        'flow-mara-03': { multiplier: 1.20, circularity: 97 },
        'flow-mara-04': { multiplier: 1.40, circularity: 99 }
      }
    }
  ], []);

  // Apply a preset scenario
  const handleApplyPreset = (preset: WhatIfScenarioPreset) => {
    setAppliedPresetId(preset.id);
    audioFeedback.playSubtleClick();

    setAllocations((prev) =>
      prev.map((item) => {
        const override = preset.allocations[item.flowId];
        if (override) {
          return {
            ...item,
            currentAllocationMultiplier: override.multiplier,
            targetCircularityPct: override.circularity
          };
        }
        if (preset.id === 'balanced') {
          return {
            ...item,
            currentAllocationMultiplier: 1.0,
            targetCircularityPct: region.resourceFlows.find((f) => f.id === item.flowId)?.circularityPct ?? 88
          };
        }
        return item;
      })
    );
  };

  // Handle individual slider adjustments
  const handleUpdateMultiplier = (flowId: string, multiplier: number) => {
    setAppliedPresetId('custom');
    setAllocations((prev) =>
      prev.map((item) => (item.flowId === flowId ? { ...item, currentAllocationMultiplier: multiplier } : item))
    );
  };

  const handleUpdateCircularity = (flowId: string, circularity: number) => {
    setAppliedPresetId('custom');
    setAllocations((prev) =>
      prev.map((item) => (item.flowId === flowId ? { ...item, targetCircularityPct: circularity } : item))
    );
  };

  // Reset to initial baseline
  const handleReset = () => {
    audioFeedback.playSubtleClick();
    const balancedPreset = PRESETS.find((p) => p.id === 'balanced')!;
    handleApplyPreset(balancedPreset);
  };

  // Core Forecasting Logic: Calculate projected impact on future ecological health metrics
  const projectionResults = useMemo(() => {
    // 1. Average multiplier across categories
    let waterWeight = 0;
    let waterCount = 0;
    let carbonWeight = 0;
    let carbonCount = 0;
    let totalCircularity = 0;

    allocations.forEach((alloc) => {
      totalCircularity += alloc.targetCircularityPct;
      if (alloc.category === 'hydrological') {
        waterWeight += alloc.currentAllocationMultiplier;
        waterCount++;
      } else {
        carbonWeight += alloc.currentAllocationMultiplier;
        carbonCount++;
      }
    });

    const avgWaterMultiplier = waterCount > 0 ? waterWeight / waterCount : 1.0;
    const avgCarbonMultiplier = carbonCount > 0 ? carbonWeight / carbonCount : 1.0;
    const avgCircularity = +(totalCircularity / allocations.length).toFixed(1);

    // Baseline Flourishing Score
    const baselineScore = 78.4;
    const yearsForward = targetYear - 2026;

    // Forecasting formula: Compound growth based on circularity and resource reallocation
    const circularityBonus = (avgCircularity - 88) * 0.35;
    const allocationBonus = ((avgWaterMultiplier - 1.0) * 8.5) + ((avgCarbonMultiplier - 1.0) * 10.2);
    const temporalCompounding = 1 + (yearsForward * 0.024);

    const projectedFlourishingScore = Math.min(
      99.2,
      Math.max(45.0, +(baselineScore + (circularityBonus + allocationBonus) * temporalCompounding).toFixed(1))
    );

    // Projected Water Yield (in Millions m³/yr)
    const baselineWaterYieldM3 = 1.48; // Millions m³/yr
    const projectedWaterYieldM3 = +(baselineWaterYieldM3 * (1 + (avgWaterMultiplier - 1.0) * 0.65) * (1 + yearsForward * 0.018)).toFixed(2);

    // Projected Carbon Rate (in k tCO2e/yr)
    const baselineCarbonRate = 4.2; // k tCO2e/yr
    const projectedCarbonRate = +(baselineCarbonRate * (1 + (avgCarbonMultiplier - 1.0) * 0.85) * (1 + yearsForward * 0.032)).toFixed(2);

    // Unmetered Dissipation / Leakage
    const unmeteredLossPct = +(100 - avgCircularity).toFixed(1);
    const baselineLossPct = 12.0;
    const lossReductionPct = +(((baselineLossPct - unmeteredLossPct) / baselineLossPct) * 100).toFixed(0);

    return {
      projectedFlourishingScore,
      scoreDelta: +(projectedFlourishingScore - baselineScore).toFixed(1),
      avgWaterMultiplier,
      projectedWaterYieldM3,
      waterYieldDeltaPct: +(((projectedWaterYieldM3 - baselineWaterYieldM3) / baselineWaterYieldM3) * 100).toFixed(0),
      avgCarbonMultiplier,
      projectedCarbonRate,
      carbonDeltaPct: +(((projectedCarbonRate - baselineCarbonRate) / baselineCarbonRate) * 100).toFixed(0),
      avgCircularity,
      unmeteredLossPct,
      lossReductionPct
    };
  }, [allocations, targetYear]);

  // 5-Year Real-Time Predictive Timeline Dataset for Recharts
  const predictive5YearTimeline = useMemo(() => {
    const years = [2026, 2027, 2028, 2029, 2030];
    const baseScore = 78.4;
    const baseWater = 1.48;
    const baseCarbon = 4.20;
    const baseCircularity = 88.0;

    const finalTargetDeltaScore = projectionResults.projectedFlourishingScore - baseScore;
    const finalTargetDeltaWater = projectionResults.projectedWaterYieldM3 - baseWater;
    const finalTargetDeltaCarbon = projectionResults.projectedCarbonRate - baseCarbon;
    const finalTargetDeltaCirc = projectionResults.avgCircularity - baseCircularity;

    return years.map((yr, idx) => {
      // Non-linear ecological maturation curve (smoothstep S-curve progress)
      const t = idx / 4; // 0 to 1
      const sCurve = t * t * (3 - 2 * t);

      // Simulated Trajectory
      const flourishingScore = +(baseScore + finalTargetDeltaScore * sCurve).toFixed(1);
      const waterYieldM3 = +(baseWater + finalTargetDeltaWater * sCurve).toFixed(2);
      const carbonRateTonnes = +(baseCarbon + finalTargetDeltaCarbon * sCurve).toFixed(2);
      const circularityPct = +(baseCircularity + finalTargetDeltaCirc * sCurve).toFixed(1);

      // Status Quo Baseline (climate stress baseline drift without interventions)
      const climateStressDrift = idx * 0.32;
      const flourishingBaseline = +(baseScore - climateStressDrift).toFixed(1);
      const waterBaseline = +(baseWater * (1 - idx * 0.015)).toFixed(2);
      const carbonBaseline = +(baseCarbon * (1 - idx * 0.012)).toFixed(2);
      const circularityBaseline = +(baseCircularity - idx * 0.4).toFixed(1);

      const deltaVsStatusQuo = +(flourishingScore - flourishingBaseline).toFixed(1);

      return {
        year: yr,
        yearLabel: `${yr}`,
        flourishingScore,
        flourishingBaseline,
        waterYieldM3,
        waterBaseline,
        carbonRateTonnes,
        carbonBaseline,
        circularityPct,
        circularityBaseline,
        deltaVsStatusQuo,
        targetBoundary: 85.0
      };
    });
  }, [projectionResults]);

  // Apply to ledger handler
  const handleCommitScenario = () => {
    audioFeedback.playSubtleClick();
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 2500);

    if (onApplyScenario) {
      const activePreset = PRESETS.find((p) => p.id === appliedPresetId);
      const title = activePreset ? activePreset.name : 'Custom Reallocation Scenario';
      onApplyScenario(
        projectionResults.projectedFlourishingScore,
        projectionResults.avgWaterMultiplier,
        projectionResults.avgCarbonMultiplier,
        title
      );
    }
  };

  // Snapshot & Checkpoint Management Handlers
  const handleSaveSnapshot = (nameOverride?: string) => {
    audioFeedback.playSuccess();
    hapticFeedback.triggerHighStakesHaptic();
    const activePreset = PRESETS.find((p) => p.id === appliedPresetId);
    const presetLabel = activePreset ? activePreset.name : 'Custom Allocation Baseline';
    const now = new Date();
    const dateFormatted = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const finalName = (nameOverride || customSnapshotName).trim() || `Checkpoint: ${presetLabel} (${dateFormatted} ${timeFormatted})`;

    const newSnapshot: ScenarioSnapshot = {
      id: `checkpoint-${Date.now()}`,
      name: finalName,
      timestamp: `${dateFormatted}, ${timeFormatted}`,
      targetYear,
      presetName: presetLabel,
      allocations: JSON.parse(JSON.stringify(allocations)),
      projections: { ...projectionResults }
    };

    setSnapshots((prev) => {
      const nextList = [newSnapshot, ...prev];
      try {
        localStorage.setItem(checkpointsKey, JSON.stringify(nextList));
      } catch (err) {
        console.warn('Failed to persist checkpoint to localStorage:', err);
      }
      return nextList;
    });

    setCustomSnapshotName('');
    setSnapshotSuccessToast(`Manual Checkpoint Saved: "${finalName}" (Persisted in Local Storage)`);
    setTimeout(() => setSnapshotSuccessToast(null), 3500);
  };

  const handleRevertToSnapshot = (snapshot: ScenarioSnapshot) => {
    audioFeedback.playSubtleClick();
    hapticFeedback.triggerHighStakesHaptic();
    setTargetYear(snapshot.targetYear);
    setAllocations(JSON.parse(JSON.stringify(snapshot.allocations)));
    setAppliedPresetId('custom');
    setSnapshotSuccessToast(`Reverted configuration to Checkpoint: "${snapshot.name}"`);
    setTimeout(() => setSnapshotSuccessToast(null), 3500);
  };

  const handleDeleteSnapshot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioFeedback.playMicroTick();
    setSnapshots((prev) => {
      const nextList = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(checkpointsKey, JSON.stringify(nextList));
      } catch {
        // ignore
      }
      return nextList;
    });
    if (comparingSnapshotId === id) setComparingSnapshotId(null);
  };

  const handleToggleCompare = (id: string) => {
    audioFeedback.playSubtleClick();
    setComparingSnapshotId((prev) => (prev === id ? null : id));
  };

  const comparedSnapshot = useMemo(() => {
    if (!comparingSnapshotId) return null;
    return snapshots.find((s) => s.id === comparingSnapshotId) || null;
  }, [comparingSnapshotId, snapshots]);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#090D0A] border border-cyan-500/40 shadow-2xl space-y-5 font-mono text-xs text-[#F5F5F0]">
      {/* Toast Notification */}
      {snapshotSuccessToast && (
        <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{snapshotSuccessToast}</span>
          </div>
          <button
            onClick={() => setSnapshotSuccessToast(null)}
            className="text-emerald-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Local Autosave Recovery Banner */}
      {hasRestorableDraft && !draftBannerDismissed && restorableDraftData && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#0F1E14] via-[#0A160F] to-[#07100B] border-2 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
              <Clock className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">Unsaved Draft Detected in Local Storage</span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  {restorableDraftData.timestamp}
                </span>
              </div>
              <p className="text-[10px] text-neutral-300 font-sans mt-0.5">
                An active simulation draft for {region.regionName} was preserved locally (Horizon {restorableDraftData.targetYear}, {restorableDraftData.allocations.length} custom flows). Restore where you left off?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={handleRestoreAutosaveDraft}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] flex items-center gap-1.5 cursor-pointer shadow transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restore Draft</span>
            </button>
            <button
              onClick={handleDiscardAutosaveDraft}
              className="px-2.5 py-1.5 rounded-lg bg-[#141A15] hover:bg-rose-950/60 text-neutral-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 text-[11px] cursor-pointer transition-all"
            >
              Discard
            </button>
            <button
              onClick={() => setDraftBannerDismissed(true)}
              className="p-1 text-neutral-500 hover:text-white"
              title="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#F5F5F0]/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-cyan-950/70 text-cyan-400 border border-cyan-500/40">
            <Sliders className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-white text-base sm:text-lg tracking-wide">
                Resource Allocation Planner & What-If Simulator
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                Autoregressive Forecast Logic
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/70 font-sans mt-0.5">
              Simulate dynamic biophysical resource reallocations across metabolic conduits to forecast future ecological flourishing, water yields, and carbon drawdown.
            </p>
          </div>
        </div>

        {/* Right Header Controls: Local Autosave Badge + Snapshots Drawer Button + Horizon Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          {/* Autosave Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0E1511] border border-emerald-500/30 text-[10px]">
            <Save className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-neutral-400">Autosave:</span>
            <span className="text-emerald-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {lastAutosavedAt ? lastAutosavedAt : 'Active'}
            </span>
          </div>

          {/* Manual Checkpoint Creator */}
          <button
            id="create-manual-checkpoint-btn"
            onClick={() => handleSaveSnapshot()}
            title="Create a manual checkpoint snapshot of the current state"
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 font-bold text-[10px] flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
          >
            <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
            <span>Create Checkpoint</span>
          </button>

          {/* Snapshots Toggle */}
          <button
            onClick={() => {
              setIsSnapshotDrawerOpen(!isSnapshotDrawerOpen);
              audioFeedback.playSubtleClick();
            }}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isSnapshotDrawerOpen
                ? 'bg-[#C5A059] text-black border-[#C5A059] font-extrabold shadow'
                : 'bg-[#121914] text-[#C5A059] border-[#C5A059]/40 hover:border-[#C5A059]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Snapshots ({snapshots.length})</span>
          </button>

          {/* Year Target Horizon Switcher */}
          <div className="flex items-center gap-1.5 bg-[#121914] p-1 rounded-lg border border-[#F5F5F0]/10">
            <span className="text-[10px] uppercase text-neutral-400 px-1 font-bold">Horizon:</span>
            {[2028, 2030, 2035].map((yr) => (
              <button
                key={yr}
                onClick={() => {
                  setTargetYear(yr);
                  audioFeedback.playMicroTick();
                }}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  targetYear === yr ? 'bg-cyan-500 text-black shadow font-extrabold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Snapshots Drawer & Manager */}
      {isSnapshotDrawerOpen && (
        <div className="p-4 rounded-xl bg-[#090F0C] border border-[#C5A059]/40 space-y-4 animate-in fade-in zoom-in-95 duration-150 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#C5A059]" />
              <span className="font-bold text-sm text-[#C5A059]">Scenario Snapshots & State Rollbacks</span>
              <span className="text-[10px] text-neutral-400 font-sans">
                Capture past simulation configurations to revert or compare side-by-side
              </span>
            </div>
            <button
              onClick={() => setIsSnapshotDrawerOpen(false)}
              className="text-neutral-400 hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Save Current State Input */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap bg-[#121A15] p-2.5 rounded-lg border border-[#F5F5F0]/10">
            <Bookmark className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              placeholder="Label this snapshot (e.g. Drought Swale 2030, Carbon Surge)..."
              value={customSnapshotName}
              onChange={(e) => setCustomSnapshotName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveSnapshot()}
              className="flex-1 bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => handleSaveSnapshot()}
              className="px-3.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Snapshot</span>
            </button>
          </div>

          {/* Saved Snapshots Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {snapshots.map((snap) => {
              const isBeingCompared = comparingSnapshotId === snap.id;
              return (
                <div
                  key={snap.id}
                  className={`p-3 rounded-lg border transition-all flex flex-col justify-between gap-2.5 ${
                    isBeingCompared
                      ? 'bg-[#15231B] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-[#101712] border-[#F5F5F0]/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Bookmark className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-bold text-white text-xs truncate">{snap.name}</span>
                      </div>
                      <span className="px-1.5 py-0.2 rounded text-[8px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 shrink-0 font-mono">
                        Saved Locally
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 flex-wrap">
                      <span className="text-cyan-400 font-bold">Epoch {snap.targetYear}</span>
                      <span>•</span>
                      <span className="text-emerald-300 font-bold">
                        Score: {snap.projections.projectedFlourishingScore}/100
                      </span>
                      <span>•</span>
                      <span>Circularity: {snap.projections.avgCircularity}%</span>
                      <span>•</span>
                      <span className="text-neutral-500">{snap.timestamp}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleCompare(snap.id)}
                        className={`px-2 py-1 rounded font-bold cursor-pointer transition-all flex items-center gap-1 border ${
                          isBeingCompared
                            ? 'bg-cyan-500 text-black border-cyan-400 font-extrabold'
                            : 'bg-white/5 text-neutral-300 border-white/10 hover:border-cyan-400 hover:text-cyan-300'
                        }`}
                      >
                        <GitCompare className="w-3 h-3" />
                        <span>{isBeingCompared ? 'Comparing' : 'Compare'}</span>
                      </button>

                      <button
                        onClick={() => handleRevertToSnapshot(snap)}
                        title="Revert to this checkpoint configuration"
                        className="px-2 py-1 rounded font-bold bg-emerald-950/40 hover:bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500 cursor-pointer transition-all flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3 text-emerald-400" />
                        <span>Revert</span>
                      </button>
                    </div>

                    <button
                      onClick={(e) => handleDeleteSnapshot(snap.id, e)}
                      title="Delete Snapshot"
                      className="p-1 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Matrix */}
      {comparedSnapshot && (
        <div className="p-4 rounded-xl bg-[#09120D] border-2 border-cyan-400/80 shadow-2xl space-y-3.5 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-sm text-cyan-300">
                Side-by-Side Scenario Comparison
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono">
                Live Simulation vs. Snapshot
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRevertToSnapshot(comparedSnapshot)}
                className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[10px] cursor-pointer flex items-center gap-1 shadow"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Revert to this Snapshot</span>
              </button>
              <button
                onClick={() => setComparingSnapshotId(null)}
                className="text-neutral-400 hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Comparison Dual Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Column 1: Current Live Projections */}
            <div className="p-3.5 rounded-lg bg-[#0F1B14] border border-cyan-500/40 space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="font-bold text-cyan-300 uppercase text-[10px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Current Live Projections (Horizon {targetYear})
                </span>
                <span className="text-[9px] text-neutral-400">
                  {appliedPresetId !== 'custom' ? `Preset: ${appliedPresetId}` : 'Custom Tuned'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-neutral-400 block text-[9px]">Flourishing Score:</span>
                  <span className="text-lg font-bold text-emerald-300">
                    {projectionResults.projectedFlourishingScore}/100
                  </span>
                  <span className="text-emerald-400 ml-1 font-bold">
                    ({projectionResults.scoreDelta >= 0 ? `+${projectionResults.scoreDelta}` : projectionResults.scoreDelta})
                  </span>
                </div>

                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-neutral-400 block text-[9px]">Annual Water Yield:</span>
                  <span className="text-lg font-bold text-cyan-300">
                    {projectionResults.projectedWaterYieldM3}M m³
                  </span>
                  <span className="text-cyan-400 ml-1 font-bold">
                    (+{projectionResults.waterYieldDeltaPct}%)
                  </span>
                </div>

                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-neutral-400 block text-[9px]">Carbon Drawdown Rate:</span>
                  <span className="text-lg font-bold text-amber-300">
                    {projectionResults.projectedCarbonRate}k tCO2e
                  </span>
                  <span className="text-amber-400 ml-1 font-bold">
                    (+{projectionResults.carbonDeltaPct}%)
                  </span>
                </div>

                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-neutral-400 block text-[9px]">Metabolic Circularity:</span>
                  <span className="text-lg font-bold text-purple-300">
                    {projectionResults.avgCircularity}%
                  </span>
                  <span className="text-purple-400 ml-1 font-bold">
                    (-{projectionResults.unmeteredLossPct}% loss)
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Selected Snapshot Projections */}
            <div className="p-3.5 rounded-lg bg-[#141A15] border border-[#C5A059]/40 space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="font-bold text-[#C5A059] uppercase text-[10px] flex items-center gap-1.5 truncate">
                  <Bookmark className="w-3.5 h-3.5 text-[#C5A059]" />
                  {comparedSnapshot.name}
                </span>
                <span className="text-[9px] text-neutral-400 shrink-0">
                  Horizon {comparedSnapshot.targetYear} • {comparedSnapshot.timestamp}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-neutral-400 block text-[9px]">Flourishing Score:</span>
                  <span className="text-lg font-bold text-emerald-300">
                    {comparedSnapshot.projections.projectedFlourishingScore}/100
                  </span>
                  {/* Delta vs Current */}
                  {(() => {
                    const diff = +(comparedSnapshot.projections.projectedFlourishingScore - projectionResults.projectedFlourishingScore).toFixed(1);
                    return (
                      <span className={`text-[9px] ml-1.5 font-bold ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {diff >= 0 ? `+${diff}` : diff} vs current
                      </span>
                    );
                  })()}
                </div>

                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-neutral-400 block text-[9px]">Annual Water Yield:</span>
                  <span className="text-lg font-bold text-cyan-300">
                    {comparedSnapshot.projections.projectedWaterYieldM3}M m³
                  </span>
                  {(() => {
                    const diff = +(comparedSnapshot.projections.projectedWaterYieldM3 - projectionResults.projectedWaterYieldM3).toFixed(2);
                    return (
                      <span className={`text-[9px] ml-1.5 font-bold ${diff >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                        {diff >= 0 ? `+${diff}` : diff}M vs curr
                      </span>
                    );
                  })()}
                </div>

                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-neutral-400 block text-[9px]">Carbon Drawdown Rate:</span>
                  <span className="text-lg font-bold text-amber-300">
                    {comparedSnapshot.projections.projectedCarbonRate}k tCO2e
                  </span>
                  {(() => {
                    const diff = +(comparedSnapshot.projections.projectedCarbonRate - projectionResults.projectedCarbonRate).toFixed(2);
                    return (
                      <span className={`text-[9px] ml-1.5 font-bold ${diff >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {diff >= 0 ? `+${diff}` : diff}k vs curr
                      </span>
                    );
                  })()}
                </div>

                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-neutral-400 block text-[9px]">Metabolic Circularity:</span>
                  <span className="text-lg font-bold text-purple-300">
                    {comparedSnapshot.projections.avgCircularity}%
                  </span>
                  {(() => {
                    const diff = +(comparedSnapshot.projections.avgCircularity - projectionResults.avgCircularity).toFixed(1);
                    return (
                      <span className={`text-[9px] ml-1.5 font-bold ${diff >= 0 ? 'text-purple-400' : 'text-rose-400'}`}>
                        {diff >= 0 ? `+${diff}%` : `${diff}%`} vs curr
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5-Year Real-Time Predictive Trend Chart Panel */}
      <div className="p-4 rounded-xl bg-[#090F0C] border border-cyan-500/40 shadow-xl space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
              <Activity className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-white tracking-wide">
                  5-Year Real-Time Predictive Ecological Trajectory
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  2026 – 2030 Timeline
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
                Simulated autoregressive response curves reacting live to flow reallocations and circularity targets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            {/* Baseline toggle */}
            <button
              onClick={() => {
                setShowStatusQuoBaseline(!showStatusQuoBaseline);
                audioFeedback.playMicroTick();
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                showStatusQuoBaseline
                  ? 'bg-neutral-800 text-neutral-200 border-neutral-600'
                  : 'bg-black/40 text-neutral-500 border-white/10'
              }`}
            >
              Baseline: {showStatusQuoBaseline ? 'ON' : 'OFF'}
            </button>

            {/* Metric Mode Switcher */}
            <div className="flex items-center gap-1 bg-[#121914] p-1 rounded-lg border border-white/10">
              {[
                { id: 'flourishing', label: 'Flourishing' },
                { id: 'water', label: 'Water Yield' },
                { id: 'carbon', label: 'Carbon Rate' },
                { id: 'circularity', label: 'Circularity' },
                { id: 'dual', label: 'Dual View' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setChartMetric(m.id as any);
                    audioFeedback.playMicroTick();
                  }}
                  className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                    chartMetric === m.id
                      ? 'bg-cyan-500 text-black shadow font-extrabold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Predictive Trend Chart Canvas */}
        <div className="w-full h-56 relative">
          <ResponsiveContainer width="100%" height="100%">
            {chartMetric === 'dual' ? (
              <LineChart data={predictive5YearTimeline} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#253528" opacity={0.5} />
                <XAxis dataKey="year" stroke="#688070" tick={{ fill: '#8FA895', fontSize: 10 }} />
                <YAxis yAxisId="left" domain={[50, 100]} stroke="#10b981" tick={{ fill: '#10b981', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" domain={[1.0, 3.0]} stroke="#06b6d4" tick={{ fill: '#06b6d4', fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-lg bg-black/90 border border-cyan-500/50 shadow-2xl backdrop-blur-md text-[10px] space-y-1">
                          <div className="font-bold text-white border-b border-white/10 pb-1 flex justify-between">
                            <span>Epoch Year {label}</span>
                            <span className="text-cyan-400">Δ vs Status Quo: +{data.deltaVsStatusQuo}</span>
                          </div>
                          <div className="flex justify-between gap-3 text-emerald-400">
                            <span>Flourishing Score:</span>
                            <span className="font-bold">{data.flourishingScore} / 100</span>
                          </div>
                          <div className="flex justify-between gap-3 text-cyan-300">
                            <span>Annual Water Yield:</span>
                            <span className="font-bold">{data.waterYieldM3}M m³</span>
                          </div>
                          <div className="flex justify-between gap-3 text-amber-300">
                            <span>Carbon Drawdown:</span>
                            <span className="font-bold">{data.carbonRateTonnes}k tCO2e</span>
                          </div>
                          <div className="flex justify-between gap-3 text-purple-300">
                            <span>Circularity:</span>
                            <span className="font-bold">{data.circularityPct}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine yAxisId="left" y={85.0} stroke="#C5A059" strokeDasharray="3 3" />
                <Line yAxisId="left" type="monotone" dataKey="flourishingScore" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} name="Flourishing Score" />
                {showStatusQuoBaseline && (
                  <Line yAxisId="left" type="monotone" dataKey="flourishingBaseline" stroke="#6b7280" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="Status Quo Baseline" />
                )}
                <Line yAxisId="right" type="monotone" dataKey="waterYieldM3" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 3, fill: '#06b6d4' }} name="Water Yield (M m³)" />
              </LineChart>
            ) : (
              <AreaChart
                data={predictive5YearTimeline}
                margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="allocSimulatedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartMetric === 'water' ? '#06b6d4' : chartMetric === 'carbon' ? '#f59e0b' : chartMetric === 'circularity' ? '#a855f7' : '#10b981'} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={chartMetric === 'water' ? '#06b6d4' : chartMetric === 'carbon' ? '#f59e0b' : chartMetric === 'circularity' ? '#a855f7' : '#10b981'} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="allocBaselineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4b5563" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4b5563" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#253528" opacity={0.5} />
                <XAxis dataKey="year" stroke="#688070" tick={{ fill: '#8FA895', fontSize: 10 }} />
                <YAxis
                  stroke="#688070"
                  tick={{ fill: '#8FA895', fontSize: 10 }}
                  domain={
                    chartMetric === 'water'
                      ? [1.2, 'auto']
                      : chartMetric === 'carbon'
                      ? [3.5, 'auto']
                      : chartMetric === 'circularity'
                      ? [70, 100]
                      : [60, 100]
                  }
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const currentVal = chartMetric === 'water'
                        ? `${data.waterYieldM3}M m³`
                        : chartMetric === 'carbon'
                        ? `${data.carbonRateTonnes}k tCO2e`
                        : chartMetric === 'circularity'
                        ? `${data.circularityPct}%`
                        : `${data.flourishingScore}/100`;

                      const baseVal = chartMetric === 'water'
                        ? `${data.waterBaseline}M m³`
                        : chartMetric === 'carbon'
                        ? `${data.carbonBaseline}k tCO2e`
                        : chartMetric === 'circularity'
                        ? `${data.circularityBaseline}%`
                        : `${data.flourishingBaseline}/100`;

                      return (
                        <div className="p-2.5 rounded-lg bg-black/90 border border-cyan-500/50 shadow-2xl backdrop-blur-md text-[10px] space-y-1">
                          <div className="font-bold text-white border-b border-white/10 pb-1 flex justify-between">
                            <span>Year {label} Forecast</span>
                            <span className="text-cyan-400 font-bold">Δ vs Baseline: +{data.deltaVsStatusQuo} pts</span>
                          </div>
                          <div className="flex justify-between gap-4 text-white">
                            <span className="text-cyan-300">Simulated Trajectory:</span>
                            <span className="font-bold text-cyan-200">{currentVal}</span>
                          </div>
                          {showStatusQuoBaseline && (
                            <div className="flex justify-between gap-4 text-neutral-400">
                              <span>Status Quo Baseline:</span>
                              <span className="font-mono">{baseVal}</span>
                            </div>
                          )}
                          <div className="text-[8px] text-emerald-400 pt-0.5 border-t border-white/5">
                            {data.flourishingScore >= 85 ? '✦ Planetary Boundary Satisfied' : '● Regenerative Transition Path'}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {chartMetric === 'flourishing' && (
                  <ReferenceLine y={85.0} stroke="#C5A059" strokeDasharray="3 3" />
                )}
                {showStatusQuoBaseline && (
                  <Area
                    type="monotone"
                    dataKey={
                      chartMetric === 'water'
                        ? 'waterBaseline'
                        : chartMetric === 'carbon'
                        ? 'carbonBaseline'
                        : chartMetric === 'circularity'
                        ? 'circularityBaseline'
                        : 'flourishingBaseline'
                    }
                    stroke="#6b7280"
                    strokeDasharray="4 4"
                    fill="url(#allocBaselineGradient)"
                    strokeWidth={1.5}
                    name="Status Quo"
                  />
                )}
                <Area
                  type="monotone"
                  dataKey={
                    chartMetric === 'water'
                      ? 'waterYieldM3'
                      : chartMetric === 'carbon'
                      ? 'carbonRateTonnes'
                      : chartMetric === 'circularity'
                      ? 'circularityPct'
                      : 'flourishingScore'
                  }
                  stroke={chartMetric === 'water' ? '#06b6d4' : chartMetric === 'carbon' ? '#f59e0b' : chartMetric === 'circularity' ? '#a855f7' : '#10b981'}
                  fill="url(#allocSimulatedGradient)"
                  strokeWidth={2.5}
                  name="Simulated Allocation"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* 5-Year Trajectory Milestones Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-[#F5F5F0]/10 text-[9px] font-mono">
          {predictive5YearTimeline.map((item) => (
            <div key={item.year} className="p-2 rounded bg-black/40 border border-white/5 space-y-0.5">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="font-bold text-white">{item.year}</span>
                <span className={`text-[8px] font-bold ${item.deltaVsStatusQuo >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  +{item.deltaVsStatusQuo}
                </span>
              </div>
              <div className="text-emerald-300 font-bold text-xs">
                {item.flourishingScore}
                <span className="text-[8px] font-normal text-neutral-400">/100</span>
              </div>
              <div className="text-neutral-400 text-[8px]">
                {item.waterYieldM3}M m³ • {item.carbonRateTonnes}k C
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preset What-If Scenarios Grid */}
      <div className="space-y-2">
        <span className="text-[11px] text-[#C5A059] font-bold uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          What-If Scenario Presets:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESETS.map((preset) => {
            const isSelected = appliedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-[#101511] border-[#F5F5F0]/10 text-neutral-400 hover:border-[#F5F5F0]/30 hover:text-neutral-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-serif font-bold text-white text-xs truncate">
                      {preset.name}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                      isSelected ? 'bg-cyan-500 text-black' : 'bg-white/5 text-neutral-400'
                    }`}>
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[10px] font-sans text-neutral-400 leading-snug line-clamp-2">
                    {preset.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[9px] pt-1.5 border-t border-white/10 text-cyan-400/80">
                  <span>{isSelected ? 'Active Preset' : 'Apply Preset'}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Forecast Output Matrix (Dynamic Impacts) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#0C1510] via-[#0E1B15] to-[#0A120E] border border-emerald-500/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-[11px] border-b border-[#F5F5F0]/10 pb-2">
          <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Projected Ecological Health Impact (Epoch {targetYear})
          </span>
          <span className="text-neutral-400 text-[10px]">
            Model: Exponential S-Curve Ecological Recovery
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Flourishing Score Impact */}
          <div className="p-3 rounded-lg bg-[#142018] border border-emerald-500/30">
            <div className="text-[9px] text-neutral-400 uppercase">Composite Flourishing</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-300 mt-0.5 flex items-baseline gap-1">
              <span>{projectionResults.projectedFlourishingScore}</span>
              <span className="text-xs text-neutral-400">/100</span>
              <span className={`text-[10px] font-bold ${projectionResults.scoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {projectionResults.scoreDelta >= 0 ? `+${projectionResults.scoreDelta}` : projectionResults.scoreDelta}
              </span>
            </div>
            <div className="text-[9px] text-emerald-400/80 mt-0.5">
              vs 78.4 Baseline ({targetYear})
            </div>
          </div>

          {/* Water Security Yield */}
          <div className="p-3 rounded-lg bg-[#142018] border border-cyan-500/30">
            <div className="text-[9px] text-neutral-400 uppercase">Annual Water Baseflow</div>
            <div className="text-xl sm:text-2xl font-bold text-cyan-300 mt-0.5 flex items-baseline gap-1">
              <span>{projectionResults.projectedWaterYieldM3}M</span>
              <span className="text-xs text-neutral-400">m³/yr</span>
              <span className="text-[10px] font-bold text-cyan-400">
                +{projectionResults.waterYieldDeltaPct}%
              </span>
            </div>
            <div className="text-[9px] text-cyan-400/80 mt-0.5">
              {((projectionResults.avgWaterMultiplier - 1) * 100).toFixed(0)}% Flow Reallocation
            </div>
          </div>

          {/* Carbon Drawdown */}
          <div className="p-3 rounded-lg bg-[#142018] border border-amber-500/30">
            <div className="text-[9px] text-neutral-400 uppercase">Soil Humus Carbon Sink</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-0.5 flex items-baseline gap-1">
              <span>{projectionResults.projectedCarbonRate}k</span>
              <span className="text-xs text-neutral-400">tCO2e</span>
              <span className="text-[10px] font-bold text-amber-400">
                +{projectionResults.carbonDeltaPct}%
              </span>
            </div>
            <div className="text-[9px] text-amber-400/80 mt-0.5">
              Biochar & Glomalin Acceleration
            </div>
          </div>

          {/* Metabolic Circularity */}
          <div className="p-3 rounded-lg bg-[#142018] border border-purple-500/30">
            <div className="text-[9px] text-neutral-400 uppercase">Metabolic Circularity</div>
            <div className="text-xl sm:text-2xl font-bold text-purple-300 mt-0.5 flex items-baseline gap-1">
              <span>{projectionResults.avgCircularity}%</span>
              <span className="text-[10px] font-bold text-purple-400">
                -{projectionResults.unmeteredLossPct}% loss
              </span>
            </div>
            <div className="text-[9px] text-purple-400/80 mt-0.5">
              {projectionResults.lossReductionPct}% Waste Reduction
            </div>
          </div>
        </div>
      </div>

      {/* Individual Flow Allocation Sliders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#C5A059] font-bold uppercase flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Metabolic Flow Allocation Controls ({allocations.length} Conduits):
          </span>
          <button
            onClick={handleReset}
            className="text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {allocations.map((flow) => {
            const currentFlowRate = +(flow.baselineRate * flow.currentAllocationMultiplier).toFixed(1);
            const deltaPct = +(((flow.currentAllocationMultiplier - 1.0) * 100)).toFixed(0);

            return (
              <div
                key={flow.flowId}
                className="p-3.5 rounded-xl bg-[#111713] border border-[#F5F5F0]/10 hover:border-cyan-500/40 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[8px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                      flow.category === 'hydrological'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                        : flow.category === 'carbon'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-950 text-amber-300 border-amber-500/40'
                    }`}>
                      {flow.category} Conduit
                    </span>
                    <h5 className="font-serif font-bold text-white text-xs mt-1 line-clamp-1">
                      {flow.title}
                    </h5>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-cyan-300">
                      {currentFlowRate} {flow.unit}
                    </div>
                    <div className={`text-[9px] font-bold ${deltaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {deltaPct >= 0 ? `+${deltaPct}%` : `${deltaPct}%`} vs base
                    </div>
                  </div>
                </div>

                {/* Flow Rate Allocation Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-neutral-400">
                    <span>Flow Volume Multiplier:</span>
                    <span className="text-white font-bold">{(flow.currentAllocationMultiplier * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.8"
                    step="0.05"
                    value={flow.currentAllocationMultiplier}
                    onChange={(e) => handleUpdateMultiplier(flow.flowId, Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-[#090D0A] rounded-lg"
                  />
                  <div className="flex justify-between text-[8px] text-neutral-500">
                    <span>-50% Throttled</span>
                    <span>100% (Baseline)</span>
                    <span>+80% Surge</span>
                  </div>
                </div>

                {/* Circularity Target Slider */}
                <div className="space-y-1 pt-1 border-t border-white/5">
                  <div className="flex justify-between text-[9px] text-neutral-400">
                    <span>Target Closed-Loop Circularity:</span>
                    <span className="text-emerald-400 font-bold">{flow.targetCircularityPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="99"
                    step="1"
                    value={flow.targetCircularityPct}
                    onChange={(e) => handleUpdateCircularity(flow.flowId, Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-[#090D0A] rounded-lg"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="p-3 rounded-xl bg-[#121914] border border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[10px] text-neutral-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Mass-balance thermodynamics validated: Zero unmetered phantom allocations.</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onClose && (
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                onClose();
              }}
              className="px-3 py-2 rounded-lg bg-[#171C18] hover:bg-[#202722] text-neutral-300 font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          )}

          <button
            onClick={handleCommitScenario}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            {appliedSuccess ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            <span>{appliedSuccess ? 'Scenario Applied to Ledger!' : 'Apply Scenario to Ledger View'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
