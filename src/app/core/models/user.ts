export interface User {
  uid: string;
  email: string;
  password: string;
  photoURL: string;
  displayName: string;
}

export interface UserProfileUpdate {
  email?: string;
  password?: string;
  displayName?: string;
  profileImg?: string; // Use `profileImg` to represent the user's avatar URL
}
