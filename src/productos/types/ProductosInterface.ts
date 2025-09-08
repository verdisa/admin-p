export interface Producto {
  uid: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
  isActive?: boolean;
  IdCategory?: string; // Campo para la categoría
  categoryName?: string; // Campo para el nombre de la categoría
  type?: 'gravable' | 'gravable2' |'exento' | 'exonerado'; // Campo para el tipo de producto
}
