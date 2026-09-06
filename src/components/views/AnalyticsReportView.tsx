import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  BarChart3,
  Activity,
  Zap,
  Users,
  Droplets,
  TreePine,
  ShieldCheck,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
  Radio,
  FileCheck,
  Sliders,
  AlertTriangle,
  Cpu,
  CheckCircle2,
  Sparkles,
  FileSpreadsheet,
  GitCompare,
  X,
  Search,
  Copy,
  ExternalLink,
  ChevronRight,
  Filter,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioFeedback, hapticFeedback } from '../../lib/audioFeedback';

// Activity time-series data with comparative baselines
const ACTIVITY_24H = [
  { time: '00:00', stewards: 412, fieldOperatives: 120, epistemicAudits: 85, aiQueries: 640, prevStewards: 360, prevQueries: 510 },
  { time: '03:00', stewards: 320, fieldOperatives: 85, epistemicAudits: 62, aiQueries: 480, prevStewards: 290, prevQueries: 420 },
  { time: '06:00', stewards: 590, fieldOperatives: 210, epistemicAudits: 140, aiQueries: 890, prevStewards: 480, prevQueries: 730 },
  { time: '09:00', stewards: 1240, fieldOperatives: 480, epistemicAudits: 310, aiQueries: 1840, prevStewards: 1050, prevQueries: 1510 },
  { time: '12:00', stewards: 1580, fieldOperatives: 620, epistemicAudits: 450, aiQueries: 2450, prevStewards: 1390, prevQueries: 2100 },
  { time: '15:00', stewards: 1720, fieldOperatives: 690, epistemicAudits: 520, aiQueries: 2710, prevStewards: 1480, prevQueries: 2320 },
  { time: '18:00', stewards: 1390, fieldOperatives: 430, epistemicAudits: 380, aiQueries: 2100, prevStewards: 1200, prevQueries: 1790 },
  { time: '21:00', stewards: 890, fieldOperatives: 240, epistemicAudits: 195, aiQueries: 1320, prevStewards: 760, prevQueries: 1100 },
];

const ACTIVITY_7D = [
  { time: 'Mon', stewards: 4850, fieldOperatives: 1920, epistemicAudits: 1280, aiQueries: 7420, prevStewards: 4210, prevQueries: 6310 },
  { time: 'Tue', stewards: 5320, fieldOperatives: 2150, epistemicAudits: 1490, aiQueries: 8180, prevStewards: 4600, prevQueries: 7120 },
  { time: 'Wed', stewards: 6100, fieldOperatives: 2480, epistemicAudits: 1820, aiQueries: 9340, prevStewards: 5120, prevQueries: 7950 },
  { time: 'Thu', stewards: 5890, fieldOperatives: 2310, epistemicAudits: 1710, aiQueries: 8950, prevStewards: 5040, prevQueries: 7680 },
  { time: 'Fri', stewards: 6450, fieldOperatives: 2640, epistemicAudits: 2010, aiQueries: 9870, prevStewards: 5520, prevQueries: 8430 },
  { time: 'Sat', stewards: 4920, fieldOperatives: 1880, epistemicAudits: 1340, aiQueries: 6980, prevStewards: 4180, prevQueries: 5890 },
  { time: 'Sun', stewards: 4310, fieldOperatives: 1620, epistemicAudits: 1150, aiQueries: 6120, prevStewards: 3750, prevQueries: 5200 },
];

const ACTIVITY_30D = [
  { time: 'Week 1', stewards: 28400, fieldOperatives: 11200, epistemicAudits: 8400, aiQueries: 48200, prevStewards: 24600, prevQueries: 41000 },
  { time: 'Week 2', stewards: 31200, fieldOperatives: 12800, epistemicAudits: 9700, aiQueries: 53600, prevStewards: 26900, prevQueries: 45400 },
  { time: 'Week 3', stewards: 35600, fieldOperatives: 14100, epistemicAudits: 11200, aiQueries: 61400, prevStewards: 30100, prevQueries: 51200 },
  { time: 'Week 4', stewards: 38900, fieldOperatives: 15400, epistemicAudits: 12600, aiQueries: 67800, prevStewards: 33400, prevQueries: 56900 },
];

// Resource consumption & efficiency metrics with comparative period baselines
const RESOURCE_ENERGY_DATA = [
  { epoch: 'Jan', computeKWh: 3400, greenSolarKWh: 3850, netOffsetKWh: 450, zkpGasEquiv: 120, baselineComputeKWh: 3950, baselineSolarKWh: 3100, targetComputeKWh: 3100, targetSolarKWh: 4500 },
  { epoch: 'Feb', computeKWh: 3800, greenSolarKWh: 4400, netOffsetKWh: 600, zkpGasEquiv: 140, baselineComputeKWh: 4200, baselineSolarKWh: 3450, targetComputeKWh: 3300, targetSolarKWh: 5000 },
  { epoch: 'Mar', computeKWh: 4100, greenSolarKWh: 4950, netOffsetKWh: 850, zkpGasEquiv: 165, baselineComputeKWh: 4450, baselineSolarKWh: 3900, targetComputeKWh: 3600, targetSolarKWh: 5700 },
  { epoch: 'Apr', computeKWh: 4500, greenSolarKWh: 5600, netOffsetKWh: 1100, zkpGasEquiv: 190, baselineComputeKWh: 4800, baselineSolarKWh: 4300, targetComputeKWh: 3900, targetSolarKWh: 6400 },
  { epoch: 'May', computeKWh: 4200, greenSolarKWh: 5450, netOffsetKWh: 1250, zkpGasEquiv: 175, baselineComputeKWh: 4650, baselineSolarKWh: 4400, targetComputeKWh: 3800, targetSolarKWh: 6500 },
  { epoch: 'Jun', computeKWh: 4900, greenSolarKWh: 6500, netOffsetKWh: 1600, zkpGasEquiv: 215, baselineComputeKWh: 5300, baselineSolarKWh: 5100, targetComputeKWh: 4100, targetSolarKWh: 7500 },
  { epoch: 'Jul', computeKWh: 5300, greenSolarKWh: 7200, netOffsetKWh: 1900, zkpGasEquiv: 240, baselineComputeKWh: 5750, baselineSolarKWh: 5600, targetComputeKWh: 4400, targetSolarKWh: 8200 },
];

// Biophysical water & carbon dynamics
const BIOPHYSICAL_RESOURCES_DATA = [
  { watershed: 'Mara Basin', waterRechargeM3: 4820, waterExtractionM3: 1240, soilCarbonTCO2e: 380, prevRechargeM3: 4100, prevExtractionM3: 1350 },
  { watershed: 'Aberdare Catchment', waterRechargeM3: 7650, waterExtractionM3: 1410, soilCarbonTCO2e: 520, prevRechargeM3: 6800, prevExtractionM3: 1520 },
  { watershed: 'Naivasha Lacustrine', waterRechargeM3: 3940, waterExtractionM3: 1890, soilCarbonTCO2e: 290, prevRechargeM3: 3350, prevExtractionM3: 2010 },
  { watershed: 'Rift Drylands', waterRechargeM3: 2150, waterExtractionM3: 980, soilCarbonTCO2e: 185, prevRechargeM3: 1820, prevExtractionM3: 1040 },
  { watershed: 'Tana Delta Riparian', waterRechargeM3: 5410, waterExtractionM3: 1620, soilCarbonTCO2e: 410, prevRechargeM3: 4720, prevExtractionM3: 1710 },
];

// Activity categories distribution
const DOMAIN_DISTRIBUTION = [
  { name: 'Ecological Restoration', value: 36, color: '#10B981', stewardsCount: 17610, certifiedAuditors: 640 },
  { name: 'Epistemic & Merkle Audits', value: 24, color: '#06B6D4', stewardsCount: 11740, certifiedAuditors: 480 },
  { name: 'Moral Governance & Floors', value: 18, color: '#C5A059', stewardsCount: 8800, certifiedAuditors: 310 },
  { name: 'Open CAD & Commons', value: 12, color: '#8B5CF6', stewardsCount: 5870, certifiedAuditors: 240 },
  { name: 'Capital Grant Tranches', value: 10, color: '#F59E0B', stewardsCount: 4900, certifiedAuditors: 170 },
];

// IoT Telemetry throughput
const TELEMETRY_STREAM_DATA = [
  { minute: 'T-20m', packetRateKBs: 480, activeSensors: 4120, latencyMs: 38 },
  { minute: 'T-16m', packetRateKBs: 520, activeSensors: 4160, latencyMs: 35 },
  { minute: 'T-12m', packetRateKBs: 640, activeSensors: 4210, latencyMs: 42 },
  { minute: 'T-8m', packetRateKBs: 710, activeSensors: 4245, latencyMs: 39 },
  { minute: 'T-4m', packetRateKBs: 690, activeSensors: 4270, latencyMs: 36 },
  { minute: 'Now', packetRateKBs: 745, activeSensors: 4290, latencyMs: 34 },
];

// Constituent Factor definition for interactive data drilldowns
export interface ConstituentFactor {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  sharePct?: number;
  status: 'optimal' | 'nominal' | 'elevated' | 'critical';
  nodeOrSource: string;
  description: string;
}

export interface DrilldownInspection {
  category: 'activity' | 'resource' | 'watershed' | 'domain' | 'telemetry';
  badge: string;
  title: string;
  subtitle: string;
  primaryMetric: {
    label: string;
    value: string;
    sublabel?: string;
  };
  secondaryMetric?: {
    label: string;
    value: string;
  };
  factors: ConstituentFactor[];
  telemetryProofHash: string;
  recommendation: string;
}

export const AnalyticsReportView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [selectedBioregion, setSelectedBioregion] = useState<string>('all');
  const [isExportingJson, setIsExportingJson] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Comparison Mode state
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [comparisonPeriod, setComparisonPeriod] = useState<'prior_period' | 'historical_baseline' | 'target_scenario'>('prior_period');

  // Animation and live-refresh trigger key
  const [refreshKey, setRefreshKey] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Interactive Data Drilldown state
  const [drilldownData, setDrilldownData] = useState<DrilldownInspection | null>(null);
  const [drilldownSearch, setDrilldownSearch] = useState<string>('');

  // Close drilldown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drilldownData) {
        setDrilldownData(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drilldownData]);

  // Active time-series dataset
  const activityData = useMemo(() => {
    switch (timeRange) {
      case '24h': return ACTIVITY_24H;
      case '7d': return ACTIVITY_7D;
      case '30d': return ACTIVITY_30D;
      default: return ACTIVITY_7D;
    }
  }, [timeRange]);

  // Dynamic resource consumption data with selected comparison overlay
  const resourceConsumptionData = useMemo(() => {
    return RESOURCE_ENERGY_DATA.map(item => {
      let compCompute = item.baselineComputeKWh;
      let compSolar = item.baselineSolarKWh;

      if (comparisonPeriod === 'prior_period') {
        compCompute = Math.round(item.computeKWh * 1.08);
        compSolar = Math.round(item.greenSolarKWh * 0.84);
      } else if (comparisonPeriod === 'historical_baseline') {
        compCompute = item.baselineComputeKWh;
        compSolar = item.baselineSolarKWh;
      } else if (comparisonPeriod === 'target_scenario') {
        compCompute = item.targetComputeKWh;
        compSolar = item.targetSolarKWh;
      }

      const compNetSurplus = compSolar - compCompute;
      const netDeltaVsComparison = item.netOffsetKWh - compNetSurplus;

      return {
        ...item,
        comparisonComputeKWh: compCompute,
        comparisonSolarKWh: compSolar,
        comparisonNetSurplusKWh: compNetSurplus,
        netDeltaVsComparison
      };
    });
  }, [comparisonPeriod]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live Telemetry Refresh
  const handleRefreshTelemetry = () => {
    hapticFeedback.triggerLightClickHaptic();
    audioFeedback.playMicroTick();
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);

    setTimeout(() => {
      setIsRefreshing(false);
      audioFeedback.playSuccess();
      showToast('Live telemetry streams synchronized with Merkle root attestation');
    }, 550);
  };

  // High-stakes action: generate signed cryptographic audit snapshot
  const handleGenerateAuditSnapshot = () => {
    hapticFeedback.triggerHighStakesHaptic();
    audioFeedback.playSyncComplete();
    showToast('Immutable Epistemic Audit Snapshot successfully generated & signed (0x4f9a...81bc)');
  };

  // High-stakes action: trigger resource rebalancing dispatch
  const handleResourceRebalance = () => {
    hapticFeedback.triggerWarningHaptic();
    audioFeedback.playAlertPing();
    showToast('Telemetry Alert: Sensor bandwidth prioritized for Aberdare Cloud Catchment');
  };

  // Export report to CSV
  const handleExportCSV = () => {
    hapticFeedback.triggerSuccessHaptic();
    audioFeedback.playSuccess();
    setIsExportingCsv(true);

    const timestamp = new Date().toISOString();
    const rows: string[] = [];

    // Header Metadata
    rows.push('# ATLAS SANCTUM CIVILIZATION OS 2.5 - MULTI-CAPITAL ANALYTICS & RESOURCE AUDIT');
    rows.push(`# Export Timestamp: ${timestamp}`);
    rows.push(`# Selected Temporal Interval: ${timeRange.toUpperCase()}`);
    rows.push(`# Bioregional Catchment Filter: ${selectedBioregion}`);
    rows.push(`# Comparison Mode Status: ${comparisonMode ? `ENABLED (${comparisonPeriod.toUpperCase()})` : 'DISABLED'}`);
    rows.push('');

    // Section 1: Executive KPI Metrics
    rows.push('--- SECTION 1: EXECUTIVE KEY PERFORMANCE INDICATORS ---');
    rows.push('Metric Name,Current Value,Audited Unit,Historical Variance,Attestation Verification Source');
    rows.push('Active Registered Stewards,48920,Stewards,+14.2% Growth,Bioregional Registry Soulbound Contract');
    rows.push('Renewable Compute Net Offset,1900,kWh,+132% Surplus,Solar Inverter & Micro-Hydro Telemetry');
    rows.push('Subsurface Aquifer Recharge Balance,23970,m3,Net Positive Surplus,Piezometric Subsurface Sensor Array');
    rows.push('Soil Carbon Sequestration,1785,tCO2e,+4.8 t/ha,Synthetic Aperture Radar & Soil Cores');
    rows.push('Active IoT Sensor Mesh Nodes,4290,Nodes,34ms p95 Latency,LoRaWAN Mesh Ingress Gateway');
    rows.push('Zero-Knowledge Epistemic Proofs,12600,Proofs,99.8% Verifiability,ZK-SNARK Rollup Verification');
    rows.push('');

    // Section 2: User Activity & Epistemic Engagement
    rows.push('--- SECTION 2: USER ACTIVITY & EPISTEMIC ENGAGEMENT TIME SERIES ---');
    rows.push(
      comparisonMode
        ? 'Time Interval,Active Stewards,Field Operatives,Epistemic Audits,System AI Queries,Comparison Baseline Stewards,Comparison Baseline Queries'
        : 'Time Interval,Active Stewards,Field Operatives,Epistemic Audits,System AI Queries'
    );
    activityData.forEach(row => {
      if (comparisonMode) {
        rows.push(`${row.time},${row.stewards},${row.fieldOperatives},${row.epistemicAudits},${row.aiQueries},${row.prevStewards || Math.round(row.stewards * 0.85)},${row.prevQueries || Math.round(row.aiQueries * 0.82)}`);
      } else {
        rows.push(`${row.time},${row.stewards},${row.fieldOperatives},${row.epistemicAudits},${row.aiQueries}`);
      }
    });
    rows.push('');

    // Section 3: Resource Consumption & Green Energy Balance
    rows.push('--- SECTION 3: RESOURCE CONSUMPTION & RENEWABLE ENERGY BALANCE (kWh) ---');
    rows.push(
      comparisonMode
        ? 'Epoch,Compute Consumption (kWh),Green Solar & Hydro Gen (kWh),Net Renewable Surplus (kWh),ZKP Gas Equivalent,Comparison Baseline Compute (kWh),Comparison Baseline Solar (kWh),Net Comparative Variance (kWh)'
        : 'Epoch,Compute Consumption (kWh),Green Solar & Hydro Gen (kWh),Net Renewable Surplus (kWh),ZKP Gas Equivalent'
    );
    resourceConsumptionData.forEach(row => {
      if (comparisonMode) {
        rows.push(`${row.epoch},${row.computeKWh},${row.greenSolarKWh},${row.netOffsetKWh},${row.zkpGasEquiv},${row.comparisonComputeKWh},${row.comparisonSolarKWh},${row.netDeltaVsComparison}`);
      } else {
        rows.push(`${row.epoch},${row.computeKWh},${row.greenSolarKWh},${row.netOffsetKWh},${row.zkpGasEquiv}`);
      }
    });
    rows.push('');

    // Section 4: Biophysical Water Recharge & Extraction
    rows.push('--- SECTION 4: BIOPHYSICAL WATER RECHARGE & EXTRACTION BY WATERSHED (m3) ---');
    rows.push('Watershed Catchment,Aquifer Recharge (m3),Human Community Extraction (m3),Net Replenishment Delta (m3),Soil Carbon Density (tCO2e),Hydrological Classification');
    BIOPHYSICAL_RESOURCES_DATA.forEach(row => {
      const net = row.waterRechargeM3 - row.waterExtractionM3;
      const classification = net > 2500 ? 'High Net Positive Reservoir' : net > 0 ? 'Sustainable Positive Recharge' : 'Ecological Stress Threshold';
      rows.push(`"${row.watershed}",${row.waterRechargeM3},${row.waterExtractionM3},${net},${row.soilCarbonTCO2e},${classification}`);
    });
    rows.push('');

    // Section 5: Operational Domain Allocation
    rows.push('--- SECTION 5: OPERATIONAL DOMAIN ALLOCATION & STEWARD DISTRIBUTION ---');
    rows.push('Operational Domain,Share Percentage (%),Active Registered Stewards,Certified Lead Auditors');
    DOMAIN_DISTRIBUTION.forEach(row => {
      rows.push(`"${row.name}",${row.value}%,${row.stewardsCount},${row.certifiedAuditors}`);
    });

    const csvBlob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atlas_analytics_report_${timeRange}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setIsExportingCsv(false);
      showToast('Comprehensive Analytics CSV successfully compiled & downloaded');
    }, 600);
  };

  // Export report to JSON
  const handleExportReport = () => {
    hapticFeedback.triggerSuccessHaptic();
    audioFeedback.playMicroTick();
    setIsExportingJson(true);

    const reportPayload = {
      system: 'Atlas Sanctum Civilization OS 2.5',
      reportType: 'Multi-Capital User Activity & Resource Consumption Audit',
      generatedAt: new Date().toISOString(),
      timeRange,
      selectedBioregion,
      comparisonMode: {
        active: comparisonMode,
        period: comparisonPeriod
      },
      summary: {
        totalActiveStewards: 48920,
        netSolarOffsetKWh: 8750,
        waterRechargeBalanceM3: '+23,970 m³ net surplus',
        carbonSequestrationTCO2e: '1,785 tCO2e audited',
        epistemicAttestationRate: '99.8%'
      },
      activityMetrics: activityData,
      resourceConsumption: resourceConsumptionData,
      biophysicalRecharge: BIOPHYSICAL_RESOURCES_DATA,
      domainBreakdown: DOMAIN_DISTRIBUTION
    };

    const dataBlob = new Blob([JSON.stringify(reportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atlas_analytics_report_${timeRange}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setIsExportingJson(false);
      showToast('Analytics report JSON exported successfully');
    }, 600);
  };

  // Interactive Data Drilldown Handlers
  const handleDrilldownActivity = (item: any) => {
    if (!item) return;
    hapticFeedback.triggerLightClickHaptic();
    audioFeedback.playSubtleClick();

    const totalStewards = item.stewards || 1200;
    const agroforestStewards = Math.round(totalStewards * 0.42);
    const waterGuardians = Math.round(totalStewards * 0.26);
    const remoteGISAuditors = Math.round(totalStewards * 0.18);
    const zkpArbiters = Math.round(totalStewards * 0.14);

    setDrilldownData({
      category: 'activity',
      badge: 'Epistemic Steward Engagement',
      title: `Interval: ${item.time} — Steward Engagement Drilldown`,
      subtitle: `Deep dive into constituent operative roles and audit verification transactions at timestamp ${item.time}.`,
      primaryMetric: {
        label: 'Active Stewards',
        value: `${totalStewards.toLocaleString()} stewards`,
        sublabel: `${item.fieldOperatives || 480} active in physical catchments`
      },
      secondaryMetric: {
        label: 'System AI Queries & Audits',
        value: `${(item.aiQueries || 1840).toLocaleString()} queries`
      },
      factors: [
        {
          id: 'act-1',
          name: 'Agroforestry Field Operatives & Tree Planting Crews',
          value: agroforestStewards,
          unit: 'stewards',
          sharePct: 42,
          status: 'optimal',
          nodeOrSource: 'Field Registry GPS Mesh',
          description: 'Certified soil samplers, indigenous sapling planters, and erosion barrier builders operating in Mara & Aberdare.'
        },
        {
          id: 'act-2',
          name: 'Community Elder Water Resource Guardians',
          value: waterGuardians,
          unit: 'guardians',
          sharePct: 26,
          status: 'optimal',
          nodeOrSource: 'Catchment Water Council DAO',
          description: 'Local catchment committee leads auditing spring headwaters, borehole draws, and riparian buffer integrity.'
        },
        {
          id: 'act-3',
          name: 'Remote GIS, Satellite & Drone Imagery Verifiers',
          value: remoteGISAuditors,
          unit: 'analysts',
          sharePct: 18,
          status: 'nominal',
          nodeOrSource: 'Sentinel-2 & Drone Ingress',
          description: 'Photogrammetric vegetation index (NDVI) ground-truth verification and synthetic aperture radar soil moisture cross-referencing.'
        },
        {
          id: 'act-4',
          name: 'Cryptographic ZK Epistemic Attestation Arbiters',
          value: zkpArbiters,
          unit: 'arbiters',
          sharePct: 14,
          status: 'optimal',
          nodeOrSource: 'Merkle Tree Witness Nodes',
          description: 'Validating zero-knowledge state updates, smart contract tranches, and moral boundary compliance proofs.'
        }
      ],
      telemetryProofHash: `0x7a3f${item.time.replace(/[^a-zA-Z0-9]/g, '')}9b21a8cd34e129`,
      recommendation: 'Operative distribution meets 100% of minimum bioregional safety covenants with positive quorum velocity.'
    });
  };

  const handleDrilldownResource = (item: any) => {
    if (!item) return;
    hapticFeedback.triggerLightClickHaptic();
    audioFeedback.playSubtleClick();

    const computeKWh = item.computeKWh || 4500;
    const greenSolarKWh = item.greenSolarKWh || 5600;
    const netOffsetKWh = item.netOffsetKWh || 1100;

    setDrilldownData({
      category: 'resource',
      badge: 'Renewable Power & Compute Audit',
      title: `Epoch: ${item.epoch} — Energy Footprint & Generation Breakdown`,
      subtitle: `Constituent breakdown of clean microgrid power sources vs. decentralized cryptographic node power draw.`,
      primaryMetric: {
        label: 'Net Clean Energy Surplus',
        value: `+${netOffsetKWh.toLocaleString()} kWh`,
        sublabel: `${greenSolarKWh.toLocaleString()} kWh produced vs ${computeKWh.toLocaleString()} kWh consumed`
      },
      secondaryMetric: {
        label: 'ZKP Gas Footprint Equivalent',
        value: `${item.zkpGasEquiv || 190} gwei eq.`
      },
      factors: [
        {
          id: 'pwr-1',
          name: 'Rooftop Agrivoltaic Microgrid Array Alpha',
          value: Math.round(greenSolarKWh * 0.44),
          unit: 'kWh',
          sharePct: 44,
          status: 'optimal',
          nodeOrSource: 'Inverter Array Alpha (340kWp)',
          description: 'Dual-axis tracking bifacial panels integrated over highland tea crop nurseries providing shade and energy.'
        },
        {
          id: 'pwr-2',
          name: 'Valley Solar Farm & Battery Storage Array Beta',
          value: Math.round(greenSolarKWh * 0.36),
          unit: 'kWh',
          sharePct: 36,
          status: 'optimal',
          nodeOrSource: 'Inverter Array Beta (280kWp)',
          description: 'Direct current high-density LFP storage buffer maintaining nighttime node execution.'
        },
        {
          id: 'pwr-3',
          name: 'Run-of-River Pelton Micro-Hydro Generator',
          value: Math.round(greenSolarKWh * 0.20),
          unit: 'kWh',
          sharePct: 20,
          status: 'nominal',
          nodeOrSource: 'Turbine Hydro-1 (Aberdare Fall)',
          description: 'Continuous low-head ecological hydro unit capturing gravitational stream head with zero damming.'
        },
        {
          id: 'comp-1',
          name: 'ZK-SNARK Cryptographic Prover Node Clusters',
          value: Math.round(computeKWh * 0.46),
          unit: 'kWh',
          sharePct: 46,
          status: 'nominal',
          nodeOrSource: 'Prover Cluster East (GPU Mesh)',
          description: 'Heavy compute cluster generating recursive Merkle inclusion proofs for thousands of ecological sensor readings.'
        },
        {
          id: 'comp-2',
          name: 'Distributed BFT Consensus & Database Replicas',
          value: Math.round(computeKWh * 0.28),
          unit: 'kWh',
          sharePct: 28,
          status: 'optimal',
          nodeOrSource: 'Civilization OS Edge Nodes',
          description: 'Local Byzantine Fault Tolerant node validation ensuring offline-first consistency across bioregions.'
        },
        {
          id: 'comp-3',
          name: 'IoT Telemetry Ingress & LoRaWAN Base Stations',
          value: Math.round(computeKWh * 0.26),
          unit: 'kWh',
          sharePct: 26,
          status: 'optimal',
          nodeOrSource: 'Solar Gateway Relays (4,290 Nodes)',
          description: 'Ultra-low power radio packet ingestion, filtering out noise and duplicate sensor bursts.'
        }
      ],
      telemetryProofHash: `0x9d4e${item.epoch}7721bf63a0991c`,
      recommendation: `Achieved 100% renewable self-sufficiency with ${netOffsetKWh} kWh exported to rural community microgrids.`
    });
  };

  const handleDrilldownWatershed = (item: any) => {
    if (!item) return;
    hapticFeedback.triggerLightClickHaptic();
    audioFeedback.playSubtleClick();

    const recharge = item.waterRechargeM3 || 4820;
    const extraction = item.waterExtractionM3 || 1240;
    const netSurplus = recharge - extraction;

    setDrilldownData({
      category: 'watershed',
      badge: 'Biophysical Hydrological Balance',
      title: `${item.watershed} — Subsurface Aquifer Dynamics`,
      subtitle: `Constituent infiltration mechanics, soil moisture recharge zones, and community gravity-fed tap off-takes.`,
      primaryMetric: {
        label: 'Net Aquifer Balance',
        value: `+${netSurplus.toLocaleString()} m³`,
        sublabel: `${recharge.toLocaleString()} m³ replenishment vs ${extraction.toLocaleString()} m³ drawn`
      },
      secondaryMetric: {
        label: 'Audited Soil Carbon Density',
        value: `${item.soilCarbonTCO2e || 380} tCO2e`
      },
      factors: [
        {
          id: 'h2o-1',
          name: 'Indigenous Cloud Forest Sponge Infiltration',
          value: Math.round(recharge * 0.52),
          unit: 'm³',
          sharePct: 52,
          status: 'optimal',
          nodeOrSource: 'Headwater Piezometer Array H-1',
          description: 'Upper montane mist interception and deep root channel percolation into subterranean basalt aquifers.'
        },
        {
          id: 'h2o-2',
          name: 'Keyline Swales & Permaculture Retention Basins',
          value: Math.round(recharge * 0.32),
          unit: 'm³',
          sharePct: 32,
          status: 'optimal',
          nodeOrSource: 'Valley Catchment Sensors S-4',
          description: 'Contour ditches slowing, spreading, and sinking monsoon runoff into mid-slope soil moisture banks.'
        },
        {
          id: 'h2o-3',
          name: 'Vegetative Riparian Bamboo Wetland Filter Banks',
          value: Math.round(recharge * 0.16),
          unit: 'm³',
          sharePct: 16,
          status: 'optimal',
          nodeOrSource: 'Riparian Buffer Probe R-2',
          description: 'Native clumping bamboo stands filtering sediment, cooling water, and maintaining base streamflow.'
        },
        {
          id: 'draw-1',
          name: 'Community Gravity-Fed Domestic Water Points',
          value: Math.round(extraction * 0.58),
          unit: 'm³',
          sharePct: 58,
          status: 'optimal',
          nodeOrSource: 'Metered Village Kiosks (14 Units)',
          description: 'Zero-power gravity piping delivering clean potable drinking water to 18,000 local community households.'
        },
        {
          id: 'draw-2',
          name: 'Agroecological Drip Irrigation Cooperative Draw',
          value: Math.round(extraction * 0.42),
          unit: 'm³',
          sharePct: 42,
          status: 'nominal',
          nodeOrSource: 'Irrigation Flow Meters I-7',
          description: 'Soil-sensor triggered pulse drip lines feeding community food forests and organic vegetable plots.'
        }
      ],
      telemetryProofHash: `0x51ab${item.watershed.replace(/[^a-zA-Z0-9]/g, '')}8819ef3`,
      recommendation: 'Aquifer recharge rate exceeds total anthropocentric extraction by 3.8x. Planetary boundary safely maintained.'
    });
  };

  const handleDrilldownDomain = (item: any) => {
    if (!item) return;
    hapticFeedback.triggerLightClickHaptic();
    audioFeedback.playSubtleClick();

    setDrilldownData({
      category: 'domain',
      badge: 'Civilizational Functional Domain',
      title: `${item.name} — Operational Domain Breakdown`,
      subtitle: `Steward mobilization allocation, certified auditor counts, and active quadratic funding grant tranches.`,
      primaryMetric: {
        label: 'Domain Engagement Share',
        value: `${item.value}% of collective actions`,
        sublabel: `${(item.stewardsCount || 12000).toLocaleString()} assigned stewards`
      },
      secondaryMetric: {
        label: 'Certified Lead Auditors',
        value: `${item.certifiedAuditors || 420} auditors`
      },
      factors: [
        {
          id: 'dom-1',
          name: 'Active Field Projects & Regional Guilds',
          value: 48,
          unit: 'projects',
          sharePct: 45,
          status: 'optimal',
          nodeOrSource: 'Guild Registry Contract',
          description: 'Self-organizing steward circles with verifiable bioregional deliverables.'
        },
        {
          id: 'dom-2',
          name: 'Disbursed Milestone Tranches (Multi-Capital)',
          value: 385000,
          unit: 'credits',
          sharePct: 35,
          status: 'optimal',
          nodeOrSource: 'Smart Contract Escrow 0x4f...91',
          description: 'Regenerative capital distributed directly upon cryptographic verification of ecological impact milestones.'
        },
        {
          id: 'dom-3',
          name: 'Audited Telemetry Attestations & IoT Ingress',
          value: 14200,
          unit: 'attestations',
          sharePct: 20,
          status: 'optimal',
          nodeOrSource: 'ZK Merkle Rollup',
          description: 'Hardware signed sensor verification records proving soil carbon increases and water replenishment.'
        }
      ],
      telemetryProofHash: `0x32cf${item.name.replace(/[^a-zA-Z0-9]/g, '')}aa7810`,
      recommendation: 'Resource flow distribution matches target quadratic voting allocations determined by steward community assembly.'
    });
  };

  const handleDrilldownTelemetry = (item: any) => {
    if (!item) return;
    hapticFeedback.triggerLightClickHaptic();
    audioFeedback.playSubtleClick();

    setDrilldownData({
      category: 'telemetry',
      badge: 'Hardware Mesh Ingress',
      title: `Stream Timestamp: ${item.minute} — Telemetry Ingress Breakdown`,
      subtitle: `Protocol throughput across 4,200+ hardware piezometers, solar inverters, weather stations, and flux towers.`,
      primaryMetric: {
        label: 'Packet Ingress Rate',
        value: `${item.packetRateKBs} KB/s`,
        sublabel: `${item.activeSensors} verified hardware nodes active`
      },
      secondaryMetric: {
        label: 'Network p95 Latency',
        value: `${item.latencyMs} ms`
      },
      factors: [
        {
          id: 'tel-1',
          name: 'LoRaWAN Long-Range Mesh Radios (868MHz)',
          value: Math.round(item.activeSensors * 0.62),
          unit: 'nodes',
          sharePct: 62,
          status: 'optimal',
          nodeOrSource: 'Base Gateway Station Mesh',
          description: 'Solar-powered transmitters deployed across rugged topography sending hydrostatic level and moisture telemetry.'
        },
        {
          id: 'tel-2',
          name: 'Cellular Narrowband IoT (NB-IoT) Relays',
          value: Math.round(item.activeSensors * 0.24),
          unit: 'nodes',
          sharePct: 24,
          status: 'optimal',
          nodeOrSource: 'High-Throughput Cell Hubs',
          description: 'Direct cellular links for high-frequency acoustic water leak detection and electrical microgrid phase monitoring.'
        },
        {
          id: 'tel-3',
          name: 'Satellite Store-and-Forward LEO Transceivers',
          value: Math.round(item.activeSensors * 0.14),
          unit: 'nodes',
          sharePct: 14,
          status: 'nominal',
          nodeOrSource: 'Orbital Uplink Dish 3',
          description: 'Guaranteed fallback communications for remote deep-wilderness sensors outside terrestrial coverage.'
        }
      ],
      telemetryProofHash: `0x88ea${item.minute}0199ba`,
      recommendation: 'Packet loss rate under 0.002%. Zero sensor dropouts across entire catchment boundary.'
    });
  };

  // Export specific drilldown factors to CSV
  const handleExportDrilldownCSV = () => {
    if (!drilldownData) return;
    hapticFeedback.triggerSuccessHaptic();
    audioFeedback.playSuccess();

    const rows: string[] = [];
    rows.push(`# ATLAS SANCTUM DRILLDOWN INSPECTION AUDIT`);
    rows.push(`# Subject: ${drilldownData.title}`);
    rows.push(`# Category: ${drilldownData.category.toUpperCase()}`);
    rows.push(`# Primary Metric: ${drilldownData.primaryMetric.label} = ${drilldownData.primaryMetric.value}`);
    rows.push(`# Cryptographic Attestation Proof: ${drilldownData.telemetryProofHash}`);
    rows.push(`# Exported At: ${new Date().toISOString()}`);
    rows.push('');
    rows.push('Factor ID,Constituent Factor Name,Measured Value,Audited Unit,Share Percentage (%),Status,Telemetry Node / Sensor Origin,Ecological Rationale');

    drilldownData.factors.forEach(f => {
      rows.push(`"${f.id}","${f.name}",${f.value},"${f.unit || ''}",${f.sharePct || 0},"${f.status}","${f.nodeOrSource}","${f.description.replace(/"/g, '""')}"`);
    });

    const csvBlob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atlas_drilldown_${drilldownData.category}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    showToast('Constituent factors exported to CSV successfully');
  };

  // Filtered drilldown factors based on user search
  const filteredFactors = useMemo(() => {
    if (!drilldownData) return [];
    if (!drilldownSearch.trim()) return drilldownData.factors;
    const q = drilldownSearch.toLowerCase();
    return drilldownData.factors.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.nodeOrSource.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q)
    );
  }, [drilldownData, drilldownSearch]);

  return (
    <div className="min-h-screen bg-[#070B08] text-[#F5F5F0] font-sans p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-3.5 rounded-xl bg-[#14261B] border border-emerald-500/50 text-emerald-200 text-xs shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-mono">{toastMessage}</span>
        </div>
      )}

      {/* View Header & Primary Navigation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-lg bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                Analytics Report
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                Live Telemetry
              </span>
              {comparisonMode && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                  <GitCompare className="w-3 h-3" /> Comparison Mode
                </span>
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 max-w-3xl">
            Empirical visibility into global steward engagement, collective governance actions, renewable compute consumption, and watershed biophysical replenishment. Click any data point to inspect constituent factors.
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Comparison Mode Toggle */}
          <button
            id="toggle-comparison-mode-btn"
            onClick={() => {
              hapticFeedback.triggerLightClickHaptic();
              audioFeedback.playMicroTick();
              const nextState = !comparisonMode;
              setComparisonMode(nextState);
              showToast(nextState ? `Comparison Mode enabled (${comparisonPeriod})` : 'Comparison Mode disabled');
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              comparisonMode
                ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-[#0F1711] border-[#F5F5F0]/15 text-neutral-400 hover:text-white hover:border-[#F5F5F0]/30'
            }`}
            title="Toggle comparative baseline overlay across performance periods"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Comparison Mode</span>
            <span className={`w-2 h-2 rounded-full ${comparisonMode ? 'bg-cyan-400 animate-pulse' : 'bg-neutral-600'}`} />
          </button>

          {/* Time Range Selector */}
          <div className="flex items-center bg-[#0F1711] p-1 rounded-lg border border-[#F5F5F0]/15 text-xs font-mono">
            {(['24h', '7d', '30d'] as const).map(range => (
              <button
                key={range}
                onClick={() => {
                  hapticFeedback.triggerLightClickHaptic();
                  audioFeedback.playMicroTick();
                  setTimeRange(range);
                }}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium ${
                  timeRange === range
                    ? 'bg-[#1D3023] text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Bioregion Filter */}
          <select
            value={selectedBioregion}
            onChange={(e) => {
              hapticFeedback.triggerLightClickHaptic();
              setSelectedBioregion(e.target.value);
            }}
            aria-label="Filter by Bioregion"
            className="px-3 py-1.5 bg-[#0F1711] border border-[#F5F5F0]/15 rounded-lg text-xs font-mono text-neutral-300 focus:outline-none focus:border-[#C5A059] cursor-pointer"
          >
            <option value="all">Global (All Catchments)</option>
            <option value="mara">Mara Basin</option>
            <option value="aberdare">Aberdare Cloud Catchment</option>
            <option value="naivasha">Lake Naivasha</option>
            <option value="rift">Great Rift Semi-Arid</option>
          </select>

          {/* Refresh Telemetry Button */}
          <button
            id="refresh-analytics-btn"
            onClick={handleRefreshTelemetry}
            disabled={isRefreshing}
            title="Re-synchronize with live telemetry ingress"
            className="p-2 bg-[#0F1711] hover:bg-[#1A251D] border border-[#F5F5F0]/15 rounded-lg text-neutral-300 hover:text-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* CSV Export Button */}
          <button
            id="export-analytics-csv-btn"
            onClick={handleExportCSV}
            disabled={isExportingCsv}
            title="Export analytical data as RFC-compliant CSV for external documentation and offline archival"
            className="px-3.5 py-1.5 bg-[#142A1D] hover:bg-[#1E3B29] text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isExportingCsv ? 'Exporting CSV...' : 'Export CSV'}</span>
          </button>

          {/* JSON Export Button */}
          <button
            id="export-analytics-json-btn"
            onClick={handleExportReport}
            disabled={isExportingJson}
            className="px-3.5 py-1.5 bg-[#C5A059] hover:bg-[#B38E46] text-black font-mono font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingJson ? 'Exporting...' : 'Export JSON'}</span>
          </button>
        </div>
      </div>

      {/* Comparison Mode Configuration Ribbon (when Comparison Mode is Active) */}
      <AnimatePresence>
        {comparisonMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 sm:p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-300">
                <GitCompare className="w-4 h-4 shrink-0 text-cyan-400" />
                <span className="font-bold">Comparative Baseline Active:</span>
                <span className="text-neutral-300 text-[11px]">
                  Charts are rendering comparative baselines (dashed lines) alongside live metrics to quantify resource efficiency improvements.
                </span>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="text-neutral-400 text-[11px]">Baseline Epoch:</span>
                <div className="flex items-center bg-[#071317] p-0.5 rounded-lg border border-cyan-500/30">
                  <button
                    onClick={() => {
                      hapticFeedback.triggerLightClickHaptic();
                      setComparisonPeriod('prior_period');
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      comparisonPeriod === 'prior_period'
                        ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-400/40'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Prior Period (-1 Cycle)
                  </button>
                  <button
                    onClick={() => {
                      hapticFeedback.triggerLightClickHaptic();
                      setComparisonPeriod('historical_baseline');
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      comparisonPeriod === 'historical_baseline'
                        ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-400/40'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Historical 2025 Baseline
                  </button>
                  <button
                    onClick={() => {
                      hapticFeedback.triggerLightClickHaptic();
                      setComparisonPeriod('target_scenario');
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      comparisonPeriod === 'target_scenario'
                        ? 'bg-cyan-900/80 text-cyan-200 border border-cyan-400/40'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    2030 Civilization Target
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Highlight Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0C120E] border border-[#F5F5F0]/10">
          <div className="flex items-center justify-between text-neutral-400 text-[11px] font-mono mb-1">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Active Stewards
            </span>
            <span className="text-emerald-400 flex items-center text-[10px]">
              +14.2% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-lg font-bold font-serif text-white">48,920</div>
          <div className="text-[10px] text-neutral-500 font-mono">1,840 field certified</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0C120E] border border-[#F5F5F0]/10">
          <div className="flex items-center justify-between text-neutral-400 text-[11px] font-mono mb-1">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Compute Net Offset
            </span>
            <span className="text-emerald-400 flex items-center text-[10px]">
              +132% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-lg font-bold font-serif text-amber-300">1,900 kWh</div>
          <div className="text-[10px] text-neutral-500 font-mono">Solar surplus generation</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0C120E] border border-[#F5F5F0]/10">
          <div className="flex items-center justify-between text-neutral-400 text-[11px] font-mono mb-1">
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              Water Balance
            </span>
            <span className="text-cyan-400 text-[10px]">Net Positive</span>
          </div>
          <div className="text-lg font-bold font-serif text-cyan-300">+23,970 m³</div>
          <div className="text-[10px] text-neutral-500 font-mono">Subsurface recharge</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0C120E] border border-[#F5F5F0]/10">
          <div className="flex items-center justify-between text-neutral-400 text-[11px] font-mono mb-1">
            <span className="flex items-center gap-1">
              <TreePine className="w-3.5 h-3.5 text-emerald-400" />
              Soil Carbon Density
            </span>
            <span className="text-emerald-400 text-[10px]">+4.8 t/ha</span>
          </div>
          <div className="text-lg font-bold font-serif text-emerald-300">1,785 tCO2e</div>
          <div className="text-[10px] text-neutral-500 font-mono">Satellite verified</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0C120E] border border-[#F5F5F0]/10">
          <div className="flex items-center justify-between text-neutral-400 text-[11px] font-mono mb-1">
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-[#C5A059]" />
              IoT Sensor Mesh
            </span>
            <span className="text-[#C5A059] text-[10px]">Active</span>
          </div>
          <div className="text-lg font-bold font-serif text-white">4,290 Nodes</div>
          <div className="text-[10px] text-neutral-500 font-mono">34ms p95 latency</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0C120E] border border-[#F5F5F0]/10">
          <div className="flex items-center justify-between text-neutral-400 text-[11px] font-mono mb-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Merkle Audits
            </span>
            <span className="text-purple-300 text-[10px]">99.8% ZKP</span>
          </div>
          <div className="text-lg font-bold font-serif text-purple-300">12,600 Proofs</div>
          <div className="text-[10px] text-neutral-500 font-mono">Zero discrepancy</div>
        </div>
      </div>

      {/* Row 1: Primary User Activity (AreaChart) & Category Distribution (PieChart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: User Activity Over Time */}
        <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#090D0A] border border-[#F5F5F0]/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                User Activity & Epistemic Engagement Dynamics
              </h2>
              <p className="text-xs text-neutral-400 font-sans">
                Real-time breakdown of active stewards, field operatives, epistemic audit verifications, and agentic queries.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Click point to drill down
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#C5A059] border border-white/10">
                Interval: {timeRange.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2 cursor-pointer">
            <ResponsiveContainer key={`activity-chart-${timeRange}-${comparisonMode}-${refreshKey}`} width="100%" height="100%">
              <AreaChart
                data={activityData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    handleDrilldownActivity(e.activePayload[0].payload);
                  }
                }}
              >
                <defs>
                  <linearGradient id="colorStewards" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorOperatives" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#263429" opacity={0.5} />
                <XAxis dataKey="time" stroke="#7E8B82" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#7E8B82" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B120E', borderColor: '#10B981', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#F5F5F0' }}
                  formatter={(value: any, name: any) => [
                    `${typeof value === 'number' ? value.toLocaleString() : value}`,
                    name
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }} />
                
                {/* Active Metric Series with smooth animation transitions */}
                <Area
                  type="monotone"
                  dataKey="stewards"
                  name="Active Stewards"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorStewards)"
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                  animationBegin={100}
                />
                <Area
                  type="monotone"
                  dataKey="fieldOperatives"
                  name="Field Operatives"
                  stroke="#06B6D4"
                  strokeWidth={1.8}
                  fillOpacity={1}
                  fill="url(#colorOperatives)"
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                  animationBegin={150}
                />
                <Area
                  type="monotone"
                  dataKey="aiQueries"
                  name="System Queries"
                  stroke="#C5A059"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorQueries)"
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                  animationBegin={200}
                />

                {/* Comparison Baseline Overlay (when Comparison Mode is Active) */}
                {comparisonMode && (
                  <Line
                    type="monotone"
                    dataKey="prevStewards"
                    name="Comparison Baseline Stewards"
                    stroke="#6EE7B7"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#6EE7B7' }}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 4 Cols: Domain Distribution (Donut PieChart) */}
        <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#090D0A] border border-[#F5F5F0]/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-white text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C5A059]" />
                Activity by Operational Domain
              </h2>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-neutral-400">
                Click slice
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Proportion of steward actions by civilizational functional layer.
            </p>
          </div>

          <div className="h-[200px] w-full relative flex items-center justify-center cursor-pointer">
            <ResponsiveContainer key={`domain-pie-${refreshKey}`} width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DOMAIN_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={850}
                  animationEasing="ease-out"
                  onClick={(entry) => handleDrilldownDomain(entry)}
                >
                  {DOMAIN_DISTRIBUTION.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#090D0A"
                      strokeWidth={2}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Engagement Share']}
                  contentStyle={{ backgroundColor: '#0B120E', borderColor: '#C5A059', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-mono text-neutral-400">Total</span>
              <span className="text-lg font-serif font-bold text-white">100%</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-white/10 text-[11px] font-mono">
            {DOMAIN_DISTRIBUTION.map(item => (
              <button
                key={item.name}
                onClick={() => handleDrilldownDomain(item)}
                className="w-full flex items-center justify-between text-neutral-300 hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate max-w-[170px]">{item.name}</span>
                </span>
                <span className="font-bold text-white flex items-center gap-1">
                  {item.value}%
                  <ChevronRight className="w-3 h-3 text-neutral-500" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Resource Consumption & Green Compute Offset (ComposedChart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Energy Footprint vs. Solar Offset */}
        <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-[#090D0A] border border-[#F5F5F0]/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Resource Consumption & Green Energy Balance
              </h2>
              <p className="text-xs text-neutral-400 font-sans">
                Compute & ZKP energy footprint (kWh) balanced against dedicated on-site solar & micro-hydro generation.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-950/40 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-mono">
              <Sparkles className="w-3 h-3" />
              100% Carbon Negative Run
            </div>
          </div>

          <div className="h-[280px] w-full pt-2 cursor-pointer">
            <ResponsiveContainer key={`composed-chart-${comparisonMode}-${comparisonPeriod}-${refreshKey}`} width="100%" height="100%">
              <ComposedChart
                data={resourceConsumptionData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    handleDrilldownResource(e.activePayload[0].payload);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#263429" opacity={0.5} />
                <XAxis dataKey="epoch" stroke="#7E8B82" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#7E8B82" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B120E', borderColor: '#F59E0B', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#F5F5F0' }}
                  formatter={(value: any, name: any) => [
                    `${typeof value === 'number' ? value.toLocaleString() : value} kWh`,
                    name
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }} />

                {/* Primary Resource Series */}
                <Bar
                  dataKey="computeKWh"
                  name="Compute Consumption (kWh)"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                  opacity={0.8}
                  isAnimationActive={true}
                  animationDuration={850}
                  animationEasing="ease-out"
                  onClick={(entry) => handleDrilldownResource(entry)}
                />
                <Bar
                  dataKey="greenSolarKWh"
                  name="Solar / Renewable Gen (kWh)"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={850}
                  animationEasing="ease-out"
                  onClick={(entry) => handleDrilldownResource(entry)}
                />
                <Line
                  type="monotone"
                  dataKey="netOffsetKWh"
                  name="Net Renewable Surplus (kWh)"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#F59E0B' }}
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                />

                {/* Comparative Overlays when Comparison Mode is Active */}
                {comparisonMode && (
                  <Line
                    type="monotone"
                    dataKey="comparisonComputeKWh"
                    name={`Baseline Compute (${comparisonPeriod === 'prior_period' ? 'Prior Cycle' : comparisonPeriod === 'historical_baseline' ? '2025' : 'Target'})`}
                    stroke="#F87171"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    isAnimationActive={true}
                    animationDuration={850}
                    animationEasing="ease-out"
                  />
                )}
                {comparisonMode && (
                  <Line
                    type="monotone"
                    dataKey="comparisonSolarKWh"
                    name={`Baseline Solar (${comparisonPeriod === 'prior_period' ? 'Prior Cycle' : comparisonPeriod === 'historical_baseline' ? '2025' : 'Target'})`}
                    stroke="#34D399"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    isAnimationActive={true}
                    animationDuration={850}
                    animationEasing="ease-out"
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 Cols: Watershed Biophysical Recharge Balance (BarChart) */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#090D0A] border border-[#F5F5F0]/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                Biophysical Water Recharge by Watershed
              </h2>
              <p className="text-xs text-neutral-400 font-sans">
                Groundwater aquifer recharge (m³) vs. human community extraction.
              </p>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
              Click bar
            </span>
          </div>

          <div className="h-[280px] w-full pt-2 cursor-pointer">
            <ResponsiveContainer key={`watershed-bar-${refreshKey}`} width="100%" height="100%">
              <BarChart
                data={BIOPHYSICAL_RESOURCES_DATA}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    handleDrilldownWatershed(e.activePayload[0].payload);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#263429" opacity={0.5} />
                <XAxis type="number" stroke="#7E8B82" fontSize={10} fontFamily="monospace" />
                <YAxis dataKey="watershed" type="category" stroke="#7E8B82" fontSize={10} fontFamily="monospace" width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B120E', borderColor: '#06B6D4', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#F5F5F0' }}
                  formatter={(val: any, name: any) => [`${typeof val === 'number' ? val.toLocaleString() : val} m³`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }} />
                <Bar
                  dataKey="waterRechargeM3"
                  name="Aquifer Recharge (m³)"
                  fill="#06B6D4"
                  radius={[0, 4, 4, 0]}
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                  onClick={(entry) => handleDrilldownWatershed(entry)}
                />
                <Bar
                  dataKey="waterExtractionM3"
                  name="Extraction (m³)"
                  fill="#64748B"
                  radius={[0, 4, 4, 0]}
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                  onClick={(entry) => handleDrilldownWatershed(entry)}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Live Telemetry Sensor Throughput & Epistemic Audit Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: IoT Stream Throughput (LineChart) */}
        <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#090D0A] border border-[#F5F5F0]/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-white text-base flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#C5A059]" />
                Live Sensor Telemetry Bandwidth & Ingress
              </h2>
              <p className="text-xs text-neutral-400 font-sans">
                Real-time telemetry packet throughput across 4,200+ hardware piezometers and flux towers.
              </p>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Stream Synchronized
            </span>
          </div>

          <div className="h-[220px] w-full cursor-pointer">
            <ResponsiveContainer key={`telemetry-line-${refreshKey}`} width="100%" height="100%">
              <LineChart
                data={TELEMETRY_STREAM_DATA}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    handleDrilldownTelemetry(e.activePayload[0].payload);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#263429" opacity={0.5} />
                <XAxis dataKey="minute" stroke="#7E8B82" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#7E8B82" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B120E', borderColor: '#C5A059', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#F5F5F0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '6px' }} />
                <Line
                  type="monotone"
                  dataKey="packetRateKBs"
                  name="Ingress Rate (KB/s)"
                  stroke="#C5A059"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  isAnimationActive={true}
                  animationDuration={850}
                  animationEasing="ease-out"
                />
                <Line
                  type="monotone"
                  dataKey="latencyMs"
                  name="p95 Latency (ms)"
                  stroke="#06B6D4"
                  strokeWidth={1.8}
                  dot={{ r: 3 }}
                  isAnimationActive={true}
                  animationDuration={850}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 4 Cols: High Stakes Actions (Haptic Vibration Triggered) */}
        <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#090D0A] border-2 border-[#C5A059]/40 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
              <h3 className="font-serif font-bold text-white text-base">
                Epistemic Audit & Control
              </h3>
            </div>
            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              Execute verified on-chain state commitments or adjust priority bandwidth. Actions generate firm mobile haptic feedback.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleGenerateAuditSnapshot}
              className="w-full py-2.5 px-4 bg-[#182B1E] hover:bg-[#203A28] border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Generate Signed Audit Snapshot</span>
            </button>

            <button
              onClick={handleResourceRebalance}
              className="w-full py-2.5 px-4 bg-[#1C150A] hover:bg-[#2B210E] border border-amber-500/50 text-amber-300 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Rebalance Watershed Priority Mesh</span>
            </button>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
            <span>Haptic Engine:</span>
            <span className="text-emerald-400 font-bold">
              {hapticFeedback.isSupported() ? 'Vibration API Active' : 'Fallback Mode'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Data Drilldown Modal */}
      <AnimatePresence>
        {drilldownData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-3xl max-h-[90vh] bg-[#0B120E] border border-[#C5A059]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#F5F5F0]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 bg-[#070D09] flex items-start justify-between gap-3 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                      {drilldownData.badge}
                    </span>
                    <span className="text-neutral-400 text-xs font-mono">
                      Constituent Factors Breakdown
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                    {drilldownData.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-sans mt-0.5">
                    {drilldownData.subtitle}
                  </p>
                </div>

                <button
                  onClick={() => setDrilldownData(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Close drilldown view (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Primary Metrics Strip */}
              <div className="px-4 sm:px-5 py-3 bg-[#0E1712] border-b border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <div className="text-[11px] font-mono text-neutral-400">
                    {drilldownData.primaryMetric.label}
                  </div>
                  <div className="text-lg font-serif font-bold text-emerald-300">
                    {drilldownData.primaryMetric.value}
                  </div>
                  {drilldownData.primaryMetric.sublabel && (
                    <div className="text-[10px] font-mono text-neutral-500">
                      {drilldownData.primaryMetric.sublabel}
                    </div>
                  )}
                </div>

                {drilldownData.secondaryMetric && (
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <div className="text-[11px] font-mono text-neutral-400">
                      {drilldownData.secondaryMetric.label}
                    </div>
                    <div className="text-lg font-serif font-bold text-[#C5A059]">
                      {drilldownData.secondaryMetric.value}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500">
                      Telemetry Proof: {drilldownData.telemetryProofHash.substring(0, 16)}...
                    </div>
                  </div>
                )}
              </div>

              {/* Search / Filter Toolbar */}
              <div className="px-4 sm:px-5 py-2.5 bg-[#09100B] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={drilldownSearch}
                    onChange={(e) => setDrilldownSearch(e.target.value)}
                    placeholder="Filter constituent factors..."
                    className="w-full pl-8 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs font-mono text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <button
                  onClick={handleExportDrilldownCSV}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  title="Export constituent factors for this specific data point to CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export Factors CSV</span>
                  <span className="sm:hidden">CSV</span>
                </button>
              </div>

              {/* Constituent Factors List (Scrollable) */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
                {filteredFactors.length === 0 ? (
                  <div className="p-8 text-center text-neutral-400 text-xs font-mono">
                    No constituent factors match the search query.
                  </div>
                ) : (
                  filteredFactors.map((factor) => (
                    <div
                      key={factor.id}
                      className="p-3.5 rounded-xl bg-[#09110D] border border-white/10 space-y-2 hover:border-[#C5A059]/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                          <span className="font-serif font-bold text-white text-sm">
                            {factor.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="font-bold text-emerald-300">
                            {typeof factor.value === 'number' ? factor.value.toLocaleString() : factor.value} {factor.unit}
                          </span>
                          {factor.sharePct !== undefined && (
                            <span className="px-1.5 py-0.5 rounded bg-white/5 text-[#C5A059] text-[10px] border border-white/10">
                              {factor.sharePct}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Share Progress Bar */}
                      {factor.sharePct !== undefined && (
                        <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-[#C5A059] rounded-full"
                            style={{ width: `${factor.sharePct}%` }}
                          />
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-neutral-400 font-sans">
                        <p className="leading-relaxed">
                          {factor.description}
                        </p>
                        <span className="font-mono text-[10px] text-neutral-500 shrink-0 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                          Source: {factor.nodeOrSource}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#070D09] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 text-xs font-mono">
                <div className="flex items-center gap-2 text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate max-w-xs sm:max-w-md">
                    Attestation Hash: <span className="text-neutral-300">{drilldownData.telemetryProofHash}</span>
                  </span>
                </div>

                <button
                  onClick={() => setDrilldownData(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors cursor-pointer font-bold self-end sm:self-auto"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
