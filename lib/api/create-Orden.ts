// lib/api/work-orders-service.ts
import { createApiUrl, createAuthHeaders } from "./api-config"

export interface WorkOrderEstadoTiempo {
  diasRestantes: number
  diasRetraso: number
  estaVencida: boolean
  estaProximaAVencer: boolean
  estaFinalizada: boolean
}

export interface WorkOrder {
  _id: string
  radicado: string
  tecnicoId: {
    _id: string
    name: string
    email: string
    phone?: string
  }
  instructorId: {
    _id: string
    name: string
    email: string
  }
  fechaInicio: string
  fechaFin: string
  prioridad: "alta" | "media" | "baja" | string
  solicitud: {
    _id: string
    trackingNumber: string
    serialNumber: string
    maintenanceType: string
    asset?: {
      _id: string
      name: string
      location?: string
      status?: boolean
      image?: string
    }
  }
  state: boolean
  deletedAt?: string | null
  notifiedExpiration?: boolean
  createdAt: string
  updatedAt: string
  estadoTiempo?: WorkOrderEstadoTiempo
}

export interface WorkOrderListResponse {
  data: WorkOrder[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 🔹 Listar órdenes de trabajo con paginación
export async function obtenerOrdenesTrabajo(
  token: string,
  limit: number = 10,
  page: number = 1,
): Promise<WorkOrderListResponse> {
  const res = await fetch(createApiUrl(`/word-orden?limit=${limit}&page=${page}`), {
    method: "GET",
    headers: createAuthHeaders(token),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener las órdenes de trabajo")
  }

  const json = await res.json()

  // Soportar dos posibles formatos: { data, meta } o solo array
  if (Array.isArray(json)) {
    return {
      data: json,
      total: json.length,
      page,
      limit,
      totalPages: 1,
    }
  }

  const meta = json.meta ?? {}
  const data: WorkOrder[] = json.data ?? []

  const total = meta.total ?? json.total ?? data.length
  const currentPage = meta.page ?? json.page ?? page
  const currentLimit = meta.limit ?? json.limit ?? limit
  const totalPages = meta.totalPages ?? Math.ceil((total || 1) / currentLimit)

  return {
    data,
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages,
  }
}

// 🔹 Eliminar orden de trabajo
export async function eliminarOrdenTrabajo(token: string, id: string): Promise<void> {
  const res = await fetch(createApiUrl(`/word-orden/${id}`), {
    method: "DELETE",
    headers: createAuthHeaders(token),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || "Error al eliminar la orden de trabajo")
  }
}
