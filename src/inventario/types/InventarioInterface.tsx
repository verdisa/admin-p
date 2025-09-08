// inventario/types/InventarioInterface.tsx
export interface Inventory {
  id: string;
  uid: string;
  IdCategory: string;
  name?: string;
  quantity?: number;
  category?: string;
  displayName?: string;
  categoryName?: string;
}
