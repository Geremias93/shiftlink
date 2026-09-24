import type { HandoverItem } from '../types'
import {
  itemTypeLabel,
  priorityLabel,
} from '../utils/formatters'

type OutgoingHandoverItemCardProps = {
  item: HandoverItem
}

export function OutgoingHandoverItemCard({
  item,
}: OutgoingHandoverItemCardProps) {
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

      {item.carriedFromItemId && (
        <span className="handover-item-carried">
          Del turno anterior
        </span>
      )}

      <small>
        {item.status === 'OPEN'
          ? 'Pendiente'
          : 'Resuelto'}
      </small>
    </article>
  )
}
