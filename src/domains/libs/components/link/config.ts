import { CmsPropertyField } from '@src/shared/types';

export const linkConfig: CmsPropertyField[] = [
  { key: 'text', label: '文字', type: 'text' },
  { key: 'href', label: '連結 URL', type: 'text' },
  {
    key: 'target',
    label: '開啟方式',
    type: 'select',
    options: ['_self', '_blank', '_parent', '_top'],
  },
  { key: 'rel', label: 'Rel 屬性', type: 'text' },
  { key: 'color', label: '顏色', type: 'color' },
  { key: 'underline', label: '底線', type: 'boolean' },
];
