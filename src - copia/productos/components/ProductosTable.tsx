import { useState } from 'react';
import { Producto } from '../types/ProductosInterface';
import TableReadData from '../../components/TableReadData';
import AddModal from '../../components/AddModal';
import { useProductos } from '../hooks/useProductos';

const ProductosTable = () => {
  const { productos, categories, handleSaveProducto, handleAddProducto, handleDeleteProducto } = useProductos();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = ['name', 'description', 'price', 'stock', 'categoryName', 'type', 'createdAt', 'isActive'];
  const columnNames = {
    name: 'Nombre',
    description: 'Descripción',
    price: 'Precio',
    stock: 'Stock',
    categoryName: 'Categoría',
    type: 'Tipo',
    createdAt: 'Fecha de Creación',
    isActive: 'Activo',
  };

  const editableColumns = ['name', 'description', 'price', 'stock', 'type', 'isActive'];

  const handleAddModalSave = (data: any) => {
    const categories = JSON.parse(localStorage.getItem("categories") || "[]");
    const found = categories.find((cat: { uid: string; name: string }) => cat.uid === data.IdCategory);
    if (found) {
      data.IdCategory = found.uid;
      data.categoryName = found.name;
    }

    // Validar que price y stock sean números
    if (isNaN(data.price) || isNaN(data.stock)) {
      alert("El precio y el stock deben ser números.");
      return;
    }

    handleAddProducto(data as Omit<Producto, 'uid'>);
  };

  return (
    <div className="users-container">
      <h1>Productos</h1>
      <TableReadData<Producto>
        columns={columns}
        data={productos}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveProducto}
        onDelete={handleDeleteProducto}
      />
      <button 
        className="add-user-button" 
        onClick={() => setIsModalOpen(true)}>
        Agregar Producto
      </button>
      {isModalOpen && (
        <AddModal
          fields={[
            { key: 'name', label: 'Nombre' },
            { key: 'description', label: 'Descripción' },
            { key: 'price', label: 'Precio' },
            { key: 'stock', label: 'Stock' },
            { key: 'type', label: 'Tipo', type: 'select', options: [
              { id: 'gravable', name: 'Gravable 15%' },
              { id: 'gravable2', name: 'Gravable 18%' },
              { id: 'exento', name: 'Exento' },
              { id: 'exonerado', name: 'Exonerado' }
            ]},
            { key: 'isActive', label: 'Activo', type: 'select', options: [{ id: 'true', name: 'Sí' }, { id: 'false', name: 'No' }] },
            {
              key: 'IdCategory',
              label: 'Categoría',
              type: 'select',
              options: categories.map((c) => ({ id: c.uid, name: c.name }))
            }
          ]}
          onSave={handleAddModalSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductosTable;