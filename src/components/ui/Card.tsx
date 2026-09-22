import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  style,
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: hoverable ? 'border-color 0.15s ease, transform 0.15s ease' : undefined,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
      className={`ct-card ${hoverable ? 'ct-card-hoverable' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  icon,
  className = '',
  style,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        ...style,
      }}
      className={`ct-card-header ${className}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        {icon && (
          <div
            style={{
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.25,
              letterSpacing: '0.01em',
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>{action}</div>}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  noPadding?: boolean;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  style,
  noPadding = false,
}) => {
  return (
    <div
      style={{
        padding: noPadding ? '0' : '16px 18px',
        ...style,
      }}
      className={`ct-card-content ${className}`}
    >
      {children}
    </div>
  );
};
