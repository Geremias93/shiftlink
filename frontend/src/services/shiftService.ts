import type {
  Handover,
  HandoverItem,
  ShiftAssignment,
} from '../types'
import {
  apiGet,
  apiGetOptional,
} from './apiClient'

type ShiftDetail = {
  assignments: ShiftAssignment[]
  outgoingHandover: Handover | null
  incomingHandovers: Handover[]
  incomingHandoverItems: Record<string, HandoverItem[]>
  handoverItems: HandoverItem[]
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
