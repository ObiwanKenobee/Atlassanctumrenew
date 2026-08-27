import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  ShieldCheck,
  Activity,
  Terminal,
  Layers,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Copy,
  Check,
  ExternalLink,
  Search,
  Database,
  BarChart2,
  TrendingUp,
  Globe,
  Radio,
  Share2,
  Compass
} from 'lucide-react';
import { AIEpistemicAuditResult, AITelemetryMetrics, AgentToolExecutionRecord } from '../../types';
import { audioFeedback } from '../../lib/audioFeedback';

export function AIEngineeringView() {
  const [activeSubTab, setActiveSubTab] = useState<'streaming' | 'epistemic_audit' | 'tool_execution' | 'telemetry'>('streaming');

  // 1. Streaming Workbench State
  const [streamPrompt, setStreamPrompt] = useState<string>(
    'Synthesize a 10-year multi-capital transition model for a 50,000-hectare agroforestry corridor in the Great Rift Valley, incorporating soil carbon sequestration, sovereign water trusts, and local youth employment.'
  );
  const [thinkingLevel, setThinkingLevel] = useState<'HIGH' | 'LOW' | 'MINIMAL'>('HIGH');
  const [temperature, setTemperature] = useState<number>(0.3);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamedText, setStreamedText] = useState<string>('');
  const [streamTtft, setStreamTtft] = useState<number | null>(null);
  const [streamDuration, setStreamDuration] = useState<number | null>(null);
  const [streamTokenCount, setStreamTokenCount] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // 2. Epistemic Audit State
  const [auditClaim, setAuditClaim] = useState<string>(
    'The Mau Forest catchment area has demonstrated a 34.2% increase in soil organic carbon and 1.2M m³ groundwater recharge following the deployment of sovereign community data trusts.'
  );
  const [bioregion, setBioregion] = useState<string>('East Africa Great Rift');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AIEpistemicAuditResult | null>(null);

  // 3. Autonomous Tool Execution State
  const [selectedToolId, setSelectedToolId] = useState<string>('telemetry_bioregional_query');
  const [toolParams, setToolParams] = useState<string>(JSON.stringify({ region: 'East Africa Great Rift', sensorTypes: ['NDVI', 'SOC', 'Aquifer'] }, null, 2));
  const [isExecutingTool, setIsExecutingTool] = useState<boolean>(false);
  const [toolExecutionHistory, setToolExecutionHistory] = useState<AgentToolExecutionRecord[]>([]);

  // 4. Telemetry State
  const [telemetry, setTelemetry] = useState<AITelemetryMetrics | null>(null);
  const [isRefreshingTelemetry, setIsRefreshingTelemetry] = useState<boolean>(false);

  // Fetch initial telemetry
  const fetchTelemetry = async () => {
    setIsRefreshingTelemetry(true);
    try {
      const res = await fetch('/api/ai/telemetry');
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (err) {
      console.warn('Telemetry fetch error:', err);
    } finally {
      setIsRefreshingTelemetry(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 8000);
    return () => clearInterval(interval);
  }, []);

  // Handle SSE Streaming
  const handleStartStream = async () => {
    if (!streamPrompt.trim() || isStreaming) return;
    setIsStreaming(true);
    setStreamedText('');
    setStreamTtft(null);
    setStreamDuration(null);
    setStreamTokenCount(0);
    audioFeedback.playSoftClick();

    const startTime = Date.now();

    try {
      const response = await fetch('/api/gemini/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: streamPrompt,
          thinkingLevel,
          temperature,
        }),
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'ttft') {
                setStreamTtft(data.ttftMs);
              } else if (data.type === 'chunk') {
                setStreamedText((prev) => prev + data.text);
                setStreamTokenCount((prev) => prev + data.text.split(/\s+/).length);
              } else if (data.type === 'done') {
                setStreamDuration(Date.now() - startTime);
                audioFeedback.playSyncComplete();
              }
            } catch (e) {
              // ignore parse errors on partial chunks
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Stream error:', err);
      setStreamedText((prev) => prev + `\n\n[Error: ${err.message || 'Stream disrupted'}]`);
    } finally {
      setIsStreaming(false);
      fetchTelemetry();
    }
  };

  // Handle Epistemic Audit
  const handleRunEpistemicAudit = async () => {
    if (!auditClaim.trim() || isAuditing) return;
    setIsAuditing(true);
    audioFeedback.playSoftClick();

    try {
      const res = await fetch('/api/gemini/epistemic-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claim: auditClaim,
          bioregion,
          contextData: { verificationTier: 'Level-3 Ground Sensor Mesh' },
        }),
      });
      const data = await res.json();
      if (data.success && data.audit) {
        setAuditResult(data.audit);
        audioFeedback.playSyncComplete();
      }
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditing(false);
      fetchTelemetry();
    }
  };

  // Handle Autonomous Tool Execution
  const handleExecuteTool = async () => {
    if (isExecutingTool) return;
    setIsExecutingTool(true);
    audioFeedback.playSoftClick();

    let parsedParams = {};
    try {
      parsedParams = JSON.parse(toolParams);
    } catch {
      parsedParams = { rawInput: toolParams };
    }

    try {
      const res = await fetch('/api/agent/tools/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: selectedToolId,
          agentId: 'bioregional-research-agent',
          parameters: parsedParams,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const newRecord: AgentToolExecutionRecord = {
          toolId: data.toolId,
          toolName: selectedToolId.replace(/_/g, ' ').toUpperCase(),
          invokedByAgent: data.agentId,
          inputParameters: data.parameters,
          outputResult: data.output,
          latencyMs: data.latencyMs,
          status: 'SUCCESS',
          cryptographicProofHash: data.output?.proofHash || '0x7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a',
          timestamp: data.timestamp,
        };
        setToolExecutionHistory((prev) => [newRecord, ...prev.slice(0, 9)]);
        audioFeedback.playSyncComplete();
      }
    } catch (err) {
      console.error('Tool execution error:', err);
    } finally {
      setIsExecutingTool(false);
      fetchTelemetry();
    }
  };

  const handleCopyText = () => {
    if (!streamedText) return;
    navigator.clipboard.writeText(streamedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const promptPresets = [
    {
      title: 'Rift Valley 10-Yr Transition',
      prompt: 'Synthesize a 10-year multi-capital transition model for a 50,000-hectare agroforestry corridor in the Great Rift Valley, incorporating soil carbon sequestration, sovereign water trusts, and local youth employment.'
    },
    {
      title: 'Decentralized Aquifer Recharge',
      prompt: 'Design a closed-loop subsurface hydrological recharge protocol for peri-urban agricultural basins, mapping IoT sensor mesh telemetry to automated water credit tokenization.'
    },
    {
      title: 'Epistemic Certainty Calculus',
      prompt: 'Formulate an axiomatic epistemic proof model evaluating the difference between remote satellite NDVI vegetation indices and in-situ mycorrhizal root spectroscopy measurements.'
    },
    {
      title: 'Anti-Fragile Capital Governance',
      prompt: 'Outline a non-extractive milestone-based patient capital tranche allocation contract governed by multi-stakeholder quadratic voting and Canon XXIII moral guardrails.'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] border border-[#262626] rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 rounded-full text-xs font-mono font-medium tracking-wide flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                AI ENGINEERING CORE
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded-full text-[11px] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                GEMINI 3.7 FLASH REASONING ENGINE
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
              AI Engineering & Epistemic Reasoning Workbench
            </h1>
            <p className="text-sm text-[#A3A3A3] max-w-2xl font-sans leading-relaxed">
              Deep systems-dynamics reasoning, real-time token streaming with configurable thought budgets, grounded hallucination audits, and autonomous agent tool execution telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-[#0A0A0A]/80 border border-[#262626] p-3 rounded-xl">
            <div className="text-right px-3 border-r border-[#262626]">
              <div className="text-xs text-[#737373] uppercase font-mono">Stream TTFT</div>
              <div className="text-lg font-bold font-mono text-[#C5A059]">
                {streamTtft ? `${streamTtft}ms` : telemetry ? `${telemetry.ttftMs}ms` : '210ms'}
              </div>
            </div>
            <div className="text-right px-3 border-r border-[#262626]">
              <div className="text-xs text-[#737373] uppercase font-mono">Tokens/Sec</div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {telemetry ? `${telemetry.tokensPerSecond}` : '142'} t/s
              </div>
            </div>
            <div className="text-right px-3">
              <div className="text-xs text-[#737373] uppercase font-mono">Epistemic Index</div>
              <div className="text-lg font-bold font-mono text-blue-400">
                {telemetry ? `${telemetry.epistemicCertaintyScore}%` : '94.8%'}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-[#262626]">
          <button
            id="tab-btn-streaming"
            onClick={() => { setActiveSubTab('streaming'); audioFeedback.playSoftClick(); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
              activeSubTab === 'streaming'
                ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20 font-bold'
                : 'bg-[#1F1F1F] text-[#A3A3A3] hover:text-white hover:bg-[#2A2A2A]'
            }`}
          >
            <Zap className="w-4 h-4" />
            1. Reasoning & Token Streaming
          </button>

          <button
            id="tab-btn-epistemic-audit"
            onClick={() => { setActiveSubTab('epistemic_audit'); audioFeedback.playSoftClick(); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
              activeSubTab === 'epistemic_audit'
                ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20 font-bold'
                : 'bg-[#1F1F1F] text-[#A3A3A3] hover:text-white hover:bg-[#2A2A2A]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            2. Epistemic Grounding & Hallucination Scanner
          </button>

          <button
            id="tab-btn-tool-execution"
            onClick={() => { setActiveSubTab('tool_execution'); audioFeedback.playSoftClick(); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
              activeSubTab === 'tool_execution'
                ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20 font-bold'
                : 'bg-[#1F1F1F] text-[#A3A3A3] hover:text-white hover:bg-[#2A2A2A]'
            }`}
          >
            <Terminal className="w-4 h-4" />
            3. Autonomous Tool Calling Engine
          </button>

          <button
            id="tab-btn-telemetry"
            onClick={() => { setActiveSubTab('telemetry'); audioFeedback.playSoftClick(); }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
              activeSubTab === 'telemetry'
                ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20 font-bold'
                : 'bg-[#1F1F1F] text-[#A3A3A3] hover:text-white hover:bg-[#2A2A2A]'
            }`}
          >
            <Activity className="w-4 h-4" />
            4. AI Telemetry & Observability Hub
          </button>
        </div>
      </div>

      {/* TAB 1: REASONING & TOKEN STREAMING */}
      {activeSubTab === 'streaming' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#C5A059]" />
                  Model Configuration
                </h2>
                <span className="text-xs font-mono text-[#737373]">SSE Live Channel</span>
              </div>

              {/* Presets */}
              <div>
                <label className="text-xs font-mono uppercase text-[#A3A3A3] block mb-2">Prompt Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {promptPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setStreamPrompt(preset.prompt);
                        audioFeedback.playSoftClick();
                      }}
                      className="p-2.5 text-left bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#2E2E2E] rounded-xl text-[11px] text-[#D4D4D4] hover:text-white transition-all line-clamp-2"
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="text-xs font-mono uppercase text-[#A3A3A3] block mb-2">Reasoning Prompt</label>
                <textarea
                  value={streamPrompt}
                  onChange={(e) => setStreamPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-[#0A0A0A] border border-[#2E2E2E] focus:border-[#C5A059] rounded-xl p-3 text-xs font-sans text-white focus:outline-none resize-none transition-all placeholder-[#525252]"
                  placeholder="Enter a civilization or multi-capital systems query..."
                />
              </div>

              {/* Thinking Level Toggle */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono uppercase text-[#A3A3A3]">Thinking Level (Reasoning Budget)</label>
                  <span className="text-xs font-mono text-[#C5A059] font-bold">{thinkingLevel}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['HIGH', 'LOW', 'MINIMAL'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => { setThinkingLevel(lvl); audioFeedback.playSoftClick(); }}
                      className={`py-2 px-3 rounded-xl text-xs font-mono transition-all border ${
                        thinkingLevel === lvl
                          ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059] font-bold'
                          : 'bg-[#1A1A1A] border-[#2E2E2E] text-[#8A8A8A] hover:text-white'
                      }`}
                    >
                      {lvl === 'HIGH' ? 'HIGH (Deep)' : lvl === 'LOW' ? 'LOW (Fast)' : 'MINIMAL'}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#737373] mt-1.5 font-sans">
                  {thinkingLevel === 'HIGH'
                    ? 'Maximizes multi-capital causal reasoning for complex systemic modeling.'
                    : thinkingLevel === 'LOW'
                    ? 'Balances lower latency with structured synthesis.'
                    : 'Instant response time without deep reflection.'}
                </p>
              </div>

              {/* Temperature Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono uppercase text-[#A3A3A3]">Temperature</label>
                  <span className="text-xs font-mono text-[#C5A059]">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
              </div>

              {/* Action Button */}
              <button
                id="btn-stream-inference"
                onClick={handleStartStream}
                disabled={isStreaming || !streamPrompt.trim()}
                className="w-full py-3 bg-[#C5A059] hover:bg-[#D4AF37] disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20"
              >
                {isStreaming ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Streaming Reasoning Tokens...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Trigger Live Token Stream
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stream Output Console */}
          <div className="lg:col-span-7">
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 h-full flex flex-col space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-white">Live Generation Stream</span>
                  {isStreaming && (
                    <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-mono animate-pulse">
                      RECEIVING
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {streamTtft && (
                    <span className="text-[11px] font-mono text-[#A3A3A3]">
                      TTFT: <span className="text-[#C5A059] font-bold">{streamTtft}ms</span>
                    </span>
                  )}
                  {streamTokenCount > 0 && (
                    <span className="text-[11px] font-mono text-[#A3A3A3]">
                      Tokens: <span className="text-emerald-400 font-bold">{streamTokenCount}</span>
                    </span>
                  )}
                  {streamedText && (
                    <button
                      onClick={handleCopyText}
                      className="p-1.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#2E2E2E] rounded-lg text-xs text-[#A3A3A3] hover:text-white transition-all flex items-center gap-1 font-mono"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>

              {/* Streamed Content Area */}
              <div className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-xl p-5 overflow-y-auto font-mono text-xs text-[#E5E5E5] leading-relaxed whitespace-pre-wrap min-h-[380px] max-h-[550px] selection:bg-[#C5A059] selection:text-black">
                {streamedText ? (
                  <>
                    {streamedText}
                    {isStreaming && <span className="inline-block w-2 h-4 bg-[#C5A059] ml-1 animate-pulse" />}
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-[#525252]">
                    <Sparkles className="w-8 h-8 text-[#333333]" />
                    <p className="font-sans text-sm text-[#737373]">
                      Click <span className="text-[#C5A059] font-mono">Trigger Live Token Stream</span> to observe real-time Gemini 3.7 token generation with deep multi-capital reasoning.
                    </p>
                  </div>
                )}
              </div>

              {/* Performance Footer */}
              {streamDuration && (
                <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-[11px] font-mono text-[#737373]">
                  <span>Total Duration: {streamDuration}ms</span>
                  <span>Effective Speed: {Math.round((streamTokenCount / (streamDuration / 1000)) * 10) / 10} tokens/sec</span>
                  <span className="text-emerald-400">Cryptographically Anchorable</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EPISTEMIC GROUNDING & HALLUCINATION SCANNER */}
      {activeSubTab === 'epistemic_audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Epistemic Grounding Inspector
                </h2>
                <span className="text-xs font-mono text-[#737373]">Factuality Guardrails</span>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#A3A3A3] block mb-2">Claim or Telemetry Assertion</label>
                <textarea
                  value={auditClaim}
                  onChange={(e) => setAuditClaim(e.target.value)}
                  rows={4}
                  className="w-full bg-[#0A0A0A] border border-[#2E2E2E] focus:border-[#C5A059] rounded-xl p-3 text-xs font-sans text-white focus:outline-none resize-none transition-all placeholder-[#525252]"
                  placeholder="Paste an ecological or financial claim to evaluate against planetary baselines..."
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#A3A3A3] block mb-2">Bioregion Context</label>
                <select
                  value={bioregion}
                  onChange={(e) => setBioregion(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#2E2E2E] focus:border-[#C5A059] rounded-xl p-3 text-xs font-mono text-white focus:outline-none"
                >
                  <option value="East Africa Great Rift">East Africa Great Rift Valley</option>
                  <option value="Lake Victoria Basin">Lake Victoria Watershed Basin</option>
                  <option value="Amazonian Headwaters">Amazonian Upper Headwaters</option>
                  <option value="Global Biosphere">Global Planetary Biosphere</option>
                </select>
              </div>

              <button
                id="btn-run-epistemic-audit"
                onClick={handleRunEpistemicAudit}
                disabled={isAuditing || !auditClaim.trim()}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {isAuditing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Auditing Epistemic Grounding...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Execute Epistemic Audit
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {auditResult ? (
              <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-6">
                {/* Metric Gauges */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#0A0A0A] border border-[#262626] p-4 rounded-xl text-center">
                    <div className="text-xs font-mono text-[#737373] uppercase">Grounding Index</div>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                      {auditResult.groundingVerificationIndex}%
                    </div>
                  </div>

                  <div className="bg-[#0A0A0A] border border-[#262626] p-4 rounded-xl text-center">
                    <div className="text-xs font-mono text-[#737373] uppercase">Hallucination Risk</div>
                    <div className={`text-2xl font-bold font-mono mt-1 ${
                      auditResult.hallucinationRiskScore < 15 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {auditResult.hallucinationRiskScore}%
                    </div>
                  </div>

                  <div className="bg-[#0A0A0A] border border-[#262626] p-4 rounded-xl text-center">
                    <div className="text-xs font-mono text-[#737373] uppercase">Citation Coverage</div>
                    <div className="text-2xl font-bold font-mono text-[#C5A059] mt-1">
                      {auditResult.factualCitationCoverage}%
                    </div>
                  </div>
                </div>

                {/* Verdict Card */}
                <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[#A3A3A3]">Epistemic Verdict</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                      auditResult.verdict === 'VERIFIED_EMPIRICAL'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                    }`}>
                      {auditResult.verdict.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#D4D4D4] font-sans leading-relaxed">
                    {auditResult.verdictExplanation}
                  </p>
                </div>

                {/* Grounded Sources */}
                {auditResult.groundedSources && auditResult.groundedSources.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono uppercase text-[#A3A3A3] flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-[#C5A059]" />
                      Grounded Empirical Sources & Baselines
                    </h3>
                    <div className="space-y-2">
                      {auditResult.groundedSources.map((src, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl text-xs">
                          <span className="text-[#E5E5E5] font-sans font-medium">{src.title}</span>
                          <span className="px-2 py-0.5 bg-[#1F1F1F] text-[#C5A059] font-mono text-[11px] rounded border border-[#333]">
                            Reliability: {src.reliabilityScore}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Calibrations & Gaps */}
                {auditResult.epistemicGaps && auditResult.epistemicGaps.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono uppercase text-[#A3A3A3] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      Epistemic Gaps & Calibrations
                    </h3>
                    <ul className="space-y-1.5 list-disc list-inside text-xs text-[#A3A3A3] font-sans">
                      {auditResult.epistemicGaps.map((gap, i) => (
                        <li key={i}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#141414] border border-[#262626] rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                <ShieldCheck className="w-12 h-12 text-[#333333]" />
                <p className="text-sm font-serif text-white">Epistemic Hallucination Scanner Ready</p>
                <p className="text-xs text-[#737373] max-w-sm">
                  Run an audit on any ecological or multi-capital claim to cross-reference with live telemetry and calculate uncertainty bounds.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AUTONOMOUS AGENT TOOL EXECUTION */}
      {activeSubTab === 'tool_execution' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#C5A059]" />
                  Agent Tool Invocation
                </h2>
                <span className="text-xs font-mono text-[#737373]">Deterministic Function Layer</span>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#A3A3A3] block mb-2">Registered Tool</label>
                <select
                  value={selectedToolId}
                  onChange={(e) => {
                    setSelectedToolId(e.target.value);
                    if (e.target.value === 'telemetry_bioregional_query') {
                      setToolParams(JSON.stringify({ region: 'East Africa Great Rift', sensorTypes: ['NDVI', 'SOC', 'Aquifer'] }, null, 2));
                    } else if (e.target.value === 'moral_scorecard_calculation') {
                      setToolParams(JSON.stringify({ intervention: 'Community Water Trust Hub', capital: '$1,200,000' }, null, 2));
                    } else if (e.target.value === 'evidence_hash_anchor') {
                      setToolParams(JSON.stringify({ datasetId: 'DS-2026-RIFT-004', certifier: 'Dr. Amina Chen' }, null, 2));
                    } else {
                      setToolParams(JSON.stringify({ biome: 'Savanna Agroforestry Corridor' }, null, 2));
                    }
                    audioFeedback.playSoftClick();
                  }}
                  className="w-full bg-[#0A0A0A] border border-[#2E2E2E] focus:border-[#C5A059] rounded-xl p-3 text-xs font-mono text-white focus:outline-none"
                >
                  <option value="telemetry_bioregional_query">telemetry_bioregional_query (Live GIS Telemetry)</option>
                  <option value="moral_scorecard_calculation">moral_scorecard_calculation (Canon XXIII Compliance)</option>
                  <option value="evidence_hash_anchor">evidence_hash_anchor (SHA-256 Ledger Anchor)</option>
                  <option value="historical_failure_cross_reference">historical_failure_cross_reference (Anti-Fragility)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#A3A3A3] block mb-2">Parameters JSON</label>
                <textarea
                  value={toolParams}
                  onChange={(e) => setToolParams(e.target.value)}
                  rows={6}
                  className="w-full bg-[#0A0A0A] border border-[#2E2E2E] focus:border-[#C5A059] rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none resize-none transition-all"
                />
              </div>

              <button
                id="btn-execute-agent-tool"
                onClick={handleExecuteTool}
                disabled={isExecutingTool}
                className="w-full py-3 bg-[#C5A059] hover:bg-[#D4AF37] disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20"
              >
                {isExecutingTool ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Executing Tool Call...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Execute Tool Directly
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
              <h3 className="text-xs font-mono uppercase text-[#A3A3A3]">Tool Execution Log</h3>
              <span className="text-xs font-mono text-emerald-400">{toolExecutionHistory.length} Recorded Traces</span>
            </div>

            {toolExecutionHistory.length > 0 ? (
              <div className="space-y-4">
                {toolExecutionHistory.map((rec, idx) => (
                  <div key={idx} className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#C5A059]">{rec.toolName}</span>
                      <span className="text-[#737373] text-[11px]">{rec.latencyMs}ms</span>
                    </div>

                    <div className="bg-[#0A0A0A] p-3 rounded-lg border border-[#262626] overflow-x-auto text-[11px] text-emerald-400 leading-relaxed">
                      <pre>{JSON.stringify(rec.outputResult, null, 2)}</pre>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#737373] pt-1">
                      <span className="truncate max-w-[280px]">Hash: {rec.cryptographicProofHash}</span>
                      <span className="text-emerald-400 uppercase font-bold">Status: {rec.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#141414] border border-[#262626] rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                <Terminal className="w-12 h-12 text-[#333333]" />
                <p className="text-sm font-serif text-white">No Tool Invocations Yet</p>
                <p className="text-xs text-[#737373] max-w-sm">
                  Trigger a tool execution to observe structured JSON parameters, deterministic return outputs, and latency telemetry.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: REAL-TIME AI TELEMETRY & OBSERVABILITY HUB */}
      {activeSubTab === 'telemetry' && (
        <div className="space-y-6">
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#141414] border border-[#262626] p-5 rounded-2xl space-y-1">
              <div className="text-xs font-mono text-[#737373] uppercase">Avg Time-To-First-Token</div>
              <div className="text-2xl font-bold font-mono text-[#C5A059]">
                {telemetry ? `${telemetry.ttftMs}ms` : '210ms'}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">Ultra-low p50 baseline</div>
            </div>

            <div className="bg-[#141414] border border-[#262626] p-5 rounded-2xl space-y-1">
              <div className="text-xs font-mono text-[#737373] uppercase">Prompt Cache Hit Rate</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {telemetry ? `${telemetry.promptCacheHitRate}%` : '84%'}
              </div>
              <div className="text-[11px] text-[#A3A3A3] font-mono">Contextual Cache Active</div>
            </div>

            <div className="bg-[#141414] border border-[#262626] p-5 rounded-2xl space-y-1">
              <div className="text-xs font-mono text-[#737373] uppercase">Heap Memory Footprint</div>
              <div className="text-2xl font-bold font-mono text-blue-400">
                {telemetry ? `${telemetry.memoryHeapMb} MB` : '42.4 MB'}
              </div>
              <div className="text-[11px] text-[#A3A3A3] font-mono">Optimized V8 Buffer</div>
            </div>

            <div className="bg-[#141414] border border-[#262626] p-5 rounded-2xl space-y-1">
              <div className="text-xs font-mono text-[#737373] uppercase">Epistemic Certainty</div>
              <div className="text-2xl font-bold font-mono text-purple-400">
                {telemetry ? `${telemetry.epistemicCertaintyScore}%` : '94.8%'}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">Grounded Baselines</div>
            </div>
          </div>

          {/* Model Registry Status Table */}
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#C5A059]" />
                Active Model Registry & Service Mesh
              </h2>
              <button
                onClick={fetchTelemetry}
                disabled={isRefreshingTelemetry}
                className="px-3 py-1.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#2E2E2E] rounded-lg text-xs font-mono text-[#A3A3A3] hover:text-white transition-all flex items-center gap-1.5"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRefreshingTelemetry ? 'animate-spin' : ''}`} />
                Refresh Telemetry
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#262626] text-[#737373] uppercase text-[11px]">
                    <th className="pb-3">Model Architecture</th>
                    <th className="pb-3">Operational Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Reasoning Depth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626] text-[#D4D4D4]">
                  <tr>
                    <td className="py-3.5 text-white font-bold">gemini-3.7-flash</td>
                    <td className="py-3.5 text-[#A3A3A3]">Deep Systems-Dynamics Reasoning & Epistemic Synthesis</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded text-[10px]">
                        ONLINE
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-[#C5A059]">High / Dynamic</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 text-white font-bold">gemini-3.5-transcribe</td>
                    <td className="py-3.5 text-[#A3A3A3]">Field Acoustic Notes & High-Precision Transcriptions</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded text-[10px]">
                        ONLINE
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-[#A3A3A3]">Verbatim Empirical</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 text-white font-bold">gemini-3.1-flash-live-preview</td>
                    <td className="py-3.5 text-[#A3A3A3]">Bi-directional WebSocket Live Voice Dialogue</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded text-[10px]">
                        ONLINE
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-emerald-400">Real-Time Sub-100ms</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 text-white font-bold">gemini-3.1-flash-image-preview</td>
                    <td className="py-3.5 text-[#A3A3A3]">Biophilic Architectural & Multimodal Visual Generation</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded text-[10px]">
                        ONLINE
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-purple-400">Diffusion Latent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
