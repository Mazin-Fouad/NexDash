import {
  Component,
  HostBinding,
  Inject,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DarkModeService } from '../../../core/services/darkMode/dark-mode.service';
import { Subscription } from 'rxjs';
import { ClientsData } from '../../../core/models/clients-data';
import { initFlowbite } from 'flowbite';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
})
export class ClientDetailsComponent implements OnInit, OnDestroy {
  darkModeService = inject(DarkModeService);
  @HostBinding('class.dark') isDarkMode: boolean = false;
  private subscriptions: Subscription[] = [];
  totalTransactions: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public client: ClientsData,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
    this.subscribeDarkMode();
    console.log(this.client);

    this.totalTransactions = this.client.orderHistory.reduce(
      (accum, currElem) => accum + currElem.price * currElem.quantity,
      0
    );
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
