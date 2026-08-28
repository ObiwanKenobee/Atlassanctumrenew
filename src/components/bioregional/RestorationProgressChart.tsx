import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot
} from 'recharts';
import {
  TrendingUp,
  Milestone,
  CheckCircle2,
  TreePine,
  Droplets,
  Sprout,
  Bird,
  ShieldCheck,
  Filter,
  Layers,
  Sparkles,
  Info,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface EcologicalBenchmarkPoint {
  yearIndex: number;
  yearLabel: string;
  phaseName: string;
  isHistorical: boolean;
  canopyCoverPercent: number;        // 0-100%
  aquiferHeadPercent: number;        // 0-100%
  soilOrganicMatterPercent: number;  // % SOM (e.g. 1.8 - 6.0)
  biodiversityScore: number;         // 0-100 index
  uncertaintyMargin: number;         // ± %
}

export interface EnvironmentalMilestone {
  id: string;
  yearIndex: number;
  yearLabel: string;
  title: string;
  category: 'Canopy' | 'Hydrology' | 'Soil' | 'Biodiversity';
  metricValue: number; // Y-axis value
  metricDisplay: string;
  targetSeries: 'canopyCoverPercent' | 'aquiferHeadPercent' | 'soilOrganicMatterPercent' | 'biodiversityScore';
  status: 'In-Situ Verified' | 'On Track' | 'Future Counterfactual';
  verifyingCouncil: string;
  color: string;
  description: string;
}

const FIVE_YEAR_BENCHMARK_DATA: EcologicalBenchmarkPoint[] = [
  {
    yearIndex: 0,
    yearLabel: 'Year 0 (2024)',
    phaseName: 'Degraded Baseline',
    isHistorical: true,
    canopyCoverPercent: 28,
    aquiferHeadPercent: 32,
    soilOrganicMatterPercent: 1.8,
    biodiversityScore: 35,
    uncertaintyMargin: 2.1
  },
  {
    yearIndex: 1,
    yearLabel: 'Year 1 (2025)',
    phaseName: 'Bio-Swales & Inoculation',
    isHistorical: true,
    canopyCoverPercent: 38,
    aquiferHeadPercent: 44,
    soilOrganicMatterPercent: 2.6,
    biodiversityScore: 48,
    uncertaintyMargin: 3.0
  },
  {
    yearIndex: 2,
    yearLabel: 'Year 2 (2026)',
    phaseName: 'Current In-Situ Status',
    isHistorical: true,
    canopyCoverPercent: 54,
    aquiferHeadPercent: 61,
    soilOrganicMatterPercent: 3.8,
    biodiversityScore: 64,
    uncertaintyMargin: 3.8
  },
  {
    yearIndex: 3,
    yearLabel: 'Year 3 (2027)',
    phaseName: 'Riparian Vascular Equilibrium',
    isHistorical: false,
    canopyCoverPercent: 68,
    aquiferHeadPercent: 74,
    soilOrganicMatterPercent: 4.5,
    biodiversityScore: 76,
    uncertaintyMargin: 5.2
  },
  {
    yearIndex: 4,
    yearLabel: 'Year 4 (2028)',
    phaseName: 'Canopy & Corridor Maturation',
    isHistorical: false,
    canopyCoverPercent: 82,
    aquiferHeadPercent: 86,
    soilOrganicMatterPercent: 5.2,
    biodiversityScore: 86,
    uncertaintyMargin: 6.4
  },
  {
    yearIndex: 5,
    yearLabel: 'Year 5 (2029)',
    phaseName: 'Climax Bioregional Harmony',
    isHistorical: false,
    canopyCoverPercent: 94,
    aquiferHeadPercent: 95,
    soilOrganicMatterPercent: 5.8,
    biodiversityScore: 94,
    uncertaintyMargin: 7.5
  }
];

export const ENVIRONMENTAL_MILESTONES: EnvironmentalMilestone[] = [
  {
    id: 'milestone-01',
    yearIndex: 1,
    yearLabel: 'Year 1 (2025)',
    title: 'M1: 500ha Vetiver Bio-Swales Active',
    category: 'Hydrology',
    targetSeries: 'aquiferHeadPercent',
    metricValue: 44,
    metricDisplay: '44% Aquifer Head • Silt -52%',
    status: 'In-Situ Verified',
    verifyingCouncil: 'Nairobi-Mathare Basin Coalition',
    color: '#06B6D4', // Cyan
    description: 'Stabilized 1.45km of riparian embankment with living vetiver swales filtering high-turbidity runoff.'
  },
  {
    id: 'milestone-02',
    yearIndex: 2,
    yearLabel: 'Year 2 (2026)',
    title: 'M2: Native Podocarpus Canopy Closed',
    category: 'Canopy',
    targetSeries: 'canopyCoverPercent',
    metricValue: 54,
    metricDisplay: '54% Canopy Cover • 1,420 tCO2e/yr',
    status: 'In-Situ Verified',
    verifyingCouncil: 'Aberdare Forest Indigenous Guardians',
    color: '#10B981', // Emerald
    description: 'Climax multi-strata canopy volume verified by drone lidar transect across high-altitude cloud ridges.'
  },
  {
    id: 'milestone-03',
    yearIndex: 3,
    yearLabel: 'Year 3 (2027)',
    title: 'M3: Subterranean Aquifer Equalization',
    category: 'Hydrology',
    targetSeries: 'aquiferHeadPercent',
    metricValue: 74,
    metricDisplay: '74% Head • +1.8 bar Recovery',
    status: 'On Track',
    verifyingCouncil: 'Rift Valley Groundwater Directorate',
    color: '#38BDF8', // Sky Blue
    description: 'Permeable volcanic gravel basins and subsurface infiltration galleries restore baseline piezometric pressure.'
  },
  {
    id: 'milestone-04',
    yearIndex: 4,
    yearLabel: 'Year 4 (2028)',
    title: 'M4: Keystone Ungulate Corridor Reopened',
    category: 'Biodiversity',
    targetSeries: 'biodiversityScore',
    metricValue: 86,
    metricDisplay: 'Score 86/100 • 142 Avian Species',
    status: 'Future Counterfactual',
    verifyingCouncil: 'Kenya Wildlife Bio-Acoustic Mesh',
    color: '#F59E0B', // Amber
    description: 'Continuous native floral and ungulate corridor connecting highland cloud forest to the Great Rift Valley basin.'
  },
  {
    id: 'milestone-05',
    yearIndex: 5,
    yearLabel: 'Year 5 (2029)',
    title: 'M5: Living Soil Equilibrium Certified',
    category: 'Soil',
    targetSeries: 'biodiversityScore',
    metricValue: 94,
    metricDisplay: '5.8% SOM • 18.2 mg/g Glomalin',
    status: 'Future Counterfactual',
    verifyingCouncil: 'Agroforestry Soil Testing Mesh',
    color: '#EAB308', // Yellow-Gold
    description: 'Full fungal mycorrhizal colonization in topsoil, achieving deep moisture sponge retention and net-negative carbon sinking.'
  }
];

interface RestorationProgressChartProps {
  currentBioregionName?: string;
}

export const RestorationProgressChart: React.FC<RestorationProgressChartProps> = ({
  currentBioregionName = 'Aberdare Range & Riparian Catchment'
}) => {
  // Toggleable markers state
  const [activeMilestones, setActiveMilestones] = useState<Record<string, boolean>>({
    'milestone-01': true,
    'milestone-02': true,
    'milestone-03': true,
    'milestone-04': false,
    'milestone-05': false
  });

  // Series visibility toggles
  const [visibleSeries, setVisibleSeries] = useState<{
    canopy: boolean;
    aquifer: boolean;
    soil: boolean;
    biodiversity: boolean;
  }>({
    canopy: true,
    aquifer: true,
    soil: true,
    biodiversity: true
  });

  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>('milestone-02');

  const toggleMilestone = (id: string) => {
    setActiveMilestones(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    setSelectedMilestoneId(id);
    audioFeedback.playMicroTick();
  };

  const toggleAllMilestones = (enable: boolean) => {
    const next: Record<string, boolean> = {};
    ENVIRONMENTAL_MILESTONES.forEach(m => {
      next[m.id] = enable;
    });
    setActiveMilestones(next);
    audioFeedback.playMicroTick();
  };

  const toggleSeries = (key: keyof typeof visibleSeries) => {
    setVisibleSeries(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    audioFeedback.playMicroTick();
  };

  // Currently enabled milestones
  const activeMilestonesList = useMemo(() => {
    return ENVIRONMENTAL_MILESTONES.filter(m => activeMilestones[m.id]);
  }, [activeMilestones]);

  const selectedMilestone = useMemo(() => {
    return ENVIRONMENTAL_MILESTONES.find(m => m.id === selectedMilestoneId) || null;
  }, [selectedMilestoneId]);

  return (
    <div id="restoration-progress-chart-container" className="bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm overflow-hidden space-y-5 p-6 shadow-2xl text-[#F5F5F0]">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#C5A059]" />
              5-YEAR ECOLOGICAL RESTORATION BENCHMARKS
            </span>
            <span className="px-2 py-0.5 rounded bg-[#1B3022] text-emerald-300 text-[10px] font-mono border border-emerald-500/40 font-bold">
              In-Situ + Counterfactual
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Bioregional Restoration Trajectory
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans">
            5-year multi-indicator trajectories tracking canopy density, aquifer head recovery, soil organic matter, and biodiversity indices. Toggle environmental milestones to overlay verified field interventions on the benchmark timeline.
          </p>
        </div>

        {/* Milestone Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleAllMilestones(true)}
            className="px-2.5 py-1.5 bg-[#171717] hover:bg-[#222222] border border-[#F5F5F0]/15 text-[#F5F5F0]/70 hover:text-[#F5F5F0] text-xs font-mono rounded transition-colors cursor-pointer"
          >
            Show All Milestones
          </button>
          <button
            onClick={() => toggleAllMilestones(false)}
            className="px-2.5 py-1.5 bg-[#171717] hover:bg-[#222222] border border-[#F5F5F0]/15 text-[#F5F5F0]/70 hover:text-[#F5F5F0] text-xs font-mono rounded transition-colors cursor-pointer"
          >
            Hide All
          </button>
        </div>
      </div>

      {/* Series Filter Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-[#F5F5F0]/40 uppercase flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#C5A059]" />
            Series:
          </span>

          <button
            onClick={() => toggleSeries('canopy')}
            className={`px-2.5 py-1 rounded border flex items-center gap-1.5 cursor-pointer transition-all ${
              visibleSeries.canopy
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-[#121212] border-[#F5F5F0]/10 text-[#F5F5F0]/40'
            }`}
          >
            <TreePine className="w-3 h-3 text-emerald-400" />
            <span>Canopy Cover (%)</span>
            {visibleSeries.canopy ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3" />}
          </button>

          <button
            onClick={() => toggleSeries('aquifer')}
            className={`px-2.5 py-1 rounded border flex items-center gap-1.5 cursor-pointer transition-all ${
              visibleSeries.aquifer
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : 'bg-[#121212] border-[#F5F5F0]/10 text-[#F5F5F0]/40'
            }`}
          >
            <Droplets className="w-3 h-3 text-cyan-400" />
            <span>Aquifer Head (%)</span>
            {visibleSeries.aquifer ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3" />}
          </button>

          <button
            onClick={() => toggleSeries('biodiversity')}
            className={`px-2.5 py-1 rounded border flex items-center gap-1.5 cursor-pointer transition-all ${
              visibleSeries.biodiversity
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                : 'bg-[#121212] border-[#F5F5F0]/10 text-[#F5F5F0]/40'
            }`}
          >
            <Bird className="w-3 h-3 text-amber-400" />
            <span>Biodiversity Index (/100)</span>
            {visibleSeries.biodiversity ? <Eye className="w-3 h-3 text-amber-400" /> : <EyeOff className="w-3 h-3" />}
          </button>

          <button
            onClick={() => toggleSeries('soil')}
            className={`px-2.5 py-1 rounded border flex items-center gap-1.5 cursor-pointer transition-all ${
              visibleSeries.soil
                ? 'bg-yellow-950/60 border-yellow-500/50 text-yellow-300'
                : 'bg-[#121212] border-[#F5F5F0]/10 text-[#F5F5F0]/40'
            }`}
          >
            <Sprout className="w-3 h-3 text-yellow-400" />
            <span>Soil Organic Matter (%)</span>
            {visibleSeries.soil ? <Eye className="w-3 h-3 text-yellow-400" /> : <EyeOff className="w-3 h-3" />}
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#F5F5F0]/40">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-emerald-400 inline-block" /> Solid = In-Situ Data
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 border-t border-dashed border-cyan-400 inline-block" /> Dashed = Causal Model
          </span>
        </div>
      </div>

      {/* Interactive Milestone Marker Toggle Bar */}
      <div className="p-3.5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5">
            <Milestone className="w-3.5 h-3.5 text-[#C5A059]" />
            Toggleable Environmental Milestones (Click to toggle markers on chart):
          </span>
          <span className="text-[10px] font-mono text-[#F5F5F0]/40">
            {activeMilestonesList.length} Active on Chart
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1">
          {ENVIRONMENTAL_MILESTONES.map(m => {
            const isActive = !!activeMilestones[m.id];
            const isSelected = selectedMilestoneId === m.id;

            return (
              <button
                key={m.id}
                onClick={() => toggleMilestone(m.id)}
                className={`p-2.5 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isActive
                    ? isSelected
                      ? 'bg-[#1C1C1C] border-[#C5A059] shadow-md ring-1 ring-[#C5A059]/50'
                      : 'bg-[#161616] border-[#F5F5F0]/20 hover:border-[#F5F5F0]/40'
                    : 'bg-[#0E0E0E] border-[#F5F5F0]/5 opacity-50 hover:opacity-80'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] font-mono font-bold uppercase" style={{ color: m.color }}>
                    {m.yearLabel.split(' ')[0]} {m.yearLabel.split(' ')[1]}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'animate-pulse' : 'bg-transparent border border-[#F5F5F0]/20'}`} style={{ backgroundColor: isActive ? m.color : undefined }} />
                </div>
                <div className="text-[11px] font-serif font-bold text-[#F5F5F0] line-clamp-1 leading-tight">
                  {m.title}
                </div>
                <div className="text-[9px] font-mono text-[#F5F5F0]/50 line-clamp-1">
                  {m.metricDisplay}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Recharts Chart Stage */}
      <div className="relative w-full h-[360px] bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm p-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={FIVE_YEAR_BENCHMARK_DATA}
            margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />

            <XAxis
              dataKey="yearLabel"
              stroke="#666666"
              tick={{ fill: '#888888', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={{ stroke: '#333333' }}
            />

            <YAxis
              yAxisId="percentage"
              domain={[0, 100]}
              stroke="#666666"
              tick={{ fill: '#888888', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={{ stroke: '#333333' }}
              tickFormatter={(v) => `${v}%`}
            />

            <YAxis
              yAxisId="soil"
              orientation="right"
              domain={[0, 8]}
              stroke="#666666"
              tick={{ fill: '#EAB308', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={{ stroke: '#333333' }}
              tickFormatter={(v) => `${v}% SOM`}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0]?.payload as EcologicalBenchmarkPoint;
                  return (
                    <div className="p-3 bg-[#111111] border border-[#C5A059]/60 rounded shadow-xl text-xs font-mono space-y-2 text-[#F5F5F0]">
                      <div className="flex items-center justify-between gap-4 border-b border-[#F5F5F0]/15 pb-1">
                        <span className="font-bold text-[#C5A059]">{label}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] ${dataPoint?.isHistorical ? 'bg-emerald-950 text-emerald-300' : 'bg-cyan-950 text-cyan-300'}`}>
                          {dataPoint?.isHistorical ? 'Ground Truth' : 'Predicted Target'}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#F5F5F0]/60 italic">
                        Phase: {dataPoint?.phaseName}
                      </div>
                      <div className="space-y-1 pt-1">
                        {payload.map((entry, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4 text-[11px]">
                            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              {entry.name}:
                            </span>
                            <span className="font-bold text-[#F5F5F0]">
                              {entry.value} {String(entry.name || '').includes('SOM') ? '% SOM' : String(entry.name || '').includes('Index') ? '/100' : '%'}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="text-[9px] text-[#F5F5F0]/40 pt-1 border-t border-[#F5F5F0]/10">
                        Uncertainty Margin: ±{dataPoint?.uncertaintyMargin}%
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Areas for background gradient depth */}
            {visibleSeries.canopy && (
              <Area
                yAxisId="percentage"
                type="monotone"
                dataKey="canopyCoverPercent"
                fill="#10B981"
                fillOpacity={0.08}
                stroke="none"
              />
            )}
            {visibleSeries.aquifer && (
              <Area
                yAxisId="percentage"
                type="monotone"
                dataKey="aquiferHeadPercent"
                fill="#06B6D4"
                fillOpacity={0.06}
                stroke="none"
              />
            )}

            {/* Primary metric lines */}
            {visibleSeries.canopy && (
              <Line
                yAxisId="percentage"
                type="monotone"
                dataKey="canopyCoverPercent"
                name="Canopy Cover"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10B981', stroke: '#000000', strokeWidth: 1.5 }}
                activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            )}

            {visibleSeries.aquifer && (
              <Line
                yAxisId="percentage"
                type="monotone"
                dataKey="aquiferHeadPercent"
                name="Aquifer Head Recovery"
                stroke="#06B6D4"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#06B6D4', stroke: '#000000', strokeWidth: 1.5 }}
                activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            )}

            {visibleSeries.biodiversity && (
              <Line
                yAxisId="percentage"
                type="monotone"
                dataKey="biodiversityScore"
                name="Biodiversity Index"
                stroke="#F59E0B"
                strokeWidth={2.0}
                strokeDasharray="4 2"
                dot={{ r: 3.5, fill: '#F59E0B', stroke: '#000000' }}
                activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            )}

            {visibleSeries.soil && (
              <Line
                yAxisId="soil"
                type="monotone"
                dataKey="soilOrganicMatterPercent"
                name="Soil Organic Matter (SOM)"
                stroke="#EAB308"
                strokeWidth={2.2}
                dot={{ r: 3.5, fill: '#EAB308', stroke: '#000000' }}
                activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            )}

            {/* In-Situ Verification Boundary (Year 2 = 2026) */}
            <ReferenceLine
              yAxisId="percentage"
              x="Year 2 (2026)"
              stroke="#C5A059"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              label={{
                value: 'PRESENT: In-Situ Ground Truth Boundary',
                position: 'insideTopLeft',
                fill: '#C5A059',
                fontSize: 9,
                fontFamily: 'monospace'
              }}
            />

            {/* DYNAMIC TOGGLEABLE MILESTONE REFERENCE LINES & DOTS */}
            {activeMilestonesList.map(m => {
              return (
                <React.Fragment key={m.id}>
                  <ReferenceLine
                    yAxisId="percentage"
                    x={m.yearLabel}
                    stroke={m.color}
                    strokeWidth={1.2}
                    strokeDasharray="2 2"
                    label={{
                      value: m.title.split(':')[0],
                      position: 'top',
                      fill: m.color,
                      fontSize: 10,
                      fontFamily: 'monospace',
                      fontWeight: 'bold'
                    }}
                  />
                  <ReferenceDot
                    yAxisId="percentage"
                    x={m.yearLabel}
                    y={m.metricValue}
                    r={6}
                    fill={m.color}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                </React.Fragment>
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Milestone Deep-Dive Card */}
      {selectedMilestone && (
        <div className="p-4 bg-[#141414] border border-[#C5A059]/40 rounded-sm space-y-2 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5F5F0]/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedMilestone.color }} />
              <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
                {selectedMilestone.title}
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black border border-[#F5F5F0]/10 text-[#C5A059]">
                {selectedMilestone.yearLabel}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[10px] text-[#F5F5F0]/40">Status:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedMilestone.status === 'In-Situ Verified'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : selectedMilestone.status === 'On Track'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}>
                {selectedMilestone.status}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
            {selectedMilestone.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] font-mono text-[#F5F5F0]/60">
            <div>
              <span className="text-[#C5A059] block text-[9px] uppercase font-bold">Benchmark Metric:</span>
              <span className="text-[#F5F5F0]">{selectedMilestone.metricDisplay}</span>
            </div>
            <div>
              <span className="text-[#C5A059] block text-[9px] uppercase font-bold">Verifying Body:</span>
              <span className="text-[#F5F5F0]">{selectedMilestone.verifyingCouncil}</span>
            </div>
            <div>
              <span className="text-[#C5A059] block text-[9px] uppercase font-bold">Epistemic Standard:</span>
              <span className="text-emerald-400">Commandment II Verified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
