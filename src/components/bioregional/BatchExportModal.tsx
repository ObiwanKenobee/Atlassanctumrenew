import React, { useState } from 'react';
import {
  Download,
  X,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  Layers,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';
import type { KnowledgeNode, KnowledgeLink } from './BioregionalKnowledgeGraph';
import {
  exportNodesToCSV,
  exportNodesToJSON,
  downloadFile,
  BioregionalCustomTag
} from '../../services/bioregionalKnowledgeService';
import { audioFeedback } from '../../lib/audioFeedback';

interface BatchExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNodes: KnowledgeNode[];
  allLinks: KnowledgeLink[];
  customTags: Record<string, BioregionalCustomTag>;
  bioregionId?: string;
}

export const BatchExportModal: React.FC<BatchExportModalProps> = ({
  isOpen,
  onClose,
  selectedNodes,
  allLinks,
  customTags,
  bioregionId = 'aberdare_riparian_watershed'
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [includeTags, setIncludeTags] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportedSuccess, setExportedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);
    audioFeedback.playSubtleClick();

    setTimeout(() => {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `bioregional-knowledge-graph-${bioregionId}-${timestamp}`;

      if (exportFormat === 'csv') {
        const csvData = exportNodesToCSV(
          selectedNodes,
          allLinks,
          includeTags ? customTags : {}
        );
        downloadFile(csvData, `${filename}.csv`, 'text/csv;charset=utf-8;');
      } else {
        const jsonData = exportNodesToJSON(
          selectedNodes,
          allLinks,
          includeTags ? customTags : {},
          {
            bioregionId,
            exportDate: new Date().toISOString(),
            generatedBy: 'Atlas Civilizational Knowledge Engine'
          }
        );
        downloadFile(jsonData, `${filename}.json`, 'application/json');
      }

      setIsExporting(false);
      setExportedSuccess(true);
      audioFeedback.playDataSave();

      setTimeout(() => {
        setExportedSuccess(false);
        onClose();
      }, 1500);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111111] border border-[#C5A059]/40 rounded-sm w-full max-w-lg shadow-2xl overflow-hidden space-y-4 text-[#F5F5F0]">
        {/* Header */}
        <div className="p-4 border-b border-[#F5F5F0]/10 bg-[#161616] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-[#C5A059]" />
            <h3 className="text-base font-serif font-bold text-[#F5F5F0]">
              Batch Export Selected Ecological Nodes
            </h3>
          </div>
          <button
            onClick={() => {
              onClose();
              audioFeedback.playMicroTick();
            }}
            className="text-[#F5F5F0]/40 hover:text-[#F5F5F0] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-left">
          {/* Selected Nodes Summary */}
          <div className="p-3 bg-[#0A0A0A] border border-[#F5F5F0]/10 rounded-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F5F5F0]/60">Selected Evidence Items:</span>
              <span className="text-[#C5A059] font-bold">{selectedNodes.length} Nodes Ready</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {selectedNodes.map(node => (
                <span
                  key={node.id}
                  className="px-2 py-0.5 bg-[#1C1C1C] border border-[#F5F5F0]/10 rounded text-[10px] font-mono text-[#F5F5F0]/80 truncate max-w-[200px]"
                >
                  {node.label}
                </span>
              ))}
            </div>
          </div>

          {/* Export Format Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-[#C5A059] font-bold block">
              Choose Data Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* CSV Option */}
              <button
                type="button"
                onClick={() => {
                  setExportFormat('csv');
                  audioFeedback.playMicroTick();
                }}
                className={`p-3 rounded-sm border flex flex-col gap-1 text-left transition-all cursor-pointer ${
                  exportFormat === 'csv'
                    ? 'bg-[#1C170E] border-[#C5A059] shadow-lg shadow-[#C5A059]/10'
                    : 'bg-[#161616] hover:bg-[#1C1C1C] border-[#F5F5F0]/10 text-[#F5F5F0]/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  {exportFormat === 'csv' && <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />}
                </div>
                <span className="text-xs font-mono font-bold text-[#F5F5F0]">Formatted CSV</span>
                <span className="text-[10px] text-[#F5F5F0]/50 font-sans">
                  Tabular layout for spreadsheet tools (Excel, Sheets, Pandas)
                </span>
              </button>

              {/* JSON Option */}
              <button
                type="button"
                onClick={() => {
                  setExportFormat('json');
                  audioFeedback.playMicroTick();
                }}
                className={`p-3 rounded-sm border flex flex-col gap-1 text-left transition-all cursor-pointer ${
                  exportFormat === 'json'
                    ? 'bg-[#1C170E] border-[#C5A059] shadow-lg shadow-[#C5A059]/10'
                    : 'bg-[#161616] hover:bg-[#1C1C1C] border-[#F5F5F0]/10 text-[#F5F5F0]/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  {exportFormat === 'json' && <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />}
                </div>
                <span className="text-xs font-mono font-bold text-[#F5F5F0]">Structured JSON</span>
                <span className="text-[10px] text-[#F5F5F0]/50 font-sans">
                  Deep object graph with nested couplings & Section 30 hashes
                </span>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2 pt-2 border-t border-[#F5F5F0]/10">
            <label className="flex items-center gap-2 text-xs font-mono text-[#F5F5F0]/80 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTags}
                onChange={e => setIncludeTags(e.target.checked)}
                className="accent-[#C5A059] rounded cursor-pointer"
              />
              <span>Include Custom Steward Tags and Color Annotations</span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#F5F5F0]/10 bg-[#161616] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              audioFeedback.playMicroTick();
            }}
            className="px-3 py-2 bg-[#222] hover:bg-[#2A2A2A] text-xs font-mono text-[#F5F5F0]/70 rounded transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting || selectedNodes.length === 0}
            className={`px-4 py-2 font-mono font-bold text-xs rounded flex items-center gap-2 transition-all cursor-pointer ${
              exportedSuccess
                ? 'bg-emerald-500 text-black'
                : 'bg-[#C5A059] text-black hover:bg-[#D4AF37] shadow-lg shadow-[#C5A059]/20'
            }`}
          >
            {exportedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Export Downloaded!</span>
              </>
            ) : isExporting ? (
              <span>Preparing Bundle...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download {exportFormat.toUpperCase()} Bundle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
