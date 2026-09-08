import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  Sparkles,
  Lock,
  ArrowRight,
  SlidersHorizontal,
  Info,
  Shield,
  Cpu,
  Coins,
  Layers,
  Zap
} from 'lucide-react';
import {
  SubscriptionTier,
  ActiveSubscriptionState,
  ATLAS_TIERS
} from '../../lib/subscriptionManager';
import { audioFeedback } from '../../lib/audioFeedback';

export interface ComparisonRow {
  category: string;
  feature: string;
  description: string;
  technicalBreakdown: {
    architecture: string;
    infrastructureGoal: string;
    metricOrStandard?: string;
  };
  foundation: string | boolean;
  studio: string | boolean;
  intelligence: string | boolean;
  enterprise: string | boolean;
  isDifferentiator?: boolean;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  // SECTION 1: Operational Platform & Hardware
  {
    category: 'Bioregional Operations',
    feature: 'Project-OS Interactive Workspaces',
    description: 'Comprehensive territorial management, milestone tracking, and task delegation.',
    technicalBreakdown: {
      architecture: 'Stateful Bioregional Context Engine with IndexedDB local caching & Cloud Firestore sync',
      infrastructureGoal: 'Enables multi-stakeholder territorial coordination, reducing administrative and reporting overhead by over 65%.',
      metricOrStandard: 'W3C Verifiable Credentials & ISO 14064-2 ecosystem accounting'
    },
    foundation: false,
    studio: 'Unlimited Projects',
    intelligence: 'Unlimited + Epistemic Sync',
    enterprise: 'Custom Multi-Tenant Sovereign',
    isDifferentiator: true
  },
  {
    category: 'Bioregional Operations',
    feature: 'Physical Asset QR Code Generator',
    description: 'Direct cryptographic asset tagging with verifiable proof metadata and print export.',
    technicalBreakdown: {
      architecture: 'Deterministic Vector QR engine generating signed EIP-712 payload URLs with proof hashes',
      infrastructureGoal: 'Binds physical on-the-ground restoration sites to verifiable digital ledger records for instant field audits.',
      metricOrStandard: 'GS1 Digital Link & RFC 3986 verifiable URI specification'
    },
    foundation: false,
    studio: 'Standard QR Export (SVG/PNG)',
    intelligence: 'Dynamic Telemetry Linked QR',
    enterprise: 'Tamper-Evident NFC & Mesh Hardware',
    isDifferentiator: true
  },
  {
    category: 'Bioregional Operations',
    feature: 'IoT Sensor Telemetry Streaming',
    description: 'Real-time WebSocket ingestion of soil moisture, carbon flux, acoustic monitors, and weather.',
    technicalBreakdown: {
      architecture: 'Distributed WebSocket multiplexer with adaptive backpressure buffering & OpenTelemetry pipelines',
      infrastructureGoal: 'Guarantees sub-second environmental anomaly alerting across soil moisture, canopy temperature, and carbon flux.',
      metricOrStandard: 'MQTT / WSS with TLS 1.3 cryptographic integrity'
    },
    foundation: 'Public aggregates only',
    studio: 'Up to 50 active telemetry streams',
    intelligence: 'Up to 500 high-frequency streams',
    enterprise: 'Unlimited sovereign hardware streams',
    isDifferentiator: true
  },
  {
    category: 'Bioregional Operations',
    feature: 'Evidence Ledger & Merkle Proofs',
    description: 'Cryptographic proof-of-regeneration anchoring on decentralized ledger.',
    technicalBreakdown: {
      architecture: 'SHA-256 Merkle tree DAG anchoring batch sensor hashes into immutable Base L2 / EVM calldata',
      infrastructureGoal: 'Completely eliminates greenwashing risks by establishing mathematically unfalsifiable provenance for all claims.',
      metricOrStandard: 'OpenZeppelin MerkleProof standard & EIP-4844 Blob attestation'
    },
    foundation: 'Read & verify proofs',
    studio: 'Publish up to 500 proofs/mo',
    intelligence: 'Publish up to 5,000 proofs/mo',
    enterprise: 'Unlimited sovereign proof roots',
    isDifferentiator: true
  },

  // SECTION 2: AI Epistemic Architecture & Reasoning
  {
    category: 'Epistemic AI & Intelligence',
    feature: 'Autonomous Specialized AI Agents',
    description: 'Council of domain-specific agents (Agronomist, Hydrologist, Thermodynamicist, etc.).',
    technicalBreakdown: {
      architecture: 'Google Gemini 3.7 Pro multimodal models with structured function calling & domain agent personae',
      infrastructureGoal: 'Automates multi-variable ecological analysis and provides immediate algorithmic second-opinions on land interventions.',
      metricOrStandard: 'Gemini 3.7 Thinking Protocol & A2A Inter-Agent Communication'
    },
    foundation: false,
    studio: '1 Operational Strategy Agent',
    intelligence: '10 Autonomous Epistemic Agents',
    enterprise: 'Custom Fine-Tuned Agent Swarms',
    isDifferentiator: true
  },
  {
    category: 'Epistemic AI & Intelligence',
    feature: 'Decision Room Epistemic Deliberation',
    description: 'Multi-agent dialectical synthesis with uncertainty quantification and trade-off matrices.',
    technicalBreakdown: {
      architecture: 'Bayesian consensus deliberation matrix with epistemic calibration & sensitivity matrices',
      infrastructureGoal: 'Prevents bias and groupthink in high-stakes capital allocation by forcing dialectical counter-arguments.',
      metricOrStandard: 'Brier Score Epistemic Calibration & Arrow-Debreu Multi-Objective Scoring'
    },
    foundation: false,
    studio: false,
    intelligence: 'Full Deliberation Engine',
    enterprise: 'Full Deliberation + Board Level Audit',
    isDifferentiator: true
  },
  {
    category: 'Epistemic AI & Intelligence',
    feature: 'Causal DAG & Living Systems Simulator',
    description: 'Do-calculus counterfactual modeling and bioregional systemic feedback loops.',
    technicalBreakdown: {
      architecture: 'Pearl do-calculus causal directed acyclic graphs running numerical ODE stock-and-flow differential steps',
      infrastructureGoal: 'Enables stewards to simulate 30-year counterfactual policy interventions before breaking physical ground.',
      metricOrStandard: 'Pearl Causal Hierarchy (Level 2 Interventions & Level 3 Counterfactuals)'
    },
    foundation: false,
    studio: false,
    intelligence: 'High-Fidelity Causal Graphs',
    enterprise: 'Planetary Scale Distributed Simulation',
    isDifferentiator: true
  },
  {
    category: 'Epistemic AI & Intelligence',
    feature: 'Agent Mission Control Dispatcher',
    description: 'Continuous background monitoring, heuristic triggers, and automated intervention drafts.',
    technicalBreakdown: {
      architecture: 'Event-driven reactive task queue with real-time heuristic evaluation & auto-dispatch workers',
      infrastructureGoal: 'Enables immediate autonomous emergency mobilization when critical sensor thresholds are breached.',
      metricOrStandard: 'Cloud Pub/Sub with 99.999% message delivery reliability'
    },
    foundation: false,
    studio: false,
    intelligence: 'Real-Time Mission Dispatch',
    enterprise: 'Multi-Agency Mission Orchestration',
    isDifferentiator: true
  },

  // SECTION 3: Capital Coordination & Governance
  {
    category: 'Capital & Governance',
    feature: 'Capital Engine & Impact Underwriting',
    description: 'Underwrite ecological projects, simulate bond issuance, and calculate return on ecology.',
    technicalBreakdown: {
      architecture: 'Discounted Return-on-Ecology (ROE) simulation engine with macro financial rate sensitivities',
      infrastructureGoal: 'Bridges institutional balance sheets into non-extractive bioregional infrastructure bonds.',
      metricOrStandard: 'IFRS S2 Climate-Related Financial Disclosures & ICMA Green Bond Principles'
    },
    foundation: 'Browse public opportunities',
    studio: 'Project Impact Profiler',
    intelligence: 'Full Underwriting & Risk Scenarios',
    enterprise: 'Programmatic Sovereign Capital Mesh',
    isDifferentiator: true
  },
  {
    category: 'Capital & Governance',
    feature: 'Milestone-Triggered Smart Disbursements',
    description: 'Automated fund releases upon multi-sensor ground truth verification.',
    technicalBreakdown: {
      architecture: 'Multi-signature smart contract escrow release triggers verified by automated oracle consensus',
      infrastructureGoal: 'Guarantees zero fund diversion by strictly linking capital drawdowns to verified biometric milestones.',
      metricOrStandard: 'EVM Smart Escrow & Automated Net-30 FedWire clearance'
    },
    foundation: false,
    studio: false,
    intelligence: 'Simulated Escrow Milestones',
    enterprise: 'Live Multi-Sig & FedWire Escrow',
    isDifferentiator: true
  },
  {
    category: 'Capital & Governance',
    feature: 'Opportunity Matchmaker AI',
    description: 'Algorithmic matching of philanthropic and institutional capital with bioregional stewards.',
    technicalBreakdown: {
      architecture: 'High-dimensional semantic vector embeddings with cosine similarity & moral governance constraints',
      infrastructureGoal: 'Directly routes catalytic capital to high-integrity ecological projects without extractive intermediary fees.',
      metricOrStandard: 'Vector Cosine Distance & Sovereign ReFi Verification Framework'
    },
    foundation: 'Public listings',
    studio: 'Steward Project Submission',
    intelligence: 'Intelligent Strategic Matching',
    enterprise: 'Direct Capital Syndication Hub',
    isDifferentiator: true
  },

  // SECTION 4: Loyalty & Protocol Economics
  {
    category: 'Regenerative Economics',
    feature: 'Regenerative Credits Loyalty Multiplier',
    description: 'Bonus multiplier for protocol usage, evidence logging, and ground-truth validation.',
    technicalBreakdown: {
      architecture: 'Cryptographic token staking ledger tracking proof validation volume with programmatic bonus multipliers',
      infrastructureGoal: 'Incentivizes active telemetry verification and rewards decentralized validators with moral governance weight.',
      metricOrStandard: 'ERC-20 Moral Governance Token Standard & Proof-of-Validation'
    },
    foundation: '1.0x (Standard)',
    studio: '1.5x Multiplier (+500 RGC Bonus)',
    intelligence: '3.0x Multiplier (+1,500 RGC Bonus)',
    enterprise: '10.0x Sovereign Multiplier (+5k RGC)',
    isDifferentiator: true
  },
  {
    category: 'Infrastructure & Support',
    feature: 'Deployment Infrastructure',
    description: 'Server environment, isolation, and security guarantees.',
    technicalBreakdown: {
      architecture: 'Containerized Kubernetes/Cloud Run isolation with VPC peering and enterprise edge distribution',
      infrastructureGoal: 'Guarantees high-throughput resilience, sub-50ms regional latency, and strict data sovereignty.',
      metricOrStandard: 'SOC2 Type II, ISO 27001, and GDPR compliance benchmarks'
    },
    foundation: 'Shared Cloud Sandbox',
    studio: 'Dedicated Cloud Tenant',
    intelligence: 'High-Performance Isolated Nodes',
    enterprise: 'Air-Gapped Sovereign On-Premise Mesh',
    isDifferentiator: true
  },
  {
    category: 'Infrastructure & Support',
    feature: 'API Rate Limits & Webhooks',
    description: 'Programmatic access for automated telemetry and database ingestion.',
    technicalBreakdown: {
      architecture: 'Distributed Envoy token bucket rate limiters with HMAC SHA-256 signed webhook delivery',
      infrastructureGoal: 'Enables continuous automated ingestion from edge IoT gateways and ERP financial pipelines.',
      metricOrStandard: 'RFC 7515 JSON Web Signatures (JWS) & REST OpenAPI 3.1'
    },
    foundation: '100 req / day',
    studio: '10,000 req / day',
    intelligence: '100,000 req / day + Webhooks',
    enterprise: 'Unlimited Dedicated Throughput',
    isDifferentiator: true
  },
  {
    category: 'Infrastructure & Support',
    feature: 'Support & Advisory',
    description: 'Direct access to systems architects, ecologists, and engineers.',
    technicalBreakdown: {
      architecture: 'Prioritized ticket routing pipeline with dedicated PagerDuty on-call ecological engineering roster',
      infrastructureGoal: 'Ensures immediate resolution of data anomalies and direct advisory on complex bioregional bond structuring.',
      metricOrStandard: '15-minute critical incident SLA & Dedicated Principal Architect'
    },
    foundation: 'Community Discord / Forum',
    studio: 'Standard Email & In-App Support',
    intelligence: 'Priority Epistemic Advisory Team',
    enterprise: 'Dedicated Strategic Lead Architect (24/7)',
    isDifferentiator: true
  }
];

interface FeatureComparisonTableProps {
  subState: ActiveSubscriptionState;
  onOpenCheckout: (tier: SubscriptionTier) => void;
  onSelectTab: (tabId: string) => void;
}

export const FeatureComparisonTable: React.FC<FeatureComparisonTableProps> = ({
  subState,
  onOpenCheckout,
  onSelectTab
}) => {
  const [filterDifferentiatorsOnly, setFilterDifferentiatorsOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTooltipFeature, setActiveTooltipFeature] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(COMPARISON_ROWS.map(r => r.category)))];

  const filteredRows = COMPARISON_ROWS.filter(r => {
    if (filterDifferentiatorsOnly && !r.isDifferentiator) return false;
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    return true;
  });

  const renderCellContent = (val: string | boolean, isHighlighted = false) => {
    if (typeof val === 'boolean') {
      return val ? (
        <div className="flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <X className="w-4 h-4 text-white/20" />
        </div>
      );
    }

    return (
      <span className={`text-xs font-mono leading-tight ${isHighlighted ? 'text-[#C5A059] font-medium' : 'text-[#F5F5F0]/80'}`}>
        {val}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 font-bold">
              Dynamic Tier Matrix
            </span>
            <span className="text-xs font-mono text-[#F5F5F0]/60">
              Active: <strong className="text-[#C5A059]">{ATLAS_TIERS[subState.currentTier]?.name}</strong>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-[#F5F5F0] mt-1">
            Comprehensive Tier Feature Comparison
          </h3>
          <p className="text-xs text-[#F5F5F0]/60 max-w-xl font-light">
            Direct side-by-side breakdown comparing Atlas Studio, Atlas Intelligence, and Atlas Enterprise capabilities.
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-[#C5A059] bg-[#C5A059]/10 px-2 py-1 rounded w-fit border border-[#C5A059]/20">
            <Info className="w-3 h-3 text-[#C5A059] shrink-0" />
            <span>Interactive technical breakdowns: Click or hover the <strong className="font-bold underline">info icon (i)</strong> on any feature for architecture & infrastructure goals.</span>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              audioFeedback.play('softClick');
              setFilterDifferentiatorsOnly(!filterDifferentiatorsOnly);
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterDifferentiatorsOnly
                ? 'bg-[#C5A059] text-black border-[#C5A059] font-bold'
                : 'bg-black/40 text-[#F5F5F0]/70 border-white/10 hover:border-white/30'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{filterDifferentiatorsOnly ? 'Highlighting Differentiators' : 'Highlight Key Differentiators'}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              audioFeedback.play('softClick');
              setSelectedCategory(cat);
            }}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/50 font-bold'
                : 'bg-black/30 text-[#F5F5F0]/50 border border-white/5 hover:text-[#F5F5F0]'
            }`}
          >
            {cat === 'all' ? 'All Feature Domains' : cat}
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-sm border border-[#F5F5F0]/10 bg-[#0A0C0B] shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-[#F5F5F0]/10 bg-[#121513]">
              <th className="p-4 sm:p-5 w-[32%] text-xs font-mono uppercase tracking-wider text-[#F5F5F0]/60">
                Capability Specification
              </th>

              {/* TIER 1: STUDIO */}
              <th className={`p-4 sm:p-5 w-[22%] text-center border-l border-white/5 transition-all ${
                subState.currentTier === 'studio' ? 'bg-[#18231C] ring-2 ring-[#C5A059] relative' : ''
              }`}>
                {subState.currentTier === 'studio' && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#C5A059] text-black font-mono text-[9px] font-bold">
                    YOUR ACTIVE PLAN
                  </span>
                )}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider font-bold block">
                    OPERATOR TIER
                  </span>
                  <div className="font-serif text-base text-[#F5F5F0]">Atlas Studio</div>
                  <div className="text-xs font-mono text-[#C5A059] font-bold">$500 / mo</div>
                </div>
                <div className="mt-3">
                  {['studio', 'intelligence', 'enterprise'].includes(subState.currentTier) ? (
                    <button
                      onClick={() => onSelectTab('project-os')}
                      className="w-full py-1.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900 transition-colors cursor-pointer"
                    >
                      Active Suite
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenCheckout('studio')}
                      className="w-full py-1.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow"
                    >
                      <Lock className="w-2.5 h-2.5" />
                      <span>Unlock</span>
                    </button>
                  )}
                </div>
              </th>

              {/* TIER 2: INTELLIGENCE */}
              <th className={`p-4 sm:p-5 w-[23%] text-center border-l border-[#C5A059]/40 transition-all ${
                subState.currentTier === 'intelligence' ? 'bg-[#1E261F] ring-2 ring-[#C5A059] relative' : 'bg-[#111713]'
              }`}>
                {subState.currentTier === 'intelligence' ? (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#C5A059] text-black font-mono text-[9px] font-bold">
                    YOUR ACTIVE PLAN
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 font-mono text-[8px] font-bold uppercase inline-block mb-1">
                    DECISION ROOM LAYER
                  </span>
                )}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider font-bold block">
                    DEEP REASONING
                  </span>
                  <div className="font-serif text-base text-[#F5F5F0]">Atlas Intelligence</div>
                  <div className="text-xs font-mono text-[#C5A059] font-bold">$2,500 / mo</div>
                </div>
                <div className="mt-3">
                  {['intelligence', 'enterprise'].includes(subState.currentTier) ? (
                    <button
                      onClick={() => onSelectTab('decision-room')}
                      className="w-full py-1.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900 transition-colors cursor-pointer"
                    >
                      Active Suite
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenCheckout('intelligence')}
                      className="w-full py-1.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Upgrade Plan</span>
                    </button>
                  )}
                </div>
              </th>

              {/* TIER 3: ENTERPRISE */}
              <th className={`p-4 sm:p-5 w-[23%] text-center border-l border-white/5 transition-all ${
                subState.currentTier === 'enterprise' ? 'bg-purple-950/40 ring-2 ring-purple-500 relative' : ''
              }`}>
                {subState.currentTier === 'enterprise' && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-purple-500 text-white font-mono text-[9px] font-bold">
                    YOUR ACTIVE PLAN
                  </span>
                )}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold block">
                    SOVEREIGN INSTITUTIONAL
                  </span>
                  <div className="font-serif text-base text-[#F5F5F0]">Atlas Enterprise</div>
                  <div className="text-xs font-mono text-[#F5F5F0]/70 font-bold">Custom Contract</div>
                </div>
                <div className="mt-3">
                  {subState.currentTier === 'enterprise' ? (
                    <button
                      onClick={() => onSelectTab('capital-engine')}
                      className="w-full py-1.5 rounded text-[10px] font-mono uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-500/40 hover:bg-purple-900 transition-colors cursor-pointer"
                    >
                      Active Suite
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenCheckout('enterprise')}
                      className="w-full py-1.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Shield className="w-2.5 h-2.5" />
                      <span>Custom SLA</span>
                    </button>
                  )}
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {filteredRows.map((row, idx) => {
              const hasDifference = row.studio !== row.intelligence || row.intelligence !== row.enterprise;

              return (
                <tr
                  key={idx}
                  className={`hover:bg-white/[0.02] transition-colors ${
                    hasDifference && filterDifferentiatorsOnly ? 'bg-amber-950/10' : ''
                  }`}
                >
                  {/* Feature Title & Description */}
                  <td className="p-4 sm:p-5 align-top relative">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-wider">
                          {row.category}
                        </span>
                        {row.isDifferentiator && (
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-mono bg-amber-950 text-amber-300 border border-amber-500/30">
                            Key Differentiator
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-medium text-[#F5F5F0]">{row.feature}</span>
                        
                        {/* Interactive Technical Breakdown Tooltip Trigger */}
                        <div className="relative inline-flex items-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              audioFeedback.play('softClick');
                              setActiveTooltipFeature(activeTooltipFeature === row.feature ? null : row.feature);
                            }}
                            onMouseEnter={() => setActiveTooltipFeature(row.feature)}
                            aria-label={`Inspect technical breakdown for ${row.feature}`}
                            title="Click or hover to inspect technical breakdown & infrastructure contribution"
                            className={`p-1 rounded-full text-xs transition-all cursor-pointer ${
                              activeTooltipFeature === row.feature
                                ? 'bg-[#C5A059] text-black ring-2 ring-[#C5A059]/40 scale-110'
                                : 'text-[#C5A059]/70 hover:text-[#C5A059] hover:bg-white/10'
                            }`}
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>

                          {/* Technical Breakdown Popover Card */}
                          {activeTooltipFeature === row.feature && (
                            <div 
                              className="absolute left-0 sm:left-6 top-full sm:top-0 mt-1 sm:mt-0 w-72 sm:w-80 p-3.5 rounded-lg bg-[#0E1310] border border-[#C5A059]/50 shadow-2xl z-50 text-left animate-fadeIn backdrop-blur-xl ring-1 ring-white/10"
                              onMouseEnter={() => setActiveTooltipFeature(row.feature)}
                              onMouseLeave={() => setActiveTooltipFeature(null)}
                            >
                              <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2 mb-2.5">
                                <div>
                                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
                                    Technical Architecture
                                  </span>
                                  <div className="text-xs font-serif font-bold text-[#F5F5F0]">
                                    {row.feature}
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTooltipFeature(null);
                                  }}
                                  className="text-white/40 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
                                  title="Dismiss tooltip"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="space-y-2 text-[11px] font-sans">
                                <div>
                                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#C5A059]/80 block font-semibold">
                                    Implementation Stack:
                                  </span>
                                  <p className="text-[#F5F5F0]/90 font-mono text-[10px] leading-relaxed bg-black/40 p-1.5 rounded border border-white/5">
                                    {row.technicalBreakdown.architecture}
                                  </p>
                                </div>

                                <div>
                                  <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 block font-semibold">
                                    Infrastructure Contribution:
                                  </span>
                                  <p className="text-[#F5F5F0]/80 leading-relaxed text-[11px]">
                                    {row.technicalBreakdown.infrastructureGoal}
                                  </p>
                                </div>

                                {row.technicalBreakdown.metricOrStandard && (
                                  <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono">
                                    <span className="text-[#F5F5F0]/40">Standard:</span>
                                    <span className="text-[#C5A059] bg-[#C5A059]/10 px-1.5 py-0.5 rounded border border-[#C5A059]/20 font-bold">
                                      {row.technicalBreakdown.metricOrStandard}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-[#F5F5F0]/50 font-light leading-relaxed">
                        {row.description}
                      </div>
                    </div>
                  </td>

                  {/* Atlas Studio Cell */}
                  <td className={`p-4 sm:p-5 text-center align-middle border-l border-white/5 ${
                    subState.currentTier === 'studio' ? 'bg-[#18231C]/60' : ''
                  }`}>
                    {renderCellContent(row.studio, subState.currentTier === 'studio')}
                  </td>

                  {/* Atlas Intelligence Cell */}
                  <td className={`p-4 sm:p-5 text-center align-middle border-l border-[#C5A059]/20 ${
                    subState.currentTier === 'intelligence' ? 'bg-[#1E261F]/60' : 'bg-[#111713]/40'
                  }`}>
                    {renderCellContent(row.intelligence, true)}
                  </td>

                  {/* Atlas Enterprise Cell */}
                  <td className={`p-4 sm:p-5 text-center align-middle border-l border-white/5 ${
                    subState.currentTier === 'enterprise' ? 'bg-purple-950/20' : ''
                  }`}>
                    {renderCellContent(row.enterprise, subState.currentTier === 'enterprise')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
