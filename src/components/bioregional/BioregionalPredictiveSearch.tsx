import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  Compass, 
  TreePine, 
  Droplets, 
  Flame, 
  Wind, 
  Layers, 
  Globe2, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  CornerDownLeft
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface GeographicalBioregion {
  id: string;
  name: string;
  ecologicalType: string;
  secondaryCategory: 'Peatland' | 'Cloud Forest' | 'Aquifer Basin' | 'Savanna' | 'Alkaline Lake' | 'Mangrove' | 'Urban Sponge' | 'Agroforestry' | 'Wetland';
  country: string;
  coordinates: [number, number]; // [lat, lng]
  elevationMeters?: number;
  dominantRisk: 'EXISTENTIAL' | 'CRITICAL' | 'WARNING' | 'ADVISORY' | 'STABLE';
  activeAlertsCount: number;
  description: string;
  stewardAssembly: string;
  tags: string[];
}

export const KNOWN_GEOGRAPHICAL_BIOREGIONS: GeographicalBioregion[] = [
  {
    id: 'congo-peatlands',
    name: 'Congo Basin Cuvette Centrale Peatlands',
    ecologicalType: 'Tropical Peatland Sanctuary & Carbon Sink',
    secondaryCategory: 'Peatland',
    country: 'DRC / Republic of Congo',
    coordinates: [0.22, 18.85],
    elevationMeters: 310,
    dominantRisk: 'EXISTENTIAL',
    activeAlertsCount: 2,
    description: 'World\'s most expansive tropical peatland complex storing ~30 billion tons of subsurface carbon.',
    stewardAssembly: 'Lokolama Indigenous Peat Guardians & COMIFAC Commission',
    tags: ['peatland', 'carbon sink', 'methane', 'wetland', 'congo basin', 'tropical', 'cuvette centrale', 'swamp']
  },
  {
    id: 'mara-serengeti',
    name: 'Mara-Serengeti Transboundary Basin',
    ecologicalType: 'Savanna Grassland & Wildlife Migratory Corridor',
    secondaryCategory: 'Savanna',
    country: 'Kenya / Tanzania',
    coordinates: [-1.50, 35.25],
    elevationMeters: 1540,
    dominantRisk: 'CRITICAL',
    activeAlertsCount: 3,
    description: 'Crucial ungulate migration highway and pastoralist rangeland protected by traditional communal grazing covenants.',
    stewardAssembly: 'Talek-Mara Pastoralist Ranger Collective & Mara Conservancy',
    tags: ['savanna', 'grassland', 'wildfire', 'pastoralist', 'mara', 'serengeti', 'wildlife', 'biodiversity']
  },
  {
    id: 'aberdare-water-tower',
    name: 'Aberdare Cloud Forest Water Tower',
    ecologicalType: 'Montane Cloud Forest & Riparian Catchment',
    secondaryCategory: 'Cloud Forest',
    country: 'Kenya',
    coordinates: [-0.45, 36.70],
    elevationMeters: 2860,
    dominantRisk: 'WARNING',
    activeAlertsCount: 1,
    description: 'High-altitude cloud forest watershed providing 80% of Nairobi\'s municipal freshwater and Tana River headwaters.',
    stewardAssembly: 'Aberdare Community Forest Association (CFA)',
    tags: ['cloud forest', 'water tower', 'montane', 'canopy', 'catchment', 'aberdare', 'freshwater', 'headwaters']
  },
  {
    id: 'turkana-basin',
    name: 'Turkana Deep Pastoralist Aquifer Basin',
    ecologicalType: 'Arid Subsurface Aquifer & Solar Microgrid Basin',
    secondaryCategory: 'Aquifer Basin',
    country: 'Kenya / Ethiopia',
    coordinates: [3.12, 35.60],
    elevationMeters: 360,
    dominantRisk: 'CRITICAL',
    activeAlertsCount: 1,
    description: 'Deep semi-fossil piezometric aquifers underpinning pastoralist drought resilience in the Great Rift basin.',
    stewardAssembly: 'Turkana Water Users Elders Assembly & Solar Well Co-op',
    tags: ['aquifer', 'groundwater', 'arid', 'piezometer', 'turkana', 'salinity', 'lotikipi', 'boreholes']
  },
  {
    id: 'rift-valley-lakes',
    name: 'Great Rift Valley Alkaline Lakes',
    ecologicalType: 'Alkaline Limnology & Eco-Acoustic Wetland',
    secondaryCategory: 'Alkaline Lake',
    country: 'Kenya',
    coordinates: [-0.35, 36.08],
    elevationMeters: 1750,
    dominantRisk: 'WARNING',
    activeAlertsCount: 1,
    description: 'Chain of soda lakes supporting global flamingo populations and fragile endemic micro-crustacean limnology.',
    stewardAssembly: 'Lake Nakuru Catchment Management Forum & Bioacoustic Mesh',
    tags: ['alkaline lake', 'wetland', 'siltation', 'limnology', 'rift valley', 'nakuru', 'naivasha', 'erosion']
  },
  {
    id: 'sahel-agroforestry',
    name: 'Sahelian Faidherbia Agro-Forestry Belt',
    ecologicalType: 'Agro-Silvopastoral Belt & Dryland Canopy',
    secondaryCategory: 'Agroforestry',
    country: 'Niger / Mali / Burkina Faso',
    coordinates: [13.51, 2.12],
    elevationMeters: 220,
    dominantRisk: 'WARNING',
    activeAlertsCount: 1,
    description: 'Dryland silvopastoral wall utilizing reverse-phenology native nitrogen-fixing Faidherbia albida trees.',
    stewardAssembly: 'Tillabéri Silvopastoral Stewardship Guild',
    tags: ['agroforestry', 'dryland', 'sahel', 'green wall', 'faidherbia', 'evapotranspiration', 'mulch', 'drought']
  },
  {
    id: 'kigali-watershed',
    name: 'Kigali Regenerative Urban Catchment',
    ecologicalType: 'Urban Sponge Wetland & Regenerative Eco-Quarter',
    secondaryCategory: 'Urban Sponge',
    country: 'Rwanda',
    coordinates: [-1.97, 30.10],
    elevationMeters: 1480,
    dominantRisk: 'ADVISORY',
    activeAlertsCount: 1,
    description: 'Pioneering mass timber urban quarters integrated with steep-slope terraced sponge wetlands.',
    stewardAssembly: 'Umuganda Watershed Restoration Circle & Kigali City Guild',
    tags: ['urban sponge', 'watershed', 'runoff', 'swale', 'kigali', 'timber', 'wetland terraces', 'sponge city']
  },
  {
    id: 'coastal-mangrove',
    name: 'Kilifi & Lamu Mangrove Biosphere Nursery',
    ecologicalType: 'Coastal Coral Reef & Mangrove Blue Carbon Biosphere',
    secondaryCategory: 'Mangrove',
    country: 'Kenya',
    coordinates: [-3.63, 39.85],
    elevationMeters: 4,
    dominantRisk: 'STABLE',
    activeAlertsCount: 0,
    description: 'Intertidal blue carbon barrier and fish nursery protecting coral fringing reefs from ocean surges.',
    stewardAssembly: 'Kilifi Beach Management Unit & Coastal Mangrove Stewards',
    tags: ['mangrove', 'marine', 'coral reef', 'blue carbon', 'estuary', 'coastal', 'kilifi', 'lamu']
  },
  {
    id: 'okavango-delta',
    name: 'Okavango Inflow Delta Sanctuary',
    ecologicalType: 'Inland Endorheic Wetland & Alluvial Fan',
    secondaryCategory: 'Wetland',
    country: 'Botswana / Namibia',
    coordinates: [-18.95, 22.55],
    elevationMeters: 930,
    dominantRisk: 'WARNING',
    activeAlertsCount: 1,
    description: 'Vast inland oasis pulsing seasonally with Kalahari basin hydrological recharge.',
    stewardAssembly: 'Okavango Basin River Commission (OKACOM)',
    tags: ['wetland', 'delta', 'endorheic', 'oasis', 'alluvial', 'okavango', 'inflow', 'kalahari']
  },
  {
    id: 'indo-gangetic',
    name: 'Indo-Gangetic Transboundary Aquifer',
    ecologicalType: 'Alluvial Deep Aquifer & Floodplain Agrarian Basin',
    secondaryCategory: 'Aquifer Basin',
    country: 'India / Nepal / Bangladesh',
    coordinates: [26.85, 80.94],
    elevationMeters: 120,
    dominantRisk: 'CRITICAL',
    activeAlertsCount: 1,
    description: 'World\'s most heavily extracted agricultural aquifer system subject to monsoonal recharge cycles.',
    stewardAssembly: 'Transboundary Ganges-Brahmaputra Water Council',
    tags: ['aquifer', 'alluvial', 'groundwater', 'monsoon', 'gangetic', 'floodplain', 'agrarian']
  }
];

interface BioregionalPredictiveSearchProps {
  onJumpToBioregion: (bioregion: GeographicalBioregion) => void;
  currentActiveBioregionId?: string;
  className?: string;
}

export const BioregionalPredictiveSearch: React.FC<BioregionalPredictiveSearchProps> = ({
  onJumpToBioregion,
  currentActiveBioregionId,
  className = ''
}) => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedCategoryChip, setSelectedCategoryChip] = useState<string>('ALL');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [activeJumpedBioregion, setActiveJumpedBioregion] = useState<GeographicalBioregion | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard shortcut listener: press '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' && 
        document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter bioregions based on query and category chip
  const filteredBioregions = useMemo(() => {
    const cleanQ = query.trim().toLowerCase();

    return KNOWN_GEOGRAPHICAL_BIOREGIONS.filter(region => {
      // Category filter
      if (selectedCategoryChip !== 'ALL' && region.secondaryCategory !== selectedCategoryChip) {
        return false;
      }

      if (!cleanQ) return true;

      // Search matching across: name, ecologicalType, secondaryCategory, country, tags
      const matchesName = region.name.toLowerCase().includes(cleanQ);
      const matchesEco = region.ecologicalType.toLowerCase().includes(cleanQ);
      const matchesCategory = region.secondaryCategory.toLowerCase().includes(cleanQ);
      const matchesCountry = region.country.toLowerCase().includes(cleanQ);
      const matchesTags = region.tags.some(t => t.toLowerCase().includes(cleanQ));

      return matchesName || matchesEco || matchesCategory || matchesCountry || matchesTags;
    });
  }, [query, selectedCategoryChip]);

  // Reset highlight index when results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredBioregions]);

  // Handle jump selection
  const handleSelectBioregion = (bioregion: GeographicalBioregion) => {
    audioFeedback.playSuccessChime();
    setActiveJumpedBioregion(bioregion);
    setIsOpen(false);
    setQuery('');
    onJumpToBioregion(bioregion);
  };

  // Keyboard navigation within dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % (filteredBioregions.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + filteredBioregions.length) % (filteredBioregions.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredBioregions[highlightedIndex]) {
        handleSelectBioregion(filteredBioregions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const getCategoryIcon = (cat: GeographicalBioregion['secondaryCategory']) => {
    switch (cat) {
      case 'Peatland': return <Wind className="w-3.5 h-3.5 text-purple-400" />;
      case 'Cloud Forest': return <TreePine className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Aquifer Basin': return <Droplets className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Savanna': return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'Alkaline Lake': return <Layers className="w-3.5 h-3.5 text-blue-400" />;
      case 'Mangrove': return <Globe2 className="w-3.5 h-3.5 text-teal-400" />;
      case 'Urban Sponge': return <MapPin className="w-3.5 h-3.5 text-lime-400" />;
      case 'Agroforestry': return <TreePine className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Wetland': return <Droplets className="w-3.5 h-3.5 text-blue-400" />;
      default: return <Compass className="w-3.5 h-3.5 text-[#C5A059]" />;
    }
  };

  const getRiskBadge = (risk: GeographicalBioregion['dominantRisk']) => {
    switch (risk) {
      case 'EXISTENTIAL':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-950 border border-rose-600 text-rose-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            EXISTENTIAL
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-orange-950 border border-orange-500 text-orange-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950 border border-amber-500/60 text-amber-300">
            WARNING
          </span>
        );
      case 'ADVISORY':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-950 border border-blue-500/60 text-blue-300">
            ADVISORY
          </span>
        );
      case 'STABLE':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/60 text-emerald-400">
            STABLE
          </span>
        );
    }
  };

  const quickCategories = ['ALL', 'Peatland', 'Cloud Forest', 'Aquifer Basin', 'Savanna', 'Alkaline Lake', 'Mangrove', 'Agroforestry'];

  return (
    <div 
      ref={containerRef} 
      id="bioregional-predictive-search-module"
      className={`relative w-full ${className}`}
    >
      {/* Search Input Bar */}
      <div className="flex flex-col gap-2">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#C5A059]">
            <Search className="w-4 h-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Predictive jump to bioregion by ecological type or name (e.g., Peatlands, Cloud Forest, Savanna, Mara)..."
            className="w-full pl-10 pr-24 py-2.5 bg-[#0A0F0C] border border-[#1B3022] hover:border-[#C5A059]/40 focus:border-[#C5A059] rounded-xl text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/40 outline-none transition-all shadow-inner"
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-md text-[#F5F5F0]/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#F5F5F0]/40 bg-black/40 border border-white/10 rounded">
              /
            </span>
          </div>
        </div>

        {/* Quick Filter Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
          <span className="text-[#F5F5F0]/40 text-[10px] shrink-0">Filter:</span>
          {quickCategories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                audioFeedback.playMicroTick();
                setSelectedCategoryChip(cat);
                setIsOpen(true);
              }}
              className={`px-2 py-0.5 rounded-full whitespace-nowrap text-[10px] transition-all cursor-pointer border ${
                selectedCategoryChip === cat
                  ? 'bg-[#C5A059] text-black font-bold border-[#C5A059] shadow-sm'
                  : 'bg-black/30 hover:bg-[#141E16] text-[#F5F5F0]/60 border-white/5 hover:border-[#C5A059]/30'
              }`}
            >
              {cat === 'ALL' ? 'All Types' : cat}
            </button>
          ))}

          {/* Jumped Bioregion Active Pill */}
          {activeJumpedBioregion && (
            <div className="ml-auto shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1B3022] border border-[#C5A059]/50 text-[#C5A059] text-[10px]">
              <MapPin className="w-3 h-3 text-[#C5A059]" />
              <span className="font-bold">Jumped: {activeJumpedBioregion.name}</span>
              <span className="text-[#F5F5F0]/40">[{activeJumpedBioregion.coordinates[0].toFixed(2)}°, {activeJumpedBioregion.coordinates[1].toFixed(2)}°]</span>
              <button
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setActiveJumpedBioregion(null);
                }}
                className="ml-1 hover:text-white cursor-pointer"
                title="Clear current focused bioregion"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Predictive Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#0B100D] border border-[#C5A059]/40 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 max-h-[380px] flex flex-col">
          <div className="px-3.5 py-2 bg-[#121B15] border-b border-[#1B3022] flex items-center justify-between text-[11px] font-mono text-[#F5F5F0]/60">
            <span className="flex items-center gap-1.5 text-[#C5A059]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Predictive Geographical Matching ({filteredBioregions.length} Bioregions)</span>
            </span>
            <span className="text-[10px] text-[#F5F5F0]/40 flex items-center gap-1">
              <span>Use</span>
              <kbd className="px-1 py-0.5 bg-black/40 border border-white/10 rounded">↑</kbd>
              <kbd className="px-1 py-0.5 bg-black/40 border border-white/10 rounded">↓</kbd>
              <span>+</span>
              <kbd className="px-1 py-0.5 bg-black/40 border border-white/10 rounded">Enter</kbd>
              <span>to jump</span>
            </span>
          </div>

          <div className="overflow-y-auto divide-y divide-[#1B3022]/60 p-1.5">
            {filteredBioregions.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-[#F5F5F0]/50 space-y-2">
                <Compass className="w-6 h-6 mx-auto text-[#C5A059]/50 animate-pulse" />
                <p>No bioregions found matching &ldquo;{query}&rdquo;</p>
                <p className="text-[10px] text-[#F5F5F0]/30">
                  Try searching for: Peatland, Cloud Forest, Aquifer, Savanna, Siltation, or Mara
                </p>
              </div>
            ) : (
              filteredBioregions.map((bioregion, idx) => {
                const isHighlighted = idx === highlightedIndex;
                const isCurrent = currentActiveBioregionId === bioregion.id || activeJumpedBioregion?.id === bioregion.id;

                return (
                  <div
                    key={bioregion.id}
                    onClick={() => handleSelectBioregion(bioregion)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`p-3 rounded-lg cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isHighlighted 
                        ? 'bg-[#152319] border border-[#C5A059]/40 shadow-sm' 
                        : isCurrent
                        ? 'bg-[#121B14] border border-emerald-500/30'
                        : 'hover:bg-[#121A14] border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1B3022]/80 border border-[#C5A059]/30 flex items-center justify-center shrink-0 mt-0.5">
                        {getCategoryIcon(bioregion.secondaryCategory)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-[#F5F5F0]">
                            {bioregion.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#1B3022] border border-[#C5A059]/20 text-[#C5A059]">
                            {bioregion.ecologicalType}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#F5F5F0]/60 flex-wrap">
                          <span className="flex items-center gap-1 text-[#F5F5F0]/80">
                            <MapPin className="w-3 h-3 text-[#C5A059]" />
                            {bioregion.country}
                          </span>
                          <span>•</span>
                          <span>Coordinates: [{bioregion.coordinates[0].toFixed(2)}°, {bioregion.coordinates[1].toFixed(2)}°]</span>
                          {bioregion.elevationMeters && (
                            <>
                              <span>•</span>
                              <span>Elev: {bioregion.elevationMeters}m</span>
                            </>
                          )}
                        </div>

                        <p className="text-[10px] font-sans text-[#F5F5F0]/60 line-clamp-1">
                          {bioregion.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {getRiskBadge(bioregion.dominantRisk)}
                      
                      <div className="flex items-center gap-1 text-[10px] font-mono text-[#C5A059] group-hover:translate-x-0.5 transition-transform">
                        <span>Jump to Map</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
