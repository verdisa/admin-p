export interface User {
  uid?: string; // Identificador único del usuario (opcional).
  nombre: string; // Nombre del usuario.
  apellidos: string; // Apellido(s) del usuario.
  email: string; // Dirección de correo para comunicaciones.
  telefono: string; // Número de contacto.
  username: string; // Nombre de usuario único para iniciar sesión.
  password: string; // Contraseña (hashed y salted).
  roles: ("admin" | "cajero" | "supervisor" | "visita")[]; // Roles o permisos (admin, cajero, supervisor, visita).
  posicion: string; // Cargo del usuario (Ejemplo: Cajero, Supervisor, etc.).
  fechaContratacion: Date; // Fecha de contratación del usuario.
  turnoAsignado: string; // Horario laboral del usuario.
  sucursal: string; // Tienda/sucursal donde trabaja el usuario.
  estado: "Activo" | "Inactivo" | "Bloqueado"; // Estado del usuario.
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  }; // Fecha de creación del registro (opcional).
  salario?: string; // URL de la foto de perfil del usuario (opcional).
  isEmailVerified?: boolean; // Indica si el correo del usuario está verificado (opcional).
}