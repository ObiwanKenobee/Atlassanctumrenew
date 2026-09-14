import React from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Activity, 
  Hash, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  BookOpen,
  Radio,
  FileText,
  Trash2,
  Tag
} from 'lucide-react';
import { TimelineAnnotationMarker } from './flourishingAnalyticsData';
import { audioFeedback } from '../../lib/audioFeedback';

interface AnnotationDetailModalProps {
  annotation: TimelineAnnotationMarker | null;
  isOpen: boolean;
  onClose: () => void;
  onInspectProvenance?: (provenance: any) => void;
  onDeleteAnnotation?: (id: string) => void;
}

export const AnnotationDetailModal: React.FC<AnnotationDetailModalProps> = ({
  annotation,
  isOpen,
  onClose,
  onInspectProvenance,
  onDeleteAnnotation
}) => {
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

  if (!isOpen || !annotation) return null;

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    audioFeedback.playMicroTick();
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleAuditIngestion = () => {
    if (onInspectProvenance) {
      audioFeedback.playCovenantResonance();
      onInspectProvenance({
        metricName: annotation.title,
        verificationHash: annotation.cryptographicHash,
        rawSensorReading: `Event: ${annotation.categoryLabel} • Sensor Quorum: ${annotation.sensorQuorum} nodes synced`,
        source: annotation.provenanceLinks[0]?.authority || 'Epistemic Bioregional Mesh',
        verifier: 'Independent Academic & Cryptographic Quorum',
        verifierRole: 'ZKP Merkle Validator',
        calculationMethod: annotation.detailedNarrative,
        confidenceInterval: '99.8% Multi-Spectral Calibrated',
        epistemicTier: 'Commandment IX Ground Truth Evidence',
        timestamp: annotation.date
      });
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#0D0F0E] border border-[#C5A059]/40 rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 text-[#F5F5F0] font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F5F5F0]/10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span 
                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border"
                style={{ 
                  color: annotation.categoryColor, 
                  backgroundColor: `${annotation.categoryColor}15`,
                  borderColor: `${annotation.categoryColor}40`
                }}
              >
                {annotation.categoryLabel}
              </span>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1B3022] text-emerald-300 border border-emerald-500/30 font-bold">
                {annotation.shortMonth} • {annotation.calendarMonth}
              </span>

              <span className="text-[10px] font-mono text-[#F5F5F0]/50 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#C5A059]" />
                {annotation.date}
              </span>
              {annotation.isCustom && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1">
                  <Tag className="w-3 h-3 text-purple-400" />
                  CUSTOM ANNOTATION
                </span>
              )}
              {annotation.spikeOrDrop && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${annotation.spikeOrDrop === 'spike' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40'}`}>
                  {annotation.spikeOrDrop === 'spike' ? '▲ POSITIVE SPIKE' : '▼ SUDDEN DROP'}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-serif text-[#F5F5F0] leading-snug">
              {annotation.title}
            </h2>

            {annotation.customLabelText && (
              <div className="text-xs text-amber-300 font-mono flex items-center gap-1.5">
                <span className="text-[#F5F5F0]/50 font-sans">Chart Marker:</span>
                <span className="px-1.5 py-0.5 rounded bg-black/60 border border-amber-500/30 font-bold">
                  {annotation.customLabelText}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs text-[#C5A059] font-mono">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{annotation.bioregion}</span>
              {annotation.author && (
                <span className="text-[#F5F5F0]/50 font-sans">
                  • Authored by <strong className="text-[#F5F5F0]">{annotation.author}</strong>
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onClose();
            }}
            className="p-1.5 rounded bg-[#141816] hover:bg-[#1E2420] text-[#F5F5F0]/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Context */}
        <div className="space-y-3">
          <div className="p-3.5 bg-[#060807] rounded border border-[#F5F5F0]/10 text-xs text-[#F5F5F0]/80 leading-relaxed font-mono">
            <span className="text-[#C5A059] font-bold block mb-1 uppercase tracking-wider text-[10px]">
              Historical Executive Summary:
            </span>
            {annotation.summary}
          </div>

          <div className="text-xs sm:text-sm text-[#F5F5F0]/90 leading-relaxed space-y-2 font-sans">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold">
              Physical Field Reality & Systems Context:
            </h4>
            <p>{annotation.detailedNarrative}</p>
          </div>
        </div>

        {/* Cryptographic Sensor Quorum Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
          <div className="p-3 bg-[#080A09] rounded border border-emerald-500/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-emerald-400 uppercase font-bold">Sensor Quorum</div>
              <div className="text-sm font-bold text-white mt-0.5">{annotation.sensorQuorum.toLocaleString()} Nodes Synced</div>
            </div>
            <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>

          <div className="p-3 bg-[#080A09] rounded border border-[#C5A059]/30 flex items-center justify-between">
            <div className="overflow-hidden">
              <div className="text-[10px] text-[#C5A059] uppercase font-bold">Merkle Leaf Root</div>
              <div className="text-xs font-bold text-white/90 truncate mt-0.5">{annotation.cryptographicHash}</div>
            </div>
            <Hash className="w-4 h-4 text-[#C5A059] shrink-0 ml-2" />
          </div>
        </div>

        {/* Verifiable External Provenance Links */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verifiable External Provenance Sources ({annotation.provenanceLinks.length})
            </h3>
            <span className="text-[10px] font-mono text-[#F5F5F0]/40">
              Commandment IX Evidence Standard
            </span>
          </div>

          <div className="space-y-2">
            {annotation.provenanceLinks.map((link, idx) => (
              <div 
                key={idx}
                className="p-3 rounded bg-[#070908] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold uppercase">
                      {link.tier}
                    </span>
                    <span className="text-[10px] text-[#C5A059] font-bold">{link.authority}</span>
                  </div>
                  <div className="text-white font-medium text-xs leading-snug">
                    {link.label}
                  </div>
                  <div className="text-[10px] text-[#F5F5F0]/40 truncate max-w-sm">
                    {link.url}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleCopyLink(link.url)}
                    className="p-1.5 rounded bg-[#141816] hover:bg-[#1E2420] text-[#F5F5F0]/60 hover:text-white transition-colors border border-white/5"
                    title="Copy direct provenance URL"
                  >
                    {copiedUrl === link.url ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => audioFeedback.playMicroTick()}
                    className="py-1.5 px-3 rounded bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/40 text-emerald-300 hover:text-white text-[11px] font-bold transition-colors flex items-center gap-1.5"
                  >
                    <span>External Proof</span>
                    <ExternalLink className="w-3 h-3 text-emerald-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#F5F5F0]/10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div className="text-[10px] text-[#F5F5F0]/50 text-center sm:text-left flex items-center gap-2">
            {annotation.isCustom && onDeleteAnnotation && (
              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  if (window.confirm('Delete this custom annotation from the chart?')) {
                    onDeleteAnnotation(annotation.id);
                    onClose();
                  }
                }}
                className="py-1.5 px-3 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Delete Annotation</span>
              </button>
            )}
            <span>Every historical datapoint is anchored in real-world satellite, sensor, or baraza evidence.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleAuditIngestion}
              className="flex-1 sm:flex-initial py-2 px-4 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Inspect in Audit Ledger</span>
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 rounded bg-[#141414] hover:bg-[#1E1E1E] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/15 text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
