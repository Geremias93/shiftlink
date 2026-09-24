import { apiUrl } from './apiClient'

type LoginResponse = {
  accessToken: string
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  if (!response.ok) {
    throw new Error('Correo o contraseña incorrectos')
  }

  return response.json()
}


export async function createDemoSession(): Promise<LoginResponse> {
  const response = await fetch(apiUrl('/api/auth/demo'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        'Hay demasiadas demos activas ahora mismo. Inténtalo de nuevo en unos minutos.',
      )
    }

    throw new Error(
      'No se ha podido preparar la demo. Inténtalo de nuevo.',
    )
  }

  return response.json()
}
