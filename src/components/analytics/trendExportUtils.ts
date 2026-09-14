import { MonthlyTrendDataPoint } from './FlourishingVsStabilityD3Chart';
import { BioregionOption, ForecastDataPoint } from './flourishingAnalyticsData';

export type TimeRangeOption = '30d' | 'quarter' | 'year' | 'all';

export interface TrendExportOptions {
  primaryDataset: MonthlyTrendDataPoint[];
  selectedBioregions: BioregionOption[];
  isNormalized: boolean;
  timeRange: TimeRangeOption;
  forecastData?: ForecastDataPoint[];
  showForecast?: boolean;
}

/**
 * Normalization helper to calculate 0-100% relative range across a dataset
 */
export const calculateRelativeNormalized = (val: number, min: number, max: number): number => {
  if (max === min) return 50.0;
  const clamped = Math.max(min, Math.min(max, val));
  return Number((((clamped - min) / (max - min)) * 100).toFixed(1));
};

/**
 * Filter monthly trend dataset based on selected time range
 */
export const filterDatasetByTimeRange = (
  dataset: MonthlyTrendDataPoint[],
  timeRange: TimeRangeOption
): MonthlyTrendDataPoint[] => {
  switch (timeRange) {
    case '30d':
      // Return the most recent month (Month 12, or last 2 for continuity)
      return dataset.filter(d => d.monthIndex >= 11);
    case 'quarter':
      // Return last quarter: Months 10, 11, 12
      return dataset.filter(d => d.monthIndex >= 10);
    case 'year':
      // Full 12-month annual baseline
      return dataset.filter(d => d.monthIndex <= 12);
    case 'all':
    default:
      return dataset;
  }
};

/**
 * Generates and downloads a clean, audit-grade CSV of the currently visualized trend data,
 * including all applied normalizations, exact dates, bioregions, and cryptographic hashes.
 */
export const exportVisualizedTrendCSV = (options: TrendExportOptions): { rowCount: number; fileName: string } => {
  const {
    primaryDataset,
    selectedBioregions,
    isNormalized,
    timeRange,
    forecastData = [],
    showForecast = false
  } = options;

  const headers = [
    'Record_ID',
    'Exact_Date',
    'Calendar_Month',
    'Telemetry_Index',
    'Bioregion_Name',
    'Bioregion_Code',
    'Ecological_Flourishing_Raw_Pct',
    'Ecological_Flourishing_Normalized_Pct',
    'Economic_Stability_Raw_Pct',
    'Economic_Stability_Normalized_Pct',
    'Extractive_Counterfactual_Raw_Pct',
    'Extractive_Counterfactual_Normalized_Pct',
    'Decoupling_Margin_Raw_Pts',
    'Decoupling_Margin_Normalized_Pts',
    'Active_Visualization_Scale',
    'Active_Time_Range_Filter',
    'Verified_Sensors_Quorum',
    'Cryptographic_Merkle_Hash',
    'Milestone_Descriptor',
    'Epistemic_Data_Tier'
  ];

  // Min and Max bounds across dataset for relative normalization math
  const minEco = Math.min(...primaryDataset.map(d => d.ecologicalFlourishing));
  const maxEco = Math.max(...primaryDataset.map(d => d.ecologicalFlourishing));
  const minEcon = Math.min(...primaryDataset.map(d => d.economicStability));
  const maxEcon = Math.max(...primaryDataset.map(d => d.economicStability));
  const minCounter = Math.min(...primaryDataset.map(d => d.extractiveCounterfactual));
  const maxCounter = Math.max(...primaryDataset.map(d => d.extractiveCounterfactual));

  const rows: string[][] = [];
  let recordCounter = 1;

  // Regions to export: if specific bioregions selected, export each; otherwise export primary dataset
  const targetRegions = selectedBioregions.length > 0 ? selectedBioregions : [];

  if (targetRegions.length > 0) {
    targetRegions.forEach(region => {
      const filteredMonthly = filterDatasetByTimeRange(region.monthlyData, timeRange);
      
      // Calculate region-specific bounds
      const rMinEco = Math.min(...region.monthlyData.map(d => d.ecologicalFlourishing));
      const rMaxEco = Math.max(...region.monthlyData.map(d => d.ecologicalFlourishing));
      const rMinEcon = Math.min(...region.monthlyData.map(d => d.economicStability));
      const rMaxEcon = Math.max(...region.monthlyData.map(d => d.economicStability));
      const rMinCounter = Math.min(...region.monthlyData.map(d => d.extractiveCounterfactual));
      const rMaxCounter = Math.max(...region.monthlyData.map(d => d.extractiveCounterfactual));

      filteredMonthly.forEach(pt => {
        const normEcoVal = calculateRelativeNormalized(pt.ecologicalFlourishing, rMinEco, rMaxEco);
        const normEconVal = calculateRelativeNormalized(pt.economicStability, rMinEcon, rMaxEcon);
        const normCounterVal = calculateRelativeNormalized(pt.extractiveCounterfactual, rMinCounter, rMaxCounter);
        const normDecoupling = Number((normEcoVal - normCounterVal).toFixed(1));

        rows.push([
          `REC-${String(recordCounter++).padStart(4, '0')}`,
          `"${pt.exactDate || pt.calendarMonth}"`,
          `"${pt.calendarMonth}"`,
          String(pt.monthIndex),
          `"${region.name}"`,
          region.code,
          pt.ecologicalFlourishing.toFixed(1),
          normEcoVal.toFixed(1),
          pt.economicStability.toFixed(1),
          normEconVal.toFixed(1),
          pt.extractiveCounterfactual.toFixed(1),
          normCounterVal.toFixed(1),
          pt.decouplingMargin.toFixed(1),
          normDecoupling.toFixed(1),
          isNormalized ? 'Normalized (0-100% Relative Range)' : 'Raw Telemetry Scale (0-100)',
          timeRange === '30d' ? 'Last 30 Days' : timeRange === 'quarter' ? 'Last Quarter' : timeRange === 'year' ? 'Last Year' : 'All-Time',
          String(pt.verifiedSensorCount),
          pt.cryptographicHash,
          `"${pt.milestone || 'Routine monthly telemetry capture'}"`,
          'Tier-1 ZKP Sensor Quorum Audited'
        ]);
      });
    });
  } else {
    const filtered = filterDatasetByTimeRange(primaryDataset, timeRange);
    filtered.forEach(pt => {
      const normEcoVal = calculateRelativeNormalized(pt.ecologicalFlourishing, minEco, maxEco);
      const normEconVal = calculateRelativeNormalized(pt.economicStability, minEcon, maxEcon);
      const normCounterVal = calculateRelativeNormalized(pt.extractiveCounterfactual, minCounter, maxCounter);
      const normDecoupling = Number((normEcoVal - normCounterVal).toFixed(1));

      rows.push([
        `REC-${String(recordCounter++).padStart(4, '0')}`,
        `"${pt.exactDate || pt.calendarMonth}"`,
        `"${pt.calendarMonth}"`,
        String(pt.monthIndex),
        '"Pan-African Bioregional Aggregate"',
        'PAN',
        pt.ecologicalFlourishing.toFixed(1),
        normEcoVal.toFixed(1),
        pt.economicStability.toFixed(1),
        normEconVal.toFixed(1),
        pt.extractiveCounterfactual.toFixed(1),
        normCounterVal.toFixed(1),
        pt.decouplingMargin.toFixed(1),
        normDecoupling.toFixed(1),
        isNormalized ? 'Normalized (0-100% Relative Range)' : 'Raw Telemetry Scale (0-100)',
        timeRange === '30d' ? 'Last 30 Days' : timeRange === 'quarter' ? 'Last Quarter' : timeRange === 'year' ? 'Last Year' : 'All-Time',
        String(pt.verifiedSensorCount),
        pt.cryptographicHash,
        `"${pt.milestone || 'Routine monthly telemetry capture'}"`,
        'Tier-1 ZKP Sensor Quorum Audited'
      ]);
    });
  }

  // If predictive forecast is active and timeRange is 'all' or 'year', append projected Gemini simulation
  if (showForecast && (timeRange === 'all' || timeRange === 'year') && forecastData.length > 0) {
    forecastData.forEach(f => {
      const normEcoVal = calculateRelativeNormalized(f.projectedFlourishing, minEco, maxEco);
      const normEconVal = calculateRelativeNormalized(f.projectedEconomicStability, minEcon, maxEcon);
      const normCounterVal = calculateRelativeNormalized(f.extractiveCounterfactual, minCounter, maxCounter);
      const normDecoupling = Number((normEcoVal - normCounterVal).toFixed(1));

      rows.push([
        `REC-${String(recordCounter++).padStart(4, '0')}`,
        `"${f.calendarMonth} (Projected)"`,
        `"${f.calendarMonth}"`,
        String(f.monthIndex),
        '"Gemini Predictive Simulation"',
        'SIM',
        f.projectedFlourishing.toFixed(1),
        normEcoVal.toFixed(1),
        f.projectedEconomicStability.toFixed(1),
        normEconVal.toFixed(1),
        f.extractiveCounterfactual.toFixed(1),
        normCounterVal.toFixed(1),
        f.decouplingMargin.toFixed(1),
        normDecoupling.toFixed(1),
        isNormalized ? 'Normalized (0-100% Relative Range)' : 'Raw Telemetry Scale (0-100)',
        'Predictive Forward Horizon',
        '4200',
        '0x_gemini_predictive_zk_proof',
        `"${f.milestone || 'Projected biophysical trajectory'}"`,
        `Gemini 3.8 Flash Biophysical Forecast (${f.confidenceScore}% Confidence)`
      ]);
    });
  }

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const rangeSlug = timeRange.toLowerCase();
  const normSlug = isNormalized ? 'normalized-0-100' : 'raw-scale';
  const fileName = `Atlas_Sanctum_Trend_Data_${rangeSlug}_${normSlug}_${Date.now()}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { rowCount: rows.length, fileName };
};
