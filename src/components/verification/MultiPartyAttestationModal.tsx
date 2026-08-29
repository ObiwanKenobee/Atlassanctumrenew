import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Key,
  FileCheck2,
  X,
  Sparkles,
  Users,
  Copy,
  Check,
  ExternalLink,
  Scale,
  Award
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface AttestationParty {
  role: string;
  name: string;
  affiliation: string;
  publicKeyHash: string;
  isSigned: boolean;
  timestamp?: string;
  verificationLevel: 'Field Observation' | 'Scientific Peer Review' | 'Customary Indigenous Council';
}

export const MultiPartyAttestationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  claimId?: string;
  claimTitle?: string;
  bioregion?: string;
}> = ({
  isOpen,
  onClose,
  claimId = 'CLM-ABERDARE-2026-09',
  claimTitle = 'Soil Glomalin & Riparian Runoff Net Attributable Gain',
  bioregion = 'Aberdare Range & Upper Tana Catchment'
}) => {
  const [parties, setParties] = useState<AttestationParty[]>([
    {
      role: 'Local Field Steward',
      name: 'Citizen Steward Kiprono',
      affiliation: 'Mathare Youth Restoration Mesh',
      publicKeyHash: '0x8f3c...b419',
      isSigned: true,
      timestamp: 'Aug 28, 2026, 09:15 AM',
      verificationLevel: 'Field Observation'
    },
    {
      role: 'Independent Agroecologist',
      name: 'Dr. Kiptoo Rotich',
      affiliation: 'East African Soil Biophysics Consortium',
      publicKeyHash: '0x2a91...e804',
      isSigned: true,
      timestamp: 'Aug 28, 2026, 11:40 AM',
      verificationLevel: 'Scientific Peer Review'
    },
    {
      role: 'Customary Council Elder',
      name: 'Elder Mzee Ndung\'u',
      affiliation: 'Aberdare Water Towers Guardians',
      publicKeyHash: '0x7c4e...d122',
      isSigned: false,
      timestamp: undefined,
      verificationLevel: 'Customary Indigenous Council'
    }
  ]);

  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [copiedProof, setCopiedProof] = useState<boolean>(false);
  const [mintedCredential, setMintedCredential] = useState<any | null>(null);

  if (!isOpen) return null;

  const allSigned = parties.every(p => p.isSigned);

  const handleSignAsElder = () => {
    setIsSigning(true);
    audioFeedback.playMicroTick();

    setTimeout(() => {
      setParties(prev =>
        prev.map(p =>
          p.role.includes('Elder')
            ? {
                ...p,
                isSigned: true,
                timestamp: 'Just now (' + new Date().toLocaleTimeString() + ')'
              }
            : p
        )
      );
      setIsSigning(false);
      audioFeedback.playSuccess();
    }, 900);
  };

  const handleGenerateCredential = () => {
    const cred = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://atlassanctum.earth/contexts/v1/ecological-credential.jsonld"
      ],
      "id": `urn:atlas:credential:${claimId.toLowerCase()}`,
      "type": ["VerifiableCredential", "EcologicalAttributionCredential"],
      "issuer": "did:atlas:council:aberdare-catchment",
      "issuanceDate": new Date().toISOString(),
      "credentialSubject": {
        "id": `urn:atlas:claim:${claimId}`,
        "bioregion": bioregion,
        "claim": claimTitle,
        "causalMethodology": "Synthetic Difference-in-Differences (SDID)",
        "netAttributableGain": "+9.6 mg/g Glomalin Soil Aggregate Carbon",
        "confidencePValue": 0.001,
        "permanenceBufferReserveRatio": 0.20
      },
      "proof": {
        "type": "Ed25519Signature2020",
        "created": new Date().toISOString(),
        "verificationMethod": "did:atlas:council:aberdare-catchment#key-1",
        "proofPurpose": "assertionMethod",
        "jws": "eyJhbGciOiJFZERTQSI...k8X0j24zP"
      },
      "signatories": parties.map(p => ({
        role: p.role,
        name: p.name,
        publicKeyHash: p.publicKeyHash,
        timestamp: p.timestamp
      }))
    };

    setMintedCredential(cred);
    audioFeedback.playSuccess();
  };

  const handleCopyProof = () => {
    if (mintedCredential) {
      navigator.clipboard.writeText(JSON.stringify(mintedCredential, null, 2));
      setCopiedProof(true);
      audioFeedback.playSubtleClick();
      setTimeout(() => setCopiedProof(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101210] border border-[#C5A059] rounded-sm max-w-2xl w-full p-6 shadow-2xl space-y-6 text-[#F5F5F0] max-h-[90vh] overflow-y-auto animate-in fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">
                Multi-Party Attestation & Verification Protocol
              </h3>
              <p className="text-xs text-[#C5A059] font-mono">
                {claimId} • {bioregion}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#222] rounded-xs text-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Claim Summary */}
        <div className="p-4 bg-[#161616] border border-[#F5F5F0]/10 rounded-xs space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
            Target Ecological Attribution Claim:
          </span>
          <p className="text-sm font-serif text-[#F5F5F0] font-medium">
            "{claimTitle}"
          </p>
          <p className="text-xs text-[#F5F5F0]/60">
            Requires 3/3 cryptographic consensus across field stewards, independent scientists, and customary indigenous elders before credit issuance.
          </p>
        </div>

        {/* Multi-Party Signatories List */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase text-[#C5A059] font-bold block">
            Tripartite Verification Signatories:
          </span>

          <div className="space-y-2.5">
            {parties.map((p, idx) => (
              <div
                key={p.role}
                className="p-3.5 bg-[#141414] border border-[#F5F5F0]/10 rounded-xs flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-serif font-bold text-[#F5F5F0]">
                      {p.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#222] text-[#C5A059] rounded-xs">
                      {p.verificationLevel}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#F5F5F0]/60 font-sans">
                    {p.role} • {p.affiliation}
                  </div>
                  <div className="text-[10px] font-mono text-[#F5F5F0]/40">
                    Key: {p.publicKeyHash} {p.timestamp && `• Signed ${p.timestamp}`}
                  </div>
                </div>

                <div>
                  {p.isSigned ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono rounded-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Co-Signed</span>
                    </span>
                  ) : (
                    <button
                      onClick={handleSignAsElder}
                      disabled={isSigning}
                      className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black text-xs font-mono font-bold uppercase rounded-xs transition-all cursor-pointer shadow flex items-center gap-1"
                    >
                      <Key className="w-3 h-3" />
                      <span>{isSigning ? 'Signing...' : 'Sign as Elder'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credential Minting State */}
        {allSigned && !mintedCredential && (
          <div className="p-4 bg-[#142316] border border-emerald-500/40 rounded-xs flex items-center justify-between gap-4 animate-in fade-in">
            <div className="space-y-0.5">
              <span className="text-xs font-mono text-emerald-300 font-bold uppercase block">
                Tripartite Attestation Threshold Met (3/3)
              </span>
              <p className="text-xs text-[#F5F5F0]/70">
                All cryptographic signatures are valid. Ready to mint W3C Verifiable Ecological Credential.
              </p>
            </div>
            <button
              onClick={handleGenerateCredential}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mint Credential</span>
            </button>
          </div>
        )}

        {/* Minted W3C Credential Preview */}
        {mintedCredential && (
          <div className="space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#C5A059] font-bold uppercase flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>W3C Verifiable Ecological Credential (JSON-LD)</span>
              </span>
              <button
                onClick={handleCopyProof}
                className="text-[11px] font-mono text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedProof ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedProof ? 'Copied to Clipboard' : 'Copy JSON-LD'}</span>
              </button>
            </div>

            <pre className="p-3 bg-[#080808] border border-[#C5A059]/30 rounded-xs text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-48 leading-relaxed">
              {JSON.stringify(mintedCredential, null, 2)}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-[#F5F5F0]/10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#222] hover:bg-[#333] text-[#F5F5F0] text-xs font-mono uppercase rounded-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
