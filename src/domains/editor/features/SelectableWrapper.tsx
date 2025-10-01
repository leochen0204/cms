import React from 'react';
import { CmsComponent } from '@src/shared/types';

interface SelectableWrapperProps {
  component: CmsComponent;
  isSelected: boolean;
  onSelect?: (id: string | null) => void;
  children: React.ReactNode;
}

/**
 * 選取功能包裝器
 * 職責：處理組件選取狀態和點擊事件
 */
export const SelectableWrapper: React.FC<SelectableWrapperProps> = ({
  component,
  isSelected,
  onSelect,
  children,
}) => {
  const handleClickCapture = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (target) {
      const anchor = (target.closest && target.closest('a')) as HTMLAnchorElement | null;
      if (anchor) {
        e.preventDefault();
      }
    }
  };

  const handleMouseDownCapture = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (target) {
      const anchor = (target.closest && target.closest('a')) as HTMLAnchorElement | null;
      if (anchor && (e.metaKey || e.ctrlKey || e.button === 1)) {
        e.preventDefault();
      }
    }
  };

  const handleAuxClickCapture = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (target) {
      const anchor = (target.closest && target.closest('a')) as HTMLAnchorElement | null;
      if (anchor) {
        e.preventDefault();
      }
    }
  };

  return (
    <div
      data-cms-id={component.id}
      data-component-type={component.type}
      data-selected={isSelected}
      className={`cms-editor-wrapper rounded cms-component-wrapper cursor-pointer inline-block relative self-start p-1 transition-all duration-200 ${
        isSelected
          ? 'border-2 border-solid border-[#007bff] bg-[#f0f8ff]'
          : 'border-2 border-transparent'
      } hover:not(:has([data-wrapper='1']:hover)):bg-[#f8f9fa] [&[data-selected='true']]:border-[#007bff] [&[data-selected='true']]:bg-[#f0f8ff]`}
      data-wrapper="1"
      onClickCapture={handleClickCapture}
      onMouseDownCapture={handleMouseDownCapture}
      onAuxClickCapture={handleAuxClickCapture}
      onContextMenuCapture={(e: React.MouseEvent) => {
        e.preventDefault();
      }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect?.(component.id);
      }}
    >
      {children}
    </div>
  );
};
