import React, { useState } from 'react';
import { 
  Factory, 
  Cpu, 
  Layers, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Cog, 
  Truck, 
  Recycle,
  Sparkles
} from 'lucide-react';
import { SAMPLE_PROVENANCE } from '../../data/mockCivilizationData';

interface IndustrialViewProps {
  onInspectProvenance: (prov: any) => void;
  onOpenMoralSimulator: () => void;
}

export const IndustrialView: React.FC<IndustrialViewProps> = ({
  onInspectProvenance,
  onOpenMoralSimulator
}) => {
  const [selectedHub, setSelectedHub] = useState<number>(0);

  const hubs = [
    {
      name: "Rift Bio-Composite Fabrication Hub",
      location: "Naivasha Industrial Park, Kenya",
      focus: "Modular LifeHouse Compressed Earth & Bamboo Blocks",
      capacity: "1,200 modular homes/year",
      energySource: "100% Geothermal (Olkaria Interconnect)",
      circularRatio: "96.4% Local biological input",
      workers: 380,
      apprentices: 120
    },
    {
      name: "Kigali Precision Microgrid & IoT Foundry",
      location: "Special Economic Zone, Rwanda",
      focus: "LoRaWAN Soil Probes, Solar Charge Controllers, Water Kiosks",
      capacity: "45,000 sensor nodes/year",
      energySource: "100% Solar + Hydro Storage",
      circularRatio: "91.2% Recycled e-waste casing & lead-free solder",
      workers: 240,
      apprentices: 85
    },
    {
      name: "Kilifi Desalination & Marine Bio-Materials Lab",
      location: "Coast Bioregion, Kenya",
      focus: "Solar Seawater Reverse Osmosis & Seaweed Bio-Polymer Membranes",
      capacity: "120 desalination skids/year",
      energySource: "100% Solar-Wind Hybrid",
      circularRatio: "98.0% Zero-liquid discharge brine mineralization",
      workers: 190,
      apprentices: 60
    }
  ];

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              ATLAS INDUSTRIAL SYSTEMS • PHYSICAL EXECUTION INFRASTRUCTURE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Green Fabrication & Sovereign Supply Chains</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            Physical manufacturing hubs powered by 100% clean energy, circular bio-composites, and local apprenticeship programs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onInspectProvenance(SAMPLE_PROVENANCE)}
            className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Embodied Carbon Verification
          </button>
        </div>
      </div>

      {/* Industrial Principles Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-3">
          <div className="w-10 h-10 rounded-sm bg-[#1B3022] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif text-[#F5F5F0]">100% Zero-Carbon Energy</h3>
          <p className="text-xs text-[#F5F5F0]/60 leading-relaxed font-sans">
            Every fabrication facility runs directly on geothermal, micro-hydro, or dedicated solar microgrids with sodium-ion battery storage.
          </p>
        </div>

        <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-3">
          <div className="w-10 h-10 rounded-sm bg-[#080808] border border-[#8FB8DE]/30 flex items-center justify-center text-[#8FB8DE]">
            <Recycle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif text-[#F5F5F0]">Circular Bio-Composites</h3>
          <p className="text-xs text-[#F5F5F0]/60 leading-relaxed font-sans">
            Eliminating toxic binders and high-carbon clinker cement in favor of agricultural residues, compressed earth blocks, and mycorrhizal binders.
          </p>
        </div>

        <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-3">
          <div className="w-10 h-10 rounded-sm bg-[#1B3022] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
            <Cog className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif text-[#F5F5F0]">Local Sovereign Capability</h3>
          <p className="text-xs text-[#F5F5F0]/60 leading-relaxed font-sans">
            Investing in local technicians, apprenticeships, and open-source repairable tooling rather than turnkey imported dependencies.
          </p>
        </div>
      </div>

      {/* Fabrication Hubs Showcase */}
      <div className="p-8 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-[#F5F5F0]/10">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-[0.2em]">Active Manufacturing Nodes</span>
            <h2 className="text-xl font-serif text-[#F5F5F0]">Regional Fabrication Facilities</h2>
          </div>
          <span className="text-xs font-mono text-[#C5A059]">3 Operational Hubs • 810 Local Technicians</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {hubs.map((hub, idx) => {
            const isSelected = selectedHub === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedHub(idx)}
                className={`p-5 rounded-sm border cursor-pointer transition-all space-y-4 ${
                  isSelected
                    ? 'bg-[#1B3022] border-[#C5A059] shadow-lg ring-1 ring-[#C5A059]/40'
                    : 'bg-[#080808] border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
                }`}
              >
                <div className="space-y-1">
                  <div className="text-[9px] uppercase font-mono text-[#8FB8DE] font-bold">{hub.location}</div>
                  <h3 className="text-sm font-serif text-[#F5F5F0]">{hub.name}</h3>
                </div>

                <div className="space-y-2 text-xs font-mono pt-2 border-t border-[#F5F5F0]/10">
                  <div className="flex justify-between">
                    <span className="text-[#F5F5F0]/40">Product Output:</span>
                    <span className="text-[#F5F5F0] text-right text-[11px] font-sans">{hub.focus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#F5F5F0]/40">Annual Capacity:</span>
                    <span className="text-emerald-400">{hub.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#F5F5F0]/40">Energy Grid:</span>
                    <span className="text-[#8FB8DE]">{hub.energySource}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#F5F5F0]/40">Circular Score:</span>
                    <span className="text-[#C5A059]">{hub.circularRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#F5F5F0]/40">Team & Apprentices:</span>
                    <span className="text-[#F5F5F0]/80">{hub.workers} workers ({hub.apprentices} apprentices)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
