import { FailureLedgerEntry } from '../types';

export const FAILURE_LEDGER_ENTRIES: FailureLedgerEntry[] = [
  {
    id: 'FL-2025-001',
    projectName: 'Sahel Green Barrier: Fast-Growth Acacia Inoculation',
    bioregion: 'Western Sahel (Senegal-Mali Corridor)',
    dateInitiated: '2024-03-15',
    dateConcludedOrPivoted: '2025-01-20',
    coreHypothesis: 'Single-species accelerated mycorrhizal Acacia senegal planting would establish 40% ground canopy within 10 months and halt topsoil desiccation.',
    implementationDetails: 'Planted 120,000 seedlings using automated drone dispersion and localized water-retention hydrogels without prior perennial shrub understory stratification.',
    failureCategory: 'biophysical_mismatch',
    severityTier: 'high',
    failureModes: [
      'Unprecedented 4-week dry spell exceeded hydrogel moisture buffer, causing 64% seedling mortality.',
      'Mono-species canopy lacked taproot depth variety, inducing shallow soil compaction.',
      'Drone dispersion omitted micro-topographical swale anchoring.'
    ],
    unintendedConsequences: [
      'Decomposing failed saplings temporarily increased localized termite surface swarming.',
      'Community pastoralists lost 85 hectares of traditional dry-season grazing buffer during fenced trial.'
    ],
    affectedStakeholders: [
      'Fulani pastoralist cooperative (340 herders)',
      'Department of Forestry Regional Field Station',
      'Youth Agro-Guild Technicians (28 trainees)'
    ],
    correctiveActionsTaken: [
      'Transitioned to 7-layer polyculture guild (Acacia, Balanites aegyptiaca, Ziziphus, and native perennial Cenchrus grasses).',
      'Instituted traditional Zaï pit and stone bund water-harvesting civil works before biological introduction.',
      'Restructured 100% of governance to co-design grazing migration corridors with pastoral elders.'
    ],
    epistemicLessonsLearned: 'Nature does not tolerate monocultural acceleration. Fast-growth mono-species tree planting without prior topographical hydration and polycultural succession violates biophysical resilience laws. Machine speed cannot bypass ecological gestation.',
    covenantCommandmentReferenced: 'Commandment II: Reality Above Model & Commandment XXIII: The Failure Ledger',
    auditedBy: 'Dr. Aminata Diallo, Ecological Synthesis Group',
    verificationHash: '0x8f92a4e7bc11904a62d083e91c784910ef3381a9420b57112ea09c5d19bf9810',
    status: 'codified_in_canon'
  },
  {
    id: 'FL-2025-002',
    projectName: 'Upper Tana River Tokenized Dynamic Water Rights',
    bioregion: 'Upper Tana Basin, Kenya',
    dateInitiated: '2024-06-01',
    dateConcludedOrPivoted: '2024-11-15',
    coreHypothesis: 'Algorithmic dynamic pricing and automated micro-token distribution for irrigation would incentivize downstream conservation and eliminate water hoarding.',
    implementationDetails: 'Deployed smart contract flow meters on 45 horticultural farm extraction gates, adjusting extraction allowance every 6 hours based on river telemetry.',
    failureCategory: 'economic_misalignment',
    severityTier: 'civilizational_critical',
    failureModes: [
      'Large industrial export farms bought up speculative surplus tokens, artificially pricing out smallholder subsistence farmers during dry cycles.',
      'Smart meter cellular telemetry suffered periodic edge gateway blackouts, misreporting compliance penalties to smallholders.',
      'Created financial incentive to pump during unmetered night hours.'
    ],
    unintendedConsequences: [
      'Upstream-downstream social friction escalated into valve tampering and physical dispute.',
      'Sub-floor household water availability dropped 22% among non-commercial women farmers.'
    ],
    affectedStakeholders: [
      'Smallholder Farmers Association (1,850 households)',
      'Upper Tana Catchment Water Users Association',
      'Downstream Delta Fisherfolk'
    ],
    correctiveActionsTaken: [
      'Immediate decommission of algorithmic spot-pricing of water rights.',
      'Replaced with inviolable Universal Priority Floor: Free, guaranteed ecological reserve and household human right allocations before any commercial quota can exist.',
      'Decentralized physical weir overflow systems that do not rely on digital token markets.'
    ],
    epistemicLessonsLearned: 'Vital survival resources (water, breathable air, basic caloric minimums) must NEVER be subjected to speculative market pricing or algorithmic bidding. The Priority Floor is non-negotiable; economic efficiency cannot precede moral baseline survival.',
    covenantCommandmentReferenced: 'Commandment I: The Priority Floor Axiom & Commandment XXI: Non-Extractive Capital',
    auditedBy: 'Wanjiku Mwangi, Catchment Ethics Tribunal',
    verificationHash: '0x43a8710bcf9e2481099231846b010c99a8427e1f409581726a45b78024ce3129',
    status: 'codified_in_canon'
  },
  {
    id: 'FL-2025-003',
    projectName: 'Andean High-Altitude Micro-Wind Turbine Grid',
    bioregion: 'Altiplano Northern Basin, Peru/Bolivia',
    dateInitiated: '2024-01-10',
    dateConcludedOrPivoted: '2024-08-30',
    coreHypothesis: 'Composite carbon-fiber 3kW micro-wind turbines would provide 24/7 autonomous off-grid renewable energy for remote alpaca shearing and cold storage.',
    implementationDetails: 'Installed 36 imported micro-turbines across 6 indigenous highland ayllus at 4,100m elevation.',
    failureCategory: 'tech_overpromise',
    severityTier: 'moderate',
    failureModes: [
      'High-altitude katabatic wind shear and freezing rime ice caused mechanical rotor imbalance in 22 of 36 units.',
      'Proprietary electronic inverter units required specialized digital diagnostic keys not available to local community technicians.',
      'Supplier replacement lead times exceeded 9 months via international maritime freight.'
    ],
    unintendedConsequences: [
      'Unusable fiberglass structures generated aesthetic and grazing land disruption.',
      'Erosion of community trust in external renewable technology consortia.'
    ],
    affectedStakeholders: [
      '6 Quechua Pastoral Ayllus (480 families)',
      'Regional Renewable Energy Field Lab',
      'Local Artisan Weavers Guild'
    ],
    correctiveActionsTaken: [
      'Dismantled failing proprietary units and repurposed towers for locally repairable solar-thermal ground arrays.',
      'Established open-source hardware fabrication curriculum in regional vocational center using locally cast recycled aluminum and standard automotive bearings.',
      'Mandated that no hardware may be deployed without 100% open schematics and locally manufacturable replacement parts.'
    ],
    epistemicLessonsLearned: 'Technological appropriateness is defined by local reparability and supply autonomy, not lab-rated efficiency. High-tech proprietary black boxes create fragility and colonial dependency. Open-source local fabrication is a prerequisite for regenerative resilience.',
    covenantCommandmentReferenced: 'Commandment XV: The Open Commons & Commandment VIII: Local Value Sovereignty',
    auditedBy: 'Ing. Mateo Quispe & Ayllu Council Elders',
    verificationHash: '0x71b938210fe9941a87754b2019485cc401928371904a8b72635489102cba3912',
    status: 'analyzed'
  },
  {
    id: 'FL-2025-004',
    projectName: 'Salish Sea Intertidal Bio-Rock Accretion Reef',
    bioregion: 'Salish Sea Coastal Watershed (Pacific Northwest)',
    dateInitiated: '2024-04-12',
    dateConcludedOrPivoted: '2025-02-10',
    coreHypothesis: 'Low-voltage direct current mineral accretion (Biorock) on submerged steel mesh would accelerate native Olympia oyster (Ostrea lurida) settlement by 300%.',
    implementationDetails: 'Submerged 18 electrified cathodic mesh structures powered by tidal generator prototypes.',
    failureCategory: 'unintended_feedback',
    severityTier: 'moderate',
    failureModes: [
      'Electrochemical mineral crust attracted opportunistic non-native colonial tunicates (Didemnum vexillum) which out-competed native oyster spat.',
      'Tidal turbine harmonic underwater acoustics disturbed nearshore juvenile salmon migration holding pools.'
    ],
    unintendedConsequences: [
      'Localized reduction in native macro-algae kelp canopy attachment points.',
      'Intermittent low-frequency electromagnetic pulse affected benthic crab navigation in a 50m perimeter.'
    ],
    affectedStakeholders: [
      'Coast Salish Tribal Fisheries Stewards',
      'Marine Biology Field Station',
      'Commercial Shellfish Restoration Alliance'
    ],
    correctiveActionsTaken: [
      'De-energized cathodic electrical feed and repurposed substrates into passive calcium carbonate shell-reef matrix seeded with tribal ceremonial oyster stock.',
      'Relocated tidal generator to offshore deep channel outside juvenile salmon migration corridors.',
      'Formally incorporated Indigenous Kincentric Marine Taxonomy into all future habitat engineering models.'
    ],
    epistemicLessonsLearned: 'Accelerating one chemical reaction in complex marine biosystems frequently triggers non-linear trophic cascades. Technological intervention must synchronize with natural seasonal and acoustic rhythms rather than forcing rapid artificial accretion.',
    covenantCommandmentReferenced: 'Commandment III: Seven-Generation Horizon & Commandment XII: Kincentric Ecology',
    auditedBy: 'Dr. Sarah Kelly & Tribal Natural Resources Council',
    verificationHash: '0x99201a4e76110f8234719bbca098234190872615438902198471203948571029',
    status: 'mitigated'
  }
];
