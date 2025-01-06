import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProveedoresTable from '../data-tables/ProveedoresTable';

export default function Maquinaria() {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <ProveedoresTable />
      </div>
    </div>
  );
};

