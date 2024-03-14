import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { UserCredential } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);

  firbaseAuth = inject(Auth);

  register(email: string, password: string, fullName: string): Observable<void>{
    const promise = createUserWithEmailAndPassword(this.firbaseAuth, email, password).then(respons => updateProfile(respons.user, {displayName: fullName}));
    return from(promise);
  }

  signInWithGoogle(): Observable<UserCredential> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.firbaseAuth, provider);
    return from(promise);
  }
}

