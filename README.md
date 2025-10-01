# CMS Editor

基於 React 和 TypeScript 的可視化內容管理編輯器，提供直觀的拖拽式組件編輯體驗。

## 特色功能

- 🎨 **可視化編輯** - 所見即所得的組件編輯介面
- 📱 **響應式預覽** - 支援手機、平板、桌面三種視窗模式切換
- 🧩 **組件庫** - 內建文字、圖片、影片、連結、容器等組件
- 🎯 **拖拽操作** - 直覺的拖放式組件管理
- ⚙️ **即時編輯** - 屬性面板即時調整組件樣式與內容

## 技術架構

### 核心技術

- **React 17** - UI 框架
- **TypeScript** - 型別安全
- **Redux Toolkit** - 狀態管理
- **Vite** - 建構工具與開發伺服器
- **Styled Components** - CSS-in-JS 樣式解決方案
- **Tailwind CSS** - 工具類樣式框架
- **@dnd-kit** - 拖拽功能實作

### 專案結構

```
src/
├── domains/              # 功能領域模組
│   ├── canvas/          # 畫布區域
│   ├── editor/          # 編輯器核心邏輯
│   ├── library/         # 組件庫面板
│   ├── libs/            # 基礎組件定義
│   ├── property/        # 屬性編輯面板
│   ├── renderer/        # 組件渲染引擎
│   └── tree/            # 組件樹結構面板
├── shared/              # 共用資源
│   ├── components/      # 共用 UI 組件
│   ├── store/           # Redux Store 配置
│   └── types/           # TypeScript 型別定義
└── styles/              # 全域樣式
```

## 快速開始

### 安裝依賴

```bash
yarn install
```

### 開發模式

```bash
yarn dev
```

開發伺服器將在 `http://localhost:3001` 啟動

### 建構專案

```bash
yarn build
```

建構流程包含三個步驟：

1. **TypeScript 型別檢查** (`tsc`) - 確保程式碼型別正確
2. **主應用程式建構** (`vite build`) - 輸出編輯器與預覽頁面
   - 編輯器：`index.html` → `dist/index.html`
   - 預覽頁面：`preview.html` → `dist/preview.html`
   - 產生 source maps 與 manifest 檔案
3. **獨立渲染器建構** (`yarn build:iife`) - 產出可嵌入的 IIFE 格式 JS
   - 進入點：`src/domains/renderer/standaloneRenderer.ts`
   - 輸出：`dist/cms-app-renderer.[hash].js`
   - 格式：IIFE (Immediately Invoked Function Expression)
   - 用途：可獨立嵌入任何網頁的渲染引擎

所有建構產物將輸出至 `dist/` 目錄

### 預覽建構結果

```bash
yarn preview
```

## 開發指令

```bash
# 型別檢查
yarn type-check

# 程式碼檢查
yarn lint

# 自動修復 ESLint 問題
yarn lint:fix

# 格式化程式碼
yarn format

# 檢查程式碼格式
yarn format:check
```

## 核心概念

### 組件系統

編輯器使用 **ComponentFactory** 模式管理組件註冊與實例化，所有組件定義於 `src/domains/libs/components/`。

**支援的組件類型：**
- `text` - 文字區塊
- `image` - 圖片
- `video` - 影片
- `link` - 超連結
- `container` - 容器（可包含子組件）

### 狀態管理

使用 Redux Toolkit 管理全域狀態：

- **組件樹結構** - 儲存所有組件的層級關係
- **選中狀態** - 追蹤當前選中的組件
- **視窗模式** - 記錄當前預覽模式（mobile/tablet/desktop）

### 路徑別名

專案配置 `@src/*` 路徑別名，避免使用相對路徑：

```typescript
import { CmsComponent } from '@src/shared/types';
import { useAppDispatch } from '@src/shared/store';
```

## 部署

建構完成後，將 `dist/` 目錄部署至任何靜態檔案伺服器即可。

## License

MIT
