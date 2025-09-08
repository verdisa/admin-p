import { useState } from 'react';
import { Cliente } from '../types/ClienteInterface';
import TableReadData from '../../components/TableReadData';
import AddModal from '../../components/AddModal';
import { useClientes } from '../hooks/useClientes';

const ClientesTable = () => {
  const { clientes, handleSaveCliente, handleAddCliente, handleDeleteCliente } = useClientes();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = ['nombre', 'apellidos', 'email', 'telefono', 'rtn', 'contacto', 'direccion', 'companyName', 'cai', 'address', 'contact', 'costumerBusinessWithNumber', 'envoiceFooter'];
  const columnNames = {
    nombre: 'Nombre',
    email: 'Correo Electrónico',
    telefono: 'Teléfono',
    rtn: 'RTN',
    contacto: 'Contacto',
    direccion: 'Dirección',
    companyName: 'Nombre Empresa',
    cai: 'CAI',
    address: 'Dirección Empresa',
    contact: 'Contacto Empresa',
    costumerBusinessWithNumber: 'Número Negocio',
    envoiceFooter: 'Factura Footer',
  };

  const editableColumns = ['nombre', 'apellidos', 'email', 'telefono', 'rtn', 'contacto', 'direccion', 'companyName', 'cai', 'address', 'contact', 'costumerBusinessWithNumber', 'envoiceFooter'];

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
            { key: 'email', label: 'Correo Electrónico' },
            { key: 'telefono', label: 'Teléfono' },
            { key: 'rtn', label: 'RTN' },
            { key: 'contacto', label: 'Contacto' },
            { key: 'direccion', label: 'Dirección' },
            { key: 'companyName', label: 'Nombre Empresa' },
            { key: 'cai', label: 'CAI' },
            { key: 'address', label: 'Dirección Empresa' },
            { key: 'contact', label: 'Contacto  Empresa' },
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

export default ClientesTable;