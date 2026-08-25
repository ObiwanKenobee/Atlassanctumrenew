import React, { useState } from 'react';
import {
  Globe2,
  Layers,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  Compass,
  MapPin,
  Activity,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Radio,
  Maximize2
} from 'lucide-react';
import { RealityObservation, ScaleLevel } from '../../types';
import { REALITY_OBSERVATIONS } from '../../data/prompt2CivilizationData';
import { PhysicalAssetVerifiableQR } from '../PhysicalAssetVerifiableQR';

interface RealityEngineViewProps {
  onSelectTab: (tab: any) => void;
}

const SCALE_LEVELS: { level: ScaleLevel; label: string; desc: string }[] = [
  { level: 'planet', label: 'Planet', desc: 'Planetary boundaries, carbon sinks, and atmospheric cycles' },
  { level: 'continent', label: 'Continent', desc: 'Pan-African infrastructure, trade basins, and biomes' },
  { level: 'country', label: 'Country', desc: 'National policy corridors, grids, and legal jurisdictions' },
  { level: 'region', label: 'Region', desc: 'Watershed catchments, aquifers, and agro-ecological zones' },
  { level: 'city', label: 'City', desc: 'Urban metabolic flows, housing quarters, and transport grids' },
  { level: 'community', label: 'Community', desc: 'Indigenous stewardship areas and neighborhood assemblies' },
  { level: 'project', label: 'Project', desc: 'Physical modular nodes, micro-foundries, and field laboratories' }
];

export const RealityEngineView: React.FC<RealityEngineViewProps> = ({ onSelectTab }) => {
  const [observations, setObservations] = useState<RealityObservation[]>(REALITY_OBSERVATIONS);
  const [activeScale, setActiveScale] = useState<ScaleLevel>('region');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedEpistemicFilter, setSelectedEpistemicFilter] = useState<string>('all');
  const [selectedObsId, setSelectedObsId] = useState<string>(REALITY_OBSERVATIONS[0].id);

  const selectedObservation = observations.find(o => o.id === selectedObsId) || observations[0];

  const filteredObservations = observations.filter(o => {
    const matchesScale = activeScale === 'planet' || o.zoomLevel === activeScale || o.zoomLevel === 'region' || o.zoomLevel === 'community';
    const matchesCategory = selectedCategoryFilter === 'all' || o.category === selectedCategoryFilter;
    const matchesEpistemic = selectedEpistemicFilter === 'all' || o.epistemicStatus === selectedEpistemicFilter;
    return matchesCategory && matchesEpistemic;
  });

  const getEpistemicBadge = (status: string) => {
    switch (status) {
      case 'Observed': return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'Verified': return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
      case 'Reported': return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
      case 'Modeled': return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'Estimated': return 'bg-neutral-900 text-neutral-300 border-neutral-600';
      default: return 'bg-neutral-950 text-neutral-400 border-neutral-800';
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              THE REALITY ENGINE • LIVING TELEMETRY & MULTI-SCALE OBSERVATION
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Atlas Reality Engine</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            Aggregating multi-source satellite telemetry, ground IoT piezometers, and community observations across physical reality with visible epistemic uncertainty.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('observatory')}
            className="px-4 py-2.5 bg-[#F5F5F0] hover:bg-white text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span>3D Earth Observatory</span>
          </button>
          <button
            onClick={() => onSelectTab('evidence-ledger')}
            className="px-4 py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Evidence Ledger</span>
          </button>
        </div>
      </div>

      {/* Multi-Scale Zoom Ribbon */}
      <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
            MULTI-SCALE SPATIAL RESOLUTION (PLANET → PROJECT)
          </span>
          <span className="text-xs text-[#F5F5F0]/50 font-mono">
            Active Scale: <span className="text-[#C5A059] font-bold uppercase">{activeScale}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {SCALE_LEVELS.map((s) => {
            const isActive = activeScale === s.level;
            return (
              <button
                key={s.level}
                onClick={() => setActiveScale(s.level)}
                className={`p-3 rounded-xs border text-left transition-all ${
                  isActive
                    ? 'bg-[#1B3022] border-[#C5A059] text-[#F5F5F0] shadow-sm'
                    : 'bg-[#111111] border-[#F5F5F0]/5 text-[#F5F5F0]/60 hover:border-[#F5F5F0]/20'
                }`}
              >
                <div className="text-xs font-bold font-serif capitalize">{s.label}</div>
                <div className="text-[9px] text-[#F5F5F0]/40 font-sans mt-0.5 line-clamp-2 leading-tight">
                  {s.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Epistemic Status Taxonomy Banner */}
      <div className="p-4 bg-[#111111] border border-[#C5A059]/20 rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <span className="text-[#C5A059] font-bold uppercase tracking-wider text-[10px]">
          EPISTEMIC TAXONOMY:
        </span>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
            • Observed: Direct sensor telemetry
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/40 text-purple-300">
            • Reported: Community assembly testimony
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/40 text-amber-300">
            • Modeled: Biophysical simulation
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-500/40 text-blue-300">
            • Verified: Triple-blind audited
          </span>
        </div>
      </div>

      {/* Main Grid: Observation Telemetry Cards + Deep Reality Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Observations List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F0]/10">
            <span className="text-xs font-mono uppercase text-[#F5F5F0]/70 font-bold">
              OBSERVATION TELEMETRY FEEDS ({filteredObservations.length})
            </span>
          </div>

          <div className="space-y-3">
            {filteredObservations.map((obs) => {
              const isSelected = obs.id === selectedObsId;
              return (
                <div
                  key={obs.id}
                  onClick={() => setSelectedObsId(obs.id)}
                  className={`p-4 rounded-sm border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-[#151515] border-[#C5A059] shadow-md'
                      : 'bg-[#0D0D0D] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#C5A059] font-bold">{obs.category}</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase border ${getEpistemicBadge(obs.epistemicStatus)}`}>
                      {obs.epistemicStatus}
                    </span>
                  </div>

                  <h3 className="text-sm font-serif font-bold text-[#F5F5F0] leading-snug">
                    {obs.title}
                  </h3>

                  <div className="text-xs font-sans text-[#F5F5F0]/60 truncate">
                    {obs.locationName}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/60 border-t border-[#F5F5F0]/5">
                    <span className="text-emerald-400 font-bold">{obs.signalValue}</span>
                    <span>Certainty: {obs.confidenceScore}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Reality Telemetry Inspector */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-4">
              <div>
                <div className="text-[10px] font-mono text-[#C5A059] font-bold">
                  {selectedObservation.id} • {selectedObservation.zoomLevel.toUpperCase()} SCALE
                </div>
                <h2 className="text-xl font-serif font-bold text-[#F5F5F0] mt-1">
                  {selectedObservation.title}
                </h2>
                <div className="text-xs text-[#F5F5F0]/60 font-sans mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{selectedObservation.locationName}</span>
                  <span className="font-mono text-[10px]">[{selectedObservation.coordinates.join(', ')}]</span>
                </div>
              </div>

              <div className="self-start sm:self-center">
                <span className={`px-3 py-1 text-xs font-mono uppercase font-bold rounded-sm border ${getEpistemicBadge(selectedObservation.epistemicStatus)}`}>
                  {selectedObservation.epistemicStatus}
                </span>
              </div>
            </div>

            {/* Signal Display Block */}
            <div className="p-5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm grid grid-cols-2 gap-4 text-center font-mono">
              <div className="space-y-1">
                <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Observed Signal Metric</div>
                <div className="text-xl font-bold text-[#C5A059]">{selectedObservation.signalValue}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Measured Trend Delta</div>
                <div className="text-xl font-bold text-emerald-400">{selectedObservation.signalTrend}</div>
              </div>
            </div>

            {/* Scientific Summary */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/40 font-bold">
                PHYSICAL PHENOMENON & METHODOLOGY
              </span>
              <p className="text-[#F5F5F0]/80 font-sans leading-relaxed text-sm">
                {selectedObservation.summary}
              </p>
            </div>

            {/* Data Provenance & Sensors */}
            <div className="p-4 bg-[#141414] border border-[#F5F5F0]/5 rounded-xs space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase text-[#8FB8DE] font-bold">
                INGESTED DATA SOURCES & SENSOR ARRAYS
              </span>
              <ul className="space-y-1 text-[11px] text-[#F5F5F0]/70 list-disc list-inside font-mono">
                {selectedObservation.dataSources.map((ds, idx) => (
                  <li key={idx}>{ds}</li>
                ))}
              </ul>
            </div>

            {/* Epistemic Uncertainty & Confidence Interval */}
            <div className="p-4 bg-[#1B3022]/40 border border-emerald-500/30 rounded-sm space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Epistemic Confidence Score
                </span>
                <span className="text-sm font-mono font-bold text-emerald-300">
                  {selectedObservation.confidenceScore}%
                </span>
              </div>
              <div className="space-y-1 text-[11px] text-[#F5F5F0]/70 font-sans">
                <div className="font-bold text-[#F5F5F0]">Surfaced Uncertainty Factors:</div>
                <ul className="list-disc list-inside">
                  {selectedObservation.uncertaintyFactors.map((uf, i) => (
                    <li key={i}>{uf}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Physical Hardware Infrastructure & Verifiable QR Placard System */}
      <div className="pt-4">
        <PhysicalAssetVerifiableQR onSelectTab={onSelectTab} />
      </div>
    </div>
  );
};
