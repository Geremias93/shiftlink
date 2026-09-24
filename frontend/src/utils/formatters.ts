import type {
  Handover,
  HandoverItem,
  Membership,
  Shift,
} from '../types'

export const shiftStatusLabels: Record<
  Shift['status'],
  string
> = {
  SCHEDULED: 'Programado',
  ACTIVE: 'En curso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
}

export const roleLabels: Record<
  Membership['role'],
  string
> = {
  OWNER: 'Propietario',
  MANAGER: 'Responsable',
  EMPLOYEE: 'Empleado',
}

export function formatDetailDate(value: string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function handoverStatusLabel(
  status: Handover['status'],
) {
  if (status === 'DRAFT') {
    return 'Borrador'
  }

  if (status === 'SUBMITTED') {
    return 'Pendiente de confirmar'
  }

  return 'Recepción confirmada'
}

export function formatShiftDate(value: string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function shiftStatusLabel(
  status: Shift['status'],
) {
  const labels: Record<Shift['status'], string> = {
    SCHEDULED: 'Programado',
    ACTIVE: 'Activo',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
  }

  return labels[status]
}

export function itemTypeLabel(
  type: HandoverItem['type'],
) {
  return type === 'INCIDENT'
    ? 'Incidencia'
    : 'Tarea'
}

export function priorityLabel(
  priority: HandoverItem['priority'],
) {
  const labels: Record<
    HandoverItem['priority'],
    string
  > = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
  }

  return labels[priority]
}
