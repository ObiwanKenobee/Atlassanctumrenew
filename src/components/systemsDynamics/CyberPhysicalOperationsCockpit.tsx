import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Send,
  Zap,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Database,
  Layers,
  ArrowRight,
  Droplet,
  Sun,
  Home,
  Compass,
  FileCheck
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

interface AssetTwin {
  id: string;
  name: string;
  asset_type: string;
  location_name: string;
  status: string;
  health_score: number;
  digitalTwin: {
    fsm_state?: string;
    current_state: Record<string, any>;
    health_score: number;
    last_seen: string;
    active_alerts: string[];
  };
}

interface TelemetryPacket {
  device_id: string;
  asset_id: string;
  timestamp: string;
  metric: string;
  value: number;
  unit: string;
  quality: string;
  sequence: number;
  firmware: string;
  provenance?: {
    source_id: string;
    source_type: string;
    method: string;
    quality: number;
    processor: string;
    verified: boolean;
  };
}

interface WorkOrder {
  id: string;
  asset_id: string;
  title: string;
  priority: string;
  anomaly_trigger: string;
  assigned_to: string;
  status: string;
  created_at: string;
}

export const CyberPhysicalOperationsCockpit: React.FC = () => {
  const [assets, setAssets] = useState<AssetTwin[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('LIFE-POD-00482');
  const [telemetryPackets, setTelemetryPackets] = useState<TelemetryPacket[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [priorityFloorLocation, setPriorityFloorLocation] = useState<'Nairobi' | 'Turkana'>('Nairobi');
  const [priorityFloorData, setPriorityFloorData] = useState<any>(null);

  // Command & Safety Interlock state
  const [tankLevelOverride, setTankLevelOverride] = useState<number>(72);
  const [commandStatus, setCommandStatus] = useState<any>(null);

  // Vertical Slice Prototype state
  const [verticalSliceResult, setVerticalSliceResult] = useState<any>(null);
  const [runningSlice, setRunningSlice] = useState<boolean>(false);

  // Fetch live state from low-level API
  const refreshLiveSystemState = async () => {
    try {
      setLoading(true);
      const [assetsRes, telemetryRes, woRes, pfRes] = await Promise.all([
        fetch('/v1/assets'),
        fetch('/v1/telemetry?limit=20'),
        fetch('/v1/work-orders'),
        fetch(`/v1/priority-floor/${priorityFloorLocation}`)
      ]);

      if (assetsRes.ok) {
        const d = await assetsRes.json();
        setAssets(d.assets || []);
      }
      if (telemetryRes.ok) {
        const d = await telemetryRes.json();
        setTelemetryPackets(d.packets || []);
      }
      if (woRes.ok) {
        const d = await woRes.json();
        setWorkOrders(d.workOrders || []);
      }
      if (pfRes.ok) {
        const d = await pfRes.json();
        setPriorityFloorData(d.priorityFloor || null);
      }
    } catch (err) {
      console.error('[CYBER-PHYSICAL] Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLiveSystemState();
  }, [priorityFloorLocation]);

  // Telemetry Packet Injection
  const injectSampleTelemetry = async (type: 'NORMAL' | 'DROUGHT' | 'TURBIDITY' | 'LEAK') => {
    audioFeedback.playSubtleClick();
    let packet: any;

    if (type === 'NORMAL') {
      packet = {
        device_id: 'dev_mcu_00482',
        asset_id: 'LIFE-POD-00482',
        timestamp: new Date().toISOString(),
        metric: 'soil_moisture',
        value: 32.4,
        unit: 'percent',
        quality: 'good',
        sequence: Math.floor(Math.random() * 10000),
        firmware: '1.3.2'
      };
    } else if (type === 'DROUGHT') {
      packet = {
        device_id: 'dev_mcu_00482',
        asset_id: 'LIFE-POD-00482',
        timestamp: new Date().toISOString(),
        metric: 'soil_moisture',
        value: 12.8, // Drops below 18% -> Anomaly trigger
        unit: 'percent',
        quality: 'good',
        sequence: Math.floor(Math.random() * 10000),
        firmware: '1.3.2'
      };
    } else if (type === 'TURBIDITY') {
      packet = {
        device_id: 'dev_mcu_00109',
        asset_id: 'WATER-NODE-00109',
        timestamp: new Date().toISOString(),
        metric: 'turbidity_ntu',
        value: 7.2, // Exceeds 5.0 NTU -> QUALITY_WARNING
        unit: 'NTU',
        quality: 'good',
        sequence: Math.floor(Math.random() * 10000),
        firmware: '2.1.0'
      };
    } else {
      packet = {
        device_id: 'dev_mcu_00109',
        asset_id: 'WATER-NODE-00109',
        timestamp: new Date().toISOString(),
        metric: 'flow_rate_lpm',
        value: 94.5, // Exceeds 85 LPM -> LEAK_DETECTED
        unit: 'LPM',
        quality: 'good',
        sequence: Math.floor(Math.random() * 10000),
        firmware: '2.1.0'
      };
    }

    try {
      const res = await fetch('/v1/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packet)
      });
      const data = await res.json();
      if (data.anomalyDetected) {
        audioFeedback.playTelemetryWarning();
      }
      refreshLiveSystemState();
    } catch (e) {
      console.error('Failed to send packet:', e);
    }
  };

  // Hardware Safety Interlock Actuation
  const dispatchActuationCommand = async (forceDryRun: boolean) => {
    audioFeedback.playSubtleClick();
    setCommandStatus(null);

    // First adjust water level to simulate dry vs full
    const desiredWaterLevel = forceDryRun ? 8.5 : tankLevelOverride;

    // Send packet to update twin tank level
    await fetch('/v1/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device_id: 'dev_mcu_00482',
        asset_id: 'LIFE-POD-00482',
        timestamp: new Date().toISOString(),
        metric: 'water_level',
        value: desiredWaterLevel,
        unit: 'percent',
        quality: 'good',
        sequence: 99999,
        firmware: '1.3.2'
      })
    });

    // Attempt cloud command
    try {
      const res = await fetch('/v1/device-commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: 'dev_mcu_00482',
          asset_id: 'LIFE-POD-00482',
          command: 'ACTUATE_PUMP_HIGH',
          desired_state: { pump_state: 'ON', pump_status: 'RUNNING' }
        })
      });
      const result = await res.json();
      setCommandStatus(result);

      if (result.physicalSafetyTripped) {
        audioFeedback.playTelemetryWarning();
      } else {
        audioFeedback.playSuccess();
      }
      refreshLiveSystemState();
    } catch (err) {
      console.error(err);
    }
  };

  // Run Vertical Slice Prototype
  const executeVerticalSlice = async (mode: 'NORMAL' | 'TRIGGER_DROUGHT') => {
    audioFeedback.playSubtleClick();
    setRunningSlice(true);
    setVerticalSliceResult(null);

    try {
      const res = await fetch('/v1/prototype/vertical-slice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: mode })
      });
      const data = await res.json();
      setVerticalSliceResult(data.cycle);
      audioFeedback.playSuccess();
      refreshLiveSystemState();
    } catch (e) {
      console.error('Vertical slice error:', e);
    } finally {
      setRunningSlice(false);
    }
  };

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  return (
    <div className="space-y-8 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm p-6 sm:p-8 text-[#F5F5F0]">
      {/* Principle Banner */}
      <div className="bg-[#141414] border border-[#C5A059]/30 p-5 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              Systems Design Principle
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-pulse" />
          </div>
          <h2 className="text-xl font-serif text-[#F5F5F0] mt-1">
            "Every Atlas capability maps to a real entity, a real state, a real signal, a real decision, or a real action."
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 mt-0.5">
            Physical Plane (Sensors & MCUs) ⟷ Digital Plane (Time-Series, FSM & Digital Twin) ⟷ Human Plane (Community Stewards)
          </p>
        </div>

        <button
          onClick={refreshLiveSystemState}
          disabled={loading}
          className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#262626] border border-[#F5F5F0]/20 rounded-sm text-xs font-mono flex items-center gap-2 transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#C5A059]' : ''}`} />
          <span>Sync Twin State</span>
        </button>
      </div>

      {/* 3-Plane Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plane 1: Physical Plane & Asset Registry */}
        <div className="bg-[#121212] border border-[#F5F5F0]/10 p-5 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#8FB8DE]" />
              <h3 className="text-sm font-mono font-bold uppercase text-[#8FB8DE] tracking-wider">
                1. Physical Plane (Assets)
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-[#8FB8DE]/10 text-[#8FB8DE] px-2 py-0.5 rounded-sm">
              {assets.length} Twins Active
            </span>
          </div>

          <div className="space-y-2">
            {assets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => {
                  setSelectedAssetId(asset.id);
                  audioFeedback.playSubtleClick();
                }}
                className={`w-full text-left p-3 rounded-sm border transition-all ${
                  selectedAssetId === asset.id
                    ? 'bg-[#1B2838] border-[#8FB8DE] shadow-sm'
                    : 'bg-[#171717] border-[#F5F5F0]/5 hover:border-[#F5F5F0]/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#F5F5F0]">{asset.id}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#1B3022] text-[#4E9F3D] rounded-xs">
                    {asset.status}
                  </span>
                </div>
                <div className="text-xs text-[#F5F5F0]/80 mt-1 truncate">{asset.name}</div>
                <div className="text-[10px] text-[#F5F5F0]/50 mt-1 flex items-center justify-between font-mono">
                  <span>{asset.location_name}</span>
                  <span>Health: {asset.health_score}%</span>
                </div>
              </button>
            ))}
          </div>

          {selectedAsset && (
            <div className="bg-[#0A0A0A] p-3 rounded-sm border border-[#F5F5F0]/10 text-xs font-mono space-y-1.5">
              <div className="text-[10px] text-[#C5A059] uppercase tracking-wider font-bold">
                Digital Twin State & FSM
              </div>
              <div className="text-[11px] text-[#F5F5F0]/90">
                FSM State: <span className="text-[#C5A059] font-bold">{selectedAsset.digitalTwin?.fsm_state || 'NORMAL'}</span>
              </div>
              <div className="text-[10px] text-[#F5F5F0]/60">
                Health Score: {selectedAsset.digitalTwin?.health_score}% • Confidence: 0.98
              </div>
              <div className="mt-2 text-[10px] text-[#F5F5F0]/50 bg-[#141414] p-2 rounded-xs overflow-x-auto">
                <pre>{JSON.stringify(selectedAsset.digitalTwin?.current_state || {}, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Plane 2: Digital Plane (Telemetry Pipeline & Anomaly Engine) */}
        <div className="bg-[#121212] border border-[#F5F5F0]/10 p-5 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#C5A059]" />
              <h3 className="text-sm font-mono font-bold uppercase text-[#C5A059] tracking-wider">
                2. Digital Plane (Signals)
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 rounded-sm">
              Event Pipeline
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-[#F5F5F0]/70 font-mono">
              Inject Physical Signal to evaluate FSM transitions:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => injectSampleTelemetry('NORMAL')}
                className="p-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#4E9F3D]/30 text-[#4E9F3D] text-[11px] font-mono rounded-sm text-left flex items-center justify-between"
              >
                <span>Normal Signal</span>
                <CheckCircle2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => injectSampleTelemetry('DROUGHT')}
                className="p-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#FF6B6B]/30 text-[#FF6B6B] text-[11px] font-mono rounded-sm text-left flex items-center justify-between"
              >
                <span>Soil Drought (12%)</span>
                <AlertTriangle className="w-3 h-3" />
              </button>
              <button
                onClick={() => injectSampleTelemetry('TURBIDITY')}
                className="p-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#C5A059]/30 text-[#C5A059] text-[11px] font-mono rounded-sm text-left flex items-center justify-between"
              >
                <span>Turbidity Spike</span>
                <Droplet className="w-3 h-3" />
              </button>
              <button
                onClick={() => injectSampleTelemetry('LEAK')}
                className="p-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#FF6B6B]/40 text-[#FF6B6B] text-[11px] font-mono rounded-sm text-left flex items-center justify-between"
              >
                <span>Leak Surge (94 LPM)</span>
                <Zap className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Active Work Orders triggered by Anomalies */}
          <div className="space-y-2 pt-2 border-t border-[#F5F5F0]/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5F5F0]/60">
                Triggered Work Orders ({workOrders.length})
              </span>
              <span className="text-[9px] font-mono text-[#C5A059]">Auto-Dispatched</span>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {workOrders.length === 0 ? (
                <div className="text-[11px] text-[#F5F5F0]/40 italic">No open anomalies or work orders</div>
              ) : (
                workOrders.map((wo) => (
                  <div key={wo.id} className="p-2 bg-[#0A0A0A] border border-[#FF6B6B]/20 rounded-xs text-[10px] font-mono">
                    <div className="flex items-center justify-between text-[#FF6B6B]">
                      <span>{wo.id}</span>
                      <span className="px-1 bg-[#FF6B6B]/10 rounded-xs">{wo.priority}</span>
                    </div>
                    <div className="text-[#F5F5F0]/90 font-medium truncate mt-0.5">{wo.title}</div>
                    <div className="text-[#F5F5F0]/50 mt-0.5 truncate">{wo.anomaly_trigger}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Ingested Telemetry Feed */}
          <div className="space-y-1 pt-2 border-t border-[#F5F5F0]/10">
            <div className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider">
              Normalized Telemetry Feed
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1 text-[10px] font-mono text-[#F5F5F0]/70">
              {telemetryPackets.slice(0, 4).map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-[#171717] px-2 py-1 rounded-xs">
                  <span className="text-[#8FB8DE]">{p.metric}</span>
                  <span className="text-[#C5A059] font-bold">
                    {p.value} {p.unit}
                  </span>
                  <span className="text-[#F5F5F0]/40 text-[9px]">seq #{p.sequence}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plane 3: Human Plane & Hardware Safety Interlock */}
        <div className="bg-[#121212] border border-[#F5F5F0]/10 p-5 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4E9F3D]" />
              <h3 className="text-sm font-mono font-bold uppercase text-[#4E9F3D] tracking-wider">
                3. Safety & Command Plane
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-[#4E9F3D]/10 text-[#4E9F3D] px-2 py-0.5 rounded-sm">
              Physical Interlock
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-[#F5F5F0]/80 font-mono">
              Axiom: <span className="text-[#C5A059] font-bold">"Physical safety beats cloud intelligence."</span>
            </div>
            <p className="text-[11px] text-[#F5F5F0]/60">
              The embedded MCU controller retains absolute authority to reject unsafe cloud commands. Test dry-run pump burnout protection:
            </p>
          </div>

          <div className="space-y-2 bg-[#0A0A0A] p-3 rounded-sm border border-[#F5F5F0]/10">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F5F5F0]/70">Simulated Tank Level:</span>
              <span className={`font-bold ${tankLevelOverride < 15 ? 'text-[#FF6B6B]' : 'text-[#4E9F3D]'}`}>
                {tankLevelOverride}% {tankLevelOverride < 15 ? '(CRITICAL HAZARD)' : '(SAFE)'}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              value={tankLevelOverride}
              onChange={(e) => setTankLevelOverride(Number(e.target.value))}
              className="w-full accent-[#C5A059]"
            />
            <div className="flex justify-between text-[9px] font-mono text-[#F5F5F0]/40">
              <span>Dry Run (&lt;15%)</span>
              <span>Floor Threshold (15%)</span>
              <span>Full (95%)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => dispatchActuationCommand(false)}
              className="p-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#4E9F3D]/40 text-[#4E9F3D] text-xs font-mono font-bold rounded-sm flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Safe Pump</span>
            </button>
            <button
              onClick={() => dispatchActuationCommand(true)}
              className="p-2.5 bg-[#331111] hover:bg-[#441818] border border-[#FF6B6B]/40 text-[#FF6B6B] text-xs font-mono font-bold rounded-sm flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Force Unsafe Dry Run</span>
            </button>
          </div>

          {commandStatus && (
            <div
              className={`p-3 rounded-sm border text-xs font-mono ${
                commandStatus.physicalSafetyTripped
                  ? 'bg-[#2A1111] border-[#FF6B6B] text-[#FF9E9E]'
                  : 'bg-[#112615] border-[#4E9F3D] text-[#8DFFA0]'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {commandStatus.physicalSafetyTripped ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-[#FF6B6B]" />
                    <span>MCU INTERLOCK TRIPPED</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4E9F3D]" />
                    <span>COMMAND RECONCILED</span>
                  </>
                )}
              </div>
              <div className="text-[11px] mt-1 leading-relaxed">{commandStatus.reason}</div>
            </div>
          )}
        </div>
      </div>

      {/* Priority Floor Engine (10 Dimensions) */}
      <div className="bg-[#121212] border border-[#F5F5F0]/10 p-6 rounded-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C5A059]" />
              <h3 className="text-base font-serif text-[#F5F5F0]">Bioregional Priority Floor Engine</h3>
            </div>
            <p className="text-xs text-[#F5F5F0]/60 mt-0.5">
              Distinguishing <span className="text-[#C5A059] font-mono">AVAILABLE ≠ ACCESSIBLE ≠ RELIABLE ≠ AFFORDABLE</span> across 10 essential dimensions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPriorityFloorLocation('Nairobi');
                audioFeedback.playSubtleClick();
              }}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-colors ${
                priorityFloorLocation === 'Nairobi'
                  ? 'bg-[#C5A059] text-[#0A0A0A]'
                  : 'bg-[#1C1C1C] text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
              }`}
            >
              Nairobi Basin
            </button>
            <button
              onClick={() => {
                setPriorityFloorLocation('Turkana');
                audioFeedback.playSubtleClick();
              }}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-colors ${
                priorityFloorLocation === 'Turkana'
                  ? 'bg-[#C5A059] text-[#0A0A0A]'
                  : 'bg-[#1C1C1C] text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
              }`}
            >
              Turkana Arid Basin
            </button>
          </div>
        </div>

        {priorityFloorData ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(priorityFloorData).map(([key, value]: [string, any]) => {
              const statusColor =
                value.status === 'DEFICIT'
                  ? 'text-[#FF6B6B] border-[#FF6B6B]/30 bg-[#FF6B6B]/5'
                  : value.status === 'CONSTRAINED'
                  ? 'text-[#C5A059] border-[#C5A059]/30 bg-[#C5A059]/5'
                  : 'text-[#4E9F3D] border-[#4E9F3D]/30 bg-[#4E9F3D]/5';

              return (
                <div key={key} className={`p-3 rounded-sm border ${statusColor} space-y-2`}>
                  <div className="flex items-center justify-between text-xs font-mono uppercase font-bold">
                    <span>{key}</span>
                    <span>{value.score}%</span>
                  </div>
                  <div className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs inline-block bg-black/40">
                    {value.status}
                  </div>
                  <div className="space-y-1 text-[9px] font-mono text-[#F5F5F0]/60 pt-1 border-t border-current/20">
                    <div className="flex justify-between">
                      <span>Available:</span>
                      <span className="font-bold text-[#F5F5F0]">{value.dimensions.availability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accessible:</span>
                      <span className="font-bold text-[#F5F5F0]">{value.dimensions.accessibility}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Affordable:</span>
                      <span className="font-bold text-[#F5F5F0]">{value.dimensions.affordability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reliable:</span>
                      <span className="font-bold text-[#F5F5F0]">{value.dimensions.reliability}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-xs font-mono text-[#F5F5F0]/50">Loading Priority Floor profile...</div>
        )}
      </div>

      {/* Minimum Viable Cyber-Physical Vertical Slice Prototype */}
      <div className="bg-[#141414] border border-[#8FB8DE]/30 p-6 rounded-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5F5F0]/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#8FB8DE]" />
              <h3 className="text-base font-serif text-[#F5F5F0]">
                Minimum Viable Prototype: Cyber-Physical Vertical Slice
              </h3>
            </div>
            <p className="text-xs text-[#F5F5F0]/60 mt-0.5">
              Closed-loop validation proving that: <span className="text-[#8FB8DE] font-mono">The system can SENSE ➔ REASON ➔ ACT ➔ VERIFY</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => executeVerticalSlice('NORMAL')}
              disabled={runningSlice}
              className="px-3.5 py-2 bg-[#1A2E40] hover:bg-[#25415B] border border-[#8FB8DE]/40 text-[#8FB8DE] text-xs font-mono font-bold rounded-sm flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Run Nominal Loop</span>
            </button>
            <button
              onClick={() => executeVerticalSlice('TRIGGER_DROUGHT')}
              disabled={runningSlice}
              className="px-3.5 py-2 bg-[#401A1A] hover:bg-[#5A2525] border border-[#FF6B6B]/40 text-[#FF6B6B] text-xs font-mono font-bold rounded-sm flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Run Drought Closed-Loop</span>
            </button>
          </div>
        </div>

        {verticalSliceResult && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
            {/* Step 1: Sense */}
            <div className="p-3 bg-[#0A0A0A] border border-[#8FB8DE]/30 rounded-sm space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-[#8FB8DE] flex items-center gap-1">
                <span>1. SENSE</span>
              </div>
              <div className="text-[11px] text-[#F5F5F0]">
                Metric: <span className="text-[#C5A059]">{verticalSliceResult.sense.packet.metric}</span>
              </div>
              <div className="text-[11px] text-[#F5F5F0]">
                Value: <span className="font-bold">{verticalSliceResult.sense.packet.value}%</span>
              </div>
              <div className="text-[9px] text-[#F5F5F0]/50 truncate">
                Packet: {verticalSliceResult.sense.ingestion.packetId}
              </div>
            </div>

            {/* Step 2: Reason */}
            <div className="p-3 bg-[#0A0A0A] border border-[#C5A059]/30 rounded-sm space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-[#C5A059] flex items-center gap-1">
                <span>2. REASON</span>
              </div>
              <div className="text-[11px] text-[#F5F5F0]">
                Deficit Detected:{' '}
                <span className={verticalSliceResult.reason.needsIrrigation ? 'text-[#FF6B6B]' : 'text-[#4E9F3D]'}>
                  {verticalSliceResult.reason.needsIrrigation ? 'YES (Deficit)' : 'NO (Optimal)'}
                </span>
              </div>
              <div className="text-[11px] text-[#F5F5F0]">
                Asset Health: {verticalSliceResult.reason.evaluatedHealth}%
              </div>
            </div>

            {/* Step 3: Act */}
            <div className="p-3 bg-[#0A0A0A] border border-[#4E9F3D]/30 rounded-sm space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-[#4E9F3D] flex items-center gap-1">
                <span>3. ACT</span>
              </div>
              <div className="text-[11px] text-[#F5F5F0]">
                Status:{' '}
                <span className={verticalSliceResult.act?.physicalSafetyTripped ? 'text-[#FF6B6B]' : 'text-[#4E9F3D]'}>
                  {verticalSliceResult.act?.commandRecord?.status || 'NO ACTUATION'}
                </span>
              </div>
              <div className="text-[9px] text-[#F5F5F0]/60 truncate">
                {verticalSliceResult.act?.commandRecord?.command || 'Standing idle'}
              </div>
            </div>

            {/* Step 4: Verify */}
            <div className="p-3 bg-[#0A0A0A] border border-[#A78BFA]/30 rounded-sm space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-[#A78BFA] flex items-center gap-1">
                <span>4. VERIFY</span>
              </div>
              <div className="text-[11px] text-[#F5F5F0]">
                Proof ID: <span className="text-[#A78BFA]">{verticalSliceResult.verify.id}</span>
              </div>
              <div className="text-[9px] text-[#F5F5F0]/60 truncate">
                {verticalSliceResult.verify.outcome}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
