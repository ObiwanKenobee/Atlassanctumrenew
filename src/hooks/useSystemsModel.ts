import { useState, useEffect, useCallback, useMemo } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import {
  SystemModel,
  Stock,
  Flow,
  Variable,
  CandidateIntervention,
  Scenario
} from '../types/systemsDynamics';
import {
  SystemsDynamicsEngine,
  SimulationResult,
  SimulationOptions
} from '../services/systemsDynamicsEngine';
import {
  InterventionLibraryService,
  EnergyInterventionDefinition
} from '../services/interventionLibrary';
import { CANONICAL_MATHARE_SYSTEM_MODEL } from '../data/systemsDynamicsData';

const LOCAL_STORAGE_CACHE_KEY_PREFIX = 'atlas_systems_model_cache_';
const LAST_ACTIVE_MODEL_ID_KEY = 'atlas_active_systems_model_id';

/**
 * Canonical Regional Energy Infrastructure Model
 * Primary demonstration vertical for Hackathon & Bioregional Microgrid Commons
 */
export const CANONICAL_REGIONAL_ENERGY_MODEL: SystemModel = {
  id: 'model-regional-energy-commons-v1',
  version: 'v1.4-calibrated',
  name: 'Regional Energy Infrastructure & Decentralized Storage Commons',
  bioregionOrDomain: 'Nairobi River Basin & Urban Settlement Microgrid Mesh',
  timeHorizonMonths: 24,
  timeStepUnit: 'months',
  timeStepDuration: 1,
  entities: [
    'Solar Photovoltaic Generation Arrays',
    'Lithium-Iron-Phosphate Battery Storage Buffer (BESS)',
    'Agricultural Produce Cold Storage Hubs',
    'Distribution Transformer Substation Nodes',
    'Retained Community Wealth Commons',
    'Youth Microgrid Maintenance Guild',
    'Riparian Agrivoltaic Bio-Swales',
    'Municipal Utility Grid Ingress'
  ],
  stocks: [
    {
      id: 'stock-clean-energy-generation',
      name: 'Decentralized Clean Solar Power Capacity',
      category: 'manufactured',
      unit: 'kW Peak',
      currentValue: 45.0,
      initialValue: 45.0,
      minimumCapacity: 10.0,
      maximumCapacity: 350.0,
      inflowRate: 3.5,
      outflowRate: 0.8,
      inflowIds: ['flow-solar-generation-inflow', 'flow-agrivoltaic-expansion'],
      outflowIds: ['flow-pv-degradation-loss'],
      epistemicStatus: 'Observed',
      confidence: 96,
      evidenceIds: ['ev-satellite-pv-radiance', 'ev-smart-meter-mesh'],
      description: 'Distributed rooftop, cold-hub, and riparian canopy solar PV generation capacity actively synchronized to the settlement microgrid.'
    },
    {
      id: 'stock-battery-storage-buffer',
      name: 'Battery Energy Storage Buffer (BESS)',
      category: 'manufactured',
      unit: 'kWh Buffer Capacity',
      currentValue: 120.0,
      initialValue: 120.0,
      minimumCapacity: 20.0,
      maximumCapacity: 800.0,
      inflowRate: 14.0,
      outflowRate: 12.5,
      inflowIds: ['flow-bess-charging-inflow'],
      outflowIds: ['flow-bess-discharging-demand', 'flow-parasitic-loss'],
      epistemicStatus: 'Observed',
      confidence: 94,
      evidenceIds: ['ev-bess-telemetry-node'],
      description: 'Centralized and modular LFP battery storage banks providing diurnal peak-shaving and backup cold chain power during blackout events.'
    },
    {
      id: 'stock-produce-cold-storage',
      name: 'Agricultural Produce Cold Storage Throughput',
      category: 'manufactured',
      unit: 'Metric Tons / Day',
      currentValue: 18.5,
      initialValue: 18.5,
      minimumCapacity: 2.0,
      maximumCapacity: 85.0,
      inflowRate: 4.2,
      outflowRate: 0.9,
      inflowIds: ['flow-cold-storage-intake'],
      outflowIds: ['flow-produce-spoilage-leakage'],
      epistemicStatus: 'Observed',
      confidence: 93,
      evidenceIds: ['ev-market-trader-intake'],
      description: 'Temperature-controlled preservation buffer preventing post-harvest decay for 180 local market produce vendors.'
    },
    {
      id: 'stock-local-capital-retained',
      name: 'Community Retained Capital Commons',
      category: 'financial',
      unit: 'USD Equiv ($)',
      currentValue: 240000,
      initialValue: 240000,
      minimumCapacity: 25000,
      maximumCapacity: 3000000,
      inflowRate: 28000,
      outflowRate: 36000,
      inflowIds: ['flow-market-vendor-revenue', 'flow-p2p-tariff-retention'],
      outflowIds: ['flow-external-diesel-drain', 'flow-monopoly-grid-remittance'],
      epistemicStatus: 'Model Inference',
      confidence: 91,
      evidenceIds: ['ev-coop-treasury-ledger'],
      description: 'Capital circulating within the informal settlement economy preserved by eliminating expensive diesel generator fuel and spoil loss.'
    },
    {
      id: 'stock-riparian-soil-carbon',
      name: 'Riparian Soil Carbon & Biochar Sponge',
      category: 'natural',
      unit: 'Metric Tons Carbon',
      currentValue: 3450,
      initialValue: 3450,
      minimumCapacity: 1000,
      maximumCapacity: 12000,
      inflowRate: 120,
      outflowRate: 190,
      inflowIds: ['flow-biochar-pyrolysis-soil-injection'],
      outflowIds: ['flow-monsoon-bank-erosion'],
      epistemicStatus: 'Observed',
      confidence: 95,
      evidenceIds: ['ev-soil-spectroscopy-sensor'],
      description: 'Soil organic matter density along the river corridor stabilized with pyrolyzed agricultural waste to retain moisture and resist scouring.'
    },
    {
      id: 'stock-institutional-trust',
      name: 'Participatory Governance Trust Index',
      category: 'social',
      unit: 'Index (0-100)',
      currentValue: 62.0,
      initialValue: 62.0,
      minimumCapacity: 10.0,
      maximumCapacity: 100.0,
      inflowRate: 3.2,
      outflowRate: 2.4,
      inflowIds: ['flow-commons-council-consensus'],
      outflowIds: ['flow-curtailment-dispute-drain'],
      epistemicStatus: 'User Provided',
      confidence: 92,
      evidenceIds: ['ev-clan-survey-audits'],
      description: 'Confidence rating among informal settlement elders, market cooperatives, and youth guilds in the equity of automated energy dispatch.'
    }
  ],
  flows: [
    {
      id: 'flow-solar-generation-inflow',
      name: 'Solar PV Inflow Rate',
      targetStockId: 'stock-clean-energy-generation',
      rateEquation: 'var_solar_irradiance * 8.5',
      currentRate: 8.5,
      unit: 'kW / mo',
      delayPeriods: 0,
      isRegulated: true,
      controllingVariableIds: ['var-solar-irradiance-factor'],
      epistemicStatus: 'Observed',
      confidence: 96,
      description: 'Installation and commissioning rate of new rooftop and canopy solar arrays.'
    },
    {
      id: 'flow-pv-degradation-loss',
      name: 'Solar PV Degradation Rate',
      sourceStockId: 'stock-clean-energy-generation',
      rateEquation: '0.015 * stock_clean_energy_generation',
      currentRate: 0.7,
      unit: 'kW / mo',
      delayPeriods: 0,
      isRegulated: false,
      controllingVariableIds: [],
      epistemicStatus: 'Model Inference',
      confidence: 98,
      description: 'Thermal, dust, and optical degradation of operational photovoltaic cells.'
    },
    {
      id: 'flow-bess-charging-inflow',
      name: 'BESS Battery Net Inflow',
      targetStockId: 'stock-battery-storage-buffer',
      rateEquation: '0.35 * stock_clean_energy_generation * var_battery_cycle_eff',
      currentRate: 14.0,
      unit: 'kWh / mo',
      delayPeriods: 0,
      isRegulated: true,
      controllingVariableIds: ['var-battery-cycle-efficiency'],
      epistemicStatus: 'Observed',
      confidence: 95,
      description: 'Mid-day surplus solar energy diverted to storage buffers.'
    },
    {
      id: 'flow-bess-discharging-demand',
      name: 'Evening Cold Chain Dispatch',
      sourceStockId: 'stock-battery-storage-buffer',
      rateEquation: '0.85 * stock_produce_cold_storage',
      currentRate: 12.5,
      unit: 'kWh / mo',
      delayPeriods: 0,
      isRegulated: true,
      controllingVariableIds: [],
      epistemicStatus: 'Observed',
      confidence: 94,
      description: 'Discharge to maintain 4°C vegetable cooling during peak evening electricity rates.'
    },
    {
      id: 'flow-market-vendor-revenue',
      name: 'Cold Chain Vendor Surplus Retention',
      targetStockId: 'stock-local-capital-retained',
      rateEquation: 'stock_produce_cold_storage * 1250 * (1 - var_post_harvest_loss)',
      currentRate: 21500,
      unit: 'USD / mo',
      delayPeriods: 1,
      isRegulated: true,
      controllingVariableIds: ['var-post-harvest-loss-fraction'],
      epistemicStatus: 'Model Inference',
      confidence: 92,
      description: 'Direct economic savings retained by market women from zero food rot.'
    },
    {
      id: 'flow-biochar-pyrolysis-soil-injection',
      name: 'Biochar Riverbank Application',
      targetStockId: 'stock-riparian-soil-carbon',
      rateEquation: 'stock_produce_cold_storage * 12.0',
      currentRate: 140,
      unit: 'Tons Carbon / mo',
      delayPeriods: 2,
      isRegulated: true,
      controllingVariableIds: [],
      epistemicStatus: 'Observed',
      confidence: 94,
      description: 'Conversion of vegetable trimming waste into recalcitrant biochar.'
    }
  ],
  variables: [
    {
      id: 'var-solar-irradiance-factor',
      name: 'Seasonal Solar Irradiance Multiplier',
      category: 'exogenous_driver',
      value: 1.0,
      unit: 'Multiplier (0.5 - 2.5)',
      min: 0.5,
      max: 2.5,
      step: 0.05,
      isControllableByIntervention: false,
      epistemicStatus: 'Observed',
      confidence: 98,
      description: 'Regional solar insolation variation across wet and dry seasons.'
    },
    {
      id: 'var-battery-cycle-efficiency',
      name: 'Battery Round-Trip Efficiency',
      category: 'intermediate_converter',
      value: 0.91,
      unit: 'Efficiency Ratio (0 - 1.0)',
      min: 0.7,
      max: 0.98,
      step: 0.01,
      isControllableByIntervention: true,
      epistemicStatus: 'Observed',
      confidence: 96,
      description: 'Inverter and cell coulombic efficiency in warm micro-climates.'
    },
    {
      id: 'var-post-harvest-loss-fraction',
      name: 'Produce Spoilage Fraction',
      category: 'kpi_indicator',
      value: 0.34, // 34% baseline
      unit: 'Loss Fraction (0 - 0.60)',
      min: 0.02,
      max: 0.6,
      step: 0.01,
      isControllableByIntervention: true,
      epistemicStatus: 'Observed',
      confidence: 95,
      description: 'Fraction of perishable produce ruined before sale without cold storage.'
    },
    {
      id: 'var-local-revenue-retention-rate',
      name: 'P2P Microgrid Tariff Retention Rate',
      category: 'policy_knob',
      value: 0.72,
      unit: 'Fraction (0 - 1.0)',
      min: 0.2,
      max: 1.0,
      step: 0.02,
      isControllableByIntervention: true,
      epistemicStatus: 'Model Inference',
      confidence: 90,
      description: 'Percentage of electricity tariff revenue kept inside settlement treasury.'
    }
  ],
  relationships: [
    {
      id: 'rel-solar-to-cold-storage',
      sourceEntityId: 'stock-clean-energy-generation',
      sourceName: 'Solar Generation Capacity',
      targetEntityId: 'stock-produce-cold-storage',
      targetName: 'Produce Cold Storage Buffer',
      polarity: '+',
      causalDoCoefficient: 0.78,
      delayPeriods: 1,
      mechanismExplanation: 'Expanded solar capacity enables continuous refrigeration pods without costly diesel backup.',
      sourceAttribution: 'UNEP Urban Energy Resiliency Study',
      confidence: 94
    },
    {
      id: 'rel-cold-storage-to-capital',
      sourceEntityId: 'stock-produce-cold-storage',
      sourceName: 'Produce Cold Storage Buffer',
      targetEntityId: 'stock-local-capital-retained',
      targetName: 'Retained Capital Commons',
      polarity: '+',
      causalDoCoefficient: 0.84,
      delayPeriods: 2,
      mechanismExplanation: 'Elimination of spoilage preserves vendor profit margins, enabling cooperative reinvestment.',
      sourceAttribution: 'Mathare Market Women Cooperative Audit',
      confidence: 93
    },
    {
      id: 'rel-capital-to-soil-carbon',
      sourceEntityId: 'stock-local-capital-retained',
      sourceName: 'Retained Capital Commons',
      targetEntityId: 'stock-riparian-soil-carbon',
      targetName: 'Riparian Soil Carbon & Sponge',
      polarity: '+',
      causalDoCoefficient: 0.62,
      delayPeriods: 3,
      mechanismExplanation: 'Community treasury funds youth biochar and riparian vetiver planting programs.',
      sourceAttribution: 'Bioregional Ecology Field Survey',
      confidence: 91
    }
  ],
  feedbackLoops: [
    {
      id: 'loop-r2-solar-commons-multiplier',
      name: 'Reinforcing Loop R2: Solar Cold-Chain & Local Wealth Multiplier',
      type: 'reinforcing',
      loopNodes: [
        'stock-clean-energy-generation',
        'stock-produce-cold-storage',
        'stock-local-capital-retained',
        'stock-riparian-soil-carbon',
        'stock-institutional-trust'
      ],
      narrative: 'Clean solar power powers cold storage -> reduces produce spoilage -> increases vendor profits -> expands community treasury -> finances additional solar microgrid capacity & riparian biochar stabilization.',
      dominantTimeHorizon: '6-24 months',
      leverageScore: 9,
      activeStrength: 0.88
    },
    {
      id: 'loop-b1-battery-degradation-balancing',
      name: 'Balancing Loop B1: Thermal Battery Capacity Saturation',
      type: 'balancing',
      loopNodes: [
        'stock-battery-storage-buffer',
        'flow-bess-discharging-demand',
        'flow-pv-degradation-loss'
      ],
      narrative: 'Higher battery cycling increases thermal wear, stabilizing buffer expansion within physical replacement rate.',
      dominantTimeHorizon: '12-36 months',
      leverageScore: 6,
      activeStrength: 0.64
    }
  ],
  constraints: [
    {
      id: 'const-solar-land-footprint',
      name: 'Settlement Rooftop & Canopy Max Capacity',
      entityId: 'stock-clean-energy-generation',
      type: 'carrying_capacity',
      thresholdValue: 350.0,
      unit: 'kW Peak',
      isHardLimit: true,
      description: 'Physical spatial roof surface area limit in Mathare Zone 4.'
    },
    {
      id: 'const-min-capital-liquidity',
      name: 'Treasury Minimum Emergency Liquidity',
      entityId: 'stock-local-capital-retained',
      type: 'physical_threshold',
      thresholdValue: 25000,
      unit: 'USD ($)',
      isHardLimit: true,
      description: 'Minimum emergency reserve before council halts discretionary expansion.'
    }
  ],
  assumptions: [
    {
      id: 'assump-solar-tariff-stability',
      statement: 'Grid interconnect net-metering tariff will remain steady at >= $0.09/kWh equivalent.',
      epistemicCategory: 'Model Inference',
      riskIfViolated: 'medium',
      validationMethod: 'Quarterly review with Kenya Energy Regulatory Commission',
      tested: true
    }
  ],
  modelHealth: {
    dataFreshness: 'Live (2h ago via IoT Mesh)',
    epistemicConfidence: 95,
    lastUpdated: new Date().toISOString(),
    versionAuthor: 'Atlas Systems Architecture Guild',
    validationStatus: 'calibrated'
  }
};

export interface UseSystemsModelReturn {
  model: SystemModel;
  activeInterventions: CandidateIntervention[];
  parameterOverrides: Record<string, number>;
  timeHorizonMonths: number;
  simulationResult: SimulationResult;
  isLoading: boolean;
  isSaving: boolean;
  isOnline: boolean;
  availableInterventions: EnergyInterventionDefinition[];
  updateVariable: (variableId: string, value: number) => void;
  toggleIntervention: (intervention: CandidateIntervention) => void;
  clearInterventions: () => void;
  setTimeHorizon: (months: number) => void;
  resetToBaseline: () => void;
  saveModelToCloud: (customName?: string) => Promise<boolean>;
  loadModel: (modelId: string) => Promise<boolean>;
  runEulerSimulation: (options?: Partial<SimulationOptions>) => SimulationResult;
}

export function useSystemsModel(initialModelId?: string): UseSystemsModelReturn {
  const defaultModel = CANONICAL_REGIONAL_ENERGY_MODEL;
  const [model, setModel] = useState<SystemModel>(defaultModel);
  const [activeInterventions, setActiveInterventions] = useState<CandidateIntervention[]>([]);
  const [parameterOverrides, setParameterOverrides] = useState<Record<string, number>>({});
  const [timeHorizonMonths, setTimeHorizonMonths] = useState<number>(24);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Available intervention catalog
  const availableInterventions = useMemo(() => {
    return InterventionLibraryService.getAllInterventions();
  }, []);

  // Synchronize network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load from local storage cache first for instant responsiveness
  useEffect(() => {
    try {
      const targetId = initialModelId || localStorage.getItem(LAST_ACTIVE_MODEL_ID_KEY) || defaultModel.id;
      const cached = localStorage.getItem(`${LOCAL_STORAGE_CACHE_KEY_PREFIX}${targetId}`);
      if (cached) {
        const parsed = JSON.parse(cached) as SystemModel;
        if (parsed && parsed.stocks && parsed.flows) {
          setModel(parsed);
        }
      }
    } catch {
      // Fall back to default
    }
  }, [initialModelId, defaultModel.id]);

  // Load model from Firestore if available
  useEffect(() => {
    if (!initialModelId || initialModelId === defaultModel.id) return;

    let isMounted = true;
    setIsLoading(true);

    const docRef = doc(db, 'system_models', initialModelId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (isMounted) {
          if (docSnap.exists()) {
            const data = docSnap.data() as SystemModel;
            setModel(data);
            try {
              localStorage.setItem(`${LOCAL_STORAGE_CACHE_KEY_PREFIX}${initialModelId}`, JSON.stringify(data));
              localStorage.setItem(LAST_ACTIVE_MODEL_ID_KEY, initialModelId);
            } catch {
              // Ignore cache write errors
            }
          }
          setIsLoading(false);
        }
      },
      () => {
        if (isMounted) setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [initialModelId, defaultModel.id]);

  // Cached, instant Euler simulation computation (60fps parameter tuning)
  const simulationResult = useMemo<SimulationResult>(() => {
    return SystemsDynamicsEngine.runEulerSimulation(model, {
      timeHorizonMonths,
      timeStepMonths: 1.0,
      parameterOverrides,
      activeInterventions
    });
  }, [model, timeHorizonMonths, parameterOverrides, activeInterventions]);

  // Update a single parameter/variable with 0 latency
  const updateVariable = useCallback((variableId: string, value: number) => {
    setParameterOverrides((prev) => ({
      ...prev,
      [variableId]: value
    }));
  }, []);

  // Toggle candidate intervention on/off
  const toggleIntervention = useCallback((intervention: CandidateIntervention) => {
    setActiveInterventions((prev) => {
      const exists = prev.some((i) => i.id === intervention.id);
      if (exists) {
        return prev.filter((i) => i.id !== intervention.id);
      } else {
        return [...prev, intervention];
      }
    });
  }, []);

  // Clear all interventions back to baseline
  const clearInterventions = useCallback(() => {
    setActiveInterventions([]);
    setParameterOverrides({});
  }, []);

  // Reset entire state back to model baseline
  const resetToBaseline = useCallback(() => {
    setActiveInterventions([]);
    setParameterOverrides({});
    setTimeHorizonMonths(24);
  }, []);

  // Save current model configuration and calibration to Firestore and local cache
  const saveModelToCloud = useCallback(
    async (customName?: string): Promise<boolean> => {
      setIsSaving(true);
      try {
        const modelToSave: SystemModel = {
          ...model,
          name: customName || model.name,
          timeHorizonMonths,
          modelHealth: {
            ...model.modelHealth,
            lastUpdated: new Date().toISOString()
          }
        };

        // 1. Write to local cache immediately
        localStorage.setItem(
          `${LOCAL_STORAGE_CACHE_KEY_PREFIX}${modelToSave.id}`,
          JSON.stringify(modelToSave)
        );
        localStorage.setItem(LAST_ACTIVE_MODEL_ID_KEY, modelToSave.id);

        // 2. Persist to Firestore
        const docRef = doc(db, 'system_models', modelToSave.id);
        await setDoc(docRef, modelToSave, { merge: true });

        setModel(modelToSave);
        setIsSaving(false);
        return true;
      } catch (err) {
        console.error('Failed to persist SystemModel to Firestore:', err);
        setIsSaving(false);
        return false;
      }
    },
    [model, timeHorizonMonths]
  );

  // Load a different model by ID
  const loadModel = useCallback(async (modelId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (modelId === CANONICAL_REGIONAL_ENERGY_MODEL.id) {
        setModel(CANONICAL_REGIONAL_ENERGY_MODEL);
        setIsLoading(false);
        return true;
      }
      if (modelId === CANONICAL_MATHARE_SYSTEM_MODEL.id) {
        setModel(CANONICAL_MATHARE_SYSTEM_MODEL);
        setIsLoading(false);
        return true;
      }

      // Check local cache
      const cached = localStorage.getItem(`${LOCAL_STORAGE_CACHE_KEY_PREFIX}${modelId}`);
      if (cached) {
        const parsed = JSON.parse(cached) as SystemModel;
        setModel(parsed);
      }

      // Fetch from Firestore
      const docRef = doc(db, 'system_models', modelId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as SystemModel;
        setModel(data);
        localStorage.setItem(`${LOCAL_STORAGE_CACHE_KEY_PREFIX}${modelId}`, JSON.stringify(data));
        localStorage.setItem(LAST_ACTIVE_MODEL_ID_KEY, modelId);
      }
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  }, []);

  // Run custom simulation with ad-hoc options
  const runEulerSimulation = useCallback(
    (options?: Partial<SimulationOptions>): SimulationResult => {
      return SystemsDynamicsEngine.runEulerSimulation(model, {
        timeHorizonMonths: options?.timeHorizonMonths ?? timeHorizonMonths,
        timeStepMonths: options?.timeStepMonths ?? 1.0,
        parameterOverrides: options?.parameterOverrides ?? parameterOverrides,
        activeInterventions: options?.activeInterventions ?? activeInterventions,
        stochasticNoise: options?.stochasticNoise,
        noiseMagnitude: options?.noiseMagnitude
      });
    },
    [model, timeHorizonMonths, parameterOverrides, activeInterventions]
  );

  return {
    model,
    activeInterventions,
    parameterOverrides,
    timeHorizonMonths,
    simulationResult,
    isLoading,
    isSaving,
    isOnline,
    availableInterventions,
    updateVariable,
    toggleIntervention,
    clearInterventions,
    setTimeHorizon: setTimeHorizonMonths,
    resetToBaseline,
    saveModelToCloud,
    loadModel,
    runEulerSimulation
  };
}
