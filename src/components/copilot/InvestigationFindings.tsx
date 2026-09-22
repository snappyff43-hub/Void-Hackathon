import React from 'react';
import {
  FileText,
  AlertTriangle,
  Layers,
  Smartphone,
  Globe,
  PhoneCall,
  TrendingUp,
} from 'lucide-react';
import type { InvestigationFindingItem, EvidenceItem, CopilotCitation } from '../../types';
import { Badge } from '../ui/Badge';

interface InvestigationFindingsProps {
  findings: InvestigationFindingItem[];
  evidenceItems: EvidenceItem[];
  onOpenEvidence: (evidenceItem: EvidenceItem) => void;
}

export const InvestigationFindings: React.FC<InvestigationFindingsProps> = ({
  findings,
  evidenceItems,
  onOpenEvidence,
}) => {
  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case 'Cross-Source Nexus':
        return <Layers size={15} style={{ color: 'var(--accent-primary)' }} />;
      case 'Financial Layering':
        return <TrendingUp size={15} style={{ color: '#fb7185' }} />;
      case 'Endpoint Hardware':
        return <Smartphone size={15} style={{ color: '#a78bfa' }} />;
      case 'Network Infrastructure':
        return <Globe size={15} style={{ color: '#34d399' }} />;
      case 'Social Engineering Link':
        return <PhoneCall size={15} style={{ color: '#38bdf8' }} />;
      default:
        return <AlertTriangle size={15} style={{ color: '#fbbf24' }} />;
    }
  };

  const handleCitationClick = (citation: CopilotCitation) => {
    const item = evidenceItems.find((e) => e.id === citation.evidenceId || e.fileName === citation.fileName);
    if (item) {
      onOpenEvidence(item);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Automated Forensic Findings
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
            Evidence-grounded pattern detection and objective risk factor indicators.
          </p>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            backgroundColor: 'var(--bg-surface-elevated)',
            padding: '3px 8px',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {findings.length} Evidence-Linked Patterns
        </span>
      </div>

      {/* Grid of Findings */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '12px',
        }}
      >
        {findings.map((finding) => (
          <div
            key={finding.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '14px 16px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              gap: '10px',
            }}
          >
            {/* Top Bar: Pattern type + Risk contribution */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {getPatternIcon(finding.patternType)}
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {finding.patternType}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: 'var(--accent-primary)',
                      backgroundColor: 'rgba(124, 92, 252, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      border: '1px solid rgba(124, 92, 252, 0.25)',
                    }}
                  >
                    {finding.riskContribution}
                  </span>
                  <Badge variant="outline" size="sm">
                    {finding.confidence}% Conf
                  </Badge>
                </div>
              </div>

              {/* Title */}
              <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                {finding.title}
              </h4>

              {/* Why It Matters */}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                {finding.whyItMatters}
              </p>
            </div>

            {/* Supporting Evidence Citations */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                paddingTop: '8px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Supporting Evidence:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {finding.supportingEvidence.map((cit, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCitationClick(cit)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
                    title="Click to view supporting evidence docket"
                  >
                    <FileText size={11} style={{ color: 'var(--accent-primary)' }} />
                    <span>{cit.fileName}</span>
                    {cit.rowRef && (
                      <span style={{ color: 'var(--text-dim)' }}>• {cit.rowRef}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
