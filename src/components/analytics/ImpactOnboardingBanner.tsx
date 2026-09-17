import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Compass, 
  Clock, 
  Grid, 
  Camera, 
  ShieldCheck, 
  X, 
  ChevronRight, 
  Activity, 
  Flame,
  HelpCircle,
  Eye
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

interface ImpactOnboardingBannerProps {
  onDismiss?: () => void;
  onExploreFeature?: (tab: string) => void;
  forceShow?: boolean;
}

export const ImpactOnboardingBanner: React.FC<ImpactOnboardingBannerProps> = ({
  onDismiss,
  onExploreFeature,
  forceShow = false
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (forceShow) return false;
    return localStorage.getItem('atlas_impact_onboarding_dismissed') === 'true';
  });
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    if (forceShow) {
      setIsDismissed(false);
    }
  }, [forceShow]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('atlas_impact_onboarding_dismissed', 'true');
    audioFeedback.playMicroTick();
    if (onDismiss) {
      onDismiss();
    }
  };

  if (isDismissed && !forceShow) {
    return null;
  }

  const tourFeatures = [
    {
      title: '5-Layer Epistemic Matrix',
      desc: 'Ground truth reality precedes model. Telemetry feeds from satellite constellations and calibrated edge piezometers are anchored by SHA-256 Merkle proofs.',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      actionTab: 'flourishing-vs-stability',
      actionLabel: 'View Trend Matrix'
    },
    {
      title: 'Spatial Density Heatmap',
      desc: 'Toggle between canopy NDVI, soil carbon saturation, water table recharge, and active stewardship patrol density across geographic coordinates.',
      icon: Layers,
      color: 'text-cyan-400',
      actionTab: 'bioregional-map',
      actionLabel: 'Explore Heatmap'
    },
    {
      title: 'Regenerative Drift Monitor',
      desc: 'Continuous anomaly watchdog that alerts stewards when actual bioregional performance diverges from planned sustainability targets.',
      icon: Flame,
      color: 'text-amber-400',
      actionTab: 'flourishing-vs-stability',
      actionLabel: 'Inspect Drift'
    },
    {
      title: 'Temporal Slider',
      desc: 'Scrub across 12-month historical milestones through 12-month Gemini predictive horizons to examine decoupling velocity over time.',
      icon: Clock,
      color: 'text-purple-400',
      actionTab: 'flourishing-vs-stability',
      actionLabel: 'Launch Timeline'
    },
    {
      title: 'Custom Drag-and-Drop Workspace',
      desc: 'Reorder and resize metric widgets to craft a bespoke analytical dashboard tailored to your bioregional stewardship quorum.',
      icon: Grid,
      color: 'text-[#C5A059]',
      actionTab: 'flourishing-vs-stability',
      actionLabel: 'Customize Grid'
    }
  ];

  return (
    <div 
      id="impact-dashboard-onboarding-banner"
      className="relative overflow-hidden rounded-md border border-[#C5A059]/40 bg-gradient-to-br from-[#121614] via-[#0E1210] to-[#171A15] p-5 sm:p-6 shadow-2xl transition-all animate-in fade-in duration-300"
    >
      {/* Subtle decorative background glow */}
      <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#C5A059]/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Dismiss Button */}
      <button
        id="dismiss-onboarding-banner-btn"
        type="button"
        onClick={handleDismiss}
        className="absolute right-3.5 top-3.5 text-[#F5F5F0]/40 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
        title="Dismiss onboarding banner"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pr-8 pb-4 border-b border-[#F5F5F0]/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                WELCOME STEWARD • SYSTEM ARCHITECTURE GUIDE
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold">
                EPISTEMIC OS ACTIVE
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-serif text-[#F5F5F0] font-bold">
              Atlas Sanctum Epistemic Telemetry &amp; Impact Intelligence
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-mono">
          <span className="text-[#F5F5F0]/50 text-[11px]">Commandment IX:</span>
          <span className="text-[#C5A059] font-semibold">Evidence Constitution</span>
        </div>
      </div>

      {/* Narrative & Core Purpose */}
      <p className="text-xs sm:text-sm text-[#F5F5F0]/70 font-sans leading-relaxed pt-3 pb-4 max-w-4xl">
        This telemetry console tracks <strong>absolute civilizational decoupling</strong>—measuring real human and ecological flourishing while monitoring the continuous reduction of extractive material throughput. Every chart point is cryptographically anchored to its verifiable physical sensor origin.
      </p>

      {/* Interactive Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1 pb-4">
        {tourFeatures.map((feat, idx) => {
          const Icon = feat.icon;
          const isCurrent = activeStep === idx;
          return (
            <div
              key={feat.title}
              onClick={() => {
                setActiveStep(idx);
                audioFeedback.playMicroTick();
              }}
              className={`p-3 rounded-sm border transition-all cursor-pointer text-left flex flex-col justify-between ${
                isCurrent 
                  ? 'bg-[#18201B] border-[#C5A059] ring-1 ring-[#C5A059]/40 shadow-md'
                  : 'bg-[#0E1310] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/25 hover:bg-[#131A15]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2">
                  <Icon className={`w-4 h-4 ${feat.color}`} />
                  <span className="text-[9px] font-mono text-[#F5F5F0]/40">0{idx + 1}</span>
                </div>
                <h4 className="text-xs font-mono font-bold text-[#F5F5F0] pb-1">
                  {feat.title}
                </h4>
                <p className="text-[11px] text-[#F5F5F0]/60 font-sans line-clamp-3">
                  {feat.desc}
                </p>
              </div>

              {onExploreFeature && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    audioFeedback.playSubtleClick();
                    onExploreFeature(feat.actionTab);
                  }}
                  className="mt-3 text-[10px] font-mono text-[#C5A059] hover:text-white flex items-center gap-1 font-bold pt-1 border-t border-[#F5F5F0]/10"
                >
                  <span>{feat.actionLabel}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#F5F5F0]/10">
        <div className="flex items-center gap-2 text-xs font-mono text-[#F5F5F0]/60">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active Quorum: <strong>1,248 Verified Sensors</strong> across 8 Bioregions</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="onboarding-got-it-btn"
            type="button"
            onClick={handleDismiss}
            className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#d4b068] text-black rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            Got It • Proceed to Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
