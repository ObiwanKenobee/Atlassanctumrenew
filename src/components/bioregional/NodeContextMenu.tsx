import React, { useState, useEffect, useRef } from 'react';
import {
  Tag,
  Palette,
  X,
  Check,
  Trash2,
  Save,
  ShieldAlert,
  Sparkles,
  Cloud,
  FileText
} from 'lucide-react';
import type { KnowledgeNode } from './BioregionalKnowledgeGraph';
import {
  BioregionalCustomTag,
  saveNodeCustomTag,
  deleteNodeCustomTag
} from '../../services/bioregionalKnowledgeService';
import { audioFeedback } from '../../lib/audioFeedback';

interface NodeContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  node: KnowledgeNode | null;
  existingTag?: BioregionalCustomTag;
  onClose: () => void;
  onTagSaved: () => void;
}

const COLOR_SWATCHES = [
  { hex: '#10B981', label: 'Emerald (Equilibrium / Restored)' },
  { hex: '#38BDF8', label: 'Cyan (Hydrology / Catchment Priority)' },
  { hex: '#F59E0B', label: 'Amber (Field Review / Inoculation)' },
  { hex: '#F43F5E', label: 'Rose (Fauna / Bio-Acoustic Landmark)' },
  { hex: '#A855F7', label: 'Purple (Customary Elder Governance)' },
  { hex: '#C5A059', label: 'Gold (High-Value Keystone Carbon Sink)' },
  { hex: '#EF4444', label: 'Red (Critical Infiltration Alert / At-Risk)' }
];

const TAG_CATEGORIES = [
  'Critical Field Priority',
  'Under In-Situ Inoculation',
  'Piezometer / Hydrology Watch',
  'Customary Knowledge Landmark',
  'Model Calibration Variance',
  'Verified Carbon Sink Anchor',
  'Restoration Baseline Marker'
];

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  isOpen,
  x,
  y,
  node,
  existingTag,
  onClose,
  onTagSaved
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [customLabel, setCustomLabel] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('#10B981');
  const [selectedCategory, setSelectedCategory] = useState<string>(TAG_CATEGORIES[0]);
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sync existing tag when opened
  useEffect(() => {
    if (node) {
      if (existingTag) {
        setCustomLabel(existingTag.customLabel || '');
        setSelectedColor(existingTag.tagColor || '#10B981');
        setSelectedCategory(existingTag.tagCategory || TAG_CATEGORIES[0]);
        setNotes(existingTag.notes || '');
      } else {
        setCustomLabel('');
        setSelectedColor('#10B981');
        setSelectedCategory(TAG_CATEGORIES[0]);
        setNotes('');
      }
    }
  }, [node, existingTag, isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !node) return null;

  // Bound calculations so the menu never overflows viewport
  const menuWidth = 320;
  const menuHeight = 440;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 20);
  const adjustedY = Math.min(y, window.innerHeight - menuHeight - 20);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    audioFeedback.playSubtleClick();

    const newTag: BioregionalCustomTag = {
      nodeId: node.id,
      customLabel: customLabel.trim() || undefined,
      tagColor: selectedColor,
      tagCategory: selectedCategory,
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString()
    };

    await saveNodeCustomTag(newTag);
    setIsSaving(false);
    audioFeedback.playDataSave();
    onTagSaved();
    onClose();
  };

  const handleDelete = async () => {
    setIsSaving(true);
    audioFeedback.playMicroTick();
    await deleteNodeCustomTag(node.id);
    setIsSaving(false);
    onTagSaved();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={{ top: `${adjustedY}px`, left: `${adjustedX}px` }}
      className="fixed z-50 w-80 bg-[#121212] border border-[#C5A059]/50 shadow-2xl rounded-sm p-4 text-[#F5F5F0] space-y-3 animate-in fade-in zoom-in-95 duration-150 select-none text-left"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-[#F5F5F0]/10 pb-2">
        <div className="space-y-0.5 max-w-[240px]">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#C5A059] uppercase font-bold">
            <Tag className="w-3 h-3 text-[#C5A059]" />
            <span>CUSTOM STEWARD TAG (FIRESTORE)</span>
          </div>
          <h4 className="text-xs font-serif font-bold text-[#F5F5F0] truncate">
            {node.label}
          </h4>
        </div>
        <button
          onClick={onClose}
          className="text-[#F5F5F0]/40 hover:text-[#F5F5F0] p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        {/* Custom Label / Nickname Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/60 block">
            Custom Label / Steward Alias:
          </label>
          <input
            type="text"
            placeholder="e.g. Infiltration Target #4"
            value={customLabel}
            onChange={e => setCustomLabel(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#090909] border border-[#F5F5F0]/15 rounded-xs text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/30 font-mono outline-none focus:border-[#C5A059]"
          />
        </div>

        {/* Color-Coded Swatch Palette */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/60">
            <span className="uppercase">Color Code Tag:</span>
            <span style={{ color: selectedColor }} className="font-bold">
              ● Active Color
            </span>
          </div>
          <div className="flex items-center gap-2">
            {COLOR_SWATCHES.map(swatch => (
              <button
                type="button"
                key={swatch.hex}
                title={swatch.label}
                onClick={() => {
                  setSelectedColor(swatch.hex);
                  audioFeedback.playMicroTick();
                }}
                style={{ backgroundColor: swatch.hex }}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                  selectedColor === swatch.hex
                    ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#121212]'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {selectedColor === swatch.hex && <Check className="w-3 h-3 text-black font-bold" />}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Category */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/60 block">
            Priority Status Classification:
          </label>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#090909] border border-[#F5F5F0]/15 rounded-xs text-xs text-[#F5F5F0] font-mono outline-none focus:border-[#C5A059] cursor-pointer"
          >
            {TAG_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Steward Notes */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/60 block">
            Field Notes / Telemetry Anomaly:
          </label>
          <textarea
            rows={2}
            placeholder="Document field observations or local calibration instructions..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#090909] border border-[#F5F5F0]/15 rounded-xs text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/30 font-sans outline-none focus:border-[#C5A059] resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#F5F5F0]/10 flex items-center justify-between gap-2">
          {existingTag ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
              title="Delete Custom Tag"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[9px] font-mono text-[#F5F5F0]/40 flex items-center gap-1">
              <Cloud className="w-3 h-3 text-[#C5A059]" />
              Syncs to Firestore
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 bg-[#222] hover:bg-[#2A2A2A] text-[11px] font-mono text-[#F5F5F0]/70 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-3 py-1 bg-[#C5A059] text-black hover:bg-[#D4AF37] font-mono font-bold text-[11px] rounded flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#C5A059]/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Tag'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
