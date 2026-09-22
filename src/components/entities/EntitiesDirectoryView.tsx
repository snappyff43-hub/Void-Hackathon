import React, { useState, useMemo } from 'react';
import type { Entity, EntityRelationship, EvidenceItem } from '../../types';
import { PageHeader } from '../layout/PageHeader';
import { EntityStatsBar } from './EntityStatsBar';
import { EntityFilters } from './EntityFilters';
import { EntityTable } from './EntityTable';
import { EntityDetailModal } from './EntityDetailModal';

interface EntitiesDirectoryViewProps {
  entities: Entity[];
  relationships: EntityRelationship[];
  evidenceItems: EvidenceItem[];
}

export const EntitiesDirectoryView: React.FC<EntitiesDirectoryViewProps> = ({
  entities,
  relationships,
  evidenceItems,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const filteredEntities = useMemo(() => {
    return entities.filter((ent) => {
      // Search matching (normalizedValue, value, type, caseIds)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchVal = ent.normalizedValue.toLowerCase().includes(q) || ent.value.toLowerCase().includes(q);
        const matchType = ent.type.toLowerCase().includes(q);
        const matchCase = ent.caseIds.some((c) => c.toLowerCase().includes(q));
        if (!matchVal && !matchType && !matchCase) return false;
      }

      // Type filter
      if (selectedType !== 'ALL' && ent.type !== selectedType) {
        return false;
      }

      // Risk filter
      if (selectedRisk !== 'ALL') {
        if (selectedRisk === 'CRITICAL' && ent.riskScore < 80) return false;
        if (selectedRisk === 'HIGH' && (ent.riskScore < 60 || ent.riskScore >= 80)) return false;
        if (selectedRisk === 'MEDIUM' && (ent.riskScore < 30 || ent.riskScore >= 60)) return false;
        if (selectedRisk === 'LOW' && ent.riskScore >= 30) return false;
      }

      return true;
    });
  }, [entities, searchQuery, selectedType, selectedRisk]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <PageHeader
        title="Entities Directory"
        subtitle="Cross-case registry of extracted identifiers, mule networks, and correlated infrastructure."
      />

      {/* Summary Statistics */}
      <EntityStatsBar entities={entities} />

      {/* Filter Controls */}
      <EntityFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedRisk={selectedRisk}
        onRiskChange={setSelectedRisk}
      />

      {/* Entities Table */}
      <EntityTable
        entities={filteredEntities}
        onSelectEntity={(ent) => setSelectedEntity(ent)}
      />

      {/* Detail Inspection Modal */}
      <EntityDetailModal
        entity={selectedEntity}
        relationships={relationships}
        entities={entities}
        evidenceItems={evidenceItems}
        onClose={() => setSelectedEntity(null)}
        onSelectEntity={(ent) => setSelectedEntity(ent)}
      />
    </div>
  );
};
