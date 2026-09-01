# ATLAS STEWARD: TECHNICAL ARCHITECTURE
**AWS Agents for Humans Hackathon 2026 — Track: Good Neighbor Agents**

---

## 1. Architectural Philosophy: Outcome-First Autonomy

Conventional community management software forces operators to act as manual routers: checking telemetry dashboards, copying numbers into spreadsheets, calling contractors, and drafting notices.

Atlas Steward replaces manual routing with a closed-loop autonomous system:

```
[DURABLE OBJECTIVE] → [AUTONOMOUS ROUTINE WORK] → [EXCEPTION DETECTED]
        ↑                                                     ↓
  [LEARNING LOOP] ← [PHYSICAL VERIFICATION] ← [HUMAN JUDGMENT & APPROVAL]
```

---

## 2. Multi-Agent Hierarchy (Strands Agents SDK)

The system deploys 4 specialized agents utilizing the **Strands Agents SDK** patterns:

```
                                  ┌────────────────────────┐
                                  │      STEWARD AGENT     │
                                  │ (Primary Orchestrator) │
                                  └───────────┬────────────┘
                                              │
                      ┌───────────────────────┼───────────────────────┐
                      ▼                       ▼                       ▼
           ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
           │   OPERATIONS AGENT  │ │   RESOURCE AGENT    │ │     RISK AGENT      │
           │  Telemetry, Shifts, │ │ Inventory, Vendors, │ │  Safety Invariants, │
           │  Work Order Dispatch│ │ Quotes, Reorders    │ │  Blast Radius & Pol │
           └─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

### Agent Roles & Responsibilities

1. **Steward Agent (Coordinator & Priority Floor Guardian)**
   - Translates human durable objectives into discrete task queues.
   - Monitors macro community metrics across the Priority Floor (Water, Sanitation, Energy, Food, Shelter, Connectivity).
   - Enforces human boundary gating; halts execution when policy limits are exceeded.

2. **Operations Agent (Field & Infrastructure Specialist)**
   - Monitors IoT telemetry streams (pressure transducers, flow meters, tri-axial accelerometers).
   - Generates and schedules routine inspection tasks, filter backwashes, and chlorine dosing.
   - Dispatches certified technicians and performs post-action physical verification.

3. **Resource Agent (Supply Chain & Vendor Matchmaker)**
   - Tracks consumable inventory levels against dynamic reorder thresholds.
   - Maintains relationships with pre-approved local service providers and verified licenses.
   - Negotiates and structures formal quotes with clear parts/labor breakdowns and SLAs.

4. **Risk Agent (Safety Invariants & Policy Evaluator)**
   - Computes quantitative blast radius (downtime hours, population affected, financial exposure).
   - Validates actions against statutory environmental laws and community safety policies.
   - Guarantees fail-safe postures and blocks unauthorized destructive commands.

---

## 3. AWS Cloud Services Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │             AMAZON BEDROCK                   │
                               │  - Reasoning Engine (Claude 3.5 / Nova Pro)  │
                               │  - Embeddings (Titan Multimodal G1)          │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                                      ▼
 ┌──────────────────────┐      ┌──────────────────────────────────────────────┐      ┌──────────────────────┐
 │    AWS EVENTBRIDGE   │ ───► │          AMAZON BEDROCK AGENTCORE            │ ───► │     AWS CLOUDWATCH   │
 │ - Scheduled 15m Loop │      │  - Strands Agent Orchestration Runtime       │      │ - Telemetry Alarms   │
 │ - IoT Telemetry Hook │      │  - Tool Gateway & Input Validation           │      │ - Tool Latency Logs  │
 └──────────────────────┘      └──────────────────────┬───────────────────────┘      └──────────────────────┘
                                                      │
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │           AWS LAMBDA TOOL WORKERS            │
                               │  - get_water_status    · create_work_order   │
                               │  - request_quote       · verify_completion   │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │          DYNAMODB & S3 PERSISTENCE           │
                               │  - atlas-steward-assets (Telemetry & State)  │
                               │  - atlas-steward-memory (Lessons & Patterns) │
                               │  - atlas-steward-audit  (Cryptographic Logs) │
                               └──────────────────────────────────────────────┘
```

### AWS Component Mapping

- **Amazon Bedrock**: Serves as the cognitive reasoning backbone, converting ambiguous community situations into structured action plans and trade-off options.
- **Amazon Bedrock AgentCore**: Hosts the Strands agent runtimes, managing session continuity, tool dispatch gateways, and secure credential isolation.
- **AWS Lambda**: Executes isolated, typed tools with strict schema validation and microsecond cold starts.
- **Amazon DynamoDB**: Provides single-digit millisecond key-value storage for asset telemetry, work orders, inventory SKUs, and the persistent memory bank.
- **Amazon EventBridge**: Triggers periodic 15-minute autonomous coordination cycles and routes asynchronous IoT threshold alerts.
- **Amazon CloudWatch**: Records tool invocation latencies, failure rates, epistemic confidence metrics, and audit logs.
- **Amazon S3**: Stores long-term historical calibration certificates, water quality lab reports, and vendor contracts.

---

## 4. Deterministic State Machine & Safe Tool Boundary

Every tool invocation in Atlas Steward passes through a 5-stage deterministic validation pipeline:

```
[Tool Call Requested]
         │
         ▼
[1. Input Schema Validation (Zod / JSON Schema)]
         │
         ▼
[2. Autonomy Level & Spend Gateway Check]
         │
         ├─── If Spend > $500 or Major Outage ──► [ESCALATE TO HUMAN COCKPIT]
         │
         ▼
[3. Idempotent Execution in AWS Lambda]
         │
         ▼
[4. Telemetry Mutation & State Sync]
         │
         ▼
[5. Cryptographic Audit Log Emitted to DynamoDB/CloudWatch]
```
