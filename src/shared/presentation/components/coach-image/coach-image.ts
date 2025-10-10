import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente para mostrar imagen con placeholder automático para coaches
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-10-10
 */
@Component({
  selector: 'app-coach-image',
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-full overflow-hidden">
      @if (!imageError()) {
        <img 
          [src]="src()"
          [alt]="alt()"
          [class]="imageClass()"
          (error)="onImageError()"
          (load)="onImageLoad()"
          loading="lazy" />
      }
      
      @if (imageError() || !src()) {
        <!-- Coach Placeholder -->
        <div [class]="placeholderClass()" class="flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900">
          <div class="text-center">
            <!-- Coach/Whistle Icon -->
            <svg class="w-16 h-16 mx-auto mb-2 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="6" r="4" stroke-width="2"/>
              <path d="M16 18v2a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2" stroke-width="2"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke-width="2"/>
              <circle cx="12" cy="12" r="1" fill="currentColor"/>
              <path d="M12 13v3" stroke-width="2"/>
              <path d="M10 16h4" stroke-width="2"/>
            </svg>
            <p class="text-sm font-medium text-blue-700 dark:text-blue-200">{{ placeholderText() }}</p>
          </div>
        </div>
      }
      
      @if (showLoading() && !imageError() && src()) {
        <!-- Loading overlay -->
        <div class="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoachImage {
  /** URL de la imagen */
  src = input<string>('');
  
  /** Texto alternativo */
  alt = input<string>('Imagen de entrenador');
  
  /** Clases CSS para la imagen */
  imageClass = input<string>('w-full h-full object-cover');
  
  /** Clases CSS para el placeholder */
  placeholderClass = input<string>('w-full h-full');
  
  /** Texto del placeholder */
  placeholderText = input<string>('Imagen no disponible');
  
  /** Mostrar indicador de carga */
  showLoading = input<boolean>(false);

  /** Estado del error de imagen */
  imageError = signal<boolean>(false);
  
  /** Estado de carga */
  isLoading = signal<boolean>(false);

  /**
   * Maneja el error de carga de imagen
   */
  onImageError(): void {
    this.imageError.set(true);
    this.isLoading.set(false);
  }

  /**
   * Maneja la carga exitosa de imagen
   */
  onImageLoad(): void {
    this.imageError.set(false);
    this.isLoading.set(false);
  }
}
