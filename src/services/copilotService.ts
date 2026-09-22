import type {
  InvestigationCopilotContext,
  CopilotResponse,
  InvestigationFindingItem,
  CopilotCitation,
  CopilotConfidence,
} from '../types';
import { copilotAuditService } from './copilotAuditService';

export interface InvestigationCopilotProvider {
  askQuestion(question: string, context: InvestigationCopilotContext): Promise<CopilotResponse>;
  generateSummary(context: InvestigationCopilotContext): Promise<CopilotResponse>;
  generateFindings(context: InvestigationCopilotContext): Promise<InvestigationFindingItem[]>;
  suggestNextSteps(context: InvestigationCopilotContext): Promise<string[]>;
}

/* ==========================================================================
   LOCAL EVIDENCE-GROUNDED FALLBACK ENGINE
   ========================================================================== */

export class LocalFallbackCopilotProvider implements InvestigationCopilotProvider {
  async askQuestion(question: string, context: InvestigationCopilotContext): Promise<CopilotResponse> {
    const q = question.toLowerCase().trim();
    const { investigation, evidenceItems, entities, relationships, timelineEvents, activeEntity, activeRelationship } = context;

    // Helper to find evidence citation
    const getCitation = (evId: string, rowRef?: string, detail?: string): CopilotCitation => {
      const ev = evidenceItems.find((e) => e.id === evId);
      return {
        evidenceId: evId,
        fileName: ev ? ev.fileName : 'EVIDENCE_FILE',
        rowRef,
        detail,
      };
    };

    let answer = '';
    let keyFindings: string[] = [];
    let citations: CopilotCitation[] = [];
    let confidence: CopilotConfidence = 'HIGH';
    let recommendedReview: string[] = [];
    let isUncertain = false;

    // 1. SPECIFIC ENTITY INQUIRY (Active Entity or mentions entity)
    if (activeEntity || q.includes('this entity') || q.includes('why is this entity') || (entities.some(e => q.includes(e.normalizedValue.toLowerCase())))) {
      const targetEntity = activeEntity || entities.find(e => q.includes(e.normalizedValue.toLowerCase())) || entities.find(e => e.riskScore >= 70);
      if (targetEntity) {
        const directRels = relationships.filter(r => r.sourceEntityId === targetEntity.id || r.targetEntityId === targetEntity.id);
        const evCitations = targetEntity.sourceEvidenceIds.map(id => getCitation(id, undefined, `Cataloged entity identifier ${targetEntity.normalizedValue}`));

        answer = `Entity ${targetEntity.normalizedValue} (${targetEntity.type.replace('_', ' ')}) has an assessed risk score of ${targetEntity.riskScore}/100 based on ${targetEntity.sourceEvidenceIds.length} evidence sources and ${directRels.length} observed network relationships.`;

        keyFindings = [
          `Calculated Risk Score: ${targetEntity.riskScore}/100 (Confidence: ${targetEntity.confidence}%)`,
          `Associated with ${targetEntity.sourceEvidenceIds.length} independent evidence docket(s)`,
          `Correlated with ${directRels.length} direct counterparty entities in the transaction graph`,
          ...(targetEntity.riskFactors?.map(f => `Factor (+${f.score}): ${f.factor}`) || []),
        ];

        citations = evCitations;
        confidence = targetEntity.confidence >= 90 ? 'HIGH' : 'MEDIUM';
        recommendedReview = [
          `Issue Section 91 CrPC notice to service provider for KYC records on ${targetEntity.normalizedValue}`,
          `Inspect direct linked transaction counterparties in the Network Graph`,
          `Verify CDR/IPDR session bindings during the reported incident window`,
        ];
      }
    }
    // 2. MONEY FLOW / TRANSACTION CHAIN
    else if (
      q.includes('money flow') ||
      q.includes('fund flow') ||
      q.includes('initial transfer') ||
      q.includes('transaction') ||
      q.includes('forwarded') ||
      q.includes('received')
    ) {
      answer = `The evidence-linked transaction path begins with the reporting victim VPA (victim.user@okaxis) transferring ₹75,000 to primary mule account (mule01@bank). Within 6 minutes and 43 seconds, ₹68,000 was layered onward to intermediary account (bridge02@bank), followed by ₹62,000 routed downstream toward cash-out endpoint account (XXXX9344).`;

      keyFindings = [
        'Initial disbursement: ₹75,000 transferred via UPI at 10:31:02',
        'Layer 2 forward: ₹68,000 forwarded via IMPS switch at 10:42:11 (delta: 6m 43s)',
        'Layer 3 cash-out: ₹62,000 settled into terminal node at 10:58:43',
        'Observed transaction difference: ₹7,000 retained across intermediaries',
      ];

      citations = [
        getCitation('evd-002', 'Row 27', 'UPI transfer reference: victim.user@okaxis → mule01@bank (₹75,000)'),
        getCitation('evd-001', 'Row 2', 'Outward IMPS transfer: ACCT-4821 → ACCT-7712 (₹68,000)'),
        getCitation('evd-001', 'Row 3', 'Disbursement transfer: ACCT-7712 → CASH-ATM-09 (₹62,000)'),
      ];

      confidence = 'HIGH';
      recommendedReview = [
        'Request immediate lien / freeze on downstream cash-out account XXXX9344',
        'Subpoena ATM CCTV footage from terminal CASH-ATM-09 for transaction window 10:58–11:15',
        'Reconcile ₹7,000 observed transaction difference with intermediary ledger balances',
      ];
    }
    // 3. HIGH RISK ENTITIES / SYNDICATE INDICATORS
    else if (q.includes('high risk') || q.includes('highest risk') || q.includes('risk score') || q.includes('suspect')) {
      const sortedByRisk = [...entities].sort((a, b) => b.riskScore - a.riskScore);
      const topEntities = sortedByRisk.slice(0, 3);

      answer = `Review of the correlation dataset identifies ${topEntities.length} entities exhibiting critical or elevated risk scores due to multi-source appearance, rapid transaction routing, and shared hardware telemetry.`;

      keyFindings = topEntities.map(
        (e) => `${e.normalizedValue} (${e.type.replace('_', ' ')}): Risk Score ${e.riskScore}/100 — ${e.riskFactors?.[0]?.factor || 'Correlated in active fraud docket'}`
      );

      citations = [
        getCitation('evd-002', 'Row 27', 'Mule account registered mobile link'),
        getCitation('evd-003', 'Row 1', 'CDR MSISDN call registration with active IMEI'),
        getCitation('evd-004', 'Message Block 1', 'Endpoint operator IP telemetry session'),
      ];

      confidence = 'HIGH';
      recommendedReview = [
        'Prioritize freeze requests on high-velocity intermediary accounts',
        'Correlate IMEI 356938035643809 across state-wide cybercrime repository dockets',
        'Issue emergency preservation order for IP 103.84.21.77 access logs',
      ];
    }
    // 4. WHY CONNECTED / RELATIONSHIP EVIDENCE
    else if (
      q.includes('why connected') ||
      q.includes('why are') ||
      q.includes('evidence supports this relationship') ||
      q.includes('relationship') ||
      activeRelationship
    ) {
      const rel = activeRelationship || relationships[0];
      const src = entities.find((e) => e.id === rel.sourceEntityId);
      const tgt = entities.find((e) => e.id === rel.targetEntityId);

      answer = `The relationship ${rel.relationshipType} between ${src?.normalizedValue || rel.sourceEntityId} and ${tgt?.normalizedValue || rel.targetEntityId} is established with ${rel.confidence}% confidence based on ${rel.explanation}`;

      keyFindings = [
        `Relationship Type: ${rel.relationshipType} (Confidence: ${rel.confidence}%)`,
        `Source Node: ${src?.normalizedValue || rel.sourceEntityId} (${src?.type || 'Entity'})`,
        `Target Node: ${tgt?.normalizedValue || rel.targetEntityId} (${tgt?.type || 'Entity'})`,
        `First Observed: ${rel.firstSeen} | Last Observed: ${rel.lastSeen}`,
      ];

      citations = rel.evidenceRefs
        ? rel.evidenceRefs.map((r) => getCitation(r.evidenceId, r.rowRef, r.detail))
        : rel.evidenceIds.map((id) => getCitation(id));

      confidence = rel.confidence >= 90 ? 'HIGH' : 'MEDIUM';
      recommendedReview = [
        'Examine primary telecommunications logs or bank statement dockets supporting this link',
        'Verify whether additional secondary identifiers are co-located during the same time window',
      ];
    }
    // 5. TIMELINE SEQUENCE / WHAT HAPPENED FIRST / PRE-TRANSFER
    else if (
      q.includes('what happened first') ||
      q.includes('before the first transfer') ||
      q.includes('immediately before') ||
      q.includes('timeline') ||
      q.includes('chronolog') ||
      q.includes('sequence')
    ) {
      answer = `Chronological reconstruction reveals that 9 minutes prior to the first financial debit, an outgoing voice call occurred at 10:27:14 from phone 9876500099 to victim 9876500011 lasting 184 seconds. This pre-incident communication was immediately followed by the initial ₹75,000 transfer at 10:31:02.`;

      keyFindings = timelineEvents.length > 0
        ? timelineEvents.map(
            (e) =>
              `${e.timestamp.includes(',') ? e.timestamp.split(', ')[1] : e.timestamp}: ${e.eventType} (${e.sourceEntity} → ${e.targetEntity}${e.amount ? ' • ' + e.amount : ''})`
          )
        : [
            `10:27:14: Voice call initiated (9876500011 → 9876500099, 184s duration)`,
            `10:31:02: First fraudulent debit of ₹75,000 executed via UPI`,
            `10:42:11: Secondary layering hop of ₹68,000 executed to intermediary`,
            `10:58:43: Tertiary cash-out routing of ₹62,000 executed to ATM node`,
          ];

      citations = [
        getCitation('evd-003', 'Row 1', 'CDR telecommunication log recording 184-second caller session'),
        getCitation('evd-002', 'Row 27', 'UPI switch transaction record at 10:31:02'),
      ];

      confidence = 'HIGH';
      recommendedReview = [
        'Request tower location coordinates (BTS Cell ID) for both parties at 10:27:14',
        'Verify if spoofing or SIM-swap activity was logged by the telecom carrier',
      ];
    }
    // 6. CROSS-SOURCE APPEARANCE / SHARED INFRASTRUCTURE
    else if (
      q.includes('multiple evidence') ||
      q.includes('cross-source') ||
      q.includes('shared device') ||
      q.includes('shared ip') ||
      q.includes('imei') ||
      q.includes('ip address')
    ) {
      const multiSourceEntities = entities.filter((e) => e.sourceEvidenceIds.length > 1);

      answer = `Cross-source correlation identified ${multiSourceEntities.length} entities appearing across multiple separate evidence files, linking cellular telecommunications, mobile banking registries, and forensic chat archives into a single unified nexus.`;

      keyFindings = [
        'IMEI 356938035643809 connects mobile phone 9876500099 to network session IP 103.84.21.77',
        'Phone 9876500099 appears simultaneously in CDR call logs and UPI 2FA registration records',
        'IP 103.84.21.77 matches endpoints recorded during both transaction dispatch and chat operation',
      ];

      citations = [
        getCitation('evd-003', 'Row 184', 'CDR cellular tower IMEI registration'),
        getCitation('evd-002', 'Row 27', 'UPI banking registration database'),
        getCitation('evd-004', 'Message Block 1', 'Chat export endpoint IP address trace'),
      ];

      confidence = 'HIGH';
      recommendedReview = [
        'Query the national CEIR IMEI registry for handset model and additional linked IMSIs',
        'Obtain ISP subscriber identity records for public IP 103.84.21.77 from relevant ISP',
      ];
    }
    // 7. GENERAL CASE OVERVIEW / WHAT HAPPENED
    else if (
      q.includes('what happened') ||
      q.includes('summary') ||
      q.includes('overview') ||
      q.includes('case details') ||
      q.includes('explain this case')
    ) {
      answer = `Investigation ${investigation.caseNumber} represents a structured financial fraud operation. A victim was contacted by phone prior to dispatching ₹75,000 to a primary mule account. Within 27 minutes, funds were systematically layered across three accounts and cash-out nodes, leaving an observed transaction difference of ₹7,000 across transit hops.`;

      keyFindings = [
        `Case Docket: ${investigation.caseNumber} (${investigation.type}, Priority: ${investigation.priority})`,
        `Evidence Vault: ${evidenceItems.length} verified digital artifacts (${evidenceItems.map(e => e.fileName).join(', ')})`,
        `Correlation Graph: ${entities.length} normalized entities and ${relationships.length} validated links`,
        `Observed Fund Velocity: Layered through 3 accounts in under 28 minutes`,
      ];

      citations = [
        getCitation('evd-001', 'Summary', 'Bank transaction docket'),
        getCitation('evd-002', 'Summary', 'UPI settlement switch dataset'),
        getCitation('evd-003', 'Summary', 'Cellular call detail records (CDR)'),
      ];

      confidence = 'HIGH';
      recommendedReview = [
        'Review the complete Investigation Replay timeline in sequential playback',
        'Activate [ TRACE MONEY FLOW ] in Network Analysis to view the transaction nexus',
        'Dispatch formal statutory notices to beneficiary banking institutions',
      ];
    }
    // 8. WHAT TO REVIEW NEXT / NEXT STEPS
    else if (q.includes('review next') || q.includes('what next') || q.includes('next steps') || q.includes('leads')) {
      answer = `Based on the active correlation graph and risk matrix, investigative priorities should focus on securing funds at the final cash-out hop, identifying the device subscriber via IMEI records, and serving preservation notices on endpoint IP providers.`;

      keyFindings = [
        'High-priority target: Downstream cash-out account XXXX9344 with ₹62,000 exposure',
        'Hardware pivot: IMEI 356938035643809 shared between phone and network session',
        'Telecom pivot: Pre-incident voice caller MSISDN 9876500099',
      ];

      citations = [
        getCitation('evd-001', 'Row 3', 'Disbursement transaction record'),
        getCitation('evd-003', 'Row 1', 'CDR caller registration'),
      ];

      confidence = 'HIGH';
      recommendedReview = [
        'Serve Section 91 CrPC notice to bank for ATM withdrawal logs and CCTV footage',
        'Request subscriber application form (CAF) for MSISDN 9876500099',
        'Issue preservation letter under Section 67C IT Act to ISP hosting 103.84.21.77',
      ];
    }
    // 9. UNCERTAINTY / INSUFFICIENT EVIDENCE FALLBACK
    else {
      isUncertain = true;
      confidence = 'LOW';
      answer = `Insufficient evidence in the current investigation dataset to reliably answer this query. To preserve forensic integrity, the AI Copilot does not extrapolate or generate ungrounded conclusions.`;

      keyFindings = [
        'No direct match found within cataloged transactions, CDR logs, or entity registries',
        'The query addresses aspects outside the verified evidence artifacts uploaded to this case',
      ];

      citations = evidenceItems.map((e) => getCitation(e.id, undefined, 'Verified evidence item'));

      recommendedReview = [
        'Upload additional evidence files (e.g. additional bank dockets, IPDR logs, or forensic extractions)',
        'Check specific entity identifiers or transaction IDs directly in the Network Search tool',
        'Consult the suggested investigation questions for evidence-grounded queries',
      ];
    }

    const response: CopilotResponse = {
      id: `copilot-resp-${Date.now()}`,
      answer,
      keyFindings,
      citations,
      confidence,
      recommendedReview,
      isUncertain,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
    };

    // Log to AI Audit Trail
    copilotAuditService.addEntry(
      investigation.caseNumber || 'CASE-2026-001',
      question,
      answer,
      citations.map((c) => c.evidenceId),
      confidence
    );

    return response;
  }

  async generateSummary(context: InvestigationCopilotContext): Promise<CopilotResponse> {
    const { investigation, evidenceItems } = context;

    const answer = `Case ${investigation.caseNumber} (${investigation.type}) centers on an evidence-linked cyber fraud sequence involving an initial transfer of ₹75,000 from the complainant, rapid multi-layer fund diversion through primary mule and bridge accounts, and downstream routing of ₹62,000 toward cash-out endpoints. Cross-source correlation across ${evidenceItems.length} verified evidence dockets confirms device sharing via IMEI 356938035643809 and pre-transfer voice communication.`;

    const keyFindings = [
      `Initial Transfer: ₹75,000 debited from complainant VPA`,
      `Fund Layering: ₹68,000 forwarded to intermediary within 6m 43s`,
      `Terminal Routing: ₹62,000 settled into cash-out node`,
      `Observed Transaction Difference: ₹7,000 retained during transit`,
      `Infrastructure Nexus: IMEI 356938035643809 and IP 103.84.21.77 link multiple entities`,
    ];

    const citations: CopilotCitation[] = evidenceItems.map((e) => ({
      evidenceId: e.id,
      fileName: e.fileName,
      detail: `SHA-256: ${e.sha256.substring(0, 12)}...`,
    }));

    return {
      id: `summary-${Date.now()}`,
      answer,
      keyFindings,
      citations,
      confidence: 'HIGH',
      recommendedReview: [
        'Freeze downstream accounts identified in the disbursement layer',
        'Request CDR / Tower data for pre-incident call window',
        'Review Section 65B compliance for digital artifacts',
      ],
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  async generateFindings(_context: InvestigationCopilotContext): Promise<InvestigationFindingItem[]> {
    const findings: InvestigationFindingItem[] = [
      {
        id: 'find-001',
        title: 'Repeated Cross-Source Entity Appearance',
        riskContribution: '+25 Risk Points',
        confidence: 96,
        patternType: 'Cross-Source Nexus',
        whyItMatters: 'MSISDN 9876500099 and IMEI 356938035643809 appear across CDR, UPI records, and chat telemetry, linking communications directly to financial transactions.',
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
        whyItMatters: 'Funds were transferred from mule01@bank to bridge02@bank in exactly 6 minutes and 43 seconds, characteristic of structured layering protocols.',
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
        whyItMatters: 'Device IMEI 356938035643809 authenticated sessions for multiple mobile banking accounts and cell tower registration.',
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
        whyItMatters: 'IP 103.84.21.77 hosted active operator sessions during both fund transfers and messaging telemetry.',
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
        whyItMatters: 'An outgoing call lasting 184 seconds from MSISDN 9876500099 to the complainant concluded 9 minutes before the first transfer.',
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
        whyItMatters: '₹62,000 reached ATM disbursement account XXXX9344 within 27 minutes of the initial debit.',
        supportingEvidence: [
          { evidenceId: 'evd-001', fileName: 'BANK_TRANSACTIONS.csv', rowRef: 'Row 3' },
        ],
      },
    ];

    return findings;
  }

  async suggestNextSteps(_context: InvestigationCopilotContext): Promise<string[]> {
    return [
      'Dispatch Section 91 CrPC notice to bank for immediate debit-freeze on terminal account XXXX9344',
      'Request ATM CCTV footage from ATM terminal CASH-ATM-09 for window 10:58–11:15',
      'Subpoena Customer Acquisition Form (CAF) & call history for primary suspect MSISDN 9876500099',
      'Query Central Equipment Identity Register (CEIR) for handset details of IMEI 356938035643809',
      'Serve preservation notice under Section 67C IT Act to ISP hosting public IP 103.84.21.77',
    ];
  }
}

// Default export singleton local provider
export const copilotService = new LocalFallbackCopilotProvider();
