import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CoachService } from '../../../infrastructure/services/coach.service';
import { Coach } from '../../../domain/models/coach.model';
import { SearchFilterSidebar, FilterConfig } from '../../../../shared/presentation/components/search-filter-sidebar/search-filter-sidebar';

/**
 * Interfaz para los filtros de búsqueda de entrenadores
 */
export interface CoachSearchFilters {
  sport: string;
  location: string;
  level: string;
  minRating: number;
}

@Component({
  selector: 'app-coach-search',
  imports: [CommonModule, TranslatePipe, FormsModule, SearchFilterSidebar],
  templateUrl: './coach-search.html',
  styleUrl: './coach-search.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoachSearch {
  private router = inject(Router);
  private coachService = inject(CoachService);
  
  searchQuery = signal('');
  sortBy = signal('rating');
  isLoading = signal(false);

  /** Signal para los filtros de búsqueda aplicados */
  filters = signal<CoachSearchFilters>({
    sport: '',
    location: '',
    level: '',
    minRating: 1
  });

  /** Configuración de filtros para el componente reutilizable */
  filterConfigs = signal<FilterConfig[]>([
    {
      type: 'select',
      key: 'sport',
      label: 'coach-search.sport',
      options: [
        { value: '', label: 'coach-search.all-sports' },
        { value: 'tennis', label: 'sport.tennis' },
        { value: 'padel', label: 'sport.padel' },
        { value: 'pickleball', label: 'sport.pickleball' }
      ]
    },
    {
      type: 'select',
      key: 'location',
      label: 'coach-search.location',
      options: [
        { value: '', label: 'coach-search.any-location' },
        { value: 'San Isidro', label: 'San Isidro, Lima' },
        { value: 'Miraflores', label: 'Miraflores, Lima' },
        { value: 'San Borja', label: 'San Borja, Lima' },
        { value: 'Surco', label: 'Surco, Lima' },
        { value: 'La Molina', label: 'La Molina, Lima' },
        { value: 'Barranco', label: 'Barranco, Lima' }
      ]
    },
    {
      type: 'select',
      key: 'level',
      label: 'coach-search.level',
      options: [
        { value: '', label: 'coach-search.all-levels' },
        { value: 'intermediate', label: 'coach-search.intermediate' },
        { value: 'advanced', label: 'coach-search.advanced' },
        { value: 'professional', label: 'coach-search.professional' }
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
  ]);

  coaches = signal<Coach[]>([]);

  constructor() {
    this.loadCoaches();
  }

  private loadCoaches(): void {
    this.isLoading.set(true);
    this.coachService.getAllCoaches().subscribe({
      next: (coaches) => {
        this.coaches.set(coaches);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading coaches:', error);
        this.isLoading.set(false);
      }
    });
  }

  filteredCoaches = computed(() => {
    let filtered = this.coaches();
    const currentFilters = this.filters();

    // Filter by search query
    if (this.searchQuery()) {
      filtered = filtered.filter(coach =>
        coach.name.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        coach.sports.some(sport => sport.toLowerCase().includes(this.searchQuery().toLowerCase()))
      );
    }

    // Filter by sport
    if (currentFilters.sport) {
      filtered = filtered.filter(coach => coach.sports.includes(currentFilters.sport));
    }

    // Filter by location
    if (currentFilters.location) {
      filtered = filtered.filter(coach => coach.location.includes(currentFilters.location));
    }

    // Filter by level
    if (currentFilters.level) {
      filtered = filtered.filter(coach => coach.level === currentFilters.level);
    }

    // Filter by rating
    filtered = filtered.filter(coach => coach.rating >= currentFilters.minRating);

    // Sort coaches
    switch (this.sortBy()) {
      case 'price':
        filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'availability':
        // For now, just keep original order
        break;
    }

    return filtered;
  });

  onSearch() {
    // Search functionality is handled by the computed signal
    console.log('Searching coaches with query:', this.searchQuery());
  }

  setSortBy(sortType: string) {
    this.sortBy.set(sortType);
  }

  /**
   * Maneja los cambios en los filtros desde el componente reutilizable
   * @param event Evento con la clave y valor del filtro cambiado
   */
  onFilterChange(event: { key: string; value: any }): void {
    const { key, value } = event;
    this.filters.update(current => ({ ...current, [key]: value }));
  }

  /**
   * Aplica los filtros actuales
   */
  onApplyFilters(): void {
    console.log('Applying filters:', this.filters());
  }

  onCoachClick(coach: Coach): void {
    this.router.navigate(['/coach-details', coach.id]);
  }
}
