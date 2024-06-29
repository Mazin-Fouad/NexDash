import {
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { DarkModeService } from '../../../core/services/darkMode/dark-mode.service';
import { Subscription } from 'rxjs';
import { CountriesService } from '../../../core/services/countries/countries.service';
import { Country } from '../../../core/models/country';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss'],
})
export class NewClientComponent implements OnInit, OnDestroy {
  darkModeService = inject(DarkModeService);
  @HostBinding('class.dark') isDarkMode: boolean = false;
  private subscriptions: Subscription[] = [];
  countries: Country[] = [];
  error: string | null = null;

  constructor(private countriesService: CountriesService) {}

  ngOnInit(): void {
    this.subscribeDarkMode();
    this.subscribeCountries();
  }

  subscribeCountries(): void {
    const countriesSubscription = this.countriesService
      .getCountries()
      .subscribe({
        next: (countries) => {
          this.countries = countries;
          console.log(this.countries);
        },
        error: (err) => {
          this.error = err.message;
        },
      });

    this.subscriptions.push(countriesSubscription);
  }

  subscribeDarkMode() {
    const darkModeSubscription = this.darkModeService.darkMode$.subscribe(
      (darkMode) => {
        this.isDarkMode = darkMode;
      }
    );
    this.subscriptions.push(darkModeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
