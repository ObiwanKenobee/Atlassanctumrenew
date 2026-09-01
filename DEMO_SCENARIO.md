# ATLAS MISSION CONTROL — Demo Scenario Specification
**Google Cloud Agentic Cinema / Summer Blockbuster Hackathon**
*Scenario: "Midnight Master Delivery: Theatrical IMF Encoder Anomaly"*

---

## 1. Context & Stakes

- **Production Title**: *Apex Continuum (Summer Blockbuster Release)*
- **Window**: Theatrical IMF master package delivery due in **3.8 hours** for worldwide synchronized premiere distribution.
- **Environment**: Distributed Google Cloud GKE Render Farm (`us-central1`), 4K HDR10+ Dolby Vision Encoding Pipeline, and Unreal Engine Virtual Production Stage 7.
- **The Threat**: A thermal spike on primary GPU render nodes induces a catastrophic 18.7% frame drop rate and NVMe scratch buffer saturation. If unaddressed, the master package checksum fails, causing a $145,000 delay penalty and theatrical lock breach.

---

## 2. Operator Goal

Human Operator instructs Atlas Mission Control:

> **"Keep tonight's production on schedule. Find the most dangerous issue, investigate it, recommend the safest intervention, and prepare the response."**

---

## 3. Step-by-Step 12-Phase Execution Trace

### Phase 1: Ingest System State (Observer Agent)
- Calls `grafana_query_telemetry(cluster="render-farm-us-central1")`
- Flags critical metric: `gpu_thermal_temperature_celsius = 94.2°C` (Safe ceiling: 85°C) on `gpu-node-h100-alpha-08`
- Flags frame drop rate: `18.7%` on `imf-master-4k` pipeline
- Flags scratch IOPS saturation: `98.4%` on `storage-tier-scratch-03`

### Phase 2: Anomaly Identification & Triage (Observer Agent)
- Classifies as **P1 CRITICAL — Theatrical Delivery Impairment**
- Dispatches alert packet to Mission Control event bus

### Phase 3: Root Cause Investigation (Investigator Agent)
- Calls `grafana_search_logs('{service="imf-encoder"} |= "error"')`
- Detects CUDA context handle leak in multi-pass tone-mapping kernel
- Identifies NVMe buffer thread queue depth overflow (>128 pending writes)

### Phase 4: Correlate Signals (Investigator Agent)
- Correlates GPU thermal throttling with memory write buffer stalls
- Proves that frames are dropped during checksum serialization, not render geometry generation

### Phase 5: Historical Analogue Retrieval (Investigator Agent)
- Calls `grafana_find_incidents(pattern="thermal VRAM scratch bottleneck")`
- Retrieves `INC-2025-0914` (*VRAM Leak & Thermal Throttling on Premiere Master Delivery*)
- Identifies proven mitigation: *Hot failover of chunk buffer to standby node with 4-way distributed SSD striping*

### Phase 6: Assess Blast Radius & Risk (Risk Agent)
- Evaluates deadline slip risk: 94 minutes delay without action -> **HIGH_RISK_BREACH**
- Evaluates financial risk: $145,000 downtime exposure
- Validates safety invariant: Target standby node `gpu-node-h100-reserve-02` has 100% capacity and zero active jobs

### Phase 7: Produce Intervention Options (Director Agent)
- Synthesizes non-destructive failover workflow:
  1. Pause input queue on failing Node 08
  2. Snapshot active frame buffer (Timecode `01:24:18:12`)
  3. Reroute encode stream to Reserve Node 02 with 4-way NVMe striping
  4. Spin down Node 08 for thermal cool-down

### Phase 8: Apply Policy Guardrails (Director Agent)
- Tests Invariant Rule #3: Dual-Key Operator Signature required for Class 4 GKE production modifications
- Formulates rollback guarantee: Automated revert if packet latency exceeds 40ms

### Phase 9: Request Human Approval (Director Agent)
- Halts execution and presents human-readable Approval Slip in UI
- Displays Tradeoff Matrix: Blast Radius 78/100, Downtime 0 seconds, Cost $0 added, Risk Mitigated 100%
- Operator signs via sovereign key / clicks **APPROVE**

### Phase 10: Execute Approved Action (Director Agent)
- Calls `execute_action("GKE_RENDER_HOT_FAILOVER", { ... })`
- Reroutes live traffic to reserve cluster; logs cryptographic execution hash

### Phase 11: Verify New System State (Verifier Agent)
- Calls `verify_state()` via real-time Grafana polling
- Confirms:
  - GPU Temperature: **68.4°C** (Nominal)
  - Frame Drop Rate: **0.00%** (100% Checksum match verified)
  - Scratch IOPS: **34.2%**
- Issues cryptographic verification proof hash

### Phase 12: Record Lesson & Learning Loop (Verifier Agent)
- Anchors incident dossier, root cause, and mitigation proof to the Atlas Failure & Resilience Memory Bank
- Pushes anti-fragile rule: *Enforce auto-flush of CUDA handles every 128 frames for all future 4K IMF encodes*

---

## 4. The "Wow" Moment

The entire diagnosis, historical correlation, blast radius evaluation, policy check, human sign-off, failover actuation, and verification completes in **under 3.5 minutes with zero lost frames**.
