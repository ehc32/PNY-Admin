const API_BASE_URL = "https://stingray-app-e496q.ondigitalocean.app"

export interface Category {
  _id: string
  name: string
  operationVars: string[]
  accessories: string[]
  specs: string[]
  state: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDto {
  name: string
  operationVars: string[]
  accessories: string[]
  specs: string[]
  state?: boolean
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  // Interface para actualizaciones de categorías
}

// Obtener todas las categorías
export async function obtenerCategorias(token: string): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categorias`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener categorías")
  }

  const data = await response.json()
  return data.result || data
}

// Obtener una categoría por ID
export async function obtenerCategoriaPorId(token: string, id: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener categoría")
  }

  const data = await response.json()
  return data.result || data
}

// Crear una nueva categoría
export async function crearCategoria(token: string, categoryData: CreateCategoryDto): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categorias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al crear categoría")
  }

  const result = await response.json()
  return result.result || result
}

// Actualizar una categoría
export async function actualizarCategoria(token: string, id: string, categoryData: UpdateCategoryDto): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al actualizar categoría")
  }

  const result = await response.json()
  return result.result || result
}

// Eliminar una categoría
export async function eliminarCategoria(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al eliminar categoría")
  }
}

// Cambiar estado de una categoría
export async function cambiarEstadoCategoria(token: string, id: string, state: boolean): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
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
    throw new Error(error.message || "Error al cambiar estado de categoría")
  }

  const result = await response.json()
  return result.result || result
}
