# FindParking - Sistema de Monitoreo Inteligente de Estacionamiento

Sistema de monitoreo en tiempo real de espacios de estacionamiento desarrollado para la Universidad Tecnológica del Perú (UTP).

## ✨ Características Principales

- 🔐 **Autenticación segura** con validación robusta (Zod + React Hook Form)
- 📊 **Monitoreo en tiempo real** vía WebSockets con reconexión automática
- 🎥 **Streaming de video** procesado y original en tiempo real
- 🔊 **Síntesis de voz** para accesibilidad (WCAG 2.1 AA)
- 🌓 **Modo oscuro/claro** con preferencia persistente
- 📱 **Diseño 100% responsive** (móvil, tablet, escritorio)
- 🔒 **Control de roles** (admin, gestor, usuario)
- ♿ **Accesibilidad completa** con ARIA labels y navegación por teclado

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Validación**: Zod
- **Formularios**: React Hook Form
- **Comunicación**: WebSockets + REST API
- **Estándares**: WCAG 2.1 AA, ISO 9241 (ergonomía)

## 📦 Estructura del Proyecto

```
src/
├── components/          # Componentes UI reutilizables
│   ├── Login.tsx       # Autenticación
│   ├── Register.tsx    # Registro de usuarios
│   ├── Navbar.tsx      # Navegación principal
│   ├── Occupancy.tsx   # Dashboard de ocupación
│   ├── VideoStream.tsx # Transmisión de video
│   └── Footer.tsx      # Pie de página
├── hooks/              # Custom React hooks
│   ├── useWebSocket.ts # Gestión de WebSockets
│   └── useSpeechSynthesis.ts # Síntesis de voz
├── lib/                
│   ├── api/           # Cliente API REST
│   └── validation.ts  # Esquemas Zod
├── pages/             
│   ├── Index.tsx      # Punto de entrada
│   └── Dashboard.tsx  # Dashboard principal
├── types/             # Tipos TypeScript
└── utils/             # Utilidades

```

## 🚀 Instalación y Desarrollo

```sh
# Clonar el repositorio
git clone <YOUR_GIT_URL>

# Navegar al directorio
cd <YOUR_PROJECT_NAME>

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🔑 Roles de Usuario

- **Usuario**: Visualización de ocupación de espacios
- **Gestor**: Usuario + acceso a streaming de video
- **Admin**: Todos los permisos

## ♿ Accesibilidad (WCAG 2.1 AA)

- ✅ Navegación completa por teclado
- ✅ ARIA labels y roles semánticos
- ✅ Contraste de colores AAA
- ✅ Síntesis de voz para datos críticos
- ✅ Textos alternativos descriptivos
- ✅ Estados de carga accesibles
- ✅ Mensajes de error claros

## 🔒 Seguridad

- Validación de inputs (cliente + servidor)
- Sanitización de datos
- Tokens JWT con expiración
- WebSockets autenticados
- Sin datos sensibles en localStorage
- HTTPS obligatorio en producción

## 📱 Compatibilidad

**Navegadores**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
**Dispositivos**: Desktop, Laptop, Tablet, Móvil (375px+)

## 📊 Mejoras de Producción Implementadas

✅ Migración completa de Material-UI a Tailwind CSS + shadcn/ui
✅ TypeScript con tipos estrictos (sin `any`)
✅ Validación robusta con Zod
✅ WebSockets con reconexión automática
✅ Manejo de errores profesional
✅ Accesibilidad WCAG 2.1 AA completa
✅ SEO optimizado (meta tags, títulos, descripciones)
✅ Diseño responsive real
✅ Design tokens consistentes
✅ Componentes modulares reutilizables
✅ Hooks personalizados para lógica compleja
✅ Código limpio y mantenible

## 🎯 Estándares Cumplidos

- **ISO 9241-110**: Principios de diálogo (ergonomía)
- **ISO 9241-171**: Accesibilidad software
- **WCAG 2.1 AA**: Accesibilidad web
- **ES6+**: JavaScript moderno
- **TypeScript strict mode**: Seguridad de tipos
- **Semantic HTML**: Estructura semántica

## 📄 Proyecto Lovable

**URL**: https://lovable.dev/projects/9b833147-1790-4681-bff0-5432431658d4
