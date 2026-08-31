import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck, 
  Award, 
  Search, 
  ExternalLink, 
  Hash, 
  Building2, 
  TreePine, 
  Layers, 
  Eye, 
  QrCode, 
  Lock,
  Sparkles
} from 'lucide-react';
import { VERIFIABLE_CLAIMS } from '../../../data/trustData';
import { VerificationState, VerifiableClaimRecord } from '../../../types/trust';
import { audioFeedback } from '../../../lib/audioFeedback';
import { Web3WalletManager } from '../Web3WalletManager';

export const VerificationSystemSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<VerifiableClaimRecord | null>(null);
  const [activeStageFilter, setActiveStageFilter] = useState<'all' | VerificationState>('all');

  const filteredClaims = VERIFIABLE_CLAIMS.filter(c => {
    if (activeStageFilter !== 'all' && c.verificationState !== activeStageFilter) return false;
    if (
      searchQuery &&
      !c.subjectTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.claimDescription.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getStageBadge = (state: VerificationState) => {
    switch (state) {
      case 'unverified':
        return { bg: 'bg-zinc-800 text-zinc-400 border-zinc-700', label: 'Unverified' };
      case 'submitted':
        return { bg: 'bg-amber-950/80 text-amber-300 border-amber-500/40', label: 'Submitted' };
      case 'reviewed':
        return { bg: 'bg-blue-950/80 text-blue-300 border-blue-500/40', label: 'Peer-Reviewed' };
      case 'verified':
        return { bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50', label: 'Bioregionally Verified' };
      case 'independently-audited':
        return { bg: 'bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]/60', label: 'Independently Audited (Tier 5)' };
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C5A059]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">Verifiable Credential Protocol</span>
          </div>
          <h2 className="text-xl font-medium font-serif text-[#F5F5F0]">
            5-Stage Epistemic Verification & Proof of Impact
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl leading-relaxed">
            Every organization, capital fund, land trust, and ecological restoration claim passes through a 5-tier cryptographic verification lifecycle, preventing greenwashing and establishing trust in regenerative assets.
          </p>
        </div>
      </div>

      {/* Web3 Wallet & Sovereign Identity Signer */}
      <Web3WalletManager />

      {/* 5-Stage Visual Workflow Stepper */}
      <div className="p-5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-3">
        <p className="text-[10px] font-mono uppercase text-[#C5A059] font-bold tracking-wider">
          Verification Lifecycle Continuum
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-mono">
          <div className="p-3 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5 flex flex-col justify-between">
            <div>
              <span className="text-[#F5F5F0]/50 text-[10px] block">Stage 1</span>
              <span className="font-bold text-[#F5F5F0] block mt-0.5">Unverified</span>
            </div>
            <p className="text-[10px] text-[#F5F5F0]/60 mt-2">Initial claim or project registered by user</p>
          </div>

          <div className="p-3 bg-[#0E0E0E] rounded border border-amber-500/20 flex flex-col justify-between">
            <div>
              <span className="text-amber-400/80 text-[10px] block">Stage 2</span>
              <span className="font-bold text-amber-300 block mt-0.5">Submitted</span>
            </div>
            <p className="text-[10px] text-[#F5F5F0]/60 mt-2">Telemetry, sensor data & documentation attached</p>
          </div>

          <div className="p-3 bg-[#0E0E0E] rounded border border-blue-500/20 flex flex-col justify-between">
            <div>
              <span className="text-blue-400/80 text-[10px] block">Stage 3</span>
              <span className="font-bold text-blue-300 block mt-0.5">Peer-Reviewed</span>
            </div>
            <p className="text-[10px] text-[#F5F5F0]/60 mt-2">Scientific & community circle analysis</p>
          </div>

          <div className="p-3 bg-[#0E0E0E] rounded border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <span className="text-emerald-400/80 text-[10px] block">Stage 4</span>
              <span className="font-bold text-emerald-300 block mt-0.5">Verified</span>
            </div>
            <p className="text-[10px] text-[#F5F5F0]/60 mt-2">Bioregional Assembly governance quorum passed</p>
          </div>

          <div className="p-3 bg-[#1B3022]/60 rounded border border-[#C5A059]/50 flex flex-col justify-between">
            <div>
              <span className="text-[#C5A059] text-[10px] block font-bold">Stage 5 (Highest)</span>
              <span className="font-bold text-[#C5A059] block mt-0.5">Independently Audited</span>
            </div>
            <p className="text-[10px] text-emerald-200/80 mt-2">3rd-Party ISO / W3C Merkle Root signed</p>
          </div>
        </div>
      </div>

      {/* Directory Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 mr-1">Filter Stage:</span>
          {(['all', 'unverified', 'submitted', 'reviewed', 'verified', 'independently-audited'] as const).map(st => (
            <button
              key={st}
              onClick={() => {
                setActiveStageFilter(st);
                audioFeedback.playMicroTick();
              }}
              className={`px-2.5 py-1 text-xs font-mono rounded capitalize transition-all cursor-pointer ${
                activeStageFilter === st
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'bg-[#181818] text-[#F5F5F0]/70 hover:bg-[#222] border border-[#F5F5F0]/10'
              }`}
            >
              {st.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search verifiable claims..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/40 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Claims List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClaims.map(claim => {
          const badge = getStageBadge(claim.verificationState);
          return (
            <div 
              key={claim.id} 
              className="p-5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-3 hover:border-[#C5A059]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">{claim.subjectType}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-mono rounded border ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#F5F5F0] font-mono leading-tight">{claim.subjectTitle}</h4>
                <p className="text-xs text-[#F5F5F0]/70 leading-relaxed">{claim.claimDescription}</p>
              </div>

              <div className="pt-3 border-t border-[#F5F5F0]/10 space-y-2 text-[10px] font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F0]/50">Verifier Body:</span>
                  <span className="text-[#F5F5F0]/90 truncate max-w-[150px]">{claim.verifierOrganization}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F0]/50">Standard:</span>
                  <span className="text-emerald-400/90 truncate max-w-[150px]">{claim.auditStandard}</span>
                </div>
                <div className="flex items-center justify-between text-[#C5A059]">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Merkle Root:
                  </span>
                  <span className="truncate max-w-[120px]">{claim.cryptographicMerkleRoot}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedClaim(claim);
                    audioFeedback.playSubtleClick();
                  }}
                  className="w-full mt-2 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#F5F5F0]/10 text-xs text-[#F5F5F0] rounded flex items-center justify-center gap-1.5 cursor-pointer font-mono"
                >
                  <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Inspect Proof Certificate</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Claim Certificate Modal / Inspector */}
      {selectedClaim && (
        <div className="p-6 bg-[#121212] border border-[#C5A059]/50 rounded-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
              <h3 className="text-sm font-mono font-bold uppercase text-[#F5F5F0]">
                Cryptographic Verifiable Credential Certificate: {selectedClaim.id}
              </h3>
            </div>
            <button
              onClick={() => setSelectedClaim(null)}
              className="text-xs font-mono text-[#F5F5F0]/50 hover:text-[#F5F5F0] cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5 space-y-1">
              <span className="text-[#F5F5F0]/50 text-[10px]">Subject & Entity:</span>
              <p className="font-bold text-[#F5F5F0]">{selectedClaim.subjectTitle} ({selectedClaim.subjectType})</p>
              <p className="text-[#F5F5F0]/70 text-[11px] font-sans">{selectedClaim.claimDescription}</p>
            </div>

            <div className="p-3 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5 space-y-1">
              <span className="text-[#F5F5F0]/50 text-[10px]">Verification Metadata:</span>
              <p className="text-emerald-400 font-bold">Issuer: {selectedClaim.verifierOrganization}</p>
              <p className="text-[#F5F5F0]/70 text-[11px]">Audit Standard: {selectedClaim.auditStandard}</p>
              <p className="text-[#F5F5F0]/50 text-[10px]">Valid: {selectedClaim.issuanceDate} to {selectedClaim.expiryDate}</p>
            </div>
          </div>

          <div className="p-3 bg-[#090909] rounded border border-[#C5A059]/30 text-xs font-mono space-y-1 text-emerald-400">
            <span className="text-[10px] text-[#C5A059] uppercase block font-bold">W3C Verifiable Credential Proof:</span>
            <p className="break-all text-[11px]">Signature: {selectedClaim.cryptographicMerkleRoot}</p>
            <p className="text-[10px] text-[#F5F5F0]/60">Decentralized Identifier (DID): did:atlas:cascadia:{selectedClaim.id.toLowerCase()}</p>
          </div>
        </div>
      )}
    </div>
  );
};
