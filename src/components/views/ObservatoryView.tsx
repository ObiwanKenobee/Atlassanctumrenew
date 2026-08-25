import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  Activity, 
  Radio, 
  Eye, 
  TrendingUp, 
  Filter, 
  Sparkles, 
  Droplets, 
  Sun, 
  TreeDeciduous, 
  AlertTriangle,
  Info,
  ChevronRight
} from 'lucide-react';
import { LIVING_REALITY_LAYERS, GLOBAL_PROJECTS, SAMPLE_PROVENANCE } from '../../data/mockCivilizationData';
import { ProjectLocation } from '../../types';

interface ObservatoryViewProps {
  onInspectProvenance: (prov: any) => void;
  onOpenMoralSimulator: () => void;
  onOpenCommandCenter: () => void;
}

export const ObservatoryView: React.FC<ObservatoryViewProps> = ({
  onInspectProvenance,
  onOpenMoralSimulator,
  onOpenCommandCenter
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>(LIVING_REALITY_LAYERS[0].id);
  const [selectedProject, setSelectedProject] = useState<ProjectLocation>(GLOBAL_PROJECTS[0]);
  const [zoomLevel, setZoomLevel] = useState<'Regional' | 'Continental' | 'Global'>('Regional');

  const activeLayer = LIVING_REALITY_LAYERS.find(l => l.id === selectedLayerId) || LIVING_REALITY_LAYERS[0];

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              LIVING REALITY ENGINE • 42,900 SENSOR NODES ACTIVE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Atlas Observatory</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            Real-time multispectral satellite telemetry, soil microbiome telemetry, and community ground audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCommandCenter}
            className="px-4 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 rounded-sm text-xs font-bold text-[#F5F5F0] flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Query Satellite Telemetry (⌘K)
          </button>
          <button
            onClick={() => onInspectProvenance(SAMPLE_PROVENANCE)}
            className="px-4 py-2 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-[#F5F5F0]/20 text-[#F5F5F0] rounded-sm text-xs font-mono font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Inspect Calibration Audit
          </button>
        </div>
      </div>

      {/* Layer Selection Carousel */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[10px] text-[#C5A059] uppercase font-bold tracking-[0.2em]">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#8FB8DE]" />
            Select Planetary Observation Layer
          </span>
          <span className="text-[#F5F5F0]/40 font-mono">{LIVING_REALITY_LAYERS.length} Multimodal Telemetry Layers Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {LIVING_REALITY_LAYERS.map((layer) => {
            const isSelected = layer.id === selectedLayerId;
            return (
              <button
                key={layer.id}
                onClick={() => setSelectedLayerId(layer.id)}
                className={`p-3 rounded-sm border text-left transition-all ${
                  isSelected
                    ? 'bg-[#1B3022] border-[#C5A059] text-[#F5F5F0] shadow-md'
                    : 'bg-[#0D0D0D] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:border-[#C5A059]/40'
                }`}
              >
                <div className="text-[9px] font-mono uppercase text-[#8FB8DE]">{layer.category}</div>
                <div className="text-xs font-bold text-[#F5F5F0] mt-0.5 line-clamp-1">{layer.name}</div>
                <div className="text-[10px] text-[#F5F5F0]/40 font-mono mt-1">{layer.activeSensorCount.toLocaleString()} nodes</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map & Intelligence Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Living Reality Map Stage (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex flex-col justify-between space-y-6 relative overflow-hidden">
          {/* Top Bar on Map */}
          <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#1B3022] text-emerald-400 text-xs font-mono uppercase rounded-sm border border-emerald-500/30 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                Live Sensor Feed
              </span>
              <span className="text-xs font-mono text-[#F5F5F0]/60">Active Layer: {activeLayer.name}</span>
            </div>

            <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 border border-[#F5F5F0]/10 rounded-sm text-xs font-mono">
              {(['Regional', 'Continental', 'Global'] as const).map((z) => (
                <button
                  key={z}
                  onClick={() => setZoomLevel(z)}
                  className={`px-2.5 py-1 rounded-sm transition-colors ${
                    zoomLevel === z ? 'bg-[#F5F5F0] text-black font-bold' : 'text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          {/* Graphical Map Representation */}
          <div className="relative w-full h-80 sm:h-96 bg-[#080808] rounded-sm border border-[#F5F5F0]/10 overflow-hidden flex items-center justify-center">
            {/* Topography & Bioregional Grids */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0A0A]/80 via-transparent to-[#C5A059]/10 pointer-events-none" />

            {/* Geographical SVG Contour Illustration (East Africa / Great Lakes Corridor) */}
            <svg className="w-full h-full text-[#C5A059]/25 p-8" viewBox="0 0 600 350" fill="none">
              <path
                d="M 120 40 Q 200 80 240 140 T 320 220 T 450 280 T 520 320"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M 280 60 Q 320 120 380 180 T 420 290"
                stroke="#8FB8DE"
                strokeWidth="1.5"
                strokeOpacity="0.4"
              />
              {/* Lake Victoria / Rift Basin Contour */}
              <ellipse cx="260" cy="180" rx="45" ry="60" fill="#8FB8DE" fillOpacity="0.08" stroke="#8FB8DE" strokeWidth="1" />
              <ellipse cx="380" cy="220" rx="35" ry="40" fill="#C5A059" fillOpacity="0.08" stroke="#C5A059" strokeWidth="1" />
            </svg>

            {/* Interactive Project Coordinate Pins */}
            {GLOBAL_PROJECTS.map((proj) => {
              const isSelected = proj.id === selectedProject.id;
              const topPos = `${Math.min(85, Math.max(15, 50 - proj.coordinates[0] * 8))}%`;
              const leftPos = `${Math.min(85, Math.max(15, (proj.coordinates[1] - 20) * 3.5))}%`;

              return (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  style={{ top: topPos, left: leftPos }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all z-20 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div className={`p-2 rounded-full border shadow-lg flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-[#C5A059] border-[#F5F5F0] text-black ring-4 ring-[#C5A059]/30' 
                      : 'bg-[#1B3022] border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black'
                  }`}>
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2 py-0.5 bg-[#0D0D0D]/95 border border-[#F5F5F0]/20 rounded-sm text-[10px] font-mono whitespace-nowrap text-[#F5F5F0] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {proj.title}
                  </div>
                </button>
              );
            })}

            {/* Bottom Floating Telemetry Overlay on Map */}
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-[#0A0A0A]/95 backdrop-blur-md border border-[#F5F5F0]/10 rounded-sm flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-[#F5F5F0]/50">Layer Baseline:</span>
                <span className="text-[#F5F5F0] font-bold">{activeLayer.globalAverage}</span>
                <span className="text-[#F5F5F0]/30">•</span>
                <span className="text-[#C5A059]">Threshold: {activeLayer.criticalThreshold}</span>
              </div>
              <div className="text-[11px] text-[#8FB8DE]">
                {activeLayer.description}
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm">
              <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Soil Organic Carbon</div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">+34.8% delta</div>
            </div>
            <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm">
              <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Aquifer Replenishment</div>
              <div className="text-base font-bold font-mono text-[#8FB8DE] mt-0.5">1.4B Liters</div>
            </div>
            <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm">
              <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Canopy NDVI Index</div>
              <div className="text-base font-bold font-mono text-[#C5A059] mt-0.5">0.78 Verified</div>
            </div>
            <div className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm">
              <div className="text-[10px] uppercase font-mono text-[#F5F5F0]/50">Sensor Reliability</div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">99.98% Uptime</div>
            </div>
          </div>
        </div>

        {/* Selected Project Deep Dive Panel (1 Col) */}
        <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#1B3022] text-[#C5A059] rounded-sm border border-[#C5A059]/40">
                {selectedProject.region} • {selectedProject.country}
              </span>
              <span className="text-xs font-mono font-bold text-[#C5A059]">
                {selectedProject.verifiedProgress}% Verified
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-serif text-[#F5F5F0]">{selectedProject.title}</h3>
              <p className="text-xs text-[#F5F5F0]/40 font-mono">Coordinates: [{selectedProject.coordinates.join(', ')}]</p>
            </div>

            <p className="text-xs text-[#F5F5F0]/70 leading-relaxed font-sans">
              {selectedProject.impactHighlight}
            </p>

            {/* Impact Metric Bars */}
            <div className="space-y-3 pt-2 border-t border-[#F5F5F0]/10">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F5F5F0]/50">Ecological Area</span>
                  <span className="text-emerald-400 font-bold">{selectedProject.ecologicalAreaHectares.toLocaleString()} ha</span>
                </div>
                <div className="w-full h-1.5 bg-[#080808] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${selectedProject.verifiedProgress}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="p-2.5 bg-[#080808] rounded-sm border border-[#F5F5F0]/10">
                  <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Direct Beneficiaries</div>
                  <div className="text-xs font-bold text-[#F5F5F0] mt-0.5">{selectedProject.beneficiariesCount.toLocaleString()}</div>
                </div>
                <div className="p-2.5 bg-[#080808] rounded-sm border border-[#F5F5F0]/10">
                  <div className="text-[10px] text-[#F5F5F0]/40 uppercase">Allocated Capital</div>
                  <div className="text-xs font-bold text-[#C5A059] mt-0.5">{selectedProject.budget}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-[#F5F5F0]/40 uppercase font-mono">Coordinating Partners</div>
                <div className="flex flex-wrap gap-1">
                  {selectedProject.partners.map((partner, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[#080808] text-[#F5F5F0]/70 text-[11px] rounded-sm border border-[#F5F5F0]/10">
                      {partner}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F5F5F0]/10 space-y-2">
            <button
              onClick={() => onInspectProvenance(selectedProject.provenance)}
              className="w-full py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#F5F5F0] rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Inspect Provenance Record
            </button>
            <button
              onClick={onOpenMoralSimulator}
              className="w-full py-2 bg-[#080808] hover:bg-[#151515] text-[#C5A059] border border-[#C5A059]/30 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              Simulate Moral Impact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
