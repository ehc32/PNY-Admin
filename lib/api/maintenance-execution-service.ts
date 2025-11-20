// lib/api/maintenance-execution-service.ts
import { createApiUrl, createAuthHeaders } from "./api-config"

export type CreateMaintenanceExecutionPayload = {
  typeMaintenance: string
  description: string
  observation: string
  sparePartsStatus: "Si" | "No" | "No aplica"
  sparePartsDetails?: string
  state: boolean
  technicalId: string
  technicalSignature: string // base64 / dataURL
  timeEstimate: number
  wordOrdenId: string
}

export async function createMaintenanceExecution(
  token: string,
  body: CreateMaintenanceExecutionPayload,
) {
  const res = await fetch(createApiUrl("/maintenance"), {
    method: "POST",
    headers: createAuthHeaders(token),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(
      error.message || `Error al registrar mantenimiento (${res.status})`,
    )
  }

  return res.json()
}
