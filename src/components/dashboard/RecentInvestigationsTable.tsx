import React from 'react';
import { ChevronRight, Database, Users, ExternalLink } from 'lucide-react';
import type { Investigation } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../ui/Table';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface RecentInvestigationsTableProps {
  investigations: Investigation[];
  onSelectInvestigation?: (investigation: Investigation) => void;
  onViewAll?: () => void;
}

export const RecentInvestigationsTable: React.FC<RecentInvestigationsTableProps> = ({
  investigations,
  onSelectInvestigation,
  onViewAll,
}) => {
  return (
    <Card>
      <CardHeader
        title="Recent Investigations"
        subtitle="Priority case files active in the platform"
        action={
          <Button variant="ghost" size="sm" onClick={onViewAll} icon={<ChevronRight size={14} />} iconPosition="right">
            All Cases
          </Button>
        }
      />
      <CardContent noPadding>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell style={{ width: '130px' }}>Case ID</TableHeaderCell>
              <TableHeaderCell>Investigation</TableHeaderCell>
              <TableHeaderCell style={{ width: '150px' }}>Type</TableHeaderCell>
              <TableHeaderCell style={{ width: '100px' }}>Priority</TableHeaderCell>
              <TableHeaderCell style={{ width: '110px' }}>Status</TableHeaderCell>
              <TableHeaderCell style={{ width: '110px' }}>Artifacts</TableHeaderCell>
              <TableHeaderCell style={{ width: '100px' }}>Updated</TableHeaderCell>
              <TableHeaderCell style={{ width: '100px', textAlign: 'right' }}>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {investigations.map((inv) => (
              <TableRow key={inv.id} onClick={() => onSelectInvestigation?.(inv)}>
                <TableCell>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#a78bfa',
                      backgroundColor: 'rgba(124, 92, 252, 0.1)',
                      border: '1px solid rgba(124, 92, 252, 0.25)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'inline-block',
                    }}
                  >
                    {inv.caseNumber}
                  </span>
                </TableCell>
                <TableCell>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                    {inv.title}
                  </div>
                </TableCell>
                <TableCell>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {inv.type}
                  </span>
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={inv.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={inv.status} />
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }} title="Evidence items">
                      <Database size={12} style={{ color: 'var(--text-dim)' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{inv.evidenceCount}</span>
                    </span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }} title="Identified entities">
                      <Users size={12} style={{ color: 'var(--text-dim)' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{inv.entitiesCount}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {inv.lastUpdated}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<ExternalLink size={12} />}
                    iconPosition="right"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectInvestigation?.(inv);
                    }}
                    style={{ height: '26px', padding: '0 8px', fontSize: '0.75rem' }}
                  >
                    Open Case
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
