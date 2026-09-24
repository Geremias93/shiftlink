import type { Shift } from '../types'
import { formatShiftDate } from '../utils/formatters'

type NextShiftCardProps = {
  shift: Shift
  onSelect: (shift: Shift) => void
}

export function NextShiftCard({
  shift,
  onSelect,
}: NextShiftCardProps) {
  return (
    <button
      className="next-shift-card"
      type="button"
      onClick={() => onSelect(shift)}
    >
      <div>
        <span className="shift-status shift-status-scheduled">
          Próximo
        </span>

        <h3>{shift.name}</h3>

        <p>
          {formatShiftDate(shift.startsAt)}
          {' → '}
          {formatShiftDate(shift.endsAt)}
        </p>
      </div>

      <span className="company-arrow">→</span>
    </button>
  )
}
