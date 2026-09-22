import React, { useState } from 'react';
import {
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import type { Investigation, InvestigationFinding } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EvidenceDetailModal } from './EvidenceDetailModal';

interface InvestigationOverviewProps {
  investigation: Investigation;
}

export const InvestigationOverview: React.FC<InvestigationOverviewProps> = ({ investigation }) => {
  const [selectedFinding, setSelectedFinding] = useState<InvestigationFinding | null>(null);

  const findings = investigation.findings || [];
  const activities = investigation.activities || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Metrics Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
        }}
      >
        {/* Fraud Type */}
        <Card style={{ padding: '14px 16px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Fraud Type
          </span>
          <div style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '6px' }}>
            {investigation.type || 'Financial Fraud'}
          </div>
        </Card>

        {/* Reported Loss */}
        <Card style={{ padding: '14px 16px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Reported Loss
          </span>
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              marginTop: '4px',
            }}
          >
            {investigation.reportedLoss || '₹75,000'}
          </div>
        </Card>

        {/* Evidence Items */}
        <Card style={{ padding: '14px 16px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Evidence Items
          </span>
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              marginTop: '4px',
            }}
          >
            {investigation.evidenceCount}
          </div>
        </Card>

        {/* Entities */}
        <Card style={{ padding: '14px 16px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Entities
          </span>
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              marginTop: '4px',
            }}
          >
            {investigation.entitiesCount}
          </div>
        </Card>

        {/* Risk Score */}
        <Card style={{ padding: '14px 16px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Risk Score
          </span>
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: (investigation.riskScore || 0) >= 80 ? 'var(--status-critical-text)' : '#fbbf24',
              marginTop: '4px',
            }}
          >
            {investigation.riskScore !== undefined ? `${investigation.riskScore} / 100` : '82 / 100'}
          </div>
        </Card>

        {/* Status */}
        <Card style={{ padding: '14px 16px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Status
          </span>
          <div style={{ marginTop: '8px' }}>
            <StatusBadge status={investigation.status} size="md" />
          </div>
        </Card>
      </div>

      {/* Main Two-Column Grid: Summary & Findings (Left) vs Activity & Details (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)',
          gap: '18px',
          alignItems: 'start',
        }}
        className="ct-overview-grid"
      >
        {/* Left Column: Summary & Findings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Investigation Summary Section */}
          <Card>
            <CardHeader
              title="Investigation Summary"
              icon={<FileText size={16} />}
            />
            <CardContent>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.6,
                }}
              >
                {investigation.summary}
              </p>
            </CardContent>
          </Card>

          {/* Key Findings Section */}
          <Card>
            <CardHeader
              title="Key Findings"
              subtitle="Critical evidential links established from forensic inputs"
            />
            <CardContent>
              {findings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {findings.map((finding, idx) => (
                    <div
                      key={finding.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            fontWeight: 600,
                          }}
                        >
                          Finding {idx + 1}:
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {finding.text}
                        </span>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<ExternalLink size={12} />}
                        iconPosition="right"
                        onClick={() => setSelectedFinding(finding)}
                        style={{ height: '28px', flexShrink: 0, padding: '0 10px' }}
                      >
                        View Evidence
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  No key findings recorded yet. Add evidence to generate findings.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Case Details Panel & Investigation Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Case Details Panel */}
          <Card>
            <CardHeader title="Case Details" />
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Case ID</span>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#a78bfa' }}>
                    {investigation.caseNumber}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Created</span>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {investigation.createdDate || '22 Sep 2026'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status</span>
                  <StatusBadge status={investigation.status} size="sm" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Priority</span>
                  <PriorityBadge priority={investigation.priority} size="sm" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Investigation Type</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {investigation.type || 'Financial Fraud'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Evidence</span>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {investigation.evidenceCount}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Entities</span>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {investigation.entitiesCount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investigation Activity */}
          <Card>
            <CardHeader
              title="Investigation Activity"
              icon={<Clock size={16} />}
            />
            <CardContent>
              {activities.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '12px',
                        fontSize: '0.82rem',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem',
                          color: 'var(--text-dim)',
                          width: '65px',
                          flexShrink: 0,
                        }}
                      >
                        {act.time}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{act.action}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No recent activity.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Evidence Detail Modal */}
      <EvidenceDetailModal
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />
    </div>
  );
};
