import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  compact?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Forensic System Alert',
  message,
  onRetry,
  compact = false,
}) => {
  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: 'var(--status-critical-bg)',
          border: '1px solid var(--status-critical-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--status-critical-text)',
          fontSize: '0.8rem',
        }}
      >
        <AlertTriangle size={14} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1 }}>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--status-critical-text)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.75rem',
            }}
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 20px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--status-critical-border)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--status-critical-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--status-critical-text)',
          marginBottom: '12px',
        }}
      >
        <AlertTriangle size={20} />
      </div>
      <h4 style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '420px', marginBottom: '16px' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={<RefreshCw size={12} />} onClick={onRetry}>
          Re-establish Connection
        </Button>
      )}
    </div>
  );
};
