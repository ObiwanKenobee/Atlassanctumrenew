import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  RefreshCw, 
  Check, 
  Copy, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  FileCode,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  SitemapEntry, 
  crawlCurrentViewState, 
  buildSitemapXml, 
  syncSitemapToHostedServer 
} from '../../lib/sitemapCrawler';
import { audioFeedback } from '../../lib/audioFeedback';
import { SitemapTopologyMap } from './SitemapTopologyMap';
import { PageView } from '../../types';

interface SitemapGeneratorTabProps {
  onNavigateTab?: (tab: PageView) => void;
}

export const SitemapGeneratorTab: React.FC<SitemapGeneratorTabProps> = ({ onNavigateTab }) => {
  const [entries, setEntries] = useState<SitemapEntry[]>(() => crawlCurrentViewState());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    synced: boolean;
    timestamp: string;
    count: number;
    message?: string;
  } | null>(null);
  const [activeSubView, setActiveSubView] = useState<'topology_map' | 'entries' | 'xml_preview'>('topology_map');
  const [copiedXml, setCopiedXml] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Fetch initial server status on mount
  useEffect(() => {
    fetch('/api/sitemap')
      .then(res => res.json())
      .then(data => {
        if (data && data.count) {
          setSyncStatus({
            synced: true,
            timestamp: data.lastGenerated,
            count: data.count,
            message: 'Hosted /sitemap.xml verified active on server'
          });
        }
      })
      .catch(() => {
        // server might be in static mode
      });
  }, []);

  const handleCrawlAndSync = async () => {
    audioFeedback.play('softClick');
    setIsSyncing(true);
    try {
      const freshEntries = crawlCurrentViewState();
      setEntries(freshEntries);
      const res = await syncSitemapToHostedServer(freshEntries);
      setSyncStatus({
        synced: res.success,
        timestamp: res.timestamp,
        count: res.count,
        message: 'Successfully generated and written to /sitemap.xml'
      });
    } catch (err: any) {
      console.error('Error syncing sitemap:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleIndex = (index: number) => {
    const updated = [...entries];
    updated[index].indexed = !updated[index].indexed;
    setEntries(updated);
  };

  const handlePriorityChange = (index: number, val: number) => {
    const updated = [...entries];
    updated[index].priority = Math.max(0.1, Math.min(1.0, val));
    setEntries(updated);
  };

  const currentXml = buildSitemapXml(entries);

  const handleCopyXml = () => {
    audioFeedback.play('softClick');
    navigator.clipboard.writeText(currentXml);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  const handleDownloadXml = () => {
    audioFeedback.play('softClick');
    const blob = new Blob([currentXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = ['all', ...Array.from(new Set(entries.map(e => e.category)))];
  const filteredEntries = filterCategory === 'all' 
    ? entries 
    : entries.filter(e => e.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Overview & Live Sync Control */}
      <div className="p-5 rounded-xl bg-[#080808] border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-serif font-bold text-white">
                Real-Time View State Sitemap Generator
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-bold">
                Hosted /sitemap.xml
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/60 mt-0.5 font-mono">
              Crawls the application's active routing tree and dynamically updates the hosted 
              <code className="text-[#C5A059] mx-1">/sitemap.xml</code> endpoint for Googlebot.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCrawlAndSync}
              disabled={isSyncing}
              className="px-4 py-2 rounded-lg bg-[#C5A059] text-black font-bold font-mono text-xs hover:bg-[#D8B46B] transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Crawling View State...' : 'Crawl & Sync /sitemap.xml'}</span>
            </button>

            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono text-xs border border-white/15 transition-colors flex items-center gap-1.5"
            >
              <span>View Hosted XML</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </a>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatus && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncStatus.message || 'Sitemap synchronized'}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-emerald-400/80">
              <span>Indexed Paths: <strong>{syncStatus.count}</strong></span>
              <span>•</span>
              <span>Updated: {new Date(syncStatus.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5 font-mono text-xs">
          <div className="p-3 rounded bg-black/40 border border-white/5">
            <span className="text-[#F5F5F0]/50 block text-[10px]">TOTAL PATHS</span>
            <span className="text-white font-bold text-sm mt-0.5 block">{entries.length} Modules</span>
          </div>
          <div className="p-3 rounded bg-black/40 border border-white/5">
            <span className="text-[#F5F5F0]/50 block text-[10px]">INDEXED IN SITEMAP</span>
            <span className="text-emerald-400 font-bold text-sm mt-0.5 block">
              {entries.filter(e => e.indexed).length} Routes
            </span>
          </div>
          <div className="p-3 rounded bg-black/40 border border-white/5">
            <span className="text-[#F5F5F0]/50 block text-[10px]">AVG CRAWL PRIORITY</span>
            <span className="text-[#C5A059] font-bold text-sm mt-0.5 block">
              {(entries.reduce((a, c) => a + c.priority, 0) / entries.length).toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded bg-black/40 border border-white/5">
            <span className="text-[#F5F5F0]/50 block text-[10px]">GOOGLE DISCOVERY</span>
            <span className="text-emerald-400 font-bold text-sm mt-0.5 block">Automated</span>
          </div>
        </div>
      </div>

      {/* View Switcher: Topology Map vs Entries vs XML */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveSubView('topology_map')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeSubView === 'topology_map' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
            }`}
          >
            Sitemap Topology Map
          </button>
          <button
            onClick={() => setActiveSubView('entries')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeSubView === 'entries' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
            }`}
          >
            Crawled Routes ({filteredEntries.length})
          </button>
          <button
            onClick={() => setActiveSubView('xml_preview')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeSubView === 'xml_preview' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Raw XML Preview</span>
          </button>
        </div>

        {activeSubView === 'entries' && (
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#F5F5F0]/50 text-[11px]">Filter Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#141414] border border-white/20 text-white rounded px-2.5 py-1 text-xs focus:outline-none"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c.toUpperCase()}</option>
              ))}
            </select>
          </div>
        )}

        {activeSubView === 'xml_preview' && (
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleCopyXml}
              className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white border border-white/15 flex items-center gap-1.5"
            >
              {copiedXml ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedXml ? 'Copied' : 'Copy XML'}</span>
            </button>
            <button
              onClick={handleDownloadXml}
              className="px-3 py-1 rounded bg-[#C5A059] text-black font-bold flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" />
              <span>Download .xml</span>
            </button>
          </div>
        )}
      </div>

      {/* SUB-VIEW 0: SITEMAP TOPOLOGY MAP */}
      {activeSubView === 'topology_map' && (
        <SitemapTopologyMap onNavigateTab={onNavigateTab} />
      )}

      {/* SUB-VIEW 1: CRAWLED ROUTES TABLE */}
      {activeSubView === 'entries' && (
        <div className="rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden font-mono text-xs">
          <div className="max-h-[440px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[#F5F5F0]/60 border-b border-white/10 text-[11px] sticky top-0 bg-[#0E0E0E] z-10">
                  <th className="p-3 w-16">Index</th>
                  <th className="p-3">Module Path</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Changefreq</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Lastmod</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEntries.map((entry, idx) => (
                  <tr key={entry.viewId} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={entry.indexed}
                        onChange={() => handleToggleIndex(idx)}
                        className="rounded border-white/30 text-[#C5A059] focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-white">{entry.name}</div>
                      <div className="text-[11px] text-emerald-400/80 truncate max-w-sm">{entry.loc}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-300 text-[10px]">
                        {entry.category}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-400">
                      {entry.changefreq}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={entry.priority}
                          onChange={(e) => handlePriorityChange(idx, parseFloat(e.target.value))}
                          className="w-16 accent-[#C5A059] cursor-pointer"
                        />
                        <span className="font-bold text-[#C5A059]">{entry.priority.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="p-3 text-neutral-400 text-[11px]">
                      {entry.lastmod}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: RAW XML PREVIEW */}
      {activeSubView === 'xml_preview' && (
        <div className="rounded-xl border border-white/10 bg-[#050505] p-4 font-mono text-xs overflow-x-auto max-h-[440px] text-[#A6E22E]">
          <pre className="whitespace-pre">{currentXml}</pre>
        </div>
      )}
    </div>
  );
};
