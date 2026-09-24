import type { FormEventHandler } from 'react'

type CreateShiftFormProps = {
  name: string
  startsAt: string
  endsAt: string
  saving: boolean
  onNameChange: (value: string) => void
  onStartsAtChange: (value: string) => void
  onEndsAtChange: (value: string) => void
  onCancel: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
}

export function CreateShiftForm({
  name,
  startsAt,
  endsAt,
  saving,
  onNameChange,
  onStartsAtChange,
  onEndsAtChange,
  onCancel,
  onSubmit,
}: CreateShiftFormProps) {
  return (
    <form
      className="shift-create-form"
      onSubmit={onSubmit}
    >
      <div className="handover-form-heading">
        <strong>Nuevo turno</strong>
        <span>
          Define el nombre y el horario del turno.
        </span>
      </div>

      <label className="handover-field">
        <span>Nombre</span>

        <input
          type="text"
          maxLength={120}
          value={name}
          onChange={(event) =>
            onNameChange(event.target.value)
          }
          placeholder="Ej.: Turno de mañana"
        />
      </label>

      <div className="handover-item-form-row">
        <label className="handover-field">
          <span>Inicio</span>

          <input
            type="datetime-local"
            value={startsAt}
            onChange={(event) =>
              onStartsAtChange(event.target.value)
            }
          />
        </label>

        <label className="handover-field">
          <span>Fin</span>

          <input
            type="datetime-local"
            value={endsAt}
            onChange={(event) =>
              onEndsAtChange(event.target.value)
            }
          />
        </label>
      </div>

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
          disabled={
            saving ||
            !name.trim() ||
            !startsAt ||
            !endsAt
          }
        >
          {saving ? 'Creando...' : 'Crear turno'}
        </button>
      </div>
    </form>
  )
}
