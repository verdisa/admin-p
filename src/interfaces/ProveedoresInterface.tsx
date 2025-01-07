export interface Proveedor {
  uid: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  nombreComercial?: string; // Si tiene un nombre comercial distinto al oficial
  rfcNitTaxId?: string; // Número de identificación fiscal
  horarioAtencion?: string; // Horarios de contacto
  cuentaBancaria?: string; // Información para transferencias
  estado: 'Activo' | 'Inactivo'; // Estado del proveedor
  fechaRegistro: string; // Fecha de registro en el sistema (ISO 8601)
}
