import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  MapPin, 
  Users, 
  Target, 
  Layers, 
  ShieldCheck,
  Send,
  AlertCircle
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface StartMissionFormProps {
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

export const StartMissionForm: React.FC<StartMissionFormProps> = ({
  onSuccess,
  onCancel
}) => {
  const [problem, setProblem] = useState('');
  const [location, setLocation] = useState('');
  const [affectedCommunity, setAffectedCommunity] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [immediateNeeds, setImmediateNeeds] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem || !location || !desiredOutcome || !contactEmail) return;

    setIsSubmitting(true);
    audioFeedback.playSubtleClick();

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      audioFeedback.playCovenantResonance();
      if (onSuccess) {
        onSuccess({
          problem,
          location,
          affectedCommunity,
          desiredOutcome,
          immediateNeeds,
          contactName,
          contactEmail
        });
      }
    }, 1000);
  };

  if (success) {
    return (
      <div className="p-8 text-center space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">Regenerative Mission Charter Drafted</h3>
        <p className="text-xs text-[#F5F5F0]/70 font-sans max-w-md mx-auto leading-relaxed">
          Your mission proposal for <strong className="text-[#C5A059]">{location}</strong> has been logged to the Atlas Assembly incubator. Our community coordination stewards will review the biophysical and social grounding and reach out to <span className="text-[#F5F5F0]">{contactEmail}</span> within 48 hours.
        </p>
        <div className="p-3 bg-[#141414] border border-[#F5F5F0]/10 rounded text-[11px] font-mono text-[#F5F5F0]/60 max-w-sm mx-auto">
          <div>Status: <span className="text-[#C5A059]">INCUBATING IN LOCAL ASSEMBLY</span></div>
          <div>Location: <span className="text-[#F5F5F0]">{location}</span></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Location & Contact Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Bioregion / City / Community *</label>
          <input
            type="text"
            required
            placeholder="e.g. Turkana Basin / Lake Victoria Basin"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Lead Steward / Your Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Grace Wanjiku"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Problem Definition */}
      <div className="space-y-1">
        <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">The Real-World Ecological or Human Bottleneck *</label>
        <textarea
          required
          rows={2}
          placeholder="Describe the physical reality, degradation, or unaddressed community need..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-sans text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-[#C5A059]"
        />
      </div>

      {/* Desired Biophysical & Social Outcome */}
      <div className="space-y-1">
        <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Desired Regenerative Outcome (Measurable) *</label>
        <input
          type="text"
          required
          placeholder="e.g. 50 hectares restored soil, 12,000 trees planted, 300 clean water access points"
          value={desiredOutcome}
          onChange={(e) => setDesiredOutcome(e.target.value)}
          className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-sans text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-[#C5A059]"
        />
      </div>

      {/* Immediate Resources Needed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Initial Resource / Capital Needs</label>
          <input
            type="text"
            placeholder="e.g. $15,000 seed budget + 4 hydrologists"
            value={immediateNeeds}
            onChange={(e) => setImmediateNeeds(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Contact Email Address *</label>
          <input
            type="email"
            required
            placeholder="e.g. grace@community.ngo"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Governance & Anti-Extractive Pact */}
      <div className="p-3 bg-[#111111] border border-[#F5F5F0]/10 rounded-sm flex items-start gap-2.5 text-[11px] text-[#F5F5F0]/70">
        <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
        <p className="font-sans leading-tight">
          <strong>Priority Floor Covenant:</strong> All missions incubated on Atlas are owned and stewarded by local communities. No data extraction or colonial land captures are permitted.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-mono text-[#F5F5F0]/60 hover:text-[#F5F5F0]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !problem || !location || !desiredOutcome || !contactEmail}
          className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#C5A059] hover:bg-[#D4B06A] text-[#0A0A0A] font-mono text-xs uppercase tracking-wider font-bold rounded-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Incubating Charter...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Charter New Mission</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
