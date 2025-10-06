import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CoachService } from '../../../infrastructure/services/coach.service';
import { Coach } from '../../../domain/models/coach.model';

@Component({
  selector: 'app-coach-search',
  imports: [CommonModule, TranslatePipe, FormsModule],
  templateUrl: './coach-search.html',
  styleUrl: './coach-search.css'
})
export class CoachSearch {
  private router = inject(Router);
  private coachService = inject(CoachService);
  
  searchQuery = signal('');
  selectedSport = signal('all');
  selectedLocation = signal('all');
  selectedLevel = signal('all');
  ratingFilter = signal(1);
  sortBy = signal('rating');
  isLoading = signal(false);

  coaches = signal<Coach[]>([]);

  constructor() {
    this.loadCoaches();
  }

  private loadCoaches(): void {
    this.isLoading.set(true);
    this.coachService.getAllCoaches().subscribe({
      next: (coaches) => {
        this.coaches.set(coaches);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading coaches:', error);
        this.isLoading.set(false);
      }
    });
  }

  filteredCoaches = computed(() => {
    let filtered = this.coaches();

    // Filter by search query
    if (this.searchQuery()) {
      filtered = filtered.filter(coach =>
        coach.name.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        coach.sports.some(sport => sport.toLowerCase().includes(this.searchQuery().toLowerCase()))
      );
    }

    // Filter by sport
    if (this.selectedSport() !== 'all') {
      filtered = filtered.filter(coach => coach.sports.includes(this.selectedSport()));
    }

    // Filter by location
    if (this.selectedLocation() !== 'all') {
      filtered = filtered.filter(coach => coach.location.includes(this.selectedLocation()));
    }

    // Filter by level (we'll use experience as a proxy for level)
    if (this.selectedLevel() !== 'all') {
      const levelMap = {
        'Beginner': [0, 2],
        'Intermediate': [2, 5],
        'Advanced': [5, 20]
      };
      const [min, max] = levelMap[this.selectedLevel() as keyof typeof levelMap] || [0, 20];
      filtered = filtered.filter(coach => coach.experience >= min && coach.experience < max);
    }

    // Filter by rating
    filtered = filtered.filter(coach => coach.rating >= this.ratingFilter());

    // Sort coaches
    switch (this.sortBy()) {
      case 'price':
        filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'availability':
        // For now, just keep original order
        break;
    }

    return filtered;
  });

  onSearch() {
    // Search functionality is handled by the computed signal
    console.log('Searching coaches with query:', this.searchQuery());
  }

  setSortBy(sortType: string) {
    this.sortBy.set(sortType);
  }

  updateRating(event: Event) {
    const target = event.target as HTMLInputElement;
    this.ratingFilter.set(parseInt(target.value));
  }

  onCoachClick(coach: Coach): void {
    this.router.navigate(['/coach-details', coach.id]);
  }
}
