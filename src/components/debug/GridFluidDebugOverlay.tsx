import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  LayoutGrid, 
  Layers, 
  X, 
  Eye, 
  EyeOff, 
  Columns3, 
  Maximize2, 
  RefreshCw, 
  Info, 
  Zap,
  Sparkles,
  Gauge,
  Sliders,
  Code2,
  Lock,
  Unlock,
  Download,
  Camera,
  History,
  FileCode,
  Check
} from 'lucide-react';
import { useContainerDimensions } from '../../context/ContainerDimensionsContext';
import { audioFeedback } from '../../lib/audioFeedback';

export interface DetectedGridChild {
  index: number;
  tagName: string;
  className: string;
  width: number;
  height: number;
  relX: number;
  relY: number;
  gridColumn?: string;
  gridRow?: string;
}

export interface DetectedGridInfo {
  id: string;
  type: 'bento' | 'cards';
  className: string;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  trackCount: number;
  childCount: number;
  gap: string;
  gridTemplateColumns: string;
  cssRuleDeclaration: string;
  densityLabel: string;
  children?: DetectedGridChild[];
}

export interface GridLayoutSnapshot {
  id: string;
  timestamp: string;
  epochMs: number;
  triggerReason: string;
  container: {
    width: number;
    height: number;
    threshold: string;
  };
  density: {
    level: number;
    name: string;
    description: string;
  };
  grids: {
    id: string;
    type: 'bento' | 'cards';
    trackCount: number;
    childCount: number;
    gap: string;
    width: number;
    height: number;
    gridTemplateColumns: string;
    cssRuleDeclaration: string;
    children?: {
      index: number;
      width: number;
      height: number;
      relX: number;
      relY: number;
    }[];
  }[];
  metrics: {
    activeGridCount: number;
    totalChildCount: number;
    captureLatencyMs: number;
    viewportWidth: number;
    viewportHeight: number;
    devicePixelRatio: number;
    estimatedCardsColumns: number;
    estimatedBentoColumns: number;
  };
}

export interface GridDensityConfig {
  level: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  barColor: string;
  textColor: string;
  badgeBg: string;
}

export const getGridDensityConfig = (width: number, columns?: number): GridDensityConfig => {
  const effectiveCols = columns ?? (width < 640 ? 1 : width < 768 ? 2 : width < 1024 ? 2 : width < 1280 ? 3 : width < 1536 ? 4 : 5);

  if (effectiveCols <= 1 || width < 640) {
    return {
      level: 1,
      name: 'Compact',
      description: 'Single-Track / Mobile Stack (1x)',
      barColor: 'bg-rose-500',
      textColor: 'text-rose-400',
      badgeBg: 'bg-rose-950/60 border-rose-500/40 text-rose-300'
    };
  }
  if (effectiveCols === 2 || width < 768) {
    return {
      level: 2,
      name: 'Moderate',
      description: 'Dual-Track Split Matrix (2x)',
      barColor: 'bg-amber-500',
      textColor: 'text-amber-400',
      badgeBg: 'bg-amber-950/60 border-amber-500/40 text-amber-300'
    };
  }
  if (effectiveCols === 3 || width < 1024) {
    return {
      level: 3,
      name: 'Standard',
      description: 'Triple-Track Fluid Grid (3x)',
      barColor: 'bg-yellow-400',
      textColor: 'text-yellow-300',
      badgeBg: 'bg-yellow-950/60 border-yellow-500/40 text-yellow-200'
    };
  }
  if (effectiveCols === 4 || width < 1280) {
    return {
      level: 4,
      name: 'Dense',
      description: 'Quad-Track Bento Matrix (4x)',
      barColor: 'bg-emerald-400',
      textColor: 'text-emerald-300',
      badgeBg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
    };
  }
  return {
    level: 5,
    name: 'Ultra-Dense',
    description: 'Multi-Track Desktop Canvas (5x+)',
    barColor: 'bg-purple-400',
    textColor: 'text-purple-300',
    badgeBg: 'bg-purple-950/60 border-purple-500/40 text-purple-300'
  };
};

export const getCSSGridTemplateRule = (type: 'bento' | 'cards', width: number): { rule: string; stateDescription: string } => {
  if (type === 'cards') {
    if (width < 768) {
      return {
        rule: 'repeat(auto-fit, minmax(min(100%, 17.5rem), 1fr))',
        stateDescription: 'Base Auto-Fit (~280px minimum per track)'
      };
    }
    if (width < 1024) {
      return {
        rule: 'repeat(2, minmax(0, 1fr))',
        stateDescription: 'MD Tablet Trigger (2 equal tracks)'
      };
    }
    if (width < 1280) {
      return {
        rule: 'repeat(3, minmax(0, 1fr))',
        stateDescription: 'LG Desktop Trigger (3 equal tracks)'
      };
    }
    return {
      rule: 'repeat(auto-fit, minmax(min(100%, 18.5rem), 1fr))',
      stateDescription: 'XL Wide Trigger (Auto-fit ~4 tracks)'
    };
  } else {
    // Bento
    if (width < 768) {
      return {
        rule: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))',
        stateDescription: 'Base Auto-Fit (~320px minimum per track)'
      };
    }
    if (width < 1024) {
      return {
        rule: 'repeat(2, minmax(0, 1fr))',
        stateDescription: 'MD Tablet Trigger (2 equal tracks)'
      };
    }
    if (width < 1280) {
      return {
        rule: 'repeat(3, minmax(0, 1fr))',
        stateDescription: 'LG Desktop Trigger (3 equal tracks)'
      };
    }
    return {
      rule: 'repeat(4, minmax(0, 1fr))',
      stateDescription: 'XL Wide Trigger (4 equal tracks)'
    };
  }
};

const escapeXml = (unsafe: string): string => {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

export const generateGridStructureSVG = (
  grids: DetectedGridInfo[],
  containerWidth: number,
  containerHeight: number,
  threshold: string,
  density: GridDensityConfig
): string => {
  const canvasWidth = 1200;
  const paddingX = 40;
  const contentWidth = canvasWidth - paddingX * 2;
  
  // Header height
  let currentY = 160;
  
  // Process each grid to layout
  const gridSections = grids.map((grid, gIdx) => {
    const sectionY = currentY;
    const isBento = grid.type === 'bento';
    const mainColor = isBento ? '#F59E0B' : '#10B981';
    const bgColor = isBento ? '#131008' : '#08140D';
    const borderColor = isBento ? 'rgba(245, 158, 11, 0.65)' : 'rgba(16, 185, 129, 0.65)';

    const cols = Math.max(1, grid.trackCount || (isBento ? 4 : 3));
    const gapNumeric = parseFloat(grid.gap) || 16;
    const totalGapsWidth = (cols - 1) * gapNumeric;
    const colWidth = Math.max(60, (contentWidth - 32 - totalGapsWidth) / cols);

    const children = grid.children || [];
    const childrenToRender = children.length > 0 
      ? children.slice(0, 16) 
      : Array.from({ length: Math.min(12, cols * 2) }).map((_, idx) => ({
          index: idx,
          tagName: 'div',
          className: isBento ? 'bento-card' : 'card-item',
          width: Math.round(colWidth),
          height: 100,
          relX: (idx % cols) * (colWidth + gapNumeric),
          relY: Math.floor(idx / cols) * (100 + gapNumeric)
        }));

    const rows = Math.max(1, Math.ceil(childrenToRender.length / cols));
    const gridBodyHeight = Math.max(140, rows * (100 + gapNumeric) + 30);
    const sectionHeight = gridBodyHeight + 70;
    currentY += sectionHeight + 40;

    return {
      grid,
      gIdx,
      isBento,
      mainColor,
      bgColor,
      borderColor,
      cols,
      colWidth,
      gapNumeric,
      sectionY,
      sectionHeight,
      gridBodyHeight,
      childrenToRender
    };
  });

  const totalCanvasHeight = Math.max(650, currentY + 70);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasWidth} ${totalCanvasHeight}" width="${canvasWidth}" height="${totalCanvasHeight}">
  <style>
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    .sans { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .title { font-weight: 800; font-size: 20px; fill: #FFFFFF; letter-spacing: -0.025em; }
    .subtitle { font-size: 11px; fill: #9CA3AF; }
    .badge-text { font-size: 10px; font-weight: 700; }
    .section-title { font-size: 14px; font-weight: 700; }
    .meta-label { font-size: 10px; fill: #6B7280; font-weight: 500; }
    .meta-val { font-size: 11px; fill: #F3F4F6; font-weight: 600; }
    .card-label { font-size: 10px; font-weight: 600; fill: #E5E7EB; }
    .card-sub { font-size: 9px; fill: #9CA3AF; }
    .dim-line { stroke: #06B6D4; stroke-width: 1.5; stroke-dasharray: 2,2; }
    .dim-text { font-size: 9px; fill: #67E8F9; font-weight: 600; }
  </style>

  <defs>
    <!-- Background grid dot pattern -->
    <pattern id="grid-dots" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#FFFFFF" fill-opacity="0.04" />
    </pattern>

    <!-- Marker Arrow for Gap Dimensions -->
    <marker id="arrow-start" viewBox="0 0 6 6" refX="0" refY="3" markerWidth="4" markerHeight="4" orient="auto">
      <path d="M6,0 L0,3 L6,6 Z" fill="#06B6D4" />
    </marker>
    <marker id="arrow-end" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="4" markerHeight="4" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#06B6D4" />
    </marker>
  </defs>

  <!-- Deep Slate Background -->
  <rect width="100%" height="100%" fill="#070A08" />
  <rect width="100%" height="100%" fill="url(#grid-dots)" />

  <!-- Outer Canvas Frame -->
  <rect x="12" y="12" width="${canvasWidth - 24}" height="${totalCanvasHeight - 24}" rx="12" fill="none" stroke="#222C24" stroke-width="1.5" />

  <!-- HEADER BANNER -->
  <g transform="translate(40, 36)">
    <!-- Header Background Card -->
    <rect x="0" y="0" width="${contentWidth}" height="96" rx="10" fill="#121814" stroke="#253229" stroke-width="1.5" />
    <rect x="0" y="0" width="${contentWidth}" height="4" rx="2" fill="#10B981" />

    <!-- Title & Subtitle -->
    <text x="24" y="38" class="sans title">ATLAS SANCTUM <tspan fill="#10B981">—</tspan> FLUID GRID ARCHITECTURE BLUEPRINT</text>
    <text x="24" y="60" class="mono subtitle">SVG Technical Documentation Export • Dynamic Layout State &amp; Dimension Metrics</text>

    <!-- Viewport / Container Metadata Badges -->
    <g transform="translate(${contentWidth - 430}, 20)">
      <rect x="0" y="0" width="130" height="56" rx="6" fill="#1A241E" stroke="#29392E" stroke-width="1" />
      <text x="12" y="22" class="mono meta-label">CONTAINER</text>
      <text x="12" y="42" class="mono meta-val">${containerWidth}×${containerHeight}px</text>

      <rect x="140" y="0" width="130" height="56" rx="6" fill="#1A241E" stroke="#29392E" stroke-width="1" />
      <text x="152" y="22" class="mono meta-label">BREAKPOINT</text>
      <text x="152" y="42" class="mono meta-val" fill="#F59E0B">${escapeXml(threshold.toUpperCase())}</text>

      <rect x="280" y="0" width="130" height="56" rx="6" fill="#1A241E" stroke="#29392E" stroke-width="1" />
      <text x="292" y="22" class="mono meta-label">DENSITY</text>
      <text x="292" y="42" class="mono meta-val" fill="#10B981">Lv.${density.level} (${escapeXml(density.name)})</text>
    </g>
  </g>

  <!-- GRID SECTIONS -->
  ${gridSections.map((sec) => `
  <g transform="translate(40, ${sec.sectionY})">
    <!-- Section Container Outer Box -->
    <rect x="0" y="0" width="${contentWidth}" height="${sec.sectionHeight}" rx="10" fill="${sec.bgColor}" stroke="${sec.borderColor}" stroke-width="1.5" />
    
    <!-- Section Header Bar -->
    <rect x="0" y="0" width="${contentWidth}" height="44" rx="10" fill="#111613" />
    <rect x="0" y="34" width="${contentWidth}" height="10" fill="#111613" />
    <line x1="0" y1="44" x2="${contentWidth}" y2="44" stroke="${sec.borderColor}" stroke-width="1" />

    <!-- Type Badge Indicator -->
    <rect x="16" y="11" width="10" height="22" rx="4" fill="${sec.mainColor}" />
    <text x="36" y="27" class="mono section-title" fill="#FFFFFF">.${escapeXml(sec.isBento ? 'grid-flexible-bento' : 'grid-flexible-cards')}</text>

    <!-- Badges: Columns, Gap, Size -->
    <g transform="translate(320, 10)">
      <rect x="0" y="0" width="95" height="24" rx="4" fill="#06B6D4" fill-opacity="0.15" stroke="#06B6D4" stroke-opacity="0.4" />
      <text x="10" y="16" class="mono badge-text" fill="#67E8F9">${sec.cols} COLUMNS</text>

      <rect x="105" y="0" width="95" height="24" rx="4" fill="#EC4899" fill-opacity="0.15" stroke="#EC4899" stroke-opacity="0.4" />
      <text x="115" y="16" class="mono badge-text" fill="#F472B6">GAP: ${escapeXml(sec.grid.gap)}</text>

      <rect x="210" y="0" width="120" height="24" rx="4" fill="#FFFFFF" fill-opacity="0.08" stroke="#FFFFFF" stroke-opacity="0.15" />
      <text x="220" y="16" class="mono badge-text" fill="#E5E7EB">${sec.grid.rect.width}×${sec.grid.rect.height}px</text>
    </g>

    <!-- CSS Rule Declaration -->
    <text x="${contentWidth - 16}" y="27" text-anchor="end" class="mono" font-size="9" fill="#9CA3AF">
      CSS: ${escapeXml(sec.grid.cssRuleDeclaration || sec.grid.gridTemplateColumns || 'auto')}
    </text>

    <!-- Inner Grid Body -->
    <g transform="translate(16, 54)">
      <rect x="0" y="0" width="${contentWidth - 32}" height="${sec.gridBodyHeight}" rx="6" fill="#0C120E" stroke="#1E2A21" stroke-width="1" />

      <!-- Column Track Guides -->
      ${Array.from({ length: sec.cols }).map((_, cIdx) => {
        const trackX = cIdx * (sec.colWidth + sec.gapNumeric);
        return `
        <line x1="${trackX}" y1="0" x2="${trackX}" y2="${sec.gridBodyHeight}" stroke="#06B6D4" stroke-opacity="0.25" stroke-dasharray="4,4" stroke-width="1" />
        <text x="${trackX + 6}" y="14" class="mono" font-size="8" fill="#06B6D4" fill-opacity="0.7">COL ${cIdx + 1}</text>
        `;
      }).join('')}

      <!-- Dynamic Gap Annotation Callout -->
      ${sec.cols >= 2 ? `
      <g transform="translate(${sec.colWidth}, 24)">
        <line x1="2" y1="0" x2="${sec.gapNumeric - 2}" y2="0" class="dim-line" marker-start="url(#arrow-start)" marker-end="url(#arrow-end)" />
        <text x="${sec.gapNumeric / 2}" y="-4" text-anchor="middle" class="mono dim-text">${escapeXml(sec.grid.gap)}</text>
      </g>
      ` : ''}

      <!-- Rendered Child Items -->
      ${sec.childrenToRender.map((child, cIdx) => {
        const cardCol = cIdx % sec.cols;
        const cardRow = Math.floor(cIdx / sec.cols);
        const cardX = cardCol * (sec.colWidth + sec.gapNumeric) + 6;
        const cardY = cardRow * (90 + sec.gapNumeric) + 26;
        const cardW = Math.max(60, sec.colWidth - 12);
        const cardH = 80;

        return `
        <g transform="translate(${cardX}, ${cardY})">
          <rect x="0" y="0" width="${cardW}" height="${cardH}" rx="6" fill="#141C17" stroke="${sec.mainColor}" stroke-opacity="0.45" stroke-width="1" />
          <rect x="0" y="0" width="${cardW}" height="20" rx="6" fill="#1C2720" />
          <rect x="0" y="14" width="${cardW}" height="6" fill="#1C2720" />
          <line x1="0" y1="20" x2="${cardW}" y2="20" stroke="${sec.mainColor}" stroke-opacity="0.2" stroke-width="1" />
          <text x="8" y="14" class="mono card-label">${sec.isBento ? 'Bento' : 'Card'} #${child.index + 1}</text>
          <text x="8" y="40" class="mono card-sub">${child.width}×${child.height}px</text>
          <text x="8" y="56" class="mono" font-size="8" fill="#6B7280">Track: col ${cardCol + 1} / row ${cardRow + 1}</text>
          <text x="8" y="70" class="mono" font-size="7.5" fill="#4B5563">span: auto</text>
        </g>
        `;
      }).join('')}
    </g>
  </g>
  `).join('')}

  <!-- FOOTER DOCUMENTATION & LEGEND -->
  <g transform="translate(40, ${totalCanvasHeight - 56})">
    <rect x="0" y="0" width="${contentWidth}" height="40" rx="8" fill="#121814" stroke="#253229" stroke-width="1" />
    <g transform="translate(16, 14)">
      <rect x="0" y="0" width="12" height="12" rx="2" fill="#F59E0B" />
      <text x="18" y="10" class="mono" font-size="10" fill="#E5E7EB">Bento Region</text>

      <rect x="130" y="0" width="12" height="12" rx="2" fill="#10B981" />
      <text x="148" y="10" class="mono" font-size="10" fill="#E5E7EB">Cards Region</text>

      <line x1="260" y1="6" x2="276" y2="6" stroke="#06B6D4" stroke-width="2" stroke-dasharray="3,3" />
      <text x="284" y="10" class="mono" font-size="10" fill="#67E8F9">Track Guides</text>

      <line x1="390" y1="6" x2="406" y2="6" stroke="#06B6D4" stroke-width="2" stroke-dasharray="2,2" />
      <text x="414" y="10" class="mono" font-size="10" fill="#67E8F9">Dynamic Gap</text>
    </g>

    <text x="${contentWidth - 16}" y="24" text-anchor="end" class="mono" font-size="9" fill="#9CA3AF">
      Exported from GridFluidDebugOverlay • AI Studio Build
    </text>
  </g>
</svg>`;
};

export const GridFluidDebugOverlay: React.FC = () => {
  const { 
    width, 
    height, 
    threshold, 
    prevThreshold, 
    transitionCount, 
    lastCrossoverTimestamp,
    estimatedCardsColumns,
    estimatedBentoColumns
  } = useContainerDimensions();

  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('atlas_grid_debug_overlay') === 'true' || 
           document.documentElement.classList.contains('debug-mode') ||
           document.documentElement.classList.contains('debug-grid-overlay-active');
  });

  const [showHUD, setShowHUD] = useState<boolean>(true);
  const [showChildOutlines, setShowChildOutlines] = useState<boolean>(true);
  const [showTrackLabels, setShowTrackLabels] = useState<boolean>(true);
  const [showDimensionBadges, setShowDimensionBadges] = useState<boolean>(true);
  const [showBentoBorders, setShowBentoBorders] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('atlas_grid_debug_show_bento');
    return stored !== null ? stored === 'true' : true;
  });
  const [showCardsBorders, setShowCardsBorders] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('atlas_grid_debug_show_cards');
    return stored !== null ? stored === 'true' : true;
  });
  const [detectedGrids, setDetectedGrids] = useState<DetectedGridInfo[]>([]);
  const [crossoverNotification, setCrossoverNotification] = useState<string | null>(null);

  // Stored JSON layout state snapshots for performance comparison over time
  const [storedSnapshots, setStoredSnapshots] = useState<GridLayoutSnapshot[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('atlas_grid_debug_layout_snapshots');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [latestSnapshot, setLatestSnapshot] = useState<GridLayoutSnapshot | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('atlas_grid_debug_latest_snapshot');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const prevIsEnabledRef = useRef<boolean>(isEnabled);
  const prevTransitionCountRef = useRef(transitionCount);

  // Dynamic grid density config based on active container width & estimated columns
  const activeDensity = getGridDensityConfig(width, estimatedCardsColumns);

  // Active CSS Grid Template rules for Cards & Bento
  const cardsTemplateState = getCSSGridTemplateRule('cards', width);
  const bentoTemplateState = getCSSGridTemplateRule('bento', width);

  // Capture a JSON layout state snapshot and store in localStorage for performance comparison over time
  const captureLayoutSnapshot = useCallback((triggerReason: string = 'debug_view_triggered'): GridLayoutSnapshot | null => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return null;

    const startTime = performance.now();

    const bentoElements = Array.from(
      document.querySelectorAll<HTMLElement>('.grid-flexible-bento, .grid-fluid-bento')
    );
    const cardsElements = Array.from(
      document.querySelectorAll<HTMLElement>('.grid-flexible-cards, .grid-fluid-cards')
    );

    const snapshotGrids = [
      ...bentoElements.map((el, i) => ({ el, type: 'bento' as const, i })),
      ...cardsElements.map((el, i) => ({ el, type: 'cards' as const, i }))
    ].map(({ el, type, i }) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const cols = style.gridTemplateColumns.split(' ').filter(Boolean);
      const childEls = Array.from(el.children).filter(c => (c as HTMLElement).offsetParent !== null) as HTMLElement[];

      const childrenData = childEls.map((child, cIdx) => {
        const cRect = child.getBoundingClientRect();
        return {
          index: cIdx,
          width: Math.round(cRect.width),
          height: Math.round(cRect.height),
          relX: Math.round(cRect.left - rect.left),
          relY: Math.round(cRect.top - rect.top)
        };
      });

      const colGap = style.columnGap && style.columnGap !== 'normal' ? style.columnGap : '';
      const rowGap = style.rowGap && style.rowGap !== 'normal' ? style.rowGap : '';
      const shortGap = style.gap && style.gap !== 'normal' ? style.gap : '';
      let calculatedGap = '16px';
      if (colGap && colGap !== '0px') {
        calculatedGap = (rowGap && rowGap !== '0px' && rowGap !== colGap) ? `${colGap} / ${rowGap}` : colGap;
      } else if (shortGap && shortGap !== '0px') {
        const parts = shortGap.split(' ').filter(Boolean);
        calculatedGap = parts.length >= 2 && parts[0] === parts[1] ? parts[0] : shortGap;
      } else if (rowGap && rowGap !== '0px') {
        calculatedGap = rowGap;
      }

      const currentTrackCount = cols.length > 0 ? cols.length : (type === 'bento' ? estimatedBentoColumns : estimatedCardsColumns);

      return {
        id: `${type}-${i}-${Math.round(rect.top)}`,
        type,
        trackCount: currentTrackCount,
        childCount: childrenData.length,
        gap: calculatedGap,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        gridTemplateColumns: style.gridTemplateColumns,
        cssRuleDeclaration: getCSSGridTemplateRule(type, rect.width || width).rule,
        children: childrenData
      };
    });

    const captureDurationMs = Math.round((performance.now() - startTime) * 100) / 100;

    const snapshot: GridLayoutSnapshot = {
      id: `snap_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      epochMs: Date.now(),
      triggerReason,
      container: {
        width,
        height,
        threshold,
      },
      density: {
        level: activeDensity.level,
        name: activeDensity.name,
        description: activeDensity.description,
      },
      grids: snapshotGrids,
      metrics: {
        activeGridCount: snapshotGrids.length,
        totalChildCount: snapshotGrids.reduce((acc, g) => acc + g.childCount, 0),
        captureLatencyMs: captureDurationMs,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        estimatedCardsColumns,
        estimatedBentoColumns,
      }
    };

    try {
      const STORAGE_KEY = 'atlas_grid_debug_layout_snapshots';
      const LATEST_KEY = 'atlas_grid_debug_latest_snapshot';
      const raw = localStorage.getItem(STORAGE_KEY);
      let list: GridLayoutSnapshot[] = [];
      if (raw) {
        try {
          list = JSON.parse(raw);
          if (!Array.isArray(list)) list = [];
        } catch {
          list = [];
        }
      }
      const updated = [snapshot, ...list].slice(0, 30);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(LATEST_KEY, JSON.stringify(snapshot));
      setStoredSnapshots(updated);
      setLatestSnapshot(snapshot);

      setCrossoverNotification(`JSON Layout Snapshot Saved (${snapshot.container.width}px, ${snapshot.metrics.activeGridCount} grids)`);
      setTimeout(() => setCrossoverNotification(null), 3000);

      window.dispatchEvent(new CustomEvent('grid-layout-snapshot-captured', { detail: snapshot }));
    } catch (err) {
      console.warn('[GridDebug] Error writing layout snapshot to localStorage:', err);
    }

    return snapshot;
  }, [width, height, threshold, activeDensity, estimatedCardsColumns, estimatedBentoColumns]);

  // AUTOMATIC SNAPSHOT CAPTURE: Automatically capture a JSON layout state snapshot when the user triggers the 'Debug' view
  useEffect(() => {
    if (isEnabled && !prevIsEnabledRef.current) {
      // User triggered 'Debug' view - capture snapshot after brief delay to allow layout classes to settle
      const timer = setTimeout(() => {
        captureLayoutSnapshot('debug_view_triggered');
      }, 150);
      return () => clearTimeout(timer);
    }
    prevIsEnabledRef.current = isEnabled;
  }, [isEnabled, captureLayoutSnapshot]);

  // Export current active grid structure as SVG for documentation purposes
  const handleExportSVG = useCallback(() => {
    try {
      audioFeedback.playSubtleClick();
    } catch {}

    const activeGrids = detectedGrids.filter(g => (g.type === 'bento' ? showBentoBorders : showCardsBorders));
    const targetGrids = activeGrids.length > 0 ? activeGrids : detectedGrids;

    const svgContent = generateGridStructureSVG(
      targetGrids,
      width,
      height,
      threshold,
      activeDensity
    );

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atlas-grid-structure-${threshold}-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    try {
      audioFeedback.playSuccess();
    } catch {}

    setCrossoverNotification('Grid Structure SVG Exported!');
    setTimeout(() => setCrossoverNotification(null), 3000);
  }, [detectedGrids, showBentoBorders, showCardsBorders, width, height, threshold, activeDensity]);

  // Export stored snapshots as a JSON file
  const handleExportSnapshotsJSON = useCallback(() => {
    try {
      audioFeedback.playSubtleClick();
    } catch {}
    const raw = localStorage.getItem('atlas_grid_debug_layout_snapshots');
    const data = raw || JSON.stringify([latestSnapshot].filter(Boolean), null, 2);
    const blob = new Blob([data], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atlas-layout-snapshots-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    try {
      audioFeedback.playSuccess();
    } catch {}
  }, [latestSnapshot]);

  // Clear stored snapshot history from localStorage
  const handleClearSnapshots = useCallback(() => {
    try {
      audioFeedback.playMicroTick();
    } catch {}
    localStorage.removeItem('atlas_grid_debug_layout_snapshots');
    localStorage.removeItem('atlas_grid_debug_latest_snapshot');
    setStoredSnapshots([]);
    setLatestSnapshot(null);
    setCrossoverNotification('Snapshots Cleared from Storage');
    setTimeout(() => setCrossoverNotification(null), 2500);
  }, []);

  // Performance comparison delta with previous snapshot
  const previousSnapshot = storedSnapshots.length > 1 ? storedSnapshots[1] : null;
  const snapshotComparisonDelta = useMemo(() => {
    if (!latestSnapshot || !previousSnapshot) return null;
    const wDiff = latestSnapshot.container.width - previousSnapshot.container.width;
    const hDiff = latestSnapshot.container.height - previousSnapshot.container.height;
    const wSign = wDiff >= 0 ? `+${wDiff}` : `${wDiff}`;
    const hSign = hDiff >= 0 ? `+${hDiff}` : `${hDiff}`;
    const elapsedSec = Math.max(0, Math.round((latestSnapshot.epochMs - previousSnapshot.epochMs) / 1000));
    return `Δ ${wSign}×${hSign}px (${elapsedSec}s prior)`;
  }, [latestSnapshot, previousSnapshot]);

  // Sync classes on HTML documentElement for CSS styling
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isEnabled) {
      document.documentElement.classList.add('debug-grid-overlay-active');
      document.documentElement.classList.add('debug-mode');
      localStorage.setItem('atlas_grid_debug_overlay', 'true');
    } else {
      document.documentElement.classList.remove('debug-grid-overlay-active');
      document.documentElement.classList.remove('debug-mode');
      localStorage.setItem('atlas_grid_debug_overlay', 'false');
    }
    return () => {
      document.documentElement.classList.remove('debug-grid-overlay-active');
      document.documentElement.classList.remove('debug-mode');
    };
  }, [isEnabled]);

  // Sync granular region visibility toggles with documentElement classes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!showBentoBorders) {
      document.documentElement.classList.add('debug-hide-bento');
      try { localStorage.setItem('atlas_grid_debug_show_bento', 'false'); } catch {}
    } else {
      document.documentElement.classList.remove('debug-hide-bento');
      try { localStorage.setItem('atlas_grid_debug_show_bento', 'true'); } catch {}
    }
  }, [showBentoBorders]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!showCardsBorders) {
      document.documentElement.classList.add('debug-hide-cards');
      try { localStorage.setItem('atlas_grid_debug_show_cards', 'false'); } catch {}
    } else {
      document.documentElement.classList.remove('debug-hide-cards');
      try { localStorage.setItem('atlas_grid_debug_show_cards', 'true'); } catch {}
    }
  }, [showCardsBorders]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!showChildOutlines) {
      document.documentElement.classList.add('debug-hide-children');
    } else {
      document.documentElement.classList.remove('debug-hide-children');
    }
  }, [showChildOutlines]);

  // Clean up granular classes on unmount
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('debug-hide-bento', 'debug-hide-cards', 'debug-hide-children');
      }
    };
  }, []);

  // Master 'Lock All' feature state
  const isAllBordersActive = showBentoBorders && showCardsBorders;
  const isAllBordersDisabled = !showBentoBorders && !showCardsBorders;

  // Single master toggle to enable or disable all debug borders across both 'bento' and 'cards' grid regions
  const toggleLockAll = useCallback((targetState?: boolean) => {
    audioFeedback.playSubtleClick();
    const nextVal = targetState !== undefined ? targetState : !isAllBordersActive;
    setShowBentoBorders(nextVal);
    setShowCardsBorders(nextVal);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('grid-debug-lock-all-toggled', { detail: { lockedAll: nextVal } })
      );
    }
  }, [isAllBordersActive]);

  // Global event listener for Alt+L to toggle 'Lock All' across bento and cards grid regions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key === 'l' || e.key === 'L')) || (e.altKey && e.code === 'KeyL')) {
        e.preventDefault();
        toggleLockAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleLockAll]);

  // Synchronize if 'debug-mode' is manipulated on <html> externally
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const observer = new MutationObserver(() => {
      const hasDebug = document.documentElement.classList.contains('debug-mode') ||
                       document.documentElement.classList.contains('debug-grid-overlay-active');
      setIsEnabled(prev => (prev !== hasDebug ? hasDebug : prev));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Scan and detect all active fluid grids on the page
  const scanGrids = useCallback(() => {
    if (!isEnabled || typeof document === 'undefined') {
      setDetectedGrids([]);
      return;
    }

    const bentoElements = Array.from(
      document.querySelectorAll<HTMLElement>('.grid-flexible-bento, .grid-fluid-bento')
    );
    const cardsElements = Array.from(
      document.querySelectorAll<HTMLElement>('.grid-flexible-cards, .grid-fluid-cards')
    );

    const grids: DetectedGridInfo[] = [];

    const processElement = (el: HTMLElement, type: 'bento' | 'cards', index: number) => {
      const rect = el.getBoundingClientRect();
      // Only include visible elements
      if (rect.width === 0 || rect.height === 0 || rect.bottom < -100 || rect.top > window.innerHeight + 1500) {
        return;
      }

      const style = window.getComputedStyle(el);
      const rawCols = style.gridTemplateColumns.split(' ').filter(Boolean);
      const trackCount = rawCols.length > 0 
        ? rawCols.length 
        : (type === 'bento' ? estimatedBentoColumns : estimatedCardsColumns);

      // Dynamically calculate gap size across browsers and stylesheet definitions
      const colGap = style.columnGap && style.columnGap !== 'normal' ? style.columnGap : '';
      const rowGap = style.rowGap && style.rowGap !== 'normal' ? style.rowGap : '';
      const shortGap = style.gap && style.gap !== 'normal' ? style.gap : '';

      let calculatedGap = '16px';
      if (colGap && colGap !== '0px') {
        if (rowGap && rowGap !== '0px' && rowGap !== colGap) {
          calculatedGap = `${colGap} / ${rowGap}`;
        } else {
          calculatedGap = colGap;
        }
      } else if (shortGap && shortGap !== '0px') {
        const parts = shortGap.split(' ').filter(Boolean);
        if (parts.length >= 2 && parts[0] === parts[1]) {
          calculatedGap = parts[0];
        } else {
          calculatedGap = shortGap;
        }
      } else if (rowGap && rowGap !== '0px') {
        calculatedGap = rowGap;
      } else {
        if (el.classList.contains('gap-6') || el.parentElement?.classList.contains('gap-6')) {
          calculatedGap = '24px';
        } else if (el.classList.contains('gap-4') || el.parentElement?.classList.contains('gap-4')) {
          calculatedGap = '16px';
        } else if (el.classList.contains('gap-3')) {
          calculatedGap = '12px';
        } else if (el.classList.contains('gap-2')) {
          calculatedGap = '8px';
        } else {
          calculatedGap = '16px';
        }
      }

      const childrenElements = Array.from(el.children).filter(c => (c as HTMLElement).offsetParent !== null) as HTMLElement[];
      const childrenData: DetectedGridChild[] = childrenElements.map((c, cIdx) => {
        const cRect = c.getBoundingClientRect();
        const cStyle = window.getComputedStyle(c);
        return {
          index: cIdx,
          tagName: c.tagName.toLowerCase(),
          className: c.className,
          width: Math.round(cRect.width),
          height: Math.round(cRect.height),
          relX: Math.round(cRect.left - rect.left),
          relY: Math.round(cRect.top - rect.top),
          gridColumn: cStyle.gridColumn && cStyle.gridColumn !== 'auto' ? cStyle.gridColumn : undefined,
          gridRow: cStyle.gridRow && cStyle.gridRow !== 'auto' ? cStyle.gridRow : undefined
        };
      });

      const rule = getCSSGridTemplateRule(type, rect.width || width);
      const density = getGridDensityConfig(rect.width || width, trackCount);

      grids.push({
        id: `${type}-${index}-${Math.round(rect.top)}`,
        type,
        className: el.className,
        rect: {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        },
        trackCount,
        childCount: childrenData.length,
        gap: calculatedGap,
        gridTemplateColumns: style.gridTemplateColumns,
        cssRuleDeclaration: rule.rule,
        densityLabel: density.name,
        children: childrenData
      });
    };

    bentoElements.forEach((el, i) => processElement(el, 'bento', i));
    cardsElements.forEach((el, i) => processElement(el, 'cards', i));

    setDetectedGrids(grids);
  }, [isEnabled, width, estimatedBentoColumns, estimatedCardsColumns]);

  // Re-scan when container dimensions change, on scroll, or resize
  useEffect(() => {
    if (!isEnabled) return;

    scanGrids();

    const handleScrollOrResize = () => {
      requestAnimationFrame(scanGrids);
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    // MutationObserver to detect new DOM nodes when switching views or tabs
    const observer = new MutationObserver(() => {
      requestAnimationFrame(scanGrids);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      observer.disconnect();
    };
  }, [isEnabled, scanGrids, width, height, threshold]);

  // Flash crossover notification when container threshold boundary shifts
  useEffect(() => {
    if (transitionCount !== prevTransitionCountRef.current && transitionCount > 0) {
      prevTransitionCountRef.current = transitionCount;
      const msg = `Threshold Shift: ${prevThreshold?.toUpperCase() || 'INIT'} → ${threshold.toUpperCase()} (${width}px)`;
      setCrossoverNotification(msg);
      try {
        audioFeedback.playMicroTick();
      } catch {
        // Safe fallback
      }
      const timer = setTimeout(() => {
        setCrossoverNotification(null);
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [transitionCount, threshold, prevThreshold, width]);

  // Keyboard shortcuts: Alt+D (globally toggles 'debug-mode' class on HTML tag) and Alt+G
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut Alt+D: globally toggle 'debug-mode' class on the HTML tag
      if ((e.altKey && (e.key.toLowerCase() === 'd' || e.code === 'KeyD')) || (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault();
        let hasDebugMode = document.documentElement.classList.contains('debug-mode');
        if (!(e as any).__altDDebugHandled) {
          (e as any).__altDDebugHandled = true;
          hasDebugMode = document.documentElement.classList.toggle('debug-mode');
        }
        console.log(`[Debug Mode] Globally toggled 'debug-mode' class on <html>: ${hasDebugMode ? 'ACTIVE' : 'INACTIVE'}`);
        setCrossoverNotification(`Debug Mode (Alt+D): ${hasDebugMode ? 'ACTIVE' : 'INACTIVE'}`);
        setIsEnabled(hasDebugMode);
        try {
          audioFeedback.playMicroTick();
        } catch {
          // Safe fallback
        }
      }
      // Shortcut Alt+G: toggle overlay
      else if ((e.altKey && e.key.toLowerCase() === 'g') || (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'g')) {
        e.preventDefault();
        setIsEnabled(prev => {
          const next = !prev;
          try {
            audioFeedback.playMicroTick();
          } catch {
            // Safe fallback
          }
          return next;
        });
      }
    };

    const handleCustomToggle = () => {
      setIsEnabled(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-grid-debug-overlay', handleCustomToggle);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-grid-debug-overlay', handleCustomToggle);
    };
  }, []);

  const toggleOverlay = () => {
    try {
      audioFeedback.playMicroTick();
    } catch {
      // Safe fallback
    }
    const nextState = !isEnabled;
    if (typeof document !== 'undefined') {
      if (nextState) {
        document.documentElement.classList.add('debug-mode');
      } else {
        document.documentElement.classList.remove('debug-mode');
      }
    }
    setIsEnabled(nextState);
  };

  const thresholdColor = {
    compact: 'text-rose-400 border-rose-500/40 bg-rose-950/60',
    phablet: 'text-amber-400 border-amber-500/40 bg-amber-950/60',
    tablet: 'text-yellow-300 border-yellow-500/40 bg-yellow-950/60',
    desktop: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/60',
    wide: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/60',
    ultrawide: 'text-purple-300 border-purple-500/40 bg-purple-950/60'
  }[threshold];

  return (
    <>
      {/* Floating Quick Toggle Button in Lower Right */}
      <div className="fixed bottom-14 sm:bottom-14 right-3 z-40 font-mono select-none flex flex-col items-end gap-2">
        {/* Temporary Threshold Crossover Flash Pill */}
        {crossoverNotification && (
          <div className="px-3 py-1.5 rounded-lg bg-[#090D0A]/95 border border-amber-500 text-amber-300 text-[11px] font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>{crossoverNotification}</span>
          </div>
        )}

        <button
          onClick={toggleOverlay}
          className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer transition-all duration-200 ${
            isEnabled
              ? 'bg-[#181308] border-amber-500/80 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-[#090D0A]/90 hover:bg-[#121A14] border-white/15 text-neutral-400 hover:text-neutral-200'
          }`}
          title="Toggle Grid Debug Overlay & 'debug-mode' (Shortcut: Alt+D or Alt+G)"
        >
          <LayoutGrid className={`w-3.5 h-3.5 ${isEnabled ? 'text-amber-400' : 'text-neutral-400'}`} />
          <span>Grid Debug</span>
          <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
            isEnabled ? 'bg-amber-500 text-black' : 'bg-white/10 text-neutral-400'
          }`}>
            {isEnabled ? 'ON' : 'OFF'}
          </span>
          <span className="hidden md:inline text-[9px] opacity-40 ml-0.5">Alt+D</span>
        </button>
      </div>

      {/* When enabled, render the interactive HUD panel */}
      {isEnabled && (
        <div className="fixed top-14 right-3 z-40 max-w-sm w-full sm:w-84 rounded-xl bg-[#0A0E0B]/95 border border-amber-500/60 shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl p-3 font-mono text-xs text-[#F5F5F0] space-y-2.5 select-none debug-mode-overlay-fade animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B] animate-pulse" />
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                Fluid Grid Debugger
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleExportSVG}
                className="p-1 rounded hover:bg-cyan-950/60 text-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer"
                title="Export current active grid structure as SVG for documentation"
              >
                <Download className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => captureLayoutSnapshot('manual_hud_trigger')}
                className="p-1 rounded hover:bg-amber-950/60 text-amber-400 hover:text-amber-200 transition-colors cursor-pointer"
                title="Capture instant JSON layout state snapshot"
              >
                <Camera className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={scanGrids}
                className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Rescan active view grids"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setIsEnabled(false)}
                className="p-1 rounded hover:bg-rose-950/60 text-neutral-400 hover:text-rose-300 transition-colors cursor-pointer"
                title="Close debug overlay"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Current Container Metrics */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-neutral-400 block text-[9px]">CONTAINER SIZE</span>
              <span className="font-bold text-white text-xs">
                {width}px × {height}px
              </span>
            </div>

            <div className="p-2 rounded bg-black/40 border border-white/10">
              <span className="text-neutral-400 block text-[9px]">THRESHOLD</span>
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${thresholdColor}`}>
                {threshold}
              </span>
            </div>
          </div>

          {/* VISUAL GRID DENSITY INDICATOR */}
          <div className="p-2 rounded bg-neutral-900/90 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-semibold text-neutral-200 uppercase tracking-wider">
                  Grid Density
                </span>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${activeDensity.badgeBg}`}>
                Level {activeDensity.level}/5 • {activeDensity.name}
              </span>
            </div>

            {/* Visual 5-segment density meter */}
            <div className="flex items-center gap-1 w-full pt-0.5">
              {[1, 2, 3, 4, 5].map((lvl) => {
                const isActive = lvl <= activeDensity.level;
                const isCurrent = lvl === activeDensity.level;
                return (
                  <div
                    key={lvl}
                    className={`h-1.5 flex-1 rounded-sm transition-all duration-300 ${
                      isActive
                        ? `${activeDensity.barColor} ${isCurrent ? 'shadow-[0_0_8px_currentColor] opacity-100 ring-1 ring-white/50' : 'opacity-70'}`
                        : 'bg-white/10 opacity-25'
                    }`}
                    title={`Density Level ${lvl}`}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-0.5">
              <span>{activeDensity.description}</span>
              <span className="text-white/80 font-mono">~{Math.round(width / (estimatedCardsColumns || 1))}px / col</span>
            </div>
          </div>

          {/* CSS GRID-TEMPLATE-COLUMNS STATE SECTION */}
          <div className="p-2 rounded bg-black/50 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px] font-semibold text-cyan-300 uppercase tracking-wider">
                  CSS Template State
                </span>
              </div>
              <span className="text-[9px] text-neutral-400">
                {detectedGrids.length} Grids Active
              </span>
            </div>

            {/* Cards Grid Template Rule State */}
            <div className="space-y-0.5 text-[9px]">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  .grid-flexible-cards
                </span>
                <span className="text-[8px] text-neutral-400">
                  {estimatedCardsColumns} cols active
                </span>
              </div>
              <div className="px-1.5 py-1 rounded bg-[#050D08] border border-emerald-500/30 text-emerald-300 font-mono text-[9px] break-all select-all">
                grid-template-columns: {cardsTemplateState.rule};
              </div>
              <span className="text-[8px] text-neutral-400 block pl-1">
                State: {cardsTemplateState.stateDescription}
              </span>
            </div>

            {/* Bento Grid Template Rule State */}
            <div className="space-y-0.5 text-[9px] pt-1 border-t border-white/5">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="font-semibold text-amber-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                  .grid-flexible-bento
                </span>
                <span className="text-[8px] text-neutral-400">
                  {estimatedBentoColumns} tracks active
                </span>
              </div>
              <div className="px-1.5 py-1 rounded bg-[#100B03] border border-amber-500/30 text-amber-300 font-mono text-[9px] break-all select-all">
                grid-template-columns: {bentoTemplateState.rule};
              </div>
              <span className="text-[8px] text-neutral-400 block pl-1">
                State: {bentoTemplateState.stateDescription}
              </span>
            </div>
          </div>

          {/* GRANULAR GRID REGION TOGGLE CONTROLS (Bento vs Cards) & MASTER LOCK ALL */}
          <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-semibold text-neutral-200 uppercase tracking-wider">
                  Region Border Controls
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleLockAll(true)}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors cursor-pointer ${
                    isAllBordersActive
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50'
                      : 'text-neutral-400 hover:text-white bg-white/5'
                  }`}
                  title="Enable all debug borders across Bento and Cards regions"
                >
                  All ON
                </button>
                <button
                  type="button"
                  onClick={() => toggleLockAll(false)}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors cursor-pointer ${
                    isAllBordersDisabled
                      ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50'
                      : 'text-neutral-400 hover:text-white bg-white/5'
                  }`}
                  title="Disable all debug borders across Bento and Cards regions"
                >
                  All OFF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setShowBentoBorders(true);
                    setShowCardsBorders(false);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors cursor-pointer ${
                    showBentoBorders && !showCardsBorders
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                      : 'text-neutral-400 hover:text-white bg-white/5'
                  }`}
                  title="Show borders ONLY for Bento grids"
                >
                  Bento
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioFeedback.playMicroTick();
                    setShowBentoBorders(false);
                    setShowCardsBorders(true);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-mono transition-colors cursor-pointer ${
                    !showBentoBorders && showCardsBorders
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50'
                      : 'text-neutral-400 hover:text-white bg-white/5'
                  }`}
                  title="Show borders ONLY for Cards grids"
                >
                  Cards
                </button>
              </div>
            </div>

            {/* MASTER 'LOCK ALL' FEATURE: Enables or disables all debug borders across both 'bento' and 'cards' */}
            <div className={`p-2 rounded-lg border transition-all flex items-center justify-between ${
              isAllBordersActive
                ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : isAllBordersDisabled
                ? 'bg-neutral-900/60 border-neutral-700/60'
                : 'bg-black/50 border-white/10'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className={`p-1.5 rounded-md shrink-0 ${
                  isAllBordersActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'bg-white/5 text-neutral-400 border border-white/10'
                }`}>
                  {isAllBordersActive ? (
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-white tracking-wide">
                      Lock All Borders
                    </span>
                    <span className="text-[8px] font-mono text-cyan-300 bg-cyan-950/80 px-1 py-0.2 rounded border border-cyan-500/30 shrink-0">
                      Alt+L
                    </span>
                  </div>
                  <p className="text-[8px] text-neutral-400 truncate">
                    {isAllBordersActive
                      ? 'All borders locked ON (Bento + Cards active)'
                      : isAllBordersDisabled
                      ? 'All borders locked OFF (Both regions muted)'
                      : 'Selective / partial borders active'}
                  </p>
                </div>
              </div>

              {/* Master Toggle Switch */}
              <button
                type="button"
                onClick={() => toggleLockAll()}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ml-2 ${
                  isAllBordersActive ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'bg-neutral-700'
                }`}
                title={`Master Toggle: Click to ${isAllBordersActive ? 'disable' : 'enable'} all debug borders across Bento & Cards regions`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isAllBordersActive ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              {/* Bento Region Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setShowBentoBorders(prev => !prev);
                }}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  showBentoBorders
                    ? 'bg-amber-950/40 border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)] text-amber-200'
                    : 'bg-black/40 border-white/10 text-neutral-500 opacity-60 hover:opacity-100'
                }`}
                title="Click to toggle Bento grid borders and overlays"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${showBentoBorders ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-neutral-600'}`} />
                    <span className="font-bold text-[10px] tracking-tight">Bento Grids</span>
                  </div>
                  {showBentoBorders ? (
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                  )}
                </div>
                <div className="flex items-center justify-between text-[8px] font-mono mt-1 pt-1 border-t border-white/5">
                  <span>{detectedGrids.filter(g => g.type === 'bento').length} detected</span>
                  <span className={showBentoBorders ? 'text-amber-400 font-semibold' : 'text-neutral-500'}>
                    {showBentoBorders ? 'Borders On' : 'Hidden'}
                  </span>
                </div>
              </button>

              {/* Cards Region Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  audioFeedback.playSubtleClick();
                  setShowCardsBorders(prev => !prev);
                }}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  showCardsBorders
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.2)] text-emerald-200'
                    : 'bg-black/40 border-white/10 text-neutral-500 opacity-60 hover:opacity-100'
                }`}
                title="Click to toggle Cards grid borders and overlays"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${showCardsBorders ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-neutral-600'}`} />
                    <span className="font-bold text-[10px] tracking-tight">Cards Grids</span>
                  </div>
                  {showCardsBorders ? (
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                  )}
                </div>
                <div className="flex items-center justify-between text-[8px] font-mono mt-1 pt-1 border-t border-white/5">
                  <span>{detectedGrids.filter(g => g.type === 'cards').length} detected</span>
                  <span className={showCardsBorders ? 'text-emerald-400 font-semibold' : 'text-neutral-500'}>
                    {showCardsBorders ? 'Borders On' : 'Hidden'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-1 pt-1 border-t border-white/10 text-[10px]">
            <label className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-1 rounded">
              <span className="text-neutral-300">Top-Right Region Label Overlays</span>
              <input
                type="checkbox"
                checked={showDimensionBadges}
                onChange={(e) => setShowDimensionBadges(e.target.checked)}
                className="accent-amber-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-1 rounded">
              <span className="text-neutral-300">Show Track Labels</span>
              <input
                type="checkbox"
                checked={showTrackLabels}
                onChange={(e) => setShowTrackLabels(e.target.checked)}
                className="accent-amber-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-1 rounded">
              <span className="text-neutral-300">Outline Child Cards</span>
              <input
                type="checkbox"
                checked={showChildOutlines}
                onChange={(e) => setShowChildOutlines(e.target.checked)}
                className="accent-amber-500 cursor-pointer"
              />
            </label>
          </div>

          {/* ARCHITECTURE BLUEPRINT & PERFORMANCE SNAPSHOTS */}
          <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-semibold text-neutral-200 uppercase tracking-wider">
                  Blueprint &amp; Snapshots
                </span>
              </div>
              <span className="text-[8px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1 py-0.2 rounded">
                {storedSnapshots.length} snapshot{storedSnapshots.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* SVG EXPORT BUTTON */}
            <button
              type="button"
              onClick={handleExportSVG}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-950/80 via-neutral-900 to-emerald-950/80 hover:from-cyan-900/90 hover:to-emerald-900/90 border border-cyan-500/40 hover:border-cyan-400 text-white font-mono text-[10px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)] hover:shadow-[0_0_16px_rgba(6,182,212,0.3)] active:scale-[0.98]"
              title="Export the current active grid structure as a high-fidelity SVG file for technical documentation"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Export Grid Structure (SVG)</span>
            </button>

            {/* JSON LAYOUT STATE SNAPSHOT (AUTO-CAPTURED ON DEBUG) */}
            <div className="p-2 rounded-lg bg-neutral-950/80 border border-white/5 space-y-1.5 text-[9px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-neutral-300">
                  <History className="w-3 h-3 text-amber-400" />
                  <span className="font-semibold text-[9px]">JSON Layout State Snapshot</span>
                </div>
                <span className="text-[7.5px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-1 py-0.2 rounded">
                  Auto on Debug View
                </span>
              </div>

              {latestSnapshot ? (
                <div className="space-y-1 font-mono text-[8px] text-neutral-400 border-t border-white/5 pt-1.5">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span>Last Saved:</span>
                    <span className="text-white font-semibold">
                      {new Date(latestSnapshot.epochMs).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Container State:</span>
                    <span className="text-cyan-300">
                      {latestSnapshot.container.width}×{latestSnapshot.container.height}px ({latestSnapshot.container.threshold})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Grids:</span>
                    <span>
                      {latestSnapshot.grids.length} regions ({latestSnapshot.metrics.totalChildCount} child items)
                    </span>
                  </div>
                  {snapshotComparisonDelta && (
                    <div className="flex items-center justify-between text-amber-300 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/30 mt-0.5">
                      <span className="font-sans font-medium text-[8px]">Delta vs Prior:</span>
                      <span className="font-mono font-bold text-[8px]">{snapshotComparisonDelta}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[8px] text-neutral-500 font-mono">
                  Trigger Debug view to automatically capture layout state snapshots.
                </p>
              )}

              {/* Snapshot Action Controls */}
              <div className="flex items-center gap-1 pt-1.5 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => captureLayoutSnapshot('manual_hud_trigger')}
                  className="flex-1 py-1 px-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 font-mono text-[8px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  title="Capture manual JSON snapshot now"
                >
                  <Camera className="w-2.5 h-2.5 text-amber-400" />
                  <span>Snapshot Now</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportSnapshotsJSON}
                  className="flex-1 py-1 px-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 font-mono text-[8px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  title="Download stored snapshots as a JSON file"
                >
                  <FileCode className="w-2.5 h-2.5 text-cyan-400" />
                  <span>Export JSON</span>
                </button>

                {storedSnapshots.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSnapshots}
                    className="py-1 px-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/20 font-mono text-[8px] cursor-pointer transition-colors"
                    title="Clear snapshots history from localStorage"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Legend Guide */}
          <div className="flex items-center justify-between text-[9px] pt-1 text-neutral-400 border-t border-white/10">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-amber-500/80" />
              <span>Bento Area ({showBentoBorders ? 'Visible' : 'Hidden'})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-emerald-500/80" />
              <span>Cards Area ({showCardsBorders ? 'Visible' : 'Hidden'})</span>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC SMALL LABEL OVERLAYS (COLUMNS & CALCULATED GAP) IN TOP-RIGHT CORNER OF ACTIVE GRID REGIONS */}
      {isEnabled && showDimensionBadges && detectedGrids
        .filter((grid) => (grid.type === 'bento' ? showBentoBorders : showCardsBorders))
        .map((grid) => {
        const isVisible = grid.rect.top - window.scrollY > -50 && grid.rect.top - window.scrollY < window.innerHeight + 100;
        if (!isVisible) return null;

        return (
          <div
            key={`dimension-badge-${grid.id}`}
            id={`grid-dimension-badge-${grid.id}`}
            className="pointer-events-none fixed z-30 font-mono select-none"
            style={{
              top: `${Math.max(6, grid.rect.top - window.scrollY + 6)}px`,
              left: `${grid.rect.left + grid.rect.width - window.scrollX - 8}px`,
              transform: 'translateX(-100%)',
            }}
          >
            <div
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold shadow-lg backdrop-blur-md flex items-center gap-2 border transition-all duration-300 debug-mode-badge-fade ${
                grid.type === 'bento'
                  ? 'bg-[#181206]/95 border-amber-500/80 text-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                  : 'bg-[#06140D]/95 border-emerald-500/80 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.35)]'
              }`}
            >
              {/* Region Type Indicator */}
              <div className="flex items-center gap-1 font-bold">
                <span className={`w-2 h-2 rounded-full ${
                  grid.type === 'bento' ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                }`} />
                <span className="uppercase text-[9px] tracking-wider text-white">
                  {grid.type === 'bento' ? 'Bento' : 'Cards'}
                </span>
              </div>

              <span className="opacity-30">|</span>

              {/* Dynamic Columns Label Overlay */}
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px] font-bold border border-white/20 shadow-xs">
                <Columns3 className="w-3 h-3 text-cyan-400" />
                <span>{grid.trackCount} {grid.trackCount === 1 ? 'col' : 'cols'}</span>
              </span>

              <span className="opacity-30">|</span>

              {/* Dynamic Calculated Gap Size Overlay */}
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-950/70 text-cyan-200 font-mono text-[10px] font-bold border border-cyan-500/40 shadow-xs">
                <span className="text-[8px] uppercase tracking-wider text-cyan-400 font-sans font-semibold">Gap</span>
                <span>{grid.gap}</span>
              </span>

              <span className="opacity-30 hidden sm:inline">|</span>

              {/* Real-Time Width × Height Dimensions */}
              <span className="tracking-tight text-neutral-300 font-medium text-[10px] hidden sm:flex items-center gap-0.5">
                <span>{grid.rect.width}</span>
                <span className="opacity-50 text-[9px]">×</span>
                <span>{grid.rect.height}</span>
                <span className="text-[8px] opacity-60">px</span>
              </span>

              {/* Grid Density Tag */}
              <span className={`text-[9px] font-medium px-1 rounded hidden md:inline-block ${
                grid.type === 'bento' ? 'bg-amber-500/25 text-amber-200' : 'bg-emerald-500/25 text-emerald-200'
              }`}>
                {grid.densityLabel}
              </span>
            </div>
          </div>
        );
      })}

      {/* Floating Track Labels Placed Direct in Document when Enabled */}
      {isEnabled && showTrackLabels && detectedGrids
        .filter((grid) => (grid.type === 'bento' ? showBentoBorders : showCardsBorders))
        .map((grid) => (
        <div
          key={grid.id}
          className="pointer-events-none fixed z-30 font-mono debug-mode-badge-fade transition-opacity duration-300"
          style={{
            top: `${grid.rect.top - window.scrollY - 24}px`,
            left: `${grid.rect.left - window.scrollX}px`,
            display: grid.rect.top - window.scrollY > 0 && grid.rect.top - window.scrollY < window.innerHeight ? 'block' : 'none'
          }}
        >
          <div className={`px-2.5 py-0.5 rounded-t text-[10px] font-bold shadow-md flex items-center gap-2 border-t border-x ${
            grid.type === 'bento' 
              ? 'bg-amber-500 text-black border-amber-400' 
              : 'bg-emerald-500 text-black border-emerald-400'
          }`}>
            <span>{grid.type === 'bento' ? '📐 grid-flexible-bento' : '📐 grid-flexible-cards'}</span>
            <span className="px-1.5 py-0.2 rounded bg-black/25 text-white font-mono text-[9px] font-semibold flex items-center gap-1">
              <Columns3 className="w-2.5 h-2.5 text-cyan-300" />
              <span>{grid.trackCount} {grid.trackCount === 1 ? 'col' : 'cols'}</span>
            </span>
            <span className="px-1.5 py-0.2 rounded bg-black/25 text-white font-mono text-[9px] font-semibold">
              Gap: {grid.gap}
            </span>
            <span className="opacity-80 font-normal text-[9px]">
              [{grid.childCount} items • {grid.rect.width}×{grid.rect.height}px]
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

