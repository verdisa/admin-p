export interface Empleado {
  uid?: string; // Identificador único del empleado (opcional).
  nombre: string; // Nombre del empleado.
  apellidos: string; // Apellido(s) del empleado.
  email: string; // Dirección de correo para comunicaciones laborales.
  telefono: string; // Número de contacto del empleado.
  roles: ("cajero" | "supervisor" | "visita")[]; // Roles laborales (sin "admin", si no aplica).
  posicion: string; // Cargo del empleado (Ejemplo: Cajero, Supervisor, etc.).
  fechaContratacion: Date; // Fecha de contratación del empleado.
  turnoAsignado: string; // Horario laboral del empleado.
  sucursal: string; // Tienda/sucursal donde trabaja el empleado.
  estado: "Activo" | "Inactivo" | "Bloqueado"; // Estado del empleado.
  photoURL?: string; // URL de la foto de perfil del empleado (opcional).
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  }; // Fecha de creación del registro del empleado (opcional).
  salario?: number; // Salario del empleado (opcional).
  prestaciones?: string[]; // Lista de prestaciones que recibe el empleado (opcional).
}
