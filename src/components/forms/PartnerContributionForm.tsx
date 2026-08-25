import React, { useState } from 'react';
import { 
  Handshake, 
  Check, 
  Building, 
  Globe2, 
  FileText, 
  ShieldCheck,
  Send
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface PartnerContributionFormProps {
  missionTitle?: string;
  missionId?: string;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

export const PartnerContributionForm: React.FC<PartnerContributionFormProps> = ({
  missionTitle = 'Featured Mission',
  missionId = 'mission-mathare-river',
  onSuccess,
  onCancel
}) => {
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [sector, setSector] = useState<'ngo' | 'academic' | 'corporate' | 'municipal' | 'dao'>('ngo');
  const [resourceType, setResourceType] = useState('Equipment & Hardware');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !email || !contactName) return;

    setIsSubmitting(true);
    audioFeedback.playSubtleClick();

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      audioFeedback.playCovenantResonance();
      if (onSuccess) {
        onSuccess({
          orgName,
          contactName,
          email,
          sector,
          resourceType,
          description
        });
      }
    }, 1000);
  };

  if (success) {
    return (
      <div className="p-8 text-center space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">Partnership Proposal Received</h3>
        <p className="text-xs text-[#F5F5F0]/70 font-sans max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-[#F5F5F0]">{contactName}</strong> from <span className="text-cyan-400">{orgName}</span>. Our partnership stewards will review the collaboration framework for <span className="text-[#F5F5F0]">{missionTitle}</span> and contact you at <span className="text-[#F5F5F0]">{email}</span>.
        </p>
        <div className="p-3 bg-[#141414] border border-[#F5F5F0]/10 rounded text-[11px] font-mono text-[#F5F5F0]/60 max-w-sm mx-auto">
          <div>Sector: <span className="text-cyan-400">{sector.toUpperCase()}</span></div>
          <div>Resource: <span className="text-[#F5F5F0]">{resourceType}</span></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Organization & Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Organization / Entity Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Kenya Forestry Research Institute"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Contact Person *</label>
          <input
            type="text"
            required
            placeholder="e.g. Dr. Amani Ochieng"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Email & Sector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Official Email Address *</label>
          <input
            type="email"
            required
            placeholder="e.g. partnerships@org.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Sector / Classification</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value as any)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-cyan-500"
          >
            <option value="ngo">Civil Society / NGO</option>
            <option value="academic">Academic / Research Institution</option>
            <option value="corporate">Private Sector / Supply Chain</option>
            <option value="municipal">Municipal / Local Government</option>
            <option value="dao">Decentralized Autonomous Organization</option>
          </select>
        </div>
      </div>

      {/* Resource Contribution Type */}
      <div className="space-y-1">
        <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Resource Offering</label>
        <select
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
          className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-cyan-500"
        >
          <option value="Equipment & Hardware">Equipment & Hardware (Sensors, Machinery, Seedlings)</option>
          <option value="Research & Lab Verification">Research & Lab Verification (Water/Soil Testing)</option>
          <option value="Logistics & Distribution">Logistics & Supply Chain Infrastructure</option>
          <option value="Policy & Land Permitting">Policy & Permitting Stewardship</option>
          <option value="Catalytic Matching Capital">Catalytic Matching Capital Pool</option>
        </select>
      </div>

      {/* Description / Scope */}
      <div className="space-y-1">
        <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Partnership Scope & Objectives</label>
        <textarea
          rows={2}
          placeholder="Briefly describe how your organization can contribute to scaling or securing this regenerative mission."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-sans text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-cyan-500"
        />
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
          disabled={isSubmitting || !orgName || !email || !contactName}
          className="flex-1 sm:flex-initial px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Transmitting MOU...</span>
          ) : (
            <>
              <Handshake className="w-4 h-4" />
              <span>Submit Partnership Framework</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
