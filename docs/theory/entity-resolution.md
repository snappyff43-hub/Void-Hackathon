# Technical Theory — Entity Resolution & Normalization

## 1. Concept
Entity Resolution (also known as record linkage or identity deduplication) is the process of identifying and connecting different digital representations of the same real-world entity across disparate, heterogeneous data sources. Normalization is the foundational step of converting heterogeneous string formats into a single canonical syntax.

## 2. Why It Matters
Cyber-fraud networks exploit formatting discrepancies to evade detection:
- A phone number may appear as `+91 98765-00099` in a banking KYC database, `09876500099` in a CDR telecommunications log, and `919876500099` in a chat export.
- If treated as distinct strings, automated systems fail to connect the victim's phone call with the subsequent fraudulent transfer.

## 3. How CYBERTRACE Uses It
CYBERTRACE implements a deterministic normalization pipeline for 7 critical forensic entity types:
1. **Phone Numbers:** Strips international prefixes, leading zeroes, hyphens, and whitespace to achieve canonical 10-digit national values.
2. **UPI Virtual Payment Addresses:** Trims whitespace and enforces lowercase alphanumeric normalization (`victim.user@okaxis`).
3. **IP Addresses:** Cleans trailing port numbers and validates IPv4 octets.
4. **Device IMEIs:** Strips hyphens and validates 15-digit TAC specifications.
5. **Bank Accounts:** Cleans punctuation, uppercase formatting, and isolates branch IFSC codes.
6. **Email Addresses:** Standardizes domain casing and filters out payment provider routing handles.
7. **Malware Hashes:** Validates APK SHA-256 and MD5 checksum signatures.

## 4. Normalization Example
```text
Raw CDR Telemetry:      "919876500099"
Raw UPI 2FA Log:        "+91-98765 00099"
Raw Banking Record:     "09876500099"
Canonical Normalized:   "9876500099"
Resolution Result:      Single Entity (ent-008) unified across 3 evidence files
```

## 5. Technical Implementation
Located in [src/services/intelligenceService.ts](file:///d:/PERCEPTOMINDS/src/services/intelligenceService.ts):
```typescript
export function normalizePhone(raw: string): string {
  if (!raw) return '';
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}
```

## 6. Privacy Display Masking
To prevent accidental visual leakage of Personally Identifiable Information (PII) during screen-sharing or courtroom projection, CYBERTRACE provides non-destructive privacy masking:
- `9876500099` displays as `98765••••99`
- `mule01@bank` displays as `mul••••01@bank`
- `103.84.21.77` displays as `103.84.•••.••`
The underlying canonical value remains intact to preserve 100% correlation accuracy.
