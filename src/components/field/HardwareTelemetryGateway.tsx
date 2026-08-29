import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  Radio,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Zap,
  Droplets,
  Sun,
  Wind,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface TelemetryNode {
  nodeId: string;
  nodeName: string;
  sensorType: 'Piezometer Hydrological' | 'LoRaWAN Soil Moisture' | 'Solar Desalination Inverter' | 'Bio-Acoustic Array';
  location: string;
  currentReading: number;
  unit: string;
  baselineNominal: number;
  warningThreshold: number;
  criticalThreshold: number;
  batteryLevelPercent: number;
  signalStrengthDbm: number;
  status: 'NOMINAL' | 'ELEVATED' | 'ALARM';
  lastPing: string;
}

const SAMPLE_NODES: TelemetryNode[] = [
  {
    nodeId: 'NODE-LORA-01',
    nodeName: 'Aberdare Ridge Subsurface Piezometer',
    sensorType: 'Piezometer Hydrological',
    location: 'Ridge 3 Transect (Aberdare Forest)',
    currentReading: 1.84,
    unit: 'bar hydraulic head',
    baselineNominal: 1.20,
    warningThreshold: 2.20,
    criticalThreshold: 2.50,
    batteryLevelPercent: 94,
    signalStrengthDbm: -78,
    status: 'NOMINAL',
    lastPing: '2s ago'
  },
  {
    nodeId: 'NODE-LORA-02',
    nodeName: 'Mathare Riparian Siltation Turbidity Sensor',
    sensorType: 'LoRaWAN Soil Moisture',
    location: 'Mathare 4A Riverbank Bio-Swale',
    currentReading: 24.8,
    unit: 'NTU turbidity',
    baselineNominal: 80.0,
    warningThreshold: 65.0,
    criticalThreshold: 90.0,
    batteryLevelPercent: 88,
    signalStrengthDbm: -65,
    status: 'NOMINAL',
    lastPing: '4s ago'
  },
  {
    nodeId: 'NODE-LORA-03',
    nodeName: 'Turkana Desalination Core Solar Inverter',
    sensorType: 'Solar Desalination Inverter',
    location: 'Lodwar Basin Solar Compound',
    currentReading: 4.82,
    unit: 'kW throughput',
    baselineNominal: 5.0,
    warningThreshold: 2.0,
    criticalThreshold: 1.0,
    batteryLevelPercent: 99,
    signalStrengthDbm: -82,
    status: 'NOMINAL',
    lastPing: '1s ago'
  }
];

export const HardwareTelemetryGateway: React.FC = () => {
  const [nodes, setNodes] = useState<TelemetryNode[]>(SAMPLE_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('NODE-LORA-01');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [calibrationOffset, setCalibrationOffset] = useState<number>(0.0);

  const selectedNode = nodes.find(n => n.nodeId === selectedNodeId) || nodes[0];

  // Emulate live telemetry jitter
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setNodes(prev =>
        prev.map(node => {
          const jitter = (Math.random() - 0.5) * 0.04 * node.currentReading;
          const updatedReading = Number((node.currentReading + jitter).toFixed(2));
          return {
            ...node,
            currentReading: updatedReading,
            lastPing: 'Just now'
          };
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const handleSimulateAlarm = (nodeId: string) => {
    audioFeedback.playMicroTick();
    setNodes(prev =>
      prev.map(n => {
        if (n.nodeId === nodeId) {
          return {
            ...n,
            currentReading: n.criticalThreshold + 0.3,
            status: 'ALARM'
          };
        }
        return n;
      })
    );
  };

  const handleResetCalibration = (nodeId: string) => {
    audioFeedback.playSuccess();
    setNodes(prev =>
      prev.map(n => {
        if (n.nodeId === nodeId) {
          return {
            ...n,
            currentReading: n.baselineNominal,
            status: 'NOMINAL'
          };
        }
        return n;
      })
    );
    setCalibrationOffset(0);
  };

  return (
    <div className="bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm p-6 space-y-6 text-[#F5F5F0]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#C5A059]" />
              IOT HARDWARE TELEMETRY & LORAWAN INGESTION GATEWAY
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Physical Sensor Telemetry Ingestion Hub
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans">
            Real-time bridge connecting low-power remote IoT piezometers, microgrid solar telemetry, and ultrasonic river monitoring arrays directly to the Atlas Knowledge Graph.
          </p>
        </div>

        {/* Live Stream Switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsLiveStreaming(!isLiveStreaming);
              audioFeedback.playSubtleClick();
            }}
            className={`px-3.5 py-2 rounded-xs font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              isLiveStreaming
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-[#222] border-[#F5F5F0]/20 text-[#F5F5F0]/60'
            }`}
          >
            <Activity className={`w-4 h-4 ${isLiveStreaming ? 'text-emerald-400 animate-pulse' : ''}`} />
            <span>{isLiveStreaming ? 'Live IoT Stream Active' : 'Stream Paused'}</span>
          </button>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Nodes list */}
        <div className="lg:col-span-5 space-y-2.5">
          {nodes.map((node) => {
            const isSelected = node.nodeId === selectedNodeId;
            const isAlarm = node.status === 'ALARM';

            return (
              <div
                key={node.nodeId}
                onClick={() => {
                  setSelectedNodeId(node.nodeId);
                  audioFeedback.playSubtleClick();
                }}
                className={`p-4 rounded-xs border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#181818] border-[#C5A059] shadow-md'
                    : 'bg-[#121212] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/25'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-[#C5A059] font-bold">{node.nodeId}</span>
                  <span
                    className={`px-2 py-0.5 rounded-xs font-bold ${
                      isAlarm
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>
                <h4 className="text-xs font-serif font-bold text-[#F5F5F0]">
                  {node.nodeName}
                </h4>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#F5F5F0]/70 mt-2">
                  <span className="text-emerald-400 font-bold">
                    {node.currentReading} {node.unit}
                  </span>
                  <span className="text-[#F5F5F0]/40">
                    Bat: {node.batteryLevelPercent}% • {node.signalStrengthDbm} dBm
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 7 Cols: Node Detail & Calibration */}
        <div className="lg:col-span-7 bg-[#141414] p-5 rounded-sm border border-[#F5F5F0]/10 space-y-5">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                Hardware Node Inspector
              </span>
              <h3 className="text-sm font-serif font-bold text-[#F5F5F0]">
                {selectedNode.nodeName}
              </h3>
            </div>
            <div className="text-right font-mono">
              <span className="text-[9px] text-[#F5F5F0]/40 uppercase block">Last Telemetry Ping</span>
              <span className="text-xs text-emerald-400 font-bold">{selectedNode.lastPing}</span>
            </div>
          </div>

          {/* Reading Spotlight */}
          <div className="p-4 bg-[#181818] rounded-xs border border-[#F5F5F0]/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#C5A059] font-bold">
                Current Sensor Ingestion
              </span>
              <div className="text-2xl font-bold font-mono text-[#F5F5F0]">
                {selectedNode.currentReading}{' '}
                <span className="text-sm text-emerald-400 font-normal">{selectedNode.unit}</span>
              </div>
              <span className="text-[11px] text-[#F5F5F0]/60 font-sans block">
                Nominal baseline: {selectedNode.baselineNominal} {selectedNode.unit}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 font-mono text-[10px]">
              <span className="px-2 py-1 bg-[#222] text-[#F5F5F0] rounded-xs border border-[#F5F5F0]/10">
                Battery: {selectedNode.batteryLevelPercent}%
              </span>
              <span className="px-2 py-1 bg-[#222] text-[#8FB8DE] rounded-xs border border-[#F5F5F0]/10">
                RSSI: {selectedNode.signalStrengthDbm} dBm
              </span>
            </div>
          </div>

          {/* Calibration & Stress Controls */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#C5A059] font-bold uppercase text-[10px]">
                Sensor Calibration & Simulation Controls
              </span>
              <button
                onClick={() => handleResetCalibration(selectedNode.nodeId)}
                className="text-[11px] text-[#C5A059] hover:underline cursor-pointer"
              >
                Reset Calibration
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSimulateAlarm(selectedNode.nodeId)}
                className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-[11px] font-bold rounded-xs cursor-pointer flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Simulate Sensor Spike / Threshold Alarm</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
