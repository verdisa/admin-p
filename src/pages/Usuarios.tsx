import React from 'react';
import Navbar from '../components/Navbar';
import UserTable from '../data-tables/UserTable';
import Sidebar from '../components/Sidebar';
import './Usuarios.css'; // Asegúrate de importar el archivo CSS

export default function Usuarios() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <UserTable />
      </div>
    </div>
  );
}