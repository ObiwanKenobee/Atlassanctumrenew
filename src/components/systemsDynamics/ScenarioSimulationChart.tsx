import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  Zap,
  Leaf,
  TrendingUp,
  ShieldAlert,
  Layers,
  DollarSign,
  Info,
  CheckCircle2,
  Sparkles,
  GitCompare
} from 'lucide-react';
import { SimulationResult, SimulationPoint } from '../../services/systemsDynamicsEngine';
import { SystemModel, CandidateIntervention } from '../../types/systemsDynamics';

interface ScenarioSimulationChartProps {
  result: SimulationResult;
  model: SystemModel;
  activeInterventions?: CandidateIntervention[];
  selectedMetric?: string;
  onSelectMetric?: (metricKey: string) => void;
  className?: string;
}

interface MetricOption {
  key: keyof SimulationPoint | 'composite';
  label: string;
  unit: string;
  icon: React.ElementType;
  color: string;
  baselineColor: string;
  strokeDash?: string;
  formatter: (val: number) => string;
  domain: [number | 'auto', number | 'auto'];
}

const METRIC_OPTIONS: MetricOption[] = [
  {
    key: 'flourishingIndex',
    label: 'Composite Flourishing Index',
    unit: 'Index (0-100)',
    icon: Sparkles,
    color: '#10b981', // emerald-500
    baselineColor: '#64748b', // slate-500
    formatter: (v) => `${v.toFixed(1)} / 100`,
    domain: [0, 100]
  },
  {
    key: 'cleanEnergyOutputMwh',
    label: 'Clean Energy Generation',
    unit: 'kW Peak / MWh',
    icon: Zap,
    color: '#38bdf8', // sky-400
    baselineColor: '#94a3b8',
    formatter: (v) => `${v.toFixed(1)} kW`,
    domain: [0, 'auto']
  },
  {
    key: 'batteryStorageBufferMwh',
    label: 'Battery & Cold Storage Buffer',
    unit: 'Metric Tons / kWh',
    icon: Layers,
    color: '#a855f7', // purple-500
    baselineColor: '#64748b',
    formatter: (v) => `${v.toFixed(1)} t/day`,
    domain: [0, 'auto']
  },
  {
    key: 'gridStressIndex',
    label: 'Peak Grid Stress & Outage Risk',
    unit: 'Stress Index (0-100)',
    icon: ShieldAlert,
    color: '#f43f5e', // rose-500
    baselineColor: '#94a3b8',
    formatter: (v) => `${v.toFixed(1)} / 100`,
    domain: [0, 100]
  },
  {
    key: 'retainedCapitalUsd',
    label: 'Retained Community Capital Commons',
    unit: 'USD ($)',
    icon: DollarSign,
    color: '#f59e0b', // amber-500
    baselineColor: '#64748b',
    formatter: (v) => `$${v.toLocaleString()}`,
    domain: [0, 'auto']
  },
  {
    key: 'carbonAvoidedTons',
    label: 'Cumulative Carbon Abated',
    unit: 'Metric Tons CO₂e',
    icon: Leaf,
    color: '#14b8a6', // teal-500
    baselineColor: '#94a3b8',
    formatter: (v) => `${v.toFixed(1)} t CO₂`,
    domain: [0, 'auto']
  }
];

export const ScenarioSimulationChart: React.FC<ScenarioSimulationChartProps> = ({
  result,
  model,
  activeInterventions = [],
  selectedMetric = 'flourishingIndex',
  onSelectMetric,
  className = ''
}) => {
  const [internalMetric, setInternalMetric] = useState<string>(selectedMetric);
  const currentMetricKey = onSelectMetric ? selectedMetric : internalMetric;
  const activeMetric = METRIC_OPTIONS.find((m) => m.key === currentMetricKey) || METRIC_OPTIONS[0];

  const handleMetricChange = (key: string) => {
    if (onSelectMetric) {
      onSelectMetric(key);
    } else {
      setInternalMetric(key);
    }
  };

  // Combine baseline and intervention series for chart dataset
  const chartData = result.timeSeries.map((intPoint, index) => {
    const basePoint = result.baselineTimeSeries[index] || intPoint;
    const metricKey = activeMetric.key as keyof SimulationPoint;

    const interventionVal = typeof intPoint[metricKey] === 'number' ? (intPoint[metricKey] as number) : 0;
    const baselineVal = typeof basePoint[metricKey] === 'number' ? (basePoint[metricKey] as number) : 0;

    const lowerBound = intPoint.confidenceInterval ? intPoint.confidenceInterval[0] : interventionVal * 0.95;
    const upperBound = intPoint.confidenceInterval ? intPoint.confidenceInterval[1] : interventionVal * 1.05;

    return {
      month: intPoint.month,
      monthLabel: `M${intPoint.month}`,
      intervention: interventionVal,
      baseline: baselineVal,
      lowerBound,
      upperBound,
      uncertaintyBand: [lowerBound, upperBound]
    };
  });

  const deltaSummary = result.summaryMetrics;
  const isInterventionActive = activeInterventions.length > 0;

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-6 shadow-2xl ${className}`}>
      {/* Header & Metric Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <GitCompare className="w-3.5 h-3.5" />
              Differential Euler Integration (dt = 1 mo)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {model.bioregionOrDomain || 'Regional Energy Infrastructure'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Dynamic System Projection: Baseline vs Catalytic Interventions
          </h3>
          <p className="text-sm text-slate-400">
            Compare non-linear multi-capital accumulations across 24-month horizon with continuous feedback gains.
          </p>
        </div>

        {/* Leverage tier badge */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-right">
            <div className="text-xs text-slate-400 font-mono">Active Meadows Tier</div>
            <div className="text-sm font-semibold text-emerald-400">
              {deltaSummary.highestLeverageAppliedTier}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {METRIC_OPTIONS.map((metric) => {
          const Icon = metric.icon;
          const isSelected = metric.key === activeMetric.key;
          return (
            <button
              key={metric.key}
              onClick={() => handleMetricChange(metric.key)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500 text-slate-100 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Icon
                className="w-4 h-4 shrink-0"
                style={{ color: isSelected ? metric.color : '#94a3b8' }}
              />
              <div className="truncate">
                <div className="text-xs font-medium truncate">{metric.label}</div>
                <div className="text-[10px] text-slate-500 font-mono">{metric.unit}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Key KPI Deltas Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Flourishing Delta</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {deltaSummary.flourishingDelta >= 0 ? `+${deltaSummary.flourishingDelta}` : deltaSummary.flourishingDelta} pts
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Composite system well-being</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Clean Energy Gain</span>
            <Zap className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-sky-400 mt-1">
            +{deltaSummary.cleanEnergyGainPercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Decentralized generation capacity</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Grid Stress Reduction</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 mt-1">
            -{deltaSummary.gridStressReductionPercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Peak outage & brownout risk</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Capital Multiplier</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 mt-1">
            {deltaSummary.capitalRetainedMultiplier}x
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Community wealth circulation</div>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="h-80 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="interventionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeMetric.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={activeMetric.color} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeMetric.color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={activeMetric.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="month"
              tickFormatter={(v) => `Mo ${v}`}
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#334155' }}
            />

            <YAxis
              stroke="#64748b"
              domain={activeMetric.domain}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#334155' }}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString())}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const intVal = payload.find((p) => p.dataKey === 'intervention')?.value as number;
                  const baseVal = payload.find((p) => p.dataKey === 'baseline')?.value as number;
                  const diff = (intVal || 0) - (baseVal || 0);

                  return (
                    <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs font-mono">
                      <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between gap-3">
                        <span>Timeline Month {label}</span>
                        <span className="text-[10px] text-emerald-400 font-sans px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                          {activeMetric.unit}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeMetric.color }} />
                            Intervention Projection:
                          </span>
                          <span className="font-bold text-slate-100">
                            {intVal !== undefined ? activeMetric.formatter(intVal) : 'N/A'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-slate-500" />
                            Baseline (Status Quo):
                          </span>
                          <span className="text-slate-400">
                            {baseVal !== undefined ? activeMetric.formatter(baseVal) : 'N/A'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-slate-800 pt-1 text-[11px]">
                          <span className="text-emerald-400 font-sans font-medium">Intervention Net Delta:</span>
                          <span className={diff >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {diff >= 0 ? `+${activeMetric.formatter(diff)}` : activeMetric.formatter(diff)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '12px' }}
              content={() => (
                <div className="flex items-center justify-end gap-5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-0.5 bg-slate-500 inline-block border-t border-dashed border-slate-400" />
                    <span>Baseline (Status Quo)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="w-4 h-1.5 rounded-sm inline-block" style={{ backgroundColor: activeMetric.color }} />
                    <span style={{ color: activeMetric.color }}>
                      {isInterventionActive ? 'Intervention Trajectory' : 'Simulated Horizon'}
                    </span>
                  </div>
                </div>
              )}
            />

            {/* Baseline reference curve (dashed) */}
            <Line
              type="monotone"
              dataKey="baseline"
              name="Baseline"
              stroke="#64748b"
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#64748b' }}
            />

            {/* Intervention trajectory curve with gradient area */}
            <Area
              type="monotone"
              dataKey="intervention"
              name="Intervention Trajectory"
              stroke={activeMetric.color}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#interventionGradient)"
              activeDot={{ r: 6, fill: activeMetric.color, stroke: '#0f172a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Active Feedback Loop Dominance Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            {result.loopDominance.length > 0
              ? `Dominant Loop: ${result.loopDominance[0]?.loopName} (${result.loopDominance[0]?.status})`
              : 'Feedback loop acceleration calibrated over multi-capital flows.'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {result.warnings.length > 0 ? (
            <span className="text-amber-400 flex items-center gap-1 font-mono text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5" />
              {result.warnings[0]}
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              System Boundaries Stable
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
