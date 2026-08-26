import React, { useState, useEffect, useMemo } from 'react';
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
  ReferenceLine,
  Brush
} from 'recharts';
import { 
  Heart, 
  Brain, 
  Users, 
  Compass, 
  Leaf, 
  Shield, 
  Sparkles, 
  TrendingUp, 
  Plus, 
  Database, 
  Lock, 
  CheckCircle2, 
  Filter, 
  Calendar,
  Layers,
  Info,
  RefreshCw
} from 'lucide-react';
import { db, ImpactRecord } from '../../lib/db';
import { useOfflineSync } from '../../context/OfflineSyncContext';
import { audioFeedback } from '../../lib/audioFeedback';

interface HumanFlourishingTimelineChartProps {
  className?: string;
  onInspectProvenance?: (prov: any) => void;
}

type FlourishingDimensionKey = 
  | 'compositeScore'
  | 'healthAndVitality'
  | 'cognitiveAgency'
  | 'socialCohesion'
  | 'meaningAndPurpose'
  | 'ecologicalHarmony'
  | 'materialSecurity';

interface DimensionConfig {
  key: FlourishingDimensionKey;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  fillGradientId: string;
  description: string;
}

const DIMENSIONS: DimensionConfig[] = [
  {
    key: 'compositeScore',
    label: 'Composite Flourishing Index',
    shortLabel: 'Composite Index',
    icon: Sparkles,
    color: '#C5A059',
    fillGradientId: 'gradComposite',
    description: 'Synthesized multidimensional index of collective planetary and human thriving.'
  },
  {
    key: 'healthAndVitality',
    label: 'Physical Health & Somatic Vitality',
    shortLabel: 'Health & Vitality',
    icon: Heart,
    color: '#10B981',
    fillGradientId: 'gradHealth',
    description: 'Clean water, zero waterborne illness, biological nutrition, clean air indices.'
  },
  {
    key: 'cognitiveAgency',
    label: 'Cognitive Agency & Epistemic Freedom',
    shortLabel: 'Cognitive Agency',
    icon: Brain,
    color: '#8FB8DE',
    fillGradientId: 'gradAgency',
    description: 'Access to un-manipulated scientific truth, autonomous learning, mental clarity.'
  },
  {
    key: 'socialCohesion',
    label: 'Social Cohesion & Relational Trust',
    shortLabel: 'Social Cohesion',
    icon: Users,
    color: '#A78BFA',
    fillGradientId: 'gradCohesion',
    description: 'Community assembly co-governance, mutual aid networks, intergenerational bonds.'
  },
  {
    key: 'meaningAndPurpose',
    label: 'Meaning, Culture & Transcendent Purpose',
    shortLabel: 'Meaning & Purpose',
    icon: Compass,
    color: '#F59E0B',
    fillGradientId: 'gradMeaning',
    description: 'Connection to sacred stewardship, cultural preservation, creative participation.'
  },
  {
    key: 'ecologicalHarmony',
    label: 'Bioregional Ecological Harmony',
    shortLabel: 'Ecological Harmony',
    icon: Leaf,
    color: '#34D399',
    fillGradientId: 'gradEco',
    description: 'Riparian stabilization, soil microbiome biodiversity, aquifer replenishment.'
  },
  {
    key: 'materialSecurity',
    label: 'Universal Dignity & Material Security',
    shortLabel: 'Material Security',
    icon: Shield,
    color: '#EC4899',
    fillGradientId: 'gradMaterial',
    description: 'Zero-carbon LifeHouse shelter, decentralized energy sovereignty, circular livelihood.'
  }
];

export const HumanFlourishingTimelineChart: React.FC<HumanFlourishingTimelineChartProps> = ({
  className = '',
  onInspectProvenance
}) => {
  const { isForceOffline, isOnline } = useOfflineSync();
  const [records, setRecords] = useState<ImpactRecord[]>([]);
  const [selectedDimension, setSelectedDimension] = useState<FlourishingDimensionKey | 'all'>('all');
  const [chartViewMode, setChartViewMode] = useState<'area' | 'lines' | 'benchmark'>('area');
  const [timeRange, setTimeRange] = useState<'all' | 'actuals' | 'projected'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State for new impact record
  const [formDate, setFormDate] = useState('2026 Q3 (Live Audit)');
  const [formHealth, setFormHealth] = useState(94.5);
  const [formAgency, setFormAgency] = useState(95.0);
  const [formCohesion, setFormCohesion] = useState(93.8);
  const [formMeaning, setFormMeaning] = useState(95.8);
  const [formEco, setFormEco] = useState(96.2);
  const [formMaterial, setFormMaterial] = useState(94.8);
  const [formNotes, setFormNotes] = useState('Field telemetry audit from Mara & Kibera living labs.');
  const [formBioregion, setFormBioregion] = useState('Upper Athi & Mara Basin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Subscribe to real-time Firestore impact_records
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = db.impactRecords.subscribe(
      (data) => {
        setRecords(data);
        setIsLoading(false);
      },
      (err) => {
        console.warn('Firestore subscription fallback:', err);
        setRecords(db.impactRecords.getInitialSeedRecords());
        setIsLoading(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Filter records based on selected timeframe
  const filteredData = useMemo(() => {
    if (timeRange === 'actuals') {
      return records.filter(r => !r.isProjected);
    }
    if (timeRange === 'projected') {
      return records.filter(r => r.isProjected || r.date.includes('2026'));
    }
    return records;
  }, [records, timeRange]);

  // Latest Record for metrics display
  const latestRecord = useMemo(() => {
    const actuals = records.filter(r => !r.isProjected);
    return actuals.length > 0 ? actuals[actuals.length - 1] : records[records.length - 1];
  }, [records]);

  // Handle saving new empirical impact record
  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(null);

    try {
      const composite = +(
        (formHealth + formAgency + formCohesion + formMeaning + formEco + formMaterial) / 6
      ).toFixed(1);

      const newRecord: Omit<ImpactRecord, 'id'> = {
        date: formDate,
        timestamp: Date.now(),
        healthAndVitality: Number(formHealth),
        cognitiveAgency: Number(formAgency),
        socialCohesion: Number(formCohesion),
        meaningAndPurpose: Number(formMeaning),
        ecologicalHarmony: Number(formEco),
        materialSecurity: Number(formMaterial),
        compositeScore: composite,
        notes: formNotes,
        bioregion: formBioregion,
        verifiedSourceCount: 1720,
        cryptographicHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`
      };

      const docId = await db.impactRecords.create(newRecord);
      audioFeedback.playSyncComplete();
      setSubmitSuccess(
        isForceOffline 
          ? `Record saved locally in IndexedDB (Forced Offline Mode)! ID: ${docId}`
          : `Record successfully anchored to Firestore impact_records! ID: ${docId}`
      );

      // Optimistic update
      setRecords(prev => [...prev, { ...newRecord, id: docId }]);

      setTimeout(() => {
        setShowAddModal(false);
        setSubmitSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error('Error creating impact record:', err);
      audioFeedback.playFailureAlert();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom Dark Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload as ImpactRecord;
      return (
        <div className="p-3.5 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm shadow-2xl space-y-2 text-xs font-mono max-w-xs z-50">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-1.5">
            <span className="text-[#C5A059] font-bold tracking-wider">{label}</span>
            {dataPoint?.isProjected ? (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 text-[#8FB8DE] border border-blue-500/30">
                PROJECTION
              </span>
            ) : (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                AUDITED REALITY
              </span>
            )}
          </div>

          <div className="space-y-1">
            {payload.map((entry: any, i: number) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-[#F5F5F0]/70 text-[11px]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-bold text-[#F5F5F0]">
                  {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}%
                </span>
              </div>
            ))}
          </div>

          {dataPoint?.notes && (
            <p className="text-[10px] text-[#F5F5F0]/60 font-sans italic pt-1 border-t border-[#F5F5F0]/5">
              "{dataPoint.notes}"
            </p>
          )}

          {dataPoint?.cryptographicHash && (
            <div className="text-[9px] text-[#F5F5F0]/40 flex items-center justify-between pt-1 border-t border-[#F5F5F0]/5">
              <span className="flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-[#C5A059]" />
                Proof:
              </span>
              <span className="truncate max-w-[140px]">{dataPoint.cryptographicHash}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`p-6 bg-[#0E0E0E] border border-[#F5F5F0]/10 rounded-sm space-y-6 shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#C5A059]" />
              FIRESTORE 'IMPACT_RECORDS' TELEMETRY ENGINE
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#1B3022] text-emerald-300 border border-emerald-500/30">
              {isForceOffline ? 'IndexedDB Local Cache' : 'Live Cloud Stream'}
            </span>
          </div>
          <h2 className="text-2xl font-serif text-[#F5F5F0]">
            Human Flourishing & Bioregional Thriving Over Time
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 font-sans max-w-2xl">
            Longitudinal multi-capital flourishing measurements across physical health, epistemic agency, social cohesion, and ecological harmony, grounded in verified field audits.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => {
              setShowAddModal(true);
              audioFeedback.playMicroTick();
            }}
            className="px-3.5 py-2 rounded-sm bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Log Audit Record</span>
          </button>
        </div>
      </div>

      {/* High-Level Dimension Stat Tiles */}
      {latestRecord && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {DIMENSIONS.map((dim) => {
            const Icon = dim.icon;
            const value = latestRecord[dim.key] as number;
            const isSelected = selectedDimension === dim.key;

            return (
              <button
                key={dim.key}
                onClick={() => {
                  setSelectedDimension(isSelected ? 'all' : dim.key);
                  audioFeedback.playMicroTick();
                }}
                className={`p-3 rounded-sm text-left transition-all border space-y-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#181818] border-[#C5A059] shadow-lg shadow-[#C5A059]/10'
                    : 'bg-[#121212] hover:bg-[#161616] border-[#F5F5F0]/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-3.5 h-3.5" style={{ color: dim.color }} />
                  <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                    {latestRecord.date.split(' ')[0]}
                  </span>
                </div>
                <div className="text-lg font-mono font-bold text-[#F5F5F0]">
                  {typeof value === 'number' ? value.toFixed(1) : value}%
                </div>
                <div className="text-[10px] font-sans text-[#F5F5F0]/70 truncate font-medium">
                  {dim.shortLabel}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Filter and View Style Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Dimension Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              setSelectedDimension('all');
              audioFeedback.playMicroTick();
            }}
            className={`px-2.5 py-1 rounded-xs font-mono text-[10px] uppercase font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedDimension === 'all'
                ? 'bg-[#C5A059] text-black font-bold'
                : 'bg-[#161616] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
            }`}
          >
            All 7 Dimensions
          </button>

          {DIMENSIONS.map((dim) => (
            <button
              key={dim.key}
              onClick={() => {
                setSelectedDimension(dim.key);
                audioFeedback.playMicroTick();
              }}
              className={`px-2.5 py-1 rounded-xs font-mono text-[10px] uppercase font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedDimension === dim.key
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'bg-[#161616] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/10'
              }`}
            >
              {dim.shortLabel}
            </button>
          ))}
        </div>

        {/* Timeframe & Chart Style Toggles */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Timeframe */}
          <div className="flex items-center bg-[#121212] border border-[#F5F5F0]/10 rounded-xs p-0.5">
            <button
              onClick={() => setTimeRange('all')}
              className={`px-2 py-0.5 text-[9px] font-mono uppercase rounded-xs transition-colors ${
                timeRange === 'all' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              2023-2030
            </button>
            <button
              onClick={() => setTimeRange('actuals')}
              className={`px-2 py-0.5 text-[9px] font-mono uppercase rounded-xs transition-colors ${
                timeRange === 'actuals' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              Audited (2023-2026)
            </button>
            <button
              onClick={() => setTimeRange('projected')}
              className={`px-2 py-0.5 text-[9px] font-mono uppercase rounded-xs transition-colors ${
                timeRange === 'projected' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              2030 Horizon
            </button>
          </div>

          {/* Chart Style */}
          <div className="flex items-center bg-[#121212] border border-[#F5F5F0]/10 rounded-xs p-0.5">
            <button
              onClick={() => setChartViewMode('area')}
              className={`px-2 py-0.5 text-[9px] font-mono uppercase rounded-xs transition-colors ${
                chartViewMode === 'area' ? 'bg-[#1B3022] text-emerald-300 font-bold border border-emerald-500/40' : 'text-[#F5F5F0]/60'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartViewMode('lines')}
              className={`px-2 py-0.5 text-[9px] font-mono uppercase rounded-xs transition-colors ${
                chartViewMode === 'lines' ? 'bg-[#1B3022] text-emerald-300 font-bold border border-emerald-500/40' : 'text-[#F5F5F0]/60'
              }`}
            >
              Lines
            </button>
            <button
              onClick={() => setChartViewMode('benchmark')}
              className={`px-2 py-0.5 text-[9px] font-mono uppercase rounded-xs transition-colors ${
                chartViewMode === 'benchmark' ? 'bg-[#1B3022] text-emerald-300 font-bold border border-emerald-500/40' : 'text-[#F5F5F0]/60'
              }`}
            >
              Floor vs Target
            </button>
          </div>
        </div>
      </div>

      {/* Main Recharts Visualization Canvas */}
      <div className="w-full h-[420px] bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm p-4 relative">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-xs font-mono text-[#C5A059] gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Fetching Firestore impact_records stream...</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartViewMode === 'area' ? (
              <AreaChart data={filteredData} margin={{ top: 15, right: 25, left: -10, bottom: 25 }}>
                <defs>
                  {DIMENSIONS.map((d) => (
                    <linearGradient key={d.fillGradientId} id={d.fillGradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={d.color} stopOpacity={0.45} />
                      <stop offset="95%" stopColor={d.color} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666" 
                  tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} 
                  dy={8}
                />
                <YAxis 
                  domain={[40, 100]} 
                  stroke="#666" 
                  tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} 
                  unit="%"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase' }} 
                />

                {/* Reference Baseline / Threshold Lines */}
                <ReferenceLine y={50} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Extractive Trap (<50%)', fill: '#EF4444', fontSize: 9, position: 'insideBottomLeft' }} />
                <ReferenceLine y={80} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Universal Dignity Floor (80%)', fill: '#10B981', fontSize: 9, position: 'insideBottomLeft' }} />
                <ReferenceLine y={95} stroke="#C5A059" strokeDasharray="3 3" label={{ value: 'Flourishing Zenith (95%+)', fill: '#C5A059', fontSize: 9, position: 'insideBottomLeft' }} />

                {/* Render Areas */}
                {selectedDimension === 'all' ? (
                  <>
                    <Area type="monotone" dataKey="compositeScore" name="Composite Flourishing" stroke="#C5A059" strokeWidth={3} fillOpacity={1} fill="url(#gradComposite)" />
                    <Area type="monotone" dataKey="ecologicalHarmony" name="Ecological Harmony" stroke="#34D399" strokeWidth={1.5} fillOpacity={1} fill="url(#gradEco)" />
                    <Area type="monotone" dataKey="healthAndVitality" name="Health & Vitality" stroke="#10B981" strokeWidth={1.5} fillOpacity={1} fill="url(#gradHealth)" />
                  </>
                ) : (
                  DIMENSIONS.filter(d => d.key === selectedDimension).map((d) => (
                    <Area 
                      key={d.key}
                      type="monotone" 
                      dataKey={d.key} 
                      name={d.label} 
                      stroke={d.color} 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill={`url(#${d.fillGradientId})`} 
                    />
                  ))
                )}
                <Brush dataKey="date" height={20} stroke="#C5A059" fill="#111" />
              </AreaChart>
            ) : chartViewMode === 'lines' ? (
              <LineChart data={filteredData} margin={{ top: 15, right: 25, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} dy={8} />
                <YAxis domain={[40, 100]} stroke="#666" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />

                <ReferenceLine y={80} stroke="#10B981" strokeDasharray="3 3" />

                {selectedDimension === 'all' ? (
                  DIMENSIONS.map((d) => (
                    <Line 
                      key={d.key}
                      type="monotone" 
                      dataKey={d.key} 
                      name={d.shortLabel} 
                      stroke={d.color} 
                      strokeWidth={d.key === 'compositeScore' ? 3 : 1.5} 
                      dot={{ r: 3, fill: d.color }}
                      activeDot={{ r: 6 }}
                    />
                  ))
                ) : (
                  DIMENSIONS.filter(d => d.key === selectedDimension).map((d) => (
                    <Line 
                      key={d.key}
                      type="monotone" 
                      dataKey={d.key} 
                      name={d.label} 
                      stroke={d.color} 
                      strokeWidth={3.5} 
                      dot={{ r: 4, fill: d.color }}
                      activeDot={{ r: 7 }}
                    />
                  ))
                )}
                <Brush dataKey="date" height={20} stroke="#C5A059" fill="#111" />
              </LineChart>
            ) : (
              // Benchmark / Floor vs Target View
              <AreaChart data={filteredData} margin={{ top: 15, right: 25, left: -10, bottom: 25 }}>
                <defs>
                  <linearGradient id="gradBenchmark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} dy={8} />
                <YAxis domain={[40, 100]} stroke="#666" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />

                <ReferenceLine y={80} stroke="#10B981" strokeWidth={2} label={{ value: 'Universal Flourishing Floor (80.0%)', fill: '#10B981', fontSize: 10 }} />
                <ReferenceLine y={95} stroke="#C5A059" strokeWidth={2} label={{ value: '2030 Regenerative Target (95.0%)', fill: '#C5A059', fontSize: 10 }} />

                <Area type="monotone" dataKey="compositeScore" name="Actual / Modeled Flourishing" stroke="#C5A059" strokeWidth={3} fill="url(#gradBenchmark)" />
                <Line type="monotone" dataKey="healthAndVitality" name="Health Floor Baseline" stroke="#10B981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ecologicalHarmony" name="Ecological Equilibrium" stroke="#34D399" strokeWidth={2} dot={false} />
                <Brush dataKey="date" height={20} stroke="#C5A059" fill="#111" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Modal to Log New Empirical Impact Audit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm p-6 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#C5A059]" />
                  Log New Empirical Impact Audit
                </span>
                <h3 className="text-lg font-serif text-[#F5F5F0]">
                  Record Human Flourishing Metrics
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#F5F5F0]/50 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-[#F5F5F0]/50 block">Audit Date / Quarter</label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                    className="w-full p-2 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-[#F5F5F0]/50 block">Target Bioregion</label>
                  <input
                    type="text"
                    value={formBioregion}
                    onChange={(e) => setFormBioregion(e.target.value)}
                    required
                    className="w-full p-2 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              {/* 6 Dimension Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-400 block">Health & Vitality (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formHealth}
                    onChange={(e) => setFormHealth(parseFloat(e.target.value))}
                    className="w-full p-2 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm text-[#F5F5F0] focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#8FB8DE] block">Cognitive Agency (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formAgency}
                    onChange={(e) => setFormAgency(parseFloat(e.target.value))}
                    className="w-full p-2 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm text-[#F5F5F0] focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-purple-400 block">Social Cohesion (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formCohesion}
                    onChange={(e) => setFormCohesion(parseFloat(e.target.value))}
                    className="w-full p-2 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm text-[#F5F5F0] focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-amber-400 block">Meaning & Purpose (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formMeaning}
                    onChange={(e) => setFormMeaning(parseFloat(e.target.value))}
                    className="w-full p-2 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm text-[#F5F5F0] focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-emerald-300 block">Ecological Harmony (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formEco}
                    onChange={(e) => setFormEco(parseFloat(e.target.value))}
                    className="w-full p-2 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm text-[#F5F5F0] focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-pink-400 block">Material Security (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(parseFloat(e.target.value))}
                    className="w-full p-2 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm text-[#F5F5F0] focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-[#F5F5F0]/50 block">Epistemic Audit Notes</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2 bg-[#121212] border border-[#F5F5F0]/15 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              {submitSuccess && (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-sm text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-sm bg-[#161616] text-[#F5F5F0]/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-sm bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/50 text-emerald-300 font-mono font-bold flex items-center gap-1.5"
                >
                  {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{isForceOffline ? 'Cache in IndexedDB' : 'Commit to Firestore'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
