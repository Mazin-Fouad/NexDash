import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserCredential } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
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

  ngOnInit(): void {
    this.checkLoginStatus();
  }
  checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/main']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue();
      this.authService.login(email!, password!).subscribe({
        next: (userCredential: any) => {
          console.log('Logged in successfully', userCredential);
          const token = userCredential._tokenResponse.idToken; // Use the correct property to access the token
          localStorage.setItem('token', token);
          this.router.navigateByUrl('/main');
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
      next: (userCredential: any) => {
        // Handle successful Google sign-up, if needed
        console.log('Google sign-up successful', userCredential);
        localStorage.setItem('token', userCredential._tokenResponse.idToken);
        this.router.navigate(['/main']);
      },
      error: (error) => {
        // Handle Google sign-up error
        this.errorMessage = 'Google sign-up failed. Please try again.';
      },
    });
  }
}
