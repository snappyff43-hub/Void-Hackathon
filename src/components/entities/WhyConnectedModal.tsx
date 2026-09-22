import React from 'react';
import { ArrowRight, Link, FileText } from 'lucide-react';
import type { EntityRelationship, Entity } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface WhyConnectedModalProps {
  relationship: EntityRelationship | null;
  sourceEntity?: Entity;
  targetEntity?: Entity;
  onClose: () => void;
}

export const WhyConnectedModal: React.FC<WhyConnectedModalProps> = ({
  relationship,
  sourceEntity,
  targetEntity,
  onClose,
}) => {
  if (!relationship) return null;

  return (
    <Modal
      isOpen={!!relationship}
      onClose={onClose}
      title="Correlation Rationale & Traceability"
      subtitle="Explainable evidence-backed nexus between entities"
      maxWidth="620px"
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Dismiss Rationale
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Visual Entity Link Connection */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            gap: '10px',
          }}
        >
          {/* Source Entity */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              {sourceEntity?.type || 'Source Entity'}
            </span>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {sourceEntity?.normalizedValue || relationship.sourceEntityId}
            </div>
          </div>

          {/* Relationship Badge with Arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <Badge variant="accent" size="sm">
              <Link size={10} />
              {relationship.relationshipType}
            </Badge>
            {relationship.amount && (
              <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>
                {relationship.amount}
              </span>
            )}
            <ArrowRight size={14} style={{ color: 'var(--accent-primary)' }} />
          </div>

          {/* Target Entity */}
          <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              {targetEntity?.type || 'Target Entity'}
            </span>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {targetEntity?.normalizedValue || relationship.targetEntityId}
            </div>
          </div>
        </div>

        {/* Confidence & Traceability Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Correlation Strength:
            </span>
            <Badge variant="active" size="sm">
              {relationship.confidence}% Deterministic Confidence
            </Badge>
          </div>
          <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
            Observed: {relationship.firstSeen}
          </span>
        </div>

        {/* Explainable Rationale Box */}
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'rgba(124, 92, 252, 0.08)',
            border: '1px solid rgba(124, 92, 252, 0.25)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#c4b5fd', textTransform: 'uppercase' }}>
            Why Connected? (Forensic Explanation)
          </span>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
            {relationship.explanation}
          </p>
        </div>

        {/* Supporting Evidence Chain */}
        <div>
          <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Supporting Evidence References ({relationship.evidenceRefs?.length || relationship.evidenceIds.length})
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            {relationship.evidenceRefs && relationship.evidenceRefs.length > 0 ? (
              relationship.evidenceRefs.map((ref, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={13} style={{ color: 'var(--accent-primary)' }} />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ref.fileName}</span>
                    {ref.rowRef && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-dim)',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          padding: '1px 5px',
                          borderRadius: '3px',
                        }}
                      >
                        {ref.rowRef}
                      </span>
                    )}
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{ref.detail}</span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Evidence IDs: {relationship.evidenceIds.join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
