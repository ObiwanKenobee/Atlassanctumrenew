import React, { useState } from 'react';
import { 
  Network, 
  Share2, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Coins, 
  Users, 
  AlertCircle, 
  Building2, 
  Compass, 
  Database,
  Search,
  Filter,
  Sparkles
} from 'lucide-react';
import { OPPORTUNITY_GRAPH_NODES } from '../../data/prompt2CivilizationData';
import { OpportunityNode } from '../../types';

interface OpportunityGraphViewProps {
  onInspectProvenance?: (prov: any) => void;
  onOpenMoralSimulator?: () => void;
  onOpenCommandCenter?: () => void;
}

export const OpportunityGraphView: React.FC<OpportunityGraphViewProps> = ({
  onInspectProvenance,
  onOpenMoralSimulator,
  onOpenCommandCenter
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('proj-turkana-desal');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedNode = OPPORTUNITY_GRAPH_NODES.find(n => n.id === selectedNodeId) || OPPORTUNITY_GRAPH_NODES[0];

  // Connected nodes
  const connectedNodes = OPPORTUNITY_GRAPH_NODES.filter(n => 
    selectedNode.connections.includes(n.id) || n.connections.includes(selectedNode.id)
  );

  const filteredNodes = OPPORTUNITY_GRAPH_NODES.filter(n => {
    const matchesFilter = activeFilter === 'all' || n.type === activeFilter;
    const matchesSearch = n.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.details.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getNodeTypeBadge = (type: OpportunityNode['type']) => {
    switch (type) {
      case 'problem':
        return { label: 'Problem Vector', bg: 'bg-rose-950/60 text-rose-300 border-rose-500/40' };
      case 'project':
        return { label: 'Intervention Project', bg: 'bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]/50' };
      case 'community':
        return { label: 'Community Sovereign', bg: 'bg-purple-950/60 text-purple-300 border-purple-500/40' };
      case 'capital':
        return { label: 'Patient Capital', bg: 'bg-amber-950/60 text-amber-300 border-amber-500/40' };
      case 'builder':
        return { label: 'Execution Builder', bg: 'bg-blue-950/60 text-blue-300 border-blue-500/40' };
      case 'infrastructure':
        return { label: 'Physical Infrastructure', bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40' };
      case 'outcome':
        return { label: 'Flourishing Outcome', bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' };
      case 'evidence':
        return { label: 'Evidence Ledger', bg: 'bg-teal-950/60 text-teal-300 border-teal-500/40' };
      default:
        return { label: 'Node', bg: 'bg-neutral-800 text-neutral-300 border-neutral-700' };
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-[#F5F5F0] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3 border-b border-[#F5F5F0]/10 pb-6">
        <div className="flex items-center gap-2">
          <div className="h-px w-6 bg-[#C5A059]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-mono font-bold">
            Civilization Coordination Layer
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F5F0]">
              The Opportunity Graph
            </h1>
            <p className="text-sm text-[#F5F5F0]/60 max-w-2xl mt-1">
              Explore interconnected nodes uniting local problems, community stewards, builders, patient capital, physical infrastructure, and cryptographically verified flourishing outcomes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCommandCenter}
              className="px-3.5 py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-[#F5F5F0]/20 rounded-sm text-xs font-mono text-[#F5F5F0] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Query Graph (⌘K)</span>
            </button>
            <button
              onClick={onOpenMoralSimulator}
              className="px-3.5 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 rounded-sm text-xs font-mono text-[#C5A059] font-bold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Evaluate Graph Node</span>
            </button>
          </div>
        </div>
      </div>

      {/* Narrative Architecture Banner */}
      <div className="p-4 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm flex items-center justify-between overflow-x-auto whitespace-nowrap gap-4 text-xs font-mono">
        <span className="text-[#C5A059] font-bold uppercase tracking-wider">Causal Loop:</span>
        <span className="text-rose-400">PROBLEM</span>
        <ArrowRight className="w-3 h-3 text-[#F5F5F0]/30 shrink-0" />
        <span className="text-purple-400">COMMUNITY</span>
        <ArrowRight className="w-3 h-3 text-[#F5F5F0]/30 shrink-0" />
        <span className="text-[#C5A059]">PROJECT</span>
        <ArrowRight className="w-3 h-3 text-[#F5F5F0]/30 shrink-0" />
        <span className="text-amber-400">CAPITAL</span>
        <ArrowRight className="w-3 h-3 text-[#F5F5F0]/30 shrink-0" />
        <span className="text-blue-400">BUILDER</span>
        <ArrowRight className="w-3 h-3 text-[#F5F5F0]/30 shrink-0" />
        <span className="text-cyan-400">INFRASTRUCTURE</span>
        <ArrowRight className="w-3 h-3 text-[#F5F5F0]/30 shrink-0" />
        <span className="text-emerald-400 font-bold">OUTCOME</span>
        <ArrowRight className="w-3 h-3 text-[#F5F5F0]/30 shrink-0" />
        <span className="text-teal-400">EVIDENCE</span>
      </div>

      {/* Main Graph & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Graph Map & Node Selector */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#F5F5F0]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search problems, projects, capital pools, or evidence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-[#F5F5F0]/15 rounded-sm pl-9 pr-3 py-2 text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/40 focus:outline-none focus:border-[#C5A059] font-mono"
              />
            </div>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="bg-[#111] border border-[#F5F5F0]/15 rounded-sm px-3 py-2 text-xs text-[#F5F5F0] font-mono focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">All Node Classes (12)</option>
              <option value="problem">Problems & Bottlenecks</option>
              <option value="project">Interventions</option>
              <option value="community">Communities</option>
              <option value="capital">Capital Tranches</option>
              <option value="infrastructure">Physical Infrastructure</option>
              <option value="outcome">Flourishing Outcomes</option>
              <option value="evidence">Evidence Ledgers</option>
            </select>
          </div>

          {/* Node Cards List */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredNodes.map((node) => {
              const badge = getNodeTypeBadge(node.type);
              const isSelected = node.id === selectedNodeId;
              const isDirectlyConnected = selectedNode.connections.includes(node.id) || node.connections.includes(selectedNode.id);

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-sm border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#161616] border-[#C5A059] shadow-lg shadow-[#C5A059]/5' 
                      : isDirectlyConnected
                        ? 'bg-[#111111] border-[#C5A059]/40 hover:border-[#C5A059]'
                        : 'bg-[#0D0D0D] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30 hover:bg-[#121212]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                          {node.category}
                        </span>
                        {isDirectlyConnected && !isSelected && (
                          <span className="text-[9px] font-mono text-[#C5A059] bg-[#C5A059]/10 px-1.5 py-0.2 rounded border border-[#C5A059]/30">
                            Connected ({selectedNode.label.slice(0, 14)}...)
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[#F5F5F0]">
                        {node.label}
                      </h3>
                      <p className="text-xs text-[#F5F5F0]/70 line-clamp-2">
                        {node.details.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-mono text-emerald-400 font-bold">
                        {node.confidence}% Conf.
                      </div>
                      <div className="text-[9px] font-mono text-[#F5F5F0]/40 mt-1">
                        {node.connections.length} Links
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#F5F5F0]/5 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/60">
                    <span className="truncate max-w-[280px]">Metric: {node.metrics}</span>
                    <span className="text-[#C5A059] hover:underline flex items-center gap-1">
                      Inspect Node <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Node Deep Systems Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-6 sticky top-24 shadow-2xl">
            {/* Header */}
            <div className="space-y-2 border-b border-[#F5F5F0]/10 pb-4">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider border ${getNodeTypeBadge(selectedNode.type).bg}`}>
                  {getNodeTypeBadge(selectedNode.type).label}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Epistemic Score: {selectedNode.confidence}/100
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#F5F5F0] font-serif">
                {selectedNode.label}
              </h2>
              <div className="text-xs font-mono text-[#C5A059]">
                Category: {selectedNode.category}
              </div>
            </div>

            {/* Description & Impact Metrics */}
            <div className="space-y-3">
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#F5F5F0]/50 mb-1">
                  Causal Description & Purpose
                </h4>
                <p className="text-xs text-[#F5F5F0]/80 leading-relaxed">
                  {selectedNode.details.description}
                </p>
              </div>

              <div className="p-3 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059]">
                  Primary System Metric
                </span>
                <div className="text-sm font-mono font-bold text-[#F5F5F0]">
                  {selectedNode.metrics}
                </div>
              </div>

              {selectedNode.details.allocatedCapital && (
                <div className="p-3 bg-[#1B3022]/40 border border-emerald-500/30 rounded-sm">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                    Allocated Patient Capital
                  </span>
                  <div className="text-base font-mono font-bold text-emerald-300">
                    {selectedNode.details.allocatedCapital}
                  </div>
                </div>
              )}

              {selectedNode.details.verifiedOutcome && (
                <div className="p-3 bg-teal-950/30 border border-teal-500/30 rounded-sm">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400">
                    Cryptographic Verified Outcome
                  </span>
                  <div className="text-xs text-[#F5F5F0]/90 mt-0.5 font-mono">
                    {selectedNode.details.verifiedOutcome}
                  </div>
                </div>
              )}

              {selectedNode.details.responsibleEntities && (
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#F5F5F0]/50 mb-1.5">
                    Responsible Institutions & Stewards
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.details.responsibleEntities.map((ent, i) => (
                      <span key={i} className="px-2 py-1 bg-[#1A1A1A] border border-[#F5F5F0]/10 text-[10px] font-mono text-[#F5F5F0]/70 rounded-xs">
                        {ent}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Graph Connections */}
            <div className="space-y-2 border-t border-[#F5F5F0]/10 pt-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F0]/60">
                <span>Systemic Linkages ({connectedNodes.length})</span>
                <span className="text-[10px] text-[#C5A059]">Click to Navigate</span>
              </div>
              <div className="space-y-1.5">
                {connectedNodes.map((conn) => {
                  const connBadge = getNodeTypeBadge(conn.type);
                  return (
                    <div
                      key={conn.id}
                      onClick={() => setSelectedNodeId(conn.id)}
                      className="p-2 bg-[#121212] hover:bg-[#181818] border border-[#F5F5F0]/10 hover:border-[#C5A059] rounded-sm flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[8px] font-mono px-1 py-0.2 rounded border ${connBadge.bg}`}>
                            {conn.type}
                          </span>
                          <span className="text-xs font-bold text-[#F5F5F0] truncate">
                            {conn.label}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={onOpenMoralSimulator}
                className="flex-1 py-2.5 bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Simulate Node Ethics</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
