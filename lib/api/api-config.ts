// lib/api/api-config.ts

export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://stingray-app-e496q.ondigitalocean.app",
  TIMEOUT: 30000, // 30 segundos
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // si tu API usa un token fijo, ponlo aquí:
    // auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN || "",
  },
}

// Si más adelante tienes auth real por usuario, aquí lo adaptas
export const createAuthHeaders = (token: string) => ({
  ...API_CONFIG.HEADERS,
  Authorization: `Bearer ${token}`,
})

export const createApiUrl = (endpoint: string) => {
  const baseUrl = API_CONFIG.BASE_URL.endsWith("/")
    ? API_CONFIG.BASE_URL.slice(0, -1)
    : API_CONFIG.BASE_URL
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  return `${baseUrl}${cleanEndpoint}`
}
