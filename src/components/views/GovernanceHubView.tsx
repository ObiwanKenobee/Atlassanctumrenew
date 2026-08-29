import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  Eye, 
  Vote, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  FileCode, 
  ExternalLink, 
  ChevronRight, 
  Search, 
  Sparkles, 
  Fingerprint, 
  Lock, 
  Unlock, 
  Sliders, 
  Info,
  Clock,
  Users,
  Compass,
  FileCheck,
  X
} from 'lucide-react';
import { 
  CONSTITUTIONAL_FLOOR_RULES, 
  GOVERNANCE_PROPOSALS, 
  TRANSPARENCY_AUDIT_RECORDS, 
  DECISION_RECORDS 
} from '../../data/platformContentData';
import { MORAL_PRINCIPLES } from '../../data/mockCivilizationData';
import { ARCHITECTURAL_COMMANDMENTS } from '../../data/commandmentsData';
import { GovernancePillar, GovernanceProposal, ConstitutionalFloorRule } from '../../types/platformContent';
import { PageView } from '../../types';
import { LiquidDemocracyVotingPortal } from '../governance/LiquidDemocracyVotingPortal';
import { audioFeedback } from '../../lib/audioFeedback';

interface GovernanceHubViewProps {
  onSelectTab?: (tab: PageView) => void;
  onInspectProvenance?: (prov: any) => void;
}

export const GovernanceHubView: React.FC<GovernanceHubViewProps> = ({
  onSelectTab,
  onInspectProvenance
}) => {
  const [activePillar, setActivePillar] = useState<GovernancePillar>('principles');
  const [activeProposalModal, setActiveProposalModal] = useState<GovernanceProposal | null>(null);
  const [activeFloorModal, setActiveFloorModal] = useState<ConstitutionalFloorRule | null>(null);
  const [votedProposalIds, setVotedProposalIds] = useState<Record<string, 'support' | 'oppose'>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleVote = (proposalId: string, choice: 'support' | 'oppose') => {
    setVotedProposalIds(prev => ({ ...prev, [proposalId]: choice }));
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header & Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-[#F5F5F0]/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.25em] font-bold">
              CONSTITUTIONAL INTELLIGENCE & MULTI-STAKEHOLDER SOVEREIGNTY
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F5F5F0]">
            Civilization Governance & Priority Floors
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 max-w-2xl font-sans leading-relaxed">
            Universal moral axioms, algorithmic priority floors, real-time cryptographic transparency audits, and autonomous elder consensus decision-making.
          </p>
        </div>

        {/* Governance Metrics */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 text-right">
            <div className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">Constitutional Floors</div>
            <div className="text-xl font-bold font-mono text-emerald-400">100% Defended</div>
          </div>
          <div className="p-3.5 rounded-sm bg-[#0D0D0D] border border-[#C5A059]/30 text-right">
            <div className="text-[10px] font-mono text-[#C5A059] uppercase">Merkle Proofs</div>
            <div className="text-xl font-bold font-mono text-[#C5A059]">0 Extractive Leaks</div>
          </div>
        </div>
      </div>

      {/* 4 Primary Pillar Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { 
            id: 'principles', 
            label: '1. Principles', 
            subtitle: '14 Axioms & 10 Commandments',
            icon: Scale 
          },
          { 
            id: 'policies', 
            label: '2. Policies & Floors', 
            subtitle: 'Non-Bypassable Hard Stops',
            icon: ShieldCheck 
          },
          { 
            id: 'transparency', 
            label: '3. Transparency', 
            subtitle: 'Merkle Ledgers & Audits',
            icon: Eye 
          },
          { 
            id: 'decision_making', 
            label: '4. Decision-Making', 
            subtitle: 'Proposals & Elder Vetoes',
            icon: Vote 
          },
        ].map((pillar) => {
          const Icon = pillar.icon;
          const isActive = activePillar === pillar.id;
          return (
            <button
              key={pillar.id}
              onClick={() => setActivePillar(pillar.id as GovernancePillar)}
              className={`p-4 rounded-sm border text-left transition-all space-y-1.5 ${
                isActive
                  ? 'bg-[#1B3022] border-[#C5A059] shadow-md'
                  : 'bg-[#0D0D0D] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30 hover:bg-[#121212]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#C5A059]' : 'text-[#F5F5F0]'}`}>
                  {pillar.label}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A059]' : 'text-[#F5F5F0]/40'}`} />
              </div>
              <p className="text-[10px] font-mono text-[#F5F5F0]/60 truncate">
                {pillar.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* PILLAR 1: PRINCIPLES (14 Axioms & 10 Commandments) */}
      {/* ========================================================================= */}
      {activePillar === 'principles' && (
        <div className="space-y-8">
          <div className="p-6 bg-[#0E1511] border border-[#C5A059]/40 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                CORE PHILOSOPHICAL FOUNDATION
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#F5F5F0]">
                Universal Moral Axioms & Architectural Commandments
              </h2>
              <p className="text-xs text-[#F5F5F0]/70 font-sans">
                These fourteen moral axioms and ten architectural commandments form the immutable basis of Atlas Sanctum. Every algorithmic decision, financial grant, and machine model is bound by these principles.
              </p>
            </div>
            {onSelectTab && (
              <button
                onClick={() => onSelectTab('moral-arbiter')}
                className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs rounded-sm shrink-0 transition-all flex items-center gap-1.5 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Moral Arbiter Simulator</span>
              </button>
            )}
          </div>

          {/* 14 Universal Moral Principles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#C5A059] font-bold border-b border-[#F5F5F0]/10 pb-2">
              <span>THE 14 UNIVERSAL MORAL AXIOMS</span>
              <span>Epistemic Authority Level: Absolute</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MORAL_PRINCIPLES.map((axiom) => (
                <div 
                  key={axiom.id} 
                  className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-2 hover:border-[#C5A059]/40 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#C5A059] uppercase font-bold">
                      Axiom {axiom.name}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">
                      Active Floor
                    </span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors">
                    {axiom.scripturalTheme}
                  </h3>
                  <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                    {axiom.universalDesignPrinciple}
                  </p>
                  <p className="text-[11px] text-[#C5A059]/80 font-mono pt-1">
                    Enforcement: {axiom.systemImplementation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 10 Architectural Commandments */}
          <div className="space-y-4 pt-6 border-t border-[#F5F5F0]/10">
            <div className="flex items-center justify-between text-xs font-mono text-[#C5A059] font-bold border-b border-[#F5F5F0]/10 pb-2">
              <span>THE 10 ARCHITECTURAL COMMANDMENTS</span>
              <span>Systems Engineering Invariants</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ARCHITECTURAL_COMMANDMENTS.map((cmd) => (
                <div key={cmd.id} className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm flex items-start gap-3">
                  <span className="text-xs font-mono text-[#C5A059] font-bold px-2 py-1 bg-[#141414] rounded-sm shrink-0">
                    {cmd.romanNumeral}
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold font-mono text-[#F5F5F0]">{cmd.title}</h4>
                    <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">{cmd.shortMaxim}</p>
                    <p className="text-[11px] text-[#8FB8DE]/80 font-mono">{cmd.architecturalRule}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 2: POLICIES & CONSTITUTIONAL FLOORS */}
      {/* ========================================================================= */}
      {activePillar === 'policies' && (
        <div className="space-y-8">
          <div className="p-6 bg-[#0E1511] border border-[#C5A059]/40 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                PROGRAMMATIC CONSTITUTIONAL HARD STOPS
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#F5F5F0]">
                Constitutional Priority Floors
              </h2>
              <p className="text-xs text-[#F5F5F0]/70 font-sans">
                Unlike advisory guidelines, Priority Floors are mathematical boundaries hardcoded into smart contracts and algorithmic daemons. Proposals breaching these constraints are vetoed automatically.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 p-3 bg-[#080808] border border-emerald-500/30 rounded-sm text-right shrink-0">
              <div>Continuous Telemetry Daemon</div>
              <div className="font-bold text-sm">0 Permitted Breaches</div>
            </div>
          </div>

          {/* Floors List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONSTITUTIONAL_FLOOR_RULES.map((floor) => (
              <div 
                key={floor.id} 
                className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4 hover:border-[#C5A059]/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase bg-[#141414] text-[#C5A059] px-2 py-0.5 rounded-sm border border-[#F5F5F0]/10 font-bold">
                      Domain: {floor.domain}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                      <CheckCircle2 className="w-3 h-3" />
                      Compliant
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">
                    {floor.name}
                  </h3>

                  <p className="text-xs text-[#F5F5F0]/70 leading-relaxed font-sans">
                    {floor.thresholdDescription}
                  </p>

                  {/* Mathematical Bound Formula */}
                  <div className="p-2.5 bg-[#050505] border border-[#F5F5F0]/10 rounded-sm font-mono text-[11px] text-[#C5A059] flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <span className="truncate">{floor.mathematicalBound}</span>
                  </div>

                  {/* Observed Telemetry */}
                  <div className="pt-2 text-xs font-mono space-y-1 text-[#F5F5F0]/60">
                    <div className="flex justify-between">
                      <span>Observed Telemetry:</span>
                      <span className="text-emerald-400 font-bold">{floor.currentObservedValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Breaches Auto-Vetoed:</span>
                      <span className="text-amber-400 font-bold">{floor.violatorsVetoedCount} attempts blocked</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F5F5F0]/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-[#F5F5F0]/40 truncate max-w-xs">{floor.axiomAnchor}</span>
                  <button
                    onClick={() => setActiveFloorModal(floor)}
                    className="text-[#C5A059] hover:underline font-bold"
                  >
                    View Audit Rules →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 3: TRANSPARENCY & AUDITS */}
      {/* ========================================================================= */}
      {activePillar === 'transparency' && (
        <div className="space-y-8">
          <div className="p-6 bg-[#0E1511] border border-[#C5A059]/40 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                RADICAL UNFORGEABLE PUBLIC SCRUTINY
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#F5F5F0]">
                Cryptographic Transparency Ledger & Independent Audits
              </h2>
              <p className="text-xs text-[#F5F5F0]/70 font-sans">
                Every capital disbursement, IoT sensor calibration, and constitutional priority floor check produces a zero-knowledge Merkle proof permanently verified on the public ledger.
              </p>
            </div>
            <div className="p-3 bg-[#080808] border border-[#C5A059]/30 rounded-sm text-right font-mono text-xs text-[#C5A059] shrink-0">
              <div>$380M Multi-Capital Pool</div>
              <div className="font-bold text-sm text-emerald-400">0% Slush Fund Tolerance</div>
            </div>
          </div>

          {/* Audit Records List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F0]/60 border-b border-[#F5F5F0]/10 pb-2">
              <span>Recent Third-Party & Autonomous Audit Certifications</span>
              <span className="text-emerald-400">● 100% Cryptographic Verification Match</span>
            </div>

            <div className="space-y-3">
              {TRANSPARENCY_AUDIT_RECORDS.map((audit) => (
                <div 
                  key={audit.id}
                  className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-3 hover:border-[#C5A059]/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#141414] text-[#C5A059] font-bold rounded-sm border border-[#F5F5F0]/10">
                        {audit.auditType}
                      </span>
                      <span className="text-xs font-bold font-mono text-[#F5F5F0]">
                        {audit.auditorName} ({audit.auditorOrganization})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Authentic
                    </span>
                  </div>

                  <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
                    {audit.summary}
                  </p>

                  <div className="pt-2 border-t border-[#F5F5F0]/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#F5F5F0]/50">
                    <div className="flex items-center gap-1.5 truncate max-w-md">
                      <Fingerprint className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="truncate">Merkle Root: {audit.merkleRootHash}</span>
                    </div>
                    <span>Timestamp: {new Date(audit.timestamp).toUTCString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 4: DECISION-MAKING & PROPOSALS */}
      {/* ========================================================================= */}
      {activePillar === 'decision_making' && (
        <div className="space-y-10">
          {/* Liquid Democracy Voting Portal */}
          <LiquidDemocracyVotingPortal
            proposals={GOVERNANCE_PROPOSALS}
            onInspectProvenance={onInspectProvenance || (() => {})}
          />

          <div className="p-6 bg-[#0E1511] border border-[#C5A059]/40 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                COMMUNITY DEMOCRACY & ELDER CONSENSUS ARCHIVE
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#F5F5F0]">
                Historic AGP Catalogs & Precedents
              </h2>
              <p className="text-xs text-[#F5F5F0]/70 font-sans">
                Review historic proposals, quadratic voting channels, and autonomous Priority Floor defenses.
              </p>
            </div>
          </div>

          {/* Active Proposals Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F0]/60 border-b border-[#F5F5F0]/10 pb-2">
              <span>Active & Historic Proposals</span>
              <span className="text-[#C5A059]">● Quadratic Voting Channels Active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GOVERNANCE_PROPOSALS.map((prop) => {
                const userVote = votedProposalIds[prop.id];
                return (
                  <div
                    key={prop.id}
                    className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4 flex flex-col justify-between hover:border-[#C5A059]/50 transition-all group"
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                        <span className="px-2 py-0.5 bg-[#141414] text-[#C5A059] font-bold rounded-sm border border-[#F5F5F0]/10">
                          {prop.id} • {prop.category}
                        </span>
                        {prop.status === 'active_voting' && (
                          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                            Active Voting
                          </span>
                        )}
                        {prop.status === 'passed_executed' && (
                          <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-sm">
                            Passed & Executed
                          </span>
                        )}
                        {prop.status === 'vetoed_by_floors' && (
                          <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-sm flex items-center gap-1">
                            <Ban className="w-3 h-3" />
                            Floor Vetoed
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-serif font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors leading-snug">
                        {prop.title}
                      </h3>

                      <p className="text-xs text-[#F5F5F0]/70 line-clamp-3 font-sans leading-relaxed">
                        {prop.summary}
                      </p>

                      {/* Vote Progress Meter */}
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-[10px] font-mono text-[#F5F5F0]/60">
                          <span>Support: {prop.currentSupportPercentage}%</span>
                          <span>Quorum: {prop.quorumPercentage}%</span>
                        </div>
                        <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${prop.status === 'vetoed_by_floors' ? 'bg-rose-500' : 'bg-emerald-400'}`}
                            style={{ width: `${prop.currentSupportPercentage}%` }}
                          />
                        </div>
                      </div>

                      {prop.capitalRequestedUsd && (
                        <div className="text-xs font-mono text-[#C5A059]">
                          Capital Requested: ${(prop.capitalRequestedUsd / 1000000).toFixed(1)}M USD
                        </div>
                      )}
                    </div>

                    {/* Bottom Voting Actions */}
                    <div className="pt-4 border-t border-[#F5F5F0]/10 space-y-2">
                      {prop.status === 'active_voting' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVote(prop.id, 'support')}
                            className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-sm transition-all ${
                              userVote === 'support'
                                ? 'bg-emerald-500 text-black'
                                : 'bg-[#14261C] hover:bg-[#1B3022] text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {userVote === 'support' ? '✓ Supported' : 'Support AGP'}
                          </button>
                          <button
                            onClick={() => handleVote(prop.id, 'oppose')}
                            className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-sm transition-all ${
                              userVote === 'oppose'
                                ? 'bg-rose-500 text-black'
                                : 'bg-[#261414] hover:bg-[#301B1B] text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {userVote === 'oppose' ? '✗ Opposed' : 'Oppose'}
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs font-mono text-[#F5F5F0]/50 text-center py-1">
                          Voting Cycle Concluded
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#F5F5F0]/40">{prop.totalVotesCast.toLocaleString()} votes</span>
                        <button
                          onClick={() => setActiveProposalModal(prop)}
                          className="text-[#C5A059] hover:underline font-bold"
                        >
                          Details & Impact →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Elder Consensus & Veto Decision Records */}
          <div className="space-y-4 pt-6 border-t border-[#F5F5F0]/10">
            <div className="flex items-center justify-between text-xs font-mono text-[#C5A059] font-bold border-b border-[#F5F5F0]/10 pb-2">
              <span>ELDER CONSENSUS & AUTONOMOUS FLOOR DEFENSE LOGS</span>
              <span>Permanent Legal Precedent</span>
            </div>

            <div className="space-y-3">
              {DECISION_RECORDS.map((dec) => (
                <div key={dec.id} className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#F5F5F0]">
                      {dec.matterTitle}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm ${
                      dec.outcome === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {dec.decisionType} • {dec.outcome}
                    </span>
                  </div>
                  <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                    {dec.rationale}
                  </p>
                  <div className="text-[10px] font-mono text-[#F5F5F0]/40 flex flex-wrap justify-between gap-2 pt-1 border-t border-[#F5F5F0]/5">
                    <span>Elder Witnesses: {dec.elderWitnesses.join(', ')}</span>
                    <span>Proof Hash: {dec.cryptographicProofHash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PROPOSAL DETAIL MODAL */}
      {/* ========================================================================= */}
      {activeProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-[#0D0D0D] border border-[#C5A059]/50 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveProposalModal(null)}
              className="absolute top-4 right-4 p-2 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#1A1A1A] rounded-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-[#F5F5F0]/10 pb-5">
              <span className="text-[10px] font-mono uppercase bg-[#141414] text-[#C5A059] px-2 py-0.5 rounded-sm border border-[#F5F5F0]/10 font-bold">
                {activeProposalModal.id} • {activeProposalModal.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0]">
                {activeProposalModal.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-[#F5F5F0]/70 pt-1">
                <span>Proposer: {activeProposalModal.proposer}</span>
                <span>Bioregion: {activeProposalModal.bioregion}</span>
                <span>Deadline: {activeProposalModal.votingDeadline}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#F5F5F0]/80 leading-relaxed font-sans">
              <h4 className="text-xs font-mono uppercase text-[#C5A059] font-bold">Summary</h4>
              <p>{activeProposalModal.summary}</p>

              <h4 className="text-xs font-mono uppercase text-[#C5A059] font-bold pt-2">Impact Assessment</h4>
              <p>{activeProposalModal.impactAssessmentSummary}</p>
            </div>

            <div className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>FPIC Sovereign Consent: Verified</span>
              </span>
              <button
                onClick={() => setActiveProposalModal(null)}
                className="px-4 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] text-[#F5F5F0] rounded-sm"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOOR RULE DETAIL MODAL */}
      {/* ========================================================================= */}
      {activeFloorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0D0D0D] border border-[#C5A059]/50 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setActiveFloorModal(null)}
              className="absolute top-4 right-4 p-2 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#1A1A1A] rounded-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-[#F5F5F0]/10 pb-4">
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                CONSTITUTIONAL PRIORITY FLOOR SPECIFICATION
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#F5F5F0]">
                {activeFloorModal.name}
              </h3>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[#F5F5F0]/50 uppercase text-[10px]">Description</span>
                <p className="text-[#F5F5F0]/80 font-sans leading-relaxed">{activeFloorModal.thresholdDescription}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#F5F5F0]/50 uppercase text-[10px]">Mathematical Boundary Equation</span>
                <div className="p-3 bg-[#050505] border border-[#F5F5F0]/10 rounded-sm text-[#C5A059]">
                  {activeFloorModal.mathematicalBound}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[#F5F5F0]/50 uppercase text-[10px]">Continuous Audit Cadence</span>
                <div className="p-2.5 bg-[#080808] text-[#F5F5F0]/80 rounded-sm">
                  {activeFloorModal.auditCadence}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#F5F5F0]/10">
              <button
                onClick={() => setActiveFloorModal(null)}
                className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-[#F5F5F0] text-xs font-mono rounded-sm"
              >
                Close Spec
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
