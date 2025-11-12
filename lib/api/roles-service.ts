const API_BASE_URL = "https://stingray-app-e496q.ondigitalocean.app"

export interface Role {
  _id: string
  name: string
  description?: string
  views: string[]
  state?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateRoleDto {
  name: string
  description?: string
  views?: string[]
  state?: boolean
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {
  // Interface para actualizaciones de roles
}

// Obtener todos los roles
export async function obtenerRoles(token: string): Promise<Role[]> {
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

  const data = await response.json()
  return data.result || data
}

// Obtener un rol por ID
export async function obtenerRolPorId(token: string, id: string): Promise<Role> {
  const response = await fetch(`${API_BASE_URL}/rol/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener rol")
  }

  const data = await response.json()
  return data.result || data
}

// Asignar vistas a un rol
export async function asignarVistasARol(token: string, roleId: string, viewIds: string[]): Promise<Role> {
  const response = await fetch(`${API_BASE_URL}/rol/${roleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ views: viewIds }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al asignar vistas al rol")
  }

  const result = await response.json()
  return result.result || result
}
