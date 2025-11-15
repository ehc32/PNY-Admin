const API_BASE_URL = "https://stingray-app-e496q.ondigitalocean.app"

export interface MaintenanceStats {
  All: number
  Executed: number
  Pending: number
}

export interface WorkOrderStats {
  resumen: {
    total: number
    ejecutadas: number
    vencidas: number
    pendientes: number
    proximasAVencer: number
  }
  porTecnico: any[]
  ultimaActualizacion: string
}

// Obtener estadísticas de mantenimiento
export async function getMaintenanceStats(token: string): Promise<MaintenanceStats> {
  const response = await fetch(`${API_BASE_URL}/application-maintenance/statics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener estadísticas de mantenimiento")
  }

  return response.json()
}

// Obtener estadísticas de órdenes de trabajo
export async function getWorkOrderStats(token: string): Promise<WorkOrderStats> {
  const response = await fetch(`${API_BASE_URL}/word-orden/statics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener estadísticas de órdenes de trabajo")
  }

  return response.json()
}
