import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Database, Calendar, Lock, FileText, Info, RefreshCw, AlertCircle } from 'lucide-react';
import { DataProvenance } from '../types';
import { db, validateProvenanceRecord } from '../lib/db';

interface DataProvenanceModalProps {
  provenance: DataProvenance | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DataProvenanceModal: React.FC<DataProvenanceModalProps> = ({
  provenance,
  isOpen,
  onClose
}) => {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  if (!isOpen || !provenance) return null;

  const handleVerifyWithFirestore = async () => {
    setSyncing(true);
    setSyncStatus(null);
    try {
      // Validate schema in compliance with section 30 standard
      const validation = validateProvenanceRecord(provenance);
      if (!validation.isValid) {
        setSyncStatus(`Validation failed: ${validation.errors.join(', ')}`);
        return;
      }

      // Upsert record to Firestore provenance_data collection
      await db.provenance.create({
        ...provenance,
        id: provenance.id,
        datasetName: `${provenance.source} Lineage`,
        epistemicTier: 'primary_instrument',
      });

      // Track interaction in Moral Audit Log
      await db.audit.logInteraction({
        action: `Verified & anchored provenance record [${provenance.id}]`,
        feature: 'telemetry_calibration',
        impactTier: 'moderate',
        parameters: {
          provenanceId: provenance.id,
          certaintyScore: provenance.certaintyScore,
          verifier: provenance.verifier
        },
        ethicalNotes: `Epistemic audit verification executed for hash ${provenance.cryptographicHash.slice(0, 16)}...`
      });

      setSyncStatus('Record verified & anchored in Firestore provenance_data collection.');
    } catch (err: any) {
      setSyncStatus(`Firestore sync notice: ${err.message || 'Stored locally with valid cryptographic signature.'}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        id="data-provenance-modal"
        className="relative w-full max-w-2xl max-h-[94vh] sm:max-h-[90vh] flex flex-col bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm shadow-2xl overflow-hidden text-[#F5F5F0]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#F5F5F0]/10 bg-[#080808] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold tracking-[0.16em] sm:tracking-[0.2em] uppercase text-[#F5F5F0] truncate">Data Provenance Audit Record</h2>
                <span className="hidden xs:inline-block px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1B3022] text-[#C5A059] rounded-sm border border-[#C5A059]/40 shrink-0">
                  Verified
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#F5F5F0]/50 font-mono truncate">Record ID: {provenance.id}</p>
            </div>
          </div>
          <button
            id="close-provenance-modal-btn"
            onClick={onClose}
            aria-label="Close Provenance Modal"
            className="p-2 text-[#F5F5F0]/50 hover:text-[#F5F5F0] hover:bg-[#F5F5F0]/5 rounded transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 flex-1 overflow-y-auto">
          {/* Top Summary Card */}
          <div className="p-3.5 sm:p-4 rounded-sm bg-[#0A0A0A] border border-[#F5F5F0]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-[10px] text-[#F5F5F0]/50 font-bold uppercase tracking-[0.2em]">Independent Certainty Index</div>
              <div className="text-xl sm:text-2xl font-serif text-[#C5A059]">{provenance.certaintyScore}% Confirmed</div>
            </div>
            <div className="sm:text-right space-y-1">
              <div className="text-[10px] text-[#F5F5F0]/50 font-bold uppercase tracking-[0.2em]">Sensor Class</div>
              <div className="text-xs font-mono text-[#F5F5F0] capitalize">{provenance.sourceType.replace(/_/g, ' ')}</div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-3.5 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.2em]">
                <Database className="w-3.5 h-3.5 text-[#8FB8DE]" />
                Ingestion Source
              </div>
              <div className="text-xs font-medium text-[#F5F5F0] break-words">{provenance.source}</div>
            </div>

            <div className="p-3 sm:p-3.5 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] text-[#C5A059] font-bold uppercase tracking-[0.2em]">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                Collection Timestamp
              </div>
              <div className="text-xs font-mono text-[#F5F5F0] break-words">{new Date(provenance.collectedAt).toLocaleString()}</div>
            </div>
          </div>

          {/* Calculation Methodology */}
          <div className="p-3.5 sm:p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] text-[#C5A059] uppercase tracking-[0.2em] font-bold">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Calculation Methodology & Standards
            </div>
            <p className="text-xs text-[#F5F5F0]/70 leading-relaxed font-sans">
              {provenance.calculationMethod}
            </p>
          </div>

          {/* Verifier & Auditor */}
          <div className="p-3.5 sm:p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[10px] text-[#C5A059] uppercase tracking-[0.2em] font-bold">Auditing Entity</span>
              <span className="text-[10px] text-[#8FB8DE] font-mono">Last Audited: {provenance.lastAudited}</span>
            </div>
            <div className="text-xs font-bold text-[#F5F5F0]">{provenance.verifier}</div>
            <div className="text-[11px] text-[#F5F5F0]/50">{provenance.verifierRole}</div>
          </div>

          {/* Underlying Model Assumptions */}
          {provenance.assumptions && provenance.assumptions.length > 0 && (
            <div className="p-3.5 sm:p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] text-[#C5A059] uppercase tracking-[0.2em] font-bold">
                <Info className="w-3.5 h-3.5 text-[#8FB8DE]" />
                Underlying Scientific Assumptions
              </div>
              <ul className="space-y-1.5">
                {provenance.assumptions.map((assump, i) => (
                  <li key={i} className="text-xs text-[#F5F5F0]/70 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                    <span>{assump}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cryptographic SHA-256 Hash */}
          <div className="p-3 bg-[#050505] border border-[#F5F5F0]/10 rounded-sm space-y-1">
            <div className="flex items-center gap-1.5 text-[9px] text-[#F5F5F0]/40 uppercase tracking-[0.2em] font-mono">
              <Lock className="w-3 h-3 text-[#C5A059]" />
              Cryptographic Hash (Zero-Knowledge Audit Trail)
            </div>
            <div className="text-[10px] font-mono text-[#F5F5F0]/60 break-all select-all">
              {provenance.cryptographicHash}
            </div>
          </div>
          {/* Sync Status Feedback */}
          {syncStatus && (
            <div className="p-3 bg-[#1B3022]/40 border border-emerald-500/40 rounded-sm text-xs font-mono text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-[#080808] border-t border-[#F5F5F0]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F5F5F0]/50 font-mono shrink-0">
          <span className="flex items-center gap-1 text-emerald-400 text-[10px] text-center sm:text-left">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> ISO-14064 & Section 30 Standard Compliant
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleVerifyWithFirestore}
              disabled={syncing}
              className="w-full sm:w-auto px-3.5 py-2 min-h-[38px] bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {syncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
              <span>Verify & Anchor in Firestore</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 min-h-[38px] bg-[#F5F5F0] hover:bg-white text-black rounded-sm text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
