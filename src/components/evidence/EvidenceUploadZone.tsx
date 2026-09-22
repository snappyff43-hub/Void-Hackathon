import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2, X, FileText, Lock } from 'lucide-react';
import type { EvidenceItem, EvidenceSourceType, Investigation } from '../../types';
import { calculateSHA256, formatFileSize, parseSafePreview, truncateHash } from '../../utils/crypto';
import { validateEvidenceFile } from '../../utils/securityUtils';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface EvidenceUploadZoneProps {
  investigations: Investigation[];
  preselectedCaseId?: string;
  onEvidenceAdded: (item: EvidenceItem) => void;
  compact?: boolean;
}

const SOURCE_TYPES: EvidenceSourceType[] = [
  'Bank Transaction',
  'UPI',
  'CDR',
  'IPDR',
  'Email',
  'Chat',
  'Android / APK',
  'Network',
  'Other',
];

export const EvidenceUploadZone: React.FC<EvidenceUploadZoneProps> = ({
  investigations,
  preselectedCaseId,
  onEvidenceAdded,
  compact = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    preselectedCaseId || (investigations[0]?.caseNumber || 'CASE-2026-001')
  );
  const [sourceType, setSourceType] = useState<EvidenceSourceType>('Bank Transaction');

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingState, setProcessingState] = useState<'Selected' | 'Hashing' | 'Verified' | 'Failed'>('Selected');
  const [computedHash, setComputedHash] = useState<string>('');
  const [previewData, setPreviewData] = useState<{
    previewContent?: string;
    recordCount: number | null;
    detectedColumns?: string[];
  }>({ recordCount: null });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Auto-detect likely source type based on filename
  const guessSourceType = (name: string): EvidenceSourceType => {
    const lower = name.toLowerCase();
    if (lower.includes('bank') || lower.includes('stmt') || lower.includes('statement') || lower.includes('ledger')) return 'Bank Transaction';
    if (lower.includes('upi') || lower.includes('vpa') || lower.includes('npci')) return 'UPI';
    if (lower.includes('cdr') || lower.includes('call')) return 'CDR';
    if (lower.includes('ipdr') || lower.includes('ip_log')) return 'IPDR';
    if (lower.includes('chat') || lower.includes('msg') || lower.includes('whatsapp') || lower.includes('telegram')) return 'Chat';
    if (lower.includes('apk') || lower.includes('android') || lower.includes('logcat')) return 'Android / APK';
    if (lower.includes('eml') || lower.includes('email') || lower.includes('mail')) return 'Email';
    if (lower.includes('pcap') || lower.includes('network') || lower.includes('dns')) return 'Network';
    return 'Other';
  };

  const handleFile = async (file: File) => {
    setErrorMessage('');
    const validation = validateEvidenceFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'File validation failed.');
      return;
    }

    setSelectedFile(file);
    setSourceType(guessSourceType(validation.sanitizedName));
    setIsProcessing(true);
    setProcessingState('Hashing');

    try {
      // Calculate real SHA-256 hash using Web Crypto API
      const hash = await calculateSHA256(file);
      setComputedHash(hash);

      // Safe preview parsing
      const parsed = await parseSafePreview(file);
      setPreviewData(parsed);

      setProcessingState('Verified');
    } catch {
      setProcessingState('Failed');
      setErrorMessage('Unable to calculate cryptographic file hash. Please retry with a valid forensic file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setComputedHash('');
    setProcessingState('Selected');
    setErrorMessage('');
    setPreviewData({ recordCount: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCommitEvidence = () => {
    if (!selectedFile || !computedHash) return;

    const validation = validateEvidenceFile(selectedFile);
    const sanitizedName = validation.sanitizedName || selectedFile.name;
    const ext = (validation.extension || selectedFile.name.split('.').pop() || 'FILE').toUpperCase();
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEvidence: EvidenceItem = {
      id: `evd-${Date.now()}`,
      caseId: selectedCaseId,
      fileName: sanitizedName,
      fileType: ext,
      fileSize: formatFileSize(selectedFile.size),
      fileSizeBytes: selectedFile.size,
      sha256: computedHash,
      uploadedAt: formattedDate,
      status: 'Verified',
      recordCount: previewData.recordCount,
      sourceType,
      previewContent: previewData.previewContent,
      previewHeaders: previewData.detectedColumns,
      analysisMetadata: {
        detectedColumns: previewData.detectedColumns,
        parsedRows: previewData.recordCount ?? undefined,
        encoding: 'UTF-8',
        description: `Ingested ${sourceType} artifact with real SHA-256 verification.`,
      },
    };

    onEvidenceAdded(newEvidence);
    handleReset();
  };

  return (
    <Card style={{ backgroundColor: 'var(--bg-surface)' }}>
      {!compact && (
        <CardHeader
          title="Upload Evidence"
          subtitle="Drag & drop digital artifacts for SHA-256 cryptographic verification and case ingestion"
          icon={<Upload size={16} />}
        />
      )}
      <CardContent style={{ padding: compact ? '14px' : '18px 20px' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.json,.txt,.eml,.pdf"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {!selectedFile ? (
          /* Dropzone */
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: compact ? '24px 16px' : '36px 20px',
              border: `1.5px dashed ${isDragOver ? 'var(--accent-primary)' : 'var(--border-strong)'}`,
              borderRadius: 'var(--radius-md)',
              backgroundColor: isDragOver ? 'var(--accent-subtle)' : 'var(--bg-surface-elevated)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                marginBottom: '10px',
              }}
            >
              <Upload size={18} />
            </div>

            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Drag and drop files here
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              or click to browse local files
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-dim)',
                backgroundColor: 'var(--bg-surface-subtle)',
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span>Supported: CSV, XLSX, JSON, TXT, EML, PDF</span>
              <span>•</span>
              <span>Max: 25 MB</span>
            </div>
          </div>
        ) : (
          /* Staged & Verified File Preview */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* File info banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {selectedFile.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{formatFileSize(selectedFile.size)}</span>
                    <span>•</span>
                    <span>{selectedFile.name.split('.').pop()?.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {processingState === 'Hashing' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                    <Loader2 size={13} className="animate-spin" />
                    Calculating SHA-256...
                  </div>
                )}

                {processingState === 'Verified' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.76rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--status-active-text)',
                      backgroundColor: 'var(--status-active-bg)',
                      border: '1px solid var(--status-active-border)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    <CheckCircle2 size={13} />
                    <span>SHA-256: {truncateHash(computedHash, 6, 6)}</span>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Remove file"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Case & Source Type Association Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Case association */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Associated Investigation <span style={{ color: 'var(--status-critical-text)' }}>*</span>
                </label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  disabled={!!preselectedCaseId}
                  style={{
                    height: '34px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0 10px',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                  }}
                >
                  {investigations.map((inv) => (
                    <option key={inv.caseNumber} value={inv.caseNumber}>
                      {inv.caseNumber} — {inv.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source Type selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Source Classification <span style={{ color: 'var(--status-critical-text)' }}>*</span>
                </label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as EvidenceSourceType)}
                  style={{
                    height: '34px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0 10px',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                  }}
                >
                  {SOURCE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cryptographic Hash Notice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: 'rgba(124, 92, 252, 0.05)',
                border: '1px solid rgba(124, 92, 252, 0.2)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.76rem',
                color: 'var(--text-secondary)',
              }}
            >
              <Lock size={13} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span>
                SHA-256 integrity hash generated from byte stream:{' '}
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {computedHash || 'Calculating...'}
                </strong>
              </span>
            </div>

            {/* Submit Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCommitEvidence}
                disabled={isProcessing || processingState !== 'Verified'}
              >
                Add to Evidence Vault
              </Button>
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {errorMessage && (
          <div
            style={{
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: 'var(--status-critical-bg)',
              border: '1px solid var(--status-critical-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--status-critical-text)',
              fontSize: '0.8rem',
            }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
