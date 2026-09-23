# CYBERTRACE — 3-Minute Hackathon Demonstration Script

> 🎥 **Official Demo Video:** [**▶ Watch the Full CYBERTRACE Demo on Google Drive**](https://drive.google.com/file/d/1dBlu-0WFrTRQxKt5yXT18GfEw4t4wpex/view?usp=drivesdk)

## Objective
Demonstrate how CYBERTRACE solves evidence fragmentation by transforming scattered, unlinked files into actionable forensic intelligence within 3 minutes.

---

## Presentation Outline

| Timestamp | Phase | Screen / Feature | Key Talking Points & Actions |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:30** | **The Problem & Inception** | **Dashboard** | • Present case `CASE-2026-001` (UPI Financial Fraud, ₹75,000 loss).<br/>• Explain the investigator's dilemma: disjointed bank statements, CDR logs, and chat dumps.<br/>• Click into the investigation docket. |
| **0:30 – 1:00** | **Integrity & Ingestion** | **Evidence Vault** | • Show 4 ingested artifacts (`evd-001` through `evd-004`).<br/>• Highlight client-side **SHA-256 Verified** badges guaranteeing chain of custody.<br/>• Open safe preview modal to show parsed CSV/JSON structures.<br/>• Explain input validation, empty file blocks, and directory traversal stripping. |
| **1:00 – 1:40** | **Correlation & Topology** | **Entities & Network Graph** | • Switch to **Entities**; showcase the **Privacy Masking** toggle protecting PII (`98765••••11`).<br/>• Switch to **Network**; show the multi-hop fraud topology.<br/>• Click **[ TRACE MONEY FLOW ]** to isolate the 3-hop transit path from victim to cash-out endpoint.<br/>• Click an edge to open **Why Connected?** showing exact row citations. |
| **1:40 – 2:20** | **Timeline & Copilot** | **Replay & Copilot** | • Switch to **Timeline**; click **Play** to show sequential event execution.<br/>• Emphasize the pre-incident voice call (10:27) immediately followed by the UPI transfer (10:31).<br/>• Switch to **Copilot**; submit: *"Show the complete money flow."*<br/>• Show grounded response, citations, and the tamper-evident audit ledger. |
| **2:20 – 3:00** | **Actionable Intelligence** | **Golden-Hour Brief** | • Open **Reports**; present the **Golden-Hour Investigation Brief**.<br/>• Highlight the rapid 6-minute hop velocity and automated statutory leads.<br/>• Point out ready-to-dispatch **Section 91 CrPC** notice for ATM CCTV and **Section 67C IT Act** preservation.<br/>• Click **Print / Export** to show the professional court-ready PDF view. |

---

## Key Talking Points for Judges

1. **Deterministic, Not Generative:** The system does not invent connections or hallucinate bank accounts. Every edge is grounded in raw evidence rows.
2. **Air-Gapped & Secure:** Operates 100% locally with zero external API dependencies, keeping sensitive law-enforcement data confidential.
3. **Action-Oriented:** The Golden-Hour Brief automatically formulates statutory notices before stolen funds are liquidated at physical ATMs.
