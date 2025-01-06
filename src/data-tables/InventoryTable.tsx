import React, { useEffect, useState } from 'react';
import { fetchInventoriesWithUsersAndCategories, handleSave, handleAdd, handleDelete, fetchCollectionData } from '../utils-components/firebaseUtils';
import { Inventory } from '../interfaces/Inventarionterface';
import TableReadData from '../components/TableReadData';
import AddModal from '../components/AddModal';

const InventoryTable: React.FC = () => {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setCategories(categoriesList as { id: string; name: string }[]);
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
      setIsModalOpen(false);
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

  const columns = ["name", "categoryName", "displayName", "quantity"];
  const columnNames = {
    name: "Nombre",
    categoryName: "Categoría",
    displayName: "Usuario",
    quantity: "Cantidad",
  };

  const editableColumns = ["name", "quantity"];

  const categoriesFromLocalStorage = JSON.parse(localStorage.getItem("categories") || "[]");

  return (
    <div className="inventory-container">
      <h1>Inventario</h1>

      <TableReadData<Inventory>
        columns={columns}
        data={inventories}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveInventory}
        onDelete={handleDeleteInventory}
      />

      <button className="add-inventory-button" onClick={() => setIsModalOpen(true)}>Agregar Inventario</button>

      {isModalOpen && (
        <AddModal
          fields={[
            { key: "name", label: "Nombre Inventario" },
            { key: "quantity", label: "Cantidad" },
            { key: "category", label: "Categoría", type: "select", options: categoriesFromLocalStorage },
          ]}
          onSave={(data) => handleAddInventory(data as Omit<Inventory, "id">)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default InventoryTable;
