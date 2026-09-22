import React, { useState, useMemo } from 'react';
import type { EvidenceItem, Investigation } from '../../types';
import { PageHeader } from '../layout/PageHeader';
import { EvidenceUploadZone } from './EvidenceUploadZone';
import { EvidenceFilters } from './EvidenceFilters';
import { EvidenceTable } from './EvidenceTable';
import { EvidenceDetailModal } from './EvidenceDetailModal';

interface EvidenceVaultViewProps {
  evidenceItems: EvidenceItem[];
  investigations: Investigation[];
  onAddEvidence: (item: EvidenceItem) => void;
  onUpdateEvidence?: (item: EvidenceItem) => void;
}

export const EvidenceVaultView: React.FC<EvidenceVaultViewProps> = ({
  evidenceItems,
  investigations,
  onAddEvidence,
  onUpdateEvidence,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState('ALL');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);

  const filteredEvidence = useMemo(() => {
    return evidenceItems.filter((item) => {
      // Search matching (filename, hash, caseId, sourceType)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchFile = item.fileName.toLowerCase().includes(q);
        const matchHash = item.sha256.toLowerCase().includes(q);
        const matchCase = item.caseId.toLowerCase().includes(q);
        const matchSource = item.sourceType.toLowerCase().includes(q);
        if (!matchFile && !matchHash && !matchCase && !matchSource) return false;
      }

      // Source type filter
      if (selectedSource !== 'ALL' && item.sourceType !== selectedSource) {
        return false;
      }

      // Case filter
      if (selectedCase !== 'ALL' && item.caseId !== selectedCase) {
        return false;
      }

      return true;
    });
  }, [evidenceItems, searchQuery, selectedSource, selectedCase]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <PageHeader
        title="Evidence Vault"
        subtitle="Collect, verify and organize digital evidence for investigation."
      />

      {/* Upload Zone */}
      <EvidenceUploadZone
        investigations={investigations}
        onEvidenceAdded={onAddEvidence}
      />

      {/* Filter Bar */}
      <EvidenceFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSource={selectedSource}
        onSourceChange={setSelectedSource}
        selectedCase={selectedCase}
        onCaseChange={setSelectedCase}
        investigations={investigations}
      />

      {/* Evidence Table */}
      <EvidenceTable
        evidenceItems={filteredEvidence}
        onSelectEvidence={(item) => setSelectedEvidence(item)}
      />

      {/* Detail Modal */}
      <EvidenceDetailModal
        item={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
        onUpdateEvidence={onUpdateEvidence}
      />
    </div>
  );
};
