import { useEffect, useRef } from 'react';

import type { LogEntry } from '../hooks/useExtensionMessages.js';

interface LogsViewProps {
  logEntries: LogEntry[];
  onClear: () => void;
}

const LOGS_Z = 40;

const KIND_COLORS: Record<LogEntry['kind'], string> = {
  created: 'var(--vscode-charts-green, #89d185)',
  closed: 'rgba(255,255,255,0.35)',
  toolStart: 'var(--vscode-charts-blue, #3794ff)',
  toolDone: 'var(--vscode-charts-green, #89d185)',
  waiting: 'var(--vscode-charts-yellow, #cca700)',
  active: 'rgba(255,255,255,0.4)',
  permission: 'var(--vscode-charts-orange, #f14c4c)',
};

const KIND_LABELS: Record<LogEntry['kind'], string> = {
  created: 'criado',
  closed: 'encerrado',
  toolStart: 'iniciou',
  toolDone: 'concluiu',
  waiting: 'aguardando',
  active: 'retomou',
  permission: 'permissão',
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour12: false });
}

function formatEntry(entry: LogEntry): string {
  const agentLabel = `Agent #${entry.agentId}`;
  switch (entry.kind) {
    case 'created':
      return `${agentLabel} entrou no escritório`;
    case 'closed':
      return `${agentLabel} saiu do escritório`;
    case 'toolStart':
      return `${agentLabel} iniciou: ${entry.toolName ?? ''}${entry.detail ? ` — ${entry.detail}` : ''}`;
    case 'toolDone':
      return `${agentLabel} concluiu: ${entry.toolName ?? ''}`;
    case 'waiting':
      return `${agentLabel} aguardando input`;
    case 'active':
      return `${agentLabel} retomou atividade`;
    case 'permission':
      return `${agentLabel} aguarda permissão`;
  }
}

export function LogsView({ logEntries, onClear }: LogsViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const wasAtBottomRef = useRef(true);

  // Track scroll position before update
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    wasAtBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  };

  // Auto-scroll when new entries arrive if user was at bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (el && wasAtBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [logEntries.length]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--vscode-editor-background)',
        zIndex: LOGS_Z,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '26px', color: 'rgba(255,255,255,0.9)' }}>Logs de Atividade</span>
        <button
          onClick={onClear}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 0,
            color: 'rgba(255,255,255,0.5)',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '2px 8px',
          }}
          title="Limpar logs"
        >
          Limpar
        </button>
      </div>

      {/* Log entries */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {logEntries.length === 0 ? (
          <div
            style={{
              fontSize: '22px',
              color: 'rgba(255,255,255,0.3)',
              textAlign: 'center',
              marginTop: 40,
            }}
          >
            Nenhuma atividade registrada ainda.
          </div>
        ) : (
          logEntries.map((entry) => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: '21px',
              }}
            >
              {/* Timestamp */}
              <span
                style={{
                  flexShrink: 0,
                  color: 'rgba(255,255,255,0.35)',
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: '19px',
                  paddingTop: 1,
                }}
              >
                {formatTime(entry.timestamp)}
              </span>
              {/* Kind badge */}
              <span
                style={{
                  flexShrink: 0,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: KIND_COLORS[entry.kind],
                  marginTop: 6,
                  display: 'inline-block',
                }}
              />
              {/* Badge label */}
              <span
                style={{
                  flexShrink: 0,
                  color: KIND_COLORS[entry.kind],
                  fontSize: '18px',
                  paddingTop: 1,
                  minWidth: 70,
                }}
              >
                [{KIND_LABELS[entry.kind]}]
              </span>
              {/* Message */}
              <span style={{ color: 'rgba(255,255,255,0.75)', wordBreak: 'break-word' }}>
                {formatEntry(entry)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
