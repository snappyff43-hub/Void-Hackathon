import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import type { Entity, EntityRelationship } from '../../types';

interface NetworkGraphCanvasProps {
  entities: Entity[];
  relationships: EntityRelationship[];
  searchQuery?: string;
  selectedEntityType?: string;
  selectedRisk?: string;
  selectedRelType?: string;
  isMoneyFlowActive?: boolean;
  highlightedNodeIds?: string[];
  highlightedEdgeIds?: string[];
  onSelectNode: (entity: Entity) => void;
  onSelectEdge: (rel: EntityRelationship) => void;
  height?: string | number;
}

interface NodePosition {
  x: number;
  y: number;
}

const DEFAULT_POSITIONS: Record<string, NodePosition> = {
  'ent-001': { x: 120, y: 130 }, // Victim Phone
  'ent-002': { x: 120, y: 320 }, // Victim UPI
  'ent-003': { x: 360, y: 320 }, // Mule Account
  'ent-008': { x: 360, y: 130 }, // Mule Phone
  'ent-005': { x: 600, y: 320 }, // Intermediary
  'ent-009': { x: 600, y: 130 }, // IMEI Device
  'ent-007': { x: 840, y: 320 }, // Cash-out Account
  'ent-010': { x: 840, y: 130 }, // IP Address
};

// Colors by Entity Type
const ENTITY_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  PHONE: { bg: 'rgba(56, 189, 248, 0.12)', border: '#38bdf8', icon: '#38bdf8' },
  UPI_VPA: { bg: 'rgba(251, 191, 36, 0.12)', border: '#fbbf24', icon: '#fbbf24' },
  BANK_ACCOUNT: { bg: 'rgba(245, 158, 11, 0.12)', border: '#f59e0b', icon: '#f59e0b' },
  DEVICE: { bg: 'rgba(167, 139, 250, 0.12)', border: '#a78bfa', icon: '#a78bfa' },
  IMEI: { bg: 'rgba(167, 139, 250, 0.12)', border: '#a78bfa', icon: '#a78bfa' },
  IP_ADDRESS: { bg: 'rgba(52, 211, 153, 0.12)', border: '#34d399', icon: '#34d399' },
  EMAIL: { bg: 'rgba(192, 132, 252, 0.12)', border: '#c084fc', icon: '#c084fc' },
  PERSON: { bg: 'rgba(244, 63, 94, 0.12)', border: '#f43f5e', icon: '#f43f5e' },
  APK_HASH: { bg: 'rgba(239, 68, 68, 0.12)', border: '#ef4444', icon: '#ef4444' },
  TRANSACTION: { bg: 'rgba(251, 113, 133, 0.12)', border: '#fb7185', icon: '#fb7185' },
};


function getRiskColor(risk: number): string {
  if (risk >= 80) return 'var(--status-critical-text)';
  if (risk >= 60) return '#fb923c';
  if (risk >= 30) return '#fbbf24';
  return '#34d399';
}

export const NetworkGraphCanvas: React.FC<NetworkGraphCanvasProps> = ({
  entities,
  relationships,
  searchQuery = '',
  selectedEntityType = 'ALL',
  selectedRisk = 'ALL',
  selectedRelType = 'ALL',
  isMoneyFlowActive = false,
  highlightedNodeIds = [],
  highlightedEdgeIds = [],
  onSelectNode,
  onSelectEdge,
  height = '520px',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Pan & Zoom State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 30, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Node Positions (stateful for dragging)
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});

  // Initialize or layout node positions
  useEffect(() => {
    setNodePositions((prev) => {
      const next = { ...prev };
      entities.forEach((ent, idx) => {
        if (!next[ent.id]) {
          if (DEFAULT_POSITIONS[ent.id]) {
            next[ent.id] = { ...DEFAULT_POSITIONS[ent.id] };
          } else {
            // Dynamic circular layout for new/extra nodes
            const angle = (idx / Math.max(entities.length, 1)) * 2 * Math.PI;
            const radius = 220;
            const cx = 480;
            const cy = 230;
            next[ent.id] = {
              x: Math.round(cx + radius * Math.cos(angle)),
              y: Math.round(cy + radius * Math.sin(angle)),
            };
          }
        }
      });
      return next;
    });
  }, [entities]);

  // Filtering Logic
  const filteredEntities = useMemo(() => {
    return entities.filter((ent) => {
      if (selectedEntityType !== 'ALL') {
        if (selectedEntityType === 'BANK' && ent.type !== 'BANK_ACCOUNT') return false;
        if (selectedEntityType === 'UPI' && ent.type !== 'UPI_VPA') return false;
        if (selectedEntityType !== 'BANK' && selectedEntityType !== 'UPI' && ent.type !== selectedEntityType) {
          return false;
        }
      }
      if (selectedRisk !== 'ALL') {
        if (selectedRisk === 'CRITICAL' && ent.riskScore < 80) return false;
        if (selectedRisk === 'HIGH' && (ent.riskScore < 60 || ent.riskScore >= 80)) return false;
        if (selectedRisk === 'MEDIUM' && (ent.riskScore < 30 || ent.riskScore >= 60)) return false;
        if (selectedRisk === 'LOW' && ent.riskScore >= 30) return false;
      }
      return true;
    });
  }, [entities, selectedEntityType, selectedRisk]);

  const filteredNodeIdSet = useMemo(() => new Set(filteredEntities.map((e) => e.id)), [filteredEntities]);

  const filteredRelationships = useMemo(() => {
    return relationships.filter((rel) => {
      // Must connect visible nodes
      if (!filteredNodeIdSet.has(rel.sourceEntityId) || !filteredNodeIdSet.has(rel.targetEntityId)) {
        return false;
      }
      if (selectedRelType !== 'ALL' && rel.relationshipType !== selectedRelType) {
        return false;
      }
      return true;
    });
  }, [relationships, filteredNodeIdSet, selectedRelType]);

  // Search & Match Calculation
  const searchMatchedNodeIds = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return new Set<string>();
    const matches = new Set<string>();
    entities.forEach((e) => {
      if (
        e.normalizedValue.toLowerCase().includes(q) ||
        e.value.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q) ||
        (e.metadata && Object.values(e.metadata).some((v) => v.toLowerCase().includes(q)))
      ) {
        matches.add(e.id);
        // Include direct 1-hop connections
        relationships.forEach((rel) => {
          if (rel.sourceEntityId === e.id) matches.add(rel.targetEntityId);
          if (rel.targetEntityId === e.id) matches.add(rel.sourceEntityId);
        });
      }
    });
    return matches;
  }, [searchQuery, entities, relationships]);

  // Money Flow Path IDs (Victim UPI -> Mule UPI -> Bridge Bank -> Cash-out)
  const moneyFlowEntityIds = useMemo(() => new Set(['ent-002', 'ent-003', 'ent-005', 'ent-007']), []);
  const moneyFlowEdgeIds = useMemo(() => new Set(['rel-001', 'rel-002', 'rel-003']), []);

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.4));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 30, y: 30 });
  };

  // Panning & Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else if (draggingNodeId) {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const rawX = (e.clientX - rect.left - pan.x) / zoom;
      const rawY = (e.clientY - rect.top - pan.y) / zoom;
      setNodePositions((prev) => ({
        ...prev,
        [draggingNodeId]: {
          x: Math.round(rawX - dragOffset.x),
          y: Math.round(rawY - dragOffset.y),
        },
      }));
    }
  }, [isPanning, panStart, draggingNodeId, pan, zoom, dragOffset]);

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const startDragNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const pos = nodePositions[nodeId] || { x: 0, y: 0 };
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const cursorSvgX = (e.clientX - rect.left - pan.x) / zoom;
    const cursorSvgY = (e.clientY - rect.top - pan.y) / zoom;
    setDraggingNodeId(nodeId);
    setDragOffset({
      x: cursorSvgX - pos.x,
      y: cursorSvgY - pos.y,
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        backgroundColor: '#06080d',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Zoom / Pan Floating Controls */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 10,
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        <button
          onClick={handleZoomIn}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={handleZoomOut}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={handleResetZoom}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Reset View"
          aria-label="Reset View"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Grid Pattern Background & SVG Graph */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ cursor: isPanning ? 'grabbing' : 'grab', display: 'block' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
          </pattern>

          {/* Arrow Markers for Directed Edges */}
          <marker id="arrow-transferred" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#fb7185" />
          </marker>
          <marker id="arrow-transferred-active" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
          </marker>
          <marker id="arrow-associated" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#a78bfa" />
          </marker>
          <marker id="arrow-comm" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#38bdf8" />
          </marker>
          <marker id="arrow-default" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#64748b" />
          </marker>
        </defs>

        {/* Background Grid */}
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />

        {/* Canvas World Transform */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* =================================================================
              1. RENDER EDGES (RELATIONSHIPS)
              ================================================================= */}
          {filteredRelationships.map((rel) => {
            const srcPos = nodePositions[rel.sourceEntityId];
            const tgtPos = nodePositions[rel.targetEntityId];
            if (!srcPos || !tgtPos) return null;

            // Determine Highlight / Dimming
            const isMoneyFlowEdge = isMoneyFlowActive && moneyFlowEdgeIds.has(rel.id);
            const isExplicitlyHighlighted = highlightedEdgeIds.includes(rel.id);
            const isSearchHighlighted =
              searchMatchedNodeIds.size > 0 &&
              searchMatchedNodeIds.has(rel.sourceEntityId) &&
              searchMatchedNodeIds.has(rel.targetEntityId);

            const isEdgeDimmed =
              (isMoneyFlowActive && !isMoneyFlowEdge) ||
              (searchMatchedNodeIds.size > 0 && !isSearchHighlighted) ||
              (highlightedEdgeIds.length > 0 && !isExplicitlyHighlighted);

            const isHighlighted = isMoneyFlowEdge || isExplicitlyHighlighted || isSearchHighlighted;

            // Styling based on Relationship Type
            let strokeColor = '#64748b';
            let strokeDasharray = undefined;
            let markerEnd = 'url(#arrow-default)';

            if (rel.relationshipType === 'TRANSFERRED_TO') {
              strokeColor = isHighlighted ? '#f43f5e' : '#fb7185';
              markerEnd = isHighlighted ? 'url(#arrow-transferred-active)' : 'url(#arrow-transferred)';
            } else if (rel.relationshipType === 'ASSOCIATED_WITH') {
              strokeColor = isHighlighted ? '#c084fc' : '#a78bfa';
              strokeDasharray = '6 4';
              markerEnd = 'url(#arrow-associated)';
            } else if (rel.relationshipType === 'COMMUNICATION_LINK') {
              strokeColor = isHighlighted ? '#0284c7' : '#38bdf8';
              strokeDasharray = '3 3';
              markerEnd = 'url(#arrow-comm)';
            }

            const midX = (srcPos.x + tgtPos.x) / 2;
            const midY = (srcPos.y + tgtPos.y) / 2;

            return (
              <g
                key={rel.id}
                style={{
                  opacity: isEdgeDimmed ? 0.22 : 1,
                  transition: 'opacity 0.2s ease',
                  cursor: 'pointer',
                }}
                onClick={() => onSelectEdge(rel)}
              >
                {/* Thick invisible line for easy clicking */}
                <line
                  x1={srcPos.x}
                  y1={srcPos.y}
                  x2={tgtPos.x}
                  y2={tgtPos.y}
                  stroke="transparent"
                  strokeWidth="18"
                />

                {/* Visible Edge Line */}
                <line
                  x1={srcPos.x}
                  y1={srcPos.y}
                  x2={tgtPos.x}
                  y2={tgtPos.y}
                  stroke={strokeColor}
                  strokeWidth={isHighlighted ? 3 : 1.8}
                  strokeDasharray={strokeDasharray}
                  markerEnd={markerEnd}
                />

                {/* Edge Badge (Amount or Relationship Tag) */}
                <g transform={`translate(${midX}, ${midY})`}>
                  {rel.amount ? (
                    <g>
                      <rect
                        x="-38"
                        y="-11"
                        width="76"
                        height="20"
                        rx="10"
                        fill="#0c1017"
                        stroke={isHighlighted ? '#f43f5e' : '#fb7185'}
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                        fontFamily="var(--font-mono)"
                        fontWeight="600"
                      >
                        {rel.amount}
                      </text>
                    </g>
                  ) : (
                    <g>
                      <rect
                        x="-48"
                        y="-9"
                        width="96"
                        height="18"
                        rx="4"
                        fill="#0b0f19"
                        stroke={strokeColor}
                        strokeWidth="0.8"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill="var(--text-secondary)"
                        fontSize="8.5"
                        fontFamily="var(--font-mono)"
                      >
                        {rel.relationshipType}
                      </text>
                    </g>
                  )}
                </g>
              </g>
            );
          })}

          {/* =================================================================
              2. RENDER NODES (ENTITIES)
              ================================================================= */}
          {filteredEntities.map((ent) => {
            const pos = nodePositions[ent.id];
            if (!pos) return null;

            const isMoneyFlowNode = isMoneyFlowActive && moneyFlowEntityIds.has(ent.id);
            const isExplicitlyHighlighted = highlightedNodeIds.includes(ent.id);
            const isSearchHighlighted = searchMatchedNodeIds.has(ent.id);

            const isNodeDimmed =
              (isMoneyFlowActive && !isMoneyFlowNode) ||
              (searchMatchedNodeIds.size > 0 && !isSearchHighlighted) ||
              (highlightedNodeIds.length > 0 && !isExplicitlyHighlighted);

            const isHighlighted = isMoneyFlowNode || isExplicitlyHighlighted || isSearchHighlighted;

            const theme = ENTITY_COLORS[ent.type] || {
              bg: 'rgba(124, 92, 252, 0.12)',
              border: '#7c5cfc',
              icon: '#7c5cfc',
            };

            const riskColor = getRiskColor(ent.riskScore);
            const nodeWidth = 170;
            const nodeHeight = 54;
            const halfW = nodeWidth / 2;
            const halfH = nodeHeight / 2;

            return (
              <g
                key={ent.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                style={{
                  opacity: isNodeDimmed ? 0.25 : 1,
                  transition: 'opacity 0.2s ease',
                  cursor: draggingNodeId === ent.id ? 'grabbing' : 'pointer',
                }}
                onMouseDown={(e) => startDragNode(e, ent.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(ent);
                }}
              >
                {/* Highlight Glow Outer Ring */}
                {isHighlighted && (
                  <rect
                    x={-halfW - 4}
                    y={-halfH - 4}
                    width={nodeWidth + 8}
                    height={nodeHeight + 8}
                    rx="10"
                    fill="none"
                    stroke={isMoneyFlowNode ? '#f43f5e' : 'var(--accent-primary)'}
                    strokeWidth="2.5"
                    strokeOpacity="0.8"
                  />
                )}

                {/* Node Body Card */}
                <rect
                  x={-halfW}
                  y={-halfH}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="6"
                  fill="#0c1017"
                  stroke={isHighlighted ? (isMoneyFlowNode ? '#f43f5e' : 'var(--accent-primary)') : theme.border}
                  strokeWidth={isHighlighted ? '1.8' : '1'}
                />

                {/* Top Type Stripe & Label */}
                <rect
                  x={-halfW}
                  y={-halfH}
                  width={nodeWidth}
                  height="20"
                  rx="5"
                  fill={theme.bg}
                />
                <rect
                  x={-halfW}
                  y={-halfH + 16}
                  width={nodeWidth}
                  height="4"
                  fill={theme.bg}
                />

                {/* Entity Type Text */}
                <text
                  x={-halfW + 10}
                  y={-halfH + 13}
                  fill={theme.icon}
                  fontSize="9.5"
                  fontWeight="700"
                  fontFamily="var(--font-sans)"
                  letterSpacing="0.04em"
                >
                  {ent.type.replace('_', ' ')}
                </text>

                {/* Risk Score Pill on Top Right of Node */}
                <g transform={`translate(${halfW - 42}, ${-halfH + 4})`}>
                  <rect x="0" y="0" width="34" height="13" rx="3" fill="#000000" stroke={riskColor} strokeWidth="0.8" />
                  <text
                    x="17"
                    y="9.5"
                    textAnchor="middle"
                    fill={riskColor}
                    fontSize="8.5"
                    fontWeight="700"
                    fontFamily="var(--font-mono)"
                  >
                    R:{ent.riskScore}
                  </text>
                </g>

                {/* Normalized Identifier Text */}
                <text
                  x={-halfW + 10}
                  y={-halfH + 37}
                  fill="#f1f5f9"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                  fontWeight="600"
                >
                  {ent.normalizedValue.length > 20
                    ? ent.normalizedValue.substring(0, 18) + '...'
                    : ent.normalizedValue}
                </text>

                {/* Confidence & Case Link Tag */}
                <text
                  x={-halfW + 10}
                  y={-halfH + 48}
                  fill="var(--text-dim)"
                  fontSize="8"
                  fontFamily="var(--font-mono)"
                >
                  Conf: {ent.confidence}% • {ent.sourceEvidenceIds.length} Evd
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
