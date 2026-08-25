import React, { useState, useRef } from 'react';
import { 
  Heart, 
  Wrench, 
  Handshake, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Layers, 
  Send, 
  FileText, 
  X, 
  Lock, 
  Globe2, 
  TreeDeciduous, 
  Droplets, 
  Zap, 
  Compass, 
  Check, 
  CreditCard, 
  ChevronRight,
  ExternalLink,
  Info,
  Shield,
  Activity
} from 'lucide-react';
import { FEATURED_MISSION_DATA, ALL_FEATURED_MISSIONS } from '../../data/featuredMissionData';
import { FeaturedMission, MissionMilestone, ContributionPathway } from '../../types';
import { RealityCheck } from '../RealityCheck';
import { MissionStatusWidget } from '../MissionStatusWidget';
import { MissionTimeline } from '../MissionTimeline';
import { ContributionWaysCards } from '../ContributionWaysCards';
import { ContributionModal, ContributionModalType } from '../forms/ContributionModal';
import { TransparencyMetric } from '../TransparencyMetric';
import { audioFeedback } from '../../lib/audioFeedback';

interface RegenerativeMissionViewProps {
  onSelectTab?: (tab: any) => void;
  onOpenProvenance?: (prov: any) => void;
}

export const RegenerativeMissionView: React.FC<RegenerativeMissionViewProps> = ({
  onSelectTab,
  onOpenProvenance
}) => {
  const [mission, setMission] = useState<FeaturedMission>(FEATURED_MISSION_DATA);
  const [activeModalType, setActiveModalType] = useState<ContributionModalType | null>(null);

  // Section references for smooth scrolling
  const whySectionRef = useRef<HTMLDivElement>(null);
  const missionSectionRef = useRef<HTMLDivElement>(null);
  const waysSectionRef = useRef<HTMLDivElement>(null);
  const proofSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectMission = (missionId: string) => {
    const found = ALL_FEATURED_MISSIONS.find(m => m.id === missionId);
    if (found) {
      setMission(found);
      audioFeedback.playSubtleClick();
    }
  };

  const handleOpenContribution = (pathway: ContributionPathway | 'start-mission') => {
    setActiveModalType(pathway as ContributionModalType);
    audioFeedback.playSubtleClick();
  };

  const handleContributionSuccess = (type: ContributionModalType, data: any) => {
    if (type === 'give') {
      const amount = data.amount || 50;
      setMission(prev => ({
        ...prev,
        fundingCurrent: prev.fundingCurrent + amount,
        progressPercentage: Math.min(100, Math.round(((prev.fundingCurrent + amount) / prev.fundingTarget) * 100)),
        peopleInvolved: prev.peopleInvolved + 1,
        transparencyMetrics: {
          ...prev.transparencyMetrics,
          fundsReceived: `$${(prev.fundingCurrent + amount).toLocaleString()}`,
          peopleEngaged: prev.transparencyMetrics.peopleEngaged + 1
        }
      }));
    } else if (type === 'build') {
      setMission(prev => ({
        ...prev,
        peopleInvolved: prev.peopleInvolved + 1,
        transparencyMetrics: {
          ...prev.transparencyMetrics,
          peopleEngaged: prev.transparencyMetrics.peopleEngaged + 1
        }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] font-sans selection:bg-[#C5A059] selection:text-black">
      {/* 1. SUB-NAVIGATION BAR */}
      <nav className="sticky top-16 z-30 w-full bg-[#0E0E0E]/90 backdrop-blur-md border-b border-[#F5F5F0]/10 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
          <span className="font-serif font-bold text-base tracking-wider text-[#F5F5F0]">ATLAS</span>
          <span className="text-xs font-mono text-[#C5A059] uppercase tracking-widest hidden sm:inline">• REGENERATIVE MISSION PLATFORM</span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
          <button 
            onClick={() => scrollToSection(missionSectionRef)}
            className="text-[#F5F5F0]/70 hover:text-white transition-colors"
          >
            Mission
          </button>
          <button 
            onClick={() => scrollToSection(whySectionRef)}
            className="text-[#F5F5F0]/70 hover:text-white transition-colors"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection(waysSectionRef)}
            className="text-[#F5F5F0]/70 hover:text-white transition-colors"
          >
            Contribute
          </button>
          <button 
            onClick={() => scrollToSection(proofSectionRef)}
            className="text-[#F5F5F0]/70 hover:text-white transition-colors"
          >
            Proof & Audit
          </button>
          <button 
            onClick={() => handleOpenContribution('give')}
            className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold uppercase tracking-widest rounded-sm transition-all shadow"
          >
            Participate
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#F5F5F0]/10 px-4 sm:px-8 py-16 sm:py-24 max-w-7xl mx-auto">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] border border-[#C5A059]/30 rounded-full text-xs font-mono text-[#C5A059]">
              <TreeDeciduous className="w-3.5 h-3.5 text-emerald-400" />
              <span>TRANSFORMING ATTENTION INTO REGENERATIVE ACTION</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#F5F5F0] leading-[1.08] tracking-tight">
              Build What <br />
              <span className="text-[#C5A059] italic font-serif">Regenerates.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#F5F5F0]/75 max-w-xl font-sans leading-relaxed">
              Atlas connects people, non-extractive capital, and physical guilds around real-world biophysical missions that restore living ecologies and community dignity.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono">
              <button
                onClick={() => {
                  scrollToSection(waysSectionRef);
                  audioFeedback.playMicroTick();
                }}
                className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold uppercase text-xs tracking-widest rounded-sm transition-all shadow-lg flex items-center gap-2"
              >
                <span>Participate</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  scrollToSection(missionSectionRef);
                  audioFeedback.playMicroTick();
                }}
                className="px-6 py-3.5 bg-[#141414] hover:bg-[#1C1C1C] border border-[#F5F5F0]/20 text-[#F5F5F0] text-xs uppercase tracking-widest rounded-sm transition-all flex items-center gap-2"
              >
                <span>Explore Active Mission</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-8 border-t border-[#F5F5F0]/10 grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Model</span>
                <span className="text-[#F5F5F0] font-bold">Participatory</span>
              </div>
              <div>
                <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Verification</span>
                <span className="text-emerald-400 font-bold">100% Auditable</span>
              </div>
              <div>
                <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Pathway</span>
                <span className="text-[#8FB8DE] font-bold">5 Action Modes</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Living World Composition */}
          <div className="lg:col-span-5 relative">
            <div className="p-6 bg-[#0E1310] border border-[#C5A059]/30 rounded-sm space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3 font-mono text-xs">
                <span className="text-[#C5A059] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-emerald-400" />
                  <span>Living Bioregional Systems</span>
                </span>
                <span className="text-emerald-400 font-bold">Live Mesh</span>
              </div>

              {/* System Layers Grid */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#131A15] border border-emerald-500/20 rounded-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Droplets className="w-4 h-4 text-sky-400" />
                    <span>Hydrology & Riparian Corridors</span>
                  </div>
                  <span className="text-[10px] text-[#F5F5F0]/50">Bio-swale filtration</span>
                </div>

                <div className="p-3 bg-[#181814] border border-[#C5A059]/20 rounded-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#C5A059]">
                    <TreeDeciduous className="w-4 h-4 text-emerald-400" />
                    <span>Regenerative Agroforestry</span>
                  </div>
                  <span className="text-[10px] text-[#F5F5F0]/50">Soil Organic Carbon</span>
                </div>

                <div className="p-3 bg-[#13171B] border border-sky-500/20 rounded-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sky-300">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Decentralized Micro-Grids</span>
                  </div>
                  <span className="text-[10px] text-[#F5F5F0]/50">Solar Aquifer Pumps</span>
                </div>

                <div className="p-3 bg-[#1A141A] border border-purple-500/20 rounded-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>Youth Ecological Guilds</span>
                  </div>
                  <span className="text-[10px] text-[#F5F5F0]/50">Non-Extractive Capital</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] font-mono text-[#F5F5F0]/60 italic">
                "Regeneration + Infrastructure + Human Agency + Technology."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY ATLAS SECTION (The Participatory Thesis) */}
      <section ref={whySectionRef} className="px-4 sm:px-8 py-20 max-w-7xl mx-auto border-b border-[#F5F5F0]/10">
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
            THE PARTICIPATORY THESIS
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0] leading-snug">
            The world’s problems do not need another audience. <br className="hidden sm:inline" />
            <span className="text-[#C5A059]">They need participants.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#F5F5F0]/70 font-sans leading-relaxed">
            Many people want to contribute but encounter fragmented systems. Atlas bridges the gap between passive spectators and coordinated, ground-verified regenerative action.
          </p>
        </div>

        {/* Fragmented vs Atlas Pathway Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
          {/* Left: The Fragmented Breakdown */}
          <div className="p-6 bg-[#0E0E0E] border border-red-500/20 rounded-sm space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>Fragmented Legacy Systems</span>
            </div>
            <ul className="space-y-3 font-sans text-xs text-[#F5F5F0]/70">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-mono font-bold">•</span>
                <span><strong>Donate without seeing outcomes</strong> — funds vanish into administrative opacity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-mono font-bold">•</span>
                <span><strong>Volunteer without knowing where skills matter</strong> — misallocated human agency.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-mono font-bold">•</span>
                <span><strong>Invest without understanding real-world impact</strong> — speculative greenwashing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-mono font-bold">•</span>
                <span><strong>Work on isolated projects without coordination</strong> — duplication of effort.</span>
              </li>
            </ul>
          </div>

          {/* Right: The Atlas Integrated Pathway */}
          <div className="p-6 bg-[#0E1511] border border-emerald-500/30 rounded-sm space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>The Atlas Integrated Pathway</span>
            </div>
            <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
              Atlas creates a seamless, verifiable bridge connecting:
            </p>
            
            {/* Horizontal Flow Pipeline */}
            <div className="p-4 bg-[#121E16] rounded-xs border border-emerald-500/20 font-mono text-xs flex flex-wrap items-center justify-between gap-2 text-emerald-200">
              <span className="font-bold">Need</span>
              <span className="text-[#C5A059]">➔</span>
              <span className="font-bold">People</span>
              <span className="text-[#C5A059]">➔</span>
              <span className="font-bold">Resources</span>
              <span className="text-[#C5A059]">➔</span>
              <span className="font-bold">Action</span>
              <span className="text-[#C5A059]">➔</span>
              <span className="font-bold text-white bg-emerald-700/60 px-2 py-0.5 rounded-xs">Outcome</span>
            </div>
            
            <p className="text-[11px] font-mono text-emerald-300/70">
              Every contribution is bound to explicit milestones and audited biophysical evidence.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURED MISSION STATUS WIDGET (Modular, Swappable Component) */}
      <section ref={missionSectionRef} className="px-4 sm:px-8 py-20 max-w-7xl mx-auto border-b border-[#F5F5F0]/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              FEATURED ACTIVE REGENERATIVE MISSION
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Live Biophysical Execution</h2>
          </div>
        </div>

        {/* Embedded Reality Check for Epistemic Rigor */}
        <RealityCheck
          data={{
            status: 'verified',
            confidenceScore: 98,
            uncertaintyMargin: '± 2.4%',
            epistemicTier: 'Ground Truth Telemetry',
            realityVsModelWarning: 'Turbidity and dissolved oxygen sensors calibrated against dry-season laboratory benchmarks. All non-administrative capital locked in multi-sig milestone escrow until field audit sign-off.',
            sensorHealth: 99,
            dataOrigin: 'Sentinel-2 Multispectral + YSI ProDSS Turbidity Telemetry Mesh',
            cryptographicHash: '0x9918bc2018ea1947201bc917281901abcf89',
            lastVerified: '14 minutes ago',
            verifiedBy: mission.leadStewards[0],
            assumptions: [
              'Turbidity to suspended solids correlation calibrated against dry-season laboratory benchmarks',
              'All non-administrative capital locked in multi-sig milestone escrow until field audit sign-off'
            ]
          }}
          className="mb-2"
        />

        {/* The Reusable MissionStatusWidget Component */}
        <MissionStatusWidget
          mission={mission}
          availableMissions={ALL_FEATURED_MISSIONS}
          onSelectMission={handleSelectMission}
          onContribute={(pathway) => handleOpenContribution(pathway)}
          onOpenProvenance={onOpenProvenance}
        />
      </section>

      {/* 5. WAYS TO CONTRIBUTE SECTION (4 Distinct Cards) */}
      <section ref={waysSectionRef} className="px-4 sm:px-8 py-20 max-w-7xl mx-auto border-b border-[#F5F5F0]/10 space-y-10">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
            MULTIPLE CONTRIBUTION PATHWAYS
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Ways to Contribute</h2>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 font-sans leading-relaxed">
            People should be able to give, build, partner, or back meaningful missions. Choose the pathway that matches your capacity.
          </p>
        </div>

        {/* 4 Distinct Visually Rich Cards Component */}
        <ContributionWaysCards
          onSelectPathway={(pathway) => handleOpenContribution(pathway)}
        />
      </section>

      {/* 6. PROOF, TIMELINE & TRANSPARENCY SECTION */}
      <section ref={proofSectionRef} className="px-4 sm:px-8 py-20 max-w-7xl mx-auto border-b border-[#F5F5F0]/10 space-y-12">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
            UNCOMPROMISING ACCOUNTABILITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
            See what happens to your contribution.
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 font-sans leading-relaxed">
            Every dollar, hour, and partnership is traced through a 5-stage cryptographic progression.
          </p>
        </div>

        {/* 5-Step Progression */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs">
          <div className="p-4 bg-[#0E0E0E] border border-[#F5F5F0]/10 rounded-sm space-y-2">
            <span className="text-[10px] text-[#C5A059] font-bold">STAGE 01</span>
            <div className="font-serif font-bold text-sm text-[#F5F5F0]">Contribution</div>
            <p className="text-[11px] text-[#F5F5F0]/60 font-sans">Funds or skills logged to specific mission.</p>
          </div>

          <div className="p-4 bg-[#0E0E0E] border border-[#F5F5F0]/10 rounded-sm space-y-2">
            <span className="text-[10px] text-[#C5A059] font-bold">STAGE 02</span>
            <div className="font-serif font-bold text-sm text-[#F5F5F0]">Mission</div>
            <p className="text-[11px] text-[#F5F5F0]/60 font-sans">Bound to community charter & Priority Floor.</p>
          </div>

          <div className="p-4 bg-[#0E0E0E] border border-[#F5F5F0]/10 rounded-sm space-y-2">
            <span className="text-[10px] text-[#C5A059] font-bold">STAGE 03</span>
            <div className="font-serif font-bold text-sm text-[#F5F5F0]">Deployment</div>
            <p className="text-[11px] text-[#F5F5F0]/60 font-sans">Disbursed to local youth guilds & materials.</p>
          </div>

          <div className="p-4 bg-[#0E0E0E] border border-[#F5F5F0]/10 rounded-sm space-y-2">
            <span className="text-[10px] text-[#C5A059] font-bold">STAGE 04</span>
            <div className="font-serif font-bold text-sm text-[#F5F5F0]">Evidence</div>
            <p className="text-[11px] text-[#F5F5F0]/60 font-sans">Drone mapping, water tests & field audits.</p>
          </div>

          <div className="p-4 bg-[#141E16] border border-emerald-500/40 rounded-sm space-y-2">
            <span className="text-[10px] text-emerald-400 font-bold">STAGE 05</span>
            <div className="font-serif font-bold text-sm text-white">Outcome</div>
            <p className="text-[11px] text-emerald-200/80 font-sans">Verified biophysical flourishing score delta.</p>
          </div>
        </div>

        {/* Live Transparency Metrics Table */}
        <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3 font-mono text-xs">
            <span className="text-[#C5A059] font-bold uppercase tracking-wider">
              Transparent Mission Balance Sheet
            </span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Cryptographically Anchored</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 font-mono text-center">
            <div className="p-3 bg-[#141414] rounded-sm">
              <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Funds Received</span>
              <span className="text-base font-bold text-white">{mission.transparencyMetrics.fundsReceived}</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">[Verified]</span>
            </div>

            <div className="p-3 bg-[#141414] rounded-sm">
              <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Funds Deployed</span>
              <span className="text-base font-bold text-[#8FB8DE]">{mission.transparencyMetrics.fundsDeployed}</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">[Documented]</span>
            </div>

            <div className="p-3 bg-[#141414] rounded-sm">
              <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">People Engaged</span>
              <span className="text-base font-bold text-[#C5A059]">{mission.transparencyMetrics.peopleEngaged}</span>
              <span className="text-[9px] text-sky-400 block mt-0.5">[Reported]</span>
            </div>

            <div className="p-3 bg-[#141414] rounded-sm">
              <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Milestones Done</span>
              <span className="text-base font-bold text-white">{mission.transparencyMetrics.milestonesCompleted} / {mission.milestones.length}</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">[Audited]</span>
            </div>

            <div className="p-3 bg-[#141414] rounded-sm">
              <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Outcomes Verified</span>
              <span className="text-base font-bold text-emerald-400">{mission.transparencyMetrics.outcomesVerified} Sensors</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">[Verified]</span>
            </div>
          </div>
        </div>

        {/* Interactive Mission Timeline Component */}
        <div className="pt-6">
          <MissionTimeline
            milestones={mission.milestones}
            onOpenProvenance={onOpenProvenance}
          />
        </div>
      </section>

      {/* 7. START A MISSION SECTION */}
      <section className="px-4 sm:px-8 py-20 max-w-7xl mx-auto border-b border-[#F5F5F0]/10">
        <div className="p-8 sm:p-12 bg-[#0E1410] border border-[#C5A059]/40 rounded-sm space-y-6 relative overflow-hidden">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              BECOME A MISSION STEWARD
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">
              Have a problem worth solving?
            </h2>
            <p className="text-sm text-[#F5F5F0]/80 font-sans leading-relaxed">
              Create a mission and bring the people, resources, and partners needed to move it forward. Atlas turns isolated struggles into coordinated regenerative impact.
            </p>
          </div>

          <button
            onClick={() => handleOpenContribution('start-mission')}
            className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold uppercase text-xs font-mono tracking-widest rounded-sm transition-all shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start a Mission</span>
          </button>
        </div>
      </section>

      {/* 8. FINAL CTA SECTION */}
      <section className="px-4 sm:px-8 py-24 max-w-5xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="text-xs font-mono uppercase text-[#C5A059] tracking-[0.25em] font-bold">
            A CALL TO AGENCY
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F5F5F0] leading-tight">
            The future is not something we wait for. <br />
            <span className="text-[#C5A059] italic font-serif">It is something we build.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#F5F5F0]/70 font-sans max-w-xl mx-auto leading-relaxed">
            Find a mission. Bring something valuable. Help move it forward.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 font-mono">
          <button
            onClick={() => {
              scrollToSection(waysSectionRef);
              audioFeedback.playMicroTick();
            }}
            className="px-8 py-4 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold uppercase text-xs tracking-widest rounded-sm transition-all shadow-xl flex items-center gap-2"
          >
            <span>Participate Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleOpenContribution('give')}
            className="px-8 py-4 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] text-xs uppercase tracking-widest rounded-sm transition-all shadow"
          >
            Donate to Active Mission
          </button>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-[#F5F5F0]/10 bg-[#070707] px-4 sm:px-8 py-12 text-xs font-mono text-[#F5F5F0]/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-serif font-bold text-white text-sm tracking-wider">ATLAS</div>
            <p className="text-[11px] text-[#F5F5F0]/50 font-sans">
              Regenerative Mission Platform • Non-Extractive Civilization OS
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
            <button onClick={() => onSelectTab && onSelectTab('about')} className="hover:text-white transition-colors">About</button>
            <button onClick={() => scrollToSection(missionSectionRef)} className="hover:text-white transition-colors">Mission</button>
            <button onClick={() => scrollToSection(proofSectionRef)} className="hover:text-white transition-colors">Transparency</button>
            <button onClick={() => onSelectTab && onSelectTab('developers')} className="hover:text-white transition-colors">Developers SDK</button>
            <button onClick={() => onSelectTab && onSelectTab('evidence-ledger')} className="hover:text-white transition-colors">Evidence Ledger</button>
          </div>

          <div className="text-[10px] text-[#F5F5F0]/40 font-mono">
            © 2026 Atlas Sanctum. Verifiable Public Commons.
          </div>
        </div>
      </footer>

      {/* 10. UNIFIED MODULAR CONTRIBUTION MODAL */}
      <ContributionModal
        isOpen={activeModalType !== null}
        type={activeModalType || 'give'}
        missionTitle={mission.title}
        missionId={mission.id}
        onClose={() => setActiveModalType(null)}
        onSuccess={handleContributionSuccess}
        onSwitchType={(newType) => setActiveModalType(newType)}
      />
    </div>
  );
};
