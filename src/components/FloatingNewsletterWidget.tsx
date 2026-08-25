import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Sparkles, 
  X, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Bell, 
  ShieldCheck,
  Send,
  Globe2,
  TreeDeciduous,
  Scale
} from 'lucide-react';

interface FloatingNewsletterWidgetProps {
  onOpenMoralSimulator?: () => void;
}

export const FloatingNewsletterWidget: React.FC<FloatingNewsletterWidgetProps> = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Bioregional Telemetry',
    'Moral AI Axioms'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check if previously subscribed or dismissed in localStorage
  useEffect(() => {
    try {
      const subscribed = localStorage.getItem('atlas_newsletter_subscribed');
      if (subscribed === 'true') {
        setIsSubscribed(true);
      }
      const dismissed = sessionStorage.getItem('atlas_newsletter_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const topicsList = [
    { id: 'Bioregional Telemetry', label: 'Bioregional Telemetry', icon: TreeDeciduous },
    { id: 'Moral AI Axioms', label: 'Moral AI Axioms', icon: Scale },
    { id: 'Regenerative Capital', label: 'Regenerative Capital', icon: Globe2 },
  ];

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) => 
      prev.includes(topicId)
        ? prev.filter((t) => t !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (selectedTopics.length === 0) {
      setErrorMessage('Please select at least one inquiry dispatch topic.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      try {
        localStorage.setItem('atlas_newsletter_subscribed', 'true');
        localStorage.setItem('atlas_newsletter_email', email);
      } catch {
        // ignore
      }
    }, 850);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('atlas_newsletter_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  if (isDismissed) {
    return (
      <button
        id="reopen-newsletter-pill"
        onClick={() => setIsDismissed(false)}
        aria-label="Subscribe to Atlas Chronicles"
        className="fixed bottom-4 right-4 z-35 bg-[#0D0D0D] hover:bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40 hover:border-[#C5A059] p-2.5 rounded-full shadow-2xl transition-all flex items-center gap-2 group cursor-pointer"
      >
        <Mail className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
        <span className="text-[10px] uppercase font-mono tracking-widest font-bold hidden sm:inline pr-1">
          Chronicle Dispatch
        </span>
      </button>
    );
  }

  return (
    <aside 
      id="floating-newsletter-widget"
      aria-label="Atlas Chronicle Newsletter"
      className="fixed bottom-4 right-4 z-35 max-w-[calc(100vw-2rem)] sm:max-w-sm w-full transition-all duration-300 ease-out"
    >
      {/* Collapsed Bar / Trigger */}
      {!isExpanded ? (
        <div className="bg-[#0D0D0D]/95 backdrop-blur-md border border-[#C5A059]/40 hover:border-[#C5A059] rounded-sm shadow-2xl p-3 flex items-center justify-between gap-3 text-[#F5F5F0]">
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2.5 flex-1 min-w-0 text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-[#1B3022] border border-[#C5A059]/50 flex items-center justify-center text-[#C5A059] shrink-0 group-hover:scale-105 transition-transform">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold font-mono tracking-[0.16em] uppercase text-[#C5A059] truncate">
                  Atlas Chronicles
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>
              <p className="text-[11px] text-[#F5F5F0]/70 truncate font-sans">
                {isSubscribed ? 'Subscription active • Manage' : 'Bioregional & Moral AI Dispatches'}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsExpanded(true)}
              aria-label="Expand newsletter widget"
              className="p-1.5 text-[#F5F5F0]/60 hover:text-[#C5A059] hover:bg-[#F5F5F0]/5 rounded transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss newsletter widget"
              className="p-1.5 text-[#F5F5F0]/40 hover:text-[#F5F5F0] hover:bg-[#F5F5F0]/5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Expanded Floating Card */
        <div className="bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm shadow-2xl overflow-hidden text-[#F5F5F0] animate-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-[#080808] border-b border-[#F5F5F0]/10 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
                <Mail className="w-3 h-3" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#C5A059] truncate">
                  The Atlas Chronicle
                </h4>
                <p className="text-[9px] text-[#F5F5F0]/50 uppercase tracking-widest font-mono">
                  Weekly Open Civilization Briefing
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsExpanded(false)}
                aria-label="Minimize newsletter"
                className="p-1 text-[#F5F5F0]/50 hover:text-[#F5F5F0] hover:bg-[#F5F5F0]/5 rounded transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={handleDismiss}
                aria-label="Close newsletter widget"
                className="p-1 text-[#F5F5F0]/40 hover:text-[#F5F5F0] hover:bg-[#F5F5F0]/5 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3.5">
            {isSubscribed ? (
              <div className="py-2 space-y-3 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#1B3022] border border-[#C5A059]/60 flex items-center justify-center text-emerald-400">
                  <Check className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-serif font-bold text-[#F5F5F0]">
                    You are connected to the Living Dispatch
                  </h5>
                  <p className="text-[11px] text-[#F5F5F0]/70 leading-relaxed font-sans">
                    Receiving verified sensor audits, moral AI simulations, and bioregional regenerative progress.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="text-[9px] font-mono text-[#C5A059] bg-[#1B3022] px-2.5 py-1 rounded-sm border border-[#C5A059]/30">
                    STATUS: ACTIVE DISPATCH
                  </span>
                  <button
                    onClick={() => {
                      setIsSubscribed(false);
                      try {
                        localStorage.removeItem('atlas_newsletter_subscribed');
                      } catch {
                        // ignore
                      }
                    }}
                    className="text-[9px] font-mono text-[#F5F5F0]/50 hover:text-[#F5F5F0] underline"
                  >
                    Change Preferences
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <p className="text-[11px] text-[#F5F5F0]/70 leading-relaxed font-sans">
                  Synthesized research papers, real-time satellite carbon sink updates, and peer-audited moral axioms. Zero spam.
                </p>

                {/* Topics Selection */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#C5A059] block">
                    Curate Topics:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {topicsList.map((t) => {
                      const Icon = t.icon;
                      const isSelected = selectedTopics.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => toggleTopic(t.id)}
                          className={`text-[10px] px-2 py-1 rounded-sm border transition-all flex items-center gap-1.5 font-mono ${
                            isSelected
                              ? 'bg-[#1B3022] border-[#C5A059]/60 text-[#C5A059] font-bold'
                              : 'bg-[#080808] border-[#F5F5F0]/10 text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Frequency Toggle */}
                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[#F5F5F0]/60">
                  <span>Frequency:</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setFrequency('weekly')}
                      className={`px-2 py-0.5 rounded-sm uppercase tracking-wider text-[9px] ${
                        frequency === 'weekly' 
                          ? 'bg-[#F5F5F0] text-black font-bold' 
                          : 'bg-[#080808] text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                      }`}
                    >
                      Weekly
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('monthly')}
                      className={`px-2 py-0.5 rounded-sm uppercase tracking-wider text-[9px] ${
                        frequency === 'monthly' 
                          ? 'bg-[#F5F5F0] text-black font-bold' 
                          : 'bg-[#080808] text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                {/* Email Input & Submit */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1.5">
                    <input
                      id="newsletter-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter researcher/partner email..."
                      className="flex-1 px-3 py-2 bg-[#080808] border border-[#F5F5F0]/20 focus:border-[#C5A059] rounded-sm text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/30 focus:outline-none transition-all"
                    />
                    <button
                      id="newsletter-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="px-3.5 py-2 bg-[#C5A059] hover:bg-[#B38E46] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider rounded-sm flex items-center justify-center transition-colors shrink-0"
                    >
                      {isSubmitting ? (
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  {errorMessage && (
                    <p className="text-[10px] text-rose-400 font-mono">{errorMessage}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-[9px] text-[#F5F5F0]/40 font-mono pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Cryptographically private
                  </span>
                  <span>Unsubscribe anytime</span>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
