import {
  SacredArchetype,
  ArchetypeProfile,
  AlchemicalStageInfo,
  TransmutationRecipe,
  OracleCard,
  EarthBenediction,
  SolfeggioFrequency
} from '../types/alchemical';

export const SACRED_ARCHETYPES: Record<SacredArchetype, ArchetypeProfile> = {
  magician: {
    id: 'magician',
    name: 'The Magician',
    title: 'The Magus of Will & Co-Creation',
    subtitle: 'As Above, So Below — Transforming Intention into Living Form',
    element: 'fire',
    color: 'amber',
    accentHex: '#D97706',
    virtue: 'Conscious Will & Creative Agency',
    invocation: 'By the sacred flame of will, let inert potential awaken into vital harmony.',
    sacredSymbol: '∞',
    quote: 'Magic is not the violation of nature, but the conscious alignment with her deepest hidden harmonies.',
    quoteAuthor: 'Paracelsus & Hermes Trismegistus',
    sacredFrequency: 528
  },
  seeker: {
    id: 'seeker',
    name: 'The Seeker',
    title: 'The Epistemic Pilgrim of Truth',
    subtitle: 'The Quest for the Unvarnished Real Beneath Maya',
    element: 'air',
    color: 'cyan',
    accentHex: '#06B6D4',
    virtue: 'Relentless Wonder & Humility',
    invocation: 'Guide my steps through the labyrinth of the known into the luminous sanctuary of mystery.',
    sacredSymbol: '🧭',
    quote: 'Do not be satisfied with the stories that come before you. Unfold your own myth.',
    quoteAuthor: 'Jalal al-Din Rumi',
    sacredFrequency: 432
  },
  mystic: {
    id: 'mystic',
    name: 'The Mystic',
    title: 'The Vessel of Cosmic Union',
    subtitle: 'Direct Contemplative Experience of the Living Web of Life',
    element: 'aether',
    color: 'purple',
    accentHex: '#8B5CF6',
    virtue: 'Apophatic Stillness & Non-Separation',
    invocation: 'In the stillness where subject and object dissolve, I breathe with the planetary whole.',
    sacredSymbol: '☸',
    quote: 'The eye through which I see the universe is the same eye through which the universe sees me.',
    quoteAuthor: 'Meister Eckhart',
    sacredFrequency: 963
  },
  disciple: {
    id: 'disciple',
    name: 'The Disciple',
    title: 'The Bearer of Sacred Lineage & Vows',
    subtitle: 'Devoted Stewardship, Ancestral Honor, and Daily Reciprocity',
    element: 'earth',
    color: 'emerald',
    accentHex: '#10B981',
    virtue: 'Fidelity & Generative Duty',
    invocation: 'I consecrate my hands to the care of the watershed and the continuity of the living seed.',
    sacredSymbol: '🌱',
    quote: 'Wisdom is not inherited through blood, but through obedience to the law of the living soil.',
    quoteAuthor: 'Indigenous Earth Keepers',
    sacredFrequency: 396
  },
  saint: {
    id: 'saint',
    name: 'The Saint',
    title: 'The Fountain of Radiant Grace & Benediction',
    subtitle: 'Unconditional Compassion, Healing Miracles, and Planetary Intercession',
    element: 'water',
    color: 'rose',
    accentHex: '#F43F5E',
    virtue: 'Boundless Mercy & Selfless Love',
    invocation: 'Let my heart become a clear spring of peace, washing away grief and blessing every fragile leaf.',
    sacredSymbol: '🕊️',
    quote: 'All creatures are shimmering with the holy breath of divine life; honor them as your brothers and sisters.',
    quoteAuthor: 'Francis of Assisi & Hildegard of Bingen',
    sacredFrequency: 639
  },
  alchemist: {
    id: 'alchemist',
    name: 'The Alchemist',
    title: 'The Master of the Great Work (Magnum Opus)',
    subtitle: 'Transmuting Extractive Poison & Grief into Golden Flourishing',
    element: 'fire',
    color: 'yellow',
    accentHex: '#EAB308',
    virtue: 'Transmutation & Distillation',
    invocation: 'Solve et Coagula: Dissolve the rigid illusions of scarcity; coagulate the living gold of wholeness.',
    sacredSymbol: '⚗️',
    quote: 'Our gold is not common gold. It is the living light crystallizing within transformed matter.',
    quoteAuthor: 'The Emerald Tablet',
    sacredFrequency: 741
  },
  sage: {
    id: 'sage',
    name: 'The Sage',
    title: 'The Keeper of Perennial Wisdom & Oracles',
    subtitle: 'Harmonizing Science, Cosmology, and Eternal Axioms',
    element: 'aether',
    color: 'indigo',
    accentHex: '#6366F1',
    virtue: 'Prophetic Discernment & Serenity',
    invocation: 'Grant us the clarity to see across generations and govern by the eternal music of the spheres.',
    sacredSymbol: '📜',
    quote: 'The supreme good is like water, which nourishes all things without contending. Follow the Way.',
    quoteAuthor: 'Lao Tzu',
    sacredFrequency: 852
  }
};

export const ALCHEMICAL_STAGES: AlchemicalStageInfo[] = [
  {
    stage: 'nigredo',
    title: 'Stage I: Nigredo (The Blackening)',
    latinName: 'Calcinatio & Putrefactio',
    colorHex: '#1F2937',
    phaseName: 'Dissolution of the False & Grief Acknowledgment',
    elementalOperation: 'Fire of Calcination',
    hermeticPrinciple: 'Polarity & Cause',
    description: 'The confrontation with shadow, extractive trauma, ecological grief, and the collapse of illusion. We do not deny the wound; we surrender it to the crucible.',
    transmutationEffect: 'Burns away corporate cynicism, systemic denial, and consumer numbness.',
    frequency: 174
  },
  {
    stage: 'albedo',
    title: 'Stage II: Albedo (The Whitening)',
    latinName: 'Ablutio & Sublimatio',
    colorHex: '#E5E7EB',
    phaseName: 'Purification, Washing & Epistemic Clarification',
    elementalOperation: 'Water of Ablution',
    hermeticPrinciple: 'Rhythm & Vibration',
    description: 'The living waters wash the blackened ash. Clarity returns. Soil microbes are inoculated with clean rain; data streams are cleansed of distortion and mercenary bias.',
    transmutationEffect: 'Restores baseline trust, hydrological clarity, and sovereign moral coherence.',
    frequency: 417
  },
  {
    stage: 'citrinitas',
    title: 'Stage III: Citrinitas (The Yellowing)',
    latinName: 'Solificatio & Fermentatio',
    colorHex: '#FBBF24',
    phaseName: 'Solar Awakening & Vital Regeneration',
    elementalOperation: 'Air of Solar Infusion',
    hermeticPrinciple: 'Gender & Generation',
    description: 'The golden dawn illuminates the vessel. The spark of divine intellect unites with ecological vitality. Capital transforms from an extractive debt parasite into a photosynthetic engine.',
    transmutationEffect: 'Converts idle financial speculation into resilient community infrastructure and clean energy microgrids.',
    frequency: 528
  },
  {
    stage: 'rubedo',
    title: 'Stage IV: Rubedo (The Reddening)',
    latinName: 'Coagulatio & Lapis Philosophorum',
    colorHex: '#DC2626',
    phaseName: 'The Philosopher’s Stone & Living Immortality',
    elementalOperation: 'Aether of Coagulation',
    hermeticPrinciple: 'Mentalism & Correspondence',
    description: 'The Great Work is consummated. Matter and Spirit are reconciled. The watershed flourishes perpetually under human guardianship. The Quintessence is extracted.',
    transmutationEffect: 'Generates non-depletable living bio-wealth: pristine aquifers, sacred old-growth canopies, and flourishing human communion.',
    frequency: 852
  }
];

export const TRANSMUTATION_RECIPES: TransmutationRecipe[] = [
  {
    id: 'carbon-to-soil-gold',
    leadName: 'Atmospheric Carbon Overburden & Fossil Burn',
    leadCategory: 'ecological',
    leadDescription: '1,200 metric tons of excess atmospheric CO2 causing runaway heat domes and climate instability.',
    toxicityWeightKg: 1200000,
    transmutedGoldName: 'Glomalin Soil Matrix & Ancient Humus Bio-Gold',
    transmutedValueUsd: 284000,
    bioregionalMetric: '+18.4% Soil Water Retention & Microbial Density',
    flourishingBoost: 14.2,
    purificationSteps: {
      nigredo: 'Confront the historical emission debt and halt fossil subsidization mechanisms.',
      albedo: 'Deploy biochar inoculations and deep-root perennial prairie restoration.',
      citrinitas: 'Accelerate photosynthetic sugar pumping into mycorrhizal fungal fungal networks.',
      rubedo: 'Crystalize permanent organic soil carbon, locking moisture for seven generations.'
    }
  },
  {
    id: 'cynicism-to-solidarity',
    leadName: 'Cynical Apathy & Atomized Despair',
    leadCategory: 'spiritual',
    leadDescription: 'Community fragmentation, digital alienation, and learned helplessness among citizens.',
    toxicityWeightKg: 450000,
    transmutedGoldName: 'Civic Mutual-Aid Mesh & Radiant Fellowship',
    transmutedValueUsd: 195000,
    bioregionalMetric: '+94.2% Intergenerational Trust & Crisis Resilience',
    flourishingBoost: 22.8,
    purificationSteps: {
      nigredo: 'Hold collective grief council; name the isolation and institutional betrayals.',
      albedo: 'Open community tool libraries, shared grain mills, and transparent democratic councils.',
      citrinitas: 'Ignite shared harvest festivals and participatory neighborhood energy bonds.',
      rubedo: 'Forge an unbreakable bond of mutual sanctuary where no neighbor falls through the floor.'
    }
  },
  {
    id: 'toxic-watershed-to-aquifer',
    leadName: 'Industrial Effluent & Nitrate Runoff',
    leadCategory: 'ecological',
    leadDescription: 'Dead zones, chemical agricultural poisoning, and microplastic silt in the river mouth.',
    toxicityWeightKg: 890000,
    transmutedGoldName: 'Living Living-Machine Bio-Living Aquifer Waters',
    transmutedValueUsd: 410000,
    bioregionalMetric: '0.00 PPM Nitrates, Return of Wild Anadromous Salmon',
    flourishingBoost: 19.5,
    purificationSteps: {
      nigredo: 'Expose illicit outfall pipes with public Merkle cryptographic sensor nodes.',
      albedo: 'Plant 40 miles of riparian willow, cattail, and beaver-dam analog filtration swales.',
      citrinitas: 'Release native mycoremediation spores that metabolize persistent petrochemicals.',
      rubedo: 'Sacred river ceremony: water safe to drink directly from the river basin once again.'
    }
  },
  {
    id: 'extractive-capital-to-endowment',
    leadName: 'Predatory Debt & Speculative Rentier Extraction',
    leadCategory: 'economic',
    leadDescription: 'Financial capital draining 32% of local economic surplus to offshore tax havens.',
    toxicityWeightKg: 3400000,
    transmutedGoldName: 'Perpetual Bioregional Common Wealth Endowment',
    transmutedValueUsd: 1250000,
    bioregionalMetric: '$0 Debt Service Burden, 100% Retained Regenerative Yield',
    flourishingBoost: 26.4,
    purificationSteps: {
      nigredo: 'Audit predatory loans and reclassify extractive compound interest as civilizational usury.',
      albedo: 'Issue local demurrage-backed currency and public interest bioregional bonds.',
      citrinitas: 'Channel low-cost liquidity exclusively into solar microgrids and regenerative farm co-ops.',
      rubedo: 'Establish a self-sustaining sovereign wealth trust governed by universal priority floors.'
    }
  }
];

export const LIVING_ARCANA_ORACLE: OracleCard[] = [
  {
    id: 1,
    name: 'The World Tree (Yggdrasil)',
    title: 'The Pillar of Interconnected Life',
    archetype: 'mystic',
    element: 'earth',
    aphorism: 'Deep roots drink from subterranean darkness to bear fruits of blinding light.',
    esotericMeaning: 'You are anchored in a lineage far deeper than immediate political storms. Trust the slow intelligence of ancient forests.',
    planetaryAction: 'Plant a long-lived oak, cedar, or redwood; safeguard a wild watershed parcel.',
    bioregionalBlessing: 'May the canopy above your home be unbroken for three hundred years.',
    sacredFrequency: 432,
    iconName: 'TreeDeciduous'
  },
  {
    id: 2,
    name: 'The Living Crucible',
    title: 'The Vessel of Divine Metamorphosis',
    archetype: 'alchemist',
    element: 'fire',
    aphorism: 'Do not flee the heat; it is the fire that releases the trapped gold.',
    esotericMeaning: 'Present crisis is not annihilation, but the necessary dissolution of outworn rigid structures. Stand steadfast at the furnace.',
    planetaryAction: 'Transmute an unresolved grievance into a concrete community service project.',
    bioregionalBlessing: 'May the heat of your trials crystallize into wisdom that warms your neighbors.',
    sacredFrequency: 528,
    iconName: 'Flame'
  },
  {
    id: 3,
    name: 'The Sophia Wisdom',
    title: 'The Architect of Cosmic Harmony',
    archetype: 'sage',
    element: 'aether',
    aphorism: 'True governance measures its success by the tranquility of the quietest brook.',
    esotericMeaning: 'Discard cleverness in favor of profound listening. The solution has already been whispered by the mountain.',
    planetaryAction: 'Review institutional algorithms to enforce non-negotiable ecological floors.',
    bioregionalBlessing: 'May your thoughts be as transparent and unhurried as mountain springwater.',
    sacredFrequency: 852,
    iconName: 'Sparkles'
  },
  {
    id: 4,
    name: 'The Compassionate Intercessor',
    title: 'The Font of Unfailing Grace',
    archetype: 'saint',
    element: 'water',
    aphorism: 'No watershed is so poisoned that love cannot begin its purification.',
    esotericMeaning: 'Pour blessings where judgment was previously passed. The wounded ecosystem responds to gentle tenderness.',
    planetaryAction: 'Perform an anonymous act of ecological repair or food provisioning today.',
    bioregionalBlessing: 'May your presence bring immediate solace to those trembling in despair.',
    sacredFrequency: 639,
    iconName: 'Heart'
  },
  {
    id: 5,
    name: 'The Magus of the Elements',
    title: 'The Weaver of Mathematical Sigils',
    archetype: 'magician',
    element: 'fire',
    aphorism: 'Intent without geometry dissolves into mist; geometry without intent is stone.',
    esotericMeaning: 'Focus your will. Unify your engineering precision with your moral conscience to materialize real physical solutions.',
    planetaryAction: 'Design an open-source schematic for clean water harvesting or renewable storage.',
    bioregionalBlessing: 'May your will cut through apathy like a sunbeam through morning fog.',
    sacredFrequency: 528,
    iconName: 'Zap'
  },
  {
    id: 6,
    name: 'The Epistemic Labyrinth',
    title: 'The Gate of Unvarnished Wonder',
    archetype: 'seeker',
    element: 'air',
    aphorism: 'The obstacle is not blocking the path; the obstacle is the sacred initiation.',
    esotericMeaning: 'Release certainty. Question the metrics and dogmas of the prevailing order. The truth lies beyond the boundary of comfortable consensus.',
    planetaryAction: 'Audit your household and community supply chains for hidden human or ecological costs.',
    bioregionalBlessing: 'May your questions be holy lamps guiding lost pilgrims home.',
    sacredFrequency: 741,
    iconName: 'Compass'
  },
  {
    id: 7,
    name: 'The Covenant of the Seed',
    title: 'The Vow of Intergenerational Fidelity',
    archetype: 'disciple',
    element: 'earth',
    aphorism: 'A seed buried in the earth does not fear the dark; it remembers the sun.',
    esotericMeaning: 'Honor the promises made to the children who will walk this soil in 2126. Faithfulness outlasts market cycles.',
    planetaryAction: 'Store and share heirloom non-hybrid seeds with your regional seed bank.',
    bioregionalBlessing: 'May your descendants harvest joy from the orchards you plant in faith.',
    sacredFrequency: 396,
    iconName: 'Award'
  },
  {
    id: 8,
    name: 'The Music of the Spheres',
    title: 'The Celestial Resonance of Harmony',
    archetype: 'mystic',
    element: 'aether',
    aphorism: 'When human civilization mirrors the planetary octaves, war becomes impossible.',
    esotericMeaning: 'Tune your daily rhythm to the solar zenith and lunar tides. Realign your biological clock with the heartbeat of the Earth.',
    planetaryAction: 'Meditate in silence during the twilight hour; abstain from screens and artificial noise.',
    bioregionalBlessing: 'May your voice resonate in perfect chord with the songs of migrating birds.',
    sacredFrequency: 963,
    iconName: 'Radio'
  }
];

export const SACRED_BIOREGIONS: EarthBenediction[] = [
  {
    id: 'amazon-headwaters',
    bioregionName: 'Amazonian Sacred Headwaters (Ecuador & Peru)',
    coordinates: [-1.8312, -78.1834],
    threatDesc: 'Oil concession expansions, illegal gold dredging, and deforestation pressures.',
    blessingText: 'May the serpentine rivers carry immaculate waters, and may the indigenous protectors stand enveloped in golden shields of peace.',
    saintlyPrayer: 'O Sacred Living Lung of the Earth, breathe unbroken. We pour restorative grace over every tapir trail and emerald canopy.',
    totalBlessingsCount: 14820,
    lastBlessedAt: 'Just now'
  },
  {
    id: 'congo-basin',
    bioregionName: 'Congo Peatland Forests & River Basin',
    coordinates: [0.228, 15.8277],
    threatDesc: 'Industrial logging concessions and peatland drainage threatening massive carbon release.',
    blessingText: 'May the deep peat remain cool, wet, and undisturbed, cradling the memory of the ancient continent.',
    saintlyPrayer: 'We invoke peace across these fertile floodplains and honor the forest elephants as divine gardeners of the realm.',
    totalBlessingsCount: 11340,
    lastBlessedAt: '2m ago'
  },
  {
    id: 'great-barrier-reef',
    bioregionName: 'Great Barrier Marine Sanctuary (Coral Sea)',
    coordinates: [-18.2871, 147.6992],
    threatDesc: 'Marine heatwaves, coral bleaching, and agricultural sediment runoff.',
    blessingText: 'May cool upwelling currents envelop the coral polyps, infusing the turquoise shallows with resilient reproductive vitality.',
    saintlyPrayer: 'Holy Mother Ocean, forgive our hubris. We send vibrations of soothing coolness into every polyhedral reef.',
    totalBlessingsCount: 18950,
    lastBlessedAt: '5m ago'
  },
  {
    id: 'cascadia-old-growth',
    bioregionName: 'Cascadia Ancient Rain Forests & Salmon Rivers',
    coordinates: [47.7511, -120.7401],
    threatDesc: 'Legacy clear-cutting, thermal river warming, and wild salmon run declines.',
    blessingText: 'May the ancient western red cedars stand inviolable, their mist feeding the silver salmon returning to gravel beds.',
    saintlyPrayer: 'May the covenant between tree, river, and salmon be restored through our steadfast defense.',
    totalBlessingsCount: 16420,
    lastBlessedAt: '1m ago'
  },
  {
    id: 'himalayan-water-tower',
    bioregionName: 'Himalayan Cryosphere & Sacred Rivers',
    coordinates: [28.3949, 84.124],
    threatDesc: 'Glacial retreat, glacial lake outburst floods, and fragile high-altitude erosion.',
    blessingText: 'May the crystal glaciers remain crowned in perennial snow, gently nourishing two billion living souls downstream.',
    saintlyPrayer: 'From the heights of Kailash and Everest, we send gratitude for every drop of snowmelt that blesses the valleys.',
    totalBlessingsCount: 22100,
    lastBlessedAt: 'Just now'
  }
];

export const SOLFEGGIO_FREQUENCIES: SolfeggioFrequency[] = [
  {
    hz: 174,
    name: 'Foundation & Relieving Grief',
    traditionalPurpose: 'Natural anesthetic; relieves physical and energetic tension, grounding the nervous system.',
    bioregionalResonance: 'Subterranean basalt bedrock & mineral grounding.',
    chakraOrCenter: 'Earth Star Chakra',
    colorHex: '#6B7280'
  },
  {
    hz: 285,
    name: 'Bioregional Regeneration',
    traditionalPurpose: 'Restructuring damaged tissues and restoring systems to their original blueprint.',
    bioregionalResonance: 'Mycelial root inoculation & spore rejuvenation.',
    chakraOrCenter: 'Root Meridian',
    colorHex: '#92400E'
  },
  {
    hz: 396,
    name: 'Liberation from Fear & Scarcity',
    traditionalPurpose: 'Dispelling subconscious fear, guilt, and the hypnotic dread of ecological collapse.',
    bioregionalResonance: 'Soil humus activation & resilient germination.',
    chakraOrCenter: 'Root Center',
    colorHex: '#DC2626'
  },
  {
    hz: 417,
    name: 'Facilitating Deep Change (Albedo)',
    traditionalPurpose: 'Clearing traumatic blockages and facilitating peaceful life transitions.',
    bioregionalResonance: 'Glacial melt purification & pristine aquifers.',
    chakraOrCenter: 'Sacral Center',
    colorHex: '#EA580C'
  },
  {
    hz: 432,
    name: 'Verdi / Pythagorean Harmonic Base',
    traditionalPurpose: 'Universal cosmic tuning; synchronizes brain hemispheres with planetary Schumann resonance.',
    bioregionalResonance: 'The natural resonant vibration of water and chlorophyll.',
    chakraOrCenter: 'Heart / Biospheric Core',
    colorHex: '#16A34A'
  },
  {
    hz: 528,
    name: 'Transformation & Miracle Repair (The Solfeggio Core)',
    traditionalPurpose: 'Known as the "Love Frequency" and DNA repair tone; brings extraordinary restoration.',
    bioregionalResonance: 'Photosynthetic light capture & sunburst resonance.',
    chakraOrCenter: 'Solar Plexus & Living Heart',
    colorHex: '#EAB308'
  },
  {
    hz: 639,
    name: 'Connecting Relationships & Community Harmony',
    traditionalPurpose: 'Deepens interpersonal empathy, resolving community division and tribal warfare.',
    bioregionalResonance: 'Forest canopy communion & bird chorus.',
    chakraOrCenter: 'Heart Center',
    colorHex: '#059669'
  },
  {
    hz: 741,
    name: 'Awakening Intuition & Epistemic Truth',
    traditionalPurpose: 'Dispels toxins, radiation, and digital pollution; sharpens pure intuition.',
    bioregionalResonance: 'Atmospheric ozone & lightning discharge.',
    chakraOrCenter: 'Throat Center',
    colorHex: '#0284C7'
  },
  {
    hz: 852,
    name: 'Returning to Spiritual Order',
    traditionalPurpose: 'Awakens inner eye; penetrates illusions of separation; connects to universal order.',
    bioregionalResonance: 'Celestial starlight & night-sky contemplation.',
    chakraOrCenter: 'Third Eye',
    colorHex: '#6366F1'
  },
  {
    hz: 963,
    name: 'Divine Crown & Transcendent Unity',
    traditionalPurpose: 'Pure cosmic consciousness; awakens the feeling of total belonging to the living universe.',
    bioregionalResonance: 'Solar wind, aurora borealis, and cosmic ray matrix.',
    chakraOrCenter: 'Crown of Light',
    colorHex: '#9333EA'
  }
];

export const SEVEN_AXIOMATIC_VOWS = [
  {
    id: 'vow-1',
    archetype: 'disciple',
    title: 'The Vow of the Watershed',
    vowText: 'I vow to leave every watershed that quenches my thirst cleaner, cooler, and more biodiverse than I found it.',
    element: 'Water'
  },
  {
    id: 'vow-2',
    archetype: 'saint',
    title: 'The Vow of the Priority Floor',
    vowText: 'I vow to never trade a neighbor’s basic survival, clean water, or dignified shelter for another’s financial gain or algorithmic speed.',
    element: 'Earth'
  },
  {
    id: 'vow-3',
    archetype: 'alchemist',
    title: 'The Vow of the Crucible',
    vowText: 'I vow to transmute my personal cynicism and ecological despair into patient, daily craftsmanship of community flourishing.',
    element: 'Fire'
  },
  {
    id: 'vow-4',
    archetype: 'magician',
    title: 'The Vow of the Pure Word',
    vowText: 'I vow to align my speech and digital communications with verified truth, refusing to propagate epistemic toxins or deceit.',
    element: 'Air'
  },
  {
    id: 'vow-5',
    archetype: 'seeker',
    title: 'The Vow of Holy Wonder',
    vowText: 'I vow to keep my heart open to mystery, confessing my ignorance before the sublime complexity of the living cosmos.',
    element: 'Aether'
  },
  {
    id: 'vow-6',
    archetype: 'sage',
    title: 'The Vow of the Seventh Generation',
    vowText: 'I vow that every major technology and infrastructure system I build shall be evaluated by its impact two hundred years into the future.',
    element: 'Time'
  },
  {
    id: 'vow-7',
    archetype: 'mystic',
    title: 'The Vow of Inviolable Kinship',
    vowText: 'I vow to remember that the soil, the cedar, the eagle, the mycelium, and the human stranger are one undivided living body.',
    element: 'Unity'
  }
];
