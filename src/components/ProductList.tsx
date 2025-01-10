import React from 'react';
import { useDrag } from 'react-dnd';
import './ProductList.css';

interface Product {
  id: string;
  name: string;
  price: number;
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

const ProductItem: React.FC<ProductItemProps> = ({ product, addToCart }) => {
  const [, drag] = useDrag(() => ({
    type: 'product',
    item: product,
    // Eliminamos la llamada a addToCart en "end" para que no se duplique
    // end: (item, monitor) => {
    //   const dropResult = monitor.getDropResult();
    //   if (item && dropResult) {
    //     addToCart(item);
    //   }
    // },
  }));

  return (
    <div
      ref={drag}
      className="product-item"
      onDoubleClick={() => addToCart(product)}
    >
      <span className="product-name">{product.name}</span>
      <span className="product-price">${product.price.toFixed(2)}</span>
      <button className="add-button" onClick={() => addToCart(product)}>
        <i className="fas fa-plus"></i> 
      </button>
    </div>
  );
}

export default ProductList;