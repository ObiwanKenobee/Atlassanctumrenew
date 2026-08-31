import React, { useState } from 'react';
import { 
  Sliders, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  Volume2,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { useTrustLayer } from '../../../context/TrustLayerContext';
import { audioFeedback } from '../../../lib/audioFeedback';

export const UnifiedPreferenceSection: React.FC = () => {
  const { consent, updateConsent, accessibility, updateAccessibility } = useTrustLayer();

  const [notificationPreferences, setNotificationPreferences] = useState({
    governanceAlerts: true,
    sensorThresholds: true,
    researchDispatches: false,
    securitySummaries: true
  });

  const [preferredLanguage, setPreferredLanguage] = useState('en-US');
  const [preferredBiome, setPreferredBiome] = useState('Cascadia (Pacific Northwest)');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleNotif = (key: keyof typeof notificationPreferences) => {
    audioFeedback.playSubtleClick();
    setNotificationPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    triggerSaved();
  };

  const triggerSaved = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#C5A059]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">Unified Sovereign Control</span>
          </div>
          <h2 className="text-xl font-medium font-serif text-[#F5F5F0]">
            Omni-Preference Center & Personalization Dashboard
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl leading-relaxed">
            Consolidate your communications, telemetry permissions, regional watershed coordinates, and visual preferences in a single coherent control surface.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Universal preferences updated and applied across all workspace layers.</span>
        </div>
      )}

      {/* Preferences Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Notification & Dispatch Channels */}
        <div className="p-5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-4">
          <div className="flex items-center gap-2 text-[#C5A059]">
            <Bell className="w-4 h-4" />
            <h3 className="text-xs font-mono uppercase font-bold">1. Dispatch & Alert Channels</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5">
              <div>
                <p className="font-mono font-bold text-[#F5F5F0]">Governance Proposal Votes</p>
                <p className="text-[11px] text-[#F5F5F0]/60">Alerts when new community funding rounds open</p>
              </div>
              <button
                onClick={() => handleToggleNotif('governanceAlerts')}
                className={`w-10 h-5 rounded-full p-0.5 border flex items-center transition-colors cursor-pointer ${
                  notificationPreferences.governanceAlerts ? 'bg-[#1B3022] border-[#2D5A3C] justify-end' : 'bg-[#222] border-[#F5F5F0]/20 justify-start'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${notificationPreferences.governanceAlerts ? 'bg-emerald-400' : 'bg-[#F5F5F0]/40'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5">
              <div>
                <p className="font-mono font-bold text-[#F5F5F0]">Sensor Anomaly Warnings</p>
                <p className="text-[11px] text-[#F5F5F0]/60">Soil moisture drops & wildfire telemetry alerts</p>
              </div>
              <button
                onClick={() => handleToggleNotif('sensorThresholds')}
                className={`w-10 h-5 rounded-full p-0.5 border flex items-center transition-colors cursor-pointer ${
                  notificationPreferences.sensorThresholds ? 'bg-[#1B3022] border-[#2D5A3C] justify-end' : 'bg-[#222] border-[#F5F5F0]/20 justify-start'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${notificationPreferences.sensorThresholds ? 'bg-emerald-400' : 'bg-[#F5F5F0]/40'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#0E0E0E] rounded border border-[#F5F5F0]/5">
              <div>
                <p className="font-mono font-bold text-[#F5F5F0]">Monthly Biocultural Digest</p>
                <p className="text-[11px] text-[#F5F5F0]/60">Curated field lab essays & research updates</p>
              </div>
              <button
                onClick={() => handleToggleNotif('researchDispatches')}
                className={`w-10 h-5 rounded-full p-0.5 border flex items-center transition-colors cursor-pointer ${
                  notificationPreferences.researchDispatches ? 'bg-[#1B3022] border-[#2D5A3C] justify-end' : 'bg-[#222] border-[#F5F5F0]/20 justify-start'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${notificationPreferences.researchDispatches ? 'bg-emerald-400' : 'bg-[#F5F5F0]/40'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Bioregional & Localization Focus */}
        <div className="p-5 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Globe className="w-4 h-4" />
            <h3 className="text-xs font-mono uppercase font-bold">2. Bioregion & Epistemic Locale</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/60">Default Ecological Watershed:</label>
              <select
                value={preferredBiome}
                onChange={e => {
                  setPreferredBiome(e.target.value);
                  audioFeedback.playMicroTick();
                  triggerSaved();
                }}
                className="w-full p-2 bg-[#0E0E0E] border border-[#F5F5F0]/15 rounded text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-cyan-400"
              >
                <option value="Cascadia (Pacific Northwest)">Cascadia (Pacific Northwest) - 48.7° N</option>
                <option value="Great Lakes Basin">Great Lakes Basin & St. Lawrence</option>
                <option value="Amazonian Headwaters">Upper Amazonian Headwaters</option>
                <option value="Alpine Mediterranean">Alpine Mediterranean Biome</option>
                <option value="Mekong Delta Catchment">Mekong Delta Catchment</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-[#F5F5F0]/60">Language & Terminology Standard:</label>
              <select
                value={preferredLanguage}
                onChange={e => {
                  setPreferredLanguage(e.target.value);
                  audioFeedback.playMicroTick();
                  triggerSaved();
                }}
                className="w-full p-2 bg-[#0E0E0E] border border-[#F5F5F0]/15 rounded text-xs font-mono text-[#F5F5F0] focus:outline-none focus:border-cyan-400"
              >
                <option value="en-US">English (Bioregional Precision)</option>
                <option value="es-LATAM">Español (Soberanía Ecológica)</option>
                <option value="fr-EU">Français (Gouvernance Écologique)</option>
                <option value="de-DE">Deutsch (Systemökologische Modellierung)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
