import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Layers,
  Activity,
  BarChart3,
  Zap,
  ShieldCheck,
  Compass,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  GitBranch,
  Sliders,
  Send
} from 'lucide-react';
import { CANONICAL_MATHARE_SYSTEM_MODEL, CANDIDATE_INTERVENTIONS, CANONICAL_SIMULATION_SCENARIOS } from '../../data/systemsDynamicsData';
import { SystemsDynamicsEngine } from '../../lib/systems/systemsEngine';
import { SystemStock, CandidateIntervention } from '../../types';

interface SystemModelStudioViewProps {
  onNavigateToMissionControl?: () => void;
  onInitiateMissionWithIntervention?: (intervention: CandidateIntervention) => void;
}

export const SystemModelStudioView: React.FC<SystemModelStudioViewProps> = ({
  onNavigateToMissionControl,
  onInitiateMissionWithIntervention
}) => {
  const [activeTab, setActiveTab] = useState<
    'graph' | 'simulator' | 'scenarios' | 'leverage' | 'agents' | 'governance'
  >('graph');

  const [selectedEntityId, setSelectedEntityId] = useState<string>('stock-riparian-soil-carbon');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario-integrated-commons');

  // Interactive Simulator State
  const [solarCapacity, setSolarCapacity] = useState<number>(120);
  const [agroforestryRate, setAgroforestryRate] = useState<number>(0.85);
  const [rainSurge, setRainSurge] = useState<number>(1.2);
  const [timeHorizonMonths, setTimeHorizonMonths] = useState<number>(24);
  const [selectedInterventionIds, setSelectedInterventionIds] = useState<string[]>([
    'int-solar-cold-chain-biochar',
    'int-vetiver-agroforestry-corridor',
    'int-clan-water-sovereignty-mesh'
  ]);

  const [learningLog] = useState<{ id: string; time: string; text: string; badge: string }[]>([
    {
      id: 'log-1',
      time: '12m ago',
      text: 'Sentinel-2 NDVI telemetry ingested for Mathare Sub-catchment #4 (+0.08 biomass index).',
      badge: 'Empirical Match (+2.5% Conf)'
    },
    {
      id: 'log-2',
      time: '45m ago',
      text: 'Solar cold hub #2 recorded 94.2% uptime with zero vegetable spoilage for 180 market women.',
      badge: 'Feedback Loop R2 Validated'
    },
    {
      id: 'log-3',
      time: '2h ago',
      text: 'Elder Council ratified FPIC Water Trust charter; updated institutional trust baseline from 58 to 62.',
      badge: 'Moral Boundary Satisfied'
    }
  ]);

  const activeInterventions = useMemo(() => {
    return CANDIDATE_INTERVENTIONS.filter((i) => selectedInterventionIds.includes(i.id));
  }, [selectedInterventionIds]);

  const simulationResult = useMemo(() => {
    return SystemsDynamicsEngine.runSimulation({
      model: CANONICAL_MATHARE_SYSTEM_MODEL,
      timeHorizonMonths,
      timeStepMonths: 2,
      parameterOverrides: {
        'var-solar-irrigation-power': solarCapacity,
        'var-agroforestry-adoption-rate': agroforestryRate,
        'var-seasonal-rainfall-surge': rainSurge
      },
      activeInterventions
    });
  }, [solarCapacity, agroforestryRate, rainSurge, timeHorizonMonths, activeInterventions]);

  const selectedEntity = useMemo(() => {
    const stock = CANONICAL_MATHARE_SYSTEM_MODEL.stocks.find((s) => s.id === selectedEntityId);
    if (stock) return { type: 'stock' as const, data: stock };
    const flow = CANONICAL_MATHARE_SYSTEM_MODEL.flows.find((f) => f.id === selectedEntityId);
    if (flow) return { type: 'flow' as const, data: flow };
    const variable = CANONICAL_MATHARE_SYSTEM_MODEL.variables.find((v) => v.id === selectedEntityId);
    if (variable) return { type: 'variable' as const, data: variable };
    return null;
  }, [selectedEntityId]);

  const toggleIntervention = (id: string) => {
    setSelectedInterventionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetSimulator = () => {
    setSolarCapacity(45);
    setAgroforestryRate(0.42);
    setRainSurge(1.35);
    setSelectedInterventionIds([]);
  };

  const handleApplyPreset = (preset: 'optimal' | 'conservative' | 'crisis') => {
    if (preset === 'optimal') {
      setSolarCapacity(150);
      setAgroforestryRate(0.92);
      setRainSurge(1.1);
      setSelectedInterventionIds(CANDIDATE_INTERVENTIONS.map((i) => i.id));
    } else if (preset === 'conservative') {
      setSolarCapacity(70);
      setAgroforestryRate(0.55);
      setRainSurge(1.3);
      setSelectedInterventionIds(['int-solar-cold-chain-biochar']);
    } else {
      setSolarCapacity(30);
      setAgroforestryRate(0.3);
      setRainSurge(2.1);
      setSelectedInterventionIds([]);
    }
  };

  return (
    <div id="system-model-studio-container" className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Header & Bioregional Boundary Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Activity className="w-3 h-3 animate-pulse" />
                Active Systems Dynamics Engine
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {CANONICAL_MATHARE_SYSTEM_MODEL.version}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Epistemic Confidence: {CANONICAL_MATHARE_SYSTEM_MODEL.modelHealth.epistemicConfidence}%
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {CANONICAL_MATHARE_SYSTEM_MODEL.name}
            </h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              {CANONICAL_MATHARE_SYSTEM_MODEL.bioregionOrDomain} • {CANONICAL_MATHARE_SYSTEM_MODEL.timeHorizonMonths} Months Horizon
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToMissionControl?.()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md active:scale-95"
            >
              <Cpu className="w-4 h-4" />
              Agent Mission Control
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Boundary summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Stocks Tracked</span>
            <span className="text-xl font-bold text-slate-100">{CANONICAL_MATHARE_SYSTEM_MODEL.stocks.length} Multi-Capital Stocks</span>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Feedback Loops</span>
            <span className="text-xl font-bold text-emerald-400">
              {CANONICAL_MATHARE_SYSTEM_MODEL.feedbackLoops.filter((l) => l.type === 'reinforcing').length}R /{' '}
              {CANONICAL_MATHARE_SYSTEM_MODEL.feedbackLoops.filter((l) => l.type === 'balancing').length}B Loops
            </span>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">High Leverage Points</span>
            <span className="text-xl font-bold text-amber-400">{CANDIDATE_INTERVENTIONS.length} Catalytic Points</span>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Data Freshness</span>
            <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-4 h-4" /> Live Calibrated
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('graph')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'graph'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          Causal Graph & Boundaries
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'simulator'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Differential Stock Simulator
        </button>
        <button
          onClick={() => setActiveTab('scenarios')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'scenarios'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Scenario Matrix
        </button>
        <button
          onClick={() => setActiveTab('leverage')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'leverage'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          Meadows Leverage Engine
        </button>
        <button
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'agents'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Agent Reasoning Loop
        </button>
        <button
          onClick={() => setActiveTab('governance')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'governance'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Epistemic Provenance
        </button>
      </div>

      {/* TAB 1: CAUSAL GRAPH & BOUNDARIES */}
      {activeTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* System Boundary Entities */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Boundary Entities & Stocks
                </h3>
                <span className="text-xs text-slate-500">Click any entity to inspect mathematical mechanics</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CANONICAL_MATHARE_SYSTEM_MODEL.stocks.map((stock) => {
                  const isSelected = selectedEntityId === stock.id;
                  return (
                    <div
                      key={stock.id}
                      onClick={() => setSelectedEntityId(stock.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {stock.category} capital stock
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            stock.epistemicStatus === 'Known'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {stock.epistemicStatus} ({stock.confidence}%)
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{stock.name}</h4>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-lg font-bold text-indigo-700">
                          {stock.currentValue.toLocaleString()} <span className="text-xs font-normal text-slate-500">{stock.unit}</span>
                        </span>
                        <span className="text-xs text-slate-500">
                          +{stock.inflowRate} / -{stock.outflowRate} mo
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Causal Influences & Relationships */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-emerald-600" />
                Causal Polarity & Pearl Do-Calculus Pathways
              </h3>
              <div className="space-y-3">
                {CANONICAL_MATHARE_SYSTEM_MODEL.relationships.map((rel) => (
                  <div
                    key={rel.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">{rel.sourceName}</span>
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-xs ${
                            rel.polarity === '+'
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                              : 'bg-rose-100 text-rose-700 border border-rose-300'
                          }`}
                        >
                          {rel.polarity} Polarity ({rel.polarity === '+' ? 'Reinforcing' : 'Balancing'})
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-sm text-slate-900">{rel.targetName}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rel.mechanismExplanation}</p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 whitespace-nowrap sm:border-l sm:pl-3 sm:border-slate-200">
                      <div>
                        <span className="block text-slate-400">Do-Coeff</span>
                        <span className="font-bold text-indigo-600">{rel.causalDoCoefficient}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400">Delay</span>
                        <span className="font-bold text-slate-700">{rel.delayPeriods} mo</span>
                      </div>
                      <div>
                        <span className="block text-slate-400">Attribution</span>
                        <span className="font-medium text-slate-600">{rel.sourceAttribution}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Identified Feedback Loops */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                Systemic Feedback Loops (Reinforcing & Balancing)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CANONICAL_MATHARE_SYSTEM_MODEL.feedbackLoops.map((loop) => (
                  <div
                    key={loop.id}
                    className={`p-4 rounded-lg border ${
                      loop.type === 'reinforcing'
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-amber-200 bg-amber-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          loop.type === 'reinforcing'
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-amber-200 text-amber-900'
                        }`}
                      >
                        {loop.type === 'reinforcing' ? 'Reinforcing (R)' : 'Balancing (B)'}
                      </span>
                      <span className="text-xs font-bold text-slate-600">Leverage: {loop.leverageScore}/10</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{loop.name}</h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{loop.narrative}</p>
                    <div className="mt-3 text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-200">
                      <span>Time Horizon: {loop.dominantTimeHorizon}</span>
                      <span>{loop.loopNodes.length} Nodes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Entity Inspector */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-sm sticky top-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                  Entity Formula Inspector
                </span>
                <span className="text-xs font-mono bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700/50">
                  {selectedEntityId}
                </span>
              </div>

              {selectedEntity ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {(selectedEntity.data as any).name}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">
                      {(selectedEntity.data as any).description}
                    </p>
                  </div>

                  {selectedEntity.type === 'stock' && (
                    <>
                      <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700 font-mono text-xs text-emerald-400">
                        <div className="text-slate-400 text-[10px] uppercase font-sans mb-1">Differential Equation</div>
                        d(Stock)/dt = Inflows(t) - Outflows(t)
                        <div className="text-slate-300 mt-1 text-[11px]">
                          = +{(selectedEntity.data as SystemStock).inflowRate} - {(selectedEntity.data as SystemStock).outflowRate} per month
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-800/60 p-2.5 rounded border border-slate-700/60">
                          <span className="text-slate-400 block">Min Capacity</span>
                          <span className="font-bold text-white">{(selectedEntity.data as SystemStock).minimumCapacity.toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-800/60 p-2.5 rounded border border-slate-700/60">
                          <span className="text-slate-400 block">Max Capacity</span>
                          <span className="font-bold text-white">{(selectedEntity.data as SystemStock).maximumCapacity.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Epistemic Status:</span>
                      <span className="font-semibold text-emerald-400">{(selectedEntity.data as any).epistemicStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Confidence Score:</span>
                      <span className="font-semibold text-indigo-400">{(selectedEntity.data as any).confidence || 95}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-6 text-center">
                  Select an entity from the causal graph to inspect equations.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIFFERENTIAL STOCK SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Intervention Parameters
              </h3>
              <button
                onClick={handleResetSimulator}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600">Quick Presets:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleApplyPreset('optimal')}
                  className="px-2.5 py-1.5 text-xs font-medium rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                >
                  Optimal Commons
                </button>
                <button
                  onClick={() => handleApplyPreset('conservative')}
                  className="px-2.5 py-1.5 text-xs font-medium rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Conservative
                </button>
                <button
                  onClick={() => handleApplyPreset('crisis')}
                  className="px-2.5 py-1.5 text-xs font-medium rounded bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
                >
                  Monsoon Crisis
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Decentralized Solar Capacity:</span>
                  <span className="text-indigo-600">{solarCapacity} kW Peak</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={solarCapacity}
                  onChange={(e) => setSolarCapacity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Agroforestry Buffer Coverage:</span>
                  <span className="text-emerald-600">{Math.round(agroforestryRate * 100)}% of riverbank</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={agroforestryRate}
                  onChange={(e) => setAgroforestryRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Monsoon Rainfall Surge Multiplier:</span>
                  <span className="text-amber-600">{rainSurge}x Average</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={rainSurge}
                  onChange={(e) => setRainSurge(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-800 mb-1">
                  <span>Simulation Horizon:</span>
                  <span className="text-slate-700">{timeHorizonMonths} Months</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="36"
                  step="6"
                  value={timeHorizonMonths}
                  onChange={(e) => setTimeHorizonMonths(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Active Intervention Nodes:</span>
              {CANDIDATE_INTERVENTIONS.map((int) => {
                const isActive = selectedInterventionIds.includes(int.id);
                return (
                  <div
                    key={int.id}
                    onClick={() => toggleIntervention(int.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold block">{int.targetName}</span>
                      <span className="text-[11px] text-slate-500">${(int.costUsd / 1000).toFixed(0)}k • {int.timeHorizonMonths}mo</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="text-xs text-slate-500 block">Flourishing Index</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-indigo-600">
                    {simulationResult.timeSeries[simulationResult.timeSeries.length - 1]?.flourishingIndex}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    +{simulationResult.deltaSummary.flourishingDelta}%
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="text-xs text-slate-500 block">Soil Carbon & Biomass</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-emerald-600">
                    {simulationResult.timeSeries[simulationResult.timeSeries.length - 1]?.soilCarbonTons.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    +{simulationResult.deltaSummary.soilCarbonDeltaPercent}%
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="text-xs text-slate-500 block">Youth Stewards</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900">
                    {simulationResult.timeSeries[simulationResult.timeSeries.length - 1]?.youthLivelihoods}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    +{simulationResult.deltaSummary.youthLivelihoodsCreated}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <span className="text-xs text-slate-500 block">Retained Capital</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-purple-600">
                    {simulationResult.deltaSummary.retainedCapitalMultiplier}x
                  </span>
                  <span className="text-xs font-medium text-slate-500">Multiplier</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Differential Integration Trajectory (Euler Time-Steps)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Month</th>
                      <th className="p-2.5">Flourishing</th>
                      <th className="p-2.5">Soil Carbon (Tons)</th>
                      <th className="p-2.5">Water Resilience</th>
                      <th className="p-2.5">Youth Stewards</th>
                      <th className="p-2.5">Local Capital</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {simulationResult.timeSeries.map((point) => (
                      <tr key={point.month} className="hover:bg-slate-50/80">
                        <td className="p-2.5 font-bold text-slate-900">M+{point.month}</td>
                        <td className="p-2.5 font-bold text-indigo-600">{point.flourishingIndex}</td>
                        <td className="p-2.5 text-emerald-700 font-medium">{point.soilCarbonTons.toLocaleString()} t</td>
                        <td className="p-2.5 text-slate-700">{point.waterResilienceScore}/100</td>
                        <td className="p-2.5 text-slate-900 font-medium">{point.youthLivelihoods}</td>
                        <td className="p-2.5 text-purple-700 font-medium">${point.retainedCapitalUsd.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Live Feedback Loop Acceleration State
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {simulationResult.reinforcingLoopDominance.map((loop) => (
                  <div key={loop.loopId} className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-300">{loop.loopName.split(':')[0]}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                          loop.status === 'accelerating'
                            ? 'bg-emerald-900/80 text-emerald-300'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {loop.status}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${loop.relativeStrength * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block text-right">
                      Strength: {Math.round(loop.relativeStrength * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCENARIOS */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CANONICAL_SIMULATION_SCENARIOS.map((scen) => {
              const isSelected = selectedScenarioId === scen.id;
              return (
                <div
                  key={scen.id}
                  onClick={() => setSelectedScenarioId(scen.id)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        scen.isBaseline
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {scen.isBaseline ? 'Baseline' : 'Intervention Scenario'}
                    </span>
                    <span className="text-xs font-bold text-slate-500">24-Month Projection</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{scen.name}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{scen.description}</p>
                </div>
              );
            })}
          </div>

          {(() => {
            const currentScenario = CANONICAL_SIMULATION_SCENARIOS.find((s) => s.id === selectedScenarioId) || CANONICAL_SIMULATION_SCENARIOS[1];
            return (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs uppercase font-semibold text-indigo-600 tracking-wider">
                      Detailed Counterfactual Assessment
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">{currentScenario.name}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      Confidence Interval: [{currentScenario.summaryFindings.confidenceInterval[0]}% - {currentScenario.summaryFindings.confidenceInterval[1]}%]
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4">
                    <span className="text-xs font-bold uppercase text-emerald-800 block">Primary Systemic Gain</span>
                    <p className="text-sm font-semibold text-emerald-950 mt-1">
                      {currentScenario.summaryFindings.primaryGain}
                    </p>
                  </div>
                  <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4">
                    <span className="text-xs font-bold uppercase text-amber-800 block">Critical Systemic Risk</span>
                    <p className="text-sm font-semibold text-amber-950 mt-1">
                      {currentScenario.summaryFindings.criticalRisk}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Causal Pathway & Invalidation Triggers:</span>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div><strong>Pathway:</strong> {currentScenario.summaryFindings.causalPathway}</div>
                    <div><strong>Invalidation Conditions:</strong> {currentScenario.summaryFindings.invalidationConditions.join(', ')}</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 4: LEVERAGE POINT ENGINE (MEADOWS HIERARCHY) */}
      {activeTab === 'leverage' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-6 border border-slate-800 shadow-md">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Donella Meadows Systems Leverage Hierarchy
            </h2>
            <p className="text-slate-300 text-xs mt-1 max-w-3xl leading-relaxed">
              Prioritizing catalytic interventions based on structural systemic leverage points (feedback gains, information flows, and self-organization rules) rather than superficial parameters.
            </p>
          </div>

          <div className="space-y-4">
            {CANDIDATE_INTERVENTIONS.map((int) => {
              const meadowsEval = SystemsDynamicsEngine.evaluateMeadowsLeverage(int.id, CANONICAL_MATHARE_SYSTEM_MODEL);
              return (
                <div
                  key={int.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-indigo-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                        #{int.leverageRank}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{int.targetName}</h3>
                        <span className="text-xs text-indigo-600 font-semibold">{meadowsEval.meadowsCategory}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onInitiateMissionWithIntervention?.(int)}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" /> Dispatch to Agent DAG
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{int.mechanism}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block">Required Capital</span>
                      <span className="font-bold text-slate-800">${(int.costUsd / 1000).toFixed(0)}k Patient Equity</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Time to Impact</span>
                      <span className="font-bold text-slate-800">{int.timeHorizonMonths} Months</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Flourishing Delta</span>
                      <span className="font-bold text-emerald-600">+{int.flourishingDelta}% Index</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Reversibility</span>
                      <span className="font-bold text-indigo-700 capitalize">{int.reversibility.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100">
                    <span><strong>System Dependencies:</strong> {int.systemDependencies.join(', ')}</span>
                    <span><strong>Confidence:</strong> {int.confidence}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: AUTONOMOUS AGENT SYSTEMS REASONING */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-md">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              Autonomous Agent Systems Reasoning Substrate
            </h2>
            <p className="text-slate-300 text-xs mt-1">
              Atlas agents execute the closed-loop operating cycle: <strong>Sense → Structure → Model → Simulate → Decide → Act → Observe → Update</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700 font-bold">
                  <Cpu className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Systems Diagnostic Agent</h4>
                  <span className="text-[11px] text-slate-500">Sense & Structure Loop</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extracts boundary entities, stocks, flows, delays, and feedback loops (R1, R2, B1) from live sensor and community telemetry.
              </p>
              <div className="bg-slate-50 p-2.5 rounded text-[11px] text-slate-600 font-mono border border-slate-200">
                Action: discover_system_boundaries()
                <br />
                Epistemic Confidence: 95%
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                  <BarChart3 className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Scenario Simulation Agent</h4>
                  <span className="text-[11px] text-slate-500">Model & Simulate Loop</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Runs numerical differential equations over time across the 8 forms of capital, computing flourishing deltas and counterfactual risks.
              </p>
              <div className="bg-slate-50 p-2.5 rounded text-[11px] text-slate-600 font-mono border border-slate-200">
                Action: simulate_scenario()
                <br />
                Differential Engine: Euler dt=1mo
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-amber-100 text-amber-700 font-bold">
                  <Zap className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Intervention Agent</h4>
                  <span className="text-[11px] text-slate-500">Decide & Act Loop</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identifies high-leverage intervention points, enforces human approval gatekeeping for capital release, and verifies Canon XXIII guardrails.
              </p>
              <div className="bg-slate-50 p-2.5 rounded text-[11px] text-slate-600 font-mono border border-slate-200">
                Action: request_approval()
                <br />
                Gatekeeper: Human Sovereign Arbiter
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Continuous Model Learning & Telemetry Invalidation Feed
            </h3>
            <div className="space-y-2.5">
              {learningLog.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-400 font-mono">{log.time}</span>
                    <span className="text-slate-800 font-medium">{log.text}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold self-start sm:self-auto">
                    {log.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: EPISTEMIC PROVENANCE & GOVERNANCE */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Epistemic Attribution & Knowledge Classification
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every node, stock, flow, and assumption in Atlas is tagged with its strict epistemic attribution to prevent hallucinated models from masquerading as verified empirical truth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/60">
                <span className="text-xs font-bold text-emerald-900 block">Observed</span>
                <span className="text-xs text-emerald-700 mt-1 block">Empirically measured by verified IoT, satellite, or ground sensor mesh.</span>
              </div>
              <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/60">
                <span className="text-xs font-bold text-blue-900 block">User Provided</span>
                <span className="text-xs text-blue-700 mt-1 block">Directly asserted by accredited field partners or bioregional stewards.</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-xs font-bold text-slate-900 block">Imported Data</span>
                <span className="text-xs text-slate-600 mt-1 block">Hydrological, demographic, or meteorological national datasets.</span>
              </div>
              <div className="p-3 rounded-lg border border-indigo-200 bg-indigo-50/60">
                <span className="text-xs font-bold text-indigo-900 block">Model Inference</span>
                <span className="text-xs text-indigo-700 mt-1 block">Mathematically derived via calibrated differential equations.</span>
              </div>
              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/60">
                <span className="text-xs font-bold text-amber-900 block">AI Hypothesis</span>
                <span className="text-xs text-amber-700 mt-1 block">Heuristic correlation proposed by agent, requiring empirical calibration.</span>
              </div>
            </div>
          </div>

          {/* Assumptions Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3">Model Core Working Assumptions</h3>
            <div className="space-y-3">
              {CANONICAL_MATHARE_SYSTEM_MODEL.assumptions.map((assump) => (
                <div key={assump.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{assump.statement}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        assump.riskIfViolated === 'catastrophic'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Risk: {assump.riskIfViolated}
                    </span>
                  </div>
                  <div className="text-slate-500 flex items-center justify-between pt-1">
                    <span><strong>Validation Method:</strong> {assump.validationMethod}</span>
                    <span className="font-medium text-indigo-600">Tested: {assump.tested ? 'Yes (Verified)' : 'Pending Field Audit'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
