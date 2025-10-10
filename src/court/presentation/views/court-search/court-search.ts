import { Component, computed, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CourtService } from '../../../infrastructure/services/court.service';
import { Court } from '../../../domain/models/court.model';
import { SearchFilterSidebar, FilterConfig } from '../../../../shared/presentation/components/search-filter-sidebar/search-filter-sidebar';

/**
 * Interfaz para los filtros de búsqueda de canchas
 * @interface SearchFilters
 */
export interface SearchFilters {
  /** Tipo de deporte (tennis, padel, etc.) */
  sport: string;
  /** Ubicación de la cancha */
  location: string;
  /** Rango máximo de precio por hora */
  priceRange: number;
  /** Rating mínimo requerido */
  minRating: number;
}

/**
 * Opciones de ordenamiento disponibles
 * @type SortOption
 */
export type SortOption = 'relevance' | 'price' | 'rating';

/**
 * Componente para la búsqueda y filtrado de canchas deportivas
 * 
 * Permite a los usuarios:
 * - Buscar canchas por nombre o ubicación
 * - Filtrar por deporte, precio y rating
 * - Ordenar resultados por diferentes criterios
 * - Navegar a los detalles de una cancha específica
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-10-06
 */
@Component({
  selector: 'app-court-search',
  imports: [CommonModule, FormsModule, TranslatePipe, SearchFilterSidebar],
  templateUrl: './court-search.html',
  styleUrl: './court-search.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourtSearch {
  /** Servicio de navegación de Angular */
  private router = inject(Router);
  /** Servicio para operaciones relacionadas con canchas */
  private courtService = inject(CourtService);
  
  /** Signal para la consulta de búsqueda por texto */
  searchQuery = signal<string>('');
  /** Signal que indica si los datos están cargando */
  isLoading = signal<boolean>(false);
  
  /** Signal para los filtros de búsqueda aplicados */
  filters = signal<SearchFilters>({
    sport: '',
    location: '',
    priceRange: 200,
    minRating: 0
  });

  /** Signal para el criterio de ordenamiento seleccionado */
  sortBy = signal<SortOption>('relevance');

  /** Signal que contiene todas las canchas disponibles */
  courts = signal<Court[]>([]);

  /** Configuración de filtros para el componente reutilizable */
  filterConfigs = signal<FilterConfig[]>([
    {
      type: 'select',
      key: 'sport',
      label: 'court-search.sport',
      options: [
        { value: '', label: 'sport.all' },
        { value: 'tennis', label: 'sport.tennis' },
        { value: 'padel', label: 'sport.padel' },
        { value: 'basketball', label: 'sport.basketball' }
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
  ]);

  /**
   * Constructor del componente
   * Inicializa la carga de canchas al crear la instancia
   */
  constructor() {
    this.loadCourts();
  }

  /**
   * Carga todas las canchas disponibles desde la API
   * Actualiza el estado de carga durante la operación
   * @private
   */
  private loadCourts(): void {
    this.isLoading.set(true);
    this.courtService.getAllCourts().subscribe({
      next: (courts) => {
        this.courts.set(courts);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading courts:', error);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Signal computado que filtra y ordena las canchas según los criterios seleccionados
   * Aplica filtros de búsqueda, deporte, ubicación, precio y rating
   * @returns {Court[]} Array de canchas filtradas y ordenadas
   */
  filteredCourts = computed(() => {
    let courts = this.courts();
    const query = this.searchQuery().toLowerCase();
    const currentFilters = this.filters();
    const sort = this.sortBy();

    // Apply search filter
    if (query) {
      courts = courts.filter(court => 
        court.name.toLowerCase().includes(query) ||
        court.location.toLowerCase().includes(query)
      );
    }

    // Apply filters
    courts = courts.filter(court => {
      const matchesSport = !currentFilters.sport || court.sport === currentFilters.sport;
      const matchesLocation = !currentFilters.location || 
        court.location.toLowerCase().includes(currentFilters.location.toLowerCase());
      const matchesPrice = court.price <= currentFilters.priceRange;
      const matchesRating = court.rating >= currentFilters.minRating;

      return matchesSport && matchesLocation && matchesPrice && matchesRating;
    });

    // Apply sorting
    courts.sort((a, b) => {
      switch (sort) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default: // relevance
          return b.rating - a.rating; // For now, use rating as relevance
      }
    });

    return courts;
  });

  /**
   * Signal computado que formatea el rango de precio para mostrar
   * @returns {string} Texto formateado del rango de precio (ej: "$150" o "$200+")
   */
  priceRangeDisplay = computed(() => {
    const range = this.filters().priceRange;
    return range >= 200 ? '$200+' : `$${range}`;
  });

  /**
   * Signal computado que formatea el rating mínimo para mostrar
   * @returns {string} Rating formateado con un decimal (ej: "4.0+")
   */
  ratingDisplay = computed(() => {
    return this.filters().minRating.toFixed(1) + '+';
  });

  /**
   * Actualiza la consulta de búsqueda por texto
   * @param {string} query - Nueva consulta de búsqueda
   */
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  /**
   * Actualiza el filtro de deporte
   * @param {string} sport - Tipo de deporte seleccionado
   */
  onSportChange(sport: string): void {
    this.filters.update(current => ({ ...current, sport }));
  }

  /**
   * Actualiza el filtro de ubicación
   * @param {string} location - Ubicación seleccionada
   */
  onLocationChange(location: string): void {
    this.filters.update(current => ({ ...current, location }));
  }

  /**
   * Actualiza el rango máximo de precio
   * @param {number} priceRange - Precio máximo por hora
   */
  onPriceRangeChange(priceRange: number): void {
    this.filters.update(current => ({ ...current, priceRange }));
  }

  /**
   * Actualiza el rating mínimo requerido
   * @param {number} minRating - Rating mínimo (0-5)
   */
  onRatingChange(minRating: number): void {
    this.filters.update(current => ({ ...current, minRating }));
  }

  /**
   * Actualiza el criterio de ordenamiento
   * @param {SortOption} sortBy - Nuevo criterio de ordenamiento
   */
  onSortChange(sortBy: SortOption): void {
    this.sortBy.set(sortBy);
  }

  /**
   * Aplica los filtros actuales (utilizado para forzar re-evaluación)
   * En una aplicación real, esto podría disparar una nueva llamada a la API
   */
  onApplyFilters(): void {
    // In a real app, this might trigger an API call
    console.log('Applying filters:', this.filters());
  }

  /**
   * Genera un array de objetos para mostrar las estrellas de rating
   * @param {number} rating - Rating de la cancha (0-5)
   * @returns {Array<{filled: boolean; half: boolean}>} Array de configuración de estrellas
   */
  getStarArray(rating: number): { filled: boolean; half: boolean }[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push({ filled: true, half: false });
      } else if (i === fullStars && hasHalf) {
        stars.push({ filled: false, half: true });
      } else {
        stars.push({ filled: false, half: false });
      }
    }

    return stars;
  }

  /**
   * Navega a la página de detalles de una cancha específica
   * @param {Court} court - Cancha seleccionada
   */
  onCourtClick(court: Court): void {
    this.router.navigate(['/court-details', court.id]);
  }

  /**
   * Maneja los cambios en los filtros desde el componente reutilizable
   * @param event Evento con la clave y valor del filtro cambiado
   */
  onFilterChange(event: { key: string; value: any }): void {
    const { key, value } = event;
    
    switch (key) {
      case 'sport':
        this.onSportChange(value);
        break;
      case 'location':
        this.onLocationChange(value);
        break;
      case 'priceRange':
        this.onPriceRangeChange(value);
        break;
      case 'minRating':
        this.onRatingChange(value);
        break;
    }
  }
}
