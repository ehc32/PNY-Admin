// lib/api/work-orders-service.ts

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://stingray-app-e496q.ondigitalocean.app"

export type Prioridad = "alta" | "media" | "baja"

export interface CreateWorkOrderPayload {
    fechaInicio: string   // ISO: 'YYYY-MM-DD' o ISO completo
    fechaFin: string      // ISO
    instructorId: string  // id del usuario autenticado (autorizado por)
    prioridad: Prioridad
    radicado: string      // OT-05-11-2025
    solicitud: string     // id de la solicitud de mantenimiento
    state: boolean        // false al crear
    tecnicoId: string     // id del técnico seleccionado
}

export interface WorkOrder {
    _id: string
    fechaInicio: string
    fechaFin: string
    instructorId: string
    prioridad: Prioridad
    radicado: string
    solicitud: string | WorkOrderSolicitudLite
    state: boolean
    tecnicoId: string
    createdAt?: string
    updatedAt?: string
}


export interface WorkOrderEstadoTiempo {
    diasRestantes: number
    diasRetraso: number
    estaVencida: boolean
    estaProximaAVencer: boolean
    estaFinalizada: boolean
}

// puedes mover este tipo a un archivo común si quieres reutilizarlo
export type WorkOrderSolicitudLite = {
    _id: string
    requesterName: string
    requesterPhone: string
    serialNumber: string
    maintenanceType: string
    issueDescription: string
    trackingNumber?: string
    assetInfo?: {
        name?: string
        location?: string
        brand?: string
        modelo?: string
        equipmentType?: string
        inventoryCode?: string
    }
}

/**
 * Crea una orden de trabajo
 */
export async function createWorkOrder(
    token: string,
    payload: CreateWorkOrderPayload,
): Promise<WorkOrder> {
    const res = await fetch(`${API_BASE}/word-orden`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    })

    if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        throw new Error(
            errorText || `Error al crear la orden de trabajo (${res.status})`,
        )
    }

    return res.json()
}

/**
 * Detalle de solicitud de mantenimiento
 * GET /application-maintenance/Consultar/:id
 * Usamos `any` porque no conocemos el shape exacto.
 */
export async function getMaintenanceDetail(
    id: string,
    token?: string,
): Promise<any> {
    const res = await fetch(
        `${API_BASE}/application-maintenance/Consultar/${id}`,
        {
            headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : undefined,
        },
    )

    if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(
            text ||
            `Error al obtener la solicitud de mantenimiento (${res.status})`,
        )
    }

    return res.json()
}

/**
 * Lista de técnicos
 * GET /users/Tecnicos
 */
export interface Technician {
    _id: string
    name: string
    phone?: string
    email?: string
}

export async function getTechnicians(token?: string): Promise<Technician[]> {
    const res = await fetch(`${API_BASE}/users/Tecnicos`, {
        headers: token
            ? {
                Authorization: `Bearer ${token}`,
            }
            : undefined,
    })

    if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `Error al obtener técnicos (${res.status})`)
    }

    const json = await res.json()

    // 👇 Aquí nos aseguramos de devolver SIEMPRE un array
    if (Array.isArray(json)) {
        return json as Technician[]
    }

    if (Array.isArray(json.data)) {
        return json.data as Technician[]
    }

    console.warn("Respuesta de /users/Tecnicos no es un array:", json)
    return []
}

export async function getWorkOrderById(
    token: string,
    id: string,
): Promise<WorkOrder & { estadoTiempo?: WorkOrderEstadoTiempo }> {
    const res = await fetch(`${API_BASE}/word-orden/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(
            text || `Error al obtener la orden de trabajo (${res.status})`,
        )
    }

    const json = await res.json()
    // tu API suele devolver el objeto directo, sin "data", así que lo regresamos tal cual
    return json as WorkOrder & { estadoTiempo?: WorkOrderEstadoTiempo }
}
