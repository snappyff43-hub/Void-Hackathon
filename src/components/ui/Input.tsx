import React from 'react';
import { Search } from 'lucide-react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  className = '',
  style,
  disabled,
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {label && (
        <label
          style={{
            fontSize: '0.78rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {leftIcon && (
          <div
            style={{
              position: 'absolute',
              left: '10px',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              color: 'var(--text-muted)',
            }}
          >
            {leftIcon}
          </div>
        )}
        <input
          disabled={disabled}
          style={{
            width: '100%',
            height: '34px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: `1px solid ${error ? 'var(--status-critical-border)' : 'var(--border-default)'}`,
            borderRadius: 'var(--radius-md)',
            padding: `0 ${rightIcon ? '32px' : '12px'} 0 ${leftIcon ? '32px' : '12px'}`,
            color: 'var(--text-primary)',
            fontSize: '0.84rem',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            transition: 'border-color 0.15s ease',
            ...style,
          }}
          className={`ct-input ${className}`}
          {...props}
        />
        {rightIcon && (
          <div
            style={{
              position: 'absolute',
              right: '10px',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              color: 'var(--text-muted)',
            }}
          >
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <span
          style={{
            fontSize: '0.72rem',
            color: error ? 'var(--status-critical-text)' : 'var(--text-muted)',
          }}
        >
          {error || helperText}
        </span>
      )}
    </div>
  );
};

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  shortcut?: string;
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  shortcut = '⌘K',
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '380px',
      }}
    >
      <Search
        size={14}
        style={{
          position: 'absolute',
          left: '10px',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        style={{
          width: '100%',
          height: '32px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          paddingLeft: '32px',
          paddingRight: shortcut ? '44px' : '12px',
          color: 'var(--text-primary)',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-sans)',
          outline: 'none',
          ...style,
        }}
        className={`ct-search-input ${className}`}
        {...props}
      />
      {shortcut && (
        <kbd
          style={{
            position: 'absolute',
            right: '8px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'var(--bg-surface-subtle)',
            color: 'var(--text-dim)',
            border: '1px solid var(--border-default)',
            padding: '1px 5px',
            borderRadius: '3px',
            pointerEvents: 'none',
          }}
        >
          {shortcut}
        </kbd>
      )}
    </div>
  );
};
