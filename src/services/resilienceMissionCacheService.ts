import { offlineStorage } from '../lib/indexedDbStorage';

export interface CriticalMissionItem {
  id: string;
  title: string;
  codeName: string;
  bioregion: string;
  coordinates: [number, number];
  priorityLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  objective: string;
  offlineProtocols: string[];
  sensorThresholds: Record<string, string>;
  radioFrequencyMhz: number;
  fieldSteps: {
    stepNumber: number;
    description: string;
    offlineVerificationMethod: string;
  }[];
  zkpMerkleRoot: string;
  cachedAt: number;
}

export const CRITICAL_FIELD_MISSIONS: CriticalMissionItem[] = [
  {
    id: 'mission-turkana-aquifer-01',
    title: 'Lotikipi Basin Deep Aquifer Infiltration Cascade',
    codeName: 'OP-AQUIFER-TURKANA',
    bioregion: 'Turkana Depression',
    coordinates: [3.85, 35.82],
    priorityLevel: 'CRITICAL',
    objective: 'Prevent deep sand-lens salinization and recharge secondary swale cascade prior to flash inundation.',
    offlineProtocols: [
      'Deploy handheld galvanic electrical conductivity (EC) probe at borehole head.',
      'Log soil moisture gradient at 30cm, 60cm, and 120cm depth intervals.',
      'If EC exceeds 2,500 uS/cm, engage mechanical sediment bypass gate.'
    ],
    sensorThresholds: {
      'Max EC Salinity': '2,400 uS/cm',
      'Infiltration Rate Target': '> 45 mm/hr',
      'Turbidity Safe Floor': '< 15 NTU'
    },
    radioFrequencyMhz: 147.450,
    fieldSteps: [
      { stepNumber: 1, description: 'Inspect weir spillway concrete apron for hydraulic scour', offlineVerificationMethod: 'Optical gauge card measurement' },
      { stepNumber: 2, description: 'Clear organic blockage from secondary silt screen mesh', offlineVerificationMethod: 'Manual clearance with photo hash' },
      { stepNumber: 3, description: 'Calibrate piezo-resistive water depth sensor', offlineVerificationMethod: 'Zero-point resistor bridge test' }
    ],
    zkpMerkleRoot: '0x8f3c7e01b14a22e89d194c',
    cachedAt: Date.now()
  },
  {
    id: 'mission-mau-podocarpus-02',
    title: 'Mau Forest Western Podocarpus Buffer Defense',
    codeName: 'OP-CANOPY-MAU',
    bioregion: 'Rift Valley Highlands',
    coordinates: [-0.45, 35.65],
    priorityLevel: 'CRITICAL',
    objective: 'Ground-truth canopy leaf moisture stress and secure indigenous Podocarpus seedlings against perimeter encroachment.',
    offlineProtocols: [
      'Conduct 100m transect drone multispectral pass under canopy gaps.',
      'Record leaf water potential via portable pressure chamber.',
      'Inspect solar radio acoustic sensor perimeter traps.'
    ],
    sensorThresholds: {
      'NDVI Stress Floor': '> 0.68',
      'Canopy Moisture Content': '> 58%',
      'Acoustic Chainsaw Alarm': '< 42 dB ambient'
    },
    radioFrequencyMhz: 154.600,
    fieldSteps: [
      { stepNumber: 1, description: 'Verify perimeter boundary beacons via offline GNSS', offlineVerificationMethod: 'RTK centimeter fixed solution' },
      { stepNumber: 2, description: 'Inspect 50 podocarpus sapling moisture collars', offlineVerificationMethod: 'Capacitive probe test' },
      { stepNumber: 3, description: 'Synchronize LoRaWAN sensor repeater battery status', offlineVerificationMethod: 'Local BLE diagnostic beacon' }
    ],
    zkpMerkleRoot: '0x3a92b98871e04cf82901a1',
    cachedAt: Date.now()
  },
  {
    id: 'mission-loita-wildfire-03',
    title: 'Loita Hills Wildfire Interceptor & Hydrated Firebreak',
    codeName: 'OP-FLAME-LOITA',
    bioregion: 'Narok South Ecosystem',
    coordinates: [-1.58, 35.88],
    priorityLevel: 'CRITICAL',
    objective: 'Establish biochar hydrated containment perimeter to protect ancient sacred cedar groves from advancing thermal front.',
    offlineProtocols: [
      'Activate gravity-fed spring misting manifold along firebreak crest.',
      'Monitor FLIR thermal camera battery banks and optical lens clarity.',
      'Log wind velocity and relative humidity every 15 minutes.'
    ],
    sensorThresholds: {
      'Soil Surface Temp Limit': '< 48°C',
      'Relative Humidity Floor': '> 22%',
      'Fuel Moisture Index': '> 14%'
    },
    radioFrequencyMhz: 146.520,
    fieldSteps: [
      { stepNumber: 1, description: 'Test pressure on high-altitude spring gravity line', offlineVerificationMethod: 'Mechanical dial gauge check' },
      { stepNumber: 2, description: 'Clear 15-meter dead brush swathe along ridge line', offlineVerificationMethod: 'Physical surveyor chain verification' },
      { stepNumber: 3, description: 'Prime foam fire-retardant backpack canisters', offlineVerificationMethod: 'Pressure relief valve seal check' }
    ],
    zkpMerkleRoot: '0x7e2249fb02c4819d45e90a',
    cachedAt: Date.now()
  },
  {
    id: 'mission-nyando-flood-04',
    title: 'Nyando Catchment Silt Dam & Levee Integrity Verification',
    codeName: 'OP-SURGE-NYANDO',
    bioregion: 'Lake Victoria Basin',
    coordinates: [-0.18, 34.92],
    priorityLevel: 'HIGH',
    objective: 'Verify riparian levee structural integrity and prevent silt blowout into Lake Victoria fish breeding zones.',
    offlineProtocols: [
      'Deploy portable turbidity optical meter at 4 river confluence junctions.',
      'Inspect vetiver grass stabilization root depth on river cut-banks.',
      'Verify radio early-warning flood siren batteries.'
    ],
    sensorThresholds: {
      'River Discharge Speed': '< 3.2 m/s',
      'Suspended Silt PPM': '< 350 ppm',
      'Levee Saturation Index': '< 80%'
    },
    radioFrequencyMhz: 148.125,
    fieldSteps: [
      { stepNumber: 1, description: 'Survey levee crown for differential subsidence', offlineVerificationMethod: 'Laser level transit measurement' },
      { stepNumber: 2, description: 'Measure vetiver grass root tension resistance', offlineVerificationMethod: 'Pull-gauge dynamometer assay' }
    ],
    zkpMerkleRoot: '0x4c1192aae93b102847ff5b',
    cachedAt: Date.now()
  },
  {
    id: 'mission-kulal-oasis-05',
    title: 'Mount Kulal Cloud Biosphere Spring Source Protection',
    codeName: 'OP-OASIS-KULAL',
    bioregion: 'Marsabit Highlands Oasis',
    coordinates: [2.72, 36.92],
    priorityLevel: 'HIGH',
    objective: 'Safeguard mist-capturing moss carpets and perennial mountain spring heads from drought-induced grazing intrusion.',
    offlineProtocols: [
      'Check solar perimeter electric fencing energizer voltage.',
      'Log spring head volumetric flow rate using calibrated container method.',
      'Perform rapid microbiological water test strip inspection.'
    ],
    sensorThresholds: {
      'Fence Energizer Voltage': '> 6,000 V',
      'Discharge Flow Rate': '> 1.8 L/s',
      'Water Coliform Count': '0 CFU/100ml'
    },
    radioFrequencyMhz: 151.820,
    fieldSteps: [
      { stepNumber: 1, description: 'Check spring infiltration springbox seal for silt ingress', offlineVerificationMethod: 'Direct visual and depth measurement' },
      { stepNumber: 2, description: 'Verify moss canopy dew condenser collection screens', offlineVerificationMethod: 'Condensation weight yield log' }
    ],
    zkpMerkleRoot: '0x44aadd1987bf23910c2394',
    cachedAt: Date.now()
  }
];

const RESILIENCE_STORAGE_KEY = 'atlas_resilience_mode_active';
const RESILIENCE_META_KEY = 'atlas_resilience_mode_meta';

export class ResilienceMissionCacheService {
  private static isInitialized = false;

  public static isResilienceModeActive(): boolean {
    try {
      return localStorage.getItem(RESILIENCE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  public static async enableResilienceMode(): Promise<{
    cachedMissionsCount: number;
    cachedProtocolsCount: number;
    bytesCached: number;
  }> {
    try {
      localStorage.setItem(RESILIENCE_STORAGE_KEY, 'true');

      // 1. Write critical missions to IndexedDB
      await offlineStorage.cacheCollection('critical_missions', CRITICAL_FIELD_MISSIONS);

      // 2. Also cache individual mission documents for fast O(1) keyed access
      for (const m of CRITICAL_FIELD_MISSIONS) {
        await offlineStorage.cacheDocument('critical_missions', m.id, m);
      }

      // 3. Cache metadata
      const meta = {
        enabledAt: Date.now(),
        missionCount: CRITICAL_FIELD_MISSIONS.length,
        totalProtocols: CRITICAL_FIELD_MISSIONS.reduce((acc, m) => acc + m.offlineProtocols.length, 0),
        totalSteps: CRITICAL_FIELD_MISSIONS.reduce((acc, m) => acc + m.fieldSteps.length, 0),
        status: 'OFFLINE_READY_SECURED'
      };

      await offlineStorage.cacheDocument('resilience_meta', 'current_session', meta);
      localStorage.setItem(RESILIENCE_META_KEY, JSON.stringify(meta));

      // Calculate approximate bytes
      const jsonStr = JSON.stringify(CRITICAL_FIELD_MISSIONS);
      const bytes = new Blob([jsonStr]).size;

      // Broadcast global event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('atlas-resilience-mode-toggled', {
          detail: { enabled: true, meta }
        }));
      }

      return {
        cachedMissionsCount: CRITICAL_FIELD_MISSIONS.length,
        cachedProtocolsCount: meta.totalProtocols,
        bytesCached: bytes
      };
    } catch (err) {
      console.error('Failed to enable Resilience Mode in IndexedDB:', err);
      throw err;
    }
  }

  public static async disableResilienceMode(): Promise<void> {
    try {
      localStorage.setItem(RESILIENCE_STORAGE_KEY, 'false');
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('atlas-resilience-mode-toggled', {
          detail: { enabled: false }
        }));
      }
    } catch (e) {
      console.warn('Error disabling resilience mode:', e);
    }
  }

  public static async getCachedMissions(): Promise<CriticalMissionItem[]> {
    try {
      const docs = await offlineStorage.getCachedCollection('critical_missions');
      if (docs && docs.length > 0) {
        return docs as CriticalMissionItem[];
      }
    } catch (err) {
      console.warn('Could not read from IndexedDB, returning fallback critical missions:', err);
    }
    return CRITICAL_FIELD_MISSIONS;
  }

  public static async getCacheStatus(): Promise<{
    isActive: boolean;
    missionCount: number;
    lastCachedAt: number | null;
    storageSizeKb: number;
  }> {
    const isActive = this.isResilienceModeActive();
    try {
      const missions = await this.getCachedMissions();
      const metaDoc = await offlineStorage.getCachedDoc('resilience_meta', 'current_session');
      const sizeBytes = new Blob([JSON.stringify(missions)]).size;
      return {
        isActive,
        missionCount: missions.length,
        lastCachedAt: metaDoc?.updatedAt || (isActive ? Date.now() : null),
        storageSizeKb: Math.round(sizeBytes / 1024)
      };
    } catch {
      return {
        isActive,
        missionCount: CRITICAL_FIELD_MISSIONS.length,
        lastCachedAt: isActive ? Date.now() : null,
        storageSizeKb: 14
      };
    }
  }
}
