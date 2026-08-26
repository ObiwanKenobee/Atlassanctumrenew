import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Video, 
  Compass, 
  Clock, 
  Sparkles, 
  Search, 
  Filter, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2, 
  Share2, 
  Download, 
  Play, 
  Radio, 
  Layers, 
  ShieldCheck, 
  Tag, 
  Activity,
  X,
  Plus
} from 'lucide-react';
import { PLATFORM_EVENTS } from '../../data/platformContentData';
import { PlatformEvent, EventCategory, EventFormat } from '../../types/platformContent';
import { PageView } from '../../types';

interface EventsViewProps {
  onSelectTab?: (tab: PageView) => void;
  onInspectProvenance?: (prov: any) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  onSelectTab,
  onInspectProvenance
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeEventModal, setActiveEventModal] = useState<PlatformEvent | null>(null);
  const [rsvpSuccessId, setRsvpSuccessId] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState<string>('');

  const filteredEvents = PLATFORM_EVENTS.filter((evt) => {
    const matchesCat = selectedCategory === 'all' || evt.category === selectedCategory;
    const matchesFormat = selectedFormat === 'all' || evt.format === selectedFormat;
    const matchesSearch = 
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesFormat && matchesSearch;
  });

  const handleRsvp = (eventId: string) => {
    if (!emailInput.trim()) return;
    setRsvpSuccessId(eventId);
    setTimeout(() => {
      // simulate receipt
    }, 1000);
  };

  return (
    <div className="w-full bg-[#0A0A0A] text-[#F5F5F0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header & Overview */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-[#F5F5F0]/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-[#C5A059] tracking-[0.25em] font-bold">
              CIVILIZATION GATHERINGS & FIELD EXPERIMENTS
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F5F5F0]">
            Events, Conferences & Field Labs
          </h1>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/70 max-w-2xl font-sans leading-relaxed">
            Participate in global multi-stakeholder conventions, technical systems webinars, hands-on governance workshops, and ruggedized in-situ sensor deployments across active bioregions.
          </p>
        </div>

        {/* Global Event Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 text-right">
            <div className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">Active Sessions</div>
            <div className="text-xl font-bold font-mono text-[#C5A059]">{PLATFORM_EVENTS.length} Scheduled</div>
          </div>
          <div className="p-3.5 rounded-sm bg-[#0D0D0D] border border-emerald-500/30 text-right">
            <div className="text-[10px] font-mono text-emerald-400 uppercase">Total Registrants</div>
            <div className="text-xl font-bold font-mono text-emerald-400">4,000+ Stewards</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0D0D0D] border border-[#F5F5F0]/10 rounded-sm">
            {[
              { id: 'all', label: 'All Formats' },
              { id: 'conference', label: 'Conferences' },
              { id: 'webinar', label: 'Webinars' },
              { id: 'workshop', label: 'Workshops' },
              { id: 'field_activity', label: 'Field Activities' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-mono rounded-sm transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/50 shadow-sm font-bold'
                    : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#141414]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input & Format Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, topics, or cities..."
                className="w-full bg-[#0D0D0D] border border-[#F5F5F0]/10 pl-9 pr-3 py-1.5 text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/30 rounded-sm focus:outline-none focus:border-[#C5A059]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F5F5F0]/40 hover:text-[#F5F5F0]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-[#0D0D0D] border border-[#F5F5F0]/10 px-3 py-1.5 text-xs font-mono text-[#F5F5F0]/80 rounded-sm focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">Format: All</option>
              <option value="in_person">In-Person Only</option>
              <option value="virtual">Virtual Only</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Highlight Banner (First item) */}
      {PLATFORM_EVENTS[0] && selectedCategory === 'all' && !searchQuery && (
        <div className="p-6 sm:p-8 rounded-sm bg-[#0E1511] border border-[#C5A059]/40 relative overflow-hidden group">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#C5A059]/10 to-transparent pointer-events-none" />
          
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#C5A059] text-black font-bold rounded-sm">
                Featured Flagship Summit
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#14261C] text-[#C5A059] border border-[#C5A059]/30 rounded-sm">
                Hybrid Global Arena
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                October 14-16, 2026
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0]">
              {PLATFORM_EVENTS[0].title}
            </h2>

            <p className="text-xs sm:text-sm text-[#F5F5F0]/80 leading-relaxed font-sans">
              {PLATFORM_EVENTS[0].summary}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#F5F5F0]/60 pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                {PLATFORM_EVENTS[0].locationName}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#C5A059]" />
                {PLATFORM_EVENTS[0].registeredCount} / {PLATFORM_EVENTS[0].capacity} Registered
              </span>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setActiveEventModal(PLATFORM_EVENTS[0])}
                className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs rounded-sm flex items-center gap-2 transition-all shadow-md"
              >
                <span>Reserve Seat & View Full Agenda</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              {onSelectTab && (
                <button
                  onClick={() => onSelectTab('system-model-studio')}
                  className="px-4 py-2 bg-[#141414] hover:bg-[#1f1f1f] text-[#F5F5F0] border border-[#F5F5F0]/20 font-mono text-xs rounded-sm flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Preview Studio Simulation</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[#F5F5F0]/60 border-b border-[#F5F5F0]/10 pb-2">
          <span>Displaying {filteredEvents.length} Gatherings</span>
          <span className="text-[#C5A059]">● Live RSVP Gateways Open</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => {
            const isFull = event.registeredCount >= event.capacity;
            return (
              <div
                key={event.id}
                className="p-6 rounded-sm bg-[#0D0D0D] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 transition-all flex flex-col justify-between space-y-5 hover:bg-[#121212] group"
              >
                <div className="space-y-3">
                  {/* Category & Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1A1A1A] border border-[#F5F5F0]/20 text-[#C5A059] font-bold rounded-sm">
                        {event.categoryLabel}
                      </span>
                      <span className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">
                        {event.format === 'in_person' ? 'In-Person' : event.format === 'virtual' ? 'Virtual' : 'Hybrid'}
                      </span>
                    </div>
                    {isFull ? (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-sm border border-amber-400/30">
                        Capacity Reached
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        RSVP Open
                      </span>
                    )}
                  </div>

                  {/* Title & Summary */}
                  <h3 className="text-xl font-serif font-bold text-[#F5F5F0] group-hover:text-[#C5A059] transition-colors leading-snug">
                    {event.title}
                  </h3>

                  <p className="text-xs text-[#F5F5F0]/70 line-clamp-3 leading-relaxed font-sans">
                    {event.summary}
                  </p>

                  {/* Metadata Chips */}
                  <div className="space-y-2 pt-2 border-t border-[#F5F5F0]/5 text-xs font-mono text-[#F5F5F0]/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {event.timezone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="truncate">{event.locationName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{event.registeredCount.toLocaleString()} / {event.capacity.toLocaleString()} spots</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {event.tags.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 text-[9px] font-mono bg-[#141414] text-[#F5F5F0]/60 rounded-sm">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-[#F5F5F0]/10 flex items-center justify-between">
                  <button
                    onClick={() => setActiveEventModal(event)}
                    className="text-xs font-mono text-[#C5A059] hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>View Agenda & Speakers</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {event.livestreamUrl && (
                      <a
                        href={event.livestreamUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-[#1A1A1A] hover:bg-[#252525] text-emerald-400 rounded-sm text-xs font-mono flex items-center gap-1"
                        title="Live Stream Link"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => setActiveEventModal(event)}
                      className="px-3.5 py-1.5 bg-[#1B3022] hover:bg-[#254530] text-[#C5A059] border border-[#C5A059]/40 text-xs font-mono font-bold rounded-sm transition-all"
                    >
                      {isFull ? 'Join Waitlist' : 'RSVP Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EVENT DETAIL & RSVP MODAL */}
      {/* ========================================================================= */}
      {activeEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-[#0D0D0D] border border-[#C5A059]/50 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveEventModal(null)}
              className="absolute top-4 right-4 p-2 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:bg-[#1A1A1A] rounded-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 border-b border-[#F5F5F0]/10 pb-5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#1A1A1A] border border-[#F5F5F0]/20 text-[#C5A059] font-bold rounded-sm">
                  {activeEventModal.categoryLabel}
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  ● Verified Bioregional Schedule
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0]">
                {activeEventModal.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-[#F5F5F0]/70 pt-1">
                <span>📅 {new Date(activeEventModal.startDate).toLocaleString()}</span>
                <span>📍 {activeEventModal.locationName}</span>
                <span>👥 {activeEventModal.registeredCount} / {activeEventModal.capacity} Enrolled</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 text-xs sm:text-sm text-[#F5F5F0]/80 leading-relaxed font-sans">
              <p>{activeEventModal.description}</p>
            </div>

            {/* Speakers List */}
            {activeEventModal.speakers.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider font-bold">
                  Featured Speakers & Session Leads
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeEventModal.speakers.map((spk) => (
                    <div key={spk.id} className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm space-y-1">
                      <div className="text-xs font-bold font-mono text-[#F5F5F0]">{spk.name}</div>
                      <div className="text-[11px] text-[#F5F5F0]/60">{spk.role} • {spk.organization}</div>
                      {spk.topic && (
                        <div className="text-[10px] font-mono text-[#C5A059]">Topic: {spk.topic}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Agenda */}
            {activeEventModal.agenda.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider font-bold">
                  Event Schedule & Tracks
                </div>
                <div className="space-y-2">
                  {activeEventModal.agenda.map((ag) => (
                    <div key={ag.id} className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#F5F5F0]">{ag.title}</div>
                        <div className="text-[11px] text-[#F5F5F0]/60">{ag.description}</div>
                        {ag.speaker && <div className="text-[10px] font-mono text-[#C5A059]">Speaker: {ag.speaker}</div>}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-sm shrink-0">
                        {ag.timeSlot}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RSVP Form Section */}
            <div className="p-4 bg-[#141F17] border border-[#C5A059]/40 rounded-sm space-y-3">
              <div className="text-xs font-mono uppercase text-[#C5A059] font-bold flex items-center justify-between">
                <span>Instant Confirmation & Cryptographic Pass</span>
                <span>Zero Fee Open Event</span>
              </div>
              
              {rsvpSuccessId === activeEventModal.id ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>RSVP Confirmed! Access credentials and .ics calendar invites dispatched to {emailInput}.</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email to receive pass & link..."
                    className="flex-1 bg-[#0A0A0A] border border-[#F5F5F0]/20 px-3 py-2 text-xs text-[#F5F5F0] rounded-sm focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    onClick={() => handleRsvp(activeEventModal.id)}
                    className="px-5 py-2 bg-[#C5A059] hover:bg-[#b08e4c] text-black font-mono font-bold text-xs rounded-sm transition-all shadow-md"
                  >
                    Confirm Registration
                  </button>
                </div>
              )}
            </div>

            {/* Provenance & Close */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F0]/10 text-xs font-mono">
              {onInspectProvenance && (
                <button
                  onClick={() => onInspectProvenance(activeEventModal.provenance)}
                  className="text-[#F5F5F0]/60 hover:text-[#C5A059] flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Inspect Event Epistemic Provenance</span>
                </button>
              )}
              <button
                onClick={() => setActiveEventModal(null)}
                className="px-4 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] text-[#F5F5F0] text-xs font-mono rounded-sm transition-colors ml-auto"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
