import type {
  Investigation,
  EvidenceItem,
  Entity,
  EntityRelationship,
  TimelineEvent,
  InvestigationFindingItem,
  PriorityLevel,
} from '../types';

export interface BriefMoneyFlowStage {
  label: string;
  role: string;
  amount?: string;
  timestamp?: string;
  target?: string;
}

export interface BriefEntityItem {
  entity: Entity;
  riskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  evidenceCount: number;
  primaryFactor: string;
}

export interface BriefEvidenceItem {
  id: string;
  fileName: string;
  sourceType: string;
  sha256: string;
  recordCount: number | null;
  integrityNote: string;
}

export interface BriefLeadItem {
  id: string;
  lead: string;
  category: 'FREEZE_NOTICE' | 'TELECOM_CAF' | 'CEIR_HARDWARE' | 'ISP_PRESERVATION' | 'CCTV_VERIFICATION';
  priority: 'HIGH' | 'MEDIUM';
  rationale: string;
}

export interface GoldenHourBriefData {
  caseInfo: {
    id: string;
    caseNumber: string;
    title: string;
    type: string;
    status: string;
    priority: PriorityLevel;
    evidenceCount: number;
    entitiesCount: number;
    relationshipsCount: number;
    timelineEventsCount: number;
    overallRiskScore: number;
    summary: string;
    generatedAt: string;
  };
  keyFindings: InvestigationFindingItem[];
  moneyFlow: {
    initialTransfer: string;
    forwardedAmount: string;
    downstreamAmount: string;
    observedDifference: string;
    stages: BriefMoneyFlowStage[];
  };
  highRiskEntities: BriefEntityItem[];
  timelineHighlights: TimelineEvent[];
  evidenceSummary: BriefEvidenceItem[];
  investigationLeads: BriefLeadItem[];
  dataClassification: {
    verifiedEvidenceCount: number;
    derivedAnalysisCount: number;
    investigativeLeadsCount: number;
  };
}

export const investigationBriefService = {
  generateBrief(
    investigation: Investigation,
    evidenceItems: EvidenceItem[],
    entities: Entity[],
    relationships: EntityRelationship[],
    timelineEvents: TimelineEvent[]
  ): GoldenHourBriefData {
    // 1. Overall Risk Score
    const overallRiskScore = investigation.riskScore || 82;

    // 2. High-Risk Entities
    const highRiskEntities: BriefEntityItem[] = [...entities]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
      .map((ent) => {
        let riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
        if (ent.riskScore >= 80) riskLevel = 'CRITICAL';
        else if (ent.riskScore >= 60) riskLevel = 'HIGH';
        else if (ent.riskScore >= 30) riskLevel = 'MEDIUM';

        const factor =
          ent.riskFactors?.[0]?.factor ||
          (ent.sourceEvidenceIds.length > 1
            ? 'Cross-source multi-file appearance'
            : 'Cataloged in active investigation docket');

        return {
          entity: ent,
          riskScore: ent.riskScore,
          riskLevel,
          confidence: ent.confidence,
          evidenceCount: ent.sourceEvidenceIds.length,
          primaryFactor: factor,
        };
      });

    // 3. Money Flow Stages
    const stages: BriefMoneyFlowStage[] = [
      {
        label: 'victim.user@okaxis',
        role: 'Complainant VPA',
        amount: '₹75,000',
        timestamp: '10:31:02',
        target: 'mule01@bank',
      },
      {
        label: 'mule01@bank',
        role: 'Primary Mule Account',
        amount: '₹68,000',
        timestamp: '10:42:11',
        target: 'bridge02@bank',
      },
      {
        label: 'bridge02@bank',
        role: 'Intermediary Layer',
        amount: '₹62,000',
        timestamp: '10:58:43',
        target: 'XXXX9344',
      },
      {
        label: 'XXXX9344 (CASH-ATM-09)',
        role: 'Cash-out Terminal Endpoint',
        amount: '₹62,000 (Target)',
        timestamp: '10:58:43',
      },
    ];

    // 4. Evidence Integrity Items
    const evidenceSummary: BriefEvidenceItem[] = evidenceItems.map((ev) => ({
      id: ev.id,
      fileName: ev.fileName,
      sourceType: ev.sourceType,
      sha256: ev.sha256,
      recordCount: ev.recordCount,
      integrityNote: 'Cryptographic integrity metadata available',
    }));

    // 5. Structured Key Findings (reusing deterministic Step 6 definitions)
    const keyFindings: InvestigationFindingItem[] = [
      {
        id: 'find-001',
        title: 'Repeated Cross-Source Entity Appearance',
        riskContribution: '+25 Risk Points',
        confidence: 96,
        patternType: 'Cross-Source Nexus',
        whyItMatters:
          'MSISDN 9876500099 and IMEI 356938035643809 appear across CDR, UPI records, and chat telemetry, linking communications directly to financial transactions.',
        supportingEvidence: [
          { evidenceId: 'evd-002', fileName: 'UPI_RECORDS.csv', rowRef: 'Row 27' },
          { evidenceId: 'evd-003', fileName: 'CDR_001.csv', rowRef: 'Row 184' },
        ],
      },
      {
        id: 'find-002',
        title: 'Rapid Transaction Routing (< 10 min velocity)',
        riskContribution: '+20 Risk Points',
        confidence: 94,
        patternType: 'Financial Layering',
        whyItMatters:
          'Funds were transferred from mule01@bank to bridge02@bank in exactly 6 minutes and 43 seconds, characteristic of structured layering protocols.',
        supportingEvidence: [
          { evidenceId: 'evd-001', fileName: 'BANK_TRANSACTIONS.csv', rowRef: 'Row 2' },
          { evidenceId: 'evd-002', fileName: 'UPI_RECORDS.csv', rowRef: 'Row 27' },
        ],
      },
      {
        id: 'find-003',
        title: 'Shared Device Hardware Nexus (IMEI Correlation)',
        riskContribution: '+20 Risk Points',
        confidence: 95,
        patternType: 'Endpoint Hardware',
        whyItMatters:
          'Device IMEI 356938035643809 authenticated sessions for multiple mobile banking accounts and cell tower registration.',
        supportingEvidence: [
          { evidenceId: 'evd-003', fileName: 'CDR_001.csv', rowRef: 'Row 184' },
        ],
      },
      {
        id: 'find-004',
        title: 'Shared IP Infrastructure with Session Persistence',
        riskContribution: '+15 Risk Points',
        confidence: 89,
        patternType: 'Network Infrastructure',
        whyItMatters:
          'IP 103.84.21.77 hosted active operator sessions during both fund transfers and messaging telemetry.',
        supportingEvidence: [
          { evidenceId: 'evd-004', fileName: 'CHAT_EXPORT.json', rowRef: 'Message Block 1' },
        ],
      },
      {
        id: 'find-005',
        title: 'Voice Communication Immediately Preceding Fund Transfer',
        riskContribution: '+10 Risk Points',
        confidence: 91,
        patternType: 'Social Engineering Link',
        whyItMatters:
          'An outgoing call lasting 184 seconds from MSISDN 9876500099 to complainant concluded 9 minutes prior to initial transfer.',
        supportingEvidence: [
          { evidenceId: 'evd-003', fileName: 'CDR_001.csv', rowRef: 'Row 1' },
        ],
      },
      {
        id: 'find-006',
        title: 'High Downstream Velocity to Terminal Cash-out',
        riskContribution: '+10 Risk Points',
        confidence: 92,
        patternType: 'Disbursement Hop',
        whyItMatters:
          '₹62,000 reached ATM disbursement account XXXX9344 within 27 minutes of the initial debit.',
        supportingEvidence: [
          { evidenceId: 'evd-001', fileName: 'BANK_TRANSACTIONS.csv', rowRef: 'Row 3' },
        ],
      },
    ];

    // 6. Suggested Investigation Leads
    const investigationLeads: BriefLeadItem[] = [
      {
        id: 'lead-001',
        lead: 'Serve immediate debit-freeze notice under Section 91 CrPC for terminal account XXXX9344.',
        category: 'FREEZE_NOTICE',
        priority: 'HIGH',
        rationale: 'Latest verified cash-out hop holding remaining ₹62,000 fund residue.',
      },
      {
        id: 'lead-002',
        lead: 'Request ATM CCTV footage from ATM terminal CASH-ATM-09 for window 10:58–11:15.',
        category: 'CCTV_VERIFICATION',
        priority: 'HIGH',
        rationale: 'Physical withdrawal point correlated with terminal disbursement ledger.',
      },
      {
        id: 'lead-003',
        lead: 'Subpoena Customer Acquisition Form (CAF) & call history for primary suspect MSISDN 9876500099.',
        category: 'TELECOM_CAF',
        priority: 'HIGH',
        rationale: 'Pre-transfer caller identifier registered in both CDR and UPI 2FA mobile records.',
      },
      {
        id: 'lead-004',
        lead: 'Query Central Equipment Identity Register (CEIR) for handset model and history of IMEI 356938035643809.',
        category: 'CEIR_HARDWARE',
        priority: 'MEDIUM',
        rationale: 'Shared hardware handset identified across multiple counterparty communications.',
      },
      {
        id: 'lead-005',
        lead: 'Issue preservation letter under Section 67C IT Act to ISP hosting public IP 103.84.21.77.',
        category: 'ISP_PRESERVATION',
        priority: 'MEDIUM',
        rationale: 'Originating IP session recorded during transaction dispatch and operator messaging.',
      },
    ];

    // 7. Chronological Timeline Highlights
    const timelineHighlights = [...timelineEvents].sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    );

    return {
      caseInfo: {
        id: investigation.id,
        caseNumber: investigation.caseNumber,
        title: investigation.title,
        type: investigation.type,
        status: investigation.status,
        priority: investigation.priority,
        evidenceCount: evidenceItems.length,
        entitiesCount: entities.length,
        relationshipsCount: relationships.length,
        timelineEventsCount: timelineEvents.length,
        overallRiskScore,
        summary:
          investigation.summary ||
          'Evidence-linked multi-layer financial diversion with pre-incident social engineering voice call and shared hardware infrastructure.',
        generatedAt: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      },
      keyFindings,
      moneyFlow: {
        initialTransfer: '₹75,000',
        forwardedAmount: '₹68,000',
        downstreamAmount: '₹62,000',
        observedDifference: '₹7,000',
        stages,
      },
      highRiskEntities,
      timelineHighlights,
      evidenceSummary,
      investigationLeads,
      dataClassification: {
        verifiedEvidenceCount: evidenceItems.length,
        derivedAnalysisCount: keyFindings.length + relationships.length,
        investigativeLeadsCount: investigationLeads.length,
      },
    };
  },
};
