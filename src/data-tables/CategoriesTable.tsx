import { useEffect, useState } from "react";
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from "../utils-components/firebaseUtils"; // Asegúrate de agregar handleDelete
import { Category } from "../interfaces/CategoryInterface";
import TableReadData from "../components/TableReadData";
import AddModal from "../components/AddModal";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Para controlar el modal

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const localData = localStorage.getItem("categories");
        if (localData) {
          setCategories(JSON.parse(localData));
          console.log("Datos cargados desde localStorage");
        } else {
          const categoriesList = await fetchCollectionData("categories");
          setCategories(categoriesList as Category[]);
          localStorage.setItem("categories", JSON.stringify(categoriesList));
          console.log("Datos cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSaveCategory = async (updatedRow: Category) => {
    try {
      await handleSave("categories", updatedRow);
      setCategories((prevCategories) => {
        const updatedCategories = prevCategories.map((category) =>
          category.id === updatedRow.id ? updatedRow : category
        );
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
        return updatedCategories;
      });
      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const handleAddCategory = async (newCategory: Omit<Category, "id">) => {
    try {
      const timestamp = new Date(); // Fecha actual
      const categoryWithDefaults = {
        ...newCategory,
        createdAt: { seconds: Math.floor(timestamp.getTime() / 1000), nanoseconds: (timestamp.getTime() % 1000) * 1000000 }, // Agrega la fecha actual
        isActive: true, // Marca como activa por defecto
      };

      // Guardar la categoría en Firebase
      await handleAdd("categories", categoryWithDefaults);

      // Actualiza el estado local
      setCategories((prevCategories) => {
        const updatedCategories = [
          ...prevCategories,
          { id: Date.now().toString(), ...categoryWithDefaults } as unknown as Category,
        ];
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
        return updatedCategories;
      });

      console.log("Categoría agregada correctamente.");
      setIsModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error("Error al agregar categoría:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await handleDelete("categories", categoryId); // Llamar a la función de eliminación en Firebase

      // Eliminar la categoría del estado local
      setCategories((prevCategories) => {
        const updatedCategories = prevCategories.filter((category) => category.id !== categoryId);
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
        return updatedCategories;
      });

      console.log("Categoría eliminada.");
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  const columns = ["name", "description", "createdAt"]; // Agregamos "actions" como columna adicional
  const columnNames = {
    name: "Nombre",
    description: "Descripción",
    createdAt: "Fecha Creación",
  };

  const editableColumns = ["name", "description"]; // Solo estas columnas son editables

  return (
    <div className="users-container">
      <h1>Categorías</h1>

      <TableReadData<Category>
        columns={columns}
        data={categories}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveCategory} // Pasa la función para guardar cambios
        onDelete={handleDeleteCategory} // Pasa la función para eliminar
      />

      <button className="add-user-button" onClick={() => setIsModalOpen(true)}>
        Agregar Categoría
      </button>

      {isModalOpen && (
        <AddModal
          fields={[
            { key: "name", label: "Nombre" },
            { key: "description", label: "Descripción" },
          ]}
          onSave={(data) => handleAddCategory(data as Omit<Category, "id">)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Categories;
