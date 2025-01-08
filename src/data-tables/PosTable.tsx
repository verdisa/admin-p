import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
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
      { id: "1", name: "Café", price: 2.5 },
      { id: "2", name: "Té", price: 2.0 },
      { id: "3", name: "Jugo de naranja", price: 3.0 },
    ]
  },
  {
    name: "Comidas",
    products: [
      { id: "4", name: "Sandwich", price: 5.0 },
      { id: "5", name: "Ensalada", price: 6.0 },
      { id: "6", name: "Pizza", price: 8.0 },
    ]
  },
  {
    name: "Postres",
    products: [
      { id: "7", name: "Tarta de manzana", price: 4.0 },
      { id: "8", name: "Helado", price: 3.5 },
      { id: "9", name: "Brownie", price: 3.0 },
    ]
  }
];

const PosTable: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(productCategories[0].name);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCategory = productCategories.find(cat => cat.name === source.droppableId);
    if (sourceCategory) {
      const draggedProduct = sourceCategory.products[source.index];
      setCartItems(prevItems => [...prevItems, draggedProduct]);
    }
  };

  return (
    <div className="app">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="products-section">
          <h1>Productos</h1>
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
          <div className="product-lists">
            {productCategories.map(category => (
              <div key={category.name} className={activeCategory === category.name ? 'active' : 'hidden'}>
                <ProductList category={category} />
              </div>
            ))}
          </div>
        </div>
        <div className="cart-section">
          <h2>Carrito de Compras</h2>
          <Cart items={cartItems} setItems={setCartItems} />
        </div>
      </DragDropContext>
    </div>
  );
}

export default PosTable;

