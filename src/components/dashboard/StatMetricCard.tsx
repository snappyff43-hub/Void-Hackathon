import React from 'react';
import { Card } from '../ui/Card';

interface StatMetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  tag?: string;
}

export const StatMetricCard: React.FC<StatMetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor = 'var(--accent-primary)',
  tag,
}) => {
  return (
    <Card
      style={{
        padding: '18px 20px',
        backgroundColor: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {title}
        </span>
        {icon && (
          <div
            style={{
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.9,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ marginTop: '14px', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <span
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-primary)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </span>
        {tag && (
          <span
            style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-dim)',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              padding: '2px 6px',
              borderRadius: '3px',
            }}
          >
            {tag}
          </span>
        )}
      </div>

      {subtitle && (
        <div
          style={{
            fontSize: '0.76rem',
            color: 'var(--text-muted)',
            marginTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '8px',
          }}
        >
          {subtitle}
        </div>
      )}
    </Card>
  );
};
