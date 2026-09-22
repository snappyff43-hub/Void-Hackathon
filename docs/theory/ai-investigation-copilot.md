# Technical Theory — Evidence-Grounded AI Copilot & Audit Trail

## 1. Concept
An Evidence-Grounded AI Copilot is an intelligent assistant designed to synthesize investigative evidence, answer case-specific questions, and propose actionable leads while remaining strictly bound to verified evidentiary data.

## 2. Why It Matters
Standard Large Language Models (LLMs) suffer from stochastic hallucinations—generating fabricated bank account numbers, non-existent phone calls, or inaccurate timestamps. In a cybercrime investigation, an AI hallucination could lead to unlawful asset seizures or flawed search warrants. A digital forensics copilot must never invent facts.

## 3. How CYBERTRACE Uses It
CYBERTRACE enforces four safety invariants:
1. **Zero External Network Egress:** Operates 100% locally with zero external API calls or third-party telemetry, ensuring complete confidentiality for law-enforcement dockets.
2. **Explicit Grounding & Citations:** Every factual assertion cites the exact evidence item (`evd-001`), filename (`BANK_TRANSACTIONS.csv`), and row number.
3. **Safe Fallback Handling:** If an investigator asks a query not supported by the active evidence docket, the copilot explicitly responds:
   > *"Insufficient evidence in the current investigation dataset to reliably answer this query. To preserve forensic integrity, the AI Copilot does not extrapolate or generate ungrounded conclusions."*
4. **Tamper-Evident Audit Trail:** Every query, answer snippet, cited evidence ID, and confidence level is logged chronologically in an immutable ledger.

## 4. Query Handling Taxonomy
- **Case Summary:** Reconstructs the 3-layer velocity model and case metadata.
- **Money Flow Inquiries:** Traces the ₹75,000 victim debit down to the ₹62,000 terminal cash-out.
- **Suspect Inquiries:** Surfaces high-risk entities with corroborating factors.
- **Relationship Evidence:** Explains the physical or digital basis connecting two entities.
- **Pre-Incident Analysis:** Reconstructs events preceding the first transaction.
- **Next Steps & Leads:** Proposes statutory actions under Section 91 CrPC and Section 67C IT Act.

## 5. Technical Implementation
Located in [src/services/copilotService.ts](file:///d:/PERCEPTOMINDS/src/services/copilotService.ts) and [src/services/copilotAuditService.ts](file:///d:/PERCEPTOMINDS/src/services/copilotAuditService.ts).
