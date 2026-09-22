# CYBERTRACE — Research, Standards & Statutory References

This document establishes the scientific, regulatory, and technical foundation underlying CYBERTRACE's digital forensics and evidence correlation architecture.

---

## 1. Digital Forensics & Evidence Integrity Standards

### NIST SP 800-86 — Guide to Integrating Forensic Techniques into Incident Response
- **Author:** National Institute of Standards and Technology (NIST)
- **Official Link:** [https://csrc.nist.gov/publications/detail/sp/800-86/final](https://csrc.nist.gov/publications/detail/sp/800-86/final)
- **Relevance to CYBERTRACE:** Defines the four foundational phases of forensic processing: Collection, Examination, Analysis, and Reporting. CYBERTRACE mirrors this exact progression across its modules.

### NIST Cybersecurity Framework (CSF) 2.0
- **Author:** National Institute of Standards and Technology (NIST)
- **Official Link:** [https://www.nist.gov/cyberframework](https://www.nist.gov/cyberframework)
- **Relevance to CYBERTRACE:** Informs the "Detect" and "Respond" function categories, specifically automated telemetry correlation and incident brief dissemination.

### ISO/IEC 27037:2012 — Guidelines for Identification, Collection, Acquisition, and Preservation of Digital Evidence
- **Author:** International Organization for Standardization (ISO)
- **Official Link:** [https://www.iso.org/standard/44381.html](https://www.iso.org/standard/44381.html)
- **Relevance to CYBERTRACE:** Mandates evidence integrity verification via one-way cryptographic hash functions (SHA-256) at ingestion time.

---

## 2. Regulatory & Statutory Frameworks (India)

### CERT-In Cyber Security Directions (No. 20(3)/2022-CERT-In)
- **Issuing Authority:** Indian Computer Emergency Response Team (CERT-In), MeitY
- **Official Link:** [https://www.cert-in.org.in/Directions2022.jsp](https://www.cert-in.org.in/Directions2022.jsp)
- **Relevance to CYBERTRACE:** Mandates the retention of subscriber details, IPv4/IPv6 access logs, and telecom transaction records, enabling deterministic correlation across service providers.

### Section 91, Code of Criminal Procedure (CrPC) / Section 94, Bharatiya Nagarik Suraksha Sanhita (BNSS)
- **Relevance to CYBERTRACE:** Authorizes police officers to issue formal summons for the production of documents or digital records. CYBERTRACE automates Section 91 notice generation for bank account freezes and ATM CCTV retrieval.

### Section 67C, Information Technology Act, 2000
- **Relevance to CYBERTRACE:** Prescribes statutory preservation of digital traffic data and ISP subscriber records by intermediaries for law-enforcement inquiries.

### NPCI Guidelines on UPI Fraud Risk Management & Real-Time Monitoring
- **Issuing Authority:** National Payments Corporation of India (NPCI)
- **Official Link:** [https://www.npci.org.in/](https://www.npci.org.in/)
- **Relevance to CYBERTRACE:** Defines transaction velocity indicators, rapid hop thresholds, and mule account routing patterns modeled in CYBERTRACE's financial flow engine.

---

## 3. Structural Comparison: Standards vs. Implementation

| Dimension | International / Statutory Standard | CYBERTRACE Current Implementation (PoC) | Future Proposed Capability |
| :--- | :--- | :--- | :--- |
| **Evidence Hashing** | SHA-256 bitstream checksums (NIST SP 800-86) | Client-side native WebCrypto SHA-256 on byte buffer | Institutional HSM hardware-level signing |
| **Integrity Chain** | Sworn custodian affidavits (Sec 65B IEA / Sec 63 BSA) | Immutable session register with exact byte counts | Distributed cryptographic witness ledger |
| **Entity Resolution** | Multi-source identifier linkage | Deterministic rule-based canonical normalization | Machine-learned probabilistic deduplication |
| **Statutory Notice** | Formal judicial and police summons | Pre-filled Section 91 CrPC and Section 67C forms | Direct API dispatch to banking nodal officers |
