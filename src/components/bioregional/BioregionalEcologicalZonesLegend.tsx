import React, { useState } from 'react';
import { 
  TreePine, 
  Trees, 
  Sun, 
  Wind, 
  Mountain, 
  Snowflake, 
  Droplets, 
  ChevronDown, 
  ChevronUp, 
  Globe2, 
  Sparkles,
  Check,
  Compass
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface EcologicalZone {
  id: string;
  name: string;
  category: 'Tropical' | 'Temperate' | 'Savanna' | 'Arid' | 'Montane' | 'Tundra' | 'Wetland';
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
  description: string;
  precipitation: string;
  canopyDensity: string;
  vulnerability: string;
}

export const ECOLOGICAL_ZONES: EcologicalZone[] = [
  {
    id: 'zone-tropical',
    name: 'Tropical Rainforest & Equatorial',
    category: 'Tropical',
    color: '#10B981',
    bgColor: 'bg-emerald-950/70',
    borderColor: 'border-emerald-500/50',
    icon: TreePine,
    description: 'Dense multi-strata evergreen canopy with perennial precipitation and critical planetary carbon sequestration.',
    precipitation: '> 2,000 mm/yr',
    canopyDensity: '85 - 98%',
    vulnerability: 'Canopy moisture desiccation & peatland drainage'
  },
  {
    id: 'zone-temperate',
    name: 'Temperate Mixed & Deciduous',
    category: 'Temperate',
    color: '#22C55E',
    bgColor: 'bg-green-950/70',
    borderColor: 'border-green-500/50',
    icon: Trees,
    description: 'Distinct four-season vegetative phenology, moderate moisture, and rich organic leaf-litter humus.',
    precipitation: '750 - 1,500 mm/yr',
    canopyDensity: '60 - 80%',
    vulnerability: 'Late spring frost anomaly & bark beetle encroachment'
  },
  {
    id: 'zone-savanna',
    name: 'Tropical Savanna & Woodlands',
    category: 'Savanna',
    color: '#EAB308',
    bgColor: 'bg-yellow-950/70',
    borderColor: 'border-yellow-500/50',
    icon: Sun,
    description: 'Open discontinuous canopy over continuous C4 graminoid understory with stark wet/dry seasonal polarity.',
    precipitation: '500 - 1,000 mm/yr',
    canopyDensity: '20 - 45%',
    vulnerability: 'Late dry-season catastrophic wildfire ignition'
  },
  {
    id: 'zone-arid',
    name: 'Arid & Semi-Arid Steppe',
    category: 'Arid',
    color: '#F97316',
    bgColor: 'bg-orange-950/70',
    borderColor: 'border-orange-500/50',
    icon: Wind,
    description: 'Xerophytic shrublands, high diurnal thermal fluctuation, and extreme potential evapotranspiration.',
    precipitation: '< 250 mm/yr',
    canopyDensity: '< 15%',
    vulnerability: 'Subsurface aquifer collapse & topsoil aeolian erosion'
  },
  {
    id: 'zone-montane',
    name: 'Montane Cloud Forest & Alpine',
    category: 'Montane',
    color: '#A855F7',
    bgColor: 'bg-purple-950/70',
    borderColor: 'border-purple-500/50',
    icon: Mountain,
    description: 'Steep altitudinal gradients, horizontal cloud-water intercept, and narrow endemic biological corridors.',
    precipitation: '1,200 - 2,800 mm/yr',
    canopyDensity: '50 - 75%',
    vulnerability: 'Upslope thermal compression & steep flash siltation'
  },
  {
    id: 'zone-tundra',
    name: 'Boreal Taiga & Arctic Tundra',
    category: 'Tundra',
    color: '#06B6D4',
    bgColor: 'bg-cyan-950/70',
    borderColor: 'border-cyan-500/50',
    icon: Snowflake,
    description: 'Permafrost subsoil, low solar angles, moss/lichen blankets, and immense sub-surface cryoturbated carbon.',
    precipitation: '150 - 400 mm/yr',
    canopyDensity: '10 - 35%',
    vulnerability: 'Active-layer permafrost thaw & thermokarst subsidence'
  },
  {
    id: 'zone-wetland',
    name: 'Riparian & Deltaic Wetlands',
    category: 'Wetland',
    color: '#3B82F6',
    bgColor: 'bg-blue-950/70',
    borderColor: 'border-blue-500/50',
    icon: Droplets,
    description: 'Permanently or seasonally inundated hydric soils, riverine sediment filtering, and estuarine nurseries.',
    precipitation: 'Hydrologically coupled',
    canopyDensity: 'Variable (15 - 90%)',
    vulnerability: 'Upstream impoundment & agricultural turbidity influx'
  }
];

interface BioregionalEcologicalZonesLegendProps {
  selectedZoneId?: string | null;
  onSelectZone?: (zoneId: string | null) => void;
  defaultExpanded?: boolean;
}

export const BioregionalEcologicalZonesLegend: React.FC<BioregionalEcologicalZonesLegendProps> = ({
  selectedZoneId = null,
  onSelectZone,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const handleToggleZone = (zoneId: string) => {
    audioFeedback.playMicroTick();
    if (onSelectZone) {
      onSelectZone(selectedZoneId === zoneId ? null : zoneId);
    }
  };

  return (
    <div 
      className="absolute top-14 right-3 max-w-[280px] sm:max-w-[320px] rounded-xl bg-black/90 backdrop-blur-md border border-[#1B3022] shadow-2xl z-20 pointer-events-auto transition-all select-none"
      role="region"
      aria-label="Ecological Zones Legend"
    >
      {/* Header Bar with Toggle */}
      <div className="px-3 py-2 border-b border-[#1B3022] flex items-center justify-between gap-2">
        <button
          onClick={() => {
            audioFeedback.playMicroTick();
            setIsExpanded(!isExpanded);
          }}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#C5A059] hover:text-white transition-colors cursor-pointer text-left"
          aria-expanded={isExpanded}
        >
          <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ecological Biomes</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
            {ECOLOGICAL_ZONES.length}
          </span>
        </button>

        <div className="flex items-center gap-1">
          {selectedZoneId && (
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                onSelectZone?.(null);
              }}
              className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[#C5A059] cursor-pointer"
            >
              RESET
            </button>
          )}

          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 rounded text-[#F5F5F0]/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse Ecological Zones' : 'Expand Ecological Zones'}
            aria-label={isExpanded ? 'Collapse Ecological Zones' : 'Expand Ecological Zones'}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-2.5 space-y-2 max-h-[360px] overflow-y-auto">
          <div className="text-[9px] font-mono text-[#F5F5F0]/60 px-1 leading-tight">
            Classification based on Holdridge life zones, canopy density, and seasonal hydrology:
          </div>

          <div className="space-y-1.5">
            {ECOLOGICAL_ZONES.map((zone) => {
              const IconComp = zone.icon;
              const isSelected = selectedZoneId === zone.id;

              return (
                <div
                  key={zone.id}
                  onClick={() => handleToggleZone(zone.id)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? `${zone.bgColor} ${zone.borderColor} ring-1 ring-white/30 shadow-md`
                      : 'bg-black/50 hover:bg-white/5 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-5 h-5 rounded-md flex items-center justify-center border shrink-0"
                        style={{ 
                          backgroundColor: `${zone.color}20`, 
                          borderColor: `${zone.color}80`,
                          color: zone.color 
                        }}
                      >
                        <IconComp className="w-3 h-3" />
                      </div>
                      <span 
                        className="font-mono text-[10px] font-bold truncate max-w-[170px]"
                        style={{ color: isSelected ? '#FFFFFF' : zone.color }}
                      >
                        {zone.name}
                      </span>
                    </div>

                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: zone.color }}
                    />
                  </div>

                  <p className="text-[8.5px] font-sans text-[#F5F5F0]/70 leading-tight line-clamp-2 pl-7">
                    {zone.description}
                  </p>

                  <div className="flex items-center justify-between text-[8px] font-mono text-[#F5F5F0]/50 pt-1 border-t border-white/5 pl-7">
                    <span>Rain: <strong className="text-[#F5F5F0]">{zone.precipitation}</strong></span>
                    <span>Canopy: <strong className="text-[#F5F5F0]">{zone.canopyDensity}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
