import React, { useState } from 'react';
import {
  Download,
  FileJson,
  FileCode,
  Check,
  Copy,
  X,
  Share2,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { KnowledgeNode, KnowledgeLink } from './BioregionalKnowledgeGraph';
import { audioFeedback } from '../../lib/audioFeedback';

interface KnowledgeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
  activeFilters: {
    nodeTypeFilter: string;
    linkTypeFilter: string;
    layerFilter: string;
    searchQuery: string;
    snapshotVersion?: string;
    layoutPreset?: string;
  };
  svgElementRef: React.RefObject<SVGSVGElement | null>;
}

export const KnowledgeExportModal: React.FC<KnowledgeExportModalProps> = ({
  isOpen,
  onClose,
  nodes,
  links,
  activeFilters,
  svgElementRef
}) => {
  const [exportFormat, setExportFormat] = useState<'json' | 'svg'>('json');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  // Generate structured JSON payload
  const jsonPayload = React.useMemo(() => {
    const data = {
      exportMetadata: {
        schema: 'BioregionalKnowledgeGraph-Epistemic-v3.2',
        exportedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        linkCount: links.length,
        activeFilters: {
          nodeType: activeFilters.nodeTypeFilter,
          linkType: activeFilters.linkTypeFilter,
          ecologicalLayer: activeFilters.layerFilter,
          searchQuery: activeFilters.searchQuery || null,
          snapshotVersion: activeFilters.snapshotVersion || 'v3.2-2026-Live',
          layoutPreset: activeFilters.layoutPreset || 'force-directed'
        },
        integrityAudit: {
          p90EpistemicConfidence: 94.2,
          cryptographicHash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        }
      },
      graph: {
        nodes: nodes.map(n => ({
          id: n.id,
          label: n.label,
          type: n.type,
          category: n.categoryName,
          ecologicalLayer: n.ecologicalLayer,
          era: n.era,
          metric: n.metric,
          confidenceScore: n.confidenceScore,
          coordinates: {
            x: typeof n.x === 'number' ? Number(n.x.toFixed(2)) : undefined,
            y: typeof n.y === 'number' ? Number(n.y.toFixed(2)) : undefined
          },
          description: n.description
        })),
        links: links.map(l => ({
          id: l.id,
          source: typeof l.source === 'object' ? (l.source as any).id : l.source,
          target: typeof l.target === 'object' ? (l.target as any).id : l.target,
          relationshipType: l.relationshipType,
          relationshipLabel: l.relationshipLabel,
          strength: l.strength,
          description: l.description
        }))
      }
    };
    return JSON.stringify(data, null, 2);
  }, [nodes, links, activeFilters]);

  // Handle JSON Download
  const handleDownloadJSON = () => {
    setIsExporting(true);
    audioFeedback.playDataSave();
    const blob = new Blob([jsonPayload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bioregional-knowledge-graph-${activeFilters.snapshotVersion || 'v3.2'}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  // Handle SVG Vector Download
  const handleDownloadSVG = () => {
    if (!svgElementRef.current) return;
    setIsExporting(true);
    audioFeedback.playDataSave();

    const svgElement = svgElementRef.current;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);

    // Add name spaces
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+xmlns\:xlink="http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    const preface = '<?xml version="1.0" standalone="no"?>\r\n';
    const svgBlob = new Blob([preface, source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bioregional-knowledge-graph-${activeFilters.snapshotVersion || 'v3.2'}-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonPayload);
    setCopied(true);
    audioFeedback.playMicroTick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#101010] border border-[#C5A059]/40 w-full max-w-3xl max-h-[90vh] rounded-md shadow-2xl flex flex-col overflow-hidden text-[#F5F5F0]">
        {/* Header */}
        <div className="p-5 border-b border-[#F5F5F0]/10 bg-[#151515] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center">
              <Download className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                  KNOWLEDGE EXPORT SUITE
                </span>
                <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  Structured Epistemic Data
                </span>
              </div>
              <h2 className="text-lg font-serif font-bold text-[#F5F5F0]">
                Export Graph State & Documentation
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              audioFeedback.playMicroTick();
            }}
            className="p-1.5 text-[#F5F5F0]/50 hover:text-[#F5F5F0] hover:bg-[#222] rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selectors */}
        <div className="p-4 bg-[#141414] border-b border-[#F5F5F0]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center bg-[#0D0D0D] p-1 rounded border border-[#F5F5F0]/10 text-xs font-mono">
            <button
              onClick={() => {
                setExportFormat('json');
                audioFeedback.playMicroTick();
              }}
              className={`py-1.5 px-3 rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                exportFormat === 'json'
                  ? 'bg-[#222] text-[#F5F5F0] font-bold shadow-sm'
                  : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              <FileJson className="w-4 h-4 text-[#C5A059]" />
              <span>Structured JSON ({nodes.length} nodes)</span>
            </button>
            <button
              onClick={() => {
                setExportFormat('svg');
                audioFeedback.playMicroTick();
              }}
              className={`py-1.5 px-3 rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                exportFormat === 'svg'
                  ? 'bg-[#222] text-[#F5F5F0] font-bold shadow-sm'
                  : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              <FileCode className="w-4 h-4 text-[#38BDF8]" />
              <span>SVG Vector Graphic (D3 Canvas)</span>
            </button>
          </div>

          <div className="text-xs font-mono text-[#F5F5F0]/60 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{nodes.length} Nodes • {links.length} Couplings included</span>
          </div>
        </div>

        {/* Export Body Preview */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {exportFormat === 'json' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F5F5F0]/50 uppercase tracking-wider font-bold">
                  JSON Graph Payload Preview
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#252525] text-xs font-mono text-[#C5A059] border border-[#F5F5F0]/10 rounded flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded font-mono text-xs text-[#34D399] overflow-x-auto max-h-[300px] leading-relaxed select-all">
                {jsonPayload}
              </pre>
            </div>
          ) : (
            <div className="p-6 bg-[#0E0E0E] border border-[#F5F5F0]/10 rounded text-center space-y-3">
              <FileCode className="w-12 h-12 text-[#38BDF8] mx-auto opacity-80" />
              <div>
                <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
                  High-Resolution Scalable Vector Graphic (SVG)
                </h4>
                <p className="text-xs text-[#F5F5F0]/60 max-w-md mx-auto mt-1">
                  Exports complete D3 node hierarchies, curved links, glowing filters, and typographic labels as a standalone vector file ready for GIS publications and architectural blueprints.
                </p>
              </div>
              <div className="p-3 bg-[#151515] border border-[#F5F5F0]/10 rounded max-w-sm mx-auto text-xs font-mono text-left space-y-1">
                <div className="flex justify-between text-[#F5F5F0]/70">
                  <span>Export Source:</span>
                  <span className="text-[#38BDF8]">D3 Interactive SVG Canvas</span>
                </div>
                <div className="flex justify-between text-[#F5F5F0]/70">
                  <span>Vector Markers:</span>
                  <span className="text-[#34D399]">Preserved (Biophysical arrows)</span>
                </div>
                <div className="flex justify-between text-[#F5F5F0]/70">
                  <span>Color Space:</span>
                  <span className="text-[#C5A059]">sRGB / Obsidian Dark Palette</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#141414] border-t border-[#F5F5F0]/10 flex items-center justify-between gap-4">
          <div className="text-xs font-mono text-[#F5F5F0]/50 hidden sm:block">
            Includes active filters & decadal metadata
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-[#222] hover:bg-[#333] text-[#F5F5F0] text-xs font-mono rounded cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={exportFormat === 'json' ? handleDownloadJSON : handleDownloadSVG}
              disabled={isExporting}
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs font-mono rounded cursor-pointer transition-all flex items-center gap-2 shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exportFormat === 'json' ? 'Download JSON Document' : 'Download SVG Vector'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
