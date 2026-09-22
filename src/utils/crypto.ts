/**
 * Computes the real cryptographic SHA-256 hash of a file using the Web Crypto API.
 */
export async function calculateSHA256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Formats byte count into a clean human-readable string (KB, MB, Bytes).
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Truncates a SHA-256 string for compact UI badges (e.g. a8f3...92bd).
 */
export function truncateHash(hash: string, startChars = 4, endChars = 4): string {
  if (!hash || hash.length <= startChars + endChars) return hash;
  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
}

/**
 * Safely parses the initial lines of text-based files for safe forensic preview.
 */
export async function parseSafePreview(
  file: File
): Promise<{
  previewContent?: string;
  recordCount: number | null;
  detectedColumns?: string[];
}> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  // Non-text files do not provide raw preview before full ingestion pipeline
  if (['pdf', 'xlsx', 'xls', 'apk', 'pcap'].includes(ext)) {
    return {
      previewContent: undefined,
      recordCount: null,
      detectedColumns: undefined,
    };
  }

  try {
    // Read up to first 64KB for safety
    const blobSlice = file.slice(0, 64 * 1024);
    const text = await blobSlice.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

    if (ext === 'csv') {
      const headerLine = lines[0] || '';
      const detectedColumns = headerLine.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      const sampleLines = lines.slice(0, 8).join('\n');
      return {
        previewContent: sampleLines,
        recordCount: Math.max(0, lines.length - 1),
        detectedColumns,
      };
    }

    if (ext === 'json') {
      try {
        const parsed = JSON.parse(text);
        let recordCount: number | null = null;
        if (Array.isArray(parsed)) {
          recordCount = parsed.length;
        } else if (typeof parsed === 'object' && parsed !== null) {
          recordCount = Object.keys(parsed).length;
        }
        const formattedPreview = JSON.stringify(parsed, null, 2).split('\n').slice(0, 15).join('\n');
        return {
          previewContent: formattedPreview,
          recordCount,
        };
      } catch {
        return {
          previewContent: lines.slice(0, 12).join('\n'),
          recordCount: lines.length,
        };
      }
    }

    if (ext === 'txt' || ext === 'log') {
      return {
        previewContent: lines.slice(0, 10).join('\n'),
        recordCount: lines.length,
      };
    }

    if (ext === 'eml') {
      const sample = lines.slice(0, 10).join('\n');
      return {
        previewContent: sample,
        recordCount: 1,
      };
    }

    return {
      previewContent: lines.slice(0, 8).join('\n'),
      recordCount: lines.length,
    };
  } catch {
    return {
      previewContent: undefined,
      recordCount: null,
    };
  }
}
