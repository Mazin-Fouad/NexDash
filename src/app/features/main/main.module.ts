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
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../../../environments/environment.development';

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
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
})
export class MainModule {}
