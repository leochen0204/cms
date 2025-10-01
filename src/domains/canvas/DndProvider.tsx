import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { CmsComponentType, CmsComponent } from '@src/shared/types';

interface DragData {
  type: CmsComponentType;
  source: 'library';
  defaultProps?: any;
}

interface DndProviderProps {
  children: React.ReactNode;
  selectedId?: string | null;
  onAddComponent: (
    type: CmsComponentType,
    parentId?: string | null,
    customProps?: any,
    insertBeforeId?: string
  ) => void;
}

export const DndProvider: React.FC<DndProviderProps> = ({
  children,
  selectedId,
  onAddComponent,
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeData, setActiveData] = React.useState<DragData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveData(active.data.current as DragData);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const dragData = active.data.current as DragData;
    if (dragData && dragData.source === 'library') {
      if (over) {
        const overData = over.data.current;

        if (overData?.type === 'insertion') {
          // Drop between components
          const { insertBeforeId, parentId } = overData;
          onAddComponent(
            dragData.type,
            parentId,
            undefined,
            insertBeforeId?.startsWith('end-') ? undefined : insertBeforeId
          );
        } else if (over.id === 'canvas') {
          // Drop to root level (or after selected component if exists)
          if (selectedId) {
            // Insert after selected component at same level
            onAddComponent(dragData.type, undefined, undefined, selectedId);
          } else {
            onAddComponent(dragData.type);
          }
        } else if (overData?.type === 'container' || overData?.type === 'link') {
          // Drop into container or link
          const parentId = over.id as string;
          onAddComponent(dragData.type, parentId);
        }
      } else if (selectedId) {
        // No drop target, but has selected component
        // Insert after selected component at same level
        console.log('Insert after selected component:', selectedId);
        onAddComponent(dragData.type, undefined, undefined, selectedId);
      }
    }

    setActiveId(null);
    setActiveData(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveData(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay modifiers={[snapCenterToCursor]}>
        {activeId && activeData ? (
          <div
            style={{
              width: (activeData as any).previewWidth ?? 120,
              height: (activeData as any).previewHeight ?? 88,
              background: 'rgba(0, 123, 255, 0.1)',
              border: '2px dashed #007bff',
              borderRadius: '6px',
              opacity: 0.8,
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
