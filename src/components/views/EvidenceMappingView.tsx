import React, { useState } from 'react';
import { 
  Layers, 
  GitBranch, 
  ShieldCheck, 
  CheckCircle2, 
  Radio, 
  FileText, 
  Search, 
  Filter, 
  ExternalLink, 
  Sparkles, 
  Hash, 
  Info, 
  Cpu, 
  ArrowRight, 
  ArrowDown, 
  ChevronRight, 
  Eye, 
  Clock, 
  Lock, 
  Compass, 
  RotateCcw,
  AlertCircle,
  Database,
  Workflow
} from 'lucide-react';
import { EVIDENCE_TREES } from '../../data/evidenceMappingData';
import { ALL_FEATURED_MISSIONS } from '../../data/featuredMissionData';
import { EvidenceMappingNode, EvidenceNodeType, EpistemicStatus, PageView } from '../../types';
import { RealityCheck } from '../RealityCheck';
import { audioFeedback } from '../../lib/audioFeedback';

interface EvidenceMappingViewProps {
  onSelectTab: (tab: PageView) => void;
  onInspectProvenance?: (prov: any) => void;
}

export const EvidenceMappingView: React.FC<EvidenceMappingViewProps> = ({
  onSelectTab,
  onInspectProvenance
}) => {
  const [selectedMissionId, setSelectedMissionId] = useState<string>('mission-mathare-river');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('raw-sensor-ysi-probe');
  const [activeTierFilter, setActiveTierFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isVerifyingMerkle, setIsVerifyingMerkle] = useState(false);
  const [merkleVerifiedStatus, setMerkleVerifiedStatus] = useState<boolean | null>(null);

  const currentTree = EVIDENCE_TREES[selectedMissionId] || EVIDENCE_TREES['mission-mathare-river'];
  const nodes = currentTree.nodes;

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Helper to compute highlighted lineage (ancestors + descendants)
  const getLineageNodeIds = (targetNodeId: string): Set<string> => {
    const lineage = new Set<string>();
    lineage.add(targetNodeId);

    // Add ancestors (parents)
    const addParents = (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        node.parentIds.forEach(pId => {
          lineage.add(pId);
          addParents(pId);
        });
      }
    };

    // Add descendants (children)
    const addChildren = (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        node.childIds.forEach(cId => {
          lineage.add(cId);
          addChildren(cId);
        });
      }
    };

    addParents(targetNodeId);
    addChildren(targetNodeId);
    return lineage;
  };

  const activeLineageIds = getLineageNodeIds(selectedNodeId);

  // Group nodes by Level (1 to 4)
  const level1Nodes = nodes.filter(n => n.level === 1);
  const level2Nodes = nodes.filter(n => n.level === 2);
  const level3Nodes = nodes.filter(n => n.level === 3);
  const level4Nodes = nodes.filter(n => n.level === 4);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    audioFeedback.playMicroTick();
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleTestMerkleProof = () => {
    audioFeedback.playSubtleClick();
    setIsVerifyingMerkle(true);
    setMerkleVerifiedStatus(null);

    setTimeout(() => {
      setIsVerifyingMerkle(false);
      setMerkleVerifiedStatus(true);
      audioFeedback.playSyncComplete();
    }, 600);
  };

  const getNodeTypeBadge = (type: EvidenceNodeType) => {
    switch (type) {
      case 'goal':
        return { label: 'Level 1: High-Level Goal', color: 'bg-purple-950/80 text-purple-300 border-purple-500/40' };
      case 'milestone':
        return { label: 'Level 2: Milestone Hypothesis', color: 'bg-blue-950/80 text-blue-300 border-blue-500/40' };
      case 'kpi_metric':
        return { label: 'Level 3: Biophysical KPI Package', color: 'bg-[#1B3022] text-[#C5A059] border-[#C5A059]/40' };
      case 'raw_telemetry':
        return { label: 'Level 4: Raw Sensor & Baraza Telemetry', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' };
    }
  };

  const getEpistemicBadge = (status: EpistemicStatus) => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
      case 'observed':
        return 'bg-cyan-950 text-cyan-300 border-cyan-500/40';
      case 'reported':
        return 'bg-amber-950 text-amber-300 border-amber-500/40';
      case 'modeled':
        return 'bg-purple-950 text-purple-300 border-purple-500/40';
      case 'estimated':
      default:
        return 'bg-zinc-900 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              EPISTEMIC CONSTITUTION • COMMANDMENT IX & II
            </span>
            <span className="text-[9px] font-mono bg-[#1B3022] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              4-Tier Merkle Lineage DAG
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
            Interactive Evidence Mapping
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 font-sans leading-relaxed">
            Trace the unbroken lineage of every civilizational claim from the high-level mission objective down through operational milestones, biophysical KPIs, to raw physical sensor voltages, laboratory core tests, and community baraza witness ledgers.
          </p>
        </div>

        {/* Mission Switcher Dropdown */}
        <div className="space-y-1 shrink-0 w-full sm:w-auto">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/40 block">Select Mission DAG:</span>
          <select
            value={selectedMissionId}
            onChange={(e) => {
              audioFeedback.playSubtleClick();
              setSelectedMissionId(e.target.value);
              const newTree = EVIDENCE_TREES[e.target.value] || EVIDENCE_TREES['mission-mathare-river'];
              setSelectedNodeId(newTree.nodes[0]?.id || '');
            }}
            className="w-full sm:w-auto bg-[#121212] border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono font-bold px-3 py-2 rounded focus:outline-none focus:border-[#C5A059]"
          >
            {ALL_FEATURED_MISSIONS.map(m => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Epistemic Constitution Banner */}
      <RealityCheck
        data={{
          status: 'verified',
          confidenceScore: 98,
          uncertaintyMargin: '± 0.05%',
          epistemicTier: 'Cryptographic SHA-256 Merkle Provenance DAG',
          realityVsModelWarning: 'Commandment II: Reality Above Model. In the Atlas Sanctum, high-level claims have ZERO validity without an auditable path down to empirical sensor readings or witnessed community protocols.',
          sensorHealth: 99,
          dataOrigin: selectedNode.sensorOrSourceType || 'Decentralized Multi-Parameter Sensor Mesh',
          cryptographicHash: selectedNode.cryptographicHash,
          lastVerified: selectedNode.lastVerified,
          verifiedBy: selectedNode.verifiedBy
        }}
      />

      {/* Main 2-Column Layout: Visual 4-Tier Lineage Canvas (8 cols) + Node Inspector Drawer (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: 4-Tier Visual Lineage DAG (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Level Explanations Bar */}
          <div className="p-3 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-lg flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider overflow-x-auto gap-4">
            <span className="flex items-center gap-1.5 text-purple-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              L1: Civilizational Goal
            </span>
            <ArrowRight className="w-3 h-3 text-[#F5F5F0]/20" />
            <span className="flex items-center gap-1.5 text-blue-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              L2: Operational Milestones
            </span>
            <ArrowRight className="w-3 h-3 text-[#F5F5F0]/20" />
            <span className="flex items-center gap-1.5 text-[#C5A059] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              L3: Biophysical KPIs
            </span>
            <ArrowRight className="w-3 h-3 text-[#F5F5F0]/20" />
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              L4: Raw Sensor & Baraza Audits
            </span>
          </div>

          {/* ---------------- LEVEL 1: HIGH-LEVEL GOAL ---------------- */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-purple-400 font-bold">
              <span>Level 1: Civilizational Mission Goal</span>
              <span className="text-[10px] text-[#F5F5F0]/40 font-normal">Click to highlight entire proof tree</span>
            </div>

            <div className="space-y-3">
              {level1Nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const isInActiveLineage = activeLineageIds.has(node.id);
                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      audioFeedback.playSubtleClick();
                      setSelectedNodeId(node.id);
                    }}
                    className={`p-4 sm:p-5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-purple-950/30 border-purple-400 ring-2 ring-purple-400/40 shadow-lg'
                        : isInActiveLineage
                        ? 'bg-[#121212] border-purple-500/50 shadow-md'
                        : 'bg-[#0D0D0D] border-[#F5F5F0]/10 hover:border-purple-400/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#A855F7]" />
                        <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                          {node.title}
                        </h3>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${getEpistemicBadge(node.epistemicStatus)}`}>
                        {node.epistemicStatus.toUpperCase()} ({node.certaintyScore}%)
                      </span>
                    </div>
                    <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-purple-400/60 animate-bounce" />
          </div>

          {/* ---------------- LEVEL 2: OPERATIONAL MILESTONES ---------------- */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-blue-400 font-bold">
              <span>Level 2: Operational Milestones & Hypotheses</span>
              <span className="text-[10px] text-[#F5F5F0]/40 font-normal">{level2Nodes.length} Stages</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {level2Nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const isInActiveLineage = activeLineageIds.has(node.id);
                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      audioFeedback.playSubtleClick();
                      setSelectedNodeId(node.id);
                    }}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-400 ring-2 ring-blue-400/40 shadow-lg'
                        : isInActiveLineage
                        ? 'bg-[#121212] border-blue-500/50'
                        : 'bg-[#0D0D0D] border-[#F5F5F0]/10 hover:border-blue-400/40'
                    }`}
                  >
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono uppercase text-blue-400 font-bold">
                          {node.subtitle.split('•')[0]}
                        </span>
                        <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded border ${getEpistemicBadge(node.epistemicStatus)}`}>
                          {node.epistemicStatus}
                        </span>
                      </div>
                      <h4 className="text-xs font-serif font-bold text-[#F5F5F0] leading-snug">
                        {node.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#F5F5F0]/60 font-sans line-clamp-3">
                      {node.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-blue-400/60 animate-bounce" />
          </div>

          {/* ---------------- LEVEL 3: BIOPHYSICAL KPIS & EVIDENCE PACKAGES ---------------- */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-[#C5A059] font-bold">
              <span>Level 3: Biophysical KPIs & Evidence Packages</span>
              <span className="text-[10px] text-[#F5F5F0]/40 font-normal">{level3Nodes.length} Verified Indicators</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {level3Nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const isInActiveLineage = activeLineageIds.has(node.id);
                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      audioFeedback.playSubtleClick();
                      setSelectedNodeId(node.id);
                    }}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-[#1B3022]/60 border-[#C5A059] ring-2 ring-[#C5A059]/40 shadow-lg'
                        : isInActiveLineage
                        ? 'bg-[#121212] border-[#C5A059]/50'
                        : 'bg-[#0D0D0D] border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-serif font-bold text-[#F5F5F0]">
                        {node.title}
                      </h4>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold shrink-0">
                        {node.certaintyScore}% Rigor
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#C5A059]">
                      {node.subtitle}
                    </p>
                    <p className="text-[11px] text-[#F5F5F0]/60 font-sans leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-[#C5A059]/60 animate-bounce" />
          </div>

          {/* ---------------- LEVEL 4: RAW SENSORS, LAB ASSAYS & COMMUNITY AUDITS ---------------- */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-emerald-400 font-bold">
              <span>Level 4: Empirical Ground Truth (Sensors, Assays, Barazas)</span>
              <span className="text-[10px] text-[#F5F5F0]/40 font-normal">{level4Nodes.length} In-Situ Sources</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {level4Nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const isInActiveLineage = activeLineageIds.has(node.id);
                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      audioFeedback.playSubtleClick();
                      setSelectedNodeId(node.id);
                    }}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/50 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg'
                        : isInActiveLineage
                        ? 'bg-[#121212] border-emerald-500/50'
                        : 'bg-[#0D0D0D] border-[#F5F5F0]/10 hover:border-emerald-400/40'
                    }`}
                  >
                    <div className="space-y-1.5 mb-2">
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 font-bold">
                        <Radio className="w-3 h-3 animate-pulse" />
                        <span className="truncate">{node.sensorOrSourceType?.split(' ')[0] || 'Sensor'}</span>
                      </div>
                      <h4 className="text-xs font-serif font-bold text-white leading-snug">
                        {node.title}
                      </h4>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-[#F5F5F0]/10 text-[10px] font-mono text-[#F5F5F0]/40">
                      <div className="truncate">Auditor: {node.verifiedBy.split(',')[0]}</div>
                      <div className="text-emerald-400 font-bold">{node.lastVerified}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right: Node Inspector Drawer (4 cols) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          <div className="p-5 rounded-lg bg-[#0D0D0D] border border-[#C5A059]/40 shadow-2xl space-y-5">
            
            {/* Inspector Header */}
            <div className="space-y-2 pb-4 border-b border-[#F5F5F0]/10">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${getNodeTypeBadge(selectedNode.type).color}`}>
                  {getNodeTypeBadge(selectedNode.type).label}
                </span>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${getEpistemicBadge(selectedNode.epistemicStatus)}`}>
                  {selectedNode.epistemicStatus.toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg font-serif text-[#F5F5F0] font-bold">
                {selectedNode.title}
              </h2>
              <p className="text-xs font-mono text-[#C5A059]">
                {selectedNode.subtitle}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1 text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
              <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/40 block">Description:</span>
              <p>{selectedNode.description}</p>
            </div>

            {/* Metadata Grid */}
            <div className="space-y-2 p-3 rounded bg-black/40 border border-white/5 text-xs font-mono text-[#F5F5F0]/70">
              <div className="flex items-center justify-between">
                <span className="text-[#F5F5F0]/40">Certainty Score:</span>
                <span className="text-emerald-400 font-bold">{selectedNode.certaintyScore}%</span>
              </div>
              {selectedNode.uncertaintyMargin && (
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F0]/40">Uncertainty Margin:</span>
                  <span className="text-amber-300 font-bold">{selectedNode.uncertaintyMargin}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[#F5F5F0]/40">Last Verified:</span>
                <span>{selectedNode.lastVerified}</span>
              </div>
              <div className="flex items-start justify-between gap-2 pt-1 border-t border-white/5">
                <span className="text-[#F5F5F0]/40 shrink-0">Signatory:</span>
                <span className="text-right text-white font-medium truncate">{selectedNode.verifiedBy}</span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Hash Card */}
            <div className="space-y-1.5 p-3 rounded bg-[#121212] border border-[#F5F5F0]/10">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#C5A059]" />
                  <span>SHA-256 Verification Hash</span>
                </span>
                <button
                  onClick={() => handleCopyHash(selectedNode.cryptographicHash)}
                  className="text-[#C5A059] hover:underline font-bold"
                >
                  {copiedHash === selectedNode.cryptographicHash ? 'Copied!' : 'Copy Hash'}
                </button>
              </div>
              <p className="text-[10px] font-mono text-[#F5F5F0]/80 break-all bg-black/60 p-2 rounded border border-white/5">
                {selectedNode.cryptographicHash}
              </p>
            </div>

            {/* Raw JSON Telemetry Payload Preview */}
            {selectedNode.rawPayload && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50">
                  <span className="flex items-center gap-1">
                    <Database className="w-3 h-3 text-emerald-400" />
                    <span>Raw In-Situ Payload Telemetry</span>
                  </span>
                  <span className="text-emerald-400 font-bold">Unmodified</span>
                </div>
                <pre className="text-[10px] font-mono bg-black/80 p-3 rounded border border-emerald-500/20 text-emerald-300 max-h-48 overflow-y-auto leading-relaxed">
                  {JSON.stringify(selectedNode.rawPayload, null, 2)}
                </pre>
              </div>
            )}

            {/* Merkle Proof Verification Action */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleTestMerkleProof}
                disabled={isVerifyingMerkle}
                className="w-full py-2.5 px-4 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isVerifyingMerkle ? 'Verifying Merkle Root...' : 'Verify Cryptographic Merkle Root'}</span>
              </button>

              {merkleVerifiedStatus && (
                <div className="p-2.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Merkle Path Valid: Lineage cryptographically anchored to Root Hash.</span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
