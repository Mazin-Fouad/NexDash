import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { OrderHistory } from '../../../core/models/clients-data';
import { initFlowbite } from 'flowbite';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
})
export class OrderCardComponent implements OnInit {
  @Input() orderDetails: OrderHistory[] = [];

  dropdowns: boolean[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.dropdowns = new Array(this.orderDetails.length).fill(false);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
  }

  toggleDropdown(index: number): void {
    this.dropdowns[index] = !this.dropdowns[index];
  }

  changePaymentStatus(index: number, newStatus: string): void {
    this.orderDetails[index].paymentStatus = newStatus;
    this.dropdowns[index] = false;
  }
}
