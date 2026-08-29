import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Coins,
  Cpu,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Sliders,
  DollarSign
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface EscrowTranche {
  id: string;
  trancheName: string;
  allocatedAmountUSD: number;
  status: 'LOCKED' | 'READY_FOR_RELEASE' | 'DISBURSED' | 'DISPUTE_HOLD';
  releaseCondition: string;
  telemetryThresholdKey: string;
  requiredValue: number;
  currentTelemetryValue: number;
  unit: string;
  disbursedDate?: string;
  multiSigSignatures: number;
  requiredSignatures: number;
}

export const MilestoneEscrowTrancheController: React.FC<{
  facilityName?: string;
  totalEscrowUSD?: number;
}> = ({
  facilityName = 'Upper Tana Watershed & Aberdare Riparian Restoration Tranches',
  totalEscrowUSD = 12500000
}) => {
  const [tranches, setTranches] = useState<EscrowTranche[]>([
    {
      id: 'TR-01',
      trancheName: 'Tranche A: Bio-Swale Terracing & Inoculation',
      allocatedAmountUSD: 2500000,
      status: 'DISBURSED',
      releaseCondition: '100% Terrace structural survey verified + 5,000 Vetiver plugs rooted',
      telemetryThresholdKey: 'Terrace Structural Completion',
      requiredValue: 100,
      currentTelemetryValue: 100,
      unit: '% verified',
      disbursedDate: 'Jul 15, 2026',
      multiSigSignatures: 3,
      requiredSignatures: 3
    },
    {
      id: 'TR-02',
      trancheName: 'Tranche B: Soil Glomalin & Humus Aggregation',
      allocatedAmountUSD: 4500000,
      status: 'READY_FOR_RELEASE',
      releaseCondition: 'Living Soil Glomalin density >= 15.0 mg/g across 14 ridge test cores',
      telemetryThresholdKey: 'Glomalin Aggregate Density',
      requiredValue: 15.0,
      currentTelemetryValue: 18.2, // Met!
      unit: 'mg/g',
      multiSigSignatures: 2,
      requiredSignatures: 3
    },
    {
      id: 'TR-03',
      trancheName: 'Tranche C: Climax Canopy & Cloud Mist Interception',
      allocatedAmountUSD: 3500000,
      status: 'LOCKED',
      releaseCondition: 'Drone LiDAR verifies native Podocarpus canopy volume >= 85%',
      telemetryThresholdKey: 'Canopy Density Index',
      requiredValue: 85.0,
      currentTelemetryValue: 74.0, // Not yet met
      unit: '% volume',
      multiSigSignatures: 0,
      requiredSignatures: 3
    },
    {
      id: 'TR-04',
      trancheName: 'Tranche D: Fauna Migration Corridor Permanence',
      allocatedAmountUSD: 2000000,
      status: 'LOCKED',
      releaseCondition: '3 consecutive months of zero-breach bongo and elephant corridor crossings',
      telemetryThresholdKey: 'Bio-Acoustic Flyway Continuity',
      requiredValue: 90,
      currentTelemetryValue: 65,
      unit: 'days uninterrupted',
      multiSigSignatures: 0,
      requiredSignatures: 3
    }
  ]);

  const [simulatingSensorPush, setSimulatingSensorPush] = useState<boolean>(false);
  const [selectedTrancheId, setSelectedTrancheId] = useState<string>('TR-02');

  const selectedTranche = tranches.find(t => t.id === selectedTrancheId) || tranches[1];

  // Action: Sign as third Multi-Sig key holder and execute automated release
  const handleExecuteRelease = (trancheId: string) => {
    audioFeedback.playMicroTick();
    setSimulatingSensorPush(true);

    setTimeout(() => {
      setTranches(prev =>
        prev.map(t => {
          if (t.id === trancheId) {
            return {
              ...t,
              status: 'DISBURSED',
              multiSigSignatures: 3,
              disbursedDate: 'Just now (' + new Date().toLocaleTimeString() + ')'
            };
          }
          return t;
        })
      );
      setSimulatingSensorPush(false);
      audioFeedback.playSuccess();
    }, 1200);
  };

  const handleSimulateSensorBoost = (trancheId: string) => {
    audioFeedback.playMicroTick();
    setTranches(prev =>
      prev.map(t => {
        if (t.id === trancheId) {
          const newVal = t.requiredValue + 2;
          return {
            ...t,
            currentTelemetryValue: newVal,
            status: newVal >= t.requiredValue ? 'READY_FOR_RELEASE' : t.status,
            multiSigSignatures: newVal >= t.requiredValue ? 2 : t.multiSigSignatures
          };
        }
        return t;
      })
    );
  };

  const totalDisbursed = tranches
    .filter(t => t.status === 'DISBURSED')
    .reduce((acc, t) => acc + t.allocatedAmountUSD, 0);

  return (
    <div className="bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm p-6 space-y-6 text-[#F5F5F0]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              SMART ESCROW • TELEMETRY-TRIGGERED TRANCHE DISBURSEMENTS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Milestone Escrow Tranche Controller
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans">
            Capital is locked in multi-signature smart contracts, releasing automatically only when physical IoT sensor telemetry and scientific evidence pass verifiable thresholds.
          </p>
        </div>

        {/* Aggregate Escrow Liquidity */}
        <div className="flex items-center gap-4 bg-[#141414] p-3 rounded-xs border border-[#F5F5F0]/10 font-mono text-xs">
          <div>
            <span className="text-[9px] text-[#F5F5F0]/40 uppercase block">Disbursed</span>
            <span className="text-emerald-400 font-bold">${(totalDisbursed / 1000000).toFixed(1)}M</span>
          </div>
          <div className="h-6 w-px bg-[#F5F5F0]/10" />
          <div>
            <span className="text-[9px] text-[#F5F5F0]/40 uppercase block">Locked in Escrow</span>
            <span className="text-[#C5A059] font-bold">${((totalEscrowUSD - totalDisbursed) / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </div>

      {/* Tranches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tranche Selector List (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          {tranches.map((t) => {
            const isSelected = t.id === selectedTrancheId;
            const isDisbursed = t.status === 'DISBURSED';
            const isReady = t.status === 'READY_FOR_RELEASE';

            return (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTrancheId(t.id);
                  audioFeedback.playSubtleClick();
                }}
                className={`p-4 rounded-xs border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#181818] border-[#C5A059] shadow-md'
                    : 'bg-[#121212] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/25'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-[#C5A059] font-bold">{t.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-xs font-bold ${
                      isDisbursed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : isReady
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/30 animate-pulse'
                        : 'bg-[#222] text-[#F5F5F0]/60'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <h4 className="text-xs font-serif font-bold text-[#F5F5F0]">
                  {t.trancheName}
                </h4>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#F5F5F0]/70 mt-2">
                  <span>${(t.allocatedAmountUSD / 1000000).toFixed(2)}M USD</span>
                  <span className="text-[#C5A059]">
                    {t.currentTelemetryValue} / {t.requiredValue} {t.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tranche Deep Detail & Release Terminal (7 Cols) */}
        <div className="lg:col-span-7 bg-[#141414] p-5 rounded-sm border border-[#F5F5F0]/10 space-y-5">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                Tranche Smart Contract Audit
              </span>
              <h3 className="text-sm font-serif font-bold text-[#F5F5F0]">
                {selectedTranche.trancheName}
              </h3>
            </div>
            <span className="text-lg font-bold font-mono text-[#C5A059]">
              ${(selectedTranche.allocatedAmountUSD / 1000000).toFixed(2)}M
            </span>
          </div>

          {/* Condition Box */}
          <div className="p-3.5 bg-[#181818] rounded-xs border border-[#F5F5F0]/10 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block">
              Cryptographic Release Condition:
            </span>
            <p className="text-xs font-serif text-[#F5F5F0] leading-relaxed">
              "{selectedTranche.releaseCondition}"
            </p>
          </div>

          {/* Live Sensor Progress Bar */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#F5F5F0]/70">Verified IoT Sensor Telemetry:</span>
              <span className={selectedTranche.currentTelemetryValue >= selectedTranche.requiredValue ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {selectedTranche.currentTelemetryValue} {selectedTranche.unit} (Target: &gt;={selectedTranche.requiredValue} {selectedTranche.unit})
              </span>
            </div>
            <div className="w-full bg-[#222] h-3 rounded-xs overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  selectedTranche.currentTelemetryValue >= selectedTranche.requiredValue
                    ? 'bg-emerald-500'
                    : 'bg-[#C5A059]'
                }`}
                style={{
                  width: `${Math.min(100, (selectedTranche.currentTelemetryValue / selectedTranche.requiredValue) * 100)}%`
                }}
              />
            </div>
          </div>

          {/* Multi-Sig Signatures State */}
          <div className="p-3 bg-[#1A1A1A] rounded-xs flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#C5A059]" />
              <span className="text-[#F5F5F0]/80">Multi-Signature Consensus:</span>
            </div>
            <span className="text-[#C5A059] font-bold">
              {selectedTranche.multiSigSignatures} / {selectedTranche.requiredSignatures} Signatures
            </span>
          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-2 flex items-center gap-3">
            {selectedTranche.status === 'READY_FOR_RELEASE' && (
              <button
                onClick={() => handleExecuteRelease(selectedTranche.id)}
                disabled={simulatingSensorPush}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-4 h-4" />
                <span>{simulatingSensorPush ? 'Executing On-Chain Release...' : 'Co-Sign & Disburse Tranche Funds'}</span>
              </button>
            )}

            {selectedTranche.status === 'LOCKED' && (
              <button
                onClick={() => handleSimulateSensorBoost(selectedTranche.id)}
                className="flex-1 py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold uppercase rounded-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Simulate IoT Field Sensor Ingestion</span>
              </button>
            )}

            {selectedTranche.status === 'DISBURSED' && (
              <div className="w-full py-2.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold rounded-xs text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Tranche Disbursed on {selectedTranche.disbursedDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
