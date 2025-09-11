import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import './Cart.css';
import { handleDownloadPdf } from './BillDates'; // Importar handleDownloadPdf
import { formatNumber } from '../utils/numberFormat';

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number; // Cart quantity
  stock: number; // Available stock
  type?: 'gravable' | 'gravable2' |'exento' | 'exonerado';
}

interface CartProps {
  items: Product[];
  setItems: React.Dispatch<React.SetStateAction<Product[]>>;
  clearCart?: () => void; // Nueva prop opcional para limpiar el carrito
}

const Cart: React.FC<CartProps> = ({ items, setItems, clearCart }) => {
  const facturaData = JSON.parse(localStorage.getItem('facturaData') || '{}');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const moneda = facturaData.moneda || 'L';
  const importeGravable1 = items
    .filter(item => item.type === 'gravable' || item.type === undefined)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const importeGravable2 = items
    .filter(item => item.type === 'gravable2')
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const subtotalL = (importeGravable1 + importeGravable2) 
  const importeExento = items.filter(item => item.type === 'exento').reduce((sum, item) => sum + item.price * item.quantity, 0);
  const importeExonerado = items.filter(item => item.type === 'exonerado').reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountAmount = (facturaData.discountAmount || 0) / 100;
  const discount = (importeGravable1 + importeGravable2 + importeExento + importeExonerado) * discountAmount;

  const principalISv = (facturaData.principalISv || 15) / 100;
  const secundaryIsv = (facturaData.secundaryIsv || 0) / 100;
  const principalTax = importeGravable1 * principalISv;
  const secundaryTax = importeGravable2 * secundaryIsv;
  const totalTax = principalTax + secundaryTax;

  const subtotal = (importeGravable1 + importeGravable2 + importeExento + importeExonerado) - discount;
  const total = subtotal + totalTax;
  

  const removeItem = (index: number) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const incrementQuantity = (index: number) => {
    setItems(prevItems => {
      return prevItems.map((item, i) => {
        if (i === index) {
          const newQuantity = item.quantity + 1;
          if (newQuantity > item.stock) {
            alert(`No hay suficiente stock. Stock disponible: ${item.stock}`);
            return item;
          }
          return { ...item, quantity: newQuantity };
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
          const newQuantity = existingItem.quantity + 1;
          if (newQuantity > item.stock) {
            alert(`No hay suficiente stock. Stock disponible: ${item.stock}`);
            return prevItems;
          }
          return prevItems.map(i =>
            i.id === item.id ? { ...i, quantity: newQuantity } : i
          );
        } else {
          if (1 > item.stock) {
            alert(`No hay suficiente stock. Stock disponible: ${item.stock}`);
            return prevItems;
          }
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

  const handlePrintAndClearCart = () => {
    // Descargar PDF
    handleDownloadPdf(items, subtotalL, subtotal, discount, totalTax, total, principalISv, secundaryIsv, principalTax, secundaryTax, importeGravable1, importeGravable2, importeExento, importeExonerado, moneda, discountAmount);
    
    // Limpiar carrito después de la venta
    if (clearCart) {
      clearCart();
    }
    
    // Cerrar modal
    setShowModal(false);
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
                  {moneda}{formatNumber(item.price * item.quantity)}
                </span>
              </div>
              <div className="quantity-controls">
                <button onClick={() => decrementQuantity(index)}>
                  <i className="fas fa-minus"></i>
                </button>
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={item.quantity}
                  onChange={(e) => {
                    const newQty = parseInt(e.target.value, 10) || 1;
                    if (newQty > item.stock) {
                      alert(`No hay suficiente stock. Stock disponible: ${item.stock}`);
                      return;
                    }
                    setItems(prevItems =>
                      prevItems.map((prev, i) =>
                        i === index ? { ...prev, quantity: newQty } : prev
                      )
                    );
                  }}
                />
                <button onClick={() => incrementQuantity(index)} disabled={item.quantity >= item.stock}>
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
          Descuentos({discountAmount * 100}%): -{moneda}{formatNumber(discount)}
        </div>
        <div className="cart-total">
          SubTotal: {moneda}{formatNumber(subtotal)}
        </div>
        <div className="cart-tax">
          ISV ({principalISv * 100}%): {moneda}{formatNumber(principalTax)}
        </div>
        <div className="cart-tax">
          ISV ({secundaryIsv * 100}%): {moneda}{formatNumber(secundaryTax)}
        </div>
        <div className="cart-total">
          TOTAL: {moneda}{formatNumber(total)}
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
            <button className="print-button" onClick={handlePrintAndClearCart}>
              Descargar PDF
            </button>
            <button className="cancel-button" onClick={() => setShowModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;