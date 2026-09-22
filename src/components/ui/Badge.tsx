import React from 'react';
import type { PriorityLevel, CaseStatus } from '../../types';

export type BadgeVariant =
  | 'default'
  | 'accent'
  | 'active'
  | 'review'
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'mono'
  | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      borderRadius: '4px',
      fontWeight: 500,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      fontSize: size === 'sm' ? '11px' : '12px',
      padding: size === 'sm' ? '2px 6px' : '3px 8px',
    };

    switch (variant) {
      case 'active':
        return {
          ...base,
          backgroundColor: 'var(--status-active-bg)',
          color: 'var(--status-active-text)',
          border: '1px solid var(--status-active-border)',
        };
      case 'review':
        return {
          ...base,
          backgroundColor: 'var(--status-review-bg)',
          color: 'var(--status-review-text)',
          border: '1px solid var(--status-review-border)',
        };
      case 'critical':
        return {
          ...base,
          backgroundColor: 'var(--status-critical-bg)',
          color: 'var(--status-critical-text)',
          border: '1px solid var(--status-critical-border)',
          fontWeight: 600,
        };
      case 'high':
        return {
          ...base,
          backgroundColor: 'var(--status-high-bg)',
          color: 'var(--status-high-text)',
          border: '1px solid var(--status-high-border)',
          fontWeight: 600,
        };
      case 'medium':
        return {
          ...base,
          backgroundColor: 'var(--status-review-bg)',
          color: 'var(--status-review-text)',
          border: '1px solid var(--status-review-border)',
        };
      case 'low':
        return {
          ...base,
          backgroundColor: 'var(--status-info-bg)',
          color: 'var(--status-info-text)',
          border: '1px solid var(--status-info-border)',
        };
      case 'accent':
        return {
          ...base,
          backgroundColor: 'var(--accent-subtle)',
          color: '#a78bfa',
          border: '1px solid var(--accent-border)',
        };
      case 'mono':
        return {
          ...base,
          fontFamily: 'var(--font-mono)',
          backgroundColor: 'var(--bg-surface-subtle)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-default)',
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: 'var(--text-muted)',
          border: '1px solid var(--border-default)',
        };
      default:
        return {
          ...base,
          backgroundColor: 'var(--bg-surface-elevated)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-default)',
        };
    }
  };

  return (
    <span style={getStyles()} className={className}>
      {children}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'sm',
}) => {
  const variantMap: Record<PriorityLevel, BadgeVariant> = {
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
  };

  return (
    <Badge variant={variantMap[priority]} size={size}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
      {priority}
    </Badge>
  );
};

export const StatusBadge: React.FC<{ status: CaseStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'sm',
}) => {
  const getVariant = (): BadgeVariant => {
    switch (status) {
      case 'Active':
        return 'active';
      case 'Under Review':
        return 'review';
      case 'Closed':
        return 'mono';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getVariant()} size={size}>
      {status === 'Active' && (
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
      )}
      {status}
    </Badge>
  );
};
