import React, { useState } from 'react';
import { Inventory } from '../types/InventarioInterface';
import TableReadData from '../../components/TableReadData';
import AddModal from '../../components/AddModal';
import { useInventario } from '../hooks/useInventario';

const InventoryTable: React.FC = () => {
  const { inventories, handleSaveInventory, handleAddInventory, handleDeleteInventory } = useInventario();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
