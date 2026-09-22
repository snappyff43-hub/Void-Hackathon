import React from 'react';
import { Search, DollarSign, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface NetworkFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedEntityType: string;
  onEntityTypeChange: (val: string) => void;
  selectedRisk: string;
  onRiskChange: (val: string) => void;
  selectedRelType: string;
  onRelTypeChange: (val: string) => void;
  isMoneyFlowActive: boolean;
  onToggleMoneyFlow: () => void;
  onResetFilters?: () => void;
}

const ENTITY_TYPE_OPTIONS = [
  { label: 'All Entity Types', value: 'ALL' },
  { label: 'Phone Numbers', value: 'PHONE' },
  { label: 'UPI VPAs', value: 'UPI_VPA' },
  { label: 'Bank Accounts', value: 'BANK_ACCOUNT' },
  { label: 'IMEI / Devices', value: 'IMEI' },
  { label: 'IP Addresses', value: 'IP_ADDRESS' },
  { label: 'Email Addresses', value: 'EMAIL' },
  { label: 'APK Hashes', value: 'APK_HASH' },
];

const RISK_OPTIONS = [
  { label: 'All Risk Levels', value: 'ALL' },
  { label: 'Critical (80-100)', value: 'CRITICAL' },
  { label: 'High (60-79)', value: 'HIGH' },
  { label: 'Medium (30-59)', value: 'MEDIUM' },
  { label: 'Low (0-29)', value: 'LOW' },
];

const RELATIONSHIP_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Relationships', value: 'ALL' },
  { label: 'TRANSFERRED_TO', value: 'TRANSFERRED_TO' },
  { label: 'ASSOCIATED_WITH', value: 'ASSOCIATED_WITH' },
  { label: 'SHARED_DEVICE', value: 'SHARED_DEVICE' },
  { label: 'SHARED_IP', value: 'SHARED_IP' },
  { label: 'COMMUNICATION_LINK', value: 'COMMUNICATION_LINK' },
];

export const NetworkFilters: React.FC<NetworkFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedEntityType,
  onEntityTypeChange,
  selectedRisk,
  onRiskChange,
  selectedRelType,
  onRelTypeChange,
  isMoneyFlowActive,
  onToggleMoneyFlow,
  onResetFilters,
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
      {/* Left: Search input */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flex: '1 1 240px',
          maxWidth: '340px',
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
          placeholder="Search node by phone, UPI, IMEI, IP..."
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

      {/* Middle: Dropdown Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Entity Type Filter */}
        <select
          value={selectedEntityType}
          onChange={(e) => onEntityTypeChange(e.target.value)}
          style={{
            height: '32px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '0 8px',
            color: 'var(--text-secondary)',
            fontSize: '0.78rem',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {ENTITY_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Risk Level Filter */}
        <select
          value={selectedRisk}
          onChange={(e) => onRiskChange(e.target.value)}
          style={{
            height: '32px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '0 8px',
            color: 'var(--text-secondary)',
            fontSize: '0.78rem',
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

        {/* Relationship Type Filter */}
        <select
          value={selectedRelType}
          onChange={(e) => onRelTypeChange(e.target.value)}
          style={{
            height: '32px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '0 8px',
            color: 'var(--text-secondary)',
            fontSize: '0.78rem',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {RELATIONSHIP_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Button
          variant={isMoneyFlowActive ? 'primary' : 'outline'}
          size="sm"
          icon={<DollarSign size={13} />}
          onClick={onToggleMoneyFlow}
          style={{
            backgroundColor: isMoneyFlowActive ? '#f43f5e' : undefined,
            borderColor: isMoneyFlowActive ? '#f43f5e' : undefined,
          }}
        >
          {isMoneyFlowActive ? 'Hide Money Flow' : 'Trace Money Flow'}
        </Button>

        {onResetFilters && (
          <button
            onClick={onResetFilters}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Reset Filters"
            aria-label="Reset Filters"
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
