import React, { useState, useEffect, useMemo } from 'react';
import { 
  Satellite, 
  AlertTriangle, 
  Radio, 
  Flame, 
  Droplets, 
  TreePine, 
  Wind, 
  ShieldAlert, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw, 
  Filter, 
  Sparkles, 
  ChevronRight, 
  Eye, 
  Clock,
  Compass,
  Layers,
  Database,
  Volume2,
  Bell,
  Download,
  Sliders,
  Crosshair,
  Maximize2,
  Globe2,
  Table,
  FileText,
  ArrowLeftRight,
  TrendingUp,
  Cpu,
  Brain
} from 'lucide-react';
import { useBioregionalHazards } from '../../context/BioregionalHazardContext';
import { audioFeedback } from '../../lib/audioFeedback';
import { DataProvenance } from '../../types';
import { AlertFeedSidebar } from './AlertFeedSidebar';
import { BioregionalHazardD3Map } from './BioregionalHazardD3Map';
import { 
  NotificationPreferencesModal, 
  HazardNotificationPreferences, 
  DEFAULT_NOTIFICATION_PREFERENCES 
} from './NotificationPreferencesModal';
import { DownloadReportModal } from './DownloadReportModal';
import { CompareHazardsModal } from './CompareHazardsModal';
import { ForecastImpactModal } from './ForecastImpactModal';
import { PredictiveHazardModelModal } from './PredictiveHazardModelModal';
import { EpistemicExplanationModal } from './EpistemicExplanationModal';
import { EpistemicScoreTooltip } from './EpistemicScoreTooltip';
import { BioregionalPredictiveSearch, GeographicalBioregion } from './BioregionalPredictiveSearch';
import { HazardSeverityDistributionChart } from './HazardSeverityDistributionChart';
import { StewardshipStreakWidget } from './StewardshipStreakWidget';
import { recordHazardMonitorEngagement } from '../../services/stewardshipStreakService';
import { advanceAchievementProgress } from '../../services/achievementService';

export interface SatelliteHazardAlert {
  id: string;
  satelliteMission: 'Sentinel-2B MSI' | 'Landsat-9 TIRS' | 'GRACE-FO Subsurface' | 'Sentinel-5P TROPOMI' | 'Sentinel-1 C-SAR' | 'ECOSTRESS ISS';
  orbitPassNumber: number;
  bioregionId: string;
  bioregionName: string;
  country: string;
  coordinates: [number, number]; // [lat, lng]
  hazardCategory: 'thermal_fire' | 'aquifer_deficit' | 'canopy_stress' | 'methane_plume' | 'siltation_surge';
  severity: 'EXISTENTIAL' | 'CRITICAL' | 'WARNING' | 'ADVISORY';
  title: string;
  detectedDelta: string;
  baselineValue: string;
  currentValue: string;
  timestamp: string;
  timeAgo: string;
  confidenceScore: number; // 0 - 100
  mitigationProtocol: string;
  stewardCommunity: string;
  acknowledged: boolean;
  merkleHash: string;
  trendReadings: number[];
  trendUnit: string;
  primaryEcologicalImpact?: 'Water Security' | 'Biodiversity' | 'Soil Integrity' | 'Atmospheric Stability' | 'Agrarian Security';
  ecologicalImpactTags?: string[];
  isPreEvent?: boolean;
  hoursToBreach?: number;
  projectedPeakValue?: string;
}

const INITIAL_SATELLITE_ALERTS: SatelliteHazardAlert[] = [
  {
    id: 'sat-alt-000',
    satelliteMission: 'Sentinel-5P TROPOMI',
    orbitPassNumber: 19488,
    bioregionId: 'congo-peatlands',
    bioregionName: 'Congo Basin Cuvette Centrale Peatlands',
    country: 'DRC / Republic of Congo',
    coordinates: [0.22, 18.85],
    hazardCategory: 'methane_plume',
    severity: 'EXISTENTIAL',
    title: 'Irreversible Peatland Moisture Tipping Point & Pyrogenic Collapse',
    detectedDelta: 'Subsurface water table fell -48cm below pyrogenic auto-ignition threshold',
    baselineValue: '1892 ppb atmospheric column',
    currentValue: '1965 ppb runaway degassing plume',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    timeAgo: '3m ago',
    confidenceScore: 99.4,
    mitigationProtocol: 'CRITICAL EXISTENTIAL INTERVENTION: Mobilize Lokolama weir barricades; deploy emergency riparian saturation canal gates.',
    stewardCommunity: 'Central African Rainforest Commission (COMIFAC)',
    acknowledged: false,
    merkleHash: '0x990022faee440188bb33221199aacc01',
    trendReadings: [1890, 1894, 1902, 1915, 1934, 1950, 1965],
    trendUnit: 'ppb CH4',
    primaryEcologicalImpact: 'Atmospheric Stability',
    ecologicalImpactTags: ['Atmospheric Stability', 'Peat Degassing', 'Methane Plume', 'Carbon Sink']
  },
  {
    id: 'sat-alt-001',
    satelliteMission: 'Landsat-9 TIRS',
    orbitPassNumber: 14820,
    bioregionId: 'mara-serengeti',
    bioregionName: 'Mara-Serengeti Transboundary Basin',
    country: 'Kenya / Tanzania',
    coordinates: [-1.50, 35.25],
    hazardCategory: 'thermal_fire',
    severity: 'CRITICAL',
    title: 'Thermal Infrared Hotspot & Dry Grassland Wildfire Risk',
    detectedDelta: '+4.8°C above 10-year seasonal thermal baseline',
    baselineValue: '28.2°C surface radiant temp',
    currentValue: '33.0°C radiant peak',
    timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    timeAgo: '6m ago',
    confidenceScore: 98.6,
    mitigationProtocol: 'Alert Maasai Mara Wildlife Conservancy fire warden mesh; deploy aerial patrol & activate community firebreak corridor.',
    stewardCommunity: 'Talek-Mara Pastoralist Ranger Collective',
    acknowledged: false,
    merkleHash: '0x9e8a71b28d40f31c4b7261908aa312fb',
    trendReadings: [28.2, 28.5, 29.1, 29.8, 30.7, 31.8, 33.0],
    trendUnit: '°C',
    primaryEcologicalImpact: 'Biodiversity',
    ecologicalImpactTags: ['Biodiversity', 'Grassland Ecology', 'Wildfire Threat', 'Savanna Biomass']
  },
  {
    id: 'sat-alt-002',
    satelliteMission: 'Sentinel-2B MSI',
    orbitPassNumber: 38210,
    bioregionId: 'aberdare-water-tower',
    bioregionName: 'Aberdare Cloud Forest Water Tower',
    country: 'Kenya',
    coordinates: [-0.45, 36.70],
    hazardCategory: 'canopy_stress',
    severity: 'WARNING',
    title: 'Riparian Canopy NDVI Stress & Soil Moisture Retreat',
    detectedDelta: 'NDVI index retreated from 0.76 to 0.58 in Northern Catchment',
    baselineValue: '0.76 (Dense Moisture Canopy)',
    currentValue: '0.58 (Moderate Drought Deciduous)',
    timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    timeAgo: '24m ago',
    confidenceScore: 94.2,
    mitigationProtocol: 'Initiate biochar slurry mycorrhizal injection via autonomous drone swarm; throttle upstream commercial irrigation quotas.',
    stewardCommunity: 'Aberdare Community Forest Association (CFA)',
    acknowledged: false,
    merkleHash: '0x3c71a980e12d4b8f72369018ca912071',
    trendReadings: [0.76, 0.74, 0.71, 0.68, 0.64, 0.60, 0.58],
    trendUnit: 'NDVI',
    primaryEcologicalImpact: 'Water Security',
    ecologicalImpactTags: ['Water Security', 'Cloud Forest Tower', 'Canopy Moisture', 'Catchment Health']
  },
  {
    id: 'sat-alt-003',
    satelliteMission: 'GRACE-FO Subsurface',
    orbitPassNumber: 9412,
    bioregionId: 'turkana-basin',
    bioregionName: 'Turkana Deep Pastoralist Aquifer Basin',
    country: 'Kenya / Ethiopia',
    coordinates: [3.12, 35.60],
    hazardCategory: 'aquifer_deficit',
    severity: 'CRITICAL',
    title: 'Subsurface Piezometric Head Deficit & Salinity Infiltration',
    detectedDelta: '-18.4 cm equivalent water thickness (EWT)',
    baselineValue: '-2.1 cm annual mean anomaly',
    currentValue: '-20.5 cm deficit anomaly',
    timestamp: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    timeAgo: '48m ago',
    confidenceScore: 97.4,
    mitigationProtocol: 'Enforce community water rationing covenants; switch Lotikipi solar pumps to emergency nocturnal recharge cycle.',
    stewardCommunity: 'Turkana Water Users Elders Assembly',
    acknowledged: false,
    merkleHash: '0x71ba8920de4568fa0184b239c0919421',
    trendReadings: [-2.1, -4.5, -7.8, -11.2, -14.6, -17.5, -20.5],
    trendUnit: 'cm EWT',
    primaryEcologicalImpact: 'Water Security',
    ecologicalImpactTags: ['Water Security', 'Aquifer Depletion', 'Groundwater Salinity', 'Pastoralist Resilience']
  },
  {
    id: 'sat-alt-004',
    satelliteMission: 'Sentinel-1 C-SAR',
    orbitPassNumber: 27904,
    bioregionId: 'rift-valley-lakes',
    bioregionName: 'Great Rift Valley Alkaline Lakes',
    country: 'Kenya',
    coordinates: [-0.35, 36.08],
    hazardCategory: 'siltation_surge',
    severity: 'WARNING',
    title: 'Synthetic Aperture Radar: Flash Siltation Delta Plume',
    detectedDelta: 'Turbidity backscatter increased 34% post-flash storm',
    baselineValue: '18 NTU sediment backscatter',
    currentValue: '58 NTU storm surge plume',
    timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    timeAgo: '1h 25m ago',
    confidenceScore: 92.8,
    mitigationProtocol: 'Deploy vetiver grass riparian retention filters at Njoro River confluence to prevent lake hypersalinity shock.',
    stewardCommunity: 'Lake Nakuru Catchment Management Forum',
    acknowledged: true,
    merkleHash: '0x1928374a5b6c7d8e9f0123456789abcd',
    trendReadings: [18, 20, 22, 29, 38, 49, 58],
    trendUnit: 'NTU',
    primaryEcologicalImpact: 'Soil Integrity',
    ecologicalImpactTags: ['Soil Integrity', 'Watershed Siltation', 'Erosion Control', 'Alkaline Limnology']
  },
  {
    id: 'sat-alt-005',
    satelliteMission: 'Sentinel-5P TROPOMI',
    orbitPassNumber: 19401,
    bioregionId: 'congo-peatlands',
    bioregionName: 'Congo Basin Cuvette Centrale Peatlands',
    country: 'DRC / Republic of Congo',
    coordinates: [0.04, 18.26],
    hazardCategory: 'methane_plume',
    severity: 'ADVISORY',
    title: 'Peatland Water Table Drop & Methane Micro-Degassing',
    detectedDelta: 'Trace CH4 column density spiked 18 ppb above wet baseline',
    baselineValue: '1892 ppb atmospheric column',
    currentValue: '1910 ppb column plume',
    timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    timeAgo: '2h 20m ago',
    confidenceScore: 89.5,
    mitigationProtocol: 'Ground-truth verification with Lokolama peat core acoustic moisture loggers; prevent drainage canal expansion.',
    stewardCommunity: 'Lokolama Indigenous Peat Guardians Assembly',
    acknowledged: true,
    merkleHash: '0xfe982301cb4758921a94827361928bc1',
    trendReadings: [1892, 1894, 1897, 1900, 1904, 1908, 1910],
    trendUnit: 'ppb CH4',
    primaryEcologicalImpact: 'Atmospheric Stability',
    ecologicalImpactTags: ['Atmospheric Stability', 'Peat Water Table', 'Tropical Wetland']
  },
  {
    id: 'sat-alt-006',
    satelliteMission: 'ECOSTRESS ISS',
    orbitPassNumber: 8431,
    bioregionId: 'sahel-agroforestry',
    bioregionName: 'Sahelian Faidherbia Agro-Forestry Belt',
    country: 'Niger / Mali',
    coordinates: [13.51, 2.12],
    hazardCategory: 'canopy_stress',
    severity: 'WARNING',
    title: 'Transpiration Evapotranspiration Deficit & Flash Drought Anomaly',
    detectedDelta: 'Canopy evaporative stress index spiked +2.3 sigma',
    baselineValue: '0.42 Evaporative Stress Index (ESI)',
    currentValue: '0.71 High Thermal Water Stress',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    timeAgo: '4h ago',
    confidenceScore: 93.7,
    mitigationProtocol: 'Mobilize tillaberi agro-pastoral guilds to apply native mulch cover around Faidherbia albida root zones.',
    stewardCommunity: 'Tillabéri Silvopastoral Stewardship Guild',
    acknowledged: false,
    merkleHash: '0x45a901fbc378912de7840134bca89102',
    trendReadings: [0.42, 0.46, 0.51, 0.57, 0.63, 0.68, 0.71],
    trendUnit: 'ESI',
    primaryEcologicalImpact: 'Agrarian Security',
    ecologicalImpactTags: ['Agrarian Security', 'Silvopastoral Belt', 'Thermal Water Stress', 'Soil Integrity']
  },
  {
    id: 'sat-alt-007',
    satelliteMission: 'Sentinel-1 C-SAR',
    orbitPassNumber: 27889,
    bioregionId: 'kigali-watershed',
    bioregionName: 'Kigali Regenerative Urban Catchment',
    country: 'Rwanda',
    coordinates: [-1.97, 30.10],
    hazardCategory: 'siltation_surge',
    severity: 'ADVISORY',
    title: 'Nyabarongo River Confluence Runoff Siltation Spike',
    detectedDelta: 'Urban storm runoff discharge surge exceeded sponge infiltration buffer by 12%',
    baselineValue: '14 NTU normal urban baseflow',
    currentValue: '38 NTU flash runoff',
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    timeAgo: '9h ago',
    confidenceScore: 91.2,
    mitigationProtocol: 'Open bypass swale gates into wetland retention terraces; activate community desiltation traps.',
    stewardCommunity: 'Umuganda Watershed Restoration Circle',
    acknowledged: true,
    merkleHash: '0x77bb8920ae4568fa0184b239c0919114',
    trendReadings: [14, 15, 17, 21, 26, 32, 38],
    trendUnit: 'NTU',
    primaryEcologicalImpact: 'Soil Integrity',
    ecologicalImpactTags: ['Soil Integrity', 'Urban Sponge Buffer', 'Water Security', 'Sediment Load']
  },
  {
    id: 'sat-alt-008',
    satelliteMission: 'Landsat-9 TIRS',
    orbitPassNumber: 14802,
    bioregionId: 'mara-serengeti',
    bioregionName: 'Mara-Serengeti Transboundary Basin',
    country: 'Kenya / Tanzania',
    coordinates: [-1.62, 35.15],
    hazardCategory: 'thermal_fire',
    severity: 'WARNING',
    title: 'Historical Flank Thermal Inversion & Controlled Burns Drift',
    detectedDelta: '+2.9°C localized grass cover thermal delta',
    baselineValue: '26.4°C normal dusk radiance',
    currentValue: '29.3°C observed radiance',
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    timeAgo: '22h ago',
    confidenceScore: 95.1,
    mitigationProtocol: 'Pastoralist controlled firebreak confirmed by Loita ranger outpost.',
    stewardCommunity: 'Loita Forest Elders Council',
    acknowledged: true,
    merkleHash: '0xcc33dd44ee55ff6600778899aabb1122',
    trendReadings: [26.4, 26.7, 27.1, 27.6, 28.2, 28.8, 29.3],
    trendUnit: '°C',
    primaryEcologicalImpact: 'Biodiversity',
    ecologicalImpactTags: ['Biodiversity', 'Controlled Firebreak', 'Savanna Ecology']
  },
  {
    id: 'sat-alt-009',
    satelliteMission: 'GRACE-FO Subsurface',
    orbitPassNumber: 9380,
    bioregionId: 'turkana-basin',
    bioregionName: 'Turkana Deep Pastoralist Aquifer Basin',
    country: 'Kenya / Ethiopia',
    coordinates: [3.05, 35.65],
    hazardCategory: 'aquifer_deficit',
    severity: 'CRITICAL',
    title: 'Historic Lotikipi Basin Piezometer Stress Event',
    detectedDelta: '-15.2 cm equivalent water thickness drawdown',
    baselineValue: '-2.0 cm seasonal baseflow',
    currentValue: '-17.2 cm drawdown',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    timeAgo: '3d ago',
    confidenceScore: 96.8,
    mitigationProtocol: 'Deep borehole rotational extraction active; pastoralist water point rationing enforced.',
    stewardCommunity: 'Turkana Water Users Elders Assembly',
    acknowledged: true,
    merkleHash: '0x12bb9930fe4568fa0184b239c0919455',
    trendReadings: [-2.0, -5.1, -8.3, -11.9, -14.2, -16.0, -17.2],
    trendUnit: 'cm EWT',
    primaryEcologicalImpact: 'Water Security',
    ecologicalImpactTags: ['Water Security', 'Aquifer Depletion', 'Groundwater', 'Drought']
  },
  {
    id: 'sat-alt-010',
    satelliteMission: 'Sentinel-2B MSI',
    orbitPassNumber: 38140,
    bioregionId: 'aberdare-water-tower',
    bioregionName: 'Aberdare Cloud Forest Water Tower',
    country: 'Kenya',
    coordinates: [-0.48, 36.65],
    hazardCategory: 'canopy_stress',
    severity: 'WARNING',
    title: 'Riparian Silt Buffer Desiccation & Moisture Lag',
    detectedDelta: 'NDVI canopy moisture retreated by 18% in lower riparian corridor',
    baselineValue: '0.74 NDVI canopy index',
    currentValue: '0.61 NDVI moisture lag',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    timeAgo: '6d ago',
    confidenceScore: 94.0,
    mitigationProtocol: 'Riparian restoration swarm deployed native sapling planting along Sasumua intake.',
    stewardCommunity: 'Aberdare Community Forest Association (CFA)',
    acknowledged: true,
    merkleHash: '0x23cc8840ae4568fa0184b239c0919466',
    trendReadings: [0.74, 0.72, 0.70, 0.67, 0.65, 0.63, 0.61],
    trendUnit: 'NDVI',
    primaryEcologicalImpact: 'Water Security',
    ecologicalImpactTags: ['Water Security', 'Cloud Forest', 'Canopy Moisture', 'Catchment']
  },
  {
    id: 'sat-alt-011',
    satelliteMission: 'Sentinel-5P TROPOMI',
    orbitPassNumber: 19390,
    bioregionId: 'congo-peatlands',
    bioregionName: 'Congo Basin Cuvette Centrale Peatlands',
    country: 'DRC / Republic of Congo',
    coordinates: [0.18, 18.90],
    hazardCategory: 'methane_plume',
    severity: 'EXISTENTIAL',
    title: 'Southern Peatland Dome Water Table Critical Subsidence',
    detectedDelta: 'Peat depth moisture fell -42cm below saturation equilibrium',
    baselineValue: '1888 ppb background methane',
    currentValue: '1952 ppb elevated degassing',
    timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    timeAgo: '11d ago',
    confidenceScore: 98.9,
    mitigationProtocol: 'Community dam reinforcement erected along Lokolama tributary to retain swamp saturation.',
    stewardCommunity: 'Central African Rainforest Commission (COMIFAC)',
    acknowledged: true,
    merkleHash: '0x34dd7750be4568fa0184b239c0919477',
    trendReadings: [1888, 1895, 1908, 1922, 1938, 1946, 1952],
    trendUnit: 'ppb CH4',
    primaryEcologicalImpact: 'Atmospheric Stability',
    ecologicalImpactTags: ['Atmospheric Stability', 'Peatland', 'Carbon Sink', 'Methane']
  },
  {
    id: 'sat-alt-012',
    satelliteMission: 'Sentinel-1 C-SAR',
    orbitPassNumber: 27810,
    bioregionId: 'rift-valley-lakes',
    bioregionName: 'Great Rift Valley Alkaline Lakes',
    country: 'Kenya',
    coordinates: [-0.38, 36.12],
    hazardCategory: 'siltation_surge',
    severity: 'ADVISORY',
    title: 'Lake Elmenteita Inlet Agricultural Sediment Spill',
    detectedDelta: 'Sediment plume backscatter increased 22% following heavy upstream cultivation',
    baselineValue: '16 NTU baseflow',
    currentValue: '34 NTU agricultural runoff',
    timestamp: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    timeAgo: '16d ago',
    confidenceScore: 92.5,
    mitigationProtocol: 'Catchment soil conservation committee planted vetiver grass contour bunds.',
    stewardCommunity: 'Lake Nakuru Catchment Management Forum',
    acknowledged: true,
    merkleHash: '0x45ee6660ce4568fa0184b239c0919488',
    trendReadings: [16, 18, 21, 24, 28, 31, 34],
    trendUnit: 'NTU',
    primaryEcologicalImpact: 'Soil Integrity',
    ecologicalImpactTags: ['Soil Integrity', 'Sediment', 'Limnology', 'Erosion']
  },
  {
    id: 'sat-alt-013',
    satelliteMission: 'Landsat-9 TIRS',
    orbitPassNumber: 14750,
    bioregionId: 'mara-serengeti',
    bioregionName: 'Mara-Serengeti Transboundary Basin',
    country: 'Kenya / Tanzania',
    coordinates: [-1.55, 35.30],
    hazardCategory: 'thermal_fire',
    severity: 'CRITICAL',
    title: 'Mid-Basin Dry Grassland Radiant Incursion',
    detectedDelta: '+4.1°C surface thermal variance during mid-day pass',
    baselineValue: '27.8°C normal seasonal radiant temp',
    currentValue: '31.9°C thermal anomaly',
    timestamp: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    timeAgo: '22d ago',
    confidenceScore: 97.2,
    mitigationProtocol: 'Aerial reconnaissance guided ranger teams to suppress unauthorized bush clearing.',
    stewardCommunity: 'Talek-Mara Pastoralist Ranger Collective',
    acknowledged: true,
    merkleHash: '0x56ff5570de4568fa0184b239c0919499',
    trendReadings: [27.8, 28.3, 29.0, 29.8, 30.6, 31.2, 31.9],
    trendUnit: '°C',
    primaryEcologicalImpact: 'Biodiversity',
    ecologicalImpactTags: ['Biodiversity', 'Wildfire', 'Grassland', 'Thermal']
  },
  {
    id: 'sat-alt-014',
    satelliteMission: 'Sentinel-2B MSI',
    orbitPassNumber: 38050,
    bioregionId: 'sahel-agroforestry',
    bioregionName: 'Sahelian Faidherbia Agro-Forestry Belt',
    country: 'Niger / Mali',
    coordinates: [13.48, 2.18],
    hazardCategory: 'canopy_stress',
    severity: 'WARNING',
    title: 'Dry Season Reverse-Phenology Canopy Stress',
    detectedDelta: 'Evaporative stress anomaly increased +1.9 sigma',
    baselineValue: '0.40 Evaporative Stress Index',
    currentValue: '0.66 Stress peak',
    timestamp: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    timeAgo: '26d ago',
    confidenceScore: 93.1,
    mitigationProtocol: 'Community agro-forestry guilds layered organic compost and mulched key tree basins.',
    stewardCommunity: 'Tillabéri Silvopastoral Stewardship Guild',
    acknowledged: true,
    merkleHash: '0x67aa4480ee4568fa0184b239c0919500',
    trendReadings: [0.40, 0.44, 0.49, 0.54, 0.58, 0.62, 0.66],
    trendUnit: 'ESI',
    primaryEcologicalImpact: 'Agrarian Security',
    ecologicalImpactTags: ['Agrarian Security', 'Agroforestry', 'Dryland', 'Canopy']
  },
  {
    id: 'sat-alt-015',
    satelliteMission: 'GRACE-FO Subsurface',
    orbitPassNumber: 9280,
    bioregionId: 'indo-gangetic',
    bioregionName: 'Indo-Gangetic Transboundary Aquifer',
    country: 'India / Nepal / Bangladesh',
    coordinates: [26.85, 80.94],
    hazardCategory: 'aquifer_deficit',
    severity: 'WARNING',
    title: 'Pre-Monsoon Deep Piezometer Drawdown',
    detectedDelta: '-12.6 cm equivalent water thickness deficit',
    baselineValue: '-1.5 cm baseline',
    currentValue: '-14.1 cm drawdown',
    timestamp: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
    timeAgo: '48d ago',
    confidenceScore: 95.8,
    mitigationProtocol: 'Rotational agricultural pumping schedule coordinated across district canal networks.',
    stewardCommunity: 'Transboundary Ganges-Brahmaputra Water Council',
    acknowledged: true,
    merkleHash: '0x78bb3390fe4568fa0184b239c0919511',
    trendReadings: [-1.5, -3.8, -6.2, -8.9, -11.0, -12.8, -14.1],
    trendUnit: 'cm EWT',
    primaryEcologicalImpact: 'Water Security',
    ecologicalImpactTags: ['Water Security', 'Aquifer', 'Alluvial Basin', 'Piezometer']
  }
];

interface BioregionalHazardMonitorProps {
  compact?: boolean;
  onInspectProvenance?: (prov: DataProvenance) => void;
  onNavigateToBioregion?: (bioregionId: string) => void;
}

export const BioregionalHazardMonitor: React.FC<BioregionalHazardMonitorProps> = ({
  compact = false,
  onInspectProvenance,
  onNavigateToBioregion
}) => {
  const { alerts: contextAlerts, criticalCount: contextCriticalCount } = useBioregionalHazards();
  const [alerts, setAlerts] = useState<SatelliteHazardAlert[]>(INITIAL_SATELLITE_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'EXISTENTIAL' | 'CRITICAL' | 'WARNING' | 'ADVISORY'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [selectedAlert, setSelectedAlert] = useState<SatelliteHazardAlert | null>(INITIAL_SATELLITE_ALERTS[0]);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  
  // UI State: Sidebar, Map display, Modals
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<'split' | 'map' | 'inspector'>('split');
  const [targetMapCoordinates, setTargetMapCoordinates] = useState<[number, number] | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareAlertA, setCompareAlertA] = useState<SatelliteHazardAlert | null>(null);
  const [compareAlertB, setCompareAlertB] = useState<SatelliteHazardAlert | null>(null);
  const [isForecastOpen, setIsForecastOpen] = useState<boolean>(false);
  const [forecastTargetAlert, setForecastTargetAlert] = useState<SatelliteHazardAlert | null>(null);
  const [isPredictiveModelOpen, setIsPredictiveModelOpen] = useState<boolean>(false);
  const [isEpistemicOpen, setIsEpistemicOpen] = useState<boolean>(false);
  const [epistemicAlert, setEpistemicAlert] = useState<SatelliteHazardAlert | null>(null);

  // Notification Preferences State (Persisted in localStorage)
  const [preferences, setPreferences] = useState<HazardNotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem('atlas_hazard_notification_preferences');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Fallback
    }
    return DEFAULT_NOTIFICATION_PREFERENCES;
  });

  const handleSavePreferences = (newPrefs: HazardNotificationPreferences) => {
    setPreferences(newPrefs);
    try {
      localStorage.setItem('atlas_hazard_notification_preferences', JSON.stringify(newPrefs));
    } catch (e) {
      // Ignore storage errors
    }
  };

  // Auto-Sync 30s Countdown and Refresh Engine
  const [syncCountdown, setSyncCountdown] = useState<number>(30);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Viewport bounds for satellite telemetry ingestion
  const [viewportBounds, setViewportBounds] = useState<{ minLat: number; maxLat: number; minLng: number; maxLng: number }>({
    minLat: -15.0,
    maxLat: 15.0,
    minLng: 10.0,
    maxLng: 52.0
  });
  const [isSatelliteTelemetryOnline, setIsSatelliteTelemetryOnline] = useState<boolean>(true);
  const [satelliteTelemetryCount, setSatelliteTelemetryCount] = useState<number>(0);

  // Fetch real-time satellite telemetry for current viewport
  const fetchViewportTelemetry = async (bounds = viewportBounds, cat = filterCategory) => {
    try {
      const categoryParam = cat === 'ALL' ? 'all' : cat;
      const res = await fetch(`/api/satellite/viewport-telemetry?minLat=${bounds.minLat}&maxLat=${bounds.maxLat}&minLng=${bounds.minLng}&maxLng=${bounds.maxLng}&category=${categoryParam}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.alerts)) {
        setIsSatelliteTelemetryOnline(true);
        setSatelliteTelemetryCount(data.alerts.length);
        setAlerts(prev => {
          const prevMap = new Map(prev.map(a => [a.id, a]));
          data.alerts.forEach((alert: SatelliteHazardAlert) => {
            prevMap.set(alert.id, {
              ...alert,
              // Normalize hazard categories for UI compatibility
              hazardCategory: ((alert as any).hazardCategory === 'wildfire' ? 'thermal_fire' :
                               (alert as any).hazardCategory === 'flood' ? 'siltation_surge' :
                               (alert as any).hazardCategory === 'deforestation' ? 'canopy_stress' :
                               alert.hazardCategory) as any
            });
          });
          return Array.from(prevMap.values());
        });
      }
    } catch (err) {
      console.warn('Satellite viewport telemetry fetch error:', err);
    }
  };

  // Initial fetch and category change fetch
  useEffect(() => {
    fetchViewportTelemetry(viewportBounds, filterCategory);
  }, [filterCategory]);

  // Listen to viewport changes from D3 Map
  useEffect(() => {
    const handleViewportChange = (e: any) => {
      if (e.detail?.bounds) {
        setViewportBounds(e.detail.bounds);
        fetchViewportTelemetry(e.detail.bounds, filterCategory);
      }
    };
    window.addEventListener('hazard-map-viewport-changed', handleViewportChange);
    return () => {
      window.removeEventListener('hazard-map-viewport-changed', handleViewportChange);
    };
  }, [filterCategory]);

  // Trigger telemetry refresh
  const handleTriggerTelemetrySync = () => {
    setIsSyncing(true);
    setLastSyncTime(new Date());

    // Fetch fresh live satellite passes
    fetchViewportTelemetry(viewportBounds, filterCategory);

    // Live sensor update simulation: micro-jitter on values
    setAlerts(prev => prev.map(a => {
      if (a.hazardCategory === 'thermal_fire') {
        const delta = +(Math.random() * 0.4 - 0.2).toFixed(1);
        const last = a.trendReadings[a.trendReadings.length - 1];
        const updated = +(last + delta).toFixed(1);
        return {
          ...a,
          trendReadings: [...a.trendReadings.slice(1), updated],
          currentValue: `${updated}°C radiant peak`
        };
      }
      if (a.hazardCategory === 'methane_plume') {
        const delta = Math.floor(Math.random() * 6 - 3);
        const last = a.trendReadings[a.trendReadings.length - 1];
        const updated = last + delta;
        return {
          ...a,
          trendReadings: [...a.trendReadings.slice(1), updated],
          currentValue: `${updated} ppb plume`
        };
      }
      if (a.hazardCategory === 'canopy_stress') {
        const delta = +(Math.random() * 0.02 - 0.01).toFixed(3);
        const last = a.trendReadings[a.trendReadings.length - 1];
        const updated = +(Math.max(0.2, Math.min(0.9, last + delta))).toFixed(2);
        return {
          ...a,
          trendReadings: [...a.trendReadings.slice(1), updated]
        };
      }
      return a;
    }));

    if (preferences.soundEnabled) {
      audioFeedback.playMicroTick();
    }

    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  // 30-second Auto-Sync Countdown
  useEffect(() => {
    if (!preferences.autoSync || !isLiveStreaming) {
      setSyncCountdown(30);
      return;
    }

    const interval = setInterval(() => {
      setSyncCountdown(prev => {
        if (prev <= 1) {
          handleTriggerTelemetrySync();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [preferences.autoSync, isLiveStreaming, preferences.soundEnabled]);

  const handleToggleAutoSync = () => {
    audioFeedback.playMicroTick();
    const next = !preferences.autoSync;
    handleSavePreferences({
      ...preferences,
      autoSync: next
    });
  };

  // Jump to Bioregion from Predictive Search
  const handleJumpToBioregion = (bioregion: GeographicalBioregion) => {
    setTargetMapCoordinates(bioregion.coordinates);

    // Dispatch global window event so BioregionalImpactD3Map also centers and zooms
    window.dispatchEvent(new CustomEvent('focus-hazard-coordinates', {
      detail: {
        coordinates: bioregion.coordinates,
        title: bioregion.name,
        bioregionId: bioregion.id,
        zoom: preferences.maintainContext ? undefined : 4.5,
        maintainContext: preferences.maintainContext
      }
    }));

    // Select alert in this bioregion if one exists
    const matchingAlert = alerts.find(a => a.bioregionId === bioregion.id);
    if (matchingAlert) {
      setSelectedAlert(matchingAlert);
    }

    if (onNavigateToBioregion) {
      onNavigateToBioregion(bioregion.id);
    }
  };

  // Centering & Zooming Map directly when an alert is clicked
  const handleSelectAndCenterAlert = (alert: SatelliteHazardAlert) => {
    setSelectedAlert(alert);
    setTargetMapCoordinates(alert.coordinates);

    if (preferences.autoCenterMap) {
      // Dispatch global window event so BioregionalImpactD3Map also centers and zooms
      window.dispatchEvent(new CustomEvent('focus-hazard-coordinates', {
        detail: {
          coordinates: alert.coordinates,
          title: alert.title,
          bioregionId: alert.bioregionId,
          zoom: preferences.maintainContext ? undefined : 4.5,
          maintainContext: preferences.maintainContext
        }
      }));
    }

    if (onNavigateToBioregion) {
      onNavigateToBioregion(alert.bioregionId);
    }
  };

  // Acknowledge alert
  const handleAcknowledge = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    audioFeedback.playSuccessChime();
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  // Simulate incoming real-time satellite alert
  const handleSimulateSatelliteBreach = () => {
    setSimulating(true);
    if (preferences.soundEnabled) {
      audioFeedback.playTelemetryWarning();
    }

    setTimeout(() => {
      const missions: SatelliteHazardAlert['satelliteMission'][] = [
        'Sentinel-2B MSI',
        'Landsat-9 TIRS',
        'GRACE-FO Subsurface',
        'Sentinel-5P TROPOMI',
        'ECOSTRESS ISS'
      ];
      const categories: SatelliteHazardAlert['hazardCategory'][] = [
        'thermal_fire',
        'aquifer_deficit',
        'canopy_stress',
        'methane_plume',
        'siltation_surge'
      ];
      const randomMission = missions[Math.floor(Math.random() * missions.length)];
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      const passNum = Math.floor(20000 + Math.random() * 30000);

      const latOffset = (Math.random() - 0.5) * 0.2;
      const lngOffset = (Math.random() - 0.5) * 0.2;
      const newCoords: [number, number] = [-1.48 + latOffset, 35.22 + lngOffset];

      const simUnits: Record<SatelliteHazardAlert['hazardCategory'], string> = {
        thermal_fire: '°C',
        aquifer_deficit: 'cm EWT',
        canopy_stress: 'NDVI',
        methane_plume: 'ppb CH4',
        siltation_surge: 'NTU'
      };

      const baseVal = randomCat === 'thermal_fire' ? 28 : randomCat === 'siltation_surge' ? 20 : randomCat === 'canopy_stress' ? 0.75 : 1890;
      const step = randomCat === 'canopy_stress' ? -0.03 : 1.8;
      const simReadings = Array.from({ length: 7 }, (_, i) => Number((baseVal + step * i).toFixed(2)));

      const newAlert: SatelliteHazardAlert = {
        id: `sat-sim-${Date.now()}`,
        satelliteMission: randomMission,
        orbitPassNumber: passNum,
        bioregionId: 'mara-serengeti',
        bioregionName: 'Mara-Serengeti Transboundary Basin',
        country: 'Kenya / Tanzania',
        coordinates: newCoords,
        hazardCategory: randomCat,
        severity: Math.random() > 0.6 ? 'CRITICAL' : 'WARNING',
        title: `Satellite Telemetry Anomaly Detected: ${randomCat.replace('_', ' ').toUpperCase()}`,
        detectedDelta: 'Instantaneous sensor excursion: 3.4 standard deviations above 30-day baseline',
        baselineValue: 'Normal seasonal threshold',
        currentValue: 'Critical threshold breach',
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now',
        confidenceScore: Number((96 + Math.random() * 3.8).toFixed(1)),
        mitigationProtocol: 'Automated telemetry alert dispatched to regional field stewards & drone sensing hub.',
        stewardCommunity: 'Bioregional Autonomous Response Unit',
        acknowledged: false,
        merkleHash: `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        trendReadings: simReadings,
        trendUnit: simUnits[randomCat]
      };

      setAlerts(prev => [newAlert, ...prev]);
      handleSelectAndCenterAlert(newAlert);
      setSimulating(false);
      
      if (preferences.soundEnabled) {
        audioFeedback.playBell([440, 880], 0.3);
      }
    }, 600);
  };

  // Filter alerts applying both explicit filters and Notification Preferences
  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      // 1. Notification Preferences filter
      if (a.hazardCategory === 'thermal_fire' && !preferences.wildfire) return false;
      if (a.hazardCategory === 'siltation_surge' && !preferences.flood) return false;
      if (a.hazardCategory === 'canopy_stress' && !preferences.deforestation) return false;
      if (a.hazardCategory === 'aquifer_deficit' && !preferences.aquiferDeficit) return false;
      if (a.hazardCategory === 'methane_plume' && !preferences.methanePlume) return false;

      // Severity preferences
      if (preferences.minSeverity === 'CRITICAL_ONLY' && a.severity !== 'CRITICAL' && a.severity !== 'EXISTENTIAL') return false;
      if (preferences.minSeverity === 'WARNING_CRITICAL' && a.severity === 'ADVISORY') return false;

      // 2. Toolbar filters
      if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
      if (filterCategory !== 'ALL' && a.hazardCategory !== filterCategory) return false;

      return true;
    });
  }, [alerts, filterSeverity, filterCategory, preferences]);

  const existentialCount = alerts.filter(a => a.severity === 'EXISTENTIAL' && !a.acknowledged).length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && !a.acknowledged).length;
  const warningCount = alerts.filter(a => a.severity === 'WARNING' && !a.acknowledged).length;

  const getCategoryIcon = (cat: SatelliteHazardAlert['hazardCategory']) => {
    switch (cat) {
      case 'thermal_fire':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'aquifer_deficit':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'canopy_stress':
        return <TreePine className="w-4 h-4 text-emerald-400" />;
      case 'methane_plume':
        return <Wind className="w-4 h-4 text-purple-400" />;
      case 'siltation_surge':
        return <Layers className="w-4 h-4 text-blue-400" />;
    }
  };

  const getSeverityBadge = (sev: SatelliteHazardAlert['severity']) => {
    switch (sev) {
      case 'EXISTENTIAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/90 border border-rose-600 text-rose-300 flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            EXISTENTIAL
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/80 border border-rose-500/50 text-rose-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-500/50 text-amber-300">
            WARNING
          </span>
        );
      case 'ADVISORY':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950/80 border border-blue-500/50 text-blue-300">
            ADVISORY
          </span>
        );
    }
  };

  // Calculate active notification types count
  const activePrefsCount = [
    preferences.wildfire,
    preferences.flood,
    preferences.deforestation,
    preferences.aquiferDeficit,
    preferences.methanePlume
  ].filter(Boolean).length;

  return (
    <div 
      id="bioregional-hazard-monitor-widget"
      className="bg-[#0D110E] border border-[#1B3022] hover:border-[#C5A059]/40 rounded-xl overflow-hidden shadow-2xl transition-all"
    >
      {/* Widget Header */}
      <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-[#121B14] via-[#0D110E] to-[#121B14] border-b border-[#1B3022] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg bg-[#1B3022]/60 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
            <Satellite className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5F5F0]">
                Bioregional Hazard Monitor
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold">
                ORBITAL TELEMETRY
              </span>
              {satelliteTelemetryCount > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  VIIRS/Sentinel Ingest: {satelliteTelemetryCount} active
                </span>
              )}
            </div>
            <p className="text-xs text-[#F5F5F0]/60 font-sans">
              Real-time satellite-driven environmental alerts, chronologic hazard feed & planetary telemetry
            </p>
          </div>
        </div>

        {/* Header Action Buttons: Notification Preferences, Maintain Context Toggle, Download Report, Simulate, Stream */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Active alerts counter badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 border border-[#F5F5F0]/15 rounded-full text-xs font-mono">
            {existentialCount > 0 && (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-rose-400 font-bold">{existentialCount}</span>
                <span className="text-rose-300/80 text-[10px]">Existential</span>
                <span className="text-[#F5F5F0]/30">•</span>
              </>
            )}
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-rose-300 font-bold">{criticalCount}</span>
            <span className="text-[#F5F5F0]/50 text-[10px]">Critical</span>
            <span className="text-[#F5F5F0]/30">•</span>
            <span className="text-amber-300 font-bold">{warningCount}</span>
            <span className="text-[#F5F5F0]/50 text-[10px]">Warn</span>
          </div>

          {/* Maintain Context Toggle Button */}
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              handleSavePreferences({
                ...preferences,
                maintainContext: !preferences.maintainContext
              });
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border shadow-sm ${
              preferences.maintainContext
                ? 'bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]/60 font-bold'
                : 'bg-black/50 text-[#F5F5F0]/60 border-[#1B3022] hover:border-white/20'
            }`}
            title={preferences.maintainContext ? 'Maintain Context is ON (preserves zoom level on click)' : 'Maintain Context is OFF (auto-zooms to 4.2x)'}
          >
            <Crosshair className={`w-3.5 h-3.5 ${preferences.maintainContext ? 'text-[#C5A059]' : 'text-white/40'}`} />
            <span className="hidden sm:inline">Maintain Context:</span>
            <span>{preferences.maintainContext ? 'ON' : 'OFF'}</span>
          </button>

          {/* Notification Preferences Sub-Menu Trigger */}
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsPreferencesOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 hover:bg-[#1B3022] text-[#F5F5F0] hover:text-[#C5A059] border border-[#1B3022] hover:border-[#C5A059]/50 rounded-lg text-xs font-mono transition-all cursor-pointer shadow-sm"
            title="Notification Preferences: Toggle alert types (wildfire, flood, deforestation)"
          >
            <Bell className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden sm:inline">Preferences</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1B3022] border border-[#C5A059]/30 text-[#C5A059]">
              {activePrefsCount}/5
            </span>
          </button>

          {/* Auto-Sync 30s Quick Toggle & Countdown */}
          <button
            id="quick-auto-sync-toggle-btn"
            onClick={handleToggleAutoSync}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border shadow-sm ${
              preferences.autoSync
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 font-bold'
                : 'bg-black/50 border-white/10 text-white/50 hover:text-white hover:border-white/20'
            }`}
            title="Auto-Sync: Automatically refreshes real-time telemetry data every 30 seconds"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : preferences.autoSync ? 'text-emerald-400' : 'text-white/40'}`} />
            <span className="hidden sm:inline">Auto-Sync:</span>
            <span>{preferences.autoSync ? `${syncCountdown}s` : 'OFF'}</span>
            {isSyncing && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          {/* Bulk Export Button */}
          <button
            id="bulk-export-telemetry-btn"
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsDownloadOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#142318] hover:bg-[#1E3625] text-[#C5A059] border border-[#C5A059]/40 hover:border-[#C5A059] rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
            title="Bulk Export: Generate and download comprehensive JSON or CSV report filtered by date range"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bulk Export</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1B3022] border border-[#C5A059]/30 text-emerald-400">
              CSV/JSON
            </span>
          </button>

          {/* Predictive Model Button */}
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsPredictiveModelOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/40 hover:border-purple-400 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
            title="AI Predictive Hazard Model: Proactively generate pre-event alert warnings"
          >
            <TrendingUp className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span className="hidden sm:inline">Predictive Model</span>
          </button>

          {/* Compare Hazards Button */}
          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              setIsCompareOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-500/40 hover:border-blue-400 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
            title="Compare two past hazard alerts side-by-side"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-300" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          {/* Simulate Breach Trigger */}
          <button
            onClick={handleSimulateSatelliteBreach}
            disabled={simulating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 hover:border-[#C5A059] rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            title="Simulate incoming satellite telemetry breach packet"
          >
            <Sparkles className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Simulate Alert</span>
          </button>

          {/* Live stream toggle */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              isLiveStreaming
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-bold'
                : 'bg-black/40 border-white/10 text-white/50'
            }`}
            title={isLiveStreaming ? 'Orbital stream live' : 'Orbital stream paused'}
          >
            <Radio className={`w-3 h-3 ${isLiveStreaming ? 'animate-pulse text-emerald-400' : ''}`} />
            <span className="text-[10px]">{isLiveStreaming ? 'LIVE ORBIT' : 'PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: Filter Bar & View Layout Modes */}
      <div className="px-4 sm:px-6 py-2.5 bg-black/40 border-b border-[#1B3022]/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[#F5F5F0]/50 text-[11px] flex items-center gap-1">
            <Filter className="w-3 h-3" /> Severity:
          </span>
          {(['ALL', 'EXISTENTIAL', 'CRITICAL', 'WARNING', 'ADVISORY'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => {
                audioFeedback.playMicroTick();
                setFilterSeverity(sev);
              }}
              className={`px-2 py-0.5 rounded text-[10px] uppercase transition-colors cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'bg-[#141414] hover:bg-[#1A1A1A] text-[#F5F5F0]/60 border border-[#F5F5F0]/10'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* View Layout Mode Buttons: Split Radar vs Map Focus vs Inspector */}
        <div className="flex items-center gap-1">
          {[
            { id: 'split' as const, label: 'Split Radar', icon: <Layers className="w-3 h-3" /> },
            { id: 'map' as const, label: 'Full D3 Map', icon: <Globe2 className="w-3 h-3" /> },
            { id: 'inspector' as const, label: 'Inspector', icon: <Eye className="w-3 h-3" /> }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => {
                audioFeedback.playMicroTick();
                setActiveViewMode(view.id);
              }}
              className={`px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                activeViewMode === view.id
                  ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/50 font-bold'
                  : 'bg-black/30 text-[#F5F5F0]/60 hover:text-white border border-white/5'
              }`}
            >
              {view.icon}
              <span className="hidden sm:inline">{view.label}</span>
            </button>
          ))}

          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[#1B3022] text-[11px] text-[#F5F5F0]/60">
            <Clock className="w-3 h-3 text-[#C5A059]" />
            <span>Pass: {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Real-time Predictive Bioregion Search, Severity Distribution & Stewardship Streak Strip */}
      <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-b from-[#0A0D0B] to-[#070908] border-b border-[#1B3022]/80 space-y-3">
        {/* Daily Stewardship Streak Cockpit Bar */}
        <StewardshipStreakWidget />

        {/* Real-Time Predictive Search Bar */}
        <BioregionalPredictiveSearch
          onJumpToBioregion={handleJumpToBioregion}
          currentActiveBioregionId={selectedAlert?.bioregionId}
        />

        {/* 30-Day Hazard Frequency Distribution Bar Chart */}
        <HazardSeverityDistributionChart
          alerts={alerts}
          activeSeverityFilter={filterSeverity}
          onSelectSeverityFilter={(sev) => setFilterSeverity(sev)}
        />
      </div>

      {/* Main Workspace: Alert Feed Sidebar + Dynamic Telemetry & Map Content */}
      <div className="flex flex-col md:flex-row min-h-[480px]">
        {/* 1. Alert Feed Sidebar: Chronological history of past satellite-triggered environmental alerts */}
        <AlertFeedSidebar
          alerts={alerts}
          selectedAlertId={selectedAlert?.id}
          onSelectAlert={(alert) => {
            setSelectedAlert(alert);
            recordHazardMonitorEngagement('Telemetry Alert Selected & Audited');
            advanceAchievementProgress('ach-100th-alert', 1);
          }}
          onCenterMap={(coords, alert) => handleSelectAndCenterAlert(alert)}
          onForecastImpact={(alert) => {
            setForecastTargetAlert(alert);
            setIsForecastOpen(true);
          }}
          onCompareAlert={(alert) => {
            setCompareAlertA(alert);
            setIsCompareOpen(true);
          }}
          onOpenPredictiveModel={() => setIsPredictiveModelOpen(true)}
          onEpistemicExplain={(alert) => {
            setEpistemicAlert(alert);
            setIsEpistemicOpen(true);
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* 2. Main Content: Interactive D3 Hazard Map & Telemetry Inspector */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#080B09]">
          {/* View Mode: Full D3 Map */}
          {activeViewMode === 'map' && (
            <div className="p-3 h-[480px]">
              <BioregionalHazardD3Map
                alerts={filteredAlerts}
                selectedAlert={selectedAlert}
                onSelectAlert={(alert) => handleSelectAndCenterAlert(alert)}
                targetCoordinates={targetMapCoordinates}
                maintainContext={preferences.maintainContext}
              />
            </div>
          )}

          {/* View Mode: Split Radar (D3 Map + Selected Alert Inspector Side-by-Side) */}
          {activeViewMode === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 divide-y lg:divide-y-0 lg:divide-x divide-[#1B3022]">
              {/* Left Column in Split: Interactive D3 Geographic Map */}
              <div className="lg:col-span-6 p-3 flex flex-col h-[320px] lg:h-auto min-h-[300px]">
                <div className="mb-2 flex items-center justify-between text-xs font-mono text-[#F5F5F0]/70">
                  <span className="flex items-center gap-1 text-[#C5A059]">
                    <Crosshair className="w-3.5 h-3.5" /> Interactive D3 Hazard Radar
                  </span>
                  <span className="text-[10px] text-[#F5F5F0]/40">
                    Click alert in feed to {preferences.maintainContext ? 'highlight (zoom locked)' : 'center & zoom'}
                  </span>
                </div>
                <div className="flex-1 rounded-lg overflow-hidden border border-[#1B3022]">
                  <BioregionalHazardD3Map
                    alerts={filteredAlerts}
                    selectedAlert={selectedAlert}
                    onSelectAlert={(alert) => handleSelectAndCenterAlert(alert)}
                    targetCoordinates={targetMapCoordinates}
                    maintainContext={preferences.maintainContext}
                  />
                </div>
              </div>

              {/* Right Column in Split: Selected Alert Detail Inspector */}
              <div className="lg:col-span-6 p-4 sm:p-5 flex flex-col justify-between space-y-4 overflow-y-auto max-h-[520px]">
                {selectedAlert ? (
                  <div className="space-y-4">
                    {/* Detail Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-[#1B3022] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <EpistemicScoreTooltip
                            alert={selectedAlert}
                            onOpenFullExplanation={(a) => {
                              setEpistemicAlert(a);
                              setIsEpistemicOpen(true);
                            }}
                            position="bottom"
                          >
                            {getSeverityBadge(selectedAlert.severity)}
                          </EpistemicScoreTooltip>
                          <span className="text-xs font-mono text-[#C5A059]">
                            {selectedAlert.satelliteMission}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-serif font-bold text-[#F5F5F0] mt-1">
                          {selectedAlert.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-mono text-[#F5F5F0]/60 mt-0.5">
                          <Compass className="w-3 h-3 text-[#C5A059]" />
                          <span>{selectedAlert.bioregionName} ({selectedAlert.country})</span>
                          <span>• {selectedAlert.coordinates[0].toFixed(2)}°, {selectedAlert.coordinates[1].toFixed(2)}°</span>
                        </div>
                      </div>

                      <EpistemicScoreTooltip
                        alert={selectedAlert}
                        onOpenFullExplanation={(a) => {
                          setEpistemicAlert(a);
                          setIsEpistemicOpen(true);
                        }}
                        position="left"
                      >
                        <div className="text-right shrink-0 p-1.5 rounded-lg bg-black/40 border border-emerald-500/20 hover:border-emerald-500/50 transition-colors">
                          <div className="text-[10px] font-mono text-[#F5F5F0]/40 uppercase flex items-center gap-1 justify-end">
                            <span>Epistemic Certainty</span>
                            <span className="text-[9px] text-[#C5A059]">ℹ</span>
                          </div>
                          <div className="text-base font-mono font-bold text-emerald-400">
                            {selectedAlert.confidenceScore}%
                          </div>
                        </div>
                      </EpistemicScoreTooltip>
                    </div>

                    {/* Spectral & Telemetry Analysis Block */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-black/60 border border-[#1B3022] space-y-1">
                        <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50">Seasonal Baseline</div>
                        <div className="text-xs font-mono text-[#F5F5F0] font-bold">{selectedAlert.baselineValue}</div>
                      </div>

                      <div className="p-3 rounded-lg bg-black/60 border border-rose-500/30 space-y-1">
                        <div className="text-[10px] font-mono uppercase text-rose-400">Current Satellite Reading</div>
                        <div className="text-xs font-mono text-rose-200 font-bold">{selectedAlert.currentValue}</div>
                      </div>
                    </div>

                    {/* Detected Delta */}
                    <div className="p-3 rounded-lg bg-[#1B3022]/30 border border-[#C5A059]/30 text-xs font-mono space-y-1">
                      <div className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" /> Sensor Anomaly Discrepancy
                      </div>
                      <p className="text-[#F5F5F0]/90 leading-relaxed font-sans text-xs">
                        {selectedAlert.detectedDelta}
                      </p>
                    </div>

                    {/* Mitigation Action Accord */}
                    <div className="p-3 rounded-lg bg-black/40 border border-[#1B3022] space-y-1.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" /> Co-Stewardship Mitigation Protocol
                      </div>
                      <p className="text-xs font-sans text-[#F5F5F0]/80 leading-relaxed">
                        {selectedAlert.mitigationProtocol}
                      </p>
                      <div className="text-[10px] font-mono text-[#F5F5F0]/50 pt-1">
                        Assigned Authority: <span className="text-[#F5F5F0]">{selectedAlert.stewardCommunity}</span>
                      </div>
                    </div>

                    {/* Cryptographic Audit Hash */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/40 pt-1 border-t border-[#1B3022]">
                      <span className="truncate max-w-[240px]">
                        Merkle: {selectedAlert.merkleHash}
                      </span>
                      <span>Orbit Pass #{selectedAlert.orbitPassNumber}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 text-[#F5F5F0]/50 font-mono text-xs">
                    Select an alert from the orbital telemetry feed to inspect satellite metadata and center map.
                  </div>
                )}

                {/* Action Buttons */}
                {selectedAlert && (
                  <div className="pt-3 border-t border-[#1B3022] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleSelectAndCenterAlert(selectedAlert)}
                        className="px-3 py-1.5 bg-[#1B3022] hover:bg-[#C5A059] hover:text-black text-[#C5A059] border border-[#C5A059]/40 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        title="Center and zoom D3 map to exact hazard coordinates"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>Center on Map</span>
                      </button>

                      {/* Forecast Impact Button */}
                      <button
                        onClick={() => {
                          audioFeedback.playMicroTick();
                          setForecastTargetAlert(selectedAlert);
                          setIsForecastOpen(true);
                        }}
                        className="px-3 py-1.5 bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        title="Simulate downstream infrastructural effects with Gemini reasoning engine"
                      >
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Forecast Impact</span>
                      </button>

                      {/* Compare Button */}
                      <button
                        onClick={() => {
                          audioFeedback.playMicroTick();
                          setCompareAlertA(selectedAlert);
                          setIsCompareOpen(true);
                        }}
                        className="px-3 py-1.5 bg-blue-950/60 hover:bg-blue-900 border border-blue-500/40 text-blue-300 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        title="Compare sensor readings with another hazard alert"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5 text-blue-300" />
                        <span>Compare</span>
                      </button>

                      {/* Epistemic AI Explain Button */}
                      <button
                        onClick={() => {
                          audioFeedback.playMicroTick();
                          setEpistemicAlert(selectedAlert);
                          setIsEpistemicOpen(true);
                        }}
                        className="px-3 py-1.5 bg-[#171408] hover:bg-[#25200C] border border-[#C5A059]/50 text-[#C5A059] rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        title="Inspect Epistemic AI Explanation: View Bayesian sensor weights, mathematical formula, and AI provenance"
                      >
                        <Brain className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Epistemic AI Explain</span>
                      </button>

                      {!selectedAlert.acknowledged ? (
                        <button
                          onClick={(e) => handleAcknowledge(selectedAlert.id, e)}
                          className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Acknowledge</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Attested
                        </span>
                      )}
                    </div>

                    {onInspectProvenance && (
                      <button
                        onClick={() => {
                          audioFeedback.playSubtleClick();
                          onInspectProvenance({
                            id: selectedAlert.id,
                            source: selectedAlert.satelliteMission,
                            sourceType: 'satellite_telemetry',
                            collectedAt: selectedAlert.timestamp,
                            calculationMethod: 'Spectral Radiance Anomaly Index & Thermal Band Comparison',
                            certaintyScore: selectedAlert.confidenceScore,
                            verifier: selectedAlert.stewardCommunity,
                            verifierRole: 'Autonomous Sensing Sentinel',
                            cryptographicHash: selectedAlert.merkleHash,
                            assumptions: ['Clear atmospheric transmission index', 'Orbital pass baseline calibration valid'],
                            lastAudited: selectedAlert.timestamp
                          });
                        }}
                        className="px-3 py-1.5 bg-black/60 hover:bg-black/90 border border-[#C5A059]/40 hover:border-[#C5A059] text-[#C5A059] rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Provenance</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* View Mode: Deep Telemetry Inspector */}
          {activeViewMode === 'inspector' && (
            <div className="p-4 sm:p-6 space-y-4 max-h-[500px] overflow-y-auto">
              {selectedAlert ? (
                <div className="space-y-4 max-w-3xl mx-auto">
                  <div className="p-4 rounded-xl bg-black/50 border border-[#1B3022] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(selectedAlert.severity)}
                        <span className="text-xs font-mono text-[#C5A059] font-bold">
                          {selectedAlert.satelliteMission} • Pass #{selectedAlert.orbitPassNumber}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-emerald-400">
                        Certainty: {selectedAlert.confidenceScore}%
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-white">
                      {selectedAlert.title}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-2.5 rounded bg-black/40 border border-white/5">
                        <div className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">Bioregion Target</div>
                        <div className="text-xs font-mono font-bold text-white mt-0.5">{selectedAlert.bioregionName}</div>
                        <div className="text-[10px] text-[#F5F5F0]/50">{selectedAlert.country}</div>
                      </div>

                      <div className="p-2.5 rounded bg-black/40 border border-white/5">
                        <div className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">Coordinates</div>
                        <div className="text-xs font-mono font-bold text-[#C5A059] mt-0.5">
                          {selectedAlert.coordinates[0].toFixed(3)}°, {selectedAlert.coordinates[1].toFixed(3)}°
                        </div>
                        <button
                          onClick={() => {
                            setActiveViewMode('split');
                            handleSelectAndCenterAlert(selectedAlert);
                          }}
                          className="text-[10px] text-emerald-400 hover:underline mt-0.5 block cursor-pointer"
                        >
                          Locate on D3 Map →
                        </button>
                      </div>

                      <div className="p-2.5 rounded bg-black/40 border border-white/5">
                        <div className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">Recorded At</div>
                        <div className="text-xs font-mono font-bold text-white mt-0.5">
                          {new Date(selectedAlert.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="text-[10px] text-[#F5F5F0]/50">{selectedAlert.timeAgo}</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#152319] border border-[#2A4630] text-xs font-mono">
                      <span className="text-[#C5A059] font-bold">Delta Excursion: </span>
                      <span className="text-white">{selectedAlert.detectedDelta}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-xs font-sans">
                      <span className="text-emerald-400 font-mono font-bold block mb-1">Mitigation Action Protocol</span>
                      <p className="text-[#F5F5F0]/80 leading-relaxed">{selectedAlert.mitigationProtocol}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12 text-[#F5F5F0]/40 font-mono text-xs">
                  No alert selected.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notification Preferences Sub-Menu Modal */}
      <NotificationPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onSavePreferences={handleSavePreferences}
      />

      {/* Download Report Modal */}
      <DownloadReportModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        selectedBioregionId={selectedAlert?.bioregionId || 'mara-serengeti'}
        selectedBioregionName={selectedAlert?.bioregionName || 'Mara-Serengeti Transboundary Basin'}
        alerts={alerts}
      />

      {/* Compare Hazards Side-by-Side Modal */}
      <CompareHazardsModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        alerts={alerts}
        initialAlertAId={compareAlertA?.id || alerts[0]?.id}
        initialAlertBId={compareAlertB?.id || alerts[1]?.id}
      />

      {/* Forecast Downstream Infrastructure Impact Modal (Gemini) */}
      <ForecastImpactModal
        isOpen={isForecastOpen}
        onClose={() => {
          setIsForecastOpen(false);
          setForecastTargetAlert(null);
        }}
        alert={forecastTargetAlert || selectedAlert}
      />

      {/* Predictive Hazard Model Modal (Gemini) */}
      <PredictiveHazardModelModal
        isOpen={isPredictiveModelOpen}
        onClose={() => setIsPredictiveModelOpen(false)}
        currentAlerts={alerts}
        onInjectPreEventAlert={(newAlert) => {
          setAlerts(prev => [newAlert, ...prev]);
          setSelectedAlert(newAlert);
          setTargetMapCoordinates(newAlert.coordinates);
        }}
      />

      {/* Epistemic Explanation & AI Provenance Modal */}
      <EpistemicExplanationModal
        isOpen={isEpistemicOpen}
        onClose={() => {
          setIsEpistemicOpen(false);
          setEpistemicAlert(null);
        }}
        alert={epistemicAlert || selectedAlert}
      />
    </div>
  );
};
