/**
 * ATLAS STEWARD — Deterministic Simulation Engine & Seed Data
 * Simulates community water infrastructure, 18 routine tasks, telemetry, and hero anomaly.
 */

import {
  WaterAsset,
  InventoryItem,
  Operator,
  ServiceProvider,
  WorkOrder,
  RoutineTask,
  PriorityFloorStatus,
  HumanDecisionException,
  StewardSystemState,
  AgentActivityLog
} from './types';
import { stewardMemory } from './memory';

export const SEEDED_PRIORITY_FLOOR: PriorityFloorStatus[] = [
  {
    dimension: 'water',
    label: 'Potable Water & Hygiene Reliability',
    reliabilityScore: 94.8,
    targetBaseline: 95.0,
    status: 'DEGRADED', // Degraded due to BH-03 anomaly
    activePopServed: 12400,
    lastAssessedAt: 'Just now'
  },
  {
    dimension: 'sanitation',
    label: 'Blackwater Treatment & Safe Waste',
    reliabilityScore: 97.4,
    targetBaseline: 90.0,
    status: 'NOMINAL',
    activePopServed: 12400,
    lastAssessedAt: '5m ago'
  },
  {
    dimension: 'energy',
    label: 'Microgrid & Solar Pumping Power',
    reliabilityScore: 98.2,
    targetBaseline: 92.0,
    status: 'NOMINAL',
    activePopServed: 12400,
    lastAssessedAt: '2m ago'
  },
  {
    dimension: 'food',
    label: 'Community Kitchen & Grain Logistics',
    reliabilityScore: 96.0,
    targetBaseline: 90.0,
    status: 'NOMINAL',
    activePopServed: 8200,
    lastAssessedAt: '12m ago'
  },
  {
    dimension: 'shelter',
    label: 'Habitation Thermal & Storm Safety',
    reliabilityScore: 99.1,
    targetBaseline: 95.0,
    status: 'NOMINAL',
    activePopServed: 12400,
    lastAssessedAt: '1h ago'
  },
  {
    dimension: 'connectivity',
    label: 'Mesh Radio & Telemetry Uplink',
    reliabilityScore: 99.5,
    targetBaseline: 95.0,
    status: 'NOMINAL',
    activePopServed: 12400,
    lastAssessedAt: 'Just now'
  }
];

export const SEEDED_WATER_ASSETS: WaterAsset[] = [
  {
    id: 'ASSET-BH-01',
    name: 'Borehole Well 01 (North Spring)',
    type: 'borehole_pump',
    location: 'Sector 1 - North Ridge',
    zone: 'North',
    capacityLitres: 120000,
    currentLevelPercent: 92,
    flowRateLps: 22.4,
    pressureBar: 4.1,
    vibrationMmS: 1.6,
    temperatureCelsius: 21.2,
    status: 'OPERATIONAL',
    lastInspectedAt: '2026-08-28T08:00:00Z',
    installedDate: '2023-03-15',
    criticalityTier: 'P1_CRITICAL',
    servesPopulation: 2800,
    tags: ['solar_coupled', 'deep_aquifer']
  },
  {
    id: 'ASSET-BH-02',
    name: 'Borehole Well 02 (Valley Core)',
    type: 'borehole_pump',
    location: 'Sector 2 - Central Commons',
    zone: 'Central',
    capacityLitres: 150000,
    currentLevelPercent: 88,
    flowRateLps: 26.1,
    pressureBar: 4.4,
    vibrationMmS: 1.9,
    temperatureCelsius: 22.0,
    status: 'OPERATIONAL',
    lastInspectedAt: '2026-08-29T14:30:00Z',
    installedDate: '2022-11-10',
    criticalityTier: 'P1_CRITICAL',
    servesPopulation: 3400,
    tags: ['grid_backup', 'primary_feeder']
  },
  {
    id: 'ASSET-BH-03',
    name: 'Borehole Well 03 (South Aquifer)',
    type: 'borehole_pump',
    location: 'Sector 3 - High Sandstone Plateau',
    zone: 'South',
    capacityLitres: 180000,
    currentLevelPercent: 64,
    flowRateLps: 17.6, // Dropped from 24.5 L/s
    pressureBar: 2.8,  // Dropped from 4.2 bar
    vibrationMmS: 6.8, // Critical anomaly! > 2.5 mm/s threshold
    temperatureCelsius: 48.5, // Overheating
    status: 'CRITICAL',
    lastInspectedAt: '2026-08-15T11:00:00Z',
    installedDate: '2021-06-20',
    criticalityTier: 'P1_CRITICAL',
    servesPopulation: 3200,
    tags: ['sandstone_strata', 'high_draw', 'anomalous']
  },
  {
    id: 'ASSET-BH-04',
    name: 'Borehole Well 04 (East Farmlands)',
    type: 'borehole_pump',
    location: 'Sector 4 - Agroforestry Buffer',
    zone: 'East',
    capacityLitres: 95000,
    currentLevelPercent: 84,
    flowRateLps: 18.2,
    pressureBar: 3.8,
    vibrationMmS: 1.7,
    temperatureCelsius: 20.8,
    status: 'OPERATIONAL',
    lastInspectedAt: '2026-08-30T09:15:00Z',
    installedDate: '2024-01-12',
    criticalityTier: 'P2_HIGH',
    servesPopulation: 1800,
    tags: ['irrigation_mixed', 'solar_only']
  },
  {
    id: 'ASSET-TANK-A',
    name: 'Master Header Tank Alpha',
    type: 'header_tank',
    location: 'Hilltop Summit - Elevation +48m',
    zone: 'Central',
    capacityLitres: 250000,
    currentLevelPercent: 86,
    flowRateLps: 45.0,
    pressureBar: 5.2,
    vibrationMmS: 0.2,
    temperatureCelsius: 19.5,
    status: 'OPERATIONAL',
    lastInspectedAt: '2026-08-31T06:00:00Z',
    installedDate: '2020-05-18',
    criticalityTier: 'P1_CRITICAL',
    servesPopulation: 6500,
    tags: ['gravity_feed', 'chlorine_treated']
  },
  {
    id: 'ASSET-TANK-B',
    name: 'Standby Header Tank Beta',
    type: 'header_tank',
    location: 'South Hilltop - Elevation +42m',
    zone: 'South',
    capacityLitres: 200000,
    currentLevelPercent: 78,
    flowRateLps: 32.0,
    pressureBar: 4.8,
    vibrationMmS: 0.1,
    temperatureCelsius: 19.8,
    status: 'OPERATIONAL',
    lastInspectedAt: '2026-08-31T06:00:00Z',
    installedDate: '2022-08-14',
    criticalityTier: 'P2_HIGH',
    servesPopulation: 3200,
    tags: ['gravity_feed', 'south_backup']
  },
  {
    id: 'ASSET-CHLOR-01',
    name: 'Inline Auto-Chlorination Unit 01',
    type: 'chlorination_unit',
    location: 'Sector 2 Treatment House',
    zone: 'Central',
    capacityLitres: 5000,
    currentLevelPercent: 94,
    flowRateLps: 40.0,
    pressureBar: 4.0,
    vibrationMmS: 0.4,
    temperatureCelsius: 22.1,
    status: 'OPERATIONAL',
    lastInspectedAt: '2026-08-31T07:30:00Z',
    installedDate: '2023-09-01',
    criticalityTier: 'P1_CRITICAL',
    servesPopulation: 12400,
    tags: ['dosing_pump', 'orp_monitored']
  },
  {
    id: 'ASSET-SOLAR-01',
    name: 'Solar Inverter Bank Alpha (60kW)',
    type: 'solar_inverter',
    location: 'South Solar Field Station',
    zone: 'South',
    capacityLitres: 0,
    currentLevelPercent: 100,
    flowRateLps: 0,
    pressureBar: 0,
    vibrationMmS: 0.3,
    temperatureCelsius: 38.2,
    status: 'OPERATIONAL',
    lastInspectedAt: '2026-08-30T16:00:00Z',
    installedDate: '2023-04-10',
    criticalityTier: 'P2_HIGH',
    servesPopulation: 4500,
    tags: ['mppt_active', 'lithium_coupled']
  },
  {
    id: 'ASSET-JUNCT-04',
    name: 'Sector 3 Distribution Junction 04',
    type: 'distribution_junction',
    location: 'South Market Intersection',
    zone: 'South',
    capacityLitres: 0,
    currentLevelPercent: 100,
    flowRateLps: 18.0,
    pressureBar: 2.9,
    vibrationMmS: 0.5,
    temperatureCelsius: 20.0,
    status: 'WARNING', // Pressures fluctuating due to BH-03
    lastInspectedAt: '2026-08-31T05:00:00Z',
    installedDate: '2021-08-20',
    criticalityTier: 'P2_HIGH',
    servesPopulation: 3200,
    tags: ['motorized_valve', 'pressure_sensor']
  },
  {
    id: 'ASSET-FILT-02',
    name: 'Multi-Media Filtration Skid 02',
    type: 'filtration_skid',
    location: 'Central Water Hub',
    zone: 'Central',
    capacityLitres: 12000,
    currentLevelPercent: 90,
    flowRateLps: 35.0,
    pressureBar: 3.9,
    vibrationMmS: 0.8,
    temperatureCelsius: 21.0,
    status: 'OPERATIONAL',
    lastInspectedAt: '2026-08-31T04:00:00Z',
    installedDate: '2024-02-15',
    criticalityTier: 'P2_HIGH',
    servesPopulation: 8500,
    tags: ['auto_backwash', 'turbidity_low']
  },
  {
    id: 'ASSET-CIST-01',
    name: 'Rainwater Harvest Cistern 01',
    type: 'storage_cistern',
    location: 'Community Hall Roof Array',
    zone: 'Central',
    capacityLitres: 80000,
    currentLevelPercent: 95,
    flowRateLps: 10.5,
    pressureBar: 2.2,
    vibrationMmS: 0.1,
    temperatureCelsius: 18.9,
    status: 'OPERATIONAL',
    lastInspectedAt: '2026-08-29T10:00:00Z',
    installedDate: '2022-04-10',
    criticalityTier: 'P3_MEDIUM',
    servesPopulation: 1200,
    tags: ['rainwater_catchment']
  },
  {
    id: 'ASSET-CIST-02',
    name: 'Clinic Emergency Cistern 02',
    type: 'storage_cistern',
    location: 'Community Health Dispensary',
    zone: 'North',
    capacityLitres: 50000,
    currentLevelPercent: 99,
    flowRateLps: 8.0,
    pressureBar: 3.5,
    vibrationMmS: 0.1,
    temperatureCelsius: 19.0,
    status: 'OPERATIONAL',
    lastInspectedAt: '2026-08-31T01:00:00Z',
    installedDate: '2023-01-05',
    criticalityTier: 'P1_CRITICAL',
    servesPopulation: 800,
    tags: ['hospital_grade', 'uv_sanitized']
  }
];

export const SEEDED_INVENTORY: InventoryItem[] = [
  {
    id: 'INV-01',
    sku: 'SEAL-TC-50MM',
    name: 'Tungsten-Carbide Mechanical Shaft Seal (50mm)',
    category: 'seals_gaskets',
    quantityOnHand: 0, // Depleted! (Must be ordered for BH-03)
    reorderPoint: 2,
    unitCostUsd: 420,
    unit: 'pcs',
    locationBin: 'Bin C-04',
    status: 'DEPLETED'
  },
  {
    id: 'INV-02',
    sku: 'SEAL-EPDM-50MM',
    name: 'Standard EPDM O-Ring Kit (50mm)',
    category: 'seals_gaskets',
    quantityOnHand: 14,
    reorderPoint: 5,
    unitCostUsd: 12,
    unit: 'kits',
    locationBin: 'Bin A-02',
    status: 'IN_STOCK'
  },
  {
    id: 'INV-03',
    sku: 'CHEM-CHLOR-TAB',
    name: 'Calcium Hypochlorite Chlorine Tablets (65%)',
    category: 'chemicals',
    quantityOnHand: 45,
    reorderPoint: 15,
    unitCostUsd: 28,
    unit: 'kg',
    locationBin: 'Chem Shed 01',
    status: 'IN_STOCK'
  },
  {
    id: 'INV-04',
    sku: 'TUBE-SANTO-8MM',
    name: 'Santoprene Peristaltic Dosing Tube (8mm)',
    category: 'chemicals',
    quantityOnHand: 6,
    reorderPoint: 3,
    unitCostUsd: 35,
    unit: 'meters',
    locationBin: 'Bin B-11',
    status: 'IN_STOCK'
  },
  {
    id: 'INV-05',
    sku: 'PUMP-SUB-7KW',
    name: 'Submersible Multistage Pump Core (7.5 kW)',
    category: 'pumps',
    quantityOnHand: 1,
    reorderPoint: 1,
    unitCostUsd: 1850,
    unit: 'unit',
    locationBin: 'Heavy Storage Pallet 2',
    status: 'IN_STOCK'
  },
  {
    id: 'INV-06',
    sku: 'SOLAR-FAN-24V',
    name: 'High-CFM Brushless Inverter Cooling Fan',
    category: 'electrical_solar',
    quantityOnHand: 4,
    reorderPoint: 2,
    unitCostUsd: 45,
    unit: 'pcs',
    locationBin: 'Bin E-03',
    status: 'IN_STOCK'
  }
];

export const SEEDED_OPERATORS: Operator[] = [
  {
    id: 'OP-01',
    name: 'David Mwangi',
    role: 'lead_technician',
    phone: '+254 712 345 678',
    email: 'david.mwangi@communitywater.org',
    status: 'AVAILABLE',
    activeAssignments: [],
    certifications: ['Deep Borehole Rigging Level 3', 'High-Pressure Hydraulic Safety', 'Solar Inverter Tech']
  },
  {
    id: 'OP-02',
    name: 'Sarah Kimani',
    role: 'certified_plumber',
    phone: '+254 723 456 789',
    email: 'sarah.kimani@communitywater.org',
    status: 'ON_SHIFT',
    activeAssignments: ['TASK-ROUTINE-04'],
    certifications: ['Electrofusion Pipe Welding', 'Distribution Balancing', 'Water Quality Sampling']
  },
  {
    id: 'OP-03',
    name: 'Amina Abdi',
    role: 'solar_specialist',
    phone: '+254 734 567 890',
    email: 'amina.abdi@communitywater.org',
    status: 'AVAILABLE',
    activeAssignments: [],
    certifications: ['PV Array Diagnostics', 'Lithium Battery BMS', 'Grid Synchronization']
  },
  {
    id: 'OP-04',
    name: 'Paul Otieno',
    role: 'logistics_coordinator',
    phone: '+254 745 678 901',
    email: 'paul.otieno@communitywater.org',
    status: 'AVAILABLE',
    activeAssignments: [],
    certifications: ['Supply Chain Operations', 'Community Elder Liaison', 'Inventory Management']
  }
];

export const SEEDED_SERVICE_PROVIDERS: ServiceProvider[] = [
  {
    id: 'SUP-01',
    name: 'Rift Valley Precision Hydro',
    specialty: 'Deep Borehole Rehabilitation & Heavy Mechanical Seals',
    tier: 'PRE_APPROVED',
    averageRating: 4.9,
    hourlyRateUsd: 85,
    slaResponseHours: 4,
    contactPerson: 'Eng. Peter Karanja',
    phone: '+254 799 111 222',
    historicalJobsCount: 18,
    verifiedLicense: true
  },
  {
    id: 'SUP-02',
    name: 'Savannah Hydro Electrics',
    specialty: 'High Voltage Pump Motors & Soft Starters',
    tier: 'PRE_APPROVED',
    averageRating: 4.7,
    hourlyRateUsd: 75,
    slaResponseHours: 6,
    contactPerson: 'Grace Ndung’u',
    phone: '+254 788 333 444',
    historicalJobsCount: 12,
    verifiedLicense: true
  },
  {
    id: 'SUP-03',
    name: 'Nairobi WaterCare Labs',
    specialty: 'Chemical Testing, Chlorination & Disinfection Systems',
    tier: 'PRE_APPROVED',
    averageRating: 4.8,
    hourlyRateUsd: 65,
    slaResponseHours: 12,
    contactPerson: 'Dr. Samuel Ochieng',
    phone: '+254 777 555 666',
    historicalJobsCount: 24,
    verifiedLicense: true
  },
  {
    id: 'SUP-04',
    name: 'Equator Solar Dynamics',
    specialty: 'Photovoltaic Inverters, MPPT Controllers & Grid Tie',
    tier: 'PRE_APPROVED',
    averageRating: 4.9,
    hourlyRateUsd: 80,
    slaResponseHours: 4,
    contactPerson: 'Hassan Omar',
    phone: '+254 766 777 888',
    historicalJobsCount: 15,
    verifiedLicense: true
  }
];

export const SEEDED_18_ROUTINE_TASKS: RoutineTask[] = [
  {
    id: 'TASK-01',
    title: 'Sensor Zero-Point Calibration on Header Tank A',
    category: 'sensor_calibration',
    assignedAgent: 'OPERATIONS',
    assetId: 'ASSET-TANK-A',
    assetName: 'Master Header Tank Alpha',
    status: 'completed',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Routine weekly hydrostatic pressure sensor calibration within ±0.2% tolerance.',
    executionTimestamp: '06:12:04 AM',
    durationMs: 82,
    outcomeSummary: 'Pressure transducer calibrated to 5.20 bar at +48m elevation.',
    toolChain: ['get_asset_status', 'update_task']
  },
  {
    id: 'TASK-02',
    title: 'Daily Chlorine Buffer Dosing on Treatment Unit 1',
    category: 'chlorine_buffer',
    assignedAgent: 'OPERATIONS',
    assetId: 'ASSET-CHLOR-01',
    assetName: 'Inline Auto-Chlorination Unit 01',
    status: 'completed',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Automated ORP adjustment based on sunrise UV index forecast.',
    executionTimestamp: '06:30:15 AM',
    durationMs: 140,
    outcomeSummary: 'Maintained 0.65 ppm free chlorine residual across primary line.',
    toolChain: ['get_water_status', 'update_task']
  },
  {
    id: 'TASK-03',
    title: 'Solar Inverter Heat Sink Air-Flush Scheduled',
    category: 'solar_inverter_check',
    assignedAgent: 'OPERATIONS',
    assetId: 'ASSET-SOLAR-01',
    assetName: 'Solar Inverter Bank Alpha (60kW)',
    status: 'completed',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Preventative thermal management derived from MEM-2026-0118.',
    executionTimestamp: '06:45:22 AM',
    durationMs: 95,
    outcomeSummary: 'Cabinet fan RPM 3,400. Core temperature nominal at 38.2°C.',
    toolChain: ['get_asset_status', 'schedule_inspection']
  },
  {
    id: 'TASK-04',
    title: 'Technician Sarah Kimani Dispatched to Zone North',
    category: 'inspection',
    assignedAgent: 'OPERATIONS',
    assetId: 'ASSET-BH-01',
    assetName: 'Borehole Well 01 (North Spring)',
    status: 'in_progress',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Routine scheduled monthly physical check for seal weeping.',
    executionTimestamp: '07:00:00 AM',
    durationMs: 110,
    outcomeSummary: 'En route. ETA 15 minutes with digital checklist.',
    toolChain: ['get_operator_availability', 'create_work_order']
  },
  {
    id: 'TASK-05',
    title: 'Auto-Reorder 10x EPDM Sealing Rings ($48.00)',
    category: 'inventory_reorder',
    assignedAgent: 'RESOURCE',
    status: 'completed',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Inventory level dropped below reorder buffer. Cost $48 < $500 threshold.',
    executionTimestamp: '07:15:30 AM',
    durationMs: 230,
    outcomeSummary: 'Dispatched purchase order to local hardware supplier.',
    toolChain: ['get_inventory', 'request_quote']
  },
  {
    id: 'TASK-06',
    title: 'Pressure Balancing on Sector 3 Junction Valve 04',
    category: 'pressure_balancing',
    assignedAgent: 'OPERATIONS',
    assetId: 'ASSET-JUNCT-04',
    assetName: 'Sector 3 Distribution Junction 04',
    status: 'completed',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Autonomous motorized actuator adjustment to stabilize downstream pressure.',
    executionTimestamp: '07:22:18 AM',
    durationMs: 165,
    outcomeSummary: 'Balanced downstream manifold to 2.9 bar.',
    toolChain: ['get_asset_status', 'update_task']
  },
  {
    id: 'TASK-07',
    title: 'Static Water Level Measurement Synced from Telemetry',
    category: 'inspection',
    assignedAgent: 'OPERATIONS',
    assetId: 'ASSET-BH-02',
    assetName: 'Borehole Well 02 (Valley Core)',
    status: 'completed',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Aquifer recharge rate logging for hydrological compliance.',
    executionTimestamp: '07:35:10 AM',
    durationMs: 70,
    outcomeSummary: 'Water table steady at -34.2m below surface.',
    toolChain: ['get_water_status']
  },
  {
    id: 'TASK-08',
    title: 'Automatic Backwash Cycle Triggered on Filter Skid 02',
    category: 'pressure_balancing',
    assignedAgent: 'OPERATIONS',
    assetId: 'ASSET-FILT-02',
    assetName: 'Multi-Media Filtration Skid 02',
    status: 'completed',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Differential pressure reached 0.8 bar threshold.',
    executionTimestamp: '07:45:00 AM',
    durationMs: 310,
    outcomeSummary: '120-second air scour and water backwash complete. Turbidity < 0.4 NTU.',
    toolChain: ['get_asset_status', 'update_task']
  },
  {
    id: 'TASK-09',
    title: 'SMS Yield Bulletin Broadcast to Sector Elders',
    category: 'community_notice',
    assignedAgent: 'STEWARD',
    status: 'completed',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Routine Monday morning community transparency report.',
    executionTimestamp: '08:00:00 AM',
    durationMs: 180,
    outcomeSummary: 'Delivered SMS status to 12 community leaders: "Water systems 95% nominal."',
    toolChain: ['send_notification']
  },
  {
    id: 'TASK-10',
    title: 'Pre-Monsoon Gutter Flush Check on Cistern 01',
    category: 'inspection',
    assignedAgent: 'OPERATIONS',
    assetId: 'ASSET-CIST-01',
    assetName: 'Rainwater Harvest Cistern 01',
    status: 'completed',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Seasonal preventative maintenance rule triggered by rain forecast.',
    executionTimestamp: '08:10:45 AM',
    durationMs: 85,
    outcomeSummary: 'First-flush diverter clean and dry-screen unobstructed.',
    toolChain: ['get_asset_status', 'update_task']
  },
  {
    id: 'TASK-11',
    title: 'Battery Bank Impedance Health Sync on Solar Substation',
    category: 'solar_inverter_check',
    assignedAgent: 'OPERATIONS',
    assetId: 'ASSET-SOLAR-01',
    assetName: 'Solar Inverter Bank Alpha (60kW)',
    status: 'completed',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Autonomous battery state-of-health diagnostics.',
    executionTimestamp: '08:20:12 AM',
    durationMs: 90,
    outcomeSummary: 'Lithium battery bank cell balance variance < 0.005V.',
    toolChain: ['get_asset_status']
  },
  {
    id: 'TASK-12',
    title: 'Float Switch Continuity Verification on Storage Cistern 02',
    category: 'inspection',
    assignedAgent: 'OPERATIONS',
    assetId: 'ASSET-CIST-02',
    assetName: 'Clinic Emergency Cistern 02',
    status: 'completed',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Hospital-grade redundancy safety invariant check.',
    executionTimestamp: '08:30:00 AM',
    durationMs: 75,
    outcomeSummary: 'Dual magnetic reed float switches 100% responsive.',
    toolChain: ['get_asset_status', 'update_task']
  },
  {
    id: 'TASK-13',
    title: 'Chlorine Residual Log Transmitted to County Health Portal',
    category: 'community_notice',
    assignedAgent: 'STEWARD',
    status: 'completed',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Mandatory statutory water compliance ledger update.',
    executionTimestamp: '08:40:20 AM',
    durationMs: 210,
    outcomeSummary: 'Uploaded encrypted telemetric test certificates.',
    toolChain: ['send_notification']
  },
  {
    id: 'TASK-14',
    title: 'Borehole Well 04 Solar MPPT Tracking Optimization',
    category: 'solar_inverter_check',
    assignedAgent: 'OPERATIONS',
    assetId: 'ASSET-BH-04',
    assetName: 'Borehole Well 04 (East Farmlands)',
    status: 'completed',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Real-time solar irradiance tracking curve adjustment.',
    executionTimestamp: '08:50:00 AM',
    durationMs: 65,
    outcomeSummary: 'Pump frequency optimized to 48.5 Hz under 850 W/m² irradiance.',
    toolChain: ['get_asset_status', 'update_task']
  },
  {
    id: 'TASK-15',
    title: 'Backup Diesel Genset Auto-Crank Readiness Test (30s)',
    category: 'inspection',
    assignedAgent: 'OPERATIONS',
    status: 'completed',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Weekly autonomous start-motor and fuel line prime check.',
    executionTimestamp: '09:00:00 AM',
    durationMs: 420,
    outcomeSummary: 'Genset fired up in 2.1s, oil pressure 4.5 bar, fuel tank 92% full.',
    toolChain: ['get_asset_status', 'update_task']
  },
  {
    id: 'TASK-16',
    title: 'UV Disinfection Lamp Hour Counter Sync for Clinic Line',
    category: 'inspection',
    assignedAgent: 'OPERATIONS',
    assetId: 'ASSET-CIST-02',
    status: 'waiting',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Lamp timer currently at 7,420 hrs (Replacement due at 9,000 hrs).',
    executionTimestamp: '09:10:00 AM',
    durationMs: 50,
    outcomeSummary: 'Next check queued for next month.',
    toolChain: ['get_asset_status']
  },
  {
    id: 'TASK-17',
    title: 'Bi-Weekly Turbidity Telemetry Verification',
    category: 'inspection',
    assignedAgent: 'OPERATIONS',
    status: 'waiting',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Turbidity baseline verified 0.28 NTU. Scheduled next read.',
    executionTimestamp: '09:15:00 AM',
    durationMs: 45,
    outcomeSummary: 'Within WHO and Kenyan potable standards.',
    toolChain: ['get_water_status']
  },
  {
    id: 'TASK-18',
    title: 'Technician Evening Handover Schedule Prepared',
    category: 'community_notice',
    assignedAgent: 'STEWARD',
    status: 'waiting',
    autonomyLevel: 'EXECUTE',
    automatedReason: 'Automated shift roster compilation for 18:00 handover.',
    executionTimestamp: '09:20:00 AM',
    durationMs: 60,
    outcomeSummary: 'Handover checklist drafted for Paul Otieno and Amina Abdi.',
    toolChain: ['get_operator_availability', 'update_task']
  }
];

export const SEEDED_HERO_EXCEPTION: HumanDecisionException = {
  id: 'EXC-BH03-SEAL-VIBRATION',
  title: 'Borehole 03 Mechanical Seal Failure & Cavitation Risk',
  severity: 'P1_CRITICAL',
  assetId: 'ASSET-BH-03',
  assetName: 'Borehole Well 03 (South Aquifer)',
  whatHappened: 'Telemetry detected severe bearing vibration (6.8 mm/s vs 2.5 mm/s normal ceiling) accompanied by a 28% drop in water delivery (17.6 L/s down from 24.5 L/s). The pump motor is running at 48.5°C.',
  whyItMatters: 'Borehole 03 is the sole primary water source for 3,200 residents in Sector 3 (South Village). If the pump seizes, Header Tank B will drain within 11 hours, causing a complete water outage for households, schools, and livestock.',
  evidence: [
    {
      id: 'EV-01',
      claim: 'Tri-axial accelerometer on Borehole 03 pump head reads 6.82 mm/s vibration (warning ceiling is 4.5 mm/s; shutdown threshold is 7.0 mm/s).',
      category: 'OBSERVED',
      source: 'Telemetry: Sensor-BH03-VIB-Z (Edge Modbus)',
      timestamp: '2026-08-31 09:22:15 UTC',
      confidenceScore: 99.8,
      unknownsOrAssumptions: ['Sensor calibration confirmed within last 14 days']
    },
    {
      id: 'EV-02',
      claim: 'Hydraulic flow meter indicates delivery drop to 17.6 L/s (-28.1% vs nominal benchmark).',
      category: 'OBSERVED',
      source: 'Telemetry: MagFlow-BH03-FL01',
      timestamp: '2026-08-31 09:22:18 UTC',
      confidenceScore: 99.5
    },
    {
      id: 'EV-03',
      claim: 'Hydrological physics model indicates silt ingestion from quartz sandstone strata causing rapid mechanical seal abrasion.',
      category: 'MODELED',
      source: 'Atlas Hydrodynamic Model & Strands Memory (MEM-2025-0812)',
      timestamp: '2026-08-31 09:22:24 UTC',
      confidenceScore: 94.2,
      unknownsOrAssumptions: ['Assuming dry season draw rate matches historical August profile']
    },
    {
      id: 'EV-04',
      claim: 'Pre-approved contractor Rift Valley Precision Hydro has quoted $1,420 for expedited emergency replacement using heavy-duty tungsten-carbide seals with a 4-hour SLA.',
      category: 'ESTIMATED',
      source: 'Resource Agent Tool: request_quote (Quote QT-94021)',
      timestamp: '2026-08-31 09:22:30 UTC',
      confidenceScore: 96.0
    }
  ],
  policyThresholdTriggered: 'POL-03-SPEND-THRESHOLD: Total proposed repair cost of $1,420.00 exceeds the $500.00 autonomous approval ceiling.',
  financialImpactUsd: 1420.0,
  populationImpacted: 3200,
  recommendedAction: 'Approve Work Order WO-88219 for Rift Valley Precision Hydro to replace with Heavy-Duty Tungsten-Carbide Seal ($1,420.00). Divert standby flow from Header Tank Alpha to keep Sector 3 pressurized during the 3-hour repair window.',
  potentialConsequencesIfIgnored: [
    'Complete pump seizure within 4–8 hours due to abrasive friction.',
    'Catastrophic stator burnout requiring a full $4,800 pump core replacement.',
    'Total water loss for 3,200 residents starting by 18:00 tonight.',
    'Severe drop in Community Water Reliability Priority Floor from 94.8% to 68.2%.'
  ],
  options: [
    {
      id: 'OPT-1',
      label: 'Approve Tungsten-Carbide Overhaul (Recommended)',
      description: 'Dispatch pre-approved specialist Rift Valley Precision with 24-month warranty tungsten-carbide mechanical seal. Cost: $1,420. Downtime: 3.5 hrs with tank diversion.',
      costUsd: 1420,
      downtimeHours: 3.5,
      riskScore: 8,
      isRecommended: true
    },
    {
      id: 'OPT-2',
      label: 'Temporary EPDM Patch & Lubricate (Low Cost / High Risk)',
      description: 'Send internal technician David Mwangi to flush casing and apply standard EPDM seal from local inventory. Cost: $120. Downtime: 1.5 hrs.',
      costUsd: 120,
      downtimeHours: 1.5,
      riskScore: 78,
      isRecommended: false
    },
    {
      id: 'OPT-3',
      label: 'Derate Motor to 40% & Defer to Weekend',
      description: 'Throttle borehole speed to 30 Hz to keep vibration at 3.8 mm/s. Reduces water yield to 9 L/s. Imposes strict water rationing.',
      costUsd: 0,
      downtimeHours: 0,
      riskScore: 65,
      isRecommended: false
    }
  ],
  status: 'pending_human_approval',
  createdAt: '2026-08-31T09:23:00Z'
};

export function createInitialSystemState(): StewardSystemState {
  return {
    durableObjective: 'Keep all community water points operational this week. Handle routine coordination automatically and only interrupt me when a meaningful decision requires my approval.',
    objectiveSetAt: '2026-08-31 06:00:00 UTC',
    activeCycle: 1,
    isRunning: true,
    isPaused: false,
    autoApprovalSpendThresholdUsd: 500.0,
    stats: {
      routineTasksHandledCount: 18,
      completedTasksCount: 15,
      inProgressTasksCount: 1,
      waitingTasksCount: 2,
      exceptionsCount: 1,
      humanInterruptionRatioPercent: 5.2, // 1 exception out of 19 events
      timeSavedHours: 14.5,
      waterReliabilityScore: 94.8
    },
    priorityFloor: JSON.parse(JSON.stringify(SEEDED_PRIORITY_FLOOR)),
    assets: JSON.parse(JSON.stringify(SEEDED_WATER_ASSETS)),
    inventory: JSON.parse(JSON.stringify(SEEDED_INVENTORY)),
    operators: JSON.parse(JSON.stringify(SEEDED_OPERATORS)),
    serviceProviders: JSON.parse(JSON.stringify(SEEDED_SERVICE_PROVIDERS)),
    workOrders: [
      {
        id: 'WO-88218',
        assetId: 'ASSET-BH-01',
        assetName: 'Borehole Well 01 (North Spring)',
        taskTitle: 'Routine Seal Weep Inspection',
        description: 'Physical inspection and pressure recording',
        priority: 'ROUTINE',
        assignedOperatorId: 'OP-02',
        status: 'IN_PROGRESS',
        estimatedCostUsd: 45,
        createdAt: '2026-08-31T07:00:00Z',
        scheduledFor: '2026-08-31T07:30:00Z'
      }
    ],
    routineTasks: JSON.parse(JSON.stringify(SEEDED_18_ROUTINE_TASKS)),
    activeExceptions: [JSON.parse(JSON.stringify(SEEDED_HERO_EXCEPTION))],
    resolvedDecisions: [],
    memoryLessons: stewardMemory.getAllLessons(),
    activityLogs: [
      {
        id: 'LOG-01',
        timestamp: '09:22:15 AM',
        agentRole: 'OPERATIONS',
        agentName: 'OPERATIONS_AGENT',
        actionType: 'TOOL_INVOCATION',
        toolName: 'get_asset_status',
        latencyMs: 14,
        status: 'WARNING',
        details: 'Anomaly detected on Borehole Well 03 (Vibration: 6.82 mm/s, Flow: 17.6 L/s).'
      },
      {
        id: 'LOG-02',
        timestamp: '09:22:20 AM',
        agentRole: 'STEWARD',
        agentName: 'STEWARD_AGENT',
        actionType: 'TOOL_INVOCATION',
        toolName: 'get_maintenance_history',
        latencyMs: 18,
        status: 'SUCCESS',
        details: 'Queried historical incidents. Retrieved matching lesson MEM-2025-0812 (impeller cavitation).'
      },
      {
        id: 'LOG-03',
        timestamp: '09:22:25 AM',
        agentRole: 'RESOURCE',
        agentName: 'RESOURCE_AGENT',
        actionType: 'TOOL_INVOCATION',
        toolName: 'request_quote',
        latencyMs: 32,
        status: 'SUCCESS',
        details: 'Requested expedited quote QT-94021 from Rift Valley Precision Hydro ($1,420.00).'
      },
      {
        id: 'LOG-04',
        timestamp: '09:22:30 AM',
        agentRole: 'RISK',
        agentName: 'RISK_AGENT',
        actionType: 'EXCEPTION_ESCALATION',
        toolName: 'create_work_order',
        latencyMs: 25,
        status: 'ESCALATED',
        details: 'Spend ($1,420.00) exceeds $500 auto-approval threshold. Execution halted; escalated to Cockpit.'
      }
    ]
  };
}
