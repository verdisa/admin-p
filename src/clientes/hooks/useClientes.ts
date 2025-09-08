import { useEffect, useState } from 'react';
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from '../../utils-components/firebaseUtils';
import { Cliente } from '../types/ClienteInterface';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const localData = localStorage.getItem("clientes");
        if (localData) {
          setClientes(JSON.parse(localData));
          console.log("Datos cargados desde localStorage");
        } else {
          const clientesList = await fetchCollectionData('clientes');
          setClientes(clientesList as Cliente[]);
          localStorage.setItem("clientes", JSON.stringify(clientesList));
          console.log("Datos cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error('Error fetching clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleSaveCliente = async (updatedRow: Cliente) => {
    try {
      await handleSave('clientes', updatedRow);
      setClientes((prevClientes) => {
        const updatedClientes = prevClientes.map((cliente) => (cliente.uid === updatedRow.uid ? updatedRow : cliente));
        localStorage.setItem("clientes", JSON.stringify(updatedClientes));
        return updatedClientes;
      });
      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleAddCliente = async (newCliente: Omit<Cliente, 'uid'>) => {
    try {
      const docRef = await handleAdd('clientes', newCliente);
      const uid = docRef.id;
      const newClienteWithUid = { uid, ...newCliente } as Cliente;
      setClientes((prevClientes) => {
        const updatedClientes = [...prevClientes, newClienteWithUid];
        localStorage.setItem("clientes", JSON.stringify(updatedClientes));
        return updatedClientes;
      });
      console.log("Cliente agregado correctamente.");
    } catch (error) {
      console.error('Error al agregar cliente:', error);
    }
  };

  const handleDeleteCliente = async (clienteUid: string) => {
    try {
      await handleDelete("clientes", clienteUid);
      setClientes((prevClientes) => {
        const updatedClientes = prevClientes.filter((cliente) => cliente.uid !== clienteUid);
        localStorage.setItem("clientes", JSON.stringify(updatedClientes));
        return updatedClientes;
      });
      console.log("Cliente eliminado.");
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  return {
    clientes,
    handleSaveCliente,
    handleAddCliente,
    handleDeleteCliente,
  };
};
