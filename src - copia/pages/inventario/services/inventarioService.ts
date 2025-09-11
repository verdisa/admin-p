// inventario/services/inventarioService.ts
import { fetchCollectionData } from '../../../utils-components/firebaseUtils';
import { Inventory } from '../../../inventario/types/InventarioInterface';

interface Category {
  id: string;
  name: string;
}

export const fetchInventoriesWithUsersAndCategories = async (): Promise<Inventory[]> => {
  try {
    // Intentar cargar datos de `inventories`, `users` y `categories` desde localStorage
    const localInventories = localStorage.getItem("inventories");
    const localUsers = localStorage.getItem("users");
    const localCategories = localStorage.getItem("categories");

    const inventories = localInventories
      ? JSON.parse(localInventories)
      : await fetchCollectionData("inventories"); // Obtener inventarios de Firebase si no están en localStorage

    const users = localUsers
      ? JSON.parse(localUsers)
      : await fetchCollectionData("users"); // Obtener usuarios de Firebase si no están en localStorage

    const categories = localCategories
      ? JSON.parse(localCategories)
      : await fetchCollectionData("categories"); // Obtener categorías de Firebase si no están en localStorage

    // Guardar datos en localStorage si se obtuvieron de Firebase
    if (!localInventories) {
      localStorage.setItem("inventories", JSON.stringify(inventories));
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
    const combinedData = inventories.map((inventory: any) => {
      const user = users.find((user: any) => user.id === inventory.uid); // Buscar usuario correspondiente
      const categoryName = categoryMap.get(inventory.IdCategory) || 'Categoría no encontrada'; // Buscar categoría correspondiente
      return {
        ...inventory,
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
