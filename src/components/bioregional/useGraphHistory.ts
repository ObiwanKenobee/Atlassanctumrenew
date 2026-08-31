import { useState, useCallback, useRef } from 'react';
import { KnowledgeNodeType, KnowledgeLinkType } from './BioregionalKnowledgeGraph';
import { GraphLayoutPreset } from './LayoutPresetsMenu';
import { audioFeedback } from '../../lib/audioFeedback';

export interface GraphViewState {
  selectedNodeTypeFilter: string;
  selectedLinkTypeFilter: string;
  selectedLayerFilter: string;
  visibleNodeTypes: string[];
  visibleLinkTypes: string[];
  layoutPreset: GraphLayoutPreset;
  searchQuery: string;
  activeSnapshotId: string | null;
  description: string;
}

export function useGraphHistory(initialState: GraphViewState) {
  const [history, setHistory] = useState<GraphViewState[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const isInternalUpdate = useRef(false);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Push new state
  const pushState = useCallback((nextState: GraphViewState) => {
    if (isInternalUpdate.current) return;

    setHistory(prev => {
      // Check if state is identical to current
      const current = prev[currentIndex];
      if (
        current &&
        current.selectedNodeTypeFilter === nextState.selectedNodeTypeFilter &&
        current.selectedLinkTypeFilter === nextState.selectedLinkTypeFilter &&
        current.selectedLayerFilter === nextState.selectedLayerFilter &&
        current.layoutPreset === nextState.layoutPreset &&
        current.searchQuery === nextState.searchQuery &&
        current.activeSnapshotId === nextState.activeSnapshotId &&
        JSON.stringify(current.visibleNodeTypes) === JSON.stringify(nextState.visibleNodeTypes) &&
        JSON.stringify(current.visibleLinkTypes) === JSON.stringify(nextState.visibleLinkTypes)
      ) {
        return prev;
      }

      const sliced = prev.slice(0, currentIndex + 1);
      const newHistory = [...sliced, nextState];
      // Limit history to 30 states
      if (newHistory.length > 30) newHistory.shift();
      return newHistory;
    });

    setCurrentIndex(prev => {
      const nextIndex = Math.min(prev + 1, 29);
      return nextIndex;
    });
  }, [currentIndex]);

  // Undo
  const undo = useCallback((): GraphViewState | null => {
    if (!canUndo) return null;
    audioFeedback.playMicroTick();
    const targetIndex = currentIndex - 1;
    setCurrentIndex(targetIndex);
    return history[targetIndex];
  }, [canUndo, currentIndex, history]);

  // Redo
  const redo = useCallback((): GraphViewState | null => {
    if (!canRedo) return null;
    audioFeedback.playMicroTick();
    const targetIndex = currentIndex + 1;
    setCurrentIndex(targetIndex);
    return history[targetIndex];
  }, [canRedo, currentIndex, history]);

  return {
    currentState: history[currentIndex] || initialState,
    canUndo,
    canRedo,
    pushState,
    undo,
    redo,
    historyLength: history.length,
    currentIndex
  };
}
