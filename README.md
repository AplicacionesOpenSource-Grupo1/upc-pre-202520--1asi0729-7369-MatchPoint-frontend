# PlayMatch - Frontend

> **Autor:** Juan Carlos Angulo  
> **Fecha:** Octubre 2025  
> **Versión:** 1.0.0

## Descripción

PlayMatch es una aplicación web moderna desarrollada en Angular 20 para la gestión y reserva de canchas deportivas y coaches. La aplicación permite a los usuarios buscar, filtrar y reservar canchas de tenis y pádel, así como contratar servicios de entrenadores especializados.

## Características Principales

- **Búsqueda avanzada de canchas** con filtros por deporte, ubicación, precio y rating
- **Búsqueda de coaches** especializados en diferentes deportes
- **Sistema de reservas** con gestión de horarios y precios
- **Panel de usuario** con historial de reservas y estadísticas
- **Configuración de perfil** con actualización en tiempo real
- **Interfaz responsive** optimizada para móviles y desktop
- **Soporte multiidioma** (Español/Inglés)
- **Tema oscuro/claro** automático

## Tecnologías Utilizadas

### Frontend
- **Angular 20** - Framework principal
- **TypeScript** - Lenguaje de programación
- **Tailwind CSS** - Framework de estilos
- **Angular Signals** - Gestión de estado reactiva
- **RxJS** - Programación reactiva
- **NGX-Translate** - Internacionalización

### Backend (Desarrollo)
- **JSON Server** - API REST mock para desarrollo
- **Concurrently** - Ejecución paralela de servicios

### Herramientas de Desarrollo
- **Angular CLI** - Tooling de desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código

## Estructura del Proyecto

```
src/
├── app/                          # Configuración principal de la aplicación
│   ├── app.config.ts            # Configuración de providers
│   ├── app.routes.ts            # Definición de rutas
│   └── app.ts                   # Componente raíz
├── shared/                       # Módulos compartidos
│   ├── domain/                  # Modelos de dominio
│   │   └── models/              # Interfaces TypeScript
│   │       ├── user.model.ts    # Usuario y estadísticas
│   │       ├── court.model.ts   # Canchas y disponibilidad
│   │       ├── coach.model.ts   # Coaches y especialidades
│   │       └── booking.model.ts # Reservas y estado
│   ├── infrastructure/          # Servicios e infraestructura
│   │   └── services/            # Servicios HTTP
│   │       ├── user.service.ts     # API de usuarios
│   │       ├── court.service.ts    # API de canchas
│   │       ├── coach.service.ts    # API de coaches
│   │       └── booking.service.ts  # API de reservas
│   └── presentation/            # Componentes de UI
│       ├── components/          # Componentes reutilizables
│       │   ├── header/          # Cabecera de navegación
│       │   ├── footer/          # Pie de página
│       │   ├── layout/          # Layout principal
│       │   └── language/        # Selector de idioma
│       └── views/               # Páginas principales
│           ├── dashboard/       # Panel principal
│           ├── court-search/    # Búsqueda de canchas
│           ├── court-details/   # Detalles de cancha
│           ├── coach-search/    # Búsqueda de coaches
│           ├── coach-details/   # Detalles de coach
│           └── settings/        # Configuración de usuario
├── assets/                      # Recursos estáticos
│   └── i18n/                   # Archivos de traducción
│       ├── en.json             # Traducciones en inglés
│       └── es.json             # Traducciones en español
└── styles.css                  # Estilos globales
```

## 🔧 Instalación y Configuración

### Prerrequisitos
- **Node.js** 18+ 
- **npm** 8+
- **Angular CLI** 20+

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd playmatch-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar el entorno**
   ```bash
   # El proyecto incluye una API mock con JSON Server
   # No requiere configuración adicional para desarrollo
   ```

### Ejecución

#### Desarrollo
```bash
# Iniciar API mock y aplicación Angular simultáneamente
npm run dev

# O ejecutar por separado:
npm run api    # JSON Server en puerto 3001
npm start      # Angular en puerto 4200
```

#### Producción
```bash
npm run build
```

#### Testing
```bash
npm test
```

## API y Servicios

### Endpoints Principales

La aplicación consume una API REST que proporciona los siguientes endpoints:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/users` | GET | Obtener lista de usuarios |
| `/users/:id` | GET | Obtener usuario específico |
| `/users/:id` | PUT | Actualizar datos de usuario |
| `/courts` | GET | Obtener lista de canchas |
| `/courts/:id` | GET | Obtener cancha específica |
| `/coaches` | GET | Obtener lista de coaches |
| `/coaches/:id` | GET | Obtener coach específico |
| `/bookings` | GET | Obtener lista de reservas |
| `/bookings` | POST | Crear nueva reserva |
| `/bookings/:id` | PUT | Actualizar reserva |

### Servicios Angular

#### UserService
Gestiona las operaciones relacionadas con usuarios:
```typescript
// Obtener usuario actual
getCurrentUser(): Observable<User>

// Actualizar datos de usuario
updateUser(userId: string, userData: Partial<User>): Observable<User>

// Obtener estadísticas del usuario
getUserStats(userId: string): Observable<UserStats>
```

#### CourtService
Maneja la búsqueda y gestión de canchas:
```typescript
// Obtener todas las canchas
getAllCourts(): Observable<Court[]>

// Obtener cancha por ID
getCourtById(id: string): Observable<Court>

// Buscar canchas con filtros
searchCourts(filters?: SearchFilters): Observable<Court[]>
```

#### CoachService
Gestiona los entrenadores disponibles:
```typescript
// Obtener todos los coaches
getAllCoaches(): Observable<Coach[]>

// Obtener coach por ID
getCoachById(id: string): Observable<Coach>

// Buscar coaches con filtros
searchCoaches(filters?: CoachFilters): Observable<Coach[]>
```

#### BookingService
Maneja las reservas de los usuarios:
```typescript
// Obtener todas las reservas
getAllBookings(): Observable<Booking[]>

// Crear nueva reserva
createBooking(booking: Omit<Booking, 'id'>): Observable<Booking>

// Actualizar reserva existente
updateBooking(id: string, booking: Partial<Booking>): Observable<Booking>
```

## Componentes Principales

### Dashboard
Panel principal que muestra:
- Resumen de reservas próximas
- Estadísticas del usuario
- Acciones rápidas
- Actividad reciente

### Court Search
Búsqueda avanzada de canchas con:
- Filtros por deporte, ubicación, precio y rating
- Ordenamiento por relevancia, precio y valoración
- Vista de tarjetas con información detallada
- Navegación a detalles de cancha

### Coach Search
Búsqueda de entrenadores con:
- Filtros por deporte, nivel y ubicación
- Información de especialidades y certificaciones
- Disponibilidad y precios
- Navegación a perfil detallado

### Settings
Configuración de usuario que permite:
- Actualización de datos personales
- Gestión de preferencias
- Historial de reservas
- Configuración de notificaciones

## Gestión de Estado

El proyecto utiliza **Angular Signals** para la gestión de estado reactiva:

### Signals Principales
- `signal()` - Estado básico
- `computed()` - Estado derivado
- `effect()` - Efectos secundarios

### Ejemplo de Implementación
```typescript
export class CourtSearch {
  // Estado base
  courts = signal<Court[]>([]);
  filters = signal<SearchFilters>({
    sport: '',
    location: '',
    priceRange: 200,
    minRating: 0
  });

  // Estado computado
  filteredCourts = computed(() => {
    const courts = this.courts();
    const currentFilters = this.filters();
    
    return courts.filter(court => 
      this.matchesFilters(court, currentFilters)
    );
  });
}
```

## Internacionalización

### Configuración
El proyecto soporta múltiples idiomas usando NGX-Translate:

```typescript
// app.config.ts
TranslateModule.forRoot({
  fallbackLang: 'en'
})
```

### Uso en Componentes
```html
<!-- En templates -->
{{ 'court-search.title' | translate }}

<!-- Con parámetros -->
{{ 'court-search.results' | translate: {count: courtCount} }}
```

### Archivos de Traducción
- `src/assets/i18n/en.json` - Inglés
- `src/assets/i18n/es.json` - Español

## Mejores Prácticas Implementadas

### Angular
- **Standalone Components** - Sin uso de NgModules
- **OnPush Change Detection** - Optimización de rendimiento
- **Signals** - Gestión de estado moderna
- **Lazy Loading** - Carga diferida de módulos
- **Reactive Forms** - Formularios reactivos

### TypeScript
- **Strict Mode** - Tipado estricto
- **Interfaces** - Definición clara de contratos
- **Type Guards** - Validación de tipos en runtime

### Estilos
- **Tailwind CSS** - Utility-first CSS
- **CSS Custom Properties** - Variables CSS nativas
- **Responsive Design** - Adaptable a todos los dispositivos

## 🧪 Testing

### Configuración
```bash
# Ejecutar tests unitarios
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Estructura de Tests
- Tests unitarios para servicios
- Tests de componentes con Angular Testing Library
- Mocks para servicios HTTP

## Responsive Design

La aplicación está optimizada para:
- **Mobile** (320px - 768px)
- **Tablet** (768px - 1024px)
- **Desktop** (1024px+)

### Breakpoints Tailwind
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

## Despliegue

### Build de Producción
```bash
npm run build
```

### Optimizaciones Incluidas
- **Tree Shaking** - Eliminación de código no utilizado
- **Minificación** - Compresión de archivos
- **Lazy Loading** - Carga diferida
- **Service Worker** - Cache estratégico

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia el servidor de desarrollo |
| `npm run api` | Inicia solo el JSON Server |
| `npm run dev` | Inicia API y Angular simultáneamente |
| `npm run build` | Build de producción |
| `npm test` | Ejecuta tests unitarios |
| `npm run lint` | Ejecuta linting |


