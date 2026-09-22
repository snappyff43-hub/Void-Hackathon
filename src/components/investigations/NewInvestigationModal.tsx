import React, { useState } from 'react';
import type { Investigation, PriorityLevel } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TextInput } from '../ui/Input';

interface NewInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newInv: Investigation) => void;
  existingCount: number;
}

const TYPE_OPTIONS = [
  'Financial Fraud',
  'UPI Fraud',
  'APK / Phishing',
  'Mule Account',
  'Identity Fraud',
  'Other',
];

const PRIORITY_OPTIONS: { label: string; value: PriorityLevel }[] = [
  { label: 'Critical', value: 'CRITICAL' },
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
];

export const NewInvestigationModal: React.FC<NewInvestigationModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  existingCount,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Financial Fraud');
  const [priority, setPriority] = useState<PriorityLevel>('HIGH');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleReset = () => {
    setTitle('');
    setType('Financial Fraud');
    setPriority('HIGH');
    setDescription('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Investigation Title is required.');
      return;
    }

    const nextIdNum = existingCount + 1;
    const caseNumber = `CASE-2026-${String(nextIdNum).padStart(3, '0')}`;

    const newInvestigation: Investigation = {
      id: `inv-${Date.now()}`,
      caseNumber,
      title: title.trim(),
      type,
      priority,
      status: 'Active',
      evidenceCount: 0,
      entitiesCount: 0,
      lastUpdated: 'Just now',
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      reportedLoss: 'Pending assessment',
      riskScore: priority === 'CRITICAL' ? 90 : priority === 'HIGH' ? 75 : priority === 'MEDIUM' ? 50 : 25,
      summary: description.trim() || 'New investigation docket initialized. Pending evidence ingestion.',
      findings: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Case created',
        },
      ],
    };

    onCreate(newInvestigation);
    handleReset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleReset();
        onClose();
      }}
      title="New Investigation"
      subtitle="Register a new cyber-fraud investigation docket"
      maxWidth="540px"
      footer={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleReset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Create Investigation
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Title */}
        <TextInput
          label="Investigation Title"
          placeholder="e.g. SIM Swap & Payment Gateway Hijacking"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          error={error}
          required
        />

        {/* Type & Priority Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {/* Type */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Investigation Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                width: '100%',
                height: '34px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '0 10px',
                color: 'var(--text-primary)',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
              }}
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              style={{
                width: '100%',
                height: '34px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '0 10px',
                color: 'var(--text-primary)',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
              }}
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Enter initial incident description, reported victim details, or known modus operandi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>
      </form>
    </Modal>
  );
};
