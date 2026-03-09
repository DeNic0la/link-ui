import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'register-secure-link',
    loadComponent: () => import('./features/secure-link-registration/secure-link-registration.component').then((m) => m.SecureLinkRegistrationComponent),
  },
];
