import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProveedoresTable from '../data-tables/ProveedoresTable';
import './Comun.css'; // Asegúrate de importar el archivo CSS

export default function Proveedores() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <ProveedoresTable />
      </div>
    </div>
  );
}

