# CYBERTRACE — End-to-End Investigation Workflow

## The 5-Phase Investigative Pipeline

CYBERTRACE streamlines the investigation lifecycle into an actionable operational journey:
$$\text{INGEST} \longrightarrow \text{CORRELATE} \longrightarrow \text{EXPLAIN} \longrightarrow \text{RECONSTRUCT} \longrightarrow \text{ACT}$$

```mermaid
flowchart TD
    A[Phase 1: Ingest Evidence] --> B[Phase 2: Entity Correlation]
    B --> C[Phase 3: Explainable Analysis]
    C --> D[Phase 4: Timeline Reconstruction]
    D --> E[Phase 5: Golden-Hour Action]

    subgraph "Phase 1: Ingest"
        A1[Multi-Format Ingestion<br/>CSV, JSON, EML, XLSX, TXT]
        A2[Path Sanitization & 25MB Guard]
        A3[WebCrypto SHA-256 Hashing]
        A1 --> A2 --> A3
    end

    subgraph "Phase 2: Correlate"
        B1[Regex Token Extraction]
        B2[Canonical Normalization]
        B3[Cross-Source Adjacency Mapping]
        B1 --> B2 --> B3
    end

    subgraph "Phase 3: Explain"
        C1[Why Connected? Rationale]
        C2[Additive Risk Scoring Matrix]
        C3[Local Grounded AI Copilot]
        C1 --> C2 --> C3
    end

    subgraph "Phase 4: Reconstruct"
        D1[Chronological Event Sequence]
        D2[Replay Playback Controls]
        D3[Synchronized Graph Path Tracking]
        D1 --> D2 --> D3
    end

    subgraph "Phase 5: Act"
        E1[Data Classification<br/>Evidence vs Derived vs Leads]
        E2[Statutory Form Generation<br/>Section 91 CrPC & Section 67C IT Act]
        E3[Formal Dossier Print/Export]
        E1 --> E2 --> E3
    end

    A3 --> B1
    B3 --> C1
    C3 --> D1
    D3 --> E1
```

---

## Detailed Step-by-Step Operations

### Step 1: Ingestion & Integrity Lock
Investigators import raw transaction logs, telecommunication CDR files, and chat records into the case Evidence Vault. The client-side WebCrypto engine generates cryptographic SHA-256 fingerprints before files are parsed, guaranteeing chain-of-custody compliance.

### Step 2: Entity Extraction & Normalization
The engine parses raw text to extract phone numbers, bank accounts, UPI handles, IMEIs, and IP addresses. Identifiers are converted into canonical formats, preventing deduplication failures caused by formatting variations (e.g. `+919876500099` vs `098765-00099`).

### Step 3: Graph Modeling & Explainable Rationale
Normalized entities are interconnected into directed network graphs. Every edge documents its exact evidentiary grounding. Investigators can click on any connection to invoke the **Why Connected?** inspection modal.

### Step 4: Investigation Replay
The investigator replays events chronologically. As events advance, the synchronized topology canvas highlights the participating source and target nodes, visually illustrating how pre-incident voice calls directly preceded subsequent financial transfers.

### Step 5: AI-Assisted Q&A & Copilot Grounding
The investigator queries the local AI Copilot for case summaries, money flow paths, and suspect profiles. All answers strictly cite verified evidence items. Every interaction is recorded in a tamper-evident query audit ledger.

### Step 6: Golden-Hour Brief Generation
During the critical initial hours of an inquiry ("The Golden Hour"), investigators generate the Golden-Hour Brief. The system computes transaction velocity across transit hops and automatically prepares statutory notices (such as Section 91 CrPC freeze orders for beneficiary banks).
