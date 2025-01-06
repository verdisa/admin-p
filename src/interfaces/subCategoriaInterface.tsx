// src/interfaces/CategoryInterface.ts


interface Subcategory  {
  id: string;
  name: string;
  description: string;
  IdCategory: string;
  isActive: boolean;
  createdAt: any;
}

interface Category  {
  id: string;
  name: string;
}

export type { Subcategory, Category };
