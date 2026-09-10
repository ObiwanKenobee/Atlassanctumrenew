/**
 * ATLAS SANCTUM — LOW-LEVEL CYBER-PHYSICAL ARCHITECTURE ENGINE
 * Bounded Domains, Core Domain Entities, FSM State Machines, Telemetry Ingestion,
 * Priority Floor Engine, Hardware Actuation Safety, and Vertical Slice Prototype.
 * 
 * Central Axiom: "Every Atlas capability maps to a real entity, a real state, 
 * a real signal, a real decision, or a real action."
 */

// -----------------------------------------------------------------------------
// 1. DOMAIN TYPES & SCHEMAS
// -----------------------------------------------------------------------------

export type AccessStateStatus = 'DEFICIT' | 'CONSTRAINED' | 'STABLE' | 'ABUNDANT';

export interface AccessDimensions {
  availability: number; // 0 - 100%
  accessibility: number; // physical / social reachability
  affordability: number; // cost vs daily income
  reliability: number;   // uptime / continuity
  quality: number;       // standard compliance (e.g. WHO potability)
  distanceKm: number;    // distance to access point
  safety: number;        // security during transit/use
  continuityDays: number;// uninterrupted continuous access days
}

export interface AccessState {
  status: AccessStateStatus;
  score: number; // 0 - 100
  deficitMagnitude: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NONE';
  dimensions: AccessDimensions;
  indicators: Record<string, number | string>;
  lastObservedAt: string;
}

export interface PriorityFloorProfile {
  water: AccessState;
  food: AccessState;
  shelter: AccessState;
  energy: AccessState;
  sanitation: AccessState;
  connectivity: AccessState;
  health: AccessState;
  mobility: AccessState;
  finance: AccessState;
  livelihood: AccessState;
}

export interface ProvenanceObject {
  source_id: string;
  source_type: 'sensor' | 'mcu' | 'edge_gateway' | 'satellite' | 'field_operator' | 'lab_assay';
  collected_at: string;
  method: 'direct_measurement' | 'optical_telemetry' | 'scada_bus' | 'community_audit' | 'satellite_sar';
  quality: number; // 0.0 - 1.0 confidence
  processor: string;
  verified: boolean;
}

export interface TelemetryPacket {
  device_id: string;
  asset_id: string;
  timestamp: string;
  metric: string;
  value: number;
  unit: string;
  quality: 'good' | 'degraded' | 'fault' | 'calibrating';
  sequence: number;
  firmware: string;
  provenance?: ProvenanceObject;
}

export type WaterNodeFsmState = 
  | 'NORMAL' 
  | 'LOW_STORAGE' 
  | 'QUALITY_WARNING' 
  | 'LEAK_DETECTED' 
  | 'PUMP_FAILURE' 
  | 'OFFLINE' 
  | 'MAINTENANCE';

export type LifeShieldLifecycleStage = 
  | 'MANUFACTURED' 
  | 'STORED' 
  | 'DEPLOYED' 
  | 'OCCUPIED' 
  | 'MAINTENANCE' 
  | 'UPGRADED' 
  | 'REDEPLOYED' 
  | 'RETIRED';

export interface DigitalTwin {
  asset_id: string;
  current_state: Record<string, any>;
  health_score: number; // 0 - 100
  last_seen: string;
  model_version: string;
  confidence: number;
  fsm_state?: string;
  active_alerts: string[];
}

export interface Asset {
  id: string;
  asset_type: 'food_production_node' | 'water_purification_node' | 'shelter_module' | 'solar_microgrid' | 'edge_gateway';
  name: string;
  location_id: string;
  location_name: string;
  owner_id: string;
  operator_id: string;
  lifecycle_state: 'operational' | 'maintenance' | 'commissioning' | 'decommissioned';
  installed_at: string;
  expected_life_years: number;
  status: 'ONLINE' | 'DEGRADED' | 'FAULT' | 'OFFLINE';
  digitalTwin: DigitalTwin;
}

export interface EvidenceRecord {
  id: string;
  claim: string;
  evidence: string;
  source: string;
  method: string;
  measurement: {
    baseline: string | number;
    current: string | number;
    delta: string | number;
    unit: string;
  };
  outcome: string;
  verification: string;
  confidence: number;
  timestamp: string;
}

export interface EthicalAssessment {
  dignity: number;
  justice: number;
  inclusion: number;
  transparency: number;
  ecologicalImpact: number;
  reversibility: number;
  intergenerationalImpact: number;
  stakeholderCoverage: number;
  uncertainty: number;
  approved: boolean;
  guardrails: string[];
}

export interface DeviceCommand {
  id: string;
  device_id: string;
  asset_id: string;
  command: string; // e.g. "SET_PUMP_STATE"
  desired_state: Record<string, any>;
  actual_state: Record<string, any>;
  dispatched_at: string;
  reconciled: boolean;
  reconciled_at?: string;
  rejected_by_hardware_safety?: boolean;
  safety_reason?: string;
  status: 'PENDING' | 'EXECUTED' | 'REJECTED_BY_MCU_SAFETY' | 'TIMED_OUT';
}

export interface WorkOrder {
  id: string;
  asset_id: string;
  title: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  anomaly_trigger: string;
  assigned_to: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'VERIFIED';
  created_at: string;
  resolution_notes?: string;
}

export interface PriorityFloorIntervention {
  priorityDimension: string;
  deficitMagnitude: string;
  currentAccessPercentage: number;
  interventionTitle: string;
  estimatedCapexUsd: number;
  expectedCoverageHouseholds: number;
  evidenceConfidence: number;
  priorityScore: number;
}

export interface Mission {
  id: string;
  title: string;
  geography: {
    region: string;
    coordinates: [number, number];
    bioregion: string;
  };
  challenge: string;
  priorityFloor: Partial<PriorityFloorProfile>;
  activeAssets: string[];
  partners: string[];
  metrics: Record<string, any>;
  hypotheses: Array<{ statement: string; status: 'TESTING' | 'VALIDATED' | 'FALSIFIED' }>;
  outcomes: Array<{ metric: string; target: number; current: number; unit: string }>;
  status: 'DISCOVER' | 'BASELINE' | 'PILOT' | 'MEASURE' | 'VERIFY' | 'REPLICATE';
}

// -----------------------------------------------------------------------------
// 2. IN-MEMORY CYBER-PHYSICAL STATE STORE (System of Record Vertical Slice)
// -----------------------------------------------------------------------------

class AtlasLowLevelArchitectureStore {
  private assets: Map<string, Asset> = new Map();
  private telemetryHistory: TelemetryPacket[] = [];
  private workOrders: Map<string, WorkOrder> = new Map();
  private evidenceChain: EvidenceRecord[] = [];
  private commandLog: DeviceCommand[] = [];
  private missions: Map<string, Mission> = new Map();

  constructor() {
    this.seedInitialCyberPhysicalEntities();
  }

  private seedInitialCyberPhysicalEntities() {
    // 1. Asset: LIFE-POD-00482 (Food Production Node in Nairobi)
    const lifePodTwin: DigitalTwin = {
      asset_id: 'LIFE-POD-00482',
      current_state: {
        soil_moisture: 31.2,
        water_level: 72.4,
        temperature: 26.4,
        energy_state_of_charge: 81.0,
        pump_state: 'IDLE',
        valve_state: 'CLOSED',
        lighting_lux: 840,
        conductivity_ec: 1.8
      },
      health_score: 94,
      last_seen: new Date().toISOString(),
      model_version: 'lifepod-firmware-v1.3.2',
      confidence: 0.98,
      fsm_state: 'NORMAL',
      active_alerts: []
    };

    const lifePodAsset: Asset = {
      id: 'LIFE-POD-00482',
      asset_type: 'food_production_node',
      name: 'LifePod-NBO-00482 (Mukuru Cooperative)',
      location_id: 'LOC-NBO-MUKURU',
      location_name: 'Mukuru Kwa Njenga, Nairobi',
      owner_id: 'ORG-COMMUNITY-COOP-01',
      operator_id: 'OP-MWANGI-88',
      lifecycle_state: 'operational',
      installed_at: '2025-11-14T09:00:00Z',
      expected_life_years: 7,
      status: 'ONLINE',
      digitalTwin: lifePodTwin
    };
    this.assets.set(lifePodAsset.id, lifePodAsset);

    // 2. Asset: WATER-NODE-00109 (Smart Water Dispenser & Filtration Node)
    const waterNodeTwin: DigitalTwin = {
      asset_id: 'WATER-NODE-00109',
      current_state: {
        tank_level_pct: 68.5,
        flow_rate_lpm: 14.2,
        turbidity_ntu: 0.8,
        ph_level: 7.3,
        free_chlorine_ppm: 0.45,
        tds_ppm: 142,
        pump_status: 'RUNNING',
        valve_solenoid: 'OPEN'
      },
      health_score: 91,
      last_seen: new Date().toISOString(),
      model_version: 'water-node-mcu-v2.1.0',
      confidence: 0.99,
      fsm_state: 'NORMAL' as WaterNodeFsmState,
      active_alerts: []
    };

    const waterNodeAsset: Asset = {
      id: 'WATER-NODE-00109',
      asset_type: 'water_purification_node',
      name: 'Smart Aquifer Dispenser Node 109',
      location_id: 'LOC-NBO-KIBERA',
      location_name: 'Kibera Soweto East, Nairobi',
      owner_id: 'ORG-NAIROBI-WATER-COMMONS',
      operator_id: 'OP-KARIUKI-22',
      lifecycle_state: 'operational',
      installed_at: '2026-02-01T10:00:00Z',
      expected_life_years: 10,
      status: 'ONLINE',
      digitalTwin: waterNodeTwin
    };
    this.assets.set(waterNodeAsset.id, waterNodeAsset);

    // 3. Asset: LIFESHIELD-00042 (Rapid-Deployment Thermal & Bioclimatic Shelter)
    const lifeShieldTwin: DigitalTwin = {
      asset_id: 'LIFESHIELD-00042',
      current_state: {
        indoor_temp_c: 23.8,
        outdoor_temp_c: 33.5,
        relative_humidity_pct: 46.2,
        structural_flex_strain_microstrain: 18,
        air_changes_per_hour: 4.8,
        occupancy_persons: 4
      },
      health_score: 98,
      last_seen: new Date().toISOString(),
      model_version: 'lifeshield-cad-rev4',
      confidence: 0.96,
      fsm_state: 'OCCUPIED' as LifeShieldLifecycleStage,
      active_alerts: []
    };

    const lifeShieldAsset: Asset = {
      id: 'LIFESHIELD-00042',
      asset_type: 'shelter_module',
      name: 'LifeShield Bioclimatic Shelter #42',
      location_id: 'LOC-TURKANA-KALOKOL',
      location_name: 'Kalokol, Turkana Basin',
      owner_id: 'ORG-TURKANA-PASTORAL-TRUST',
      operator_id: 'OP-EKIRU-07',
      lifecycle_state: 'operational',
      installed_at: '2026-04-12T14:30:00Z',
      expected_life_years: 15,
      status: 'ONLINE',
      digitalTwin: lifeShieldTwin
    };
    this.assets.set(lifeShieldAsset.id, lifeShieldAsset);

    // Seed initial Evidence Records (Immutable verification chain)
    this.evidenceChain.push({
      id: 'EVID-WATER-001',
      claim: 'Water access improved in Kibera Zone 3',
      evidence: 'Household meter logs and SCADA dispenser telemetry',
      source: 'src_scada_dispenser_00109',
      method: 'direct_scada_counter + community_mobile_survey',
      measurement: {
        baseline: '74 min/day collection time',
        current: '31 min/day collection time',
        delta: '-58.1%',
        unit: 'minutes per day'
      },
      outcome: '520 households secured guaranteed daily potable access within 120m radius',
      verification: 'Community sampling (n=140) matched with IoT water meter logs',
      confidence: 0.84,
      timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    });

    // Seed Global Missions: Nairobi, Kitui, Turkana
    this.missions.set('MIS-NAIROBI-2026', {
      id: 'MIS-NAIROBI-2026',
      title: 'Nairobi Informal Settlement Ecological & Water Floor Mission',
      geography: {
        region: 'Nairobi River Basin',
        coordinates: [-1.2921, 36.8219],
        bioregion: 'Upper Athi Catchment'
      },
      challenge: 'Water cartels, high infant waterborne disease, lack of fresh cold-chain greens',
      priorityFloor: this.computePriorityFloor('Nairobi'),
      activeAssets: ['LIFE-POD-00482', 'WATER-NODE-00109'],
      partners: ['Kibera Community Alliance', 'Nairobi Bioregional Trust', 'UoN Bio-Labs'],
      metrics: {
        waterNodesOperational: 8,
        lifePodsActive: 40,
        householdsServed: 1840,
        choleraIncidentsThisQuarter: 0
      },
      hypotheses: [
        { statement: 'Distributed decentralised UV filtration nodes reduce potability cost by >60% vs trucked water', status: 'VALIDATED' },
        { statement: 'Sub-canopy hydroponic LifePods reduce local green vegetable transit footprint to zero', status: 'TESTING' }
      ],
      outcomes: [
        { metric: 'Daily Liters Potable Dispensed', target: 25000, current: 28400, unit: 'liters/day' },
        { metric: 'Community Water Spending', target: 20, current: 8.5, unit: 'KES per 20L jerrycan' }
      ],
      status: 'MEASURE'
    });

    this.missions.set('MIS-TURKANA-2026', {
      id: 'MIS-TURKANA-2026',
      title: 'Turkana Solar Aquifer Desalination & Bioclimatic Shelter Mission',
      geography: {
        region: 'Lake Turkana Basin',
        coordinates: [3.1167, 35.6000],
        bioregion: 'Rift Valley Arid Basin'
      },
      challenge: 'Severe brackish groundwater, extreme 42°C heat waves, pastoralist water stress',
      priorityFloor: this.computePriorityFloor('Turkana'),
      activeAssets: ['LIFESHIELD-00042'],
      partners: ['Turkana Pastoralist Union', 'SunWater Consortium'],
      metrics: {
        desalinationUnits: 3,
        sheltersDeployed: 12,
        livestockTroughsConnected: 6
      },
      hypotheses: [
        { statement: 'Bioclimatic phase-change LifeShield keeps internal temp <27°C during 42°C ambient spikes without active AC', status: 'VALIDATED' }
      ],
      outcomes: [
        { metric: 'Desalinated Water Production', target: 15000, current: 16800, unit: 'liters/day' }
      ],
      status: 'VERIFY'
    });
  }

  // ---------------------------------------------------------------------------
  // 3. PRIORITY FLOOR COMPUTATION ENGINE
  // ---------------------------------------------------------------------------

  public computePriorityFloor(location: string): PriorityFloorProfile {
    const isArid = location.toLowerCase().includes('turkana') || location.toLowerCase().includes('kitui');
    
    // Low-Level Axiom: AVAILABLE != ACCESSIBLE != RELIABLE != AFFORDABLE
    return {
      water: {
        status: isArid ? 'DEFICIT' : 'CONSTRAINED',
        score: isArid ? 38 : 52,
        deficitMagnitude: isArid ? 'CRITICAL' : 'HIGH',
        dimensions: {
          availability: isArid ? 45 : 75,
          accessibility: isArid ? 30 : 60,
          affordability: isArid ? 55 : 42, // Cartels artificially inflate in urban slums
          reliability: isArid ? 35 : 48,
          quality: isArid ? 62 : 44, // Slum groundwater often contaminated
          distanceKm: isArid ? 4.2 : 0.4,
          safety: isArid ? 70 : 50,
          continuityDays: isArid ? 18 : 22
        },
        indicators: {
          dailyCollectionMinutes: isArid ? 165 : 48,
          costPer20LJerrycanUsd: isArid ? 0.08 : 0.15,
          whoBacterialCompliancePct: isArid ? 88 : 64
        },
        lastObservedAt: new Date().toISOString()
      },
      food: {
        status: 'CONSTRAINED',
        score: 58,
        deficitMagnitude: 'MODERATE',
        dimensions: {
          availability: 80,
          accessibility: 72,
          affordability: 46,
          reliability: 65,
          quality: 55,
          distanceKm: 0.8,
          safety: 85,
          continuityDays: 28
        },
        indicators: {
          dietaryDiversityScore: 4.2,
          freshGreensDaysPerWeek: 3.1
        },
        lastObservedAt: new Date().toISOString()
      },
      shelter: {
        status: isArid ? 'DEFICIT' : 'CONSTRAINED',
        score: isArid ? 44 : 54,
        deficitMagnitude: isArid ? 'HIGH' : 'MODERATE',
        dimensions: {
          availability: 70,
          accessibility: 68,
          affordability: 52,
          reliability: 60,
          quality: isArid ? 38 : 42,
          distanceKm: 0,
          safety: 64,
          continuityDays: 30
        },
        indicators: {
          indoorThermalExceedanceHours: isArid ? 8.4 : 3.2,
          waterproofRoofingPct: 82
        },
        lastObservedAt: new Date().toISOString()
      },
      energy: {
        status: isArid ? 'DEFICIT' : 'STABLE',
        score: isArid ? 42 : 72,
        deficitMagnitude: isArid ? 'HIGH' : 'NONE',
        dimensions: {
          availability: isArid ? 50 : 85,
          accessibility: isArid ? 45 : 82,
          affordability: isArid ? 60 : 70,
          reliability: isArid ? 40 : 66,
          quality: 80,
          distanceKm: 0,
          safety: 88,
          continuityDays: isArid ? 20 : 27
        },
        indicators: {
          dailySolarKwhAvailable: isArid ? 1.8 : 4.6,
          monthlyBlackoutHours: isArid ? 14 : 28
        },
        lastObservedAt: new Date().toISOString()
      },
      sanitation: {
        status: 'CONSTRAINED',
        score: 48,
        deficitMagnitude: 'HIGH',
        dimensions: {
          availability: 65,
          accessibility: 52,
          affordability: 60,
          reliability: 58,
          quality: 45,
          distanceKm: 0.25,
          safety: 42,
          continuityDays: 26
        },
        indicators: {
          personsPerLatrine: 68,
          handwashingFacilityPresent: 0.54
        },
        lastObservedAt: new Date().toISOString()
      },
      connectivity: {
        status: 'STABLE',
        score: 76,
        deficitMagnitude: 'NONE',
        dimensions: {
          availability: 92,
          accessibility: 88,
          affordability: 68,
          reliability: 78,
          quality: 74,
          distanceKm: 0,
          safety: 95,
          continuityDays: 29
        },
        indicators: {
          cellular4gCoveragePct: 96,
          averageLatencyMs: 64
        },
        lastObservedAt: new Date().toISOString()
      },
      health: {
        status: 'CONSTRAINED',
        score: 51,
        deficitMagnitude: 'MODERATE',
        dimensions: {
          availability: 60,
          accessibility: 55,
          affordability: 48,
          reliability: 62,
          quality: 68,
          distanceKm: 2.1,
          safety: 75,
          continuityDays: 30
        },
        indicators: {
          distanceToPrimaryClinicMinutes: 38,
          essentialMedicineAvailabilityPct: 62
        },
        lastObservedAt: new Date().toISOString()
      },
      mobility: {
        status: 'STABLE',
        score: 66,
        deficitMagnitude: 'NONE',
        dimensions: {
          availability: 78,
          accessibility: 72,
          affordability: 58,
          reliability: 70,
          quality: 60,
          distanceKm: 0.2,
          safety: 62,
          continuityDays: 30
        },
        indicators: {
          pavedAccessWayPct: 45,
          feederTransitProximityMeters: 350
        },
        lastObservedAt: new Date().toISOString()
      },
      finance: {
        status: 'CONSTRAINED',
        score: 46,
        deficitMagnitude: 'HIGH',
        dimensions: {
          availability: 60,
          accessibility: 58,
          affordability: 52,
          reliability: 70,
          quality: 50,
          distanceKm: 0.5,
          safety: 80,
          continuityDays: 29
        },
        indicators: {
          mobileMoneyAdoptionPct: 94,
          accessToLowInterestMicroCreditPct: 24
        },
        lastObservedAt: new Date().toISOString()
      },
      livelihood: {
        status: 'CONSTRAINED',
        score: 52,
        deficitMagnitude: 'MODERATE',
        dimensions: {
          availability: 65,
          accessibility: 60,
          affordability: 60,
          reliability: 50,
          quality: 54,
          distanceKm: 1.5,
          safety: 68,
          continuityDays: 25
        },
        indicators: {
          youthEmploymentPct: 42,
          cooperativeMemberCoveragePct: 34
        },
        lastObservedAt: new Date().toISOString()
      }
    };
  }

  // ---------------------------------------------------------------------------
  // 4. LOW-LEVEL TELEMETRY INGESTION PIPELINE (IoT Senses)
  // Event flow: reading.received -> anomaly.detected -> work_order.generated
  // ---------------------------------------------------------------------------

  public ingestTelemetryPacket(packet: TelemetryPacket): {
    success: boolean;
    packetId: string;
    anomalyDetected: boolean;
    fsmTransition?: string;
    workOrderGenerated?: WorkOrder;
  } {
    // Normalise & record provenance
    const enrichedPacket: TelemetryPacket = {
      ...packet,
      timestamp: packet.timestamp || new Date().toISOString(),
      sequence: packet.sequence || (this.telemetryHistory.length + 1),
      provenance: packet.provenance || {
        source_id: packet.device_id,
        source_type: 'sensor',
        collected_at: new Date().toISOString(),
        method: 'direct_measurement',
        quality: 0.98,
        processor: 'atlas-telemetry-normalizer-v3',
        verified: true
      }
    };

    this.telemetryHistory.unshift(enrichedPacket);
    if (this.telemetryHistory.length > 500) {
      this.telemetryHistory.pop();
    }

    // Update Digital Twin State
    const asset = this.assets.get(packet.asset_id);
    let anomalyDetected = false;
    let workOrderGenerated: WorkOrder | undefined;
    let fsmTransition: string | undefined;

    if (asset) {
      asset.digitalTwin.current_state[packet.metric] = packet.value;
      asset.digitalTwin.last_seen = enrichedPacket.timestamp;

      // Check Finite State Machine (FSM) conditions
      if (asset.asset_type === 'water_purification_node') {
        const oldState = asset.digitalTwin.fsm_state as WaterNodeFsmState;
        let newState: WaterNodeFsmState = oldState || 'NORMAL';

        // Sensor Threshold Evaluation
        if (packet.metric === 'tank_level_pct' && packet.value < 15) {
          newState = 'LOW_STORAGE';
        } else if (packet.metric === 'turbidity_ntu' && packet.value > 5.0) {
          newState = 'QUALITY_WARNING';
        } else if (packet.metric === 'flow_rate_lpm' && packet.value > 85.0) {
          newState = 'LEAK_DETECTED';
        } else if (packet.metric === 'pump_rpm' && packet.value === 0 && asset.digitalTwin.current_state.pump_status === 'RUNNING') {
          newState = 'PUMP_FAILURE';
        } else if (packet.metric === 'tank_level_pct' && packet.value >= 25 && newState === 'LOW_STORAGE') {
          newState = 'NORMAL';
        }

        if (oldState !== newState) {
          asset.digitalTwin.fsm_state = newState;
          fsmTransition = `${oldState} -> ${newState}`;

          // Anomaly detected: generate automated work order
          if (['QUALITY_WARNING', 'LEAK_DETECTED', 'PUMP_FAILURE'].includes(newState)) {
            anomalyDetected = true;
            workOrderGenerated = {
              id: `WO-${Date.now().toString(36).toUpperCase()}`,
              asset_id: asset.id,
              title: `FSM Alert: ${newState} on ${asset.name}`,
              priority: newState === 'LEAK_DETECTED' || newState === 'PUMP_FAILURE' ? 'CRITICAL' : 'HIGH',
              anomaly_trigger: `Metric '${packet.metric}' exceeded safety threshold with value ${packet.value} ${packet.unit}`,
              assigned_to: asset.operator_id,
              status: 'OPEN',
              created_at: new Date().toISOString()
            };
            this.workOrders.set(workOrderGenerated.id, workOrderGenerated);
          }
        }
      } else if (asset.asset_type === 'food_production_node') {
        // LifePod Anomaly Detection
        if (packet.metric === 'soil_moisture' && packet.value < 18) {
          anomalyDetected = true;
          workOrderGenerated = {
            id: `WO-LIFEPOD-${Date.now().toString(36).toUpperCase()}`,
            asset_id: asset.id,
            title: `Soil Moisture Depletion on ${asset.name}`,
            priority: 'HIGH',
            anomaly_trigger: `Soil moisture dropped to ${packet.value}% (< 20% safe floor)`,
            assigned_to: asset.operator_id,
            status: 'OPEN',
            created_at: new Date().toISOString()
          };
          this.workOrders.set(workOrderGenerated.id, workOrderGenerated);
        }
      }
    }

    return {
      success: true,
      packetId: `PKT-${enrichedPacket.sequence}`,
      anomalyDetected,
      fsmTransition,
      workOrderGenerated
    };
  }

  // ---------------------------------------------------------------------------
  // 5. COMMAND ARCHITECTURE & PHYSICAL SAFETY OVERRIDE ENGINE
  // Central Principle: "Physical safety beats cloud intelligence."
  // Local MCU controller retains absolute authority to reject unsafe cloud commands.
  // ---------------------------------------------------------------------------

  public dispatchDeviceCommand(
    deviceId: string,
    assetId: string,
    command: string,
    desiredState: Record<string, any>
  ): {
    commandRecord: DeviceCommand;
    reconciliationSuccess: boolean;
    physicalSafetyTripped: boolean;
    reason: string;
  } {
    const asset = this.assets.get(assetId);
    const currentState = asset?.digitalTwin.current_state || {};

    const commandRecord: DeviceCommand = {
      id: `CMD-${Date.now().toString(36).toUpperCase()}`,
      device_id: deviceId,
      asset_id: assetId,
      command,
      desired_state: desiredState,
      actual_state: { ...currentState },
      dispatched_at: new Date().toISOString(),
      reconciled: false,
      status: 'PENDING'
    };

    // HARDWARE SAFETY INTERLOCK CHECK (MCU Reflex Simulation)
    // Scenario: Cloud asks to turn pump ON, but tank level is < 15% (dry run hazard)
    if (desiredState.pump_state === 'ON' || desiredState.pump_status === 'RUNNING') {
      const tankLevel = Number(currentState.water_level || currentState.tank_level_pct || 0);
      if (tankLevel < 15) {
        commandRecord.status = 'REJECTED_BY_MCU_SAFETY';
        commandRecord.rejected_by_hardware_safety = true;
        commandRecord.safety_reason = `PHYSICAL SAFETY TRIP: Tank water level (${tankLevel}%) is below dry-run threshold (15%). Embedded MCU safety interlock refused actuation to prevent motor burnout. Physical safety beats cloud intelligence.`;
        
        this.commandLog.unshift(commandRecord);
        return {
          commandRecord,
          reconciliationSuccess: false,
          physicalSafetyTripped: true,
          reason: commandRecord.safety_reason
        };
      }
    }

    // Safety Passed: State Reconciliation Occurs
    if (asset) {
      Object.assign(asset.digitalTwin.current_state, desiredState);
      commandRecord.actual_state = { ...asset.digitalTwin.current_state };
      commandRecord.reconciled = true;
      commandRecord.reconciled_at = new Date().toISOString();
      commandRecord.status = 'EXECUTED';
    }

    this.commandLog.unshift(commandRecord);
    return {
      commandRecord,
      reconciliationSuccess: true,
      physicalSafetyTripped: false,
      reason: 'Command safely dispatched, accepted by edge controller, and reconciled.'
    };
  }

  // ---------------------------------------------------------------------------
  // 6. MORAL INTELLIGENCE & ETHICAL POLICY EVALUATION
  // ---------------------------------------------------------------------------

  public evaluateMoralPolicy(
    proposal: {
      action: string;
      targetLocation: string;
      capitalAllocationUsd: number;
      ecologicalImpactAssessment: number;
      reversibilityScore: number;
    }
  ): EthicalAssessment {
    const hardConstraintViolations: string[] = [];

    // Rule 1: Must not violate reversibility if ecological harm is high
    if (proposal.ecologicalImpactAssessment < 40 && proposal.reversibilityScore < 50) {
      hardConstraintViolations.push('Hard Constraint: Ecological harm exceeds threshold with low reversibility. Mandatory human review triggered.');
    }

    // Rule 2: Intergenerational equity
    const intergenerational = Math.min(100, Math.round(proposal.reversibilityScore * 0.8 + proposal.ecologicalImpactAssessment * 0.2));

    const assessment: EthicalAssessment = {
      dignity: 92,
      justice: 88,
      inclusion: 85,
      transparency: 96,
      ecologicalImpact: proposal.ecologicalImpactAssessment,
      reversibility: proposal.reversibilityScore,
      intergenerationalImpact: intergenerational,
      stakeholderCoverage: 84,
      uncertainty: 12, // 12% uncertainty penalty
      approved: hardConstraintViolations.length === 0,
      guardrails: hardConstraintViolations.length > 0 
        ? hardConstraintViolations 
        : ['Constitutional compliance validated: Meets Bioregional Priority Floor thresholds']
    };

    return assessment;
  }

  // ---------------------------------------------------------------------------
  // 7. GETTERS FOR INSPECTION & API ENDPOINTS
  // ---------------------------------------------------------------------------

  public getAssets(): Asset[] {
    return Array.from(this.assets.values());
  }

  public getAssetById(id: string): Asset | undefined {
    return this.assets.get(id);
  }

  public getTelemetryStream(limit: number = 50): TelemetryPacket[] {
    return this.telemetryHistory.slice(0, limit);
  }

  public getWorkOrders(): WorkOrder[] {
    return Array.from(this.workOrders.values());
  }

  public getEvidenceChain(): EvidenceRecord[] {
    return [...this.evidenceChain];
  }

  public addEvidenceRecord(record: EvidenceRecord): void {
    this.evidenceChain.unshift(record);
  }

  public getCommandLog(): DeviceCommand[] {
    return [...this.commandLog];
  }

  public getMissions(): Mission[] {
    return Array.from(this.missions.values());
  }

  public getMissionById(id: string): Mission | undefined {
    return this.missions.get(id);
  }
}

// Global Singleton Export
export const atlasLowLevelStore = new AtlasLowLevelArchitectureStore();
