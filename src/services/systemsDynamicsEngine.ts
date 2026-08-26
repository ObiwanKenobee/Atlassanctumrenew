/**
 * ATLAS SANCTUM — Systems Dynamics & Modelling Engine
 * 
 * Continuous Reality Integration: SENSE → VALIDATE → MODEL → SIMULATE → DECIDE → ACT → MEASURE → LEARN
 * Implements differential Euler numerical integration for multi-capital Stocks, Flows, and Feedback Loops.
 */

import {
  SystemModel,
  Stock,
  Flow,
  Variable,
  CausalRelationship,
  FeedbackLoop,
  Scenario,
  CandidateIntervention,
  ModelLearningFeedback
} from '../types/systemsDynamics';

export interface SimulationOptions {
  timeHorizonMonths: number;
  timeStepMonths: number; // dt for numerical integration (e.g. 0.5, 1.0)
  parameterOverrides?: Record<string, number>;
  activeInterventions?: CandidateIntervention[];
  stochasticNoise?: boolean;
  noiseMagnitude?: number; // 0.0 - 0.1
}

export interface SimulationPoint {
  month: number;
  stocks: Record<string, number>;
  flows: Record<string, number>;
  variables: Record<string, number>;
  flourishingIndex: number;
  cleanEnergyOutputMwh: number;
  batteryStorageBufferMwh: number;
  gridStressIndex: number;
  retainedCapitalUsd: number;
  carbonAvoidedTons: number;
  confidenceInterval: [number, number]; // [lower, upper] flourishing bounds
}

export interface SimulationResult {
  scenarioId: string;
  timeSeries: SimulationPoint[];
  baselineTimeSeries: SimulationPoint[];
  finalStockDeltas: Record<
    string,
    {
      initial: number;
      baselineFinal: number;
      interventionFinal: number;
      absoluteDelta: number;
      percentageChange: number;
      unit: string;
    }
  >;
  loopDominance: {
    loopId: string;
    loopName: string;
    type: 'reinforcing' | 'balancing';
    relativeStrength: number;
    status: 'accelerating' | 'saturated' | 'damped';
    leverageScore: number;
  }[];
  summaryMetrics: {
    flourishingDelta: number;
    cleanEnergyGainPercent: number;
    gridStressReductionPercent: number;
    capitalRetainedMultiplier: number;
    carbonAvoidedTotalTons: number;
    highestLeverageAppliedTier: string;
  };
  warnings: string[];
}

export class SystemsDynamicsEngine {
  /**
   * Run differential Euler numerical integration:
   * Stock(t + dt) = Stock(t) + dt * ( sum(InflowRates(t)) - sum(OutflowRates(t)) )
   */
  public static runEulerSimulation(
    model: SystemModel,
    options: SimulationOptions
  ): SimulationResult {
    const dt = Math.max(0.1, options.timeStepMonths || 1.0);
    const horizon = Math.max(1, options.timeHorizonMonths || model.timeHorizonMonths || 24);

    // 1. Run baseline simulation (zero interventions, default variables)
    const baselineTimeSeries = this.executeIntegrationLoop(model, {
      ...options,
      activeInterventions: [],
      parameterOverrides: {}
    }, dt, horizon);

    // 2. Run scenario simulation with interventions and parameter overrides
    const interventionTimeSeries = this.executeIntegrationLoop(model, options, dt, horizon);

    // 3. Compute final stock deltas comparing baseline final vs intervention final
    const finalStockDeltas: SimulationResult['finalStockDeltas'] = {};
    const baselineFinal = baselineTimeSeries[baselineTimeSeries.length - 1];
    const interventionFinal = interventionTimeSeries[interventionTimeSeries.length - 1];

    model.stocks.forEach((stock) => {
      const initial = stock.initialValue ?? stock.currentValue;
      const baseVal = baselineFinal?.stocks[stock.id] ?? initial;
      const intVal = interventionFinal?.stocks[stock.id] ?? initial;
      const absDelta = intVal - baseVal;
      const pct = baseVal !== 0 ? (absDelta / Math.abs(baseVal)) * 100 : 0;

      finalStockDeltas[stock.id] = {
        initial,
        baselineFinal: Math.round(baseVal * 100) / 100,
        interventionFinal: Math.round(intVal * 100) / 100,
        absoluteDelta: Math.round(absDelta * 100) / 100,
        percentageChange: Math.round(pct * 10) / 10,
        unit: stock.unit
      };
    });

    // 4. Compute active feedback loop strength and dominance
    const loopDominance = this.calculateFeedbackLoopDominance(model, interventionTimeSeries);

    // 5. Compute summary metrics
    const baseFlourishing = baselineFinal?.flourishingIndex ?? 50;
    const intFlourishing = interventionFinal?.flourishingIndex ?? 50;
    const flourishingDelta = Math.round((intFlourishing - baseFlourishing) * 10) / 10;

    const baseEnergy = baselineFinal?.cleanEnergyOutputMwh ?? 100;
    const intEnergy = interventionFinal?.cleanEnergyOutputMwh ?? 100;
    const cleanEnergyGain = baseEnergy !== 0 ? ((intEnergy - baseEnergy) / baseEnergy) * 100 : 0;

    const baseStress = baselineFinal?.gridStressIndex ?? 70;
    const intStress = interventionFinal?.gridStressIndex ?? 70;
    const gridStressReduction = baseStress !== 0 ? ((baseStress - intStress) / baseStress) * 100 : 0;

    const baseCap = baselineFinal?.retainedCapitalUsd ?? 100000;
    const intCap = interventionFinal?.retainedCapitalUsd ?? 100000;
    const capMultiplier = baseCap !== 0 ? intCap / baseCap : 1.0;

    const carbonTotal = interventionFinal?.carbonAvoidedTons ?? 0;

    // Detect highest leverage tier applied
    let highestTier = 'constants_parameters';
    const tiers = (options.activeInterventions || []).map((i) => i.meadowsTier).filter(Boolean);
    if (tiers.includes('goals_paradigms_transcendence')) highestTier = 'Meadows #1 (Goals & Paradigms)';
    else if (tiers.includes('rules_information_flows')) highestTier = 'Meadows #3 (Rules & Information Flows)';
    else if (tiers.includes('delays_feedback_gains')) highestTier = 'Meadows #6 (Feedback Gains & Delays)';
    else if (tiers.includes('structure_network')) highestTier = 'Meadows #8 (Network Structure)';
    else if (tiers.includes('buffers_stocks')) highestTier = 'Meadows #9 (Physical Buffers & Stocks)';

    const warnings: string[] = [];
    model.constraints.forEach((c) => {
      const stockVal = interventionFinal?.stocks[c.entityId];
      if (stockVal !== undefined) {
        if (c.type === 'carrying_capacity' && stockVal > c.thresholdValue) {
          warnings.push(`Warning: ${c.name} exceeded threshold (${stockVal.toFixed(0)} > ${c.thresholdValue})`);
        } else if (c.type === 'physical_threshold' && stockVal < c.thresholdValue) {
          warnings.push(`Critical: ${c.name} breached minimum threshold (${stockVal.toFixed(0)} < ${c.thresholdValue})`);
        }
      }
    });

    return {
      scenarioId: options.activeInterventions && options.activeInterventions.length > 0 
        ? `scenario-active-${Date.now()}` 
        : 'scenario-baseline',
      timeSeries: interventionTimeSeries,
      baselineTimeSeries,
      finalStockDeltas,
      loopDominance,
      summaryMetrics: {
        flourishingDelta,
        cleanEnergyGainPercent: Math.round(cleanEnergyGain * 10) / 10,
        gridStressReductionPercent: Math.round(gridStressReduction * 10) / 10,
        capitalRetainedMultiplier: Math.round(capMultiplier * 100) / 100,
        carbonAvoidedTotalTons: Math.round(carbonTotal),
        highestLeverageAppliedTier: highestTier
      },
      warnings
    };
  }

  /**
   * Internal integration core using Euler forward steps
   */
  private static executeIntegrationLoop(
    model: SystemModel,
    options: SimulationOptions,
    dt: number,
    horizon: number
  ): SimulationPoint[] {
    const points: SimulationPoint[] = [];

    // Initialize variable state
    const currentVars: Record<string, number> = {};
    model.variables.forEach((v) => {
      currentVars[v.id] = options.parameterOverrides?.[v.id] !== undefined
        ? options.parameterOverrides[v.id]
        : v.value;
    });

    // Apply intervention effects on variables and flow multipliers
    let energyMultiplier = 1.0;
    let storageMultiplier = 1.0;
    let gridStressDamping = 1.0;
    let economicRetentionMultiplier = 1.0;
    let carbonCaptureBoost = 1.0;

    (options.activeInterventions || []).forEach((intervention) => {
      const id = intervention.id.toLowerCase();
      const rank = intervention.leverageRank || 6;
      const potency = 1.0 + (13 - rank) * 0.12;

      if (id.includes('solar') || id.includes('pv') || id.includes('generation')) {
        energyMultiplier += 0.8 * potency;
        currentVars['var-solar-irradiance-factor'] = (currentVars['var-solar-irradiance-factor'] || 1.0) * 1.4;
      }
      if (id.includes('storage') || id.includes('bess') || id.includes('battery')) {
        storageMultiplier += 0.9 * potency;
        currentVars['var-battery-cycle-efficiency'] = 0.94;
      }
      if (id.includes('tariff') || id.includes('governance') || id.includes('commons')) {
        economicRetentionMultiplier += 1.1 * potency;
        currentVars['var-local-revenue-retention-rate'] = 0.88;
      }
      if (id.includes('demand') || id.includes('mesh') || id.includes('inverter')) {
        gridStressDamping *= 0.45;
        currentVars['var-peak-grid-loss-fraction'] = 0.05;
      }
      if (id.includes('biochar') || id.includes('agro') || id.includes('carbon')) {
        carbonCaptureBoost += 1.2 * potency;
      }
    });

    // Initialize stock state with initial values
    const currentStocks: Record<string, number> = {};
    model.stocks.forEach((s) => {
      currentStocks[s.id] = s.initialValue ?? s.currentValue;
    });

    // Lag buffers for delay equations
    const delayQueues: Record<string, number[]> = {};
    model.flows.forEach((f) => {
      if (f.delayPeriods > 0) {
        delayQueues[f.id] = new Array(Math.ceil(f.delayPeriods / dt)).fill(f.currentRate);
      }
    });

    let cumulativeCarbonAvoided = 0;

    for (let t = 0; t <= horizon; t += dt) {
      // 1. Calculate active flow rates
      const currentFlowRates: Record<string, number> = {};

      model.flows.forEach((flow) => {
        let baseRate = flow.currentRate;

        // Modulate flow by controlling variables
        flow.controllingVariableIds.forEach((vId) => {
          const varVal = currentVars[vId];
          if (varVal !== undefined) {
            // Apply scale normalization based on variable value
            baseRate *= (varVal > 0 ? varVal / 50 : 1.0);
          }
        });

        // Apply domain multipliers
        const fid = flow.id.toLowerCase();
        if (fid.includes('generation') || fid.includes('solar') || fid.includes('inflow-clean')) {
          baseRate *= energyMultiplier;
        } else if (fid.includes('storage') || fid.includes('battery')) {
          baseRate *= storageMultiplier;
        } else if (fid.includes('retention') || fid.includes('revenue')) {
          baseRate *= economicRetentionMultiplier;
        } else if (fid.includes('loss') || fid.includes('degradation') || fid.includes('stress')) {
          baseRate *= gridStressDamping;
        }

        // Apply stochastic variability if enabled
        if (options.stochasticNoise) {
          const noise = 1.0 + (Math.random() - 0.5) * (options.noiseMagnitude || 0.05);
          baseRate *= noise;
        }

        // Check delay queue
        if (flow.delayPeriods > 0 && delayQueues[flow.id]) {
          delayQueues[flow.id].push(baseRate);
          currentFlowRates[flow.id] = delayQueues[flow.id].shift() || baseRate;
        } else {
          currentFlowRates[flow.id] = Math.max(0, baseRate);
        }
      });

      // 2. Perform Euler numerical integration step:
      // dS/dt = Inflows - Outflows -> S(t + dt) = S(t) + dt * (Inflows - Outflows)
      model.stocks.forEach((stock) => {
        let totalInflow = 0;
        stock.inflowIds.forEach((inflowId) => {
          totalInflow += currentFlowRates[inflowId] || 0;
        });

        let totalOutflow = 0;
        stock.outflowIds.forEach((outflowId) => {
          totalOutflow += currentFlowRates[outflowId] || 0;
        });

        const dS_dt = totalInflow - totalOutflow;
        const nextVal = currentStocks[stock.id] + dt * dS_dt;

        // Apply carrying capacity & non-negative bounds
        const minCap = stock.minimumCapacity ?? 0;
        const maxCap = stock.maximumCapacity ?? Infinity;
        currentStocks[stock.id] = Math.max(minCap, Math.min(maxCap, nextVal));
      });

      // 3. Compute domain indicators for energy & flourishing
      const cleanEnergyStock = 
        currentStocks['stock-clean-energy-generation'] || 
        currentStocks['stock-clean-energy-storage'] || 
        (currentStocks['stock-potable-water-reserve'] ? currentStocks['stock-potable-water-reserve'] / 100 : 45 * energyMultiplier);

      const batteryBufferStock = 
        currentStocks['stock-battery-storage-buffer'] || 
        currentStocks['stock-produce-cold-storage'] || 
        (18.5 * storageMultiplier);

      const gridStressVal = Math.max(
        5,
        Math.min(100, 75 * gridStressDamping - (cleanEnergyStock / 150) * 20 - (batteryBufferStock / 40) * 15)
      );

      const retainedCapVal = 
        currentStocks['stock-local-capital-retained'] || 
        (240000 * economicRetentionMultiplier * (1 + (t / horizon) * 0.4));

      cumulativeCarbonAvoided += (cleanEnergyStock * 0.42 * dt * carbonCaptureBoost);

      // Composite Flourishing Index (0-100)
      const energyFactor = Math.min(100, (cleanEnergyStock / 120) * 100);
      const storageFactor = Math.min(100, (batteryBufferStock / 35) * 100);
      const gridStabilityFactor = Math.max(0, 100 - gridStressVal);
      const wealthFactor = Math.min(100, (retainedCapVal / 500000) * 100);

      const compositeFlourishing = Math.min(
        100,
        Math.round((energyFactor * 0.35 + storageFactor * 0.25 + gridStabilityFactor * 0.25 + wealthFactor * 0.15) * 10) / 10
      );

      const confidenceSpread = 3.5 * Math.sqrt(1 + t / 12);
      const lowerBound = Math.max(0, Math.round((compositeFlourishing - confidenceSpread) * 10) / 10);
      const upperBound = Math.min(100, Math.round((compositeFlourishing + confidenceSpread) * 10) / 10);

      points.push({
        month: Math.round(t * 10) / 10,
        stocks: { ...currentStocks },
        flows: { ...currentFlowRates },
        variables: { ...currentVars },
        flourishingIndex: compositeFlourishing,
        cleanEnergyOutputMwh: Math.round(cleanEnergyStock * 10) / 10,
        batteryStorageBufferMwh: Math.round(batteryBufferStock * 10) / 10,
        gridStressIndex: Math.round(gridStressVal * 10) / 10,
        retainedCapitalUsd: Math.round(retainedCapVal),
        carbonAvoidedTons: Math.round(cumulativeCarbonAvoided * 10) / 10,
        confidenceInterval: [lowerBound, upperBound]
      });
    }

    return points;
  }

  /**
   * Determine feedback loop dynamics and acceleration/damping status
   */
  private static calculateFeedbackLoopDominance(
    model: SystemModel,
    timeSeries: SimulationPoint[]
  ): SimulationResult['loopDominance'] {
    if (timeSeries.length < 2) return [];

    const first = timeSeries[0];
    const last = timeSeries[timeSeries.length - 1];
    const flourishingRate = (last.flourishingIndex - first.flourishingIndex) / Math.max(1, last.month);

    return (model.feedbackLoops || []).map((loop) => {
      const isReinforcing = loop.type === 'reinforcing';
      let relativeStrength = Math.min(1.0, (loop.leverageScore / 10) * (isReinforcing ? 1.0 + flourishingRate * 0.2 : 0.8));
      relativeStrength = Math.max(0.1, Math.round(relativeStrength * 100) / 100);

      let status: 'accelerating' | 'saturated' | 'damped' = 'accelerating';
      if (relativeStrength > 0.85) status = 'accelerating';
      else if (relativeStrength > 0.5) status = 'saturated';
      else status = 'damped';

      return {
        loopId: loop.id,
        loopName: loop.name,
        type: loop.type,
        relativeStrength,
        status,
        leverageScore: loop.leverageScore
      };
    });
  }

  /**
   * Sensitivity Analysis: determines elasticity of target stock/flourishing to each variable
   */
  public static calculateSensitivity(
    model: SystemModel,
    baseOptions: SimulationOptions
  ): Array<{ variableId: string; variableName: string; elasticity: number; rank: number }> {
    const baseResult = this.runEulerSimulation(model, baseOptions);
    const baseFinalFlourishing = baseResult.timeSeries[baseResult.timeSeries.length - 1]?.flourishingIndex || 50;

    const sensitivities = model.variables.map((variable) => {
      const perturbedValue = variable.value * 1.25; // +25% perturbation
      const perturbedResult = this.runEulerSimulation(model, {
        ...baseOptions,
        parameterOverrides: {
          ...(baseOptions.parameterOverrides || {}),
          [variable.id]: perturbedValue
        }
      });
      const perturbedFinal = perturbedResult.timeSeries[perturbedResult.timeSeries.length - 1]?.flourishingIndex || 50;
      const deltaPercentFlourishing = (perturbedFinal - baseFinalFlourishing) / baseFinalFlourishing;
      const elasticity = Math.abs(deltaPercentFlourishing / 0.25);

      return {
        variableId: variable.id,
        variableName: variable.name,
        elasticity: Math.round(elasticity * 1000) / 1000
      };
    });

    sensitivities.sort((a, b) => b.elasticity - a.elasticity);

    return sensitivities.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }
}
