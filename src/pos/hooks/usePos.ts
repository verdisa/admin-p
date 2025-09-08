import { useState, useEffect } from 'react';
import { Product } from '../../components/Cart';

export interface Category {
  uid: string;
  name: string;
  products: Product[];
}

export const usePos = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem("categories") || "[]");
    const storedProducts = JSON.parse(localStorage.getItem("productos") || "[]");

    const categoriesWithProducts = storedCategories.map((category: any) => ({
      ...category,
      products: storedProducts
        .filter((product: any) => product.IdCategory === category.uid)
        .map((p: any) => ({
          id: p.uid,
          name: p.name,
          price: p.price,
          quantity: p.stock,
          type: p.type,
        }))
    }));

    setCategories(categoriesWithProducts);
    if (categoriesWithProducts.length > 0) {
      setActiveCategory(categoriesWithProducts[0].uid);
    }
  }, []);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === product.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === product.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  return {
    cartItems,
    setCartItems,
    categories,
    activeCategory,
    setActiveCategory,
    addToCart
  };
};
