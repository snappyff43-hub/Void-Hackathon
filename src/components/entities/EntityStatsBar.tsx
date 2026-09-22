import React from 'react';
import { Users, AlertTriangle, Phone, CreditCard, Smartphone, Globe } from 'lucide-react';
import type { Entity } from '../../types';
import { Card } from '../ui/Card';

interface EntityStatsBarProps {
  entities: Entity[];
}

export const EntityStatsBar: React.FC<EntityStatsBarProps> = ({ entities }) => {
  const total = entities.length;
  const highRisk = entities.filter((e) => e.riskScore >= 60).length;
  const phones = entities.filter((e) => e.type === 'PHONE').length;
  const financial = entities.filter((e) => e.type === 'UPI_VPA' || e.type === 'BANK_ACCOUNT').length;
  const devices = entities.filter((e) => e.type === 'DEVICE' || e.type === 'IMEI' || e.type === 'APK_HASH').length;
  const ips = entities.filter((e) => e.type === 'IP_ADDRESS').length;

  const stats = [
    { label: 'Total Entities', value: total, icon: <Users size={16} />, color: '#7c5cfc' },
    { label: 'High Risk', value: highRisk, icon: <AlertTriangle size={16} />, color: '#f43f5e', highlight: true },
    { label: 'Phones', value: phones, icon: <Phone size={16} />, color: '#38bdf8' },
    { label: 'UPI / Bank', value: financial, icon: <CreditCard size={16} />, color: '#fbbf24' },
    { label: 'Devices / IMEI', value: devices, icon: <Smartphone size={16} />, color: '#a78bfa' },
    { label: 'IP Addresses', value: ips, icon: <Globe size={16} />, color: '#34d399' },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
      }}
    >
      {stats.map((s, idx) => (
        <Card key={idx} style={{ padding: '12px 14px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {s.label}
            </span>
            <span style={{ color: s.color }}>{s.icon}</span>
          </div>
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: s.highlight && s.value > 0 ? 'var(--status-critical-text)' : 'var(--text-primary)',
              marginTop: '4px',
            }}
          >
            {s.value}
          </div>
        </Card>
      ))}
    </div>
  );
};
