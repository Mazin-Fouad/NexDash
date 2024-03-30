import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private darkMode = new BehaviorSubject<boolean>(this.getDarkModePreference());
  darkMode$ = this.darkMode.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadInitialMode();
  }

  toggleDarkMode() {
    const newValue = !this.darkMode.value;
    this.darkMode.next(newValue);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('darkMode', newValue ? 'true' : 'false');
    }
  }

  private getDarkModePreference(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('darkMode') === 'true';
    }
    // Default mode if not in browser or if localStorage is not accessible
    return false;
  }

  private loadInitialMode(): void {
    this.darkMode.next(this.getDarkModePreference());
  }
}
