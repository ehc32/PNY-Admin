// Configuración centralizada de la API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://stingray-app-e496q.ondigitalocean.app",
  TIMEOUT: 30000, // 30 segundos
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
}

// Helper para crear headers con autenticación
export const createAuthHeaders = (token: string) => ({
  ...API_CONFIG.HEADERS,
  Authorization: `Bearer ${token}`,
})

// Helper para crear URL completa
export const createApiUrl = (endpoint: string) => {
  const baseUrl = API_CONFIG.BASE_URL.endsWith('/') 
    ? API_CONFIG.BASE_URL.slice(0, -1) 
    : API_CONFIG.BASE_URL
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${baseUrl}${cleanEndpoint}`
}
