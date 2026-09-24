import type {
  Handover,
  HandoverItem,
} from '../types'
import { apiRequest } from './apiClient'

type CreateHandoverInput = {
  targetShiftId: string
  notes: string | null
}

type UpdateHandoverInput = {
  notes: string | null
}

type CreateHandoverItemInput = {
  type: HandoverItem['type']
  title: string
  description: string | null
  priority: HandoverItem['priority']
}

function handoverBaseUrl(
  companyId: string,
  locationId: string,
  shiftId: string,
): string {
  return `/api/companies/${companyId}/locations/${locationId}/shifts/${shiftId}/handover`
}

export function createHandover(
  companyId: string,
  locationId: string,
  shiftId: string,
  token: string,
  input: CreateHandoverInput,
): Promise<Handover> {
  return apiRequest<Handover>(
    handoverBaseUrl(companyId, locationId, shiftId),
    token,
    'No se ha podido guardar el borrador del relevo',
    {
      method: 'POST',
      body: input,
    },
  )
}

export function updateHandover(
  companyId: string,
  locationId: string,
  shiftId: string,
  token: string,
  input: UpdateHandoverInput,
): Promise<Handover> {
  return apiRequest<Handover>(
    handoverBaseUrl(companyId, locationId, shiftId),
    token,
    'No se ha podido actualizar el borrador',
    {
      method: 'PATCH',
      body: input,
    },
  )
}

export function submitHandover(
  companyId: string,
  locationId: string,
  shiftId: string,
  token: string,
): Promise<Handover> {
  return apiRequest<Handover>(
    `${handoverBaseUrl(companyId, locationId, shiftId)}/submit`,
    token,
    'No se ha podido enviar el relevo',
    {
      method: 'POST',
    },
  )
}

export function acknowledgeHandover(
  companyId: string,
  locationId: string,
  shiftId: string,
  token: string,
): Promise<Handover> {
  return apiRequest<Handover>(
    `${handoverBaseUrl(companyId, locationId, shiftId)}/acknowledge`,
    token,
    'No se ha podido confirmar la recepción del relevo',
    {
      method: 'POST',
    },
  )
}

export function resolveHandoverItem(
  companyId: string,
  locationId: string,
  shiftId: string,
  itemId: string,
  token: string,
): Promise<HandoverItem> {
  return apiRequest<HandoverItem>(
    `${handoverBaseUrl(companyId, locationId, shiftId)}/items/${itemId}/resolve`,
    token,
    'No se ha podido resolver el pendiente',
    {
      method: 'POST',
    },
  )
}

export function carryOpenItems(
  companyId: string,
  locationId: string,
  shiftId: string,
  sourceShiftId: string,
  token: string,
): Promise<HandoverItem[]> {
  return apiRequest<HandoverItem[]>(
    `${handoverBaseUrl(companyId, locationId, shiftId)}/items/carry-from/${sourceShiftId}`,
    token,
    'No se han podido arrastrar los pendientes anteriores',
    {
      method: 'POST',
    },
  )
}

export function createHandoverItem(
  companyId: string,
  locationId: string,
  shiftId: string,
  token: string,
  input: CreateHandoverItemInput,
): Promise<HandoverItem> {
  return apiRequest<HandoverItem>(
    `${handoverBaseUrl(companyId, locationId, shiftId)}/items`,
    token,
    'No se ha podido añadir el pendiente',
    {
      method: 'POST',
      body: input,
    },
  )
}
