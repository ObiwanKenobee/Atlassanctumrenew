import React, { useState } from 'react';
import { 
  Flame, 
  Droplets, 
  TreePine, 
  Wind, 
  Activity, 
  ShieldAlert, 
  Info, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Crosshair,
  Radio,
  SlidersHorizontal,
  Eye,
  Check,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export type ColorBlindMode = 'standard' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high_contrast';

export interface HeatmapLayerToggles {
  soilIntegrity: boolean;
  waterReliability: boolean;
  biodiversityDensity: boolean;
  atmosphericPlumes: boolean;
}

interface BioregionalMapLegendProps {
  displayMode: 'composite' | 'realtime' | 'trends';
  onCategoryClick?: (category: string) => void;
  layerToggles: HeatmapLayerToggles;
  onToggleLayer: (layerKey: keyof HeatmapLayerToggles) => void;
  colorBlindMode: ColorBlindMode;
  onChangeColorBlindMode: (mode: ColorBlindMode) => void;
}

export const BioregionalMapLegend: React.FC<BioregionalMapLegendProps> = ({
  displayMode,
  onCategoryClick,
  layerToggles,
  onToggleLayer,
  colorBlindMode,
  onChangeColorBlindMode
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'layers' | 'heatmap' | 'accessibility' | 'icons' | 'severity'>('overview');

  const hazardIconsList = [
    {
      id: 'thermal_fire',
      name: 'Wildfire & Thermal',
      icon: Flame,
      color: '#F59E0B',
      textColor: 'text-amber-400',
      description: 'Thermal infrared anomaly (MODIS Band 21/22, VIIRS 375m)'
    },
    {
      id: 'aquifer_deficit',
      name: 'Aquifer Depletion',
      icon: Droplets,
      color: '#06B6D4',
      textColor: 'text-cyan-400',
      description: 'GRACE-FO equivalent water thickness (EWT) subsurface deficit'
    },
    {
      id: 'canopy_stress',
      name: 'Canopy Stress',
      icon: TreePine,
      color: '#10B981',
      textColor: 'text-emerald-400',
      description: 'Multispectral canopy moisture & photosynthetic index drop'
    },
    {
      id: 'methane_plume',
      name: 'Methane Degassing',
      icon: Wind,
      color: '#A855F7',
      textColor: 'text-purple-400',
      description: 'TROPOMI shortwave infrared columnar methane excursion'
    },
    {
      id: 'siltation_surge',
      name: 'Turbidity & Siltation',
      icon: Activity,
      color: '#3B82F6',
      textColor: 'text-blue-400',
      description: 'Riparian runoff siltation and suspended particulate surge'
    }
  ];

  const severityLevels = [
    {
      level: 'EXISTENTIAL',
      color: '#E11D48',
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-950/80',
      borderColor: 'border-rose-600',
      animation: 'animate-pulse',
      desc: 'Irreversible systemic breach threshold'
    },
    {
      level: 'CRITICAL',
      color: '#EF4444',
      textColor: 'text-red-400',
      bgColor: 'bg-red-950/70',
      borderColor: 'border-red-500/50',
      animation: '',
      desc: 'Severe anomaly requiring active stewardship'
    },
    {
      level: 'WARNING',
      color: '#F59E0B',
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-950/70',
      borderColor: 'border-amber-500/50',
      animation: '',
      desc: 'Accelerating deviation from baseline'
    },
    {
      level: 'ADVISORY',
      color: '#38BDF8',
      textColor: 'text-sky-400',
      bgColor: 'bg-sky-950/70',
      borderColor: 'border-sky-500/40',
      animation: '',
      desc: 'Informational baseline monitoring variance'
    }
  ];

  // Helper for gradient display based on accessibility mode
  const getGradientClasses = () => {
    switch (colorBlindMode) {
      case 'protanopia':
        // Red-blind: Cyan to Amber to Indigo
        return 'from-cyan-600 via-amber-400 to-indigo-600';
      case 'deuteranopia':
        // Green-blind: Blue to Yellow to Magenta
        return 'from-blue-600 via-yellow-400 to-fuchsia-600';
      case 'tritanopia':
        // Blue-blind: Teal to Crimson to Bronze
        return 'from-teal-600 via-rose-500 to-amber-700';
      case 'high_contrast':
        // Monochromatic luminance
        return 'from-neutral-800 via-neutral-400 to-white';
      default:
        return 'from-teal-900 via-amber-500 to-rose-600';
    }
  };

  return (
    <div 
      className="absolute bottom-3 right-3 max-w-[290px] sm:max-w-[330px] rounded-xl bg-black/90 backdrop-blur-md border border-[#1B3022] shadow-2xl z-20 pointer-events-auto transition-all"
      role="region"
      aria-label="Map Legend and Telemetry Key"
    >
      {/* Header Bar */}
      <div className="px-3 py-2 border-b border-[#1B3022] flex items-center justify-between gap-2">
        <button
          onClick={() => {
            audioFeedback.playMicroTick();
            setIsExpanded(!isExpanded);
          }}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#C5A059] hover:text-white transition-colors cursor-pointer text-left"
          aria-expanded={isExpanded}
        >
          <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Legend & Layers</span>
          {colorBlindMode !== 'standard' && (
            <span className="text-[8.5px] px-1 py-0.2 rounded bg-indigo-950 border border-indigo-500/50 text-indigo-300">
              A11Y
            </span>
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 rounded text-[#F5F5F0]/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse Legend' : 'Expand Legend'}
            aria-label={isExpanded ? 'Collapse Legend' : 'Expand Legend'}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3 space-y-3 text-[10px] font-mono">
          {/* Sub-tabs */}
          <div className="flex rounded-md bg-black/60 p-0.5 border border-[#1B3022] overflow-x-auto">
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setActiveTab('overview');
              }}
              className={`flex-1 py-1 px-1.5 rounded text-[9px] transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-[#1B3022] text-[#C5A059] font-bold border border-[#C5A059]/40'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              Visual Key
            </button>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setActiveTab('layers');
              }}
              className={`flex-1 py-1 px-1.5 rounded text-[9px] transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'layers'
                  ? 'bg-[#1B3022] text-[#C5A059] font-bold border border-[#C5A059]/40'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              Layers
            </button>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setActiveTab('heatmap');
              }}
              className={`flex-1 py-1 px-1.5 rounded text-[9px] transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'heatmap'
                  ? 'bg-[#1B3022] text-[#C5A059] font-bold border border-[#C5A059]/40'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              Scale
            </button>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setActiveTab('accessibility');
              }}
              className={`flex-1 py-1 px-1.5 rounded text-[9px] transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'accessibility'
                  ? 'bg-[#1B3022] text-[#C5A059] font-bold border border-[#C5A059]/40'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              Color Mode
            </button>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setActiveTab('icons');
              }}
              className={`flex-1 py-1 px-1.5 rounded text-[9px] transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'icons'
                  ? 'bg-[#1B3022] text-[#C5A059] font-bold border border-[#C5A059]/40'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              Sensors
            </button>
          </div>

          {/* TAB: Overview (Visual Key & Telemetry Explanation) */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              {/* 1. Heatmap Color Scale Section */}
              <div className="space-y-1.5 bg-[#0C140E] p-2 rounded-lg border border-white/5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-bold text-[#C5A059] flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    Heatmap Color Scale
                  </span>
                  <span className="text-[8px] text-emerald-400/90 font-mono capitalize">
                    {colorBlindMode.replace('_', ' ')}
                  </span>
                </div>

                {/* Continuous dynamic gradient bar with stop markers */}
                <div className="relative pt-0.5">
                  <div className={`w-full h-3 rounded-md bg-gradient-to-r ${getGradientClasses()} border border-white/10 shadow-inner`} />
                  <div className="flex justify-between text-[8px] text-[#F5F5F0]/60 pt-1 font-mono">
                    <span>0.0 (Low)</span>
                    <span>0.5 (Moderate)</span>
                    <span>0.8 (Critical)</span>
                    <span className="text-rose-400 font-bold">1.0 (Existential)</span>
                  </div>
                </div>

                <div className="text-[8px] text-[#F5F5F0]/50 font-sans leading-tight">
                  Calculates 10-year Gaussian kernel density for active thermal, aquifer, and canopy hazards.
                </div>
              </div>

              {/* 2. Hazard Type Icons Section */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-bold text-[#F5F5F0] flex items-center gap-1">
                    <Radio className="w-3 h-3 text-[#C5A059]" />
                    Hazard Icons & Classifications
                  </span>
                  <span className="text-[8px] text-[#F5F5F0]/40">Click to filter</span>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  {hazardIconsList.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          audioFeedback.playMicroTick();
                          if (onCategoryClick) onCategoryClick(item.id);
                        }}
                        className="px-2 py-1.5 rounded-lg bg-black/40 hover:bg-[#1B3022]/80 border border-white/5 hover:border-[#C5A059]/40 transition-all cursor-pointer flex items-center gap-2 group"
                      >
                        <div 
                          className="p-1 rounded bg-black/70 border border-white/10 shrink-0"
                          style={{ color: item.color }}
                        >
                          <IconComponent className="w-3 h-3 transition-transform group-hover:scale-110" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-[9.5px] font-bold ${item.textColor} group-hover:text-white transition-colors`}>
                              {item.name}
                            </span>
                          </div>
                          <div className="text-[8px] text-[#F5F5F0]/60 font-sans truncate">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Severity Rings Indicator Strip */}
              <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[8px] text-[#F5F5F0]/70 px-0.5">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  <span className="font-bold text-rose-400">Existential</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Critical</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Warning</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Advisory</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Legend Toggles (Independent Heatmap Layers) */}
          {activeTab === 'layers' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[9px] text-[#F5F5F0]/70">
                <span className="font-bold text-[#F5F5F0] flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3 text-[#C5A059]" />
                  Independent Heatmap Layers
                </span>
                <span className="text-[8.5px] text-[#C5A059]">Filter On/Off</span>
              </div>

              <div className="space-y-1.5">
                {/* Layer 1: Soil Integrity */}
                <div 
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    onToggleLayer('soilIntegrity');
                  }}
                  className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    layerToggles.soilIntegrity
                      ? 'bg-[#15241B] border-[#2A4630] text-white'
                      : 'bg-black/40 border-white/5 text-[#F5F5F0]/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className={`w-3.5 h-3.5 ${layerToggles.soilIntegrity ? 'text-blue-400' : 'text-neutral-500'}`} />
                    <div>
                      <div className="font-bold text-[9.5px]">Soil Integrity & Siltation</div>
                      <div className="text-[8px] opacity-70">Turbidity, riverbed runoff, erosion surge</div>
                    </div>
                  </div>
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] border ${
                    layerToggles.soilIntegrity 
                      ? 'bg-blue-600 border-blue-400 text-white' 
                      : 'border-white/20'
                  }`}>
                    {layerToggles.soilIntegrity && <Check className="w-2.5 h-2.5" />}
                  </span>
                </div>

                {/* Layer 2: Water Reliability */}
                <div 
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    onToggleLayer('waterReliability');
                  }}
                  className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    layerToggles.waterReliability
                      ? 'bg-[#15241B] border-[#2A4630] text-white'
                      : 'bg-black/40 border-white/5 text-[#F5F5F0]/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Droplets className={`w-3.5 h-3.5 ${layerToggles.waterReliability ? 'text-cyan-400' : 'text-neutral-500'}`} />
                    <div>
                      <div className="font-bold text-[9.5px]">Water Reliability & Aquifers</div>
                      <div className="text-[8px] opacity-70">GRACE-FO equivalent water thickness (EWT)</div>
                    </div>
                  </div>
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] border ${
                    layerToggles.waterReliability 
                      ? 'bg-cyan-600 border-cyan-400 text-white' 
                      : 'border-white/20'
                  }`}>
                    {layerToggles.waterReliability && <Check className="w-2.5 h-2.5" />}
                  </span>
                </div>

                {/* Layer 3: Biodiversity Density */}
                <div 
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    onToggleLayer('biodiversityDensity');
                  }}
                  className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    layerToggles.biodiversityDensity
                      ? 'bg-[#15241B] border-[#2A4630] text-white'
                      : 'bg-black/40 border-white/5 text-[#F5F5F0]/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <TreePine className={`w-3.5 h-3.5 ${layerToggles.biodiversityDensity ? 'text-emerald-400' : 'text-neutral-500'}`} />
                    <div>
                      <div className="font-bold text-[9.5px]">Biodiversity Density & Canopy</div>
                      <div className="text-[8px] opacity-70">Canopy stress & thermal fire corridors</div>
                    </div>
                  </div>
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] border ${
                    layerToggles.biodiversityDensity 
                      ? 'bg-emerald-600 border-emerald-400 text-white' 
                      : 'border-white/20'
                  }`}>
                    {layerToggles.biodiversityDensity && <Check className="w-2.5 h-2.5" />}
                  </span>
                </div>

                {/* Layer 4: Atmospheric Plumes */}
                <div 
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    onToggleLayer('atmosphericPlumes');
                  }}
                  className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    layerToggles.atmosphericPlumes
                      ? 'bg-[#15241B] border-[#2A4630] text-white'
                      : 'bg-black/40 border-white/5 text-[#F5F5F0]/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Wind className={`w-3.5 h-3.5 ${layerToggles.atmosphericPlumes ? 'text-purple-400' : 'text-neutral-500'}`} />
                    <div>
                      <div className="font-bold text-[9.5px]">Atmospheric & Methane Plumes</div>
                      <div className="text-[8px] opacity-70">TROPOMI peat degassing & GHG flares</div>
                    </div>
                  </div>
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] border ${
                    layerToggles.atmosphericPlumes 
                      ? 'bg-purple-600 border-purple-400 text-white' 
                      : 'border-white/20'
                  }`}>
                    {layerToggles.atmosphericPlumes && <Check className="w-2.5 h-2.5" />}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Heatmap Density Scale */}
          {activeTab === 'heatmap' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[9px] text-[#F5F5F0]/70">
                <span className="font-bold text-[#F5F5F0]">Gaussian Density Index</span>
                <span className="text-[#C5A059]">0.0 → 1.0</span>
              </div>

              {/* Gradient Bar with Threshold Ticks */}
              <div className="relative">
                <div className={`w-full h-3 rounded-md bg-gradient-to-r ${getGradientClasses()} border border-white/10 shadow-inner`} />
                <div className="flex justify-between text-[8px] text-[#F5F5F0]/50 pt-1 font-mono">
                  <span>0.0 (Low)</span>
                  <span>0.5 (Moderate)</span>
                  <span>0.8 (Critical)</span>
                  <span className="text-rose-400 font-bold">1.0 (Existential)</span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-white/10 space-y-1 text-[8.5px] text-[#F5F5F0]/70">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500" /> Baseline / Low
                  </span>
                  <span className="text-[#F5F5F0]/40">&lt; 0.30</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Moderate Trend
                  </span>
                  <span className="text-[#F5F5F0]/40">0.30 - 0.65</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Critical Hotspot
                  </span>
                  <span className="text-[#F5F5F0]/40">0.65 - 0.85</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" /> Existential Cluster
                  </span>
                  <span className="text-rose-400 font-bold">&gt; 0.85</span>
                </div>
              </div>

              <p className="text-[8px] text-[#F5F5F0]/50 font-sans leading-tight pt-1">
                Gaussian kernel density calculated over 110–180 km radius from 10-year orbital telemetry pass baselines.
              </p>
            </div>
          )}

          {/* TAB: Color Blind Accessibility Mode */}
          {activeTab === 'accessibility' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[9px] text-[#F5F5F0]/70">
                <span className="font-bold text-[#F5F5F0] flex items-center gap-1">
                  <Eye className="w-3 h-3 text-[#C5A059]" />
                  Color Blind Accessibility Mode
                </span>
              </div>
              <p className="text-[8.5px] text-[#F5F5F0]/60 font-sans leading-tight">
                Shifts heatmap gradient and hazard beacons to perceptually safe color palettes.
              </p>

              <div className="space-y-1.5 pt-1">
                {[
                  { id: 'standard', name: 'Standard Palette', desc: 'Viridis / Thermal Gold-Crimson spectrum', grad: 'from-teal-900 via-amber-500 to-rose-600' },
                  { id: 'protanopia', name: 'Protanopia (Red-Blind)', desc: 'Cyan → Amber → Indigo with distinct luminance', grad: 'from-cyan-600 via-amber-400 to-indigo-600' },
                  { id: 'deuteranopia', name: 'Deuteranopia (Green-Blind)', desc: 'Deep Blue → Yellow → Vibrant Magenta', grad: 'from-blue-600 via-yellow-400 to-fuchsia-600' },
                  { id: 'tritanopia', name: 'Tritanopia (Blue-Blind)', desc: 'Teal → Crimson → Rich Bronze spectrum', grad: 'from-teal-600 via-rose-500 to-amber-700' },
                  { id: 'high_contrast', name: 'High-Contrast Monochrome', desc: 'Luminance stepped greyscale with bright apex', grad: 'from-neutral-800 via-neutral-400 to-white' }
                ].map((modeItem) => {
                  const isSelected = colorBlindMode === modeItem.id;
                  return (
                    <button
                      key={modeItem.id}
                      onClick={() => {
                        audioFeedback.playMicroTick();
                        onChangeColorBlindMode(modeItem.id as ColorBlindMode);
                      }}
                      className={`w-full p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-[#18261E] border-[#C5A059] ring-1 ring-[#C5A059]/40 text-white'
                          : 'bg-black/40 hover:bg-white/5 border-white/10 text-[#F5F5F0]/70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9.5px] font-bold">
                        <span>{modeItem.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#C5A059]" />}
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-gradient-to-r opacity-90 shadow-sm overflow-hidden" style={{ backgroundImage: undefined }}>
                        <div className={`w-full h-full bg-gradient-to-r ${modeItem.grad}`} />
                      </div>
                      <div className="text-[8px] text-[#F5F5F0]/50 font-sans">
                        {modeItem.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: Hazard Type Icons & Sensors */}
          {activeTab === 'icons' && (
            <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
              {hazardIconsList.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => onCategoryClick && onCategoryClick(item.id)}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-[#1B3022]/60 border border-white/5 hover:border-[#C5A059]/30 transition-all cursor-pointer flex items-start gap-2 group"
                    title={item.description}
                  >
                    <div 
                      className="p-1 rounded bg-black/70 border border-white/10 shrink-0 mt-0.5"
                      style={{ color: item.color }}
                    >
                      <IconComponent className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[10px] font-bold ${item.textColor} group-hover:text-white transition-colors`}>
                        {item.name}
                      </div>
                      <div className="text-[8.5px] text-[#F5F5F0]/60 font-sans leading-tight line-clamp-2">
                        {item.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: Severity Beacons & Reticles */}
          {activeTab === 'severity' && (
            <div className="space-y-1.5">
              {severityLevels.map((sev) => (
                <div 
                  key={sev.level}
                  className={`p-1.5 rounded-lg ${sev.bgColor} border ${sev.borderColor} flex items-center justify-between text-[9px]`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className={`w-2.5 h-2.5 rounded-full ${sev.animation}`}
                      style={{ backgroundColor: sev.color }}
                    />
                    <span className={`font-bold ${sev.textColor}`}>{sev.level}</span>
                  </div>
                  <span className="text-[8.5px] text-[#F5F5F0]/70 font-sans">{sev.desc}</span>
                </div>
              ))}

              <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[9px] text-[#F5F5F0]/70">
                <Crosshair className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>Selected Hazard (Crosshair Reticle on Coordinates)</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
