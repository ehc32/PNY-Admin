# 🔧 Sistema de Solicitud de Mantenimiento

## 📋 Descripción General

Sistema público de solicitud de mantenimiento para equipos e inventario de la Regional Huila del SENA. No requiere autenticación para enviar solicitudes.

---

## 🎨 Diseño y Colores

### Paleta de Colores Principal
- **Verde SENA**: `#52B12C`
- **Variantes**:
  - Fondo suave: `#52B12C/5`
  - Borde: `#52B12C/20`
  - Hover: `#52B12C/90`

### Características de Diseño
- ✅ Gradientes suaves con el verde SENA
- ✅ Cards con bordes del color institucional
- ✅ Efectos hover en elementos interactivos
- ✅ Diseño responsive (móvil y desktop)
- ✅ Logo institucional en el header
- ✅ Iconos descriptivos (Lucide React)

---

## 🌐 Ruta y Acceso

### URL Principal
**`/solicitud-mantenimiento`**

Esta es ahora la **página de inicio** del sistema. Cuando un usuario no autenticado accede a `/`, es redirigido automáticamente aquí.

### Flujo de Navegación
```
Usuario sin login → / → /solicitud-mantenimiento
Usuario con login → / → /dashboard
```

---

## 📝 Formulario de Solicitud

### Campos del Formulario

#### Información del Solicitante
1. **Nombre del solicitante** (requerido)
   - Tipo: Texto
   - Placeholder: "Nombre completo"
   - Validación: Máximo 100 caracteres

2. **Número de teléfono** (requerido)
   - Tipo: Tel
   - Placeholder: "Número de teléfono"
   - Validación: Formato de teléfono válido

#### Información del Equipo
3. **Número de serie** (requerido)
   - Tipo: Texto
   - Placeholder: "Número de serie"

4. **Código de inventario** (requerido)
   - Tipo: Texto
   - Placeholder: "Código de inventario"

5. **Tipo de mantenimiento** (requerido)
   - Tipo: Select
   - Opciones:
     - Preventivo
     - Correctivo
     - Predictivo
     - Emergencia

6. **Descripción de la falla** (requerido)
   - Tipo: Textarea
   - Placeholder: "Describe detalladamente la falla..."
   - Validación: Máximo 500 caracteres
   - Contador de caracteres en tiempo real

---

## 🔌 API Endpoint

### POST `/application-maintenance`

**URL Completa**: `https://stingray-app-e496q.ondigitalocean.app/application-maintenance`

#### Request Body
```json
{
  "requesterName": "string",
  "requesterPhone": "string",
  "serialNumber": "string",
  "maintenanceType": "string",
  "InventoryCode": "string",
  "issueDescription": "string"
}
```

#### Response Success
```json
{
  "trackingNumber": "string",
  "message": "Solicitud creada exitosamente"
}
```

#### DTO de Validación (Backend)
```typescript
export class CreateApplicationMaintenanceDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del solicitante es obligatorio.' })
  @MaxLength(100)
  requesterName: string;

  @IsString()
  @IsNotEmpty({ message: 'El número de teléfono del solicitante es obligatorio.' })
  @IsPhoneNumber(null)
  requesterPhone: string;

  trackingNumber?: string;

  @IsString()
  @IsNotEmpty({ message: 'El número de serie es obligatorio' })
  serialNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'El tipo de mantenimiento es obligatorio.' })
  maintenanceType: string;

  @IsString()
  @IsNotEmpty({ message: 'El Codigo Inventario es obligatorio.' })
  InventoryCode: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción de la falla es obligatoria.' })
  @MaxLength(500)
  issueDescription: string;

  @IsBoolean()
  @IsOptional()
  workOrderStatus?: boolean;
}
```

---

## ✅ Pantalla de Éxito

Después de enviar la solicitud exitosamente, se muestra:

### Elementos
- ✅ Icono de check verde
- ✅ Título: "¡Solicitud Enviada!"
- ✅ **Número de seguimiento** (grande y destacado)
- ✅ Información útil:
  - Guardar el número para consultas
  - Notificaciones sobre el progreso
  - Tiempo de respuesta estimado (24-48 horas)

### Acciones Disponibles
- **Nueva Solicitud**: Limpia el formulario y permite crear otra
- **Ir al Login**: Redirige a la página de inicio de sesión

---

## 🎯 Características de la Página

### Header
- Logo institucional (LOGO-1.png)
- Título: "Sistema de Gestión de Inventarios"
- Subtítulo: "Regional Huila"
- Botón "Iniciar Sesión" (esquina superior derecha)

### Hero Section
- Título de bienvenida
- Descripción del servicio
- Diseño centrado y limpio

### Cards de Acción (2 opciones)
1. **Consulta de bienes registrados**
   - Icono: Database
   - Descripción: Ver el inventario completo de equipos

2. **Consulta el estado de tu solicitud**
   - Icono: Search
   - Descripción: Rastrea tu solicitud con el número de seguimiento

### Footer
- Información del centro
- Dirección completa
- Diseño discreto y profesional

---

## 🔐 Integración con Sistema de Usuarios

### Campo de Foto Agregado
En el formulario de agregar usuarios (`/users/add`), ahora incluye:

**Campo**: `photoUrl`
- Tipo: URL
- Opcional
- Placeholder: "https://ejemplo.com/foto.jpg"
- Descripción: URL de la imagen de perfil

Este campo se envía al backend cuando se crea un usuario.

---

## 📱 Responsive Design

### Mobile (< 768px)
- Formulario en una sola columna
- Cards apiladas verticalmente
- Botones full-width
- Header compacto

### Desktop (≥ 768px)
- Formulario en grid de 2-3 columnas
- Cards lado a lado
- Layout optimizado
- Máximo ancho de 5xl (1280px)

---

## 🎨 Componentes UI Utilizados

### shadcn/ui
- `Button` - Botones con estilos personalizados
- `Input` - Campos de texto
- `Textarea` - Área de texto para descripción
- `Select` - Dropdown para tipo de mantenimiento
- `Card` - Contenedores con bordes y sombras
- `Label` - Etiquetas de formulario

### Lucide Icons
- `Wrench` - Mantenimiento
- `CheckCircle2` - Éxito
- `Database` - Inventario
- `Search` - Búsqueda

---

## 🚀 Flujo de Usuario

### 1. Acceso Inicial
```
Usuario → Abre navegador → / → Redirige a /solicitud-mantenimiento
```

### 2. Completar Formulario
```
Usuario → Llena campos requeridos → Click "Enviar solicitud"
```

### 3. Envío y Respuesta
```
Sistema → POST /application-maintenance → Backend procesa → Retorna trackingNumber
```

### 4. Confirmación
```
Sistema → Muestra pantalla de éxito → Número de seguimiento visible
```

### 5. Opciones Post-Envío
```
Usuario → "Nueva Solicitud" (vuelve al formulario)
       → "Ir al Login" (va a /login)
```

---

## 📊 Validaciones del Formulario

### Frontend (React)
- Todos los campos requeridos tienen `required` attribute
- Contador de caracteres para descripción (500 max)
- Validación de formato de teléfono (type="tel")
- Validación de URL para foto de usuario

### Backend (NestJS)
- `@IsNotEmpty()` - Campos no vacíos
- `@IsString()` - Tipo string
- `@IsPhoneNumber()` - Formato de teléfono válido
- `@MaxLength()` - Longitud máxima
- `@IsOptional()` - Campos opcionales

---

## 🎯 Mejoras Implementadas

### Diseño Visual
- ✅ Colores institucionales del SENA (#52B12C)
- ✅ Gradientes suaves en el fondo
- ✅ Cards con efectos hover
- ✅ Iconos descriptivos en cada sección
- ✅ Diseño moderno y profesional

### Experiencia de Usuario
- ✅ Formulario intuitivo y claro
- ✅ Validaciones en tiempo real
- ✅ Mensajes de error descriptivos
- ✅ Pantalla de éxito con número de seguimiento
- ✅ Opciones claras después de enviar

### Funcionalidad
- ✅ No requiere autenticación
- ✅ Integración con API del backend
- ✅ Manejo de errores robusto
- ✅ Estados de carga durante el envío
- ✅ Notificaciones toast

---

## 📁 Archivos Creados/Modificados

### Nuevos
- ✅ `app/solicitud-mantenimiento/page.tsx` - Página principal del formulario

### Modificados
- ✅ `app/page.tsx` - Redirige a solicitud-mantenimiento en lugar de login
- ✅ `app/(dashboard)/users/add/page.tsx` - Agregado campo photoUrl

---

## 🔗 Enlaces Útiles

- **Formulario público**: `/solicitud-mantenimiento`
- **Login**: `/login`
- **Registro**: `/registro`
- **Dashboard**: `/dashboard`
- **Agregar usuario**: `/users/add`
- **Control de acceso**: `/users/access`
- **Gestión de usuarios**: `/users/control`

---

## 📝 Notas Importantes

1. **Primera impresión**: Esta es la primera página que ven los usuarios
2. **Sin autenticación**: Cualquiera puede enviar solicitudes
3. **Número de seguimiento**: Se genera en el backend y se muestra al usuario
4. **Diseño institucional**: Usa los colores y logo del SENA
5. **Responsive**: Funciona perfectamente en móviles y desktop

---

## 🎉 Resultado Final

Un sistema completo de solicitud de mantenimiento con:
- ✅ Diseño profesional con colores institucionales
- ✅ Formulario completo y validado
- ✅ Integración con API
- ✅ Pantalla de confirmación con número de seguimiento
- ✅ Navegación clara hacia otras secciones del sistema
- ✅ Experiencia de usuario optimizada

¡Listo para usar! 🚀
