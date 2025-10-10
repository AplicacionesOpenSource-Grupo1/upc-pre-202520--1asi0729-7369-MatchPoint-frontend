import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { authGuard } from '../shared/infrastructure/guards/auth.guard';
import { guestGuard } from '../shared/infrastructure/guards/guest.guard';
import { AuthService } from '../shared/infrastructure/services/auth.service';

const dashboardModule = () => import('../shared/presentation/views/dashboard/dashboard').then(m => m.Dashboard);

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
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
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  {
    path: 'search-courts',
    loadComponent: () => import('../court/presentation/views/court-search/court-search').then(m => m.CourtSearch)
  },
  {
    path: 'search-coaches',
    loadComponent: () => import('../coach/presentation/views/coach-search/coach-search').then(m => m.CoachSearch)
  },
  {
    path: 'court-details/:id',
    loadComponent: () => import('../court/presentation/views/court-details/court-details').then(m => m.CourtDetailsComponent)
  },
  {
    path: 'coach-details/:id',
    loadComponent: () => import('../coach/presentation/views/coach-details/coach-details').then(m => m.CoachDetailsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('../shared/presentation/views/settings/settings').then(m => m.Settings)
  },
  {
    path: 'payments',
    loadComponent: () => import('../shared/presentation/views/payments/payments').then(m => m.Payments)
  },
  {
    path: 'payments/confirmation',
    loadComponent: () =>import('../shared/presentation/views/payment-confirmation/payment-confirmation').then(m=>m.PaymentConfirmation)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
