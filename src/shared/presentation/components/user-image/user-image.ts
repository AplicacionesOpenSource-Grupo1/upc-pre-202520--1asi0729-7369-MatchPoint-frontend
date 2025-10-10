import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente para mostrar imagen con placeholder automático para usuarios
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-10-10
 */
@Component({
  selector: 'app-user-image',
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
        <!-- User Placeholder -->
        <div [class]="placeholderClass()" class="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          <div class="text-center">
            <!-- User Icon -->
            <svg class="w-16 h-16 mx-auto mb-2 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ placeholderText() }}</p>
          </div>
        </div>
      }
      
      @if (showLoading() && !imageError() && src()) {
        <!-- Loading overlay -->
        <div class="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <div class="w-8 h-8 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserImage {
  /** URL de la imagen */
  src = input<string>('');
  
  /** Texto alternativo */
  alt = input<string>('Imagen de usuario');
  
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
