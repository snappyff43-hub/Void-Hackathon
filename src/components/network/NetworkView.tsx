import React, { useState } from 'react';
import { Network, Sparkles } from 'lucide-react';
import type { Entity, EntityRelationship, EvidenceItem } from '../../types';
import { NetworkFilters } from './NetworkFilters';
import { MoneyFlowSummaryPanel } from './MoneyFlowSummaryPanel';
import { NetworkGraphCanvas } from './NetworkGraphCanvas';
import { GraphLegend } from './GraphLegend';
import { EntityDetailModal } from '../entities/EntityDetailModal';
import { WhyConnectedModal } from '../entities/WhyConnectedModal';
import { EvidenceDetailModal } from '../evidence/EvidenceDetailModal';
import { Button } from '../ui/Button';

interface NetworkViewProps {
  entities: Entity[];
  relationships: EntityRelationship[];
  evidenceItems: EvidenceItem[];
  onSelectEntity?: (entity: Entity) => void;
  onAskAI?: (query: string) => void;
}

export const NetworkView: React.FC<NetworkViewProps> = ({
  entities,
  relationships,
  evidenceItems,
  onSelectEntity,
  onAskAI,
}) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntityType, setSelectedEntityType] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedRelType, setSelectedRelType] = useState('ALL');
  const [isMoneyFlowActive, setIsMoneyFlowActive] = useState(false);

  // Modal States
  const [selectedNodeEntity, setSelectedNodeEntity] = useState<Entity | null>(null);
  const [selectedEdgeRel, setSelectedEdgeRel] = useState<EntityRelationship | null>(null);
  const [selectedEvidenceItem, setSelectedEvidenceItem] = useState<EvidenceItem | null>(null);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedEntityType('ALL');
    setSelectedRisk('ALL');
    setSelectedRelType('ALL');
    setIsMoneyFlowActive(false);
  };

  const handleSelectNode = (entity: Entity) => {
    setSelectedNodeEntity(entity);
    if (onSelectEntity) onSelectEntity(entity);
  };

  const handleSelectEdge = (rel: EntityRelationship) => {
    setSelectedEdgeRel(rel);
  };

  // Find source & target entities for selected edge
  const edgeSourceEntity = selectedEdgeRel
    ? entities.find((e) => e.id === selectedEdgeRel.sourceEntityId)
    : undefined;
  const edgeTargetEntity = selectedEdgeRel
    ? entities.find((e) => e.id === selectedEdgeRel.targetEntityId)
    : undefined;

  // Empty State Check
  if (entities.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '32px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <Network size={24} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          No correlated entities available.
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: 0 }}>
          Upload evidence or load the demonstration case to build the investigation network.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Fraud Network Graph
            </h1>
            <span
              style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-primary)',
                backgroundColor: 'rgba(124, 92, 252, 0.1)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(124, 92, 252, 0.3)',
              }}
            >
              {entities.length} Nodes • {relationships.length} Relationships
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Interactive multi-hop relationship graph and evidence-linked fund flow analysis.
          </p>
        </div>

        {onAskAI && (
          <Button
            variant="outline"
            size="sm"
            icon={<Sparkles size={13} style={{ color: 'var(--accent-primary)' }} />}
            onClick={() => onAskAI('Explain the important relationships and money flow in this network.')}
          >
            Ask AI About This Network
          </Button>
        )}
      </div>

      {/* Filter Toolbar */}
      <NetworkFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedEntityType={selectedEntityType}
        onEntityTypeChange={setSelectedEntityType}
        selectedRisk={selectedRisk}
        onRiskChange={setSelectedRisk}
        selectedRelType={selectedRelType}
        onRelTypeChange={setSelectedRelType}
        isMoneyFlowActive={isMoneyFlowActive}
        onToggleMoneyFlow={() => setIsMoneyFlowActive((prev) => !prev)}
        onResetFilters={handleResetFilters}
      />

      {/* Money Flow Summary Panel (when active) */}
      <MoneyFlowSummaryPanel active={isMoneyFlowActive} />

      {/* Main Canvas Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NetworkGraphCanvas
          entities={entities}
          relationships={relationships}
          searchQuery={searchQuery}
          selectedEntityType={selectedEntityType}
          selectedRisk={selectedRisk}
          selectedRelType={selectedRelType}
          isMoneyFlowActive={isMoneyFlowActive}
          onSelectNode={handleSelectNode}
          onSelectEdge={handleSelectEdge}
          height="540px"
        />

        {/* Legend */}
        <GraphLegend />
      </div>

      {/* Node Detail Modal */}
      <EntityDetailModal
        entity={selectedNodeEntity}
        relationships={relationships}
        entities={entities}
        evidenceItems={evidenceItems}
        onClose={() => setSelectedNodeEntity(null)}
        onSelectEntity={(ent) => setSelectedNodeEntity(ent)}
      />

      {/* Edge / Why Connected Modal */}
      <WhyConnectedModal
        relationship={selectedEdgeRel}
        sourceEntity={edgeSourceEntity}
        targetEntity={edgeTargetEntity}
        onClose={() => setSelectedEdgeRel(null)}
      />

      {/* Evidence Detail Modal */}
      <EvidenceDetailModal
        item={selectedEvidenceItem}
        onClose={() => setSelectedEvidenceItem(null)}
      />
    </div>
  );
};
