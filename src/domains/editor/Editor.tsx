import React from 'react';
import { useCmsEditor } from '@src/domains/editor/hooks/useCmsEditor';
import { ComponentLibrary } from '@src/domains/library/Library';
import { CmsCanvas } from '@src/domains/canvas/Canvas';
import { CmsPropertyPanel } from '@src/domains/property/PropertyPanel';
import { CmsTreePanel } from '@src/domains/tree/TreePanel';
import { CmsEditorHeader } from '@src/domains/editor/EditorHeader';
import { DndProvider } from '@src/domains/canvas/DndProvider';

export default function CmsEditor() {
  const {
    components,
    selectedId,
    selectedComponent,
    currentViewport,
    addComponent,
    selectComponent,
    updateComponentProps,
    setViewport,
    clearSection,
    reorderComponents,
  } = useCmsEditor();

  return (
    <DndProvider
      onAddComponent={addComponent}
      selectedId={selectedId}
    >
      <div className="cms-editor-root fixed top-0 left-0 w-full h-full bg-bg-tertiary flex flex-col">
        <CmsEditorHeader
          currentViewport={currentViewport}
          onViewportChange={setViewport}
          onClear={() => {
            clearSection();
          }}
        />
        <div className="cms-editor-main flex-1 overflow-hidden flex flex-row items-start h-[calc(100vh-var(--cms-header-height))]">
          <div className="cms-library-container bg-bg-primary border-r border-border-primary w-[var(--cms-tree-panel-width)] flex-shrink-0 overflow-y-auto overflow-x-hidden h-full max-h-[calc(100vh-var(--cms-header-height))] [&::-webkit-scrollbar]:w-[var(--cms-scrollbar-size)] [&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-track]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb:hover]:bg-scrollbar-thumb-hover">
            <ComponentLibrary
              onAddComponent={addComponent}
              selectedComponent={selectedComponent}
            />
          </div>
          <CmsTreePanel
            components={components}
            selectedId={selectedId}
            onSelect={selectComponent}
            onReorder={reorderComponents}
          />
          <CmsCanvas
            selectedId={selectedId}
            onSelectComponent={selectComponent}
            viewport={currentViewport}
          />
          <CmsPropertyPanel
            selectedComponent={selectedComponent}
            onUpdateProps={updateComponentProps}
          />
        </div>
      </div>
    </DndProvider>
  );
}
