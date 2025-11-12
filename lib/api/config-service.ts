const API_BASE_URL = "https://stingray-app-e496q.ondigitalocean.app"

export interface SystemConfig {
  _id?: string
  emailConfig: {
    host: string
    user: string
    password: string
    defaults: string
  }
  smsConfig: {
    url: string
    apiKey: string
    number: string
  }
  wssConfig: {
    hostname: string
    apiKey: string
    fromNumber: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface UpdateConfigDto {
  emailConfig?: {
    host: string
    user: string
    password: string
    defaults: string
  }
  smsConfig?: {
    url: string
    apiKey: string
    number: string
  }
  wssConfig?: {
    hostname: string
    apiKey: string
    fromNumber: string
  }
}

// Obtener configuración del sistema
export async function obtenerConfiguracion(token: string): Promise<SystemConfig> {
  const response = await fetch(`${API_BASE_URL}/config`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al obtener configuración")
  }

  const data = await response.json()
  return data.result || data
}

// Actualizar configuración del sistema
export async function actualizarConfiguracion(token: string, data: UpdateConfigDto): Promise<SystemConfig> {
  const response = await fetch(`${API_BASE_URL}/config`, {
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
    throw new Error(error.message || "Error al actualizar configuración")
  }

  const result = await response.json()
  return result.result || result
}

// Crear configuración inicial del sistema
export async function crearConfiguracion(token: string, data: SystemConfig): Promise<SystemConfig> {
  const response = await fetch(`${API_BASE_URL}/config`, {
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
    throw new Error(error.message || "Error al crear configuración")
  }

  const result = await response.json()
  return result.result || result
}

// Eliminar configuración del sistema
export async function eliminarConfiguracion(token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/config`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al eliminar configuración")
  }
}

// Probar configuración de email
export async function probarConfigEmail(token: string, emailConfig: SystemConfig['emailConfig']): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/config/test-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ emailConfig }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al probar configuración de email")
  }

  const result = await response.json()
  return result.result || result
}

// Probar configuración de SMS
export async function probarConfigSMS(token: string, smsConfig: SystemConfig['smsConfig']): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/config/test-sms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ smsConfig }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al probar configuración de SMS")
  }

  const result = await response.json()
  return result.result || result
}
