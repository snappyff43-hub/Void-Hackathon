import React, { useState } from 'react';
import {
  Link,
  ShieldAlert,
  ArrowRight,
  Database,
  Briefcase,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import type { Entity, EntityRelationship, EvidenceItem } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge, PriorityBadge } from '../ui/Badge';
import { WhyConnectedModal } from './WhyConnectedModal';

interface EntityDetailModalProps {
  entity: Entity | null;
  relationships: EntityRelationship[];
  entities: Entity[];
  evidenceItems: EvidenceItem[];
  onClose: () => void;
  onSelectEntity?: (entity: Entity) => void;
  onAskAI?: (entity: Entity) => void;
}

export const EntityDetailModal: React.FC<EntityDetailModalProps> = ({
  entity,
  relationships,
  entities,
  evidenceItems,
  onClose,
  onSelectEntity,
  onAskAI,
}) => {
  const [selectedRelationship, setSelectedRelationship] = useState<EntityRelationship | null>(null);

  if (!entity) return null;

  // Find all direct relationships involving this entity
  const directRelationships = relationships.filter(
    (r) => r.sourceEntityId === entity.id || r.targetEntityId === entity.id
  );

  // Find supporting evidence objects
  const supportingEvidence = evidenceItems.filter((ev) =>
    entity.sourceEvidenceIds.includes(ev.id)
  );

  return (
    <>
      <Modal
        isOpen={!!entity}
        onClose={onClose}
        title={entity.normalizedValue}
        subtitle={`${entity.type} identifier profile`}
        maxWidth="700px"
        footer={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {onAskAI ? (
              <Button
                variant="outline"
                size="sm"
                icon={<Sparkles size={13} style={{ color: 'var(--accent-primary)' }} />}
                onClick={() => {
                  onClose();
                  onAskAI(entity);
                }}
              >
                Ask AI About Entity
              </Button>
            ) : <div />}
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close Entity View
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Top Matrix: Type, Risk, Confidence, Dates */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px',
              padding: '12px 14px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Entity Type
              </span>
              <div style={{ marginTop: '3px' }}>
                <Badge variant="mono" size="sm">
                  {entity.type}
                </Badge>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Risk Assessment
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: entity.riskScore >= 60 ? 'var(--status-critical-text)' : '#fbbf24',
                  }}
                >
                  {entity.riskScore} / 100
                </span>
                <PriorityBadge
                  priority={
                    entity.riskScore >= 80 ? 'CRITICAL' : entity.riskScore >= 60 ? 'HIGH' : entity.riskScore >= 30 ? 'MEDIUM' : 'LOW'
                  }
                  size="sm"
                />
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Confidence
              </span>
              <div style={{ marginTop: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {entity.confidence}%
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                First / Last Seen
              </span>
              <div style={{ marginTop: '3px', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                {entity.firstSeen}
              </div>
            </div>
          </div>

          {/* Value Representation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Normalized Identifier
              </span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: '#a78bfa', fontWeight: 600, marginTop: '2px' }}>
                {entity.normalizedValue}
              </div>
            </div>

            <div
              style={{
                padding: '8px 12px',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Original Raw Representation
              </span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {entity.value}
              </div>
            </div>
          </div>

          {/* Explainable Risk Factors Breakdown */}
          {entity.riskFactors && entity.riskFactors.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <ShieldAlert size={14} style={{ color: entity.riskScore >= 60 ? 'var(--status-critical-text)' : '#fbbf24' }} />
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Explainable Risk Factors ({entity.riskScore} pts)
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {entity.riskFactors.map((rf, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>{rf.factor}</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent-primary)',
                        fontWeight: 600,
                      }}
                    >
                      +{rf.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connected Relationships Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Correlated Relationships ({directRelationships.length})
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Click [ Why Connected? ] for evidential reasoning
              </span>
            </div>

            {directRelationships.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {directRelationships.map((rel) => {
                  const isSource = rel.sourceEntityId === entity.id;
                  const otherEntityId = isSource ? rel.targetEntityId : rel.sourceEntityId;
                  const otherEntity = entities.find((e) => e.id === otherEntityId);

                  return (
                    <div
                      key={rel.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-md)',
                        gap: '10px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                        <Badge variant="accent" size="sm">
                          <Link size={10} />
                          {rel.relationshipType}
                        </Badge>

                        {rel.amount && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {rel.amount}
                          </span>
                        )}

                        <ArrowRight size={13} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />

                        <div
                          onClick={() => otherEntity && onSelectEntity?.(otherEntity)}
                          style={{
                            cursor: otherEntity ? 'pointer' : 'default',
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              color: otherEntity ? '#a78bfa' : 'var(--text-secondary)',
                              textDecoration: otherEntity ? 'underline' : 'none',
                            }}
                          >
                            {otherEntity?.normalizedValue || otherEntityId}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginLeft: '6px' }}>
                            ({otherEntity?.type || 'Entity'})
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        icon={<HelpCircle size={12} />}
                        onClick={() => setSelectedRelationship(rel)}
                        style={{ height: '26px', padding: '0 8px', fontSize: '0.74rem' }}
                      >
                        Why Connected?
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                No active cross-source relationships mapped yet.
              </p>
            )}
          </div>

          {/* Associated Cases & Supporting Evidence */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Associated Cases */}
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Associated Cases ({entity.caseIds.length})
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {entity.caseIds.map((cId) => (
                  <Badge key={cId} variant="mono" size="sm">
                    <Briefcase size={10} style={{ color: 'var(--accent-primary)' }} />
                    {cId}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Supporting Evidence */}
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Supporting Evidence Artifacts ({supportingEvidence.length || entity.sourceEvidenceIds.length})
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {supportingEvidence.length > 0
                  ? supportingEvidence.map((ev) => (
                      <Badge key={ev.id} variant="default" size="sm">
                        <Database size={10} style={{ color: 'var(--text-muted)' }} />
                        {ev.fileName}
                      </Badge>
                    ))
                  : entity.sourceEvidenceIds.map((id) => (
                      <Badge key={id} variant="default" size="sm">
                        {id}
                      </Badge>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Why Connected Explainer Modal */}
      <WhyConnectedModal
        relationship={selectedRelationship}
        sourceEntity={entities.find((e) => e.id === selectedRelationship?.sourceEntityId)}
        targetEntity={entities.find((e) => e.id === selectedRelationship?.targetEntityId)}
        onClose={() => setSelectedRelationship(null)}
      />
    </>
  );
};
