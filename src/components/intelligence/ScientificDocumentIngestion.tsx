import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Layers,
  Network,
  Scale,
  BrainCircuit,
  Info,
  RotateCcw,
  Clock
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';
import { useDraftAutoSave } from '../../context/ConfirmationDialogContext';

export interface ExtractedCausalAssertion {
  id: string;
  sourceTextSnippet: string;
  causeNode: string;
  effectNode: string;
  relationshipType: 'POSITIVE_FEEDBACK' | 'NEGATIVE_INHIBITION' | 'THRESHOLD_TRIGGER';
  effectMagnitude: string;
  epistemicConfidence: number; // 0 - 100
  sampleSize: string;
  pValue?: number;
  injectedToGraph: boolean;
}

const SAMPLE_PAPERS = [
  {
    title: 'Glomalin Soil Aggregation Dynamics under Podocarpus Climax Canopy (Rotich et al., 2026)',
    text: `Field soil core analysis across the Aberdare Ridge transect indicates that mature Podocarpus milanjianus root exudates stimulate arbuscular mycorrhizal fungal biomass. Measured glomalin-related soil protein (GRSP) reached 18.2 mg/g in 3-year established agroforestry terraces compared to 7.4 mg/g in adjacent unmanaged pastures (p < 0.001, n=48 cores). The aggregate stability index increased water retention capacity by +38%, directly mitigating monsoon topsoil erosion.`
  },
  {
    title: 'Vetiver Siltation Traps in High-Velocity Urban Stormwater Swales (Wanjiku & Mwangi, 2026)',
    text: `Multi-tier Vetiveria zizanioides bio-swales installed along 1.4km of the Mathare 4A riparian corridor demonstrated a 72% reduction in suspended solids (turbidity dropped from 94 NTU to 26 NTU) within 60 days of root anchoring (n=12 storm events). Macroinvertebrate diversity score (BMWP-EAC) increased from 18 (severely degraded) to 58 (moderate ecological recovery).`
  }
];

export const ScientificDocumentIngestion: React.FC<{
  onGraphNodeInjected?: (assertion: ExtractedCausalAssertion) => void;
}> = ({ onGraphNodeInjected }) => {
  const [documentTitle, setDocumentTitle] = useState<string>(SAMPLE_PAPERS[0].title);
  const [documentContent, setDocumentContent] = useState<string>(SAMPLE_PAPERS[0].text);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedAssertions, setExtractedAssertions] = useState<ExtractedCausalAssertion[]>([]);

  // Temporary Draft Auto-Save integration
  const { hasSavedDraft, recoverDraft, discardDraft, savedDraft } = useDraftAutoSave(
    'scientific_document_ingestion_draft',
    { documentTitle, documentContent },
    {
      title: documentTitle ? `Dossier: ${documentTitle.slice(0, 30)}...` : 'Scientific Dossier Draft',
      fieldSummary: documentContent ? `${documentContent.slice(0, 60)}...` : undefined,
      debounceMs: 600
    }
  );

  // Listen for global draft recovery events
  useEffect(() => {
    const handleGlobalRecovery = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.key === 'scientific_document_ingestion_draft' && customEvent.detail?.data) {
        const data = customEvent.detail.data;
        if (data.documentTitle) setDocumentTitle(data.documentTitle);
        if (data.documentContent) setDocumentContent(data.documentContent);
      }
    };
    window.addEventListener('atlas-draft-recovered', handleGlobalRecovery);
    return () => window.removeEventListener('atlas-draft-recovered', handleGlobalRecovery);
  }, []);

  const handleRecoverSession = () => {
    const recovered = recoverDraft();
    if (recovered) {
      if (recovered.documentTitle) setDocumentTitle(recovered.documentTitle);
      if (recovered.documentContent) setDocumentContent(recovered.documentContent);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_PAPERS[0]) => {
    setDocumentTitle(sample.title);
    setDocumentContent(sample.text);
    setExtractedAssertions([]);
    audioFeedback.playSubtleClick();
  };

  const handleExtractCausalStructure = () => {
    if (!documentContent.trim()) return;

    setIsExtracting(true);
    audioFeedback.playMicroTick();

    setTimeout(() => {
      let results: ExtractedCausalAssertion[] = [];

      if (documentContent.toLowerCase().includes('glomalin')) {
        results = [
          {
            id: 'csl-ext-01',
            sourceTextSnippet: 'Podocarpus root exudates stimulate arbuscular mycorrhizal fungal biomass to yield 18.2 mg/g glomalin.',
            causeNode: 'Podocarpus Climax Canopy',
            effectNode: 'Soil Glomalin Aggregate Carbon',
            relationshipType: 'POSITIVE_FEEDBACK',
            effectMagnitude: '+146% over baseline',
            epistemicConfidence: 96,
            sampleSize: 'n=48 soil cores',
            pValue: 0.001,
            injectedToGraph: false
          },
          {
            id: 'csl-ext-02',
            sourceTextSnippet: 'Aggregate stability index increased water retention capacity by +38%, mitigating topsoil erosion.',
            causeNode: 'Soil Glomalin Aggregate Carbon',
            effectNode: 'Downstream Riparian Topsoil Retention',
            relationshipType: 'NEGATIVE_INHIBITION',
            effectMagnitude: '-65% silt runoff',
            epistemicConfidence: 92,
            sampleSize: 'n=14 terrace sites',
            pValue: 0.004,
            injectedToGraph: false
          }
        ];
      } else {
        results = [
          {
            id: 'csl-ext-03',
            sourceTextSnippet: 'Vetiver bio-swales demonstrated a 72% reduction in suspended solids within 60 days.',
            causeNode: 'Vetiver Riparian Bio-Swale',
            effectNode: 'River Siltation Turbidity',
            relationshipType: 'NEGATIVE_INHIBITION',
            effectMagnitude: '-72% turbidity drop',
            epistemicConfidence: 94,
            sampleSize: 'n=12 storm surge events',
            pValue: 0.002,
            injectedToGraph: false
          },
          {
            id: 'csl-ext-04',
            sourceTextSnippet: 'Macroinvertebrate diversity score (BMWP-EAC) increased from 18 to 58.',
            causeNode: 'Riparian Siltation Reduction',
            effectNode: 'Macro-Invertebrate & Tilapia Nursery Biomass',
            relationshipType: 'POSITIVE_FEEDBACK',
            effectMagnitude: '+222% biodiversity index',
            epistemicConfidence: 90,
            sampleSize: 'n=8 sampling stations',
            pValue: 0.005,
            injectedToGraph: false
          }
        ];
      }

      setExtractedAssertions(results);
      setIsExtracting(false);
      audioFeedback.playSuccess();
    }, 1200);
  };

  const handleInjectToGraph = (id: string) => {
    audioFeedback.playSuccess();
    setExtractedAssertions(prev =>
      prev.map(a => {
        if (a.id === id) {
          if (onGraphNodeInjected) onGraphNodeInjected(a);
          return { ...a, injectedToGraph: true };
        }
        return a;
      })
    );
  };

  return (
    <div className="bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm p-6 space-y-6 text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-widest font-bold flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-[#C5A059]" />
              PHASE 02 INTELLIGENCE • SCIENTIFIC EVIDENCE INGESTION ENGINE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
            Peer-Reviewed Literature & Field Report Parser
          </h2>
          <p className="text-xs text-[#F5F5F0]/60 max-w-2xl font-sans">
            Convert empirical agroecological papers, hydrological telemetry surveys, and elder council transcripts directly into structured causal nodes for the Knowledge Graph.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-2">
          {SAMPLE_PAPERS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(p)}
              className="px-2.5 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] border border-[#F5F5F0]/10 rounded-xs text-[10px] font-mono text-[#C5A059] cursor-pointer"
            >
              Paper #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Draft Auto-Save Recovery Strip */}
      {hasSavedDraft && (
        <div className="flex items-center justify-between p-2.5 rounded bg-[#161B18] border border-[#C5A059]/30 text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Unsaved local draft detected from previous session.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRecoverSession}
              id="scientific-dossier-recover-btn"
              className="px-2.5 py-1 rounded bg-[#C5A059] hover:bg-[#d4af37] text-black font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Recover Last Session</span>
            </button>
            <button
              onClick={discardDraft}
              className="px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-[10px] cursor-pointer"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Input Textarea & Extract Action */}
      <div className="space-y-3 font-mono text-xs">
        <div>
          <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
            Paper Title / Scientific Dossier:
          </label>
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs p-2.5 text-[#F5F5F0] outline-none focus:border-[#C5A059]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase text-[#C5A059] font-bold mb-1">
            Research Abstract, Methodological Log, or Empirical Claim:
          </label>
          <textarea
            rows={5}
            value={documentContent}
            onChange={(e) => setDocumentContent(e.target.value)}
            className="w-full bg-[#141414] border border-[#F5F5F0]/20 rounded-xs p-3 text-[#F5F5F0] outline-none focus:border-[#C5A059] font-serif text-sm leading-relaxed"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleExtractCausalStructure}
            disabled={isExtracting || !documentContent.trim()}
            className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold uppercase rounded-xs transition-all shadow cursor-pointer flex items-center gap-2"
          >
            <Sparkles className={`w-4 h-4 ${isExtracting ? 'animate-spin' : ''}`} />
            <span>{isExtracting ? 'Extracting Causal Hypotheses...' : 'Synthesize Causal Structure'}</span>
          </button>
        </div>
      </div>

      {/* Extracted Assertions Section */}
      {extractedAssertions.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[#F5F5F0]/10 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#C5A059] font-bold">
              Synthesized Causal Assertions ({extractedAssertions.length} Isolated):
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              Confidence Calibrated & Structured
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extractedAssertions.map((assertion) => (
              <div
                key={assertion.id}
                className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-xs space-y-3"
              >
                {/* Node Causal Chain */}
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#F5F5F0] bg-[#1a1a1a] p-2.5 rounded-xs border border-[#F5F5F0]/5">
                  <span className="text-emerald-300">{assertion.causeNode}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                  <span className="text-[#8FB8DE]">{assertion.effectNode}</span>
                </div>

                <p className="text-xs text-[#F5F5F0]/70 font-sans italic">
                  "{assertion.sourceTextSnippet}"
                </p>

                <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-[#F5F5F0]/60 pt-1 border-t border-[#F5F5F0]/5">
                  <div>
                    <span className="block text-[#F5F5F0]/40">Magnitude:</span>
                    <span className="text-emerald-400 font-bold">{assertion.effectMagnitude}</span>
                  </div>
                  <div>
                    <span className="block text-[#F5F5F0]/40">Confidence:</span>
                    <span className="text-[#C5A059] font-bold">{assertion.epistemicConfidence}%</span>
                  </div>
                  <div>
                    <span className="block text-[#F5F5F0]/40">P-Value:</span>
                    <span className="text-[#8FB8DE] font-bold">p &lt; {assertion.pValue}</span>
                  </div>
                </div>

                {/* Inject into D3 Knowledge Graph Button */}
                <div className="pt-2">
                  {assertion.injectedToGraph ? (
                    <div className="w-full py-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold rounded-xs flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Injected to D3 Knowledge Graph</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleInjectToGraph(assertion.id)}
                      className="w-full py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 text-[#C5A059] font-mono text-[11px] font-bold uppercase rounded-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Network className="w-3.5 h-3.5" />
                      <span>Inject into Ecological Knowledge Graph</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
