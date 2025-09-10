import { useState, useEffect } from 'react';
import { Product } from '../../components/Cart';

export interface Category {
  uid: string;
  name: string;
  products: Product[];
}

export const usePos = () => {
  // Cargar el carrito desde localStorage
  const [cartItems, setCartItems] = useState<Product[]>(() => {
    const savedCart = localStorage.getItem('posCartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Cargar la categoría activa desde localStorage
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    return localStorage.getItem('posActiveCategory') || '';
  });

  // Guardar el carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('posCartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Guardar la categoría activa en localStorage cuando cambie
  useEffect(() => {
    if (activeCategory) {
      localStorage.setItem('posActiveCategory', activeCategory);
    }
  }, [activeCategory]);

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
    
    // Solo establecer la primera categoría si no hay una guardada
    if (categoriesWithProducts.length > 0 && !activeCategory) {
      setActiveCategory(categoriesWithProducts[0].uid);
    }
  }, [activeCategory]);

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

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('posCartItems');
  };

  return {
    cartItems,
    setCartItems,
    categories,
    activeCategory,
    setActiveCategory,
    addToCart,
    clearCart
  };
};
