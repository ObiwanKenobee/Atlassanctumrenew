import React from 'react';
import { 
  Check, 
  Globe2, 
  RotateCcw, 
  CheckCheck, 
  MapPin, 
  Activity, 
  Filter,
  Plus
} from 'lucide-react';
import { BioregionOption, COMPARATIVE_BIOREGIONS } from './flourishingAnalyticsData';
import { audioFeedback } from '../../lib/audioFeedback';

interface BioregionMultiSelectFilterProps {
  bioregions?: BioregionOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onResetToDefault: () => void;
  onOpenComparator?: () => void;
}

export const BioregionMultiSelectFilter: React.FC<BioregionMultiSelectFilterProps> = ({
  bioregions = COMPARATIVE_BIOREGIONS,
  selectedIds,
  onToggle,
  onSelectAll,
  onResetToDefault,
  onOpenComparator
}) => {
  const isAllSelected = selectedIds.length === bioregions.length;
  const isDefaultSelected = selectedIds.length === 1 && selectedIds[0] === 'pan-african';

  return (
    <div 
      id="bioregion-multi-select-filter-bar"
      className="p-3.5 bg-[#090C0A] rounded border border-[#C5A059]/30 space-y-3 font-mono text-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#F5F5F0]/10">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-[#C5A059]" />
          <span className="text-[11px] uppercase tracking-wider text-[#F5F5F0] font-bold">
            Bioregional Geographical Scope Comparison
          </span>
          <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#1B3022] text-emerald-300 border border-emerald-500/30 font-bold">
            {selectedIds.length} of {bioregions.length} Active
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {onOpenComparator && (
            <button
              type="button"
              id="filter-add-bioregion-persistent-btn"
              onClick={() => {
                audioFeedback.playMicroTick();
                onOpenComparator();
              }}
              className="py-1 px-3 rounded bg-[#16291E] hover:bg-[#203D2C] text-emerald-300 hover:text-white border border-emerald-500/50 text-[10px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Add an additional bioregion to overlay on the trend chart for direct comparison"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Add Bioregion</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              audioFeedback.playMicroTick();
              onSelectAll();
            }}
            disabled={isAllSelected}
            className="py-1 px-2.5 rounded bg-[#141816] hover:bg-[#1E2420] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/15 text-[10px] font-bold transition-colors flex items-center gap-1 disabled:opacity-40 cursor-pointer"
          >
            <CheckCheck className="w-3 h-3 text-[#C5A059]" />
            <span>Compare All</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioFeedback.playMicroTick();
              onResetToDefault();
            }}
            disabled={isDefaultSelected}
            className="py-1 px-2.5 rounded bg-[#141816] hover:bg-[#1E2420] text-[#F5F5F0]/70 hover:text-white border border-[#F5F5F0]/15 text-[10px] font-bold transition-colors flex items-center gap-1 disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-[#8FB8DE]" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Bioregion Filter Toggle Pills */}
      <div className="flex flex-wrap gap-2">
        {bioregions.map((region) => {
          const isSelected = selectedIds.includes(region.id);

          return (
            <button
              key={region.id}
              type="button"
              onClick={() => {
                audioFeedback.playMicroTick();
                onToggle(region.id);
              }}
              className={`py-1.5 px-3 rounded-sm border transition-all text-left flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#121A15] text-white shadow-md'
                  : 'bg-[#060807] text-[#F5F5F0]/50 hover:text-[#F5F5F0]/80 border-[#F5F5F0]/10 hover:border-[#F5F5F0]/20'
              }`}
              style={{
                borderColor: isSelected ? region.color : undefined
              }}
            >
              {/* Checkbox indicator */}
              <span 
                className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[9px] border transition-colors shrink-0`}
                style={{
                  backgroundColor: isSelected ? region.color : 'transparent',
                  borderColor: region.color,
                  color: '#000000'
                }}
              >
                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </span>

              {/* Color indicator circle */}
              <span 
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: region.color }}
              />

              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-[11px] whitespace-nowrap">{region.name}</span>
                <span className="text-[9px] text-[#F5F5F0]/40 font-mono hidden md:inline">({region.code})</span>
              </div>

              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/40 text-neutral-400 shrink-0 ml-1">
                {region.activeSensors.toLocaleString()} nodes
              </span>
            </button>
          );
        })}
      </div>

      {/* Comparative Scope Insight Line */}
      {selectedIds.length > 1 && (
        <div className="p-2 bg-[#050706] rounded border border-[#F5F5F0]/5 text-[10px] text-[#F5F5F0]/60 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-[#C5A059]" />
            <span>Multi-line comparative mode active: Rendering trajectories across {selectedIds.length} bioregions simultaneously.</span>
          </span>
          <span className="text-emerald-400 font-bold">
            Total Ingestion: {bioregions.filter(r => selectedIds.includes(r.id)).reduce((acc, r) => acc + r.activeSensors, 0).toLocaleString()} Sensors
          </span>
        </div>
      )}
    </div>
  );
};
