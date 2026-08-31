import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Wallet, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  LogOut, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  FileCheck, 
  Terminal,
  Zap
} from 'lucide-react';
import { useWeb3Wallet } from '../../context/Web3WalletContext';
import { audioFeedback } from '../../lib/audioFeedback';

export const Web3WalletManager: React.FC = () => {
  const {
    address,
    chainId,
    walletType,
    isConnected,
    isConnecting,
    error,
    did,
    hasMetaMask,
    connectMetaMaskWallet,
    connectSovereignKeypair,
    disconnectWallet,
    signClaimData,
    clearError
  } = useWeb3Wallet();

  const [copied, setCopied] = useState(false);
  const [testSigning, setTestSigning] = useState(false);
  const [testSignature, setTestSignature] = useState<{ signature: string; timestamp: string; hash: string } | null>(null);

  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    audioFeedback.playSubtleClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestSign = async () => {
    setTestSigning(true);
    audioFeedback.playSubtleClick();
    try {
      const res = await signClaimData(
        'Bioregional Restorative Stewardship Proof',
        'Payload: Hectares: 120, Carbon Seq: 420t, Bio-Index: 0.94'
      );
      setTestSignature(res);
      audioFeedback.playSuccessChime();
    } catch (err: any) {
      console.error('Test signing failed:', err);
    } finally {
      setTestSigning(false);
    }
  };

  return (
    <div className="p-5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-4 text-[#F5F5F0]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#C5A059]" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F5F5F0]">
              Sovereign Identity & Web3 Cryptographic Keys
            </h3>
          </div>
          <p className="text-xs text-[#F5F5F0]/60 mt-0.5">
            Authenticate cryptographic audit logs, sign ecological claims, and hold decentralized stewardship credentials.
          </p>
        </div>

        {isConnected && (
          <button
            onClick={disconnectWallet}
            className="self-start sm:self-auto px-3 py-1.5 bg-[#1C1C1C] hover:bg-rose-950/40 border border-[#F5F5F0]/15 hover:border-rose-800/40 text-xs font-mono text-[#F5F5F0]/80 hover:text-rose-300 rounded transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Disconnect</span>
          </button>
        )}
      </div>

      {/* Error / Diagnostic Notice with Instant Fallback */}
      {error && (
        <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-sm space-y-2 text-xs font-mono animate-fadeIn">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Wallet Notice: {error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-[#F5F5F0]/50 hover:text-[#F5F5F0] text-[10px] uppercase font-mono cursor-pointer"
            >
              Dismiss
            </button>
          </div>
          <p className="text-[#F5F5F0]/70 text-[11px] leading-relaxed">
            If MetaMask is not installed, locked, or restricted in this container preview, you can instantly activate the <strong>Sovereign Atlas Keypair (WebCrypto)</strong> to perform zero-knowledge signing and cryptographic verifications locally without any external dependencies.
          </p>
          <div className="pt-1 flex flex-wrap gap-2">
            <button
              onClick={connectSovereignKeypair}
              className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0A0A0A] font-bold rounded text-[11px] cursor-pointer flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Activate Sovereign Atlas Keypair</span>
            </button>
          </div>
        </div>
      )}

      {/* Connected State Display */}
      {isConnected ? (
        <div className="p-4 bg-[#161616] border border-emerald-500/30 rounded-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800/40 text-[10px] font-mono rounded font-bold uppercase">
                {walletType === 'metamask' ? 'MetaMask Web3 Connected' : 'Sovereign Atlas Keypair Active'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#F5F5F0]/50">
              Chain / Enclave: <strong className="text-[#F5F5F0]">{chainId}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 bg-[#0E0E0E] rounded border border-[#F5F5F0]/10 flex items-center justify-between">
              <div className="truncate pr-2">
                <span className="text-[10px] text-[#F5F5F0]/50 block">Signer Address:</span>
                <span className="font-bold text-[#C5A059] truncate">{address}</span>
              </div>
              <button
                onClick={handleCopyAddress}
                className="p-1.5 bg-[#1C1C1C] hover:bg-[#2A2A2A] border border-[#F5F5F0]/10 rounded text-[#F5F5F0]/70 hover:text-[#F5F5F0] cursor-pointer"
                title="Copy Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-2.5 bg-[#0E0E0E] rounded border border-[#F5F5F0]/10 truncate">
              <span className="text-[10px] text-[#F5F5F0]/50 block">Decentralized ID (DID):</span>
              <span className="text-[#8FB8DE] text-[11px] truncate block">{did}</span>
            </div>
          </div>

          {/* Interactive Test Signing */}
          <div className="pt-2 border-t border-[#F5F5F0]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs">
              <p className="text-[#F5F5F0]/80 font-mono text-[11px]">Cryptographic Proof-of-Impact Verification</p>
              <p className="text-[#F5F5F0]/50 text-[10px]">Test signing an ecological claim to generate verifiable Merkle leaf</p>
            </div>
            <button
              onClick={handleTestSign}
              disabled={testSigning}
              className="px-3 py-1.5 bg-[#1B3022] hover:bg-[#244230] border border-[#2D5A3C] text-emerald-300 text-xs font-mono rounded cursor-pointer transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              {testSigning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileCheck className="w-3.5 h-3.5" />}
              <span>{testSigning ? 'Signing...' : 'Sign Test Verification Proof'}</span>
            </button>
          </div>

          {testSignature && (
            <div className="p-3 bg-[#0E0E0E] border border-emerald-500/20 rounded text-[11px] font-mono space-y-1 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verification Signature Generated Successfully</span>
              </div>
              <p className="text-[#F5F5F0]/70 truncate">Proof Hash: <span className="text-[#C5A059]">{testSignature.hash}</span></p>
              <p className="text-[#F5F5F0]/50 text-[10px]">Timestamp: {testSignature.timestamp}</p>
            </div>
          )}
        </div>
      ) : (
        /* Disconnected Options */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* MetaMask Option */}
          <button
            onClick={connectMetaMaskWallet}
            disabled={isConnecting}
            className="p-4 bg-[#161616] hover:bg-[#1C1C1C] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 rounded-sm text-left transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F5F5F0] group-hover:text-[#C5A059]">
                <Wallet className="w-4 h-4 text-[#C5A059]" />
                <span>Connect MetaMask</span>
              </div>
              <span className={`px-2 py-0.5 text-[9px] font-mono rounded ${hasMetaMask ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-zinc-800 text-zinc-400'}`}>
                {hasMetaMask ? 'Detected' : 'Extension'}
              </span>
            </div>
            <p className="text-[11px] text-[#F5F5F0]/60 leading-relaxed">
              Connect your EIP-1193 Ethereum / EVM wallet for on-chain ecological receipts and public tokenized proofs.
            </p>
          </button>

          {/* Sovereign Local Keypair Option */}
          <button
            onClick={connectSovereignKeypair}
            disabled={isConnecting}
            className="p-4 bg-[#161616] hover:bg-[#1C1C1C] border border-[#2D5A3C]/40 hover:border-emerald-500/60 rounded-sm text-left transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-300 group-hover:text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Sovereign Atlas Keypair</span>
              </div>
              <span className="px-2 py-0.5 bg-[#1B3022] text-emerald-300 border border-[#2D5A3C] text-[9px] font-mono rounded">
                Built-in / Zero-Friction
              </span>
            </div>
            <p className="text-[11px] text-[#F5F5F0]/60 leading-relaxed">
              Hardware & browser-enclave WebCrypto keypair. Zero extensions required; perfectly sovereign and private.
            </p>
          </button>
        </div>
      )}
    </div>
  );
};
