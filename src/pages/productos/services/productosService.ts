// productos/services/productosService.ts
import { fetchCollectionData } from '../../../utils-components/firebaseUtils';

// Interfaces locales para evitar problemas de importación
interface Machine {
  id: string;
  name: string;
  uid: string;
  IdCategory: string;
  displayName?: string;
  categoryName?: string;
}

interface Category {
  id: string;
  name: string;
}

export const fetchMachinesWithUsersAndCategories = async (): Promise<Machine[]> => {
  try {
    // Intentar cargar datos de `machines`, `users` y `categories` desde localStorage
    const localMachines = localStorage.getItem("machines");
    const localUsers = localStorage.getItem("users");
    const localCategories = localStorage.getItem("categories");

    const machines = localMachines
      ? JSON.parse(localMachines)
      : await fetchCollectionData("machines"); // Obtener maquinarias de Firebase si no están en localStorage

    const users = localUsers
      ? JSON.parse(localUsers)
      : await fetchCollectionData("users"); // Obtener usuarios de Firebase si no están en localStorage

    const categories = localCategories
      ? JSON.parse(localCategories)
      : await fetchCollectionData("categories"); // Obtener categorías de Firebase si no están en localStorage

    // Guardar datos en localStorage si se obtuvieron de Firebase
    if (!localMachines) {
      localStorage.setItem("machines", JSON.stringify(machines));
    }
    if (!localUsers) {
      localStorage.setItem("users", JSON.stringify(users));
    }
    if (!localCategories) {
      localStorage.setItem("categories", JSON.stringify(categories));
    }

    // Crear un mapa de categorías para búsqueda rápida
    const categoryMap = new Map(
      categories.map((category: Category) => [category.id, category.name])
    );

    // Combine data based on matching `uid` and `IdCategory`
    const combinedData = machines.map((machine: any) => {
      const user = users.find((user: any) => user.id === machine.uid); // Buscar usuario correspondiente
      const categoryName = categoryMap.get(machine.IdCategory) || 'Categoría no encontrada'; // Buscar categoría correspondiente
      return {
        ...machine,
        displayName: user?.displayName || "Sin Nombre", // Tomar el nombre del usuario o un valor predeterminado
        categoryName, // Tomar el nombre de la categoría o un valor predeterminado
      };
    });

    return combinedData;
  } catch (error) {
    console.error("Error fetching or combining data:", error);
    throw error;
  }
};
