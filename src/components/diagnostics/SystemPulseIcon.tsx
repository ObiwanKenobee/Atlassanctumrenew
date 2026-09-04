import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';
import { systemHealth, SystemHealthReport, HealthStatus } from '../../lib/systemHealth';
import { SystemHealthDiagnosticModal } from './SystemHealthDiagnosticModal';
import { audioFeedback } from '../../lib/audioFeedback';

export const SystemPulseIcon: React.FC = () => {
  const [report, setReport] = useState<SystemHealthReport | null>(systemHealth.getCachedReport());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = systemHealth.subscribe((updated) => {
      setReport(updated);
    });
    return unsubscribe;
  }, []);

  const status: HealthStatus = report?.overallStatus || 'healthy';
  const latency = report?.gemini.latencyMs || 0;

  const getStatusVisuals = () => {
    switch (status) {
      case 'healthy':
        return {
          dotBg: 'bg-emerald-400',
          ringBg: 'bg-emerald-400/30',
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/30',
          label: 'System Healthy',
          badgeText: `${latency > 0 ? latency + 'ms' : 'Active'}`
        };
      case 'degraded':
        return {
          dotBg: 'bg-amber-400',
          ringBg: 'bg-amber-400/30',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/30',
          label: 'System Degraded',
          badgeText: `${latency > 0 ? latency + 'ms' : 'Degraded'}`
        };
      case 'critical':
        return {
          dotBg: 'bg-rose-500',
          ringBg: 'bg-rose-500/30',
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/30',
          label: 'Service Latency Alert',
          badgeText: 'Alert'
        };
    }
  };

  const visuals = getStatusVisuals();

  return (
    <>
      <button
        id="system-pulse-nav-btn"
        onClick={() => {
          audioFeedback.playSubtleClick();
          setIsModalOpen(true);
        }}
        aria-label={`System Pulse Status: ${visuals.label}, Latency: ${latency}ms. Click to view diagnostics.`}
        title={`System Pulse: ${visuals.label} (${latency}ms) • Click to open diagnostic module`}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-full bg-[#101512] hover:bg-[#18221B] border ${visuals.borderColor} transition-all font-mono text-xs cursor-pointer shadow-sm group`}
      >
        {/* Pulsing indicator dot */}
        <div className="relative flex items-center justify-center w-3 h-3">
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${visuals.ringBg}`}
          />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${visuals.dotBg}`} />
        </div>

        {/* Discreet label & latency badge */}
        <div className="flex items-center gap-1">
          <Activity className={`w-3 h-3 ${visuals.textColor} group-hover:scale-110 transition-transform`} />
          <span className="text-[10px] font-bold text-neutral-300 hidden lg:inline">Pulse</span>
          <span className={`text-[9px] px-1 py-0.2 rounded font-bold font-mono ${visuals.textColor} bg-black/40`}>
            {visuals.badgeText}
          </span>
        </div>
      </button>

      {/* Interactive Diagnostics Modal */}
      <SystemHealthDiagnosticModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
