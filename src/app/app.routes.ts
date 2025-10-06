import { Routes } from '@angular/router';

const dashboardModule = () => import('../shared/presentation/views/dashboard/dashboard').then(m => m.Dashboard);

export const routes: Routes = [
  {
    path: '',
    loadComponent: dashboardModule,
    pathMatch: 'full'
  },
  {
    path: 'search-courts',
    loadComponent: () => import('../shared/presentation/views/court-search/court-search').then(m => m.CourtSearch)
  },
  {
    path: 'search-coaches',
    loadComponent: () => import('../shared/presentation/views/coach-search/coach-search').then(m => m.CoachSearch)
  },
  {
    path: 'court-details/:id',
    loadComponent: () => import('../shared/presentation/views/court-details/court-details').then(m => m.CourtDetailsComponent)
  },
  {
    path: 'coach-details/:id',
    loadComponent: () => import('../shared/presentation/views/coach-details/coach-details').then(m => m.CoachDetailsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('../shared/presentation/views/settings/settings').then(m => m.Settings)
  }
];
