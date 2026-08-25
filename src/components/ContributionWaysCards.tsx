import React from 'react';
import { 
  Heart, 
  Wrench, 
  Handshake, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Globe2, 
  Coins, 
  Compass 
} from 'lucide-react';
import { ContributionPathway } from '../types';
import { audioFeedback } from '../lib/audioFeedback';

export interface ContributionWaysCardsProps {
  onSelectPathway: (pathway: ContributionPathway) => void;
  className?: string;
}

export const ContributionWaysCards: React.FC<ContributionWaysCardsProps> = ({
  onSelectPathway,
  className = ''
}) => {
  const cards = [
    {
      id: 'give' as ContributionPathway,
      title: 'GIVE',
      subtitle: 'Non-Extractive Financial Capital',
      description: 'Fuel verified physical milestones with direct, unencumbered funding. 100% of capital flows to ground guilds with zero speculative skimming.',
      audience: 'Individuals • Philanthropists • Grassroots Donors',
      icon: Heart,
      accentColor: '#C5A059',
      borderClass: 'border-[#C5A059]/40 hover:border-[#C5A059] hover:shadow-lg hover:shadow-[#C5A059]/10',
      badgeBg: 'bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/30',
      buttonBg: 'bg-[#C5A059] text-[#0A0A0A] hover:bg-[#D4B06A]',
      keyFeatures: [
        'One-time or monthly sustainer options',
        'Cryptographic escrow allocation receipt',
        'Direct tracking of every dollar deployed'
      ]
    },
    {
      id: 'build' as ContributionPathway,
      title: 'BUILD',
      subtitle: 'Skills, Labor & Ecological Agency',
      description: 'Contribute on-the-ground engineering, agroforestry, hydrological restoration, or software telemetry skills to active living labs.',
      audience: 'Engineers • Ecologists • Local Builders • Organizers',
      icon: Wrench,
      accentColor: '#10B981',
      borderClass: 'border-emerald-500/30 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10',
      badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      buttonBg: 'bg-emerald-600 text-white hover:bg-emerald-500',
      keyFeatures: [
        'Local guilds & remote technical squads',
        'Verified biophysical apprenticeship',
        'Direct co-ownership of mission tooling'
      ]
    },
    {
      id: 'partner' as ContributionPathway,
      title: 'PARTNER',
      subtitle: 'Institutional & Infrastructure Alliance',
      description: 'Integrate scientific research, municipal land access, sensor hardware, or distribution logistics into the regenerative mission mesh.',
      audience: 'NGOs • Universities • Municipalities • Research Labs',
      icon: Handshake,
      accentColor: '#06B6D4',
      borderClass: 'border-cyan-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10',
      badgeBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      buttonBg: 'bg-cyan-600 text-white hover:bg-cyan-500',
      keyFeatures: [
        'Open research & dataset sharing',
        'Equipment & laboratory verification',
        'Multi-stakeholder governance alignment'
      ]
    },
    {
      id: 'back' as ContributionPathway,
      title: 'BACK',
      subtitle: 'Outcome-Based Tranche Sponsorship',
      description: 'Provide catalytic capital, first-loss buffers, or milestone-contingent bonds that unlock funds strictly when verifiable ecological KPIs are achieved.',
      audience: 'Impact Funds • Family Offices • Catalytic Syndicates',
      icon: ShieldCheck,
      accentColor: '#A855F7',
      borderClass: 'border-purple-500/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10',
      badgeBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      buttonBg: 'bg-purple-600 text-white hover:bg-purple-500',
      keyFeatures: [
        'Milestone-locked smart contracts',
        'Audited by satellite & ground sensor mesh',
        'Revolving regenerative capital returns'
      ]
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ${className}`}>
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => {
              audioFeedback.playSubtleClick();
              onSelectPathway(card.id);
            }}
            className={`group relative p-6 bg-[#0D0D0D] border rounded-sm transition-all duration-300 flex flex-col justify-between cursor-pointer ${card.borderClass}`}
          >
            {/* Top Accent Icon & Badge */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div 
                  className="w-10 h-10 rounded-sm flex items-center justify-center border"
                  style={{ 
                    backgroundColor: `${card.accentColor}15`, 
                    borderColor: `${card.accentColor}40`,
                    color: card.accentColor 
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wider rounded-sm border ${card.badgeBg}`}>
                  {card.title}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-lg font-serif font-bold text-[#F5F5F0] group-hover:text-white transition-colors">
                  {card.title}
                </h3>
                <h4 
                  className="text-xs font-mono font-medium mt-0.5 tracking-tight"
                  style={{ color: card.accentColor }}
                >
                  {card.subtitle}
                </h4>
              </div>

              {/* Description */}
              <p className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed">
                {card.description}
              </p>

              {/* Feature Checklist */}
              <div className="pt-2 border-t border-[#F5F5F0]/10 space-y-1.5">
                {card.keyFeatures.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-[#F5F5F0]/80 font-sans">
                    <CheckCircle2 
                      className="w-3.5 h-3.5 shrink-0" 
                      style={{ color: card.accentColor }} 
                    />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Audience & Action Trigger */}
            <div className="pt-5 mt-4 border-t border-[#F5F5F0]/10 space-y-3">
              <div className="text-[10px] font-mono text-[#F5F5F0]/40 uppercase tracking-wider truncate">
                Ideal For: <span className="text-[#F5F5F0]/70 lowercase">{card.audience}</span>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 px-4 font-mono text-xs uppercase tracking-wider font-bold rounded-sm shadow-md transition-all flex items-center justify-center gap-2 ${card.buttonBg}`}
              >
                <span>Initiate {card.title}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
