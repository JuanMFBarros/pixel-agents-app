import { useState } from 'react';

import type { Sector } from '../hooks/useExtensionMessages.js';

interface SectorsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sectors: Sector[];
  agents: number[];
  onChange: (sectors: Sector[]) => void;
}

const SECTOR_COLORS = [
  '#5a8cff',
  '#89d185',
  '#cca700',
  '#f14c4c',
  '#c586c0',
  '#4ec9b0',
  '#ce9178',
  '#9cdcfe',
];

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const menuItemBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '6px 10px',
  fontSize: '24px',
  color: 'rgba(255,255,255,0.8)',
  background: 'transparent',
  border: 'none',
  borderRadius: 0,
  cursor: 'pointer',
  textAlign: 'left',
};

interface SectorCardProps {
  sector: Sector;
  agents: number[];
  allSectors: Sector[];
  onUpdate: (updated: Sector) => void;
  onDelete: (id: string) => void;
}

function SectorCard({ sector, agents, allSectors, onUpdate, onDelete }: SectorCardProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(sector.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  // Agents not yet assigned to this sector
  const unassignedAgents = agents.filter((id) => !allSectors.some((s) => s.agentIds.includes(id)));
  const canAssign = unassignedAgents.length > 0;

  const handleNameBlur = () => {
    setEditingName(false);
    if (nameInput.trim() && nameInput.trim() !== sector.name) {
      onUpdate({ ...sector, name: nameInput.trim() });
    } else {
      setNameInput(sector.name);
    }
  };

  const handleAssign = (agentId: number) => {
    onUpdate({ ...sector, agentIds: [...sector.agentIds, agentId] });
  };

  const handleUnassign = (agentId: number) => {
    onUpdate({ ...sector, agentIds: sector.agentIds.filter((a) => a !== agentId) });
  };

  return (
    <div
      style={{
        borderLeft: `3px solid ${sector.color}`,
        background: 'rgba(255,255,255,0.03)',
        padding: '8px 10px',
        marginBottom: 6,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <div
          style={{
            width: 12,
            height: 12,
            background: sector.color,
            flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        />
        {editingName ? (
          <input
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNameBlur();
              if (e.key === 'Escape') {
                setNameInput(sector.name);
                setEditingName(false);
              }
            }}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 0,
              color: '#fff',
              fontSize: '22px',
              padding: '1px 4px',
              outline: 'none',
            }}
          />
        ) : (
          <span
            onClick={() => setEditingName(true)}
            style={{
              flex: 1,
              fontSize: '22px',
              color: 'rgba(255,255,255,0.9)',
              cursor: 'text',
            }}
            title="Clique para editar o nome"
          >
            {sector.name}
          </span>
        )}
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            onMouseEnter={() => setHovered('del')}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === 'del' ? 'rgba(255,80,80,0.2)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 0,
              color: 'rgba(255,255,255,0.4)',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '1px 6px',
              flexShrink: 0,
            }}
            title="Deletar setor"
          >
            X
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: '18px', color: 'rgba(255,80,80,0.8)' }}>Deletar?</span>
            <button
              onClick={() => onDelete(sector.id)}
              style={{
                background: 'rgba(255,80,80,0.3)',
                border: '1px solid rgba(255,80,80,0.5)',
                borderRadius: 0,
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '1px 6px',
              }}
            >
              Sim
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 0,
                color: 'rgba(255,255,255,0.5)',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '1px 6px',
              }}
            >
              Não
            </button>
          </div>
        )}
      </div>

      {/* Assigned agents */}
      {sector.agentIds.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
          {sector.agentIds.map((agentId) => (
            <div
              key={agentId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(255,255,255,0.07)',
                border: `1px solid ${sector.color}55`,
                padding: '1px 6px',
                fontSize: '18px',
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              <span>Agent #{agentId}</span>
              <button
                onClick={() => handleUnassign(agentId)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '0 2px',
                  lineHeight: 1,
                }}
                title="Remover do setor"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Assign agent dropdown */}
      {canAssign && (
        <select
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) handleAssign(val);
            e.target.value = '';
          }}
          defaultValue=""
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 0,
            color: 'rgba(255,255,255,0.6)',
            fontSize: '20px',
            padding: '2px 4px',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="" disabled>
            + Atribuir agente
          </option>
          {unassignedAgents.map((id) => (
            <option key={id} value={id}>
              Agent #{id}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

interface CreateSectorFormProps {
  onSubmit: (name: string, color: string) => void;
  onCancel: () => void;
}

function CreateSectorForm({ onSubmit, onCancel }: CreateSectorFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(SECTOR_COLORS[0]);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '10px',
        marginBottom: 8,
      }}
    >
      <input
        autoFocus
        placeholder="Nome do setor (ex: Frontend)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && name.trim()) onSubmit(name.trim(), color);
          if (e.key === 'Escape') onCancel();
        }}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 0,
          color: '#fff',
          fontSize: '22px',
          padding: '3px 6px',
          marginBottom: 8,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      {/* Color swatches */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {SECTOR_COLORS.map((c) => (
          <div
            key={c}
            onClick={() => setColor(c)}
            style={{
              width: 20,
              height: 20,
              background: c,
              cursor: 'pointer',
              border: c === color ? '2px solid #fff' : '2px solid transparent',
              flexShrink: 0,
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={() => name.trim() && onSubmit(name.trim(), color)}
          disabled={!name.trim()}
          style={{
            ...menuItemBase,
            width: 'auto',
            background: name.trim() ? 'rgba(90,140,255,0.3)' : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(90,140,255,0.5)',
            fontSize: '20px',
            padding: '3px 10px',
            color: name.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
            cursor: name.trim() ? 'pointer' : 'default',
          }}
        >
          Criar
        </button>
        <button
          onClick={onCancel}
          style={{
            ...menuItemBase,
            width: 'auto',
            fontSize: '20px',
            padding: '3px 10px',
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export function SectorsPanel({ isOpen, onClose, sectors, agents, onChange }: SectorsPanelProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = (name: string, color: string) => {
    const newSector: Sector = { id: generateId(), name, color, agentIds: [] };
    onChange([...sectors, newSector]);
    setIsCreating(false);
  };

  const handleUpdate = (updated: Sector) => {
    onChange(sectors.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDelete = (id: string) => {
    onChange(sectors.filter((s) => s.id !== id));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 49,
        }}
      />
      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          background: 'var(--pixel-bg)',
          border: '2px solid var(--pixel-border)',
          borderRadius: 0,
          padding: '4px',
          boxShadow: 'var(--pixel-shadow)',
          minWidth: 320,
          maxWidth: 420,
          maxHeight: '80vh',
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
            padding: '4px 10px',
            borderBottom: '1px solid var(--pixel-border)',
            marginBottom: '4px',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '24px', color: 'rgba(255,255,255,0.9)' }}>
            Setores da Empresa
          </span>
          <button
            onClick={onClose}
            onMouseEnter={() => setHovered('close')}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === 'close' ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: 'none',
              borderRadius: 0,
              color: 'rgba(255,255,255,0.6)',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0 4px',
              lineHeight: 1,
            }}
          >
            X
          </button>
        </div>

        {/* Content */}
        <div style={{ overflow: 'auto', padding: '4px 10px 10px', flex: 1 }}>
          {isCreating && (
            <CreateSectorForm onSubmit={handleCreate} onCancel={() => setIsCreating(false)} />
          )}

          {sectors.length === 0 && !isCreating && (
            <div
              style={{
                fontSize: '21px',
                color: 'rgba(255,255,255,0.3)',
                textAlign: 'center',
                padding: '20px 0',
              }}
            >
              Nenhum setor criado.
            </div>
          )}

          {sectors.map((sector) => (
            <SectorCard
              key={sector.id}
              sector={sector}
              agents={agents}
              allSectors={sectors}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}

          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              onMouseEnter={() => setHovered('new')}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...menuItemBase,
                background: hovered === 'new' ? 'rgba(255,255,255,0.08)' : 'transparent',
                justifyContent: 'flex-start',
                fontSize: '22px',
                padding: '6px 8px',
              }}
            >
              + Novo Setor
            </button>
          )}
        </div>
      </div>
    </>
  );
}
