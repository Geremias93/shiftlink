import type {
  HandoverItem,
  Shift,
} from '../types'
import { apiGet } from './apiClient'

type LocationActivity = {
  shifts: Shift[]
  openItems: HandoverItem[]
}

export async function getLocationActivity(
  companyId: string,
  locationId: string,
  token: string,
): Promise<LocationActivity> {
  const [shifts, openItems] = await Promise.all([
    apiGet<Shift[]>(
      `/api/companies/${companyId}/locations/${locationId}/shifts`,
      token,
      'No se ha podido cargar la actividad del local',
    ),
    apiGet<HandoverItem[]>(
      `/api/companies/${companyId}/locations/${locationId}/open-items`,
      token,
      'No se ha podido cargar la actividad del local',
    ),
  ])

  return {
    shifts,
    openItems,
  }
}
