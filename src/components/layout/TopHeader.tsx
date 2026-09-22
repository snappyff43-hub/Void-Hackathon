import React from 'react';
import {
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { SearchInput } from '../ui/Input';
import { Button } from '../ui/Button';

interface TopHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onNewInvestigation?: () => void;
  onOpenSecurityStatus?: () => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  sidebarCollapsed,
  onToggleSidebar,
  onNewInvestigation,
  onOpenSecurityStatus,
  searchTerm = '',
  onSearchChange,
}) => {
  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-default)',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        zIndex: 10,
      }}
    >
      {/* Left Area: Collapse Toggle & Global Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, maxWidth: '440px' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <SearchInput
          placeholder="Search cases, UPI ID, account number, phone..."
          shortcut="⌘K"
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      {/* Right Area: Security Status, Notifications & Primary Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onOpenSecurityStatus && (
          <button
            onClick={onOpenSecurityStatus}
            style={{
              background: 'rgba(52, 211, 153, 0.08)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              color: '#34d399',
              cursor: 'pointer',
              padding: '4px 10px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
            }}
            title="Inspect Active Security & Integrity Controls"
          >
            <ShieldCheck size={14} />
            <span>Security: Active</span>
          </button>
        )}

        <button
          style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '7px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={15} />
        </button>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={onNewInvestigation}
        >
          New Investigation
        </Button>
      </div>
    </header>
  );
};
