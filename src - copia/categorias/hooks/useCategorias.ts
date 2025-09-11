import { useEffect, useState } from 'react';
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from '../../utils-components/firebaseUtils';
import { Category } from '../types/CategoryInterface';

export const useCategorias = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const localData = localStorage.getItem("categories");
        if (localData) {
          setCategories(JSON.parse(localData));
          console.log("Datos cargados desde localStorage");
        } else {
          const categoriesList = await fetchCollectionData('categories');
          setCategories(categoriesList as Category[]);
          localStorage.setItem("categories", JSON.stringify(categoriesList));
          console.log("Datos cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSaveCategory = async (updatedRow: Category) => {
    try {
      await handleSave('categories', updatedRow);
      setCategories((prevCategories) => {
        const updatedCategories = prevCategories.map((category) => (category.uid === updatedRow.uid ? updatedRow : category));
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
        return updatedCategories;
      });
      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleAddCategory = async (newCategory: Omit<Category, 'uid'>) => {
    try {
      const timestamp = new Date(); // Fecha actual
      const categoryWithDefaults = {
        ...newCategory,
        createdAt: { seconds: Math.floor(timestamp.getTime() / 1000), nanoseconds: (timestamp.getTime() % 1000) * 1000000 }, // Agrega la fecha actual
        isActive: true, // Marca como activa por defecto
      };

      const docRef = await handleAdd('categories', categoryWithDefaults);
      const uid = docRef.id; // Obtener el UID generado por Firebase
      const newCategoryWithUid = { uid, ...categoryWithDefaults } as Category;
      setCategories((prevCategories) => {
        const updatedCategories = [...prevCategories, newCategoryWithUid];
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
        return updatedCategories;
      });

      console.log("Categoría agregada correctamente.");
    } catch (error) {
      console.error('Error al agregar categoría:', error);
    }
  };

  const handleDeleteCategory = async (categoryUid: string) => {
    try {
      await handleDelete("categories", categoryUid);
      setCategories((prevCategories) => {
        const updatedCategories = prevCategories.filter((category) => category.uid !== categoryUid);
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
        return updatedCategories;
      });

      console.log("Categoría eliminada.");
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  return {
    categories,
    handleSaveCategory,
    handleAddCategory,
    handleDeleteCategory,
  };
};
