import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  GitBranch, 
  Layers, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Filter, 
  Maximize2, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  Zap, 
  Droplet, 
  Trees, 
  Radio, 
  Boxes,
  Info,
  ExternalLink,
  Search,
  RefreshCw,
  Clock
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export type ResourceCategory = 'water_hydrology' | 'solar_microgrid' | 'soil_biochar' | 'agroforestry_corridor' | 'lora_telemetry' | 'civic_commons';

export interface ResourceNodeDeployment {
  id: string;
  name: string;
  category: ResourceCategory;
  categoryLabel: string;
  bioregionId: 'mara-serengeti' | 'aberdare-water' | 'rift-valley' | 'turkana-basin' | 'kilifi-coast';
  bioregionName: string;
  activationDate: string; // YYYY-MM-DD
  activationTimestamp: number;
  status: 'operational' | 'scaling' | 'commissioning';
  capacityMetric: string;
  capacityNumber: number;
  capacityUnit: string;
  stewardCommunity: string;
  provenanceHash: string;
  dependencies?: string[]; // IDs of precursor infrastructure nodes
  epistemicTier: string;
  impactScore: number; // 0-100
  coordinates: { lat: number; lng: number; geohash: string };
  description: string;
}

export const BIOREGIONS_METADATA = [
  { id: 'mara-serengeti', name: 'Mara-Serengeti Catchment', code: 'MSC', color: '#10B981', baseline: 'Savanna & Seasonal Tributaries' },
  { id: 'aberdare-water', name: 'Aberdare Water Tower', code: 'AWT', color: '#06B6D4', baseline: 'Montane Cloud Forest & Headwaters' },
  { id: 'rift-valley', name: 'Rift Valley Lakes Basin', code: 'RVL', color: '#C5A059', baseline: 'Endorheic Alkaline & Freshwater Lakes' },
  { id: 'turkana-basin', name: 'Turkana Solar Catchment', code: 'TSC', color: '#F59E0B', baseline: 'Arid Sun Belt & Paleowater Aquifers' },
  { id: 'kilifi-coast', name: 'Kilifi Coastal Mangroves', code: 'KCM', color: '#8B5CF6', baseline: 'Tidal Estuary & Blue Carbon Meadows' }
];

export const CATEGORY_CONFIG: Record<ResourceCategory, { label: string; color: string; icon: any }> = {
  water_hydrology: { label: 'Water & Hydrology', color: '#06B6D4', icon: Droplet },
  solar_microgrid: { label: 'Solar Microgrids', color: '#F59E0B', icon: Zap },
  soil_biochar: { label: 'Soil & Biochar', color: '#10B981', icon: Sparkles },
  agroforestry_corridor: { label: 'Agroforestry Corridors', color: '#22C55E', icon: Trees },
  lora_telemetry: { label: 'Telemetry & IoT Mesh', color: '#8B5CF6', icon: Radio },
  civic_commons: { label: 'Civic & Food Commons', color: '#C5A059', icon: Boxes }
};

export const REGENERATIVE_DEPLOYMENTS_DATA: ResourceNodeDeployment[] = [
  // Mara-Serengeti Catchment
  {
    id: 'dep-msc-01',
    name: 'Mara Subsurface Sand Dam Array #1',
    category: 'water_hydrology',
    categoryLabel: 'Water & Hydrology',
    bioregionId: 'mara-serengeti',
    bioregionName: 'Mara-Serengeti Catchment',
    activationDate: '2024-11-12',
    activationTimestamp: new Date('2024-11-12').getTime(),
    status: 'operational',
    capacityMetric: '4.8M Liters/Yr Retention',
    capacityNumber: 4.8,
    capacityUnit: 'M L/yr',
    stewardCommunity: 'Enonkishu Water Conservators',
    provenanceHash: '0x3a81f9b01284c719882a10',
    epistemicTier: 'Tier 1: ZK Piezometer Mesh',
    impactScore: 94,
    coordinates: { lat: -1.234, lng: 35.129, geohash: 'sb2p9x' },
    description: 'Tiered subsurface stone weirs creating dry-season sand aquifers and preventing flash soil erosion in cattle corridors.'
  },
  {
    id: 'dep-msc-02',
    name: 'Mara LoRaWAN Telemetry Spine',
    category: 'lora_telemetry',
    categoryLabel: 'Telemetry & IoT Mesh',
    bioregionId: 'mara-serengeti',
    bioregionName: 'Mara-Serengeti Catchment',
    activationDate: '2025-01-20',
    activationTimestamp: new Date('2025-01-20').getTime(),
    status: 'operational',
    capacityMetric: '24 Mesh Gateways (45km range)',
    capacityNumber: 24,
    capacityUnit: 'nodes',
    stewardCommunity: 'Mara Epistemic Sensor Guild',
    provenanceHash: '0x7b22e11894a028bc0192a4',
    dependencies: ['dep-msc-01'],
    epistemicTier: 'Tier 1: Real-time Quorum',
    impactScore: 89,
    coordinates: { lat: -1.250, lng: 35.150, geohash: 'sb2p9z' },
    description: 'Solar-buffered sub-GHz sensor gateway network monitoring water table depth and acoustic wildlife corridors.'
  },
  {
    id: 'dep-msc-03',
    name: 'Enonkishu Silvopasture Seed Sanctuary',
    category: 'agroforestry_corridor',
    categoryLabel: 'Agroforestry Corridors',
    bioregionId: 'mara-serengeti',
    bioregionName: 'Mara-Serengeti Catchment',
    activationDate: '2025-04-18',
    activationTimestamp: new Date('2025-04-18').getTime(),
    status: 'operational',
    capacityMetric: '85 Hectares Re-seeded Grassland',
    capacityNumber: 85,
    capacityUnit: 'ha',
    stewardCommunity: 'Maasai Pastoral Women Collective',
    provenanceHash: '0x99c84e10283b74a108f912',
    dependencies: ['dep-msc-01'],
    epistemicTier: 'Tier 2: Sentinel-2 Multispectral',
    impactScore: 92,
    coordinates: { lat: -1.210, lng: 35.180, geohash: 'sb2pbd' },
    description: 'Indigenous perennial fodder trees and deep-root perennial grasses rotated with regenerative holistically managed cattle herds.'
  },
  {
    id: 'dep-msc-04',
    name: 'Mara Solar Cold Chain Food Hub',
    category: 'civic_commons',
    categoryLabel: 'Civic & Food Commons',
    bioregionId: 'mara-serengeti',
    bioregionName: 'Mara-Serengeti Catchment',
    activationDate: '2025-09-05',
    activationTimestamp: new Date('2025-09-05').getTime(),
    status: 'operational',
    capacityMetric: '12 Metric Tons Fresh Produce Vault',
    capacityNumber: 12,
    capacityUnit: 'tons',
    stewardCommunity: 'Aitong Market Alliance',
    provenanceHash: '0x12a048bc71938fa2981044',
    dependencies: ['dep-msc-02'],
    epistemicTier: 'Tier 1: Cryptographic Ingestion',
    impactScore: 95,
    coordinates: { lat: -1.180, lng: 35.240, geohash: 'sb2pe1' },
    description: 'Direct-drive solar cooling preserving indigenous dairy surpluses and seasonal wild greens with zero post-harvest spoilage.'
  },

  // Aberdare Water Tower
  {
    id: 'dep-awt-01',
    name: 'Aberdare Ridge Headwater Piezometer Array',
    category: 'lora_telemetry',
    categoryLabel: 'Telemetry & IoT Mesh',
    bioregionId: 'aberdare-water',
    bioregionName: 'Aberdare Water Tower',
    activationDate: '2024-12-04',
    activationTimestamp: new Date('2024-12-04').getTime(),
    status: 'operational',
    capacityMetric: '32 Subsurface Hydrometric Probes',
    capacityNumber: 32,
    capacityUnit: 'probes',
    stewardCommunity: 'Kinangop Hydrological Rangers',
    provenanceHash: '0x44f128bc901a8823190847',
    epistemicTier: 'Tier 1: ZK Hydrometric Mesh',
    impactScore: 91,
    coordinates: { lat: -0.420, lng: 36.680, geohash: 'kz2m3x' },
    description: 'High-altitude telemetry tracking raincloud infiltration, springhead outflow rates, and soil moisture saturation coefficients.'
  },
  {
    id: 'dep-awt-02',
    name: 'Upper Chania Native Bamboo Bio-Filter Corridor',
    category: 'agroforestry_corridor',
    categoryLabel: 'Agroforestry Corridors',
    bioregionId: 'aberdare-water',
    bioregionName: 'Aberdare Water Tower',
    activationDate: '2025-03-14',
    activationTimestamp: new Date('2025-03-14').getTime(),
    status: 'operational',
    capacityMetric: '140 Hectares Riparian Native Bamboo',
    capacityNumber: 140,
    capacityUnit: 'ha',
    stewardCommunity: 'Aberdare Forest Guardians',
    provenanceHash: '0x6e9014ba88c12093019842',
    dependencies: ['dep-awt-01'],
    epistemicTier: 'Tier 2: UAV Lidar & Canopy Density',
    impactScore: 96,
    coordinates: { lat: -0.450, lng: 36.710, geohash: 'kz2m6a' },
    description: 'Native Yushania alpina bamboo bio-buffers eliminating agricultural silt runoff into Nairobi municipal reservoirs.'
  },
  {
    id: 'dep-awt-03',
    name: 'Kinangop Community Pyrolysis & Biochar Kilns',
    category: 'soil_biochar',
    categoryLabel: 'Soil & Biochar',
    bioregionId: 'aberdare-water',
    bioregionName: 'Aberdare Water Tower',
    activationDate: '2025-06-22',
    activationTimestamp: new Date('2025-06-22').getTime(),
    status: 'operational',
    capacityMetric: '350 Tons/Year Activated Biochar',
    capacityNumber: 350,
    capacityUnit: 'tons/yr',
    stewardCommunity: 'Highland Smallholder Federation',
    provenanceHash: '0xaa1829bc01928471908123',
    dependencies: ['dep-awt-02'],
    epistemicTier: 'Tier 1: Soil Organic Carbon GC-MS',
    impactScore: 93,
    coordinates: { lat: -0.510, lng: 36.640, geohash: 'kz2k9d' },
    description: 'Smokeless Kon-Tiki pyrolyzers converting invasive prunings into carbon-sequestering soil conditioners inoculated with EM microbes.'
  },
  {
    id: 'dep-awt-04',
    name: 'Aberdare Kinetic Pico-Hydro Microgrid',
    category: 'solar_microgrid',
    categoryLabel: 'Solar Microgrids',
    bioregionId: 'aberdare-water',
    bioregionName: 'Aberdare Water Tower',
    activationDate: '2026-02-10',
    activationTimestamp: new Date('2026-02-10').getTime(),
    status: 'scaling',
    capacityMetric: '180 kW Run-of-River Turbine Array',
    capacityNumber: 180,
    capacityUnit: 'kW',
    stewardCommunity: 'Gatamaiyu Hydro Commons',
    provenanceHash: '0xbb4910283c719084aa1928',
    dependencies: ['dep-awt-01', 'dep-awt-02'],
    epistemicTier: 'Tier 1: Smart Grid Meter Hash',
    impactScore: 90,
    coordinates: { lat: -0.580, lng: 36.720, geohash: 'kz2ke2' },
    description: 'Zero-damming Archimedes screw run-of-river hydro generation supplying clean basepower to 14 tea processing co-ops.'
  },

  // Rift Valley Lakes Basin
  {
    id: 'dep-rvl-01',
    name: 'Lake Naivasha Wetland Bio-Filtration Swales',
    category: 'water_hydrology',
    categoryLabel: 'Water & Hydrology',
    bioregionId: 'rift-valley',
    bioregionName: 'Rift Valley Lakes Basin',
    activationDate: '2025-02-05',
    activationTimestamp: new Date('2025-02-05').getTime(),
    status: 'operational',
    capacityMetric: '6.2M Liters/Day Effluent Polishing',
    capacityNumber: 6.2,
    capacityUnit: 'M L/day',
    stewardCommunity: 'Lake Naivasha Riparian Association',
    provenanceHash: '0xcc91823746a81920aa9128',
    epistemicTier: 'Tier 1: Spectrophotometric Mesh',
    impactScore: 94,
    coordinates: { lat: -0.710, lng: 36.350, geohash: 'kz27a1' },
    description: 'Constructed papyrus wetlands intercepting phosphate & nitrogen runoff before entering the freshwater lake core.'
  },
  {
    id: 'dep-rvl-02',
    name: 'Rift Geothermal Greenhouse Co-op Microgrid',
    category: 'solar_microgrid',
    categoryLabel: 'Solar Microgrids',
    bioregionId: 'rift-valley',
    bioregionName: 'Rift Valley Lakes Basin',
    activationDate: '2025-05-19',
    activationTimestamp: new Date('2025-05-19').getTime(),
    status: 'operational',
    capacityMetric: '420 kWp Agrivoltaic + Geothermal Heat',
    capacityNumber: 420,
    capacityUnit: 'kWp',
    stewardCommunity: 'Olkaria Clean Energy Cooperative',
    provenanceHash: '0xdd10293847561a8b091823',
    dependencies: ['dep-rvl-01'],
    epistemicTier: 'Tier 1: Inverter Scada Hash',
    impactScore: 95,
    coordinates: { lat: -0.890, lng: 36.310, geohash: 'kz24f9' },
    description: 'Co-locating elevated bifacial solar panels above organic shade vegetables with geothermal condensation water recapture.'
  },
  {
    id: 'dep-rvl-03',
    name: 'Lake Elementaita Regenerative Compost Depot',
    category: 'soil_biochar',
    categoryLabel: 'Soil & Biochar',
    bioregionId: 'rift-valley',
    bioregionName: 'Rift Valley Lakes Basin',
    activationDate: '2025-10-11',
    activationTimestamp: new Date('2025-10-11').getTime(),
    status: 'operational',
    capacityMetric: '520 Tons High-Bacterial Compost/Yr',
    capacityNumber: 520,
    capacityUnit: 'tons/yr',
    stewardCommunity: 'Kariandusi Soil Healers',
    provenanceHash: '0xee92837465019283771928',
    dependencies: ['dep-rvl-02'],
    epistemicTier: 'Tier 1: DNA Metagenomics Assays',
    impactScore: 91,
    coordinates: { lat: -0.460, lng: 36.250, geohash: 'kz2g3b' },
    description: 'Aerated thermophilic composting facility turning organic wastes into microbial-rich bio-inoculants for smallholder farms.'
  },
  {
    id: 'dep-rvl-04',
    name: 'Rift Bioregional Food Commons Exchange',
    category: 'civic_commons',
    categoryLabel: 'Civic & Food Commons',
    bioregionId: 'rift-valley',
    bioregionName: 'Rift Valley Lakes Basin',
    activationDate: '2026-04-02',
    activationTimestamp: new Date('2026-04-02').getTime(),
    status: 'scaling',
    capacityMetric: '650 Smallholder Mutual Credit Nodes',
    capacityNumber: 650,
    capacityUnit: 'members',
    stewardCommunity: 'Nakuru Basin Food Sovereignty Guild',
    provenanceHash: '0xff18293048571625901824',
    dependencies: ['dep-rvl-02', 'dep-rvl-03'],
    epistemicTier: 'Tier 1: Decentralized Mutual Ledger',
    impactScore: 93,
    coordinates: { lat: -0.280, lng: 36.070, geohash: 'kz2ug5' },
    description: 'Community-denominated exchange enabling smallholders to trade compost, seeds, and irrigation hours without fiat middlemen.'
  },

  // Turkana Solar Catchment
  {
    id: 'dep-tsc-01',
    name: 'Turkana Deep Aquifer Solar RO Desalination',
    category: 'water_hydrology',
    categoryLabel: 'Water & Hydrology',
    bioregionId: 'turkana-basin',
    bioregionName: 'Turkana Solar Catchment',
    activationDate: '2025-02-28',
    activationTimestamp: new Date('2025-02-28').getTime(),
    status: 'operational',
    capacityMetric: '1.8M Liters/Month Potable Water',
    capacityNumber: 1.8,
    capacityUnit: 'M L/mo',
    stewardCommunity: 'Lodwar Water Custodians',
    provenanceHash: '0x18293048571625aa910283',
    epistemicTier: 'Tier 1: Conductivity & Flow Meter Hash',
    impactScore: 97,
    coordinates: { lat: 3.120, lng: 35.600, geohash: 's9p31a' },
    description: 'Solar-powered reverse osmosis facility tapping brackish Lotikipi deep aquifers with brine recycled into spirulina cultivation.'
  },
  {
    id: 'dep-tsc-02',
    name: 'Turkana SunBelt 600kWp Agro-Microgrid',
    category: 'solar_microgrid',
    categoryLabel: 'Solar Microgrids',
    bioregionId: 'turkana-basin',
    bioregionName: 'Turkana Solar Catchment',
    activationDate: '2025-07-16',
    activationTimestamp: new Date('2025-07-16').getTime(),
    status: 'operational',
    capacityMetric: '600 kWp Bifacial Solar Array',
    capacityNumber: 600,
    capacityUnit: 'kWp',
    stewardCommunity: 'Turkana Solar Energy Cooperative',
    provenanceHash: '0x293048571625aa910283bb',
    dependencies: ['dep-tsc-01'],
    epistemicTier: 'Tier 1: Smart Inverter Cryptographic Log',
    impactScore: 98,
    coordinates: { lat: 3.140, lng: 35.620, geohash: 's9p34c' },
    description: 'Decentralized desert microgrid providing power for water pumping, community cold vaults, and nighttime education centers.'
  },
  {
    id: 'dep-tsc-03',
    name: 'Desert Spirulina Bio-Protein Sanctuaries',
    category: 'civic_commons',
    categoryLabel: 'Civic & Food Commons',
    bioregionId: 'turkana-basin',
    bioregionName: 'Turkana Solar Catchment',
    activationDate: '2025-11-20',
    activationTimestamp: new Date('2025-11-20').getTime(),
    status: 'operational',
    capacityMetric: '4.5 Tons/Year Organic Spirulina',
    capacityNumber: 4.5,
    capacityUnit: 'tons/yr',
    stewardCommunity: 'Turkana Women Nutrition Vanguard',
    provenanceHash: '0x3048571625aa910283bbcc',
    dependencies: ['dep-tsc-01', 'dep-tsc-02'],
    epistemicTier: 'Tier 1: Spectrophotometric Density',
    impactScore: 95,
    coordinates: { lat: 3.160, lng: 35.640, geohash: 's9p37e' },
    description: 'Closed-loop raceway ponds converting solar energy and residual RO minerals into dense bio-available protein for child nutrition.'
  },
  {
    id: 'dep-tsc-04',
    name: 'Turkana Mobile Pastoral IoT Collar Mesh',
    category: 'lora_telemetry',
    categoryLabel: 'Telemetry & IoT Mesh',
    bioregionId: 'turkana-basin',
    bioregionName: 'Turkana Solar Catchment',
    activationDate: '2026-05-14',
    activationTimestamp: new Date('2026-05-14').getTime(),
    status: 'commissioning',
    capacityMetric: '1,200 Satellite-Linked Camel GPS Collars',
    capacityNumber: 1200,
    capacityUnit: 'collars',
    stewardCommunity: 'Northern Rangeland Pastoral Council',
    provenanceHash: '0x48571625aa910283bbccdd',
    dependencies: ['dep-tsc-02'],
    epistemicTier: 'Tier 1: Real-time LoRa Packet Signatures',
    impactScore: 88,
    coordinates: { lat: 3.250, lng: 35.700, geohash: 's9p90k' },
    description: 'Livestock tracking collars alerting pastoralists to newly sprouted desert rangeland based on satellite rain radar.'
  },

  // Kilifi Coastal Mangroves
  {
    id: 'dep-kcm-01',
    name: 'Kilifi Creek Tidal Channel Re-inundation Weir',
    category: 'water_hydrology',
    categoryLabel: 'Water & Hydrology',
    bioregionId: 'kilifi-coast',
    bioregionName: 'Kilifi Coastal Mangroves',
    activationDate: '2024-12-28',
    activationTimestamp: new Date('2024-12-28').getTime(),
    status: 'operational',
    capacityMetric: '18km Restored Estuary Hydrology',
    capacityNumber: 18,
    capacityUnit: 'km',
    stewardCommunity: 'Mida Creek Mangrove Protectors',
    provenanceHash: '0x571625aa910283bbccdde',
    epistemicTier: 'Tier 1: Acoustic Tidal Flow Gauges',
    impactScore: 93,
    coordinates: { lat: -3.630, lng: 39.850, geohash: 'sb6h2k' },
    description: 'Permeable tidal gates removing stagnant dikes, restoring natural twice-daily saline flushing to 320 hectares of degraded mangrove mudflats.'
  },
  {
    id: 'dep-kcm-02',
    name: 'Mida Creek Avicennia Indigenous Nursery',
    category: 'agroforestry_corridor',
    categoryLabel: 'Agroforestry Corridors',
    bioregionId: 'kilifi-coast',
    bioregionName: 'Kilifi Coastal Mangroves',
    activationDate: '2025-04-08',
    activationTimestamp: new Date('2025-04-08').getTime(),
    status: 'operational',
    capacityMetric: '450,000 Mangrove Seedlings/Year',
    capacityNumber: 450000,
    capacityUnit: 'seedlings',
    stewardCommunity: 'Kilifi Youth Coastal Stewardship',
    provenanceHash: '0x71625aa910283bbccddeef',
    dependencies: ['dep-kcm-01'],
    epistemicTier: 'Tier 2: Sentinel-2 Blue Carbon Assay',
    impactScore: 97,
    coordinates: { lat: -3.340, lng: 40.010, geohash: 'sb6nx7' },
    description: 'Community nursery propogating 7 indigenous mangrove species for blue carbon sediment stabilization and prawn nursery beds.'
  },
  {
    id: 'dep-kcm-03',
    name: 'Kilifi Coastal Blue Carbon Acoustic Mesh',
    category: 'lora_telemetry',
    categoryLabel: 'Telemetry & IoT Mesh',
    bioregionId: 'kilifi-coast',
    bioregionName: 'Kilifi Coastal Mangroves',
    activationDate: '2025-08-30',
    activationTimestamp: new Date('2025-08-30').getTime(),
    status: 'operational',
    capacityMetric: '16 Submersible Hydrophone Nodes',
    capacityNumber: 16,
    capacityUnit: 'hydrophones',
    stewardCommunity: 'Marine Epistemic Acoustics Guild',
    provenanceHash: '0x82625aa910283bbccddeef0',
    dependencies: ['dep-kcm-01', 'dep-kcm-02'],
    epistemicTier: 'Tier 1: Bioacoustic AI Snapping Shrimp Index',
    impactScore: 94,
    coordinates: { lat: -3.360, lng: 40.030, geohash: 'sb6nx9' },
    description: 'Continuous underwater bioacoustic monitoring calculating mangrove benthic health through snapping shrimp pulse frequencies.'
  },
  {
    id: 'dep-kcm-04',
    name: 'Kilifi Artisanal Fishermen Solar Ice Hub',
    category: 'solar_microgrid',
    categoryLabel: 'Solar Microgrids',
    bioregionId: 'kilifi-coast',
    bioregionName: 'Kilifi Coastal Mangroves',
    activationDate: '2026-03-18',
    activationTimestamp: new Date('2026-03-18').getTime(),
    status: 'scaling',
    capacityMetric: '8 Tons/Day Solar Slurry Flake Ice',
    capacityNumber: 8,
    capacityUnit: 'tons/day',
    stewardCommunity: 'Kilifi Boatowners Association',
    provenanceHash: '0x93625aa910283bbccddeef1',
    dependencies: ['dep-kcm-01'],
    epistemicTier: 'Tier 1: Smart Thermal Energy Ledger',
    impactScore: 96,
    coordinates: { lat: -3.610, lng: 39.860, geohash: 'sb6h3e' },
    description: 'Seawater ice-making plant powered directly by rooftop solar eliminating reliance on diesel cooling and predatory fish dealers.'
  }
];

interface ResourceActivationTimelineD3Props {
  onInspectNode?: (node: ResourceNodeDeployment) => void;
  onOpenAuditTrail?: (provenance: any) => void;
}

export const ResourceActivationTimelineD3: React.FC<ResourceActivationTimelineD3Props> = ({
  onInspectNode,
  onOpenAuditTrail
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Filter States
  const [selectedBioregion, setSelectedBioregion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<ResourceNodeDeployment>(REGENERATIVE_DEPLOYMENTS_DATA[0]);
  const [hoveredNode, setHoveredNode] = useState<ResourceNodeDeployment | null>(null);

  // SVG dimensions
  const [dimensions, setDimensions] = useState({ width: 900, height: 460 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      if (width > 0) {
        setDimensions({
          width: Math.max(480, width),
          height: 480
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Filtered Deployments
  const filteredDeployments = useMemo(() => {
    return REGENERATIVE_DEPLOYMENTS_DATA.filter((node) => {
      const matchBioregion = selectedBioregion === 'all' || node.bioregionId === selectedBioregion;
      const matchCategory = selectedCategory === 'all' || node.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.stewardCommunity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.capacityMetric.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBioregion && matchCategory && matchSearch;
    });
  }, [selectedBioregion, selectedCategory, searchQuery]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = REGENERATIVE_DEPLOYMENTS_DATA.length;
    const operational = REGENERATIVE_DEPLOYMENTS_DATA.filter(d => d.status === 'operational').length;
    const scaling = REGENERATIVE_DEPLOYMENTS_DATA.filter(d => d.status === 'scaling').length;
    const commissioning = REGENERATIVE_DEPLOYMENTS_DATA.filter(d => d.status === 'commissioning').length;
    const avgImpact = Math.round(REGENERATIVE_DEPLOYMENTS_DATA.reduce((acc, d) => acc + d.impactScore, 0) / total);
    return { total, operational, scaling, commissioning, avgImpact };
  }, []);

  // D3 Rendering of Horizontal Swimlane Timeline
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 40, right: 40, bottom: 50, left: 160 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Determine Bioregions to display as swimlanes on Y-axis
    const activeBioregions = selectedBioregion === 'all' 
      ? BIOREGIONS_METADATA 
      : BIOREGIONS_METADATA.filter(b => b.id === selectedBioregion);

    // Y Scale: Band scale for Bioregions
    const yScale = d3.scaleBand()
      .domain(activeBioregions.map(b => b.id))
      .range([0, innerHeight])
      .padding(0.2);

    // X Scale: Chronological Time Scale spanning from Oct 2024 to Oct 2026
    const minDate = new Date('2024-10-01').getTime();
    const maxDate = new Date('2026-09-30').getTime();

    const xScale = d3.scaleTime()
      .domain([new Date(minDate), new Date(maxDate)])
      .range([0, innerWidth]);

    // Definitions: Glows & Gradients
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'node-glow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Swimlane Backgrounds & Separator Lines
    activeBioregions.forEach((bio, idx) => {
      const y = yScale(bio.id) || 0;
      const laneHeight = yScale.bandwidth();

      // Alternating subtle lane fill
      g.append('rect')
        .attr('x', 0)
        .attr('y', y)
        .attr('width', innerWidth)
        .attr('height', laneHeight)
        .attr('fill', idx % 2 === 0 ? '#0B0D0C' : '#070908')
        .attr('rx', 4)
        .attr('stroke', '#1E2320')
        .attr('stroke-width', 0.5);

      // Lane Guide Line through vertical center
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', y + laneHeight / 2)
        .attr('y2', y + laneHeight / 2)
        .attr('stroke', bio.color)
        .attr('stroke-opacity', 0.15)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4 4');

      // Bioregion Label on Left Margin
      const labelGroup = svg.append('g')
        .attr('transform', `translate(${margin.left - 12}, ${margin.top + y + laneHeight / 2})`);

      labelGroup.append('text')
        .attr('text-anchor', 'end')
        .attr('dy', '-2px')
        .attr('fill', bio.color)
        .attr('font-size', '11px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text(bio.name);

      labelGroup.append('text')
        .attr('text-anchor', 'end')
        .attr('dy', '11px')
        .attr('fill', '#888')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .text(`[${bio.code}] • ${bio.baseline}`);
    });

    // Vertical Month Time Markers
    const timeTicks = [
      new Date('2024-11-01'),
      new Date('2025-01-01'),
      new Date('2025-04-01'),
      new Date('2025-07-01'),
      new Date('2025-10-01'),
      new Date('2026-01-01'),
      new Date('2026-04-01'),
      new Date('2026-07-01')
    ];

    timeTicks.forEach((tickDate) => {
      const x = xScale(tickDate);
      if (x >= 0 && x <= innerWidth) {
        g.append('line')
          .attr('x1', x)
          .attr('x2', x)
          .attr('y1', 0)
          .attr('y2', innerHeight)
          .attr('stroke', '#2A302C')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3 3');
      }
    });

    // Today / Present Marker Line
    const presentX = xScale(new Date('2026-09-13'));
    if (presentX >= 0 && presentX <= innerWidth) {
      g.append('line')
        .attr('x1', presentX)
        .attr('x2', presentX)
        .attr('y1', -10)
        .attr('y2', innerHeight)
        .attr('stroke', '#C5A059')
        .attr('stroke-width', 1.5);

      g.append('text')
        .attr('x', presentX)
        .attr('y', -14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#C5A059')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text('PRESENT EPOCH (SEP 2026)');
    }

    // Dependency Links (Curved propagation arcs between prerequisite nodes)
    const linkGroup = g.append('g').attr('class', 'dependency-links');

    filteredDeployments.forEach((sourceNode) => {
      if (!sourceNode.dependencies || sourceNode.dependencies.length === 0) return;

      const sourceLaneY = yScale(sourceNode.bioregionId);
      if (sourceLaneY === undefined) return;
      const sourceY = sourceLaneY + yScale.bandwidth() / 2;
      const sourceX = xScale(new Date(sourceNode.activationTimestamp));

      sourceNode.dependencies.forEach((depId) => {
        const targetNode = REGENERATIVE_DEPLOYMENTS_DATA.find(d => d.id === depId);
        if (!targetNode) return;

        const targetLaneY = yScale(targetNode.bioregionId);
        if (targetLaneY === undefined) return;
        const targetY = targetLaneY + yScale.bandwidth() / 2;
        const targetX = xScale(new Date(targetNode.activationTimestamp));

        // Draw curved Bezier path
        const dx = sourceX - targetX;
        const path = d3.path();
        path.moveTo(targetX, targetY);
        path.bezierCurveTo(
          targetX + dx * 0.5, targetY,
          targetX + dx * 0.5, sourceY,
          sourceX, sourceY
        );

        linkGroup.append('path')
          .attr('d', path.toString())
          .attr('fill', 'none')
          .attr('stroke', '#C5A059')
          .attr('stroke-opacity', 0.25)
          .attr('stroke-width', 1.2)
          .attr('stroke-dasharray', '3 3');
      });
    });

    // Render Resource Nodes
    const nodeGroup = g.append('g').attr('class', 'resource-nodes');

    filteredDeployments.forEach((node) => {
      const laneY = yScale(node.bioregionId);
      if (laneY === undefined) return;

      const cx = xScale(new Date(node.activationTimestamp));
      const cy = laneY + yScale.bandwidth() / 2;
      const isSelected = selectedNode.id === node.id;
      const isHovered = hoveredNode?.id === node.id;
      const categoryStyle = CATEGORY_CONFIG[node.category] || CATEGORY_CONFIG.water_hydrology;

      const itemG = nodeGroup.append('g')
        .attr('class', 'cursor-pointer')
        .attr('transform', `translate(${cx}, ${cy})`);

      // Outer Selection Halo
      if (isSelected || isHovered) {
        itemG.append('circle')
          .attr('r', 18)
          .attr('fill', 'none')
          .attr('stroke', categoryStyle.color)
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', isSelected ? '4 2' : 'none')
          .attr('opacity', 0.8)
          .attr('filter', 'url(#node-glow)');
      }

      // Status Indicator Ring
      itemG.append('circle')
        .attr('r', 11)
        .attr('fill', '#0E1210')
        .attr('stroke', categoryStyle.color)
        .attr('stroke-width', isSelected ? 2.5 : 1.8);

      // Inner Core Glyph
      itemG.append('circle')
        .attr('r', node.status === 'operational' ? 5.5 : 4)
        .attr('fill', node.status === 'commissioning' ? '#EAB308' : categoryStyle.color)
        .attr('opacity', 0.95);

      // Floating Compact Node Name Label
      itemG.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('fill', isSelected ? '#FFFFFF' : '#A3ABA6')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .attr('font-weight', isSelected ? 'bold' : 'normal')
        .text(node.name.length > 22 ? `${node.name.substring(0, 20)}…` : node.name);

      // Date Tag Badge Above Node
      itemG.append('text')
        .attr('x', 0)
        .attr('y', -15)
        .attr('text-anchor', 'middle')
        .attr('fill', categoryStyle.color)
        .attr('font-size', '8px')
        .attr('font-family', 'monospace')
        .attr('opacity', 0.85)
        .text(node.activationDate);

      // Hit area
      const hitCircle = itemG.append('circle')
        .attr('r', 22)
        .attr('fill', 'transparent');

      hitCircle.on('mouseenter', () => {
        setHoveredNode(node);
      });

      hitCircle.on('mouseleave', () => {
        setHoveredNode(null);
      });

      hitCircle.on('click', () => {
        audioFeedback.playMicroTick();
        setSelectedNode(node);
        if (onInspectNode) onInspectNode(node);
      });
    });

    // Bottom X-Axis (Dates)
    const xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeMonth.every(2))
      .tickFormat((d) => d3.timeFormat('%b %Y')(d as Date));

    const xAxisG = g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);

    xAxisG.select('.domain').attr('stroke', '#333835');
    xAxisG.selectAll('.tick line').attr('stroke', '#333835');
    xAxisG.selectAll('.tick text')
      .attr('fill', '#8E9490')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('dy', '10px');

  }, [dimensions, selectedBioregion, filteredDeployments, selectedNode, hoveredNode, onInspectNode]);

  const displayNode = hoveredNode || selectedNode;

  return (
    <div 
      id="resource-activation-timeline-d3-card"
      className="p-5 sm:p-6 rounded-md bg-[#0D0D0D] border border-[#F5F5F0]/15 space-y-6 shadow-xl"
    >
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              BIOREGIONAL RESOURCE INFRASTRUCTURE ACTIVATION TIMELINE
            </span>
            <span className="text-[9px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-2 py-0.2 rounded font-bold">
              {summaryMetrics.operational} Active Nodes
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif text-[#F5F5F0] flex items-center gap-2.5">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            Regenerative Resource Deployment Mesh
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 font-sans max-w-2xl">
            Horizontal timeline tracking the chronological commissioning, operational scaling, and cross-bioregional dependencies of decentralized hydrological, energy, and ecological commons.
          </p>
        </div>

        {/* Global Summary KPI Pills */}
        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          <div className="px-3 py-1.5 bg-[#080A09] border border-cyan-500/30 rounded flex items-center gap-2">
            <Droplet className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white font-bold">{summaryMetrics.total}</span>
            <span className="text-[#888] text-[10px]">Total Nodes</span>
          </div>
          <div className="px-3 py-1.5 bg-[#080A09] border border-emerald-500/30 rounded flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">{summaryMetrics.operational}</span>
            <span className="text-[#888] text-[10px]">Operational</span>
          </div>
          <div className="px-3 py-1.5 bg-[#080A09] border border-amber-500/30 rounded flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-bold">{summaryMetrics.avgImpact}%</span>
            <span className="text-[#888] text-[10px]">Avg Impact</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar: Bioregions, Categories, and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[#070908] p-3 rounded border border-[#F5F5F0]/10 font-mono text-xs">
        {/* Bioregion Dropdown */}
        <div className="sm:col-span-4 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
          <span className="text-[10px] text-[#888] uppercase shrink-0">Bioregion:</span>
          <select
            id="resource-timeline-bioregion-filter"
            value={selectedBioregion}
            onChange={(e) => {
              audioFeedback.playMicroTick();
              setSelectedBioregion(e.target.value);
            }}
            className="w-full bg-[#111] text-white border border-[#F5F5F0]/20 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-[#C5A059] cursor-pointer"
          >
            <option value="all">All Bioregions (Swimlanes)</option>
            {BIOREGIONS_METADATA.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-4 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-[10px] text-[#888] uppercase shrink-0">Resource:</span>
          <select
            id="resource-timeline-category-filter"
            value={selectedCategory}
            onChange={(e) => {
              audioFeedback.playMicroTick();
              setSelectedCategory(e.target.value);
            }}
            className="w-full bg-[#111] text-white border border-[#F5F5F0]/20 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="all">All Resource Types</option>
            {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Search Field */}
        <div className="sm:col-span-4 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-[#888] shrink-0" />
          <input
            id="resource-timeline-search-input"
            type="text"
            placeholder="Search nodes or stewards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111] text-white border border-[#F5F5F0]/20 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-400 placeholder-[#555]"
          />
        </div>
      </div>

      {/* Main D3 Timeline Stage */}
      <div 
        ref={containerRef}
        className="w-full relative bg-[#060807] rounded border border-[#F5F5F0]/10 p-2 sm:p-4 overflow-x-auto"
      >
        <svg 
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-auto overflow-visible select-none min-w-[650px]"
        />

        {/* Legend Bar below Timeline Canvas */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F5F5F0]/10 text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            {Object.entries(CATEGORY_CONFIG).map(([k, conf]) => (
              <div key={k} className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: conf.color }} />
                <span className="text-[#C8CECA]">{conf.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[10px] text-[#888]">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 border-t border-dashed border-[#C5A059]" />
              Dependency Arcs
            </span>
            <span>• Click node to pin inspection</span>
          </div>
        </div>
      </div>

      {/* Detailed Node Inspector Card */}
      {displayNode && (
        <div className="p-4 sm:p-5 rounded bg-[#080B0A] border border-cyan-500/30 flex flex-col md:flex-row items-start justify-between gap-5 font-mono text-xs animate-in fade-in duration-200">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span 
                className="px-2 py-0.5 rounded text-[10px] font-bold border"
                style={{
                  backgroundColor: `${CATEGORY_CONFIG[displayNode.category]?.color}20`,
                  color: CATEGORY_CONFIG[displayNode.category]?.color || '#06B6D4',
                  borderColor: `${CATEGORY_CONFIG[displayNode.category]?.color}50`
                }}
              >
                {displayNode.categoryLabel}
              </span>
              <span className="text-[#C5A059] font-bold">{displayNode.bioregionName}</span>
              <span className="text-[#555]">•</span>
              <span className="text-white flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#888]" />
                Activated: {displayNode.activationDate}
              </span>
              <span className="text-[#555]">•</span>
              <span className={`px-2 py-0.2 rounded text-[9px] uppercase font-bold ${
                displayNode.status === 'operational' 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}>
                {displayNode.status}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-serif text-white flex items-center gap-2">
              {displayNode.name}
            </h3>

            <p className="text-xs text-[#C8CECA] font-sans leading-relaxed">
              {displayNode.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-[#888]">
              <div>
                <span className="text-[#555] uppercase block text-[9px]">Steward Community:</span>
                <span className="text-white font-bold">{displayNode.stewardCommunity}</span>
              </div>
              <div>
                <span className="text-[#555] uppercase block text-[9px]">Verified Capacity:</span>
                <span className="text-cyan-400 font-bold">{displayNode.capacityMetric}</span>
              </div>
              <div>
                <span className="text-[#555] uppercase block text-[9px]">Epistemic Tier:</span>
                <span className="text-emerald-400 font-bold">{displayNode.epistemicTier}</span>
              </div>
              <div>
                <span className="text-[#555] uppercase block text-[9px]">Geohash Anchor:</span>
                <span className="text-amber-400 font-bold">{displayNode.coordinates.geohash}</span>
              </div>
            </div>

            <div className="text-[10px] text-[#666] pt-1 truncate">
              Merkle Tree Provenance: <span className="text-[#AAA]">{displayNode.provenanceHash}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-[#F5F5F0]/10 md:pl-5">
            <div className="text-left md:text-right">
              <span className="text-[10px] text-[#888] block uppercase">Systemic Impact Score</span>
              <div className="flex items-baseline gap-1 md:justify-end">
                <span className="text-2xl font-bold text-white">{displayNode.impactScore}</span>
                <span className="text-xs text-emerald-400 font-bold">/ 100</span>
              </div>
              <span className="text-[9px] text-[#666]">Decoupled Resilience Contribution</span>
            </div>

            <button
              id="inspect-node-audit-trail-btn"
              onClick={() => {
                audioFeedback.playCovenantResonance();
                if (onOpenAuditTrail) {
                  onOpenAuditTrail({
                    metricName: displayNode.name,
                    rawSensorReading: displayNode.capacityMetric,
                    verificationHash: displayNode.provenanceHash,
                    epistemicTier: displayNode.epistemicTier,
                    confidenceInterval: '±0.4% across verified telemetry sensors',
                    verifiedTimestamp: displayNode.activationDate,
                    validatorSignatures: [
                      '0x81b920485716a827',
                      '0x44f128bc901a8823',
                      '0x6e9014ba88c12093'
                    ]
                  });
                }
              }}
              className="px-3.5 py-2 bg-[#141815] hover:bg-[#1C241E] border border-cyan-500/40 text-cyan-300 hover:text-white rounded-sm text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider cursor-pointer shadow"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Audit Deployment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
