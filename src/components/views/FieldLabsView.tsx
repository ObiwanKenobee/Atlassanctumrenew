import React, { useState } from 'react';
import { 
  FlaskConical, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  Sparkles, 
  ShieldAlert,
  BookOpen,
  Scale
} from 'lucide-react';
import { ATLAS_FIELD_LABS } from '../../data/prompt2CivilizationData';
import { FieldLab } from '../../types';
import { FieldNoteRecorder } from '../field/FieldNoteRecorder';
import { OfflineFieldSyncManager } from '../field/OfflineFieldSyncManager';
import { HardwareTelemetryGateway } from '../field/HardwareTelemetryGateway';

interface FieldLabsViewProps {
  onInspectProvenance?: (prov: any) => void;
  onOpenMoralSimulator?: () => void;
  onOpenCommandCenter?: () => void;
}

export const FieldLabsView: React.FC<FieldLabsViewProps> = ({
  onInspectProvenance,
  onOpenMoralSimulator,
  onOpenCommandCenter
}) => {
  const [selectedLabId, setSelectedLabId] = useState<string>(ATLAS_FIELD_LABS[0].id);

  const selectedLab = ATLAS_FIELD_LABS.find((l) => l.id === selectedLabId) || ATLAS_FIELD_LABS[0];

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-[#F5F5F0] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3 border-b border-[#F5F5F0]/10 pb-6">
        <div className="flex items-center gap-2">
          <div className="h-px w-6 bg-[#C5A059]" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-mono font-bold">
            Real-World Living Laboratories
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F5F0]">
              Atlas Field Labs & Failure Reports
            </h1>
            <p className="text-sm text-[#F5F5F0]/60 max-w-2xl mt-1">
              Field laboratories operating under real constraint: from informal settlement bio-infrastructure in Nairobi to solar aquifer desalination in Turkana and circular micro-foundries in Mombasa.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMoralSimulator}
              className="px-3.5 py-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/40 rounded-sm text-xs font-mono text-[#C5A059] font-bold flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Simulate Lab Ethics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lab Tabs / Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {ATLAS_FIELD_LABS.map((lab) => {
          const isSelected = lab.id === selectedLabId;
          return (
            <div
              key={lab.id}
              onClick={() => setSelectedLabId(lab.id)}
              className={`p-4 rounded-sm border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#151515] border-[#C5A059] shadow-lg shadow-[#C5A059]/5'
                  : 'bg-[#0D0D0D] border-[#F5F5F0]/10 hover:border-[#F5F5F0]/30 hover:bg-[#111111]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-[#C5A059] mb-1.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C5A059]" /> {lab.location.split(',')[0]}
                </span>
                <span className="text-[#F5F5F0]/40">Active Deployment</span>
              </div>
              <h3 className="text-base font-serif font-bold text-[#F5F5F0] mb-1">
                {lab.name}
              </h3>
              <p className="text-xs text-[#F5F5F0]/60 line-clamp-2">
                {lab.focusArea}
              </p>
            </div>
          );
        })}
      </div>

      {/* Deep Scientific Lab Dossier */}
      <div className="p-6 sm:p-8 bg-[#0D0D0D] border border-[#C5A059]/40 rounded-sm space-y-8 shadow-2xl">
        {/* Lab Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F5F5F0]/10 pb-6">
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#C5A059] uppercase tracking-wider flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-[#C5A059]" />
              Field Lab Dossier: {selectedLab.id}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0]">
              {selectedLab.name}
            </h2>
            <div className="text-xs font-mono text-[#F5F5F0]/60 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {selectedLab.location}
            </div>
          </div>
          <div className="p-3 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm text-right">
            <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/40 block">Focus Specialization</span>
            <span className="text-xs font-mono font-bold text-[#C5A059]">{selectedLab.focusArea}</span>
          </div>
        </div>

        {/* 6-Stage Scientific Inquiry Lifecycle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Question & Hypothesis */}
          <div className="space-y-4">
            <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#C5A059] font-mono text-[10px] uppercase font-bold tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" /> 1. The Core Scientific Question
              </div>
              <p className="text-sm font-serif font-bold text-[#F5F5F0] leading-relaxed">
                "{selectedLab.question}"
              </p>
            </div>

            <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
              <div className="flex items-center gap-1.5 text-purple-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> 2. The Operating Hypothesis
              </div>
              <p className="text-xs text-[#F5F5F0]/80 leading-relaxed">
                {selectedLab.hypothesis}
              </p>
            </div>

            <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                <FileText className="w-3.5 h-3.5" /> 3. Deployed Physical Intervention
              </div>
              <p className="text-xs text-[#F5F5F0]/80 leading-relaxed font-mono">
                {selectedLab.intervention}
              </p>
            </div>
          </div>

          {/* Evidence, Result, Lesson & What Went Wrong */}
          <div className="space-y-4">
            <div className="p-4 bg-[#1B3022]/30 border border-emerald-500/30 rounded-sm space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" /> 4. Measured Empirical Evidence
              </div>
              <p className="text-xs text-emerald-200 leading-relaxed font-mono">
                {selectedLab.evidence}
              </p>
            </div>

            <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#C5A059] font-mono text-[10px] uppercase font-bold tracking-wider">
                <BookOpen className="w-3.5 h-3.5" /> 5. Institutional Lesson
              </div>
              <p className="text-xs text-[#F5F5F0]/80 leading-relaxed">
                {selectedLab.lesson}
              </p>
            </div>

            {/* MANDATORY Prompt Section: WHAT WE GOT WRONG */}
            <div className="p-4 bg-rose-950/30 border border-rose-500/40 rounded-sm space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> WHAT WE GOT WRONG & RE-ENGINEERED
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                {selectedLab.whatWentWrong}
              </p>
            </div>
          </div>

        </div>

        {/* Live Audio Dictation & Voice Field Note Recording Section */}
        <FieldNoteRecorder
          labId={selectedLab.id}
          labName={selectedLab.name}
          labLocation={selectedLab.location}
        />
      </div>

      {/* Phase 05 Physical Integration: Local-First Offline Sync Gateway */}
      <OfflineFieldSyncManager
        currentFieldLabId={selectedLab.id}
        currentFieldLabName={selectedLab.name}
      />

      {/* IoT Hardware Telemetry & Sensor Bridge */}
      <HardwareTelemetryGateway />
    </div>
  );
};
