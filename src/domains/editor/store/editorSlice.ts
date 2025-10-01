import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
  FlatComponent,
  TreeComponent,
  CmsEditorState,
  CmsComponentType,
  ComponentProps,
  ViewportType,
} from '@src/shared/types';
import {
  flattenTree,
  updateComponentProps as updateComponentPropsUtil,
  removeComponent as removeComponentUtil,
  moveComponent as moveComponentUtil,
  containsComponent,
} from '@src/domains/tree/utils';
import { COMPONENT_DEFAULTS } from '@src/domains/libs/components/componentDefaults';

// 創建預設內容
const createInitialComponents = () => {
  const titleId = uuidv4();
  const containerId = uuidv4();
  const descId = uuidv4();

  return {
    componentsById: {
      [titleId]: {
        id: titleId,
        type: 'text' as CmsComponentType,
        parentId: null,
        props: {
          content: '歡迎使用 CMS 編輯器',
          fontSize: 32,
          color: '#000000',
          fontWeight: 'bold' as const,
          lineHeight: 1.5,
        },
      },
      [containerId]: {
        id: containerId,
        type: 'container' as CmsComponentType,
        parentId: null,
        props: {
          ...COMPONENT_DEFAULTS.container,
          padding: 24,
          backgroundColor: '#f5f5f5',
          borderRadius: 8,
        },
      },
      [descId]: {
        id: descId,
        type: 'text' as CmsComponentType,
        parentId: containerId,
        props: {
          content: '從左側組件庫拖拽組件到畫布，開始建立你的頁面。',
          fontSize: 16,
          color: '#666666',
          fontWeight: 'normal' as const,
          lineHeight: 1.6,
        },
      },
    },
    childrenMap: {
      [containerId]: [descId],
    },
    rootIds: [titleId, containerId],
  };
};

const initial = createInitialComponents();
const initialState: CmsEditorState = {
  componentsById: initial.componentsById,
  childrenMap: initial.childrenMap,
  rootIds: initial.rootIds,
  selectedId: null,
  currentViewport: 'desktop',
};

// 創建新組件的輔助函數
const createFlatComponent = (
  type: CmsComponentType,
  parentId: string | null = null,
  customProps: Partial<ComponentProps> = {}
): FlatComponent => {
  const id = uuidv4();
  const defaultProps = COMPONENT_DEFAULTS[type] || {};
  const baseProps = {
    ...defaultProps,
    ...customProps,
  } as ComponentProps;

  return {
    id,
    type,
    parentId,
    props: baseProps,
  };
};

const cmsEditorSlice = createSlice({
  name: 'cmsEditor',
  initialState,
  reducers: {
    // 新增組件
    addComponent: (
      state,
      action: PayloadAction<{
        type: CmsComponentType;
        parentId?: string | null;
        customProps?: Partial<ComponentProps>;
        insertBeforeId?: string;
      }>
    ) => {
      const {
        type,
        parentId = null,
        customProps = {},
        insertBeforeId,
      } = action.payload;

      const newComponent = createFlatComponent(type, parentId, customProps);

      // 加入到 componentsById
      state.componentsById[newComponent.id] = newComponent;

      if (parentId) {
        // 加入到父組件的 children
        const siblings = state.childrenMap[parentId] || [];

        if (insertBeforeId) {
          const insertIndex = siblings.indexOf(insertBeforeId);
          if (insertIndex !== -1) {
            siblings.splice(insertIndex, 0, newComponent.id);
          } else {
            siblings.push(newComponent.id);
          }
        } else {
          siblings.push(newComponent.id);
        }

        state.childrenMap[parentId] = siblings;
      } else {
        // 加入到 root 層級
        if (insertBeforeId) {
          const insertIndex = state.rootIds.indexOf(insertBeforeId);
          if (insertIndex !== -1) {
            state.rootIds.splice(insertIndex, 0, newComponent.id);
          } else {
            state.rootIds.push(newComponent.id);
          }
        } else {
          state.rootIds.push(newComponent.id);
        }
      }

      state.selectedId = newComponent.id;
    },

    // 選中組件
    selectComponent: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },

    // 更新組件屬性 - O(1)
    updateComponentProps: (
      state,
      action: PayloadAction<{ id: string; props: Partial<ComponentProps> }>
    ) => {
      const { id, props } = action.payload;
      state.componentsById = updateComponentPropsUtil(
        state.componentsById,
        id,
        props
      );
    },

    // 刪除組件
    deleteComponent: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const result = removeComponentUtil(state, id);

      state.componentsById = result.componentsById;
      state.childrenMap = result.childrenMap;
      state.rootIds = result.rootIds;

      // 若被刪的是選中節點或其祖先，清空選中
      if (state.selectedId && !containsComponent(state.componentsById, state.selectedId)) {
        state.selectedId = null;
      }
    },

    // 重置編輯器
    resetEditor: () => initialState,

    // 設定 viewport
    setViewport: (state, action: PayloadAction<ViewportType>) => {
      state.currentViewport = action.payload;
    },

    // 設定組件（從樹狀結構轉換）
    setSectionComponents: (state, action: PayloadAction<TreeComponent[]>) => {
      const flatData = flattenTree(action.payload);
      state.componentsById = flatData.componentsById;
      state.childrenMap = flatData.childrenMap;
      state.rootIds = flatData.rootIds;
    },

    // 清空所有組件
    clearSectionComponents: state => {
      state.componentsById = {};
      state.childrenMap = {};
      state.rootIds = [];
    },

    // 重新排序組件（支援跨層級移動）
    reorderComponents: (
      state,
      action: PayloadAction<{ activeId: string; overId: string }>
    ) => {
      const { activeId, overId } = action.payload;

      const activeComponent = state.componentsById[activeId];
      const overComponent = state.componentsById[overId];

      if (!activeComponent || !overComponent) {
        console.log('Component not found:', { activeId, overId });
        return;
      }

      const activeParentId = activeComponent.parentId;
      const overParentId = overComponent.parentId;

      const activeIsContainer = activeComponent.type === 'container';
      const overIsContainer = overComponent.type === 'container';

      console.log('Reorder check:', {
        activeId,
        overId,
        activeType: activeComponent.type,
        activeParentId,
        overParentId,
        overType: overComponent.type,
        activeIsContainer,
        overIsContainer,
        isSameLevel: activeParentId === overParentId,
      });

      // 檢查是否拖到自己的父容器
      const dragToOwnParent = activeParentId === overId;

      // 如果拖到容器本身（且不是自己的父容器）
      if (overIsContainer && !dragToOwnParent) {
        console.log('Drop into container:', overId);

        // 移動到容器內的末尾
        const result = moveComponentUtil(state, activeId, overId);
        state.componentsById = result.componentsById;
        state.childrenMap = result.childrenMap;
        state.rootIds = result.rootIds;
      } else if (activeParentId === overParentId) {
        // 同層級排序
        console.log('Same level reorder');

        const siblings = activeParentId === null ? state.rootIds : state.childrenMap[activeParentId] || [];
        const activeIndex = siblings.indexOf(activeId);
        const overIndex = siblings.indexOf(overId);

        if (activeIndex !== -1 && overIndex !== -1) {
          const newSiblings = [...siblings];
          newSiblings.splice(activeIndex, 1);
          newSiblings.splice(overIndex, 0, activeId);

          if (activeParentId === null) {
            state.rootIds = newSiblings;
          } else {
            state.childrenMap[activeParentId] = newSiblings;
          }
        }
      } else {
        // 跨層級移動
        const overParent = overParentId ? state.componentsById[overParentId] : null;
        const overParentIsContainer = overParent?.type === 'container';
        const moveToRoot = overParentId === null;

        // 規則：容器可以移到任何地方，一般組件只能移到容器內或 root
        if (!activeIsContainer && !moveToRoot && !overParentIsContainer) {
          console.warn('Regular components can only be moved into containers or to root level');
          return;
        }

        console.log('Cross-level move');

        // 移動到 over 組件的同層級，插入在 over 之前
        const targetParentId = overParentId;
        const targetSiblings = targetParentId === null ? state.rootIds : state.childrenMap[targetParentId] || [];
        const targetIndex = targetSiblings.indexOf(overId);

        const result = moveComponentUtil(state, activeId, targetParentId, targetIndex);
        state.componentsById = result.componentsById;
        state.childrenMap = result.childrenMap;
        state.rootIds = result.rootIds;
      }
    },
  },
});

export const {
  addComponent,
  selectComponent,
  updateComponentProps,
  deleteComponent,
  resetEditor,
  setViewport,
  setSectionComponents,
  clearSectionComponents,
  reorderComponents,
} = cmsEditorSlice.actions;

export type { CmsEditorState };
export default cmsEditorSlice.reducer;