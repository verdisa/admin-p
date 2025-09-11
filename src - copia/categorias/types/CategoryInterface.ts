export interface Category {
  uid: string; // Identificador único de la categoría
  name: string; // Nombre de la categoría
  description?: string; // Descripción de la categoría
  createdAt?: { // Fecha y hora de creación
    seconds: number;
    nanoseconds: number;
  };
  isActive?: boolean; // Si la categoría está activa o no
  photoUrl?: string; // URL de la imagen representativa
  priority?: number; // Orden de prioridad de la categoría
}
