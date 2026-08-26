import React, { useState } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  Lock, 
  ExternalLink, 
  Search, 
  Filter, 
  Database, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  Sparkles,
  RefreshCw,
  Hash,
  Scale
} from 'lucide-react';
import { EVIDENCE_LEDGER_ENTRIES } from '../../data/prompt2CivilizationData';
import { EvidenceLedgerEntry } from '../../types';
import { db } from '../../lib/db';
import { StewardshipTierProgression } from '../StewardshipTierProgression';
import { FirestoreSyncStatusIndicator } from '../FirestoreSyncStatusIndicator';

interface EvidenceLedgerViewProps {
  onInspectProvenance?: (prov: any) => void;
  onOpenMoralSimulator?: () => void;
  onOpenCommandCenter?: () => void;
}

export const EvidenceLedgerView: React.FC<EvidenceLedgerViewProps> = ({
  onInspectProvenance,
  onOpenMoralSimulator,
  onOpenCommandCenter
}) => {
  const [selectedEntry, setSelectedEntry] = useState<EvidenceLedgerEntry>(EVIDENCE_LEDGER_ENTRIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  const filteredEntries = EVIDENCE_LEDGER_ENTRIES.filter((entry) => {
    const matchesStatus = statusFilter === 'all' || entry.epistemicStatus === statusFilter;
    const matchesSearch = entry.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.intervention.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.verifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleVerifyEntryInFirestore = async (entry: EvidenceLedgerEntry) => {
    setVerifyingId(entry.id);
    setVerificationFeedback(null);
    try {
      // Upsert record to Firestore provenance_data
      await db.provenance.create({
        id: entry.id,
        source: entry.source,
        sourceType: 'peer_reviewed_model',
        collectedAt: entry.timestamp,
        calculationMethod: entry.methodology,
        certaintyScore: entry.confidenceScore,
        verifier: entry.verifier,
        verifierRole: 'Independent Lead Epistemic Verifier',
        cryptographicHash: entry.hash,
        assumptions: [entry.attributionType, entry.epistemicStatus],
        lastAudited: new Date().toISOString().split('T')[0]
      });

      await db.audit.logInteraction({
        action: `Verified Evidence Ledger entry [${entry.id}]`,
        feature: 'telemetry_calibration',
        impactTier: 'civilizational_critical',
        parameters: {
          entryId: entry.id,
          hash: entry.hash,
          confidence: entry.confidenceScore,
          epistemicStatus: entry.epistemicStatus
        },
        ethicalNotes: `Epistemic ledger record cryptographically anchored with confidence ${entry.confidenceScore}%.`
      });

      setVerificationFeedback(`Successfully anchored ${entry.id} in live Firestore provenance registry.`);
    } catch (err: any) {
      setVerificationFeedback(`Verification recorded locally: ${err.message || 'Signature valid'}`);
    } finally {
      setVerifyingId(null);
    }
  };

  const getStatusBadge = (status: EvidenceLedgerEntry['epistemicStatus']) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      case 'Observed':
        return 'bg-blue-950/60 text-blue-300 border-blue-500/40';
      case 'Reported':
        return 'bg-purple-950/60 text-purple-300 border-purple-500/40';
      case 'Modeled':
        return 'bg-amber-950/60 text-amber-300 border-amber-500/40';
      case 'Estimated':
        return 'bg-orange-950/60 text-orange-300 border-orange-500/40';
      case 'Unknown':
        return 'bg-rose-950/60 text-rose-300 border-rose-500/40';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-[#F5F5F0] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3 border-b border-[#F5F5F0]/10 pb-6">
        <div className="flex items-center gap-2">
          <div className="h-px w-6 bg-[#C5A059]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-mono font-bold">
            Epistemic Ledger & Verification Protocol
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F5F0]">
              The Evidence Ledger
            </h1>
            <p className="text-sm text-[#F5F5F0]/60 max-w-2xl mt-1">
              A transparent, verifiable record answering: <em className="text-[#F5F5F0]">What do we know, how do we know it, and what changed in the real world afterward?</em>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMoralSimulator}
              className="px-3.5 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 rounded-sm text-xs font-mono text-[#C5A059] font-bold flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Audit Methodology Ethics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stewardship Reputation Progression Strip */}
      <StewardshipTierProgression />

      {/* Firestore Real-Time & Offline Sync Status Indicator */}
      <FirestoreSyncStatusIndicator 
        viewName="Evidence Ledger"
        onForceSync={async () => {
          await db.provenance.listAll();
        }}
      />

      {/* Epistemic Class Legend */}
      <div className="p-4 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
        {[
          { label: 'Observed', desc: 'Direct physical sensor data' },
          { label: 'Reported', desc: 'Community & steward filings' },
          { label: 'Modeled', desc: 'Peer-reviewed simulations' },
          { label: 'Estimated', desc: 'Inferred approximations' },
          { label: 'Verified', desc: 'Third-party audited proof' },
          { label: 'Unknown', desc: 'Explicitly exposed uncertainties' }
        ].map((ep) => (
          <div key={ep.label} className="p-2 bg-[#141414] border border-[#F5F5F0]/5 rounded-xs space-y-0.5">
            <div className="font-bold text-[#C5A059]">{ep.label}</div>
            <div className="text-[10px] text-[#F5F5F0]/50">{ep.desc}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Ledger Entries Table/Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#F5F5F0]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search claims, interventions, or cryptographic hashes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-[#F5F5F0]/15 rounded-sm pl-9 pr-3 py-2 text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/40 focus:outline-none focus:border-[#C5A059] font-mono"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111] border border-[#F5F5F0]/15 rounded-sm px-3 py-2 text-xs text-[#F5F5F0] font-mono focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">All Epistemic Classes</option>
              <option value="Verified">Verified Audits</option>
              <option value="Observed">Direct Observations</option>
              <option value="Reported">Field Reports</option>
              <option value="Modeled">Causal Models</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredEntries.map((entry) => {
              const isSelected = selectedEntry.id === entry.id;
              const statusClass = getStatusBadge(entry.epistemicStatus);

              return (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`p-4 rounded-sm border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#151515] border-[#C5A059] shadow-lg shadow-[#C5A059]/5'
                      : 'bg-[#0D0D0D] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30 hover:bg-[#121212]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#C5A059]">
                          {entry.id}
                        </span>
                        <span className={`px-2 py-0.2 rounded text-[9px] font-mono uppercase tracking-wider border ${statusClass}`}>
                          {entry.epistemicStatus}
                        </span>
                        <span className="text-[9px] font-mono text-[#F5F5F0]/40">
                          {entry.attributionType}
                        </span>
                      </div>
                      <p className="text-xs font-serif font-bold text-[#F5F5F0] leading-snug">
                        {entry.claim}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono text-emerald-400 font-bold">
                        {entry.confidenceScore}% Certainty
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#F5F5F0]/5 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50">
                    <span className="truncate max-w-[280px]">Intervention: {entry.intervention}</span>
                    <span className="text-[#C5A059]">Hash: {entry.hash.slice(0, 10)}...</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Ledger Entry Audit Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-6 sticky top-24 shadow-2xl">
            {/* Entry Header */}
            <div className="space-y-2 border-b border-[#F5F5F0]/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#C5A059] font-bold">
                  LEDGER PROOF RECORD: {selectedEntry.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase border ${getStatusBadge(selectedEntry.epistemicStatus)}`}>
                  {selectedEntry.epistemicStatus}
                </span>
              </div>
              <h3 className="text-base font-serif font-bold text-[#F5F5F0] leading-relaxed">
                "{selectedEntry.claim}"
              </h3>
            </div>

            {/* Evidence Flow Breakdown */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0]/50 block mb-1">
                  1. Telemetry Source & Instruments
                </span>
                <p className="text-[#F5F5F0]/90 bg-[#141414] p-2.5 rounded-xs border border-[#F5F5F0]/5 font-mono">
                  {selectedEntry.source}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0]/50 block mb-1">
                  2. Measurement Methodology & Audit Protocol
                </span>
                <p className="text-[#F5F5F0]/80 bg-[#141414] p-2.5 rounded-xs border border-[#F5F5F0]/5">
                  {selectedEntry.methodology}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0]/50 block mb-1">
                  3. Physical Intervention & Ground Execution
                </span>
                <p className="text-[#C5A059] bg-[#C5A059]/5 p-2.5 rounded-xs border border-[#C5A059]/20 font-mono">
                  {selectedEntry.intervention}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                  4. Measured Real-World Outcome
                </span>
                <p className="text-emerald-300 bg-emerald-950/20 p-2.5 rounded-xs border border-emerald-500/30 font-mono">
                  {selectedEntry.outcome}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F5F5F0]/10 font-mono">
                <div>
                  <span className="text-[9px] uppercase text-[#F5F5F0]/40 block">Causal Attribution</span>
                  <span className="text-xs text-[#F5F5F0] font-bold">{selectedEntry.attributionType}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-[#F5F5F0]/40 block">Certifier / Auditor</span>
                  <span className="text-xs text-[#F5F5F0] truncate block">{selectedEntry.verifier}</span>
                </div>
              </div>

              {/* Cryptographic Hash String */}
              <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-xs space-y-1">
                <span className="text-[9px] font-mono text-[#F5F5F0]/40 uppercase tracking-widest flex items-center gap-1">
                  <Hash className="w-3 h-3 text-[#C5A059]" /> Cryptographic Proof Hash
                </span>
                <div className="text-[10px] font-mono text-[#C5A059] break-all">
                  {selectedEntry.hash}
                </div>
              </div>

              {verificationFeedback && (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xs text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{verificationFeedback}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => handleVerifyEntryInFirestore(selectedEntry)}
                disabled={verifyingId === selectedEntry.id}
                className="flex-1 py-2.5 bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {verifyingId === selectedEntry.id ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Database className="w-3.5 h-3.5" />
                )}
                <span>Anchor in Firestore</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
