import { useEffect, useState } from 'react';
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from '../utils-components/firebaseUtils';
import { Category } from '../interfaces/CategoryInterface';
import TableReadData from '../components/TableReadData';
import AddModal from '../components/AddModal';

const CategoriesTable = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const localData = localStorage.getItem("categories");
        if (localData) {
          setCategories(JSON.parse(localData));
          console.log("Datos cargados desde localStorage");
        } else {
          const categoriesList = await fetchCollectionData('categories');
          setCategories(categoriesList as Category[]);
          localStorage.setItem("categories", JSON.stringify(categoriesList));
          console.log("Datos cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSaveCategory = async (updatedRow: Category) => {
    try {
      await handleSave('categories', updatedRow);
      setCategories((prevCategories) => {
        const updatedCategories = prevCategories.map((category) => (category.uid === updatedRow.uid ? updatedRow : category));
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
        return updatedCategories;
      });
      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleAddCategory = async (newCategory: Omit<Category, 'uid'>) => {
    try {
      const timestamp = new Date(); // Fecha actual
      const categoryWithDefaults = {
        ...newCategory,
        createdAt: { seconds: Math.floor(timestamp.getTime() / 1000), nanoseconds: (timestamp.getTime() % 1000) * 1000000 }, // Agrega la fecha actual
        isActive: true, // Marca como activa por defecto
      };

      const docRef = await handleAdd('categories', categoryWithDefaults);
      const uid = docRef.id; // Obtener el UID generado por Firebase
      const newCategoryWithUid = { uid, ...categoryWithDefaults } as Category;
      setCategories((prevCategories) => {
        const updatedCategories = [...prevCategories, newCategoryWithUid];
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
        return updatedCategories;
      });

      console.log("Categoría agregada correctamente.");
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al agregar categoría:', error);
    }
  };

  const handleDeleteCategory = async (categoryUid: string) => {
    try {
      await handleDelete("categories", categoryUid);
      setCategories((prevCategories) => {
        const updatedCategories = prevCategories.filter((category) => category.uid !== categoryUid);
        localStorage.setItem("categories", JSON.stringify(updatedCategories));
        return updatedCategories;
      });

      console.log("Categoría eliminada.");
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  const columns = ['name', 'description', 'createdAt', 'isActive', 'photoUrl', 'priority'];
  const columnNames = {
    name: 'Nombre',
    description: 'Descripción',
    createdAt: 'Fecha de Creación',
    isActive: 'Activo',
    photoUrl: 'URL de la Foto',
    priority: 'Prioridad',
  };

  const editableColumns = ['name', 'description', 'isActive', 'photoUrl', 'priority'];

  return (
    <div className="users-container">
      <h1>Categorías</h1>
      <TableReadData<Category>
        columns={columns}
        data={categories}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
      />
      <button 
        className="add-user-button" 
        onClick={() => setIsModalOpen(true)}>
        Agregar Categoría
      </button>
      {isModalOpen && (
        <AddModal
          fields={[
            { key: 'name', label: 'Nombre' },
            { key: 'description', label: 'Descripción' },
            { key: 'isActive', label: 'Activo', type: 'select', options: [{ id: 'true', name: 'True' }, { id: 'false', name: 'False' }] },
            { key: 'photoUrl', label: 'URL de la Foto' },
            { key: 'priority', label: 'Prioridad' },
          ]}
          onSave={(data) => handleAddCategory(data as Omit<Category, 'uid'>)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CategoriesTable;
