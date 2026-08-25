import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Activity, 
  Radio, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  Bell, 
  BellOff, 
  Sliders, 
  Cpu, 
  Droplets, 
  Thermometer, 
  Wind, 
  Trees, 
  Flame, 
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { audioFeedback } from '../lib/audioFeedback';

export interface EcologicalAlert {
  id: string;
  bioregionId: string;
  bioregionName: string;
  sensorId: string;
  sensorType: 'aquifer_salinity' | 'streamflow' | 'soil_moisture' | 'canopy_heat' | 'biodiversity_index' | 'air_particulate';
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'stabilizing' | 'nominal';
  reading: string;
  threshold: string;
  timestamp: string;
  acknowledged: boolean;
  actionRequired: string;
  causalTrigger: string;
}

export interface SensorTelemetryStream {
  id: string;
  name: string;
  icon: string;
  unit: string;
  currentValue: number;
  baseline: number;
  safeMin: number;
  criticalMax: number;
  status: 'nominal' | 'warning' | 'critical';
  history: number[];
}

interface EcologicalAlertSystemProps {
  currentBioregionId: string;
  currentBioregionName: string;
  onOpenMoralSimulator?: () => void;
  onSelectTab?: (tab: string) => void;
}

const INITIAL_ALERTS: EcologicalAlert[] = [
  {
    id: 'alert-turkana-salinity-1',
    bioregionId: 'scen-turkana-rift',
    bioregionName: 'East African Rift • Turkana Basin',
    sensorId: 'SEN-AQUIFER-LOTIKIPI-04',
    sensorType: 'aquifer_salinity',
    title: 'Lotikipi Northern Borehole Salinity Spike',
    description: 'Groundwater Total Dissolved Solids reached 4,850 ppm TDS due to accelerated seasonal drawdown.',
    severity: 'critical',
    reading: '4,850 ppm TDS',
    threshold: '> 4,200 ppm TDS',
    timestamp: '2 mins ago',
    acknowledged: false,
    actionRequired: 'Reroute solar desalination intake to Sector 7 deep recharge aquifer.',
    causalTrigger: 'Unscheduled industrial extraction upstream + delayed seasonal monsoon.'
  },
  {
    id: 'alert-mara-streamflow-2',
    bioregionId: 'scen-turkana-rift',
    bioregionName: 'East African Rift • Mara-Serengeti Basin',
    sensorId: 'SEN-RIVER-MARA-BRIDGE-02',
    sensorType: 'streamflow',
    title: 'Mara River Baseflow Critical Threshold',
    description: 'Headwater flow rate dropped below 2.4 m³/s biophysical survival threshold for hippopotami and aquatic biomes.',
    severity: 'warning',
    reading: '2.38 m³/s',
    threshold: '< 2.80 m³/s',
    timestamp: '14 mins ago',
    acknowledged: false,
    actionRequired: 'Trigger Clan Water Council emergency riparian irrigation reduction.',
    causalTrigger: 'Mau Forest catchment evapotranspiration stress.'
  },
  {
    id: 'alert-sahel-moisture-3',
    bioregionId: 'scen-turkana-rift',
    bioregionName: 'Northern Arid Corridor',
    sensorId: 'SEN-SOIL-MOISTURE-ARRAY-12',
    sensorType: 'soil_moisture',
    title: 'Pastoral Rangeland Soil Moisture Stabilizing',
    description: 'Microbial biochar inoculation and rainwater swales increased root-zone moisture to 22.4%.',
    severity: 'stabilizing',
    reading: '22.4% VWC',
    threshold: '> 18.0% VWC Target',
    timestamp: '38 mins ago',
    acknowledged: true,
    actionRequired: 'Verify mycorrhizal fungal colonization via field laboratory telemetry.',
    causalTrigger: 'Successful community agroforestry trenching phase.'
  }
];

export const EcologicalAlertSystem: React.FC<EcologicalAlertSystemProps> = ({
  currentBioregionId,
  currentBioregionName,
  onOpenMoralSimulator,
  onSelectTab
}) => {
  const [alerts, setAlerts] = useState<EcologicalAlert[]>(INITIAL_ALERTS);
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'stabilizing'>('all');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [selectedAlert, setSelectedAlert] = useState<EcologicalAlert | null>(INITIAL_ALERTS[0]);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Live telemetry sensors for selected bioregion
  const [telemetrySensors, setTelemetrySensors] = useState<SensorTelemetryStream[]>([
    {
      id: 'sen-tds',
      name: 'Aquifer Salinity (Lotikipi)',
      icon: 'droplets',
      unit: 'ppm TDS',
      currentValue: 4250,
      baseline: 3800,
      safeMin: 600,
      criticalMax: 5000,
      status: 'warning',
      history: [3900, 3950, 4100, 4180, 4220, 4250]
    },
    {
      id: 'sen-flow',
      name: 'Riparian Streamflow',
      icon: 'wind',
      unit: 'm³/s',
      currentValue: 2.85,
      baseline: 4.2,
      safeMin: 2.4,
      criticalMax: 12.0,
      status: 'nominal',
      history: [3.4, 3.2, 3.0, 2.9, 2.8, 2.85]
    },
    {
      id: 'sen-moisture',
      name: 'Soil Root-Zone Moisture',
      icon: 'trees',
      unit: '% VWC',
      currentValue: 21.8,
      baseline: 24.0,
      safeMin: 14.0,
      criticalMax: 45.0,
      status: 'nominal',
      history: [16.5, 17.8, 19.2, 20.4, 21.5, 21.8]
    },
    {
      id: 'sen-canopy',
      name: 'Canopy Thermal Delta',
      icon: 'thermometer',
      unit: '°C above baseline',
      currentValue: 1.4,
      baseline: 0.0,
      safeMin: -1.0,
      criticalMax: 3.5,
      status: 'nominal',
      history: [0.8, 1.1, 1.2, 1.5, 1.6, 1.4]
    }
  ]);

  // Periodic sensor simulation updates
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setTelemetrySensors(prev => prev.map(sensor => {
        const delta = (Math.random() - 0.48) * (sensor.unit.includes('ppm') ? 35 : 0.08);
        const nextVal = +(sensor.currentValue + delta).toFixed(sensor.unit.includes('ppm') ? 0 : 2);
        const nextHist = [...sensor.history.slice(1), nextVal];
        
        let nextStatus: 'nominal' | 'warning' | 'critical' = 'nominal';
        if (sensor.unit.includes('ppm') && nextVal > 4600) nextStatus = 'critical';
        else if (sensor.unit.includes('ppm') && nextVal > 4100) nextStatus = 'warning';
        else if (sensor.unit.includes('m³/s') && nextVal < 2.5) nextStatus = 'critical';

        return {
          ...sensor,
          currentValue: nextVal,
          status: nextStatus,
          history: nextHist
        };
      }));
    }, 3800);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Handle alert acknowledgement
  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    audioFeedback.playSyncComplete();
    setNotificationToast('Alert acknowledged and routed to Local Sovereign Council');
    setTimeout(() => setNotificationToast(null), 3000);
  };

  // Simulate injecting a new critical sensor anomaly
  const handleSimulateCriticalEvent = () => {
    const newAlert: EcologicalAlert = {
      id: `alert-live-${Date.now()}`,
      bioregionId: currentBioregionId,
      bioregionName: currentBioregionName,
      sensorId: `SEN-IOT-EDGE-${Math.floor(100 + Math.random() * 900)}`,
      sensorType: 'canopy_heat',
      title: 'Sudden Evapotranspiration Heat Dome Anomaly',
      description: 'Thermal infrared satellite radiometer detected +3.2°C surface temperature escalation over key watershed.',
      severity: 'critical',
      reading: '+3.2°C Delta',
      threshold: '> +2.5°C Emergency',
      timestamp: 'Just now',
      acknowledged: false,
      actionRequired: 'Activate automated shade-canopy misting and divert graywater reserve.',
      causalTrigger: 'Atmospheric blocking pattern detected across upper catchment.'
    };

    setAlerts(prev => [newAlert, ...prev]);
    setSelectedAlert(newAlert);
    audioFeedback.playAlertPing();
    setNotificationToast('CRITICAL ECOLOGICAL ALERT: Anomaly Detected by Planetary Mesh');
    setTimeout(() => setNotificationToast(null), 4000);
  };

  const filteredAlerts = alerts.filter(a => {
    if (activeSeverityFilter === 'all') return true;
    return a.severity === activeSeverityFilter;
  });

  const getSeverityStyle = (severity: EcologicalAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          badge: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
          border: 'border-rose-500/40',
          dot: 'bg-rose-500 animate-ping'
        };
      case 'warning':
        return {
          badge: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
          border: 'border-amber-500/40',
          dot: 'bg-amber-500'
        };
      case 'stabilizing':
        return {
          badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50',
          border: 'border-cyan-500/40',
          dot: 'bg-cyan-400'
        };
      default:
        return {
          badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
          border: 'border-emerald-500/40',
          dot: 'bg-emerald-400'
        };
    }
  };

  return (
    <div className="bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm p-6 space-y-6">
      {/* Header and Live Streaming Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
              PLANETARY EDGE SENSORS • REAL-TIME ECOLOGICAL ALERT ENGINE
            </span>
            <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Mesh (14,820 Nodes)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#F5F5F0]">
            Ecological Alert & Bioregional Threat Telemetry
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-3xl font-sans">
            Continuous biophysical monitoring across aquifers, soil micro-biomes, riparian streamflows, and microclimates with automated life-safety constraints.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 text-xs font-mono rounded-sm border flex items-center gap-1.5 transition-colors ${
              isLiveStreaming 
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                : 'bg-[#141414] border-[#F5F5F0]/20 text-[#F5F5F0]/60'
            }`}
          >
            {isLiveStreaming ? <Radio className="w-3.5 h-3.5 animate-pulse" /> : <BellOff className="w-3.5 h-3.5" />}
            <span>{isLiveStreaming ? 'Live Polling Active' : 'Polling Paused'}</span>
          </button>

          <button
            onClick={handleSimulateCriticalEvent}
            className="px-3.5 py-1.5 bg-rose-900/60 hover:bg-rose-800/80 border border-rose-500/50 text-rose-200 font-mono text-xs rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
            <span>Simulate Anomaly</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notificationToast && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 rounded-sm text-xs font-mono flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {notificationToast}
          </span>
          <button 
            onClick={() => setNotificationToast(null)}
            className="text-emerald-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Live Telemetry Sensor Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {telemetrySensors.map((sensor) => {
          const isWarning = sensor.status === 'warning';
          const isCritical = sensor.status === 'critical';
          return (
            <div 
              key={sensor.id}
              className={`p-3.5 bg-[#080808] border rounded-sm space-y-2 transition-all ${
                isCritical 
                  ? 'border-rose-500/60 bg-rose-950/10 ring-1 ring-rose-500/30' 
                  : isWarning 
                  ? 'border-amber-500/50 bg-amber-950/10' 
                  : 'border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/70 flex items-center gap-1.5">
                  {sensor.icon === 'droplets' && <Droplets className="w-3.5 h-3.5 text-blue-400" />}
                  {sensor.icon === 'wind' && <Wind className="w-3.5 h-3.5 text-cyan-400" />}
                  {sensor.icon === 'trees' && <Trees className="w-3.5 h-3.5 text-emerald-400" />}
                  {sensor.icon === 'thermometer' && <Thermometer className="w-3.5 h-3.5 text-amber-400" />}
                  <span className="font-sans font-medium text-[#F5F5F0]">{sensor.name}</span>
                </span>
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  isCritical ? 'bg-rose-900 text-rose-200' : isWarning ? 'bg-amber-900 text-amber-200' : 'bg-emerald-900 text-emerald-200'
                }`}>
                  {sensor.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="text-xl font-serif font-bold text-[#F5F5F0]">
                  {sensor.currentValue} <span className="text-xs font-mono font-normal text-[#F5F5F0]/50">{sensor.unit}</span>
                </div>
                <span className="text-[10px] font-mono text-[#F5F5F0]/40">Safe: {sensor.safeMin} - {sensor.criticalMax}</span>
              </div>

              {/* Micro Trendline Spark-Bars */}
              <div className="flex items-end gap-1 h-5 pt-1">
                {sensor.history.map((val, idx) => {
                  const h = Math.min(100, Math.max(15, ((val - sensor.safeMin) / (sensor.criticalMax - sensor.safeMin)) * 100));
                  return (
                    <div 
                      key={idx}
                      className={`flex-1 rounded-t-xs transition-all ${
                        isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-500/70'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Alert Feed & Selected Alert Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List (Col 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F0]/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-[#C5A059] font-bold">Active Alerts ({filteredAlerts.length})</span>
            </div>

            {/* Severity filter pills */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              {(['all', 'critical', 'warning', 'stabilizing'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => {
                    setActiveSeverityFilter(sev);
                    audioFeedback.playMicroTick();
                  }}
                  className={`px-2.5 py-1 rounded-sm uppercase tracking-wider transition-colors ${
                    activeSeverityFilter === sev
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'bg-[#141414] text-[#F5F5F0]/60 hover:text-white border border-[#F5F5F0]/10'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredAlerts.map(alert => {
              const style = getSeverityStyle(alert.severity);
              const isSelected = selectedAlert?.id === alert.id;
              return (
                <div
                  key={alert.id}
                  onClick={() => {
                    setSelectedAlert(alert);
                    audioFeedback.playMicroTick();
                  }}
                  className={`p-4 rounded-sm border cursor-pointer transition-all space-y-2 ${
                    isSelected 
                      ? 'bg-[#121212] border-[#C5A059] ring-1 ring-[#C5A059]/40 shadow-md' 
                      : 'bg-[#080808] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border font-bold ${style.badge}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs font-mono text-[#F5F5F0]/40">{alert.sensorId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#F5F5F0]/50">
                      <span>{alert.timestamp}</span>
                      {alert.acknowledged && (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Acknowledged
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-serif font-bold text-[#F5F5F0]">{alert.title}</h3>
                  <p className="text-xs text-[#F5F5F0]/70 font-sans line-clamp-2">{alert.description}</p>

                  <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-[#F5F5F0]/60">
                    <span>Reading: <strong className="text-[#C5A059]">{alert.reading}</strong></span>
                    <span>Threshold: {alert.threshold}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Alert Action Dossier (Col 1) */}
        <div className="p-5 bg-[#080808] border border-[#F5F5F0]/15 rounded-sm space-y-4 h-fit">
          <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F0]/10">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#C5A059]" />
              ALERT INTERVENTION DOSSIER
            </span>
            {selectedAlert && (
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${getSeverityStyle(selectedAlert.severity).badge}`}>
                {selectedAlert.severity}
              </span>
            )}
          </div>

          {selectedAlert ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-serif font-bold text-[#F5F5F0]">{selectedAlert.title}</h3>
                <span className="text-[10px] font-mono text-[#F5F5F0]/40 block">{selectedAlert.bioregionName}</span>
              </div>

              <div className="space-y-2 text-xs font-sans text-[#F5F5F0]/80 bg-[#0D0D0D] p-3 rounded-sm border border-[#F5F5F0]/10">
                <div className="font-mono text-[10px] text-[#C5A059] uppercase font-bold">Causal Root Trigger</div>
                <p>{selectedAlert.causalTrigger}</p>
              </div>

              <div className="space-y-2 text-xs font-sans text-[#F5F5F0]/80 bg-[#0D0D0D] p-3 rounded-sm border border-[#F5F5F0]/10">
                <div className="font-mono text-[10px] text-emerald-400 uppercase font-bold">Recommended Life-Safety Action</div>
                <p>{selectedAlert.actionRequired}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {!selectedAlert.acknowledged ? (
                  <button
                    onClick={() => handleAcknowledge(selectedAlert.id)}
                    className="w-full py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold font-mono text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all shadow"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Acknowledge & Route Protocol</span>
                  </button>
                ) : (
                  <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono text-center rounded-sm">
                    ✓ Covenant Protocol Activated
                  </div>
                )}

                <button
                  onClick={() => {
                    if (onOpenMoralSimulator) onOpenMoralSimulator();
                    audioFeedback.playCovenantResonance();
                  }}
                  className="w-full py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-[#F5F5F0]/20 text-[#F5F5F0] text-xs font-mono rounded-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Audit in Moral Arbiter</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#F5F5F0]/40 font-mono py-8 text-center">
              Select an alert from the feed to inspect telemetry and dispatch sovereign interventions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
