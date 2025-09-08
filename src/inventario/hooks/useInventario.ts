import { useEffect, useState } from 'react';
import { fetchInventoriesWithUsersAndCategories, handleSave, handleAdd, handleDelete, fetchCollectionData } from '../../utils-components/firebaseUtils';
import { Inventory } from '../types/InventarioInterface';

export const useInventario = () => {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const localData = localStorage.getItem("inventoriesWithUsersAndCategories");
        if (localData) {
          setInventories(JSON.parse(localData));
          console.log("Datos de inventarios con usuarios y categorías cargados desde localStorage");
        } else {
          const inventoriesList = await fetchInventoriesWithUsersAndCategories();
          setInventories(inventoriesList as Inventory[]);
          localStorage.setItem("inventoriesWithUsersAndCategories", JSON.stringify(inventoriesList));
          console.log("Datos de inventarios con usuarios y categorías cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error("Error fetching inventories:", error);
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

    fetchInventories();
    fetchCategories();
  }, []);

  const handleSaveInventory = async (updatedRow: Inventory) => {
    try {
      await handleSave("inventories", updatedRow);

      setInventories((prevInventories) => {
        const updatedInventories = prevInventories.map((inventory) =>
          inventory.id === updatedRow.id ? updatedRow : inventory
        );
        localStorage.setItem("inventoriesWithUsersAndCategories", JSON.stringify(updatedInventories));
        return updatedInventories;
      });

      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const handleAddInventory = async (newInventory: Omit<Inventory, "id">) => {
    try {
      const timestamp = new Date();
      const inventoryWithDefaults = {
        ...newInventory,
        createdAt: { seconds: Math.floor(timestamp.getTime() / 1000), nanoseconds: (timestamp.getTime() % 1000) * 1000000 },
        isActive: true,
      };

      const docRef = await handleAdd("inventories", inventoryWithDefaults);

      setInventories((prevInventories) => {
        const updatedInventories = [
          ...prevInventories,
          { id: docRef.id, ...inventoryWithDefaults, categoryName: categories.find(cat => cat.id === inventoryWithDefaults.category)?.name || 'Categoría no encontrada' } as unknown as Inventory,
        ];
        localStorage.setItem("inventoriesWithUsersAndCategories", JSON.stringify(updatedInventories));
        return updatedInventories;
      });

      console.log("Inventario añadido correctamente.");
    } catch (error) {
      console.error("Error al agregar inventario:", error);
    }
  };

  const handleDeleteInventory = async (inventoryId: string) => {
    try {
      await handleDelete("inventories", inventoryId);

      setInventories((prevInventories) => {
        const updatedInventories = prevInventories.filter((inventory) => inventory.id !== inventoryId);
        localStorage.setItem("inventoriesWithUsersAndCategories", JSON.stringify(updatedInventories));
        return updatedInventories;
      });

      console.log("Inventario eliminado.");
    } catch (error) {
      console.error("Error al eliminar el inventario:", error);
    }
  };

  return {
    inventories,
    categories,
    handleSaveInventory,
    handleAddInventory,
    handleDeleteInventory,
  };
};
