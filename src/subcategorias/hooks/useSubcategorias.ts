import { useEffect, useState } from "react";
import { fetchSubcategoriesWithCategories, handleSave, handleAdd, handleDelete, fetchCollectionData } from "../../utils-components/firebaseUtils";
import { Subcategory } from "../types/SubCategoriaInterface";

export const useSubcategorias = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const localData = localStorage.getItem("subcategoriesWithCategories");
        if (localData) {
          setSubcategories(JSON.parse(localData));
          console.log("Datos de subcategorías con categorías cargados desde localStorage");
        } else {
          const subcategoriesList = await fetchSubcategoriesWithCategories();
          setSubcategories(subcategoriesList as Subcategory[]);
          localStorage.setItem("subcategoriesWithCategories", JSON.stringify(subcategoriesList));
          console.log("Datos de subcategorías con categorías cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesList = await fetchCollectionData("categories");
        setCategories(categoriesList as unknown as { id: string; name: string }[]);
        localStorage.setItem("categories", JSON.stringify(categoriesList));
        console.log("Datos de categorías cargados desde Firebase y guardados en localStorage");
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchSubcategories();
    fetchCategories();
  }, []);

  const handleSaveSubcategory = async (updatedRow: Subcategory) => {
    try {
      await handleSave("subCategories", updatedRow as { uid?: string });

      setSubcategories((prevSubcategories) => {
        const updatedSubcategories = prevSubcategories.map((subcategory) =>
          subcategory.id === updatedRow.id ? updatedRow : subcategory
        );
        localStorage.setItem("subcategoriesWithCategories", JSON.stringify(updatedSubcategories));
        return updatedSubcategories;
      });

      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const handleAddSubcategory = async (newSubcategory: Omit<Subcategory, "id">) => {
    try {
      const timestamp = new Date();
      const subcategoryWithDefaults = {
        ...newSubcategory,
        createdAt: { seconds: Math.floor(timestamp.getTime() / 1000), nanoseconds: (timestamp.getTime() % 1000) * 1000000 },
        isActive: true,
      };

      const docRef = await handleAdd("subCategories", subcategoryWithDefaults);

      setSubcategories((prevSubcategories) => {
        const updatedSubcategories = [
          ...prevSubcategories,
          { id: docRef.id, ...subcategoryWithDefaults, categoryName: categories.find(cat => cat.id === subcategoryWithDefaults.IdCategory)?.name || 'Categoría no encontrada' } as unknown as Subcategory,
        ];
        localStorage.setItem("subcategoriesWithCategories", JSON.stringify(updatedSubcategories));
        return updatedSubcategories;
      });

      console.log("Subcategoría añadida correctamente.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al agregar subcategoría:", error);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    try {
      await handleDelete("subCategories", subcategoryId);

      setSubcategories((prevSubcategories) => {
        const updatedSubcategories = prevSubcategories.filter((subcategory) => subcategory.id !== subcategoryId);
        localStorage.setItem("subcategoriesWithCategories", JSON.stringify(updatedSubcategories));
        return updatedSubcategories;
      });

      console.log("Subcategoría eliminada.");
    } catch (error) {
      console.error("Error al eliminar la subcategoría:", error);
    }
  };

  const columns = ["categoryName", "name", "description", "createdAt"];
  const columnNames = {
    categoryName: "Nombre Categoría",
    name: "Nombre Subcategoría",
    description: "Descripción",
    createdAt: "Fecha Creación",
  };
  const editableColumns = ["name", "description"];

  return {
    subcategories,
    categories,
    isModalOpen,
    setIsModalOpen,
    handleSaveSubcategory,
    handleAddSubcategory,
    handleDeleteSubcategory,
    columns,
    columnNames,
    editableColumns,
  };
};
