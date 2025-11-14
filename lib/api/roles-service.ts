import { createApiUrl, createAuthHeaders } from "./api-config"

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
  const response = await fetch(createApiUrl("/rol"), {
    method: "GET",
    headers: createAuthHeaders(token),
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
  const response = await fetch(createApiUrl(`/rol/${id}`), {
    method: "GET",
    headers: createAuthHeaders(token),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener rol")
  }

  const data = await response.json()
  return data.result || data
}

// Crear un nuevo rol
export async function crearRol(token: string, roleData: CreateRoleDto): Promise<Role> {
  const response = await fetch(createApiUrl("/rol"), {
    method: "POST",
    headers: createAuthHeaders(token),
    body: JSON.stringify(roleData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al crear rol")
  }

  const data = await response.json()
  return data.result || data
}

// Actualizar un rol
export async function actualizarRol(token: string, id: string, roleData: UpdateRoleDto): Promise<Role> {
  const response = await fetch(createApiUrl(`/rol/${id}`), {
    method: "PUT",
    headers: createAuthHeaders(token),
    body: JSON.stringify(roleData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al actualizar rol")
  }

  const data = await response.json()
  return data.result || data
}

// Eliminar un rol
export async function eliminarRol(token: string, id: string): Promise<void> {
  const response = await fetch(createApiUrl(`/rol/${id}`), {
    method: "DELETE",
    headers: createAuthHeaders(token),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al eliminar rol")
  }
}

// Cambiar estado de un rol
export async function cambiarEstadoRol(token: string, id: string, nuevoEstado: boolean): Promise<Role> {
  const response = await fetch(createApiUrl(`/rol/${id}`), {
    method: "PATCH",
    headers: createAuthHeaders(token),
    body: JSON.stringify({ state: nuevoEstado }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al cambiar estado del rol")
  }

  const data = await response.json()
  return data.result || data
}

// Asignar vistas a un rol
export async function asignarVistasARol(token: string, roleId: string, viewIds: string[]): Promise<Role> {
  const response = await fetch(createApiUrl(`/rol/${roleId}`), {
    method: "PATCH",
    headers: createAuthHeaders(token),
    body: JSON.stringify({ views: viewIds }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al asignar vistas al rol")
  }

  const result = await response.json()
  return result.result || result
}
