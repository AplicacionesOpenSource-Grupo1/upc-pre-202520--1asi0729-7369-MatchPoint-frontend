import { Component, signal, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { CoachService } from '../../../infrastructure/services/coach.service';
import { Coach, CoachTimeSlot } from '../../../domain/models/coach.model';
import { CourtCard } from '../../../../shared/presentation/components/court-card/court-card';
import { CoachImage } from '../../../../shared/presentation/components/coach-image';

@Component({
  selector: 'app-coach-details',
  templateUrl: './coach-details.html',
  styleUrls: ['./coach-details.css'],
  imports: [CommonModule, TranslatePipe, CourtCard, CoachImage]
})
export class CoachDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private coachService = inject(CoachService);

  coachId = signal<string>('');
  coach = signal<Coach | null>(null);
  isLoading = signal<boolean>(true);
  selectedImageIndex = signal<number>(0);
  selectedDate = signal<string>(this.getTodayDate());
  availableCourts = signal<any[]>([]);
  isLoadingCourts = signal<boolean>(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.coachId.set(id);
      this.loadCoachDetails();
    }
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private loadCoachDetails(): void {
    this.isLoading.set(true);
    this.coachService.getCoachById(this.coachId()).subscribe({
      next: (coach) => {
        this.coach.set(coach);
        this.isLoading.set(false);
        this.loadAvailableCourts();
      },
      error: (error) => {
        console.error('Error loading coach details:', error);
        this.isLoading.set(false);
      }
    });
  }

  private loadAvailableCourts(): void {
    this.isLoadingCourts.set(true);
    this.coachService.getAvailableCourtsForCoach(this.coachId()).subscribe({
      next: (courts) => {
        this.availableCourts.set(courts);
        this.isLoadingCourts.set(false);
      },
      error: (error) => {
        console.error('Error loading available courts:', error);
        this.isLoadingCourts.set(false);
      }
    });
  }

  availableSlots = computed(() => {
    return this.coach()?.availability?.filter(slot => 
      slot.available && slot.date === this.selectedDate()
    ) || [];
  });

  selectedImage = computed(() => {
    const coach = this.coach();
    return coach?.images?.[this.selectedImageIndex()] || '';
  });

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  bookSession(timeSlot: CoachTimeSlot): void {
    // Simulate booking - In real app, this would navigate to booking page
    console.log('Booking session:', timeSlot);
    alert(`Reservando sesión para las ${timeSlot.time} - S/ ${timeSlot.price}`);
  }

  goBack(): void {
    this.router.navigate(['/search-coaches']);
  }

  shareProfile(): void {
    if (navigator.share) {
      navigator.share({
        title: this.coach()?.name,
        text: `Echa un vistazo a este entrenador: ${this.coach()?.name}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  }

  getLevelText(level: string): string {
    const levels: { [key: string]: string } = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio', 
      'advanced': 'Avanzado',
      'professional': 'Profesional'
    };
    return levels[level] || level;
  }

  onCourtClick(court: any): void {
    this.router.navigate(['/court-details', court.id]);
  }
}
