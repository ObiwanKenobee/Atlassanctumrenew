import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Scale,
  Lock,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  ArrowRight,
  Eye,
  Layers,
  HelpCircle,
  Coins,
  HeartHandshake,
  Users
} from 'lucide-react';
import { CovenantAuditDossier, PredatoryRiskFlag } from '../../types';
import { COVENANT_AUDITS } from '../../data/aiEnginesData';

interface MoralArbiterViewProps {
  onSelectTab: (tab: any) => void;
}

export const MoralArbiterView: React.FC<MoralArbiterViewProps> = ({ onSelectTab }) => {
  const [dossiers, setDossiers] = useState<CovenantAuditDossier[]>(COVENANT_AUDITS);
  const [selectedDossierId, setSelectedDossierId] = useState<string>(COVENANT_AUDITS[0].id);

  const selectedDossier = dossiers.find(d => d.id === selectedDossierId) || dossiers[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'Blocked (Moral Veto)':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
      case 'Remediation Required':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Forbidden / Breach':
        return 'bg-rose-950 text-rose-400 border-rose-500/40';
      case 'Elevated':
        return 'bg-amber-950 text-amber-400 border-amber-500/40';
      case 'Caution':
        return 'bg-yellow-950 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-neutral-900 text-neutral-400 border-neutral-700';
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
              CONSTITUTIONAL MORAL ARBITER • AUTOMATED COVENANT AUDIT
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Constitutional Moral Arbiter</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            AI-driven pre-disbursement legal audit evaluating proposed capital contracts against inalienable human dignity, intergenerational equity, and anti-extractive covenants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('capital-engine')}
            className="px-4 py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <Coins className="w-4 h-4 text-[#C5A059]" />
            <span>Capital Engine</span>
          </button>
          <button
            onClick={() => onSelectTab('evidence-ledger')}
            className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Evidence Ledger</span>
          </button>
        </div>
      </div>

      {/* Contract Audit Selector Ribbon */}
      <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
            SELECT PROPOSED COVENANT OR AGREEMENT FOR INSPECTION
          </span>
          <span className="text-xs text-[#F5F5F0]/40 font-mono">
            3 Active Audit Files
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dossiers.map((d) => {
            const isSelected = d.id === selectedDossierId;
            return (
              <div
                key={d.id}
                onClick={() => setSelectedDossierId(d.id)}
                className={`p-4 rounded-sm border cursor-pointer transition-all space-y-2.5 text-left ${
                  isSelected
                    ? 'bg-[#181818] border-[#C5A059] shadow-md scale-[1.01]'
                    : 'bg-[#111111] border-[#F5F5F0]/5 hover:border-[#F5F5F0]/20'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#C5A059] font-bold">{d.contractType}</span>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase border ${getStatusBadge(d.status)}`}>
                    {d.status}
                  </span>
                </div>
                <h3 className="text-sm font-serif font-bold text-[#F5F5F0] leading-snug">
                  {d.projectTitle}
                </h3>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/60 pt-1 border-t border-[#F5F5F0]/5">
                  <span>Dignity Score: {d.dignityScorecard.overallDignityScore}%</span>
                  <span>Flags: {d.predatoryRiskFlags.length}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dignity Scorecard Bar & High-Level Verdict */}
      <div className="p-8 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={`relative w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shadow-lg ${
              selectedDossier.dignityScorecard.overallDignityScore >= 90
                ? 'border-emerald-500 bg-[#122016]'
                : selectedDossier.dignityScorecard.overallDignityScore >= 70
                ? 'border-amber-500 bg-[#241B10]'
                : 'border-rose-500 bg-[#251111]'
            }`}>
              <span className="text-3xl font-bold font-mono text-[#F5F5F0]">
                {selectedDossier.dignityScorecard.overallDignityScore}
              </span>
              <span className="text-[10px] text-[#F5F5F0]/60 font-mono uppercase">/ 100</span>
            </div>

            <div className="space-y-1 max-w-xl">
              <div className="text-xs font-mono uppercase text-[#C5A059] font-bold tracking-widest">
                CONSTITUTIONAL MORAL VERDICT
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#F5F5F0]">
                {selectedDossier.status === 'Approved' && 'Fully Approved • Covenant Integrity Verified'}
                {selectedDossier.status === 'Blocked (Moral Veto)' && 'Blocked by Constitutional Arbiter • Predatory Clauses Detected'}
                {selectedDossier.status === 'Remediation Required' && 'Remediation Required Prior to Multi-Assembly Ratification'}
              </h2>
              <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                {selectedDossier.secondOrderHarmPrediction}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full lg:w-auto">
            <span className={`px-4 py-2 text-center text-xs font-mono font-bold uppercase rounded-sm border ${getStatusBadge(selectedDossier.status)}`}>
              Audit Status: {selectedDossier.status}
            </span>
            <span className="text-[10px] font-mono text-[#F5F5F0]/40 text-center">
              Audited in 410ms against Atlas Moral Standard v2.4
            </span>
          </div>
        </div>

        {/* 5-Pillar Dignity Scorecard Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-[#F5F5F0]/10 font-mono text-center">
          <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs space-y-1">
            <div className="text-[9px] text-[#F5F5F0]/50 uppercase">Human Autonomy</div>
            <div className="text-base font-bold text-[#F5F5F0]">{selectedDossier.dignityScorecard.humanAutonomy}%</div>
          </div>
          <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs space-y-1">
            <div className="text-[9px] text-[#F5F5F0]/50 uppercase">Ecological Parity</div>
            <div className="text-base font-bold text-emerald-400">{selectedDossier.dignityScorecard.ecologicalRegeneration}%</div>
          </div>
          <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs space-y-1">
            <div className="text-[9px] text-[#F5F5F0]/50 uppercase">Self-Governance</div>
            <div className="text-base font-bold text-[#8FB8DE]">{selectedDossier.dignityScorecard.sovereignSelfGovernance}%</div>
          </div>
          <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs space-y-1">
            <div className="text-[9px] text-[#F5F5F0]/50 uppercase">Intergenerational</div>
            <div className="text-base font-bold text-purple-400">{selectedDossier.dignityScorecard.intergenerationalEquity}%</div>
          </div>
          <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs space-y-1">
            <div className="text-[9px] text-[#F5F5F0]/50 uppercase">0% Usury Parity</div>
            <div className="text-base font-bold text-[#C5A059]">{selectedDossier.dignityScorecard.antiUsuryCompliance}%</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Predatory Clause Scanner + Multi-Assembly Veto Gates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Predatory Clause Scanner */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F5F5F0]">
                Predatory Clause Detection Engine ({selectedDossier.predatoryRiskFlags.length} Flags)
              </span>
              <span className="text-[10px] font-mono text-[#C5A059]">
                Zero Extractive Tolerance
              </span>
            </div>

            {selectedDossier.predatoryRiskFlags.length === 0 ? (
              <div className="p-8 bg-[#1B3022]/40 border border-emerald-500/30 rounded-sm text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-serif font-bold text-emerald-300">
                  Zero Predatory or Extractive Clauses Detected
                </div>
                <p className="text-xs text-[#F5F5F0]/70 font-sans max-w-md mx-auto">
                  This covenant fully satisfies the Atlas Sanctum Non-Extractive Charter. All property rights, open hardware patents, and water commons remain sovereign.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDossier.predatoryRiskFlags.map((flag) => (
                  <div
                    key={flag.id}
                    className="p-5 bg-[#141414] border border-rose-500/30 rounded-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">
                          {flag.riskType} Risk • {flag.clauseReference}
                        </div>
                        <h4 className="text-sm font-serif font-bold text-[#F5F5F0] mt-0.5">
                          Violated: {flag.violatedPrinciple}
                        </h4>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[9px] font-mono uppercase font-bold rounded border self-start sm:self-center ${getSeverityBadge(flag.severity)}`}>
                        {flag.severity}
                      </span>
                    </div>

                    <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
                      {flag.aiExplanation}
                    </p>

                    <div className="p-3 bg-[#1B2A1E] border border-emerald-500/40 rounded-xs space-y-1">
                      <div className="text-[9px] font-mono uppercase text-emerald-400 font-bold">
                        PRESCRIBED REMEDY & REPLACEMENT CLAUSE:
                      </div>
                      <div className="text-xs text-emerald-200 font-sans">
                        {flag.prescribedRemedy}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Multi-Assembly Veto Gates & Epistemic Audit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F5F5F0]/10">
              <Users className="w-4 h-4 text-[#C5A059]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F0]">
                Multi-Assembly Veto Gates
              </h3>
            </div>

            <p className="text-xs text-[#F5F5F0]/60 font-sans leading-relaxed">
              No project may disburse funds without explicit ratification from sovereign stakeholder councils holding binding veto power.
            </p>

            <div className="space-y-4">
              {selectedDossier.vetoGates.map((gate) => (
                <div
                  key={gate.id}
                  className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-[#F5F5F0]">{gate.stakeholderGroup}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded ${
                      gate.ratificationStatus === 'Ratified'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : gate.ratificationStatus === 'Exercised Veto'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {gate.ratificationStatus}
                    </span>
                  </div>

                  <div className="text-[10px] text-[#F5F5F0]/50 font-mono">
                    Role: {gate.role}
                  </div>

                  <div className="pt-1 border-t border-[#F5F5F0]/5 text-[11px] text-[#F5F5F0]/70 font-sans space-y-1">
                    <span className="font-bold text-[#F5F5F0] block">Mandatory Prerequisites:</span>
                    <ul className="list-disc list-inside">
                      {gate.mandatoryPrerequisites.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Epistemic Provenance Box */}
          <div className="p-4 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-1.5 text-xs font-mono">
            <span className="text-[10px] uppercase text-[#8FB8DE] font-bold">
              EPISTEMIC AUDIT TRAIL
            </span>
            <p className="text-[#F5F5F0]/70 text-[11px] font-sans">
              {selectedDossier.epistemicAuditTrail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
