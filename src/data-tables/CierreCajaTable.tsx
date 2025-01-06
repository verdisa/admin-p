import { useEffect, useState } from "react";
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from "../utils-components/firebaseUtils";
import { CierreCaja } from "../interfaces/CierreCajaInterface";
import TableReadData from "../components/TableReadData";
import AddModal from "../components/AddModal";

const CierreCajaTable = () => {
  const [cierres, setCierres] = useState<CierreCaja[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCierres = async () => {
      try {
        const localData = localStorage.getItem("cierres");
        if (localData) {
          setCierres(JSON.parse(localData));
          console.log("Datos cargados desde localStorage");
        } else {
          const cierresList = await fetchCollectionData("cierres");
          setCierres(cierresList as CierreCaja[]);
          localStorage.setItem("cierres", JSON.stringify(cierresList));
          console.log("Datos cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error("Error fetching cierres:", error);
      }
    };

    fetchCierres();
  }, []);

  const handleSaveCierre = async (updatedRow: CierreCaja) => {
    try {
      await handleSave("cierres", updatedRow);
      setCierres((prevCierres) => {
        const updatedCierres = prevCierres.map((cierre) =>
          cierre.id === updatedRow.id ? updatedRow : cierre
        );
        localStorage.setItem("cierres", JSON.stringify(updatedCierres));
        return updatedCierres;
      });
      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const handleAddCierre = async (newCierre: Omit<CierreCaja, "id">) => {
    try {
      const timestamp = new Date();
      const cierreWithDefaults = {
        ...newCierre,
        date: { seconds: Math.floor(timestamp.getTime() / 1000), nanoseconds: (timestamp.getTime() % 1000) * 1000000 },
        isActive: true,
      };

      const docRef = await handleAdd("cierres", cierreWithDefaults);

      setCierres((prevCierres) => {
        const updatedCierres = [
          ...prevCierres,
          { id: docRef.id, ...cierreWithDefaults } as unknown as CierreCaja,
        ];
        localStorage.setItem("cierres", JSON.stringify(updatedCierres));
        return updatedCierres;
      });

      console.log("Cierre de caja añadido correctamente.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al agregar cierre de caja:", error);
    }
  };

  const handleDeleteCierre = async (cierreId: string) => {
    try {
      await handleDelete("cierres", cierreId);

      setCierres((prevCierres) => {
        const updatedCierres = prevCierres.filter((cierre) => cierre.id !== cierreId);
        localStorage.setItem("cierres", JSON.stringify(updatedCierres));
        return updatedCierres;
      });

      console.log("Cierre de caja eliminado.");
    } catch (error) {
      console.error("Error al eliminar el cierre de caja:", error);
    }
  };

  const columns = ["total", "date"];
  const columnNames = {
    total: "Total",
    date: "Fecha",
  };

  const editableColumns = ["total"];

  return (
    <div className="cierres-container">
      <h1>Cierre de Caja</h1>

      <TableReadData<CierreCaja>
        columns={columns}
        data={cierres}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveCierre}
        onDelete={handleDeleteCierre}
      />

      <button className="add-cierre-button" onClick={() => setIsModalOpen(true)}>
        Agregar Cierre de Caja
      </button>

      {isModalOpen && (
        <AddModal
          fields={[
            { key: "total", label: "Total" },
          ]}
          onSave={(data) => handleAddCierre(data as Omit<CierreCaja, "id">)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CierreCajaTable;
