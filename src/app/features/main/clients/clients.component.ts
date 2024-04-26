import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ClientsData } from '../../../core/models/clients-data';
import { ClientsService } from '../services/clients.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit, OnDestroy {
  clientsService = inject(ClientsService);
  clientsData: ClientsData[] = [];
  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.getClientsData();
  }

  getClientsData() {
    const clientSubscription = this.clientsService
      .clientsData()
      .subscribe((client) => {
        this.clientsData.push(...client);
      });

    this.subscriptions.push(clientSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
