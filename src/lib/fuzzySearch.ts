/**
 * High-performance Fuzzy Search & Token Matching Engine
 * Weighted scoring algorithm considering exact matches, prefix matches, and fuzzy token distances.
 */

export interface SearchableItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: 'view' | 'ledger' | 'evidence' | 'failure' | 'moral' | 'capital' | 'agent' | 'documentation';
  targetTab?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

// Compute fuzzy similarity score (0.0 to 1.0)
function computeSimilarity(pattern: string, text: string): number {
  const p = pattern.toLowerCase().trim();
  const t = text.toLowerCase().trim();

  if (t === p) return 1.0;
  if (t.startsWith(p)) return 0.9;
  if (t.includes(p)) return 0.75;

  // Word prefix match
  const words = t.split(/\s+/);
  for (const w of words) {
    if (w.startsWith(p)) return 0.8;
  }

  // Subsequence character matching
  let pIdx = 0;
  let matches = 0;
  for (let i = 0; i < t.length && pIdx < p.length; i++) {
    if (t[i] === p[pIdx]) {
      matches++;
      pIdx++;
    }
  }

  if (pIdx === p.length) {
    return 0.5 * (matches / Math.max(t.length, p.length));
  }

  return 0;
}

export function fuzzySearch(items: SearchableItem[], query: string): SearchableItem[] {
  if (!query || !query.trim()) return items.slice(0, 8);

  const cleanQuery = query.trim().toLowerCase();
  const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

  const scored = items.map((item) => {
    let score = 0;

    // Title match
    const titleScore = computeSimilarity(cleanQuery, item.title);
    score += titleScore * 10;

    // Subtitle match
    if (item.subtitle) {
      score += computeSimilarity(cleanQuery, item.subtitle) * 6;
    }

    // Category match
    if (item.category.toLowerCase().includes(cleanQuery)) {
      score += 4;
    }

    // Tags match
    if (item.tags) {
      for (const tag of item.tags) {
        if (tag.toLowerCase().includes(cleanQuery)) {
          score += 5;
        }
      }
    }

    // Description match
    const descScore = computeSimilarity(cleanQuery, item.description);
    score += descScore * 3;

    // Multi-token bonuses
    for (const token of queryTokens) {
      if (item.title.toLowerCase().includes(token)) score += 3;
      if (item.description.toLowerCase().includes(token)) score += 1.5;
    }

    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0.4)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.item);
}
