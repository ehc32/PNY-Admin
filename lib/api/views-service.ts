const API_BASE_URL = "https://stingray-app-e496q.ondigitalocean.app"

export interface View {
  _id: string
  name: string
  description: string
  route: string
  moduloId: string
  modulo?: Modulo
  state?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Modulo {
  _id: string
  name: string
  description?: string
  state?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateViewDto {
  name: string
  description: string
  route: string
  moduloId: string
  state?: boolean
}

export interface UpdateViewDto extends Partial<CreateViewDto> {
  // Interface para actualizaciones de vistas
}

// Obtener todas las vistas
export async function obtenerVistas(token: string): Promise<View[]> {
  const response = await fetch(`${API_BASE_URL}/views`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener vistas")
  }

  const data = await response.json()
  return data.result || data
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

// Crear una nueva vista
export async function crearVista(token: string, data: CreateViewDto): Promise<View> {
  const response = await fetch(`${API_BASE_URL}/views`, {
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
    throw new Error(error.message || "Error al crear vista")
  }

  const result = await response.json()
  return result.result || result
}

// Actualizar una vista
export async function actualizarVista(token: string, id: string, data: UpdateViewDto): Promise<View> {
  const response = await fetch(`${API_BASE_URL}/views/${id}`, {
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
    throw new Error(error.message || "Error al actualizar vista")
  }

  const result = await response.json()
  return result.result || result
}

// Eliminar una vista
export async function eliminarVista(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/views/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al eliminar vista")
  }
}

// Cambiar estado de una vista
export async function cambiarEstadoVista(token: string, id: string, state: boolean): Promise<View> {
  const response = await fetch(`${API_BASE_URL}/views/${id}/state`, {
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
    throw new Error(error.message || "Error al cambiar estado de vista")
  }

  const result = await response.json()
  return result.result || result
}
