import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  loginForm = this.fb.nonNullable.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  errorMessage: string | null = null;

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue();
      this.authService.login(email!, password!).subscribe({
        next: (userCredential) => {
          console.log('Logged in successfully', userCredential);
          this.router.navigate(['/main']);
          console.log('Logged in successfully', userCredential);
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage = 'Login failed. Please try again.';
        },
      });
    }
  }

  signUpWithGoogle() {
    this.authService.signInWithGoogle().subscribe({
      next: (userCredential) => {
        // Handle successful Google sign-up, if needed
        this.router.navigate(['/main']);
      },
      error: (error) => {
        // Handle Google sign-up error
        this.errorMessage = 'Google sign-up failed. Please try again.';
      },
    });
  }
}
