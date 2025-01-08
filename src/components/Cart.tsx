import React from 'react';
import { useDrop } from 'react-dnd';
import './Cart.css';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartProps {
  items: Product[];
  setItems: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Cart: React.FC<CartProps> = ({ items, setItems }) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const removeItem = (index: number) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const [, drop] = useDrop(() => ({
    accept: 'product',
    drop: () => ({ name: 'Cart' }),
  }));

  return (
    <div ref={drop} className="cart">
      {items.map((item, index) => (
        <div key={index} className="cart-item">
          <span className="item-name">{item.name}</span>
          <div className="item-price-remove">
            <span className="item-price">${item.price.toFixed(2)}</span>
            <button
              className="remove-button"
              onClick={() => removeItem(index)}
            >
              X
            </button>
          </div>
        </div>
      ))}
      <div className="cart-total">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}

export default Cart;