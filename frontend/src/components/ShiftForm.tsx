import type { FormEventHandler } from 'react'

type ShiftFormProps = {
  title: string
  description: string
  name: string
  startsAt: string
  endsAt: string
  saving: boolean
  submitLabel: string
  savingLabel: string
  namePlaceholder?: string
  className?: string
  onNameChange: (value: string) => void
  onStartsAtChange: (value: string) => void
  onEndsAtChange: (value: string) => void
  onCancel: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
}

export function ShiftForm({
  title,
  description,
  name,
  startsAt,
  endsAt,
  saving,
  submitLabel,
  savingLabel,
  namePlaceholder,
  className,
  onNameChange,
  onStartsAtChange,
  onEndsAtChange,
  onCancel,
  onSubmit,
}: ShiftFormProps) {
  return (
    <form
      className={
        className
          ? `shift-create-form ${className}`
          : 'shift-create-form'
      }
      onSubmit={onSubmit}
    >
      <div className="handover-form-heading">
        <strong>{title}</strong>
        <span>{description}</span>
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
          placeholder={namePlaceholder}
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
          {saving ? savingLabel : submitLabel}
        </button>
      </div>
    </form>
  )
}
