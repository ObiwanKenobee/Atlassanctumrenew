# ATLAS MISSION CONTROL — Multi-Agent Flow Specification
**Google Cloud Agentic Cinema / Summer Blockbuster Hackathon**
*Orchestration Engine: Gemini 3.7 Flash + Google Cloud Agent Platform + Grafana Labs Tools*

---

## 1. Multi-Agent Topology & Communication Graph

Atlas Mission Control implements a **5-Agent Autonomous Operational Hierarchy** coordinated by Gemini 3.7 Flash:

```
                          +-------------------------------+
                          |     OPERATOR GOAL INPUT       |
                          |  "Keep production on schedule"|
                          +---------------+---------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        ATLAS MISSION CONTROL AGENT FLEET                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  1. OBSERVER AGENT (gemini-3.7-flash)                                             |
|     Input: GKE Cluster ID, active pipeline ('imf-master-4k')                      |
|     Tools: grafana_query_telemetry, get_system_state, store_memory                |
|     Output: Anomaly vector (94.2°C thermal spike, 18.7% frame drop, Z=4.2)        |
|     Success Criteria: Real-time anomaly detection within <2.5 seconds.            |
|                                     |                                             |
|                                     v                                             |
|  2. INVESTIGATOR AGENT (gemini-3.7-flash)                                         |
|     Input: Anomaly vector, affected service names, timecode offset                |
|     Tools: grafana_search_logs, grafana_find_incidents, retrieve_memory           |
|     Output: Root cause causal tree + Loki stack traces + historical analogue      |
|     Success Criteria: Pinpoints root cause (CUDA handle leak + NVMe queue stall).|
|                                     |                                             |
|                                     v                                             |
|  3. RISK AGENT (gemini-3.7-flash)                                                 |
|     Input: Root cause diagnosis, theatrical lock deadline (3.8h), cost matrix     |
|     Tools: calculate_blast_radius, analyze_data, store_memory                     |
|     Output: Blast radius report ($145k exposure, 88.5% breach risk, safety check) |
|     Success Criteria: Verifies standby node capacity with zero cascade hazard.    |
|                                     |                                             |
|                                     v                                             |
|  4. DIRECTOR AGENT (gemini-3.7-flash)                                             |
|     Input: Risk assessment, candidate mitigation catalog, operator policy rules   |
|     Tools: plan_mitigation, execute_action, request_approval                      |
|     Output: Staged zero-frame-loss failover plan + Cryptographic Approval Slip    |
|     Success Criteria: Halts execution cleanly and stages human governance gate.   |
|                                     |                                             |
+-------------------------------------+---------------------------------------------+
                                      |
                                      v
                        [ HUMAN STEWARD APPROVAL GATE ]
                      (APPROVE • REJECT • MODIFY • PAUSE)
                                      | (Signed with Operator Key)
                                      v
+-----------------------------------------------------------------------------------+
|  5. VERIFIER AGENT (gemini-3.7-flash)                                             |
|     Input: Action execution receipt, expected nominal metrics                     |
|     Tools: verify_state, anchor_incident_lesson, publish_result                   |
|     Output: Telemetry delta verification proof, Merkle hash, anti-fragile memory  |
|     Success Criteria: Mathematically proves 0.00% frame drops & anchors lesson.   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Agent Contracts & Specifications

### Agent 1: Observer Agent (`observer_agent`)
- **Context**: Continuous media pipeline and render farm monitoring.
- **Input**:
  - `cluster`: Target Kubernetes cluster (`render-farm-us-central1`).
  - `pipeline`: Active rendering stream (`imf-master-4k`).
  - `metrics`: Polling frequency (100ms) and metric vectors.
- **Tools**:
  - `grafana_query_telemetry`: PromQL query for GPU thermals, VRAM pressure, and frame drops.
  - `get_system_state`: System health aggregation.
  - `store_memory`: Caches baseline timeseries into episodic memory.
- **Output**:
  - `anomalyDetected`: `true`
  - `anomalySeverity`: `P1_CRITICAL`
  - `thermalDeviation`: `94.2°C` (Ceiling: `85.0°C`)
  - `frameDropRate`: `18.7%`
  - `scratchSaturation`: `98.4%`
- **Success Criteria**:
  - Real-time detection within <2.5 seconds of anomaly onset.
  - Correct severity classification without false alarm triggering.

---

### Agent 2: Investigator Agent (`investigator_agent`)
- **Context**: Deep diagnostic tracing and historical pattern matching.
- **Input**:
  - Anomaly vector from Observer Agent (`node_id: gpu-node-h100-alpha-08`).
  - Active timecode range (`01:24:00:00` to `01:25:30:00`).
- **Tools**:
  - `grafana_search_logs`: LogQL query across Loki streams (`{service="imf-encoder"} |= "error"`).
  - `grafana_find_incidents`: Queries past post-mortems for matching signatures.
  - `retrieve_memory`: Fetches past node performance baselines.
- **Output**:
  - `rootCauseDiagnosis`: CUDA handle leak in HDR10+ tone-mapping kernel with NVMe queue depth saturation (>128).
  - `historicalIncidentMatch`: `INC-2025-0914` (*VRAM Leak & Thermal Throttling on Premiere Master Delivery*).
  - `provenMitigationPattern`: Hot failover to standby GKE node with 4-way distributed NVMe striping.
- **Success Criteria**:
  - Isolates exact software kernel and storage bottleneck.
  - Identifies validated historical mitigation analogue within <5 seconds.

---

### Agent 3: Risk Agent (`risk_agent`)
- **Context**: Blast radius modeling and delivery timeline exposure analysis.
- **Input**:
  - Root cause vector, 3.8-hour theatrical lock window, production cost matrices.
- **Tools**:
  - `calculate_blast_radius`: Quantitative blast radius calculator.
  - `analyze_data`: Mathematical simulation of downstream timeline cascades.
  - `store_memory`: Records risk bounds.
- **Output**:
  - `blastRadiusScore`: 78 / 100
  - `theatricalLockBreachProbability`: `88.5%` (if unmitigated)
  - `financialDowntimeExposure`: `$145,000`
  - `safetyInvariantCheck`: `PASSED` — Target standby node `gpu-node-h100-reserve-02` has 100% capacity and zero active jobs.
- **Success Criteria**:
  - Validates that target standby nodes satisfy all safety invariants without secondary cascades.

---

### Agent 4: Director Agent (`director_agent`)
- **Context**: Intervention formulation, guardrail validation, and human gating.
- **Input**:
  - Risk report, candidate intervention catalog, studio operator policies.
- **Tools**:
  - `plan_mitigation`: Generates minimal-blast-radius hot failover sequence.
  - `request_approval`: Synthesizes human-readable approval request and halts DAG.
  - `execute_action`: Dispatches authorized actuation after signature.
- **Output**:
  - `stagedIntervention`: Zero-Frame-Loss Hot Failover to Standby GKE Cluster (`gpu-node-h100-reserve-02`).
  - `rollbackGuarantee`: Automated revert if packet latency exceeds 40ms.
  - `approvalGate`: Cryptographic Human Approval Slip requiring operator sign-off.
- **Success Criteria**:
  - Zero unverified actions taken.
  - Clean halt of execution DAG with clear, actionable tradeoff matrix.

---

### Agent 5: Verifier Agent (`verifier_agent`)
- **Context**: Closed-loop state confirmation and organizational anti-fragility learning.
- **Input**:
  - Hot failover execution receipt, expected nominal metrics (`frame_drops == 0.00%`).
- **Tools**:
  - `verify_state`: Ingests post-actuation Grafana telemetry samples.
  - `anchor_incident_lesson`: Commits post-mortem vector and Merkle root hash to failure ledger.
  - `publish_result`: Broadcasts verified delivery status to studio monitors.
- **Output**:
  - `postMitigationGpuTemp`: `68.4°C` (Nominal)
  - `postMitigationFrameDropRate`: `0.00%` (Verified 4K HDR10+ Checksum Match)
  - `merkleProofHash`: `0x8f2d9c1a4e7b0c3d...`
  - `antiFragilityLesson`: Auto-flush CUDA handles after 128 frames + 4-way NVMe buffer striping.
- **Success Criteria**:
  - Mathematical proof that error rates dropped to 0.00% and temperatures stabilized.
  - Immutable record anchored into the persistent failure ledger.

---

## 3. Human Control Protocol (Cockpit Controls)

The operator interface provides 4 immediate controls:
1. **APPROVE**: Signs the intervention with operator credentials and dispatches the hot failover.
2. **REJECT**: Aborts the proposal and instructs Director Agent to synthesize an alternative strategy.
3. **MODIFY**: Allows tuning parameters (e.g. adjust buffer allocation, change standby node ID).
4. **PAUSE**: Temporarily freezes the autonomous loop for manual pipeline inspection.
