import type { Shift } from '../types'
import {
  formatDetailDate,
  shiftStatusLabels,
} from '../utils/formatters'

type ShiftDetailHeroProps = {
  shift: Shift
  locationName: string
  canManage: boolean
  changingStatus: boolean
  onEdit: () => void
  onStart: () => void
  onCancel: () => void
  onComplete: () => void
}

export function ShiftDetailHero({
  shift,
  locationName,
  canManage,
  changingStatus,
  onEdit,
  onStart,
  onCancel,
  onComplete,
}: ShiftDetailHeroProps) {
  return (
    <section className="shift-detail-hero">
      <div className="shift-detail-title">
        <div>
          <p className="eyebrow">TURNO</p>
          <h1>{shift.name}</h1>
        </div>

        <div className="shift-detail-actions">
          <span
            className={`shift-status-badge shift-status-${shift.status.toLowerCase()}`}
          >
            {shiftStatusLabels[shift.status]}
          </span>

          {canManage && shift.status === 'SCHEDULED' && (
            <div className="shift-active-actions">
              <button
                className="shift-secondary-action"
                type="button"
                onClick={onEdit}
              >
                Editar turno
              </button>

              <button
                className="shift-primary-action"
                type="button"
                disabled={changingStatus}
                onClick={onStart}
              >
                {changingStatus
                  ? 'Iniciando...'
                  : 'Iniciar turno'}
              </button>
            </div>
          )}

          {canManage && shift.status === 'ACTIVE' && (
            <div className="shift-active-actions">
              <button
                className="shift-danger-action"
                type="button"
                disabled={changingStatus}
                onClick={onCancel}
              >
                Cancelar turno
              </button>

              <button
                className="shift-primary-action"
                type="button"
                disabled={changingStatus}
                onClick={onComplete}
              >
                {changingStatus
                  ? 'Procesando...'
                  : 'Completar turno'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="shift-meta-grid">
        <div className="shift-meta-item">
          <span>Inicio</span>
          <strong>{formatDetailDate(shift.startsAt)}</strong>
        </div>

        <div className="shift-meta-item">
          <span>Fin</span>
          <strong>{formatDetailDate(shift.endsAt)}</strong>
        </div>

        <div className="shift-meta-item">
          <span>Local</span>
          <strong>{locationName}</strong>
        </div>
      </div>
    </section>
  )
}
