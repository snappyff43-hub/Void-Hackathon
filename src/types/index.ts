export type NavTabId =
  | 'dashboard'
  | 'investigations'
  | 'evidence'
  | 'entities'
  | 'network'
  | 'timeline'
  | 'risk-intelligence'
  | 'copilot'
  | 'reports';

export type WorkspaceTabId =
  | 'overview'
  | 'brief'
  | 'evidence'
  | 'entities'
  | 'network'
  | 'timeline'
  | 'risk'
  | 'copilot'
  | 'report';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type CaseStatus = 'Active' | 'Under Review' | 'Closed';

export type InvestigationType =
  | 'Financial Fraud'
  | 'UPI Fraud'
  | 'APK / Phishing'
  | 'Malware / Phishing'
  | 'Mule Account'
  | 'Identity Fraud'
  | 'Other';

export interface InvestigationFinding {
  id: string;
  text: string;
  evidenceId: string;
  evidenceTitle: string;
  evidenceType: string;
  evidenceDate: string;
  details: string;
  metadata?: Record<string, string>;
}

export interface InvestigationActivity {
  id: string;
  time: string;
  action: string;
}

export interface Investigation {
  id: string;
  caseNumber: string;
  title: string;
  type: string;
  priority: PriorityLevel;
  status: CaseStatus;
  evidenceCount: number;
  entitiesCount: number;
  lastUpdated: string;
  createdDate: string;
  reportedLoss?: string;
  riskScore?: number;
  summary: string;
  findings?: InvestigationFinding[];
  activities?: InvestigationActivity[];
}

export type EvidenceSourceType =
  | 'CDR'
  | 'IPDR'
  | 'Bank Transaction'
  | 'UPI'
  | 'Email'
  | 'Chat'
  | 'Android / APK'
  | 'Network'
  | 'Other';

export type EvidenceProcessingStatus = 'Selected' | 'Hashing' | 'Verified' | 'Failed';

export interface EvidenceItem {
  id: string;
  caseId: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  fileSizeBytes: number;
  sha256: string;
  uploadedAt: string;
  status: 'Verified' | 'Processing' | 'Failed';
  recordCount: number | null;
  sourceType: EvidenceSourceType;
  previewContent?: string;
  previewHeaders?: string[];
  storagePath?: string;
  analysisMetadata?: {
    detectedColumns?: string[];
    parsedRows?: number;
    encoding?: string;
    description?: string;
  };
}

/* ==========================================================================
   ENTITY & CORRELATION INTELLIGENCE TYPES (STEP 4)
   ========================================================================== */

export type EntityType =
  | 'PERSON'
  | 'PHONE'
  | 'UPI_VPA'
  | 'BANK_ACCOUNT'
  | 'TRANSACTION'
  | 'DEVICE'
  | 'IMEI'
  | 'IMSI'
  | 'IP_ADDRESS'
  | 'EMAIL'
  | 'APK_HASH'
  | 'MAC_ADDRESS';

export interface RiskFactor {
  factor: string;
  score: number;
}

export interface Entity {
  id: string;
  type: EntityType;
  value: string;
  normalizedValue: string;
  firstSeen: string;
  lastSeen: string;
  sourceEvidenceIds: string[];
  caseIds: string[];
  riskScore: number; // 0 - 100
  confidence: number; // 0 - 100
  riskFactors?: RiskFactor[];
  metadata?: Record<string, string>;
}

export type RelationshipType =
  | 'TRANSFERRED_TO'
  | 'SHARED_DEVICE'
  | 'SHARED_IP'
  | 'COMMUNICATION_LINK'
  | 'ASSOCIATED_WITH';

export interface EvidenceReference {
  evidenceId: string;
  fileName: string;
  rowRef?: string;
  detail: string;
}

export interface EntityRelationship {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: RelationshipType;
  confidence: number; // 0 - 100
  evidenceIds: string[];
  firstSeen: string;
  lastSeen: string;
  amount?: string | number;
  explanation: string;
  evidenceRefs?: EvidenceReference[];
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  eventType: 'PHONE_CONTACT' | 'UPI_TRANSFER' | 'IMPS_TRANSFER' | 'DEVICE_AUTH' | 'IP_CONNECTION' | 'APK_INTERCEPT';
  sourceEntity: string;
  targetEntity: string;
  amount?: string;
  evidenceId: string;
  description: string;
}

export interface GraphNode {
  id: string;
  type: EntityType;
  label: string;
  risk: number;
  entityId: string;
  normalizedValue: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: RelationshipType;
  confidence: number;
  evidenceIds: string[];
  amount?: string;
  explanation?: string;
}

export interface DashboardMetrics {
  activeInvestigations: number;
  evidenceItems: number;
  highRiskEntities: number;
  criticalLeads: number;
}

/* ==========================================================================
   AI INVESTIGATION COPILOT TYPES (STEP 6)
   ========================================================================== */

export type CopilotConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CopilotCitation {
  evidenceId: string;
  fileName: string;
  rowRef?: string;
  detail?: string;
}

export interface CopilotResponse {
  id: string;
  answer: string;
  keyFindings: string[];
  citations: CopilotCitation[];
  confidence: CopilotConfidence;
  recommendedReview: string[];
  isUncertain?: boolean;
  timestamp: string;
}

export interface InvestigationCopilotContext {
  investigation: Investigation;
  evidenceItems: EvidenceItem[];
  entities: Entity[];
  relationships: EntityRelationship[];
  timelineEvents: TimelineEvent[];
  activeEntity?: Entity | null;
  activeRelationship?: EntityRelationship | null;
  queryScope?: 'case' | 'network' | 'timeline' | 'entity';
}

export interface InvestigationFindingItem {
  id: string;
  title: string;
  riskContribution: string;
  confidence: number;
  supportingEvidence: CopilotCitation[];
  whyItMatters: string;
  patternType: string;
}

export interface CopilotAuditEntry {
  id: string;
  timestamp: string;
  caseId: string;
  question: string;
  answerSnippet: string;
  evidenceIds: string[];
  confidence: CopilotConfidence;
}

