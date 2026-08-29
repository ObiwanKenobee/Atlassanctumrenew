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
  Share2
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

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
    color: '#10B981'
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
    color: '#06B6D4'
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
    color: '#F59E0B'
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
    color: '#84CC16'
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
    color: '#3B82F6'
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
    color: '#34D399'
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
    color: '#10B981'
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
    color: '#F43F5E'
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
    color: '#FB7185'
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
    color: '#FBBF24'
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
    color: '#38BDF8'
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
    color: '#0284C7'
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
    color: '#0EA5E9'
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
    color: '#D97706'
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
    color: '#10B981'
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
    color: '#C5A059'
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
    color: '#C5A059'
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
    color: '#C5A059'
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
    color: '#EAB308'
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
  onNavigateToEvidence?: (markerId?: string) => void;
  onSelectModuleTab?: (tab: any) => void;
}

export const BioregionalKnowledgeGraph: React.FC<BioregionalKnowledgeGraphProps> = ({
  selectedBioregionId = 'aberdare_riparian_watershed',
  onNavigateToEvidence,
  onSelectModuleTab
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('zone-aberdare-ridge');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeTypeFilter, setSelectedNodeTypeFilter] = useState<string>('All');
  const [selectedLinkTypeFilter, setSelectedLinkTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [linkDistance, setLinkDistance] = useState<number>(130);
  const [chargeStrength, setChargeStrength] = useState<number>(-340);
  const [isPhysicsActive, setIsPhysicsActive] = useState<boolean>(true);

  // Filtered nodes & links
  const { filteredNodes, filteredLinks } = useMemo(() => {
    let nodes = [...KNOWLEDGE_GRAPH_NODES];
    let links = [...KNOWLEDGE_GRAPH_LINKS];

    // Filter nodes by type
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

    // Filter links by type
    if (selectedLinkTypeFilter !== 'All') {
      links = links.filter(l => l.relationshipType === selectedLinkTypeFilter);
    }

    // Ensure links only connect valid remaining nodes
    const validNodeIds = new Set(nodes.map(n => n.id));
    links = links.filter(l => {
      const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;
      return validNodeIds.has(srcId) && validNodeIds.has(tgtId);
    });

    return { filteredNodes: nodes, filteredLinks: links };
  }, [selectedNodeTypeFilter, selectedLinkTypeFilter]);

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
    const height = isFullscreen ? window.innerHeight - 180 : 540;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Background canvas grid
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
        .attr('opacity', 0.8);
    });

    // Radial gradient glow filters for active nodes
    const glowFilter = defs.append('filter').attr('id', 'node-glow');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Root zoom container
    const g = svg.append('g').attr('class', 'graph-root');

    // D3 Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 3])
      .on('zoom', event => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Deep clones for D3 simulation to prevent object mutation bugs
    const simNodes: KnowledgeNode[] = filteredNodes.map(d => ({ ...d }));
    const simLinks: KnowledgeLink[] = filteredLinks.map(d => ({ ...d }));

    // Create D3 Force Simulation
    const simulation = d3
      .forceSimulation<KnowledgeNode>(simNodes)
      .force(
        'link',
        d3
          .forceLink<KnowledgeNode, KnowledgeLink>(simLinks)
          .id(d => d.id)
          .distance(linkDistance)
          .strength(0.6)
      )
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d as KnowledgeNode).val + 24));

    // 1. Draw Links
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup
      .selectAll<SVGLineElement, KnowledgeLink>('line')
      .data(simLinks)
      .enter()
      .append('line')
      .attr('stroke', d => d.color || '#F5F5F0')
      .attr('stroke-width', d => Math.max(1.5, d.strength * 3))
      .attr('stroke-opacity', d => {
        if (!selectedNodeId) return 0.5;
        const srcId = typeof d.source === 'object' ? (d.source as any).id : d.source;
        const tgtId = typeof d.target === 'object' ? (d.target as any).id : d.target;
        return srcId === selectedNodeId || tgtId === selectedNodeId ? 0.9 : 0.15;
      })
      .attr('stroke-dasharray', d => (d.relationshipType === 'stewardship_governance' ? '4,4' : undefined))
      .attr('marker-end', d => `url(#arrow-${d.relationshipType})`);

    // 2. Draw Link Labels (Relationship Type on Hover/Active)
    const linkLabelGroup = g.append('g').attr('class', 'link-labels');
    const linkLabel = linkLabelGroup
      .selectAll<SVGTextElement, KnowledgeLink>('text')
      .data(simLinks)
      .enter()
      .append('text')
      .attr('font-size', '8px')
      .attr('font-family', 'monospace')
      .attr('fill', '#C5A059')
      .attr('text-anchor', 'middle')
      .attr('opacity', d => {
        if (!selectedNodeId) return 0;
        const srcId = typeof d.source === 'object' ? (d.source as any).id : d.source;
        const tgtId = typeof d.target === 'object' ? (d.target as any).id : d.target;
        return srcId === selectedNodeId || tgtId === selectedNodeId ? 0.85 : 0;
      })
      .text(d => d.relationshipLabel);

    // 3. Draw Nodes Group
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup
      .selectAll<SVGGElement, KnowledgeNode>('g')
      .data(simNodes)
      .enter()
      .append('g')
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

    // Node Outer Pulsing Aura Ring (For selected or active search)
    node
      .append('circle')
      .attr('r', d => d.val + 6)
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', d => (d.id === selectedNodeId ? 0.9 : 0))
      .attr('class', d => (d.id === selectedNodeId ? 'animate-spin' : ''));

    // Node Main Core Circle
    node
      .append('circle')
      .attr('r', d => d.val)
      .attr('fill', d => {
        if (d.id === selectedNodeId) return d.color;
        if (neighborNodeIds.has(d.id)) return d.color;
        return '#141414';
      })
      .attr('fill-opacity', d => {
        if (d.id === selectedNodeId) return 0.9;
        if (neighborNodeIds.has(d.id)) return 0.7;
        return 0.4;
      })
      .attr('stroke', d => d.color)
      .attr('stroke-width', d => (d.id === selectedNodeId ? 3 : 1.5))
      .attr('filter', d => (d.id === selectedNodeId ? 'url(#node-glow)' : null));

    // Node Central Glyph / Icon Text
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#F5F5F0')
      .attr('font-size', d => (d.val > 22 ? '11px' : '9px'))
      .attr('font-weight', 'bold')
      .attr('font-family', 'sans-serif')
      .attr('pointer-events', 'none')
      .text(d => {
        if (d.type === 'zone') return 'Z';
        if (d.type === 'evidence_flora') return 'FL';
        if (d.type === 'evidence_fauna') return 'FA';
        if (d.type === 'evidence_hydrology') return 'HY';
        if (d.type === 'evidence_soil') return 'SO';
        return 'KM';
      });

    // Node Name Label
    node
      .append('text')
      .attr('y', d => d.val + 14)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-family', 'serif')
      .attr('font-weight', d => (d.id === selectedNodeId ? 'bold' : 'normal'))
      .attr('fill', d => {
        if (d.id === selectedNodeId) return '#C5A059';
        if (neighborNodeIds.has(d.id)) return '#F5F5F0';
        return '#F5F5F0';
      })
      .attr('opacity', d => {
        if (searchQuery && d.label.toLowerCase().includes(searchQuery.toLowerCase())) return 1.0;
        if (!selectedNodeId) return 0.85;
        return neighborNodeIds.has(d.id) ? 1.0 : 0.35;
      })
      .text(d => (d.label.length > 24 ? d.label.substring(0, 22) + '...' : d.label));

    // Node Interactions
    node
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNodeId(d.id);
        audioFeedback.playSubtleClick();
      })
      .on('mouseenter', (event, d) => {
        setHoveredNodeId(d.id);
        audioFeedback.playMicroTick();
      })
      .on('mouseleave', () => {
        setHoveredNodeId(null);
      });

    // Tick Handler
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
    neighborNodeIds,
    searchQuery,
    isFullscreen,
    linkDistance,
    chargeStrength
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
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Controls Ribbon */}
      <div className="px-5 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Node Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
            <span className="text-[10px] uppercase text-[#F5F5F0]/40 flex items-center gap-1 mr-1 shrink-0">
              <Filter className="w-3 h-3 text-[#C5A059]" />
              Filter Nodes:
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

            {/* Node Search */}
            <div className="relative w-48 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40" />
              <input
                type="text"
                placeholder="Find node..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 bg-[#141414] border border-[#F5F5F0]/10 rounded-xs text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/30 font-mono outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Graph Canvas + Inspector Side Panel */}
      <div className="px-5 pb-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* D3 Graph Stage (8 cols) */}
        <div
          ref={containerRef}
          className="lg:col-span-8 bg-[#070707] border border-[#F5F5F0]/10 rounded-sm relative overflow-hidden flex items-center justify-center min-h-[480px]"
        >
          <svg ref={svgRef} className="w-full h-full block cursor-grab active:cursor-grabbing select-none" />

          {/* Canvas Floating Legend */}
          <div className="absolute bottom-3 left-3 p-2.5 bg-black/80 backdrop-blur-md border border-[#F5F5F0]/10 rounded-xs space-y-1.5 text-[10px] font-mono pointer-events-none hidden sm:block">
            <span className="text-[#C5A059] uppercase font-bold block text-[9px]">Node Legend</span>
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
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/80 backdrop-blur-md p-1.5 rounded border border-[#F5F5F0]/10 text-[10px] font-mono">
            <Sliders className="w-3 h-3 text-[#C5A059]" />
            <span className="text-[#F5F5F0]/50">Link Span:</span>
            <input
              type="range"
              min="80"
              max="220"
              value={linkDistance}
              onChange={e => setLinkDistance(parseInt(e.target.value))}
              className="w-16 accent-[#C5A059] bg-[#222] h-1 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Selected Node Inspector Side Card (4 cols) */}
        <div className="lg:col-span-4 bg-[#111111] border border-[#C5A059]/40 rounded-sm p-5 space-y-4 text-left flex flex-col justify-between max-h-[580px] overflow-y-auto">
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
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
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
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
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
                Click any node in the graph above to inspect its upstream biophysical drivers and downstream community impacts.
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
    </div>
  );
};
