import React from 'react';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { CmsComponent } from '@src/shared/types';
import { CmsRenderer } from '@src/domains/renderer/Renderer';
import { CmsEntry } from '@src/domains/canvas/CanvasEntry';
import { ComponentToolbar } from '@src/domains/editor/features/ComponentToolbar';
import { SelectableWrapper } from '@src/domains/editor/features/SelectableWrapper';
import { DroppableWrapper } from '@src/domains/editor/features/DroppableWrapper';

export interface EditorRenderProps {
  root: CmsComponent;
  selectedId?: string | null;
  onSelectComponent?: (id: string | null) => void;
  onDeleteComponent?: (id: string) => void;
}

// Helper component for drop zones between components
const DropZone: React.FC<{
  componentId: string;
  parentId: string | null;
  position: 'before';
}> = ({ componentId, parentId }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `dropzone-before-${componentId}`,
    data: {
      type: 'insertion',
      insertBeforeId: componentId,
      parentId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="cms-dropzone relative block w-full flex-[1_1_100%] self-stretch h-2.5 m-0 pointer-events-auto z-[1000] after:content-[''] after:absolute after:left-0 after:right-0 after:top-1/2 after:-translate-y-1/2 after:rounded-[1px] after:transition-all after:duration-[0.12s] after:ease-out"
      style={{
        '--after-height': isOver ? '2px' : '1px',
        '--after-bg': isOver ? '#2196f3' : 'transparent',
      } as React.CSSProperties}
    >
      <style>{`
        .cms-drop-indicator::after {
          height: var(--after-height);
          background: var(--after-bg);
        }
      `}</style>
    </div>
  );
};


export const CmsEditorRenderer: React.FC<EditorRenderProps> = ({
  root,
  selectedId,
  onSelectComponent,
  onDeleteComponent,
}) => {
  const [currentOver, setCurrentOver] = React.useState<any>(null);
  const [selectedComponent, setSelectedComponent] = React.useState<CmsComponent | null>(null);

  // Track global drag over target to de-emphasize container when inserting between children
  useDndMonitor({
    onDragOver(event) {
      setCurrentOver(event.over?.data?.current ?? null);
    },
    onDragEnd() {
      setCurrentOver(null);
    },
    onDragCancel() {
      setCurrentOver(null);
    },
  });

  // 找到選中的組件
  React.useEffect(() => {
    if (!selectedId) {
      setSelectedComponent(null);
      return;
    }

    const findComponent = (comp: CmsComponent): CmsComponent | null => {
      if (comp.id === selectedId) return comp;
      if (comp.children) {
        for (const child of comp.children) {
          const found = findComponent(child);
          if (found) return found;
        }
      }
      return null;
    };

    setSelectedComponent(findComponent(root));
  }, [selectedId, root]);
  const wrapWithEditorFeatures = (
    node: CmsComponent,
    content: React.ReactNode
  ): React.ReactElement => {
    const isContainer = node.type === 'container' || node.type === 'link';
    const isSelected = selectedId === node.id;

    return (
      <SelectableWrapper
        component={node}
        isSelected={isSelected}
        onSelect={onSelectComponent}
      >
        <DroppableWrapper
          component={node}
          enabled={isContainer}
          currentOver={currentOver}
        >
          {content}
        </DroppableWrapper>
      </SelectableWrapper>
    );
  };

  const renderWithEditorFeatures = React.useCallback(
    (component: CmsComponent): React.ReactNode => {
      // 1. 遞迴渲染 children
      const hasChildren = component.children && component.children.length > 0;
      const children = hasChildren
        ? component.children.map((child, index) => (
            <React.Fragment key={child.id}>
              {/* 容器類型（container 或 link）需要在子元素之間添加 DropZone */}
              {(component.type === 'container' || component.type === 'link') && (
                <DropZone
                  componentId={child.id}
                  parentId={component.id}
                  position="before"
                />
              )}
              <div
                className="cms-editor-child"
                data-drop-sibling="1"
                style={{ position: 'relative', zIndex: 0 }}
              >
                {renderWithEditorFeatures(child)}
              </div>
              {/* 容器最後一個子元素後添加 DropZone */}
              {(component.type === 'container' || component.type === 'link') &&
                index === component.children.length - 1 && (
                  <DropZone
                    componentId={`end-${component.id}`}
                    parentId={component.id}
                    position="before"
                  />
                )}
            </React.Fragment>
          ))
        : undefined;

      // 2. 使用 CmsRenderer 渲染組件本身
      const content = (
        <CmsRenderer component={component}>{children}</CmsRenderer>
      );

      // 3. 包裝編輯功能
      return wrapWithEditorFeatures(component, content);
    },
    [selectedId, onSelectComponent]
  );

  return (
    <>
      {wrapWithEditorFeatures(
        root,
        <CmsEntry>
          {root.children.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-[60px_20px] text-[#999] text-sm text-center gap-2 before:content-['📦'] before:text-5xl before:mb-2">
              拖曳或點擊組件到這裡
            </div>
          ) : (
            root.children.map((child: CmsComponent, index: number) => (
              <React.Fragment key={child.id}>
                <DropZone
                  componentId={child.id}
                  parentId={null}
                  position="before"
                />
                {renderWithEditorFeatures(child)}
                {index === root.children.length - 1 && (
                  <DropZone
                    componentId={`end-${root.id}`}
                    parentId={null}
                    position="before"
                  />
                )}
              </React.Fragment>
            ))
          )}
        </CmsEntry>
      )}
      {selectedComponent && onDeleteComponent && (
        <ComponentToolbar
          component={selectedComponent}
          onDelete={onDeleteComponent}
        />
      )}
    </>
  );
};

export default CmsEditorRenderer;
