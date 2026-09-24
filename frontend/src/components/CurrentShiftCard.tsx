import type { Shift } from '../types'
import { formatShiftDate } from '../utils/formatters'

type CurrentShiftCardProps = {
  shift: Shift
  onSelect: (shift: Shift) => void
}

export function CurrentShiftCard({
  shift,
  onSelect,
}: CurrentShiftCardProps) {
  return (
    <button
      className="current-shift-card"
      type="button"
      onClick={() => onSelect(shift)}
    >
      <div className="current-shift-card-top">
        <span className="shift-status shift-status-active">
          En curso
        </span>

        <span className="current-shift-arrow">→</span>
      </div>

      <div className="current-shift-main">
        <div>
          <h3>{shift.name}</h3>

          <p className="current-shift-time">
            {formatShiftDate(shift.startsAt)}
            {' → '}
            {formatShiftDate(shift.endsAt)}
          </p>
        </div>
      </div>
    </button>
  )
}
