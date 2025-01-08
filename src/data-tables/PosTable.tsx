import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import './PosTable.css';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Category {
  name: string;
  products: Product[];
}

const productCategories: Category[] = [
  {
    name: "Bebidas",
    products: [
      { id: "bebidas-1", name: "Café", price: 2.5 },
      { id: "bebidas-2", name: "Té", price: 2.0 },
      { id: "bebidas-3", name: "Jugo de naranja", price: 3.0 },
    ]
  },
  {
    name: "Comidas",
    products: [
      { id: "comidas-1", name: "Sandwich", price: 5.0 },
      { id: "comidas-2", name: "Ensalada", price: 6.0 },
      { id: "comidas-3", name: "Pizza", price: 8.0 },
    ]
  },
  {
    name: "Postres",
    products: [
      { id: "postres-1", name: "Tarta de manzana", price: 4.0 },
      { id: "postres-2", name: "Helado", price: 3.5 },
      { id: "postres-3", name: "Brownie", price: 3.0 },
    ]
  }
];

const PosTable: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(productCategories[0].name);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => [...prevItems, product]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="pos-container">
        <div className="sidebar">
          <h1>Categorías</h1>
          <div className="category-buttons">
            {productCategories.map(category => (
              <button
                key={category.name}
                className={`category-button ${activeCategory === category.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="products-section">
          <h1>Productos</h1>
          <div className="product-lists">
            {productCategories.map(category => (
              <div key={category.name} className={activeCategory === category.name ? 'active' : 'hidden'}>
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
    </DndProvider>
  );
}

export default PosTable;