import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@src/shared/store';
import { buildTree, findComponentById } from '@src/domains/tree/utils';
import { TreeComponent, FlatComponent } from '@src/shared/types';

// 基礎 selectors
export const selectComponentsById = (state: RootState) =>
  state.cmsEditor.componentsById;

export const selectChildrenMap = (state: RootState) =>
  state.cmsEditor.childrenMap;

export const selectRootIds = (state: RootState) => state.cmsEditor.rootIds;

export const selectSelectedId = (state: RootState) => state.cmsEditor.selectedId;

export const selectCurrentViewport = (state: RootState) =>
  state.cmsEditor.currentViewport;

// Memoized selector: 將扁平化結構轉換成樹狀結構
export const selectTreeComponents = createSelector(
  [selectComponentsById, selectChildrenMap, selectRootIds],
  (componentsById, childrenMap, rootIds): TreeComponent[] => {
    return buildTree({ componentsById, childrenMap, rootIds });
  }
);

// Memoized selector: 取得選中的組件（扁平）
export const selectSelectedFlatComponent = createSelector(
  [selectComponentsById, selectSelectedId],
  (componentsById, selectedId): FlatComponent | null => {
    if (!selectedId) return null;
    return findComponentById(componentsById, selectedId);
  }
);

// Memoized selector: 取得選中的組件（樹狀，包含 children）
export const selectSelectedTreeComponent = createSelector(
  [selectTreeComponents, selectSelectedId],
  (treeComponents, selectedId): TreeComponent | null => {
    if (!selectedId) return null;

    const findInTree = (components: TreeComponent[]): TreeComponent | null => {
      for (const comp of components) {
        if (comp.id === selectedId) return comp;
        const found = findInTree(comp.children);
        if (found) return found;
      }
      return null;
    };

    return findInTree(treeComponents);
  }
);

// Memoized selector: 取得組件數量
export const selectComponentCount = createSelector(
  [selectComponentsById],
  (componentsById): number => {
    return Object.keys(componentsById).length;
  }
);