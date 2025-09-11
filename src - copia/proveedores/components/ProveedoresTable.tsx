import { useState } from 'react';
import { Proveedor } from '../types/ProveedoresInterface';
import TableReadData from '../../components/TableReadData';
import AddModal from '../../components/AddModal';
import { useProveedores } from '../hooks/useProveedores';

const ProveedoresTable = () => {
  const { proveedores, handleSaveProveedor, handleAddProveedor, handleDeleteProveedor } = useProveedores();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = ['nombre', 'direccion', 'telefono', 'email', 'nombreComercial', 'rfcNitTaxId', 'horarioAtencion', 'cuentaBancaria', 'estado', 'fechaRegistro'];
  const columnNames = {
    nombre: 'Nombre',
    direccion: 'Dirección',
    telefono: 'Teléfono',
    email: 'Correo Electrónico',
    nombreComercial: 'Nombre Comercial',
    rfcNitTaxId: 'RFC/NIT/Tax ID',
    horarioAtencion: 'Horario de Atención',
    cuentaBancaria: 'Cuenta Bancaria',
    estado: 'Estado',
    fechaRegistro: 'Fecha de Registro',
  };

  const editableColumns = ['nombre', 'direccion', 'telefono', 'email', 'nombreComercial', 'rfcNitTaxId', 'horarioAtencion', 'cuentaBancaria', 'estado'];

  return (
    <div className="users-container">
      <h1>Proveedores</h1>
      <TableReadData<Proveedor>
        columns={columns}
        data={proveedores}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveProveedor}
        onDelete={handleDeleteProveedor}
      />
      <button 
        className="add-user-button" 
        onClick={() => setIsModalOpen(true)}>
        Agregar Proveedor
      </button>
      {isModalOpen && (
        <AddModal
          fields={[
            { key: 'nombre', label: 'Nombre' },
            { key: 'direccion', label: 'Dirección' },
            { key: 'telefono', label: 'Teléfono' },
            { key: 'email', label: 'Correo Electrónico' },
            { key: 'nombreComercial', label: 'Nombre Comercial' },
            { key: 'rfcNitTaxId', label: 'RFC/NIT/Tax ID' },
            { key: 'horarioAtencion', label: 'Horario de Atención' },
            { key: 'cuentaBancaria', label: 'Cuenta Bancaria' },
            { key: 'estado', label: 'Estado', type: 'select', options: [{ id: 'Activo', name: 'Activo' }, { id: 'Inactivo', name: 'Inactivo' }] },
          ]}
          onSave={(data) => handleAddProveedor(data as Omit<Proveedor, 'uid'>)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProveedoresTable;
