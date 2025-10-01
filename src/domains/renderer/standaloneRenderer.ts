import React from 'react';
import ReactDOM from 'react-dom';
import { CmsAppRenderer } from '@src/domains/renderer/AppRenderer';
import { CmsComponent } from '@src/shared/types';

// 全局渲染函數
declare global {
  interface Window {
    cmsAppRenderer: (id: string, options: { root: any }) => any;
  }
}

window.cmsAppRenderer = (id: string, options: { root: any }) => {
  try {
    const container = document.getElementById(id);
    if (!container) {
      throw new Error(`Element with id "${id}" not found`);
    }

    const root = options.root;
    if (!root || !Array.isArray(root.children)) {
      throw new Error(
        'Invalid options.root: expected { children: CmsComponent[] }'
      );
    }

    ReactDOM.render(React.createElement(CmsAppRenderer, { root }), container);
    console.log('CMS app content rendered successfully');
    return container;
  } catch (error) {
    console.error('CMS App Renderer Error:', error);
    return null;
  }
};
