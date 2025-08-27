import { useEffect, useState } from "react";
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from "../utils-components/firebaseUtils";
import { Venta } from "../interfaces/VentasInterface";
import TableReadData from "../components/TableReadData";
import AddModal from "../components/AddModal";

const VentasTable = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const localData = localStorage.getItem("ventas");
        if (localData) {
          setVentas(JSON.parse(localData));
          console.log("Datos cargados desde localStorage");
        } else {
          const ventasList = await fetchCollectionData("ventas");
          setVentas(ventasList as unknown as Venta[]);
          localStorage.setItem("ventas", JSON.stringify(ventasList));
          console.log("Datos cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error("Error fetching ventas:", error);
      }
    };

    fetchVentas();
  }, []);

  const handleSaveVenta = async (updatedRow: Venta) => {
    try {
      await handleSave("ventas", updatedRow as { uid?: string });
      setVentas((prevVentas) => {
        const updatedVentas = prevVentas.map((venta) =>
          venta.id === updatedRow.id ? updatedRow : venta
        );
        localStorage.setItem("ventas", JSON.stringify(updatedVentas));
        return updatedVentas;
      });
      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const handleAddVenta = async (newVenta: Omit<Venta, "id">) => {
    try {
      const timestamp = new Date();
      const ventaWithDefaults = {
        ...newVenta,
        date: { seconds: Math.floor(timestamp.getTime() / 1000), nanoseconds: (timestamp.getTime() % 1000) * 1000000 },
        isActive: true,
      };

      const docRef = await handleAdd("ventas", ventaWithDefaults);

      setVentas((prevVentas) => {
        const updatedVentas = [
          ...prevVentas,
          { id: docRef.id, ...ventaWithDefaults } as unknown as Venta,
        ];
        localStorage.setItem("ventas", JSON.stringify(updatedVentas));
        return updatedVentas;
      });

      console.log("Venta añadida correctamente.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al agregar venta:", error);
    }
  };

  const handleDeleteVenta = async (ventaId: string) => {
    try {
      await handleDelete("ventas", ventaId);

      setVentas((prevVentas) => {
        const updatedVentas = prevVentas.filter((venta) => venta.id !== ventaId);
        localStorage.setItem("ventas", JSON.stringify(updatedVentas));
        return updatedVentas;
      });

      console.log("Venta eliminada.");
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
    }
  };

  const columns = ["productName", "quantity", "price", "date"];
  const columnNames = {
    productName: "Nombre del Producto",
    quantity: "Cantidad",
    price: "Precio",
    date: "Fecha",
  };

  const editableColumns = ["productName", "quantity", "price"];

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
