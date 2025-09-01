import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import ClienteModale from '../components/clienteModale';
import FacturaModale from '../components/FacturaModale';
import './PosTable.css';
import { Product } from '../components/Cart';

interface Category {
  uid: string;
  name: string;
  products: Product[];
}

const PosTable: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isClienteModaleOpen, setIsClienteModaleOpen] = useState(false);
  const [isFacturaModaleOpen, setIsFacturaModaleOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="pos-container">
        {isSidebarOpen && (
          <div className="sidebar-overlay active">
            <div className="sidebar-overlay-clickable" onClick={() => setIsSidebarOpen(false)}></div>
          </div>
        )}
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="icon-menu">
            <a href="#" className="icon-menu-item" onClick={() => setIsFacturaModaleOpen(true)}>
              <i className="fas fa-file-invoice"></i>
            </a>
            <a href="#" className="icon-menu-item" onClick={() => setIsClienteModaleOpen(true)}>
              <i className="fas fa-user-cog"></i>
            </a>
          </div>
          <h1>Categorías</h1>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category.uid}
                className={`category-button ${activeCategory === category.uid ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(category.uid);
                  setIsSidebarOpen(false);
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="products-section">
          <div className="products-header">
            <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <i className="fas fa-bars"></i> Categorías
            </button>
            <h1>Productos</h1>
          </div>
          <div className="product-lists">
            {categories.map(category => (
              <div key={category.uid} className={activeCategory === category.uid ? 'active' : 'hidden'}>
                <ProductList category={category} addToCart={addToCart} />
              </div>
            ))}
          </div>
        </div>
        <div className="cart-section">
          <h2>Carrito de Compras</h2>
          <Cart items={cartItems} setItems={setCartItems} />
        </div>
      </div>
      {isClienteModaleOpen && <ClienteModale onClose={() => setIsClienteModaleOpen(false)} />}
      {isFacturaModaleOpen && <FacturaModale onClose={() => setIsFacturaModaleOpen(false)} />}
    </DndProvider>
  );
}
export default PosTable;