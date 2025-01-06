// src/interfaces/CategoryInterface.ts
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
  isActive?: boolean;
}
