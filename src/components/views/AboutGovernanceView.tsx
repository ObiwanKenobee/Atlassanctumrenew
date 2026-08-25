import React from 'react';
import { 
  TreeDeciduous, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Users, 
  Scale, 
  Compass, 
  ArrowRight
} from 'lucide-react';
import { PageView } from '../../types';

interface AboutGovernanceViewProps {
  onSelectTab: (tab: PageView) => void;
  onOpenMoralSimulator: () => void;
}

export const AboutGovernanceView: React.FC<AboutGovernanceViewProps> = ({
  onSelectTab,
  onOpenMoralSimulator
}) => {
  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/30 rounded-sm text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
          <TreeDeciduous className="w-3.5 h-3.5 text-[#C5A059]" />
          THE ATLAS SANCTUM COVENANT
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#F5F5F0] leading-tight">
          Building the Operating System for Regenerative Civilization
        </h1>
        <p className="text-sm sm:text-base text-[#F5F5F0]/70 leading-relaxed font-sans">
          We exist to help humanity flourish by building ethical systems that create lasting prosperity, opportunity, and ecological regeneration.
        </p>
      </div>

      {/* Core Trinity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-3">
          <div className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">Our Foundation</div>
          <h3 className="text-xl font-serif text-[#F5F5F0]">Faith in our why.</h3>
          <p className="text-xs text-[#F5F5F0]/60 leading-relaxed font-sans">
            Rooted in timeless moral axioms—human dignity, justice, sacred stewardship, and peace. We reject the cynicism that assumes exploitation is inevitable.
          </p>
        </div>

        <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-3">
          <div className="text-[10px] font-mono uppercase text-[#8FB8DE] font-bold tracking-[0.2em]">Our Engine</div>
          <h3 className="text-xl font-serif text-[#F5F5F0]">Intelligence in our systems.</h3>
          <p className="text-xs text-[#F5F5F0]/60 leading-relaxed font-sans">
            Multi-scale telemetry, causal AI reasoning, and open verification architectures that turn fragmented planetary signals into coherent action.
          </p>
        </div>

        <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-3">
          <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-[0.2em]">Our Measure</div>
          <h3 className="text-xl font-serif text-[#F5F5F0]">Love in our impact.</h3>
          <p className="text-xs text-[#F5F5F0]/60 leading-relaxed font-sans">
            True flourishing is measured by restored soils, clean water flowing to every child, dignified shelter, and communities empowered to govern their own destiny.
          </p>
        </div>
      </div>

      {/* Institutional AI Safety & Governance Principles */}
      <div className="p-8 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-6">
        <div className="space-y-1 pb-4 border-b border-[#F5F5F0]/10">
          <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">Governance & Accountability</span>
          <h2 className="text-2xl font-serif text-[#F5F5F0]">AI Safety & Institutional Stewardship Policies</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-[#F5F5F0]/70 font-sans">
          <div className="space-y-2">
            <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">1. Non-Sovereign AI Decision Support</h4>
            <p>
              AI models in Atlas Sanctum are computational tools for causal simulation and pattern recognition. They are never granted moral authority, legal personhood, or final sovereign decision-making over human lives, water rights, or land use.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">2. Visible Epistemic Uncertainty</h4>
            <p>
              The platform strictly forbids false certitude. All model outputs, carbon accounting estimates, and trajectory forecasts must present clear confidence intervals and list underlying scientific assumptions.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">3. Local Community Sovereign Equity</h4>
            <p>
              Every ecological credit or infrastructure project listed on the Regenerative Value Exchange mandates a minimum 30% perpetual equity reserve dedicated directly to local bioregional community trusts.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">4. Open Science & Anti-Monopoly</h4>
            <p>
              Telemetry data, environmental APIs, and LifeHouse architectural blueprints are held in an open digital commons to prevent proprietary bottlenecking of essential planetary survival technologies.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#F5F5F0]/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono text-[#F5F5F0]/40">
            Governed by the Atlas Sanctum International Advisory Council & Community Commons
          </div>
          <button
            onClick={onOpenMoralSimulator}
            className="px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
          >
            Launch Moral Intelligence Simulator →
          </button>
        </div>
      </div>
    </div>
  );
};
