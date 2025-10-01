import React from 'react';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  width?: string;
  className?: string;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  children,
  position = 'left',
  width,
  className = '',
}) => {
  const borderClass = position === 'left' ? 'border-r' : 'border-l';
  const widthStyle = width ? { width } : {};

  return (
    <div
      className={`bg-bg-primary ${borderClass} border-border-primary flex-shrink-0 overflow-y-auto overflow-x-auto p-4 h-full max-h-[calc(100vh-var(--cms-header-height))] ${className}`}
      style={widthStyle}
    >
      <h3 className="m-0 mb-4 text-base font-semibold text-text-secondary">
        {title}
      </h3>
      {children}
    </div>
  );
};
