import { Component } from '@angular/core';
import { SidenavComponent } from '../../shared/components/sidenav/sidenav.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [SidenavComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
