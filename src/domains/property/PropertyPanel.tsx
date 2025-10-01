import React from 'react';
import { useCmsEditor } from '@src/domains/editor/hooks/useCmsEditor';
import { CmsComponent, CmsComponentType, CmsPropertyField } from '@src/shared/types';
import { Panel } from '@src/shared/components/Panel';
import { getComponentConfig } from '@src/domains/libs/components/configs';
import { Input } from '@src/shared/components/ui/input';
import { Label } from '@src/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@src/shared/components/ui/select';
import { Switch } from '@src/shared/components/ui/switch';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@src/shared/components/ui/popover';

interface PropertyPanelProps {
  selectedComponent: CmsComponent | null;
  onUpdateProps: (id: string, props: Partial<CmsComponent['props']>) => void;
}

// 根據組件類型生成屬性欄位配置
const getPropertyFields = (type: CmsComponentType): CmsPropertyField[] => {
  return getComponentConfig(type);
};

export const CmsPropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onUpdateProps,
}) => {
  const { deleteComponent, selectComponent } = useCmsEditor();
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({});

  if (!selectedComponent) {
    return (
      <Panel title="屬性面板" position="right" width="var(--cms-property-panel-width)" className="box-border pb-[120px]">
        <div className="text-center text-text-disabled text-sm py-5">請點擊組件來編輯屬性</div>
      </Panel>
    );
  }

  // 取得所有屬性欄位
  let propertyFields = getPropertyFields(selectedComponent.type);

  // Container 是 Flex 容器，所有屬性都應該顯示
  // (移除了 layout 過濾邏輯)

  const handlePropertyChange = (key: string, value: unknown) => {
    onUpdateProps(selectedComponent.id, { [key]: value });
  };

  const renderField = (field: CmsPropertyField) => {
    const currentValue = (
      selectedComponent.props as unknown as Record<string, unknown>
    )[field.key];

    switch (field.type) {
      case 'boolean':
        return (
          <Switch
            checked={Boolean(currentValue)}
            onCheckedChange={checked => handlePropertyChange(field.key, checked)}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={Number(currentValue) || 0}
            onChange={e => {
              // 允許自由輸入，不立即限制
              const value = Number(e.target.value);
              handlePropertyChange(field.key, value);
            }}
            onBlur={e => {
              // 失焦時才強制限制在 min/max 範圍內
              let value = Number(e.target.value);
              if (field.min !== undefined && value < field.min) {
                value = field.min;
                handlePropertyChange(field.key, value);
              }
              if (field.max !== undefined && value > field.max) {
                value = field.max;
                handlePropertyChange(field.key, value);
              }
            }}
            min={field.min}
            max={field.max}
            step={field.step}
            className="h-7 text-xs"
          />
        );

      case 'size':
        // 判斷是否啟用固定尺寸（勾選表示啟用數字輸入）
        const isEnabled = currentValue !== 'auto' && currentValue !== undefined;

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isEnabled}
              onCheckedChange={checked => {
                if (checked) {
                  // 啟用固定尺寸，使用預設值或 min 值
                  const defaultValue = field.min || 100;
                  handlePropertyChange(field.key, defaultValue);
                } else {
                  // 停用固定尺寸，改為 auto
                  handlePropertyChange(field.key, 'auto');
                }
              }}
            />
            {isEnabled && (
              <Input
                type="number"
                value={Number(currentValue) || field.min || 0}
                onChange={e => {
                  // 允許自由輸入
                  const value = Number(e.target.value);
                  handlePropertyChange(field.key, value);
                }}
                onBlur={e => {
                  // 失焦時才限制範圍
                  let value = Number(e.target.value);
                  if (field.min !== undefined && value < field.min) {
                    value = field.min;
                    handlePropertyChange(field.key, value);
                  }
                  if (field.max !== undefined && value > field.max) {
                    value = field.max;
                    handlePropertyChange(field.key, value);
                  }
                }}
                min={field.min}
                max={field.max}
                step={field.step}
                className="h-7 text-xs flex-1"
                placeholder="px"
              />
            )}
            {!isEnabled && (
              <span className="text-xs text-text-muted flex-1">自動</span>
            )}
          </div>
        );

      case 'color':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="w-full h-7 rounded border border-border-secondary flex items-center gap-2 px-2 hover:bg-bg-secondary"
              >
                <div
                  className="w-4 h-4 rounded border border-border-secondary"
                  style={{ backgroundColor: String(currentValue || '#000000') }}
                />
                <span className="text-xs flex-1 text-left">{String(currentValue || '#000000')}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <HexColorPicker
                color={String(currentValue || '#000000')}
                onChange={color => handlePropertyChange(field.key, color)}
              />
            </PopoverContent>
          </Popover>
        );

      case 'select':
        return (
          <Select
            value={String(currentValue || field.options?.[0] || '')}
            onValueChange={value => handlePropertyChange(field.key, value)}
          >
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option} className="text-xs">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            type="text"
            value={String(currentValue || '')}
            onChange={e => handlePropertyChange(field.key, e.target.value)}
            className="h-7 text-xs"
          />
        );
    }
  };

  // 為所有組件進行屬性分組
  const groupFields = () => {
    // Container (Flex) 分組
    if (selectedComponent.type === 'container') {
      const size = propertyFields.filter(f =>
        ['width', 'height'].includes(f.key)
      );
      const appearance = propertyFields.filter(f =>
        ['backgroundColor', 'borderColor', 'borderWidth', 'borderStyle', 'borderRadius'].includes(f.key)
      );
      const spacing = propertyFields.filter(f =>
        ['padding', 'gap'].includes(f.key)
      );
      const flex = propertyFields.filter(f =>
        ['flexDirection', 'justifyContent', 'alignItems', 'flexWrap'].includes(f.key)
      );

      return {
        '尺寸': size,
        '外觀': appearance,
        '間距': spacing,
        'Flex 佈局': flex,
      };
    }

    // Image 分組
    if (selectedComponent.type === 'image') {
      const size = propertyFields.filter(f =>
        ['width', 'height'].includes(f.key)
      );
      const content = propertyFields.filter(f =>
        ['src', 'alt'].includes(f.key)
      );
      const appearance = propertyFields.filter(f =>
        ['objectFit', 'objectPosition', 'borderRadius'].includes(f.key)
      );

      return {
        '尺寸': size,
        '內容': content,
        '外觀': appearance,
      };
    }

    // Video 分組
    if (selectedComponent.type === 'video') {
      const size = propertyFields.filter(f =>
        ['width', 'height'].includes(f.key)
      );
      const content = propertyFields.filter(f =>
        ['src', 'poster'].includes(f.key)
      );
      const playback = propertyFields.filter(f =>
        ['controls', 'autoplay', 'loop', 'muted'].includes(f.key)
      );

      return {
        '尺寸': size,
        '內容': content,
        '播放': playback,
      };
    }

    // Text 分組
    if (selectedComponent.type === 'text') {
      const content = propertyFields.filter(f =>
        ['content'].includes(f.key)
      );
      const style = propertyFields.filter(f =>
        ['fontSize', 'fontWeight', 'textAlign', 'lineHeight', 'color'].includes(f.key)
      );

      return {
        '內容': content,
        '樣式': style,
      };
    }

    // Link 分組
    if (selectedComponent.type === 'link') {
      const content = propertyFields.filter(f =>
        ['text', 'href'].includes(f.key)
      );
      const behavior = propertyFields.filter(f =>
        ['target', 'rel'].includes(f.key)
      );
      const style = propertyFields.filter(f =>
        ['color', 'underline'].includes(f.key)
      );

      return {
        '內容': content,
        '行為': behavior,
        '樣式': style,
      };
    }

    return { '基本屬性': propertyFields };
  };

  const fieldGroups = groupFields();

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const getFieldLabel = (field: CmsPropertyField) => {
    // 移除 label 中的單位，因為會太長
    const cleanLabel = field.label.replace(/\s*\(.*?\)\s*/g, '').trim();
    return cleanLabel;
  };

  const getFieldRange = (field: CmsPropertyField) => {
    if (field.type === 'number' && field.min !== undefined && field.max !== undefined) {
      return `${field.min}-${field.max}`;
    }
    return null;
  };

  return (
    <Panel title="屬性面板" position="right" width="var(--cms-property-panel-width)" className="box-border pb-[120px]">
      {Object.entries(fieldGroups).map(([groupName, fields]) => (
        fields.length > 0 && (
          <div key={groupName} className="mb-1">
            {/* 可折疊的分組標題 */}
            <div
              className="flex items-center gap-2 px-2 py-1.5 bg-bg-tertiary hover:bg-bg-hover cursor-pointer select-none border-b border-border-secondary"
              onClick={() => toggleGroup(groupName)}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
                className="text-text-secondary transition-transform duration-200"
                style={{ transform: collapsedGroups[groupName] ? 'rotate(-90deg)' : 'rotate(0deg)' }}
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h4 className="m-0 text-text-secondary text-xs font-semibold uppercase tracking-wide flex-1">
                {groupName}
              </h4>
            </div>

            {/* 屬性列表 */}
            {!collapsedGroups[groupName] && (
              <div>
                {fields.map((field, index) => (
                  <div
                    key={field.key}
                    className={`flex items-center gap-2 px-2 py-1.5 text-xs ${
                      index % 2 === 0 ? 'bg-bg-primary' : 'bg-bg-secondary'
                    }`}
                  >
                    {/* 左側：屬性名稱 */}
                    <div className="w-28 flex-shrink-0 flex flex-col">
                      <label className="text-text-muted font-medium truncate" title={field.label}>
                        {getFieldLabel(field)}
                      </label>
                      {getFieldRange(field) && (
                        <span className="text-text-disabled text-[10px]">
                          {getFieldRange(field)}
                        </span>
                      )}
                    </div>

                    {/* 右側：輸入控制項 */}
                    <div className="flex-1 min-w-0">
                      {renderField(field)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      ))}

      {/* 進階操作 */}
      <div className="mb-1">
        <div
          className="flex items-center gap-2 px-2 py-1.5 bg-bg-tertiary hover:bg-bg-hover cursor-pointer select-none border-b border-border-secondary"
          onClick={() => toggleGroup('進階')}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="currentColor"
            className="text-text-secondary transition-transform duration-200"
            style={{ transform: collapsedGroups['進階'] ? 'rotate(-90deg)' : 'rotate(0deg)' }}
          >
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h4 className="m-0 text-text-secondary text-xs font-semibold uppercase tracking-wide flex-1">
            進階
          </h4>
        </div>

        {!collapsedGroups['進階'] && (
          <div className="p-2 bg-bg-primary">
            <button
              onClick={() => {
                // eslint-disable-next-line no-console
                console.group('📦 組件資訊');
                // eslint-disable-next-line no-console
                console.log('類型:', selectedComponent.type);
                // eslint-disable-next-line no-console
                console.log('ID:', selectedComponent.id);
                // eslint-disable-next-line no-console
                console.log('Parent ID:', selectedComponent.parentId || '(root)');
                // eslint-disable-next-line no-console
                console.log('Props:', selectedComponent.props);
                // eslint-disable-next-line no-console
                console.log('完整結構:', selectedComponent);
                // eslint-disable-next-line no-console
                console.groupEnd();
              }}
              className="bg-bg-quaternary text-text-secondary border border-border-secondary px-4 py-2 rounded cursor-pointer text-xs w-full mb-2 hover:bg-bg-hover"
            >
              檢查組件設定 (Console)
            </button>
            <button
              onClick={() => {
                deleteComponent(selectedComponent.id);
              }}
              className="bg-danger text-white border-none px-4 py-2 rounded cursor-pointer text-xs w-full hover:bg-danger-hover"
            >
              刪除元件
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
};
