const API_BASE_URL = "https://stingray-app-e496q.ondigitalocean.app"

export interface User {
  _id: string
  name: string
  email: string
  phone: string
  typeDocument: string
  numberDocument: string
  assignedPosition?: string
  assignedRol?: {
    _id: string
    name: string
  } | string
  state?: boolean | string
  createdAt?: string
  updatedAt?: string
}

export interface Rol {
  _id: string
  name: string
  description?: string
}

// Obtener todos los usuarios
export async function getUsers(token: string): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener usuarios")
  }

  return response.json()
}

// Obtener un usuario por ID
export async function getUserById(id: string, token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
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

  return response.json()
}

// Actualizar usuario (asignar rol y posición)
export async function updateUser(id: string, data: Partial<User>, token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al actualizar usuario")
  }

  return response.json()
}

// Obtener todos los roles
export async function getRoles(token: string): Promise<Rol[]> {
  const response = await fetch(`${API_BASE_URL}/rol`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener roles")
  }

  return response.json()
}

// Eliminar usuario
export async function deleteUser(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al eliminar usuario")
  }
}
