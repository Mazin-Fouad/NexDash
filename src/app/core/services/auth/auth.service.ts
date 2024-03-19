import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { UserCredential } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  firebaseAuth = inject(Auth);
  isLoggedIn = false;

  /**
   * Create user and then update their profile with the provided full name
   *
   * @param {string} email - description of parameter
   * @param {string} password - description of parameter
   * @param {string} fullName - description of parameter
   * @return {Observable<void>} description of return value
   */
  register(
    email: string,
    password: string,
    fullName: string
  ): Observable<void> {
    // Create user and then update their profile with the provided full name
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      // Update the user's profile with the provided full name
      updateProfile(response.user, { displayName: fullName }).then(() => {
        // Send verification email
        sendEmailVerification(response.user);
      });
      return;
    });
    return from(promise);
  }

  /**
   * signInWithGoogle function signs in with Google authentication provider.
   *
   * @return {Observable<UserCredential>} returns an Observable of UserCredential
   */
  signInWithGoogle(): Observable<UserCredential> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.firebaseAuth, provider);
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {});
    this.isLoggedIn = true;
    return from(promise);
  }

  logOut(): Observable<void> {
    const promise = this.firebaseAuth.signOut();
    this.isLoggedIn = false;
    return from(promise);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
