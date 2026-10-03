import { useCallback, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Badge } from './Badge';

export interface KanbanColumn {
  id: string;
  title: string;
  icon?: ReactNode;
}

export interface KanbanCard {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  tags?: { label: string; tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' }[];
  assignee?: { name: string; avatarUrl?: string; initials?: string };
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due?: string;
}

export interface KanbanProps {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  onMove?: (cardId: string, toColumnId: string, toIndex: number) => void;
  onCardClick?: (card: KanbanCard) => void;
  className?: string;
}

const priorityMap = {
  low: { label: 'Low', tone: 'neutral' as const },
  medium: { label: 'Med', tone: 'primary' as const },
  high: { label: 'High', tone: 'warning' as const },
  urgent: { label: 'Urgent', tone: 'danger' as const },
};

export function Kanban({ columns, cards, onMove, onCardClick, className }: KanbanProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const cardsByColumn = (colId: string) => cards.filter((c) => c.columnId === colId);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    // ghost styling
    const el = e.currentTarget as HTMLElement;
    requestAnimationFrame(() => el.classList.add('pui-kanban__card--dragging'));
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove('pui-kanban__card--dragging');
    setDraggedId(null);
    setDragOverColumn(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(colId);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, colId: string) => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain') || draggedId;
      if (!id) return;
      const colCards = cardsByColumn(colId);
      onMove?.(id, colId, colCards.length);
      setDraggedId(null);
      setDragOverColumn(null);
    },
    [draggedId, cards, onMove]
  );

  return (
    <div className={cn('pui-kanban', className)}>
      {columns.map((col) => {
        const colCards = cardsByColumn(col.id);
        return (
          <div
            key={col.id}
            className={cn('pui-kanban__col', dragOverColumn === col.id && 'pui-kanban__col--over')}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={() => setDragOverColumn((prev) => (prev === col.id ? null : prev))}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="pui-kanban__col-head">
              <div className="pui-kanban__col-title">
                {col.icon && <span className="pui-kanban__col-icon">{col.icon}</span>}
                {col.title}
              </div>
              <Badge tone="neutral" pill>{colCards.length}</Badge>
            </div>

            <div className="pui-kanban__col-body">
              {colCards.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onCardClick?.(card)}
                  className={cn('pui-kanban__card', draggedId === card.id && 'pui-kanban__card--dragging')}
                  role="button"
                  tabIndex={0}
                  aria-label={`${card.title} in ${col.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onCardClick?.(card);
                    }
                  }}
                >
                  <div className="pui-kanban__card-top">
                    {card.priority && (
                      <Badge tone={priorityMap[card.priority].tone} pill>
                        {priorityMap[card.priority].label}
                      </Badge>
                    )}
                    {card.due && <span className="pui-kanban__card-due">{card.due}</span>}
                  </div>
                  <div className="pui-kanban__card-title">{card.title}</div>
                  {card.description && <div className="pui-kanban__card-desc">{card.description}</div>}
                  {(card.tags && card.tags.length > 0) || card.assignee ? (
                    <div className="pui-kanban__card-foot">
                      <div className="pui-kanban__card-tags">
                        {card.tags?.map((t) => (
                          <Badge key={t.label} tone={t.tone ?? 'neutral'}>{t.label}</Badge>
                        ))}
                      </div>
                      {card.assignee && (
                        <div className="pui-kanban__card-assignee" title={card.assignee.name}>
                          {card.assignee.avatarUrl ? (
                            <img src={card.assignee.avatarUrl} alt="" />
                          ) : (
                            <span>{card.assignee.initials ?? card.assignee.name.slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}

              {colCards.length === 0 && (
                <div className="pui-kanban__empty">No cards — drop here</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
