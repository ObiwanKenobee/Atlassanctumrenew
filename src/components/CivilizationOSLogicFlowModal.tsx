import React, { useState } from 'react';
import { PageView } from '../types';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Compass, 
  Sparkles, 
  Layers, 
  ExternalLink,
  GitBranch,
  Droplets,
  Coins,
  Scale
} from 'lucide-react';

interface CivilizationOSLogicFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: PageView) => void;
}

export const CivilizationOSLogicFlowModal: React.FC<CivilizationOSLogicFlowModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeModuleTab, setActiveModuleTab] = useState<string>('all');

  if (!isOpen) return null;

  const modules = [
    {
      id: 'telemetry',
      name: 'Bioregional Telemetry Mesh',
      targetTab: 'living-reality' as PageView,
      icon: Droplets,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgColor: 'bg-emerald-950/40',
      inputs: 'SWAT Hydrological Basins, SMAP Soil Moisture, Sentinel-2 Multi-Spectral NDVI, IoT Mesh Placards',
      role: 'Ground-Truth Physical Reality',
      feedDescription: 'Supplies high-frequency empirical sensor proofs directly to the Moral Arbiter, ensuring algorithmic governance cannot act on fictitious or ungrounded physical assumptions.'
    },
    {
      id: 'epistemic',
      name: 'Epistemic Provenance Heatmap',
      targetTab: 'observatory' as PageView,
      icon: Activity,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/40',
      bgColor: 'bg-blue-950/40',
      inputs: 'Source Provenance Trees, Merkle Sensor Hashes, Epistemic Tier Weights, Uncertainty Topography',
      role: 'Data Reliability & Hallucination Guardrail',
      feedDescription: 'Calculates certainty coefficients and epistemic density across all claims, scaling down authority when certainty drops below the 85% validation threshold.'
    },
    {
      id: 'sentinel',
      name: 'Sentinel Failure Scenarios',
      targetTab: 'failure-ledger' as PageView,
      icon: ShieldCheck,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/40',
      bgColor: 'bg-rose-950/40',
      inputs: 'Historical Post-Mortems, Second-Order Distortion Models, Monte Carlo Perturbation Simulations',
      role: 'Anti-Fragility & Failure Prevention',
      feedDescription: 'Stress-tests proposed policy initiatives against known historical failure modes and unintended ecological consequences before policy authorization.'
    },
    {
      id: 'customary',
      name: 'Customary Knowledge & FPIC Covenants',
      targetTab: 'steward' as PageView,
      icon: Compass,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-950/40',
      inputs: 'Indigenous Council Resolutions, Water Stewardship Treaties, Elder Consent Thresholds',
      role: 'Sovereign Community Consent',
      feedDescription: 'Injects community veto thresholds and traditional land-management wisdom directly into the ethical engine, enforcing Free, Prior, and Informed Consent.'
    },
    {
      id: 'capital',
      name: '8-Forms Sovereign Capital Engine',
      targetTab: 'capital-engine' as PageView,
      icon: Coins,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      bgColor: 'bg-purple-950/40',
      inputs: 'Natural, Social, Cultural, Human, Spiritual, Material, Financial, and Intellectual Capital Pools',
      role: 'Non-Extractive Regenerative Allocation',
      feedDescription: 'Ensures economic flows compound all forms of capital simultaneously, preventing financial extraction that degrades natural or social fabric.'
    },
    {
      id: 'arbiter',
      name: 'Moral Arbiter Core & Axiomatic Engine',
      targetTab: 'moral-arbiter' as PageView,
      icon: Scale,
      color: 'text-[#C5A059]',
      borderColor: 'border-[#C5A059]/60',
      bgColor: 'bg-[#1B3022]/60',
      inputs: 'All 5 Input Pipelines Converge Here',
      role: 'Constitutional Ratification & Action Engine',
      feedDescription: 'Applies Priority Floor Gatekeepers and Canon XXIII moral imperatives to authorize verified governance decisions, swarm field missions, and continuous feedback loops.'
    }
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'} bg-black/85 backdrop-blur-md animate-in fade-in duration-200`}>
      <div 
        className={`relative w-full ${isFullscreen ? 'h-screen rounded-none' : 'max-w-6xl max-h-[92vh] rounded-xl'} bg-[#0B0B0B] border border-[#C5A059]/40 shadow-2xl flex flex-col text-[#F5F5F0] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-[#F5F5F0]/10 flex items-center justify-between bg-[#121212] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1B3022] border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-serif font-bold text-white tracking-wide">
                  Civilization OS Logic Flow
                </h2>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40 font-bold uppercase">
                  Systems Schematic
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-mono text-[#F5F5F0]/60">
                Visualizing Modular Interactions Feeding into the Moral Arbiter Core
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-[#181818] border border-[#F5F5F0]/10 rounded-lg p-1">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 25))}
                disabled={zoomLevel <= 75}
                className="p-1 text-[#F5F5F0]/60 hover:text-white disabled:opacity-30 rounded hover:bg-white/5 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-1 text-[#C5A059]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                disabled={zoomLevel >= 200}
                className="p-1 text-[#F5F5F0]/60 hover:text-white disabled:opacity-30 rounded hover:bg-white/5 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-[#F5F5F0]/60 hover:text-white bg-[#181818] hover:bg-white/5 border border-[#F5F5F0]/10 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#F5F5F0]/60 hover:text-white bg-[#181818] hover:bg-rose-950/40 border border-[#F5F5F0]/10 hover:border-rose-500/40 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Infographic Visual Container */}
          <div className="bg-[#070707] border border-[#C5A059]/30 rounded-xl overflow-hidden shadow-inner relative group">
            <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-mono text-[#C5A059] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Verified Civilization Architecture Diagram</span>
            </div>

            <div className="overflow-auto max-h-[500px] flex items-center justify-center p-2 sm:p-4 bg-radial from-[#151a17] via-[#0b0c0b] to-[#050505]">
              <img
                src="/src/assets/images/civilization_os_flow_1788768284899.jpg"
                alt="Civilization OS Logic Flow Infographic"
                className="max-w-full h-auto rounded-lg shadow-2xl transition-transform duration-200 select-none object-contain"
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="px-3 py-2 bg-[#0E0E0E] border-t border-[#F5F5F0]/10 text-[11px] font-mono text-[#F5F5F0]/60 flex items-center justify-between">
              <span>Figure 1.0: Multi-pipeline convergence into the Axiomatic Moral Engine</span>
              <span className="text-[#C5A059]">Pillars: Truth → Proof → Ethics → Allocation</span>
            </div>
          </div>

          {/* Explanatory Narrative Summary */}
          <div className="p-4 bg-[#121212] border border-[#F5F5F0]/10 rounded-xl space-y-2">
            <h3 className="text-xs sm:text-sm font-serif font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[#C5A059]" />
              <span>How Atlas Sanctum Modules Feed into the Moral Arbiter</span>
            </h3>
            <p className="text-xs text-[#F5F5F0]/80 leading-relaxed font-sans">
              Atlas Sanctum operates not as an isolated predictive model, but as a cyber-physical <strong>Civilization Operating System</strong>. 
              No single module possesses autocratic authority. Instead, empirical telemetry from the bioregions, epistemic reliability weights from cryptographic ledgers, 
              and customary covenants from living communities feed continuously into the <strong>Moral Arbiter Core</strong>. 
              The Moral Arbiter applies the non-negotiable <strong>Priority Floor</strong> (guaranteeing water, calories, shelter, and soil regeneration) and <strong>Canon XXIII</strong> 
              to ratify only those governance decisions that actively compound multi-capital health across seven generations.
            </p>
          </div>

          {/* Module Pipeline Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#C5A059] font-bold">
                The Six Convergent Logic Modules
              </h4>
              <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                Click any module to inspect live subsystem
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {modules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.id}
                    className={`p-4 rounded-xl border ${mod.borderColor} ${mod.bgColor} flex flex-col justify-between space-y-3 hover:border-[#C5A059] transition-all group`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg bg-black/40 border border-white/10 ${mod.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <h5 className="text-xs font-serif font-bold text-white group-hover:text-[#C5A059] transition-colors">
                            {mod.name}
                          </h5>
                        </div>
                      </div>

                      <div className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider">
                        {mod.role}
                      </div>

                      <p className="text-[11px] text-[#F5F5F0]/80 font-sans leading-relaxed">
                        {mod.feedDescription}
                      </p>

                      <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-[#F5F5F0]/60 space-y-0.5">
                        <div className="font-semibold text-white/70">Key Inputs:</div>
                        <div className="line-clamp-2">{mod.inputs}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectTab(mod.targetTab);
                      }}
                      className="w-full mt-2 py-1.5 px-2 bg-black/40 hover:bg-[#1B3022] border border-white/15 hover:border-[#C5A059] text-xs font-mono text-[#F5F5F0] hover:text-[#C5A059] rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Open {mod.name.split(' ')[0]} Module</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#F5F5F0]/10 bg-[#0E0E0E] flex items-center justify-between text-xs font-mono text-[#F5F5F0]/60 shrink-0">
          <span>Atlas Sanctum Civilization OS • Specification V3.4</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/50 rounded-lg transition-colors cursor-pointer"
          >
            Close Architecture Flow
          </button>
        </div>
      </div>
    </div>
  );
};
