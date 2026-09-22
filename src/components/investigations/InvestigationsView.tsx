import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import type { Investigation, EvidenceItem, Entity, EntityRelationship } from '../../types';
import { PageHeader } from '../layout/PageHeader';
import { Button } from '../ui/Button';
import { InvestigationFilters } from './InvestigationFilters';
import { InvestigationTable } from './InvestigationTable';
import { NewInvestigationModal } from './NewInvestigationModal';
import { InvestigationWorkspace } from './InvestigationWorkspace';

interface InvestigationsViewProps {
  investigations: Investigation[];
  evidenceItems: EvidenceItem[];
  entities: Entity[];
  relationships: EntityRelationship[];
  selectedCaseId: string | null;
  onSelectCase: (caseId: string | null) => void;
  onAddInvestigation: (newInv: Investigation) => void;
  onUpdateInvestigation: (updated: Investigation) => void;
  onAddEvidence: (item: EvidenceItem) => void;
  onUpdateEvidence?: (item: EvidenceItem) => void;
}

export const InvestigationsView: React.FC<InvestigationsViewProps> = ({
  investigations,
  evidenceItems,
  entities,
  relationships,
  selectedCaseId,
  onSelectCase,
  onAddInvestigation,
  onUpdateInvestigation,
  onAddEvidence,
  onUpdateEvidence,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Active open investigation
  const currentInvestigation = useMemo(() => {
    if (!selectedCaseId) return null;
    return investigations.find((inv) => inv.id === selectedCaseId || inv.caseNumber === selectedCaseId) || null;
  }, [investigations, selectedCaseId]);

  // Filtered investigations list
  const filteredInvestigations = useMemo(() => {
    return investigations.filter((inv) => {
      // Search matching (caseNumber, title, type)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCase = inv.caseNumber.toLowerCase().includes(q);
        const matchTitle = inv.title.toLowerCase().includes(q);
        const matchType = inv.type.toLowerCase().includes(q);
        if (!matchCase && !matchTitle && !matchType) return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && inv.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'ALL' && inv.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [investigations, searchQuery, statusFilter, priorityFilter]);

  if (currentInvestigation) {
    return (
      <InvestigationWorkspace
        investigation={currentInvestigation}
        evidenceItems={evidenceItems}
        investigations={investigations}
        entities={entities}
        relationships={relationships}
        onBack={() => onSelectCase(null)}
        onUpdateInvestigation={onUpdateInvestigation}
        onAddEvidence={onAddEvidence}
        onUpdateEvidence={onUpdateEvidence}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Page Header */}
      <PageHeader
        title="Investigations"
        subtitle="Manage and investigate active cyber-fraud cases."
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setIsNewModalOpen(true)}
          >
            New Investigation
          </Button>
        }
      />

      {/* Filter Controls */}
      <InvestigationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
      />

      {/* Investigations Table */}
      <InvestigationTable
        investigations={filteredInvestigations}
        onOpenCase={(inv) => onSelectCase(inv.id)}
      />

      {/* New Investigation Modal */}
      <NewInvestigationModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={(newInv) => {
          onAddInvestigation(newInv);
          onSelectCase(newInv.id);
        }}
        existingCount={investigations.length}
      />
    </div>
  );
};
