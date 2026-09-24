import type { HandoverItem } from '../types'
import {
  itemTypeLabel,
  priorityLabel,
} from '../utils/formatters'

type PendingItemCardProps = {
  item: HandoverItem
}

export function PendingItemCard({
  item,
}: PendingItemCardProps) {
  return (
    <article className="pending-card">
      <div className="pending-main">
        <div className="pending-icon">
          {item.type === 'INCIDENT' ? '!' : '✓'}
        </div>

        <div>
          <div className="pending-tags">
            <span>{itemTypeLabel(item.type)}</span>

            <span
              className={
                `priority-tag ` +
                `priority-${item.priority.toLowerCase()}`
              }
            >
              Prioridad {priorityLabel(item.priority)}
            </span>
          </div>

          <h3>{item.title}</h3>

          {item.description && (
            <p>{item.description}</p>
          )}
        </div>
      </div>

      <span className="company-arrow">→</span>
    </article>
  )
}
