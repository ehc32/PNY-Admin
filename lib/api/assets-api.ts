// lib/api/assets-api.ts
import { API_CONFIG, createApiUrl } from "./api-config"

export interface AssetCategory {
  _id: string
  name: string
  operationVars: string[]
  accessories: string[]
}

export interface AssetEnvironment {
  _id: string
  name: string
}

export interface AssetContactInfo {
  name: string
  address: string
  phone: string
}

export interface Asset {
  _id: string
  image?: string
  name: string
  location: string
  acquisitionDate: string
  brand: string
  modelo: string
  equipmentType: string
  serialNumber: string
  inventoryCode: string
  accountHolder: string
  categoryId: string | AssetCategory
  environmentId: AssetEnvironment
  manufacturer: AssetContactInfo
  supplier: AssetContactInfo
  status: boolean
  createdAt: string
  updatedAt: string
  lastReportDate?: string | null
}

// GET /assets  -> lista completa de activos
export async function obtenerActivos(): Promise<Asset[]> {
  const response = await fetch(createApiUrl("/assets"), {
    method: "GET",
    headers: API_CONFIG.HEADERS,
    cache: "no-store",
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error("Error /assets:", response.status, error)
    throw new Error(error.message || "Error al obtener activos")
  }

  const data = await response.json()
  console.log("Activos recibidos:", data)
  return data as Asset[]
}

// GET /assets/InventoryCode/:inventoryCode
export async function obtenerActivoPorCodigoInventario(
  inventoryCode: string
): Promise<Asset> {
  const response = await fetch(
    createApiUrl(`/assets/InventoryCode/${encodeURIComponent(inventoryCode)}`),
    {
      method: "GET",
      headers: API_CONFIG.HEADERS,
      cache: "no-store",
    }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error(
      "Error /assets/InventoryCode:",
      inventoryCode,
      response.status,
      error
    )
    throw new Error(
      error.message || "Error al obtener activo por código de inventario"
    )
  }

  const data = await response.json()
  console.log("Activo por código recibido:", data)
  return data as Asset
}
