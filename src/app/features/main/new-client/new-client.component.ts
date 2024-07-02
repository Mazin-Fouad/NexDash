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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientsService } from '../services/clients.service';

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
  newClientForm: FormGroup;

  constructor(
    private countriesService: CountriesService,
    private clientsService: ClientsService,

    private fb: FormBuilder
  ) {
    this.newClientForm = this.fb.group({
      clientName: ['', Validators.required],
      contactPerson: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern('[0-9]{3}-[0-9]{3}-[0-9]{4}')],
      ],
      activity: ['', Validators.required],
      clientID: ['', Validators.required],
      preferredDeliveryService: [''],
      street: ['', Validators.required],
      houseNo: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

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

  onSubmit() {
    if (this.newClientForm.valid) {
      const newClientData = this.newClientForm.value;
      this.clientsService.addClient(newClientData).subscribe({
        next: () => {
          console.log('Client data saved successfully');
          this.newClientForm.reset();
        },
        error: (error) => {
          console.error('Error saving client data:', error);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
