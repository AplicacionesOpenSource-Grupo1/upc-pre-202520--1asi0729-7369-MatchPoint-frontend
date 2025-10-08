import { Routes } from '@angular/router';
import { authGuard } from '../shared/infrastructure/guards/auth.guard';
import { guestGuard } from '../shared/infrastructure/guards/guest.guard';

const dashboardModule = () => import('../shared/presentation/views/dashboard/dashboard').then(m => m.Dashboard);

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('../shared/presentation/views/login/login').then(m => m.Login),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('../shared/presentation/views/register/register').then(m => m.Register),
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    loadComponent: dashboardModule,
    canActivate: [authGuard]
  },
  {
    path: 'search-courts',
    loadComponent: () => import('../shared/presentation/views/court-search/court-search').then(m => m.CourtSearch),
    canActivate: [authGuard]
  },
  {
    path: 'search-coaches',
    loadComponent: () => import('../shared/presentation/views/coach-search/coach-search').then(m => m.CoachSearch),
    canActivate: [authGuard]
  },
  {
    path: 'court-details/:id',
    loadComponent: () => import('../shared/presentation/views/court-details/court-details').then(m => m.CourtDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'coach-details/:id',
    loadComponent: () => import('../shared/presentation/views/coach-details/coach-details').then(m => m.CoachDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('../shared/presentation/views/settings/settings').then(m => m.Settings),
    canActivate: [authGuard]
  }
];
