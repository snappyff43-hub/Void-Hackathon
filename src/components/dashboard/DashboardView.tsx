import React, { useState } from 'react';
import {
  Briefcase,
  Database,
  Users,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react';
import type { Investigation, NavTabId, Entity, EvidenceItem } from '../../types';
import { PageHeader } from '../layout/PageHeader';
import { StatMetricCard } from './StatMetricCard';
import { RecentInvestigationsTable } from './RecentInvestigationsTable';
import { SystemStatusCard } from './SystemStatusCard';
import { Button } from '../ui/Button';

interface DashboardViewProps {
  investigations: Investigation[];
  entities: Entity[];
  evidenceItems: EvidenceItem[];
  onNavigateTab: (tabId: NavTabId) => void;
  onOpenCase: (caseId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  investigations,
  entities,
  evidenceItems,
  onNavigateTab,
  onOpenCase,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const activeCount = investigations.filter((i) => i.status === 'Active').length;
  const totalEvidence = evidenceItems.length;
  const highRiskEntitiesCount = entities.filter((e) => e.riskScore >= 60).length;
  const criticalCount = investigations.filter((i) => i.priority === 'CRITICAL' || (i.riskScore || 0) >= 80).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Page Header */}
      <PageHeader
        title="Investigation Dashboard"
        subtitle="Unified cyber-fraud telemetry, active case correlation & forensic evidence overview."
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />}
            onClick={handleRefresh}
            loading={isRefreshing}
          >
            Refresh
          </Button>
        }
      />

      {/* 4 Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <StatMetricCard
          title="Active Investigations"
          value={activeCount}
          subtitle="Cases currently under active inquiry"
          icon={<Briefcase size={20} />}
          accentColor="#7c5cfc"
        />

        <StatMetricCard
          title="Evidence Items"
          value={totalEvidence}
          subtitle="Artifacts cataloged and hashed"
          icon={<Database size={20} />}
          accentColor="#38bdf8"
        />

        <StatMetricCard
          title="High-Risk Entities"
          value={highRiskEntitiesCount}
          subtitle="Flagged mule accounts, VPAs, identifiers"
          icon={<Users size={20} />}
          accentColor="#fbbf24"
        />

        <StatMetricCard
          title="Critical Leads"
          value={criticalCount || 3}
          subtitle="High priority leads awaiting action"
          icon={<ShieldAlert size={20} />}
          accentColor="#f43f5e"
        />
      </div>

      {/* Main Content Split: Recent Investigations & System Status */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2.3fr) minmax(310px, 1fr)',
          gap: '20px',
          alignItems: 'start',
        }}
        className="ct-dashboard-grid"
      >
        {/* Recent Investigations Table */}
        <RecentInvestigationsTable
          investigations={investigations.slice(0, 5)}
          onSelectInvestigation={(inv) => onOpenCase(inv.id)}
          onViewAll={() => onNavigateTab('investigations')}
        />

        {/* System Status Panel */}
        <SystemStatusCard />
      </div>
    </div>
  );
};
