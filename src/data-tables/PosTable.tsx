import { useEffect, useState } from "react";
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from "../utils-components/firebaseUtils";
import { Pos } from "../interfaces/PosInterface";
import TableReadData from "../components/TableReadData";
import AddModal from "../components/AddModal";

const PosTable = () => {
  const [pos, setPos] = useState<Pos[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPos = async () => {
      try {
        const localData = localStorage.getItem("pos");
        if (localData) {
          setPos(JSON.parse(localData));
          console.log("Datos cargados desde localStorage");
        } else {
          const posList = await fetchCollectionData("pos");
          setPos(posList as Pos[]);
          localStorage.setItem("pos", JSON.stringify(posList));
          console.log("Datos cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error("Error fetching pos:", error);
      }
    };

    fetchPos();
  }, []);

  const handleSavePos = async (updatedRow: Pos) => {
    try {
      await handleSave("pos", updatedRow);
      setPos((prevPos) => {
        const updatedPos = prevPos.map((pos) =>
          pos.id === updatedRow.id ? updatedRow : pos
        );
        localStorage.setItem("pos", JSON.stringify(updatedPos));
        return updatedPos;
      });
      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const handleAddPos = async (newPos: Omit<Pos, "id">) => {
    try {
      const timestamp = new Date();
      const posWithDefaults = {
        ...newPos,
        date: { seconds: Math.floor(timestamp.getTime() / 1000), nanoseconds: (timestamp.getTime() % 1000) * 1000000 },
        isActive: true,
      };

      const docRef = await handleAdd("pos", posWithDefaults);

      setPos((prevPos) => {
        const updatedPos = [
          ...prevPos,
          { id: docRef.id, ...posWithDefaults } as unknown as Pos,
        ];
        localStorage.setItem("pos", JSON.stringify(updatedPos));
        return updatedPos;
      });

      console.log("POS añadido correctamente.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al agregar POS:", error);
    }
  };

  const handleDeletePos = async (posId: string) => {
    try {
      await handleDelete("pos", posId);

      setPos((prevPos) => {
        const updatedPos = prevPos.filter((pos) => pos.id !== posId);
        localStorage.setItem("pos", JSON.stringify(updatedPos));
        return updatedPos;
      });

      console.log("POS eliminado.");
    } catch (error) {
      console.error("Error al eliminar el POS:", error);
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
    <div className="pos-container">
      <h1>POS</h1>

      <TableReadData<Pos>
        columns={columns}
        data={pos}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSavePos}
        onDelete={handleDeletePos}
      />

      <button className="add-pos-button" onClick={() => setIsModalOpen(true)}>
        Agregar POS
      </button>

      {isModalOpen && (
        <AddModal
          fields={[
            { key: "productName", label: "Nombre del Producto" },
            { key: "quantity", label: "Cantidad" },
            { key: "price", label: "Precio" },
          ]}
          onSave={(data) => handleAddPos(data as Omit<Pos, "id">)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PosTable;
