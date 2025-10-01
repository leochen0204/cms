import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CmsComponentType, ComponentProps, CmsComponent } from '@src/shared/types';
import { COMPONENT_DEFAULTS } from '@src/domains/libs/components/componentDefaults';
import { Panel } from '@src/shared/components/Panel';

interface DraggableComponentItemProps {
  component: ComponentLibraryItem;
  selectedComponent?: CmsComponent | null;
  onAddComponent: (
    type: CmsComponentType,
    parentId?: string | null,
    customProps?: any,
    insertBeforeId?: string
  ) => void;
}

const DraggableComponentItem: React.FC<DraggableComponentItemProps> = ({
  component,
  selectedComponent,
  onAddComponent,
}) => {
  const itemRef = React.useRef<HTMLDivElement | null>(null);
  const [previewSize, setPreviewSize] = React.useState<{
    width: number;
    height: number;
  } | null>(null);

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: component.type,
    data: {
      type: component.type,
      source: 'library',
      defaultProps: component.defaultProps,
      previewWidth: previewSize?.width,
      previewHeight: previewSize?.height,
    },
  });

  const composedRef = (node: HTMLDivElement | null) => {
    itemRef.current = node;
    setNodeRef(node);
  };

  React.useLayoutEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setPreviewSize({ width: rect.width, height: rect.height });
    };
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const handleClick = () => {
    // 如果選中的是容器或連結，插入到容器內
    if (selectedComponent?.type === 'container' || selectedComponent?.type === 'link') {
      onAddComponent(component.type, selectedComponent.id);
    } else if (selectedComponent) {
      // 如果選中的是普通組件，插入到組件前面
      onAddComponent(
        component.type,
        undefined,
        undefined,
        selectedComponent.id
      );
    } else {
      // 沒有選中，加到根層級
      onAddComponent(component.type);
    }
  };

  return (
    <div
      ref={composedRef}
      onClick={handleClick}
      className="cms-library-item flex flex-col items-center justify-center p-2 h-[88px] bg-bg-primary border border-border-primary rounded-sm cursor-pointer transition-all duration-150 font-medium text-sm select-none hover:bg-bg-secondary hover:border-border-light hover:shadow-sm"
      data-component-type={component.type}
      {...listeners}
      {...attributes}
    >
      <span className="cms-library-icon text-2xl mb-1.5">{component.icon}</span>
      <span className="cms-library-name text-text-secondary text-xs text-center">{component.name}</span>
    </div>
  );
};

interface ComponentLibraryProps {
  selectedComponent?: CmsComponent | null;
  onAddComponent: (
    type: CmsComponentType,
    parentId?: string | null,
    customProps?: any,
    insertBeforeId?: string
  ) => void;
}

type ComponentLibraryItem = {
  type: CmsComponentType;
  name: string;
  icon: string;
  defaultProps: Partial<ComponentProps>;
};

// 基礎元件
const basicComponents: ComponentLibraryItem[] = [
  {
    type: 'text',
    name: '文字',
    icon: '📝',
    defaultProps: COMPONENT_DEFAULTS.text,
  },
  {
    type: 'image',
    name: '圖片',
    icon: '🖼️',
    defaultProps: COMPONENT_DEFAULTS.image,
  },
  {
    type: 'link',
    name: '連結',
    icon: '🔗',
    defaultProps: COMPONENT_DEFAULTS.link,
  },
  {
    type: 'video',
    name: '影片',
    icon: '🎬',
    defaultProps: COMPONENT_DEFAULTS.video,
  },
  {
    type: 'container',
    name: '容器',
    icon: '📦',
    defaultProps: COMPONENT_DEFAULTS.container,
  },
];

// 向後兼容
export const componentLibrary: ComponentLibraryItem[] = basicComponents;

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  selectedComponent,
  onAddComponent,
}) => {
  return (
    <Panel title="組件庫" position="left" width="var(--cms-tree-panel-width)">
      {/* 基礎元件 */}
      <div>
        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 px-1">
          基礎元件
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {basicComponents.map(component => (
            <DraggableComponentItem
              key={component.type}
              component={component}
              selectedComponent={selectedComponent}
              onAddComponent={onAddComponent}
            />
          ))}
        </div>
      </div>
    </Panel>
  );
};
