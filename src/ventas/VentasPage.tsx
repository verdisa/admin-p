import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VentasTable from './components/VentasTable';

const VentasPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="ventas-container">
        <Sidebar />
        <div className="content">
          <h1>Gestión de Ventas</h1>
          <VentasTable />
        </div>
      </div>
    </div>
  );
};

export default VentasPage;
