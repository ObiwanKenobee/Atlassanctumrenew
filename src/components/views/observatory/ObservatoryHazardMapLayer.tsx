import React, { useState, useMemo, useEffect } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Droplets, 
  TreeDeciduous, 
  Wind, 
  CloudRain, 
  Layers, 
  Radio, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  Filter, 
  MapPin, 
  Eye, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Compass, 
  ChevronRight,
  ExternalLink,
  Sliders,
  Thermometer,
  Gauge
} from 'lucide-react';
import { audioFeedback } from '../../../lib/audioFeedback';

export type StressIndicatorType = 
  | 'water_scarcity' 
  | 'wildfire_risk' 
  | 'canopy_stress' 
  | 'methane_plume' 
  | 'flood_surge'
  | 'soil_salinization';

export interface EcologicalStressZone {
  id: string;
  name: string;
  region: string;
  indicator: StressIndicatorType;
  coordinates: [number, number]; // [lat, lng]
  mapPos: { x: number; y: number }; // SVG percentage coordinate (0-100)
  severity: 'CRITICAL' | 'SEVERE' | 'MODERATE' | 'MONITORING';
  stressScore: number; // 0 - 100
  affectedAreaKm2: number;
  activeSensors: number;
  satelliteSources: string[];
  telemetryMetric: string;
  metricValue: string;
  baselineDelta: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  lastTelemetryTimestamp: string;
  merkleProofHash: string;
  recommendedIntervention: string;
  description: string;
}

export interface StressIndicatorConfig {
  type: StressIndicatorType;
  label: string;
  shortName: string;
  icon: React.ElementType;
  color: string;
  accentBg: string;
  borderColor: string;
  unit: string;
  description: string;
  satelliteConstellation: string;
  defaultThreshold: string;
}

export const STRESS_INDICATORS: StressIndicatorConfig[] = [
  {
    type: 'water_scarcity',
    label: 'Aquifer Deficit & Water Scarcity',
    shortName: 'Water Scarcity',
    icon: Droplets,
    color: '#38BDF8', // Cyan
    accentBg: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
    unit: 'm³ Drawdown',
    description: 'Subsurface aquifer drawdown, soil volumetric water content below wilting point, and baseflow cessation.',
    satelliteConstellation: 'NASA GRACE-FO & SMAP L-Band Radar',
    defaultThreshold: '< 0.12 cm³/cm³'
  },
  {
    type: 'wildfire_risk',
    label: 'Wildfire Risk & Thermal Fronts',
    shortName: 'Wildfire Risk',
    icon: Flame,
    color: '#F97316', // Orange
    accentBg: 'rgba(249, 115, 22, 0.12)',
    borderColor: 'rgba(249, 115, 22, 0.4)',
    unit: 'FRP (MW/km²)',
    description: 'Dry matter fuel moisture index, high thermal brightness temperature anomalies, and high fire radiative power.',
    satelliteConstellation: 'NOAA-20 VIIRS 375m & MODIS Aqua/Terra',
    defaultThreshold: '> 320 Kelvin'
  },
  {
    type: 'canopy_stress',
    label: 'Canopy Stress & Deforestation Deficits',
    shortName: 'Canopy Stress',
    icon: TreeDeciduous,
    color: '#EAB308', // Amber
    accentBg: 'rgba(234, 179, 8, 0.12)',
    borderColor: 'rgba(234, 179, 8, 0.4)',
    unit: 'NDVI Deviation',
    description: 'Rapid chlorophyll absorption drops, illegal logging acoustic spikes, and canopy water stress.',
    satelliteConstellation: 'ESA Sentinel-2 MSI (Red Edge/SWIR)',
    defaultThreshold: 'NDVI < 0.38'
  },
  {
    type: 'methane_plume',
    label: 'Methane Plumes & Emission Outliers',
    shortName: 'Methane Leaks',
    icon: Wind,
    color: '#A855F7', // Purple
    accentBg: 'rgba(168, 85, 247, 0.12)',
    borderColor: 'rgba(168, 85, 247, 0.4)',
    unit: 'ppb Column',
    description: 'Point-source anaerobic biomass rot, leaking fossil extraction vents, and unmonitored flare failures.',
    satelliteConstellation: 'Copernicus Sentinel-5P TROPOMI & GHGSat',
    defaultThreshold: '> 1,910 ppb'
  },
  {
    type: 'flood_surge',
    label: 'Flash Flood & Siltation Plumes',
    shortName: 'Flood Surge',
    icon: CloudRain,
    color: '#06B6D4', // Teal
    accentBg: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    unit: 'NTU Turbidity',
    description: 'High runoff velocity, riparian bank breach risk, and heavy agricultural topsoil siltation scouring.',
    satelliteConstellation: 'Copernicus Sentinel-1 SAR C-Band',
    defaultThreshold: '> 450 NTU'
  },
  {
    type: 'soil_salinization',
    label: 'Soil Salinization & Desertification',
    shortName: 'Soil Salinization',
    icon: Gauge,
    color: '#F43F5E', // Rose
    accentBg: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.4)',
    unit: 'dS/m Conductivity',
    description: 'Evaporative capillary salt accumulation, organic matter collapse, and crust formation.',
    satelliteConstellation: 'USGS Landsat-9 TIRS-2 & Ground Piezometers',
    defaultThreshold: '> 4.0 dS/m'
  }
];

export const MOCK_ECOLOGICAL_STRESS_ZONES: EcologicalStressZone[] = [
  {
    id: 'zone-turkana-water',
    name: 'Lotikipi Basin Aquifer Depletion Core',
    region: 'North Turkana Rift Corridor',
    indicator: 'water_scarcity',
    coordinates: [3.82, 35.12],
    mapPos: { x: 44, y: 22 },
    severity: 'CRITICAL',
    stressScore: 92,
    affectedAreaKm2: 3450,
    activeSensors: 28,
    satelliteSources: ['NASA GRACE-FO Gravity Mass', 'SMAP L-Band Radar #SM-09', 'Ground Piezometer Array #TK-4'],
    telemetryMetric: 'Static Water Level Deficit',
    metricValue: '-14.8m below 5-yr mean',
    baselineDelta: '-42% Volumetric Recharge',
    trend: 'increasing',
    lastTelemetryTimestamp: '9 minutes ago',
    merkleProofHash: '0x3f7a1029c84e1b52a938c01d93e82b7194a02c84',
    recommendedIntervention: 'Deep contour retention swales and sand dam cascade over ephemeral sand rivers to arrest runoff velocity.',
    description: 'Severe deep-aquifer static head collapse exacerbated by prolonged dry spells. Infiltration rates failing to offset pastoral extraction.'
  },
  {
    id: 'zone-mara-fire',
    name: 'Loita Hills Wildfire Front & Acacia Scrub',
    region: 'Narok South / Greater Mara Basin',
    indicator: 'wildfire_risk',
    coordinates: [-1.56, 35.84],
    mapPos: { x: 52, y: 58 },
    severity: 'CRITICAL',
    stressScore: 89,
    affectedAreaKm2: 1280,
    activeSensors: 42,
    satelliteSources: ['VIIRS 375m Thermal Band I4', 'MODIS Thermal Anomaly Terra', 'Acoustic Lookout Towers #LT-02'],
    telemetryMetric: 'Fire Radiative Power (FRP)',
    metricValue: '480 MW/km² peak',
    baselineDelta: '+310% vs Historic Baseline',
    trend: 'increasing',
    lastTelemetryTimestamp: '4 minutes ago',
    merkleProofHash: '0xaa9012f4581c7e93019842bf0912480e729a1b55',
    recommendedIntervention: 'Controlled biochar buffer perimeter trenches, community radio alert dispatch, and firebreak hydration sprays.',
    description: 'High wind shear and cured biomass fuel loading creating rapid thermal flare propagation across indigenous sacred cedar forests.'
  },
  {
    id: 'zone-mau-canopy',
    name: 'Mau Forest Complex Western Escarpment',
    region: 'Eastern Rift Highlands',
    indicator: 'canopy_stress',
    coordinates: [-0.42, 35.65],
    mapPos: { x: 48, y: 45 },
    severity: 'SEVERE',
    stressScore: 78,
    affectedAreaKm2: 2190,
    activeSensors: 64,
    satelliteSources: ['Sentinel-2 MSI Level-2A', 'Drone Orthomosaic Transect #MAU-14', 'Ground Acoustic Enclave #EN-09'],
    telemetryMetric: 'Canopy Water Stress (NDWI)',
    metricValue: '0.24 (Severe Desiccation)',
    baselineDelta: '-28% Moisture Retention',
    trend: 'increasing',
    lastTelemetryTimestamp: '12 minutes ago',
    merkleProofHash: '0x5c8e9b10427fa830192e4729103c84b729184a20',
    recommendedIntervention: 'Mycorrhizal inoculant drone re-seeding of indigenous Podocarpus and Bamboo riverine buffer corridors.',
    description: 'Selective illegal logging fragmentation and prolonged atmospheric vapor pressure deficit stressing native montane water towers.'
  },
  {
    id: 'zone-winam-methane',
    name: 'Winam Gulf Shallow Anaerobic Eutrophication',
    region: 'Lake Victoria Basin',
    indicator: 'methane_plume',
    coordinates: [-0.25, 34.72],
    mapPos: { x: 32, y: 44 },
    severity: 'SEVERE',
    stressScore: 74,
    affectedAreaKm2: 890,
    activeSensors: 19,
    satelliteSources: ['Sentinel-5P TROPOMI Ch4', 'In-Situ Dissolved Gas Buoys #WG-03', 'GHGSat Constellation'],
    telemetryMetric: 'Atmospheric CH4 Mixing Ratio',
    metricValue: '1,968 ppb (+88 ppb anomaly)',
    baselineDelta: '+18% Anaerobic Venting',
    trend: 'stable',
    lastTelemetryTimestamp: '18 minutes ago',
    merkleProofHash: '0x88f12a49c0182b740192e4829104b829104c81a9',
    recommendedIntervention: 'Biomass harvesting of invasive water hyacinth for anaerobic compost digesters and biochar sequestration.',
    description: 'Rotting water hyacinth biomass mats under high water temperatures releasing concentrated nocturnal methane plumes into the airshed.'
  },
  {
    id: 'zone-nyando-flood',
    name: 'Lower Nyando Floodplain Siltation Corridor',
    region: 'Kano Plains / Nyanza Basin',
    indicator: 'flood_surge',
    coordinates: [-0.18, 34.91],
    mapPos: { x: 35, y: 42 },
    severity: 'MODERATE',
    stressScore: 66,
    affectedAreaKm2: 670,
    activeSensors: 31,
    satelliteSources: ['Sentinel-1 SAR C-Band Flooding', 'Acoustic River Gauges #NY-08', 'NASA GPM Rain Radar'],
    telemetryMetric: 'Riparian Silt Turbidity',
    metricValue: '520 NTU (Topsoil Loss)',
    baselineDelta: '+85% Suspended Solids',
    trend: 'decreasing',
    lastTelemetryTimestamp: '25 minutes ago',
    merkleProofHash: '0x12b49c810482a71920384729104b72910482b192',
    recommendedIntervention: 'Vetiver grass terrace hedge planting, wetland restoration catchments, and upstream check-dam desilting.',
    description: 'High intensity flash precipitation flushing un-terraced agricultural slopes, silting Lake Victoria nursery bays.'
  },
  {
    id: 'zone-magadi-saline',
    name: 'Lake Magadi Southern Alluvial Plains',
    region: 'Southern Gregory Rift Valley',
    indicator: 'soil_salinization',
    coordinates: [-1.90, 36.28],
    mapPos: { x: 57, y: 65 },
    severity: 'MODERATE',
    stressScore: 62,
    affectedAreaKm2: 1120,
    activeSensors: 14,
    satelliteSources: ['USGS Landsat-9 SWIR Band', 'Ground Conductivity Probes #MG-02'],
    telemetryMetric: 'Electrical Conductivity (ECe)',
    metricValue: '6.4 dS/m (Saline Crust)',
    baselineDelta: '+34% Surface Efflorescence',
    trend: 'stable',
    lastTelemetryTimestamp: '42 minutes ago',
    merkleProofHash: '0x7e8192a01824719203847291048b72910481c9a0',
    recommendedIntervention: 'Halophyte agroforestry shelterbelts, biochar surface mulch, and gypsum biological leaching treatments.',
    description: 'Severe evaporative capillary pull precipitating alkaline sodium carbonate salts, degrading pastoral grazing biodiversity.'
  },
  {
    id: 'zone-cherangani-water',
    name: 'Cherangani Water Tower Cloud Basin Deficit',
    region: 'North Rift Highlands',
    indicator: 'water_scarcity',
    coordinates: [1.25, 35.45],
    mapPos: { x: 46, y: 32 },
    severity: 'SEVERE',
    stressScore: 81,
    affectedAreaKm2: 1750,
    activeSensors: 36,
    satelliteSources: ['NASA SMAP', 'GRACE-FO', 'High-Altitude Weather Stations'],
    telemetryMetric: 'Perennial Spring Baseflow',
    metricValue: '-32% Discharge Volume',
    baselineDelta: '-18% Below 10-Yr Mean',
    trend: 'increasing',
    lastTelemetryTimestamp: '15 minutes ago',
    merkleProofHash: '0x99281a04719203847291048b72910481c9a0182b',
    recommendedIntervention: 'Highland moss sponge restoration and cloud-catchment indigenous bamboo reforestation.',
    description: 'Loss of mossy cloud-forest interception layers accelerating runoff before subsurface aquifer can recharge.'
  },
  {
    id: 'zone-tsavo-fire',
    name: 'Tsavo West Volcanic Plains Fire Corridor',
    region: 'Coast Biosphere Hinterland',
    indicator: 'wildfire_risk',
    coordinates: [-2.95, 38.12],
    mapPos: { x: 74, y: 78 },
    severity: 'SEVERE',
    stressScore: 76,
    affectedAreaKm2: 2800,
    activeSensors: 25,
    satelliteSources: ['VIIRS 375m Active Fire', 'Landsat-9 Thermal Infrared'],
    telemetryMetric: 'Fuel Moisture Deficit',
    metricValue: '8% Live Fuel Moisture',
    baselineDelta: '+140% Fire Spread Velocity',
    trend: 'increasing',
    lastTelemetryTimestamp: '7 minutes ago',
    merkleProofHash: '0x4481029481a719203847291048b72910481c9a01',
    recommendedIntervention: 'Rotational pastoral firebreak grazing lines and drone thermal patrol surveillance.',
    description: 'Heavy dry grass fuel buildup following unseasonal rains drying rapidly under intense equatorial solar radiation.'
  }
];

interface ObservatoryHazardMapLayerProps {
  onInspectProvenance: (prov: any) => void;
  onOpenCommandCenter: () => void;
  onSelectZone?: (zone: EcologicalStressZone) => void;
}

export const ObservatoryHazardMapLayer: React.FC<ObservatoryHazardMapLayerProps> = ({
  onInspectProvenance,
  onOpenCommandCenter,
  onSelectZone
}) => {
  // Selected indicators for multi-indicator overlay (defaults to water & wildfire)
  const [activeIndicators, setActiveIndicators] = useState<StressIndicatorType[]>([
    'water_scarcity',
    'wildfire_risk',
    'canopy_stress'
  ]);
  const [selectedZone, setSelectedZone] = useState<EcologicalStressZone>(MOCK_ECOLOGICAL_STRESS_ZONES[0]);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'SEVERE' | 'MODERATE'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveSensorsCount, setLiveSensorsCount] = useState(249);
  const [lastRefreshedAt, setLastRefreshedAt] = useState('Just now');
  const [isAnimationActive, setIsAnimationActive] = useState(true);

  // Toggle indicator filter
  const toggleIndicator = (type: StressIndicatorType) => {
    audioFeedback.playMicroTick();
    setActiveIndicators(prev => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev; // keep at least 1 active
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Filtered stress zones
  const visibleZones = useMemo(() => {
    return MOCK_ECOLOGICAL_STRESS_ZONES.filter(zone => {
      const matchesIndicator = activeIndicators.includes(zone.indicator);
      const matchesSeverity = severityFilter === 'ALL' || zone.severity === severityFilter;
      return matchesIndicator && matchesSeverity;
    });
  }, [activeIndicators, severityFilter]);

  // Aggregate stats
  const aggregateMetrics = useMemo(() => {
    const totalArea = visibleZones.reduce((acc, z) => acc + z.affectedAreaKm2, 0);
    const avgStress = visibleZones.length > 0 
      ? Math.round(visibleZones.reduce((acc, z) => acc + z.stressScore, 0) / visibleZones.length)
      : 0;
    const criticalCount = visibleZones.filter(z => z.severity === 'CRITICAL').length;
    return { totalArea, avgStress, criticalCount };
  }, [visibleZones]);

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    audioFeedback.playSubtleClick();
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedAt('Just now');
      setLiveSensorsCount(prev => prev + Math.floor(Math.random() * 5) - 2);
      audioFeedback.playSuccessChime();
    }, 900);
  };

  const handleZoneClick = (zone: EcologicalStressZone) => {
    audioFeedback.playMicroTick();
    setSelectedZone(zone);
    if (onSelectZone) onSelectZone(zone);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls: Stress Indicator Selector & Live Telemetry Telemetry Banner */}
      <div className="p-4 sm:p-5 rounded-md bg-[#0D0D0D] border border-[#F5F5F0]/15 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-[#F5F5F0]/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[10px] font-mono uppercase text-rose-400 tracking-[0.2em] font-bold">
                REAL-TIME ECOLOGICAL HAZARD RADAR • MULTISPECTRAL STRESS TELEMETRY
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-[#F5F5F0] mt-1 flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Planetary Ecological Stress Indicators
            </h2>
            <p className="text-xs sm:text-sm text-[#F5F5F0]/70 font-sans mt-0.5">
              Multi-source satellite and in-situ IoT telemetry detecting early biophysical degradation, water table deficits, and active wildfire fronts before irreversible tipping points.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="refresh-hazard-telemetry-btn"
              onClick={handleRefreshTelemetry}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-sm bg-[#141414] hover:bg-[#1E1E1E] border border-[#F5F5F0]/20 text-[#F5F5F0] text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Orbital Telemetry'}</span>
            </button>

            <button
              onClick={() => onInspectProvenance(selectedZone)}
              className="px-3 py-1.5 rounded-sm bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ZKP Sensor Proof</span>
            </button>
          </div>
        </div>

        {/* Ecological Stress Indicator Pills (Interactive Toggles) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-wider flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-[#C5A059]" />
              Toggle Active Stress Indicators ({activeIndicators.length} of {STRESS_INDICATORS.length} Active)
            </span>
            <span className="text-[10px] font-mono text-[#F5F5F0]/40">Click pill to toggle layer</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {STRESS_INDICATORS.map(ind => {
              const Icon = ind.icon;
              const isActive = activeIndicators.includes(ind.type);
              const matchingCount = MOCK_ECOLOGICAL_STRESS_ZONES.filter(z => z.indicator === ind.type).length;

              return (
                <button
                  key={ind.type}
                  id={`hazard-indicator-pill-${ind.type}`}
                  onClick={() => toggleIndicator(ind.type)}
                  className={`p-2.5 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'border-opacity-100 shadow-md ring-1'
                      : 'bg-[#121212]/70 border-[#F5F5F0]/10 opacity-50 hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: isActive ? ind.accentBg : undefined,
                    borderColor: isActive ? ind.color : undefined,
                    boxShadow: isActive ? `0 0 12px ${ind.accentBg}` : undefined
                  }}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4" style={{ color: ind.color }} />
                    <span 
                      className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded"
                      style={{ 
                        backgroundColor: isActive ? ind.color : '#222', 
                        color: isActive ? '#000' : '#888' 
                      }}
                    >
                      {matchingCount} Zones
                    </span>
                  </div>

                  <div className="mt-2">
                    <div className="text-xs font-bold font-serif text-[#F5F5F0] truncate">
                      {ind.shortName}
                    </div>
                    <div className="text-[9px] font-mono text-[#F5F5F0]/50 truncate mt-0.5">
                      {ind.unit}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Aggregate Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#F5F5F0]/10 text-xs font-mono">
          <div className="p-2 bg-black/40 rounded border border-[#F5F5F0]/10">
            <span className="text-[#F5F5F0]/50 text-[10px] block uppercase">Active Stress Zones</span>
            <span className="text-base font-bold text-white">{visibleZones.length} Sectors</span>
          </div>
          <div className="p-2 bg-black/40 rounded border border-[#F5F5F0]/10">
            <span className="text-[#F5F5F0]/50 text-[10px] block uppercase">Critical Alert Fronts</span>
            <span className="text-base font-bold text-rose-400">{aggregateMetrics.criticalCount} Red Alert</span>
          </div>
          <div className="p-2 bg-black/40 rounded border border-[#F5F5F0]/10">
            <span className="text-[#F5F5F0]/50 text-[10px] block uppercase">Compounded Area Under Stress</span>
            <span className="text-base font-bold text-[#C5A059]">{aggregateMetrics.totalArea.toLocaleString()} km²</span>
          </div>
          <div className="p-2 bg-black/40 rounded border border-[#F5F5F0]/10">
            <span className="text-[#F5F5F0]/50 text-[10px] block uppercase">Orbital Telemetry Stream</span>
            <span className="text-base font-bold text-emerald-400 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              {liveSensorsCount} Nodes • {lastRefreshedAt}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Hazard Map Stage & Selected Zone Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-md bg-[#0D0D0D] border border-[#F5F5F0]/15 flex flex-col justify-between space-y-4 relative overflow-hidden">
          {/* Map Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-rose-950/80 text-rose-300 text-xs font-mono uppercase rounded-sm border border-rose-500/40 flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                Live Hazard Radar
              </span>
              <span className="text-xs font-mono text-[#F5F5F0]/70">
                Displaying: {visibleZones.length} Active Stress Vectors
              </span>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 border border-[#F5F5F0]/10 rounded-sm text-xs font-mono">
              {(['ALL', 'CRITICAL', 'SEVERE', 'MODERATE'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setSeverityFilter(sev);
                  }}
                  className={`px-2 py-0.5 rounded-sm transition-colors uppercase font-bold text-[10px] ${
                    severityFilter === sev
                      ? 'bg-[#F5F5F0] text-black'
                      : 'text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Graphical Map Canvas with Topography, Bioregional Boundaries, and Pulsing Stress Hotspots */}
          <div className="relative w-full h-[420px] sm:h-[480px] bg-[#070908] rounded-sm border border-[#F5F5F0]/10 overflow-hidden flex items-center justify-center">
            {/* Topography Grid Lines */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F43F5E_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#070908] via-transparent to-rose-950/20 pointer-events-none" />

            {/* Vector Topography & Watershed Corridors */}
            <svg className="w-full h-full text-slate-700/30 p-6" viewBox="0 0 800 500" fill="none">
              {/* Radar Sweep Effect */}
              {isAnimationActive && (
                <g className="origin-center animate-[spin_16s_linear_infinite]" style={{ transformOrigin: '400px 250px' }}>
                  <line x1="400" y1="250" x2="400" y2="20" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M 400 250 L 520 70 A 240 240 0 0 0 400 20 Z" fill="url(#radar-sweep-gradient)" opacity="0.15" />
                </g>
              )}

              <defs>
                <radialGradient id="radar-sweep-gradient" cx="0%" cy="0%" r="100%">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
                </radialGradient>
                <filter id="hazard-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Geographic Contour Lines: Rift Valley & Lake Basin */}
              <path
                d="M 180 60 Q 320 120 360 220 T 480 340 T 640 440"
                stroke="#F5F5F0"
                strokeWidth="1.5"
                strokeOpacity="0.2"
                strokeDasharray="6 4"
              />
              <path
                d="M 280 80 Q 380 180 440 280 T 520 420"
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeOpacity="0.3"
              />

              {/* Lake Victoria Basin Contour */}
              <ellipse cx="260" cy="240" rx="65" ry="85" fill="#38BDF8" fillOpacity="0.06" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 2" />
              {/* Lake Turkana Contour */}
              <path d="M 350 70 C 370 120, 360 180, 340 210" stroke="#38BDF8" strokeWidth="2.5" strokeOpacity="0.35" fill="none" />
              {/* Mount Kenya / Aberdares massif */}
              <circle cx="480" cy="260" r="30" stroke="#C5A059" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="2 2" />
            </svg>

            {/* Interactive Stress Zone Hotspot Markers */}
            {visibleZones.map((zone) => {
              const isSelected = zone.id === selectedZone.id;
              const config = STRESS_INDICATORS.find(c => c.type === zone.indicator) || STRESS_INDICATORS[0];
              const Icon = config.icon;

              return (
                <div
                  key={zone.id}
                  style={{ top: `${zone.mapPos.y}%`, left: `${zone.mapPos.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                  onClick={() => handleZoneClick(zone)}
                >
                  {/* Outer Pulsing Threat Ring */}
                  <div
                    className="absolute -inset-3 rounded-full animate-ping opacity-75 pointer-events-none"
                    style={{
                      backgroundColor: config.color,
                      animationDuration: zone.severity === 'CRITICAL' ? '1.8s' : '3s'
                    }}
                  />

                  {/* Threat Radius Visualizer (Halo) */}
                  <div
                    className="absolute -inset-5 rounded-full pointer-events-none transition-all duration-300"
                    style={{
                      backgroundColor: config.accentBg,
                      border: `1px solid ${config.borderColor}`,
                      transform: isSelected ? 'scale(1.4)' : 'scale(1)'
                    }}
                  />

                  {/* Central Node Badge */}
                  <div
                    className={`relative p-2 rounded-full border shadow-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'ring-4 scale-125 z-30'
                        : 'hover:scale-115'
                    }`}
                    style={{
                      backgroundColor: '#0A0A0A',
                      borderColor: config.color,
                      color: config.color,
                      ringColor: config.borderColor
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span 
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: zone.severity === 'CRITICAL' ? '#F43F5E' : config.color
                      }}
                    />
                  </div>

                  {/* Tooltip Card on Hover */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1.5 bg-[#0D0D0D]/95 border border-[#F5F5F0]/20 rounded text-[10px] font-mono text-[#F5F5F0] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-40 backdrop-blur-md">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
                      {zone.name}
                    </div>
                    <div className="text-[9px] text-[#F5F5F0]/60 mt-0.5">
                      Stress Score: <span className="font-bold text-rose-400">{zone.stressScore}/100</span> • {zone.severity}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bottom Floating Legend & Telemetry Bar */}
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-[#0A0A0A]/95 backdrop-blur-md border border-[#F5F5F0]/15 rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs font-mono z-30">
              <div className="flex items-center gap-2">
                <span className="text-[#F5F5F0]/50 text-[10px] uppercase">Threat Severity Legend:</span>
                <span className="flex items-center gap-1 text-rose-400 font-bold text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> CRITICAL (&gt;85)
                </span>
                <span className="text-[#F5F5F0]/20">•</span>
                <span className="text-amber-400 font-bold text-[10px]">SEVERE (70-85)</span>
                <span className="text-[#F5F5F0]/20">•</span>
                <span className="text-cyan-400 font-bold text-[10px]">MODERATE (&lt;70)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAnimationActive(!isAnimationActive)}
                  className="text-[10px] text-[#F5F5F0]/60 hover:text-white underline cursor-pointer"
                >
                  {isAnimationActive ? 'Pause Radar Sweep' : 'Resume Radar Sweep'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Hazard Zone Detailed Inspector Panel (1 Col) */}
        <div className="p-5 rounded-md bg-[#0D0D0D] border border-[#F5F5F0]/15 flex flex-col justify-between space-y-4 shadow-xl">
          {selectedZone ? (
            (() => {
              const config = STRESS_INDICATORS.find(c => c.type === selectedZone.indicator) || STRESS_INDICATORS[0];
              const Icon = config.icon;

              return (
                <div className="space-y-4 flex-1">
                  {/* Card Header */}
                  <div className="border-b border-[#F5F5F0]/10 pb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span 
                        className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1"
                        style={{
                          backgroundColor: config.accentBg,
                          color: config.color,
                          border: `1px solid ${config.borderColor}`
                        }}
                      >
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </span>

                      <span 
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          selectedZone.severity === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            : selectedZone.severity === 'SEVERE'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        {selectedZone.severity}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-white leading-tight">
                      {selectedZone.name}
                    </h3>
                    <div className="text-[11px] font-mono text-[#F5F5F0]/60 mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#C5A059]" />
                      <span>{selectedZone.region}</span>
                      <span className="text-[#F5F5F0]/30">•</span>
                      <span>[{selectedZone.coordinates[0].toFixed(2)}°, {selectedZone.coordinates[1].toFixed(2)}°]</span>
                    </div>
                  </div>

                  {/* Stress Score Gauge & Metric Highlight */}
                  <div className="p-3.5 rounded bg-black/60 border border-[#F5F5F0]/10 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#F5F5F0]/60">Ecological Stress Index:</span>
                      <span className="text-lg font-bold" style={{ color: config.color }}>
                        {selectedZone.stressScore}/100
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${selectedZone.stressScore}%`,
                          backgroundColor: config.color
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 rounded bg-[#111] border border-[#F5F5F0]/5">
                        <span className="text-[9px] font-mono text-[#F5F5F0]/50 block uppercase">Telemetry Reading</span>
                        <span className="text-xs font-mono font-bold text-white">{selectedZone.metricValue}</span>
                      </div>
                      <div className="p-2 rounded bg-[#111] border border-[#F5F5F0]/5">
                        <span className="text-[9px] font-mono text-[#F5F5F0]/50 block uppercase">Historic Baseline</span>
                        <span className="text-xs font-mono font-bold text-rose-400">{selectedZone.baselineDelta}</span>
                      </div>
                    </div>
                  </div>

                  {/* Narrative Description */}
                  <div className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed bg-[#111] p-3 rounded border border-[#F5F5F0]/10">
                    {selectedZone.description}
                  </div>

                  {/* Recommended Ecological Restoration Action */}
                  <div className="p-3 rounded bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Recommended Bioregional Intervention
                    </div>
                    <p className="text-xs text-white/90 font-sans leading-relaxed">
                      {selectedZone.recommendedIntervention}
                    </p>
                  </div>

                  {/* Satellite & Ground Verification Proof */}
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <span className="text-[#F5F5F0]/50 block uppercase text-[9px]">Sensory Ingest & Constellations:</span>
                    <div className="space-y-1">
                      {selectedZone.satelliteSources.map((source, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-[#F5F5F0]/70 bg-black/30 px-2 py-1 rounded border border-[#F5F5F0]/5">
                          <Radio className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="truncate">{source}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 text-[9px] text-[#F5F5F0]/40 flex items-center justify-between">
                      <span>Telemetry Root Hash:</span>
                      <span className="text-[#C5A059] truncate max-w-[140px] font-mono">{selectedZone.merkleProofHash}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-[#F5F5F0]/10 flex flex-col gap-2">
                    <button
                      onClick={onOpenCommandCenter}
                      className="w-full py-2 bg-[#1B3022] hover:bg-[#254530] text-emerald-300 border border-emerald-500/40 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Mobilize Intervention Mission</span>
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-mono text-[#F5F5F0]/40">
              Select any hazard zone marker to inspect real-time ecological stress telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
