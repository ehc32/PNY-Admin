import { createApiUrl, createAuthHeaders } from "./api-config"

export interface MaintenanceRequest {
  _id?: string
  requesterName: string
  requesterPhone: string
  serialNumber: string
  trackingNumber: string
  issueDescription: string
  inventoryCode: string
  maintenanceType: string
  workOrderStatus: boolean
  createdAt: string
  updatedAt?: string
}

export interface MaintenanceResponse {
  data: MaintenanceRequest[]
  total: number
  page: number
  limit: number
}

// Crear solicitud de mantenimiento
export async function crearSolicitudMantenimiento(
  token: string, 
  requestData: Omit<MaintenanceRequest, '_id' | 'updatedAt'>
): Promise<MaintenanceRequest> {
  const response = await fetch(createApiUrl("/application-maintenance"), {
    method: "POST",
    headers: createAuthHeaders(token),
    body: JSON.stringify(requestData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al crear solicitud de mantenimiento")
  }

  const data = await response.json()
  return data.result || data
}

// Obtener solicitudes de mantenimiento con paginación
export async function obtenerSolicitudesMantenimiento(
  token: string,
  limit: number = 10,
  page: number = 1
): Promise<MaintenanceResponse> {
  const response = await fetch(createApiUrl(`/application-maintenance?limit=${limit}&page=${page}`), {
    method: "GET",
    headers: createAuthHeaders(token),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener solicitudes de mantenimiento")
  }

  const data = await response.json()
  return {
    data: data.data || [],
    total: data.total || 0,
    page: data.page || page,
    limit: data.limit || limit
  }
}

// Obtener solicitud de mantenimiento por ID
export async function obtenerSolicitudPorId(token: string, id: string): Promise<MaintenanceRequest> {
  const response = await fetch(createApiUrl(`/application-maintenance/${id}`), {
    method: "GET",
    headers: createAuthHeaders(token),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener solicitud de mantenimiento")
  }

  const data = await response.json()
  return data.result || data
}

// Obtener solicitud por número de radicado
export async function obtenerSolicitudPorRadicado(token: string, trackingNumber: string): Promise<MaintenanceRequest> {
  const response = await fetch(createApiUrl(`/application-maintenance/tracking/${trackingNumber}`), {
    method: "GET",
    headers: createAuthHeaders(token),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener solicitud de mantenimiento")
  }

  const data = await response.json()
  return data.result || data
}

// Actualizar solicitud de mantenimiento
export async function actualizarSolicitudMantenimiento(
  token: string, 
  id: string, 
  requestData: Partial<MaintenanceRequest>
): Promise<MaintenanceRequest> {
  const response = await fetch(createApiUrl(`/application-maintenance/${id}`), {
    method: "PUT",
    headers: createAuthHeaders(token),
    body: JSON.stringify(requestData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al actualizar solicitud de mantenimiento")
  }

  const data = await response.json()
  return data.result || data
}

// Cambiar estado de orden de trabajo
export async function cambiarEstadoOrdenTrabajo(
  token: string, 
  id: string, 
  nuevoEstado: boolean
): Promise<MaintenanceRequest> {
  const response = await fetch(createApiUrl(`/application-maintenance/${id}/status`), {
    method: "PATCH",
    headers: createAuthHeaders(token),
    body: JSON.stringify({ workOrderStatus: nuevoEstado }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al cambiar estado de orden de trabajo")
  }

  const data = await response.json()
  return data.result || data
}

// Eliminar solicitud de mantenimiento
export async function eliminarSolicitudMantenimiento(token: string, id: string): Promise<void> {
  const response = await fetch(createApiUrl(`/application-maintenance/${id}`), {
    method: "DELETE",
    headers: createAuthHeaders(token),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al eliminar solicitud de mantenimiento")
  }
}
