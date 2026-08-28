import React, { useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Copy,
  Check,
  X,
  ExternalLink,
  Download,
  Maximize2,
  Minimize2,
  Share2,
  FileCheck2,
  Sparkles,
  Camera,
  Layers,
  Fingerprint
} from 'lucide-react';
import { FieldEvidenceItem } from './BioregionalSnap';
import { audioFeedback } from '../../lib/audioFeedback';

interface FieldEvidenceModalProps {
  evidence: FieldEvidenceItem | null;
  onClose: () => void;
}

export const FieldEvidenceModal: React.FC<FieldEvidenceModalProps> = ({
  evidence,
  onClose
}) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [copiedCoordinates, setCopiedCoordinates] = useState<boolean>(false);

  if (!evidence) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(evidence.hash);
    setCopiedHash(true);
    audioFeedback.playMicroTick();
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyLocation = () => {
    navigator.clipboard.writeText(evidence.location);
    setCopiedCoordinates(true);
    audioFeedback.playMicroTick();
    setTimeout(() => setCopiedCoordinates(false), 2000);
  };

  const handleDownloadCertificate = () => {
    const certificatePayload = {
      title: 'Atlas Sanctum Field Evidence Ground-Truth Certificate',
      commandment: 'Commandment II: Reality Above Model (Ground Truth Epistemic Priority)',
      evidenceId: evidence.id,
      observationTitle: evidence.title,
      geolocation: evidence.location,
      timestamp: evidence.timestamp,
      capturedBy: evidence.isUserCaptured ? 'Citizen Field Ranger' : 'Autonomous Biophysical Sensor Mesh',
      verifyingCouncil: evidence.verifiedBy,
      epistemicTier: evidence.epistemicTier,
      metricObserved: evidence.metricObserved,
      cryptographicMerkleHash: evidence.hash,
      immutableConsensusStatus: 'VERIFIED_IN_SITU',
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(certificatePayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `field-evidence-cert-${evidence.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    audioFeedback.playDataSave();
  };

  return (
    <div
      id="field-evidence-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="field-evidence-modal-content"
        className="relative w-full max-w-4xl bg-[#0D0D0D] border border-[#C5A059] rounded-sm overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-[#F5F5F0]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="p-4 sm:p-5 bg-[#121212] border-b border-[#F5F5F0]/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#1B3022] border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                  EPISTEMIC PROVENANCE CERTIFICATE
                </span>
                <span className="px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold">
                  {evidence.isUserCaptured ? 'CITIZEN SNAP' : 'TELEMETRY NODE'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5F5F0] line-clamp-1">
                {evidence.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCertificate}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#F5F5F0]/20 text-xs font-mono text-[#F5F5F0]/80 hover:text-[#F5F5F0] rounded cursor-pointer transition-colors"
              title="Download Epistemic Certificate"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Export Cert</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-[#202020] text-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-colors cursor-pointer"
              title="Close Modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Photographic Evidence Stage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F0]/60">
              <span className="flex items-center gap-1.5 text-[11px] text-[#C5A059]">
                <Camera className="w-3.5 h-3.5" />
                Original Camera-Captured Photographic Ground Truth
              </span>
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="flex items-center gap-1 hover:text-[#F5F5F0] cursor-pointer"
              >
                {isZoomed ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" /> Fit to Stage
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" /> Full Resolution
                  </>
                )}
              </button>
            </div>

            <div
              className={`relative bg-black rounded-sm overflow-hidden border border-[#F5F5F0]/20 transition-all ${
                isZoomed ? 'cursor-zoom-out min-h-[480px]' : 'aspect-video max-h-[380px] cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={evidence.imageUrl}
                alt={evidence.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isZoomed ? 'scale-125' : 'hover:scale-[1.01]'
                }`}
              />

              {/* Overlaid Photographic Telemetry Watermark */}
              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded border border-[#F5F5F0]/20 text-[10px] font-mono text-[#F5F5F0]/80 space-y-0.5 pointer-events-none">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  RAW IN-SITU OPTICAL CAPTURE
                </div>
                <div className="text-[#F5F5F0]/50 truncate max-w-xs">{evidence.location}</div>
              </div>
            </div>
          </div>

          {/* Metric Observed Highlight Box */}
          <div className="p-4 bg-[#141414] border border-emerald-500/30 rounded-sm space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
              Observed Biophysical Metric & Empirical Finding
            </span>
            <p className="text-sm font-sans text-[#F5F5F0] font-medium leading-relaxed">
              {evidence.metricObserved}
            </p>
          </div>

          {/* Detailed Geolocation, Timestamp & Linked Epistemic Provenance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Column 1: Geolocation & Timestamp */}
            <div className="p-4 bg-[#111111] border border-[#F5F5F0]/10 rounded-sm space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5 border-b border-[#F5F5F0]/10 pb-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                In-Situ Geolocation & Timing
              </span>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Precise Location:</span>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="text-[#F5F5F0] font-mono text-xs">{evidence.location}</span>
                    <button
                      onClick={handleCopyLocation}
                      className="p-1 hover:bg-[#202020] text-[#C5A059] rounded cursor-pointer shrink-0"
                      title="Copy Coordinates"
                    >
                      {copiedCoordinates ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Capture Timestamp:</span>
                  <div className="flex items-center gap-1.5 text-xs text-[#F5F5F0] mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{evidence.timestamp}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Bioregional Watershed ID:</span>
                  <span className="text-xs text-[#C5A059] font-mono">{evidence.bioregionId}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Linked Epistemic Provenance */}
            <div className="p-4 bg-[#111111] border border-[#F5F5F0]/10 rounded-sm space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5 border-b border-[#F5F5F0]/10 pb-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-[#C5A059]" />
                Linked Epistemic Provenance
              </span>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Epistemic Tier:</span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {evidence.epistemicTier}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Verifying Council:</span>
                  <span className="text-xs text-[#F5F5F0] mt-0.5 block">{evidence.verifiedBy}</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Commandment II Audit:</span>
                  <span className="text-[11px] text-[#C5A059] italic block mt-0.5">
                    "Reality Above Model" - Passed In-Situ Empirical Audit
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic Merkle Hash Box */}
          <div className="p-4 bg-[#0A0A0A] border border-[#C5A059]/40 rounded-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                Cryptographic Merkle Root Provenance Hash
              </span>
              <button
                onClick={handleCopyHash}
                className="px-2.5 py-1 bg-[#1C1C1C] hover:bg-[#282828] border border-[#C5A059]/40 text-xs font-mono text-[#C5A059] rounded flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hash Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs font-mono text-[#F5F5F0]/90 break-all bg-black/60 p-2.5 rounded border border-[#F5F5F0]/5 select-all">
              {evidence.hash}
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#121212] border-t border-[#F5F5F0]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[10px] font-mono text-[#F5F5F0]/50">
            Immutable Audit Trail • Record Ref: {evidence.id}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadCertificate}
              className="px-3.5 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#F5F5F0]/20 text-xs font-mono text-[#F5F5F0] rounded cursor-pointer sm:hidden"
            >
              Export JSON
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors shadow"
            >
              Close Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
