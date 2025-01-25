import React from 'react';
import Navbar from '../components/Navbar';
import ClientesTable from '../data-tables/ClientesTable'; // Cambiar UserTable a ClientesTable
import Sidebar from '../components/Sidebar';
import './Usuarios.css'; // Asegúrate de importar el archivo CSS

export default function Clientes() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <ClientesTable />
      </div>
    </div>
  );
}