import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CmsComponent } from '@src/shared/types';

interface DroppableWrapperProps {
  component: CmsComponent;
  enabled: boolean;
  currentOver: any;
  children: React.ReactNode;
}

/**
 * 拖放功能包裝器
 * 職責：處理容器類型組件（Container/Grid）的拖放接收
 */
export const DroppableWrapper: React.FC<DroppableWrapperProps> = ({
  component,
  enabled,
  currentOver,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: component.id,
    data: {
      type: component.type, // 使用組件實際類型，而非固定 'container'
      componentId: component.id,
    },
    disabled: !enabled,
  });

  // 如果正在拖放到此容器內部的插入點，不要高亮容器本身
  const isOverInsertionInside =
    currentOver?.type === 'insertion' && currentOver?.parentId === component.id;
  const effectiveIsOver = isOver && !isOverInsertionInside;

  const isDraggingOver = effectiveIsOver && enabled;

  return (
    <div
      ref={enabled ? setNodeRef : undefined}
      className={isDraggingOver ? 'border-2 !border-dashed !border-[#28a745] !bg-[rgba(40,167,69,0.1)]' : ''}
    >
      {children}
    </div>
  );
};
