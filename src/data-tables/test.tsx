import { useEffect, useState } from 'react';
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from '../utils-components/firebaseUtils';
import { User } from '../interfaces/UserInterface';
import TableReadData from '../components/TableReadData';
import AddModal from '../components/AddModal';

const Empleados = () => {
  const [empleados, setEmpleados] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const localData = localStorage.getItem("users");
        if (localData) {
          const users = JSON.parse(localData) as User[];
          const empleados = users.filter(user => !user.roles.includes('admin'));
          setEmpleados(empleados);
          console.log("Datos cargados desde localStorage");
        } else {
          const usersList = await fetchCollectionData('users');
          const empleados = (usersList as User[]).filter(user => !user.roles.includes('admin'));
          setEmpleados(empleados);
          localStorage.setItem("users", JSON.stringify(usersList));
          console.log("Datos cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error('Error fetching empleados:', error);
      }
    };

    fetchEmpleados();
  }, []);

  const handleSaveEmpleado = async (updatedRow: User) => {
    try {
      await handleSave('users', updatedRow);
      setEmpleados((prevEmpleados) => {
        const updatedEmpleados = prevEmpleados.map((empleado) => (empleado.uid === updatedRow.uid ? updatedRow : empleado));
        localStorage.setItem("users", JSON.stringify(updatedEmpleados));
        return updatedEmpleados;
      });
      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleAddEmpleado = async (newEmpleado: Omit<User, 'uid'>) => {
    try {
      const docRef = await handleAdd('users', newEmpleado);
      const uid = docRef.id; // Obtener el UID generado por Firebase
      const newEmpleadoWithUid = { uid, ...newEmpleado } as User;
      setEmpleados((prevEmpleados) => {
        const updatedEmpleados = [...prevEmpleados, newEmpleadoWithUid];
        localStorage.setItem("users", JSON.stringify(updatedEmpleados));
        return updatedEmpleados;
      });

      console.log("Empleado agregado correctamente.");
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al agregar empleado:', error);
    }
  };

  const handleDeleteEmpleado = async (empleadoUid: string) => {
    try {
      await handleDelete("users", empleadoUid);
      setEmpleados((prevEmpleados) => {
        const updatedEmpleados = prevEmpleados.filter((empleado) => empleado.uid !== empleadoUid);
        localStorage.setItem("users", JSON.stringify(updatedEmpleados));
        return updatedEmpleados;
      });

      console.log("Empleado eliminado.");
    } catch (error) {
      console.error("Error al eliminar el empleado:", error);
    }
  };

  const columns = ['nombre', 'apellidos', 'email', 'telefono', 'roles', 'posicion', 'fechaContratacion', 'turnoAsignado', 'sucursal', 'estado', 'photoURL'];
  const columnNames = {
    nombre: 'Nombre',
    apellidos: 'Apellidos',
    email: 'Correo Electrónico',
    telefono: 'Teléfono',
    roles: 'Roles',
    posicion: 'Posición',
    fechaContratacion: 'Fecha de Contratación',
    turnoAsignado: 'Turno Asignado',
    sucursal: 'Sucursal',
    estado: 'Estado',
    photoURL: 'Foto',
  };

  const editableColumns = ['nombre', 'apellidos', 'telefono', 'posicion', 'turnoAsignado', 'sucursal', 'estado'];

  return (
    <div className="users-container">
      <h1>Empleados</h1>
      <TableReadData<User>
        columns={columns}
        data={empleados}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveEmpleado}
        onDelete={handleDeleteEmpleado}
      />
      <button 
        className="add-user-button" 
        onClick={() => setIsModalOpen(true)}>
        Agregar Empleado
      </button>
      {isModalOpen && (
        <AddModal
          fields={[
            { key: 'nombre', label: 'Nombre' },
            { key: 'apellidos', label: 'Apellidos' },
            { key: 'email', label: 'Correo Electrónico' },
            { key: 'telefono', label: 'Teléfono' },
            { key: 'roles', label: 'Roles', type: 'select', options: ['cajero', 'supervisor', 'visita'] },
            { key: 'posicion', label: 'Posición' },
            { key: 'fechaContratacion', label: 'Fecha de Contratación' },
            { key: 'turnoAsignado', label: 'Turno Asignado' },
            { key: 'sucursal', label: 'Sucursal' },
            { key: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo', 'Bloqueado'] },
            { key: 'photoURL', label: 'Foto (URL)' },
          ]}
          onSave={(data) => handleAddEmpleado(data as Omit<User, 'uid'>)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Empleados;
