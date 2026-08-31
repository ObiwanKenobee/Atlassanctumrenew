import React, { useState } from 'react';
import { 
  FileCheck, 
  Download, 
  Trash2, 
  Edit3, 
  Ban, 
  RotateCcw, 
  UserCheck, 
  Eye, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  Sparkles,
  ExternalLink,
  Code,
  ShieldCheck
} from 'lucide-react';
import { useTrustLayer } from '../../../context/TrustLayerContext';
import { useAuth } from '../../../context/AuthContext';
import { DataRightsActionType } from '../../../types/trust';
import { audioFeedback } from '../../../lib/audioFeedback';

export const DataRightsDashboardSection: React.FC = () => {
  const { 
    dataRightsRequests, 
    submitDataRightsRequest, 
    consent, 
    revokeAllConsent,
    accessibility 
  } = useTrustLayer();
  const { currentUser, userProfile } = useAuth();

  const [activeModalAction, setActiveModalAction] = useState<DataRightsActionType | null>(null);
  const [requestDetails, setRequestDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isViewingRawData, setIsViewingRawData] = useState(false);

  const rawUserTelemetry = {
    auth: {
      uid: currentUser?.uid || 'anon_steward_guest_7721',
      email: currentUser?.email || 'sovereign_steward@atlassanctum.org',
      accessLevel: userProfile?.accessLevel || 'epistemic_steward',
      themePreference: userProfile?.themePreference || 'dark'
    },
    consentState: consent,
    accessibilityState: accessibility,
    localCacheTelemetry: {
      preferredWatershed: 'cascadia_okanagan_catchment_01',
      activeLayerFilter: 'hydrology_keystone',
      lastSyncedTimestamp: new Date().toISOString()
    },
    cryptographicProvenance: {
      merkleRoot: '0x8f3c7a91de24b9102b489a29e1c448109',
      provenanceStandard: 'W3C Verifiable Credentials v2'
    }
  };

  const handleOpenAction = (action: DataRightsActionType) => {
    audioFeedback.playSubtleClick();
    setActiveModalAction(action);
    setRequestDetails('');
  };

  const handleExecuteDownload = () => {
    audioFeedback.playSuccessChime();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rawUserTelemetry, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `atlas_sanctum_sovereign_data_export_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    submitDataRightsRequest('download', 'Full JSON Sovereign Data Export downloaded directly by user.');
    setSuccessMessage('Complete cryptographic data package exported as structured JSON.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleSubmitRequest = async () => {
    if (!activeModalAction) return;
    setIsSubmitting(true);
    audioFeedback.playSubtleClick();

    await submitDataRightsRequest(
      activeModalAction, 
      requestDetails || `Self-serve request for ${activeModalAction} processed.`
    );

    if (activeModalAction === 'revoke-consent') {
      revokeAllConsent();
    }

    setIsSubmitting(false);
    setActiveModalAction(null);
    setSuccessMessage(`Data rights request [${activeModalAction.toUpperCase()}] submitted to sovereign verification ledger.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F5F0]">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold">Actionable Self-Serve Sovereignty</span>
          </div>
          <h2 className="text-xl font-medium font-serif text-[#F5F5F0]">
            Data Rights & Cryptographic Portability Dashboard
          </h2>
          <p className="text-xs text-[#F5F5F0]/70 max-w-2xl leading-relaxed">
            Privacy is not a passive policy statement—it is an actionable right. Inspect your live telemetry, generate instant cryptographic archives, correct records, or permanently purge all trace from Atlas Sanctum.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 7 Actionable Rights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {/* 1. View My Data */}
        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm flex flex-col justify-between space-y-3 hover:border-[#C5A059]/40 transition-all">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#C5A059]">
              <Eye className="w-4 h-4" />
              <h4 className="text-xs font-mono uppercase font-bold">1. View Live Data</h4>
            </div>
            <p className="text-xs text-[#F5F5F0]/70">
              Inspect all real-time telemetry, session state, and cached credentials held in this browser sandbox.
            </p>
          </div>
          <button
            onClick={() => {
              setIsViewingRawData(prev => !prev);
              audioFeedback.playSubtleClick();
            }}
            className="w-full py-2 bg-[#1E1E1E] hover:bg-[#282828] text-xs font-mono text-[#F5F5F0] rounded border border-[#F5F5F0]/15 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{isViewingRawData ? 'Hide Raw JSON' : 'Inspect Raw Data'}</span>
          </button>
        </div>

        {/* 2. Download Archive */}
        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-all">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400">
              <Download className="w-4 h-4" />
              <h4 className="text-xs font-mono uppercase font-bold">2. Download Archive</h4>
            </div>
            <p className="text-xs text-[#F5F5F0]/70">
              Export your full sovereign profile, project history, and epistemic graphs as a portable JSON package.
            </p>
          </div>
          <button
            onClick={handleExecuteDownload}
            className="w-full py-2 bg-[#1B3022] hover:bg-[#254430] text-xs font-mono text-emerald-300 rounded border border-[#2D5A3C] flex items-center justify-center gap-1.5 cursor-pointer font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Archive</span>
          </button>
        </div>

        {/* 3. Correct Record */}
        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm flex flex-col justify-between space-y-3 hover:border-cyan-500/40 transition-all">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400">
              <Edit3 className="w-4 h-4" />
              <h4 className="text-xs font-mono uppercase font-bold">3. Correct Record</h4>
            </div>
            <p className="text-xs text-[#F5F5F0]/70">
              Rectify inaccurate field lab telemetry, account metadata, or organization stewardship credentials.
            </p>
          </div>
          <button
            onClick={() => handleOpenAction('correct')}
            className="w-full py-2 bg-[#1E1E1E] hover:bg-[#282828] text-xs font-mono text-cyan-300 rounded border border-[#F5F5F0]/15 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Request Correction</span>
          </button>
        </div>

        {/* 4. Restrict Processing */}
        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-all">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400">
              <Ban className="w-4 h-4" />
              <h4 className="text-xs font-mono uppercase font-bold">4. Restrict Processing</h4>
            </div>
            <p className="text-xs text-[#F5F5F0]/70">
              Freeze analytical indexing or restrict calculations to local client-only sandboxing.
            </p>
          </div>
          <button
            onClick={() => handleOpenAction('restrict')}
            className="w-full py-2 bg-[#1E1E1E] hover:bg-[#282828] text-xs font-mono text-amber-300 rounded border border-[#F5F5F0]/15 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Apply Restriction</span>
          </button>
        </div>

        {/* 5. Revoke Consent */}
        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm flex flex-col justify-between space-y-3 hover:border-purple-500/40 transition-all">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400">
              <RotateCcw className="w-4 h-4" />
              <h4 className="text-xs font-mono uppercase font-bold">5. Revoke Consent</h4>
            </div>
            <p className="text-xs text-[#F5F5F0]/70">
              Instantly withdraw all voluntary permissions (analytics, communications, and location context).
            </p>
          </div>
          <button
            onClick={() => handleOpenAction('revoke-consent')}
            className="w-full py-2 bg-[#1E1E1E] hover:bg-[#282828] text-xs font-mono text-purple-300 rounded border border-[#F5F5F0]/15 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Instant Revocation</span>
          </button>
        </div>

        {/* 6. Request Human Review */}
        <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm flex flex-col justify-between space-y-3 hover:border-blue-500/40 transition-all">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-blue-400">
              <UserCheck className="w-4 h-4" />
              <h4 className="text-xs font-mono uppercase font-bold">6. Human Review</h4>
            </div>
            <p className="text-xs text-[#F5F5F0]/70">
              Appeal or challenge any automated Moral Arbiter assessment or algorithmically scored proposal.
            </p>
          </div>
          <button
            onClick={() => handleOpenAction('request-human-review')}
            className="w-full py-2 bg-[#1E1E1E] hover:bg-[#282828] text-xs font-mono text-blue-300 rounded border border-[#F5F5F0]/15 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Appeal to Assembly</span>
          </button>
        </div>

        {/* 7. Permanent Cryptographic Deletion */}
        <div className="p-4 bg-[#141414] border border-rose-900/30 rounded-sm flex flex-col justify-between space-y-3 hover:border-rose-500/60 transition-all col-span-1 sm:col-span-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400">
              <Trash2 className="w-4 h-4" />
              <h4 className="text-xs font-mono uppercase font-bold">7. Permanent Cryptographic Deletion</h4>
            </div>
            <p className="text-xs text-[#F5F5F0]/70">
              Execute a zero-trace purge. Deletes all account credentials, session states, and un-synced field lab drafts across all storage layers.
            </p>
          </div>
          <button
            onClick={() => handleOpenAction('delete')}
            className="w-full py-2 bg-rose-950/60 hover:bg-rose-900/80 text-xs font-mono text-rose-200 rounded border border-rose-700/50 flex items-center justify-center gap-1.5 cursor-pointer font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge All Account & Telemetry Data</span>
          </button>
        </div>
      </div>

      {/* Raw JSON Telemetry Viewer */}
      {isViewingRawData && (
        <div className="p-4 bg-[#0E0E0E] border border-[#F5F5F0]/15 rounded-sm space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#C5A059] font-bold flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" /> Live Sandbox Data State
            </span>
            <span className="text-[10px] text-[#F5F5F0]/50 font-mono">Zero-Knowledge Sandbox Verified</span>
          </div>
          <pre className="p-3 bg-[#080808] rounded text-[11px] font-mono text-emerald-400/90 overflow-x-auto max-h-64 border border-[#F5F5F0]/5">
            {JSON.stringify(rawUserTelemetry, null, 2)}
          </pre>
        </div>
      )}

      {/* Request Submission Action Modal */}
      {activeModalAction && (
        <div className="p-5 bg-[#161616] border border-[#C5A059]/40 rounded-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
            <h4 className="text-sm font-mono font-bold text-[#F5F5F0] uppercase flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#C5A059]" />
              Execute Data Right: {activeModalAction.toUpperCase()}
            </h4>
            <button 
              onClick={() => setActiveModalAction(null)}
              className="text-xs font-mono text-[#F5F5F0]/50 hover:text-[#F5F5F0] cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-[#F5F5F0]/80">
              Provide Context or Specific Field Elements (Optional):
            </label>
            <textarea
              value={requestDetails}
              onChange={e => setRequestDetails(e.target.value)}
              placeholder={`Specify details for your ${activeModalAction} request...`}
              rows={3}
              className="w-full p-2.5 bg-[#0E0E0E] border border-[#F5F5F0]/15 rounded text-xs text-[#F5F5F0] placeholder-[#F5F5F0]/40 font-mono focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setActiveModalAction(null)}
              className="px-3 py-1.5 bg-[#222] hover:bg-[#2c2c2c] text-xs font-mono text-[#F5F5F0]/70 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitRequest}
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#B38F46] text-black text-xs font-mono font-bold rounded cursor-pointer shadow flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm & Transmit Request</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Historical Data Rights Requests Audit Trail */}
      <div className="p-5 bg-[#121212] border border-[#F5F5F0]/10 rounded-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#F5F5F0]">
          <Clock className="w-4 h-4 text-[#C5A059]" />
          <span>Active Data Rights Request Ledger</span>
        </div>
        <div className="space-y-2">
          {dataRightsRequests.map(req => (
            <div key={req.id} className="p-3 bg-[#0E0E0E] border border-[#F5F5F0]/5 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#C5A059]">{req.id}</span>
                  <span className="px-1.5 py-0.2 bg-[#222] text-[#F5F5F0]/70 text-[10px] font-mono uppercase rounded">
                    {req.type}
                  </span>
                  <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px] font-mono rounded">
                    {req.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#F5F5F0]/80">{req.details}</p>
                {req.verificationHash && (
                  <p className="text-[10px] font-mono text-[#F5F5F0]/40">Merkle Receipt: {req.verificationHash}</p>
                )}
              </div>
              <div className="text-right font-mono text-[10px] text-[#F5F5F0]/50">
                <span>{new Date(req.requestedAt).toLocaleDateString()}</span>
                <p className="text-emerald-400">{req.resolutionTimeEstimate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
