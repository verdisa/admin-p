import { useEffect, useState } from "react";
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from "../utils-components/firebaseUtils";
import { Producto } from "../interfaces/ProductosInterface";
import TableReadData from "../components/TableReadData";
import AddModal from "../components/AddModal";

const ProductosTable = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const localData = localStorage.getItem("productos");
        if (localData) {
          setProductos(JSON.parse(localData));
          console.log("Datos cargados desde localStorage");
        } else {
          const productosList = await fetchCollectionData("productos");
          setProductos(productosList as Producto[]);
          localStorage.setItem("productos", JSON.stringify(productosList));
          console.log("Datos cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error("Error fetching productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const handleSaveProducto = async (updatedRow: Producto) => {
    try {
      await handleSave("productos", updatedRow);
      setProductos((prevProductos) => {
        const updatedProductos = prevProductos.map((producto) =>
          producto.id === updatedRow.id ? updatedRow : producto
        );
        localStorage.setItem("productos", JSON.stringify(updatedProductos));
        return updatedProductos;
      });
      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const handleAddProducto = async (newProducto: Omit<Producto, "id">) => {
    try {
      const timestamp = new Date();
      const productoWithDefaults = {
        ...newProducto,
        createdAt: { seconds: Math.floor(timestamp.getTime() / 1000), nanoseconds: (timestamp.getTime() % 1000) * 1000000 },
        isActive: true,
      };

      const docRef = await handleAdd("productos", productoWithDefaults);

      setProductos((prevProductos) => {
        const updatedProductos = [
          ...prevProductos,
          { id: docRef.id, ...productoWithDefaults } as unknown as Producto,
        ];
        localStorage.setItem("productos", JSON.stringify(updatedProductos));
        return updatedProductos;
      });

      console.log("Producto añadido correctamente.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const handleDeleteProducto = async (productoId: string) => {
    try {
      await handleDelete("productos", productoId);

      setProductos((prevProductos) => {
        const updatedProductos = prevProductos.filter((producto) => producto.id !== productoId);
        localStorage.setItem("productos", JSON.stringify(updatedProductos));
        return updatedProductos;
      });

      console.log("Producto eliminado.");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const columns = ["name", "description", "price", "stock", "createdAt"];
  const columnNames = {
    name: "Nombre",
    description: "Descripción",
    price: "Precio",
    stock: "Stock",
    createdAt: "Fecha Creación",
  };

  const editableColumns = ["name", "description", "price", "stock"];

  return (
    <div className="productos-container">
      <h1>Productos</h1>

      <TableReadData<Producto>
        columns={columns}
        data={productos}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveProducto}
        onDelete={handleDeleteProducto}
      />

      <button className="add-producto-button" onClick={() => setIsModalOpen(true)}>
        Agregar Producto
      </button>

      {isModalOpen && (
        <AddModal
          fields={[
            { key: "name", label: "Nombre" },
            { key: "description", label: "Descripción" },
            { key: "price", label: "Precio" },
            { key: "stock", label: "Stock" },
          ]}
          onSave={(data) => handleAddProducto(data as Omit<Producto, "id">)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductosTable;
