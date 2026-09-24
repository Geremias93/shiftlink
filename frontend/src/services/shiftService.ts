import type {
  Handover,
  HandoverItem,
  Shift,
  ShiftAssignment,
} from '../types'
import {
  apiGet,
  apiGetOptional,
  apiRequest,
  apiRequestVoid,
} from './apiClient'

type ShiftDetail = {
  assignments: ShiftAssignment[]
  outgoingHandover: Handover | null
  incomingHandovers: Handover[]
  incomingHandoverItems: Record<string, HandoverItem[]>
  handoverItems: HandoverItem[]
}

type ShiftInput = {
  name: string
  startsAt: string
  endsAt: string
}

export async function getShiftDetail(
  companyId: string,
  locationId: string,
  shiftId: string,
  token: string,
): Promise<ShiftDetail> {
  const baseUrl =
    `/api/companies/${companyId}/locations/${locationId}/shifts/${shiftId}`

  const [
    assignments,
    outgoingHandover,
    incomingHandovers,
  ] = await Promise.all([
    apiGet<ShiftAssignment[]>(
      `${baseUrl}/assignments`,
      token,
      'No se ha podido cargar el detalle del turno',
    ),
    apiGetOptional<Handover>(
      `${baseUrl}/handover`,
      token,
      'No se ha podido cargar el detalle del turno',
    ),
    apiGet<Handover[]>(
      `${baseUrl}/incoming-handovers`,
      token,
      'No se ha podido cargar el detalle del turno',
    ),
  ])

  const incomingItemsEntries = await Promise.all(
    incomingHandovers.map(async (handover) => {
      const items = await apiGet<HandoverItem[]>(
        `/api/companies/${companyId}/locations/${locationId}/shifts/${handover.shiftId}/handover/items`,
        token,
        'No se han podido cargar los pendientes recibidos',
      )

      return [handover.id, items] as const
    }),
  )

  const incomingHandoverItems =
    Object.fromEntries(incomingItemsEntries)

  const handoverItems = outgoingHandover
    ? await apiGet<HandoverItem[]>(
        `${baseUrl}/handover/items`,
        token,
        'No se han podido cargar los pendientes del relevo',
      )
    : []

  return {
    assignments,
    outgoingHandover,
    incomingHandovers,
    incomingHandoverItems,
    handoverItems,
  }
}

export function createShift(
  companyId: string,
  locationId: string,
  token: string,
  input: ShiftInput,
): Promise<Shift> {
  return apiRequest<Shift>(
    `/api/companies/${companyId}/locations/${locationId}/shifts`,
    token,
    'No se ha podido crear el turno',
    {
      method: 'POST',
      body: input,
    },
  )
}

export function assignMemberToShift(
  companyId: string,
  locationId: string,
  shiftId: string,
  token: string,
  membershipId: string,
): Promise<ShiftAssignment> {
  return apiRequest<ShiftAssignment>(
    `/api/companies/${companyId}/locations/${locationId}/shifts/${shiftId}/assignments`,
    token,
    'No se ha podido asignar el empleado',
    {
      method: 'POST',
      body: {
        membershipId,
      },
    },
  )
}

export function removeShiftAssignment(
  companyId: string,
  locationId: string,
  shiftId: string,
  assignmentId: string,
  token: string,
): Promise<void> {
  return apiRequestVoid(
    `/api/companies/${companyId}/locations/${locationId}/shifts/${shiftId}/assignments/${assignmentId}`,
    token,
    'No se ha podido quitar al empleado del turno',
    {
      method: 'DELETE',
    },
  )
}
