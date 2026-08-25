/**
 * ATLAS GOVERNANCE SDK — Constitutional Axioms, Priority Floor Rules & API Schemas
 */

export interface PriorityFloorAxiom {
  id: string;
  code: string;
  name: string;
  constitutionalTier: 'absolute_floor' | 'planetary_ceiling' | 'sovereign_right' | 'epistemic_mandate';
  summary: string;
  rationale: string;
  minimumThreshold: string;
  violationCondition: string;
  programmaticRule: string;
  enforcementAction: 'AUTOMATIC_REJECTION' | 'HALT_CAPITAL_DISBURSEMENT' | 'MANDATORY_ELDER_COUNCIL_REVIEW' | 'FLAG_FOR_FORENSIC_AUDIT';
  sampleEvaluationParam: string;
}

export const PRIORITY_FLOOR_AXIOMS: PriorityFloorAxiom[] = [
  {
    id: 'axiom-01-human-dignity',
    code: 'AXIOM_HUMAN_DIGNITY_NON_COMMODIFIABLE',
    name: 'Human Dignity & Agency Floor',
    constitutionalTier: 'absolute_floor',
    summary: 'Prohibits any algorithmic, financial, or automated system from reducing human labor or life to mere fungible optimization variables.',
    rationale: 'Civilization systems must protect baseline human agency, safe living wages, and non-exploitative labor conditions as inviolable constraints.',
    minimumThreshold: 'Living wage >= 220% local poverty baseline; Zero forced displacement; Informed consent from 100% affected households.',
    violationCondition: 'Displacement of indigenous communities without free, prior, and informed consent (FPIC) or sub-living wage compensation.',
    programmaticRule: 'if (proposal.communityDisplacementRisk > 0 || proposal.laborWageIndex < 2.2) return REJECT;',
    enforcementAction: 'AUTOMATIC_REJECTION',
    sampleEvaluationParam: 'communityConsentScore: 100, minimumWageMultiplier: 2.4'
  },
  {
    id: 'axiom-02-biophysical-floor',
    code: 'AXIOM_BIOPHYSICAL_RESERVE_FLOOR',
    name: 'Biophysical Carrying Capacity & Ecological Integrity',
    constitutionalTier: 'planetary_ceiling',
    summary: 'Requires interventions to preserve minimum ecological recharge rates for soil, aquifers, biodiversity corridors, and canopy cover.',
    rationale: 'Capital extraction must never exceed the regenerative threshold of the local watershed or biome.',
    minimumThreshold: 'Net positive ecological delta (> +15% biodiversity net gain over 36 months); Groundwater extraction <= 40% sustainable recharge.',
    violationCondition: 'Net deforestation, aquifer drawdown exceeding recharge rates, or soil organic carbon depletion.',
    programmaticRule: 'if (proposal.netCarbonFlux < 0 || proposal.aquiferDrawdownRate > 0.40) return HALT_CAPITAL_DISBURSEMENT;',
    enforcementAction: 'HALT_CAPITAL_DISBURSEMENT',
    sampleEvaluationParam: 'netBiodiversityGainDelta: 0.18, aquiferDrawdownRatio: 0.28'
  },
  {
    id: 'axiom-03-sabbath-rest',
    code: 'AXIOM_SABBATH_REST_DE_ESCALATION',
    name: 'Sabbath Rhythm & Systemic De-Escalation',
    constitutionalTier: 'sovereign_right',
    summary: 'Mandates cyclic periods of structural rest, telemetry throttling, and anti-addictive pause states for human stewards and machines.',
    rationale: 'Perpetual acceleration leads to cognitive depletion and ecological burnout. Deliberate stillness preserves contemplative wisdom.',
    minimumThreshold: '1 day in 7 of non-commercial rhythm; Zero high-frequency trading or notification spam during designated rest windows.',
    violationCondition: '24/7 hyper-financialized milestone pressure without compensatory restoration rest buffers.',
    programmaticRule: 'if (proposal.operationalSchedule.restBufferDaysPerMonth < 4) return MANDATORY_ELDER_COUNCIL_REVIEW;',
    enforcementAction: 'MANDATORY_ELDER_COUNCIL_REVIEW',
    sampleEvaluationParam: 'restScheduleCompliance: 1.0, restBufferDaysPerMonth: 4'
  },
  {
    id: 'axiom-04-biocultural-sovereignty',
    code: 'AXIOM_BIOCULTURAL_SOVEREIGNTY',
    name: 'Indigenous & Biocultural Sovereignty',
    constitutionalTier: 'absolute_floor',
    summary: 'Protects ancestral knowledge, customary tenure, seed sovereignty, and local community governance autonomy.',
    rationale: 'Local custodians possess centuries of ecological co-evolution. External capital must submit to bioregional community covenants.',
    minimumThreshold: 'Customary tenure recognition >= 100%; Community equity dividend reserve >= 25% of gross ecosystem revenues.',
    violationCondition: 'Patenting native germplasm or unilateral tokenization of indigenous sacred lands without council covenant.',
    programmaticRule: 'if (proposal.localEquityReserveRatio < 0.25 || proposal.seedPatentingClaim === true) return AUTOMATIC_REJECTION;',
    enforcementAction: 'AUTOMATIC_REJECTION',
    sampleEvaluationParam: 'localEquityReserveRatio: 0.30, indigenousCouncilSignOff: true'
  },
  {
    id: 'axiom-05-epistemic-humility',
    code: 'AXIOM_EPISTEMIC_HUMILITY_UNCERTAINTY',
    name: 'Epistemic Humility & Provenance Transparency',
    constitutionalTier: 'epistemic_mandate',
    summary: 'Requires full visibility of modeled vs. verified telemetry and mandates public recording of failure incidents in the Failure Ledger.',
    rationale: 'Overconfidence in uncalibrated simulations causes systemic collapse. True governance embraces the visible boundary of what is unknown.',
    minimumThreshold: 'All claims must state epistemic class (Verified/Modeled/Estimated) and margin of error; 100% failure post-mortems public.',
    violationCondition: 'Concealing telemetry anomalies, misrepresenting simulated forecasts as empirical ground-truth, or hiding project failures.',
    programmaticRule: 'if (proposal.provenanceClassification === "UNVERIFIED_CLAIM_AS_FACT") return FLAG_FOR_FORENSIC_AUDIT;',
    enforcementAction: 'FLAG_FOR_FORENSIC_AUDIT',
    sampleEvaluationParam: 'epistemicDisclosureVerified: true, failureAuditEnrolled: true'
  },
  {
    id: 'axiom-06-anti-extractive-distribution',
    code: 'AXIOM_ANTI_EXTRACTIVE_REDISTRIBUTION',
    name: 'Anti-Extractive Wealth & Value Circulation',
    constitutionalTier: 'planetary_ceiling',
    summary: 'Prevents colonial siphonage of bioregional value, capping external investor returns and directing surplus into community commons.',
    rationale: 'Regenerative finance must circulate value within the living ecosystem rather than concentrating it in distant financial centers.',
    minimumThreshold: 'Maximum external IRR capped at 12% annual; At least 40% net economic value retained within the watershed radius.',
    violationCondition: 'Predatory interest rates, external equity drain exceeding 60%, or speculative land flipping.',
    programmaticRule: 'if (proposal.externalInvestorIRR > 0.12 || proposal.localRetentionRatio < 0.40) return HALT_CAPITAL_DISBURSEMENT;',
    enforcementAction: 'HALT_CAPITAL_DISBURSEMENT',
    sampleEvaluationParam: 'externalInvestorIRR: 0.085, localRetentionRatio: 0.52'
  }
];

export interface SdkEndpointDoc {
  id: string;
  method: 'GET' | 'POST' | 'PUT';
  path: string;
  title: string;
  description: string;
  authRequired: boolean;
  requestBodySchema?: string;
  responseSchema: string;
  sampleCurl: string;
  sampleTypescript: string;
  samplePython: string;
}

export const GOVERNANCE_SDK_ENDPOINTS: SdkEndpointDoc[] = [
  {
    id: 'get-priority-floors',
    method: 'GET',
    path: '/api/v1/governance/priority-floors',
    title: 'Query Constitutional Priority Floors',
    description: 'Retrieve the active constitutional priority floor axioms, threshold values, and biophysical constraints for a given bioregion.',
    authRequired: false,
    responseSchema: `{
  "status": "success",
  "data": {
    "jurisdiction": "Bioregional Commons / Upper Athi Catchment",
    "canonVersion": "2026.4.1",
    "activeAxiomsCount": 6,
    "priorityFloors": [
      {
        "code": "AXIOM_HUMAN_DIGNITY_NON_COMMODIFIABLE",
        "threshold": "living_wage >= 2.2x local baseline",
        "enforcement": "AUTOMATIC_REJECTION"
      },
      {
        "code": "AXIOM_BIOPHYSICAL_RESERVE_FLOOR",
        "threshold": "aquifer_drawdown <= 40%",
        "enforcement": "HALT_CAPITAL_DISBURSEMENT"
      }
    ]
  }
}`,
    sampleCurl: `curl -X GET "https://api.atlassanctum.org/v1/governance/priority-floors?bioregion=upper-athi" \\
  -H "Accept: application/json"`,
    sampleTypescript: `import { AtlasGovernanceClient } from '@atlas-sanctum/governance-sdk';

const governance = new AtlasGovernanceClient({
  apiKey: process.env.ATLAS_API_KEY
});

const floors = await governance.getPriorityFloors({
  bioregion: 'upper-athi-catchment'
});

console.log('Active Priority Floors:', floors.data.activeAxiomsCount);`,
    samplePython: `from atlas_governance import AtlasGovernanceClient
import os

client = AtlasGovernanceClient(api_key=os.getenv("ATLAS_API_KEY"))

floors = client.get_priority_floors(bioregion="upper-athi-catchment")
print(f"Constitutional Canon Version: {floors['data']['canonVersion']}")`
  },
  {
    id: 'evaluate-proposal',
    method: 'POST',
    path: '/api/v1/governance/evaluate-compliance',
    title: 'Evaluate Project Compliance & Ethical Guardrails',
    description: 'Run automated formal verification on an incoming capital proposal, smart contract, or municipal infrastructure plan against the Priority Floor axioms.',
    authRequired: true,
    requestBodySchema: `{
  "projectId": "PRJ-MARA-AGRO-882",
  "projectTitle": "Mara Basin Agroforestry & Biochar Cluster",
  "bioregion": "Mara River Catchment",
  "capitalUSD": 1250000,
  "externalInvestorIRR": 0.085,
  "localEquityReserveRatio": 0.35,
  "aquiferDrawdownRate": 0.18,
  "communityConsentScore": 100,
  "restBufferDaysPerMonth": 4,
  "epistemicClass": "Observed"
}`,
    responseSchema: `{
  "status": "APPROVED_WITH_GUARDRAILS",
  "complianceScore": 96.4,
  "axiomsEvaluated": 6,
  "violationsCount": 0,
  "provenanceHash": "0x4f8b9e1c27a9d038e2195fbc9a8d41",
  "guardrails": [
    "Quarterly ground-truth piezometer audits required for aquifer monitoring.",
    "Community dividend distribution must be anchored via Failure Ledger multisig."
  ],
  "epistemicIntegrity": {
    "certaintyScore": 94,
    "confidenceLevel": "Level 1 • Verified Ground-Truth"
  }
}`,
    sampleCurl: `curl -X POST "https://api.atlassanctum.org/v1/governance/evaluate-compliance" \\
  -H "Authorization: Bearer atl_live_99841f3e2b" \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectId": "PRJ-MARA-AGRO-882",
    "capitalUSD": 1250000,
    "localEquityReserveRatio": 0.35,
    "aquiferDrawdownRate": 0.18
  }'`,
    sampleTypescript: `import { AtlasGovernanceClient } from '@atlas-sanctum/governance-sdk';

const governance = new AtlasGovernanceClient({
  apiKey: process.env.ATLAS_API_KEY
});

const evaluation = await governance.evaluateCompliance({
  projectId: 'PRJ-MARA-AGRO-882',
  capitalUSD: 1250000,
  localEquityReserveRatio: 0.35,
  aquiferDrawdownRate: 0.18,
  restBufferDaysPerMonth: 4
});

if (evaluation.status === 'APPROVED_WITH_GUARDRAILS') {
  console.log('Ethical Compliance Score:', evaluation.complianceScore);
}`,
    samplePython: `from atlas_governance import AtlasGovernanceClient

client = AtlasGovernanceClient(api_key="atl_live_key")

result = client.evaluate_compliance({
    "projectId": "PRJ-MARA-AGRO-882",
    "capitalUSD": 1250000,
    "localEquityReserveRatio": 0.35,
    "aquiferDrawdownRate": 0.18
})

print(f"Compliance Status: {result['status']}, Score: {result['complianceScore']}")`
  },
  {
    id: 'verify-cryptographic-proof',
    method: 'POST',
    path: '/api/v1/governance/verify-proof',
    title: 'Verify Zero-Knowledge Epistemic Proof',
    description: 'Verify that an ecological or financial claim has been cryptographically signed by accredited field elders and registered on the Failure / Evidence Ledger.',
    authRequired: false,
    requestBodySchema: `{
  "claimHash": "0x7f8a9b2c3d4e5f60718293a4b5c6d7e8",
  "merkleRoot": "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d",
  "expectedAxiom": "AXIOM_BIOPHYSICAL_RESERVE_FLOOR"
}`,
    responseSchema: `{
  "verified": true,
  "timestamp": "2026-08-24T10:45:00Z",
  "witnessNode": "node-kilifi-elder-mesh-04",
  "ledgerBlockHeight": 1489201,
  "confidenceScore": 98.2
}`,
    sampleCurl: `curl -X POST "https://api.atlassanctum.org/v1/governance/verify-proof" \\
  -H "Content-Type: application/json" \\
  -d '{
    "claimHash": "0x7f8a9b2c3d4e5f60718293a4b5c6d7e8",
    "expectedAxiom": "AXIOM_BIOPHYSICAL_RESERVE_FLOOR"
  }'`,
    sampleTypescript: `const proofResult = await governance.verifyProof({
  claimHash: '0x7f8a9b2c3d4e5f60718293a4b5c6d7e8',
  expectedAxiom: 'AXIOM_BIOPHYSICAL_RESERVE_FLOOR'
});

console.log('Proof Valid:', proofResult.verified);`,
    samplePython: `proof = client.verify_proof(
    claim_hash="0x7f8a9b2c3d4e5f60718293a4b5c6d7e8",
    expected_axiom="AXIOM_BIOPHYSICAL_RESERVE_FLOOR"
)
print("Proof Valid:", proof["verified"])`
  }
];
