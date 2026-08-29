import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Zap,
  ArrowRight,
  Scale,
  Sparkles,
  BookOpen,
  Layers,
  FileCode
} from 'lucide-react';
import { GovernanceSdkPlayground } from '../GovernanceSdkPlayground';
import { AtlasApiInteractiveSandbox } from '../developers/AtlasApiInteractiveSandbox';
import { VerifiableCredentialsExport } from '../developers/VerifiableCredentialsExport';
import { audioFeedback } from '../../lib/audioFeedback';

export const DevelopersSdkView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'governance' | 'telemetry' | 'rve_assets'>('governance');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    audioFeedback.playSubtleClick();
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const sampleTypeScriptCode = `import { AtlasGovernanceClient, EpistemicProvenance } from '@atlas-sanctum/governance-sdk';

const governance = new AtlasGovernanceClient({
  apiKey: process.env.ATLAS_API_KEY,
  environment: 'production'
});

// 1. Query Active Priority Floors for the Bioregion
const floors = await governance.getPriorityFloors({
  bioregion: 'upper-athi-catchment'
});

// 2. Evaluate project compliance against Constitutional Axioms
const evaluation = await governance.evaluateCompliance({
  projectId: 'PRJ-ATHI-RIPARIAN-009',
  capitalUSD: 4500000,
  localEquityReserveRatio: 0.35, // Floor: >= 25%
  aquiferDrawdownRate: 0.22,     // Ceiling: <= 40%
  laborWageIndex: 2.4,           // Floor: >= 2.2x
  restBufferDaysPerMonth: 4      // Floor: >= 4 days
});

if (evaluation.status === 'APPROVED_WITH_GUARDRAILS') {
  console.log('Ethical Compliance Score:', evaluation.complianceScore);
  console.log('Cryptographic Merkle Root:', evaluation.cryptographicProof.merkleRoot);
}`;

  const sampleRestApi = `// POST /api/v1/governance/evaluate-compliance
{
  "projectId": "PRJ-KILIFI-MANGROVE-44",
  "projectTitle": "Kilifi Community Mangrove & Tidal Buffer",
  "bioregion": "Kilifi Coastal Catchment",
  "capitalUSD": 1850000,
  "externalInvestorIRR": 0.082,
  "localEquityReserveRatio": 0.30,
  "communityDisplacementRisk": false,
  "epistemicClass": "Verified"
}`;

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold flex items-center gap-1.5">
              <Scale className="w-3 h-3 text-[#C5A059]" />
              ATLAS GOVERNANCE & CIVILIZATION DEVELOPER SDK • V2.5.0
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Atlas Developer SDK & Governance Engine</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-2xl font-sans">
            Build applications, regenerative DAOs, and smart contracts integrating constitutional Priority Floors and ethics-review APIs programmatically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#8FB8DE] bg-[#0D0D0D] px-3.5 py-1.5 rounded-sm border border-[#8FB8DE]/20 font-bold">
            npm i @atlas-sanctum/governance-sdk
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#F5F5F0]/10 gap-2">
        <button
          onClick={() => {
            setActiveTab('governance');
            audioFeedback.playSubtleClick();
          }}
          className={`pb-3 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'governance'
              ? 'border-[#C5A059] text-[#C5A059]'
              : 'border-transparent text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Governance & Priority Floors</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('telemetry');
            audioFeedback.playSubtleClick();
          }}
          className={`pb-3 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'telemetry'
              ? 'border-[#C5A059] text-[#C5A059]'
              : 'border-transparent text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Living Reality Mesh APIs</span>
        </button>
      </div>

      {activeTab === 'governance' && (
        <div className="space-y-10">
          {/* Embedded Interactive Governance SDK Playground */}
          <GovernanceSdkPlayground />
        </div>
      )}

      {activeTab === 'telemetry' && (
        <div className="space-y-10">
          {/* 3 Core SDK Primitives */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-3">
              <div className="w-10 h-10 rounded-sm bg-[#1B3022] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif text-[#F5F5F0] font-bold">Living Reality API</h3>
              <p className="text-xs text-[#F5F5F0]/60 leading-relaxed font-sans">
                Streaming multispectral satellite data, IoT moisture sensor meshes, and bioregional carbon flux metrics.
              </p>
            </div>

            <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-3">
              <div className="w-10 h-10 rounded-sm bg-[#1B3022] border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif text-[#F5F5F0] font-bold">Moral Intelligence API</h3>
              <p className="text-xs text-[#F5F5F0]/60 leading-relaxed font-sans">
                Programmatically test proposals and capital disbursements against the 14 Universal Moral Axioms.
              </p>
            </div>

            <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-3">
              <div className="w-10 h-10 rounded-sm bg-[#1B3022] border border-[#C5A059]/30 flex items-center justify-center text-[#8FB8DE]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif text-[#F5F5F0] font-bold">Cryptographic Provenance</h3>
              <p className="text-xs text-[#F5F5F0]/60 leading-relaxed font-sans">
                Zero-knowledge audit trails, scientific verifier consensus, and non-fungible ecological outcome contracts.
              </p>
            </div>
          </div>

          {/* Code Snippets Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TypeScript Client */}
            <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-[#F5F5F0] uppercase tracking-wider">TypeScript / Node.js Quickstart</span>
                </div>
                <button
                  onClick={() => copyToClipboard(sampleTypeScriptCode, 'ts')}
                  className="p-1.5 text-[#F5F5F0]/60 hover:text-[#F5F5F0] bg-[#080808] border border-[#F5F5F0]/10 rounded-sm transition-colors text-xs flex items-center gap-1 font-mono"
                >
                  {copiedKey === 'ts' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'ts' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm text-xs font-mono text-[#F5F5F0]/80 overflow-x-auto leading-relaxed">
                <code>{sampleTypeScriptCode}</code>
              </pre>
            </div>

            {/* REST JSON Schema */}
            <div className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#8FB8DE]" />
                  <span className="text-xs font-mono font-bold text-[#F5F5F0] uppercase tracking-wider">REST API / Compliance Evaluation</span>
                </div>
                <button
                  onClick={() => copyToClipboard(sampleRestApi, 'rest')}
                  className="p-1.5 text-[#F5F5F0]/60 hover:text-[#F5F5F0] bg-[#080808] border border-[#F5F5F0]/10 rounded-sm transition-colors text-xs flex items-center gap-1 font-mono"
                >
                  {copiedKey === 'rest' ? <Check className="w-3.5 h-3.5 text-[#8FB8DE]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'rest' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm text-xs font-mono text-[#F5F5F0]/80 overflow-x-auto leading-relaxed">
                <code>{sampleRestApi}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Phase 06 Ecosystem: Interactive OpenAPI & GraphQL Sandbox */}
      <AtlasApiInteractiveSandbox />

      {/* W3C Verifiable Credentials & Planetary Commons Export */}
      <VerifiableCredentialsExport />
    </div>
  );
};

