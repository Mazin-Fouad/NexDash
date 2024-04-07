import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { Subscription } from 'rxjs';
import { DarkModeService } from '../../../core/services/darkMode/dark-mode.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../../core/models/user';
import { User as FirebaseUser } from '@firebase/auth';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UpdateProfileComponent } from '../update-profile/update-profile.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatButtonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @HostBinding('class.dark') isDarkMode: boolean = false;
  authService = inject(AuthService);
  darkModeService = inject(DarkModeService);
  currentUser: User | null = null;
  router = inject(Router);
  public dialog = inject(MatDialog);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
    this.subscribeToCurrentUser();
    this.subscribeDarkMode();
  }

  subscribeToCurrentUser() {
    let userSubscription = this.authService
      .getCurrentUser()
      .subscribe((user: any) => {
        this.currentUser = user; // Assign the user data to the property
        console.log(user);
      });
    this.subscriptions.push(userSubscription);
  }

  signOut() {
    let logoutSzubscription = this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
        localStorage.removeItem('token');
      },
    });

    this.subscriptions.push(logoutSzubscription);
  }

  subscribeDarkMode() {
    let darkModeSubscription = this.darkModeService.darkMode$.subscribe(
      (darkMode) => {
        this.isDarkMode = darkMode;
      }
    );

    this.subscriptions.push(darkModeSubscription);
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }

  openDialog() {
    this.dialog.open(UpdateProfileComponent, {
      height: '512px',
      width: '490px',
      data: this.currentUser,
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
