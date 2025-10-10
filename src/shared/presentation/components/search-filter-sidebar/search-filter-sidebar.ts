import { Component, input, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Tipo genérico de filtros de búsqueda
 */
export interface BaseFilters {
  [key: string]: any;
}

/**
 * Interfaz para las opciones de los filtros
 */
export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Configuración de un filtro específico
 */
export interface FilterConfig {
  type: 'select' | 'range' | 'input' | 'rating';
  key: string;
  label: string;
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

/**
 * Componente reutilizable de barra lateral de filtros para búsquedas
 * 
 * Permite configurar diferentes tipos de filtros:
 * - Select dropdowns
 * - Range sliders
 * - Text inputs
 * - Rating sliders
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-10-10
 */
@Component({
  selector: 'app-search-filter-sidebar',
  imports: [CommonModule, FormsModule, TranslatePipe],
  styleUrl: './search-filter-sidebar.css',
  template: `
    <aside class="lg:col-span-1 bg-surface-light dark:bg-surface-dark p-6 rounded-lg self-start">
      <h2 class="text-xl font-bold mb-6">{{ title() | translate }}</h2>
      <div class="space-y-6">
        
        @for (filter of filterConfigs(); track filter.key) {
          <div>
            <!-- Select Filter -->
            @if (filter.type === 'select') {
              <label 
                class="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2" 
                [for]="filter.key">
                {{ filter.label | translate }}
              </label>
              <select 
                class="w-full bg-background-light dark:bg-background-dark border border-surface-dark/20 dark:border-surface-dark rounded-lg h-12 px-4 focus:ring-primary focus:border-primary"
                [id]="filter.key"
                [value]="getFilterValue(filter.key)"
                (change)="onFilterChange(filter.key, $any($event.target).value)">
                @for (option of filter.options; track option.value) {
                  <option [value]="option.value">{{ option.label | translate }}</option>
                }
              </select>
            }

            <!-- Input Filter -->
            @if (filter.type === 'input') {
              <label 
                class="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2" 
                [for]="filter.key">
                {{ filter.label | translate }}
              </label>
              <div class="relative">
                <input 
                  class="w-full bg-background-light dark:bg-background-dark border border-surface-dark/20 dark:border-surface-dark rounded-lg h-12 px-4 pr-10 focus:ring-primary focus:border-primary"
                  [id]="filter.key"
                  type="text"
                  [value]="getFilterValue(filter.key)"
                  (input)="onFilterChange(filter.key, $any($event.target).value)"
                  [placeholder]="filter.placeholder | translate"/>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">
                  my_location
                </span>
              </div>
            }

            <!-- Range Filter -->
            @if (filter.type === 'range') {
              <label 
                class="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2" 
                [for]="filter.key">
                {{ filter.label | translate }}
              </label>
              <input 
                class="w-full h-2 bg-surface-dark/20 dark:bg-surface-dark rounded-lg appearance-none cursor-pointer accent-primary"
                [id]="filter.key"
                type="range"
                [min]="filter.min || 0"
                [max]="filter.max || 100"
                [step]="filter.step || 1"
                [value]="getFilterValue(filter.key)"
                (input)="onFilterChange(filter.key, +$any($event.target).value)"/>
              <div class="flex justify-between text-xs text-subtle-light dark:text-subtle-dark mt-1">
                <span>{{ filter.min || 0 }}</span>
                <span>{{ getRangeDisplay(filter.key, filter.max || 100) }}</span>
              </div>
            }

            <!-- Rating Filter -->
            @if (filter.type === 'rating') {
              <label 
                class="block text-sm font-medium text-subtle-light dark:text-subtle-dark mb-2" 
                [for]="filter.key">
                {{ filter.label | translate }}
              </label>
              <div class="flex items-center gap-2">
                <input 
                  class="w-full h-2 bg-surface-dark/20 dark:bg-surface-dark rounded-lg appearance-none cursor-pointer accent-primary"
                  [id]="filter.key"
                  type="range"
                  [min]="filter.min || 0"
                  [max]="filter.max || 5"
                  [step]="filter.step || 0.5"
                  [value]="getFilterValue(filter.key)"
                  (input)="onFilterChange(filter.key, +$any($event.target).value)"/>
                <span class="font-bold text-sm min-w-[3rem]">{{ getRatingDisplay(filter.key) }}</span>
              </div>
              <!-- Rating scale indicators -->
              <div class="flex justify-between text-xs text-subtle-light dark:text-subtle-dark mt-1">
                @for (i of [1,2,3,4,5]; track i) {
                  <span>{{ i }}</span>
                }
              </div>
            }
          </div>
        }

        <!-- Apply Filters Button -->
        @if (showApplyButton()) {
          <button 
            class="w-full bg-primary text-white font-bold h-12 rounded-lg hover:bg-primary/90 transition-colors"
            (click)="onApplyFilters()">
            {{ applyButtonText() | translate }}
          </button>
        }
      </div>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFilterSidebar<T extends BaseFilters> {
  /** Título de la barra lateral de filtros */
  title = input<string>('filters');

  /** Configuración de los filtros a mostrar */
  filterConfigs = input.required<FilterConfig[]>();

  /** Valores actuales de los filtros */
  filters = input.required<T>();

  /** Si mostrar el botón de aplicar filtros */
  showApplyButton = input<boolean>(true);

  /** Texto del botón de aplicar filtros */
  applyButtonText = input<string>('apply-filters');

  /** Evento emitido cuando cambia un filtro */
  filterChange = output<{ key: string; value: any }>();

  /** Evento emitido cuando se aplican los filtros */
  applyFilters = output<void>();

  /**
   * Obtiene el valor actual de un filtro específico
   * @param key Clave del filtro
   * @returns Valor del filtro
   */
  getFilterValue(key: string): any {
    return this.filters()[key as keyof T];
  }

  /**
   * Maneja el cambio de un filtro
   * @param key Clave del filtro
   * @param value Nuevo valor
   */
  onFilterChange(key: string, value: any): void {
    this.filterChange.emit({ key, value });
  }

  /**
   * Maneja la aplicación de filtros
   */
  onApplyFilters(): void {
    this.applyFilters.emit();
  }

  /**
   * Formatea la visualización de un filtro de rango
   * @param key Clave del filtro
   * @param max Valor máximo
   * @returns Texto formateado
   */
  getRangeDisplay(key: string, max: number): string {
    const value = this.getFilterValue(key);
    return value >= max ? `${max}+` : `${value}`;
  }

  /**
   * Formatea la visualización de un filtro de rating
   * @param key Clave del filtro
   * @returns Rating formateado
   */
  getRatingDisplay(key: string): string {
    const value = this.getFilterValue(key);
    // Si es un número entero, mostrar sin decimales, si no con un decimal
    return Number.isInteger(value) ? `${value}+` : `${value.toFixed(1)}+`;
  }
}
