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
  salario?: string; // Salario del usuario (opcional).
  isEmailVerified?: boolean; // Indica si el correo del usuario está verificado (opcional).
  // Nuevos campos de la API
  dni: string;
  nationality: string;
  address: string;
  status: string;
  birth_date: string;
  dni_front_url: string;
  dni_back_url: string;
  phone_number: string;
  created_at: string;
  updated_at: string | null;
  is_active: boolean;
  modified_by: string | null;
  photo_url: string | null;
  additional_prop1: string | null;
  user_id: string | null;
}