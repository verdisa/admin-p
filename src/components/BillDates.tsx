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

const currentDate = new Date();
const limitDate = new Date(currentDate.setMonth(currentDate.getMonth() + 6)).toLocaleDateString('es-ES', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});

export const handleDownloadPdf = (items: Product[], subtotalL: number, subtotal: number, discount: number, totalTax: number, total: number, principalISv: number, secundaryIsv: number, principalTax: number, secundaryTax: number, importeGravable1: number, importeGravable2: number, importeExento: number, importeExonerado: number, moneda: string, discountAmount: number) => {
  // Asegurarse de que los valores sean números
  importeGravable1 = Number(importeGravable1) || 0;
  importeGravable2 = Number(importeGravable2) || 0;
  importeExento = Number(importeExento) || 0;
  importeExonerado = Number(importeExonerado) || 0;

  subtotalL = Number(subtotalL) || 0;
  discount = Number(discount) || 0;
  principalISv = Number(principalISv) || 0;
  secundaryIsv = Number(secundaryIsv) || 0;
  principalTax = Number(principalTax) || 0;
  secundaryTax = Number(secundaryTax) || 0;
  totalTax = Number(totalTax) || 0;
  subtotal = Number(subtotal) || 0;
  total = Number(total) || 0;

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
  const companyLogo = facturaData.companyLogo || "";
  const rango = facturaData.rango || "N/A";
  const fileEnvoiceName = facturaData.fileEnvoiceName || "factura-";
  const envoiceFormType = facturaData.envoiceForm || "N/A";



  const invoiceNumber = `${generateRandomString(6)}-${generateRandomString(3)}`;
  const order = generateRandomString(8);
  const customerName = clienteComprador.nombre || "N/A";
  const customerRTN = clienteComprador.rtn || "N/A";
  const customerContact = clienteComprador.contacto || "N/A";
  const customerTel = clienteComprador.telefono || "N/A";
  const customerEmail = clienteComprador.email || "N/A";
  const costumerBusinessWithNumber = clienteComprador.costumerBusinessWithNumber || "N/A";

  // Envoice data
  const envoiceFooter = clienteComprador.envoiceFooter || "N/A";

  // Crear PDF
  const doc = new jsPDF();

  if (companyLogo) {
    doc.addImage(companyLogo, 'PNG', 10, 10, 45, 15); // Ajustar el tamaño y posición según sea necesario
  }
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName, 10, 36); // 45 - 9
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`RTN: ${rtn}`, 10, 42); // 51 - 9
  doc.text(`CAI: ${cai}`, 10, 46); // 55 - 9
  doc.text(`Del ${rango}`, 10, 50); // Añadir rango
  doc.text(`Fecha límite: ${limitDate}`, 10, 54); // Añadir fecha límite
  doc.text(address, 10, 60); // 61 - 9
  doc.text(contact, 10, 70); // 71 - 9

  // Título
  doc.setFontSize(22);
  doc.text(envoiceFormType, 150, 20);

  // Información de factura
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(costumerBusinessWithNumber, 140, 36, { align: "right" }); // 46 - 10
  doc.text("Fecha:", 140, 40, { align: "right" }); // 50 - 10
  doc.text("Orden:", 140, 44, { align: "right" }); // 54 - 10
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceNumber, 195, 36, { align: "right" }); // 46 - 10
  doc.text(date, 195, 40, { align: "right" }); // 50 - 10
  doc.text(order, 195, 44, { align: "right" }); // 54 - 10
  
  // Información del cliente
  doc.setFont('helvetica', 'bold');
  doc.text("Facturar a:", 140, 52, { align: "right" }); // 62 - 10
  doc.text("RTN:", 140, 56, { align: "right" }); // 66 - 10
  doc.text("Contacto:", 140, 60, { align: "right" }); // 70 - 10
  doc.text("Tel:", 140, 64, { align: "right" }); // 74 - 10
  doc.text("Email:", 140, 68, { align: "right" }); // 78 - 10
  doc.setFont('helvetica', 'normal');
  doc.text(customerName, 195, 52, { align: "right" }); // 62 - 10
  doc.text(customerRTN, 195, 56, { align: "right" }); // 66 - 10
  doc.text(customerContact, 195, 60, { align: "right" }); // 70 - 10
  doc.text(customerTel, 195, 64, { align: "right" }); // 74 - 10
  doc.text(customerEmail, 195, 68, { align: "right" }); // 78 - 10

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
    doc.text(`${moneda}${price.toFixed(2)}`, 165, currentY, { align: "right" });
    doc.text(`${moneda}${(item.quantity * price).toFixed(2)}`, 195, currentY, { align: "right" });
    currentY += 6;
  });

  // Resumen
  currentY += 10;

  // Información de importes
  doc.text("Importe Gravable:", 140, currentY, { align: "left" });
  doc.text(`${moneda}${subtotalL.toFixed(2)}`, 195, currentY, { align: "right" });
  
  doc.text("Importe Exento:", 140, currentY + 6, { align: "left" });
  doc.text(`${moneda}${importeExento.toFixed(2)}`, 195, currentY + 6, { align: "right" });
  
  doc.text("Importe Exonerado:", 140, currentY + 12, { align: "left" });
  doc.text(`${moneda}${importeExonerado.toFixed(2)}`, 195, currentY + 12, { align: "right" });
  
  doc.text("Sub-Total:", 140, currentY + 18, { align: "left" });
  doc.text(`${moneda}${subtotalL.toFixed(2)}`, 195, currentY + 18, { align: "right" });
  
  doc.text(`Descuento (${discountAmount * 100}%):`, 140, currentY + 24, { align: "left" });
  doc.text(`-${moneda}${discount.toFixed(2)}`, 195, currentY + 24, { align: "right" });
  
  doc.text(`Gravados (${principalISv * 100}%):`, 140, currentY + 30, { align: "left" });
  doc.text(`${moneda}${(importeGravable1 - discount).toFixed(2)}`, 195, currentY + 30, { align: "right" });
  
  doc.text(`Gravados (${secundaryIsv * 100}%):`, 140, currentY + 36, { align: "left" });
  doc.text(`${moneda}${(importeGravable2 - discount).toFixed(2)}`, 195, currentY + 36, { align: "right" });
  
  doc.text("Sub Total neto:", 140, currentY + 42, { align: "left" });
  doc.text(`${moneda}${subtotal.toFixed(2)}`, 195, currentY + 42, { align: "right" });
  
  doc.text(`ISV (${principalISv * 100}%):`, 140, currentY + 48, { align: "left" });
  doc.text(`${moneda}${principalTax.toFixed(2)}`, 195, currentY + 48, { align: "right" });
  
  doc.text(`ISV (${secundaryIsv * 100}%):`, 140, currentY + 54, { align: "left" });
  doc.text(`${moneda}${secundaryTax.toFixed(2)}`, 195, currentY + 54, { align: "right" });
  
  // Total
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("TOTAL:", 140, currentY + 60, { align: "left" });
  doc.text(`${moneda}${total.toFixed(2)}`, 195, currentY + 60, { align: "right" });
  
  currentY += 66;

  doc.text(envoiceFooter, 80, currentY + 20);
  //doc.text("Precio no incluye la instalación", 10, currentY + 6);

  // Descargar PDF
  doc.save(`${fileEnvoiceName}-${Date.now()}.pdf`);
};

const BillDates = () => {
  return (
    <div>
      {/* Tu componente aquí */}
    </div>
  );
};

export default BillDates;