# 👥 Sistema de Gestión de Usuarios

## 📋 Páginas Creadas

### 1. Control de Acceso (`/users/access`)
**Ruta**: `/users/access`  
**Archivo**: `app/(dashboard)/users/access/page.tsx`

#### Funcionalidades:
- ✅ Visualizar todos los usuarios del sistema
- ✅ Asignar roles a usuarios
- ✅ Asignar posiciones a usuarios
- ✅ Ver estado de cada usuario (activo, inactivo, pendiente)
- ✅ Búsqueda y filtrado de usuarios
- ✅ Paginación de resultados

#### Columnas de la tabla:
- Nombre
- Email
- Documento (tipo y número)
- Rol Asignado (badge con color)
- Posición (badge)
- Estado (badge con colores: verde=activo, rojo=inactivo, amarillo=pendiente)

#### Modal de edición:
- Información del usuario
- Selector de rol (desde API `/rol`)
- Selector de posición (Developer, Manager, Admin, User)
- Botones: Cancelar y Guardar cambios

---

### 2. Gestión de Usuarios (`/users/control`)
**Ruta**: `/users/control`  
**Archivo**: `app/(dashboard)/users/control/page.tsx`

#### Funcionalidades:
- ✅ Listar todos los usuarios del sistema
- ✅ Ver detalles completos de cada usuario
- ✅ Eliminar usuarios
- ✅ Búsqueda y filtrado
- ✅ Paginación de resultados

#### Columnas de la tabla:
- Nombre
- Email
- Teléfono
- Documento (tipo y número)
- Rol
- Estado

#### Modal de detalles:
Muestra información completa:
- Nombre completo
- Estado
- Email
- Teléfono
- Tipo de documento
- Número de documento
- Rol asignado
- Posición
- Fecha de registro

#### Modal de eliminación:
- Confirmación con advertencia
- Mensaje de acción irreversible
- Botones: Cancelar y Eliminar usuario

---

## 🔧 Componentes Creados

### 1. GenericTable (`components/generic-table.tsx`)
Tabla dinámica reutilizable con TypeScript genérico.

#### Props:
```typescript
interface GenericTableProps<T> {
  data: T[]                          // Datos a mostrar
  columns: TableColumn<T>[]          // Definición de columnas
  isLoading?: boolean                // Estado de carga
  onNew?: () => void                 // Callback para crear nuevo
  onEdit?: (item: T) => void         // Callback para editar
  onDelete?: (item: T) => void       // Callback para eliminar
  onRefresh?: () => void             // Callback para recargar
  title?: string                     // Título de la tabla
  description?: string               // Descripción
  showActions?: boolean              // Mostrar columna de acciones
  pageSize?: number                  // Tamaño de página (default: 10)
  searchPlaceholder?: string         // Placeholder del buscador
}
```

#### Características:
- ✅ Ordenamiento por columnas
- ✅ Filtrado/búsqueda
- ✅ Paginación
- ✅ Selección múltiple con checkboxes
- ✅ Columnas ocultables
- ✅ Menú de acciones (ver/editar, eliminar)
- ✅ Estados de carga con skeleton
- ✅ Mensaje cuando no hay datos
- ✅ Renderizado personalizado por columna
- ✅ Totalmente tipado con TypeScript

#### Ejemplo de uso:
```typescript
const columns: TableColumn<User>[] = [
  {
    id: "name",
    label: "Nombre",
    accessor: "name",
    sortable: true,
  },
  {
    id: "email",
    label: "Email",
    accessor: "email",
    sortable: true,
    render: (value) => <a href={`mailto:${value}`}>{value}</a>
  }
]

<GenericTable
  data={users}
  columns={columns}
  isLoading={loading}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onRefresh={fetchData}
  title="Usuarios"
  description="Gestiona los usuarios del sistema"
/>
```

---

## 🌐 Servicios API

### Archivo: `lib/api/users-service.ts`

#### Endpoints implementados:

1. **getUsers(token)** - GET `/users`
   - Obtiene todos los usuarios
   - Requiere autenticación

2. **getUserById(id, token)** - GET `/users/:id`
   - Obtiene un usuario específico
   - Requiere autenticación

3. **updateUser(id, data, token)** - PATCH `/users/:id`
   - Actualiza datos del usuario
   - Usado para asignar rol y posición
   - Requiere autenticación

4. **deleteUser(id, token)** - DELETE `/users/:id`
   - Elimina un usuario
   - Requiere autenticación

5. **getRoles(token)** - GET `/rol`
   - Obtiene todos los roles disponibles
   - Requiere autenticación

#### Interfaces TypeScript:
```typescript
interface User {
  _id: string
  name: string
  email: string
  phone: string
  typeDocument: string
  numberDocument: string
  assignedPosition?: string
  assignedRol?: {
    _id: string
    name: string
  }
  state?: string
  createdAt?: string
  updatedAt?: string
}

interface Rol {
  _id: string
  name: string
  description?: string
}
```

---

## 🎨 Mejoras en Registro

### Pantalla de Espera Post-Registro
Después de un registro exitoso, se muestra:

- ✅ Mensaje de confirmación
- ✅ Indicador de "Esperando aprobación"
- ✅ Información sobre el proceso
- ✅ Botón para volver al login
- ✅ No redirige automáticamente

**Archivo modificado**: `components/registro-form.tsx`

---

## 📁 Estructura de Archivos

```
Panel-de-Admin-/
├── app/
│   └── (dashboard)/
│       └── users/
│           ├── access/
│           │   └── page.tsx          # Control de Acceso
│           └── control/
│               └── page.tsx          # Gestión de Usuarios
├── components/
│   ├── generic-table.tsx            # Tabla dinámica reutilizable
│   └── registro-form.tsx            # Actualizado con pantalla de espera
└── lib/
    └── api/
        └── users-service.ts         # Servicios API de usuarios
```

---

## 🚀 Cómo Usar

### 1. Acceder a las páginas:
- Control de Acceso: http://localhost:3000/users/access
- Gestión de Usuarios: http://localhost:3000/users/control

### 2. Control de Acceso:
1. Ver lista de usuarios
2. Hacer clic en "Ver/Editar" en el menú de acciones
3. Seleccionar rol desde el dropdown (carga desde `/rol`)
4. Seleccionar posición
5. Guardar cambios

### 3. Gestión de Usuarios:
1. Ver lista completa de usuarios
2. Hacer clic en "Ver/Editar" para ver detalles
3. Hacer clic en "Eliminar" para eliminar (con confirmación)
4. Usar el buscador para filtrar
5. Usar "Recargar" para actualizar datos

---

## 🔐 Autenticación

Todas las páginas requieren:
- Token JWT válido (obtenido del contexto de autenticación)
- El token se envía en el header `Authorization: Bearer {token}`

---

## 🎯 Características de la Tabla Genérica

### Ventajas:
- ✅ **Reutilizable**: Úsala en cualquier página con cualquier tipo de dato
- ✅ **Type-safe**: Totalmente tipada con TypeScript
- ✅ **Flexible**: Renderizado personalizado por columna
- ✅ **Completa**: Incluye todas las funcionalidades necesarias
- ✅ **Moderna**: UI con shadcn/ui y Tailwind CSS
- ✅ **Responsive**: Funciona en móviles y desktop

### Ejemplo para otras entidades:
```typescript
// Para productos
const productColumns: TableColumn<Product>[] = [
  { id: "name", label: "Producto", accessor: "name", sortable: true },
  { id: "price", label: "Precio", accessor: "price", 
    render: (value) => `$${value.toFixed(2)}` 
  },
]

<GenericTable
  data={products}
  columns={productColumns}
  onNew={() => setShowNewModal(true)}
  title="Productos"
/>
```

---

## 📝 Notas Importantes

1. **Posiciones disponibles**: Developer, Manager, Admin, User
2. **Estados de usuario**: active, inactive, pending
3. **Los roles se cargan dinámicamente** desde la API `/rol`
4. **Todos los cambios se reflejan inmediatamente** después de guardar
5. **La tabla se recarga automáticamente** después de editar o eliminar

---

## 🐛 Solución de Problemas

### Si no aparecen los usuarios:
- Verifica que el token sea válido
- Revisa la consola del navegador
- Verifica que la API esté respondiendo en `/users`

### Si no aparecen los roles:
- Verifica que la API `/rol` esté funcionando
- Revisa los permisos del token

### Si hay errores de TypeScript:
- Los errores temporales se resolverán al recompilar
- Reinicia el servidor de desarrollo si persisten
