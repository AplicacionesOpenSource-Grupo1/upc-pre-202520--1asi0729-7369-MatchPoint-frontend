# SearchFilterSidebar - Componente Reutilizable de Filtros

## Descripción

`SearchFilterSidebar` es un componente Angular reutilizable que proporciona una barra lateral de filtros configurable para páginas de búsqueda. Permite crear diferentes tipos de filtros de manera sencilla y consistente.

## Características

- **Tipos de filtros soportados:**
  - `select`: Dropdown de selección con opciones predefinidas
  - `input`: Campo de texto para entrada libre
  - `range`: Slider de rango numérico
  - `rating`: Slider específico para calificaciones con indicadores visuales

- **Configuración flexible:** Cada filtro se configura através de un objeto `FilterConfig`
- **Reactive:** Utiliza signals de Angular para una reactitividad eficiente
- **Internacionalización:** Compatible con ngx-translate
- **Tema adaptable:** Soporta modo claro y oscuro

## Uso

### Importación

```typescript
import { SearchFilterSidebar, FilterConfig } from '@shared/presentation/components/search-filter-sidebar';
```

### Configuración básica

```typescript
@Component({
  imports: [SearchFilterSidebar],
  // ...
})
export class MySearchComponent {
  // Definir la configuración de filtros
  filterConfigs = signal<FilterConfig[]>([
    {
      type: 'select',
      key: 'category',
      label: 'category',
      options: [
        { value: '', label: 'all-categories' },
        { value: 'sports', label: 'sports' },
        { value: 'music', label: 'music' }
      ]
    },
    {
      type: 'input',
      key: 'location',
      label: 'location',
      placeholder: 'enter-location'
    },
    {
      type: 'range',
      key: 'price',
      label: 'price-range',
      min: 0,
      max: 500,
      step: 10
    },
    {
      type: 'rating',
      key: 'rating',
      label: 'minimum-rating',
      min: 1,
      max: 5,
      step: 1
    }
  ]);

  // Estado de los filtros
  filters = signal({
    category: '',
    location: '',
    price: 100,
    rating: 1
  });

  // Manejar cambios de filtros
  onFilterChange(event: { key: string; value: any }): void {
    this.filters.update(current => ({ ...current, [event.key]: event.value }));
  }

  // Manejar aplicación de filtros
  onApplyFilters(): void {
    console.log('Filtros aplicados:', this.filters());
  }
}
```

### Template

```html
<div class="search-container">
  <app-search-filter-sidebar
    [title]="'filters'"
    [filterConfigs]="filterConfigs()"
    [filters]="filters()"
    [showApplyButton]="true"
    [applyButtonText]="'apply-filters'"
    (filterChange)="onFilterChange($event)"
    (applyFilters)="onApplyFilters()">
  </app-search-filter-sidebar>

  <div class="results-area">
    <!-- Contenido de resultados -->
  </div>
</div>
```

## Propiedades de Entrada

| Propiedad | Tipo | Requerido | Valor por defecto | Descripción |
|-----------|------|-----------|-------------------|-------------|
| `title` | `string` | No | `'filters'` | Título de la barra lateral |
| `filterConfigs` | `FilterConfig[]` | Sí | - | Configuración de los filtros |
| `filters` | `T extends BaseFilters` | Sí | - | Valores actuales de los filtros |
| `showApplyButton` | `boolean` | No | `true` | Si mostrar el botón de aplicar |
| `applyButtonText` | `string` | No | `'apply-filters'` | Texto del botón de aplicar |

## Eventos de Salida

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `filterChange` | `{ key: string; value: any }` | Emitido cuando cambia un filtro |
| `applyFilters` | `void` | Emitido cuando se presiona el botón aplicar |

## Configuración de FilterConfig

```typescript
interface FilterConfig {
  type: 'select' | 'range' | 'input' | 'rating';
  key: string;          // Clave única del filtro
  label: string;        // Etiqueta para traducción
  options?: FilterOption[]; // Opciones para tipo 'select'
  min?: number;         // Valor mínimo para 'range' y 'rating'
  max?: number;         // Valor máximo para 'range' y 'rating'
  step?: number;        // Incremento para 'range' y 'rating'
  placeholder?: string; // Placeholder para tipo 'input'
}
```

## Ejemplos de Uso

### Filtros para búsqueda de canchas deportivas

```typescript
const courtFilterConfigs: FilterConfig[] = [
  {
    type: 'select',
    key: 'sport',
    label: 'court-search.sport',
    options: [
      { value: '', label: 'sport.all' },
      { value: 'tennis', label: 'sport.tennis' },
      { value: 'padel', label: 'sport.padel' }
    ]
  },
  {
    type: 'input',
    key: 'location',
    label: 'court-search.location',
    placeholder: 'court-search.location-placeholder'
  },
  {
    type: 'range',
    key: 'priceRange',
    label: 'court-search.price-range',
    min: 0,
    max: 200,
    step: 10
  },
  {
    type: 'rating',
    key: 'minRating',
    label: 'court-search.min-rating',
    min: 0,
    max: 5,
    step: 0.5
  }
];
```

### Filtros para búsqueda de entrenadores

```typescript
const coachFilterConfigs: FilterConfig[] = [
  {
    type: 'select',
    key: 'sport',
    label: 'coach-search.sport',
    options: [
      { value: '', label: 'coach-search.all-sports' },
      { value: 'Tennis', label: 'sport.tennis' },
      { value: 'Padel', label: 'sport.padel' }
    ]
  },
  {
    type: 'select',
    key: 'level',
    label: 'coach-search.level',
    options: [
      { value: '', label: 'coach-search.all-levels' },
      { value: 'Beginner', label: 'coach-search.beginner' },
      { value: 'Intermediate', label: 'coach-search.intermediate' },
      { value: 'Advanced', label: 'coach-search.advanced' }
    ]
  },
  {
    type: 'rating',
    key: 'minRating',
    label: 'coach-search.rating',
    min: 1,
    max: 5,
    step: 1
  }
];
```

## Estilos Personalizados

El componente utiliza clases CSS modulares que pueden ser personalizadas:

```css
/* Personalizar el contenedor principal */
.search-filter-sidebar aside {
  /* Estilos personalizados */
}

/* Personalizar controles de rango */
.search-filter-sidebar input[type="range"] {
  /* Estilos del slider */
}

/* Personalizar botones */
.search-filter-sidebar button {
  /* Estilos del botón */
}
```

## Notas Técnicas

- Utiliza Angular signals para reactividad eficiente
- Compatible con OnPush change detection
- Soporta internacionalización con ngx-translate
- Responsive y accesible por defecto
- Tipado fuerte con TypeScript

## Casos de Uso Implementados

1. **Búsqueda de Canchas Deportivas** (`CourtSearch`)
2. **Búsqueda de Entrenadores** (`CoachSearch`)

Ambos componentes han sido refactorizados para utilizar este componente reutilizable, eliminando duplicación de código y garantizando consistencia en la interfaz de usuario.
