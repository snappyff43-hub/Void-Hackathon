import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  FileText,
  Sparkles,
} from 'lucide-react';
import type { TimelineEvent, Entity, EntityRelationship, EvidenceItem, Investigation } from '../../types';
import { Button } from '../ui/Button';
import { Badge, PriorityBadge } from '../ui/Badge';
import { NetworkGraphCanvas } from '../network/NetworkGraphCanvas';
import { MoneyFlowSummaryPanel } from '../network/MoneyFlowSummaryPanel';
import { TimelineEventDetailModal } from './TimelineEventDetailModal';
import { EvidenceDetailModal } from '../evidence/EvidenceDetailModal';
import { EntityDetailModal } from '../entities/EntityDetailModal';
import { WhyConnectedModal } from '../entities/WhyConnectedModal';

interface InvestigationReplayViewProps {
  timelineEvents: TimelineEvent[];
  entities: Entity[];
  relationships: EntityRelationship[];
  evidenceItems: EvidenceItem[];
  investigations?: Investigation[];
  onSelectEntity?: (entity: Entity) => void;
  onAskAI?: (query: string) => void;
}

export const InvestigationReplayView: React.FC<InvestigationReplayViewProps> = ({
  timelineEvents,
  entities,
  relationships,
  evidenceItems,
  investigations = [],
  onSelectEntity,
  onAskAI,
}) => {
  // Replay State
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5, 1, 2

  // Modals
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [selectedEvidenceItem, setSelectedEvidenceItem] = useState<EvidenceItem | null>(null);
  const [selectedNodeEntity, setSelectedNodeEntity] = useState<Entity | null>(null);
  const [selectedEdgeRel, setSelectedEdgeRel] = useState<EntityRelationship | null>(null);

  const activeEvent = timelineEvents[currentEventIndex] || null;

  // Auto-advance replay timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isPlaying && timelineEvents.length > 0) {
      const intervalMs = Math.round(2800 / playbackSpeed);
      timer = setInterval(() => {
        setCurrentEventIndex((prev) => {
          if (prev >= timelineEvents.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, playbackSpeed, timelineEvents.length]);

  // Match current active event to graph nodes & edges
  const { highlightedNodeIds, highlightedEdgeIds } = useMemo(() => {
    if (!activeEvent) return { highlightedNodeIds: [], highlightedEdgeIds: [] };

    const nodeIds: string[] = [];
    const edgeIds: string[] = [];

    // Find source node
    const src = entities.find(
      (e) =>
        e.normalizedValue.toLowerCase() === activeEvent.sourceEntity.toLowerCase() ||
        e.value.toLowerCase().includes(activeEvent.sourceEntity.toLowerCase()) ||
        activeEvent.sourceEntity.toLowerCase().includes(e.normalizedValue.toLowerCase())
    );
    if (src) nodeIds.push(src.id);

    // Find target node
    const tgt = entities.find(
      (e) =>
        e.normalizedValue.toLowerCase() === activeEvent.targetEntity.toLowerCase() ||
        e.value.toLowerCase().includes(activeEvent.targetEntity.toLowerCase()) ||
        activeEvent.targetEntity.toLowerCase().includes(e.normalizedValue.toLowerCase())
    );
    if (tgt) nodeIds.push(tgt.id);

    // Find matching relationship edge
    if (src && tgt) {
      const rel = relationships.find(
        (r) =>
          (r.sourceEntityId === src.id && r.targetEntityId === tgt.id) ||
          (r.sourceEntityId === tgt.id && r.targetEntityId === src.id)
      );
      if (rel) edgeIds.push(rel.id);
    }

    return { highlightedNodeIds: nodeIds, highlightedEdgeIds: edgeIds };
  }, [activeEvent, entities, relationships]);

  // Replay Control Handlers
  const handleFirst = () => {
    setIsPlaying(false);
    setCurrentEventIndex(0);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentEventIndex((prev) => Math.max(0, prev - 1));
  };

  const handleTogglePlay = () => {
    if (!isPlaying && currentEventIndex >= timelineEvents.length - 1) {
      setCurrentEventIndex(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentEventIndex((prev) => Math.min(timelineEvents.length - 1, prev + 1));
  };

  const handleLast = () => {
    setIsPlaying(false);
    setCurrentEventIndex(timelineEvents.length - 1);
  };

  const handleOpenEvidence = (item: EvidenceItem) => {
    setSelectedEvidenceItem(item);
  };

  // Find primary investigation for header
  const primaryCase = investigations[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* 13. INVESTIGATION SUMMARY HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '16px 20px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                backgroundColor: 'rgba(124, 92, 252, 0.12)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(124, 92, 252, 0.25)',
              }}
            >
              {primaryCase?.caseNumber || 'CASE-2026-001'}
            </span>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Investigation Replay
            </h1>
            <PriorityBadge priority="HIGH" />
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
            Chronological reconstruction of evidence-linked activity across telecommunications, banking switches, and endpoint telemetry.
          </p>
        </div>

        {/* Stats Metrics Badge Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Events
            </span>
            <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {timelineEvents.length}
            </div>
          </div>
          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Entities
            </span>
            <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {entities.length}
            </div>
          </div>
          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Correlations
            </span>
            <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {relationships.length}
            </div>
          </div>

          {onAskAI && (
            <Button
              variant="outline"
              size="sm"
              icon={<Sparkles size={13} style={{ color: 'var(--accent-primary)' }} />}
              onClick={() => onAskAI('What happened immediately before the first transfer and what is the sequence of events?')}
            >
              Ask AI About Timeline
            </Button>
          )}
        </div>
      </div>

      {/* 14. MONEY FLOW SUMMARY PANEL */}
      <MoneyFlowSummaryPanel active={true} />

      {/* 10. REPLAY CONTROLS TOOLBAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 18px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Playback Step Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleFirst}
            disabled={currentEventIndex === 0}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: currentEventIndex === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              cursor: currentEventIndex === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="First Event (|<)"
          >
            <SkipBack size={14} />
          </button>

          <button
            onClick={handlePrev}
            disabled={currentEventIndex === 0}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: currentEventIndex === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              cursor: currentEventIndex === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Previous Event (<)"
          >
            <ChevronLeft size={16} />
          </button>

          <Button
            variant={isPlaying ? 'primary' : 'outline'}
            size="sm"
            icon={isPlaying ? <Pause size={14} /> : <Play size={14} />}
            onClick={handleTogglePlay}
            style={{ minWidth: '96px', justifyContent: 'center' }}
          >
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </Button>

          <button
            onClick={handleNext}
            disabled={currentEventIndex >= timelineEvents.length - 1}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: currentEventIndex >= timelineEvents.length - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              cursor: currentEventIndex >= timelineEvents.length - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Next Event (>)"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={handleLast}
            disabled={currentEventIndex >= timelineEvents.length - 1}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: currentEventIndex >= timelineEvents.length - 1 ? 'var(--text-muted)' : 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              cursor: currentEventIndex >= timelineEvents.length - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Last Event (>|)"
          >
            <SkipForward size={14} />
          </button>
        </div>

        {/* Current Event Index Progress Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            Current Event: <strong style={{ color: 'var(--accent-primary)' }}>{currentEventIndex + 1}</strong> / {timelineEvents.length}
          </span>
          <div
            style={{
              width: '120px',
              height: '6px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '3px',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: `${((currentEventIndex + 1) / Math.max(timelineEvents.length, 1)) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--accent-primary)',
                transition: 'width 0.25s ease',
              }}
            />
          </div>
        </div>

        {/* Playback Speed Multipliers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginRight: '4px' }}>
            Speed:
          </span>
          {[0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              style={{
                padding: '3px 8px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: playbackSpeed === spd ? 700 : 500,
                backgroundColor: playbackSpeed === spd ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: playbackSpeed === spd ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${playbackSpeed === spd ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* 11. SYNCHRONIZED REPLAY + GRAPH SPLIT WORKSPACE */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 420px) 1fr',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Chronological Event Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Chronological Incident Stream
            </span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {timelineEvents.length} Verified Events
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              maxHeight: '560px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {timelineEvents.map((evt, idx) => {
              const isActive = idx === currentEventIndex;
              const linkedEvd = evidenceItems.find((e) => e.id === evt.evidenceId);

              return (
                <div
                  key={evt.id}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentEventIndex(idx);
                  }}
                  style={{
                    padding: '12px 14px',
                    backgroundColor: isActive ? 'rgba(124, 92, 252, 0.08)' : 'var(--bg-surface)',
                    border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    boxShadow: isActive ? '0 0 12px rgba(124, 92, 252, 0.18)' : 'none',
                  }}
                >
                  {/* Active Replay Step Marker */}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '0',
                        top: '0',
                        bottom: '0',
                        width: '4px',
                        backgroundColor: 'var(--accent-primary)',
                        borderTopLeftRadius: 'var(--radius-md)',
                        borderBottomLeftRadius: 'var(--radius-md)',
                      }}
                    />
                  )}

                  {/* Event Top Bar: Time + Type + Amount */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-dim)' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {evt.timestamp}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {evt.amount && (
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: '#fb7185',
                            backgroundColor: 'rgba(251, 113, 133, 0.12)',
                            padding: '1px 6px',
                            borderRadius: '3px',
                          }}
                        >
                          {evt.amount}
                        </span>
                      )}
                      <Badge variant={isActive ? 'accent' : 'default'} size="sm">
                        {evt.eventType}
                      </Badge>
                    </div>
                  </div>

                  {/* Entity Transition: Source -> Target */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{evt.sourceEntity}</span>
                    <ArrowRight size={13} style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-dim)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{evt.targetEntity}</span>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                    {evt.description}
                  </p>

                  {/* Footer: Evidence Citation + Inspect */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (linkedEvd) {
                          setSelectedEvidenceItem(linkedEvd);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.7rem',
                        color: linkedEvd ? 'var(--accent-primary)' : 'var(--text-dim)',
                        background: 'transparent',
                        border: 'none',
                        cursor: linkedEvd ? 'pointer' : 'default',
                        padding: 0,
                        textDecoration: linkedEvd ? 'underline' : 'none',
                      }}
                      title={linkedEvd ? `View Evidence: ${linkedEvd.fileName}` : undefined}
                    >
                      <FileText size={11} />
                      <span>{linkedEvd ? linkedEvd.fileName : evt.evidenceId}</span>
                    </button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(evt);
                      }}
                      style={{ padding: '2px 6px', height: '22px', fontSize: '0.7rem' }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Synchronized Interactive Network Graph */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Synchronized Fraud Nexus Visualization
            </span>
            {activeEvent && (
              <span
                style={{
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-primary)',
                  backgroundColor: 'rgba(124, 92, 252, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                Tracking: {activeEvent.sourceEntity} → {activeEvent.targetEntity}
              </span>
            )}
          </div>

          <NetworkGraphCanvas
            entities={entities}
            relationships={relationships}
            highlightedNodeIds={highlightedNodeIds}
            highlightedEdgeIds={highlightedEdgeIds}
            onSelectNode={(node) => {
              setSelectedNodeEntity(node);
              if (onSelectEntity) onSelectEntity(node);
            }}
            onSelectEdge={(edge) => setSelectedEdgeRel(edge)}
            height="560px"
          />
        </div>
      </div>

      {/* Event Detail Modal */}
      <TimelineEventDetailModal
        event={selectedEvent}
        evidenceItems={evidenceItems}
        onClose={() => setSelectedEvent(null)}
        onOpenEvidence={handleOpenEvidence}
      />

      {/* Evidence Detail Modal */}
      <EvidenceDetailModal
        item={selectedEvidenceItem}
        onClose={() => setSelectedEvidenceItem(null)}
      />

      {/* Node Detail Modal */}
      <EntityDetailModal
        entity={selectedNodeEntity}
        relationships={relationships}
        entities={entities}
        evidenceItems={evidenceItems}
        onClose={() => setSelectedNodeEntity(null)}
      />

      {/* Edge Rationale Modal */}
      <WhyConnectedModal
        relationship={selectedEdgeRel}
        sourceEntity={selectedEdgeRel ? entities.find((e) => e.id === selectedEdgeRel.sourceEntityId) : undefined}
        targetEntity={selectedEdgeRel ? entities.find((e) => e.id === selectedEdgeRel.targetEntityId) : undefined}
        onClose={() => setSelectedEdgeRel(null)}
      />
    </div>
  );
};
