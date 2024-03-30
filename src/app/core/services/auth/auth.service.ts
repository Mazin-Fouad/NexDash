import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from '@angular/fire/auth';
import { Observable, from, of, tap } from 'rxjs';
import { UserCredential } from '@angular/fire/auth';
import { profile } from 'console';
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
    displayName: string
  ): Observable<void> {
    // Create user and then update their profile with the provided full name
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      // Update the user's profile with the provided full name
      updateProfile(response.user, {
        displayName: displayName,
        // photoURL: 'https://picsum.photos/seed/picsum/200/300',
      }).then(() => {
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
    this.isLoggedIn = true;
    return from(promise);
  }

  /**
   * Logs in a user with the provided email and password.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @return {Observable<UserCredential>} An observable that emits a UserCredential object upon successful login.
   */
  login(email: string, password: string): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    );
    return from(promise).pipe(
      tap((userCredential: UserCredential) => {
        this.isLoggedIn = true; // Set isLoggedIn here only after successful login
      })
    );
  }

  logout(): Observable<void> {
    return from(this.firebaseAuth.signOut()).pipe(
      tap({
        next: () => {
          this.isLoggedIn = false; // Set isLoggedIn to false only after successful logout
        },
        error: () => {
          console.error('Error during sign out');
          // Handle any errors that occur during logout
        },
      })
    );
  }

  /**
   * Checks if the user is authenticated.
   *
   * @return {boolean} the authentication status of the user
   */
  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  /**
   * Resets the password for the user with the given email.
   *
   * @param {string} email - The email address of the user.
   * @return {Observable<void>} An observable that emits void when the password reset email is sent successfully.
   */
  resetPassword(email: string): Observable<void> {
    const promise = sendPasswordResetEmail(this.firebaseAuth, email);
    return from(promise);
  }

  getCurrentUser(): Observable<any> {
    const user = this.firebaseAuth.currentUser;
    // Wrap the user in an Observable. Use of() if the user exists, otherwise, emit null
    return of(user);
  }
}
