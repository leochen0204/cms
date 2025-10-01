import { CmsComponentType, CmsPropertyField } from '@src/shared/types';

export const componentConfigs: Record<CmsComponentType, CmsPropertyField[]> = {
  text: [
    { key: 'content', label: '內容', type: 'text' },
    { key: 'fontSize', label: '字體大小', type: 'number', min: 8, max: 72 },
    {
      key: 'fontWeight',
      label: '字體粗細',
      type: 'select',
      options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
    },
    { key: 'lineHeight', label: '行高', type: 'number', min: 1, max: 3, step: 0.1 },
    { key: 'color', label: '顏色', type: 'color' },
  ],
  image: [
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
    { key: 'borderRadius', label: '圓角 (px)', type: 'number', min: 0, max: 50 },
  ],
  link: [
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
    {
      key: 'underline',
      label: '底線',
      type: 'select',
      options: ['none', 'underline', 'overline', 'line-through'],
    },
  ],
  video: [
    { key: 'src', label: '影片網址', type: 'text' },
    { key: 'poster', label: '封面圖', type: 'text' },
    { key: 'width', label: '寬度 (px)', type: 'number', min: 200, max: 1920 },
    { key: 'height', label: '高度 (px)', type: 'number', min: 150, max: 1080 },
    { key: 'controls', label: '顯示控制列', type: 'boolean' },
    { key: 'autoplay', label: '自動播放', type: 'boolean' },
    { key: 'loop', label: '循環播放', type: 'boolean' },
    { key: 'muted', label: '靜音', type: 'boolean' },
  ],
  container: [
    { key: 'width', label: '寬度', type: 'size', min: 50, max: 2000 },
    { key: 'height', label: '高度', type: 'size', min: 50, max: 2000 },
    { key: 'backgroundColor', label: '背景色', type: 'color' },
    { key: 'padding', label: '內邊距', type: 'number', min: 0, max: 50 },
    { key: 'borderColor', label: '邊框色', type: 'color' },
    { key: 'borderWidth', label: '邊框寬度 (px)', type: 'number', min: 0, max: 20 },
    { key: 'borderRadius', label: '圓角 (px)', type: 'number', min: 0, max: 50 },
    {
      key: 'borderStyle',
      label: '邊框樣式',
      type: 'select',
      options: ['none', 'solid', 'dashed', 'dotted'],
    },
    // Flex 屬性
    {
      key: 'flexDirection',
      label: '排列方向',
      type: 'select',
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
    },
    {
      key: 'justifyContent',
      label: '主軸對齊',
      type: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
    },
    {
      key: 'alignItems',
      label: '交叉軸對齊',
      type: 'select',
      options: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'],
    },
    {
      key: 'flexWrap',
      label: '換行',
      type: 'select',
      options: ['nowrap', 'wrap', 'wrap-reverse'],
    },
    { key: 'gap', label: '間距 (px)', type: 'number', min: 0, max: 50 },
  ],
};

export function getComponentConfig(type: CmsComponentType): CmsPropertyField[] {
  return componentConfigs[type] || [];
}
