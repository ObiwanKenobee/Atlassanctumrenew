import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  X, 
  Sparkles, 
  Cpu, 
  Lock, 
  FileCode, 
  ArrowRight,
  Layers,
  Activity,
  History
} from 'lucide-react';
import { BioregionalLedgerData } from '../../data/bioregionalLedgerData';
import { audioFeedback } from '../../lib/audioFeedback';

export interface EpistemicSnapshotRecord {
  txHash: string;
  blockNumber: number;
  merkleStateRoot: string;
  timestamp: string;
  regionId: string;
  regionName: string;
  epochYear: number;
  flourishingScore: number;
  waterYieldM3: number;
  carbonRateTonnes: number;
  activeFlowCount: number;
  gasUsed: string;
}

interface EpistemicSyncModalProps {
  region: BioregionalLedgerData;
  epochYear: number;
  flourishingScore: number;
  waterYieldM3: number;
  carbonRateTonnes: number;
  onClose: () => void;
  onSnapshotCreated?: (snapshot: EpistemicSnapshotRecord) => void;
  syncedHistory: EpistemicSnapshotRecord[];
}

export const EpistemicSyncModal: React.FC<EpistemicSyncModalProps> = ({
  region,
  epochYear,
  flourishingScore,
  waterYieldM3,
  carbonRateTonnes,
  onClose,
  onSnapshotCreated,
  syncedHistory
}) => {
  const [syncStep, setSyncStep] = useState<number>(0);
  const [completedRecord, setCompletedRecord] = useState<EpistemicSnapshotRecord | null>(null);
  const [hasCopiedHash, setHasCopiedHash] = useState<boolean>(false);
  const [hasCopiedRoot, setHasCopiedRoot] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'receipt' | 'payload' | 'history'>('receipt');

  // Multi-step blockchain transaction simulation
  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    let timer3: NodeJS.Timeout;
    let timer4: NodeJS.Timeout;

    // Step 1: Merkle Root computation (0 -> 1 after 400ms)
    timer1 = setTimeout(() => {
      setSyncStep(1);
    }, 500);

    // Step 2: zk-SNARK validity proof generation (1 -> 2 after 1100ms)
    timer2 = setTimeout(() => {
      setSyncStep(2);
    }, 1200);

    // Step 3: Multi-sig Oracle attestation & broadcast (2 -> 3 after 1900ms)
    timer3 = setTimeout(() => {
      setSyncStep(3);
    }, 2000);

    // Step 4: Block confirmation & consensus finality (3 -> 4 after 2800ms)
    timer4 = setTimeout(() => {
      setSyncStep(4);
      audioFeedback.playSuccess();

      const hexChars = '0123456789abcdef';
      const randomHex = (len: number) => Array.from({ length: len }, () => hexChars[Math.floor(Math.random() * hexChars.length)]).join('');

      const newRecord: EpistemicSnapshotRecord = {
        txHash: `0x${randomHex(40)}`,
        blockNumber: 184980 + Math.floor(Math.random() * 20),
        merkleStateRoot: `0x${randomHex(64)}`,
        timestamp: new Date().toISOString(),
        regionId: region.regionId,
        regionName: region.regionName,
        epochYear,
        flourishingScore,
        waterYieldM3,
        carbonRateTonnes,
        activeFlowCount: region.resourceFlows?.length || 8,
        gasUsed: '0.00042 ETH (Epistemic Subsidy)'
      };

      setCompletedRecord(newRecord);
      if (onSnapshotCreated) {
        onSnapshotCreated(newRecord);
      }
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [region, epochYear, flourishingScore, waterYieldM3, carbonRateTonnes]);

  const handleCopy = (text: string, type: 'hash' | 'root') => {
    navigator.clipboard.writeText(text);
    audioFeedback.playSubtleClick();
    if (type === 'hash') {
      setHasCopiedHash(true);
      setTimeout(() => setHasCopiedHash(false), 2000);
    } else {
      setHasCopiedRoot(true);
      setTimeout(() => setHasCopiedRoot(false), 2000);
    }
  };

  const handleDownloadPayloadJson = () => {
    if (!completedRecord) return;
    audioFeedback.playSubtleClick();
    const payload = {
      epistemicHeader: {
        protocol: 'Section 30 Epistemic Trust Protocol',
        version: '2.4.0-zk',
        chain: 'Epistemic Bioregional Consensus Layer',
        blockNumber: completedRecord.blockNumber,
        txHash: completedRecord.txHash,
        merkleStateRoot: completedRecord.merkleStateRoot,
        timestamp: completedRecord.timestamp,
        oracleVerifiers: [
          'Mara Transboundary Basin Commission',
          'Savory Institute Global Rangeland Network',
          'UN-Water In-Situ Telemetry Node',
          'WMO Satellite Hyperspectral Array'
        ]
      },
      bioregionalState: {
        regionId: completedRecord.regionId,
        regionName: completedRecord.regionName,
        epochYear: completedRecord.epochYear,
        compositeFlourishingScore: completedRecord.flourishingScore,
        waterYieldAnnualM3: completedRecord.waterYieldM3,
        carbonSequestrationRateAnnualTonnes: completedRecord.carbonRateTonnes,
        resourceFlowsSnapshot: region.resourceFlows,
        sankeyNodesSnapshot: region.sankeyNetwork?.nodes,
        sankeyLinksSnapshot: region.sankeyNetwork?.links
      }
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `epistemic-state-snapshot-${region.regionId}-${completedRecord.blockNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0B0F0C] border-2 border-emerald-500/60 shadow-2xl p-5 sm:p-6 space-y-5 overflow-hidden">
        {/* Background ambient gradient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-[#F5F5F0]/15 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Database className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                  Epistemic Consensus Engine
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded font-bold">
                  Section 30 zk-Rollup
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-wide">
                Cryptographic Epistemic Ledger Sync
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              onClose();
            }}
            className="p-2 rounded-lg bg-[#141C16] hover:bg-[#1E2922] text-[#F5F5F0]/60 hover:text-white border border-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TRANSACTION STAGES PROGRESS BAR */}
        {syncStep < 4 ? (
          <div className="p-4 rounded-xl bg-[#070A08] border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-bold flex items-center gap-2">
                <Cpu className="w-4 h-4 animate-spin text-emerald-400" />
                {syncStep === 0 && 'Constructing Merkle Patricia State Tree...'}
                {syncStep === 1 && 'Generating zk-SNARK Mass-Balance Proof...'}
                {syncStep === 2 && 'Signing with Epistemic Multi-Sig Oracles...'}
                {syncStep === 3 && 'Broadcasting Transaction to Consensus Nodes...'}
              </span>
              <span className="text-neutral-400 text-[10px]">
                Stage {syncStep + 1} / 4
              </span>
            </div>

            {/* Stepped Visual Indicators */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { title: 'Merkle Tree', desc: 'SHA-256 leaves' },
                { title: 'zk-Proof', desc: 'Conservation parity' },
                { title: 'Oracle Signs', desc: 'secp256k1 keys' },
                { title: 'Block Finality', desc: 'Consensus chain' }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    syncStep > idx
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                      : syncStep === idx
                        ? 'bg-emerald-500/20 border-emerald-400 text-white animate-pulse'
                        : 'bg-black/40 border-white/5 text-neutral-500'
                  }`}
                >
                  <div className="text-[10px] font-bold">{step.title}</div>
                  <div className="text-[8px] opacity-75">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Block Confirmed & Immutable on Epistemic Consensus Chain</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/40">
              Block #{completedRecord?.blockNumber}
            </span>
          </div>
        )}

        {/* Tab Switcher: Receipt | Raw Payload | Sync History */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('receipt')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'receipt'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-[#121914] text-neutral-400 hover:text-white'
            }`}
          >
            Transaction Receipt
          </button>
          <button
            onClick={() => setActiveTab('payload')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'payload'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-[#121914] text-neutral-400 hover:text-white'
            }`}
          >
            State Root & Payload
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-[#121914] text-neutral-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Synced Snapshots ({syncedHistory.length + (completedRecord ? 1 : 0)})</span>
          </button>
        </div>

        {/* Tab 1: Transaction Receipt */}
        {activeTab === 'receipt' && completedRecord && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#080D0A] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Transaction Hash:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-mono text-[11px]">
                    {completedRecord.txHash.substring(0, 16)}...{completedRecord.txHash.substring(completedRecord.txHash.length - 8)}
                  </span>
                  <button
                    onClick={() => handleCopy(completedRecord.txHash, 'hash')}
                    className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white cursor-pointer"
                    title="Copy Transaction Hash"
                  >
                    {hasCopiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Block Height:</span>
                <span className="text-white font-bold">#{completedRecord.blockNumber} (6 Confirmations)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Timestamp:</span>
                <span className="text-neutral-300">{completedRecord.timestamp.replace('T', ' ').substring(0, 19)} UTC</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Gas & Network Fee:</span>
                <span className="text-neutral-300">{completedRecord.gasUsed}</span>
              </div>
            </div>

            {/* Anchored Vital State Summary */}
            <div className="p-3 rounded-xl bg-[#080D0A] border border-[#C5A059]/30 space-y-2">
              <span className="text-[10px] text-[#C5A059] uppercase font-bold tracking-wider block">
                Anchored Biophysical State
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded bg-black/50 border border-white/5">
                  <span className="text-neutral-500 text-[9px] block">Flourishing Score</span>
                  <span className="font-bold text-white text-sm">{completedRecord.flourishingScore} / 100</span>
                </div>
                <div className="p-2 rounded bg-black/50 border border-white/5">
                  <span className="text-neutral-500 text-[9px] block">Annual Water Yield</span>
                  <span className="font-bold text-cyan-300 text-sm">{completedRecord.waterYieldM3 / 1000000}M m³</span>
                </div>
                <div className="p-2 rounded bg-black/50 border border-white/5">
                  <span className="text-neutral-500 text-[9px] block">Carbon Rate</span>
                  <span className="font-bold text-amber-300 text-sm">{completedRecord.carbonRateTonnes / 1000}k tCO2e</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: State Root & Payload */}
        {activeTab === 'payload' && completedRecord && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#080D0A] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Merkle State Root (SHA-256):</span>
                <button
                  onClick={() => handleCopy(completedRecord.merkleStateRoot, 'root')}
                  className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white cursor-pointer"
                  title="Copy Merkle State Root"
                >
                  {hasCopiedRoot ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="p-2 rounded bg-black/80 font-mono text-[10px] text-cyan-300 break-all border border-white/5 select-all">
                {completedRecord.merkleStateRoot}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#080D0A] border border-white/10 space-y-1.5">
              <span className="text-[10px] text-neutral-400 uppercase font-bold">Consensus Signers:</span>
              <ul className="space-y-1 text-[10px] text-neutral-300 font-mono">
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  Mara-Serengeti Transboundary Basin Commission (0x8192...472b)
                </li>
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  Savory Institute Holistic Rangeland Oracle (0x9923...01fa)
                </li>
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  UN-Water Section 30 Autonomous Trust Validator (0x1029...77cc)
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Historical Synced Snapshots */}
        {activeTab === 'history' && (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
            {[...(completedRecord ? [completedRecord] : []), ...syncedHistory].length === 0 ? (
              <div className="p-4 text-center text-neutral-500 font-sans">
                No previous snapshots recorded in current session.
              </div>
            ) : (
              [...(completedRecord ? [completedRecord] : []), ...syncedHistory].map((rec, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#080D0A] border border-white/10 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{rec.regionName}</span>
                      <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                        Block #{rec.blockNumber}
                      </span>
                    </div>
                    <div className="text-[9px] text-neutral-400">
                      Score: {rec.flourishingScore}/100 • Water: {rec.waterYieldM3 / 1000000}M m³ • {rec.timestamp.replace('T', ' ').substring(0, 19)} UTC
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(rec.merkleStateRoot, 'root')}
                    className="p-1 rounded bg-[#141C16] hover:bg-[#1E2922] text-neutral-300 hover:text-white border border-white/10 cursor-pointer"
                    title="Copy Merkle Root"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleDownloadPayloadJson}
            disabled={!completedRecord}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#141C16] hover:bg-[#1E2922] text-[#F5F5F0] border border-white/15 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download JSON Snapshot</span>
          </button>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-md cursor-pointer"
          >
            Done & Return to Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
