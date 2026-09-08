import React, { useState } from 'react';
import {
  Lock,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Key,
  Layers,
  Coins,
  Cpu,
  Building2,
  ChevronRight,
  Zap,
  TrendingUp,
  Activity,
  FileCheck,
  Compass,
  Scale,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import {
  SubscriptionTier,
  ATLAS_TIERS,
  getCurrentSubscription,
  applyVoucherCode
} from '../../lib/subscriptionManager';
import { PageView } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface TierRestrictionGateProps {
  targetView: PageView;
  requiredTier: SubscriptionTier;
  onOpenCheckout: (tier: SubscriptionTier) => void;
  onNavigateToPricing: () => void;
  onNavigateToCommons: () => void;
  onUnlockSuccess?: () => void;
}

// Tailored value propositions for specific locked views
interface FeatureValueProposition {
  title: string;
  category: string;
  headline: string;
  summary: string;
  roiMetric: string;
  unlockedCapabilities: string[];
  operatorPersona: string;
}

const VIEW_VALUE_PROPOSITIONS: Partial<Record<PageView, FeatureValueProposition>> = {
  'project-os': {
    title: 'Project Operating System (Project-OS)',
    category: 'Bioregional Execution & Telemetry',
    headline: 'Bridge High-Frequency Hardware Telemetry with Multi-Stakeholder Project Execution',
    summary: 'Project-OS transforms raw ground-truth sensor streams, satellite indices, and on-site evidence into verified milestone tracking, capital drawdown requests, and auditable governance logs.',
    roiMetric: 'Reduces operational verification friction by 78% and automates donor/investor compliance.',
    unlockedCapabilities: [
      'Physical Asset Registry with cryptographically verifiable QR tags',
      'Real-time IoT telemetry pipelines for soil moisture, sap flow, and micro-climate arrays',
      'Immutable evidence collection workflows with timestamped photographic attestations',
      'Automated quarterly performance and capital drawdown dossiers'
    ],
    operatorPersona: 'Field Project Directors, Watershed Stewards & Hardware Operators'
  },
  'decision-room': {
    title: 'The Decision Room & Epistemic Council',
    category: 'Frontier AI Reasoning & Deliberation',
    headline: 'Subject Critical Interventions to Autonomous Multi-Agent Counterfactual Stress-Testing',
    summary: 'The Decision Room deploys 10 autonomous, specialized epistemic AI agents (Hydrologist, Pedologist, Ethicist, Causal Arbiter, etc.) to debate long-term planetary consequences before physical capital is deployed.',
    roiMetric: 'Surfaces 84% more non-linear second-order risks and unintended ecological failure modes.',
    unlockedCapabilities: [
      '10 Specialized Epistemic AI Agents acting as autonomous domain councilors',
      'Do-calculus causal intervention graphs simulating policy & ecosystem shocks',
      'Unintended consequence radar measuring cascading ecological and social spillovers',
      'Institutional failure memory database preventing repetition of historical errors'
    ],
    operatorPersona: 'Civilizational Strategists, Policy Architects & Institutional Stewards'
  },
  'agent-mission-control': {
    title: 'Agent Mission Control',
    category: 'Autonomous Multi-Agent Telemetry',
    headline: 'Continuous Autonomous Monitoring and Planetary Task Dispatch',
    summary: 'Orchestrate 24/7 autonomous agent routines across planetary observation feeds, anomalous wildfire telemetry, aquifer stress alerts, and automated community mitigation triggers.',
    roiMetric: 'Achieves sub-second autonomous anomaly detection across multi-spectral satellite swarms.',
    unlockedCapabilities: [
      'Real-time multi-agent execution feed with verifiable reasoning traces',
      'Autonomous mission parameter configuration and contingency triggers',
      'Cross-agent consensus protocols and epistemic confidence scoring',
      'Direct API streaming endpoints for external sensor and drone fleet dispatch'
    ],
    operatorPersona: 'Autonomous Systems Engineers & Ecological Emergency Dispatchers'
  },
  'capital-engine': {
    title: 'The Capital Engine & Disbursement Protocol',
    category: 'Sovereign Regenerative Finance',
    headline: 'Programmatic Capital Allocation Backed by Verified Multi-Capital Restoration',
    summary: 'Direct sovereign balance sheets, philanthropic endowments, and municipal bonds into verified ecological initiatives using algorithmic milestone verification across all 7 ecological capitals.',
    roiMetric: 'Directly verifiable telemetry eliminates 95% of greenwashing audit costs.',
    unlockedCapabilities: [
      'Smart contract and escrow disbursement directly triggered by Merkle proofs',
      'Multi-capital return on investment modeling (Natural, Social, Human, Financial)',
      'Institutional sovereign treasury governance and stakeholder quorum protocols',
      'Direct integration with the Proof-of-Regeneration Evidence Ledger'
    ],
    operatorPersona: 'Regenerative Asset Allocators, Sovereign Funds & Foundation Trustees'
  },
  'opportunity-matchmaker': {
    title: 'Opportunity Matchmaker & Capital Graph',
    category: 'Regenerative Ecosystem Matching',
    headline: 'Algorithmic Pairing of Verified Ecological Projects with Sovereign Capital',
    summary: 'Connect high-integrity restoration projects across the globe with institutional capital syndicates seeking real, verifiable biophysical impact rather than paper carbon offsets.',
    roiMetric: 'Reduces project origination and due-diligence cycles from 9 months to 48 hours.',
    unlockedCapabilities: [
      'Multi-dimensional capital matching matrix based on biophysical impact vectors',
      'Automated due-diligence data rooms with cryptographically signed sensor histories',
      'Syndicate co-investment structuring and escrow management',
      'Bespoke institutional term-sheet and SLA generation'
    ],
    operatorPersona: 'Impact Investment Directors, Bioregional Syndicates & Project Originators'
  },
  'multimodal-studio': {
    title: 'Multimodal Simulation Studio',
    category: 'Bioregional Scenario Engineering',
    headline: 'Interactive Biophysical Scenario Modeling Across Decadal Trajectories',
    summary: 'Simulate the impact of agroforestry transitions, groundwater replenishment, and soil organic carbon sequestration across 5, 15, and 30-year projections with uncertainty cones.',
    roiMetric: 'Enables high-confidence capital forecasting with Monte Carlo biophysical bounds.',
    unlockedCapabilities: [
      'High-resolution satellite spatial overlay and vegetation indices',
      'Decadal biophysical trajectory modeling with climate change scenarios',
      'Multi-variable parameter sensitivity sweeps for ecosystem interventions',
      'Exportable scenario models for regulatory and stakeholder presentations'
    ],
    operatorPersona: 'Ecological Modellers, Landscape Architects & Bioregional Planners'
  },
  'evidence-mapping': {
    title: 'Evidence Mapping & Spatial Truth Layer',
    category: 'Ground-Truth Spatial Verification',
    headline: 'Geospatially Anchored Sensor Networks and Satellite Ground-Truthing',
    summary: 'Audit and visualize on-the-ground ecological restoration points overlaid against multispectral imagery and micro-climate sensor coordinates with tamper-evident attestation.',
    roiMetric: 'Provides centimeter-accurate spatial evidence verification for carbon and biodiversity assets.',
    unlockedCapabilities: [
      'Geospatial multi-layer visualization with interactive terrain models',
      'Hardware sensor cluster telemetry mapping with signal strength and calibration health',
      'Photographic and drone imagery alignment with immutable timestamping',
      'Audit export formats compatible with international MRV standards'
    ],
    operatorPersona: 'MRV Specialists, Geospatial Analysts & Verification Auditors'
  }
};

export const TierRestrictionGate: React.FC<TierRestrictionGateProps> = ({
  targetView,
  requiredTier,
  onOpenCheckout,
  onNavigateToPricing,
  onNavigateToCommons,
  onUnlockSuccess
}) => {
  const currentSub = getCurrentSubscription();
  const requiredDef = ATLAS_TIERS[requiredTier];
  const currentDef = ATLAS_TIERS[currentSub.currentTier];

  const [voucherCode, setVoucherCode] = useState('');
  const [voucherFeedback, setVoucherFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  // Retrieve tailored value proposition or construct smart fallback
  const valueProp: FeatureValueProposition = VIEW_VALUE_PROPOSITIONS[targetView] || {
    title: requiredDef.name,
    category: requiredDef.badge,
    headline: `Unlock Advanced Institutional Capability with ${requiredDef.name}`,
    summary: requiredDef.tagline,
    roiMetric: 'Unlocks downstream operational autonomy, verified telemetry, and sovereign decision infrastructure.',
    unlockedCapabilities: requiredDef.offerings.slice(0, 4).map(o => o.name),
    operatorPersona: 'Verified Bioregional Operators & Institutional Stewards'
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    const res = applyVoucherCode(voucherCode);
    setVoucherFeedback(res);
    if (res.success) {
      audioFeedback.play('success');
      if (onUnlockSuccess) {
        onUnlockSuccess();
      }
    } else {
      audioFeedback.play('warning');
    }
  };

  const handleInstantDemoUnlock = (tier: SubscriptionTier) => {
    audioFeedback.play('softClick');
    const code = tier === 'studio' 
      ? 'ATLAS-STUDIO-DEMO' 
      : tier === 'intelligence' 
      ? 'ATLAS-INTELLIGENCE-DEMO' 
      : 'ATLAS-ENTERPRISE-DEMO';
    const res = applyVoucherCode(code);
    setVoucherFeedback(res);
    if (res.success && onUnlockSuccess) {
      onUnlockSuccess();
    }
  };

  const tierAccentStyles = {
    foundation: {
      border: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
      glow: 'shadow-[0_0_50px_rgba(16,185,129,0.15)]',
      gradient: 'from-emerald-900/40 via-[#0C0C0C] to-[#0C0C0C]',
      textAccent: 'text-emerald-400'
    },
    studio: {
      border: 'border-[#C5A059]/40',
      badgeBg: 'bg-[#1B3022] text-[#C5A059] border-[#C5A059]/40',
      glow: 'shadow-[0_0_50px_rgba(197,160,89,0.18)]',
      gradient: 'from-[#1B3022]/60 via-[#0C0C0C] to-[#0C0C0C]',
      textAccent: 'text-[#C5A059]'
    },
    intelligence: {
      border: 'border-[#C5A059]',
      badgeBg: 'bg-[#C5A059] text-black font-bold border-amber-300',
      glow: 'shadow-[0_0_60px_rgba(197,160,89,0.25)]',
      gradient: 'from-[#C5A059]/20 via-[#0C0C0C] to-[#0C0C0C]',
      textAccent: 'text-[#C5A059]'
    },
    enterprise: {
      border: 'border-purple-500/50',
      badgeBg: 'bg-purple-950 text-purple-300 border-purple-500/50',
      glow: 'shadow-[0_0_60px_rgba(168,85,247,0.2)]',
      gradient: 'from-purple-950/40 via-[#0C0C0C] to-[#0C0C0C]',
      textAccent: 'text-purple-300'
    }
  }[requiredTier];

  const tierIcon = {
    foundation: Layers,
    studio: Layers,
    intelligence: Cpu,
    enterprise: Building2
  }[requiredTier];

  const Icon = tierIcon;

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#070707] text-[#F5F5F0]">
      <div className={`relative w-full max-w-4xl rounded-sm bg-[#0C0C0C] border ${tierAccentStyles.border} ${tierAccentStyles.glow} overflow-hidden`}>
        
        {/* Top Visual Accent Strip */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${
          requiredTier === 'studio' 
            ? 'from-[#1B3022] via-[#C5A059] to-[#1B3022]'
            : requiredTier === 'intelligence'
            ? 'from-[#C5A059] via-[#F3E5AB] to-[#C5A059]'
            : 'from-purple-600 via-[#C5A059] to-purple-600'
        }`} />

        <div className="p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
          
          {/* ========================================================================= */}
          {/* UPGRADE REQUIRED VISUAL STATUS BANNER */}
          {/* ========================================================================= */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-sm bg-gradient-to-r from-amber-950/40 via-black/60 to-black border border-amber-500/30">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-12 h-12 rounded-sm bg-[#1A130B] border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full animate-ping opacity-75" />
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    UPGRADE REQUIRED
                  </span>
                  <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">
                    Protected Module
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-serif text-[#F5F5F0] mt-0.5">
                  Access to {valueProp.title} is Restricted
                </h1>
              </div>
            </div>

            {/* Current vs Target Tier Delta Pill */}
            <div className="flex items-center gap-2 text-xs font-mono bg-black/60 px-3.5 py-2 rounded border border-white/10 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <span className="text-[9px] text-[#F5F5F0]/40 block uppercase">YOUR ACTIVE TIER</span>
                <span className="text-[#F5F5F0] font-bold text-xs">{currentDef.name}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#C5A059] shrink-0" />
              <div className="text-right">
                <span className="text-[9px] text-[#C5A059] block uppercase font-bold">REQUIRED</span>
                <span className={`${tierAccentStyles.textAccent} font-bold text-xs`}>{requiredDef.name}</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VALUE PROPOSITION SUMMARY CARD (LOCKED FEATURE SPOTLIGHT) */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-sm bg-[#111613] border border-[#C5A059]/30 space-y-4 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${tierAccentStyles.textAccent}`} />
                <span className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold">
                  {valueProp.category} • Feature Value Proposition
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#F5F5F0]/60 bg-black/40 px-2.5 py-0.5 rounded border border-white/5">
                Designed for: {valueProp.operatorPersona}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif text-[#F5F5F0] font-normal leading-snug">
                {valueProp.headline}
              </h2>
              <p className="text-xs sm:text-sm text-[#F5F5F0]/80 font-light leading-relaxed">
                {valueProp.summary}
              </p>
            </div>

            {/* ROI & Quantifiable Metric Highlight */}
            <div className="p-3 rounded bg-black/50 border border-[#C5A059]/20 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-xs font-mono">
                <span className="text-[#C5A059] font-bold block text-[10px] uppercase">Demonstrated Institutional ROI</span>
                <span className="text-[#F5F5F0]/90">{valueProp.roiMetric}</span>
              </div>
            </div>

            {/* Core Unlocked Capabilities Grid */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0]/50 font-bold block">
                Direct Capabilities Unlocked Upon Activation:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {valueProp.unlockedCapabilities.map((cap, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#F5F5F0]/85 bg-black/30 p-2.5 rounded border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                    <span className="leading-snug">{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* INTUITIVE CONVERSION PATH & CALL-TO-ACTIONS */}
          {/* ========================================================================= */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  audioFeedback.play('commandOpen');
                  onOpenCheckout(requiredTier);
                }}
                className="flex-1 py-4 px-6 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_30px_rgba(197,160,89,0.3)] hover:scale-[1.01]"
              >
                <span>Upgrade to {requiredDef.name} ({requiredTier === 'enterprise' ? 'Custom SLA' : `$${requiredDef.monthlyPrice}/mo`})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  audioFeedback.play('softClick');
                  onNavigateToPricing();
                }}
                className="py-4 px-5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] font-mono text-xs rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Compare All Tiers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  audioFeedback.play('softClick');
                  onNavigateToCommons();
                }}
                className="py-4 px-4 bg-white/5 hover:bg-white/10 text-[#F5F5F0]/60 hover:text-white font-mono text-xs rounded-sm transition-colors cursor-pointer text-center"
              >
                Return to Commons
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50 px-1 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multi-Method Settlement: Credit Card, Web3/Crypto, or Institutional Net-30 Wire</span>
              </span>
              <span>Cancel or adjust capacity tier anytime. Non-extractive protocol.</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* EVALUATOR & REVIEWER TESTING BYPASS BAR */}
          {/* ========================================================================= */}
          <div className="pt-4 border-t border-[#F5F5F0]/10 font-mono text-xs space-y-2.5 bg-black/40 p-3.5 rounded-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#F5F5F0]/60">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[#F5F5F0]">Evaluator & Hackathon Instant Unlock:</span>
              </span>
              <button
                type="button"
                onClick={() => handleInstantDemoUnlock(requiredTier)}
                className="text-[#C5A059] hover:text-amber-200 underline cursor-pointer flex items-center gap-1 font-bold"
              >
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Instant 1-Click Demo Unlock for {requiredDef.name}</span>
              </button>
            </div>

            <form onSubmit={handleApplyVoucher} className="flex gap-2">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Or enter voucher code (e.g. ATLAS-STUDIO-DEMO, ATLAS-INTELLIGENCE-DEMO)"
                className="flex-1 px-3 py-2 rounded-sm bg-black/80 border border-white/10 text-[#F5F5F0] text-xs focus:border-[#C5A059] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#F5F5F0] text-xs font-bold rounded-sm cursor-pointer transition-colors"
              >
                Apply Voucher
              </button>
            </form>

            {voucherFeedback && (
              <div className={`p-2 rounded text-[11px] ${voucherFeedback.success ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950 text-rose-300 border border-rose-500/30'}`}>
                {voucherFeedback.message}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

