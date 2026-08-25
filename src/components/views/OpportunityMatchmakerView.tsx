import React, { useState } from 'react';
import {
  Network,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Coins,
  Layers,
  Wrench,
  Users,
  CheckCircle2,
  FileText,
  MapPin,
  Clock,
  Compass,
  Zap,
  TrendingUp
} from 'lucide-react';
import { TurnkeyMatchPackage } from '../../types';
import { TURNKEY_MATCH_PACKAGES } from '../../data/aiEnginesData';

interface OpportunityMatchmakerViewProps {
  onSelectTab: (tab: any) => void;
}

export const OpportunityMatchmakerView: React.FC<OpportunityMatchmakerViewProps> = ({ onSelectTab }) => {
  const [packages, setPackages] = useState<TurnkeyMatchPackage[]>(TURNKEY_MATCH_PACKAGES);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(TURNKEY_MATCH_PACKAGES[0].id);
  const [deployedPackages, setDeployedPackages] = useState<Record<string, boolean>>({});

  const selectedPackage = packages.find(p => p.id === selectedPackageId) || packages[0];

  const handleDeployToProjectOs = (packageId: string) => {
    setDeployedPackages(prev => ({ ...prev, [packageId]: true }));
    setTimeout(() => {
      onSelectTab('project-os');
    }, 900);
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
              AUTONOMOUS OPPORTUNITY MATCHMAKER • PROBLEM-TO-INTERVENTION ENGINE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Opportunity Matchmaker</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            AI coordination engine that autonomously detects physical community deficits, pairs them with certified open-hardware blueprints, matches non-extractive patient capital, and generates turnkey local guild labor packages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('project-os')}
            className="px-4 py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <Layers className="w-4 h-4 text-[#C5A059]" />
            <span>Project OS</span>
          </button>
          <button
            onClick={() => onSelectTab('opportunity-graph')}
            className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <Network className="w-4 h-4" />
            <span>Opportunity Graph</span>
          </button>
        </div>
      </div>

      {/* Turnkey Match Pipeline Selector */}
      <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
            SYNTHESIZED TURNKEY INTERVENTION PACKAGES
          </span>
          <span className="text-xs text-[#F5F5F0]/40 font-mono">
            3 Ready for Immediate Deployment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => {
            const isSelected = pkg.id === selectedPackageId;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackageId(pkg.id)}
                className={`p-4 rounded-sm border cursor-pointer transition-all space-y-2.5 text-left ${
                  isSelected
                    ? 'bg-[#181818] border-[#C5A059] shadow-md scale-[1.01]'
                    : 'bg-[#111111] border-[#F5F5F0]/5 hover:border-[#F5F5F0]/20'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#C5A059] font-bold">{pkg.problemSignal.category}</span>
                  <span className="text-emerald-400 font-bold">{pkg.coordinationReadiness}% Match Ready</span>
                </div>
                <h3 className="text-sm font-serif font-bold text-[#F5F5F0] leading-snug">
                  {pkg.problemSignal.title}
                </h3>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/60 pt-1 border-t border-[#F5F5F0]/5">
                  <span>{pkg.problemSignal.verifiedBeneficiaries.toLocaleString()} Inhabitants</span>
                  <span className="text-emerald-300 font-bold">{pkg.recommendedCapitalTranche.amount.split(' ')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Synthesis Overview Ribbon */}
      <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
              AI-COORDINATED TURNKEY SOLUTION BLUEPRINT
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#F5F5F0]">
              {selectedPackage.matchedBlueprint.title}
            </h2>
            <div className="text-xs text-[#F5F5F0]/70 font-sans flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{selectedPackage.problemSignal.bioregion}</span>
              <span className="font-mono text-[10px] text-emerald-400">[{selectedPackage.expectedFlourishingDelta}]</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleDeployToProjectOs(selectedPackage.id)}
              disabled={deployedPackages[selectedPackage.id]}
              className={`px-5 py-2.5 rounded-sm font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${
                deployedPackages[selectedPackage.id]
                  ? 'bg-emerald-800 text-white'
                  : 'bg-[#C5A059] hover:bg-[#b08e4c] text-black'
              }`}
            >
              {deployedPackages[selectedPackage.id] ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Deployed to Project OS!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Ratify & Deploy Turnkey Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Pillars Summary Quad */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#F5F5F0]/10 font-mono text-center text-xs">
          <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs space-y-0.5">
            <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Hardware TRL</div>
            <div className="text-base font-bold text-emerald-400">Level {selectedPackage.matchedBlueprint.tRL} / 9</div>
          </div>
          <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs space-y-0.5">
            <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Local Material Share</div>
            <div className="text-base font-bold text-[#C5A059]">{selectedPackage.matchedBlueprint.localMaterialSuitability}% Sourced</div>
          </div>
          <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs space-y-0.5">
            <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Matched Capital Tranche</div>
            <div className="text-base font-bold text-[#8FB8DE]">{selectedPackage.recommendedCapitalTranche.termYears} Yr Non-Extractive</div>
          </div>
          <div className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs space-y-0.5">
            <div className="text-[9px] text-[#F5F5F0]/40 uppercase">Youth Guild Apprenticeships</div>
            <div className="text-base font-bold text-purple-400">{selectedPackage.matchedBlueprint.youthGuildApprenticeshipHours} Hours</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Problem Signal & Blueprint + Bill of Materials & Youth Labor Package */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (6 cols): Problem Signal & Matched Capital */}
        <div className="lg:col-span-6 space-y-6">
          {/* Problem Signal Card */}
          <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F5F5F0]">
                1. Ingested Community Problem Signal
              </span>
              <span className="px-2 py-0.5 bg-rose-950 text-rose-300 font-mono text-[9px] font-bold uppercase rounded border border-rose-500/40">
                {selectedPackage.problemSignal.urgency} Urgency
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
                {selectedPackage.problemSignal.title}
              </h4>
              <p className="text-[#F5F5F0]/80 font-sans leading-relaxed">
                {selectedPackage.problemSignal.observedDeficit}
              </p>
              <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50 border-t border-[#F5F5F0]/5">
                <span>Sensor Mesh Hash: {selectedPackage.problemSignal.sensorHash}</span>
                <span>Coordinates: [{selectedPackage.problemSignal.coordinates.join(', ')}]</span>
              </div>
            </div>
          </div>

          {/* Matched Capital Tranche */}
          <div className="p-6 bg-[#0D0D0D] border border-[#C5A059]/30 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F5F5F0]">
                2. Matched Non-Extractive Capital Tranche
              </span>
              <span className="text-xs font-mono text-[#C5A059] font-bold">
                {selectedPackage.recommendedCapitalTranche.matchScore}% Match
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#F5F5F0] font-bold">{selectedPackage.recommendedCapitalTranche.funderName}</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedPackage.recommendedCapitalTranche.amount}</span>
              </div>
              <p className="text-[#F5F5F0]/70 font-sans text-[11px] leading-relaxed">
                <span className="font-bold text-[#C5A059]">Non-Extractive Terms: </span>
                {selectedPackage.recommendedCapitalTranche.nonExtractiveRationale}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Turnkey Bill of Materials & Local Guild Labor */}
        <div className="lg:col-span-6 space-y-6">
          {/* Bill of Materials (BOM) */}
          <div className="p-6 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F5F5F0]">
                3. Turnkey Bill of Materials (BOM)
              </span>
              <span className="text-[10px] font-mono text-[#C5A059]">
                Capex: {selectedPackage.matchedBlueprint.capexEstimate}
              </span>
            </div>

            <div className="space-y-2.5">
              {selectedPackage.billOfMaterials.map((bom, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#121212] border border-[#F5F5F0]/5 rounded-xs flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-serif font-bold text-[#F5F5F0]">{bom.item}</div>
                    <div className="text-[10px] text-[#F5F5F0]/50 font-mono">
                      Qty: {bom.quantity} • Sourcing: <span className={
                        bom.sourceType === 'Local Bioregional' ? 'text-emerald-400' :
                        bom.sourceType === 'Regional Fabricator' ? 'text-[#8FB8DE]' : 'text-purple-400'
                      }>{bom.sourceType}</span>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-[#C5A059] text-xs">
                    {bom.estimatedCost}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Youth Guild Labor Package */}
          <div className="p-6 bg-[#1B3022]/40 border border-emerald-500/30 rounded-sm space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
              <span className="font-mono text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> 4. Local Youth Guild Labor Package
              </span>
              <span className="font-mono text-emerald-300 font-bold">
                {selectedPackage.localLaborPackage.techniciansCount} Technicians
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-[#F5F5F0]/80 font-sans">
              <div>Guild Assigned: <span className="font-bold text-[#F5F5F0]">{selectedPackage.localLaborPackage.guildName}</span></div>
              <div>Apprenticeship Curriculum: <span className="font-mono text-emerald-300">{selectedPackage.localLaborPackage.trainingWeeks} Weeks Intensive</span></div>
              <div className="p-2.5 bg-[#141414] border border-emerald-500/20 rounded-xs text-[10px] text-[#F5F5F0]/70 font-mono mt-2">
                {selectedPackage.localLaborPackage.localPayrollShare}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
