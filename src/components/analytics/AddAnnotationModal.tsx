import React, { useState } from 'react';
import { 
  X, 
  MessageSquarePlus, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Calendar, 
  Sparkles, 
  Tag, 
  FileText, 
  MapPin, 
  Check, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { TimelineAnnotationMarker } from './flourishingAnalyticsData';
import { MonthlyTrendDataPoint } from './FlourishingVsStabilityD3Chart';
import { audioFeedback } from '../../lib/audioFeedback';

interface AddAnnotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  availablePoints: MonthlyTrendDataPoint[];
  preselectedMonthIndex?: number;
  activeBioregionName?: string;
  onSaveAnnotation: (annotation: TimelineAnnotationMarker) => void;
}

export const AddAnnotationModal: React.FC<AddAnnotationModalProps> = ({
  isOpen,
  onClose,
  availablePoints,
  preselectedMonthIndex,
  activeBioregionName = 'Pan-African Sovereign Assembly',
  onSaveAnnotation
}) => {
  const initialPoint = availablePoints.find(p => p.monthIndex === preselectedMonthIndex) || availablePoints[0] || {
    monthIndex: 8,
    monthLabel: 'Month 08 (May 2026)',
    shortMonth: 'M08',
    calendarMonth: 'May 2026',
    exactDate: 'May 22, 2026',
    isoDate: '2026-05-22',
    ecologicalFlourishing: 83.5,
    economicStability: 78.6,
    extractiveCounterfactual: 45.4,
    decouplingMargin: 38.1,
    verifiedSensorCount: 3340,
    cryptographicHash: '0xbb4910283c719084'
  };

  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(initialPoint.monthIndex);
  const [title, setTitle] = useState<string>('');
  const [shortLabel, setShortLabel] = useState<string>('');
  const [spikeOrDrop, setSpikeOrDrop] = useState<'spike' | 'drop' | 'neutral'>('spike');
  const [narrative, setNarrative] = useState<string>('');
  const [author, setAuthor] = useState<string>('Bioregional Field Steward');
  const [categoryColor, setCategoryColor] = useState<string>('#10B981');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPoint = availablePoints.find(p => p.monthIndex === selectedMonthIndex) || initialPoint;

  const applyQuickSpikeDropTemplate = (
    type: 'spike' | 'drop' | 'neutral', 
    sampleTitle: string, 
    sampleLabel: string, 
    sampleNarrative: string,
    color: string
  ) => {
    audioFeedback.playMicroTick();
    setSpikeOrDrop(type);
    setTitle(sampleTitle);
    setShortLabel(sampleLabel);
    setNarrative(sampleNarrative);
    setCategoryColor(color);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please provide a title or event name.');
      return;
    }
    if (!narrative.trim()) {
      setErrorMsg('Please describe what triggered this spike or drop.');
      return;
    }

    const generatedId = `custom-anno-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const color = spikeOrDrop === 'spike' 
      ? '#10B981' 
      : spikeOrDrop === 'drop' 
      ? '#EF4444' 
      : categoryColor;

    const categoryLabel = spikeOrDrop === 'spike' 
      ? 'Sudden Surge' 
      : spikeOrDrop === 'drop' 
      ? 'Stress Drawdown' 
      : 'Covenant Observation';

    const newAnnotation: TimelineAnnotationMarker = {
      id: generatedId,
      monthIndex: currentPoint.monthIndex,
      shortMonth: currentPoint.shortMonth,
      calendarMonth: currentPoint.calendarMonth,
      date: currentPoint.exactDate || currentPoint.calendarMonth,
      title: title.trim(),
      category: spikeOrDrop === 'spike' ? 'spike' : spikeOrDrop === 'drop' ? 'drop' : 'custom',
      categoryLabel,
      categoryColor: color,
      bioregion: activeBioregionName,
      summary: shortLabel.trim() || title.trim(),
      detailedNarrative: narrative.trim(),
      sensorQuorum: currentPoint.verifiedSensorCount || 2400,
      cryptographicHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      provenanceLinks: [
        {
          label: 'Atlas Sanctum Field Observer Telemetry Ledger',
          url: 'https://atlassanctum.org/provenance/field-observations',
          authority: author.trim() || 'Bioregional Steward Quorum',
          tier: 'Tier-2 Field Ground Truth Observation'
        }
      ],
      isCustom: true,
      spikeOrDrop,
      customLabelText: shortLabel.trim() || title.trim().slice(0, 18),
      author: author.trim()
    };

    audioFeedback.playSuccessChime();
    onSaveAnnotation(newAnnotation);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#0C0F0D] border border-[#C5A059]/40 rounded-lg w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 text-[#F5F5F0] space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#F5F5F0]/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1C1F16] text-[#C5A059] border border-[#C5A059]/30">
                <MessageSquarePlus className="w-3 h-3 text-[#C5A059]" />
                TIMELINE ANNOTATION TOOL
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                {currentPoint.shortMonth} ({currentPoint.calendarMonth})
              </span>
            </div>
            <h2 className="text-xl font-serif text-[#F5F5F0] flex items-center gap-2">
              Add Chart Annotation
            </h2>
            <p className="text-xs text-[#F5F5F0]/65 font-sans">
              Place a contextual explanation directly on the longitudinal comparison chart to document sudden anomalies, surges, or climate impacts.
            </p>
          </div>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              onClose();
            }}
            className="p-1.5 rounded-sm hover:bg-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {errorMsg && (
            <div className="p-3 rounded bg-rose-950/80 border border-rose-500 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Point / Timeline Selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#C5A059] uppercase font-bold tracking-wider flex items-center justify-between">
              <span>1. Target Datapoint / Month</span>
              <span className="text-[#F5F5F0]/40 font-normal font-sans text-[11px]">Select point on horizontal axis</span>
            </label>
            <select
              value={selectedMonthIndex}
              onChange={(e) => {
                audioFeedback.playMicroTick();
                setSelectedMonthIndex(Number(e.target.value));
              }}
              className="w-full bg-[#141916] border border-[#F5F5F0]/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              {availablePoints.map(p => (
                <option key={p.monthIndex} value={p.monthIndex}>
                  {p.shortMonth}: {p.monthLabel} — Eco: {p.ecologicalFlourishing}% • Econ: {p.economicStability}%
                </option>
              ))}
            </select>

            {/* Context Badge of Selected Datapoint */}
            <div className="p-2.5 rounded bg-[#101412] border border-[#F5F5F0]/10 flex items-center justify-between text-[11px] text-[#F5F5F0]/70 font-sans">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-white font-medium">{currentPoint.exactDate || currentPoint.calendarMonth}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <span className="text-emerald-400">Eco: <strong>{currentPoint.ecologicalFlourishing}%</strong></span>
                <span className="text-[#C5A059]">Econ: <strong>{currentPoint.economicStability}%</strong></span>
                <span className="text-cyan-300">Decoupling: <strong>+{currentPoint.decouplingMargin} pts</strong></span>
              </div>
            </div>
          </div>

          {/* 2. Trajectory Dynamic: Spike vs Drop */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#C5A059] uppercase font-bold tracking-wider">
              2. Observation Dynamics (Spike or Drop)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setSpikeOrDrop('spike');
                  setCategoryColor('#10B981');
                }}
                className={`p-2.5 rounded border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  spikeOrDrop === 'spike'
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 font-bold shadow-sm'
                    : 'bg-[#111412] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Positive Surge / Spike</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setSpikeOrDrop('drop');
                  setCategoryColor('#EF4444');
                }}
                className={`p-2.5 rounded border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  spikeOrDrop === 'drop'
                    ? 'bg-rose-950/90 border-rose-500 text-rose-300 font-bold shadow-sm'
                    : 'bg-[#111412] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-white'
                }`}
              >
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <span>Sudden Dip / Stress</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setSpikeOrDrop('neutral');
                  setCategoryColor('#C5A059');
                }}
                className={`p-2.5 rounded border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  spikeOrDrop === 'neutral'
                    ? 'bg-[#2A2312] border-[#C5A059] text-amber-300 font-bold shadow-sm'
                    : 'bg-[#111412] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Milestone / Policy</span>
              </button>
            </div>
          </div>

          {/* Quick Explanation Presets */}
          <div className="space-y-1">
            <span className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-wider font-bold">
              Quick Cause Templates:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyQuickSpikeDropTemplate(
                  'spike',
                  'Torrential Cloudburst Absorption Surge',
                  '▲ Rain Surge',
                  '184mm rainfall in 36h was 98.4% absorbed by continuous contour swales, causing an immediate +6.2% leap in soil biological activity and water table parity.',
                  '#10B981'
                )}
                className="px-2 py-0.5 rounded bg-[#15231B] border border-emerald-500/30 text-[9.5px] text-emerald-300 hover:bg-[#1E3327] transition-colors cursor-pointer"
              >
                ▲ Hydrological Infiltration (+Rain)
              </button>

              <button
                type="button"
                onClick={() => applyQuickSpikeDropTemplate(
                  'drop',
                  'Acute Dry Season Baseflow Contraction',
                  '▼ Drought Dip',
                  'Prolonged dry season with 40-day absence of rain lowered surface streamflow, testing subterranean sand dams before aquifer recharge stabilized.',
                  '#EF4444'
                )}
                className="px-2 py-0.5 rounded bg-[#2D1616] border border-rose-500/30 text-[9.5px] text-rose-300 hover:bg-[#3D1E1E] transition-colors cursor-pointer"
              >
                ▼ Dry Season Stress (-Runoff)
              </button>

              <button
                type="button"
                onClick={() => applyQuickSpikeDropTemplate(
                  'spike',
                  'Catalytic Solar Microgrid Dividend Phase',
                  '▲ Solar Surplus',
                  'Surplus decentralized clean energy reached 98% circularity, distributing unearned cooperative dividends to 1,400 agrarian households.',
                  '#C5A059'
                )}
                className="px-2 py-0.5 rounded bg-[#2A2312] border border-[#C5A059]/40 text-[9.5px] text-amber-300 hover:bg-[#382F18] transition-colors cursor-pointer"
              >
                ▲ Clean Energy Dividend (+Econ)
              </button>

              <button
                type="button"
                onClick={() => applyQuickSpikeDropTemplate(
                  'drop',
                  'Regional Fertilizer Supply Chain Shock',
                  '▼ Input Shock',
                  'External synthetic input prices spiked 42%, driving emergency transition to localized biochar and worm-casting inoculants.',
                  '#F97316'
                )}
                className="px-2 py-0.5 rounded bg-[#2D1E12] border border-orange-500/30 text-[9.5px] text-orange-300 hover:bg-[#3E2918] transition-colors cursor-pointer"
              >
                ▼ Supply Chain Shock (-Input)
              </button>
            </div>
          </div>

          {/* 3. Annotation Title & Chart Pill Label */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs text-[#C5A059] uppercase font-bold tracking-wider">
                3. Full Event Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Aquifer Parity Achieved in Mara Basin"
                className="w-full bg-[#141916] border border-[#F5F5F0]/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#C5A059] uppercase font-bold tracking-wider">
                Chart Pill Label
              </label>
              <input
                type="text"
                maxLength={20}
                value={shortLabel}
                onChange={(e) => setShortLabel(e.target.value)}
                placeholder="e.g. ▲ Aquifer Spike"
                className="w-full bg-[#141916] border border-[#F5F5F0]/20 rounded p-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          {/* 4. Causal Narrative Explanation */}
          <div className="space-y-1">
            <label className="text-xs text-[#C5A059] uppercase font-bold tracking-wider flex items-center justify-between">
              <span>4. Explanation of Cause (Root Narrative)</span>
              <span className="text-[#F5F5F0]/40 font-normal font-sans text-[11px]">Explains the spike or dip in the audit log</span>
            </label>
            <textarea
              rows={3}
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder="Detail the biophysical, weather, or economic events that triggered this trajectory movement..."
              className="w-full bg-[#141916] border border-[#F5F5F0]/20 rounded p-2.5 text-xs text-white font-sans focus:outline-none focus:border-[#C5A059] leading-relaxed"
            />
          </div>

          {/* 5. Author & Bioregion Tag */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] text-[#F5F5F0]/60 uppercase">
                Observer / Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#141916] border border-[#F5F5F0]/20 rounded p-1.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-[#F5F5F0]/60 uppercase">
                Bioregion Anchor
              </label>
              <div className="p-1.5 rounded bg-[#101412] border border-[#F5F5F0]/15 text-xs text-[#C5A059] truncate">
                {activeBioregionName}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F5F5F0]/10">
            <button
              type="button"
              onClick={() => {
                audioFeedback.playSubtleClick();
                onClose();
              }}
              className="px-4 py-2 rounded bg-[#141414] hover:bg-[#222] border border-[#F5F5F0]/20 text-[#F5F5F0]/70 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4 text-black" />
              <span>Save & Place on Chart</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
