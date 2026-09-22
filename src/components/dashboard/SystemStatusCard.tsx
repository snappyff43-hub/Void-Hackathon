import React from 'react';
import { Activity } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { StatusIndicator } from '../ui/StatusIndicator';

interface SystemStatusItem {
  service: string;
  status: 'operational' | 'degraded' | 'offline';
  description?: string;
}

const SYSTEM_STATUS: SystemStatusItem[] = [
  {
    service: 'Evidence Vault & Cryptographic Pipeline',
    status: 'operational',
    description: 'Native WebCrypto SHA-256 verification online',
  },
  {
    service: 'Cross-Source Correlation Engine',
    status: 'operational',
    description: 'Deterministic entity resolution and graph active',
  },
  {
    service: 'Forensic Copilot & Audit Trail',
    status: 'operational',
    description: 'Local evidence-grounded intelligence active',
  },
];

export const SystemStatusCard: React.FC = () => {
  return (
    <Card>
      <CardHeader
        title="System Status"
        subtitle="Platform services and subsystem health"
        icon={<Activity size={16} />}
      />
      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SYSTEM_STATUS.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <StatusIndicator status={item.status} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {item.service}
                  </div>
                  {item.description && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '1px' }}>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--status-active-text)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
