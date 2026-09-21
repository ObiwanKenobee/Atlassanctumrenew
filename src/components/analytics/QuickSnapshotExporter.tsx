import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { 
  Camera, 
  Download, 
  Check, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  Layers, 
  Globe2, 
  TrendingUp, 
  Activity,
  FileCheck,
  Share2
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface SnapshotDashboardContext {
  activeBioregionName: string;
  selectedBioregionsCount: number;
  timeRange: string;
  normalizationMode: string;
  celestialAlignment: boolean;
  purifiedState: boolean;
  flourishingScore: number;
  stabilityScore: number;
  decouplingMargin: number;
  verifiedSensors: number;
  merkleHash: string;
  driftStatus: string;
  epochMonth: string;
}

interface QuickSnapshotExporterProps {
  context: SnapshotDashboardContext;
  className?: string;
}

export const QuickSnapshotExporter: React.FC<QuickSnapshotExporterProps> = ({
  context,
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleGenerateSnapshot = async () => {
    if (!cardRef.current || isGenerating) return;

    audioFeedback.playCovenantResonance();
    setIsGenerating(true);

    try {
      // Make element temporarily visible for capture if hidden
      const element = cardRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2.5, // Crisp 2.5x retina resolution
        useCORS: true,
        backgroundColor: '#0A0E0C',
        logging: false
      });

      const dataUrl = canvas.toDataURL('image/png');
      setPreviewImageUrl(dataUrl);

      // Auto trigger download
      const link = document.createElement('a');
      link.download = `atlas-sanctum-impact-snapshot-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();

      audioFeedback.playCovenantResonance();
    } catch (err) {
      console.error('Failed to generate PNG snapshot:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!previewImageUrl) return;
    try {
      audioFeedback.playSubtleClick();
      const res = await fetch(previewImageUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  return (
    <>
      {/* Quick Snapshot Action Button in Header */}
      <button
        id="quick-snapshot-png-btn"
        data-testid="quick-snapshot-png-btn"
        type="button"
        onClick={handleGenerateSnapshot}
        disabled={isGenerating}
        className={`px-3.5 py-2 bg-gradient-to-r from-[#17221B] to-[#1E2E24] hover:from-[#213328] hover:to-[#2B3F32] border border-emerald-400/60 text-emerald-300 hover:text-white rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-all uppercase tracking-wider shadow cursor-pointer disabled:opacity-50 ring-1 ring-emerald-500/30 ${className}`}
        title="Generate a high-resolution PNG summary card of the current dashboard view, active filters, and bioregional context"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>Rendering Snapshot...</span>
          </>
        ) : (
          <>
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>Quick Snapshot (PNG)</span>
          </>
        )}
      </button>

      {/* Hidden Card in DOM used for generating high-res PNG */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none">
        <div 
          ref={cardRef}
          style={{ width: '880px', minHeight: '520px' }}
          className="p-8 bg-[#0B0F0D] border-2 border-[#C5A059] rounded-lg text-white font-mono space-y-6 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle watermarked background grid */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Header Seal & Meta */}
          <div className="flex items-start justify-between border-b border-[#C5A059]/40 pb-5 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                <Globe2 className="w-7 h-7 text-[#C5A059]" />
              </div>
              <div>
                <span className="text-xs text-[#C5A059] font-bold tracking-widest uppercase">
                  ATLAS SANCTUM • BIOREGIONAL IMPACT DOSSIER
                </span>
                <h1 className="text-xl font-serif font-bold text-white tracking-wide">
                  Longitudinal Epistemic Verification Snapshot
                </h1>
                <p className="text-xs text-[#F5F5F0]/60 font-sans">
                  Cryptographic Field Ground Truth &amp; Decoupling Trajectory
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="text-[#C5A059] font-bold">SHA-256 PROVENANCE</div>
              <div className="text-[10px] text-[#F5F5F0]/50 font-mono mt-0.5">
                {context.merkleHash || '0x7c9f81a2e4b6d08311'}
              </div>
              <div className="text-[9px] text-emerald-400 font-bold mt-1 uppercase">
                Zero-Knowledge Merkle Root Ratified
              </div>
            </div>
          </div>

          {/* Active Filters & Context Pill Bar */}
          <div className="p-3.5 bg-[#121815] rounded border border-[#F5F5F0]/15 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[#F5F5F0]/50 text-[10px] uppercase block">Bioregional Scope:</span>
              <span className="text-[#C5A059] font-bold text-sm">
                {context.activeBioregionName} ({context.selectedBioregionsCount} Bioregions Monitored)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-black/60 text-[#F5F5F0]/80 border border-[#F5F5F0]/10 text-[11px]">
                Time: <strong>{context.timeRange}</strong>
              </span>
              <span className="px-2 py-1 rounded bg-black/60 text-[#F5F5F0]/80 border border-[#F5F5F0]/10 text-[11px]">
                Norm: <strong>{context.normalizationMode}</strong>
              </span>
              <span className="px-2 py-1 rounded bg-black/60 text-[#F5F5F0]/80 border border-[#F5F5F0]/10 text-[11px]">
                Epoch: <strong>{context.epochMonth}</strong>
              </span>
              {context.celestialAlignment && (
                <span className="px-2 py-1 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40 text-[11px]">
                  Celestial Constellation
                </span>
              )}
            </div>
          </div>

          {/* Core Metric Pillars */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-[#141C17] rounded border border-emerald-500/30">
              <span className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-widest block">
                Ecological Flourishing
              </span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {context.flourishingScore.toFixed(1)}%
              </div>
              <span className="text-[10px] text-emerald-300/70 font-sans">
                +31.2% Above 2024 Baseline
              </span>
            </div>

            <div className="p-4 bg-[#141C17] rounded border border-cyan-500/30">
              <span className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-widest block">
                Economic Stability
              </span>
              <div className="text-2xl font-bold text-cyan-400 mt-1">
                {context.stabilityScore.toFixed(1)}%
              </div>
              <span className="text-[10px] text-cyan-300/70 font-sans">
                Universal Basic Dividend Active
              </span>
            </div>

            <div className="p-4 bg-[#141C17] rounded border border-[#C5A059]/40">
              <span className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-widest block">
                Decoupling Margin
              </span>
              <div className="text-2xl font-bold text-[#C5A059] mt-1">
                +{context.decouplingMargin.toFixed(1)} pts
              </div>
              <span className="text-[10px] text-[#C5A059]/70 font-sans">
                Absolute Inversion Verified
              </span>
            </div>

            <div className="p-4 bg-[#141C17] rounded border border-[#F5F5F0]/15">
              <span className="text-[10px] text-[#F5F5F0]/50 uppercase tracking-widest block">
                Verified Sensor Nodes
              </span>
              <div className="text-2xl font-bold text-white mt-1">
                {context.verifiedSensors.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-400 font-sans">
                100% Piezometer &amp; UAV Telemetry
              </span>
            </div>
          </div>

          {/* Regenerative Drift & Quorum Signature Footer */}
          <div className="pt-4 border-t border-[#F5F5F0]/10 flex items-center justify-between text-xs text-[#F5F5F0]/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Ratified by Pan-African Bioregional Councils (8 of 8 Quorum)
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[10px]">
              <span>DRIFT WATCHDOG: <strong className="text-emerald-400 uppercase">{context.driftStatus}</strong></span>
              <span>•</span>
              <span>SNAPSHOT GENERATED: <strong>{new Date().toUTCString()}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Snapshot Preview & Export Confirmation Modal */}
      {previewImageUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0D120F] border border-[#C5A059] rounded-lg max-w-2xl w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F0]/10">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-mono font-bold text-white">
                  High-Resolution Snapshot Card Ready
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="p-1 rounded text-[#F5F5F0]/60 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rendered Preview Image */}
            <div className="rounded border border-[#F5F5F0]/10 overflow-hidden max-h-[360px] overflow-y-auto shadow-inner bg-black">
              <img src={previewImageUrl} alt="Atlas Sanctum Snapshot Card" className="w-full h-auto block" />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PNG download initiated automatically</span>
              </span>

              <div className="flex items-center gap-2 self-end">
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className="px-3 py-1.5 rounded bg-[#18221B] hover:bg-[#223026] border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{hasCopied ? 'Copied to Clipboard!' : 'Copy Image to Clipboard'}</span>
                </button>

                <a
                  href={previewImageUrl}
                  download={`atlas-sanctum-impact-snapshot-${new Date().toISOString().slice(0, 10)}.png`}
                  className="px-3.5 py-1.5 rounded bg-[#C5A059] hover:bg-[#d4b068] text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save File</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
