import { useEffect, useState } from 'react';
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from '../utils-components/firebaseUtils';
import { Proveedor } from '../interfaces/ProveedoresInterface';
import TableReadData from '../components/TableReadData';
import AddModal from '../components/AddModal';

const ProveedoresTable = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const uid = docRef.id; // Obtener el ID generado por Firebase
      const newProveedorWithId = { uid, ...newProveedor } as Proveedor;
      setProveedores((prevProveedores) => {
        const updatedProveedores = [...prevProveedores, newProveedorWithId];
        localStorage.setItem("proveedores", JSON.stringify(updatedProveedores));
        return updatedProveedores;
      });

      console.log("Proveedor agregado correctamente.");
      setIsModalOpen(false);
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
            { key: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'] },
          ]}
          onSave={(data) => handleAddProveedor(data as Omit<Proveedor, 'id'>)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProveedoresTable;
