import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CmsComponent } from '@src/shared/types';

interface ComponentToolbarProps {
  component: CmsComponent;
  onDelete: (id: string) => void;
}

export const ComponentToolbar: React.FC<ComponentToolbarProps> = ({
  component,
  onDelete,
}) => {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 只在 canvas 區域內查找選中組件的 wrapper 元素
    const canvasInner = document.querySelector('.cms-canvas-inner');
    if (!canvasInner) {
      console.warn('ComponentToolbar: Canvas inner not found');
      return;
    }

    const element = canvasInner.querySelector(
      `[data-cms-id="${component.id}"]`
    ) as HTMLElement;

    if (!element) {
      console.warn('ComponentToolbar: Target element not found for component:', component.id);
      return;
    }

    setTargetElement(element);
  }, [component.id]);

  if (!targetElement) return null;

  const toolbar = (
    <div
      className="cms-floating-toolbar absolute -top-6 left-0 flex gap-1 items-center z-[10000] pointer-events-auto"
    >
      <div className="cms-editor-label text-[10px] text-text-muted bg-bg-secondary/95 backdrop-blur-sm px-2 py-0.5 rounded border border-border-secondary whitespace-nowrap font-medium capitalize pointer-events-none">
        {component.type}
      </div>
      <button
        className="cms-editor-delete-btn flex items-center justify-center w-4 h-4 p-0 border border-border-secondary rounded bg-bg-secondary/95 backdrop-blur-sm text-text-muted text-xs cursor-pointer pointer-events-auto transition-all duration-200 hover:bg-danger hover:border-danger hover:text-white"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(component.id);
        }}
        title="刪除組件"
      >
        ×
      </button>
    </div>
  );

  // 使用 Portal 將工具列渲染到目標元素內部
  return createPortal(toolbar, targetElement);
};
