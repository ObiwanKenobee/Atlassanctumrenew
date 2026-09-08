import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Calendar,
  RefreshCw,
  Sparkles,
  Download,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  Lock,
  Coins,
  Zap,
  TrendingUp,
  History,
  Clock
} from 'lucide-react';
import {
  ActiveSubscriptionState,
  SubscriptionTier,
  BillingCycle,
  ATLAS_TIERS,
  toggleAutoRenewal,
  updateBillingCycle,
  cancelSubscription,
  earnRegenerativeCredits,
  redeemRegenerativeCredits,
  getRegenerativeMultiplier,
  PaymentRecord
} from '../../lib/subscriptionManager';
import { audioFeedback } from '../../lib/audioFeedback';
import { generateSubscriptionPdfInvoice } from '../../lib/pdfInvoiceGenerator';

interface ManageSubscriptionViewProps {
  subState: ActiveSubscriptionState;
  onOpenCheckout: (tier: SubscriptionTier) => void;
  onSelectTab: (tabId: string) => void;
  onBackToPlans: () => void;
}

export const ManageSubscriptionView: React.FC<ManageSubscriptionViewProps> = ({
  subState,
  onOpenCheckout,
  onSelectTab,
  onBackToPlans
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [isSimulatingEarn, setIsSimulatingEarn] = useState(false);
  const [earnNotice, setEarnNotice] = useState<string | null>(null);
  const [redeemNotice, setRedeemNotice] = useState<string | null>(null);
  const [confirmCancelModal, setConfirmCancelModal] = useState(false);

  const currentTierDef = ATLAS_TIERS[subState.currentTier];
  const isFoundation = subState.currentTier === 'foundation';
  const multiplier = subState.creditMultiplier || getRegenerativeMultiplier(subState.currentTier);

  const handleCopyLicenseKey = () => {
    if (!subState.activeLicenseKey) return;
    navigator.clipboard.writeText(subState.activeLicenseKey);
    setCopiedKey(true);
    audioFeedback.play('softClick');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleToggleAutoRenew = () => {
    audioFeedback.play('softClick');
    toggleAutoRenewal();
  };

  const handleCycleChange = (cycle: BillingCycle) => {
    audioFeedback.play('softClick');
    updateBillingCycle(cycle);
  };

  const handleSimulateTelemetryEarn = () => {
    setIsSimulatingEarn(true);
    audioFeedback.play('commandOpen');

    setTimeout(() => {
      const res = earnRegenerativeCredits('High-frequency IoT soil & carbon flux telemetry ingest', 50);
      setIsSimulatingEarn(false);
      setEarnNotice(`+${res.earned} Regenerative Credits earned! (${multiplier}x multiplier applied)`);
      audioFeedback.play('success');
      setTimeout(() => setEarnNotice(null), 4000);
    }, 600);
  };

  const handleRedeemDiscount = () => {
    if ((subState.regenerativeCredits || 0) < 500) {
      setRedeemNotice('Requires minimum 500 RGC to redeem $50 subscription credit.');
      setTimeout(() => setRedeemNotice(null), 3000);
      return;
    }

    const res = redeemRegenerativeCredits(500, 'Subscription Billing Credit');
    if (res.success) {
      audioFeedback.play('success');
      setRedeemNotice(`Successfully redeemed 500 RGC for a $${res.discountUsd} billing discount!`);
      setTimeout(() => setRedeemNotice(null), 4000);
    }
  };

  const handleDownloadPastInvoice = (record: PaymentRecord) => {
    try {
      generateSubscriptionPdfInvoice(record, true);
      audioFeedback.play('softClick');
    } catch (err) {
      console.warn('[ManageSubscription] Invoice download error:', err);
    }
  };

  const handleConfirmCancel = () => {
    audioFeedback.play('softClick');
    cancelSubscription();
    setConfirmCancelModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <button
            onClick={() => {
              audioFeedback.play('softClick');
              onBackToPlans();
            }}
            className="text-xs font-mono text-[#C5A059] hover:underline flex items-center gap-1 mb-2 cursor-pointer"
          >
            <span>← Return to Plans & Offerings</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
              Subscription Management Cockpit
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#F5F5F0] mt-1">
            Manage Subscription & Economic Entitlements
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-light">
            Monitor active protocol license keys, toggle automated renewal, modify settlement frequencies, and track regenerative loyalty credit accruals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isFoundation ? (
            <button
              onClick={() => onOpenCheckout('studio')}
              className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upgrade to Studio</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenCheckout(subState.currentTier === 'studio' ? 'intelligence' : 'enterprise')}
              className="px-4 py-2.5 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059] text-[#C5A059] text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Change / Upgrade Tier</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: Active Plan Status + Billing Cycle Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Plan Card (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-sm bg-[#0E1210] border border-[#C5A059]/40 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                ACTIVE PROTOCOL TIER
              </span>
              <h3 className="text-2xl font-serif text-[#F5F5F0] flex items-center gap-2 mt-0.5">
                <span>{currentTierDef.name}</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  {isFoundation ? 'Open Access' : 'Active Paid License'}
                </span>
              </h3>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-[#F5F5F0]/60">Cost</span>
              <div className="text-xl font-mono font-bold text-[#C5A059]">
                ${subState.billingCycle === 'annual' ? currentTierDef.annualPrice : currentTierDef.monthlyPrice}
                <span className="text-xs text-[#F5F5F0]/50 font-normal"> /mo</span>
              </div>
            </div>
          </div>

          {/* License Key Display */}
          <div className="p-3.5 rounded bg-black/60 border border-white/10 font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[#F5F5F0]/50 text-[10px]">
              <span>AUTHENTICATED LICENSE KEY</span>
              {subState.activeLicenseKey && (
                <button
                  onClick={handleCopyLicenseKey}
                  className="text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <div className="text-sm font-mono text-[#F5F5F0] break-all select-all">
              {subState.activeLicenseKey || 'PUBLIC-COMMONS-UNRESTRICTED-V1'}
            </div>
          </div>

          {/* Status Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Billing Cycle</span>
              <span className="text-[#F5F5F0] font-medium capitalize">
                {subState.billingCycle} {subState.billingCycle === 'annual' && '(20% Saved)'}
              </span>
            </div>

            <div className="p-3 rounded bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Next Renewal</span>
              <span className="text-[#F5F5F0] font-medium">
                {subState.renewsAt ? new Date(subState.renewsAt).toLocaleDateString() : 'N/A (Commons)'}
              </span>
            </div>

            <div className="p-3 rounded bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Payment Rail</span>
              <span className="text-[#F5F5F0] font-medium truncate block">
                {subState.paymentSummary || 'Standard Rail'}
              </span>
            </div>
          </div>

          {/* Auto-Renewal Toggle Switch */}
          <div className="p-4 rounded bg-[#131915] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-3.5 h-3.5 ${subState.autoRenew ? 'text-emerald-400 animate-spin-slow' : 'text-[#F5F5F0]/40'}`} />
                <span className="text-xs font-mono font-bold text-[#F5F5F0] uppercase">
                  Automatic Renewal: {subState.autoRenew ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>
              <p className="text-[11px] text-[#F5F5F0]/60 font-light">
                {subState.autoRenew
                  ? 'Your subscription will renew automatically at the end of each billing cycle without service interruption.'
                  : 'Auto-renewal is paused. Your plan will expire at the end of the term and revert to the Foundation Commons.'}
              </p>
            </div>

            <button
              onClick={handleToggleAutoRenew}
              disabled={isFoundation}
              className={`px-4 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                isFoundation
                  ? 'opacity-40 cursor-not-allowed bg-white/10 text-white/40'
                  : subState.autoRenew
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/50 hover:bg-amber-900'
              }`}
            >
              {subState.autoRenew ? 'Pause Auto-Renew' : 'Enable Auto-Renew'}
            </button>
          </div>
        </div>

        {/* Billing Cycle & Payment Switcher (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-sm bg-[#0C0F0D] border border-white/10 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                BILLING CYCLE & FREQUENCY
              </span>
              <h4 className="text-lg font-serif text-[#F5F5F0] mt-0.5">Billing Cadence</h4>
            </div>

            {/* Monthly vs Annual Option */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleCycleChange('monthly')}
                className={`p-3.5 rounded border text-left transition-all cursor-pointer ${
                  subState.billingCycle === 'monthly'
                    ? 'bg-[#1B3022] border-[#C5A059] text-white shadow-md'
                    : 'bg-black/40 border-white/10 text-[#F5F5F0]/60 hover:text-white'
                }`}
              >
                <div className="text-xs font-mono font-bold uppercase">Monthly</div>
                <div className="text-xs text-[#F5F5F0]/60 mt-1">Standard flex cycle</div>
              </button>

              <button
                type="button"
                onClick={() => handleCycleChange('annual')}
                className={`p-3.5 rounded border text-left transition-all cursor-pointer relative ${
                  subState.billingCycle === 'annual'
                    ? 'bg-[#1B3022] border-[#C5A059] text-white shadow-md'
                    : 'bg-black/40 border-white/10 text-[#F5F5F0]/60 hover:text-white'
                }`}
              >
                <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-[#C5A059] text-black font-mono text-[8px] font-bold">
                  SAVE 20%
                </span>
                <div className="text-xs font-mono font-bold uppercase">Annual</div>
                <div className="text-xs text-[#C5A059] mt-1">20% protocol discount</div>
              </button>
            </div>

            <div className="p-3.5 rounded bg-black/40 border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#F5F5F0]/60">
                <span>Annual Savings Rate:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {subState.currentTier === 'studio'
                    ? '$1,200 / year saved'
                    : subState.currentTier === 'intelligence'
                    ? '$6,000 / year saved'
                    : '20% Institutional Discount'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#F5F5F0]/60">
                <span>Reinvestment Guarantee:</span>
                <span className="text-[#C5A059] font-mono">100% Non-Extractive</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <button
              onClick={() => onOpenCheckout(subState.currentTier === 'foundation' ? 'studio' : subState.currentTier)}
              className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-white/20 text-[#F5F5F0] text-xs font-mono uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Update Payment Method</span>
            </button>

            {!isFoundation && (
              <button
                onClick={() => setConfirmCancelModal(true)}
                className="w-full py-2 text-rose-400 hover:text-rose-300 text-xs font-mono text-center transition-colors cursor-pointer hover:underline"
              >
                Cancel Subscription & Revert to Commons
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REGENERATIVE CREDITS LOYALTY POINTS TRACKER (DETAILED SECTION) */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-sm bg-[#0E1511] border border-emerald-500/40 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                <Coins className="w-3 h-3" />
                <span>Regenerative Credits Loyalty Engine</span>
              </span>
              <span className="text-xs font-mono text-emerald-400/70">
                Tier Velocity: <strong>{multiplier}x Earning Multiplier</strong>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-[#F5F5F0]">
              Your Regenerative Credits & Ecological Attribution
            </h3>
            <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-light">
              Earn RGC loyalty credits by streaming verified sensor telemetry, publishing open ground-truth reports, and contributing to community schemas. Credits offset subscription fees and fund physical hardware grants.
            </p>
          </div>

          {/* Balance & Offset Value */}
          <div className="flex items-center gap-4 bg-black/60 p-4 rounded-sm border border-emerald-500/30">
            <div>
              <div className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">Credits Balance</div>
              <div className="text-2xl font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <span>{(subState.regenerativeCredits || 0).toLocaleString()}</span>
                <span className="text-xs font-normal text-emerald-500">RGC</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">Offset Value</div>
              <div className="text-lg font-mono font-bold text-[#C5A059]">
                ${Math.round(((subState.regenerativeCredits || 0) / 100) * 10)}.00
              </div>
            </div>
          </div>
        </div>

        {/* Notices */}
        {earnNotice && (
          <div className="p-3 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{earnNotice}</span>
          </div>
        )}
        {redeemNotice && (
          <div className="p-3 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{redeemNotice}</span>
          </div>
        )}

        {/* Tier Acceleration Incentive Bar */}
        <div className="p-4 rounded bg-black/50 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className={`p-3 rounded border transition-all ${
            subState.currentTier === 'foundation' ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-white/5 bg-black/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#F5F5F0]/50 uppercase">Commons</span>
              <span className="text-xs text-[#F5F5F0] font-bold">1.0x Rate</span>
            </div>
            <p className="text-[11px] text-[#F5F5F0]/60 mt-1 font-sans">Baseline ground-truth reporting</p>
          </div>

          <div className={`p-3 rounded border transition-all ${
            subState.currentTier === 'studio' ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-white/5 bg-black/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#C5A059] uppercase font-bold">Atlas Studio</span>
              <span className="text-xs text-[#C5A059] font-bold">1.5x Multiplier</span>
            </div>
            <p className="text-[11px] text-[#F5F5F0]/60 mt-1 font-sans">+500 RGC activation bonus included</p>
          </div>

          <div className={`p-3 rounded border transition-all ${
            subState.currentTier === 'intelligence' ? 'border-[#C5A059] bg-[#C5A059]/20' : 'border-emerald-500/30 bg-emerald-950/20'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 uppercase font-bold">Atlas Intelligence</span>
              <span className="text-xs text-emerald-300 font-bold">3.0x Multiplier</span>
            </div>
            <p className="text-[11px] text-[#F5F5F0]/60 mt-1 font-sans">Earn 3x credits on all AI model validations</p>
          </div>
        </div>

        {/* Interactive Earning & Redemption Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSimulateTelemetryEarn}
              disabled={isSimulatingEarn}
              className="px-4 py-2 rounded text-xs font-mono bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 transition-colors cursor-pointer flex items-center gap-2 font-bold"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isSimulatingEarn ? 'Simulating Ingest...' : `Simulate Telemetry Stream (+${Math.round(50 * multiplier)} RGC)`}</span>
            </button>

            <button
              onClick={handleRedeemDiscount}
              className="px-4 py-2 rounded text-xs font-mono bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/50 text-[#C5A059] transition-colors cursor-pointer flex items-center gap-2 font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply 500 RGC as $50 Bill Offset</span>
            </button>
          </div>

          {subState.currentTier !== 'enterprise' && (
            <button
              onClick={() => onOpenCheckout(subState.currentTier === 'foundation' ? 'studio' : 'intelligence')}
              className="text-xs font-mono text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Upgrade tier to boost multiplier to {subState.currentTier === 'foundation' ? '1.5x' : '3.0x'} →</span>
            </button>
          )}
        </div>

        {/* Recent Activity Log */}
        {subState.creditActivities && subState.creditActivities.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#F5F5F0]/50 uppercase tracking-wider">
              <History className="w-3 h-3" />
              <span>Recent Regenerative Credit Activity</span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {subState.creditActivities.slice(0, 5).map(act => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className={act.creditsEarned >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {act.creditsEarned >= 0 ? `+${act.creditsEarned}` : act.creditsEarned} RGC
                    </span>
                    <span className="text-[#F5F5F0]/70 truncate max-w-md">{act.action}</span>
                  </div>
                  <span className="text-[10px] text-[#F5F5F0]/40 shrink-0">
                    {new Date(act.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* INVOICE & RECEIPT HISTORY TABLE */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-sm bg-[#0A0C0B] border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h4 className="text-base font-serif text-[#F5F5F0]">Billing Receipts & Invoices</h4>
            <p className="text-xs text-[#F5F5F0]/50 font-light">
              Official institutional tax invoices with cryptographic proof hashes.
            </p>
          </div>
          <span className="text-xs font-mono text-[#F5F5F0]/40">
            {subState.history.length} {subState.history.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>

        {subState.history.length === 0 ? (
          <div className="p-6 text-center text-xs font-mono text-[#F5F5F0]/50">
            No past invoices on file. Upgrading to Atlas Studio or Atlas Intelligence will generate official PDF invoices here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase text-[#F5F5F0]/40">
                  <th className="py-2.5 px-3">Invoice Number</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Tier Plan</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Settlement Rail</th>
                  <th className="py-2.5 px-3 text-right">PDF Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {subState.history.map(record => (
                  <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 text-[#C5A059] font-bold">{record.invoiceNumber}</td>
                    <td className="py-3 px-3 text-[#F5F5F0]/70">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-[#F5F5F0] capitalize">
                      {ATLAS_TIERS[record.tier]?.name || record.tier}
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">
                      ${record.amountUsd.toLocaleString()} USD
                    </td>
                    <td className="py-3 px-3 text-[#F5F5F0]/60">
                      {record.paymentMethodSummary}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDownloadPastInvoice(record)}
                        className="px-2.5 py-1 rounded bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1.5 font-bold"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Canceling Subscription */}
      {confirmCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121212] border border-rose-500/40 rounded-sm p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-base font-serif font-bold">Cancel Subscription?</h4>
            </div>
            <p className="text-xs text-[#F5F5F0]/70 font-light leading-relaxed">
              Canceling will immediately revert your organization to <strong>The Foundation (Commons)</strong> tier. You will maintain full open-access to public research, but advanced features like <strong>Project-OS</strong>, <strong>Decision Room</strong>, and high-frequency IoT streaming will be locked.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setConfirmCancelModal(false)}
                className="px-4 py-2 rounded text-xs font-mono bg-white/10 hover:bg-white/20 text-[#F5F5F0] transition-colors cursor-pointer"
              >
                Keep Active Plan
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded text-xs font-mono bg-rose-950 hover:bg-rose-900 border border-rose-500/50 text-rose-200 transition-colors cursor-pointer font-bold"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
