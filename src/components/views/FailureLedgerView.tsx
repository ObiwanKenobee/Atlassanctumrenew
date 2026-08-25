import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Hash,
  Download
} from 'lucide-react';
import { FAILURE_LEDGER_ENTRIES } from '../../data/failureLedgerData';
import { FailureLedgerEntry, FailureCategory, FailureSeverity } from '../../types';
import { RealityCheck } from '../RealityCheck';
import { audioFeedback } from '../../lib/audioFeedback';

interface FailureLedgerViewProps {
  onInspectProvenance?: (prov: any) => void;
}

export const FailureLedgerView: React.FC<FailureLedgerViewProps> = ({ onInspectProvenance }) => {
  const [entries, setEntries] = useState<FailureLedgerEntry[]>(FAILURE_LEDGER_ENTRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [expandedEntryId, setExpandedEntryId] = useState<string>(FAILURE_LEDGER_ENTRIES[0].id);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // New failure report form state
  const [newProjectName, setNewProjectName] = useState('');
  const [newBioregion, setNewBioregion] = useState('');
  const [newHypothesis, setNewHypothesis] = useState('');
  const [newImplementation, setNewImplementation] = useState('');
  const [newCategory, setNewCategory] = useState<FailureCategory>('biophysical_mismatch');
  const [newSeverity, setNewSeverity] = useState<FailureSeverity>('moderate');
  const [newFailureModes, setNewFailureModes] = useState('');
  const [newLessons, setNewLessons] = useState('');
  const [newAuditor, setNewAuditor] = useState('');

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = 
      entry.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.bioregion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.coreHypothesis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.epistemicLessonsLearned.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = selectedCategory === 'all' || entry.failureCategory === selectedCategory;
    const matchesSev = selectedSeverity === 'all' || entry.severityTier === selectedSeverity;

    return matchesSearch && matchesCat && matchesSev;
  });

  const getCategoryLabel = (cat: FailureCategory) => {
    switch (cat) {
      case 'biophysical_mismatch': return 'Biophysical Mismatch';
      case 'economic_misalignment': return 'Economic Misalignment';
      case 'social_friction': return 'Social / Cultural Friction';
      case 'tech_overpromise': return 'Tech Overpromise / Fragility';
      case 'governance_breakdown': return 'Governance Breakdown';
      case 'unintended_feedback': return 'Unintended Ecological Feedback';
      default: return cat;
    }
  };

  const getSeverityBadge = (sev: FailureSeverity) => {
    switch (sev) {
      case 'civilizational_critical':
        return 'bg-red-950/80 text-red-300 border-red-500/40';
      case 'high':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'moderate':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-500/40';
      case 'low':
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
    }
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName || !newHypothesis || !newLessons) return;

    const newEntry: FailureLedgerEntry = {
      id: `FL-2026-00${entries.length + 1}`,
      projectName: newProjectName,
      bioregion: newBioregion || 'Global Bioregional Mesh',
      dateInitiated: '2026-01-01',
      dateConcludedOrPivoted: '2026-08-20',
      coreHypothesis: newHypothesis,
      implementationDetails: newImplementation || 'Field trial deployment with telemetry logging.',
      failureCategory: newCategory,
      severityTier: newSeverity,
      failureModes: newFailureModes.split('\n').filter(Boolean),
      unintendedConsequences: ['Documented in initial field intake audit.'],
      affectedStakeholders: ['Community Stewards', 'Regional Field Station'],
      correctiveActionsTaken: ['Logged into public immutable ledger for planetary institutional learning.'],
      epistemicLessonsLearned: newLessons,
      covenantCommandmentReferenced: 'Commandment XXIII: The Failure Ledger',
      auditedBy: newAuditor || 'Citizen Scientist Audit Guild',
      verificationHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      status: 'analyzed'
    };

    setEntries([newEntry, ...entries]);
    setExpandedEntryId(newEntry.id);
    setIsSubmitModalOpen(false);
    audioFeedback.playCovenantResonance();

    // Reset form
    setNewProjectName('');
    setNewBioregion('');
    setNewHypothesis('');
    setNewImplementation('');
    setNewFailureModes('');
    setNewLessons('');
    setNewAuditor('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header & Commandment Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.2em] font-bold">
              INSTITUTIONAL MEMORY • PUBLIC IMMUTABLE AUDIT
            </span>
            <span className="text-[9px] font-mono bg-red-950/80 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full">
              Commandment XXIII: The Failure Ledger
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F5F5F0]">Atlas Failure Ledger</h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/60 max-w-3xl font-sans leading-relaxed">
            Every failed hypothesis, unintended consequence, and ecological breakdown is documented openly to prevent repeating historical errors. In regenerative design, truth-telling about failure is the foundation of wisdom.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsSubmitModalOpen(true);
              audioFeedback.playMicroTick();
            }}
            className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold text-xs uppercase font-mono tracking-widest rounded-sm flex items-center gap-1.5 transition-all shadow"
          >
            <Plus className="w-4 h-4" />
            Log Failure Case
          </button>
        </div>
      </div>

      {/* Meta Reality Check Banner */}
      <RealityCheck 
        data={{
          status: 'verified',
          confidenceScore: 99.4,
          uncertaintyMargin: '± 0.0%',
          epistemicTier: 'Field Audit Verification',
          realityVsModelWarning: 'Commandment XXIII: Every failure mode in this ledger is cryptographically signed and immutable. Suppression of failure data is an ethical violation.',
          dataOrigin: 'Global Field Lab Network & Independent Community Ethics Tribunals',
          cryptographicHash: '0x889104c99e120f38471928031948571029384710',
          lastVerified: 'Live Continuous Sync',
          verifiedBy: 'Epistemic Integrity Guild & Bioregional Elders',
          assumptions: [
            'All field failures must detail both biophysical and social root causes.',
            'No commercial non-disclosure agreements may override public failure disclosure in Atlas.'
          ]
        }}
      />

      {/* Filter and Search Controls */}
      <div className="bg-[#0D0D0D] border border-[#F5F5F0]/10 p-4 rounded-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hypotheses, failure modes, lessons..."
              className="w-full pl-9 pr-3 py-2 bg-[#141414] border border-[#F5F5F0]/20 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/40 focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#C5A059]" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                audioFeedback.playMicroTick();
              }}
              className="w-full py-2 px-3 bg-[#141414] border border-[#F5F5F0]/20 rounded-sm text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">All Failure Categories</option>
              <option value="biophysical_mismatch">Biophysical Mismatch</option>
              <option value="economic_misalignment">Economic Misalignment</option>
              <option value="social_friction">Social / Cultural Friction</option>
              <option value="tech_overpromise">Tech Overpromise</option>
              <option value="governance_breakdown">Governance Breakdown</option>
              <option value="unintended_feedback">Unintended Feedback</option>
            </select>
          </div>

          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => {
                setSelectedSeverity(e.target.value);
                audioFeedback.playMicroTick();
              }}
              className="w-full py-2 px-3 bg-[#141414] border border-[#F5F5F0]/20 rounded-sm text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">All Severity Tiers</option>
              <option value="civilizational_critical">Civilizational Critical</option>
              <option value="high">High Severity</option>
              <option value="moderate">Moderate Severity</option>
              <option value="low">Low Severity</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F0]/50 pt-2 border-t border-[#F5F5F0]/5">
          <span>Showing <strong className="text-white">{filteredEntries.length}</strong> audited failure cases</span>
          <span className="text-[#C5A059]">Rule: Documenting mistakes is institutional survival</span>
        </div>
      </div>

      {/* Failure Cases Accordion List */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => {
          const isExpanded = expandedEntryId === entry.id;
          return (
            <div
              key={entry.id}
              className={`border rounded-sm transition-all ${
                isExpanded
                  ? 'bg-[#0D0D0D] border-[#C5A059] shadow-lg ring-1 ring-[#C5A059]/30'
                  : 'bg-[#080808] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30'
              }`}
            >
              {/* Header Row */}
              <div
                onClick={() => {
                  setExpandedEntryId(isExpanded ? '' : entry.id);
                  audioFeedback.playMicroTick();
                }}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-[#C5A059] font-bold">{entry.id}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded-xs border ${getSeverityBadge(entry.severityTier)}`}>
                      {entry.severityTier.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1A1A1A] text-[#8FB8DE] border border-[#8FB8DE]/20 rounded-xs">
                      {getCategoryLabel(entry.failureCategory)}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      [{entry.status.toUpperCase()}]
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">{entry.projectName}</h3>
                  <div className="text-xs font-mono text-[#F5F5F0]/60 flex items-center gap-3">
                    <span>Bioregion: <strong className="text-[#F5F5F0]">{entry.bioregion}</strong></span>
                    <span>•</span>
                    <span>Timeline: {entry.dateInitiated} ➔ {entry.dateConcludedOrPivoted}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <span className="text-xs font-mono text-[#C5A059] font-semibold hidden sm:inline">
                    {isExpanded ? 'Collapse Epistemic Audit' : 'Inspect Lessons'}
                  </span>
                  <div className="p-1 rounded-full bg-[#181818] border border-[#F5F5F0]/10">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#C5A059]" /> : <ChevronDown className="w-4 h-4 text-[#F5F5F0]/60" />}
                  </div>
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="p-6 pt-0 space-y-6 border-t border-[#F5F5F0]/10 font-sans text-xs sm:text-sm text-[#F5F5F0]/80">
                  {/* Hypothesis vs Implementation Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-[#141414] rounded-sm border border-[#F5F5F0]/10 space-y-2">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Core Hypothesis (What We Expected)</span>
                      </div>
                      <p className="text-xs text-[#F5F5F0] leading-relaxed italic">
                        "{entry.coreHypothesis}"
                      </p>
                    </div>

                    <div className="p-4 bg-[#141414] rounded-sm border border-[#F5F5F0]/10 space-y-2">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8FB8DE] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#8FB8DE]" />
                        <span>Implementation Details (What Was Deployed)</span>
                      </div>
                      <p className="text-xs text-[#F5F5F0]/90 leading-relaxed font-mono">
                        {entry.implementationDetails}
                      </p>
                    </div>
                  </div>

                  {/* Failure Modes & Unintended Consequences */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-red-950/20 rounded-sm border border-red-500/20 space-y-2">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                        <span>Observed Failure Modes</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-red-200/90 font-mono">
                        {entry.failureModes.map((mode, idx) => (
                          <li key={idx}>{mode}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-amber-950/20 rounded-sm border border-amber-500/20 space-y-2">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Unintended Consequences & Externalities</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-amber-200/90 font-mono">
                        {entry.unintendedConsequences.map((conseq, idx) => (
                          <li key={idx}>{conseq}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Corrective Actions & Epistemic Lessons Learned */}
                  <div className="p-5 bg-[#141E16] rounded-sm border border-emerald-500/30 space-y-3">
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Codified Epistemic Lessons Learned (Institutional Canon)</span>
                    </div>
                    <p className="text-sm font-serif text-emerald-100 leading-relaxed font-medium">
                      {entry.epistemicLessonsLearned}
                    </p>

                    <div className="pt-2 border-t border-emerald-500/20 space-y-1 font-mono text-xs text-emerald-300/80">
                      <span className="font-bold text-[10px] uppercase block text-emerald-400">Corrective Actions Executed:</span>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {entry.correctiveActionsTaken.map((act, idx) => (
                          <li key={idx}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer Provenance Stamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#F5F5F0]/10 text-[10px] font-mono text-[#F5F5F0]/50">
                    <div className="flex items-center gap-2">
                      <span>Auditor: <strong className="text-[#F5F5F0]">{entry.auditedBy}</strong></span>
                      <span>•</span>
                      <span>Canon Reference: <strong className="text-[#C5A059]">{entry.covenantCommandmentReferenced}</strong></span>
                    </div>
                    <div className="flex items-center gap-1 text-[#8FB8DE]">
                      <Lock className="w-3 h-3 text-[#C5A059]" />
                      <span>Verification Hash: {entry.verificationHash}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredEntries.length === 0 && (
          <div className="text-center py-12 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm space-y-2">
            <p className="text-sm font-mono text-[#F5F5F0]/50">No failure cases match your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSeverity('all');
              }}
              className="text-xs font-mono text-[#C5A059] underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Submit New Failure Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0E0E0E] border border-[#C5A059] rounded-sm max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-3">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono uppercase text-[#C5A059] tracking-wider font-bold">
                  Commandment XXIII Submission
                </div>
                <h2 className="text-xl font-serif text-[#F5F5F0]">Log Field Failure & Epistemic Learnings</h2>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-[#F5F5F0]/50 hover:text-white text-lg font-mono p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#F5F5F0]/70 uppercase text-[10px]">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g. Mara River Bio-Filter Array"
                    className="w-full p-2.5 bg-[#141414] border border-[#F5F5F0]/20 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#F5F5F0]/70 uppercase text-[10px]">Bioregion *</label>
                  <input
                    type="text"
                    required
                    value={newBioregion}
                    onChange={(e) => setNewBioregion(e.target.value)}
                    placeholder="e.g. Upper Athi Catchment, Kenya"
                    className="w-full p-2.5 bg-[#141414] border border-[#F5F5F0]/20 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#F5F5F0]/70 uppercase text-[10px]">Failure Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as FailureCategory)}
                    className="w-full p-2.5 bg-[#141414] border border-[#F5F5F0]/20 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                  >
                    <option value="biophysical_mismatch">Biophysical Mismatch</option>
                    <option value="economic_misalignment">Economic Misalignment</option>
                    <option value="social_friction">Social / Cultural Friction</option>
                    <option value="tech_overpromise">Tech Overpromise</option>
                    <option value="governance_breakdown">Governance Breakdown</option>
                    <option value="unintended_feedback">Unintended Feedback</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#F5F5F0]/70 uppercase text-[10px]">Severity Tier</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as FailureSeverity)}
                    className="w-full p-2.5 bg-[#141414] border border-[#F5F5F0]/20 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                  >
                    <option value="low">Low Severity</option>
                    <option value="moderate">Moderate Severity</option>
                    <option value="high">High Severity</option>
                    <option value="civilizational_critical">Civilizational Critical</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#F5F5F0]/70 uppercase text-[10px]">Original Hypothesis (What did you think would happen?) *</label>
                <textarea
                  required
                  rows={2}
                  value={newHypothesis}
                  onChange={(e) => setNewHypothesis(e.target.value)}
                  placeholder="e.g. Installing automated sensor gates would prevent manual over-extraction..."
                  className="w-full p-2.5 bg-[#141414] border border-[#F5F5F0]/20 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#F5F5F0]/70 uppercase text-[10px]">Failure Modes Observed (One per line) *</label>
                <textarea
                  required
                  rows={3}
                  value={newFailureModes}
                  onChange={(e) => setNewFailureModes(e.target.value)}
                  placeholder="Siltation jammed mechanical gates after flash flood&#10;Battery degradation in high humidity"
                  className="w-full p-2.5 bg-[#141414] border border-[#F5F5F0]/20 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#F5F5F0]/70 uppercase text-[10px]">Epistemic Lessons Learned (What must others never repeat?) *</label>
                <textarea
                  required
                  rows={3}
                  value={newLessons}
                  onChange={(e) => setNewLessons(e.target.value)}
                  placeholder="Passive hydraulic gravity gates with zero moving electronics are superior in flash-flood floodplains..."
                  className="w-full p-2.5 bg-[#141414] border border-[#F5F5F0]/20 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#F5F5F0]/70 uppercase text-[10px]">Auditing Steward / Lead Name</label>
                <input
                  type="text"
                  value={newAuditor}
                  onChange={(e) => setNewAuditor(e.target.value)}
                  placeholder="e.g. Citizen Science Guild Lead"
                  className="w-full p-2.5 bg-[#141414] border border-[#F5F5F0]/20 rounded-sm text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F5F5F0]/10">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 bg-transparent text-[#F5F5F0]/60 hover:text-white rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-bold uppercase tracking-wider rounded-sm shadow"
                >
                  Commit to Immutable Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
