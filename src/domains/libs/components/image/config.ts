import { CmsPropertyField } from '@src/shared/types';

export const imageConfig: CmsPropertyField[] = [
  { key: 'src', label: '圖片網址', type: 'text' },
  { key: 'alt', label: '替代文字', type: 'text' },
  { key: 'width', label: '寬度 (px)', type: 'number', min: 50, max: 1000 },
  { key: 'height', label: '高度 (px)', type: 'number', min: 20, max: 1000 },
  {
    key: 'objectFit',
    label: '縮放模式',
    type: 'select',
    options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
  },
  { key: 'objectPosition', label: '對齊位置 (CSS)', type: 'text' },
  {
    key: 'borderRadius',
    label: '圓角 (px)',
    type: 'number',
    min: 0,
    max: 200,
  },
];
