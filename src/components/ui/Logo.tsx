import React from 'react';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ collapsed = false, className = '' }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Crisp geometric emblem: hexagonal forensic shield with crosshair core */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          backgroundColor: '#161b2b',
          border: '1px solid #323b54',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Forensic nexus geometry */}
          <path
            d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z"
            stroke="#7c5cfc"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M12 6V18M6 9L18 15M6 15L18 9"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle cx="12" cy="12" r="2" fill="#7c5cfc" />
        </svg>
      </div>

      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '0.08em',
                color: '#f8fafc',
                textTransform: 'uppercase',
              }}
            >
              CYBER<span style={{ color: '#7c5cfc' }}>TRACE</span>
            </span>
            <span
              style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                backgroundColor: 'rgba(124, 92, 252, 0.15)',
                color: '#a78bfa',
                padding: '1px 4px',
                borderRadius: '3px',
                border: '1px solid rgba(124, 92, 252, 0.3)',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              v1.0
            </span>
          </div>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-sans)',
              color: '#64748b',
              letterSpacing: '0.03em',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Digital Forensics & Correlation
          </span>
        </div>
      )}
    </div>
  );
};
