export type CmsComponentType =
  | 'text'
  | 'image'
  | 'container'
  | 'video'
  | 'link';

export type ViewportType = 'mobile' | 'tablet' | 'desktop';

export interface ViewportConfig {
  type: ViewportType;
  width: number;
  height: number;
  name: string;
}

// ========== Props 層 - 純粹的組件屬性 ==========
export interface TextProps {
  content: string;
  fontSize: number;
  color: string;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  lineHeight?: number;
}

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string; // e.g. 'center center', '50% 0'
  borderRadius?: number;
}

export interface ContainerProps {
  width?: number | string; // 支援數字 (自動轉為 px) 或 CSS 值 ('auto', '100%', 'fit-content' 等)
  height?: number | string; // 支援數字 (自動轉為 px) 或 CSS 值 ('auto', '100%', 'fit-content' 等)
  backgroundColor: string;
  padding: number;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderRadius?: number;
  // Flex 佈局屬性
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around';
  alignItems?: 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: number;
}

export interface VideoProps {
  src: string;
  width?: number;
  height?: number;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  poster?: string;
}

export interface LinkProps {
  href: string;
  text: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
  color?: string;
  underline?: 'none' | 'underline' | 'overline' | 'line-through';
}

// 聯合類型
export type ComponentProps =
  | TextProps
  | ImageProps
  | ContainerProps
  | VideoProps
  | LinkProps;

// ========== 節點層 - CMS 資料結構 ==========
export interface CmsBaseNode {
  id: string;
  type: CmsComponentType;
  parentId: string | null;
}

// ========== 扁平化節點（儲存層 - Single Source of Truth）==========
export interface FlatNode extends CmsBaseNode {
  props: ComponentProps;
}

// ========== 樹狀節點（UI 層 - View Model）==========
export interface TreeNode extends CmsBaseNode {
  props: ComponentProps;
  children: TreeNode[];
}

// 向後兼容的別名
export type FlatComponent = FlatNode;
export type TreeComponent = TreeNode;
export type CmsComponent = TreeNode;

// Section 樣式屬性
export interface CmsSectionStyle {
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderRadius?: number;
  margin?: number;
  padding?: number;
}

export interface CmsEditorState {
  // 扁平化儲存，快速查找 O(1)
  componentsById: Record<string, FlatComponent>;

  // 維護父子關係（有序）
  childrenMap: Record<string, string[]>; // parentId -> [childId1, childId2, ...]
  rootIds: string[]; // root 層級的 ID 列表（有序）

  // UI 狀態
  selectedId: string | null;
  currentViewport: ViewportType;
}

// 屬性面板欄位定義
export interface CmsPropertyField {
  key: string;
  label: string;
  type:
    | 'text'
    | 'number'
    | 'color'
    | 'boolean'
    | 'select'
    | 'position'
    | 'size';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}
