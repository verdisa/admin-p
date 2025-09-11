import { useSubcategorias } from "../hooks/useSubcategorias";
import { Subcategory } from "../types/SubCategoriaInterface";
import TableReadData from "../../components/TableReadData";
import AddModal from "../../components/AddModal";

const SubCategories = () => {
  const {
    subcategories,
    isModalOpen,
    setIsModalOpen,
    handleSaveSubcategory,
    handleAddSubcategory,
    handleDeleteSubcategory,
    columns,
    columnNames,
    editableColumns,
  } = useSubcategorias();

  // Leer las categorías desde localStorage
  const categoriesFromLocalStorage = JSON.parse(localStorage.getItem("categories") || "[]");

  return (
    <div className="users-container">
      <h1>Subcategorías </h1>

      <TableReadData<Subcategory>
        columns={columns}
        data={subcategories}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveSubcategory}
        onDelete={handleDeleteSubcategory}
      />

      <button className="add-user-button" onClick={() => setIsModalOpen(true)}>Agregar Subcategoría</button>

      {isModalOpen && (
        <AddModal
          fields={[
            { key: "name", label: "Nombre Subcategoría" },
            { key: "description", label: "Descripción" },
            { key: "IdCategory", label: "Categoría", type: "select", options: categoriesFromLocalStorage },
          ]}
          onSave={(data) => handleAddSubcategory(data as Omit<Subcategory, "id">)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SubCategories;
