import React from 'react';
import { Search } from 'lucide-react';
import type { Investigation } from '../../types';

interface EvidenceFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedSource: string;
  onSourceChange: (val: string) => void;
  selectedCase: string;
  onCaseChange: (val: string) => void;
  investigations: Investigation[];
}

const SOURCE_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Sources', value: 'ALL' },
  { label: 'Bank Transaction', value: 'Bank Transaction' },
  { label: 'UPI', value: 'UPI' },
  { label: 'CDR', value: 'CDR' },
  { label: 'IPDR', value: 'IPDR' },
  { label: 'Email', value: 'Email' },
  { label: 'Chat', value: 'Chat' },
  { label: 'Android / APK', value: 'Android / APK' },
  { label: 'Network', value: 'Network' },
  { label: 'Other', value: 'Other' },
];

export const EvidenceFilters: React.FC<EvidenceFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedSource,
  onSourceChange,
  selectedCase,
  onCaseChange,
  investigations,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
        padding: '12px 16px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* Search Input */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flex: '1 1 280px',
          maxWidth: '380px',
        }}
      >
        <Search
          size={14}
          style={{
            position: 'absolute',
            left: '10px',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Search filename, hash, or case ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            height: '32px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            paddingLeft: '32px',
            paddingRight: '12px',
            color: 'var(--text-primary)',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
          }}
        />
      </div>

      {/* Dropdown Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Case Filter */}
        <select
          value={selectedCase}
          onChange={(e) => onCaseChange(e.target.value)}
          style={{
            height: '32px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '0 10px',
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="ALL">All Investigations</option>
          {investigations.map((inv) => (
            <option key={inv.caseNumber} value={inv.caseNumber}>
              {inv.caseNumber}
            </option>
          ))}
        </select>

        {/* Source Type Filter */}
        <select
          value={selectedSource}
          onChange={(e) => onSourceChange(e.target.value)}
          style={{
            height: '32px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '0 10px',
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {SOURCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
