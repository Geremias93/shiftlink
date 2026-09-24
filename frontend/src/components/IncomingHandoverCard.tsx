import type {
  Handover,
  HandoverItem,
} from '../types'
import { handoverStatusLabel } from '../utils/formatters'
import { IncomingHandoverItemCard } from './IncomingHandoverItemCard'

type IncomingHandoverCardProps = {
  handover: Handover
  originShiftName: string
  items: HandoverItem[]
  canAcknowledge: boolean
  canResolve: boolean
  acknowledging: boolean
  resolvingItemId: string | null
  onResolve: (
    handover: Handover,
    item: HandoverItem,
  ) => void
  onAcknowledge: (handover: Handover) => void
}

export function IncomingHandoverCard({
  handover,
  originShiftName,
  items,
  canAcknowledge,
  canResolve,
  acknowledging,
  resolvingItemId,
  onResolve,
  onAcknowledge,
}: IncomingHandoverCardProps) {
  return (
    <article className="handover-card">
      <div className="handover-card-top">
        <span
          className={`handover-status handover-status-${handover.status.toLowerCase()}`}
        >
          {handoverStatusLabel(handover.status)}
        </span>
      </div>

      <div className="handover-route">
        <span>Origen</span>
        <strong>{originShiftName}</strong>
      </div>

      <div className="handover-notes">
        <span>Notas del relevo</span>
        <p>{handover.notes || 'Sin notas añadidas.'}</p>
      </div>

      <div className="handover-items-block">
        <div className="handover-items-heading">
          <span>Pendientes del relevo</span>
          <strong>{items.length}</strong>
        </div>

        {items.length === 0 ? (
          <p className="handover-items-empty">
            No hay tareas ni incidencias en este relevo.
          </p>
        ) : (
          <div className="handover-items-list">
            {items.map((item) => (
              <IncomingHandoverItemCard
                key={item.id}
                item={item}
                canResolve={canResolve}
                resolving={resolvingItemId === item.id}
                onResolve={(itemToResolve) =>
                  onResolve(handover, itemToResolve)
                }
              />
            ))}
          </div>
        )}
      </div>

      {canAcknowledge && (
        <div className="handover-card-actions">
          <button
            className="shift-primary-action"
            type="button"
            disabled={acknowledging}
            onClick={() => onAcknowledge(handover)}
          >
            {acknowledging
              ? 'Confirmando...'
              : 'Confirmar recepción'}
          </button>
        </div>
      )}
    </article>
  )
}
