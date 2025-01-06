import { useEffect, useState } from 'react';
import { fetchCollectionData, handleAdd, handleSave, handleDelete } from '../utils-components/firebaseUtils';
import { User } from '../interfaces/UserInterface';
import TableReadData from '../components/TableReadData';
import AddModal from '../components/AddModal';

const Users = () => {
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
        const updatedUsers = prevUsers.map((user) => (user.id === updatedRow.id ? updatedRow : user));
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        return updatedUsers;
      });
      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleAddUser = async (newUser: Omit<User, 'id'>) => {
    try {
      await handleAdd('users', newUser);
      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers, { id: Date.now().toString(), ...newUser } as User];
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        return updatedUsers;
      });
      console.log("Usuario agregado correctamente.");
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al agregar usuario:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await handleDelete("users", userId);
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter((user) => user.id !== userId);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        return updatedUsers;
      });
      console.log("Usuario eliminado.");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const columns = ['displayName', 'email', 'phoneNumber', 'photoURL', 'isEmailVerified'];
  const columnNames = {
    displayName: 'Nombre de Usuario',
    email: 'Correo Electrónico',
    phoneNumber: 'Teléfono',
    photoURL: 'Foto',
    isEmailVerified: 'Correo Verificado',
  };

  const editableColumns = ['displayName', 'phoneNumber'];

  return (
    <div className="users-container">
      <h1>Usuarios</h1>
      <TableReadData<User>
        columns={columns}
        data={users}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveUser}
        onDelete={handleDeleteUser}
      />
      <button 
        className="add-user-button" 
        onClick={() => setIsModalOpen(true)}>
        Agregar Usuario
      </button>
      {isModalOpen && (
        <AddModal
          fields={[
            { key: 'displayName', label: 'Nombre de Usuario' },
            { key: 'email', label: 'Correo Electrónico' },
            { key: 'phoneNumber', label: 'Teléfono' },
            { key: 'photoURL', label: 'Foto (URL)' },
          ]}
          onSave={(data) => handleAddUser(data as Omit<User, 'id'>)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Users;
