import React from 'react';
import { 
  X, 
  Heart, 
  Wrench, 
  Handshake, 
  ShieldCheck, 
  Sparkles,
  Lock
} from 'lucide-react';
import { GiveContributionForm } from './GiveContributionForm';
import { BuildContributionForm } from './BuildContributionForm';
import { PartnerContributionForm } from './PartnerContributionForm';
import { BackContributionForm } from './BackContributionForm';
import { StartMissionForm } from './StartMissionForm';
import { audioFeedback } from '../../lib/audioFeedback';

export type ContributionModalType = 'give' | 'build' | 'partner' | 'back' | 'start-mission';

export interface ContributionModalProps {
  isOpen: boolean;
  type: ContributionModalType;
  missionTitle?: string;
  missionId?: string;
  onClose: () => void;
  onSuccess?: (type: ContributionModalType, data: any) => void;
  onSwitchType?: (type: ContributionModalType) => void;
}

export const ContributionModal: React.FC<ContributionModalProps> = ({
  isOpen,
  type,
  missionTitle = 'Featured Mission',
  missionId = 'mission-mathare-river',
  onClose,
  onSuccess,
  onSwitchType
}) => {
  if (!isOpen) return null;

  const getModalConfig = (t: ContributionModalType) => {
    switch (t) {
      case 'give':
        return {
          title: 'Give — Non-Extractive Capital',
          subtitle: `Direct financial fuel for ${missionTitle}`,
          icon: Heart,
          iconColor: 'text-[#C5A059]',
          borderAccent: 'border-[#C5A059]'
        };
      case 'build':
        return {
          title: 'Build — Skills & Ecological Agency',
          subtitle: `Join the ground implementation guilds for ${missionTitle}`,
          icon: Wrench,
          iconColor: 'text-emerald-400',
          borderAccent: 'border-emerald-500'
        };
      case 'partner':
        return {
          title: 'Partner — Institutional Alliance',
          subtitle: `Resource sharing, lab testing, & logistics for ${missionTitle}`,
          icon: Handshake,
          iconColor: 'text-cyan-400',
          borderAccent: 'border-cyan-500'
        };
      case 'back':
        return {
          title: 'Back — Outcome Tranche Sponsorship',
          subtitle: `Milestone-contingent capital backing for ${missionTitle}`,
          icon: ShieldCheck,
          iconColor: 'text-purple-400',
          borderAccent: 'border-purple-500'
        };
      case 'start-mission':
      default:
        return {
          title: 'Start a Mission — Charter Ground Action',
          subtitle: 'Initiate a community-stewarded regenerative mission on Atlas',
          icon: Sparkles,
          iconColor: 'text-[#C5A059]',
          borderAccent: 'border-[#C5A059]'
        };
    }
  };

  const config = getModalConfig(type);
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-[#0A0A0A] border border-[#F5F5F0]/20 rounded-sm shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 border-b border-[#F5F5F0]/10 flex items-start justify-between bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-sm bg-[#1A1A1A] border border-[#F5F5F0]/10 ${config.iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#F5F5F0] tracking-tight">
                {config.title}
              </h2>
              <p className="text-xs text-[#F5F5F0]/60 font-sans mt-0.5">
                {config.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioFeedback.playSubtleClick();
              onClose();
            }}
            className="p-1.5 rounded-sm hover:bg-[#222222] text-[#F5F5F0]/50 hover:text-[#F5F5F0] transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Pathway Switcher Tabs if editing within mission */}
        {type !== 'start-mission' && onSwitchType && (
          <div className="flex items-center border-b border-[#F5F5F0]/10 bg-[#0F0F0F] px-4 py-1.5 gap-2 overflow-x-auto">
            <span className="text-[10px] font-mono text-[#F5F5F0]/40 uppercase tracking-wider shrink-0">Switch Pathway:</span>
            {[
              { id: 'give', label: 'Give' },
              { id: 'build', label: 'Build' },
              { id: 'partner', label: 'Partner' },
              { id: 'back', label: 'Back' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  onSwitchType(p.id as ContributionModalType);
                }}
                className={`px-2 py-0.5 text-[11px] font-mono rounded-sm transition-all shrink-0 ${
                  type === p.id
                    ? 'bg-[#F5F5F0]/20 text-[#F5F5F0] font-semibold'
                    : 'text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Form Body with Scroll */}
        <div className="p-6 overflow-y-auto space-y-4">
          {type === 'give' && (
            <GiveContributionForm
              missionTitle={missionTitle}
              missionId={missionId}
              onSuccess={(data) => onSuccess && onSuccess('give', data)}
              onCancel={onClose}
            />
          )}

          {type === 'build' && (
            <BuildContributionForm
              missionTitle={missionTitle}
              missionId={missionId}
              onSuccess={(data) => onSuccess && onSuccess('build', data)}
              onCancel={onClose}
            />
          )}

          {type === 'partner' && (
            <PartnerContributionForm
              missionTitle={missionTitle}
              missionId={missionId}
              onSuccess={(data) => onSuccess && onSuccess('partner', data)}
              onCancel={onClose}
            />
          )}

          {type === 'back' && (
            <BackContributionForm
              missionTitle={missionTitle}
              missionId={missionId}
              onSuccess={(data) => onSuccess && onSuccess('back', data)}
              onCancel={onClose}
            />
          )}

          {type === 'start-mission' && (
            <StartMissionForm
              onSuccess={(data) => onSuccess && onSuccess('start-mission', data)}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};
