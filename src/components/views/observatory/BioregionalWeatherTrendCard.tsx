import React, { useState, useMemo } from 'react';
import {
  Sun,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  Gauge,
  Compass,
  Sprout
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { audioFeedback } from '../../../lib/audioFeedback';

export interface DailyClimateForecast {
  day: string;
  date: string;
  weatherType: 'sunny' | 'rain' | 'storm' | 'partly_cloudy' | 'windy' | 'overcast';
  tempMaxC: number;
  tempMinC: number;
  tempAnomalyC: number; // vs 30-year climatological baseline (+/-)
  precipitationMm: number;
  rainProbabilityPct: number;
  soilMoistureVwc: number; // Volumetric Water Content %
  vpdKpa: number; // Vapor Pressure Deficit (kPa)
  evapoTranspirationMm: number; // ET0 mm/day
  solarIrradianceKwh: number;
  climateShiftRisk: 'Nominal' | 'Heat Dome Shift' | 'Monsoon Plume' | 'Flash Drought Risk' | 'Optimal Infiltration' | 'VPD Stress';
  shiftSeverity: 'low' | 'moderate' | 'high' | 'critical';
  stewardshipGuidance: string;
}

export interface BioregionalClimateProfile {
  bioregionId: string;
  bioregionName: string;
  macroClimateZone: string;
  currentSeason: string;
  shiftHeadline: string;
  summaryNarrative: string;
  temperatureAnomalyTrend: string;
  sevenDayRainTotalMm: number;
  avgVpdKpa: number;
  soilDroughtStatus: 'Saturated' | 'Optimal Hydro-Equilibrium' | 'Moderate Depletion' | 'Severe Moisture Deficit';
  climateShiftWarning: string;
  forecast: DailyClimateForecast[];
}

export const BIOREGIONAL_CLIMATE_DATA: Record<string, BioregionalClimateProfile> = {
  'mara-serengeti': {
    bioregionId: 'mara-serengeti',
    bioregionName: 'Mara-Serengeti Savannah & Basin',
    macroClimateZone: 'Tropical Semi-Arid Savannah Ecotone',
    currentSeason: 'Inter-Monsoonal Convective Transition',
    shiftHeadline: 'Thermal Inversion & Convective Plume Shift',
    summaryNarrative: 'Microclimate models predict an early convective rainfall pulse on Days 4–5 accompanied by an elevated vapor pressure deficit crest on Days 1–3.',
    temperatureAnomalyTrend: '+2.4°C above 30-yr norm',
    sevenDayRainTotalMm: 48.5,
    avgVpdKpa: 2.1,
    soilDroughtStatus: 'Optimal Hydro-Equilibrium',
    climateShiftWarning: 'Convective storm surge on Day 5 may exceed surface infiltration rates in unmulched pasture corridors.',
    forecast: [
      {
        day: 'Mon',
        date: 'Oct 05',
        weatherType: 'sunny',
        tempMaxC: 31.2,
        tempMinC: 18.4,
        tempAnomalyC: +2.1,
        precipitationMm: 0.0,
        rainProbabilityPct: 10,
        soilMoistureVwc: 24.2,
        vpdKpa: 2.3,
        evapoTranspirationMm: 5.6,
        solarIrradianceKwh: 6.8,
        climateShiftRisk: 'VPD Stress',
        shiftSeverity: 'moderate',
        stewardshipGuidance: 'Apply foliar compost tea & close nursery shading to limit vegetative transpiration loss.'
      },
      {
        day: 'Tue',
        date: 'Oct 06',
        weatherType: 'sunny',
        tempMaxC: 32.5,
        tempMinC: 19.1,
        tempAnomalyC: +2.8,
        precipitationMm: 0.0,
        rainProbabilityPct: 15,
        soilMoistureVwc: 22.8,
        vpdKpa: 2.6,
        evapoTranspirationMm: 6.1,
        solarIrradianceKwh: 7.1,
        climateShiftRisk: 'Heat Dome Shift',
        shiftSeverity: 'high',
        stewardshipGuidance: 'Pre-irrigate bio-intensive seedbeds via sand-dam subsurface gravitational channels.'
      },
      {
        day: 'Wed',
        date: 'Oct 07',
        weatherType: 'partly_cloudy',
        tempMaxC: 30.0,
        tempMinC: 18.2,
        tempAnomalyC: +1.4,
        precipitationMm: 2.4,
        rainProbabilityPct: 35,
        soilMoistureVwc: 23.5,
        vpdKpa: 1.9,
        evapoTranspirationMm: 4.8,
        solarIrradianceKwh: 5.9,
        climateShiftRisk: 'Nominal',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Inspect keyline swale berms and clear sediment traps ahead of projected precipitation.'
      },
      {
        day: 'Thu',
        date: 'Oct 08',
        weatherType: 'rain',
        tempMaxC: 26.8,
        tempMinC: 16.5,
        tempAnomalyC: -1.2,
        precipitationMm: 22.6,
        rainProbabilityPct: 85,
        soilMoistureVwc: 31.4,
        vpdKpa: 1.2,
        evapoTranspirationMm: 3.2,
        solarIrradianceKwh: 4.1,
        climateShiftRisk: 'Monsoon Plume',
        shiftSeverity: 'moderate',
        stewardshipGuidance: 'Open retention swale diversion gates to maximize recharge into secondary aquifer terraces.'
      },
      {
        day: 'Fri',
        date: 'Oct 09',
        weatherType: 'storm',
        tempMaxC: 25.1,
        tempMinC: 16.0,
        tempAnomalyC: -2.3,
        precipitationMm: 18.5,
        rainProbabilityPct: 90,
        soilMoistureVwc: 35.8,
        vpdKpa: 0.9,
        evapoTranspirationMm: 2.8,
        solarIrradianceKwh: 3.4,
        climateShiftRisk: 'Optimal Infiltration',
        shiftSeverity: 'moderate',
        stewardshipGuidance: 'Monitor riparian buffer sensors for sediment load stabilization and overflow bypasses.'
      },
      {
        day: 'Sat',
        date: 'Oct 10',
        weatherType: 'partly_cloudy',
        tempMaxC: 28.4,
        tempMinC: 17.2,
        tempAnomalyC: +0.2,
        precipitationMm: 4.2,
        rainProbabilityPct: 40,
        soilMoistureVwc: 33.1,
        vpdKpa: 1.5,
        evapoTranspirationMm: 4.2,
        solarIrradianceKwh: 5.4,
        climateShiftRisk: 'Nominal',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Ideal planting window for native acacia, fig, and mycorrhizal agroforestry saplings.'
      },
      {
        day: 'Sun',
        date: 'Oct 11',
        weatherType: 'sunny',
        tempMaxC: 29.8,
        tempMinC: 17.8,
        tempAnomalyC: +1.1,
        precipitationMm: 0.8,
        rainProbabilityPct: 20,
        soilMoistureVwc: 30.5,
        vpdKpa: 1.8,
        evapoTranspirationMm: 4.9,
        solarIrradianceKwh: 6.2,
        climateShiftRisk: 'Nominal',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Survey biological corridors for wildlife movement returning toward river crossings.'
      }
    ]
  },
  'aberdare-water-tower': {
    bioregionId: 'aberdare-water-tower',
    bioregionName: 'Aberdare Cloud Forest & Water Tower',
    macroClimateZone: 'Afro-Montane Mist Cloud Forest',
    currentSeason: 'High-Altitude Orographic Fog Cycle',
    shiftHeadline: 'Cloud Condensation Level Elevation (+140m)',
    summaryNarrative: 'Montane sensors detect upward migration of the cloud inversion ceiling, requiring active bamboo canopy mist-catchers to sustain riparian runoff.',
    temperatureAnomalyTrend: '+1.8°C above 30-yr norm',
    sevenDayRainTotalMm: 62.0,
    avgVpdKpa: 1.1,
    soilDroughtStatus: 'Saturated',
    climateShiftWarning: 'Elevated cloud ceiling reduces occult mist precipitation in upper ridges by 18%.',
    forecast: [
      {
        day: 'Mon',
        date: 'Oct 05',
        weatherType: 'partly_cloudy',
        tempMaxC: 21.0,
        tempMinC: 9.5,
        tempAnomalyC: +1.2,
        precipitationMm: 4.5,
        rainProbabilityPct: 45,
        soilMoistureVwc: 38.0,
        vpdKpa: 1.0,
        evapoTranspirationMm: 2.9,
        solarIrradianceKwh: 4.5,
        climateShiftRisk: 'Nominal',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Inspect fog-harvesting nylon mesh arrays along ridge trails.'
      },
      {
        day: 'Tue',
        date: 'Oct 06',
        weatherType: 'overcast',
        tempMaxC: 19.8,
        tempMinC: 8.8,
        tempAnomalyC: +0.6,
        precipitationMm: 8.2,
        rainProbabilityPct: 60,
        soilMoistureVwc: 41.2,
        vpdKpa: 0.8,
        evapoTranspirationMm: 2.4,
        solarIrradianceKwh: 3.8,
        climateShiftRisk: 'Nominal',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Log peatland water table piezometer telemetry to verify municipal feeder flow.'
      },
      {
        day: 'Wed',
        date: 'Oct 07',
        weatherType: 'rain',
        tempMaxC: 18.5,
        tempMinC: 8.0,
        tempAnomalyC: -0.4,
        precipitationMm: 16.4,
        rainProbabilityPct: 80,
        soilMoistureVwc: 45.6,
        vpdKpa: 0.6,
        evapoTranspirationMm: 1.9,
        solarIrradianceKwh: 2.8,
        climateShiftRisk: 'Optimal Infiltration',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Verify headwater sediment filtration beds are unobstructed.'
      },
      {
        day: 'Thu',
        date: 'Oct 08',
        weatherType: 'rain',
        tempMaxC: 17.8,
        tempMinC: 7.5,
        tempAnomalyC: -1.0,
        precipitationMm: 18.5,
        rainProbabilityPct: 85,
        soilMoistureVwc: 48.0,
        vpdKpa: 0.5,
        evapoTranspirationMm: 1.7,
        solarIrradianceKwh: 2.4,
        climateShiftRisk: 'Optimal Infiltration',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Ensure hillside bio-terraces prevent road washouts in agroforestry buffer zone.'
      },
      {
        day: 'Fri',
        date: 'Oct 09',
        weatherType: 'overcast',
        tempMaxC: 20.2,
        tempMinC: 9.0,
        tempAnomalyC: +0.9,
        precipitationMm: 7.4,
        rainProbabilityPct: 50,
        soilMoistureVwc: 44.5,
        vpdKpa: 0.9,
        evapoTranspirationMm: 2.6,
        solarIrradianceKwh: 3.9,
        climateShiftRisk: 'Nominal',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Maintain native cedar and podocarpus seed dispersal corridors.'
      },
      {
        day: 'Sat',
        date: 'Oct 10',
        weatherType: 'sunny',
        tempMaxC: 22.4,
        tempMinC: 10.2,
        tempAnomalyC: +2.1,
        precipitationMm: 2.0,
        rainProbabilityPct: 25,
        soilMoistureVwc: 41.0,
        vpdKpa: 1.3,
        evapoTranspirationMm: 3.4,
        solarIrradianceKwh: 5.2,
        climateShiftRisk: 'VPD Stress',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Monitor canopy epiphyte hydration index on mountain slopes.'
      },
      {
        day: 'Sun',
        date: 'Oct 11',
        weatherType: 'partly_cloudy',
        tempMaxC: 21.8,
        tempMinC: 9.8,
        tempAnomalyC: +1.5,
        precipitationMm: 5.0,
        rainProbabilityPct: 40,
        soilMoistureVwc: 39.5,
        vpdKpa: 1.1,
        evapoTranspirationMm: 3.1,
        solarIrradianceKwh: 4.8,
        climateShiftRisk: 'Nominal',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Perform weekly ZKP biometric upload for community forest wardens.'
      }
    ]
  },
  'rift-valley-lakes': {
    bioregionId: 'rift-valley-lakes',
    bioregionName: 'Great Rift Valley Volcanic Lakes',
    macroClimateZone: 'Semi-Arid Rift Graben & Soda Lake Basins',
    currentSeason: 'High Evaporation Geothermal Crest',
    shiftHeadline: 'Alkaline Lake Evaporative Deficit & Geothermal Plume',
    summaryNarrative: 'Persistent dry winds and geothermal venting intensify surface evaporation, accelerating salt concentration in lake shallows.',
    temperatureAnomalyTrend: '+2.8°C above 30-yr norm',
    sevenDayRainTotalMm: 14.2,
    avgVpdKpa: 2.8,
    soilDroughtStatus: 'Moderate Depletion',
    climateShiftWarning: 'Surface evaporation rate is 3.2x greater than basin stream inflows this week.',
    forecast: [
      {
        day: 'Mon',
        date: 'Oct 05',
        weatherType: 'windy',
        tempMaxC: 33.0,
        tempMinC: 19.5,
        tempAnomalyC: +2.5,
        precipitationMm: 0.0,
        rainProbabilityPct: 5,
        soilMoistureVwc: 18.4,
        vpdKpa: 2.9,
        evapoTranspirationMm: 6.8,
        solarIrradianceKwh: 7.2,
        climateShiftRisk: 'Flash Drought Risk',
        shiftSeverity: 'high',
        stewardshipGuidance: 'Deploy solar-powered aeration pumps in protected wetland fish hatcheries.'
      },
      {
        day: 'Tue',
        date: 'Oct 06',
        weatherType: 'sunny',
        tempMaxC: 34.2,
        tempMinC: 20.0,
        tempAnomalyC: +3.4,
        precipitationMm: 0.0,
        rainProbabilityPct: 5,
        soilMoistureVwc: 17.0,
        vpdKpa: 3.2,
        evapoTranspirationMm: 7.4,
        solarIrradianceKwh: 7.5,
        climateShiftRisk: 'Heat Dome Shift',
        shiftSeverity: 'critical',
        stewardshipGuidance: 'Activate bio-saline wetland recirculation to prevent hyper-eutrophication.'
      },
      {
        day: 'Wed',
        date: 'Oct 07',
        weatherType: 'partly_cloudy',
        tempMaxC: 31.8,
        tempMinC: 19.0,
        tempAnomalyC: +1.6,
        precipitationMm: 1.2,
        rainProbabilityPct: 20,
        soilMoistureVwc: 17.5,
        vpdKpa: 2.5,
        evapoTranspirationMm: 5.9,
        solarIrradianceKwh: 6.3,
        climateShiftRisk: 'VPD Stress',
        shiftSeverity: 'moderate',
        stewardshipGuidance: 'Irrigate acacia windbreaks along shorelines to reduce dust-storm erosion.'
      },
      {
        day: 'Thu',
        date: 'Oct 08',
        weatherType: 'rain',
        tempMaxC: 28.5,
        tempMinC: 17.8,
        tempAnomalyC: -0.8,
        precipitationMm: 8.5,
        rainProbabilityPct: 65,
        soilMoistureVwc: 22.0,
        vpdKpa: 1.8,
        evapoTranspirationMm: 4.1,
        solarIrradianceKwh: 4.9,
        climateShiftRisk: 'Optimal Infiltration',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Direct ephemeral wadi runoff through deep silt-trap micro-basins.'
      },
      {
        day: 'Fri',
        date: 'Oct 09',
        weatherType: 'partly_cloudy',
        tempMaxC: 29.8,
        tempMinC: 18.2,
        tempAnomalyC: +0.4,
        precipitationMm: 4.5,
        rainProbabilityPct: 40,
        soilMoistureVwc: 21.2,
        vpdKpa: 2.1,
        evapoTranspirationMm: 4.8,
        solarIrradianceKwh: 5.6,
        climateShiftRisk: 'Nominal',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Sample lake salinity gradients and calibrate telemetry conductivity probes.'
      },
      {
        day: 'Sat',
        date: 'Oct 10',
        weatherType: 'windy',
        tempMaxC: 32.0,
        tempMinC: 19.4,
        tempAnomalyC: +2.0,
        precipitationMm: 0.0,
        rainProbabilityPct: 10,
        soilMoistureVwc: 19.5,
        vpdKpa: 2.7,
        evapoTranspirationMm: 6.3,
        solarIrradianceKwh: 6.9,
        climateShiftRisk: 'VPD Stress',
        shiftSeverity: 'moderate',
        stewardshipGuidance: 'Ensure livestock access points use shaded earthen reservoirs.'
      },
      {
        day: 'Sun',
        date: 'Oct 11',
        weatherType: 'sunny',
        tempMaxC: 33.1,
        tempMinC: 19.8,
        tempAnomalyC: +2.7,
        precipitationMm: 0.0,
        rainProbabilityPct: 5,
        soilMoistureVwc: 18.2,
        vpdKpa: 3.0,
        evapoTranspirationMm: 7.0,
        solarIrradianceKwh: 7.3,
        climateShiftRisk: 'Flash Drought Risk',
        shiftSeverity: 'high',
        stewardshipGuidance: 'Check solar pumping inverters on borehole brackish water converters.'
      }
    ]
  },
  'turkana-basin': {
    bioregionId: 'turkana-basin',
    bioregionName: 'Lake Turkana Arid Basin',
    macroClimateZone: 'Hyper-Arid Volcanic Desert Basin',
    currentSeason: 'Extreme Solar Radiation Peak',
    shiftHeadline: 'Severe High-VPD Thermal Ridge',
    summaryNarrative: 'Intense diurnal solar flux and ground temperatures reaching 44°C require underground water storage and thermal dampening protocols.',
    temperatureAnomalyTrend: '+3.1°C thermal crest',
    sevenDayRainTotalMm: 2.1,
    avgVpdKpa: 3.4,
    soilDroughtStatus: 'Severe Moisture Deficit',
    climateShiftWarning: 'Ground surface thermal flux exceeds historical 95th percentile during solar noon.',
    forecast: [
      {
        day: 'Mon',
        date: 'Oct 05',
        weatherType: 'sunny',
        tempMaxC: 38.5,
        tempMinC: 24.2,
        tempAnomalyC: +3.0,
        precipitationMm: 0.0,
        rainProbabilityPct: 0,
        soilMoistureVwc: 9.8,
        vpdKpa: 3.6,
        evapoTranspirationMm: 8.2,
        solarIrradianceKwh: 8.1,
        climateShiftRisk: 'Heat Dome Shift',
        shiftSeverity: 'critical',
        stewardshipGuidance: 'Operate LifePod hydroponics on closed loop nocturnal cycling only.'
      },
      {
        day: 'Tue',
        date: 'Oct 06',
        weatherType: 'sunny',
        tempMaxC: 39.2,
        tempMinC: 24.8,
        tempAnomalyC: +3.5,
        precipitationMm: 0.0,
        rainProbabilityPct: 0,
        soilMoistureVwc: 9.2,
        vpdKpa: 3.8,
        evapoTranspirationMm: 8.6,
        solarIrradianceKwh: 8.3,
        climateShiftRisk: 'Heat Dome Shift',
        shiftSeverity: 'critical',
        stewardshipGuidance: 'Inspect solar desalination membrane flow and clean salt evaporite cakes.'
      },
      {
        day: 'Wed',
        date: 'Oct 07',
        weatherType: 'windy',
        tempMaxC: 37.8,
        tempMinC: 23.9,
        tempAnomalyC: +2.4,
        precipitationMm: 0.0,
        rainProbabilityPct: 5,
        soilMoistureVwc: 8.8,
        vpdKpa: 3.5,
        evapoTranspirationMm: 8.0,
        solarIrradianceKwh: 7.9,
        climateShiftRisk: 'Flash Drought Risk',
        shiftSeverity: 'high',
        stewardshipGuidance: 'Secure windbreak netting around young prosopis-cleared native agro-plots.'
      },
      {
        day: 'Thu',
        date: 'Oct 08',
        weatherType: 'partly_cloudy',
        tempMaxC: 36.5,
        tempMinC: 23.0,
        tempAnomalyC: +1.6,
        precipitationMm: 2.1,
        rainProbabilityPct: 25,
        soilMoistureVwc: 11.2,
        vpdKpa: 2.9,
        evapoTranspirationMm: 6.9,
        solarIrradianceKwh: 7.2,
        climateShiftRisk: 'Optimal Infiltration',
        shiftSeverity: 'moderate',
        stewardshipGuidance: 'Channel rare flash-flood wadi pulse into deep gravel aquifer recharge wells.'
      },
      {
        day: 'Fri',
        date: 'Oct 09',
        weatherType: 'sunny',
        tempMaxC: 37.0,
        tempMinC: 23.5,
        tempAnomalyC: +2.1,
        precipitationMm: 0.0,
        rainProbabilityPct: 5,
        soilMoistureVwc: 10.4,
        vpdKpa: 3.2,
        evapoTranspirationMm: 7.6,
        solarIrradianceKwh: 7.8,
        climateShiftRisk: 'VPD Stress',
        shiftSeverity: 'high',
        stewardshipGuidance: 'Maintain pastoral watering troughs with automated float-valve shutoffs.'
      },
      {
        day: 'Sat',
        date: 'Oct 10',
        weatherType: 'sunny',
        tempMaxC: 38.0,
        tempMinC: 24.0,
        tempAnomalyC: +2.8,
        precipitationMm: 0.0,
        rainProbabilityPct: 0,
        soilMoistureVwc: 9.6,
        vpdKpa: 3.5,
        evapoTranspirationMm: 8.1,
        solarIrradianceKwh: 8.0,
        climateShiftRisk: 'Heat Dome Shift',
        shiftSeverity: 'high',
        stewardshipGuidance: 'Ensure community medical clinics have cold-chain solar backup verified.'
      },
      {
        day: 'Sun',
        date: 'Oct 11',
        weatherType: 'sunny',
        tempMaxC: 38.8,
        tempMinC: 24.5,
        tempAnomalyC: +3.2,
        precipitationMm: 0.0,
        rainProbabilityPct: 0,
        soilMoistureVwc: 9.0,
        vpdKpa: 3.7,
        evapoTranspirationMm: 8.4,
        solarIrradianceKwh: 8.2,
        climateShiftRisk: 'Heat Dome Shift',
        shiftSeverity: 'critical',
        stewardshipGuidance: 'Upload weekly deep aquifer salinity and drawdown metrics to Ledger.'
      }
    ]
  },
  'kilifi-coast': {
    bioregionId: 'kilifi-coast',
    bioregionName: 'Kilifi Coastal Mangrove Belt',
    macroClimateZone: 'Tropical Marine Humid Littoral',
    currentSeason: 'Kaskazi Winds & High Tidal Flux',
    shiftHeadline: 'Tropical Storm Surge & Sea Surface Thermal Crest',
    summaryNarrative: 'Ocean surface temperature spikes (+1.9°C) combined with spring tides increase risk of coral bleaching and mangrove salinity stress.',
    temperatureAnomalyTrend: '+1.9°C above 30-yr norm',
    sevenDayRainTotalMm: 54.0,
    avgVpdKpa: 1.4,
    soilDroughtStatus: 'Saturated',
    climateShiftWarning: 'King tide coinciding with Day 4 precipitation will increase estuarine inundation by 0.45m.',
    forecast: [
      {
        day: 'Mon',
        date: 'Oct 05',
        weatherType: 'partly_cloudy',
        tempMaxC: 30.5,
        tempMinC: 23.5,
        tempAnomalyC: +1.5,
        precipitationMm: 3.2,
        rainProbabilityPct: 30,
        soilMoistureVwc: 34.0,
        vpdKpa: 1.4,
        evapoTranspirationMm: 4.8,
        solarIrradianceKwh: 6.2,
        climateShiftRisk: 'Nominal',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Inspect mangrove propagule planting nurseries for crab predation and silt cover.'
      },
      {
        day: 'Tue',
        date: 'Oct 06',
        weatherType: 'sunny',
        tempMaxC: 31.8,
        tempMinC: 24.0,
        tempAnomalyC: +2.1,
        precipitationMm: 1.0,
        rainProbabilityPct: 20,
        soilMoistureVwc: 32.5,
        vpdKpa: 1.6,
        evapoTranspirationMm: 5.2,
        solarIrradianceKwh: 6.7,
        climateShiftRisk: 'Nominal',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Check offshore coral nursery mooring lines before tidal surge peak.'
      },
      {
        day: 'Wed',
        date: 'Oct 07',
        weatherType: 'rain',
        tempMaxC: 29.0,
        tempMinC: 23.0,
        tempAnomalyC: +0.4,
        precipitationMm: 14.5,
        rainProbabilityPct: 75,
        soilMoistureVwc: 38.2,
        vpdKpa: 1.1,
        evapoTranspirationMm: 3.8,
        solarIrradianceKwh: 4.8,
        climateShiftRisk: 'Optimal Infiltration',
        shiftSeverity: 'moderate',
        stewardshipGuidance: 'Freshwater influx into estuary balances hyper-saline conditions in backwaters.'
      },
      {
        day: 'Thu',
        date: 'Oct 08',
        weatherType: 'storm',
        tempMaxC: 27.8,
        tempMinC: 22.4,
        tempAnomalyC: -1.0,
        precipitationMm: 24.0,
        rainProbabilityPct: 90,
        soilMoistureVwc: 44.0,
        vpdKpa: 0.8,
        evapoTranspirationMm: 2.9,
        solarIrradianceKwh: 3.6,
        climateShiftRisk: 'Monsoon Plume',
        shiftSeverity: 'high',
        stewardshipGuidance: 'Activate community storm drain gates and secure small artisanal fishing dhows.'
      },
      {
        day: 'Fri',
        date: 'Oct 09',
        weatherType: 'rain',
        tempMaxC: 28.5,
        tempMinC: 22.8,
        tempAnomalyC: -0.2,
        precipitationMm: 9.8,
        rainProbabilityPct: 65,
        soilMoistureVwc: 42.1,
        vpdKpa: 1.0,
        evapoTranspirationMm: 3.4,
        solarIrradianceKwh: 4.2,
        climateShiftRisk: 'Optimal Infiltration',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Collect rainwater harvest volume and store in covered cisterns.'
      },
      {
        day: 'Sat',
        date: 'Oct 10',
        weatherType: 'partly_cloudy',
        tempMaxC: 30.0,
        tempMinC: 23.2,
        tempAnomalyC: +1.0,
        precipitationMm: 1.5,
        rainProbabilityPct: 25,
        soilMoistureVwc: 37.8,
        vpdKpa: 1.4,
        evapoTranspirationMm: 4.6,
        solarIrradianceKwh: 5.9,
        climateShiftRisk: 'Nominal',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Check blue carbon sea-grass beds for post-storm sediment accumulation.'
      },
      {
        day: 'Sun',
        date: 'Oct 11',
        weatherType: 'sunny',
        tempMaxC: 31.0,
        tempMinC: 23.8,
        tempAnomalyC: +1.6,
        precipitationMm: 0.0,
        rainProbabilityPct: 10,
        soilMoistureVwc: 35.4,
        vpdKpa: 1.5,
        evapoTranspirationMm: 5.0,
        solarIrradianceKwh: 6.4,
        climateShiftRisk: 'Nominal',
        shiftSeverity: 'low',
        stewardshipGuidance: 'Run weekly RO solar desalinator membrane backwash and calibrate salinity meter.'
      }
    ]
  }
};

// Default pan-african composite profile
const DEFAULT_PAN_AFRICAN_PROFILE: BioregionalClimateProfile = {
  bioregionId: 'all',
  bioregionName: 'Pan-African Planetary Bioregions',
  macroClimateZone: 'Cross-Basin Transboundary Mosaic',
  currentSeason: 'Equatorial Bi-Modal Infiltration Horizon',
  shiftHeadline: 'Continental Hydro-Thermal Equilibrium',
  summaryNarrative: 'Composite sensor grid tracks short-term bioclimatic shifts across high-altitude water towers, savannah ecotones, and hyper-arid catchment basins.',
  temperatureAnomalyTrend: '+2.1°C above 30-yr norm',
  sevenDayRainTotalMm: 36.2,
  avgVpdKpa: 2.1,
  soilDroughtStatus: 'Optimal Hydro-Equilibrium',
  climateShiftWarning: 'Elevated thermal crest across northern grabens balanced by convective rainfall surge in rift basins.',
  forecast: BIOREGIONAL_CLIMATE_DATA['mara-serengeti'].forecast
};

interface BioregionalWeatherTrendCardProps {
  selectedBioregion?: string;
  className?: string;
}

export const BioregionalWeatherTrendCard: React.FC<BioregionalWeatherTrendCardProps> = ({
  selectedBioregion = 'all',
  className = ''
}) => {
  const [selectedForecastMetric, setSelectedForecastMetric] = useState<'temp_vpd' | 'rain_soil'>('temp_vpd');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Profile resolution based on bioregion
  const profile: BioregionalClimateProfile = useMemo(() => {
    if (selectedBioregion && BIOREGIONAL_CLIMATE_DATA[selectedBioregion]) {
      return BIOREGIONAL_CLIMATE_DATA[selectedBioregion];
    }
    return DEFAULT_PAN_AFRICAN_PROFILE;
  }, [selectedBioregion]);

  const activeDay = profile.forecast[selectedDayIndex] || profile.forecast[0];

  const getWeatherIcon = (type: DailyClimateForecast['weatherType'], className = 'w-4 h-4') => {
    switch (type) {
      case 'sunny':
        return <Sun className={`${className} text-amber-400`} />;
      case 'rain':
        return <CloudRain className={`${className} text-cyan-400`} />;
      case 'storm':
        return <CloudLightning className={`${className} text-purple-400 animate-pulse`} />;
      case 'windy':
        return <Wind className={`${className} text-teal-300`} />;
      case 'partly_cloudy':
      case 'overcast':
      default:
        return <Sun className={`${className} text-[#C5A059]`} />;
    }
  };

  const getShiftBadgeColor = (severity: DailyClimateForecast['shiftSeverity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/60 animate-pulse';
      case 'high':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/60';
      case 'moderate':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/60';
      case 'low':
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60';
    }
  };

  return (
    <div className={`bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm shadow-xl overflow-hidden transition-all ${className}`}>
      {/* Top Banner & Header */}
      <div className="p-4 sm:p-5 border-b border-[#F5F5F0]/10 bg-gradient-to-r from-[#14120B] via-[#0E1510] to-[#0A0D0B] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              Ecological Weather & Microclimate Intelligence
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-400 text-black font-extrabold uppercase">
              7-Day Trend
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-serif text-[#F5F5F0] flex items-center gap-2">
            <span>Bioregional Weather & Climate Trend</span>
            <span className="text-xs font-mono text-[#8FB8DE] font-normal hidden sm:inline">
              • {profile.bioregionName}
            </span>
          </h3>

          <p className="text-xs text-[#F5F5F0]/65 font-sans max-w-2xl">
            {profile.summaryNarrative}
          </p>
        </div>

        {/* Action Controls & Metric Switchers */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="flex items-center bg-[#080808] p-1 border border-[#F5F5F0]/15 rounded text-xs font-mono">
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setSelectedForecastMetric('temp_vpd');
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedForecastMetric === 'temp_vpd'
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              Temp & VPD
            </button>
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setSelectedForecastMetric('rain_soil');
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedForecastMetric === 'rain_soil'
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              Rain & Soil VWC
            </button>
          </div>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              setIsExpanded(!isExpanded);
            }}
            className="p-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#F5F5F0]/20 rounded text-[#F5F5F0] transition-colors cursor-pointer"
            title={isExpanded ? 'Minimize Trend Card' : 'Expand Trend Card'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#F5F5F0]/10 border-b border-[#F5F5F0]/10 bg-[#080808]">
        <div className="p-3 sm:p-4">
          <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span>Thermal Anomaly</span>
          </div>
          <div className="text-sm sm:text-base font-mono font-bold text-amber-400 mt-1">
            {profile.temperatureAnomalyTrend}
          </div>
          <div className="text-[10px] text-[#F5F5F0]/40 mt-0.5">Local microclimate shift</div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>7-Day Rain Total</span>
          </div>
          <div className="text-sm sm:text-base font-mono font-bold text-cyan-300 mt-1">
            {profile.sevenDayRainTotalMm} mm
          </div>
          <div className="text-[10px] text-[#F5F5F0]/40 mt-0.5">Convective catchment volume</div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>Soil Moisture Status</span>
          </div>
          <div className="text-sm sm:text-base font-mono font-bold text-emerald-400 mt-1 truncate">
            {profile.soilDroughtStatus}
          </div>
          <div className="text-[10px] text-[#F5F5F0]/40 mt-0.5">Root zone hydration index</div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Shift Severity</span>
          </div>
          <div className="text-sm sm:text-base font-mono font-bold text-[#F5F5F0] mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="truncate">{profile.shiftHeadline}</span>
          </div>
          <div className="text-[10px] text-amber-400/80 mt-0.5 truncate">{profile.currentSeason}</div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-6 animate-fadeIn">
          {/* 7-Day Interactive Forecast Selector Carousel */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#F5F5F0]/50 mb-2">
              <span className="uppercase font-bold tracking-wider text-[#C5A059]">Short-Term Daily Forecast Horizon:</span>
              <span>Click a day to inspect stewardship advisory</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {profile.forecast.map((fc, idx) => {
                const isSelected = selectedDayIndex === idx;
                return (
                  <button
                    key={fc.date}
                    onClick={() => {
                      audioFeedback.playMicroTick();
                      setSelectedDayIndex(idx);
                    }}
                    className={`p-2 sm:p-3 rounded-sm border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[90px] sm:min-h-[105px] ${
                      isSelected
                        ? 'bg-[#1B3022] border-[#C5A059] shadow-[0_0_12px_rgba(197,160,89,0.3)] ring-1 ring-[#C5A059]'
                        : 'bg-[#111412] border-[#F5F5F0]/10 hover:border-[#C5A059]/40 hover:bg-[#141815]'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold text-[#F5F5F0]/70 uppercase">
                      {fc.day}
                    </div>
                    <div className="text-[9px] font-mono text-[#F5F5F0]/40">
                      {fc.date.slice(-2)}
                    </div>

                    <div className="my-1">
                      {getWeatherIcon(fc.weatherType, 'w-5 h-5 sm:w-6 sm:h-6')}
                    </div>

                    <div className="text-xs font-mono font-bold text-white">
                      {Math.round(fc.tempMaxC)}°
                      <span className="text-[10px] text-[#F5F5F0]/40 font-normal"> / {Math.round(fc.tempMinC)}°</span>
                    </div>

                    <div className="text-[9px] font-mono text-cyan-400 mt-0.5">
                      {fc.precipitationMm > 0 ? `${fc.precipitationMm}mm` : 'Dry'}
                    </div>

                    {fc.shiftSeverity === 'critical' || fc.shiftSeverity === 'high' ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping mt-1" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Ecological Advisory Callout */}
          <div className="p-3.5 bg-[#121614] border border-[#C5A059]/40 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#1B3022] border border-[#C5A059] rounded-sm text-[#C5A059] shrink-0 mt-0.5">
                {getWeatherIcon(activeDay.weatherType, 'w-5 h-5')}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    {activeDay.day}, {activeDay.date} • {activeDay.weatherType.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${getShiftBadgeColor(activeDay.shiftSeverity)}`}>
                    {activeDay.climateShiftRisk}
                  </span>
                  <span className="text-[10px] font-mono text-amber-300">
                    Anomaly: {activeDay.tempAnomalyC > 0 ? `+${activeDay.tempAnomalyC}` : activeDay.tempAnomalyC}°C
                  </span>
                </div>
                <p className="text-xs text-[#F5F5F0]/80 mt-1 font-sans leading-relaxed">
                  <strong className="text-[#C5A059]">Stewardship Protocol:</strong> {activeDay.stewardshipGuidance}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-right shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
              <div className="bg-[#080808] p-1.5 rounded border border-[#F5F5F0]/10 text-left">
                <span className="text-[#F5F5F0]/40 block">Soil Moisture:</span>
                <span className="text-emerald-400 font-bold">{activeDay.soilMoistureVwc}% VWC</span>
              </div>
              <div className="bg-[#080808] p-1.5 rounded border border-[#F5F5F0]/10 text-left">
                <span className="text-[#F5F5F0]/40 block">VPD Deficit:</span>
                <span className="text-amber-400 font-bold">{activeDay.vpdKpa} kPa</span>
              </div>
            </div>
          </div>

          {/* Recharts Ecological Forecast Visualization */}
          <div className="bg-[#080808] border border-[#F5F5F0]/10 rounded-sm p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F0]/60">
              <span className="flex items-center gap-1.5 text-[#C5A059] font-bold uppercase">
                <TrendingUp className="w-3.5 h-3.5" />
                {selectedForecastMetric === 'temp_vpd'
                  ? 'Thermal Crest (°C) & Vapor Pressure Deficit (kPa) Projection'
                  : 'Precipitation Influx (mm) vs Soil Moisture Saturation (% VWC)'}
              </span>
              <span className="text-[10px] text-[#F5F5F0]/40">Calibrated via OpenMeteo & Ground Mesonet</span>
            </div>

            <div className="w-full h-52 sm:h-60 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {selectedForecastMetric === 'temp_vpd' ? (
                  <AreaChart data={profile.forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorVpd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" opacity={0.5} />
                    <XAxis dataKey="day" stroke="#666" fontSize={10} fontFamily="monospace" />
                    <YAxis yAxisId="temp" stroke="#F59E0B" fontSize={10} domain={[10, 45]} unit="°C" fontFamily="monospace" />
                    <YAxis yAxisId="vpd" orientation="right" stroke="#EC4899" fontSize={10} domain={[0, 5]} unit="k" fontFamily="monospace" />
                    <Tooltip
                      content={({ active, payload }: any) => {
                        if (!active || !payload?.length) return null;
                        const data: DailyClimateForecast = payload[0].payload;
                        return (
                          <div className="bg-[#0D0D0D]/95 border border-[#C5A059]/60 p-2.5 rounded text-xs font-mono text-white shadow-xl">
                            <div className="font-bold text-[#C5A059]">{data.day}, {data.date}</div>
                            <div className="text-amber-400 mt-1">High: {data.tempMaxC}°C (Anomaly: +{data.tempAnomalyC}°C)</div>
                            <div className="text-slate-300">Low: {data.tempMinC}°C</div>
                            <div className="text-pink-400">VPD: {data.vpdKpa} kPa (ET₀: {data.evapoTranspirationMm}mm/d)</div>
                            <div className="text-[10px] text-emerald-400 mt-1">{data.climateShiftRisk}</div>
                          </div>
                        );
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                    <Area yAxisId="temp" type="monotone" dataKey="tempMaxC" name="Max Temp (°C)" stroke="#F59E0B" strokeWidth={2} fill="url(#colorTemp)" />
                    <Area yAxisId="vpd" type="monotone" dataKey="vpdKpa" name="VPD Deficit (kPa)" stroke="#EC4899" strokeWidth={2} fill="url(#colorVpd)" />
                  </AreaChart>
                ) : (
                  <BarChart data={profile.forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" opacity={0.5} />
                    <XAxis dataKey="day" stroke="#666" fontSize={10} fontFamily="monospace" />
                    <YAxis yAxisId="rain" stroke="#38BDF8" fontSize={10} domain={[0, 40]} unit="mm" fontFamily="monospace" />
                    <YAxis yAxisId="soil" orientation="right" stroke="#10B981" fontSize={10} domain={[0, 60]} unit="%" fontFamily="monospace" />
                    <Tooltip
                      content={({ active, payload }: any) => {
                        if (!active || !payload?.length) return null;
                        const data: DailyClimateForecast = payload[0].payload;
                        return (
                          <div className="bg-[#0D0D0D]/95 border border-cyan-500/60 p-2.5 rounded text-xs font-mono text-white shadow-xl">
                            <div className="font-bold text-cyan-400">{data.day}, {data.date}</div>
                            <div className="text-cyan-300 mt-1">Rain: {data.precipitationMm} mm ({data.rainProbabilityPct}% prob)</div>
                            <div className="text-emerald-400">Soil Moisture: {data.soilMoistureVwc}% VWC</div>
                            <div className="text-[10px] text-amber-300 mt-1">{data.stewardshipGuidance}</div>
                          </div>
                        );
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                    <Bar yAxisId="rain" dataKey="precipitationMm" name="Rainfall (mm)" fill="#38BDF8" radius={[2, 2, 0, 0]} />
                    <Bar yAxisId="soil" dataKey="soilMoistureVwc" name="Soil Moisture (% VWC)" fill="#10B981" radius={[2, 2, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Climate Shift Warning Banner */}
          <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-sm flex items-start gap-2.5 text-xs text-amber-200 font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 uppercase">Microclimate Shift Alert: </span>
              <span>{profile.climateShiftWarning}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
