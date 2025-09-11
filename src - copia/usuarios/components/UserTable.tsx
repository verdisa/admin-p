import { useUsuarios } from '../hooks/useUsuarios';
import { User } from '../types/UserInterface';
import TableReadData from '../../components/TableReadData';
import AddModal from '../../components/AddModal';

const Users = () => {
  const {
    users,
    isModalOpen,
    setIsModalOpen,
    handleSaveUser,
    handleAddUser,
    handleDeleteUser,
    columns,
    columnNames,
    editableColumns,
  } = useUsuarios();

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
            { key: 'nombre', label: 'Nombre' },
            { key: 'apellidos', label: 'Apellidos' },
            { key: 'email', label: 'Correo Electrónico' },
            { key: 'telefono', label: 'Teléfono' },
            { key: 'username', label: 'Nombre de Usuario' },
            { key: 'roles', label: 'Roles', type: 'select', options: [{ id: 'admin', name: 'Admin' }, { id: 'cajero', name: 'Cajero' }, { id: 'supervisor', name: 'Supervisor' }, { id: 'visita', name: 'Visita' }] },
            { key: 'posicion', label: 'Posición' },
            { key: 'fechaContratacion', label: 'Fecha de Contratación' },
            { key: 'turnoAsignado', label: 'Turno Asignado' },
            { key: 'sucursal', label: 'Sucursal' },
            { key: 'estado', label: 'Estado', type: 'select', options: [{ id: 'Activo', name: 'Activo' }, { id: 'Inactivo', name: 'Inactivo' }, { id: 'Bloqueado', name: 'Bloqueado' }] },
            { key: 'salario', label: 'Salario' },
            { key: 'isEmailVerified', label: 'Correo Verificado', type: 'select', options: [{ id: 'true', name: 'True' }, { id: 'false', name: 'False' }] },
          ]}
          onSave={(data) => handleAddUser(data as Omit<User, 'uid'>)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Users;