import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeedService } from '../../../infrastructure/services/seed.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Database Seeding</h1>
        
        @if (status() === 'loading') {
          <div class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p class="text-gray-600 dark:text-gray-300">Populating database with sample data...</p>
            <p class="text-sm text-gray-500 mt-2">This may take a few seconds.</p>
          </div>
        } @else if (status() === 'success') {
          <div class="flex flex-col items-center">
            <div class="text-green-500 text-5xl mb-4">✓</div>
            <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">Seeding Complete!</p>
            <p class="text-gray-600 dark:text-gray-300 mb-6">The database has been populated successfully.</p>
            <button (click)="goHome()" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Go to Dashboard
            </button>
          </div>
        } @else if (status() === 'error') {
          <div class="flex flex-col items-center">
            <div class="text-red-500 text-5xl mb-4">✗</div>
            <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">Seeding Failed</p>
            <p class="text-gray-600 dark:text-gray-300 mb-6">An error occurred while populating the database.</p>
            <button (click)="retry()" class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Retry
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class SeedComponent implements OnInit {
  private seedService = inject(SeedService);
  private router = inject(Router);

  status = signal<'loading' | 'success' | 'error'>('loading');

  ngOnInit() {
    this.runSeed();
  }

  runSeed() {
    this.status.set('loading');
    this.seedService.seed().subscribe({
      next: () => {
        this.status.set('success');
      },
      error: (err: any) => {
        console.error('Seeding error:', err);
        this.status.set('error');
      }
    });
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  retry() {
    this.runSeed();
  }
}
