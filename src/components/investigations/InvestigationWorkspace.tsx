import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  FileText,
  Database,
  Users,
  Network,
  Clock,
  ShieldAlert,
  Terminal,
  Zap,
} from 'lucide-react';
import type { Investigation, WorkspaceTabId, CaseStatus, EvidenceItem, Entity, EntityRelationship } from '../../types';
import { Button } from '../ui/Button';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { InvestigationOverview } from './InvestigationOverview';
import { EvidenceTable } from '../evidence/EvidenceTable';
import { EvidenceUploadZone } from '../evidence/EvidenceUploadZone';
import { EvidenceDetailModal } from '../evidence/EvidenceDetailModal';
import { EntityTable } from '../entities/EntityTable';
import { EntityDetailModal } from '../entities/EntityDetailModal';
import { NetworkView } from '../network/NetworkView';
import { InvestigationReplayView } from '../timeline/InvestigationReplayView';
import { InvestigationCopilot } from '../copilot/InvestigationCopilot';
import { GoldenHourBriefView } from '../brief/GoldenHourBriefView';
import { INITIAL_TIMELINE_EVENTS } from '../../services/intelligenceService';

interface InvestigationWorkspaceProps {
  investigation: Investigation;
  evidenceItems: EvidenceItem[];
  investigations: Investigation[];
  entities: Entity[];
  relationships: EntityRelationship[];
  onBack: () => void;
  onUpdateInvestigation: (updated: Investigation) => void;
  onAddEvidence: (item: EvidenceItem) => void;
  onUpdateEvidence?: (item: EvidenceItem) => void;
}

interface WorkspaceTabConfig {
  id: WorkspaceTabId;
  label: string;
  icon: React.ReactNode;
}

const WORKSPACE_TABS: WorkspaceTabConfig[] = [
  { id: 'overview', label: 'Overview', icon: <FileText size={15} /> },
  { id: 'brief', label: 'Golden-Hour Brief', icon: <Zap size={15} style={{ color: '#fbbf24' }} /> },
  { id: 'evidence', label: 'Evidence', icon: <Database size={15} /> },
  { id: 'entities', label: 'Entities', icon: <Users size={15} /> },
  { id: 'network', label: 'Network', icon: <Network size={15} /> },
  { id: 'timeline', label: 'Timeline', icon: <Clock size={15} /> },
  { id: 'risk', label: 'Risk', icon: <ShieldAlert size={15} /> },
  { id: 'copilot', label: 'Copilot', icon: <Terminal size={15} /> },
  { id: 'report', label: 'Report', icon: <FileText size={15} /> },
];

export const InvestigationWorkspace: React.FC<InvestigationWorkspaceProps> = ({
  investigation,
  evidenceItems,
  investigations,
  entities,
  relationships,
  onBack,
  onUpdateInvestigation,
  onAddEvidence,
  onUpdateEvidence,
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>('overview');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState(false);
  const [selectedEvidenceItem, setSelectedEvidenceItem] = useState<EvidenceItem | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  // Status Change State
  const [tempStatus, setTempStatus] = useState<CaseStatus>(investigation.status);
  const [copilotInitialQuery, setCopilotInitialQuery] = useState<string>('');

  const handleAskAI = (queryText: string) => {
    setCopilotInitialQuery(queryText);
    setActiveTab('copilot');
  };

  // Filter evidence items specifically belonging to this case
  const caseEvidence = evidenceItems.filter(
    (e) => e.caseId === investigation.caseNumber || e.caseId === investigation.id
  );

  // Filter entities associated with this case
  const caseEntities = entities.filter(
    (ent) => ent.caseIds.includes(investigation.caseNumber) || ent.caseIds.includes(investigation.id)
  );

  // Filter relationships associated with case entities
  const caseEntityIds = caseEntities.map((e) => e.id);
  const caseRelationships = relationships.filter(
    (r) => caseEntityIds.includes(r.sourceEntityId) || caseEntityIds.includes(r.targetEntityId)
  );

  const handleStatusChange = () => {
    const updated: Investigation = {
      ...investigation,
      status: tempStatus,
      lastUpdated: 'Just now',
      activities: [
        {
          id: `act-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `Status updated to ${tempStatus}`,
        },
        ...(investigation.activities || []),
      ],
    };
    onUpdateInvestigation(updated);
    setIsStatusModalOpen(false);
  };

  const handleEvidenceUploaded = (item: EvidenceItem) => {
    onAddEvidence(item);
    setIsAddEvidenceModalOpen(false);

    // Update case activity and evidence count
    const updated: Investigation = {
      ...investigation,
      evidenceCount: investigation.evidenceCount + 1,
      lastUpdated: 'Just now',
      activities: [
        {
          id: `act-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `Evidence uploaded: ${item.fileName} (${item.sourceType})`,
        },
        ...(investigation.activities || []),
      ],
    };
    onUpdateInvestigation(updated);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <InvestigationOverview investigation={investigation} />;

      case 'brief':
        return (
          <GoldenHourBriefView
            investigation={investigation}
            evidenceItems={caseEvidence}
            entities={caseEntities}
            relationships={caseRelationships}
            timelineEvents={INITIAL_TIMELINE_EVENTS}
            onAskAI={handleAskAI}
          />
        );

      case 'evidence':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Top Evidence Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Case Evidence Docket ({caseEvidence.length})
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Digital artifacts cataloged with SHA-256 integrity hashes for {investigation.caseNumber}.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => setIsAddEvidenceModalOpen(true)}
              >
                Add Evidence
              </Button>
            </div>

            {/* Evidence Table */}
            <EvidenceTable
              evidenceItems={caseEvidence}
              onSelectEvidence={(item) => setSelectedEvidenceItem(item)}
            />
          </div>
        );

      case 'entities':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Correlated Case Entities ({caseEntities.length})
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Extracted identifiers, mule bank accounts, VPAs, and devices associated with {investigation.caseNumber}.
              </p>
            </div>

            <EntityTable
              entities={caseEntities}
              onSelectEntity={(ent) => setSelectedEntity(ent)}
            />
          </div>
        );

      case 'network':
        return (
          <NetworkView
            entities={caseEntities}
            relationships={caseRelationships}
            evidenceItems={caseEvidence}
            onAskAI={handleAskAI}
          />
        );

      case 'timeline':
        return (
          <InvestigationReplayView
            timelineEvents={INITIAL_TIMELINE_EVENTS}
            entities={caseEntities}
            relationships={caseRelationships}
            evidenceItems={caseEvidence}
            investigations={investigations}
            onAskAI={handleAskAI}
          />
        );

      case 'risk':
        return (
          <Card>
            <CardContent style={{ padding: '36px 20px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Risk Intelligence & Syndicate Scoring
                </p>
                <p>Calculated composite risk score: {investigation.riskScore || 82}/100.</p>
              </div>
            </CardContent>
          </Card>
        );

      case 'copilot':
        return (
          <InvestigationCopilot
            investigation={investigation}
            evidenceItems={caseEvidence}
            entities={caseEntities}
            relationships={caseRelationships}
            timelineEvents={INITIAL_TIMELINE_EVENTS}
            initialQuery={copilotInitialQuery}
            onOpenEvidence={(item) => setSelectedEvidenceItem(item)}
          />
        );

      case 'report':
        return (
          <Card>
            <CardContent style={{ padding: '36px 20px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Case Dossier & Export
                </p>
                <p>Generate court-ready investigation reports and Section 65B certificates.</p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return <InvestigationOverview investigation={investigation} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Back Navigation Bar */}
      <div>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.82rem',
            padding: '4px 0',
            fontWeight: 500,
            transition: 'color 0.12s ease',
          }}
          className="ct-back-link"
        >
          <ArrowLeft size={14} />
          Back to Investigations
        </button>
      </div>

      {/* Case Header Card */}
      <Card style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left: Case ID, Title & Status */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#a78bfa',
                  backgroundColor: 'rgba(124, 92, 252, 0.1)',
                  border: '1px solid rgba(124, 92, 252, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                {investigation.caseNumber}
              </span>
              <PriorityBadge priority={investigation.priority} size="sm" />
              <StatusBadge status={investigation.status} size="sm" />
            </div>

            <h1
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                lineHeight: 1.25,
              }}
            >
              {investigation.title}
            </h1>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Button
              variant={activeTab === 'brief' ? 'primary' : 'outline'}
              size="sm"
              icon={<Zap size={13} style={{ color: activeTab === 'brief' ? '#ffffff' : '#fbbf24' }} />}
              onClick={() => setActiveTab('brief')}
            >
              Golden-Hour Brief
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw size={13} />}
              onClick={() => {
                setTempStatus(investigation.status);
                setIsStatusModalOpen(true);
              }}
            >
              Change Status
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setIsAddEvidenceModalOpen(true)}
            >
              Add Evidence
            </Button>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '18px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '12px',
            overflowX: 'auto',
          }}
        >
          {WORKSPACE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                  border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Tab View Content */}
      <div>{renderTabContent()}</div>

      {/* Change Status Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Change Investigation Status"
        subtitle={`Update docket status for ${investigation.caseNumber}`}
        maxWidth="440px"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleStatusChange}>
              Update Status
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Select Status
          </label>
          <select
            value={tempStatus}
            onChange={(e) => setTempStatus(e.target.value as CaseStatus)}
            style={{
              width: '100%',
              height: '36px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '0 10px',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
              outline: 'none',
            }}
          >
            <option value="Active">Active</option>
            <option value="Under Review">Under Review</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </Modal>

      {/* Add Evidence Modal using EvidenceUploadZone */}
      <Modal
        isOpen={isAddEvidenceModalOpen}
        onClose={() => setIsAddEvidenceModalOpen(false)}
        title="Add Evidence Item"
        subtitle={`Ingest verified digital artifact into ${investigation.caseNumber}`}
        maxWidth="620px"
      >
        <EvidenceUploadZone
          investigations={investigations}
          preselectedCaseId={investigation.caseNumber}
          onEvidenceAdded={handleEvidenceUploaded}
          compact
        />
      </Modal>

      {/* Detail Modal */}
      <EvidenceDetailModal
        item={selectedEvidenceItem}
        onClose={() => setSelectedEvidenceItem(null)}
        onUpdateEvidence={onUpdateEvidence}
      />

      {/* Entity Detail Modal */}
      <EntityDetailModal
        entity={selectedEntity}
        relationships={relationships}
        entities={entities}
        evidenceItems={evidenceItems}
        onClose={() => setSelectedEntity(null)}
        onSelectEntity={(ent) => setSelectedEntity(ent)}
        onAskAI={(ent) => handleAskAI(`Why is entity ${ent.normalizedValue} considered high risk and what evidence connects it?`)}
      />
    </div>
  );
};
