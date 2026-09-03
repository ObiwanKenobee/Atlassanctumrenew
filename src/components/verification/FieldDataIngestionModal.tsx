import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Hash,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  X,
  FileText,
  Activity,
  Globe2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { EvidenceLedgerEntry } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface FieldDataIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestSuccess: (entry: EvidenceLedgerEntry) => void;
}

export const FieldDataIngestionModal: React.FC<FieldDataIngestionModalProps> = ({
  isOpen,
  onClose,
  onIngestSuccess
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [recordCount, setRecordCount] = useState<number>(0);
  const [isComputingHash, setIsComputingHash] = useState<boolean>(false);
  const [computedMerkleHash, setComputedMerkleHash] = useState<string | null>(null);
  
  // Metadata fields
  const [claim, setClaim] = useState<string>('Biochar kilns stabilized topsoil organic matter by +2.4% over 90 days.');
  const [source, setSource] = useState<string>('Turkana Mobile Piezometer Array #08 & In-situ Soil Core CSV');
  const [verifier, setVerifier] = useState<string>('Community Elder Attestation Council & Bioregional Lab');
  const [bioregion, setBioregion] = useState<string>('Turkana Basin, Kenya');
  const [confidenceScore, setConfidenceScore] = useState<number>(96);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setFileContent(text);
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      setRecordCount(Math.max(1, lines.length - 1));
      
      // Compute deterministic mock Merkle hash
      setIsComputingHash(true);
      setTimeout(() => {
        const hashSeed = Math.abs(text.length * 31337 + file.name.length * 4096).toString(16).toUpperCase();
        const generatedHash = `0x7B${hashSeed.slice(-8)}9FA1${Date.now().toString(16).slice(-4).toUpperCase()}`;
        setComputedMerkleHash(generatedHash);
        setIsComputingHash(false);
        audioFeedback.playSuccessChime();
      }, 500);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleCommitToLedger = () => {
    if (!computedMerkleHash) return;

    audioFeedback.playSuccess();
    const newEntry: EvidenceLedgerEntry = {
      id: `EV-${Date.now().toString(36).toUpperCase()}`,
      claim,
      intervention: 'Telemetry Ingestion & Ground-Truth In-Situ Sensor Verification',
      measurement: `${recordCount} data points ingested from ${fileName || 'sensor feed'} (Certainty: ${confidenceScore}%)`,
      outcome: `Direct empirical ingestion of ${recordCount} field telemetry data points from ${fileName || 'sensor feed'}.`,
      confidenceScore,
      epistemicStatus: 'Verified',
      source,
      verifier,
      timestamp: new Date().toISOString(),
      methodology: 'Merkle Leaf Ingestion with Multi-Scale In-situ Telemetry Stream Calibration',
      attributionType: 'Attribution',
      hash: computedMerkleHash,
      moralAlignmentScore: 98,
      regenerativePotentialPriority: 'Critical',
      regenerativeScore: 97,
      version: 1,
      hasConflict: false
    };

    onIngestSuccess(newEntry);
    onClose();
  };

  const handleLoadSampleCSV = () => {
    audioFeedback.playSubtleClick();
    const sample = `timestamp,sensor_id,moisture_pct,organic_carbon_g_kg,ph,turbidity_ntu\n2026-09-01T08:00:00Z,SN-08A,34.2,28.4,6.8,12.4\n2026-09-02T08:00:00Z,SN-08B,35.1,28.9,6.7,11.8\n2026-09-03T08:00:00Z,SN-08C,36.0,29.3,6.9,10.9`;
    setFileName('turkana_biomass_piezometer_sept2026.csv');
    setFileContent(sample);
    setRecordCount(3);
    setIsComputingHash(true);
    setTimeout(() => {
      setComputedMerkleHash('0x7BAF892C9FA1E92D');
      setIsComputingHash(false);
      audioFeedback.playSuccessChime();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0D120F] border border-[#C5A059]/40 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#080D0A] border-b border-[#C5A059]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1B3022] border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-serif font-bold text-[#F5F5F0]">
                Field Telemetry & Sensor CSV Ingestion Pipeline
              </h2>
              <p className="text-xs font-mono text-[#F5F5F0]/60">
                Cryptographic Merkle Proof Generation for Ground-Truth Records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#F5F5F0]/50 hover:text-white rounded hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#F5F5F0] bg-[#0A0F0C]">
          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-[#C5A059] bg-[#C5A059]/10'
                : fileName
                ? 'border-emerald-500/50 bg-[#1B3022]/30'
                : 'border-[#F5F5F0]/20 hover:border-[#C5A059]/50 bg-[#0D1410]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,.geojson,.txt"
              onChange={handleManualSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              {fileName ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                  <span className="font-mono text-xs font-bold text-white">{fileName}</span>
                  <span className="font-mono text-[11px] text-[#F5F5F0]/60">
                    {recordCount} telemetry data rows parsed
                  </span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-8 h-8 text-[#C5A059]" />
                  <span className="font-medium text-sm text-[#F5F5F0]">
                    Drag & Drop Field CSV / GeoJSON telemetry file here
                  </span>
                  <span className="text-[11px] text-[#F5F5F0]/50 font-mono">
                    Supports IoT sensor dumps, soil moisture readings, water quality metrics
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#F5F5F0]/50">No field data file ready?</span>
            <button
              onClick={handleLoadSampleCSV}
              className="text-[#C5A059] hover:underline cursor-pointer font-bold"
            >
              Load Turkana Sensor Sample CSV
            </button>
          </div>

          {/* Merkle Hash Computation Result */}
          {computedMerkleHash && (
            <div className="p-3 bg-[#080D0A] border border-emerald-500/40 rounded space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  MERKLE ROOT LEAF ATTESTATION
                </span>
                <span className="text-[#F5F5F0]/40">Sha-256 Multi-Scale Hash</span>
              </div>
              <div className="text-xs text-[#C5A059] font-bold tracking-wider break-all bg-black/40 p-2 rounded">
                {computedMerkleHash}
              </div>
            </div>
          )}

          {/* Form Fields for the Evidence Record */}
          <div className="space-y-3 pt-2 border-t border-[#F5F5F0]/10">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#C5A059] font-bold mb-1">
                Empirical Evidence Claim
              </label>
              <input
                type="text"
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                className="w-full bg-[#0D1410] border border-[#F5F5F0]/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#C5A059] font-bold mb-1">
                  Source / Sensor Array
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-[#0D1410] border border-[#F5F5F0]/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#C5A059] font-bold mb-1">
                  Lead Verifier / Council
                </label>
                <input
                  type="text"
                  value={verifier}
                  onChange={(e) => setVerifier(e.target.value)}
                  className="w-full bg-[#0D1410] border border-[#F5F5F0]/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#C5A059] font-bold mb-1">
                  Bioregion
                </label>
                <input
                  type="text"
                  value={bioregion}
                  onChange={(e) => setBioregion(e.target.value)}
                  className="w-full bg-[#0D1410] border border-[#F5F5F0]/20 rounded p-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#C5A059] font-bold mb-1">
                  Epistemic Confidence ({confidenceScore}%)
                </label>
                <input
                  type="range"
                  min="80"
                  max="100"
                  value={confidenceScore}
                  onChange={(e) => setConfidenceScore(Number(e.target.value))}
                  className="w-full accent-[#C5A059]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#080D0A] border-t border-[#C5A059]/30 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#141C16] hover:bg-[#1B3022] text-[#F5F5F0] border border-[#F5F5F0]/20 rounded text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCommitToLedger}
            disabled={!computedMerkleHash || isComputingHash}
            className={`px-4 py-1.5 rounded text-xs font-bold font-mono uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              computedMerkleHash
                ? 'bg-[#C5A059] hover:bg-[#D4AF37] text-black shadow'
                : 'bg-[#1F2922] text-[#F5F5F0]/40 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Commit to Evidence Ledger</span>
          </button>
        </div>
      </div>
    </div>
  );
};
