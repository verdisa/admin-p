import { useEffect, useState } from 'react';
// Removed Firebase imports, using API instead
import { User } from '../types/UserInterface';

const API_URL = '/api/customers/get-admin';
const JWT = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIrNTA0OTgxODQ0OTYiLCJleHAiOjE3NTc2NTEwOTEsInVzZXJfaWQiOiI2ODU2NTY4ZTAyZWFkNWFmNzMwMWNhOGIifQ.YbVm0-7BsaO82C_7qrwSqncGQq-4XGeXQRIHGJX1Eh7e0WgTPVhGwuhdU5S0gkGzogXGwtcKTkWBeP-zhCuhEko3ZyfFMSeCbC7my6LD06G6k6EIHTFyUtmmKRz0AmQRkAtqsJZBneYbSLVNpRwd_R-2ymwksidGUxiDIg3AiXsVq5P6gjV5R6LKxGQQ6L9VurGu5tZ9LuVHG47LNU-Np3KaTHptVfQyecjFKoXI1rCq-6yVHsSrAf9QuBEZLvHMHCy1slFKzhjCk66v8A5NDmOQ1_lLaO7TbiFBkHpLNHU2Utq3RjsYUbM2VC1wx9TjFppl2U0aBtuPtsHUrghBcA';

interface Customer {
  _id: string;
  email: string;
  name: string;
  dni: string;
  nationality: string;
  address: string;
  status: string;
  birth_date: string;
  dni_front_url: string;
  dni_back_url: string;
  phone_number: string;
  created_at: string;
  updated_at: string | null;
  is_email_verified: boolean;
  is_active: boolean;
  modified_by: string | null;
  photo_url: string | null;
  additional_prop1: string | null;
  user_id: string | null;
}

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
          const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'Authorization': JWT
            }
          });
          const data: Customer[] = await response.json();
          const users = data.map((customer) => ({
            uid: customer._id,
            nombre: customer.name,
            apellidos: '',
            email: customer.email,
            telefono: customer.phone_number,
            username: customer.dni,
            password: '',
            roles: [] as ("admin" | "cajero" | "supervisor" | "visita")[],
            posicion: customer.nationality,
            fechaContratacion: new Date(customer.created_at),
            turnoAsignado: '',
            sucursal: customer.address,
            estado: (customer.is_active ? 'Activo' : 'Inactivo') as "Activo" | "Inactivo" | "Bloqueado",
            salario: '',
            isEmailVerified: customer.is_email_verified,
            dni: customer.dni,
            nationality: customer.nationality,
            address: customer.address,
            status: customer.status,
            birth_date: customer.birth_date,
            dni_front_url: customer.dni_front_url,
            dni_back_url: customer.dni_back_url,
            phone_number: customer.phone_number,
            created_at: customer.created_at,
            updated_at: customer.updated_at,
            is_active: customer.is_active,
            modified_by: customer.modified_by,
            photo_url: customer.photo_url,
            additional_prop1: customer.additional_prop1,
            user_id: customer.user_id
          }));
          setUsers(users);
          localStorage.setItem("users", JSON.stringify(users));
          console.log("Datos cargados desde API y guardados en localStorage");
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSaveUser = async (updatedRow: User) => {
    try {
      await fetch(`${API_URL}/${updatedRow.uid}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Authorization': JWT,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: updatedRow.nombre,
          email: updatedRow.email,
          dni: updatedRow.dni,
          nationality: updatedRow.posicion,
          address: updatedRow.sucursal,
          phone_number: updatedRow.telefono,
          birth_date: updatedRow.birth_date,
          is_email_verified: updatedRow.isEmailVerified,
          is_active: updatedRow.estado === 'Activo'
        })
      });
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => (user.uid === updatedRow.uid ? updatedRow : user));
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        return updatedUsers;
      });
      console.log("Cambios actualizados en local y API.");
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleAddUser = async (newUser: Omit<User, 'uid'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': JWT,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newUser.nombre,
          email: newUser.email,
          dni: newUser.dni,
          nationality: newUser.posicion,
          address: newUser.sucursal,
          phone_number: newUser.telefono,
          birth_date: newUser.birth_date,
          is_email_verified: newUser.isEmailVerified,
          is_active: newUser.estado === 'Activo'
        })
      });
      const data = await response.json();
      const uid = data._id;
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
      await fetch(`${API_URL}/${userUid}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
          'Authorization': JWT
        }
      });
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

  const columns = ['nombre', 'apellidos', 'email', 'telefono', 'username', 'dni', 'roles', 'posicion', 'fechaContratacion', 'birth_date', 'turnoAsignado', 'sucursal', 'estado', 'salario', 'isEmailVerified'];
  const columnNames = {
    nombre: 'Nombre',
    apellidos: 'Apellidos',
    email: 'Correo Electrónico',
    telefono: 'Teléfono',
    username: 'Nombre de Usuario',
    dni: 'DNI',
    roles: 'Roles',
    posicion: 'Posición',
    fechaContratacion: 'Fecha de Contratación',
    birth_date: 'Fecha de Nacimiento',
    turnoAsignado: 'Turno Asignado',
    sucursal: 'Sucursal',
    estado: 'Estado',
    salario: 'Salario',
    isEmailVerified: 'Correo Verificado',
  };
  const editableColumns = ['nombre', 'apellidos', 'telefono', 'dni', 'posicion', 'birth_date', 'turnoAsignado', 'sucursal', 'estado', 'salario'];

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
