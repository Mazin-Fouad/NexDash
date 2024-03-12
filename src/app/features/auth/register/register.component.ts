import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent   {
 fb = inject(FormBuilder);
 http = inject(HttpClient);
 authService = inject(AuthService);
 router = inject(Router);
  
 form = this.fb.nonNullable.group({
  email: new FormControl('', [Validators.required, Validators.email]),
  fullName: new FormControl('', [Validators.required]),
  password: new FormControl('', [Validators.required, Validators.minLength(6)])
});
errorMessage: string | null = null;

onSubmit(){
  if (this.form.valid) {
    const rawForm = this.form.getRawValue();
    this.authService.register(rawForm.email!, rawForm.password!, rawForm.fullName!).subscribe({
      // next: () => this.router.navigate(['/']),
      error: (error) => {
        // Handle registration error
        this.errorMessage = 'Registration failed. Please try again.' + error;
      }
    });
  } else {
    // Trigger validation messages if form is not valid
    this.form.markAllAsTouched();
  }
}


}
