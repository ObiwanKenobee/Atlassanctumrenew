import React, { useState } from 'react';
import { 
  Globe2, 
  Layers, 
  Radio, 
  Cpu, 
  Activity, 
  TreePine, 
  Droplets, 
  Sun, 
  Wind, 
  Eye, 
  Search, 
  Maximize2, 
  RefreshCw, 
  ShieldCheck, 
  MapPin, 
  Zap, 
  Sliders, 
  Database,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { PageView, DataProvenance } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

interface LivingRealityViewProps {
  onSelectTab?: (tab: PageView) => void;
  onInspectProvenance?: (prov: DataProvenance) => void;
  onOpenMoralSimulator?: () => void;
}

interface BioregionalLayer {
  id: string;
  name: string;
  category: 'satellite' | 'hydrology' | 'canopy' | 'soil' | 'atmosphere';
  resolution: string;
  latency: string;
  status: 'active' | 'syncing' | 'calibrating';
  active: boolean;
  value: string;
  delta: string;
}

const BIOREGIONAL_LAYERS: BioregionalLayer[] = [
  {
    id: 'sentinel-2-ndvi',
    name: 'Multispectral NDVI Canopy Density',
    category: 'satellite',
    resolution: '10m / pixel',
    latency: '3.2 hrs ago (Sentinel-2)',
    status: 'active',
    active: true,
    value: '0.78 NDVI',
    delta: '+0.06 vs baseline'
  },
  {
    id: 'gedi-biomass',
    name: 'GEDI LiDAR Aboveground Biomass',
    category: 'canopy',
    resolution: '25m footprint',
    latency: '12 hrs ago (ISS GEDI)',
    status: 'active',
    active: true,
    value: '184.2 Mg/ha',
    delta: '+14.8 Mg/ha / yr'
  },
  {
    id: 'smap-soil-moisture',
    name: 'SMAP Subsurface Soil Moisture',
    category: 'soil',
    resolution: '1km downscaled',
    latency: '45 mins ago (In-situ mesh)',
    status: 'active',
    active: true,
    value: '28.4% volumetric',
    delta: '+4.2% water retention'
  },
  {
    id: 'swat-hydrology',
    name: 'Watershed Discharge & Aquifer Recharge',
    category: 'hydrology',
    resolution: 'Continuous streamflow',
    latency: 'Live (4,200 piezometers)',
    status: 'active',
    active: false,
    value: '3.42 m³/s',
    delta: '+18% baseflow'
  },
  {
    id: 'eddy-covariance',
    name: 'Eddy Covariance Net CO2 / H2O Flux',
    category: 'atmosphere',
    resolution: '10Hz micromet towers',
    latency: 'Real-time (24 towers)',
    status: 'active',
    active: true,
    value: '-4.82 μmol CO2/m²s',
    delta: 'Net Carbon Sink'
  }
];

const BIOREGIONS_FOCUS = [
  {
    id: 'mara-basin',
    name: 'Mara-Serengeti River Basin',
    country: 'Kenya / Tanzania',
    area: '13,504 km²',
    canopyCover: '42.8%',
    moistureIndex: '68/100',
    carbonRate: '4.2 tCO2e/ha/yr',
    riskScore: 'Low (Regenerative Pivot Active)',
    coordinates: '1.4582° S, 35.1245° E'
  },
  {
    id: 'great-rift-escarpment',
    name: 'Great Rift Escarpment & Mau Forest Complex',
    country: 'Kenya',
    area: '273,300 ha',
    canopyCover: '78.2%',
    moistureIndex: '84/100',
    carbonRate: '8.6 tCO2e/ha/yr',
    riskScore: 'Protected (Indigenous Stewarded)',
    coordinates: '0.4167° S, 35.7500° E'
  },
  {
    id: 'athie-watershed',
    name: 'Athi-Galana Bioregional Corridor',
    country: 'Kenya',
    area: '66,837 km²',
    canopyCover: '29.4%',
    moistureIndex: '52/100',
    carbonRate: '2.8 tCO2e/ha/yr',
    riskScore: 'Moderate (Rehabilitation Stage 3)',
    coordinates: '2.2833° S, 37.9833° E'
  }
];

export const LivingRealityView: React.FC<LivingRealityViewProps> = ({
  onSelectTab,
  onInspectProvenance,
  onOpenMoralSimulator
}) => {
  const [layers, setLayers] = useState<BioregionalLayer[]>(BIOREGIONAL_LAYERS);
  const [selectedBioregion, setSelectedBioregion] = useState(BIOREGIONS_FOCUS[0]);
  const [timeStep, setTimeStep] = useState<'live' | '24h' | '7d' | '30d' | '1y'>('live');
  const [isCalibrating, setIsCalibrating] = useState(false);

  const toggleLayer = (id: string) => {
    audioFeedback.playSubtleClick();
    setLayers(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
  };

  const handleRefreshCalibration = () => {
    audioFeedback.playSubtleClick();
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      audioFeedback.playSyncComplete();
    }, 900);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Header & Mission Statement */}
      <div className="bg-[#0D0D0D]/95 border border-[#C5A059]/40 rounded-sm p-6 relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">
                Multispectral Planetary Matrix
              </span>
              <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                Resolution: 10m Ground-Truth & In-situ Mesh
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F5F5F0] tracking-tight">
              Living Reality <span className="text-[#C5A059] italic">Observatory Matrix</span>
            </h1>
            
            <p className="text-sm text-[#F5F5F0]/70 font-sans leading-relaxed">
              Continuous cross-fusion of orbital multispectral imagery (Sentinel, Landsat, GEDI LiDAR) with over 4,200 verifiable IoT piezometers, sap flow monitors, and flux towers. Ground-truth reality without simulated approximations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefreshCalibration}
              disabled={isCalibrating}
              className="px-4 py-2.5 bg-[#1B3022] hover:bg-[#23422e] border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono font-bold rounded-sm flex items-center gap-2 transition-all cursor-pointer shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCalibrating ? 'animate-spin' : ''}`} />
              <span>{isCalibrating ? 'Re-calibrating Matrix...' : 'Calibrate Oracles'}</span>
            </button>

            {onSelectTab && (
              <button
                onClick={() => onSelectTab('reality-engine')}
                className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black text-xs font-mono font-bold rounded-sm flex items-center gap-2 transition-all cursor-pointer shadow"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Hardware QR Telemetry</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Matrix Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#F5F5F0]/10 text-xs font-mono">
          <div>
            <div className="text-[#F5F5F0]/50 text-[10px] uppercase">Active Ground Hardware</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">4,289 Nodes</div>
            <div className="text-[10px] text-emerald-500/80">99.8% Online Telemetry</div>
          </div>

          <div>
            <div className="text-[#F5F5F0]/50 text-[10px] uppercase">Satellite Ingestion</div>
            <div className="text-base font-bold text-[#C5A059] mt-0.5">Sentinel-2 & GEDI</div>
            <div className="text-[10px] text-[#C5A059]/80">Updated 3.2 hrs ago</div>
          </div>

          <div>
            <div className="text-[#F5F5F0]/50 text-[10px] uppercase">Net Bioregional Sink</div>
            <div className="text-base font-bold text-[#8FB8DE] mt-0.5">-4.82 μmol/m²s</div>
            <div className="text-[10px] text-blue-400/80">Net Autotrophic Growth</div>
          </div>

          <div>
            <div className="text-[#F5F5F0]/50 text-[10px] uppercase">Merkle Hash Verifications</div>
            <div className="text-base font-bold text-purple-300 mt-0.5">14.2M Hashes</div>
            <div className="text-[10px] text-purple-400/80">ZKP Attested (ISO-14064)</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Matrix Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Bioregion Selector & Active Layer Filters (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Bioregion Selection Cards */}
          <div className="bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#C5A059] flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Target Bioregions
              </h2>
              <span className="text-[10px] font-mono text-[#F5F5F0]/40">3 Verified Basins</span>
            </div>

            <div className="space-y-2.5">
              {BIOREGIONS_FOCUS.map(region => {
                const isSelected = selectedBioregion.id === region.id;
                return (
                  <button
                    key={region.id}
                    onClick={() => {
                      audioFeedback.playSubtleClick();
                      setSelectedBioregion(region);
                    }}
                    className={`w-full text-left p-3.5 rounded-sm border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#1B3022] border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.15)]' 
                        : 'bg-[#121212] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#F5F5F0] truncate">{region.name}</span>
                      <span className="text-[9px] font-mono text-[#C5A059]">{region.country}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/60">
                      <span>Area: {region.area}</span>
                      <span className="text-emerald-400 font-semibold">{region.carbonRate}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spectral & Telemetry Layer Toggles */}
          <div className="bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#C5A059] flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                Telemetry Layers
              </h2>
              <span className="text-[10px] font-mono text-emerald-400">{layers.filter(l => l.active).length} Active</span>
            </div>

            <div className="space-y-2">
              {layers.map(layer => (
                <div
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={`p-3 rounded-sm border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    layer.active 
                      ? 'bg-[#141414] border-emerald-500/40 text-[#F5F5F0]' 
                      : 'bg-[#0A0A0A] border-[#F5F5F0]/5 text-[#F5F5F0]/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${layer.active ? 'bg-emerald-400 shadow-[0_0_6px_#34D399]' : 'bg-neutral-600'}`} />
                      <span className="text-xs font-medium truncate">{layer.name}</span>
                    </div>
                    <div className="text-[10px] font-mono text-[#F5F5F0]/40 mt-0.5 truncate pl-4">
                      {layer.resolution} • {layer.latency}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-emerald-300">{layer.value}</div>
                    <div className="text-[9px] font-mono text-emerald-500/70">{layer.delta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Matrix Viewport & Live Stream Inspection (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Visual Map / Multispectral Matrix Canvas Mock */}
          <div className="bg-[#0A0A0A] border border-[#C5A059]/40 rounded-sm p-6 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#F5F5F0]/10 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-bold text-[#F5F5F0]">
                    {selectedBioregion.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/30 rounded">
                    {selectedBioregion.coordinates}
                  </span>
                </div>
                <p className="text-xs font-mono text-[#F5F5F0]/50 mt-0.5">
                  Multispectral Composite: NDVI + GEDI LiDAR + In-Situ Piezometric Discharge
                </p>
              </div>

              {/* Time Step Buttons */}
              <div className="flex items-center gap-1 bg-[#141414] p-1 rounded border border-[#F5F5F0]/10 text-[10px] font-mono">
                {(['live', '24h', '7d', '30d', '1y'] as const).map(step => (
                  <button
                    key={step}
                    onClick={() => {
                      audioFeedback.playSubtleClick();
                      setTimeStep(step);
                    }}
                    className={`px-2 py-1 rounded transition-colors uppercase font-bold cursor-pointer ${
                      timeStep === step ? 'bg-[#C5A059] text-black' : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Synthetic Matrix Graphic / Satellite Simulation View */}
            <div className="relative h-96 w-full bg-[#050505] rounded border border-[#F5F5F0]/10 overflow-hidden flex flex-col justify-between p-6">
              
              {/* Radial Elevation / Biomass Grid Overlay */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              
              {/* Multispectral Canopy Contour Heatmap (Synthetic Representation) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <div className="w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="w-64 h-64 rounded-full bg-[#C5A059]/20 blur-2xl ml-20 mt-10" />
                <div className="w-48 h-48 rounded-full bg-blue-500/20 blur-3xl -ml-20 -mt-10" />
              </div>

              {/* Live Telemetry Ping Points */}
              <div className="absolute top-1/4 left-1/3 flex items-center gap-2 group cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute" />
                <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-black relative z-10" />
                <div className="bg-[#0D0D0D]/90 border border-emerald-500/40 px-2 py-1 rounded text-[9px] font-mono text-[#F5F5F0] backdrop-blur">
                  Flux Tower Mara #04: -5.1 μmol CO2
                </div>
              </div>

              <div className="absolute bottom-1/3 right-1/4 flex items-center gap-2 group cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-blue-400 animate-ping absolute" />
                <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-black relative z-10" />
                <div className="bg-[#0D0D0D]/90 border border-blue-500/40 px-2 py-1 rounded text-[9px] font-mono text-[#F5F5F0] backdrop-blur">
                  Piezometer PZ-892: +1.4m Aquifer Table
                </div>
              </div>

              <div className="absolute top-1/2 right-1/3 flex items-center gap-2 group cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-[#C5A059] animate-ping absolute" />
                <div className="w-3 h-3 rounded-full bg-[#C5A059] border-2 border-black relative z-10" />
                <div className="bg-[#0D0D0D]/90 border border-[#C5A059]/40 px-2 py-1 rounded text-[9px] font-mono text-[#F5F5F0] backdrop-blur">
                  GEDI LiDAR Shot #9281: 210 Mg/ha Biomass
                </div>
              </div>

              {/* Status HUD Overlays */}
              <div className="flex items-center justify-between text-[11px] font-mono z-10">
                <div className="bg-[#0D0D0D]/90 backdrop-blur border border-[#F5F5F0]/20 px-3 py-1.5 rounded text-emerald-400 flex items-center gap-2">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>Real-Time Stream Active</span>
                </div>

                <div className="bg-[#0D0D0D]/90 backdrop-blur border border-[#F5F5F0]/20 px-3 py-1.5 rounded text-[#F5F5F0]/70 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>ZKP Merkle Verified (Root #0x8f2a...c89e)</span>
                </div>
              </div>

              {/* Legend & Coordinate Info */}
              <div className="flex items-end justify-between text-[10px] font-mono z-10">
                <div className="space-y-1 bg-[#0D0D0D]/80 backdrop-blur p-2.5 rounded border border-[#F5F5F0]/10">
                  <div className="text-[#F5F5F0]/50 font-bold uppercase">Spectral Legend</div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400" /> High Canopy</span>
                    <span className="flex items-center gap-1 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-400" /> Hydrologic Sink</span>
                    <span className="flex items-center gap-1 text-[#C5A059]"><span className="w-2 h-2 rounded-full bg-[#C5A059]" /> Biochar Trench</span>
                  </div>
                </div>

                <div className="text-right text-[#F5F5F0]/50">
                  <span>Sensor Mesh Latency: 42ms</span>
                </div>
              </div>
            </div>

            {/* Bottom Bioregion Deep Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[#F5F5F0]/10 text-xs font-mono">
              <div className="bg-[#121212] p-3 rounded border border-[#F5F5F0]/5">
                <div className="text-[#F5F5F0]/50 text-[10px]">Canopy Coverage</div>
                <div className="text-sm font-bold text-[#F5F5F0] mt-0.5">{selectedBioregion.canopyCover}</div>
              </div>

              <div className="bg-[#121212] p-3 rounded border border-[#F5F5F0]/5">
                <div className="text-[#F5F5F0]/50 text-[10px]">Moisture Index</div>
                <div className="text-sm font-bold text-blue-400 mt-0.5">{selectedBioregion.moistureIndex}</div>
              </div>

              <div className="bg-[#121212] p-3 rounded border border-[#F5F5F0]/5">
                <div className="text-[#F5F5F0]/50 text-[10px]">Annual Carbon Rate</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{selectedBioregion.carbonRate}</div>
              </div>

              <div className="bg-[#121212] p-3 rounded border border-[#F5F5F0]/5">
                <div className="text-[#F5F5F0]/50 text-[10px]">Ecological Security</div>
                <div className="text-sm font-bold text-[#C5A059] mt-0.5">{selectedBioregion.riskScore}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
