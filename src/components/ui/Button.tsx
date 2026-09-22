import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled,
  className = '',
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--accent-primary)',
          color: '#ffffff',
          border: '1px solid #8b6eff',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--bg-surface-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-default)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-default)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-muted)',
          border: '1px solid transparent',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--status-critical-bg)',
          color: 'var(--status-critical-text)',
          border: '1px solid var(--status-critical-border)',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '4px 10px',
          fontSize: '0.8rem',
          height: '28px',
          gap: '5px',
        };
      case 'lg':
        return {
          padding: '8px 18px',
          fontSize: '0.92rem',
          height: '40px',
          gap: '8px',
        };
      case 'md':
      default:
        return {
          padding: '6px 14px',
          fontSize: '0.84rem',
          height: '34px',
          gap: '6px',
        };
    }
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    borderRadius: 'var(--radius-md)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.15s ease-in-out',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...style,
  };

  return (
    <button
      disabled={disabled || loading}
      style={baseStyle}
      className={`ct-btn ct-btn-${variant} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={size === 'sm' ? 12 : 14} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />}
      {!loading && icon && iconPosition === 'left' && <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>}
      {children}
      {!loading && icon && iconPosition === 'right' && <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>}
    </button>
  );
};
