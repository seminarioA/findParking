# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# Frontend Service - FindParking

Este microservicio provee una interfaz web moderna para consumir los servicios de ocupación y video.

## Características

- Login con JWT
- Visualización de ocupación de espacios (REST API)
- Streaming de video en tiempo real (WebSocket)
- UI con React, Vite, TypeScript y Material UI

## Endpoints consumidos

- `occupancy_service`: `/api/occupancy/{camera_id}` (GET)
- `video_service`: `/api/video/{camera_id}/processed` (WebSocket)

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

Incluye Dockerfile para despliegue.

## Personalización

Configura las URLs de los microservicios en `.env` si es necesario.

---

# FindParking

Sistema de visión por computadora para detección en tiempo real de espacios de estacionamiento, basado en microservicios, Docker y buenas prácticas de producción.

## 🚗 Arquitectura de Producción

### Microservicios

- **auth_service**: Autenticación y emisión de JWT.
- **occupancy_service**: Consulta y gestión de ocupación de espacios.
- **video_service**: Streaming y procesamiento de video (WebSocket).
- **processing_service**: Detección de vehículos con YOLO/OpenCV.
- **api_gateway (NGINX)**: Proxy reverso, balanceo y seguridad.
- **redis**: Almacenamiento temporal y cache.
