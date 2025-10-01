import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CMS Component Error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              padding: '12px',
              border: '1px solid #ff6b6b',
              borderRadius: '4px',
              backgroundColor: '#ffe0e0',
              color: '#d63031',
              fontSize: '14px',
              display: 'inline-block',
              minWidth: '100px',
              minHeight: '40px',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              組件渲染錯誤
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              {this.state.error?.message || '未知錯誤'}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// 組件級別的錯誤邊界 Hook
export const useComponentErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = () => setError(null);

  const handleError = React.useCallback((error: Error) => {
    console.error('Component Error:', error);
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(resetError, 5000); // 5秒後自動重置
      return () => clearTimeout(timer);
    }
  }, [error]);

  return { error, handleError, resetError };
};
