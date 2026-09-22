import React from 'react';
import { Database, Users, ExternalLink } from 'lucide-react';
import type { Investigation } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../ui/Table';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface InvestigationTableProps {
  investigations: Investigation[];
  onOpenCase: (investigation: Investigation) => void;
}

export const InvestigationTable: React.FC<InvestigationTableProps> = ({
  investigations,
  onOpenCase,
}) => {
  if (investigations.length === 0) {
    return (
      <Card>
        <CardContent style={{ padding: '36px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            No investigations match the selected filter criteria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent noPadding>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell style={{ width: '130px' }}>Case ID</TableHeaderCell>
              <TableHeaderCell>Investigation</TableHeaderCell>
              <TableHeaderCell style={{ width: '160px' }}>Type</TableHeaderCell>
              <TableHeaderCell style={{ width: '100px' }}>Priority</TableHeaderCell>
              <TableHeaderCell style={{ width: '110px' }}>Status</TableHeaderCell>
              <TableHeaderCell style={{ width: '90px' }}>Evidence</TableHeaderCell>
              <TableHeaderCell style={{ width: '90px' }}>Entities</TableHeaderCell>
              <TableHeaderCell style={{ width: '110px' }}>Last Updated</TableHeaderCell>
              <TableHeaderCell style={{ width: '110px', textAlign: 'right' }}>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {investigations.map((inv) => (
              <TableRow key={inv.id} onClick={() => onOpenCase(inv)}>
                {/* Case ID */}
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

                {/* Investigation Title */}
                <TableCell>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                    {inv.title}
                  </div>
                </TableCell>

                {/* Type */}
                <TableCell>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {inv.type}
                  </span>
                </TableCell>

                {/* Priority */}
                <TableCell>
                  <PriorityBadge priority={inv.priority} />
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={inv.status} />
                </TableCell>

                {/* Evidence */}
                <TableCell>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <Database size={12} style={{ color: 'var(--text-dim)' }} />
                    {inv.evidenceCount}
                  </span>
                </TableCell>

                {/* Entities */}
                <TableCell>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <Users size={12} style={{ color: 'var(--text-dim)' }} />
                    {inv.entitiesCount}
                  </span>
                </TableCell>

                {/* Last Updated */}
                <TableCell>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {inv.lastUpdated}
                  </span>
                </TableCell>

                {/* Action */}
                <TableCell align="right">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<ExternalLink size={12} />}
                    iconPosition="right"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCase(inv);
                    }}
                    style={{ height: '28px', padding: '0 10px' }}
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
