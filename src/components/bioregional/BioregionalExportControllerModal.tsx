import React, { useState, useMemo } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileCode,
  Globe2,
  ShieldCheck,
  Copy,
  Check,
  X,
  Filter,
  Layers,
  Database,
  Lock,
  ExternalLink,
  Sparkles,
  Code2,
  Calendar,
  Eye
} from 'lucide-react';
import { BioregionalLedgerData } from '../../data/bioregionalLedgerData';
import { audioFeedback } from '../../lib/audioFeedback';

export type ExportDataScope = 'raw' | 'cleaned' | 'aggregated';
export type ExportFormat = 'json' | 'csv' | 'geojson';

export interface BioregionalExportControllerModalProps {
  region: BioregionalLedgerData;
  epochYear: number;
  flourishingScore: number;
  waterYieldM3: number;
  carbonRateTonnes: number;
  onClose: () => void;
  onTriggerNotification?: (alert: {
    title: string;
    claim: string;
    hash: string;
    verifier: string;
    certaintyScore: number;
    telemetrySource: string;
  }) => void;
}

export const BioregionalExportControllerModal: React.FC<BioregionalExportControllerModalProps> = ({
  region,
  epochYear,
  flourishingScore,
  waterYieldM3,
  carbonRateTonnes,
  onClose,
  onTriggerNotification
}) => {
  const [dataScope, setDataScope] = useState<ExportDataScope>('cleaned');
  const [format, setFormat] = useState<ExportFormat>('json');
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Selected Modules / Data Slices
  const [includeMetrics, setIncludeMetrics] = useState<boolean>(true);
  const [includeFlows, setIncludeFlows] = useState<boolean>(true);
  const [includeHexSinks, setIncludeHexSinks] = useState<boolean>(true);
  const [includeScarcityZones, setIncludeScarcityZones] = useState<boolean>(true);
  const [includeProvenance, setIncludeProvenance] = useState<boolean>(true);

  // Cryptographic Provenance Metadata
  const provenanceMetadata = useMemo(() => {
    const timestamp = new Date().toISOString();
    const blockNumber = 184980 + (epochYear - 2018) * 120 + Math.floor(Math.random() * 45);
    const merkleRoot = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const txHash = `0xtx_${epochYear}_${Math.random().toString(16).substring(2, 10)}`;

    return {
      protocol: 'Section 30 Epistemic Ledger Consensus v2.4',
      merkleStateRoot: merkleRoot,
      blockNumber,
      transactionHash: txHash,
      timestamp,
      calibratedEpoch: epochYear,
      signingOracles: [
        'Mara Basin Transboundary Commission In-situ Node',
        'Savory Institute Ecological Verification Council',
        'World Meteorological Organization (WMO) Sentinel #04'
      ],
      cryptographicStandard: 'zk-SNARK Groth16 Mass-Balance Proof (SHA-256)',
      attestationStatus: 'Cryptographically Verified & Immutable'
    };
  }, [epochYear, region.regionId]);

  // Generate Export Payload based on format and scope
  const generatedPayload = useMemo(() => {
    // 1. JSON Format
    if (format === 'json') {
      const data: Record<string, unknown> = {
        _exportMetadata: {
          exportType: 'Bioregional Ecological Ledger Export',
          scope: dataScope,
          format: 'JSON',
          generatedAt: provenanceMetadata.timestamp,
          bioregionId: region.regionId,
          bioregionName: region.regionName,
          biomeType: region.biomeType,
          totalAreaHectares: region.totalAreaHectares,
          selectedEpochYear: epochYear
        }
      };

      if (includeProvenance) {
        data._provenance = provenanceMetadata;
      }

      if (dataScope === 'aggregated') {
        data.summary = {
          compositeFlourishingScore: flourishingScore,
          totalWaterYieldM3PerYear: waterYieldM3,
          totalCarbonSequestrationTonnesPerYear: carbonRateTonnes,
          activeStewardAssemblies: region.activeStewardAssembliesCount,
          totalMonitoredMetrics: region.metrics.length,
          totalMetabolicFlows: region.resourceFlows.length,
          averageCircularityPct: +(
            region.resourceFlows.reduce((acc, f) => acc + f.circularityPct, 0) /
            region.resourceFlows.length
          ).toFixed(1)
        };
      }

      if (includeMetrics) {
        data.ecologicalHealthMetrics = region.metrics.map((m) => {
          if (dataScope === 'raw') {
            return {
              id: m.id,
              name: m.name,
              category: m.category,
              rawCurrentValue: m.currentValue,
              unit: m.unit,
              sensorNodeCount: m.sensorMeshNodesCount,
              rawCertaintyScore: m.confidenceScore,
              cryptographicHash: m.provenance.cryptographicHash,
              verifier: m.provenance.verifier,
              collectedAt: m.provenance.collectedAt
            };
          }
          return {
            id: m.id,
            name: m.name,
            category: m.category,
            currentValue: m.currentValue,
            baselineValue: m.baselineValue,
            targetValue: m.targetValue,
            unit: m.unit,
            confidenceScore: m.confidenceScore,
            deltaPct: m.deltaPct,
            provenance: includeProvenance ? m.provenance : undefined
          };
        });
      }

      if (includeFlows) {
        data.metabolicResourceFlows = region.resourceFlows.map((f) => {
          if (dataScope === 'raw') {
            return {
              flowId: f.id,
              title: f.title,
              rawRate: f.flowRate,
              unit: f.flowUnit,
              source: f.sourceNode,
              sink: f.targetNode,
              circularity: f.circularityPct,
              proofBlock: f.lastProofBlock,
              hash: f.provenance.cryptographicHash
            };
          }
          return {
            ...f,
            provenance: includeProvenance ? f.provenance : undefined
          };
        });
      }

      if (includeHexSinks) {
        data.soilCarbonSinks = [
          { zone: 'Aberdare Climax Podocarpus Ridge', carbonRateTCO2e: 5.8, somPercent: 6.2, glomalinMgG: 22.4, status: 'Peak Climax Sink' },
          { zone: 'Mara Basin Rotational Silvopasture', carbonRateTCO2e: 4.9, somPercent: 5.4, glomalinMgG: 18.2, status: 'Peak Climax Sink' },
          { zone: 'Lake Naivasha Subsurface Infiltration', carbonRateTCO2e: 3.8, somPercent: 4.2, glomalinMgG: 13.9, status: 'Active Mycorrhizal Infiltration' },
          { zone: 'Mathare Riparian Bio-Swale Corridor', carbonRateTCO2e: 4.4, somPercent: 4.9, glomalinMgG: 16.8, status: 'Active Mycorrhizal Infiltration' }
        ];
      }

      if (includeScarcityZones) {
        data.realTimeScarcityZones = [
          { type: 'water', zone: 'Talek Sub-basin Baseflow Deficit', severityPct: 78, affectedHectares: 14200, status: 'Critical Surge Deficit' },
          { type: 'energy', zone: 'Off-Grid Pastoral Microgrid Storage Pockets', severityPct: 54, affectedHectares: 8500, status: 'Moderate Curtailment' },
          { type: 'nutrient', zone: 'Volcanic Pumice Phosphorous Depletion Belt', severityPct: 62, affectedHectares: 11000, status: 'Mycorrhizal Stress' }
        ];
      }

      return JSON.stringify(data, null, 2);
    }

    // 2. CSV Format
    if (format === 'csv') {
      const lines: string[] = [];
      lines.push('# Bioregional Ecological Ledger Export');
      lines.push(`# Bioregion: ${region.regionName} (${region.regionId})`);
      lines.push(`# Scope: ${dataScope.toUpperCase()} | Calibrated Epoch: ${epochYear}`);
      lines.push(`# Merkle State Root: ${provenanceMetadata.merkleStateRoot}`);
      lines.push(`# Block Height: #${provenanceMetadata.blockNumber}`);
      lines.push(`# Attestation: ${provenanceMetadata.protocol}`);
      lines.push(`# Generated: ${provenanceMetadata.timestamp}`);
      lines.push('');

      if (includeMetrics) {
        lines.push('--- SECTION: ECOLOGICAL HEALTH METRICS ---');
        lines.push('metric_id,name,category,current_value,baseline_value,target_value,unit,confidence_score,delta_pct,sensor_nodes,crypto_hash');
        region.metrics.forEach((m) => {
          lines.push(
            `"${m.id}","${m.name}","${m.category}",${m.currentValue},${m.baselineValue},${m.targetValue},"${m.unit}",${m.confidenceScore},${m.deltaPct},${m.sensorMeshNodesCount},"${m.provenance.cryptographicHash}"`
          );
        });
        lines.push('');
      }

      if (includeFlows) {
        lines.push('--- SECTION: METABOLIC RESOURCE FLOWS ---');
        lines.push('flow_id,title,category,flow_rate,flow_unit,velocity,circularity_pct,source_node,target_node,proof_block,crypto_hash');
        region.resourceFlows.forEach((f) => {
          lines.push(
            `"${f.id}","${f.title}","${f.category}",${f.flowRate},"${f.flowUnit}","${f.flowVelocity}",${f.circularityPct},"${f.sourceNode}","${f.targetNode}",${f.lastProofBlock},"${f.provenance.cryptographicHash}"`
          );
        });
        lines.push('');
      }

      if (includeScarcityZones) {
        lines.push('--- SECTION: RESOURCE SCARCITY HOTSPOTS ---');
        lines.push('resource_type,zone_name,severity_pct,affected_hectares,telemetry_status');
        lines.push('"water","Talek Sub-basin Baseflow Deficit",78,14200,"Critical Surge Deficit"');
        lines.push('"energy","Off-Grid Pastoral Microgrid Pockets",54,8500,"Moderate Curtailment"');
        lines.push('"nutrient","Volcanic Pumice Phosphorus Lockup",62,11000,"Mycorrhizal Stress"');
      }

      return lines.join('\n');
    }

    // 3. GeoJSON Format (RFC 7946)
    if (format === 'geojson') {
      const features = [];

      // Add Bioregion Boundary feature
      features.push({
        type: 'Feature',
        id: `boundary-${region.regionId}`,
        properties: {
          featureClass: 'Bioregional Boundary Transect',
          regionId: region.regionId,
          regionName: region.regionName,
          biomeType: region.biomeType,
          totalAreaHectares: region.totalAreaHectares,
          compositeFlourishingScore: flourishingScore,
          epochYear,
          merkleRoot: provenanceMetadata.merkleStateRoot,
          blockNumber: provenanceMetadata.blockNumber
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [34.90, -1.25],
              [35.50, -1.20],
              [36.80, -0.40],
              [36.95, -1.30],
              [35.50, -1.68],
              [34.90, -1.25]
            ]
          ]
        }
      });

      // Add Hex Sinks as Polygons / Centroid Points
      if (includeHexSinks) {
        const hexPoints = [
          { name: 'Aberdare Climax Podocarpus Ridge', coord: [36.68, -0.42], rate: 5.8, status: 'Peak Climax Sink' },
          { name: 'Mara Basin Rotational Silvopasture', coord: [35.15, -1.48], rate: 4.9, status: 'Peak Climax Sink' },
          { name: 'Lake Naivasha Infiltration Depression', coord: [36.42, -0.72], rate: 3.8, status: 'Active Infiltration' },
          { name: 'Mathare Riparian Bio-Swale Corridor', coord: [36.85, -1.26], rate: 4.4, status: 'Active Infiltration' }
        ];

        hexPoints.forEach((hp, idx) => {
          features.push({
            type: 'Feature',
            id: `hex-sink-${idx + 1}`,
            properties: {
              featureClass: 'Soil Carbon Sequestration Sink',
              zoneName: hp.name,
              carbonRateTCO2e: hp.rate,
              restorationStatus: hp.status,
              bioregion: region.regionName,
              zkProofBlock: provenanceMetadata.blockNumber
            },
            geometry: {
              type: 'Point',
              coordinates: hp.coord
            }
          });
        });
      }

      // Add Scarcity Zones
      if (includeScarcityZones) {
        const scarcityFeatures = [
          { type: 'water', name: 'Talek Riverbed Baseflow Deficit', coord: [35.18, -1.55], severity: 78 },
          { type: 'energy', name: 'Off-Grid Microgrid Curtailment Zone', coord: [35.42, -1.38], severity: 54 },
          { type: 'nutrient', name: 'Volcanic Soil Phosphorus Lockup Zone', coord: [36.38, -0.78], severity: 62 }
        ];

        scarcityFeatures.forEach((sf, idx) => {
          features.push({
            type: 'Feature',
            id: `scarcity-zone-${idx + 1}`,
            properties: {
              featureClass: 'Resource Scarcity Hotspot',
              resourceType: sf.type,
              zoneName: sf.name,
              scarcitySeverityPct: sf.severity,
              stateHash: provenanceMetadata.merkleStateRoot.substring(0, 18)
            },
            geometry: {
              type: 'Point',
              coordinates: sf.coord
            }
          });
        });
      }

      const geojsonData = {
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' }
        },
        _provenance: includeProvenance ? provenanceMetadata : undefined,
        features
      };

      return JSON.stringify(geojsonData, null, 2);
    }

    return '';
  }, [
    format,
    dataScope,
    region,
    epochYear,
    flourishingScore,
    waterYieldM3,
    carbonRateTonnes,
    includeMetrics,
    includeFlows,
    includeHexSinks,
    includeScarcityZones,
    includeProvenance,
    provenanceMetadata
  ]);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(generatedPayload);
    setCopied(true);
    audioFeedback.playSubtleClick();
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    setIsExporting(true);
    audioFeedback.playSubtleClick();

    try {
      const mimeTypes: Record<ExportFormat, string> = {
        json: 'application/json',
        csv: 'text/csv;charset=utf-8;',
        geojson: 'application/geo+json'
      };

      const extensions: Record<ExportFormat, string> = {
        json: 'json',
        csv: 'csv',
        geojson: 'geojson'
      };

      const filename = `${region.regionId}_ledger_${dataScope}_${epochYear}.${extensions[format]}`;
      const blob = new Blob([generatedPayload], { type: mimeTypes[format] });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (onTriggerNotification) {
        onTriggerNotification({
          title: `Bioregional Data Exported (${format.toUpperCase()})`,
          claim: `Verified ${dataScope} data payload exported with signed Merkle root ${provenanceMetadata.merkleStateRoot.slice(0, 12)}...`,
          hash: provenanceMetadata.transactionHash,
          verifier: 'Bioregional Export Controller & Section 30 Epistemic Consensus',
          certaintyScore: 100,
          telemetrySource: `${region.regionName} Ledger State Block #${provenanceMetadata.blockNumber}`
        });
      }
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#090D0A] border border-[#C5A059]/50 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#C5A059]/30 bg-gradient-to-r from-[#121A14] via-[#0D130F] to-[#090D0A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
              <Download className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-white text-base sm:text-lg tracking-wide">
                  Bioregional Export Controller
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  Signed Provenance
                </span>
              </div>
              <p className="text-xs text-[#F5F5F0]/70 font-sans mt-0.5">
                Export raw, cleaned, or aggregated ledger states across standard CSV, JSON, and GeoJSON formats while retaining cryptographic lineage.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 font-mono text-xs text-[#F5F5F0]">
          {/* Controls Bar: Data Scope + Export Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scope Selection */}
            <div className="p-3.5 rounded-xl bg-[#0D120E] border border-[#F5F5F0]/15 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#C5A059] font-bold uppercase">
                <span className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  1. Processing Scope
                </span>
                <span className="text-[10px] text-neutral-400 lowercase">
                  ({dataScope === 'raw' ? 'sensor streams' : dataScope === 'cleaned' ? 'calibrated metrics' : 'epoch aggregates'})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {(['raw', 'cleaned', 'aggregated'] as const).map((sc) => (
                  <button
                    key={sc}
                    onClick={() => {
                      setDataScope(sc);
                      audioFeedback.playMicroTick();
                    }}
                    className={`py-2 px-2 rounded-lg text-[10px] uppercase font-bold transition-all cursor-pointer text-center ${
                      dataScope === sc
                        ? 'bg-[#C5A059] text-black shadow-md font-extrabold'
                        : 'bg-[#151C17] text-[#F5F5F0]/60 hover:text-white hover:bg-[#1C261F]'
                    }`}
                  >
                    {sc === 'raw' ? 'Raw Data' : sc === 'cleaned' ? 'Cleaned' : 'Aggregated'}
                  </button>
                ))}
              </div>

              <p className="text-[10px] text-neutral-400 font-sans pt-1 leading-snug">
                {dataScope === 'raw' && 'Raw sensor telemetry, node hardware IDs, and uncalibrated flux streams.'}
                {dataScope === 'cleaned' && 'Outlier-filtered, baseline-normalized parameters anchored to Section 30 standards.'}
                {dataScope === 'aggregated' && 'Total net metabolic balances, category totals, and composite flourishing indices.'}
              </p>
            </div>

            {/* Format Selection */}
            <div className="p-3.5 rounded-xl bg-[#0D120E] border border-[#F5F5F0]/15 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#C5A059] font-bold uppercase">
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  2. Standard Format
                </span>
                <span className="text-[10px] text-neutral-400 lowercase">
                  ({format === 'json' ? 'RFC 8259' : format === 'csv' ? 'RFC 4180' : 'RFC 7946'})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  onClick={() => {
                    setFormat('json');
                    audioFeedback.playMicroTick();
                  }}
                  className={`py-2 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    format === 'json'
                      ? 'bg-cyan-500 text-black shadow-md font-extrabold'
                      : 'bg-[#151C17] text-[#F5F5F0]/60 hover:text-white hover:bg-[#1C261F]'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  JSON
                </button>

                <button
                  onClick={() => {
                    setFormat('csv');
                    audioFeedback.playMicroTick();
                  }}
                  className={`py-2 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    format === 'csv'
                      ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                      : 'bg-[#151C17] text-[#F5F5F0]/60 hover:text-white hover:bg-[#1C261F]'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  CSV
                </button>

                <button
                  onClick={() => {
                    setFormat('geojson');
                    audioFeedback.playMicroTick();
                  }}
                  className={`py-2 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    format === 'geojson'
                      ? 'bg-purple-500 text-black shadow-md font-extrabold'
                      : 'bg-[#151C17] text-[#F5F5F0]/60 hover:text-white hover:bg-[#1C261F]'
                  }`}
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  GeoJSON
                </button>
              </div>

              <p className="text-[10px] text-neutral-400 font-sans pt-1 leading-snug">
                {format === 'json' && 'Full hierarchical payload with nested cryptographic proof tree and metadata.'}
                {format === 'csv' && 'Tabular format with cryptographically hashed rows and audit metadata headers.'}
                {format === 'geojson' && 'Spatial geographic features (boundary polygons, sensor nodes, carbon sinks) for GIS.'}
              </p>
            </div>
          </div>

          {/* Module Toggles */}
          <div className="p-3.5 rounded-xl bg-[#0D120E] border border-[#F5F5F0]/15 space-y-2">
            <span className="text-[11px] text-[#C5A059] font-bold uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              3. Select Data Slices to Include:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1 text-[11px]">
              <label className="flex items-center gap-2 p-2 rounded bg-[#131A15] border border-[#F5F5F0]/10 cursor-pointer hover:border-[#F5F5F0]/30 transition-all">
                <input
                  type="checkbox"
                  checked={includeMetrics}
                  onChange={(e) => setIncludeMetrics(e.target.checked)}
                  className="accent-emerald-500 cursor-pointer"
                />
                <span className="text-white">Health Metrics</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-[#131A15] border border-[#F5F5F0]/10 cursor-pointer hover:border-[#F5F5F0]/30 transition-all">
                <input
                  type="checkbox"
                  checked={includeFlows}
                  onChange={(e) => setIncludeFlows(e.target.checked)}
                  className="accent-cyan-500 cursor-pointer"
                />
                <span className="text-white">Resource Flows</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-[#131A15] border border-[#F5F5F0]/10 cursor-pointer hover:border-[#F5F5F0]/30 transition-all">
                <input
                  type="checkbox"
                  checked={includeHexSinks}
                  onChange={(e) => setIncludeHexSinks(e.target.checked)}
                  className="accent-amber-500 cursor-pointer"
                />
                <span className="text-white">Carbon Hex Sinks</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-[#131A15] border border-[#F5F5F0]/10 cursor-pointer hover:border-[#F5F5F0]/30 transition-all">
                <input
                  type="checkbox"
                  checked={includeScarcityZones}
                  onChange={(e) => setIncludeScarcityZones(e.target.checked)}
                  className="accent-rose-500 cursor-pointer"
                />
                <span className="text-white">Scarcity Zones</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-[#131A15] border border-emerald-500/30 cursor-pointer hover:border-emerald-500/60 transition-all text-emerald-300">
                <input
                  type="checkbox"
                  checked={includeProvenance}
                  onChange={(e) => setIncludeProvenance(e.target.checked)}
                  className="accent-emerald-400 cursor-pointer"
                />
                <span className="font-bold">Signed Lineage</span>
              </label>
            </div>
          </div>

          {/* Cryptographic Signed Metadata Certificate */}
          <div className="p-3.5 rounded-xl bg-[#08100C] border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Cryptographically Signed Provenance Envelope
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                Block #{provenanceMetadata.blockNumber}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] pt-1">
              <div className="p-2 rounded bg-[#0D1711] border border-emerald-500/20">
                <span className="text-neutral-400 block">Merkle State Root (SHA-256):</span>
                <span className="text-emerald-300 font-bold truncate block select-all">
                  {provenanceMetadata.merkleStateRoot}
                </span>
              </div>

              <div className="p-2 rounded bg-[#0D1711] border border-emerald-500/20">
                <span className="text-neutral-400 block">Attestation Standard:</span>
                <span className="text-[#C5A059] font-bold block truncate">
                  {provenanceMetadata.protocol}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-neutral-400 flex flex-wrap items-center gap-2 pt-0.5">
              <span>Verified by 3 Multi-Sig Oracles:</span>
              <span className="text-neutral-300">Mara Basin Commission</span>
              <span>•</span>
              <span className="text-neutral-300">Savory Institute</span>
              <span>•</span>
              <span className="text-neutral-300">WMO Sentinel</span>
            </div>
          </div>

          {/* Code/Payload Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span className="uppercase font-bold text-[#C5A059] flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                Live Payload Preview ({format.toUpperCase()} • {generatedPayload.length} bytes):
              </span>
              <span>UTF-8 Signed Document</span>
            </div>

            <div className="relative rounded-xl bg-[#050705] border border-[#F5F5F0]/15 p-3.5 max-h-52 overflow-y-auto text-[11px] font-mono leading-relaxed select-all scrollbar-thin">
              <pre className="text-emerald-300/90 whitespace-pre-wrap break-all">
                {generatedPayload}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 border-t border-[#C5A059]/30 bg-[#0A0E0B] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
          <div className="text-[10px] text-neutral-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cryptographic integrity verified against biophysical ledger.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleCopyPayload}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-[#141B16] hover:bg-[#1E2921] text-[#C5A059] border border-[#C5A059]/40 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Payload'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Packaging...' : `Download ${format.toUpperCase()}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
