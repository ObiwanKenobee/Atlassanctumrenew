# ATLAS STEWARD
### Autonomous Community Operations Agent for Essential Services Reliability
**AWS Agents for Humans Hackathon 2026 — Track: Good Neighbor Agents**

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Framework](https://img.shields.io/badge/Framework-Strands%20Agents%20SDK-emerald.svg)](https://strands.ai)
[![Cloud](https://img.shields.io/badge/Cloud-Amazon%20Bedrock%20%26%20AgentCore-blue.svg)](https://aws.amazon.com/bedrock/)
[![Track](https://img.shields.io/badge/Track-Good%20Neighbor%20Agents-purple.svg)](#)

---

## 🌟 The Core Mission & Problem

Community organizations, municipal water boards, disaster resilience clusters, and neighborhood co-ops lose enormous amounts of human attention coordinating small, repetitive operational tasks:

- 🚰 **Water Logistics & Pressure Balancing**
- 🛠️ **Routine Maintenance & Sensor Calibrations**
- 📦 **Inventory Reorders & Parts Buffering**
- 📋 **Supplier Follow-ups & Quote Inquiries**
- 👷 **Technician Shift Scheduling & Checklists**
- 📢 **Community Transparency Broadcasts**

These tasks are individually routine, but collectively they overwhelm community operators—leading to cognitive burnout, deferred maintenance, and catastrophic infrastructure failures.

**Atlas Steward** flips this paradigm. Given a durable high-level objective:

> *"Keep all community water points operational this week. Handle routine coordination automatically and only interrupt me when a meaningful decision requires my approval."*

Atlas Steward silently handles routine coordination in the background and only escalates when a decision exceeds its pre-authorized boundary.

---

## 🎯 The Core User

**The Community Operator**: A local steward responsible for maintaining life-critical essential services (water, sanitation, energy, food logistics) for a community of 12,000+ residents.

Instead of staring at dozens of complex dashboards or managing messy WhatsApp groups, the operator interacts with an **Exception-First Cockpit** that values human attention as the rarest resource.

---

## 🏗️ Multi-Agent Architecture (Strands + Amazon Bedrock)

Atlas Steward is built on the **Strands Agents SDK** and **Amazon Bedrock AgentCore**, deploying four specialized autonomous agents orchestrated by a deterministic priority-floor controller:

```
                          ┌─────────────────────────────────────────┐
                          │         HUMAN COMMUNITY OPERATOR        │
                          │        (Durable Outcome Objective)       │
                          └────────────────────┬────────────────────┘
                                               │
                                               ▼
                          ┌─────────────────────────────────────────┐
                          │              STEWARD AGENT              │
                          │   (Coordinator / Priority Floor Guardian)│
                          └────┬───────────────┬────────────────┬───┘
                               │               │                │
             ┌─────────────────┴─┐       ┌─────┴──────────┐   ┌─┴────────────────┐
             │  OPERATIONS AGENT │       │ RESOURCE AGENT │   │    RISK AGENT    │
             │(Dispatch/Telemetry│       │(Inventory/Quote│   │(Safety Invariants│
             │   & Verification) │       │ & Supplier SLA)│   │& Blast Radius)   │
             └─────────┬─────────┘       └─────┬──────────┘   └──┬───────────────┘
                       │                       │                 │
                       ▼                       ▼                 ▼
          ┌───────────────────────────────────────────────────────────────┐
          │             SAFE, TYPED STRANDS TOOLS REGISTRY                │
          │ get_water_status · get_asset_status · get_inventory ·         │
          │ create_work_order · request_quote · verify_completion ...     │
          └───────────────────────────────┬───────────────────────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │    STRANDS PERSISTENT MEMORY BANK     │
                      │  (DynamoDB / Bedrock Memory Store)    │
                      └───────────────────────────────────────┘
```

---

## ⚡ The Hero Scenario: 100% Deterministic Demo

1. **Initial State**: 12 water assets, 18 background routine coordination tasks (pressure balancing, chlorine buffering, inverter checks, shift assignments) executing autonomously.
2. **Anomaly Detected**: Borehole Well 03 (serving 3,200 residents) detects abnormal bearing vibration (6.8 mm/s vs 2.5 mm/s normal) and a 28% water yield drop.
3. **Memory Retrieval**: The Steward Agent queries Strands Memory, retrieving past incident `MEM-2025-0812` (impeller cavitation on sandstone aquifer).
4. **Pre-Approved Supplier Match**: Resource Agent requests quote `QT-94021` from pre-approved specialist *Rift Valley Precision Hydro* ($1,420 for heavy-duty tungsten-carbide mechanical seal overhaul).
5. **Autonomy Policy Gateway**: Spend of $1,420 exceeds the $500 autonomous threshold (`POL-03-SPEND-THRESHOLD`).
6. **Exception Escalation**: Atlas Steward pauses and presents a clean decision card in the cockpit:
   - **What Happened** + **Why It Matters**
   - **Grounded Evidence Layer** (`[OBSERVED]`, `[MODELED]`, `[ESTIMATED]`)
   - **Policy Threshold Triggered**
   - **Options Matrix** + **Recommended Action**
   - **Consequences If Ignored**
7. **Human Approval**: Operator clicks **APPROVE** (or **MODIFY** / **REJECT** / **PAUSE**).
8. **Execution & Physical Verification**: Work order `WO-88219` is dispatched, physical vibration drops to 1.4 mm/s, flow restores to 24.8 L/s, and water reliability rises to 98.4%.
9. **Visible Learning Loop**: Newly verified lesson `MEM-2026` is anchored into Strands Memory to compound future decision accuracy.

---

## 📊 The "Priority Floor" Concept

Atlas Steward measures system performance against the **Atlas Priority Floor**—the minimum baseline of vital human needs:

| Dimension | Primary Metric | Baseline Target | Status in Demo |
| :--- | :--- | :--- | :--- |
| **Water** | Potable delivery & pressure reliability | ≥ 95.0% | **94.8% → 98.4% (Verified)** |
| **Sanitation** | Safe blackwater treatment & dosing | ≥ 90.0% | **97.4% (Nominal)** |
| **Energy** | Pumping solar microgrid uptime | ≥ 92.0% | **98.2% (Nominal)** |
| **Food** | Community kitchen & grain milling logistics | ≥ 90.0% | **96.0% (Nominal)** |
| **Shelter** | Habitation thermal & storm drainage | ≥ 95.0% | **99.1% (Nominal)** |
| **Connectivity** | Mesh telemetry & radio uptime | ≥ 95.0% | **99.5% (Nominal)** |

---

## 🚀 Quickstart & Reproduction

### Prerequisites
- Node.js 18+ / npm

### Installation & Run
```bash
# 1. Clone repository
git clone https://github.com/atlas-sanctum/atlas-steward.git
cd atlas-steward

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with the live Atlas Steward Cockpit.

---

## 📚 Complete Documentation Suite

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — Multi-agent system topology, AWS services, and state orchestration.
- [`AGENT_DESIGN.md`](AGENT_DESIGN.md) — Roles, system prompts, reasoning loops, and epistemic claims for all 4 agents.
- [`TOOLS.md`](TOOLS.md) — Detailed schemas, authorization boundaries, and idempotency guarantees for all 13 tools.
- [`SAFETY.md`](SAFETY.md) — 4 Autonomy levels, spend limits, essential service invariants, and human-in-the-loop safeguards.
- [`MEMORY.md`](MEMORY.md) — Strands memory architecture, DynamoDB schema, and the visible learning loop.
- [`DEMO.md`](DEMO.md) — Step-by-step walkthrough script and 5-minute video presentation guide.
- [`LICENSE`](LICENSE) — Open source MIT License.

---

## 🛡️ License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more details.
