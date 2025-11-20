// lib/api/work-report-service.ts
import { createApiUrl, createAuthHeaders } from "./api-config"

export interface WorkReportOrder {
  _id: string
  radicado: string
  tecnicoId: {
    _id: string
    name: string
    email?: string
    phone?: string
  }
  instructorId: {
    _id: string
    name: string
    email?: string
  }
  solicitud?: {
    _id: string
    InventoryCode?: string
  }
  state: boolean
  id?: string
}

export interface WorkReport {
  _id: string
  Informe: string
  costs: number | null
  hours: number
  responses: string
  observation: string
  workDone: string
  orderId: WorkReportOrder
  status: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkReportListResponse {
  data: WorkReport[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function obtenerInformesTrabajo(
  token: string,
  limit: number = 10,
  page: number = 1,
): Promise<WorkReportListResponse> {
  const res = await fetch(createApiUrl(`/work-report?limit=${limit}&page=${page}`), {
    method: "GET",
    headers: createAuthHeaders(token),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener los informes de trabajo")
  }

  const json = await res.json()

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
  const data: WorkReport[] = json.data ?? []

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

// 🔹 Actualizar informe
export async function actualizarInformeTrabajo(
  token: string,
  id: string,
  payload: Partial<Pick<WorkReport, "hours" | "workDone" | "responses" | "observation" | "status" | "costs">>,
): Promise<WorkReport> {
  const res = await fetch(createApiUrl(`/work-report/${id}`), {
    method: "PATCH",
    headers: createAuthHeaders(token),
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || "Error al actualizar el informe de trabajo")
  }

  const data = await res.json()
  return data.result || data
}

// 🔹 Eliminar informe
export async function eliminarInformeTrabajo(token: string, id: string): Promise<void> {
  const res = await fetch(createApiUrl(`/work-report/${id}`), {
    method: "DELETE",
    headers: createAuthHeaders(token),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || "Error al eliminar el informe de trabajo")
  }
}
