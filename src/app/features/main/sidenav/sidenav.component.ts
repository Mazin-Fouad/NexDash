import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { Subscription } from 'rxjs';
import { DarkModeService } from '../../../core/services/darkMode/dark-mode.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../../core/models/user';

import { MatDialog } from '@angular/material/dialog';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscriptions: Subscription[] = [];
  @HostBinding('class.dark') isDarkMode: boolean = false;
  darkModeService = inject(DarkModeService);
  authService = inject(AuthService);
  currentUser: User | null = null;
  router = inject(Router);
  public dialog = inject(MatDialog);
  @ViewChild('dashboardLink') dashboardLink!: ElementRef;
  date = new Date();
  time = this.date.getHours();

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

  ngAfterViewInit(): void {
    this.dashboardLink.nativeElement.click();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
