import React, { useState } from 'react';
import { 
  Home, 
  Droplets, 
  Sun, 
  Wind, 
  Leaf, 
  Cpu, 
  Sparkles, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  Wrench,
  Zap
} from 'lucide-react';
import { LIFEHOUSE_SYSTEMS, SAMPLE_PROVENANCE } from '../../data/mockCivilizationData';
import { LifeHouseSystem } from '../../types';

interface LifeHouseViewProps {
  onInspectProvenance: (prov: any) => void;
  onOpenMoralSimulator: () => void;
}

export const LifeHouseView: React.FC<LifeHouseViewProps> = ({
  onInspectProvenance,
  onOpenMoralSimulator
}) => {
  const [selectedSystem, setSelectedSystem] = useState<LifeHouseSystem>(LIFEHOUSE_SYSTEMS[0]);
  const [houseUnits, setHouseUnits] = useState<number>(10);

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              LIFEHOUSE REGENERATIVE HABITATION INITIATIVE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Dignified, Carbon-Negative Human Habitats</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            Closed-loop food, water, energy, and air systems engineered for generational dignity and zero ecological debt.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onInspectProvenance(SAMPLE_PROVENANCE)}
            className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            LCA Carbon Audit (Zero Net Debt)
          </button>
        </div>
      </div>

      {/* 3 Core System Cards Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {LIFEHOUSE_SYSTEMS.map((sys) => {
          const isSelected = selectedSystem.id === sys.id;
          return (
            <div
              key={sys.id}
              onClick={() => setSelectedSystem(sys)}
              className={`p-6 rounded-sm border cursor-pointer transition-all space-y-4 flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#0D0D0D] border-[#C5A059] shadow-xl ring-1 ring-[#C5A059]/40'
                  : 'bg-[#080808] border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-[#1B3022] text-[#C5A059] rounded-sm border border-[#C5A059]/40 font-bold">
                    {sys.readinessLevel}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#C5A059]">
                    {sys.specifications.footprintSqM} m² Footprint
                  </span>
                </div>

                <h3 className="text-lg font-serif text-[#F5F5F0]">{sys.name}</h3>
                <p className="text-xs text-[#F5F5F0]/70 leading-relaxed font-sans">{sys.purpose}</p>
              </div>

              <div className="pt-3 border-t border-[#F5F5F0]/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#F5F5F0]/70">
                  <span className="text-[#F5F5F0]/40">Deployment:</span>
                  <span>{sys.specifications.deploymentTimeHours} Hours</span>
                </div>
                <div className="flex justify-between text-[#F5F5F0]/70">
                  <span className="text-[#F5F5F0]/40">Water Purification:</span>
                  <span className="text-[#8FB8DE]">{sys.specifications.waterPurificationLitersPerDay} L/day</span>
                </div>
                <div className="flex justify-between text-[#F5F5F0]/70">
                  <span className="text-[#F5F5F0]/40">Solar Generation:</span>
                  <span className="text-emerald-400">{sys.specifications.solarCapacityKw} kW</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected LifeHouse Deep Technical Specs Grid */}
      <div className="p-8 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#F5F5F0]/10">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#8FB8DE] font-bold tracking-[0.2em]">System Architecture & Blueprint</span>
            <h2 className="text-2xl font-serif text-[#F5F5F0]">{selectedSystem.name}</h2>
            <p className="text-xs text-[#F5F5F0]/60 font-sans">{selectedSystem.tagline}</p>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-[#1B3022] px-3 py-1.5 rounded-sm border border-emerald-500/30 font-bold">
            Embodied Carbon: {selectedSystem.specifications.carbonFootprint}
          </div>
        </div>

        {/* Specifications & Materials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
              <Layers className="w-4 h-4" />
              Structural Materials
            </div>
            <ul className="space-y-1.5 text-xs text-[#F5F5F0]/70 font-sans">
              {selectedSystem.specifications.materials.map((m, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8FB8DE]">
              <Droplets className="w-4 h-4" />
              Water Cycle
            </div>
            <div className="text-xs text-[#F5F5F0]/70 space-y-1 font-sans">
              <div className="font-bold text-[#F5F5F0] font-mono">{selectedSystem.specifications.waterPurificationLitersPerDay} Liters / Day</div>
              <p className="text-[#F5F5F0]/50">Multi-barrier filtration, atmospheric condensation, greywater reed-bed recycling.</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
              <Zap className="w-4 h-4" />
              Clean Energy Matrix
            </div>
            <div className="text-xs text-[#F5F5F0]/70 space-y-1 font-sans">
              <div className="font-bold text-[#F5F5F0] font-mono">{selectedSystem.specifications.solarCapacityKw} kW Rooftop Solar</div>
              <p className="text-[#F5F5F0]/50">BIPV rooftop solar, sodium-ion battery buffers, smart thermal mass cooling.</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
              <Leaf className="w-4 h-4" />
              Food Yield System
            </div>
            <div className="text-xs text-[#F5F5F0]/70 space-y-1 font-sans">
              <div className="font-bold text-[#F5F5F0] font-mono">{selectedSystem.specifications.foodYieldKgPerMonth} kg / Month</div>
              <p className="text-[#F5F5F0]/50">Vertical aeroponic columns and integrated micro-aquaponic nutrient cycles.</p>
            </div>
          </div>
        </div>

        {/* Community Habitat Cluster Yield Calculator */}
        <div className="p-6 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">Cluster Scaling Calculator</span>
              <h3 className="text-base font-serif text-[#F5F5F0]">Multi-Home Regenerative Neighborhood Simulation</h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#F5F5F0]/50">Cluster Size:</span>
              <span className="text-emerald-400 font-bold text-sm">{houseUnits} Units</span>
            </div>
          </div>

          <input
            type="range"
            min={1}
            max={100}
            value={houseUnits}
            onChange={(e) => setHouseUnits(Number(e.target.value))}
            className="w-full accent-[#C5A059] bg-[#0A0A0A] h-2 rounded-lg cursor-pointer"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-2">
            <div className="p-3 bg-[#0D0D0D] rounded-sm border border-[#F5F5F0]/10">
              <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Annual Clean Water</div>
              <div className="text-sm font-bold text-[#8FB8DE] mt-0.5">{(houseUnits * selectedSystem.specifications.waterPurificationLitersPerDay * 365).toLocaleString()} L/yr</div>
            </div>
            <div className="p-3 bg-[#0D0D0D] rounded-sm border border-[#F5F5F0]/10">
              <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Annual Food Production</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{(houseUnits * selectedSystem.specifications.foodYieldKgPerMonth * 12).toLocaleString()} kg/yr</div>
            </div>
            <div className="p-3 bg-[#0D0D0D] rounded-sm border border-[#F5F5F0]/10">
              <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Microgrid Solar Generation</div>
              <div className="text-sm font-bold text-[#C5A059] mt-0.5">{(houseUnits * selectedSystem.specifications.solarCapacityKw * 4.5 * 365 / 1000).toFixed(1)} MWh/yr</div>
            </div>
            <div className="p-3 bg-[#0D0D0D] rounded-sm border border-[#F5F5F0]/10">
              <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Carbon Embodied Balance</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">-{(houseUnits * 4.2).toFixed(1)} tCO2e Net</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
