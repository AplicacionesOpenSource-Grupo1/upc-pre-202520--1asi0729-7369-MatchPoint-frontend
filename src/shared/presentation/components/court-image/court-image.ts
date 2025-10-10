import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente para mostrar imagen con placeholder automático para canchas
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-10-10
 */
@Component({
  selector: 'app-court-image',
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
        <!-- Court Placeholder -->
        <div [class]="placeholderClass()" class="flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900">
          <div class="text-center">
            <!-- Tennis Court Icon -->
            <svg class="w-16 h-16 mx-auto mb-2 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="6" width="20" height="12" rx="2" stroke-width="2" fill="none"/>
              <line x1="12" y1="6" x2="12" y2="18" stroke-width="2"/>
              <line x1="2" y1="12" x2="22" y2="12" stroke-width="1" stroke-dasharray="2,2"/>
              <circle cx="6" cy="9" r="1" fill="currentColor"/>
              <circle cx="18" cy="9" r="1" fill="currentColor"/>
              <circle cx="6" cy="15" r="1" fill="currentColor"/>
              <circle cx="18" cy="15" r="1" fill="currentColor"/>
            </svg>
            <p class="text-sm font-medium text-green-700 dark:text-green-200">{{ placeholderText() }}</p>
          </div>
        </div>
      }
      
      @if (showLoading() && !imageError() && src()) {
        <!-- Loading overlay -->
        <div class="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <div class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourtImage {
  /** URL de la imagen */
  src = input<string>('');
  
  /** Texto alternativo */
  alt = input<string>('Imagen de cancha');
  
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
