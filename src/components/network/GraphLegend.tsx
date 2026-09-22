import React from 'react';
import {
  Phone,
  CreditCard,
  Smartphone,
  Globe,
  Mail,
  User,
} from 'lucide-react';

export const GraphLegend: React.FC = () => {
  const entityItems = [
    { label: 'Phone', icon: <Phone size={12} />, color: '#38bdf8' },
    { label: 'UPI / Bank', icon: <CreditCard size={12} />, color: '#fbbf24' },
    { label: 'Device / IMEI', icon: <Smartphone size={12} />, color: '#a78bfa' },
    { label: 'IP Address', icon: <Globe size={12} />, color: '#34d399' },
    { label: 'Email', icon: <Mail size={12} />, color: '#c084fc' },
    { label: 'Person', icon: <User size={12} />, color: '#f43f5e' },
  ];

  const relationshipItems = [
    { label: 'TRANSFERRED_TO', color: '#fb7185', style: 'solid' },
    { label: 'ASSOCIATED_WITH', color: '#a78bfa', style: 'dashed' },
    { label: 'COMMUNICATION_LINK', color: '#38bdf8', style: 'dotted' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '8px 14px',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.74rem',
      }}
    >
      {/* Entity Nodes Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.68rem' }}>
          Nodes:
        </span>
        {entityItems.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
            <span style={{ color: item.color, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Relationships Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.68rem' }}>
          Edges:
        </span>
        {relationshipItems.map((rel, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <span
              style={{
                width: '16px',
                height: '2px',
                backgroundColor: rel.color,
                borderTop: rel.style === 'dashed' ? `2px dashed ${rel.color}` : rel.style === 'dotted' ? `2px dotted ${rel.color}` : undefined,
                display: 'inline-block',
              }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>{rel.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
