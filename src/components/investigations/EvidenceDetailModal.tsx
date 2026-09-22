import React from 'react';
import { Database, Calendar } from 'lucide-react';
import type { InvestigationFinding } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface EvidenceDetailModalProps {
  finding: InvestigationFinding | null;
  onClose: () => void;
}

export const EvidenceDetailModal: React.FC<EvidenceDetailModalProps> = ({ finding, onClose }) => {
  if (!finding) return null;

  return (
    <Modal
      isOpen={!!finding}
      onClose={onClose}
      title={finding.evidenceId}
      subtitle={finding.evidenceTitle}
      maxWidth="600px"
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close Evidence View
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Core Metadata Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            padding: '12px 14px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Artifact Type
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <Database size={13} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {finding.evidenceType}
              </span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Logged Timestamp
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                {finding.evidenceDate}
              </span>
            </div>
          </div>
        </div>

        {/* Forensic Detail Description */}
        <div>
          <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Evidence Findings & Context
          </span>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              marginTop: '4px',
              lineHeight: 1.5,
              padding: '10px 12px',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {finding.details}
          </p>
        </div>

        {/* Structured Artifact Attributes */}
        {finding.metadata && Object.keys(finding.metadata).length > 0 && (
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Extracted Telemetry & Data Points
            </span>
            <div
              style={{
                marginTop: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {Object.entries(finding.metadata).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
