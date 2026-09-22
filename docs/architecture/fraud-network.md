# CYBERTRACE — Fraud Network Reconstruction

## Multi-Hop Fraud Topology

Modern cyber-fraud networks operate via structured layering techniques:
1. **Victim Inception:** Deception or phishing triggers fund departure from the victim's account.
2. **Primary Mule Ingestion:** Rapid intake into a primary mule account (`mule01@bank`).
3. **Intermediary Layering:** Rapid fragmentation or onward transit to secondary bridge accounts within minutes (`bridge02@bank`).
4. **Endpoint Cash-Out:** Settlement into termination accounts followed by physical ATM liquidation (`XXXX9344`).

```mermaid
graph LR
    subgraph "Demonstration Synthetic Fraud Nexus"
        Victim["Victim Payer<br/>victim.user@okaxis<br/>(Axis Bank)"]
        Mule["Primary Mule VPA<br/>mule01@bank<br/>(HDFC Bank • ACCT-4821)<br/>Risk: 95/100"]
        Bridge["Intermediary Node<br/>bridge02@bank<br/>(ICICI Bank • ACCT-7712)<br/>Risk: 84/100"]
        CashOut["Cash-Out Endpoint<br/>XXXX9344<br/>(CASH-ATM-09)<br/>Risk: 78/100"]
        
        Phone["Prepaid eSIM<br/>+91 98765 00099<br/>Risk: 96/100"]
        IMEI["Handset IMEI<br/>356938035643809<br/>Risk: 88/100"]
        IP["VPN Exit Node<br/>103.84.21.77<br/>Risk: 91/100"]
    end

    Victim -->|"₹75,000 (10:31:02)<br/>UPI Transfer"| Mule
    Mule -->|"₹68,000 (10:42:11)<br/>IMPS Hop (Delta: 6m 43s)"| Bridge
    Bridge -->|"₹62,000 (10:58:43)<br/>ATM Disbursement"| CashOut

    Phone -.->|"Linked 2FA Registration"| Mule
    Phone ---|"184s Pre-Incident Call"| Victim
    Phone ===|"Tower Authentication"| IMEI
    IMEI ===|"Session Endpoint"| IP
    
    classDef victimStyle fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef muleStyle fill:#450a0a,stroke:#ef4444,stroke-width:2px,color:#fef2f2;
    classDef bridgeStyle fill:#431407,stroke:#f97316,stroke-width:2px,color:#fff7ed;
    classDef terminalStyle fill:#3b0764,stroke:#a855f7,stroke-width:2px,color:#faf5ff;
    classDef hardwareStyle fill:#14532d,stroke:#22c55e,stroke-width:2px,color:#f0fdf4;

    class Victim victimStyle;
    class Mule muleStyle;
    class Bridge bridgeStyle;
    class CashOut terminalStyle;
    class Phone,IMEI,IP hardwareStyle;
```

---

## Interactive Visualization Engine
CYBERTRACE features a custom vector SVG rendering engine optimized for forensic clarity:
- **Spatial Node Layout:** Deterministic default coordinates arranged logically from left-to-right (Victim $\to$ Mule $\to$ Intermediary $\to$ Cash-Out), supplemented by circular layout algorithms for dynamically ingested nodes.
- **Interactive Dragging & Physics:** Direct node manipulation with drag-offset recalculation.
- **Trace Money Flow:** Instant high-contrast filtering that dims telecommunication and network nodes while spotlighting the financial transit path and retained commission differences.
- **Zoom & Pan Controls:** Smooth SVG viewBox matrix transformations allowing investigators to navigate dense multi-hop topologies.
