import { useVentas } from "../hooks/useVentas";
import { Venta } from "../types/VentasInterface";
import TableReadData from "../../components/TableReadData";
import AddModal from "../../components/AddModal";

const VentasTable = () => {
  const {
    ventas,
    isModalOpen,
    setIsModalOpen,
    handleSaveVenta,
    handleAddVenta,
    handleDeleteVenta,
    columns,
    columnNames,
    editableColumns,
  } = useVentas();

  return (
    <div className="ventas-container">
      <h1>Ventas</h1>

      <TableReadData<Venta>
        columns={columns}
        data={ventas}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveVenta}
        onDelete={handleDeleteVenta}
      />

      <button className="add-venta-button" onClick={() => setIsModalOpen(true)}>
        Agregar Venta
      </button>

      {isModalOpen && (
        <AddModal
          fields={[
            { key: "productName", label: "Nombre del Producto" },
            { key: "quantity", label: "Cantidad" },
            { key: "price", label: "Precio" },
          ]}
          onSave={(data) => handleAddVenta(data as Omit<Venta, "id">)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default VentasTable;
