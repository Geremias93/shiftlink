import type { FormEventHandler } from 'react'
import type {
  Membership,
  ShiftAssignment,
} from '../types'
import { roleLabels } from '../utils/formatters'

type AssignMemberFormProps = {
  members: Membership[]
  assignments: ShiftAssignment[]
  membershipId: string
  saving: boolean
  onMembershipIdChange: (value: string) => void
  onCancel: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
}

export function AssignMemberForm({
  members,
  assignments,
  membershipId,
  saving,
  onMembershipIdChange,
  onCancel,
  onSubmit,
}: AssignMemberFormProps) {
  const availableMembers = members.filter(
    (member) =>
      member.active &&
      !assignments.some(
        (assignment) =>
          assignment.membershipId === member.membershipId,
      ),
  )

  return (
    <form
      className="shift-assignment-form"
      onSubmit={onSubmit}
    >
      <label className="handover-field">
        <span>Empleado</span>

        <select
          value={membershipId}
          onChange={(event) =>
            onMembershipIdChange(event.target.value)
          }
        >
          <option value="">Selecciona un empleado</option>

          {availableMembers.map((member) => (
            <option
              key={member.membershipId}
              value={member.membershipId}
            >
              {member.firstName} {member.lastName} ·{' '}
              {roleLabels[member.role]}
            </option>
          ))}
        </select>
      </label>

      <div className="handover-form-actions">
        <button
          className="shift-secondary-action"
          type="button"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          className="shift-primary-action"
          type="submit"
          disabled={!membershipId || saving}
        >
          {saving ? 'Asignando...' : 'Asignar'}
        </button>
      </div>
    </form>
  )
}
