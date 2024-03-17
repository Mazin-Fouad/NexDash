import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    fullName: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  errorMessage: string | null = null;
  isRegistered = false;

  onSubmit() {
    if (this.form.valid) {
      const rawForm = this.form.getRawValue();
      this.authService
        .register(rawForm.email!, rawForm.password!, rawForm.fullName!)
        .subscribe({
          complete: () => (this.isRegistered = true),
          error: (error) => {
            // Handle registration error
            this.errorMessage =
              'Registration failed. Please try again.' + error;
          },
        });
    }
  }

  signUpWithGoogle() {
    this.authService.signInWithGoogle().subscribe({
      next: (userCredential) => {
        // Handle successful Google sign-up, if needed
        this.isRegistered = true;
      },
      error: (error) => {
        // Handle Google sign-up error
        this.errorMessage = 'Google sign-up failed. Please try again.' + error;
      },
    });
  }
}
