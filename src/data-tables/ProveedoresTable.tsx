import React, { useEffect, useState } from 'react';
import { fetchMachinesWithUsersAndCategories, handleSave, handleAdd, handleDelete, fetchCollectionData } from '../utils-components/firebaseUtils';
import { Machine } from '../interfaces/ProveedoresInterface';
import TableReadData from '../components/TableReadData';
import AddModal from '../components/AddModal'; // Asegúrate de que este modal exista

const MaquinariaTable: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Para abrir y cerrar el modal

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const localData = localStorage.getItem("machinesWithUsersAndCategories");
        if (localData) {
          setMachines(JSON.parse(localData));
          console.log("Datos de máquinas con usuarios y categorías cargados desde localStorage");
        } else {
          const machinesList = await fetchMachinesWithUsersAndCategories();
          setMachines(machinesList as Machine[]);
          localStorage.setItem("machinesWithUsersAndCategories", JSON.stringify(machinesList));
          console.log("Datos de máquinas con usuarios y categorías cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error("Error fetching machines:", error);
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

    fetchMachines();
    fetchCategories();
  }, []);

  const handleSaveMachine = async (updatedRow: Machine) => {
    try {
      // Guarda los cambios en Firebase usando la función genérica
      await handleSave("machines", updatedRow);

      // Actualiza el estado local
      setMachines((prevMachines) => {
        const updatedMachines = prevMachines.map((machine) =>
          machine.uid === updatedRow.uid ? updatedRow : machine
        );
        localStorage.setItem("machinesWithUsersAndCategories", JSON.stringify(updatedMachines));
        return updatedMachines;
      });

      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const handleAddMachine = async (newMachine: Omit<Machine, "uid">) => {
    try {
      const timestamp = new Date();
      const machineWithDefaults = {
        ...newMachine,
        createdAt: { seconds: Math.floor(timestamp.getTime() / 1000), nanoseconds: (timestamp.getTime() % 1000) * 1000000 },
        isActive: true,
      };

      const docRef = await handleAdd("machines", machineWithDefaults);

      setMachines((prevMachines) => {
        const updatedMachines = [
          ...prevMachines,
          { uid: docRef.id, ...machineWithDefaults, categoryName: categories.find(cat => cat.id === machineWithDefaults.IdCategory)?.name || 'Categoría no encontrada' } as unknown as Machine,
        ];
        localStorage.setItem("machinesWithUsersAndCategories", JSON.stringify(updatedMachines));
        return updatedMachines;
      });

      console.log("Máquina añadida correctamente.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al agregar máquina:", error);
    }
  };

  const handleDeleteMachine = async (machineId: string) => {
    try {
      await handleDelete("machines", machineId);

      setMachines((prevMachines) => {
        const updatedMachines = prevMachines.filter((machine) => machine.uid !== machineId);
        localStorage.setItem("machinesWithUsersAndCategories", JSON.stringify(updatedMachines));
        return updatedMachines;
      });

      console.log("Máquina eliminada.");
    } catch (error) {
      console.error("Error al eliminar la máquina:", error);
    }
  };

  const columns = ["name", "categoryName", "displayName", "año", "documento", "placa"];
  const columnNames = {
    name: "Nombre",
    categoryName: "Categoría",
    displayName: "Usuario",
    año: "Año",
    documento: "Documento",
    placa: "Placa",
  };

  // Solo los campos 'name', 'año', 'documento' y 'placa' son editables
  const editableColumns = ["name", "usuario", "año", "documento", "placa"];

  // Leer las categorías desde localStorage
  const categoriesFromLocalStorage = JSON.parse(localStorage.getItem("categories") || "[]");

  return (
    <div className="users-container">
      <h1>Máquinas</h1>

      <TableReadData<Machine>
        columns={columns}
        data={machines}
        columnNames={columnNames}
        editableColumns={editableColumns} // Especifica las columnas editables
        onSave={handleSaveMachine} // Pasa la función para guardar cambios
        onDelete={handleDeleteMachine} // Pasa la función para eliminar
      />

      <button className="add-user-button" onClick={() => setIsModalOpen(true)}>Agregar Máquina</button>

      {isModalOpen && (
        <AddModal
          fields={[
            { key: "name", label: "Nombre Máquina" },
            { key: "año", label: "Año" },
            { key: "documento", label: "Documento" },
            { key: "placa", label: "Placa" },
            { key: "IdCategory", label: "Categoría", type: "select", options: categoriesFromLocalStorage },
          ]}
          onSave={(data) => handleAddMachine(data as Omit<Machine, "uid">)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MaquinariaTable;