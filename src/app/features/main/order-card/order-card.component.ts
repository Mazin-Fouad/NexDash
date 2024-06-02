import { Component, Input, OnInit } from '@angular/core';
import { OrderHistory } from '../../../core/models/clients-data';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
})
export class OrderCardComponent implements OnInit {
  @Input() orderDetails: OrderHistory[] = [];

  ngOnInit(): void {}
}
