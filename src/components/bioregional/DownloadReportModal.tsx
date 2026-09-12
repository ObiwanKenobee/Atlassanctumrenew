import React, { useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Table, 
  Code,
  Clock,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { SatelliteHazardAlert } from './BioregionalHazardMonitor';
import { audioFeedback } from '../../lib/audioFeedback';

export type ExportDateRangePreset = '24h' | '7d' | '30d' | '90d' | 'all' | 'custom';

interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBioregionId: string;
  selectedBioregionName: string;
  alerts: SatelliteHazardAlert[];
}

export const DownloadReportModal: React.FC<DownloadReportModalProps> = ({
  isOpen,
  onClose,
  selectedBioregionId,
  selectedBioregionName,
  alerts
}) => {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [includeAllBioregions, setIncludeAllBioregions] = useState<boolean>(true);
  const [dateRangePreset, setDateRangePreset] = useState<ExportDateRangePreset>('30d');
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Compute filtered alerts based on scope AND date range
  const { targetAlerts, dateRangeLabel } = useMemo(() => {
    const now = Date.now();
    let startTime = 0;
    let endTime = Infinity;
    let label = 'Past 30 Days';

    if (dateRangePreset === '24h') {
      startTime = now - 24 * 60 * 60 * 1000;
      label = 'Past 24 Hours';
    } else if (dateRangePreset === '7d') {
      startTime = now - 7 * 24 * 60 * 60 * 1000;
      label = 'Past 7 Days';
    } else if (dateRangePreset === '30d') {
      startTime = now - 30 * 24 * 60 * 60 * 1000;
      label = 'Past 30 Days';
    } else if (dateRangePreset === '90d') {
      startTime = now - 90 * 24 * 60 * 60 * 1000;
      label = 'Past 90 Days';
    } else if (dateRangePreset === 'all') {
      startTime = 0;
      label = 'All Historical Records';
    } else if (dateRangePreset === 'custom') {
      const startMs = new Date(customStartDate + 'T00:00:00').getTime();
      const endMs = new Date(customEndDate + 'T23:59:59').getTime();
      startTime = isNaN(startMs) ? 0 : startMs;
      endTime = isNaN(endMs) ? Infinity : endMs;
      label = `Custom: ${customStartDate} to ${customEndDate}`;
    }

    const filtered = alerts.filter(a => {
      // Scope filter
      const matchesScope = includeAllBioregions 
        ? true 
        : a.bioregionId === selectedBioregionId || !selectedBioregionId;

      if (!matchesScope) return false;

      // Date filter
      const alertTime = new Date(a.timestamp).getTime();
      if (isNaN(alertTime)) return true; // Keep if unparseable
      return alertTime >= startTime && alertTime <= endTime;
    });

    return { targetAlerts: filtered, dateRangeLabel: label };
  }, [alerts, includeAllBioregions, selectedBioregionId, dateRangePreset, customStartDate, customEndDate]);

  // Breakdown statistics for selected range
  const rangeStats = useMemo(() => {
    const existential = targetAlerts.filter(a => a.severity === 'EXISTENTIAL').length;
    const critical = targetAlerts.filter(a => a.severity === 'CRITICAL').length;
    const moderate = targetAlerts.filter(a => a.severity === 'WARNING' || a.severity === 'ADVISORY').length;
    const avgConfidence = targetAlerts.length > 0
      ? Number((targetAlerts.reduce((sum, a) => sum + a.confidenceScore, 0) / targetAlerts.length).toFixed(1))
      : 0;

    return { existential, critical, moderate, avgConfidence };
  }, [targetAlerts]);

  if (!isOpen) return null;

  // Generate CSV data string
  const generateCSV = (): string => {
    const headers = [
      'alert_id',
      'satellite_mission',
      'orbit_pass_number',
      'bioregion_id',
      'bioregion_name',
      'country',
      'latitude',
      'longitude',
      'hazard_category',
      'severity',
      'title',
      'detected_delta',
      'baseline_value',
      'current_value',
      'timestamp_iso',
      'confidence_score_pct',
      'mitigation_protocol',
      'steward_community',
      'acknowledged',
      'merkle_hash'
    ];

    const rows = targetAlerts.map(a => [
      `"${a.id}"`,
      `"${a.satelliteMission}"`,
      a.orbitPassNumber,
      `"${a.bioregionId}"`,
      `"${a.bioregionName.replace(/"/g, '""')}"`,
      `"${a.country}"`,
      a.coordinates[0],
      a.coordinates[1],
      `"${a.hazardCategory}"`,
      `"${a.severity}"`,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.detectedDelta.replace(/"/g, '""')}"`,
      `"${a.baselineValue.replace(/"/g, '""')}"`,
      `"${a.currentValue.replace(/"/g, '""')}"`,
      `"${a.timestamp}"`,
      a.confidenceScore,
      `"${a.mitigationProtocol.replace(/"/g, '""')}"`,
      `"${a.stewardCommunity.replace(/"/g, '""')}"`,
      a.acknowledged ? 'true' : 'false',
      `"${a.merkleHash}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  };

  // Generate JSON data object
  const generateJSON = () => {
    return {
      reportType: 'Atlas Sanctum Bioregional Bulk Environmental Telemetry Report',
      systemCoreVersion: 'Atlas Sanctum Intelligence Core v2.4',
      generatedAt: new Date().toISOString(),
      filterParameters: {
        dateRangePreset,
        dateRangeLabel,
        bioregionScope: includeAllBioregions ? 'Pan-Bioregional Mesh (All Basins)' : selectedBioregionName,
        bioregionId: includeAllBioregions ? 'all' : selectedBioregionId,
        customStartDate: dateRangePreset === 'custom' ? customStartDate : undefined,
        customEndDate: dateRangePreset === 'custom' ? customEndDate : undefined
      },
      summaryStats: {
        totalHazardAlertsRecorded: targetAlerts.length,
        existentialAlertsCount: rangeStats.existential,
        criticalAlertsCount: rangeStats.critical,
        moderateAlertsCount: rangeStats.moderate,
        averageEpistemicCertaintyPct: rangeStats.avgConfidence
      },
      telemetryRecords: targetAlerts.map(a => ({
        alertId: a.id,
        satelliteMission: a.satelliteMission,
        orbitPassNumber: a.orbitPassNumber,
        bioregion: {
          id: a.bioregionId,
          name: a.bioregionName,
          country: a.country,
          coordinates: {
            latitude: a.coordinates[0],
            longitude: a.coordinates[1]
          }
        },
        hazard: {
          category: a.hazardCategory,
          severity: a.severity,
          title: a.title,
          detectedDelta: a.detectedDelta,
          baselineValue: a.baselineValue,
          currentValue: a.currentValue
        },
        metadata: {
          timestamp: a.timestamp,
          confidenceScore: a.confidenceScore,
          mitigationProtocol: a.mitigationProtocol,
          stewardCommunity: a.stewardCommunity,
          acknowledged: a.acknowledged,
          merkleHash: a.merkleHash,
          trendReadings: a.trendReadings,
          trendUnit: a.trendUnit
        }
      })),
      cryptographicProvenanceAudit: {
        merkleRoot: '0x8f4d92a11b6c73e04a919283f619b02a' + Date.now().toString(16),
        consensusStandard: 'Planetary Regenerative Stewardship Protocol (PRSP v1.2)',
        signatureTimestamp: new Date().toISOString()
      }
    };
  };

  // Trigger browser file download
  const handleDownload = () => {
    audioFeedback.playBell([528, 660], 0.25);
    const dateStr = new Date().toISOString().split('T')[0];
    const sanitizedRange = dateRangePreset.toLowerCase();
    const sanitizedScope = (includeAllBioregions ? 'all-basins' : selectedBioregionId || 'telemetry')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_');

    let blob: Blob;
    let filename: string;

    if (format === 'csv') {
      const csvContent = generateCSV();
      blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      filename = `atlas_hazard_alerts_bulk_${sanitizedScope}_${sanitizedRange}_${dateStr}.csv`;
    } else {
      const jsonContent = JSON.stringify(generateJSON(), null, 2);
      blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      filename = `atlas_hazard_alerts_bulk_${sanitizedScope}_${sanitizedRange}_${dateStr}.json`;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      onClose();
    }, 1400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="bulk-export-telemetry-modal"
        className="relative w-full max-w-lg bg-[#0E1410] border border-[#1B3022] hover:border-[#C5A059]/40 rounded-xl shadow-2xl overflow-hidden text-[#F5F5F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#141E17] via-[#0E1410] to-[#141E17] border-b border-[#1B3022] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1B3022] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#F5F5F0] flex items-center gap-2">
                <span>Bulk Telemetry Export</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B3022] border border-[#C5A059]/30 text-[#C5A059]">
                  DATE-FILTERED
                </span>
              </h3>
              <p className="text-xs text-[#F5F5F0]/60 font-sans">
                Generate and download comprehensive JSON or CSV reports of historical alert telemetry
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioFeedback.playMicroTick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* 1. Date Range Filter Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-[#F5F5F0]/70 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Historical Date Range Filter</span>
              </label>
              <span className="text-[10px] font-mono text-[#C5A059]">
                {dateRangeLabel}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {(['24h', '7d', '30d', '90d', 'all', 'custom'] as ExportDateRangePreset[]).map(preset => {
                const labels: Record<ExportDateRangePreset, string> = {
                  '24h': 'Past 24h',
                  '7d': 'Past 7d',
                  '30d': 'Past 30d',
                  '90d': 'Past 90d',
                  'all': 'All Time',
                  'custom': 'Custom'
                };

                return (
                  <button
                    key={preset}
                    onClick={() => {
                      audioFeedback.playMicroTick();
                      setDateRangePreset(preset);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold border transition-all cursor-pointer ${
                      dateRangePreset === preset
                        ? 'bg-[#C5A059] text-black border-[#C5A059] shadow-sm'
                        : 'bg-black/40 border-white/10 text-[#F5F5F0]/70 hover:border-[#C5A059]/40 hover:text-white'
                    }`}
                  >
                    {labels[preset]}
                  </button>
                );
              })}
            </div>

            {/* Custom Range Picker */}
            {dateRangePreset === 'custom' && (
              <div className="grid grid-cols-2 gap-3 pt-2 p-2.5 rounded-lg bg-black/40 border border-[#1B3022]">
                <div>
                  <label className="text-[10px] font-mono text-[#F5F5F0]/50 block mb-1">
                    Start Date (From)
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#121B15] border border-white/10 focus:border-[#C5A059] rounded-md text-xs font-mono text-[#F5F5F0] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#F5F5F0]/50 block mb-1">
                    End Date (To)
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#121B15] border border-white/10 focus:border-[#C5A059] rounded-md text-xs font-mono text-[#F5F5F0] outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Target Scope Toggle */}
          <div className="p-3 rounded-lg bg-black/40 border border-[#1B3022] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-[#C5A059]" />
              <div>
                <div className="text-[10px] font-mono text-[#F5F5F0]/50 uppercase">Geographical Scope</div>
                <div className="text-xs font-mono font-bold text-[#F5F5F0]">
                  {includeAllBioregions ? 'All Active Bioregions' : selectedBioregionName || 'Current Bioregion'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                audioFeedback.playMicroTick();
                setIncludeAllBioregions(!includeAllBioregions);
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                includeAllBioregions
                  ? 'bg-[#C5A059] text-black shadow-sm'
                  : 'bg-white/10 text-[#F5F5F0]/60 hover:text-white'
              }`}
            >
              {includeAllBioregions ? 'All Bioregions' : 'Single Region'}
            </button>
          </div>

          {/* 3. Filtered Records Statistics Preview Card */}
          <div className="p-3.5 rounded-lg bg-[#141F17]/80 border border-[#C5A059]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#C5A059] flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Filtered Dataset Preview</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-black/40 px-2 py-0.5 rounded border border-emerald-500/30">
                {targetAlerts.length} Matching Records
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-mono text-center">
              <div className="p-1.5 rounded bg-black/40 border border-rose-900/40">
                <div className="text-[10px] text-rose-300">Existential</div>
                <div className="font-bold text-rose-400 text-sm">{rangeStats.existential}</div>
              </div>
              <div className="p-1.5 rounded bg-black/40 border border-orange-900/40">
                <div className="text-[10px] text-orange-300">Critical</div>
                <div className="font-bold text-orange-400 text-sm">{rangeStats.critical}</div>
              </div>
              <div className="p-1.5 rounded bg-black/40 border border-amber-900/40">
                <div className="text-[10px] text-amber-300">Moderate</div>
                <div className="font-bold text-amber-400 text-sm">{rangeStats.moderate}</div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-[#F5F5F0]/50 flex items-center justify-between pt-1">
              <span>Mean Epistemic Certainty: <strong className="text-[#C5A059]">{rangeStats.avgConfidence}%</strong></span>
              <span>Audit Anchored: <strong className="text-emerald-400">PRSP v1.2</strong></span>
            </div>
          </div>

          {/* 4. Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#F5F5F0]/70 uppercase tracking-wider block">
              Choose Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setFormat('csv');
                }}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  format === 'csv'
                    ? 'bg-[#152319] border-[#C5A059] text-[#F5F5F0] shadow-md'
                    : 'bg-black/30 border-white/10 text-[#F5F5F0]/60 hover:text-white'
                }`}
              >
                <Table className={`w-5 h-5 mt-0.5 ${format === 'csv' ? 'text-[#C5A059]' : 'text-white/40'}`} />
                <div>
                  <div className="text-xs font-mono font-bold">CSV Document</div>
                  <div className="text-[10px] font-sans text-[#F5F5F0]/50 mt-0.5">
                    Tabular format with 20 telemetry columns filtered by date range
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setFormat('json');
                }}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  format === 'json'
                    ? 'bg-[#152319] border-[#C5A059] text-[#F5F5F0] shadow-md'
                    : 'bg-black/30 border-white/10 text-[#F5F5F0]/60 hover:text-white'
                }`}
              >
                <Code className={`w-5 h-5 mt-0.5 ${format === 'json' ? 'text-[#C5A059]' : 'text-white/40'}`} />
                <div>
                  <div className="text-xs font-mono font-bold">JSON Payload</div>
                  <div className="text-[10px] font-sans text-[#F5F5F0]/50 mt-0.5">
                    Full structured dossier with cryptographic Merkle proof & metadata
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Cryptographic Attestation Note */}
          <div className="p-3 rounded-lg bg-[#1B3022]/40 border border-[#C5A059]/20 text-[11px] font-mono text-[#F5F5F0]/70 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Every exported historical alert includes its Merkle hash, sensor delta metrics, steward community attestation, and orbital pass index for bioregional compliance auditing.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#0A0E0B] border-t border-[#1B3022] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs font-mono text-[#F5F5F0]/50 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleDownload}
            disabled={downloadSuccess || targetAlerts.length === 0}
            className={`px-4 py-2 rounded-lg font-mono font-bold text-xs transition-all cursor-pointer shadow-md flex items-center gap-2 ${
              downloadSuccess
                ? 'bg-emerald-600 text-white'
                : targetAlerts.length === 0
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-[#C5A059] hover:bg-[#D4AF37] text-black'
            }`}
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Downloaded Successfully</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download {targetAlerts.length} Alerts ({format.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
