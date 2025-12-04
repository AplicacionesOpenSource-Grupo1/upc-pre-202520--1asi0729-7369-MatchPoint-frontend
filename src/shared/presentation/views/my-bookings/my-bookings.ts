import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BookingService } from '../../../infrastructure/services/booking.service';
import { UserService } from '../../../infrastructure/services/user.service';
import { Booking } from '../../../domain/models/booking.model';
import { CourtService } from '../../../../court/infrastructure/services/court.service';
import { CoachService } from '../../../../coach/infrastructure/services/coach.service';

@Component({
    selector: 'app-my-bookings',
    standalone: true,
    imports: [CommonModule, TranslatePipe],
    template: `
    <div class="min-h-screen bg-background-light dark:bg-background-dark p-6">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-text-light dark:text-text-dark">
            {{ 'my_bookings' | translate }}
          </h1>
          <button 
            (click)="goBack()"
            class="text-subtle-light dark:text-subtle-dark hover:text-primary dark:hover:text-primary transition-colors">
            {{ 'back' | translate }}
          </button>
        </div>

        @if (isLoading()) {
          <div class="flex justify-center py-12">
            <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        } @else if (bookings().length === 0) {
          <div class="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-lg">
            <svg class="w-16 h-16 mx-auto mb-4 text-subtle-light dark:text-subtle-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="text-xl font-medium text-text-light dark:text-text-dark mb-2">
              {{ 'no_bookings' | translate }}
            </h3>
            <p class="text-subtle-light dark:text-subtle-dark mb-6">
              {{ 'no_bookings_desc' | translate }}
            </p>
            <div class="flex justify-center gap-4">
              <button 
                (click)="findCourt()"
                class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-brand-dark transition-colors">
                {{ 'find_court' | translate }}
              </button>
              <button 
                (click)="findCoach()"
                class="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors">
                {{ 'find_coach' | translate }}
              </button>
            </div>
          </div>
        } @else {
          <div class="space-y-4">
            @for (booking of bookings(); track booking.id) {
              <div class="bg-surface-light dark:bg-surface-dark p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div class="flex flex-col md:flex-row justify-between gap-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span [class]="getStatusClass(booking.status)" class="px-2 py-1 rounded-full text-xs font-medium capitalize">
                        {{ booking.status }}
                      </span>
                      <span class="text-sm text-subtle-light dark:text-subtle-dark">
                        {{ booking.date | date:'fullDate' }}
                      </span>
                    </div>
                    
                    <h3 class="text-lg font-bold text-text-light dark:text-text-dark mb-1">
                      {{ getBookingTitle(booking) }}
                    </h3>
                    
                    <div class="flex items-center gap-4 text-sm text-subtle-light dark:text-subtle-dark">
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ booking.time }} ({{ booking.duration }} min)
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        S/ {{ booking.price }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    @if (canCancel(booking)) {
                      <button 
                        (click)="cancelBooking(booking.id)"
                        class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        {{ 'cancel' | translate }}
                      </button>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class MyBookingsComponent implements OnInit {
    private router = inject(Router);
    private bookingService = inject(BookingService);
    private userService = inject(UserService);
    private courtService = inject(CourtService);
    private coachService = inject(CoachService);

    bookings = signal<any[]>([]);
    isLoading = signal<boolean>(true);

    // Cache for resource names
    private resourceNames = new Map<string, string>();

    ngOnInit() {
        this.loadBookings();
    }

    private loadBookings() {
        this.userService.getCurrentUser().subscribe({
            next: (user) => {
                this.bookingService.getUserBookings(user.id).subscribe({
                    next: async (bookings) => {
                        // Sort by date descending
                        const sortedBookings = bookings.sort((a, b) =>
                            new Date(b.date).getTime() - new Date(a.date).getTime()
                        );

                        // Enrich bookings with resource names
                        await this.enrichBookings(sortedBookings);

                        this.bookings.set(sortedBookings);
                        this.isLoading.set(false);
                    },
                    error: (error) => {
                        console.error('Error loading bookings:', error);
                        this.isLoading.set(false);
                    }
                });
            },
            error: () => this.isLoading.set(false)
        });
    }

    private async enrichBookings(bookings: Booking[]) {
        for (const booking of bookings) {
            if (booking.courtId && !this.resourceNames.has(booking.courtId)) {
                try {
                    const court = await this.courtService.getCourtById(booking.courtId).toPromise();
                    if (court) this.resourceNames.set(booking.courtId, court.name);
                } catch (e) { console.error(e); }
            }
            if (booking.coachId && !this.resourceNames.has(booking.coachId)) {
                try {
                    const coach = await this.coachService.getCoachById(booking.coachId).toPromise();
                    if (coach) this.resourceNames.set(booking.coachId, coach.name);
                } catch (e) { console.error(e); }
            }
        }
    }

    getBookingTitle(booking: Booking): string {
        if (booking.courtId) {
            return this.resourceNames.get(booking.courtId) || 'Cancha';
        } else if (booking.coachId) {
            return this.resourceNames.get(booking.coachId) || 'Entrenador';
        }
        return 'Reserva';
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    canCancel(booking: Booking): boolean {
        return booking.status !== 'cancelled' && new Date(booking.date) > new Date();
    }

    cancelBooking(id: string) {
        if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            this.bookingService.deleteBooking(id).subscribe({
                next: () => {
                    this.loadBookings();
                },
                error: (error) => console.error('Error cancelling booking:', error)
            });
        }
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    findCourt() {
        this.router.navigate(['/search-courts']);
    }

    findCoach() {
        this.router.navigate(['/search-coaches']);
    }
}
