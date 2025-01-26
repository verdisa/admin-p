import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import './Cart.css';
import { handleDownloadPdf } from './BillDates'; // Importar handleDownloadPdf

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type?: 'gravable' | 'exento' | 'exonerado';
}

interface CartProps {
  items: Product[];
  setItems: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Cart: React.FC<CartProps> = ({ items, setItems }) => {
  const facturaData = JSON.parse(localStorage.getItem('facturaData') || '{}');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const moneda = facturaData.moneda || 'L';

  const importeGravable = items.filter(item => (item.type || 'gravable') === 'gravable').reduce((sum, item) => sum + item.price * item.quantity, 0);
  const importeExento = items.filter(item => item.type === 'exento').reduce((sum, item) => sum + item.price * item.quantity, 0);
  const importeExonerado = items.filter(item => item.type === 'exonerado').reduce((sum, item) => sum + item.price * item.quantity, 0);

  const subtotalL = importeGravable + importeExento + importeExonerado;
  const discountAmount = (facturaData.discountAmount || 0) / 100;
  const discount = subtotalL * discountAmount;
  const principalISv = (facturaData.principalISv || 15) / 100;
  const secundaryIsv = (facturaData.secundaryIsv || 0) / 100;
  const principalTax = (importeGravable - discount) * principalISv;
  const secundaryTax = (importeGravable - discount) * secundaryIsv;
  const totalTax = principalTax + secundaryTax;
  const subtotal = subtotalL - discount;
  const total = subtotal + totalTax;
  

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
          return [...prevItems, { ...item, quantity: 1, type: item.type || 'gravable' }];
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

  return (
    <div ref={drop} className="cart">
      <div className="cart-items">
        {items.map((item, index) => (
          <div key={item.id} className="cart-item">
            <div className="item-details">
              <div className="name-price">
                <span className="item-name">{item.name}</span>
                <span className="item-price">
                  {moneda}{(item.price * item.quantity).toFixed(2)}
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
                <button onClick={() => removeItem(index)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-discount">
          Descuentos({discountAmount * 100}%): -{moneda}{discount.toFixed(2)}
        </div>
        <div className="cart-total">
          SubTotal: {moneda}{subtotal.toFixed(2)}
        </div>
        <div className="cart-tax">
          ISV ({principalISv * 100}%): {moneda}{principalTax.toFixed(2)}
        </div>
        <div className="cart-tax">
          ISV ({secundaryIsv * 100}%): {moneda}{secundaryTax.toFixed(2)}
        </div>
        <div className="cart-total">
          TOTAL: {moneda}{total.toFixed(2)}
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
            <button className="print-button" onClick={() => handleDownloadPdf(items, subtotalL, subtotal, discount, totalTax, total, principalISv, secundaryIsv, principalTax, secundaryTax, importeGravable, importeExento, importeExonerado, moneda)}>
              Descargar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;