import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Copy,
  Check,
  Code2,
  Database,
  ShieldCheck,
  FileCode,
  Sparkles,
  ArrowRight,
  Layers,
  Clock,
  Zap
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface ApiEndpointSchema {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'GRAPHQL';
  path: string;
  desc: string;
  defaultPayload?: any;
  defaultResponse: any;
}

const API_ENDPOINTS: ApiEndpointSchema[] = [
  {
    id: 'ep-01',
    name: 'Query Bioregional Telemetry Stream',
    method: 'GET',
    path: '/api/v1/bioregions/aberdare-range/telemetry',
    desc: 'Retrieve calibrated real-time IoT piezometer, streamflow turbidity, and soil glomalin metrics.',
    defaultResponse: {
      status: 200,
      bioregion: "Aberdare Range & Upper Tana Catchment",
      timestamp: "2026-08-28T22:15:00Z",
      metrics: {
        soilGlomalinDensity: { value: 18.2, unit: "mg/g", status: "NOMINAL" },
        riparianSiltationTurbidity: { value: 24.8, unit: "NTU", status: "RECOVERED" },
        aquiferHydraulicHead: { value: 1.84, unit: "bar", status: "NOMINAL" },
        nativeCanopyClosure: { value: 74.0, unit: "%", status: "IMPROVING" }
      },
      epistemicHash: "0x98f4e2...a109"
    }
  },
  {
    id: 'ep-02',
    name: 'Evaluate Constitutional Compliance',
    method: 'POST',
    path: '/api/v1/governance/evaluate-compliance',
    desc: 'Evaluate project capital allocation against constitutional Priority Floors and non-displacement covenants.',
    defaultPayload: {
      projectId: "PRJ-ABERDARE-RIPARIAN-09",
      capitalUSD: 4500000,
      localEquityReserveRatio: 0.35,
      aquiferDrawdownRate: 0.22,
      laborWageIndex: 2.4,
      restBufferDaysPerMonth: 4
    },
    defaultResponse: {
      status: 200,
      decision: "APPROVED_WITH_GUARDRAILS",
      moralScore: 97,
      priorityFloorsMet: true,
      covenantsEnforced: [
        "Local Community Equity Floor >= 25% (Passed: 35%)",
        "Aquifer Drawdown Ceiling <= 40% (Passed: 22%)",
        "Living Wage Floor >= 2.2x (Passed: 2.4x)"
      ],
      cryptographicMerkleRoot: "0x7bc29...88e4"
    }
  },
  {
    id: 'ep-03',
    name: 'Mint W3C Verifiable Ecological Credential',
    method: 'POST',
    path: '/api/v1/credentials/mint',
    desc: 'Issue a W3C-compliant JSON-LD Verifiable Ecological Credential backed by tripartite consensus signatures.',
    defaultPayload: {
      claimId: "CLM-ABERDARE-2026-09",
      signatories: [
        { role: "FieldSteward", signature: "0x8f3c...b419" },
        { role: "IndependentScientist", signature: "0x2a91...e804" },
        { role: "IndigenousElder", signature: "0x7c4e...d122" }
      ]
    },
    defaultResponse: {
      statusCode: 201,
      credentialId: "urn:atlas:credential:clm-aberdare-2026-09",
      issuanceDate: "2026-08-28T22:15:00Z",
      verificationStatus: "VERIFIED_AND_ANCHORED",
      w3cContext: "https://atlassanctum.earth/contexts/v1/ecological-credential.jsonld",
      blockchainTxHash: "0x34d09f...c2891"
    }
  }
];

export const AtlasApiInteractiveSandbox: React.FC = () => {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('ep-01');
  const [codeLanguage, setCodeLanguage] = useState<'typescript' | 'python' | 'curl'>('typescript');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResponse, setExecutionResponse] = useState<any>(API_ENDPOINTS[0].defaultResponse);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const selectedEndpoint = API_ENDPOINTS.find(e => e.id === selectedEndpointId) || API_ENDPOINTS[0];

  const handleRunQuery = () => {
    setIsExecuting(true);
    audioFeedback.playMicroTick();

    setTimeout(() => {
      setExecutionResponse(selectedEndpoint.defaultResponse);
      setIsExecuting(false);
      audioFeedback.playSuccess();
    }, 600);
  };

  const generateCodeSnippet = () => {
    if (codeLanguage === 'typescript') {
      if (selectedEndpoint.method === 'GET') {
        return `import { AtlasClient } from '@atlas-sanctum/sdk';

const atlas = new AtlasClient({ apiKey: process.env.ATLAS_API_KEY });

const telemetry = await atlas.bioregions.getTelemetry({
  bioregion: 'aberdare-range'
});

console.log('Glomalin Density:', telemetry.metrics.soilGlomalinDensity.value);`;
      } else {
        return `import { AtlasClient } from '@atlas-sanctum/sdk';

const atlas = new AtlasClient({ apiKey: process.env.ATLAS_API_KEY });

const result = await atlas.governance.evaluateCompliance(${JSON.stringify(selectedEndpoint.defaultPayload || {}, null, 2)});

console.log('Status:', result.decision);`;
      }
    } else if (codeLanguage === 'python') {
      return `import requests

url = "https://api.atlassanctum.earth${selectedEndpoint.path}"
headers = {
    "Authorization": "Bearer YOUR_ATLAS_API_KEY",
    "Content-Type": "application/json"
}

${selectedEndpoint.method === 'GET' ? 'response = requests.get(url, headers=headers)' : `payload = ${JSON.stringify(selectedEndpoint.defaultPayload || {}, null, 4)}\nresponse = requests.post(url, json=payload, headers=headers)`}

print(response.json())`;
    } else {
      return `curl -X ${selectedEndpoint.method} \\
  "https://api.atlassanctum.earth${selectedEndpoint.path}" \\
  -H "Authorization: Bearer YOUR_ATLAS_API_KEY" \\
  -H "Content-Type: application/json"${selectedEndpoint.defaultPayload ? ` \\\n  -d '${JSON.stringify(selectedEndpoint.defaultPayload)}'` : ''}`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateCodeSnippet());
    setCopiedCode(true);
    audioFeedback.playSubtleClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm p-6 space-y-6 text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#C5A059]" />
              PHASE 06 ECOSYSTEM • INTERACTIVE OPENAPI & GRAPHQL SANDBOX
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Atlas Live Developer API Console
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans">
            Test and integrate Atlas programmatic REST, GraphQL, and W3C credential endpoints directly in-browser.
          </p>
        </div>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {API_ENDPOINTS.map((ep) => {
          const isSelected = ep.id === selectedEndpointId;
          return (
            <button
              key={ep.id}
              onClick={() => {
                setSelectedEndpointId(ep.id);
                setExecutionResponse(ep.defaultResponse);
                audioFeedback.playSubtleClick();
              }}
              className={`p-3 rounded-xs text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#181818] border-[#C5A059] shadow-md'
                  : 'bg-[#121212] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/25'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs ${ep.method === 'GET' ? 'bg-blue-950 text-blue-300' : 'bg-emerald-950 text-emerald-300'}`}>
                  {ep.method}
                </span>
                <span className="text-xs font-serif font-bold text-[#F5F5F0] truncate">
                  {ep.name}
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#C5A059] truncate">
                {ep.path}
              </p>
            </button>
          );
        })}
      </div>

      {/* Sandbox Body: Request Generator & Live Response */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Code Generator */}
        <div className="lg:col-span-6 space-y-3 bg-[#121212] p-4 rounded-sm border border-[#F5F5F0]/10 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
            <div className="flex items-center gap-1.5">
              {(['typescript', 'python', 'curl'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setCodeLanguage(lang);
                    audioFeedback.playSubtleClick();
                  }}
                  className={`px-2.5 py-1 rounded-xs uppercase text-[10px] cursor-pointer ${
                    codeLanguage === lang
                      ? 'bg-[#C5A059] text-black font-bold'
                      : 'bg-[#1C1C1C] text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyCode}
              className="text-[11px] text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="p-3 bg-[#0A0A0A] rounded-xs text-[11px] text-[#8FB8DE] overflow-x-auto max-h-56 leading-relaxed">
            {generateCodeSnippet()}
          </pre>

          <button
            onClick={handleRunQuery}
            disabled={isExecuting}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase rounded-xs transition-all shadow cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Executing Request...' : 'Send Live Request'}</span>
          </button>
        </div>

        {/* Right 6 Cols: JSON Output Terminal */}
        <div className="lg:col-span-6 space-y-3 bg-[#121212] p-4 rounded-sm border border-[#F5F5F0]/10 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
            <span className="text-[10px] uppercase text-[#C5A059] font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Response Payload • Status 200 OK (38ms)</span>
            </span>
          </div>

          <pre className="p-3 bg-[#0A0A0A] rounded-xs text-[11px] text-emerald-300 overflow-x-auto max-h-64 leading-relaxed">
            {JSON.stringify(executionResponse, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
