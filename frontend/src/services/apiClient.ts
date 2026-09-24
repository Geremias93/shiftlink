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
