import { useEffect, useState } from 'react';
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from '../utils-components/firebaseUtils';
import { Producto } from '../interfaces/ProductosInterface';
import TableReadData from '../components/TableReadData';
import AddModal from '../components/AddModal';

const ProductosTable = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const localData = localStorage.getItem("productos");
        if (localData) {
          setProductos(JSON.parse(localData));
          console.log("Datos cargados desde localStorage");
        } else {
          const productosList = await fetchCollectionData('productos');
          setProductos(productosList as Producto[]);
          localStorage.setItem("productos", JSON.stringify(productosList));
          console.log("Datos cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    fetchProductos();

    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Si no hay datos en localStorage, puedes cargarlos desde Firebase
      // y guardarlos en localStorage, tal como se hace con "productos"
    }
  }, []);

  const handleSaveProducto = async (updatedRow: Producto) => {
    try {
      if (updatedRow.IdCategory) {
        const foundCategory = categories.find((cat) => cat.id === updatedRow.IdCategory);
        updatedRow.categoryName = foundCategory ? foundCategory.name : 'Sin categoría';
      }
      await handleSave('productos', updatedRow);
      setProductos((prevProductos) => {
        const updatedProductos = prevProductos.map((producto) => (producto.uid === updatedRow.uid ? updatedRow : producto));
        localStorage.setItem("productos", JSON.stringify(updatedProductos));
        return updatedProductos;
      });
      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleAddProducto = async (newProducto: Omit<Producto, 'uid'>) => {
    try {
      const foundCategory = categories.find((cat) => cat.id === newProducto.IdCategory);
      const categoryName = foundCategory ? foundCategory.name : 'Sin categoría';

      const timestamp = new Date(); // Fecha actual
      const productoWithDefaults = {
        ...newProducto,
        categoryName,
        createdAt: { seconds: Math.floor(timestamp.getTime() / 1000), nanoseconds: (timestamp.getTime() % 1000) * 1000000 }, // Agrega la fecha actual
        isActive: true, // Marca como activo por defecto
      };

      const docRef = await handleAdd('productos', productoWithDefaults);
      const uid = docRef.id; // Obtener el UID generado por Firebase
      const newProductoWithUid = { uid, ...productoWithDefaults } as Producto;
      setProductos((prevProductos) => {
        const updatedProductos = [...prevProductos, newProductoWithUid];
        localStorage.setItem("productos", JSON.stringify(updatedProductos));
        return updatedProductos;
      });

      console.log("Producto agregado correctamente.");
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  const handleDeleteProducto = async (productoUid: string) => {
    try {
      await handleDelete("productos", productoUid);
      setProductos((prevProductos) => {
        const updatedProductos = prevProductos.filter((producto) => producto.uid !== productoUid);
        localStorage.setItem("productos", JSON.stringify(updatedProductos));
        return updatedProductos;
      });

      console.log("Producto eliminado.");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const columns = ['name', 'description', 'price', 'stock', 'categoryName', 'createdAt', 'isActive'];
  const columnNames = {
    name: 'Nombre',
    description: 'Descripción',
    price: 'Precio',
    stock: 'Stock',
    categoryName: 'Categoría',
    createdAt: 'Fecha de Creación',
    isActive: 'Activo',
  };

  const editableColumns = ['name', 'description', 'price', 'stock', 'isActive'];

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
            { key: 'isActive', label: 'Activo', type: 'select', options: ['true', 'false'] },
            {
              key: 'IdCategory',
              label: 'Categoría',
              type: 'select',
              options: categories.map((c) => ({ id: c.id, name: c.name }))
            }
          ]}
          onSave={(data) => handleAddProducto(data as Omit<Producto, 'uid'>)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductosTable;
