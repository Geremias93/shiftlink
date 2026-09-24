import type { HandoverItem } from '../types'
import {
  itemTypeLabel,
  priorityLabel,
} from '../utils/formatters'

type IncomingHandoverItemCardProps = {
  item: HandoverItem
  canResolve: boolean
  resolving: boolean
  onResolve: (item: HandoverItem) => void
}

export function IncomingHandoverItemCard({
  item,
  canResolve,
  resolving,
  onResolve,
}: IncomingHandoverItemCardProps) {
  return (
    <article className="handover-item-card">
      <div className="handover-item-top">
        <span>{itemTypeLabel(item.type)}</span>

        <span>
          Prioridad {priorityLabel(item.priority).toLowerCase()}
        </span>
      </div>

      <strong>{item.title}</strong>

      {item.description && (
        <p>{item.description}</p>
      )}

      <small>
        {item.status === 'OPEN'
          ? 'Pendiente'
          : 'Resuelto'}
      </small>

      {canResolve && item.status === 'OPEN' && (
        <button
          className="shift-secondary-action"
          type="button"
          disabled={resolving}
          onClick={() => onResolve(item)}
        >
          {resolving
            ? 'Resolviendo...'
            : 'Marcar como resuelto'}
        </button>
      )}
    </article>
  )
}
