import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  X,
  ShieldCheck,
  MapPin,
  Clock,
  Activity,
  AlertTriangle,
  TreePine,
  Droplets,
  Sprout,
  Bird,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  Fingerprint
} from 'lucide-react';
import { MissionAlert } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

export interface FieldReportData {
  reportTitle: string;
  documentRef: string;
  bioregionName: string;
  bioregionId: string;
  description: string;
  populationAffected: number;
  monteCarloProbability: number;
  causalMultiplier: number;
  planetaryMarginSafe: boolean;
  activeInterventions: Record<string, number>;
  restorationIndicators: {
    canopyCrownDensity: string;
    aquiferHeadRecovery: string;
    soilOrganicMatter: string;
    biodiversityIndex: string;
    acousticComplexityIndex: string;
    carbonStockSequestered: string;
  };
  environmentalAlerts: MissionAlert[];
  fieldEvidence: Array<{
    id: string;
    title: string;
    category: string;
    coordinates: [number, number];
    locationName: string;
    metricObserved: string;
    timestamp: string;
    cryptographicHash: string;
    verifiedBy: string;
    status: string;
    photoUrl?: string;
  }>;
  epistemicProvenance: {
    canonicalStandard: string;
    provenanceHash: string;
    sensorHealthConfidenceScore: number;
    signatoryCouncil: string;
  };
  generatedAt: string;
}

interface BioregionalFieldReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: FieldReportData;
}

export const BioregionalFieldReportModal: React.FC<BioregionalFieldReportModalProps> = ({
  isOpen,
  onClose,
  reportData
}) => {
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    audioFeedback.playMicroTick();
    window.print();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(reportData, null, 2));
    setCopiedJson(true);
    audioFeedback.playMicroTick();
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopyMarkdown = () => {
    const md = `# ${reportData.reportTitle}
**Document Ref:** ${reportData.documentRef}
**Generated:** ${reportData.generatedAt}
**Bioregion:** ${reportData.bioregionName} (${reportData.bioregionId})

## Executive Summary
- **Target Population:** ${reportData.populationAffected.toLocaleString()}
- **Monte Carlo Probability of Success:** ${reportData.monteCarloProbability}%
- **Dynamic Causal Multiplier:** ${reportData.causalMultiplier}x
- **Planetary Boundaries Margin:** ${reportData.planetaryMarginSafe ? 'SAFE' : 'OVERSHOOT WARNING'}

## Core Restoration Indicators
- **Canopy Cover Density:** ${reportData.restorationIndicators.canopyCrownDensity}
- **Aquifer Piezometric Head:** ${reportData.restorationIndicators.aquiferHeadRecovery}
- **Soil Organic Matter (SOM):** ${reportData.restorationIndicators.soilOrganicMatter}
- **Biodiversity Trophic Index:** ${reportData.restorationIndicators.biodiversityIndex}
- **Acoustic Bio-Richness:** ${reportData.restorationIndicators.acousticComplexityIndex}
- **Carbon Stock Sequestration:** ${reportData.restorationIndicators.carbonStockSequestered}

## Active Environmental Alerts (${reportData.environmentalAlerts.length})
${reportData.environmentalAlerts.map(a => `- **[${a.severity.toUpperCase()}] ${a.title}**: ${a.message} (Timestamp: ${a.timestamp})`).join('\n')}

## Verified Field Evidence Ledger (${reportData.fieldEvidence.length} Items)
${reportData.fieldEvidence.map(ev => `- **${ev.title}** [${ev.category}] - ${ev.locationName}
  Metric: ${ev.metricObserved}
  Verified By: ${ev.verifiedBy} | Hash: ${ev.cryptographicHash}`).join('\n\n')}

## Epistemic Provenance
**Standard:** ${reportData.epistemicProvenance.canonicalStandard}
**Merkle Hash:** ${reportData.epistemicProvenance.provenanceHash}
**Signatory Council:** ${reportData.epistemicProvenance.signatoryCouncil}
`;

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    audioFeedback.playMicroTick();
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${reportData.reportTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 860px; margin: 40px auto; padding: 0 20px; }
    h1, h2, h3 { color: #111; font-family: Georgia, serif; }
    .header-box { border-bottom: 2px solid #c5a059; padding-bottom: 16px; margin-bottom: 24px; }
    .badge { display: inline-block; padding: 2px 8px; font-size: 11px; font-family: monospace; border-radius: 3px; font-weight: bold; background: #e0f2fe; color: #0369a1; }
    .badge-success { background: #dcfce7; color: #15803d; }
    .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 20px 0; }
    .metric-card { border: 1px solid #e5e5e5; padding: 14px; border-radius: 4px; background: #fafafa; }
    .metric-card strong { color: #854d0e; font-size: 12px; text-transform: uppercase; display: block; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 13px; }
    th { background: #f4f4f5; font-family: monospace; }
    .alert-box { border-left: 4px solid #f59e0b; background: #fffbeb; padding: 10px 14px; margin-bottom: 10px; font-size: 13px; }
    .hash { font-family: monospace; font-size: 11px; color: #666; word-break: break-all; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="header-box">
    <span class="badge badge-success">COMMANDMENT II VERIFIED</span>
    <h1>${reportData.reportTitle}</h1>
    <p><strong>Ref No:</strong> ${reportData.documentRef} | <strong>Bioregion:</strong> ${reportData.bioregionName} | <strong>Date:</strong> ${reportData.generatedAt}</p>
  </div>

  <h2>1. Executive Summary</h2>
  <p>${reportData.description}</p>
  <div class="metric-grid">
    <div class="metric-card">
      <strong>Inhabitants Protected</strong>
      <div>${reportData.populationAffected.toLocaleString()} people</div>
    </div>
    <div class="metric-card">
      <strong>Monte Carlo Confidence</strong>
      <div>${reportData.monteCarloProbability}% probability of ecological success</div>
    </div>
    <div class="metric-card">
      <strong>Causal Multiplier</strong>
      <div>${reportData.causalMultiplier}x biophysical feedback amplification</div>
    </div>
    <div class="metric-card">
      <strong>Planetary Boundaries</strong>
      <div>${reportData.planetaryMarginSafe ? 'Fully within safe operating space' : 'Exceeding safe margin'}</div>
    </div>
  </div>

  <h2>2. Restoration Indicators</h2>
  <table>
    <thead>
      <tr><th>Indicator</th><th>In-Situ Value</th><th>Biophysical Context</th></tr>
    </thead>
    <tbody>
      <tr><td>Canopy Density</td><td>${reportData.restorationIndicators.canopyCrownDensity}</td><td>Sentinel-2 Lidar calibration</td></tr>
      <tr><td>Aquifer Recovery</td><td>${reportData.restorationIndicators.aquiferHeadRecovery}</td><td>Subterranean piezometer mesh</td></tr>
      <tr><td>Soil Organic Matter</td><td>${reportData.restorationIndicators.soilOrganicMatter}</td><td>Keyline living sponge terraces</td></tr>
      <tr><td>Biodiversity Index</td><td>${reportData.restorationIndicators.biodiversityIndex}</td><td>Composite trophic guilds</td></tr>
      <tr><td>Acoustic Bio-Richness</td><td>${reportData.restorationIndicators.acousticComplexityIndex}</td><td>Bio-acoustic autonomous mesh</td></tr>
      <tr><td>Carbon Sequestration</td><td>${reportData.restorationIndicators.carbonStockSequestered}</td><td>Decadal permanent biomass sink</td></tr>
    </tbody>
  </table>

  <h2>3. Active Environmental Alerts (${reportData.environmentalAlerts.length})</h2>
  ${reportData.environmentalAlerts.map(a => `
    <div class="alert-box">
      <strong>[${a.severity.toUpperCase()}] ${a.title}</strong> (${a.timestamp})<br>
      ${a.message}
    </div>
  `).join('')}

  <h2>4. Verified Field Evidence Ledger (${reportData.fieldEvidence.length} Observations)</h2>
  <table>
    <thead>
      <tr><th>Evidence Title</th><th>Category</th><th>Location</th><th>Observed Metric</th><th>Verified By</th></tr>
    </thead>
    <tbody>
      ${reportData.fieldEvidence.map(ev => `
        <tr>
          <td><strong>${ev.title}</strong></td>
          <td><span class="badge">${ev.category}</span></td>
          <td>${ev.locationName}</td>
          <td>${ev.metricObserved}</td>
          <td>${ev.verifiedBy}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p><strong>Merkle Root Provenance:</strong> <span class="hash">${reportData.epistemicProvenance.provenanceHash}</span></p>
    <p><strong>Signatory Council:</strong> ${reportData.epistemicProvenance.signatoryCouncil}</p>
    <p>Certified under Atlas Epistemic Protocol v2.4. In-Situ Ground Truth Priority.</p>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Atlas_Sanctum_Field_Report_${reportData.bioregionId}_${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    audioFeedback.playDataSave();
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Atlas_Sanctum_Field_Report_${reportData.bioregionId}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    audioFeedback.playDataSave();
  };

  return (
    <div
      id="field-report-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="field-report-modal-content"
        className="relative w-full max-w-5xl bg-[#0D0D0D] border border-[#C5A059] rounded-sm overflow-hidden shadow-2xl flex flex-col max-h-[94vh] text-[#F5F5F0]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="p-4 bg-[#141414] border-b border-[#F5F5F0]/15 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#F5F5F0]">
                Official Bioregional Field Report
              </h3>
              <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                Printable Document Format • Ref: {reportData.documentRef}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs rounded-xs flex items-center gap-1.5 cursor-pointer shadow transition-all"
              title="Print formatted PDF report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#282828] border border-[#F5F5F0]/20 text-[#F5F5F0] font-mono text-xs rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Download standalone HTML document"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>HTML Dossier</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#282828] border border-[#F5F5F0]/20 text-[#F5F5F0] font-mono text-xs rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Download raw JSON data"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>JSON</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="px-2.5 py-1.5 bg-[#1C1C1C] hover:bg-[#282828] border border-[#F5F5F0]/20 text-[#F5F5F0]/70 hover:text-[#F5F5F0] font-mono text-xs rounded-xs flex items-center gap-1 cursor-pointer"
              title="Copy markdown text"
            >
              {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>MD</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#252525] text-[#F5F5F0]/50 hover:text-[#F5F5F0] rounded cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable PDF-Like Document Canvas */}
        <div id="printable-field-report" className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1 bg-[#090909] text-[#E5E5DF] font-sans">
          {/* Document Header with Seal & Epistemic Authority */}
          <div className="border-b-2 border-[#C5A059] pb-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] font-bold block">
                  ATLAS SANCTUM CIVIC OPERATING SYSTEM • BIOREGIONAL DOSSIER
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFFFFF] tracking-tight">
                  Bioregional Ecological Field Report
                </h1>
                <p className="text-sm font-serif text-[#C5A059] italic">
                  {reportData.bioregionName} Catchment & Riparian Transect
                </p>
              </div>

              <div className="p-3 bg-[#121212] border border-[#C5A059]/40 rounded text-right font-mono text-xs space-y-1 self-start sm:self-auto">
                <div className="text-[#C5A059] font-bold text-[10px] uppercase">Official Record Reference</div>
                <div className="text-sm font-bold text-white tracking-wider">{reportData.documentRef}</div>
                <div className="text-[10px] text-[#F5F5F0]/50">Generated: {reportData.generatedAt}</div>
              </div>
            </div>

            {/* Epistemic Commandment II Banner */}
            <div className="p-3 bg-[#141A16] border-l-4 border-emerald-500 rounded-r-xs flex items-center justify-between gap-3 text-xs font-mono text-emerald-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Commandment II Verified:</strong> Reality Above Model. In-situ empirical observations, soil cores, and IoT telemetry supersede counterfactual mathematical projections.
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-500/40 text-[9px] font-bold shrink-0">
                AUDIT PASS
              </span>
            </div>
          </div>

          {/* Section 1: Executive Bioregional Status */}
          <div className="space-y-3">
            <h2 className="text-sm font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-2 border-b border-[#F5F5F0]/10 pb-1.5">
              <span>01</span>
              <span>Executive Bioregional Status & Dynamic Coupling</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#F5F5F0]/80 font-sans leading-relaxed">
              {reportData.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 bg-[#111111] border border-[#F5F5F0]/10 rounded">
                <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Inhabitants Protected</span>
                <span className="text-base font-bold text-white">
                  {reportData.populationAffected.toLocaleString()}
                </span>
                <span className="text-[9px] text-emerald-400 block mt-0.5">Bioregional catchment</span>
              </div>

              <div className="p-3 bg-[#111111] border border-[#F5F5F0]/10 rounded">
                <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Monte Carlo Confidence</span>
                <span className="text-base font-bold text-emerald-400">
                  {reportData.monteCarloProbability}%
                </span>
                <span className="text-[9px] text-[#F5F5F0]/40 block mt-0.5">Statistical convergence</span>
              </div>

              <div className="p-3 bg-[#111111] border border-[#F5F5F0]/10 rounded">
                <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Causal Multiplier</span>
                <span className="text-base font-bold text-[#C5A059]">
                  {reportData.causalMultiplier}x
                </span>
                <span className="text-[9px] text-[#C5A059]/70 block mt-0.5">Biophysical synergy</span>
              </div>

              <div className="p-3 bg-[#111111] border border-[#F5F5F0]/10 rounded">
                <span className="text-[10px] text-[#F5F5F0]/40 uppercase block">Planetary Margin</span>
                <span className="text-base font-bold text-emerald-300">
                  {reportData.planetaryMarginSafe ? 'SAFE' : 'OVERSHOOT'}
                </span>
                <span className="text-[9px] text-emerald-400 block mt-0.5">Thermodynamic balance</span>
              </div>
            </div>
          </div>

          {/* Section 2: Core Ecological Restoration Indicators */}
          <div className="space-y-3">
            <h2 className="text-sm font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-2 border-b border-[#F5F5F0]/10 pb-1.5">
              <span>02</span>
              <span>Consolidated In-Situ Restoration Indicators</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 bg-[#121212] border border-emerald-500/30 rounded space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                    <TreePine className="w-3 h-3" /> Canopy Crown Density
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300">Target 80%</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {reportData.restorationIndicators.canopyCrownDensity}
                </div>
                <p className="text-[10px] text-[#F5F5F0]/50">Multispectral drone lidar & Sentinel-2 verification</p>
              </div>

              <div className="p-3.5 bg-[#121212] border border-cyan-500/30 rounded space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 uppercase font-bold flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Aquifer Head Recovery
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300">+2.0 bar Target</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {reportData.restorationIndicators.aquiferHeadRecovery}
                </div>
                <p className="text-[10px] text-[#F5F5F0]/50">Deep piezometer pressure transducer telemetry</p>
              </div>

              <div className="p-3.5 bg-[#121212] border border-amber-500/30 rounded space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1">
                    <Sprout className="w-3 h-3" /> Soil Organic Matter (SOM)
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300">5.0% Goal</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {reportData.restorationIndicators.soilOrganicMatter}
                </div>
                <p className="text-[10px] text-[#F5F5F0]/50">In-situ mycorrhizal root core sampling</p>
              </div>

              <div className="p-3.5 bg-[#121212] border border-[#F5F5F0]/10 rounded space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#C5A059] uppercase font-bold flex items-center gap-1">
                    <Bird className="w-3 h-3" /> Biodiversity Index
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#201D16] text-[#C5A059]">Trophic Rank</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {reportData.restorationIndicators.biodiversityIndex}
                </div>
                <p className="text-[10px] text-[#F5F5F0]/50">Keystone pollinator & avian breeding pair survey</p>
              </div>

              <div className="p-3.5 bg-[#121212] border border-[#F5F5F0]/10 rounded space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#F5F5F0]/60 uppercase font-bold flex items-center gap-1">
                    <Activity className="w-3 h-3 text-cyan-400" /> Bio-Acoustic Complexity
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-black text-[#F5F5F0]/60">Autonomous</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {reportData.restorationIndicators.acousticComplexityIndex}
                </div>
                <p className="text-[10px] text-[#F5F5F0]/50">Continuous 24-hr bio-acoustic monitoring array</p>
              </div>

              <div className="p-3.5 bg-[#121212] border border-[#F5F5F0]/10 rounded space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                    <TreePine className="w-3 h-3" /> Permanent Carbon Sink
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-black text-emerald-300">Decadal</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {reportData.restorationIndicators.carbonStockSequestered}
                </div>
                <p className="text-[10px] text-[#F5F5F0]/50">Non-volatile biomass and glomalin fixation</p>
              </div>
            </div>
          </div>

          {/* Section 3: Active Environmental Alerts Digest */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-1.5">
              <h2 className="text-sm font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-2">
                <span>03</span>
                <span>Active Environmental Alerts & Anomaly Digest</span>
              </h2>
              <span className="text-xs font-mono text-[#F5F5F0]/50">
                {reportData.environmentalAlerts.length} System Notifications
              </span>
            </div>

            <div className="space-y-2">
              {reportData.environmentalAlerts.slice(0, 4).map(alert => (
                <div
                  key={alert.id}
                  className="p-3 bg-[#111111] border border-[#F5F5F0]/10 rounded text-xs font-mono space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.2 text-[9px] uppercase font-bold rounded ${
                        alert.severity === 'critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          : alert.severity === 'warning'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="font-bold text-[#F5F5F0]">{alert.title}</span>
                    </div>
                    <span className="text-[10px] text-[#F5F5F0]/40">{alert.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#F5F5F0]/70 font-sans">
                    {alert.message}
                  </p>
                  {alert.metadata?.reading && (
                    <div className="text-[10px] text-emerald-400">
                      Reading: {alert.metadata.reading} (Threshold: {alert.metadata.threshold || 'Nominal'})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Verified Field Evidence Ledger */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-1.5">
              <h2 className="text-sm font-mono uppercase tracking-wider text-[#C5A059] font-bold flex items-center gap-2">
                <span>04</span>
                <span>In-Situ Field Evidence Ledger ({reportData.fieldEvidence.length} Entries)</span>
              </h2>
              <span className="text-xs font-mono text-emerald-400">
                Ground Truth Photogrammetry & Core Assays
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#F5F5F0]/20 text-[#C5A059] text-[10px] uppercase">
                    <th className="py-2 px-2">Observation Title</th>
                    <th className="py-2 px-2">Category</th>
                    <th className="py-2 px-2">Location</th>
                    <th className="py-2 px-2">Empirical Metric</th>
                    <th className="py-2 px-2">Verifying Council</th>
                    <th className="py-2 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F0]/10 text-[11px]">
                  {reportData.fieldEvidence.map(ev => (
                    <tr key={ev.id} className="hover:bg-[#151515]">
                      <td className="py-2 px-2 font-bold text-white">{ev.title}</td>
                      <td className="py-2 px-2">
                        <span className="px-1.5 py-0.2 rounded bg-black border border-[#F5F5F0]/10 text-[10px]">
                          {ev.category}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-[#F5F5F0]/70">{ev.locationName}</td>
                      <td className="py-2 px-2 text-emerald-300">{ev.metricObserved}</td>
                      <td className="py-2 px-2 text-[#F5F5F0]/60">{ev.verifiedBy}</td>
                      <td className="py-2 px-2 text-right text-emerald-400 font-bold">{ev.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Epistemic Signatures & Cryptographic Merkle Root */}
          <div className="pt-6 border-t border-[#F5F5F0]/20 space-y-6">
            <div className="p-4 bg-[#0F0F0F] border border-[#C5A059]/40 rounded space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#C5A059] uppercase font-bold text-[10px] flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-[#C5A059]" />
                  Cryptographic Merkle Root & Epistemic Audit Standard
                </span>
                <span className="text-[10px] text-emerald-400">
                  Integrity Score: {reportData.epistemicProvenance.sensorHealthConfidenceScore}%
                </span>
              </div>
              <p className="text-[11px] text-[#F5F5F0]/80 break-all select-all bg-black/60 p-2 rounded border border-[#F5F5F0]/5">
                {reportData.epistemicProvenance.provenanceHash}
              </p>
              <div className="text-[10px] text-[#F5F5F0]/50">
                Standard: {reportData.epistemicProvenance.canonicalStandard} • Certified by {reportData.epistemicProvenance.signatoryCouncil}
              </div>
            </div>

            {/* Signature Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-xs font-mono">
              <div className="border-t border-[#F5F5F0]/30 pt-2 space-y-1">
                <div className="text-[#C5A059] font-bold">Stewardship Council Elder</div>
                <div className="text-[#F5F5F0]/60 italic font-serif">Amina Wanjiku, Chair</div>
                <div className="text-[10px] text-[#F5F5F0]/40">East African Watershed Trust</div>
              </div>

              <div className="border-t border-[#F5F5F0]/30 pt-2 space-y-1">
                <div className="text-[#C5A059] font-bold">Lead Agroecologist & Hydrologist</div>
                <div className="text-[#F5F5F0]/60 italic font-serif">Dr. Kiptoo Rotich</div>
                <div className="text-[10px] text-[#F5F5F0]/40">Bioregional Synthesis Group</div>
              </div>

              <div className="border-t border-[#F5F5F0]/30 pt-2 space-y-1">
                <div className="text-[#C5A059] font-bold">Autonomous Sensor Mesh Verifier</div>
                <div className="text-[#F5F5F0]/60 italic font-serif">Node Cluster #EA-BIO-99</div>
                <div className="text-[10px] text-[#F5F5F0]/40">Cryptographic In-Situ Consensus</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 bg-[#121212] border-t border-[#F5F5F0]/15 flex items-center justify-between print:hidden">
          <span className="text-[11px] font-mono text-[#F5F5F0]/40">
            Atlas Sanctum Field Report Exporter • Ground Truth Epistemic Priority
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors shadow"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
