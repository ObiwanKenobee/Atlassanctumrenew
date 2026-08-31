# ATLAS SENTINEL — Hackathon Architecture Specification
**TikTok TechJam 2026 • Infrastructure & Agentic Intelligence Track**
*System: ATLAS SENTINEL (Autonomous Infrastructure Resilience & Decision Engine)*

---

## 1. Executive Summary

**Atlas Sentinel** is a deterministic, safety-guarded agentic infrastructure intelligence platform that transforms raw physical sensor telemetry into verified, safe, and measurable real-world interventions.

Rather than relying on unconstrained LLM chat or passive dashboards, Atlas Sentinel implements an **Observable Agentic Loop** designed for mission-critical infrastructure (water networks, clean energy microgrids, and bioregional ecological assets):

$$\text{OBSERVE} \longrightarrow \text{DETECT} \longrightarrow \text{REASON} \longrightarrow \text{VERIFY} \longrightarrow \text{ASSESS SAFETY} \longrightarrow \text{RECOMMEND} \longrightarrow \text{REQUEST APPROVAL} \longrightarrow \text{ACT} \longrightarrow \text{MEASURE} \longrightarrow \text{LEARN}$$

```
+---------------------------------------------------------------------------------------------------+
|                                      ATLAS SENTINEL ARCHITECTURE                                   |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [ Physical Assets & IoT Sensors ]                                                                |
|       | (Pressure, Flow, Purity, Vibration, Current, Temperature)                                |
|       v                                                                                           |
|  [ Edge Layer: Local Buffer, Rate-of-Change Filter, Edge Anomaly Detection (EWMA / Z-Score) ]        |
|       |                                                                                           |
|       v (Telemetry Streams & Anomaly Packets)                                                     |
|  [ Atlas Sentinel Gateway & Ingestion Service ]                                                    |
|       |                                                                                           |
|       +----------------------------+-----------------------------+                                |
|       |                            |                             |                                |
|       v                            v                             v                                |
|  [ Algorithmic Anomaly Core ] [ Epistemic Knowledge Graph ] [ Historical Failure Memory ]         |
|  - Multi-variate Z-Score      - Bioregional Ontologies      - 15-Year Failure Post-Mortems        |
|  - Transient Surge Analysis   - Sensor Lineage (Provenances) - Anti-Fragile Mitigations           |
|  - Vibration FFT Spectrum     - W3C Credential Hashing      - Similar Failure Vector KNN          |
|       |                            |                             |                                |
|       +----------------------------+-----------------------------+                                |
|                                    |                                                              |
|                                    v                                                              |
|  [ High-Reasoning Agent Core (Gemini 3.7 Flash Thinking + Deterministic Tools) ]                  |
|       - atlas_get_system_state()                                                                  |
|       - atlas_detect_anomalies()                                                                  |
|       - atlas_search_evidence()                                                                   |
|       - atlas_find_similar_failures()                                                             |
|       - atlas_rank_interventions()  <-- Pareto Frontier & Multi-Attribute Utility Optimization     |
|                                                                                                   |
|                                    v                                                              |
|  [ Deterministic Policy & Safety Gatekeeper (Inviolable Floor) ]                                  |
|       - Inviolable Physical Invariants (Pressure limits, thermal ceilings)                        |
|       - Social & Human Flourishing Guardrails (FPIC, minimum water access)                         |
|       - Dual-Key Cryptographic Authorization Requirements                                         |
|                                                                                                   |
|                                    v                                                              |
|  [ Human-in-the-Loop Cockpit & Cryptographic Approval ]                                          |
|       - Plain-Language Tradeoff Matrix (Risk vs Cost vs Downtime vs Flourishing)                  |
|       - Sovereign Atlas Keypair / Web3 EIP-712 Personal Sign Approval                            |
|                                                                                                   |
|                                    v                                                              |
|  [ Actuation Dispatch & Closed-Loop Validation ]                                                  |
|       - Automated SCADA Micro-Actuation (Valve Throttle / Inverter Derate)                        |
|       - Guild Dispatch Work Order Generation                                                      |
|       - Real-time Telemetry Telemetry Delta Measurement                                            |
|       - Cryptographic Merkle Root Seal into Failure & Learning Ledger                             |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. The 10-Stage Sentinel Agentic Loop

| Stage | Agent Tool / Engine | Purpose | Output Contract |
| :--- | :--- | :--- | :--- |
| **1. OBSERVE** | `atlas_get_system_state()` | Ingests real-time edge telemetry buffer across distributed infrastructure nodes | Multi-sensor timeseries, sensor health scores, network topology |
| **2. DETECT** | `atlas_detect_anomalies()` | Executes statistical EWMA & multi-sensor Z-score algorithms | Anomaly severity, affected node ID, deviation delta |
| **3. REASON** | `atlas_reason_root_cause()` | Dispatches Gemini 3.7 Flash with Deep Thinking to diagnose mechanics | Physical failure hypothesis, causal tree, degradation vector |
| **4. VERIFY** | `atlas_search_evidence()` | Cross-references empirical sensor lineage, physical laws, and satellite baselines | Provenance matrix (Observed / Reported / Modeled / Verified) |
| **5. ASSESS SAFETY** | `atlas_run_safety_check()` | Applies deterministic constraint gates (no LLM override allowed) | Invariant violations, blast radius, safety clearance (PASS/BLOCK) |
| **6. RECOMMEND** | `atlas_rank_interventions()` | Runs Pareto multi-objective optimization over candidate interventions | Ranked action set, risk/cost/downtime/flourishing tradeoffs |
| **7. REQUEST APPROVAL** | `atlas_request_human_approval()` | Synthesizes plain-language brief and opens cryptographic signature gate | Interactive Approval Slip with required sign-off tier |
| **8. ACT** | `atlas_execute_action()` | Dispatches SCADA command + mobile guild work order | Actuation receipt, work order hash, SCADA execution timestamp |
| **9. MEASURE** | `atlas_measure_outcome()` | Captures downstream telemetry delta to verify stabilization | Pre vs Post sensor variance, recovery velocity, stabilization proof |
| **10. LEARN** | `atlas_record_learning()` | Updates historical failure memory bank and anchors Merkle proof | Merkle root leaf, updated failure vector weights |

---

## 3. Algorithmic Core (Non-LLM Mathematical Centerpiece)

Atlas Sentinel does not rely solely on LLM text generation. The technical core is powered by 3 dedicated algorithms:

### 3.1. Edge EWMA & Multi-Variate Z-Score Anomaly Detector
For each sensor stream $x_t$ at time $t$:
$$\mu_t = \alpha x_t + (1 - \alpha)\mu_{t-1}$$
$$\sigma_t^2 = \beta (x_t - \mu_t)^2 + (1 - \beta)\sigma_{t-1}^2$$
$$Z_t = \frac{|x_t - \mu_t|}{\sigma_t}$$
An anomaly flag triggers when $Z_t \ge Z_{\text{crit}}$ ($Z_{\text{crit}} = 3.2$) combined with a multi-sensor cross-correlation threshold:
$$\text{AnomalySeverity} = \sum_{i \in \text{Sensors}} w_i \cdot \max(0, Z_{i,t} - Z_{\text{crit}})$$

### 3.2. Multi-Attribute Utility & Pareto Frontier Intervention Optimizer
Evaluates candidate actions $A = \{a_1, a_2, \dots, a_k\}$ across 5 objective dimensions:
- $R(a)$: Residual Failure Risk ($[0, 1]$, lower is better)
- $C(a)$: Financial & Energy Cost ($\$$, lower is better)
- $D(a)$: Service Downtime (Hours, lower is better)
- $F(a)$: Ecological & Community Flourishing Preservation Score ($[0, 100]$, higher is better)
- $S(a)$: Deterministic Safety Margin ($[0, 1]$, higher is better)

$$\text{Utility}(a) = w_S \cdot S(a) + w_F \cdot \frac{F(a)}{100} - w_R \cdot R(a) - w_C \cdot \frac{C(a)}{C_{\max}} - w_D \cdot \frac{D(a)}{D_{\max}}$$

Subject to inviolable safety floor constraints:
$$\text{SafetyFloor}: \forall a \in A, \quad S(a) \ge 0.85 \land R_{\text{catastrophic}}(a) = 0$$

### 3.3. Similar Failure Case Retrieval (Epistemic KNN in Multi-Modal Failure Space)
Retrieves historical infrastructure incidents using normalized distance across hydraulic, electrical, and governance metadata:
$$\text{Dist}(F_{\text{current}}, F_{\text{hist}}) = \sqrt{\sum_{j} \omega_j \left( f_j^{\text{current}} - f_j^{\text{hist}} \right)^2}$$

---

## 4. Deterministic AI Safety Invariants

Consequential infrastructure actions can never be taken by an autonomous model alone. Atlas Sentinel enforces an **Explicit Invariant Policy Firewall**:

1. **Water Invariant**: No automated actuation may restrict drinking water supply to $> 500$ people without redundant gravity-fed reserve verification.
2. **Pressure Invariant**: No pipe manifold valve reconfiguration may exceed $1.25\times$ rated burst pressure ($P_{\max} = 14.5\text{ bar}$).
3. **Dual-Authorization Gate**: High-risk interventions (Class 3 / 4) require human cryptographic signature via Sovereign Atlas Keypair or MetaMask.
4. **Epistemic Labeling Requirement**: Every data point presented to human operators must display its epistemic classification: `[OBSERVED]`, `[REPORTED]`, `[MODELED]`, `[ESTIMATED]`, or `[VERIFIED]`.

---

## 5. Deployment & Runtime Environment

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons + WebCrypto DID Enclave
- **Backend Service**: Express + Node.js with native TypeScript type stripping (`server.ts`) on port 3000
- **AI Inference Engine**: Google Gemini 3.7 Flash (Reasoning/Thinking) with fallback to deterministic math engines
- **Edge Simulation Gateway**: WebSocket and high-frequency SSE telemetry stream with edge buffering
- **Audit Persistence**: Local-first indexed storage + Merkle tree root anchoring
