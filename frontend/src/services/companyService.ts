import type { Company } from '../types'
import { apiGet } from './apiClient'

export function getCompanies(
  token: string,
): Promise<Company[]> {
  return apiGet<Company[]>(
    '/api/companies',
    token,
    'No se han podido cargar tus empresas',
  )
}
