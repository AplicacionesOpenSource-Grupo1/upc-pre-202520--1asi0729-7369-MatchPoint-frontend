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
        <!-- Court Placeholder Image -->
        <img 
          src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1000&auto=format&fit=crop"
          [alt]="placeholderText()"
          [class]="imageClass()"
          loading="lazy" />
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
