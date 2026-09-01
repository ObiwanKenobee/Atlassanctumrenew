# ATLAS STEWARD: DEMO WALKTHROUGH & VIDEO SCRIPT
**AWS Agents for Humans Hackathon 2026 — Track: Good Neighbor Agents**

---

## 🎬 5-Minute Video Presentation Structure

```
0:00 – 0:30 │ The Problem: Community operator cognitive overload & service downtime
0:30 – 1:00 │ The Solution: Atlas Steward — Exception-First Community Operations Agent
1:00 – 2:45 │ Live Agent Demonstration: 18 Routine tasks silent handling + Borehole 03 Anomaly
2:45 – 3:30 │ Human Decision & Safety Policy: Approving the $1,420 Tungsten Seal Overhaul
3:30 – 4:15 │ Technical Architecture: Amazon Bedrock, Strands Agents SDK & AgentCore
4:15 – 4:45 │ Continuous Learning & Memory: Visible loop from MEM-2025 to MEM-2026
4:45 – 5:00 │ Impact & Vision: Expanding to Sanitation, Energy & Food Logistics
```

---

## 📋 Step-by-Step Live Demo Execution

### Step 1: Initialize the Cockpit
- Launch the application (`npm run dev` or navigate to the web preview).
- Observe the **Durable Objective** at the top:
  > *"Keep all community water points operational this week. Handle routine coordination automatically and only interrupt me when a meaningful decision requires my approval."*
- Notice the **Routine Work Summary**: 18 tasks executed automatically in the background (chlorine buffering, sensor calibrations, inverter checks).
- Notice the **Priority Floor**: Water reliability is currently degraded at **94.8%**.

### Step 2: Review the Escalated Decision
- Navigate to the **"Decisions For You"** card.
- Review **What Happened**: Borehole Well 03 vibration surged to 6.82 mm/s and water delivery dropped 28%.
- Review the **Evidence Layer**: Direct Modbus telemetry (`[OBSERVED]`), hydrodynamic silt modeling (`[MODELED]`), and contractor quote (`[ESTIMATED]`).
- Review the **Policy Boundary**: Spend of $1,420 exceeds the $500 auto-approval threshold (`POL-03-SPEND-THRESHOLD`).

### Step 3: Approve & Observe Verified Execution
- Click **"Approve Recommended Action ($1,420)"**.
- Observe the real-time agent execution stream:
  1. Work order `WO-88219` is dispatched to *Rift Valley Precision Hydro*.
  2. Post-action physical verification confirms vibration dropped to **1.4 mm/s** and flow rate restored to **24.8 L/s**.
  3. Priority Floor water reliability jumps from **94.8% → 98.4%**.
  4. Operational lesson `MEM-2026` is anchored into Strands Memory.

### Step 4: Inspect Memory & Learning Loop
- Click on the **"Strands Memory & Learning Loop"** tab.
- Inspect how the agent used lesson `MEM-2025-0812` to recommend the correct tungsten-carbide seal instead of a standard failing gasket.

### Step 5: Demo Reset
- Click the **"Reset Demo"** button in the header at any time to return to the initial state for clean, repeatable demonstrations.
