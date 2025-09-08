import { useEffect, useState } from 'react';
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from '../../utils-components/firebaseUtils';
import { Proveedor } from '../types/ProveedoresInterface';

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const localData = localStorage.getItem("proveedores");
        if (localData) {
          setProveedores(JSON.parse(localData));
          console.log("Datos cargados desde localStorage");
        } else {
          const proveedoresList = await fetchCollectionData('proveedores');
          setProveedores(proveedoresList as Proveedor[]);
          localStorage.setItem("proveedores", JSON.stringify(proveedoresList));
          console.log("Datos cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error('Error fetching proveedores:', error);
      }
    };

    fetchProveedores();
  }, []);

  const handleSaveProveedor = async (updatedRow: Proveedor) => {
    try {
      await handleSave('proveedores', updatedRow);
      setProveedores((prevProveedores) => {
        const updatedProveedores = prevProveedores.map((proveedor) => (proveedor.uid === updatedRow.uid ? updatedRow : proveedor));
        localStorage.setItem("proveedores", JSON.stringify(updatedProveedores));
        return updatedProveedores;
      });
      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleAddProveedor = async (newProveedor: Omit<Proveedor, 'uid'>) => {
    try {
      const docRef = await handleAdd('proveedores', newProveedor);
      const uid = docRef.id;
      const newProveedorWithId = { uid, ...newProveedor } as Proveedor;
      setProveedores((prevProveedores) => {
        const updatedProveedores = [...prevProveedores, newProveedorWithId];
        localStorage.setItem("proveedores", JSON.stringify(updatedProveedores));
        return updatedProveedores;
      });
      console.log("Proveedor agregado correctamente.");
    } catch (error) {
      console.error('Error al agregar proveedor:', error);
    }
  };

  const handleDeleteProveedor = async (proveedorUid: string) => {
    try {
      await handleDelete("proveedores", proveedorUid);
      setProveedores((prevProveedores) => {
        const updatedProveedores = prevProveedores.filter((proveedor) => proveedor.uid !== proveedorUid);
        localStorage.setItem("proveedores", JSON.stringify(updatedProveedores));
        return updatedProveedores;
      });
      console.log("Proveedor eliminado.");
    } catch (error) {
      console.error("Error al eliminar el proveedor:", error);
    }
  };

  return {
    proveedores,
    handleSaveProveedor,
    handleAddProveedor,
    handleDeleteProveedor,
  };
};
