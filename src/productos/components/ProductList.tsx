import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import '../styles/ProductList.css';
import { Product } from '../../components/Cart';

interface Category {
  name: string;
  products: Product[];
}

interface ProductListProps {
  category: Category;
  addToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ category, addToCart }) => {
  const { products } = category || { name: '', products: [] };
  const facturaData = JSON.parse(localStorage.getItem('facturaData') || '{}');
  const moneda = facturaData.moneda || 'L';
  const [monedaState, setMonedaState] = useState(moneda);
  
  // Cargar el modo de vista desde localStorage
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    const savedViewMode = localStorage.getItem('posViewMode');
    return (savedViewMode as 'list' | 'grid') || 'list';
  });

  // Guardar el modo de vista en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('posViewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedData = JSON.parse(localStorage.getItem('facturaData') || '{}');
      setMonedaState(updatedData.moneda || 'L');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div>
      <div className="view-toggle">
        <button
          className={viewMode === 'list' ? 'active' : ''}
          onClick={() => setViewMode('list')}
        >
          Lista
        </button>
        <button
          className={viewMode === 'grid' ? 'active' : ''}
          onClick={() => setViewMode('grid')}
        >
          Grilla
        </button>
      </div>
      <div className={`product-list ${viewMode}`}>
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            addToCart={addToCart}
            monedaState={monedaState}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}

interface ProductItemProps {
  product: Product;
  addToCart: (product: Product) => void;
  monedaState: string;
  viewMode: 'list' | 'grid';
}

const ProductItem: React.FC<ProductItemProps> = ({ product, addToCart, monedaState, viewMode }) => {
  const [, drag] = useDrag(() => ({
    type: 'product',
    item: product,
  }));

  const price = typeof product.price === 'number' ? product.price : parseFloat(product.price);

  if (viewMode === 'grid') {
    return (
      <div
        ref={drag}
        className="product-item-grid"
        onDoubleClick={() => addToCart(product)}
      >
        <img
          src={(product as any).image || '/vite.svg'}
          alt={product.name}
          className="product-image"
        />
        <div className="product-info">
          <span className="product-name">{product.name}</span>
          <span className="product-price">{monedaState}{price.toFixed(2)}</span>
        </div>
        <button className="add-button" onClick={() => addToCart(product)}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={drag}
      className="product-item"
      onDoubleClick={() => addToCart(product)}
    >
      <span className="product-name">{product.name}</span>
      <span className="product-price">{monedaState}{price.toFixed(2)}</span>
      <button className="add-button" onClick={() => addToCart(product)}>
        <i className="fas fa-plus"></i> 
      </button>
    </div>
  );
}

export default ProductList;