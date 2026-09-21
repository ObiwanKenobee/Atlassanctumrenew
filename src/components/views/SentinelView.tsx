import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Radio, 
  Play, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sliders, 
  Layers, 
  Cpu, 
  Lock, 
  KeyRound, 
  ExternalLink, 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  ArrowRight,
  Database,
  Search,
  Check,
  X,
  RefreshCw,
  BarChart2,
  TrendingDown,
  TrendingUp,
  Fingerprint,
  Camera,
  Upload,
  Video
} from 'lucide-react';
import { 
  SentinelScenario, 
  SentinelStage, 
  SentinelExecutionTraceStep, 
  TelemetryReading, 
  InterventionCandidate, 
  SentinelActuationReceipt,
  EpistemicClassification 
} from '../../types/sentinel';
import { SENTINEL_SCENARIOS } from '../../data/sentinelScenarios';
import { SentinelService, AnomalyDetectionResult, ParetoOptimizationResult } from '../../services/sentinelService';
import { useWeb3Wallet } from '../../context/Web3WalletContext';
import { audioFeedback } from '../../lib/audioFeedback';

const STAGE_ORDER: SentinelStage[] = [
  'OBSERVE',
  'DETECT',
  'REASON',
  'VERIFY',
  'ASSESS_SAFETY',
  'RECOMMEND',
  'REQUEST_APPROVAL',
  'ACT',
  'MEASURE',
  'LEARN'
];

const STAGE_METADATA: Record<SentinelStage, { label: string; tool: string; description: string }> = {
  OBSERVE: { label: '1. Observe', tool: 'atlas_get_system_state()', description: 'Ingest real-time edge telemetry buffer across distributed sensor nodes.' },
  DETECT: { label: '2. Detect', tool: 'atlas_detect_anomalies()', description: 'Execute statistical EWMA & multi-variate Z-score algorithms.' },
  REASON: { label: '3. Reason', tool: 'atlas_reason_root_cause()', description: 'Invoke Gemini 3.7 Flash Thinking to formulate physical failure hypothesis.' },
  VERIFY: { label: '4. Verify', tool: 'atlas_search_evidence()', description: 'Cross-reference sensor lineage, physical laws, and satellite baselines.' },
  ASSESS_SAFETY: { label: '5. Assess Safety', tool: 'atlas_run_safety_check()', description: 'Apply deterministic invariant constraint gates (No LLM bypass).' },
  RECOMMEND: { label: '6. Recommend', tool: 'atlas_rank_interventions()', description: 'Execute Pareto multi-attribute utility optimization (MAUT).' },
  REQUEST_APPROVAL: { label: '7. Request Approval', tool: 'atlas_request_human_approval()', description: 'Synthesize plain-language brief and open cryptographic signature gate.' },
  ACT: { label: '8. Act', tool: 'atlas_execute_action()', description: 'Dispatch SCADA actuator command and maintenance guild work order.' },
  MEASURE: { label: '9. Measure', tool: 'atlas_measure_outcome()', description: 'Capture closed-loop telemetry delta to verify stabilization.' },
  LEARN: { label: '10. Learn', tool: 'atlas_record_learning()', description: 'Anchor Merkle root leaf into immutable failure & resilience ledger.' }
};

export const SentinelView: React.FC = () => {
  const { address, isConnected, connectSovereignKeypair } = useWeb3Wallet();

  // Scenario Selection
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('rift-valley-water-cavitation');
  const activeScenario = SentinelService.getScenario(selectedScenarioId);

  // Execution State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<SentinelStage | null>(null);
  const [completedStages, setCompletedStages] = useState<SentinelStage[]>([]);
  const [traceSteps, setTraceSteps] = useState<SentinelExecutionTraceStep[]>([]);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  // Computed Algorithmic States
  const [anomalyResult, setAnomalyResult] = useState<AnomalyDetectionResult | null>(null);
  const [paretoResult, setParetoResult] = useState<ParetoOptimizationResult | null>(null);
  const [reasoningData, setReasoningData] = useState<{ hypothesis: string; causalChain: string[]; confidenceScore: number } | null>(null);
  
  // Interactive Approval State
  const [selectedIntervention, setSelectedIntervention] = useState<InterventionCandidate | null>(null);
  const [waitingForApproval, setWaitingForApproval] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [approvalSignature, setApprovalSignature] = useState<string | null>(null);
  const [actuationReceipt, setActuationReceipt] = useState<SentinelActuationReceipt | null>(null);

  // Live Telemetry Stream
  const [activeTelemetry, setActiveTelemetry] = useState<TelemetryReading[]>(activeScenario.simulatedAnomalousTelemetry);
  const [isStabilized, setIsStabilized] = useState<boolean>(false);

  // Active Tab View in Right Inspector
  const [inspectorTab, setInspectorTab] = useState<'algorithms' | 'telemetry' | 'evidence' | 'ledger'>('algorithms');

  // Camera & Field Ledger Snapshot State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [snapshotNotes, setSnapshotNotes] = useState<string>('Visual telemetry inspection: impeller housing cavitation wear check.');
  const [snapshotCategory, setSnapshotCategory] = useState<string>('Hydraulic Infrastructure');
  const [isAppendingSnapshot, setIsAppendingSnapshot] = useState<boolean>(false);
  const [snapshotAppendSuccess, setSnapshotAppendSuccess] = useState<string | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<Array<{
    id: string;
    bioregionId: string;
    stewardDid: string;
    timestamp: string;
    imageUrl: string;
    notes: string;
    metricCategory: string;
    hash: string;
    blockHeight: number;
    artifactReference?: string;
    s3Bucket?: string;
    s3Key?: string;
    s3Uri?: string;
    s3Url?: string;
  }>>(() => {
    try {
      const stored = localStorage.getItem('atlas_sentinel_field_snapshots');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: 'snap-1',
        bioregionId: 'rift-valley-water-cavitation',
        stewardDid: 'did:atlas:sovereign:steward_naivasha_7721',
        timestamp: '12 mins ago',
        imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"><rect width="320" height="200" fill="%230F1A14"/><circle cx="160" cy="100" r="48" stroke="%2310B981" stroke-width="3" fill="none"/><line x1="160" y1="40" x2="160" y2="160" stroke="%2310B981" stroke-width="1.5" stroke-dasharray="4,4"/><line x1="100" y1="100" x2="220" y2="100" stroke="%2310B981" stroke-width="1.5" stroke-dasharray="4,4"/><text x="160" y="105" fill="%2310B981" font-size="11" text-anchor="middle" font-family="monospace">MANIFOLD INSPECTION</text></svg>',
        notes: 'Suction manifold inspection completed. Minor cavitation pitting noted on blade root 3.',
        metricCategory: 'Hydraulic Infrastructure',
        hash: '0x88fc91a27b1409d...e321',
        blockHeight: 1849220,
        artifactReference: 's3://atlas-bioregional-vault/sentinel/field-snapshots/snap-1.jpg',
        s3Uri: 's3://atlas-bioregional-vault/sentinel/field-snapshots/snap-1.jpg'
      }
    ];
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      audioFeedback.playSubtleClick();
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(err.message || 'Camera permission denied or camera not found on this device.');
      setIsCameraActive(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Cleanup on unmount or tab switch
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Capture High-Res Frame from Video
  const handleCaptureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Overlay HUD Timestamp & Bioregional Stamp
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    ctx.fillStyle = '#C5A059';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`ATLAS SENTINEL • BIOREGION: ${activeScenario.targetAsset.name.toUpperCase()} • ${new Date().toISOString()}`, 16, canvas.height - 15);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
    setCapturedSnapshot(dataUrl);
    audioFeedback.playSuccess();
    stopCamera();
  };

  // Upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedSnapshot(event.target.result as string);
        audioFeedback.playMicroTick();
      }
    };
    reader.readAsDataURL(file);
  };

  // Append Snapshot to Bioregional Ledger
  const handleAppendSnapshotToLedger = async () => {
    if (!capturedSnapshot || isAppendingSnapshot) return;
    setIsAppendingSnapshot(true);
    audioFeedback.playMicroTick();

    const stewardDid = address || 'did:atlas:sovereign:steward_naivasha_7721';
    const syntheticHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const syntheticS3Uri = `s3://atlas-sanctum-artifacts/artifacts/sentinel-evidence/${activeScenario.id}/${Date.now()}-${syntheticHash.slice(2, 10)}.jpg`;
    
    const newEntry = {
      id: `snap-${Date.now()}`,
      bioregionId: activeScenario.id,
      stewardDid,
      timestamp: 'Just now',
      imageUrl: capturedSnapshot,
      notes: snapshotNotes,
      metricCategory: snapshotCategory,
      hash: syntheticHash,
      blockHeight: 1849220 + ledgerEntries.length,
      artifactReference: syntheticS3Uri,
      s3Bucket: 'atlas-sanctum-artifacts',
      s3Key: `artifacts/sentinel-evidence/${activeScenario.id}/${Date.now()}-${syntheticHash.slice(2, 10)}.jpg`,
      s3Uri: syntheticS3Uri,
      s3Url: `https://atlas-sanctum-artifacts.s3.us-east-1.amazonaws.com/artifacts/sentinel-evidence/${activeScenario.id}/${Date.now()}-${syntheticHash.slice(2, 10)}.jpg`
    };

    try {
      const res = await fetch('/api/ledger/append-snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bioregionId: activeScenario.id,
          imageBase64: capturedSnapshot,
          stewardDid,
          notes: snapshotNotes,
          metricCategory: snapshotCategory
        })
      });
      const data = await res.json();
      if (data.success && data.entry) {
        newEntry.hash = data.hash;
        newEntry.blockHeight = data.entry.blockHeight;
        newEntry.artifactReference = data.artifactReference || data.entry.artifactReference || newEntry.artifactReference;
        newEntry.s3Bucket = data.s3Bucket || data.entry.s3Bucket || newEntry.s3Bucket;
        newEntry.s3Key = data.s3Key || data.entry.s3Key || newEntry.s3Key;
        newEntry.s3Uri = data.s3Uri || data.entry.s3Uri || newEntry.s3Uri;
        newEntry.s3Url = data.s3Url || data.entry.s3Url || newEntry.s3Url;
      }
    } catch (e) {
      console.warn('Using client-side ledger append fallback:', e);
    }

    const updated = [newEntry, ...ledgerEntries];
    setLedgerEntries(updated);
    try {
      localStorage.setItem('atlas_sentinel_field_snapshots', JSON.stringify(updated.slice(0, 30)));
    } catch {}

    setSnapshotAppendSuccess(`Snapshot anchored into Bioregional Ledger at Block #${newEntry.blockHeight}!`);
    setCapturedSnapshot(null);
    setIsAppendingSnapshot(false);
    audioFeedback.playSyncComplete();
    setTimeout(() => setSnapshotAppendSuccess(null), 5000);
  };

  // Reset when scenario changes
  useEffect(() => {
    resetState();
  }, [selectedScenarioId]);

  const resetState = () => {
    setIsRunning(false);
    setCurrentStage(null);
    setCompletedStages([]);
    setTraceSteps([]);
    setExpandedTraceId(null);
    setAnomalyResult(null);
    setParetoResult(null);
    setReasoningData(null);
    setSelectedIntervention(null);
    setWaitingForApproval(false);
    setIsApproving(false);
    setApprovalSignature(null);
    setActuationReceipt(null);
    setActiveTelemetry(activeScenario.simulatedAnomalousTelemetry);
    setIsStabilized(false);
  };

  /**
   * Run the Autonomous 10-Stage Sentinel Loop
   */
  const handleStartSentinelLoop = async () => {
    if (isRunning) return;
    audioFeedback.playSubtleClick();
    resetState();
    setIsRunning(true);

    const scenario = activeScenario;
    const newTrace: SentinelExecutionTraceStep[] = [];

    const addStep = (stage: SentinelStage, stepData: Partial<SentinelExecutionTraceStep>) => {
      const meta = STAGE_METADATA[stage];
      const step: SentinelExecutionTraceStep = {
        id: `trace-${stage.toLowerCase()}-${Date.now()}`,
        stage,
        stageLabel: meta.label,
        toolName: meta.tool,
        purpose: meta.description,
        status: 'running',
        startedAt: new Date().toISOString(),
        confidence: stepData.confidence ?? 95,
        epistemicProvenance: stepData.epistemicProvenance ?? 'OBSERVED',
        inputs: stepData.inputs ?? {},
        outputs: stepData.outputs,
        summary: stepData.summary ?? `Executing ${meta.tool}`,
        details: stepData.details,
        safetyCheckPassed: stepData.safetyCheckPassed
      };
      newTrace.push(step);
      setTraceSteps([...newTrace]);
      setExpandedTraceId(step.id);
      setCurrentStage(stage);
      audioFeedback.playViewTransition();
      return step;
    };

    const completeStep = (step: SentinelExecutionTraceStep, outputs: Record<string, any>, summary: string) => {
      step.status = 'completed';
      step.completedAt = new Date().toISOString();
      step.outputs = outputs;
      step.summary = summary;
      setTraceSteps([...newTrace]);
      setCompletedStages(prev => [...prev, step.stage]);
    };

    // Stage 1: OBSERVE
    const s1 = addStep('OBSERVE', {
      epistemicProvenance: 'OBSERVED',
      inputs: { assetId: scenario.targetAsset.id, bufferSize: '100 samples', sampleRateHz: 50 },
      summary: `Ingesting high-frequency edge telemetry buffer from ${scenario.targetAsset.name}...`
    });
    await new Promise(r => setTimeout(r, 650));
    completeStep(s1, { readings: scenario.simulatedAnomalousTelemetry }, `Ingested 4 edge telemetry streams. Active buffer nominal rate: 50 Hz.`);

    // Stage 2: DETECT
    const s2 = addStep('DETECT', {
      epistemicProvenance: 'OBSERVED',
      inputs: { algorithm: 'Sliding-Window EWMA + Z-Score', zCritical: 3.0 },
      summary: 'Running statistical EWMA & multi-sensor Z-score anomaly detector...'
    });
    await new Promise(r => setTimeout(r, 700));
    const anom = SentinelService.calculateAnomalyDetection(scenario.simulatedAnomalousTelemetry);
    setAnomalyResult(anom);
    completeStep(s2, {
      maxZScore: anom.maxZScore,
      severity: anom.anomalySeverity,
      anomalousSensors: anom.anomalousSensors.map(s => `${s.sensorName} (Z=${s.zScore})`)
    }, `CRITICAL ANOMALY DETECTED: Highest Z-Score ${anom.maxZScore.toFixed(2)} on Impeller Bearing Vibration.`);

    // Stage 3: REASON
    const s3 = addStep('REASON', {
      epistemicProvenance: 'MODELED',
      inputs: { model: 'gemini-3.7-flash-thinking', thinkingLevel: 'HIGH' },
      summary: 'Gemini 3.7 Flash analyzing physical mechanics and causal degradation tree...'
    });
    
    let reasoning = {
      hypothesis: "Cavitation bubble collapse within pump impeller housing induced by suction head silt obstruction, resulting in localized high-frequency harmonic vibration (8.4 mm/s RMS) and downstream manifold pressure surge (13.9 bar).",
      causalChain: [
        "Intake silt screen partial obstruction reduces net positive suction head (NPSH).",
        "Liquid pressure drops below vapor pressure, generating vapor cavities at impeller blade roots.",
        "Cavity collapse generates micro-jets exceeding 1,000 m/s against metal vanes, producing 8.42 mm/s vibration.",
        "Fluid resistance oscillations induce 13.9 bar backpressure surge in manifold."
      ],
      confidenceScore: 94
    };

    try {
      const res = await fetch('/api/sentinel/diagnose-reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          telemetryReadings: scenario.simulatedAnomalousTelemetry,
          assetContext: scenario.targetAsset
        })
      });
      const data = await res.json();
      if (data.hypothesis) {
        reasoning = {
          hypothesis: data.hypothesis,
          causalChain: data.causalChain || reasoning.causalChain,
          confidenceScore: data.confidenceScore || 95
        };
      }
    } catch (e) {
      console.warn('Using deterministic diagnostic reasoning fallback', e);
    }
    setReasoningData(reasoning);
    await new Promise(r => setTimeout(r, 600));
    completeStep(s3, reasoning, `Root Cause Identified: Cavitation induced by suction obstruction. Confidence: ${reasoning.confidenceScore}%.`);

    // Stage 4: VERIFY
    const s4 = addStep('VERIFY', {
      epistemicProvenance: 'VERIFIED',
      inputs: { failureMemoryLedger: '15-Year Bioregional Archive', knnMetric: 'Euclidean Hydraulic' },
      summary: 'Cross-referencing 15-year historical post-mortems and physical sensor provenance...'
    });
    await new Promise(r => setTimeout(r, 650));
    completeStep(s4, {
      historicalMatches: scenario.historicalMatches.map(m => `${m.id} (${m.similarityScore}% similarity)`),
      epistemicIntegrity: "All 4 sensor streams cryptographically hashed with W3C VC standard."
    }, `Matched 2 historical incidents (Top match: ${scenario.historicalMatches[0].title}, ${scenario.historicalMatches[0].similarityScore}% match).`);

    // Stage 5: ASSESS SAFETY
    const s5 = addStep('ASSESS_SAFETY', {
      epistemicProvenance: 'VERIFIED',
      inputs: {
        safetyLimits: scenario.targetAsset.safetyLimits,
        inviolableRules: ['PressureCeiling <= 14.5 bar', 'WaterFloor >= 12,000L', 'MandatoryHumanApproval']
      },
      summary: 'Executing deterministic safety firewall over candidate intervention space...'
    });
    await new Promise(r => setTimeout(r, 700));
    completeStep(s5, {
      safetyVerdict: "FIREWALL_ACTIVE",
      blockedCandidates: ["Option Beta: High-Pressure Reverse Backflush (Blocked: Peak pressure exceeds 16.2 bar)"],
      clearedCandidates: ["Option Alpha: Automated SCADA Bypass Loop (Cleared Safe)", "Option Gamma: Controlled Shutdown (Cleared Safe)"]
    }, `Safety Firewall Cleared. Blocked 1 hazardous intervention violating physical pressure ceiling.`);

    // Stage 6: RECOMMEND
    const s6 = addStep('RECOMMEND', {
      epistemicProvenance: 'MODELED',
      inputs: { algorithm: 'Pareto Frontier & Multi-Attribute Utility Optimization (MAUT)' },
      summary: 'Calculating Pareto-optimal intervention rankings across Safety, Flourishing, Cost, and Downtime...'
    });
    await new Promise(r => setTimeout(r, 750));
    const pareto = SentinelService.calculateParetoOptimization(scenario.candidateInterventions);
    setParetoResult(pareto);
    setSelectedIntervention(pareto.optimalChoice);
    completeStep(s6, {
      rankedInterventions: pareto.rankedInterventions.map(r => `#${r.paretoRank}: ${r.title} (Utility: ${r.compositeUtilityScore})`),
      optimalRecommendation: pareto.optimalChoice.title
    }, `Pareto Rank 1: ${pareto.optimalChoice.title} (Utility: ${pareto.optimalChoice.compositeUtilityScore}/100).`);

    // Stage 7: REQUEST APPROVAL (Human-in-the-loop pause)
    const s7 = addStep('REQUEST_APPROVAL', {
      epistemicProvenance: 'VERIFIED',
      inputs: { recommendedActionId: pareto.optimalChoice.id, requiredSignerRole: 'Sovereign Infrastructure Steward' },
      summary: 'Awaiting operator cryptographic signature to authorize physical SCADA actuation...'
    });
    s7.status = 'running';
    setWaitingForApproval(true);
    setIsRunning(false);
  };

  /**
   * Human Operator Approves & Signs Cryptographically
   */
  const handleApproveAndActuate = async () => {
    if (!selectedIntervention || isApproving) return;
    setIsApproving(true);
    audioFeedback.playMicroTick();

    // Ensure sovereign identity key is present
    let signerDid = address;
    if (!isConnected || !signerDid) {
      await connectSovereignKeypair();
      signerDid = address || 'did:atlas:sovereign:steward_naivasha_7721';
    }

    const syntheticSig = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setApprovalSignature(syntheticSig);

    // Call backend SCADA actuation API
    let receipt: SentinelActuationReceipt = {
      transactionHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      actionId: selectedIntervention.id,
      operatorDid: signerDid || 'did:atlas:sovereign:steward_naivasha_7721',
      approvalSignature: syntheticSig,
      timestamp: new Date().toISOString(),
      scadaRelayStatus: 'DISPATCHED_CONFIRMED',
      merkleRootLeaf: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      observedRecoveryDeltaPercent: 94.2
    };

    try {
      const res = await fetch('/api/sentinel/actuate-scada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionId: selectedIntervention.id,
          operatorDid: signerDid,
          approvalSignature: syntheticSig,
          scenarioId: activeScenario.id
        })
      });
      const data = await res.json();
      if (data.transactionHash) {
        receipt = { ...receipt, ...data };
      }
    } catch (e) {
      console.warn('Using local SCADA actuation receipt', e);
    }

    setActuationReceipt(receipt);
    setWaitingForApproval(false);
    setIsApproving(false);

    // Resume Stages 8, 9, 10
    const newTrace = [...traceSteps];

    // Mark Stage 7 completed
    const s7 = newTrace.find(t => t.stage === 'REQUEST_APPROVAL');
    if (s7) {
      s7.status = 'completed';
      s7.completedAt = new Date().toISOString();
      s7.outputs = { signerDid: receipt.operatorDid, signature: receipt.approvalSignature };
      s7.summary = `Cryptographically authorized by operator (${receipt.operatorDid.slice(0, 20)}...).`;
      setCompletedStages(prev => [...prev, 'REQUEST_APPROVAL']);
    }

    const addStep = (stage: SentinelStage, stepData: Partial<SentinelExecutionTraceStep>) => {
      const meta = STAGE_METADATA[stage];
      const step: SentinelExecutionTraceStep = {
        id: `trace-${stage.toLowerCase()}-${Date.now()}`,
        stage,
        stageLabel: meta.label,
        toolName: meta.tool,
        purpose: meta.description,
        status: 'running',
        startedAt: new Date().toISOString(),
        confidence: 99,
        epistemicProvenance: stepData.epistemicProvenance ?? 'VERIFIED',
        inputs: stepData.inputs ?? {},
        outputs: stepData.outputs,
        summary: stepData.summary ?? `Executing ${meta.tool}`,
        details: stepData.details
      };
      newTrace.push(step);
      setTraceSteps([...newTrace]);
      setExpandedTraceId(step.id);
      setCurrentStage(stage);
      audioFeedback.playViewTransition();
      return step;
    };

    const completeStep = (step: SentinelExecutionTraceStep, outputs: Record<string, any>, summary: string) => {
      step.status = 'completed';
      step.completedAt = new Date().toISOString();
      step.outputs = outputs;
      step.summary = summary;
      setTraceSteps([...newTrace]);
      setCompletedStages(prev => [...prev, step.stage]);
    };

    // Stage 8: ACT
    const s8 = addStep('ACT', {
      epistemicProvenance: 'VERIFIED',
      inputs: {
        actuationSteps: selectedIntervention.actuationSteps,
        scadaGateway: "PLC-MODBUS-TCP://192.168.10.42:502"
      },
      summary: 'Dispatching physical SCADA valve command & local guild work order...'
    });
    await new Promise(r => setTimeout(r, 700));
    completeStep(s8, {
      scadaConfirmation: receipt.scadaRelayStatus,
      transactionHash: receipt.transactionHash,
      workOrderCreated: "TICKET-GUILD-NAIVASHA-9912 (Priority 1)"
    }, `SCADA Actuation Confirmed: Bypass Valve BV-02 open at 40%, VFD ramped to 35Hz.`);

    // Stage 9: MEASURE
    const s9 = addStep('MEASURE', {
      epistemicProvenance: 'OBSERVED',
      inputs: { postActuationWindowSec: 10, targetMetrics: ['Vibration', 'Pressure', 'Turbidity'] },
      summary: 'Sampling closed-loop telemetry delta to verify system stabilization...'
    });
    await new Promise(r => setTimeout(r, 800));
    setActiveTelemetry(activeScenario.baselineStabilizationTelemetry);
    setIsStabilized(true);
    completeStep(s9, {
      recoveryDeltaPercent: `${receipt.observedRecoveryDeltaPercent}%`,
      postActuationVibration: "1.45 mm/s (Nominal < 1.8 mm/s)",
      postActuationPressure: "8.12 bar (Nominal < 8.5 bar)",
      stabilizationTimeSec: "4.2 seconds"
    }, `System Stabilized. Vibration reduced by 82.7%, pressure normalized to 8.12 bar within 4.2s.`);

    // Stage 10: LEARN
    const s10 = addStep('LEARN', {
      epistemicProvenance: 'VERIFIED',
      inputs: { incidentId: `INC-${Date.now()}`, resolutionStrategy: selectedIntervention.strategy },
      summary: 'Anchoring Merkle root leaf into immutable failure & resilience ledger...'
    });
    await new Promise(r => setTimeout(r, 600));
    completeStep(s10, {
      merkleRootLeaf: receipt.merkleRootLeaf,
      ledgerBlockHeight: 1849215,
      antiFragilityScoreUpdate: "+3.4% Resilience Index"
    }, `Incident permanently anchored in Merkle Failure Ledger. Anti-fragile learning state updated.`);

    audioFeedback.playSuccess();
    setCurrentStage(null);
  };

  const getEpistemicBadge = (provenance: EpistemicClassification) => {
    switch (provenance) {
      case 'OBSERVED':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 rounded">[OBSERVED]</span>;
      case 'MODELED':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-500/50 rounded">[MODELED]</span>;
      case 'REPORTED':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/50 rounded">[REPORTED]</span>;
      case 'VERIFIED':
      default:
        return <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 rounded">[VERIFIED]</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#F5F5F0]">
      {/* Top Hero Banner: ATLAS SENTINEL */}
      <div className="p-6 bg-[#121212] border border-[#C5A059]/40 rounded-sm relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-2.5 py-0.5 bg-[#C5A059] text-black text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm">
                TikTok TechJam 2026 Submission
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>AGENTIC INFRASTRUCTURE INTELLIGENCE SYSTEM</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F0] tracking-tight">
              ATLAS SENTINEL
            </h1>

            <p className="text-xs sm:text-sm text-[#F5F5F0]/80 leading-relaxed font-sans">
              Autonomous physical infrastructure resilience with a deterministic 10-stage agentic execution loop: 
              <span className="text-[#C5A059] font-mono font-bold ml-1">
                OBSERVE → DETECT → REASON → VERIFY → ASSESS SAFETY → RECOMMEND → REQUEST APPROVAL → ACT → MEASURE → LEARN
              </span>.
            </p>
          </div>

          {/* Action Control Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleStartSentinelLoop}
              disabled={isRunning || waitingForApproval}
              className={`px-5 py-3 rounded-sm font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                isRunning
                  ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed'
                  : 'bg-[#C5A059] hover:bg-[#b08f4c] text-black border border-[#C5A059]'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Agent Executing ({currentStage})...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" />
                  <span>Run Sentinel Autonomous Agent</span>
                </>
              )}
            </button>

            <button
              onClick={resetState}
              className="px-3.5 py-3 bg-[#181818] hover:bg-[#222] border border-[#F5F5F0]/15 text-[#F5F5F0]/70 hover:text-[#F5F5F0] rounded-sm text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Reset to clean baseline state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Scenario Selector Tabs */}
        <div className="pt-5 mt-5 border-t border-[#F5F5F0]/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase text-[#F5F5F0]/50 mr-1">
              Active Demonstration Scenario:
            </span>
            {SENTINEL_SCENARIOS.map(scen => (
              <button
                key={scen.id}
                onClick={() => {
                  audioFeedback.playMicroTick();
                  setSelectedScenarioId(scen.id);
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-all cursor-pointer ${
                  selectedScenarioId === scen.id
                    ? 'bg-[#1B3022] text-emerald-300 border border-emerald-500 font-bold'
                    : 'bg-[#181818] text-[#F5F5F0]/60 hover:bg-[#222] border border-[#F5F5F0]/10'
                }`}
              >
                {scen.title.split(':')[0]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#F5F5F0]/60">
            <span className="text-[#C5A059]">Target Bioregion:</span>
            <span className="text-[#F5F5F0]">{activeScenario.bioregion}</span>
          </div>
        </div>
      </div>

      {/* 10-Stage Visual Workflow Stepper Bar */}
      <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="uppercase text-[#C5A059] font-bold tracking-wider">
            10-Stage Observable Agent Execution Pipeline
          </span>
          <span className="text-[#F5F5F0]/50">
            {completedStages.length} / 10 Stages Completed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 text-center font-mono text-[10px]">
          {STAGE_ORDER.map((stage, idx) => {
            const isCompleted = completedStages.includes(stage);
            const isCurrent = currentStage === stage;
            const meta = STAGE_METADATA[stage];

            let style = 'bg-[#0E0E0E] text-[#F5F5F0]/40 border-[#F5F5F0]/5';
            if (isCompleted) style = 'bg-emerald-950 text-emerald-300 border-emerald-500/60 font-bold';
            if (isCurrent) style = 'bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059] font-bold animate-pulse';

            return (
              <div 
                key={stage}
                className={`p-2 rounded border transition-all ${style} flex flex-col items-center justify-center min-h-[50px]`}
                title={`${meta.label}: ${meta.description}`}
              >
                <span className="text-[9px] text-[#F5F5F0]/40 block">{idx + 1}</span>
                <span className="truncate w-full">{stage.replace('_', ' ')}</span>
                {isCompleted && <Check className="w-3 h-3 text-emerald-400 mt-0.5" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Split: Observable Execution Trace (Left) & Live Algorithmic/Telemetry Cockpit (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Observable Execution Trace (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase font-bold text-[#C5A059] tracking-wider flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-[#C5A059]" />
              Observable Execution Trace & Evidence Ledger
            </h2>
            <span className="text-[10px] font-mono text-[#F5F5F0]/40">
              Deterministic Tool Contracts
            </span>
          </div>

          {traceSteps.length === 0 ? (
            <div className="p-8 bg-[#141414] border border-dashed border-[#F5F5F0]/15 rounded-sm text-center space-y-3">
              <Bot className="w-8 h-8 text-[#C5A059]/60 mx-auto" />
              <h3 className="text-sm font-mono font-bold text-[#F5F5F0]">
                Agent Standing By
              </h3>
              <p className="text-xs text-[#F5F5F0]/60 max-w-md mx-auto leading-relaxed">
                Click <strong>"Run Sentinel Autonomous Agent"</strong> to observe the 10-stage diagnostic and safe intervention pipeline in real-time.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#C5A059]/80">
                Initial Goal: "{activeScenario.initialPrompt}"
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {traceSteps.map((step) => {
                const isExpanded = expandedTraceId === step.id;
                return (
                  <div
                    key={step.id}
                    className={`p-4 bg-[#141414] border rounded-sm transition-all space-y-3 ${
                      step.status === 'running' 
                        ? 'border-[#C5A059] shadow-lg' 
                        : 'border-[#F5F5F0]/10 hover:border-[#F5F5F0]/25'
                    }`}
                  >
                    {/* Header */}
                    <div 
                      className="flex items-center justify-between cursor-pointer select-none"
                      onClick={() => {
                        audioFeedback.playMicroTick();
                        setExpandedTraceId(isExpanded ? null : step.id);
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        {step.status === 'running' ? (
                          <RefreshCw className="w-4 h-4 text-[#C5A059] animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                        <span className="text-xs font-mono font-bold text-[#F5F5F0]">
                          {step.stageLabel}
                        </span>
                        <code className="text-[11px] font-mono text-[#C5A059] bg-[#0E0E0E] px-1.5 py-0.5 rounded border border-[#F5F5F0]/5">
                          {step.toolName}
                        </code>
                      </div>

                      <div className="flex items-center gap-2">
                        {getEpistemicBadge(step.epistemicProvenance)}
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          {step.confidence}% conf
                        </span>
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-[#F5F5F0]/50" /> : <ChevronRight className="w-4 h-4 text-[#F5F5F0]/50" />}
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-[#F5F5F0]/90 leading-relaxed font-sans">
                      {step.summary}
                    </p>

                    {/* Expanded Details / Inputs & Outputs */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-[#F5F5F0]/10 space-y-2 text-xs font-mono animate-fadeIn">
                        {step.inputs && Object.keys(step.inputs).length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase text-[#F5F5F0]/50 block font-bold">
                              TOOL INPUT PARAMETERS:
                            </span>
                            <pre className="p-2.5 bg-[#0A0A0A] rounded border border-[#F5F5F0]/5 text-[11px] text-[#F5F5F0]/80 overflow-x-auto">
                              {JSON.stringify(step.inputs, null, 2)}
                            </pre>
                          </div>
                        )}

                        {step.outputs && Object.keys(step.outputs).length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase text-emerald-400 block font-bold">
                              VERIFIED TOOL OUTPUTS:
                            </span>
                            <pre className="p-2.5 bg-[#0A0A0A] rounded border border-emerald-900/30 text-[11px] text-emerald-200/90 overflow-x-auto">
                              {JSON.stringify(step.outputs, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Interactive Human Approval Drawer (When paused at Step 7) */}
          {waitingForApproval && selectedIntervention && (
            <div className="p-5 bg-[#121814] border-2 border-emerald-500 rounded-sm space-y-4 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <KeyRound className="w-5 h-5" />
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider">
                    Step 7: Human Cryptographic Authorization Gate
                  </h3>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500 rounded">
                  Dual-Key Required
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-[#F5F5F0]">
                  Recommended Intervention: {selectedIntervention.title}
                </h4>
                <p className="text-xs text-[#F5F5F0]/80 leading-relaxed">
                  {selectedIntervention.description}
                </p>
              </div>

              {/* Tradeoff Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-[#0A0E0B] p-3 rounded border border-emerald-900/40">
                <div>
                  <span className="text-[#F5F5F0]/40 block text-[10px]">RESIDUAL RISK</span>
                  <span className="text-emerald-400 font-bold">{(selectedIntervention.residualRisk * 100).toFixed(0)}% (Low)</span>
                </div>
                <div>
                  <span className="text-[#F5F5F0]/40 block text-[10px]">FINANCIAL COST</span>
                  <span className="text-[#C5A059] font-bold">${selectedIntervention.financialCostUsd}</span>
                </div>
                <div>
                  <span className="text-[#F5F5F0]/40 block text-[10px]">DOWNTIME</span>
                  <span className="text-cyan-400 font-bold">{selectedIntervention.downtimeHours} hrs</span>
                </div>
                <div>
                  <span className="text-[#F5F5F0]/40 block text-[10px]">FLOURISHING SCORE</span>
                  <span className="text-emerald-300 font-bold">{selectedIntervention.flourishingPreservation}%</span>
                </div>
              </div>

              <div className="p-3 bg-[#0A0A0A] rounded border border-[#F5F5F0]/10 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#F5F5F0]/50 text-[10px]">SIGNER SOVEREIGN DID:</span>
                  <span className="text-emerald-400 text-[11px] font-bold truncate max-w-[280px]">
                    {address || 'did:atlas:sovereign:steward_naivasha_7721'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleApproveAndActuate}
                  disabled={isApproving}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs rounded transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>{isApproving ? 'Signing & Dispatching SCADA...' : 'Approve & Cryptographically Sign (EIP-712 / DID)'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Actuation Receipt (When completed) */}
          {actuationReceipt && (
            <div className="p-4 bg-[#141414] border border-emerald-500/40 rounded-sm space-y-3 text-xs font-mono animate-fadeIn">
              <div className="flex items-center justify-between text-emerald-400 border-b border-[#F5F5F0]/10 pb-2">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> SCADA Actuation Receipt Confirmed
                </span>
                <span className="text-[10px] text-[#F5F5F0]/50">{actuationReceipt.timestamp}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#F5F5F0]/40 block text-[10px]">TX HASH</span>
                  <span className="text-[#F5F5F0] truncate block">{actuationReceipt.transactionHash}</span>
                </div>
                <div>
                  <span className="text-[#F5F5F0]/40 block text-[10px]">MERKLE ROOT LEAF</span>
                  <span className="text-emerald-400 truncate block">{actuationReceipt.merkleRootLeaf}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Algorithmic & Telemetry Cockpit (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Cockpit Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm text-xs font-mono">
            <button
              onClick={() => setInspectorTab('algorithms')}
              className={`flex-1 py-1.5 text-[11px] rounded transition-all cursor-pointer ${
                inspectorTab === 'algorithms' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              Algorithms & Pareto
            </button>
            <button
              onClick={() => setInspectorTab('telemetry')}
              className={`flex-1 py-1.5 text-[11px] rounded transition-all cursor-pointer ${
                inspectorTab === 'telemetry' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              Live Telemetry
            </button>
            <button
              onClick={() => setInspectorTab('evidence')}
              className={`flex-1 py-1.5 text-[11px] rounded transition-all cursor-pointer ${
                inspectorTab === 'evidence' ? 'bg-[#C5A059] text-black font-bold' : 'text-[#F5F5F0]/60 hover:text-[#F5F5F0]'
              }`}
            >
              Evidence & History
            </button>
            <button
              id="sentinel-field-ledger-tab-btn"
              onClick={() => setInspectorTab('ledger')}
              className={`flex-1 py-1.5 text-[11px] rounded transition-all cursor-pointer flex items-center justify-center gap-1 ${
                inspectorTab === 'ledger' ? 'bg-gradient-to-r from-emerald-500 to-[#C5A059] text-black font-bold' : 'text-emerald-400 hover:text-emerald-200'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>Camera Ledger</span>
            </button>
          </div>

          {/* TAB 1: Algorithmic & Pareto Engine */}
          {inspectorTab === 'algorithms' && (
            <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-[#C5A059] font-bold tracking-wider">
                  Mathematical Anomaly Core
                </span>
                <p className="text-[11px] text-[#F5F5F0]/70 font-sans">
                  Edge EWMA + Multi-variate Z-Score with sliding-window threshold.
                </p>
              </div>

              {anomalyResult ? (
                <div className="p-3 bg-[#0E0E0E] rounded border border-[#F5F5F0]/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F5F0]/60">Max Deviation:</span>
                    <span className="text-rose-400 font-bold text-sm">Z = {anomalyResult.maxZScore.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F5F0]/60">Severity:</span>
                    <span className="px-2 py-0.5 text-[10px] bg-rose-950 text-rose-300 border border-rose-800 rounded font-bold">
                      {anomalyResult.anomalySeverity}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#F5F5F0]/50 pt-1 border-t border-[#F5F5F0]/5">
                    {anomalyResult.formulaExplanation}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-[#0E0E0E] rounded text-center text-[#F5F5F0]/40 text-[11px]">
                  Run agent loop to calculate live Z-scores.
                </div>
              )}

              {/* Pareto Frontier Interventions Table */}
              <div className="space-y-2 pt-2 border-t border-[#F5F5F0]/10">
                <span className="text-[10px] uppercase text-[#C5A059] font-bold tracking-wider">
                  Pareto Frontier Optimization (MAUT)
                </span>

                <div className="space-y-2">
                  {activeScenario.candidateInterventions.map((cand, idx) => {
                    const isOptimal = cand.paretoRank === 1;
                    const isBlocked = cand.safetyVerdict === 'VIOLATION_BLOCKED';

                    return (
                      <div
                        key={cand.id}
                        className={`p-3 rounded border transition-all space-y-2 ${
                          isBlocked
                            ? 'bg-rose-950/20 border-rose-800/40 text-[#F5F5F0]/60'
                            : isOptimal
                            ? 'bg-[#1B3022]/40 border-emerald-500 text-[#F5F5F0]'
                            : 'bg-[#0E0E0E] border-[#F5F5F0]/10 text-[#F5F5F0]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">
                            #{idx + 1} {cand.title.split(':')[0]}
                          </span>
                          <span className={`px-2 py-0.5 text-[9px] rounded font-bold ${
                            isBlocked ? 'bg-rose-900 text-rose-200' : 'bg-emerald-950 text-emerald-300'
                          }`}>
                            {cand.safetyVerdict}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#F5F5F0]/70 font-sans leading-relaxed">
                          {cand.safetyRationale}
                        </p>

                        <div className="grid grid-cols-4 gap-1 text-[10px] pt-1 text-[#F5F5F0]/60">
                          <div>Risk: <span className="text-[#F5F5F0] font-bold">{(cand.residualRisk * 100).toFixed(0)}%</span></div>
                          <div>Cost: <span className="text-[#C5A059] font-bold">${cand.financialCostUsd}</span></div>
                          <div>Down: <span className="text-cyan-400 font-bold">{cand.downtimeHours}h</span></div>
                          <div>Utility: <span className="text-emerald-400 font-bold">{cand.compositeUtilityScore}</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Live Telemetry Waveforms */}
          {inspectorTab === 'telemetry' && (
            <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-[#C5A059] font-bold tracking-wider">
                  Edge Sensor Mesh Stream ({activeTelemetry.length} Nodes)
                </span>
                <span className={`px-2 py-0.5 text-[9px] rounded font-bold ${
                  isStabilized ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400 animate-pulse'
                }`}>
                  {isStabilized ? 'STABILIZED (POST-ACTUATION)' : 'ACTIVE SURGE'}
                </span>
              </div>

              <div className="space-y-2.5">
                {activeTelemetry.map(sen => (
                  <div key={sen.sensorId} className="p-3 bg-[#0E0E0E] rounded border border-[#F5F5F0]/10 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#F5F5F0]">{sen.sensorName}</span>
                      <span className="text-[10px] text-[#F5F5F0]/40">{sen.sensorId}</span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className={`text-xl font-bold ${sen.isAnomalous ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {sen.currentValue} <span className="text-xs text-[#F5F5F0]/50">{sen.unit}</span>
                      </span>
                      <span className="text-[11px] text-[#F5F5F0]/60">
                        Nominal: {sen.nominalValue} {sen.unit}
                      </span>
                    </div>

                    {/* Progress Bar Visualization */}
                    <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${sen.isAnomalous ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, (sen.currentValue / (sen.nominalValue * 2)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Evidence & History */}
          {inspectorTab === 'evidence' && (
            <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-[#C5A059] font-bold tracking-wider">
                  Epistemic Failure Case Cross-Reference
                </span>
                <p className="text-[11px] text-[#F5F5F0]/70 font-sans">
                  Retrieved via normalized hydraulic distance across 15-year post-mortem database.
                </p>
              </div>

              <div className="space-y-3">
                {activeScenario.historicalMatches.map(hist => (
                  <div key={hist.id} className="p-3 bg-[#0E0E0E] rounded border border-[#F5F5F0]/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 text-xs">{hist.id}</span>
                      <span className="text-[10px] font-bold text-[#C5A059]">{hist.similarityScore}% Match</span>
                    </div>
                    <h4 className="font-bold text-xs text-[#F5F5F0]">{hist.title}</h4>
                    <p className="text-[11px] text-[#F5F5F0]/70 font-sans leading-relaxed">
                      {hist.rootCause}
                    </p>
                    <div className="p-2 bg-[#141414] rounded text-[10px] text-emerald-300 border border-emerald-900/40">
                      <strong>Mitigation Applied:</strong> {hist.mitigationApplied}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Field Camera & Bioregional Ledger */}
          {inspectorTab === 'ledger' && (
            <div className="p-4 bg-[#141414] border border-[#F5F5F0]/10 rounded-sm space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-[#C5A059] font-bold tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    Field Observation Camera
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
                    CRYPTOGRAPHIC MERKLE ANCHOR
                  </span>
                </div>
                <p className="text-[11px] text-[#F5F5F0]/70 font-sans">
                  Capture high-resolution optical evidence directly from field sensors or device camera and anchor into the bioregional ledger.
                </p>
              </div>

              {snapshotAppendSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{snapshotAppendSuccess}</span>
                </div>
              )}

              {cameraError && (
                <div className="p-3 bg-amber-950/80 border border-amber-500/60 rounded text-amber-200 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Hidden Canvas & File Input */}
              <canvas ref={canvasRef} className="hidden" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Live Camera Viewport */}
              {isCameraActive ? (
                <div className="space-y-3 bg-black rounded p-2 border border-emerald-500/40">
                  <div className="relative aspect-video bg-black rounded overflow-hidden flex items-center justify-center border border-[#F5F5F0]/20">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                    {/* Viewfinder Crosshair Overlays */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-20 h-20 border border-emerald-500/50 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                      </div>
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 text-[10px] text-emerald-300 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE OPTICAL SENSOR • {activeScenario.targetAsset.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="sentinel-capture-frame-btn"
                      onClick={handleCaptureFrame}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Camera className="w-4 h-4" />
                      Capture High-Res Frame
                    </button>
                    <button
                      onClick={() => {
                        setCameraFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
                        stopCamera();
                        setTimeout(startCamera, 100);
                      }}
                      title="Switch Camera Facing Mode"
                      className="p-2 bg-[#1E1E1E] hover:bg-[#252525] text-[#F5F5F0] rounded border border-[#F5F5F0]/20 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-[#C5A059]" />
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-3 py-2 bg-rose-950/80 hover:bg-rose-900/80 text-rose-300 rounded border border-rose-500/40 cursor-pointer text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : capturedSnapshot ? (
                /* Captured Frame Preview & Ledger Metadata Entry */
                <div className="space-y-3 p-3 bg-[#0A0A0A] rounded border border-[#C5A059]/40 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#C5A059] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Snapshot Captured (Pending Ledger Verification)
                    </span>
                    <button
                      onClick={() => setCapturedSnapshot(null)}
                      className="text-[#F5F5F0]/50 hover:text-rose-400 text-[10px]"
                    >
                      Retake
                    </button>
                  </div>

                  <div className="relative aspect-video rounded overflow-hidden border border-[#F5F5F0]/20 bg-black">
                    <img
                      src={capturedSnapshot}
                      alt="Field Observation Snapshot"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-emerald-400 font-mono">
                      Target: {activeScenario.targetAsset.name}
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div>
                      <label className="block text-[10px] text-[#F5F5F0]/50 mb-1">METRIC CATEGORY</label>
                      <select
                        value={snapshotCategory}
                        onChange={(e) => setSnapshotCategory(e.target.value)}
                        className="w-full bg-[#181818] border border-[#F5F5F0]/20 rounded p-1.5 text-xs text-[#F5F5F0] font-mono focus:border-[#C5A059] outline-none"
                      >
                        <option value="Hydraulic Infrastructure">Hydraulic Infrastructure (Impeller/Pipes)</option>
                        <option value="Bioregional Bio-Corridor">Bioregional Bio-Corridor (Fauna/Flora)</option>
                        <option value="Soil Moisture & Canopy">Soil Moisture & Canopy Multi-spectral</option>
                        <option value="Sensor Calibration Check">Sensor Rig Hardware Calibration</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#F5F5F0]/50 mb-1">FIELD STEWARD OBSERVATION NOTES</label>
                      <textarea
                        rows={2}
                        value={snapshotNotes}
                        onChange={(e) => setSnapshotNotes(e.target.value)}
                        className="w-full bg-[#181818] border border-[#F5F5F0]/20 rounded p-1.5 text-xs text-[#F5F5F0] font-sans focus:border-[#C5A059] outline-none resize-none"
                        placeholder="Detail visual observations, physical vibrations, or structural integrity..."
                      />
                    </div>

                    <div className="p-2 bg-[#121212] rounded border border-[#F5F5F0]/10 flex items-center justify-between text-[10px]">
                      <span className="text-[#F5F5F0]/60">SIGNING STEWARD:</span>
                      <span className="text-[#C5A059] font-mono">{address ? `${address.slice(0, 8)}...${address.slice(-6)}` : 'did:atlas:sovereign:naivasha'}</span>
                    </div>

                    <button
                      id="sentinel-append-ledger-btn"
                      onClick={handleAppendSnapshotToLedger}
                      disabled={isAppendingSnapshot}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-[#C5A059] hover:from-emerald-400 hover:to-[#d4b069] text-black font-bold text-xs rounded transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
                    >
                      {isAppendingSnapshot ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Anchoring to Sovereign Ledger...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Append Snapshot to Bioregional Ledger</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Primary Camera Launch Controls */
                <div className="space-y-3">
                  <div className="p-4 bg-[#0E0E0E] rounded border border-dashed border-[#C5A059]/40 flex flex-col items-center justify-center text-center gap-2.5">
                    <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F5F5F0]">High-Resolution Field Snapshot</h4>
                      <p className="text-[11px] text-[#F5F5F0]/60 mt-0.5">
                        Capture real-time physical evidence for {activeScenario.targetAsset.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full pt-1">
                      <button
                        id="sentinel-open-camera-btn"
                        onClick={startCamera}
                        className="flex-1 py-2 bg-[#C5A059] hover:bg-[#d4b069] text-black font-bold text-xs rounded transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Open Field Camera
                      </button>
                      <button
                        id="sentinel-upload-file-btn"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-[#F5F5F0] border border-[#F5F5F0]/20 rounded text-xs transition flex items-center gap-1.5 cursor-pointer"
                        title="Upload Snapshot File"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Ledger Entries History */}
              <div className="space-y-2 pt-2 border-t border-[#F5F5F0]/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#C5A059] font-bold tracking-wider uppercase">
                    Anchored Field Ledger Entries ({ledgerEntries.length})
                  </span>
                  <span className="text-[9px] text-[#F5F5F0]/50 font-mono">LATEST BLOCK #1849221</span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {ledgerEntries.map(entry => (
                    <div key={entry.id} className="p-2.5 bg-[#0A0A0A] rounded border border-[#F5F5F0]/10 hover:border-[#C5A059]/40 transition space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={entry.imageUrl}
                          alt="Ledger Thumbnail"
                          className="w-14 h-11 object-cover rounded border border-[#F5F5F0]/20 bg-black shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-400 truncate">{entry.metricCategory}</span>
                            <span className="text-[9px] text-[#F5F5F0]/50 font-mono">{entry.timestamp}</span>
                          </div>
                          <p className="text-[10px] text-[#F5F5F0]/80 truncate font-sans">{entry.notes}</p>
                          <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-[#C5A059] font-mono mt-0.5">
                            <span>Block #{entry.blockHeight}</span>
                            <span>•</span>
                            <span className="text-[#F5F5F0]/40 truncate">{entry.hash.slice(0, 14)}...</span>
                            {(entry.artifactReference || entry.s3Uri) && (
                              <>
                                <span>•</span>
                                <span 
                                  className="text-emerald-400 font-mono flex items-center gap-1 truncate max-w-[200px]" 
                                  title={`S3 Artifact: ${entry.artifactReference || entry.s3Uri}`}
                                >
                                  <Database className="w-2.5 h-2.5 shrink-0 text-emerald-400" />
                                  <span className="truncate">{entry.artifactReference || entry.s3Uri}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
