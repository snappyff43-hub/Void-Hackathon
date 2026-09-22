import React, { useState, useMemo } from 'react';
import {
  Printer,
  Sparkles,
  ShieldAlert,
  Clock,
  ArrowRight,
  FileText,
  DollarSign,
  AlertCircle,
  Layers,
  CheckCircle2,
  Lock,
  Info,
} from 'lucide-react';
import type {
  Investigation,
  EvidenceItem,
  Entity,
  EntityRelationship,
  TimelineEvent,
} from '../../types';
import { Button } from '../ui/Button';
import { Badge, PriorityBadge, StatusBadge } from '../ui/Badge';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { investigationBriefService } from '../../services/investigationBriefService';
import { EntityDetailModal } from '../entities/EntityDetailModal';
import { EvidenceDetailModal } from '../evidence/EvidenceDetailModal';
import { TimelineEventDetailModal } from '../timeline/TimelineEventDetailModal';

interface GoldenHourBriefViewProps {
  investigation: Investigation;
  evidenceItems: EvidenceItem[];
  entities: Entity[];
  relationships: EntityRelationship[];
  timelineEvents: TimelineEvent[];
  onAskAI?: (query: string) => void;
}

export const GoldenHourBriefView: React.FC<GoldenHourBriefViewProps> = ({
  investigation,
  evidenceItems,
  entities,
  relationships,
  timelineEvents,
  onAskAI,
}) => {
  // Modals
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedEvidenceItem, setSelectedEvidenceItem] = useState<EvidenceItem | null>(null);
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<TimelineEvent | null>(null);

  // Generate structured brief using the service
  const brief = useMemo(() => {
    return investigationBriefService.generateBrief(
      investigation,
      evidenceItems,
      entities,
      relationships,
      timelineEvents
    );
  }, [investigation, evidenceItems, entities, relationships, timelineEvents]);

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'var(--status-critical-text)';
    if (score >= 60) return '#fb923c';
    if (score >= 30) return '#fbbf24';
    return '#34d399';
  };

  return (
    <div className="cybertrace-brief-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Print CSS styles */}
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .cybertrace-sidebar,
          .cybertrace-topheader,
          .ct-no-print {
            display: none !important;
          }
          .cybertrace-brief-container {
            padding: 0 !important;
            width: 100% !important;
          }
          .cybertrace-brief-card {
            border: 1px solid #cccccc !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            break-inside: avoid;
          }
        }
      `}</style>

      {/* 1. BRIEF HEADER & ACTION BAR */}
      <div
        className="cybertrace-brief-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '16px 20px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(251, 191, 36, 0.3)',
              }}
            >
              GOLDEN-HOUR BRIEF
            </span>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Tactical Investigation Dossier
            </h1>
            <Badge variant="accent" size="sm">
              T+{brief.caseInfo.generatedAt}
            </Badge>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
            Unified forensic synthesis across verified evidence, correlation topology, and financial telemetry.
          </p>
        </div>

        {/* Action Controls */}
        <div className="ct-no-print" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onAskAI && (
            <Button
              variant="outline"
              size="sm"
              icon={<Sparkles size={13} style={{ color: 'var(--accent-primary)' }} />}
              onClick={() => onAskAI('Summarize the Golden-Hour Brief and prioritize immediate response actions.')}
            >
              Ask AI to Summarize Brief
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={<Printer size={13} />}
            onClick={handlePrint}
          >
            Print Brief
          </Button>
        </div>
      </div>

      {/* 2. DATA CLASSIFICATION LEGEND (PHASE 5) */}
      <div
        className="cybertrace-brief-card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '10px',
          padding: '10px 16px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.76rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34d399' }} />
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>VERIFIED EVIDENCE</strong>
            <span style={{ color: 'var(--text-dim)', marginLeft: '4px' }}>
              ({brief.dataClassification.verifiedEvidenceCount} artifacts directly grounded)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>DERIVED ANALYSIS</strong>
            <span style={{ color: 'var(--text-dim)', marginLeft: '4px' }}>
              ({brief.dataClassification.derivedAnalysisCount} deterministic correlation outputs)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fbbf24' }} />
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>INVESTIGATIVE LEADS</strong>
            <span style={{ color: 'var(--text-dim)', marginLeft: '4px' }}>
              ({brief.dataClassification.investigativeLeadsCount} recommendations for officer review)
            </span>
          </div>
        </div>
      </div>

      {/* 3. CASE SNAPSHOT BAR */}
      <Card className="cybertrace-brief-card">
        <CardContent style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {brief.caseInfo.caseNumber}
                </span>
                <span style={{ color: 'var(--text-dim)' }}>•</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {brief.caseInfo.title}
                </span>
                <Badge variant="default" size="sm">
                  {brief.caseInfo.type}
                </Badge>
                <PriorityBadge priority={brief.caseInfo.priority} />
                <StatusBadge status={brief.caseInfo.status as any} />
              </div>

              {/* Overall Risk Score Pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Composite Risk:
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: getRiskColor(brief.caseInfo.overallRiskScore),
                    backgroundColor: 'var(--bg-surface)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${getRiskColor(brief.caseInfo.overallRiskScore)}`,
                  }}
                >
                  {brief.caseInfo.overallRiskScore} / 100
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {brief.caseInfo.summary}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. MONEY FLOW & FUND TRANSIT PATH */}
      <Card className="cybertrace-brief-card">
        <CardHeader
          title="Evidence-Linked Money Flow Path"
          subtitle="Observed transaction sequence across banking switch and settlement dockets"
          icon={<DollarSign size={16} style={{ color: 'var(--accent-primary)' }} />}
        />
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Flow Stage Chips */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '10px',
              }}
            >
              {brief.moneyFlow.stages.map((stg, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Step 0{idx + 1} • {stg.role}
                    </span>
                    {stg.timestamp && (
                      <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                        {stg.timestamp}
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {stg.label}
                  </div>
                  {stg.amount && (
                    <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fb7185' }}>
                      {stg.amount}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Financial Accounting Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: 'rgba(124, 92, 252, 0.04)',
                border: '1px solid rgba(124, 92, 252, 0.2)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Initial Debit
                </span>
                <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {brief.moneyFlow.initialTransfer}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Forwarded Hop (Layer 2)
                </span>
                <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {brief.moneyFlow.forwardedAmount}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Terminal Cash-out Hop
                </span>
                <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fbbf24' }}>
                  {brief.moneyFlow.downstreamAmount}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Observed Transaction Difference
                </span>
                <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--status-critical-text)' }}>
                  {brief.moneyFlow.observedDifference}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              <Info size={12} style={{ color: 'var(--accent-primary)' }} />
              <span>
                Designation: <strong>Observed transaction difference</strong>. Reflects numerical accounting variances across transit hops pending final bank reconciliation.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. HIGH-RISK ENTITIES & TELEMETRY */}
      <Card className="cybertrace-brief-card">
        <CardHeader
          title="High-Risk Correlated Entities"
          subtitle="Top suspect identifiers flagged by cross-source correlation and velocity scoring"
          icon={<ShieldAlert size={16} style={{ color: 'var(--status-critical-text)' }} />}
        />
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '10px',
              }}
            >
              {brief.highRiskEntities.map((item) => (
                <div
                  key={item.entity.id}
                  onClick={() => setSelectedEntity(item.entity)}
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
                  title="Click to view detailed entity profile"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Badge variant="mono" size="sm">
                      {item.entity.type.replace('_', ' ')}
                    </Badge>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: getRiskColor(item.riskScore),
                        }}
                      >
                        Risk {item.riskScore}
                      </span>
                      <Badge variant="outline" size="sm">
                        {item.confidence}% Conf
                      </Badge>
                    </div>
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.entity.normalizedValue}
                  </div>

                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    {item.primaryFactor}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    <span>{item.evidenceCount} Supporting Evidence Dockets</span>
                    <span style={{ color: 'var(--accent-primary)' }}>Inspect Entity →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. KEY FINDINGS (REUSED STEP 6 PATTERNS) */}
      <Card className="cybertrace-brief-card">
        <CardHeader
          title="Key Objective Findings & Pattern Indicators"
          subtitle="Directly supported by multi-source evidence and rapid layering indicators"
          icon={<Layers size={16} style={{ color: 'var(--accent-primary)' }} />}
        />
        <CardContent>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '10px',
            }}
          >
            {brief.keyFindings.map((finding) => (
              <div
                key={finding.id}
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    {finding.patternType}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {finding.riskContribution}
                  </span>
                </div>

                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {finding.title}
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {finding.whyItMatters}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                  {finding.supportingEvidence.map((cit, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const itm = evidenceItems.find((e) => e.id === cit.evidenceId || e.fileName === cit.fileName);
                        if (itm) setSelectedEvidenceItem(itm);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 6px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '3px',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      <FileText size={10} style={{ color: 'var(--accent-primary)' }} />
                      <span>{cit.fileName}</span>
                      {cit.rowRef && <span style={{ color: 'var(--text-dim)' }}>• {cit.rowRef}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 7. CHRONOLOGICAL TIMELINE HIGHLIGHTS */}
      <Card className="cybertrace-brief-card">
        <CardHeader
          title="Chronological Incident Timeline"
          subtitle="Sequential event reconstruction across telecommunications and banking switch telemetry"
          icon={<Clock size={16} style={{ color: 'var(--accent-primary)' }} />}
        />
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {brief.timelineHighlights.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedTimelineEvent(evt)}
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-primary)', fontWeight: 600, minWidth: '85px' }}>
                    {evt.timestamp.includes(',') ? evt.timestamp.split(', ')[1] : evt.timestamp}
                  </span>
                  <Badge variant="accent" size="sm">
                    {evt.eventType}
                  </Badge>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {evt.description}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {evt.amount && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', fontWeight: 700, color: '#fb7185' }}>
                      {evt.amount}
                    </span>
                  )}
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {evt.sourceEntity} → {evt.targetEntity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 8. EVIDENCE INTEGRITY & REPOSITORY DOCKET */}
      <Card className="cybertrace-brief-card">
        <CardHeader
          title="Evidence Integrity & Vault Dockets"
          subtitle="Cryptographic integrity metadata and SHA-256 digital seals"
          icon={<Lock size={16} style={{ color: '#34d399' }} />}
        />
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '10px',
              }}
            >
              {brief.evidenceSummary.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => {
                    const itm = evidenceItems.find((e) => e.id === ev.id);
                    if (itm) setSelectedEvidenceItem(itm);
                  }}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {ev.fileName}
                    </span>
                    <Badge variant="default" size="sm">
                      {ev.sourceType}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    SHA-256: {ev.sha256}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#34d399' }}>
                    <CheckCircle2 size={11} />
                    <span>{ev.integrityNote}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 9. SUGGESTED INVESTIGATION LEADS */}
      <Card className="cybertrace-brief-card" style={{ border: '1px solid rgba(251, 191, 36, 0.3)' }}>
        <CardHeader
          title="Suggested Investigative Leads (Officer Review)"
          subtitle="Prioritized recommendations derived from multi-hop nexus analysis and risk scoring"
          icon={<AlertCircle size={16} style={{ color: '#fbbf24' }} />}
        />
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {brief.investigationLeads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'rgba(251, 191, 36, 0.03)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flex: 1, minWidth: '260px' }}>
                  <ArrowRight size={13} style={{ color: '#fbbf24', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {lead.lead}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      Basis: {lead.rationale}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Badge variant={lead.priority === 'HIGH' ? 'high' : 'medium'} size="sm">
                    {lead.priority} PRIORITY
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals for Direct Entity, Evidence & Event Inspection */}
      <EntityDetailModal
        entity={selectedEntity}
        relationships={relationships}
        entities={entities}
        evidenceItems={evidenceItems}
        onClose={() => setSelectedEntity(null)}
      />

      <EvidenceDetailModal
        item={selectedEvidenceItem}
        onClose={() => setSelectedEvidenceItem(null)}
      />

      <TimelineEventDetailModal
        event={selectedTimelineEvent}
        evidenceItems={evidenceItems}
        onClose={() => setSelectedTimelineEvent(null)}
        onOpenEvidence={(itm) => setSelectedEvidenceItem(itm)}
      />
    </div>
  );
};
