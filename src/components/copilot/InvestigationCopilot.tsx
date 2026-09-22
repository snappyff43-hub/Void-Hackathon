import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Send,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  History,
  AlertCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import type {
  Investigation,
  EvidenceItem,
  Entity,
  EntityRelationship,
  TimelineEvent,
  CopilotResponse,
  CopilotCitation,
  InvestigationFindingItem,
  CopilotAuditEntry,
} from '../../types';
import { Button } from '../ui/Button';
import { Badge, PriorityBadge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';
import { copilotService } from '../../services/copilotService';
import { copilotAuditService } from '../../services/copilotAuditService';
import { InvestigationFindings } from './InvestigationFindings';
import { EvidenceDetailModal } from '../evidence/EvidenceDetailModal';

interface InvestigationCopilotProps {
  investigation: Investigation;
  evidenceItems: EvidenceItem[];
  entities: Entity[];
  relationships: EntityRelationship[];
  timelineEvents: TimelineEvent[];
  initialQuery?: string;
  activeEntity?: Entity | null;
  activeRelationship?: EntityRelationship | null;
  onOpenEvidence?: (evidenceItem: EvidenceItem) => void;
}

const SUGGESTED_QUESTIONS = [
  'What happened in this case?',
  'Show the complete money flow.',
  'Which entities are high risk?',
  'What happened immediately before the first transfer?',
  'Which entities appear across multiple evidence sources?',
  'What evidence supports the main relationship?',
  'What should I review next?',
];

export const InvestigationCopilot: React.FC<InvestigationCopilotProps> = ({
  investigation,
  evidenceItems,
  entities,
  relationships,
  timelineEvents,
  initialQuery,
  activeEntity,
  activeRelationship,
  onOpenEvidence,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ type: 'user' | 'assistant'; content?: string; response?: CopilotResponse; timestamp: string }>
  >([]);

  const [summaryResponse, setSummaryResponse] = useState<CopilotResponse | null>(null);
  const [findings, setFindings] = useState<InvestigationFindingItem[]>([]);
  const [nextLeads, setNextLeads] = useState<string[]>([]);
  const [auditEntries, setAuditEntries] = useState<CopilotAuditEntry[]>([]);
  const [showAuditPanel, setShowAuditPanel] = useState(false);
  const [showFindingsPanel, setShowFindingsPanel] = useState(true);

  // Modal for evidence viewing
  const [selectedEvidenceItem, setSelectedEvidenceItem] = useState<EvidenceItem | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Build context object
  const copilotContext = {
    investigation,
    evidenceItems,
    entities,
    relationships,
    timelineEvents,
    activeEntity,
    activeRelationship,
  };

  // Initial load: generate summary, findings, and leads
  useEffect(() => {
    const loadInitialData = async () => {
      const summary = await copilotService.generateSummary(copilotContext);
      setSummaryResponse(summary);

      const f = await copilotService.generateFindings(copilotContext);
      setFindings(f);

      const leads = await copilotService.suggestNextSteps(copilotContext);
      setNextLeads(leads);

      setAuditEntries(copilotAuditService.getEntries());
    };
    loadInitialData();
  }, [investigation.id]);

  // If initialQuery is provided, automatically trigger it
  useEffect(() => {
    if (initialQuery && initialQuery.trim().length > 0) {
      handleAsk(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async (queryText: string) => {
    const q = queryText.trim();
    if (!q || isProcessing) return;

    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { type: 'user', content: q, timestamp: time }]);
    setInputQuery('');
    setIsProcessing(true);

    try {
      const resp = await copilotService.askQuestion(q, copilotContext);
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          response: resp,
          timestamp: resp.timestamp,
        },
      ]);
      setAuditEntries(copilotAuditService.getEntries());
    } catch (err) {
      console.error('Copilot inquiry error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCitationClick = (citation: CopilotCitation) => {
    const item = evidenceItems.find(
      (e) => e.id === citation.evidenceId || e.fileName === citation.fileName
    );
    if (item) {
      if (onOpenEvidence) {
        onOpenEvidence(item);
      } else {
        setSelectedEvidenceItem(item);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* 1. TOP TITLE & CONTEXT BAR */}
      <div
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                backgroundColor: 'rgba(124, 92, 252, 0.1)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(124, 92, 252, 0.3)',
              }}
            >
              CYBERTRACE AI COPILOT
            </span>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              AI Investigation Copilot
            </h1>
            <Badge variant="accent" size="sm">
              Local Grounded Engine
            </Badge>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
            Evidence-grounded investigative assistance • Deterministic correlation & cross-source telemetry analysis
          </p>
        </div>

        {/* Audit Trail Toggle */}
        <Button
          variant="outline"
          size="sm"
          icon={<History size={13} />}
          onClick={() => setShowAuditPanel((prev) => !prev)}
        >
          {showAuditPanel ? 'Hide AI Activity' : `AI Activity (${auditEntries.length})`}
        </Button>
      </div>

      {/* 8. CASE SUMMARY & SCOPE CARD */}
      <Card>
        <CardContent style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Target Case Dossier:
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {investigation.caseNumber}
                </span>
                <Badge variant="default" size="sm">
                  {investigation.type}
                </Badge>
                <PriorityBadge priority={investigation.priority} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{evidenceItems.length}</strong> Evidence
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{entities.length}</strong> Entities
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{relationships.length}</strong> Links
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{timelineEvents.length}</strong> Events
                </span>
              </div>
            </div>

            {/* Generated Summary Paragraph */}
            {summaryResponse && (
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'rgba(124, 92, 252, 0.04)',
                  border: '1px solid rgba(124, 92, 252, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: 'var(--accent-primary)', fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  <Sparkles size={12} />
                  <span>Evidence-Grounded Dossier Synthesis</span>
                </div>
                {summaryResponse.answer}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 15. AI AUDIT TRAIL PANEL (when toggled) */}
      {showAuditPanel && (
        <Card style={{ border: '1px solid var(--border-default)' }}>
          <CardContent style={{ padding: '14px 18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <History size={14} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Forensic AI Activity & Audit Log
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  In-memory audit trail • Section 65B traceability
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                {auditEntries.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', flexShrink: 0 }}>
                        {entry.timestamp}
                      </span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        "{entry.question}"
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        → {entry.answerSnippet}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {entry.evidenceIds.length} Evd
                      </span>
                      <Badge variant={entry.confidence === 'HIGH' ? 'accent' : 'default'} size="sm">
                        {entry.confidence}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 9. KEY FINDINGS TOGGLEABLE PANEL */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => setShowFindingsPanel((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px 2px',
            fontSize: '0.84rem',
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>Key Objective Findings & Pattern Indicators ({findings.length})</span>
          </div>
          {showFindingsPanel ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {showFindingsPanel && (
          <InvestigationFindings
            findings={findings}
            evidenceItems={evidenceItems}
            onOpenEvidence={(item) => {
              if (onOpenEvidence) onOpenEvidence(item);
              else setSelectedEvidenceItem(item);
            }}
          />
        )}
      </div>

      {/* 10. SUGGESTED INVESTIGATION LEADS */}
      {nextLeads.length > 0 && (
        <Card style={{ backgroundColor: 'rgba(251, 191, 36, 0.03)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
          <CardContent style={{ padding: '12px 18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} style={{ color: '#fbbf24' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Suggested Investigative Leads & Next Steps
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {nextLeads.map((lead, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'baseline', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <ArrowRight size={11} style={{ color: '#fbbf24', flexShrink: 0 }} />
                    <span>{lead}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 7. SUGGESTED QUICK QUESTIONS STRIP */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
          Suggested Inquiries:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              disabled={isProcessing}
              style={{
                padding: '6px 12px',
                fontSize: '0.76rem',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-default)')}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 4. CONVERSATION / RESPONSE STREAM */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          minHeight: '260px',
          maxHeight: '620px',
          overflowY: 'auto',
          padding: '16px',
          backgroundColor: '#07090e',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              gap: '8px',
            }}
          >
            <Terminal size={28} style={{ color: 'var(--text-dim)' }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Copilot Ready for Case Inquiry
            </span>
            <p style={{ fontSize: '0.78rem', maxWidth: '420px', margin: 0 }}>
              Select a suggested inquiry above or enter a specific query below to interrogate the verified case evidence.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            if (msg.type === 'user') {
              return (
                <div
                  key={index}
                  style={{
                    alignSelf: 'flex-end',
                    maxWidth: '78%',
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Investigator
                    </span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {msg.content}
                  </div>
                </div>
              );
            }

            // Assistant Response Format
            const resp = msg.response;
            if (!resp) return null;

            return (
              <div
                key={index}
                style={{
                  alignSelf: 'flex-start',
                  maxWidth: '92%',
                  padding: '16px 18px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
                    <span style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Evidence-Grounded Analysis
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Confidence:
                    </span>
                    <Badge variant={resp.confidence === 'HIGH' ? 'accent' : 'default'} size="sm">
                      {resp.confidence}
                    </Badge>
                  </div>
                </div>

                {/* Main Answer Paragraph */}
                <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.55 }}>
                  {resp.answer}
                </div>

                {/* Key Findings List */}
                {resp.keyFindings && resp.keyFindings.length > 0 && (
                  <div
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
                      Key Findings
                    </span>
                    {resp.keyFindings.map((kf, kfIdx) => (
                      <div key={kfIdx} style={{ display: 'flex', alignItems: 'baseline', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--accent-primary)' }}>•</span>
                        <span>{kf}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Evidence Citations */}
                {resp.citations && resp.citations.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Evidence Citations:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {resp.citations.map((cit, citIdx) => (
                        <button
                          key={citIdx}
                          onClick={() => handleCitationClick(cit)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 8px',
                            backgroundColor: 'rgba(124, 92, 252, 0.08)',
                            border: '1px solid rgba(124, 92, 252, 0.3)',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                          }}
                          title={cit.detail || 'Click to inspect supporting evidence docket'}
                        >
                          <FileText size={11} style={{ color: 'var(--accent-primary)' }} />
                          <span>{cit.fileName}</span>
                          {cit.rowRef && (
                            <span style={{ color: 'var(--accent-primary)' }}>• {cit.rowRef}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Review */}
                {resp.recommendedReview && resp.recommendedReview.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Recommended Review:
                    </span>
                    {resp.recommendedReview.map((rec, recIdx) => (
                      <div key={recIdx} style={{ display: 'flex', alignItems: 'baseline', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                        <ArrowRight size={10} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}

        {isProcessing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.78rem', padding: '8px' }}>
            <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>Consulting deterministic evidence correlation index...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. INPUT BOX */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(inputQuery);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <Terminal size={16} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Ask Copilot about evidence, money flow, entity risk, or timeline..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={isProcessing}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.84rem',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
          }}
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          icon={<Send size={13} />}
          disabled={!inputQuery.trim() || isProcessing}
        >
          Ask Copilot
        </Button>
      </form>

      {/* Evidence Detail Modal for Citation Inspection */}
      <EvidenceDetailModal
        item={selectedEvidenceItem}
        onClose={() => setSelectedEvidenceItem(null)}
      />
    </div>
  );
};
