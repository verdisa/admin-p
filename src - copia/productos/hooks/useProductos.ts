import { useEffect, useState } from 'react';
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from '../../utils-components/firebaseUtils';
import { Producto } from '../types/ProductosInterface';

export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
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
        const foundCategory = categories.find((cat) => cat.uid === updatedRow.IdCategory);
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
      const foundCategory = categories.find((cat) => cat.uid === newProducto.IdCategory);
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

  return {
    productos,
    categories,
    handleSaveProducto,
    handleAddProducto,
    handleDeleteProducto,
  };
};
