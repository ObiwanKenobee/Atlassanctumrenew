import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, AlertCircle, Info, Check, X, ShieldAlert } from 'lucide-react';
import { audioFeedback } from '../lib/audioFeedback';

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  requiresTypedConfirmation?: string;
  consequenceSummary?: string[];
  onConfirm?: () => Promise<void> | void;
}

interface ConfirmationContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | null>(null);

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};

// Aliased shorthand for ease of use
export const useConfirm = useConfirmation;

export const ConfirmationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: ConfirmationOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const [typedInput, setTypedInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    // Play alert sound for safety
    if (options.variant === 'danger') {
      audioFeedback.playWarningPulse();
    } else {
      audioFeedback.playSubtleClick();
    }

    setTypedInput('');
    setIsProcessing(false);

    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleClose = (result: boolean) => {
    if (!dialogState) return;
    audioFeedback.playSubtleClick();
    dialogState.resolve(result);
    setDialogState(null);
    setTypedInput('');
    setIsProcessing(false);
  };

  const handleConfirmAction = async () => {
    if (!dialogState) return;
    const { options } = dialogState;

    if (options.requiresTypedConfirmation && typedInput.trim().toUpperCase() !== options.requiresTypedConfirmation.toUpperCase()) {
      return;
    }

    setIsProcessing(true);
    try {
      if (options.onConfirm) {
        await options.onConfirm();
      }
      handleClose(true);
    } catch (err) {
      console.error('Confirmation action error:', err);
      setIsProcessing(false);
    }
  };

  const currentOptions = dialogState?.options;
  const isDanger = currentOptions?.variant === 'danger' || !currentOptions?.variant;
  const isWarning = currentOptions?.variant === 'warning';
  const requiresTyping = !!currentOptions?.requiresTypedConfirmation;
  const isTypingValid = !requiresTyping || typedInput.trim().toUpperCase() === currentOptions?.requiresTypedConfirmation?.toUpperCase();

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}

      <AnimatePresence>
        {dialogState?.isOpen && currentOptions && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && handleClose(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-dialog-title"
              aria-describedby="confirm-dialog-description"
              className="relative w-full max-w-lg rounded-2xl bg-[#0F1410] border border-[#F5F5F0]/20 p-6 shadow-2xl text-[#F5F5F0] overflow-hidden"
              style={{
                boxShadow: isDanger
                  ? '0 0 40px rgba(239, 68, 68, 0.25), inset 0 0 15px rgba(239, 68, 68, 0.05)'
                  : '0 0 40px rgba(197, 160, 89, 0.25)'
              }}
            >
              {/* Header Badge & Title */}
              <div className="flex items-start gap-3.5 mb-4">
                <div
                  className={`p-2.5 rounded-xl border shrink-0 ${
                    isDanger
                      ? 'bg-red-950/80 border-red-500/50 text-red-400'
                      : isWarning
                      ? 'bg-amber-950/80 border-amber-500/50 text-amber-400'
                      : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-400'
                  }`}
                >
                  {isDanger ? (
                    <ShieldAlert className="w-6 h-6" />
                  ) : isWarning ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <Info className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-black/50 border border-white/10 text-neutral-400 font-bold">
                      {isDanger ? 'High-Impact Action' : 'Verification Required'}
                    </span>
                  </div>
                  <h2
                    id="confirm-dialog-title"
                    className="text-lg font-serif font-bold text-white tracking-wide mt-1"
                  >
                    {currentOptions.title}
                  </h2>
                </div>

                <button
                  onClick={() => !isProcessing && handleClose(false)}
                  className="text-neutral-500 hover:text-white transition-colors p-1"
                  aria-label="Cancel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message Description */}
              <p
                id="confirm-dialog-description"
                className="text-sm text-neutral-300 font-sans leading-relaxed mb-4"
              >
                {currentOptions.message}
              </p>

              {/* Consequence bullet summary if provided */}
              {currentOptions.consequenceSummary && currentOptions.consequenceSummary.length > 0 && (
                <div className="mb-4 p-3 rounded-xl bg-black/40 border border-red-500/20 text-xs font-mono space-y-1.5">
                  <span className="text-red-400 font-bold uppercase tracking-wider text-[10px] block">
                    Irreversible Consequences:
                  </span>
                  {currentOptions.consequenceSummary.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Optional Safety Typed Confirmation */}
              {requiresTyping && (
                <div className="mb-5 p-3.5 rounded-xl bg-black/50 border border-white/10">
                  <label className="block text-xs font-mono text-neutral-300 mb-2">
                    To prevent accidental loss, type{' '}
                    <span className="text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
                      {currentOptions.requiresTypedConfirmation}
                    </span>{' '}
                    to proceed:
                  </label>
                  <input
                    type="text"
                    value={typedInput}
                    onChange={(e) => setTypedInput(e.target.value)}
                    placeholder={`Type "${currentOptions.requiresTypedConfirmation}"`}
                    autoFocus
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0D0A] border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleClose(false)}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  {currentOptions.cancelText || 'Cancel'}
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAction}
                  disabled={!isTypingValid || isProcessing}
                  className={`px-5 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${
                    isDanger
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/50'
                      : isWarning
                      ? 'bg-amber-600 hover:bg-amber-500 text-black shadow-amber-950/50'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                  }`}
                >
                  {isProcessing ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{currentOptions.confirmText || 'Confirm & Proceed'}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmationContext.Provider>
  );
};
