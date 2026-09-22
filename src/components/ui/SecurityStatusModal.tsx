import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, FileCheck, Lock, Cpu, Database, EyeOff } from 'lucide-react';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { Button } from './Button';

interface SecurityStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityStatusModal: React.FC<SecurityStatusModalProps> = ({ isOpen, onClose }) => {
  const verifiedControls = [
    {
      title: 'Evidence Integrity Metadata',
      description: 'Native browser WebCrypto SHA-256 cryptographic hashing on ingestion with 64-char hexadecimal validation.',
      status: 'Active',
      icon: <FileCheck size={16} className="text-emerald-400" />,
    },
    {
      title: 'Input Validation & Sanitization',
      description: 'Strict format whitelisting (CSV, JSON, EML, XLSX, TXT), empty-file detection, 25MB safety boundary, and directory traversal stripping.',
      status: 'Active',
      icon: <CheckCircle2 size={16} className="text-emerald-400" />,
    },
    {
      title: 'Fault-Isolated Safe Error Handling',
      description: 'React Error Boundaries wrap workspace modules. Diagnostic notes isolate failures without leaking system stack traces.',
      status: 'Active',
      icon: <ShieldCheck size={16} className="text-emerald-400" />,
    },
    {
      title: 'Evidence Traceability & Citations',
      description: 'Every extracted entity, network node, and brief finding links directly to primary evidence IDs and provenance records.',
      status: 'Active',
      icon: <Database size={16} className="text-emerald-400" />,
    },
    {
      title: 'Copilot Grounding & Hallucination Guard',
      description: 'Strictly bounded to case evidence. Responds with "Insufficient evidence" when ungrounded; never invents accounts or timestamps.',
      status: 'Active',
      icon: <Cpu size={16} className="text-emerald-400" />,
    },
    {
      title: 'Tamper-Evident Forensic Audit Trail',
      description: 'Local chronological ledger logging every query, response summary, linked evidence IDs, and confidence levels.',
      status: 'Active',
      icon: <Lock size={16} className="text-emerald-400" />,
    },
    {
      title: 'Zero External AI Dependency / Air-Gapped Ready',
      description: 'Runs 100% locally with deterministic heuristics. No external LLM APIs, zero API keys, and zero telemetry data leakage.',
      status: 'Active',
      icon: <EyeOff size={16} className="text-emerald-400" />,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} style={{ color: 'var(--status-low-text)' }} />
          <span>Security & Evidence Integrity Posture</span>
        </div>
      }
      subtitle="Operational verification of client-side forensic protections and data integrity controls"
      maxWidth="620px"
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close Status Report
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          <AlertCircle size={16} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Standard Forensic Notice:</span>{' '}
            Controls listed below represent active, verified client-side features. In compliance with strict
            disclosure guidelines, server-side encryption-at-rest and institutional role authorization require enterprise backend deployment.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {verifiedControls.map((ctrl, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ marginTop: '2px', color: 'var(--status-low-text)' }}>{ctrl.icon}</div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {ctrl.title}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                    {ctrl.description}
                  </div>
                </div>
              </div>
              <Badge variant="active" size="sm">
                {ctrl.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
