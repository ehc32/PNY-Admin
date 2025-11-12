const API_BASE_URL = "https://stingray-app-e496q.ondigitalocean.app"

export interface ActionLog {
  _id: string
  userId: string
  user?: {
    _id: string
    name: string
    email: string
  }
  dateTime: string
  action: string
  moduloId: string
  modulo?: {
    _id: string
    name: string
    description?: string
  }
  state?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateActionLogDto {
  userId: string
  dateTime: Date
  action: string
  moduloId: string
  state?: boolean
}

export interface UpdateActionLogDto extends Partial<CreateActionLogDto> {
  // Interface para futuras actualizaciones de action logs
}

export interface ActionLogFilters {
  userId?: string
  moduloId?: string
  action?: string
  startDate?: string
  endDate?: string
  state?: boolean
  page?: number
  limit?: number
}

// Obtener todos los action logs con filtros
export async function obtenerActionLogs(token: string, filters?: ActionLogFilters): Promise<{
  data: ActionLog[]
  total: number
  page: number
  totalPages: number
}> {
  const queryParams = new URLSearchParams()
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value))
      }
    })
  }

  const url = `${API_BASE_URL}/action-log${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener logs de acciones")
  }

  const data = await response.json()
  return data.result || data
}

// Obtener un action log por ID
export async function obtenerActionLogPorId(token: string, id: string): Promise<ActionLog> {
  const response = await fetch(`${API_BASE_URL}/action-log/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener log de acción")
  }

  const data = await response.json()
  return data.result || data
}

// Crear un nuevo action log
export async function crearActionLog(token: string, data: CreateActionLogDto): Promise<ActionLog> {
  const response = await fetch(`${API_BASE_URL}/action-log`, {
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
    throw new Error(error.message || "Error al crear log de acción")
  }

  const result = await response.json()
  return result.result || result
}

// Actualizar un action log
export async function actualizarActionLog(token: string, id: string, data: UpdateActionLogDto): Promise<ActionLog> {
  const response = await fetch(`${API_BASE_URL}/action-log/${id}`, {
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
    throw new Error(error.message || "Error al actualizar log de acción")
  }

  const result = await response.json()
  return result.result || result
}

// Eliminar un action log
export async function eliminarActionLog(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/action-log/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al eliminar log de acción")
  }
}

// Cambiar estado de un action log
export async function cambiarEstadoActionLog(token: string, id: string, state: boolean): Promise<ActionLog> {
  const response = await fetch(`${API_BASE_URL}/action-log/${id}/state`, {
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
    throw new Error(error.message || "Error al cambiar estado del log de acción")
  }

  const result = await response.json()
  return result.result || result
}

// Obtener estadísticas de action logs
export async function obtenerEstadisticasActionLogs(token: string): Promise<{
  totalLogs: number
  logsPorModulo: Array<{ moduloId: string; moduloName: string; count: number }>
  logsPorAccion: Array<{ action: string; count: number }>
  logsPorDia: Array<{ date: string; count: number }>
}> {
  const response = await fetch(`${API_BASE_URL}/action-log/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener estadísticas")
  }

  const data = await response.json()
  return data.result || data
}
