import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Network,
  Layers,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Info,
  TreePine,
  Droplets,
  Bird,
  Sprout,
  Activity,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Sliders,
  Compass,
  Cpu,
  Share2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Gauge,
  Radio,
  Target,
  Zap,
  Boxes,
  X,
  History,
  Download,
  Tag,
  Route,
  CheckSquare,
  Square,
  SlidersHorizontal,
  FileSpreadsheet,
  FileCode,
  Flame,
  Palette,
  Cloud,
  GitCompare,
  Eye,
  EyeOff,
  RefreshCw,
  Undo2,
  Redo2,
  PieChart
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';
import { HistoricalVersioningSidebar } from './HistoricalVersioningSidebar';
import { BatchExportModal } from './BatchExportModal';
import { NodeContextMenu } from './NodeContextMenu';
import { PhysicsDebuggerOverlay, PhysicsParams, DEFAULT_PHYSICS_PARAMS } from './PhysicsDebuggerOverlay';
import { AnimatedPathTracerPanel } from './AnimatedPathTracerPanel';
import { DynamicLegendToggle, NODE_TYPE_CONFIGS, LINK_TYPE_CONFIGS } from './DynamicLegendToggle';
import { CompareSnapshotsModal } from './CompareSnapshotsModal';
import { ClusteringAnalyticsHUD } from './ClusteringAnalyticsHUD';
import { NodeQuickLookPopover } from './NodeQuickLookPopover';
import { KnowledgeExportModal } from './KnowledgeExportModal';
import { LayoutPresetsMenu, GraphLayoutPreset } from './LayoutPresetsMenu';
import { useGraphHistory, GraphViewState } from './useGraphHistory';
import {
  BioregionalCustomTag,
  subscribeToCustomTags,
  HISTORICAL_VERSION_SNAPSHOTS,
  findShortestEcologicalPath,
  ShortestPathResult,
  compareSnapshots,
  SnapshotComparisonResult
} from '../../services/bioregionalKnowledgeService';

export type KnowledgeNodeType = 'zone' | 'evidence_flora' | 'evidence_fauna' | 'evidence_hydrology' | 'evidence_soil' | 'keystone_mechanism';
export type KnowledgeLinkType = 'hydrological_recharge' | 'mycorrhizal_coupling' | 'trophic_cascade' | 'microclimate_feedback' | 'stewardship_governance';

export interface KnowledgeNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: KnowledgeNodeType;
  categoryName: string;
  metric?: string;
  location?: string;
  hectaresOrImpact?: string;
  hash?: string;
  verifiedBy?: string;
  description: string;
  confidenceScore: number;
  epistemicTier: string;
  val: number; // Node size / centrality weight
  color: string;
  era?: '2016-2020' | '2021-2025' | '2026-2030' | '2031-2040' | '2041-2050';
  ecologicalLayer?: 'Soil Health' | 'Water Cycles' | 'Biodiversity Indices' | 'Canopy & Carbon Sinks' | 'Customary Governance';
  // D3 simulation coordinates
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface KnowledgeLink extends d3.SimulationLinkDatum<KnowledgeNode> {
  id: string;
  source: string | KnowledgeNode;
  target: string | KnowledgeNode;
  relationshipType: KnowledgeLinkType;
  relationshipLabel: string;
  strength: number; // 0.1 - 1.0
  description: string;
  empiricalEvidence: string;
  color: string;
}

const KNOWLEDGE_GRAPH_NODES: KnowledgeNode[] = [
  // 1. Restoration Project Zones
  {
    id: 'zone-aberdare-ridge',
    label: 'Aberdare Climax Podocarpus Ridge',
    type: 'zone',
    categoryName: 'Restoration Project Zone',
    metric: '4,200 ha • 78% Crown Density',
    location: 'Aberdare High Forest Ridge',
    hectaresOrImpact: '4,200 Hectares Target',
    hash: '0x99201a4e76110f8234719bbca098234190872615',
    verifiedBy: 'Aberdare Forest Guardians Council',
    description: 'High-altitude endemic evergreen canopy capturing horizontal cloud mist and feeding perennial mountain tributaries.',
    confidenceScore: 98,
    epistemicTier: 'In-Situ Drone Lidar & Botanical Inventory',
    val: 28,
    color: '#10B981',
    era: '2021-2025',
    ecologicalLayer: 'Canopy & Carbon Sinks'
  },
  {
    id: 'zone-mathare-swale',
    label: 'Mathare Riparian Bio-Swale Corridor',
    type: 'zone',
    categoryName: 'Restoration Project Zone',
    metric: '120 ha • -72% Silt Washout',
    location: 'Mathare Valley River Basin',
    hectaresOrImpact: '120 Hectares Restored',
    hash: '0x718a092c431b990f10c87214556677889900aabb',
    verifiedBy: 'Nairobi River Basin Water Directorate',
    description: 'Urban pocket wetland and vetiver terracing network buffering municipal stormwater and trapping toxic sediment.',
    confidenceScore: 96,
    epistemicTier: 'Galvanic Turbidity & DO Sonde Mesh',
    val: 22,
    color: '#06B6D4',
    era: '2016-2020',
    ecologicalLayer: 'Water Cycles'
  },
  {
    id: 'zone-mara-pastoral',
    label: 'Mara Basin Olosho Silvopasture Sponge',
    type: 'zone',
    categoryName: 'Restoration Project Zone',
    metric: '8,500 ha • +2.1°C Micro-Cooling',
    location: 'Talek River Watershed Buffer',
    hectaresOrImpact: '8,500 Hectares Regenerated',
    hash: '0x88f1b2098ac123901bca091234567890abcdef12',
    verifiedBy: 'Maasai Pastoralist Stewardship Trust',
    description: 'Customary rotational grazing corridors coupled with deep-root Acacia xanthophloea and perennial pasture restoration.',
    confidenceScore: 95,
    epistemicTier: 'Elder Council Provenance & Satellite NDVI',
    val: 26,
    color: '#F59E0B',
    era: '2021-2025',
    ecologicalLayer: 'Customary Governance'
  },
  {
    id: 'zone-kikuyu-flyway',
    label: 'Kikuyu Escarpment Avian Flyway',
    type: 'zone',
    categoryName: 'Restoration Project Zone',
    metric: '1,800 ha • +41% Bio-Acoustic Index',
    location: 'Kikuyu Escarpment Forest',
    hectaresOrImpact: '1,800 Hectares Continuous Corridor',
    hash: '0x3344bbee99887766554433221100ffeeddccbbaa',
    verifiedBy: 'Kenya Wildlife Bio-Acoustic Mesh Post',
    description: 'Continuous canopy bridge reconnecting fragmented Rift Valley forest pockets for endemic avian pollinator transit.',
    confidenceScore: 97,
    epistemicTier: 'Bio-Acoustic Waveform Analysis',
    val: 22,
    color: '#84CC16',
    era: '2026-2030',
    ecologicalLayer: 'Biodiversity Indices'
  },
  {
    id: 'zone-naivasha-aquifer',
    label: 'Lake Naivasha Subsurface Aquifer Sponge',
    type: 'zone',
    categoryName: 'Restoration Project Zone',
    metric: '3,400 ha • +1.82 bar Piezometric Head',
    location: 'Rift Valley Aquifer Recharge Basin',
    hectaresOrImpact: '3,400 Hectares Catchment',
    hash: '0x6618ddea1947201bc917281901abcf89410984a1',
    verifiedBy: 'Rift Valley Hydrological Water Institute',
    description: 'Volcanic pumice soil aquifer absorbing high-altitude runoff and providing year-round groundwater balance.',
    confidenceScore: 94,
    epistemicTier: 'Continuous Galvanic Pressure Sensor Network',
    val: 24,
    color: '#3B82F6',
    era: '2026-2030',
    ecologicalLayer: 'Water Cycles'
  },

  // 2. Field Evidence Markers (Flora, Fauna, Hydrology, Soil)
  {
    id: 'ev-001',
    label: 'Podocarpus Climax Old-Growth Canopy',
    type: 'evidence_flora',
    categoryName: 'Field Evidence (Flora)',
    metric: '78% Verified Crown Density',
    location: 'Aberdare Ridge #E14',
    hectaresOrImpact: 'High Biomass In-Situ Proof',
    hash: '0x99201a4e76110f8234719bbca098234190872615',
    verifiedBy: 'Dr. Wanjiku • Botanical Survey',
    description: 'Mature Afrocarpus falcatus specimen clusters with dense epiphytic moss providing extensive water condensation surfaces.',
    confidenceScore: 98,
    epistemicTier: 'Ground Truth Botanical Core Audit',
    val: 16,
    color: '#34D399',
    era: '2016-2020',
    ecologicalLayer: 'Canopy & Carbon Sinks'
  },
  {
    id: 'ev-002',
    label: 'Mountain Bamboo Riparian Migration Belt',
    type: 'evidence_flora',
    categoryName: 'Field Evidence (Flora)',
    metric: '1,420 tCO2e/ha • 92% Bio-Filter',
    location: 'Chania River Headwaters',
    hectaresOrImpact: 'Carbon Sequestration Anchor',
    hash: '0x8814bbcd0912ea44109823410987114299104821',
    verifiedBy: 'KFS High Forest Team',
    description: 'Dense Yushania alpina bamboo thickets anchoring steep canyon slopes and preventing landslide silt runoff.',
    confidenceScore: 95,
    epistemicTier: 'Multispectral NDVI Sentinel-2 Telemetry',
    val: 15,
    color: '#10B981',
    era: '2016-2020',
    ecologicalLayer: 'Canopy & Carbon Sinks'
  },
  {
    id: 'ev-003',
    label: 'Mountain Bongo Breeding Pair Camera Trap',
    type: 'evidence_fauna',
    categoryName: 'Field Evidence (Fauna)',
    metric: '4 Endemic Calves Recorded',
    location: 'Aberdare Highland Sanctuary',
    hectaresOrImpact: 'Trophic Keystone Sanctuary',
    hash: '0x4491aacf09871234908123478912348912345678',
    verifiedBy: 'Mount Kenya Bongo Council',
    description: 'Infrared night camera trap confirmed healthy breeding pair of critically endangered Mountain Bongo within regenerated glade.',
    confidenceScore: 99,
    epistemicTier: 'Time-Stamped Infrared Sensor Trap',
    val: 18,
    color: '#F43F5E',
    era: '2021-2025',
    ecologicalLayer: 'Biodiversity Indices'
  },
  {
    id: 'ev-004',
    label: "Abbott's Starling Acoustic Waveform Cluster",
    type: 'evidence_fauna',
    categoryName: 'Field Evidence (Fauna)',
    metric: '84 Native Avian Calls / hr',
    location: 'Kikuyu Escarpment Node 4',
    hectaresOrImpact: 'Bio-Acoustic Health Sentinel',
    hash: '0x1928bcde990011223344556677889900aabbccdd',
    verifiedBy: 'Ornithological Society of East Africa',
    description: 'Neural bio-acoustic listening array identified 34 active breeding calls of vulnerable Abbott’s Starling in restored Podocarpus trees.',
    confidenceScore: 97,
    epistemicTier: 'Continuous Bio-Acoustic Waveform Telemetry',
    val: 16,
    color: '#FB7185',
    era: '2021-2025',
    ecologicalLayer: 'Biodiversity Indices'
  },
  {
    id: 'ev-005',
    label: 'Wild Stingless Bee Hollow Log Apiaries',
    type: 'evidence_fauna',
    categoryName: 'Field Evidence (Fauna)',
    metric: '18 Active Indigenous Hives',
    location: 'Mara Forest Margin Swales',
    hectaresOrImpact: 'Canopy Pollination Engine',
    hash: '0xaa19482f091823901bca0928174a5b6c9918bc20',
    verifiedBy: 'Community Elder Melita Ole Sankale',
    description: 'Stingless Meliponine bee colonies established inside deadwood logs providing uninterrupted pollination for highland fruit flowers.',
    confidenceScore: 96,
    epistemicTier: 'Indigenous In-Situ Apiary Census',
    val: 14,
    color: '#FBBF24',
    era: '2026-2030',
    ecologicalLayer: 'Biodiversity Indices'
  },
  {
    id: 'ev-006',
    label: 'Mathare Bio-Swale Silt Infiltration Gauge',
    type: 'evidence_hydrology',
    categoryName: 'Field Evidence (Hydrology)',
    metric: '-72% Silt • 7.2 mg/L Dissolved O2',
    location: 'Mathare-Juja Confluence',
    hectaresOrImpact: 'Sediment Capture Node',
    hash: '0x7721ffea88990011223344556677889900aabbcc',
    verifiedBy: 'Center for Ecological Urbanism',
    description: 'Multichannel galvanic telemetry sonde measuring dissolved oxygen rebound and 72% suspended solid capture during monsoon surges.',
    confidenceScore: 96,
    epistemicTier: 'Continuous In-Situ Galvanic Sonde',
    val: 16,
    color: '#38BDF8',
    era: '2016-2020',
    ecologicalLayer: 'Water Cycles'
  },
  {
    id: 'ev-007',
    label: 'Lake Naivasha Subsurface Piezometer Gauge',
    type: 'evidence_hydrology',
    categoryName: 'Field Evidence (Hydrology)',
    metric: '+1.82 bar Piezometric Head Rebound',
    location: 'Naivasha North Riparian Borehole',
    hectaresOrImpact: 'Deep Aquifer Recharge Point',
    hash: '0x6618ddea1947201bc917281901abcf89410984a1',
    verifiedBy: 'Rift Valley Water Resource Authority',
    description: 'Subterranean piezometer showing progressive recovery of water table pressure following upper catchment agroforestry keyline terrace work.',
    confidenceScore: 95,
    epistemicTier: 'Deep Borehole Pressure Telemetry',
    val: 15,
    color: '#0284C7',
    era: '2021-2025',
    ecologicalLayer: 'Water Cycles'
  },
  {
    id: 'ev-008',
    label: 'Mara Multi-Strata Riparian Buffer Filter',
    type: 'evidence_hydrology',
    categoryName: 'Field Evidence (Hydrology)',
    metric: '94% Riverbank Stabilization',
    location: 'Talek River Meander Node',
    hectaresOrImpact: 'Bank Erosion Mitigation',
    hash: '0x3344bbee99887766554433221100ffeeddccbbaa',
    verifiedBy: 'Mara River Water Basin Council',
    description: 'Deep fibrous root system of indigenous Ficus sur and vetiver grass terraces preventing riverbank collapse and pastoral runoff washout.',
    confidenceScore: 94,
    epistemicTier: 'Drone Photogrammetry & Core Assay',
    val: 15,
    color: '#0EA5E9',
    era: '2026-2030',
    ecologicalLayer: 'Water Cycles'
  },
  {
    id: 'ev-009',
    label: 'Mycorrhizal Glomalin Subterranean Core Assay',
    type: 'evidence_soil',
    categoryName: 'Field Evidence (Soil)',
    metric: '5.14% SOM • 2.8 mg/g Glomalin',
    location: 'Aberdare Escarpment Soil Station #04',
    hectaresOrImpact: 'Living Soil Sponge Matrix',
    hash: '0x1188ccee44556677889900aabbccddeeff001122',
    verifiedBy: 'Biophysical Soil Laboratory • ICRAF',
    description: 'Centrifuge protein extraction confirming massive expansion of arbuscular mycorrhizal hyphal networks binding soil micro-aggregates.',
    confidenceScore: 98,
    epistemicTier: 'Laboratory Chemical Core Assay',
    val: 17,
    color: '#D97706',
    era: '2021-2025',
    ecologicalLayer: 'Soil Health'
  },
  {
    id: 'ev-010',
    label: 'Indigenous Endemic Nursery Seed Bank',
    type: 'evidence_flora',
    categoryName: 'Field Evidence (Flora)',
    metric: '45,000 Inoculated Endemic Saplings',
    location: 'Nyeri Highland Pioneer Nursery',
    hectaresOrImpact: 'Genetic Diversity Archive',
    hash: '0x2299ddee556677889900aabbccddeeff00112233',
    verifiedBy: 'Aberdare Forest Guardians Council',
    description: 'Community-led nursery propagating 24 endemic tree species pre-inoculated with local mycorrhizal forest soil cultures.',
    confidenceScore: 97,
    epistemicTier: 'Community Seed Census & Genetic Assay',
    val: 15,
    color: '#10B981',
    era: '2016-2020',
    ecologicalLayer: 'Soil Health'
  },

  // 3. Keystone Biophysical Mechanism Nodes (Intermediaries)
  {
    id: 'mech-glomalin-sink',
    label: 'Glomalin Carbon Aggregate Lock',
    type: 'keystone_mechanism',
    categoryName: 'Biophysical Mechanism',
    metric: 'Soil Aggregate Stability Index 94/100',
    location: 'Subterranean Rhizosphere',
    hectaresOrImpact: 'Non-Linear Carbon Storage Mechanism',
    hash: '0x55aa66bb77cc88dd99ee00ff11aa22bb33cc44dd',
    verifiedBy: 'Soil Physics Causal Group',
    description: 'Insoluble glycoprotein secreted by fungal hyphae creating hydrophobic pores that store soil water and sequester organic carbon for decades.',
    confidenceScore: 97,
    epistemicTier: 'Theoretical & Empirical Biophysical Model',
    val: 20,
    color: '#C5A059',
    era: '2021-2025',
    ecologicalLayer: 'Soil Health'
  },
  {
    id: 'mech-canopy-mist',
    label: 'Evapotranspiration Micro-Cooling Loop',
    type: 'keystone_mechanism',
    categoryName: 'Biophysical Mechanism',
    metric: '2.1°C Regional Thermal Dampening',
    location: 'Highland Atmospheric Layer',
    hectaresOrImpact: 'Micro-Climate Precipitation Feedback',
    hash: '0x66bb77cc88dd99ee00ff11aa22bb33cc44dd55ee',
    verifiedBy: 'Atmospheric Boundary Layer Lab',
    description: 'Multi-tiered canopy transpires moisture that seeds convective cloud cover, creating daily rainfall cycles and mitigating extreme heatwaves.',
    confidenceScore: 96,
    epistemicTier: 'Thermal Satellite & Flux Tower Sensors',
    val: 20,
    color: '#C5A059',
    era: '2026-2030',
    ecologicalLayer: 'Canopy & Carbon Sinks'
  },
  {
    id: 'mech-aquifer-sponge',
    label: 'Subterranean Hydraulic Head Buffer',
    type: 'keystone_mechanism',
    categoryName: 'Biophysical Mechanism',
    metric: 'Baseflow Infiltration: 840 L/s',
    location: 'Basement Complex Aquifer',
    hectaresOrImpact: 'Drought Resilience Valve',
    hash: '0x77cc88dd99ee00ff11aa22bb33cc44dd55ee66ff',
    verifiedBy: 'Kenya Hydrological Service',
    description: 'Soil organic sponge channels storm runoff into deep fissures instead of surface flash floods, feeding dry-season springs.',
    confidenceScore: 98,
    epistemicTier: 'Hydrogeological Causal Mesh',
    val: 20,
    color: '#C5A059',
    era: '2026-2030',
    ecologicalLayer: 'Water Cycles'
  },
  {
    id: 'mech-customary-olosho',
    label: 'Olosho Rotational Grazing Calendar',
    type: 'keystone_mechanism',
    categoryName: 'Governance & Indigenous Protocol',
    metric: '90-Day Seasonal Root Rest Period',
    location: 'Mara-Serengeti Transboundary Commons',
    hectaresOrImpact: 'Socio-Ecological Coupling Protocol',
    hash: '0x88dd99ee00ff11aa22bb33cc44dd55ee66ff77aa',
    verifiedBy: 'Council of Pastoralist Elders',
    description: 'Customary indigenous grazing regime synchronized with grass flowering phases to prevent over-grazing of shallow rhizomes.',
    confidenceScore: 99,
    epistemicTier: 'Indigenous Council Decree & Drone Audit',
    val: 18,
    color: '#EAB308',
    era: '2021-2025',
    ecologicalLayer: 'Customary Governance'
  }
];

const KNOWLEDGE_GRAPH_LINKS: KnowledgeLink[] = [
  // Hydrological Support
  {
    id: 'l-01',
    source: 'zone-aberdare-ridge',
    target: 'mech-aquifer-sponge',
    relationshipType: 'hydrological_recharge',
    relationshipLabel: 'Supplies Cloud Condensation Infiltration',
    strength: 0.95,
    description: 'Intact podocarpus canopy on the high ridge captures 420mm annual occult precipitation, recharging subterranean aquifers.',
    empiricalEvidence: 'Isotope tracking verified 68% of lowland Naivasha boreholes originate from Aberdare mist capture.',
    color: '#06B6D4'
  },
  {
    id: 'l-02',
    source: 'mech-aquifer-sponge',
    target: 'zone-naivasha-aquifer',
    relationshipType: 'hydrological_recharge',
    relationshipLabel: 'Maintains Perennial Groundwater Baseflow',
    strength: 0.9,
    description: 'Deep subterranean pressure buffers recharge rift valley floor aquifer, maintaining water table elevation.',
    empiricalEvidence: '+1.82 bar continuous piezometric head recorded at northern monitoring station.',
    color: '#06B6D4'
  },
  {
    id: 'l-03',
    source: 'zone-mathare-swale',
    target: 'ev-006',
    relationshipType: 'hydrological_recharge',
    relationshipLabel: 'Terraces Buffer Storm Runoff Velocity',
    strength: 0.85,
    description: 'Engineered bio-swales reduce storm peak discharge velocity, allowing suspended particulate settling.',
    empiricalEvidence: '72% drop in total suspended solids measured across flash flood events.',
    color: '#06B6D4'
  },
  {
    id: 'l-04',
    source: 'ev-008',
    target: 'zone-mara-pastoral',
    relationshipType: 'hydrological_recharge',
    relationshipLabel: 'Stabilizes Riverbanks Against Livestock Scour',
    strength: 0.8,
    description: 'Multi-strata root network holds river meanders in place even during intense dry-season watering cattle herds.',
    empiricalEvidence: 'Photogrammetric drone survey showed zero bank collapse across 8.5 km buffer zone.',
    color: '#06B6D4'
  },
  {
    id: 'l-05',
    source: 'ev-007',
    target: 'mech-aquifer-sponge',
    relationshipType: 'hydrological_recharge',
    relationshipLabel: 'Calibrates Hydraulic Head In-Situ',
    strength: 0.88,
    description: 'Piezometer telemetry provides ground truth validation for hydraulic pressure simulation models.',
    empiricalEvidence: 'Telemetry correlated with Sentinel-1 GRACE groundwater mass variations at r=0.92.',
    color: '#06B6D4'
  },

  // Mycorrhizal & Soil Coupling
  {
    id: 'l-06',
    source: 'ev-009',
    target: 'mech-glomalin-sink',
    relationshipType: 'mycorrhizal_coupling',
    relationshipLabel: 'Secretes Hydrophobic Glomalin Glycoprotein',
    strength: 0.95,
    description: 'Active mycorrhizal hyphae produce glomalin, binding volcanic ash minerals into water-retentive crumb structures.',
    empiricalEvidence: 'Assay #SOM-82 recorded 2.8 mg glomalin per gram of dry soil core.',
    color: '#D97706'
  },
  {
    id: 'l-07',
    source: 'mech-glomalin-sink',
    target: 'zone-aberdare-ridge',
    relationshipType: 'mycorrhizal_coupling',
    relationshipLabel: 'Expands Rhizosphere Sponge Water Holding Capacity',
    strength: 0.9,
    description: 'Soil crumb structure stores up to 400% its weight in water, preventing summer drought stress in climax Podocarpus trees.',
    empiricalEvidence: 'Sap flow sensors recorded uninterrupted tree transpiration throughout 45-day dry spell.',
    color: '#D97706'
  },
  {
    id: 'l-08',
    source: 'ev-010',
    target: 'zone-aberdare-ridge',
    relationshipType: 'mycorrhizal_coupling',
    relationshipLabel: 'Supplies Pre-Inoculated Pioneer Saplings',
    strength: 0.85,
    description: 'Community nurseries enrich potting soil with local fungal spores, accelerating field seedling survival from 42% to 89%.',
    empiricalEvidence: '12,000 tagged saplings tracked over 24 months showed 91.4% root vigor.',
    color: '#10B981'
  },
  {
    id: 'l-09',
    source: 'ev-002',
    target: 'ev-009',
    relationshipType: 'mycorrhizal_coupling',
    relationshipLabel: 'Bamboo Rhizomes Feed Fungal Hyphae Networks',
    strength: 0.8,
    description: 'Mountain bamboo root exudates provide constant carbohydrate flux feeding dense mycorrhizal fungi colonies.',
    empiricalEvidence: 'Hyphal density 3.4x higher under native bamboo stands compared to monoculture pines.',
    color: '#10B981'
  },

  // Trophic Cascade & Biodiversity Feedbacks
  {
    id: 'l-10',
    source: 'ev-001',
    target: 'mech-canopy-mist',
    relationshipType: 'microclimate_feedback',
    relationshipLabel: 'Generates Microclimate Thermal Cooling',
    strength: 0.92,
    description: 'Dense old-growth Podocarpus crown transpires large volumes of moisture, creating continuous low-lying cloud blankets.',
    empiricalEvidence: 'Thermal drone imaging recorded 2.1°C surface cooling under dense canopy sections.',
    color: '#10B981'
  },
  {
    id: 'l-11',
    source: 'mech-canopy-mist',
    target: 'ev-003',
    relationshipType: 'trophic_cascade',
    relationshipLabel: 'Maintains Cool Humid Mountain Bongo Sanctuary',
    strength: 0.88,
    description: 'Thermal dampening preserves high-altitude humid microclimate required for Mountain Bongo browse vegetation.',
    empiricalEvidence: 'Endemic bongo family sightings strictly correlate with canopy zones retaining >75% humidity.',
    color: '#F43F5E'
  },
  {
    id: 'l-12',
    source: 'ev-005',
    target: 'zone-kikuyu-flyway',
    relationshipType: 'trophic_cascade',
    relationshipLabel: 'Pollinates Endemic Understory Flowers',
    strength: 0.82,
    description: 'Stingless bees maintain seed set for 48 indigenous understory shrubs, feeding frugivorous bird species.',
    empiricalEvidence: 'Fruit set increased by 64% within 800m of established log hives.',
    color: '#FBBF24'
  },
  {
    id: 'l-13',
    source: 'zone-kikuyu-flyway',
    target: 'ev-004',
    relationshipType: 'trophic_cascade',
    relationshipLabel: 'Provides Contiguous Flyway Corridors',
    strength: 0.9,
    description: 'Reconnected escarpment corridor eliminates canopy gaps, enabling Abbott’s Starlings to traverse seasonal feeding zones.',
    empiricalEvidence: 'Bio-acoustic sensors recorded species crossing across all 4 reconnected corridor gaps.',
    color: '#FB7185'
  },

  // Stewardship & Customary Governance
  {
    id: 'l-14',
    source: 'mech-customary-olosho',
    target: 'zone-mara-pastoral',
    relationshipType: 'stewardship_governance',
    relationshipLabel: 'Enforces 90-Day Root Regrowth Moratorium',
    strength: 0.95,
    description: 'Customary pastoralist calendar closes sensitive riparian pastures during seeding season, preventing root desiccation.',
    empiricalEvidence: 'Grass biomass recovered to 2.4 t/ha under Elder Council pasture rotational bylaws.',
    color: '#EAB308'
  },
  {
    id: 'l-15',
    source: 'zone-mara-pastoral',
    target: 'ev-008',
    relationshipType: 'stewardship_governance',
    relationshipLabel: 'Protects Fencing and Tree Nurseries',
    strength: 0.85,
    description: 'Local community scouts patrol riparian reforestation buffers to prevent livestock damage during establishment years.',
    empiricalEvidence: 'Zero unauthorized livestock encroachments recorded in verified audit period.',
    color: '#EAB308'
  }
];

interface BioregionalKnowledgeGraphProps {
  selectedBioregionId?: string;
  activePeriodYear?: number | string;
  selectedLayerFilter?: string;
  initialSearchQuery?: string;
  onNavigateToEvidence?: (markerId?: string) => void;
  onSelectModuleTab?: (tab: any) => void;
  onTimelinePeriodChange?: (year: number) => void;
}

const TIMELINE_ERAS = [
  { key: '2016-2020', year: 2018, label: 'Baseline (2016-2020)', milestone: 'Bio-Swales & Living Soil Infiltration' },
  { key: '2021-2025', year: 2023, label: 'Mycelial & Olosho (2021-2025)', milestone: 'Mycelial Inoculation & Grazing Bylaws' },
  { key: '2026-2030', year: 2028, label: 'Canopy & Aquifers (2026-2030)', milestone: 'Subsurface Piezometer & Avian Flyway' },
  { key: '2031-2040', year: 2035, label: 'Climax Forests (2031-2040)', milestone: 'Podocarpus Climax & Escarpment Canopy' },
  { key: '2041-2050', year: 2045, label: 'Macro Equilibrium (2041-2050)', milestone: 'Transboundary Bioregional Stability' }
];

export const BioregionalKnowledgeGraph: React.FC<BioregionalKnowledgeGraphProps> = ({
  selectedBioregionId = 'aberdare_riparian_watershed',
  activePeriodYear = 2026,
  selectedLayerFilter = 'All',
  initialSearchQuery = '',
  onNavigateToEvidence,
  onSelectModuleTab,
  onTimelinePeriodChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('zone-aberdare-ridge');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeTypeFilter, setSelectedNodeTypeFilter] = useState<string>('All');
  const [selectedLinkTypeFilter, setSelectedLinkTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isClusteringMode, setIsClusteringMode] = useState<boolean>(false);

  // 1. Historical Versioning State
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState<boolean>(false);
  const [activeSnapshotId, setActiveSnapshotId] = useState<string | null>(null);
  const [isDiffMode, setIsDiffMode] = useState<boolean>(false);

  // 2. Batch Export & Multi-Select State
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);
  const [selectedNodeIdsSet, setSelectedNodeIdsSet] = useState<Set<string>>(new Set());
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // 3. Custom Labels & Color Tags (Firestore-synced)
  const [customTags, setCustomTags] = useState<Record<string, BioregionalCustomTag>>({});
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    nodeId: string;
  } | null>(null);

  // 4. Physics Engine Debugger State
  const [isPhysicsDebuggerOpen, setIsPhysicsDebuggerOpen] = useState<boolean>(false);
  const [physicsParams, setPhysicsParams] = useState<PhysicsParams>(DEFAULT_PHYSICS_PARAMS);
  const [isPhysicsFrozen, setIsPhysicsFrozen] = useState<boolean>(false);
  const simulationRef = useRef<d3.Simulation<KnowledgeNode, KnowledgeLink> | null>(null);

  // 5. Animated Path Tracer State
  const [isPathTracerOpen, setIsPathTracerOpen] = useState<boolean>(false);
  const [pathSourceNodeId, setPathSourceNodeId] = useState<string | null>('flora-podocarpus-falcatus');
  const [pathTargetNodeId, setPathTargetNodeId] = useState<string | null>('hydro-perennial-springflow');

  // 6. Dynamic Legend Visibility State
  const [visibleNodeTypes, setVisibleNodeTypes] = useState<Set<KnowledgeNodeType>>(
    new Set<KnowledgeNodeType>(['zone', 'evidence_flora', 'evidence_fauna', 'evidence_hydrology', 'evidence_soil', 'keystone_mechanism'])
  );
  const [visibleLinkTypes, setVisibleLinkTypes] = useState<Set<KnowledgeLinkType>>(
    new Set<KnowledgeLinkType>(['hydrological_recharge', 'mycorrhizal_coupling', 'trophic_cascade', 'microclimate_feedback', 'stewardship_governance'])
  );
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);

  // 7. Compare Snapshots Diff State
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [diffOverlaySnapshotAId, setDiffOverlaySnapshotAId] = useState<string>('v1.0-2016');
  const [diffOverlaySnapshotBId, setDiffOverlaySnapshotBId] = useState<string>('v3.2-2026');
  const [isCompareDiffOverlayActive, setIsCompareDiffOverlayActive] = useState<boolean>(false);

  // 8. Auto-Arrange High-Intensity Simulation State
  const [isAutoArranging, setIsAutoArranging] = useState<boolean>(false);

  // 9. Layout Presets & Topologies State
  const [layoutPreset, setLayoutPreset] = useState<GraphLayoutPreset>('force-directed');
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState<boolean>(false);

  // 10. Clustering Analytics HUD State
  const [isClusteringHUDOpen, setIsClusteringHUDOpen] = useState<boolean>(false);

  // 11. Knowledge Export Suite State
  const [isKnowledgeExportOpen, setIsKnowledgeExportOpen] = useState<boolean>(false);

  // 12. Quick-Look Sparkline Hover State
  const [quickLookNode, setQuickLookNode] = useState<KnowledgeNode | null>(null);
  const [quickLookPos, setQuickLookPos] = useState<{ x: number; y: number } | null>(null);

  // 13. Undo/Redo State History Stack
  const initialViewState: GraphViewState = useMemo(
    () => ({
      selectedNodeTypeFilter,
      selectedLinkTypeFilter,
      selectedLayerFilter,
      visibleNodeTypes: Array.from(visibleNodeTypes),
      visibleLinkTypes: Array.from(visibleLinkTypes),
      layoutPreset,
      searchQuery,
      activeSnapshotId,
      description: 'Initial Graph View'
    }),
    []
  );

  const {
    canUndo,
    canRedo,
    pushState,
    undo: undoGraphState,
    redo: redoGraphState
  } = useGraphHistory(initialViewState);

  // Record state changes into undo/redo history stack
  useEffect(() => {
    pushState({
      selectedNodeTypeFilter,
      selectedLinkTypeFilter,
      selectedLayerFilter,
      visibleNodeTypes: Array.from(visibleNodeTypes),
      visibleLinkTypes: Array.from(visibleLinkTypes),
      layoutPreset,
      searchQuery,
      activeSnapshotId,
      description: `View: ${layoutPreset} | ${selectedNodeTypeFilter}`
    });
  }, [
    selectedNodeTypeFilter,
    selectedLinkTypeFilter,
    selectedLayerFilter,
    visibleNodeTypes,
    visibleLinkTypes,
    layoutPreset,
    searchQuery,
    activeSnapshotId,
    pushState
  ]);

  // Apply restored state from Undo / Redo
  const applyRestoredState = (state: GraphViewState | null) => {
    if (!state) return;
    setSelectedNodeTypeFilter(state.selectedNodeTypeFilter);
    setSelectedLinkTypeFilter(state.selectedLinkTypeFilter);
    setVisibleNodeTypes(new Set(state.visibleNodeTypes as KnowledgeNodeType[]));
    setVisibleLinkTypes(new Set(state.visibleLinkTypes as KnowledgeLinkType[]));
    setLayoutPreset(state.layoutPreset);
    setSearchQuery(state.searchQuery);
    setActiveSnapshotId(state.activeSnapshotId);
  };

  const handleUndo = () => {
    const prev = undoGraphState();
    if (prev) applyRestoredState(prev);
  };

  const handleRedo = () => {
    const next = redoGraphState();
    if (next) applyRestoredState(next);
  };

  // Keyboard shortcut listener for Ctrl+Z (Undo) and Ctrl+Y / Shift+Ctrl+Z (Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undoGraphState, redoGraphState]);
  
  // Playback Animation State
  const [isPlaybackRunning, setIsPlaybackRunning] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentPlaybackYear, setCurrentPlaybackYear] = useState<number>(
    typeof activePeriodYear === 'number' ? activePeriodYear : parseInt(String(activePeriodYear), 10) || 2026
  );

  // Dynamic Legend Toggles Handlers
  const handleToggleNodeType = (type: KnowledgeNodeType) => {
    setVisibleNodeTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const handleSetAllNodeTypes = (visible: boolean) => {
    if (visible) {
      setVisibleNodeTypes(new Set<KnowledgeNodeType>(NODE_TYPE_CONFIGS.map(c => c.type)));
    } else {
      setVisibleNodeTypes(new Set<KnowledgeNodeType>(['zone']));
    }
  };

  const handleToggleLinkType = (type: KnowledgeLinkType) => {
    setVisibleLinkTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const handleSetAllLinkTypes = (visible: boolean) => {
    if (visible) {
      setVisibleLinkTypes(new Set<KnowledgeLinkType>(LINK_TYPE_CONFIGS.map(c => c.type)));
    } else {
      setVisibleLinkTypes(new Set<KnowledgeLinkType>(['hydrological_recharge']));
    }
  };

  // Auto-Arrange Handler (Runs high-intensity D3 impulse to untangle layout)
  const handleAutoArrange = () => {
    if (!simulationRef.current) return;
    setIsAutoArranging(true);
    audioFeedback.playDataSave();

    // Unpin fixed node coordinates
    simulationRef.current.nodes().forEach(node => {
      node.fx = null;
      node.fy = null;
    });

    // High-intensity impulse
    simulationRef.current
      .alpha(1.0)
      .alphaTarget(0)
      .force('charge', d3.forceManyBody().strength(physicsParams.chargeStrength * 1.8))
      .force('collision', d3.forceCollide().radius((d: any) => d.val + physicsParams.collisionRadius + 28))
      .restart();

    setTimeout(() => {
      if (simulationRef.current) {
        simulationRef.current
          .force('charge', d3.forceManyBody().strength(physicsParams.chargeStrength))
          .force('collision', d3.forceCollide().radius((d: any) => d.val + physicsParams.collisionRadius));
      }
      setIsAutoArranging(false);
    }, 2400);
  };

  // Compare Snapshots Diff Calculation
  const activeDiffResult: SnapshotComparisonResult | null = useMemo(() => {
    if (!isCompareDiffOverlayActive) return null;
    return compareSnapshots(diffOverlaySnapshotAId, diffOverlaySnapshotBId, KNOWLEDGE_GRAPH_NODES, KNOWLEDGE_GRAPH_LINKS);
  }, [isCompareDiffOverlayActive, diffOverlaySnapshotAId, diffOverlaySnapshotBId]);

  const diffAddedNodeIds = useMemo(() => new Set(activeDiffResult?.addedNodeIds || []), [activeDiffResult]);
  const diffRemovedNodeIds = useMemo(() => new Set(activeDiffResult?.removedNodeIds || []), [activeDiffResult]);
  const diffAddedLinkIds = useMemo(() => new Set(activeDiffResult?.addedLinkIds || []), [activeDiffResult]);
  const diffRemovedLinkIds = useMemo(() => new Set(activeDiffResult?.removedLinkIds || []), [activeDiffResult]);

  // Subscribe to real-time custom tags from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToCustomTags(tags => {
      setCustomTags(tags);
    });
    return () => unsubscribe();
  }, []);

  // Sync external search queries from GlobalEpistemicSearch
  useEffect(() => {
    const handleGlobalSearch = (e: any) => {
      if (e.detail?.query !== undefined) {
        setSearchQuery(e.detail.query);
      }
    };
    window.addEventListener('global-epistemic-search-query' as any, handleGlobalSearch);
    return () => {
      window.removeEventListener('global-epistemic-search-query' as any, handleGlobalSearch);
    };
  }, []);

  // Sync activePeriodYear prop changes
  useEffect(() => {
    if (activePeriodYear) {
      const yr = typeof activePeriodYear === 'number' ? activePeriodYear : parseInt(String(activePeriodYear), 10);
      if (!isNaN(yr)) {
        setCurrentPlaybackYear(yr);
      }
    }
  }, [activePeriodYear]);

  // Automated Timeline Playback Engine
  useEffect(() => {
    if (!isPlaybackRunning) return;

    const intervalMs = Math.max(400, 2200 / playbackSpeed);
    const timer = setInterval(() => {
      setCurrentPlaybackYear(prevYear => {
        let nextYear = prevYear + 2;
        if (nextYear > 2050) nextYear = 2016;
        if (onTimelinePeriodChange) {
          onTimelinePeriodChange(nextYear);
        }
        audioFeedback.playMicroTick();
        return nextYear;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaybackRunning, playbackSpeed, onTimelinePeriodChange]);

  // Helper for timeline sync
  const isNodeInActivePeriod = (nodeEra?: string, targetYear = currentPlaybackYear) => {
    if (!targetYear || !nodeEra) return true;
    if (targetYear <= 2020) return nodeEra === '2016-2020';
    if (targetYear <= 2025) return nodeEra === '2021-2025' || nodeEra === '2016-2020';
    if (targetYear <= 2030) return nodeEra === '2026-2030' || nodeEra === '2021-2025' || nodeEra === '2016-2020';
    if (targetYear <= 2040) return nodeEra === '2031-2040' || nodeEra === '2026-2030' || nodeEra === '2021-2025' || nodeEra === '2016-2020';
    return true;
  };

  // Helper for layer filter match
  const isNodeInActiveLayer = (nodeLayer?: string) => {
    if (!selectedLayerFilter || selectedLayerFilter === 'All' || selectedLayerFilter === 'all') return true;
    return nodeLayer === selectedLayerFilter;
  };

  // Filtered nodes & links with Historical Snapshot & Diff Support
  const { filteredNodes, filteredLinks } = useMemo(() => {
    let nodes = [...KNOWLEDGE_GRAPH_NODES];
    let links = [...KNOWLEDGE_GRAPH_LINKS];

    // Filter by Historical Snapshot if active
    if (activeSnapshotId && activeSnapshotId !== 'v3.2-2026') {
      const snap = HISTORICAL_VERSION_SNAPSHOTS.find(s => s.id === activeSnapshotId);
      if (snap) {
        if (!isDiffMode) {
          nodes = nodes.filter(n => snap.includedNodeIds.includes(n.id));
          const snapNodeSet = new Set(snap.includedNodeIds);
          links = links.filter(l => {
            const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
            const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;
            return snapNodeSet.has(srcId) && snapNodeSet.has(tgtId);
          });
        }
      }
    }

    // Filter nodes by Dynamic Legend toggle
    nodes = nodes.filter(n => visibleNodeTypes.has(n.type));

    // Filter links by Dynamic Legend toggle
    links = links.filter(l => visibleLinkTypes.has(l.relationshipType));

    // Filter by global ecological layer if specified and not 'All'
    if (selectedLayerFilter && selectedLayerFilter !== 'All' && selectedLayerFilter !== 'all') {
      nodes = nodes.filter(n => n.ecologicalLayer === selectedLayerFilter || n.type === 'zone');
    }

    // Filter nodes by category filter pill
    if (selectedNodeTypeFilter !== 'All') {
      nodes = nodes.filter(n => {
        if (selectedNodeTypeFilter === 'Zones') return n.type === 'zone';
        if (selectedNodeTypeFilter === 'Flora') return n.type === 'evidence_flora';
        if (selectedNodeTypeFilter === 'Fauna') return n.type === 'evidence_fauna';
        if (selectedNodeTypeFilter === 'Hydrology') return n.type === 'evidence_hydrology';
        if (selectedNodeTypeFilter === 'Soil') return n.type === 'evidence_soil';
        if (selectedNodeTypeFilter === 'Mechanisms') return n.type === 'keystone_mechanism';
        return true;
      });
    }

    // Filter links by dropdown filter
    if (selectedLinkTypeFilter !== 'All') {
      links = links.filter(l => l.relationshipType === selectedLinkTypeFilter);
    }

    // If diff overlay is active, ensure diff nodes/links are included
    if (isCompareDiffOverlayActive && activeDiffResult) {
      const neededNodeIds = new Set([
        ...activeDiffResult.addedNodeIds,
        ...activeDiffResult.removedNodeIds,
        ...activeDiffResult.retainedNodeIds
      ]);
      const missingNodes = KNOWLEDGE_GRAPH_NODES.filter(n => neededNodeIds.has(n.id) && !nodes.some(existing => existing.id === n.id));
      nodes = [...nodes, ...missingNodes];
    }

    // Ensure links only connect valid remaining nodes
    const validNodeIds = new Set(nodes.map(n => n.id));
    links = links.filter(l => {
      const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;
      return validNodeIds.has(srcId) && validNodeIds.has(tgtId);
    });

    return { filteredNodes: nodes, filteredLinks: links };
  }, [
    visibleNodeTypes,
    visibleLinkTypes,
    selectedNodeTypeFilter,
    selectedLinkTypeFilter,
    selectedLayerFilter,
    activeSnapshotId,
    isDiffMode,
    isCompareDiffOverlayActive,
    activeDiffResult
  ]);

  // Shortest Path Calculation
  const activePathResult = useMemo(() => {
    if (!isPathTracerOpen || !pathSourceNodeId || !pathTargetNodeId) return null;
    return findShortestEcologicalPath(pathSourceNodeId, pathTargetNodeId, filteredNodes, filteredLinks);
  }, [isPathTracerOpen, pathSourceNodeId, pathTargetNodeId, filteredNodes, filteredLinks]);

  const pathNodeIdsSet = useMemo(() => {
    return new Set(activePathResult?.pathNodeIds || []);
  }, [activePathResult]);

  const pathLinkIdsSet = useMemo(() => {
    return new Set(activePathResult?.pathLinkIds || []);
  }, [activePathResult]);

  // Batch Selection Nodes List
  const selectedBatchNodes = useMemo(() => {
    if (selectedNodeIdsSet.size === 0) {
      return selectedNodeId ? filteredNodes.filter(n => n.id === selectedNodeId) : filteredNodes.slice(0, 6);
    }
    return filteredNodes.filter(n => selectedNodeIdsSet.has(n.id));
  }, [selectedNodeIdsSet, selectedNodeId, filteredNodes]);

  // Dynamic Network Health Summary Metrics
  const networkHealth = useMemo(() => {
    const totalNodes = filteredNodes.length;
    const totalLinks = filteredLinks.length;
    
    // Density calculation: 2E / (V * (V - 1))
    const maxPossibleEdges = Math.max(1, (totalNodes * (totalNodes - 1)) / 2);
    const rawDensityPercent = totalNodes > 1 ? (totalLinks / maxPossibleEdges) * 100 : 0;
    const avgConnectionsPerNode = totalNodes > 0 ? (totalLinks * 2) / totalNodes : 0;
    
    // Mean connection strength
    const totalStrength = filteredLinks.reduce((sum, link) => sum + (link.strength || 0.8), 0);
    const meanStrength = totalLinks > 0 ? totalStrength / totalLinks : 0;
    
    // Active category clusters
    const activeCategories = new Set(filteredNodes.map(n => n.type));
    const activeClusterCount = activeCategories.size;

    // Epistemic Confidence Average
    const avgConfidence = totalNodes > 0
      ? filteredNodes.reduce((acc, n) => acc + (n.confidenceScore || 90), 0) / totalNodes
      : 96.5;

    return {
      nodeCount: totalNodes,
      linkCount: totalLinks,
      densityPercent: rawDensityPercent.toFixed(1),
      avgConnections: avgConnectionsPerNode.toFixed(2),
      avgStrengthPercent: Math.round(meanStrength * 100),
      activeClusterCount,
      avgConfidence: avgConfidence.toFixed(1),
      resilienceStatus: meanStrength >= 0.85 ? 'Resilient Causal Mesh' : meanStrength >= 0.7 ? 'Moderate Symbiosis' : 'Early Succession'
    };
  }, [filteredNodes, filteredLinks]);

  // Search Matched Nodes
  const searchMatchedNodeIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const q = searchQuery.toLowerCase().trim();
    const matched = new Set<string>();
    filteredNodes.forEach(node => {
      const match =
        node.label.toLowerCase().includes(q) ||
        node.categoryName.toLowerCase().includes(q) ||
        node.description.toLowerCase().includes(q) ||
        (node.metric && node.metric.toLowerCase().includes(q)) ||
        (node.location && node.location.toLowerCase().includes(q)) ||
        (node.epistemicTier && node.epistemicTier.toLowerCase().includes(q)) ||
        (node.verifiedBy && node.verifiedBy.toLowerCase().includes(q));
      if (match) matched.add(node.id);
    });
    return matched;
  }, [filteredNodes, searchQuery]);

  // Selected Node Details
  const selectedNode = useMemo(() => {
    return KNOWLEDGE_GRAPH_NODES.find(n => n.id === selectedNodeId) || null;
  }, [selectedNodeId]);

  // Direct incoming and outgoing dependencies of the selected node
  const { incomingLinks, outgoingLinks, neighborNodeIds } = useMemo(() => {
    if (!selectedNodeId) return { incomingLinks: [], outgoingLinks: [], neighborNodeIds: new Set<string>() };

    const incoming: Array<{ link: KnowledgeLink; node: KnowledgeNode }> = [];
    const outgoing: Array<{ link: KnowledgeLink; node: KnowledgeNode }> = [];
    const neighbors = new Set<string>([selectedNodeId]);

    KNOWLEDGE_GRAPH_LINKS.forEach(link => {
      const srcId = typeof link.source === 'object' ? (link.source as any).id : link.source;
      const tgtId = typeof link.target === 'object' ? (link.target as any).id : link.target;

      if (tgtId === selectedNodeId) {
        const srcNode = KNOWLEDGE_GRAPH_NODES.find(n => n.id === srcId);
        if (srcNode) {
          incoming.push({ link, node: srcNode });
          neighbors.add(srcId);
        }
      }

      if (srcId === selectedNodeId) {
        const tgtNode = KNOWLEDGE_GRAPH_NODES.find(n => n.id === tgtId);
        if (tgtNode) {
          outgoing.push({ link, node: tgtNode });
          neighbors.add(tgtId);
        }
      }
    });

    return { incomingLinks: incoming, outgoingLinks: outgoing, neighborNodeIds: neighbors };
  }, [selectedNodeId]);

  // D3 Graph Simulation Render Loop
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = isFullscreen ? window.innerHeight - 240 : 540;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Background canvas definitions
    const defs = svg.append('defs');

    // Arrow markers for directional dependencies
    const linkTypes: Array<{ type: KnowledgeLinkType; color: string }> = [
      { type: 'hydrological_recharge', color: '#06B6D4' },
      { type: 'mycorrhizal_coupling', color: '#D97706' },
      { type: 'trophic_cascade', color: '#F43F5E' },
      { type: 'microclimate_feedback', color: '#10B981' },
      { type: 'stewardship_governance', color: '#EAB308' }
    ];

    linkTypes.forEach(({ type, color }) => {
      defs
        .append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 24)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color)
        .attr('opacity', 0.85);
    });

    // Radial gradient glow filter for normal active nodes
    const glowFilter = defs.append('filter').attr('id', 'node-glow');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // High-visibility Hover Glow Filter (Radial expansion + luminous aura)
    const hoverGlowFilter = defs.append('filter').attr('id', 'node-glow-hover');
    hoverGlowFilter.append('feGaussianBlur').attr('stdDeviation', '8').attr('result', 'hoverBlur');
    const feMergeHover = hoverGlowFilter.append('feMerge');
    feMergeHover.append('feMergeNode').attr('in', 'hoverBlur');
    feMergeHover.append('feMergeNode').attr('in', 'SourceGraphic');

    // Search Match Golden Beacon Glow Filter
    const searchGlowFilter = defs.append('filter').attr('id', 'search-match-glow');
    searchGlowFilter.append('feGaussianBlur').attr('stdDeviation', '6').attr('result', 'searchBlur');
    const feMergeSearch = searchGlowFilter.append('feMerge');
    feMergeSearch.append('feMergeNode').attr('in', 'searchBlur');
    feMergeSearch.append('feMergeNode').attr('in', 'SourceGraphic');

    // Shortest Path Tracer Golden Particle Glow Filter
    const pathGlowFilter = defs.append('filter').attr('id', 'path-trace-glow');
    pathGlowFilter.append('feGaussianBlur').attr('stdDeviation', '7').attr('result', 'pathBlur');
    const feMergePath = pathGlowFilter.append('feMerge');
    feMergePath.append('feMergeNode').attr('in', 'pathBlur');
    feMergePath.append('feMergeNode').attr('in', 'SourceGraphic');

    // Root zoom container
    const g = svg.append('g').attr('class', 'graph-root');

    // D3 Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.35, 3.5])
      .on('zoom', event => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Deep clones for D3 simulation to prevent mutation collisions
    const simNodes: KnowledgeNode[] = filteredNodes.map(d => ({ ...d }));
    const simLinks: KnowledgeLink[] = filteredLinks.map(d => ({ ...d }));

    // Cluster Centers Mapping for 'Clustering Mode'
    const clusterCenters: Record<string, { x: number; y: number; label: string; color: string }> = {
      zone: { x: width * 0.28, y: height * 0.28, label: 'Restoration Zones', color: '#10B981' },
      evidence_flora: { x: width * 0.74, y: height * 0.26, label: 'Flora Biomass', color: '#34D399' },
      evidence_fauna: { x: width * 0.76, y: height * 0.74, label: 'Fauna & Bio-Acoustics', color: '#F43F5E' },
      evidence_hydrology: { x: width * 0.50, y: height * 0.82, label: 'Hydrology Catchments', color: '#38BDF8' },
      evidence_soil: { x: width * 0.24, y: height * 0.74, label: 'Soil Microbiome', color: '#D97706' },
      keystone_mechanism: { x: width * 0.50, y: height * 0.44, label: 'Keystone Biophysics', color: '#C5A059' }
    };

    // Draw Cluster Background Boundaries when in Clustering Mode or Radial Mode
    if (isClusteringMode && layoutPreset === 'force-directed') {
      const clusterBgGroup = g.append('g').attr('class', 'cluster-hulls');
      Object.entries(clusterCenters).forEach(([typeKey, clusterInfo]) => {
        // Soft rounded cluster zone indicator
        const clusterBg = clusterBgGroup.append('g').attr('class', `cluster-boundary-${typeKey}`);
        
        clusterBg
          .append('circle')
          .attr('cx', clusterInfo.x)
          .attr('cy', clusterInfo.y)
          .attr('r', 110)
          .attr('fill', clusterInfo.color)
          .attr('fill-opacity', 0.04)
          .attr('stroke', clusterInfo.color)
          .attr('stroke-opacity', 0.18)
          .attr('stroke-dasharray', '4,4')
          .attr('stroke-width', 1);

        clusterBg
          .append('text')
          .attr('x', clusterInfo.x)
          .attr('y', clusterInfo.y - 95)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('font-family', 'monospace')
          .attr('font-weight', 'bold')
          .attr('fill', clusterInfo.color)
          .attr('opacity', 0.7)
          .text(`[ ${clusterInfo.label.toUpperCase()} ]`);
      });
    }

    // Radial concentric rings background guide
    if (layoutPreset === 'radial') {
      const radialBgGroup = g.append('g').attr('class', 'radial-rings-guide');
      const rings = [
        { r: 70, label: 'Central Zones', color: '#10B981' },
        { r: 150, label: 'Keystone Mechanisms', color: '#C5A059' },
        { r: 240, label: 'Flora & Fauna Trophics', color: '#34D399' },
        { r: 330, label: 'Subterranean Aquifer & Soil', color: '#38BDF8' }
      ];

      rings.forEach(ring => {
        radialBgGroup
          .append('circle')
          .attr('cx', width / 2)
          .attr('cy', height / 2)
          .attr('r', ring.r)
          .attr('fill', 'none')
          .attr('stroke', ring.color)
          .attr('stroke-opacity', 0.12)
          .attr('stroke-dasharray', '3,3')
          .attr('stroke-width', 1);

        radialBgGroup
          .append('text')
          .attr('x', width / 2)
          .attr('y', height / 2 - ring.r - 4)
          .attr('text-anchor', 'middle')
          .attr('font-size', '8px')
          .attr('font-family', 'monospace')
          .attr('fill', ring.color)
          .attr('opacity', 0.5)
          .text(`[ ${ring.label.toUpperCase()} ]`);
      });
    }

    // Hierarchical tier background guides
    if (layoutPreset === 'hierarchical') {
      const hierBgGroup = g.append('g').attr('class', 'hierarchical-tiers-guide');
      const tiers = [
        { y: height * 0.16, label: 'Tier 1: Restoration Zones & Macro Canopy', color: '#10B981' },
        { y: height * 0.32, label: 'Tier 2: Primary Producers (Flora)', color: '#34D399' },
        { y: height * 0.48, label: 'Tier 3: Secondary Consumers (Fauna & Bio-Acoustics)', color: '#F43F5E' },
        { y: height * 0.64, label: 'Tier 4: Keystone Biophysical Mechanisms', color: '#C5A059' },
        { y: height * 0.78, label: 'Tier 5: Catchment Hydrology & Springs', color: '#38BDF8' },
        { y: height * 0.90, label: 'Tier 6: Mycelial Subsurface & Living Soil', color: '#D97706' }
      ];

      tiers.forEach(tier => {
        hierBgGroup
          .append('line')
          .attr('x1', width * 0.08)
          .attr('y1', tier.y)
          .attr('x2', width * 0.92)
          .attr('y2', tier.y)
          .attr('stroke', tier.color)
          .attr('stroke-opacity', 0.15)
          .attr('stroke-dasharray', '2,4')
          .attr('stroke-width', 1);

        hierBgGroup
          .append('text')
          .attr('x', width * 0.09)
          .attr('y', tier.y - 4)
          .attr('font-size', '8px')
          .attr('font-family', 'monospace')
          .attr('fill', tier.color)
          .attr('opacity', 0.55)
          .text(tier.label.toUpperCase());
      });
    }

    // Target Position Calculation for Layout Presets
    const getTargetPosition = (d: KnowledgeNode) => {
      if (layoutPreset === 'radial') {
        let ringRadius = 240;
        if (d.type === 'zone') ringRadius = 70;
        else if (d.type === 'keystone_mechanism') ringRadius = 150;
        else if (d.type === 'evidence_flora' || d.type === 'evidence_fauna') ringRadius = 240;
        else if (d.type === 'evidence_hydrology' || d.type === 'evidence_soil') ringRadius = 330;

        const sameTypeNodes = simNodes.filter(n => {
          if (ringRadius === 240) return n.type === 'evidence_flora' || n.type === 'evidence_fauna';
          if (ringRadius === 330) return n.type === 'evidence_hydrology' || n.type === 'evidence_soil';
          return n.type === d.type;
        });

        const subIndex = sameTypeNodes.findIndex(n => n.id === d.id);
        const subTotal = sameTypeNodes.length || 1;
        const angle = (subIndex / subTotal) * 2 * Math.PI - Math.PI / 2;

        return {
          x: width / 2 + ringRadius * Math.cos(angle),
          y: height / 2 + ringRadius * Math.sin(angle)
        };
      }

      if (layoutPreset === 'hierarchical') {
        let tierY = height * 0.5;
        if (d.type === 'zone') tierY = height * 0.16;
        else if (d.type === 'evidence_flora') tierY = height * 0.32;
        else if (d.type === 'evidence_fauna') tierY = height * 0.48;
        else if (d.type === 'keystone_mechanism') tierY = height * 0.64;
        else if (d.type === 'evidence_hydrology') tierY = height * 0.78;
        else if (d.type === 'evidence_soil') tierY = height * 0.90;

        const sameTypeNodes = simNodes.filter(n => n.type === d.type);
        const subIndex = sameTypeNodes.findIndex(n => n.id === d.id);
        const subTotal = sameTypeNodes.length || 1;
        const marginX = width * 0.12;
        const availableW = width - marginX * 2;
        const tierX = marginX + ((subIndex + 0.5) / subTotal) * availableW;

        return { x: tierX, y: tierY };
      }

      // Default Force-Directed (with clustering support)
      if (isClusteringMode && clusterCenters[d.type]) {
        return { x: clusterCenters[d.type].x, y: clusterCenters[d.type].y };
      }

      return { x: width / 2, y: height / 2 };
    };

    const isRadial = layoutPreset === 'radial';
    const isHierarchical = layoutPreset === 'hierarchical';
    const positioningStrength = isRadial ? 0.45 : isHierarchical ? 0.52 : isClusteringMode ? physicsParams.clusterPull : 0.06;

    // Create D3 Force Simulation with dynamic physicsDebugger parameters & clustering forces
    const simulation = d3
      .forceSimulation<KnowledgeNode>(simNodes)
      .velocityDecay(isRadial || isHierarchical ? 0.35 : physicsParams.velocityDecay)
      .force(
        'link',
        d3
          .forceLink<KnowledgeNode, KnowledgeLink>(simLinks)
          .id(d => d.id)
          .distance(isRadial || isHierarchical ? 85 : isClusteringMode ? physicsParams.linkDistance * 0.85 : physicsParams.linkDistance)
          .strength(isRadial || isHierarchical ? 0.12 : isClusteringMode ? 0.35 : physicsParams.linkStrength)
      )
      .force('charge', d3.forceManyBody().strength(isRadial || isHierarchical ? -150 : isClusteringMode ? physicsParams.chargeStrength * 0.75 : physicsParams.chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(isRadial || isHierarchical ? 0.08 : physicsParams.centerStrength))
      .force(
        'x',
        d3.forceX<KnowledgeNode>(d => getTargetPosition(d).x).strength(positioningStrength)
      )
      .force(
        'y',
        d3.forceY<KnowledgeNode>(d => getTargetPosition(d).y).strength(positioningStrength)
      )
      .force('collision', d3.forceCollide().radius(d => (d as KnowledgeNode).val + (isRadial || isHierarchical ? 12 : physicsParams.collisionRadius)));

    simulationRef.current = simulation;
    if (isPhysicsFrozen) {
      simulation.stop();
    }

    // 1. Draw Links
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup
      .selectAll<SVGLineElement, KnowledgeLink>('line')
      .data(simLinks)
      .enter()
      .append('line')
      .attr('stroke', d => {
        if (isCompareDiffOverlayActive && diffAddedLinkIds.has(d.id)) return '#10B981';
        if (isCompareDiffOverlayActive && diffRemovedLinkIds.has(d.id)) return '#F43F5E';
        if (pathLinkIdsSet.has(d.id)) return '#F59E0B';
        if (searchMatchedNodeIds.size > 0) {
          const srcId = typeof d.source === 'object' ? (d.source as any).id : d.source;
          const tgtId = typeof d.target === 'object' ? (d.target as any).id : d.target;
          if (searchMatchedNodeIds.has(srcId) && searchMatchedNodeIds.has(tgtId)) return '#F59E0B';
          if (searchMatchedNodeIds.has(srcId) || searchMatchedNodeIds.has(tgtId)) return '#FBBF24';
        }
        return d.color || '#F5F5F0';
      })
      .attr('stroke-width', 0)
      .attr('stroke-opacity', 0)
      .attr('stroke-dasharray', d => {
        if (isCompareDiffOverlayActive && diffRemovedLinkIds.has(d.id)) return '4,4';
        return d.relationshipType === 'stewardship_governance' ? '4,4' : undefined;
      })
      .attr('marker-end', d => `url(#arrow-${d.relationshipType})`)
      .attr('filter', d => (pathLinkIdsSet.has(d.id) ? 'url(#path-trace-glow)' : null));

    // Smooth entry transition for links
    link
      .transition()
      .duration(700)
      .ease(d3.easeCubicInOut)
      .attr('stroke-width', d => {
        if (isCompareDiffOverlayActive && diffAddedLinkIds.has(d.id)) return 4;
        if (pathLinkIdsSet.has(d.id)) return 4.5;
        if (searchMatchedNodeIds.size > 0) {
          const srcId = typeof d.source === 'object' ? (d.source as any).id : d.source;
          const tgtId = typeof d.target === 'object' ? (d.target as any).id : d.target;
          if (searchMatchedNodeIds.has(srcId) && searchMatchedNodeIds.has(tgtId)) return 3.5;
          if (searchMatchedNodeIds.has(srcId) || searchMatchedNodeIds.has(tgtId)) return 2.5;
          return 1;
        }
        return Math.max(1.5, d.strength * 3);
      })
      .attr('stroke-opacity', d => {
        // Real-time Search Dimming for Links
        if (searchMatchedNodeIds.size > 0) {
          const srcId = typeof d.source === 'object' ? (d.source as any).id : d.source;
          const tgtId = typeof d.target === 'object' ? (d.target as any).id : d.target;
          if (searchMatchedNodeIds.has(srcId) && searchMatchedNodeIds.has(tgtId)) return 0.95;
          if (searchMatchedNodeIds.has(srcId) || searchMatchedNodeIds.has(tgtId)) return 0.75;
          return 0.04; // Non-relevant links are dimmed to subtle 4%
        }
        if (isCompareDiffOverlayActive) {
          if (diffAddedLinkIds.has(d.id)) return 0.95;
          if (diffRemovedLinkIds.has(d.id)) return 0.7;
          return 0.25;
        }
        if (activePathResult) {
          return pathLinkIdsSet.has(d.id) ? 1.0 : 0.08;
        }
        if (hoveredNodeId) {
          const srcId = typeof d.source === 'object' ? (d.source as any).id : d.source;
          const tgtId = typeof d.target === 'object' ? (d.target as any).id : d.target;
          return srcId === hoveredNodeId || tgtId === hoveredNodeId ? 1.0 : 0.08;
        }
        if (selectedNodeId) {
          const srcId = typeof d.source === 'object' ? (d.source as any).id : d.source;
          const tgtId = typeof d.target === 'object' ? (d.target as any).id : d.target;
          return srcId === selectedNodeId || tgtId === selectedNodeId ? 0.95 : 0.15;
        }
        return 0.45;
      });

    // 2. Draw Link Labels
    const linkLabelGroup = g.append('g').attr('class', 'link-labels');
    const linkLabel = linkLabelGroup
      .selectAll<SVGTextElement, KnowledgeLink>('text')
      .data(simLinks)
      .enter()
      .append('text')
      .attr('font-size', '8px')
      .attr('font-family', 'monospace')
      .attr('fill', d => (pathLinkIdsSet.has(d.id) ? '#FBBF24' : '#C5A059'))
      .attr('font-weight', d => (pathLinkIdsSet.has(d.id) ? 'bold' : 'normal'))
      .attr('text-anchor', 'middle')
      .attr('opacity', 0)
      .text(d => d.relationshipLabel);

    linkLabel
      .transition()
      .duration(600)
      .attr('opacity', d => {
        if (searchMatchedNodeIds.size > 0) {
          const srcId = typeof d.source === 'object' ? (d.source as any).id : d.source;
          const tgtId = typeof d.target === 'object' ? (d.target as any).id : d.target;
          return searchMatchedNodeIds.has(srcId) || searchMatchedNodeIds.has(tgtId) ? 0.85 : 0;
        }
        if (pathLinkIdsSet.has(d.id)) return 1.0;
        const activeNode = hoveredNodeId || selectedNodeId;
        if (!activeNode) return 0;
        const srcId = typeof d.source === 'object' ? (d.source as any).id : d.source;
        const tgtId = typeof d.target === 'object' ? (d.target as any).id : d.target;
        return srcId === activeNode || tgtId === activeNode ? 0.9 : 0;
      });

    // 3. Draw Nodes Group
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup
      .selectAll<SVGGElement, KnowledgeNode>('g')
      .data(simNodes)
      .enter()
      .append('g')
      .attr('id', d => `node-el-${d.id}`)
      .attr('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, KnowledgeNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node Outer Pulsing Aura Ring (For selected, diff, path tracer, active period, or search matched)
    const auraRing = node
      .append('circle')
      .attr('class', 'pulse-ring')
      .attr('r', 0)
      .attr('fill', 'none')
      .attr('stroke', d => {
        if (isCompareDiffOverlayActive && diffAddedNodeIds.has(d.id)) return '#10B981';
        if (isCompareDiffOverlayActive && diffRemovedNodeIds.has(d.id)) return '#F43F5E';
        if (pathNodeIdsSet.has(d.id)) return '#F59E0B';
        if (selectedNodeIdsSet.has(d.id)) return '#10B981';
        if (customTags[d.id]?.tagColor) return customTags[d.id].tagColor;
        if (searchMatchedNodeIds.has(d.id)) return '#F59E0B';
        if (d.id === selectedNodeId) return '#C5A059';
        return d.color;
      })
      .attr('stroke-width', d => {
        if (isCompareDiffOverlayActive && (diffAddedNodeIds.has(d.id) || diffRemovedNodeIds.has(d.id))) return 3.5;
        if (pathNodeIdsSet.has(d.id) || selectedNodeIdsSet.has(d.id)) return 3.5;
        if (searchMatchedNodeIds.has(d.id)) return 3;
        if (d.id === selectedNodeId) return 2.5;
        return 1.5;
      })
      .attr('stroke-dasharray', d => {
        if (isCompareDiffOverlayActive && diffRemovedNodeIds.has(d.id)) return '3,3';
        if (selectedNodeIdsSet.has(d.id)) return '2,2';
        if (searchMatchedNodeIds.has(d.id)) return '3,3';
        if (d.id === selectedNodeId) return '4,4';
        return 'none';
      })
      .attr('opacity', 0)
      .attr('filter', d => (pathNodeIdsSet.has(d.id) || searchMatchedNodeIds.has(d.id) ? 'url(#search-match-glow)' : null));

    auraRing
      .transition()
      .duration(650)
      .ease(d3.easeCubicInOut)
      .attr('r', d => (pathNodeIdsSet.has(d.id) || searchMatchedNodeIds.has(d.id) ? d.val + 10 : d.val + 6))
      .attr('opacity', d => {
        if (searchMatchedNodeIds.size > 0) {
          return searchMatchedNodeIds.has(d.id) ? 1.0 : 0;
        }
        if (isCompareDiffOverlayActive) {
          return diffAddedNodeIds.has(d.id) || diffRemovedNodeIds.has(d.id) ? 1.0 : 0.2;
        }
        if (pathNodeIdsSet.has(d.id) || selectedNodeIdsSet.has(d.id) || searchMatchedNodeIds.has(d.id)) return 1.0;
        if (customTags[d.id]) return 0.9;
        if (d.id === selectedNodeId) return 0.95;
        if (isNodeInActivePeriod(d.era, currentPlaybackYear)) return 0.7;
        return 0;
      });

    // Node Main Core Circle with smooth radius & opacity morph transition + Real-Time Search Dimming
    const coreCircle = node
      .append('circle')
      .attr('class', 'main-node-circle')
      .attr('r', 0)
      .attr('fill', d => {
        if (isCompareDiffOverlayActive && diffAddedNodeIds.has(d.id)) return '#065F46';
        if (isCompareDiffOverlayActive && diffRemovedNodeIds.has(d.id)) return '#4C0519';
        if (pathNodeIdsSet.has(d.id)) return '#F59E0B';
        if (selectedNodeIdsSet.has(d.id)) return '#059669';
        if (searchMatchedNodeIds.has(d.id)) return '#D97706';
        if (d.id === selectedNodeId) return d.color;
        if (neighborNodeIds.has(d.id)) return d.color;
        return '#141414';
      })
      .attr('fill-opacity', 0)
      .attr('stroke', d => {
        if (isCompareDiffOverlayActive && diffAddedNodeIds.has(d.id)) return '#34D399';
        if (isCompareDiffOverlayActive && diffRemovedNodeIds.has(d.id)) return '#F43F5E';
        if (pathNodeIdsSet.has(d.id)) return '#FBBF24';
        if (selectedNodeIdsSet.has(d.id)) return '#34D399';
        if (customTags[d.id]?.tagColor) return customTags[d.id].tagColor;
        if (searchMatchedNodeIds.has(d.id)) return '#FBBF24';
        return d.color;
      })
      .attr('stroke-width', d => {
        if (isCompareDiffOverlayActive && (diffAddedNodeIds.has(d.id) || diffRemovedNodeIds.has(d.id))) return 3.5;
        return (pathNodeIdsSet.has(d.id) || searchMatchedNodeIds.has(d.id) ? 3.5 : d.id === selectedNodeId ? 3 : 1.5);
      })
      .attr('stroke-dasharray', d => {
        if (isCompareDiffOverlayActive && diffRemovedNodeIds.has(d.id)) return '3,3';
        return 'none';
      })
      .attr('filter', d => (pathNodeIdsSet.has(d.id) ? 'url(#path-trace-glow)' : searchMatchedNodeIds.has(d.id) ? 'url(#search-match-glow)' : d.id === selectedNodeId ? 'url(#node-glow)' : null));

    coreCircle
      .transition()
      .duration(750)
      .ease(d3.easeCubicInOut)
      .attr('r', d => {
        if (searchMatchedNodeIds.size > 0) {
          return searchMatchedNodeIds.has(d.id) ? d.val * 1.35 : Math.max(6, d.val * 0.7);
        }
        const layerMatch = isNodeInActiveLayer(d.ecologicalLayer);
        const searchMatch = searchMatchedNodeIds.has(d.id);
        if (searchMatch || pathNodeIdsSet.has(d.id)) return d.val * 1.25;
        return layerMatch ? d.val : Math.max(8, d.val * 0.6);
      })
      .attr('fill-opacity', d => {
        // Real-Time Search Dimming for Nodes
        if (searchMatchedNodeIds.size > 0) {
          return searchMatchedNodeIds.has(d.id) ? 1.0 : 0.08;
        }
        if (isCompareDiffOverlayActive) {
          if (diffAddedNodeIds.has(d.id) || diffRemovedNodeIds.has(d.id)) return 1.0;
          return 0.35;
        }
        if (pathNodeIdsSet.has(d.id) || selectedNodeIdsSet.has(d.id)) return 1.0;
        const periodMatch = isNodeInActivePeriod(d.era, currentPlaybackYear);
        const layerMatch = isNodeInActiveLayer(d.ecologicalLayer);
        if (d.id === selectedNodeId) return 0.95;
        if (neighborNodeIds.has(d.id)) return 0.8;
        if (!periodMatch || !layerMatch) return 0.15;
        return 0.6;
      })
      .attr('stroke-opacity', d => {
        if (searchMatchedNodeIds.size > 0) {
          return searchMatchedNodeIds.has(d.id) ? 1.0 : 0.15;
        }
        return 1.0;
      });

    // Custom Tag Indicator Badge (Top right corner of node)
    node
      .filter(d => !!customTags[d.id])
      .append('circle')
      .attr('cx', d => d.val * 0.75)
      .attr('cy', d => -d.val * 0.75)
      .attr('r', 5)
      .attr('fill', d => customTags[d.id]?.tagColor || '#C5A059')
      .attr('stroke', '#0D0D0D')
      .attr('stroke-width', 1.5);

    // Node Central Glyph / Icon Text
    node
      .append('text')
      .attr('class', 'glyph-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#F5F5F0')
      .attr('font-size', d => (d.val > 22 ? '11px' : '9px'))
      .attr('font-weight', 'bold')
      .attr('font-family', 'sans-serif')
      .attr('pointer-events', 'none')
      .attr('opacity', 0)
      .text(d => {
        if (isCompareDiffOverlayActive && diffAddedNodeIds.has(d.id)) return '+';
        if (isCompareDiffOverlayActive && diffRemovedNodeIds.has(d.id)) return '-';
        if (pathNodeIdsSet.has(d.id)) {
          const stepIndex = activePathResult?.pathNodeIds.indexOf(d.id);
          return typeof stepIndex === 'number' && stepIndex >= 0 ? `${stepIndex + 1}` : '•';
        }
        if (d.type === 'zone') return 'Z';
        if (d.type === 'evidence_flora') return 'FL';
        if (d.type === 'evidence_fauna') return 'FA';
        if (d.type === 'evidence_hydrology') return 'HY';
        if (d.type === 'evidence_soil') return 'SO';
        return 'KM';
      })
      .transition()
      .duration(600)
      .delay(150)
      .attr('opacity', d => {
        if (searchMatchedNodeIds.size > 0) {
          return searchMatchedNodeIds.has(d.id) ? 1.0 : 0.12;
        }
        if (pathNodeIdsSet.has(d.id)) return 1.0;
        const layerMatch = isNodeInActiveLayer(d.ecologicalLayer);
        return layerMatch ? 1.0 : 0.3;
      });

    // Node Name Label with Custom Label & Search Highlighting
    const textLabels = node
      .append('text')
      .attr('class', 'node-title-label')
      .attr('y', d => d.val + (searchMatchedNodeIds.has(d.id) ? 18 : 14))
      .attr('text-anchor', 'middle')
      .attr('font-size', d => (searchMatchedNodeIds.has(d.id) ? '11px' : '10px'))
      .attr('font-family', 'serif')
      .attr('font-weight', d => (pathNodeIdsSet.has(d.id) || searchMatchedNodeIds.has(d.id) || d.id === selectedNodeId ? 'bold' : 'normal'))
      .attr('fill', d => {
        if (isCompareDiffOverlayActive && diffAddedNodeIds.has(d.id)) return '#34D399';
        if (isCompareDiffOverlayActive && diffRemovedNodeIds.has(d.id)) return '#FB7185';
        if (pathNodeIdsSet.has(d.id)) return '#F59E0B';
        if (searchMatchedNodeIds.has(d.id)) return '#FBBF24';
        if (customTags[d.id]?.tagColor) return customTags[d.id].tagColor;
        if (d.id === selectedNodeId) return '#C5A059';
        return '#F5F5F0';
      })
      .attr('opacity', 0)
      .text(d => {
        const displayLabel = customTags[d.id]?.customLabel ? `[${customTags[d.id].customLabel}] ${d.label}` : d.label;
        return displayLabel.length > 24 ? displayLabel.substring(0, 22) + '...' : displayLabel;
      });

    textLabels
      .transition()
      .duration(650)
      .delay(200)
      .attr('opacity', d => {
        if (searchMatchedNodeIds.size > 0) {
          return searchMatchedNodeIds.has(d.id) ? 1.0 : 0.12;
        }
        if (pathNodeIdsSet.has(d.id)) return 1.0;
        const periodMatch = isNodeInActivePeriod(d.era, currentPlaybackYear);
        const layerMatch = isNodeInActiveLayer(d.ecologicalLayer);
        if (d.id === selectedNodeId) return 1.0;
        if (!periodMatch || !layerMatch) return 0.2;
        if (!selectedNodeId) return 0.85;
        return neighborNodeIds.has(d.id) ? 1.0 : 0.45;
      });

    // Node Interaction Handlers (Click, ContextMenu Right-Click, Hover)
    node
      .on('contextmenu', (event, d) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenu({
          isOpen: true,
          x: event.clientX,
          y: event.clientY,
          nodeId: d.id
        });
        audioFeedback.playSubtleClick();
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        if (isMultiSelectMode) {
          setSelectedNodeIdsSet(prev => {
            const next = new Set(prev);
            if (next.has(d.id)) next.delete(d.id);
            else next.add(d.id);
            return next;
          });
          audioFeedback.playMicroTick();
        } else if (isPathTracerOpen) {
          if (!pathSourceNodeId) {
            setPathSourceNodeId(d.id);
            audioFeedback.playSubtleClick();
          } else if (!pathTargetNodeId && d.id !== pathSourceNodeId) {
            setPathTargetNodeId(d.id);
            audioFeedback.playDataSave();
          } else {
            setSelectedNodeId(d.id);
            audioFeedback.playSubtleClick();
          }
        } else {
          setSelectedNodeId(d.id);
          audioFeedback.playSubtleClick();
        }
      })
      .on('mouseenter', function (event, d) {
        setHoveredNodeId(d.id);
        audioFeedback.playMicroTick();

        // Calculate container-relative position for Quick-Look sparkline popover
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setQuickLookPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          });
        }
        setQuickLookNode(d);

        // 1. Radial expansion of hovered node core circle
        d3.select(this)
          .select('circle.main-node-circle')
          .transition()
          .duration(240)
          .ease(d3.easeCubicOut)
          .attr('r', d.val * 1.35 + 4)
          .attr('filter', 'url(#node-glow-hover)')
          .attr('stroke', '#F5F5F0')
          .attr('stroke-width', 3.5);

        // 2. Expand outer glowing aura ring
        d3.select(this)
          .select('circle.pulse-ring')
          .transition()
          .duration(240)
          .ease(d3.easeCubicOut)
          .attr('r', d.val * 1.35 + 12)
          .attr('opacity', 1.0)
          .attr('stroke', '#C5A059')
          .attr('stroke-width', 3);

        // 3. Emphasize connected pathways & marker arrows
        link
          .transition()
          .duration(200)
          .attr('stroke-width', l => {
            const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
            const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
            return s === d.id || t === d.id ? Math.max(3.5, l.strength * 5) : 1;
          })
          .attr('stroke-opacity', l => {
            const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
            const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
            return s === d.id || t === d.id ? 1.0 : 0.08;
          });

        // 4. Fade non-connected nodes slightly to emphasize pathway
        node
          .transition()
          .duration(200)
          .attr('opacity', n => {
            if (n.id === d.id) return 1.0;
            const isConnected = simLinks.some(l => {
              const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
              const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
              return (s === d.id && t === n.id) || (t === d.id && s === n.id);
            });
            return isConnected ? 1.0 : 0.2;
          });
      })
      .on('mouseleave', function (event, d) {
        setHoveredNodeId(null);
        setQuickLookNode(null);

        // Revert hovered node circle radius
        d3.select(this)
          .select('circle.main-node-circle')
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr('r', searchMatchedNodeIds.has(d.id) || pathNodeIdsSet.has(d.id) ? d.val * 1.25 : d.val)
          .attr('filter', pathNodeIdsSet.has(d.id) ? 'url(#path-trace-glow)' : searchMatchedNodeIds.has(d.id) ? 'url(#search-match-glow)' : d.id === selectedNodeId ? 'url(#node-glow)' : null)
          .attr('stroke', pathNodeIdsSet.has(d.id) ? '#FBBF24' : searchMatchedNodeIds.has(d.id) ? '#FBBF24' : customTags[d.id]?.tagColor || d.color)
          .attr('stroke-width', pathNodeIdsSet.has(d.id) || searchMatchedNodeIds.has(d.id) ? 3.5 : d.id === selectedNodeId ? 3 : 1.5);

        // Revert outer ring
        d3.select(this)
          .select('circle.pulse-ring')
          .transition()
          .duration(300)
          .attr('r', pathNodeIdsSet.has(d.id) || searchMatchedNodeIds.has(d.id) ? d.val + 10 : d.val + 6)
          .attr('opacity', pathNodeIdsSet.has(d.id) || searchMatchedNodeIds.has(d.id) ? 1.0 : d.id === selectedNodeId ? 0.95 : 0.7)
          .attr('stroke', pathNodeIdsSet.has(d.id) ? '#F59E0B' : searchMatchedNodeIds.has(d.id) ? '#F59E0B' : d.id === selectedNodeId ? '#C5A059' : d.color);

        // Revert links opacity
        link
          .transition()
          .duration(300)
          .attr('stroke-width', l => (pathLinkIdsSet.has(l.id) ? 4.5 : Math.max(1.5, l.strength * 3)))
          .attr('stroke-opacity', l => {
            if (activePathResult) {
              return pathLinkIdsSet.has(l.id) ? 1.0 : 0.08;
            }
            if (selectedNodeId) {
              const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
              const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
              return s === selectedNodeId || t === selectedNodeId ? 0.95 : 0.15;
            }
            return 0.45;
          });

        // Revert nodes opacity
        node
          .transition()
          .duration(300)
          .attr('opacity', 1.0);
      });

    // Simulation Tick Handler
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as KnowledgeNode).x || 0)
        .attr('y1', d => (d.source as KnowledgeNode).y || 0)
        .attr('x2', d => (d.target as KnowledgeNode).x || 0)
        .attr('y2', d => (d.target as KnowledgeNode).y || 0);

      linkLabel
        .attr('x', d => (((d.source as KnowledgeNode).x || 0) + ((d.target as KnowledgeNode).x || 0)) / 2)
        .attr('y', d => (((d.source as KnowledgeNode).y || 0) + ((d.target as KnowledgeNode).y || 0)) / 2 - 4);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [
    filteredNodes,
    filteredLinks,
    selectedNodeId,
    hoveredNodeId,
    neighborNodeIds,
    searchMatchedNodeIds,
    isFullscreen,
    physicsParams,
    isPhysicsFrozen,
    isClusteringMode,
    currentPlaybackYear,
    customTags,
    pathNodeIdsSet,
    pathLinkIdsSet,
    selectedNodeIdsSet,
    isMultiSelectMode,
    isPathTracerOpen,
    pathSourceNodeId,
    pathTargetNodeId,
    activePathResult,
    layoutPreset
  ]);

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg
      .transition()
      .duration(600)
      .call(d3.zoom<SVGSVGElement, unknown>().transform as any, d3.zoomIdentity);
    audioFeedback.playMicroTick();
  };

  const handleZoom = (delta: number) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg
      .transition()
      .duration(300)
      .call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, delta);
    audioFeedback.playMicroTick();
  };

  const getNodeTypeBadge = (type: KnowledgeNodeType) => {
    switch (type) {
      case 'zone':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'evidence_flora':
        return 'bg-lime-950/80 text-lime-300 border-lime-500/40';
      case 'evidence_fauna':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
      case 'evidence_hydrology':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
      case 'evidence_soil':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'keystone_mechanism':
      default:
        return 'bg-[#2B2313] text-[#C5A059] border-[#C5A059]/40';
    }
  };

  return (
    <div
      id="bioregional-knowledge-graph"
      className={`bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm overflow-hidden space-y-4 shadow-2xl text-[#F5F5F0] transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 p-6 bg-[#080808] overflow-y-auto' : ''
      }`}
    >
      {/* Header Bar */}
      <div className="p-5 border-b border-[#F5F5F0]/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-[#C5A059]" />
              D3.JS ECOLOGICAL DEPENDENCY GRAPH • BIOREGIONAL CAUSAL MESH
            </span>
            <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Verified In-Situ Feedbacks
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Bioregional Knowledge Graph
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans">
            Force-directed dynamic graph visualizing symbiotic ecological couplings, mycorrhizal glomalin channels, hydrological catchment recharge, and trophic cascade dependencies between field evidence and project zones.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Undo / Redo Controls */}
          <div className="flex items-center gap-0.5 bg-[#171717] p-1 rounded-sm border border-[#F5F5F0]/10">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className={`p-1.5 rounded transition-colors ${
                canUndo ? 'text-[#F5F5F0]/80 hover:text-[#F5F5F0] hover:bg-[#222] cursor-pointer' : 'text-[#F5F5F0]/20 cursor-not-allowed'
              }`}
              title="Undo State Change (Ctrl+Z / Cmd+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className={`p-1.5 rounded transition-colors ${
                canRedo ? 'text-[#F5F5F0]/80 hover:text-[#F5F5F0] hover:bg-[#222] cursor-pointer' : 'text-[#F5F5F0]/20 cursor-not-allowed'
              }`}
              title="Redo State Change (Ctrl+Y / Cmd+Shift+Z)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Auto-Arrange Button */}
          <button
            onClick={handleAutoArrange}
            disabled={isAutoArranging}
            className={`px-3 py-1.5 border text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              isAutoArranging
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 font-bold'
                : 'bg-[#171717] hover:bg-[#222] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
            }`}
            title="Auto-Arrange Nodes with High-Intensity Force Simulation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAutoArranging ? 'animate-spin text-amber-400' : 'text-[#C5A059]'}`} />
            <span>{isAutoArranging ? 'Untangling...' : 'Auto-Arrange'}</span>
          </button>

          {/* Layout Presets Dropdown Menu */}
          <LayoutPresetsMenu
            currentPreset={layoutPreset}
            onSelectPreset={preset => {
              setLayoutPreset(preset);
              if (simulationRef.current) {
                simulationRef.current.alpha(0.85).restart();
              }
            }}
            isOpen={isLayoutMenuOpen}
            onToggle={() => setIsLayoutMenuOpen(prev => !prev)}
          />

          {/* Clustering Analytics HUD Toggle */}
          <button
            onClick={() => {
              setIsClusteringHUDOpen(prev => !prev);
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1.5 border text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              isClusteringHUDOpen
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 font-bold shadow-lg shadow-emerald-950/30'
                : 'bg-[#171717] hover:bg-[#222] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
            }`}
            title="Cluster Modularity & Density Analytics HUD"
          >
            <PieChart className="w-3.5 h-3.5 text-emerald-400" />
            <span>Analytics HUD</span>
          </button>

          {/* Dynamic Legend Toggle Button */}
          <button
            onClick={() => {
              setIsLegendOpen(prev => !prev);
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1.5 border text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              isLegendOpen
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 font-bold'
                : 'bg-[#171717] hover:bg-[#222] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
            }`}
            title="Toggle Dynamic Legend and Node/Link Visibility Filters"
          >
            {isLegendOpen ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Legend & Filter</span>
          </button>

          {/* Compare Snapshots Modal Button */}
          <button
            onClick={() => {
              setIsCompareModalOpen(true);
              audioFeedback.playSubtleClick();
            }}
            className={`px-3 py-1.5 border text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              isCompareDiffOverlayActive
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 font-bold shadow-lg shadow-amber-950/40'
                : 'bg-[#171717] hover:bg-[#222] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
            }`}
            title="Compare Two Historical Graph Snapshots & Visual Diff"
          >
            <GitCompare className="w-3.5 h-3.5 text-amber-400" />
            <span>{isCompareDiffOverlayActive ? 'Diff Overlay' : 'Compare'}</span>
          </button>

          {/* Knowledge Export Suite Button */}
          <button
            onClick={() => {
              setIsKnowledgeExportOpen(true);
              audioFeedback.playSubtleClick();
            }}
            className="px-3 py-1.5 bg-[#171717] hover:bg-[#222] border border-[#F5F5F0]/10 text-xs font-mono text-[#F5F5F0]/70 hover:text-[#F5F5F0] rounded-sm flex items-center gap-1.5 transition-all cursor-pointer"
            title="Export Graph as JSON, GeoJSON or Vector SVG"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Export</span>
          </button>

          {/* Historical Versioning Sidebar Toggle */}
          <button
            onClick={() => {
              setIsHistorySidebarOpen(true);
              audioFeedback.playSubtleClick();
            }}
            className={`px-3 py-1.5 border text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSnapshotId
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 font-bold'
                : 'bg-[#171717] hover:bg-[#222] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
            }`}
            title="View Historical Graph Snapshots & Version Audit"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeSnapshotId ? 'Snapshot' : 'Versions'}</span>
          </button>

          {/* Multi-Select Toggle */}
          <button
            onClick={() => {
              setIsMultiSelectMode(prev => !prev);
              audioFeedback.playMicroTick();
            }}
            className={`px-3 py-1.5 border text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              isMultiSelectMode
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 font-bold'
                : 'bg-[#171717] hover:bg-[#222] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
            }`}
            title="Toggle Multi-Select Mode for Batch Operations"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Multi-Select {selectedNodeIdsSet.size > 0 && `(${selectedNodeIdsSet.size})`}</span>
          </button>

          {/* Shortest Path Tracer Button */}
          <button
            onClick={() => {
              setIsPathTracerOpen(prev => !prev);
              audioFeedback.playSubtleClick();
            }}
            className={`px-3 py-1.5 border text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              isPathTracerOpen
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 font-bold'
                : 'bg-[#171717] hover:bg-[#222] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
            }`}
            title="Trace Shortest Dependency Path Between Two Ecological Nodes"
          >
            <Route className="w-3.5 h-3.5" />
            <span>Path Tracer</span>
          </button>

          {/* Physics Debugger Overlay Toggle */}
          <button
            onClick={() => {
              setIsPhysicsDebuggerOpen(prev => !prev);
              audioFeedback.playSubtleClick();
            }}
            className={`px-3 py-1.5 border text-xs font-mono rounded-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              isPhysicsDebuggerOpen
                ? 'bg-purple-950/80 text-purple-300 border-purple-500/50 font-bold'
                : 'bg-[#171717] hover:bg-[#222] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
            }`}
            title="Real-Time D3 Force-Simulation Physics Debugger"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Physics</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#171717] p-1 rounded-sm border border-[#F5F5F0]/10">
            <button
              onClick={() => handleZoom(1.25)}
              className="p-1.5 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#222] rounded cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(0.8)}
              className="p-1.5 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#222] rounded cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#222] rounded cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={() => {
              setIsFullscreen(prev => !prev);
              audioFeedback.playMicroTick();
            }}
            className="px-3 py-1.5 bg-[#171717] hover:bg-[#222] border border-[#F5F5F0]/10 text-xs font-mono text-[#F5F5F0]/70 hover:text-[#F5F5F0] rounded-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Network Health Summary Panel */}
      <div className="px-5">
        <div className="p-3 bg-[#0F0F0F] border border-[#F5F5F0]/10 rounded-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          {/* Metric 1: Node Density */}
          <div className="space-y-1 border-r border-[#F5F5F0]/5 pr-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#F5F5F0]/50 uppercase">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Node Density</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-mono font-bold text-emerald-300">
                {networkHealth.avgConnections}
              </span>
              <span className="text-[10px] font-mono text-[#F5F5F0]/40">links/node</span>
            </div>
            <div className="text-[9px] font-mono text-[#F5F5F0]/40">
              {networkHealth.densityPercent}% Network Saturation
            </div>
          </div>

          {/* Metric 2: Connection Strength Average */}
          <div className="space-y-1 border-r border-[#F5F5F0]/5 pr-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#F5F5F0]/50 uppercase">
              <Gauge className="w-3 h-3 text-[#C5A059]" />
              <span>Connection Strength</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-mono font-bold text-[#C5A059]">
                {networkHealth.avgStrengthPercent}%
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">Avg</span>
            </div>
            <div className="text-[9px] font-mono text-emerald-400 truncate">
              {networkHealth.resilienceStatus}
            </div>
          </div>

          {/* Metric 3: Active Cluster Count */}
          <div className="space-y-1 border-r border-[#F5F5F0]/5 pr-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#F5F5F0]/50 uppercase">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Active Clusters</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-mono font-bold text-cyan-300">
                {networkHealth.activeClusterCount}
              </span>
              <span className="text-[10px] font-mono text-[#F5F5F0]/40">domains</span>
            </div>
            <div className="text-[9px] font-mono text-[#F5F5F0]/40">
              {isClusteringMode ? 'Force-Grouped by Category' : 'Natural Topography'}
            </div>
          </div>

          {/* Metric 4: Epistemic Ground Truth */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#F5F5F0]/50 uppercase">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Epistemic Integrity</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-mono font-bold text-amber-300">
                {networkHealth.avgConfidence}%
              </span>
              <span className="text-[10px] font-mono text-[#F5F5F0]/40">P90</span>
            </div>
            <div className="text-[9px] font-mono text-[#F5F5F0]/40">
              {networkHealth.nodeCount} nodes • {networkHealth.linkCount} couplings
            </div>
          </div>
        </div>
      </div>

      {/* Search Match Banner (High-visibility notification when search terms match nodes) */}
      {searchQuery && (
        <div className="mx-5 px-3.5 py-2 bg-[#1C170E] border border-[#C5A059]/40 rounded-sm flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 animate-pulse" />
            <span className="text-[#F5F5F0]/70">
              Global Epistemic Match:
            </span>
            <span className="px-2 py-0.5 bg-[#C5A059]/20 text-[#FBBF24] font-bold rounded border border-[#C5A059]/40">
              "{searchQuery}"
            </span>
            <span className="text-emerald-400 font-bold">
              ({searchMatchedNodeIds.size} node{searchMatchedNodeIds.size === 1 ? '' : 's'} highlighted)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {searchMatchedNodeIds.size > 0 && (
              <button
                onClick={() => {
                  const firstMatchId = Array.from(searchMatchedNodeIds)[0];
                  setSelectedNodeId(firstMatchId);
                  audioFeedback.playMicroTick();
                }}
                className="px-2 py-1 bg-[#C5A059] text-black font-bold text-[10px] rounded hover:bg-[#D4AF37] transition-colors cursor-pointer"
              >
                Focus First Match
              </button>
            )}
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#F5F5F0]/40 hover:text-[#F5F5F0] p-1"
              title="Clear Search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Filter & Controls Ribbon */}
      <div className="px-5 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Node Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
            <span className="text-[10px] uppercase text-[#F5F5F0]/40 flex items-center gap-1 mr-1 shrink-0">
              <Filter className="w-3 h-3 text-[#C5A059]" />
              Filter:
            </span>
            {['All', 'Zones', 'Flora', 'Fauna', 'Hydrology', 'Soil', 'Mechanisms'].map(filterKey => {
              const isSelected = selectedNodeTypeFilter === filterKey;
              return (
                <button
                  key={filterKey}
                  onClick={() => {
                    setSelectedNodeTypeFilter(filterKey);
                    audioFeedback.playMicroTick();
                  }}
                  className={`px-2.5 py-1 rounded-xs border text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#C5A059] text-black font-bold border-[#C5A059]'
                      : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                  }`}
                >
                  {filterKey}
                </button>
              );
            })}
          </div>

          {/* Relationship Filter & Search */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* Relationship Filter */}
            <select
              value={selectedLinkTypeFilter}
              onChange={e => {
                setSelectedLinkTypeFilter(e.target.value);
                audioFeedback.playMicroTick();
              }}
              className="bg-[#141414] border border-[#F5F5F0]/10 text-xs font-mono text-[#F5F5F0] rounded-xs px-2.5 py-1.5 outline-none focus:border-[#C5A059] cursor-pointer"
            >
              <option value="All">All Coupling Dependencies</option>
              <option value="hydrological_recharge">Hydrological Recharge</option>
              <option value="mycorrhizal_coupling">Mycorrhizal & Glomalin Coupling</option>
              <option value="trophic_cascade">Trophic Cascade</option>
              <option value="microclimate_feedback">Microclimate Feedback</option>
              <option value="stewardship_governance">Stewardship & Governance</option>
            </select>

            {/* Node Search (Supports local and global query sync) */}
            <div className="relative w-48 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40" />
              <input
                type="text"
                placeholder="Find node / marker..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 bg-[#141414] border border-[#F5F5F0]/10 rounded-xs text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/30 font-mono outline-none focus:border-[#C5A059]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40 hover:text-[#F5F5F0]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Graph Canvas + Inspector Side Panel */}
      <div className="px-5 pb-2 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* D3 Graph Stage (8 cols) */}
        <div
          ref={containerRef}
          className="lg:col-span-8 bg-[#070707] border border-[#F5F5F0]/10 rounded-sm relative overflow-hidden flex items-center justify-center min-h-[480px]"
        >
          <svg ref={svgRef} className="w-full h-full block cursor-grab active:cursor-grabbing select-none" />

          {/* Canvas Floating Legend */}
          <div className="absolute bottom-3 left-3 p-2.5 bg-black/85 backdrop-blur-md border border-[#F5F5F0]/10 rounded-xs space-y-1.5 text-[10px] font-mono pointer-events-none hidden sm:block">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#C5A059] uppercase font-bold text-[9px]">Node Legend</span>
              {isClusteringMode && (
                <span className="text-[8px] bg-[#C5A059]/20 text-[#C5A059] px-1 rounded">Clustered</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[#F5F5F0]/70 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Project Zone
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#34D399]" /> Flora
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#F43F5E]" /> Fauna
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> Hydrology
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#D97706]" /> Soil
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" /> Keystone Mechanism
              </span>
            </div>
          </div>

          {/* Physics adjustment popup toolbar */}
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/80 backdrop-blur-md p-1.5 rounded border border-[#F5F5F0]/10 text-[10px] font-mono z-10">
            <SlidersHorizontal className="w-3 h-3 text-[#C5A059]" />
            <span className="text-[#F5F5F0]/50">Distance:</span>
            <input
              type="range"
              min="80"
              max="220"
              value={physicsParams.linkDistance}
              onChange={e => setPhysicsParams(prev => ({ ...prev, linkDistance: parseInt(e.target.value, 10) }))}
              className="w-16 accent-[#C5A059] bg-[#222] h-1 rounded cursor-pointer"
            />
          </div>

          {/* Dynamic Legend & Visibility Filters Drawer */}
          <DynamicLegendToggle
            visibleNodeTypes={visibleNodeTypes}
            visibleLinkTypes={visibleLinkTypes}
            onToggleNodeType={handleToggleNodeType}
            onToggleLinkType={handleToggleLinkType}
            onSetAllNodeTypes={handleSetAllNodeTypes}
            onSetAllLinkTypes={handleSetAllLinkTypes}
            allNodes={filteredNodes}
            allLinks={filteredLinks}
            isOpen={isLegendOpen}
            onToggleOpen={() => setIsLegendOpen(prev => !prev)}
          />

          {/* Quick-Look Hover Sparklines Popover */}
          <NodeQuickLookPopover
            node={quickLookNode}
            position={quickLookPos}
          />

          {/* Clustering Analytics Modularity HUD Overlay */}
          <ClusteringAnalyticsHUD
            nodes={filteredNodes}
            links={filteredLinks}
            isOpen={isClusteringHUDOpen}
            onToggle={() => setIsClusteringHUDOpen(prev => !prev)}
            isClusteringMode={isClusteringMode}
            onToggleClusteringMode={() => {
              setIsClusteringMode(prev => !prev);
              audioFeedback.playMicroTick();
            }}
          />
        </div>

        {/* Selected Node Inspector Side Card (4 cols) */}
        <div className="lg:col-span-4 bg-[#111111] border border-[#C5A059]/40 rounded-sm p-5 space-y-4 text-left flex flex-col justify-between max-h-[540px] overflow-y-auto">
          {selectedNode ? (
            <div className="space-y-4">
              {/* Header Badge */}
              <div className="space-y-1.5 border-b border-[#F5F5F0]/10 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded border ${getNodeTypeBadge(selectedNode.type)}`}>
                    {selectedNode.categoryName}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {selectedNode.confidenceScore}% Ground Truth
                  </span>
                </div>
                <h3 className="text-base font-serif font-bold text-[#F5F5F0] leading-snug">
                  {selectedNode.label}
                </h3>
                {selectedNode.location && (
                  <p className="text-[11px] font-mono text-[#C5A059]">
                    📍 {selectedNode.location}
                  </p>
                )}
              </div>

              {/* Metric & Description */}
              <div className="space-y-2 text-xs">
                {selectedNode.metric && (
                  <div className="p-2.5 bg-[#090909] border border-emerald-500/30 rounded-xs flex items-center justify-between font-mono text-[11px]">
                    <span className="text-[#F5F5F0]/60 uppercase text-[9px]">Verified Metric:</span>
                    <span className="text-emerald-300 font-bold">{selectedNode.metric}</span>
                  </div>
                )}

                <p className="text-[#F5F5F0]/70 font-sans text-xs leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Upstream Dependencies (Inputs) */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">
                  Incoming Ecological Dependencies ({incomingLinks.length})
                </span>
                {incomingLinks.length === 0 ? (
                  <p className="text-[11px] font-mono text-[#F5F5F0]/40 italic">
                    Primary ecosystem originator / baseline node.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                    {incomingLinks.map(({ link, node }) => (
                      <div
                        key={link.id}
                        onClick={() => {
                          setSelectedNodeId(node.id);
                          audioFeedback.playMicroTick();
                        }}
                        className="p-2 bg-[#161616] hover:bg-[#1F1F1F] border border-[#F5F5F0]/5 rounded-xs space-y-0.5 cursor-pointer text-left transition-colors"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-emerald-300 font-bold truncate max-w-[160px]">{node.label}</span>
                          <span className="text-[#C5A059] text-[9px]">{Math.round(link.strength * 100)}% Coupling</span>
                        </div>
                        <p className="text-[10px] text-[#F5F5F0]/60 font-sans line-clamp-1">{link.relationshipLabel}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Downstream Contributions (Outputs) */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                  Outgoing Ecological Feedbacks ({outgoingLinks.length})
                </span>
                {outgoingLinks.length === 0 ? (
                  <p className="text-[11px] font-mono text-[#F5F5F0]/40 italic">
                    Terminal trophic beneficiary node.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                    {outgoingLinks.map(({ link, node }) => (
                      <div
                        key={link.id}
                        onClick={() => {
                          setSelectedNodeId(node.id);
                          audioFeedback.playMicroTick();
                        }}
                        className="p-2 bg-[#161616] hover:bg-[#1F1F1F] border border-[#F5F5F0]/5 rounded-xs space-y-0.5 cursor-pointer text-left transition-colors"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[#F5F5F0] font-bold truncate max-w-[160px]">{node.label}</span>
                          <span className="text-cyan-400 text-[9px]">{link.relationshipType.replace('_', ' ')}</span>
                        </div>
                        <p className="text-[10px] text-[#F5F5F0]/60 font-sans line-clamp-1">{link.relationshipLabel}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Epistemic Provenance Footer */}
              <div className="pt-2 border-t border-[#F5F5F0]/10 space-y-1 text-[10px] font-mono text-[#F5F5F0]/50">
                <div>Council: <span className="text-[#F5F5F0]">{selectedNode.verifiedBy || 'Atlas Autonomous Sensor Array'}</span></div>
                {selectedNode.hash && (
                  <div className="truncate">Hash: <span className="text-emerald-400 font-mono">{selectedNode.hash.substring(0, 16)}...</span></div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-2">
              <Network className="w-8 h-8 text-[#C5A059]/40 mx-auto" />
              <h4 className="text-sm font-serif text-[#F5F5F0]">Select an Ecological Node</h4>
              <p className="text-xs text-[#F5F5F0]/40 font-sans">
                Click any node in the graph to inspect its upstream biophysical drivers and downstream community feedbacks.
              </p>
            </div>
          )}

          {/* Quick Action Navigation */}
          {selectedNode && (
            <div className="pt-3 border-t border-[#F5F5F0]/10 flex items-center justify-between gap-2">
              {onNavigateToEvidence && (
                <button
                  onClick={() => {
                    onNavigateToEvidence(selectedNode.id);
                    audioFeedback.playMicroTick();
                  }}
                  className="w-full py-1.5 bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/40 text-emerald-300 text-xs font-mono rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Inspect in Geospatial Map</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mini Playback Control Bar (Ecological Succession Timeline Animation) */}
      <div className="mx-5 mb-4 p-3 bg-[#111111] border border-[#F5F5F0]/10 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Playback Transport Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCurrentPlaybackYear(prev => Math.max(2016, prev - 2));
              if (onTimelinePeriodChange) onTimelinePeriodChange(Math.max(2016, currentPlaybackYear - 2));
              audioFeedback.playMicroTick();
            }}
            className="p-1.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#F5F5F0]/10 rounded text-[#F5F5F0]/70 hover:text-[#F5F5F0] cursor-pointer"
            title="Step Backward (Previous Succession Horizon)"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsPlaybackRunning(prev => !prev);
              audioFeedback.playSubtleClick();
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlaybackRunning
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-[#C5A059] text-black hover:bg-[#D4AF37]'
            }`}
          >
            {isPlaybackRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaybackRunning ? 'Pause Evolution' : 'Animate Succession'}</span>
          </button>

          <button
            onClick={() => {
              setCurrentPlaybackYear(prev => (prev >= 2050 ? 2016 : prev + 2));
              if (onTimelinePeriodChange) onTimelinePeriodChange(currentPlaybackYear >= 2050 ? 2016 : currentPlaybackYear + 2);
              audioFeedback.playMicroTick();
            }}
            className="p-1.5 bg-[#1A1A1A] hover:bg-[#222] border border-[#F5F5F0]/10 rounded text-[#F5F5F0]/70 hover:text-[#F5F5F0] cursor-pointer"
            title="Step Forward (Next Succession Horizon)"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 ml-1 bg-[#171717] p-0.5 rounded border border-[#F5F5F0]/10 text-[10px] font-mono">
            {[1, 2, 4].map(spd => (
              <button
                key={spd}
                onClick={() => {
                  setPlaybackSpeed(spd);
                  audioFeedback.playMicroTick();
                }}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  playbackSpeed === spd ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Temporal Scrubber & Era Milestones */}
        <div className="flex-1 w-full flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#C5A059] font-bold shrink-0">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Year {currentPlaybackYear}</span>
          </div>

          {/* Timeline Milestones Track */}
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min="2016"
              max="2050"
              step="1"
              value={currentPlaybackYear}
              onChange={e => {
                const yr = parseInt(e.target.value, 10);
                setCurrentPlaybackYear(yr);
                if (onTimelinePeriodChange) onTimelinePeriodChange(yr);
              }}
              className="w-full accent-[#C5A059] bg-[#222] h-1.5 rounded cursor-pointer"
            />
          </div>

          <span className="text-[10px] font-mono text-[#F5F5F0]/40 shrink-0 hidden sm:inline">
            {TIMELINE_ERAS.find(e => isNodeInActivePeriod(e.key, currentPlaybackYear))?.milestone || 'Ecological Transition'}
          </span>
        </div>
      </div>

      {/* 1. Historical Versioning Sidebar */}
      <HistoricalVersioningSidebar
        isOpen={isHistorySidebarOpen}
        onClose={() => setIsHistorySidebarOpen(false)}
        activeSnapshotId={activeSnapshotId}
        onSelectSnapshot={setActiveSnapshotId}
        isDiffMode={isDiffMode}
        onToggleDiffMode={() => setIsDiffMode(prev => !prev)}
      />

      {/* 2. Batch Export Modal */}
      <BatchExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedNodes={selectedBatchNodes}
        allLinks={filteredLinks}
        customTags={customTags}
        bioregionId={selectedBioregionId}
      />

      {/* 3. Node Custom Tagging Context Menu (Right Click) */}
      <NodeContextMenu
        isOpen={!!contextMenu?.isOpen}
        x={contextMenu?.x || 0}
        y={contextMenu?.y || 0}
        node={contextMenu?.nodeId ? KNOWLEDGE_GRAPH_NODES.find(n => n.id === contextMenu.nodeId) || null : null}
        existingTag={contextMenu?.nodeId ? customTags[contextMenu.nodeId] : undefined}
        onClose={() => setContextMenu(null)}
        onTagSaved={() => {
          // Real-time listener automatically propagates updates
        }}
      />

      {/* 4. Physics Debugger Overlay */}
      <PhysicsDebuggerOverlay
        isOpen={isPhysicsDebuggerOpen}
        onClose={() => setIsPhysicsDebuggerOpen(false)}
        params={physicsParams}
        onChange={setPhysicsParams}
        onReheat={() => {
          if (simulationRef.current) {
            simulationRef.current.alpha(0.8).restart();
          }
        }}
        onFreeze={() => setIsPhysicsFrozen(prev => !prev)}
        isFrozen={isPhysicsFrozen}
        nodeCount={filteredNodes.length}
        linkCount={filteredLinks.length}
      />

      {/* 5. Animated Path Tracer Panel */}
      <AnimatedPathTracerPanel
        isOpen={isPathTracerOpen}
        onClose={() => setIsPathTracerOpen(false)}
        allNodes={filteredNodes}
        sourceNodeId={pathSourceNodeId}
        targetNodeId={pathTargetNodeId}
        onSelectSourceNode={setPathSourceNodeId}
        onSelectTargetNode={setPathTargetNodeId}
        pathResult={activePathResult}
        onClearPath={() => {
          setPathSourceNodeId(null);
          setPathTargetNodeId(null);
        }}
        onApplyPreset={(s, t) => {
          setPathSourceNodeId(s);
          setPathTargetNodeId(t);
        }}
      />

      {/* 6. Compare Snapshots Diff Modal */}
      <CompareSnapshotsModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        allNodes={KNOWLEDGE_GRAPH_NODES}
        allLinks={KNOWLEDGE_GRAPH_LINKS}
        initialSnapshotAId={diffOverlaySnapshotAId}
        initialSnapshotBId={diffOverlaySnapshotBId}
        onApplyDiffOverlay={(snapA, snapB) => {
          setDiffOverlaySnapshotAId(snapA);
          setDiffOverlaySnapshotBId(snapB);
          setIsCompareDiffOverlayActive(true);
        }}
        isDiffOverlayActive={isCompareDiffOverlayActive}
        onClearDiffOverlay={() => setIsCompareDiffOverlayActive(false)}
      />

      {/* 7. Knowledge Export Suite Modal */}
      <KnowledgeExportModal
        isOpen={isKnowledgeExportOpen}
        onClose={() => setIsKnowledgeExportOpen(false)}
        nodes={filteredNodes}
        links={filteredLinks}
        activeFilters={{
          nodeTypeFilter: selectedNodeTypeFilter,
          linkTypeFilter: selectedLinkTypeFilter,
          layerFilter: selectedLayerFilter,
          searchQuery: searchQuery,
          snapshotVersion: activeSnapshotId || undefined,
          layoutPreset: layoutPreset
        }}
        svgElementRef={svgRef}
      />
    </div>
  );
};
