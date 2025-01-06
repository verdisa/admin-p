// src/interfaces/UserInterface.ts
export interface User {
  id: string;
  roles?: string[];
  email?: string;
  uid?: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  isEmailVerified?: boolean;
}
