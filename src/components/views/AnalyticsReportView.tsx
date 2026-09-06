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
  Legend,
  ReferenceLine
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
  Info,
  Palette,
  Tag,
  Pin,
  Plus,
  Trash2,
  Play,
  Pause,
  TrendingUp,
  Gauge,
  SlidersHorizontal,
  Bookmark,
  Edit3,
  Bell,
  Globe,
  Camera,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioFeedback, hapticFeedback } from '../../lib/audioFeedback';
import {
  generatePredictiveResourceForecast,
  PredictiveConfig,
  ForecastScenario
} from '../analytics/PredictiveTrendsEngine';
import {
  AlertManagerModal,
  MissionAlertBanner,
  MetricAlertRule,
  TriggeredMissionAlert,
  DEFAULT_ALERT_RULES,
  AlertMetricKey
} from '../analytics/AlertNotificationSystem';
import {
  ExternalApiSyncModal,
  ExternalSyncFeed,
  DEFAULT_SYNC_FEED
} from '../analytics/ExternalApiSyncModal';
import {
  SavedInsightsSidebar,
  SavedInsightSnapshot,
  PRESET_SAVED_INSIGHTS
} from '../analytics/SavedInsightsSidebar';

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

// Chart Annotation definition for marking milestones and anomalies
export interface ChartAnnotation {
  id: string;
  chartId: 'activity' | 'resource' | 'watershed' | 'telemetry';
  dataPointX: string;
  label: string;
  description: string;
  category: 'milestone' | 'anomaly' | 'audit' | 'target';
  createdAt: string;
  author: string;
}

const DEFAULT_ANNOTATIONS: ChartAnnotation[] = [
  {
    id: 'anno-1',
    chartId: 'activity',
    dataPointX: 'Wed',
    label: 'Milestone: Steward Quorum Surge',
    description: 'Cross-catchment consensus quorum reached 99.8% with 6,100 active stewards.',
    category: 'milestone',
    createdAt: '2026-09-02T14:30:00Z',
    author: 'Aberdare Guild Council'
  },
  {
    id: 'anno-2',
    chartId: 'activity',
    dataPointX: '12:00',
    label: 'Anomaly: Prover Load Spike',
    description: 'Unexpected 45% spike in real-time ZK-SNARK sensor verification proofs.',
    category: 'anomaly',
    createdAt: '2026-09-05T12:00:00Z',
    author: 'Telemetry Watchdog'
  },
  {
    id: 'anno-3',
    chartId: 'resource',
    dataPointX: 'Apr',
    label: 'Milestone: Agrivoltaic Array Go-Live',
    description: 'Bifacial solar tracking array added 1,100 kWh net renewable surplus.',
    category: 'milestone',
    createdAt: '2026-04-15T09:00:00Z',
    author: 'Grid Engineering Team'
  },
  {
    id: 'anno-4',
    chartId: 'resource',
    dataPointX: 'Jun',
    label: 'Anomaly: Cloud Shadowing Delta',
    description: 'Generation delta buffered automatically by hydro and battery storage.',
    category: 'anomaly',
    createdAt: '2026-06-18T14:00:00Z',
    author: 'Autonomous Microgrid Controller'
  },
  {
    id: 'anno-5',
    chartId: 'watershed',
    dataPointX: 'Aberdare Catchment',
    label: 'Milestone: Peak Aquifer Infiltration',
    description: 'Achieved 7,650 m³ recharge via indigenous cloud forest retention.',
    category: 'milestone',
    createdAt: '2026-07-12T10:00:00Z',
    author: 'Hydrology Taskforce'
  },
  {
    id: 'anno-6',
    chartId: 'telemetry',
    dataPointX: 'T-12m',
    label: 'Anomaly: Radio Mesh Congestion',
    description: 'High-frequency burst of 640 KB/s without packet drop across 4,210 nodes.',
    category: 'anomaly',
    createdAt: '2026-09-06T04:40:00Z',
    author: 'LoRaWAN Edge Supervisor'
  }
];

// Color palette definitions for Recharts components
const PALETTES = {
  default_professional: {
    id: 'default_professional',
    name: 'Default Professional',
    isHighContrast: false,
    stewards: '#10B981',
    operatives: '#06B6D4',
    queries: '#C5A059',
    stewardsGradStart: '#10B981',
    operativesGradStart: '#06B6D4',
    queriesGradStart: '#C5A059',
    compute: '#EF4444',
    solar: '#10B981',
    netSurplus: '#F59E0B',
    baselineStewards: '#6EE7B7',
    baselineCompute: '#F87171',
    baselineSolar: '#34D399',
    waterRecharge: '#06B6D4',
    waterExtraction: '#64748B',
    packetRate: '#C5A059',
    latency: '#06B6D4',
    grid: '#263429',
    gridOpacity: 0.5,
    axisText: '#7E8B82',
    tooltipBg: '#0B120E',
    tooltipBorder: '#10B981',
    tooltipText: '#F5F5F0',
    donutColors: ['#10B981', '#06B6D4', '#C5A059', '#8B5CF6', '#F59E0B'],
    domainColors: ['#10B981', '#06B6D4', '#C5A059', '#8B5CF6', '#F59E0B'],
    comparisonBaseline: '#6EE7B7',
    comparisonCompute: '#F87171',
    comparisonSolar: '#34D399',
    recharge: '#06B6D4',
    extraction: '#64748B',
    telemetryPacket: '#C5A059',
    telemetryLatency: '#06B6D4',
    milestoneLine: '#F59E0B',
    milestoneLabel: '#FDE68A',
    anomalyLine: '#EF4444',
    anomalyLabel: '#FCA5A5',
    auditLine: '#06B6D4',
    auditLabel: '#67E8F9'
  },
  high_contrast: {
    id: 'high_contrast',
    name: 'High Contrast (WCAG AAA)',
    isHighContrast: true,
    stewards: '#FFFF00', // Neon Yellow
    operatives: '#00FFFF', // Electric Cyan
    queries: '#FF007F', // Vivid Magenta / Hot Pink
    stewardsGradStart: '#FFFF00',
    operativesGradStart: '#00FFFF',
    queriesGradStart: '#FF007F',
    compute: '#FF0055', // Stark Crimson
    solar: '#39FF14', // Neon Lime
    netSurplus: '#FFFF00', // Bright Yellow
    baselineStewards: '#FFFFFF', // Stark White
    baselineCompute: '#FF9999',
    baselineSolar: '#99FF99',
    comparisonBaseline: '#FFFFFF',
    comparisonCompute: '#FF9999',
    comparisonSolar: '#99FF99',
    waterRecharge: '#00FFFF',
    waterExtraction: '#E2E8F0', // High contrast silver
    recharge: '#00FFFF',
    extraction: '#E2E8F0',
    packetRate: '#FFFF00',
    latency: '#00FFFF',
    telemetryPacket: '#FFFF00',
    telemetryLatency: '#00FFFF',
    grid: '#4B5563', // High contrast grid lines
    gridOpacity: 0.8,
    axisText: '#F3F4F6', // Pure bright axis text
    tooltipBg: '#000000',
    tooltipBorder: '#FFFFFF',
    tooltipText: '#FFFFFF',
    donutColors: ['#FFFF00', '#00FFFF', '#FF007F', '#39FF14', '#FFA500'],
    domainColors: ['#FFFF00', '#00FFFF', '#FF007F', '#39FF14', '#FFA500'],
    milestoneLine: '#FFFF00',
    milestoneLabel: '#FFFF00',
    anomalyLine: '#FF0055',
    anomalyLabel: '#FF6699',
    auditLine: '#00FFFF',
    auditLabel: '#00FFFF'
  }
};

export const AnalyticsReportView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [selectedBioregion, setSelectedBioregion] = useState<string>('all');
  const [isExportingJson, setIsExportingJson] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Color Palette Switcher State
  const [colorPalette, setColorPalette] = useState<'default_professional' | 'high_contrast'>('default_professional');
  const activePalette = PALETTES[colorPalette];
  const isHighContrast = colorPalette === 'high_contrast';

  // Live Data Polling State
  const [isLiveData, setIsLiveData] = useState<boolean>(false);
  const [livePollInterval, setLivePollInterval] = useState<number>(5); // seconds: 3, 5, 10, 30
  const [lastPolledTime, setLastPolledTime] = useState<string>('06:10:24 AM');
  const [pollCountdown, setPollCountdown] = useState<number>(5);
  const [telemetryStream, setTelemetryStream] = useState(TELEMETRY_STREAM_DATA);

  // Comparison Mode state
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [comparisonPeriod, setComparisonPeriod] = useState<'prior_period' | 'historical_baseline' | 'target_scenario'>('prior_period');

  // Animation and live-refresh trigger key
  const [refreshKey, setRefreshKey] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Interactive Data Drilldown state
  const [drilldownData, setDrilldownData] = useState<DrilldownInspection | null>(null);
  const [drilldownSearch, setDrilldownSearch] = useState<string>('');

  // Custom Chart Annotations State
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>(() => {
    try {
      const saved = localStorage.getItem('atlas_chart_annotations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_ANNOTATIONS;
  });

  const [isAnnotationModalOpen, setIsAnnotationModalOpen] = useState(false);
  const [showAnnotationsDrawer, setShowAnnotationsDrawer] = useState(false);
  const [showAnnotationsOnCharts, setShowAnnotationsOnCharts] = useState(true);
  const [annotationCategoryFilter, setAnnotationCategoryFilter] = useState<'all' | 'milestone' | 'anomaly' | 'audit'>('all');

  // New Annotation Form State
  const [annotationForm, setAnnotationForm] = useState<{
    chartId: 'activity' | 'resource' | 'watershed' | 'telemetry';
    dataPointX: string;
    label: string;
    description: string;
    category: 'milestone' | 'anomaly' | 'audit' | 'target';
    author: string;
  }>({
    chartId: 'activity',
    dataPointX: 'Wed',
    label: '',
    description: '',
    category: 'milestone',
    author: 'Bioregional Observer'
  });

  // Predictive Trends Forecasting State
  const [predictiveConfig, setPredictiveConfig] = useState<PredictiveConfig>({
    enabled: false,
    horizonMonths: 3,
    scenario: 'baseline_ols',
    showConfidenceInterval: true,
    confidenceBandPct: 8
  });
  const [showPredictiveMenu, setShowPredictiveMenu] = useState<boolean>(false);

  // Threshold Metric Alert System State
  const [alertRules, setAlertRules] = useState<MetricAlertRule[]>(() => {
    try {
      const saved = localStorage.getItem('atlas_metric_alert_rules');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_ALERT_RULES;
  });

  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredMissionAlert[]>([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('atlas_metric_alert_rules', JSON.stringify(alertRules));
    } catch (e) {
      // ignore
    }
  }, [alertRules]);

  // External API Sync Feed State
  const [externalSyncFeed, setExternalSyncFeed] = useState<ExternalSyncFeed | null>(() => {
    try {
      const saved = localStorage.getItem('atlas_external_sync_feed');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEFAULT_SYNC_FEED;
  });
  const [isExternalSyncModalOpen, setIsExternalSyncModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (externalSyncFeed) {
        localStorage.setItem('atlas_external_sync_feed', JSON.stringify(externalSyncFeed));
      } else {
        localStorage.removeItem('atlas_external_sync_feed');
      }
    } catch (e) {
      // ignore
    }
  }, [externalSyncFeed]);

  // Saved Insights / Snapshots State
  const [savedInsights, setSavedInsights] = useState<SavedInsightSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem('atlas_saved_insights');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return PRESET_SAVED_INSIGHTS;
  });
  const [isSavedInsightsOpen, setIsSavedInsightsOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('atlas_saved_insights', JSON.stringify(savedInsights));
    } catch (e) {
      // ignore
    }
  }, [savedInsights]);

  // Persist annotations to local storage
  useEffect(() => {
    try {
      localStorage.setItem('atlas_chart_annotations', JSON.stringify(annotations));
    } catch (e) {
      // ignore
    }
  }, [annotations]);

  // Close drilldown, alert, or annotation modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAnnotationModalOpen) {
          setIsAnnotationModalOpen(false);
        } else if (isAlertModalOpen) {
          setIsAlertModalOpen(false);
        } else if (isExternalSyncModalOpen) {
          setIsExternalSyncModalOpen(false);
        } else if (isSavedInsightsOpen) {
          setIsSavedInsightsOpen(false);
        } else if (drilldownData) {
          setDrilldownData(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drilldownData, isAnnotationModalOpen, isAlertModalOpen, isExternalSyncModalOpen, isSavedInsightsOpen]);

  // Active time-series dataset
  const activityData = useMemo(() => {
    switch (timeRange) {
      case '24h': return ACTIVITY_24H;
      case '7d': return ACTIVITY_7D;
      case '30d': return ACTIVITY_30D;
      default: return ACTIVITY_7D;
    }
  }, [timeRange]);

  // Filtered biophysical data based on active bioregional filter
  const filteredBiophysicalData = useMemo(() => {
    if (selectedBioregion === 'all') return BIOPHYSICAL_RESOURCES_DATA;
    if (selectedBioregion === 'mara') return BIOPHYSICAL_RESOURCES_DATA.filter(b => b.watershed.toLowerCase().includes('mara'));
    if (selectedBioregion === 'aberdare') return BIOPHYSICAL_RESOURCES_DATA.filter(b => b.watershed.toLowerCase().includes('aberdare'));
    if (selectedBioregion === 'naivasha') return BIOPHYSICAL_RESOURCES_DATA.filter(b => b.watershed.toLowerCase().includes('naivasha'));
    if (selectedBioregion === 'rift') return BIOPHYSICAL_RESOURCES_DATA.filter(b => b.watershed.toLowerCase().includes('rift'));
    return BIOPHYSICAL_RESOURCES_DATA;
  }, [selectedBioregion]);

  // Dynamic resource consumption data with selected comparison overlay and external feed value
  const resourceConsumptionData = useMemo(() => {
    return RESOURCE_ENERGY_DATA.map((item, idx) => {
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

      // Map external sync feed if enabled for resource chart
      let externalMetricValue: number | undefined = undefined;
      if (externalSyncFeed && externalSyncFeed.isEnabled && externalSyncFeed.targetChart === 'resource') {
        const feedPoint = externalSyncFeed.dataPoints.find(p => p.label === item.epoch) || externalSyncFeed.dataPoints[idx];
        if (feedPoint) {
          externalMetricValue = feedPoint.value;
        }
      }

      return {
        ...item,
        comparisonComputeKWh: compCompute,
        comparisonSolarKWh: compSolar,
        comparisonNetSurplusKWh: compNetSurplus,
        netDeltaVsComparison,
        externalMetricValue
      };
    });
  }, [comparisonPeriod, externalSyncFeed]);

  // Predictive Trends Regression Model calculations
  const predictiveForecastResult = useMemo(() => {
    return generatePredictiveResourceForecast(resourceConsumptionData, predictiveConfig);
  }, [resourceConsumptionData, predictiveConfig]);

  // Mapped Telemetry Stream with External Feed injection if enabled
  const mappedTelemetryStream = useMemo(() => {
    return telemetryStream.map((item, idx) => {
      let externalMetricValue: number | undefined = undefined;
      if (externalSyncFeed && externalSyncFeed.isEnabled && externalSyncFeed.targetChart === 'telemetry') {
        const feedPoint = externalSyncFeed.dataPoints.find(p => p.label === item.minute) || externalSyncFeed.dataPoints[idx];
        if (feedPoint) {
          externalMetricValue = feedPoint.value;
        }
      }
      return {
        ...item,
        externalMetricValue
      };
    });
  }, [telemetryStream, externalSyncFeed]);

  // Current view snapshot state representation for Saved Insights
  const currentSnapshotState = useMemo((): SavedInsightSnapshot['state'] => ({
    timeRange,
    selectedBioregion,
    comparisonMode,
    comparisonPeriod,
    colorPalette: colorPalette === 'high_contrast' ? 'high_contrast' : 'default',
    predictiveEnabled: predictiveConfig.enabled,
    predictiveHorizonMonths: predictiveConfig.horizonMonths,
    predictiveScenario: predictiveConfig.scenario,
    showConfidenceInterval: predictiveConfig.showConfidenceInterval,
    annotations,
    externalFeedEnabled: externalSyncFeed?.isEnabled ?? false
  }), [
    timeRange,
    selectedBioregion,
    comparisonMode,
    comparisonPeriod,
    colorPalette,
    predictiveConfig,
    annotations,
    externalSyncFeed
  ]);

  // Auto-calculated KPI Summary Metrics based on active data selection
  const autoCalculatedKpis = useMemo(() => {
    // 1. Year-over-Year (or Period-over-Period) Growth
    const currentStewardsSum = activityData.reduce((acc, row) => acc + row.stewards, 0);
    const baselineStewardsSum = activityData.reduce(
      (acc, row) => acc + (row.prevStewards || Math.round(row.stewards * 0.86)),
      0
    );
    const yoyGrowthRate = baselineStewardsSum > 0
      ? ((currentStewardsSum - baselineStewardsSum) / baselineStewardsSum) * 100
      : 14.2;
    const deltaStewards = currentStewardsSum - baselineStewardsSum;

    // 2. Resource Efficiency Variance
    const totalCompute = resourceConsumptionData.reduce((acc, r) => acc + r.computeKWh, 0);
    const totalSolar = resourceConsumptionData.reduce((acc, r) => acc + r.greenSolarKWh, 0);
    const netSurplusKWh = totalSolar - totalCompute;
    const resourceEfficiencyVariancePct = totalCompute > 0
      ? ((totalSolar - totalCompute) / totalCompute) * 100
      : 32.4;

    const baselineComputeSum = resourceConsumptionData.reduce((acc, r) => acc + (r.comparisonComputeKWh || r.baselineComputeKWh), 0);
    const baselineSolarSum = resourceConsumptionData.reduce((acc, r) => acc + (r.comparisonSolarKWh || r.baselineSolarKWh), 0);
    const efficiencyImprovementVsBaseline = baselineComputeSum > 0
      ? resourceEfficiencyVariancePct - (((baselineSolarSum - baselineComputeSum) / baselineComputeSum) * 100)
      : 8.6;

    // 3. Biophysical Aquifer Recharge Variance & Ratio
    const totalRecharge = filteredBiophysicalData.reduce((acc, w) => acc + w.waterRechargeM3, 0);
    const totalExtraction = filteredBiophysicalData.reduce((acc, w) => acc + w.waterExtractionM3, 0);
    const netAquiferDelta = totalRecharge - totalExtraction;
    const rechargeRatio = totalExtraction > 0 ? (totalRecharge / totalExtraction).toFixed(2) : '3.36';
    const aquiferSurplusPct = totalExtraction > 0 ? (((totalRecharge - totalExtraction) / totalExtraction) * 100).toFixed(1) : '235.7';

    // 4. Epistemic Quorum Velocity
    const totalAudits = activityData.reduce((acc, a) => acc + a.epistemicAudits, 0);
    const totalQueries = activityData.reduce((acc, a) => acc + a.aiQueries, 0);
    const quorumVelocityPct = ((totalAudits / (totalAudits + totalQueries * 0.08)) * 100).toFixed(1);

    return {
      yoyGrowthRate: yoyGrowthRate.toFixed(1),
      currentStewardsSum,
      deltaStewards,
      resourceEfficiencyVariancePct: resourceEfficiencyVariancePct.toFixed(1),
      netSurplusKWh,
      efficiencyImprovementVsBaseline: efficiencyImprovementVsBaseline.toFixed(1),
      totalRecharge,
      totalExtraction,
      netAquiferDelta,
      rechargeRatio,
      aquiferSurplusPct,
      totalAudits,
      quorumVelocityPct
    };
  }, [activityData, resourceConsumptionData, filteredBiophysicalData]);

  // Live Data Auto-Polling Effect
  useEffect(() => {
    if (!isLiveData) return;

    setPollCountdown(livePollInterval);

    const countdownInterval = setInterval(() => {
      setPollCountdown(prev => (prev <= 1 ? livePollInterval : prev - 1));
    }, 1000);

    const pollInterval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastPolledTime(timeString);

      // Subtle realistic telemetry perturbation
      setTelemetryStream(prev => {
        const jitterPacket = Math.floor(Math.random() * 50) - 22;
        const jitterSensors = Math.floor(Math.random() * 6) - 2;
        const jitterLatency = Math.floor(Math.random() * 4) - 2;
        return prev.map((item, idx) => {
          if (idx === prev.length - 1) {
            return {
              ...item,
              packetRateKBs: Math.max(680, Math.min(840, item.packetRateKBs + jitterPacket)),
              activeSensors: Math.max(4260, Math.min(4350, item.activeSensors + jitterSensors)),
              latencyMs: Math.max(28, Math.min(45, item.latencyMs + jitterLatency))
            };
          }
          return item;
        });
      });

      // Trigger smooth Recharts transition
      setRefreshKey(prev => prev + 1);
    }, livePollInterval * 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(countdownInterval);
    };
  }, [isLiveData, livePollInterval]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Evaluate Threshold Metric Alerts whenever data or live polling updates
  useEffect(() => {
    if (!alertRules || alertRules.length === 0) return;

    const latestResource = resourceConsumptionData[resourceConsumptionData.length - 1];
    const latestTelemetry = telemetryStream[telemetryStream.length - 1];
    const latestActivity = activityData[activityData.length - 1];
    const maxExtraction = Math.max(...filteredBiophysicalData.map(b => b.waterExtractionM3));
    const minRecharge = Math.min(...filteredBiophysicalData.map(b => b.waterRechargeM3));

    const currentMetricValues: Record<AlertMetricKey, number> = {
      computeKWh: latestResource?.computeKWh || 5300,
      greenSolarKWh: latestResource?.greenSolarKWh || 7200,
      waterExtractionM3: maxExtraction || 1890,
      waterRechargeM3: minRecharge || 2150,
      latencyMs: latestTelemetry?.latencyMs || 34,
      packetRateKBs: latestTelemetry?.packetRateKBs || 745,
      stewards: latestActivity?.stewards || 4310
    };

    const newTriggered: TriggeredMissionAlert[] = [];

    alertRules.forEach(rule => {
      if (!rule.isEnabled) return;
      const currentVal = currentMetricValues[rule.metric];
      if (currentVal === undefined) return;

      const isViolated = rule.comparator === 'gt'
        ? currentVal > rule.threshold
        : currentVal < rule.threshold;

      if (isViolated) {
        const alertId = `alert-${rule.id}-${Date.now()}`;
        const message = `Threshold limit hit: ${rule.name}. Current value ${currentVal.toLocaleString()} ${rule.unit} ${rule.comparator === 'gt' ? 'exceeds ceiling' : 'drops below floor'} of ${rule.threshold.toLocaleString()} ${rule.unit}.`;
        
        newTriggered.push({
          id: alertId,
          ruleId: rule.id,
          ruleName: rule.name,
          metric: rule.metric,
          currentValue: currentVal,
          threshold: rule.threshold,
          comparator: rule.comparator,
          severity: rule.severity,
          timestamp: new Date().toISOString(),
          message,
          acknowledged: false
        });

        // Trigger browser notification if permitted
        if (rule.browserNotification && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(`[Atlas Sanctum Alert] ${rule.name}`, {
              body: message,
              icon: '/favicon.ico'
            });
          } catch {
            // ignore
          }
        }
      }
    });

    if (newTriggered.length > 0) {
      setTriggeredAlerts(prev => {
        const existingRuleIds = new Set(prev.map(p => p.ruleId));
        const toAdd = newTriggered.filter(n => !existingRuleIds.has(n.ruleId));
        if (toAdd.length > 0) {
          audioFeedback.playAlertPing();
          hapticFeedback.triggerWarningHaptic();
          return [...toAdd, ...prev];
        }
        return prev;
      });
    }
  }, [resourceConsumptionData, telemetryStream, activityData, filteredBiophysicalData, alertRules]);

  const handleTestTriggerAlert = (rule: MetricAlertRule) => {
    hapticFeedback.triggerWarningHaptic();
    audioFeedback.playAlertPing();
    const mockVal = rule.comparator === 'gt' ? Math.round(rule.threshold * 1.15) : Math.round(rule.threshold * 0.85);
    const testAlert: TriggeredMissionAlert = {
      id: `test-${rule.id}-${Date.now()}`,
      ruleId: rule.id,
      ruleName: `[TEST] ${rule.name}`,
      metric: rule.metric,
      currentValue: mockVal,
      threshold: rule.threshold,
      comparator: rule.comparator,
      severity: rule.severity,
      timestamp: new Date().toISOString(),
      message: `Simulated threshold alert: ${rule.name} reached ${mockVal.toLocaleString()} ${rule.unit} (${rule.comparator === 'gt' ? '>' : '<'} ${rule.threshold.toLocaleString()}).`,
      acknowledged: false
    };

    setTriggeredAlerts(prev => [testAlert, ...prev]);

    if (rule.browserNotification && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`[Atlas Test Alert] ${rule.name}`, {
          body: testAlert.message,
          icon: '/favicon.ico'
        });
      } catch {}
    }

    showToast(`Test alert fired for "${rule.name}"`);
  };

  const handleDismissAlert = (id: string) => {
    hapticFeedback.triggerLightClickHaptic();
    setTriggeredAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleRecallInsight = (insight: SavedInsightSnapshot) => {
    hapticFeedback.triggerSuccessHaptic();
    audioFeedback.playSuccess();

    setTimeRange(insight.state.timeRange);
    setSelectedBioregion(insight.state.selectedBioregion);
    setComparisonMode(insight.state.comparisonMode);
    setComparisonPeriod(insight.state.comparisonPeriod);
    setColorPalette(insight.state.colorPalette === 'high_contrast' ? 'high_contrast' : 'default_professional');
    setPredictiveConfig({
      enabled: insight.state.predictiveEnabled,
      horizonMonths: insight.state.predictiveHorizonMonths,
      scenario: insight.state.predictiveScenario,
      showConfidenceInterval: insight.state.showConfidenceInterval,
      confidenceBandPct: 8
    });

    if (insight.state.annotations && Array.isArray(insight.state.annotations)) {
      setAnnotations(insight.state.annotations);
    }

    if (externalSyncFeed) {
      setExternalSyncFeed({
        ...externalSyncFeed,
        isEnabled: insight.state.externalFeedEnabled
      });
    }

    setIsSavedInsightsOpen(false);
    showToast(`Restored Saved Insight: "${insight.title}"`);
  };

  const handleSaveInsight = (insight: SavedInsightSnapshot) => {
    setSavedInsights(prev => [insight, ...prev]);
  };

  const handleDeleteInsight = (id: string) => {
    hapticFeedback.triggerWarningHaptic();
    setSavedInsights(prev => prev.filter(i => i.id !== id));
    showToast('Saved insight snapshot deleted');
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

  // Available data points getter for the annotation target picker
  const getAvailableDataPoints = (chartId: 'activity' | 'resource' | 'watershed' | 'telemetry') => {
    switch (chartId) {
      case 'activity':
        return activityData.map(d => d.time);
      case 'resource':
        return resourceConsumptionData.map(d => d.epoch);
      case 'watershed':
        return filteredBiophysicalData.map(d => d.watershed);
      case 'telemetry':
        return telemetryStream.map(d => d.minute);
      default:
        return [];
    }
  };

  // Custom Annotation Handlers
  const handleOpenAnnotateModal = (chartId: 'activity' | 'resource' | 'watershed' | 'telemetry' = 'activity', pointX?: string) => {
    hapticFeedback.triggerLightClickHaptic();
    audioFeedback.playMicroTick();
    const available = getAvailableDataPoints(chartId);
    const defaultPoint = (pointX && available.includes(pointX)) ? pointX : (available[0] || 'Wed');

    setAnnotationForm({
      chartId,
      dataPointX: defaultPoint,
      label: '',
      description: '',
      category: 'milestone',
      author: 'Bioregional Steward'
    });
    setIsAnnotationModalOpen(true);
  };

  const handleOpenAnnotateFromDrilldown = () => {
    if (!drilldownData) return;
    hapticFeedback.triggerLightClickHaptic();
    audioFeedback.playMicroTick();

    let targetChart: 'activity' | 'resource' | 'watershed' | 'telemetry' = 'activity';
    let targetPoint = 'Wed';

    if (drilldownData.category === 'activity') {
      targetChart = 'activity';
      const match = drilldownData.title.match(/Interval:\s*([^\s—]+)/);
      targetPoint = match ? match[1] : (activityData[0]?.time || '12:00');
    } else if (drilldownData.category === 'resource') {
      targetChart = 'resource';
      const match = drilldownData.title.match(/Epoch:\s*([^\s—]+)/);
      targetPoint = match ? match[1] : 'Apr';
    } else if (drilldownData.category === 'watershed') {
      targetChart = 'watershed';
      const match = drilldownData.title.match(/^([^—]+)/);
      targetPoint = match ? match[1].trim() : 'Aberdare Catchment';
    } else if (drilldownData.category === 'telemetry') {
      targetChart = 'telemetry';
      const match = drilldownData.title.match(/Timestamp:\s*([^\s—]+)/);
      targetPoint = match ? match[1] : 'Now';
    }

    setAnnotationForm({
      chartId: targetChart,
      dataPointX: targetPoint,
      label: `Annotated Factor: ${drilldownData.primaryMetric.label}`,
      description: `Observed at ${targetPoint}. ${drilldownData.recommendation}`,
      category: 'milestone',
      author: 'Field Observer'
    });
    setDrilldownData(null);
    setIsAnnotationModalOpen(true);
  };

  const handleSaveAnnotation = () => {
    if (!annotationForm.label.trim()) {
      showToast('Please specify a title or milestone label for this annotation');
      return;
    }

    hapticFeedback.triggerSuccessHaptic();
    audioFeedback.playSuccess();

    const newAnno: ChartAnnotation = {
      id: `anno-${Date.now()}`,
      chartId: annotationForm.chartId,
      dataPointX: annotationForm.dataPointX,
      label: annotationForm.label.trim(),
      description: annotationForm.description.trim() || 'No additional notes provided.',
      category: annotationForm.category,
      createdAt: new Date().toISOString(),
      author: annotationForm.author.trim() || 'Steward Observer'
    };

    setAnnotations(prev => [newAnno, ...prev]);
    setIsAnnotationModalOpen(false);
    showToast(`Annotation added to ${newAnno.chartId.toUpperCase()} graph.`);
  };

  const handleDeleteAnnotation = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    hapticFeedback.triggerWarningHaptic();
    audioFeedback.playAlertPing();
    setAnnotations(prev => prev.filter(a => a.id !== id));
    showToast('Annotation removed from graph');
  };

  const handleToggleLiveData = () => {
    const next = !isLiveData;
    setIsLiveData(next);
    if (next) {
      hapticFeedback.triggerSuccessHaptic();
      audioFeedback.playSyncComplete();
      showToast(`Live Auto-Polling enabled (Polling every ${livePollInterval}s)`);
    } else {
      hapticFeedback.triggerLightClickHaptic();
      audioFeedback.playMicroTick();
      showToast('Live Auto-Polling paused');
    }
  };

  const handleTogglePalette = () => {
    hapticFeedback.triggerLightClickHaptic();
    audioFeedback.playMicroTick();
    const next = colorPalette === 'default_professional' ? 'high_contrast' : 'default_professional';
    setColorPalette(next);
    showToast(next === 'high_contrast' ? 'High Contrast Palette Enabled (WCAG AAA)' : 'Default Professional Palette Restored');
  };

  return (
    <div className="min-h-screen bg-[#070B08] text-[#F5F5F0] font-sans p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-3.5 rounded-xl bg-[#14261B] border border-emerald-500/50 text-emerald-200 text-xs shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Active Threshold Mission Alerts Banner */}
      <MissionAlertBanner alerts={triggeredAlerts} onDismiss={handleDismissAlert} />

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
          {/* Live Data Toggle Switch */}
          <div className="flex items-center bg-[#0C140F] border border-emerald-500/30 rounded-lg p-1 text-xs font-mono">
            <button
              id="toggle-live-data-btn"
              onClick={handleToggleLiveData}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isLiveData
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Toggle automatic background polling of live telemetry streams"
            >
              {isLiveData ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live: ON</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Live: OFF</span>
                  <span className="w-2 h-2 rounded-full bg-neutral-600" />
                </>
              )}
            </button>

            {/* Polling interval selector (only when Live is ON) */}
            {isLiveData && (
              <div className="flex items-center pl-2 border-l border-emerald-500/20 gap-1.5">
                <span className="text-[10px] text-emerald-400/80">Every:</span>
                <select
                  value={livePollInterval}
                  onChange={(e) => {
                    hapticFeedback.triggerLightClickHaptic();
                    setLivePollInterval(Number(e.target.value));
                    showToast(`Polling interval set to ${e.target.value}s`);
                  }}
                  aria-label="Polling interval in seconds"
                  className="bg-[#070E09] text-emerald-300 border border-emerald-500/40 rounded px-1.5 py-0.5 text-[11px] font-mono focus:outline-none cursor-pointer"
                >
                  <option value={3}>3s</option>
                  <option value={5}>5s</option>
                  <option value={10}>10s</option>
                  <option value={30}>30s</option>
                </select>
                <span className="text-[10px] text-neutral-400 px-1 font-mono">
                  {pollCountdown}s
                </span>
              </div>
            )}
          </div>

          {/* Color Palette Switcher */}
          <button
            id="palette-switcher-btn"
            onClick={handleTogglePalette}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isHighContrast
                ? 'bg-yellow-950/90 border-yellow-400 text-yellow-300 shadow-[0_0_12px_rgba(255,255,0,0.3)]'
                : 'bg-[#0F1711] border-[#F5F5F0]/15 text-neutral-300 hover:text-white hover:border-[#F5F5F0]/30'
            }`}
            title="Toggle between High Contrast (WCAG AAA) and Default Professional visualization styles"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{isHighContrast ? 'High Contrast' : 'Default Palette'}</span>
            <span className={`w-2 h-2 rounded-full ${isHighContrast ? 'bg-yellow-400' : 'bg-emerald-500'}`} />
          </button>

          {/* Annotations Controls Button */}
          <div className="flex items-center bg-[#0F1711] p-1 rounded-lg border border-[#F5F5F0]/15 text-xs font-mono">
            <button
              id="open-annotations-modal-btn"
              onClick={() => handleOpenAnnotateModal('activity')}
              className="px-2.5 py-1.5 rounded text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Add a custom text annotation to a specific data point"
            >
              <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Annotate</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#C5A059]/20 text-[#C5A059] font-bold">
                {annotations.length}
              </span>
            </button>
            <button
              id="toggle-annotations-drawer-btn"
              onClick={() => {
                hapticFeedback.triggerLightClickHaptic();
                setShowAnnotationsDrawer(prev => !prev);
              }}
              className={`px-2 py-1.5 rounded text-[11px] transition-colors cursor-pointer ${
                showAnnotationsDrawer ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="View all annotations list"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
            <button
              id="toggle-annotations-overlay-btn"
              onClick={() => {
                hapticFeedback.triggerLightClickHaptic();
                setShowAnnotationsOnCharts(prev => !prev);
                showToast(showAnnotationsOnCharts ? 'Annotations hidden on charts' : 'Annotations visible on charts');
              }}
              className={`px-2 py-1.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                showAnnotationsOnCharts ? 'text-emerald-400' : 'text-neutral-500 line-through'
              }`}
              title="Toggle showing annotation markers on charts"
            >
              {showAnnotationsOnCharts ? 'Visible' : 'Hidden'}
            </button>
          </div>

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

          {/* Predictive Trends Regression Forecast Toggle & Config Popover */}
          <div className="relative">
            <button
              id="toggle-predictive-trends-btn"
              onClick={() => {
                hapticFeedback.triggerLightClickHaptic();
                audioFeedback.playMicroTick();
                setPredictiveConfig(prev => {
                  const next = !prev.enabled;
                  showToast(next ? `Predictive Regression Forecast active (${prev.scenario}, +${prev.horizonMonths}m)` : 'Predictive Forecast disabled');
                  return { ...prev, enabled: next };
                });
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                predictiveConfig.enabled
                  ? 'bg-amber-950/90 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-[#0F1711] border-[#F5F5F0]/15 text-neutral-400 hover:text-white hover:border-[#F5F5F0]/30'
              }`}
              title="Toggle predictive OLS regression trend overlay on resource charts"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Trends: {predictiveConfig.enabled ? `+${predictiveConfig.horizonMonths}m` : 'Off'}</span>
              <span className={`w-2 h-2 rounded-full ${predictiveConfig.enabled ? 'bg-amber-400 animate-pulse' : 'bg-neutral-600'}`} />
            </button>
          </div>

          {/* Threshold Alerts Manager Trigger */}
          <button
            id="open-alerts-manager-btn"
            onClick={() => {
              hapticFeedback.triggerLightClickHaptic();
              audioFeedback.playMicroTick();
              setIsAlertModalOpen(true);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              triggeredAlerts.length > 0
                ? 'bg-red-950/90 border-red-500/70 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.35)] animate-pulse'
                : 'bg-[#0F1711] border-[#F5F5F0]/15 text-neutral-300 hover:text-white hover:border-[#F5F5F0]/30'
            }`}
            title="Configure threshold alert triggers and notifications"
          >
            <Bell className={`w-3.5 h-3.5 ${triggeredAlerts.length > 0 ? 'text-red-400' : 'text-amber-400'}`} />
            <span>Alerts</span>
            {triggeredAlerts.length > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-bold">
                {triggeredAlerts.length}
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-neutral-400 font-mono">
                {alertRules.filter(r => r.isEnabled).length}
              </span>
            )}
          </button>

          {/* Sync External API Trigger */}
          <button
            id="open-external-sync-btn"
            onClick={() => {
              hapticFeedback.triggerLightClickHaptic();
              audioFeedback.playMicroTick();
              setIsExternalSyncModalOpen(true);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              externalSyncFeed?.isEnabled
                ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-[#0F1711] border-[#F5F5F0]/15 text-neutral-400 hover:text-white hover:border-[#F5F5F0]/30'
            }`}
            title="Sync external REST JSON endpoint for comparative metrics"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>API Sync</span>
            <span className={`w-2 h-2 rounded-full ${externalSyncFeed?.isEnabled ? 'bg-cyan-400 animate-pulse' : 'bg-neutral-600'}`} />
          </button>

          {/* Saved Insights / Snapshot Drawer Trigger */}
          <div className="flex items-center bg-[#0F1711] p-1 rounded-lg border border-[#F5F5F0]/15 text-xs font-mono">
            <button
              id="open-saved-insights-btn"
              onClick={() => {
                hapticFeedback.triggerLightClickHaptic();
                audioFeedback.playMicroTick();
                setIsSavedInsightsOpen(true);
              }}
              className="px-2.5 py-1.5 rounded text-neutral-300 hover:text-[#C5A059] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Recall saved analytical insights and snapshots from sidebar"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Snapshots</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#C5A059]/20 text-[#C5A059] font-bold">
                {savedInsights.length}
              </span>
            </button>
            <button
              id="quick-snapshot-btn"
              onClick={() => {
                hapticFeedback.triggerSuccessHaptic();
                audioFeedback.playSuccess();
                const newSnap: SavedInsightSnapshot = {
                  id: `insight-${Date.now()}`,
                  title: `${selectedBioregion.toUpperCase()} Snapshot (${timeRange.toUpperCase()})`,
                  description: `Analytical snapshot taken on ${new Date().toLocaleTimeString()} capturing active filters, regression models, and annotations.`,
                  createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                  author: 'Senior Auditor',
                  tags: [selectedBioregion, timeRange, 'Snapshot'],
                  state: currentSnapshotState
                };
                handleSaveInsight(newSnap);
                showToast(`Snapshot saved: "${newSnap.title}"`);
              }}
              className="px-2 py-1.5 text-neutral-400 hover:text-white rounded transition-colors cursor-pointer"
              title="Quick Snapshot current view"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

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

      {/* Annotations Drawer (when active) */}
      <AnimatePresence>
        {showAnnotationsDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-[#0B120E] border border-[#C5A059]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-serif font-bold text-sm text-white">
                    Custom Chart Annotations & Milestone Records ({annotations.length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAnnotateModal('activity')}
                    className="px-2.5 py-1 rounded bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Annotation
                  </button>
                  <button
                    onClick={() => setShowAnnotationsDrawer(false)}
                    className="p-1 rounded text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {annotations.length === 0 ? (
                <div className="text-center py-4 text-xs font-mono text-neutral-400">
                  No annotations added yet. Click &quot;Add Annotation&quot; or drill down into any data point to mark a milestone or anomaly.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {annotations.map(anno => (
                    <div
                      key={anno.id}
                      className="p-3 rounded-lg bg-[#070E0A] border border-white/10 space-y-1.5 text-xs font-mono relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          anno.category === 'anomaly'
                            ? 'bg-red-950 text-red-300 border border-red-500/40'
                            : anno.category === 'audit'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        }`}>
                          {anno.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
                          <span className="px-1.5 py-0.5 bg-white/5 rounded">{anno.chartId.toUpperCase()}</span>
                          <span>@ {anno.dataPointX}</span>
                          <button
                            onClick={(e) => handleDeleteAnnotation(anno.id, e)}
                            className="p-1 text-red-400 hover:text-red-200 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                            title="Delete annotation"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="font-bold text-white text-xs">{anno.label}</div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2">{anno.description}</p>
                      <div className="text-[10px] text-neutral-500 flex items-center justify-between pt-1 border-t border-white/5">
                        <span>By {anno.author}</span>
                        <span>{new Date(anno.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-Calculated Summary Row (KPI Cards: YoY Growth & Resource Efficiency Variance) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
          <span className="flex items-center gap-1.5 text-[#C5A059] font-bold uppercase tracking-wider text-[11px]">
            <Gauge className="w-3.5 h-3.5" /> Auto-Calculated Synthesis & Efficiency KPI Cards
          </span>
          <span className="text-[10px] text-neutral-500">
            Active Filter: <strong className="text-neutral-300">{selectedBioregion.toUpperCase()}</strong> | Interval: <strong className="text-neutral-300">{timeRange.toUpperCase()}</strong> {isLiveData && `| Live Polled (${lastPolledTime})`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Year-over-Year Growth */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#0D1812] to-[#070D09] border border-emerald-500/30 hover:border-emerald-500/50 transition-all shadow-sm group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-neutral-300 text-xs font-mono font-medium flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Year-over-Year Growth
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                Active Selection
              </span>
            </div>
            <div className="flex items-baseline gap-2 my-1">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-emerald-300">
                +{autoCalculatedKpis.yoyGrowthRate}%
              </span>
              <span className="text-xs font-mono text-emerald-400/80">
                (+{autoCalculatedKpis.deltaStewards.toLocaleString()} stewards)
              </span>
            </div>
            <div className="text-[11px] text-neutral-400 font-sans line-clamp-1 mb-2">
              Aggregated {autoCalculatedKpis.currentStewardsSum.toLocaleString()} stewards active across current {timeRange} cycle.
            </div>
            <div className="pt-2 border-t border-emerald-500/15 flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>Formula: Δ(Current - Baseline) / Baseline</span>
              <span className="text-emerald-400 font-semibold">Verified Quorum</span>
            </div>
          </div>

          {/* Card 2: Resource Efficiency Variance */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#1A150A] to-[#0D0B05] border border-amber-500/30 hover:border-amber-500/50 transition-all shadow-sm group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-neutral-300 text-xs font-mono font-medium flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Resource Efficiency Variance
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-amber-950/80 text-amber-300 border border-amber-500/40">
                Renewable Net
              </span>
            </div>
            <div className="flex items-baseline gap-2 my-1">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-amber-300">
                +{autoCalculatedKpis.resourceEfficiencyVariancePct}%
              </span>
              <span className="text-xs font-mono text-amber-400/80">
                (+{autoCalculatedKpis.netSurplusKWh.toLocaleString()} kWh)
              </span>
            </div>
            <div className="text-[11px] text-neutral-400 font-sans line-clamp-1 mb-2">
              Clean solar generation exceeds compute load by {autoCalculatedKpis.netSurplusKWh.toLocaleString()} kWh net surplus.
            </div>
            <div className="pt-2 border-t border-amber-500/15 flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>Formula: (Solar - Compute) / Compute</span>
              <span className="text-amber-400 font-semibold">{autoCalculatedKpis.efficiencyImprovementVsBaseline}% vs Baseline</span>
            </div>
          </div>

          {/* Card 3: Biophysical Aquifer Infiltration Buffer */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#081519] to-[#040B0E] border border-cyan-500/30 hover:border-cyan-500/50 transition-all shadow-sm group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-neutral-300 text-xs font-mono font-medium flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-cyan-400" />
                Aquifer Recharge Ratio
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                Catchment Net
              </span>
            </div>
            <div className="flex items-baseline gap-2 my-1">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-cyan-300">
                {autoCalculatedKpis.rechargeRatio}x
              </span>
              <span className="text-xs font-mono text-cyan-400/80">
                (+{autoCalculatedKpis.netAquiferDelta.toLocaleString()} m³)
              </span>
            </div>
            <div className="text-[11px] text-neutral-400 font-sans line-clamp-1 mb-2">
              {autoCalculatedKpis.aquiferSurplusPct}% excess replenishment over total human extraction in active basin.
            </div>
            <div className="pt-2 border-t border-cyan-500/15 flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>Formula: Infiltration / Extraction</span>
              <span className="text-cyan-400 font-semibold">Subsurface Balance</span>
            </div>
          </div>

          {/* Card 4: Epistemic Quorum Velocity */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#150F1F] to-[#0B0810] border border-purple-500/30 hover:border-purple-500/50 transition-all shadow-sm group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-neutral-300 text-xs font-mono font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Epistemic Quorum Velocity
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-purple-950/80 text-purple-300 border border-purple-500/40">
                ZK Merkle
              </span>
            </div>
            <div className="flex items-baseline gap-2 my-1">
              <span className="text-2xl lg:text-3xl font-bold font-serif text-purple-300">
                {autoCalculatedKpis.quorumVelocityPct}%
              </span>
              <span className="text-xs font-mono text-purple-400/80">
                ({autoCalculatedKpis.totalAudits.toLocaleString()} audits)
              </span>
            </div>
            <div className="text-[11px] text-neutral-400 font-sans line-clamp-1 mb-2">
              Zero-knowledge consensus verifications executed without divergence or proof failure.
            </div>
            <div className="pt-2 border-t border-purple-500/15 flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>Formula: Audits / (Audits + Query Load)</span>
              <span className="text-purple-400 font-semibold">100% Attested</span>
            </div>
          </div>
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
            <div className="flex items-center gap-2 self-start flex-wrap">
              <button
                onClick={() => handleOpenAnnotateModal('activity')}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A059]/15 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/40 flex items-center gap-1 transition-colors cursor-pointer"
                title="Add annotation to this chart"
              >
                <Plus className="w-3 h-3" /> Annotate Point
              </button>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Click point to drill down
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#C5A059] border border-white/10">
                Interval: {timeRange.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2 cursor-pointer">
            <ResponsiveContainer key={`activity-chart-${timeRange}-${comparisonMode}-${colorPalette}-${refreshKey}`} width="100%" height="100%">
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
                    <stop offset="5%" stopColor={activePalette.stewards} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={activePalette.stewards} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorOperatives" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activePalette.operatives} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={activePalette.operatives} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activePalette.queries} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={activePalette.queries} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#263429" opacity={0.5} />
                <XAxis dataKey="time" stroke="#7E8B82" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#7E8B82" fontSize={11} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B120E', borderColor: activePalette.stewards, borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#F5F5F0' }}
                  formatter={(value: any, name: any) => [
                    `${typeof value === 'number' ? value.toLocaleString() : value}`,
                    name
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }} />
                
                {/* Active Metric Series with palette colors & smooth animation transitions */}
                <Area
                  type="monotone"
                  dataKey="stewards"
                  name="Active Stewards"
                  stroke={activePalette.stewards}
                  strokeWidth={isHighContrast ? 3 : 2}
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
                  stroke={activePalette.operatives}
                  strokeWidth={isHighContrast ? 2.5 : 1.8}
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
                  stroke={activePalette.queries}
                  strokeWidth={isHighContrast ? 2.2 : 1.5}
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
                    stroke={activePalette.comparisonBaseline}
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={{ r: 3, fill: activePalette.comparisonBaseline }}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                )}

                {/* Custom User Text Annotations on Specific Data Points */}
                {showAnnotationsOnCharts && annotations.filter(a => a.chartId === 'activity').map(anno => (
                  <ReferenceLine
                    key={anno.id}
                    x={anno.dataPointX}
                    stroke={anno.category === 'anomaly' ? '#EF4444' : anno.category === 'audit' ? '#06B6D4' : '#F59E0B'}
                    strokeDasharray="3 3"
                    strokeWidth={2}
                    label={{
                      value: `📍 ${anno.label}`,
                      fill: '#F5F5F0',
                      fontSize: 10,
                      position: 'top',
                      style: { fontWeight: 'bold' }
                    }}
                  />
                ))}
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
            <ResponsiveContainer key={`domain-pie-${colorPalette}-${refreshKey}`} width="100%" height="100%">
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
                      fill={activePalette.domainColors[index % activePalette.domainColors.length] || entry.color}
                      stroke="#090D0A"
                      strokeWidth={2}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Engagement Share']}
                  contentStyle={{ backgroundColor: '#0B120E', borderColor: activePalette.queries, borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-mono text-neutral-400">Total</span>
              <span className="text-lg font-serif font-bold text-white">100%</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-white/10 text-[11px] font-mono">
            {DOMAIN_DISTRIBUTION.map((item, index) => {
              const color = activePalette.domainColors[index % activePalette.domainColors.length] || item.color;
              return (
                <button
                  key={item.name}
                  onClick={() => handleDrilldownDomain(item)}
                  className="w-full flex items-center justify-between text-neutral-300 hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="truncate max-w-[170px]">{item.name}</span>
                  </span>
                  <span className="font-bold text-white flex items-center gap-1">
                    {item.value}%
                    <ChevronRight className="w-3 h-3 text-neutral-500" />
                  </span>
                </button>
              );
            })}
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
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  hapticFeedback.triggerLightClickHaptic();
                  setPredictiveConfig(prev => ({ ...prev, enabled: !prev.enabled }));
                }}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 transition-colors cursor-pointer ${
                  predictiveConfig.enabled
                    ? 'bg-amber-950/80 border-amber-400 text-amber-300 shadow-sm'
                    : 'bg-[#0F1711] border-white/15 text-neutral-400 hover:text-white'
                }`}
                title="Toggle OLS predictive trends regression overlay"
              >
                <TrendingUp className="w-3 h-3" />
                <span>{predictiveConfig.enabled ? 'Trends: Active' : 'Enable Trends'}</span>
              </button>
              <button
                onClick={() => handleOpenAnnotateModal('resource')}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A059]/15 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/40 flex items-center gap-1 transition-colors cursor-pointer"
                title="Add annotation to this chart"
              >
                <Plus className="w-3 h-3" /> Annotate Point
              </button>
              <div className="flex items-center gap-1.5 bg-amber-950/40 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-mono">
                <Sparkles className="w-3 h-3" />
                100% Carbon Negative Run
              </div>
            </div>
          </div>

          {/* Predictive Trends OLS Regression Ribbon */}
          {predictiveConfig.enabled && (
            <div className="p-3 bg-[#0C150E] rounded-xl border border-amber-500/30 text-xs font-mono flex flex-wrap items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold flex items-center gap-1 text-[11px]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  OLS Regression
                </span>
                <span className="text-neutral-400 text-[11px]">
                  Compute: <strong className="text-red-400">+{predictiveForecastResult.stats.computeGrowthPerMonth} kWh/mo</strong> (R²: {predictiveForecastResult.stats.rSquaredCompute})
                </span>
                <span className="text-neutral-400 text-[11px]">
                  Solar: <strong className="text-emerald-400">+{predictiveForecastResult.stats.solarGrowthPerMonth} kWh/mo</strong> (R²: {predictiveForecastResult.stats.rSquaredSolar})
                </span>
                <span className="text-neutral-300 text-[11px]">
                  End-Horizon Net Surplus: <strong className="text-amber-300">+{predictiveForecastResult.stats.forecastedNetSurplusEnd.toLocaleString()} kWh</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Horizon pills */}
                <span className="text-[10px] text-neutral-500">Horizon:</span>
                {([1, 2, 3, 4] as const).map(h => (
                  <button
                    key={h}
                    onClick={() => {
                      hapticFeedback.triggerLightClickHaptic();
                      setPredictiveConfig(prev => ({ ...prev, horizonMonths: h }));
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer font-bold ${
                      predictiveConfig.horizonMonths === h ? 'bg-amber-400 text-black' : 'bg-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    +{h}m
                  </button>
                ))}

                {/* Scenario pills */}
                <span className="text-[10px] text-neutral-500 ml-1">Scenario:</span>
                {(['baseline_ols', 'accelerated_adoption', 'conservation'] as const).map(sc => (
                  <button
                    key={sc}
                    onClick={() => {
                      hapticFeedback.triggerLightClickHaptic();
                      setPredictiveConfig(prev => ({ ...prev, scenario: sc }));
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer capitalize font-medium ${
                      predictiveConfig.scenario === sc ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {sc === 'baseline_ols' ? 'Baseline' : sc === 'accelerated_adoption' ? 'Accelerated' : 'Conservation'}
                  </button>
                ))}

                {/* Confidence band toggle */}
                <button
                  onClick={() => {
                    hapticFeedback.triggerLightClickHaptic();
                    setPredictiveConfig(prev => ({ ...prev, showConfidenceInterval: !prev.showConfidenceInterval }));
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] border transition-colors cursor-pointer ${
                    predictiveConfig.showConfidenceInterval
                      ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                      : 'border-white/10 text-neutral-500'
                  }`}
                  title="Toggle ±8% confidence interval envelope"
                >
                  ±8% Band
                </button>
              </div>
            </div>
          )}

          <div className="h-[280px] w-full pt-2 cursor-pointer">
            <ResponsiveContainer key={`composed-chart-${comparisonMode}-${comparisonPeriod}-${colorPalette}-${predictiveConfig.enabled}-${predictiveConfig.scenario}-${predictiveConfig.horizonMonths}-${refreshKey}`} width="100%" height="100%">
              <ComposedChart
                data={(predictiveConfig.enabled ? predictiveForecastResult.combinedData : resourceConsumptionData) as any}
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
                  contentStyle={{ backgroundColor: '#0B120E', borderColor: activePalette.netSurplus, borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
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
                  fill={activePalette.compute}
                  radius={[4, 4, 0, 0]}
                  opacity={isHighContrast ? 1 : 0.85}
                  isAnimationActive={true}
                  animationDuration={850}
                  animationEasing="ease-out"
                  onClick={(entry) => handleDrilldownResource(entry)}
                />
                <Bar
                  dataKey="greenSolarKWh"
                  name="Solar / Renewable Gen (kWh)"
                  fill={activePalette.solar}
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
                  stroke={activePalette.netSurplus}
                  strokeWidth={isHighContrast ? 3.5 : 2.5}
                  dot={{ r: 4, fill: activePalette.netSurplus }}
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                />

                {/* Predictive Trends OLS Regression Lines (Dashed) */}
                {predictiveConfig.enabled && (
                  <Line
                    type="monotone"
                    dataKey="projectedComputeKWh"
                    name={`Projected Compute (${predictiveConfig.scenario === 'baseline_ols' ? 'OLS' : predictiveConfig.scenario === 'accelerated_adoption' ? 'Acc (+25%)' : 'Cons (-30%)'})`}
                    stroke="#F87171"
                    strokeDasharray="5 5"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#EF4444' }}
                    isAnimationActive={true}
                    animationDuration={850}
                  />
                )}
                {predictiveConfig.enabled && (
                  <Line
                    type="monotone"
                    dataKey="projectedSolarKWh"
                    name="Projected Solar Generation"
                    stroke="#34D399"
                    strokeDasharray="5 5"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#10B981' }}
                    isAnimationActive={true}
                    animationDuration={850}
                  />
                )}
                {predictiveConfig.enabled && (
                  <Line
                    type="monotone"
                    dataKey="projectedNetSurplusKWh"
                    name="Projected Net Surplus"
                    stroke="#FBBF24"
                    strokeDasharray="3 3"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#F59E0B' }}
                    isAnimationActive={true}
                    animationDuration={850}
                  />
                )}
                {predictiveConfig.enabled && predictiveConfig.showConfidenceInterval && (
                  <Line
                    type="monotone"
                    dataKey="solarConfidenceUpper"
                    name="Forecast Solar Upper (+8%)"
                    stroke="#10B981"
                    strokeDasharray="2 2"
                    strokeWidth={1}
                    dot={false}
                    opacity={0.5}
                  />
                )}
                {predictiveConfig.enabled && predictiveConfig.showConfidenceInterval && (
                  <Line
                    type="monotone"
                    dataKey="solarConfidenceLower"
                    name="Forecast Solar Lower (-8%)"
                    stroke="#10B981"
                    strokeDasharray="2 2"
                    strokeWidth={1}
                    dot={false}
                    opacity={0.5}
                  />
                )}

                {/* External API Synced Telemetry Stream */}
                {externalSyncFeed && externalSyncFeed.isEnabled && externalSyncFeed.targetChart === 'resource' && (
                  <Line
                    type="monotone"
                    dataKey="externalMetricValue"
                    name={`Ext: ${externalSyncFeed.metricName} (${externalSyncFeed.unit})`}
                    stroke={externalSyncFeed.color}
                    strokeDasharray="4 2"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: externalSyncFeed.color }}
                    isAnimationActive={true}
                    animationDuration={850}
                  />
                )}

                {/* Comparative Overlays when Comparison Mode is Active */}
                {comparisonMode && (
                  <Line
                    type="monotone"
                    dataKey="comparisonComputeKWh"
                    name={`Baseline Compute (${comparisonPeriod === 'prior_period' ? 'Prior Cycle' : comparisonPeriod === 'historical_baseline' ? '2025' : 'Target'})`}
                    stroke={activePalette.comparisonCompute}
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
                    stroke={activePalette.comparisonSolar}
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    isAnimationActive={true}
                    animationDuration={850}
                    animationEasing="ease-out"
                  />
                )}

                {/* Custom User Text Annotations on Specific Data Points */}
                {showAnnotationsOnCharts && annotations.filter(a => a.chartId === 'resource').map(anno => (
                  <ReferenceLine
                    key={anno.id}
                    x={anno.dataPointX}
                    stroke={anno.category === 'anomaly' ? '#EF4444' : anno.category === 'audit' ? '#06B6D4' : '#F59E0B'}
                    strokeDasharray="3 3"
                    strokeWidth={2}
                    label={{
                      value: `📍 ${anno.label}`,
                      fill: '#F5F5F0',
                      fontSize: 10,
                      position: 'top',
                      style: { fontWeight: 'bold' }
                    }}
                  />
                ))}
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
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleOpenAnnotateModal('watershed')}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A059]/15 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/40 flex items-center gap-1 transition-colors cursor-pointer"
                title="Add annotation to this chart"
              >
                <Plus className="w-3 h-3" /> Annotate
              </button>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                Click bar
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2 cursor-pointer">
            <ResponsiveContainer key={`watershed-bar-${colorPalette}-${selectedBioregion}-${refreshKey}`} width="100%" height="100%">
              <BarChart
                data={filteredBiophysicalData}
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
                  contentStyle={{ backgroundColor: '#0B120E', borderColor: activePalette.recharge, borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#F5F5F0' }}
                  formatter={(val: any, name: any) => [`${typeof val === 'number' ? val.toLocaleString() : val} m³`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '8px' }} />
                <Bar
                  dataKey="waterRechargeM3"
                  name="Aquifer Recharge (m³)"
                  fill={activePalette.recharge}
                  radius={[0, 4, 4, 0]}
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                  onClick={(entry) => handleDrilldownWatershed(entry)}
                />
                <Bar
                  dataKey="waterExtractionM3"
                  name="Extraction (m³)"
                  fill={activePalette.extraction}
                  radius={[0, 4, 4, 0]}
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                  onClick={(entry) => handleDrilldownWatershed(entry)}
                />

                {/* Custom User Text Annotations on Specific Watersheds */}
                {showAnnotationsOnCharts && annotations.filter(a => a.chartId === 'watershed').map(anno => (
                  <ReferenceLine
                    key={anno.id}
                    y={anno.dataPointX}
                    stroke={anno.category === 'anomaly' ? '#EF4444' : anno.category === 'audit' ? '#06B6D4' : '#F59E0B'}
                    strokeDasharray="3 3"
                    strokeWidth={2}
                    label={{
                      value: `📍 ${anno.label}`,
                      fill: '#F5F5F0',
                      fontSize: 10,
                      position: 'right',
                      style: { fontWeight: 'bold' }
                    }}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Live Telemetry Sensor Throughput & Epistemic Audit Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: IoT Stream Throughput (LineChart) */}
        <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#090D0A] border border-[#F5F5F0]/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif font-bold text-white text-base flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#C5A059]" />
                Live Sensor Telemetry Bandwidth & Ingress
              </h2>
              <p className="text-xs text-neutral-400 font-sans">
                Real-time telemetry packet throughput across 4,200+ hardware piezometers and flux towers.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleOpenAnnotateModal('telemetry')}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A059]/15 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/40 flex items-center gap-1 transition-colors cursor-pointer"
                title="Add annotation to this chart"
              >
                <Plus className="w-3 h-3" /> Annotate Point
              </button>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                <span className={`w-1.5 h-1.5 rounded-full ${isLiveData ? 'bg-emerald-400 animate-ping' : 'bg-emerald-400'}`} />
                {isLiveData ? `Live Polling (${livePollInterval}s)` : 'Stream Synchronized'}
              </span>
            </div>
          </div>

          <div className="h-[220px] w-full cursor-pointer">
            <ResponsiveContainer key={`telemetry-line-${colorPalette}-${mappedTelemetryStream.length}-${externalSyncFeed?.lastSynced || ''}-${refreshKey}`} width="100%" height="100%">
              <LineChart
                data={mappedTelemetryStream}
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
                  contentStyle={{ backgroundColor: '#0B120E', borderColor: activePalette.telemetryPacket, borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#F5F5F0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '6px' }} />
                <Line
                  type="monotone"
                  dataKey="packetRateKBs"
                  name="Ingress Rate (KB/s)"
                  stroke={activePalette.telemetryPacket}
                  strokeWidth={isHighContrast ? 3.5 : 2.5}
                  dot={{ r: 3, fill: activePalette.telemetryPacket }}
                  isAnimationActive={true}
                  animationDuration={850}
                  animationEasing="ease-out"
                />
                <Line
                  type="monotone"
                  dataKey="latencyMs"
                  name="p95 Latency (ms)"
                  stroke={activePalette.telemetryLatency}
                  strokeWidth={isHighContrast ? 2.5 : 1.8}
                  dot={{ r: 3, fill: activePalette.telemetryLatency }}
                  isAnimationActive={true}
                  animationDuration={850}
                  animationEasing="ease-out"
                />

                {/* External API Synced Telemetry Stream */}
                {externalSyncFeed && externalSyncFeed.isEnabled && externalSyncFeed.targetChart === 'telemetry' && (
                  <Line
                    type="monotone"
                    dataKey="externalMetricValue"
                    name={`Ext: ${externalSyncFeed.metricName} (${externalSyncFeed.unit})`}
                    stroke={externalSyncFeed.color}
                    strokeDasharray="4 2"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: externalSyncFeed.color }}
                    isAnimationActive={true}
                    animationDuration={850}
                  />
                )}

                {/* Custom User Text Annotations on Specific Ingress Timestamps */}
                {showAnnotationsOnCharts && annotations.filter(a => a.chartId === 'telemetry').map(anno => (
                  <ReferenceLine
                    key={anno.id}
                    x={anno.dataPointX}
                    stroke={anno.category === 'anomaly' ? '#EF4444' : anno.category === 'audit' ? '#06B6D4' : '#F59E0B'}
                    strokeDasharray="3 3"
                    strokeWidth={2}
                    label={{
                      value: `📍 ${anno.label}`,
                      fill: '#F5F5F0',
                      fontSize: 10,
                      position: 'top',
                      style: { fontWeight: 'bold' }
                    }}
                  />
                ))}
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

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={handleOpenAnnotateFromDrilldown}
                    className="px-3.5 py-2 bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/40 rounded-lg transition-colors cursor-pointer font-bold flex items-center gap-1.5"
                    title="Add a custom text annotation to this point on the chart"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Annotate Point</span>
                  </button>
                  <button
                    onClick={() => setDrilldownData(null)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors cursor-pointer font-bold"
                  >
                    Close Inspection
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Text Annotation Modal Dialog */}
      <AnimatePresence>
        {isAnnotationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-[#0D140F] border border-[#C5A059]/40 rounded-2xl shadow-2xl overflow-hidden text-[#F5F5F0]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#080E0A]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-white">
                      Add Custom Chart Annotation
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans">
                      Mark significant milestones, field anomalies, or audit verifications directly on Recharts graphs.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAnnotationModalOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 text-xs font-mono">
                {/* Target Chart & Data Point Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-bold">
                      Target Graph:
                    </label>
                    <select
                      value={annotationForm.chartId}
                      onChange={(e) => {
                        const nextChart = e.target.value as 'activity' | 'resource' | 'watershed' | 'telemetry';
                        const points = getAvailableDataPoints(nextChart);
                        setAnnotationForm(prev => ({
                          ...prev,
                          chartId: nextChart,
                          dataPointX: points[0] || ''
                        }));
                      }}
                      className="w-full bg-[#070D09] border border-white/15 rounded-lg p-2 text-neutral-200 focus:outline-none focus:border-[#C5A059] cursor-pointer"
                    >
                      <option value="activity">User Activity & Stewards (AreaChart)</option>
                      <option value="resource">Resource Consumption & Solar (ComposedChart)</option>
                      <option value="watershed">Aquifer Water Recharge (BarChart)</option>
                      <option value="telemetry">Live Sensor Telemetry Ingress (LineChart)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-bold">
                      Target Point (X-Axis / Category):
                    </label>
                    <select
                      value={annotationForm.dataPointX}
                      onChange={(e) => setAnnotationForm(prev => ({ ...prev, dataPointX: e.target.value }))}
                      className="w-full bg-[#070D09] border border-white/15 rounded-lg p-2 text-neutral-200 focus:outline-none focus:border-[#C5A059] cursor-pointer"
                    >
                      {getAvailableDataPoints(annotationForm.chartId).map(pt => (
                        <option key={pt} value={pt}>
                          {pt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category Picker */}
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">
                    Annotation Classification:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'milestone', label: 'Milestone', desc: 'Achievement / deployment', border: 'border-amber-500/50', bg: 'bg-amber-950/40 text-amber-300' },
                      { id: 'anomaly', label: 'Anomaly', desc: 'Outlier / fluctuation', border: 'border-red-500/50', bg: 'bg-red-950/40 text-red-300' },
                      { id: 'audit', label: 'Audit Proof', desc: 'ZKP consensus event', border: 'border-cyan-500/50', bg: 'bg-cyan-950/40 text-cyan-300' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setAnnotationForm(prev => ({ ...prev, category: cat.id as any }))}
                        className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                          annotationForm.category === cat.id
                            ? `${cat.border} ${cat.bg} font-bold shadow-sm`
                            : 'border-white/10 bg-black/30 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <div className="text-xs">{cat.label}</div>
                        <div className="text-[9px] opacity-75">{cat.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Annotation Title / Milestone */}
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">
                    Annotation Title / Milestone Name:
                  </label>
                  <input
                    type="text"
                    value={annotationForm.label}
                    onChange={(e) => setAnnotationForm(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="e.g., Solar Array Commissioning, Drought Stress Spike"
                    className="w-full bg-[#070D09] border border-white/15 rounded-lg p-2.5 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* Detailed Description */}
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">
                    Field Description & Ecological Context:
                  </label>
                  <textarea
                    rows={3}
                    value={annotationForm.description}
                    onChange={(e) => setAnnotationForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Specify physical conditions, telemetry root causes, or operational actions..."
                    className="w-full bg-[#070D09] border border-white/15 rounded-lg p-2.5 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#C5A059] resize-none"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">
                    Auditor / Steward Attribution:
                  </label>
                  <input
                    type="text"
                    value={annotationForm.author}
                    onChange={(e) => setAnnotationForm(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="e.g., Mara Watershed Operative #4"
                    className="w-full bg-[#070D09] border border-white/15 rounded-lg p-2 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#080E0A] border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500 text-[10px]">
                  Saved annotations are rendered as ReferenceLines on the graph.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAnnotationModalOpen(false)}
                    className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAnnotation}
                    className="px-4 py-2 bg-[#C5A059] hover:bg-[#B38E46] text-black font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save to Graph</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alert Notification System Configuration Modal */}
      <AlertManagerModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        rules={alertRules}
        onSaveRules={(updatedRules) => {
          setAlertRules(updatedRules);
        }}
        triggeredAlerts={triggeredAlerts}
        onDismissAlert={handleDismissAlert}
        onClearAllAlerts={() => setTriggeredAlerts([])}
        onTestTriggerAlert={handleTestTriggerAlert}
        onShowToast={(msg) => showToast(msg)}
      />

      {/* External API Sync Configuration Modal */}
      <ExternalApiSyncModal
        isOpen={isExternalSyncModalOpen}
        onClose={() => setIsExternalSyncModalOpen(false)}
        activeFeed={externalSyncFeed}
        onSaveFeed={(feed) => {
          setExternalSyncFeed(feed);
          if (feed) {
            showToast(`External API connected: ${feed.metricName} (${feed.dataPoints.length} points)`);
          } else {
            showToast('External API stream disconnected');
          }
        }}
        onShowToast={(msg) => showToast(msg)}
      />

      {/* Saved Insights Snapshot Recall Sidebar */}
      <SavedInsightsSidebar
        isOpen={isSavedInsightsOpen}
        onClose={() => setIsSavedInsightsOpen(false)}
        savedInsights={savedInsights}
        onSaveInsight={(newInsight) => {
          handleSaveInsight(newInsight);
          showToast(`Snapshot saved: "${newInsight.title}"`);
        }}
        onRecallInsight={handleRecallInsight}
        onDeleteInsight={handleDeleteInsight}
        currentState={currentSnapshotState}
        onShowToast={(msg) => showToast(msg)}
      />
    </div>
  );
};
