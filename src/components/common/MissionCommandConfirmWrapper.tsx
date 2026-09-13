import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Lock, 
  Unlock, 
  Flame, 
  Radio, 
  HelpCircle,
  Clock,
  Fingerprint
} from 'lucide-react';
import { audioFeedback, hapticFeedback } from '../../lib/audioFeedback';

export interface MissionCommandConfirmProps {
  /** The child button or element to wrap and protect */
  children: React.ReactNode;
  /** Name of the command being guarded */
  commandTitle: string;
  /** Detailed operational description */
  commandDescription?: string;
  /** Tactical severity tier */
  severity?: 'critical' | 'danger' | 'warning' | 'high_capital';
  /** Expected operational consequences for field verification */
  consequences?: string[];
  /** Required safety string to type for critical tier (e.g. "CONFIRM", "EXECUTE", "FAILOVER") */
  requiredPasscode?: string;
  /** Require operator hold-to-confirm duration in milliseconds (default 1200ms) */
  holdDurationMs?: number;
  /** Target asset / bioregion / node identifier */
  targetIdentifier?: string;
  /** Primary callback when confirmed */
  onConfirm: () => Promise<void> | void;
  /** Optional cancel callback */
  onCancel?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** CSS class to apply to trigger wrapper */
  className?: string;
}

export const MissionCommandConfirmWrapper: React.FC<MissionCommandConfirmProps> = ({
  children,
  commandTitle,
  commandDescription,
  severity = 'critical',
  consequences = [
    'Directly triggers field intervention telemetry on edge nodes',
    'Updates mission DAG execution state on decentralized ledger',
    'Cannot be instantly undone without cryptographic counter-remediation'
  ],
  requiredPasscode,
  holdDurationMs = 1200,
  targetIdentifier,
  onConfirm,
  onCancel,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [typedInput, setTypedInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<any>(null);

  // Colors based on severity
  const severityConfig = {
    critical: {
      border: 'border-red-500/70',
      bg: 'bg-[#180808]',
      badgeBg: 'bg-red-950/90 text-red-300 border-red-500/50',
      glow: 'shadow-red-500/20',
      accentText: 'text-red-400',
      confirmBtn: 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30',
      icon: Flame,
      defaultPasscode: 'EXECUTE'
    },
    danger: {
      border: 'border-amber-500/70',
      bg: 'bg-[#181208]',
      badgeBg: 'bg-amber-950/90 text-amber-300 border-amber-500/50',
      glow: 'shadow-amber-500/20',
      accentText: 'text-amber-400',
      confirmBtn: 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/30',
      icon: AlertTriangle,
      defaultPasscode: 'CONFIRM'
    },
    warning: {
      border: 'border-[#C5A059]/70',
      bg: 'bg-[#12120C]',
      badgeBg: 'bg-[#2A2412] text-[#C5A059] border-[#C5A059]/50',
      glow: 'shadow-[#C5A059]/20',
      accentText: 'text-[#C5A059]',
      confirmBtn: 'bg-[#C5A059] hover:bg-[#D4AF37] text-black shadow-[#C5A059]/30',
      icon: ShieldAlert,
      defaultPasscode: undefined
    },
    high_capital: {
      border: 'border-emerald-500/70',
      bg: 'bg-[#08180E]',
      badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50',
      glow: 'shadow-emerald-500/20',
      accentText: 'text-emerald-400',
      confirmBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30',
      icon: CheckCircle2,
      defaultPasscode: 'AUTHORIZE'
    }
  }[severity];

  const targetPasscode = requiredPasscode || (severity === 'critical' ? 'EXECUTE' : undefined);
  const isPasscodeValid = !targetPasscode || typedInput.trim().toUpperCase() === targetPasscode.toUpperCase();

  const handleOpen = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();

    audioFeedback.playWarningPulse();
    hapticFeedback.triggerWarningHaptic();
    setTypedInput('');
    setHoldProgress(0);
    setIsHolding(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (isExecuting) return;
    audioFeedback.playMicroTick();
    setIsOpen(false);
    setTypedInput('');
    setHoldProgress(0);
    setIsHolding(false);
    if (onCancel) onCancel();
  };

  // Hold-to-confirm logic
  useEffect(() => {
    if (isHolding && isPasscodeValid && !isExecuting) {
      const stepMs = 50;
      const increment = (stepMs / holdDurationMs) * 100;

      holdIntervalRef.current = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            clearInterval(holdIntervalRef.current);
            triggerFinalConfirm();
            return 100;
          }
          return prev + increment;
        });
      }, stepMs);
    } else {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      setHoldProgress(0);
    }

    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [isHolding, isPasscodeValid, isExecuting, holdDurationMs]);

  const triggerFinalConfirm = async () => {
    if (!isPasscodeValid || isExecuting) return;

    setIsExecuting(true);
    audioFeedback.play('actionSuccess');
    hapticFeedback.triggerSuccessHaptic();

    try {
      await onConfirm();
      setIsOpen(false);
    } catch (err) {
      console.error('Mission command execution error:', err);
      audioFeedback.play('failure');
    } finally {
      setIsExecuting(false);
      setHoldProgress(0);
      setIsHolding(false);
    }
  };

  const IconComponent = severityConfig.icon;

  return (
    <>
      {/* Trigger element wrapper */}
      <div 
        onClick={handleOpen} 
        className={`inline-block cursor-pointer select-none ${className}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleOpen(e as any);
          }
        }}
      >
        {children}
      </div>

      {/* Persistent Field Command Confirmation Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className={`relative z-10 w-full max-w-lg rounded-lg border ${severityConfig.border} ${severityConfig.bg} shadow-2xl ${severityConfig.glow} p-6 text-[#F5F5F0] space-y-5 my-auto`}
            >
              {/* Header Bar */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-full border ${severityConfig.badgeBg}`}>
                    <IconComponent className="w-5 h-5 text-current animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded ${severityConfig.badgeBg}`}>
                        MISSION COMMAND GATEWAY • {severity.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
                      {commandTitle}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  disabled={isExecuting}
                  className="text-white/40 hover:text-white p-1 rounded-sm transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Target & Description */}
              <div className="space-y-2 text-xs font-mono">
                {targetIdentifier && (
                  <div className="flex items-center gap-2 p-2 rounded bg-black/40 border border-white/10 text-white/80">
                    <Radio className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Target Node / Bioregion:</span>
                    <strong className="text-[#C5A059]">{targetIdentifier}</strong>
                  </div>
                )}

                {commandDescription && (
                  <p className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed">
                    {commandDescription}
                  </p>
                )}
              </div>

              {/* Consequence Checklist */}
              {consequences.length > 0 && (
                <div className="space-y-2 p-3.5 rounded bg-black/50 border border-white/10 text-xs font-mono">
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Field Operational Invariants & State Changes:
                  </span>
                  <ul className="space-y-1.5 pl-1">
                    {consequences.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[#F5F5F0]/70 text-[11px] font-sans">
                        <span className="text-red-400 font-mono font-bold">▶</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Typed Passcode Barrier (if applicable) */}
              {targetPasscode && (
                <div className="space-y-2 pt-1 font-mono text-xs">
                  <label className="text-[11px] text-[#F5F5F0]/70 flex items-center justify-between">
                    <span>
                      Type <strong className="text-white font-bold tracking-widest bg-white/10 px-1.5 py-0.5 rounded border border-white/20">"{targetPasscode}"</strong> to unlock command:
                    </span>
                    {isPasscodeValid && typedInput.length > 0 && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> UNLOCKED
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={typedInput}
                    onChange={(e) => setTypedInput(e.target.value)}
                    placeholder={`Type ${targetPasscode}...`}
                    className="w-full bg-[#050505] border border-white/20 rounded p-2.5 text-xs text-white uppercase tracking-widest font-mono focus:border-white focus:outline-none"
                    autoFocus
                  />
                </div>
              )}

              {/* Hold-to-Confirm or Instant Action Bar */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                  <button
                    onClick={handleClose}
                    disabled={isExecuting}
                    className="px-4 py-2.5 rounded text-xs font-mono uppercase tracking-wider border border-white/20 text-[#F5F5F0]/70 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Abort Command
                  </button>

                  {/* Hold-to-Confirm Button for High-Intensity Operations */}
                  <div className="relative overflow-hidden rounded">
                    <button
                      onMouseDown={() => isPasscodeValid && setIsHolding(true)}
                      onMouseUp={() => setIsHolding(false)}
                      onMouseLeave={() => setIsHolding(false)}
                      onTouchStart={() => isPasscodeValid && setIsHolding(true)}
                      onTouchEnd={() => setIsHolding(false)}
                      disabled={!isPasscodeValid || isExecuting}
                      className={`w-full sm:w-auto px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 cursor-pointer select-none ${
                        !isPasscodeValid
                          ? 'bg-white/10 text-white/30 border border-white/10 cursor-not-allowed'
                          : severityConfig.confirmBtn
                      }`}
                    >
                      {isExecuting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Dispatching Command...</span>
                        </>
                      ) : (
                        <>
                          {isPasscodeValid ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          <span>{isHolding ? 'Hold to Transmit...' : 'Press & Hold to Authorize'}</span>
                        </>
                      )}
                    </button>

                    {/* Hold Progress Indicator */}
                    {isHolding && (
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-white transition-all duration-75"
                        style={{ width: `${holdProgress}%` }}
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pt-1">
                  <span className="flex items-center gap-1">
                    <Fingerprint className="w-3 h-3 text-[#C5A059]" />
                    Station: Atlas Field Console (Encrypted)
                  </span>
                  <span>Safety Lockout Enabled</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
