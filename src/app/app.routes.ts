import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainComponent } from './features/main/main.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },

  {
    path: 'main',
    // canActivate: [authGuard],
    loadChildren: () =>
      import('./features/main/main.module').then((m) => m.MainModule),
  },
];
