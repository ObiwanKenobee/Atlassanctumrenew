import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ExternalLink,
  Copy,
  Check,
  X,
  Network,
  TreePine,
  Droplets,
  Hash,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface RegenerationInsightAnnotation {
  id: string;
  author: string;
  authorRole: string;
  timestamp: string;
  title: string;
  htmlContent: string;
  zoneId?: string;
  zoneName?: string;
  evidenceTags?: string[];
  linkedModules?: Array<{ id: string; label: string }>;
}

export const SAMPLE_REGENERATION_INSIGHTS: RegenerationInsightAnnotation[] = [
  {
    id: 'ann-01',
    author: 'Dr. Wangari Kamau',
    authorRole: 'Lead Ecological Biogeochemist',
    timestamp: '2026-08-28 14:32 EAT',
    title: 'Rhizosphere Glomalin Lock & Occult Condensation Synergy',
    htmlContent: '<p>Our latest <strong>in-situ core sampling</strong> across the <em>Aberdare Climax Podocarpus Ridge</em> confirms that active mycorrhizal hyphae have established an irreversible <strong>carbon aggregate lock</strong> (2.8 mg/g glomalin). This structure retains over 400% its dry weight in water, directly dampening local thermal stress.</p><p>We strongly recommend cross-referencing this node with the <a href="#evidence-mapping" class="text-teal-400 underline font-bold">Evidence Mapping Module</a> and our <a href="#flourishing-index" class="text-[#C5A059] underline font-bold">Flourishing Index Model</a>.</p>',
    zoneId: 'zone-aberdare-ridge',
    zoneName: 'Aberdare Climax Podocarpus Ridge',
    evidenceTags: ['Flora', 'Soil Organic Matter', 'Aquifer Head'],
    linkedModules: [
      { id: 'evidence-mapping', label: 'Evidence Mapping & Sensor Sonde' },
      { id: 'flourishing-index', label: 'Civilizational Flourishing Index' },
      { id: 'moral-arbiter', label: 'Moral Arbiter Planetary Covenant' }
    ]
  },
  {
    id: 'ann-02',
    author: 'Elder Melita Ole Sankale',
    authorRole: 'Maasai Pastoralist Stewardship Custodian',
    timestamp: '2026-08-25 09:15 EAT',
    title: 'Customary Olosho Rotational Grazing Moratorium',
    htmlContent: '<p>The <em>Council of Pastoralist Elders</em> has formally verified the <strong>90-day seasonal root moratorium</strong> along the Talek River buffer. Grass biomass has rebounded to <strong>2.4 t/ha</strong> with zero bank slippage.</p><p>This customary protocol is now mathematically coupled to the <a href="#bioregional-twin" class="text-emerald-400 underline font-bold">Causal Bioregional Twin</a> kernel under <em>Commandment II: Reality Above Model</em>.</p>',
    zoneId: 'zone-mara-pastoral',
    zoneName: 'Mara Basin Olosho Silvopasture Sponge',
    evidenceTags: ['Governance', 'Pastoral Rotational Rest', 'Silvopasture'],
    linkedModules: [
      { id: 'stewardship-reputation', label: 'Stewardship Reputation Ledger' },
      { id: 'governance', label: 'Civilization OS Liquid Governance' }
    ]
  }
];

interface ExportScenarioInsightsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBioregionId?: string;
  selectedBioregionName?: string;
  insights?: RegenerationInsightAnnotation[];
  onNavigateToModule?: (modId: string) => void;
}

export const ExportScenarioInsightsModal: React.FC<ExportScenarioInsightsProps> = ({
  isOpen,
  onClose,
  selectedBioregionId = 'aberdare_riparian_watershed',
  selectedBioregionName = 'Aberdare Range & Mara-Rift Watershed',
  insights = SAMPLE_REGENERATION_INSIGHTS,
  onNavigateToModule
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'annotations' | 'json'>('preview');
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePrintPdf = () => {
    setIsExportingPdf(true);
    audioFeedback.playDataSave();
    setTimeout(() => {
      window.print();
      setIsExportingPdf(false);
    }, 300);
  };

  const handleCopyJson = () => {
    const payload = {
      documentTitle: `Atlas Sanctum Bioregional Scenario Insights: ${selectedBioregionName}`,
      exportDate: new Date().toISOString(),
      bioregionId: selectedBioregionId,
      philosophicalStandard: 'Commandment II: Reality Above Model (Epistemic Provenance Verified)',
      annotations: insights
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setHasCopied(true);
    audioFeedback.playMicroTick();
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="export-scenario-insights-modal"
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0D0D0D] border border-[#C5A059]/50 rounded-sm shadow-2xl overflow-hidden text-[#F5F5F0]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5F5F0]/10 bg-[#080808] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#C5A059]/40 bg-[#1B3022] flex items-center justify-center text-[#C5A059] shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                  DOCUMENT EXPORT WIZARD • PDF & INSIGHTS SNAPSHOT
                </span>
                <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full hidden sm:inline">
                  Verifiable Provenance
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">
                Export Scenario Insights & Knowledge Graph Summary
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPdf}
              disabled={isExportingPdf}
              className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs rounded-sm flex items-center gap-1.5 transition-all shadow cursor-pointer"
              title="Print or Save as PDF Document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isExportingPdf ? 'Preparing PDF...' : 'Print / Save PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#1A1A1A] rounded-sm transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-[#121212] border-b border-[#F5F5F0]/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-xs border transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-[#1F2720] border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-transparent border-transparent text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              Formatted Document View
            </button>
            <button
              onClick={() => setActiveTab('annotations')}
              className={`px-3 py-1 rounded-xs border transition-all cursor-pointer ${
                activeTab === 'annotations'
                  ? 'bg-[#1F2720] border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-transparent border-transparent text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              Rich-Text Annotations ({insights.length})
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1 rounded-xs border transition-all cursor-pointer ${
                activeTab === 'json'
                  ? 'bg-[#1F2720] border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-transparent border-transparent text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              Raw Provenance JSON
            </button>
          </div>

          <button
            onClick={handleCopyJson}
            className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#252525] border border-[#F5F5F0]/10 rounded-xs text-[11px] text-[#F5F5F0]/80 flex items-center gap-1.5 cursor-pointer"
          >
            {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{hasCopied ? 'Copied JSON' : 'Copy JSON'}</span>
          </button>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-[#F5F5F0] bg-[#0A0A0A] print:bg-white print:text-black">
          {activeTab === 'preview' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Document Header */}
              <div className="border-b-2 border-[#C5A059] pb-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#C5A059]">
                  <span>ATLAS SANCTUM • BIOREGIONAL INTELLIGENCE LEDGER</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0] print:text-black">
                  Bioregional Knowledge Graph & Regeneration Insights Snapshot
                </h1>
                <p className="text-xs font-mono text-[#F5F5F0]/60 print:text-gray-600">
                  Target Bioregion: <strong className="text-emerald-400 print:text-emerald-700">{selectedBioregionName}</strong> • Epistemic Level: In-Situ Ground Truth Verified
                </p>
              </div>

              {/* Philosophical Grounding Box */}
              <div className="p-4 bg-[#141A16] border border-emerald-500/40 rounded-xs space-y-1 text-xs print:bg-gray-100 print:text-black">
                <span className="font-mono uppercase text-emerald-400 font-bold block text-[10px] print:text-emerald-800">
                  Commandment II Grounding Standard:
                </span>
                <p className="font-sans leading-relaxed italic">
                  "Reality Above Model: The digital twin is a servant of empirical ground truth. No projection replaces verified in-situ measurement across mycelial, hydrological, and bio-acoustic sentinels."
                </p>
              </div>

              {/* Executive Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 bg-[#111] border border-[#F5F5F0]/10 rounded-xs print:bg-gray-50 print:border-gray-300">
                  <span className="text-[9px] text-[#F5F5F0]/50 uppercase block">Canopy Crown Density</span>
                  <span className="text-sm font-bold text-emerald-400 print:text-emerald-700">78% Verified (+14.2%)</span>
                </div>
                <div className="p-3 bg-[#111] border border-[#F5F5F0]/10 rounded-xs print:bg-gray-50 print:border-gray-300">
                  <span className="text-[9px] text-[#F5F5F0]/50 uppercase block">Aquifer Piezometric Head</span>
                  <span className="text-sm font-bold text-cyan-300 print:text-cyan-700">+1.82 bar Recovery</span>
                </div>
                <div className="p-3 bg-[#111] border border-[#F5F5F0]/10 rounded-xs print:bg-gray-50 print:border-gray-300">
                  <span className="text-[9px] text-[#F5F5F0]/50 uppercase block">Soil Glomalin Stability</span>
                  <span className="text-sm font-bold text-amber-300 print:text-amber-700">94 / 100 Index</span>
                </div>
                <div className="p-3 bg-[#111] border border-[#F5F5F0]/10 rounded-xs print:bg-gray-50 print:border-gray-300">
                  <span className="text-[9px] text-[#F5F5F0]/50 uppercase block">P90 Success Rate</span>
                  <span className="text-sm font-bold text-emerald-400 print:text-emerald-700">94.8% Certainty</span>
                </div>
              </div>

              {/* Rich-Text Annotations Rendered */}
              <div className="space-y-4 pt-2">
                <h3 className="text-base font-serif font-bold text-[#C5A059] print:text-amber-900 border-b border-[#F5F5F0]/10 pb-2">
                  Steward Annotations & Regeneration Insights
                </h3>

                {insights.map(ann => (
                  <div 
                    key={ann.id}
                    className="p-5 bg-[#121212] border border-[#F5F5F0]/15 rounded-xs space-y-3 print:bg-white print:border-gray-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                      <span className="font-bold text-[#F5F5F0] print:text-black">
                        {ann.author} • <span className="text-emerald-400 print:text-emerald-700">{ann.authorRole}</span>
                      </span>
                      <span className="text-[10px] text-[#F5F5F0]/40 print:text-gray-500">{ann.timestamp}</span>
                    </div>

                    <h4 className="text-sm font-serif font-bold text-[#C5A059] print:text-amber-800">
                      {ann.title}
                    </h4>

                    <div 
                      className="text-xs text-[#F5F5F0]/80 font-sans leading-relaxed space-y-2 print:text-gray-800"
                      dangerouslySetInnerHTML={{ __html: ann.htmlContent }}
                    />

                    {ann.linkedModules && ann.linkedModules.length > 0 && (
                      <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center gap-2 flex-wrap text-[10px] font-mono">
                        <span className="text-[#F5F5F0]/50">Embedded Intelligence Links:</span>
                        {ann.linkedModules.map(mod => (
                          <button
                            key={mod.id}
                            onClick={() => {
                              if (onNavigateToModule) onNavigateToModule(mod.id);
                              onClose();
                            }}
                            className="px-2 py-0.5 bg-[#1B2720] hover:bg-[#25352c] text-emerald-300 border border-emerald-500/30 rounded-xs flex items-center gap-1 cursor-pointer print:bg-gray-100 print:text-black"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>{mod.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Cryptographic Verification Seal */}
              <div className="p-4 bg-[#080808] border border-[#C5A059]/40 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#F5F5F0]/60 print:bg-gray-50 print:text-black">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cryptographic Provenance Verified (Atlas Standard v2.4)</span>
                  </div>
                  <p className="text-[10px]">Hash: 0x99201a4e76110f8234719bbca098234190872615</p>
                </div>
                <div className="text-right text-[10px] text-[#C5A059]">
                  Signatory: East African Bioregional Custodians Council
                </div>
              </div>
            </div>
          )}

          {activeTab === 'annotations' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {insights.map(ann => (
                <div key={ann.id} className="p-4 bg-[#121212] border border-[#F5F5F0]/10 rounded-xs space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-bold text-emerald-300">{ann.author}</span>
                    <span className="text-[#F5F5F0]/40">{ann.timestamp}</span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">{ann.title}</h4>
                  <div 
                    className="text-xs text-[#F5F5F0]/70 font-sans leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: ann.htmlContent }}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'json' && (
            <div className="max-w-3xl mx-auto">
              <pre className="p-4 bg-[#080808] border border-[#F5F5F0]/15 rounded-xs text-[11px] font-mono text-emerald-300 overflow-x-auto">
                {JSON.stringify(
                  {
                    documentTitle: `Atlas Sanctum Bioregional Scenario Insights: ${selectedBioregionName}`,
                    exportDate: new Date().toISOString(),
                    bioregionId: selectedBioregionId,
                    philosophicalStandard: 'Commandment II: Reality Above Model (Epistemic Provenance Verified)',
                    annotations: insights
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#F5F5F0]/10 bg-[#080808] flex items-center justify-between text-xs font-mono text-[#F5F5F0]/50 shrink-0">
          <span>Atlas Sanctum Causal Bioregional Twin v3.2</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintPdf}
              className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold rounded-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
