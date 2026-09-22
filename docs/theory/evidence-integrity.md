# Technical Theory — Digital Evidence Integrity & SHA-256 Verification

## 1. Concept
Cryptographic hashing algorithms, specifically SHA-256 (Secure Hash Algorithm 256-bit), produce a fixed 64-character hexadecimal digest from an arbitrary byte sequence. SHA-256 is computationally infeasible to invert, and any modification to a single bit of the input file will completely alter the resulting hash (the avalanche effect).

## 2. Why It Matters
In financial cybercrime prosecution, opposing counsel routinely challenges the veracity of digital ledgers. Demonstrating that the SHA-256 checksum generated at the time of file seizure matches the checksum of the evidence presented in the courtroom provides mathematical proof of integrity under standard evidence statutes (such as Section 65B of the Indian Evidence Act / Section 63 of the Bharatiya Sakshya Adhiniyam).

## 3. How CYBERTRACE Uses It
- **Automatic Ingestion Hashing:** When an evidence artifact is dragged into CYBERTRACE, the file's raw byte buffer is processed through SHA-256 before any parsing occurs.
- **Hash Validation:** Formats are strictly checked against 64-character hex patterns (`^[a-f0-9]{64}$`).
- **Cryptographic Registry:** Evidence tables and Golden-Hour Brief reports display the verified hash alongside the file name, byte size, and ingestion timestamp.

## 4. Example
A telecom Call Detail Record file:
```text
File Name: CDR_001.csv
File Size: 246,784 bytes (241 KB)
SHA-256: c5d8e7a2b9048172901847291048572910384759281740192837465910293847
Status: Verified
```

## 5. Technical Implementation
Located in [src/utils/crypto.ts](file:///d:/PERCEPTOMINDS/src/utils/crypto.ts):
```typescript
export async function calculateSHA256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
```

## 6. Limitations & Disclaimers
In compliance with ethical digital forensics principles, CYBERTRACE explicitly states in its UI that client-side hashing provides integrity metadata for analytical workflows, but formal forensic certification requires institutional digital signatures and sworn custodian affidavits.
