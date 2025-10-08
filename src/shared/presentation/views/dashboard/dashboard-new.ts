import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { UserService } from '../../../infrastructure/services/user.service';
import { BookingService } from '../../../infrastructure/services/booking.service';
import { User, UserStats, Activity } from '../../../domain/models/user.model';
import { Booking } from '../../../domain/models/booking.model';

export interface UserProfile {
  name: string;
  avatar: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly bookingService = inject(BookingService);

  // Signals for reactive state management
  user = signal<User | null>(null);
  userProfile = signal<UserProfile | null>(null);
  upcomingBookings = signal<Booking[]>([]);
  dashboardStats = signal<UserStats | null>(null);
  recentActivities = signal<Activity[]>([]);
  isLoading = signal<boolean>(false);

  // Computed values
  nextBooking = computed(() => {
    const bookings = this.upcomingBookings();
    return bookings.length > 0 ? bookings[0] : null;
  });

  welcomeMessage = computed(() => {
    const profile = this.userProfile();
    return profile ? `Welcome back, ${profile.name}!` : 'Welcome back!';
  });

  constructor() {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading.set(true);
    
    // Load user data
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user.set(user);
        this.userProfile.set({
          name: user.name,
          avatar: user.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKUsllfarh1Vz5TMSY9tQXvaO4PjgZQST2UfndXEB4asm1lrMgH1AOBj8iel5YRr8sjK-udLwcYVv87B65GOQBuCO06VCZgauA33eetg72EetdFnv3sJj_X3FrK4V-wNkU6_MjPGh-WdWq5ZaVRzZ9OOkovDPzgEskotSpWMv8d6HkCUKvQCp7KZIk0GBZX9K0MMPYQFc2gTn7PliIMn81mDqhCRQQMfz_CFQMg4EwC8uHLLs2VpSujlf3WDFRcia_s--Q6s1fm8cc'
        });
        this.loadUserStats(user.id);
        this.loadUserActivities(user.id);
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.isLoading.set(false);
      }
    });

    // Load bookings
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.upcomingBookings.set(bookings.filter(booking => 
          booking.status === 'confirmed' && new Date(booking.date) >= new Date()
        ));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.isLoading.set(false);
      }
    });
  }

  private loadUserStats(userId: string): void {
    this.userService.getUserStats(userId).subscribe({
      next: (stats) => {
        this.dashboardStats.set(stats);
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
      }
    });
  }

  private loadUserActivities(userId: string): void {
    this.userService.getUserActivities(userId).subscribe({
      next: (activities) => {
        this.recentActivities.set(activities);
      },
      error: (error) => {
        console.error('Error loading user activities:', error);
      }
    });
  }

  onFindCourt(): void {
    this.router.navigate(['/search-courts']);
  }

  onFindCoach(): void {
    this.router.navigate(['/search-coaches']);
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'booking':
        return 'M5 13l4 4L19 7';
      case 'match':
        return 'M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z';
      default:
        return 'M5 13l4 4L19 7';
    }
  }
}
