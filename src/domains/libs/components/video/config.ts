import { CmsPropertyField } from '@src/shared/types';

export const videoConfig: CmsPropertyField[] = [
  { key: 'src', label: '影片網址', type: 'text' },
  { key: 'poster', label: '封面圖', type: 'text' },
  { key: 'controls', label: '顯示控制列', type: 'boolean' },
  { key: 'autoplay', label: '自動播放', type: 'boolean' },
  { key: 'loop', label: '循環播放', type: 'boolean' },
  { key: 'muted', label: '靜音', type: 'boolean' },
];
