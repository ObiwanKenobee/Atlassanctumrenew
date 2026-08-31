import React, { useState } from 'react';
import { 
  ShieldAlert, 
  KeyRound, 
  Smartphone, 
  Laptop, 
  Lock, 
  FileCode, 
  AlertTriangle, 
  Mail, 
  CheckCircle2, 
  Radio, 
  ExternalLink,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { SECURITY_SPECIFICATIONS, MOCK_ACTIVE_SESSIONS } from '../../../data/trustData';
import { audioFeedback } from '../../../lib/audioFeedback';
import { Web3WalletManager } from '../Web3WalletManager';

export const SecurityCenterSection: React.FC = () => {
  const [sessions, setSessions] = useState(MOCK_ACTIVE_SESSIONS);
  const [revocationSuccess, setRevocationSuccess] = useState(false);
  const [securityReportSent, setSecurityReportSent] = useState(false);

  const handleRevokeOtherSessions = () => {
    audioFeedback.playSubtleClick();
    setSessions(prev => prev.filter(s => s.isCurrent));
    setRevocationSuccess(true);
    setTimeout(() => setRevocationSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#8FB8DE]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8FB8DE] font-bold">Zero-Trust Security Center</span>
          </div>
          <h2 className="text-xl font-medium font-serif text-[#F5F5F0]">
            Sovereign Defense & Cryptographic Integrity
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
            Atlas Sanctum defends user privacy, bioregional sensor networks, and epistemic research through military-grade encryption, zero-knowledge verification, and strict API enclaves.
          </p>
        </div>

        <div className="p-3 bg-[#0E0E0E] border border-emerald-500/30 rounded text-xs font-mono space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Security Status: ALL DEFENSES ACTIVE</span>
          </div>
          <p className="text-[10px] text-[#F5F5F0]/60">Last Automated Audit: 12 minutes ago</p>
        </div>
      </div>

      {/* Security Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECURITY_SPECIFICATIONS.map((spec, i) => (
          <div key={i} className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2 hover:border-[#F5F5F0]/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-[#C5A059] font-bold">{spec.category}</span>
              <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-800/40 text-[9px] font-mono text-emerald-300 rounded uppercase">
                {spec.status}
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#F5F5F0] font-mono">{spec.title}</h4>
            <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">{spec.description}</p>
            <div className="pt-2 border-t border-[#F5F5F0]/5 flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/50">
              <span>Standard: {spec.standard}</span>
              <span className="text-emerald-400/90">{spec.auditVerification}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sovereign Web3 & Cryptographic Keys Manager */}
      <Web3WalletManager />

      {/* Active Sessions & Device Management */}
      <div className="p-5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-mono uppercase font-bold text-[#F5F5F0] flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#C5A059]" />
              Active Sessions & Connected Devices
            </h3>
            <p className="text-xs text-[#F5F5F0]/60">Review authenticated devices currently accessing your account</p>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={handleRevokeOtherSessions}
              className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-mono rounded transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Revoke All Other Sessions</span>
            </button>
          )}
        </div>

        {revocationSuccess && (
          <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/50 rounded text-xs font-mono text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>All secondary sessions have been revoked. Secret tokens invalidated.</span>
          </div>
        )}

        <div className="space-y-2.5">
          {sessions.map(sess => (
            <div key={sess.id} className="p-3 bg-[#161616] border border-[#F5F5F0]/5 rounded flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#222] rounded text-[#C5A059]">
                  {sess.device.includes('Mobile') ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-[#F5F5F0]">{sess.device}</p>
                    {sess.isCurrent && (
                      <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[9px] font-mono rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#F5F5F0]/60 font-mono">{sess.browser} • {sess.ipAddressMasked}</p>
                </div>
              </div>
              <div className="text-right font-mono text-[11px] text-[#F5F5F0]/50">
                <span>{sess.lastActive}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerability Disclosure & Incident Response Commitments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Responsible Vulnerability Disclosure</span>
          </div>
          <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">
            We welcome ethical security researchers. If you uncover an exploit, API anomaly, or data exposure vector, please coordinate with our defense team for safe patch deployment and bounty recognition.
          </p>
          <div className="p-3 bg-[#0E0E0E] rounded border border-[#F5F5F0]/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F5F5F0]/60">Security Hotline:</span>
              <a href="mailto:security@atlassanctum.org" className="text-[#C5A059] hover:underline flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                security@atlassanctum.org
              </a>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#F5F5F0]/50">
              <span>PGP Fingerprint:</span>
              <span className="text-xs text-[#F5F5F0]/80">9B42 E831 4FA0 7821</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Incident Response Commitments (SLA)</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5 font-mono">
              <span className="text-rose-400 font-bold">Critical Severity:</span>
              <span className="text-[#F5F5F0]/80">&lt; 15 Minutes Response & Containment</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5 font-mono">
              <span className="text-amber-400 font-bold">Moderate Severity:</span>
              <span className="text-[#F5F5F0]/80">&lt; 2 Hours Root-Cause Fix</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5 font-mono">
              <span className="text-cyan-400 font-bold">Transparency Post-Mortem:</span>
              <span className="text-[#F5F5F0]/80">Public Disclosure within 24h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
