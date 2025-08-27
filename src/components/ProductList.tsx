import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import './ProductList.css';
import { Product } from './Cart';

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
    <div className="product-list">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} addToCart={addToCart} monedaState={monedaState} />
      ))}
    </div>
  );
}

interface ProductItemProps {
  product: Product;
  addToCart: (product: Product) => void;
  monedaState: string;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, addToCart, monedaState }) => {
  const [, drag] = useDrag(() => ({
    type: 'product',
    item: product,
  }));

  const price = typeof product.price === 'number' ? product.price : parseFloat(product.price);

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