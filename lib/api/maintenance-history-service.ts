import { createApiUrl, createAuthHeaders } from "./api-config"

export interface MaintenanceHistory {
  _id: string
  maintenanceType: string
  workOrder: string
  maintenanceReport: string
  hours: number
  cost: number
  description: string
  serialNumber: string
  createdAt: string
  updatedAt?: string
}

export interface MaintenanceHistoryResponse {
  data: MaintenanceHistory[]
  total: number
  page: number
  limit: number
}

// Obtener historial de mantenimientos por número de serie
export async function obtenerHistorialPorSerie(
  token: string,
  serialNumber: string,
  limit: number = 5,
  page: number = 1
): Promise<MaintenanceHistoryResponse> {
  const response = await fetch(createApiUrl(`/work-report/maintenanceHistory/${serialNumber}?limit=${limit}&page=${page}`), {
    method: "GET",
    headers: createAuthHeaders(token),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener historial de mantenimientos")
  }

  const data = await response.json()
  return {
    data: data.data || [],
    total: data.total || 0,
    page: data.page || page,
    limit: data.limit || limit
  }
}

// Obtener historial completo de mantenimientos por número de serie
export async function obtenerHistorialCompleto(
  token: string,
  serialNumber: string
): Promise<MaintenanceHistory[]> {
  const response = await fetch(createApiUrl(`/work-report/maintenanceHistory/${serialNumber}?limit=1000`), {
    method: "GET",
    headers: createAuthHeaders(token),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener historial completo de mantenimientos")
  }

  const data = await response.json()
  return data.data || []
}
