import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.scss',
})
export class ClientDetailsComponent implements OnInit, AfterViewInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ClientDetailsComponent) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  ngAfterViewInit(): void {}
}
