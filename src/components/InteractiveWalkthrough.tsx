import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  Bot,
  Cpu,
  Layers,
  Search,
  Activity,
  Bell,
  Sun,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { PageView } from '../types';
import { audioFeedback } from '../lib/audioFeedback';

export interface WalkthroughStep {
  id: string;
  targetSelector: string;
  fallbackPosition?: 'center';
  targetTab?: PageView;
  badge: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 'welcome',
    targetSelector: '#nav-brand-logo',
    targetTab: 'home',
    badge: 'Civilization OS',
    title: 'Welcome to Atlas Sanctum',
    description: 'Atlas Sanctum is a planetary regenerative intelligence platform designed for ecological coordination, ethical AI governance, and human flourishing.',
    icon: Compass,
    hint: 'Click next or use arrow keys to navigate the walkthrough'
  },
  {
    id: 'agent-mission-control',
    targetSelector: '#nav-agent-mission-control',
    targetTab: 'agent-mission-control',
    badge: 'Agentic AI Fleet',
    title: 'Autonomous Agent Fleet',
    description: 'Deploy, supervise, and coordinate swarms of verified autonomous agents executing real-world ecological restoration, watershed stewardship, and decentralized governance.',
    icon: Bot,
    hint: 'Explore active agents and verifiable cryptographic proofs'
  },
  {
    id: 'ai-engineering',
    targetSelector: '#nav-ai-engineering',
    targetTab: 'ai-engineering',
    badge: 'Gemini Multimodal Studio',
    title: 'AI Engineering Workbench',
    description: 'Access state-of-the-art multimodal Gemini reasoning engines, epistemic verification tools, and structural causal modeling pipelines.',
    icon: Cpu,
    hint: 'Powering counterfactual simulations and system dynamics'
  },
  {
    id: 'bioregional-twin',
    targetSelector: '#nav-observatory-mega',
    targetTab: 'bioregional-twin',
    badge: 'Causal Bioregional Twin',
    title: 'Bioregional Indicators & Twin',
    description: 'Simulate ecological restoration using counterfactual Do-Calculus and track real-time longitudinal progress charts across canopy, soil, and aquifer health.',
    icon: Layers,
    hint: 'Navigate to Bioregional Twin to view the new Recharts indicator telemetry'
  },
  {
    id: 'command-center',
    targetSelector: '#open-command-center-btn',
    badge: '⌘K Neural Search',
    title: 'Unified Command Center',
    description: 'Access the global epistemic neural query bar with ⌘K. Query planetary telemetry, locate field initiatives, and trigger system-wide interventions.',
    icon: Search,
    hint: 'Press ⌘K anywhere in the platform to launch'
  },
  {
    id: 'live-voice',
    targetSelector: '#open-live-voice-btn',
    badge: 'Microphone & Voice AI',
    title: 'Live Voice AI & Voice Commands',
    description: 'Converse directly using real-time bidirectional audio. Issue voice commands with your browser microphone to trigger instant command center search.',
    icon: Activity,
    hint: 'Allows hands-free search and field telemetry retrieval'
  },
  {
    id: 'mission-alerts',
    targetSelector: '#mission-alert-bell-btn',
    badge: 'Merkle DAG & Alerts',
    title: 'Verified Mission Alerts',
    description: 'Receive real-time mission updates, ecological boundary breach alerts, and cryptographically verified in-situ sensor proofs from across all bioregions.',
    icon: Bell,
    hint: 'Never miss empirical field milestones and audits'
  },
  {
    id: 'theme-toggle',
    targetSelector: '#theme-toggle-btn',
    badge: 'Accessibility & Display',
    title: 'Adaptive Theme Modes',
    description: 'Switch between Dark, Light, and High-Contrast display modes. Your preference is persisted to localStorage for consistent visual comfort across sessions.',
    icon: Sun,
    hint: 'Optimized for diverse lighting and field environments'
  }
];

const STORAGE_KEY = 'atlas_walkthrough_completed';

interface InteractiveWalkthroughProps {
  onSelectTab?: (tab: PageView) => void;
  onOpenCommandCenter?: () => void;
}

export const InteractiveWalkthrough: React.FC<InteractiveWalkthroughProps> = ({
  onSelectTab,
  onOpenCommandCenter
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipCoords, setTooltipCoords] = useState<{ top: number; left: number; position: 'top' | 'bottom' | 'center' }>({
    top: 100,
    left: 100,
    position: 'bottom'
  });

  const activeStep = WALKTHROUGH_STEPS[currentStepIndex];

  // Trigger on first load or on custom event
  useEffect(() => {
    const hasCompleted = localStorage.getItem(STORAGE_KEY);
    if (!hasCompleted) {
      // Gentle initial delay to allow interface components to mount
      const timer = setTimeout(() => {
        setIsActive(true);
        setCurrentStepIndex(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for manual trigger events to restart the walkthrough anytime
  useEffect(() => {
    const handleStartTour = () => {
      audioFeedback.playSubtleClick();
      setCurrentStepIndex(0);
      setIsActive(true);
    };

    window.addEventListener('start-interactive-walkthrough', handleStartTour);
    return () => window.removeEventListener('start-interactive-walkthrough', handleStartTour);
  }, []);

  // Update spotlight target bounds and calculate tooltip position
  const updateTargetBounds = useCallback(() => {
    if (!isActive || !activeStep) return;

    const el = document.querySelector(activeStep.targetSelector);
    if (el) {
      // Scroll element into view smoothly if partially obscured
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);

      // Calculate smart position for tooltip (top or bottom based on available viewport space)
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const tooltipWidth = Math.min(380, viewportWidth - 32);
      const tooltipHeight = 220;

      let top = rect.bottom + 14;
      let position: 'top' | 'bottom' | 'center' = 'bottom';

      if (top + tooltipHeight > viewportHeight && rect.top > tooltipHeight + 14) {
        top = rect.top - tooltipHeight - 14;
        position = 'top';
      }

      // Center horizontally relative to target, clamped to viewport margins
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      if (left < 16) left = 16;
      if (left + tooltipWidth > viewportWidth - 16) {
        left = viewportWidth - tooltipWidth - 16;
      }

      setTooltipCoords({ top, left, position });
    } else {
      // Fallback: center in viewport if element is not in DOM (e.g. mobile hidden)
      setTargetRect(null);
      setTooltipCoords({
        top: window.innerHeight / 2 - 110,
        left: window.innerWidth / 2 - Math.min(380, window.innerWidth - 32) / 2,
        position: 'center'
      });
    }
  }, [isActive, activeStep]);

  useEffect(() => {
    updateTargetBounds();

    const handleResize = () => updateTargetBounds();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [updateTargetBounds]);

  // Handle keyboard navigation (Arrow keys, Escape)
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, currentStepIndex]);

  const handleNext = () => {
    audioFeedback.playSubtleClick();
    if (currentStepIndex < WALKTHROUGH_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);

      // If step targets a specific view, navigate user there for rich contextual orientation
      const nextStep = WALKTHROUGH_STEPS[nextIdx];
      if (nextStep.targetTab && onSelectTab) {
        onSelectTab(nextStep.targetTab);
      }
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    audioFeedback.playSubtleClick();
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);

      const prevStep = WALKTHROUGH_STEPS[prevIdx];
      if (prevStep.targetTab && onSelectTab) {
        onSelectTab(prevStep.targetTab);
      }
    }
  };

  const handleComplete = () => {
    audioFeedback.playSyncComplete();
    setIsActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleDismiss = () => {
    audioFeedback.playSubtleClick();
    setIsActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!isActive || !activeStep) return null;

  const StepIcon = activeStep.icon;
  const isLastStep = currentStepIndex === WALKTHROUGH_STEPS.length - 1;
  const isFirstStep = currentStepIndex === 0;

  return (
    <div 
      id="atlas-interactive-walkthrough" 
      className="fixed inset-0 z-55 pointer-events-auto select-none"
    >
      {/* Semi-transparent Backdrop Overlay */}
      <div 
        onClick={handleDismiss}
        className="fixed inset-0 bg-black/75 backdrop-blur-[2px] transition-opacity duration-300 cursor-pointer"
        title="Click anywhere outside to dismiss walkthrough"
      />

      {/* Target Element Spotlight Focus Ring */}
      {targetRect && (
        <div
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
          className="fixed rounded-sm pointer-events-none transition-all duration-300 border-2 border-[#C5A059] shadow-[0_0_24px_rgba(197,160,89,0.7)] z-56"
        >
          {/* Pulsing indicator ring */}
          <div className="absolute -inset-1 rounded-sm border border-emerald-400/50 animate-ping pointer-events-none" />
        </div>
      )}

      {/* Floating Interactive Step Tooltip Card */}
      <div
        style={{
          top: tooltipCoords.top,
          left: tooltipCoords.left,
          maxWidth: '380px',
          width: 'calc(100vw - 32px)',
        }}
        className="fixed z-57 bg-[#0D0D0D] border border-[#C5A059] rounded-sm p-4 sm:p-5 shadow-[0_16px_48px_rgba(0,0,0,0.95)] text-[#F5F5F0] transition-all duration-300 animate-in fade-in zoom-in-95 font-sans"
      >
        {/* Tooltip Header */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F5F5F0]/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
              <StepIcon className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase bg-[#1B3022] text-[#C5A059] px-2 py-0.5 rounded-full border border-[#C5A059]/30 font-bold">
                {activeStep.badge}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#F5F5F0]/50">
              {currentStepIndex + 1} / {WALKTHROUGH_STEPS.length}
            </span>
            <button
              onClick={handleDismiss}
              aria-label="Skip Walkthrough"
              title="Skip Walkthrough"
              className="p-1 hover:bg-[#F5F5F0]/10 text-[#F5F5F0]/50 hover:text-[#F5F5F0] rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tooltip Body */}
        <div className="py-3.5 space-y-2">
          <h3 className="text-sm font-serif font-bold text-[#F5F5F0] tracking-wide">
            {activeStep.title}
          </h3>
          <p className="text-xs text-[#F5F5F0]/80 leading-relaxed">
            {activeStep.description}
          </p>
          {activeStep.hint && (
            <p className="text-[10px] text-[#C5A059] font-mono pt-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>{activeStep.hint}</span>
            </p>
          )}
        </div>

        {/* Step Progress Indicators & Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#F5F5F0]/10">
          {/* Progress dots */}
          <div className="flex items-center gap-1">
            {WALKTHROUGH_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setCurrentStepIndex(idx);
                  if (step.targetTab && onSelectTab) {
                    onSelectTab(step.targetTab);
                  }
                }}
                aria-label={`Jump to step ${idx + 1}: ${step.title}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'w-4 bg-[#C5A059]'
                    : idx < currentStepIndex
                    ? 'w-2 bg-emerald-400/70'
                    : 'w-2 bg-[#F5F5F0]/20 hover:bg-[#F5F5F0]/40'
                }`}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="px-2.5 py-1 text-xs font-mono rounded bg-[#141414] hover:bg-[#1C1C1C] text-[#F5F5F0]/70 hover:text-[#F5F5F0] border border-[#F5F5F0]/10 flex items-center gap-1 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider font-bold rounded flex items-center gap-1 transition-all shadow-md cursor-pointer ${
                isLastStep
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-[#C5A059] hover:bg-[#b08e4c] text-black'
              }`}
            >
              <span>{isLastStep ? 'Finish Tour' : 'Next'}</span>
              {isLastStep ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
