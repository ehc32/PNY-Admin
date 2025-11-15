const API_BASE_URL = "https://stingray-app-e496q.ondigitalocean.app"

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  typeDocument: string
  numberDocument: string
  assignedPosition?: string
  assignedRol?: string | {
    _id: string
    name: string
  }
}

export interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
}

// Obtener perfil del usuario autenticado
export async function obtenerPerfil(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener perfil")
  }

  const data = await response.json()
  return data.result || data
}

// Obtener usuario por ID
export async function obtenerUsuarioPorId(token: string, userId: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener usuario")
  }

  const data = await response.json()
  return data.result || data
}

// Actualizar perfil del usuario
export async function actualizarPerfil(token: string, data: Partial<UserProfile>): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al actualizar perfil")
  }

  const result = await response.json()
  return result.result || result
}

// Cambiar contraseña
export async function cambiarPassword(token: string, data: UpdatePasswordData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al cambiar contraseña")
  }
}
