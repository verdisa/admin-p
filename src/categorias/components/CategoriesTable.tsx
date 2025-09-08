import { useState } from 'react';
import { Category } from '../types/CategoryInterface';
import TableReadData from '../../components/TableReadData';
import AddModal from '../../components/AddModal';
import { useCategorias } from '../hooks/useCategorias';

const CategoriesTable = () => {
  const { categories, handleSaveCategory, handleAddCategory, handleDeleteCategory } = useCategorias();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
