# ATLAS SANCTUM — MVP AUDIT & CIVILIZATIONAL EVOLUTION BLUEPRINT

## Executive Summary
This document serves as the foundational architectural audit of the Atlas Sanctum platform, detailing the state of the MVP, existing system capabilities, data models, AI integrations, and the strategic blueprint for evolving into an institutional-grade Civilizational Intelligence Platform.

---

## 1. Current Architecture Overview

### Frontend
- **Framework**: React 19 + TypeScript + Vite 6 + Tailwind CSS v4.
- **State & Context**:
  - `AuthContext`: Firebase Authentication with in-flight popup mutex lock and error suppression.
  - `Web3WalletContext`: MetaMask / Sovereign keypair authentication and cryptographic signing.
  - `OfflineModeContext`: Local storage fallback & offline sync queues.
  - `UncertaintyOverlayContext`: Epistemic confidence and assumption tracing toggles.
- **Routing & Navigation**:
  - Configuration-driven navigation (`src/components/navigation/navigationConfig.ts`) with top-level tabs, nested submenus, and an innovations aggregation hub.
  - Responsive collapse: mobile slide-out drawer on `<xl` screens; expanded horizontal menu on `xl+`.
- **Error Boundaries**:
  - `GlobalErrorBoundary`: Deterministic recovery dispatching `atlas-reset-to-home` to land on the North Star hero view (`"BUILD SYSTEMS THAT HELP humanity flourish."`).

### Backend (`server.ts`)
- **Runtime**: Express 4 with TypeScript (`tsx` in development, bundled `esbuild` CJS in production).
- **Port**: Bound to `3000` (required for container ingress).
- **Core Endpoints**:
  - `/api/health`, `/api/dev/status`, `/api/dev/restart`: Diagnostics & environment synchronization.
  - `/api/gemini/*`: Server-side proxy for Gemini 2.5/3.0/3.7 models with thinking budget controls.
  - `/api/gemini/multimodal/*`: Text-to-Image (Imagen 3), Music/Speech, and Video synthesis.
  - `/api/steward/*`: Autonomous Stewardship Agent workflows (GCP Swarm / AWS track integrations).
  - `/api/audit/*`: Cryptographic immutability and provenance tracking.
  - `/ws/live`: Native bidirectional WebSocket proxy to the Gemini Live Multimodal API (`models/gemini-3.1-flash-live-preview`).

---

## 2. Existing Data Models & Entities (Firestore + In-Memory)

1. **User Profile (`UserProfileDoc`)**:
   - `uid`, `displayName`, `email`, `role`, `stewardshipTier`, `moralAlignmentScore`, `settings`.
2. **Covenant & Moral Ledger (`MoralLedgerEntry`)**:
   - `id`, `covenantPrinciple` (Creation, Liberation, Holiness, Remembrance, Wisdom, Justice, Dignity, Community, Faithfulness, Renewal), `score`, `timestamp`, `evidenceHash`.
3. **Evidence & Provenance (`EvidenceRecord`)**:
   - `source`, `timestamp`, `methodology`, `confidenceLevel`, `transformationHistory`, `reviewer`.
4. **Systems Dynamics & Causal Graphs**:
   - `nodes` (stocks/flows), `edges` (causal loops), `feedbackDelays`, `simulationState`.
5. **Node & Regional Ground Truth**:
   - `Nairobi Node`, `East Africa Node`, `Kibera Node`, `IoT sensory mesh data`.

---

## 3. The 10 Atlas Covenant Principles

1. **Creation (Genesis)**: Cultivating and stewarding resources rather than extraction.
2. **Liberation (Exodus)**: Technology that increases human agency and breaks systemic lock-in.
3. **Holiness (Leviticus)**: Establishing ethical boundaries on AI, capital, and data.
4. **Remembrance (Deuteronomy)**: Preserving institutional memory across generations.
5. **Wisdom (Proverbs)**: Distinguishing Data → Information → Knowledge → Intelligence → Wisdom.
6. **Justice (The Prophets)**: Making systemic harms visible and protecting the vulnerable.
7. **Dignity (The Gospels)**: Human beings are never inputs to optimize (Human > Automation).
8. **Community (Acts)**: Multi-stakeholder coordination (People + Capital + Knowledge + Technology).
9. **Faithfulness (Epistles)**: Long-term institutional trust and continuity.
10. **Renewal (Revelation)**: Directing technology toward flourishing civilizational destinations.

---

## 4. Platform Evolution & Roadmap

### Phase 1: Foundation (Stabilized)
- [x] Resilient dev server & synchronization diagnostics.
- [x] Responsive navigation with relative units and mobile drawer.
- [x] Safe Global Error Boundary defaulting to home landing screen.
- [x] Firebase authentication mutex locks & error suppression.

### Phase 2: Core Intelligence & Observatory
- [x] Server-side Gemini 3.7 reasoning & Live Voice API.
- [x] Planetary Health Observatory & Regional Nodes.
- [x] Causal Systems Dynamics stock-flow simulator.

### Phase 3: Civilizational Diagnosis & Studio
- [x] Decision Room (War Room) for multi-stakeholder policy modeling.
- [x] AI Engineering Studio with Multimodal generation tools.
- [x] Regenerative Value Exchange (RVE) & Evidence Ledger.

---

*Atlas Sanctum Architecture — Verified 2026*
