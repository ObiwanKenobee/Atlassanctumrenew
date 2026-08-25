/**
 * ATLAS SANCTUM — THE 10 COMMANDMENTS OF CIVILIZATION ARCHITECTURE
 * Foundational ethical, ecological, epistemic, and governance covenants 
 * governing all systems, infrastructure, and capital models.
 */

export interface CivilizationCommandment {
  id: number;
  romanNumeral: string;
  title: string;
  shortMaxim: string;
  moralRoot: string;
  architecturalRule: string;
  systemEnforcement: string;
  biophysicalBoundary: string;
  violationTrigger: string;
  flourishingImpact: string;
  category: 'Human Dignity' | 'Capital & Usury' | 'Planetary Boundaries' | 'Epistemics & Commons' | 'Governance & Veto' | 'Labor & Sovereignty' | 'Intergenerational' | 'Causal Truth' | 'Anti-Fragility' | 'Universal Access';
  tags: string[];
}

export const ARCHITECTURAL_COMMANDMENTS: CivilizationCommandment[] = [
  {
    id: 1,
    romanNumeral: 'I',
    title: 'Inviolability of Human Dignity & Sovereign Agency',
    shortMaxim: 'Humans are sacred stewards, never extractive commodities.',
    moralRoot: 'Imago Dei & Radical Agency (Agape / Selfless Service)',
    architecturalRule: 'No system, data pipeline, AI model, or economic structure may reduce a human being to an extractive telemetry metric, behavioral ad-target, or passive dependent.',
    systemEnforcement: 'Zero-knowledge participant vaults; complete data self-sovereignty; zero dark patterns; explicit cryptographic consent before any telemetry aggregation.',
    biophysicalBoundary: 'Human neurological and cognitive sanity limits; protection against addictive algorithmic behavioral conditioning.',
    violationTrigger: 'Deployment of coercive engagement loops, surveillance monetization, or non-consensual biometric harvesting.',
    flourishingImpact: 'Preserves individual autonomy, moral agency, and communal trust across all technological interfaces.',
    category: 'Human Dignity',
    tags: ['Dignity', 'Agency', 'Zero-Knowledge', 'Privacy']
  },
  {
    id: 2,
    romanNumeral: 'II',
    title: 'Zero Usurious Compounding & Anti-Extractive Capital',
    shortMaxim: 'Capital must serve life, never compound endlessly at the expense of reality.',
    moralRoot: 'Jubilee Economics & Non-Extractive Righteousness',
    architecturalRule: 'Money is a coordination medium, not an autonomous predator. Capital structures that compound exponentially without corresponding biophysical value creation are strictly barred.',
    systemEnforcement: 'Regenerative Value Exchange (RVE) capped-return agreements; automated debt-jubilee triggers; revenue-sharing equity instruments in place of compound interest usury.',
    biophysicalBoundary: 'Thermodynamic reality: financial claims cannot grow faster than the regeneration rate of physical ecosystems.',
    violationTrigger: 'Introduction of compounding interest debt spirals, foreclosure on sovereign community commons, or predatory liquidity extraction.',
    flourishingImpact: 'Eliminates structural poverty cycles and unleashes multi-generational patient capital for durable civilizational works.',
    category: 'Capital & Usury',
    tags: ['Anti-Usury', 'Jubilee', 'Patient Capital', 'RVE']
  },
  {
    id: 3,
    romanNumeral: 'III',
    title: 'Biophysical Grounding & Planetary Boundary Inviolability',
    shortMaxim: 'Thermodynamics and ecology are hard laws; economics is a derivative.',
    moralRoot: 'Planetary Stewardship & Reverence for Creation',
    architecturalRule: 'All infrastructure, industrial output, and material supply chains must operate strictly within local and planetary biophysical carrying capacities (Rockström-Steffen boundaries).',
    systemEnforcement: 'Real-time multi-spectral satellite telemetry and IoT soil/water sensor grids embedded directly into smart contract asset issuance; automatic production throttle upon aquifer or biodiversity stress.',
    biophysicalBoundary: 'Planetary 9 Boundaries (Freshwater, Nitrogen/Phosphorus, Land System Change, Ocean Acidification, Biosphere Integrity).',
    violationTrigger: 'Net aquifer depletion, topsoil loss exceeds natural regeneration rates, or localized ecosystem collapse.',
    flourishingImpact: 'Guarantees ecological baseline restoration and climate resilience for centuries to come.',
    category: 'Planetary Boundaries',
    tags: ['Ecology', 'Planetary Boundaries', 'Telemetry', 'Soil Health']
  },
  {
    id: 4,
    romanNumeral: 'IV',
    title: 'Epistemic Provenance & Open Knowledge Heritage',
    shortMaxim: 'Truth is verifiable; common heritage technologies belong to humanity.',
    moralRoot: 'Righteousness, Transparency & Universal Fellowship',
    architecturalRule: 'Every data point, sensor calculation, scientific methodology, and life-essential hardware blueprint must be cryptographically auditable and publicly accessible.',
    systemEnforcement: 'Open-source hardware standards (LifePod, LifeShield, HydroSense); SHA-256 / Ed25519 verifiable calculation proofs on the Evidence Ledger; zero proprietary black-box algorithms.',
    biophysicalBoundary: 'Information entropy minimization; prevents informational pollution and synthetic epistemic decay.',
    violationTrigger: 'Patenting life-essential seeds, water purification techniques, or withholding environmental telemetry.',
    flourishingImpact: 'Accelerates global decentralized innovation and eliminates monopolistic rent-seeking on survival infrastructure.',
    category: 'Epistemics & Commons',
    tags: ['Open Source', 'Provenance', 'Evidence Ledger', 'Transparency']
  },
  {
    id: 5,
    romanNumeral: 'V',
    title: 'Multi-Assembly Sovereign Veto & Community FPIC',
    shortMaxim: 'No project proceeds without Free, Prior, and Informed Community Consent.',
    moralRoot: 'Justice, Equality & Protection of the Vulnerable',
    architecturalRule: 'Local communities and bioregional stewards possess absolute cryptographic veto authority over any infrastructure, capital deployment, or resource allocation in their territory.',
    systemEnforcement: 'Tri-cameral consensus protocol: Community Assembly (50%+ veto), Ecological Stewards Council (scientific review), and Youth/Generational Guilds; 100% threshold for sacred site protection.',
    biophysicalBoundary: 'Sovereign territorial integrity and cultural heritage conservation.',
    violationTrigger: 'External capital deployment bypassing community vote or coercive political override.',
    flourishingImpact: 'Protects indigenous sovereignty, aligns external capital with grassroots needs, and prevents neo-colonial resource extraction.',
    category: 'Governance & Veto',
    tags: ['FPIC', 'Sovereignty', 'Community Veto', 'Consensus']
  },
  {
    id: 6,
    romanNumeral: 'VI',
    title: 'Local-First Guild Labor & Productive Autonomy',
    shortMaxim: 'Equip local hands with sovereign tools, do not displace them with cloud monopolies.',
    moralRoot: 'Dignity of Labor & Generative Craftsmanship',
    architecturalRule: 'Technology must upskill, dignify, and empower local artisans, farmers, and builders. Systems must prioritize local fabrication, modular repairability, and sovereign ownership of tools.',
    systemEnforcement: 'Maker Guild open CAD repositories; right-to-repair embedded into every BOM; local labor allocation formulas guaranteeing >70% capital retention in the target bioregion.',
    biophysicalBoundary: 'Supply-chain transport emissions reduction through localized circular manufacturing.',
    violationTrigger: 'Planned obsolescence, anti-repair DRM locks, or displacing local trades with predatory centralized automation.',
    flourishingImpact: 'Fosters thriving local economies, youth employment, vocational mastery, and community self-reliance.',
    category: 'Labor & Sovereignty',
    tags: ['Right-to-Repair', 'Guild Labor', 'Local First', 'Open Hardware']
  },
  {
    id: 7,
    romanNumeral: 'VII',
    title: 'Intergenerational Stewardship (Seven-Generation Horizon)',
    shortMaxim: 'Act as humble ancestors; measure success across centuries, not quarterly sprints.',
    moralRoot: 'Generational Faithfulness & Multi-Century Patience',
    architecturalRule: 'Every architectural design, forest management plan, and municipal infrastructure asset must be simulated and stress-tested across a minimum 50-to-100 year timeline.',
    systemEnforcement: 'Perpetual Bioregional Trusts; 30-year maturity capital covenants; automated 7-Generation consequence audits required before ground-breaking.',
    biophysicalBoundary: 'Ecological succession timeframes: hardwood tree maturity, aquifer recharge cycles, topsoil accumulation rates.',
    violationTrigger: 'Liquidation of multi-decade ecological assets for immediate single-quarter financial return.',
    flourishingImpact: 'Reverses short-termism, ensuring that children born 100 years from now inherit richer soils and cleaner rivers.',
    category: 'Intergenerational',
    tags: ['7 Generations', 'Long Horizon', 'Patience', 'Bioregional Trusts']
  },
  {
    id: 8,
    romanNumeral: 'VIII',
    title: 'Causal Grounding & Elimination of Hallucinated Telemetry',
    shortMaxim: 'Distinguish rigorous empirical evidence from modeled assumptions and uncertainty.',
    moralRoot: 'Truthfulness, Epistemic Humility & Guidance',
    architecturalRule: 'AI models, simulation twins, and economic forecasts must mathematically separate observed physical facts from statistical inferences, disclosing uncertainty intervals explicitly.',
    systemEnforcement: "Pearl's Causal Do-Calculus frameworks; strict classification into [Observed | Modeled | Target | Verified]; live uncertainty bounds on all Flourishing Index metrics.",
    biophysicalBoundary: 'Physical measurement resolution and sensor calibration tolerances.',
    violationTrigger: 'Presenting synthetic or speculative AI model outputs as verified empirical ground-truth.',
    flourishingImpact: 'Prevents catastrophic misallocation of resources caused by algorithmic hallucination and unchecked hubris.',
    category: 'Causal Truth',
    tags: ['Causal AI', 'Empirical Grounding', 'Uncertainty', 'No Hallucination']
  },
  {
    id: 9,
    romanNumeral: 'IX',
    title: 'Anti-Fragility, Distributed Decentralization & Offline Resilience',
    shortMaxim: 'Essential living systems must function even if global grids collapse.',
    moralRoot: 'Protection, Courage & Sanctuary',
    architecturalRule: 'Core life-support infrastructure (water treatment, microgrids, food production, emergency communication) must operate peer-to-peer and offline without centralized dependency.',
    systemEnforcement: 'Mesh LoRa / local Wi-Fi telemetry sync; distributed SQLite / edge nodes; islandable solar-battery microgrids with gravity-fed backup water cisterns.',
    biophysicalBoundary: 'Local watershed and solar insolation self-sufficiency thresholds.',
    violationTrigger: 'Creating a single point of centralized failure that leaves a community vulnerable to external outages.',
    flourishingImpact: 'Ensures civilization survivability through geopolitical shocks, grid failures, and climate extremes.',
    category: 'Anti-Fragility',
    tags: ['Anti-Fragile', 'Offline-First', 'Microgrids', 'Edge Mesh']
  },
  {
    id: 10,
    romanNumeral: 'X',
    title: 'Universal Access to Life-Sustaining Living Infrastructure',
    shortMaxim: 'Water, nutritious food, shelter, energy, and health are birthrights, not paywalled privileges.',
    moralRoot: 'Compassion, Divine Provision & Jubilee for the Poor',
    architecturalRule: 'No human within an Atlas Sanctum bioregion shall be denied clean drinking water, sovereign shelter, clean power, restorative medicine, or nutritious calories due to inability to pay.',
    systemEnforcement: 'Civilization Floor Guarantees: public solar taps, modular LifeHouse sanctuary units, open community food forests, decentralized Health OS clinics.',
    biophysicalBoundary: 'Minimum vital metabolic requirements for human life and health.',
    violationTrigger: 'Privatizing, restricting, or weaponizing life-essential survival utilities against impoverished populations.',
    flourishingImpact: 'Eradicates survival anxiety, establishing the universal baseline for human flourishing, creativity, and love.',
    category: 'Universal Access',
    tags: ['Universal Baseline', 'LifeHouse', 'Clean Water', 'Zero Poverty']
  }
];
