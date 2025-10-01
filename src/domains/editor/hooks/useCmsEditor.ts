import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/shared/store';
import {
  addComponent,
  selectComponent,
  updateComponentProps,
  deleteComponent,
  resetEditor,
  setViewport,
  clearSectionComponents,
  reorderComponents,
} from '@src/domains/editor/store/editorSlice';
import {
  selectTreeComponents,
  selectSelectedId,
  selectSelectedTreeComponent,
  selectCurrentViewport,
} from '@src/domains/editor/store/selectors';
import {
  CmsComponentType,
  ComponentProps,
  ViewportType,
} from '@src/shared/types';

export const useCmsEditor = () => {
  const dispatch = useDispatch();

  // 使用 selector 取得資料（自動 memoized）
  const components = useSelector(selectTreeComponents);
  const selectedId = useSelector(selectSelectedId);
  const selectedComponent = useSelector(selectSelectedTreeComponent);
  const currentViewport = useSelector(selectCurrentViewport);

  return {
    components,
    selectedId,
    selectedComponent,
    currentViewport,
    addComponent: (
      type: CmsComponentType,
      parentId?: string | null,
      customProps?: Partial<ComponentProps>,
      insertBeforeId?: string
    ) => {
      dispatch(addComponent({ type, parentId, customProps, insertBeforeId }));
    },
    selectComponent: (id: string | null) => {
      dispatch(selectComponent(id));
    },
    updateComponentProps: (id: string, props: Partial<ComponentProps>) => {
      dispatch(updateComponentProps({ id, props }));
    },
    deleteComponent: (id: string) => {
      dispatch(deleteComponent(id));
    },
    resetEditor: () => {
      dispatch(resetEditor());
    },
    setViewport: (viewport: ViewportType) => {
      dispatch(setViewport(viewport));
    },
    clearSection: () => {
      dispatch(clearSectionComponents());
    },
    reorderComponents: (activeId: string, overId: string) => {
      dispatch(reorderComponents({ activeId, overId }));
    },
  };
};