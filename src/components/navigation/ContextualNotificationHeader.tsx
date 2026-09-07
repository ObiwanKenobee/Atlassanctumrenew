import React, { useState } from 'react';
import { useContextualNotifications, ContextualNotification } from '../../context/ContextualNotificationContext';
import { PageView } from '../../types';
import { 
  Bell, 
  ChevronRight, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  X, 
  AlertCircle, 
  Users, 
  Compass, 
  ExternalLink,
  ChevronLeft
} from 'lucide-react';

interface ContextualNotificationHeaderProps {
  onSelectTab: (tab: PageView) => void;
}

export const ContextualNotificationHeader: React.FC<ContextualNotificationHeaderProps> = ({ onSelectTab }) => {
  const {
    activeNotifications,
    unreadCount,
    requestClearNotification,
    requestClearAll,
    isTrayOpen,
    setIsTrayOpen,
  } = useContextualNotifications();

  const [currentIndex, setCurrentIndex] = useState(0);

  if (activeNotifications.length === 0) {
    return null;
  }

  const currentNotif: ContextualNotification = activeNotifications[currentIndex % activeNotifications.length];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeNotifications.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeNotifications.length) % activeNotifications.length);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'community_update':
        return { label: 'Community Update', color: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40' };
      case 'mission_change':
        return { label: 'Mission Change', color: 'bg-purple-950/90 text-purple-300 border-purple-500/40' };
      case 'covenant_milestone':
        return { label: 'Covenant Ratified', color: 'bg-amber-950/90 text-amber-300 border-amber-500/40' };
      default:
        return { label: 'System Notice', color: 'bg-zinc-900 text-zinc-300 border-zinc-700' };
    }
  };

  const badge = getTypeBadge(currentNotif.type);

  return (
    <>
      {/* Dynamic Header Notification Strip */}
      <div 
        id="contextual-notification-header-strip"
        className="w-full bg-[#111111]/95 border-b border-[#C5A059]/25 py-1 sm:py-1.5 px-3 sm:px-6 lg:px-8 text-xs font-mono flex items-center justify-between gap-3 backdrop-blur-md relative z-30 transition-all"
      >
        {/* Left: Indicator & Content */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border font-bold ${badge.color}`}>
              {badge.label}
            </span>
            <span className="hidden md:inline-block text-[10px] text-[#C5A059]/80 font-serif">
              [{currentNotif.bioregion}]
            </span>
          </div>

          <div className="min-w-0 flex-1 flex items-center gap-2">
            <p className="truncate text-[11px] text-[#F5F5F0] font-sans font-medium">
              <span className="font-semibold text-white mr-1">{currentNotif.title}:</span>
              <span className="text-[#F5F5F0]/80">{currentNotif.summary}</span>
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {activeNotifications.length > 1 && (
            <div className="hidden sm:flex items-center gap-0.5 text-[10px] text-[#F5F5F0]/50 font-mono mr-1">
              <button
                onClick={handlePrev}
                className="p-0.5 hover:text-white rounded hover:bg-white/5 cursor-pointer"
                title="Previous update"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span>{((currentIndex % activeNotifications.length) + 1)}/{activeNotifications.length}</span>
              <button
                onClick={handleNext}
                className="p-0.5 hover:text-white rounded hover:bg-white/5 cursor-pointer"
                title="Next update"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Jump to view button if applicable */}
          {currentNotif.targetTab && (
            <button
              onClick={() => onSelectTab(currentNotif.targetTab!)}
              className="hidden lg:flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-[#C5A059] hover:text-amber-200 hover:underline cursor-pointer"
            >
              <span>Inspect</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          )}

          {/* View all button */}
          <button
            onClick={() => setIsTrayOpen(true)}
            className="px-2 py-0.5 bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 rounded text-[10px] font-mono transition-colors cursor-pointer"
          >
            Review ({unreadCount})
          </button>

          {/* Clear Button (Triggers Confirmation Modal) */}
          <button
            onClick={() => requestClearNotification(currentNotif.id)}
            title="Clear this update (Requires steward confirmation)"
            className="flex items-center gap-1 px-2 py-0.5 bg-[#1E1E1E] hover:bg-amber-950/40 text-amber-300 hover:text-amber-200 border border-[#F5F5F0]/15 hover:border-amber-500/40 rounded text-[10px] font-mono transition-colors cursor-pointer"
          >
            <Check className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Acknowledge &amp; Clear</span>
          </button>
        </div>
      </div>

      {/* Slide-Over Contextual Notifications Tray */}
      {isTrayOpen && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsTrayOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#0D0D0D] border-l border-[#C5A059]/40 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            
            {/* Tray Header */}
            <div className="p-4 border-b border-[#F5F5F0]/10 flex items-center justify-between bg-[#121212]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1B3022] border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-white">
                    Contextual Community &amp; Mission Updates
                  </h3>
                  <p className="text-[10px] font-mono text-[#C5A059]">
                    {unreadCount} Active Requiring Steward Acknowledgment
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTrayOpen(false)}
                className="p-1 rounded text-[#F5F5F0]/50 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subheader with Bulk Clear */}
            <div className="px-4 py-2 bg-[#161616] border-b border-[#F5F5F0]/10 flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-[#F5F5F0]/60 uppercase tracking-wider">
                Active Governance &amp; Field Stream
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={requestClearAll}
                  className="text-[10px] text-amber-400 hover:text-amber-200 underline cursor-pointer"
                >
                  Clear All (Require Confirmation)
                </button>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeNotifications.map((notif) => {
                const nBadge = getTypeBadge(notif.type);
                return (
                  <div
                    key={notif.id}
                    className="p-3.5 bg-[#141414] hover:bg-[#1A1A1A] border border-[#F5F5F0]/10 rounded-lg space-y-2 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${nBadge.color}`}>
                        {nBadge.label}
                      </span>
                      <span className="text-[10px] font-mono text-[#F5F5F0]/50">
                        {notif.relativeTime}
                      </span>
                    </div>

                    <h4 className="text-xs font-serif font-bold text-white">
                      {notif.title}
                    </h4>

                    <p className="text-[11px] text-[#F5F5F0]/80 font-sans leading-relaxed">
                      {notif.details}
                    </p>

                    <div className="pt-2 border-t border-[#F5F5F0]/5 flex items-center justify-between gap-2 text-[10px] font-mono">
                      <span className="text-[#C5A059]/80 truncate max-w-[180px]">
                        📍 {notif.bioregion}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {notif.targetTab && (
                          <button
                            onClick={() => {
                              onSelectTab(notif.targetTab!);
                              setIsTrayOpen(false);
                            }}
                            className="text-[#C5A059] hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Open</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => requestClearNotification(notif.id)}
                          className="px-2 py-0.5 bg-amber-950/40 text-amber-300 hover:text-amber-100 border border-amber-500/30 rounded text-[10px] flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-2.5 h-2.5" />
                          <span>Clear</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 bg-[#121212] border-t border-[#F5F5F0]/10 text-[10px] font-mono text-[#F5F5F0]/50 text-center">
              Atlas Sanctum Epistemic Assurance • Verified with Canon XXIII
            </div>
          </div>
        </>
      )}
    </>
  );
};
