import { createApiUrl, createAuthHeaders } from "./api-config"

export interface Category {
  _id: string
  name: string
  operationVars: string[]
  accessories: string[]
}

export interface Environment {
  _id: string
  name: string
}

export interface Asset {
  _id: string
  name: string
  location: string
  acquisitionDate: string
  brand: string
  modelo: string
  equipmentType: string
  serialNumber: string
  inventoryCode: string
  accountHolder: string
  categoryId: string | Category
  environmentId: string | Environment
  manufacturer: {
    name: string
    address: string
    phone: string
  }
  supplier: {
    name: string
    address: string
    phone: string
  }
  status: boolean
  createdAt: string
  updatedAt: string
  image?: string
}

export interface AssetsResponse {
  data: Asset[]
  total?: number
  page?: number
  limit?: number
}

// Obtener todos los bienes con paginación
export async function obtenerBienes(
  token: string, 
  limit: number = 10, 
  page: number = 1
): Promise<AssetsResponse> {
  const response = await fetch(createApiUrl(`/assets?limit=${limit}&page=${page}`), {
    method: "GET",
    headers: createAuthHeaders(token),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener bienes")
  }

  const data = await response.json()
  return data
}

// Obtener un bien por ID
export async function obtenerBienPorId(token: string, id: string): Promise<Asset> {
  const response = await fetch(createApiUrl(`/assets/${id}`), {
    method: "GET",
    headers: createAuthHeaders(token),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener bien")
  }

  const data = await response.json()
  return data.result || data
}

// Crear un nuevo bien
export async function crearBien(token: string, assetData: Partial<Asset>): Promise<Asset> {
  const response = await fetch(createApiUrl("/assets"), {
    method: "POST",
    headers: createAuthHeaders(token),
    body: JSON.stringify(assetData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al crear bien")
  }

  const data = await response.json()
  return data.result || data
}

// Actualizar un bien
export async function actualizarBien(token: string, id: string, assetData: Partial<Asset>): Promise<Asset> {
  const response = await fetch(createApiUrl(`/assets/${id}`), {
    method: "PUT",
    headers: createAuthHeaders(token),
    body: JSON.stringify(assetData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al actualizar bien")
  }

  const data = await response.json()
  return data.result || data
}

// Eliminar un bien
export async function eliminarBien(token: string, id: string): Promise<void> {
  const response = await fetch(createApiUrl(`/assets/${id}`), {
    method: "DELETE",
    headers: createAuthHeaders(token),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al eliminar bien")
  }
}

// Cambiar estado de un bien
export async function cambiarEstadoBien(token: string, id: string, nuevoEstado: boolean): Promise<Asset> {
  const response = await fetch(createApiUrl(`/assets/${id}`), {
    method: "PATCH",
    headers: createAuthHeaders(token),
    body: JSON.stringify({ status: nuevoEstado }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al cambiar estado del bien")
  }

  const data = await response.json()
  return data.result || data
}

// Exportar bienes a CSV
export async function exportarBienes(token: string): Promise<Blob> {
  const response = await fetch(createApiUrl("/assets/export"), {
    method: "GET",
    headers: createAuthHeaders(token),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al exportar bienes")
  }

  return response.blob()
}

// Importar bienes desde CSV
export async function importarBienes(token: string, file: File): Promise<{ success: number; errors: string[] }> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(createApiUrl("/assets/import"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al importar bienes")
  }

  const data = await response.json()
  return data.result || data
}
