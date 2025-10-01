import React from 'react';
import {
  TextComponent,
  ImageComponent,
  ContainerComponent,
  VideoComponent,
  LinkComponent,
} from '@src/domains/libs/components';

/**
 * 組件工廠類 - 負責組件的註冊和創建
 */
export class ComponentFactory {
  private static registry: Map<string, React.ComponentType<any>> = new Map();

  /**
   * 註冊組件類型
   * @param type 組件類型
   * @param component React 組件
   */
  static register(type: string, component: React.ComponentType<any>) {
    this.registry.set(type, component);
  }

  /**
   * 創建組件實例
   * @param type 組件類型
   * @param props 組件屬性
   * @param children 子組件
   * @returns React 元素
   */
  static create(type: string, props: any, children?: React.ReactNode) {
    const ComponentClass = this.registry.get(type);

    if (!ComponentClass) {
      throw new Error(`Unknown component type: ${type}`);
    }

    if (children) {
      return React.createElement(ComponentClass, { props }, children);
    }
    return React.createElement(ComponentClass, { props });
  }

  /**
   * 檢查組件類型是否存在
   * @param type 組件類型
   * @returns 是否存在
   */
  static has(type: string): boolean {
    return this.registry.has(type);
  }

  /**
   * 獲取所有已註冊的組件類型
   * @returns 組件類型數組
   */
  static getRegisteredTypes(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * 清空註冊表（主要用於測試）
   */
  static clear() {
    this.registry.clear();
  }
}

// 初始化註冊所有組件
ComponentFactory.register('text', TextComponent);
ComponentFactory.register('link', LinkComponent);
ComponentFactory.register('image', ImageComponent);
ComponentFactory.register('video', VideoComponent);
ComponentFactory.register('container', ContainerComponent);
