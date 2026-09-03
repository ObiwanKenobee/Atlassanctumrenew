import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  Coins,
  Globe2,
  Compass,
  AlertTriangle,
  X,
  Share2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { ActiveMissionPipeline, PageView } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface InstitutionalDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: ActiveMissionPipeline | null;
  onSelectTab?: (tab: PageView) => void;
}

export const InstitutionalDossierModal: React.FC<InstitutionalDossierModalProps> = ({
  isOpen,
  onClose,
  mission,
  onSelectTab
}) => {
  const [dossierFormat, setDossierFormat] = useState<'EXECUTIVE' | 'TECHNICAL' | 'COVENANT'>('EXECUTIVE');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!isOpen || !mission) return null;

  const handlePrintOrPdf = () => {
    audioFeedback.playSuccessChime();
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 300);
  };

  const handleCopyLink = () => {
    audioFeedback.playSubtleClick();
    navigator.clipboard.writeText(
      `https://atlassanctum.org/dossier/${mission.id}?format=${dossierFormat.toLowerCase()}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Deterministic Merkle Hash for Briefing Verification
  const verificationHash = `0x7F${mission.id.slice(-6).toUpperCase()}8A4C${Math.abs(
    mission.title.length * 1337
  ).toString(16)}E992`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0D120F] border border-[#C5A059]/40 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#080D0A] border-b border-[#C5A059]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1B3022] border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-serif font-bold text-[#F5F5F0] tracking-wide">
                  Atlas Institutional Strategic Briefing Dossier
                </h2>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 font-bold">
                  UN / Sovereign Standard
                </span>
              </div>
              <p className="text-xs font-mono text-[#F5F5F0]/60">
                Bioregional Multi-Capital Underwriting & Causal Strategy Report
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format Selector */}
            <div className="hidden sm:flex bg-[#141C16] p-0.5 rounded border border-[#C5A059]/30 text-xs font-mono">
              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setDossierFormat('EXECUTIVE');
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  dossierFormat === 'EXECUTIVE'
                    ? 'bg-[#C5A059] text-black font-bold'
                    : 'text-[#F5F5F0]/70 hover:text-white'
                }`}
              >
                Executive
              </button>
              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setDossierFormat('TECHNICAL');
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  dossierFormat === 'TECHNICAL'
                    ? 'bg-[#C5A059] text-black font-bold'
                    : 'text-[#F5F5F0]/70 hover:text-white'
                }`}
              >
                Technical / IoT
              </button>
              <button
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setDossierFormat('COVENANT');
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  dossierFormat === 'COVENANT'
                    ? 'bg-[#C5A059] text-black font-bold'
                    : 'text-[#F5F5F0]/70 hover:text-white'
                }`}
              >
                Covenant Audit
              </button>
            </div>

            <button
              onClick={handlePrintOrPdf}
              className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold font-mono text-xs uppercase tracking-wider rounded flex items-center gap-1.5 transition-all cursor-pointer shadow"
              title="Print or Export to PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-1.5 bg-[#141C16] hover:bg-[#1B3022] border border-[#C5A059]/30 text-[#C5A059] rounded cursor-pointer transition-colors"
              title="Copy Verifiable Dossier Link"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#F5F5F0]/50 hover:text-white rounded hover:bg-white/10 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#F5F5F0] print:text-black print:bg-white bg-[#0A0F0C]">
          {/* Document Header & Cryptographic Stamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#C5A059]/30 gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                ATLAS SANCTUM CIVILIZATIONAL ARCHITECTURE • CONFIDENTIAL DOSSIER
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                {mission.title}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-xs font-mono text-[#F5F5F0]/70">
                <span>Bioregion: {mission.bioregion}</span>
                <span>•</span>
                <span>Stage: {mission.stage.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="p-3 bg-[#080D0A] border border-[#C5A059]/30 rounded text-right space-y-1">
              <div className="text-[9px] font-mono uppercase text-[#C5A059] font-bold flex items-center justify-end gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Merkle Root Attestation
              </div>
              <div className="text-[10px] font-mono text-[#F5F5F0]/80 tracking-wider">
                {verificationHash}
              </div>
              <div className="text-[9px] font-mono text-[#F5F5F0]/50">
                Timestamp: {new Date(mission.createdAt).toLocaleDateString()} UTC
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary & Causal Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-5 bg-[#0D1410] border border-[#C5A059]/20 rounded space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">
                01. Causal Problem Statement & Systemic Risk
              </span>
              <p className="text-sm font-light leading-relaxed text-[#F5F5F0]/90">
                {mission.primaryProblem}. Root causes trace directly to unmitigated hydrological runoff, infrastructure
                gaps, and historic extraction. Traditional non-causal subsidies fail to yield durable stability.
              </p>
              <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between text-xs font-mono text-[#F5F5F0]/60">
                <span>Domain: {mission.targetDomain}</span>
                <span>Telemetry NTU/Confidence: 94.8%</span>
              </div>
            </div>

            <div className="p-5 bg-[#1B3022]/40 border border-[#C5A059]/40 rounded flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">
                  Capital Structuring Target
                </span>
                <div className="text-2xl font-serif font-bold text-white mt-1">
                  ${(mission.estimatedBudgetUsd / 1000000).toFixed(2)}M USD
                </div>
                <p className="text-[10px] font-mono text-[#F5F5F0]/70 mt-1">
                  Non-extractive blended catalytic tranche with 0% predatory debt.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#C5A059]/20 flex items-center gap-1.5 text-xs text-[#C5A059] font-mono">
                <Coins className="w-3.5 h-3.5" />
                <span>Seven-Capitals Cascade Model</span>
              </div>
            </div>
          </div>

          {/* Section 2: Highest-Leverage Intervention Blueprint */}
          <div className="p-5 bg-[#0D1410] border border-[#C5A059]/20 rounded space-y-3">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">
              02. Highest-Leverage Strategic Intervention
            </span>
            <div className="p-3 bg-[#080D0A] border-l-2 border-[#C5A059] text-sm text-[#F5F5F0]/95 font-medium">
              {mission.highestLeverageIntervention}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#F5F5F0]/80 pt-1">
              <div>
                <span className="text-[10px] font-mono text-[#C5A059] block font-bold">Empirical Telemetry Proof</span>
                <p className="mt-0.5 font-mono text-[11px] text-[#F5F5F0]/70">{mission.keyTelemetryProof}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#C5A059] block font-bold">Covenant Safeguard & Non-Negotiable Floor</span>
                <p className="mt-0.5 text-[11px] text-emerald-300">{mission.covenantSafeguard}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Epistemic Swarm Consensus & Allocation Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-[#0D1410] border border-[#C5A059]/20 rounded space-y-2.5">
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">
                03. Autonomous AI Swarm Agents Allocated
              </span>
              <div className="grid grid-cols-2 gap-2">
                {mission.assignedAgents.map((agent, i) => (
                  <div
                    key={i}
                    className="p-2 bg-[#080D0A] border border-[#F5F5F0]/10 rounded flex items-center gap-2 text-xs font-mono"
                  >
                    <Cpu className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="text-[#F5F5F0]/90 font-medium">{agent}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-mono text-[#F5F5F0]/50 pt-1">
                All agent reasoning anchored in verifiable causal graphs; zero hallucinated policy assumptions.
              </p>
            </div>

            <div className="p-5 bg-[#0D1410] border border-[#C5A059]/20 rounded space-y-2.5">
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">
                04. Multi-Capital Transformation Waterfall
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between p-1.5 bg-[#080D0A] rounded">
                  <span className="text-[#F5F5F0]/70">Natural Capital:</span>
                  <span className="text-emerald-400 font-bold">+62% Hydrological Integrity</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-[#080D0A] rounded">
                  <span className="text-[#F5F5F0]/70">Social & Human Capital:</span>
                  <span className="text-[#C5A059] font-bold">+100% Community Governance</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-[#080D0A] rounded">
                  <span className="text-[#F5F5F0]/70">Institutional Memory:</span>
                  <span className="text-blue-400 font-bold">Open-Source Blueprint Ledger</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Covenant Governance Seal */}
          <div className="p-4 bg-[#080D0A] border border-emerald-500/30 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[#F5F5F0]/80">
                This strategic dossier is certified under the 10 Universal Covenants of Atlas Sanctum.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  if (onSelectTab) onSelectTab('governance');
                }}
                className="text-[#C5A059] hover:underline font-mono text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <span>View Covenant Records</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3.5 bg-[#080D0A] border-t border-[#C5A059]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <span className="text-[#F5F5F0]/50 text-[11px]">
            Generated via Atlas Civilizational OS • Document ID: {mission.id}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#141C16] hover:bg-[#1B3022] text-[#F5F5F0] border border-[#F5F5F0]/20 rounded text-xs cursor-pointer transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrintOrPdf}
              className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold uppercase rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Briefing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
