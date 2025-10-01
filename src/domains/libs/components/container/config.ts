import { CmsPropertyField } from '@src/shared/types';

export const containerConfig: CmsPropertyField[] = [
  { key: 'backgroundColor', label: '背景色', type: 'color' },
  { key: 'padding', label: '內邊距', type: 'number', min: 0, max: 50 },
  { key: 'borderColor', label: '邊框色', type: 'color' },
  { key: 'borderWidth', label: '邊框寬度 (px)', type: 'number', min: 0, max: 20 },
  { key: 'borderRadius', label: '圓角 (px)', type: 'number', min: 0, max: 200 },
  {
    key: 'borderStyle',
    label: '邊框樣式',
    type: 'select',
    options: ['none', 'solid', 'dashed', 'dotted'],
  },
  {
    key: 'layout',
    label: '佈局模式',
    type: 'select',
    options: ['block', 'flex', 'grid'],
  },
  // Flex 屬性
  {
    key: 'flexDirection',
    label: 'Flex 排列方向',
    type: 'select',
    options: ['row', 'column', 'row-reverse', 'column-reverse'],
  },
  {
    key: 'justifyContent',
    label: 'Flex 主軸對齊',
    type: 'select',
    options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
  },
  {
    key: 'alignItems',
    label: 'Flex 交叉軸對齊',
    type: 'select',
    options: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'],
  },
  {
    key: 'flexWrap',
    label: 'Flex 換行',
    type: 'select',
    options: ['nowrap', 'wrap', 'wrap-reverse'],
  },
  // Grid 屬性
  { key: 'gridTemplateColumns', label: 'Grid 欄位', type: 'text' },
  { key: 'gridTemplateRows', label: 'Grid 列', type: 'text' },
  {
    key: 'gridJustifyItems',
    label: 'Grid 欄位對齊',
    type: 'select',
    options: ['start', 'center', 'end', 'stretch'],
  },
  {
    key: 'gridAlignItems',
    label: 'Grid 列對齊',
    type: 'select',
    options: ['start', 'center', 'end', 'stretch'],
  },
  // 通用間距
  { key: 'gap', label: '間距 (px)', type: 'number', min: 0, max: 50 },
];
