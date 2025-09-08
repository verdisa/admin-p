export interface Venta {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  date: {
    seconds: number;
    nanoseconds: number;
  };
  isActive?: boolean;
}
