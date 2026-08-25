import React, { useState } from 'react';
import { 
  Heart, 
  DollarSign, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Info,
  Lock
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface GiveContributionFormProps {
  missionTitle?: string;
  missionId?: string;
  onSuccess?: (details: { amount: number; frequency: string; provider: string; email: string; name: string }) => void;
  onCancel?: () => void;
}

export const GiveContributionForm: React.FC<GiveContributionFormProps> = ({
  missionTitle = 'Featured Mission',
  missionId = 'mission-mathare-river',
  onSuccess,
  onCancel
}) => {
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'mpesa' | 'bank' | 'crypto'>('stripe');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const presetAmounts = [25, 50, 100, 250, 500];
  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) return;
    if (!email) return;

    setIsSubmitting(true);
    audioFeedback.playSubtleClick();

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      audioFeedback.playCovenantResonance();
      if (onSuccess) {
        onSuccess({
          amount: finalAmount,
          frequency,
          provider: paymentProvider,
          email,
          name: name || 'Anonymous Steward'
        });
      }
    }, 1000);
  };

  if (success) {
    return (
      <div className="p-8 text-center space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">Contribution Confirmed</h3>
        <p className="text-xs text-[#F5F5F0]/70 font-sans max-w-md mx-auto leading-relaxed">
          Your gift of <strong className="text-[#C5A059] font-mono">${finalAmount.toLocaleString()}</strong> ({frequency}) has been allocated directly to <span className="text-[#F5F5F0]">{missionTitle}</span>. 100% of non-extractive funds flow to verified physical milestones.
        </p>
        <div className="p-3 bg-[#141414] border border-[#F5F5F0]/10 rounded text-[11px] font-mono text-[#F5F5F0]/60 max-w-sm mx-auto">
          <div>Allocation Hash: <span className="text-emerald-400">0x8a92f0...4c1</span></div>
          <div>Receipt sent to: <span className="text-[#F5F5F0]">{email}</span></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Frequency Toggle */}
      <div className="flex bg-[#141414] p-1 rounded-sm border border-[#F5F5F0]/10">
        <button
          type="button"
          onClick={() => {
            setFrequency('one-time');
            audioFeedback.playSubtleClick();
          }}
          className={`flex-1 py-1.5 text-xs font-mono rounded-sm transition-all ${
            frequency === 'one-time'
              ? 'bg-[#C5A059] text-[#0A0A0A] font-bold shadow'
              : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
          }`}
        >
          One-Time Gift
        </button>
        <button
          type="button"
          onClick={() => {
            setFrequency('monthly');
            audioFeedback.playSubtleClick();
          }}
          className={`flex-1 py-1.5 text-xs font-mono rounded-sm transition-all ${
            frequency === 'monthly'
              ? 'bg-[#C5A059] text-[#0A0A0A] font-bold shadow'
              : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
          }`}
        >
          Monthly Sustainer
        </button>
      </div>

      {/* Preset Amounts Grid */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-[#F5F5F0]/60 uppercase tracking-wider block">
          Select Amount (USD)
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {presetAmounts.map(amt => (
            <button
              key={amt}
              type="button"
              onClick={() => {
                setSelectedAmount(amt);
                setCustomAmount('');
                audioFeedback.playSubtleClick();
              }}
              className={`py-2 text-xs font-mono rounded-sm border transition-all ${
                selectedAmount === amt && !customAmount
                  ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059] font-bold'
                  : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:border-[#F5F5F0]/30 hover:text-[#F5F5F0]'
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="relative mt-2">
          <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-[#F5F5F0]/40" />
          <input
            type="number"
            min="1"
            placeholder="Custom Amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(0);
            }}
            className="w-full pl-9 pr-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Donor Info (No account creation required) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Your Name (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Email Address *</label>
          <input
            type="email"
            required
            placeholder="For cryptographic receipt"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Payment Rails Selector */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-[#F5F5F0]/60 uppercase tracking-wider block">
          Payment Method
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'stripe', label: 'Card / Stripe' },
            { id: 'mpesa', label: 'M-Pesa / Mobile' },
            { id: 'bank', label: 'Direct Wire' },
            { id: 'crypto', label: 'Celo / USDC' }
          ].map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPaymentProvider(p.id as any);
                audioFeedback.playSubtleClick();
              }}
              className={`p-2 text-[11px] font-mono rounded-sm border text-center transition-all ${
                paymentProvider === p.id
                  ? 'bg-[#F5F5F0]/15 border-[#C5A059] text-[#F5F5F0] font-medium'
                  : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transparency Guarantee Strip */}
      <div className="p-3 bg-[#111111] border border-[#F5F5F0]/10 rounded-sm flex items-start gap-2.5 text-[11px] text-[#F5F5F0]/70">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="font-sans leading-tight">
          <strong>100% Non-Extractive Principle:</strong> Funds are placed in escrow and released per verified biophysical milestone. No platform skimming.
        </p>
      </div>

      {/* Submit Action */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-mono text-[#F5F5F0]/60 hover:text-[#F5F5F0]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !finalAmount || !email}
          className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#C5A059] hover:bg-[#D4B06A] text-[#0A0A0A] font-mono text-xs uppercase tracking-wider font-bold rounded-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Processing Escrow...</span>
          ) : (
            <>
              <Heart className="w-4 h-4" />
              <span>Confirm ${finalAmount || 0} Contribution</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
