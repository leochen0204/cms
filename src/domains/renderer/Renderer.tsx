import React from 'react';
import { CmsComponent } from '@src/shared/types';
import { ErrorBoundary } from '@src/shared/components/ErrorBoundary';
import { ComponentFactory } from '@src/domains/libs/components/factory/ComponentFactory';

// 錯誤 fallback 樣式
const ERROR_FALLBACK_STYLE: React.CSSProperties = {
  padding: '8px',
  border: '1px solid #ff6b6b',
  borderRadius: '4px',
  backgroundColor: '#ffe0e0',
  color: '#d63031',
  fontSize: '12px',
  display: 'inline-block',
  minWidth: '80px',
  minHeight: '30px',
};

// 未知組件錯誤組件
const UnknownComponentError: React.FC<{ type: string }> = ({ type }) => (
  <div style={ERROR_FALLBACK_STYLE}>未知組件類型: {type}</div>
);

export interface CmsRendererProps {
  component: CmsComponent;
  children?: React.ReactNode; // 接收已渲染好的 children
}

/**
 * 基礎組件渲染器
 * 職責：將單個 CmsComponent 轉換為 React Element
 * 不負責遞迴處理 children，由上層 Renderer 處理
 */
export const CmsRenderer: React.FC<CmsRendererProps> = React.memo(
  ({ component, children }) => {
    // 使用 useMemo 優化組件渲染
    const renderedComponent = React.useMemo(() => {
      if (!ComponentFactory.has(component.type)) {
        return <UnknownComponentError type={component.type} />;
      }

      return ComponentFactory.create(component.type, component.props, children);
    }, [component.type, component.props, children]);

    return (
      <ErrorBoundary
        fallback={<div style={ERROR_FALLBACK_STYLE}>{component.type} 錯誤</div>}
      >
        {renderedComponent}
      </ErrorBoundary>
    );
  }
);
