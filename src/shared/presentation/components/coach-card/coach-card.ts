import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Coach } from '../../../../coach/domain/models/coach.model';
import { CoachImage } from '../coach-image';

/**
 * Componente reutilizable para mostrar tarjetas de entrenadores
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 * @since 2025-10-10
 */
@Component({
  selector: 'app-coach-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe, CoachImage],
  styleUrl: './coach-card.css',
  template: `
    <div 
      class="bg-surface-light dark:bg-surface-dark rounded-lg overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
      (click)="onCoachClick()">
      <div class="relative">
        <app-coach-image
          [src]="coach().images[0]"
          [alt]="coach().name"
          imageClass="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          placeholderText="Imagen de entrenador">
        </app-coach-image>
        <div class="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
          S/ {{ coach().pricePerHour }}/hr
        </div>
        <div class="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
          {{ getLevelLabel(coach().level) | translate }}
        </div>
      </div>
      <div class="p-4">
        <h3 class="font-bold text-lg mb-1 line-clamp-1">{{ coach().name }}</h3>
        <p class="text-sm text-subtle-light dark:text-subtle-dark mb-2 flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ coach().location }}
        </p>
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-1 text-yellow-500">
            @for (star of getStarArray(coach().rating); track $index) {
              @if (star.filled) {
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              } @else if (star.half) {
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              } @else {
                <svg class="w-4 h-4 text-text-light/30 dark:text-text-dark/30" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              }
            }
            <span class="text-text-light dark:text-text-dark text-sm ml-1">{{ coach().rating }}</span>
          </div>
          <div class="text-xs text-subtle-light dark:text-subtle-dark">
            {{ coach().reviews }} {{ 'reviews' | translate }}
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs text-subtle-light dark:text-subtle-dark mb-2">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {{ coach().sports.join(', ') }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            {{ coach().experience }} {{ 'years' | translate }}
          </span>
        </div>
        <div class="text-xs text-subtle-light dark:text-subtle-dark line-clamp-2">
          {{ coach().description }}
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoachCard {
  /** Entrenador a mostrar */
  coach = input.required<Coach>();

  /** Evento emitido cuando se hace clic en la tarjeta */
  coachClick = output<Coach>();

  /**
   * Maneja el clic en la tarjeta
   */
  onCoachClick(): void {
    this.coachClick.emit(this.coach());
  }

  /**
   * Obtiene la etiqueta del nivel para traducción
   */
  getLevelLabel(level: string): string {
    return `level.${level}`;
  }

  /**
   * Genera un array de objetos para mostrar las estrellas de rating
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
}
