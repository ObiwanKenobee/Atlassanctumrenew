import React from 'react';
import { 
  Globe2, 
  X, 
  Plus, 
  Check, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  Activity,
  Maximize2
} from 'lucide-react';
import { BioregionOption, COMPARATIVE_BIOREGIONS } from './flourishingAnalyticsData';
import { audioFeedback } from '../../lib/audioFeedback';

interface BioregionalComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBioregionIds: string[];
  onToggleBioregion: (id: string) => void;
  onSelectAll: () => void;
  onResetBaseline: () => void;
  onApplyPreset?: (ids: string[]) => void;
}

export const BioregionalComparatorModal: React.FC<BioregionalComparatorModalProps> = ({
  isOpen,
  onClose,
  selectedBioregionIds,
  onToggleBioregion,
  onSelectAll,
  onResetBaseline,
  onApplyPreset
}) => {
  if (!isOpen) return null;

  const totalSensorsActive = COMPARATIVE_BIOREGIONS
    .filter(r => selectedBioregionIds.includes(r.id))
    .reduce((acc, r) => acc + r.activeSensors, 0);

  return (
    <div 
      id="bioregional-comparator-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="bioregional-comparator-modal"
        className="w-full max-w-3xl bg-[#090C0A] border border-[#C5A059]/40 rounded-lg shadow-2xl overflow-hidden text-[#F5F5F0] font-mono flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#0D120F] border-b border-[#F5F5F0]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#1B3022] border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Bioregional Comparator & Overlay Engine
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                  {selectedBioregionIds.length} of {COMPARATIVE_BIOREGIONS.length} Selected
                </span>
              </div>
              <p className="text-xs text-[#F5F5F0]/60 font-sans mt-0.5">
                Select an additional bioregion to overlay its multi-spectral data trajectory onto the existing trend chart for direct comparison.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              onClose();
            }}
            className="p-1.5 rounded-md hover:bg-[#1C2420] text-[#F5F5F0]/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="px-5 py-3 bg-[#060807] border-b border-[#F5F5F0]/10 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] text-[11px] font-bold uppercase tracking-wider">PRESETS:</span>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                if (onApplyPreset) {
                  onApplyPreset(['aberdare-water', 'mara-serengeti', 'rift-valley']);
                } else {
                  ['aberdare-water', 'mara-serengeti', 'rift-valley'].forEach(id => {
                    if (!selectedBioregionIds.includes(id)) onToggleBioregion(id);
                  });
                }
              }}
              className="py-1 px-2.5 rounded bg-[#121614] hover:bg-[#1A221E] text-cyan-300 border border-cyan-500/30 text-[10px] transition-colors cursor-pointer font-bold"
            >
              Rift & Water Towers (3)
            </button>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                onSelectAll();
              }}
              className="py-1 px-2.5 rounded bg-[#121614] hover:bg-[#1A221E] text-emerald-300 border border-emerald-500/30 text-[10px] transition-colors cursor-pointer font-bold"
            >
              Compare All (6 Corridors)
            </button>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                onResetBaseline();
              }}
              className="py-1 px-2.5 rounded bg-[#121614] hover:bg-[#1A221E] text-[#C5A059] border border-[#C5A059]/30 text-[10px] transition-colors cursor-pointer font-bold"
            >
              Reset to Pan-African Baseline
            </button>
          </div>

          <div className="text-[11px] text-emerald-400 font-bold">
            Total Active Ingestion: {totalSensorsActive.toLocaleString()} Sensors
          </div>
        </div>

        {/* List of Bioregions */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {COMPARATIVE_BIOREGIONS.map((region) => {
              const isSelected = selectedBioregionIds.includes(region.id);
              const latestData = region.monthlyData[region.monthlyData.length - 1];

              return (
                <div
                  key={region.id}
                  className={`p-4 rounded-md border transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#121A15] shadow-lg ring-1'
                      : 'bg-[#0A0D0B] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/25'
                  }`}
                  style={{
                    borderColor: isSelected ? region.color : undefined,
                    boxShadow: isSelected ? `0 0 16px ${region.color}20` : undefined
                  }}
                >
                  {/* Top: Name & Tag */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: region.color }}
                        />
                        <div>
                          <h4 className="font-bold text-white text-sm">{region.name}</h4>
                          <span className="text-[10px] text-[#F5F5F0]/50 font-mono">
                            {region.code} • {region.location}
                          </span>
                        </div>
                      </div>

                      <span 
                        className="px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider"
                        style={{
                          backgroundColor: `${region.color}15`,
                          borderColor: `${region.color}40`,
                          color: region.color
                        }}
                      >
                        {region.biome}
                      </span>
                    </div>

                    {/* Metrics snapshot */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-[#F5F5F0]/10 text-[10px]">
                      <div>
                        <span className="text-[#F5F5F0]/50 block">Flourishing</span>
                        <span className="text-emerald-400 font-bold text-xs">{latestData.ecologicalFlourishing}%</span>
                      </div>
                      <div>
                        <span className="text-[#F5F5F0]/50 block">Stability</span>
                        <span className="text-[#C5A059] font-bold text-xs">{latestData.economicStability}%</span>
                      </div>
                      <div>
                        <span className="text-[#F5F5F0]/50 block">Decoupling</span>
                        <span className="text-cyan-400 font-bold text-xs">+{latestData.decouplingMargin.toFixed(1)} pts</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Action Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#F5F5F0]/5">
                    <span className="text-[10px] text-[#F5F5F0]/60 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-emerald-400" />
                      <span>{region.activeSensors.toLocaleString()} cryptographic nodes</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        audioFeedback.playMicroTick();
                        onToggleBioregion(region.id);
                      }}
                      className={`py-1.5 px-3 rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 text-rose-300'
                          : 'bg-[#18261E] hover:bg-[#23382C] border border-emerald-500/50 text-emerald-300 hover:text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <X className="w-3.5 h-3.5" />
                          <span>Remove from Chart</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Overlay Bioregion</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0A0E0B] border-t border-[#F5F5F0]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#F5F5F0]/60 text-[11px]">
            <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Overlaid trajectories update synchronously with timeline scrubbers and confidence bands.</span>
          </div>

          <button
            onClick={() => {
              audioFeedback.playSuccessChime();
              onClose();
            }}
            className="w-full sm:w-auto py-2 px-5 rounded bg-[#C5A059] hover:bg-[#d4b068] text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow"
          >
            Apply & View Overlaid Trajectories ({selectedBioregionIds.length})
          </button>
        </div>
      </div>
    </div>
  );
};
