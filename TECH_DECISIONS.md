# ATLAS SENTINEL — Technical Decision Record (TDR)
**Engineering Rationale & Architectural Invariants**

---

## 1. Decision: Observable 10-Stage Agentic Loop vs. Free-form Conversational Chat

- **Context**: Autonomous systems handling physical infrastructure cannot operate as opaque, monolithic text generators. Operators need granular visibility into every step of diagnosis and planning.
- **Decision**: Decompose the workflow into 10 explicit, observable stages with typed input/output contracts and strict state transitions.
- **Consequences**:
  - Operators can inspect exact tool calls, parameters, and telemetry evidence at every step.
  - Failures in one stage (e.g. sensor timeout during OBSERVE) trigger isolated fallback paths without crashing the entire reasoning pipeline.

---

## 2. Decision: Deterministic Safety Firewall Over LLM Self-Guardrails

- **Context**: LLMs, even with system prompts, are susceptible to prompt injection, hallucinated physical parameters, and stochastic boundary drift.
- **Decision**: Implement a hardcoded, deterministic TypeScript/Node safety validation engine that executes **after** model generation and **before** actuation authorization.
- **Invariants Enforced**:
  - `MAX_PIPE_PRESSURE = 14.5 bar` (Strict hydraulic ceiling).
  - `MIN_COMMUNITY_WATER_RESERVE = 5,000 Liters` (Cannot actuate full shutdown if reserves are low).
  - `MANDATORY_HUMAN_SIGNATURE_THRESHOLD = RiskScore >= 0.35` (All consequential physical actions require human cryptographic key signature).

---

## 3. Decision: Hybrid Algorithmic Pipeline (EWMA/Z-Score + Pareto Optimizer + Gemini 3.7 Flash)

- **Context**: An LLM is excellent at synthesis, qualitative domain reasoning, and cross-referencing natural language post-mortems, but poor at high-frequency time-series anomaly detection and exact Pareto mathematical optimization.
- **Decision**:
  1. Edge anomaly detection runs in pure math (sliding-window EWMA with dynamic Z-scores).
  2. Candidate intervention ranking runs in multi-attribute utility optimization with strict Pareto optimality.
  3. Gemini 3.7 Flash (with Deep Thinking) is invoked specifically for root-cause hypothesis generation, historical contextualization, and human-facing tradeoff synthesis.

---

## 4. Decision: Epistemic Provenance Standard (`[OBSERVED]`, `[REPORTED]`, `[MODELED]`, `[ESTIMATED]`, `[VERIFIED]`)

- **Context**: Misrepresenting synthetic model outputs as empirical physical sensor readings causes operator mistrust and catastrophic errors.
- **Decision**: Every data point, chart bar, and recommendation displays an immutable Epistemic Badge. Telemetry from physical sensors is tagged `[OBSERVED]`; mathematical forecasts are tagged `[MODELED]`; community reports are tagged `[REPORTED]`; cryptographic proofs are tagged `[VERIFIED]`.

---

## 5. Decision: Sovereign WebCrypto & W3C DID Signing Over Insecure Centralized Logins

- **Context**: Consequential infrastructure actuation work orders must be non-repudiable and tamper-proof. Relying solely on basic cookie sessions allows forged approvals.
- **Decision**: Use WebCrypto API and local browser hardware enclaves to issue Sovereign DIDs (`did:atlas:sovereign:...`) and SHA-256 / EIP-712 cryptographic signatures on every approval slip.
