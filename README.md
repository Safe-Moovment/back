# 🚀 Safe Movement - Backend

Plataforma backend de PLF para seguridad, trazabilidad y bienestar animal, diseñada para convertir datos operativos en decisiones rentables sin exponer secretos en el código.

## 1. Introducción y Propuesta de Valor

Este backend es el núcleo de servicios del ecosistema Safe Movement. Expone la lógica de autenticación, gestión de animales, dispositivos, vallas y cálculo de elevación para que el frontend entregue una experiencia simple a ganaderos de distintas edades, con flujos familiares y fáciles de operar.

Su objetivo es centralizar datos críticos, reducir fricción operativa y habilitar monitoreo confiable incluso en escenarios rurales con conectividad irregular.

## 2. Tecnologías Utilizadas

- **Core Stack:** NestJS + TypeScript sobre Node.js. Aporta una arquitectura modular, mantenible y lista para escalar.
- **Persistencia:** MongoDB con Mongoose para almacenar usuarios, códigos pendientes, animales, dispositivos y vallas.
- **Correo transaccional:** Nodemailer para registro y recuperación de acceso.
- **Cálculo topográfico:** Servicio de elevación integrado con OpenTopoData para análisis de pendiente.
- **Configuración:** `dotenv` para cargar variables sensibles desde `.env`.

## 3. Arquitectura de Módulos y Endpoints

### Módulos principales

- **Auth:** registro, verificación, login y restablecimiento de contraseña.
- **Animals:** catálogo y estado de animales monitoreados.
- **Devices:** administración de dispositivos de campo.
- **Fences:** gestión de perímetros virtuales y reglas asociadas.
- **Elevation:** consulta y procesamiento de elevación para análisis de terreno.

### Endpoints de referencia

- `GET /`
- `POST /auth/register/start`
- `POST /auth/register/verify`
- `POST /auth/register/complete`
- `POST /auth/login`
- `POST /auth/reset/request`
- `POST /auth/reset/confirm`
- Rutas de consulta y gestión para animales, dispositivos, vallas y elevación según el módulo.

## 4. Pantallas del Ecosistema que Consume este Backend

Aunque este repositorio corresponde al backend, sus datos alimentan las vistas del frontend. Las pantallas más importantes son:

- **Dashboard:** resume el estado general del rancho, animales, alertas y accesos rápidos.
- **Valla Virtual:** permite dibujar perímetros y analizar riesgos topográficos.
- **Análisis Clínico con IA:** concentra hallazgos y señales de riesgo para toma de decisiones.
- **Gemini Concierge:** ofrece consultas guiadas en lenguaje natural.
- **Vista de Elevación:** muestra mapas térmicos y zonas con pendientes críticas.
- **Panel de Dispositivos:** administra los sensores y su estado operativo.

Cada vista consume datos del backend para resolver una necesidad distinta: monitoreo, trazabilidad, alertamiento y soporte a decisiones.

## 5. Características Especiales

### Resiliencia para zonas rurales

La estrategia de resiliencia tipo Store & Forward se apoya en el frontend, que puede diferir sincronizaciones cuando no hay internet. Este backend está preparado para recibir los datos cuando la conectividad regresa, manteniendo la continuidad operativa.

### Análisis de riesgo local

El cálculo de pendiente se integra con OpenTopoData para procesar elevación sin cargar esa lógica en el cliente. En despliegues aislados o de laboratorio, puede ejecutarse detrás de un contenedor Docker o una instancia propia del servicio, configurando `OPEN_TOPO_DATA_URL` en `.env`.

## 6. Instalación y Uso

### Requisitos

- Node.js 18 o superior.
- MongoDB Atlas o una instancia MongoDB accesible.
- Cuenta SMTP válida para envío de correos.

### Instalación

```bash
cd back
npm install
```

### Configuración

Crea un archivo `.env` en `back/` con las variables necesarias. Toma como base [back/.env.example](back/.env.example).

Variables comunes:

```dotenv
MONGODB_URI=
PORT=3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM_NAME=Safe Moovment
SMTP_FROM_EMAIL=
OPEN_TOPO_DATA_URL=https://api.opentopodata.org/v1/srtm30m
```

### Ejecución

```bash
npm run start:dev
```

### Producción

```bash
npm run build
npm run start:prod
```

## 7. Galería Visual

Espacio recomendado para capturas del sistema y del frontend que consume este backend.

- Dashboard principal
- Valla Virtual
- Vista de Elevación
- Panel de autenticación

> Los jueces suelen valorar cómo la complejidad técnica se traduce en una interfaz clara, rápida y usable.

## 8. Buenas Prácticas de Seguridad

- Nunca subas `.env` al repositorio.
- Mantén los secretos solo en variables de entorno.
- Restringe el uso de la API de Google Maps por referrer en Google Cloud.
- Usa credenciales SMTP específicas para la aplicación y no tu contraseña personal.
- Rotación periódica de secretos si el proyecto se comparte o se despliega públicamente.

## 9. Soporte y Desarrollo

- Desarrollo local: `npm run start:dev`
- Tests: `npm run test`
- Cobertura: `npm run test:cov`
- Lint: `npm run lint`

Si el backend no arranca, revisa primero `MONGODB_URI`, `SMTP_USER`, `SMTP_PASS` y la disponibilidad de MongoDB.
