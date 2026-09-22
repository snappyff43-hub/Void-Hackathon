import React from 'react';
import { FileText, Eye, CheckCircle2 } from 'lucide-react';
import type { EvidenceItem } from '../../types';
import { truncateHash } from '../../utils/crypto';
import { Card, CardContent } from '../ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface EvidenceTableProps {
  evidenceItems: EvidenceItem[];
  onSelectEvidence: (item: EvidenceItem) => void;
}

export const EvidenceTable: React.FC<EvidenceTableProps> = ({
  evidenceItems,
  onSelectEvidence,
}) => {
  if (evidenceItems.length === 0) {
    return (
      <Card>
        <CardContent style={{ padding: '36px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            No evidence artifacts found matching criteria. Upload artifacts using the dropzone above.
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
              <TableHeaderCell>File</TableHeaderCell>
              <TableHeaderCell style={{ width: '150px' }}>Source Type</TableHeaderCell>
              <TableHeaderCell style={{ width: '130px' }}>Case</TableHeaderCell>
              <TableHeaderCell style={{ width: '90px' }}>Size</TableHeaderCell>
              <TableHeaderCell style={{ width: '130px' }}>SHA-256</TableHeaderCell>
              <TableHeaderCell style={{ width: '100px' }}>Status</TableHeaderCell>
              <TableHeaderCell style={{ width: '150px' }}>Uploaded</TableHeaderCell>
              <TableHeaderCell style={{ width: '90px', textAlign: 'right' }}>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evidenceItems.map((item) => (
              <TableRow key={item.id} onClick={() => onSelectEvidence(item)}>
                {/* File Name */}
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={15} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                        {item.fileName}
                      </div>
                      {item.recordCount !== null && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                          {item.recordCount.toLocaleString()} records
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Source Type */}
                <TableCell>
                  <Badge variant="mono" size="sm">
                    {item.sourceType}
                  </Badge>
                </TableCell>

                {/* Case Reference */}
                <TableCell>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#a78bfa',
                      backgroundColor: 'rgba(124, 92, 252, 0.1)',
                      border: '1px solid rgba(124, 92, 252, 0.25)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'inline-block',
                    }}
                  >
                    {item.caseId}
                  </span>
                </TableCell>

                {/* Size */}
                <TableCell>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {item.fileSize}
                  </span>
                </TableCell>

                {/* SHA-256 */}
                <TableCell>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      color: 'var(--text-muted)',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      padding: '2px 5px',
                      borderRadius: '3px',
                      border: '1px solid var(--border-subtle)',
                    }}
                    title={item.sha256}
                  >
                    {truncateHash(item.sha256, 4, 4)}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: 'var(--status-active-text)',
                      backgroundColor: 'var(--status-active-bg)',
                      border: '1px solid var(--status-active-border)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    <CheckCircle2 size={11} />
                    {item.status}
                  </span>
                </TableCell>

                {/* Uploaded */}
                <TableCell>
                  <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {item.uploadedAt}
                  </span>
                </TableCell>

                {/* Action */}
                <TableCell align="right">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Eye size={12} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvidence(item);
                    }}
                    style={{ height: '26px', padding: '0 8px', fontSize: '0.75rem' }}
                  >
                    Details
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
