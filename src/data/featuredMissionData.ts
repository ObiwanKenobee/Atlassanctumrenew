import { FeaturedMission } from '../types';

export const FEATURED_MISSION_DATA: FeaturedMission = {
  id: 'mission-mathare-river',
  title: 'Mathare River Regeneration',
  location: 'Nairobi, Kenya',
  challenge: 'Restore a degraded urban river corridor while creating local circular economic opportunities and youth ecological stewardship.',
  status: 'Active',
  fundingCurrent: 42500,
  fundingTarget: 120000,
  progressPercentage: 35,
  peopleInvolved: 184,
  impactTarget: '4.2 km river corridor restored',
  impactAchieved: '1.45 km cleared & re-vegetated with native bamboo & vetiver grass',
  isDemoData: true, // Clearly marked per Prompt requirement
  leadStewards: [
    'Mathare Youth Environmental Movement',
    'Nairobi River Commission Technical Working Group',
    'Center for Ecological Urbanism'
  ],
  bioregionalContext: 'Upper Athi Catchment • Urban Informal Settlement Corridor • Highland Sub-tropical',
  milestones: [
    {
      id: 'm1',
      title: 'Mission Created & Baseline Biophysical Mapping',
      date: 'Oct 2024',
      description: 'Conducted drone hydrological mapping, sediment toxicity analysis, and established 14 community water quality sampling stations.',
      status: 'completed',
      evidenceLabel: 'Verified',
      evidenceDetail: 'Hydrological baseline report & GIS telemetry mesh cryptographically anchored on-chain.',
      verificationHash: '0x3a91b402e88a91048f72c10b'
    },
    {
      id: 'm2',
      title: 'Community Assembly Consultation & Guild Mobilization',
      date: 'Dec 2024',
      description: 'Engaged 42 community barazas (assemblies), ratified the Priority Floor social pact, and chartered 3 youth ecological restoration guilds.',
      status: 'completed',
      evidenceLabel: 'Documented',
      evidenceDetail: 'Signed community charter and youth guild enrollment roster across 6 administrative wards.',
      verificationHash: '0x99c4210aef783109a24d8091'
    },
    {
      id: 'm3',
      title: 'Initial Seed Funding & Bio-Filtration Swales',
      date: 'Jan 2025',
      description: 'Deployed $42,500 in non-extractive tranche capital to construct 8 cascading bio-retention swales and decentralized composting kiosks.',
      status: 'in_progress',
      evidenceLabel: 'Verified',
      evidenceDetail: 'Field inspection completed by independent civil engineers. 1.45 km riparian embankment stabilized.',
      verificationHash: '0x718a092c431b990f10c87214'
    },
    {
      id: 'm4',
      title: 'Decentralized Micro-Solid Waste Processing Hubs',
      date: 'Apr 2025',
      description: 'Constructing 2 youth-operated plastic recycling and circular composting facilities to stop river dumping at source.',
      status: 'upcoming',
      evidenceLabel: 'Reported',
      evidenceDetail: 'Architectural blueprints submitted and land-use permissions approved.'
    },
    {
      id: 'm5',
      title: 'Corridor Canopy Succession & Continuous Telemetry',
      date: 'Aug 2025',
      description: 'Full planting of 18,000 indigenous trees (Croton macrostachyus, Syzygium cordatum) with live IoT water turbidity and E. coli sensors.',
      status: 'upcoming',
      evidenceLabel: 'Reported',
      evidenceDetail: 'Seedling nurseries established with 22,000 saplings in active cultivation.'
    },
    {
      id: 'm6',
      title: 'Verified Ecological & Economic Flourishing Verification',
      date: 'Dec 2025',
      description: 'Multi-sensor independent audit of river dissolved oxygen, reduction in cholera incidence, and 120 permanent circular economy livelihoods.',
      status: 'upcoming',
      evidenceLabel: 'Reported',
      evidenceDetail: 'Long-term epidemiological and economic cohort tracking study framework.'
    }
  ],
  transparencyMetrics: {
    fundsReceived: '$42,500',
    fundsDeployed: '$38,200',
    peopleEngaged: 184,
    milestonesCompleted: 2,
    outcomesVerified: 14
  }
};

export const ALL_FEATURED_MISSIONS: FeaturedMission[] = [
  FEATURED_MISSION_DATA,
  {
    id: 'mission-mara-agroforestry',
    title: 'Mara Riparian Buffer & Pastoralist Agroforestry',
    location: 'Narok County, Kenya',
    challenge: 'Stabilize Maasai Mara tributary soil erosion and restore grazing water tables through indigenous silvopasture and participatory fencing.',
    status: 'Active',
    fundingCurrent: 78000,
    fundingTarget: 150000,
    progressPercentage: 52,
    peopleInvolved: 240,
    impactTarget: '1,200 hectares rotational silvopasture protected',
    impactAchieved: '620 hectares fenced with living acacia and rotational grazing covenants active',
    isDemoData: true,
    leadStewards: [
      'Mara River Water Users Association',
      'Maasai Pastoralist Stewardship Trust',
      'East African Rangeland Collaborative'
    ],
    bioregionalContext: 'Mara Basin • Savanna Rangeland & Riparian Ecotone • Semi-Arid Pastoral',
    milestones: [
      {
        id: 'mm1',
        title: 'Pastoral Elders Council Ratification',
        date: 'Nov 2024',
        description: 'Ratified traditional Olosho pasture boundaries and consensus dry-season grazing corridors.',
        status: 'completed',
        evidenceLabel: 'Documented',
        evidenceDetail: 'Recorded oral covenant and GIS coordinates signed by 18 Manyatta elders.',
        verificationHash: '0x88f1b2098ac123901bca09'
      },
      {
        id: 'mm2',
        title: 'Borehole Solarization & Earth Swale Construction',
        date: 'Jan 2025',
        description: 'Installed 4 solar micro-pumps and 12 contour swales to capture wet season run-off.',
        status: 'completed',
        evidenceLabel: 'Verified',
        evidenceDetail: 'PwC East Africa biophysical field audit report and drone orthomosaic imagery.',
        verificationHash: '0x1928374a5b6c7d8e9f0123'
      },
      {
        id: 'mm3',
        title: 'Indigenous Acacia & Balanites Enrichment',
        date: 'Feb 2025',
        description: 'Active planting of 45,000 indigenous drought-hardy fodder trees across 600 hectares.',
        status: 'in_progress',
        evidenceLabel: 'Verified',
        evidenceDetail: 'Sapling survival rate of 91.4% verified via in-situ ground camera traps.',
        verificationHash: '0x99887766554433221100aa'
      },
      {
        id: 'mm4',
        title: 'Soil Organic Carbon Soil Core Verification',
        date: 'Sep 2025',
        description: 'Rigorous laboratory core testing of soil organic matter and fungal-to-bacterial biomass ratio.',
        status: 'upcoming',
        evidenceLabel: 'Reported',
        evidenceDetail: 'Baseline soil cores archived with University of Nairobi Soil Physics Lab.'
      }
    ],
    transparencyMetrics: {
      fundsReceived: '$78,000',
      fundsDeployed: '$64,500',
      peopleEngaged: 240,
      milestonesCompleted: 2,
      outcomesVerified: 19
    }
  },
  {
    id: 'mission-sahel-water-sponge',
    title: 'Sahelian Earth-Sponge Aquifer Recharge',
    location: 'Niamey Region, Niger',
    challenge: 'Combat desertification and reverse severe flash-flood erosion by digging traditional Half-Moon (Zaï) water harvesting pits across degraded crusted soil.',
    status: 'Active',
    fundingCurrent: 95000,
    fundingTarget: 180000,
    progressPercentage: 53,
    peopleInvolved: 410,
    impactTarget: '800 hectares revived for millet, sorghum & agroforestry',
    impactAchieved: '380 hectares dug with 42,000 half-moon catchments actively recharging the shallow aquifer',
    isDemoData: true,
    leadStewards: [
      'Sahelian Water Stewards Union',
      'Institut National de la Recherche Agronomique du Niger',
      'Sahel Desert Green Guild'
    ],
    bioregionalContext: 'Sahel Semi-Arid Ecoregion • Crusted Laterite Soil Plateau',
    milestones: [
      {
        id: 'ms1',
        title: 'Topographical Runoff Modeling & Community Allocation',
        date: 'Sep 2024',
        description: 'Drone LIDAR elevation modeling mapped natural water accumulation pathways across 5 village territories.',
        status: 'completed',
        evidenceLabel: 'Verified',
        evidenceDetail: 'Hydrological runoff model anchored with in-situ soil moisture piezometers.',
        verificationHash: '0x445566778899aabbccddeeff'
      },
      {
        id: 'ms2',
        title: 'Zaï Pit Digging & Organic Manure Application',
        date: 'Dec 2024',
        description: '410 village farmers mobilized to excavate 42,000 micro-catchment basins lined with composted biomass.',
        status: 'completed',
        evidenceLabel: 'Documented',
        evidenceDetail: 'Village council labor receipts and high-resolution satellite NDVI growth verification.',
        verificationHash: '0x223344556677889900aabbcc'
      },
      {
        id: 'ms3',
        title: 'Seed Sowing & Nitrogen-Fixing Tree Integration',
        date: 'Feb 2025',
        description: 'Sowing of Faidherbia albida (Gao tree) and drought-tolerant pearl millet varieties.',
        status: 'in_progress',
        evidenceLabel: 'Verified',
        evidenceDetail: 'Ground team photo log and germination count across sample quadrant grids.',
        verificationHash: '0xffee11223344556677889900'
      },
      {
        id: 'ms4',
        title: 'Village Well Depth & Water Table Elevation Audit',
        date: 'Nov 2025',
        description: 'Continuous hydrostatic pressure sensor monitoring in 16 local open wells to confirm aquifer recharge.',
        status: 'upcoming',
        evidenceLabel: 'Reported',
        evidenceDetail: 'Telemetry sonde mesh deployed in 8 deep community wells.'
      }
    ],
    transparencyMetrics: {
      fundsReceived: '$95,000',
      fundsDeployed: '$82,000',
      peopleEngaged: 410,
      milestonesCompleted: 2,
      outcomesVerified: 28
    }
  },
  {
    id: 'mission-medellin-canopy',
    title: 'Medellín Urban Microclimate Bio-Canopy',
    location: 'Antioquia, Colombia',
    challenge: 'Cool severe urban heat island hotspots and create continuous wildlife bio-corridors across dense hillsides using native multi-tiered botanical canopies.',
    status: 'Active',
    fundingCurrent: 110000,
    fundingTarget: 200000,
    progressPercentage: 55,
    peopleInvolved: 320,
    impactTarget: '14 km urban green corridor cooling temperature by 2.5°C',
    impactAchieved: '7.8 km planted, reducing local street surface temperatures by 1.8°C',
    isDemoData: true,
    leadStewards: [
      'Comuna 13 Ecological Youth Colectivo',
      'Jardín Botánico de Medellín',
      'Secretaría de Medio Ambiente'
    ],
    bioregionalContext: 'Aburrá Valley • Tropical Montane Cloud Basin • Dense Urban Hillsides',
    milestones: [
      {
        id: 'md1',
        title: 'Thermal Thermal-Drone Infrared Urban Heat Mapping',
        date: 'Aug 2024',
        description: 'Mapped asphalt and corrugated iron rooftop temperatures exceeding 48°C across 12 neighborhood zones.',
        status: 'completed',
        evidenceLabel: 'Verified',
        evidenceDetail: 'Infrared radiometer survey data published with open geospatial licenses.',
        verificationHash: '0x1234567890abcdef12345678'
      },
      {
        id: 'md2',
        title: 'Botanical Garden Native Species Selection',
        date: 'Nov 2024',
        description: 'Cultivated 30,000 native ferns, orchids, Guayacán, and Ceiba trees optimized for particulate capture.',
        status: 'completed',
        evidenceLabel: 'Documented',
        evidenceDetail: 'Botanical species roster and nursery delivery manifests.',
        verificationHash: '0xabcdef1234567890abcdef12'
      },
      {
        id: 'md3',
        title: 'Corridor Bio-Wall & Street Canopy Implementation',
        date: 'Jan 2025',
        description: 'Installation of 7.8 km of shaded pedestrian pathways, pocket pollinator gardens, and living vertical green walls.',
        status: 'in_progress',
        evidenceLabel: 'Verified',
        evidenceDetail: 'Temperature sensor network records 1.8°C ambient cooling delta during peak noon hours.',
        verificationHash: '0x5566778899aabbccddeeff00'
      },
      {
        id: 'md4',
        title: 'Biodiversity Bioacoustic & Pollinator Census',
        date: 'Dec 2025',
        description: 'Autonomous bioacoustic audio recorders measuring return of native hummingbirds, bees, and nocturnal tree frogs.',
        status: 'upcoming',
        evidenceLabel: 'Reported',
        evidenceDetail: 'Bioacoustic AI classifier pipeline installed on 10 edge Raspberry Pi units.'
      }
    ],
    transparencyMetrics: {
      fundsReceived: '$110,000',
      fundsDeployed: '$94,000',
      peopleEngaged: 320,
      milestonesCompleted: 2,
      outcomesVerified: 32
    }
  }
];
