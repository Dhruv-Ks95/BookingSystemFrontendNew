import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  {
    path: 'user/home',
    loadComponent: () => import('./features/user/user-home/user-home.component').then(m => m.UserHomeComponent),
    canActivate: [authGuard, () => roleGuard(0)]
  },
  {
    path: 'admin/home',
    loadComponent: () => import('./features/admin/admin-home/admin-home.component').then(m => m.AdminHomeComponent),
    canActivate: [authGuard, () => roleGuard(1)]
  },
  { path: '**', redirectTo: '/login' }
];