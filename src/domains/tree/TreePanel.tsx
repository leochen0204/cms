import React from 'react';
import { CmsComponent } from '@src/shared/types';
import { Panel } from '@src/shared/components/Panel';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  AnimateLayoutChanges,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 常數
const INDENT_SIZE = 20;
const EXTRA_BG_WIDTH = 16;

// 扁平化的 TreeItem 資料
interface FlattenedItem {
  id: string;
  component: CmsComponent;
  depth: number;
  hasChildren: boolean;
  collapsed: boolean;
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => {
  if (isSorting || wasDragging) {
    return false;
  }
  return true;
};

/**
 * 將樹狀結構扁平化為一維陣列，便於渲染
 */
const flattenTree = (
  components: CmsComponent[],
  collapsedIds: Set<string>,
  depth: number = 1
): FlattenedItem[] => {
  return components.reduce<FlattenedItem[]>((acc, component) => {
    const hasChildren = component.children?.length > 0;
    const collapsed = collapsedIds.has(component.id);

    acc.push({
      id: component.id,
      component,
      depth,
      hasChildren,
      collapsed,
    });

    // 遞迴處理子元素（如果未收合）
    if (hasChildren && !collapsed) {
      acc.push(...flattenTree(component.children, collapsedIds, depth + 1));
    }

    return acc;
  }, []);
};

const getIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    text: '📝',
    button: '🔘',
    input: '📝',
    checkbox: '☑️',
    select: '▾',
    image: '🖼️',
    container: '📦',
    video: '🎬',
    link: '🔗',
  };
  return iconMap[type] || '📄';
};

interface SortableTreeItemProps {
  id: string;
  component: CmsComponent;
  depth: number;
  maxDepth: number;
  hasChildren: boolean;
  collapsed: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCollapse: (id: string) => void;
  activeId: string | null;
  overId: string | null;
}

const SortableTreeItem: React.FC<SortableTreeItemProps> = ({
  id,
  component,
  depth,
  maxDepth,
  hasChildren,
  collapsed,
  selectedId,
  onSelect,
  onCollapse,
  activeId,
  overId,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    animateLayoutChanges,
  });

  const isOver = overId === id && activeId !== id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };

  const isSelected = selectedId === id;

  return (
    <div
      className="cms-tree-item block list-none box-border min-w-[var(--tree-panel-width)] w-max p-1 px-2 mb-0 relative cursor-pointer z-0"
      data-cms-id={id}
      data-component-type={component.type}
      data-selected={isSelected}
      onClick={handleClick}
      style={{
        '--before-bg': isSelected
          ? 'var(--cms-primary-lighter)'
          : isOver
            ? 'var(--cms-primary-lightest)'
            : 'transparent',
        '--before-border': isSelected
          ? '3px solid var(--cms-secondary)'
          : '3px solid transparent',
        '--before-width': `calc(var(--cms-tree-panel-width) + ${maxDepth * INDENT_SIZE}px + ${EXTRA_BG_WIDTH}px)`,
        '--hover-bg': isSelected
          ? 'var(--cms-secondary-lighter)'
          : isOver
            ? 'var(--cms-primary-lightest)'
            : 'var(--cms-bg-tertiary)',
      } as React.CSSProperties}
    >
      <div
        ref={setNodeRef}
        className="cms-tree-item-content relative flex items-center text-text-primary box-border gap-1.5 text-[13px] whitespace-nowrap min-w-max"
        style={{
          paddingLeft: `${depth * INDENT_SIZE}px`,
          transform: CSS.Translate.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1,
        }}
        {...attributes}
      >
        <span
          ref={setActivatorNodeRef}
          className="cms-tree-drag-handle flex items-center justify-center w-4 h-4 cursor-grab select-none flex-shrink-0 active:cursor-grabbing [&>svg]:w-3 [&>svg]:h-3 [&>svg]:fill-text-disabled [&>svg]:transition-[fill] [&>svg]:duration-[var(--cms-transition-normal)] hover:[&>svg]:fill-text-muted"
          {...listeners}
        >
          <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </span>
        <span
          className="cms-tree-collapse-btn inline-flex items-center justify-center w-4 h-4 select-none flex-shrink-0 transition-transform duration-[var(--cms-transition-normal)] [&>svg]:w-3 [&>svg]:h-3 [&>svg]:transition-[fill] [&>svg]:duration-[var(--cms-transition-normal)]"
          style={{
            cursor: hasChildren ? 'pointer' : 'default',
            transform:
              hasChildren && !collapsed ? 'rotate(0deg)' : 'rotate(-90deg)',
          }}
          onClick={e => {
            e.stopPropagation();
            if (hasChildren) {
              onCollapse(id);
            }
          }}
        >
          {hasChildren && (
            <svg
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-text-muted hover:fill-text-secondary"
            >
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          )}
        </span>
        <span className="cms-tree-icon text-base">{getIcon(component.type)}</span>
        <span className="cms-tree-label flex-1 min-w-0 overflow-hidden text-ellipsis">
          {component.type}
        </span>
      </div>
    </div>
  );
};

interface CmsTreePanelProps {
  components: CmsComponent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder?: (activeId: string, overId: string) => void;
}

export const CmsTreePanel: React.FC<CmsTreePanelProps> = ({
  components,
  selectedId,
  onSelect,
  onReorder,
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null);
  const [collapsedIds, setCollapsedIds] = React.useState<Set<string>>(
    new Set()
  );

  // 扁平化組件樹
  const flattenedItems = React.useMemo(() => {
    const flattened = flattenTree(components, collapsedIds);

    // 如果正在拖動，移除被拖動項目的子元素（避免拖動到自己的子元素內）
    if (activeId) {
      const activeItem = flattened.find(item => item.id === activeId);
      if (activeItem?.hasChildren) {
        // 收集所有子元素 ID
        const childIds = new Set<string>();
        const collectChildren = (id: string) => {
          const item = flattened.find(f => f.id === id);
          if (item?.component.children) {
            item.component.children.forEach(child => {
              childIds.add(child.id);
              collectChildren(child.id);
            });
          }
        };
        collectChildren(activeId);

        // 過濾掉子元素
        return flattened.filter(item => !childIds.has(item.id));
      }
    }

    return flattened;
  }, [components, collapsedIds, activeId]);

  // 計算最大深度
  const maxDepth = React.useMemo(() => {
    return flattenedItems.reduce((max, item) => Math.max(max, item.depth), 0);
  }, [flattenedItems]);

  // 取得所有 ID 用於 SortableContext
  const sortedIds = React.useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleCollapse = (id: string) => {
    setCollapsedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) {
      setOverId(null);
      return;
    }
    setOverId(over.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      onReorder?.(active.id as string, over.id as string);
    }

    setActiveId(null);
    setOverId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
  };

  return (
    <Panel
      title="組件結構"
      position="left"
      width="var(--cms-tree-panel-width)"
      className="[&::-webkit-scrollbar]:w-[var(--cms-scrollbar-size)] [&::-webkit-scrollbar]:h-[var(--cms-scrollbar-size)] [&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-track]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb:hover]:bg-scrollbar-thumb-hover"
    >
      <style>{`
        .cms-tree-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: var(--before-bg);
          border-left: var(--before-border);
          transition: background-color var(--cms-transition-fast), border-color var(--cms-transition-fast);
          width: var(--before-width);
          z-index: -1;
        }
        .cms-tree-item:hover::before {
          background: var(--hover-bg);
        }
      `}</style>
      <div className="mb-1 px-1 py-1 bg-transparent border border-transparent rounded-none text-[13px] font-semibold flex items-center gap-1.5 text-text-secondary w-full box-border">
        <span className="text-base">🎨</span>
        <span>畫布 (Root)</span>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
          {flattenedItems.map(item => (
            <SortableTreeItem
              key={item.id}
              id={item.id}
              component={item.component}
              depth={item.depth}
              maxDepth={maxDepth}
              hasChildren={item.hasChildren}
              collapsed={item.collapsed}
              selectedId={selectedId}
              onSelect={onSelect}
              onCollapse={handleCollapse}
              activeId={activeId}
              overId={overId}
            />
          ))}
        </SortableContext>
        <DragOverlay zIndex={9999}>{null}</DragOverlay>
      </DndContext>
    </Panel>
  );
};
