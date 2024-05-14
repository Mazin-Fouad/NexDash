import {
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DarkModeService } from '../../../../core/services/darkMode/dark-mode.service';
import { User } from '../../../../core/models/user';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss',
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  darkModeService = inject(DarkModeService);
  subscriptions: Subscription[] = [];
  @HostBinding('class.dark') isDarkMode: boolean = false;
  authService = inject(AuthService);
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

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }

    console.log(this.selectedFile);
  }

  updateProfile(
    displayName: string,
    email: string,
    password: string,
    photoURL: string
  ) {
    if (this.selectedFile) {
      this.authService.uploadProfileImage(this.selectedFile).subscribe({
        next: (url) => {
          this.authService
            .updateUserProfile(displayName, email, password, url)
            .subscribe({
              next: () => console.log('Profile updated successfully!'),
              error: (error) => alert(error.message),
            });
        },
        error: (error) => alert(error.message),
      });
    } else {
      this.authService
        .updateUserProfile(displayName, email, password, photoURL)
        .subscribe({
          next: () => console.log('Profile updated successfully!'),
          error: (error) => alert(error.message),
        });
    }
  }
}
