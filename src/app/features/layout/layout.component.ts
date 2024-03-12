import { Component } from '@angular/core';
import { RegisterComponent } from '../auth/register/register.component';
import { LoginComponent } from '../auth/login/login.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RegisterComponent, LoginComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
