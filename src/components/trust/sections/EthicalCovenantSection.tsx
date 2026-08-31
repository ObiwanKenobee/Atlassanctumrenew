import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Ban, 
  TreePine, 
  HeartHandshake, 
  Globe2, 
  CheckCircle2, 
  Leaf, 
  Scale,
  Award
} from 'lucide-react';
import { ETHICAL_COVENANT_PRINCIPLES } from '../../../data/trustData';

export const EthicalCovenantSection: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">Biocultural Epistemic Charter</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light font-serif text-[#F5F5F0]">
            The Atlas Sanctum Ethical Covenant & Commons Charter
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 max-w-3xl leading-relaxed">
            Technology is never neutral. It either concentrates extractive power or amplifies ecological harmony. Our charter codifies inviolable architectural red-lines and perpetual stewardship obligations to humanity and living ecosystems.
          </p>
        </div>
      </div>

      {/* 5 Core Principles Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase font-bold text-[#C5A059] tracking-wider">
          Foundational Covenant Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ETHICAL_COVENANT_PRINCIPLES.map((principle, idx) => (
            <div 
              key={principle.title}
              className="p-5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-3 hover:border-[#C5A059]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">Article 0{idx + 1} • {principle.pillar}</span>
                  <span className="px-2 py-0.5 bg-[#1B3022] text-emerald-300 border border-[#2D5A3C] text-[9px] font-mono rounded">
                    Perpetual Covenant
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#F5F5F0] font-mono">{principle.title}</h4>
                <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">{principle.mandate}</p>
              </div>

              <div className="pt-3 border-t border-[#F5F5F0]/10 space-y-2 text-xs">
                <div className="p-2.5 bg-amber-950/20 border border-amber-800/30 rounded">
                  <p className="text-[10px] font-mono uppercase text-amber-400 font-bold mb-0.5 flex items-center gap-1">
                    <HeartHandshake className="w-3 h-3" /> Ethical Commitment:
                  </p>
                  <p className="text-amber-200/80 font-mono text-[11px] leading-relaxed">{principle.ethicalCommitment}</p>
                </div>

                <div className="p-2.5 bg-emerald-950/20 border border-emerald-800/30 rounded">
                  <p className="text-[10px] font-mono uppercase text-emerald-400 font-bold mb-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Enforcement Mechanism:
                  </p>
                  <p className="text-emerald-200/80 font-mono text-[11px] leading-relaxed">{principle.enforcementMechanism}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Compute Footprint Guarantee */}
      <div className="p-5 bg-[#121212] border border-emerald-500/20 rounded-sm space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase font-bold">
          <Leaf className="w-4 h-4" />
          <span>Carbon-Negative Server & Compute Commitment</span>
        </div>
        <p className="text-xs text-[#F5F5F0]/80 leading-relaxed">
          100% of Atlas Sanctum edge instances and model processing compute runs on zero-emission hydroelectric and geothermal server facilities. Furthermore, for every 100 simulation queries executed on the platform, we allocate micro-grants directly to verified old-growth canopy preservation trusts.
        </p>
      </div>
    </div>
  );
};
