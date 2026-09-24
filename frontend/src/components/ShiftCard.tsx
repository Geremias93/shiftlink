import type { Shift } from '../types'
import {
  formatShiftDate,
  shiftStatusLabel,
} from '../utils/formatters'

type ShiftCardProps = {
  shift: Shift
  onSelect: (shift: Shift) => void
}

export function ShiftCard({
  shift,
  onSelect,
}: ShiftCardProps) {
  return (
    <button
      className={
        shift.status === 'ACTIVE'
          ? 'shift-card shift-card-current'
          : 'shift-card'
      }
      type="button"
      onClick={() => onSelect(shift)}
    >
      <div className="shift-card-top">
        <span
          className={
            `shift-status ` +
            `shift-status-${shift.status.toLowerCase()}`
          }
        >
          {shiftStatusLabel(shift.status)}
        </span>

        <span className="company-arrow">→</span>
      </div>

      <h3>{shift.name}</h3>

      <div className="shift-times">
        <div>
          <span>Inicio</span>
          <strong>{formatShiftDate(shift.startsAt)}</strong>
        </div>

        <div>
          <span>Fin</span>
          <strong>{formatShiftDate(shift.endsAt)}</strong>
        </div>
      </div>
    </button>
  )
}
