import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  Leaf,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Download,
  AlertCircle,
  RefreshCw,
  Zap,
  Info,
  AlertTriangle,
  FileText,
  Headphones,
  Send,
  History,
  CheckCheck,
  Key
} from 'lucide-react';
import {
  SubscriptionTier,
  BillingCycle,
  PaymentMethodType,
  ATLAS_TIERS,
  activateSubscription,
  PaymentRecord,
  getCurrentSubscription,
  calculateProration,
  ProrationDetails
} from '../../lib/subscriptionManager';
import { audioFeedback } from '../../lib/audioFeedback';
import { generateSubscriptionPdfInvoice } from '../../lib/pdfInvoiceGenerator';

interface TransactionAttempt {
  id: string;
  timestamp: string;
  method: PaymentMethodType;
  status: 'failed' | 'success' | 'retrying';
  errorCode?: string;
  errorMessage: string;
  remedyAdvice?: string;
}

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: SubscriptionTier;
  onSuccess?: (record: PaymentRecord) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  initialTier = 'studio',
  onSuccess
}) => {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(
    initialTier === 'foundation' ? 'studio' : initialTier
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit_card');

  // Credit Card Form State
  const [cardName, setCardName] = useState('Elena Vance - Bioregional Steward');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('892');
  const [cardZip, setCardZip] = useState('94107');

  // Crypto / Web3 State
  const [cryptoCurrency, setCryptoCurrency] = useState<'USDC' | 'ETH' | 'CELO' | 'SOL'>('USDC');
  const [cryptoTxHash, setCryptoTxHash] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Bank Wire State
  const [orgName, setOrgName] = useState('Cascadia Bioregional Cooperative');
  const [billingEmail, setBillingEmail] = useState('finance@cascadiabio.org');
  const [taxId, setTaxId] = useState('US-EIN-94-3829104');
  const [purchaseOrder, setPurchaseOrder] = useState('PO-2026-BIO-009');

  // Ecological Impact Offset State
  const [creditType, setCreditType] = useState<'biochar' | 'soil_carbon' | 'agroforestry'>('biochar');
  const [merkleAttestationId, setMerkleAttestationId] = useState('MRK-77B-CARB-VERIFIED-2026');

  // Processing & Confirmation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [completedRecord, setCompletedRecord] = useState<PaymentRecord | null>(null);
  const [hasAutoDownloadedPdf, setHasAutoDownloadedPdf] = useState(false);

  // Web3 Wallet & Cryptographic Signature State
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [walletSignature, setWalletSignature] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [isWalletVerified, setIsWalletVerified] = useState(false);

  // Transaction State History & Retry Logic State
  const [attempts, setAttempts] = useState<TransactionAttempt[]>([]);
  const [paymentError, setPaymentError] = useState<{
    code: string;
    message: string;
    remedy: string;
  } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);

  // Bank Wire & Settlement Support Fallback State
  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [supportTicketId, setSupportTicketId] = useState('');
  const [supportForm, setSupportForm] = useState({
    org: 'Cascadia Bioregional Cooperative',
    email: 'finance@cascadiabio.org',
    poOrRef: 'PO-2026-BIO-009',
    priority: 'urgent_wire',
    message: 'Institutional settlement inquiry regarding bank wire routing confirmation or invoice customization.'
  });

  if (!isOpen) return null;

  const currentSub = getCurrentSubscription();
  const tierDef = ATLAS_TIERS[selectedTier];
  const unitPrice = billingCycle === 'annual' ? tierDef.annualPrice : tierDef.monthlyPrice;
  const totalPrice = billingCycle === 'annual' ? tierDef.annualPrice * 12 : tierDef.monthlyPrice;

  // Prorated Billing Calculation
  const proration: ProrationDetails = calculateProration({
    currentTier: currentSub.currentTier,
    newTier: selectedTier,
    billingCycle,
    renewsAt: currentSub.renewsAt
  });
  const isProratedUpgrade = proration.isUpgrade && proration.unusedCreditUsd > 0;
  const finalAmountDue = isProratedUpgrade ? proration.proratedAmountDueUsd : totalPrice;

  // Crypto deposit address
  const cryptoDepositAddress = '0x8B321945a05bEF580B810cEc9948D4bE761a2026';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(cryptoDepositAddress);
    setCopiedAddress(true);
    audioFeedback.play('softClick');
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleConnectWallet = () => {
    audioFeedback.play('softClick');
    setIsWalletConnected(true);
    const mockAddr = '0x71C849B' + Math.random().toString(16).substring(2, 6) + '...3B19';
    setConnectedAccount(mockAddr);
    setCryptoTxHash(`0x${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}`);
  };

  const handleSignChallenge = () => {
    if (!connectedAccount) return;
    setIsSigning(true);
    audioFeedback.play('softClick');
    setTimeout(() => {
      const mockSig = `0x${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}4c8f2a1b09`;
      setWalletSignature(mockSig);
      setIsWalletVerified(true);
      setIsSigning(false);
      audioFeedback.play('success');
    }, 700);
  };

  const handleFillTestCard = () => {
    setCardName('Elena Vance - Cascadia Steward');
    setCardNumber('4242 8899 7711 4242');
    setCardExpiry('12/29');
    setCardCvc('991');
    setCardZip('97201');
    audioFeedback.play('softClick');
  };

  const handleSubmitPayment = (e?: React.FormEvent, isRetry = false) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);
    audioFeedback.play('commandOpen');

    // If retry, update history
    if (isRetry && attempts.length > 0) {
      setAttempts(prev => [
        {
          id: `att_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          method: paymentMethod,
          status: 'retrying',
          errorMessage: 'Initiating re-authorization attempt with refreshed credentials...'
        },
        ...prev
      ]);
    }

    // Stage 1: Handshake
    if (paymentMethod === 'credit_card') {
      setProcessingStage('1/3: Tokenizing payment credentials via PCI-DSS TLS 1.3...');
    } else if (paymentMethod === 'crypto_web3') {
      setProcessingStage(`1/3: Broadcasting signed ${cryptoCurrency} transaction to Base/EVM mempool...`);
    } else if (paymentMethod === 'bank_wire') {
      setProcessingStage('1/3: Verifying institutional legal entity & FedWire ABA routing...');
    } else {
      setProcessingStage('1/3: Verifying Merkle attestation on Proof-of-Regeneration ledger...');
    }

    setTimeout(() => {
      // Stage 2: Authorization / Verification
      if (paymentMethod === 'credit_card') {
        setProcessingStage('2/3: Simulating 3D Secure 2.0 biometric authorization...');
      } else if (paymentMethod === 'crypto_web3') {
        setProcessingStage('2/3: Verifying EIP-712 signature & awaiting mempool confirmation...');
      } else if (paymentMethod === 'bank_wire') {
        setProcessingStage('2/3: Generating pro-forma Net-30 invoice and escrow contract...');
      } else {
        setProcessingStage('2/3: Burning verified carbon removal attestation credits...');
      }

      setTimeout(() => {
        // Check for simulated failure or retry testing
        if (simulateFailure && !isRetry) {
          setIsProcessing(false);
          setProcessingStage('');
          audioFeedback.play('warning');

          const code = paymentMethod === 'bank_wire'
            ? 'ERR_WIRE_ROUTING_UNRESOLVED'
            : paymentMethod === 'crypto_web3'
            ? 'ERR_BASE_MEMPOOL_GAS_STALL'
            : 'ERR_3DS_BIOMETRIC_DECLINED';

          const msg = paymentMethod === 'bank_wire'
            ? 'Automated FedWire routing verification timed out. Bank intermediary requires Net-30 purchase order manual confirmation.'
            : paymentMethod === 'crypto_web3'
            ? 'Mempool congestion on Base L2: Gas fee spike exceeded standard limit.'
            : 'Payment authorization declined: 3D Secure biometric confirmation challenge timed out.';

          const remedy = paymentMethod === 'bank_wire'
            ? 'Use the Contact Settlement Support fallback below for immediate Net-30 manual clearance and direct SWIFT instructions.'
            : paymentMethod === 'crypto_web3'
            ? 'Sign the Web3 cryptographic challenge above or retry with default priority gas.'
            : 'Check that international online transactions are enabled, or retry authorization with your security token.';

          setPaymentError({ code, message: msg, remedy });
          setAttempts(prev => [
            {
              id: `att_${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              method: paymentMethod,
              status: 'failed',
              errorCode: code,
              errorMessage: msg,
              remedyAdvice: remedy
            },
            ...prev
          ]);
          return;
        }

        // Stage 3: Provisioning License Key
        setProcessingStage('3/3: Provisioning cryptographic capacity license key...');

        setTimeout(() => {
          let summary = '';
          if (paymentMethod === 'credit_card') {
            const last4 = cardNumber.replace(/\D/g, '').slice(-4) || '4242';
            summary = `Credit Card (Visa •••• ${last4})`;
          } else if (paymentMethod === 'crypto_web3') {
            summary = `${cryptoCurrency} (Low-Carbon Base / ReFi)`;
          } else if (paymentMethod === 'bank_wire') {
            summary = `Net-30 Wire (${orgName})`;
          } else {
            summary = `Proof-of-Regeneration (${creditType} offset)`;
          }

          const record = activateSubscription({
            tier: selectedTier,
            billingCycle,
            paymentMethod,
            paymentSummary: summary,
            organizationName: orgName,
            billingEmail,
            txHash: cryptoTxHash || `0x${Math.random().toString(16).substring(2, 16)}`,
            proratedCreditUsd: isProratedUpgrade ? proration.unusedCreditUsd : 0,
            walletAddress: connectedAccount || undefined,
            walletSignature: walletSignature || undefined
          });

          // Log success in attempt history
          setAttempts(prev => [
            {
              id: `att_${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              method: paymentMethod,
              status: 'success',
              errorMessage: `Authorization successful. Active License: ${record.licenseKey}`
            },
            ...prev
          ]);

          setIsProcessing(false);
          setProcessingStage('');
          setCompletedRecord(record);
          audioFeedback.play('success');

          // Automatically generate and trigger download of the official PDF invoice
          try {
            generateSubscriptionPdfInvoice(record, true);
            setHasAutoDownloadedPdf(true);
          } catch (pdfErr) {
            console.warn('[CheckoutModal] Auto PDF download error:', pdfErr);
          }

          if (onSuccess) {
            onSuccess(record);
          }
        }, 600);
      }, 700);
    }, 600);
  };

  const handleRetryPayment = () => {
    audioFeedback.play('softClick');
    handleSubmitPayment(undefined, true);
  };

  const handleSubmitSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    audioFeedback.play('success');
    const ticketId = `ESC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSupportTicketId(ticketId);
    setSupportSubmitted(true);
  };

  const handleDownloadInvoice = () => {
    if (!completedRecord) return;
    try {
      generateSubscriptionPdfInvoice(completedRecord, true);
      audioFeedback.play('softClick');
    } catch (err) {
      console.warn('[CheckoutModal] PDF manual download error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0C0C0C] border border-[#C5A059]/40 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#F5F5F0]/10 bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-serif font-bold text-[#F5F5F0] flex items-center gap-2">
                <span>Atlas Economic Gateway</span>
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30">
                  Non-Extractive Protocol
                </span>
              </h2>
              <p className="text-[11px] font-mono text-[#F5F5F0]/60">
                Secure settlement for institutional capability and planetary coordination
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audioFeedback.play('softClick');
              onClose();
            }}
            className="p-1.5 text-[#F5F5F0]/50 hover:text-white hover:bg-white/10 rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {completedRecord ? (
          /* ========================================================================= */
          /* SUCCESS STATE */
          /* ========================================================================= */
          <div className="p-6 sm:p-10 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1B3022] border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                PAYMENT CONFIRMED & ACCESS PROVISIONED
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#F5F5F0]">
                Welcome to {tierDef.name}
              </h3>
              <p className="text-xs text-[#F5F5F0]/70 font-light">
                Your cryptographic credentials have been authorized. All offerings and views associated with this tier are now unlocked and active in your workspace.
              </p>
            </div>

            {/* License Key & Receipt Box */}
            <div className="max-w-xl mx-auto p-4 sm:p-5 rounded-sm bg-[#121212] border border-[#C5A059]/30 text-left font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2.5">
                <span className="text-[#F5F5F0]/50 uppercase text-[10px]">Active License Key</span>
                <span className="text-[#C5A059] font-bold text-sm select-all">{completedRecord.licenseKey}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-[#F5F5F0]/50 block text-[10px]">INVOICE ID</span>
                  <span className="text-[#F5F5F0] font-bold">{completedRecord.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-[#F5F5F0]/50 block text-[10px]">AMOUNT SETTLED</span>
                  <span className="text-emerald-400 font-bold">${completedRecord.amountUsd.toLocaleString()} USD</span>
                </div>
                <div>
                  <span className="text-[#F5F5F0]/50 block text-[10px]">METHOD</span>
                  <span className="text-[#F5F5F0]">{completedRecord.paymentMethodSummary}</span>
                </div>
                <div>
                  <span className="text-[#F5F5F0]/50 block text-[10px]">VALID THROUGH</span>
                  <span className="text-[#F5F5F0]">{new Date(completedRecord.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>

              {hasAutoDownloadedPdf && (
                <div className="flex items-center justify-center gap-2 pt-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded p-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Official PDF Invoice automatically generated and downloaded to your downloads folder.</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  audioFeedback.play('commandOpen');
                  onClose();
                }}
                className="px-6 py-3 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider rounded-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105"
              >
                <span>Launch Unlocked Suite</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleDownloadInvoice}
                className="px-5 py-3 bg-[#1A1A1A] hover:bg-[#252525] border border-[#F5F5F0]/20 text-[#F5F5F0] font-mono text-xs rounded-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#C5A059]" />
                <span>Re-Download PDF Invoice</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* CHECKOUT FORM */
          /* ========================================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#F5F5F0]/10">
            
            {/* Left Column: Tier Selection & Offerings Overview */}
            <div className="lg:col-span-5 p-5 sm:p-6 bg-[#0E0E0E] space-y-5">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                  STEP 1: SELECT CAPACITY TIER
                </span>
                <div className="space-y-2">
                  {(['studio', 'intelligence', 'enterprise'] as SubscriptionTier[]).map((tierKey) => {
                    const tier = ATLAS_TIERS[tierKey];
                    const isSelected = selectedTier === tierKey;
                    return (
                      <button
                        key={tierKey}
                        type="button"
                        onClick={() => {
                          audioFeedback.play('softClick');
                          setSelectedTier(tierKey);
                        }}
                        className={`w-full p-3.5 rounded-sm text-left border transition-all cursor-pointer flex items-start justify-between ${
                          isSelected
                            ? 'bg-[#1B3022] border-[#C5A059] shadow-md'
                            : 'bg-[#141414] border-[#F5F5F0]/10 hover:border-[#C5A059]/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#F5F5F0]">{tier.name}</span>
                            {tierKey === 'intelligence' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#C5A059] text-black font-bold">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#F5F5F0]/60 line-clamp-1">{tier.tagline}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-bold text-[#C5A059]">
                            {tierKey === 'enterprise' ? 'Custom' : `$${tier.monthlyPrice}`}
                          </span>
                          <span className="text-[10px] text-[#F5F5F0]/40 block font-mono">/mo</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="pt-2">
                <div className="flex items-center justify-between p-1 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm">
                  <button
                    type="button"
                    onClick={() => {
                      audioFeedback.play('softClick');
                      setBillingCycle('monthly');
                    }}
                    className={`flex-1 py-1.5 text-xs font-mono text-center rounded-sm transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-[#C5A059] text-black font-bold shadow'
                        : 'text-[#F5F5F0]/60 hover:text-white'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      audioFeedback.play('softClick');
                      setBillingCycle('annual');
                    }}
                    className={`flex-1 py-1.5 text-xs font-mono text-center rounded-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      billingCycle === 'annual'
                        ? 'bg-[#C5A059] text-black font-bold shadow'
                        : 'text-[#F5F5F0]/60 hover:text-white'
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="text-[9px] px-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold">
                      -20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Offerings Included in Selected Tier */}
              <div className="pt-3 border-t border-[#F5F5F0]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A059] font-bold">
                    Included in {tierDef.name}:
                  </span>
                  <span className="text-[10px] text-[#F5F5F0]/40 font-mono">
                    {tierDef.offerings.length} modules
                  </span>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 text-xs scrollbar-thin">
                  {tierDef.offerings.map((offering) => (
                    <div
                      key={offering.id}
                      className="p-2 rounded bg-black/40 border border-white/5 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#F5F5F0] text-[11px] block">{offering.name}</span>
                        <p className="text-[10px] text-[#F5F5F0]/60 font-light leading-tight">{offering.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reinvestment Note */}
              <div className="p-2.5 rounded bg-[#1B3022]/40 border border-[#C5A059]/20 text-[10px] text-[#F5F5F0]/70 flex items-start gap-2">
                <Info className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>
                  100% of network fees flow into community-governed sensor subsidies and open research commons.
                </span>
              </div>
            </div>

            {/* Right Column: Multiple Payment Methods & Execution */}
            <div className="lg:col-span-7 p-5 sm:p-6 bg-[#0C0C0C] space-y-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block mb-2">
                  STEP 2: CHOOSE PAYMENT METHOD
                </span>

                {/* 4 Payment Method Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'credit_card', label: 'Credit Card', icon: CreditCard, badge: 'Instant' },
                    { id: 'crypto_web3', label: 'Crypto / Web3', icon: QrCode, badge: 'USDC/ETH' },
                    { id: 'bank_wire', label: 'Bank / ACH', icon: Building2, badge: 'Net-30' },
                    { id: 'regeneration_credits', label: 'Impact Offset', icon: Leaf, badge: 'ReFi' }
                  ].map((method) => {
                    const Icon = method.icon;
                    const isActive = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => {
                          audioFeedback.play('softClick');
                          setPaymentMethod(method.id as PaymentMethodType);
                        }}
                        className={`p-2.5 rounded-sm text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isActive
                            ? 'bg-[#1B3022] border-[#C5A059] text-white shadow'
                            : 'bg-[#121212] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:border-[#C5A059]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A059]' : 'text-white/60'}`} />
                          <span className="text-[8px] font-mono px-1 rounded bg-black/40 text-[#C5A059]">
                            {method.badge}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold line-clamp-1">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Payment Form Based on Method */}
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                
                {/* 1. CREDIT / DEBIT CARD */}
                {paymentMethod === 'credit_card' && (
                  <div className="p-4 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <span className="text-[11px] text-[#F5F5F0] font-bold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        Cardholder Details
                      </span>
                      <button
                        type="button"
                        onClick={handleFillTestCard}
                        className="text-[10px] text-[#C5A059] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Fill Test Card</span>
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">NAME ON CARD</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-[#F5F5F0] text-xs focus:border-[#C5A059] focus:outline-none"
                        placeholder="Full Name"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">CARD NUMBER</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-[#F5F5F0] text-xs focus:border-[#C5A059] focus:outline-none pr-16"
                          placeholder="4242 4242 4242 4242"
                        />
                        <span className="absolute right-3 top-2 text-[10px] text-[#C5A059] font-bold">VISA/MC</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">EXPIRY</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                          className="w-full px-2.5 py-2 rounded bg-black/60 border border-white/10 text-[#F5F5F0] text-xs focus:border-[#C5A059] focus:outline-none"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          required
                          className="w-full px-2.5 py-2 rounded bg-black/60 border border-white/10 text-[#F5F5F0] text-xs focus:border-[#C5A059] focus:outline-none"
                          placeholder="123"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">ZIP / POSTAL</label>
                        <input
                          type="text"
                          value={cardZip}
                          onChange={(e) => setCardZip(e.target.value)}
                          required
                          className="w-full px-2.5 py-2 rounded bg-black/60 border border-white/10 text-[#F5F5F0] text-xs focus:border-[#C5A059] focus:outline-none"
                          placeholder="94107"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CRYPTOCURRENCY & WEB3 */}
                {paymentMethod === 'crypto_web3' && (
                  <div className="p-4 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <span className="text-[11px] text-[#F5F5F0] font-bold">Select Token & Network</span>
                      <span className="text-[10px] text-emerald-400">Low-Carbon Base / ReFi</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {(['USDC', 'ETH', 'CELO', 'SOL'] as const).map((token) => (
                        <button
                          key={token}
                          type="button"
                          onClick={() => {
                            audioFeedback.play('softClick');
                            setCryptoCurrency(token);
                          }}
                          className={`p-2 rounded text-center border transition-all cursor-pointer ${
                            cryptoCurrency === token
                              ? 'bg-[#C5A059] text-black font-bold'
                              : 'bg-black/50 border-white/10 text-[#F5F5F0]/70'
                          }`}
                        >
                          {token}
                        </button>
                      ))}
                    </div>

                    {/* Web3 Wallet Connect Simulation & Cryptographic Signature Flow */}
                    <div className="p-3 rounded bg-black/80 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#F5F5F0]/60">BROWSER WEB3 WALLET</span>
                        {isWalletConnected ? (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Connected: {connectedAccount}
                          </span>
                        ) : (
                          <span className="text-[9px] text-[#F5F5F0]/40">No wallet bound</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleConnectWallet}
                          className={`flex-1 py-2 px-3 rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            isWalletConnected
                              ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/40'
                              : 'bg-[#1A1A1A] hover:bg-[#252525] text-[#C5A059] border border-[#C5A059]/40'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{isWalletConnected ? 'Wallet Synchronized (Base)' : 'Connect Web3 Wallet (MetaMask / Coinbase / Phantom)'}</span>
                        </button>
                      </div>

                      {/* Web3 Cryptographic Signature Verification Challenge */}
                      {isWalletConnected && (
                        <div className="p-3 rounded bg-black/90 border border-emerald-500/40 space-y-2 mt-2">
                          <div className="flex items-center justify-between text-emerald-400 font-bold text-[10px]">
                            <span className="flex items-center gap-1.5">
                              <Key className="w-3.5 h-3.5 text-[#C5A059]" />
                              <span>Cryptographic Signature Request (EIP-712)</span>
                            </span>
                            {isWalletVerified ? (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[9px] flex items-center gap-1 font-bold">
                                <CheckCheck className="w-3 h-3 text-emerald-400" />
                                Signature Verified &amp; Linked
                              </span>
                            ) : (
                              <span className="text-amber-400 text-[9px] animate-pulse">Signature Required</span>
                            )}
                          </div>

                          <div className="p-2 rounded bg-black/70 border border-white/10 text-[10px] text-[#F5F5F0]/70 space-y-0.5">
                            <div><span className="text-white/40">Domain:</span> Atlas Sanctum Sovereign Protocol</div>
                            <div><span className="text-white/40">Signer:</span> <span className="font-mono text-emerald-300">{connectedAccount}</span></div>
                            <div><span className="text-white/40">Tier Granted:</span> {tierDef.name}</div>
                            <div><span className="text-white/40">Capability:</span> Decentralized Sovereign Access Rights &amp; Merkle Attestation</div>
                          </div>

                          {!isWalletVerified ? (
                            <button
                              type="button"
                              onClick={handleSignChallenge}
                              disabled={isSigning}
                              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-50"
                            >
                              {isSigning ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Requesting Signature from Wallet...</span>
                                </>
                              ) : (
                                <>
                                  <Key className="w-3.5 h-3.5" />
                                  <span>Sign Authentication Challenge to Bind Wallet</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-300 flex items-center justify-between">
                              <span className="truncate max-w-[280px]">Sig: {walletSignature}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-200">Decentralized Rights Active</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Deposit Address Box */}
                    <div className="p-3 rounded bg-black/80 border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#F5F5F0]/50">ATLAS SANCTUM DEPOSIT ADDRESS</span>
                        <span className="text-[10px] text-[#C5A059]">Network: Base / EVM</span>
                      </div>
                      <div className="flex items-center justify-between bg-black/90 p-2 rounded border border-white/5">
                        <span className="text-[11px] text-emerald-400 truncate max-w-[280px]">
                          {cryptoDepositAddress}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyAddress}
                          className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[#F5F5F0] text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedAddress ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">TRANSACTION HASH (OPTIONAL)</label>
                      <input
                        type="text"
                        value={cryptoTxHash}
                        onChange={(e) => setCryptoTxHash(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-[#F5F5F0] text-xs focus:border-[#C5A059] focus:outline-none"
                        placeholder="0x4f8a... or leave blank for instant simulation"
                      />
                    </div>
                  </div>
                )}

                {/* 3. INSTITUTIONAL BANK WIRE / ACH */}
                {paymentMethod === 'bank_wire' && (
                  <div className="p-4 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <span className="text-[11px] text-[#F5F5F0] font-bold">Institutional Purchase Order (Net-30)</span>
                      <span className="text-[10px] text-[#C5A059]">ACH / Swift / FedWire</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">ORGANIZATION NAME</label>
                        <input
                          type="text"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-[#F5F5F0] text-xs focus:border-[#C5A059] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">BILLING EMAIL</label>
                        <input
                          type="email"
                          value={billingEmail}
                          onChange={(e) => setBillingEmail(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-[#F5F5F0] text-xs focus:border-[#C5A059] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">TAX ID / VAT</label>
                        <input
                          type="text"
                          value={taxId}
                          onChange={(e) => setTaxId(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-[#F5F5F0] text-xs focus:border-[#C5A059] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">PURCHASE ORDER #</label>
                        <input
                          type="text"
                          value={purchaseOrder}
                          onChange={(e) => setPurchaseOrder(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-[#F5F5F0] text-xs focus:border-[#C5A059] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-black/60 border border-white/5 text-[10px] text-[#F5F5F0]/60 space-y-1">
                      <div className="flex justify-between">
                        <span>Wire Routing: <strong>021000021</strong> (FedWire)</span>
                        <span>Swift: <strong>ATLSUS33XXX</strong></span>
                      </div>
                      <p>Instant license key issued upon submission; payment due within 30 days.</p>
                    </div>

                    {/* Bank Wire Support Fallback Trigger */}
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="text-[#F5F5F0]/50">Need custom wire paperwork or manual clearing?</span>
                      <button
                        type="button"
                        onClick={() => {
                          audioFeedback.play('softClick');
                          setSupportDrawerOpen(true);
                        }}
                        className="text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Headphones className="w-3 h-3" />
                        <span>Contact Support Fallback</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. PROOF-OF-REGENERATION ECOLOGICAL OFFSET */}
                {paymentMethod === 'regeneration_credits' && (
                  <div className="p-4 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-white/5">
                      <span className="text-[11px] text-[#F5F5F0] font-bold">Seven Capitals Offset Settlement</span>
                      <span className="text-[10px] text-emerald-400">100% In-Kind ReFi</span>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">VERIFIED CREDIT CLASS</label>
                      <select
                        value={creditType}
                        onChange={(e) => setCreditType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-[#F5F5F0] text-xs focus:border-[#C5A059] focus:outline-none"
                      >
                        <option value="biochar">Durable Biochar Carbon Removal ($25/tCO2e)</option>
                        <option value="soil_carbon">Regenerative Soil Organic Carbon ($30/tCO2e)</option>
                        <option value="agroforestry">Living Agroforestry Biodiversity Credits ($40/unit)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">EVIDENCE MERKLE ATTESTATION ID</label>
                      <input
                        type="text"
                        value={merkleAttestationId}
                        onChange={(e) => setMerkleAttestationId(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-[#F5F5F0] text-xs focus:border-[#C5A059] focus:outline-none"
                      />
                    </div>

                    <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-[10px] text-emerald-300">
                      Offset calculation: {(finalAmountDue / 25).toFixed(0)} tCO2e verified removal credits required for {tierDef.name}.
                    </div>
                  </div>
                )}

                {/* Prorated Billing & Order Summary Line */}
                <div className="p-3.5 rounded-sm bg-[#141414] border border-[#C5A059]/30 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-[#F5F5F0]/70">
                    <span>{tierDef.name} ({billingCycle})</span>
                    <span>${totalPrice.toLocaleString()} USD</span>
                  </div>

                  {/* Automated Proration Adjustment Line */}
                  {isProratedUpgrade && (
                    <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 space-y-1 text-[11px]">
                      <div className="flex justify-between text-emerald-300 font-bold">
                        <span className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Prorated Upgrade Credit ({proration.daysRemaining} days remaining in cycle)</span>
                        </span>
                        <span>-${proration.unusedCreditUsd.toFixed(2)} USD</span>
                      </div>
                      <p className="text-[10px] text-emerald-200/70 font-light">
                        Credit automatically transferred from your active {ATLAS_TIERS[proration.previousTier].name} plan. State updates instantaneously upon authorization.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between text-[#F5F5F0]/50 text-[11px]">
                    <span>Commons Protocol Fee</span>
                    <span className="text-emerald-400">$0.00 (Waived)</span>
                  </div>
                  
                  <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-[#F5F5F0]">
                    <span>Total Due Today</span>
                    <span className="text-[#C5A059]">${finalAmountDue.toLocaleString()} USD</span>
                  </div>
                </div>

                {/* TROUBLESHOOTING & RETRY LOGIC ALERT BOX */}
                {paymentError && (
                  <div className="p-3.5 rounded-sm bg-rose-950/70 border border-rose-500/70 font-mono text-xs space-y-2.5">
                    <div className="flex items-center justify-between text-rose-300 font-bold text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>Authorization Failed ({paymentError.code})</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-200 border border-rose-500/30">
                        Troubleshooting Available
                      </span>
                    </div>

                    <p className="text-[11px] text-white/90 leading-relaxed">{paymentError.message}</p>

                    <div className="p-2.5 rounded bg-black/70 border border-rose-500/30 text-[11px] text-rose-200 space-y-1">
                      <div className="font-bold text-[#C5A059] flex items-center gap-1">
                        <Info className="w-3 h-3 text-[#C5A059]" />
                        <span>Immediate Remedy:</span>
                      </div>
                      <p className="text-[#F5F5F0]/80 font-light">{paymentError.remedy}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleRetryPayment}
                        className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry Transaction</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          audioFeedback.play('softClick');
                          setSupportDrawerOpen(true);
                        }}
                        className="py-2 px-3 bg-white/10 hover:bg-white/20 text-[#F5F5F0] text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Headphones className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Contact Support</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TRANSACTION ATTEMPTS HISTORY TOGGLE */}
                {attempts.length > 0 && (
                  <div className="pt-1 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setShowHistory(!showHistory)}
                      className="text-[10px] font-mono text-[#F5F5F0]/60 hover:text-[#C5A059] flex items-center gap-1.5 cursor-pointer"
                    >
                      <History className="w-3 h-3 text-[#C5A059]" />
                      <span>{showHistory ? 'Hide' : 'View'} Transaction Attempt History ({attempts.length} attempts)</span>
                    </button>

                    {showHistory && (
                      <div className="mt-2 p-2.5 rounded bg-black/80 border border-white/10 space-y-2 max-h-36 overflow-y-auto text-[10px] font-mono">
                        {attempts.map((att) => (
                          <div
                            key={att.id}
                            className={`p-2 rounded border flex items-start justify-between gap-2 ${
                              att.status === 'failed'
                                ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                                : att.status === 'success'
                                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                                : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                            }`}
                          >
                            <div>
                              <div className="font-bold flex items-center gap-1.5">
                                <span>[{att.timestamp}]</span>
                                <span className="uppercase">{att.method}</span>
                                <span>- {att.status.toUpperCase()}</span>
                              </div>
                              <div className="text-white/70">{att.errorMessage}</div>
                              {att.remedyAdvice && (
                                <div className="text-[#C5A059] text-[9px] mt-0.5">Remedy: {att.remedyAdvice}</div>
                              )}
                            </div>
                            <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-black/50">
                              {att.errorCode || att.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Active Multi-Stage Verification Banner */}
                {isProcessing && (
                  <div className="p-3 rounded bg-[#1B3022]/80 border border-[#C5A059] font-mono text-xs space-y-1.5 animate-pulse">
                    <div className="flex items-center justify-between text-[#C5A059] font-bold text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sovereign Settlement Engine</span>
                      </span>
                      <span className="text-[10px] text-white/70">Cryptographic Handshake</span>
                    </div>
                    <p className="text-[11px] text-emerald-300 font-mono">
                      {processingStage}
                    </p>
                    <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#C5A059] h-full animate-progress" />
                    </div>
                  </div>
                )}

                {/* Developer Simulation Toggle for Failure/Retry Evaluation */}
                <div className="flex items-center justify-between px-2 py-1 bg-black/40 rounded border border-white/5 text-[10px] font-mono text-[#F5F5F0]/50">
                  <span className="flex items-center gap-1">
                    <Info className="w-3 h-3 text-[#C5A059]" />
                    <span>Test Retry &amp; Troubleshooting Mode</span>
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulateFailure}
                      onChange={(e) => setSimulateFailure(e.target.checked)}
                      className="rounded accent-[#C5A059]"
                    />
                    <span className={simulateFailure ? 'text-rose-400 font-bold' : 'text-white/60'}>
                      Simulate Rejection
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-3.5 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Settlement...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm &amp; Authorize ${finalAmountDue.toLocaleString()}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      audioFeedback.play('softClick');
                      onClose();
                    }}
                    className="px-4 py-3.5 bg-white/5 hover:bg-white/10 text-[#F5F5F0]/70 hover:text-white font-mono text-xs rounded-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CONTACT SUPPORT FALLBACK DRAWER FOR BANK WIRE & PAYMENT TROUBLESHOOTING */}
        {/* ========================================================================= */}
        {supportDrawerOpen && (
          <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-fadeIn">
            <div className="space-y-4 max-w-xl mx-auto w-full">
              <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]/10">
                <div className="flex items-center gap-2 text-[#C5A059]">
                  <Headphones className="w-5 h-5" />
                  <h3 className="font-serif text-lg font-bold text-[#F5F5F0]">
                    Institutional Settlement Support
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSupportDrawerOpen(false)}
                  className="p-1 text-white/60 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!supportSubmitted ? (
                <form onSubmit={handleSubmitSupportTicket} className="space-y-3 font-mono text-xs">
                  <p className="text-[11px] text-[#F5F5F0]/70">
                    Immediate assistance for Bank Wire, ACH, Net-30 purchase orders, or payment gateway exceptions.
                  </p>

                  <div>
                    <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">ORGANIZATION</label>
                    <input
                      type="text"
                      value={supportForm.org}
                      onChange={(e) => setSupportForm({ ...supportForm, org: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded bg-black/70 border border-white/10 text-white text-xs focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">CONTACT EMAIL</label>
                      <input
                        type="email"
                        value={supportForm.email}
                        onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded bg-black/70 border border-white/10 text-white text-xs focus:border-[#C5A059] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">PO / WIRE REF #</label>
                      <input
                        type="text"
                        value={supportForm.poOrRef}
                        onChange={(e) => setSupportForm({ ...supportForm, poOrRef: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-black/70 border border-white/10 text-white text-xs focus:border-[#C5A059] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">PRIORITY</label>
                    <select
                      value={supportForm.priority}
                      onChange={(e) => setSupportForm({ ...supportForm, priority: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-black/70 border border-white/10 text-white text-xs focus:border-[#C5A059] focus:outline-none"
                    >
                      <option value="urgent_wire">Urgent Bank Wire Clearance (Institutional SLA)</option>
                      <option value="net30_escrow">Net-30 Invoice / Escrow Customization</option>
                      <option value="card_exception">3D Secure / Card Gateway Dispute</option>
                      <option value="crypto_mempool">EVM Mempool Nonce / Gas Assistance</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#F5F5F0]/50 block mb-1">DETAILS &amp; NOTES</label>
                    <textarea
                      rows={3}
                      value={supportForm.message}
                      onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-black/70 border border-white/10 text-white text-xs focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div className="p-2.5 rounded bg-[#1B3022]/40 border border-[#C5A059]/30 text-[10px] text-[#C5A059] space-y-0.5">
                    <div>Direct Treasury Phone: +1 (800) 285-2773</div>
                    <div>Direct Escrow Email: treasury@atlassanctum.org</div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Priority Escalation Ticket</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSupportDrawerOpen(false)}
                      className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 text-center space-y-4 font-mono">
                  <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#F5F5F0]">Priority Ticket Issued</h4>
                    <p className="text-xs text-[#C5A059]">Ticket Ref: {supportTicketId}</p>
                    <p className="text-[11px] text-[#F5F5F0]/60">
                      Our institutional treasury desk has received your request and will reach out within 15 minutes to clear your settlement.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSupportSubmitted(false);
                      setSupportDrawerOpen(false);
                    }}
                    className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs rounded cursor-pointer"
                  >
                    Return to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
