import React, { useState } from 'react';
import {
  Coins,
  DollarSign,
  TrendingUp,
  Scale,
  ShieldCheck,
  Sparkles,
  PieChart,
  Sliders,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface CapitalLayer {
  name: string;
  category: 'Philanthropic First-Loss' | 'Concessionary Ecological Bond' | 'Community Cooperative Equity' | 'Sovereign Debt Facility';
  percentage: number;
  returnExpectation: string;
  lossSubordination: string;
  color: string;
  desc: string;
}

export const BlendedFinanceStructuringEngine: React.FC<{
  targetProjectName?: string;
  totalFacilitySizeUSD?: number;
  onDeployToEscrow?: (structure: any) => void;
}> = ({
  targetProjectName = 'Upper Tana Watershed & Aberdare Riparian Restoration Facility',
  totalFacilitySizeUSD = 12500000,
  onDeployToEscrow
}) => {
  // Blended stack percentages (must sum to 100)
  const [firstLossPercent, setFirstLossPercent] = useState<number>(20);
  const [greenBondPercent, setGreenBondPercent] = useState<number>(45);
  const [communityEquityPercent, setCommunityEquityPercent] = useState<number>(25);
  const [sovereignFacilityPercent, setSovereignFacilityPercent] = useState<number>(10);

  const total = firstLossPercent + greenBondPercent + communityEquityPercent + sovereignFacilityPercent;

  // Derived financial metrics
  const firstLossUSD = (totalFacilitySizeUSD * (firstLossPercent / 100));
  const greenBondUSD = (totalFacilitySizeUSD * (greenBondPercent / 100));
  const communityEquityUSD = (totalFacilitySizeUSD * (communityEquityPercent / 100));
  const sovereignUSD = (totalFacilitySizeUSD * (sovereignFacilityPercent / 100));

  // Blended cost of capital calculation (WACC proxy)
  // First-loss: 0%, Bond: 4.2%, Community Equity: 3.5%, Sovereign: 2.1%
  const blendedCostOfCapital = (
    (firstLossPercent * 0.0 +
      greenBondPercent * 4.2 +
      communityEquityPercent * 3.5 +
      sovereignFacilityPercent * 2.1) /
    100
  ).toFixed(2);

  // Community Governance Power Metric
  const communityGovernancePower = communityEquityPercent >= 25 ? 'Constitutional Majority (>25% Floor met)' : 'Vulnerable to Speculation (<25% Floor)';
  const riskAbsorptionRatio = firstLossPercent >= 15 ? 'High (Catalytic First-Loss Buffer Verified)' : 'Moderate';

  return (
    <div className="bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm p-6 space-y-6 text-[#F5F5F0]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#C5A059]" />
              PHASE 03 COORDINATION • BLENDED FINANCE STRUCTURING ENGINE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Regenerative Capital Stack Allocator
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans">
            Coordinate philanthropic first-loss, patient ecological bonds, and sovereign facilities to protect local community equity sovereignty.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono">
            <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Total Facility Target</span>
            <span className="text-lg font-bold text-[#C5A059]">
              ${(totalFacilitySizeUSD / 1000000).toFixed(1)}M USD
            </span>
          </div>
        </div>
      </div>

      {/* Main Stack Designer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Sliders & Allocation */}
        <div className="lg:col-span-7 space-y-5 bg-[#121212] p-5 rounded-sm border border-[#F5F5F0]/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-[#C5A059] font-bold">
              Adjust Capital Tranche Weights
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-xs ${total === 100 ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
              Total Stack: {total}% {total !== 100 && '(Must equal 100%)'}
            </span>
          </div>

          {/* Tranche 1: Philanthropic First-Loss */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold">1. Philanthropic First-Loss (Catalytic Cushion):</span>
              <span className="text-amber-400 font-bold">{firstLossPercent}% (${(firstLossUSD / 1000000).toFixed(2)}M)</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={firstLossPercent}
              onChange={(e) => {
                setFirstLossPercent(parseInt(e.target.value));
                audioFeedback.playMicroTick();
              }}
              className="w-full accent-amber-400 bg-[#222] h-1.5 rounded cursor-pointer"
            />
            <span className="text-[10px] text-[#F5F5F0]/50 block">Absorbs first 100% of early-stage biophysical or hydrological downside risk.</span>
          </div>

          {/* Tranche 2: Concessionary Green Bond */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-blue-400 font-bold">2. Concessionary Ecological Bond (Senior):</span>
              <span className="text-blue-400 font-bold">{greenBondPercent}% (${(greenBondUSD / 1000000).toFixed(2)}M)</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={greenBondPercent}
              onChange={(e) => {
                setGreenBondPercent(parseInt(e.target.value));
                audioFeedback.playMicroTick();
              }}
              className="w-full accent-blue-400 bg-[#222] h-1.5 rounded cursor-pointer"
            />
            <span className="text-[10px] text-[#F5F5F0]/50 block">Long-tenor (15-25 yr) fixed coupon tied to verified aquifer head recharge telemetry.</span>
          </div>

          {/* Tranche 3: Community Cooperative Equity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">3. Local Community Cooperative Equity:</span>
              <span className="text-emerald-400 font-bold">{communityEquityPercent}% (${(communityEquityUSD / 1000000).toFixed(2)}M)</span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={communityEquityPercent}
              onChange={(e) => {
                setCommunityEquityPercent(parseInt(e.target.value));
                audioFeedback.playMicroTick();
              }}
              className="w-full accent-emerald-400 bg-[#222] h-1.5 rounded cursor-pointer"
            />
            <span className="text-[10px] text-[#F5F5F0]/50 block">Constitutional Priority Floor mandates &gt;= 25% perpetual local governance equity.</span>
          </div>

          {/* Tranche 4: Sovereign / Municipal Facility */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-purple-400 font-bold">4. Sovereign / Municipal Infrastructure Facility:</span>
              <span className="text-purple-400 font-bold">{sovereignFacilityPercent}% (${(sovereignUSD / 1000000).toFixed(2)}M)</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={sovereignFacilityPercent}
              onChange={(e) => {
                setSovereignFacilityPercent(parseInt(e.target.value));
                audioFeedback.playMicroTick();
              }}
              className="w-full accent-purple-400 bg-[#222] h-1.5 rounded cursor-pointer"
            />
            <span className="text-[10px] text-[#F5F5F0]/50 block">Public watershed counter-guarantee for regional water security.</span>
          </div>
        </div>

        {/* Right 5 Cols: Financial & Moral Metrics Dashboard */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-4">
            <h3 className="text-xs font-mono uppercase text-[#C5A059] font-bold">
              Blended Risk & Sovereignty Metrics
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#1A1A1A] rounded-xs flex justify-between items-center">
                <span className="text-[#F5F5F0]/70">Blended Cost of Capital:</span>
                <span className="text-lg font-bold text-emerald-400">{blendedCostOfCapital}% WACC</span>
              </div>

              <div className="p-3 bg-[#1A1A1A] rounded-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#F5F5F0]/70">Community Equity Ratio:</span>
                  <span className={`font-bold ${communityEquityPercent >= 25 ? 'text-emerald-300' : 'text-rose-400'}`}>
                    {communityEquityPercent}%
                  </span>
                </div>
                <span className="text-[10px] text-[#F5F5F0]/50 block">
                  Status: {communityGovernancePower}
                </span>
              </div>

              <div className="p-3 bg-[#1A1A1A] rounded-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#F5F5F0]/70">Downside Loss Protection:</span>
                  <span className="font-bold text-amber-300">${(firstLossUSD / 1000000).toFixed(2)}M First-Loss</span>
                </div>
                <span className="text-[10px] text-[#F5F5F0]/50 block">
                  Cushion: {riskAbsorptionRatio}
                </span>
              </div>
            </div>

            {/* Deploy to Smart Escrow button */}
            <button
              onClick={() => {
                audioFeedback.playSuccess();
                if (onDeployToEscrow) {
                  onDeployToEscrow({
                    totalFacilitySizeUSD,
                    firstLossPercent,
                    greenBondPercent,
                    communityEquityPercent,
                    sovereignFacilityPercent,
                    blendedCostOfCapital
                  });
                }
              }}
              className="w-full py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xs transition-all shadow cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Initialize Milestone Escrow Contract</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
