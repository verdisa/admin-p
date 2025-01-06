export interface Producto {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
  isActive?: boolean;
}
