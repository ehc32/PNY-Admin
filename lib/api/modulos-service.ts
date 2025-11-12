const API_BASE_URL = "https://stingray-app-e496q.ondigitalocean.app"

export interface Modulo {
  _id: string
  name: string
  description?: string
  state?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateModuloDto {
  name: string
  description?: string
  state?: boolean
}

export interface UpdateModuloDto extends Partial<CreateModuloDto> {
  // Interface para actualizaciones de módulos
}

// Obtener todos los módulos
export async function obtenerModulos(token: string): Promise<Modulo[]> {
  const response = await fetch(`${API_BASE_URL}/modulos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener módulos")
  }

  const data = await response.json()
  return data.result || data
}

// Obtener un módulo por ID
export async function obtenerModuloPorId(token: string, id: string): Promise<Modulo> {
  const response = await fetch(`${API_BASE_URL}/modulos/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener módulo")
  }

  const data = await response.json()
  return data.result || data
}

// Crear un nuevo módulo
export async function crearModulo(token: string, data: CreateModuloDto): Promise<Modulo> {
  const response = await fetch(`${API_BASE_URL}/modulos`, {
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
    throw new Error(error.message || "Error al crear módulo")
  }

  const result = await response.json()
  return result.result || result
}

// Actualizar un módulo
export async function actualizarModulo(token: string, id: string, data: UpdateModuloDto): Promise<Modulo> {
  const response = await fetch(`${API_BASE_URL}/modulos/${id}`, {
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
    throw new Error(error.message || "Error al actualizar módulo")
  }

  const result = await response.json()
  return result.result || result
}

// Eliminar un módulo
export async function eliminarModulo(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/modulos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al eliminar módulo")
  }
}

// Cambiar estado de un módulo
export async function cambiarEstadoModulo(token: string, id: string, state: boolean): Promise<Modulo> {
  const response = await fetch(`${API_BASE_URL}/modulos/${id}/state`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ state }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al cambiar estado del módulo")
  }

  const result = await response.json()
  return result.result || result
}
