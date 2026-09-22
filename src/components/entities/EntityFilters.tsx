import React from 'react';
import { Search } from 'lucide-react';

interface EntityFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
  selectedRisk: string;
  onRiskChange: (val: string) => void;
}

const TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Entity Types', value: 'ALL' },
  { label: 'Phone Numbers', value: 'PHONE' },
  { label: 'UPI VPAs', value: 'UPI_VPA' },
  { label: 'Bank Accounts', value: 'BANK_ACCOUNT' },
  { label: 'Device / IMEI', value: 'IMEI' },
  { label: 'IP Addresses', value: 'IP_ADDRESS' },
  { label: 'Email Addresses', value: 'EMAIL' },
  { label: 'APK Hashes', value: 'APK_HASH' },
];

const RISK_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Risk Levels', value: 'ALL' },
  { label: 'Critical (80-100)', value: 'CRITICAL' },
  { label: 'High (60-79)', value: 'HIGH' },
  { label: 'Medium (30-59)', value: 'MEDIUM' },
  { label: 'Low (0-29)', value: 'LOW' },
];

export const EntityFilters: React.FC<EntityFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedRisk,
  onRiskChange,
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
          placeholder="Search entity value, ID, or case..."
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
        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
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
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Risk Filter */}
        <select
          value={selectedRisk}
          onChange={(e) => onRiskChange(e.target.value)}
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
          {RISK_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
