import React from 'react';
import jsPDF from "jspdf";
import { Product } from './Cart'; // Asegúrate de exportar la interfaz Product desde Cart.tsx

export const handleDownloadPdf = (items: Product[]) => {
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
  const costumerEnvoiceFile = "Proforma";
  const customerRTN = "0000000000";
  const customerContact = "Ing. Josué Miguel Pastor";
  const customerTel = "2233-9277";
  const customerEmail = "jmpastor18@hotmail.com";
  const costumerBusinessName = "PROFORMA";
  const costumerBusinessWithNumber = "No. Proforma";


  // Envoice data
  const envoiceFooter = "Proforma Sujeta Aceptación con Firma de Contrato\nPrecio no incluye la instalación";


  // Cálculos
  const principalISv = 0.15;
  const secundaryIsv = 0.18;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * principalISv; // 15% ISV
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
  doc.setFontSize(22);
  doc.text(costumerBusinessName, 150, 10);

  // Información de factura
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text(costumerBusinessWithNumber, 140, 46, { align: "right" });
  doc.text("Fecha:", 140, 50, { align: "right" });
  doc.text("Orden:", 140, 54, { align: "right" });
  doc.setFont(undefined, 'normal');
  doc.text(invoiceNumber, 195, 46, { align: "right" });
  doc.text(date, 195, 50, { align: "right" });
  doc.text(order, 195, 54, { align: "right" });

  // Información del cliente
  doc.setFont(undefined, 'bold');
  doc.text("Facturar a:", 140, 62, { align: "right" });
  doc.text("RTN:", 140, 66, { align: "right" });
  doc.text("Contacto:", 140, 70, { align: "right" });
  doc.text("Tel:", 140, 74, { align: "right" });
  doc.text("Email:", 140, 78, { align: "right" });
  doc.setFont(undefined, 'normal');
  doc.text(customerName, 195, 62, { align: "right" });
  doc.text(customerRTN, 195, 66, { align: "right" });
  doc.text(customerContact, 195, 70, { align: "right" });
  doc.text(customerTel, 195, 74, { align: "right" });
  doc.text(customerEmail, 195, 78, { align: "right" });

  // Tabla de productos
  const startY = 90;
  doc.setFontSize(10);
  doc.text("Item", 10, startY);
  doc.text("Descripción", 30, startY);
  doc.text("Cant.", 130, startY, { align: "right" });
  doc.text("Precio Unit", 165, startY, { align: "right" });
  doc.text("Total", 195, startY, { align: "right" });

  let currentY = startY + 6;

  items.forEach((item, index) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price);
    doc.text(`${index + 1}`, 10, currentY);
    doc.text(item.name, 30, currentY);
    doc.text(`${item.quantity}`, 130, currentY, { align: "right" });
    doc.text(`$${price.toFixed(2)}`, 165, currentY, { align: "right" });
    doc.text(`$${(item.quantity * price).toFixed(2)}`, 195, currentY, { align: "right" });
    currentY += 6;
  });

  // Resumen
  currentY += 10;
  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 195, currentY, { align: "right" });
  doc.text(`Impuestos (15%): $${tax.toFixed(2)}`, 195, currentY + 6, { align: "right" });
  doc.text(`Total: $${total.toFixed(2)}`, 195, currentY + 12, { align: "right" });

  // Pie de página
  currentY += 20;
  doc.text(envoiceFooter, 10, currentY);
  //doc.text("Precio no incluye la instalación", 10, currentY + 6);

  // Descargar PDF
  doc.save(`${costumerEnvoiceFile}-${Date.now()}.pdf`);
};

const BillDates = () => {
  // Aquí puedes usar handleDownloadPdf con los datos necesarios
  return (
    <div>
      {/* Tu componente aquí */}
    </div>
  );
};

export default BillDates;
