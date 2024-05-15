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
import { Observable, catchError, from, switchMap, tap } from 'rxjs';
import { UserCredential } from '@angular/fire/auth';
import { ErrorHandlerService } from '../errorHandler/error-handler.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private firebaseAuth = inject(Auth);
  private isLoggedIn = false;
  private handleErrorService = inject(ErrorHandlerService);
  private storage = getStorage();

  /**
   * Registers a new user and updates their profile with the provided display name.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @param {string} displayName - The user's display name.
   * @return {Observable<void>} An observable that completes when the user is registered and profile is updated.
   */
  register(
    email: string,
    password: string,
    displayName: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      updateProfile(response.user, { displayName }).then(() =>
        sendEmailVerification(response.user)
      );
    });

    return from(promise);
  }

  /**
   * Signs in with Google authentication provider.
   *
   * @return {Observable<UserCredential>} An observable of UserCredential.
   */
  signInWithGoogle(): Observable<UserCredential> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.firebaseAuth, provider).then(
      (userCredential) => {
        this.isLoggedIn = true;
        return userCredential;
      }
    );

    return from(promise);
  }

  /**
   * Logs in a user with the provided email and password.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @return {Observable<UserCredential>} An observable of UserCredential upon successful login.
   */
  login(email: string, password: string): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((userCredential) => {
      this.isLoggedIn = true;
      return userCredential;
    });

    return from(promise);
  }

  /**
   * Logs out the current user.
   *
   * @return {Observable<void>} An observable that completes when the user is logged out.
   */
  logout(): Observable<void> {
    return from(this.firebaseAuth.signOut()).pipe(
      tap(() => {
        this.isLoggedIn = false;
      })
    );
  }

  /**
   * Checks if the user is authenticated.
   *
   * @return {boolean} The authentication status of the user.
   */
  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  /**
   * Resets the password for the user with the given email.
   *
   * @param {string} email - The email address of the user.
   * @return {Observable<void>} An observable that completes when the password reset email is sent.
   */
  resetPassword(email: string): Observable<void> {
    const promise = sendPasswordResetEmail(this.firebaseAuth, email);
    return from(promise);
  }

  /**
   * Gets the current authenticated user as an observable.
   *
   * @return {Observable<User | null>} An observable of the current user.
   */
  getCurrentUser(): Observable<User | null> {
    return new Observable((subscriber) => {
      const unsubscribe = onAuthStateChanged(
        this.firebaseAuth,
        (user) => subscriber.next(user),
        (error) => subscriber.error(error)
      );
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

  /**
   * Uploads a profile image for the current user.
   *
   * @param {File} file - The profile image file to upload.
   * @return {Observable<string>} An observable of the download URL of the uploaded image.
   */
  uploadProfileImage(file: File): Observable<string> {
    const user = this.firebaseAuth.currentUser;
    if (!user) {
      throw new Error('Not authenticated');
    }

    const storageRef = ref(this.storage, 'profileImages/' + user.uid);
    return from(uploadBytes(storageRef, file)).pipe(
      switchMap(() => getDownloadURL(storageRef)),
      catchError((error) => {
        throw new Error('Failed to upload image: ' + error.message);
      })
    );
  }
}
