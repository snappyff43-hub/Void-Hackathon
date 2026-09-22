import React, { useState } from 'react';
import type { NavTabId } from '../../types';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

interface AppShellProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  onNewInvestigation?: () => void;
  onOpenSecurityStatus?: () => void;
  counts?: {
    investigations: number;
    evidence: number;
    entities: number;
    risk: number;
  };
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onSelectTab,
  onNewInvestigation,
  onOpenSecurityStatus,
  counts,
  searchTerm,
  onSearchChange,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-app)',
      }}
    >
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        collapsed={sidebarCollapsed}
        counts={counts}
      />

      {/* Main Content Pane */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <TopHeader
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNewInvestigation={onNewInvestigation}
          onOpenSecurityStatus={onOpenSecurityStatus}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px',
            backgroundColor: 'var(--bg-app)',
          }}
        >
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
