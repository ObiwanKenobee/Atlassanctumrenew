import React, { useState } from 'react';
import { 
  Heart, 
  Wrench, 
  Handshake, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  ChevronDown, 
  Sparkles, 
  ExternalLink,
  Lock,
  Compass,
  Radio,
  FileText
} from 'lucide-react';
import { FeaturedMission, ContributionPathway } from '../types';
import { TransparencyMetric } from './TransparencyMetric';
import { audioFeedback } from '../lib/audioFeedback';

export interface MissionStatusWidgetProps {
  mission: FeaturedMission;
  availableMissions?: FeaturedMission[];
  onSelectMission?: (missionId: string) => void;
  onContribute?: (pathway: ContributionPathway) => void;
  onOpenProvenance?: (provenanceData: any) => void;
  compact?: boolean;
  className?: string;
}

export const MissionStatusWidget: React.FC<MissionStatusWidgetProps> = ({
  mission,
  availableMissions,
  onSelectMission,
  onContribute,
  onOpenProvenance,
  compact = false,
  className = ''
}) => {
  const [missionSelectorOpen, setMissionSelectorOpen] = useState(false);

  const fundingPercent = Math.min(
    100, 
    Math.round((mission.fundingCurrent / mission.fundingTarget) * 100)
  );

  const handleAction = (pathway: ContributionPathway) => {
    audioFeedback.playSubtleClick();
    if (onContribute) {
      onContribute(pathway);
    }
  };

  if (compact) {
    return (
      <div className={`p-4 bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-[#F5F5F0]">{mission.title}</span>
            </div>
            <span className="text-[10px] font-mono text-[#F5F5F0]/50">{mission.location}</span>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            {fundingPercent}% Funded
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#C5A059] to-emerald-400 transition-all duration-500"
            style={{ width: `${fundingPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#F5F5F0]/70 pt-1">
          <span>${mission.fundingCurrent.toLocaleString()} / ${mission.fundingTarget.toLocaleString()}</span>
          <span>{mission.peopleInvolved} Stewards</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm p-6 space-y-6 shadow-2xl relative group ${className}`}>
      {/* Top Bar with Bioregional Location & Mission Switcher */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-bold rounded-sm bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {mission.status}
            </span>

            {mission.isDemoData && (
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-1" title="This is auditable illustrative demo data for the Atlas prototype">
                <AlertCircle className="w-3 h-3" />
                Auditable Demo Data
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0] tracking-tight flex items-center gap-2">
            {mission.title}
          </h2>

          <div className="flex items-center gap-2 text-xs font-mono text-[#F5F5F0]/60">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{mission.location}</span>
            <span className="text-[#F5F5F0]/30">•</span>
            <span className="truncate max-w-xs">{mission.bioregionalContext}</span>
          </div>
        </div>

        {/* Mission Swapper Dropdown */}
        {availableMissions && availableMissions.length > 1 && onSelectMission && (
          <div className="relative">
            <button
              onClick={() => {
                setMissionSelectorOpen(!missionSelectorOpen);
                audioFeedback.playSubtleClick();
              }}
              className="px-3 py-1.5 bg-[#141414] hover:bg-[#1A1A1A] border border-[#F5F5F0]/20 rounded-sm text-xs font-mono text-[#F5F5F0] flex items-center gap-2 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Swap Mission ({availableMissions.length})</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${missionSelectorOpen ? 'rotate-180' : ''}`} />
            </button>

            {missionSelectorOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#121212] border border-[#F5F5F0]/20 rounded-sm shadow-2xl z-30 overflow-hidden animate-fadeIn">
                <div className="p-2 border-b border-[#F5F5F0]/10 text-[10px] font-mono uppercase text-[#F5F5F0]/50">
                  Select Regenerative Mission
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-[#F5F5F0]/5">
                  {availableMissions.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        onSelectMission(m.id);
                        setMissionSelectorOpen(false);
                        audioFeedback.playSubtleClick();
                      }}
                      className={`w-full text-left p-3 text-xs font-sans hover:bg-[#1A1A1A] transition-colors flex flex-col gap-1 ${
                        m.id === mission.id ? 'bg-[#181818] text-[#C5A059]' : 'text-[#F5F5F0]/80'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="font-bold">{m.title}</span>
                        <span className="text-emerald-400">{Math.round((m.fundingCurrent / m.fundingTarget) * 100)}%</span>
                      </div>
                      <span className="text-[10px] text-[#F5F5F0]/50 font-mono">{m.location}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Challenge Statement */}
      <p className="text-sm text-[#F5F5F0]/80 font-sans leading-relaxed">
        {mission.challenge}
      </p>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Capital Deployed vs Target */}
        <TransparencyMetric
          label="Capital Funded"
          value={`$${mission.fundingCurrent.toLocaleString()}`}
          unit={`/ $${mission.fundingTarget.toLocaleString()}`}
          provenance="Verified"
          source="Multi-Sig Escrow Contract & Bank Wire Ledger"
          date="Live Synced"
          certaintyScore={100}
          uncertaintyMargin="± $0"
          cryptographicHash="0x7a81b9c20184e9102bca88172901cbf3a94821a0"
          description={`${fundingPercent}% of total seed target fulfilled through non-extractive contributions.`}
          onInspectProvenance={onOpenProvenance}
        />

        {/* Metric 2: Stewards & Guild Members */}
        <TransparencyMetric
          label="Active Stewards"
          value={mission.peopleInvolved}
          unit="Guild Builders"
          provenance="Documented"
          source="Community Roster & Verified Bioregional Guild Assembly"
          date="Updated 24h ago"
          certaintyScore={96}
          uncertaintyMargin="± 2 people"
          description="Youth guilds, hydrologists, and community elders actively engaged in implementation."
          onInspectProvenance={onOpenProvenance}
        />

        {/* Metric 3: Biophysical Impact Achieved */}
        <TransparencyMetric
          label="Corridor Restored"
          value={mission.impactAchieved.split('&')[0].trim()}
          provenance="Verified"
          source="Sentinel-2 Photogrammetry & Ground Field Audits"
          date="Bi-weekly Audit"
          certaintyScore={98}
          uncertaintyMargin="± 15 meters"
          cryptographicHash="0x4981a201bf9827a4e1029c87162534a91b2c4019"
          description={`Target: ${mission.impactTarget}. 1.45 km cleared and stabilized with native bamboo.`}
          onInspectProvenance={onOpenProvenance}
        />

        {/* Metric 4: Milestones Completed */}
        <TransparencyMetric
          label="Milestones Verified"
          value={`${mission.transparencyMetrics.milestonesCompleted} / ${mission.milestones.length}`}
          unit="Phases"
          provenance="Verified"
          source="Bioregional Verification Mesh"
          date="Live Status"
          certaintyScore={99}
          description="Independent engineers and community assemblies signed off on phase completion."
          onInspectProvenance={onOpenProvenance}
        />
      </div>

      {/* Funding Progress Bar with Milestone Markers */}
      <div className="space-y-2 p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#F5F5F0]/60 uppercase tracking-wider">Milestone Funding Escrow</span>
          <span className="text-emerald-400 font-bold">{fundingPercent}% of Target Reached</span>
        </div>

        <div className="relative w-full h-3 bg-[#0A0A0A] rounded-full overflow-hidden p-0.5 border border-[#F5F5F0]/10">
          <div 
            className="h-full bg-gradient-to-r from-[#C5A059] via-emerald-500 to-emerald-400 rounded-full transition-all duration-700 shadow-md"
            style={{ width: `${fundingPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#F5F5F0]/50 pt-1">
          <span className="text-[#C5A059] font-medium">
            Funds Released: {mission.transparencyMetrics.fundsDeployed}
          </span>
          <span>Target Pool: ${mission.fundingTarget.toLocaleString()}</span>
        </div>
      </div>

      {/* Stewardship & Organization Badges */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider block">
          Lead Stewarding Guilds & Organizations
        </span>
        <div className="flex flex-wrap gap-2">
          {mission.leadStewards.map((steward, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0]/80"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{steward}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Quick Action Trigger Ribbon */}
      <div className="pt-4 border-t border-[#F5F5F0]/10 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-mono text-[#F5F5F0]/50">
          Choose a pathway to support this regenerative mission:
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleAction('give')}
            className="px-3.5 py-2 bg-[#C5A059] hover:bg-[#D4B06A] text-[#0A0A0A] font-mono text-xs uppercase tracking-wider font-bold rounded-sm shadow transition-all flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Give</span>
          </button>

          <button
            onClick={() => handleAction('build')}
            className="px-3.5 py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 font-mono text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Build</span>
          </button>

          <button
            onClick={() => handleAction('partner')}
            className="px-3.5 py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-cyan-500/40 text-cyan-400 hover:text-cyan-300 font-mono text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center gap-1.5"
          >
            <Handshake className="w-3.5 h-3.5" />
            <span>Partner</span>
          </button>

          <button
            onClick={() => handleAction('back')}
            className="px-3.5 py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-purple-500/40 text-purple-400 hover:text-purple-300 font-mono text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
