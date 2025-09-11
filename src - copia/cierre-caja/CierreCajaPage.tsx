import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CierreCajaTable from './components/CierreCajaTable';
import '../pages/Comun.css'; // Importar estilos del layout principal

const CierreCajaPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="usuarios-container">
        <Sidebar />
        <div className="content">
          <h1>Gestión de Cierre de Caja</h1>
          <CierreCajaTable />
        </div>
      </div>
    </div>
  );
};

export default CierreCajaPage;
