import { CmsPropertyField } from '@src/shared/types';

export const textConfig: CmsPropertyField[] = [
  { key: 'content', label: '內容', type: 'text' },
  { key: 'fontSize', label: '字體大小', type: 'number', min: 8, max: 72 },
  { key: 'color', label: '顏色', type: 'color' },
];
