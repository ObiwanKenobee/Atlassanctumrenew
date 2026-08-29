import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Globe,
  Share2
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export const VerifiableCredentialsExport: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<'W3C_VC' | 'SCHEMA_ORG' | 'GEOJSON_LD'>('W3C_VC');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const sampleW3C = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://atlassanctum.earth/contexts/v1/ecological-credential.jsonld"
    ],
    "id": "urn:atlas:credential:aberdare-2026-q3",
    "type": ["VerifiableCredential", "EcologicalAttributionCredential"],
    "issuer": {
      "id": "did:atlas:council:aberdare-catchment",
      "name": "Aberdare Basin Tripartite Governance Council"
    },
    "issuanceDate": "2026-08-28T22:15:00Z",
    "credentialSubject": {
      "id": "urn:atlas:project:prj-aberdare-riparian-09",
      "projectName": "Aberdare Ridge Riparian Recovery & Agroforestry Mesh",
      "bioregion": "Aberdare Range & Upper Tana Basin",
      "metrics": {
        "netGlomalinAttributableGain": "+9.6 mg/g",
        "riparianTurbidityReduction": "-57.5 NTU",
        "canopyStratification": "74% Native Closure"
      },
      "causalMethodology": "Synthetic Difference-in-Differences (SDID)",
      "confidencePValue": 0.001
    },
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2026-08-28T22:15:00Z",
      "verificationMethod": "did:atlas:council:aberdare-catchment#key-1",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERT...t40J7"
    }
  };

  const sampleSchemaOrg = {
    "@context": "https://schema.org",
    "@type": "EcologicalRestorationProject",
    "name": "Aberdare Ridge Riparian Recovery & Agroforestry Mesh",
    "identifier": "PRJ-ABERDARE-09",
    "description": "Multi-tier regenerative agroforestry corridor stabilizing 45km of riparian slopes.",
    "spatialCoverage": {
      "@type": "Place",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -0.4167,
        "longitude": 36.6667
      },
      "address": "Aberdare Forest Reserve, Kenya"
    },
    "funding": {
      "@type": "Grant",
      "name": "Atlas Blended Capital Facility",
      "amount": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": 4500000
      }
    }
  };

  const sampleGeoJsonLd = {
    "type": "FeatureCollection",
    "properties": {
      "bioregion": "Aberdare Range",
      "epistemicStandard": "Atlas EVS-4"
    },
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[36.65, -0.41], [36.68, -0.41], [36.68, -0.43], [36.65, -0.43], [36.65, -0.41]]]
        },
        "properties": {
          "zoneName": "Terrace Quadrant 3",
          "glomalinDensity": 18.2,
          "verifiedStatus": "Attested"
        }
      }
    ]
  };

  const activePayload =
    selectedFormat === 'W3C_VC'
      ? sampleW3C
      : selectedFormat === 'SCHEMA_ORG'
      ? sampleSchemaOrg
      : sampleGeoJsonLd;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(activePayload, null, 2));
    setIsCopied(true);
    audioFeedback.playSubtleClick();
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    audioFeedback.playSuccess();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activePayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `atlas-${selectedFormat.toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm p-6 space-y-6 text-[#F5F5F0]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
              GLOBAL DATA FEDERATION & OPEN CIVIC COMMONS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            W3C Verifiable Credentials & Planetary Commons Export
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans">
            Export cryptographic ecological credentials adhering to W3C Verifiable Credentials 2.0, Schema.org Ecological Entities, and GeoJSON-LD standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="px-3.5 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono text-xs font-bold uppercase rounded-xs cursor-pointer shadow flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON-LD</span>
          </button>
        </div>
      </div>

      {/* Format Selector Pills */}
      <div className="flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          {[
            { id: 'W3C_VC', label: '1. W3C Verifiable Credential' },
            { id: 'SCHEMA_ORG', label: '2. Schema.org Ecological Project' },
            { id: 'GEOJSON_LD', label: '3. GeoJSON-LD Polygon Mesh' }
          ].map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => {
                setSelectedFormat(fmt.id as any);
                audioFeedback.playSubtleClick();
              }}
              className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer ${
                selectedFormat === fmt.id
                  ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40 font-bold'
                  : 'bg-[#141414] text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
        >
          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{isCopied ? 'Copied to Clipboard' : 'Copy Payload'}</span>
        </button>
      </div>

      {/* JSON Output View */}
      <pre className="p-4 bg-[#121212] border border-[#F5F5F0]/10 rounded-xs text-xs font-mono text-emerald-300 overflow-x-auto max-h-72 leading-relaxed">
        {JSON.stringify(activePayload, null, 2)}
      </pre>
    </div>
  );
};
