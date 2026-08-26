/**
 * ATLAS SANCTUM — Intervention Library Service
 * 
 * Pre-defined high-leverage interventions for the Regional Energy Infrastructure & Commons Model.
 * Cataloged according to Donella Meadows 12 Leverage Points hierarchy.
 */

import { CandidateIntervention, LeverageLevel, SystemModel } from '../types/systemsDynamics';

export interface EnergyInterventionDefinition extends CandidateIntervention {
  category: 'generation' | 'storage_buffer' | 'grid_resilience' | 'market_rules' | 'governance_paradigms';
  shortTagline: string;
  effectivenessCoefficients: {
    cleanEnergyGenerationMultiplier?: number;
    storageCapacityMultiplier?: number;
    gridStressDampingFactor?: number;
    localWealthRetentionRate?: number;
    carbonAbatementMultiplier?: number;
    reversibilityMonths?: number;
  };
  affectedStockIds: string[];
  affectedFlowIds: string[];
  affectedVariableIds: string[];
  invalidationTriggers: string[];
  recommendedDeploymentSequence: number;
}

export const REGIONAL_ENERGY_INTERVENTION_LIBRARY: EnergyInterventionDefinition[] = [
  {
    id: 'int-solar-cold-chain-biochar',
    targetEntityId: 'stock-clean-energy-generation',
    targetName: 'Decentralized Solar-BESS Cold Chain Hubs & Biochar Pyrolysis Loop',
    shortTagline: 'Modular 15kW solar-battery cold hubs preventing 34% crop spoilage with pyrolysis biochar soil injection',
    category: 'storage_buffer',
    mechanism: 'Deploys 6 community-owned 15 kW solar microgrid cold storage pods for 180 market women vendors; biochar units convert market waste into soil conditioner for riverbank stabilization.',
    costUsd: 480000,
    timeHorizonMonths: 18,
    expectedOutcome: '+44.5% Flourishing Index, 1,850 youth livelihoods, 92% post-harvest produce preservation',
    flourishingDelta: 44.5,
    systemDependencies: [
      'Nairobi County market trading permits',
      'Community solar land tenure agreements',
      'Local youth technician certification'
    ],
    reversibility: 'fully_reversible',
    risks: [
      'Battery inverter supply chain delays',
      'Rainy season solar irradiance dips'
    ],
    unintendedConsequences: [
      'Increased market vendor immigration to Mathare hub',
      'Peak mid-day grid surplus requiring curtailment protocol'
    ],
    confidence: 94,
    leverageRank: 3, // Meadows #3: Rules of the system & information flows
    meadowsTier: 'rules_information_flows',
    effectivenessCoefficients: {
      cleanEnergyGenerationMultiplier: 2.1,
      storageCapacityMultiplier: 2.4,
      gridStressDampingFactor: 0.35,
      localWealthRetentionRate: 0.88,
      carbonAbatementMultiplier: 2.2,
      reversibilityMonths: 3
    },
    affectedStockIds: [
      'stock-clean-energy-generation',
      'stock-battery-storage-buffer',
      'stock-local-capital-retained',
      'stock-riparian-soil-carbon'
    ],
    affectedFlowIds: [
      'flow-solar-generation-inflow',
      'flow-cold-storage-retention',
      'flow-market-vendor-revenue'
    ],
    affectedVariableIds: [
      'var-solar-irradiance-factor',
      'var-battery-cycle-efficiency',
      'var-post-harvest-loss-fraction'
    ],
    invalidationTriggers: [
      'Lithium-iron-phosphate battery cost spike > 40%',
      'Grid connection tariff renegotiated unfavorably'
    ],
    recommendedDeploymentSequence: 1
  },
  {
    id: 'int-peer-to-peer-cooperative-tariff',
    targetEntityId: 'stock-local-capital-retained',
    targetName: 'Dynamic P2P Cooperative Microgrid Tariff & Tokenized Net-Metering',
    shortTagline: 'Local settlement-level energy barter clearinghouse ensuring 85% of power expenditure stays within community',
    category: 'market_rules',
    mechanism: 'Enables real-time peer-to-peer solar power sharing between household solar systems and agro-processing cold hubs using transparent algorithmic pricing.',
    costUsd: 125000,
    timeHorizonMonths: 12,
    expectedOutcome: '+$380k community-retained capital, 0% non-technical transmission losses, 64% lower energy bills for low-income homes',
    flourishingDelta: 31.8,
    systemDependencies: [
      'Smart meter mesh connectivity',
      'Bioregional Energy Commons Charter ratification'
    ],
    reversibility: 'fully_reversible',
    risks: [
      'Mobile network outages in informal settlement zones',
      'Disputes during unexpected curtailment events'
    ],
    unintendedConsequences: [
      'Rapid private battery installation without safety inspection'
    ],
    confidence: 89,
    leverageRank: 2, // Meadows #2: Self-organization rules
    meadowsTier: 'rules_information_flows',
    effectivenessCoefficients: {
      localWealthRetentionRate: 0.92,
      gridStressDampingFactor: 0.4,
      reversibilityMonths: 1
    },
    affectedStockIds: [
      'stock-local-capital-retained',
      'stock-institutional-trust'
    ],
    affectedFlowIds: [
      'flow-community-energy-barter',
      'flow-utility-tariff-drain'
    ],
    affectedVariableIds: [
      'var-local-revenue-retention-rate',
      'var-p2p-trading-adoption-fraction'
    ],
    invalidationTriggers: [
      'National utility monopoly enforces anti-islanding ban',
      'Smart meter failure rate exceeds 15%'
    ],
    recommendedDeploymentSequence: 2
  },
  {
    id: 'int-iot-grid-frequency-mesh',
    targetEntityId: 'stock-grid-stability-buffer',
    targetName: 'Autonomous IoT Smart Inverter Mesh & Demand-Response Balancing',
    shortTagline: 'Sub-second edge frequency regulation preventing brownouts across 12,000 settlement connections',
    category: 'grid_resilience',
    mechanism: 'Installs smart solid-state edge gateway controllers at distribution transformers to automatically throttle non-critical thermal and water pumping loads during peak grid stress.',
    costUsd: 210000,
    timeHorizonMonths: 9,
    expectedOutcome: '-78% blackout duration, +22 MW/yr virtual power capacity, zero transformer blowouts',
    flourishingDelta: 28.4,
    systemDependencies: [
      'Transformer telemetry access',
      'Edge gateway firmware deployment'
    ],
    reversibility: 'partially_reversible',
    risks: [
      'Legacy transformer mechanical switch failure',
      'Firmware synchronization edge latency'
    ],
    unintendedConsequences: [
      'Occasional brief delay in residential water heater cycling'
    ],
    confidence: 96,
    leverageRank: 5, // Meadows #5: Negative feedback loops & delays
    meadowsTier: 'delays_feedback_gains',
    effectivenessCoefficients: {
      gridStressDampingFactor: 0.22,
      storageCapacityMultiplier: 1.3,
      reversibilityMonths: 2
    },
    affectedStockIds: [
      'stock-clean-energy-generation',
      'stock-grid-stability-buffer'
    ],
    affectedFlowIds: [
      'flow-peak-demand-spike',
      'flow-transformer-thermal-stress'
    ],
    affectedVariableIds: [
      'var-peak-grid-loss-fraction',
      'var-inverter-response-latency-ms'
    ],
    invalidationTriggers: [
      'Primary substation lightning strike without surge protection'
    ],
    recommendedDeploymentSequence: 3
  },
  {
    id: 'int-agrivoltaic-riparian-sponge',
    targetEntityId: 'stock-riparian-soil-carbon',
    targetName: 'Bifacial Agro-photovoltaic Canopy & Riparian Sponge Wetlands',
    shortTagline: 'Elevated dual-use solar arrays shielding shade-tolerant high-value crops with stormwater bio-swales',
    category: 'generation',
    mechanism: 'Constructs 3.2 hectares of elevated bifacial solar canopies over organic vegetable nursery plots along the Mathare riparian buffer, combining 850 kW peak generation with micro-mist irrigation.',
    costUsd: 720000,
    timeHorizonMonths: 24,
    expectedOutcome: '+850 kW generation, +1,200 metric tons annual soil carbon increase, 4.2x vegetable crop yield per m²',
    flourishingDelta: 39.2,
    systemDependencies: [
      'Riparian boundary survey & demarcation',
      'Community river guardian consent'
    ],
    reversibility: 'partially_reversible',
    risks: [
      'Flash flood debris impact on solar canopy pylons',
      'Dust accumulation requiring automated wiper maintenance'
    ],
    unintendedConsequences: [
      'Micro-climate cooling reducing local evaporation losses'
    ],
    confidence: 92,
    leverageRank: 8, // Meadows #8: System structure & physical networks
    meadowsTier: 'structure_network',
    effectivenessCoefficients: {
      cleanEnergyGenerationMultiplier: 2.8,
      carbonAbatementMultiplier: 2.5,
      reversibilityMonths: 6
    },
    affectedStockIds: [
      'stock-clean-energy-generation',
      'stock-riparian-soil-carbon',
      'stock-youth-livelihoods'
    ],
    affectedFlowIds: [
      'flow-solar-generation-inflow',
      'flow-riparian-carbon-sequestration'
    ],
    affectedVariableIds: [
      'var-solar-irradiance-factor',
      'var-agrivoltaic-efficiency-boost'
    ],
    invalidationTriggers: [
      '100-year flood event exceeding 4.5m bank height'
    ],
    recommendedDeploymentSequence: 4
  },
  {
    id: 'int-bioregional-energy-commons-charter',
    targetEntityId: 'stock-institutional-trust',
    targetName: 'Bioregional Energy Commons Charter & Participatory Dispatch Council',
    shortTagline: 'Institutional paradigm shift conferring legal personhood and community stewardship rights over regional energy grid',
    category: 'governance_paradigms',
    mechanism: 'Constitutes an inter-clan and youth-led Energy Governance Council with algorithmic voting tokens that prioritize essential life-support loads (clinics, cold food, water pumps) over luxury extraction.',
    costUsd: 85000,
    timeHorizonMonths: 6,
    expectedOutcome: '100% community compliance, elimination of illegal tap hazards, +45% trust index',
    flourishingDelta: 48.0,
    systemDependencies: [
      'Council elder & youth assembly consensus'
    ],
    reversibility: 'fully_reversible',
    risks: [
      'Political co-optation by municipal ward politicians'
    ],
    unintendedConsequences: [
      'Rapid replication to neighboring Nairobi sub-counties'
    ],
    confidence: 97,
    leverageRank: 1, // Meadows #1: Power to transcend paradigms & system goals
    meadowsTier: 'goals_paradigms_transcendence',
    effectivenessCoefficients: {
      localWealthRetentionRate: 0.95,
      gridStressDampingFactor: 0.5,
      reversibilityMonths: 1
    },
    affectedStockIds: [
      'stock-institutional-trust',
      'stock-local-capital-retained'
    ],
    affectedFlowIds: [
      'flow-governance-cohesion-inflow',
      'flow-informal-loss-drain'
    ],
    affectedVariableIds: [
      'var-community-trust-multiplier'
    ],
    invalidationTriggers: [
      'Electoral violence or ward redistricting'
    ],
    recommendedDeploymentSequence: 5
  }
];

export class InterventionLibraryService {
  /**
   * Returns all available interventions
   */
  public static getAllInterventions(): EnergyInterventionDefinition[] {
    return [...REGIONAL_ENERGY_INTERVENTION_LIBRARY];
  }

  /**
   * Look up intervention by unique ID
   */
  public static getInterventionById(id: string): EnergyInterventionDefinition | undefined {
    return REGIONAL_ENERGY_INTERVENTION_LIBRARY.find((i) => i.id === id);
  }

  /**
   * Filter interventions by maximum budget constraint
   */
  public static filterByBudget(maxBudgetUsd: number): EnergyInterventionDefinition[] {
    return REGIONAL_ENERGY_INTERVENTION_LIBRARY.filter((i) => i.costUsd <= maxBudgetUsd);
  }

  /**
   * Filter interventions by Meadows leverage tier
   */
  public static filterByMeadowsTier(tier: LeverageLevel): EnergyInterventionDefinition[] {
    return REGIONAL_ENERGY_INTERVENTION_LIBRARY.filter((i) => i.meadowsTier === tier);
  }

  /**
   * Get sorted catalog by highest leverage (lowest Meadows rank number = highest leverage)
   */
  public static getByLeverageHierarchy(): EnergyInterventionDefinition[] {
    return [...REGIONAL_ENERGY_INTERVENTION_LIBRARY].sort((a, b) => a.leverageRank - b.leverageRank);
  }
}
