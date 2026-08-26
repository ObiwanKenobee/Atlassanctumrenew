/**
 * ATLAS SANCTUM — Platform Content Data Registry
 * Events, Stories, Resources, and Governance Data Stores
 */

import { 
  PlatformEvent, 
  TransformationalStory, 
  ResourceItem, 
  ConstitutionalFloorRule,
  GovernanceProposal,
  TransparencyAuditRecord,
  DecisionRecord 
} from '../types/platformContent';
import { SAMPLE_PROVENANCE } from './mockCivilizationData';

// ============================================================================
// 1. EVENTS REGISTRY
// ============================================================================

export const PLATFORM_EVENTS: PlatformEvent[] = [
  {
    id: 'evt-summit-2026',
    title: 'Global Summit on Bioregional AI & Planetary Systems Dynamics 2026',
    category: 'conference',
    categoryLabel: 'Global Conference',
    format: 'hybrid',
    status: 'upcoming',
    startDate: '2026-10-14T08:30:00Z',
    endDate: '2026-10-16T18:00:00Z',
    timezone: 'UTC+3 (East Africa Time)',
    locationName: 'UNEP Complex & Virtual Metaverse Arena, Nairobi, Kenya',
    bioregion: 'Nairobi River Basin & Great Rift Corridor',
    country: 'Kenya',
    summary: 'The premiere gathering of 1,200+ planetary scientists, sovereign ministers, AI researchers, and indigenous elders defining the next century of regenerative civilization intelligence.',
    description: 'A three-day high-stakes hybrid convention featuring keynotes from multilateral leadership, live deployment showcases of Atlas Sanctum autonomous agents, open-hardware microgrid demonstrations, and multi-capital sovereign grant allocations.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    organizers: ['UNDP Climate Hub', 'Strathmore SERC', 'Google Earth Engine', 'Atlas Sanctum Foundation'],
    speakers: [
      {
        id: 'spk-1',
        name: 'Dr. Amina Kaloki',
        role: 'Chief Scientist, Planetary Modeling',
        organization: 'UNEP Global Environmental Observatories',
        topic: 'Satellite In-Situ Epistemic Provenance at Scale'
      },
      {
        id: 'spk-2',
        name: 'Prof. Marcus Ochieng',
        role: 'Director of Solar Physics & Grid Architecture',
        organization: 'Strathmore Energy Research Centre',
        topic: 'Non-Linear Feedback Loops in Decentralized Microgrid Commons'
      },
      {
        id: 'spk-3',
        name: 'Elena Rostova',
        role: 'Lead Architect, Priority Floor Engine',
        organization: 'Atlas Sanctum AI Research',
        topic: 'Mathematical Boundaries: Hardcoding Ethics into Machine Intelligence'
      }
    ],
    agenda: [
      {
        id: 'ag-1',
        timeSlot: '09:00 - 10:30 UTC+3',
        title: 'Opening Plenary: From Predictive Extractive Models to Regenerative Planetary Intelligence',
        speaker: 'Dr. Amina Kaloki',
        description: 'Keynote address on closing the simulation-to-reality gap in high-vulnerability catchments.',
        track: 'Planetary Science'
      },
      {
        id: 'ag-2',
        timeSlot: '11:00 - 12:45 UTC+3',
        title: 'Euler Method vs. Agent DAG: Live Multi-Million Dollar Energy Intervention Simulation',
        speaker: 'Elena Rostova & Strathmore Team',
        description: 'Interactive execution of counterfactual energy infrastructure scenarios on the live studio view.',
        track: 'Systems Dynamics'
      },
      {
        id: 'ag-3',
        timeSlot: '14:00 - 17:00 UTC+3',
        title: 'Sovereign Capital Allocators Roundtable ($380M RVE Pool Tranche Releases)',
        description: 'Multi-stakeholder review of active bioregional grant applications.',
        track: 'Governance & Capital'
      }
    ],
    capacity: 1500,
    registeredCount: 1142,
    isRsvpOpen: true,
    livestreamUrl: 'https://ais-dev-qaor2olchy3s5ihauswgim-695584616156.europe-west2.run.app/live',
    fieldLabId: 'lab-nairobi-01',
    telemetryStreamId: 'stream-mesh-nairobi-basin',
    tags: ['Systems Dynamics', 'Agentic AI', 'Sovereign Capital', 'Planetary Boundaries'],
    moralPrincipleAnchor: 'Axiom VII: Intergenerational Stewardship',
    provenance: {
      ...SAMPLE_PROVENANCE,
      source: 'Global Event Registry & UNEP Conference Secretariat',
      verifier: 'Sanctum Event Protocol Attestor'
    }
  },
  {
    id: 'evt-webinar-euler',
    title: 'Differential Euler Integration & Stock-Flow Modeling Masterclass',
    category: 'webinar',
    categoryLabel: 'Technical Webinar',
    format: 'virtual',
    status: 'upcoming',
    startDate: '2026-09-08T14:00:00Z',
    endDate: '2026-09-08T16:00:00Z',
    timezone: 'UTC (Universal Coordinated Time)',
    locationName: 'Atlas Sanctum Academy Virtual Auditorium',
    bioregion: 'Global Cyberspace',
    country: 'Global',
    summary: 'A deep-dive technical masterclass on setting up non-linear feedback loops, delay queues, and Donella Meadows leverage points using the Atlas Systems Dynamics Engine.',
    description: 'Learn how to construct custom stock and flow models, derive differential rate formulas, model stochastic climate disturbances, and connect live telemetry hooks into Recharts visualizers.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    organizers: ['Atlas Systems Engineering Guild', 'Strathmore University SERC'],
    speakers: [
      {
        id: 'spk-4',
        name: 'David Kimani',
        role: 'Systems Modeler & Applied Mathematician',
        organization: 'Atlas Sanctum Research',
        topic: 'Numerical Stability & Forward Euler Bounds'
      }
    ],
    agenda: [
      {
        id: 'ag-4',
        timeSlot: '14:00 - 14:40 UTC',
        title: 'Mathematical Foundations: Stocks, Flows, and Meadows 12 Levers',
        speaker: 'David Kimani',
        description: 'Formulating differential equations for complex multi-capital social-ecological systems.'
      },
      {
        id: 'ag-5',
        timeSlot: '14:40 - 15:30 UTC',
        title: 'Live Code: Building a Regional Energy Microgrid Simulator in TypeScript',
        speaker: 'David Kimani',
        description: 'Step-by-step implementation of parameter sliders and sensitivity analysis.'
      },
      {
        id: 'ag-6',
        timeSlot: '15:30 - 16:00 UTC',
        title: 'Q&A and Community Model Reviews',
        description: 'Interactive critique and validation of audience-submitted stock models.'
      }
    ],
    capacity: 3000,
    registeredCount: 2480,
    isRsvpOpen: true,
    livestreamUrl: 'https://ais-dev-qaor2olchy3s5ihauswgim-695584616156.europe-west2.run.app/webinars/euler-masterclass',
    tags: ['Systems Dynamics', 'TypeScript', 'Numerical Simulation', 'Open Science'],
    moralPrincipleAnchor: 'Axiom IX: Epistemic Truth & No Idols',
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'evt-field-rift',
    title: 'In-Situ LoRaWAN Soil & Hydro Sensor Mesh Field Deployment',
    category: 'field_activity',
    categoryLabel: 'Field Activity & Deployment',
    format: 'in_person',
    status: 'upcoming',
    startDate: '2026-09-22T06:00:00Z',
    endDate: '2026-09-24T17:00:00Z',
    timezone: 'UTC+3 (East Africa Time)',
    locationName: 'Lake Nakuru Catchment & Mau Forest Riparian Buffer, Kenya',
    bioregion: 'Great Rift Valley Catchment',
    country: 'Kenya',
    summary: 'A 3-day ruggedized field deployment installing 48 water table piezometers, soil carbon sensors, and LoRaWAN gateways in collaboration with community river scouts.',
    description: 'Participants will work alongside indigenous elders and youth technicians to install solar-powered telemetry nodes, calibrate optical water turbidity sensors, and bind cryptographic physical QR verification plaques to each asset.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    organizers: ['Kenya Red Cross', 'UNEP Biosphere Mesh', 'Mau Forest Water Wardens'],
    speakers: [
      {
        id: 'spk-5',
        name: 'Elder Kiprono Chemutai',
        role: 'Chairman of Council of Elders',
        organization: 'Mau Catchment Custodians',
        topic: 'Indigenous Hydrological Knowledge & Sacred Springs'
      },
      {
        id: 'spk-6',
        name: 'Sarah Ndung\'u',
        role: 'Lead IoT Field Engineer',
        organization: 'Kenya Red Cross Society',
        topic: 'Deploying Off-Grid LoRaWAN Gateways in Flood Corridors'
      }
    ],
    agenda: [
      {
        id: 'ag-7',
        timeSlot: 'Day 1 (08:00 - 17:00)',
        title: 'Community FPIC Assembly & Sensor Site Calibration',
        description: 'Conducting Free, Prior, and Informed Consent verification with village elders.'
      },
      {
        id: 'ag-8',
        timeSlot: 'Day 2 (07:00 - 18:00)',
        title: 'Hardware Installation & LoRaWAN Gateway Mesh Binding',
        description: 'Drilling piezometer wells and establishing long-range mesh communications.'
      },
      {
        id: 'ag-9',
        timeSlot: 'Day 3 (09:00 - 15:00)',
        title: 'Telemetry Stream Verification & Cryptographic QR Placard Sealing',
        description: 'Verifying sub-second data ingestion into the Atlas Observatory.'
      }
    ],
    capacity: 65,
    registeredCount: 65,
    isRsvpOpen: false, // Capacity reached
    fieldLabId: 'lab-nakuru-04',
    telemetryStreamId: 'stream-rift-piezometers',
    tags: ['Field Deployment', 'IoT Hardware', 'Community Sovereignty', 'Water Mesh'],
    moralPrincipleAnchor: 'Axiom III: Universal Compassion & Defense of Commons',
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'evt-workshop-floors',
    title: 'Constitutional Priority Floors & Autonomous Moral Arbiter Workshop',
    category: 'workshop',
    categoryLabel: 'Governance Workshop',
    format: 'hybrid',
    status: 'upcoming',
    startDate: '2026-10-02T13:00:00Z',
    endDate: '2026-10-02T17:30:00Z',
    timezone: 'UTC+2 (Central European Time)',
    locationName: 'Palais des Nations, Geneva & Virtual Deliberation Chamber',
    bioregion: 'Geneva Lake Basin / Global',
    country: 'Switzerland',
    summary: 'A hands-on policy and engineering workshop teaching developers, legal scholars, and ministers how to write enforceable, non-bypassable constitutional priority floor rules.',
    description: 'Learn how to codify minimum living wages, ecological carrying capacities, and zero-usury loan requirements into algorithmic verification circuits that prevent extractive capital capture.',
    featuredImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    organizers: ['UN-Habitat', 'World Resources Institute (WRI)', 'Atlas Sanctum Legal Guild'],
    speakers: [
      {
        id: 'spk-7',
        name: 'Judge Tariq Al-Mansoor',
        role: 'Senior Jurisprudence Fellow',
        organization: 'International Institute for Ethical Technology',
        topic: 'Constitutional Law as Programmatic Gatekeeping'
      }
    ],
    agenda: [
      {
        id: 'ag-10',
        timeSlot: '13:00 - 14:15 UTC+2',
        title: 'The Anatomy of a Priority Floor: Moving Beyond Advisory Guidelines to Hard Boundaries',
        speaker: 'Judge Tariq Al-Mansoor',
        description: 'Why voluntary corporate ESG pledges fail and how algorithmic hard stops succeed.'
      },
      {
        id: 'ag-11',
        timeSlot: '14:30 - 16:30 UTC+2',
        title: 'Sandbox Hackathon: Writing Floor Rules in Atlas Governance SDK',
        description: 'Teams draft and simulate real-world capital proposal rejections in the Moral Simulator.'
      }
    ],
    capacity: 400,
    registeredCount: 312,
    isRsvpOpen: true,
    tags: ['Governance', 'Constitutional AI', 'Priority Floors', 'Legal Tech'],
    moralPrincipleAnchor: 'Axiom VIII: Righteousness & Verifiable Integrity',
    provenance: SAMPLE_PROVENANCE
  }
];

// ============================================================================
// 2. STORIES REGISTRY
// ============================================================================

export const TRANSFORMATIONAL_STORIES: TransformationalStory[] = [
  {
    id: 'story-baringo-recharge',
    title: 'From Parched Clay to Food Forests: The Regeneration of the Baringo Basin',
    subtitle: 'How 1,400 pastoralist families transformed an arid drought corridor into a perennial agroforestry commons using satellite telemetry and community water swales.',
    category: 'transformational_story',
    categoryLabel: 'Transformational Story',
    authorName: 'Joyce Chebet & Dr. Daniel Mwangi',
    authorRole: 'Lead Community Steward & Soil Hydrologist',
    authorAffiliation: 'Baringo Watershed Commons Trust',
    publishDate: '2026-07-18',
    readingTimeMinutes: 7,
    bioregion: 'Lake Baringo Arid Catchment',
    locationCoordinates: [0.628, 35.975],
    featuredImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    summary: 'Four years ago, Lake Baringo’s peripheral pastures were eroding into barren ravines. Through the deployment of passive rainwater swales, biochar soil conditioning, and satellite-guided tree canopies, the community restored 4,200 hectares of topsoil while quintupling household dietary diversity.',
    leadParagraph: 'For twenty years, the elders of Marigat watched the dry season stretch longer, until the soil turned to cracked clay that washed away with the first violent deluge. Capital funds would arrive with temporary food sacks, leaving the land as brittle as before. In 2023, the community decided to change the fundamental rules of engagement.',
    fullBodyMarkdown: `
### Breaking the Extractive Cycle

Rather than accepting debt-heavy foreign agricultural packages that required synthetic fertilizers and patented seeds, the Baringo Watershed Commons Trust formed a sovereign land covenant. Using the **Atlas Bioregional Twin**, they simulated counterfactual hydrological interventions over a 15-year horizon.

The simulation revealed a high-leverage intervention: **contour earth swales paired with indigenous acacia tortilis and biochar trenches** could capture 78% of seasonal runoff before it evaporated or eroded the topsoil.

### Deployment & Empirical Verification

Over 36 months, the community excavated 42 kilometers of hand-dug, rock-lined swales. Every 500 meters, a solar-powered soil moisture piezometer was installed, broadcasting encrypted telemetry to the **Atlas Reality Engine**.

The results exceeded the conservative baseline models:

1. **Groundwater Table Recharge:** The static water level in shallow community wells rose from 38 meters below surface to 14 meters.
2. **Soil Organic Carbon (SOC):** In-situ sensor nodes verified an increase in topsoil SOC from 0.42% to 2.15%, locking down 18,400 tonnes of atmospheric carbon.
3. **Crop Yield Resilience:** During the severe 2025 drought, neighboring unmanaged lands suffered 85% crop failure; the Marigat community swale basin harvested 92% of expected grain and legume yield.

### Direct Community Governance

Every dollar of catalytic capital was unlocked programmatically via **Atlas Smart Milestone Escrows**. When satellite Earth Engine imagery verified a 25% increase in NDVI vegetative canopy, smart contracts automatically released the next phase of funds directly to local women’s seed-saving circles via M-Pesa.
    `,
    keyOutcomes: [
      '4,200 hectares of arid savannah restored to productive silvopasture',
      'Groundwater table elevated by 24 meters across 18 monitored wells',
      'Zero debt incurred; 100% community equity retention in agricultural commons',
      '1,400 families achieve food sovereignty with zero emergency aid needed in 2025'
    ],
    metricDeltas: [
      {
        metricName: 'Static Groundwater Depth',
        beforeValue: '38.2 m',
        afterValue: '14.1 m',
        unit: 'meters (shallower is better)',
        isPositive: true,
        deltaDescription: '+63% aquifer recharge'
      },
      {
        metricName: 'Soil Organic Carbon (SOC)',
        beforeValue: '0.42%',
        afterValue: '2.15%',
        unit: 'percent carbon in topsoil',
        isPositive: true,
        deltaDescription: '5.1x increase in biological fertility'
      },
      {
        metricName: 'Household Annual Agricultural Income',
        beforeValue: '$340 / yr',
        afterValue: '$1,860 / yr',
        unit: 'USD per household',
        isPositive: true,
        deltaDescription: '5.4x non-extractive income expansion'
      }
    ],
    communityVoices: [
      {
        quote: "We spent generations waiting for rain that never arrived, or drowned in mud when it did. When we built the swales and put the sensors in the dirt, we proved to ourselves and the world that the land can heal if we respect its natural boundaries.",
        authorName: "Mama Joyce Chebet",
        authorTitle: "Chairwoman, Marigat Seed Custodians",
        community: "Marigat, Baringo Catchment"
      },
      {
        quote: "The satellite doesn't lie, but more importantly, our granaries don't lie. Our children eat three meals a day from land that people called a desert.",
        authorName: "Kipkorir Toroitich",
        authorTitle: "Youth Agroforestry Apprentice",
        community: "Baringo Commons"
      }
    ],
    audioNarrationUrl: 'https://ais-dev-qaor2olchy3s5ihauswgim-695584616156.europe-west2.run.app/audio/stories/baringo-recharge.mp3',
    verifiedEvidenceRoot: '0x8f2d9c4b1e5a7038194e6281749d01ba4726e95c',
    tags: ['Water Resilience', 'Agroforestry', 'Soil Carbon', 'Community Sovereignty', 'Baringo'],
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'story-mathare-microgrid',
    title: 'Powering the Valley: Mathare Community-Owned LifeHouse Microgrids',
    subtitle: 'Replacing toxic diesel fumes and exploitative middleman tariffs with a decentralized rooftop solar-storage mesh across 450 informal settlement households.',
    category: 'field_report',
    categoryLabel: 'Field Deployment Report',
    authorName: 'John Mwangi & Grace Wanjiru',
    authorRole: 'Lead Electrical Technician & Youth Guild Organizer',
    authorAffiliation: 'Mathare LifeHouse Microgrid Guild',
    publishDate: '2026-08-04',
    readingTimeMinutes: 5,
    bioregion: 'Nairobi River Riparian Corridor',
    locationCoordinates: [-1.261, 36.858],
    featuredImageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    summary: 'In Mathare Valley, informal settlement families paid up to $0.45 per kWh to unregulated diesel generator cartels. By deploying modular LifeHouse rooftop bifacial solar panels and LFP battery hubs governed by M-Pesa micro-tariffs, electricity costs plummeted 72% while reliability reached 99.8%.',
    leadParagraph: 'For decades, electricity in informal settlements was a hazardous commodity: illegal hookups overhead that sparked destructive fires, and predatory tariffs that drained a third of a family’s meager income. When the youth guild teamed up with the Atlas LifeHouse initiative, they decided to construct a permanent, sovereign solution.',
    fullBodyMarkdown: `
### Modular Engineering Meets Community Ownership

The Mathare installation utilized standardized **LifeHouse DC microgrid pods**. Each pod connects 30 households to a central 15 kW rooftop array paired with a 38 kWh Lithium Iron Phosphate (LFP) battery bank.

Unlike traditional top-down electrification schemes where outside contractors leave no maintenance skills behind, the **Mathare Youth Guild** completed a 6-week technical certification through the Atlas Academy. Thirty local youths now manage the continuous maintenance, battery health monitoring, and billing administration.

### Financial Sovereignty through M-Pesa Integration

By integrating with Safaricom’s open payment API, residents pay micropayments as low as 10 KES ($0.08) per day directly to a community-owned smart contract. 

- **60% of revenues** cover battery replacement sinking funds and equipment depreciation.
- **25% of revenues** pay living wages to the certified maintenance technicians.
- **15% of revenues** feed a community emergency medical and education reserve.
    `,
    keyOutcomes: [
      '450 households and 42 micro-businesses connected to 24/7 clean power',
      '72% reduction in electricity expenditures per household',
      'Zero electrical fires reported across the pilot zone over 18 months',
      '30 youth certified as accredited microgrid maintenance engineers'
    ],
    metricDeltas: [
      {
        metricName: 'Cost per Kilowatt-Hour (kWh)',
        beforeValue: '$0.45 / kWh',
        afterValue: '$0.12 / kWh',
        unit: 'USD per kWh',
        isPositive: true,
        deltaDescription: '73% reduction in energy burden'
      },
      {
        metricName: 'Grid Uptime & Reliability',
        beforeValue: '61.4%',
        afterValue: '99.8%',
        unit: 'uptime percentage',
        isPositive: true,
        deltaDescription: 'Near-perfect uninterruptible power'
      },
      {
        metricName: 'Carbon Dioxide (CO2) Displaced',
        beforeValue: '0 tonnes',
        afterValue: '184 tonnes / yr',
        unit: 'tCO2e abated',
        isPositive: true,
        deltaDescription: 'Replaced 42 dirty diesel generators'
      }
    ],
    communityVoices: [
      {
        quote: "Before this solar mesh, my sewing machines would stop three times a day during blackouts. Now my shop runs without a blink, and I pay half of what I used to pay the diesel cartel.",
        authorName: "Grace Wanjiru",
        authorTitle: "Tailor & Business Owner",
        community: "Mathare 4A Village"
      }
    ],
    audioNarrationUrl: 'https://ais-dev-qaor2olchy3s5ihauswgim-695584616156.europe-west2.run.app/audio/stories/mathare-mesh.mp3',
    verifiedEvidenceRoot: '0x3c7a19e84b2049d5817293a1059fba7189c4d21e',
    tags: ['LifeHouse', 'Clean Energy', 'Informal Settlements', 'Microgrids', 'Mathare'],
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'story-victoria-fishermen',
    title: 'The Fisherman\'s Ledger: Defending Lake Victoria Catchments',
    subtitle: 'How an inter-village elder council linked aquatic IoT sensor buoys with satellite radar to end illegal destructive sand dredging.',
    category: 'human_narrative',
    categoryLabel: 'Human Narrative',
    authorName: 'Otieno Odhiambo',
    authorRole: 'Secretary, Lake Victoria Fishermen\'s Cooperative',
    authorAffiliation: 'Winam Gulf Aquatic Stewardship Alliance',
    publishDate: '2026-06-29',
    readingTimeMinutes: 6,
    bioregion: 'Lake Victoria Basin & Winam Gulf',
    locationCoordinates: [-0.102, 34.752],
    featuredImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    summary: 'Commercial sand dredgers were destroying tilapia breeding grounds in Lake Victoria under the cover of night. By anchoring low-cost acoustic hydrophones and optical turbidity buoys, the artisanal fishing community built an unforgeable evidentiary ledger that forced regulatory enforcement.',
    leadParagraph: 'The fish had been vanishing for five years. When the artisanal canoes returned at dawn, their nets were empty of tilapia, clogged only with gray river silt stirred up by industrial dredging barges operating illegally in protected estuaries.',
    fullBodyMarkdown: `
### Turning Water Turbidity into Legal Proof

The fishermen lacked the political capital to challenge multi-million dollar dredging operations with mere eyewitness claims. In partnership with the **UNEP Watershed Initiative** and Atlas Sanctum, they deployed 12 solar hydrophone buoys across the Winam Gulf spawning beds.

The buoys recorded underwater acoustic signatures and continuous turbidity spikes, streaming cryptographic telemetry to the **Atlas Evidence Ledger**.

### Judicial Victory & Habitat Recovery

When the provincial environmental tribunal convened, the fishermen presented 9 months of continuous, timestamped satellite radar data correlated with underwater acoustic telemetry. 

The tribunal issued an immediate permanent injunction against the dredging fleet and mandated a 10-year ecological recovery zone managed exclusively by the community trust.
    `,
    keyOutcomes: [
      '14 protected tilapia spawning sanctuaries legally established',
      '92% reduction in illegal nighttime dredging activity',
      'Tilapia catch volumes rebounded +140% over 24 months',
      '2,800 fishermen regain stable, multi-generational livelihoods'
    ],
    metricDeltas: [
      {
        metricName: 'Spawning Bed Water Turbidity',
        beforeValue: '420 NTU',
        afterValue: '38 NTU',
        unit: 'Nephelometric Turbidity Units (lower is cleaner)',
        isPositive: true,
        deltaDescription: '91% increase in water clarity'
      },
      {
        metricName: 'Average Daily Tilapia Catch',
        beforeValue: '4.2 kg / boat',
        afterValue: '14.8 kg / boat',
        unit: 'kg per fishing vessel',
        isPositive: true,
        deltaDescription: '3.5x recovery in fishery productivity'
      }
    ],
    communityVoices: [
      {
        quote: "We didn't need guns to stop the dredgers; we needed the truth. When the judges saw the live satellite maps and heard the underwater recordings, there was nowhere for the illegal operators to hide.",
        authorName: "Otieno Odhiambo",
        authorTitle: "Master Fisherman & Elder",
        community: "Winam Gulf, Kisumu"
      }
    ],
    audioNarrationUrl: 'https://ais-dev-qaor2olchy3s5ihauswgim-695584616156.europe-west2.run.app/audio/stories/victoria-fishermen.mp3',
    verifiedEvidenceRoot: '0x1a9e482f0c7d561938b29401726a8491c3d8205f',
    tags: ['Aquatic Commons', 'Fisheries', 'Evidence Ledger', 'Lake Victoria', 'Water Protection'],
    provenance: SAMPLE_PROVENANCE
  }
];

// ============================================================================
// 3. RESOURCES REGISTRY
// ============================================================================

export const PLATFORM_RESOURCES: ResourceItem[] = [
  {
    id: 'res-sd-toolkit',
    title: 'Bioregional Systems Dynamics Euler Modeling Toolkit v2.4',
    category: 'toolkit',
    categoryLabel: 'Simulation Toolkit & Library',
    version: '2.4.0',
    lastUpdated: '2026-08-15',
    fileFormat: 'OPEN_API',
    fileSizeBytes: 4200000,
    license: 'Apache-2.0',
    summary: 'A complete TypeScript and Python library for compiling stocks, flows, dynamic differential rate equations, and Donella Meadows leverage ranking into high-performance web visualizers.',
    description: 'Includes pre-built solvers for Forward Euler, Runge-Kutta 4 (RK4), non-linear delay equations, stochastic climate perturbation injectors, and Recharts graph adapters.',
    targetAudience: ['Systems Modelers', 'Software Engineers', 'Ecological Economists', 'Energy Planners'],
    prerequisites: ['TypeScript 5+', 'Node.js 18+', 'Basic Calculus & Differential Equations'],
    downloadUrl: 'https://ais-dev-qaor2olchy3s5ihauswgim-695584616156.europe-west2.run.app/downloads/atlas-sd-engine-v2.4.zip',
    externalRepoUrl: 'https://github.com/atlas-sanctum/systems-dynamics-engine',
    apiDocsUrl: '/developers',
    downloadCount: 8420,
    verifiedSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    tags: ['Systems Dynamics', 'Euler Method', 'TypeScript', 'Simulation Engine', 'Recharts'],
    curriculumModuleCode: 'SYS-204',
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'res-priority-floors-api',
    title: 'Universal Moral Priority Floors API Specification & Governance SDK',
    category: 'api',
    categoryLabel: 'Developer API & SDK',
    version: '3.1.2',
    lastUpdated: '2026-08-20',
    fileFormat: 'OPEN_API',
    fileSizeBytes: 1850000,
    license: 'MIT',
    summary: 'Standardized OpenAPI 3.1 schema and TypeScript SDK for testing capital grant proposals against mathematical non-negotiable ethical boundaries.',
    description: 'Enforce minimum wage floors, water drawdown caps, zero-usury loan requirements, and Free Prior Informed Consent (FPIC) cryptographic attestations directly in CI/CD and deployment pipelines.',
    targetAudience: ['DeFi Developers', 'Smart Contract Auditors', 'Sovereign Capital Managers', 'Legal Technologists'],
    prerequisites: ['REST APIs', 'JSON Schema', 'Basic Understanding of Constitutional Axioms'],
    downloadUrl: 'https://ais-dev-qaor2olchy3s5ihauswgim-695584616156.europe-west2.run.app/downloads/atlas-governance-sdk-v3.1.zip',
    externalRepoUrl: 'https://github.com/atlas-sanctum/governance-sdk',
    apiDocsUrl: '/developers',
    downloadCount: 12150,
    verifiedSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    tags: ['Priority Floors', 'OpenAPI', 'Constitutional AI', 'Smart Contracts', 'Governance'],
    curriculumModuleCode: 'ETH-305',
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'res-lifehouse-cad',
    title: 'LifeHouse Modular Bio-Composite Housing CAD Schemas & Bill of Materials',
    category: 'template',
    categoryLabel: 'Open Hardware Blueprint',
    version: '1.8.0',
    lastUpdated: '2026-07-22',
    fileFormat: 'CAD_ZIP',
    fileSizeBytes: 48000000,
    license: 'Open-Hardware-v2',
    summary: 'Complete engineering schematics, structural stress analyses, wiring diagrams, and materials list for assembling 45 sqm carbon-negative modular homes from local bamboo and earth composites.',
    description: 'Includes STEP/DWG files for CNC milling of structural joinery, passive thermal airflow calculations, rainwater bio-sand filter integration, and 3 kW rooftop solar mounting specs.',
    targetAudience: ['Architects', 'Civil Engineers', 'Community Builders', 'Disaster Relief Agencies'],
    prerequisites: ['AutoCAD / FreeCAD / Fusion 360', 'Basic Carpentry & Structural Principles'],
    downloadUrl: 'https://ais-dev-qaor2olchy3s5ihauswgim-695584616156.europe-west2.run.app/downloads/lifehouse-modular-v1.8-cad.zip',
    downloadCount: 5690,
    verifiedSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    tags: ['LifeHouse', 'Open Hardware', 'CAD', 'Regenerative Housing', 'Bio-Composites'],
    curriculumModuleCode: 'REG-101',
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'res-fpic-protocol-doc',
    title: 'FPIC (Free, Prior & Informed Consent) Cryptographic Attestation Protocol',
    category: 'document',
    categoryLabel: 'Policy Covenant & Standard',
    version: '2.0.0',
    lastUpdated: '2026-06-10',
    fileFormat: 'PDF',
    fileSizeBytes: 3100000,
    license: 'CC-BY-4.0',
    summary: 'A standardized legal and technical framework for collecting, verifying, and anchoring indigenous and community consent prior to initiating any physical infrastructure deployment.',
    description: 'Includes bilingual consent questionnaire templates, multi-generational quorum formulas, audio consent recording hashing protocols, and elder council veto integration clauses.',
    targetAudience: ['Indigenous Councils', 'Human Rights Observers', 'ESG Auditors', 'Project Developers'],
    downloadUrl: 'https://ais-dev-qaor2olchy3s5ihauswgim-695584616156.europe-west2.run.app/downloads/fpic-attestation-standard-v2.pdf',
    downloadCount: 9340,
    verifiedSha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    tags: ['FPIC', 'Indigenous Rights', 'Legal Standard', 'Human Rights', 'Sovereignty'],
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'res-agroforestry-curricula',
    title: 'Regenerative Civilization Engineering Curricula & Field Lab Syllabi (REG-101 to SYS-305)',
    category: 'educational_material',
    categoryLabel: 'Educational Courseware',
    version: '4.0.0',
    lastUpdated: '2026-08-01',
    fileFormat: 'MD_PACKAGE',
    fileSizeBytes: 8900000,
    license: 'Sanctum-Commons',
    summary: 'Complete 14-week university syllabus, lecture slides, interactive problem sets, and field laboratory experiments covering the 7 forms of capital, moral philosophy, and IoT sensing.',
    description: 'Designed for deployment in technical colleges, universities, and community field academies. Includes automated grading rubrics and ethical case study dilemmas.',
    targetAudience: ['University Lecturers', 'Community Educators', 'Student Stewards', 'Field Apprentices'],
    downloadUrl: 'https://ais-dev-qaor2olchy3s5ihauswgim-695584616156.europe-west2.run.app/downloads/atlas-academy-curricula-complete.zip',
    downloadCount: 16800,
    verifiedSha256: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    tags: ['Academy', 'Curricula', 'Syllabus', 'Open Education', 'Systems Engineering'],
    curriculumModuleCode: 'REG-101',
    provenance: SAMPLE_PROVENANCE
  }
];

// ============================================================================
// 4. GOVERNANCE REGISTRY (Principles, Policies, Transparency, Decision-Making)
// ============================================================================

export const CONSTITUTIONAL_FLOOR_RULES: ConstitutionalFloorRule[] = [
  {
    id: 'floor-labor-wage',
    name: 'Minimum Living Dignity Wage Floor',
    domain: 'labor',
    thresholdDescription: 'All labor deployed under Atlas Sanctum missions must be paid at or above 140% of the regional local living wage basket, adjusted for inflation.',
    mathematicalBound: 'Wage(worker, bioregion) >= 1.40 * LivingWageBasket(bioregion)',
    currentObservedValue: '$4.85 / hr vs. $2.90 / hr minimum benchmark',
    status: 'compliant',
    auditCadence: 'Continuous M-Pesa & Mobile Wallet Settlement Auditing',
    violatorsVetoedCount: 14,
    axiomAnchor: 'Axiom II: Universal Human Dignity & Right to Fair Flourishing'
  },
  {
    id: 'floor-water-drawdown',
    name: 'Aquifer Drawdown & Riparian Reserve Floor',
    domain: 'ecological',
    thresholdDescription: 'Cumulative agricultural or industrial water extraction must never exceed 35% of the verified annual natural recharge rate for any given catchment.',
    mathematicalBound: 'Sum(Drawdown_t) <= 0.35 * AnnualRecharge_t',
    currentObservedValue: '21.4% average across all 18 active catchments',
    status: 'compliant',
    auditCadence: 'Hourly Piezometer & Flux Tower Telemetry Ingestion',
    violatorsVetoedCount: 8,
    axiomAnchor: 'Axiom I: Sanctity of the Biosphere & Carrying Capacity'
  },
  {
    id: 'floor-zero-usury',
    name: 'Anti-Usury & Non-Extractive Capital Floor',
    domain: 'capital',
    thresholdDescription: 'Zero compounding interest or debt-trap collateralization permitted. Capital must enter strictly as revenue-share, equity commons, or catalytic non-repayable grants.',
    mathematicalBound: 'InterestRate == 0% && ExtractivePenalty == 0',
    currentObservedValue: '100% of $380M RVE Capital pool non-extractive',
    status: 'compliant',
    auditCadence: 'Smart Contract Bytecode & Escrow Logic Verification',
    violatorsVetoedCount: 32,
    axiomAnchor: 'Axiom V: Equitable Economic Exchange & Jubilee Rebalancing'
  },
  {
    id: 'floor-sabbath-rest',
    name: 'Ecological & Human Periodic Rest Floor',
    domain: 'sovereignty',
    thresholdDescription: 'Mandatory 1-day in 7 human labor rest and seasonal agricultural fallow rotations enforced across all work order schedules.',
    mathematicalBound: 'RestRatio >= 1/7 && FallowSeasonFrequency >= 1/7yr',
    currentObservedValue: '100% automated schedule compliance',
    status: 'compliant',
    auditCadence: 'Bioregional Work Order Scheduling Engine Audit',
    violatorsVetoedCount: 5,
    axiomAnchor: 'Axiom VII: Intergenerational Stewardship & Sabbath Renewal'
  },
  {
    id: 'floor-fpic-consent',
    name: 'FPIC Sovereign Community Consent Floor',
    domain: 'sovereignty',
    thresholdDescription: 'No physical hardware, ground sensor, or mini-grid may be constructed without a verified, cryptographic 75%+ elder council and community signoff.',
    mathematicalBound: 'FPIC_Quorum >= 75% && ElderVetoCount == 0',
    currentObservedValue: '48 of 48 active deployment sites with verified FPIC roots',
    status: 'compliant',
    auditCadence: 'Pre-Deployment Multi-Signature Cryptographic Proof Verification',
    violatorsVetoedCount: 19,
    axiomAnchor: 'Axiom X: Transparent Sovereign Knowledge Commons'
  }
];

export const GOVERNANCE_PROPOSALS: GovernanceProposal[] = [
  {
    id: 'AGP-043',
    title: 'Allocate $6.2M Catalytic RVE Capital to Lake Nakuru Aquifer Restoration',
    category: 'Capital Allocation',
    proposer: 'Mau Catchment Custodians Trust',
    proposerRole: 'Bioregional Lead Council',
    submittedDate: '2026-08-18',
    votingDeadline: '2026-09-01',
    status: 'active_voting',
    quorumPercentage: 86.4,
    currentSupportPercentage: 96.2,
    totalVotesCast: 4210,
    summary: 'Deploying 120,000 native riparian canopy saplings, 38 solar-powered water purifiers, and 24 piezometers along the Njoro and Makalia tributary rivers.',
    impactAssessmentSummary: 'Projected to reduce sediment runoff into Lake Nakuru by 48% over 3 years and provide 18,000 households with direct clean water access.',
    capitalRequestedUsd: 6200000,
    bioregion: 'Lake Nakuru Catchment',
    fpicConsentVerified: true,
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'AGP-042',
    title: 'Incorporate LoRaWAN Soil Microbial Nitrogen Standard into SDK v3.2',
    category: 'Schema Upgrade',
    proposer: 'Prof. Marcus Ochieng (Strathmore SERC)',
    proposerRole: 'Lead Epistemic Auditor',
    submittedDate: '2026-08-10',
    votingDeadline: '2026-08-24',
    status: 'passed_executed',
    quorumPercentage: 92.0,
    currentSupportPercentage: 98.5,
    totalVotesCast: 6850,
    summary: 'Standardizing the cryptographic data payload and optical calibration curve for in-situ nitrate and microbial respiration probes across all connected bioregions.',
    impactAssessmentSummary: 'Eliminates proprietary vendor lock-in and allows sub-$50 open hardware sensors to verify soil nitrogen fixation.',
    bioregion: 'Global Cyberspace',
    fpicConsentVerified: true,
    provenance: SAMPLE_PROVENANCE
  },
  {
    id: 'AGP-041',
    title: 'Authorize High-Density Geothermal Well in Protected Mara Corridor (VETOED)',
    category: 'Capital Allocation',
    proposer: 'Rift Valley Industrial Power Consortium',
    proposerRole: 'External Commercial Proposer',
    submittedDate: '2026-07-28',
    votingDeadline: '2026-08-05',
    status: 'vetoed_by_floors',
    quorumPercentage: 45.0,
    currentSupportPercentage: 22.1,
    totalVotesCast: 1890,
    summary: 'Proposed $18M drilling project in designated seasonal elephant migration corridor.',
    impactAssessmentSummary: 'Autonomous Moral Arbiter triggered Floor Rule #2 (Ecological Carrying Capacity & Migration Corridors) — automatically rejected with zero appeals.',
    capitalRequestedUsd: 18000000,
    bioregion: 'Mara River Catchment',
    fpicConsentVerified: false,
    provenance: SAMPLE_PROVENANCE
  }
];

export const TRANSPARENCY_AUDIT_RECORDS: TransparencyAuditRecord[] = [
  {
    id: 'aud-2026-08-24',
    timestamp: '2026-08-24T18:30:00Z',
    auditType: 'Capital Flow',
    auditorName: 'PricewaterhouseCoopers Sovereign & Open Ledger Practice',
    auditorOrganization: 'Independent External Assurance Provider',
    merkleRootHash: '0x4f82a9c17e35b6028194e6371a5c09dfb8364127',
    verificationStatus: 'verified_authentic',
    summary: 'Audited 100% of the $380M RVE Capital disbursements across 48 active bioregions. Zero slush funds, zero unverified broker fees, and zero unauthorized variance found.',
    externalExplorerUrl: 'https://explorer.atlas-sanctum.org/merkle/0x4f82a9c'
  },
  {
    id: 'aud-2026-08-19',
    timestamp: '2026-08-19T11:15:00Z',
    auditType: 'Sensor Calibration',
    auditorName: 'UNEP Global Environmental Monitoring System (GEMS/Water)',
    auditorOrganization: 'UN Intergovernmental Science Body',
    merkleRootHash: '0x9b7e21a48c6f3018247e59103c84dfa629471b3e',
    verificationStatus: 'verified_authentic',
    summary: 'In-situ physical cross-calibration of 340 optical water turbidity sensors and 18 flux towers in Kenya catchments against ISO-17025 laboratory standards.',
    externalExplorerUrl: 'https://explorer.atlas-sanctum.org/merkle/0x9b7e21a'
  },
  {
    id: 'aud-2026-08-12',
    timestamp: '2026-08-12T09:40:00Z',
    auditType: 'Floor Boundary Check',
    auditorName: 'Autonomous Constitutional Priority Floor Daemon',
    auditorOrganization: 'Atlas Sanctum Autonomous Security Mesh',
    merkleRootHash: '0x12e98c7410af382b647c593021fa4876b39d10e5',
    verificationStatus: 'verified_authentic',
    summary: 'Continuous 24-hour evaluation of 1,420 active work orders against minimum living wage, water drawdown, and Sabbath rest bounds. 0 breaches tolerated.',
    externalExplorerUrl: 'https://explorer.atlas-sanctum.org/merkle/0x12e98c7'
  }
];

export const DECISION_RECORDS: DecisionRecord[] = [
  {
    id: 'dec-2026-08-15',
    timestamp: '2026-08-15T16:00:00Z',
    matterTitle: 'Ratification of the Baringo Swale Agroforestry Milestone 3 Release ($1.4M)',
    decisionType: 'Elder Consensus',
    outcome: 'Approved',
    rationale: 'Satellite NDVI vegetative indices and ground piezometer telemetry proved water table depth elevated from 38m to 14m. Elder council verified 100% community labor wage compliance.',
    votingBreakdown: {
      inFavor: 18,
      opposed: 0,
      abstained: 0
    },
    elderWitnesses: ['Elder Kiprono Chemutai', 'Mama Joyce Chebet', 'Elder Thomas Odhiambo'],
    cryptographicProofHash: '0x7b4a29c18f3e506d8194e271a5c309dfb8364127'
  },
  {
    id: 'dec-2026-07-30',
    timestamp: '2026-07-30T10:20:00Z',
    matterTitle: 'Rejection of Commercial Geothermal Drilling in Protected Corridor',
    decisionType: 'Autonomous Floor Defense',
    outcome: 'Automated Veto',
    rationale: 'Commercial extraction violated Ecological Floor Rule #2 (Sacred Ecological Carrying Capacity). Autonomous Arbiter executed immediate non-appealable hard stop.',
    votingBreakdown: {
      inFavor: 0,
      opposed: 1,
      abstained: 0
    },
    elderWitnesses: ['Autonomous Constitutional Arbiter Daemon'],
    cryptographicProofHash: '0x9e12847fb3a04918274c593011fa4876b39d10e5'
  }
];
