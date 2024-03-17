import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainComponent } from './features/main/main.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  {
    path: 'main',
    loadComponent: () =>
      import('./features/main/main.component').then((m) => m.MainComponent),
  },
  { path: 'login', component: LoginComponent },
];
