import {
  FlatComponent,
  TreeComponent,
  ComponentProps,
} from '@src/shared/types';

// ========== 扁平化結構 -> 樹狀結構 ==========
export function buildTree(state: {
  componentsById: Record<string, FlatComponent>;
  childrenMap: Record<string, string[]>;
  rootIds: string[];
}): TreeComponent[] {
  const { componentsById, childrenMap, rootIds } = state;

  const buildNode = (id: string): TreeComponent => {
    const component = componentsById[id];
    const childIds = childrenMap[id] || [];

    return {
      id: component.id,
      type: component.type,
      parentId: component.parentId,
      props: component.props,
      children: childIds.map(childId => buildNode(childId)),
    };
  };

  return rootIds.map(id => buildNode(id));
}

// ========== 樹狀結構 -> 扁平化結構 ==========
export function flattenTree(tree: TreeComponent[]): {
  componentsById: Record<string, FlatComponent>;
  childrenMap: Record<string, string[]>;
  rootIds: string[];
} {
  const componentsById: Record<string, FlatComponent> = {};
  const childrenMap: Record<string, string[]> = {};
  const rootIds: string[] = [];

  const flatten = (node: TreeComponent, parentId: string | null = null) => {
    // 儲存扁平化組件
    componentsById[node.id] = {
      id: node.id,
      type: node.type,
      parentId,
      props: node.props,
    };

    // 如果是 root 層級
    if (parentId === null) {
      rootIds.push(node.id);
    }

    // 如果有子組件
    if (node.children && node.children.length > 0) {
      childrenMap[node.id] = node.children.map(child => child.id);
      node.children.forEach(child => flatten(child, node.id));
    }
  };

  tree.forEach(node => flatten(node));

  return { componentsById, childrenMap, rootIds };
}

// ========== 查找組件 O(1) ==========
export function findComponentById(
  componentsById: Record<string, FlatComponent>,
  id: string
): FlatComponent | null {
  return componentsById[id] || null;
}

// ========== 查找組件和父組件 O(1) ==========
export function findComponentAndParent(
  componentsById: Record<string, FlatComponent>,
  id: string
): { component: FlatComponent; parent: FlatComponent | null } | null {
  const component = componentsById[id];
  if (!component) return null;

  const parent = component.parentId ? componentsById[component.parentId] : null;

  return { component, parent };
}

// ========== 取得子組件 O(1) ==========
export function getChildren(
  componentsById: Record<string, FlatComponent>,
  childrenMap: Record<string, string[]>,
  parentId: string
): FlatComponent[] {
  const childIds = childrenMap[parentId] || [];
  return childIds.map(id => componentsById[id]).filter(Boolean);
}

// ========== 檢查組件是否存在 O(1) ==========
export function containsComponent(
  componentsById: Record<string, FlatComponent>,
  id: string
): boolean {
  return id in componentsById;
}

// ========== 更新組件屬性 O(1) ==========
export function updateComponentProps(
  componentsById: Record<string, FlatComponent>,
  id: string,
  props: Partial<ComponentProps>
): Record<string, FlatComponent> {
  const component = componentsById[id];
  if (!component) return componentsById;

  return {
    ...componentsById,
    [id]: {
      ...component,
      props: {
        ...component.props,
        ...props,
      } as ComponentProps,
    },
  };
}

// ========== 移除組件 ==========
export function removeComponent(
  state: {
    componentsById: Record<string, FlatComponent>;
    childrenMap: Record<string, string[]>;
    rootIds: string[];
  },
  id: string
): {
  componentsById: Record<string, FlatComponent>;
  childrenMap: Record<string, string[]>;
  rootIds: string[];
} {
  const { componentsById, childrenMap, rootIds } = state;
  const component = componentsById[id];
  if (!component) return state;

  // 收集要刪除的所有 ID（包含子孫組件）
  const idsToRemove = new Set<string>();
  const collectIds = (nodeId: string) => {
    idsToRemove.add(nodeId);
    const childIds = childrenMap[nodeId] || [];
    childIds.forEach(childId => collectIds(childId));
  };
  collectIds(id);

  // 從父節點的 children 中移除
  const parentId = component.parentId;
  const newChildrenMap = { ...childrenMap };

  if (parentId === null) {
    // 從 rootIds 中移除
    const newRootIds = rootIds.filter(rootId => rootId !== id);

    // 刪除所有相關組件和子節點
    const newComponentsById = { ...componentsById };
    idsToRemove.forEach(removeId => {
      delete newComponentsById[removeId];
      delete newChildrenMap[removeId];
    });

    return {
      componentsById: newComponentsById,
      childrenMap: newChildrenMap,
      rootIds: newRootIds,
    };
  } else {
    // 從父節點的 childrenMap 中移除
    newChildrenMap[parentId] = (childrenMap[parentId] || []).filter(
      childId => childId !== id
    );

    // 刪除所有相關組件和子節點
    const newComponentsById = { ...componentsById };
    idsToRemove.forEach(removeId => {
      delete newComponentsById[removeId];
      delete newChildrenMap[removeId];
    });

    return {
      componentsById: newComponentsById,
      childrenMap: newChildrenMap,
      rootIds,
    };
  }
}

// ========== 移動/重新排序組件 ==========
export function moveComponent(
  state: {
    componentsById: Record<string, FlatComponent>;
    childrenMap: Record<string, string[]>;
    rootIds: string[];
  },
  componentId: string,
  newParentId: string | null,
  insertIndex?: number
): {
  componentsById: Record<string, FlatComponent>;
  childrenMap: Record<string, string[]>;
  rootIds: string[];
} {
  const { componentsById, childrenMap, rootIds } = state;
  const component = componentsById[componentId];
  if (!component) return state;

  const oldParentId = component.parentId;

  // 如果父節點沒變，只是改變順序
  if (oldParentId === newParentId) {
    const siblings = oldParentId === null ? rootIds : childrenMap[oldParentId] || [];
    const oldIndex = siblings.indexOf(componentId);

    if (oldIndex === -1) return state;

    const newSiblings = [...siblings];
    newSiblings.splice(oldIndex, 1);

    const targetIndex = insertIndex !== undefined ? insertIndex : newSiblings.length;
    newSiblings.splice(targetIndex, 0, componentId);

    if (oldParentId === null) {
      return {
        ...state,
        rootIds: newSiblings,
      };
    } else {
      return {
        ...state,
        childrenMap: {
          ...childrenMap,
          [oldParentId]: newSiblings,
        },
      };
    }
  }

  // 跨層級移動
  const newComponentsById = {
    ...componentsById,
    [componentId]: {
      ...component,
      parentId: newParentId,
    },
  };

  const newChildrenMap = { ...childrenMap };
  let newRootIds = [...rootIds];

  // 從舊位置移除
  if (oldParentId === null) {
    newRootIds = rootIds.filter(id => id !== componentId);
  } else {
    newChildrenMap[oldParentId] = (childrenMap[oldParentId] || []).filter(
      id => id !== componentId
    );
  }

  // 插入新位置
  if (newParentId === null) {
    const targetIndex = insertIndex !== undefined ? insertIndex : newRootIds.length;
    newRootIds.splice(targetIndex, 0, componentId);
  } else {
    const siblings = newChildrenMap[newParentId] || [];
    const targetIndex = insertIndex !== undefined ? insertIndex : siblings.length;
    const newSiblings = [...siblings];
    newSiblings.splice(targetIndex, 0, componentId);
    newChildrenMap[newParentId] = newSiblings;
  }

  return {
    componentsById: newComponentsById,
    childrenMap: newChildrenMap,
    rootIds: newRootIds,
  };
}