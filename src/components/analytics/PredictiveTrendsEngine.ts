/**
 * Predictive Trends Engine
 * Ordinary Least Squares (OLS) Linear Regression and Forecasting Model
 * for Resource Consumption, Clean Energy Generation, and Telemetry Loads.
 */

export interface RegressionResult {
  slope: number; // m
  intercept: number; // b
  rSquared: number; // R² coefficient of determination
  standardError: number;
  predict: (x: number) => number;
}

export interface ForecastPoint {
  epoch: string;
  isForecast: boolean;
  computeKWh?: number;
  greenSolarKWh?: number;
  netOffsetKWh?: number;
  projectedComputeKWh: number;
  projectedSolarKWh: number;
  projectedNetSurplusKWh: number;
  computeConfidenceUpper?: number;
  computeConfidenceLower?: number;
  solarConfidenceUpper?: number;
  solarConfidenceLower?: number;
  [key: string]: any;
}

export type ForecastScenario = 'baseline_ols' | 'accelerated_adoption' | 'conservation';

export interface PredictiveConfig {
  enabled: boolean;
  horizonMonths: number; // 1 to 4 months
  scenario: ForecastScenario;
  showConfidenceInterval: boolean;
  confidenceBandPct: number; // e.g. 8% band
}

/**
 * Calculates simple Ordinary Least Squares (OLS) Linear Regression: y = m*x + b
 */
export function calculateLinearRegression(dataPoints: number[]): RegressionResult {
  const n = dataPoints.length;
  if (n < 2) {
    const val = dataPoints[0] || 0;
    return {
      slope: 0,
      intercept: val,
      rSquared: 1,
      standardError: 0,
      predict: () => val
    };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = dataPoints[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const denominator = n * sumX2 - sumX * sumX;
  const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R² (Coefficient of Determination) & Standard Error
  const meanY = sumY / n;
  let ssTot = 0;
  let ssRes = 0;

  for (let i = 0; i < n; i++) {
    const y = dataPoints[i];
    const yPred = slope * i + intercept;
    ssTot += Math.pow(y - meanY, 2);
    ssRes += Math.pow(y - yPred, 2);
  }

  const rSquared = ssTot === 0 ? 1 : Math.max(0, Math.min(1, 1 - ssRes / ssTot));
  const standardError = Math.sqrt(ssRes / (n > 2 ? n - 2 : 1));

  return {
    slope,
    intercept,
    rSquared: Math.round(rSquared * 1000) / 1000,
    standardError: Math.round(standardError),
    predict: (x: number) => Math.round(slope * x + intercept)
  };
}

const FUTURE_MONTH_NAMES = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan+1'];

/**
 * Generates an extended dataset combining historical records with forward-looking regression forecast points.
 */
export function generatePredictiveResourceForecast(
  historicalData: Array<{
    epoch: string;
    computeKWh: number;
    greenSolarKWh: number;
    netOffsetKWh: number;
    [key: string]: any;
  }>,
  config: PredictiveConfig
): {
  combinedData: ForecastPoint[];
  computeRegression: RegressionResult;
  solarRegression: RegressionResult;
  stats: {
    computeGrowthPerMonth: number;
    solarGrowthPerMonth: number;
    forecastedNetSurplusEnd: number;
    rSquaredCompute: number;
    rSquaredSolar: number;
  };
} {
  const computeValues = historicalData.map(d => d.computeKWh);
  const solarValues = historicalData.map(d => d.greenSolarKWh);

  const computeReg = calculateLinearRegression(computeValues);
  const solarReg = calculateLinearRegression(solarValues);

  // Scenario multipliers
  let computeSlopeMultiplier = 1;
  let solarSlopeMultiplier = 1;

  if (config.scenario === 'accelerated_adoption') {
    computeSlopeMultiplier = 1.25;
    solarSlopeMultiplier = 1.40;
  } else if (config.scenario === 'conservation') {
    computeSlopeMultiplier = 0.70;
    solarSlopeMultiplier = 1.15;
  }

  const n = historicalData.length;
  const combinedData: ForecastPoint[] = [];

  // 1. Process Historical records with fitted regression overlay
  historicalData.forEach((item, idx) => {
    const fittedCompute = Math.max(0, Math.round(computeReg.intercept + computeReg.slope * idx));
    const fittedSolar = Math.max(0, Math.round(solarReg.intercept + solarReg.slope * idx));
    const fittedNet = fittedSolar - fittedCompute;

    combinedData.push({
      ...item,
      isForecast: false,
      projectedComputeKWh: fittedCompute,
      projectedSolarKWh: fittedSolar,
      projectedNetSurplusKWh: fittedNet,
      computeConfidenceUpper: undefined,
      computeConfidenceLower: undefined,
      solarConfidenceUpper: undefined,
      solarConfidenceLower: undefined
    });
  });

  // 2. Add bridge point on the last historical epoch so Recharts draws continuous dashed lines
  if (config.enabled && n > 0) {
    const lastHistorical = combinedData[n - 1];
    // Ensure projection line matches the final recorded value for visual continuity
    lastHistorical.projectedComputeKWh = lastHistorical.computeKWh!;
    lastHistorical.projectedSolarKWh = lastHistorical.greenSolarKWh!;
    lastHistorical.projectedNetSurplusKWh = lastHistorical.netOffsetKWh!;

    // 3. Project Future Forecast Epochs based on horizon
    const horizon = Math.min(FUTURE_MONTH_NAMES.length, Math.max(1, config.horizonMonths));
    const lastCompute = lastHistorical.computeKWh || 5300;
    const lastSolar = lastHistorical.greenSolarKWh || 7200;

    for (let step = 1; step <= horizon; step++) {
      const futureEpochName = `${FUTURE_MONTH_NAMES[step - 1]} (Fcst)`;
      const xFuture = (n - 1) + step;

      // Calculate future values applying scenario slope
      const rawCompute = Math.round(lastCompute + (computeReg.slope * computeSlopeMultiplier) * step);
      const rawSolar = Math.round(lastSolar + (solarReg.slope * solarSlopeMultiplier) * step);

      const projCompute = Math.max(1000, rawCompute);
      const projSolar = Math.max(1200, rawSolar);
      const projNet = projSolar - projCompute;

      // Confidence intervals expanding over time: bandPct * (1 + 0.15 * step)
      const bandFraction = (config.confidenceBandPct / 100) * (1 + 0.15 * step);
      const computeConfidenceUpper = Math.round(projCompute * (1 + bandFraction));
      const computeConfidenceLower = Math.round(projCompute * (1 - bandFraction));
      const solarConfidenceUpper = Math.round(projSolar * (1 + bandFraction));
      const solarConfidenceLower = Math.round(projSolar * (1 - bandFraction));

      combinedData.push({
        epoch: futureEpochName,
        isForecast: true,
        // Omit actual historical points so Recharts bars only render up to the present
        computeKWh: undefined,
        greenSolarKWh: undefined,
        netOffsetKWh: undefined,
        projectedComputeKWh: projCompute,
        projectedSolarKWh: projSolar,
        projectedNetSurplusKWh: projNet,
        computeConfidenceUpper,
        computeConfidenceLower,
        solarConfidenceUpper,
        solarConfidenceLower
      });
    }
  }

  const lastPoint = combinedData[combinedData.length - 1];

  return {
    combinedData,
    computeRegression: computeReg,
    solarRegression: solarReg,
    stats: {
      computeGrowthPerMonth: Math.round(computeReg.slope * computeSlopeMultiplier),
      solarGrowthPerMonth: Math.round(solarReg.slope * solarSlopeMultiplier),
      forecastedNetSurplusEnd: lastPoint ? lastPoint.projectedNetSurplusKWh : 0,
      rSquaredCompute: computeReg.rSquared,
      rSquaredSolar: solarReg.rSquared
    }
  };
}
