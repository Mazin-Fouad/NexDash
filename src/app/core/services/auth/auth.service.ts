import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateEmail,
  updatePassword,
  updateProfile,
} from '@angular/fire/auth';
import { Observable, from, tap } from 'rxjs';
import { UserCredential } from '@angular/fire/auth';
import { ErrorHandlerService } from '../errorHandler/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  firebaseAuth = inject(Auth);
  isLoggedIn = false;
  handleErrorService = inject(ErrorHandlerService);

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

  getCurrentUser(): Observable<User | null> {
    // Listen to the Firebase Auth state and return it as an Observable
    return new Observable((subscriber) => {
      const unsubscribe = onAuthStateChanged(
        this.firebaseAuth,
        (user) => {
          subscriber.next(user);
        },
        (error) => {
          subscriber.error(error);
        }
      );
      // Provide a way for the subscription to unsubscribe the onAuthStateChanged listener
      return unsubscribe;
    });
  }

  /**
   * Updates the user profile with provided details.
   *
   * @param {string | null} displayName - New display name for the user.
   * @param {string | null} email - New email address for the user.
   * @param {string | null} password - New password for the user.
   * @param {string | null} photoURL - New photo URL for the user's profile.
   * @return {Observable<void>} An observable that completes when the profile is updated.
   */
  updateUserProfile(
    displayName: string | null,
    email: string | null,
    password: string | null,
    photoURL: string | null
  ): Observable<void> {
    const updateOps = async () => {
      const user = await this.firebaseAuth.currentUser;
      if (!user) throw new Error('Not authenticated');

      if (displayName !== null || photoURL !== null) {
        await updateProfile(user, { displayName, photoURL });
      }

      if (email !== null) {
        await updateEmail(user, email);
      }

      if (password !== null) {
        await updatePassword(user, password);
      }
    };

    return from(updateOps());
  }
}
