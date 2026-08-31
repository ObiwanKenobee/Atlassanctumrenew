import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ExternalLink, 
  KeyRound,
  FileCheck,
  HelpCircle
} from 'lucide-react';
import { useTrustLayer } from '../../context/TrustLayerContext';
import { audioFeedback } from '../../lib/audioFeedback';

export type VerificationBadgeLevel = 'Unverified' | 'Submitted' | 'Reviewed' | 'Verified' | 'Audited';

interface VerificationStatusBadgeProps {
  status?: VerificationBadgeLevel;
  claimId?: string;
  claimTitle?: string;
  verifier?: string;
  merkleLeaf?: string;
  confidenceScore?: number;
  showDetailsPopover?: boolean;
}

export const VerificationStatusBadge: React.FC<VerificationStatusBadgeProps> = ({
  status = 'Verified',
  claimId = 'CLM-2026-001',
  claimTitle,
  verifier = 'Atlas Sovereign Epistemic Registry & Sentinel Mesh',
  merkleLeaf = '0x89f2a48b9c1d0e3a6f7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
  confidenceScore = 96,
  showDetailsPopover = true
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const resolvedStatus: VerificationBadgeLevel = status;

  const getBadgeStyle = () => {
    switch (resolvedStatus) {
      case 'Audited':
        return {
          container: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'AUDITED & ANCHORED',
          badgeColor: 'emerald'
        };
      case 'Verified':
        return {
          container: 'bg-[#1B3022]/80 text-emerald-400 border-emerald-600/40 hover:bg-[#1B3022]',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'VERIFIED EMPIRICAL',
          badgeColor: 'emerald'
        };
      case 'Reviewed':
        return {
          container: 'bg-blue-950/80 text-[#8FB8DE] border-[#8FB8DE]/40 hover:bg-blue-900',
          icon: <FileCheck className="w-3.5 h-3.5 text-[#8FB8DE]" />,
          label: 'PEER REVIEWED',
          badgeColor: 'blue'
        };
      case 'Submitted':
        return {
          container: 'bg-purple-950/80 text-purple-300 border-purple-500/40 hover:bg-purple-900',
          icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
          label: 'SUBMITTED FOR REVIEW',
          badgeColor: 'purple'
        };
      case 'Unverified':
      default:
        return {
          container: 'bg-amber-950/80 text-amber-300 border-amber-500/40 hover:bg-amber-900',
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
          label: 'UNVERIFIED / ESTIMATED',
          badgeColor: 'amber'
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div className="relative inline-block font-mono">
      <button
        onClick={(e) => {
          e.stopPropagation();
          audioFeedback.playMicroTick();
          if (showDetailsPopover) setShowPopover(!showPopover);
        }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded border transition-all cursor-pointer select-none ${style.container}`}
        title={`Verification Level: ${resolvedStatus}. Click to inspect cryptographic provenance.`}
      >
        {style.icon}
        <span>{style.label}</span>
      </button>

      {/* Interactive Cryptographic Provenance Popover */}
      {showPopover && (
        <div 
          className="absolute z-50 top-full left-0 mt-1.5 w-72 sm:w-80 p-3.5 bg-[#0E0E0E] border border-emerald-500/40 rounded shadow-2xl space-y-2 text-[#F5F5F0] animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <FileCheck className="w-4 h-4" />
              <span>TrustLayer Cryptographic Proof</span>
            </div>
            <span className="text-[10px] text-[#F5F5F0]/50">{claimId}</span>
          </div>

          {claimTitle && (
            <p className="text-xs font-sans text-[#F5F5F0]/90 leading-tight">
              {claimTitle}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 text-[10px] bg-[#141414] p-2 rounded border border-[#F5F5F0]/5">
            <div>
              <span className="text-[#F5F5F0]/50 block">STATUS:</span>
              <span className="font-bold text-emerald-400">{resolvedStatus}</span>
            </div>
            <div>
              <span className="text-[#F5F5F0]/50 block">CONFIDENCE:</span>
              <span className="font-bold text-[#C5A059]">{confidenceScore}%</span>
            </div>
          </div>

          <div className="space-y-1 text-[10px]">
            <span className="text-[#F5F5F0]/50 block">VERIFIER NETWORK:</span>
            <p className="text-[#F5F5F0]/80 truncate">{verifier}</p>
          </div>

          <div className="space-y-1 text-[9px] bg-[#121212] p-2 rounded border border-emerald-800/30">
            <span className="text-emerald-400 font-bold block">MERKLE LEAF PROOF:</span>
            <p className="text-[#F5F5F0]/70 break-all select-all font-mono">
              {merkleLeaf}
            </p>
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] text-[#F5F5F0]/50">
            <span>Standard: W3C VC v2.0</span>
            <button
              onClick={() => setShowPopover(false)}
              className="text-[#C5A059] hover:underline cursor-pointer font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
