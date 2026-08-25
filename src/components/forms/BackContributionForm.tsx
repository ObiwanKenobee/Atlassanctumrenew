import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  DollarSign, 
  Layers, 
  Sparkles, 
  Lock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface BackContributionFormProps {
  missionTitle?: string;
  missionId?: string;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

export const BackContributionForm: React.FC<BackContributionFormProps> = ({
  missionTitle = 'Featured Mission',
  missionId = 'mission-mathare-river',
  onSuccess,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [entityName, setEntityName] = useState('');
  const [email, setEmail] = useState('');
  const [trancheAmount, setTrancheAmount] = useState('$10,000 - $25,000');
  const [backingType, setBackingType] = useState<'outcome_bond' | 'first_loss_guarantee' | 'catalytic_equity' | 'revolving_fund'>('outcome_bond');
  const [verificationCondition, setVerificationCondition] = useState('Independent Third-Party Field Audit + IoT Telemetry');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    audioFeedback.playSubtleClick();

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      audioFeedback.playCovenantResonance();
      if (onSuccess) {
        onSuccess({
          name,
          entityName: entityName || 'Individual Steward',
          email,
          trancheAmount,
          backingType,
          verificationCondition
        });
      }
    }, 1000);
  };

  if (success) {
    return (
      <div className="p-8 text-center space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/40">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">Sponsorship Allocation Logged</h3>
        <p className="text-xs text-[#F5F5F0]/70 font-sans max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-[#F5F5F0]">{name}</strong>. Your outcome tranche commitment of <span className="text-purple-400 font-mono font-bold">{trancheAmount}</span> for <span className="text-[#F5F5F0]">{missionTitle}</span> has been structured under the non-extractive milestone verification covenant.
        </p>
        <div className="p-3 bg-[#141414] border border-[#F5F5F0]/10 rounded text-[11px] font-mono text-[#F5F5F0]/60 max-w-sm mx-auto">
          <div>Instrument: <span className="text-purple-400">{backingType.toUpperCase()}</span></div>
          <div>Condition: <span className="text-[#F5F5F0]">{verificationCondition}</span></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Backing Instrument Structure */}
      <div className="space-y-1">
        <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Backing Instrument</label>
        <select
          value={backingType}
          onChange={(e) => setBackingType(e.target.value as any)}
          className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-purple-500"
        >
          <option value="outcome_bond">Outcome-Based Milestone Sponsor (Escrow payout upon verified metric)</option>
          <option value="first_loss_guarantee">First-Loss Capital Protection Buffer</option>
          <option value="revolving_fund">Regenerative Revolving Facility (Recycled returns)</option>
          <option value="catalytic_equity">Non-Extractive Patient Capital</option>
        </select>
      </div>

      {/* Tranche Range */}
      <div className="space-y-1">
        <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Tranche Commitment Range</label>
        <select
          value={trancheAmount}
          onChange={(e) => setTrancheAmount(e.target.value)}
          className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-purple-500"
        >
          <option value="$5,000 - $10,000">$5,000 – $10,000 (Community Anchor)</option>
          <option value="$10,000 - $25,000">$10,000 – $25,000 (Phase Implementation)</option>
          <option value="$25,000 - $50,000">$25,000 – $50,000 (Full Milestone Syndicate)</option>
          <option value="$50,000+">$50,000+ (Institutional Bioregional Scale)</option>
        </select>
      </div>

      {/* Sponsor Name & Entity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Representative Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Elena Rostova"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Entity / Fund Name (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Sovereign Nature Foundation"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Direct Email *</label>
        <input
          type="email"
          required
          placeholder="e.g. elena@impactcapital.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Verification Guardrails */}
      <div className="p-3 bg-[#111111] border border-[#F5F5F0]/10 rounded-sm space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-mono text-purple-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-bold">Automated Milestone Release</span>
        </div>
        <p className="text-[11px] text-[#F5F5F0]/70 font-sans leading-relaxed">
          Tranche capital stays locked in multi-sig smart escrow until peer-reviewed sensor mesh telemetry and accredited field audits satisfy the pre-agreed biophysical KPI threshold.
        </p>
      </div>

      {/* Actions */}
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
          disabled={isSubmitting || !name || !email}
          className="flex-1 sm:flex-initial px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Structuring Tranche...</span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Register Tranche Allocation</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
