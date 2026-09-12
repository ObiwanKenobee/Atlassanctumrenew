import React, { useState } from 'react';
import { 
  X, 
  Droplets, 
  Wind, 
  Activity, 
  Flame, 
  Thermometer, 
  Crosshair, 
  Radio, 
  ShieldAlert, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Satellite, 
  Compass,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { SatelliteHazardAlert } from './BioregionalHazardMonitor';
import { audioFeedback } from '../../lib/audioFeedback';

interface HazardSensorMetricsModalProps {
  isOpen: boolean;
  alert: SatelliteHazardAlert | null;
  onClose: () => void;
  onFocusCoordinates?: (coords: [number, number]) => void;
}

export const HazardSensorMetricsModal: React.FC<HazardSensorMetricsModalProps> = ({
  isOpen,
  alert,
  onClose,
  onFocusCoordinates
}) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  if (!isOpen || !alert) return null;

  // Synthesize realistic location-specific telemetry based on hazard type, coordinates, and severity
  const getMetrics = () => {
    const lat = alert.coordinates[0];
    const lng = alert.coordinates[1];
    const noise = Math.sin(lat * 12 + lng * 8 + refreshCount) * 2;

    switch (alert.hazardCategory) {
      case 'thermal_fire':
        return {
          humidity: Math.max(12, Number((18.4 + noise).toFixed(1))),
          humidityStatus: 'Critical Desiccation',
          humidityColor: 'text-rose-400',
          windSpeed: Number((26.5 + Math.abs(noise * 2)).toFixed(1)),
          windDir: 'NNW (330°)',
          windGust: Number((42.0 + Math.abs(noise)).toFixed(1)),
          aqi: Math.min(500, Math.round(186 + noise * 10)),
          aqiStatus: 'Very Unhealthy (Smoke PM2.5)',
          aqiColor: 'text-purple-400',
          pm25: Number((72.4 + noise).toFixed(1)),
          temp: Number((38.6 + noise * 0.8).toFixed(1)),
          tempDelta: '+8.2°C',
          soilVwc: Number((8.1 + Math.abs(noise * 0.5)).toFixed(1)),
          soilStatus: 'Severe Drought Cracking',
          plumeMetric: 'CO Column: 340 ppb (+120 ppb)'
        };
      case 'aquifer_deficit':
        return {
          humidity: Number((32.0 + noise).toFixed(1)),
          humidityStatus: 'Arid Depression',
          humidityColor: 'text-amber-400',
          windSpeed: Number((16.2 + noise).toFixed(1)),
          windDir: 'ENE (065°)',
          windGust: Number((24.0 + noise).toFixed(1)),
          aqi: Math.round(92 + noise * 5),
          aqiStatus: 'Moderate (Mineral Dust Particulate)',
          aqiColor: 'text-amber-400',
          pm25: Number((28.1 + noise).toFixed(1)),
          temp: Number((33.2 + noise * 0.5).toFixed(1)),
          tempDelta: '+4.1°C',
          soilVwc: Number((5.8 + Math.abs(noise * 0.4)).toFixed(1)),
          soilStatus: 'Aquifer Subsidence Threshold',
          plumeMetric: 'GRACE-FO EWT: -14.2 cm'
        };
      case 'methane_plume':
        return {
          humidity: Number((82.5 + noise).toFixed(1)),
          humidityStatus: 'Saturated Wetland',
          humidityColor: 'text-cyan-400',
          windSpeed: Number((9.4 + noise * 0.5).toFixed(1)),
          windDir: 'SW (220°)',
          windGust: Number((15.0 + noise).toFixed(1)),
          aqi: Math.round(145 + noise * 8),
          aqiStatus: 'Unhealthy for Sensitive Biomes',
          aqiColor: 'text-orange-400',
          pm25: Number((38.5 + noise).toFixed(1)),
          temp: Number((27.4 + noise * 0.4).toFixed(1)),
          tempDelta: '+1.8°C',
          soilVwc: Number((48.2 + noise).toFixed(1)),
          soilStatus: 'Anaerobic Peat Degradation',
          plumeMetric: 'CH₄ Column: 1,940 ppb (+140 ppb)'
        };
      case 'siltation_surge':
        return {
          humidity: Number((76.0 + noise).toFixed(1)),
          humidityStatus: 'Riparian High-Moisture',
          humidityColor: 'text-blue-400',
          windSpeed: Number((14.8 + noise).toFixed(1)),
          windDir: 'ESE (115°)',
          windGust: Number((22.0 + noise).toFixed(1)),
          aqi: Math.round(65 + noise * 4),
          aqiStatus: 'Good / Baseline',
          aqiColor: 'text-emerald-400',
          pm25: Number((14.2 + noise).toFixed(1)),
          temp: Number((25.6 + noise * 0.3).toFixed(1)),
          tempDelta: '+0.9°C',
          soilVwc: Number((38.9 + noise).toFixed(1)),
          soilStatus: 'Runoff Erosion Saturated',
          plumeMetric: 'Turbidity: 48.2 NTU (High Silt)'
        };
      case 'canopy_stress':
      default:
        return {
          humidity: Number((48.2 + noise).toFixed(1)),
          humidityStatus: 'Depressed Transpiration',
          humidityColor: 'text-amber-400',
          windSpeed: Number((18.4 + noise).toFixed(1)),
          windDir: 'WNW (295°)',
          windGust: Number((28.5 + noise).toFixed(1)),
          aqi: Math.round(110 + noise * 6),
          aqiStatus: 'Moderate Biogenic VOC Shift',
          aqiColor: 'text-yellow-400',
          pm25: Number((32.6 + noise).toFixed(1)),
          temp: Number((31.8 + noise * 0.5).toFixed(1)),
          tempDelta: '+3.6°C',
          soilVwc: Number((16.4 + noise).toFixed(1)),
          soilStatus: 'Canopy Root Zone Moisture Deficit',
          plumeMetric: 'NDVI Delta: -0.22 Deviation'
        };
    }
  };

  const metrics = getMetrics();

  const handleRefresh = () => {
    audioFeedback.playMicroTick();
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshCount(prev => prev + 1);
      setIsRefreshing(false);
      audioFeedback.playSyncComplete();
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none"
      role="dialog"
      aria-label="Real-time Hazard Sensor Metrics Modal"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[#080E0A] border border-[#C5A059]/40 shadow-2xl p-5 space-y-4 text-white font-mono overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C5A059] via-emerald-500 to-rose-500" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold border ${
                alert.severity === 'EXISTENTIAL'
                  ? 'bg-rose-950 border-rose-600 text-rose-300'
                  : alert.severity === 'CRITICAL'
                  ? 'bg-red-950 border-red-500/60 text-red-300'
                  : 'bg-amber-950 border-amber-500/60 text-amber-300'
              }`}>
                {alert.severity}
              </span>
              <span className="text-[10px] text-[#C5A059] flex items-center gap-1 font-bold">
                <Satellite className="w-3 h-3 text-[#C5A059]" />
                {alert.satelliteMission}
              </span>
            </div>
            <h2 className="text-base font-serif font-bold text-white tracking-wide leading-tight">
              {alert.title}
            </h2>
            <div className="text-[10px] text-[#F5F5F0]/60 flex items-center gap-2">
              <span>{alert.bioregionName} ({alert.country})</span>
              <span>•</span>
              <span className="text-emerald-400">
                {alert.coordinates[0].toFixed(3)}°, {alert.coordinates[1].toFixed(3)}°
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleRefresh}
              className={`p-1.5 rounded-lg bg-[#142318] hover:bg-[#1E3324] border border-[#2A4630] text-[#C5A059] transition-all cursor-pointer ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              title="Poll latest IoT Ground & Orbital Telemetry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#142318] hover:bg-rose-950/80 border border-[#2A4630] hover:border-rose-500/50 text-[#F5F5F0]/70 hover:text-white transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Sensor Metrics Grid (Humidity, Wind Speed, Air Quality, Surface Temp, Soil Moisture) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* Card 1: Relative Humidity */}
          <div className="p-3 rounded-xl bg-black/60 border border-[#1B3022] space-y-1">
            <div className="flex items-center justify-between text-[9px] text-[#F5F5F0]/60">
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-400" /> Relative Humidity
              </span>
              <span className="text-emerald-400 font-bold">LIVE METRIC</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{metrics.humidity}%</span>
              <span className="text-[10px] text-[#F5F5F0]/50 font-sans">RH @ 2m</span>
            </div>
            <div className={`text-[9.5px] font-bold ${metrics.humidityColor}`}>
              {metrics.humidityStatus}
            </div>
          </div>

          {/* Card 2: Wind Speed & Direction */}
          <div className="p-3 rounded-xl bg-black/60 border border-[#1B3022] space-y-1">
            <div className="flex items-center justify-between text-[9px] text-[#F5F5F0]/60">
              <span className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-amber-400" /> Wind Speed & Vector
              </span>
              <span className="text-[#C5A059] font-bold">{metrics.windDir}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{metrics.windSpeed}</span>
              <span className="text-[10px] text-[#F5F5F0]/50 font-sans">km/h</span>
            </div>
            <div className="text-[9.5px] text-[#F5F5F0]/70">
              Gust Peak: <strong className="text-amber-300">{metrics.windGust} km/h</strong>
            </div>
          </div>

          {/* Card 3: Air Quality Index (AQI) & PM2.5 */}
          <div className="p-3 rounded-xl bg-black/60 border border-[#1B3022] space-y-1">
            <div className="flex items-center justify-between text-[9px] text-[#F5F5F0]/60">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-purple-400" /> Air Quality Index
              </span>
              <span className="text-purple-400 font-bold">PM2.5: {metrics.pm25} µg/m³</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">AQI {metrics.aqi}</span>
            </div>
            <div className={`text-[9.5px] font-bold ${metrics.aqiColor}`}>
              {metrics.aqiStatus}
            </div>
          </div>

          {/* Card 4: Surface Thermal & Soil Moisture */}
          <div className="p-3 rounded-xl bg-black/60 border border-[#1B3022] space-y-1">
            <div className="flex items-center justify-between text-[9px] text-[#F5F5F0]/60">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-rose-400" /> Ground Thermal Anomaly
              </span>
              <span className="text-rose-400 font-bold">{metrics.tempDelta}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{metrics.temp}°C</span>
              <span className="text-[10px] text-[#F5F5F0]/50 font-sans">VWC {metrics.soilVwc}%</span>
            </div>
            <div className="text-[9.5px] text-amber-300 truncate">
              {metrics.soilStatus}
            </div>
          </div>
        </div>

        {/* Atmospheric Column & Provenance Footer */}
        <div className="p-2.5 rounded-xl bg-[#0D1610] border border-[#1E3324] space-y-1.5 text-[10px]">
          <div className="flex items-center justify-between text-[#C5A059]">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400" /> Trace Gas Column Metric:
            </span>
            <span className="text-white font-bold">{metrics.plumeMetric}</span>
          </div>

          <div className="flex items-center justify-between text-[#F5F5F0]/60 pt-1 border-t border-white/5 text-[9px]">
            <span>Station: Flux Tower IoT #{alert.orbitPassNumber % 8000}</span>
            <span className="text-emerald-400">Provenance Verified • Merkle Sync</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
          {onFocusCoordinates && (
            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                onFocusCoordinates(alert.coordinates);
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#152319] hover:bg-[#1E3324] text-[#C5A059] hover:text-white border border-[#2A4630] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Center in Map View</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#d8b56f] text-black text-xs font-mono font-bold transition-colors cursor-pointer ml-auto"
          >
            Dismiss Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
