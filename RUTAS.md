# 🗺️ Rutas del Sistema de Autenticación

## Rutas Disponibles

### 🔐 Autenticación

| Ruta | Descripción | Componente |
|------|-------------|------------|
| `/login` | Página de inicio de sesión | `LoginForm` |
| `/registro` | Página de registro de nuevos usuarios | `RegistroForm` |
| `/olvidar-contrasena` | Iniciar recuperación de contraseña | `OlvidarContrasenaForm` |
| `/verificar-otp` | Verificar código OTP de 6 dígitos | `VerificarOtpForm` |
| `/restablecer-contrasena` | Crear nueva contraseña | `RestablecerContrasenaForm` |

## 🔄 Flujo de Navegación

```
┌─────────────────┐
│    /login       │ ◄─────────────────────────┐
│                 │                            │
│  - Iniciar      │                            │
│    sesión       │                            │
│  - Link a       │                            │
│    registro     │                            │
│  - Link a       │                            │
│    recuperar    │                            │
└────────┬────────┘                            │
         │                                     │
         │ ¿No tienes cuenta?                  │
         │                                     │
         ▼                                     │
┌─────────────────┐                            │
│   /registro     │                            │
│                 │                            │
│  - Crear cuenta │                            │
│  - Link a login │                            │
└────────┬────────┘                            │
         │                                     │
         │ Registro exitoso                    │
         │                                     │
         └─────────────────────────────────────┘


┌─────────────────┐
│    /login       │
│                 │
│  ¿Olvidaste tu  │
│   contraseña?   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ /olvidar-contrasena     │
│                         │
│  - Ingresar documento   │
│  - Enviar código        │
└────────┬────────────────┘
         │
         │ userId generado
         │
         ▼
┌─────────────────────────┐
│ /verificar-otp          │
│ ?userId={id}            │
│                         │
│  - Ingresar código OTP  │
│  - Reenviar por email   │
│  - Reenviar por WhatsApp│
└────────┬────────────────┘
         │
         │ Código válido
         │
         ▼
┌─────────────────────────┐
│ /restablecer-contrasena │
│ ?userId={id}&code={code}│
│                         │
│  - Nueva contraseña     │
│  - Confirmar contraseña │
└────────┬────────────────┘
         │
         │ Contraseña actualizada
         │
         ▼
┌─────────────────┐
│    /login       │
│                 │
│  Iniciar sesión │
│  con nueva      │
│  contraseña     │
└─────────────────┘
```

## 📋 Query Parameters

### `/verificar-otp`
- **userId** (requerido): ID del usuario obtenido del endpoint `/auth/iniciar-recuperacion`

### `/restablecer-contrasena`
- **userId** (requerido): ID del usuario
- **code** (requerido): Código OTP verificado

## 🔒 Protección de Rutas

Todas las rutas de autenticación verifican si el usuario ya tiene un token válido:
- Si **tiene token** → Redirige a `/dashboard`
- Si **no tiene token** → Muestra el formulario correspondiente

## 🎯 Redirecciones Automáticas

| Desde | Hacia | Condición |
|-------|-------|-----------|
| `/registro` | `/login` | Registro exitoso |
| `/olvidar-contrasena` | `/verificar-otp?userId={id}` | Código enviado |
| `/verificar-otp` | `/restablecer-contrasena?userId={id}&code={code}` | Código válido |
| `/restablecer-contrasena` | `/login` | Contraseña actualizada |
| Cualquier ruta auth | `/dashboard` | Usuario ya autenticado |

## 🚀 Para Probar el Sistema

1. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Acceder a las rutas:**
   - Login: http://localhost:3000/login
   - Registro: http://localhost:3000/registro
   - Recuperar contraseña: http://localhost:3000/olvidar-contrasena

3. **Flujo de prueba completo:**
   - Registrar un nuevo usuario en `/registro`
   - Iniciar sesión en `/login`
   - Cerrar sesión
   - Ir a `/olvidar-contrasena`
   - Seguir el flujo de recuperación
   - Iniciar sesión con la nueva contraseña
