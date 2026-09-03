import React, { useState } from 'react';
import {
  DollarSign,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Scale,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins,
  Cpu,
  Users,
  Leaf,
  BookOpen,
  Building,
  Heart
} from 'lucide-react';
import { CapitalAllocationTranche, CapitalForm } from '../../types';
import { CAPITAL_TRANCHES } from '../../data/prompt2CivilizationData';
import { BlendedFinanceStructuringEngine } from '../capital/BlendedFinanceStructuringEngine';
import { MilestoneEscrowTrancheController } from '../capital/MilestoneEscrowTrancheController';
import { useActiveMission } from '../../context/ActiveMissionContext';
import { audioFeedback } from '../../lib/audioFeedback';

interface CapitalEngineViewProps {
  onSelectTab: (tab: any) => void;
}

const SEVEN_CAPITAL_FORMS: { form: CapitalForm; label: string; desc: string; icon: any; color: string }[] = [
  { form: 'Financial', label: 'Financial Capital', desc: 'Patient, non-extractive liquidity and long-horizon funds', icon: Coins, color: 'text-amber-400' },
  { form: 'Human', label: 'Human Capital', desc: 'Skilled labor, engineering guilds, and local apprenticeships', icon: Users, color: 'text-rose-400' },
  { form: 'Social', label: 'Social Capital', desc: 'Community cohesion, covenantal trust, and civic consensus', icon: Heart, color: 'text-purple-400' },
  { form: 'Natural', label: 'Natural Capital', desc: 'Living soil, unpolluted aquifers, seed genetics, and biodiversity', icon: Leaf, color: 'text-emerald-400' },
  { form: 'Intellectual', label: 'Intellectual Capital', desc: 'Open-source engineering blueprints, patents, and scientific models', icon: BookOpen, color: 'text-blue-400' },
  { form: 'Cultural', label: 'Cultural Capital', desc: 'Indigenous land stewardship wisdom, arts, and generational norms', icon: Sparkles, color: 'text-orange-400' },
  { form: 'Institutional', label: 'Institutional Capital', desc: 'Legal sandboxes, transparent charters, and anti-corruption covenants', icon: Building, color: 'text-cyan-400' }
];

export const CapitalEngineView: React.FC<CapitalEngineViewProps> = ({ onSelectTab }) => {
  const { activeMission, advanceMissionStage } = useActiveMission();
  const [tranches, setTranches] = useState<CapitalAllocationTranche[]>(CAPITAL_TRANCHES);
  const [selectedFormFilter, setSelectedFormFilter] = useState<string>('all');
  const [selectedTrancheId, setSelectedTrancheId] = useState<string>(CAPITAL_TRANCHES[0].id);

  const selectedTranche = tranches.find(t => t.id === selectedTrancheId) || tranches[0];

  const filteredTranches = tranches.filter(t => {
    return selectedFormFilter === 'all' || t.form === selectedFormFilter;
  });

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              CAPITAL COORDINATION ENGINE • 7 FORMS OF VALUE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Atlas Capital Engine</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            Moving capital from speculative extraction to non-predatory civilizational coordination across all 7 dimensions of living value.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeMission && (
            <button
              onClick={() => {
                advanceMissionStage('FIELD_DEPLOYED');
                onSelectTab('project-os');
              }}
              className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition-all shadow cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>Deploy to Project OS</span>
            </button>
          )}
          <button
            onClick={() => onSelectTab('opportunity-graph')}
            className="px-4 py-2.5 bg-[#141414] hover:bg-[#1e1e1e] border border-[#F5F5F0]/20 text-[#F5F5F0] font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>Map Capital Graph</span>
          </button>
          <button
            onClick={() => onSelectTab('evidence-ledger')}
            className="px-4 py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Audit Tranches</span>
          </button>
        </div>
      </div>

      {/* The 7 Forms of Capital Ribbon */}
      <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
            THE 7 FORMS OF CIVILIZATIONAL CAPITAL
          </span>
          <span className="text-xs text-[#F5F5F0]/40 font-mono">
            Holistic Value Framework
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {SEVEN_CAPITAL_FORMS.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedFormFilter === c.form;
            return (
              <div
                key={c.form}
                onClick={() => setSelectedFormFilter(isSelected ? 'all' : c.form)}
                className={`p-3.5 rounded-sm border cursor-pointer transition-all space-y-2 text-left ${
                  isSelected
                    ? 'bg-[#181818] border-[#C5A059] shadow-sm'
                    : 'bg-[#111111] border-[#F5F5F0]/5 hover:border-[#F5F5F0]/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${c.color}`} />
                  {isSelected && <span className="text-[9px] font-mono text-[#C5A059] font-bold">ACTIVE</span>}
                </div>
                <div className="text-xs font-bold text-[#F5F5F0]">{c.label}</div>
                <div className="text-[9px] text-[#F5F5F0]/50 line-clamp-2 leading-tight font-sans">
                  {c.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Covenant Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono">
        <div className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-widest">Active Coordinated Capital</div>
          <div className="text-2xl font-bold text-[#F5F5F0]">$124.5M</div>
          <div className="text-[10px] text-emerald-400">Across 18 Regional Hubs</div>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-widest">Average Patient Horizon</div>
          <div className="text-2xl font-bold text-[#C5A059]">28.4 Years</div>
          <div className="text-[10px] text-[#F5F5F0]/60">0% Extractive Usury</div>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-widest">Beneficiaries Secured</div>
          <div className="text-2xl font-bold text-emerald-400">4,347,000</div>
          <div className="text-[10px] text-emerald-400">Verified Dignity Metrics</div>
        </div>

        <div className="p-5 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-1">
          <div className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-widest">Epistemic Evidence Audit</div>
          <div className="text-2xl font-bold text-[#8FB8DE]">96.2%</div>
          <div className="text-[10px] text-emerald-400">Cryptographically Anchored</div>
        </div>
      </div>

      {/* Main Grid: Active Tranches List + Tranche Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Tranche Selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F0]/10">
            <span className="text-xs font-mono uppercase text-[#F5F5F0]/70 font-bold">
              PATIENT ALLOCATION TRANCHES ({filteredTranches.length})
            </span>
            {selectedFormFilter !== 'all' && (
              <button
                onClick={() => setSelectedFormFilter('all')}
                className="text-[10px] font-mono text-[#C5A059] hover:underline"
              >
                Show All Forms
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredTranches.map((t) => {
              const isSelected = t.id === selectedTrancheId;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTrancheId(t.id)}
                  className={`p-4 rounded-sm border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-[#151515] border-[#C5A059] shadow-md'
                      : 'bg-[#0D0D0D] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#C5A059] font-bold">{t.id}</span>
                    <span className="px-2 py-0.5 bg-[#1B3022] text-emerald-300 rounded font-bold uppercase">
                      {t.form}
                    </span>
                  </div>

                  <h3 className="text-sm font-serif font-bold text-[#F5F5F0] leading-snug">
                    {t.name}
                  </h3>

                  <div className="text-xs font-mono text-emerald-400 font-bold">
                    {t.amount}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/60 border-t border-[#F5F5F0]/5">
                    <span>Term: {t.nonExtractiveTermYears} Yrs</span>
                    <span>Evidence: {t.evidenceQuality}%</span>
                    <span>Status: {t.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Tranche Dossier & Covenant Integrity */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-4">
              <div>
                <div className="text-[10px] font-mono text-[#C5A059] font-bold">
                  {selectedTranche.id} • {selectedTranche.form} CAPITAL
                </div>
                <h2 className="text-xl font-serif font-bold text-[#F5F5F0] mt-1">
                  {selectedTranche.name}
                </h2>
                <div className="text-xs text-[#F5F5F0]/60 font-sans mt-0.5">
                  Provider: <span className="text-[#F5F5F0]/90 font-mono">{selectedTranche.provider}</span>
                </div>
              </div>

              <div className="self-start sm:self-center">
                <span className="px-3 py-1 bg-[#1B3022] border border-emerald-500/40 text-emerald-300 font-mono text-xs uppercase font-bold rounded-sm">
                  {selectedTranche.status}
                </span>
              </div>
            </div>

            {/* Core Metrics Quad */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono text-xs">
              <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs">
                <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Capital Amount</div>
                <div className="text-sm font-bold text-[#C5A059]">{selectedTranche.amount}</div>
              </div>
              <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs">
                <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Horizon Period</div>
                <div className="text-sm font-bold text-[#8FB8DE]">{selectedTranche.nonExtractiveTermYears} Years</div>
              </div>
              <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs">
                <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Readiness Score</div>
                <div className="text-sm font-bold text-emerald-400">{selectedTranche.readinessScore}/100</div>
              </div>
              <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs">
                <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Evidence Audit</div>
                <div className="text-sm font-bold text-purple-400">{selectedTranche.evidenceQuality}% Verified</div>
              </div>
            </div>

            {/* Recipient Project & Expected Outcome */}
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-[#141414] border border-[#F5F5F0]/5 rounded-xs space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                  RECIPIENT INITIATIVE & BIOSPHERE NODE
                </span>
                <div className="text-sm font-bold text-[#F5F5F0]">
                  {selectedTranche.recipientProject}
                </div>
              </div>

              <div className="p-4 bg-[#141414] border border-[#F5F5F0]/5 rounded-xs space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                  EXPECTED PHYSICAL & HUMAN OUTCOME
                </span>
                <p className="text-[#F5F5F0]/80 font-sans leading-relaxed">
                  {selectedTranche.expectedOutcome}
                </p>
              </div>
            </div>

            {/* Covenant & Non-Extractive Safeguards */}
            <div className="p-4 bg-[#1B3022]/40 border border-emerald-500/30 rounded-sm space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold uppercase tracking-wider text-[10px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Anti-Extractive Covenant Protections</span>
              </div>
              <ul className="space-y-1 text-[#F5F5F0]/80 font-sans text-[11px] list-disc list-inside">
                <li>Zero compounding debt interest or punitive default clauses.</li>
                <li>Repayment linked strictly to verifiable positive ecological & economic surplus.</li>
                <li>Community retains permanent veto over land, water, and local physical asset alienation.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 03 Coordination: Blended Capital Stack Structuring Engine */}
      <BlendedFinanceStructuringEngine
        targetProjectName={selectedTranche.recipientProject}
      />

      {/* Smart Escrow: Telemetry-Triggered Multi-Sig Tranche Disbursements */}
      <MilestoneEscrowTrancheController
        facilityName={selectedTranche.recipientProject}
      />
    </div>
  );
};
