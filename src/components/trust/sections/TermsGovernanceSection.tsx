import React, { useState } from 'react';
import { 
  Scale, 
  BookOpen, 
  Users, 
  AlertCircle, 
  FileCode, 
  ShieldAlert, 
  Handshake, 
  ChevronRight, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { audioFeedback } from '../../../lib/audioFeedback';

export const TermsGovernanceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'guidelines' | 'dispute' | 'partners' | 'responsible-use'>('terms');

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#C5A059]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">Constitutional Legal Framework</span>
          </div>
          <h2 className="text-xl font-medium font-serif text-[#F5F5F0]">
            Terms of Service, Community Standards & Commons Governance
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl leading-relaxed">
            Atlas Sanctum rejects opaque legalese designed to disempower users. Our terms are written with plain-language parity, codifying non-extractive coordination, reciprocal obligations, and fair dispute mediation.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap border-b border-[#F5F5F0]/10 pb-3">
        {[
          { id: 'terms', label: 'Terms of Service', icon: BookOpen },
          { id: 'guidelines', label: 'Community Guidelines', icon: Users },
          { id: 'dispute', label: 'Dispute Resolution & Assembly', icon: Scale },
          { id: 'partners', label: 'Partner & Land Trust Standards', icon: Handshake },
          { id: 'responsible-use', label: 'Responsible AI & Data Use', icon: ShieldAlert }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                audioFeedback.playMicroTick();
              }}
              className={`px-3 py-2 text-xs font-mono rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#C5A059] text-black font-bold shadow-sm'
                  : 'bg-[#161616] hover:bg-[#222] text-[#F5F5F0]/70 border border-[#F5F5F0]/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="p-6 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-6 text-xs text-[#F5F5F0]/80 leading-relaxed">
        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold text-[#F5F5F0] uppercase text-[#C5A059]">
              Atlas Sanctum Master Terms of Service (v2026.1)
            </h3>
            <div className="space-y-3">
              <p>
                <strong>1. Nature of the Platform:</strong> Atlas Sanctum provides bioregional modeling tools, epistemic research hubs, and decentralized capital matchmakers. It is designed to assist human flourishing, ecological restoration, and multi-generational stewardship.
              </p>
              <p>
                <strong>2. Data Sovereignty & Content Ownership:</strong> You retain complete, irrevocable ownership of all field lab telemetry, project documentation, and proprietary design files you upload. You grant Atlas Sanctum a non-exclusive license solely to perform in-browser simulation and verifiable cryptographic proofs as directed by you.
              </p>
              <p>
                <strong>3. Non-Extractive Financial Transactions:</strong> All capital coordination via the Opportunity Engine operates under capped-return covenants or perpetual commons trust structures. Extraction of usurious interest or predatory land seizure is strictly prohibited.
              </p>
              <p>
                <strong>4. Service Availability:</strong> While we maintain 99.98% verified uptime SLAs, the platform provides offline-first IndexedDB capabilities so that remote field work remains resilient during external disruptions.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'guidelines' && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold text-[#F5F5F0] uppercase text-emerald-400">
              Bioregional Community Guidelines & Etiquette
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#161616] rounded border border-[#F5F5F0]/5 space-y-2">
                <h4 className="font-mono font-bold text-[#F5F5F0] flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Recommended Practices
                </h4>
                <ul className="space-y-1.5 text-[11px] text-[#F5F5F0]/70 font-mono">
                  <li>• Ground claims with empirical sensor data or verifiable citations</li>
                  <li>• Respect traditional ecological knowledge (TEK) & sovereign protocols</li>
                  <li>• Share constructive peer review and counter-evidence in good faith</li>
                  <li>• Attribute credit transparently to local community stewards</li>
                </ul>
              </div>

              <div className="p-4 bg-[#161616] rounded border border-rose-900/30 space-y-2">
                <h4 className="font-mono font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400" /> Prohibited Behaviors
                </h4>
                <ul className="space-y-1.5 text-[11px] text-[#F5F5F0]/70 font-mono">
                  <li>• Greenwashing or falsifying bio-carbon soil core measurements</li>
                  <li>• Commercial data scraping or non-consensual biometric harvest</li>
                  <li>• Predatory land speculation or hostile token takeovers</li>
                  <li>• Harassment, hate speech, or abuse of community assemblies</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dispute' && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold text-[#F5F5F0] uppercase text-[#8FB8DE]">
              Decentralized Dispute Resolution & Governance Assembly
            </h3>
            <p>
              In the event of disagreements concerning project milestone validation, impact claim veracity, or governance treasury allocations, disputes do not pass to adversarial corporate litigation. Instead, they follow our three-tiered restorative mediation process:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] font-mono">
              <div className="p-3 bg-[#161616] rounded border border-[#F5F5F0]/5 space-y-1">
                <span className="text-[#C5A059] font-bold">Tier 1: Direct Dialogue</span>
                <p className="text-[#F5F5F0]/70">Direct peer mediation facilitated by a neutral bioregional circle steward within 7 business days.</p>
              </div>
              <div className="p-3 bg-[#161616] rounded border border-[#F5F5F0]/5 space-y-1">
                <span className="text-cyan-400 font-bold">Tier 2: Scientific Jury</span>
                <p className="text-[#F5F5F0]/70">5 randomly selected peer reviewers analyze primary raw sensor datasets and calibration certificates.</p>
              </div>
              <div className="p-3 bg-[#161616] rounded border border-[#F5F5F0]/5 space-y-1">
                <span className="text-purple-400 font-bold">Tier 3: Assembly Vote</span>
                <p className="text-[#F5F5F0]/70">Binding liquid democracy assembly vote published immutably on the Epistemic Ledger.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold text-[#F5F5F0] uppercase text-cyan-400">
              Partner Standards & Land Trust Certification
            </h3>
            <p>
              Institutional capital partners, university field labs, and land trusts integrating with Atlas Sanctum must sign the Non-Extractive Partner Covenant. Key obligations include:
            </p>
            <ul className="space-y-2 font-mono text-[11px]">
              <li className="p-2.5 bg-[#161616] rounded border border-[#F5F5F0]/5">
                <span className="text-[#C5A059] font-bold">1. Perpetual Conservation Easements:</span> Restricting land use from extractive resource liquidation for minimum 99-year terms.
              </li>
              <li className="p-2.5 bg-[#161616] rounded border border-[#F5F5F0]/5">
                <span className="text-emerald-400 font-bold">2. Local Community Benefit Agreements:</span> Guaranteeing at least 51% of net economic value flow remains within the local bioregion.
              </li>
              <li className="p-2.5 bg-[#161616] rounded border border-[#F5F5F0]/5">
                <span className="text-cyan-400 font-bold">3. Open Scientific Telemetry:</span> Committing to public sensor broadcasting via the Epistemic Ledger.
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'responsible-use' && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold text-[#F5F5F0] uppercase text-amber-400">
              Responsible AI & Algorithmic Safety Policy
            </h3>
            <p>
              We enforce strict red-lines on the application of synthetic intelligence within Atlas Sanctum:
            </p>
            <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded text-amber-200/90 space-y-2 font-mono text-[11px]">
              <p>• NO lethal autonomous decision-making or bio-weapon synthesis queries permitted.</p>
              <p>• NO behavioral surveillance or non-consensual cognitive manipulation.</p>
              <p>• NO automated denial of community resources or land stewardship access without human review.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
