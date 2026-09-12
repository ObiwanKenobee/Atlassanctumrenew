import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Moon, 
  Sun, 
  Eye, 
  Radio, 
  LogOut, 
  LogIn, 
  Check, 
  Sparkles,
  Sliders,
  ChevronDown,
  KeyRound,
  Wallet,
  Loader2,
  AlertCircle,
  Award,
  Brain,
  Layout,
  Activity,
  Zap,
  Trophy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWeb3Wallet } from '../context/Web3WalletContext';
import { useAdaptiveMode } from '../context/AdaptiveModeContext';
import { useAdaptiveLighting } from '../context/AdaptiveLightingContext';
import { db } from '../lib/db';
import { StewardshipTierProgression } from './StewardshipTierProgression';

export const UserSettingsDropdown: React.FC = () => {
  const { 
    currentUser, 
    userProfile, 
    isSigningIn, 
    signInWithGoogle, 
    signOut, 
    updatePlatformSettings,
    error: authError,
    clearAuthError
  } = useAuth();
  const { address, isConnected, walletType, connectMetaMaskWallet, connectSovereignKeypair, disconnectWallet, error: walletError, clearError } = useWeb3Wallet();
  const {
    adaptiveModeEnabled,
    toggleAdaptiveMode,
    cognitiveLoadLevel,
    cognitiveScore,
    uiDensity,
    hierarchyFocus,
    isAnalyzing,
    assessCognitiveLoad,
    overrideDensity,
    overrideHierarchy,
    rationale,
    lastAssessedAt
  } = useAdaptiveMode();
  const {
    isAdaptiveLightingEnabled,
    toggleAdaptiveLighting,
    interactionLevel,
    isHighContrastEngaged,
    sensitivity,
    setSensitivity,
    idleTimeSeconds,
    triggerManualHighContrastTest
  } = useAdaptiveLighting();
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleTheme = async (theme: 'dark' | 'solarized' | 'biophilic_night') => {
    setSaving(true);
    try {
      await updatePlatformSettings({ themePreference: theme });
      await db.audit.logInteraction({
        action: `Changed theme preference to ${theme}`,
        feature: 'moral_intelligence',
        impactTier: 'low',
        parameters: { theme }
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAccessLevel = async (level: any) => {
    setSaving(true);
    try {
      await updatePlatformSettings({ accessLevel: level });
      await db.audit.logInteraction({
        action: `Updated researcher access role to ${level}`,
        feature: 'moral_intelligence',
        impactTier: 'moderate',
        parameters: { newAccessLevel: level }
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTelemetry = async () => {
    setSaving(true);
    const nextState = !userProfile?.telemetryStreamActive;
    try {
      await updatePlatformSettings({ telemetryStreamActive: nextState });
      await db.audit.logInteraction({
        action: `Toggled telemetry stream synchronization to ${nextState}`,
        feature: 'telemetry_calibration',
        impactTier: 'low',
        parameters: { telemetryStreamActive: nextState }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative">
      {currentUser ? (
        <button
          id="user-profile-settings-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 min-h-[38px] sm:min-h-[40px] bg-[#141414] hover:bg-[#1C1C1C] border border-[#F5F5F0]/20 hover:border-[#C5A059] rounded-full text-xs text-[#F5F5F0] transition-all"
        >
          {currentUser.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt={currentUser.displayName || 'User'} 
              className="w-5 h-5 rounded-full object-cover border border-[#C5A059]/40"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-[#1B3022] text-[#C5A059] flex items-center justify-center font-bold text-[10px]">
              {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
            </div>
          )}
          <span className="hidden lg:inline-block max-w-[100px] truncate text-[11px] font-mono">
            {currentUser.displayName?.split(' ')[0] || 'Researcher'}
          </span>
          <span className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#1B3022] text-emerald-400 rounded-xs border border-emerald-500/30">
            {userProfile?.accessLevel || 'Researcher'}
          </span>
          <ChevronDown className="w-3 h-3 text-[#F5F5F0]/60" />
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            id="guest-profile-settings-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Profile & Adaptive Lighting Settings"
            title="Profile & Adaptive Lighting Settings"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[38px] sm:min-h-[40px] bg-[#141414] hover:bg-[#1C1C1C] border border-[#F5F5F0]/20 hover:border-[#C5A059] rounded-full text-xs text-[#F5F5F0] transition-all cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-[#1B3022] text-[#C5A059] flex items-center justify-center font-bold text-[10px]">
              <User className="w-3 h-3 text-[#C5A059]" />
            </div>
            <span className="hidden lg:inline-block text-[11px] font-mono">
              Settings
            </span>
            <ChevronDown className="w-3 h-3 text-[#F5F5F0]/60" />
          </button>

          <div className="relative">
            <button
              id="user-sign-in-btn"
              onClick={() => signInWithGoogle()}
              disabled={isSigningIn}
              className={`flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] sm:min-h-[40px] bg-[#1B3022] hover:bg-[#254530] text-[#F5F5F0] border border-[#C5A059]/40 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isSigningIn ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-[#C5A059] animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Sign In</span>
                </>
              )}
            </button>
            {authError && (
              <div className="absolute right-0 top-full mt-2 w-72 p-2.5 bg-[#141414] border border-amber-500/50 rounded-sm shadow-xl z-50 text-[11px] font-mono text-amber-300 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p>{authError}</p>
                  <button
                    onClick={clearAuthError}
                    className="mt-1.5 text-[10px] underline text-amber-400 hover:text-amber-200 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dropdown Modal */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-88 max-w-[92vw] bg-[#0D0D0D] border border-[#F5F5F0]/20 rounded-sm shadow-2xl z-50 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[88vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#C5A059]/30">
            
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-[#F5F5F0]/10">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="" 
                  className="w-10 h-10 rounded-full border border-[#C5A059]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#1B3022] text-[#C5A059] flex items-center justify-center font-bold">
                  {(currentUser?.displayName || 'G')[0]}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-serif font-bold text-[#F5F5F0] truncate">
                  {currentUser?.displayName || 'Guest Researcher'}
                </div>
                <div className="text-[10px] font-mono text-[#F5F5F0]/50 truncate">
                  {currentUser?.email || 'Local Sandbox Session • Epistemic Node'}
                </div>
              </div>
            </div>

            {/* Stewardship Tier Progression Widget */}
            <div className="pt-1">
              <StewardshipTierProgression compact={true} />
            </div>

            {/* View Citizen Profile Button */}
            <button
              id="dropdown-open-citizen-profile-btn"
              onClick={() => {
                setIsOpen(false);
                window.dispatchEvent(new CustomEvent('atlas-navigate-tab', { detail: { tab: 'citizen-profile' } }));
              }}
              className="w-full py-2 px-3 bg-gradient-to-r from-[#1B3022] to-[#122417] border border-[#C5A059]/40 hover:border-[#C5A059] rounded text-left flex items-center justify-between text-xs transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div className="font-mono text-[#F5F5F0]">
                  <span className="font-bold group-hover:text-[#C5A059] transition-colors">Citizen Profile & Badges</span>
                  <div className="text-[9px] text-[#F5F5F0]/50">3,450 Rep • 4 Badges • Impact Metrics</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </button>

            {/* Milestones & Achievements Trigger */}
            <button
              id="dropdown-open-achievements-btn"
              onClick={() => {
                setIsOpen(false);
                window.dispatchEvent(new CustomEvent('open-achievements-drawer'));
              }}
              className="w-full py-1.5 px-3 bg-black/40 hover:bg-[#1B3022] border border-[#F5F5F0]/10 hover:border-amber-500/40 rounded text-left flex items-center justify-between text-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <div className="font-mono text-[#F5F5F0]">
                  <span className="font-bold text-[11px] group-hover:text-amber-300 transition-colors">Milestones & Celebrations</span>
                  <div className="text-[9px] text-[#F5F5F0]/50">100th Alert, Top 10% Contributor</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </button>

            {/* Platform Settings (Synchronized to Firestore) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">
                  Firestore Platform Profile
                </span>
                {saveSuccess && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Synced
                  </span>
                )}
              </div>

              {/* Access Level Selector */}
              <div className="space-y-1">
                <label className="text-[11px] text-[#F5F5F0]/70 flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-[#C5A059]" />
                  <span>Access Level (Governance Role)</span>
                </label>
                <select
                  value={userProfile?.accessLevel || 'researcher'}
                  onChange={(e) => handleUpdateAccessLevel(e.target.value)}
                  className="w-full bg-[#141414] border border-[#F5F5F0]/15 rounded px-2.5 py-1.5 text-xs text-[#F5F5F0] font-mono focus:border-[#C5A059] focus:outline-none"
                >
                  <option value="visitor">Visitor (Read-Only)</option>
                  <option value="researcher">Researcher (Telemetry & Simulation)</option>
                  <option value="steward">Bioregional Steward (Field Audit)</option>
                  <option value="systems_architect">Systems Architect (Model Designer)</option>
                  <option value="council_admin">Council Admin (Moral Policy)</option>
                </select>
              </div>

              {/* Theme Preference */}
              <div className="space-y-1">
                <label className="text-[11px] text-[#F5F5F0]/70 flex items-center gap-1.5">
                  <Sliders className="w-3 h-3 text-[#C5A059]" />
                  <span>Color & Sensory Mode</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'dark', label: 'Dark Obsidian' },
                    { id: 'biophilic_night', label: 'Biophilic Forest' },
                    { id: 'solarized', label: 'Solar Sand' }
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      onClick={() => handleToggleTheme(thm.id as any)}
                      className={`px-2 py-1.5 text-[10px] font-mono rounded border text-center transition-all ${
                        userProfile?.themePreference === thm.id
                          ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] font-bold'
                          : 'border-[#F5F5F0]/10 bg-[#141414] text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                      }`}
                    >
                      {thm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adaptive Lighting Setting (Auto-switches between current theme and High-Contrast based on user interaction levels) */}
              <div className="pt-2 border-t border-[#F5F5F0]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#F5F5F0]/90 font-medium">
                    <Sun className={`w-3.5 h-3.5 ${isAdaptiveLightingEnabled ? 'text-amber-400 animate-pulse' : 'text-[#F5F5F0]/40'}`} />
                    <span>Adaptive Lighting (Contrast Automation)</span>
                  </div>
                  <button
                    id="toggle-adaptive-lighting-btn"
                    onClick={() => toggleAdaptiveLighting()}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded-full border transition-all cursor-pointer ${
                      isAdaptiveLightingEnabled
                        ? 'bg-amber-950/70 border-amber-500/60 text-amber-300 font-bold shadow-xs'
                        : 'bg-[#141414] border-[#F5F5F0]/20 text-[#F5F5F0]/50 hover:text-white'
                    }`}
                  >
                    {isAdaptiveLightingEnabled ? 'AUTO ADAPT' : 'OFF'}
                  </button>
                </div>
                <p className="text-[10px] text-[#F5F5F0]/50 font-sans leading-tight">
                  Automatically toggles ultra-sharp high-contrast mode when user interaction levels surge or drop, preventing ocular fatigue.
                </p>

                {isAdaptiveLightingEnabled && (
                  <div className="p-2.5 bg-[#121413] border border-amber-500/30 rounded-sm space-y-2 mt-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#F5F5F0]/70 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-amber-400" />
                        <span>Interaction Activity:</span>
                      </span>
                      <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] uppercase ${
                        isHighContrastEngaged
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {isHighContrastEngaged ? 'High Contrast Engaged' : `Standard Mode (${interactionLevel}%)`}
                      </span>
                    </div>

                    <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden border border-white/10">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isHighContrastEngaged ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${interactionLevel}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                      <span className="text-[#F5F5F0]/50 text-[9px]">Sensitivity:</span>
                      <div className="flex items-center gap-1">
                        {(['low', 'balanced', 'high'] as const).map(sens => (
                          <button
                            key={sens}
                            onClick={() => setSensitivity(sens)}
                            className={`px-1.5 py-0.2 rounded text-[9px] uppercase transition-all ${
                              sensitivity === sens 
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold' 
                                : 'text-[#F5F5F0]/40 hover:text-white'
                            }`}
                          >
                            {sens}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-[#F5F5F0]/40">
                        Idle: {idleTimeSeconds}s
                      </span>
                      <button
                        onClick={triggerManualHighContrastTest}
                        className="text-[9px] font-mono text-amber-400 hover:text-amber-200 underline cursor-pointer"
                      >
                        {isHighContrastEngaged ? 'Return To Standard' : 'Force High Contrast Test'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Live Telemetry Mesh Toggle */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-[#F5F5F0]/80">
                  <Radio className={`w-3.5 h-3.5 ${userProfile?.telemetryStreamActive !== false ? 'text-emerald-400 animate-pulse' : 'text-[#F5F5F0]/40'}`} />
                  <span>Live Mesh Stream</span>
                </div>
                <button
                  onClick={handleToggleTelemetry}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded-full border transition-all ${
                    userProfile?.telemetryStreamActive !== false
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                      : 'bg-[#141414] border-[#F5F5F0]/20 text-[#F5F5F0]/50'
                  }`}
                >
                  {userProfile?.telemetryStreamActive !== false ? 'ACTIVE' : 'PAUSED'}
                </button>
              </div>

              {/* Sabbath Mode Toggle (Commandment VII: Rest & De-escalation) */}
              <div className="pt-2 border-t border-[#F5F5F0]/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#F5F5F0]/90 font-medium">
                    <Moon className={`w-3.5 h-3.5 ${userProfile?.sabbathModeActive ? 'text-[#C5A059]' : 'text-[#F5F5F0]/40'}`} />
                    <span>Sabbath Mode (Rest & Anti-Addiction)</span>
                  </div>
                  <button
                    onClick={async () => {
                      setSaving(true);
                      const nextSabbath = !userProfile?.sabbathModeActive;
                      try {
                        await updatePlatformSettings({ sabbathModeActive: nextSabbath });
                        await db.audit.logInteraction({
                          action: `Toggled Sabbath Mode to ${nextSabbath}`,
                          feature: 'moral_intelligence',
                          impactTier: 'moderate',
                          parameters: { sabbathModeActive: nextSabbath }
                        });
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setSaving(false);
                      }
                    }}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded-full border transition-all ${
                      userProfile?.sabbathModeActive
                        ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059] font-bold'
                        : 'bg-[#141414] border-[#F5F5F0]/20 text-[#F5F5F0]/50'
                    }`}
                  >
                    {userProfile?.sabbathModeActive ? 'REST ACTIVE' : 'DISABLED'}
                  </button>
                </div>
                <p className="text-[10px] text-[#F5F5F0]/50 font-sans leading-tight">
                  {userProfile?.sabbathModeActive 
                    ? 'Sabbath Active: Notifications muted, telemetry throttled, and visual stimuli simplified to foster contemplative rest.'
                    : 'Enable to reduce notification frequency, throttle telemetry streams, and encourage healthy periods of rest.'}
                </p>
              </div>

              {/* Adaptive Mode Toggle (Gemini Cognitive Load Ergonomics) */}
              <div className="pt-2 border-t border-[#F5F5F0]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#F5F5F0]/90 font-medium">
                    <Brain className={`w-3.5 h-3.5 ${adaptiveModeEnabled ? 'text-[#C5A059] animate-pulse' : 'text-[#F5F5F0]/40'}`} />
                    <span>Adaptive Mode (Gemini Ergonomics)</span>
                  </div>
                  <button
                    onClick={() => toggleAdaptiveMode()}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded-full border transition-all cursor-pointer ${
                      adaptiveModeEnabled
                        ? 'bg-[#1B3022] border-[#C5A059] text-[#C5A059] font-bold shadow-sm'
                        : 'bg-[#141414] border-[#F5F5F0]/20 text-[#F5F5F0]/50 hover:text-white'
                    }`}
                  >
                    {adaptiveModeEnabled ? 'AI ADAPTIVE ON' : 'DISABLED'}
                  </button>
                </div>
                <p className="text-[10px] text-[#F5F5F0]/50 font-sans leading-tight">
                  Uses Gemini to dynamically assess cognitive load, adjusting UI density and information hierarchy in real-time.
                </p>

                {adaptiveModeEnabled && (
                  <div className="p-2.5 bg-[#121814] border border-[#C5A059]/30 rounded-lg space-y-2 mt-1">
                    {/* Status Pill */}
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#F5F5F0]/70 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#C5A059]" />
                        <span>Cognitive Load:</span>
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                        cognitiveLoadLevel === 'low'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : cognitiveLoadLevel === 'moderate'
                          ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}>
                        {cognitiveLoadLevel} ({cognitiveScore}/100)
                      </span>
                    </div>

                    {/* Density Selector */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/60">
                        <span>UI Density:</span>
                        <span className="capitalize text-[#C5A059] font-semibold">{uiDensity}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {(['compact', 'comfortable', 'spacious'] as const).map((density) => (
                          <button
                            key={density}
                            onClick={() => overrideDensity(density)}
                            className={`py-1 text-[9px] font-mono rounded capitalize transition-all cursor-pointer ${
                              uiDensity === density
                                ? 'bg-[#1B3022] border border-[#C5A059] text-white font-bold'
                                : 'bg-[#181818] border border-white/5 text-[#F5F5F0]/50 hover:text-white'
                            }`}
                          >
                            {density}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hierarchy Focus */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#F5F5F0]/70 pt-1 border-t border-white/5">
                      <span>Hierarchy Focus:</span>
                      <span className="text-white capitalize text-[9px] px-1.5 py-0.5 bg-black/40 rounded border border-white/10">
                        {hierarchyFocus.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Gemini Rationale Quote */}
                    {rationale && (
                      <p className="text-[9px] text-[#C5A059]/90 italic font-mono bg-black/30 p-1.5 rounded border border-[#C5A059]/15">
                        "{rationale}"
                      </p>
                    )}

                    {/* Re-analyze Button */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[9px] font-mono text-[#F5F5F0]/40">
                        {lastAssessedAt ? `Assessed at ${lastAssessedAt}` : 'Real-time telemetry'}
                      </span>
                      <button
                        onClick={() => assessCognitiveLoad()}
                        disabled={isAnalyzing}
                        className="flex items-center gap-1 px-2 py-1 text-[9px] font-mono text-[#C5A059] hover:text-amber-200 bg-black/40 hover:bg-black/60 border border-[#C5A059]/40 rounded transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isAnalyzing ? (
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        )}
                        <span>{isAnalyzing ? 'Analyzing...' : 'Assess with Gemini'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Web3 & Sovereign Cryptographic Key Panel */}
              <div className="pt-2 border-t border-[#F5F5F0]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1.5">
                    <KeyRound className="w-3 h-3" /> Sovereign Cryptographic Key
                  </span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    isConnected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {isConnected ? (walletType === 'metamask' ? 'MetaMask' : 'Atlas DID') : 'Unlinked'}
                  </span>
                </div>

                {isConnected ? (
                  <div className="p-2 bg-[#121212] rounded border border-[#F5F5F0]/10 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#F5F5F0]/50">Key / Address:</span>
                      <button 
                        onClick={disconnectWallet}
                        className="text-rose-400 hover:text-rose-300 underline cursor-pointer"
                      >
                        Unlink
                      </button>
                    </div>
                    <p className="text-[#C5A059] font-bold text-[11px] truncate">{address}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    <button
                      onClick={connectMetaMaskWallet}
                      className="px-2 py-1.5 bg-[#141414] hover:bg-[#1C1C1C] border border-[#F5F5F0]/15 hover:border-[#C5A059] rounded text-[10px] font-mono text-[#F5F5F0] flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Wallet className="w-3 h-3 text-[#C5A059]" />
                      <span>MetaMask</span>
                    </button>
                    <button
                      onClick={connectSovereignKeypair}
                      className="px-2 py-1.5 bg-[#1B3022]/40 hover:bg-[#1B3022] border border-[#2D5A3C] text-emerald-300 rounded text-[10px] font-mono flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <KeyRound className="w-3 h-3 text-emerald-400" />
                      <span>Sovereign Key</span>
                    </button>
                  </div>
                )}

                {walletError && (
                  <p className="text-[10px] font-mono text-amber-400/90 leading-tight">
                    Notice: {walletError}
                  </p>
                )}
              </div>
            </div>

            {/* Footer / Sign Out */}
            <div className="pt-3 border-t border-[#F5F5F0]/10 flex items-center justify-between">
              {currentUser ? (
                <>
                  <span className="text-[9px] font-mono text-[#F5F5F0]/40">
                    UID: {currentUser.uid.slice(0, 8)}...
                  </span>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-mono cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Disconnect</span>
                  </button>
                </>
              ) : (
                <>
                  <span className="text-[9px] font-mono text-amber-400/80">
                    Guest Mode • Epistemic Node
                  </span>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signInWithGoogle();
                    }}
                    className="flex items-center gap-1 text-xs text-[#C5A059] hover:text-amber-200 font-mono cursor-pointer"
                  >
                    <LogIn className="w-3 h-3" />
                    <span>Connect Google</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
