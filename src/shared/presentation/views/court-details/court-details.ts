import { Component, signal, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { CourtService } from '../../../infrastructure/services/court.service';
import { Court, TimeSlot } from '../../../domain/models/court.model';

@Component({
  selector: 'app-court-details',
  templateUrl: './court-details.html',
  styleUrls: ['./court-details.css'],
  imports: [CommonModule, TranslatePipe]
})
export class CourtDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courtService = inject(CourtService);

  courtId = signal<string>('');
  court = signal<Court | null>(null);
  isLoading = signal<boolean>(true);
  selectedImageIndex = signal<number>(0);
  selectedDate = signal<string>(this.getTodayDate());

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courtId.set(id);
      this.loadCourtDetails();
    }
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private loadCourtDetails(): void {
    this.isLoading.set(true);
    this.courtService.getCourtById(this.courtId()).subscribe({
      next: (court) => {
        this.court.set(court);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading court details:', error);
        this.isLoading.set(false);
      }
    });
  }

  availableSlots = computed(() => {
    return this.court()?.availability?.filter(slot => slot.available) || [];
  });

  selectedImage = computed(() => {
    const court = this.court();
    return court?.images?.[this.selectedImageIndex()] || '';
  });

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  bookSlot(timeSlot: TimeSlot): void {
    // Simulate booking - In real app, this would navigate to booking page
    console.log('Booking slot:', timeSlot);
    alert(`Reservando cancha para las ${timeSlot.time} - S/ ${timeSlot.price}`);
  }

  goBack(): void {
    this.router.navigate(['/search-courts']);
  }

  shareLocation(): void {
    if (navigator.share) {
      navigator.share({
        title: this.court()?.name,
        text: `Echa un vistazo a esta cancha: ${this.court()?.name}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  }
}
