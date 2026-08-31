import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Server, 
  Radio, 
  FileText, 
  ShieldCheck, 
  ArrowUpRight, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SYSTEM_STATUS_SERVICES, INCIDENT_LOGS } from '../../../data/trustData';
import { audioFeedback } from '../../../lib/audioFeedback';

export const IncidentStatusSection: React.FC = () => {
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null);

  const toggleIncident = (id: string) => {
    audioFeedback.playMicroTick();
    setExpandedIncident(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">Real-Time Infrastructure Health</span>
          </div>
          <h2 className="text-xl font-medium font-serif text-[#F5F5F0]">
            System Status, Uptime & Radical Incident Transparency
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
            Atlas Sanctum publishes live operational statuses for all decentralized nodes, AI inference pipelines, and sensor telemetry ingesters.
          </p>
        </div>

        <div className="p-4 bg-[#0E0E0E] border border-emerald-500/40 rounded-sm text-xs font-mono space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
          <p className="text-[11px] text-[#F5F5F0]/60">90-Day Rolling Uptime: 99.982%</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase font-bold text-[#C5A059] tracking-wider">
          Core Services & Edge Node Integrity
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SYSTEM_STATUS_SERVICES.map(srv => (
            <div key={srv.serviceId} className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[#F5F5F0]">{srv.serviceName}</span>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[9px] font-mono rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {srv.status === 'operational' ? 'Operational' : srv.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#F5F5F0]/60 pt-2 border-t border-[#F5F5F0]/5">
                <span>Latency: <strong className="text-[#F5F5F0]">{srv.latencyMs}ms</strong></span>
                <span>90d Uptime: <strong className="text-emerald-400">{srv.uptime90Days}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident History & Comprehensive Post-Mortems */}
      <div className="p-5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase font-bold text-[#F5F5F0] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C5A059]" />
            <span>Incident Ledger & Post-Mortem Disclosures</span>
          </h3>
          <span className="text-[10px] font-mono text-[#F5F5F0]/50">Public Record Guarantee</span>
        </div>

        <div className="space-y-3">
          {INCIDENT_LOGS.map(inc => {
            const isExpanded = expandedIncident === inc.id;
            return (
              <div key={inc.id} className="p-4 bg-[#0E0E0E] border border-[#F5F5F0]/10 rounded-sm space-y-3">
                <div 
                  onClick={() => toggleIncident(inc.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#F5F5F0]">{inc.title}</span>
                      <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[9px] font-mono rounded">
                        {inc.status}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#F5F5F0]/60">
                      Date: {inc.date} • Severity: {inc.severity.toUpperCase()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#C5A059]">
                    <span>{isExpanded ? 'Hide Post-Mortem' : 'View Post-Mortem'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="pt-3 border-t border-[#F5F5F0]/10 space-y-3 text-xs animate-fadeIn">
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">Impact Description:</p>
                      <p className="text-[#F5F5F0]/80 leading-relaxed">{inc.impactDescription}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Resolution Details & Preventative Safeguard:</p>
                      <p className="text-emerald-200/90 leading-relaxed font-mono text-[11px] p-2 bg-[#141414] rounded border border-emerald-800/30">
                        {inc.resolutionDetails}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduled Maintenance Notice */}
      <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#8FB8DE]">
          <Server className="w-4 h-4" />
          <span>Next Scheduled Maintenance: <strong>Oct 12, 2026 03:00 UTC (Zero-Downtime Node Swap)</strong></span>
        </div>
        <span className="text-[10px] text-[#F5F5F0]/50">Automatic Failover Configured</span>
      </div>
    </div>
  );
};
