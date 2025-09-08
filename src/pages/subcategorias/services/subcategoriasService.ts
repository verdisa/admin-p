// subcategorias/services/subcategoriasService.ts
import { collection, query, getDocs } from "firebase/firestore";
import { db } from '../../../firebaseConfig';

// Interfaces locales para evitar problemas de importación
interface Subcategory {
  id: string;
  name: string;
  IdCategory: string;
  categoryName?: string;
}

interface Category {
  id: string;
  name: string;
}

export const fetchSubcategoriesWithCategories = async () => {
  try {
    const localData = localStorage.getItem("subcategoriesWithCategories");
    if (localData) {
      console.log("Datos de subcategorías con categorías cargados desde localStorage");
      return JSON.parse(localData);
    }

    // 1. Primero obtenemos todas las subcategorías
    const subcategoriesQuery = query(collection(db, "subCategories"));
    const subcategoriesSnapshot = await getDocs(subcategoriesQuery);
    const subcategories = subcategoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Subcategory[];

    // 2. Obtenemos todas las categorías
    const categoriesQuery = query(collection(db, "categories"));
    const categoriesSnapshot = await getDocs(categoriesQuery);
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];

    // 3. Creamos un mapa de categorías para búsqueda rápida
    const categoryMap = new Map(
      categories.map(category => [category.id, category.name])
    );

    // 4. Combinamos los datos
    const subcategoriesWithCategories = subcategories.map(subcategory => ({
      ...subcategory,
      categoryName: categoryMap.get(subcategory.IdCategory) || 'Categoría no encontrada'
    }));

    localStorage.setItem("subcategoriesWithCategories", JSON.stringify(subcategoriesWithCategories));
    console.log("Datos de subcategorías con categorías guardados en localStorage");

    return subcategoriesWithCategories;
  } catch (error) {
    console.error('Error fetching subcategories with categories:', error);
    throw error;
  }
};
