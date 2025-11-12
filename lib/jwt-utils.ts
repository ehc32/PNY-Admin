// Función para decodificar JWT sin librerías externas
export function decodeJWT(token: string) {
  try {
    // Dividir el token en sus partes
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido')
    }

    // Decodificar el payload (segunda parte)
    const payload = parts[1]
    
    // Agregar padding si es necesario
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4)
    
    // Decodificar base64
    const decodedPayload = atob(paddedPayload)
    
    // Parsear JSON
    return JSON.parse(decodedPayload)
  } catch (error) {
    console.error('Error al decodificar JWT:', error)
    return null
  }
}

// Función para obtener el ID del usuario desde el token
export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJWT(token)
  if (!payload) return null
  
  // Intentar diferentes nombres de campos comunes para el ID
  return payload.id || payload.userId || payload.sub || payload._id || null
}

// Función para obtener información del usuario desde el token
export function getUserInfoFromToken(token: string) {
  const payload = decodeJWT(token)
  if (!payload) return null
  
  return {
    id: payload.id || payload.userId || payload.sub || payload._id || null,
    email: payload.email || null,
    name: payload.name || payload.username || null,
    role: payload.role || null,
    exp: payload.exp || null,
    iat: payload.iat || null
  }
}
