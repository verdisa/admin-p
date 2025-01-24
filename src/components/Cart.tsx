import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import './Cart.css';
import jsPDF from "jspdf";

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
    // Variables dinámicas
    const companyName = "SOLUCIONES SOLARES S.A.";
    const rtn = "08019014639996";
    const cai = "B2EDD8-0F6781-4D4B86-8B96A2-CD3A12-D5";
    const address = "Residencial Altos del Comercio\n3era cuadra izquierda 3era casa izquierda";
    const contact = "Tel: +504 2705-9182 | info@solsolenergy.com";
    const invoiceNumber = "250123-1-JMP";
    const date = "23-Jan-2025";
    const order = "Josue Pastor";
    const customerName = "JOSUE PASTOR";
    const customerRTN = "0000000000";
    const customerContact = "Ing. Josué Miguel Pastor";
    const customerTel = "2233-9277";
    const customerEmail = "jmpastor18@hotmail.com";
  
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.15; // 15% ISV
    const total = subtotal + tax;
  
    // Crear PDF
    const doc = new jsPDF();
  
    // Encabezado
    doc.setFontSize(14);
    doc.text(companyName, 10, 10);
    doc.setFontSize(10);
    doc.text(`RTN: ${rtn}`, 10, 16);
    doc.text(`CAI: ${cai}`, 10, 20);
    doc.text(address, 10, 26);
    doc.text(contact, 10, 36);
  
    // Título
    doc.setFontSize(18);
    doc.text("PROFORMA", 150, 20);
  
    // Información de factura
    doc.setFontSize(10);
    doc.text(`No. Proforma: ${invoiceNumber}`, 150, 30);
    doc.text(`Fecha: ${date}`, 150, 35);
    doc.text(`Orden: ${order}`, 150, 40);
  
    // Información del cliente
    doc.setFontSize(10);
    doc.text(`Facturar a: ${customerName}`, 10, 46);
    doc.text(`RTN: ${customerRTN}`, 10, 50);
    doc.text(`Contacto: ${customerContact}`, 10, 54);
    doc.text(`Tel: ${customerTel}`, 10, 58);
    doc.text(`Email: ${customerEmail}`, 10, 62);
  
    // Tabla de productos
    const startY = 70;
    doc.setFontSize(10);
    doc.text("Item", 10, startY);
    doc.text("Descripción", 30, startY);
    doc.text("Cant.", 130, startY, { align: "right" });
    doc.text("Precio Unit", 150, startY, { align: "right" });
    doc.text("Total", 180, startY, { align: "right" });
  
    let currentY = startY + 6;
  
    items.forEach((item, index) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price);
      doc.text(`${index + 1}`, 10, currentY);
      doc.text(item.name, 30, currentY);
      doc.text(`${item.quantity}`, 130, currentY, { align: "right" });
      doc.text(`$${price.toFixed(2)}`, 150, currentY, { align: "right" });
      doc.text(`$${(item.quantity * price).toFixed(2)}`, 180, currentY, { align: "right" });
      currentY += 6;
    });
  
    // Resumen
    currentY += 10;
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 180, currentY, { align: "right" });
    doc.text(`Impuestos (15%): $${tax.toFixed(2)}`, 180, currentY + 6, { align: "right" });
    doc.text(`Total: $${total.toFixed(2)}`, 180, currentY + 12, { align: "right" });
  
    // Pie de página
    currentY += 20;
    doc.text("Proforma Sujeta Aceptación con Firma de Contrato", 10, currentY);
    doc.text("Precio no incluye la instalación", 10, currentY + 6);
  
    // Descargar PDF
    doc.save(`Proforma-${Date.now()}.pdf`);
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
                <button onClick={() => removeItem(index)}>
                  <i className="fas fa-trash"></i>
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