import { useEffect, useState } from 'react';
import { fetchCollectionData, handleAdd, handleSave } from '../../utils-components/firebaseUtils';
import { User } from '../../usuarios/types/UserInterface';

export const useEmpleados = () => {
  const [empleados, setEmpleados] = useState<User[]>([]);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const localData = localStorage.getItem("users");
        if (localData) {
          const users = JSON.parse(localData) as User[];
          const filteredUsers = users.filter(user => !user.roles.includes('admin'));
          setEmpleados(filteredUsers);
          console.log("Datos cargados desde localStorage");
        } else {
          const usersList = await fetchCollectionData('users');
          const filteredUsers = (usersList as User[]).filter(user => !user.roles.includes('admin'));
          setEmpleados(filteredUsers);
          localStorage.setItem("users", JSON.stringify(usersList));
          console.log("Datos cargados desde Firebase y guardados en localStorage");
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchEmpleados();
  }, []);

  const handleSaveEmpleado = async (updatedRow: User) => {
    try {
      await handleSave('users', updatedRow);
      setEmpleados((prevEmpleados) => {
        const updatedEmpleados = prevEmpleados.map((empleado) => (empleado.uid === updatedRow.uid ? updatedRow : empleado));
        // Update localStorage with all users (including admins)
        const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const updatedAllUsers = allUsers.map((user: User) => (user.uid === updatedRow.uid ? updatedRow : user));
        localStorage.setItem("users", JSON.stringify(updatedAllUsers));
        return updatedEmpleados.filter(user => !user.roles.includes('admin'));
      });
      console.log("Cambios actualizados en local y Firebase.");
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleAddEmpleado = async (newEmpleado: Omit<User, 'uid'>) => {
    try {
      const docRef = await handleAdd('users', newEmpleado);
      const uid = docRef.id;
      const newEmpleadoWithUid = { uid, ...newEmpleado } as User;
      setEmpleados((prevEmpleados) => {
        const updatedEmpleados = [...prevEmpleados, newEmpleadoWithUid];
        // Update localStorage with all users (including admins)
        const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const updatedAllUsers = [...allUsers, newEmpleadoWithUid];
        localStorage.setItem("users", JSON.stringify(updatedAllUsers));
        return updatedEmpleados.filter(user => !user.roles.includes('admin'));
      });
      console.log("Empleado agregado correctamente.");
    } catch (error) {
      console.error('Error al agregar empleado:', error);
    }
  };

  return {
    empleados,
    handleSaveEmpleado,
    handleAddEmpleado,
  };
};
