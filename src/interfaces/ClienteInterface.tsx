export interface Cliente {
  uid?: string; // Identificador único del usuario (opcional).
  username: string; // Nombre de usuario.
  nombre: string; // Nombre del cliente.
  email: string; // Dirección de correo para comunicaciones.
  telefono: string; // Número de contacto.
  rtn: string; // RTN del cliente.
  contacto: string; // Contacto del cliente.
  direccion: string; // Dirección del cliente.
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  }; // Fecha de creación del registro (opcional).
  companyName: string; // Nombre de la empresa.
  cai: string; // CAI de la empresa.
  address: string; // Dirección de la empresa.
  contact: string; // Contacto de la empresa.
  invoiceNumber: string; // Número de factura.
  costumerBusinessName: string; // Nombre del negocio del cliente.
  costumerBusinessWithNumber: string; // Número del negocio del cliente.
  envoiceFooter: string; // Pie de página de la factura.
}