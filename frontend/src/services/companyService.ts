import type {
  Company,
  Location,
  Membership,
} from '../types'
import { apiGet } from './apiClient'

type CompanyWorkspace = {
  locations: Location[]
  membership: Membership
}

export function getCompanies(
  token: string,
): Promise<Company[]> {
  return apiGet<Company[]>(
    '/api/companies',
    token,
    'No se han podido cargar tus empresas',
  )
}

export async function getCompanyWorkspace(
  companyId: string,
  token: string,
): Promise<CompanyWorkspace> {
  const [locations, membership] = await Promise.all([
    apiGet<Location[]>(
      `/api/companies/${companyId}/locations`,
      token,
      'No se ha podido cargar la empresa',
    ),
    apiGet<Membership>(
      `/api/companies/${companyId}/members/me`,
      token,
      'No se ha podido cargar la empresa',
    ),
  ])

  return {
    locations,
    membership,
  }
}

export function getCompanyMembers(
  companyId: string,
  token: string,
): Promise<Membership[]> {
  return apiGet<Membership[]>(
    `/api/companies/${companyId}/members`,
    token,
    'No se han podido cargar los empleados',
  )
}
