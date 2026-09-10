/**
 * ATLAS SANCTUM — ASSET SERVICE & DIGITAL TWIN DOMAIN ENGINE
 * 
 * Implements the core Asset registry logic as defined in the low-level architecture:
 * - Defines 'Asset' and 'DigitalTwin' interfaces matching the low-level design
 * - Methods to create, retrieve, and update asset states in the database & memory
 * - Real-time Digital Twin state synchronization from sensor telemetry
 * - Event orchestration via the unified EventBus ('asset.created', 'asset.state.updated', etc.)
 */

import { eventBus, EventBus } from '../lib/eventBus';

export type AssetType = 
  | 'food_production_node' 
  | 'water_purification_node' 
  | 'shelter_module' 
  | 'solar_microgrid' 
  | 'edge_gateway'
  | 'desalination_unit'
  | 'waste_bioreactor';

export type AssetStatus = 'ONLINE' | 'DEGRADED' | 'FAULT' | 'OFFLINE';

export type AssetLifecycleState = 
  | 'commissioning' 
  | 'operational' 
  | 'maintenance' 
  | 'decommissioned'
  | 'deployed'
  | 'upgraded'
  | 'retired';

export interface AssetAlert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  metric?: string;
  timestamp: string;
  cleared: boolean;
  clearedAt?: string;
}

export interface HardwareSafetyInterlocks {
  safety_trips_count: number;
  last_trip_reason?: string;
  last_trip_timestamp?: string;
  mcu_override_active: boolean;
  dry_run_interlock_active: boolean;
  overpressure_interlock_active: boolean;
  thermal_runaway_interlock_active: boolean;
}

export interface DigitalTwinTelemetrySummary {
  total_packets_ingested: number;
  anomalies_recorded: number;
  last_telemetry_at: string;
}

export interface DigitalTwinStateTransition {
  timestamp: string;
  previous_fsm_state?: string;
  new_fsm_state?: string;
  state_delta: Record<string, any>;
  trigger: string;
}

/**
 * DigitalTwin Schema Structure as defined in the low-level architecture
 */
export interface DigitalTwin {
  asset_id: string;
  current_state: Record<string, any>;
  health_score: number; // 0 - 100
  last_seen: string;
  model_version: string;
  confidence: number; // 0.0 - 1.0
  fsm_state?: string;
  active_alerts: (AssetAlert | string)[];
  telemetry_summary?: DigitalTwinTelemetrySummary;
  hardware_safety?: HardwareSafetyInterlocks;
  recent_transitions?: DigitalTwinStateTransition[];
}

export interface AssetSpecifications {
  model?: string;
  manufacturer?: string;
  serial_number?: string;
  capacity?: string;
  rated_power_kw?: number;
  firmware_target?: string;
  communication_protocol?: 'MQTT' | 'LoRaWAN' | 'CoAP' | 'Cellular_NB_IoT' | 'Satellite_Iridium';
  installed_sensors?: string[];
  actuators?: string[];
}

/**
 * Asset Domain Model Entity as defined in the low-level architecture
 */
export interface Asset {
  id: string;
  asset_type: AssetType;
  name: string;
  location_id: string;
  location_name: string;
  coordinates?: [number, number]; // [lat, lng]
  owner_id: string;
  operator_id: string;
  lifecycle_state: AssetLifecycleState;
  installed_at: string;
  expected_life_years: number;
  status: AssetStatus;
  specifications?: AssetSpecifications;
  digitalTwin: DigitalTwin;
}

export interface CreateAssetDTO {
  id: string;
  asset_type: AssetType;
  name: string;
  location_id: string;
  location_name: string;
  coordinates?: [number, number];
  owner_id: string;
  operator_id: string;
  lifecycle_state?: AssetLifecycleState;
  expected_life_years?: number;
  specifications?: AssetSpecifications;
  initial_state?: Record<string, any>;
  model_version?: string;
  initial_fsm_state?: string;
}

export interface UpdateStateOptions {
  healthScoreDelta?: number;
  fsmState?: string;
  newAlert?: AssetAlert;
  trigger?: string;
}

/**
 * Lazy helper to safely access Firestore database if available
 */
async function getFirestoreDb() {
  try {
    const { db } = await import('../firebase');
    const { doc, setDoc, getDoc, getDocs, collection } = await import('firebase/firestore');
    return { db, doc, setDoc, getDoc, getDocs, collection };
  } catch {
    return null;
  }
}

/**
 * AssetService: Core registry for cyber-physical assets and digital twins
 */
export class AssetService {
  private assets: Map<string, Asset> = new Map();
  private bus: EventBus;
  private dbInitialized: boolean = false;

  constructor(bus: EventBus = eventBus) {
    this.bus = bus;
    this.seedDefaultAssets();
    this.initDatabaseSync().catch(() => {});
  }

  /**
   * Pre-seed canonical cyber-physical node prototypes across bioregions
   */
  private seedDefaultAssets(): void {
    // 1. Food Production Node (LifePod-00482)
    const lifePodTwin: DigitalTwin = {
      asset_id: 'LIFE-POD-00482',
      current_state: {
        soil_moisture: 42.5,
        ambient_temp_c: 24.8,
        light_intensity_lux: 18500,
        ph_level: 6.8,
        water_reservoir_pct: 68.0,
        nutrient_ec_ppm: 820,
        aeration_fan_rpm: 1200
      },
      health_score: 96,
      last_seen: new Date().toISOString(),
      model_version: 'firmware-v2.4.1-lifepod',
      confidence: 0.98,
      fsm_state: 'NORMAL',
      active_alerts: [],
      telemetry_summary: {
        total_packets_ingested: 1420,
        anomalies_recorded: 2,
        last_telemetry_at: new Date().toISOString()
      },
      hardware_safety: {
        safety_trips_count: 0,
        mcu_override_active: false,
        dry_run_interlock_active: false,
        overpressure_interlock_active: false,
        thermal_runaway_interlock_active: false
      },
      recent_transitions: []
    };

    const lifePodAsset: Asset = {
      id: 'LIFE-POD-00482',
      asset_type: 'food_production_node',
      name: 'LifePod-NBO-00482 (Mukuru Cooperative)',
      location_id: 'LOC-NBO-MUKURU',
      location_name: 'Mukuru Kwa Njenga, Nairobi',
      coordinates: [-1.3125, 36.8789],
      owner_id: 'ORG-COMMUNITY-COOP-01',
      operator_id: 'OP-MWANGI-88',
      lifecycle_state: 'operational',
      installed_at: '2025-11-14T09:00:00Z',
      expected_life_years: 7,
      status: 'ONLINE',
      specifications: {
        model: 'Sanctum Aeroponic Food Tower v2',
        capacity: '480 Crop Sites / Cycle',
        rated_power_kw: 1.2,
        communication_protocol: 'LoRaWAN',
        firmware_target: 'STM32F4-SCADA',
        installed_sensors: ['soil_moisture', 'ambient_temp_c', 'ph_level', 'nutrient_ec_ppm'],
        actuators: ['misting_pump', 'aeration_fan', 'spectrum_led_array']
      },
      digitalTwin: lifePodTwin
    };
    this.assets.set(lifePodAsset.id, lifePodAsset);

    // 2. Water Purification Node (WaterNode-00109)
    const waterNodeTwin: DigitalTwin = {
      asset_id: 'WATER-NODE-00109',
      current_state: {
        tank_level_pct: 84.2,
        flow_rate_lpm: 14.2,
        turbidity_ntu: 0.8,
        ph_level: 7.3,
        free_chlorine_ppm: 0.45,
        tds_ppm: 142,
        pump_status: 'RUNNING',
        valve_solenoid: 'OPEN'
      },
      health_score: 98,
      last_seen: new Date().toISOString(),
      model_version: 'firmware-v3.1.0-aqua',
      confidence: 0.99,
      fsm_state: 'NORMAL',
      active_alerts: [],
      telemetry_summary: {
        total_packets_ingested: 3840,
        anomalies_recorded: 0,
        last_telemetry_at: new Date().toISOString()
      },
      hardware_safety: {
        safety_trips_count: 0,
        mcu_override_active: false,
        dry_run_interlock_active: false,
        overpressure_interlock_active: false,
        thermal_runaway_interlock_active: false
      },
      recent_transitions: []
    };

    const waterNodeAsset: Asset = {
      id: 'WATER-NODE-00109',
      asset_type: 'water_purification_node',
      name: 'Smart Aquifer Dispenser Node 109',
      location_id: 'LOC-NBO-KIBERA',
      location_name: 'Kibera Soweto East, Nairobi',
      coordinates: [-1.3133, 36.7869],
      owner_id: 'ORG-NAIROBI-WATER-COMMONS',
      operator_id: 'OP-KARIUKI-22',
      lifecycle_state: 'operational',
      installed_at: '2026-02-01T10:00:00Z',
      expected_life_years: 10,
      status: 'ONLINE',
      specifications: {
        model: 'Sanctum UV-Ultrafiltration Dispenser Node',
        capacity: '5,000 Liters / Day',
        rated_power_kw: 2.4,
        communication_protocol: 'Cellular_NB_IoT',
        firmware_target: 'ESP32-S3-WIFI-CELL',
        installed_sensors: ['tank_level_pct', 'flow_rate_lpm', 'turbidity_ntu', 'ph_level', 'free_chlorine_ppm'],
        actuators: ['inlet_solenoid', 'uv_lamp_relay', 'backwash_pump']
      },
      digitalTwin: waterNodeTwin
    };
    this.assets.set(waterNodeAsset.id, waterNodeAsset);

    // 3. Shelter Module (LifeShield-00042)
    const lifeShieldTwin: DigitalTwin = {
      asset_id: 'LIFESHIELD-00042',
      current_state: {
        indoor_temp_c: 23.4,
        outdoor_temp_c: 38.1,
        relative_humidity_pct: 32.0,
        structural_flex_strain_microstrain: 12.4,
        ventilation_flap_pct: 45,
        battery_soc_pct: 91.5
      },
      health_score: 94,
      last_seen: new Date().toISOString(),
      model_version: 'firmware-v1.8.0-shield',
      confidence: 0.95,
      fsm_state: 'OCCUPIED',
      active_alerts: [],
      telemetry_summary: {
        total_packets_ingested: 890,
        anomalies_recorded: 1,
        last_telemetry_at: new Date().toISOString()
      },
      hardware_safety: {
        safety_trips_count: 0,
        mcu_override_active: false,
        dry_run_interlock_active: false,
        overpressure_interlock_active: false,
        thermal_runaway_interlock_active: false
      },
      recent_transitions: []
    };

    const lifeShieldAsset: Asset = {
      id: 'LIFESHIELD-00042',
      asset_type: 'shelter_module',
      name: 'LifeShield Bioclimatic Shelter #42',
      location_id: 'LOC-TURKANA-KALOKOL',
      location_name: 'Kalokol, Turkana Basin',
      coordinates: [3.5167, 35.8833],
      owner_id: 'ORG-TURKANA-PASTORAL-TRUST',
      operator_id: 'OP-EKIRU-07',
      lifecycle_state: 'deployed',
      installed_at: '2026-04-12T14:30:00Z',
      expected_life_years: 15,
      status: 'ONLINE',
      specifications: {
        model: 'LifeShield Passive Bioclimatic Geodesic Dome',
        capacity: '6 Persons Continuous Habitation',
        rated_power_kw: 0.6,
        communication_protocol: 'LoRaWAN',
        firmware_target: 'NRF52-BLE-LORA-NODE',
        installed_sensors: ['indoor_temp_c', 'outdoor_temp_c', 'relative_humidity_pct', 'structural_flex_strain_microstrain'],
        actuators: ['passive_convective_louver', 'phase_change_cooling_vent']
      },
      digitalTwin: lifeShieldTwin
    };
    this.assets.set(lifeShieldAsset.id, lifeShieldAsset);
  }

  /**
   * Initializes background database synchronization with Firestore
   */
  private async initDatabaseSync(): Promise<void> {
    if (this.dbInitialized) return;
    try {
      const fs = await getFirestoreDb();
      if (!fs) return;
      const { db, getDocs, collection } = fs;
      const snapshot = await getDocs(collection(db, 'assets'));
      if (!snapshot.empty) {
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as Asset;
          if (data && data.id) {
            this.assets.set(data.id, data);
          }
        });
      } else {
        // If database is empty, persist default pre-seeded assets
        for (const asset of this.assets.values()) {
          this.persistAssetToDb(asset).catch(() => {});
        }
      }
      this.dbInitialized = true;
    } catch {
      // In-memory mode operates transparently if database is offline
    }
  }

  /**
   * Persist asset document to Firestore
   */
  private async persistAssetToDb(asset: Asset): Promise<void> {
    try {
      const fs = await getFirestoreDb();
      if (!fs) return;
      const { db, doc, setDoc } = fs;
      await setDoc(doc(db, 'assets', asset.id), asset, { merge: true });
    } catch {
      // Silently continue in-memory
    }
  }

  // ---------------------------------------------------------------------------
  // CORE RETRIEVAL METHODS
  // ---------------------------------------------------------------------------

  /**
   * Synchronous retrieval by ID
   */
  public getAssetById(id: string): Asset | undefined {
    return this.assets.get(id);
  }

  /**
   * Asynchronous retrieval by ID with database lookup fallback
   */
  public async getAsset(id: string): Promise<Asset | undefined> {
    const cached = this.assets.get(id);
    if (cached) return cached;

    try {
      const fs = await getFirestoreDb();
      if (fs) {
        const { db, doc, getDoc } = fs;
        const snap = await getDoc(doc(db, 'assets', id));
        if (snap.exists()) {
          const data = snap.data() as Asset;
          this.assets.set(data.id, data);
          return data;
        }
      }
    } catch {
      // Ignore database lookup errors
    }

    return undefined;
  }

  /**
   * Retrieve all registered assets
   */
  public getAllAssets(): Asset[] {
    return Array.from(this.assets.values());
  }

  /**
   * Asynchronous retrieval of all assets with database refresh
   */
  public async getAssets(filter?: {
    type?: AssetType;
    status?: AssetStatus;
    locationId?: string;
  }): Promise<Asset[]> {
    await this.initDatabaseSync();
    let result = Array.from(this.assets.values());

    if (filter?.type) {
      result = result.filter(a => a.asset_type === filter.type);
    }
    if (filter?.status) {
      result = result.filter(a => a.status === filter.status);
    }
    if (filter?.locationId) {
      result = result.filter(a => a.location_id === filter.locationId);
    }

    return result;
  }

  public getAssetsByType(type: AssetType): Asset[] {
    return Array.from(this.assets.values()).filter(a => a.asset_type === type);
  }

  public getAssetsByLocation(locationId: string): Asset[] {
    return Array.from(this.assets.values()).filter(a => a.location_id === locationId);
  }

  public getAssetsByStatus(status: AssetStatus): Asset[] {
    return Array.from(this.assets.values()).filter(a => a.status === status);
  }

  // ---------------------------------------------------------------------------
  // CORE CREATION & MODIFICATION METHODS
  // ---------------------------------------------------------------------------

  /**
   * Create and register a new Cyber-Physical Asset with an initialized Digital Twin
   * Stores in memory and persists to the database.
   */
  public createAsset(dto: CreateAssetDTO): Asset {
    if (this.assets.has(dto.id)) {
      throw new Error(`Asset with ID '${dto.id}' already exists.`);
    }

    const initialTwin: DigitalTwin = {
      asset_id: dto.id,
      current_state: dto.initial_state || {},
      health_score: 100,
      last_seen: new Date().toISOString(),
      model_version: dto.model_version || 'v1.0.0',
      confidence: 1.0,
      fsm_state: dto.initial_fsm_state || 'NORMAL',
      active_alerts: [],
      telemetry_summary: {
        total_packets_ingested: 0,
        anomalies_recorded: 0,
        last_telemetry_at: new Date().toISOString()
      },
      hardware_safety: {
        safety_trips_count: 0,
        mcu_override_active: false,
        dry_run_interlock_active: false,
        overpressure_interlock_active: false,
        thermal_runaway_interlock_active: false
      },
      recent_transitions: []
    };

    const newAsset: Asset = {
      id: dto.id,
      asset_type: dto.asset_type,
      name: dto.name,
      location_id: dto.location_id,
      location_name: dto.location_name,
      coordinates: dto.coordinates,
      owner_id: dto.owner_id,
      operator_id: dto.operator_id,
      lifecycle_state: dto.lifecycle_state || 'commissioning',
      installed_at: new Date().toISOString(),
      expected_life_years: dto.expected_life_years || 10,
      status: 'ONLINE',
      specifications: dto.specifications,
      digitalTwin: initialTwin
    };

    this.assets.set(newAsset.id, newAsset);
    this.persistAssetToDb(newAsset).catch(() => {});

    // Emit 'asset.created' on the event bus
    this.bus.emit('asset.created', 'asset-service', {
      assetId: newAsset.id,
      assetType: newAsset.asset_type,
      name: newAsset.name,
      locationId: newAsset.location_id,
      operatorId: newAsset.operator_id
    });

    return newAsset;
  }

  /**
   * Update an existing Asset entity and persist to database
   */
  public updateAsset(
    id: string, 
    updates: Partial<Omit<Asset, 'id' | 'digitalTwin'>>
  ): Asset | undefined {
    const asset = this.assets.get(id);
    if (!asset) return undefined;

    Object.assign(asset, updates);
    this.persistAssetToDb(asset).catch(() => {});

    this.bus.emit('asset.updated', 'asset-service', {
      assetId: id,
      updates
    });

    return asset;
  }

  /**
   * Transition Asset Lifecycle State
   */
  public transitionLifecycle(
    assetId: string, 
    newState: AssetLifecycleState, 
    operatorNotes?: string
  ): Asset | undefined {
    const asset = this.assets.get(assetId);
    if (!asset) return undefined;

    const oldState = asset.lifecycle_state;
    asset.lifecycle_state = newState;

    if (newState === 'decommissioned' || newState === 'retired') {
      asset.status = 'OFFLINE';
    }

    this.persistAssetToDb(asset).catch(() => {});

    this.bus.emit('asset.lifecycle.transitioned', 'asset-service', {
      assetId,
      oldState,
      newState,
      operatorNotes,
      timestamp: new Date().toISOString()
    });

    return asset;
  }

  /**
   * Update Asset State & Synchronize Digital Twin
   * Persists the state delta to database and emits 'asset.state.updated' event.
   */
  public updateAssetState(
    assetId: string,
    stateDelta: Record<string, any>,
    options?: UpdateStateOptions
  ): DigitalTwin | undefined {
    const asset = this.assets.get(assetId);
    if (!asset) return undefined;

    const twin = asset.digitalTwin;
    const previousState = { ...twin.current_state };
    const previousFsm = twin.fsm_state;

    // Apply delta to digital twin
    Object.assign(twin.current_state, stateDelta);
    twin.last_seen = new Date().toISOString();

    if (!twin.telemetry_summary) {
      twin.telemetry_summary = {
        total_packets_ingested: 0,
        anomalies_recorded: 0,
        last_telemetry_at: twin.last_seen
      };
    }
    twin.telemetry_summary.total_packets_ingested += 1;
    twin.telemetry_summary.last_telemetry_at = twin.last_seen;

    if (options?.fsmState && options.fsmState !== previousFsm) {
      twin.fsm_state = options.fsmState;
      if (!twin.recent_transitions) twin.recent_transitions = [];
      twin.recent_transitions.unshift({
        timestamp: twin.last_seen,
        previous_fsm_state: previousFsm,
        new_fsm_state: options.fsmState,
        state_delta: stateDelta,
        trigger: options.trigger || 'telemetry_packet'
      });
      if (twin.recent_transitions.length > 20) {
        twin.recent_transitions.pop();
      }
    }

    if (options?.healthScoreDelta !== undefined) {
      twin.health_score = Math.max(0, Math.min(100, twin.health_score + options.healthScoreDelta));
      if (twin.health_score < 40) {
        asset.status = 'FAULT';
      } else if (twin.health_score < 75) {
        asset.status = 'DEGRADED';
      } else {
        asset.status = 'ONLINE';
      }
    }

    if (options?.newAlert) {
      if (!Array.isArray(twin.active_alerts)) twin.active_alerts = [];
      twin.active_alerts.unshift(options.newAlert);
      twin.telemetry_summary.anomalies_recorded += 1;
    }

    // Persist updated asset & digital twin to database
    this.persistAssetToDb(asset).catch(() => {});

    // Emit 'asset.state.updated' event via event bus
    this.bus.emit('asset.state.updated', 'asset-service', {
      assetId,
      previousState,
      currentState: twin.current_state,
      delta: stateDelta,
      healthScore: twin.health_score,
      fsmState: twin.fsm_state,
      updatedAt: twin.last_seen
    });

    return twin;
  }

  /**
   * Alias for updateAssetState for backwards compatibility
   */
  public updateDigitalTwinState(
    assetId: string,
    stateDelta: Record<string, any>,
    options?: UpdateStateOptions
  ): DigitalTwin | undefined {
    return this.updateAssetState(assetId, stateDelta, options);
  }

  /**
   * Register a new active alert on the Asset's Digital Twin
   */
  public addAlert(
    assetId: string, 
    alertData: Omit<AssetAlert, 'id' | 'timestamp' | 'cleared'>
  ): AssetAlert | undefined {
    const asset = this.assets.get(assetId);
    if (!asset) return undefined;

    const alert: AssetAlert = {
      ...alertData,
      id: `ALT-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      cleared: false
    };

    if (!Array.isArray(asset.digitalTwin.active_alerts)) {
      asset.digitalTwin.active_alerts = [];
    }
    asset.digitalTwin.active_alerts.unshift(alert);

    if (asset.digitalTwin.telemetry_summary) {
      asset.digitalTwin.telemetry_summary.anomalies_recorded += 1;
    }

    const penalty = alert.severity === 'CRITICAL' ? 25 : alert.severity === 'HIGH' ? 12 : 5;
    asset.digitalTwin.health_score = Math.max(0, asset.digitalTwin.health_score - penalty);

    if (asset.digitalTwin.health_score < 50) {
      asset.status = 'DEGRADED';
    }

    this.persistAssetToDb(asset).catch(() => {});
    return alert;
  }

  /**
   * Clear an active alert on the Asset's Digital Twin
   */
  public clearAlert(assetId: string, alertId: string): boolean {
    const asset = this.assets.get(assetId);
    if (!asset || !Array.isArray(asset.digitalTwin.active_alerts)) return false;

    const alert = (asset.digitalTwin.active_alerts as AssetAlert[]).find(a => typeof a === 'object' && a.id === alertId);
    if (alert) {
      alert.cleared = true;
      alert.clearedAt = new Date().toISOString();
      asset.digitalTwin.health_score = Math.min(100, asset.digitalTwin.health_score + 10);
      this.persistAssetToDb(asset).catch(() => {});
      return true;
    }
    return false;
  }

  /**
   * Record MCU hardware safety trip
   */
  public recordHardwareSafetyTrip(assetId: string, reason: string): void {
    const asset = this.assets.get(assetId);
    if (!asset) return;

    if (!asset.digitalTwin.hardware_safety) {
      asset.digitalTwin.hardware_safety = {
        safety_trips_count: 0,
        mcu_override_active: false,
        dry_run_interlock_active: false,
        overpressure_interlock_active: false,
        thermal_runaway_interlock_active: false
      };
    }

    const hw = asset.digitalTwin.hardware_safety;
    hw.safety_trips_count += 1;
    hw.last_trip_reason = reason;
    hw.last_trip_timestamp = new Date().toISOString();
    hw.mcu_override_active = true;

    this.persistAssetToDb(asset).catch(() => {});
  }
}

// Global Singleton Export
export const assetService = new AssetService(eventBus);
export default assetService;
