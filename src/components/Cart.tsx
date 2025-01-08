import React from 'react';
import { useDrop } from 'react-dnd';
import './Cart.css';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: Product[];
  setItems: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Cart: React.FC<CartProps> = ({ items, setItems }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * 0.1; // Ejemplo: 10% de descuento
  const tax = (subtotal - discount) * 0.15; // Ejemplo: 15% de impuestos
  const total = subtotal - discount + tax;

  const removeItem = (index: number) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const [, drop] = useDrop(() => ({
    accept: 'product',
    drop: (item: Product) => {
      setItems(prevItems => {
        const existingItem = prevItems.find(i => i.id === item.id);
        if (existingItem) {
          return prevItems.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          return [...prevItems, { ...item, quantity: 1 }];
        }
      });
    },
  }));

  return (
    <div ref={drop} className="cart">
      <div className="cart-items">
        {items.map((item, index) => (
          <div key={item.id} className="cart-item">
            <div className="item-details">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">Cant: {item.quantity}</span>
            </div>
            <div className="item-price-remove">
              <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              <button
                className="remove-button"
                onClick={() => removeItem(index)}
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-subtotal">
          Subtotal: ${subtotal.toFixed(2)}
        </div>
        <div className="cart-discount">
          Descuento: -${discount.toFixed(2)}
        </div>
        <div className="cart-tax">
          Impuestos: ${tax.toFixed(2)}
        </div>
        <div className="cart-total">
          Total: ${total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default Cart;