import React, { Component, type ErrorInfo, type ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Docs ErrorBoundary caught an error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          style={{
            padding: '2.5rem 1.5rem',
            maxWidth: '640px',
            margin: '2rem auto',
            textAlign: 'center',
            background: 'var(--pui-surface)',
            border: '1px solid var(--pui-danger-500)',
            borderRadius: '1rem',
            boxShadow: 'var(--pui-shadow-lg)',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3rem',
              height: '3rem',
              borderRadius: '9999px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--pui-danger-500)',
              fontSize: '1.5rem',
              marginBottom: '1rem',
            }}
          >
            ⚠️
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--pui-fg)', margin: '0 0 0.5rem' }}>
            Component Preview Error
          </h2>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--pui-fg-muted)',
              lineHeight: 1.5,
              marginBottom: '1.5rem',
              wordBreak: 'break-word',
              fontFamily: 'monospace',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: 'var(--pui-surface-subtle)',
              border: '1px solid var(--pui-border)',
            }}
          >
            {this.state.error?.message || 'An error occurred while mounting this component page.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={this.reset}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.5rem',
                background: 'var(--pui-primary)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/home';
                window.location.reload();
              }}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.5rem',
                background: 'var(--pui-surface-subtle)',
                color: 'var(--pui-fg)',
                border: '1px solid var(--pui-border)',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              Return to Overview
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
