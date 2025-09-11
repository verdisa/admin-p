import { useEffect, useState } from 'react';
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from '../../utils-components/firebaseUtils';
import { User } from '../types/UserInterface';

export const useUsuarios = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const localData = localStorage.getItem("users");
        if (localData) {
          setUsers(JSON.parse(localData));
          console.log("Datos cargados desde localStorage");
        } else {
          const usersList = await fetchCollectionData('users');
          setUsers(usersList as User[]);
          localStorage.setItem("users", JSON.stringify(usersList));
          console.log("Datos cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSaveUser = async (updatedRow: User) => {
    try {
      await handleSave('users', updatedRow);
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => (user.uid === updatedRow.uid ? updatedRow : user));
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        return updatedUsers;
      });
      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleAddUser = async (newUser: Omit<User, 'uid'>) => {
    try {
      const docRef = await handleAdd('users', newUser);
      const uid = docRef.id; // Obtener el UID generado por Firebase
      const newUserWithUid = { uid, ...newUser } as User;

      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers, newUserWithUid];
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        return updatedUsers;
      });

      console.log("Usuario agregado correctamente.");
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al agregar usuario:', error);
    }
  };

  const handleDeleteUser = async (userUid: string) => {
    try {
      await handleDelete("users", userUid);
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter((user) => user.uid !== userUid);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        return updatedUsers;
      });

      console.log("Usuario eliminado.");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const columns = ['nombre', 'apellidos', 'email', 'telefono', 'username', 'roles', 'posicion', 'fechaContratacion', 'turnoAsignado', 'sucursal', 'estado', 'salario', 'isEmailVerified'];
  const columnNames = {
    nombre: 'Nombre',
    apellidos: 'Apellidos',
    email: 'Correo Electrónico',
    telefono: 'Teléfono',
    username: 'Nombre de Usuario',
    roles: 'Roles',
    posicion: 'Posición',
    fechaContratacion: 'Fecha de Contratación',
    turnoAsignado: 'Turno Asignado',
    sucursal: 'Sucursal',
    estado: 'Estado',
    salario: 'Salario',
    isEmailVerified: 'Correo Verificado',
  };
  const editableColumns = ['nombre', 'apellidos', 'telefono', 'posicion', 'turnoAsignado', 'sucursal', 'estado', 'salario'];

  return {
    users,
    isModalOpen,
    setIsModalOpen,
    handleSaveUser,
    handleAddUser,
    handleDeleteUser,
    columns,
    columnNames,
    editableColumns,
  };
};
