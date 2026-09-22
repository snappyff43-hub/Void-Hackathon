import React, { useState } from 'react';
import type { NavTabId, Investigation, EvidenceItem, Entity, EntityRelationship, TimelineEvent } from './types';
import './App.css';
import { INITIAL_INVESTIGATIONS } from './data/demoData';
import { INITIAL_EVIDENCE_ITEMS } from './data/demoEvidence';
import {
  INITIAL_ENTITIES,
  INITIAL_RELATIONSHIPS,
  INITIAL_TIMELINE_EVENTS,
  extractEntitiesFromEvidenceItem,
} from './services/intelligenceService';
import { AppShell } from './components/layout/AppShell';
import { DashboardView } from './components/dashboard/DashboardView';
import { InvestigationsView } from './components/investigations/InvestigationsView';
import { EvidenceVaultView } from './components/evidence/EvidenceVaultView';
import { EntitiesDirectoryView } from './components/entities/EntitiesDirectoryView';
import { NetworkView } from './components/network/NetworkView';
import { InvestigationReplayView } from './components/timeline/InvestigationReplayView';
import { InvestigationCopilot } from './components/copilot/InvestigationCopilot';
import { GoldenHourBriefView } from './components/brief/GoldenHourBriefView';
import { NewInvestigationModal } from './components/investigations/NewInvestigationModal';
import { ModuleShell } from './components/views/ModuleShell';
import { ErrorBoundary, SecurityStatusModal } from './components/ui';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [investigations, setInvestigations] = useState<Investigation[]>(INITIAL_INVESTIGATIONS);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>(INITIAL_EVIDENCE_ITEMS);
  const [entities, setEntities] = useState<Entity[]>(INITIAL_ENTITIES);
  const [relationships] = useState<EntityRelationship[]>(INITIAL_RELATIONSHIPS);
  const [timelineEvents] = useState<TimelineEvent[]>(INITIAL_TIMELINE_EVENTS);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [copilotInitialQuery, setCopilotInitialQuery] = useState('');

  const handleAskCopilot = (queryText: string) => {
    setCopilotInitialQuery(queryText);
    setActiveTab('copilot');
  };

  const handleAddInvestigation = (newInv: Investigation) => {
    setInvestigations((prev) => [newInv, ...prev]);
    setSelectedCaseId(newInv.id);
    setActiveTab('investigations');
  };

  const handleUpdateInvestigation = (updated: Investigation) => {
    setInvestigations((prev) =>
      prev.map((inv) => (inv.id === updated.id ? updated : inv))
    );
  };

  const handleAddEvidence = (item: EvidenceItem) => {
    try {
      setEvidenceItems((prev) => [item, ...prev]);

      // Automatically trigger safe entity extraction from the new evidence artifact
      const newlyExtracted = extractEntitiesFromEvidenceItem(item, entities);
      if (newlyExtracted.length > 0) {
        setEntities((prev) => [...newlyExtracted, ...prev]);
      }

      // Automatically update the evidence count and entities count for the associated investigation
      setInvestigations((prev) =>
        prev.map((inv) => {
          if (inv.caseNumber === item.caseId || inv.id === item.caseId) {
            return {
              ...inv,
              evidenceCount: (inv.evidenceCount || 0) + 1,
              entitiesCount: (inv.entitiesCount || 0) + newlyExtracted.length,
              lastUpdated: 'Just now',
            };
          }
          return inv;
        })
      );
    } catch (err) {
      console.error('[CYBERTRACE App Engine] Ingestion error caught safely:', err);
    }
  };

  const handleUpdateEvidence = (updatedItem: EvidenceItem) => {
    setEvidenceItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleOpenCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('investigations');
  };

  const handleNavigateTab = (tab: NavTabId) => {
    if (tab !== 'investigations') {
      setSelectedCaseId(null);
    }
    setActiveTab(tab);
  };

  // Compute live badge counts for sidebar and metrics
  const counts = {
    investigations: investigations.filter((i) => i.status === 'Active').length,
    evidence: evidenceItems.length,
    entities: entities.length,
    risk: entities.filter((e) => e.riskScore >= 60).length,
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            investigations={investigations}
            entities={entities}
            evidenceItems={evidenceItems}
            onNavigateTab={handleNavigateTab}
            onOpenCase={handleOpenCase}
          />
        );

      case 'investigations':
        return (
          <InvestigationsView
            investigations={investigations}
            evidenceItems={evidenceItems}
            entities={entities}
            relationships={relationships}
            selectedCaseId={selectedCaseId}
            onSelectCase={(id) => setSelectedCaseId(id)}
            onAddInvestigation={handleAddInvestigation}
            onUpdateInvestigation={handleUpdateInvestigation}
            onAddEvidence={handleAddEvidence}
            onUpdateEvidence={handleUpdateEvidence}
          />
        );

      case 'evidence':
        return (
          <EvidenceVaultView
            evidenceItems={evidenceItems}
            investigations={investigations}
            onAddEvidence={handleAddEvidence}
            onUpdateEvidence={handleUpdateEvidence}
          />
        );

      case 'entities':
        return (
          <EntitiesDirectoryView
            entities={entities}
            relationships={relationships}
            evidenceItems={evidenceItems}
          />
        );

      case 'network':
        return (
          <NetworkView
            entities={entities}
            relationships={relationships}
            evidenceItems={evidenceItems}
            onAskAI={handleAskCopilot}
          />
        );

      case 'timeline':
        return (
          <InvestigationReplayView
            timelineEvents={timelineEvents}
            entities={entities}
            relationships={relationships}
            evidenceItems={evidenceItems}
            investigations={investigations}
            onAskAI={handleAskCopilot}
          />
        );

      case 'risk-intelligence':
        return (
          <ModuleShell
            title="Risk Intelligence"
            subtitle="Automated risk scoring, threat intelligence feeds, and mule cluster indicators."
            description="Risk models and suspicious syndicate indicators aggregated across investigations."
          />
        );

      case 'copilot':
        return (
          <InvestigationCopilot
            investigation={investigations[0]}
            evidenceItems={evidenceItems}
            entities={entities}
            relationships={relationships}
            timelineEvents={timelineEvents}
            initialQuery={copilotInitialQuery}
          />
        );

      case 'reports':
        return (
          <GoldenHourBriefView
            investigation={investigations[0]}
            evidenceItems={evidenceItems}
            entities={entities}
            relationships={relationships}
            timelineEvents={timelineEvents}
            onAskAI={handleAskCopilot}
          />
        );

      default:
        return (
          <DashboardView
            investigations={investigations}
            entities={entities}
            evidenceItems={evidenceItems}
            onNavigateTab={handleNavigateTab}
            onOpenCase={handleOpenCase}
          />
        );
    }
  };

  return (
    <AppShell
      activeTab={activeTab}
      onSelectTab={handleNavigateTab}
      onNewInvestigation={() => setIsNewCaseModalOpen(true)}
      onOpenSecurityStatus={() => setIsSecurityModalOpen(true)}
      counts={counts}
      searchTerm={globalSearchTerm}
      onSearchChange={(val) => {
        setGlobalSearchTerm(val);
        if (activeTab !== 'investigations' && activeTab !== 'evidence' && activeTab !== 'entities') {
          setActiveTab('entities');
        }
      }}
    >
      <ErrorBoundary fallbackTitle="Forensic Module View Safely Isolated">
        {renderActiveTabContent()}
      </ErrorBoundary>

      {/* Global New Investigation Intake Modal */}
      <NewInvestigationModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onCreate={handleAddInvestigation}
        existingCount={investigations.length}
      />

      {/* Verified Security & Integrity Status Modal */}
      <SecurityStatusModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </AppShell>
  );
};

export default App;
