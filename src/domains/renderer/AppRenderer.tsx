import React from 'react';
import { CmsComponent } from '@src/shared/types';
import { CmsRenderer } from '@src/domains/renderer/Renderer';
import { CmsEntry } from '@src/domains/canvas/CanvasEntry';

interface CmsAppRendererProps {
  root: CmsComponent;
}

/**
 * 應用渲染器 - 純顯示模式
 * 職責：遍歷組件樹並使用 CmsRenderer 渲染每個組件
 */
export const CmsAppRenderer: React.FC<CmsAppRendererProps> = ({ root }) => {
  // 遞迴渲染組件
  const renderComponent = React.useCallback(
    (component: CmsComponent): React.ReactNode => {
      // 遞迴渲染 children
      const children = component.children?.map(child =>
        renderComponent(child)
      );

      // 使用 CmsRenderer 渲染組件本身
      return (
        <CmsRenderer key={component.id} component={component}>
          {children}
        </CmsRenderer>
      );
    },
    []
  );

  const items = Array.isArray(root.children) ? root.children : [];

  return (
    <CmsEntry>
      {items.map(child => renderComponent(child))}
    </CmsEntry>
  );
};
