import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Check, 
  GitMerge, 
  RefreshCw, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  Database, 
  HardDrive, 
  FileCheck2, 
  Scale, 
  Hash, 
  Sparkles,
  Info
} from 'lucide-react';
import { EvidenceLedgerEntry } from '../../types';
import { db } from '../../lib/db';
import { audioFeedback } from '../../lib/audioFeedback';

export interface LedgerSyncConflict {
  id: string;
  localEntry: EvidenceLedgerEntry & {
    version: number;
    updatedAt: string;
    updatedBy: string;
  };
  remoteEntry: EvidenceLedgerEntry & {
    version: number;
    updatedAt: string;
    updatedBy: string;
  };
  diffFields: ('claim' | 'outcome' | 'confidenceScore' | 'epistemicStatus' | 'methodology' | 'verifier')[];
}

interface LedgerConflictResolutionModalProps {
  conflict: LedgerSyncConflict;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (resolvedEntry: EvidenceLedgerEntry, resolutionType: 'local' | 'remote' | 'merge') => void;
}

export const LedgerConflictResolutionModal: React.FC<LedgerConflictResolutionModalProps> = ({
  conflict,
  isOpen,
  onClose,
  onResolve
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'side-by-side' | 'unified-diff'>('side-by-side');
  const [synthesizedNotes, setSynthesizedNotes] = useState(
    `Synthesized consensus between Local Field Station audit and Remote Peer Certification.`
  );

  if (!isOpen) return null;

  const { localEntry, remoteEntry, diffFields } = conflict;

  const handleResolve = async (type: 'local' | 'remote' | 'merge') => {
    setIsProcessing(true);
    audioFeedback.playSubtleClick();

    try {
      let finalEntry: EvidenceLedgerEntry;

      if (type === 'local') {
        finalEntry = {
          ...localEntry,
          version: Math.max(localEntry.version || 1, remoteEntry.version || 1) + 1,
          hasConflict: false
        };
      } else if (type === 'remote') {
        finalEntry = {
          ...remoteEntry,
          version: (remoteEntry.version || 1) + 1,
          hasConflict: false
        };
      } else {
        // Merge & Synthesize
        finalEntry = {
          ...localEntry,
          claim: localEntry.claim,
          outcome: `${localEntry.outcome} [Merged with Remote: ${remoteEntry.outcome}]`,
          confidenceScore: Math.round(((localEntry.confidenceScore || 90) + (remoteEntry.confidenceScore || 90)) / 2),
          epistemicStatus: 'Verified',
          methodology: `${localEntry.methodology} | Cross-verified: ${remoteEntry.methodology}`,
          verifier: `${localEntry.verifier} & ${remoteEntry.verifier}`,
          version: Math.max(localEntry.version || 1, remoteEntry.version || 1) + 1,
          hasConflict: false
        };
      }

      // Record audit log
      await db.audit.logInteraction({
        action: `Resolved ledger sync conflict for [${finalEntry.id}] via ${type.toUpperCase()}`,
        feature: 'telemetry_calibration',
        impactTier: 'civilizational_critical',
        parameters: {
          entryId: finalEntry.id,
          resolutionType: type,
          newVersion: finalEntry.version,
          synthesizedNotes
        },
        ethicalNotes: `Steward conflict resolution executed: ${type.toUpperCase()} chosen. Preserving epistemic integrity.`
      });

      onResolve(finalEntry, type);
      audioFeedback.playSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to resolve conflict:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const isDiff = (field: string) => diffFields.includes(field as any);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0D0D0D] border border-amber-500/50 rounded-sm w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#F5F5F0]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#141414] border-b border-[#F5F5F0]/10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                IndexedDB ⟷ Firestore Version Mismatch
              </span>
              <span className="text-xs font-mono text-[#C5A059] font-bold">
                Record: {conflict.id}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#F5F5F0]">
              Epistemic Conflict Resolution Protocol
            </h2>
            <p className="text-xs text-[#F5F5F0]/60">
              A discrepancy was identified between your local offline IndexedDB draft and the remote Firestore verified ledger snapshot.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#F5F5F0]/50 hover:text-white rounded hover:bg-[#F5F5F0]/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Side-by-Side Diff */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          
          {/* Comparison Header Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Local IndexedDB Card */}
            <div className="p-4 bg-[#111111] border border-[#8FB8DE]/40 rounded-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F0]/10">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#8FB8DE]" />
                  <span className="font-mono font-bold text-sm text-[#8FB8DE]">
                    Local IndexedDB Draft (v{localEntry.version || 1}.2)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                  {localEntry.updatedAt ? new Date(localEntry.updatedAt).toLocaleTimeString() : 'Local cache'}
                </span>
              </div>

              <div className="space-y-2">
                <div className={`p-2 rounded ${isDiff('claim') ? 'bg-[#8FB8DE]/10 border border-[#8FB8DE]/30' : 'bg-black/30'}`}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8FB8DE] block mb-0.5">
                    Claim Statement {isDiff('claim') && '(Modified Locally)'}
                  </span>
                  <p className="text-[#F5F5F0] font-serif">{localEntry.claim}</p>
                </div>

                <div className={`p-2 rounded ${isDiff('outcome') ? 'bg-[#8FB8DE]/10 border border-[#8FB8DE]/30' : 'bg-black/30'}`}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8FB8DE] block mb-0.5">
                    Measured Outcome {isDiff('outcome') && '(Modified Locally)'}
                  </span>
                  <p className="text-[#F5F5F0]/90 font-mono">{localEntry.outcome}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                  <div className={`p-1.5 rounded ${isDiff('confidenceScore') ? 'bg-[#8FB8DE]/10 border border-[#8FB8DE]/30' : 'bg-black/30'}`}>
                    <span className="text-[9px] uppercase text-[#F5F5F0]/50 block">Certainty Score</span>
                    <span className="text-xs font-bold text-emerald-400">{localEntry.confidenceScore}%</span>
                  </div>
                  <div className={`p-1.5 rounded ${isDiff('epistemicStatus') ? 'bg-[#8FB8DE]/10 border border-[#8FB8DE]/30' : 'bg-black/30'}`}>
                    <span className="text-[9px] uppercase text-[#F5F5F0]/50 block">Epistemic Status</span>
                    <span className="text-xs font-bold text-[#C5A059]">{localEntry.epistemicStatus}</span>
                  </div>
                </div>

                <div className="p-2 bg-black/40 border border-[#F5F5F0]/5 rounded text-[10px] font-mono text-[#F5F5F0]/60 truncate">
                  Author/Steward: {localEntry.updatedBy || localEntry.verifier}
                </div>
              </div>
            </div>

            {/* Remote Firestore Card */}
            <div className="p-4 bg-[#111111] border border-[#C5A059]/40 rounded-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F0]/10">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-mono font-bold text-sm text-[#C5A059]">
                    Remote Firestore Record (v{remoteEntry.version || 1}.3)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                  {remoteEntry.updatedAt ? new Date(remoteEntry.updatedAt).toLocaleTimeString() : 'Remote Firestore'}
                </span>
              </div>

              <div className="space-y-2">
                <div className={`p-2 rounded ${isDiff('claim') ? 'bg-[#C5A059]/10 border border-[#C5A059]/30' : 'bg-black/30'}`}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] block mb-0.5">
                    Claim Statement {isDiff('claim') && '(Remote Master)'}
                  </span>
                  <p className="text-[#F5F5F0] font-serif">{remoteEntry.claim}</p>
                </div>

                <div className={`p-2 rounded ${isDiff('outcome') ? 'bg-[#C5A059]/10 border border-[#C5A059]/30' : 'bg-black/30'}`}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] block mb-0.5">
                    Measured Outcome {isDiff('outcome') && '(Remote Master)'}
                  </span>
                  <p className="text-[#F5F5F0]/90 font-mono">{remoteEntry.outcome}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                  <div className={`p-1.5 rounded ${isDiff('confidenceScore') ? 'bg-[#C5A059]/10 border border-[#C5A059]/30' : 'bg-black/30'}`}>
                    <span className="text-[9px] uppercase text-[#F5F5F0]/50 block">Certainty Score</span>
                    <span className="text-xs font-bold text-emerald-400">{remoteEntry.confidenceScore}%</span>
                  </div>
                  <div className={`p-1.5 rounded ${isDiff('epistemicStatus') ? 'bg-[#C5A059]/10 border border-[#C5A059]/30' : 'bg-black/30'}`}>
                    <span className="text-[9px] uppercase text-[#F5F5F0]/50 block">Epistemic Status</span>
                    <span className="text-xs font-bold text-[#C5A059]">{remoteEntry.epistemicStatus}</span>
                  </div>
                </div>

                <div className="p-2 bg-black/40 border border-[#F5F5F0]/5 rounded text-[10px] font-mono text-[#F5F5F0]/60 truncate">
                  Verifier/Authority: {remoteEntry.verifier}
                </div>
              </div>
            </div>

          </div>

          {/* Synthesis Note for Merge */}
          <div className="p-3 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Consensus Synthesis Rationale (Included in Immutable Audit Trail):
            </label>
            <input
              type="text"
              value={synthesizedNotes}
              onChange={(e) => setSynthesizedNotes(e.target.value)}
              className="w-full bg-black/50 border border-[#F5F5F0]/15 rounded px-3 py-1.5 text-xs text-[#F5F5F0] font-mono focus:outline-none focus:border-[#C5A059]"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#141414] border-t border-[#F5F5F0]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[#F5F5F0]/60 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Resolving this conflict automatically increments the version counter and syncs IndexedDB with Firestore.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => handleResolve('local')}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-[#102030] hover:bg-[#1a3048] text-[#8FB8DE] border border-[#8FB8DE]/40 rounded-sm text-xs font-mono font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Keep Local</span>
            </button>

            <button
              onClick={() => handleResolve('remote')}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-[#2a2010] hover:bg-[#3d3015] text-[#C5A059] border border-[#C5A059]/40 rounded-sm text-xs font-mono font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Accept Remote</span>
            </button>

            <button
              onClick={() => handleResolve('merge')}
              disabled={isProcessing}
              className="flex-1 sm:flex-initial px-4 py-2 bg-[#1B3022] hover:bg-[#254530] text-emerald-300 border border-emerald-500/50 rounded-sm text-xs font-mono font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-950/40"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Synthesize & Merge</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
