import React, { useState } from 'react';
import { 
  Wrench, 
  Check, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Clock, 
  Briefcase,
  Code,
  TreeDeciduous,
  Droplets,
  Users
} from 'lucide-react';
import { audioFeedback } from '../../lib/audioFeedback';

export interface BuildContributionFormProps {
  missionTitle?: string;
  missionId?: string;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

export const BuildContributionForm: React.FC<BuildContributionFormProps> = ({
  missionTitle = 'Featured Mission',
  missionId = 'mission-mathare-river',
  onSuccess,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [domain, setDomain] = useState<'agroforestry' | 'hydrology' | 'engineering' | 'community' | 'software'>('agroforestry');
  const [skills, setSkills] = useState('');
  const [availability, setAvailability] = useState('5-10 hrs/week');
  const [portfolio, setPortfolio] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const domainOptions = [
    { id: 'agroforestry', label: 'Soil & Agroforestry', icon: TreeDeciduous },
    { id: 'hydrology', label: 'Water & Hydrology', icon: Droplets },
    { id: 'engineering', label: 'Modular Engineering', icon: Wrench },
    { id: 'community', label: 'Community Assembly', icon: Users },
    { id: 'software', label: 'IoT & Software Mesh', icon: Code }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !skills) return;

    setIsSubmitting(true);
    audioFeedback.playSubtleClick();

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      audioFeedback.playCovenantResonance();
      if (onSuccess) {
        onSuccess({
          name,
          email,
          location,
          domain,
          skills,
          availability,
          portfolio,
          message
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
        <h3 className="text-lg font-serif font-bold text-[#F5F5F0]">Builder Application Submitted</h3>
        <p className="text-xs text-[#F5F5F0]/70 font-sans max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-[#F5F5F0]">{name}</strong>. The <span className="text-[#C5A059]">{missionTitle}</span> lead guild stewards will review your {domain} capabilities and contact you at <span className="text-[#F5F5F0]">{email}</span>.
        </p>
        <div className="p-3 bg-[#141414] border border-[#F5F5F0]/10 rounded text-[11px] font-mono text-[#F5F5F0]/60 max-w-sm mx-auto">
          <div>Builder Guild: <span className="text-emerald-400">{domain.toUpperCase()}</span></div>
          <div>Availability: <span className="text-[#F5F5F0]">{availability}</span></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Primary Domain Grid */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-[#F5F5F0]/60 uppercase tracking-wider block">
          Primary Field / Guild
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {domainOptions.map(opt => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setDomain(opt.id as any);
                  audioFeedback.playSubtleClick();
                }}
                className={`p-2.5 rounded-sm border text-left flex items-center gap-2 transition-all ${
                  domain === opt.id
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-medium'
                    : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-sans truncate">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Full Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. David Mwangi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Email Address *</label>
          <input
            type="email"
            required
            placeholder="e.g. david@domain.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Location & Availability */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Location / City</label>
          <input
            type="text"
            placeholder="e.g. Nairobi / Remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Weekly Availability</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-emerald-500"
          >
            <option value="2-5 hrs/week">2-5 hrs / week (Advisory)</option>
            <option value="5-10 hrs/week">5-10 hrs / week (Part-time)</option>
            <option value="15-20 hrs/week">15-20 hrs / week (Guild Contributor)</option>
            <option value="Full-time">Full-Time Field Deployment</option>
          </select>
        </div>
      </div>

      {/* Skills & Experience */}
      <div className="space-y-1">
        <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Key Skills & Experience *</label>
        <textarea
          required
          rows={2}
          placeholder="e.g. 5 years experience in riparian soil stabilization, swale design, or LoRa sensor deployment."
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-sans text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Portfolio / Link */}
      <div className="space-y-1">
        <label className="text-[11px] font-mono text-[#F5F5F0]/60 uppercase block">Portfolio / GitHub / LinkedIn (Optional)</label>
        <input
          type="url"
          placeholder="https://..."
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
          className="w-full px-3 py-2 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm text-xs font-mono text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none focus:border-emerald-500"
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
          disabled={isSubmitting || !name || !email || !skills}
          className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Registering Guild...</span>
          ) : (
            <>
              <Wrench className="w-4 h-4" />
              <span>Submit Builder Profile</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
