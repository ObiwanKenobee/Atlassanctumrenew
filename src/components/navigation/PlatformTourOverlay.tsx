import React, { useState, useEffect } from 'react';
import {
  Compass,
  Scale,
  Coins,
  BarChart3,
  GraduationCap,
  Terminal,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  CheckCircle2,
  Radio,
  ExternalLink,
  HelpCircle,
  Play
} from 'lucide-react';
import { PageView } from '../../types';
import { audioFeedback, hapticFeedback } from '../../lib/audioFeedback';

export interface TourStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  targetTab?: PageView;
  targetTabLabel?: string;
  badge: { text: string; color: string };
  highlights: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'observatory',
    title: 'Civilization Observatory & Sensory Mesh',
    subtitle: 'Ground-Truth Telemetry & Biophysical Ledgers',
    description: 'Explore live planetary sensor arrays, piezometer groundwater monitors, multispectral satellite biomass mappings, and the immutable Bioregional Ledger.',
    icon: Compass,
    targetTab: 'observatory',
    targetTabLabel: 'Explore Observatory',
    badge: { text: 'Real-time IoT', color: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40' },
    highlights: [
      'Over 4,200 verified hardware sensor placards across global catchments',
      'Immutable Merkle proofs & ZKP attestation on all stream data',
      'Dynamic systems causal models with Meadows leverage points'
    ]
  },
  {
    id: 'governance',
    title: 'Moral Governance & Priority Floors',
    subtitle: 'Constitutional Axioms & Autonomous Arbiter',
    description: 'Mathematical safety guardrails ensure that ecological drawdown, elder stewardship vetoes, and living wages are strictly enforced before capital deployment.',
    icon: Scale,
    targetTab: 'ethics-review',
    targetTabLabel: 'Inspect Priority Floors',
    badge: { text: 'Constitutional Axioms', color: 'border-amber-500/40 text-amber-300 bg-amber-950/40' },
    highlights: [
      '14 Universal Moral Dimensions synthesized across human wisdom traditions',
      'Non-negotiable Priority Floors preventing extractive financial capture',
      'Interactive Moral Simulator to test systemic edge cases'
    ]
  },
  {
    id: 'capital',
    title: 'Regenerative Capital & Bioregional OS',
    subtitle: 'Proof-of-Regeneration Payouts & Continuous Liquidity',
    description: 'Coordinate catalytic grants, outcome funds, and community land trusts. Capital unlocks in smart-contract tranches verified by satellite biomass increases.',
    icon: Coins,
    targetTab: 'capital-engine',
    targetTabLabel: 'View Capital Engine',
    badge: { text: '$380M Liquidity', color: 'border-gold text-[#C5A059] bg-[#1C170A]' },
    highlights: [
      'Continuous liquidity pools for watershed restoration projects',
      'Human-in-the-loop deliberation in The Decision Room',
      'Opportunity Matchmaker connecting capital with indigenous stewards'
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics Report & Resource Consumption',
    subtitle: 'Recharts Visualizations & Green Compute Footprint',
    description: 'Access empirical reports on global steward engagement, computational energy offsets, zero-knowledge proof generation, and biophysical water balances.',
    icon: BarChart3,
    targetTab: 'analytics-report',
    targetTabLabel: 'Open Analytics Report',
    badge: { text: 'Recharts Visualizer', color: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40' },
    highlights: [
      'Daily and weekly active steward trends and domain distributions',
      'Compute energy consumption balanced by dedicated on-site solar generation',
      'Exportable cryptographic audit snapshots and watershed rebalancing'
    ]
  },
  {
    id: 'academy',
    title: 'Civilization Academy & Open Commons',
    subtitle: 'Open CAD Blueprints & Agroecological Curricula',
    description: 'Access peer-reviewed curricula on regenerative engineering, download open-source CAD hardware schematics (biochar kilns, water pumps), and review research.',
    icon: GraduationCap,
    targetTab: 'commons',
    targetTabLabel: 'Browse Open Commons',
    badge: { text: 'GPL / CC-BY', color: 'border-purple-500/40 text-purple-300 bg-purple-950/40' },
    highlights: [
      '180+ open-hardware CAD schemas ready for local fabrication',
      'Field-tested curricula for soil carbon restoration & agroforestry',
      'Decentralized epistemic peer review network'
    ]
  },
  {
    id: 'command',
    title: 'Command Center & Epistemic Intelligence',
    subtitle: 'Instant Navigation, Gemini AI & Voice Dictation',
    description: 'Summon the global command center at any moment with ⌘K, engage with multi-capital Gemini architects, or dictate mission notes via browser voice-to-text.',
    icon: Terminal,
    targetTab: 'home',
    targetTabLabel: 'Enter Main Dashboard',
    badge: { text: '⌘K Global Hotkey', color: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40' },
    highlights: [
      'Fuzzy search across all 40+ views, sensors, missions, and axioms',
      'Voice-to-Text dictation with MediaRecorder inside Gemini Chat',
      'Offline-first synchronization with service worker resilience'
    ]
  }
];

interface PlatformTourOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: PageView) => void;
}

export const PlatformTourOverlay: React.FC<PlatformTourOverlayProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      audioFeedback.playViewTransition();
      hapticFeedback.triggerViewTransitionHaptic();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;
  const progressPercent = Math.round(((currentStepIndex + 1) / TOUR_STEPS.length) * 100);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      audioFeedback.playViewTransition();
      hapticFeedback.triggerViewTransitionHaptic();
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      audioFeedback.playViewTransition();
      hapticFeedback.triggerViewTransitionHaptic();
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleStepClick = (index: number) => {
    audioFeedback.playMicroTick();
    hapticFeedback.triggerLightClickHaptic();
    setCurrentStepIndex(index);
  };

  const handleComplete = () => {
    audioFeedback.playSuccess();
    hapticFeedback.triggerSuccessHaptic();
    try {
      localStorage.setItem('atlas_platform_tour_completed', 'true');
      if (dontShowAgain) {
        localStorage.setItem('atlas_platform_tour_dont_show', 'true');
      }
    } catch {
      // Ignore storage errors
    }
    onClose();
  };

  const handleJumpToView = () => {
    if (currentStep.targetTab) {
      audioFeedback.playSyncComplete();
      hapticFeedback.triggerSuccessHaptic();
      onSelectTab(currentStep.targetTab);
      handleComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Tour Dialog Card */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-modal-title"
        className="relative w-full max-w-2xl bg-[#090D0A] border-2 border-[#C5A059]/50 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col font-sans text-[#F5F5F0]"
      >
        {/* Top Progress Bar */}
        <div className="w-full bg-[#0F1711] h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-[#C5A059] to-amber-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#F5F5F0]/10 bg-[#0C120E]">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="tour-modal-title" className="font-serif font-bold text-white text-base sm:text-lg">
                  Platform Tour: Core Architecture
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
                  {currentStepIndex + 1} of {TOUR_STEPS.length}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Guided walkthrough of the Atlas Sanctum Civilization OS
              </p>
            </div>
          </div>

          <button
            onClick={handleComplete}
            aria-label="Skip and close platform tour"
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step-by-Step Progress Indicator Dots / Pills */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#080B09] border-b border-[#F5F5F0]/10 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {TOUR_STEPS.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(idx)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#18261C] text-emerald-300 border border-emerald-500/50 shadow-sm font-bold'
                      : isPast
                      ? 'bg-white/5 text-neutral-300 border border-white/10 hover:bg-white/10'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <span>{idx + 1}</span>
                  <span className="hidden sm:inline truncate max-w-[80px]">
                    {step.id}
                  </span>
                  {isPast && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          <span className="text-[10px] font-mono text-[#C5A059] font-bold shrink-0">
            {progressPercent}% Complete
          </span>
        </div>

        {/* Tour Step Content Area */}
        <div className="p-5 sm:p-6 space-y-4 flex-1">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-[#141F17] border border-[#C5A059]/40 text-[#C5A059] shrink-0 shadow-lg">
              <StepIcon className="w-7 h-7" />
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${currentStep.badge.color}`}>
                  {currentStep.badge.text}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {currentStep.subtitle}
                </span>
              </div>
              <h4 className="font-serif font-bold text-lg sm:text-xl text-white">
                {currentStep.title}
              </h4>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
            {currentStep.description}
          </p>

          {/* Key Architecture Highlights */}
          <div className="p-3.5 rounded-xl bg-[#0D130F] border border-white/10 space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold text-[#C5A059] block tracking-wider">
              Core Architectural Highlights:
            </span>
            <div className="space-y-1.5">
              {currentStep.highlights.map((highlight, hIdx) => (
                <div key={hIdx} className="flex items-start gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Navigate Button directly to this tour view */}
          {currentStep.targetTab && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#111913] border border-emerald-500/20 text-xs">
              <span className="text-neutral-400 text-[11px] font-mono">
                Want to jump straight into this module?
              </span>
              <button
                onClick={handleJumpToView}
                className="px-3 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{currentStep.targetTabLabel}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-[#0C120E] border-t border-[#F5F5F0]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Don't show again toggle */}
          <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-white/20 bg-black/40 text-[#C5A059] focus:ring-[#C5A059]"
            />
            <span className="text-[11px] font-mono">Don't show tour automatically on startup</span>
          </label>

          {/* Step Navigation Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="px-3.5 py-2 rounded-xl border border-white/15 text-neutral-300 hover:text-white hover:bg-white/5 text-xs font-mono disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#B38E46] text-black font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <span>{isLastStep ? 'Complete Tour & Enter Sanctum' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
