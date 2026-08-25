import React, { useState } from 'react';
import { 
  Coins, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Filter, 
  Sparkles, 
  Layers,
  Leaf,
  Droplets,
  Home,
  Check
} from 'lucide-react';
import { RVE_ASSETS, SAMPLE_PROVENANCE } from '../../data/mockCivilizationData';
import { RVEAsset } from '../../types';

interface MarketplaceViewProps {
  onInspectProvenance: (prov: any) => void;
  onOpenMoralSimulator: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  onInspectProvenance,
  onOpenMoralSimulator
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAsset, setSelectedAsset] = useState<RVEAsset>(RVE_ASSETS[0]);
  const [purchaseUnits, setPurchaseUnits] = useState<number>(500);
  const [transactionConfirmed, setTransactionConfirmed] = useState<boolean>(false);

  const categories = ['All', 'Biodiversity Corridor', 'Water Aquifer Recharge', 'Community Habitat'];

  const filteredAssets = selectedCategory === 'All'
    ? RVE_ASSETS
    : RVE_ASSETS.filter(a => a.category === selectedCategory);

  const handleAllocate = () => {
    setTransactionConfirmed(true);
    setTimeout(() => setTransactionConfirmed(false), 4000);
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              REGENERATIVE VALUE EXCHANGE (RVE) • PUBLIC VERIFIED LEDGER
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Marketplace for Verified Flourishing</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            Real data. Real impact. Real change. Non-extractive coordination of verified ecological, water, and community outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onInspectProvenance(SAMPLE_PROVENANCE)}
            className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Audit Ledger Protocol
          </button>
        </div>
      </div>

      {/* Ledger Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm">
          <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Total Capital Coordinated</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">$380,240,000</div>
          <div className="text-[10px] text-[#F5F5F0]/40 font-mono">100% milestone-released</div>
        </div>
        <div className="p-4 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm">
          <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Verified Ecological Credits</div>
          <div className="text-xl font-bold font-mono text-[#8FB8DE] mt-0.5">824,000 Units</div>
          <div className="text-[10px] text-[#F5F5F0]/40 font-mono">LiDAR & soil core verified</div>
        </div>
        <div className="p-4 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm">
          <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Community Dividend Floor</div>
          <div className="text-xl font-bold font-mono text-[#C5A059] mt-0.5">30% Minimum</div>
          <div className="text-[10px] text-[#F5F5F0]/40 font-mono">Held in local sovereign trusts</div>
        </div>
        <div className="p-4 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm">
          <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Auditor Consensus</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">100% Pass Rate</div>
          <div className="text-[10px] text-[#F5F5F0]/40 font-mono">Zero double-counting</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#F5F5F0]/10 pb-3 overflow-x-auto">
        <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-[0.2em] font-bold mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all uppercase tracking-wider ${
              selectedCategory === cat
                ? 'bg-[#F5F5F0] text-black'
                : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0] bg-[#0D0D0D] border border-[#F5F5F0]/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Assets Grid + Inspection Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assets List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {filteredAssets.map((asset) => {
            const isSelected = selectedAsset.id === asset.id;
            return (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={`p-6 rounded-sm border cursor-pointer transition-all space-y-4 ${
                  isSelected
                    ? 'bg-[#0D0D0D] border-[#C5A059] shadow-lg ring-1 ring-[#C5A059]/40'
                    : 'bg-[#080808] border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-[#8FB8DE]/15 text-[#8FB8DE] rounded-sm border border-[#8FB8DE]/20 font-bold">
                        {asset.category}
                      </span>
                      <span className="text-xs font-mono text-[#F5F5F0]/50">{asset.region}</span>
                    </div>
                    <h3 className="text-base font-serif text-[#F5F5F0]">{asset.title}</h3>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-lg font-bold font-mono text-emerald-400">${asset.unitPrice.toFixed(2)} / Unit</div>
                    <div className="text-[11px] font-mono text-[#F5F5F0]/40">{asset.availableUnits.toLocaleString()} units available</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-bold text-[#C5A059] uppercase tracking-wider text-[10px]">Verified Ecological Outcomes:</div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[#F5F5F0]/70 font-sans">
                    {asset.verifiedOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-[#F5F5F0]/10 flex items-center justify-between text-[11px] font-mono text-[#F5F5F0]/40">
                  <span>Issuer: {asset.issuingEntity}</span>
                  <span className="text-[#8FB8DE] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {asset.validator}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Asset Allocation Sandbox (1 Col) */}
        <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">
                Outcome Capital Allocation Sandbox
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-[#1B3022] text-emerald-400 rounded-sm border border-emerald-500/30">
                Verified
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-[#F5F5F0]/40 uppercase font-mono">Selected Asset</div>
              <h3 className="text-sm font-serif text-[#F5F5F0]">{selectedAsset.title}</h3>
              <p className="text-[11px] font-mono text-[#8FB8DE]">Proof Hash: {selectedAsset.proofHash.substring(0, 18)}...</p>
            </div>

            {/* Slider for allocation units */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/50">Allocation Volume:</span>
                <span className="text-emerald-400 font-bold">{purchaseUnits.toLocaleString()} Units</span>
              </div>
              <input
                type="range"
                min={100}
                max={10000}
                step={100}
                value={purchaseUnits}
                onChange={(e) => setPurchaseUnits(Number(e.target.value))}
                className="w-full accent-[#C5A059] bg-[#080808] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#F5F5F0]/40">
                <span>100 Units</span>
                <span>10,000 Units</span>
              </div>
            </div>

            {/* Total Calculation */}
            <div className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-2 font-mono text-xs">
              <div className="flex justify-between text-[#F5F5F0]/50">
                <span>Unit Price:</span>
                <span className="text-[#F5F5F0]">${selectedAsset.unitPrice.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-[#F5F5F0]/50">
                <span>Community Equity Reserve (30%):</span>
                <span className="text-[#C5A059]">${(purchaseUnits * selectedAsset.unitPrice * 0.3).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#F5F5F0] pt-2 border-t border-[#F5F5F0]/10">
                <span>Total Capital Deployed:</span>
                <span className="text-emerald-400">${(purchaseUnits * selectedAsset.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Co-Benefits List */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">Guaranteed Co-Benefits:</span>
              {selectedAsset.coBenefits.map((benefit, i) => (
                <div key={i} className="text-[11px] text-[#F5F5F0]/70 flex items-start gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#F5F5F0]/10">
            {transactionConfirmed ? (
              <div className="p-3 bg-[#1B3022] border border-emerald-500/50 rounded-sm text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 font-mono">
                <Check className="w-4 h-4" />
                Capital Allocated to Transparent Ledger
              </div>
            ) : (
              <button
                onClick={handleAllocate}
                className="w-full py-3 bg-[#F5F5F0] hover:bg-white text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 transition-all"
              >
                <Coins className="w-4 h-4" />
                Commit Patient Capital
              </button>
            )}

            <button
              onClick={() => onInspectProvenance(SAMPLE_PROVENANCE)}
              className="w-full py-2 bg-[#080808] hover:bg-[#151515] border border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0] rounded-sm text-xs font-mono flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              View Asset Cryptographic Proof
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
