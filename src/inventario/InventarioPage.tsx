import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import InventoryTable from './components/InventoryTable';
import '../pages/Comun.css'; // Importar estilos del layout principal
import './styles/InventarioPage.css';

const InventarioPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="inventory-container">
        <Sidebar />
        <div className="content">
          <h1>Gestión de Inventario</h1>
          <InventoryTable />
        </div>
      </div>
    </div>
  );
};

export default InventarioPage;
