# Technical Theory — Explainable Risk & Confidence Scoring

## 1. Concept
In forensic software, risk scoring is a quantitative assessment of an entity's likelihood of belonging to a fraudulent syndicate. Confidence scoring reflects the mathematical certainty of the evidentiary data supporting that assessment.

## 2. Why It Matters
Black-box AI models that output an arbitrary percentage (e.g. *"94% Risk"*) without transparent mathematical factors cannot withstand legal cross-examination. Investigators need to explain to a magistrate or legal counsel exactly **why** a bank account was frozen. Explainability transforms algorithmic output into actionable evidence.

## 3. How CYBERTRACE Uses It
CYBERTRACE uses an **additive deterministic heuristic matrix**. Each contributing risk factor is accompanied by an explicit score increment and a plain-text forensic explanation.

### Additive Factor Breakdown
- **Cross-Source Multi-File Appearance (+25 Points):** Entity appears across multiple independent forensic artifacts (e.g. CDR and UPI logs).
- **Rapid Transaction Routing (+20 Points):** Entity executes outward fund transit in under 10 minutes from receipt.
- **Shared Hardware Nexus (+20 Points):** Entity shares an IMEI handset with multiple other identities.
- **Shared Infrastructure Nexus (+15 Points):** Entity accesses systems from known VPN exit nodes or datacenter IP subnets.
- **High Transaction Velocity (+10 Points):** Entity appears in high-frequency structured transaction dockets.
- **Communication Correlation (+10 Points):** Entity engaged in voice contact with the victim immediately prior to fund transfer.

## 4. Example Assessment
Entity `ent-008` (`+91 98765 00099`):
- Factor 1: Cross-source appearance across 3 evidence files (+25)
- Factor 2: Shared device nexus with IMEI 356938035643809 (+20)
- Factor 3: Shared IP infrastructure with VPN exit 103.84.21.77 (+15)
- Factor 4: Outgoing voice contact to victim 9 minutes prior to transfer (+10)
- **Total Risk Score:** $70 \to 96/100$ (Critical)
- **Confidence Rating:** $97\%$ (Supported by 3 separate evidence dockets)

## 5. Technical Implementation
Located in [src/services/intelligenceService.ts](file:///d:/PERCEPTOMINDS/src/services/intelligenceService.ts):
```typescript
export function calculateRisk(
  entityType: EntityType,
  normalizedValue: string,
  evidenceCount: number,
  isMuleOrIntermediary: boolean,
  hasSharedDeviceOrIP: boolean
): { score: number; factors: RiskFactor[] } { ... }
```
