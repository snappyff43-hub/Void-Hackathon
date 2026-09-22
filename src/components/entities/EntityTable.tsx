import React, { useState } from 'react';
import {
  Phone,
  CreditCard,
  Smartphone,
  Globe,
  Mail,
  User,
  Hash,
  Eye,
  EyeOff,
  Shield,
} from 'lucide-react';
import type { Entity, EntityType } from '../../types';
import { maskIdentifier } from '../../utils/securityUtils';
import { Card, CardContent } from '../ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../ui/Table';
import { PriorityBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface EntityTableProps {
  entities: Entity[];
  onSelectEntity: (entity: Entity) => void;
}

export const getEntityIcon = (type: EntityType) => {
  switch (type) {
    case 'PHONE':
      return <Phone size={13} style={{ color: '#38bdf8' }} />;
    case 'UPI_VPA':
    case 'BANK_ACCOUNT':
      return <CreditCard size={13} style={{ color: '#fbbf24' }} />;
    case 'DEVICE':
    case 'IMEI':
    case 'IMSI':
      return <Smartphone size={13} style={{ color: '#a78bfa' }} />;
    case 'IP_ADDRESS':
      return <Globe size={13} style={{ color: '#34d399' }} />;
    case 'EMAIL':
      return <Mail size={13} style={{ color: '#c084fc' }} />;
    case 'PERSON':
      return <User size={13} style={{ color: '#f43f5e' }} />;
    default:
      return <Hash size={13} style={{ color: 'var(--text-muted)' }} />;
  }
};

export const EntityTable: React.FC<EntityTableProps> = ({ entities, onSelectEntity }) => {
  const [isMasked, setIsMasked] = useState<boolean>(true);

  if (entities.length === 0) {
    return (
      <Card>
        <CardContent style={{ padding: '36px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            No entities match the selected filter criteria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
          <Shield size={13} style={{ color: isMasked ? '#38bdf8' : 'var(--text-muted)' }} />
          <span>Privacy Display:</span>
          <span style={{ fontWeight: 600, color: isMasked ? '#38bdf8' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {isMasked ? 'Masked (Sensitive PII Obfuscated)' : 'Full Forensic Identifiers'}
          </span>
        </div>
        <button
          onClick={() => setIsMasked(!isMasked)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: isMasked ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-surface-elevated)',
            border: `1px solid ${isMasked ? 'rgba(56, 189, 248, 0.3)' : 'var(--border-default)'}`,
            color: isMasked ? '#38bdf8' : 'var(--text-secondary)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.72rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
          }}
          title={isMasked ? 'Click to reveal unmasked identifiers' : 'Click to mask sensitive identifiers'}
        >
          {isMasked ? <Eye size={12} /> : <EyeOff size={12} />}
          <span>{isMasked ? 'Reveal Full Identifiers' : 'Mask Identifiers'}</span>
        </button>
      </div>
      <CardContent noPadding>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell style={{ width: '130px' }}>Type</TableHeaderCell>
              <TableHeaderCell>Entity Identifier</TableHeaderCell>
              <TableHeaderCell style={{ width: '130px' }}>Risk Score</TableHeaderCell>
              <TableHeaderCell style={{ width: '100px' }}>Confidence</TableHeaderCell>
              <TableHeaderCell style={{ width: '80px' }}>Cases</TableHeaderCell>
              <TableHeaderCell style={{ width: '90px' }}>Evidence</TableHeaderCell>
              <TableHeaderCell style={{ width: '130px' }}>First Seen</TableHeaderCell>
              <TableHeaderCell style={{ width: '130px' }}>Last Seen</TableHeaderCell>
              <TableHeaderCell style={{ width: '90px', textAlign: 'right' }}>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entities.map((ent) => (
              <TableRow key={ent.id} onClick={() => onSelectEntity(ent)}>
                {/* Type */}
                <TableCell>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    {getEntityIcon(ent.type)}
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {ent.type}
                    </span>
                  </div>
                </TableCell>

                {/* Entity Value */}
                <TableCell>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                      {isMasked ? maskIdentifier(ent.normalizedValue, ent.type) : ent.normalizedValue}
                    </div>
                    {ent.value !== ent.normalizedValue && !isMasked && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '1px' }}>
                        Raw: {ent.value}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Risk */}
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: ent.riskScore >= 60 ? 'var(--status-critical-text)' : '#fbbf24',
                      }}
                    >
                      {ent.riskScore}
                    </span>
                    <PriorityBadge
                      priority={
                        ent.riskScore >= 80 ? 'CRITICAL' : ent.riskScore >= 60 ? 'HIGH' : ent.riskScore >= 30 ? 'MEDIUM' : 'LOW'
                      }
                      size="sm"
                    />
                  </div>
                </TableCell>

                {/* Confidence */}
                <TableCell>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {ent.confidence}%
                  </span>
                </TableCell>

                {/* Cases */}
                <TableCell>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.76rem',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {ent.caseIds.length}
                  </span>
                </TableCell>

                {/* Evidence */}
                <TableCell>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.76rem',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {ent.sourceEvidenceIds.length}
                  </span>
                </TableCell>

                {/* First Seen */}
                <TableCell>
                  <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    {ent.firstSeen}
                  </span>
                </TableCell>

                {/* Last Seen */}
                <TableCell>
                  <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {ent.lastSeen}
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
                      onSelectEntity(ent);
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
