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
