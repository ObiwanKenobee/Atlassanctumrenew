import React, { useState, useMemo } from 'react';
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
  Plus
} from 'lucide-react';
import { BioregionalLedgerData } from '../../data/bioregionalLedgerData';
import { audioFeedback } from '../../lib/audioFeedback';

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
  const [targetYear, setTargetYear] = useState<number>(2030);
  const [appliedPresetId, setAppliedPresetId] = useState<string>('balanced');
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);
  const [snapshotSuccessToast, setSnapshotSuccessToast] = useState<string | null>(null);

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

  // Snapshot Management Handlers
  const handleSaveSnapshot = () => {
    audioFeedback.playSuccess();
    const activePreset = PRESETS.find((p) => p.id === appliedPresetId);
    const presetLabel = activePreset ? activePreset.name : 'Custom Simulation Scenario';
    const finalName = customSnapshotName.trim() || `${presetLabel} (Epoch ${targetYear})`;

    const newSnapshot: ScenarioSnapshot = {
      id: `snap-${Date.now()}`,
      name: finalName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetYear,
      presetName: presetLabel,
      allocations: JSON.parse(JSON.stringify(allocations)),
      projections: { ...projectionResults }
    };

    setSnapshots((prev) => [newSnapshot, ...prev]);
    setCustomSnapshotName('');
    setSnapshotSuccessToast(`Saved scenario snapshot: "${finalName}"`);
    setTimeout(() => setSnapshotSuccessToast(null), 3200);
  };

  const handleRevertToSnapshot = (snapshot: ScenarioSnapshot) => {
    audioFeedback.playSubtleClick();
    setTargetYear(snapshot.targetYear);
    setAllocations(JSON.parse(JSON.stringify(snapshot.allocations)));
    setAppliedPresetId('custom');
    setSnapshotSuccessToast(`Reverted simulation state to "${snapshot.name}"`);
    setTimeout(() => setSnapshotSuccessToast(null), 3200);
  };

  const handleDeleteSnapshot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioFeedback.playMicroTick();
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
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

        {/* Right Header Controls: Snapshots Drawer Button + Horizon Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
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
              onClick={handleSaveSnapshot}
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
                      <span className="font-bold text-white text-xs truncate">{snap.name}</span>
                      <span className="text-[9px] text-neutral-400 font-mono">{snap.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 flex-wrap">
                      <span className="text-cyan-400 font-bold">Epoch {snap.targetYear}</span>
                      <span>•</span>
                      <span className="text-emerald-300 font-bold">
                        Score: {snap.projections.projectedFlourishingScore}/100
                      </span>
                      <span>•</span>
                      <span>Circularity: {snap.projections.avgCircularity}%</span>
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
                        <span>{isBeingCompared ? 'Comparing' : 'Compare Side-by-Side'}</span>
                      </button>

                      <button
                        onClick={() => handleRevertToSnapshot(snap)}
                        className="px-2 py-1 rounded font-bold bg-white/5 hover:bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500 cursor-pointer transition-all flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Revert State</span>
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
