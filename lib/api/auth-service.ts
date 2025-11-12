const API_BASE_URL = "https://stingray-app-e496q.ondigitalocean.app"

export interface RegistroData {
  name: string
  email: string
  phone: string
  typeDocument: string
  numberDocument: string
  password: string
  assignedPosition?: string
  assignedRol?: string
}

export interface LoginData {
  document: string
  password: string
  typeDocument: string
}

export interface RecuperacionData {
  typeDocument: string
  numberDocument: string
}

export interface VerificarCodigoData {
  userId: string
  code: string
}

export interface ResetPasswordData {
  userId: string
  code: string
  nuevaContrasena: string
}

export interface EnviarCodigoData {
  userId: string
  method: "email" | "whatsapp"
}

// Servicio de Registro
export async function registrarUsuario(data: RegistroData) {
  const response = await fetch(`${API_BASE_URL}/auth/registro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error en el registro")
  }

  return response.json()
}

// Servicio de Login
export async function loginUsuario(data: LoginData) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error en el inicio de sesión")
  }

  return response.json()
}

// Iniciar recuperación de contraseña
export async function iniciarRecuperacion(data: RecuperacionData) {
  const response = await fetch(`${API_BASE_URL}/auth/iniciar-recuperacion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al iniciar recuperación")
  }

  return response.json()
}

// Verificar código OTP
export async function verificarCodigo(data: VerificarCodigoData) {
  const response = await fetch(`${API_BASE_URL}/auth/verify-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Código inválido o expirado")
  }

  return response.json()
}

// Resetear contraseña
export async function resetearPassword(data: ResetPasswordData) {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al restablecer contraseña")
  }

  return response.json()
}

// Enviar código por email o WhatsApp
export async function enviarCodigo(data: EnviarCodigoData) {
  const response = await fetch(`${API_BASE_URL}/auth/enviar-codigo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Error al enviar código")
  }

  return response.json()
}
