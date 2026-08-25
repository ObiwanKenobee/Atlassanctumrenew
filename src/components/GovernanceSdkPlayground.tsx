import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  RefreshCw,
  Scale,
  Zap,
  Sliders,
  ExternalLink,
  BookOpen,
  Cpu,
  FileCode,
  Download
} from 'lucide-react';
import { PRIORITY_FLOOR_AXIOMS, GOVERNANCE_SDK_ENDPOINTS, PriorityFloorAxiom, SdkEndpointDoc } from '../data/governanceSdkData';
import { audioFeedback } from '../lib/audioFeedback';

export const GovernanceSdkPlayground: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<SdkEndpointDoc>(GOVERNANCE_SDK_ENDPOINTS[1]); // evaluate-compliance
  const [selectedLanguage, setSelectedLanguage] = useState<'typescript' | 'python' | 'curl'>('typescript');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Interactive Evaluation Parameters
  const [evalProjectTitle, setEvalProjectTitle] = useState('Mara Catchment Regenerative Hydro & Biochar Facility');
  const [evalBioregion, setEvalBioregion] = useState('Mara Basin / Rift Valley');
  const [evalCapitalUSD, setEvalCapitalUSD] = useState(1250000);
  const [evalLocalEquityRatio, setEvalLocalEquityRatio] = useState(0.35); // 35% local equity
  const [evalAquiferDrawdown, setEvalAquiferDrawdown] = useState(0.22); // 22% drawdown
  const [evalWageMultiplier, setEvalWageMultiplier] = useState(2.4); // 2.4x living wage
  const [evalRestDays, setEvalRestDays] = useState(4); // 4 days/month sabbath
  const [evalDisplacementRisk, setEvalDisplacementRisk] = useState(false);

  const [isRunningSim, setIsRunningSim] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    audioFeedback.playSubtleClick();
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleRunEvaluation = () => {
    setIsRunningSim(true);
    audioFeedback.playSubtleClick();
    
    setTimeout(() => {
      // Evaluate against axioms
      const violations: string[] = [];
      const warnings: string[] = [];
      let score = 100;

      if (evalDisplacementRisk) {
        violations.push('AXIOM_HUMAN_DIGNITY: Displacement risk identified without FPIC guarantee.');
        score -= 40;
      }
      if (evalWageMultiplier < 2.2) {
        violations.push(`AXIOM_HUMAN_DIGNITY: Wage multiplier (${evalWageMultiplier}x) is below the 2.2x Priority Floor threshold.`);
        score -= 25;
      }
      if (evalAquiferDrawdown > 0.40) {
        violations.push(`AXIOM_BIOPHYSICAL_RESERVE: Aquifer drawdown (${(evalAquiferDrawdown * 100).toFixed(0)}%) exceeds the 40% maximum carrying capacity.`);
        score -= 30;
      } else if (evalAquiferDrawdown > 0.30) {
        warnings.push(`AXIOM_BIOPHYSICAL_RESERVE: Aquifer drawdown (${(evalAquiferDrawdown * 100).toFixed(0)}%) approaches safety threshold. Quarterly IoT audits mandatory.`);
        score -= 5;
      }
      if (evalLocalEquityRatio < 0.25) {
        violations.push(`AXIOM_BIOCULTURAL_SOVEREIGNTY: Local equity dividend (${(evalLocalEquityRatio * 100).toFixed(0)}%) is below the 25% minimum floor.`);
        score -= 20;
      }
      if (evalRestDays < 4) {
        warnings.push(`AXIOM_SABBATH_REST: Monthly rest buffer is only ${evalRestDays} days. Recommended is 4+ days of operational rest.`);
        score -= 8;
      }

      const passed = violations.length === 0;
      const status = passed ? (warnings.length > 0 ? 'APPROVED_WITH_GUARDRAILS' : 'FULL_CONSTITUTIONAL_COMPLIANCE') : 'REJECTED_PRIORITY_FLOOR_VIOLATION';

      const result = {
        status,
        timestamp: new Date().toISOString(),
        projectId: `PRJ-${evalBioregion.slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        complianceScore: Math.max(0, score),
        passed,
        violations,
        warnings,
        guardrails: passed ? [
          'Continuous IoT telemetry sync with Reality Engine required.',
          `Local community equity pool locked at ${(evalLocalEquityRatio * 100).toFixed(0)}% via audited smart contract.`,
          'Mandatory quarterly forensic reviews registered in the Failure Ledger.'
        ] : [],
        evaluatedAxioms: PRIORITY_FLOOR_AXIOMS.map(a => ({
          code: a.code,
          name: a.name,
          status: violations.some(v => v.includes(a.code.split('_')[1])) ? 'VIOLATED' : 'PASSED'
        })),
        cryptographicProof: {
          merkleRoot: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
          auditorWitness: 'node-athi-governance-council-01',
          canonVersion: 'Atlas-Canon-2026.4.1'
        }
      };

      setSimResult(result);
      setIsRunningSim(false);
      if (passed) {
        audioFeedback.playImpactTrigger();
      } else {
        audioFeedback.playTelemetryWarning();
      }
    }, 600);
  };

  const getCodeSnippet = () => {
    if (selectedLanguage === 'typescript') {
      return selectedEndpoint.sampleTypescript;
    }
    if (selectedLanguage === 'python') {
      return selectedEndpoint.samplePython;
    }
    return selectedEndpoint.sampleCurl;
  };

  return (
    <div className="w-full bg-[#0D0D0D] border border-[#F5F5F0]/15 rounded-sm p-6 sm:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#F5F5F0]/10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/40 font-bold flex items-center gap-1.5">
              <Scale className="w-3 h-3 text-[#C5A059]" />
              CONSTITUTIONAL GOVERNANCE SDK & REST APIS
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              v2.5.0 STABLE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#F5F5F0]">
            Atlas Governance SDK & Priority Floor Engine
          </h2>
          <p className="text-xs sm:text-sm text-[#F5F5F0]/65 max-w-3xl font-sans leading-relaxed">
            Integrate constitutional ethics verification and biophysical priority floors into your regenerative apps, DAOs, municipal planning tools, and smart contracts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-center">
          <button
            onClick={() => copyToClipboard('npm install @atlas-sanctum/governance-sdk', 'npm')}
            className="px-3.5 py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-[#F5F5F0]/20 rounded text-xs font-mono text-[#F5F5F0] flex items-center gap-1.5 transition-all"
          >
            <Terminal className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>npm i @atlas-sanctum/governance-sdk</span>
            {copiedKey === 'npm' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#F5F5F0]/40" />}
          </button>
        </div>
      </div>

      {/* Priority Floors Axiom Reference Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#F5F5F0] font-bold">
              Constitutional Priority Floor Axioms (Immutable Constraints)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#F5F5F0]/50">
            6 Enforced Axioms in Active Canon
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {PRIORITY_FLOOR_AXIOMS.map((axiom) => (
            <div 
              key={axiom.id}
              className="p-4 rounded-sm bg-[#121212] border border-[#F5F5F0]/10 hover:border-[#C5A059]/50 transition-all space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1B3022] text-[#C5A059] border border-[#C5A059]/30 font-bold truncate">
                    {axiom.code}
                  </span>
                  <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                    axiom.enforcementAction === 'AUTOMATIC_REJECTION' ? 'bg-rose-950/60 text-rose-300 border-rose-500/40' :
                    axiom.enforcementAction === 'HALT_CAPITAL_DISBURSEMENT' ? 'bg-amber-950/60 text-amber-300 border-amber-500/40' :
                    'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                  }`}>
                    {axiom.enforcementAction.replace(/_/g, ' ')}
                  </span>
                </div>
                <h4 className="text-sm font-serif font-bold text-[#F5F5F0]">
                  {axiom.name}
                </h4>
                <p className="text-xs text-[#F5F5F0]/65 font-sans leading-relaxed">
                  {axiom.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F5F5F0]/10 space-y-1 text-[10px] font-mono text-[#F5F5F0]/70">
                <div>
                  <span className="text-[#C5A059]">Floor: </span>
                  {axiom.minimumThreshold}
                </div>
                <div className="text-[9px] text-[#F5F5F0]/50 italic truncate">
                  Rule: {axiom.programmaticRule}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive API Explorer & Live Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-[#F5F5F0]/10">
        
        {/* Left Column: Endpoints & Interactive Parameter Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Endpoint Selector Tabs */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
              1. Select Governance Endpoint
            </span>
            <div className="space-y-1.5">
              {GOVERNANCE_SDK_ENDPOINTS.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => {
                    setSelectedEndpoint(ep);
                    audioFeedback.playSubtleClick();
                  }}
                  className={`w-full text-left p-2.5 rounded-sm border transition-all flex items-center justify-between ${
                    selectedEndpoint.id === ep.id
                      ? 'bg-[#1B3022] border-[#C5A059] text-[#F5F5F0]'
                      : 'bg-[#141414] border-[#F5F5F0]/10 text-[#F5F5F0]/70 hover:border-[#F5F5F0]/30'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded ${
                        ep.method === 'GET' ? 'bg-blue-950 text-blue-400 border border-blue-500/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {ep.method}
                      </span>
                      <span className="text-xs font-serif font-bold text-[#F5F5F0] truncate">{ep.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#F5F5F0]/50 truncate block mt-0.5">{ep.path}</span>
                  </div>
                  {selectedEndpoint.id === ep.id && <Zap className="w-4 h-4 text-[#C5A059] shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Compliance Simulation Form */}
          <div className="p-4 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Live Parameter Inspector
              </span>
              <span className="text-[9px] font-mono text-emerald-400">Sandbox Mode</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] text-[#F5F5F0]/70 font-mono">Project Name</label>
                <input
                  type="text"
                  value={evalProjectTitle}
                  onChange={(e) => setEvalProjectTitle(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#F5F5F0]/20 rounded px-2.5 py-1.5 text-xs text-[#F5F5F0] focus:border-[#C5A059] focus:outline-none font-mono"
                />
              </div>

              {/* Local Equity Reserve Slider (Axiom 4) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#F5F5F0]/70">Local Equity Reserve (Floor: 25%)</span>
                  <span className={`font-bold ${evalLocalEquityRatio >= 0.25 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {(evalLocalEquityRatio * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.60"
                  step="0.05"
                  value={evalLocalEquityRatio}
                  onChange={(e) => setEvalLocalEquityRatio(parseFloat(e.target.value))}
                  className="w-full accent-[#C5A059] bg-[#0A0A0A]"
                />
              </div>

              {/* Aquifer Drawdown Rate Slider (Axiom 2) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#F5F5F0]/70">Aquifer Drawdown (Ceiling: 40%)</span>
                  <span className={`font-bold ${evalAquiferDrawdown <= 0.40 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {(evalAquiferDrawdown * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.75"
                  step="0.01"
                  value={evalAquiferDrawdown}
                  onChange={(e) => setEvalAquiferDrawdown(parseFloat(e.target.value))}
                  className="w-full accent-[#C5A059] bg-[#0A0A0A]"
                />
              </div>

              {/* Wage Multiplier Slider (Axiom 1) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#F5F5F0]/70">Labor Wage Multiplier (Floor: 2.2x)</span>
                  <span className={`font-bold ${evalWageMultiplier >= 2.2 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {evalWageMultiplier.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="4.0"
                  step="0.1"
                  value={evalWageMultiplier}
                  onChange={(e) => setEvalWageMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-[#C5A059] bg-[#0A0A0A]"
                />
              </div>

              {/* Displacement Risk Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="text-[11px] text-[#F5F5F0]/80 font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unconsented Land Displacement Risk</span>
                </label>
                <input
                  type="checkbox"
                  checked={evalDisplacementRisk}
                  onChange={(e) => setEvalDisplacementRisk(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded"
                />
              </div>

              {/* Run Evaluation Button */}
              <button
                onClick={handleRunEvaluation}
                disabled={isRunningSim}
                className="w-full py-2.5 mt-2 bg-[#1B3022] hover:bg-[#254530] border border-[#C5A059]/60 text-[#F5F5F0] rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {isRunningSim ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
                    <span>Evaluating Against Canon...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Execute SDK Compliance Test</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Code Generator & Live JSON Response (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Code Snippet Box */}
          <div className="p-4 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#8FB8DE]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#F5F5F0] font-bold">
                  Client Code Example
                </span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-[#0A0A0A] p-0.5 rounded border border-[#F5F5F0]/10">
                {(['typescript', 'python', 'curl'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded transition-all ${
                      selectedLanguage === lang
                        ? 'bg-[#1B3022] text-[#C5A059] font-bold border border-[#C5A059]/40'
                        : 'text-[#F5F5F0]/50 hover:text-[#F5F5F0]'
                    }`}
                  >
                    {lang === 'typescript' ? 'TS / Node' : lang === 'python' ? 'Python' : 'cURL'}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <pre className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded text-xs font-mono text-[#F5F5F0]/85 overflow-x-auto max-h-56 leading-relaxed">
                <code>{getCodeSnippet()}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(getCodeSnippet(), 'code')}
                className="absolute top-2 right-2 p-1.5 bg-[#141414]/90 hover:bg-[#222] border border-[#F5F5F0]/20 rounded text-[10px] font-mono text-[#F5F5F0] flex items-center gap-1"
                title="Copy code"
              >
                {copiedKey === 'code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#F5F5F0]/60" />}
                <span>{copiedKey === 'code' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Live Response Payload Visualizer */}
          <div className="p-4 bg-[#141414] border border-[#F5F5F0]/15 rounded-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#F5F5F0]/10 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#F5F5F0] font-bold">
                  Live SDK Response Payload
                </span>
              </div>
              {simResult && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                  simResult.passed ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                }`}>
                  {simResult.status} (Score: {simResult.complianceScore})
                </span>
              )}
            </div>

            {simResult ? (
              <div className="space-y-3">
                {/* Visual Status Alerts */}
                {simResult.violations.length > 0 && (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded text-xs space-y-1">
                    <span className="font-mono text-rose-300 font-bold uppercase flex items-center gap-1.5 text-[10px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Priority Floor Violation(s) Triggered:
                    </span>
                    {simResult.violations.map((v: string, idx: number) => (
                      <p key={idx} className="text-[11px] text-rose-200/90 font-mono">• {v}</p>
                    ))}
                  </div>
                )}

                {simResult.warnings.length > 0 && (
                  <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded text-xs space-y-1">
                    <span className="font-mono text-amber-300 font-bold uppercase flex items-center gap-1.5 text-[10px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Constitutional Guardrail Warnings:
                    </span>
                    {simResult.warnings.map((w: string, idx: number) => (
                      <p key={idx} className="text-[11px] text-amber-200/90 font-mono">• {w}</p>
                    ))}
                  </div>
                )}

                {/* JSON Output */}
                <div className="relative">
                  <pre className="p-3 bg-[#080808] border border-[#F5F5F0]/10 rounded text-xs font-mono text-emerald-400 overflow-x-auto max-h-56 leading-relaxed">
                    <code>{JSON.stringify(simResult, null, 2)}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(simResult, null, 2), 'json')}
                    className="absolute top-2 right-2 p-1.5 bg-[#141414]/90 hover:bg-[#222] border border-[#F5F5F0]/20 rounded text-[10px] font-mono text-[#F5F5F0] flex items-center gap-1"
                  >
                    {copiedKey === 'json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#F5F5F0]/60" />}
                    <span>{copiedKey === 'json' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-[#080808] border border-dashed border-[#F5F5F0]/15 rounded text-center space-y-2">
                <Cpu className="w-6 h-6 text-[#C5A059] mx-auto opacity-70" />
                <p className="text-xs text-[#F5F5F0]/60 font-mono">
                  Click "Execute SDK Compliance Test" to run the live verification engine against the selected Priority Floor rules.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
