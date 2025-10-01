import React from 'react';

interface CmsEntryProps {
  children?: React.ReactNode;
}

export const CmsEntry: React.FC<CmsEntryProps> = ({ children }) => {
  return (
    <div className="cms-entry" data-cms-entry="true">
      {children}
    </div>
  );
};
