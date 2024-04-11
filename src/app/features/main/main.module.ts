import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { UpdateProfileComponent } from './sidenav/update-profile/update-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientsComponent } from './clients/clients.component';
import { MainComponent } from './main.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    SidenavComponent,
    UpdateProfileComponent,
    ClientsComponent,
    MainComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    RouterOutlet,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class MainModule {}
