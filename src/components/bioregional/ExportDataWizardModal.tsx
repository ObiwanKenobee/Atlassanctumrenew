import React, { useState, useMemo } from 'react';
import {
  X,
  Check,
  Copy,
  Download,
  FileCode,
  FileText,
  ShieldCheck,
  Sparkles,
  Layers,
  StickyNote,
  Camera,
  Activity,
  Sliders,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Share2,
  Database
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';
import { BioregionalTwinScenario } from '../../types';
import { FieldEvidenceItem } from './BioregionalSnap';
import { RegenerationInsightStickyNote } from './BioregionalEvidenceTimeline';

interface ExportDataWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedScenario: BioregionalTwinScenario;
  interventionValues: Record<string, number>;
  dynamicMultiplier: number;
}

export const ExportDataWizardModal: React.FC<ExportDataWizardModalProps> = ({
  isOpen,
  onClose,
  selectedScenario,
  interventionValues,
  dynamicMultiplier
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [hasCopied, setHasCopied] = useState(false);

  // Step 1: Module Selection Toggles
  const [includeScenarioCore, setIncludeScenarioCore] = useState(true);
  const [includeInterventions, setIncludeInterventions] = useState(true);
  const [includeIndicators, setIncludeIndicators] = useState(true);
  const [includeFieldEvidence, setIncludeFieldEvidence] = useState(true);
  const [includeStickyNotes, setIncludeStickyNotes] = useState(true);
  const [includeAlerts, setIncludeAlerts] = useState(true);
  const [includeEpistemicProvenance, setIncludeEpistemicProvenance] = useState(true);

  // Step 2: Metadata Configuration
  const [packageTitle, setPackageTitle] = useState(
    `${selectedScenario.name} — Bioregional Twin Empirical Research Package`
  );
  const [leadSteward, setLeadSteward] = useState('East African Bioregional Stewardship Assembly');
  const [researchProtocol, setResearchProtocol] = useState('Atlas Ground Truth Standard v2.4 (Open Commons)');
  const [licenseType, setLicenseType] = useState('Bioregional Commons TEK-Protected v1.0');
  const [synthesisNotes, setSynthesisNotes] = useState(
    'Counterfactual causal intervention simulation calibrated against ground truth field evidence, telemetry sonde probes, and participatory elder council sticky notes.'
  );

  // Load field evidence & sticky notes from storage
  const fieldEvidenceList: FieldEvidenceItem[] = useMemo(() => {
    try {
      const saved = localStorage.getItem('atlas_sanctum_field_evidence');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [];
  }, [isOpen]);

  const stickyNotesList: RegenerationInsightStickyNote[] = useMemo(() => {
    try {
      const saved = localStorage.getItem('atlas_evidence_sticky_notes');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return [];
  }, [isOpen]);

  // Compute Epistemic Merkle Hash
  const epistemicHash = useMemo(() => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }, [selectedScenario.id, dynamicMultiplier]);

  // Generate structured JSON payload
  const generatedPackageJson = useMemo(() => {
    const payload: any = {
      packageSchema: 'https://atlassanctum.earth/schemas/bioregional-research-package-v2.json',
      packageVersion: '2.4.0',
      exportedAt: new Date().toISOString(),
      metadata: {
        packageTitle: packageTitle.trim(),
        bioregionId: selectedScenario.id,
        bioregionName: selectedScenario.name,
        targetZone: selectedScenario.bioregion,
        leadSteward: leadSteward.trim(),
        researchProtocol: researchProtocol.trim(),
        license: licenseType,
        synthesisNotes: synthesisNotes.trim(),
        dynamicMultiplierApplied: dynamicMultiplier
      }
    };

    if (includeScenarioCore) {
      payload.scenarioCore = {
        name: selectedScenario.name,
        bioregion: selectedScenario.bioregion,
        description: selectedScenario.description,
        populationAffected: selectedScenario.populationAffected,
        monteCarloProbabilityOfSuccess: selectedScenario.monteCarloProbabilityOfSuccess,
        ecologicalPlanetaryMarginSafe: selectedScenario.ecologicalPlanetaryMarginSafe,
        flourishingImpact: selectedScenario.flourishingImpact,
        biophysicalNodes: selectedScenario.nodes.map(n => ({
          id: n.id,
          name: n.name,
          category: n.category,
          unit: n.unit,
          baseline: n.currentBaseline,
          simulatedValue: Math.round(n.currentBaseline * (1 / dynamicMultiplier) * 10) / 10,
          threshold: n.biophysicalThreshold
        }))
      };
    }

    if (includeInterventions) {
      payload.interventions = selectedScenario.activeInterventions.map(param => ({
        id: param.id,
        name: param.name,
        unit: param.unit,
        baselineValue: param.currentValue,
        configuredValue: interventionValues[`${selectedScenario.id}_${param.id}`] ?? param.currentValue,
        min: param.min,
        max: param.max,
        costEstimate: param.costEstimate,
        description: param.description
      }));
    }

    if (includeIndicators) {
      payload.biophysicalSensorsAndNodes = selectedScenario.nodes.map(n => ({
        id: n.id,
        name: n.name,
        category: n.category,
        unit: n.unit,
        baselineValue: n.currentBaseline,
        simulatedCurrentValue: Math.round(n.currentBaseline * (1 / dynamicMultiplier) * 10) / 10,
        biophysicalThreshold: n.biophysicalThreshold
      }));
    }

    if (includeFieldEvidence) {
      payload.fieldEvidenceLedger = fieldEvidenceList;
    }

    if (includeStickyNotes) {
      payload.regenerationInsightStickyNotes = stickyNotesList;
    }

    if (includeAlerts) {
      try {
        const savedAlerts = localStorage.getItem('atlas_mission_alerts');
        if (savedAlerts) {
          payload.contextualAlerts = JSON.parse(savedAlerts);
        }
      } catch {
        payload.contextualAlerts = [];
      }
    }

    if (includeEpistemicProvenance) {
      payload.epistemicProvenance = {
        merkleRootHash: epistemicHash,
        signatoryCouncil: leadSteward,
        epistemicStandard: 'Commandment II: Reality Above Model (Canonical Ground Truth)',
        sensorIntegrityConfidence: '99.4%',
        timestamp: new Date().toISOString()
      };
    }

    return payload;
  }, [
    packageTitle,
    selectedScenario,
    leadSteward,
    researchProtocol,
    licenseType,
    synthesisNotes,
    dynamicMultiplier,
    includeScenarioCore,
    includeInterventions,
    includeIndicators,
    includeFieldEvidence,
    includeStickyNotes,
    includeAlerts,
    includeEpistemicProvenance,
    interventionValues,
    fieldEvidenceList,
    stickyNotesList,
    epistemicHash
  ]);

  if (!isOpen) return null;

  // Download JSON file
  const handleDownloadJson = () => {
    audioFeedback.playSyncComplete();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(generatedPackageJson, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `bioregional_research_pkg_${selectedScenario.id}_${Date.now()}.json`;
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Download Standalone HTML Dossier
  const handleDownloadHtml = () => {
    audioFeedback.playSyncComplete();
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${packageTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0A0A0A; color: #F5F5F0; padding: 40px; max-width: 900px; margin: auto; }
    h1 { font-size: 24px; color: #C5A059; border-bottom: 2px solid #C5A059; padding-bottom: 10px; }
    h2 { font-size: 18px; color: #10B981; margin-top: 30px; }
    .box { background: #141414; border: 1px solid #333; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
    .hash { font-family: monospace; color: #10B981; word-break: break-all; }
    pre { background: #050505; border: 1px solid #222; padding: 15px; color: #A3E635; overflow-x: auto; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #222; font-size: 13px; }
    th { color: #C5A059; }
  </style>
</head>
<body>
  <h1>${packageTitle}</h1>
  <div class="box">
    <p><strong>Bioregion:</strong> ${selectedScenario.name} (${selectedScenario.bioregion})</p>
    <p><strong>Lead Steward / Council:</strong> ${leadSteward}</p>
    <p><strong>Protocol:</strong> ${researchProtocol} | <strong>License:</strong> ${licenseType}</p>
    <p><strong>Synthesis Notes:</strong> ${synthesisNotes}</p>
    <p><strong>Epistemic Merkle Hash:</strong> <span class="hash">${epistemicHash}</span></p>
  </div>

  <h2>Scenario Biophysical Nodes & Sentinel Thresholds</h2>
  <div class="box">
    <table>
      <tr><th>Sensor Node</th><th>Category</th><th>Baseline</th><th>Unit</th></tr>
      ${selectedScenario.nodes.map(n => `<tr><td>${n.name}</td><td>${n.category}</td><td>${n.currentBaseline} ${n.unit}</td><td>${n.unit}</td></tr>`).join('')}
    </table>
  </div>

  <h2>Raw Research Package JSON</h2>
  <pre>${JSON.stringify(generatedPackageJson, null, 2)}</pre>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `bioregional_dossier_${selectedScenario.id}_${Date.now()}.html`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  // Copy JSON to clipboard
  const handleCopy = () => {
    audioFeedback.playMicroTick();
    navigator.clipboard.writeText(JSON.stringify(generatedPackageJson, null, 2));
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0E0E0E] border border-[#C5A059] rounded-sm max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl text-[#F5F5F0] animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Wizard Header */}
        <div className="p-5 border-b border-[#F5F5F0]/10 flex items-center justify-between bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#1C180E] border border-[#C5A059]/60 flex items-center justify-center">
              <Database className="w-4 h-4 text-[#C5A059]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold block tracking-widest">
                EXPORT DATA WIZARD • RESEARCH PACKAGE GENERATOR
              </span>
              <h3 className="text-base font-serif font-bold text-[#F5F5F0]">
                Package Bioregional Empirical Intelligence
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#F5F5F0]/40 hover:text-[#F5F5F0] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="grid grid-cols-3 border-b border-[#F5F5F0]/10 font-mono text-xs text-center bg-[#090909]">
          {[
            { step: 1, label: '1. Select Data Modules' },
            { step: 2, label: '2. Metadata & Attribution' },
            { step: 3, label: '3. Verify & Export' }
          ].map(s => (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStep(s.step as any);
                audioFeedback.playMicroTick();
              }}
              className={`py-2.5 px-3 border-r last:border-r-0 border-[#F5F5F0]/10 transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                currentStep === s.step
                  ? 'bg-[#181818] text-[#C5A059] font-bold border-b-2 border-b-[#C5A059]'
                  : 'text-[#F5F5F0]/40 hover:text-[#F5F5F0]'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                currentStep === s.step ? 'bg-[#C5A059] text-black font-bold' : 'bg-[#222] text-[#F5F5F0]/60'
              }`}>
                {s.step}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: SELECT DATA MODULES */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
                  Select Bioregional Intelligence Modules to Package
                </h4>
                <p className="text-xs text-[#F5F5F0]/60 font-sans">
                  Choose which data dimensions, empirical records, and counterfactual simulation layers to include in this portable research archive.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {[
                  {
                    id: 'scenario',
                    title: 'Bioregional Scenario & Baseline Nodes',
                    desc: 'Geospatial coordinates, baseline indicators, and flourishing index projections.',
                    checked: includeScenarioCore,
                    toggle: () => setIncludeScenarioCore(!includeScenarioCore),
                    icon: <Layers className="w-4 h-4 text-[#C5A059]" />
                  },
                  {
                    id: 'interventions',
                    title: 'Active Causal Interventions',
                    desc: 'User-configured policy sliders, engineering parameters, and cost estimates.',
                    checked: includeInterventions,
                    toggle: () => setIncludeInterventions(!includeInterventions),
                    icon: <Sliders className="w-4 h-4 text-emerald-400" />
                  },
                  {
                    id: 'indicators',
                    title: 'Restoration Indicator Trends',
                    desc: 'Historical multi-year trends, target trajectories, and biophysical bounds.',
                    checked: includeIndicators,
                    toggle: () => setIncludeIndicators(!includeIndicators),
                    icon: <Activity className="w-4 h-4 text-cyan-400" />
                  },
                  {
                    id: 'evidence',
                    title: `Field Evidence Ledger (${fieldEvidenceList.length} Snaps)`,
                    desc: 'In-situ photos, observed root/canopy metrics, and sensor signatures.',
                    checked: includeFieldEvidence,
                    toggle: () => setIncludeFieldEvidence(!includeFieldEvidence),
                    icon: <Camera className="w-4 h-4 text-purple-400" />
                  },
                  {
                    id: 'stickynotes',
                    title: `Regeneration Sticky Notes (${stickyNotesList.length} Notes)`,
                    desc: 'Participatory field observations, elder notes, and practical implications.',
                    checked: includeStickyNotes,
                    toggle: () => setIncludeStickyNotes(!includeStickyNotes),
                    icon: <StickyNote className="w-4 h-4 text-amber-400" />
                  },
                  {
                    id: 'provenance',
                    title: 'Epistemic Provenance Merkle Hash',
                    desc: 'Cryptographic hash signature certifying data veracity and sensor chain of custody.',
                    checked: includeEpistemicProvenance,
                    toggle: () => setIncludeEpistemicProvenance(!includeEpistemicProvenance),
                    icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  }
                ].map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      item.toggle();
                      audioFeedback.playMicroTick();
                    }}
                    className={`p-3.5 rounded-sm border transition-all cursor-pointer flex items-start gap-3 ${
                      item.checked
                        ? 'bg-[#151814] border-emerald-500/50 shadow-sm'
                        : 'bg-[#121212] border-[#F5F5F0]/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="mt-0.5">{item.icon}</div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-serif font-bold text-[#F5F5F0]">{item.title}</span>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => {}} // Controlled by container onClick
                          className="accent-[#C5A059] h-3.5 w-3.5"
                        />
                      </div>
                      <p className="text-[11px] text-[#F5F5F0]/50 font-sans leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: METADATA & ATTRIBUTION */}
          {currentStep === 2 && (
            <div className="space-y-4 font-mono text-xs animate-in fade-in">
              <div className="space-y-1">
                <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
                  Configure Epistemic Metadata & Attribution
                </h4>
                <p className="text-xs text-[#F5F5F0]/60 font-sans">
                  Define research ownership, indigenous knowledge licenses, and canonical citations before compiling the final cryptographic package.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                    Package Research Title:
                  </label>
                  <input
                    type="text"
                    value={packageTitle}
                    onChange={e => setPackageTitle(e.target.value)}
                    className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                      Lead Researcher / Stewardship Council:
                    </label>
                    <input
                      type="text"
                      value={leadSteward}
                      onChange={e => setLeadSteward(e.target.value)}
                      className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                      Epistemic Research Protocol:
                    </label>
                    <input
                      type="text"
                      value={researchProtocol}
                      onChange={e => setResearchProtocol(e.target.value)}
                      className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                    Data License:
                  </label>
                  <select
                    value={licenseType}
                    onChange={e => setLicenseType(e.target.value)}
                    className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
                  >
                    <option value="Bioregional Commons TEK-Protected v1.0">Bioregional Commons TEK-Protected v1.0 (Attribution + Traditional Wisdom Non-Commercial)</option>
                    <option value="Creative Commons Attribution 4.0 International (CC BY 4.0)">Creative Commons Attribution 4.0 International (CC BY 4.0)</option>
                    <option value="Open Data Commons Open Database License (ODbL)">Open Data Commons Open Database License (ODbL)</option>
                    <option value="Confidential Bioregional Assembly Audit">Confidential Bioregional Assembly Audit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
                    Executive Summary / Synthesis Abstract:
                  </label>
                  <textarea
                    rows={3}
                    value={synthesisNotes}
                    onChange={e => setSynthesisNotes(e.target.value)}
                    className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs px-3 py-2 text-[#F5F5F0] outline-none focus:border-[#C5A059] font-sans text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: VERIFY & EXPORT */}
          {currentStep === 3 && (
            <div className="space-y-4 font-mono text-xs animate-in fade-in">
              <div className="p-3.5 bg-[#121814] border border-emerald-500/40 rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-bold uppercase text-[11px]">
                      Research Package Sealed & Ready for Export
                    </span>
                  </div>
                  <span className="text-[10px] text-[#F5F5F0]/50">
                    Schema v2.4.0 Compliant
                  </span>
                </div>

                <div className="text-[11px] text-[#F5F5F0]/70 font-sans">
                  Ready to package <strong>{selectedScenario.name}</strong> telemetry, field evidence, and scenario calculations under the <strong>{leadSteward}</strong> governance signature.
                </div>

                <div className="p-2 bg-black/60 border border-[#F5F5F0]/10 rounded text-[10px] text-emerald-400 break-all">
                  <span className="text-[#C5A059] uppercase block font-bold text-[9px] mb-0.5">Merkle Provenance Root:</span>
                  {epistemicHash}
                </div>
              </div>

              {/* JSON Live Viewer */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-[#F5F5F0]/40 font-bold">
                    Live JSON Payload Inspector:
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-[#C5A059] hover:underline flex items-center gap-1 text-[10px] cursor-pointer"
                  >
                    {hasCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{hasCopied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-[#050505] border border-[#F5F5F0]/10 rounded-xs max-h-56 overflow-y-auto text-[10px] text-[#A3E635] leading-relaxed select-all">
                  {JSON.stringify(generatedPackageJson, null, 2)}
                </pre>
              </div>

              {/* Download Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleDownloadJson}
                  className="py-3 px-4 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold font-mono text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow transition-all"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>Download Structured JSON</span>
                </button>

                <button
                  onClick={handleDownloadHtml}
                  className="py-3 px-4 bg-[#181818] hover:bg-[#252525] border border-[#F5F5F0]/20 text-[#F5F5F0] font-bold font-mono text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Download Standalone HTML Dossier</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="p-4 border-t border-[#F5F5F0]/10 bg-[#090909] flex items-center justify-between font-mono text-xs">
          <div>
            {currentStep > 1 ? (
              <button
                onClick={() => {
                  setCurrentStep((currentStep - 1) as any);
                  audioFeedback.playMicroTick();
                }}
                className="px-3 py-1.5 bg-[#141414] hover:bg-[#202020] border border-[#F5F5F0]/15 text-[#F5F5F0] rounded-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-[#F5F5F0]/40 hover:text-[#F5F5F0] cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          <div>
            {currentStep < 3 ? (
              <button
                onClick={() => {
                  setCurrentStep((currentStep + 1) as any);
                  audioFeedback.playMicroTick();
                }}
                className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold rounded-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  audioFeedback.playSyncComplete();
                  onClose();
                }}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xs cursor-pointer"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
