import type { CopilotAuditEntry, CopilotConfidence } from '../types';

let auditLog: CopilotAuditEntry[] = [
  {
    id: 'audit-001',
    timestamp: '22 Sep 2026, 11:04:12',
    caseId: 'CASE-2026-001',
    question: 'Show the complete money flow.',
    answerSnippet: 'Evidence-linked fund dispatch observed starting with victim account, routed via primary mule VPA and intermediary layer...',
    evidenceIds: ['evd-001', 'evd-002'],
    confidence: 'HIGH',
  },
  {
    id: 'audit-002',
    timestamp: '22 Sep 2026, 11:15:30',
    caseId: 'CASE-2026-001',
    question: 'Which entities have the highest risk?',
    answerSnippet: 'Mule VPA mule01@bank (Risk: 82) and device IMEI 356938035643809 (Risk: 78) exhibit highest risk scores...',
    evidenceIds: ['evd-001', 'evd-002', 'evd-003'],
    confidence: 'HIGH',
  },
];

export const copilotAuditService = {
  getEntries: (): CopilotAuditEntry[] => {
    return [...auditLog];
  },

  addEntry: (
    caseId: string,
    question: string,
    answer: string,
    evidenceIds: string[],
    confidence: CopilotConfidence
  ): CopilotAuditEntry => {
    const newEntry: CopilotAuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      caseId,
      question,
      answerSnippet: answer.length > 120 ? `${answer.substring(0, 117)}...` : answer,
      evidenceIds,
      confidence,
    };
    auditLog = [newEntry, ...auditLog];
    return newEntry;
  },

  clearEntries: (): void => {
    auditLog = [];
  },
};
