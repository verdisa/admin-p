import React, { useState } from 'react';
import { User } from '../../usuarios/types/UserInterface';
import TableReadData from '../../components/TableReadData';
import AddModal from '../../components/AddModal';
import { useEmpleados } from '../hooks/useEmpleados';

const EmpleadosTable: React.FC = () => {
  const { empleados, handleSaveEmpleado, handleAddEmpleado } = useEmpleados();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="users-container">
      <h1>Empleados</h1>
      <TableReadData<User>
        columns={columns}
        data={empleados}
        columnNames={columnNames}
        editableColumns={editableColumns}
        onSave={handleSaveEmpleado}
      />
      {/*
        Botón para agregar empleado, actualmente comentado para que no aparezca:
      */}
      {/*
      <button
        className="add-user-button"
        onClick={() => setIsModalOpen(true)}>
        Agregar Empleado
      </button>
      */}

      {isModalOpen && (
        <AddModal
          fields={[
            { key: 'nombre', label: 'Nombre' },
            { key: 'apellidos', label: 'Apellidos' },
            { key: 'email', label: 'Correo Electrónico' },
            { key: 'telefono', label: 'Teléfono' },
            { key: 'username', label: 'Nombre de Usuario' },
            { key: 'roles', label: 'Roles', type: 'select', options: [{ id: 'cajero', name: 'Cajero' }, { id: 'supervisor', name: 'Supervisor' }, { id: 'visita', name: 'Visita' }] },
            { key: 'posicion', label: 'Posición' },
            { key: 'fechaContratacion', label: 'Fecha de Contratación' },
            { key: 'turnoAsignado', label: 'Turno Asignado' },
            { key: 'sucursal', label: 'Sucursal' },
            { key: 'estado', label: 'Estado', type: 'select', options: [{ id: 'Activo', name: 'Activo' }, { id: 'Inactivo', name: 'Inactivo' }, { id: 'Bloqueado', name: 'Bloqueado' }] },
            { key: 'salario', label: 'Salario' },
            { key: 'isEmailVerified', label: 'Correo Verificado', type: 'select', options: [{ id: 'true', name: 'True' }, { id: 'false', name: 'False' }] },
          ]}
          onSave={(data) => handleAddEmpleado(data as Omit<User, 'uid'>)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EmpleadosTable;