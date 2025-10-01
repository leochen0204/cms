import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ViewportType, TreeNode } from '@src/shared/types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/shared/store';
import { selectTreeComponents } from '@src/domains/editor/store/selectors';
import { deleteComponent } from '@src/domains/editor/store/editorSlice';
import CmsEditorRenderer from '@src/domains/renderer/EditorRenderer';

const getViewportLabel = (viewport: ViewportType) => {
  switch (viewport) {
    case 'mobile':
      return '📱 手機 (375px)';
    case 'tablet':
      return '📱 平板 (768px)';
    case 'desktop':
      return '💻 電腦 (1200px)';
    default:
      return '💻 電腦';
  }
};

const getViewportClasses = (viewport: ViewportType) => {
  switch (viewport) {
    case 'mobile':
      return 'w-[375px] h-[667px]';
    case 'tablet':
      return 'w-[768px] h-[1024px]';
    case 'desktop':
      return 'w-full max-w-[1200px] h-auto min-h-[600px]';
    default:
      return 'w-full max-w-[1200px] h-[600px]';
  }
};

interface CanvasProps {
  selectedId: string | null;
  onSelectComponent: (id: string | null) => void;
  viewport: ViewportType;
}

export const CmsCanvas: React.FC<CanvasProps> = ({
  selectedId,
  onSelectComponent,
  viewport,
}) => {
  const dispatch = useDispatch();
  const treeComponents = useSelector(selectTreeComponents);

  // 包裝成 root 格式給 EditorRenderer
  const sectionComponent: TreeNode = {
    id: 'root',
    type: 'container' as const,
    children: treeComponents,
    parentId: null,
    props: {
      backgroundColor: 'transparent',
      padding: 0,
    },
  };

  const viewportRef = React.useRef<HTMLDivElement | null>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
    data: {
      type: 'canvas',
    },
  });

  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const enter = () => {
      window.dispatchEvent(
        new CustomEvent('cms-canvas-hover', { detail: { isHover: true } })
      );
    };
    const leave = () => {
      window.dispatchEvent(
        new CustomEvent('cms-canvas-hover', { detail: { isHover: false } })
      );
    };
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);

  const handleDeleteComponent = (id: string) => {
    dispatch(deleteComponent(id));
  };

  return (
    <div className="cms-canvas-outer bg-bg-secondary border-none rounded-sm m-4 p-5 flex-1 h-[96%] overflow-auto relative min-h-[400px] flex justify-center items-start">
      <div
        className={`cms-canvas-viewport bg-bg-primary relative transition-all duration-300 overflow-auto ${getViewportClasses(viewport)} ${isOver ? 'border-2 border-dashed border-primary bg-primary-light' : 'border-none'}`}
        ref={node => {
          setNodeRef(node);
          viewportRef.current = node;
        }}
      >
        <div className="absolute -top-[30px] left-0 text-xs font-semibold text-text-muted bg-bg-secondary px-1 py-1 rounded border border-border-secondary">
          {getViewportLabel(viewport)}
        </div>
        <div className="cms-canvas-inner w-full h-full overflow-auto relative flex justify-center items-start [&>*]:max-w-full">
          <CmsEditorRenderer
            root={sectionComponent}
            selectedId={selectedId}
            onSelectComponent={onSelectComponent}
            onDeleteComponent={handleDeleteComponent}
          />
        </div>
      </div>
    </div>
  );
};
