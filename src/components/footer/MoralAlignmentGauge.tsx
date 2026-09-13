import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  XCircle,
  HelpCircle
} from 'lucide-react';
import { COVENANT_AUDITS } from '../../data/aiEnginesData';
import { PageView } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface MoralAlignmentGaugeProps {
  onSelectTab: (tab: PageView) => void;
}

export const MoralAlignmentGauge: React.FC<MoralAlignmentGaugeProps> = ({ onSelectTab }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [filterMode, setFilterMode] = useState<'ratified' | 'all'>('ratified');

  // Compute aggregated real-time ethical score directly from MoralArbiterView dossiers
  const metrics = useMemo(() => {
    const dossiers = COVENANT_AUDITS;
    const targetAudits = filterMode === 'ratified' 
      ? dossiers.filter(d => d.status !== 'Blocked (Moral Veto)')
      : dossiers;

    const count = targetAudits.length;
    if (count === 0) return { overall: 0, autonomy: 0, ecological: 0, equity: 0, antiUsury: 0 };

    const sumOverall = targetAudits.reduce((acc, d) => acc + d.dignityScorecard.overallDignityScore, 0);
    const sumAutonomy = targetAudits.reduce((acc, d) => acc + d.dignityScorecard.humanAutonomy, 0);
    const sumEcological = targetAudits.reduce((acc, d) => acc + d.dignityScorecard.ecologicalRegeneration, 0);
    const sumEquity = targetAudits.reduce((acc, d) => acc + d.dignityScorecard.intergenerationalEquity, 0);
    const sumAntiUsury = targetAudits.reduce((acc, d) => acc + d.dignityScorecard.antiUsuryCompliance, 0);

    return {
      overall: Number((sumOverall / count).toFixed(1)),
      autonomy: Math.round(sumAutonomy / count),
      ecological: Math.round(sumEcological / count),
      equity: Math.round(sumEquity / count),
      antiUsury: Math.round(sumAntiUsury / count),
      blockedCount: dossiers.filter(d => d.status === 'Blocked (Moral Veto)').length,
      approvedCount: dossiers.filter(d => d.status === 'Approved').length,
      remediationCount: dossiers.filter(d => d.status === 'Remediation Required').length
    };
  }, [filterMode]);

  // Radial SVG calculation
  const radius = 34;
  const strokeWidth = 5.5;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree gauge arc for authentic precision instrument aesthetics
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (metrics.overall / 100) * arcLength;

  const getScoreTheme = (score: number) => {
    if (score >= 90) {
      return {
        color: '#C5A059',
        strokeColor: '#C5A059',
        label: 'Constitutional Congruence',
        sublabel: 'Optimal Dignity Parity',
        badgeBg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
      };
    }
    if (score >= 70) {
      return {
        color: '#EAB308',
        strokeColor: '#EAB308',
        label: 'Remediation Mandated',
        sublabel: 'Ethical Conditions Pending',
        badgeBg: 'bg-amber-950/60 text-amber-300 border-amber-500/40'
      };
    }
    return {
      color: '#EF4444',
      strokeColor: '#EF4444',
      label: 'Moral Veto Enacted',
      sublabel: 'Predatory Risks Detected',
      badgeBg: 'bg-rose-950/60 text-rose-300 border-rose-500/40'
    };
  };

  const theme = getScoreTheme(metrics.overall);

  const handleNavigateToMoralArbiter = () => {
    audioFeedback.playSubtleClick();
    onSelectTab('moral-arbiter');
  };

  return (
    <div 
      id="footer-moral-alignment-gauge-container"
      className="p-4 sm:p-5 rounded-sm bg-[#0E1210] border border-[#C5A059]/30 relative transition-all duration-300 hover:border-[#C5A059]/60"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        {/* Left: Radial Gauge Instrument */}
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            {/* Background glow */}
            <div 
              className="absolute inset-0 rounded-full blur-md opacity-25"
              style={{ backgroundColor: theme.strokeColor }}
            />

            <svg className="w-24 h-24 transform -rotate-135" viewBox="0 0 88 88">
              {/* Background Track */}
              <circle
                cx="44"
                cy="44"
                r={radius}
                fill="none"
                stroke="#202622"
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeLinecap="round"
              />
              {/* Animated Value Arc */}
              <circle
                cx="44"
                cy="44"
                r={radius}
                fill="none"
                stroke={theme.strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.8s ease-in-out',
                  filter: 'drop-shadow(0 0 4px rgba(197, 160, 89, 0.4))'
                }}
              />
            </svg>

            {/* Centered Score Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="text-base sm:text-lg font-mono font-bold text-white tracking-tight leading-none">
                {metrics.overall}%
              </span>
              <span className="text-[8px] font-mono uppercase text-[#C5A059] font-semibold mt-0.5">
                ETHICAL
              </span>
            </div>
          </div>

          {/* Description & Status */}
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                MORAL ALIGNMENT GAUGE
              </span>
            </div>

            <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
              {theme.label}
            </h4>

            <p className="text-[11px] text-[#F5F5F0]/70 font-sans max-w-xs leading-relaxed">
              Real-time aggregated dignity score across all audited covenants in the Constitutional Moral Arbiter.
            </p>

            {/* Sub-pill badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[9px]">
              <span className="text-neutral-400">
                Ratified: <strong className="text-emerald-400">{metrics.approvedCount}</strong>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-400">
                Remediation: <strong className="text-amber-300">{metrics.remediationCount}</strong>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-400">
                Vetoed: <strong className="text-rose-400">{metrics.blockedCount}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Sub-pillar Scores & Deep-Dive Trigger */}
        <div className="flex flex-col sm:items-end justify-between self-stretch gap-2 font-mono">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-right">
            <div>
              <span className="text-neutral-500 mr-1.5">Autonomy:</span>
              <span className="text-neutral-200 font-bold">{metrics.autonomy}%</span>
            </div>
            <div>
              <span className="text-neutral-500 mr-1.5">Ecology:</span>
              <span className="text-neutral-200 font-bold">{metrics.ecological}%</span>
            </div>
            <div>
              <span className="text-neutral-500 mr-1.5">Equity:</span>
              <span className="text-neutral-200 font-bold">{metrics.equity}%</span>
            </div>
            <div>
              <span className="text-neutral-500 mr-1.5">Anti-Usury:</span>
              <span className="text-neutral-200 font-bold">{metrics.antiUsury}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setFilterMode(filterMode === 'ratified' ? 'all' : 'ratified');
              }}
              title={filterMode === 'ratified' ? 'Viewing Ratified & Remediated Covenants' : 'Viewing All Dossiers (including Vetoed)'}
              className="text-[9px] font-mono px-2 py-1 rounded bg-black/40 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Mode: {filterMode === 'ratified' ? 'Ratified (Active)' : 'Unfiltered Dossiers'}
            </button>

            <button
              onClick={handleNavigateToMoralArbiter}
              id="footer-inspect-moral-arbiter-btn"
              className="px-2.5 py-1 rounded bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
            >
              <span>Inspect Arbiter</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
