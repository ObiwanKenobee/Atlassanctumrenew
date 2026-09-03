import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  Database, 
  Cpu, 
  Layers,
  AlertTriangle,
  AlertOctagon,
  Droplets,
  Activity
} from 'lucide-react';
import { useVerificationToast, VerificationNotification } from '../../context/VerificationToastContext';
import { audioFeedback } from '../../lib/audioFeedback';

interface ToastItemProps {
  notification: VerificationNotification;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ notification, onDismiss }) => {
  const [copied, setCopied] = useState(false);

  const isAlert = notification.severity === 'critical' || 
                  notification.severity === 'alert' || 
                  notification.severity === 'warning' ||
                  notification.epistemicTier === 'Critical Bioregional Breach' ||
                  notification.epistemicTier === 'Ecological Threshold Alert';

  const isCritical = notification.severity === 'critical' || notification.epistemicTier === 'Critical Bioregional Breach';

  const handleCopyHash = () => {
    navigator.clipboard.writeText(notification.hash);
    setCopied(true);
    audioFeedback.playSubtleClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInspectProvenance = () => {
    audioFeedback.playSubtleClick();
    // Dispatch event to open provenance modal for this record
    const event = new CustomEvent('inspect-data-provenance', {
      detail: {
        id: notification.id,
        source: notification.telemetrySource || 'Epistemic Blockchain Ledger',
        sourceType: 'iot_sensor_mesh',
        collectedAt: notification.timestamp,
        calculationMethod: isAlert 
          ? `Bioregional Sentinel Threshold Breached: ${notification.thresholdDetails?.metricName || notification.title}`
          : 'Merkle Leaf Consensus Verification against Root Block #' + notification.blockHeight,
        certaintyScore: notification.certaintyScore,
        verifier: notification.verifier,
        verifierRole: isAlert ? 'Autonomous Bioregional Sentinel Node' : 'Decentralized Epistemic Auditor',
        cryptographicHash: notification.hash,
        assumptions: [
          'Raw in-situ sensor telemetry verified with multi-modal cross-check',
          'Merkle path verified against Ethereum / Polygon state root',
          notification.thresholdDetails 
            ? `Critical Threshold: ${notification.thresholdDetails.thresholdValue} ${notification.thresholdDetails.unit} | Actual: ${notification.thresholdDetails.actualValue} ${notification.thresholdDetails.unit}`
            : 'Autonomous sentinel monitoring accord active'
        ],
        lastAudited: new Date().toISOString()
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <div
      role="alert"
      className={`w-full max-w-sm sm:max-w-md rounded-lg p-3.5 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
        isCritical
          ? 'bg-[#150B0B] border border-rose-500/80 hover:border-rose-400 ring-1 ring-rose-500/30 shadow-[0_0_22px_rgba(244,63,94,0.3)]'
          : isAlert
          ? 'bg-[#151108] border border-amber-500/80 hover:border-amber-400 ring-1 ring-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
          : 'bg-[#0D120E] border border-emerald-500/50 hover:border-emerald-400 ring-1 ring-emerald-500/20'
      }`}
    >
      {/* Top accent bar */}
      <div 
        className={`absolute top-0 left-0 right-0 h-[3px] ${
          isCritical
            ? 'bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 animate-pulse'
            : isAlert
            ? 'bg-gradient-to-r from-amber-500 via-[#C5A059] to-amber-400'
            : 'bg-gradient-to-r from-emerald-500 via-[#C5A059] to-emerald-400'
        }`}
      />

      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 min-w-0">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              isCritical
                ? 'bg-rose-950/90 border border-rose-500/80 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)] animate-pulse'
                : isAlert
                ? 'bg-amber-950/90 border border-amber-500/80 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
            }`}
          >
            {isCritical ? (
              <AlertOctagon className="w-4 h-4" />
            ) : isAlert ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span 
                className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                  isCritical 
                    ? 'text-rose-400' 
                    : isAlert 
                    ? 'text-amber-400' 
                    : 'text-emerald-400'
                }`}
              >
                {notification.epistemicTier || (isAlert ? 'Ecological Alert' : 'Merkle State Root Verified')}
              </span>
              <span 
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold border ${
                  isCritical
                    ? 'bg-rose-950/90 text-rose-300 border-rose-500/50'
                    : isAlert
                    ? 'bg-amber-950/90 text-amber-300 border-amber-500/50'
                    : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {notification.certaintyScore}% Certainty
              </span>
            </div>

            <h4 className={`text-xs font-serif font-bold mt-0.5 line-clamp-1 ${
              isCritical ? 'text-rose-100' : isAlert ? 'text-amber-100' : 'text-[#F5F5F0]'
            }`}>
              {notification.title}
            </h4>
          </div>
        </div>

        <button
          onClick={() => {
            audioFeedback.playSubtleClick();
            onDismiss(notification.id);
          }}
          className="text-[#F5F5F0]/50 hover:text-white p-1 rounded transition-colors cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[11px] text-[#F5F5F0]/80 mt-1.5 line-clamp-2 leading-relaxed font-sans">
        {notification.claim}
      </p>

      {/* Threshold Breach Detail Strip */}
      {notification.thresholdDetails && (
        <div className="mt-2 p-1.5 rounded bg-black/40 border border-rose-500/30 font-mono text-[10px] flex items-center justify-between gap-2">
          <span className="text-neutral-400 truncate">
            {notification.thresholdDetails.metricName}:
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-neutral-400">
              Limit: <strong className="text-white">{notification.thresholdDetails.thresholdValue}</strong>
            </span>
            <span className="text-rose-400 font-bold">
              Current: {notification.thresholdDetails.actualValue} {notification.thresholdDetails.unit}
            </span>
          </div>
        </div>
      )}

      {/* Cryptographic Proof Info & Actions */}
      <div className="mt-2.5 pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between gap-2 text-[10px] font-mono text-[#F5F5F0]/60">
        <div className="flex items-center gap-1.5 truncate">
          <span className={isCritical ? 'text-rose-400 font-bold' : isAlert ? 'text-amber-400 font-bold' : 'text-emerald-500 font-bold'}>
            BLOCK #{notification.blockHeight}
          </span>
          <span className="text-neutral-500">·</span>
          <span className="truncate text-neutral-400" title={notification.hash}>
            {notification.hash.length > 18 ? `${notification.hash.slice(0, 10)}...${notification.hash.slice(-6)}` : notification.hash}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopyHash}
            title="Copy cryptographic proof hash"
            className="p-1 rounded bg-[#141414] hover:bg-[#1f1f1f] text-[#C5A059] border border-[#C5A059]/30 transition-colors flex items-center gap-1 cursor-pointer text-[9px]"
          >
            {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
            <span>{copied ? 'Copied' : 'Hash'}</span>
          </button>

          <button
            onClick={handleInspectProvenance}
            title="Inspect full epistemic data lineage"
            className={`p-1 px-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer text-[9px] font-bold border ${
              isCritical
                ? 'bg-rose-950/70 hover:bg-rose-900/80 text-rose-300 border-rose-500/50'
                : isAlert
                ? 'bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border-amber-500/50'
                : 'bg-emerald-900/40 hover:bg-emerald-800/50 text-emerald-300 border-emerald-500/40'
            }`}
          >
            <Database className="w-2.5 h-2.5" />
            <span>Audit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const VerificationNotificationContainer: React.FC = () => {
  const { notifications, dismissNotification } = useVerificationToast();

  if (notifications.length === 0) return null;

  return (
    <div
      id="verification-notifications-container"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 pointer-events-auto max-w-[92vw] sm:max-w-md"
    >
      {notifications.map((n) => (
        <ToastItem key={n.id} notification={n} onDismiss={dismissNotification} />
      ))}
    </div>
  );
};
