import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import EmpleadosTable from '../data-tables/EmpleadosTable';
import './Usuarios.css'; // Asegúrate de importar el archivo CSS

export default function Empleados() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <EmpleadosTable />
      </div>
    </div>
  );
}
