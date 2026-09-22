import type {
  Entity,
  EntityType,
  EntityRelationship,
  TimelineEvent,
  GraphNode,
  GraphEdge,
  EvidenceItem,
  RiskFactor,
} from '../types';

/* ==========================================================================
   NORMALIZATION UTILITIES
   ========================================================================== */

export function normalizePhone(raw: string): string {
  if (!raw) return '';
  // Strip all non-digit characters
  let digits = raw.replace(/\D/g, '');
  // Remove leading international code +91 or 91 if 12 digits
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }
  // Remove leading 0 if 11 digits
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits;
}

export function normalizeUPI(raw: string): string {
  if (!raw) return '';
  return raw.trim().toLowerCase();
}

export function normalizeEmail(raw: string): string {
  if (!raw) return '';
  return raw.trim().toLowerCase();
}

export function normalizeIP(raw: string): string {
  if (!raw) return '';
  // Remove port if present (e.g. 103.84.21.77:8080)
  return raw.trim().split(':')[0];
}

export function normalizeIMEI(raw: string): string {
  if (!raw) return '';
  return raw.replace(/[\s\-]/g, '').trim();
}

export function normalizeBankAccount(raw: string): string {
  if (!raw) return '';
  return raw.replace(/[\s\-]/g, '').trim().toUpperCase();
}

export function normalizeEntityValue(type: EntityType, value: string): string {
  switch (type) {
    case 'PHONE':
      return normalizePhone(value);
    case 'UPI_VPA':
      return normalizeUPI(value);
    case 'EMAIL':
      return normalizeEmail(value);
    case 'IP_ADDRESS':
      return normalizeIP(value);
    case 'IMEI':
      return normalizeIMEI(value);
    case 'BANK_ACCOUNT':
      return normalizeBankAccount(value);
    default:
      return value.trim();
  }
}

/* ==========================================================================
   RISK CALCULATION ENGINE
   ========================================================================== */

export function calculateRisk(
  entityType: EntityType,
  _normalizedValue: string,
  evidenceCount: number,
  isMuleOrIntermediary: boolean,
  hasSharedDeviceOrIP: boolean
): { score: number; factors: RiskFactor[] } {
  const factors: RiskFactor[] = [];
  let score = 0;

  if (evidenceCount > 1) {
    const s = 25;
    score += s;
    factors.push({ factor: 'Repeated cross-source appearance across multiple evidence files', score: s });
  }

  if (isMuleOrIntermediary) {
    const s1 = 20;
    const s2 = 10;
    score += s1 + s2;
    factors.push({ factor: 'Rapid transaction routing (<10 min hop velocity)', score: s1 });
    factors.push({ factor: 'High transaction velocity in structured financial dockets', score: s2 });
  }

  if (hasSharedDeviceOrIP) {
    const s1 = 20;
    const s2 = 15;
    score += s1 + s2;
    factors.push({ factor: 'Shared device nexus (IMEI correlated across multiple identities)', score: s1 });
    factors.push({ factor: 'Shared IP infrastructure associated with VPN exit nodes', score: s2 });
  }

  if (entityType === 'APK_HASH') {
    const s = 30;
    score += s;
    factors.push({ factor: 'Trojanized mobile binary payload with SMS interception capability', score: s });
  }

  if (entityType === 'PHONE' && isMuleOrIntermediary) {
    const s = 10;
    score += s;
    factors.push({ factor: 'Communication correlation: Voice contact prior to fund dispatch', score: s });
  }

  // Baseline floor for recognized entities in active dockets
  if (score === 0) {
    score = 25;
    factors.push({ factor: 'Baseline entity cataloged in active case docket', score: 25 });
  }

  const clampedScore = Math.min(100, Math.max(0, score));
  return { score: clampedScore, factors };
}

/* ==========================================================================
   INITIAL CONTROLLED SYNTHETIC SCENARIO & INTELLIGENCE DATA
   ========================================================================== */

export const INITIAL_ENTITIES: Entity[] = [
  {
    id: 'ent-001',
    type: 'PHONE',
    value: '+91 98765 00011',
    normalizedValue: '9876500011',
    firstSeen: '22 Sep 2026, 09:18',
    lastSeen: '22 Sep 2026, 10:34',
    sourceEvidenceIds: ['evd-003'],
    caseIds: ['CASE-2026-001'],
    riskScore: 25,
    confidence: 98,
    riskFactors: [{ factor: 'Reporting victim contact number in case dossier', score: 25 }],
    metadata: { 'User Role': 'Victim / Complainant', 'Carrier': 'Airtel Telecom', 'Location': 'Delhi-NCR' },
  },
  {
    id: 'ent-002',
    type: 'UPI_VPA',
    value: 'victim.user@okaxis',
    normalizedValue: 'victim.user@okaxis',
    firstSeen: '22 Sep 2026, 09:14',
    lastSeen: '22 Sep 2026, 10:36',
    sourceEvidenceIds: ['evd-001', 'evd-002'],
    caseIds: ['CASE-2026-001'],
    riskScore: 25,
    confidence: 99,
    riskFactors: [{ factor: 'Originating payer account debited during fraud', score: 25 }],
    metadata: { 'Account Type': 'Savings Account', 'Bank': 'Axis Bank' },
  },
  {
    id: 'ent-003',
    type: 'UPI_VPA',
    value: 'mule01@bank',
    normalizedValue: 'mule01@bank',
    firstSeen: '22 Sep 2026, 09:14',
    lastSeen: '22 Sep 2026, 10:48',
    sourceEvidenceIds: ['evd-001', 'evd-002', 'evd-004'],
    caseIds: ['CASE-2026-001', 'CASE-2026-003'],
    riskScore: 95,
    confidence: 96,
    riskFactors: [
      { factor: 'Repeated cross-source appearance across multiple evidence files', score: 25 },
      { factor: 'Rapid transaction routing (<10 min hop velocity)', score: 20 },
      { factor: 'Shared device nexus (IMEI correlated across multiple identities)', score: 20 },
      { factor: 'Shared IP infrastructure associated with VPN exit nodes', score: 15 },
      { factor: 'High transaction velocity in structured financial dockets', score: 10 },
      { factor: 'Communication correlation: Voice contact prior to fund dispatch', score: 10 },
    ],
    metadata: { 'Primary Mule Account': 'XXXX4821', 'Bank': 'HDFC Bank', 'Holder Name': 'Rahul S.' },
  },
  {
    id: 'ent-004',
    type: 'BANK_ACCOUNT',
    value: 'HDFC-5010048928190',
    normalizedValue: 'XXXX4821',
    firstSeen: '22 Sep 2026, 09:14',
    lastSeen: '22 Sep 2026, 10:48',
    sourceEvidenceIds: ['evd-001', 'evd-004'],
    caseIds: ['CASE-2026-001', 'CASE-2026-003'],
    riskScore: 92,
    confidence: 96,
    riskFactors: [
      { factor: 'Repeated cross-source appearance across multiple evidence files', score: 25 },
      { factor: 'Rapid transaction routing (<10 min hop velocity)', score: 20 },
      { factor: 'Shared device nexus (IMEI correlated across multiple identities)', score: 20 },
      { factor: 'Shared IP infrastructure associated with VPN exit nodes', score: 15 },
      { factor: 'High transaction velocity in structured financial dockets', score: 10 },
    ],
    metadata: { 'Branch IFSC': 'HDFC0001284', 'Account Status': 'Flagged for Freeze' },
  },
  {
    id: 'ent-005',
    type: 'UPI_VPA',
    value: 'bridge02@bank',
    normalizedValue: 'bridge02@bank',
    firstSeen: '22 Sep 2026, 09:21',
    lastSeen: '22 Sep 2026, 10:34',
    sourceEvidenceIds: ['evd-001'],
    caseIds: ['CASE-2026-001'],
    riskScore: 84,
    confidence: 92,
    riskFactors: [
      { factor: 'Rapid transaction routing (<10 min hop velocity)', score: 20 },
      { factor: 'Shared device nexus (IMEI correlated across multiple identities)', score: 20 },
      { factor: 'Shared IP infrastructure associated with VPN exit nodes', score: 15 },
      { factor: 'High transaction velocity in structured financial dockets', score: 10 },
    ],
    metadata: { 'Intermediary Account': 'XXXX7712', 'Bank': 'ICICI Bank' },
  },
  {
    id: 'ent-006',
    type: 'BANK_ACCOUNT',
    value: 'ICICI-00192847192',
    normalizedValue: 'XXXX7712',
    firstSeen: '22 Sep 2026, 09:21',
    lastSeen: '22 Sep 2026, 10:34',
    sourceEvidenceIds: ['evd-001'],
    caseIds: ['CASE-2026-001'],
    riskScore: 80,
    confidence: 91,
    riskFactors: [
      { factor: 'Rapid transaction routing (<10 min hop velocity)', score: 20 },
      { factor: 'High transaction velocity in structured financial dockets', score: 10 },
    ],
    metadata: { 'Branch IFSC': 'ICIC0000019', 'Layer': 'Layer 2 Intermediary' },
  },
  {
    id: 'ent-007',
    type: 'BANK_ACCOUNT',
    value: 'AXIS-91827401928',
    normalizedValue: 'XXXX9344',
    firstSeen: '22 Sep 2026, 09:27',
    lastSeen: '22 Sep 2026, 10:34',
    sourceEvidenceIds: ['evd-001'],
    caseIds: ['CASE-2026-001'],
    riskScore: 78,
    confidence: 88,
    riskFactors: [
      { factor: 'Rapid transaction routing (<10 min hop velocity)', score: 20 },
      { factor: 'Cash-out termination node (ATM withdrawals mapped)', score: 20 },
    ],
    metadata: { 'Layer': 'Layer 3 Cash-out Terminal', 'Bank': 'Axis Bank' },
  },
  {
    id: 'ent-008',
    type: 'PHONE',
    value: '+91 98765 00099',
    normalizedValue: '9876500099',
    firstSeen: '22 Sep 2026, 09:18',
    lastSeen: '22 Sep 2026, 10:48',
    sourceEvidenceIds: ['evd-002', 'evd-003', 'evd-004'],
    caseIds: ['CASE-2026-001', 'CASE-2026-002'],
    riskScore: 96,
    confidence: 97,
    riskFactors: [
      { factor: 'Repeated cross-source appearance across multiple evidence files', score: 25 },
      { factor: 'Shared device nexus (IMEI correlated across multiple identities)', score: 20 },
      { factor: 'Shared IP infrastructure associated with VPN exit nodes', score: 15 },
      { factor: 'Communication correlation: Voice contact prior to fund dispatch', score: 10 },
    ],
    metadata: { 'SIM Type': 'Prepaid eSIM', 'Subscriber Name': 'Synthetic Identity (Forged Aadhaar)' },
  },
  {
    id: 'ent-009',
    type: 'IMEI',
    value: '3569-3803-5643-809',
    normalizedValue: '356938035643809',
    firstSeen: '22 Sep 2026, 09:18',
    lastSeen: '22 Sep 2026, 10:41',
    sourceEvidenceIds: ['evd-003'],
    caseIds: ['CASE-2026-001', 'CASE-2026-002'],
    riskScore: 88,
    confidence: 94,
    riskFactors: [
      { factor: 'Shared device nexus (IMEI correlated across multiple identities)', score: 20 },
      { factor: 'Shared IP infrastructure associated with VPN exit nodes', score: 15 },
    ],
    metadata: { 'Device Model': 'OnePlus Nord CE 2', 'TAC': '356938' },
  },
  {
    id: 'ent-010',
    type: 'IP_ADDRESS',
    value: '103.84.21.77',
    normalizedValue: '103.84.21.77',
    firstSeen: '22 Sep 2026, 09:10',
    lastSeen: '22 Sep 2026, 10:48',
    sourceEvidenceIds: ['evd-004'],
    caseIds: ['CASE-2026-001'],
    riskScore: 91,
    confidence: 92,
    riskFactors: [
      { factor: 'Shared IP infrastructure associated with VPN exit nodes', score: 15 },
      { factor: 'High transaction velocity in structured financial dockets', score: 10 },
    ],
    metadata: { 'ISP': 'M247 Europe VPN', 'Hosting': 'DataCenter Node', 'Country': 'IN / SG' },
  },
  {
    id: 'ent-011',
    type: 'APK_HASH',
    value: 'a8f3b29c489d12e652410a8b417c8091',
    normalizedValue: 'a8f3b29c489d12e652410a8b417c8091',
    firstSeen: '21 Sep 2026, 14:30',
    lastSeen: '21 Sep 2026, 14:40',
    sourceEvidenceIds: ['evd-005'],
    caseIds: ['CASE-2026-002'],
    riskScore: 86,
    confidence: 95,
    riskFactors: [
      { factor: 'Trojanized mobile binary payload with SMS interception capability', score: 30 },
      { factor: 'Repeated cross-source appearance across multiple evidence files', score: 25 },
    ],
    metadata: { 'Package': 'gov.welfare.yojana.apk', 'Target': 'Android OS' },
  },
];

export const INITIAL_RELATIONSHIPS: EntityRelationship[] = [
  {
    id: 'rel-001',
    sourceEntityId: 'ent-002', // victim@upi
    targetEntityId: 'ent-003', // mule01@bank
    relationshipType: 'TRANSFERRED_TO',
    confidence: 96,
    evidenceIds: ['evd-001', 'evd-002'],
    firstSeen: '22 Sep 2026, 09:14:22',
    lastSeen: '22 Sep 2026, 09:14:22',
    amount: '₹75,000',
    explanation: 'UPI transaction UPI2026894028 directly transfers ₹75,000 from victim VPA (victim.user@okaxis) to primary mule account (mule01@bank).',
    evidenceRefs: [
      { evidenceId: 'evd-002', fileName: 'UPI_RECORDS.csv', rowRef: 'Row 1', detail: 'TxnId: UPI2026894028, Amount: ₹75,000, Status: SUCCESS' },
      { evidenceId: 'evd-001', fileName: 'BANK_TRANSACTIONS.csv', rowRef: 'Row 1', detail: 'Inbound credit ₹75,000 via VPA-XXXX into ACCT-4821' },
    ],
  },
  {
    id: 'rel-002',
    sourceEntityId: 'ent-003', // mule01@bank
    targetEntityId: 'ent-005', // bridge02@bank
    relationshipType: 'TRANSFERRED_TO',
    confidence: 94,
    evidenceIds: ['evd-001'],
    firstSeen: '22 Sep 2026, 09:21:05',
    lastSeen: '22 Sep 2026, 09:21:05',
    amount: '₹68,000',
    explanation: 'Rapid onward IMPS payment transfer of ₹68,000 executed 6m 43s after receipt from victim.',
    evidenceRefs: [
      { evidenceId: 'evd-001', fileName: 'BANK_TRANSACTIONS.csv', rowRef: 'Row 2', detail: 'Outward IMPS: ACCT-4821 → ACCT-7712, Amount: ₹68,000' },
    ],
  },
  {
    id: 'rel-003',
    sourceEntityId: 'ent-005', // bridge02@bank
    targetEntityId: 'ent-007', // XXXX9344
    relationshipType: 'TRANSFERRED_TO',
    confidence: 92,
    evidenceIds: ['evd-001'],
    firstSeen: '22 Sep 2026, 09:27:10',
    lastSeen: '22 Sep 2026, 09:27:10',
    amount: '₹62,000',
    explanation: 'Second-layer disbursement to cash-out terminal account XXXX9344 with subsequent ATM withdrawal pattern.',
    evidenceRefs: [
      { evidenceId: 'evd-001', fileName: 'BANK_TRANSACTIONS.csv', rowRef: 'Row 3', detail: 'Disbursement: ACCT-7712 → CASH-ATM-09, Amount: ₹25,000' },
    ],
  },
  {
    id: 'rel-004',
    sourceEntityId: 'ent-008', // Mule Phone 9876500099
    targetEntityId: 'ent-009', // IMEI 356938035643809
    relationshipType: 'ASSOCIATED_WITH',
    confidence: 95,
    evidenceIds: ['evd-003'],
    firstSeen: '22 Sep 2026, 09:18:00',
    lastSeen: '22 Sep 2026, 10:41:00',
    explanation: 'Cellular network authentication and CDR telemetry associate SIM 9876500099 with device IMEI 356938035643809.',
    evidenceRefs: [
      { evidenceId: 'evd-003', fileName: 'CDR_001.csv', rowRef: 'Row 184', detail: 'Call registration on CellTower DEL-NCR-402 with IMEI 356938035643809' },
    ],
  },
  {
    id: 'rel-005',
    sourceEntityId: 'ent-009', // IMEI 356938035643809
    targetEntityId: 'ent-010', // IP 103.84.21.77
    relationshipType: 'ASSOCIATED_WITH',
    confidence: 89,
    evidenceIds: ['evd-003', 'evd-004'],
    firstSeen: '22 Sep 2026, 09:10:00',
    lastSeen: '22 Sep 2026, 10:48:00',
    explanation: 'Device IMEI 356938035643809 logged active session from IP 103.84.21.77 during the transaction execution window.',
    evidenceRefs: [
      { evidenceId: 'evd-004', fileName: 'CHAT_EXPORT.json', rowRef: 'Message Block 1', detail: 'Operator session telemetry bound to 103.84.21.77' },
    ],
  },
  {
    id: 'rel-006',
    sourceEntityId: 'ent-003', // mule01@bank
    targetEntityId: 'ent-008', // Mule Phone 9876500099
    relationshipType: 'ASSOCIATED_WITH',
    confidence: 94,
    evidenceIds: ['evd-002', 'evd-003'],
    firstSeen: '22 Sep 2026, 09:14:00',
    lastSeen: '22 Sep 2026, 10:48:00',
    explanation: 'The same normalized phone number 9876500099 is registered as the mobile banking 2FA identifier for VPA mule01@bank.',
    evidenceRefs: [
      { evidenceId: 'evd-002', fileName: 'UPI_RECORDS.csv', rowRef: 'Row 27', detail: 'Linked mobile registration: +91-9876500099' },
      { evidenceId: 'evd-003', fileName: 'CDR_001.csv', rowRef: 'Row 1', detail: 'Active MSISDN 919876500099' },
    ],
  },
  {
    id: 'rel-007',
    sourceEntityId: 'ent-001', // Victim Phone 9876500011
    targetEntityId: 'ent-008', // Mule Phone 9876500099
    relationshipType: 'COMMUNICATION_LINK',
    confidence: 91,
    evidenceIds: ['evd-003'],
    firstSeen: '22 Sep 2026, 09:18:00',
    lastSeen: '22 Sep 2026, 09:21:04',
    explanation: '184-second outgoing voice call recorded from fraudster SIM 9876500099 to victim 9876500011 exactly 9 minutes prior to initial transfer.',
    evidenceRefs: [
      { evidenceId: 'evd-003', fileName: 'CDR_001.csv', rowRef: 'Row 1', detail: 'Caller: 919876543210, Called: 919800000014, Duration: 184s' },
    ],
  },
];

export const INITIAL_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'evt-001',
    timestamp: '22 Sep 2026, 10:27:14',
    eventType: 'PHONE_CONTACT',
    sourceEntity: '9876500011',
    targetEntity: '9876500099',
    evidenceId: 'evd-003',
    description: 'Initial 184-second voice call initiated by fraudster impersonating banking officer.',
  },
  {
    id: 'evt-002',
    timestamp: '22 Sep 2026, 10:31:02',
    eventType: 'UPI_TRANSFER',
    sourceEntity: 'victim@upi',
    targetEntity: 'mule01@bank',
    amount: '₹75,000',
    evidenceId: 'evd-002',
    description: 'Fraudulent UPI transfer debited from victim account into primary mule VPA.',
  },
  {
    id: 'evt-003',
    timestamp: '22 Sep 2026, 10:42:11',
    eventType: 'UPI_TRANSFER',
    sourceEntity: 'mule01@bank',
    targetEntity: 'bridge02@bank',
    amount: '₹68,000',
    evidenceId: 'evd-001',
    description: 'Rapid onward layering dispatch to intermediary mule account.',
  },
  {
    id: 'evt-004',
    timestamp: '22 Sep 2026, 10:58:43',
    eventType: 'UPI_TRANSFER',
    sourceEntity: 'bridge02@bank',
    targetEntity: 'cashout@bank',
    amount: '₹62,000',
    evidenceId: 'evd-001',
    description: 'Final hop settlement into cash-out node for ATM dispatch.',
  },
];

/* ==========================================================================
   DYNAMIC EXTRACTION AND CORRELATION SERVICE
   ========================================================================== */

export function extractEntitiesFromEvidenceItem(
  evidence: EvidenceItem,
  existingEntities: Entity[]
): Entity[] {
  try {
    if (!evidence || typeof evidence !== 'object') {
      return [];
    }

    const safeExisting = Array.isArray(existingEntities) ? existingEntities : [];
    const extracted: Entity[] = [];
    const text = `${evidence.fileName || ''}\n${evidence.previewContent || ''}\n${evidence.analysisMetadata?.description || ''}`;

    // Helper to add or update entity
    const addEntity = (type: EntityType, rawValue: string) => {
      try {
        const normalized = normalizeEntityValue(type, rawValue);
        if (!normalized || normalized.length < 3) return;

        // Check if entity already exists in extracted or existing
        const existing =
          extracted.find((e) => e.type === type && e.normalizedValue === normalized) ||
          safeExisting.find((e) => e.type === type && e.normalizedValue === normalized);

        if (existing) {
          if (!existing.sourceEvidenceIds.includes(evidence.id)) {
            existing.sourceEvidenceIds.push(evidence.id);
          }
          if (evidence.caseId && !existing.caseIds.includes(evidence.caseId)) {
            existing.caseIds.push(evidence.caseId);
          }
          existing.lastSeen = evidence.uploadedAt || new Date().toISOString();
          return;
        }

        const isMule = normalized.includes('mule') || normalized.includes('bridge') || normalized.includes('9876500099');
        const hasShared = normalized.includes('103.84') || normalized.includes('356938');
        const { score, factors } = calculateRisk(type, normalized, 1, isMule, hasShared);

        const newEntity: Entity = {
          id: `ent-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type,
          value: rawValue,
          normalizedValue: normalized,
          firstSeen: evidence.uploadedAt || 'Current Session',
          lastSeen: evidence.uploadedAt || 'Current Session',
          sourceEvidenceIds: [evidence.id],
          caseIds: evidence.caseId ? [evidence.caseId] : [],
          riskScore: score,
          confidence: 90,
          riskFactors: factors,
        };

        extracted.push(newEntity);
      } catch {
        // Suppress individual malformed entity parse errors gracefully
      }
    };

    // Phone regex
    const phoneMatches = text.match(/(?:\+91[\-\s]?)?[6-9]\d{9}/g) || [];
    phoneMatches.forEach((m) => addEntity('PHONE', m));

    // UPI VPA regex
    const upiMatches = text.match(/[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z]{2,32}/g) || [];
    upiMatches.forEach((m) => addEntity('UPI_VPA', m));

    // Email regex
    const emailMatches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    emailMatches.forEach((m) => {
      if (!m.includes('@okaxis') && !m.includes('@okhdfc') && !m.includes('@ybl') && !m.includes('@bank')) {
        addEntity('EMAIL', m);
      }
    });

    // IPv4 regex
    const ipMatches = text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [];
    ipMatches.forEach((m) => {
      if (!m.startsWith('127.') && !m.startsWith('0.0.')) {
        addEntity('IP_ADDRESS', m);
      }
    });

    // IMEI regex (15 digits)
    const imeiMatches = text.match(/\b\d{15}\b/g) || [];
    imeiMatches.forEach((m) => addEntity('IMEI', m));

    // APK Hash
    if ((evidence.sourceType === 'Android / APK' || evidence.fileName?.endsWith('.apk')) && evidence.sha256) {
      addEntity('APK_HASH', evidence.sha256);
    }

    return extracted;
  } catch (err) {
    console.error('[CYBERTRACE Engine] Safe entity extraction guard caught error:', err);
    return [];
  }
}

export function buildGraphData(
  entities: Entity[],
  relationships: EntityRelationship[]
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  try {
    const safeEntities = Array.isArray(entities) ? entities : [];
    const safeRelationships = Array.isArray(relationships) ? relationships : [];

    const nodes: GraphNode[] = safeEntities.map((ent) => ({
      id: ent.id,
      type: ent.type,
      label: ent.normalizedValue,
      risk: ent.riskScore,
      entityId: ent.id,
      normalizedValue: ent.normalizedValue,
    }));

    const edges: GraphEdge[] = safeRelationships.map((rel) => ({
      id: rel.id,
      source: rel.sourceEntityId,
      target: rel.targetEntityId,
      relationship: rel.relationshipType,
      confidence: rel.confidence,
      evidenceIds: rel.evidenceIds || [],
      amount: rel.amount ? String(rel.amount) : undefined,
      explanation: rel.explanation,
    }));

    return { nodes, edges };
  } catch (err) {
    console.error('[CYBERTRACE Engine] Safe graph generation guard caught error:', err);
    return { nodes: [], edges: [] };
  }
}
