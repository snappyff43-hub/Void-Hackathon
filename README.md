# CYBERTRACE
> **From Scattered Evidence to Actionable Intelligence.**

CYBERTRACE is an AI-powered, unified cyber-fraud investigation and digital evidence correlation workstation engineered for cybercrime cells and financial intelligence investigators.

---

## Important Forensic & Privacy Notice
> **SYNTHETIC DATASET ONLY:** All cases, phone numbers, bank accounts, UPI IDs, IP addresses, IMEI numbers, and suspect records presented in this demonstration environment are **100% synthetic and generated for demonstration purposes**. No real personal, financial, credential, or law-enforcement data is contained within this repository.

---

## Core Capabilities

1. **Investigation Management:** Centralized case docket workspace (`CASE-2026-001`) with timeline tracking, status workflows, and priority management.
2. **Evidence Vault & Cryptographic Pipeline:** Multi-format file ingestion (CSV, JSON, EML, XLSX, TXT) with real-time browser WebCrypto SHA-256 hash calculation, input validation, directory traversal sanitization, and structured preview.
3. **Deterministic Entity Extraction:** Automated normalization of phones, bank accounts, UPI VPAs, IP addresses, IMEIs, and malware hashes into structured entities with explainable risk scoring.
4. **Cross-Source Correlation:** Multi-hop relationship detection connecting telecommunications, payment switches, device hardware, and chat records into a unified nexus with "Why Connected?" rationale.
5. **Interactive Fraud Network Graph:** Dynamic SVG network canvas with node classification, interactive dragging, zoom/pan controls, and one-click *"Trace Money Flow"* visual highlighting.
6. **Investigation Replay:** Chronological step-by-step playback with variable speeds (0.5x, 1x, 2x), scrub slider, synchronized graph tracking, and clickable evidence citations.
7. **Evidence-Grounded AI Copilot:** Fully local, deterministic forensic intelligence engine providing explainable answers with strict evidence citations, hallucination guards, and an automated audit trail. Zero external API keys or LLM dependencies.
8. **Golden-Hour Investigation Brief:** Executive briefing dossier highlighting fund velocity across transit hops, top high-risk suspects, and auto-generated statutory leads (Section 91 CrPC, Section 67C IT Act, CEIR IMEI check) with printer/PDF export.
9. **Privacy Protection & Security:** Active privacy display masking (e.g. `98765••••11`, `ACCT-••••4821`, `103.84.•••.••`), fault-isolated React Error Boundaries, and an interactive Security & Integrity Status panel.

---

## 3-Minute Hackathon Demonstration Flow

```text
Evidence Vault (SHA-256 Ingestion)
       ↓
Entity Directory & Correlation ("Why Connected?")
       ↓
Fraud Network Graph ("Trace Money Flow")
       ↓
Investigation Replay (Step-by-Step Playback)
       ↓
AI Copilot (Evidence-Grounded QA)
       ↓
Objective Findings (Provenance Citations)
       ↓
Golden-Hour Brief (Section 91 CrPC Print / Export)
```

---

## Local Development & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Quick Start
```bash
# Clone the repository
git clone https://github.com/your-org/cybertrace.git
cd cybertrace

# Install dependencies
npm install

# Start the development workstation
npm run dev
```

The application will be accessible at: `http://localhost:5173/`

### Production Build & Preview
```bash
# Compile TypeScript and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Technical Architecture

- **Frontend Core:** React 19, TypeScript (strict mode, zero type errors), Vite
- **Styling:** Vanilla CSS design tokens with dark forensic workstation aesthetic
- **Icons:** Lucide React
- **Security & Integrity:** Native Browser WebCrypto API (`crypto.subtle.digest`), React Error Boundaries, local tamper-evident audit ledger
- **AI Engine:** Deterministic, rule-grounded offline heuristics (air-gapped ready, zero external API keys)
