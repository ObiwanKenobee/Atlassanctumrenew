import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Scale, 
  ShieldCheck, 
  Search, 
  Copy, 
  Check, 
  Download, 
  Sparkles,
  TreeDeciduous,
  Flame,
  Globe2,
  Lock,
  Layers,
  Heart,
  FileCode
} from 'lucide-react';
import { ARCHITECTURAL_COMMANDMENTS, CivilizationCommandment } from '../data/commandmentsData';

interface CommandmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCommandment?: (commandment: CivilizationCommandment) => void;
}

export const CommandmentsModal: React.FC<CommandmentsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [activeCommandmentId, setActiveCommandmentId] = useState<number>(1);

  if (!isOpen) return null;

  const categories = ['All', 'Human Dignity', 'Capital & Usury', 'Planetary Boundaries', 'Epistemics & Commons', 'Governance & Veto', 'Labor & Sovereignty', 'Intergenerational', 'Causal Truth', 'Anti-Fragility', 'Universal Access'];

  const filteredCommandments = ARCHITECTURAL_COMMANDMENTS.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.shortMaxim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.architecturalRule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeCommandment = ARCHITECTURAL_COMMANDMENTS.find(c => c.id === activeCommandmentId) || ARCHITECTURAL_COMMANDMENTS[0];

  const handleCopy = (c: CivilizationCommandment, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `ATLAS SANCTUM COMMANDMENT ${c.romanNumeral}: ${c.title}
"${c.shortMaxim}"

• Moral Root: ${c.moralRoot}
• Architectural Rule: ${c.architecturalRule}
• System Enforcement: ${c.systemEnforcement}
• Biophysical Boundary: ${c.biophysicalBoundary}
• Violation Trigger: ${c.violationTrigger}
• Flourishing Impact: ${c.flourishingImpact}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(c.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleExportAll = () => {
    const markdown = `# THE 10 COMMANDMENTS OF ATLAS SANCTUM ARCHITECTURE
*Foundational Covenants Governing All Systems, Infrastructure, and Capital Models*
Generated: ${new Date().toISOString()}

---

${ARCHITECTURAL_COMMANDMENTS.map(c => `## COMMANDMENT ${c.romanNumeral}: ${c.title}
> *"${c.shortMaxim}"*

- **Moral Root**: ${c.moralRoot}
- **Architectural Rule**: ${c.architecturalRule}
- **System Enforcement**: ${c.systemEnforcement}
- **Biophysical Boundary**: ${c.biophysicalBoundary}
- **Violation Trigger**: ${c.violationTrigger}
- **Flourishing Impact**: ${c.flourishingImpact}
- **Category**: ${c.category}
- **Tags**: ${c.tags.join(', ')}
`).join('\n---\n\n')}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-sanctum-10-commandments-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-[#0A0A0A] border border-[#C5A059]/40 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#0D0D0D] border-b border-[#F5F5F0]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full border-2 border-[#C5A059] flex items-center justify-center bg-[#050505] shrink-0">
              <Scale className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                  CONSTITUTIONAL COVENANTS
                </span>
                <span className="px-2 py-0.5 bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/30 rounded-full text-[9px] font-mono">
                  10 COMMANDMENTS
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0]">
                The 10 Commandments of Atlas Sanctum Architecture
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAll}
              className="px-3 py-1.5 bg-[#141414] hover:bg-[#1E1E1E] border border-[#F5F5F0]/15 text-xs font-mono text-[#F5F5F0] rounded-xs flex items-center gap-1.5 transition-colors"
              title="Download Markdown Document"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Export Covenants</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#1A1A1A] rounded transition-colors"
              aria-label="Close Commandments Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-[#080808] border-b border-[#F5F5F0]/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#F5F5F0]/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search commandments or keywords..."
              className="w-full bg-[#121212] border border-[#F5F5F0]/15 rounded-xs pl-8 pr-3 py-1.5 text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-[#C5A059] font-mono"
            />
          </div>

          {/* Category Pills (horizontal scroll) */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 [&::-webkit-scrollbar]:none">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-xs text-[10px] font-mono whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#C5A059] text-black font-bold'
                    : 'bg-[#141414] text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#1C1C1C]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Main Content (2 Columns: List on Left, Deep Inspector on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-[#F5F5F0]/10">
          {/* Left Column: Commandment Selector List */}
          <div className="lg:col-span-5 overflow-y-auto p-4 space-y-2.5 max-h-[40vh] lg:max-h-full">
            {filteredCommandments.map((c) => {
              const isSelected = activeCommandment.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveCommandmentId(c.id)}
                  className={`p-3.5 rounded-sm border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#151515] border-[#C5A059] shadow-md'
                      : 'bg-[#0D0D0D] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30 hover:bg-[#121212]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#050505] border border-[#C5A059]/40 text-[#C5A059] font-serif font-bold text-xs rounded-xs">
                        {c.romanNumeral}
                      </span>
                      <h4 className="text-xs font-serif font-bold text-[#F5F5F0] line-clamp-1">
                        {c.title}
                      </h4>
                    </div>
                    <button
                      onClick={(e) => handleCopy(c, e)}
                      title="Copy Commandment"
                      className="text-[#F5F5F0]/40 hover:text-[#C5A059] transition-colors p-1"
                    >
                      {copiedId === c.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#F5F5F0]/70 italic mt-1.5 font-serif line-clamp-2">
                    "{c.shortMaxim}"
                  </p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#F5F5F0]/5 text-[9px] font-mono text-[#F5F5F0]/50">
                    <span className="text-[#C5A059]">{c.category}</span>
                    <span>•</span>
                    <span>{c.tags.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Architectural Blueprint & Enforcement View */}
          <div className="lg:col-span-7 overflow-y-auto p-6 space-y-6 bg-[#0B0B0B]">
            {/* Header of Active Commandment */}
            <div className="space-y-3 border-b border-[#F5F5F0]/10 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#1A1A1A] border border-[#C5A059] text-[#C5A059] font-serif font-bold text-sm rounded-xs">
                    COMMANDMENT {activeCommandment.romanNumeral}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8FB8DE]">
                    {activeCommandment.category}
                  </span>
                </div>
                <button
                  onClick={(e) => handleCopy(activeCommandment, e)}
                  className="px-3 py-1 bg-[#151515] hover:bg-[#202020] border border-[#F5F5F0]/15 text-xs font-mono text-[#F5F5F0] rounded-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedId === activeCommandment.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#C5A059]" />
                      <span>Copy Covenant</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F5F0] leading-snug">
                {activeCommandment.title}
              </h3>
              <p className="text-sm text-[#C5A059] italic font-serif bg-[#121212] p-3 border-l-2 border-[#C5A059] rounded-r-sm">
                "{activeCommandment.shortMaxim}"
              </p>
            </div>

            {/* Structured Specifications Grid */}
            <div className="space-y-4">
              {/* 1. Moral & Scriptural Root */}
              <div className="p-3.5 bg-[#101010] border border-[#F5F5F0]/10 rounded-sm space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#8FB8DE] font-bold">
                  01. Moral Foundation & Ethical Root
                </span>
                <p className="text-xs text-[#F5F5F0]/90 leading-relaxed font-sans">
                  {activeCommandment.moralRoot}
                </p>
              </div>

              {/* 2. Strict Architectural Rule */}
              <div className="p-3.5 bg-[#101010] border border-[#C5A059]/30 rounded-sm space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#C5A059] font-bold">
                  02. Inviolable Architectural Covenant
                </span>
                <p className="text-xs text-[#F5F5F0] leading-relaxed font-sans font-medium">
                  {activeCommandment.architecturalRule}
                </p>
              </div>

              {/* 3. Systemic Technical Enforcement */}
              <div className="p-3.5 bg-[#101010] border border-emerald-500/30 rounded-sm space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                  03. Technical Implementation & Systemic Guardrails
                </span>
                <p className="text-xs text-[#F5F5F0]/90 leading-relaxed font-sans">
                  {activeCommandment.systemEnforcement}
                </p>
              </div>

              {/* 4. Biophysical Boundary & Violation Trigger */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#101010] border border-[#F5F5F0]/10 rounded-sm space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/60 font-bold">
                    Biophysical Boundary
                  </span>
                  <p className="text-[11px] text-[#F5F5F0]/80 leading-relaxed">
                    {activeCommandment.biophysicalBoundary}
                  </p>
                </div>

                <div className="p-3 bg-[#180A0A] border border-rose-500/30 rounded-sm space-y-1">
                  <span className="text-[10px] font-mono uppercase text-rose-400 font-bold">
                    Strict Violation Trigger
                  </span>
                  <p className="text-[11px] text-rose-200/90 leading-relaxed">
                    {activeCommandment.violationTrigger}
                  </p>
                </div>
              </div>

              {/* 5. Flourishing Impact */}
              <div className="p-3.5 bg-[#1B3022]/40 border border-[#1B3022] rounded-sm space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold">
                  04. Long-Horizon Flourishing Outcome
                </span>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  {activeCommandment.flourishingImpact}
                </p>
              </div>
            </div>

            {/* Tag Pills */}
            <div className="pt-2 flex flex-wrap gap-2">
              {activeCommandment.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-[#161616] text-[#F5F5F0]/60 border border-[#F5F5F0]/10 rounded text-[9px] font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#080808] border-t border-[#F5F5F0]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F5F5F0]/50 font-mono">
          <span>Atlas Sanctum Civilization Operating System</span>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-[#C5A059]">Faith in our why.</span>
            <span>•</span>
            <span className="text-[#8FB8DE]">Intelligence in our systems.</span>
            <span>•</span>
            <span className="text-emerald-400">Love in our impact.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
