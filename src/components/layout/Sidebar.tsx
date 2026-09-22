import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Database,
  Users,
  Network,
  Clock,
  ShieldAlert,
  Terminal,
  FileText,
} from 'lucide-react';
import type { NavTabId } from '../../types';
import { Logo } from '../ui/Logo';

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  collapsed?: boolean;
  counts?: {
    investigations: number;
    evidence: number;
    entities: number;
    risk: number;
  };
}

interface NavConfig {
  id: NavTabId;
  label: string;
  icon: React.ReactNode;
  badgeKey?: 'investigations' | 'evidence' | 'entities' | 'risk';
  badgeVariant?: 'accent' | 'critical' | 'default';
  section?: string;
}

const NAV_ITEMS: NavConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size={16} />,
  },
  {
    id: 'investigations',
    label: 'Investigations',
    icon: <Briefcase size={16} />,
    badgeKey: 'investigations',
    badgeVariant: 'accent',
    section: 'OPERATIONAL',
  },
  {
    id: 'evidence',
    label: 'Evidence',
    icon: <Database size={16} />,
    badgeKey: 'evidence',
  },
  {
    id: 'entities',
    label: 'Entities',
    icon: <Users size={16} />,
    badgeKey: 'entities',
  },
  {
    id: 'network',
    label: 'Network',
    icon: <Network size={16} />,
    section: 'ANALYSIS',
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: <Clock size={16} />,
  },
  {
    id: 'risk-intelligence',
    label: 'Risk Intelligence',
    icon: <ShieldAlert size={16} />,
    badgeKey: 'risk',
    badgeVariant: 'critical',
  },
  {
    id: 'copilot',
    label: 'Copilot',
    icon: <Terminal size={16} />,
    section: 'AUTOMATION & OUTPUT',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <FileText size={16} />,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed = false,
  counts = {
    investigations: 3,
    evidence: 27,
    entities: 18,
    risk: 3,
  },
}) => {
  return (
    <aside
      style={{
        width: collapsed ? '68px' : 'var(--sidebar-width)',
        minWidth: collapsed ? '68px' : 'var(--sidebar-width)',
        height: '100vh',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        transition: 'width 0.2s ease',
        zIndex: 20,
      }}
    >
      {/* Header / Brand */}
      <div
        style={{
          height: 'var(--header-height)',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <Logo collapsed={collapsed} />
      </div>

      {/* Navigation List */}
      <div
        style={{
          flex: 1,
          padding: '12px 10px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        {NAV_ITEMS.map((item, index) => {
          const isActive = activeTab === item.id;
          const showSection = !collapsed && item.section && (index === 0 || NAV_ITEMS[index - 1].section !== item.section);
          const badgeValue = item.badgeKey ? counts[item.badgeKey] : undefined;

          return (
            <React.Fragment key={item.id}>
              {showSection && (
                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    color: 'var(--text-dim)',
                    letterSpacing: '0.08em',
                    padding: '14px 10px 4px 10px',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.section}
                </div>
              )}
              <button
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: collapsed ? '10px 0' : '8px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.12s ease',
                  position: 'relative',
                }}
                title={collapsed ? item.label : undefined}
                className="ct-nav-item"
              >
                <span
                  style={{
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </span>

                {!collapsed && (
                  <>
                    <span style={{ flex: 1, letterSpacing: '0.01em' }}>{item.label}</span>
                    {badgeValue !== undefined && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          padding: '1px 6px',
                          borderRadius: '10px',
                          backgroundColor:
                            item.badgeVariant === 'critical'
                              ? 'var(--status-critical-bg)'
                              : item.badgeVariant === 'accent'
                              ? 'var(--accent-subtle)'
                              : 'var(--bg-surface-subtle)',
                          color:
                            item.badgeVariant === 'critical'
                              ? 'var(--status-critical-text)'
                              : item.badgeVariant === 'accent'
                              ? '#c4b5fd'
                              : 'var(--text-muted)',
                          border: `1px solid ${
                            item.badgeVariant === 'critical'
                              ? 'var(--status-critical-border)'
                              : item.badgeVariant === 'accent'
                              ? 'var(--accent-border)'
                              : 'var(--border-default)'
                          }`,
                        }}
                      >
                        {badgeValue}
                      </span>
                    )}
                  </>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </aside>
  );
};
