import React, { useState, useMemo } from 'react';
import {
  X,
  History,
  GitCompare,
  ArrowRight,
  PlusCircle,
  MinusCircle,
  CheckCircle2,
  TrendingUp,
  Layers,
  Sparkles,
  ShieldAlert,
  Calendar,
  ShieldCheck,
  Zap,
  Info,
  Filter,
  Eye
} from 'lucide-react';
import {
  HISTORICAL_VERSION_SNAPSHOTS,
  HistoricalVersionSnapshot,
  compareSnapshots,
  SnapshotComparisonResult
} from '../../services/bioregionalKnowledgeService';
import { KnowledgeNode, KnowledgeLink } from './BioregionalKnowledgeGraph';
import { audioFeedback } from '../../lib/audioFeedback';

interface CompareSnapshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  allNodes: KnowledgeNode[];
  allLinks: KnowledgeLink[];
  initialSnapshotAId?: string;
  initialSnapshotBId?: string;
  onApplyDiffOverlay: (snapshotAId: string, snapshotBId: string) => void;
  isDiffOverlayActive: boolean;
  onClearDiffOverlay: () => void;
}

export const CompareSnapshotsModal: React.FC<CompareSnapshotsModalProps> = ({
  isOpen,
  onClose,
  allNodes,
  allLinks,
  initialSnapshotAId = 'v1.0-2016',
  initialSnapshotBId = 'v3.2-2026',
  onApplyDiffOverlay,
  isDiffOverlayActive,
  onClearDiffOverlay
}) => {
  const [snapshotAId, setSnapshotAId] = useState<string>(initialSnapshotAId);
  const [snapshotBId, setSnapshotBId] = useState<string>(initialSnapshotBId);
  const [activeTab, setActiveTab] = useState<'overview' | 'added' | 'removed' | 'couplings'>('overview');
  const [searchFilter, setSearchFilter] = useState('');

  const nodeMap = useMemo(() => {
    return new Map<string, KnowledgeNode>(allNodes.map(n => [n.id, n]));
  }, [allNodes]);

  const linkMap = useMemo(() => {
    return new Map<string, KnowledgeLink>(allLinks.map(l => [l.id, l]));
  }, [allLinks]);

  const diffResult = useMemo(() => {
    return compareSnapshots(snapshotAId, snapshotBId, allNodes, allLinks);
  }, [snapshotAId, snapshotBId, allNodes, allLinks]);

  if (!isOpen) return null;

  const addedNodes = (diffResult?.addedNodeIds || []).map(id => nodeMap.get(id)).filter(Boolean) as KnowledgeNode[];
  const removedNodes = (diffResult?.removedNodeIds || []).map(id => nodeMap.get(id)).filter(Boolean) as KnowledgeNode[];
  const retainedNodes = (diffResult?.retainedNodeIds || []).map(id => nodeMap.get(id)).filter(Boolean) as KnowledgeNode[];

  const addedLinks = (diffResult?.addedLinkIds || []).map(id => linkMap.get(id)).filter(Boolean) as KnowledgeLink[];
  const removedLinks = (diffResult?.removedLinkIds || []).map(id => linkMap.get(id)).filter(Boolean) as KnowledgeLink[];

  // Quick comparison presets
  const presets = [
    { label: 'Decadal Evolution (2016 → 2026 Live)', a: 'v1.0-2016', b: 'v3.2-2026' },
    { label: 'Post-Drought Recovery (2019 → 2024)', a: 'v1.4-2019', b: 'v2.8-2024' },
    { label: 'Customary Expansion (2022 → 2026)', a: 'v2.1-2022', b: 'v3.2-2026' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#101010] border border-[#C5A059]/40 w-full max-w-4xl max-h-[90vh] rounded-md shadow-2xl flex flex-col overflow-hidden text-[#F5F5F0]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#F5F5F0]/10 bg-[#151515] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center">
              <GitCompare className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                  EPISTEMIC GRAPH DIFF
                </span>
                <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Snapshot Comparison
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#F5F5F0]">
                Compare Bioregional Knowledge Snapshots
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              audioFeedback.playMicroTick();
            }}
            className="p-1.5 text-[#F5F5F0]/50 hover:text-[#F5F5F0] hover:bg-[#222] rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snapshot Selectors & Presets Bar */}
        <div className="p-4 bg-[#141414] border-b border-[#F5F5F0]/10 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Snapshot A (Baseline) */}
            <div className="p-3 bg-[#1A1A1A] border border-[#F5F5F0]/15 rounded">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0]/60 font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#38BDF8]" /> Baseline Snapshot (A)
                </span>
                {diffResult?.snapshotA && (
                  <span className="text-[10px] font-mono text-[#38BDF8] font-bold">
                    Score: {diffResult.snapshotA.ecosystemIntegrityScore}%
                  </span>
                )}
              </div>
              <select
                value={snapshotAId}
                onChange={e => {
                  setSnapshotAId(e.target.value);
                  audioFeedback.playSubtleClick();
                }}
                className="w-full bg-[#0D0D0D] border border-[#F5F5F0]/20 rounded p-2 text-xs font-mono text-[#F5F5F0] focus:border-[#C5A059] outline-none cursor-pointer"
              >
                {HISTORICAL_VERSION_SNAPSHOTS.map(snap => (
                  <option key={`a-${snap.id}`} value={snap.id}>
                    {snap.version} ({snap.periodYear}) — {snap.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Snapshot B (Comparison) */}
            <div className="p-3 bg-[#1A1A1A] border border-[#F5F5F0]/15 rounded">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C5A059]" /> Target Epoch (B)
                </span>
                {diffResult?.snapshotB && (
                  <span className="text-[10px] font-mono text-[#C5A059] font-bold">
                    Score: {diffResult.snapshotB.ecosystemIntegrityScore}%
                  </span>
                )}
              </div>
              <select
                value={snapshotBId}
                onChange={e => {
                  setSnapshotBId(e.target.value);
                  audioFeedback.playSubtleClick();
                }}
                className="w-full bg-[#0D0D0D] border border-[#F5F5F0]/20 rounded p-2 text-xs font-mono text-[#F5F5F0] focus:border-[#C5A059] outline-none cursor-pointer"
              >
                {HISTORICAL_VERSION_SNAPSHOTS.map(snap => (
                  <option key={`b-${snap.id}`} value={snap.id}>
                    {snap.version} ({snap.periodYear}) — {snap.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <span className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-wider">Presets:</span>
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => {
                  setSnapshotAId(p.a);
                  setSnapshotBId(p.b);
                  audioFeedback.playMicroTick();
                }}
                className={`px-2.5 py-1 rounded text-[11px] border transition-colors cursor-pointer ${
                  snapshotAId === p.a && snapshotBId === p.b
                    ? 'bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]'
                    : 'bg-[#1e1e1e] text-[#F5F5F0]/70 border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30 hover:text-[#F5F5F0]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Delta Metrics Overview Cards */}
        {diffResult && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#0E0E0E] border-b border-[#F5F5F0]/10">
            
            {/* Added Nodes */}
            <div className="p-3 bg-[#151E19] border border-emerald-500/30 rounded">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                <span className="flex items-center gap-1 font-bold">
                  <PlusCircle className="w-3.5 h-3.5" /> Added Nodes
                </span>
                <span className="text-lg font-bold">+{diffResult.addedNodeIds.length}</span>
              </div>
              <p className="text-[10px] text-[#F5F5F0]/50 mt-1">Emerged causal entities</p>
            </div>

            {/* Removed / Retracted Nodes */}
            <div className="p-3 bg-[#241518] border border-rose-500/30 rounded">
              <div className="flex items-center justify-between text-xs font-mono text-rose-400">
                <span className="flex items-center gap-1 font-bold">
                  <MinusCircle className="w-3.5 h-3.5" /> Retracted
                </span>
                <span className="text-lg font-bold">-{diffResult.removedNodeIds.length}</span>
              </div>
              <p className="text-[10px] text-[#F5F5F0]/50 mt-1">Superseded baseline nodes</p>
            </div>

            {/* Added Couplings */}
            <div className="p-3 bg-[#131E24] border border-cyan-500/30 rounded">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                <span className="flex items-center gap-1 font-bold">
                  <Layers className="w-3.5 h-3.5" /> Net Couplings
                </span>
                <span className="text-lg font-bold">
                  {diffResult.linkCountDelta >= 0 ? `+${diffResult.linkCountDelta}` : diffResult.linkCountDelta}
                </span>
              </div>
              <p className="text-[10px] text-[#F5F5F0]/50 mt-1">
                {diffResult.addedLinkIds.length} added / {diffResult.removedLinkIds.length} retracted
              </p>
            </div>

            {/* Ecosystem Integrity Delta */}
            <div className="p-3 bg-[#241E10] border border-[#C5A059]/40 rounded">
              <div className="flex items-center justify-between text-xs font-mono text-[#FBBF24]">
                <span className="flex items-center gap-1 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" /> Integrity Delta
                </span>
                <span className="text-lg font-bold">
                  {diffResult.integrityScoreDelta >= 0 ? `+${diffResult.integrityScoreDelta}%` : `${diffResult.integrityScoreDelta}%`}
                </span>
              </div>
              <p className="text-[10px] text-[#F5F5F0]/50 mt-1">
                {diffResult.snapshotA.ecosystemIntegrityScore}% → {diffResult.snapshotB.ecosystemIntegrityScore}%
              </p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center px-4 bg-[#141414] border-b border-[#F5F5F0]/10 text-xs font-mono">
          <button
            onClick={() => {
              setActiveTab('overview');
              audioFeedback.playMicroTick();
            }}
            className={`py-2.5 px-4 border-b-2 font-bold cursor-pointer transition-colors ${
              activeTab === 'overview'
                ? 'border-[#C5A059] text-[#C5A059]'
                : 'border-transparent text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
            }`}
          >
            Overview & Milestones
          </button>
          <button
            onClick={() => {
              setActiveTab('added');
              audioFeedback.playMicroTick();
            }}
            className={`py-2.5 px-4 border-b-2 font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'added'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            Added Nodes ({addedNodes.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('removed');
              audioFeedback.playMicroTick();
            }}
            className={`py-2.5 px-4 border-b-2 font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'removed'
                ? 'border-rose-400 text-rose-400'
                : 'border-transparent text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
            }`}
          >
            <MinusCircle className="w-3.5 h-3.5 text-rose-400" />
            Retracted ({removedNodes.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('couplings');
              audioFeedback.playMicroTick();
            }}
            className={`py-2.5 px-4 border-b-2 font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'couplings'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Couplings (+{addedLinks.length} / -{removedLinks.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* TAB 1: Overview & Milestones Comparison */}
          {activeTab === 'overview' && diffResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Snapshot A Details */}
                <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#38BDF8]">
                      Snapshot A: {diffResult.snapshotA.version} ({diffResult.snapshotA.periodYear})
                    </span>
                    <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                      Audit: {diffResult.snapshotA.auditDate}
                    </span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
                    {diffResult.snapshotA.title}
                  </h4>
                  <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
                    {diffResult.snapshotA.summary}
                  </p>
                  <div className="pt-2 border-t border-[#F5F5F0]/10">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0]/50 font-bold block mb-1.5">
                      Key Baseline Milestones:
                    </span>
                    <ul className="space-y-1">
                      {diffResult.snapshotA.keyMilestones.map((m, idx) => (
                        <li key={idx} className="text-xs text-[#F5F5F0]/70 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Snapshot B Details */}
                <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#C5A059]">
                      Snapshot B: {diffResult.snapshotB.version} ({diffResult.snapshotB.periodYear})
                    </span>
                    <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                      Audit: {diffResult.snapshotB.auditDate}
                    </span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
                    {diffResult.snapshotB.title}
                  </h4>
                  <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
                    {diffResult.snapshotB.summary}
                  </p>
                  <div className="pt-2 border-t border-[#F5F5F0]/10">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0]/50 font-bold block mb-1.5">
                      Target Epoch Milestones:
                    </span>
                    <ul className="space-y-1">
                      {diffResult.snapshotB.keyMilestones.map((m, idx) => (
                        <li key={idx} className="text-xs text-[#F5F5F0]/70 flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cryptographic Audit Trail */}
              <div className="p-3 bg-[#0C0C0C] border border-[#F5F5F0]/10 rounded text-xs font-mono space-y-1.5">
                <div className="text-[10px] uppercase text-[#F5F5F0]/50 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  Epistemic Consensus & Provenance Hashes
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
                  <div className="text-[#F5F5F0]/70 truncate">
                    <span className="text-[#38BDF8]">Snap A Hash: </span>
                    <span className="text-[#F5F5F0]/50">{diffResult.snapshotA.cryptographicHash}</span>
                  </div>
                  <div className="text-[#F5F5F0]/70 truncate">
                    <span className="text-[#C5A059]">Snap B Hash: </span>
                    <span className="text-[#F5F5F0]/50">{diffResult.snapshotB.cryptographicHash}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Added Nodes */}
          {activeTab === 'added' && (
            <div className="space-y-2.5">
              {addedNodes.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-[#F5F5F0]/40">
                  No newly added nodes found between these two snapshots.
                </div>
              ) : (
                addedNodes.map(node => (
                  <div
                    key={node.id}
                    className="p-3 bg-[#131A15] border border-emerald-500/40 rounded flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center font-mono font-bold text-xs text-emerald-300 shrink-0">
                        +
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-bold text-[#F5F5F0]">
                            {node.label}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-950 text-emerald-300 rounded border border-emerald-500/30">
                            {node.categoryName}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#F5F5F0]/60 mt-0.5">
                          {node.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 text-xs font-mono">
                      <div className="text-emerald-400 font-bold">{node.metric || 'Active'}</div>
                      <div className="text-[10px] text-[#F5F5F0]/40">{node.ecologicalLayer}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Removed Nodes */}
          {activeTab === 'removed' && (
            <div className="space-y-2.5">
              {removedNodes.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-[#F5F5F0]/40">
                  No retracted nodes between these two snapshots. All baseline nodes persist.
                </div>
              ) : (
                removedNodes.map(node => (
                  <div
                    key={node.id}
                    className="p-3 bg-[#1F1315] border border-rose-500/40 rounded flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center font-mono font-bold text-xs text-rose-300 shrink-0">
                        -
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-bold text-[#F5F5F0]">
                            {node.label}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 bg-rose-950 text-rose-300 rounded border border-rose-500/30">
                            {node.categoryName}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#F5F5F0]/60 mt-0.5">
                          {node.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 text-xs font-mono">
                      <div className="text-rose-400 font-bold">Retracted</div>
                      <div className="text-[10px] text-[#F5F5F0]/40">{node.ecologicalLayer}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: Couplings Diff */}
          {activeTab === 'couplings' && (
            <div className="space-y-4">
              {/* Added Links */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
                  <PlusCircle className="w-3.5 h-3.5" /> Added Biophysical Couplings ({addedLinks.length})
                </h4>
                <div className="space-y-1.5">
                  {addedLinks.map(link => (
                    <div
                      key={link.id}
                      className="p-2.5 bg-[#121A15] border border-emerald-500/30 rounded text-xs font-mono flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-300 font-bold">
                          {typeof link.source === 'object' ? (link.source as any).label : link.source}
                        </span>
                        <ArrowRight className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-300 font-bold">
                          {typeof link.target === 'object' ? (link.target as any).label : link.target}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-400 rounded">
                          {link.relationshipLabel}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#F5F5F0]/40 font-bold">
                        Strength: {Math.round(link.strength * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Removed Links */}
              {removedLinks.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold mb-2 flex items-center gap-1.5">
                    <MinusCircle className="w-3.5 h-3.5" /> Retracted Couplings ({removedLinks.length})
                  </h4>
                  <div className="space-y-1.5">
                    {removedLinks.map(link => (
                      <div
                        key={link.id}
                        className="p-2.5 bg-[#1F1215] border border-rose-500/30 rounded text-xs font-mono flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-rose-300 font-bold">
                            {typeof link.source === 'object' ? (link.source as any).label : link.source}
                          </span>
                          <ArrowRight className="w-3 h-3 text-rose-500" />
                          <span className="text-rose-300 font-bold">
                            {typeof link.target === 'object' ? (link.target as any).label : link.target}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-rose-950 text-rose-400 rounded">
                            {link.relationshipLabel}
                          </span>
                        </div>
                        <span className="text-[10px] text-rose-400 font-bold">Retracted</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-[#141414] border-t border-[#F5F5F0]/10 flex items-center justify-between gap-4">
          <div className="text-xs font-mono text-[#F5F5F0]/60 hidden sm:block">
            {isDiffOverlayActive ? (
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <Eye className="w-3.5 h-3.5" /> Visual Diff Overlay is currently active on graph canvas
              </span>
            ) : (
              <span>Overlay diff highlighting on live D3 knowledge canvas</span>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isDiffOverlayActive && (
              <button
                onClick={() => {
                  onClearDiffOverlay();
                  audioFeedback.playMicroTick();
                }}
                className="px-3 py-2 bg-[#222] hover:bg-[#333] text-[#F5F5F0] text-xs font-mono rounded cursor-pointer transition-colors"
              >
                Clear Graph Overlay
              </button>
            )}
            <button
              onClick={() => {
                onApplyDiffOverlay(snapshotAId, snapshotBId);
                onClose();
                audioFeedback.playDataSave();
              }}
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs font-mono rounded cursor-pointer transition-all flex items-center gap-2 shadow-lg"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Apply Visual Diff to Graph</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
