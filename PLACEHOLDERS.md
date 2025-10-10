# Sistema de Placeholders para Imágenes

Este sistema proporciona componentes reutilizables que manejan automáticamente la carga de imágenes y muestran placeholders apropiados cuando las imágenes fallan o no están disponibles.

## Componentes Disponibles

### 🏟️ CourtImage
Componente para imágenes de canchas con placeholder temático.

**Ubicación**: `src/shared/presentation/components/court-image/`

**Uso**:
```html
<app-court-image
  [src]="court.images[0]"
  [alt]="court.name"
  imageClass="w-full h-48 object-cover"
  placeholderText="Imagen de cancha">
</app-court-image>
```

**Características**:
- ✅ Placeholder con icono de cancha de tenis
- ✅ Gradiente verde temático
- ✅ Manejo automático de errores de carga
- ✅ Indicador de carga opcional

### 👨‍🏫 CoachImage
Componente para imágenes de entrenadores con placeholder temático.

**Ubicación**: `src/shared/presentation/components/coach-image/`

**Uso**:
```html
<app-coach-image
  [src]="coach.images[0]"
  [alt]="coach.name"
  imageClass="w-full h-48 object-cover"
  placeholderText="Imagen de entrenador">
</app-coach-image>
```

**Características**:
- ✅ Placeholder con icono de silbato/entrenador
- ✅ Gradiente azul temático
- ✅ Manejo automático de errores de carga
- ✅ Indicador de carga opcional

### 👤 UserImage
Componente para imágenes de usuarios con placeholder temático.

**Ubicación**: `src/shared/presentation/components/user-image/`

**Uso**:
```html
<app-user-image
  [src]="user.avatar"
  [alt]="user.name"
  imageClass="w-full h-full object-cover"
  placeholderText="">
</app-user-image>
```

**Características**:
- ✅ Placeholder con icono de usuario
- ✅ Gradiente gris neutro
- ✅ Manejo automático de errores de carga
- ✅ Indicador de carga opcional

## Propiedades de Entrada

| Propiedad | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `src` | `string` | ❌ | `''` | URL de la imagen a mostrar |
| `alt` | `string` | ❌ | Varies by component | Texto alternativo para la imagen |
| `imageClass` | `string` | ❌ | `'w-full h-full object-cover'` | Clases CSS para la imagen |
| `placeholderClass` | `string` | ❌ | `'w-full h-full'` | Clases CSS para el placeholder |
| `placeholderText` | `string` | ❌ | `'Imagen no disponible'` | Texto del placeholder |
| `showLoading` | `boolean` | ❌ | `false` | Mostrar indicador de carga |

## Funcionamiento Automático

### Estados de la Imagen

1. **🔄 Cargando** (opcional)
   - Se muestra un spinner mientras la imagen carga
   - Solo si `showLoading` está habilitado

2. **✅ Carga Exitosa**
   - Se muestra la imagen normalmente
   - Se aplican las clases CSS especificadas

3. **❌ Error de Carga**
   - Se detecta automáticamente cuando la imagen falla
   - Se muestra el placeholder temático correspondiente

4. **🚫 Sin URL**
   - Cuando no se proporciona `src` o está vacío
   - Se muestra directamente el placeholder

### Detección de Errores

Los componentes usan los eventos `(error)` y `(load)` de las imágenes HTML para detectar automáticamente:

- **Imágenes rotas** - URLs que no existen o no se pueden cargar
- **Problemas de red** - Timeouts o fallos de conexión
- **Formatos no soportados** - Archivos corruptos o formatos inválidos
- **Errores CORS** - Problemas de permisos de origen cruzado

## Integración en la Aplicación

### Componentes Actualizados

Los siguientes componentes ya están integrados con el sistema de placeholders:

| Componente | Imagen Usada | Ubicación |
|------------|--------------|-----------|
| `CourtCard` | `CourtImage` | Tarjetas de canchas |
| `CoachCard` | `CoachImage` | Tarjetas de entrenadores |
| `Header` | `UserImage` | Avatar de usuario en navegación |
| `CoachDetails` | `CoachImage` | Galería de imágenes del entrenador |
| `CourtDetails` | `CourtImage` | Galería de imágenes de la cancha |

### Vistas de Detalle

Las vistas de detalle (`coach-details` y `court-details`) incluyen:

- **Imagen principal** con placeholder automático
- **Galería de miniaturas** con placeholders individuales
- **Navegación entre imágenes** manteniendo los placeholders

## Beneficios

### Para Usuarios
- ✅ **Experiencia consistente** - No se ven imágenes rotas
- ✅ **Feedback visual claro** - Placeholders temáticos informativos
- ✅ **Carga rápida** - Los placeholders aparecen inmediatamente

### Para Desarrolladores
- ✅ **Fácil de usar** - Drop-in replacement para `<img>`
- ✅ **Configurable** - Personalizable con propiedades
- ✅ **Mantenible** - Lógica centralizada en componentes reutilizables
- ✅ **Tipado** - TypeScript con validación en tiempo de compilación

### Para el Negocio
- ✅ **Mejor UX** - Reduce la frustración de los usuarios
- ✅ **Imagen profesional** - No se muestran elementos rotos
- ✅ **Accesibilidad** - Textos alternativos apropiados

## Estilo Visual

### CourtImage
- **Color**: Verde (#059669, #047857)
- **Icono**: Cancha de tenis con líneas y puntos
- **Diseño**: Degradado vertical con icono centrado

### CoachImage  
- **Color**: Azul (#2563eb, #1d4ed8)
- **Icono**: Silbato/entrenador estilizado
- **Diseño**: Degradado vertical con icono centrado

### UserImage
- **Color**: Gris (#6b7280, #4b5563)
- **Icono**: Silueta de persona estándar
- **Diseño**: Degradado vertical con icono centrado

## Extensibilidad

Para crear nuevos componentes de imagen con placeholder:

1. **Copiar** uno de los componentes existentes
2. **Personalizar** el icono SVG y colores
3. **Actualizar** el selector y nombre del componente
4. **Exportar** en el índice de componentes compartidos

## Testing

Los placeholders se pueden probar:

1. **Simulando errores** - Usar URLs inválidas
2. **Conexión lenta** - Throttling de red
3. **URLs vacías** - No proporcionar `src`
4. **Imágenes grandes** - Para probar estados de carga
