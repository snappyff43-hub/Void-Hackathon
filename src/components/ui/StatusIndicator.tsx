import React from 'react';

interface StatusIndicatorProps {
  status: 'operational' | 'degraded' | 'offline' | 'syncing';
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'sm',
}) => {
  const getColor = () => {
    switch (status) {
      case 'operational':
        return '#34d399';
      case 'degraded':
        return '#fbbf24';
      case 'offline':
        return '#f43f5e';
      case 'syncing':
        return '#7c5cfc';
      default:
        return '#94a3b8';
    }
  };

  const dotSize = size === 'sm' ? '7px' : '9px';
  const color = getColor();

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: status === 'operational' ? `0 0 6px ${color}80` : undefined,
          flexShrink: 0,
        }}
      />
      {label && (
        <span
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};
