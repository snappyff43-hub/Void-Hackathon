# Technical Theory — Graph-Based Fraud Investigation

## 1. Concept
Graph-Based Fraud Analysis models financial ecosystems as networks composed of **Nodes** (representing people, phone numbers, bank accounts, UPI handles, devices, and IP addresses) and **Edges** (representing directed financial transfers, hardware associations, or communication links).

## 2. Why It Matters
Relational tables and flat spreadsheets struggle to identify multi-hop transaction layering. An investigator looking at a single row in an Excel sheet sees only a debit from Account A to Account B. A graph database or network topology immediately exposes:
- **Layering Depth:** How many hops funds traverse before cash-out.
- **Velocity Trajectory:** The speed at which funds move from layer to layer.
- **Nexus Hubs:** High-degree centrality nodes (such as a single device IMEI or phone number shared by 10 different mule accounts).

## 3. How CYBERTRACE Uses It
CYBERTRACE reconstructs fraud networks into directed multigraphs with full evidentiary backing:
- **Financial Flow Subgraph:** Isolates the monetary path from victim to liquidation terminal.
- **Infrastructure Subgraph:** Overlays telecom and device nodes onto financial entities to expose syndicate operators.
- **Trace Money Flow Algorithm:** High-contrast topological filtering that isolates transaction edges and dims unrelated nodes.

## 4. Example: The 3-Hop Money Transit Model
```text
(Victim: victim.user@okaxis)
       │
       ▼ [₹75,000 | 10:31:02 | UPI Transfer]
(Primary Mule: mule01@bank • ACCT-4821)
       │
       ▼ [₹68,000 | 10:42:11 | IMPS Layering • Delta: 6m 43s]
(Intermediary: bridge02@bank • ACCT-7712)
       │
       ▼ [₹62,000 | 10:58:43 | ATM Terminal Disbursement]
(Cash-Out Endpoint: XXXX9344 • CASH-ATM-09)
```

## 5. Technical Implementation
- Located in [src/components/network/NetworkGraphCanvas.tsx](file:///d:/PERCEPTOMINDS/src/components/network/NetworkGraphCanvas.tsx).
- Built using high-performance, responsive vector SVG components with dynamic Cartesian positioning, drag-and-drop mechanics, and custom arrow markers representing directed transaction flows.
