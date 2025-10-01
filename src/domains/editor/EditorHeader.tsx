import React from 'react';
import { ViewportType } from '@src/shared/types';

interface CmsEditorHeaderProps {
  currentViewport: ViewportType;
  onViewportChange: (viewport: ViewportType) => void;
  onSave?: () => void;
  onPreview?: () => void;
  onClear?: () => void;
  onClose?: () => void;
}

export const CmsEditorHeader: React.FC<CmsEditorHeaderProps> = ({
  currentViewport,
  onViewportChange,
  onSave,
  onPreview,
  onClear,
  onClose,
}) => {

  return (
    <div className="cms-editor-header bg-bg-primary border-b border-border-primary px-4 py-3 h-[var(--cms-header-height)] flex-shrink-0 flex items-center justify-between">
      <div className="cms-editor-header-left flex items-center gap-2">
        <h3 className="m-0 text-base font-semibold text-text-secondary">選單編輯器</h3>
      </div>

      <div className="cms-editor-header-right flex items-center gap-2">
        <div className="cms-viewport-switcher flex items-center gap-1 mr-4 pr-4 border-r border-border-primary">
          <button
            onClick={() => onViewportChange('mobile')}
            className={`px-3 py-1.5 border rounded cursor-pointer text-xs min-w-[60px] ${
              currentViewport === 'mobile'
                ? 'bg-primary text-white border-primary hover:bg-primary hover:border-primary hover:text-white'
                : 'bg-transparent text-text-muted border-border-secondary hover:bg-bg-secondary hover:border-border-tertiary hover:text-text-secondary'
            }`}
          >
            📱 手機
          </button>
          <button
            onClick={() => onViewportChange('tablet')}
            className={`px-3 py-1.5 border rounded cursor-pointer text-xs min-w-[60px] ${
              currentViewport === 'tablet'
                ? 'bg-primary text-white border-primary hover:bg-primary hover:border-primary hover:text-white'
                : 'bg-transparent text-text-muted border-border-secondary hover:bg-bg-secondary hover:border-border-tertiary hover:text-text-secondary'
            }`}
          >
            📱 平板
          </button>
          <button
            onClick={() => onViewportChange('desktop')}
            className={`px-3 py-1.5 border rounded cursor-pointer text-xs min-w-[60px] ${
              currentViewport === 'desktop'
                ? 'bg-primary text-white border-primary hover:bg-primary hover:border-primary hover:text-white'
                : 'bg-transparent text-text-muted border-border-secondary hover:bg-bg-secondary hover:border-border-tertiary hover:text-text-secondary'
            }`}
          >
            💻 電腦
          </button>
        </div>

        {onPreview && (
          <button
            onClick={onPreview}
            className="px-3 py-1.5 border border-border-secondary rounded bg-transparent text-text-muted cursor-pointer text-xs min-w-[60px] hover:bg-bg-secondary hover:border-border-tertiary"
          >
            預覽
          </button>
        )}
        {onClear && (
          <button
            onClick={onClear}
            className="px-3 py-1.5 border border-border-secondary rounded bg-transparent text-text-muted cursor-pointer text-xs min-w-[60px] hover:bg-bg-secondary hover:border-border-tertiary"
          >
            清空
          </button>
        )}
        {onSave && (
          <button
            onClick={onSave}
            className="px-3 py-1.5 border border-primary rounded bg-primary text-white cursor-pointer text-xs min-w-[60px] hover:bg-primary-hover hover:border-primary-hover"
          >
            儲存
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-border-secondary rounded bg-transparent text-text-muted cursor-pointer text-xs min-w-[60px] hover:bg-bg-secondary hover:border-border-tertiary"
          >
            關閉
          </button>
        )}
      </div>
    </div>
  );
};
