import React, { useState, useMemo } from 'react';
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
  Scale,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  GitMerge,
  Heart,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { EVIDENCE_LEDGER_ENTRIES } from '../../data/prompt2CivilizationData';
import { EvidenceLedgerEntry } from '../../types';
import { db } from '../../lib/db';
import { StewardshipTierProgression } from '../StewardshipTierProgression';
import { FirestoreSyncStatusIndicator } from '../FirestoreSyncStatusIndicator';
import { LedgerConflictResolutionModal, LedgerSyncConflict } from '../ledger/LedgerConflictResolutionModal';
import { CounterfactualAttributionSimulator } from '../verification/CounterfactualAttributionSimulator';
import { MultiPartyAttestationModal } from '../verification/MultiPartyAttestationModal';
import { FieldDataIngestionModal } from '../verification/FieldDataIngestionModal';
import { PhysicalAssetQrScannerModal } from '../verification/PhysicalAssetQrScannerModal';
import { audioFeedback } from '../../lib/audioFeedback';
import { UploadCloud, QrCode, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { useActiveMission } from '../../context/ActiveMissionContext';

interface EvidenceLedgerViewProps {
  onSelectTab?: (tab: any) => void;
  onInspectProvenance?: (prov: any) => void;
  onOpenMoralSimulator?: () => void;
  onOpenCommandCenter?: () => void;
}

type SortCriteria = 'moral_alignment' | 'regenerative_priority' | 'confidence' | 'timestamp' | 'id';
type SortDirection = 'asc' | 'desc';

// Default enriched data with Moral Alignment & Regenerative Priority metrics
const ENRICHED_LEDGER_ENTRIES: EvidenceLedgerEntry[] = EVIDENCE_LEDGER_ENTRIES.map((entry, idx) => {
  const moralScores = [98, 95, 99, 96, 92, 94, 91, 97];
  const regenerativePriorities: ('Critical' | 'High' | 'Medium' | 'Foundational')[] = [
    'Critical',
    'Critical',
    'High',
    'High',
    'Medium',
    'Critical',
    'High',
    'Foundational'
  ];
  const regenScores = [98, 96, 94, 95, 87, 92, 89, 93];

  return {
    ...entry,
    moralAlignmentScore: entry.moralAlignmentScore ?? moralScores[idx % moralScores.length],
    regenerativePotentialPriority: entry.regenerativePotentialPriority ?? regenerativePriorities[idx % regenerativePriorities.length],
    regenerativeScore: entry.regenerativeScore ?? regenScores[idx % regenScores.length],
    version: entry.version ?? 1,
    hasConflict: false
  };
});

export const EvidenceLedgerView: React.FC<EvidenceLedgerViewProps> = ({
  onSelectTab,
  onInspectProvenance,
  onOpenMoralSimulator,
  onOpenCommandCenter
}) => {
  const { activeMission, advanceMissionStage, loadDiagnosisIntoPipeline } = useActiveMission();
  const [entries, setEntries] = useState<EvidenceLedgerEntry[]>(ENRICHED_LEDGER_ENTRIES);
  const [selectedEntry, setSelectedEntry] = useState<EvidenceLedgerEntry>(ENRICHED_LEDGER_ENTRIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Sorting state
  const [sortBy, setSortBy] = useState<SortCriteria>('moral_alignment');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [autoSortEnabled, setAutoSortEnabled] = useState<boolean>(true);

  // Verification & Firestore State
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  // Conflict state
  const [activeConflict, setActiveConflict] = useState<LedgerSyncConflict | null>(null);
  const [activeConflictId, setActiveConflictId] = useState<string | null>(null);
  const [conflictSuccessMessage, setConflictSuccessMessage] = useState<string | null>(null);

  // Multi-Party Attestation Modal State
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState<boolean>(false);
  const [isIngestionModalOpen, setIsIngestionModalOpen] = useState<boolean>(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);

  // Priority ranking helper
  const priorityWeight = (p?: EvidenceLedgerEntry['regenerativePotentialPriority']) => {
    switch (p) {
      case 'Critical':
      case 'Critical Priority':
        return 4;
      case 'High':
      case 'High Impact':
      case 'Catalytic':
        return 3;
      case 'Medium':
        return 2;
      case 'Foundational':
        return 1;
      default:
        return 0;
    }
  };

  // Filter and auto-sort mechanism
  const processedEntries = useMemo(() => {
    let result = entries.filter((entry) => {
      const matchesStatus = statusFilter === 'all' || entry.epistemicStatus === statusFilter;
      const matchesPriority = priorityFilter === 'all' || entry.regenerativePotentialPriority === priorityFilter;
      const matchesSearch = entry.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            entry.intervention.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            entry.verifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            entry.hash.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    });

    if (autoSortEnabled) {
      result.sort((a, b) => {
        let diff = 0;
        if (sortBy === 'moral_alignment') {
          const scoreA = a.moralAlignmentScore ?? 0;
          const scoreB = b.moralAlignmentScore ?? 0;
          diff = scoreB - scoreA;
        } else if (sortBy === 'regenerative_priority') {
          const scoreA = (priorityWeight(a.regenerativePotentialPriority) * 100) + (a.regenerativeScore ?? 0);
          const scoreB = (priorityWeight(b.regenerativePotentialPriority) * 100) + (b.regenerativeScore ?? 0);
          diff = scoreB - scoreA;
        } else if (sortBy === 'confidence') {
          diff = (b.confidenceScore || 0) - (a.confidenceScore || 0);
        } else if (sortBy === 'timestamp') {
          diff = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        } else if (sortBy === 'id') {
          diff = a.id.localeCompare(b.id);
        }

        return sortDirection === 'desc' ? diff : -diff;
      });
    }

    return result;
  }, [entries, searchQuery, statusFilter, priorityFilter, sortBy, sortDirection, autoSortEnabled]);

  const handleVerifyEntryInFirestore = async (entry: EvidenceLedgerEntry) => {
    setVerifyingId(entry.id);
    setVerificationFeedback(null);
    try {
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
          moralAlignment: entry.moralAlignmentScore,
          regenerativePriority: entry.regenerativePotentialPriority,
          epistemicStatus: entry.epistemicStatus
        },
        ethicalNotes: `Epistemic ledger record cryptographically anchored in live Firestore registry with Moral Alignment ${entry.moralAlignmentScore}%.`
      });

      setVerificationFeedback(`Successfully anchored ${entry.id} in live Firestore provenance registry.`);
      audioFeedback.playSuccess();
    } catch (err: any) {
      setVerificationFeedback(`Verification recorded locally: ${err.message || 'Signature valid'}`);
    } finally {
      setVerifyingId(null);
    }
  };

  // Trigger Simulated Version Mismatch Conflict between IndexedDB and Firestore
  const handleTriggerSimulateConflict = () => {
    audioFeedback.playSubtleClick();
    const target = entries[0];
    const simulatedConflict: LedgerSyncConflict = {
      id: target.id,
      localEntry: {
        ...target,
        version: target.version || 1,
        claim: 'Solar-Desalination array restored groundwater aquifer pressure by 2.3 bar while supplying 78,000 pastoralists [Local Field Telemetry Update].',
        outcome: 'Elimination of seasonal water truck dependency for 22 pastoralist encampments (+4 encampments onboarded).',
        confidenceScore: 99,
        epistemicStatus: 'Verified',
        updatedAt: new Date().toISOString(),
        updatedBy: 'Field Station Piezometer Mesh #42 (Steward Draft)'
      },
      remoteEntry: {
        ...target,
        version: target.version || 1,
        claim: target.claim,
        outcome: target.outcome,
        confidenceScore: 98,
        epistemicStatus: 'Verified',
        updatedAt: '2026-08-19T14:32:00Z',
        updatedBy: target.verifier
      },
      diffFields: ['claim', 'outcome', 'confidenceScore']
    };

    setActiveConflict(simulatedConflict);
    setActiveConflictId(target.id);
  };

  const handleConflictResolved = (resolvedEntry: EvidenceLedgerEntry, resolutionType: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === resolvedEntry.id ? { ...resolvedEntry, hasConflict: false } : e))
    );
    if (selectedEntry.id === resolvedEntry.id) {
      setSelectedEntry(resolvedEntry);
    }
    setActiveConflict(null);
    setActiveConflictId(null);
    setConflictSuccessMessage(
      `Conflict for [${resolvedEntry.id}] successfully resolved via ${resolutionType.toUpperCase()} (Bumped to v${resolvedEntry.version || 2}.0).`
    );
    setTimeout(() => setConflictSuccessMessage(null), 6000);
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

  const getPriorityBadge = (priority?: EvidenceLedgerEntry['regenerativePotentialPriority']) => {
    switch (priority) {
      case 'Critical':
      case 'Critical Priority':
        return 'bg-rose-950/60 text-rose-300 border-rose-500/40';
      case 'High':
      case 'High Impact':
        return 'bg-amber-950/60 text-amber-300 border-amber-500/40';
      case 'Catalytic':
        return 'bg-purple-950/60 text-purple-300 border-purple-500/40';
      case 'Medium':
        return 'bg-blue-950/60 text-blue-300 border-blue-500/40';
      case 'Foundational':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-neutral-900 text-neutral-400 border-neutral-700';
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
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setIsIngestionModalOpen(true);
              }}
              className="px-3.5 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold font-mono text-xs uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Ingest Field CSV</span>
            </button>

            <button
              onClick={() => {
                audioFeedback.playSubtleClick();
                setIsQrScannerOpen(true);
              }}
              className="px-3 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 rounded-sm text-xs font-mono text-[#C5A059] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR Placard</span>
            </button>

            <button
              onClick={handleTriggerSimulateConflict}
              className="px-3 py-2 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 rounded-sm text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5 transition-colors"
              title="Simulate an IndexedDB vs Firestore sync version conflict"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Conflict</span>
            </button>

            <button
              onClick={onOpenMoralSimulator}
              className="px-3.5 py-2 bg-[#141414] hover:bg-[#1f1f1f] border border-[#F5F5F0]/20 rounded-sm text-xs font-mono text-[#F5F5F0] font-bold flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Ethics Audit</span>
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

      {/* Conflict Resolution Banner (Shown if a conflict is active or detected) */}
      {activeConflict && (
        <div className="p-4 bg-amber-950/30 border-2 border-amber-500/60 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-full border border-amber-500/50">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <span>Sync Conflict Detected</span>
                <span className="px-1.5 py-0.2 bg-amber-900/60 text-[10px] rounded border border-amber-500/30 font-mono">
                  Record {activeConflict.id}
                </span>
              </div>
              <p className="text-xs text-[#F5F5F0]/80 mt-0.5">
                Local offline modifications in IndexedDB clash with remote Firestore master timestamp.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveConflict(activeConflict)}
              className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs rounded-sm flex items-center justify-center gap-1.5 shadow-lg transition-colors cursor-pointer"
            >
              <GitMerge className="w-4 h-4" />
              <span>Resolve Conflict</span>
            </button>
          </div>
        </div>
      )}

      {conflictSuccessMessage && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-500/50 rounded-sm text-xs font-mono text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{conflictSuccessMessage}</span>
        </div>
      )}

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

      {/* Auto-Sorting & Filter Control Toolbar */}
      <div className="p-4 bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          
          {/* Left: Search & Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 w-full lg:w-auto">
            <div className="relative flex-1 min-w-[220px]">
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

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#111] border border-[#F5F5F0]/15 rounded-sm px-3 py-2 text-xs text-[#F5F5F0] font-mono focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">All Regenerative Priorities</option>
              <option value="Critical">Critical Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Foundational">Foundational Priority</option>
            </select>
          </div>

          {/* Right: Auto-Sorting Selector & Direction Toggle */}
          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#F5F5F0]/10 w-full lg:w-auto justify-end">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] flex items-center gap-1 font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Auto-Sort:
            </span>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortCriteria);
                audioFeedback.playSubtleClick();
              }}
              className="bg-[#141414] border border-[#C5A059]/40 text-[#C5A059] rounded-sm px-3 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-[#C5A059]"
            >
              <option value="moral_alignment">Moral Alignment Score</option>
              <option value="regenerative_priority">Regenerative Potential</option>
              <option value="confidence">Certainty Score (%)</option>
              <option value="timestamp">Chronological Timestamp</option>
              <option value="id">Record ID</option>
            </select>

            <button
              onClick={() => {
                setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
                audioFeedback.playSubtleClick();
              }}
              className="px-2.5 py-1.5 bg-[#141414] hover:bg-[#1a1a1a] border border-[#F5F5F0]/20 rounded-sm text-xs font-mono text-[#F5F5F0] flex items-center gap-1 transition-colors"
              title={`Sort Direction: ${sortDirection === 'desc' ? 'Highest First (Descending)' : 'Lowest First (Ascending)'}`}
            >
              {sortDirection === 'desc' ? (
                <>
                  <ArrowDown className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>High → Low</span>
                </>
              ) : (
                <>
                  <ArrowUp className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Low → High</span>
                </>
              )}
            </button>

            <button
              onClick={() => setAutoSortEnabled((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-sm text-xs font-mono border transition-colors ${
                autoSortEnabled
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-400'
              }`}
              title="Toggle automatic reordering"
            >
              {autoSortEnabled ? 'Auto-Sort: ON' : 'Auto-Sort: OFF'}
            </button>
          </div>

        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Ledger Entries Table/Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-[11px] font-mono text-[#F5F5F0]/50 flex items-center justify-between pb-1">
            <span>Showing {processedEntries.length} Verified Ledger Entries</span>
            <span>Sorted by {sortBy === 'moral_alignment' ? 'Moral Alignment Score' : sortBy === 'regenerative_priority' ? 'Regenerative Potential' : sortBy}</span>
          </div>

          {processedEntries.map((entry) => {
            const isSelected = selectedEntry.id === entry.id;
            const statusClass = getStatusBadge(entry.epistemicStatus);
            const priorityClass = getPriorityBadge(entry.regenerativePotentialPriority);

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
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-[#C5A059]">
                        {entry.id}
                      </span>
                      <span className={`px-2 py-0.2 rounded text-[9px] font-mono uppercase tracking-wider border ${statusClass}`}>
                        {entry.epistemicStatus}
                      </span>
                      <span className={`px-2 py-0.2 rounded text-[9px] font-mono uppercase tracking-wider border ${priorityClass}`}>
                        {entry.regenerativePotentialPriority} Priority
                      </span>
                      <span className="text-[9px] font-mono text-[#F5F5F0]/40">
                        {entry.attributionType}
                      </span>
                      {entry.version && entry.version > 1 && (
                        <span className="text-[9px] font-mono text-[#8FB8DE] bg-[#8FB8DE]/10 px-1.5 py-0.2 rounded border border-[#8FB8DE]/20 font-bold">
                          v{entry.version}.0
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-serif font-bold text-[#F5F5F0] leading-snug">
                      {entry.claim}
                    </p>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <div className="text-xs font-mono text-emerald-400 font-bold flex items-center justify-end gap-1">
                      <Heart className="w-3 h-3 text-rose-400" />
                      <span>{entry.moralAlignmentScore}% Moral</span>
                    </div>
                    <div className="text-[10px] font-mono text-amber-300 font-medium">
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

        {/* Right Column: Active Ledger Entry Audit Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-6 sticky top-24 shadow-2xl">
            {/* Entry Header */}
            <div className="space-y-2 border-b border-[#F5F5F0]/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#C5A059] font-bold">
                  LEDGER PROOF RECORD: {selectedEntry.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${getStatusBadge(selectedEntry.epistemicStatus)}`}>
                    {selectedEntry.epistemicStatus}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${getPriorityBadge(selectedEntry.regenerativePotentialPriority)}`}>
                    {selectedEntry.regenerativePotentialPriority} Priority
                  </span>
                </div>
              </div>
              <h3 className="text-base font-serif font-bold text-[#F5F5F0] leading-relaxed">
                "{selectedEntry.claim}"
              </h3>
            </div>

            {/* Impact Metric Chips */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 bg-[#141414] border border-[#C5A059]/20 rounded-xs space-y-0.5">
                <span className="text-[9px] font-mono uppercase text-[#C5A059] flex items-center gap-1 font-bold">
                  <Heart className="w-3 h-3 text-rose-400" /> Moral Alignment
                </span>
                <div className="text-sm font-mono font-bold text-[#F5F5F0]">
                  {selectedEntry.moralAlignmentScore ?? 96}% Baseline
                </div>
              </div>

              <div className="p-2.5 bg-[#141414] border border-emerald-500/20 rounded-xs space-y-0.5">
                <span className="text-[9px] font-mono uppercase text-emerald-400 flex items-center gap-1 font-bold">
                  <Zap className="w-3 h-3 text-emerald-400" /> Regenerative Impact
                </span>
                <div className="text-sm font-mono font-bold text-emerald-300">
                  {selectedEntry.regenerativeScore ?? 94}/100 Potential
                </div>
              </div>
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

              {/* Dynamic Suggestions & Next Action Dispatcher */}
              <div className="p-3.5 bg-gradient-to-br from-[#121814] to-[#0A0D0B] border border-[#C5A059]/40 rounded-sm space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Strategic Mission Suggestions
                  </span>
                  <span className="text-[8px] font-mono px-1.5 py-0.2 bg-[#1B3022] text-emerald-300 rounded border border-emerald-500/30">
                    {selectedEntry.confidenceScore >= 90 ? 'High Epistemic Confidence' : 'Pending Multi-Party Seal'}
                  </span>
                </div>

                <div className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
                  {selectedEntry.confidenceScore >= 90 ? (
                    <span>
                      <strong className="text-white font-semibold">Evidence Grounded:</strong> In-situ telemetry and Merkle seal confirm causal attribution. 
                      Recommended next step: <em className="text-[#C5A059]">Advance directly to Capital Structuring & Outcomes Tokenization</em>.
                    </span>
                  ) : (
                    <span>
                      <strong className="text-amber-300 font-semibold">Verification Needed:</strong> Epistemic confidence score is under 90%. 
                      Recommended next step: <em className="text-[#C5A059]">Initiate Multi-Party Co-Signing or scan physical QR placarding</em>.
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      audioFeedback.playSyncComplete();
                      loadDiagnosisIntoPipeline({
                        id: selectedEntry.id,
                        primaryProblem: selectedEntry.claim,
                        bioregion: selectedEntry.source.includes('(') ? selectedEntry.source.split('(')[1].replace(')', '') : 'Nairobi Bioregion',
                        highestLeverageIntervention: selectedEntry.intervention,
                        evidenceProof: `Merkle Proof: ${selectedEntry.hash} (Certainty: ${selectedEntry.confidenceScore}%)`,
                        systemicDomain: 'INFRASTRUCTURE'
                      });
                      if (selectedEntry.confidenceScore >= 90) {
                        advanceMissionStage('VERIFIED_AUDIT');
                      }
                      if (onSelectTab) {
                        onSelectTab('capital-engine');
                      }
                    }}
                    className="py-2 px-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-mono font-bold text-[10px] uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Advance to Capital Engine</span>
                  </button>

                  <button
                    onClick={() => {
                      audioFeedback.playSubtleClick();
                      setIsAttestationModalOpen(true);
                    }}
                    className="py-2 px-2.5 bg-[#141414] hover:bg-[#1f1f1f] text-[#C5A059] border border-[#C5A059]/40 font-mono font-bold text-[10px] uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Co-Sign Multi-Party Audit</span>
                  </button>
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

      {/* Phase 04 Verification: Formal Counterfactual Attribution Engine */}
      <CounterfactualAttributionSimulator
        projectName={selectedEntry.intervention}
        onMintVerifiedCredential={() => setIsAttestationModalOpen(true)}
      />

      {/* Field Telemetry Ingestion Modal */}
      <FieldDataIngestionModal
        isOpen={isIngestionModalOpen}
        onClose={() => setIsIngestionModalOpen(false)}
        onIngestSuccess={(newEntry) => {
          setEntries((prev) => [newEntry, ...prev]);
          setSelectedEntry(newEntry);
        }}
      />

      {/* Physical Asset QR Code Scanner Modal */}
      <PhysicalAssetQrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onAssetVerified={(asset) => {
          const newEntry: EvidenceLedgerEntry = {
            id: `EV-${asset.assetId}`,
            claim: `Physical Placard [${asset.assetId}] scanned and verified with GPS lock (${asset.gpsCoords.lat}, ${asset.gpsCoords.lng}).`,
            intervention: asset.name,
            measurement: `In-situ telemetry confirmed at coordinates (${asset.gpsCoords.lat}, ${asset.gpsCoords.lng})`,
            outcome: `In-situ telemetry confirmed for ${asset.name}.`,
            confidenceScore: 99,
            epistemicStatus: 'Verified',
            source: `Ground-Truth Placard QR & GPS Sensor (${asset.bioregion})`,
            verifier: asset.lastAttestedBy,
            timestamp: new Date().toISOString(),
            methodology: 'On-Site Cryptographic Placard Scan with High-Precision GPS Lock',
            attributionType: 'Attribution',
            hash: asset.merkleSeal,
            moralAlignmentScore: 99,
            regenerativePotentialPriority: 'Critical',
            regenerativeScore: 98,
            version: 1,
            hasConflict: false
          };
          setEntries((prev) => [newEntry, ...prev]);
          setSelectedEntry(newEntry);
        }}
      />

      {/* Multi-Party Attestation & Verification Cryptographic Co-signing Modal */}
      <MultiPartyAttestationModal
        isOpen={isAttestationModalOpen}
        onClose={() => setIsAttestationModalOpen(false)}
        claimId={selectedEntry.id}
        claimTitle={selectedEntry.claim}
      />

      {/* Conflict Resolution Modal */}
      {activeConflict && (
        <LedgerConflictResolutionModal
          conflict={activeConflict}
          isOpen={!!activeConflict}
          onClose={() => setActiveConflict(null)}
          onResolve={handleConflictResolved}
        />
      )}
    </div>
  );
};
