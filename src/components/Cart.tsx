import React, { useState } from 'react';
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
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * 0.1; // Ejemplo: 10% de descuento
  const tax = (subtotal - discount) * 0.15; // Ejemplo: 15% de impuestos
  const total = subtotal - discount + tax;

  const removeItem = (index: number) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const incrementQuantity = (index: number) => {
    setItems(prevItems => {
      return prevItems.map((item, i) => {
        if (i === index) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    });
  };

  const decrementQuantity = (index: number) => {
    setItems(prevItems => {
      return prevItems.map((item, i) => {
        if (i === index && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
    });
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

  const handleSale = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setShowModal(true);
    }, 1500);
  };

  const handleDownloadPdf = () => {
    const content = `
*********** LA TIENDITA S.A. ***********
RTN: 080119991111
Cliente: Juan Pérez
Fecha: ${new Date().toLocaleString()}
---------------------------------------
Productos:
${items
  .map(
    (item, idx) =>
      `${idx + 1}. ${item.name}\n   Cantidad: ${item.quantity}\n   Precio: $${item.price.toFixed(
        2
      )}\n   Subtotal: $${(item.price * item.quantity).toFixed(2)}\n`
  )
  .join('\n')}
---------------------------------------
Subtotal: $${subtotal.toFixed(2)}
Descuento: $${discount.toFixed(2)}
Impuestos: $${tax.toFixed(2)}
Total: $${total.toFixed(2)}
********** ¡Gracias por su compra! **********
`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Recibo-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div ref={drop} className="cart">
      <div className="cart-items">
        {items.map((item, index) => (
          <div key={item.id} className="cart-item">
            <div className="item-details">
              <div className="name-price">
                <span className="item-name">{item.name}</span>
                <span className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
              <div className="quantity-controls">
                <button onClick={() => decrementQuantity(index)}>
                  <i className="fas fa-minus"></i>
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const newQty = parseInt(e.target.value, 10) || 1;
                    setItems(prevItems =>
                      prevItems.map((prev, i) =>
                        i === index ? { ...prev, quantity: newQty } : prev
                      )
                    );
                  }}
                />
                <button onClick={() => incrementQuantity(index)}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
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
        <button className="sell-button" onClick={handleSale}>Vender</button>
      </div>

      {showToast && (
        <div className="toast-confirmation">
          Confirmando venta...
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Vendido e imprimir recibo</h3>
            <button className="print-button" onClick={handleDownloadPdf}>
              Descargar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;