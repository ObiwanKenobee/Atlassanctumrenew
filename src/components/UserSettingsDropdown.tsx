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
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWeb3Wallet } from '../context/Web3WalletContext';
import { db } from '../lib/db';
import { StewardshipTierProgression } from './StewardshipTierProgression';

export const UserSettingsDropdown: React.FC = () => {
  const { currentUser, userProfile, signInWithGoogle, signOut, updatePlatformSettings } = useAuth();
  const { address, isConnected, walletType, connectMetaMaskWallet, connectSovereignKeypair, disconnectWallet, error: walletError, clearError } = useWeb3Wallet();
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
        <button
          id="user-sign-in-btn"
          onClick={() => signInWithGoogle()}
          className="flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] sm:min-h-[40px] bg-[#1B3022] hover:bg-[#254530] text-[#F5F5F0] border border-[#C5A059]/40 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all"
        >
          <LogIn className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Sign In</span>
        </button>
      )}

      {/* Dropdown Modal */}
      {isOpen && currentUser && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-[#0D0D0D] border border-[#F5F5F0]/20 rounded-sm shadow-2xl z-50 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
            
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-[#F5F5F0]/10">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="" 
                  className="w-10 h-10 rounded-full border border-[#C5A059]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#1B3022] text-[#C5A059] flex items-center justify-center font-bold">
                  {(currentUser.displayName || 'U')[0]}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-serif font-bold text-[#F5F5F0] truncate">
                  {currentUser.displayName || 'Atlas Fellow'}
                </div>
                <div className="text-[10px] font-mono text-[#F5F5F0]/50 truncate">
                  {currentUser.email}
                </div>
              </div>
            </div>

            {/* Stewardship Tier Progression Widget */}
            <div className="pt-1">
              <StewardshipTierProgression compact={true} />
            </div>

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
              <span className="text-[9px] font-mono text-[#F5F5F0]/40">
                UID: {currentUser.uid.slice(0, 8)}...
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-mono"
              >
                <LogOut className="w-3 h-3" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
