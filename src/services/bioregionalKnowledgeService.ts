import { db, auth } from '../firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, serverTimestamp } from 'firebase/firestore';
import type { KnowledgeNode, KnowledgeLink } from '../components/bioregional/BioregionalKnowledgeGraph';

export interface BioregionalCustomTag {
  nodeId: string;
  customLabel?: string;
  tagColor: string;
  tagCategory: string;
  notes?: string;
  authorId?: string;
  authorName?: string;
  updatedAt?: string;
}

export interface HistoricalVersionSnapshot {
  id: string;
  version: string;
  title: string;
  periodYear: number;
  auditDate: string;
  auditorCouncil: string;
  cryptographicHash: string;
  summary: string;
  includedNodeIds: string[];
  includedLinkIds: string[];
  keyMilestones: string[];
  ecosystemIntegrityScore: number;
}

export interface PathStep {
  fromNode: KnowledgeNode;
  toNode: KnowledgeNode;
  link: KnowledgeLink;
  stepIndex: number;
}

export interface ShortestPathResult {
  sourceId: string;
  targetId: string;
  pathNodeIds: string[];
  pathLinkIds: string[];
  steps: PathStep[];
  totalCouplingStrength: number;
  cumulativeTransferEfficiency: number;
}

const LOCAL_STORAGE_TAGS_KEY = 'atlas_bioregional_custom_tags_cache';

// Error Handler for Firestore compliant with skill instructions
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || 'anonymous-steward',
      email: auth.currentUser?.email || 'steward@atlas.org',
    },
    operationType,
    path
  };
  console.warn('Firestore Custom Tags Note: ', JSON.stringify(errInfo));
}

// 1. Save or update a custom tag to Firestore + Local Storage Cache
export async function saveNodeCustomTag(tag: BioregionalCustomTag): Promise<void> {
  // Update local cache immediately for zero latency
  try {
    const local = getLocalCustomTags();
    local[tag.nodeId] = { ...tag, updatedAt: new Date().toISOString() };
    localStorage.setItem(LOCAL_STORAGE_TAGS_KEY, JSON.stringify(local));
  } catch (e) {
    console.warn('Local storage cache update failed', e);
  }

  // Persist to Firestore
  const path = 'bioregional_custom_tags';
  try {
    const docRef = doc(db, path, `tag_${tag.nodeId}`);
    await setDoc(docRef, {
      ...tag,
      authorId: auth.currentUser?.uid || 'steward-local',
      authorName: auth.currentUser?.displayName || 'Bioregional Field Steward',
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/tag_${tag.nodeId}`);
  }
}

// 2. Delete a custom tag from Firestore + Local Storage Cache
export async function deleteNodeCustomTag(nodeId: string): Promise<void> {
  try {
    const local = getLocalCustomTags();
    delete local[nodeId];
    localStorage.setItem(LOCAL_STORAGE_TAGS_KEY, JSON.stringify(local));
  } catch (e) {
    console.warn('Local storage cache delete failed', e);
  }

  const path = 'bioregional_custom_tags';
  try {
    const docRef = doc(db, path, `tag_${nodeId}`);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/tag_${nodeId}`);
  }
}

// 3. Retrieve locally cached custom tags
export function getLocalCustomTags(): Record<string, BioregionalCustomTag> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TAGS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

// 4. Realtime subscription to Firestore custom tags
export function subscribeToCustomTags(callback: (tags: Record<string, BioregionalCustomTag>) => void): () => void {
  // Seed with local storage initially
  const initial = getLocalCustomTags();
  callback(initial);

  const path = 'bioregional_custom_tags';
  try {
    const colRef = collection(db, path);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const result: Record<string, BioregionalCustomTag> = { ...getLocalCustomTags() };
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as BioregionalCustomTag;
          if (data && data.nodeId) {
            result[data.nodeId] = data;
          }
        });
        // Cache to local storage
        try {
          localStorage.setItem(LOCAL_STORAGE_TAGS_KEY, JSON.stringify(result));
        } catch (e) {
          // ignore storage quota error
        }
        callback(result);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return () => {};
  }
}

// 5. Historical Version Snapshots
export const HISTORICAL_VERSION_SNAPSHOTS: HistoricalVersionSnapshot[] = [
  {
    id: 'v1.0-2016',
    version: 'v1.0',
    title: '2016 Baseline Hydrology & Initial Bio-Swale Survey',
    periodYear: 2016,
    auditDate: '2016-11-14',
    auditorCouncil: 'Aberdare Highland Watershed Directorate & Mathare Community Trust',
    cryptographicHash: '0x16a908f1b2098ac123901bca091234567890aabb',
    summary: 'Initial field telemetry deployment establishing baseline turbidity and early riparian infiltration swales along degraded urban and mountain tributaries.',
    includedNodeIds: [
      'zone-aberdare-ridge',
      'zone-mathare-swale',
      'soil-vetiver-stabilization',
      'hydro-perennial-springflow',
      'mechanism-soil-infiltration',
      'fauna-mountain-bongo'
    ],
    includedLinkIds: ['link-aberdare-springflow', 'link-vetiver-sediment', 'link-infiltration-perennial'],
    keyMilestones: [
      'Mathare riparian swale terracing begins',
      'Baseline high-altitude cloud mist capture documented',
      'Galvanic turbidity sensor deployment at Mathare confluence'
    ],
    ecosystemIntegrityScore: 68
  },
  {
    id: 'v1.4-2019',
    version: 'v1.4',
    title: '2019 Post-Drought Resilience & Living Soil Mesh',
    periodYear: 2019,
    auditDate: '2019-09-22',
    auditorCouncil: 'Rift Valley Basin Authority & Soil Microbiome Field Lab',
    cryptographicHash: '0x19df77221087261599201a4e76110f8234719bbc',
    summary: 'Integration of compost tea mycorrhizal inoculations and riverbank vetiver root meshes following severe 2018 drought pulses.',
    includedNodeIds: [
      'zone-aberdare-ridge',
      'zone-mathare-swale',
      'soil-vetiver-stabilization',
      'soil-mycorrhizal-fungi',
      'flora-podocarpus-falcatus',
      'hydro-perennial-springflow',
      'mechanism-soil-infiltration',
      'mechanism-cloud-stripping',
      'fauna-mountain-bongo',
      'flora-vetiver-grass'
    ],
    includedLinkIds: [
      'link-aberdare-springflow',
      'link-vetiver-sediment',
      'link-infiltration-perennial',
      'link-podocarpus-cloud',
      'link-mycorrhizae-sponge',
      'link-cloud-springflow'
    ],
    keyMilestones: [
      'Vetiver silt washout reduction reaches 52%',
      'Podocarpus cloud stripping field calibration confirmed',
      'Mycorrhizal glomalin aggregate sponge test pilot successful'
    ],
    ecosystemIntegrityScore: 78
  },
  {
    id: 'v2.1-2022',
    version: 'v2.1',
    title: '2022 Olosho Corridors & Pastoral Grazing Bylaws',
    periodYear: 2022,
    auditDate: '2022-06-18',
    auditorCouncil: 'Maasai Pastoralist Elder Council & Kenya Bio-Acoustic Mesh',
    cryptographicHash: '0x22c091234567890abcdef1288f1b2098ac123901',
    summary: 'Expansion into Mara Basin Olosho silvopasture corridors, customary rotational grazing covenants, and Acacia xanthophloea nitrogen pumping.',
    includedNodeIds: [
      'zone-aberdare-ridge',
      'zone-mathare-swale',
      'zone-mara-pastoral',
      'soil-vetiver-stabilization',
      'soil-mycorrhizal-fungi',
      'flora-podocarpus-falcatus',
      'flora-acacia-xanthophloea',
      'hydro-perennial-springflow',
      'mechanism-soil-infiltration',
      'mechanism-cloud-stripping',
      'mechanism-rotational-grazing',
      'fauna-mountain-bongo',
      'fauna-crowned-eagle',
      'flora-vetiver-grass',
      'soil-biochar-amendment'
    ],
    includedLinkIds: [
      'link-aberdare-springflow',
      'link-vetiver-sediment',
      'link-infiltration-perennial',
      'link-podocarpus-cloud',
      'link-mycorrhizae-sponge',
      'link-cloud-springflow',
      'link-acacia-nitrogen',
      'link-grazing-pastoral',
      'link-mara-grazing',
      'link-eagle-canopy'
    ],
    keyMilestones: [
      'Olosho customary grazing covenants ratify 8,500 ha buffer',
      'Perennial Talek river baseflow stabilized during dry quarters',
      'Avian bio-acoustic monitoring stations expand to 12 nodes'
    ],
    ecosystemIntegrityScore: 86
  },
  {
    id: 'v2.8-2024',
    version: 'v2.8',
    title: '2024 Transboundary Avian Flyway & Piezometer Mesh',
    periodYear: 2024,
    auditDate: '2024-03-30',
    auditorCouncil: 'East African Bioregional Governance Commission',
    cryptographicHash: '0x24ffeeddccbbaa3344bbee998877665544332211',
    summary: 'Continuous Kikuyu Escarpment canopy bridges connected with Lake Naivasha subsurface piezometer mesh and apex predator trophic tracking.',
    includedNodeIds: [
      'zone-aberdare-ridge',
      'zone-mathare-swale',
      'zone-mara-pastoral',
      'zone-kikuyu-flyway',
      'zone-naivasha-aquifer',
      'soil-vetiver-stabilization',
      'soil-mycorrhizal-fungi',
      'flora-podocarpus-falcatus',
      'flora-acacia-xanthophloea',
      'flora-prunus-africana',
      'hydro-perennial-springflow',
      'hydro-subsurface-piezometer',
      'mechanism-soil-infiltration',
      'mechanism-cloud-stripping',
      'mechanism-rotational-grazing',
      'mechanism-canopy-connectivity',
      'fauna-mountain-bongo',
      'fauna-crowned-eagle',
      'fauna-leopard-keystone',
      'flora-vetiver-grass',
      'soil-biochar-amendment'
    ],
    includedLinkIds: [
      'link-aberdare-springflow',
      'link-vetiver-sediment',
      'link-infiltration-perennial',
      'link-podocarpus-cloud',
      'link-mycorrhizae-sponge',
      'link-cloud-springflow',
      'link-acacia-nitrogen',
      'link-grazing-pastoral',
      'link-mara-grazing',
      'link-eagle-canopy',
      'link-piezometer-aquifer',
      'link-canopy-flyway',
      'link-leopard-trophic',
      'link-prunus-medicinal'
    ],
    keyMilestones: [
      'Subsurface piezometer array tracks +3.4m water table elevation',
      'Kikuyu Escarpment unbroken canopy bridge reaches 1,800 ha',
      'Apex predator corridor verified via infrared drone meshes'
    ],
    ecosystemIntegrityScore: 92
  },
  {
    id: 'v3.2-2026',
    version: 'v3.2',
    title: '2026 Live Bioregional Twin (Current Active Telemetry)',
    periodYear: 2026,
    auditDate: '2026-08-29',
    auditorCouncil: 'Atlas Bioregional Autonomous Twin Verifier Mesh',
    cryptographicHash: '0x26aa88bb77cc66dd55ee44ff3300112233445566',
    summary: 'Full live causal mesh with in-situ satellite lidar, galvanic turbidity probes, acoustic waveforms, and blockchain-verified ecological provenance.',
    includedNodeIds: [], // All nodes
    includedLinkIds: [], // All links
    keyMilestones: [
      'Active bidirectional causal telemetry with 96.5% P90 ground truth',
      'Real-time mycorrhizal glomalin aggregate carbon sink tracking',
      'Transboundary participatory governance and indigenous elder verification'
    ],
    ecosystemIntegrityScore: 97
  }
];

// 6. Batch Export Formatter (CSV)
export function exportNodesToCSV(
  nodes: KnowledgeNode[],
  links: KnowledgeLink[],
  customTags: Record<string, BioregionalCustomTag>
): string {
  const headers = [
    'Node ID',
    'Label',
    'Category',
    'Type',
    'Metric / Indicator',
    'Location',
    'Epistemic Tier',
    'Confidence Score (%)',
    'Ecological Layer',
    'Era',
    'Custom Label',
    'Custom Tag Color',
    'Custom Tag Category',
    'Steward Notes',
    'Verified By',
    'Cryptographic Hash',
    'Upstream Dependencies',
    'Downstream Impacts'
  ];

  const rows = nodes.map(node => {
    const tag = customTags[node.id];

    // Find incoming
    const incoming = links
      .filter(l => {
        const tgt = typeof l.target === 'object' ? (l.target as any).id : l.target;
        return tgt === node.id;
      })
      .map(l => {
        const src = typeof l.source === 'object' ? (l.source as any).label || (l.source as any).id : l.source;
        return `${src} (${l.relationshipLabel})`;
      })
      .join('; ');

    // Find outgoing
    const outgoing = links
      .filter(l => {
        const src = typeof l.source === 'object' ? (l.source as any).id : l.source;
        return src === node.id;
      })
      .map(l => {
        const tgt = typeof l.target === 'object' ? (l.target as any).label || (l.target as any).id : l.target;
        return `${tgt} (${l.relationshipLabel})`;
      })
      .join('; ');

    const escapeCSV = (str: string = '') => {
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    return [
      escapeCSV(node.id),
      escapeCSV(node.label),
      escapeCSV(node.categoryName),
      escapeCSV(node.type),
      escapeCSV(node.metric || 'N/A'),
      escapeCSV(node.location || 'Aberdare Basin'),
      escapeCSV(node.epistemicTier),
      node.confidenceScore,
      escapeCSV(node.ecologicalLayer || 'Canopy & Carbon Sinks'),
      escapeCSV(node.era || '2026-2030'),
      escapeCSV(tag?.customLabel || ''),
      escapeCSV(tag?.tagColor || ''),
      escapeCSV(tag?.tagCategory || ''),
      escapeCSV(tag?.notes || ''),
      escapeCSV(node.verifiedBy || 'Atlas Autonomous Array'),
      escapeCSV(node.hash || ''),
      escapeCSV(incoming),
      escapeCSV(outgoing)
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

// 7. Batch Export Formatter (JSON)
export function exportNodesToJSON(
  nodes: KnowledgeNode[],
  links: KnowledgeLink[],
  customTags: Record<string, BioregionalCustomTag>,
  metadata: { bioregionId: string; exportDate: string; generatedBy: string }
): string {
  const selectedNodeIds = new Set(nodes.map(n => n.id));
  const relevantLinks = links.filter(l => {
    const src = typeof l.source === 'object' ? (l.source as any).id : l.source;
    const tgt = typeof l.target === 'object' ? (l.target as any).id : l.target;
    return selectedNodeIds.has(src) || selectedNodeIds.has(tgt);
  });

  const exportPayload = {
    exportMetadata: {
      ...metadata,
      totalNodes: nodes.length,
      totalCouplings: relevantLinks.length,
      schemaVersion: '2.4.0',
      epistemicStandard: 'Atlas Section 30 Provenance'
    },
    nodes: nodes.map(node => ({
      ...node,
      customStewardTag: customTags[node.id] || null
    })),
    couplings: relevantLinks
  };

  return JSON.stringify(exportPayload, null, 2);
}

// 8. Download Helper Function
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 9. Shortest Path Finder (BFS / Dijkstra on Directed & Undirected Graph)
export function findShortestEcologicalPath(
  sourceId: string,
  targetId: string,
  allNodes: KnowledgeNode[],
  allLinks: KnowledgeLink[]
): ShortestPathResult | null {
  if (!sourceId || !targetId || sourceId === targetId) return null;

  // Build adjacency list (supports bidirectional ecological couplings with link weights)
  const nodeMap = new Map<string, KnowledgeNode>();
  allNodes.forEach(n => nodeMap.set(n.id, n));

  const adj = new Map<string, Array<{ neighborId: string; link: KnowledgeLink; direction: 'outgoing' | 'incoming' }>>();
  allNodes.forEach(n => adj.set(n.id, []));

  allLinks.forEach(link => {
    const src = typeof link.source === 'object' ? (link.source as any).id : link.source;
    const tgt = typeof link.target === 'object' ? (link.target as any).id : link.target;

    if (adj.has(src) && adj.has(tgt)) {
      adj.get(src)!.push({ neighborId: tgt, link, direction: 'outgoing' });
      // Also allow reverse traversal with slight friction penalty
      adj.get(tgt)!.push({ neighborId: src, link, direction: 'incoming' });
    }
  });

  // BFS Queue with path tracking
  interface QueueItem {
    currentId: string;
    pathNodes: string[];
    pathLinks: string[];
    steps: PathStep[];
  }

  const queue: QueueItem[] = [
    {
      currentId: sourceId,
      pathNodes: [sourceId],
      pathLinks: [],
      steps: []
    }
  ];

  const visited = new Set<string>([sourceId]);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.currentId === targetId) {
      // Calculate total strength & cumulative transfer efficiency
      let totalStrength = 0;
      let cumulativeEfficiency = 1.0;

      current.steps.forEach(s => {
        const str = s.link.strength || 0.8;
        totalStrength += str;
        cumulativeEfficiency *= str;
      });

      const avgStrength = current.steps.length > 0 ? totalStrength / current.steps.length : 1;

      return {
        sourceId,
        targetId,
        pathNodeIds: current.pathNodes,
        pathLinkIds: current.pathLinks,
        steps: current.steps,
        totalCouplingStrength: Math.round(avgStrength * 100),
        cumulativeTransferEfficiency: Math.round(cumulativeEfficiency * 100)
      };
    }

    const neighbors = adj.get(current.currentId) || [];
    for (const edge of neighbors) {
      if (!visited.has(edge.neighborId)) {
        visited.add(edge.neighborId);
        const fromNode = nodeMap.get(current.currentId)!;
        const toNode = nodeMap.get(edge.neighborId)!;

        const newStep: PathStep = {
          fromNode,
          toNode,
          link: edge.link,
          stepIndex: current.steps.length + 1
        };

        queue.push({
          currentId: edge.neighborId,
          pathNodes: [...current.pathNodes, edge.neighborId],
          pathLinks: [...current.pathLinks, edge.link.id],
          steps: [...current.steps, newStep]
        });
      }
    }
  }

  return null;
}

// 9. Snapshot Comparison & Diff Calculation
export interface SnapshotComparisonResult {
  snapshotA: HistoricalVersionSnapshot;
  snapshotB: HistoricalVersionSnapshot;
  addedNodeIds: string[];
  removedNodeIds: string[];
  retainedNodeIds: string[];
  addedLinkIds: string[];
  removedLinkIds: string[];
  retainedLinkIds: string[];
  integrityScoreDelta: number;
  nodeCountDelta: number;
  linkCountDelta: number;
}

export function compareSnapshots(
  snapshotAId: string,
  snapshotBId: string,
  allNodes: KnowledgeNode[],
  allLinks: KnowledgeLink[]
): SnapshotComparisonResult | null {
  const snapA = HISTORICAL_VERSION_SNAPSHOTS.find(s => s.id === snapshotAId);
  const snapB = HISTORICAL_VERSION_SNAPSHOTS.find(s => s.id === snapshotBId);

  if (!snapA || !snapB) return null;

  const nodeIdsA = snapA.id === 'v3.2-2026' ? allNodes.map(n => n.id) : snapA.includedNodeIds;
  const nodeIdsB = snapB.id === 'v3.2-2026' ? allNodes.map(n => n.id) : snapB.includedNodeIds;

  const setA = new Set(nodeIdsA);
  const setB = new Set(nodeIdsB);

  const addedNodeIds = nodeIdsB.filter(id => !setA.has(id));
  const removedNodeIds = nodeIdsA.filter(id => !setB.has(id));
  const retainedNodeIds = nodeIdsB.filter(id => setA.has(id));

  const linkIdsA = snapA.id === 'v3.2-2026' ? allLinks.map(l => l.id) : snapA.includedLinkIds;
  const linkIdsB = snapB.id === 'v3.2-2026' ? allLinks.map(l => l.id) : snapB.includedLinkIds;

  const linkSetA = new Set(linkIdsA);
  const linkSetB = new Set(linkIdsB);

  const addedLinkIds = linkIdsB.filter(id => !linkSetA.has(id));
  const removedLinkIds = linkIdsA.filter(id => !linkSetB.has(id));
  const retainedLinkIds = linkIdsB.filter(id => linkSetA.has(id));

  const integrityScoreDelta = snapB.ecosystemIntegrityScore - snapA.ecosystemIntegrityScore;
  const nodeCountDelta = nodeIdsB.length - nodeIdsA.length;
  const linkCountDelta = linkIdsB.length - linkIdsA.length;

  return {
    snapshotA: snapA,
    snapshotB: snapB,
    addedNodeIds,
    removedNodeIds,
    retainedNodeIds,
    addedLinkIds,
    removedLinkIds,
    retainedLinkIds,
    integrityScoreDelta,
    nodeCountDelta,
    linkCountDelta
  };
}

