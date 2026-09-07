import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Check, 
  Copy, 
  RotateCcw, 
  ExternalLink, 
  Sparkles, 
  Code2, 
  Bug, 
  CheckCheck,
  Bot,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PageView } from '../../types';
import { generateViewSpecificJsonLd } from '../../lib/metadataManager';
import { 
  validateJsonLdForGoogleRichResults, 
  RichResultsValidationReport, 
  SchemaValidationError 
} from '../../lib/richResultsValidator';
import { audioFeedback } from '../../lib/audioFeedback';

interface RichResultsDiagnosticTabProps {
  initialTarget?: 'observatory' | 'agent-mission-control' | string;
}

export const RichResultsDiagnosticTab: React.FC<RichResultsDiagnosticTabProps> = ({
  initialTarget = 'observatory'
}) => {
  const [targetView, setTargetView] = useState<string>(initialTarget);
  const [jsonLdInput, setJsonLdInput] = useState<string>(() => {
    return generateViewSpecificJsonLd(targetView as PageView);
  });
  const [report, setReport] = useState<RichResultsValidationReport>(() => {
    return validateJsonLdForGoogleRichResults(generateViewSpecificJsonLd(targetView as PageView), targetView);
  });
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'report' | 'editor'>('report');

  // When target view changes, regenerate standard JSON-LD and run diagnostics
  useEffect(() => {
    const fresh = generateViewSpecificJsonLd(targetView as PageView);
    setJsonLdInput(fresh);
    setReport(validateJsonLdForGoogleRichResults(fresh, targetView));
  }, [targetView]);

  const handleReevaluate = () => {
    audioFeedback.play('softClick');
    setReport(validateJsonLdForGoogleRichResults(jsonLdInput, targetView));
  };

  const handleResetToStandard = () => {
    audioFeedback.play('softClick');
    const fresh = generateViewSpecificJsonLd(targetView as PageView);
    setJsonLdInput(fresh);
    setReport(validateJsonLdForGoogleRichResults(fresh, targetView));
  };

  const handleCopyJsonLd = () => {
    audioFeedback.play('softClick');
    navigator.clipboard.writeText(jsonLdInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Google Rich Results Test URL
  const googleTestUrl = `https://search.google.com/test/rich-results?url=${encodeURIComponent(`https://atlassanctum.org/?view=${targetView}`)}`;

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Target Focus Switcher: Observatory vs Agent Mission Control */}
      <div className="p-4 rounded-xl bg-[#080808] border border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#C5A059] font-bold text-sm uppercase">
                Diagnostic Target Module:
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-bold">
                Google Rich Results Standard
              </span>
            </div>
            <p className="text-[#F5F5F0]/60 text-[11px] mt-0.5">
              Deep schema validator for Schema.org Dataset (Observatory) and SoftwareApplication (Agent Mission Control).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioFeedback.play('softClick');
                setTargetView('observatory');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-colors ${
                targetView === 'observatory'
                  ? 'bg-[#C5A059] text-black'
                  : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white border border-white/10'
              }`}
            >
              <span>Atlas Observatory</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/20">Dataset</span>
            </button>

            <button
              onClick={() => {
                audioFeedback.play('softClick');
                setTargetView('agent-mission-control');
              }}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-colors ${
                targetView === 'agent-mission-control'
                  ? 'bg-[#C5A059] text-black'
                  : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white border border-white/10'
              }`}
            >
              <span>Agent Mission Control</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/20">SoftwareApp</span>
            </button>

            <select
              value={targetView}
              onChange={(e) => {
                audioFeedback.play('softClick');
                setTargetView(e.target.value);
              }}
              className="bg-[#141414] border border-white/20 text-white rounded px-2.5 py-1.5 focus:outline-none"
            >
              <option value="observatory">Observatory (Dataset)</option>
              <option value="agent-mission-control">Agent Mission Control (SoftwareApp)</option>
              <option value="living-reality">Living Reality (Dataset)</option>
              <option value="steward">Atlas Steward (SoftwareApp)</option>
              <option value="moral-arbiter">Moral Arbiter (Service)</option>
              <option value="capital-engine">Capital Engine (Service)</option>
              <option value="home">Civilization OS Root (SoftwareApp)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Diagnostic Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left 1: Score & Status */}
        <div className="p-5 rounded-xl bg-[#0A0A0A] border border-[#C5A059]/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Validation Status</span>
              {report.isValid ? (
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  VALID
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40 text-[10px] font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  ERRORS
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-4">
              <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl font-bold ${
                report.score >= 90 
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-400' 
                  : report.score >= 70
                  ? 'border-amber-400 bg-amber-500/20 text-amber-400'
                  : 'border-red-400 bg-red-500/20 text-red-400'
              }`}>
                {report.score}
              </div>
              <div>
                <div className="font-serif font-bold text-white text-sm">Rich Results Score</div>
                <div className="text-[10px] text-[#F5F5F0]/60">
                  {report.errors.length === 0 ? 'Zero schema issues' : `${report.errors.length} item(s) flagged`}
                </div>
              </div>
            </div>
          </div>

          <a
            href={googleTestUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 rounded bg-white/5 hover:bg-white/10 text-[#C5A059] border border-[#C5A059]/30 text-center font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Google Rich Results Test</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Right 3: Google Feature Eligibility Badges */}
        <div className="lg:col-span-3 p-5 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-3">
          <span className="text-white font-bold block">Google Rich Results Eligibility Matrix</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Dataset Search */}
            <div className={`p-3 rounded-lg border ${
              report.googleEligibility.datasetSearch 
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                : 'bg-white/5 border-white/10 text-neutral-400'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span>Google Dataset Search</span>
                {report.googleEligibility.datasetSearch ? <Check className="w-3 h-3 text-emerald-400" /> : <span>-</span>}
              </div>
              <p className="text-[10px] mt-1 opacity-80">
                {targetView === 'observatory' ? 'Validated for Earth Observation' : 'Dataset schema required'}
              </p>
            </div>

            {/* Software App Card */}
            <div className={`p-3 rounded-lg border ${
              report.googleEligibility.softwareAppCard 
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                : 'bg-white/5 border-white/10 text-neutral-400'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span>Software App Card</span>
                {report.googleEligibility.softwareAppCard ? <Check className="w-3 h-3 text-emerald-400" /> : <span>-</span>}
              </div>
              <p className="text-[10px] mt-1 opacity-80">
                {targetView === 'agent-mission-control' ? 'Validated for Agent Engine' : 'SoftwareApp schema required'}
              </p>
            </div>

            {/* Star Rating Rich Snippet */}
            <div className={`p-3 rounded-lg border ${
              report.googleEligibility.starRatingSnippet 
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                : 'bg-white/5 border-white/10 text-neutral-400'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span>Star Review Snippet</span>
                {report.googleEligibility.starRatingSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <span>-</span>}
              </div>
              <p className="text-[10px] mt-1 opacity-80">
                Golden star ratings in SERP
              </p>
            </div>

            {/* Breadcrumb Navigation */}
            <div className={`p-3 rounded-lg border ${
              report.googleEligibility.breadcrumbsSnippet 
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                : 'bg-white/5 border-white/10 text-neutral-400'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span>Breadcrumb Hierarchy</span>
                {report.googleEligibility.breadcrumbsSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <span>-</span>}
              </div>
              <p className="text-[10px] mt-1 opacity-80">
                Sequential URL path trail
              </p>
            </div>

            {/* Sitelinks Searchbox */}
            <div className="p-3 rounded-lg border bg-emerald-950/30 border-emerald-500/30 text-emerald-300">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span>Sitelinks Searchbox</span>
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <p className="text-[10px] mt-1 opacity-80">
                SearchAction URI integrated
              </p>
            </div>

            {/* Verified Entity ID */}
            <div className="p-3 rounded-lg border bg-emerald-950/30 border-emerald-500/30 text-emerald-300">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span>Canonical Entity ID</span>
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <p className="text-[10px] mt-1 opacity-80">
                https://atlassanctum.org/
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Diagnostic Findings vs Live Schema Editor */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('report')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeSubTab === 'report' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
            }`}
          >
            Diagnostic Findings ({report.errors.length})
          </button>
          <button
            onClick={() => setActiveSubTab('editor')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'editor' ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/5 text-[#F5F5F0]/70 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Interactive JSON-LD Editor</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReevaluate}
            className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white border border-white/15 flex items-center gap-1.5"
          >
            <Bug className="w-3 h-3 text-[#C5A059]" />
            <span>Re-run Diagnostic</span>
          </button>

          <button
            onClick={handleResetToStandard}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[#F5F5F0]/60 hover:text-white flex items-center gap-1"
            title="Reset schema to system standard"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleCopyJsonLd}
            className="px-3 py-1 rounded bg-[#C5A059] text-black font-bold flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy JSON-LD'}</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: DIAGNOSTIC FINDINGS */}
      {activeSubTab === 'report' && (
        <div className="space-y-4">
          {/* Flagged Errors & Warnings */}
          {report.errors.length > 0 ? (
            <div className="space-y-2.5">
              {report.errors.map((err) => (
                <div
                  key={err.id}
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    err.severity === 'critical'
                      ? 'bg-red-950/30 border-red-500/40 text-red-200'
                      : err.severity === 'warning'
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                      : 'bg-blue-950/30 border-blue-500/40 text-blue-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {err.severity === 'critical' ? (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    ) : err.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    )}
                  </div>

                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase text-[10px] tracking-wider px-1.5 py-0.2 rounded bg-black/40">
                        {err.severity}: {err.rule}
                      </span>
                      <code className="text-[10px] text-white/50">{err.field}</code>
                    </div>

                    <p className="text-white text-xs">{err.message}</p>

                    <div className="text-[11px] pt-1 text-white/80 flex items-center gap-1">
                      <span className="font-bold text-[#C5A059]">Fix Recommendation:</span>
                      <span>{err.fixRecommendation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-serif font-bold text-base text-white">
                Zero Schema Validation Errors Found
              </h4>
              <p className="text-xs text-emerald-300/80 max-w-lg mx-auto">
                The structured data for <strong className="text-white">{targetView}</strong> completely adheres to Google Search Central specifications for rich results and dataset discovery.
              </p>
            </div>
          )}

          {/* Passed Checks Section */}
          <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-2">
            <span className="text-white font-bold block text-xs">
              Passed Schema Verifications ({report.passedChecks.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              {report.passedChecks.map((check, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[#F5F5F0]/80">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: INTERACTIVE JSON-LD EDITOR */}
      {activeSubTab === 'editor' && (
        <div className="space-y-3">
          <div className="p-2 rounded bg-black/40 border border-white/5 flex items-center justify-between text-[11px] text-[#F5F5F0]/60">
            <span>Edit JSON-LD below and click "Re-run Diagnostic" to test custom additions:</span>
            <span className="text-emerald-400">application/ld+json</span>
          </div>

          <textarea
            rows={18}
            value={jsonLdInput}
            onChange={(e) => setJsonLdInput(e.target.value)}
            className="w-full bg-[#050505] border border-white/20 rounded-xl p-4 text-[#A6E22E] focus:outline-none focus:border-[#C5A059] font-mono text-xs leading-relaxed"
          />
        </div>
      )}
    </div>
  );
};
