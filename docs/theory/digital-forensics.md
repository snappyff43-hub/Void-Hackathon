# Technical Theory — Digital Forensics & Chain of Custody

## 1. Concept
Digital Forensics is the rigorous application of science to the identification, collection, examination, and analysis of digital data while preserving the integrity of the information and maintaining a strict chain of custody for legal and investigative proceedings.

## 2. Why It Matters
In cyber-fraud investigations, digital evidence (such as bank transaction logs, telecom Call Detail Records, and IPDR logs) is inherently volatile and easily disputed in judicial proceedings. If an investigator cannot establish evidentiary provenance—proving that a digital artifact was not tampered with, modified, or hallucinated—the evidence is inadmissible, and financial freeze orders cannot be lawfully enforced.

## 3. How CYBERTRACE Uses It
CYBERTRACE adheres to standard forensic principles:
- **Non-Destructive Ingestion:** Raw uploaded files are preserved in memory with their exact byte length and character encoding.
- **Cryptographic Immutability:** Pre-computation of SHA-256 digests prior to parsing ensures evidence authenticity.
- **Bidirectional Traceability:** Every extracted entity, network node, and AI-generated lead links directly to an immutable evidence artifact ID (`evd-001`, `evd-002`, `evd-003`).

## 4. Example
When a bank statement CSV (`BANK_TRANSACTIONS.csv`) is uploaded:
- Size: `188,416` bytes.
- Cryptographic hash: `3a7b9c1df849e02bb4756281749c812903847291048572910384759281740192`.
- Every transaction node in the network retains an explicit citation pointing back to this hash.

## 5. Technical Implementation
CYBERTRACE executes hashing on the client side using the standard browser WebCrypto API (`window.crypto.subtle.digest`), ensuring files are cryptographically registered without requiring network transmission to third-party endpoints.

## 6. Limitations & Future Scope
In the current proof-of-concept workstation, evidence records are stored in browser memory during the active session. Full enterprise production requires institutional HSM integration and hardware-backed write-once-read-many (WORM) storage.
