import React from 'react';
import jsPDF from "jspdf";
import { Product } from './Cart'; // Asegúrate de exportar la interfaz Product desde Cart.tsx

// Generar número de factura y orden de forma aleatoria
const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Obtener la fecha actual
const date = new Date().toLocaleDateString('es-ES', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});

export const handleDownloadPdf = (items: Product[], subtotal: number, discount: number, totalTax: number, total: number, principalISv: number, secundaryIsv: number, principalTax: number, secundaryTax: number) => {
  // Asegurarse de que los valores sean números
  console.log('Items:', items);
  console.log('Subtotal:', subtotal);
  console.log('Discount:', discount);
  console.log('Total Tax:', totalTax);
  console.log('Total:', total);
  console.log('Principal ISV:', principalISv);
  console.log('Secundary ISV:', secundaryIsv);
  console.log('Principal Tax:', principalTax);
  console.log('Secundary Tax:', secundaryTax);
  subtotal = Number(subtotal) || 0;
  discount = Number(discount) || 0;
  totalTax = Number(totalTax) || 0;
  total = Number(total) || 0;
  principalISv = Number(principalISv) || 0;
  secundaryIsv = Number(secundaryIsv) || 0;
  principalTax = Number(principalTax) || 0;
  secundaryTax = Number(secundaryTax) || 0;

  // Obtener datos del cliente comprador desde localStorage
  const clienteComprador = JSON.parse(localStorage.getItem('clienteComprador') || '{}');
  
  // Obtener datos de la factura desde localStorage
  const facturaData = JSON.parse(localStorage.getItem('facturaData') || '{}');

  // Variables dinámicas
  const companyName = facturaData.companyName || "N/A";
  const rtn = facturaData.rtn || "N/A";
  const cai = facturaData.cai || "N/A";
  const address = facturaData.address || "N/A";
  const contact = facturaData.contact || "N/A";

  const invoiceNumber = `${generateRandomString(6)}-${generateRandomString(3)}`;
  const order = generateRandomString(8);
  const customerName = clienteComprador.nombre || "N/A";
  const costumerEnvoiceFile = clienteComprador.costumerEnvoiceFileName || "factura-";
  const customerRTN = clienteComprador.rtn || "N/A";
  const customerContact = clienteComprador.contacto || "N/A";
  const customerTel = clienteComprador.telefono || "N/A";
  const customerEmail = clienteComprador.email || "N/A";
  const costumerBusinessName = clienteComprador.costumerBusinessName || "N/A";
  const costumerBusinessWithNumber = clienteComprador.costumerBusinessWithNumber || "N/A";

  // Envoice data
  const envoiceFooter = clienteComprador.envoiceFooter || "N/A";

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
  doc.text(`Descuento: -$${discount.toFixed(2)}`, 195, currentY + 6, { align: "right" });
  doc.text(`ISV1 (${(principalISv * 100).toFixed(2)}%): ${principalTax.toFixed(2)}`, 195, currentY + 12, { align: "right" });
  doc.text(`ISV2 (${(secundaryIsv * 100).toFixed(2)}%): ${secundaryTax.toFixed(2)}`, 195, currentY + 18, { align: "right" });
  doc.text(`Total: $${total.toFixed(2)}`, 195, currentY + 24, { align: "right" });

  // Pie de página
  currentY += 30;
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