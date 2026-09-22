import React from 'react';
import { Loader2 } from 'lucide-react';

export const Skeleton: React.FC<{
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ width = '100%', height = '16px', borderRadius = 'var(--radius-sm)', className = '', style }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--bg-surface-elevated)',
        opacity: 0.6,
        ...style,
      }}
      className={`animate-pulse ${className}`}
    />
  );
};

export const LoadingState: React.FC<{
  message?: string;
  compact?: boolean;
}> = ({ message = 'Loading forensic telemetry...', compact = false }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: compact ? '24px' : '48px',
        gap: '12px',
        color: 'var(--text-muted)',
      }}
    >
      <Loader2
        size={compact ? 20 : 28}
        style={{
          color: 'var(--accent-primary)',
          animation: 'spin 1.2s linear infinite',
        }}
      />
      <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>{message}</span>
    </div>
  );
};
