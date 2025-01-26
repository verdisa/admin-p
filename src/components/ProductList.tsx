import React from 'react';
import { useDrag } from 'react-dnd';
import './ProductList.css';

interface Product {
  id: string;
  name: string;
  price: number | string;
}

interface Category {
  name: string;
  products: Product[];
}

interface ProductListProps {
  category: Category;
  addToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ category, addToCart }) => {
  const { name, products } = category || { name: '', products: [] };

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
  );
}

interface ProductItemProps {
  product: Product;
  addToCart: (product: Product) => void;
}
const facturaData = JSON.parse(localStorage.getItem('facturaData') || '{}');
const moneda = facturaData.moneda || 'L';

const ProductItem: React.FC<ProductItemProps> = ({ product, addToCart }) => {
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
      <span className="product-price">{moneda}{price.toFixed(2)}</span>
      <button className="add-button" onClick={() => addToCart(product)}>
        <i className="fas fa-plus"></i> 
      </button>
    </div>
  );
}

export default ProductList;