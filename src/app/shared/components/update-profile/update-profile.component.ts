import { CommonModule } from '@angular/common';
import {
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { DarkModeService } from '../../../core/services/darkMode/dark-mode.service';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../core/models/user';
import { AuthService } from '../../../core/services/auth/auth.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss',
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  darkModeService = inject(DarkModeService);
  subscriptions: Subscription[] = [];
  @HostBinding('class.dark') isDarkMode: boolean = false;
  authService = inject(AuthService);
  // fb = inject(FormBuilder);
  // editForm = this.fb.nonNullable.group({
  //   email: [this.currentUser.email, [Validators.email]],
  //   password: [this.currentUser.password, [Validators.minLength(6)]],
  //   displayName: [this.currentUser.displayName],
  //   profileImg: [this.currentUser.profileImg],
  // });
  selectedFile: File | null = null;
  constructor(
    public dialogRef: MatDialogRef<UpdateProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public currentUser: User
  ) {}

  ngOnInit(): void {
    this.subscribeDarkMode();
  }
  subscribeDarkMode() {
    let darkModeSubscription = this.darkModeService.darkMode$.subscribe(
      (darkMode) => {
        this.isDarkMode = darkMode;
      }
    );

    this.subscriptions.push(darkModeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  updateProfile(
    displayName: string,
    email: string,
    password: string,
    photoURL: string
  ) {
    this.authService
      .updateUserProfile(displayName, email, password, photoURL)
      .subscribe({
        next: () => console.log('Profile updated successfully!'),
        error: (error) => alert(error.message),
      });
  }
}
