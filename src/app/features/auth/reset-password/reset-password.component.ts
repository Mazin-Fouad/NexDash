import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  emailSent = false;
  resetForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.resetForm.valid) {
      const rawForm = this.resetForm.getRawValue();
      this.authService.resetPassword(rawForm.email!).subscribe(() => {
        this.emailSent = true;
        this.forwarding();
      });
    }
  }

  forwarding() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }
}
