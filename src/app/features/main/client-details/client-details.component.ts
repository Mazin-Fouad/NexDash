import {
  Component,
  HostBinding,
  Inject,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DarkModeService } from '../../../core/services/darkMode/dark-mode.service';
import { Subscription } from 'rxjs';
import { ClientsData } from '../../../core/models/clients-data';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
})
export class ClientDetailsComponent implements OnInit, OnDestroy {
  darkModeService = inject(DarkModeService);
  @HostBinding('class.dark') isDarkMode: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public client: ClientsData) {}

  ngOnInit(): void {
    this.subscribeDarkMode();
    console.log(this.client);
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
