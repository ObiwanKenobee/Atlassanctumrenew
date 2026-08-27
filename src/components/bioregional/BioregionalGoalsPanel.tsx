import React, { useState, useEffect } from 'react';
import {
  Trees,
  Droplets,
  Sprout,
  ThermometerSnowflake,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Compass,
  Radio,
  RefreshCw,
  Sliders,
  Sparkles,
  ChevronRight,
  Target,
  Layers,
  Database
} from 'lucide-react';
import { BioregionalGoal } from '../../types';
import { db } from '../../lib/db';
import { audioFeedback } from '../../lib/audioFeedback';

interface BioregionalGoalsPanelProps {
  selectedBioregionId?: string;
  onSelectBioregion?: (id: string) => void;
}

export const BioregionalGoalsPanel: React.FC<BioregionalGoalsPanelProps> = ({
  selectedBioregionId,
  onSelectBioregion
}) => {
  const [goals, setGoals] = useState<BioregionalGoal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedGoal, setSelectedGoal] = useState<BioregionalGoal | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState<boolean>(false);
  const [isUpdatingMetric, setIsUpdatingMetric] = useState<boolean>(false);
  const [updateValue, setUpdateValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [syncTimestamp, setSyncTimestamp] = useState<string>('Live Firestore Stream');

  // New goal form state
  const [newGoal, setNewGoal] = useState<{
    bioregionName: string;
    title: string;
    category: BioregionalGoal['category'];
    targetMetric: string;
    unit: string;
    baselineValue: number;
    currentValue: number;
    targetValue: number;
    deadlineYear: number;
    leadSteward: string;
    stewardRole: string;
    description: string;
    interventionAction1: string;
    interventionAction2: string;
    verificationSensorType: string;
  }>({
    bioregionName: 'Aberdare Cloud Forest & Highland Catchment',
    title: '',
    category: 'canopy_cover',
    targetMetric: '',
    unit: '% Cover',
    baselineValue: 50,
    currentValue: 65,
    targetValue: 85,
    deadlineYear: 2028,
    leadSteward: '',
    stewardRole: 'Bioregional Steward',
    description: '',
    interventionAction1: '',
    interventionAction2: '',
    verificationSensorType: 'Satellite Multispectral + IoT Mesh'
  });

  // Subscribe to live Firestore targets
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = db.bioregionalGoals.subscribe(
      (loadedGoals) => {
        setGoals(loadedGoals);
        setIsLoading(false);
        setSyncTimestamp(new Date().toLocaleTimeString());
      },
      (err) => {
        console.warn('Goals subscription error, using cached data:', err);
        setIsLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleUpdateCurrentValue = async () => {
    if (!selectedGoal || !updateValue) return;
    const num = parseFloat(updateValue);
    if (isNaN(num)) return;

    setIsSaving(true);
    try {
      const trajectory = Math.min(
        100,
        Math.max(
          0,
          Math.round(((num - selectedGoal.baselineValue) / (selectedGoal.targetValue - selectedGoal.baselineValue || 1)) * 100)
        )
      );

      let newStatus: BioregionalGoal['status'] = selectedGoal.status;
      if (num >= selectedGoal.targetValue) {
        newStatus = 'achieved';
      } else if (trajectory > 60) {
        newStatus = 'accelerating';
      } else if (trajectory > 30) {
        newStatus = 'on_track';
      } else {
        newStatus = 'lagging';
      }

      await db.bioregionalGoals.update(selectedGoal.id, {
        currentValue: num,
        trajectoryProgress: trajectory,
        status: newStatus
      });

      // Log in moral audit trail
      await db.audit.logInteraction({
        action: `Updated Bioregional Goal metric for [${selectedGoal.title}] to ${num} ${selectedGoal.unit}`,
        feature: 'telemetry_calibration',
        impactTier: 'high',
        parameters: {
          goalId: selectedGoal.id,
          previousValue: selectedGoal.currentValue,
          newValue: num,
          unit: selectedGoal.unit
        },
        ethicalNotes: 'Landscape health metric calibrated from field verification sensor telemetry.'
      });

      audioFeedback.playSuccessChime();
      setIsUpdatingMetric(false);
      setUpdateValue('');
    } catch (err) {
      console.error('Failed to update goal metric:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNewGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.targetMetric) return;

    setIsSaving(true);
    try {
      const interventions = [newGoal.interventionAction1, newGoal.interventionAction2].filter(Boolean);
      await db.bioregionalGoals.create({
        bioregionId: `bioregion-${newGoal.bioregionName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        bioregionName: newGoal.bioregionName,
        title: newGoal.title,
        category: newGoal.category,
        targetMetric: newGoal.targetMetric,
        unit: newGoal.unit,
        baselineYear: new Date().getFullYear() - 2,
        baselineValue: Number(newGoal.baselineValue),
        currentValue: Number(newGoal.currentValue),
        targetValue: Number(newGoal.targetValue),
        deadlineYear: Number(newGoal.deadlineYear),
        leadSteward: newGoal.leadSteward || 'Bioregional Assembly Council',
        stewardRole: newGoal.stewardRole,
        lastUpdated: Date.now(),
        description: newGoal.description,
        interventionActions: interventions.length > 0 ? interventions : ['Community-led nursery deployment'],
        verificationSensorType: newGoal.verificationSensorType,
        moralAlignmentScore: 96,
        status: 'on_track'
      });

      audioFeedback.playSuccessChime();
      setIsAddingGoal(false);
      // Reset form
      setNewGoal({
        bioregionName: 'Aberdare Cloud Forest & Highland Catchment',
        title: '',
        category: 'canopy_cover',
        targetMetric: '',
        unit: '% Cover',
        baselineValue: 50,
        currentValue: 65,
        targetValue: 85,
        deadlineYear: 2028,
        leadSteward: '',
        stewardRole: 'Bioregional Steward',
        description: '',
        interventionAction1: '',
        interventionAction2: '',
        verificationSensorType: 'Satellite Multispectral + IoT Mesh'
      });
    } catch (err) {
      console.error('Failed to create goal:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryIcon = (category: BioregionalGoal['category']) => {
    switch (category) {
      case 'canopy_cover':
        return <Trees className="w-4 h-4 text-emerald-400" />;
      case 'aquifer_health':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'soil_carbon':
        return <Sprout className="w-4 h-4 text-amber-400" />;
      case 'microclimate':
        return <ThermometerSnowflake className="w-4 h-4 text-sky-400" />;
      case 'biodiversity':
        return <Sparkles className="w-4 h-4 text-emerald-300" />;
      default:
        return <Target className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  const getStatusBadge = (status: BioregionalGoal['status']) => {
    switch (status) {
      case 'accelerating':
        return {
          bg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
          label: 'Accelerating Growth',
          icon: <TrendingUp className="w-3 h-3 text-emerald-400" />
        };
      case 'on_track':
        return {
          bg: 'bg-blue-950/70 border-blue-500/40 text-blue-300',
          label: 'On Track',
          icon: <CheckCircle2 className="w-3 h-3 text-blue-400" />
        };
      case 'lagging':
        return {
          bg: 'bg-rose-950/70 border-rose-500/40 text-rose-300',
          label: 'Intervention Required',
          icon: <AlertCircle className="w-3 h-3 text-rose-400" />
        };
      case 'achieved':
        return {
          bg: 'bg-[#1B3022] border-[#C5A059] text-[#C5A059]',
          label: 'Target Exceeded',
          icon: <Sparkles className="w-3 h-3 text-[#C5A059]" />
        };
      default:
        return {
          bg: 'bg-neutral-800 border-neutral-700 text-neutral-300',
          label: 'Active',
          icon: <Clock className="w-3 h-3 text-neutral-400" />
        };
    }
  };

  const filteredGoals = goals.filter((g) => {
    const matchCategory = categoryFilter === 'all' || g.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchCategory && matchStatus;
  });

  return (
    <div id="bioregional-goals-panel" className="bg-[#0C0E0D] border border-[#F5F5F0]/10 rounded-sm p-6 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-xs bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30">
              <Target className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              Ecological Regeneration Targets • Live Landscape Telemetry
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Active Bioregional Goals
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans">
            Real-time ecological recovery benchmarks verified across ground sensor meshes, InSAR radar, and community field audit covenants.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#141414] border border-[#F5F5F0]/10 rounded-xs text-[10px] font-mono text-[#F5F5F0]/60">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>Firestore Sync: {syncTimestamp}</span>
          </div>

          <button
            id="propose-bioregional-goal-btn"
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsAddingGoal(true);
            }}
            className="px-3.5 py-1.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/50 rounded-xs text-xs font-mono text-[#C5A059] font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Propose Target</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-xs font-mono">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All Metrics' },
            { id: 'canopy_cover', label: 'Canopy Cover' },
            { id: 'aquifer_health', label: 'Aquifer & Water' },
            { id: 'soil_carbon', label: 'Soil Organic Carbon' },
            { id: 'microclimate', label: 'Microclimate' },
            { id: 'biodiversity', label: 'Biodiversity' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setCategoryFilter(tab.id);
                audioFeedback.playMicroTick();
              }}
              className={`px-2.5 py-1 rounded-xs border transition-all ${
                categoryFilter === tab.id
                  ? 'bg-[#C5A059]/15 border-[#C5A059] text-[#C5A059] font-bold'
                  : 'bg-[#121212] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#121212] border border-[#F5F5F0]/15 rounded-xs px-2 py-1 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
          >
            <option value="all">All Trajectories</option>
            <option value="accelerating">Accelerating</option>
            <option value="on_track">On Track</option>
            <option value="lagging">Intervention Required</option>
            <option value="achieved">Target Exceeded</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      {isLoading ? (
        <div className="py-12 flex items-center justify-center gap-2 text-xs font-mono text-[#F5F5F0]/50">
          <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
          <span>Streaming live bioregional goals from Firestore...</span>
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="py-10 text-center border border-dashed border-[#F5F5F0]/10 rounded-sm p-6 text-xs text-[#F5F5F0]/40 font-mono">
          No ecological goals match the current category filter. Click "Propose Target" to register an active benchmark.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredGoals.map((goal) => {
            const statusConfig = getStatusBadge(goal.status);
            const progressPercent = Math.min(
              100,
              Math.max(
                0,
                Math.round(((goal.currentValue - goal.baselineValue) / (goal.targetValue - goal.baselineValue || 1)) * 100)
              )
            );
            const yearsLeft = Math.max(0, goal.deadlineYear - new Date().getFullYear());

            return (
              <div
                key={goal.id}
                id={`goal-card-${goal.id}`}
                className="bg-[#121413] border border-[#F5F5F0]/10 hover:border-[#C5A059]/40 rounded-sm p-5 space-y-4 transition-all hover:bg-[#151816] group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top line: Category + Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xs bg-[#191919] border border-[#F5F5F0]/10">
                        {getCategoryIcon(goal.category)}
                      </div>
                      <span className="text-[10px] font-mono text-[#F5F5F0]/60 uppercase tracking-wider">
                        {goal.bioregionName}
                      </span>
                    </div>

                    <div className={`px-2 py-0.5 rounded-xs text-[9px] font-mono uppercase tracking-wider border flex items-center gap-1 ${statusConfig.bg}`}>
                      {statusConfig.icon}
                      <span>{statusConfig.label}</span>
                    </div>
                  </div>

                  {/* Goal Title */}
                  <h3 className="text-base font-serif font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors leading-snug">
                    {goal.title}
                  </h3>

                  <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                    {goal.description}
                  </p>

                  {/* Metric Progress Bar */}
                  <div className="p-3 bg-[#0A0C0B] border border-[#F5F5F0]/5 rounded-xs space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#F5F5F0]/50 text-[10px] uppercase tracking-wider">
                        {goal.targetMetric}
                      </span>
                      <span className="text-[#C5A059] font-bold">
                        {goal.currentValue} {goal.unit}{' '}
                        <span className="text-[#F5F5F0]/40 font-normal">/ target {goal.targetValue} {goal.unit}</span>
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-[#1A1C1B] rounded-full h-2 overflow-hidden border border-[#F5F5F0]/10 relative">
                      <div
                        className="h-full bg-gradient-to-r from-[#1B3022] via-[#2D5A3A] to-[#C5A059] rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/40 pt-0.5">
                      <span>Baseline ({goal.baselineYear}): {goal.baselineValue} {goal.unit}</span>
                      <span className="text-emerald-400 font-bold">{progressPercent}% Achieved</span>
                      <span>Target Deadline: {goal.deadlineYear} ({yearsLeft} yrs)</span>
                    </div>
                  </div>

                  {/* Interventions */}
                  {goal.interventionActions && goal.interventionActions.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#F5F5F0]/40 block">
                        Active Ground Interventions:
                      </span>
                      <ul className="text-[11px] font-mono text-[#F5F5F0]/75 space-y-0.5 pl-2 border-l border-[#C5A059]/30">
                        {goal.interventionActions.slice(0, 2).map((act, idx) => (
                          <li key={idx} className="truncate">• {act}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer details & Action */}
                <div className="pt-3 border-t border-[#F5F5F0]/10 flex items-center justify-between gap-2 text-[10px] font-mono text-[#F5F5F0]/50">
                  <div className="truncate">
                    <span className="text-[#F5F5F0]/40">Steward: </span>
                    <span className="text-[#F5F5F0] font-semibold">{goal.leadSteward}</span>
                  </div>

                  <button
                    id={`calibrate-metric-btn-${goal.id}`}
                    onClick={() => {
                      setSelectedGoal(goal);
                      setUpdateValue(goal.currentValue.toString());
                      setIsUpdatingMetric(true);
                      audioFeedback.playMicroTick();
                    }}
                    className="px-2.5 py-1 bg-[#162019] hover:bg-[#203325] border border-[#2D5A3A] text-emerald-300 rounded-xs text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Calibrate Metric</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Calibrate Current Metric Value */}
      {isUpdatingMetric && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#121413] border border-[#C5A059]/50 rounded-sm p-6 max-w-md w-full space-y-5 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs font-mono font-bold text-[#F5F5F0] uppercase tracking-wider">
                  Calibrate Ground Telemetry
                </span>
              </div>
              <button
                onClick={() => setIsUpdatingMetric(false)}
                className="text-[#F5F5F0]/40 hover:text-[#F5F5F0] text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#F5F5F0]/50 uppercase">Goal:</span>
                <p className="text-sm font-serif font-bold text-[#F5F5F0]">{selectedGoal.title}</p>
              </div>

              <div>
                <span className="text-[10px] text-[#F5F5F0]/50 uppercase">Metric:</span>
                <p className="text-[#C5A059]">{selectedGoal.targetMetric}</p>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] uppercase text-[#F5F5F0]/60">
                  New Verified Sensor Reading ({selectedGoal.unit}):
                </label>
                <input
                  type="number"
                  step="any"
                  value={updateValue}
                  onChange={(e) => setUpdateValue(e.target.value)}
                  className="w-full bg-[#0A0C0B] border border-[#C5A059]/40 rounded-xs px-3 py-2 text-sm text-[#F5F5F0] font-mono focus:outline-none focus:border-[#C5A059]"
                />
                <span className="text-[10px] text-[#F5F5F0]/40">
                  Baseline: {selectedGoal.baselineValue} {selectedGoal.unit} • Target: {selectedGoal.targetValue} {selectedGoal.unit}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F5F5F0]/10">
              <button
                onClick={() => setIsUpdatingMetric(false)}
                className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] rounded-xs text-xs font-mono text-[#F5F5F0]/70"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCurrentValue}
                disabled={isSaving}
                className="px-4 py-1.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059] text-[#C5A059] rounded-xs text-xs font-mono font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Save to Firestore</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Propose New Bioregional Goal */}
      {isAddingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-[#121413] border border-[#C5A059]/60 rounded-sm p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs font-mono font-bold text-[#F5F5F0] uppercase tracking-wider">
                  Propose New Bioregional Goal
                </span>
              </div>
              <button
                onClick={() => setIsAddingGoal(false)}
                className="text-[#F5F5F0]/40 hover:text-[#F5F5F0] text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewGoal} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="text-[10px] uppercase text-[#F5F5F0]/60 block mb-1">Target Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sub-Canopy Podocarpus Density Regeneration"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full bg-[#0A0C0B] border border-[#F5F5F0]/15 rounded-xs px-3 py-2 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-[#F5F5F0]/60 block mb-1">Bioregion</label>
                  <select
                    value={newGoal.bioregionName}
                    onChange={(e) => setNewGoal({ ...newGoal, bioregionName: e.target.value })}
                    className="w-full bg-[#0A0C0B] border border-[#F5F5F0]/15 rounded-xs px-2.5 py-2 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Aberdare Cloud Forest & Highland Catchment">Aberdare Cloud Forest</option>
                    <option value="Turkana-Omo Dryland Aquifer System">Turkana-Omo Aquifer</option>
                    <option value="Mara-Serengeti River Basin & Savanna Corridor">Mara-Serengeti Basin</option>
                    <option value="Nairobi River Basin & Urban Bioregion">Nairobi River Urban</option>
                    <option value="Mombasa Coastal Mangrove & Marine Basin">Mombasa Blue Carbon</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-[#F5F5F0]/60 block mb-1">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                    className="w-full bg-[#0A0C0B] border border-[#F5F5F0]/15 rounded-xs px-2.5 py-2 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="canopy_cover">Canopy Cover & Biomass</option>
                    <option value="aquifer_health">Aquifer & Hydrology</option>
                    <option value="soil_carbon">Living Soil Carbon</option>
                    <option value="microclimate">Microclimate Cooling</option>
                    <option value="biodiversity">Biodiversity Corridor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#F5F5F0]/60 block mb-1">Target Metric & Unit *</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Metric (e.g. Canopy Density)"
                    value={newGoal.targetMetric}
                    onChange={(e) => setNewGoal({ ...newGoal, targetMetric: e.target.value })}
                    className="col-span-2 bg-[#0A0C0B] border border-[#F5F5F0]/15 rounded-xs px-3 py-2 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Unit (e.g. % Cover)"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    className="bg-[#0A0C0B] border border-[#F5F5F0]/15 rounded-xs px-3 py-2 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[9px] uppercase text-[#F5F5F0]/60 block mb-0.5">Baseline</label>
                  <input
                    type="number"
                    step="any"
                    value={newGoal.baselineValue}
                    onChange={(e) => setNewGoal({ ...newGoal, baselineValue: Number(e.target.value) })}
                    className="w-full bg-[#0A0C0B] border border-[#F5F5F0]/15 rounded-xs px-2 py-1.5 text-xs text-[#F5F5F0]"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase text-[#F5F5F0]/60 block mb-0.5">Current</label>
                  <input
                    type="number"
                    step="any"
                    value={newGoal.currentValue}
                    onChange={(e) => setNewGoal({ ...newGoal, currentValue: Number(e.target.value) })}
                    className="w-full bg-[#0A0C0B] border border-[#F5F5F0]/15 rounded-xs px-2 py-1.5 text-xs text-[#F5F5F0]"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase text-[#F5F5F0]/60 block mb-0.5">Target</label>
                  <input
                    type="number"
                    step="any"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
                    className="w-full bg-[#0A0C0B] border border-[#F5F5F0]/15 rounded-xs px-2 py-1.5 text-xs text-[#F5F5F0]"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase text-[#F5F5F0]/60 block mb-0.5">Year</label>
                  <input
                    type="number"
                    value={newGoal.deadlineYear}
                    onChange={(e) => setNewGoal({ ...newGoal, deadlineYear: Number(e.target.value) })}
                    className="w-full bg-[#0A0C0B] border border-[#F5F5F0]/15 rounded-xs px-2 py-1.5 text-xs text-[#F5F5F0]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#F5F5F0]/60 block mb-1">Lead Steward & Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Steward Name"
                    value={newGoal.leadSteward}
                    onChange={(e) => setNewGoal({ ...newGoal, leadSteward: e.target.value })}
                    className="bg-[#0A0C0B] border border-[#F5F5F0]/15 rounded-xs px-3 py-2 text-xs text-[#F5F5F0]"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Lead Ecologist)"
                    value={newGoal.stewardRole}
                    onChange={(e) => setNewGoal({ ...newGoal, stewardRole: e.target.value })}
                    className="bg-[#0A0C0B] border border-[#F5F5F0]/15 rounded-xs px-3 py-2 text-xs text-[#F5F5F0]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#F5F5F0]/60 block mb-1">Description & Ecological Rationale</label>
                <textarea
                  rows={2}
                  placeholder="Explain the local landscape health dynamic and why this benchmark is critical..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full bg-[#0A0C0B] border border-[#F5F5F0]/15 rounded-xs p-2 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F5F5F0]/10">
                <button
                  type="button"
                  onClick={() => setIsAddingGoal(false)}
                  className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] rounded-xs text-xs font-mono text-[#F5F5F0]/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059] text-[#C5A059] rounded-xs text-xs font-mono font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Commit to Firestore</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
