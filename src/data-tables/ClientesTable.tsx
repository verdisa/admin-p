import { useEffect, useState } from 'react';
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from '../utils-components/firebaseUtils';
import { Cliente } from '../interfaces/ClienteInterface';
import TableReadData from '../components/TableReadData';
import AddModal from '../components/AddModal';

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const uid = docRef.id; // Obtener el UID generado por Firebase
      const newClienteWithUid = { uid, ...newCliente } as Cliente;
      setClientes((prevClientes) => {
        const updatedClientes = [...prevClientes, newClienteWithUid];
        localStorage.setItem("clientes", JSON.stringify(updatedClientes));
        return updatedClientes;
      });

      console.log("Cliente agregado correctamente.");
      setIsModalOpen(false);
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

  const columns = ['nombre', 'apellidos', 'email', 'telefono', 'rtn', 'contacto', 'direccion', 'companyName', 'cai', 'address', 'contact', 'invoiceNumber', 'date', 'order', 'costumerEnvoiceFileName', 'costumerBusinessName', 'costumerBusinessWithNumber', 'envoiceFooter'];
  const columnNames = {
    nombre: 'Nombre',
    apellidos: 'Apellidos',
    email: 'Correo Electrónico',
    telefono: 'Teléfono',
    rtn: 'RTN',
    contacto: 'Contacto',
    direccion: 'Dirección',
    companyName: 'Nombre Empresa',
    cai: 'CAI',
    address: 'Dirección Empresa',
    contact: 'Contacto Empresa',
    invoiceNumber: 'Número Factura',
    date: 'Fecha Factura',
    order: 'Orden Factura',
    costumerEnvoiceFileName: 'Nombre Factura',
    costumerBusinessName: 'Nombre Negocio',
    costumerBusinessWithNumber: 'Número Negocio',
    envoiceFooter: 'Factura Footer',
  };

  const editableColumns = ['nombre', 'apellidos', 'email', 'telefono', 'rtn', 'contacto', 'direccion', 'companyName', 'cai', 'address', 'contact', 'invoiceNumber', 'date', 'order', 'costumerEnvoiceFileName', 'costumerBusinessName', 'costumerBusinessWithNumber', 'envoiceFooter'];

  return (
    <div className="users-container">
      <h1>Clientes</h1>
      <TableReadData<Cliente>
        columns={columns}
        data={clientes}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveCliente}
        onDelete={handleDeleteCliente}
      />
      <button 
        className="add-user-button" 
        onClick={() => setIsModalOpen(true)}>
        Agregar Cliente
      </button>
      {isModalOpen && (
        <AddModal
          fields={[
            { key: 'nombre', label: 'Nombre' },
            { key: 'apellidos', label: 'Apellidos' },
            { key: 'email', label: 'Correo Electrónico' },
            { key: 'telefono', label: 'Teléfono' },
            { key: 'rtn', label: 'RTN' },
            { key: 'contacto', label: 'Contacto' },
            { key: 'direccion', label: 'Dirección' },
            { key: 'companyName', label: 'Nombre Empresa' },
            { key: 'cai', label: 'CAI' },
            { key: 'address', label: 'Dirección Empresa' },
            { key: 'contact', label: 'Contacto  Empresa' },
            { key: 'costumerEnvoiceFileName', label: 'Nombre Factura' },
            { key: 'costumerBusinessName', label: 'Nombre  Negocio' },
            { key: 'costumerBusinessWithNumber', label: 'Número  Negocio' },
            { key: 'envoiceFooter', label: 'Factura Footer' },
          ]}
          onSave={(data) => handleAddCliente(data as Omit<Cliente, 'uid'>)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Clientes;