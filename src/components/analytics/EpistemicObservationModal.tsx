import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  ExternalLink, 
  AlertCircle, 
  Layers, 
  Activity, 
  Calendar, 
  Hash, 
  Compass, 
  HeartHandshake,
  Award,
  ArrowRight
} from 'lucide-react';
import { EvidenceLedgerEntry } from '../../types';
import { MonthlyTrendDataPoint } from './FlourishingVsStabilityD3Chart';
import { TimelineAnnotationMarker } from './flourishingAnalyticsData';
import { audioFeedback } from '../../lib/audioFeedback';
import { db } from '../../lib/db';

interface EpistemicObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  point?: MonthlyTrendDataPoint | null;
  bioregionName: string;
  bioregionId?: string;
  bioregionBiome?: string;
  onObservationSaved?: (entry: EvidenceLedgerEntry, annotation: TimelineAnnotationMarker) => void;
  onSelectTab?: (tabId: string) => void;
  onNavigateToLedger?: () => void;
}

export const EpistemicObservationModal: React.FC<EpistemicObservationModalProps> = ({
  isOpen,
  onClose,
  point,
  bioregionName,
  bioregionId,
  bioregionBiome = 'Savanna & Montane Ecosystem Matrix',
  onObservationSaved,
  onSelectTab,
  onNavigateToLedger
}) => {
  const activePoint: MonthlyTrendDataPoint = point || {
    monthIndex: 12,
    shortMonth: 'M12',
    monthLabel: 'Month 12',
    calendarMonth: 'Sep 2026',
    exactDate: 'September 14, 2026',
    isoDate: '2026-09-14',
    ecologicalFlourishing: 92.4,
    economicStability: 89.2,
    extractiveCounterfactual: 41.2,
    decouplingMargin: 51.2,
    verifiedSensorCount: 4200,
    milestone: '12-Month Epistemic Covenant Parity Ratified',
    cryptographicHash: '0xff182930485716259018471029384756',
    epistemicTier: 'Zero-Knowledge Multi-Spectral Mesh'
  };

  const [claim, setClaim] = useState<string>(
    `Field verification at ${activePoint.calendarMonth}: Ecological flourishing at ${activePoint.ecologicalFlourishing}% with decoupling margin of +${activePoint.decouplingMargin.toFixed(1)} pts.`
  );
  const [observerName, setObserverName] = useState<string>('Bioregional Field Steward Quorum');
  const [observerRole, setObserverRole] = useState<string>('Lead Soil & Hydrological Verifier');
  const [methodology, setMethodology] = useState<string>(
    `Triangulated Sentinel-2 NDVI telemetry, calibrated ground piezometer mesh, and verified biochar soil core sampling.`
  );
  const [outcomeNotes, setOutcomeNotes] = useState<string>(
    activePoint.milestone 
      ? `Confirmed milestone: ${activePoint.milestone}. Positive decoupling sustained against extractive regional trends.` 
      : `Ground truth confirmation of accelerated vegetative regeneration and non-extractive resource circulation.`
  );
  const [epistemicStatus, setEpistemicStatus] = useState<EvidenceLedgerEntry['epistemicStatus']>('Observed');
  const [attributionType, setAttributionType] = useState<EvidenceLedgerEntry['attributionType']>('Attribution');
  const [confidenceScore, setConfidenceScore] = useState<number>(94);
  const [moralAlignmentScore, setMoralAlignmentScore] = useState<number>(96);
  const [regenerativePriority, setRegenerativePriority] = useState<EvidenceLedgerEntry['regenerativePotentialPriority']>('Critical');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [savedEntry, setSavedEntry] = useState<EvidenceLedgerEntry | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim()) {
      setErrorMessage('Please provide an observation claim title.');
      return;
    }
    if (!outcomeNotes.trim()) {
      setErrorMessage('Please include empirical field notes or outcome description.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const timestamp = new Date().toISOString();
    const entryId = `obs-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const randomHex = Math.random().toString(16).substring(2, 10);
    const observationHash = point.cryptographicHash 
      ? `${point.cryptographicHash.slice(0, 10)}...${randomHex}` 
      : `0x${randomHex}${Date.now().toString(16)}`;

    const newLedgerEntry: EvidenceLedgerEntry = {
      id: entryId,
      claim: claim.trim(),
      source: `${bioregionName} Field Observation Post (${bioregionBiome})`,
      methodology: methodology.trim(),
      intervention: `Bioregional covenant stewardship at ${bioregionName} (${point.calendarMonth})`,
      measurement: `Ecological Flourishing: ${point.ecologicalFlourishing}% • Economic Stability: ${point.economicStability}% • Decoupling: +${point.decouplingMargin.toFixed(1)} pts`,
      outcome: outcomeNotes.trim(),
      epistemicStatus,
      confidenceScore,
      hash: observationHash,
      timestamp,
      verifier: `${observerName.trim()} (${observerRole.trim()})`,
      attributionType,
      moralAlignmentScore,
      regenerativePotentialPriority: regenerativePriority,
      regenerativeScore: Math.round(point.ecologicalFlourishing),
      version: 1,
      localUpdatedAt: Date.now()
    };

    const annotationMarker: TimelineAnnotationMarker = {
      id: `anno-${entryId}`,
      monthIndex: point.monthIndex,
      shortMonth: point.shortMonth,
      calendarMonth: point.calendarMonth,
      date: point.exactDate || point.calendarMonth,
      title: claim.trim().slice(0, 48),
      category: 'custom',
      categoryLabel: 'Epistemic Observation',
      categoryColor: '#F59E0B',
      bioregion: bioregionName,
      summary: outcomeNotes.trim().slice(0, 120),
      detailedNarrative: `${outcomeNotes.trim()} \n\nMethodology: ${methodology.trim()} \n\nAttribution: ${attributionType} • Confidence: ${confidenceScore}%`,
      sensorQuorum: point.verifiedSensorCount || 2800,
      cryptographicHash: observationHash,
      provenanceLinks: [
        {
          label: 'Atlas Evidence Ledger Registry',
          url: 'https://atlassanctum.org/evidence-ledger',
          authority: observerName.trim(),
          tier: 'Tier-1 Epistemic Ground Truth'
        }
      ],
      isCustom: true,
      spikeOrDrop: 'neutral',
      customLabelText: 'Epistemic Note',
      author: observerName.trim()
    };

    try {
      // 1. Save to Evidence Ledger custom entries in LocalStorage
      const existingRaw = localStorage.getItem('atlas_evidence_ledger_custom_entries');
      const existingList: EvidenceLedgerEntry[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updatedList = [newLedgerEntry, ...existingList];
      localStorage.setItem('atlas_evidence_ledger_custom_entries', JSON.stringify(updatedList));

      // 2. Broadcast event for instant multi-tab reactivity
      window.dispatchEvent(new CustomEvent('atlas-evidence-exported', { detail: newLedgerEntry }));

      // 3. Persist to Firestore Provenance & Audit collections
      try {
        await db.provenance.create({
          id: newLedgerEntry.id,
          source: newLedgerEntry.source,
          sourceType: 'field_audit',
          collectedAt: newLedgerEntry.timestamp,
          calculationMethod: newLedgerEntry.methodology,
          certaintyScore: newLedgerEntry.confidenceScore,
          verifier: newLedgerEntry.verifier,
          verifierRole: observerRole.trim(),
          cryptographicHash: newLedgerEntry.hash,
          assumptions: [newLedgerEntry.attributionType, newLedgerEntry.epistemicStatus],
          lastAudited: timestamp.split('T')[0]
        });

        await db.audit.logInteraction({
          action: `Recorded Epistemic Observation [${newLedgerEntry.id}] on Month ${activePoint.monthIndex}`,
          feature: 'telemetry_calibration',
          impactTier: 'civilizational_critical',
          parameters: {
            id: newLedgerEntry.id,
            bioregion: bioregionName,
            pointMonth: activePoint.calendarMonth,
            hash: newLedgerEntry.hash
          },
          ethicalNotes: 'Manual epistemic observation successfully anchored into empirical evidence ledger.'
        });
      } catch (dbErr) {
        console.warn('Firestore persistence notice:', dbErr);
      }

      // 4. Notify parent listeners & trigger success feedback
      audioFeedback.playSuccessChime();
      setSavedEntry(newLedgerEntry);
      if (onObservationSaved) {
        onObservationSaved(newLedgerEntry, annotationMarker);
      }
    } catch (err: any) {
      console.error('Failed to save observation:', err);
      setErrorMessage(err.message || 'An error occurred while saving to the Evidence Ledger.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="epistemic-observation-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="epistemic-observation-modal"
        className="w-full max-w-2xl bg-[#0B0F0D] border border-[#C5A059]/50 rounded-lg shadow-2xl overflow-hidden text-[#F5F5F0] font-mono flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#0F1612] border-b border-[#F5F5F0]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#1D2A20] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Record Epistemic Observation
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                  Evidence Ledger Anchor
                </span>
              </div>
              <p className="text-xs text-[#F5F5F0]/60 font-sans mt-0.5">
                Ground-truth empirical note linked to Month {activePoint.monthIndex} ({activePoint.calendarMonth}) at {bioregionName}.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              onClose();
            }}
            className="p-1.5 rounded hover:bg-[#1A231D] text-[#F5F5F0]/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Point Summary Badge */}
        <div className="px-5 py-3 bg-[#131C16] border-b border-[#F5F5F0]/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-[#F5F5F0]/50 block uppercase">Selected Period</span>
            <span className="text-white font-bold">{activePoint.calendarMonth}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#F5F5F0]/50 block uppercase">Ecological Flourishing</span>
            <span className="text-emerald-400 font-bold">{activePoint.ecologicalFlourishing}%</span>
          </div>
          <div>
            <span className="text-[10px] text-[#F5F5F0]/50 block uppercase">Economic Stability</span>
            <span className="text-cyan-400 font-bold">{activePoint.economicStability}%</span>
          </div>
          <div>
            <span className="text-[10px] text-[#F5F5F0]/50 block uppercase">Decoupling Margin</span>
            <span className="text-[#C5A059] font-bold">+{activePoint.decouplingMargin.toFixed(1)} pts</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {savedEntry ? (
            <div className="p-5 rounded-md bg-emerald-950/40 border border-emerald-500/60 space-y-4 animate-in fade-in">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Epistemic Observation Anchored to Ledger
                  </h4>
                  <p className="text-xs text-[#F5F5F0]/80 font-sans">
                    Your empirical observation has been cryptographically registered and permanently saved to the project's Evidence Ledger.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-black/60 rounded border border-emerald-500/30 space-y-2 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#F5F5F0]/60">Ledger Entry ID:</span>
                  <span className="text-emerald-300 font-bold">{savedEntry.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#F5F5F0]/60">Cryptographic Root Hash:</span>
                  <span className="text-[#C5A059] font-bold truncate max-w-[240px]">{savedEntry.hash}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#F5F5F0]/60">Epistemic Status:</span>
                  <span className="text-white font-bold">{savedEntry.epistemicStatus} ({savedEntry.confidenceScore}% certainty)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#F5F5F0]/60">Moral Compliance:</span>
                  <span className="text-emerald-400 font-bold">{savedEntry.moralAlignmentScore}/100</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                {onSelectTab && (
                  <button
                    onClick={() => {
                      audioFeedback.playMicroTick();
                      onClose();
                      onSelectTab('evidence-ledger');
                    }}
                    className="flex-1 py-2 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View in Evidence Ledger</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="py-2 px-4 rounded bg-[#1C2520] hover:bg-[#25322A] text-[#F5F5F0]/80 hover:text-white text-xs transition-colors cursor-pointer border border-[#F5F5F0]/20"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-950/80 border border-red-500/60 rounded text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Observation Claim Title */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#F5F5F0]/80 uppercase flex items-center justify-between">
                  <span>Observation Title / Core Finding *</span>
                  <span className="text-[10px] text-[#F5F5F0]/50 font-normal">Displayed in Evidence Ledger</span>
                </label>
                <input
                  type="text"
                  value={claim}
                  onChange={(e) => setClaim(e.target.value)}
                  placeholder="e.g., Verified Subsurface Aquifer Recharge Spike in Upper Mara"
                  className="w-full bg-[#141A16] border border-[#F5F5F0]/20 rounded p-2 text-white placeholder-[#F5F5F0]/30 focus:border-[#C5A059] focus:outline-none"
                  required
                />
              </div>

              {/* Observer Name & Quorum Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#F5F5F0]/80 uppercase">
                    Observer / Steward Quorum *
                  </label>
                  <input
                    type="text"
                    value={observerName}
                    onChange={(e) => setObserverName(e.target.value)}
                    className="w-full bg-[#141A16] border border-[#F5F5F0]/20 rounded p-2 text-white focus:border-[#C5A059] focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#F5F5F0]/80 uppercase">
                    Stewardship Role / Authority
                  </label>
                  <input
                    type="text"
                    value={observerRole}
                    onChange={(e) => setObserverRole(e.target.value)}
                    className="w-full bg-[#141A16] border border-[#F5F5F0]/20 rounded p-2 text-white focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              {/* Empirical Field Notes / Detailed Narrative */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#F5F5F0]/80 uppercase flex items-center justify-between">
                  <span>Empirical Field Notes & Epistemic Observations *</span>
                  <span className="text-[10px] text-[#F5F5F0]/50 font-normal">Ground-truth notes</span>
                </label>
                <textarea
                  rows={3}
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  placeholder="Describe observed physical phenomena, biological shifts, sensor cross-verification, or community interventions..."
                  className="w-full bg-[#141A16] border border-[#F5F5F0]/20 rounded p-2 text-white placeholder-[#F5F5F0]/30 focus:border-[#C5A059] focus:outline-none font-sans"
                  required
                />
              </div>

              {/* Methodology & Verification Technique */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#F5F5F0]/80 uppercase">
                  Measurement Methodology & Sensor Hardware
                </label>
                <input
                  type="text"
                  value={methodology}
                  onChange={(e) => setMethodology(e.target.value)}
                  className="w-full bg-[#141A16] border border-[#F5F5F0]/20 rounded p-2 text-white focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              {/* Epistemic Status & Attribution Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#F5F5F0]/80 uppercase">
                    Epistemic Status
                  </label>
                  <select
                    value={epistemicStatus}
                    onChange={(e) => setEpistemicStatus(e.target.value as any)}
                    className="w-full bg-[#141A16] border border-[#F5F5F0]/20 rounded p-2 text-white focus:border-[#C5A059] focus:outline-none"
                  >
                    <option value="Observed">Observed (Ground Sensor)</option>
                    <option value="Verified">Verified (Multi-Quorum)</option>
                    <option value="Reported">Reported (Community Baraza)</option>
                    <option value="Modeled">Modeled (Simulation)</option>
                    <option value="Estimated">Estimated (Interp.)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#F5F5F0]/80 uppercase">
                    Attribution Type
                  </label>
                  <select
                    value={attributionType}
                    onChange={(e) => setAttributionType(e.target.value as any)}
                    className="w-full bg-[#141A16] border border-[#F5F5F0]/20 rounded p-2 text-white focus:border-[#C5A059] focus:outline-none"
                  >
                    <option value="Attribution">Direct Attribution</option>
                    <option value="Contribution">Systemic Contribution</option>
                    <option value="Correlation">Statistical Correlation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#F5F5F0]/80 uppercase">
                    Regenerative Priority
                  </label>
                  <select
                    value={regenerativePriority}
                    onChange={(e) => setRegenerativePriority(e.target.value as any)}
                    className="w-full bg-[#141A16] border border-[#F5F5F0]/20 rounded p-2 text-white focus:border-[#C5A059] focus:outline-none"
                  >
                    <option value="Critical">Critical Priority</option>
                    <option value="High">High Impact</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Foundational">Foundational</option>
                  </select>
                </div>
              </div>

              {/* Confidence & Moral Alignment Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1 p-2.5 rounded bg-[#141A16] border border-[#F5F5F0]/10">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-[#F5F5F0]/70 uppercase">Certainty / Confidence:</span>
                    <span className="text-emerald-400 font-bold">{confidenceScore}%</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={100}
                    value={confidenceScore}
                    onChange={(e) => setConfidenceScore(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1 p-2.5 rounded bg-[#141A16] border border-[#F5F5F0]/10">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-[#F5F5F0]/70 uppercase">Moral Alignment Score:</span>
                    <span className="text-[#C5A059] font-bold">{moralAlignmentScore}/100</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    value={moralAlignmentScore}
                    onChange={(e) => setMoralAlignmentScore(Number(e.target.value))}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#F5F5F0]/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-transparent hover:bg-[#1A231D] text-[#F5F5F0]/70 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded bg-gradient-to-r from-[#C5A059] to-[#E0C070] hover:from-[#d4b068] hover:to-[#ebcc7f] text-black font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>{isSubmitting ? 'Anchoring to Ledger...' : 'Persist to Evidence Ledger'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
