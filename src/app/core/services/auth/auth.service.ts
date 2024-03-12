import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { response } from 'express';
import { Observable, from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firbaseAuth = inject(Auth);

  register(email: string, password: string, fullName: string): Observable<void>{
    const promise = createUserWithEmailAndPassword(this.firbaseAuth, email, password).then(respons => updateProfile(respons.user, {displayName: fullName}));
    return from(promise);
  }
}
