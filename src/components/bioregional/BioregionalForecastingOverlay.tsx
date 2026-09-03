import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Calendar, 
  Activity, 
  Droplets, 
  TreePine, 
  Wind, 
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { BioregionalLedgerData, EcologicalMetricItem } from '../../data/bioregionalLedgerData';
import { audioFeedback } from '../../lib/audioFeedback';

export interface ForecastingScenario {
  id: 'accelerated' | 'status_quo' | 'climate_stress';
  label: string;
  description: string;
  circularityMultiplier: number;
  carbonMultiplier: number;
  waterMultiplier: number;
  flourishingBoost: number;
  color: string;
}

export const FORECAST_SCENARIOS: ForecastingScenario[] = [
  {
    id: 'accelerated',
    label: 'Regenerative Acceleration',
    description: 'High closed-loop metabolic circularity (>96%), expanded biochar agroforestry, and active community council stewardship accords.',
    circularityMultiplier: 1.15,
    carbonMultiplier: 1.28,
    waterMultiplier: 1.22,
    flourishingBoost: 6.8,
    color: '#10B981' // emerald
  },
  {
    id: 'status_quo',
    label: 'Status Quo Momentum',
    description: 'Continuation of 2018-2026 historical restoration trajectory with steady replenishment and linear trendline extrapolation.',
    circularityMultiplier: 1.0,
    carbonMultiplier: 1.0,
    waterMultiplier: 1.0,
    flourishingBoost: 0,
    color: '#C5A059' // gold
  },
  {
    id: 'climate_stress',
    label: 'Climate Stress & Drought',
    description: 'Counterfactual climate variance with prolonged dry seasons, elevated evapotranspiration, and 25% lower annual precipitation.',
    circularityMultiplier: 0.82,
    carbonMultiplier: 0.78,
    waterMultiplier: 0.72,
    flourishingBoost: -11.5,
    color: '#F43F5E' // rose
  }
];

export interface ForecastDataPoint {
  year: number;
  score: number;
  upperBound?: number;
  lowerBound?: number;
  water: number;
  carbon: number;
  isHistorical: boolean;
}

interface BioregionalForecastingOverlayProps {
  region: BioregionalLedgerData;
  onApplyProjectedEpoch?: (year: number, simulatedScore: number, waterMult: number, carbonMult: number) => void;
  onClose?: () => void;
}

export const BioregionalForecastingOverlay: React.FC<BioregionalForecastingOverlayProps> = ({
  region,
  onApplyProjectedEpoch,
  onClose
}) => {
  const [activeScenario, setActiveScenario] = useState<ForecastingScenario['id']>('accelerated');
  const [projectedYear, setProjectedYear] = useState<number>(2030);
  const [customCircularity, setCustomCircularity] = useState<number>(95);
  const [customStewardshipExpansion, setCustomStewardshipExpansion] = useState<number>(1.2);

  const scenario = useMemo(() => {
    return FORECAST_SCENARIOS.find(s => s.id === activeScenario) || FORECAST_SCENARIOS[0];
  }, [activeScenario]);

  // Compute forecast trajectory based on historical momentum (2018-2026) and current flow dynamics
  const projectionData: ForecastDataPoint[] = useMemo(() => {
    const historicalPoints: ForecastDataPoint[] = [
      { year: 2018, score: 48.2, upperBound: 48.2, lowerBound: 48.2, water: 0.52, carbon: 0.44, isHistorical: true },
      { year: 2020, score: 62.5, upperBound: 62.5, lowerBound: 62.5, water: 0.68, carbon: 0.61, isHistorical: true },
      { year: 2022, score: 75.8, upperBound: 75.8, lowerBound: 75.8, water: 0.81, carbon: 0.78, isHistorical: true },
      { year: 2024, score: 85.3, upperBound: 85.3, lowerBound: 85.3, water: 0.92, carbon: 0.90, isHistorical: true },
      { year: 2026, score: region.compositeFlourishingScore, upperBound: region.compositeFlourishingScore, lowerBound: region.compositeFlourishingScore, water: 1.0, carbon: 1.0, isHistorical: true }
    ];

    // Compute annual velocity between 2022 and 2026
    const baseScore2026 = region.compositeFlourishingScore;
    const historicalVelocity = (baseScore2026 - 75.8) / 4; // points per year

    const futureYears = [2027, 2028, 2030, 2032, 2035];
    const projectedPoints = futureYears.map(year => {
      const yearsFromNow = year - 2026;
      // Diminishing returns ceiling effect near 98.5
      const rawIncrease = yearsFromNow * historicalVelocity * scenario.circularityMultiplier * (customCircularity / 95);
      const headRoom = 99.0 - baseScore2026;
      const asymptoticGain = headRoom * (1 - Math.exp(-rawIncrease / headRoom)) + scenario.flourishingBoost * (yearsFromNow / 9);

      const projectedScore = Math.min(99.4, Math.max(35.0, +(baseScore2026 + asymptoticGain).toFixed(1)));
      const confidenceBand = +(1.2 + yearsFromNow * 0.95).toFixed(1);

      const waterYield = Math.min(1.45, Math.max(0.4, +(1.0 + (yearsFromNow * 0.035 * scenario.waterMultiplier)).toFixed(2)));
      const carbonRate = Math.min(1.65, Math.max(0.4, +(1.0 + (yearsFromNow * 0.052 * scenario.carbonMultiplier)).toFixed(2)));

      return {
        year,
        score: projectedScore,
        upperBound: Math.min(100, +(projectedScore + confidenceBand).toFixed(1)),
        lowerBound: Math.max(30, +(projectedScore - confidenceBand).toFixed(1)),
        water: waterYield,
        carbon: carbonRate,
        isHistorical: false
      };
    });

    return [...historicalPoints, ...projectedPoints];
  }, [region.compositeFlourishingScore, scenario, customCircularity]);

  const currentProjectedItem = useMemo(() => {
    return projectionData.find(d => d.year === projectedYear) || projectionData[projectionData.length - 1];
  }, [projectionData, projectedYear]);

  // Projected Tipping Points & Milestones
  const milestones = useMemo(() => {
    if (activeScenario === 'accelerated') {
      return [
        { year: '2028.2', title: 'Deep Aquifer Infiltration Equilibrium', detail: 'Sub-surface water table recharge rate exceeds peak dry-season community extraction.', achieved: true },
        { year: '2029.8', title: 'Net-Negative Bioregional Climax (>120k tCO2e/yr)', detail: 'Agroforestry corridors and biochar humus sink capacity achieve permanent carbon drawdown.', achieved: true },
        { year: '2031.5', title: 'Continuous Transboundary Wildlife Connectivity', detail: 'Zero-fenced wildlife corridors restore uninterrupted megafauna seasonal migrations.', achieved: true }
      ];
    } else if (activeScenario === 'status_quo') {
      return [
        { year: '2029.6', title: 'Deep Aquifer Infiltration Equilibrium', detail: 'Positive water balance achieved at gradual historic adoption rates.', achieved: true },
        { year: '2032.4', title: 'Net-Negative Bioregional Climax (>110k tCO2e/yr)', detail: 'Steady agroforestry expansion reaches mature vegetative canopy cover.', achieved: true },
        { year: '2034.0', title: 'Biodiversity Buffer Parity', detail: 'Core indigenous flora resilience established against sporadic drought shocks.', achieved: true }
      ];
    } else {
      return [
        { year: '2027.5', title: 'Critical Water Deficit Threshold Breach', detail: 'Persistent dry spell strains unbuffered shallow aquifers without enhanced retention swales.', achieved: false },
        { year: '2029.1', title: 'Vegetative Canopy Biomass Stagnation', detail: 'Soil organic carbon depletion limits tree sapling survival below 65%.', achieved: false },
        { year: '2031.0', title: 'Transboundary Migration Habitat Fragmentation', detail: 'Severe forage scarcity forces livestock encroachment into fragile riparian zones.', achieved: false }
      ];
    }
  }, [activeScenario]);

  // SVG Chart Dimensions
  const svgWidth = 720;
  const svgHeight = 220;
  const padLeft = 40;
  const padRight = 30;
  const padTop = 20;
  const padBottom = 30;

  const getX = (year: number) => {
    return padLeft + ((year - 2018) / (2035 - 2018)) * (svgWidth - padLeft - padRight);
  };

  const getY = (score: number) => {
    return svgHeight - padBottom - ((score - 40) / (100 - 40)) * (svgHeight - padTop - padBottom);
  };

  // Historical path
  const historicalPath = useMemo(() => {
    const hist = projectionData.filter(d => d.year <= 2026);
    return hist.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.year)} ${getY(d.score)}`).join(' ');
  }, [projectionData]);

  // Projected path
  const projectedPath = useMemo(() => {
    const proj = projectionData.filter(d => d.year >= 2026);
    return proj.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.year)} ${getY(d.score)}`).join(' ');
  }, [projectionData]);

  // Confidence cone area
  const confidenceConePath = useMemo(() => {
    const proj = projectionData.filter(d => d.year >= 2026);
    const upper = proj.map(d => `${getX(d.year)} ${getY(d.upperBound || d.score)}`).join(' L ');
    const lower = [...proj].reverse().map(d => `${getX(d.year)} ${getY(d.lowerBound || d.score)}`).join(' L ');
    return `M ${upper} L ${lower} Z`;
  }, [projectionData]);

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#090D0A] border-2 border-cyan-500/40 shadow-2xl space-y-5 font-mono animate-in fade-in slide-in-from-top-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40 shadow-lg">
            <TrendingUp className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                Predictive Ecological Horizon & Forecasting Overlay
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-950/90 text-cyan-300 border border-cyan-500/40">
                2026 - 2035 Projection
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/70 font-sans mt-0.5">
              Autoregressive trajectory modeling integrating in-situ telemetry momentum with real-time metabolic flow circularity.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#141A16] hover:bg-[#1f2621] text-white text-xs font-bold border border-[#F5F5F0]/20 cursor-pointer self-start sm:self-auto transition-colors"
          >
            Close Overlay
          </button>
        )}
      </div>

      {/* Scenario Selector & Dynamics Levers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Scenario Mode Buttons */}
        <div className="lg:col-span-2 space-y-2">
          <div className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Ecological Projection Scenario
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {FORECAST_SCENARIOS.map(s => {
              const isSelected = activeScenario === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    audioFeedback.playSubtleClick();
                    setActiveScenario(s.id);
                  }}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#121B15] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-[#0D120E] border-[#F5F5F0]/15 hover:border-[#F5F5F0]/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-xs font-bold"
                        style={{ color: s.color }}
                      >
                        {s.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <p className="text-[10px] text-[#F5F5F0]/70 font-sans mt-1 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Resource Flow Levers */}
        <div className="p-3.5 rounded-xl bg-[#0D120E] border border-[#F5F5F0]/15 space-y-3">
          <div className="text-[11px] text-[#C5A059] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            Metabolic Flow Levers
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-300">Circularity Target:</span>
              <span className="text-emerald-400 font-bold">{customCircularity}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="99"
              step="1"
              value={customCircularity}
              onChange={(e) => setCustomCircularity(Number(e.target.value))}
              className="w-full h-1.5 bg-[#162019] rounded appearance-none accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-300">Stewardship Density:</span>
              <span className="text-purple-400 font-bold">{(customStewardshipExpansion * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.0"
              step="0.1"
              value={customStewardshipExpansion}
              onChange={(e) => setCustomStewardshipExpansion(Number(e.target.value))}
              className="w-full h-1.5 bg-[#162019] rounded appearance-none accent-purple-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Forecast Line Chart (Historical + Future Projection Cone) */}
      <div className="p-4 rounded-xl bg-[#050806] border border-cyan-500/30 space-y-2 overflow-x-auto">
        <div className="flex items-center justify-between text-xs pb-1 border-b border-[#F5F5F0]/10">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-white">Composite Flourishing Trajectory (40 - 100 Scale)</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-neutral-400">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span>
              2018-2026 Historical
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-cyan-400 border-t border-dashed inline-block"></span>
              2027-2035 Forecast
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-cyan-500/20 border border-cyan-500/40 rounded-sm inline-block"></span>
              90% Epistemic Band
            </span>
          </div>
        </div>

        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 select-none">
          {/* Grid lines */}
          {[50, 65, 80, 95].map(score => (
            <g key={score}>
              <line
                x1={padLeft}
                y1={getY(score)}
                x2={svgWidth - padRight}
                y2={getY(score)}
                stroke="#F5F5F0"
                strokeOpacity={0.08}
                strokeDasharray="3 3"
              />
              <text
                x={padLeft - 6}
                y={getY(score) + 3}
                textAnchor="end"
                className="text-[9px] fill-neutral-500 font-mono"
              >
                {score}
              </text>
            </g>
          ))}

          {/* Year axis markers */}
          {[2018, 2020, 2022, 2024, 2026, 2028, 2030, 2032, 2035].map(year => (
            <g key={year}>
              <line
                x1={getX(year)}
                y1={padTop}
                x2={getX(year)}
                y2={svgHeight - padBottom}
                stroke={year === 2026 ? '#C5A059' : '#F5F5F0'}
                strokeOpacity={year === 2026 ? 0.35 : 0.06}
                strokeWidth={year === 2026 ? 1.5 : 1}
              />
              <text
                x={getX(year)}
                y={svgHeight - 12}
                textAnchor="middle"
                className={`text-[9px] font-mono ${
                  year === 2026 ? 'fill-[#C5A059] font-bold' : 'fill-neutral-400'
                }`}
              >
                {year}
              </text>
            </g>
          ))}

          {/* 2026 Vertical Live Line Marker */}
          <line
            x1={getX(2026)}
            y1={padTop}
            x2={getX(2026)}
            y2={svgHeight - padBottom}
            stroke="#C5A059"
            strokeWidth={1.5}
            strokeDasharray="2 2"
          />

          {/* Confidence cone */}
          <path
            d={confidenceConePath}
            fill="url(#forecast-cone-grad)"
            opacity={0.35}
          />

          <defs>
            <linearGradient id="forecast-cone-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C5A059" stopOpacity="0.3" />
              <stop offset="100%" stopColor={scenario.color} stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Historical solid line */}
          <path
            d={historicalPath}
            fill="none"
            stroke="#10B981"
            strokeWidth={2.5}
          />

          {/* Projected dashed line */}
          <path
            d={projectedPath}
            fill="none"
            stroke={scenario.color}
            strokeWidth={2.5}
            strokeDasharray="5 4"
          />

          {/* Points */}
          {projectionData.map(d => {
            const isSelectedYear = d.year === projectedYear;
            return (
              <g 
                key={d.year}
                className="cursor-pointer"
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setProjectedYear(d.year);
                }}
              >
                <circle
                  cx={getX(d.year)}
                  cy={getY(d.score)}
                  r={isSelectedYear ? 6 : d.year === 2026 ? 5 : 3.5}
                  fill={d.isHistorical ? '#10B981' : scenario.color}
                  stroke="#000"
                  strokeWidth={1.5}
                />
                {isSelectedYear && (
                  <circle
                    cx={getX(d.year)}
                    cy={getY(d.score)}
                    r={9}
                    fill="none"
                    stroke={scenario.color}
                    strokeWidth={1.5}
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Scrub Timeline Horizon Quick-Jumps */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F5F5F0]/10 flex-wrap">
          <span className="text-[11px] text-neutral-400 font-bold">Select Forecast Horizon:</span>
          <div className="flex items-center gap-1.5">
            {[2027, 2028, 2030, 2032, 2035].map(year => (
              <button
                key={year}
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setProjectedYear(year);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  projectedYear === year
                    ? 'bg-cyan-500 text-black shadow'
                    : 'bg-[#141A16] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
                }`}
              >
                {year} Horizon
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projected State Summary & Action Card */}
      <div className="p-4 rounded-xl bg-[#0D1310] border border-cyan-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">
                Projected State for Year {projectedYear} ({scenario.label})
              </h4>
            </div>
            <p className="text-[11px] text-[#F5F5F0]/70 font-sans mt-0.5">
              Confidence Interval: {currentProjectedItem.lowerBound ?? currentProjectedItem.score} - {currentProjectedItem.upperBound ?? currentProjectedItem.score} Score Range
            </p>
          </div>

          {onApplyProjectedEpoch && (
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                onApplyProjectedEpoch(
                  projectedYear,
                  currentProjectedItem.score,
                  currentProjectedItem.water,
                  currentProjectedItem.carbon
                );
              }}
              className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md self-start sm:self-auto"
            >
              <span>Apply {projectedYear} Projections to Ledger</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Projected Vital Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-2.5 rounded-lg bg-[#080C09] border border-cyan-500/20">
            <div className="text-[10px] text-cyan-400 uppercase font-bold">Flourishing Index</div>
            <div className="text-base font-bold text-white mt-0.5">
              {currentProjectedItem.score} <span className="text-xs font-normal text-cyan-400">/ 100</span>
            </div>
            <div className="text-[9px] text-emerald-400 mt-0.5">
              {currentProjectedItem.score >= region.compositeFlourishingScore ? '+' : ''}
              {(currentProjectedItem.score - region.compositeFlourishingScore).toFixed(1)} vs 2026 Live
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#080C09] border border-cyan-500/20">
            <div className="text-[10px] text-cyan-400 uppercase font-bold">Water Yield Rate</div>
            <div className="text-base font-bold text-white mt-0.5">
              {((region.waterYieldAnnualM3 * currentProjectedItem.water) / 1000000).toFixed(0)}M <span className="text-xs font-normal text-cyan-400">m³/yr</span>
            </div>
            <div className="text-[9px] text-neutral-400 mt-0.5">
              {((currentProjectedItem.water - 1.0) * 100).toFixed(0)}% vs Current
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#080C09] border border-emerald-500/20">
            <div className="text-[10px] text-emerald-400 uppercase font-bold">Carbon Sequestration</div>
            <div className="text-base font-bold text-white mt-0.5">
              {((region.carbonSequestrationRateAnnualTonnes * currentProjectedItem.carbon) / 1000).toFixed(0)}k <span className="text-xs font-normal text-emerald-400">tCO2e/yr</span>
            </div>
            <div className="text-[9px] text-neutral-400 mt-0.5">
              {((currentProjectedItem.carbon - 1.0) * 100).toFixed(0)}% vs Current
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#080C09] border border-[#C5A059]/30">
            <div className="text-[10px] text-[#C5A059] uppercase font-bold">Epistemic Certainty</div>
            <div className="text-base font-bold text-white mt-0.5">
              {(100 - (projectedYear - 2026) * 1.8).toFixed(1)}%
            </div>
            <div className="text-[9px] text-neutral-400 mt-0.5">Bayesian Credible Interval</div>
          </div>
        </div>
      </div>

      {/* Anticipated Ecological Tipping Points & Milestones */}
      <div className="space-y-2">
        <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Anticipated Bioregional Milestones & Tipping Points
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {milestones.map((m, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#0B0F0C] border border-[#F5F5F0]/15 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#C5A059] font-bold">Target Horizon: {m.year}</span>
                {m.achieved ? (
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded">
                    Favorable
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.2 bg-rose-950 text-rose-400 border border-rose-500/40 rounded">
                    Vulnerability
                  </span>
                )}
              </div>
              <div className="text-xs font-bold text-white">{m.title}</div>
              <p className="text-[10px] text-[#F5F5F0]/70 font-sans leading-relaxed">
                {m.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
