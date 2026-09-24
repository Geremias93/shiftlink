import type { ShiftAssignment } from '../types'
import { roleLabels } from '../utils/formatters'

type ShiftPersonCardProps = {
  assignment: ShiftAssignment
  canManage: boolean
  removing: boolean
  onRemove: (assignment: ShiftAssignment) => void
}

export function ShiftPersonCard({
  assignment,
  canManage,
  removing,
  onRemove,
}: ShiftPersonCardProps) {
  return (
    <article className="shift-person-card">
      <span className="shift-person-avatar">
        {assignment.firstName.charAt(0).toUpperCase()}
      </span>

      <div className="shift-person-info">
        <strong>
          {assignment.firstName} {assignment.lastName}
        </strong>

        <span>{assignment.email}</span>

        <small>{roleLabels[assignment.role]}</small>
      </div>

      {canManage && (
        <button
          className="shift-person-remove"
          type="button"
          disabled={removing}
          onClick={() => onRemove(assignment)}
        >
          {removing ? 'Quitando...' : 'Quitar del turno'}
        </button>
      )}
    </article>
  )
}
