import type { EntityType } from '../types';

export const SUPPORTED_EVIDENCE_EXTENSIONS = [
  'csv',
  'xlsx',
  'xls',
  'json',
  'txt',
  'log',
  'eml',
  'pdf',
  'apk',
  'pcap',
];

export const MAX_EVIDENCE_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedName: string;
  extension: string;
}

/**
 * Validates file input against strict size, extension, and filename safety rules.
 * Does not throw exceptions; returns clear user-facing validation results.
 */
export function validateEvidenceFile(file: File | null | undefined): FileValidationResult {
  if (!file) {
    return {
      valid: false,
      error: 'No file was provided for ingestion.',
      sanitizedName: '',
      extension: '',
    };
  }

  // Check for empty files
  if (file.size === 0) {
    return {
      valid: false,
      error: `File "${file.name}" is empty (0 bytes) and contains no evidentiary records.`,
      sanitizedName: file.name,
      extension: '',
    };
  }

  // Check file size bounds
  if (file.size > MAX_EVIDENCE_FILE_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds the forensic ingestion threshold of 25 MB.`,
      sanitizedName: file.name,
      extension: '',
    };
  }

  // Sanitize filename: remove directory traversal sequences (..) and control chars
  const rawName = file.name || 'unnamed_evidence';
  const sanitizedName = rawName
    .replace(/\.\.+/g, '') // remove consecutive dots
    .replace(/[/\\]/g, '_') // replace path separators
    .replace(/[\x00-\x1F\x7F]/g, '') // remove ASCII control characters
    .trim();

  // Extract and validate extension
  const parts = sanitizedName.split('.');
  const ext = parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';

  if (!ext || !SUPPORTED_EVIDENCE_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Unsupported file format ".${ext || 'unknown'}". Supported formats: ${SUPPORTED_EVIDENCE_EXTENSIONS.map((e) => `.${e}`).join(', ')}.`,
      sanitizedName,
      extension: ext,
    };
  }

  return {
    valid: true,
    sanitizedName,
    extension: ext,
  };
}

/**
 * Verifies if a string is a valid 64-character hexadecimal SHA-256 string.
 */
export function verifySHA256Format(hash: string): boolean {
  if (!hash || typeof hash !== 'string') return false;
  return /^[a-f0-9]{64}$/i.test(hash.trim());
}

/**
 * Applies safe display masking for privacy while preserving the underlying forensic identifier.
 * Masks middle characters to protect privacy without corrupting correlation datasets.
 */
export function maskIdentifier(value: string, type?: EntityType | string): string {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();

  // Short values under 6 characters are not masked to avoid total obfuscation
  if (trimmed.length <= 6) return trimmed;

  switch (type) {
    case 'PHONE': {
      // e.g., 9876500011 -> 98765••••11
      const clean = trimmed.replace(/\s+/g, '');
      if (clean.length >= 10) {
        return `${clean.slice(0, 5)}••••${clean.slice(-2)}`;
      }
      return `${trimmed.slice(0, 3)}••••${trimmed.slice(-2)}`;
    }

    case 'BANK_ACCOUNT': {
      // e.g., ACCT-4821 or 10098234821 -> ACCT-••••4821
      if (trimmed.includes('-')) {
        const parts = trimmed.split('-');
        return `${parts[0]}-••••${parts[parts.length - 1]}`;
      }
      return `${trimmed.slice(0, 4)}••••${trimmed.slice(-4)}`;
    }

    case 'UPI_VPA': {
      // e.g., victim.user@okaxis -> vic••••er@okaxis
      if (trimmed.includes('@')) {
        const [user, handle] = trimmed.split('@');
        if (user.length > 4) {
          return `${user.slice(0, 3)}••••${user.slice(-2)}@${handle}`;
        }
        return `${user.slice(0, 1)}••••@${handle}`;
      }
      return `${trimmed.slice(0, 3)}••••${trimmed.slice(-2)}`;
    }

    case 'IP_ADDRESS': {
      // e.g., 103.84.21.77 -> 103.84.•••.••
      const octets = trimmed.split('.');
      if (octets.length === 4) {
        return `${octets[0]}.${octets[1]}.•••.••`;
      }
      return trimmed;
    }

    case 'IMEI': {
      // e.g., 356938035643809 -> 3569••••••••809
      if (trimmed.length >= 14) {
        return `${trimmed.slice(0, 4)}••••••••${trimmed.slice(-3)}`;
      }
      return `${trimmed.slice(0, 4)}••••${trimmed.slice(-2)}`;
    }

    case 'EMAIL': {
      // e.g., fraud.operator@protonmail.com -> fr••••or@protonmail.com
      if (trimmed.includes('@')) {
        const [name, domain] = trimmed.split('@');
        if (name.length > 4) {
          return `${name.slice(0, 2)}••••${name.slice(-2)}@${domain}`;
        }
        return `${name.slice(0, 1)}••••@${domain}`;
      }
      return trimmed;
    }

    default: {
      return `${trimmed.slice(0, 4)}••••${trimmed.slice(-3)}`;
    }
  }
}
