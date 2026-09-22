import React from 'react';
import { DollarSign, Info } from 'lucide-react';
import { Card } from '../ui/Card';

interface MoneyFlowSummaryPanelProps {
  active?: boolean;
}

export const MoneyFlowSummaryPanel: React.FC<MoneyFlowSummaryPanelProps> = ({ active = true }) => {
  if (!active) return null;

  return (
    <Card
      style={{
        padding: '12px 16px',
        backgroundColor: 'rgba(124, 92, 252, 0.05)',
        border: '1px solid rgba(124, 92, 252, 0.25)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Header & Flow Stages */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DollarSign size={15} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Evidence-Linked Money Flow Path
            </span>
          </div>

          {/* Sequential Flow Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-surface-elevated)', padding: '2px 6px', borderRadius: '3px' }}>
              Victim
            </span>
            <span style={{ color: '#fb7185' }}>→ ₹75,000 →</span>
            <span style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-surface-elevated)', padding: '2px 6px', borderRadius: '3px' }}>
              Mule Account
            </span>
            <span style={{ color: '#fb7185' }}>→ ₹68,000 →</span>
            <span style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-surface-elevated)', padding: '2px 6px', borderRadius: '3px' }}>
              Intermediary
            </span>
            <span style={{ color: '#fb7185' }}>→ ₹62,000 →</span>
            <span style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-surface-elevated)', padding: '2px 6px', borderRadius: '3px' }}>
              Cash-out Node
            </span>
          </div>
        </div>

        {/* 4 Metric Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '10px',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Initial Transfer
            </span>
            <div style={{ fontSize: '1.05rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1px' }}>
              ₹75,000
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Received from victim</div>
          </div>

          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Forwarded (Layer 2)
            </span>
            <div style={{ fontSize: '1.05rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '1px' }}>
              ₹68,000
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Delta: +6m 43s</div>
          </div>

          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Downstream (Layer 3)
            </span>
            <div style={{ fontSize: '1.05rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fbbf24', marginTop: '1px' }}>
              ₹62,000
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Cash-out ATM hop</div>
          </div>

          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Observed Difference
            </span>
            <div style={{ fontSize: '1.05rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--status-critical-text)', marginTop: '1px' }}>
              ₹7,000
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Observed delta in transit</div>
          </div>
        </div>

        {/* Forensic Advisory Note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
          <Info size={12} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <span>
            Designation: <strong>Observed transaction difference</strong>. Reflects numerical accounting variances across transaction logs pending bank certification.
          </span>
        </div>
      </div>
    </Card>
  );
};
