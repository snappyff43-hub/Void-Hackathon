import React from 'react';
import { Clock, ArrowRight, FileText, ExternalLink } from 'lucide-react';
import type { TimelineEvent, EvidenceItem } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface TimelineEventDetailModalProps {
  event: TimelineEvent | null;
  evidenceItems: EvidenceItem[];
  onClose: () => void;
  onOpenEvidence?: (item: EvidenceItem) => void;
}

export const TimelineEventDetailModal: React.FC<TimelineEventDetailModalProps> = ({
  event,
  evidenceItems,
  onClose,
  onOpenEvidence,
}) => {
  if (!event) return null;

  const linkedEvidence = evidenceItems.find((ev) => ev.id === event.evidenceId);

  return (
    <Modal
      isOpen={!!event}
      onClose={onClose}
      title="Investigation Event Details"
      subtitle="Reconstructed forensic timestamp & telemetry event"
      maxWidth="560px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {linkedEvidence && onOpenEvidence ? (
            <Button
              variant="outline"
              size="sm"
              icon={<FileText size={13} />}
              onClick={() => {
                onClose();
                onOpenEvidence(linkedEvidence);
              }}
            >
              View Evidence File ({linkedEvidence.fileName})
            </Button>
          ) : <div />}
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Header Block with Timestamp & Type */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Event Timestamp
              </span>
              <div style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {event.timestamp}
              </div>
            </div>
          </div>

          <Badge variant="accent">
            {event.eventType}
          </Badge>
        </div>

        {/* Source -> Target Entity Transition */}
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Correlated Entity Nexus
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Source</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {event.sourceEntity}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--accent-primary)' }}>
              {event.amount && (
                <span
                  style={{
                    fontSize: '0.76rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: '#fb7185',
                    backgroundColor: 'rgba(251, 113, 133, 0.1)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    marginBottom: '2px',
                  }}
                >
                  {event.amount}
                </span>
              )}
              <ArrowRight size={16} />
            </div>

            <div style={{ flex: 1, textAlign: 'right' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Target</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {event.targetEntity}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            Forensic Description
          </span>
          <div
            style={{
              marginTop: '4px',
              padding: '10px 12px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.84rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            {event.description}
          </div>
        </div>

        {/* Supporting Evidence Docket */}
        {linkedEvidence && (
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
              Supporting Evidence Docket
            </span>
            <div
              style={{
                marginTop: '4px',
                padding: '10px 12px',
                backgroundColor: 'rgba(124, 92, 252, 0.05)',
                border: '1px solid rgba(124, 92, 252, 0.2)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {linkedEvidence.fileName}
                </div>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                  SHA-256: {linkedEvidence.sha256.substring(0, 16)}...
                </div>
              </div>

              {onOpenEvidence && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ExternalLink size={12} />}
                  onClick={() => {
                    onClose();
                    onOpenEvidence(linkedEvidence);
                  }}
                >
                  View File
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
