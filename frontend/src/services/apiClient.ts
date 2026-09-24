export class ApiError extends Error {
  status: number

  constructor(
    status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiGet<T>(
  url: string,
  token: string,
  errorMessage: string,
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      errorMessage,
    )
  }

  return response.json()
}

export async function apiGetOptional<T>(
  url: string,
  token: string,
  errorMessage: string,
): Promise<T | null> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      errorMessage,
    )
  }

  return response.json()
}

type ApiRequestOptions = {
  method: 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
}

export async function apiRequest<T>(
  url: string,
  token: string,
  errorMessage: string,
  options: ApiRequestOptions,
): Promise<T> {
  const response = await fetch(url, {
    method: options.method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body !== undefined
        ? { 'Content-Type': 'application/json' }
        : {}),
    },
    body:
      options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      errorMessage,
    )
  }

  return response.json()
}

export async function apiRequestVoid(
  url: string,
  token: string,
  errorMessage: string,
  options: ApiRequestOptions,
): Promise<void> {
  const response = await fetch(url, {
    method: options.method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body !== undefined
        ? { 'Content-Type': 'application/json' }
        : {}),
    },
    body:
      options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      errorMessage,
    )
  }
}
